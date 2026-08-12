/**
 * js/api.js
 * Thin wrapper around the Google Apps Script Web App API.
 *
 * We always POST as text/plain (not application/json) so the browser does
 * NOT send a CORS preflight OPTIONS request — Apps Script web apps cannot
 * reliably handle preflight, so this is the standard workaround.
 *
 * Performance layers (fastest to slowest):
 *  1. In-memory cache — zero-latency hits within a tab session.
 *  2. localStorage cache — survives page refresh/tab close. Topics/reviews
 *     are stored here so a reload never triggers a GAS cold-start wait.
 *  3. In-flight deduplication — identical concurrent calls share one Promise.
 *  4. Network → GAS (slowest, only when all caches miss).
 */

const SESSION_KEY = 'erp_tracker_session_token';

const API = (function () {

  /* ------------------------------------------------------------------ */
  /* Token helpers                                                       */
  /* ------------------------------------------------------------------ */
  function getToken() { return localStorage.getItem(SESSION_KEY) || ''; }
  function setToken(t) { if (t) localStorage.setItem(SESSION_KEY, t); }
  function clearToken() { localStorage.removeItem(SESSION_KEY); }

  /* ------------------------------------------------------------------ */
  /* In-flight deduplication map                                         */
  /* ------------------------------------------------------------------ */
  const inFlight = new Map();

  function dedupeKey(action, payload) {
    return action + ':' + JSON.stringify(payload || {});
  }

  /* ------------------------------------------------------------------ */
  /* In-memory response cache (per tab session)                         */
  /* ------------------------------------------------------------------ */
  const _mem = new Map(); // key → { data, expiresAt }

  const MEM_TTL = {
    validateSession : 5  * 60 * 1000,
    currentUser     : 5  * 60 * 1000,
    modules         : 60 * 60 * 1000,
    categories      : 60 * 60 * 1000,
    topics          : 5  * 60 * 1000,  // 5 min in-memory
    topic           : 5  * 60 * 1000,
    knowledge       : 5  * 60 * 1000,
    reviews         : 5  * 60 * 1000,
    dashboard       : 3  * 60 * 1000,
    analytics       : 10 * 60 * 1000,
    adminUsers      : 3  * 60 * 1000,
  };

  function memGet(key) {
    const e = _mem.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) { _mem.delete(key); return null; }
    return e.data;
  }
  function memSet(key, data, action) {
    _mem.set(key, { data, expiresAt: Date.now() + (MEM_TTL[action] || 60000) });
  }

  /* ------------------------------------------------------------------ */
  /* localStorage cache — survives page refresh / tab close             */
  /* Topics and reviews are cached here so a reload is always instant.  */
  /* ------------------------------------------------------------------ */

  // Which actions get persisted to localStorage (large, slow to fetch)
  const LS_ACTIONS = new Set(['topics', 'reviews', 'dashboard', 'analytics']);
  // How long localStorage entries are valid
  const LS_TTL = {
    topics   : 10 * 60 * 1000,  // 10 min
    reviews  : 10 * 60 * 1000,
    dashboard:  5 * 60 * 1000,
    analytics: 15 * 60 * 1000,
  };

  function lsKey(cacheKey) { return 'erp_api_v1:' + cacheKey; }

  function lsGet(key, action) {
    if (!LS_ACTIONS.has(action)) return null;
    try {
      const raw = localStorage.getItem(lsKey(key));
      if (!raw) return null;
      const { data, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) { localStorage.removeItem(lsKey(key)); return null; }
      return data;
    } catch (e) { return null; }
  }

  function lsSet(key, data, action) {
    if (!LS_ACTIONS.has(action)) return;
    try {
      const ttl = LS_TTL[action] || 5 * 60 * 1000;
      localStorage.setItem(lsKey(key), JSON.stringify({ data, expiresAt: Date.now() + ttl }));
    } catch (e) { /* storage full — non-fatal */ }
  }

  function lsBust(...actions) {
    const prefix = 'erp_api_v1:';
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
    keys.forEach(k => {
      // Extract action from stored key: "erp_api_v1:action:payload" → "action"
      const inner = k.slice(prefix.length);
      const action = inner.split(':')[0];
      if (actions.includes(action)) localStorage.removeItem(k);
    });
  }

  function lsBustAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('erp_api_v1:'))
      .forEach(k => localStorage.removeItem(k));
  }

  /* ------------------------------------------------------------------ */
  /* Combined cache operations                                          */
  /* ------------------------------------------------------------------ */
  function cacheGet(key, action) {
    return memGet(key) ?? lsGet(key, action);
  }
  function cacheSet(key, data, action) {
    memSet(key, data, action);
    lsSet(key, data, action);
  }
  function cacheBust(...actions) {
    for (const key of _mem.keys()) {
      if (actions.includes(key.split(':')[0])) _mem.delete(key);
    }
    lsBust(...actions);
  }
  function cacheBustAll() {
    _mem.clear();
    lsBustAll();
  }

  /* ------------------------------------------------------------------ */
  /* Raw HTTP call (no caching)                                         */
  /* ------------------------------------------------------------------ */
  async function rawCall(action, payload, isRetry) {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      const err = new Error('API_URL is not configured.');
      err.code = 'NOT_CONFIGURED';
      throw err;
    }
    const body = JSON.stringify({ action, payload: payload || {}, token: getToken() });

    // Also embed action+token in URL query string.
    // When GAS issues a 302 and the browser follows as GET, the body is lost.
    // doGet() can then handle the request from the URL params as fallback.
    const qs = new URLSearchParams({ action, token: getToken() });
    if (payload && Object.keys(payload).length) qs.set('payload', JSON.stringify(payload));
    const url = CONFIG.API_URL + (CONFIG.API_URL.includes('?') ? '&' : '?') + qs.toString();

    let res;
    try {
      res = await fetch(url, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
    } catch (networkErr) {
      if (!isRetry) {
        await new Promise(r => setTimeout(r, 500));
        return rawCall(action, payload, true);
      }
      const err = new Error('Network error contacting the API.');
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    // GAS sometimes returns 302→echo→404 on cold start. Retry once.
    if (res.status === 404 && !isRetry) {
      await new Promise(r => setTimeout(r, 500));
      return rawCall(action, payload, true);
    }

    let json;
    try { json = await res.json(); }
    catch (parseErr) {
      if (!isRetry) {
        await new Promise(r => setTimeout(r, 800));
        return rawCall(action, payload, true);
      }
      const err = new Error('Unexpected response from the API.');
      err.code = 'SERVER_ERROR';
      throw err;
    }

    if (!json.success) {
      const err = new Error(json.message || 'Request failed.');
      err.code = json.code || 'ERROR';
      if (err.code === 'SESSION_EXPIRED') { clearToken(); Auth.onSessionExpired(); }
      throw err;
    }
    return json.data;
  }

  /* ------------------------------------------------------------------ */
  /* Cached read call                                                    */
  /* ------------------------------------------------------------------ */
  const READ_ACTIONS = new Set([
    'validateSession','currentUser','modules','categories','topics','topic',
    'knowledge','reviews','dashboard','analytics','adminUsers'
  ]);

  async function call(action, payload) {
    if (!READ_ACTIONS.has(action)) return rawCall(action, payload);

    const key = dedupeKey(action, payload);

    // 1. Memory or localStorage cache hit → instant
    const cached = cacheGet(key, action);
    if (cached !== null) return cached;

    // 2. In-flight dedup → share the promise
    if (inFlight.has(key)) return inFlight.get(key);

    // 3. Fire the real request
    const promise = rawCall(action, payload)
      .then(data => { cacheSet(key, data, action); return data; })
      .finally(() => inFlight.delete(key));

    inFlight.set(key, promise);
    return promise;
  }

  /* ------------------------------------------------------------------ */
  /* Keepalive — ping every 4 min to prevent GAS cold starts           */
  /* ------------------------------------------------------------------ */
  let _keepaliveTimer = null;

  function startKeepalive() {
    if (_keepaliveTimer) return;
    _ping(); // immediate warm-up ping
    _keepaliveTimer = setInterval(_ping, 4 * 60 * 1000);
  }
  function stopKeepalive() {
    if (_keepaliveTimer) { clearInterval(_keepaliveTimer); _keepaliveTimer = null; }
  }
  function _ping() {
    if (!getToken()) { stopKeepalive(); return; }
    fetch(CONFIG.API_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body   : JSON.stringify({ action: 'ping', payload: {}, token: getToken() })
    }).catch(() => {});
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */
  return {
    getToken, setToken, clearToken,
    cacheBust, cacheBustAll,
    startKeepalive, stopKeepalive,

    // Auth
    signup        : (p) => call('signup', Object.assign({ language: (window.I18n ? I18n.getLang() : 'en') }, p)),
    login         : (p) => call('login', p),
    logout        : ()  => rawCall('logout', {}),
    validateSession: () => call('validateSession', {}),
    currentUser   : ()  => call('currentUser', {}),
    updateProfile : (p) => call('updateProfile', p),
    changePassword: (p) => call('changePassword', p),

    // Reference data
    modules   : () => call('modules', {}),
    categories: (moduleId) => call('categories', moduleId ? { module_id: moduleId } : {}),

    createCategory: async (p) => {
      const r = await rawCall('createCategory', p);
      cacheBust('categories', 'dashboard'); return r;
    },
    updateCategory: async (p) => {
      const r = await rawCall('updateCategory', p);
      cacheBust('categories', 'dashboard'); return r;
    },
    deleteCategory: async (id) => {
      const r = await rawCall('deleteCategory', { id });
      cacheBust('categories', 'dashboard'); return r;
    },
    toggleCategoryStatus: async (id) => {
      const r = await rawCall('toggleCategoryStatus', { id });
      cacheBust('categories'); return r;
    },

    // Topics
    topics  : (f)  => call('topics', f || {}),
    topic   : (id) => call('topic', { id }),

    createTopic: async (p) => {
      const r = await rawCall('createTopic', p);
      cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r;
    },
    updateTopic: async (p) => {
      const r = await rawCall('updateTopic', p);
      cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r;
    },
    deleteTopic: async (id) => {
      const r = await rawCall('deleteTopic', { id });
      cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r;
    },
    updateStatus: async (id, status) => {
      const r = await rawCall('updateStatus', { id, status });
      cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r;
    },
    updateProgress: async (id, progress) => {
      const r = await rawCall('updateProgress', { id, progress });
      cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r;
    },

    // Knowledge
    knowledge    : (topicId) => call('knowledge', { topic_id: topicId }),
    saveKnowledge: async (p) => {
      const r = await rawCall('saveKnowledge', p);
      cacheBust('knowledge', 'topic'); return r;
    },

    // Reviews
    reviews  : (topicId) => call('reviews', topicId ? { topic_id: topicId } : {}),
    addReview: async (p) => {
      const r = await rawCall('addReview', p);
      cacheBust('reviews', 'topic', 'dashboard'); return r;
    },
    markReviewed: async (id, p) => {
      const r = await rawCall('markReviewed', Object.assign({ id }, p || {}));
      cacheBust('reviews', 'topic', 'dashboard'); return r;
    },

    // Dashboard / analytics
    dashboard : () => call('dashboard', {}),
    analytics : () => call('analytics', {}),

    // Admin
    adminUsers: () => call('adminUsers', {}),
  };
})();
