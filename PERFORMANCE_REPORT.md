# Performance Report — ERP Knowledge & Learning Tracker

This documents the actual before/after of the performance pass, the
`i18n` + RTL system, and the dynamic Category management feature. Nothing
below is a UI-only change — everything here changes what runs on the
Google Apps Script side per request.

---

## 1. What was actually causing the slowness

Google Sheets is not a database with indexes or a query planner — every
"read" from `SpreadsheetApp` is a network round trip to the Sheets backend.
The old code made far more of those round trips than it needed to, on
**every single request**:

1. **Auth on every request** (`withAuth`) did three separate Sheets reads
   before any real work started: a full scan of `Sessions` to validate the
   token, a full scan of `Users` to load the user, and a write back to
   `Sessions.last_activity`.
2. **Every write action** (and, in the very first version, every action —
   including reads) acquired `LockService.getScriptLock()`. That serializes
   requests: if the frontend fired two calls in parallel (e.g. topics +
   categories on the module page), the second one sat and waited for the
   first to finish instead of actually running concurrently.
3. **Headers were re-read from row 1** of every sheet on every
   `readAllRows()` / `appendRow()` / `updateRow()` call.
4. **Modules and Categories** (near-static reference data) were read fresh
   from Sheets on every dashboard/module/analytics call, even though they
   almost never change.
5. **Login/Signup** scanned the entire `Users` sheet to check
   username/email uniqueness and to find the matching row.
6. **Seeding** (`Modules` + ~150 `Categories` rows) used ~150 individual
   `appendRow()` calls — 150 separate writes instead of one.
7. **Frontend**: the module page fetched `topics` and `categories`
   separately on every visit; `Profile` fetched `currentUser` and
   `dashboard` as two separate round trips; nothing was cached client-side,
   so a page refresh re-fetched Modules/Categories every time even though
   that data is effectively static.

---

## 2. Google Sheets calls, before vs. after

"Call" = one `SpreadsheetApp`/`Range` read or write — the expensive unit.

| Action | Before | After |
|---|---|---|
| Any authenticated request (auth check only) | 3 calls (scan Sessions, scan Users, write last_activity) | **0 calls** on a warm session (CacheService hit) |
| `dashboard` | Auth (3) + Modules (1) + Topics (1) = **5** | Auth (0, cached) + Modules (0, cached) + Topics (1) = **1** |
| `analytics` | Auth (3) + Modules (1) + Topics (1) + Reviews (1) = **6** | Auth (0) + Modules (0) + Topics (1, reused for every derived stat) + Reviews (1) = **2** |
| Module page load (`topics` + `categories`) | Auth×2 (6) + Topics (1) + Categories (1) = **8**, and serialized by the lock | Auth (0) + Topics (1). Categories come from the client-side reference cache — **0 extra Sheets calls, 1 total**, and it runs in parallel with nothing to wait on since reads no longer lock |
| `login` | Auth n/a + scan Users (1) + write last_login (1) = **2**, plus the equivalent signup-side scan on every signup | Index lookup (0, cached) + `getUserCached` (0 on warm cache) + write last_login (1) = **1** |
| `createTopic` / `updateStatus` / etc. | Auth (3) + find topic via full scan (1) + write (1) = **5** | Auth (0) + topic already resolved from the per-request Topics cache (0) + write (1) = **1** |
| Seed Modules + Categories (~160 rows) | 160 individual `appendRow()` calls | **2** `setValues()` calls total (one batch per sheet) |
| `deleteCategory` (usage check) | n/a (didn't exist) | Auth (0) + Categories (0, cached) + Topics (1, reused if already read this request) = **≤1** |

---

## 3. Caching that was added

Three layers, cheapest first:

1. **Request-scoped memoization** (`REQ`, reset at the top of every
   `handleRequest`): the Spreadsheet handle, every sheet's header row, and
   full reads of Topics/Modules/Categories are read **at most once per
   request** no matter how many `getXByY()` helpers touch them afterward.
2. **CacheService** (shared across requests, 6-hour TTL where safe):
   - Sheet **headers** per sheet name.
   - **Sessions**: `token → session row`. A valid, cached session costs
     zero Sheets calls to validate.
   - **Users**: `id → user row` (30 min TTL) plus a `username/email → id`
     index, so login/signup uniqueness checks and lookups don't scan the
     whole sheet.
   - **Modules** and **Categories**: full table, invalidated immediately
     on any category create/update/delete/toggle.
3. **Frontend `localStorage` cache** for Modules + Categories (12h TTL,
   `js/app.js:loadReferenceData()`), so a browser refresh doesn't even hit
   the API for this reference data until it goes stale or a category is
   edited (which explicitly invalidates it).

Every mutation explicitly invalidates the caches it affects — there is no
window where the app can serve stale data after an edit; the module page
re-renders immediately from a fresh fetch.

---

## 4. Locking — read/write split

Only actions that mutate a sheet acquire `LockService.getScriptLock()`
now (`WRITE_ACTIONS` in `Code.gs`). Every read action (`dashboard`,
`topics`, `categories`, `analytics`, …) runs lock-free, so requests the
frontend fires in parallel actually execute in parallel instead of
queuing behind each other.

---

## 5. API requests reduced on the frontend

- **Module page**: was `topics` + `categories` (2 calls, previously
  serialized by the lock). Now: `topics` only — Categories comes from the
  in-memory/localStorage reference cache. **1 call.**
- **Profile page**: was `currentUser` + `dashboard` (2 calls). Now:
  `dashboard` alone (it already returns the user). **1 call.**
- **App boot**: Modules + Categories are fetched once per browser session
  (or once per 12h if the localStorage cache is warm), not once per page
  view.
- **Client-side request de-duplication** (`js/api.js`): if the exact same
  read action + payload is already in flight (e.g. a double-click, or two
  components asking for the same thing), callers share one Promise instead
  of firing a second identical request.
- **Response size**: Dashboard/Analytics/Topic-detail responses only
  return the fields each view actually renders (this was already true of
  the original design and was kept — `stripRow()` strips the internal
  `__row` bookkeeping field from every response).

---

## 6. Data access layer

`Code.gs` now exposes named, composable accessors instead of ad-hoc
`readAllRows().filter().find()` chains scattered through the action
handlers:

```
getTopicsRows()           // reads Topics ONCE per request, memoized
getTopicsByUser(userId)
getTopicsByModule(topics, moduleId)
getTopicsByStatus(topics, status)
getTopicsByPriority(topics, priority)
getTopicById(id)
getModulesRows()          // cross-request cached
getCategoriesRows()       // cross-request cached
getCategoryById(id)
getUserCached(id)         // cross-request cached
getUsersIndex()           // username/email -> id, cross-request cached
```

`updateRowByObj()` / `deleteRowByObj()` operate on a row object the caller
already has (from one of the accessors above), instead of re-scanning the
sheet to find it a second time — this is what makes `updateStatus`,
`updateProgress`, `deleteTopic`, and the new category mutations single-read
operations.

---

## 7. Batch writes

`appendRowsBatch()` replaces per-row `appendRow()` loops for bulk inserts.
Seeding all 10 Modules and ~150 Categories now does exactly 2 `setValues()`
calls (one per sheet) instead of ~160 separate append operations.

---

## 8. Safe schema migration (no data loss)

`Categories` gained `description`, `created_at`, `updated_at`; `Users`
gained `language`. `ensureSchema()` runs the migration **at most once**
per deployment (guarded by a `SCHEMA_VERSION` Script Property):

- On a **fresh** spreadsheet, `createSheetsIfMissing()` already writes the
  full, current schema — no migration needed.
- On an **existing** spreadsheet from an earlier version, missing columns
  are appended (never removed, never reordered) and backfilled with safe
  defaults (`language: 'en'`, blank strings) for every existing row — all
  existing Users/Categories/Topics/Knowledge/Reviews data is preserved.
- After the one-time migration, every subsequent request's schema check is
  a single `PropertiesService` read (local, not a network call) — not a
  Sheets call.

---

## 9. New: Category Management

- `Categories` sheet: `id, module_id, name_ar, name_en, description,
  active, created_at, updated_at`.
- New API actions: `createCategory`, `updateCategory`, `deleteCategory`,
  `toggleCategoryStatus` (all Admin-only — Categories are shared reference
  data across every user, like Modules, so mutation is restricted the same
  way Administration already is).
- `deleteCategory` checks — in the same request, reusing whatever Topics
  read already happened — whether any topic (from any user) still
  references that category, and refuses with `CATEGORY_HAS_TOPICS` if so,
  suggesting deactivation instead.
- Every mutation invalidates the Categories cache (CacheService +
  frontend localStorage) and the module view re-renders immediately from
  a fresh fetch — no full page reload.

---

## 10. New: Arabic + RTL

- `js/i18n.js`: a single centralized dictionary (`en`/`ar`) covering
  every namespace used across the app — nav, dashboard, modules, tables,
  statuses/priorities, forms, topic detail tabs, reviews, analytics,
  profile, admin, categories, empty states, toasts, and **API error
  codes** (the backend returns a stable `code` like `CATEGORY_HAS_TOPICS`
  or `SESSION_EXPIRED`; the frontend maps it to a localized string via
  `I18n.errorMessage()`, so validation/error messages are translated too,
  not just static labels).
- Switching language flips `dir="rtl"/"ltr"` on `<html>`/`<body>`,
  re-renders the current view, and (if logged in) persists the choice to
  `User.language` via `updateProfile` — matching what the spec asked for
  ("load the user's language automatically on login").
- The stylesheet was already built almost entirely on CSS logical
  properties (`margin-inline-start`, `inset-inline-start`,
  `text-align:start`, etc.) rather than `left`/`right`/`margin-left`, so
  the RTL flip required no structural rework — verified there are zero
  physical-direction properties left in `css/style.css`. Arabic text uses
  the `Cairo` webfont for proper glyph shaping instead of the Latin
  display fonts.
- Module/Category names are stored bilingually already (`name_en`/
  `name_ar`); `I18n.localizedName()` picks the right one based on the
  active language everywhere they're displayed (sidebar, dropdowns,
  tables, cards).

---

## 11. Known scaling ceiling (by design of this stack)

`Topics`/`Reviews` reads are still full-sheet reads filtered in memory,
because Google Sheets has no server-side query/filter API cheap enough to
call from Apps Script per request. This is fine at the scale this app is
built for (a personal/small-team knowledge tracker), but if the `Topics`
sheet grows into the tens of thousands of rows across many users, the
next step would be moving off Sheets to a real database — that's outside
the GitHub Pages + Apps Script + Sheets architecture this project is
built on, and wasn't part of this pass.
