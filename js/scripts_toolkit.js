// Ensure a globally accessible Toast helper that connects with UI.toast
if (typeof window !== 'undefined') {
  window.Toast = window.Toast || {
    show: function(msg, type) {
      if (typeof UI !== 'undefined' && UI.toast) {
        UI.toast(msg, type || 'info');
      } else {
        console.log(`[Toast ${type || 'info'}]: ${msg}`);
      }
    }
  };
}

const ScriptsToolkit = (function () {
  let _scripts = [];
  let _filteredScripts = [];
  let _activeScript = null;
  let _activeTab = 'overview'; // 'overview' | 'schema' | 'code' | 'safety' | 'playbook' | 'notes' | 'quiz'
  let _viewMode = 'grid'; // 'grid' | 'list'
  let _favorites = new Set();
  let _recentlyUsed = [];
  let _userNotes = {};
  let _usageLogs = {};
  let _checklistState = {};
  let _searchQuery = '';
  let _filterModule = '';
  let _filterCategory = '';
  let _filterRisk = '';
  let _filterCompat = '';
  let _filterTable = '';
  let _onlyFavorites = false;

  // In-memory storage fallback when Tracking Prevention blocks localStorage
  const _memoryStore = {};

  function safeStorageGet(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      // Storage access blocked by browser tracking prevention
    }
    return _memoryStore[key] || null;
  }

  function safeStorageSet(key, val) {
    _memoryStore[key] = val;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {
      // Ignore security errors on blocked storage
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Local storage keys
  const LS_FAVORITES = 'erp_scripts_favorites';
  const LS_RECENT = 'erp_scripts_recent';
  const LS_NOTES = 'erp_scripts_notes';
  const LS_USAGE = 'erp_scripts_usage';
  const LS_CHECKLIST = 'erp_scripts_checklist';

  function init() {
    loadLocalState();
    loadScriptsData();
  }

  function loadLocalState() {
    try {
      const favs = safeStorageGet(LS_FAVORITES);
      if (favs) _favorites = new Set(JSON.parse(favs));
      const rec = safeStorageGet(LS_RECENT);
      if (rec) _recentlyUsed = JSON.parse(rec);
      const notes = safeStorageGet(LS_NOTES);
      if (notes) _userNotes = JSON.parse(notes);
      const usage = safeStorageGet(LS_USAGE);
      if (usage) _usageLogs = JSON.parse(usage);
      const chk = safeStorageGet(LS_CHECKLIST);
      if (chk) _checklistState = JSON.parse(chk);
    } catch (e) {
      // Fallback silently
    }
  }

  function saveLocalState() {
    try {
      safeStorageSet(LS_FAVORITES, JSON.stringify(Array.from(_favorites)));
      safeStorageSet(LS_RECENT, JSON.stringify(_recentlyUsed));
      safeStorageSet(LS_NOTES, JSON.stringify(_userNotes));
      safeStorageSet(LS_USAGE, JSON.stringify(_usageLogs));
      safeStorageSet(LS_CHECKLIST, JSON.stringify(_checklistState));
    } catch (e) {
      // Fallback silently
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(LS_FAVORITES, JSON.stringify(Array.from(_favorites)));
      localStorage.setItem(LS_RECENT, JSON.stringify(_recentlyUsed));
      localStorage.setItem(LS_NOTES, JSON.stringify(_userNotes));
      localStorage.setItem(LS_USAGE, JSON.stringify(_usageLogs));
      localStorage.setItem(LS_CHECKLIST, JSON.stringify(_checklistState));
    } catch (e) {
      console.warn('Could not save local script state:', e);
    }
  }

  async function loadScriptsData() {
    // 1. Start with base seed scripts
    let baseList = [];
    if (typeof SCRIPTS_BANK_DATA !== 'undefined' && Array.isArray(SCRIPTS_BANK_DATA)) {
      baseList = [...SCRIPTS_BANK_DATA];
    }

    // 2. Try fetching custom/imported scripts from backend API
    try {
      if (typeof API !== 'undefined' && API.getScripts) {
        const res = await API.getScripts();
        if (res && Array.isArray(res.scripts) && res.scripts.length > 0) {
          const existingIds = new Set(baseList.map(s => s.id));
          res.scripts.forEach(s => {
            if (!existingIds.has(s.id)) {
              baseList.push(s);
            }
          });
        }
      }
    } catch (err) {
      console.info('Backend scripts fetch fallback to seed library:', err);
    }

    // 3. Re-evaluate each script against Current Database Schema
    _scripts = baseList.map(s => {
      const analysis = ScriptEngine.analyzeScript(s.code);
      return {
        ...s,
        ...analysis,
        // Preserve defined titles/problems
        title_ar: s.title_ar || s.filename,
        title_en: s.title_en || s.filename,
        problem_ar: s.problem_ar || 'معالجة وتصحيح بيانات في النظام.',
        solution_ar: s.solution_ar || 'استعلام SQL لمعالجة الحالة.',
        modules: s.modules || ['MOD-1']
      };
    });

    applyFilters();
  }

  function applyFilters() {
    _filteredScripts = ScriptEngine.searchScripts(_scripts, _searchQuery, {
      module_id: _filterModule,
      category_id: _filterCategory,
      risk_level: _filterRisk,
      compatibility: _filterCompat,
      table_name: _filterTable,
      onlyFavorites: _onlyFavorites,
      favoriteIds: _favorites
    });
    renderMainView();
  }

  function render(container) {
    if (!container) return;
    init();

    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div class="scripts-toolkit-page animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Banner -->
        <div class="card" style="padding: 24px; background: linear-gradient(135deg, var(--paper) 0%, rgba(44, 122, 107, 0.05) 100%); border-inline-start: 4px solid var(--teal);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span style="font-size: 28px;">🛠️</span>
                <h1 style="font-size: 22px; font-weight: 700; margin: 0; color: var(--ink);">
                  ${isAr ? 'مكتبة السكربتات والحلول (Script Knowledge & Troubleshooting)' : 'ERP Script Knowledge & Troubleshooting Toolkit'}
                </h1>
                <span class="badge badge-teal" style="font-size: 11px; padding: 2px 8px;">
                  newdatabase2026.sql Verified
                </span>
              </div>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 0; max-width: 800px; line-height: 1.6;">
                ${isAr 
                  ? 'مستودع مركزي للسكربتات والاستعلامات التشخيصية والتصحيحية مع محرك فحص التوافق اللحظي مع قاعدة البيانات الحالية (406 جدول)، كشف المخاطر، وشرح الكود بالذكاء الاصطناعي.' 
                  : 'Centralized repository of diagnostic & corrective SQL scripts with real-time schema compatibility engine against Current Database (406 tables), risk analyzer, and AI safety review.'}
              </p>
            </div>

            <!-- Header Action Buttons -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-secondary" id="btn-open-schema-explorer" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px;">
                🗄️ ${isAr ? 'استعراض كائنات الدليل (406 جدول)' : 'Database Explorer (406 Tables)'}
              </button>
              <button class="btn btn-primary" id="btn-open-import-script" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px;">
                ➕ ${isAr ? 'استيراد سكربت جديد' : 'Import New Script'}
              </button>
            </div>
          </div>

          <!-- Stats Pill Bar -->
          <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
            <div style="padding: 8px 14px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: var(--teal); font-size: 15px;">${_scripts.length}</span>
              <span style="color: var(--ink-soft);">${isAr ? 'إجمالي السكربتات' : 'Total Scripts'}</span>
            </div>

            <div style="padding: 8px 14px; background: rgba(44, 122, 107, 0.08); border: 1px solid var(--teal); border-radius: var(--radius-sm); font-size: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: var(--teal); font-size: 15px;">
                ${_scripts.filter(s => s.database_compatibility === 'GREEN').length}
              </span>
              <span style="color: var(--teal); font-weight: 600;">🟢 ${isAr ? 'متوافق ومعتمد' : 'Verified Current'}</span>
            </div>

            <div style="padding: 8px 14px; background: rgba(200, 150, 60, 0.08); border: 1px solid var(--brass); border-radius: var(--radius-sm); font-size: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: var(--brass-deep); font-size: 15px;">
                ${_scripts.filter(s => s.database_compatibility === 'YELLOW').length}
              </span>
              <span style="color: var(--brass-deep); font-weight: 600;">🟡 ${isAr ? 'يحتاج مراجعة' : 'Needs Review'}</span>
            </div>

            <div style="padding: 8px 14px; background: rgba(192, 86, 62, 0.08); border: 1px solid var(--rust); border-radius: var(--radius-sm); font-size: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: var(--rust); font-size: 15px;">
                ${_scripts.filter(s => s.database_compatibility === 'RED').length}
              </span>
              <span style="color: var(--rust); font-weight: 600;">🔴 ${isAr ? 'غير متوافق (أرشيف قديم)' : 'Incompatible'}</span>
            </div>

            <div style="padding: 8px 14px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 12px; display: flex; align-items: center; gap: 8px; margin-inline-start: auto;">
              <span style="color: var(--ink-soft); font-size: 11px;">
                📌 <strong>Source of Truth:</strong> <code style="font-size: 11px; color: var(--teal);">newdatabase2026.sql</code>
              </span>
            </div>
          </div>
        </div>

        <!-- Problem-to-Solution Quick Matcher -->
        <div class="card" style="padding: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>🔍</span>
            <span>${isAr ? 'ابحث حسب المشكلة الشائعة (Problem → Solution Quick Match):' : 'Browse by Common Problem:'}</span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="quick-problem-buttons">
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="المخزون مش مطابق" style="font-size: 12px;">
              📦 ${isAr ? 'المخزون غير مطابق للحسابات' : 'Inventory vs GL Variance'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="رصيد المندوب" style="font-size: 12px;">
              👥 ${isAr ? 'فروقات رصيد المندوب وسند الصرف' : 'Sales Rep Vouchers'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="سعر الشراء" style="font-size: 12px;">
              💰 ${isAr ? 'تعديل تكلفة الشراء ومعامل التحويل' : 'Purchase Cost & UoM'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="الفواتير" style="font-size: 12px;">
              🧾 ${isAr ? 'فروقات إجمالي الفواتير والضريبة' : 'Invoice Totals & VAT'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="افتتاحي" style="font-size: 12px;">
              🏦 ${isAr ? 'توليد القيد الافتتاحي للأستاذ العام' : 'Opening Balances'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="TRUNCATE" style="font-size: 12px; color: var(--rust);">
              🧹 ${isAr ? 'تفريغ وتصفير بيانات الاختبار' : 'Truncate / Reset'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="vchart" style="font-size: 12px;">
              👁️ ${isAr ? 'ميزان المراجعة وشجرة الحسابات' : 'Trial Balance View'}
            </button>
            <button class="btn btn-secondary btn-sm quick-prob-btn" data-query="" style="font-size: 12px; font-weight: 700; color: var(--teal);">
              🔄 ${isAr ? 'عرض الكل' : 'View All'}
            </button>
          </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="card" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            
            <!-- Search Input -->
            <div style="flex: 1; min-width: 260px; position: relative;">
              <input 
                type="text" 
                id="scripts-search-input" 
                class="form-control" 
                placeholder="${isAr ? '🔍 ابحث في اسم السكربت، المشكلة، الكود، أسماء الجداول والأعمدة...' : '🔍 Search in script title, problem, SQL code, tables, columns...'}" 
                value="${escapeHtml(_searchQuery)}"
                style="padding-inline-start: 14px; font-size: 13px;"
              />
            </div>

            <!-- Filter: Module -->
            <div style="min-width: 140px;">
              <select id="scripts-filter-module" class="form-control" style="font-size: 13px;">
                <option value="">${isAr ? '📁 كل الموديولات' : 'All Modules'}</option>
                <option value="MOD-1" ${_filterModule === 'MOD-1' ? 'selected' : ''}>${isAr ? 'المخزون (Inventory)' : 'Inventory'}</option>
                <option value="MOD-2" ${_filterModule === 'MOD-2' ? 'selected' : ''}>${isAr ? 'الحسابات (Accounting)' : 'Accounting'}</option>
                <option value="MOD-6" ${_filterModule === 'MOD-6' ? 'selected' : ''}>${isAr ? 'الموارد البشرية (HR)' : 'HR'}</option>
              </select>
            </div>

            <!-- Filter: Risk Level -->
            <div style="min-width: 140px;">
              <select id="scripts-filter-risk" class="form-control" style="font-size: 13px;">
                <option value="">${isAr ? '⚡ كل مستويات الخطورة' : 'All Risk Levels'}</option>
                <option value="LOW" ${_filterRisk === 'LOW' ? 'selected' : ''}>🟢 ${isAr ? 'آمن (Low Risk)' : 'Low Risk'}</option>
                <option value="MEDIUM" ${_filterRisk === 'MEDIUM' ? 'selected' : ''}>🟡 ${isAr ? 'متوسط (Medium)' : 'Medium Risk'}</option>
                <option value="HIGH" ${_filterRisk === 'HIGH' ? 'selected' : ''}>🟠 ${isAr ? 'عالي (High Risk)' : 'High Risk'}</option>
                <option value="CRITICAL" ${_filterRisk === 'CRITICAL' ? 'selected' : ''}>🔴 ${isAr ? 'حرج (Critical)' : 'Critical'}</option>
              </select>
            </div>

            <!-- Filter: Compatibility -->
            <div style="min-width: 160px;">
              <select id="scripts-filter-compat" class="form-control" style="font-size: 13px;">
                <option value="">${isAr ? '🛡️ كل حالات التوافق' : 'All Compatibility'}</option>
                <option value="GREEN" ${_filterCompat === 'GREEN' ? 'selected' : ''}>🟢 ${isAr ? 'متوافق ومعتمد' : 'Verified Current'}</option>
                <option value="YELLOW" ${_filterCompat === 'YELLOW' ? 'selected' : ''}>🟡 ${isAr ? 'يحتاج مراجعة' : 'Needs Review'}</option>
                <option value="RED" ${_filterCompat === 'RED' ? 'selected' : ''}>🔴 ${isAr ? 'غير متوافق (قديم)' : 'Incompatible'}</option>
              </select>
            </div>

            <!-- Filter: Favorites Toggle -->
            <button 
              class="btn ${ _onlyFavorites ? 'btn-primary' : 'btn-secondary' }" 
              id="btn-filter-favorites" 
              style="font-size: 13px; display: inline-flex; align-items: center; gap: 4px;"
            >
              ⭐ ${isAr ? 'المفضلة' : 'Favorites'} (${_favorites.size})
            </button>

            <!-- View Mode Switcher -->
            <div style="display: flex; border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
              <button 
                class="btn btn-sm ${ _viewMode === 'grid' ? 'btn-primary' : 'btn-secondary' }" 
                id="btn-view-grid" 
                style="border-radius: 0; padding: 6px 10px;"
                title="${isAr ? 'عرض شبكي' : 'Grid View'}"
              >⊞</button>
              <button 
                class="btn btn-sm ${ _viewMode === 'list' ? 'btn-primary' : 'btn-secondary' }" 
                id="btn-view-list" 
                style="border-radius: 0; padding: 6px 10px;"
                title="${isAr ? 'عرض قائمة' : 'List View'}"
              >☰</button>
            </div>
          </div>
        </div>

        <!-- Main Scripts List / Grid -->
        <div id="scripts-list-container">
          <!-- Rendered dynamically -->
        </div>

      </div>

      <!-- Workbench Modal Placeholder -->
      <div id="script-workbench-modal" class="modal-backdrop" style="display: none;"></div>

      <!-- Database Explorer Modal Placeholder -->
      <div id="database-explorer-modal" class="modal-backdrop" style="display: none;"></div>

      <!-- Import Script Modal Placeholder -->
      <div id="script-import-modal" class="modal-backdrop" style="display: none;"></div>
    `;

    bindEvents(container);
    renderMainView();
  }

  function bindEvents(container) {
    const isAr = I18n.getLang() === 'ar';

    // Search input debounced
    const searchInput = container.querySelector('#scripts-search-input');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          _searchQuery = e.target.value;
          applyFilters();
        }, 200);
      });
    }

    // Quick problem buttons
    container.querySelectorAll('.quick-prob-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _searchQuery = btn.getAttribute('data-query');
        if (searchInput) searchInput.value = _searchQuery;
        applyFilters();
      });
    });

    // Filters
    const modFilter = container.querySelector('#scripts-filter-module');
    if (modFilter) modFilter.addEventListener('change', (e) => { _filterModule = e.target.value; applyFilters(); });

    const riskFilter = container.querySelector('#scripts-filter-risk');
    if (riskFilter) riskFilter.addEventListener('change', (e) => { _filterRisk = e.target.value; applyFilters(); });

    const compatFilter = container.querySelector('#scripts-filter-compat');
    if (compatFilter) compatFilter.addEventListener('change', (e) => { _filterCompat = e.target.value; applyFilters(); });

    const favFilterBtn = container.querySelector('#btn-filter-favorites');
    if (favFilterBtn) {
      favFilterBtn.addEventListener('click', () => {
        _onlyFavorites = !_onlyFavorites;
        favFilterBtn.className = `btn ${_onlyFavorites ? 'btn-primary' : 'btn-secondary'}`;
        applyFilters();
      });
    }

    // View switcher
    const btnGrid = container.querySelector('#btn-view-grid');
    const btnList = container.querySelector('#btn-view-list');
    if (btnGrid && btnList) {
      btnGrid.addEventListener('click', () => { _viewMode = 'grid'; applyFilters(); });
      btnList.addEventListener('click', () => { _viewMode = 'list'; applyFilters(); });
    }

    // Header buttons
    const btnSchema = container.querySelector('#btn-open-schema-explorer');
    if (btnSchema) btnSchema.addEventListener('click', () => openDatabaseExplorer());

    const btnImport = container.querySelector('#btn-open-import-script');
    if (btnImport) btnImport.addEventListener('click', () => openImportModal());
  }

  function renderMainView() {
    const listContainer = document.getElementById('scripts-list-container');
    if (!listContainer) return;

    const isAr = I18n.getLang() === 'ar';

    if (_filteredScripts.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="padding: 40px; text-align: center;">
          <span style="font-size: 36px; display: block; margin-bottom: 10px;">🔍</span>
          <h3 style="font-size: 16px; color: var(--ink); margin: 0 0 6px 0;">
            ${isAr ? 'لم يتم العثور على سكربتات مطابقة' : 'No matching scripts found'}
          </h3>
          <p style="font-size: 13px; color: var(--ink-soft); margin: 0 0 16px 0;">
            ${isAr ? 'جرب البحث بكلمات مختلفة أو تفريغ الفلاتر الحالية.' : 'Try adjusting your search criteria or clearing active filters.'}
          </p>
          <button class="btn btn-secondary btn-sm" onclick="ScriptsToolkit.clearFilters()">
            🔄 ${isAr ? 'تفريغ الفلاتر وعرض الكل' : 'Clear Filters'}
          </button>
        </div>
      `;
      return;
    }

    if (_viewMode === 'grid') {
      listContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;">
          ${_filteredScripts.map(script => renderScriptCard(script, isAr)).join('')}
        </div>
      `;
    } else {
      listContainer.innerHTML = `
        <div class="card" style="padding: 0; overflow: hidden;">
          <div style="display: flex; flex-direction: column; divide-y: 1px solid var(--line);">
            ${_filteredScripts.map(script => renderScriptListItem(script, isAr)).join('')}
          </div>
        </div>
      `;
    }

    // Bind card actions
    listContainer.querySelectorAll('.btn-open-script').forEach(btn => {
      btn.addEventListener('click', () => {
        const scriptId = btn.getAttribute('data-id');
        const script = _scripts.find(s => s.id === scriptId);
        if (script) openScriptWorkbench(script);
      });
    });

    listContainer.querySelectorAll('.btn-copy-code-fast').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const scriptId = btn.getAttribute('data-id');
        const script = _scripts.find(s => s.id === scriptId);
        if (script && script.code) {
          copyPureCode(script.code);
        }
      });
    });

    listContainer.querySelectorAll('.btn-toggle-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const scriptId = btn.getAttribute('data-id');
        toggleFavorite(scriptId);
      });
    });
  }

  function renderScriptCard(s, isAr) {
    const riskMeta = ScriptEngine.RISK_LEVELS[s.risk_level] || ScriptEngine.RISK_LEVELS.LOW;
    const compatMeta = ScriptEngine.STATUS_LEVELS[s.database_compatibility] || ScriptEngine.STATUS_LEVELS.GREEN;
    const isFav = _favorites.has(s.id);
    const title = isAr ? s.title_ar : (s.title_en || s.title_ar);
    const problem = isAr ? s.problem_ar : (s.problem_en || s.problem_ar);

    return `
      <div class="card script-card hover-lift" style="padding: 16px; display: flex; flex-direction: column; justify-content: space-between; border-inline-start: 4px solid ${compatMeta.color}; transition: all 0.2s ease;">
        <div>
          <!-- Card Header Badges -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
              <span class="badge ${riskMeta.badge}" style="font-size: 10px; padding: 2px 6px;">
                ${isAr ? riskMeta.label_ar : riskMeta.label_en}
              </span>
              <span class="badge ${compatMeta.badge}" style="font-size: 10px; padding: 2px 6px;">
                ${isAr ? compatMeta.label_ar : compatMeta.label_en}
              </span>
            </div>

            <!-- Favorite button -->
            <button class="btn-icon btn-toggle-fav" data-id="${escapeHtml(s.id)}" title="${isFav ? 'Remove Favorite' : 'Add Favorite'}" style="background: none; border: none; cursor: pointer; font-size: 16px; padding: 0;">
              ${isFav ? '⭐' : '☆'}
            </button>
          </div>

          <!-- Script Title -->
          <h4 style="font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px 0; line-height: 1.4;">
            ${escapeHtml(title)}
          </h4>

          <!-- Filename & Code Type -->
          <div style="font-size: 11px; color: var(--ink-soft); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; font-family: monospace;">
            <span>📄 ${escapeHtml(s.filename)}</span>
            <span>•</span>
            <span style="text-transform: uppercase;">${escapeHtml(s.code_type || 'SQL')}</span>
            <span>•</span>
            <span>${s.line_count || s.code.split('\n').length} ${isAr ? 'سطر' : 'lines'}</span>
          </div>

          <!-- Problem Summary -->
          <p style="font-size: 12px; color: var(--ink); margin: 0 0 12px 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml(problem)}
          </p>

          <!-- Affected Tables Pills -->
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px;">
            ${(s.tables || []).slice(0, 4).map(tbl => {
              const isMissing = (s.missing_tables || []).includes(tbl);
              return `
                <span style="font-size: 10px; padding: 2px 6px; border-radius: 3px; font-family: monospace; background: ${isMissing ? 'rgba(192,86,62,0.1)' : 'var(--paper)'}; color: ${isMissing ? 'var(--rust)' : 'var(--ink)'}; border: 1px solid ${isMissing ? 'var(--rust)' : 'var(--line)'};">
                  ${isMissing ? '❌ ' : '✓ '}${escapeHtml(tbl)}
                </span>
              `;
            }).join('')}
            ${(s.tables && s.tables.length > 4) ? `<span style="font-size: 10px; color: var(--ink-soft); align-self: center;">+${s.tables.length - 4} ${isAr ? 'جداول أخرى' : 'more'}</span>` : ''}
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; pt: 10px; border-top: 1px solid var(--line); margin-top: 10px; padding-top: 10px;">
          <span style="font-size: 11px; color: var(--ink-soft);">
            🏷️ ${escapeHtml(s.category_name_ar || s.category_id || '')}
          </span>

          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm btn-copy-code-fast" data-id="${escapeHtml(s.id)}" title="${isAr ? 'نسخ الكود فقط' : 'Copy Code Only'}" style="font-size: 12px; padding: 4px 8px;">
              📋 ${isAr ? 'نسخ' : 'Copy'}
            </button>
            <button class="btn btn-primary btn-sm btn-open-script" data-id="${escapeHtml(s.id)}" style="font-size: 12px; padding: 4px 10px;">
              👁️ ${isAr ? 'فحص السكربت' : 'Workbench'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderScriptListItem(s, isAr) {
    const riskMeta = ScriptEngine.RISK_LEVELS[s.risk_level] || ScriptEngine.RISK_LEVELS.LOW;
    const compatMeta = ScriptEngine.STATUS_LEVELS[s.database_compatibility] || ScriptEngine.STATUS_LEVELS.GREEN;
    const isFav = _favorites.has(s.id);
    const title = isAr ? s.title_ar : (s.title_en || s.title_ar);

    return `
      <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--line); hover: background: var(--paper);">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <button class="btn-icon btn-toggle-fav" data-id="${escapeHtml(s.id)}" style="background: none; border: none; cursor: pointer; font-size: 16px;">
            ${isFav ? '⭐' : '☆'}
          </button>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
              <strong style="font-size: 13px; color: var(--ink);">${escapeHtml(title)}</strong>
              <span class="badge ${riskMeta.badge}" style="font-size: 9px; padding: 1px 5px;">${isAr ? riskMeta.label_ar : riskMeta.label_en}</span>
              <span class="badge ${compatMeta.badge}" style="font-size: 9px; padding: 1px 5px;">${isAr ? compatMeta.label_ar : compatMeta.label_en}</span>
            </div>
            <div style="font-size: 11px; color: var(--ink-soft); font-family: monospace;">
              ${escapeHtml(s.filename)} • ${(s.tables || []).join(', ')}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm btn-copy-code-fast" data-id="${escapeHtml(s.id)}" style="font-size: 11px; padding: 3px 8px;">
            📋 ${isAr ? 'نسخ' : 'Copy'}
          </button>
          <button class="btn btn-primary btn-sm btn-open-script" data-id="${escapeHtml(s.id)}" style="font-size: 11px; padding: 3px 10px;">
            👁️ ${isAr ? 'فحص' : 'Open'}
          </button>
        </div>
      </div>
    `;
  }

  function openScriptWorkbench(script) {
    _activeScript = script;
    _activeTab = 'overview';

    // Record in recently used
    _recentlyUsed = _recentlyUsed.filter(id => id !== script.id);
    _recentlyUsed.unshift(script.id);
    if (_recentlyUsed.length > 20) _recentlyUsed.pop();
    saveLocalState();

    const modal = document.getElementById('script-workbench-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    renderWorkbenchContent();
  }

  function closeScriptWorkbench() {
    const modal = document.getElementById('script-workbench-modal');
    if (modal) modal.style.display = 'none';
    _activeScript = null;
  }

  function renderWorkbenchContent() {
    const modal = document.getElementById('script-workbench-modal');
    if (!modal || !_activeScript) return;

    const s = _activeScript;
    const isAr = I18n.getLang() === 'ar';
    const riskMeta = ScriptEngine.RISK_LEVELS[s.risk_level] || ScriptEngine.RISK_LEVELS.LOW;
    const compatMeta = ScriptEngine.STATUS_LEVELS[s.database_compatibility] || ScriptEngine.STATUS_LEVELS.GREEN;
    const isFav = _favorites.has(s.id);
    const title = isAr ? s.title_ar : (s.title_en || s.title_ar);

    modal.innerHTML = `
      <div class="modal-dialog animate-scale-in" style="max-width: 960px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; background: var(--surface); border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
        
        <!-- Workbench Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--paper);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">🛠️</span>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">${escapeHtml(title)}</h3>
                <button class="btn-icon" id="wb-toggle-fav" style="background: none; border: none; cursor: pointer; font-size: 16px;">
                  ${isFav ? '⭐' : '☆'}
                </button>
              </div>
              <div style="font-size: 11px; color: var(--ink-soft); font-family: monospace; margin-top: 2px;">
                📄 ${escapeHtml(s.filename)} • <span class="badge ${riskMeta.badge}" style="font-size: 10px;">${isAr ? riskMeta.label_ar : riskMeta.label_en}</span> • <span class="badge ${compatMeta.badge}" style="font-size: 10px;">${isAr ? compatMeta.label_ar : compatMeta.label_en}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="wb-btn-copy-code" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
              📋 ${isAr ? 'نسخ الكود الصافي' : 'Copy Pure SQL'}
            </button>
            <button class="btn btn-secondary btn-sm" id="wb-btn-download" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
              💾 ${isAr ? 'تحميل' : 'Download'}
            </button>
            <button class="btn-icon" id="wb-btn-close" style="font-size: 18px; border: none; background: none; cursor: pointer; padding: 4px 8px; color: var(--ink-soft);">
              ✕
            </button>
          </div>
        </div>

        <!-- Workbench Tabs Header -->
        <div style="display: flex; border-bottom: 1px solid var(--line); background: var(--surface); overflow-x: auto; padding: 0 16px;">
          <button class="tab-btn ${ _activeTab === 'overview' ? 'active' : '' }" data-tab="overview" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'overview' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'overview' ? 'var(--teal)' : 'var(--ink-soft)'};">
            📖 ${isAr ? 'نظرة عامة والمشكلة' : 'Overview & Problem'}
          </button>
          <button class="tab-btn ${ _activeTab === 'schema' ? 'active' : '' }" data-tab="schema" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'schema' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'schema' ? 'var(--teal)' : 'var(--ink-soft)'};">
            🗄️ ${isAr ? 'فحص التوافق والجداول' : 'Schema & Compatibility'}
          </button>
          <button class="tab-btn ${ _activeTab === 'code' ? 'active' : '' }" data-tab="code" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'code' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'code' ? 'var(--teal)' : 'var(--ink-soft)'};">
            💻 ${isAr ? 'مستعرض الكود' : 'Code Viewer'}
          </button>
          <button class="tab-btn ${ _activeTab === 'safety' ? 'active' : '' }" data-tab="safety" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'safety' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'safety' ? 'var(--teal)' : 'var(--ink-soft)'};">
            🛡️ ${isAr ? 'الأمان وتحليل الـ AI' : 'Safety & AI Review'}
          </button>
          <button class="tab-btn ${ _activeTab === 'playbook' ? 'active' : '' }" data-tab="playbook" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'playbook' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'playbook' ? 'var(--teal)' : 'var(--ink-soft)'};">
            🧰 ${isAr ? 'دليل التطبيق وقائمة التحقق' : 'Playbook & Checklist'}
          </button>
          <button class="tab-btn ${ _activeTab === 'notes' ? 'active' : '' }" data-tab="notes" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'notes' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'notes' ? 'var(--teal)' : 'var(--ink-soft)'};">
            📝 ${isAr ? 'ملاحظاتي وتجربة الاستخدام' : 'My Notes & Logs'}
          </button>
          <button class="tab-btn ${ _activeTab === 'quiz' ? 'active' : '' }" data-tab="quiz" style="padding: 10px 14px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'quiz' ? 'var(--teal)' : 'transparent'}; color: ${_activeTab === 'quiz' ? 'var(--teal)' : 'var(--ink-soft)'};">
            🎓 ${isAr ? 'تحدي التعلم والـ Quiz' : 'Learn & Quiz'}
          </button>
        </div>

        <!-- Workbench Body Content -->
        <div style="padding: 20px; overflow-y: auto; flex: 1;" id="wb-tab-content">
          ${renderActiveTabContent(s, isAr)}
        </div>

        <!-- Workbench Footer Safety Notice -->
        <div style="padding: 10px 20px; background: var(--paper); border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--ink-soft);">
          <div>
            🔒 <strong>Execution Safety:</strong> ${isAr ? 'التنفيذ الآلي محظور داخل النظام للأمان. انسخ الكود وطبقه خارجياً بعد أخذ نسخة احتياطية.' : 'Direct execution is disabled for safety. Copy code and run externally after full backup.'}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="wb-btn-report-script" style="font-size: 11px; padding: 2px 6px;">
              🚩 ${isAr ? 'إبلاغ عن السكربت' : 'Report'}
            </button>
          </div>
        </div>

      </div>
    `;

    bindWorkbenchEvents(modal);
  }

  function renderActiveTabContent(s, isAr) {
    if (_activeTab === 'overview') {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Problem Box -->
          <div style="padding: 14px; background: rgba(192, 86, 62, 0.05); border: 1px solid rgba(192, 86, 62, 0.2); border-radius: var(--radius-sm); border-inline-start: 4px solid var(--rust);">
            <strong style="color: var(--rust); font-size: 13px; display: block; margin-bottom: 6px;">
              ❓ ${isAr ? 'المشكلة والدافع التشغيلي (The Problem):' : 'The Problem & Context:'}
            </strong>
            <p style="font-size: 13px; color: var(--ink); margin: 0; line-height: 1.6;">
              ${escapeHtml(isAr ? s.problem_ar : (s.problem_en || s.problem_ar))}
            </p>
          </div>

          <!-- Solution Box -->
          <div style="padding: 14px; background: rgba(44, 122, 107, 0.05); border: 1px solid rgba(44, 122, 107, 0.2); border-radius: var(--radius-sm); border-inline-start: 4px solid var(--teal);">
            <strong style="color: var(--teal); font-size: 13px; display: block; margin-bottom: 6px;">
              💡 ${isAr ? 'الحل والمعالجة المحاسبية والتقنية (The Solution):' : 'The Solution & Treatment:'}
            </strong>
            <p style="font-size: 13px; color: var(--ink); margin: 0; line-height: 1.6;">
              ${escapeHtml(isAr ? s.solution_ar : (s.solution_en || s.solution_ar))}
            </p>
          </div>

          <!-- Meta Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 6px;">
            <div style="padding: 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
              <span style="font-size: 11px; color: var(--ink-soft); display: block;">${isAr ? 'الموديولات المرتبطة' : 'Linked Modules'}</span>
              <strong style="font-size: 13px; color: var(--ink);">${(s.modules || []).join(', ')}</strong>
            </div>

            <div style="padding: 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
              <span style="font-size: 11px; color: var(--ink-soft); display: block;">${isAr ? 'التصنيف' : 'Category'}</span>
              <strong style="font-size: 13px; color: var(--ink);">${escapeHtml(s.category_name_ar || s.category_id || '')}</strong>
            </div>

            <div style="padding: 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
              <span style="font-size: 11px; color: var(--ink-soft); display: block;">${isAr ? 'مستوى الصعوبة' : 'Difficulty'}</span>
              <strong style="font-size: 13px; color: var(--ink);">${escapeHtml(s.difficulty || 'Intermediate')}</strong>
            </div>

            <div style="padding: 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
              <span style="font-size: 11px; color: var(--ink-soft); display: block;">${isAr ? 'النسخة الاحتياطية قبل التنفيذ' : 'Backup Requirement'}</span>
              <strong style="font-size: 13px; color: ${s.backup_required ? 'var(--rust)' : 'var(--teal)'};">
                ${s.backup_required ? (isAr ? '⚠️ إجبارية قبل أي تعديل' : 'Mandatory') : (isAr ? '✅ غير مطلوبة (قراءة فقط)' : 'Optional (Read-only)')}
              </strong>
            </div>
          </div>

          <!-- Rollback Notes -->
          <div style="padding: 12px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
            <strong style="font-size: 12px; color: var(--ink); display: block; margin-bottom: 4px;">
              🔄 ${isAr ? 'إجراءات التراجع والاستعادة (Rollback Notes):' : 'Rollback Procedure:'}
            </strong>
            <p style="font-size: 12px; color: var(--ink-soft); margin: 0; line-height: 1.5;">
              ${escapeHtml(isAr ? (s.rollback_notes_ar || 'لا يوجد إجراء تراجع موثق. يجب استعادة النسخة الاحتياطية.') : (s.rollback_notes_en || 'Rollback procedure not documented.'))}
            </p>
          </div>

        </div>
      `;
    }

    if (_activeTab === 'schema') {
      const missing = s.missing_tables || [];
      const existing = s.existing_tables || [];
      const schema = ScriptEngine.getCurrentSchema();

      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Schema Verdict Banner -->
          <div style="padding: 14px; background: ${s.database_compatibility === 'GREEN' ? 'rgba(44,122,107,0.08)' : (s.database_compatibility === 'YELLOW' ? 'rgba(200,150,60,0.08)' : 'rgba(192,86,62,0.08)')}; border: 1px solid ${s.database_compatibility === 'GREEN' ? 'var(--teal)' : (s.database_compatibility === 'YELLOW' ? 'var(--brass)' : 'var(--rust)')}; border-radius: var(--radius-sm);">
            <strong style="font-size: 14px; display: block; margin-bottom: 4px; color: ${s.database_compatibility === 'GREEN' ? 'var(--teal)' : (s.database_compatibility === 'YELLOW' ? 'var(--brass-deep)' : 'var(--rust)')};">
              🛡️ ${isAr ? 'نتيجة الفحص ضد newdatabase2026.sql:' : 'Schema Compatibility Verdict:'}
            </strong>
            <p style="font-size: 13px; color: var(--ink); margin: 0; line-height: 1.5;">
              ${escapeHtml(isAr ? s.compatibility_reason_ar : s.compatibility_reason_en)}
            </p>
          </div>

          <!-- Existing Tables in Current DB -->
          <div>
            <h4 style="font-size: 13px; font-weight: 700; color: var(--teal); margin: 0 0 8px 0;">
              🟢 ${isAr ? 'الجداول المتوفرة في قاعدة البيانات الحالية (406 جدول):' : 'Matched Tables in Current Database (newdatabase2026.sql):'}
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${existing.length > 0 ? existing.map(tblName => {
                const tblObj = schema && schema.tables ? schema.tables[tblName] : null;
                const colCount = tblObj ? Object.keys(tblObj.columns || {}).length : 0;
                const pk = tblObj && tblObj.primaryKey ? tblObj.primaryKey.join(', ') : 'None';
                return `
                  <div style="padding: 10px 14px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong style="font-family: monospace; color: var(--ink); font-size: 13px;">${escapeHtml(tblName)}</strong>
                      <span style="font-size: 11px; color: var(--ink-soft); margin-inline-start: 8px;">PK: <code>${escapeHtml(pk)}</code></span>
                    </div>
                    <span class="badge badge-teal" style="font-size: 11px;">${colCount} ${isAr ? 'عمود' : 'columns'}</span>
                  </div>
                `;
              }).join('') : `<p style="font-size: 12px; color: var(--ink-soft);">${isAr ? 'لا توجد جداول' : 'None'}</p>`}
            </div>
          </div>

          <!-- Missing Tables -->
          ${missing.length > 0 ? `
            <div>
              <h4 style="font-size: 13px; font-weight: 700; color: var(--rust); margin: 0 0 8px 0;">
                🔴 ${isAr ? 'الجداول المفقودة في الهيكل الحالي (أرشيف أو جداول مجزأة):' : 'Missing Tables in Current Schema:'}
              </h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${missing.map(tblName => `
                  <div style="padding: 10px 14px; background: rgba(192,86,62,0.06); border-radius: var(--radius-sm); border: 1px solid var(--rust); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong style="font-family: monospace; color: var(--rust); font-size: 13px;">${escapeHtml(tblName)}</strong>
                      <span style="font-size: 11px; color: var(--rust); margin-inline-start: 8px;">
                        ⚠️ ${isAr ? 'غير موجود في newdatabase2026.sql' : 'Not found in newdatabase2026.sql'}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      `;
    }

    if (_activeTab === 'code') {
      const codeLines = (s.code || '').split('\n');
      return `
        <div style="display: flex; gap: 16px; height: 500px;">
          
          <!-- Sections Navigator Sidebar -->
          ${(s.sections && s.sections.length > 1) ? `
            <div style="width: 200px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--paper); padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
              <strong style="font-size: 11px; color: var(--ink-soft); display: block; margin-bottom: 4px; padding: 4px;">
                📑 ${isAr ? 'أقسام السكربت' : 'Sections'}
              </strong>
              ${s.sections.map((sec, idx) => `
                <button class="btn btn-secondary btn-sm" onclick="ScriptsToolkit.scrollToLine(${sec.startLine})" style="text-align: start; font-size: 11px; padding: 6px 8px; justify-content: flex-start; white-space: normal; line-height: 1.3;">
                  <strong>#${idx + 1}</strong>: ${escapeHtml(sec.title)}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Code View Area -->
          <div style="flex: 1; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden; background: #1e1e1e; color: #d4d4d4;">
            
            <!-- Code Bar -->
            <div style="padding: 6px 12px; background: #2d2d2d; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #9cdcfe;">
              <span>SQL • UTF-8 • ${codeLines.length} lines</span>
              <button class="btn btn-sm btn-secondary" onclick="ScriptsToolkit.copyPureCode()" style="font-size: 11px; padding: 2px 8px; background: #3d3d3d; color: #fff; border: 1px solid #555;">
                📋 ${isAr ? 'نسخ الكود' : 'Copy Code'}
              </button>
            </div>

            <!-- Code Content with Line Numbers -->
            <div style="flex: 1; overflow: auto; padding: 12px; font-family: Consolas, Monaco, monospace; font-size: 13px; line-height: 1.6;" id="sql-code-editor-view">
              <pre style="margin: 0; padding: 0; white-space: pre-wrap; word-break: break-word;"><code id="raw-sql-code-block">${escapeHtml(s.code)}</code></pre>
            </div>

          </div>
        </div>
      `;
    }

    if (_activeTab === 'safety') {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Static Risk Factors -->
          <div class="card" style="padding: 14px; border-inline-start: 4px solid var(--brass);">
            <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 8px;">
              ⚡ ${isAr ? 'عوامل الخطورة المكتشفة تلقائياً (Static Risk Analysis):' : 'Detected Risk Factors:'}
            </strong>
            <ul style="margin: 0; padding-inline-start: 20px; font-size: 13px; color: var(--ink); line-height: 1.6;">
              ${(s.risk_factors_ar || []).map(rf => `<li>${escapeHtml(isAr ? rf : rf)}</li>`).join('')}
            </ul>
          </div>

          <!-- AI Action Buttons -->
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-run-ai-explain" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px;">
              🧠 ${isAr ? 'شرح الكود تفصيلياً بالذكاء الاصطناعي' : 'Explain Script with AI'}
            </button>
            <button class="btn btn-secondary" id="btn-run-ai-safety" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px;">
              🛡️ ${isAr ? 'مراجعة الأمان والحماية بالـ AI' : 'Run AI Safety Review'}
            </button>
          </div>

          <!-- AI Response Output Container -->
          <div id="ai-response-box" style="display: none; padding: 16px; background: var(--paper); border: 1px solid var(--teal); border-radius: var(--radius-sm); font-size: 13px; line-height: 1.6; color: var(--ink);">
            <div id="ai-response-content"></div>
          </div>

        </div>
      `;
    }

    if (_activeTab === 'playbook') {
      const steps = s.playbook_steps_ar || [
        'أخذ نسخة احتياطية كاملة من قاعدة البيانات.',
        'مطابقة أسماء الجداول والأعمدة في السكربت مع newdatabase2026.sql.',
        'تحديد معرفات الفرع والشركة والفترة المحاسبية بدقة.',
        'تنفيذ السكربت عبر بيئة خارجية آمنة.',
        'التحقق من صحة النتائج وميزان المراجعة.'
      ];

      const scriptChecklist = _checklistState[s.id] || {};

      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Playbook Steps -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
              🧰 ${isAr ? 'خطة ودليل التنفيذ خطوة بخطوة (Step-by-Step Playbook):' : 'Step-by-Step Playbook:'}
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${steps.map((step, idx) => `
                <div style="padding: 10px 14px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; align-items: flex-start; gap: 10px;">
                  <span style="font-weight: 700; color: var(--teal); font-size: 14px; min-width: 24px;">${idx + 1}.</span>
                  <span style="font-size: 13px; color: var(--ink); line-height: 1.5;">${escapeHtml(step)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Interactive Verification Checklist -->
          <div class="card" style="padding: 16px; background: rgba(44, 122, 107, 0.03);">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--teal); margin: 0 0 12px 0;">
              ☑️ ${isAr ? 'قائمة التحقق قبل التطبيق (Pre-Execution Verification Checklist):' : 'Pre-Execution Checklist:'}
            </h4>
            
            <div style="display: flex; flex-direction: column; gap: 10px;" id="script-checklist-container">
              ${[
                { key: 'backup', ar: 'تم أخذ نسخة احتياطية كاملة من قاعدة البيانات بنجاح', en: 'Full database backup completed successfully' },
                { key: 'company', ar: 'التحقق من صحة رقم الشركة والفرع في شروط الاستعلام', en: 'Company ID & Branch ID parameters verified' },
                { key: 'date', ar: 'التحقق من النطاق الزمني والسنة المالية المستهدفة', en: 'Date range & fiscal year verified' },
                { key: 'gl', ar: 'التحقق من الأثر المالي على قيود اليومية والأستاذ العام GL', en: 'Accounting & GL impact assessed' },
                { key: 'rollback', ar: 'جاهزية خطة التراجع في حال حدوث أي خطأ غير متوقع', en: 'Rollback procedure ready in case of failure' }
              ].map(item => `
                <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink); cursor: pointer;">
                  <input type="checkbox" class="chk-step" data-key="${item.key}" ${scriptChecklist[item.key] ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--teal);" />
                  <span>${isAr ? item.ar : item.en}</span>
                </label>
              `).join('')}
            </div>
          </div>

        </div>
      `;
    }

    if (_activeTab === 'notes') {
      const currentNote = _userNotes[s.id] || { text: '', conditions: '' };
      const currentUsage = _usageLogs[s.id] || [];

      return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Personal Notes Box -->
          <div class="card" style="padding: 16px;">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--ink); margin: 0 0 8px 0;">
              📝 ${isAr ? 'ملاحظاتي الخاصة حول هذا السكربت (Personal Notes):' : 'My Notes on this Script:'}
            </h4>
            <textarea id="script-note-text" class="form-control" rows="4" placeholder="${isAr ? 'سجل ملاحظاتك، الحالات الاستثنائية، أو شروط الاستخدام هنا...' : 'Write your notes or special execution instructions...'}" style="font-size: 13px; line-height: 1.5; margin-bottom: 10px;">${escapeHtml(currentNote.text || '')}</textarea>
            <button class="btn btn-primary btn-sm" id="btn-save-note" style="align-self: flex-start;">
              💾 ${isAr ? 'حفظ الملاحظة' : 'Save Note'}
            </button>
          </div>

          <!-- Log Usage Result -->
          <div class="card" style="padding: 16px;">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--ink); margin: 0 0 8px 0;">
              🧪 ${isAr ? 'تسجيل نتيجة تطبيق السكربت (Did it Work?):' : 'Log Execution Result:'}
            </h4>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button class="btn btn-secondary btn-sm btn-log-outcome" data-outcome="worked" style="color: var(--teal); font-weight: 600;">
                ✅ ${isAr ? 'نجح تماماً (Worked)' : 'Worked'}
              </button>
              <button class="btn btn-secondary btn-sm btn-log-outcome" data-outcome="partially" style="color: var(--brass-deep); font-weight: 600;">
                ⚠️ ${isAr ? 'نجح جزئياً (Partially)' : 'Partially Worked'}
              </button>
              <button class="btn btn-secondary btn-sm btn-log-outcome" data-outcome="failed" style="color: var(--rust); font-weight: 600;">
                ❌ ${isAr ? 'فشل أو حدث خطأ (Failed)' : 'Failed'}
              </button>
            </div>

            <!-- Historical Usage List -->
            ${currentUsage.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                <strong style="font-size: 11px; color: var(--ink-soft);">${isAr ? 'سجل المحاولات السابقة:' : 'Past Execution Logs:'}</strong>
                ${currentUsage.map(u => `
                  <div style="font-size: 12px; padding: 6px 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; justify-content: space-between;">
                    <span>${u.outcome === 'worked' ? '✅ Worked' : (u.outcome === 'partially' ? '⚠️ Partially' : '❌ Failed')} - ${escapeHtml(u.notes || '')}</span>
                    <span style="color: var(--ink-soft); font-size: 11px;">${new Date(u.date).toLocaleDateString()}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

        </div>
      `;
    }

    if (_activeTab === 'quiz') {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px; text-align: center; padding: 20px;">
          <span style="font-size: 40px;">🎓</span>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--ink); margin: 0;">
            ${isAr ? 'تحدي التعلم واختبار المفاهيم (Learn & Quiz Me)' : 'Master this Script with AI Quiz'}
          </h3>
          <p style="font-size: 13px; color: var(--ink-soft); max-width: 600px; margin: 0 auto; line-height: 1.6;">
            ${isAr ? 'اختبر فهمك للعمليات المحاسبية، الجداول المتأثرة، وقيود الأستاذ العام في هذا السكربت عبر محرك التحدي اليومي الذكي.' : 'Test your understanding of the tables, operations, and GL accounting entries in this script via our interactive Challenge Engine.'}
          </p>

          <div>
            <button class="btn btn-primary" id="btn-start-script-quiz" style="padding: 10px 20px; font-size: 14px; font-weight: 700;">
              🧠 ${isAr ? 'بدء الاختبار التفاعلي لهذا السكربت' : 'Start Interactive Quiz'}
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  function bindWorkbenchEvents(modal) {
    const isAr = I18n.getLang() === 'ar';
    const s = _activeScript;
    if (!s) return;

    // Close button
    const btnClose = modal.querySelector('#wb-btn-close');
    if (btnClose) btnClose.addEventListener('click', closeScriptWorkbench);

    // Tab buttons
    modal.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeTab = btn.getAttribute('data-tab');
        renderWorkbenchContent();
      });
    });

    // Toggle favorite
    const favBtn = modal.querySelector('#wb-toggle-fav');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        toggleFavorite(s.id);
        renderWorkbenchContent();
      });
    }

    // Copy pure code
    const copyBtn = modal.querySelector('#wb-btn-copy-code');
    if (copyBtn) copyBtn.addEventListener('click', () => copyPureCode(s.code));

    // Download code
    const dlBtn = modal.querySelector('#wb-btn-download');
    if (dlBtn) dlBtn.addEventListener('click', () => downloadScriptFile(s));

    // AI Explain
    const btnExplain = modal.querySelector('#btn-run-ai-explain');
    if (btnExplain) {
      btnExplain.addEventListener('click', async () => {
        const box = modal.querySelector('#ai-response-box');
        const content = modal.querySelector('#ai-response-content');
        if (!box || !content) return;

        box.style.display = 'block';
        content.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="display: inline-block;"></div><div style="margin-top: 8px; color: var(--teal);">${isAr ? 'جاري تحليل الكود بالذكاء الاصطناعي مع قاعدة البيانات...' : 'Analyzing script against current database schema...'}</div></div>`;

        try {
          const prompt = ScriptEngine.buildAIPromptForScript(s, 'explain');
          const res = await AIService.ask('sql_explainer', prompt);
          content.innerHTML = typeof renderMarkdown === 'function' ? renderMarkdown(res.text) : `<pre style="white-space: pre-wrap;">${escapeHtml(res.text)}</pre>`;
        } catch (err) {
          content.innerHTML = `<div style="color: var(--rust);">${isAr ? 'تعذر الاتصال بالذكاء الاصطناعي: ' + err.message : 'AI analysis failed: ' + err.message}</div>`;
        }
      });
    }

    // AI Safety Review
    const btnSafety = modal.querySelector('#btn-run-ai-safety');
    if (btnSafety) {
      btnSafety.addEventListener('click', async () => {
        const box = modal.querySelector('#ai-response-box');
        const content = modal.querySelector('#ai-response-content');
        if (!box || !content) return;

        box.style.display = 'block';
        content.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="display: inline-block;"></div><div style="margin-top: 8px; color: var(--rust);">${isAr ? 'جاري إجراء الفحص الأمني للسكربت...' : 'Running safety & data loss review...'}</div></div>`;

        try {
          const prompt = ScriptEngine.buildAIPromptForScript(s, 'safety_review');
          const res = await AIService.ask('safety_reviewer', prompt);
          content.innerHTML = typeof renderMarkdown === 'function' ? renderMarkdown(res.text) : `<pre style="white-space: pre-wrap;">${escapeHtml(res.text)}</pre>`;
        } catch (err) {
          content.innerHTML = `<div style="color: var(--rust);">${isAr ? 'تعذر الاتصال بالذكاء الاصطناعي: ' + err.message : 'AI review failed: ' + err.message}</div>`;
        }
      });
    }

    // Save Note
    const btnSaveNote = modal.querySelector('#btn-save-note');
    if (btnSaveNote) {
      btnSaveNote.addEventListener('click', async () => {
        const noteText = modal.querySelector('#script-note-text').value.trim();
        _userNotes[s.id] = { text: noteText, updated_at: new Date().toISOString() };
        saveLocalState();
        Toast.show(isAr ? '✅ تم حفظ الملاحظة بنجاح!' : 'Note saved successfully!', 'success');

        try {
          if (typeof API !== 'undefined' && API.saveScriptNote) {
            await API.saveScriptNote({ script_id: s.id, note_text: noteText });
          }
        } catch (e) {
          console.info('Backend note sync fallback to local storage');
        }
      });
    }

    // Log Usage
    modal.querySelectorAll('.btn-log-outcome').forEach(btn => {
      btn.addEventListener('click', async () => {
        const outcome = btn.getAttribute('data-outcome');
        if (!_usageLogs[s.id]) _usageLogs[s.id] = [];
        _usageLogs[s.id].unshift({
          outcome: outcome,
          notes: '',
          date: new Date().toISOString()
        });
        saveLocalState();
        Toast.show(isAr ? '✅ تم تسجيل نتيجة الاستخدام بنجاح!' : 'Usage result logged!', 'success');
        renderWorkbenchContent();

        try {
          if (typeof API !== 'undefined' && API.logScriptUsage) {
            await API.logScriptUsage({ script_id: s.id, outcome: outcome });
          }
        } catch (e) {
          console.info('Backend usage sync fallback');
        }
      });
    });

    // Checklist toggles
    modal.querySelectorAll('.chk-step').forEach(chk => {
      chk.addEventListener('change', () => {
        const key = chk.getAttribute('data-key');
        if (!_checklistState[s.id]) _checklistState[s.id] = {};
        _checklistState[s.id][key] = chk.checked;
        saveLocalState();
      });
    });

    // Quiz Me button
    const btnQuiz = modal.querySelector('#btn-start-script-quiz');
    if (btnQuiz) {
      btnQuiz.addEventListener('click', () => {
        closeScriptWorkbench();
        if (typeof Router !== 'undefined') {
          Router.go('daily-challenge', { moduleId: s.modules ? s.modules[0] : 'MOD-1' });
        }
      });
    }

    // Report script
    const btnReport = modal.querySelector('#wb-btn-report-script');
    if (btnReport) {
      btnReport.addEventListener('click', () => {
        const reason = prompt(isAr ? 'أدخل سبب الإبلاغ عن هذا السكربت (مثال: كود قديم، أسماء جداول خاطئة):' : 'Enter reason for reporting this script:');
        if (reason) {
          Toast.show(isAr ? '🚩 تم إرسال البلاغ لمسؤولي النظام للمراجعة.' : 'Report submitted.', 'info');
          if (typeof API !== 'undefined' && API.reportScript) {
            API.reportScript({ script_id: s.id, reason: reason }).catch(() => {});
          }
        }
      });
    }
  }

  function copyPureCode(code) {
    const isAr = I18n.getLang() === 'ar';
    const textToCopy = (code || (_activeScript ? _activeScript.code : '')).trim();
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      Toast.show(isAr ? '📋 تم نسخ كود الـ SQL الصافي إلى الحافظة!' : '📋 Pure SQL copied to clipboard!', 'success');
    }).catch(() => {
      Toast.show(isAr ? 'تعذر النسخ التلقائي' : 'Failed to copy', 'error');
    });
  }

  function downloadScriptFile(script) {
    const blob = new Blob([script.code], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename || `${script.id}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function toggleFavorite(scriptId) {
    const isAr = I18n.getLang() === 'ar';
    if (_favorites.has(scriptId)) {
      _favorites.delete(scriptId);
      Toast.show(isAr ? 'تمت الإزالة من المفضلة' : 'Removed from favorites', 'info');
    } else {
      _favorites.add(scriptId);
      Toast.show(isAr ? '⭐ تمت الإضافة إلى المفضلة' : 'Added to favorites', 'success');
    }
    saveLocalState();
    applyFilters();
  }

  function openDatabaseExplorer() {
    const modal = document.getElementById('database-explorer-modal');
    if (!modal) return;

    const isAr = I18n.getLang() === 'ar';
    const dbObjects = ScriptEngine.getAllDatabaseObjects(_scripts);

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-dialog animate-scale-in" style="max-width: 900px; width: 95%; max-height: 85vh; display: flex; flex-direction: column; background: var(--surface); border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
        
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--paper);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">🗄️</span>
            <div>
              <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">
                ${isAr ? 'مستعرض كائنات وجداول قاعدة البيانات الحالية' : 'Current Database Objects Explorer'}
              </h3>
              <span style="font-size: 11px; color: var(--teal); font-family: monospace;">Source of Truth: newdatabase2026.sql (${dbObjects.length} Tables)</span>
            </div>
          </div>
          <button class="btn-icon" onclick="document.getElementById('database-explorer-modal').style.display='none'" style="font-size: 18px; border: none; background: none; cursor: pointer;">✕</button>
        </div>

        <div style="padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--surface);">
          <input type="text" id="db-explorer-search" class="form-control" placeholder="${isAr ? '🔍 ابحث في 406 جدول أو عمود...' : '🔍 Search across 406 tables or columns...'}" style="font-size: 13px;" />
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 16px;" id="db-explorer-list">
          <!-- Populated dynamically -->
        </div>

      </div>
    `;

    const searchInput = modal.querySelector('#db-explorer-search');
    const listEl = modal.querySelector('#db-explorer-list');

    const renderTableList = (q = '') => {
      const filtered = dbObjects.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
      listEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${filtered.slice(0, 100).map(tbl => `
            <div style="padding: 10px 14px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-family: monospace; font-size: 14px; color: var(--ink);">${escapeHtml(tbl.name)}</strong>
                <div style="font-size: 11px; color: var(--ink-soft); margin-top: 2px;">
                  PK: <code>${escapeHtml(tbl.primary_key.join(', ') || 'None')}</code> • ${tbl.columns_count} ${isAr ? 'عمود' : 'cols'}
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                ${tbl.scripts_count > 0 ? `
                  <button class="btn btn-secondary btn-sm btn-filter-by-table" data-table="${escapeHtml(tbl.name)}" style="font-size: 11px; padding: 2px 8px; color: var(--teal); font-weight: 600;">
                    🔗 ${tbl.scripts_count} ${isAr ? 'سكربت مرتبط' : 'scripts'}
                  </button>
                ` : `<span style="font-size: 11px; color: var(--ink-soft);">${isAr ? 'لا توجد سكربتات' : 'No scripts'}</span>`}
              </div>
            </div>
          `).join('')}
          ${filtered.length > 100 ? `<div style="text-align: center; color: var(--ink-soft); font-size: 12px; padding: 10px;">${isAr ? 'يتم عرض أول 100 جدول. حدد البحث للمزيد.' : 'Showing top 100 tables.'}</div>` : ''}
        </div>
      `;

      listEl.querySelectorAll('.btn-filter-by-table').forEach(btn => {
        btn.addEventListener('click', () => {
          const tbl = btn.getAttribute('data-table');
          modal.style.display = 'none';
          _searchQuery = tbl;
          applyFilters();
        });
      });
    };

    renderTableList();
    if (searchInput) {
      searchInput.addEventListener('input', (e) => renderTableList(e.target.value));
    }
  }

  function openImportModal() {
    const modal = document.getElementById('script-import-modal');
    if (!modal) return;

    const isAr = I18n.getLang() === 'ar';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-dialog animate-scale-in" style="max-width: 750px; width: 95%; max-height: 85vh; display: flex; flex-direction: column; background: var(--surface); border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
        
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--paper);">
          <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">
            ➕ ${isAr ? 'استيراد وإضافة سكربت جديد' : 'Import New Script'}
          </h3>
          <button class="btn-icon" onclick="document.getElementById('script-import-modal').style.display='none'" style="font-size: 18px; border: none; background: none; cursor: pointer;">✕</button>
        </div>

        <div style="padding: 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--ink); display: block; margin-bottom: 4px;">
              ${isAr ? 'عنوان السكربت بالعربية:' : 'Script Title (Arabic):'}
            </label>
            <input type="text" id="imp-title-ar" class="form-control" placeholder="${isAr ? 'مثال: تسوية فواتير المبيعات مع الأستاذ العام' : 'Title...'}" style="font-size: 13px;" />
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--ink); display: block; margin-bottom: 4px;">
              ${isAr ? 'وصف المشكلة:' : 'Problem Description:'}
            </label>
            <textarea id="imp-problem-ar" class="form-control" rows="2" placeholder="${isAr ? 'ما المشكلة التي يحلها السكربت؟' : 'What problem does this solve?'}" style="font-size: 13px;"></textarea>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--ink); display: block; margin-bottom: 4px;">
              ${isAr ? 'كود الـ SQL:' : 'SQL Code:'}
            </label>
            <textarea id="imp-code" class="form-control" rows="8" placeholder="SELECT / UPDATE / INSERT / DELETE ..." style="font-family: monospace; font-size: 12px;"></textarea>
          </div>

          <!-- Live Analysis Box -->
          <div id="imp-live-analysis" style="display: none; padding: 12px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid var(--line);"></div>
        </div>

        <div style="padding: 12px 20px; background: var(--paper); border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn btn-secondary" onclick="document.getElementById('script-import-modal').style.display='none'">
            ${isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button class="btn btn-primary" id="btn-confirm-import">
            💾 ${isAr ? 'تأكيد الاستيراد والحفظ' : 'Confirm & Save'}
          </button>
        </div>

      </div>
    `;

    const codeInput = modal.querySelector('#imp-code');
    const liveBox = modal.querySelector('#imp-live-analysis');

    codeInput.addEventListener('input', () => {
      const code = codeInput.value.trim();
      if (!code) { liveBox.style.display = 'none'; return; }
      const analysis = ScriptEngine.analyzeScript(code);
      liveBox.style.display = 'block';
      liveBox.className = analysis.database_compatibility === 'GREEN' ? 'alert-success' : 'alert-warning';
      liveBox.innerHTML = `
        <strong>🔍 ${isAr ? 'التحليل التلقائي للكود:' : 'Auto-Analysis:'}</strong>
        <div>${isAr ? analysis.compatibility_reason_ar : analysis.compatibility_reason_en}</div>
        <div style="margin-top: 4px; font-weight: 600;">Risk: ${analysis.risk_level} • Operations: ${analysis.operations.join(', ')} • Tables: ${analysis.tables.join(', ')}</div>
      `;
    });

    modal.querySelector('#btn-confirm-import').addEventListener('click', async () => {
      const title = modal.querySelector('#imp-title-ar').value.trim();
      const problem = modal.querySelector('#imp-problem-ar').value.trim();
      const code = codeInput.value.trim();

      if (!title || !code) {
        Toast.show(isAr ? 'يرجى إدخال العنوان وكود السكربت' : 'Title and code are required', 'error');
        return;
      }

      const analysis = ScriptEngine.analyzeScript(code);
      const newScript = {
        id: `SCR-${Date.now()}`,
        filename: `custom_${Date.now()}.sql`,
        title_ar: title,
        title_en: title,
        problem_ar: problem,
        solution_ar: 'استعلام تصحيحي مخصص.',
        code: code,
        category_id: 'CAT-DATA-FIX',
        modules: ['MOD-1', 'MOD-2'],
        difficulty: 'Intermediate',
        ...analysis,
        created_at: new Date().toISOString()
      };

      _scripts.unshift(newScript);
      applyFilters();
      modal.style.display = 'none';
      Toast.show(isAr ? '✨ تم استيراد السكربت وإضافته للمكتبة بنجاح!' : 'Script imported successfully!', 'success');

      try {
        if (typeof API !== 'undefined' && API.importScript) {
          await API.importScript(newScript);
        }
      } catch (e) {
        console.info('Backend import sync fallback');
      }
    });
  }

  function scrollToLine(lineNum) {
    const editor = document.getElementById('sql-code-editor-view');
    if (editor) {
      const targetY = (lineNum - 1) * 20;
      editor.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  function clearFilters() {
    _searchQuery = '';
    _filterModule = '';
    _filterCategory = '';
    _filterRisk = '';
    _filterCompat = '';
    _filterTable = '';
    _onlyFavorites = false;
    applyFilters();
  }

  return {
    init,
    render,
    openScriptWorkbench,
    closeScriptWorkbench,
    openDatabaseExplorer,
    openImportModal,
    copyPureCode,
    toggleFavorite,
    scrollToLine,
    clearFilters
  };
})();

if (typeof module !== 'undefined') module.exports = ScriptsToolkit;
