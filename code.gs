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
  NOTES: 'Notes'
};

var SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;           // 7 days default
var SESSION_DURATION_REMEMBER_MS = 1000 * 60 * 60 * 24 * 30; // 30 days "remember me"

var STATUS_VALUES = ['Not Started', 'Learning', 'Understood', 'Practiced', 'Mastered'];
var PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'];
var LANGUAGE_VALUES = ['en', 'ar'];

var SCHEMA_VERSION_TARGET = '4';

// Actions that mutate data. Only these acquire the script lock — read
// actions run without locking so parallel requests from the same page
// execute concurrently instead of queuing behind each other.
var WRITE_ACTIONS = {
  signup: 1, login: 1, logout: 1,
  updateProfile: 1, changePassword: 1,
  createTopic: 1, updateTopic: 1, deleteTopic: 1, updateStatus: 1, updateProgress: 1,
  saveKnowledge: 1,
  addReview: 1, markReviewed: 1,
  createCategory: 1, updateCategory: 1, deleteCategory: 1, toggleCategoryStatus: 1,
  createNote: 1, updateNote: 1, deleteNote: 1,
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
      case 'createTopic':        return jsonResponse(withAuth(token, function(user){ return actionCreateTopic(user, payload); }));
      case 'updateTopic':        return jsonResponse(withAuth(token, function(user){ return actionUpdateTopic(user, payload); }));
      case 'deleteTopic':        return jsonResponse(withAuth(token, function(user){ return actionDeleteTopic(user, payload); }));
      case 'updateStatus':       return jsonResponse(withAuth(token, function(user){ return actionUpdateStatus(user, payload); }));
      case 'updateProgress':     return jsonResponse(withAuth(token, function(user){ return actionUpdateProgress(user, payload); }));

      // Knowledge
      case 'knowledge':          return jsonResponse(withAuth(token, function(user){ return actionGetKnowledge(user, payload); }));
      case 'saveKnowledge':      return jsonResponse(withAuth(token, function(user){ return actionSaveKnowledge(user, payload); }));
      case 'updateKnowledge':    return jsonResponse(withAuth(token, function(user){ return actionSaveKnowledge(user, payload); }));

      // Reviews
      case 'reviews':             return jsonResponse(withAuth(token, function(user){ return actionGetReviews(user, payload); }));
      case 'addReview':           return jsonResponse(withAuth(token, function(user){ return actionAddReview(user, payload); }));
      case 'markReviewed':        return jsonResponse(withAuth(token, function(user){ return actionMarkReviewed(user, payload); }));

      // Notes
      case 'notes':               return jsonResponse(withAuth(token, function(user){ return actionGetNotes(user, payload); }));
      case 'note':                return jsonResponse(withAuth(token, function(user){ return actionGetNote(user, payload); }));
      case 'createNote':          return jsonResponse(withAuth(token, function(user){ return actionCreateNote(user, payload); }));
      case 'updateNote':          return jsonResponse(withAuth(token, function(user){ return actionUpdateNote(user, payload); }));
      case 'deleteNote':          return jsonResponse(withAuth(token, function(user){ return actionDeleteNote(user, payload); }));

      // Dashboard / Analytics — each is ONE read of Topics + ONE (cached) read of Modules
      case 'dashboard':            return jsonResponse(withAuth(token, function(user){ return actionDashboard(user); }));
      case 'analytics':            return jsonResponse(withAuth(token, function(user){ return actionAnalytics(user); }));

      // Admin
      case 'adminUsers':           return jsonResponse(withAuth(token, function(user){ return actionAdminUsers(user); }));

      // Setup
      case 'seed':                  return jsonResponse(actionSeed());

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
  if (!id) throw new Error('SHEET_ID script property is not set.');
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
  updateRow(SHEET_NAMES.USERS, match.id, { last_login: nowIso() });
  invalidateUserCache(match.id);
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
  return successResponse({ user: publicUser(user) });
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
  return successResponse(rows.map(stripRow));
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
  var overdue = topics.filter(function(t) { return t.next_review && new Date(t.next_review) < now && !isSameDay(t.next_review, now); }).length;

  return successResponse({
    user: publicUser(user), kpis: kpis, modules: moduleCards,
    review_summary: { due_today: dueToday, overdue: overdue }
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

  return successResponse({
    progress_by_module: progressByModule, topics_by_status: byStatus, topics_by_priority: byPriority,
    knowledge_gaps_by_module: gapsByModule, mastered_total: byStatus['Mastered'],
    strongest_modules: sorted.slice(0, 3), weakest_modules: sorted.slice(-3).reverse(),
    topics_needing_review: topics.filter(function(t) { return t.next_review && new Date(t.next_review) <= new Date(); }).length,
    learning_over_time: timeline, total_reviews: reviews.length
  });
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
    Users: ['id', 'full_name', 'username', 'email', 'password_hash', 'role', 'active', 'language', 'created_at', 'last_login'],
    Sessions: ['session_id', 'user_id', 'created_at', 'expires_at', 'active', 'last_activity'],
    Modules: ['id', 'name_ar', 'name_en', 'description', 'active'],
    Categories: ['id', 'module_id', 'name_ar', 'name_en', 'description', 'active', 'created_at', 'updated_at'],
    Topics: ['id', 'user_id', 'module_id', 'category_id', 'topic', 'description', 'priority', 'status', 'progress', 'created_at', 'updated_at', 'completed_at', 'last_review', 'next_review', 'tags', 'pinned', 'target_date'],
    Knowledge: ['id', 'user_id', 'topic_id', 'what_i_know', 'what_i_dont_know', 'what_i_need_to_learn', 'business_understanding', 'erp_understanding', 'practical_experience', 'notes', 'updated_at'],
    Reviews: ['id', 'user_id', 'topic_id', 'review_date', 'understanding', 'notes'],
    Notes: ['id', 'user_id', 'module_id', 'title', 'section_name', 'content', 'created_at', 'updated_at', 'tags', 'pinned', 'image_url']
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
  migrateAddMissingColumns(SHEET_NAMES.USERS, ['language'], { language: 'en' });
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