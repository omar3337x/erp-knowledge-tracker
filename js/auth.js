/**
 * js/auth.js
 * Sign Up / Login / Logout / Session bootstrapping.
 * All real authentication happens server-side in Code.gs — this file only
 * collects form input, calls the API, and reacts to the result.
 */

const Auth = (function () {

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

  async function handleLogin(e) {
    e.preventDefault();
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.disabled = true;

    // Animated status so the user knows something is happening during cold start
    const statusMsgs = [
      I18n.t('auth.loginButton'),
      '⏳ ' + (I18n.getLang() === 'ar' ? 'جاري الاتصال...' : 'Connecting...'),
      '⏳ ' + (I18n.getLang() === 'ar' ? 'جاري التحقق...' : 'Authenticating...'),
      '⏳ ' + (I18n.getLang() === 'ar' ? 'تحضير البيانات...' : 'Loading data...'),
    ];
    let msgIdx = 0;
    const statusInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % statusMsgs.length;
      btn.textContent = statusMsgs[msgIdx];
    }, 3000);

    try {
      const data = await API.login({
        identifier: document.getElementById('login-identifier').value.trim(),
        password: document.getElementById('login-password').value,
        remember_me: document.getElementById('login-remember').checked
      });
      clearInterval(statusInterval);
      API.setToken(data.token);
      State.currentUser = data.user;
      UI.toast(I18n.t('toast.loginSuccessful'), 'success');
      API.startKeepalive();
      await App.boot();
    } catch (err) {
      clearInterval(statusInterval);
      errEl.textContent = I18n.errorMessage(err);
    } finally {
      btn.disabled = false;
      btn.textContent = origText;
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

  async function logout() {
    try { await API.logout(); } catch (e) { /* ignore */ }
    API.clearToken();
    API.cacheBustAll();             // wipe in-memory cache
    API.stopKeepalive();            // stop ping
    State.currentUser  = null;
    State.modulesCache = [];
    State.allCategories = [];
    showAuthScreen();
  }

  function onSessionExpired() {
    UI.toast(I18n.t('errors.SESSION_EXPIRED'), 'error');
    showAuthScreen();
  }

  // Tries to restore a session on page load using the stored token.
  async function tryRestoreSession() {
    const token = API.getToken();
    if (!token) { showAuthScreen(); return false; }
    try {
      const data = await API.validateSession();
      State.currentUser = data.user;
      if (data.modules && data.modules.length) State.modulesCache = data.modules;
      if (data.categories && data.categories.length) State.allCategories = data.categories;
      API.startKeepalive();
      return true;
    } catch (err) {
      API.clearToken();
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
