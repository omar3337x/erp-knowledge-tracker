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
    btn.disabled = true;
    try {
      const data = await API.login({
        identifier: document.getElementById('login-identifier').value.trim(),
        password: document.getElementById('login-password').value,
        remember_me: document.getElementById('login-remember').checked
      });
      API.setToken(data.token);
      State.currentUser = data.user;
      UI.toast('Login successful', 'success');
      await App.boot();
    } catch (err) {
      errEl.textContent = err.message;
    } finally {
      btn.disabled = false;
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
      UI.toast('Account created. Logging you in...', 'success');
      document.getElementById('login-identifier').value = document.getElementById('signup-username').value.trim();
      document.getElementById('login-password').value = document.getElementById('signup-password').value;
      switchTab('login');
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    } catch (err) {
      errEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  }

  async function logout() {
    try { await API.logout(); } catch (e) { /* ignore */ }
    API.clearToken();
    State.currentUser = null;
    showAuthScreen();
  }

  function onSessionExpired() {
    UI.toast('Session expired. Please log in again.', 'error');
    showAuthScreen();
  }

  // Tries to restore a session on page load using the stored token.
  async function tryRestoreSession() {
    const token = API.getToken();
    if (!token) { showAuthScreen(); return false; }
    try {
      const data = await API.validateSession();
      State.currentUser = data.user;
      // Restore user's language preference
      if (data.user && data.user.language) {
        I18N.setLocale(data.user.language);
        if (window.__updateUIStrings) window.__updateUIStrings();
      }
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
