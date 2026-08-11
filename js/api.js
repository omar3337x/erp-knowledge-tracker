/**
 * js/api.js — Optimized API wrapper with request deduplication & caching.
 *
 * Key improvements:
 *   - Request deduplication: same in-flight request returns same Promise
 *   - In-memory cache for GET endpoints (dashboard, modules, topics, analytics)
 *   - Stale-while-revalidate pattern for cached GET data
 *   - Cache invalidation on mutations (topics, reviews, knowledge, profile)
 */

const SESSION_KEY = 'erp_tracker_session_token';

const API = (function () {

  // ---------------------------------------------------------------------------
  // TOKEN STORE
  // ---------------------------------------------------------------------------

  function getToken() {
    return localStorage.getItem(SESSION_KEY) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(SESSION_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ---------------------------------------------------------------------------
  // IN-MEMORY CACHE (stale-while-revalidate)
  // ---------------------------------------------------------------------------

  const getCache = {
    dashboard:  { data: null, promise: null, ts: 0 },
    modules:    { data: null, promise: null, ts: 0 },
    topics:     { data: null, promise: null, ts: 0 },
    analytics:  { data: null, promise: null, ts: 0 }
  };

  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function invalidateGetCache(keys) {
    if (!keys) keys = Object.keys(getCache);
    keys.forEach(k => { getCache[k].data = null; getCache[k].promise = null; getCache[k].ts = 0; });
  }

  // ---------------------------------------------------------------------------
  // REQUEST DEDUPLICATION
  // ---------------------------------------------------------------------------

  const inflight = {};

  function dedup(key, fn) {
    if (inflight[key]) return inflight[key];
    const p = fn().finally(() => { delete inflight[key]; });
    inflight[key] = p;
    return p;
  }

  // ---------------------------------------------------------------------------
  // CORE CALL
  // ---------------------------------------------------------------------------

  async function call(action, payload) {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      throw new Error('API_URL is not configured. Edit config.js after deploying Code.gs.');
    }
    const body = JSON.stringify({ action, payload: payload || {}, token: getToken() });

    let res;
    try {
      res = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
    } catch (networkErr) {
      throw new Error('Network error contacting the API. Check API_URL and your connection.');
    }

    let json;
    try {
      json = await res.json();
    } catch (parseErr) {
      throw new Error('Unexpected response from the API.');
    }

    if (!json.success) {
      if (/session/i.test(json.message || '')) {
        clearToken();
        Auth.onSessionExpired();
      }
      throw new Error(json.message || 'Request failed.');
    }
    return json.data;
  }

  // ---------------------------------------------------------------------------
  // WRAPPED CALLS WITH DEDUPLICATION & CACHING
  // ---------------------------------------------------------------------------

  async function cachedGet(cacheKey, action, payload) {
    const entry = getCache[cacheKey];
    const now = Date.now();

    // Return stale data immediately if available and not too old
    if (entry.data && now - entry.ts < CACHE_TTL) {
      // Fire background refresh but don't block
      if (!entry.promise) {
        entry.promise = call(action, payload).then(d => {
          entry.data = d;
          entry.ts = now;
          entry.promise = null;
        }).catch(() => { entry.promise = null; });
      }
      return entry.data;
    }

    // Cache miss or expired — deduplicated fetch
    return dedup(`get:${cacheKey}`, async () => {
      const data = await call(action, payload);
      entry.data = data;
      entry.ts = now;
      return data;
    });
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  return {
    getToken, setToken, clearToken,

    // Auth
    signup: (payload) => call('signup', payload),
    login: (payload) => call('login', payload),
    logout: () => call('logout', {}),
    validateSession: () => call('validateSession', {}),
    currentUser: () => call('currentUser', {}),
    updateProfile: (payload) => call('updateProfile', payload).then(d => {
      invalidateGetCache(['dashboard']);
      // Update current user language if changed
      if (d && d.language) {
        I18N.setLocale(d.language);
        if (window.__updateUIStrings) window.__updateUIStrings();
      }
      return d;
    }),
    changePassword: (payload) => call('changePassword', payload),

    // Reference data
    modules: () => cachedGet('modules', 'modules', {}),
    categories: (moduleId) => call('categories', { module_id: moduleId }),
    // Category management
    createCategory: (payload) => call('createCategory', payload),
    updateCategory: (payload) => call('updateCategory', payload),
    deleteCategory: (id) => call('deleteCategory', { id }),
    toggleCategoryStatus: (id) => call('toggleCategoryStatus', { id }),

    // Topics
    topics: (filters) => cachedGet('topics', 'topics', filters || {}),
    topic: (id) => call('topic', { id }),
    createTopic: (payload) => call('createTopic', payload).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),
    updateTopic: (payload) => call('updateTopic', payload).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),
    deleteTopic: (id) => call('deleteTopic', { id }).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),
    updateStatus: (id, status) => call('updateStatus', { id, status }).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),
    updateProgress: (id, progress) => call('updateProgress', { id, progress }).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),

    // Knowledge
    knowledge: (topicId) => call('knowledge', { topic_id: topicId }),
    saveKnowledge: (payload) => call('saveKnowledge', payload).then(() => {
      invalidateGetCache(['topics']);
    }),

    // Reviews
    reviews: (topicId) => call('reviews', topicId ? { topic_id: topicId } : {}),
    addReview: (payload) => call('addReview', payload).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),
    markReviewed: (id, payload) => call('markReviewed', Object.assign({ id }, payload || {})).then(() => {
      invalidateGetCache(['topics', 'dashboard', 'analytics']);
    }),

    // Dashboard / analytics
    dashboard: () => cachedGet('dashboard', 'dashboard', {}),
    analytics: () => cachedGet('analytics', 'analytics', {}),

    // Admin
    adminUsers: () => call('adminUsers', {})
  };
})();
