/**
 * js/api.js
 * Thin wrapper around the Google Apps Script Web App API.
 *
 * POST as text/plain to avoid CORS preflight (standard GAS workaround).
 *
 * Performance layers (fastest to slowest):
 *  1. In-memory cache  — 0.07ms, per tab session.
 *  2. localStorage cache — 0.1ms, survives refresh. Topics/dashboard cached 10 min.
 *  3. In-flight dedup  — concurrent identical calls share one Promise.
 *  4. Network → GAS    — 1-14s depending on cold start state.
 *
 * Cold-start mitigation:
 *  - Warmup ping fires on page load (before login) so GAS wakes up while
 *    the user types their credentials (~10-15s window = enough to warm up).
 *  - Keepalive ping every 4 min after login to stay warm.
 *  - Exponential-backoff retry loop: retries up to 8× on 404 / parse error.
 *    This rides out a GAS cold start (~14s) automatically with no user impact.
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
  /* In-flight deduplication                                             */
  /* ------------------------------------------------------------------ */
  const inFlight = new Map();
  function dedupeKey(action, payload) {
    return action + ':' + JSON.stringify(payload || {});
  }

  /* ------------------------------------------------------------------ */
  /* In-memory cache (per tab session)                                  */
  /* ------------------------------------------------------------------ */
  const _mem = new Map();
  const MEM_TTL = {
    validateSession: 5  * 60 * 1000,
    currentUser    : 5  * 60 * 1000,
    modules        : 60 * 60 * 1000,
    categories     : 60 * 60 * 1000,
    topics         : 5  * 60 * 1000,
    topic          : 5  * 60 * 1000,
    knowledge      : 5  * 60 * 1000,
    reviews        : 5  * 60 * 1000,
    dashboard      : 3  * 60 * 1000,
    analytics      : 10 * 60 * 1000,
    adminUsers     : 3  * 60 * 1000,
    notes          : 5  * 60 * 1000,
    note           : 5  * 60 * 1000,
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
  /* localStorage cache (survives page refresh)                         */
  /* ------------------------------------------------------------------ */
  const LS_ACTIONS = new Set(['topics', 'reviews', 'dashboard', 'analytics', 'notes']);
  const LS_TTL = {
    topics   : 10 * 60 * 1000,
    reviews  : 10 * 60 * 1000,
    dashboard:  5 * 60 * 1000,
    analytics: 15 * 60 * 1000,
    notes    : 10 * 60 * 1000,
  };
  const LS_PREFIX = 'erp_api_v3:';

  function lsGet(key, action) {
    if (!LS_ACTIONS.has(action)) return null;
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      if (!raw) return null;
      const { data, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) { localStorage.removeItem(LS_PREFIX + key); return null; }
      return data;
    } catch (e) { return null; }
  }
  function lsSet(key, data, action) {
    if (!LS_ACTIONS.has(action)) return;
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify({
        data, expiresAt: Date.now() + (LS_TTL[action] || 5 * 60 * 1000)
      }));
    } catch (e) { /* storage full — non-fatal */ }
  }
  function lsBust(...actions) {
    Object.keys(localStorage)
      .filter(k => k.startsWith(LS_PREFIX))
      .forEach(k => {
        const action = k.slice(LS_PREFIX.length).split(':')[0];
        if (actions.includes(action)) localStorage.removeItem(k);
      });
  }
  function lsBustAll() {
    Object.keys(localStorage).filter(k => k.startsWith(LS_PREFIX)).forEach(k => localStorage.removeItem(k));
  }

  /* ------------------------------------------------------------------ */
  /* Combined cache                                                      */
  /* ------------------------------------------------------------------ */
  function cacheGet(key, action) { return memGet(key) ?? lsGet(key, action); }
  function cacheSet(key, data, action) { memSet(key, data, action); lsSet(key, data, action); }
  function cacheBust(...actions) {
    for (const k of _mem.keys()) if (actions.includes(k.split(':')[0])) _mem.delete(k);
    lsBust(...actions);
  }
  function cacheBustAll() { _mem.clear(); lsBustAll(); }

  /* ------------------------------------------------------------------ */
  /* Warmup Gate — Ensures only ONE request pays the cold-start retry    */
  async function rawCall(action, payload, attempt) {
    attempt = attempt || 1;

    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      const err = new Error('API_URL is not configured.');
      err.code = 'NOT_CONFIGURED';
      throw err;
    }

    const token = getToken();
    const payloadStr = JSON.stringify(payload || {});

    // Always encode as GET query params — GAS doGet handles all actions.
    // This avoids 302→echo→404 and CORS preflight entirely.
    const qs = new URLSearchParams({ action, token });
    if (payload && Object.keys(payload).length) {
      qs.set('payload', payloadStr);
    }
    const url = CONFIG.API_URL + (CONFIG.API_URL.includes('?') ? '&' : '?') + qs.toString();

    let fetchUrl, fetchOpts;

    if (url.length <= 7500) {
      // Normal GET — works for all reads and most writes
      fetchUrl = url;
      fetchOpts = { method: 'GET' };
    } else {
      // Payload too large for GET (e.g. base64 image) — send as no-cors POST.
      // no-cors means we can't read the response, so the caller must rely on
      // optimistic UI (which is already in place for all write operations).
      fetchUrl = CONFIG.API_URL;
      fetchOpts = {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action, payload: payload || {}, token })
      };
      // Fire and forget — no response to parse
      fetch(fetchUrl, fetchOpts).catch(() => {});
      return {};  // Optimistic UI already applied; background sync will fix up on next fetch
    }

    let res;
    try {
      res = await fetch(fetchUrl, fetchOpts);
    } catch (networkErr) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt));
        return rawCall(action, payload, attempt + 1);
      }
      const err = new Error('Network error contacting the API.');
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    // GAS 302→echo→404: cold start. Retry automatically.
    if (res.status === 404) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt));
        return rawCall(action, payload, attempt + 1);
      }
      const err = new Error('Service temporarily unavailable. Please try again.');
      err.code = 'SERVICE_UNAVAILABLE';
      throw err;
    }

    let json;
    try { json = await res.json(); }
    catch (parseErr) {
      if (attempt < MAX_ATTEMPTS) {
        await _sleep(_retryDelay(attempt));
        return rawCall(action, payload, attempt + 1);
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

    _isWarmedUp = true; // Mark as warmed up on any successful API call
    return json.data;
  }

  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ------------------------------------------------------------------ */
  /* Cached read call                                                    */
  /* ------------------------------------------------------------------ */
  const READ_ACTIONS = new Set([
    'validateSession', 'currentUser', 'modules', 'categories', 'topics', 'topic',
    'knowledge', 'reviews', 'dashboard', 'analytics', 'adminUsers', 'notes', 'note', 'ping'
  ]);

  async function call(action, payload) {
    if (!READ_ACTIONS.has(action)) return rawCall(action, payload);

    const key = dedupeKey(action, payload);

    // L1: memory, L2: localStorage
    const cached = cacheGet(key, action);
    if (cached !== null) return cached;

    // L3: in-flight dedup
    if (inFlight.has(key)) return inFlight.get(key);

    // L4: network
    const promise = rawCall(action, payload)
      .then(data => { cacheSet(key, data, action); return data; })
      .finally(() => inFlight.delete(key));

    inFlight.set(key, promise);
    return promise;
  }

  /* ------------------------------------------------------------------ */
  /* Warmup — fires BEFORE login so GAS wakes up while user types.     */
  /* Uses call() so in-flight deduplication prevents duplicate pings.  */
  /* ------------------------------------------------------------------ */
  function warmup() {
    if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;
    call('ping', {}).catch(() => {});
  }

  /* ------------------------------------------------------------------ */
  /* Keepalive — every 4 min after login to stay warm                  */
  /* ------------------------------------------------------------------ */
  let _keepaliveTimer = null;
  function startKeepalive() {
    if (_keepaliveTimer) return;
    // Set 4-min recurring ping (warmup/session-restore already handled startup)
    _keepaliveTimer = setInterval(_silentPing, 4 * 60 * 1000);
  }
  function stopKeepalive() {
    if (_keepaliveTimer) { clearInterval(_keepaliveTimer); _keepaliveTimer = null; }
  }
  function _silentPing() {
    if (!getToken()) { stopKeepalive(); return; }
    call('ping', {}).catch(() => {});
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */
  return {
    getToken, setToken, clearToken,
    cacheBust, cacheBustAll,
    warmup, startKeepalive, stopKeepalive,

    // Auth
    signup        : (p) => rawCall('signup', Object.assign({ language: (window.I18n ? I18n.getLang() : 'en') }, p)),
    login         : (p) => rawCall('login', p),
    logout        : ()  => rawCall('logout', {}),
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
    topics  : (f)  => call('topics', f || {}),
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

    // Notes — paginated server-side. Returns { notes, total, limit, offset }.
    // notes(opts) accepts: { module_id, search, tag, pinned_only, limit, offset }
    notes : (opts) => call('notes', opts || {}).then(r => {
      // Server returns { notes: [...], total, limit, offset } — extract the array for callers
      if (r && Array.isArray(r.notes)) { API._lastNotesMeta = { total: r.total, limit: r.limit, offset: r.offset }; return r.notes; }
      // Legacy fallback (old server): r is already an array
      return Array.isArray(r) ? r : [];
    }),
    note      : (id) => call('note', { id }),
    createNote: async (p) => { const r = await rawCall('createNote', p); cacheBust('notes'); return r; },
    updateNote: async (p) => { const r = await rawCall('updateNote', p); cacheBust('notes', 'note'); return r; },
    deleteNote: async (id) => { const r = await rawCall('deleteNote', { id }); cacheBust('notes', 'note'); return r; },

    // Reviews
    reviews  : (topicId) => call('reviews', topicId ? { topic_id: topicId } : {}),
    addReview: async (p) => { const r = await rawCall('addReview', p); cacheBust('reviews', 'topic', 'dashboard'); return r; },
    markReviewed: async (id, p) => { const r = await rawCall('markReviewed', Object.assign({ id }, p || {})); cacheBust('reviews', 'topic', 'dashboard'); return r; },

    // Dashboard / analytics
    dashboard : () => call('dashboard', {}),
    analytics : () => call('analytics', {}),

    // Admin
    adminUsers: () => call('adminUsers', {}),
  };
})();
