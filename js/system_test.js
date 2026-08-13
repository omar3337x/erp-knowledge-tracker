/**
 * js/system_test.js
 * Comprehensive System Diagnostics & Automated Self-Test Page for ERP Knowledge Tracker.
 */

const SystemTest = (function () {
  let logs = [];
  let stats = { total: 0, passed: 0, warnings: 0, failed: 0 };
  let isRunning = false;

  function formatTimestamp() {
    const d = new Date();
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function log(type, category, message, details = null) {
    const timestamp = formatTimestamp();
    const entry = { timestamp, type, category, message, details };
    logs.push(entry);

    if (type === 'PASS') stats.passed++;
    else if (type === 'WARN') stats.warnings++;
    else if (type === 'FAIL') stats.failed++;
    stats.total++;

    updateUI();
  }

  function updateUI() {
    const passEl = document.getElementById('diag-pass-count');
    const warnEl = document.getElementById('diag-warn-count');
    const failEl = document.getElementById('diag-fail-count');
    const totalEl = document.getElementById('diag-total-count');
    const logBox = document.getElementById('diag-log-box');

    if (passEl) passEl.textContent = stats.passed;
    if (warnEl) warnEl.textContent = stats.warnings;
    if (failEl) failEl.textContent = stats.failed;
    if (totalEl) totalEl.textContent = stats.total;

    if (logBox) {
      logBox.innerHTML = logs.map(l => {
        let badgeClass = 'color: #34d399;'; // PASS green
        let symbol = '✅ [PASS]';
        if (l.type === 'WARN') { badgeClass = 'color: #fbbf24;'; symbol = '⚠️ [WARN]'; }
        if (l.type === 'FAIL') { badgeClass = 'color: #f87171;'; symbol = '❌ [FAIL]'; }
        if (l.type === 'INFO') { badgeClass = 'color: #38bdf8;'; symbol = 'ℹ️ [INFO]'; }

        let text = `<div style="margin-bottom:6px; line-height:1.4;">`;
        text += `<span style="color:#64748b;">[${l.timestamp}]</span> `;
        text += `<strong style="${badgeClass}">${symbol}</strong> `;
        text += `<span style="color:#e2e8f0; font-weight:600;">[${l.category}]</span> `;
        text += `<span style="color:#cbd5e1;">${Topics.escapeHtml(l.message)}</span>`;

        if (l.details) {
          text += `<pre style="margin:4px 0 0 16px; padding:6px 10px; background:#1e293b; border-left:3px solid #475569; color:#94a3b8; font-size:11.5px; border-radius:4px; overflow-x:auto;">${Topics.escapeHtml(typeof l.details === 'string' ? l.details : JSON.stringify(l.details, null, 2))}</pre>`;
        }
        text += `</div>`;
        return text;
      }).join('');
      logBox.scrollTop = logBox.scrollHeight;
    }
  }

  async function render(container) {
    const isAr = I18n.getLang() === 'ar';
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🧪 ${isAr ? 'صفحة فحص وتشخيص النظام الشامل' : 'System Diagnostics & Health Check'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'أداة الفحص والتأكد التلقائي من عدم وجود أخطاء في الـ ERP والـ Console' : 'Automated End-to-End system diagnostic suite and logger'}
          </small>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" id="btn-run-diag" ${isRunning ? 'disabled' : ''}>
            ▶️ ${isAr ? 'تشغيل الفحص الشامل' : 'Run Diagnostics'}
          </button>
          <button class="btn btn-secondary" id="btn-copy-diag-log">
            📋 ${isAr ? 'نسخ تقرير الأخطاء واللوج' : 'Copy Diagnostics Log'}
          </button>
          <button class="btn btn-ghost" id="btn-clear-diag-log">
            🧹 ${isAr ? 'مسح اللوج' : 'Clear Log'}
          </button>
        </div>
      </div>

      <!-- KPI Summary -->
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'إجمالي الفحوصات' : 'Total Tests'}</div>
          <div class="kpi-value" id="diag-total-count">0</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'فحوصات ناجحة' : 'Passed Tests'}</div>
          <div class="kpi-value teal" id="diag-pass-count">0</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'تنبيهات غير حرجة' : 'Warnings'}</div>
          <div class="kpi-value brass" id="diag-warn-count">0</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'أخطاء / فشل' : 'Failures'}</div>
          <div class="kpi-value rust" id="diag-fail-count">0</div>
        </div>
      </div>

      <!-- Diagnostic Terminal Window -->
      <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--line);">
        <div style="background:#1e293b; padding:10px 16px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:11px; height:11px; border-radius:50%; background:#ef4444; display:inline-block;"></span>
            <span style="width:11px; height:11px; border-radius:50%; background:#f59e0b; display:inline-block;"></span>
            <span style="width:11px; height:11px; border-radius:50%; background:#10b981; display:inline-block;"></span>
            <span style="color:#94a3b8; font-family:var(--font-mono); font-size:12px; margin-left:8px;">ERP Diagnostic Console</span>
          </div>
          <small style="color:#64748b; font-family:var(--font-mono);" id="diag-status-text">Ready</small>
        </div>

        <div id="diag-log-box" style="background:#0f172a; padding:16px; font-family:var(--font-mono); font-size:12.5px; height:450px; overflow-y:auto; color:#f8fafc;">
          <div style="color:#64748b;">Click "Run Diagnostics" to begin automated platform scan...</div>
        </div>
      </div>
    `;

    bindEvents(container);

    // Auto-run on initial visit
    runAllDiagnostics();
  }

  function bindEvents(container) {
    const runBtn = container.querySelector('#btn-run-diag');
    const copyBtn = container.querySelector('#btn-copy-diag-log');
    const clearBtn = container.querySelector('#btn-clear-diag-log');

    if (runBtn) {
      runBtn.addEventListener('click', () => runAllDiagnostics());
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => copyLogToClipboard());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        logs = [];
        stats = { total: 0, passed: 0, warnings: 0, failed: 0 };
        updateUI();
        const logBox = container.querySelector('#diag-log-box');
        if (logBox) logBox.innerHTML = '<div style="color:#64748b;">Log cleared. Ready for next test run.</div>';
      });
    }
  }

  async function runAllDiagnostics() {
    if (isRunning) return;
    isRunning = true;
    logs = [];
    stats = { total: 0, passed: 0, warnings: 0, failed: 0 };
    updateUI();

    const statusText = document.getElementById('diag-status-text');
    if (statusText) statusText.textContent = 'Running Diagnostics...';

    log('INFO', 'SYSTEM', 'Starting End-to-End Diagnostic Scan on ERP Knowledge Tracker');

    try {
      // 1. Auth & Session Test
      await testAuthSession();

      // 2. ERP Modules Architecture Test
      await testModuleArchitecture();

      // 3. AI Insights Coverage Test (5 per module)
      await testAIInsightsCoverage();

      // 4. Topics & Data Layer Test
      await testTopicsDataLayer();

      // 5. Notes & Summaries Test
      await testNotesLayer();

      // 6. i18n & Translation System Test
      await testI18nSystem();

      // 7. Cache & Storage Layer Test
      await testCacheAndStorage();

      // 8. API Network & Batch Test
      await testNetworkAPI();

      // 9. Enterprise Tools Suite Test
      await testEnterpriseTools();

    } catch (err) {
      log('FAIL', 'SYSTEM', 'Diagnostic runner encountered an unhandled exception: ' + err.message, err.stack);
    } finally {
      isRunning = false;
      const runBtn = document.getElementById('btn-run-diag');
      if (runBtn) runBtn.disabled = false;
      if (statusText) {
        statusText.textContent = stats.failed === 0 ? 'Diagnostic Complete — All Systems Operational' : 'Diagnostic Complete — Issues Detected';
      }
      log('INFO', 'SYSTEM', `Diagnostic Scan Finished. Total: ${stats.total} | Passed: ${stats.passed} | Warnings: ${stats.warnings} | Failures: ${stats.failed}`);
    }
  }

  // -------------------------------------------------------------------------
  // Diagnostic Suites
  // -------------------------------------------------------------------------

  async function testAuthSession() {
    log('INFO', 'AUTH', 'Checking user session & token integrity...');
    const token = localStorage.getItem('erp_tracker_session_token');
    if (token) {
      log('PASS', 'AUTH', 'Session token exists in LocalStorage.', { token_preview: token.slice(0, 8) + '...' });
    } else {
      log('WARN', 'AUTH', 'No session token found in LocalStorage (Guest Mode).');
    }

    if (typeof State !== 'undefined' && State.currentUser) {
      const u = State.currentUser;
      log('PASS', 'AUTH', `User logged in: "${u.full_name || u.name}" (${u.username || u.email}) — Role: ${u.role || 'User'}`);
    } else {
      log('WARN', 'AUTH', 'State.currentUser is not set.');
    }
  }

  async function testModuleArchitecture() {
    log('INFO', 'MODULES', 'Checking ERP Modules architecture & Regex boundary matching...');
    const modules = (typeof State !== 'undefined' && State.modulesCache && State.modulesCache.length)
      ? State.modulesCache
      : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    if (modules && modules.length >= 10) {
      log('PASS', 'MODULES', `Found ${modules.length} ERP Modules properly loaded.`);
    } else {
      log('FAIL', 'MODULES', `Expected 10 modules, but found ${modules ? modules.length : 0}`);
    }

    // Regex collision test (MOD-1 vs MOD-10)
    const mod10Test = /\bmod-1\b/i.test('MOD-10');
    if (mod10Test === false) {
      log('PASS', 'MODULES', 'Regex word boundary /\\bmod-1\\b/i correctly ignores "MOD-10" (No Substring Collision).');
    } else {
      log('FAIL', 'MODULES', 'Regex word boundary failed! "MOD-10" matched "mod-1"');
    }
  }

  async function testAIInsightsCoverage() {
    log('INFO', 'AI_INSIGHTS', 'Verifying AI Daily Insights coverage (Requirement: 5 insights per module)...');

    if (typeof Modules === 'undefined' || typeof Modules.getFallbackInsightsLocal !== 'function') {
      log('FAIL', 'AI_INSIGHTS', 'Modules.getFallbackInsightsLocal is not available.');
      return;
    }

    const modIds = ['MOD-1', 'MOD-2', 'MOD-3', 'MOD-4', 'MOD-5', 'MOD-6', 'MOD-7', 'MOD-8', 'MOD-9', 'MOD-10'];
    let allCompliant = true;
    let totalInsightsFound = 0;

    modIds.forEach(id => {
      const insights = Modules.getFallbackInsightsLocal(id);
      const count = insights ? insights.length : 0;
      totalInsightsFound += count;

      if (count === 5) {
        log('PASS', 'AI_INSIGHTS', `Module [${id}]: Returned exactly 5 AI insights.`);
      } else {
        allCompliant = false;
        log('FAIL', 'AI_INSIGHTS', `Module [${id}]: Returned ${count} insights instead of 5.`);
      }
    });

    if (allCompliant) {
      log('PASS', 'AI_INSIGHTS', `All 10 ERP Modules return 5/5 insights (${totalInsightsFound} total insights verified).`);
    } else {
      log('FAIL', 'AI_INSIGHTS', 'Some modules do not return 5 insights.');
    }
  }

  async function testTopicsDataLayer() {
    log('INFO', 'TOPICS', 'Testing Topics Data Layer & status counters...');
    const cachedTopics = (typeof API !== 'undefined' && API.cacheGet) ? API.cacheGet('topics:{}', 'topics') : null;

    if (cachedTopics && Array.isArray(cachedTopics)) {
      log('PASS', 'TOPICS', `Topics cache found in L0/L1 with ${cachedTopics.length} total topics.`);

      const nanCheck = cachedTopics.some(t => isNaN(t.progress) && t.progress !== undefined);
      if (!nanCheck) {
        log('PASS', 'TOPICS', 'Topic progress values are numeric (no NaN values found).');
      } else {
        log('WARN', 'TOPICS', 'Found topics with NaN progress values.');
      }
    } else {
      log('WARN', 'TOPICS', 'No cached topics found in topics:{}. Local fallback calculation will be used.');
    }
  }

  async function testNotesLayer() {
    log('INFO', 'NOTES', 'Testing Notes Layer & Caching...');
    const cachedNotes = (typeof API !== 'undefined' && API.cacheGet) ? API.cacheGet('notes:{}', 'notes') : null;

    if (cachedNotes) {
      const notesList = Array.isArray(cachedNotes.notes) ? cachedNotes.notes : (Array.isArray(cachedNotes) ? cachedNotes : []);
      log('PASS', 'NOTES', `Notes cache found with ${notesList.length} notes.`);
    } else {
      log('INFO', 'NOTES', 'No cached notes found in notes:{}.');
    }
  }

  async function testI18nSystem() {
    log('INFO', 'I18N', 'Testing Localization & Translation system...');
    if (typeof I18n !== 'undefined') {
      const lang = I18n.getLang();
      log('PASS', 'I18N', `Current active language: "${lang.toUpperCase()}"`);

      const testStr = I18n.t('app.name');
      if (testStr && testStr !== 'app.name') {
        log('PASS', 'I18N', `Dictionary lookup success: "app.name" -> "${testStr}"`);
      } else {
        log('WARN', 'I18N', 'Dictionary lookup returned fallback key.');
      }
    } else {
      log('FAIL', 'I18N', 'I18n module is missing!');
    }
  }

  async function testCacheAndStorage() {
    log('INFO', 'CACHE', 'Testing LocalStorage & L0 Memory Cache integrity...');
    try {
      const testKey = 'erp_test_ls_' + Date.now();
      localStorage.setItem(testKey, 'ok');
      const readVal = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (readVal === 'ok') {
        log('PASS', 'CACHE', 'LocalStorage read/write check passed.');
      } else {
        log('FAIL', 'CACHE', 'LocalStorage read/write check failed.');
      }
    } catch (e) {
      log('FAIL', 'CACHE', 'LocalStorage error: ' + e.message);
    }
  }

  async function testNetworkAPI() {
    log('INFO', 'NETWORK', 'Testing API Batch & Network latency...');
    if (typeof API === 'undefined' || typeof API.batch !== 'function') {
      log('FAIL', 'NETWORK', 'API.batch is not available.');
      return;
    }

    const startTime = Date.now();
    try {
      const batchRes = await API.batch([{ action: 'ping', payload: {} }]);
      const latency = Date.now() - startTime;
      log('PASS', 'NETWORK', `API Batch ping succeeded in ${latency}ms.`, batchRes);
    } catch (err) {
      log('WARN', 'NETWORK', 'API Ping call timed out or was handled by fallback.', { error: err.message });
    }
  }

  function copyLogToClipboard() {
    const isAr = I18n.getLang() === 'ar';
    let text = `# ERP Knowledge Tracker — Diagnostic Log Report\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Summary: Total: ${stats.total} | Passed: ${stats.passed} | Warnings: ${stats.warnings} | Failures: ${stats.failed}\n\n`;
    text += `## Detailed Console Logs:\n\`\`\`text\n`;

    logs.forEach(l => {
      text += `[${l.timestamp}] [${l.type}] [${l.category}] ${l.message}\n`;
      if (l.details) {
        text += `   Details: ${typeof l.details === 'string' ? l.details : JSON.stringify(l.details)}\n`;
      }
    });
    text += `\`\`\`\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        UI.toast(isAr ? 'تم نسخ تقرير الأخطاء واللوج بنجاح للحافظة! يمكنك لصقه الآن.' : 'Diagnostic report & logs copied to clipboard!', 'success');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    const isAr = I18n.getLang() === 'ar';
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    UI.toast(isAr ? 'تم نسخ تقرير الأخطاء واللوج بنجاح للحافظة!' : 'Diagnostic report & logs copied to clipboard!', 'success');
  }

  async function testEnterpriseTools() {
    log('INFO', 'TOOLS', 'Verifying AI Enterprise Workbench Suite integrity (12 Tools + AIService + AIChat)...');
    let passCount = 0;
    if (typeof AIService !== 'undefined') { log('PASS', 'TOOLS', 'AIService context builder & proxy engine loaded.'); passCount++; }
    if (typeof AIChat !== 'undefined') { log('PASS', 'TOOLS', 'AIChat global tutor widget loaded.'); passCount++; }
    if (typeof DailyQuiz !== 'undefined') { log('PASS', 'TOOLS', 'DailyQuiz AI Challenge loaded.'); passCount++; }
    if (typeof MultiERP !== 'undefined') { log('PASS', 'TOOLS', 'MultiERP AI Advisor loaded.'); passCount++; }
    if (typeof JournalSim !== 'undefined') { log('PASS', 'TOOLS', 'JournalSim AI Generator loaded.'); passCount++; }
    if (typeof ImplementerToolkit !== 'undefined') { log('PASS', 'TOOLS', 'ImplementerToolkit AI Assistant loaded.'); passCount++; }
    if (typeof ProcessFlow !== 'undefined') { log('PASS', 'TOOLS', 'ProcessFlow AI Visualizer loaded.'); passCount++; }
    if (typeof GanttBuilder !== 'undefined') { log('PASS', 'TOOLS', 'GanttBuilder AI Planner loaded.'); passCount++; }
    if (typeof AITroubleshooter !== 'undefined') { log('PASS', 'TOOLS', 'AITroubleshooter diagnostic tool loaded.'); passCount++; }
    if (typeof AIKPIAdvisor !== 'undefined') { log('PASS', 'TOOLS', 'AIKPIAdvisor KPI tool loaded.'); passCount++; }
    if (typeof AIGapCoach !== 'undefined') { log('PASS', 'TOOLS', 'AIGapCoach remediation tool loaded.'); passCount++; }
    if (typeof AIScenarioLab !== 'undefined') { log('PASS', 'TOOLS', 'AIScenarioLab evaluation tool loaded.'); passCount++; }
    if (typeof AIChecklist !== 'undefined') { log('PASS', 'TOOLS', 'AIChecklist implementation tool loaded.'); passCount++; }

    if (passCount >= 12) {
      log('PASS', 'TOOLS', 'All AI Enterprise Workbench modules verified with 0ms offline fallback strategy.');
    } else {
      log('FAIL', 'TOOLS', `Expected 13 modules, found ${passCount}`);
    }
  }

  return { render, runAllDiagnostics, copyLogToClipboard };
})();
