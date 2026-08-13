/**
 * ERP Knowledge & Learning Tracker — Backend
 * Google Apps Script Web App API backed by Google Sheets.
 *
 * Deploy as Web App:
 *   Execute as:  Me
 *   Who has access: Anyone
 *
 * All state lives in the Google Sheet referenced by Script Property SHEET_ID.
 * No secrets are ever sent to the frontend.
 *
 * ---------------------------------------------------------------------------
 * PERFORMANCE ARCHITECTURE (read this before touching the data layer)
 * ---------------------------------------------------------------------------
 * Three layers of caching, from cheapest to most expensive:
 *
 *   1. REQUEST cache (var REQ, reset at the top of every handleRequest call).
 *      Holds the Spreadsheet handle, per-sheet handles, per-sheet headers,
 *      and full-table reads for Topics/Modules/Categories/Users that are
 *      needed more than once inside a single request. This guarantees each
 *      sheet is read from Google AT MOST ONCE per request, no matter how
 *      many "getXByY" helpers are called against it.
 *
 *   2. CacheService (cross-request, shared by every execution for up to the
 *      TTL). Holds Sessions (token -> session row), Users (id -> row, plus
 *      a username/email -> id index), Modules (full table), Categories
 *      (full table), and sheet Headers. A cache hit here means ZERO calls
 *      to the Sheets service.
 *
 *   3. Google Sheets itself — the source of truth, hit only on a cache miss
 *      or for a write.
 *
 * Every data-mutating action explicitly invalidates the caches it affects.
 * See PERFORMANCE_REPORT.md for the before/after breakdown.
 */

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

var SHEET_NAMES = {
  USERS: 'Users',
  SESSIONS: 'Sessions',
  MODULES: 'Modules',
  CATEGORIES: 'Categories',
  TOPICS: 'Topics',
  KNOWLEDGE: 'Knowledge',
  REVIEWS: 'Reviews',
  NOTES: 'Notes',
  STREAKS: 'Streaks',
  EMAIL_LOGS: 'EmailLogs',
  AI_INSIGHTS: 'AI_Insights',
  AI_FAVORITES: 'AI_Favorites'
};

var SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;           // 7 days default
var SESSION_DURATION_REMEMBER_MS = 1000 * 60 * 60 * 24 * 30; // 30 days "remember me"

var STATUS_VALUES = ['Not Started', 'Learning', 'Understood', 'Practiced', 'Mastered'];
var PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'];
var LANGUAGE_VALUES = ['en', 'ar'];

var SCHEMA_VERSION_TARGET = '6';

// Actions that mutate data. Only these acquire the script lock — read
// actions run without locking so parallel requests from the same page
// execute concurrently instead of queuing behind each other.
var WRITE_ACTIONS = {
  signup: 1,
  updateProfile: 1, changePassword: 1,
  createTopic: 1, updateTopic: 1, deleteTopic: 1, updateStatus: 1, updateProgress: 1,
  saveKnowledge: 1,
  addReview: 1, markReviewed: 1,
  createCategory: 1, updateCategory: 1, deleteCategory: 1, toggleCategoryStatus: 1,
  createNote: 1, updateNote: 1, deleteNote: 1,
  refreshModuleInsights: 1, updateAISettings: 1, addFavorite: 1, removeFavorite: 1,
  seed: 1
};

// ---------------------------------------------------------------------------
// CacheService layer (cross-request)
// ---------------------------------------------------------------------------

var CACHE_TTL_REFERENCE = 21600; // 6h — CacheService hard max
var CACHE_TTL_SESSION = 21600;   // 6h — re-cached on every hit
var CACHE_TTL_USER = 1800;       // 30 min

function cacheGet(key) {
  var raw = CacheService.getScriptCache().get(key);
  return raw ? JSON.parse(raw) : null;
}
function cachePut(key, value, ttl) {
  CacheService.getScriptCache().put(key, JSON.stringify(value), ttl);
}
function cacheRemove(key) {
  CacheService.getScriptCache().remove(key);
}

// ---------------------------------------------------------------------------
// REQUEST cache (reset at the top of every handleRequest call)
// ---------------------------------------------------------------------------

var REQ = null;

function resetRequestCache() {
  REQ = { ss: null, sheets: {}, headers: {}, topicsRows: null, modulesRows: null, categoriesRows: null, usersRows: null };
}

function ss() {
  if (!REQ.ss) REQ.ss = SpreadsheetApp.openById(getSheetId());
  return REQ.ss;
}

function sheetOf(name) {
  if (!REQ.sheets[name]) {
    var sh = ss().getSheetByName(name);
    if (!sh) throw new Error('Sheet not found: ' + name);
    REQ.sheets[name] = sh;
  }
  return REQ.sheets[name];
}

// Headers rarely change, so they're cached in CacheService (cross-request)
// AND memoized in REQ (per-request) — a warm request does zero Sheets calls
// just to know the column layout.
function getHeadersCached(sheetName) {
  if (REQ.headers[sheetName]) return REQ.headers[sheetName];
  var cacheKey = 'headers:' + sheetName;
  var cached = cacheGet(cacheKey);
  if (cached) { REQ.headers[sheetName] = cached; return cached; }
  var sheet = sheetOf(sheetName);
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  cachePut(cacheKey, headers, CACHE_TTL_REFERENCE);
  REQ.headers[sheetName] = headers;
  return headers;
}
function invalidateHeadersCache(sheetName) {
  cacheRemove('headers:' + sheetName);
  if (REQ) REQ.headers[sheetName] = null;
}

// ---------------------------------------------------------------------------
// ENTRY POINTS
// ---------------------------------------------------------------------------

function doGet(e) {
  try {
    var action  = e.parameter.action  || '';
    var token   = e.parameter.token   || '';
    var payload = {};
    // api.js embeds payload as JSON in the query string so the GET redirect
    // path has the same data as the original POST body.
    if (e.parameter.payload) {
      try { payload = JSON.parse(e.parameter.payload); } catch (ex) { /* ignore malformed */ }
    }
    if (!action) return jsonResponse(errorResponse('Missing action parameter.', 'MISSING_ACTION'));
    return handleRequest(action, payload, token);
  } catch (err) {
    return jsonResponse(errorResponse('Server error: ' + err.message, 'SERVER_ERROR'));
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch(ex) {}
    }
    var action = body.action || (e && e.parameter ? e.parameter.action : '') || '';
    var token  = body.token  || (e && e.parameter ? e.parameter.token  : '') || '';
    var payload = body.payload;

    if (!payload && e && e.parameter && e.parameter.payload) {
      try { payload = JSON.parse(e.parameter.payload); } catch(ex) {}
    }
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(ex) {}
    }
    payload = payload || {};

    if (!action) return jsonResponse(errorResponse('Missing action parameter.', 'MISSING_ACTION'));
    return handleRequest(action, payload, token);
  } catch (err) {
    return jsonResponse(errorResponse('Server error: ' + err.message, 'SERVER_ERROR'));
  }
}

function handleRequest(action, payload, token) {
  resetRequestCache();
  ensureSchema(); // no-op fast path (single PropertiesService read) once migrated

  var needsLock = !!WRITE_ACTIONS[action];
  var lock = null;
  if (needsLock) {
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
  }
  try {
    switch (action) {
      // Auth
      case 'signup':           return jsonResponse(actionSignup(payload));
      case 'login':             return jsonResponse(actionLogin(payload));
      case 'logout':            return jsonResponse(actionLogout(token));
      case 'validateSession':   return jsonResponse(actionValidateSession(token));
      case 'currentUser':       return jsonResponse(withAuth(token, function(user){ return successResponse(publicUser(user)); }));
      case 'updateProfile':     return jsonResponse(withAuth(token, function(user){ return actionUpdateProfile(user, payload); }));
      case 'changePassword':    return jsonResponse(withAuth(token, function(user){ return actionChangePassword(user, payload); }));

      // Modules / Categories (reference data)
      case 'modules':           return jsonResponse(withAuth(token, function(user){ return actionGetModules(); }));
      case 'categories':        return jsonResponse(withAuth(token, function(user){ return actionGetCategories(payload); }));
      case 'createCategory':    return jsonResponse(withAuth(token, function(user){ return actionCreateCategory(user, payload); }));
      case 'updateCategory':    return jsonResponse(withAuth(token, function(user){ return actionUpdateCategory(user, payload); }));
      case 'deleteCategory':    return jsonResponse(withAuth(token, function(user){ return actionDeleteCategory(user, payload); }));
      case 'toggleCategoryStatus': return jsonResponse(withAuth(token, function(user){ return actionToggleCategoryStatus(user, payload); }));

      // Topics
      case 'topics':            return jsonResponse(withAuth(token, function(user){ return actionGetTopics(user, payload); }));
      case 'topic':              return jsonResponse(withAuth(token, function(user){ return actionGetTopic(user, payload); }));
      case 'createTopic':        return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionCreateTopic(user, payload); }));
      case 'updateTopic':        return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionUpdateTopic(user, payload); }));
      case 'deleteTopic':        return jsonResponse(withAuth(token, function(user){ return actionDeleteTopic(user, payload); }));
      case 'updateStatus':       return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionUpdateStatus(user, payload); }));
      case 'updateStatusBulk':   return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionUpdateStatusBulk(user, payload); }));
      case 'updateProgress':     return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionUpdateProgress(user, payload); }));

      // Knowledge
      case 'knowledge':          return jsonResponse(withAuth(token, function(user){ return actionGetKnowledge(user, payload); }));
      case 'saveKnowledge':      return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionSaveKnowledge(user, payload); }));
      case 'updateKnowledge':    return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionSaveKnowledge(user, payload); }));

      // Reviews
      case 'reviews':             return jsonResponse(withAuth(token, function(user){ return actionGetReviews(user, payload); }));
      case 'addReview':           return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionAddReview(user, payload); }));
      case 'markReviewed':        return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionMarkReviewed(user, payload); }));

      // Notes — paginated
      case 'notes':               return jsonResponse(withAuth(token, function(user){ return actionGetNotes(user, payload); }));
      case 'note':                return jsonResponse(withAuth(token, function(user){ return actionGetNote(user, payload); }));
      case 'createNote':          return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionCreateNote(user, payload); }));
      case 'updateNote':          return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionUpdateNote(user, payload); }));
      case 'deleteNote':          return jsonResponse(withAuth(token, function(user){ return actionDeleteNote(user, payload); }));

      // Dashboard / Analytics / Streaks
      case 'dashboard':            return jsonResponse(withAuth(token, function(user){ return actionDashboard(user); }));
      case 'analytics':            return jsonResponse(withAuth(token, function(user){ return actionAnalytics(user); }));
      case 'getStreak':            return jsonResponse(withAuth(token, function(user){ return actionGetStreak(user); }));

      // Admin & Backup
      case 'adminUsers':           return jsonResponse(withAuth(token, function(user){ return actionAdminUsers(user); }));
      case 'sendTestDigest':       return jsonResponse(withAuth(token, function(user){ return actionSendTestDigest(user); }));
      case 'exportMyData':         return jsonResponse(withAuth(token, function(user){ return actionExportMyData(user); }));
      case 'importMyData':         return jsonResponse(withAuth(token, function(user){ return actionImportMyData(user, payload); }));

      // AI Daily Insights & Favorites
      case 'getModuleInsights':    return jsonResponse(withAuth(token, function(user){ return actionGetModuleInsights(user, payload); }));
      case 'refreshModuleInsights':return jsonResponse(withAuth(token, function(user){ return actionRefreshModuleInsights(user, payload); }));
      case 'testAIConnection':     return jsonResponse(withAuth(token, function(user){ return actionTestAIConnection(user); }));
      case 'getAISettings':        return jsonResponse(withAuth(token, function(user){ return actionGetAISettings(user); }));
      case 'updateAISettings':     return jsonResponse(withAuth(token, function(user){ return actionUpdateAISettings(user, payload); }));
      case 'getFavorites':         return jsonResponse(withAuth(token, function(user){ return actionGetFavorites(user); }));
      case 'addFavorite':          return jsonResponse(withAuth(token, function(user){ return actionAddFavorite(user, payload); }));
      case 'removeFavorite':       return jsonResponse(withAuth(token, function(user){ return actionRemoveFavorite(user, payload); }));

      // Setup
      case 'seed':                  return jsonResponse(actionSeed());

      // Batch requests — executes multiple actions in one round-trip
      case 'batch':                return jsonResponse(withAuth(token, function(user){ return actionBatch(user, payload, token); }));

      // Keepalive — lightweight no-op used by the frontend to prevent cold starts
      case 'ping':                  return jsonResponse(successResponse({ pong: true }));

      default:
        return jsonResponse(errorResponse('Unknown action: ' + action, 'UNKNOWN_ACTION'));
    }
  } finally {
    if (lock) lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// RESPONSE HELPERS
// ---------------------------------------------------------------------------

function successResponse(data, message) {
  return { success: true, data: data === undefined ? null : data, message: message || '' };
}

// `code` is a stable machine-readable key the frontend's i18n layer maps to
// a localized string (en/ar). `message` is an English fallback only.
function errorResponse(message, code) {
  return { success: false, data: null, message: message || 'Error', code: code || 'ERROR' };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------------------
// AUTH GUARD
// ---------------------------------------------------------------------------

function withAuth(token, fn) {
  var session = getValidSession(token);
  if (!session) return errorResponse('Session expired. Please log in again.', 'SESSION_EXPIRED');
  var user = getUserCached(session.user_id);
  if (!user || user.active === false || user.active === 'FALSE') {
    return errorResponse('Account is not active.', 'ACCOUNT_DISABLED');
  }
  return fn(user);
}

function publicUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    language: user.language || 'en',
    created_at: user.created_at,
    last_login: user.last_login
  };
}

// ---------------------------------------------------------------------------
// GENERIC SHEET DATA ACCESS
// ---------------------------------------------------------------------------

function getSheetId() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id && typeof SpreadsheetApp !== 'undefined') {
    try {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) {
        id = active.getId();
        PropertiesService.getScriptProperties().setProperty('SHEET_ID', id);
        return id;
      }
    } catch (e) {}
  }
  if (!id) throw new Error('SHEET_ID script property is not set. Please set SHEET_ID in Project Settings (⚙️) -> Script Properties.');
  return id;
}

function readAllRows(sheetName) {
  var sheet = sheetOf(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var headers = getHeadersCached(sheetName);
  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = values[i][c];
    obj.__row = i + 2; // 1-indexed sheet row, for in-place updates
    rows.push(obj);
  }
  return rows;
}

function appendRow(sheetName, obj) {
  var sheet = sheetOf(sheetName);
  var headers = getHeadersCached(sheetName);
  var row = headers.map(function(h) { return obj.hasOwnProperty(h) ? obj[h] : ''; });
  sheet.appendRow(row);
  return obj;
}

// Batch insert — ONE setValues() call for N rows, instead of N appendRow()
// calls. Used for seeding Modules/Categories.
function appendRowsBatch(sheetName, objArray) {
  if (!objArray.length) return;
  var sheet = sheetOf(sheetName);
  var headers = getHeadersCached(sheetName);
  var startRow = sheet.getLastRow() + 1;
  var values = objArray.map(function(obj) {
    return headers.map(function(h) { return obj.hasOwnProperty(h) ? obj[h] : ''; });
  });
  sheet.getRange(startRow, 1, values.length, headers.length).setValues(values);
}

// Update using an already-known row object (with __row) — avoids a second
// full-sheet scan when the caller already has the row from a cached read.
function updateRowByObj(sheetName, existingRowObj, updates) {
  var sheet = sheetOf(sheetName);
  var headers = getHeadersCached(sheetName);
  var merged = {};
  for (var h = 0; h < headers.length; h++) {
    var key = headers[h];
    merged[key] = updates.hasOwnProperty(key) ? updates[key] : existingRowObj[key];
  }
  var rowValues = headers.map(function(h) { return merged[h]; });
  sheet.getRange(existingRowObj.__row, 1, 1, headers.length).setValues([rowValues]);
  merged.__row = existingRowObj.__row;
  return merged;
}

function deleteRowByObj(sheetName, existingRowObj) {
  sheetOf(sheetName).deleteRow(existingRowObj.__row);
  return true;
}

// Convenience wrapper for sheets where the caller doesn't already hold the
// row (Users, Knowledge, Reviews) — does one scan to locate it.
function findRowById(sheetName, id) {
  var rows = readAllRows(sheetName);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].id) === String(id)) return rows[i];
  }
  return null;
}
function updateRow(sheetName, id, updates) {
  var existing = findRowById(sheetName, id);
  if (!existing) return null;
  return updateRowByObj(sheetName, existing, updates);
}
function deleteRow(sheetName, id) {
  var existing = findRowById(sheetName, id);
  if (!existing) return false;
  return deleteRowByObj(sheetName, existing);
}

function stripRow(row) {
  var copy = {};
  for (var k in row) { if (k !== '__row') copy[k] = row[k]; }
  return copy;
}

function generateId(prefix) {
  var raw = Utilities.getUuid().replace(/-/g, '').substring(0, 10);
  return prefix + '-' + raw;
}
function nowIso() { return new Date().toISOString(); }

// ---------------------------------------------------------------------------
// REQUEST-SCOPED + CROSS-REQUEST DATA ACCESS LAYER
// ---------------------------------------------------------------------------
// Every one of these reads its sheet AT MOST ONCE per request (memoized in
// REQ), and for Modules/Categories/Users also reuses a CacheService copy
// across requests. All "getXByY" filtering happens in memory afterward —
// never a second trip to Sheets for the same table in the same request.

function getTopicsRows() {
  if (!REQ.topicsRows) REQ.topicsRows = readAllRows(SHEET_NAMES.TOPICS);
  return REQ.topicsRows;
}
function getTopicsByUser(userId) {
  return getTopicsRows().filter(function(t) { return t.user_id === userId; });
}
function getTopicsByModule(topicsArr, moduleId) {
  return topicsArr.filter(function(t) { return t.module_id === moduleId; });
}
function getTopicsByStatus(topicsArr, status) {
  return topicsArr.filter(function(t) { return t.status === status; });
}
function getTopicsByPriority(topicsArr, priority) {
  return topicsArr.filter(function(t) { return t.priority === priority; });
}
function getTopicById(id) {
  var rows = getTopicsRows();
  for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i];
  return null;
}

function getModulesRows() {
  if (REQ.modulesRows) return REQ.modulesRows;
  var cached = cacheGet('modules_all');
  if (cached) { REQ.modulesRows = cached; return cached; }
  var rows = readAllRows(SHEET_NAMES.MODULES);
  cachePut('modules_all', rows, CACHE_TTL_REFERENCE);
  REQ.modulesRows = rows;
  return rows;
}
function invalidateModulesCache() { cacheRemove('modules_all'); if (REQ) REQ.modulesRows = null; }

function getCategoriesRows() {
  if (REQ.categoriesRows) return REQ.categoriesRows;
  var cached = cacheGet('categories_all');
  if (cached) { REQ.categoriesRows = cached; return cached; }
  var rows = readAllRows(SHEET_NAMES.CATEGORIES);
  cachePut('categories_all', rows, CACHE_TTL_REFERENCE);
  REQ.categoriesRows = rows;
  return rows;
}
function invalidateCategoriesCache() { cacheRemove('categories_all'); if (REQ) REQ.categoriesRows = null; }
function getCategoryById(id) {
  var rows = getCategoriesRows();
  for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i];
  return null;
}

// Users: only used for the (infrequent) admin listing — memoized per
// request only, since staleness there is undesirable.
function getUsersRows() {
  if (!REQ.usersRows) REQ.usersRows = readAllRows(SHEET_NAMES.USERS);
  return REQ.usersRows;
}

// ---------------------------------------------------------------------------
// PASSWORD HASHING (SHA-256 + per-user salt, no plaintext ever stored)
// ---------------------------------------------------------------------------

function hashPassword(password, salt) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + password, Utilities.Charset.UTF_8);
  return digest.map(function(b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}
function makePasswordHash(password) {
  var salt = Utilities.getUuid();
  return salt + '$' + hashPassword(password, salt);
}
function verifyPassword(password, storedHash) {
  var parts = String(storedHash).split('$');
  if (parts.length !== 2) return false;
  return hashPassword(password, parts[0]) === parts[1];
}

// ---------------------------------------------------------------------------
// USERS: cached per-id lookup + username/email index (avoids reading the
// whole Users sheet on every login/signup uniqueness check).
// ---------------------------------------------------------------------------

function getUserCached(userId) {
  var key = 'user:' + userId;
  var cached = cacheGet(key);
  if (cached) return cached;
  var user = findRowById(SHEET_NAMES.USERS, userId);
  if (user) cachePut(key, user, CACHE_TTL_USER);
  return user;
}
function invalidateUserCache(userId) { cacheRemove('user:' + userId); }

function getUsersIndex() {
  var cached = cacheGet('users_index');
  if (cached) return cached;
  var rows = readAllRows(SHEET_NAMES.USERS);
  var index = { byUsername: {}, byEmail: {}, count: rows.length };
  rows.forEach(function(u) {
    index.byUsername[String(u.username).toLowerCase()] = u.id;
    index.byEmail[String(u.email).toLowerCase()] = u.id;
  });
  cachePut('users_index', index, CACHE_TTL_REFERENCE);
  return index;
}
function invalidateUsersIndex() { cacheRemove('users_index'); }

// ---------------------------------------------------------------------------
// SESSIONS — cache-first validation (a warm session does ZERO Sheets calls)
// ---------------------------------------------------------------------------

function sessionCacheKey(token) { return 'sess:' + token; }

function createSession(userId, rememberMe) {
  var sessionId = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  var now = new Date();
  var duration = rememberMe ? SESSION_DURATION_REMEMBER_MS : SESSION_DURATION_MS;
  var expires = new Date(now.getTime() + duration);
  var session = {
    session_id: sessionId, user_id: userId,
    created_at: now.toISOString(), expires_at: expires.toISOString(),
    active: true, last_activity: now.toISOString()
  };
  appendRow(SHEET_NAMES.SESSIONS, session);
  cachePut(sessionCacheKey(sessionId), session, CACHE_TTL_SESSION);
  return sessionId;
}

function getValidSession(token) {
  if (!token) return null;
  var now = new Date();

  var cached = cacheGet(sessionCacheKey(token));
  if (cached) {
    return (cached.active && new Date(cached.expires_at) > now) ? cached : null;
  }

  var rows = readAllRows(SHEET_NAMES.SESSIONS);
  for (var i = 0; i < rows.length; i++) {
    var s = rows[i];
    if (String(s.session_id) === String(token)) {
      var active = s.active === true || s.active === 'TRUE';
      var valid = active && new Date(s.expires_at) > now;
      if (valid) cachePut(sessionCacheKey(token), s, CACHE_TTL_SESSION);
      return valid ? s : null;
    }
  }
  return null;
}

function invalidateSession(sessionId) {
  cacheRemove(sessionCacheKey(sessionId));
  var sheet = sheetOf(SHEET_NAMES.SESSIONS);
  var headers = getHeadersCached(SHEET_NAMES.SESSIONS);
  var idCol = headers.indexOf('session_id'), activeCol = headers.indexOf('active');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(sessionId)) {
      sheet.getRange(i + 2, activeCol + 1).setValue(false);
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// AUTH ACTIONS
// ---------------------------------------------------------------------------

function actionSignup(payload) {
  var fullName = (payload.full_name || '').trim();
  var username = (payload.username || '').trim();
  var email = (payload.email || '').trim().toLowerCase();
  var password = payload.password || '';
  var confirm = payload.confirm_password || '';
  var language = LANGUAGE_VALUES.indexOf(payload.language) !== -1 ? payload.language : 'en';

  if (!fullName || !username || !email || !password) return errorResponse('All fields are required.', 'REQUIRED_FIELDS');
  if (password !== confirm) return errorResponse('Passwords do not match.', 'PASSWORDS_MISMATCH');
  if (password.length < 8) return errorResponse('Password must be at least 8 characters.', 'WEAK_PASSWORD');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return errorResponse('Invalid email address.', 'INVALID_EMAIL');

  var index = getUsersIndex();
  if (index.byUsername[username.toLowerCase()]) return errorResponse('Username is already taken.', 'USERNAME_TAKEN');
  if (index.byEmail[email]) return errorResponse('Email is already registered.', 'EMAIL_TAKEN');

  var id = generateId('USR');
  var role = index.count === 0 ? 'Admin' : 'User'; // first user becomes Admin
  var user = {
    id: id, full_name: fullName, username: username, email: email,
    password_hash: makePasswordHash(password), role: role, active: true,
    language: language, created_at: nowIso(), last_login: ''
  };
  appendRow(SHEET_NAMES.USERS, user);
  invalidateUsersIndex();
  seedDemoTopicsForUser(id);

  return successResponse(null, 'Account created. You can log in now.');
}

function actionLogin(payload) {
  var identifier = (payload.identifier || payload.username || payload.email || '').trim().toLowerCase();
  var password = payload.password || '';
  var rememberMe = !!payload.remember_me;

  if (!identifier || !password) return errorResponse('Username/email and password are required.', 'REQUIRED_FIELDS');

  var index = getUsersIndex();
  var userId = index.byUsername[identifier] || index.byEmail[identifier];
  if (!userId) return errorResponse('Invalid credentials.', 'INVALID_CREDENTIALS');

  var match = getUserCached(userId);
  if (!match) return errorResponse('Invalid credentials.', 'INVALID_CREDENTIALS');
  if (match.active === false || match.active === 'FALSE') return errorResponse('Account is disabled.', 'ACCOUNT_DISABLED');
  if (!verifyPassword(password, match.password_hash)) return errorResponse('Invalid credentials.', 'INVALID_CREDENTIALS');

  var token = createSession(match.id, rememberMe);
  match.last_login = nowIso();

  return successResponse({ token: token, user: publicUser(match) }, 'Login successful.');
}

function actionLogout(token) {
  var session = getValidSession(token);
  if (session) invalidateSession(session.session_id);
  return successResponse(null, 'Logged out.');
}

function actionValidateSession(token) {
  var session = getValidSession(token);
  if (!session) return errorResponse('No valid session.', 'SESSION_EXPIRED');
  var user = getUserCached(session.user_id);
  if (!user) return errorResponse('No valid session.', 'SESSION_EXPIRED');
  return successResponse({
    user: publicUser(user),
    modules: getModulesRows(),
    categories: getCategoriesRows()
  });
}

function actionUpdateProfile(user, payload) {
  var updates = {};
  if (payload.full_name) updates.full_name = String(payload.full_name).trim();
  if (payload.email) {
    var email = String(payload.email).trim().toLowerCase();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return errorResponse('Invalid email address.', 'INVALID_EMAIL');
    if (email !== String(user.email).toLowerCase()) {
      var index = getUsersIndex();
      if (index.byEmail[email]) return errorResponse('Email is already registered.', 'EMAIL_TAKEN');
      updates.email = email;
    }
  }
  if (payload.language && LANGUAGE_VALUES.indexOf(payload.language) !== -1) updates.language = payload.language;

  var updated = updateRow(SHEET_NAMES.USERS, user.id, updates);
  invalidateUserCache(user.id);
  if (updates.email) invalidateUsersIndex();
  return successResponse(publicUser(updated), 'Profile updated successfully.');
}

function actionChangePassword(user, payload) {
  var current = payload.current_password || '';
  var next = payload.new_password || '';
  var confirm = payload.confirm_password || '';
  if (!verifyPassword(current, user.password_hash)) return errorResponse('Current password is incorrect.', 'CURRENT_PASSWORD_INCORRECT');
  if (next.length < 8) return errorResponse('New password must be at least 8 characters.', 'WEAK_PASSWORD');
  if (next !== confirm) return errorResponse('New passwords do not match.', 'PASSWORDS_MISMATCH');
  updateRow(SHEET_NAMES.USERS, user.id, { password_hash: makePasswordHash(next) });
  invalidateUserCache(user.id);
  return successResponse(null, 'Password changed successfully.');
}

// ---------------------------------------------------------------------------
// MODULES
// ---------------------------------------------------------------------------

function actionGetModules() {
  return successResponse(getModulesRows().map(stripRow));
}

// ---------------------------------------------------------------------------
// CATEGORIES — fully dynamic, Admin-managed, cached, with topic-usage guard
// on delete. Categories are global reference data shared by every user
// (like Modules), which is why mutation is restricted to Admins.
// ---------------------------------------------------------------------------

function actionGetCategories(payload) {
  var all = getCategoriesRows().map(stripRow);
  if (payload && payload.module_id) all = all.filter(function(c) { return c.module_id === payload.module_id; });
  return successResponse(all);
}

function actionCreateCategory(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var moduleId = payload.module_id;
  var nameEn = (payload.name_en || '').trim();
  var nameAr = (payload.name_ar || '').trim();
  if (!moduleId || !nameEn || !nameAr) return errorResponse('Module, English name and Arabic name are required.', 'CATEGORY_FIELDS_REQUIRED');
  var moduleExists = getModulesRows().some(function(m) { return m.id === moduleId; });
  if (!moduleExists) return errorResponse('Module not found.', 'MODULE_NOT_FOUND');

  var cat = {
    id: generateId('CAT'), module_id: moduleId, name_ar: nameAr, name_en: nameEn,
    description: payload.description || '', active: payload.active === false ? false : true,
    created_at: nowIso(), updated_at: nowIso()
  };
  appendRow(SHEET_NAMES.CATEGORIES, cat);
  invalidateCategoriesCache();
  return successResponse(cat, 'Category created successfully.');
}

function actionUpdateCategory(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var cat = getCategoryById(payload.id);
  if (!cat) return errorResponse('Category not found.', 'CATEGORY_NOT_FOUND');

  var updates = { updated_at: nowIso() };
  if (payload.name_en !== undefined) {
    var nEn = String(payload.name_en).trim();
    if (!nEn) return errorResponse('English name is required.', 'CATEGORY_FIELDS_REQUIRED');
    updates.name_en = nEn;
  }
  if (payload.name_ar !== undefined) {
    var nAr = String(payload.name_ar).trim();
    if (!nAr) return errorResponse('Arabic name is required.', 'CATEGORY_FIELDS_REQUIRED');
    updates.name_ar = nAr;
  }
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.active !== undefined) updates.active = !!payload.active;

  var updated = updateRowByObj(SHEET_NAMES.CATEGORIES, cat, updates);
  invalidateCategoriesCache();
  return successResponse(stripRow(updated), 'Category updated successfully.');
}

function actionDeleteCategory(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var cat = getCategoryById(payload.id);
  if (!cat) return errorResponse('Category not found.', 'CATEGORY_NOT_FOUND');

  var hasTopics = getTopicsRows().some(function(t) { return t.category_id === payload.id; });
  if (hasTopics) {
    return errorResponse('This category contains topics and cannot be deleted.', 'CATEGORY_HAS_TOPICS');
  }
  deleteRowByObj(SHEET_NAMES.CATEGORIES, cat);
  invalidateCategoriesCache();
  return successResponse(null, 'Category deleted.');
}

function actionToggleCategoryStatus(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var cat = getCategoryById(payload.id);
  if (!cat) return errorResponse('Category not found.', 'CATEGORY_NOT_FOUND');
  var newActive = !(cat.active === true || cat.active === 'TRUE');
  var updated = updateRowByObj(SHEET_NAMES.CATEGORIES, cat, { active: newActive, updated_at: nowIso() });
  invalidateCategoriesCache();
  return successResponse(stripRow(updated), 'Category status updated.');
}

// ---------------------------------------------------------------------------
// TOPICS (always scoped to the authenticated user's id)
// ---------------------------------------------------------------------------

function actionGetTopics(user, payload) {
  var topics = getTopicsByUser(user.id);
  if (payload) {
    if (payload.module_id) topics = getTopicsByModule(topics, payload.module_id);
    if (payload.category_id) topics = topics.filter(function(t){ return t.category_id === payload.category_id; });
    if (payload.status) topics = getTopicsByStatus(topics, payload.status);
    if (payload.priority) topics = getTopicsByPriority(topics, payload.priority);
    if (payload.search) {
      var q = String(payload.search).toLowerCase();
      topics = topics.filter(function(t) {
        return String(t.topic).toLowerCase().indexOf(q) !== -1 || String(t.description).toLowerCase().indexOf(q) !== -1;
      });
    }
  }
  return successResponse(topics.map(stripRow));
}

function actionGetTopic(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  var knowledge = readAllRows(SHEET_NAMES.KNOWLEDGE)
    .filter(function(k) { return k.topic_id === topic.id && k.user_id === user.id; })
    .map(stripRow)[0] || null;
  var reviews = readAllRows(SHEET_NAMES.REVIEWS)
    .filter(function(r) { return r.topic_id === topic.id && r.user_id === user.id; })
    .map(stripRow);
  return successResponse({ topic: stripRow(topic), knowledge: knowledge, reviews: reviews });
}

function actionCreateTopic(user, payload) {
  if (!payload.topic || !payload.module_id) return errorResponse('Topic name and module are required.', 'REQUIRED_FIELDS');
  var priority = PRIORITY_VALUES.indexOf(payload.priority) !== -1 ? payload.priority : 'Medium';
  var id = generateId('TOP');
  var topic = {
    id: id, user_id: user.id, module_id: payload.module_id, category_id: payload.category_id || '',
    topic: String(payload.topic).trim(), description: payload.description || '', priority: priority,
    status: 'Not Started', progress: 0, created_at: nowIso(), updated_at: nowIso(),
    completed_at: '', last_review: '', next_review: '',
    tags: payload.tags || '', pinned: !!payload.pinned, target_date: payload.target_date || ''
  };
  appendRow(SHEET_NAMES.TOPICS, topic);

  if (payload.what_i_dont_know || payload.what_i_need_to_learn || payload.current_understanding) {
    appendRow(SHEET_NAMES.KNOWLEDGE, {
      id: generateId('KNW'), user_id: user.id, topic_id: id,
      what_i_know: payload.current_understanding || '',
      what_i_dont_know: payload.what_i_dont_know || '',
      what_i_need_to_learn: payload.what_i_need_to_learn || '',
      business_understanding: '', erp_understanding: '', practical_experience: '', notes: '',
      updated_at: nowIso()
    });
  }
  return successResponse(topic, 'Topic added successfully.');
}

function actionUpdateTopic(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  var updates = { updated_at: nowIso() };
  ['topic', 'description', 'module_id', 'category_id', 'tags', 'target_date'].forEach(function(f) {
    if (payload[f] !== undefined) updates[f] = payload[f];
  });
  if (payload.pinned !== undefined) updates.pinned = !!payload.pinned;
  if (payload.priority && PRIORITY_VALUES.indexOf(payload.priority) !== -1) updates.priority = payload.priority;
  var updated = updateRowByObj(SHEET_NAMES.TOPICS, topic, updates);
  return successResponse(stripRow(updated), 'Topic updated successfully.');
}

function actionDeleteTopic(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  deleteRowByObj(SHEET_NAMES.TOPICS, topic);
  return successResponse(null, 'Topic deleted.');
}

function actionUpdateStatus(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  if (STATUS_VALUES.indexOf(payload.status) === -1) return errorResponse('Invalid status.', 'INVALID_STATUS');

  var progressByStatus = { 'Not Started': 0, 'Learning': 25, 'Understood': 50, 'Practiced': 75, 'Mastered': 100 };
  var updates = { status: payload.status, progress: progressByStatus[payload.status], updated_at: nowIso() };
  if (payload.status === 'Mastered') {
    updates.completed_at = nowIso();
    updates.last_review = nowIso();
    updates.next_review = addDaysIso(new Date(), 30);
  }
  var updated = updateRowByObj(SHEET_NAMES.TOPICS, topic, updates);
  return successResponse(stripRow(updated), 'Status updated.');
}

function actionUpdateStatusBulk(user, payload) {
  // payload.ids = ['TOP-xxx', 'TOP-yyy', ...], payload.status = 'Learning'
  var ids = payload.ids;
  if (!Array.isArray(ids) || ids.length === 0) return errorResponse('No topic IDs provided.', 'NO_IDS');
  if (ids.length > 50) return errorResponse('Bulk limit is 50 topics.', 'BULK_LIMIT');
  if (STATUS_VALUES.indexOf(payload.status) === -1) return errorResponse('Invalid status.', 'INVALID_STATUS');

  var progressByStatus = { 'Not Started': 0, 'Learning': 25, 'Understood': 50, 'Practiced': 75, 'Mastered': 100 };
  var updated = [];
  var errors  = [];
  ids.forEach(function(id) {
    var topic = getTopicById(id);
    if (!topic || topic.user_id !== user.id) { errors.push(id); return; }
    var upd = { status: payload.status, progress: progressByStatus[payload.status], updated_at: nowIso() };
    if (payload.status === 'Mastered') { upd.completed_at = nowIso(); upd.last_review = nowIso(); upd.next_review = addDaysIso(new Date(), 30); }
    updated.push(stripRow(updateRowByObj(SHEET_NAMES.TOPICS, topic, upd)));
  });
  return successResponse({ updated: updated, errors: errors }, 'Bulk status updated.');
}

function actionUpdateProgress(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  var progress = Math.max(0, Math.min(100, Number(payload.progress) || 0));
  var updated = updateRowByObj(SHEET_NAMES.TOPICS, topic, { progress: progress, updated_at: nowIso() });
  return successResponse(stripRow(updated), 'Progress updated.');
}

function addDaysIso(date, days) {
  var d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// KNOWLEDGE
// ---------------------------------------------------------------------------

function actionGetKnowledge(user, payload) {
  var rows = readAllRows(SHEET_NAMES.KNOWLEDGE)
    .filter(function(k) { return k.user_id === user.id && k.topic_id === payload.topic_id; })
    .map(stripRow);
  return successResponse(rows[0] || null);
}

function actionSaveKnowledge(user, payload) {
  var topic = getTopicById(payload.topic_id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');

  var existing = readAllRows(SHEET_NAMES.KNOWLEDGE)
    .filter(function(k) { return k.user_id === user.id && k.topic_id === payload.topic_id; })[0];

  var fields = ['what_i_know', 'what_i_dont_know', 'what_i_need_to_learn',
    'business_understanding', 'erp_understanding', 'practical_experience', 'notes'];

  if (existing) {
    var updates = { updated_at: nowIso() };
    fields.forEach(function(f) { if (payload[f] !== undefined) updates[f] = payload[f]; });
    var updated = updateRowByObj(SHEET_NAMES.KNOWLEDGE, existing, updates);
    return successResponse(stripRow(updated), 'Knowledge updated successfully.');
  } else {
    var record = { id: generateId('KNW'), user_id: user.id, topic_id: payload.topic_id, updated_at: nowIso() };
    fields.forEach(function(f) { record[f] = payload[f] || ''; });
    appendRow(SHEET_NAMES.KNOWLEDGE, record);
    return successResponse(record, 'Knowledge saved successfully.');
  }
}

// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------

function actionGetReviews(user, payload) {
  var rows = readAllRows(SHEET_NAMES.REVIEWS).filter(function(r) { return r.user_id === user.id; });
  if (payload && payload.topic_id) rows = rows.filter(function(r) { return r.topic_id === payload.topic_id; });
  return successResponse(rows.map(stripRow));
}

function actionAddReview(user, payload) {
  var topic = getTopicById(payload.topic_id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  var review = {
    id: generateId('REV'), user_id: user.id, topic_id: payload.topic_id,
    review_date: nowIso(), understanding: payload.understanding || '', notes: payload.notes || ''
  };
  appendRow(SHEET_NAMES.REVIEWS, review);
  updateRowByObj(SHEET_NAMES.TOPICS, topic, {
    last_review: nowIso(),
    next_review: addDaysIso(new Date(), Number(payload.next_review_days) || 14),
    updated_at: nowIso()
  });
  return successResponse(review, 'Review completed.');
}

function actionMarkReviewed(user, payload) {
  var topic = getTopicById(payload.id);
  if (!topic || topic.user_id !== user.id) return errorResponse('Topic not found.', 'TOPIC_NOT_FOUND');
  var days = Number(payload.next_review_days) || 14;
  var updated = updateRowByObj(SHEET_NAMES.TOPICS, topic, {
    last_review: nowIso(), next_review: addDaysIso(new Date(), days), updated_at: nowIso()
  });
  appendRow(SHEET_NAMES.REVIEWS, {
    id: generateId('REV'), user_id: user.id, topic_id: topic.id,
    review_date: nowIso(), understanding: payload.understanding || '', notes: payload.notes || ''
  });
  return successResponse(stripRow(updated), 'Review completed.');
}

// ---------------------------------------------------------------------------
// NOTES (always scoped to the authenticated user's id)
// ---------------------------------------------------------------------------

function actionGetNotes(user, payload) {
  var rows = readAllRows(SHEET_NAMES.NOTES).filter(function(n) {
    return String(n.user_id) === String(user.id);
  });
  if (payload && payload.module_id) {
    rows = rows.filter(function(n) { return String(n.module_id) === String(payload.module_id); });
  }
  if (payload && payload.search) {
    var q = String(payload.search).toLowerCase();
    rows = rows.filter(function(n) {
      return String(n.title || '').toLowerCase().indexOf(q) !== -1 ||
             String(n.section_name || '').toLowerCase().indexOf(q) !== -1 ||
             String(n.content || '').toLowerCase().indexOf(q) !== -1;
    });
  }
  if (payload && payload.tag) {
    var tag = String(payload.tag).toLowerCase().replace(/^#/, '');
    rows = rows.filter(function(n) {
      return String(n.tags || '').toLowerCase().indexOf(tag) !== -1;
    });
  }
  if (payload && payload.pinned_only) {
    rows = rows.filter(function(n) { return n.pinned === true || n.pinned === 'TRUE' || n.pinned === 'true'; });
  }
  // Sort: pinned first, then newest first
  rows.sort(function(a, b) {
    var ap = (a.pinned === true || a.pinned === 'TRUE' || a.pinned === 'true') ? 1 : 0;
    var bp = (b.pinned === true || b.pinned === 'TRUE' || b.pinned === 'true') ? 1 : 0;
    if (bp !== ap) return bp - ap;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  // Server-side pagination
  var total = rows.length;
  var limit  = Math.min(parseInt(payload && payload.limit  || 0, 10) || 100, 200);
  var offset = parseInt(payload && payload.offset || 0, 10) || 0;
  var page = rows.slice(offset, offset + limit).map(stripRow);
  return successResponse({ notes: page, total: total, limit: limit, offset: offset });
}

function actionGetNote(user, payload) {
  var note = findRowById(SHEET_NAMES.NOTES, payload.id);
  if (!note || String(note.user_id) !== String(user.id)) return errorResponse('Note not found.', 'NOTE_NOT_FOUND');
  return successResponse(stripRow(note));
}

function actionCreateNote(user, payload) {
  var title = String(payload.title || '').trim();
  var sectionName = String(payload.section_name || '').trim();
  var content = String(payload.content || '').trim();
  var moduleId = String(payload.module_id || '').trim();
  var tags = String(payload.tags || '').trim();
  var pinned = !!payload.pinned;
  var imageUrl = String(payload.image_url || payload.image_data || '').trim();

  if (!title || !content || !moduleId) return errorResponse('Title, content, and module are required.', 'NOTE_FIELDS_REQUIRED');

  var id = generateId('NOTE');
  var note = {
    id: id,
    user_id: user.id,
    module_id: moduleId,
    title: title,
    section_name: sectionName,
    content: content,
    tags: tags,
    pinned: pinned,
    image_url: imageUrl,
    created_at: nowIso(),
    updated_at: nowIso()
  };
  appendRow(SHEET_NAMES.NOTES, note);
  return successResponse(note, 'Note created successfully.');
}

function actionUpdateNote(user, payload) {
  var note = findRowById(SHEET_NAMES.NOTES, payload.id);
  if (!note || String(note.user_id) !== String(user.id)) return errorResponse('Note not found.', 'NOTE_NOT_FOUND');

  var title = payload.title !== undefined ? String(payload.title).trim() : note.title;
  var sectionName = payload.section_name !== undefined ? String(payload.section_name).trim() : note.section_name;
  var content = payload.content !== undefined ? String(payload.content).trim() : note.content;
  var moduleId = payload.module_id !== undefined ? String(payload.module_id).trim() : note.module_id;

  if (!title || !content) return errorResponse('Title and content are required.', 'NOTE_FIELDS_REQUIRED');

  var updates = {
    module_id: moduleId,
    title: title,
    section_name: sectionName,
    content: content,
    updated_at: nowIso()
  };
  if (payload.tags !== undefined) updates.tags = String(payload.tags).trim();
  if (payload.pinned !== undefined) updates.pinned = !!payload.pinned;
  if (payload.image_url !== undefined) updates.image_url = String(payload.image_url).trim();

  var updated = updateRowByObj(SHEET_NAMES.NOTES, note, updates);
  return successResponse(stripRow(updated), 'Note updated successfully.');
}

function actionDeleteNote(user, payload) {
  var note = findRowById(SHEET_NAMES.NOTES, payload.id);
  if (!note || String(note.user_id) !== String(user.id)) return errorResponse('Note not found.', 'NOTE_NOT_FOUND');
  deleteRowByObj(SHEET_NAMES.NOTES, note);
  return successResponse(null, 'Note deleted.');
}

// ---------------------------------------------------------------------------
// DASHBOARD / ANALYTICS
// Each reads Topics ONCE (getTopicsRows/getTopicsByUser) and Modules ONCE
// (cached), then derives every number from that same in-memory dataset —
// no repeated Sheets calls for the same table within the request.
// ---------------------------------------------------------------------------

function actionDashboard(user) {
  var modules = getModulesRows().map(stripRow);
  var topics = getTopicsByUser(user.id);

  var kpis = computeKpis(topics);
  var moduleCards = modules.map(function(m) {
    var mTopics = getTopicsByModule(topics, m.id);
    return {
      id: m.id, name_ar: m.name_ar, name_en: m.name_en,
      total: mTopics.length, progress: averageProgress(mTopics),
      not_started: countByStatus(mTopics, 'Not Started'),
      learning: countByStatus(mTopics, 'Learning'),
      understood: countByStatus(mTopics, 'Understood'),
      practiced: countByStatus(mTopics, 'Practiced'),
      mastered: countByStatus(mTopics, 'Mastered')
    };
  });

  var now = new Date();
  var dueToday = topics.filter(function(t) { return isSameDay(t.next_review, now); }).length;
  var overdue  = topics.filter(function(t) { return t.next_review && new Date(t.next_review) < now && !isSameDay(t.next_review, now); }).length;

  // Include stripped topics so the dashboard can populate Pinned & Goals without a second network call
  var strippedTopics = topics.map(stripRow);

  return successResponse({
    user: publicUser(user), kpis: kpis, modules: moduleCards,
    review_summary: { due_today: dueToday, overdue: overdue },
    topics: strippedTopics
  });
}

function actionAnalytics(user) {
  var modules = getModulesRows().map(stripRow);
  var topics = getTopicsByUser(user.id);

  var progressByModule = modules.map(function(m) {
    var mTopics = getTopicsByModule(topics, m.id);
    return { module_id: m.id, name_en: m.name_en, name_ar: m.name_ar, progress: averageProgress(mTopics), total: mTopics.length };
  });

  var byStatus = {};
  STATUS_VALUES.forEach(function(s) { byStatus[s] = countByStatus(topics, s); });
  var byPriority = {};
  PRIORITY_VALUES.forEach(function(p) { byPriority[p] = getTopicsByPriority(topics, p).length; });

  var gapsByModule = modules.map(function(m) {
    var gaps = getTopicsByModule(topics, m.id).filter(function(t) { return t.status !== 'Mastered' && t.status !== 'Practiced'; }).length;
    return { module_id: m.id, name_en: m.name_en, name_ar: m.name_ar, gaps: gaps };
  });

  var sorted = progressByModule.filter(function(m) { return m.total > 0; }).slice().sort(function(a, b) { return b.progress - a.progress; });

  var reviews = readAllRows(SHEET_NAMES.REVIEWS).filter(function(r) { return r.user_id === user.id; });
  var timeline = topics.filter(function(t) { return t.completed_at; })
    .map(function(t) { return { topic: t.topic, module_id: t.module_id, completed_at: t.completed_at }; })
    .sort(function(a, b) { return new Date(a.completed_at) - new Date(b.completed_at); });

  // Weekly activity heatmap: count topics updated per day for past 52 weeks
  var weeklyActivity = buildWeeklyActivity(topics, reviews);

  // Month-over-month progress: last 6 months, how many topics moved to Mastered/Practiced per month
  var monthlyProgress = buildMonthlyProgress(topics);

  return successResponse({
    progress_by_module: progressByModule, topics_by_status: byStatus, topics_by_priority: byPriority,
    knowledge_gaps_by_module: gapsByModule, mastered_total: byStatus['Mastered'],
    strongest_modules: sorted.slice(0, 3), weakest_modules: sorted.slice(-3).reverse(),
    topics_needing_review: topics.filter(function(t) { return t.next_review && new Date(t.next_review) <= new Date(); }).length,
    learning_over_time: timeline, total_reviews: reviews.length,
    weekly_activity: weeklyActivity, monthly_progress: monthlyProgress
  });
}

function buildWeeklyActivity(topics, reviews) {
  var countsByDate = {};
  topics.forEach(function(t) {
    if (t.updated_at) { var d = t.updated_at.substring(0, 10); countsByDate[d] = (countsByDate[d] || 0) + 1; }
  });
  reviews.forEach(function(r) {
    if (r.review_date) { var d = r.review_date.substring(0, 10); countsByDate[d] = (countsByDate[d] || 0) + 1; }
  });
  var result = [];
  var today = new Date();
  for (var i = 363; i >= 0; i--) {
    var d = new Date(today); d.setDate(d.getDate() - i);
    var key = d.toISOString().substring(0, 10);
    result.push({ date: key, count: countsByDate[key] || 0 });
  }
  return result;
}

function buildMonthlyProgress(topics) {
  var months = {};
  topics.forEach(function(t) {
    if (t.completed_at) {
      var m = t.completed_at.substring(0, 7); // 'YYYY-MM'
      months[m] = (months[m] || 0) + 1;
    }
    if (t.updated_at && (t.status === 'Learning' || t.status === 'Understood' || t.status === 'Practiced')) {
      var m2 = t.updated_at.substring(0, 7);
      months[m2] = (months[m2] || 0) + 0.5; // partial credit for in-progress
    }
  });
  var result = [];
  var now = new Date();
  for (var i = 5; i >= 0; i--) {
    var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    var label = d.toLocaleString('en', { month: 'short' }) + ' ' + d.getFullYear();
    result.push({ month: key, label: label, count: Math.round(months[key] || 0) });
  }
  return result;
}

function computeKpis(topics) {
  return {
    overall_progress: averageProgress(topics), total_topics: topics.length,
    not_started: countByStatus(topics, 'Not Started'), learning: countByStatus(topics, 'Learning'),
    understood: countByStatus(topics, 'Understood'), practiced: countByStatus(topics, 'Practiced'),
    mastered: countByStatus(topics, 'Mastered'),
    knowledge_gaps: topics.filter(function(t) { return t.status === 'Not Started' || t.status === 'Learning'; }).length,
    topics_to_review: topics.filter(function(t) { return t.next_review && new Date(t.next_review) <= new Date(); }).length
  };
}
function averageProgress(topics) {
  if (!topics.length) return 0;
  var sum = topics.reduce(function(acc, t) { return acc + (Number(t.progress) || 0); }, 0);
  return Math.round(sum / topics.length);
}
function countByStatus(topics, status) { return topics.filter(function(t) { return t.status === status; }).length; }
function isSameDay(isoDate, refDate) {
  if (!isoDate) return false;
  var d = new Date(isoDate);
  return d.getFullYear() === refDate.getFullYear() && d.getMonth() === refDate.getMonth() && d.getDate() === refDate.getDate();
}

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------

function actionAdminUsers(user) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var users = getUsersRows().map(stripRow);
  var topics = getTopicsRows(); // one read, reused for every user's stats below
  var result = users.map(function(u) {
    var uTopics = topics.filter(function(t) { return t.user_id === u.id; });
    return {
      id: u.id, full_name: u.full_name, username: u.username, email: u.email,
      role: u.role, active: u.active, created_at: u.created_at, last_login: u.last_login,
      total_topics: uTopics.length, overall_progress: averageProgress(uTopics)
    };
  });
  var thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  var newUsers = users.filter(function(u) { return u.created_at && new Date(u.created_at) > thirtyDaysAgo; }).length;
  var activeUsers = users.filter(function(u) { return u.active === true || u.active === 'TRUE'; }).length;
  return successResponse({ users: result, total_users: users.length, active_users: activeUsers, new_users: newUsers });
}

// ---------------------------------------------------------------------------
// SETUP / SEEDING / SCHEMA MIGRATION
// ---------------------------------------------------------------------------

function setupSpreadsheet() {
  resetRequestCache();
  createSheetsIfMissing();
  seedModulesAndCategories();
  PropertiesService.getScriptProperties().setProperty('SCHEMA_VERSION', SCHEMA_VERSION_TARGET);
  Logger.log('Setup complete.');
}

function actionSeed() {
  createSheetsIfMissing();
  var result = seedModulesAndCategories();
  return successResponse(result, 'Modules and categories seeded.');
}

// ---------------------------------------------------------------------------
// KEEPALIVE — prevents GAS cold starts
// ---------------------------------------------------------------------------
//
// SETUP (one-time, in GAS editor):
//   1. Open the Apps Script editor
//   2. Run setupKeepaliveTrigger() ONCE from the editor (Run → Run function)
//   3. Done — GAS will self-ping every 4 minutes, eliminating cold starts
//
// To remove: delete the trigger in GAS → Triggers panel.
// ---------------------------------------------------------------------------

function keepAlive() {
  // Lightweight no-op — just wakes up the GAS instance.
  // Called by a time-based trigger every 4 minutes.
  Logger.log('keepAlive ping: ' + new Date().toISOString());
}

function setupKeepaliveTrigger() {
  // Remove any existing keepAlive triggers first (avoid duplicates)
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'keepAlive') ScriptApp.deleteTrigger(t);
  });
  // Create a new trigger: every 4 minutes
  ScriptApp.newTrigger('keepAlive')
    .timeBased()
    .everyMinutes(4)
    .create();
  Logger.log('keepAlive trigger created — runs every 4 minutes.');
}

function removeKeepaliveTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'keepAlive') ScriptApp.deleteTrigger(t);
  });
  Logger.log('keepAlive trigger removed.');
}


function createSheetsIfMissing() {
  var spreadsheet = ss();
  var schemas = {
    Users: ['id', 'full_name', 'username', 'email', 'password_hash', 'role', 'active', 'language', 'created_at', 'last_login', 'digest_enabled'],
    Sessions: ['session_id', 'user_id', 'created_at', 'expires_at', 'active', 'last_activity'],
    Modules: ['id', 'name_ar', 'name_en', 'description', 'active'],
    Categories: ['id', 'module_id', 'name_ar', 'name_en', 'description', 'active', 'created_at', 'updated_at'],
    Topics: ['id', 'user_id', 'module_id', 'category_id', 'topic', 'description', 'priority', 'status', 'progress', 'created_at', 'updated_at', 'completed_at', 'last_review', 'next_review', 'tags', 'pinned', 'target_date'],
    Knowledge: ['id', 'user_id', 'topic_id', 'what_i_know', 'what_i_dont_know', 'what_i_need_to_learn', 'business_understanding', 'erp_understanding', 'practical_experience', 'notes', 'updated_at'],
    Reviews: ['id', 'user_id', 'topic_id', 'review_date', 'understanding', 'notes'],
    Notes: ['id', 'user_id', 'module_id', 'title', 'section_name', 'content', 'created_at', 'updated_at', 'tags', 'pinned', 'image_url'],
    Streaks: ['user_id', 'date', 'activity_count', 'streak_count'],
    EmailLogs: ['user_id', 'sent_at', 'status', 'error_message'],
    AI_Insights: ['id', 'user_id', 'module_id', 'title', 'type', 'content', 'example', 'why_it_matters', 'generated_at', 'date_key', 'model', 'language'],
    AI_Favorites: ['id', 'user_id', 'insight_id', 'module_id', 'title', 'type', 'content', 'example', 'why_it_matters', 'created_at']
  };
  Object.keys(schemas).forEach(function(name) {
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, schemas[name].length).setValues([schemas[name]]);
      sheet.setFrozenRows(1);
    }
  });
  var def = spreadsheet.getSheetByName('Sheet1');
  if (def && def.getLastRow() === 0 && spreadsheet.getSheets().length > 1) spreadsheet.deleteSheet(def);
}

// Adds any missing columns to a sheet that already has data, WITHOUT
// touching existing rows/columns — safe to run against a live, populated
// spreadsheet from an earlier version of this app.
function migrateAddMissingColumns(sheetName, columnsToEnsure, defaults) {
  var spreadsheet = SpreadsheetApp.openById(getSheetId());
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) return; // not created yet — a fresh setupSpreadsheet() already writes the full schema

  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var missing = columnsToEnsure.filter(function(c) { return headers.indexOf(c) === -1; });
  if (!missing.length) return;

  sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    missing.forEach(function(col, idx) {
      var colIndex = lastCol + idx + 1;
      var defaultVal = defaults.hasOwnProperty(col) ? defaults[col] : '';
      var fill = [];
      for (var r = 0; r < lastRow - 1; r++) fill.push([defaultVal]);
      sheet.getRange(2, colIndex, lastRow - 1, 1).setValues(fill);
    });
  }
}

// Runs at most once per deployment (guarded by a Script Property), so on
// every subsequent request this is a single fast PropertiesService read —
// not a Sheets call. Existing data is never deleted, only new columns with
// safe defaults are appended when missing.
function ensureSchema() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('SCHEMA_VERSION') === SCHEMA_VERSION_TARGET) return;

  createSheetsIfMissing();
  migrateAddMissingColumns(SHEET_NAMES.USERS, ['language', 'digest_enabled'], { language: 'en', digest_enabled: true });
  migrateAddMissingColumns(SHEET_NAMES.CATEGORIES, ['description', 'created_at', 'updated_at'], { description: '', created_at: '', updated_at: '' });
  migrateAddMissingColumns(SHEET_NAMES.NOTES, ['tags', 'pinned', 'image_url'], { tags: '', pinned: false, image_url: '' });
  migrateAddMissingColumns(SHEET_NAMES.TOPICS, ['tags', 'pinned', 'target_date'], { tags: '', pinned: false, target_date: '' });

  invalidateHeadersCache(SHEET_NAMES.USERS);
  invalidateHeadersCache(SHEET_NAMES.CATEGORIES);
  invalidateHeadersCache(SHEET_NAMES.NOTES);
  invalidateHeadersCache(SHEET_NAMES.TOPICS);
  invalidateUsersIndex();
  invalidateCategoriesCache();

  props.setProperty('SCHEMA_VERSION', SCHEMA_VERSION_TARGET);
}

function seedModulesAndCategories() {
  var existingModules = readAllRows(SHEET_NAMES.MODULES);
  if (existingModules.length > 0) return { modules: existingModules.length, skipped: true };

  var data = [
    { en: 'Inventory', ar: 'المخزون', cats: ['Products','Warehouses','Locations','Stock Operations','Receipts','Deliveries','Internal Transfers','Inventory Adjustments','Inventory Valuation','Lots','Serial Numbers','Reordering','Stock Rules','Reports','Configuration'] },
    { en: 'Accounting', ar: 'الحسابات', cats: ['Chart of Accounts','Journal Entries','Accounts Receivable','Accounts Payable','Payments','Bank','Cash','Taxes','VAT','Cost Centers','Budgets','Reconciliation','Closing','Financial Reports'] },
    { en: 'Maintenance', ar: 'الصيانة', cats: ['Maintenance Requests','Equipment','Preventive Maintenance','Corrective Maintenance','Maintenance Plans','Work Orders','Spare Parts','Maintenance Costs','Downtime','Maintenance KPIs','Reports'] },
    { en: 'Assets', ar: 'الأصول', cats: ['Asset Registration','Asset Categories','Asset Acquisition','Asset Capitalization','Depreciation','Asset Disposal','Asset Transfer','Asset Revaluation','Asset Reports'] },
    { en: 'Transportation', ar: 'النقليات', cats: ['Vehicles','Drivers','Vehicle Types','Transportation Requests','Trips','Routes','Fuel','Maintenance','Transportation Costs','Delivery','Vehicle Expenses','Reports'] },
    { en: 'HR', ar: 'الموارد البشرية', cats: ['Employees','Departments','Contracts','Attendance','Leaves','Payroll','Recruitment','Employee Documents','Performance','Training','End of Service','HR Reports'] },
    { en: 'Real Estate', ar: 'العقارات', cats: ['Properties','Units','Buildings','Owners','Tenants','Contracts','Rent','Payments','Maintenance','Vacancies','Property Expenses','Property Reports'] },
    { en: 'Contracting', ar: 'المقاولات', cats: ['Projects','Contracts','BOQ','Activities','Subcontractors','Materials','Equipment','Labor','Costs','Progress','Invoices','Retention','Variations','Project Profitability','Reports'] },
    { en: 'Fuel Stations', ar: 'الوقود', cats: ['Stations','Fuel Types','Tanks','Pumps','Nozzles','Fuel Purchases','Fuel Sales','Stock','Tank Readings','Pump Readings','Shifts','Cash Collection','Expenses','Fuel Variance','Reports'] },
    { en: 'Law Firm', ar: 'المحاماة', cats: ['Clients','Cases','Lawyers','Case Types','Court Sessions','Case Documents','Legal Tasks','Hearings','Contracts','Fees','Payments','Expenses','Case Status','Legal Reports'] }
  ];

  var moduleRows = [];
  var categoryRows = [];
  var now = nowIso();
  data.forEach(function(m) {
    var moduleId = generateId('MOD');
    moduleRows.push({ id: moduleId, name_ar: m.ar, name_en: m.en, description: '', active: true });
    m.cats.forEach(function(catName) {
      categoryRows.push({
        id: generateId('CAT'), module_id: moduleId, name_ar: catName, name_en: catName,
        description: '', active: true, created_at: now, updated_at: now
      });
    });
  });

  // Batch writes: ONE setValues() call for all modules, ONE for all
  // categories — instead of ~150 individual appendRow() calls.
  appendRowsBatch(SHEET_NAMES.MODULES, moduleRows);
  appendRowsBatch(SHEET_NAMES.CATEGORIES, categoryRows);
  invalidateModulesCache();
  invalidateCategoriesCache();

  return { modules: moduleRows.length, categories: categoryRows.length };
}

// Starter demo topic for a brand-new user so the UI isn't empty on first
// login. Every other topic is added by the user themselves.
function seedDemoTopicsForUser(userId) {
  var modules = getModulesRows();
  if (!modules.length) return;
  var inventory = modules.filter(function(m) { return m.name_en === 'Inventory'; })[0] || modules[0];
  var categories = getCategoriesRows().filter(function(c) { return c.module_id === inventory.id; });
  var cat = categories[0] || null;

  appendRow(SHEET_NAMES.TOPICS, {
    id: generateId('TOP'), user_id: userId, module_id: inventory.id, category_id: cat ? cat.id : '',
    topic: 'Stock Valuation', description: 'FIFO vs Average Cost and how it flows into accounting.',
    priority: 'Medium', status: 'Not Started', progress: 0,
    created_at: nowIso(), updated_at: nowIso(), completed_at: '', last_review: '', next_review: ''
  });
}

function actionBatch(user, payload, token) {
  var requests = payload && payload.requests;
  if (!Array.isArray(requests)) return errorResponse('Batch requests array required.', 'INVALID_BATCH');
  var results = {};
  for (var i = 0; i < requests.length; i++) {
    var req = requests[i];
    if (!req || !req.action) continue;
    var res = handleRequest(req.action, req.payload || {}, token);
    try {
      var parsed = JSON.parse(res.getContent());
      results[req.action] = parsed.data;
    } catch (e) {
      results[req.action] = null;
    }
  }
  return successResponse(results);
}

// ---------------------------------------------------------------------------
// FEATURE 1: STREAK COUNTER ENGINE
// ---------------------------------------------------------------------------

function recordActivity(userId) {
  if (!userId) return;
  try {
    var todayStr = new Date().toISOString().slice(0, 10);
    var streaks = readAllRows(SHEET_NAMES.STREAKS).filter(function(s) { return s.user_id === userId; });
    var todayRow = null;
    for (var i = 0; i < streaks.length; i++) {
      if (streaks[i].date === todayStr) { todayRow = streaks[i]; break; }
    }

    if (todayRow) {
      updateRowByObj(SHEET_NAMES.STREAKS, todayRow, { activity_count: (Number(todayRow.activity_count) || 0) + 1 });
    } else {
      var dateSet = {};
      streaks.forEach(function(s) { if (s.date) dateSet[s.date] = true; });
      dateSet[todayStr] = true;

      var cur = new Date();
      var streakCount = 0;
      while (true) {
        var dStr = cur.toISOString().slice(0, 10);
        if (dateSet[dStr]) {
          streakCount++;
          cur.setDate(cur.getDate() - 1);
        } else {
          break;
        }
      }

      appendRow(SHEET_NAMES.STREAKS, {
        user_id: userId,
        date: todayStr,
        activity_count: 1,
        streak_count: streakCount
      });
    }
    cacheRemove('streak:' + userId);
  } catch(e) {
    Logger.log('recordActivity error: ' + e.message);
  }
}

function actionGetStreak(user) {
  var key = 'streak:' + user.id;
  var cached = cacheGet(key);
  if (cached) return successResponse(cached);

  var rows = readAllRows(SHEET_NAMES.STREAKS).filter(function(s) { return s.user_id === user.id; });
  var todayStr = new Date().toISOString().slice(0, 10);
  var dateMap = {};
  var maxStreak = 0;
  var currentStreak = 0;

  rows.forEach(function(s) {
    if (s.date) dateMap[s.date] = s;
    var sc = Number(s.streak_count) || 0;
    if (sc > maxStreak) maxStreak = sc;
  });

  var cur = new Date();
  while (true) {
    var dStr = cur.toISOString().slice(0, 10);
    if (dateMap[dStr]) {
      currentStreak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }

  var last7 = [];
  for (var d = 6; d >= 0; d--) {
    var dt = new Date();
    dt.setDate(dt.getDate() - d);
    var dStr = dt.toISOString().slice(0, 10);
    last7.push({ date: dStr, active: !!dateMap[dStr] });
  }

  var result = {
    current_streak: currentStreak,
    longest_streak: Math.max(maxStreak, currentStreak),
    last_7_days: last7
  };

  cachePut(key, result, 3600);
  return successResponse(result);
}

// ---------------------------------------------------------------------------
// FEATURE 4: WEEKLY EMAIL DIGEST
// ---------------------------------------------------------------------------

function actionSendTestDigest(user) {
  try {
    if (!user || !user.email) return errorResponse('User email is missing.', 'MISSING_EMAIL');
    sendWeeklyDigestForUser(user);
    return successResponse({ sent: true, recipient: user.email }, 'Test digest email sent to ' + user.email);
  } catch (err) {
    return errorResponse('Failed to send email: ' + err.message, 'EMAIL_FAILED');
  }
}

function sendWeeklyDigest() {
  var users = getUsersRows().filter(function(u) {
    return (u.active === true || u.active === 'TRUE') && u.digest_enabled !== false && u.digest_enabled !== 'FALSE';
  });
  users.forEach(function(user) {
    try {
      sendWeeklyDigestForUser(user);
    } catch(err) {
      appendRow(SHEET_NAMES.EMAIL_LOGS, {
        user_id: user.id,
        sent_at: nowIso(),
        status: 'error',
        error_message: err.message
      });
    }
  });
}

function sendWeeklyDigestForUser(user) {
  var topics = getTopicsByUser(user.id);
  var masteredThisWeek = topics.filter(function(t) {
    if (t.status !== 'Mastered' || !t.completed_at) return false;
    var d = new Date(t.completed_at);
    return (new Date() - d) <= (7 * 24 * 60 * 60 * 1000);
  }).length;

  var reviews = readAllRows(SHEET_NAMES.REVIEWS).filter(function(r) {
    return r.user_id === user.id && (new Date() - new Date(r.review_date)) <= (7 * 24 * 60 * 60 * 1000);
  }).length;

  var dueNextWeek = topics.filter(function(t) {
    if (!t.next_review) return false;
    var nr = new Date(t.next_review);
    var now = new Date();
    var next7 = new Date(); next7.setDate(next7.getDate() + 7);
    return nr >= now && nr <= next7;
  }).length;

  var streakRes = actionGetStreak(user);
  var streakData = (streakRes && streakRes.data) ? streakRes.data : { current_streak: 0 };
  var overallProgress = averageProgress(topics);
  var isAr = user.language === 'ar';

  var clientUrl = (typeof CONFIG_CLIENT_URL !== 'undefined' && CONFIG_CLIENT_URL) ? CONFIG_CLIENT_URL : '#';
  var subject = isAr ? '📊 الملخص الأسبوعي لتعلّم ERP - ' + user.full_name : '📊 Your Weekly ERP Learning Digest - ' + user.full_name;

  var htmlBody = isAr ?
    '<div dir="rtl" style="font-family:sans-serif; color:#333; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px;">' +
      '<h2 style="color:#b5772e;">📊 الملخص الأسبوعي لتقدم التعلّم</h2>' +
      '<p>أهلاً <strong>' + user.full_name + '</strong>، إليك ملخص نشاطك في تعلّم موديولات الـ ERP خلال الأسبوع الماضي:</p>' +
      '<ul>' +
        '<li>🔥 <strong>سلسلة التعلّم الحالية:</strong> ' + streakData.current_streak + ' يوم متواصل</li>' +
        '<li>📈 <strong>التقدم الإجمالي:</strong> ' + overallProgress + '%</li>' +
        '<li>✅ <strong>مواضيع تم إتقانها هذا الأسبوع:</strong> ' + masteredThisWeek + '</li>' +
        '<li>🔄 <strong>مراجعات تمت هذا الأسبوع:</strong> ' + reviews + '</li>' +
        '<li>📅 <strong>مواضيع مستحقة للمراجعة الأسبوع القادم:</strong> ' + dueNextWeek + '</li>' +
      '</ul>' +
      '<p style="margin-top:20px;"><a href="' + clientUrl + '" style="background:#b5772e; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block;">افتح المنصة وواصل التعلّم</a></p>' +
    '</div>' :
    '<div style="font-family:sans-serif; color:#333; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px;">' +
      '<h2 style="color:#b5772e;">📊 Your Weekly ERP Learning Digest</h2>' +
      '<p>Hi <strong>' + user.full_name + '</strong>, here is your learning activity summary for the past week:</p>' +
      '<ul>' +
        '<li>🔥 <strong>Current Study Streak:</strong> ' + streakData.current_streak + ' days</li>' +
        '<li>📈 <strong>Overall Progress:</strong> ' + overallProgress + '%</li>' +
        '<li>✅ <strong>Topics Mastered This Week:</strong> ' + masteredThisWeek + '</li>' +
        '<li>🔄 <strong>Reviews Completed This Week:</strong> ' + reviews + '</li>' +
        '<li>📅 <strong>Topics Due for Review Next Week:</strong> ' + dueNextWeek + '</li>' +
      '</ul>' +
      '<p style="margin-top:20px;"><a href="' + clientUrl + '" style="background:#b5772e; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block;">Open Tracker &amp; Keep Learning</a></p>' +
    '</div>';

  MailApp.sendEmail({
    to: user.email,
    subject: subject,
    htmlBody: htmlBody
  });

  appendRow(SHEET_NAMES.EMAIL_LOGS, {
    user_id: user.id,
    sent_at: nowIso(),
    status: 'success',
    error_message: ''
  });
}

function setupWeeklyDigestTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'sendWeeklyDigest') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendWeeklyDigest')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}

// ---------------------------------------------------------------------------
// FEATURE 5: DATA EXPORT & IMPORT (JSON BACKUP)
// ---------------------------------------------------------------------------

function actionExportMyData(user) {
  var topics = getTopicsByUser(user.id).map(stripRow);
  var topicIds = {};
  topics.forEach(function(t) { topicIds[t.id] = true; });

  var knowledge = readAllRows(SHEET_NAMES.KNOWLEDGE)
    .filter(function(k) { return k.user_id === user.id || topicIds[k.topic_id]; })
    .map(stripRow);

  var reviews = readAllRows(SHEET_NAMES.REVIEWS)
    .filter(function(r) { return r.user_id === user.id || topicIds[r.topic_id]; })
    .map(stripRow);

  var notes = readAllRows(SHEET_NAMES.NOTES)
    .filter(function(n) { return n.user_id === user.id; })
    .map(stripRow);

  var streaks = readAllRows(SHEET_NAMES.STREAKS)
    .filter(function(s) { return s.user_id === user.id; })
    .map(stripRow);

  return successResponse({
    user: publicUser(user),
    topics: topics,
    knowledge: knowledge,
    reviews: reviews,
    notes: notes,
    streaks: streaks,
    exported_at: nowIso()
  });
}

function actionImportMyData(user, payload) {
  if (!payload || typeof payload !== 'object') return errorResponse('Invalid backup payload.', 'INVALID_PAYLOAD');

  deleteRowsByUser(SHEET_NAMES.TOPICS, user.id);
  deleteRowsByUser(SHEET_NAMES.KNOWLEDGE, user.id);
  deleteRowsByUser(SHEET_NAMES.REVIEWS, user.id);
  deleteRowsByUser(SHEET_NAMES.NOTES, user.id);
  deleteRowsByUser(SHEET_NAMES.STREAKS, user.id);

  var topics = Array.isArray(payload.topics) ? payload.topics : [];
  var knowledge = Array.isArray(payload.knowledge) ? payload.knowledge : [];
  var reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
  var notes = Array.isArray(payload.notes) ? payload.notes : [];
  var streaks = Array.isArray(payload.streaks) ? payload.streaks : [];

  topics.forEach(function(t) { t.user_id = user.id; });
  knowledge.forEach(function(k) { k.user_id = user.id; });
  reviews.forEach(function(r) { r.user_id = user.id; });
  notes.forEach(function(n) { n.user_id = user.id; });
  streaks.forEach(function(s) { s.user_id = user.id; });

  appendRowsBatch(SHEET_NAMES.TOPICS, topics);
  appendRowsBatch(SHEET_NAMES.KNOWLEDGE, knowledge);
  appendRowsBatch(SHEET_NAMES.REVIEWS, reviews);
  appendRowsBatch(SHEET_NAMES.NOTES, notes);
  appendRowsBatch(SHEET_NAMES.STREAKS, streaks);

  invalidateTopicsCache();
  invalidateCategoriesCache();

  return successResponse({
    imported_topics: topics.length,
    imported_knowledge: knowledge.length,
    imported_reviews: reviews.length,
    imported_notes: notes.length,
    imported_streaks: streaks.length
  }, 'Backup imported successfully.');
}

function deleteRowsByUser(sheetName, userId) {
  var sheet = sheetOf(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var rows = readAllRows(sheetName);
  for (var i = rows.length - 1; i >= 0; i--) {
    if (rows[i].user_id === userId) {
      sheet.deleteRow(rows[i].__row);
    }
  }
}

function todayIsoDate() {
  return new Date().toISOString().substring(0, 10);
}

// ---------------------------------------------------------------------------
// AI DAILY INSIGHTS & FAVORITES SERVICE
// ---------------------------------------------------------------------------

function getAISetting(key, defaultValue) {
  var props = PropertiesService.getScriptProperties();
  var val = props.getProperty(key);
  return (val !== null && val !== undefined && val !== '') ? val : defaultValue;
}

function callAI(messages) {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('AI_API_KEY') || 'YOUR_SECRET_KEY';
  var endpoint = props.getProperty('AI_API_ENDPOINT') || 'https://router.bynara.id/v1';
  var model = props.getProperty('AI_MODEL') || 'gemini-3.6-medium';
  var temperature = Number(props.getProperty('AI_TEMPERATURE')) || 0.7;
  var maxTokens = Number(props.getProperty('AI_MAX_TOKENS')) || 1500;

  var url = endpoint.replace(/\/+$/, '') + '/chat/completions';

  var payload = {
    model: model,
    messages: messages,
    temperature: temperature,
    max_tokens: maxTokens
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code = response.getResponseCode();
  var text = response.getContentText();

  if (code < 200 || code >= 300) {
    throw new Error('AI Service error (HTTP ' + code + '): ' + text.substring(0, 200));
  }

  var data = JSON.parse(text);
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error('Invalid AI response payload.');
}

function actionTestAIConnection(user) {
  var prompt = [
    { role: 'system', content: 'You are an ERP business analyst.' },
    { role: 'user', content: 'Say "OK" in JSON format: {"status": "ok"}' }
  ];
  var raw = callAI(prompt);
  return successResponse({ status: 'ok', raw: raw }, 'AI connection successful.');
}

function actionGetAISettings(user) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('AI_API_KEY') || '';
  var masked = apiKey ? (apiKey.substring(0, 6) + '************') : '••••••••••••••••';
  return successResponse({
    endpoint: props.getProperty('AI_API_ENDPOINT') || 'https://router.bynara.id/v1',
    model: props.getProperty('AI_MODEL') || 'gemini-3.6-medium',
    masked_key: masked,
    daily_count: Number(props.getProperty('AI_DAILY_COUNT')) || 5,
    enabled: props.getProperty('AI_ENABLED') !== 'false'
  });
}

function actionUpdateAISettings(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin access required.', 'ADMIN_REQUIRED');
  var props = PropertiesService.getScriptProperties();

  if (payload.api_endpoint) props.setProperty('AI_API_ENDPOINT', String(payload.api_endpoint).trim());
  if (payload.model) props.setProperty('AI_MODEL', String(payload.model).trim());
  if (payload.api_key && String(payload.api_key).trim()) {
    props.setProperty('AI_API_KEY', String(payload.api_key).trim());
  }
  if (payload.daily_count) props.setProperty('AI_DAILY_COUNT', String(payload.daily_count));
  props.setProperty('AI_ENABLED', payload.enabled !== false ? 'true' : 'false');

  return successResponse(null, 'AI Settings updated successfully.');
}

function actionGetModuleInsights(user, payload) {
  var moduleId = payload.module_id;
  if (!moduleId) return errorResponse('Module ID is required.', 'MODULE_REQUIRED');

  var dateKey = todayIsoDate();
  var lang = user.language || payload.language || 'ar';

  var rows = readAllRows(SHEET_NAMES.AI_INSIGHTS);
  var saved = rows.filter(function(r) {
    return String(r.user_id) === String(user.id) &&
           String(r.module_id) === String(moduleId) &&
           String(r.date_key) === dateKey &&
           String(r.language || 'ar') === lang;
  }).map(stripRow);

  if (saved.length > 0) {
    return successResponse({ insights: saved });
  }

  return generateModuleInsights(user, moduleId, lang, dateKey);
}

function actionRefreshModuleInsights(user, payload) {
  var moduleId = payload.module_id;
  if (!moduleId) return errorResponse('Module ID is required.', 'MODULE_REQUIRED');
  var dateKey = todayIsoDate();
  var lang = user.language || payload.language || 'ar';
  return generateModuleInsights(user, moduleId, lang, dateKey);
}

function generateModuleInsights(user, moduleId, lang, dateKey) {
  var topics = getTopicsByUser(user.id).filter(function(t) { return t.module_id === moduleId; });
  var gaps = topics.filter(function(t) { return t.status !== 'Mastered' && t.status !== 'Practiced'; });

  var topicNames = topics.map(function(t) { return t.topic; }).join(', ');
  var gapNames = gaps.map(function(t) { return t.topic; }).join(', ');

  var pastRows = readAllRows(SHEET_NAMES.AI_INSIGHTS).filter(function(r) {
    return String(r.user_id) === String(user.id) && String(r.module_id) === String(moduleId);
  });
  var pastTitles = pastRows.map(function(r) { return r.title; }).slice(-10).join('; ');

  var count = Number(getAISetting('AI_DAILY_COUNT', '5')) || 5;
  var model = getAISetting('AI_MODEL', 'gemini-3.6-medium');

  var isAr = lang === 'ar';
  var systemPrompt = isAr
    ? 'أنت محلل أعمال واستشاري أنظمة ERP متخصص وخبير في العمليات اللوجستية والمالية والإدارية. قم بتوليد نصائح ورؤى عملية، مختصرة، دقيقة وحقيقية 100% بدون أي ابتكار لقوانين أو نسب غير صحيحة.'
    : 'You are an expert ERP Business Analyst and Functional Consultant. Generate practical, concise, highly accurate ERP insights without fabricating rules or tax rates.';

  var userPrompt = 'Module: ' + moduleId + '\n' +
    'User Topics: ' + (topicNames || 'None yet') + '\n' +
    'Knowledge Gaps: ' + (gapNames || 'None') + '\n' +
    'Previously Generated Insights to avoid repeating: ' + (pastTitles || 'None') + '\n\n' +
    'Generate exactly ' + count + ' unique ERP insights for this module in ' + (isAr ? 'Arabic' : 'English') + '.\n' +
    'Types must be chosen from: Tip, Trick, Business Insight, Common Mistake, Best Practice, Warning, Accounting Impact, Process Insight.\n\n' +
    'Return ONLY a valid JSON array of objects with the exact key structure:\n' +
    '[\n' +
    '  {\n' +
    '    "title": "short title",\n' +
    '    "type": "Tip",\n' +
    '    "content": "detailed explanation",\n' +
    '    "example": "practical example",\n' +
    '    "why_it_matters": "why this is important"\n' +
    '  }\n' +
    ']';

  var messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  var parsedList = [];
  try {
    var rawAiRes = callAI(messages);
    var cleanJson = rawAiRes.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      parsedList = JSON.parse(cleanJson);
    } catch (e) {
      var match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) parsedList = JSON.parse(match[0]);
    }
  } catch (err) {
    Logger.log('AI Service call failed, using curated fallback insights: ' + err.message);
    parsedList = getFallbackInsights(moduleId, lang);
  }

  if (!Array.isArray(parsedList) || !parsedList.length) {
    parsedList = getFallbackInsights(moduleId, lang);
  }

  var nowStr = nowIso();
  var newRows = parsedList.map(function(item) {
    var id = generateId('AI');
    var rowObj = {
      id: id,
      user_id: user.id,
      module_id: moduleId,
      title: item.title || 'ERP Insight',
      type: item.type || 'Tip',
      content: item.content || '',
      example: item.example || '',
      why_it_matters: item.why_it_matters || '',
      generated_at: nowStr,
      date_key: dateKey,
      model: model,
      language: lang
    };
    appendRow(SHEET_NAMES.AI_INSIGHTS, rowObj);
    return rowObj;
  });

  return successResponse({ insights: newRows });
}

function getFallbackInsights(moduleId, lang) {
  var isAr = lang === 'ar';
  var modNameEn = '';
  var modNameAr = '';

  try {
    var modules = readAllRows(SHEET_NAMES.MODULES);
    var foundMod = modules.find(function(m) { return String(m.id) === String(moduleId); });
    if (foundMod) {
      modNameEn = foundMod.name_en || '';
      modNameAr = foundMod.name_ar || '';
    }
  } catch (e) {}

  var modLower = (String(moduleId || '') + ' ' + modNameEn + ' ' + modNameAr).toLowerCase();

  // 1. Inventory (المخزون)
  if (modLower.indexOf('inventory') !== -1 || modLower.indexOf('mod-1') !== -1 || modLower.indexOf('مخزون') !== -1) {
    return [
      {
        title: isAr ? 'الربط التلقائي بين تقييم المخزون والقيود المحاسبية' : 'Automated Inventory Valuation & Journal Entries',
        type: 'Accounting Impact',
        content: isAr ? 'عند اختيار طريقة FIFO أو Average Cost، تأكد من ضبط إعدادات الفئات (Product Categories) على "Automated" لترحيل قيود كلفة البضاعة المباعة (COGS) وحساب الفروقات فورياً مع كل حركة مخزنية.' : 'When using FIFO or Average Cost, ensure Product Categories valuation is set to Automated to trigger real-time COGS and valuation ledger entries.',
        example: isAr ? 'تسليم شحنة مبيعات يقود القيد: من ح/ كلفة البضاعة المباعة إلى ح/ المخزون.' : 'Sales delivery auto-posts: Dr COGS, Cr Inventory.',
        why_it_matters: isAr ? 'يمنع تسوية التكاليف يدوياً بنهاية الشهر ويضمن دقة القوائم المالية.' : 'Prevents manual month-end cost reconciliations and guarantees real-time balance sheet accuracy.'
      },
      {
        title: isAr ? 'فحص التسويات المخزنية (Stock Adjustments)' : 'Audit Trail on Stock Adjustments',
        type: 'Common Mistake',
        content: isAr ? 'عدم تحديد سبب التسوية المخزنية (تلف، سرقة، عينة تجارية) يجعل تتبع الخسائر صعباً على الإدارة المالية.' : 'Not recording adjustment reason codes (damage, sample, theft) obscures variance analysis in financial reporting.',
        example: isAr ? 'إنشاء حسابات مصاريف مستهدفة لكل سبب تسوية بدل حساب واحد عام.' : 'Map Scrap/Damage to specific Expense Accounts instead of a generic Loss Account.',
        why_it_matters: isAr ? 'يساعد في تقليل الهدر وزيادة رقابة المخازن.' : 'Improves internal control and inventory shrinkage visibility.'
      },
      {
        title: isAr ? 'إعادة الطلب التلقائية (Reordering Rules)' : 'Automated Reordering Rules & Buffer Safety',
        type: 'Tip',
        content: isAr ? 'حدد الحد الأدنى والأقصى لكل منتج بناءً على زمن التوريد (Lead Time) لتجنب انقطاع المخزون دون تجميد السيولة.' : 'Set Minimum and Maximum safety stock levels based on Lead Time to prevent stockouts without overcapitalizing cash.',
        example: isAr ? 'منتج بـ Lead Time 10 أيام واستهلاك يومي 5 قطع -> الحد الأدنى 50 قطعة.' : 'Lead time 10 days + 5 daily sales = Min safety stock 50 units.',
        why_it_matters: isAr ? 'رفع الكفاءة التشغيلية وحماية المبيعات من التوقف.' : 'Optimizes working capital and avoids lost sales.'
      }
    ];
  }

  // 2. Accounting (الحسابات)
  if (modLower.indexOf('account') !== -1 || modLower.indexOf('mod-2') !== -1 || modLower.indexOf('حسابات') !== -1) {
    return [
      {
        title: isAr ? 'إقفال الفترات المالية وتثبيت القيود (Period Lock)' : 'Period Lock & Journal Entry Controls',
        type: 'Best Practice',
        content: isAr ? 'قم بإغلاق الفترة المالية شهرياً لمنع تعديل القيود المحاسبية السابقة بعد اعتماد التقارير.' : 'Lock accounting periods monthly to prevent back-dated entries after financial statements approval.',
        example: isAr ? 'تحديد تاريخ الإقفال (Lock Date) في نهاية كل شهر ميلادي.' : 'Set Lock Date on the last day of each calendar month.',
        why_it_matters: isAr ? 'يحمي سلامة البيانات المالية المعتمدة أمام المراجعين والجهات الضريبية.' : 'Ensures financial integrity and compliance with external audit standards.'
      },
      {
        title: isAr ? 'تسوية الحسابات البنكية اليومية (Bank Reconciliation)' : 'Daily Automated Bank Reconciliation',
        type: 'Process Insight',
        content: isAr ? 'مطابقة التدفقات النقدية والودائع البنكية يومياً تكتشف الأخطاء والشيكات المعلقة مبكراً.' : 'Reconciling bank feeds daily catches duplicate transactions and uncollected checks early.',
        example: isAr ? 'استيراد ملفات MT940 / CAMT.053 للتسوية الآلية.' : 'Import MT940 statement files for auto-matching.',
        why_it_matters: isAr ? 'ضمان دقة الرصيد النقدي وتفادي التحايل.' : 'Guarantees accurate liquidity management and fraud protection.'
      }
    ];
  }

  // 3. HR (الموارد البشرية)
  if (modLower.indexOf('hr') !== -1 || modLower.indexOf('mod-6') !== -1 || modLower.indexOf('human') !== -1 || modLower.indexOf('بشرية') !== -1 || modLower.indexOf('موارد') !== -1) {
    return [
      {
        title: isAr ? 'حساب مكافأة نهاية الخدمة التلقائي (EOS Calculation)' : 'Automated End-of-Service (EOS) & Gratuity Rules',
        type: 'Accounting Impact',
        content: isAr ? 'تأكد من إعداد معادلات نهاية الخدمة طبقاً لقانون العمل المحلي وترحيل المخصص المحاسبي شهرياً لمواجهة الالتزامات المالية المستقبليّة.' : 'Ensure End-of-Service accrual formulas comply strictly with labor laws and auto-post monthly provision ledgers.',
        example: isAr ? 'استحقاق شهري: قيد من ح/ مخصص مكافأة نهاية الخدمة إلى ح/ مخصص مجمع الالتزام.' : 'Monthly accrual: Dr Gratuity Expense, Cr Gratuity Provision Liability.',
        why_it_matters: isAr ? 'تجنب المفاجآت المالية عند إنهاء عقود الموظفين والتأكد من دقة مخصصات الشركة.' : 'Prevents unbudgeted financial shocks upon contract terminations.'
      },
      {
        title: isAr ? 'تنبيهات انتهاء وثائق الموظفين (Document Expiry Alerts)' : 'Automated Employee Document Expiry Alerts',
        type: 'Tip',
        content: isAr ? 'تفعيل تنبيهات 30 إلى 60 يوماً قبل انتهاء الإقامات، جوازات السفر، والعقود تجنباً للغرامات الحكومية وتوقف العمل.' : 'Set auto-alerts 30-60 days prior to Iqama, Passport, and Contract renewals to eliminate government fines.',
        example: isAr ? 'إرسال إشعار تلقائي لمدير HR قبل 45 يوماً من انتهاء رخصة عمل موظف حرج.' : 'Auto-email sent to HR Manager 45 days before key engineer residency expires.',
        why_it_matters: isAr ? 'ضمان الاستمرارية القانونية والتشغيلية لكافة العاملين.' : 'Ensures 100% legal compliance and workforce continuity.'
      },
      {
        title: isAr ? 'ربط الحضور والانصراف بمسيرات الرواتب (Attendance & Payroll Sync)' : 'Attendance Sync with Automated Payroll Deduction',
        type: 'Best Practice',
        content: isAr ? 'ربط البصمة ومسيرات الرواتب تمنع الأخطاء اليدوية في احتساب التأخيرات والغياب والساعات الإضافية.' : 'Linking biometric logs directly with payroll prevents manual calculation mistakes on overtime and absences.',
        example: isAr ? 'تطبيق الخصم التلقائي لغياب بدون عذر وتأكيد ساعات Overtime المعتمدة فقط.' : 'Auto-deduct unexcused absences while approving pre-authorized overtime hours.',
        why_it_matters: isAr ? 'يوفر عشرات الساعات شهرياً لفريق الموارد البشرية ويقضي على الخلافات.' : 'Saves HR teams dozens of hours monthly and eliminates employee disputes.'
      }
    ];
  }

  // 4. Maintenance (الصيانة)
  if (modLower.indexOf('maint') !== -1 || modLower.indexOf('mod-3') !== -1 || modLower.indexOf('صيانة') !== -1) {
    return [
      {
        title: isAr ? 'جدولة الصيانة الوقائية بالعدادات (Preventive Maintenance)' : 'Meter & Meter-Hour Triggered Maintenance',
        type: 'Best Practice',
        content: isAr ? 'ربط خطط الصيانة الوقائية بساعات التشغيل (Operating Hours) أو العدادات يمنع الأعطال المفاجئة ويرفع عمر المعدات.' : 'Triggering preventive maintenance Work Orders by running hours or odometer readings prevents unexpected equipment breakdowns.',
        example: isAr ? 'إنشاء أمر صيانة تلقائي لمولد عند الوصول لـ 250 ساعة عمل.' : 'Auto-generate Work Order for generator oil change upon reaching 250 operating hours.',
        why_it_matters: isAr ? 'تخفيض تكاليف الأعطال الطارئة الكبيرة بنسبة تصل إلى 40%.' : 'Reduces emergency repair costs by up to 40%.'
      },
      {
        title: isAr ? 'ربط قطع الغيار بأوامر الشغل (Spare Parts Linking)' : 'Linking Parts Consumption to Work Orders',
        type: 'Common Mistake',
        content: isAr ? 'صرف قطع الغيار من المخزن بدون ربطها برقم أمر صيانة محدد يضيع تكلفة الصيانة الحقيقية لكل معدة.' : 'Issuing spare parts without linking them to a specific Work Order hides true maintenance costs per asset.',
        example: isAr ? 'إلزام الفني بمسح باركود القطعة وإسنادها لرقم أمر الشغل قبل الإخراج من المخزن.' : 'Require technicians to scan part barcode against active Work Order ID.',
        why_it_matters: isAr ? 'تحديد المعدات المتهالكة التي تستهلك مصاريف صيانة أعلى من قيمتها.' : 'Identifies money-pit assets consuming excessive maintenance budgets.'
      }
    ];
  }

  // 5. Assets (الأصول)
  if (modLower.indexOf('asset') !== -1 || modLower.indexOf('mod-4') !== -1 || modLower.indexOf('أصول') !== -1) {
    return [
      {
        title: isAr ? 'إهلاك الأصول الآلي شهرياً (Automated Asset Depreciation)' : 'Automated Monthly Depreciation Posting',
        type: 'Accounting Impact',
        content: isAr ? 'ضبط جداول إهلاك الأصول لتوليد القيود المحاسبية الإهلاكية آلياً بنهاية كل شهر دون تدخل يدوي.' : 'Schedule asset depreciation tables to auto-post monthly depreciation journal entries.',
        example: isAr ? 'قيد شهري تلقائي: من ح/ مصروف إهلاك الآلات إلى ح/ مجمع إهلاك الآلات.' : 'Monthly auto-entry: Dr Machinery Depreciation Expense, Cr Accumulated Depreciation.',
        why_it_matters: isAr ? 'يضمن مطابقة صافي القيمة الدفترية للأصول في الميزانية العمومية.' : 'Guarantees accurate Net Book Value on monthly balance sheets.'
      },
      {
        title: isAr ? 'الجرود السنوية بـ Barcode / RFID الأصول' : 'Asset Barcode Audit & Physical Verification',
        type: 'Tip',
        content: isAr ? 'استخدام الباركود لتطابق الأصول الميدانية مع سجل الأصول الثابتة تكتشف الأصول المفقودة أو المنقولة بدون إذن.' : 'Using barcodes for annual asset audits matches physical items with Fixed Asset Register ledgers.',
        example: isAr ? 'مسح باركود الأجهزة في فرع جديد وتحديث مواقعها الجغرافية تلقائياً.' : 'Scan asset barcodes during branch inspection to update real-time asset location tags.',
        why_it_matters: isAr ? 'حماية أصول الشركة من الفقدان والسرقة وتحسين الرقابة الداخلية.' : 'Prevents asset leakage and guarantees internal audit readiness.'
      }
    ];
  }

  // 6. Transportation (النقليات)
  if (modLower.indexOf('trans') !== -1 || modLower.indexOf('fleet') !== -1 || modLower.indexOf('mod-5') !== -1 || modLower.indexOf('نقليات') !== -1 || modLower.indexOf('مركبات') !== -1) {
    return [
      {
        title: isAr ? 'مراقبة معدل استهلاك الوقود لكل 100 كم (Fuel Consumption Ratio)' : 'Vehicle Fuel Efficiency & Theft Detection Ratio',
        type: 'Process Insight',
        content: isAr ? 'مقارنة لترات الوقود المستهلكة بالمسافة المقطوعة تكتشف سرقات الوقود أو مشاكل المحرك مبكراً.' : 'Comparing fuel liters filled against GPS distance traveled spots fuel theft or engine deterioration early.',
        example: isAr ? 'شاحنة تستهلك 35 لتر/100 كم قفز استهلاكها إلى 50 لتر -> إرسال التنبيه للصيانة والتحقيق.' : 'Truck consumption jumping from 35L/100km to 50L/100km triggers maintenance alert.',
        why_it_matters: isAr ? 'تخفيض فاتورة الوقود التي تشكل الجزء الأكبر من مصاريف النقليات.' : 'Cuts the single largest operational expense category in fleet management.'
      },
      {
        title: isAr ? 'أذون الشحن المربوطة بالمبيعات (Waybills & Freight Invoicing)' : 'Waybill Integration with Customer Freight Billing',
        type: 'Best Practice',
        content: isAr ? 'ربط رحلة السائق بأمر الشحن الإلكتروني يمنع تنفيذ الرحلات غير المفوترة ويضمن تحصيل مصاريف النقل.' : 'Linking driver trip dispatches to electronic waybills ensures zero unbilled freight trips.',
        example: isAr ? 'إصدار فاتورة شحن تلقائية للعميل فور تأكيد السائق الاستلام عبر تطبيق الجوال.' : 'Auto-generate freight invoice upon driver Proof of Delivery (POD) confirmation.',
        why_it_matters: isAr ? 'تسريع تحصيل الإيرادات ومنع تشغيل الشاحنات في رحلات خاصة غير مصرح بها.' : 'Accelerates cash collection and prevents unauthorized truck usage.'
      }
    ];
  }

  // 7. Real Estate (العقارات)
  if (modLower.indexOf('real') !== -1 || modLower.indexOf('estate') !== -1 || modLower.indexOf('mod-7') !== -1 || modLower.indexOf('عقارات') !== -1 || modLower.indexOf('عقار') !== -1) {
    return [
      {
        title: isAr ? 'توزيع الإيراد المؤجل للإيجارات (Deferred Rent Revenue)' : 'Accrual Accounting on Deferred Rental Revenue',
        type: 'Accounting Impact',
        content: isAr ? 'تحصيل الإيجار سنوياً أو نصف سنوياً يتطلب اعترافاً شهرياً متساوياً بالإيراد مع احتساب الإيراد المؤجل.' : 'Receiving annual rent upfront requires monthly linear revenue recognition via Unearned Rent Liability accounts.',
        example: isAr ? 'عقد إيجار 120,000 ريال سنوياً -> إثبات إيراد 10,000 ريال شهرياً.' : 'Annual rent 120k -> recognize 10k monthly revenue entry.',
        why_it_matters: isAr ? 'تقديم قائمة دخل دقيقة تعبر عن الأداء الفعلي لكل شهر.' : 'Presents accurate monthly profit & loss statements.'
      },
      {
        title: isAr ? 'إدارة التجديدات الشاغرة مبكراً (Vacancy & Renewal Alerts)' : 'Automated Lease Expiry & Renewal Pipeline',
        type: 'Tip',
        content: isAr ? 'تفعيل تنبيهات 60 يوماً قبل انتهاء العقود يزيد نسبة تجديد العقود وتخفيض فترات شغور الوحدات.' : 'Alerting property managers 60 days before lease expiration boosts tenant retention and drops vacancy rates.',
        example: isAr ? 'إرسال عروض التجديد الآلية عبر الإيميل/الواتساب للمستأجر قبل شهرين.' : 'Auto-send renewal terms via email/WhatsApp 60 days prior to contract expiry.',
        why_it_matters: isAr ? 'حماية التدفقات النقدية واستقرار عوائد المحفظة العقارية.' : 'Protects cash flow and stabilizes portfolio yield.'
      }
    ];
  }

  // 8. Contracting (المقاولات)
  if (modLower.indexOf('contract') !== -1 || modLower.indexOf('mod-8') !== -1 || modLower.indexOf('مقاولات') !== -1 || modLower.indexOf('مشروع') !== -1) {
    return [
      {
        title: isAr ? 'شهادات إنجاز الأعمال والمحتجزات (IPC & Retention Accounting)' : 'Interim Payment Certificate (IPC) & Retention Accounting',
        type: 'Accounting Impact',
        content: isAr ? 'إثبات المستخلصات الجارية وحسم نسبة المحتجزات (Retention 5-10%) تلقائياً لحين المستخلص النهائي.' : 'Auto-calculate progress billings and retention deductions (5-10%) until final project handover.',
        example: isAr ? 'مستخلص 500k -> 450k ح/ العملاء و 50k ح/ محتجزات عقود لدى الاستشاري.' : '500k IPC -> 450k Accounts Receivable, 50k Retention Receivable.',
        why_it_matters: isAr ? 'ضمان تتبع الأموال المحتجزة لدى ملاك المشاريع وعدم ضياعها.' : 'Guarantees accurate tracking of retention receivables due upon project closeout.'
      },
      {
        title: isAr ? 'مقارنة التكلفة الفعلية بالميزانية (BOQ Cost Variance)' : 'Bill of Quantities (BOQ) Budget vs Actual Control',
        type: 'Best Practice',
        content: isAr ? 'مقارنة تكاليف العمالة والمواد والعدات الفعلية ببند جدول الكميات (BOQ) فور تسجيل كل فاتورة أو صرفية.' : 'Comparing actual material, labor, and equipment expenses against BOQ baseline caps cost overruns early.',
        example: isAr ? 'تنبيه مدير المشروع فور تجاوز صرف مادة الخرسانة 90% من الميزانية المعتمدة.' : 'Trigger red flag when concrete material expenses hit 90% of allocated BOQ line item.',
        why_it_matters: isAr ? 'حماية هامش ربح المشروع وتجنب الانحرافات التكلفية الحادة.' : 'Protects project profit margins from cost overruns.'
      }
    ];
  }

  // 9. Fuel Stations (الوقود)
  if (modLower.indexOf('fuel') !== -1 || modLower.indexOf('mod-9') !== -1 || modLower.indexOf('وقود') !== -1 || modLower.indexOf('محطة') !== -1) {
    return [
      {
        title: isAr ? 'تسوية قراءات العدادات ومبيعات الورديات (Shift Nozzle Reconciliation)' : 'Shift Meter Reading & Cash Collection Reconciliation',
        type: 'Process Insight',
        content: isAr ? 'مطابقة الفارق بين قراءة العداد الإلكتروني للمضخة والمبالغ المحصلة نائياً وشركة الصرافة بعد كل وردية.' : 'Reconciling pump nozzle meter deltas against cash and POS card receipts per shift stops leakage.',
        example: isAr ? 'عداد المضخة سجل 1000 لتر (7000 ريال) -> التحقق من تحصيل 7000 ريال كاش+شبكة.' : 'Nozzle meter indicates 1000L ($2000) -> verify exact POS + cash match before shift signoff.',
        why_it_matters: isAr ? 'كشف عجز الورديات وتحديد المسؤولية فورياً على عامل الوردية.' : 'Highlights shift variances and assigns immediate accountability.'
      },
      {
        title: isAr ? 'تحليل الفروقات اليومية لخزانات الوقود (Tank Variance Analysis)' : 'Underground Tank Dip Reading vs Sales Variance',
        type: 'Common Mistake',
        content: isAr ? 'إهمال مطابقة قياسات الخزانات الأرضية Daily Dip Readings تسبب في عدم اكتشاف تهريب الوقود أو أخطاء التكاليف.' : 'Ignoring daily underground tank dip gauge checks hides fuel leaks or thermal expansion losses.',
        example: isAr ? 'فارق يظهر بين المخزون الدفتري والفعلي يتجاوز 0.5% -> إرسال فريق الفحص لمعايرة المضخات.' : 'Variance exceeding 0.5% triggers calibration and leak inspection dispatch.',
        why_it_matters: isAr ? 'تجنب الخسائر البيئية والمالية الفادحة الناجمة عن التسريبات.' : 'Prevents severe environmental and financial losses from undetected tank leaks.'
      }
    ];
  }

  // 10. Law Firm (المحاماة)
  if (modLower.indexOf('law') !== -1 || modLower.indexOf('legal') !== -1 || modLower.indexOf('mod-10') !== -1 || modLower.indexOf('محاماة') !== -1 || modLower.indexOf('قانون') !== -1) {
    return [
      {
        title: isAr ? 'متابعة مواعيد الجلسات القضائية والتنبيه الآلي (Court Session Deadlines)' : 'Court Session & Hearing Calendar Auto-Sync',
        type: 'Tip',
        content: isAr ? 'ربط التقويم الآلي بمواعيد الجلسات ومدد الطعن والاستئناف يمنع فوات المواعيد النظامية للقضايا.' : 'Auto-syncing court hearing dates and appeal deadlines with lawyer calendars prevents missed legal cutoffs.',
        example: isAr ? 'تنبيه تلقائي للمحامي المكلف بالذات قبل 3 أيام من موعد تقديم اللائحة الاعتراضية.' : 'Auto-reminder sent to assigned attorney 3 days before appeal submission deadline.',
        why_it_matters: isAr ? 'حماية حقوق العملاء وتجنب شطب القضايا بسبب التخلف عن الجلسات.' : 'Protects client rights and eliminates default judgments due to missed dates.'
      },
      {
        title: isAr ? 'احتساب ساعات العمل القابلة للفوترة (Billable Hours Tracking)' : 'Billable Hours & Legal Retainer Accounting',
        type: 'Best Practice',
        content: isAr ? 'تسجيل ساعات الاستشارات والارتباطات القضائية بدقة وتخصيصها لرقم القضية يضمن صدور الفواتير بدقة.' : 'Logging attorney consultation hours against case IDs ensures accurate client billing and retainer burn tracking.',
        example: isAr ? 'تحويل 5 ساعات دراسة قضية تلقائياً إلى فاتورة العميل بناءً على السعر المتفق عليه.' : 'Convert 5 hours case research directly into client draft invoice at contracted hourly rate.',
        why_it_matters: isAr ? 'تعظيم إيرادات مكتب المحاماة وضمان شفافية أتعاب القضايا.' : 'Maximizes law firm profitability and maintains client fee transparency.'
      }
    ];
  }

  return [
    {
      title: isAr ? 'أفضل الممارسات لتنظيم وتوثيق موديول ' + moduleId : 'Best Practices for ' + moduleId + ' Module',
      type: 'Best Practice',
      content: isAr ? 'ربط العمليات الحقلية بموديول ' + moduleId + ' يسهم في بناء قاعدة بيانات دقيقة لاتخاذ القرارات الإدارية.' : 'Integrating field operations with the ' + moduleId + ' module establishes data consistency across all business units.',
      example: isAr ? 'اعتماد نماذج موحدة لإدخال البيانات وتحديد الأذونات بناءً على الأدوار الوظيفية.' : 'Standardize data entry forms and enforce role-based permission controls.',
      why_it_matters: isAr ? 'تسريع الدورة التشغيلية وتقليل الأخطاء البشرية.' : 'Accelerates workflow cycle times and eliminates manual entry errors.'
    },
    {
      title: isAr ? 'الرقابة والتحليل الدوري للعمليات' : 'Periodic Process Review & KPI Tracking',
      type: 'Process Insight',
      content: isAr ? 'مراجعة التقارير الدورية وتحليل الانحرافات تضمن كفاءة استخدام الموارد في موديول ' + moduleId + '.' : 'Regularly reviewing operational KPIs and variances ensures optimal resource allocation.',
      example: isAr ? 'مقارنة التكاليف الفعلية بالميزانية التقديرية بشكل شهري.' : 'Compare actual operational costs against budgeted targets monthly.',
      why_it_matters: isAr ? 'تحسين الربحية وضمان الامتثال للسياسات الإدارية.' : 'Boosts profitability and maintains policy compliance.'
    }
  ];
}

function actionGetFavorites(user) {
  var rows = readAllRows(SHEET_NAMES.AI_FAVORITES).filter(function(r) { return String(r.user_id) === String(user.id); });
  return successResponse(rows.map(stripRow));
}

function actionAddFavorite(user, payload) {
  var insightId = payload.insight_id;
  if (!insightId) return errorResponse('Insight ID is required.', 'INSIGHT_REQUIRED');

  var existing = readAllRows(SHEET_NAMES.AI_FAVORITES).find(function(r) {
    return String(r.user_id) === String(user.id) && String(r.insight_id) === String(insightId);
  });

  if (existing) {
    return successResponse(stripRow(existing), 'Already in favorites.');
  }

  var favObj = {
    id: generateId('FAV'),
    user_id: user.id,
    insight_id: insightId,
    module_id: payload.module_id || '',
    title: payload.title || '',
    type: payload.type || 'Tip',
    content: payload.content || '',
    example: payload.example || '',
    why_it_matters: payload.why_it_matters || '',
    created_at: nowIso()
  };

  appendRow(SHEET_NAMES.AI_FAVORITES, favObj);
  return successResponse(favObj, 'Saved to favorites.');
}

function actionRemoveFavorite(user, payload) {
  var insightId = payload.insight_id;
  var favId = payload.id;

  var existing = readAllRows(SHEET_NAMES.AI_FAVORITES).find(function(r) {
    return String(r.user_id) === String(user.id) &&
           (String(r.id) === String(favId) || String(r.insight_id) === String(insightId));
  });

  if (existing) {
    deleteRowByObj(SHEET_NAMES.AI_FAVORITES, existing);
  }

  return successResponse(null, 'Removed from favorites.');
}