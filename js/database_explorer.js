/**
 * js/database_explorer.js
 * 🗄️ ERP Database Explorer & Safe Data Change Assistant
 * Frontend UI & Interactive Platform
 * Source of Truth: newdatabase2026.sql (406 Tables)
 */

const DatabaseExplorer = (function () {
  let _activeTab = 'impact'; // 'impact' | 'tables' | 'columns' | 'data_maps' | 'incidents' | 'change_log' | 'ai_chat'
  let _activeDomain = '';
  let _searchQuery = '';
  let _selectedTable = null;
  let _impactResult = null;
  let _columnSearchResults = [];
  let _changeLogs = [];
  let _testScenarios = [];

  const LS_DB_CHANGE_LOG = 'erp_db_change_log';
  const LS_DB_TEST_SCENARIOS = 'erp_db_test_scenarios';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function init() {
    loadLocalLogs();
  }

  function loadLocalLogs() {
    try {
      const logs = localStorage.getItem(LS_DB_CHANGE_LOG);
      if (logs) _changeLogs = JSON.parse(logs);
      const sc = localStorage.getItem(LS_DB_TEST_SCENARIOS);
      if (sc) _testScenarios = JSON.parse(sc);
    } catch (e) {
      // Ignore
    }
  }

  function saveLocalLogs() {
    try {
      localStorage.setItem(LS_DB_CHANGE_LOG, JSON.stringify(_changeLogs));
      localStorage.setItem(LS_DB_TEST_SCENARIOS, JSON.stringify(_testScenarios));
    } catch (e) {
      // Ignore
    }
  }

  function render(container) {
    if (!container) return;
    init();

    const isAr = I18n.getLang() === 'ar';
    const meta = DatabaseExplorerEngine.getMetadata() || { total_tables: 406 };

    container.innerHTML = `
      <div class="db-explorer-page animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Banner -->
        <div class="card" style="padding: 22px; background: linear-gradient(135deg, var(--paper) 0%, rgba(181, 119, 46, 0.05) 100%); border-inline-start: 4px solid var(--brass);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span style="font-size: 28px;">🗄️</span>
                <h1 style="font-size: 21px; font-weight: 700; margin: 0; color: var(--ink);">
                  ${isAr ? 'مستكشف قاعدة البيانات ومساعد التغيير الآمن' : 'ERP Database Explorer & Safe Change Assistant'}
                </h1>
                <span class="badge badge-teal" style="font-size: 11px; padding: 2px 8px;">
                  newdatabase2026.sql (${meta.total_tables || 406} Tables)
                </span>
              </div>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 0; max-width: 850px; line-height: 1.6;">
                ${isAr 
                  ? 'أداة الاستشاري ومسؤول الدعم لفهم أماكن حفظ البيانات، تحليل أثر التعديل على المخزون والحسابات، توليد استعلامات الفحص التشخيصية (Read-only)، ومنع كسر ترابط الحركات التاريخية.' 
                  : 'Enterprise tool for ERP consultants to locate data entities, analyze change impact on inventory and GL, generate read-only probe queries, and safeguard transactional integrity.'}
              </p>
            </div>

            <!-- Header Quick Action -->
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="Router.go('scripts')" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                🛠️ ${isAr ? 'مكتبة السكربتات' : 'Script Toolkit'}
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs Bar -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div style="display: flex; border-bottom: 1px solid var(--line); background: var(--surface); overflow-x: auto; padding: 0 12px;" id="db-nav-tabs">
            <button class="tab-nav-btn ${ _activeTab === 'deletion' ? 'active' : '' }" data-tab="deletion" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'deletion' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'deletion' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🗑️ ${isAr ? 'محلل حذف الحركات (Deletion Analyzer)' : 'Transaction Deletion Analyzer'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'impact' ? 'active' : '' }" data-tab="impact" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'impact' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'impact' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🧪 ${isAr ? 'مساعد تحليل أثر التعديل (Change Impact)' : 'Change Impact Analyzer'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'tables' ? 'active' : '' }" data-tab="tables" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'tables' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'tables' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🗄️ ${isAr ? 'مستعرض الجداول والمجالات (406 جدول)' : 'Domain & Table Explorer'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'columns' ? 'active' : '' }" data-tab="columns" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'columns' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'columns' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🔍 ${isAr ? 'البحث في الأعمدة (Column Finder)' : 'Column Search'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'data_maps' ? 'active' : '' }" data-tab="data_maps" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'data_maps' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'data_maps' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🗺️ ${isAr ? 'خرائط تدفق البيانات (Data Maps)' : 'Data Flow Maps'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'incidents' ? 'active' : '' }" data-tab="incidents" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'incidents' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'incidents' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🚨 ${isAr ? 'أدلة دعم الطوارئ (Incident Playbooks)' : 'Incident Playbooks'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'change_log' ? 'active' : '' }" data-tab="change_log" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'change_log' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'change_log' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              📝 ${isAr ? 'سجل التغييرات والاختبارات UAT' : 'Change & UAT Log'}
            </button>
            <button class="tab-nav-btn ${ _activeTab === 'ai_chat' ? 'active' : '' }" data-tab="ai_chat" style="padding: 12px 16px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 2px solid ${_activeTab === 'ai_chat' ? 'var(--brass)' : 'transparent'}; color: ${_activeTab === 'ai_chat' ? 'var(--brass-deep)' : 'var(--ink-soft)'}; white-space: nowrap;">
              🤖 ${isAr ? 'اسأل الـ AI عن قاعدة البيانات' : 'Ask AI DB Assistant'}
            </button>
          </div>

          <!-- Active Tab Content Area -->
          <div style="padding: 20px;" id="db-main-content">
            <!-- Rendered dynamically -->
          </div>
        </div>

      </div>

      <!-- Table Detail Modal / Drawer -->
      <div id="db-table-detail-modal" class="modal-backdrop" style="display: none;"></div>
    `;

    bindTabEvents(container);
    renderActiveTab();
  }

  function bindTabEvents(container) {
    container.querySelectorAll('.tab-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeTab = btn.getAttribute('data-tab');
        container.querySelectorAll('.tab-nav-btn').forEach(b => {
          const isActive = b.getAttribute('data-tab') === _activeTab;
          b.style.borderBottom = `2px solid ${isActive ? 'var(--brass)' : 'transparent'}`;
          b.style.color = isActive ? 'var(--brass-deep)' : 'var(--ink-soft)';
        });
        renderActiveTab();
      });
    });
  }

  function renderActiveTab() {
    const contentEl = document.getElementById('db-main-content');
    if (!contentEl) return;

    const isAr = I18n.getLang() === 'ar';

    if (_activeTab === 'deletion') {
      renderDeletionTab(contentEl, isAr);
    } else if (_activeTab === 'impact') {
      renderImpactTab(contentEl, isAr);
    } else if (_activeTab === 'tables') {
      renderTablesTab(contentEl, isAr);
    } else if (_activeTab === 'columns') {
      renderColumnsTab(contentEl, isAr);
    } else if (_activeTab === 'data_maps') {
      renderDataMapsTab(contentEl, isAr);
    } else if (_activeTab === 'incidents') {
      renderIncidentsTab(contentEl, isAr);
    } else if (_activeTab === 'change_log') {
      renderChangeLogTab(contentEl, isAr);
    } else if (_activeTab === 'ai_chat') {
      renderAIChatTab(contentEl, isAr);
    }
  }

  // =========================================================================
  // TAB 0: TRANSACTION DELETION ANALYZER (Full Dynamic Coverage & Live Graph)
  // =========================================================================
  let _deletionResult = null;
  let _selectedTxType = 'SALES_RETURN';
  let _currentOpMode = 'ANALYZE_ONLY'; // 'ANALYZE_ONLY' | 'CHANGE' | 'DELETE'

  function renderDeletionTab(container, isAr) {
    const registry = DatabaseExplorerEngine.getRegistry();
    const allFamKeys = Object.keys(registry);

    if (!_deletionResult) {
      _deletionResult = DatabaseExplorerEngine.analyzeTransactionDeletion('عايز أحذف حركة مرتجع مبيعات رقم 12345', 'SALES_RETURN', '12345');
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Operation Mode Switcher & Re-Scan Banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; background: var(--paper); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12px; font-weight: 700; color: var(--ink);">⚙️ ${isAr ? 'نمط العملية المطلوب:' : 'Operation Mode:'}</span>
            <div class="btn-group" style="display: flex; gap: 4px;">
              <button class="btn btn-sm ${ _currentOpMode === 'ANALYZE_ONLY' ? 'btn-primary' : 'btn-secondary' } op-mode-btn" data-mode="ANALYZE_ONLY" style="font-size: 11px;">
                🔍 ${isAr ? 'دراسة وتحليل فقط (Analyze)' : 'Analyze Only'}
              </button>
              <button class="btn btn-sm ${ _currentOpMode === 'CHANGE' ? 'btn-primary' : 'btn-secondary' } op-mode-btn" data-mode="CHANGE" style="font-size: 11px;">
                🧪 ${isAr ? 'تعديل آمن (Change)' : 'Safe Change'}
              </button>
              <button class="btn btn-sm ${ _currentOpMode === 'DELETE' ? 'btn-primary' : 'btn-secondary' } op-mode-btn" data-mode="DELETE" style="font-size: 11px;">
                🗑️ ${isAr ? 'حذف آمن (Delete)' : 'Safe Delete'}
              </button>
            </div>
          </div>

          <!-- Dynamic Schema Re-Scanner Trigger -->
          <button class="btn btn-secondary btn-sm" id="btn-re-scan-schema" style="font-size: 11.5px; display: inline-flex; align-items: center; gap: 6px;">
            🔄 ${isAr ? 'إعادة فحص واكتشاف الحركات في الداتا بيز' : 'Re-Scan Schema for Transactions'}
          </button>
        </div>

        <!-- Input & Search -->
        <div>
          <label style="font-size: 13px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 8px;">
            ${_currentOpMode === 'DELETE' ? '🗑️ ' : (_currentOpMode === 'CHANGE' ? '🧪 ' : '🔍 ')} 
            ${isAr ? 'ما الحركة التشغيلية التي ترغب في فحصها أو تنفيذ العملية عليها؟' : 'Which transaction lifecycle do you want to inspect or execute against?'}
          </label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input 
              type="text" 
              id="db-deletion-input" 
              class="form-control" 
              placeholder="${isAr ? 'اكتب باللغة الطبيعية مثلاً: عايز أحذف مرتجع مبيعات رقم 12345، أو احذف أمر تصنيع 40، أو احذف حركة وقود 12...' : 'e.g. Delete sales return 12345, delete manufacturing order 40, delete fuel log 12...'}" 
              value="${escapeHtml(_deletionResult ? (_deletionResult.intent.raw_query || '') : '')}"
              style="flex: 1; min-width: 300px; font-size: 13px;"
            />
            <button class="btn btn-primary" id="btn-run-deletion" style="font-size: 13px; font-weight: 600;">
              🔍 ${isAr ? 'تحليل دورة الحركة ومخطط الاعتماديات' : 'Analyze Transaction & Dependency Graph'}
            </button>
          </div>

          <!-- Filter & Dropdown for all 45 Transaction Families -->
          <div style="margin-top: 12px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; background: var(--paper); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
            <div style="font-size: 12px; font-weight: 600; color: var(--ink);">
              🏷️ ${isAr ? 'اختر من الـ 45 حركة مكتشفة:' : 'Or Select from 45 Discovered Families:'}
            </div>
            
            <select id="db-deletion-tx-select" class="form-control" style="max-width: 350px; font-size: 12.5px; padding: 4px 8px;">
              ${allFamKeys.map(k => {
                const fam = registry[k];
                const isSel = fam.type_key === (_deletionResult ? _deletionResult.family.type_key : _selectedTxType);
                return `<option value="${fam.type_key}" ${isSel ? 'selected' : ''}>${isAr ? fam.module_ar : fam.module} ➔ ${isAr ? fam.name_ar : fam.name_en} (${fam.header_table})</option>`;
              }).join('')}
            </select>

            <!-- Quick Chips for Top ERP Transactions -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-inline-start: auto;">
              <button class="btn btn-sm ${ _selectedTxType === 'SALES_RETURN' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="SALES_RETURN" data-id="12345" style="font-size: 11px;">
                🧾 ${isAr ? 'مرتجع مبيعات' : 'Sales Return'}
              </button>
              <button class="btn btn-sm ${ _selectedTxType === 'SALES_INVOICE' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="SALES_INVOICE" data-id="8841" style="font-size: 11px;">
                🧾 ${isAr ? 'فاتورة مبيعات' : 'Sales Invoice'}
              </button>
              <button class="btn btn-sm ${ _selectedTxType === 'PURCHASE_RETURN' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="PURCHASE_RETURN" data-id="3120" style="font-size: 11px;">
                🛒 ${isAr ? 'مرتجع مشتريات' : 'Purchase Return'}
              </button>
              <button class="btn btn-sm ${ _selectedTxType === 'STOCK_TRANSFER' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="STOCK_TRANSFER" data-id="901" style="font-size: 11px;">
                📦 ${isAr ? 'تحويل مخزني' : 'Stock Transfer'}
              </button>
              <button class="btn btn-sm ${ _selectedTxType === 'MANUFACTURING_ORDERS' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="MANUFACTURING_ORDERS" data-id="40" style="font-size: 11px;">
                ⚙️ ${isAr ? 'أمر تصنيع MES' : 'Manufacturing'}
              </button>
            </div>
          </div>
        </div>

        <!-- Dynamic Scanner Output Modal Placeholder -->
        <div id="db-dynamic-scan-output-box" style="display: none; padding: 16px; background: rgba(44, 122, 107, 0.05); border: 1px solid var(--teal); border-radius: var(--radius-sm);"></div>

        <!-- Deletion Analysis Results Container -->
        <div id="db-deletion-results-container">
          ${_deletionResult ? renderDeletionResultDetails(_deletionResult, isAr, _currentOpMode) : ''}
        </div>

      </div>
    `;

    // Bind events
    const input = container.querySelector('#db-deletion-input');
    const btnRun = container.querySelector('#btn-run-deletion');
    const selectTx = container.querySelector('#db-deletion-tx-select');
    const btnReScan = container.querySelector('#btn-re-scan-schema');
    const boxReScan = container.querySelector('#db-dynamic-scan-output-box');

    const execDeletionAnalysis = (query, forcedType, forcedId) => {
      const q = (query || input.value).trim();
      _deletionResult = DatabaseExplorerEngine.analyzeTransactionDeletion(q || `حذف ${forcedType}`, forcedType, forcedId);
      _selectedTxType = _deletionResult.family.type_key;
      input.value = _deletionResult.intent.raw_query || `حذف ${_deletionResult.family.name_ar} رقم ${_deletionResult.transaction_id}`;
      
      const resContainer = container.querySelector('#db-deletion-results-container');
      if (resContainer) {
        resContainer.innerHTML = renderDeletionResultDetails(_deletionResult, isAr, _currentOpMode);
        bindDeletionResultEvents(resContainer, isAr);
      }
    };

    if (btnRun) btnRun.addEventListener('click', () => execDeletionAnalysis());
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') execDeletionAnalysis(); });

    if (selectTx) {
      selectTx.addEventListener('change', (e) => {
        execDeletionAnalysis(`حذف ${e.target.value}`, e.target.value, '12345');
      });
    }

    container.querySelectorAll('.op-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _currentOpMode = btn.getAttribute('data-mode');
        container.querySelectorAll('.op-mode-btn').forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-secondary');
        });
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
        execDeletionAnalysis();
      });
    });

    if (btnReScan) {
      btnReScan.addEventListener('click', () => {
        const scanRes = DatabaseExplorerEngine.discoverTransactionFamiliesFromSchema();
        boxReScan.style.display = 'block';
        boxReScan.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <strong style="font-size: 13.5px; color: var(--teal);">
              🔄 ${isAr ? 'نتائج الفحص التلقائي المستمر للـ 406 جدول (Live Schema Discovery):' : 'Continuous Schema Discovery Results:'}
            </strong>
            <button class="btn-icon" onclick="document.getElementById('db-dynamic-scan-output-box').style.display='none'" style="border:none; background:none; cursor:pointer;">✕</button>
          </div>
          <div style="font-size: 12.5px; color: var(--ink); line-height: 1.6;">
            📊 <strong>${isAr ? 'إجمالي الحركات المكتشفة في الهيكل الحالي:' : 'Total Candidate Transactions:'}</strong> <code>${scanRes.total_candidates}</code> &nbsp;•&nbsp;
            🟢 <strong>${isAr ? 'الحركات المثبتة في الـ Registry الأساسي:' : 'Confirmed Baseline:'}</strong> <code>${scanRes.confirmed_baseline.length}</code> &nbsp;•&nbsp;
            🆕 <strong>${isAr ? 'الحركات المرشحة الجديدة المكتشفة ديناميكياً:' : 'Newly Discovered Candidates:'}</strong> <code>${scanRes.newly_discovered.length}</code>
          </div>
          <div style="max-height: 140px; overflow-y: auto; margin-top: 8px; font-size: 11.5px; background: var(--paper); padding: 8px; border-radius: 4px; border: 1px solid var(--line);">
            ${scanRes.confirmed_baseline.slice(0, 15).map(c => `<div>🟢 ${c.name_ar} (<code>${c.header_table}</code> ➔ <code>${c.details_table || 'N/A'}</code>)</div>`).join('')}
          </div>
        `;
        Toast.show(isAr ? `تم اكتشاف ${scanRes.total_candidates} حركة في قاعدة البيانات` : `Discovered ${scanRes.total_candidates} candidate transactions`, 'success');
      });
    }

    container.querySelectorAll('.quick-tx-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.getAttribute('data-type');
        const id = chip.getAttribute('data-id');
        container.querySelectorAll('.quick-tx-chip').forEach(c => {
          c.classList.remove('btn-primary');
          c.classList.add('btn-secondary');
        });
        chip.classList.remove('btn-secondary');
        chip.classList.add('btn-primary');
        execDeletionAnalysis(`حذف ${type} رقم ${id}`, type, id);
      });
    });

    const resContainer = container.querySelector('#db-deletion-results-container');
    if (resContainer) bindDeletionResultEvents(resContainer, isAr);
  }

  function renderDeletionResultDetails(res, isAr, opMode = 'ANALYZE_ONLY') {
    if (!res || !res.family) return '';

    const m = res.family;
    const txId = res.transaction_id;
    const graph = res.dependency_graph;

    return `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Title Card -->
        <div style="padding: 20px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); border-inline-start: 4px solid var(--rust); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">${opMode === 'DELETE' ? '🗑️' : (opMode === 'CHANGE' ? '🧪' : '🔍')}</span>
              <h3 style="font-size: 17px; font-weight: 700; margin: 0; color: var(--ink);">
                ${escapeHtml(isAr ? m.name_ar : m.name_en)} — #${escapeHtml(txId)}
              </h3>
              <span class="badge badge-rust" style="font-size: 11px;">
                ⚡ Risk Level: ${escapeHtml(res.risk_level)}
              </span>
              <span class="badge badge-teal" style="font-size: 10px;">
                ${escapeHtml(isAr ? m.module_ar : m.module)}
              </span>
            </div>
            <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
              📌 <strong>${isAr ? 'الترويسة الأساسية:' : 'Header:'}</strong> <code>${escapeHtml(m.header_table)}</code> (id=${escapeHtml(txId)}) &nbsp;•&nbsp; 
              <strong>${isAr ? 'جدول التفاصيل:' : 'Details:'}</strong> <code>${escapeHtml(m.details_table || 'None')}</code> &nbsp;•&nbsp;
              ${m.journal_type_id !== undefined ? `<strong>${isAr ? 'نوع القيد في journal:' : 'Journal type_id:'}</strong> <code>type_id=${m.journal_type_id}</code>` : ''}
            </div>
          </div>

          <div style="font-size: 11px; color: var(--ink-soft); background: var(--surface); padding: 5px 12px; border-radius: 4px; border: 1px solid var(--line);">
            🔒 <strong>Source of Truth:</strong> newdatabase2026.sql (406 Tables)
          </div>
        </div>

        <!-- VISUAL LIVE TRANSACTION DEPENDENCY GRAPH -->
        <div class="card" style="padding: 18px; border-inline-start: 4px solid var(--teal);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
              🌐 مخطط الاعتماديات الحي للحركة (Live Transaction Dependency Graph):
            </strong>
            <span class="badge badge-teal" style="font-size: 10px;">Full 7-Layer Graph</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${(graph && graph.graph_nodes ? graph.graph_nodes : []).map((node, idx) => `
              <div style="display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 10px 14px; border-inline-start: 3px solid ${node.confidence.badge === 'badge-teal' ? 'var(--teal)' : (node.confidence.badge === 'badge-brass' ? 'var(--brass)' : 'var(--rust)')};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; flex-wrap: wrap; gap: 6px;">
                  <strong style="font-size: 13px; color: var(--ink);">
                    ${escapeHtml(isAr ? node.layer_name_ar : node.layer_name_en)} ➔ <code>${escapeHtml(node.table)}</code>
                  </strong>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="badge ${node.confidence.badge}" style="font-size: 9px;">${escapeHtml(node.confidence.id)}</span>
                    <span class="badge badge-secondary" style="font-size: 9px;">Count: ${escapeHtml(node.record_count)}</span>
                  </div>
                </div>

                <div style="font-size: 12px; color: var(--ink-soft); font-family: monospace; margin-bottom: 4px;">
                  └── Relation: <code>${escapeHtml(node.relationship)}</code>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11.5px; border-top: 1px dashed var(--line); padding-top: 4px;">
                  <span style="color: var(--ink-soft);">⚡ Action: <strong>${escapeHtml(node.impact_action)}</strong></span>
                  <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${node.probe_sql.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('تم نسخ استعلام الفحص', 'success');" style="font-size: 10px; padding: 2px 6px;">
                    📋 Probe SQL
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- RISK & SAFETY BLOCKERS CHECKLIST -->
        <div class="card" style="padding: 18px; border: 1px solid var(--rust); background: rgba(192, 86, 62, 0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong style="font-size: 14px; color: var(--rust); display: flex; align-items: center; gap: 8px;">
              🔴 موانع العملية وفحوصات السلامة الإلزامية (Safety Blockers Checklist):
            </strong>
            <span class="badge badge-rust" style="font-size: 10px;">SAFETY GATE ENFORCED</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(res.safety_blockers || []).map(b => `
              <div style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 12px; background: var(--paper); border: 1px solid var(--line); border-radius: 4px;">
                <span style="font-size: 16px;">${b.status === 'ENFORCED' ? '🛡️' : '⚠️'}</span>
                <div>
                  <strong style="font-size: 12.5px; color: var(--ink); display: block;">${escapeHtml(b.title_ar)}</strong>
                  <span style="font-size: 11.5px; color: var(--ink-soft);">${escapeHtml(b.desc_ar)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Master Data & Audit Safeguards Banner -->
        <div style="padding: 12px 16px; background: rgba(44, 122, 107, 0.05); border: 1px solid var(--teal); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">🛡️</span>
          <div style="font-size: 12.5px; color: var(--ink); line-height: 1.5;">
            <strong>${isAr ? 'حماية البيانات الأساسية وسجلات الرقابة:' : 'Master Data & Audit Protection:'}</strong>
            ${isAr 
              ? `الجداول الأساسية (${(res.master_data_safeguards || []).join(', ')}) وسجلات التدقيق (${(res.audit_tables || []).join(', ')}) <strong>محمية تماماً ولن يتم حذفها</strong> لضمان سلامة الهيكل المحاسبي وتاريخ التدقيق.` 
              : `Master tables (${(res.master_data_safeguards || []).join(', ')}) and audit logs (${(res.audit_tables || []).join(', ')}) are strictly preserved.`}
          </div>
        </div>

        <!-- 8-Stage Pipeline Roadmap -->
        <div class="card" style="padding: 16px;">
          <strong style="font-size: 13.5px; color: var(--ink); display: block; margin-bottom: 12px;">
            🧭 ${isAr ? 'مسار المراحل الثماني لإثبات ودراسة الحركة (8-Stage Deletion Pipeline):' : '8-Stage Deletion Pipeline:'}
          </strong>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(res.eight_stage_roadmap || []).map(p => `
              <div style="padding: 10px 14px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); border-inline-start: 3px solid ${p.stage === 6 || p.stage === 7 ? 'var(--rust)' : (p.stage === 8 ? 'var(--teal)' : 'var(--brass)')};">
                <strong style="font-size: 12.5px; color: var(--ink); display: block; margin-bottom: 2px;">
                  ${escapeHtml(isAr ? p.title_ar : p.title_en)}
                </strong>
                <p style="font-size: 11.5px; color: var(--ink-soft); margin: 0; line-height: 1.5;">
                  ${escapeHtml(p.desc_ar)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Read-Only Dynamic Discovery & Verification Probes -->
        <div class="card" style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="font-size: 13.5px; color: var(--ink); display: flex; align-items: center; gap: 6px;">
              🔍 ${isAr ? 'استعلامات إثبات العلاقات والفحص المسبق (Dynamic Discovery Probes):' : 'Discovery Probes:'}
            </strong>
            <span class="badge badge-teal" style="font-size: 10px;">100% Read-Only (SELECT only)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${(res.discovery_probes || []).map((q, idx) => `
              <div style="border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
                <div style="padding: 6px 12px; background: var(--paper); border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                  <span>${escapeHtml(q.title_ar)}</span>
                  <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${q.sql.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('${isAr ? 'تم نسخ الاستعلام' : 'Query copied'}', 'success');" style="font-size: 11px; padding: 2px 6px;">
                    📋 ${isAr ? 'نسخ الاستعلام' : 'Copy Query'}
                  </button>
                </div>
                <pre style="margin: 0; padding: 8px 12px; background: #1e1e1e; color: #9cdcfe; font-family: monospace; font-size: 12px; white-space: pre-wrap; line-height: 1.5;"><code>${escapeHtml(q.sql)}</code></pre>
              </div>
            `).join('')}
          </div>
        </div>

        ${opMode !== 'ANALYZE_ONLY' ? `
          <!-- Transactional Modification SQL Wrapper -->
          <div class="card" style="padding: 16px; border: 1px solid rgba(192, 86, 62, 0.4);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 13.5px; color: var(--rust); display: block;">
                  ⚠️ ${isAr ? 'سكريبت التنفيذ الخارجي المشروط (External Transactional SQL Wrapper):' : 'External Transactional SQL:'}
                </strong>
                <small style="font-size: 11px; color: var(--ink-soft);">
                  ${isAr ? 'مغلف بكبسولة START TRANSACTION للتنفيذ اليدوي خارج النظام فقط مع دعم ROLLBACK الكامل.' : 'Wrapped in START TRANSACTION for external DB execution only.'}
                </small>
              </div>

              <button class="btn btn-secondary btn-sm" id="btn-toggle-mod-sql" style="font-size: 11px;">
                👁️ ${isAr ? 'إظهار / إخفاء كود الـ SQL' : 'Toggle SQL'}
              </button>
            </div>

            <div id="mod-sql-wrapper-box" style="display: none; margin-top: 10px;">
              <div style="display: flex; justify-content: flex-end; margin-bottom: 6px;">
                <button class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText('${res.modification_sql.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'); Toast.show('${isAr ? 'تم نسخ سكريبت الحذف الصافي' : 'SQL copied'}', 'success');" style="font-size: 11px;">
                  📋 ${isAr ? 'نسخ السكريبت بالكامل (Pure SQL)' : 'Copy Full Script'}
                </button>
              </div>
              <pre style="margin: 0; padding: 12px; background: #1a1a1a; color: #f8f8f2; font-family: monospace; font-size: 12px; border-radius: var(--radius-sm); white-space: pre-wrap; line-height: 1.5; border: 1px solid var(--line);"><code>${escapeHtml(res.modification_sql)}</code></pre>
            </div>
          </div>
        ` : ''}

        <!-- Post-Deletion Verification Tool -->
        <div class="card" style="padding: 16px; background: var(--paper); border-inline-start: 4px solid var(--teal);">
          <strong style="font-size: 13.5px; color: var(--ink); display: block; margin-bottom: 6px;">
            🔎 ${isAr ? 'أداة التحقق الختامي بعد الحذف (Post-Deletion Verifier):' : 'Post-Deletion Verifier:'}
          </strong>
          <p style="font-size: 12px; color: var(--ink-soft); margin: 0 0 10px 0;">
            ${isAr ? 'بعد تطبيق الحذف في بيئة قاعدة البيانات الخارجية، اضغط هنا لتوليد استعلامات فحص خلو الجداول من السجلات أو الأيتام.' : 'After running deletion externally, run these probe queries to confirm 0 remaining records.'}
          </p>

          <button class="btn btn-secondary btn-sm" id="btn-run-post-verify" style="font-size: 12px;">
            🔎 ${isAr ? 'توليد استعلامات التحقق الختامي (Verify Zero Counts)' : 'Generate Zero-Count Probes'}
          </button>

          <div id="post-verify-box" style="display: none; margin-top: 12px;">
            <pre style="margin: 0; padding: 10px; background: #1e1e1e; color: #a6e22e; font-family: monospace; font-size: 12px; border-radius: var(--radius-sm); white-space: pre-wrap;"><code>SELECT '${m.header_table}' AS tbl, count(*) AS cnt FROM \`${m.header_table}\` WHERE id = ${txId}
${m.details_table ? `UNION ALL\nSELECT '${m.details_table}' AS tbl, count(*) AS cnt FROM \`${m.details_table}\` WHERE ${m.details_fk} = ${txId}` : ''}
${m.inventory_discovery ? `UNION ALL\nSELECT '${m.inventory_discovery.table}' AS tbl, count(*) AS cnt FROM \`${m.inventory_discovery.table}\` WHERE link_id = ${txId} ${m.details_table ? `OR details_id IN (SELECT id FROM \`${m.details_table}\` WHERE ${m.details_fk} = ${txId})` : ''}` : ''}
${m.journal_type_id !== undefined ? `UNION ALL\nSELECT 'journal' AS tbl, count(*) AS cnt FROM \`journal\` WHERE reference = ${txId} AND type_id = ${m.journal_type_id}\nUNION ALL\nSELECT 'gl_trans' AS tbl, count(*) AS cnt FROM \`gl_trans\` WHERE type_id = ${m.gl_trans_type_id || m.journal_type_id} AND type_no IN (SELECT id FROM journal WHERE reference = ${txId})` : ''};</code></pre>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // TAB 1: CHANGE IMPACT ANALYZER (Full 45 Transaction Families)
  // =========================================================================
  function renderImpactTab(container, isAr) {
    const registry = DatabaseExplorerEngine.getRegistry();
    const allFamKeys = Object.keys(registry);

    if (!_impactResult) {
      _impactResult = DatabaseExplorerEngine.analyzeTransactionChange('عايز أغير كمية فاتورة مبيعات رقم 123 من 10 إلى 15');
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Input & Quick Scenarios -->
        <div>
          <label style="font-size: 13px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 8px;">
            🧪 ${isAr ? 'ما التعديل أو السيناريو الذي تريد دراسته واختباره؟' : 'What data change or test scenario do you want to analyze?'}
          </label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input 
              type="text" 
              id="db-impact-input" 
              class="form-control" 
              placeholder="${isAr ? 'اكتب باللغة الطبيعية: مثلاً: عايز أغير كمية فاتورة مبيعات 123 من 10 إلى 15، أو غير سعر شراء صنف 55 من 20 إلى 25...' : 'e.g. Change sales invoice 123 quantity from 10 to 15, change purchase price from 20 to 25...'}" 
              value="${escapeHtml(_impactResult ? (_impactResult.intent.raw_query || '') : '')}"
              style="flex: 1; min-width: 300px; font-size: 13px;"
            />
            <button class="btn btn-primary" id="btn-run-impact" style="font-size: 13px; font-weight: 600;">
              🧪 ${isAr ? 'تحليل الأثر وتوليد خطة التغيير' : 'Analyze Change Impact'}
            </button>
          </div>

          <!-- Quick Scenario Buttons -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
            <span style="font-size: 11px; color: var(--ink-soft); align-self: center;">${isAr ? 'أمثلة سريعة:' : 'Quick Examples:'}</span>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير كمية فاتورة مبيعات رقم 123 من 10 إلى 15" style="font-size: 11px;">
              🧾 ${isAr ? 'تعديل كمية فاتورة مبيعات (+5)' : 'Change Invoice Qty'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير سعر شراء صنف في فاتورة مشتريات 540 من 100 إلى 120" style="font-size: 11px;">
              🛒 ${isAr ? 'تعديل سعر شراء في فاتورة' : 'Change Purchase Cost'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير تاريخ حركة تحويل مخزني 901" style="font-size: 11px;">
              📦 ${isAr ? 'تعديل تاريخ تحويل مخزني' : 'Change Transfer Date'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير العميل في فاتورة مبيعات 88" style="font-size: 11px;">
              👥 ${isAr ? 'تعديل العميل في فاتورة' : 'Change Customer on Bill'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="تعديل حساب القيد في أستاذ عام 2026" style="font-size: 11px;">
              📒 ${isAr ? 'تعديل حساب في قيد اليومية' : 'Modify Journal Account'}
            </button>
          </div>
        </div>

        <!-- Impact Results Placeholder -->
        <div id="db-impact-results-container">
          ${_impactResult ? renderImpactResultDetails(_impactResult, isAr) : ''}
        </div>

      </div>
    `;

    // Bind Impact events
    const input = container.querySelector('#db-impact-input');
    const btnRun = container.querySelector('#btn-run-impact');

    const executeImpact = (query) => {
      const q = (query || input.value).trim();
      if (!q) return;
      input.value = q;
      _impactResult = DatabaseExplorerEngine.analyzeTransactionChange(q);
      const resultsContainer = container.querySelector('#db-impact-results-container');
      if (resultsContainer) {
        resultsContainer.innerHTML = renderImpactResultDetails(_impactResult, isAr);
      }
    };

    if (btnRun) btnRun.addEventListener('click', () => executeImpact());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeImpact();
      });
    }

    container.querySelectorAll('.quick-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        executeImpact(btn.getAttribute('data-query'));
      });
    });
  }

  function renderImpactResultDetails(res, isAr) {
    if (!res || !res.family) return '';

    const fam = res.family;
    const safety = res.safety_level;
    const isCritical = safety.id === 'CRITICAL' || safety.id === 'BLOCKED';

    return `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 18px;">
        
        <!-- Header Overview Card -->
        <div style="padding: 18px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); border-inline-start: 4px solid ${safety.color}; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 24px;">🧪</span>
              <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">
                ${escapeHtml(isAr ? fam.name_ar : fam.name_en)} — #${escapeHtml(res.transaction_id)}
              </h3>
              <span class="badge ${safety.badge}" style="font-size: 11px;">
                ${escapeHtml(isAr ? safety.label_ar : safety.label_en)}
              </span>
            </div>
            <div style="font-size: 12.5px; color: var(--ink-soft); line-height: 1.5;">
              📌 <strong>${isAr ? 'طبيعة التعديل:' : 'Change Category:'}</strong> ${escapeHtml(res.change_category_ar)} &nbsp;•&nbsp; 
              <strong>${isAr ? 'الحقل المستهدف:' : 'Target Field:'}</strong> <code>${escapeHtml(res.target_field)}</code>
            </div>
          </div>

          <div style="font-size: 11px; color: var(--ink-soft); background: var(--surface); padding: 4px 10px; border-radius: 4px; border: 1px solid var(--line);">
            🔒 <strong>Source of Truth:</strong> newdatabase2026.sql
          </div>
        </div>

        <!-- BEFORE / AFTER COMPARISON CARD -->
        <div class="card" style="padding: 16px; border: 1px solid var(--line);">
          <strong style="font-size: 13.5px; color: var(--ink); display: block; margin-bottom: 10px;">
            ⚖️ ${isAr ? 'مقارنة القيمة السابقة والمطلوبة (Before / After Delta):' : 'Before / After Delta Comparison:'}
          </strong>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; color: var(--ink-soft); margin-bottom: 4px;">⏮️ ${isAr ? 'القيمة الحالية (Before)' : 'Current Value (Before)'}</div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink); font-family: monospace;">${escapeHtml(res.old_value)}</div>
            </div>

            <div style="padding: 12px; background: rgba(44, 122, 107, 0.05); border: 1px solid var(--teal); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; color: var(--teal); margin-bottom: 4px;">⏭️ ${isAr ? 'القيمة المطلوبة (After)' : 'Requested Value (After)'}</div>
              <div style="font-size: 16px; font-weight: 700; color: var(--teal); font-family: monospace;">${escapeHtml(res.new_value)}</div>
            </div>

            <div style="padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; color: var(--ink-soft); margin-bottom: 4px;">📊 ${isAr ? 'الفارق المحسوب (Delta)' : 'Calculated Delta'}</div>
              <div style="font-size: 16px; font-weight: 700; color: ${res.delta.startsWith('+') ? 'var(--brass-deep)' : 'var(--rust)'}; font-family: monospace;">${escapeHtml(res.delta)}</div>
            </div>
          </div>
        </div>

        <!-- VISUAL LIVE TRANSACTION DEPENDENCY GRAPH -->
        <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--teal);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong style="font-size: 13.5px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
              🌐 مخطط الاعتماديات الحي للحركة (Live Transaction Dependency Graph):
            </strong>
            <span class="badge badge-teal" style="font-size: 10px;">Full 7-Layer Graph</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(res.dependency_graph && res.dependency_graph.graph_nodes ? res.dependency_graph.graph_nodes : []).map(node => `
              <div style="display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 8px 12px; border-inline-start: 3px solid ${node.confidence.badge === 'badge-teal' ? 'var(--teal)' : (node.confidence.badge === 'badge-brass' ? 'var(--brass)' : 'var(--rust)')};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; flex-wrap: wrap; gap: 4px;">
                  <strong style="font-size: 12.5px; color: var(--ink);">
                    ${escapeHtml(isAr ? node.layer_name_ar : node.layer_name_en)} ➔ <code>${escapeHtml(node.table)}</code>
                  </strong>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="badge ${node.confidence.badge}" style="font-size: 9px;">${escapeHtml(node.confidence.id)}</span>
                    <span class="badge badge-secondary" style="font-size: 9px;">Count: ${escapeHtml(node.record_count)}</span>
                  </div>
                </div>
                <div style="font-size: 11.5px; color: var(--ink-soft); font-family: monospace;">
                  └── Relation: <code>${escapeHtml(node.relationship)}</code>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SAFETY BLOCKERS CHECKLIST -->
        <div class="card" style="padding: 16px; border: 1px solid var(--rust); background: rgba(192, 86, 62, 0.03);">
          <strong style="font-size: 13.5px; color: var(--rust); display: block; margin-bottom: 10px;">
            🔴 موانع التعديل وفحوصات الأمان الإلزامية (Change Safety Blockers):
          </strong>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(res.safety_blockers || []).map(b => `
              <div style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 12px; background: var(--paper); border: 1px solid var(--line); border-radius: 4px;">
                <span style="font-size: 16px;">🛡️</span>
                <div>
                  <strong style="font-size: 12px; color: var(--ink); display: block;">${escapeHtml(b.title_ar)}</strong>
                  <span style="font-size: 11.5px; color: var(--ink-soft);">${escapeHtml(b.desc_ar)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4-PART DIAGNOSTIC & TRANSACTIONAL SQL PACKAGE -->
        <div class="card" style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="font-size: 13.5px; color: var(--ink);">
              🧰 ${isAr ? 'حزمة استعلامات الفحص والتعديل المنظمة (4-Part SQL Package):' : '4-Part SQL Package:'}
            </strong>
            <span class="badge badge-teal" style="font-size: 10px;">External Execution Only</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            
            <!-- 1. PREVIEW -->
            <div style="border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
              <div style="padding: 6px 12px; background: var(--paper); border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                <span>1. PREVIEW: فحص السجل الحالي قبل التعديل</span>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${res.sql_package.preview.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('تم نسخ استعلام الفحص', 'success');" style="font-size: 10px; padding: 2px 6px;">📋 Copy</button>
              </div>
              <pre style="margin: 0; padding: 8px 12px; background: #1e1e1e; color: #9cdcfe; font-family: monospace; font-size: 12px; white-space: pre-wrap;"><code>${escapeHtml(res.sql_package.preview)}</code></pre>
            </div>

            <!-- 2. VALIDATION -->
            <div style="border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
              <div style="padding: 6px 12px; background: var(--paper); border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                <span>2. VALIDATION: التحقق من ترابط السجلات والبنود الحالية</span>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${res.sql_package.validation.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('تم نسخ استعلام التحقق', 'success');" style="font-size: 10px; padding: 2px 6px;">📋 Copy</button>
              </div>
              <pre style="margin: 0; padding: 8px 12px; background: #1e1e1e; color: #9cdcfe; font-family: monospace; font-size: 12px; white-space: pre-wrap;"><code>${escapeHtml(res.sql_package.validation)}</code></pre>
            </div>

            <!-- 3. TRANSACTIONAL MODIFICATION -->
            <div style="border: 1px solid var(--rust); border-radius: var(--radius-sm); overflow: hidden;">
              <div style="padding: 6px 12px; background: rgba(192, 86, 62, 0.08); border-bottom: 1px solid var(--rust); font-size: 12px; font-weight: 700; color: var(--rust); display: flex; justify-content: space-between; align-items: center;">
                <span>3. CHANGE: سكريبت التعديل المغلف بكبسولة START TRANSACTION للتنفيذ الخارجي فقط</span>
                <button class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText('${res.sql_package.modification.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'); Toast.show('تم نسخ سكريبت التعديل', 'success');" style="font-size: 10px; padding: 2px 6px;">📋 Copy SQL</button>
              </div>
              <pre style="margin: 0; padding: 10px 12px; background: #1a1a1a; color: #f8f8f2; font-family: monospace; font-size: 12px; white-space: pre-wrap;"><code>${escapeHtml(res.sql_package.modification)}</code></pre>
            </div>

            <!-- 4. VERIFICATION -->
            <div style="border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
              <div style="padding: 6px 12px; background: var(--paper); border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                <span>4. VERIFICATION: التحقق الختامي بعد التعديل</span>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${res.sql_package.verification.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('تم نسخ استعلام التأكيد', 'success');" style="font-size: 10px; padding: 2px 6px;">📋 Copy</button>
              </div>
              <pre style="margin: 0; padding: 8px 12px; background: #1e1e1e; color: #a6e22e; font-family: monospace; font-size: 12px; white-space: pre-wrap;"><code>${escapeHtml(res.sql_package.verification)}</code></pre>
            </div>

          </div>
        </div>

      </div>
    `;
  }



  // =========================================================================
  // TAB 2: DOMAIN & TABLE EXPLORER (406 Tables)
  // =========================================================================
  function renderTablesTab(container, isAr) {
    const meta = DatabaseExplorerEngine.getMetadata();
    const tables = DatabaseExplorerEngine.searchTables(_searchQuery, _activeDomain);

    const domains = [
      { id: '', name_ar: '📁 كل الجداول (406)', name_en: 'All Tables (406)', count: 406 },
      { id: 'DOM-INV', name_ar: '📦 المخزون والأصناف', name_en: 'Inventory', count: 60 },
      { id: 'DOM-ACC', name_ar: '💰 الحسابات و GL', name_en: 'Accounting', count: 33 },
      { id: 'DOM-SALES', name_ar: '🧾 المبيعات والفواتير', name_en: 'Sales', count: 47 },
      { id: 'DOM-PURCHASE', name_ar: '🛒 المشتريات والموردين', name_en: 'Purchasing', count: 35 },
      { id: 'DOM-CRM', name_ar: '👥 العملاء والمندوبين', name_en: 'Customers', count: 22 },
      { id: 'DOM-TREASURY', name_ar: '🏦 النقدية والبنوك', name_en: 'Treasury', count: 14 },
      { id: 'DOM-ASSETS', name_ar: '🏢 الأصول الثابتة', name_en: 'Assets', count: 12 },
      { id: 'DOM-SYS', name_ar: '⚙️ النظام والإعدادات', name_en: 'System & RBAC', count: 34 }
    ];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Domain Filter Chips -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${domains.map(d => `
            <button 
              class="btn btn-sm ${ _activeDomain === d.id ? 'btn-primary' : 'btn-secondary' } db-domain-chip" 
              data-domain="${d.id}"
              style="font-size: 12px; padding: 6px 12px;"
            >
              ${isAr ? d.name_ar : d.name_en}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar -->
        <div>
          <input 
            type="text" 
            id="db-tables-search" 
            class="form-control" 
            placeholder="${isAr ? '🔍 ابحث في أسماء 406 جدول، التصنيف، أو الأعمدة...' : '🔍 Search in 406 tables, domain, or columns...'}" 
            value="${escapeHtml(_searchQuery)}"
            style="font-size: 13px;"
          />
        </div>

        <!-- Tables Grid -->
        <div style="font-size: 12px; color: var(--ink-soft); margin-bottom: -6px;">
          ${isAr ? `يتم عرض ${tables.length} جدول مطابق:` : `Displaying ${tables.length} matching tables:`}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
          ${tables.slice(0, 80).map(t => `
            <div class="card hover-lift btn-open-table-drawer" data-table="${escapeHtml(t.name)}" style="padding: 12px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; border-inline-start: 3px solid var(--teal);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; margin-bottom: 6px;">
                  <strong style="font-family: monospace; font-size: 14px; color: var(--ink); word-break: break-all;">
                    ${escapeHtml(t.name)}
                  </strong>
                  <span class="badge badge-secondary" style="font-size: 10px;">
                    ${t.columns_count || Object.keys(t.columns || {}).length} cols
                  </span>
                </div>

                <div style="font-size: 11px; color: var(--ink-soft); margin-bottom: 4px;">
                  ${escapeHtml(t.domain ? (isAr ? t.domain.name_ar : t.domain.name_en) : 'General')}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 6px; margin-top: 6px;">
                <span style="font-size: 10px; color: var(--ink-soft);">
                  PK: <code>${escapeHtml((t.primary_key || []).join(', ') || 'None')}</code>
                </span>
                ${(t.scripts_count && t.scripts_count > 0) ? `
                  <span style="font-size: 10px; color: var(--teal); font-weight: 700;">
                    🔗 ${t.scripts_count} ${isAr ? 'سكربت' : 'scripts'}
                  </span>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        ${tables.length > 80 ? `
          <div style="text-align: center; color: var(--ink-soft); font-size: 12px; padding: 12px;">
            ${isAr ? 'يتم عرض أول 80 جدول لتسريع الأداء. اكتب في شريط البحث للوصول لأي جدول بالتحديد.' : 'Showing top 80 tables for performance. Refine search query for specific tables.'}
          </div>
        ` : ''}

      </div>
    `;

    // Bind events
    container.querySelectorAll('.db-domain-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeDomain = btn.getAttribute('data-domain');
        renderTablesTab(container, isAr);
      });
    });

    const searchInput = container.querySelector('#db-tables-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        _searchQuery = e.target.value;
        renderTablesTab(container, isAr);
      });
    }

    container.querySelectorAll('.btn-open-table-drawer').forEach(card => {
      card.addEventListener('click', () => {
        const tblName = card.getAttribute('data-table');
        openTableInspector(tblName);
      });
    });
  }

  // =========================================================================
  // TAB 3: COLUMN FINDER
  // =========================================================================
  function renderColumnsTab(container, isAr) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <div>
          <label style="font-size: 13px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 6px;">
            🔍 ${isAr ? 'ابحث عن اسم العمود (Column Name) عبر الـ 406 جدول:' : 'Search Columns across all 406 tables:'}
          </label>
          <div style="display: flex; gap: 10px;">
            <input 
              type="text" 
              id="db-column-search-input" 
              class="form-control" 
              placeholder="${isAr ? 'مثال: product_id, delegate_id, amount, unit_id, convert, serial, tax_value...' : 'e.g. product_id, delegate_id, unit_id, convert...'}" 
              style="font-size: 13px;"
            />
            <button class="btn btn-primary" id="btn-run-col-search">
              🔍 ${isAr ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>

        <div id="db-column-results-box">
          ${_columnSearchResults.length > 0 ? renderColumnResults(_columnSearchResults, isAr) : `
            <div style="padding: 30px; text-align: center; color: var(--ink-soft); font-size: 13px;">
              ${isAr ? 'اكتب اسم العمود واضغط بحث لاستخراج جميع الجداول التي تستخدم هذا الحقل.' : 'Type column name and search to find all occurrences across tables.'}
            </div>
          `}
        </div>

      </div>
    `;

    const input = container.querySelector('#db-column-search-input');
    const btn = container.querySelector('#btn-run-col-search');

    const execSearch = () => {
      const q = input.value.trim();
      if (!q) return;
      _columnSearchResults = DatabaseExplorerEngine.searchColumns(q);
      const box = container.querySelector('#db-column-results-box');
      if (box) box.innerHTML = renderColumnResults(_columnSearchResults, isAr);
    };

    if (btn) btn.addEventListener('click', execSearch);
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') execSearch(); });
  }

  function renderColumnResults(results, isAr) {
    if (results.length === 0) {
      return `<div style="padding: 20px; text-align: center; color: var(--rust); font-size: 13px;">${isAr ? 'لم يتم العثور على أعمدة مطابقة' : 'No matching columns found'}</div>`;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 12px; color: var(--ink-soft); margin-bottom: 4px;">
          ${isAr ? `تم العثور على ${results.length} عمود مطابق:` : `Found ${results.length} matching columns:`}
        </div>
        ${results.slice(0, 100).map(r => `
          <div style="padding: 10px 14px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <code style="font-size: 13px; font-weight: 700; color: var(--teal);">${escapeHtml(r.column_name)}</code>
              <span style="font-size: 11px; color: var(--ink-soft); margin-inline-start: 8px;">(${escapeHtml(r.type)})</span>
              <div style="font-size: 12px; color: var(--ink); margin-top: 2px;">
                Table: <strong style="font-family: monospace; cursor: pointer; text-decoration: underline;" onclick="DatabaseExplorer.openTableInspector('${escapeHtml(r.table_name)}')">${escapeHtml(r.table_name)}</strong>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              ${r.is_primary ? `<span class="badge badge-brass" style="font-size: 10px;">Primary Key</span>` : ''}
              <button class="btn btn-secondary btn-sm" onclick="DatabaseExplorer.openTableInspector('${escapeHtml(r.table_name)}')" style="font-size: 11px; padding: 2px 8px;">
                👁️ ${isAr ? 'فحص الجدول' : 'Inspect Table'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // =========================================================================
  // TAB 4: DATA FLOW MAPS
  // =========================================================================
  function renderDataMapsTab(container, isAr) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Product Data Map -->
        <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--teal);">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
            📦 ${isAr ? 'خريطة تدفق بيانات الصنف والمخزون (Product Data Map):' : 'Product & Stock Data Map:'}
          </h3>
          <div style="padding: 12px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); font-family: monospace; font-size: 13px; line-height: 1.8; color: var(--ink);">
            <strong>products</strong> (Master Card) <br/>
            &nbsp;└── <strong>sizes</strong> (Units, Packs & Prices: convert, pack, purchase_price, selling_price) <br/>
            &nbsp;└── <strong>store_inventory</strong> (Physical Stock per Warehouse) <br/>
            &nbsp;└── <strong>product_qty</strong> (Computed Total Stock View) <br/>
            &nbsp;└── <strong>purchases_details</strong> ➔ <strong>purchases</strong> ➔ <strong>journal</strong> ➔ <strong>gl_trans</strong> <br/>
            &nbsp;└── <strong>bill_details</strong> ➔ <strong>bills</strong> ➔ <strong>journal</strong> ➔ <strong>gl_trans</strong> <br/>
            &nbsp;└── <strong>transfer_details</strong> ➔ <strong>transfers</strong> (Inter-branch Movements)
          </div>
        </div>

        <!-- Sales & Billing Data Map -->
        <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--brass);">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
            🧾 ${isAr ? 'خريطة تدفق دورة المبيعات والتحصيل (Sales & AR Flow):' : 'Sales & Receivables Data Map:'}
          </h3>
          <div style="padding: 12px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); font-family: monospace; font-size: 13px; line-height: 1.8; color: var(--ink);">
            <strong>bills</strong> (Invoice Header: amount, tax_value, total, paid, remain, customer_id, delegate_id) <br/>
            &nbsp;├── <strong>bill_details</strong> (Lines: product_id, quantity, unit_price, total_price) <br/>
            &nbsp;├── <strong>cash_receipt_details</strong> ➔ <strong>accounting</strong> (Cash/Bank Receipts) <br/>
            &nbsp;├── <strong>csutomer_bill</strong> (Consolidated AR View: Invoices + Receipts + Opening Balances) <br/>
            &nbsp;└── <strong>journal</strong> (type_id=45) ➔ <strong>gl_trans</strong> (Debit: Customer / Credit: Sales + VAT + COGS)
          </div>
        </div>

        <!-- Accounting GL Data Map -->
        <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--rust);">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
            💰 ${isAr ? 'خريطة تدفق الأستاذ العام وشجرة الحسابات (General Ledger GL Flow):' : 'General Ledger Flow:'}
          </h3>
          <div style="padding: 12px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); font-family: monospace; font-size: 13px; line-height: 1.8; color: var(--ink);">
            <strong>Operational Transactions</strong> (bills, purchases, accounting, transfers) <br/>
            &nbsp;↓ <br/>
            <strong>journal</strong> (Posting Header: id, type_id, reference, trans_date, memo) <br/>
            &nbsp;↓ <br/>
            <strong>gl_trans</strong> (Ledger Lines: type_no=journal.id, account_id, amount [Sum=0], branch_id) <br/>
            &nbsp;↓ <br/>
            <strong>chart_master</strong> (Account Master: id, name, account_type) ➔ <strong>chart_types</strong> ➔ <strong>chart_class</strong> ➔ <strong>vchart</strong>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // TAB 5: INCIDENT PLAYBOOKS
  // =========================================================================
  function renderIncidentsTab(container, isAr) {
    const playbooks = [
      {
        title_ar: '🚨 مشكلة: عدم تطابق المخزون الفيزيائي مع الحسابات',
        title_en: 'Inventory vs General Ledger Variance',
        steps_ar: [
          'فحص رصيد الصنف في جدول store_inventory ومقارنته بـ product_qty.',
          'فحص فواتير المبيعات والمشتريات غير المرحلة لقيود اليومية (bills without journal).',
          'تشغيل استعلام مقارنة الفواتير مع gl_trans (account_id = 315 / وسيط المخزون).',
          'التحقق من عدم وجود قيود يدوية مباشرة على حساب مراقبة المخزون بالأستاذ العام.'
        ]
      },
      {
        title_ar: '🚨 مشكلة: رصيد العميل غير مطابق لكشف الحساب',
        title_en: 'Customer Balance Discrepancy',
        steps_ar: [
          'استخراج كشف حساب العميل من View csutomer_bill الموحد.',
          'مطابقة إجمالي سندات القبض في cash_receipt_details مع accounting.',
          'فحص الأرصدة الافتتاحية المسجلة في customers.bank و paid_opening_bills.',
          'مطابقة رصيد حساب العميل بالأستاذ العام (gl_trans) مع مديونية الأستاذ المساعد.'
        ]
      },
      {
        title_ar: '🚨 مشكلة: فارق توازن في ميزان المراجعة (Trial Balance Out of Balance)',
        title_en: 'Trial Balance Out of Balance',
        steps_ar: [
          'استخراج القيود غير المتوازنة عبر: SELECT type_no, sum(amount) FROM gl_trans GROUP BY type_no HAVING abs(sum(amount)) > 0.01;',
          'حصر أرقام القيود غير المتوازنة ومطابقتها مع ترويسة journal.',
          'معالجة السطور المفقودة بقيد تسوية معتمد دون حذف القيود التاريخية.'
        ]
      }
    ];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="font-size: 13px; color: var(--ink-soft);">
          ${isAr ? 'أدلة استرشادية للتعامل مع البلاغات الطارئة وفحص السبب الجذري بأمان:' : 'Step-by-step diagnostic workflows for production incidents:'}
        </div>

        ${playbooks.map(pb => `
          <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--rust);">
            <h4 style="font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
              ${escapeHtml(isAr ? pb.title_ar : pb.title_en)}
            </h4>
            <ol style="margin: 0; padding-inline-start: 20px; font-size: 13px; color: var(--ink); line-height: 1.6;">
              ${pb.steps_ar.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ol>
          </div>
        `).join('')}
      </div>
    `;
  }

  // =========================================================================
  // TAB 6: CHANGE & UAT LOG
  // =========================================================================
  function renderChangeLogTab(container, isAr) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Add New Log Form -->
        <div class="card" style="padding: 16px;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 10px 0;">
            ➕ ${isAr ? 'توثيق تعديل بيانات خارجي (UAT / Test Data Change Log):' : 'Document External Data Change:'}
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
            <input type="text" id="log-tbl" class="form-control" placeholder="${isAr ? 'اسم الجدول (مثلاً: sizes)' : 'Table name...'}" style="font-size: 12px;" />
            <input type="text" id="log-record" class="form-control" placeholder="${isAr ? 'معرف السجل (Record ID)' : 'Record ID...'}" style="font-size: 12px;" />
            <input type="text" id="log-reason" class="form-control" placeholder="${isAr ? 'الدافع / سيناريو الاختبار' : 'Reason / Test Case...'}" style="font-size: 12px;" />
          </div>
          <button class="btn btn-primary btn-sm" id="btn-save-change-log">
            💾 ${isAr ? 'حفظ التوثيق' : 'Save Log'}
          </button>
        </div>

        <!-- Logs History -->
        <div class="card" style="padding: 16px;">
          <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 10px;">
            📝 ${isAr ? 'سجل التعديلات الموثقة:' : 'Documented Changes History:'}
          </strong>
          ${_changeLogs.length === 0 ? `
            <p style="font-size: 12px; color: var(--ink-soft); margin: 0;">${isAr ? 'لا توجد تعديلات موثقة بعد.' : 'No change logs recorded yet.'}</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${_changeLogs.map(l => `
                <div style="padding: 10px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 12px; display: flex; justify-content: space-between;">
                  <div>
                    <strong>Table: <code>${escapeHtml(l.table)}</code></strong> • ID: <code>${escapeHtml(l.record_id)}</code> • Reason: ${escapeHtml(l.reason)}
                  </div>
                  <span style="color: var(--ink-soft); font-size: 11px;">${new Date(l.date).toLocaleDateString()}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;

    const btnSave = container.querySelector('#btn-save-change-log');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const tbl = container.querySelector('#log-tbl').value.trim();
        const rec = container.querySelector('#log-record').value.trim();
        const reason = container.querySelector('#log-reason').value.trim();
        if (!tbl) return;

        _changeLogs.unshift({ table: tbl, record_id: rec, reason: reason, date: new Date().toISOString() });
        saveLocalLogs();
        Toast.show(isAr ? 'تم حفظ التوثيق بنجاح' : 'Change logged successfully', 'success');
        renderChangeLogTab(container, isAr);
      });
    }
  }

  // =========================================================================
  // TAB 7: AI DATABASE ASSISTANT
  // =========================================================================
  function renderAIChatTab(container, isAr) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <div style="padding: 14px; background: rgba(44, 122, 107, 0.05); border: 1px solid var(--teal); border-radius: var(--radius-sm);">
          <strong style="color: var(--teal); font-size: 13px; display: block; margin-bottom: 4px;">
            🤖 ${isAr ? 'مساعد الذكاء الاصطناعي لقاعدة البيانات (Aware of newdatabase2026.sql):' : 'AI Database Assistant:'}
          </strong>
          <p style="font-size: 12.5px; color: var(--ink); margin: 0; line-height: 1.5;">
            ${isAr ? 'اسأل أي سؤال عن هيكلية الجداول، العلاقات، أو أثر التعديلات المحاسبية والمستودعية. يعتمد الذكاء الاصطناعي حصراً على قاعدة البيانات الحالية.' : 'Ask questions regarding table structures, foreign keys, or change impact. Answers are verified against newdatabase2026.sql.'}
          </p>
        </div>

        <div>
          <textarea id="db-ai-question-input" class="form-control" rows="3" placeholder="${isAr ? 'اسأل مثلاً: إيه الجداول اللي بتتأثر لو غيرت bill_details؟ أو فين بيانات الصنف؟...' : 'Ask e.g. What tables are affected when modifying bill_details? Where is product UoM stored?...'}" style="font-size: 13px;"></textarea>
          <button class="btn btn-primary" id="btn-submit-db-ai" style="margin-top: 10px;">
            🧠 ${isAr ? 'إرسال السؤال للذكاء الاصطناعي' : 'Ask AI'}
          </button>
        </div>

        <div id="db-ai-chat-output" style="display: none; padding: 16px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 13px; line-height: 1.6;">
          <div id="db-ai-output-text"></div>
        </div>

      </div>
    `;

    const btnSubmit = container.querySelector('#btn-submit-db-ai');
    const input = container.querySelector('#db-ai-question-input');
    const box = container.querySelector('#db-ai-chat-output');
    const output = container.querySelector('#db-ai-output-text');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', async () => {
        const q = input.value.trim();
        if (!q) return;

        box.style.display = 'block';
        output.innerHTML = `<div style="text-align:center; padding: 20px;"><div class="spinner" style="display:inline-block;"></div><div style="margin-top:8px; color:var(--teal);">${isAr ? 'جاري استشارة الذكاء الاصطناعي مع قاعدة البيانات الحالية...' : 'Consulting AI with current schema...'}</div></div>`;

        try {
          const prompt = DatabaseExplorerEngine.buildAIDatabasePrompt(q, _selectedTable);
          const res = await AIService.ask('sql_explainer', prompt);
          output.innerHTML = typeof renderMarkdown === 'function' ? renderMarkdown(res.text) : `<pre style="white-space:pre-wrap;">${escapeHtml(res.text)}</pre>`;
        } catch (err) {
          output.innerHTML = `<div style="color:var(--rust);">${isAr ? 'تعذر الاتصال بالذكاء الاصطناعي: ' + err.message : 'AI error: ' + err.message}</div>`;
        }
      });
    }
  }

  // =========================================================================
  // TABLE INSPECTOR DRAWER / MODAL
  // =========================================================================
  function openTableInspector(tableName) {
    const meta = DatabaseExplorerEngine.getMetadata();
    if (!meta || !meta.tables || !meta.tables[tableName]) return;

    _selectedTable = tableName;
    const tbl = meta.tables[tableName];
    const isAr = I18n.getLang() === 'ar';

    const modal = document.getElementById('db-table-detail-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-dialog animate-scale-in" style="max-width: 850px; width: 95%; max-height: 85vh; display: flex; flex-direction: column; background: var(--surface); border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.25); overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--paper);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">🗄️</span>
            <div>
              <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink); font-family: monospace;">
                ${escapeHtml(tbl.name)}
              </h3>
              <div style="font-size: 11px; color: var(--ink-soft);">
                ${escapeHtml(tbl.domain ? (isAr ? tbl.domain.name_ar : tbl.domain.name_en) : 'General')} • ${escapeHtml(tbl.type ? (isAr ? tbl.type.name_ar : tbl.type.name_en) : 'Table')}
              </div>
            </div>
          </div>
          <button class="btn-icon" onclick="document.getElementById('db-table-detail-modal').style.display='none'" style="font-size: 18px; border: none; background: none; cursor: pointer;">✕</button>
        </div>

        <!-- Body -->
        <div style="padding: 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Columns List -->
          <div>
            <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 8px;">
              📋 ${isAr ? 'أعمدة الجدول والخصائص (Columns & Data Types):' : 'Table Columns & Data Types:'}
            </strong>
            <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--line); border-radius: var(--radius-sm);">
              <table class="table" style="width: 100%; font-size: 12px; margin: 0;">
                <thead>
                  <tr style="background: var(--paper);">
                    <th>${isAr ? 'اسم العمود' : 'Column Name'}</th>
                    <th>${isAr ? 'النوع' : 'Type'}</th>
                    <th>${isAr ? 'يقبل Null' : 'Nullable'}</th>
                    <th>${isAr ? 'المفتاح' : 'Key'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.keys(tbl.columns || {}).map(cName => {
                    const col = tbl.columns[cName];
                    const isPK = (tbl.primary_key || []).includes(cName);
                    return `
                      <tr>
                        <td><code style="font-weight: 600; color: var(--teal);">${escapeHtml(cName)}</code></td>
                        <td>${escapeHtml(col.type)}</td>
                        <td>${col.nullable ? 'Yes' : 'No'}</td>
                        <td>${isPK ? '<span class="badge badge-brass" style="font-size: 9px;">PK</span>' : (cName.endsWith('_id') ? '<span class="badge badge-secondary" style="font-size: 9px;">FK</span>' : '—')}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Relationships -->
          ${(tbl.relationships && tbl.relationships.length > 0) ? `
            <div>
              <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 6px;">
                🔗 ${isAr ? 'العلاقات والارتباطات المستنتجة (Relationships):' : 'Relationships:'}
              </strong>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${tbl.relationships.map(rel => `
                  <div style="font-size: 12px; padding: 6px 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
                    <code>${escapeHtml(rel.column)}</code> ➔ <strong>${escapeHtml(rel.refTable)}.${escapeHtml(rel.refColumn)}</strong>
                    <span class="badge badge-teal" style="font-size: 9px; margin-inline-start: 6px;">${escapeHtml(rel.confidence)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Attached Historical Scripts -->
          ${(tbl.scripts && tbl.scripts.length > 0) ? `
            <div>
              <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 6px;">
                🛠️ ${isAr ? 'السكربتات التاريخية التي تستخدم هذا الجدول:' : 'Historical Troubleshooting Scripts:'}
              </strong>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${tbl.scripts.map(s => `
                  <div style="font-size: 12px; padding: 6px 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
                    <span>🛠️ ${escapeHtml(isAr ? s.title_ar : s.title_en)}</span>
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('db-table-detail-modal').style.display='none'; Router.go('scripts');" style="font-size: 10px; padding: 2px 6px;">
                      ${isAr ? 'فتح في مكتبة السكربتات' : 'Open in Toolkit'}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Read-only SELECT Probe -->
          <div>
            <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 6px;">
              🔍 ${isAr ? 'استعلام فحص وقراءة عينة من السجلات (Read-only Probe):' : 'Read-only Probe Query:'}
            </strong>
            <pre style="margin: 0; padding: 8px 12px; background: #1e1e1e; color: #9cdcfe; font-family: monospace; font-size: 12px; border-radius: var(--radius-sm);"><code>SELECT * FROM \`${escapeHtml(tbl.name)}\` LIMIT 10;</code></pre>
          </div>

        </div>

        <!-- Footer -->
        <div style="padding: 10px 20px; background: var(--paper); border-top: 1px solid var(--line); display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('db-table-detail-modal').style.display='none'">
            ${isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    `;
  }

  return {
    init,
    render,
    openTableInspector
  };
})();

if (typeof module !== 'undefined') module.exports = DatabaseExplorer;
