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
  AI_FAVORITES: 'AI_Favorites',
  QUESTIONS: 'Questions',
  QUESTION_ATTEMPTS: 'Question_Attempts',
  QUESTION_REVIEWS: 'Question_Reviews',
  TOPIC_PERFORMANCE: 'Topic_Performance',
  QUESTION_REPORTS: 'Question_Reports',
  SCRIPTS: 'Scripts',
  SCRIPT_NOTES: 'Script_Notes',
  SCRIPT_USAGE: 'Script_Usage',
  SCRIPT_REPORTS: 'Script_Reports'
};

var SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;           // 7 days default
var SESSION_DURATION_REMEMBER_MS = 1000 * 60 * 60 * 24 * 30; // 30 days "remember me"

var STATUS_VALUES = ['Not Started', 'Learning', 'Understood', 'Practiced', 'Mastered'];
var PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'];
var LANGUAGE_VALUES = ['en', 'ar'];

var SCHEMA_VERSION_TARGET = '8';

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
  submitQuestionAttempt: 1, saveQuestion: 1, reportQuestion: 1, adminUpdateQuestion: 1,
  saveScriptNote: 1, logScriptUsage: 1, reportScript: 1, importScript: 1, saveScript: 1,
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

function handleRequest(action, payload, token, isBatchSubRequest) {
  if (!isBatchSubRequest) {
    resetRequestCache();
    ensureSchema(); // no-op fast path (single PropertiesService read) once migrated
  }

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
      case 'askAI':                return jsonResponse(withAuth(token, function(user){ return actionAskAI(user, payload); }));
      case 'getFavorites':         return jsonResponse(withAuth(token, function(user){ return actionGetFavorites(user); }));
      case 'addFavorite':          return jsonResponse(withAuth(token, function(user){ return actionAddFavorite(user, payload); }));
      case 'removeFavorite':       return jsonResponse(withAuth(token, function(user){ return actionRemoveFavorite(user, payload); }));

      // AI Daily ERP Challenge & Question Bank
      case 'getDailyChallenge':    return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionGetDailyChallenge(user, payload); }));
      case 'submitQuestionAttempt':return jsonResponse(withAuth(token, function(user){ recordActivity(user.id); return actionSubmitQuestionAttempt(user, payload); }));
      case 'getQuestionBank':      return jsonResponse(withAuth(token, function(user){ return actionGetQuestionBank(user, payload); }));
      case 'getChallengeHistory':  return jsonResponse(withAuth(token, function(user){ return actionGetChallengeHistory(user, payload); }));
      case 'getTopicDrill':        return jsonResponse(withAuth(token, function(user){ return actionGetTopicDrill(user, payload); }));
      case 'reportQuestion':       return jsonResponse(withAuth(token, function(user){ return actionReportQuestion(user, payload); }));
      case 'adminUpdateQuestion':  return jsonResponse(withAuth(token, function(user){ return actionAdminUpdateQuestion(user, payload); }));

      // ERP Script Knowledge & Troubleshooting Toolkit
      case 'getScripts':           return jsonResponse(withAuth(token, function(user){ return actionGetScripts(user, payload); }));
      case 'saveScriptNote':       return jsonResponse(withAuth(token, function(user){ return actionSaveScriptNote(user, payload); }));
      case 'getScriptNotes':       return jsonResponse(withAuth(token, function(user){ return actionGetScriptNotes(user, payload); }));
      case 'logScriptUsage':       return jsonResponse(withAuth(token, function(user){ return actionLogScriptUsage(user, payload); }));
      case 'reportScript':         return jsonResponse(withAuth(token, function(user){ return actionReportScript(user, payload); }));
      case 'importScript':         return jsonResponse(withAuth(token, function(user){ return actionImportScript(user, payload); }));

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
    cachePut('user:' + u.id, u, CACHE_TTL_USER);
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
    AI_Favorites: ['id', 'user_id', 'insight_id', 'module_id', 'title', 'type', 'content', 'example', 'why_it_matters', 'created_at'],
    Questions: ['id', 'module_id', 'category_id', 'topic_id', 'concept_id', 'question_type', 'difficulty', 'question', 'options_json', 'correct_answer', 'explanation', 'distractors_json', 'hint_1', 'hint_2', 'hint_3', 'reference_title', 'reference_url', 'reference_source', 'language', 'question_fingerprint', 'times_asked', 'times_correct', 'times_wrong', 'status', 'created_at'],
    Question_Attempts: ['id', 'question_id', 'user_id', 'module_id', 'category_id', 'topic_id', 'answer', 'correct', 'confidence', 'hints_used', 'time_spent_sec', 'user_reasoning', 'created_at'],
    Question_Reviews: ['id', 'user_id', 'question_id', 'module_id', 'topic_id', 'interval_days', 'repetition_level', 'next_review_date', 'last_reviewed_at', 'status', 'created_at'],
    Topic_Performance: ['id', 'user_id', 'module_id', 'category_id', 'topic_id', 'concept_id', 'total_questions', 'correct_count', 'wrong_count', 'accuracy_pct', 'mastery_score', 'priority', 'last_wrong_at', 'last_correct_at', 'updated_at'],
    Question_Reports: ['id', 'question_id', 'user_id', 'reason', 'feedback_type', 'details', 'status', 'created_at'],
    Scripts: ['id', 'title_ar', 'title_en', 'filename', 'problem_ar', 'solution_ar', 'category_id', 'modules_json', 'difficulty', 'risk_level', 'tags_json', 'code_type', 'code', 'tables_json', 'database_compatibility', 'compatibility_reason_ar', 'compatibility_reason_en', 'validated_against', 'validated_at', 'backup_required', 'rollback_notes_ar', 'playbook_steps_json', 'fingerprint', 'views_count', 'copies_count', 'favorites_count', 'status', 'created_by', 'created_at', 'updated_at'],
    Script_Notes: ['id', 'script_id', 'user_id', 'note_text', 'database_version', 'conditions', 'created_at', 'updated_at'],
    Script_Usage: ['id', 'script_id', 'user_id', 'outcome', 'result_notes', 'database_version', 'executed_at', 'created_at'],
    Script_Reports: ['id', 'script_id', 'user_id', 'reason', 'details', 'status', 'created_at']
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
    var res = handleRequest(req.action, req.payload || {}, token, true);
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

function actionAskAI(user, payload) {
  try {
    var tool = payload.tool || 'tutor';
    var userPromptText = payload.prompt || '';
    var context = payload.context || {};
    var lang = user.language || payload.language || 'ar';
    var isAr = lang === 'ar';

    var systemMsg = isAr
      ? 'أنت مستشار وخبير أنظمة ERP متخصص للغاية، دقيق، محترف وعملي. تقدم إجاباتك بتنسيق منظم احترافي بأقسام وعناوين واضحة وبطاقات مقارنة وأمثلة عملية وبنود محددة دون اختراع أرقام أو فوتشرات غير حقيقية.'
      : 'You are an expert ERP Functional Consultant & Solution Architect. Provide concise, highly accurate, beautifully structured responses with section headers, bullet points, and practical business scenarios.';

    if (tool === 'journal_sim') {
      systemMsg = isAr
        ? 'أنت محاكي ومولد قيود محاسبية بالذكاء الاصطناعي لـ ERP. وظيفتك استخراج القيد المحاسبي المزدوج (Debit & Credit) للحركة المدخلة فورياً، وتحديد اسم حساب المدين والدائن والمبلغ والتأثير المالي على الميزانية العمومية دون كتابة مقالات غير متعلقة بالقيد.'
        : 'You are an ERP Journal Entry Generator. Extract exact debit_account, credit_account, amount, and accounting impact explanation for the given business transaction.';
    }

    var contextStr = 'User Language: ' + lang + '\n' +
      'Module ID: ' + (context.module_id || 'N/A') + '\n' +
      'Module Name: ' + (context.module_name || 'N/A') + '\n' +
      'Category Name: ' + (context.category_name || 'N/A') + '\n' +
      'Topic Name: ' + (context.topic_name || 'N/A') + '\n' +
      'Knowledge Gaps: ' + (context.knowledge_gaps || 'None') + '\n' +
      'Mastered Count: ' + (context.mastered_count || '0') + '\n' +
      'User Level: ' + (context.user_level || 'Intermediate') + '\n\n';

    var userMsg = contextStr + (userPromptText ? ('Request: ' + userPromptText) : ('Generate dynamic content for tool: ' + tool));

    var messages = [
      { role: 'system', content: systemMsg },
      { role: 'user', content: userMsg }
    ];

    var rawRes = callAI(messages);
    var cleanJson = rawRes.replace(/```json/gi, '').replace(/```/g, '').trim();

    var parsed = null;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      var match = cleanJson.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (ex) {}
      }
    }

    return successResponse({
      text: rawRes,
      parsed: parsed,
      tool: tool
    }, 'AI generated successfully.');
  } catch (err) {
    return errorResponse('AI Generation failed: ' + err.message, 'AI_ERROR');
  }
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
    var foundMod = modules.find(function(m) { return String(m.id).toLowerCase() === String(moduleId).toLowerCase(); });
    if (!foundMod) {
      var numMatch = String(moduleId || '').match(/\d+/);
      if (numMatch) {
        var idx = parseInt(numMatch[0], 10) - 1;
        if (idx >= 0 && idx < modules.length) foundMod = modules[idx];
      }
    }
    if (foundMod) {
      modNameEn = foundMod.name_en || '';
      modNameAr = foundMod.name_ar || '';
    }
  } catch (e) {}

  var modLower = (String(moduleId || '') + ' ' + modNameEn + ' ' + modNameAr).toLowerCase();

  // 1. Inventory (المخزون)
  if (modLower.indexOf('inventory') !== -1 || modLower.indexOf('مخزون') !== -1 || /\bmod-1\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'تفعيل تتبع الرقم التسلسلي والتشغيلة (Serial & Batch Tracking)' : 'Serial & Batch Number Lot Tracking',
        type: 'Best Practice',
        content: isAr ? 'تفعيل تتبع الباتش وتواريخ الصلاحية يحمي الشركات الغذائية والدوائية من تداول المنتجات المنتهية الصلاحية.' : 'Enabling Lot & Serial tracking ensures strict FEFO/FIFO dispatching and fast product recall management.',
        example: isAr ? 'سحب دفعة منتجات محددة برقم الباتش فور اكتشاف عيب مصنعي.' : 'Isolate specific batch numbers immediately upon supplier quality advisory.',
        why_it_matters: isAr ? 'ضمان جودة المنتجات وحماية الشركة من القضايا والتعويضات.' : 'Ensures regulatory compliance and protects brand reputation.'
      },
      {
        title: isAr ? 'تحليل مخزون الراكد والبطيء (ABC & Deadstock Analysis)' : 'ABC Classification & Deadstock Reduction',
        type: 'Process Insight',
        content: isAr ? 'تصنيف المنتجات حسب القيمة والتداول (ABC) يركز الجهود الرقابية على 20% من المنتجات التي تشكل 80% من قيمة المخزون.' : 'Categorizing inventory into ABC tiers concentrates auditing controls on high-value A-class items.',
        example: isAr ? 'عمل جرد أسبوعي لفئة A وجرد ربع سنوي لفئة C.' : 'Perform weekly cycle counts for A-class items and quarterly counts for C-class.',
        why_it_matters: isAr ? 'التخلص من المخزون الميت وتحرير السيولة المجمدة.' : 'Frees up locked working capital and reduces warehouse holding costs.'
      }
    ];
  }

  // 2. Accounting (الحسابات)
  if (modLower.indexOf('account') !== -1 || modLower.indexOf('حسابات') !== -1 || /\bmod-2\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'الاعتماد الآلي للفواتير والضرائب (Automated E-Invoicing & E-Tax)' : 'Automated E-Invoicing & Tax Reporting Sync',
        type: 'Tip',
        content: isAr ? 'ربط فواتير المبيعات والمشتريات بنظام الفوترة الإلكترونية والضريبة يضمن تقديم الإقرارات الضريبية دون أخطاء.' : 'Integrating sales and purchase invoices directly with national tax portals eliminates manual VAT reporting errors.',
        example: isAr ? 'توليد كود QR وقيد ضريبة القيمة المضافة تلقائياً مع كل فاتورة مبيعات.' : 'Auto-generate QR XML payload and VAT output ledger entry on invoice confirmation.',
        why_it_matters: isAr ? 'تجنب غرامات التأخير وعدم التطابق الضريبي.' : 'Prevents costly late-filing tax penalties and non-compliance fines.'
      },
      {
        title: isAr ? 'تسوية حسابات الوسيط والمقاصة (Intercompany & Clearing Accounts)' : 'Intercompany & Clearing Account Settlement',
        type: 'Accounting Impact',
        content: isAr ? 'تصفية حسابات التحويلات البنكية وحسابات المشتريات المعلقة نهاية كل شهر يمنع تضخم الحسابات الوسيطة.' : 'Reconciling transit and clearing ledgers monthly prevents unmapped balance sheet bloat.',
        example: isAr ? 'قيد تسوية: من ح/ البنك المستلم إلى ح/ نقدية في الطريق.' : 'Clearing entry: Dr Receiving Bank, Cr Cash-in-Transit.',
        why_it_matters: isAr ? 'يضمن مطابقة الحسابات المالية بين الفروع والشركات الشقيقة.' : 'Guarantees clean intercompany ledger balance matching.'
      },
      {
        title: isAr ? 'مراقبة الديون المعدومة وتخصيص التعثر (Bad Debts Provisioning)' : 'Bad Debts Provisioning & Aging Schedule',
        type: 'Common Mistake',
        content: isAr ? 'إهمال تقارير تعمير الديون (Aging Report) يؤدي إلى تراكم ديون معدومة غير مخصص لها حسابياً.' : 'Ignoring customer A/R aging buckets leads to sudden unbudgeted write-offs of bad debts.',
        example: isAr ? 'احتساب مخصص 5% للديون المتأخرة فوق 90 يوماً و50% لفوق 180 يوماً.' : 'Provision 5% for >90 days overdue and 50% for >180 days overdue.',
        why_it_matters: isAr ? 'حماية رأس المال العامل وصحة قائمة المركز المالي.' : 'Protects balance sheet asset quality and working capital health.'
      }
    ];
  }

  // 3. HR (الموارد البشرية)
  if (modLower.indexOf('hr') !== -1 || modLower.indexOf('human') !== -1 || modLower.indexOf('بشرية') !== -1 || modLower.indexOf('موارد') !== -1 || /\bmod-6\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'أتمتة طلبات الإجازات والتأشيرات (Self-Service Leave Workflow)' : 'Employee Self-Service Leave & Visa Automation',
        type: 'Process Insight',
        content: isAr ? 'تمكين الموظفين من تقديم طلبات الإجازات وتأشيرات الخروج والعودة عبر تطبيق الخدمة الذاتية يقلل المعاملات الورقية.' : 'Employee self-service portals streamline leave requests, exit/re-entry visas, and salary certificates without HR bottlenecks.',
        example: isAr ? 'خصم رصيد الإجازة التلقائي فور خصم الاعتماد من المدير المباشر.' : 'Auto-deduct leave balance upon direct manager approval signoff.',
        why_it_matters: isAr ? 'رفع رضا الموظفين وتقليل الهدر الإداري لخدمات الأفراد.' : 'Improves employee satisfaction and cuts administrative overhead.'
      },
      {
        title: isAr ? 'تقييم الأداء الربعي المربوط بالحوافز (KPI & Commission Automation)' : 'Automated Commission & KPI Performance Scoring',
        type: 'Trick',
        content: isAr ? 'ربط تحقيق الأهداف (KPIs) ونسب المبيعات بمسيرات الرواتب آلياً يضمن توزيع العمولات والحوافز بدقة.' : 'Auto-calculating sales commissions and KPI performance bonuses inside payroll prevents manual payout errors.',
        example: isAr ? 'إضافة نسبة عمولة المبيعات تلقائياً لمسير راتب الشريك التجاري عند تحصيل الفاتورة.' : 'Auto-add sales commission line item to payroll upon customer payment collection.',
        why_it_matters: isAr ? 'تحفيز الفريق وزيادة الإنتاجية دون تأخير المستحقات.' : 'Drives employee motivation and eliminates incentive payout disputes.'
      }
    ];
  }

  // 4. Maintenance (الصيانة)
  if (modLower.indexOf('maint') !== -1 || modLower.indexOf('صيانة') !== -1 || /\bmod-3\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'تتبع تكلفة الصيانة لكل معدة (Total Maintenance Cost per Asset)' : 'Total Cost of Maintenance (TCM) Tracking',
        type: 'Accounting Impact',
        content: isAr ? 'تجميع قطع الغيار، أجور الفنيين، والخدمات الخارجية على حساب المعدة يوضح جدوى الاستمرار في تشغيلها.' : 'Aggregating spare parts, technician labor, and contractor fees against asset IDs reveals true cost of ownership.',
        example: isAr ? 'تقرير يبين أن مصاريف صيانة معدة تجاوزت 60% من قيمة إحلالها كجديدة.' : 'Report showing asset maintenance exceeded 60% of replacement value.',
        why_it_matters: isAr ? 'تسهيل اتخاذ قرار إحلال وتكاهين المعدات المتهالكة.' : 'Facilitates timely capital asset replacement decisions.'
      },
      {
        title: isAr ? 'تفعيل بلاغات الأعطال من خطوط الإنتاج (Work Center Downtime Alerts)' : 'Automated Machine Downtime Tracking',
        type: 'Process Insight',
        content: isAr ? 'تسجيل ساعات توقف المعدات فورياً يتيح تقييم كفاءة التشغيل الإجمالية (OEE) وتحليل أسباب التوقف.' : 'Logging machine downtime hours automatically tracks Overall Equipment Effectiveness (OEE) and root causes.',
        example: isAr ? 'إرسال إشعار للمهندس المسؤول فور توقف خط الإنتاج لأكثر من 15 دقيقة.' : 'Auto-alert maintenance engineer when production line halts for >15 minutes.',
        why_it_matters: isAr ? 'تقليل ساعات التوقف الفعلي وزيادة الطاقة الإنتاجية.' : 'Maximizes production throughput and minimizes downtime losses.'
      },
      {
        title: isAr ? 'إدارة عقود الصيانة الضامنة (Vendor Warranty & SLA Tracking)' : 'Vendor Warranty & SLA Management',
        type: 'Tip',
        content: isAr ? 'تنبيه الفنيين بوجود ضمان ساري للمعدة لمنع شراء قطع غيار أو دفع مصاريف صيانة خارج الضمان.' : 'Alerting technicians about active vendor warranties prevents paying for covered spare parts and repairs.',
        example: isAr ? 'إظهار شارة "تحت الضمان" عند فتح أمر شغل لمعدة تم شراؤها خلال السنة الأخيرة.' : 'Display "Under Warranty" banner when creating Work Order for recently purchased assets.',
        why_it_matters: isAr ? 'توفير آلاف الريالات والاستفادة الكاملة من الضمانات المصنعية.' : 'Saves thousands by utilizing active manufacturer warranties.'
      }
    ];
  }

  // 5. Assets (الأصول)
  if (modLower.indexOf('asset') !== -1 || modLower.indexOf('أصول') !== -1 || /\bmod-4\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'إدارة استبعاد وبيع الأصول الثابتة (Asset Disposal & Scrap Realization)' : 'Fixed Asset Disposal & Scrap Accounting',
        type: 'Common Mistake',
        content: isAr ? 'بيع أو استبعاد الأصل بدون إقفال القيمة الدفترية ومجمع الإهلاك يتسبب في أخطاء جوهرية بالأرباح والخسائر.' : 'Scrapping or selling an asset without closing its accumulated depreciation ledger distorts P&L gain/loss on disposal.',
        example: isAr ? 'إثبات قيد التخريد: إقفال ح/ مجمع الإهلاك واحتساب صافي الربح/الخسارة الناتج عن البيع.' : 'Disposal entry: Dr Cash, Dr Accumulated Depreciation, Cr Asset Cost, Cr/Dr Gain/Loss.',
        why_it_matters: isAr ? 'دقة التقارير المالية ومطابقة القوائم الختامية.' : 'Guarantees compliant financial gain/loss reporting on disposals.'
      },
      {
        title: isAr ? 'تجميع تكاليف المشروعات قيد التنفيذ (CWIP Asset Capitalization)' : 'Capital Work-in-Progress (CWIP) Capitalization',
        type: 'Accounting Impact',
        content: isAr ? 'تأجيل إهلاك المشروعات الثابتة لحين اكتمال التركيب والتشغيل الفعلي وتحويلها من ح/ مشاريع تحت التنفيذ إلى أصل ثابت.' : 'Capitalizing CWIP costs into active Fixed Assets only upon commercial commissioning starts depreciation correctly.',
        example: isAr ? 'تحويل حساب خط الإنتاج من ح/ مشاريع تحت التنفيذ إلى ح/ أصل آلات ومعدات فور التشغيل.' : 'Transfer CWIP balance to Active Machinery ledger on commercial launch date.',
        why_it_matters: isAr ? 'تجنب تحميل الفترات المحاسبية بمصاريف إهلاك قبل بدء توليد الإيراد.' : 'Prevents premature depreciation expenses before revenue generation starts.'
      },
      {
        title: isAr ? 'إعادة تقييم الأصول بالقيمة العادلة (Asset Revaluation & Impairment)' : 'Asset Revaluation & Impairment Audit Controls',
        type: 'Best Practice',
        content: isAr ? 'إجراء اختبار هبوط قيمة الأصول (Impairment Test) عند تراجع قيمتها السوقية لحماية القوائم المالية.' : 'Testing fixed assets for impairment when market values drop guarantees compliance with IFRS IAS 36.',
        example: isAr ? 'إثبات قيد خسائر هبوط أصل عقاري تراجعت قيمته السوقية.' : 'Post Dr Impairment Expense, Cr Accumulated Impairment Allowance.',
        why_it_matters: isAr ? 'عرض الأصول بقيمتها الحقيقية العادلة أمام المستثمرين والبنوك.' : 'Ensures true fair-value asset representation for stakeholders.'
      }
    ];
  }

  // 6. Transportation (النقليات)
  if (modLower.indexOf('trans') !== -1 || modLower.indexOf('fleet') !== -1 || modLower.indexOf('نقليات') !== -1 || modLower.indexOf('مركبات') !== -1 || /\bmod-5\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'جدولة تراخيص الفحص والرخص (Fleet License & Renewal Pipeline)' : 'Fleet Vehicle Inspection & Registration Renewal Alerts',
        type: 'Tip',
        content: isAr ? 'إعداد تنبيهات آلية لتراخيص المركبات والتأمين والفحص الدوري تجنباً لحجز الشاحنات بالغرامات الميدانية.' : 'Auto-alerting fleet operations 30 days before vehicle registration and insurance expiry avoids road fines.',
        example: isAr ? 'تنبيه مسئول الحركة قبل 30 يوماً من انتهاء رخصة سير الشاحنة.' : 'Auto-notify dispatch team 30 days prior to truck registration expiry.',
        why_it_matters: isAr ? 'تجنب توقف الرحلات والغرامات المرورية.' : 'Prevents fleet grounding and avoids heavy traffic fines.'
      },
      {
        title: isAr ? 'تتبع مسارات الشاحنات وتحديد الحمولة الزائدة (Overload & GPS Tracking)' : 'GPS Route Tracking & Axle Overload Monitoring',
        type: 'Common Mistake',
        content: isAr ? 'تجاوز أوزان المحاور المسموحة يتسبب في تلف الإطارات وتوقيع غرامات موازين النقل.' : 'Exceeding axle weight limits damages tires and incurs heavy weigh-station highway fines.',
        example: isAr ? 'منع إصدار وثيقة التحرير إذا تجاوز الوزن الإجمالي الموزون الحد المسموح.' : 'Block waybill confirmation if scale weight exceeds maximum legal axle limit.',
        why_it_matters: isAr ? 'حماية أسطول المركبات وتخفيض مصاريف صيانة الإطارات.' : 'Extends tire lifespan and prevents costly highway overload penalties.'
      },
      {
        title: isAr ? 'حساب تكلفة الكيلومتر الفعلي للرحلة (Cost Per Ton/Km Ratio)' : 'Freight Profitability per Ton/Km Ratio',
        type: 'Accounting Impact',
        content: isAr ? 'ربط مصاريف السائق والوقود والصيانة والضرائب بحمولة الرحلة يحدد ربحية كل خط سير.' : 'Allocating driver allowances, fuel, tolls, and maintenance per trip calculates true net margin per route.',
        example: isAr ? 'تقرير يبين أن خط نقل "الرياض - الدمام" يحقق هامش ربح 28% مقارنة بـ 12% لخط آخر.' : 'Route profitability report showing 28% margin vs 12% on low-yield trips.',
        why_it_matters: isAr ? 'تركيز الأسطول على الخطوط والرحلات الأكثر ربحية.' : 'Focuses fleet capacity on high-margin logistics corridors.'
      }
    ];
  }

  // 7. Real Estate (العقارات)
  if (modLower.indexOf('real') !== -1 || modLower.indexOf('estate') !== -1 || modLower.indexOf('عقارات') !== -1 || modLower.indexOf('عقار') !== -1 || /\bmod-7\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'أتمتة الفواتير وربط الخدمات بالمستأجرين (Tenant Utility Cost Recovery)' : 'Tenant Utility & Maintenance Re-invoicing Automation',
        type: 'Best Practice',
        content: isAr ? 'إعادة توزيع فواتير الكهرباء والمياه والصيانة العامة على المستأجرين تلقائياً بحسب مساحة كل وحدة.' : 'Auto-allocating shared building utility and maintenance costs to tenant ledgers by square footage.',
        example: isAr ? 'إصدار فاتورة صيانة دورية للمستأجر بحسب نسبة مساحة محله من المجمع.' : 'Auto-bill tenant for shared HVAC maintenance based on leased floor area ratio.',
        why_it_matters: isAr ? 'منع استنزاف المصاريف التشغيلية على مالك العقار.' : 'Prevents unrecovered building operational costs from eroding owner returns.'
      },
      {
        title: isAr ? 'تحصيل الإيجارات عبر بوابة الدفع السريع (Online Tenant Payment Portal)' : 'Digital Lease Payments & Auto-Receipting',
        type: 'Process Insight',
        content: isAr ? 'ربط التحصيل الإلكتروني والخصم المباشر بنظام العقارات يحدث رصيد المستأجر ويصدر السند فورياً.' : 'Integrating online payment portals with tenant sub-ledgers auto-posts receipts and updates balances.',
        example: isAr ? 'تسوية الدفعة وتوليد سند القبض تلقائياً بمجرد سداد المستأجر عبر سداد/مدى.' : 'Auto-post receipt voucher upon instant tenant SADAD/Mada payment confirmation.',
        why_it_matters: isAr ? 'تقليل الديون المعلقة وتسريع دورة التحصيل النقدية.' : 'Dramatically cuts collection delays and manual receipting work.'
      },
      {
        title: isAr ? 'متابعة الصيانة الدورية للوحدات المؤجرة (Leased Unit Inspection)' : 'Periodic Leased Unit Physical Inspection Audits',
        type: 'Common Mistake',
        content: isAr ? 'تسليم أو استلام الوحدات دون توثيق حالة المبنى بالصور والتقرير المعتمد يسبب نزاعات الودائع الإيجارية.' : 'Handing over units without digital photo inspection logs triggers deposit security disputes upon lease termination.',
        example: isAr ? 'تعبئة نموذج فحص الاستلام الرقمي وتوقيع المستأجر الكترونياً قبل تسليم المفاتيح.' : 'Complete digital handover checklist with signed tenant photos prior to key release.',
        why_it_matters: isAr ? 'حماية الأصول العقارية من التلف وضمان حقوق الصيانة.' : 'Protects property value and eliminates tenant deposit settlement conflicts.'
      }
    ];
  }

  // 8. Contracting (المقاولات)
  if (modLower.indexOf('contract') !== -1 || modLower.indexOf('مقاولات') !== -1 || modLower.indexOf('مشروع') !== -1 || /\bmod-8\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'إدارة التغييرات وأوامر التكليف (Variation Orders Control)' : 'Variation Order (VO) Approval & Revenue Realization',
        type: 'Common Mistake',
        content: isAr ? 'تنفيذ الأعمال الإضافية للمشروع بناءً على طلبات شفهية دون أوامر تغيير مقتطعة وموثقة يضيع مستحقات المقاول.' : 'Executing unapproved scope changes without signed Variation Orders leads to uncollectible work expenses.',
        example: isAr ? 'حظر صرف مواد العمل الإضافي لحين اعتماد الاستشاري لأمر التغيير رقم VO-04.' : 'Block material issue for extra scope until client signs Variation Order VO-04.',
        why_it_matters: isAr ? 'ضمان فوترة كافة الأعمال الإضافية وحماية حقوق الشركة.' : 'Guarantees full customer billing for scope changes.'
      },
      {
        title: isAr ? 'توزيع مصاريف الموقع غير المباشرة (Subcontractor & Overhead Distribution)' : 'Subcontractor Ledger & Site Overhead Allocation',
        type: 'Accounting Impact',
        content: isAr ? 'توزيع رواتب الإداريين والمعدات المشتركة ومصاريف الموقع المؤقتة على بند المشروع بحسب نسبة الإنجاز.' : 'Allocating shared site equipment, site engineers, and camp overheads by project completion percentage.',
        example: isAr ? 'قيد توزيع مصاريف الموقع الشهرية بنسبة إنجاز كل مشروع من إجمالي الأعمال.' : 'Post monthly site overhead allocation proportional to project IPC revenue weight.',
        why_it_matters: isAr ? 'تحديد الربحية الحقيقية والدقيقة لكل مشروع مقاولات.' : 'Reveals true net profitability per construction site.'
      },
      {
        title: isAr ? 'متابعة خطاب الضمان المالي والنهائي (Letter of Guarantee LG Expiry)' : 'Letter of Guarantee (LG) Expiry & Margin Tracking',
        type: 'Tip',
        content: isAr ? 'تفعيل تنبيهات 45 يوماً قبل انتهاء خطابات الضمان الابتدائية والنهائية لتمديدها أو الإفراج عن الهوامش النقدية.' : 'Tracking Bank Performance & Advance Payment LG expiry dates prevents automatic cash margin liquidations.',
        example: isAr ? 'إرسال إشعار للإدارة المالية لمخاطبة البنك لتمديد أو استرداد غطاء الضمان.' : 'Notify finance team 45 days prior to LG expiry to release banked cash margins.',
        why_it_matters: isAr ? 'استرداد السيولة المحتجزة وتجنب مصاريف التمديد البنكية.' : 'Recovers banked cash margins and avoids unnecessary bank extension fees.'
      }
    ];
  }

  // 9. Fuel Stations (الوقود)
  if (modLower.indexOf('fuel') !== -1 || modLower.indexOf('وقود') !== -1 || modLower.indexOf('محطة') !== -1 || /\bmod-9\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'مراقبة أسعار التوريد وهامش ربح لتر الوقود (Margin & Price Update Automation)' : 'Automated Fuel Retail Margin & Cost Update',
        type: 'Accounting Impact',
        content: isAr ? 'تحديث أسعار لتر الوقود فور اعتماد التسعيرة الرسمية يضمن دقة حساب قيود المبيعات وهامش الربح.' : 'Auto-updating pump retail prices upon official tariff changes ensures immediate gross margin accuracy.',
        example: isAr ? 'تحديث سعر البنزين 91 تلقائياً في جميع الشاشات والمضخات بداية الشهر.' : 'Batch update 91 Octane retail price across all station POS pumps at midnight.',
        why_it_matters: isAr ? 'حماية أرباح المحطة وتجنب الفروقات الحسابية في التكاليف.' : 'Protects retail margins and prevents inventory revaluation errors.'
      },
      {
        title: isAr ? 'ربط بطاقات الأسطول والشركات بالشبكة (Fleet RFID Fueling System)' : 'Fleet RFID Smart Fueling & Direct Ledger Billing',
        type: 'Best Practice',
        content: isAr ? 'صرف الوقود لمركبات الشركات عبر الشريحة الذكية (RFID) يمنع التلاعب ويعكس التكلفة في حساب العميل فوراً.' : 'Dispensing fuel via smart vehicle RFID tags auto-debts corporate customer accounts without cash handling.',
        example: isAr ? 'مسح شريحة الشاحنة على المضخة وخصم قيمة اللترات تلقائياً من رصيد الشركة.' : 'Auto-read RFID windshield tag on nozzle pick-up to charge corporate sub-ledger.',
        why_it_matters: isAr ? 'زيادة مبيعات الآجل وسرعة تسوية فواتير كبار العملاء.' : 'Drives corporate fleet sales volume and eliminates credit billing disputes.'
      },
      {
        title: isAr ? 'فحص المعايرة الفنية وحساب الفقد الحراري (Thermal Loss Calculation)' : 'Pump Meter Calibration & Thermal Expansion Audits',
        type: 'Tip',
        content: isAr ? 'معايرة المضخات بانتظام واحتساب الفروقات الحرارية الصيفية يحمي الخزانات من العجز الفني المنظور.' : 'Calibrating meter nozzles and accounting for fuel thermal expansion prevents unexplained stock variance.',
        example: isAr ? 'معايرة وعاء 20 لتر القياسي شهرياً للتأكد من عدم وجود ضخ زائد عن المقدار.' : 'Calibrate 20L standard test measure monthly to verify exact nozzle dispensing accuracy.',
        why_it_matters: isAr ? 'الالتزام بمعايير الجودة وتجنب المخالفات الرقابية.' : 'Guarantees commercial compliance and prevents customer over-dispensing losses.'
      }
    ];
  }

  // 10. Law Firm (المحاماة)
  if (modLower.indexOf('law') !== -1 || modLower.indexOf('legal') !== -1 || modLower.indexOf('محاماة') !== -1 || modLower.indexOf('قانون') !== -1 || /\bmod-10\b/i.test(modLower)) {
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
      },
      {
        title: isAr ? 'إدارة أتعاب القضايا وحسابات الأمانات (Legal Retainer & Escrow Trust Accounting)' : 'Legal Retainer Deposit & Escrow Trust Ledger Controls',
        type: 'Accounting Impact',
        content: isAr ? 'فصل حسابات أمانات العملاء عن الحساب الجاري للمكتب والاعتراف بالأتعاب فقط عند تقديم الخدمة فعلياً.' : 'Separating client escrow trust funds from law firm operating ledgers ensures strict legal ethics compliance.',
        example: isAr ? 'ترحيل الأتعاب المستحقة من ح/ أمانات العملاء إلى ح/ إيرادات الاستشارات المكتسبة.' : 'Transfer earned fees from Client Trust Liability to Operating Revenue upon milestone completion.',
        why_it_matters: isAr ? 'الالتزام بقواعد أمانات المهن القانونية وتجنب المخالفات.' : 'Ensures strict legal accounting ethics and regulatory compliance.'
      },
      {
        title: isAr ? 'توثيق وإدارة أوراق القضايا الكترونياً (Case Document Archiving)' : 'Electronic Case File & Evidence Archiving',
        type: 'Process Insight',
        content: isAr ? 'أرشفة كافة اللوائح، العقود، والمستندات بملف القضية الرقمي يتيح الوصول الفوري للفريق القانوني من أي مكان.' : 'Archiving court pleadings, contracts, and evidence under centralized digital Case IDs enables instant team access.',
        example: isAr ? 'ربط المذكرة الجوابية برقم القضية ليطلع عليها المحامي المساند قبل الجلسة.' : 'Attach defense brief PDF to Case ID for co-counsel review prior to hearing.',
        why_it_matters: isAr ? 'تسريع إعداد المذكرات وحماية أصول ومستندات العملاء من الضياع.' : 'Accelerates brief drafting and secures confidential client documentation.'
      },
      {
        title: isAr ? 'متابعة تحصيل الدفعات المستحقة للقضايا (Milestone Fee Collection)' : 'Legal Fee Milestone Collection & Retainer Alerts',
        type: 'Common Mistake',
        content: isAr ? 'الاستمرار في الترافع والعمل على القضية بعد استنفاذ الدفعة المقدمة دون مطالبتهم بالدفعة التالية يسبب تعثر التحصيل.' : 'Continuing litigation work after exhausting client retainer balance risks uncollectible legal fees.',
        example: isAr ? 'إرسال تنبيه آلي للمحامي والعميل فور انخفاض رصيد الدفعة المقدمة عن 20%.' : 'Trigger auto-alert when client retainer balance drops below 20% threshold.',
        why_it_matters: isAr ? 'حماية التدفقات النقدية لمكتب المحاماة وضمان التحصيل أولاً بأول.' : 'Protects law firm cash flow and eliminates overdue fee collection risks.'
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

// ---------------------------------------------------------------------------
// AI DAILY ERP CHALLENGE & QUESTION BANK ENGINE
// ---------------------------------------------------------------------------

function actionGetDailyChallenge(user, payload) {
  payload = payload || {};
  var moduleId = payload.module_id || '';
  var mode = payload.mode || 'Practice'; // Learning, Practice, Interview, Troubleshooting, Accounting, Mixed
  var isAr = user.language === 'ar' || payload.language === 'ar';
  var todayStr = new Date().toISOString().slice(0, 10);

  // 1. Fetch user's due reviews for this module
  var allReviews = readAllRows(SHEET_NAMES.QUESTION_REVIEWS).filter(function(r) {
    var matchUser = String(r.user_id) === String(user.id);
    var matchMod = !moduleId || String(r.module_id) === String(moduleId);
    var isDue = r.next_review_date <= todayStr && r.status !== 'Mastered';
    return matchUser && matchMod && isDue;
  });

  // 2. Fetch user's weak topics / performance
  var allTopicPerf = readAllRows(SHEET_NAMES.TOPIC_PERFORMANCE).filter(function(p) {
    var matchUser = String(p.user_id) === String(user.id);
    var matchMod = !moduleId || String(p.module_id) === String(moduleId);
    return matchUser && matchMod;
  });

  var weakTopicIds = allTopicPerf.filter(function(p) {
    return Number(p.accuracy_pct) < 60 || Number(p.wrong_count) >= 2 || p.priority === 'High' || p.priority === 'Critical';
  }).map(function(p) { return String(p.topic_id); });

  // 3. Fetch questions from Question Bank
  var bankQuestions = readAllRows(SHEET_NAMES.QUESTIONS).filter(function(q) {
    var matchMod = !moduleId || String(q.module_id) === String(moduleId);
    var isActive = q.status === 'Active' || !q.status;
    return matchMod && isActive;
  });

  var selectedQuestions = [];
  var selectedIds = {};

  // Step A: Priority to Due Reviews (Yesterday's mistakes or spaced repetition)
  for (var i = 0; i < allReviews.length && selectedQuestions.length < 4; i++) {
    var rev = allReviews[i];
    var foundQ = bankQuestions.find(function(q) { return String(q.id) === String(rev.question_id); });
    if (foundQ && !selectedIds[foundQ.id]) {
      var qObj = formatQuestionForClient(foundQ, isAr);
      qObj.is_review_due = true;
      qObj.review_interval = rev.interval_days || 1;
      selectedQuestions.push(qObj);
      selectedIds[foundQ.id] = true;
    }
  }

  // Step B: Questions targeted at weak topics
  for (var j = 0; j < bankQuestions.length && selectedQuestions.length < 8; j++) {
    var bq = bankQuestions[j];
    if (!selectedIds[bq.id] && weakTopicIds.indexOf(String(bq.topic_id)) !== -1) {
      var qObjWeak = formatQuestionForClient(bq, isAr);
      qObjWeak.is_targeted_gap = true;
      selectedQuestions.push(qObjWeak);
      selectedIds[bq.id] = true;
    }
  }

  // Step C: Fill remaining slots with questions from bank
  for (var k = 0; k < bankQuestions.length && selectedQuestions.length < 10; k++) {
    var bqOther = bankQuestions[k];
    if (!selectedIds[bqOther.id]) {
      selectedQuestions.push(formatQuestionForClient(bqOther, isAr));
      selectedIds[bqOther.id] = true;
    }
  }

  // Step D: If Question Bank has fewer than 10 questions, generate curated high-yield questions
  if (selectedQuestions.length < 10) {
    var curModule = getModulesRows().find(function(m) { return String(m.id) === String(moduleId); }) || getModulesRows()[0];
    var fallbackList = getCuratedChallengeQuestions(curModule ? curModule.id : 'MOD-1', isAr);
    for (var f = 0; f < fallbackList.length && selectedQuestions.length < 10; f++) {
      var fb = fallbackList[f];
      if (!selectedIds[fb.id]) {
        // Save to Questions sheet for persistence and future reuse
        try {
          appendRow(SHEET_NAMES.QUESTIONS, {
            id: fb.id,
            module_id: fb.module_id,
            category_id: fb.category_id || '',
            topic_id: fb.topic_id || '',
            concept_id: fb.concept_id || '',
            question_type: fb.question_type || 'Multiple Choice',
            difficulty: fb.difficulty || 'Intermediate',
            question: fb.question,
            options_json: JSON.stringify(fb.options || []),
            correct_answer: fb.correct_answer,
            explanation: fb.explanation,
            distractors_json: JSON.stringify(fb.distractors || {}),
            hint_1: (fb.hints && fb.hints[0]) || '',
            hint_2: (fb.hints && fb.hints[1]) || '',
            hint_3: (fb.hints && fb.hints[2]) || '',
            reference_title: (fb.reference && fb.reference.title) || '',
            reference_url: (fb.reference && fb.reference.url) || '',
            reference_source: (fb.reference && fb.reference.source) || '',
            language: isAr ? 'ar' : 'en',
            question_fingerprint: fb.question_fingerprint || generateId('FPR'),
            times_asked: 1,
            times_correct: 0,
            times_wrong: 0,
            status: 'Active',
            created_at: nowIso()
          });
        } catch (e) {}

        selectedQuestions.push(fb);
        selectedIds[fb.id] = true;
      }
    }
  }

  return successResponse({
    module_id: moduleId,
    mode: mode,
    date: todayStr,
    total_questions: selectedQuestions.length,
    due_reviews_count: allReviews.length,
    weak_topics_count: weakTopicIds.length,
    questions: selectedQuestions
  });
}

function formatQuestionForClient(rawQ, isAr) {
  var options = [];
  try {
    options = rawQ.options_json ? JSON.parse(rawQ.options_json) : [];
  } catch (e) {
    options = [];
  }

  var distractors = {};
  try {
    distractors = rawQ.distractors_json ? JSON.parse(rawQ.distractors_json) : {};
  } catch (e) {
    distractors = {};
  }

  return {
    id: rawQ.id,
    module_id: rawQ.module_id,
    category_id: rawQ.category_id,
    topic_id: rawQ.topic_id,
    concept_id: rawQ.concept_id,
    question_type: rawQ.question_type || 'Multiple Choice',
    difficulty: rawQ.difficulty || 'Intermediate',
    question: rawQ.question,
    options: options,
    correct_answer: rawQ.correct_answer,
    explanation: rawQ.explanation,
    distractors: distractors,
    hints: [rawQ.hint_1, rawQ.hint_2, rawQ.hint_3].filter(Boolean),
    reference: {
      title: rawQ.reference_title,
      url: rawQ.reference_url,
      source: rawQ.reference_source
    },
    times_asked: Number(rawQ.times_asked) || 0,
    success_rate: (Number(rawQ.times_asked) > 0) ? Math.round((Number(rawQ.times_correct) / Number(rawQ.times_asked)) * 100) : 100
  };
}

function actionSubmitQuestionAttempt(user, payload) {
  payload = payload || {};
  var questionId = payload.question_id;
  var userAnswer = String(payload.answer || '').trim();
  var confidence = payload.confidence || 'Confident'; // Guessing, Not Sure, Confident, Very Confident
  var hintsUsed = Number(payload.hints_used) || 0;
  var timeSpent = Number(payload.time_spent_sec) || 0;
  var userReasoning = payload.user_reasoning || '';
  var todayStr = new Date().toISOString().slice(0, 10);

  if (!questionId) return errorResponse('Question ID is required.', 'QUESTION_REQUIRED');

  // 1. Locate question in Questions sheet
  var allQ = readAllRows(SHEET_NAMES.QUESTIONS);
  var question = allQ.find(function(q) { return String(q.id) === String(questionId); });

  var isCorrect = false;
  var correctAnswer = '';
  var explanation = '';
  var distractors = {};
  var reference = {};

  if (question) {
    correctAnswer = String(question.correct_answer || '').trim();
    isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
    explanation = question.explanation || '';
    try { distractors = question.distractors_json ? JSON.parse(question.distractors_json) : {}; } catch (e) {}
    reference = {
      title: question.reference_title,
      url: question.reference_url,
      source: question.reference_source
    };

    // Update question statistics
    var newAsked = (Number(question.times_asked) || 0) + 1;
    var newCorrect = (Number(question.times_correct) || 0) + (isCorrect ? 1 : 0);
    var newWrong = (Number(question.times_wrong) || 0) + (isCorrect ? 0 : 1);
    updateRowByObj(SHEET_NAMES.QUESTIONS, question, {
      times_asked: newAsked,
      times_correct: newCorrect,
      times_wrong: newWrong
    });
  } else {
    // If not found in sheet, check fallback match
    correctAnswer = String(payload.correct_answer || '').trim();
    isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
    explanation = payload.explanation || '';
    distractors = payload.distractors || {};
    reference = payload.reference || {};
  }

  // 2. Record Attempt in Question_Attempts
  var attemptObj = {
    id: generateId('ATT'),
    question_id: questionId,
    user_id: user.id,
    module_id: (question && question.module_id) || payload.module_id || '',
    category_id: (question && question.category_id) || payload.category_id || '',
    topic_id: (question && question.topic_id) || payload.topic_id || '',
    answer: userAnswer,
    correct: isCorrect,
    confidence: confidence,
    hints_used: hintsUsed,
    time_spent_sec: timeSpent,
    user_reasoning: userReasoning,
    created_at: nowIso()
  };
  appendRow(SHEET_NAMES.QUESTION_ATTEMPTS, attemptObj);

  // 3. Update / Create Topic Performance Record
  var topicId = attemptObj.topic_id;
  var topicPerf = null;
  if (topicId) {
    var allPerf = readAllRows(SHEET_NAMES.TOPIC_PERFORMANCE);
    var existingPerf = allPerf.find(function(p) {
      return String(p.user_id) === String(user.id) && String(p.topic_id) === String(topicId);
    });

    var totalQ = (existingPerf ? Number(existingPerf.total_questions) || 0 : 0) + 1;
    var correctQ = (existingPerf ? Number(existingPerf.correct_count) || 0 : 0) + (isCorrect ? 1 : 0);
    var wrongQ = (existingPerf ? Number(existingPerf.wrong_count) || 0 : 0) + (isCorrect ? 0 : 1);
    var accPct = Math.round((correctQ / totalQ) * 100);

    // Dynamic Mastery Score (0-100)
    var masteryScore = Math.min(100, Math.round(accPct * 0.7 + (correctQ >= 5 ? 30 : correctQ * 6)));
    if (!isCorrect) masteryScore = Math.max(0, masteryScore - 15);

    var priority = 'Medium';
    if (accPct < 50 || wrongQ >= 3) priority = 'Critical';
    else if (accPct < 70 || wrongQ >= 2) priority = 'High';
    else if (accPct >= 85 && totalQ >= 5) priority = 'Low';

    if (existingPerf) {
      updateRowByObj(SHEET_NAMES.TOPIC_PERFORMANCE, existingPerf, {
        total_questions: totalQ,
        correct_count: correctQ,
        wrong_count: wrongQ,
        accuracy_pct: accPct,
        mastery_score: masteryScore,
        priority: priority,
        last_wrong_at: isCorrect ? existingPerf.last_wrong_at : nowIso(),
        last_correct_at: isCorrect ? nowIso() : existingPerf.last_correct_at,
        updated_at: nowIso()
      });
      topicPerf = { total_questions: totalQ, accuracy_pct: accPct, mastery_score: masteryScore, priority: priority };
    } else {
      var newPerfObj = {
        id: generateId('TPF'),
        user_id: user.id,
        module_id: attemptObj.module_id,
        category_id: attemptObj.category_id,
        topic_id: topicId,
        concept_id: (question && question.concept_id) || '',
        total_questions: totalQ,
        correct_count: correctQ,
        wrong_count: wrongQ,
        accuracy_pct: accPct,
        mastery_score: masteryScore,
        priority: priority,
        last_wrong_at: isCorrect ? '' : nowIso(),
        last_correct_at: isCorrect ? nowIso() : '',
        updated_at: nowIso()
      };
      appendRow(SHEET_NAMES.TOPIC_PERFORMANCE, newPerfObj);
      topicPerf = { total_questions: totalQ, accuracy_pct: accPct, mastery_score: masteryScore, priority: priority };
    }

    // Auto-sync status with Topics table if mastery threshold is achieved or knowledge gap detected
    var allTopics = getTopicsRows();
    var topicRow = allTopics.find(function(t) { return String(t.id) === String(topicId); });
    if (topicRow) {
      if (isCorrect && masteryScore >= 85 && totalQ >= 3) {
        updateRowByObj(SHEET_NAMES.TOPICS, topicRow, { status: 'Mastered', progress: 100, updated_at: nowIso() });
      } else if (!isCorrect && (accPct < 60 || wrongQ >= 2)) {
        if (topicRow.status === 'Mastered') {
          updateRowByObj(SHEET_NAMES.TOPICS, topicRow, { status: 'Learning', progress: 50, updated_at: nowIso() });
        }
      }
    }
  }

  // 4. Update Spaced Repetition in Question_Reviews
  var allRev = readAllRows(SHEET_NAMES.QUESTION_REVIEWS);
  var existingRev = allRev.find(function(r) {
    return String(r.user_id) === String(user.id) && String(r.question_id) === String(questionId);
  });

  var nextReviewDate = '';
  var SP_INTERVALS = [1, 3, 7, 14, 30]; // Spaced repetition schedule (days)

  if (!isCorrect) {
    // Mistake Flow: Schedule immediately for Tomorrow (interval = 1)
    var tom = new Date();
    tom.setDate(tom.getDate() + 1);
    nextReviewDate = tom.toISOString().slice(0, 10);

    if (existingRev) {
      updateRowByObj(SHEET_NAMES.QUESTION_REVIEWS, existingRev, {
        interval_days: 1,
        repetition_level: 0,
        next_review_date: nextReviewDate,
        last_reviewed_at: nowIso(),
        status: 'Needs Review'
      });
    } else {
      appendRow(SHEET_NAMES.QUESTION_REVIEWS, {
        id: generateId('QRV'),
        user_id: user.id,
        question_id: questionId,
        module_id: attemptObj.module_id,
        topic_id: topicId,
        interval_days: 1,
        repetition_level: 0,
        next_review_date: nextReviewDate,
        last_reviewed_at: nowIso(),
        status: 'Needs Review',
        created_at: nowIso()
      });
    }
  } else {
    // Correct Flow: Advance to next repetition interval
    var curLevel = existingRev ? (Number(existingRev.repetition_level) || 0) : 0;
    var nextLevel = curLevel + 1;
    var nextInterval = SP_INTERVALS[Math.min(nextLevel, SP_INTERVALS.length - 1)];
    var isFullyMastered = (nextLevel >= SP_INTERVALS.length);

    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + nextInterval);
    nextReviewDate = targetDate.toISOString().slice(0, 10);

    if (existingRev) {
      updateRowByObj(SHEET_NAMES.QUESTION_REVIEWS, existingRev, {
        interval_days: nextInterval,
        repetition_level: nextLevel,
        next_review_date: nextReviewDate,
        last_reviewed_at: nowIso(),
        status: isFullyMastered ? 'Mastered' : 'Scheduled'
      });
    } else {
      appendRow(SHEET_NAMES.QUESTION_REVIEWS, {
        id: generateId('QRV'),
        user_id: user.id,
        question_id: questionId,
        module_id: attemptObj.module_id,
        topic_id: topicId,
        interval_days: nextInterval,
        repetition_level: nextLevel,
        next_review_date: nextReviewDate,
        last_reviewed_at: nowIso(),
        status: isFullyMastered ? 'Mastered' : 'Scheduled',
        created_at: nowIso()
      });
    }
  }

  return successResponse({
    correct: isCorrect,
    correct_answer: correctAnswer,
    explanation: explanation,
    distractors: distractors,
    reference: reference,
    next_review_date: nextReviewDate,
    topic_performance: topicPerf
  });
}

function actionGetQuestionBank(user, payload) {
  payload = payload || {};
  var moduleId = payload.module_id || '';
  var difficulty = payload.difficulty || '';
  var search = (payload.search || '').toLowerCase();
  var limit = Number(payload.limit) || 50;

  var allQ = readAllRows(SHEET_NAMES.QUESTIONS);
  var filtered = allQ.filter(function(q) {
    if (moduleId && String(q.module_id) !== String(moduleId)) return false;
    if (difficulty && String(q.difficulty).toLowerCase() !== difficulty.toLowerCase()) return false;
    if (search) {
      var text = (q.question + ' ' + (q.explanation || '')).toLowerCase();
      if (text.indexOf(search) === -1) return false;
    }
    return true;
  });

  return successResponse({
    total: filtered.length,
    questions: filtered.slice(0, limit).map(function(q) { return formatQuestionForClient(q, user.language === 'ar'); })
  });
}

function actionGetChallengeHistory(user, payload) {
  var attempts = readAllRows(SHEET_NAMES.QUESTION_ATTEMPTS).filter(function(a) {
    return String(a.user_id) === String(user.id);
  });

  var daysMap = {};
  attempts.forEach(function(att) {
    var date = (att.created_at || '').slice(0, 10);
    if (!date) return;
    if (!daysMap[date]) {
      daysMap[date] = { date: date, total: 0, correct: 0, wrong: 0, hints_used: 0, time_sec: 0 };
    }
    daysMap[date].total++;
    if (att.correct === true || att.correct === 'TRUE') daysMap[date].correct++;
    else daysMap[date].wrong++;
    daysMap[date].hints_used += Number(att.hints_used) || 0;
    daysMap[date].time_sec += Number(att.time_spent_sec) || 0;
  });

  var historyList = Object.keys(daysMap).sort().reverse().map(function(d) {
    var item = daysMap[d];
    item.accuracy_pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    return item;
  });

  return successResponse(historyList);
}

function actionGetTopicDrill(user, payload) {
  payload = payload || {};
  var topicId = payload.topic_id;
  if (!topicId) return errorResponse('Topic ID is required.', 'TOPIC_REQUIRED');

  var perf = readAllRows(SHEET_NAMES.TOPIC_PERFORMANCE).find(function(p) {
    return String(p.user_id) === String(user.id) && String(p.topic_id) === String(topicId);
  });

  var attempts = readAllRows(SHEET_NAMES.QUESTION_ATTEMPTS).filter(function(a) {
    return String(a.user_id) === String(user.id) && String(a.topic_id) === String(topicId);
  });

  var questions = readAllRows(SHEET_NAMES.QUESTIONS).filter(function(q) {
    return String(q.topic_id) === String(topicId);
  });

  return successResponse({
    topic_id: topicId,
    performance: perf ? stripRow(perf) : null,
    total_attempts: attempts.length,
    wrong_attempts: attempts.filter(function(a) { return a.correct === false || a.correct === 'FALSE'; }),
    questions: questions.map(function(q) { return formatQuestionForClient(q, user.language === 'ar'); })
  });
}

function actionReportQuestion(user, payload) {
  payload = payload || {};
  var questionId = payload.question_id;
  var reason = payload.reason || 'Incorrect Answer';
  var details = payload.details || '';

  if (!questionId) return errorResponse('Question ID is required.', 'QUESTION_REQUIRED');

  var reportObj = {
    id: generateId('QRP'),
    question_id: questionId,
    user_id: user.id,
    reason: reason,
    feedback_type: payload.feedback_type || 'Report',
    details: details,
    status: 'Pending',
    created_at: nowIso()
  };
  appendRow(SHEET_NAMES.QUESTION_REPORTS, reportObj);

  return successResponse(reportObj, 'Question reported for review. Thank you for your feedback.');
}

function actionAdminUpdateQuestion(user, payload) {
  if (user.role !== 'Admin') return errorResponse('Admin privileges required.', 'UNAUTHORIZED');
  var questionId = payload.id;
  if (!questionId) return errorResponse('Question ID required.', 'ID_REQUIRED');

  var allQ = readAllRows(SHEET_NAMES.QUESTIONS);
  var existing = allQ.find(function(q) { return String(q.id) === String(questionId); });
  if (!existing) return errorResponse('Question not found.', 'NOT_FOUND');

  var updates = {};
  if (payload.status) updates.status = payload.status;
  if (payload.difficulty) updates.difficulty = payload.difficulty;
  if (payload.question) updates.question = payload.question;
  if (payload.explanation) updates.explanation = payload.explanation;

  updateRowByObj(SHEET_NAMES.QUESTIONS, existing, updates);
  return successResponse(updates, 'Question updated.');
}

// ---------------------------------------------------------------------------
// CURATED HIGH-YIELD ERP CHALLENGE QUESTIONS (FALLBACK & SEED BANK)
// ---------------------------------------------------------------------------

function getCuratedChallengeQuestions(moduleId, isAr) {
  var modLower = String(moduleId || '').toLowerCase();
  
  // 1. Inventory & Stock Management
  if (modLower.indexOf('inv') !== -1 || modLower.indexOf('مخزون') !== -1 || modLower.indexOf('e05842a37c') !== -1 || /\bmod-1\b/i.test(modLower)) {
    return [
      {
        id: 'Q-INV-001',
        module_id: moduleId,
        category_id: 'CAT-INV-VAL',
        topic_id: 'TOP-FIFO',
        concept_id: 'CON-FIFO-VAL',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question: isAr ? 'عند شراء 100 وحدة بسعر 10 ريال ثم 100 وحدة بسعر 12 ريال، ثم صرف 150 وحدة للإنتاج بنظام FIFO: ما هي تكلفة البضاعة المباعة (COGS) وقيمة المخزون المتبقي؟' : 'Under FIFO inventory valuation, if 100 units are purchased at $10 and 100 units at $12, then 150 units are issued to production: What is the resulting COGS and ending inventory value?',
        options: [
          { id: 'A', text: isAr ? 'COGS: 1,600 ريال | المخزون المتبقي: 600 ريال' : 'COGS: $1,600 | Ending Inventory: $600' },
          { id: 'B', text: isAr ? 'COGS: 1,500 ريال | المخزون المتبقي: 700 ريال' : 'COGS: $1,500 | Ending Inventory: $700' },
          { id: 'C', text: isAr ? 'COGS: 1,650 ريال | المخزون المتبقي: 550 ريال' : 'COGS: $1,650 | Ending Inventory: $550' },
          { id: 'D', text: isAr ? 'COGS: 1,700 ريال | المخزون المتبقي: 500 ريال' : 'COGS: $1,700 | Ending Inventory: $500' }
        ],
        correct_answer: 'A',
        explanation: isAr ? 'في نظام FIFO، يتم صرف أقدم مخزون أولاً: (100 وحدة × 10 ريال = 1,000 ريال) + (50 وحدة × 12 ريال = 600 ريال) = 1,600 ريال COGS. ويتبقى في المخزن (50 وحدة × 12 ريال = 600 ريال).' : 'Under FIFO, older units are depleted first: (100 units * $10 = $1,000) + (50 units * $12 = $600) = $1,600 COGS. Ending inventory comprises the remaining 50 units * $12 = $600.',
        distractors: {
          'B': isAr ? 'خطأ: تم حساب المتوسط بدلاً من تسلسل FIFO.' : 'Incorrect: Assumes simple average pricing rather than FIFO queue.',
          'C': isAr ? 'خطأ: حساب خاطئ في كميات الصرف.' : 'Incorrect: Arithmetic error in unit cost allocation.',
          'D': isAr ? 'خطأ: تطبيق نظام LIFO بدلاً من FIFO.' : 'Incorrect: Represents LIFO valuation rather than FIFO.'
        },
        hints: [
          isAr ? 'تذكر مبدأ FIFO: الوارد أولاً يُصرف أولاً.' : 'Remember FIFO: First-In, First-Out pricing order.',
          isAr ? 'احسب تكلفة أول 100 وحدة من الشحنة الأولى بسعر 10 ريال.' : 'Calculate the first 100 units from the initial batch at $10.',
          isAr ? 'أضف الـ 50 وحدة المتبقية من الشحنة الثانية بسعر 12 ريال.' : 'Add the remaining 50 units from the second batch at $12.'
        ],
        reference: {
          title: 'IAS 2 - Inventories Standard & Cost Formulas',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/',
          source: 'IFRS Official Standards'
        }
      },
      {
        id: 'Q-INV-002',
        module_id: moduleId,
        category_id: 'CAT-INV-OPS',
        topic_id: 'TOP-TRANSIT',
        concept_id: 'CON-INTER-WH',
        question_type: 'Troubleshooting',
        difficulty: 'Advanced',
        question: isAr ? 'تم إنشاء أمر تحويل مخزني بين مستودع الرياض ومستودع جدة، وتم تأكيد الشحن ولكن البضاعة لم تظهر في رصيد مستودع جدة لمدة 3 أيام. ما هو السبب الأكثر ترجيحاً وكيف تعالجه؟' : 'An internal transfer between Riyadh and Jeddah warehouses was dispatched, but inventory is not showing in Jeddah after 3 days. What is the root cause and standard ERP remedy?',
        options: [
          { id: 'A', text: isAr ? 'البضاعة ما زالت في موقع العبور (Transit Location) بانتظار تأكيد استلام مستودع جدة.' : 'The stock is in the Inter-warehouse Transit Location awaiting receipt validation at Jeddah.' },
          { id: 'B', text: isAr ? 'تم شطب البضاعة تلقائياً بسبب انتهاء مهلة الشحن.' : 'The stock was automatically written off due to dispatch timeout.' },
          { id: 'C', text: isAr ? 'النظام حذف القيد المخزني بسبب نقص الكميات.' : 'The ERP deleted the inventory journal entry due to negative stock.' },
          { id: 'D', text: isAr ? 'يجب إلغاء أمر الشحن وإعادة إصدار فاتورة مبيعات جديدة.' : 'The transfer must be canceled and converted into an inter-company sales invoice.' }
        ],
        correct_answer: 'A',
        explanation: isAr ? 'في أنظمة الـ ERP القياسية (مثل Odoo و SAP)، تعتمد التحويلات بين الفروع على موقع وسيط (Transit Location). لا تدخل البضاعة رصيد المستودع المستلم إلا بعد عمل Validate / Good Receipt.' : 'In standard ERP architecture (Odoo, SAP), two-step transfers hold stock in an internal Transit Location. The destination warehouse balance increases only after confirming the Goods Receipt validation step.',
        distractors: {
          'B': isAr ? 'خطأ: أنظمة ERP لا تشطب البضائع أثناء النقل بدون إذن جرد.' : 'Incorrect: ERPs never automatically scrap transit items without manual inventory write-off.',
          'C': isAr ? 'خطأ: القيود المخزنية لا تُحذف بعد الترحيل.' : 'Incorrect: Posted stock moves cannot be deleted.',
          'D': isAr ? 'خطأ: التحويل الداخلي لا يتطلب فواتير مبيعات إلا بين الكيانات القانونية المنفصلة.' : 'Incorrect: Internal movements within the same legal entity do not require customer invoicing.'
        },
        hints: [
          isAr ? 'فكر في التحويلات ذات الخطوتين (Two-step transfers).' : 'Consider two-step transfer workflows.',
          isAr ? 'أين تستقر البضاعة محاسبياً أثناء تواجدها على الطريق في الشاحنة؟' : 'Where does stock sit physically and ledger-wise while en route?',
          isAr ? 'تحقق من خطوة Goods Receipt المعلقة في المستودع الوجهة.' : 'Check the pending Goods Receipt step at the destination warehouse.'
        ],
        reference: {
          title: 'Odoo Inventory - Internal Transfers & Transit Locations Documentation',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/transfers.html',
          source: 'Odoo Official Documentation'
        }
      }
    ];
  }

  // 2. Financial Accounting
  if (modLower.indexOf('acc') !== -1 || modLower.indexOf('حسابات') !== -1 || modLower.indexOf('24696b93e6') !== -1 || /\bmod-2\b/i.test(modLower)) {
    return [
      {
        id: 'Q-ACC-001',
        module_id: moduleId,
        category_id: 'CAT-ACC-GL',
        topic_id: 'TOP-CLOSING',
        concept_id: 'CON-RETAINED-EARNINGS',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question: isAr ? 'عند إجراء قيد إقفال نهاية السنة المالية (Year-End Closing Entry)، ما هو الحساب الدائن والمدين الصحيح لإقفال صافي ربح قدره 500,000 ريال؟' : 'When executing the Year-End Financial Closing entry for a net profit of $500,000, what is the correct debit and credit journal entry?',
        options: [
          { id: 'A', text: isAr ? 'مدين: حـ/ الأرباح والخسائر (P&L Summary) 500,000 | دائن: حـ/ الأرباح المبقاة (Retained Earnings) 500,000' : 'Debit: P&L Summary $500,000 | Credit: Retained Earnings $500,000' },
          { id: 'B', text: isAr ? 'مدين: حـ/ النقدية 500,000 | دائن: حـ/ الإيرادات 500,000' : 'Debit: Cash $500,000 | Credit: Revenue $500,000' },
          { id: 'C', text: isAr ? 'مدين: حـ/ الأرباح المبقاة 500,000 | دائن: حـ/ المصروفات 500,000' : 'Debit: Retained Earnings $500,000 | Credit: Expenses $500,000' },
          { id: 'D', text: isAr ? 'مدين: حـ/ رأس المال 500,000 | دائن: حـ/ البنك 500,000' : 'Debit: Share Capital $500,000 | Credit: Bank $500,000' }
        ],
        correct_answer: 'A',
        explanation: isAr ? 'يتم إقفال أرصدة قائمة الدخل المؤقتة في حـ/ ملخص الدخل، ثم يُرحل صافي الربح الدائن بإثباته مديناً في ملخص الدخل ودائناً في حـ/ الأرباح المبقاة (حقوق الملكية) في الميزانية العمومية.' : 'Net profit in temporary P&L accounts is transferred to equity by debiting Income Summary and crediting Retained Earnings in the Balance Sheet.',
        distractors: {
          'B': isAr ? 'خطأ: قيد الإقفال لا يؤثر على السيولة النقدية الفعلية.' : 'Incorrect: Closing entries do not touch physical cash balances.',
          'C': isAr ? 'خطأ: هذا القيد يعكس خسارة وليس ربحاً صافياً.' : 'Incorrect: This structure records a net loss rather than profit.',
          'D': isAr ? 'خطأ: رأس المال الأساسي لا يتأثر مباشرة بأرباح التشغيل الدورية دون قرار جمعية عمومية.' : 'Incorrect: Paid-in capital is not modified directly by operational closing.'
        },
        hints: [
          isAr ? 'أين تستقر أرباح الشركة التراكمية في قسم حقوق الملكية؟' : 'Where do cumulative profits accumulate within Balance Sheet Equity?',
          isAr ? 'صافي الربح طبيعته دائنة، لذا لإقفاله يجعَل مديناً.' : 'Credit balance profits are debited to zero out and credited to equity.',
          isAr ? 'ابحث عن حـ/ الأرباح المبقاة (Retained Earnings).' : 'Look for the Retained Earnings equity account.'
        ],
        reference: {
          title: 'IAS 1 - Presentation of Financial Statements & Equity Movements',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements/',
          source: 'IFRS Accounting Standards'
        }
      }
    ];
  }

  // Generic ERP Module Challenge Fallback (3 Questions for remaining modules)
  return [
    {
      id: 'Q-GEN-001',
      module_id: moduleId,
      category_id: 'CAT-GEN-OPS',
      topic_id: 'TOP-PROCESS',
      concept_id: 'CON-WORKFLOW',
      question_type: 'Process Decision',
      difficulty: 'Intermediate',
      question: isAr ? 'ما هي الخطوة الإلزامية في دورة العمل لضمان صحة الرقابة الداخلية وفصل المهام (Segregation of Duties) قبل ترحيل المستندات المالية والتشغيلية؟' : 'What is the mandatory governance step in an ERP workflow to enforce Segregation of Duties before posting financial and operational transactions?',
      options: [
        { id: 'A', text: isAr ? 'اعتماد المستند من مسؤول بصلاحيات مستقلة عن منشئ المستند (Approval Workflow).' : 'Two-step multi-tier approval by an authorized user independent from the creator.' },
        { id: 'B', text: isAr ? 'طباعة المستند ورقياً وحفظه في الأرشيف اليدوي فقط.' : 'Printing physical paper copies and manual stamping only.' },
        { id: 'C', text: isAr ? 'منح منشئ المعاملة كافة صلاحيات الترحيل والتعديل لتسريع الإنجاز.' : 'Granting creator full posting and editing bypass rights.' },
        { id: 'D', text: isAr ? 'إلغاء قيود الإقفال الشهري.' : 'Bypassing monthly subledger reconciliations.' }
      ],
      correct_answer: 'A',
      explanation: isAr ? 'مبدأ الرقابة الداخلية وفصل المهام (SoD) يتطلب عدم قيام نفس المستخدم بإنشاء واعتماد المعاملة، وتطبيق مسار موافقات آلي بحسب الصلاحيات.' : 'Segregation of Duties (SoD) requires strict separation between transaction creators and approvers to prevent fraud and operational error.',
      distractors: {
        'B': isAr ? 'خطأ: الأرشفة الورقية لا تمنع الأخطاء النظامية داخل الـ ERP.' : 'Incorrect: Physical paper archiving does not provide ERP system control.',
        'C': isAr ? 'خطأ: مخالف لمعايير الرقابة والامتثال الداخلي.' : 'Incorrect: Violates basic internal audit and governance rules.',
        'D': isAr ? 'خطأ: التسويات الشهرية إلزامية لسلامة القوائم المالية.' : 'Incorrect: Reconciliations are required for financial reporting integrity.'
      },
      hints: [
        isAr ? 'فكر في مسار الموافقات والصلاحيات (Approval Hierarchy).' : 'Think about role-based approval workflows.',
        isAr ? 'لا يجوز للموظف اعتماد عمله بنفسه.' : 'Creators must not approve their own vouchers.'
      ],
      reference: {
        title: 'COSO Internal Control - Integrated Framework & ERP Segregation of Duties',
        url: 'https://www.coso.org/guidance-on-ic',
        source: 'COSO Governance Standards'
      }
    },
    {
      id: 'Q-GEN-002',
      module_id: moduleId,
      category_id: 'CAT-GEN-TRB',
      topic_id: 'TOP-RECON',
      concept_id: 'CON-VARIANCE',
      question_type: 'Troubleshooting',
      difficulty: 'Advanced',
      question: isAr ? 'عند ظهور فارق مالي بين ميزان المراجعة والحساب الوسيط للموديول في نهاية الشهر: ما هو الإجراء التشخيصي الأول الواجب تنفيذه؟' : 'When an unallocated variance appears between the General Ledger control account and the module subledger at month-end: What is the first diagnostic step?',
      options: [
        { id: 'A', text: isAr ? 'استخراج تقرير مطابقة الأستاذ المساعد مع الأستاذ العام (Subledger to GL Reconciliation) وتحديد الحركات غير المرحلة.' : 'Run Subledger to GL Reconciliation report to identify unposted, orphaned, or manual journal entries.' },
        { id: 'B', text: isAr ? 'إدخال قيد تسوية مباشر بحساب الأرباح والخسائر دون بحث الأسباب.' : 'Post a direct blind adjustment to P&L without identifying root cause.' },
        { id: 'C', text: isAr ? 'حذف القيود السابقة وإعادة تسجيل المعاملات من جديد.' : 'Delete historical journal batches and re-key entries.' },
        { id: 'D', text: isAr ? 'تغيير العملة الأساسية للنظام.' : 'Modify system functional base currency.' }
      ],
      correct_answer: 'A',
      explanation: isAr ? 'الإجراء القياسي هو مطابقة الأستاذ المساعد (Subledger) مع الأستاذ العام (GL Control Account) لاكتشاف الحركات اليدوية المباشرة أو القيود المعلقة غير المرحلة.' : 'Standard ERP reconciliation matches the subledger detail against the GL control account to isolate unposted batches or unauthorized manual entries.',
      distractors: {
        'B': isAr ? 'خطأ: التسوية العمياء تخالف المعايير المحاسبية وتخفي الاختلاسات والأخطاء.' : 'Incorrect: Blind adjustments violate auditing standards and conceal operational leaks.',
        'C': isAr ? 'خطأ: حذف السجلات التاريخية ممنوع ومستحيل في الأنظمة المعتمدة.' : 'Incorrect: Posted financial records cannot be deleted.',
        'D': isAr ? 'خطأ: تغيير العملة يؤدي إلى إفساد شجرة الحسابات بالكامل.' : 'Incorrect: Currency modification corrupts historical valuation.'
      },
      hints: [
        isAr ? 'قارن تفاصيل الأستاذ المساعد مع حساب المراقبة في الأستاذ العام.' : 'Compare subledger lines against GL control balance.',
        isAr ? 'ابحث عن القيود اليدوية المباشرة على حساب المراقبة.' : 'Check for direct manual journals on control accounts.'
      ],
      reference: {
        title: 'ERP Month-End Close Best Practices & Subledger Reconciliation',
        url: 'https://www.oracle.com/erp/financials/general-ledger/',
        source: 'Oracle ERP Documentation'
      }
    }
  ];
}

// ---------------------------------------------------------------------------
// ERP Script Knowledge & Troubleshooting Toolkit Actions
// ---------------------------------------------------------------------------

function actionGetScripts(user, payload) {
  var rows = readAllRows(SHEET_NAMES.SCRIPTS);
  return successResponse({ scripts: rows });
}

function actionSaveScriptNote(user, payload) {
  payload = payload || {};
  if (!payload.script_id || !payload.note_text) {
    return errorResponse('Script ID and note text are required.', 'VALIDATION_ERROR');
  }

  var notes = readAllRows(SHEET_NAMES.SCRIPT_NOTES);
  var existing = notes.find(function(n) {
    return n.script_id === payload.script_id && n.user_id === user.id;
  });

  var now = nowIso();
  if (existing) {
    updateRow(SHEET_NAMES.SCRIPT_NOTES, existing.id, {
      note_text: payload.note_text,
      database_version: payload.database_version || 'newdatabase2026.sql',
      conditions: payload.conditions || '',
      updated_at: now
    });
    return successResponse({ id: existing.id, updated: true });
  } else {
    var newId = generateId('SCN');
    appendRow(SHEET_NAMES.SCRIPT_NOTES, {
      id: newId,
      script_id: payload.script_id,
      user_id: user.id,
      note_text: payload.note_text,
      database_version: payload.database_version || 'newdatabase2026.sql',
      conditions: payload.conditions || '',
      created_at: now,
      updated_at: now
    });
    return successResponse({ id: newId, created: true });
  }
}

function actionGetScriptNotes(user, payload) {
  payload = payload || {};
  var notes = readAllRows(SHEET_NAMES.SCRIPT_NOTES);
  var userNotes = notes.filter(function(n) {
    if (payload.script_id) return n.script_id === payload.script_id && n.user_id === user.id;
    return n.user_id === user.id;
  });
  return successResponse({ notes: userNotes });
}

function actionLogScriptUsage(user, payload) {
  payload = payload || {};
  if (!payload.script_id) {
    return errorResponse('Script ID is required.', 'VALIDATION_ERROR');
  }

  var newId = generateId('SCU');
  var now = nowIso();
  appendRow(SHEET_NAMES.SCRIPT_USAGE, {
    id: newId,
    script_id: payload.script_id,
    user_id: user.id,
    outcome: payload.outcome || 'worked',
    result_notes: payload.result_notes || '',
    database_version: payload.database_version || 'newdatabase2026.sql',
    executed_at: payload.executed_at || now,
    created_at: now
  });

  return successResponse({ id: newId, recorded: true });
}

function actionReportScript(user, payload) {
  payload = payload || {};
  if (!payload.script_id || !payload.reason) {
    return errorResponse('Script ID and report reason are required.', 'VALIDATION_ERROR');
  }

  var newId = generateId('SCRP');
  appendRow(SHEET_NAMES.SCRIPT_REPORTS, {
    id: newId,
    script_id: payload.script_id,
    user_id: user.id,
    reason: payload.reason,
    details: payload.details || '',
    status: 'Pending',
    created_at: nowIso()
  });

  return successResponse({ id: newId, reported: true });
}

function actionImportScript(user, payload) {
  payload = payload || {};
  if (user.role !== 'admin') {
    return errorResponse('Only administrators can import scripts.', 'UNAUTHORIZED');
  }
  if (!payload.title_ar || !payload.code) {
    return errorResponse('Title and code are required.', 'VALIDATION_ERROR');
  }

  var newId = generateId('SCR');
  var now = nowIso();
  var row = {
    id: newId,
    title_ar: payload.title_ar,
    title_en: payload.title_en || payload.title_ar,
    filename: payload.filename || (newId + '.sql'),
    problem_ar: payload.problem_ar || '',
    solution_ar: payload.solution_ar || '',
    category_id: payload.category_id || 'CAT-DATA-FIX',
    modules_json: JSON.stringify(payload.modules || ['MOD-1']),
    difficulty: payload.difficulty || 'Intermediate',
    risk_level: payload.risk_level || 'MEDIUM',
    tags_json: JSON.stringify(payload.tags || []),
    code_type: payload.code_type || 'sql',
    code: payload.code,
    tables_json: JSON.stringify(payload.tables || []),
    database_compatibility: payload.database_compatibility || 'GREEN',
    compatibility_reason_ar: payload.compatibility_reason_ar || '',
    compatibility_reason_en: payload.compatibility_reason_en || '',
    validated_against: 'newdatabase2026.sql',
    validated_at: now,
    backup_required: !!payload.backup_required,
    rollback_notes_ar: payload.rollback_notes_ar || '',
    playbook_steps_json: JSON.stringify(payload.playbook_steps_ar || []),
    fingerprint: payload.fingerprint || '',
    views_count: 0,
    copies_count: 0,
    favorites_count: 0,
    status: 'Active',
    created_by: user.id,
    created_at: now,
    updated_at: now
  };

  appendRow(SHEET_NAMES.SCRIPTS, row);
  return successResponse({ id: newId, script: row });
}