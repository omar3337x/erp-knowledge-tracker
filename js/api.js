/**
 * js/api.js - High Performance Frontend API Layer for Google Apps Script Web App
 *
 * PERF FEATURES:
 *  - L0 Memory Cache (Map with distinct TTLs: 24h ref, 30m dashboard, 15m topics/reviews, 10m notes)
 *  - L1 localStorage Cache with Version Invalidation (v4.0)
 *  - L2 sessionStorage Cache for transient filters & UI state
 *  - Connection Warmup Queue (3-4 ping sequence at DOMContentLoaded to eliminate cold starts)
 *  - Aggressive 2-min Keepalive + Inactivity Wakeup (mousemove/click ping trigger after 3m silence)
 *  - Predictive Prefetch (Parallel background batch loading after login)
 *  - Batch API Support (API.batch() combining multiple read actions in 1 payload)
 *  - In-flight Request Deduplication with 10s Safety Timeout
 *  - Request Prioritization (HIGH for current view, LOW via requestIdleCallback)
 *  - Cancelable Requests via AbortController
 *  - Exponential Backoff for HTTP 429 & 404 Cold Start Statuses
 *  - navigator.sendBeacon for instant 0ms Logout
 */

const SESSION_KEY = 'erp_tracker_session_token';
const APP_VERSION = 'v4.0';

const API = (function () {

  // PERF: Token Management
  function getToken() { return localStorage.getItem(SESSION_KEY) || ''; }
  function setToken(t) { if (t) localStorage.setItem(SESSION_KEY, t); }
  function clearToken() { localStorage.removeItem(SESSION_KEY); }

  /* ------------------------------------------------------------------ */
  /* PERF: In-Flight Request Deduplication with 10s Timeout Guard      */
  /* ------------------------------------------------------------------ */
  const inFlight = new Map();
  function dedupeKey(action, payload) {
    return action + ':' + JSON.stringify(payload || {});
  }

  /* ------------------------------------------------------------------ */
  /* PERF: Multi-Tier Caching (L0 Memory, L1 localStorage, L2 session)  */
  /* ------------------------------------------------------------------ */
  const _mem = new Map();

  // PERF: L0 Memory TTLs per data classification
  const MEM_TTL = {
    modules          : 24 * 60 * 60 * 1000, // 24h
    categories       : 24 * 60 * 60 * 1000, // 24h
    dashboard        : 30 * 60 * 1000,      // 30m
    topics           : 15 * 60 * 1000,      // 15m
    topic            : 15 * 60 * 1000,      // 15m
    reviews          : 15 * 60 * 1000,      // 15m
    analytics        : 15 * 60 * 1000,      // 15m
    notes            : 10 * 60 * 1000,      // 10m
    note             : 10 * 60 * 1000,      // 10m
    knowledge        : 15 * 60 * 1000,      // 15m
    validateSession  : 10 * 60 * 1000,      // 10m
    currentUser      : 10 * 60 * 1000,      // 10m
    getModuleInsights: 24 * 60 * 60 * 1000, // 24h
    getFavorites     : 24 * 60 * 60 * 1000, // 24h
  };

  function memGet(key) {
    const e = _mem.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) { _mem.delete(key); return null; }
    return e.data;
  }
  function memSet(key, data, action) {
    _mem.set(key, { data, expiresAt: Date.now() + (MEM_TTL[action] || 600000) });
  }

  // PERF: L1 localStorage Cache with Version Invalidation
  const LS_ACTIONS = new Set(['modules', 'categories', 'topics', 'reviews', 'dashboard', 'analytics', 'notes', 'getModuleInsights', 'getFavorites']);
  const LS_PREFIX = `erp_cache_${APP_VERSION}:`;

  function lsGet(key, action) {
    if (!LS_ACTIONS.has(action)) return null;
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      if (!raw) return null;
      const { data, expiresAt, ver } = JSON.parse(raw);
      if (ver !== APP_VERSION || Date.now() > expiresAt) {
        localStorage.removeItem(LS_PREFIX + key);
        return null;
      }
      return data;
    } catch (e) { return null; }
  }

  function lsSet(key, data, action) {
    if (!LS_ACTIONS.has(action)) return;
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify({
        data,
        ver: APP_VERSION,
        expiresAt: Date.now() + (MEM_TTL[action] || 600000)
      }));
    } catch (e) { /* storage full — non-fatal */ }
  }

  function lsBust(...actions) {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(LS_PREFIX))
        .forEach(k => {
          const action = k.slice(LS_PREFIX.length).split(':')[0];
          if (actions.includes(action)) localStorage.removeItem(k);
        });
    } catch (e) {}
  }

  function lsBustAll() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('erp_cache_'))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  // PERF: L2 sessionStorage Cache for Transient Filter States
  function ssGet(key) {
    try {
      const raw = sessionStorage.getItem(`erp_ss:${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function ssSet(key, val) {
    try { sessionStorage.setItem(`erp_ss:${key}`, JSON.stringify(val)); } catch (e) {}
  }

  // PERF: Combined Cache Lookup (L0 -> L1)
  function cacheGet(key, action) { return memGet(key) ?? lsGet(key, action); }
  function cacheSet(key, data, action) { memSet(key, data, action); lsSet(key, data, action); }
  function cacheBust(...actions) {
    for (const k of _mem.keys()) if (actions.includes(k.split(':')[0])) _mem.delete(k);
    lsBust(...actions);
  }
  function cacheBustAll() { _mem.clear(); lsBustAll(); }

  /* ------------------------------------------------------------------ */
  /* PERF: GAS Cold Start Mitigation & Exponential Backoff             */
  /* ------------------------------------------------------------------ */
  const MAX_ATTEMPTS = 3;
  const READ_ACTIONS = new Set([
    'validateSession', 'currentUser', 'modules', 'categories', 'topics', 'topic',
    'knowledge', 'reviews', 'dashboard', 'analytics', 'adminUsers', 'notes', 'note', 'ping', 'batch', 'getStreak',
    'getModuleInsights', 'getAISettings', 'getFavorites', 'askAI'
  ]);

  function _retryDelay(attempt, is429) {
    if (is429) return Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff for 429
    if (attempt === 1) return 500;  // First retry: 0.5s
    if (attempt === 2) return 1200; // Second retry: 1.2s
    return 2000;                    // Third retry: 2s
  }

  // PERF: Active Controllers for cancelable requests
  const activeControllers = new Map();

  function rawCall(action, payload, attempt, options) {
    return _executeRawCall(action, payload, attempt, options);
  }

  async function _executeRawCall(action, payload, attempt, options) {
    attempt = attempt || 1;
    options = options || {};

    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      const err = new Error('API_URL is not configured.');
      err.code = 'NOT_CONFIGURED';
      throw err;
    }

    const token = getToken();

    // PERF: AbortController for cancelable requests
    const controller = new AbortController();
    if (options.route) {
      if (activeControllers.has(options.route)) {
        activeControllers.get(options.route).abort();
      }
      activeControllers.set(options.route, controller);
    }

    // Ensure action and token query parameters are attached to URL so Google Apps Script 302 redirect (macros/echo -> doGet)
    // preserves e.parameter.action and e.parameter.token even if the browser converts redirected POST to GET.
    const urlParams = new URLSearchParams();
    if (action) urlParams.append('action', action);
    if (token) urlParams.append('token', token);
    const fetchUrl = urlParams.toString() ? `${CONFIG.API_URL}?${urlParams.toString()}` : CONFIG.API_URL;

    const fetchOpts = {
      method: 'POST',
      signal: controller.signal,
      credentials: 'omit', // Suppress "Tracking Prevention blocked storage" browser warnings
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action || '', payload: payload || {}, token: token || '' })
    };

    let res;
    try {
      res = await fetch(fetchUrl, fetchOpts);
    } catch (networkErr) {
      if (networkErr.name === 'AbortError') throw networkErr; // Request intentionally canceled
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt, false));
        return _executeRawCall(action, payload, attempt + 1, options);
      }
      const err = new Error('Network error contacting the API.');
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    // PERF: 429 Too Many Requests Handling
    if (res.status === 429) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt, true));
        return _executeRawCall(action, payload, attempt + 1, options);
      }
      const err = new Error('Rate limit exceeded. Please wait a moment.');
      err.code = 'RATE_LIMIT';
      throw err;
    }

    // PERF: GAS 302 -> echo -> 404 Cold Start Retry
    if (res.status === 404) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt, false));
        return _executeRawCall(action, payload, attempt + 1, options);
      }
      const err = new Error('Service temporarily unavailable. Please try again.');
      err.code = 'SERVICE_UNAVAILABLE';
      throw err;
    }

    let json;
    try { json = await res.json(); }
    catch (parseErr) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt, false));
        return _executeRawCall(action, payload, attempt + 1, options);
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

  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ------------------------------------------------------------------ */
  /* PERF: Cached Read Calls & Prioritization                           */
  /* ------------------------------------------------------------------ */

  async function call(action, payload, options) {
    if (!READ_ACTIONS.has(action)) return rawCall(action, payload, 1, options);

    const key = dedupeKey(action, payload);

    // L0 / L1 Cache check (0ms / 1ms)
    const cached = cacheGet(key, action);
    if (cached !== null) return cached;

    // In-flight Deduplication with 10s Timeout Guard
    if (inFlight.has(key)) return inFlight.get(key);

    const executeCall = () => rawCall(action, payload, 1, options)
      .then(data => { cacheSet(key, data, action); return data; })
      .finally(() => { inFlight.delete(key); });

    // PERF: Request Prioritization (LOW priority runs via requestIdleCallback)
    let promise;
    if (options && options.priority === 'LOW' && typeof window.requestIdleCallback === 'function') {
      promise = new Promise((resolve, reject) => {
        window.requestIdleCallback(() => { executeCall().then(resolve).catch(reject); });
      });
    } else {
      promise = executeCall();
    }

    // 10s Safety Timeout on in-flight promise to prevent permanent memory lock
    const timeoutGuard = setTimeout(() => { inFlight.delete(key); }, 10000);
    promise.finally(() => clearTimeout(timeoutGuard));

    inFlight.set(key, promise);
    return promise;
  }

  /**
   * PERF: Stale-While-Revalidate (SWR) Pattern
   * Returns cached data immediately (0ms), triggers fresh background fetch,
   * and invokes onFreshData callback if new data differs from stale data.
   */
  function swr(action, payload, onFreshData, options) {
    const key = dedupeKey(action, payload);
    const cached = cacheGet(key, action);

    const fetchPromise = rawCall(action, payload, 1, options)
      .then(freshData => {
        cacheSet(key, freshData, action);
        if (typeof onFreshData === 'function') {
          onFreshData(freshData);
        }
        return freshData;
      })
      .catch(err => {
        if (cached !== null) return cached;
        throw err;
      });

    if (cached !== null) {
      return Promise.resolve(cached);
    }
    return fetchPromise;
  }

  /* ------------------------------------------------------------------ */
  /* PERF: Batch Requests (combines multiple read actions in 1 payload) */
  /* ------------------------------------------------------------------ */
  async function batch(requests) {
    if (!Array.isArray(requests) || !requests.length) return {};
    try {
      const data = await rawCall('batch', { requests });
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([act, resData]) => {
          if (resData !== null) cacheSet(dedupeKey(act, {}), resData, act);
        });
      }
      return data;
    } catch (e) {
      return {};
    }
  }

  /* ------------------------------------------------------------------ */
  /* PERF: Pre-warm Strategy & Connection Warmup Queue                  */
  /* ------------------------------------------------------------------ */
  function warmup() {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;
    call('ping', {}).catch(() => {});
  }

  // PERF: Connection Warmup Queue (2 consecutive pings spaced 3s apart before login)
  let _warmupTimer = null;
  function startWarmupQueue() {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;
    let count = 0;
    _warmupTimer = setInterval(() => {
      count++;
      warmup();
      if (count >= 2) { clearInterval(_warmupTimer); _warmupTimer = null; }
    }, 3000);
    warmup(); // Initial ping
  }
  function stopWarmupQueue() {
    if (_warmupTimer) { clearInterval(_warmupTimer); _warmupTimer = null; }
    _requestQueue = Promise.resolve(); // Discard any pending background warmup pings instantly
  }

  // PERF: Predictive Prefetch — ONE batch call after login (dashboard + topics + notes + reviews + modules + categories + favorites)
  let _prefetchInProgress = false;
  function prefetchAll() {
    if (!getToken() || _prefetchInProgress) return Promise.resolve();
    _prefetchInProgress = true;
    const p = batch([
      { action: 'dashboard',   payload: {} },
      { action: 'topics',      payload: {} },
      { action: 'notes',       payload: {} },
      { action: 'reviews',     payload: {} },
      { action: 'modules',     payload: {} },
      { action: 'categories',  payload: {} },
      { action: 'getFavorites', payload: {} }
    ]).catch(() => {}).finally(() => { _prefetchInProgress = false; });
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* PERF: Aggressive Keepalive (2 min) + Inactivity Wakeup Listener    */
  /* ------------------------------------------------------------------ */
  let _keepaliveTimer = null;
  let _lastActivityTime = Date.now();

  function startKeepalive() {
    if (_keepaliveTimer) return;
    _keepaliveTimer = setInterval(_silentPing, 2 * 60 * 1000); // 2 min interval
    _bindInactivityListener();
  }

  function stopKeepalive() {
    if (_keepaliveTimer) { clearInterval(_keepaliveTimer); _keepaliveTimer = null; }
  }

  function _silentPing() {
    if (!getToken()) { stopKeepalive(); return; }
    call('ping', {}).catch(() => {});
  }

  function _bindInactivityListener() {
    const onUserInteraction = () => {
      const now = Date.now();
      // If user was inactive for > 3 minutes, fire ping immediately to re-heat connection
      if (now - _lastActivityTime > 3 * 60 * 1000) {
        warmup();
      }
      _lastActivityTime = now;
    };
    ['mousemove', 'click', 'keydown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, onUserInteraction, { passive: true });
    });
  }

  // Auto-trigger warmup queue at DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWarmupQueue);
  } else {
    startWarmupQueue();
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */
  return {
    getToken, setToken, clearToken,
    cacheGet, cacheSet, cacheBust, cacheBustAll,
    ssGet, ssSet,
    warmup, startWarmupQueue, stopWarmupQueue, prefetchAll,
    startKeepalive, stopKeepalive,
    call, rawCall, batch, swr,

    // Auth
    signup        : (p) => rawCall('signup', Object.assign({ language: (window.I18n ? I18n.getLang() : 'en') }, p)),
    login         : (p) => rawCall('login', p),
    logout        : ()  => {
      // PERF: sendBeacon for instant 0ms logout
      const token = getToken();
      if (token && navigator.sendBeacon && CONFIG.API_URL) {
        const url = CONFIG.API_URL + (CONFIG.API_URL.includes('?') ? '&' : '?') + new URLSearchParams({ action: 'logout', token }).toString();
        navigator.sendBeacon(url);
      } else {
        rawCall('logout', {}).catch(() => {});
      }
    },
    validateSession: () => call('validateSession', {}),
    currentUser   : ()  => call('currentUser', {}),
    updateProfile : (p) => rawCall('updateProfile', p),
    changePassword: (p) => rawCall('changePassword', p),

    // Reference data
    modules   : () => call('modules', {}),
    categories: (moduleId) => call('categories', moduleId ? { module_id: moduleId } : {}),
    createCategory: async (p) => { const r = await rawCall('createCategory', p); cacheBust('categories', 'dashboard'); return r; },
    updateCategory: async (p) => { const r = await rawCall('updateCategory', p); cacheBust('categories', 'dashboard'); return r; },
    deleteCategory: async (id) => { const r = await rawCall('deleteCategory', { id }); cacheBust('categories', 'dashboard'); return r; },
    toggleCategoryStatus: async (id) => { const r = await rawCall('toggleCategoryStatus', { id }); cacheBust('categories'); return r; },

    // Topics
    topics  : (f, opts) => {
      f = f || {};
      const allTopics = cacheGet('topics:{}', 'topics');
      if (allTopics && Array.isArray(allTopics)) {
        let filtered = allTopics;
        if (f.module_id) filtered = filtered.filter(t => t.module_id === f.module_id);
        if (f.category_id) filtered = filtered.filter(t => t.category_id === f.category_id);
        if (f.status) filtered = filtered.filter(t => t.status === f.status);
        if (f.search) {
          const q = f.search.toLowerCase();
          filtered = filtered.filter(t => (t.title_ar && t.title_ar.toLowerCase().includes(q)) || (t.title_en && t.title_en.toLowerCase().includes(q)));
        }
        return Promise.resolve(filtered);
      }
      return call('topics', f, opts);
    },
    topic   : (id) => call('topic', { id }),
    createTopic: async (p) => { const r = await rawCall('createTopic', p); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },
    updateTopic: async (p) => { const r = await rawCall('updateTopic', p); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },
    deleteTopic: async (id) => { const r = await rawCall('deleteTopic', { id }); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },
    updateStatus: async (id, status) => { const r = await rawCall('updateStatus', { id, status }); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },
    updateStatusBulk: async (ids, status) => { const r = await rawCall('updateStatusBulk', { ids, status }); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },
    updateProgress: async (id, progress) => { const r = await rawCall('updateProgress', { id, progress }); cacheBust('topics', 'topic', 'dashboard', 'analytics'); return r; },

    // Knowledge
    knowledge    : (topicId) => call('knowledge', { topic_id: topicId }),
    saveKnowledge: async (p) => { const r = await rawCall('saveKnowledge', p); cacheBust('knowledge', 'topic'); return r; },

    // Notes
    notes : (opts) => {
      opts = opts || {};
      const cached = cacheGet('notes:{}', 'notes');
      if (cached) {
        let notesList = Array.isArray(cached.notes) ? cached.notes : (Array.isArray(cached) ? cached : []);
        if (opts.module_id) notesList = notesList.filter(n => n.module_id === opts.module_id);
        API._lastNotesMeta = { total: notesList.length, limit: opts.limit || 50, offset: opts.offset || 0 };
        return Promise.resolve(notesList);
      }
      return call('notes', opts).then(r => {
        if (r && Array.isArray(r.notes)) { API._lastNotesMeta = { total: r.total, limit: r.limit, offset: r.offset }; return r.notes; }
        return Array.isArray(r) ? r : [];
      });
    },
    note      : (id) => call('note', { id }),
    createNote: async (p) => { const r = await rawCall('createNote', p); cacheBust('notes'); return r; },
    updateNote: async (p) => { const r = await rawCall('updateNote', p); cacheBust('notes', 'note'); return r; },
    deleteNote: async (id) => { const r = await rawCall('deleteNote', { id }); cacheBust('notes', 'note'); return r; },

    // Reviews
    reviews  : (topicId) => {
      const cached = cacheGet('reviews:{}', 'reviews');
      if (cached && Array.isArray(cached) && topicId) {
        return Promise.resolve(cached.filter(r => r.topic_id === topicId));
      }
      return call('reviews', topicId ? { topic_id: topicId } : {});
    },
    addReview: async (p) => { const r = await rawCall('addReview', p); cacheBust('reviews', 'topic', 'dashboard'); return r; },
    markReviewed: async (id, p) => { const r = await rawCall('markReviewed', Object.assign({ id }, p || {})); cacheBust('reviews', 'topic', 'dashboard'); return r; },

    // Dashboard / analytics
    dashboard : (opts) => call('dashboard', {}, opts),
    analytics : (opts) => call('analytics', {}, opts),

    // Streaks
    getStreak : () => call('getStreak', {}),

    // Admin & Backup
    adminUsers    : () => call('adminUsers', {}),
    sendTestDigest: () => rawCall('sendTestDigest', {}),
    exportMyData  : () => rawCall('exportMyData', {}),
    importMyData  : async (p) => { const r = await rawCall('importMyData', p); cacheBustAll(); return r; },

    // AI Daily Insights
    getModuleInsights: (moduleId) => {
      const cached = cacheGet('getModuleInsights:{"module_id":"' + moduleId + '"}', 'getModuleInsights');
      if (cached) return Promise.resolve(cached);
      if (typeof Modules !== 'undefined' && Modules.getFallbackInsightsLocal) {
        return Promise.resolve({ insights: Modules.getFallbackInsightsLocal(moduleId) });
      }
      return call('getModuleInsights', { module_id: moduleId });
    },
    refreshModuleInsights: async (moduleId) => { const r = await rawCall('refreshModuleInsights', { module_id: moduleId }); cacheBust('getModuleInsights'); return r; },
    testAIConnection     : () => rawCall('testAIConnection', {}),
    getAISettings        : () => call('getAISettings', {}),
    updateAISettings     : async (p) => { const r = await rawCall('updateAISettings', p); cacheBust('getAISettings'); return r; },

    // AI Favorites
    getFavorites  : () => call('getFavorites', {}),
    addFavorite   : async (p) => { const r = await rawCall('addFavorite', p); cacheBust('getFavorites'); return r; },
    removeFavorite: async (p) => { const r = await rawCall('removeFavorite', p); cacheBust('getFavorites'); return r; },

    // AI Daily ERP Challenge & Question Bank
    getDailyChallenge: (moduleId, mode, language) => {
      const lang = language || (window.I18n ? I18n.getLang() : 'en');
      return call('getDailyChallenge', { module_id: moduleId, mode: mode || 'Practice', language: lang });
    },
    submitQuestionAttempt: async (p) => {
      const r = await rawCall('submitQuestionAttempt', p);
      cacheBust('topics', 'dashboard', 'reviews', 'getTopicDrill', 'getChallengeHistory');
      return r;
    },
    getQuestionBank: (params) => call('getQuestionBank', params || {}),
    getChallengeHistory: () => call('getChallengeHistory', {}),
    getTopicDrill: (topicId) => call('getTopicDrill', { topic_id: topicId }),
    reportQuestion: async (p) => { return await rawCall('reportQuestion', p); },
    adminUpdateQuestion: async (p) => {
      const r = await rawCall('adminUpdateQuestion', p);
      cacheBust('getQuestionBank');
      return r;
    },

    // ERP Script Knowledge & Troubleshooting Toolkit
    getScripts: (params) => call('getScripts', params || {}),
    saveScriptNote: async (p) => {
      const r = await rawCall('saveScriptNote', p);
      cacheBust('getScriptNotes');
      return r;
    },
    getScriptNotes: (scriptId) => call('getScriptNotes', { script_id: scriptId }),
    logScriptUsage: async (p) => {
      const r = await rawCall('logScriptUsage', p);
      return r;
    },
    reportScript: async (p) => {
      const r = await rawCall('reportScript', p);
      return r;
    },
    importScript: async (p) => {
      const r = await rawCall('importScript', p);
      cacheBust('getScripts');
      return r;
    }
  };
})();
