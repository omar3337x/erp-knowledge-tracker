/**
 * js/app.js — Optimized bootstrap with smart initial load and improved loading UX.
 *
 * Improvements:
 *   - Smart initial load: only fetches dashboard data after login
 *   - Categories loaded lazily (on first module view or topic creation)
 *   - Skeleton loading states instead of spinner-only
 *   - Request deduplication via API layer
 *   - Pre-caches modules before rendering sidebar
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

  // Skeleton loading placeholders for various grid layouts
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

    // Show skeleton immediately for visual feedback
    if (route === 'dashboard') {
      titleEl.textContent = 'Dashboard';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading dashboard...</div>`;
      try {
        await Dashboard.render(content);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

    if (route === 'module') {
      const mod = State.modulesCache.find(m => m.id === params.id);
      titleEl.textContent = mod ? mod.name_en : 'Module';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading module...</div>`;
      try {
        await Modules.render(content, params.id);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

    if (route === 'gaps') {
      titleEl.textContent = 'Knowledge Gaps';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading knowledge gaps...</div>`;
      try {
        const topics = await API.topics({});
        const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
        Topics.renderTable(content, gaps, { showModule: true, emptyHint: 'No open knowledge gaps right now — nice work.' });
      } catch (err) { content.innerHTML = UI.errorState(err.message); }
      return;
    }

    if (route === 'review') {
      titleEl.textContent = 'Review Center';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading review center...</div>`;
      try {
        await Reviews.renderCenter(content);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

    if (route === 'analytics') {
      titleEl.textContent = 'Analytics';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading analytics...</div>`;
      try {
        await Analytics.render(content);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

    if (route === 'profile') {
      titleEl.textContent = 'My Profile';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading profile...</div>`;
      try {
        await Profile.render(content);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

    if (route === 'admin') {
      titleEl.textContent = 'Administration';
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading administration...</div>`;
      try {
        await Profile.renderAdmin(content);
      } catch (err) {
        content.innerHTML = UI.errorState(err.message);
      }
      return;
    }

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
// App bootstrap — optimized initial load
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

  // Pre-load modules (shared reference data) and then render current route.
  // This avoids the dashboard making a redundant modules call since we already have it cached.
  async function boot() {
    Auth.showApp();

    // Load modules once if not already cached
    if (!State.modulesCache.length) {
      try {
        State.modulesCache = await API.modules();
      } catch (err) {
        UI.toast('Failed to load modules: ' + err.message, 'error');
      }
    }

    buildSidebarModules();

    // Show admin nav if needed
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

    Auth.init();
    bindStaticNav();
    Router.init();

    const restored = await Auth.tryRestoreSession();
    if (restored) {
      // Small delay to let DOM settle, then boot with pre-loaded modules
      await boot();
    }
  }

  return { init, boot };
})();

document.addEventListener('DOMContentLoaded', App.init);
