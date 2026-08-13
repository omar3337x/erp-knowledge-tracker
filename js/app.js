/**
 * js/app.js - Ultra-Fast App Shell, Debounced Search, Skeleton Helpers & Hash Router
 *
 * PERF FEATURES:
 *  - 0ms App Shell Render: Sidebar + Topbar render instantly with DEFAULT_MODULES in memory.
 *  - Reference Data Guard: Never re-fetches modules/categories if State.modulesCache is non-empty.
 *  - Skeleton UI Shimmers: Replaces generic spinners with layout-matching shimmer placeholders.
 *  - Debounced Input Helper: 300ms debouncing for global search and table filters.
 *  - Predictive Prefetch & Non-blocking Boot sequence.
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

  // PERF: Skeleton UI Shimmer Generator
  function skeleton(type) {
    if (type === 'kpi') {
      return `<div class="grid grid-kpi" style="margin-bottom:24px;">
        ${Array(9).fill(0).map(() => `
          <div class="card kpi-card skeleton-card">
            <div class="skeleton-line" style="width:60%; height:12px; margin-bottom:8px;"></div>
            <div class="skeleton-line" style="width:40%; height:26px;"></div>
          </div>
        `).join('')}
      </div>`;
    }
    if (type === 'modules') {
      return `<div class="grid grid-modules">
        ${Array(6).fill(0).map(() => `
          <div class="card module-card skeleton-card" style="padding:18px;">
            <div class="skeleton-line" style="width:70%; height:18px; margin-bottom:12px;"></div>
            <div class="skeleton-line" style="width:100%; height:8px; margin-bottom:12px;"></div>
            <div class="skeleton-line" style="width:50%; height:12px;"></div>
          </div>
        `).join('')}
      </div>`;
    }
    if (type === 'table') {
      return `<div class="table-wrap">
        <table style="width:100%;">
          <tbody>
            ${Array(6).fill(0).map(() => `
              <tr>
                <td><div class="skeleton-line" style="width:75%; height:14px;"></div></td>
                <td><div class="skeleton-line" style="width:50%; height:14px;"></div></td>
                <td><div class="skeleton-line" style="width:35%; height:14px;"></div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
    }
    return `<div class="card skeleton-card"><div class="skeleton-line" style="width:100%; height:80px;"></div></div>`;
  }

  // PERF: Debounce Function (300ms)
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay || 300);
    };
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

  return { toast, toastError, openModal, closeModal, emptyState, errorState, skeleton, debounce, fmtDate, gaugeRing, applyTheme, applyStaticTranslations };
})();

const ExportUtil = {
  downloadCsv(filename, headers, rows) {
    const processRow = row => row.map(val => {
      let v = val === null || val === undefined ? '' : String(val);
      v = v.replace(/"/g, '""');
      if (v.search(/("|,|\n)/) >= 0) v = `"${v}"`;
      return v;
    }).join(',');

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(processRow)].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportPdf() {
    window.print();
  }
};

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
const REF_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // PERF: 24h TTL for Reference Data

const DEFAULT_MODULES = [
  { id: 'MOD-1', name_en: 'Inventory', name_ar: 'المخزون' },
  { id: 'MOD-2', name_en: 'Accounting', name_ar: 'الحسابات' },
  { id: 'MOD-3', name_en: 'Maintenance', name_ar: 'الصيانة' },
  { id: 'MOD-4', name_en: 'Assets', name_ar: 'الأصول' },
  { id: 'MOD-5', name_en: 'Transportation', name_ar: 'النقليات' },
  { id: 'MOD-6', name_en: 'HR', name_ar: 'الموارد البشرية' },
  { id: 'MOD-7', name_en: 'Real Estate', name_ar: 'العقارات' },
  { id: 'MOD-8', name_en: 'Contracting', name_ar: 'المقاولات' },
  { id: 'MOD-9', name_en: 'Fuel Stations', name_ar: 'الوقود' },
  { id: 'MOD-10', name_en: 'Law Firm', name_ar: 'المحاماة' }
];

/**
 * PERF: Reference Data Guard
 * Never re-fetches modules/categories if State.modulesCache is non-empty.
 */
async function loadReferenceData() {
  if (Array.isArray(State.modulesCache) && State.modulesCache.length > 0 && Array.isArray(State.allCategories) && State.allCategories.length > 0) {
    return;
  }

  try {
    const raw = localStorage.getItem(REF_CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.savedAt < REF_CACHE_TTL_MS && Array.isArray(cached.modules) && cached.modules.length > 0) {
        State.modulesCache  = cached.modules;
        State.allCategories = cached.categories || [];
        return;
      }
    }
  } catch (e) { /* corrupt cache — fall through */ }

  try {
    const [modules, categories] = await Promise.all([
      API.modules().catch(() => null),
      API.categories().catch(() => null)
    ]);
    if (Array.isArray(modules) && modules.length > 0) {
      State.modulesCache = modules;
    } else if (!Array.isArray(State.modulesCache) || !State.modulesCache.length) {
      State.modulesCache = DEFAULT_MODULES;
    }
    if (Array.isArray(categories)) {
      State.allCategories = categories;
    }
    localStorage.setItem(REF_CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      modules: State.modulesCache,
      categories: State.allCategories || []
    }));
  } catch (e) {
    if (!Array.isArray(State.modulesCache) || !State.modulesCache.length) {
      State.modulesCache = DEFAULT_MODULES;
    }
  }
}

function invalidateReferenceCache() {
  localStorage.removeItem(REF_CACHE_KEY);
  API.cacheBust('modules', 'categories');
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const Router = (function () {

  let current = { route: 'dashboard', params: {} };

  function getRoute() { return current; }

  function titleFor(route, params) {
    if (route === 'module') {
      const mod = State.modulesCache.find(m => m.id === params.id);
      return mod ? I18n.localizedName(mod) : I18n.t('nav.modules');
    }
    const map = {
      dashboard: 'dashboard.title', notes: 'nav.allNotes', gaps: 'nav.knowledgeGaps', review: 'nav.reviewCenter',
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

    // PERF: Cancel active requests for previous route
    const options = { route };

    // Auto-close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    let activeSelector = `[data-route="${route}"]`;
    if (route === 'module') activeSelector = `[data-route="module"][data-module-id="${params.id}"]`;
    const activeEl = document.querySelector(activeSelector);
    if (activeEl) activeEl.classList.add('active');

    const content = document.getElementById('content');
    const titleEl = document.getElementById('page-title');
    titleEl.textContent = titleFor(route, params);

    if (route === 'dashboard') return Dashboard.render(content);
    if (route === 'notes') return Notes.renderAllNotesPage(content);
    if (route === 'module') return Modules.render(content, params.id);
    if (route === 'gaps') {
      content.innerHTML = UI.skeleton('table');
      try {
        const topics = await API.topics({}, options);
        const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
        Topics.renderTable(content, gaps, { showModule: true, emptyHint: I18n.t('empty.noOpenGaps') });
      } catch (err) {
        if (err.name !== 'AbortError') content.innerHTML = UI.errorState(err);
      }
      return;
    }
    if (route === 'review') return Reviews.renderCenter(content);
    if (route === 'analytics') return Analytics.render(content);
    if (route === 'profile') return Profile.render(content);
    if (route === 'admin') return Profile.renderAdmin(content);
    if (route === 'search') {
      titleEl.textContent = `${I18n.t('common.search')}: "${params.q}"`;
      content.innerHTML = UI.skeleton('table');
      try {
        const topics = await API.topics({ search: params.q }, options);
        Topics.renderTable(content, topics, { showModule: true, emptyHint: I18n.t('empty.tryDifferentSearch') });
      } catch (err) {
        if (err.name !== 'AbortError') content.innerHTML = UI.errorState(err);
      }
      return;
    }
    content.innerHTML = UI.emptyState(I18n.t('common.notFound'), I18n.t('common.notFoundHint'));
  }

  function init() {
    window.addEventListener('hashchange', () => { const h = decodeHash(); render(h.route, h.params); });
  }

  return { go, reload, init, render, decodeHash, getRoute };
})();

// ---------------------------------------------------------------------------
// App bootstrap
// ---------------------------------------------------------------------------
const App = (function () {

  // PERF: 0ms Sidebar render using available/default modules
  function buildSidebarModules() {
    const nav = document.getElementById('nav-modules');
    if (!nav) return;

    const modules = (Array.isArray(State.modulesCache) && State.modulesCache.length > 0)
      ? State.modulesCache
      : DEFAULT_MODULES;

    nav.innerHTML = modules.map(m => `
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
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      const isOpen = sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active', isOpen);
    });

    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      UI.applyTheme(next);
    });

    const globalSyncBtn = document.getElementById('global-sync-btn');
    if (globalSyncBtn) {
      globalSyncBtn.addEventListener('click', async () => {
        globalSyncBtn.disabled = true;
        globalSyncBtn.style.transform = 'rotate(360deg)';
        globalSyncBtn.style.transition = 'transform 0.5s ease';

        invalidateReferenceCache();
        API.cacheBustAll();

        UI.toast(I18n.getLang() === 'ar' ? 'جاري مزامنة الداتا بيز بالكامل...' : 'Syncing database...', 'info');

        try {
          await loadReferenceData();
          buildSidebarModules();
          Router.reload();
          UI.toast(I18n.getLang() === 'ar' ? 'تمت مزامنة الداتا بيز بنجاح' : 'Database synced successfully', 'success');
        } catch (err) {
          UI.toastError(err);
        } finally {
          globalSyncBtn.disabled = false;
          globalSyncBtn.style.transform = 'none';
        }
      });
    }

    const autoSyncBadge = document.getElementById('autosync-badge');
    if (autoSyncBadge) {
      autoSyncBadge.addEventListener('click', () => {
        if (typeof AutoSync !== 'undefined') AutoSync.syncNow();
      });
    }

    document.getElementById('quick-add-btn').addEventListener('click', () => {
      const defaultModuleId = State.modulesCache.length ? State.modulesCache[0].id : null;
      Topics.openAddModal(defaultModuleId, () => Router.reload());
    });

    // PERF: Debounced Global Search (300ms)
    const search = document.getElementById('global-search');
    if (search) {
      const debouncedSearch = UI.debounce((val) => {
        if (val.trim()) Router.go('search', { q: val.trim() });
      }, 300);

      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') debouncedSearch(search.value);
      });
    }
  }

  /**
   * PERF: Non-blocking App Boot Sequence
   * 1. Renders App Shell & Sidebar instantly in 0ms using available/default modules.
   * 2. Renders active route instantly with cached data.
   * 3. Triggers predictive background prefetch.
   * 4. Refreshes reference data silently in background.
   */
  async function boot() {
    Auth.showApp();
    if (State.currentUser && State.currentUser.language && State.currentUser.language !== I18n.getLang()) {
      I18n.setLang(State.currentUser.language);
    }

    // 0ms instant sidebar render
    buildSidebarModules();
    if (State.currentUser && State.currentUser.role === 'Admin') {
      document.getElementById('nav-admin').classList.remove('hidden');
    }

    const h = Router.decodeHash();
    Router.render(h.route, h.params);

    // Start background auto-sync engine
    if (typeof AutoSync !== 'undefined') AutoSync.start();

    // Trigger background reference data load & predictive prefetch
    loadReferenceData().then(() => {
      buildSidebarModules();
    }).catch(() => {});

    API.prefetchAll();
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

    Auth.init();
    bindStaticNav();
    bindLanguageSwitch();
    Router.init();

    const restored = await Auth.tryRestoreSession();
    if (restored) {
      await boot();
    }
  }

  return { init, boot };
})();

document.addEventListener('DOMContentLoaded', App.init);
