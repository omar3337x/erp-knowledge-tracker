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
  // TAB 0: TRANSACTION DELETION ANALYZER (New Core Feature)
  // =========================================================================
  let _deletionResult = null;
  let _selectedTxType = 'SALES_RETURN';

  function renderDeletionTab(container, isAr) {
    if (!_deletionResult) {
      _deletionResult = DatabaseExplorerEngine.analyzeTransactionDeletion('عايز أحذف حركة مرتجع مبيعات رقم 12345', 'SALES_RETURN', '12345');
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Input & Quick Selectors -->
        <div>
          <label style="font-size: 13px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 8px;">
            🗑️ ${isAr ? 'ما الحركة التشغيلية التي ترغب في تحليل دورة حذفها وإلغائها؟' : 'Which transaction lifecycle do you want to analyze for safe deletion?'}
          </label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input 
              type="text" 
              id="db-deletion-input" 
              class="form-control" 
              placeholder="${isAr ? 'اكتب مثلاً: عايز أحذف مرتجع مبيعات رقم 12345، أو احذف فاتورة مبيعات 554...' : 'e.g. Delete sales return 12345, delete sales invoice 882...'}" 
              value="${escapeHtml(_deletionResult ? _deletionResult.query : '')}"
              style="flex: 1; min-width: 300px; font-size: 13px;"
            />
            <button class="btn btn-primary" id="btn-run-deletion" style="font-size: 13px; font-weight: 600;">
              🔍 ${isAr ? 'تحليل دورة الحركة ومصفوفة الحذف' : 'Analyze Deletion Lifecycle'}
            </button>
          </div>

          <!-- Quick Transaction Type Chips -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
            <span style="font-size: 11px; color: var(--ink-soft); align-self: center;">${isAr ? 'أنواع الحركات:' : 'Transaction Types:'}</span>
            <button class="btn btn-sm ${ _selectedTxType === 'SALES_RETURN' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="SALES_RETURN" data-id="12345" style="font-size: 11px;">
              🧾 ${isAr ? 'مرتجع مبيعات (Sales Return)' : 'Sales Return'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'SALES_INVOICE' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="SALES_INVOICE" data-id="8841" style="font-size: 11px;">
              🧾 ${isAr ? 'فاتورة مبيعات (Sales Invoice)' : 'Sales Invoice'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'PURCHASE_RETURN' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="PURCHASE_RETURN" data-id="3120" style="font-size: 11px;">
              🛒 ${isAr ? 'مرتجع مشتريات (Purchase Return)' : 'Purchase Return'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'PURCHASE_INVOICE' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="PURCHASE_INVOICE" data-id="5420" style="font-size: 11px;">
              🛒 ${isAr ? 'فاتورة مشتريات (Purchase Invoice)' : 'Purchase Invoice'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'STOCK_TRANSFER' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="STOCK_TRANSFER" data-id="901" style="font-size: 11px;">
              📦 ${isAr ? 'تحويل مخزني (Stock Transfer)' : 'Stock Transfer'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'RECEIPT_PAYMENT' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="RECEIPT_PAYMENT" data-id="7712" style="font-size: 11px;">
              🏦 ${isAr ? 'سند قبض / صرف (Receipt/Payment)' : 'Receipt/Payment'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'PHYSICAL_INVENTORY' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="PHYSICAL_INVENTORY" data-id="44" style="font-size: 11px;">
              📋 ${isAr ? 'محضر جرد (Stock Count)' : 'Stock Count'}
            </button>
            <button class="btn btn-sm ${ _selectedTxType === 'MANUAL_JOURNAL' ? 'btn-primary' : 'btn-secondary' } quick-tx-chip" data-type="MANUAL_JOURNAL" data-id="2830" style="font-size: 11px;">
              📒 ${isAr ? 'قيد يومية يدوي (Manual Journal)' : 'Manual Journal'}
            </button>
          </div>
        </div>

        <!-- Deletion Analysis Results Container -->
        <div id="db-deletion-results-container">
          ${_deletionResult ? renderDeletionResultDetails(_deletionResult, isAr) : ''}
        </div>

      </div>
    `;

    // Bind events
    const input = container.querySelector('#db-deletion-input');
    const btnRun = container.querySelector('#btn-run-deletion');

    const execDeletionAnalysis = (query, forcedType, forcedId) => {
      const q = (query || input.value).trim();
      if (!q && !forcedType) return;
      _deletionResult = DatabaseExplorerEngine.analyzeTransactionDeletion(q, forcedType, forcedId);
      _selectedTxType = _deletionResult.map.type_key;
      input.value = _deletionResult.query || `حذف ${_deletionResult.map.name_ar} رقم ${_deletionResult.transaction_id}`;
      
      const resContainer = container.querySelector('#db-deletion-results-container');
      if (resContainer) {
        resContainer.innerHTML = renderDeletionResultDetails(_deletionResult, isAr);
        bindDeletionResultEvents(resContainer, isAr);
      }
    };

    if (btnRun) btnRun.addEventListener('click', () => execDeletionAnalysis());
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') execDeletionAnalysis(); });

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

  function renderDeletionResultDetails(res, isAr) {
    if (!res || !res.map) return '';

    const m = res.map;
    const txId = res.transaction_id;

    return `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Title Card -->
        <div style="padding: 20px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); border-inline-start: 4px solid var(--rust); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">🗑️</span>
              <h3 style="font-size: 17px; font-weight: 700; margin: 0; color: var(--ink);">
                ${escapeHtml(isAr ? m.name_ar : m.name_en)} — #${escapeHtml(txId)}
              </h3>
              <span class="badge badge-rust" style="font-size: 11px;">
                ⚡ Risk Level: ${escapeHtml(res.risk_level)}
              </span>
            </div>
            <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
              📌 <strong>${isAr ? 'الترويسة الأساسية:' : 'Header:'}</strong> <code>${escapeHtml(m.header_table)}</code> (id=${escapeHtml(txId)}) &nbsp;•&nbsp; 
              <strong>${isAr ? 'جدول التفاصيل:' : 'Details:'}</strong> <code>${escapeHtml(m.details_table)}</code> &nbsp;•&nbsp;
              ${m.journal_type_id ? `<strong>${isAr ? 'نوع القيد في journal:' : 'Journal type_id:'}</strong> <code>type_id=${m.journal_type_id}</code>` : ''}
            </div>
          </div>

          <div style="font-size: 11px; color: var(--ink-soft); background: var(--surface); padding: 5px 12px; border-radius: 4px; border: 1px solid var(--line);">
            🔒 <strong>Source of Truth:</strong> newdatabase2026.sql (406 Tables)
          </div>
        </div>

        <!-- 7-LAYER STRUCTURED DELETION & RELATIONSHIPS TREE -->
        <div style="display: flex; flex-direction: column; gap: 14px;">

          <!-- LAYER 1: CORE TRANSACTION -->
          <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--teal);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
                🧾 1. CORE TRANSACTION (الترويسة والتفاصيل الأساسية)
              </strong>
              <span class="badge badge-teal" style="font-size: 10px;">🟢 CONFIRMED FROM CURRENT SCHEMA</span>
            </div>
            
            <div style="font-family: monospace; font-size: 12.5px; background: var(--paper); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.8;">
              <div><strong>${escapeHtml(m.header_table)}</strong> (Header)</div>
              <div style="color: var(--ink-soft);">└── <code>id = ${escapeHtml(txId)}</code> <span class="badge badge-teal" style="font-size: 9px; margin-inline-start: 6px;">🟢 Confirmed</span></div>
              <div style="margin-top: 6px;"><strong>${escapeHtml(m.details_table)}</strong> (Details)</div>
              <div style="color: var(--ink-soft);">└── <code>${escapeHtml(m.details_fk)} = ${escapeHtml(txId)}</code> <span class="badge badge-teal" style="font-size: 9px; margin-inline-start: 6px;">🟢 Confirmed</span></div>
            </div>
          </div>

          <!-- LAYER 2: INVENTORY & BATCHES -->
          <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--brass);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
                📦 2. INVENTORY & BATCH MOVEMENTS (المخزون وحركات الباتشات)
              </strong>
              <span class="badge badge-brass" style="font-size: 10px;">🟡 INFERRED & CANDIDATE KEYS</span>
            </div>
            
            <div style="font-family: monospace; font-size: 12.5px; background: var(--paper); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.8;">
              <div><strong>general_table</strong> (Operational Stock Movement)</div>
              <div style="color: var(--ink-soft);">└── Relation: <code>link_id = ${escapeHtml(txId)}</code> OR <code>details_id IN (SELECT id FROM ${escapeHtml(m.details_table)} WHERE ${escapeHtml(m.details_fk)}=${escapeHtml(txId)})</code></div>
              <div style="color: var(--brass-deep); font-size: 11px; margin-top: 2px;">
                ⚠️ <em>Rule: ${isAr ? 'لا تفترض نوع محدد (type) كحقيقة مطلقة بدون مطابقة سجلات المخزن الحية.' : 'Do NOT assume static type=2 without verifying actual link_id & details_id.'}</em>
              </div>

              ${m.patches_discovery ? `
                <div style="margin-top: 8px;"><strong>patches</strong> (Batch Tracking / Cost)</div>
                <div style="color: var(--ink-soft);">└── Relation: <code>link_id = ${escapeHtml(txId)}</code> <span class="badge badge-brass" style="font-size: 9px; margin-inline-start: 6px;">🟡 Inferred Candidate</span></div>
                <div style="color: var(--ink-soft); font-size: 11px;">⚠️ <em>${isAr ? 'لا يتم الحذف إلا إذا أثبت الفحص وجود سجلات باتشات مرتبطة بالمرتجع.' : 'Not deletable unless probe proves linked batch records.'}</em></div>
              ` : ''}
            </div>
          </div>

          <!-- LAYER 3: ACCOUNTING & GENERAL LEDGER -->
          <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--brass-deep);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
                💰 3. ACCOUNTING & GENERAL LEDGER (الأستاذ العام والقيود المحاسبية)
              </strong>
              <span class="badge badge-rust" style="font-size: 10px;">🟠 HISTORICAL SCRIPT SUPPORTED</span>
            </div>
            
            <div style="font-family: monospace; font-size: 12.5px; background: var(--paper); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.8;">
              <div><strong>journal</strong> (Posting Header)</div>
              <div style="color: var(--ink-soft);">└── <code>reference = ${escapeHtml(txId)}</code> AND <code>type_id = ${m.journal_type_id || 'N/A'}</code> <span class="badge badge-rust" style="font-size: 9px; margin-inline-start: 6px;">🟠 Historical Script</span></div>
              <div style="margin-top: 6px;"><strong>gl_trans</strong> (Double-Entry Ledger Lines)</div>
              <div style="color: var(--ink-soft);">└── <code>type_no = Journal ID</code> AND <code>type_id = ${m.gl_trans_type_id || m.journal_type_id || 'N/A'}</code></div>
              <div style="color: var(--teal); font-weight: 600; margin-top: 4px;">
                └── GL Balance Condition: <code>SUM(gl_trans.amount) = 0</code> (Debit = Credit) <span class="badge badge-teal" style="font-size: 9px;">🟢 Safe Condition</span>
              </div>
            </div>
          </div>

          <!-- LAYER 4: REPORTING & DASHBOARD -->
          ${m.reporting_table ? `
            <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--teal);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
                  📊 4. REPORTING & DASHBOARD SUMMARIES (إحصائيات المبيعات والداشبورد)
                </strong>
                <span class="badge badge-teal" style="font-size: 10px;">🟢 CONFIRMED FROM CURRENT SCHEMA</span>
              </div>
              
              <div style="font-family: monospace; font-size: 12.5px; background: var(--paper); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.8;">
                <div><strong>${escapeHtml(m.reporting_table)}</strong> (Daily Summaries)</div>
                <div style="color: var(--ink-soft);">└── <code>${escapeHtml(m.reporting_fk)} = ${escapeHtml(txId)}</code> <span class="badge badge-teal" style="font-size: 9px; margin-inline-start: 6px;">🟢 Confirmed</span></div>
                <div style="color: var(--ink-soft); font-size: 11px;">${isAr ? 'الإجراء: حذف السجل التجميعي لتصحيح تقارير صافي المبيعات والأرباح.' : 'Action: Delete summary record to recalculate daily sales aggregates.'}</div>
              </div>
            </div>
          ` : ''}

          <!-- LAYER 5: ORIGINAL LINKED DOCUMENT -->
          ${m.original_doc_link ? `
            <div class="card" style="padding: 16px; border-inline-start: 4px solid var(--ink-soft);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
                  🔗 5. ORIGINAL LINKED DOCUMENT (المستند الأصلي المرتبط)
                </strong>
                <span class="badge badge-secondary" style="font-size: 10px;">🛡️ READ-ONLY (DO NOT DELETE)</span>
              </div>
              
              <div style="font-family: monospace; font-size: 12.5px; background: var(--paper); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.8;">
                <div><strong>${escapeHtml(m.original_doc_link.table)}</strong> (${escapeHtml(m.original_doc_link.label_ar)})</div>
                <div style="color: var(--ink-soft);">└── <code>valid_bill_id -> bills.id</code> <span class="badge badge-teal" style="font-size: 9px; margin-inline-start: 6px;">🟢 Confirmed</span></div>
                <div style="color: var(--rust); font-size: 11.5px; font-weight: 600; margin-top: 4px;">
                  🚫 <em>${isAr ? 'ممنوع حذف الفاتورة الأصلية. العلاقة تُستخدم للتحقق من أثر الإلغاء على الرصيد فقط.' : 'NEVER delete original sales bill. Link is used strictly for impact verification.'}</em>
                </div>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- RISK & SAFETY BLOCKERS CHECKLIST -->
        <div class="card" style="padding: 18px; border: 1px solid var(--rust); background: rgba(192, 86, 62, 0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong style="font-size: 14px; color: var(--rust); display: flex; align-items: center; gap: 8px;">
              🔴 موانع الحذف وشروط السلامة الإلزامية (Deletion Safety Blockers):
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

        <!-- 8-Stage Deletion Sequence Roadmap -->
        <div class="card" style="padding: 16px;">
          <strong style="font-size: 13.5px; color: var(--ink); display: block; margin-bottom: 12px;">
            🧭 ${isAr ? 'مسار المراحل الثماني لإثبات وحذف الحركة (8-Stage Deletion Pipeline):' : '8-Stage Deletion Pipeline:'}
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

        <!-- Transactional Modification SQL Wrapper -->
        <div class="card" style="padding: 16px; border: 1px solid rgba(192, 86, 62, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <strong style="font-size: 13.5px; color: var(--rust); display: block;">
                ⚠️ ${isAr ? 'سكريبت الحذف الخارجي المشروط (External Transactional SQL Wrapper):' : 'External Transactional SQL:'}
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
UNION ALL
SELECT '${m.details_table}' AS tbl, count(*) AS cnt FROM \`${m.details_table}\` WHERE ${m.details_fk} = ${txId}
${m.inventory_discovery ? `UNION ALL\nSELECT 'general_table' AS tbl, count(*) AS cnt FROM \`general_table\` WHERE link_id = ${txId} OR details_id IN (SELECT id FROM \`${m.details_table}\` WHERE ${m.details_fk} = ${txId})` : ''}
${m.journal_type_id !== undefined ? `UNION ALL\nSELECT 'journal' AS tbl, count(*) AS cnt FROM \`journal\` WHERE reference = ${txId} AND type_id = ${m.journal_type_id}\nUNION ALL\nSELECT 'gl_trans' AS tbl, count(*) AS cnt FROM \`gl_trans\` WHERE type_id = ${m.gl_trans_type_id || m.journal_type_id} AND type_no IN (SELECT id FROM journal WHERE reference = ${txId})` : ''};</code></pre>
          </div>
        </div>

      </div>
    `;
  }

  function bindDeletionResultEvents(container, isAr) {
    const btnToggleSql = container.querySelector('#btn-toggle-mod-sql');
    const boxSql = container.querySelector('#mod-sql-wrapper-box');
    if (btnToggleSql && boxSql) {
      btnToggleSql.addEventListener('click', () => {
        const isHidden = boxSql.style.display === 'none';
        boxSql.style.display = isHidden ? 'block' : 'none';
      });
    }

    const btnPostVerify = container.querySelector('#btn-run-post-verify');
    const boxPostVerify = container.querySelector('#post-verify-box');
    if (btnPostVerify && boxPostVerify) {
      btnPostVerify.addEventListener('click', () => {
        boxPostVerify.style.display = 'block';
        Toast.show(isAr ? 'تم توليد استعلامات الفحص الختامي' : 'Verification queries generated', 'success');
      });
    }
  }

  // =========================================================================
  // TAB 1: CHANGE IMPACT ANALYZER (Main Feature)
  // =========================================================================
  function renderImpactTab(container, isAr) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Input & Quick Scenarios -->
        <div>
          <label style="font-size: 13px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 8px;">
            🔍 ${isAr ? 'ما التعديل أو السيناريو الذي تريد دراسته واختباره؟' : 'What data change or test scenario do you want to analyze?'}
          </label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input 
              type="text" 
              id="db-impact-input" 
              class="form-control" 
              placeholder="${isAr ? 'اكتب باللغة الطبيعية: مثلاً: عايز أغير وحدة صنف، أو عايز أغير سعر شراء صنف، أو عايز أغير رصيد عميل...' : 'e.g. Change product unit, change purchase price, modify customer balance, edit invoice...'}" 
              style="flex: 1; min-width: 300px; font-size: 13px;"
            />
            <button class="btn btn-primary" id="btn-run-impact" style="font-size: 13px; font-weight: 600;">
              🧪 ${isAr ? 'تحليل الأثر والمخاطر' : 'Analyze Impact'}
            </button>
          </div>

          <!-- Quick Scenario Buttons -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
            <span style="font-size: 11px; color: var(--ink-soft); align-self: center;">${isAr ? 'أمثلة سريعة:' : 'Quick Examples:'}</span>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير وحدة صنف" style="font-size: 11px;">
              📦 ${isAr ? 'تغيير وحدة صنف (كرتونة / قطعة)' : 'Change Product Unit'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير سعر شراء صنف" style="font-size: 11px;">
              💰 ${isAr ? 'تعديل سعر شراء وتكلفة الصنف' : 'Change Purchase Cost'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أغير رصيد عميل" style="font-size: 11px;">
              👥 ${isAr ? 'تعديل رصيد ومديونية عميل' : 'Modify Customer Balance'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أعدل فاتورة مبيعات" style="font-size: 11px;">
              🧾 ${isAr ? 'تعديل أصناف أو كمية فاتورة مبيعات' : 'Edit Sales Invoice'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="عايز أعدل رصيد المخزن" style="font-size: 11px;">
              🏢 ${isAr ? 'تعديل رصيد المخزون بالمستودع' : 'Adjust Stock Balance'}
            </button>
            <button class="btn btn-secondary btn-sm quick-scenario-btn" data-query="تعديل قيد يومية" style="font-size: 11px;">
              📒 ${isAr ? 'تعديل قيد في الأستاذ العام GL' : 'Modify GL Journal'}
            </button>
          </div>
        </div>

        <!-- Impact Results Placeholder -->
        <div id="db-impact-results-container">
          ${_impactResult ? renderImpactResultDetails(_impactResult, isAr) : `
            <div style="padding: 40px; text-align: center; border: 2px dashed var(--line); border-radius: var(--radius-sm); background: var(--paper);">
              <span style="font-size: 36px; display: block; margin-bottom: 10px;">🧪</span>
              <strong style="font-size: 15px; color: var(--ink); display: block; margin-bottom: 6px;">
                ${isAr ? 'اختر سيناريو أو اكتب طلب التعديل أعلاه لبدء الفحص' : 'Enter a change request or click an example above to run the impact analyzer'}
              </strong>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 0; max-width: 600px; margin: 0 auto; line-height: 1.5;">
                ${isAr ? 'سيقوم المحرك بربط طلبك بالجداول الـ 406 الحالية، وتحديد نوع البيانات (Master Data مقابل Transactions)، واستخراج الأثر المحاسبي والمخزني وقائمة التحقق الاسترشادية.' : 'The engine maps your request to the 406 verified tables, distinguishes Master Data vs Transactions, and generates read-only verification queries.'}
              </p>
            </div>
          `}
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
      _impactResult = DatabaseExplorerEngine.analyzeChangeIntent(q);
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
    if (!res || !res.scenario) {
      return `
        <div class="card" style="padding: 24px; text-align: center; border-inline-start: 4px solid var(--rust);">
          <p style="font-size: 13px; color: var(--rust); margin: 0;">
            ${isAr ? 'لم يتم العثور على جداول مطابقة في قاعدة البيانات الحالية (newdatabase2026.sql).' : 'No matching tables or entities confirmed from current schema.'}
          </p>
        </div>
      `;
    }

    const sc = res.scenario;
    const isCritical = sc.risk_level === 'CRITICAL';
    const isHigh = sc.risk_level === 'HIGH';
    const riskColor = isCritical ? 'var(--rust)' : (isHigh ? 'var(--brass-deep)' : 'var(--teal)');
    const riskBadge = isCritical ? 'badge-rust' : (isHigh ? 'badge-brass' : 'badge-teal');

    return `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Entity & Risk Header -->
        <div style="padding: 16px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); border-inline-start: 4px solid ${riskColor}; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <h3 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--ink);">
                ${escapeHtml(isAr ? sc.entity_ar : sc.entity_en)}
              </h3>
              <span class="badge ${riskBadge}" style="font-size: 11px;">
                ⚡ Risk: ${escapeHtml(sc.risk_level)}
              </span>
              <span class="badge badge-teal" style="font-size: 10px;">
                ${escapeHtml(res.schema_status.label_ar)}
              </span>
            </div>
            <div style="font-size: 12px; color: var(--ink-soft);">
              📌 <strong>${isAr ? 'الجدول الرئيسي المستهدف:' : 'Primary Target Table:'}</strong> <code style="font-size: 13px; font-weight: 700; color: var(--teal);">${escapeHtml(sc.main_table)}</code>
            </div>
          </div>

          <div style="font-size: 11px; color: var(--ink-soft); background: var(--surface); padding: 4px 10px; border-radius: 4px; border: 1px solid var(--line);">
            🔒 <strong>Source of Truth:</strong> newdatabase2026.sql
          </div>
        </div>

        <!-- Master Data vs Historical Transaction Classification -->
        <div style="padding: 14px; background: rgba(44, 122, 107, 0.04); border: 1px solid var(--teal); border-radius: var(--radius-sm);">
          <strong style="font-size: 13px; color: var(--teal); display: block; margin-bottom: 4px;">
            ⚖️ ${isAr ? 'تصنيف طبيعة التغيير (Master Data vs Transaction):' : 'Change Nature Classification:'}
          </strong>
          <p style="font-size: 13px; color: var(--ink); margin: 0; line-height: 1.5;">
            ${escapeHtml(isAr ? sc.change_nature_desc_ar : sc.change_nature_desc_en)}
          </p>
        </div>

        <!-- Impact Grid (Inventory & Accounting) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
          
          <!-- Inventory Impact -->
          <div style="padding: 14px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">
            <strong style="font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              📦 ${isAr ? 'الأثر المخزني والمستودعي:' : 'Inventory & Stock Impact:'}
            </strong>
            <p style="font-size: 12.5px; color: var(--ink); margin: 0 0 8px 0; line-height: 1.5;">
              ${escapeHtml(isAr ? sc.inventory_impact_ar : sc.inventory_impact_en)}
            </p>
            ${(sc.related_inventory_tables && sc.related_inventory_tables.length > 0) ? `
              <div style="font-size: 11px; color: var(--ink-soft);">
                <strong>${isAr ? 'الجداول المتأثرة بالمخزون:' : 'Affected Inventory Tables:'}</strong>
                ${sc.related_inventory_tables.map(t => `<code style="margin-inline-end: 4px;">${escapeHtml(t)}</code>`).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Accounting GL Impact -->
          <div style="padding: 14px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">
            <strong style="font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              💰 ${isAr ? 'الأثر المحاسبي والأستاذ العام (GL):' : 'Accounting & GL Impact:'}
            </strong>
            <p style="font-size: 12.5px; color: var(--ink); margin: 0 0 8px 0; line-height: 1.5;">
              ${escapeHtml(isAr ? sc.accounting_impact_ar : sc.accounting_impact_en)}
            </p>
            ${(sc.related_transaction_tables && sc.related_transaction_tables.length > 0) ? `
              <div style="font-size: 11px; color: var(--ink-soft);">
                <strong>${isAr ? 'جداول القيود والحركات المرتبطة:' : 'Related Transaction Tables:'}</strong>
                ${sc.related_transaction_tables.map(t => `<code style="margin-inline-end: 4px;">${escapeHtml(t)}</code>`).join('')}
              </div>
            ` : ''}
          </div>

        </div>

        <!-- Safeguards & "Do NOT Modify Directly" Warnings -->
        <div style="padding: 14px; background: rgba(192, 86, 62, 0.05); border: 1px solid rgba(192, 86, 62, 0.3); border-radius: var(--radius-sm); border-inline-start: 4px solid var(--rust);">
          <strong style="font-size: 13px; color: var(--rust); display: block; margin-bottom: 6px;">
            ⚠️ ${isAr ? 'المحاذير وما يُمنع تعديله مباشرة (Safeguards & Prohibitions):' : 'Safeguards & What NOT to Modify Directly:'}
          </strong>
          <ul style="margin: 0; padding-inline-start: 20px; font-size: 12.5px; color: var(--ink); line-height: 1.6;">
            ${(sc.safeguards_ar || []).map(sfg => `<li>${escapeHtml(sfg)}</li>`).join('')}
          </ul>
        </div>

        <!-- Read-Only Diagnostic SQL Queries -->
        ${(sc.read_only_queries && sc.read_only_queries.length > 0) ? `
          <div class="card" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                🧰 ${isAr ? 'استعلامات الفحص والتحقق التشخيصية (Read-Only Diagnostic Queries):' : 'Read-Only Diagnostic Queries:'}
              </strong>
              <span class="badge badge-teal" style="font-size: 10px;">100% Safe (SELECT only)</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${sc.read_only_queries.map((q, idx) => `
                <div style="border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
                  <div style="padding: 6px 12px; background: var(--paper); border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                    <span>#${idx + 1}: ${escapeHtml(q.title_ar)}</span>
                    <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${q.sql.replace(/\n/g, ' ').replace(/'/g, "\\'")}'); Toast.show('${isAr ? 'تم نسخ الاستعلام' : 'Query copied'}', 'success');" style="font-size: 11px; padding: 2px 6px;">
                      📋 ${isAr ? 'نسخ الاستعلام' : 'Copy'}
                    </button>
                  </div>
                  <pre style="margin: 0; padding: 10px; background: #1e1e1e; color: #9cdcfe; font-family: monospace; font-size: 12px; white-space: pre-wrap; line-height: 1.5;"><code>${escapeHtml(q.sql)}</code></pre>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 10-Step Investigation Plan -->
        <div class="card" style="padding: 16px;">
          <strong style="font-size: 13px; color: var(--ink); display: block; margin-bottom: 10px;">
            📋 ${isAr ? 'خطة وخريطة العمل المقترحة قبل التطبيق (10-Step Investigation Plan):' : '10-Step Investigation Plan:'}
          </strong>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${(res.investigation_plan_10_steps || []).map(step => `
              <div style="font-size: 12.5px; color: var(--ink); padding: 6px 10px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); line-height: 1.4;">
                ${escapeHtml(step)}
              </div>
            `).join('')}
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
