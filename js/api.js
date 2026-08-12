/**
 * js/api.js
 * Thin wrapper around the Google Apps Script Web App API.
 *
 * We always POST as text/plain (not application/json) so the browser does
 * NOT send a CORS preflight OPTIONS request — Apps Script web apps cannot
 * reliably handle preflight, so this is the standard workaround. The Apps
 * Script side still parses the body as JSON.
 *
 * Includes client-side request de-duplication: if the exact same read
 * action + payload is already in flight, callers get the same Promise
 * instead of firing a second identical request.
 */

const SESSION_KEY = 'erp_tracker_session_token';

const API = (function () {

  const inFlight = new Map();

  function getToken() {
    return localStorage.getItem(SESSION_KEY) || '';
  }
  function setToken(token) {
    if (token) localStorage.setItem(SESSION_KEY, token);
  }
  function clearToken() {
    localStorage.removeItem(SESSION_KEY);
  }

  function dedupeKey(action, payload) {
    return action + ':' + JSON.stringify(payload || {});
  }

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
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
    } catch (networkErr) {
      const err = new Error('Network error contacting the API.');
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    let json;
    try {
      json = await res.json();
    } catch (parseErr) {
      const err = new Error('Unexpected response from the API.');
      err.code = 'SERVER_ERROR';
      throw err;
    }

    if (!json.success) {
      const err = new Error(json.message || 'Request failed.');
      err.code = json.code || 'ERROR';
      if (err.code === 'SESSION_EXPIRED') {
        clearToken();
        Auth.onSessionExpired();
      }
      throw err;
    }
    return json.data;
  }

  // Read actions are safe to de-duplicate (share one in-flight promise).
  // Write actions are never de-duplicated — each must actually execute.
  const READ_ACTIONS = new Set([
    'validateSession', 'currentUser', 'modules', 'categories', 'topics', 'topic',
    'knowledge', 'reviews', 'dashboard', 'analytics', 'adminUsers'
  ]);

  async function call(action, payload) {
    if (!READ_ACTIONS.has(action)) return rawCall(action, payload);

    const key = dedupeKey(action, payload);
    if (inFlight.has(key)) return inFlight.get(key);

    const promise = rawCall(action, payload).finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  }

  return {
    getToken, setToken, clearToken,

    // Auth
    signup: (payload) => call('signup', Object.assign({ language: (window.I18n ? I18n.getLang() : 'en') }, payload)),
    login: (payload) => call('login', payload),
    logout: () => call('logout', {}),
    validateSession: () => call('validateSession', {}),
    currentUser: () => call('currentUser', {}),
    updateProfile: (payload) => call('updateProfile', payload),
    changePassword: (payload) => call('changePassword', payload),

    // Reference data
    modules: () => call('modules', {}),
    categories: (moduleId) => call('categories', moduleId ? { module_id: moduleId } : {}),
    createCategory: (payload) => call('createCategory', payload),
    updateCategory: (payload) => call('updateCategory', payload),
    deleteCategory: (id) => call('deleteCategory', { id }),
    toggleCategoryStatus: (id) => call('toggleCategoryStatus', { id }),

    // Topics
    topics: (filters) => call('topics', filters || {}),
    topic: (id) => call('topic', { id }),
    createTopic: (payload) => call('createTopic', payload),
    updateTopic: (payload) => call('updateTopic', payload),
    deleteTopic: (id) => call('deleteTopic', { id }),
    updateStatus: (id, status) => call('updateStatus', { id, status }),
    updateProgress: (id, progress) => call('updateProgress', { id, progress }),

    // Knowledge
    knowledge: (topicId) => call('knowledge', { topic_id: topicId }),
    saveKnowledge: (payload) => call('saveKnowledge', payload),

    // Reviews
    reviews: (topicId) => call('reviews', topicId ? { topic_id: topicId } : {}),
    addReview: (payload) => call('addReview', payload),
    markReviewed: (id, payload) => call('markReviewed', Object.assign({ id }, payload || {})),

    // Dashboard / analytics
    dashboard: () => call('dashboard', {}),
    analytics: () => call('analytics', {}),

    // Admin
    adminUsers: () => call('adminUsers', {})
  };
})();
