/**
 * js/auth.js - Instant Authentication & Non-blocking Session Management
 *
 * PERF FEATURES:
 *  - 0ms First Paint: Shows login screen instantly without waiting for any API call.
 *  - Non-blocking tryRestoreSession: Boots App shell in 0ms using cached user data while verifying in background.
 *  - Reflow-free handleLogin: Uses a clean CSS spinner instead of repeating text changes every 2.5s.
 *  - 0ms Logout: Instant local cleanup with navigator.sendBeacon background notification.
 *  - Predictive Prefetch: Automatically triggers API.prefetchAll() immediately after successful login.
 */

const Auth = (function () {

  const USER_LS_KEY = 'erp_tracker_user_v1';

  // PERF: User Profile Cache
  function getCachedUser() {
    try {
      const raw = localStorage.getItem(USER_LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveCachedUser(user) {
    try {
      if (user) localStorage.setItem(USER_LS_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_LS_KEY);
    } catch (e) {}
  }

  // PERF: 0ms UI Transitions
  function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }

  function showApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  }

  function switchTab(tab) {
    const isLogin = tab === 'login';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-signup').classList.toggle('active', !isLogin);
    document.getElementById('login-form').classList.toggle('hidden', !isLogin);
    document.getElementById('signup-form').classList.toggle('hidden', isLogin);
  }

  // PERF: Reflow-free Login Handler
  async function handleLogin(e) {
    e.preventDefault();
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    const origHtml = btn.innerHTML;
    btn.disabled = true;

    // PERF: Static spinner inside button — no layout thrashing or periodic text changes
    btn.innerHTML = `<span class="spinner" style="width:14px; height:14px; border-width:2px; display:inline-block; vertical-align:middle; margin-inline-end:6px;"></span> ${I18n.t('auth.loginButton')}`;

    // Stop any background warmup pings — they compete with the login request on GAS
    API.stopWarmupQueue();

    try {
      const data = await API.login({
        identifier: document.getElementById('login-identifier').value.trim(),
        password: document.getElementById('login-password').value,
        remember_me: document.getElementById('login-remember').checked
      });

      API.setToken(data.token);
      State.currentUser = data.user;
      saveCachedUser(data.user);

      UI.toast(I18n.t('toast.loginSuccessful'), 'success');
      API.startKeepalive();

      await App.boot();
    } catch (err) {
      errEl.textContent = I18n.errorMessage(err);
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const errEl = document.getElementById('signup-error');
    errEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await API.signup({
        full_name: document.getElementById('signup-fullname').value.trim(),
        username: document.getElementById('signup-username').value.trim(),
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value,
        confirm_password: document.getElementById('signup-confirm').value
      });
      UI.toast(I18n.t('toast.accountCreated'), 'success');
      document.getElementById('login-identifier').value = document.getElementById('signup-username').value.trim();
      document.getElementById('login-password').value = document.getElementById('signup-password').value;
      switchTab('login');
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    } catch (err) {
      errEl.textContent = I18n.errorMessage(err);
    } finally {
      btn.disabled = false;
    }
  }

  /**
   * PERF: Instant Logout (0ms)
   * Clears tokens, caches, state instantly in 0ms, and sends beacon background logout.
   */
  function logout() {
    API.logout(); // Sends beacon / background logout
    API.clearToken();
    API.cacheBustAll();
    API.stopKeepalive();
    if (typeof AutoSync !== 'undefined') AutoSync.stop();
    saveCachedUser(null);
    try {
      localStorage.removeItem('erp_notes_cache_v2');
      sessionStorage.clear();
    } catch(e) {}

    State.currentUser  = null;
    State.modulesCache = [];
    State.allCategories = [];

    showAuthScreen();
  }

  function onSessionExpired() {
    UI.toast(I18n.t('errors.SESSION_EXPIRED'), 'error');
    logout();
  }

  /**
   * PERF: Non-blocking Session Restore (0ms App Boot)
   * If token & cached user exist, boots App shell in 0ms, verifying in background.
   */
  async function tryRestoreSession() {
    const token = API.getToken();
    if (!token) { showAuthScreen(); return false; }

    const cachedUser = getCachedUser();

    if (cachedUser) {
      // 0ms Instant Boot using cached user
      State.currentUser = cachedUser;
      API.startKeepalive();
      API.prefetchAll();

      // Silent background validation — never blocks UI
      API.validateSession()
        .then(data => {
          State.currentUser = data.user;
          saveCachedUser(data.user);
          if (data.modules && data.modules.length) State.modulesCache = data.modules;
          if (data.categories && data.categories.length) State.allCategories = data.categories;
        })
        .catch(err => {
          if (err && err.code === 'SESSION_EXPIRED') onSessionExpired();
        });

      return true;
    }

    // Fallback: network validation
    try {
      const data = await API.validateSession();
      State.currentUser = data.user;
      saveCachedUser(data.user);
      if (data.modules && data.modules.length) State.modulesCache = data.modules;
      if (data.categories && data.categories.length) State.allCategories = data.categories;
      API.startKeepalive();
      API.prefetchAll();
      return true;
    } catch (err) {
      API.clearToken();
      saveCachedUser(null);
      showAuthScreen();
      return false;
    }
  }

  function init() {
    document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
    document.getElementById('tab-signup').addEventListener('click', () => switchTab('signup'));
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('logout-btn').addEventListener('click', logout);
  }

  return { init, showAuthScreen, showApp, tryRestoreSession, logout, onSessionExpired };
})();
