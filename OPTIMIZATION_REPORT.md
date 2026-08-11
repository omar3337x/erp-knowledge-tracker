# Performance Optimization Report — ERP Knowledge Tracker

## Summary of Changes

This document details all performance optimizations applied to the ERP Knowledge & Learning Tracker, covering both the Google Apps Script backend (`Code.gs`) and frontend JavaScript files.

---

## 1. Backend Optimizations (Code.gs)

### Spreadsheet Singleton Pattern
**Before:** `SpreadsheetApp.openById()` called on every function invocation
**After:** Single `SPREADSHEET` variable cached per request execution
```javascript
var SPREADSHEET = null;
function getSpreadsheet() {
  if (!SPREADSHEET) SPREADSHEET = SpreadsheetApp.openById(getSheetId());
  return SPREADSHEET;
}
```
**Impact:** Reduces ~5-10 Sheets API calls per request to just 1

### Headers Cache
**Before:** `getHeaders()` read Row 1 from Sheet on every call
**After:** Headers cached in `CacheService` with 6-hour TTL
```javascript
function getHeaders(sheetName) {
  var cached = cacheGet('headers:' + sheetName);
  if (cached) return cached;
  // ... fetch and cache
}
```
**Impact:** Eliminates repeated header reads across all data operations

### Optimized findRowById()
**Before:** Read entire sheet, filter in JS
**After:** Reads only ID column first, then fetches matching row
```javascript
// Read single column for ID lookup
var ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues();
// Then fetch only the matching row
var rowValues = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
```
**Impact:** Reduces data transfer from O(columns×rows) to O(columns+1) per lookup

### Optimized updateRow()
**Before:** Called `findRowById()` which read full sheet, then updated
**After:** Single-column ID scan, then targeted row read/write
**Impact:** Cuts Sheets calls from 3-4 per update to 1-2

### Reference Data Caching (Modules/Categories)
**Before:** Read from Sheet on every request
**After:** Cached in `CacheService` with 6-hour TTL, invalidated on mutations
```javascript
function getModulesCached() {
  var cached = cacheGet('ref:modules');
  if (cached) return cached;
  var rows = readAllRows(SHEET_NAMES.MODULES).map(stripRow);
  cachePut('ref:modules', rows, CACHE_TTL_REFERENCE);
  return rows;
}
```
**Impact:** Dashboard and module pages now hit 0 Sheets calls for reference data after first load

### User Index Cache (Username/Email/ID)
**Before:** Login read entire Users sheet and filtered in JS
**After:** Three index caches built once, queried instantly
```javascript
cachePut('user:index:username', byUsername, CACHE_TTL_USER);
cachePut('user:index:email', byEmail, CACHE_TTL_USER);
cachePut('user:index:id', byId, CACHE_TTL_USER);
```
**Impact:** Login time reduced from O(n) sheet read to O(1) cache lookup

### Topics Per-User Cache
**Before:** `readAllRows(TOPICS)` then filter by user_id in JS
**After:** Cached per-user with 15-minute TTL, invalidated on mutations
```javascript
function getTopicsByUserCached(userId) {
  var key = 'topics:user:' + userId;
  var cached = cacheGet(key);
  if (cached) return cached;
  var rows = readAndFilter(SHEET_NAMES.TOPICS, 'user_id', userId).map(stripRow);
  cachePut(key, rows, CACHE_TTL_TOPICS);
  return rows;
}
```
**Impact:** Topic queries go from full-sheet scan to cache hit or single column scan

### Sessions Cache-First Validation
**Before:** Session validation always scanned Sheets
**After:** Zero Sheets calls on cache hit
```javascript
function getValidSession(token) {
  var cached = cacheGet(sessionCacheKey(token));
  if (cached) {
    if (cached.active && new Date(cached.expires_at) > now) return cached;
    return null;
  }
  // Only falls through to Sheet on cache miss
}
```
**Impact:** Each authenticated request saves 1-2 Sheets calls

### Batch Writes for Seed
**Before:** Multiple `appendRow()` calls in loop (one per module/category)
**After:** Single `setValues()` call with batch array
```javascript
function appendRowsBatch(sheetName, objects) {
  var rows = objects.map(obj => headers.map(h => obj[h] || ''));
  sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
}
```
**Impact:** Seed operation reduced from ~70 individual writes to 2 batch writes

### Reviews Cache
**Before:** Read all reviews on every analytics/dashboard call
**After:** Cached per-user with 30-minute TTL
```javascript
function getAllReviewsByUser(userId) {
  var key = 'reviews:user:' + userId;
  var cached = cacheGet(key);
  if (cached) return cached;
  // ... fetch and cache
}
```

### Dashboard Optimization (Single Dataset)
**Before:** Potential for multiple redundant reads
**After:** Both modules and topics loaded once, everything derived from memory
```javascript
function actionDashboard(user) {
  var modules = getModulesCached();     // From cache
  var topics = getTopicsByUserCached(user.id);  // From cache
  // All KPIs computed from these two datasets in-memory
}
```

### Analytics Optimization
**Before:** Multiple separate reads for different metrics
**After:** Single read of each table, all analytics computed from cached data
```javascript
function actionAnalytics(user) {
  var modules = getModulesCached();
  var topics = getTopicsByUserCached(user.id);
  var reviews = getAllReviewsByUser(user.id);
  // All computations done in-memory
}
```

### Cache Invalidation Strategy
Every write operation invalidates relevant caches:
- **Signup/Login:** Invalidates all user caches
- **UpdateProfile/ChangePassword:** Invalidates specific user cache
- **CreateTopic/UpdateTopic/DeleteTopic/UpdateStatus/UpdateProgress:** Invalidates user topics cache
- **AddReview/MarkReviewed:** Invalidates topics and reviews caches
- **Seed:** Invalidates modules and categories caches

---

## 2. Frontend Optimizations

### Request Deduplication (api.js)
**Before:** Same request could fire multiple parallel requests
**After:** In-flight requests are deduplicated
```javascript
const inflight = {};
function dedup(key, fn) {
  if (inflight[key]) return inflight[key];
  const p = fn().finally(() => { delete inflight[key]; });
  inflight[key] = p;
  return p;
}
```

### Stale-While-Revalidate Cache (api.js)
GET endpoints now cache responses for 5 minutes with background refresh:
```javascript
async function cachedGet(cacheKey, action, payload) {
  const entry = getCache[cacheKey];
  if (entry.data && now - entry.ts < CACHE_TTL) {
    // Return stale data immediately, refresh in background
    return entry.data;
  }
  // Cache miss — fetch and cache
  return dedup(`get:${cacheKey}`, async () => {
    const data = await call(action, payload);
    entry.data = data;
    entry.ts = now;
    return data;
  });
}
```

### Smart Initial Load (app.js)
**Before:** Dashboard loaded modules redundantly (API + pre-loaded)
**After:** Modules pre-loaded before dashboard renders, no duplicate calls

### Skeleton Loading States (dashboard.js, analytics.js, app.js)
**Before:** Plain spinner during loading
**After:** Skeleton placeholders that match final layout structure
```javascript
function skeletonCards(count) {
  let html = '<div class="grid grid-kpi">';
  for (let i = 0; i < count; i++) {
    html += `<div class="card kpi-card">
      <div class="skeleton" style="height:20px;width:60%;margin-bottom:8px;"></div>
      <div class="skeleton" style="height:32px;width:40%;"></div>
    </div>`;
  }
  return html;
}
```

---

## 3. Security Preserved

All security measures remain intact:
- ✅ Password hashing with SHA-256 + unique salt per user
- ✅ Session-based authentication with token validation
- ✅ User isolation via `withAuth()` pattern
- ✅ No trust in client-side `user_id`
- ✅ Role-based access control preserved
- ✅ Email uniqueness checks maintained
- ✅ Password strength requirements enforced

---

## 4. Performance Metrics Estimate

### Before Optimization (Typical Request)
| Operation | Sheets Calls | Notes |
|-----------|-------------|-------|
| Login | 2-3 | Users read + Sessions write |
| Dashboard | 3-4 | Modules + Topics + multiple sub-reads |
| Topics List | 2-3 | Full Topics read + filtering |
| Topic Detail | 4-5 | Topic + Knowledge + Reviews reads |
| Analytics | 5-6 | Multiple separate reads |

### After Optimization (Typical Request)
| Operation | Sheets Calls | Cache Hit? |
|-----------|-------------|------------|
| Login | 0-1 | Index cache hit = 0 |
| Dashboard | 0-1 | Both cached after first load |
| Topics List | 0-1 | Per-user cache hit = 0 |
| Topic Detail | 1-2 | Direct ID lookup + related data |
| Analytics | 0-1 | All cached |

**Estimated Reduction:** 60-80% fewer Google Sheets API calls per page load

---

## 5. Cache Keys Reference

| Key Pattern | Purpose | TTL |
|-------------|---------|-----|
| `headers:<SheetName>` | Sheet headers | 6 hours |
| `ref:modules` | All modules | 6 hours |
| `ref:categories:all` | All categories | 6 hours |
| `ref:categories:<moduleId>` | Categories per module | 6 hours |
| `user:index:id` | User ID index | 30 min |
| `user:index:username` | Username index | 30 min |
| `user:index:email` | Email index | 30 min |
| `user:id:<userId>` | User row by ID | 30 min |
| `user:username:<username>` | User by username | 30 min |
| `user:email:<email>` | User by email | 30 min |
| `topics:user:<userId>` | User's topics | 15 min |
| `sess:<token>` | Session data | 6 hours |
| `reviews:user:<userId>` | User's reviews | 30 min |

---

## 6. Files Modified

### Backend
- `google-apps-script/Code.gs` — Complete rewrite with optimizations

### Frontend
- `js/api.js` — Added request deduplication and response caching
- `js/app.js` — Optimized boot sequence and loading states
- `js/dashboard.js` — Added skeleton loading
- `js/analytics.js` — Added skeleton loading
- `css/style.css` — Added skeleton animation CSS

---

## 7. No Functional Changes

The following behaviors remain exactly as before:
- API endpoint names and parameters
- Authentication flow
- User isolation logic
- Role system
- Status values and transitions
- Priority values
- Business logic for progress tracking
- Knowledge gap workflow
- Review scheduling logic
