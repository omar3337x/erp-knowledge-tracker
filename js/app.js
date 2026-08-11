/**
 * js/app.js — Optimized bootstrap with smart initial load, i18n, and improved loading UX.
 */

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
const UI = (function () {

  function toast(message, type) {
    const stack = document.getElementById('toast-stack');
    const el = document.createElement('div');
    el.className = `toast ${type || ''}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }

  function openModal(innerHtml, extraClass) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `
      <div class="overlay" id="modal-overlay">
        <div class="modal ${extraClass || ''}" id="modal-box" role="dialog" aria-modal="true">${innerHtml}</div>
      </div>`;
    const box = document.getElementById('modal-box');
    const overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    box.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
    document.addEventListener('keydown', escCloseOnce);
    return box;
  }

  function escCloseOnce(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escCloseOnce); }
  }

  function closeModal() {
    document.getElementById('modal-root').innerHTML = '';
  }

  function emptyState(title, hint) {
    return `<div class="empty-state"><h3>${title}</h3><p>${hint}</p></div>`;
  }

  function errorState(message) {
    return `<div class="empty-state"><h3>${message}</h3></div>`;
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toISOString().slice(0, 10);
  }

  function gaugeRing(percent, size) {
    size = size || 48;
    const pct = Math.max(0, Math.min(100, percent));
    return `
      <div class="gauge-ring" style="
        width:${size}px; height:${size}px; border-radius:50%;
        background: conic-gradient(var(--brass) ${pct * 3.6}deg, var(--line-soft) 0deg);
        display:flex; align-items:center; justify-content:center;">
        <div style="width:${size - 12}px; height:${size - 12}px; border-radius:50%; background:var(--paper-raised);
          display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:${size * 0.24}px; font-weight:600;">
          ${pct}%
        </div>
      </div>`;
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('erp_tracker_theme', theme);
  }

  function skeletonCards(count) {
    let html = '<div class="grid grid-kpi">';
    for (let i = 0; i < count; i++) {
      html += `<div class="card kpi-card"><div class="skeleton" style="height:20px;width:60%;margin-bottom:8px;"></div><div class="skeleton" style="height:32px;width:40%;"></div></div>`;
    }
    html += '</div>';
    return html;
  }

  function skeletonModuleCards(count) {
    let html = '<div class="grid grid-modules">';
    for (let i = 0; i < count; i++) {
      html += `<div class="card module-card"><div class="skeleton" style="height:18px;width:70%;margin-bottom:12px;"></div><div class="skeleton" style="height:8px;width:100%;margin-bottom:8px;"></div><div class="skeleton" style="height:14px;width:50%;"></div></div>`;
    }
    html += '</div>';
    return html;
  }

  return { toast, openModal, closeModal, emptyState, errorState, fmtDate, gaugeRing, applyTheme, skeletonCards, skeletonModuleCards };
})();

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------
const State = {
  currentUser: null,
  modulesCache: [],
  categoriesCache: {},
  initialized: false
};

// ---------------------------------------------------------------------------
// ROUTER
// ---------------------------------------------------------------------------
const Router = (function () {

  let current = { route: 'dashboard', params: {} };

  const titles = {
    dashboard: 'dashboard.title',
    module: 'module.progress',
    gaps: 'nav.gaps',
    review: 'nav.review',
    analytics: 'nav.analytics',
    profile: 'nav.profile',
    admin: 'nav.admin',
    search: 'search.results_for'
  };

  function encodeHash(route, params) {
    const q = new URLSearchParams(params || {}).toString();
    return `#${route}${q ? '?' + q : ''}`;
  }

  function decodeHash() {
    const raw = location.hash.replace(/^#/, '') || 'dashboard';
    const [route, qs] = raw.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    return { route: route || 'dashboard', params };
  }

  function go(route, params) {
    location.hash = encodeHash(route, params);
  }

  function reload() {
    render(current.route, current.params);
  }

  async function render(route, params) {
    current = { route, params: params || {} };
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    let activeSelector = `[data-route="${route}"]`;
    if (route === 'module') activeSelector = `[data-route="module"][data-module-id="${params.id}"]`;
    const activeEl = document.querySelector(activeSelector);
    if (activeEl) activeEl.classList.add('active');

    const content = document.getElementById('content');
    const titleEl = document.getElementById('page-title');

    // Update page title
    const titleKey = titles[route] || route;
    titleEl.textContent = I18N.t(titleKey);

    if (route === 'dashboard') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_dashboard')}</div>`;
      try { await Dashboard.render(content); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'module') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_module')}</div>`;
      try { await Modules.render(content, params.id); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'gaps') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_gaps')}</div>`;
      try {
        const topics = await API.topics({});
        const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
        Topics.renderTable(content, gaps, { showModule: true, emptyHint: I18N.t('topics.empty_hint') });
      } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'review') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_review')}</div>`;
      try { await Reviews.renderCenter(content); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'analytics') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('analytics.loading')}</div>`;
      try { await Analytics.render(content); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'profile') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_profile')}</div>`;
      try { await Profile.render(content); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'admin') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('admin.loading')}</div>`;
      try { await Profile.renderAdmin(content); } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'search') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.searching')}</div>`;
      try {
        const topics = await API.topics({ search: params.q });
        Topics.renderTable(content, topics, { showModule: true, emptyHint: I18N.t('search.empty_hint') });
      } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    titleEl.textContent = I18N.t('general.page_not_found');
    content.innerHTML = UI.emptyState(I18N.t('general.page_not_found'), I18N.t('general.use_sidebar'));
  }

  function init() {
    window.addEventListener('hashchange', () => { const h = decodeHash(); render(h.route, h.params); });
  }

  return { go, reload, init, render, decodeHash };
})();

// ---------------------------------------------------------------------------
// APP BOOTSTRAP
// ---------------------------------------------------------------------------
const App = (function () {

  function buildSidebarModules() {
    const nav = document.getElementById('nav-modules');
    nav.innerHTML = State.modulesCache.map(m => `
      <button class="nav-item nav-module-sub" data-route="module" data-module-id="${m.id}">
        <span class="dot"></span>${I18N.getModuleName(m)}
      </button>
    `).join('');
    nav.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => Router.go('module', { id: btn.dataset.moduleId }));
    });
  }

  function updateUIStrings() {
    // Update static UI elements
    document.getElementById('tab-login').textContent = I18N.t('auth.login');
    document.getElementById('tab-signup').textContent = I18N.t('auth.signup');
    document.querySelector('#login-form label[for="login-identifier"]').textContent = I18N.t('auth.username_or_email');
    document.querySelector('#login-form label[for="login-password"]').textContent = I18N.t('auth.password');
    document.querySelector('#login-form button[type="submit"]').textContent = I18N.t('auth.login');
    document.querySelector('#login-form .checkbox-row label').textContent = I18N.t('auth.remember_me');

    document.querySelector('#signup-form label[for="signup-fullname"]').textContent = I18N.t('auth.full_name');
    document.querySelector('#signup-form label[for="signup-username"]').textContent = I18N.t('auth.username');
    document.querySelector('#signup-form label[for="signup-email"]').textContent = I18N.t('auth.email');
    document.querySelector('#signup-form label[for="signup-password"]').textContent = I18N.t('auth.password');
    document.querySelector('#signup-form label[for="signup-confirm"]').textContent = I18N.t('auth.confirm_password');
    document.querySelector('#signup-form button[type="submit"]').textContent = I18N.t('auth.create_account');

    // Nav items
    document.querySelector('[data-route="dashboard"]').textContent = I18N.t('nav.dashboard');
    document.querySelector('[data-route="gaps"]').textContent = I18N.t('nav.gaps');
    document.querySelector('[data-route="review"]').textContent = I18N.t('nav.review');
    document.querySelector('[data-route="analytics"]').textContent = I18N.t('nav.analytics');
    document.querySelector('[data-route="profile"]').textContent = I18N.t('nav.profile');
    const adminNav = document.getElementById('nav-admin');
    if (adminNav) adminNav.textContent = I18N.t('nav.admin');

    // Search placeholder
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.placeholder = I18N.t('search.placeholder');

    // Quick add button
    const quickAddBtn = document.getElementById('quick-add-btn');
    if (quickAddBtn) quickAddBtn.textContent = I18N.t('module.add_gap');

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.textContent = I18N.t('auth.logout') || 'Logout';

    // Page title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = I18N.t('nav.dashboard');

    // Language switcher
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) langSwitcher.value = I18N.getLocale();
  }

  function bindStaticNav() {
    document.querySelectorAll('#sidebar-nav > .nav-item').forEach(btn => {
      btn.addEventListener('click', () => Router.go(btn.dataset.route));
    });

    document.getElementById('menu-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      UI.applyTheme(next);
    });

    document.getElementById('quick-add-btn').addEventListener('click', () => {
      const defaultModuleId = State.modulesCache.length ? State.modulesCache[0].id : null;
      Topics.openAddModal(defaultModuleId, State.categoriesCache[defaultModuleId] || [], () => Router.reload());
    });

    const search = document.getElementById('global-search');
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && search.value.trim()) Router.go('search', { q: search.value.trim() });
    });

    // Language switcher
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
      langSwitcher.addEventListener('change', async (e) => {
        const locale = e.target.value;
        I18N.setLocale(locale);
        updateUIStrings();
        // Save language preference to user profile if logged in
        if (State.currentUser && API.getToken()) {
          try { await API.updateProfile({ language: locale }); } catch (err) { /* ignore */ }
        }
        // Re-render current route
        Router.reload();
      });
    }
  }

  async function boot() {
    Auth.showApp();

    if (!State.modulesCache.length) {
      try {
        State.modulesCache = await API.modules();
      } catch (err) {
        UI.toast(err.message, 'error');
      }
    }

    buildSidebarModules();

    if (State.currentUser && State.currentUser.role === 'Admin') {
      document.getElementById('nav-admin').classList.remove('hidden');
    }

    State.initialized = true;
    const h = Router.decodeHash();
    Router.render(h.route, h.params);
  }

  async function init() {
    const savedTheme = localStorage.getItem('erp_tracker_theme') || 'light';
    UI.applyTheme(savedTheme);

    // Initialize i18n
    I18N.init();
    updateUIStrings();

    Auth.init();
    bindStaticNav();
    Router.init();

    const restored = await Auth.tryRestoreSession();
    if (restored) {
      // Load user's language preference from profile
      if (State.currentUser && State.currentUser.language) {
        I18N.setLocale(State.currentUser.language);
        updateUIStrings();
      }
      await boot();
    }
  }

  // Expose for external access (e.g., from auth.js on session restore)
  window.__updateUIStrings = updateUIStrings;

  return { init, boot };
})();

document.addEventListener('DOMContentLoaded', App.init);
