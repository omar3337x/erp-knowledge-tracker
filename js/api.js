/**
 * js/api.js
 * Thin wrapper around the Google Apps Script Web App API.
 *
 * We always POST as text/plain (not application/json) so the browser does
 * NOT send a CORS preflight OPTIONS request — Apps Script web apps cannot
 * reliably handle preflight, so this is the standard workaround. The Apps
 * Script side still parses the body as JSON.
 */

const SESSION_KEY = 'erp_tracker_session_token';

const API = (function () {

  function getToken() {
    return localStorage.getItem(SESSION_KEY) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(SESSION_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(SESSION_KEY);
  }

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

  return {
    getToken, setToken, clearToken,

    // Auth
    signup: (payload) => call('signup', payload),
    login: (payload) => call('login', payload),
    logout: () => call('logout', {}),
    validateSession: () => call('validateSession', {}),
    currentUser: () => call('currentUser', {}),
    updateProfile: (payload) => call('updateProfile', payload),
    changePassword: (payload) => call('changePassword', payload),

    // Reference data
    modules: () => call('modules', {}),
    categories: (moduleId) => call('categories', { module_id: moduleId }),

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
