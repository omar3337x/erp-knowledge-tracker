/**
 * js/implementer_toolkit.js
 * 🛠️ AI Implementer Toolkit — AI ERP Implementation Assistant + Static Fallback.
 */

const ImplementerToolkit = (function () {

  const UAT_TEST_CASES = [
    { id: 'UAT-01', module_id: 'MOD-1', category: 'المخزون', scenario_ar: 'اختبار تقييم Automated FIFO وحظر السحب بالسالب', scenario_en: 'Automated FIFO Costing & Negative Stock Prohibition Test', expected_ar: 'المنع الفوري وحفظ التكلفة مع إشعار تحذير للمستودع', expected_en: 'System blocks transaction with warning message', status: 'Passed' }
  ];

  const MIGRATION_CHECKLIST = [
    { id: 'MIG-01', step_ar: 'MOD-1: تجهيز كروت الأصناف، فئات التقييم، وتوزيع المستودعات (Item Master)', step_en: 'MOD-1: Item Master Data, Valuation Classes & Warehouses', required: true }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🛠️ ${isAr ? 'مساعد واستشاري تنفيذ مشاريع الـ ERP بالـ AI' : 'AI ERP Implementation Assistant'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'توليد سيناريوهات UAT، خطة نقل البيانات، مصفوفة الصلاحيات، وسجل المخاطر بالـ AI' : 'AI-generated UAT scenarios, Data Migration plans, Risk Registers & Role matrices'}
          </small>
        </div>

        <div>
          <button class="btn btn-primary" id="toolkit-export-csv-btn">
            📥 ${isAr ? 'تصدير سيناريوهات UAT لـ CSV' : 'Export UAT Scenarios (CSV)'}
          </button>
        </div>
      </div>

      <!-- Scope Form Card -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
          <div style="flex:1; min-width:200px;">
            <label class="field-label" style="font-size:12px; font-weight:700;">${isAr ? 'الموديول المستهدف' : 'Target Module'}</label>
            <select id="toolkit-mod-select" class="field" style="margin:0;">
              ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
            </select>
          </div>

          <div style="flex:2; min-width:260px;">
            <label class="field-label" style="font-size:12px; font-weight:700;">${isAr ? 'نوع الشركة والنطاق (Scope)' : 'Company Type & Project Scope'}</label>
            <input type="text" id="toolkit-scope-input" class="field" placeholder="${isAr ? 'مثال: شركة تصنيع وتجزئة بـ 50 مستخدم في مصر والدول العربية...' : 'e.g. Manufacturing & Retail company with 50 users...'}" style="margin:0;">
          </div>
        </div>

        <button class="btn btn-primary" id="toolkit-ai-gen-btn" style="width:100%;">
          🧠 ${isAr ? 'توليد خطة التنفيذ واختبارات القبول بالـ AI' : 'Generate AI Implementation Plan'}
        </button>
      </div>

      <!-- Tabs -->
      <div style="display:flex; gap:10px; margin-bottom:20px; border-bottom:1px solid var(--line); padding-bottom:10px;">
        <button class="btn btn-ghost active-tab-btn" id="tab-uat-btn">🧪 ${isAr ? 'اختبارات القبول (UAT Cases)' : 'UAT Test Cases'}</button>
        <button class="btn btn-ghost" id="tab-mig-btn">📦 ${isAr ? 'قائمة تجهيز البيانات (Data Migration)' : 'Migration Checklist'}</button>
      </div>

      <div id="toolkit-tab-content">
        ${renderUATSection()}
      </div>
    `;

    bindEvents(container);
  }

  function renderUATSection() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>${isAr ? 'الموديول' : 'Module'}</th>
                <th>${isAr ? 'سيناريو الاختبار (UAT Scenario)' : 'Test Scenario'}</th>
                <th>${isAr ? 'النتيجة المتوقعة (Expected Result)' : 'Expected Result'}</th>
                <th>${isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              ${UAT_TEST_CASES.map(tc => `
                <tr>
                  <td><strong style="font-family:var(--font-mono); font-size:12px;">${tc.id}</strong></td>
                  <td><span class="badge badge-status-learning">${tc.category}</span></td>
                  <td><strong>${isAr ? tc.scenario_ar : tc.scenario_en}</strong></td>
                  <td style="color:var(--ink-soft);">${isAr ? tc.expected_ar : tc.expected_en}</td>
                  <td><span class="badge badge-status-mastered">Passed</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderMigrationSection() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="padding:20px;">
        <h3 style="margin-bottom:16px;">${isAr ? 'قائمة مراجعة تجهيز ونقل البيانات الأولية (Master Data Clean-up)' : 'Data Migration Readiness Checklist'}</h3>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${MIGRATION_CHECKLIST.map(item => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:var(--line-soft); border-radius:var(--radius-sm);">
              <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="chk-${item.id}" checked style="width:18px; height:18px; cursor:pointer;">
                <label for="chk-${item.id}" style="margin:0; cursor:pointer; font-weight:600;">
                  ${isAr ? item.step_ar : item.step_en}
                </label>
              </div>
              <span class="badge badge-priority-high">${item.id}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#toolkit-ai-gen-btn');
    const modSelect = container.querySelector('#toolkit-mod-select');
    const scopeInput = container.querySelector('#toolkit-scope-input');
    const exportBtn = container.querySelector('#toolkit-export-csv-btn');
    const uatTabBtn = container.querySelector('#tab-uat-btn');
    const migTabBtn = container.querySelector('#tab-mig-btn');
    const tabContent = container.querySelector('#toolkit-tab-content');

    if (uatTabBtn && migTabBtn && tabContent) {
      uatTabBtn.addEventListener('click', () => {
        uatTabBtn.classList.add('active-tab-btn');
        migTabBtn.classList.remove('active-tab-btn');
        tabContent.innerHTML = renderUATSection();
      });

      migTabBtn.addEventListener('click', () => {
        migTabBtn.classList.add('active-tab-btn');
        uatTabBtn.classList.remove('active-tab-btn');
        tabContent.innerHTML = renderMigrationSection();
      });
    }

    if (aiBtn && scopeInput && tabContent) {
      aiBtn.addEventListener('click', async () => {
        const text = scopeInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        tabContent.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('implementer', text || 'Full implementation blueprint & UAT cases', { moduleId: modId });

        if (res.success && res.text) {
          tabContent.innerHTML = `
            <div class="card" style="border-inline-start:4px solid var(--brass);">
              <h3 style="margin-bottom:12px;">🛠️ ${isAr ? 'خطة التنفيذ وسيناريوهات UAT المتخصصة بالـ AI' : 'AI ERP Implementation Plan & UAT'}</h3>
              <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          tabContent.innerHTML = renderUATSection();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => exportUATCSV());
    }
  }

  function exportUATCSV() {
    let csv = 'ID,Module,Scenario,Expected Result,Status\n';
    UAT_TEST_CASES.forEach(tc => {
      csv += `"${tc.id}","${tc.category}","${tc.scenario_en}","${tc.expected_en}","${tc.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ERP_UAT_Test_Cases_${Date.now()}.csv`;
    link.click();
    UI.toast(I18n.getLang() === 'ar' ? 'تم تصدير ملف الـ CSV بنجاح' : 'UAT Scenarios CSV exported', 'success');
  }

  return { render };
})();
