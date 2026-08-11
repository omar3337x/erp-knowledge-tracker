/**
 * js/app.js
 * UI helpers (toast/modal/gauge/states), global State, hash-based Router,
 * and the App bootstrap that ties every module together.
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
    return `<div class="empty-state"><h3>Something went wrong</h3><p>${message}</p></div>`;
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toISOString().slice(0, 10);
  }

  // Signature "instrument gauge" ring, built with a conic-gradient dial.
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

  return { toast, openModal, closeModal, emptyState, errorState, fmtDate, gaugeRing, applyTheme };
})();

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------
const State = {
  currentUser: null,
  modulesCache: [],
  categoriesCache: {}
};

// ---------------------------------------------------------------------------
// Router (hash based — works natively on GitHub Pages, no server config)
// ---------------------------------------------------------------------------
const Router = (function () {

  let current = { route: 'dashboard', params: {} };

  const titles = {
    dashboard: 'Dashboard', module: 'Module', gaps: 'Knowledge Gaps',
    review: 'Review Center', analytics: 'Analytics', profile: 'My Profile',
    admin: 'Administration', search: 'Search Results'
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

    if (route === 'dashboard') { titleEl.textContent = 'Dashboard'; return Dashboard.render(content); }
    if (route === 'module') {
      const mod = State.modulesCache.find(m => m.id === params.id);
      titleEl.textContent = mod ? mod.name_en : 'Module';
      return Modules.render(content, params.id);
    }
    if (route === 'gaps') {
      titleEl.textContent = 'Knowledge Gaps';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading...</div>`;
      try {
        const topics = await API.topics({});
        const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
        Topics.renderTable(content, gaps, { showModule: true, emptyHint: 'No open knowledge gaps right now — nice work.' });
      } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }
    if (route === 'review') { titleEl.textContent = 'Review Center'; return Reviews.renderCenter(content); }
    if (route === 'analytics') { titleEl.textContent = 'Analytics'; return Analytics.render(content); }
    if (route === 'profile') { titleEl.textContent = 'My Profile'; return Profile.render(content); }
    if (route === 'admin') { titleEl.textContent = 'Administration'; return Profile.renderAdmin(content); }
    if (route === 'search') {
      titleEl.textContent = `Search: "${params.q}"`;
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Searching...</div>`;
      try {
        const topics = await API.topics({ search: params.q });
        Topics.renderTable(content, topics, { showModule: true, emptyHint: 'Try a different search term.' });
      } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }
    titleEl.textContent = 'Not Found';
    content.innerHTML = UI.emptyState('Page not found', 'Use the sidebar to navigate.');
  }

  function init() {
    window.addEventListener('hashchange', () => { const h = decodeHash(); render(h.route, h.params); });
  }

  return { go, reload, init, render, decodeHash };
})();

// ---------------------------------------------------------------------------
// App bootstrap
// ---------------------------------------------------------------------------
const App = (function () {

  function buildSidebarModules() {
    const nav = document.getElementById('nav-modules');
    nav.innerHTML = State.modulesCache.map(m => `
      <button class="nav-item nav-module-sub" data-route="module" data-module-id="${m.id}">
        <span class="dot"></span>${m.name_en}
      </button>
    `).join('');
    nav.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => Router.go('module', { id: btn.dataset.moduleId }));
    });
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
  }

  // Loads everything needed after a successful login/session restore, then
  // shows the app shell and renders the current route.
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
    const h = Router.decodeHash();
    Router.render(h.route, h.params);
  }

  async function init() {
    const savedTheme = localStorage.getItem('erp_tracker_theme') || 'light';
    UI.applyTheme(savedTheme);

    Auth.init();
    bindStaticNav();
    Router.init();

    const restored = await Auth.tryRestoreSession();
    if (restored) await boot();
  }

  return { init, boot };
})();

document.addEventListener('DOMContentLoaded', App.init);
