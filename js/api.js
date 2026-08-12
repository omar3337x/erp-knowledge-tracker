/**
 * js/api.js
 * Thin wrapper around the Google Apps Script Web App API.
 *
 * We always POST as text/plain (not application/json) so the browser does
 * NOT send a CORS preflight OPTIONS request — Apps Script web apps cannot
 * reliably handle preflight, so this is the standard workaround.
 *
 * Performance features:
 *  1. In-flight deduplication — identical concurrent read calls share one Promise.
 *  2. In-memory response cache — read results are cached for their TTL so
 *     navigating back to a page is instant (no extra round-trip).
 *  3. Fine-grained cache invalidation — a write action only busts the cache
 *     entries it actually affects, not the whole cache.
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
  /* In-memory response cache                                            */
  /* ------------------------------------------------------------------ */
  // Cache entries: { data, expiresAt }
  const _cache = new Map();

  // TTLs in milliseconds
  const CACHE_TTL = {
    validateSession : 5  * 60 * 1000,  // 5 min
    currentUser     : 5  * 60 * 1000,
    modules         : 60 * 60 * 1000,  // 1 hr (rarely changes)
    categories      : 60 * 60 * 1000,
    topics          : 2  * 60 * 1000,  // 2 min (changes more)
    topic           : 2  * 60 * 1000,
    knowledge       : 5  * 60 * 1000,
    reviews         : 2  * 60 * 1000,
    dashboard       : 2  * 60 * 1000,
    analytics       : 5  * 60 * 1000,
    adminUsers      : 2  * 60 * 1000,
  };

  function cacheGet(key) {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { _cache.delete(key); return null; }
    return entry.data;
  }

  function cacheSet(key, data, action) {
    const ttl = CACHE_TTL[action] || 60000;
    _cache.set(key, { data, expiresAt: Date.now() + ttl });
  }

  // Bust all cache keys whose action matches any of the given prefixes
  function cacheBust(...actions) {
    for (const key of _cache.keys()) {
      const action = key.split(':')[0];
      if (actions.includes(action)) _cache.delete(key);
    }
  }

  function cacheBustAll() { _cache.clear(); }

  /* ------------------------------------------------------------------ */
  /* Raw HTTP call (no caching)                                         */
  /* ------------------------------------------------------------------ */
  async function rawCall(action, payload) {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      const err = new Error('API_URL is not configured.');
      err.code = 'NOT_CONFIGURED';
      throw err;
    }
    const body = JSON.stringify({ action, payload: payload || {}, token: getToken() });

    let res;
    try {
      res = await fetch(CONFIG.API_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
    } catch (networkErr) {
      const err = new Error('Network error contacting the API.');
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    let json;
    try { json = await res.json(); }
    catch (parseErr) {
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

    // 1. Memory cache hit → instant return
    const cached = cacheGet(key);
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
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */
  return {
    getToken, setToken, clearToken,
    cacheBust, cacheBustAll,

    // Auth
    signup        : (p) => call('signup', Object.assign({ language: (window.I18n ? I18n.getLang() : 'en') }, p)),
    login         : (p) => call('login', p),
    logout        : ()  => call('logout', {}),
    validateSession: () => call('validateSession', {}),
    currentUser   : ()  => call('currentUser', {}),
    updateProfile : (p) => call('updateProfile', p),
    changePassword: (p) => call('changePassword', p),

    // Reference data
    modules  : () => call('modules', {}),
    categories: (moduleId) => call('categories', moduleId ? { module_id: moduleId } : {}),

    createCategory: async (p) => {
      const r = await rawCall('createCategory', p);
      cacheBust('categories','dashboard'); return r;
    },
    updateCategory: async (p) => {
      const r = await rawCall('updateCategory', p);
      cacheBust('categories','dashboard'); return r;
    },
    deleteCategory: async (id) => {
      const r = await rawCall('deleteCategory', { id });
      cacheBust('categories','dashboard'); return r;
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
      cacheBust('topics','topic','dashboard','analytics'); return r;
    },
    updateTopic: async (p) => {
      const r = await rawCall('updateTopic', p);
      cacheBust('topics','topic','dashboard','analytics'); return r;
    },
    deleteTopic: async (id) => {
      const r = await rawCall('deleteTopic', { id });
      cacheBust('topics','topic','dashboard','analytics'); return r;
    },
    updateStatus: async (id, status) => {
      const r = await rawCall('updateStatus', { id, status });
      cacheBust('topics','topic','dashboard','analytics'); return r;
    },
    updateProgress: async (id, progress) => {
      const r = await rawCall('updateProgress', { id, progress });
      cacheBust('topics','topic','dashboard','analytics'); return r;
    },

    // Knowledge
    knowledge    : (topicId) => call('knowledge', { topic_id: topicId }),
    saveKnowledge: async (p) => {
      const r = await rawCall('saveKnowledge', p);
      cacheBust('knowledge','topic'); return r;
    },

    // Reviews
    reviews  : (topicId) => call('reviews', topicId ? { topic_id: topicId } : {}),
    addReview: async (p) => {
      const r = await rawCall('addReview', p);
      cacheBust('reviews','topic','dashboard'); return r;
    },
    markReviewed: async (id, p) => {
      const r = await rawCall('markReviewed', Object.assign({ id }, p || {}));
      cacheBust('reviews','topic','dashboard'); return r;
    },

    // Dashboard / analytics
    dashboard : () => call('dashboard', {}),
    analytics : () => call('analytics', {}),

    // Admin
    adminUsers: () => call('adminUsers', {}),
  };
})();
