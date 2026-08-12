/**
 * js/app.js
 * UI helpers (toast/modal/gauge/states), global State, hash-based Router,
 * i18n bootstrap + language switcher, and the App bootstrap that ties
 * every module together.
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

  // Accepts either a plain string or a thrown API error ({message, code}).
  function toastError(err) {
    toast(I18n.errorMessage(err), 'error');
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

  function errorState(err) {
    return `<div class="empty-state"><h3>${I18n.t('common.notFound')}</h3><p>${I18n.errorMessage(err)}</p></div>`;
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

  // Applies every [data-i18n] / [data-i18n-placeholder] node in the static
  // shell (sidebar, topbar, auth screen). Dynamic view content is
  // translated inline via I18n.t() in each view's render function.
  function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = I18n.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', I18n.t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === I18n.getLang());
    });
  }

  return { toast, toastError, openModal, closeModal, emptyState, errorState, fmtDate, gaugeRing, applyTheme, applyStaticTranslations };
})();

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------
const State = {
  currentUser: null,
  modulesCache: [],
  allCategories: [],

  categoriesForModule(moduleId, opts) {
    opts = opts || {};
    let list = State.allCategories.filter(c => c.module_id === moduleId);
    if (!opts.includeInactive) list = list.filter(c => c.active === true || c.active === 'TRUE');
    return list;
  }
};

const REF_CACHE_KEY = 'erp_tracker_ref_cache_v1';
const REF_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 h — reference data changes rarely

/**
 * Loads Modules + ALL Categories in parallel.
 * Uses a localStorage layer (12 h TTL) as the outermost cache so a hard
 * refresh or new tab still feels instant. The in-memory API cache handles
 * all navigations within the same tab.
 */
async function loadReferenceData() {
  // Fast path: localStorage cache still fresh
  try {
    const raw = localStorage.getItem(REF_CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.savedAt < REF_CACHE_TTL_MS) {
        State.modulesCache  = cached.modules;
        State.allCategories = cached.categories;
        return;
      }
    }
  } catch (e) { /* corrupt cache — fall through to network */ }

  // Slow path: fetch both in parallel
  const [modules, categories] = await Promise.all([API.modules(), API.categories()]);
  State.modulesCache  = modules;
  State.allCategories = categories;
  try {
    localStorage.setItem(REF_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), modules, categories }));
  } catch (e) { /* storage full/unavailable — non-fatal */ }
}

function invalidateReferenceCache() {
  localStorage.removeItem(REF_CACHE_KEY);
  API.cacheBust('modules', 'categories');
}

// ---------------------------------------------------------------------------
// Router (hash based — works natively on GitHub Pages, no server config)
// ---------------------------------------------------------------------------
const Router = (function () {

  let current = { route: 'dashboard', params: {} };

  function titleFor(route, params) {
    if (route === 'module') {
      const mod = State.modulesCache.find(m => m.id === params.id);
      return mod ? I18n.localizedName(mod) : I18n.t('nav.modules');
    }
    const map = {
      dashboard: 'dashboard.title', gaps: 'nav.knowledgeGaps', review: 'nav.reviewCenter',
      analytics: 'analytics.title', profile: 'nav.myProfile', admin: 'admin.title'
    };
    return map[route] ? I18n.t(map[route]) : I18n.t('common.notFound');
  }

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
    titleEl.textContent = titleFor(route, params);

    if (route === 'dashboard') return Dashboard.render(content);
    if (route === 'module') return Modules.render(content, params.id);
    if (route === 'gaps') {
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
      try {
        const topics = await API.topics({});
        const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
        Topics.renderTable(content, gaps, { showModule: true, emptyHint: I18n.t('empty.noOpenGaps') });
      } catch (err) { content.innerHTML = UI.errorState(err); }
      return;
    }
    if (route === 'review') return Reviews.renderCenter(content);
    if (route === 'analytics') return Analytics.render(content);
    if (route === 'profile') return Profile.render(content);
    if (route === 'admin') return Profile.renderAdmin(content);
    if (route === 'search') {
      titleEl.textContent = `${I18n.t('common.search')}: "${params.q}"`;
      content.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
      try {
        const topics = await API.topics({ search: params.q });
        Topics.renderTable(content, topics, { showModule: true, emptyHint: I18n.t('empty.tryDifferentSearch') });
      } catch (err) { content.innerHTML = UI.errorState(err); }
      return;
    }
    content.innerHTML = UI.emptyState(I18n.t('common.notFound'), I18n.t('common.notFoundHint'));
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
        <span class="dot"></span>${I18n.localizedName(m)}
      </button>
    `).join('');
    nav.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => Router.go('module', { id: btn.dataset.moduleId }));
    });
  }

  function bindLanguageSwitch() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        if (lang === I18n.getLang()) return;
        I18n.setLang(lang);
        // Best-effort sync to the user's profile; never blocks the UI.
        if (State.currentUser) {
          API.updateProfile({ language: lang }).then(u => { State.currentUser = u; }).catch(() => {});
        }
      });
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
      Topics.openAddModal(defaultModuleId, () => Router.reload());
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
    if (State.currentUser && State.currentUser.language && State.currentUser.language !== I18n.getLang()) {
      I18n.setLang(State.currentUser.language);
    }
    // Always ensure reference data is loaded (uses LS + memory cache — fast).
    try { await loadReferenceData(); } catch (err) { UI.toastError(err); }
    buildSidebarModules();
    if (State.currentUser && State.currentUser.role === 'Admin') {
      document.getElementById('nav-admin').classList.remove('hidden');
    }
    const h = Router.decodeHash();
    Router.render(h.route, h.params);
  }

  async function init() {
    I18n.init();
    UI.applyStaticTranslations();
    I18n.onChange(() => {
      UI.applyStaticTranslations();
      buildSidebarModules();
      if (!document.getElementById('app').classList.contains('hidden')) Router.reload();
    });

    const savedTheme = localStorage.getItem('erp_tracker_theme') || 'light';
    UI.applyTheme(savedTheme);

    // ── RADICAL SPEED FIX ──────────────────────────────────────────────
    // Fire a warmup ping to GAS immediately — before Auth.init() even runs.
    // GAS cold start takes ~14s. The user spends ~10-30s on the login screen
    // typing credentials. By the time they click "Login", GAS is already warm
    // and their first real request responds in 1-2s instead of 14s.
    API.warmup();
    // ──────────────────────────────────────────────────────────────────

    Auth.init();
    bindStaticNav();
    bindLanguageSwitch();
    Router.init();

    // Kick off session restore. While that round-trip is in-flight, also
    // prefetch reference data speculatively if a token exists — the two
    // requests run in parallel and the data is ready before boot() is called.
    const token = API.getToken();
    const refPrefetch = token ? loadReferenceData().catch(() => {}) : Promise.resolve();

    const restored = await Auth.tryRestoreSession();
    if (restored) {
      await refPrefetch; // already resolved if it finished first
      await boot();
    }
  }

  return { init, boot };
})();

document.addEventListener('DOMContentLoaded', App.init);
