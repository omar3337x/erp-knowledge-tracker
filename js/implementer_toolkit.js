/**
 * js/implementer_toolkit.js
 * ERP Implementer Toolkit — UAT Scenarios Generator & Data Migration Checklists.
 * 0ms Instant local render with CSV export capabilities.
 */

const ImplementerToolkit = (function () {

  const UAT_TEST_CASES = [
    { id: 'UAT-01', module_id: 'MOD-1', category: 'المخزون', scenario_ar: 'إنشاء صنف جديد وتقييم طريقة Automated FIFO', scenario_en: 'Create new Product with Automated FIFO Costing', expected_ar: 'الإنشاء بنجاح وتوجيه حـ/ المخزون وحـ/ COGS تلقائياً', expected_en: 'Success with automated Inventory & COGS account mapping', status: 'Passed' },
    { id: 'UAT-02', module_id: 'MOD-1', category: 'المخزون', scenario_ar: 'محاولة صرف صنف بالسالب عند إيقاف السحب بالسالب', scenario_en: 'Attempt negative stock issue when negative stock is disabled', expected_ar: 'ظهور رسالة خطأ تمنع إتمام الحركة', expected_en: 'System blocks transaction with warning message', status: 'Passed' },
    { id: 'UAT-03', module_id: 'MOD-2', category: 'الحسابات', scenario_ar: 'ترحيل قيد افتتاحي متوازن بدليل الحسابات', scenario_en: 'Post balanced Opening Balance journal entry in COA', expected_ar: 'قبول القيد دون وجود فرق بين المدين والدائن', expected_en: 'Entry accepted with zero Debit/Credit variance', status: 'Passed' },
    { id: 'UAT-04', module_id: 'MOD-3', category: 'المشتريات', scenario_ar: 'توليد فاتورة مورد بمطابقة ثلاثية (3-Way Matching)', scenario_en: 'Generate Vendor Invoice with 3-Way Match validation', expected_ar: 'مطابقة الأسعار والكميات مع إذن الاستلام وأمر الشراء', expected_en: 'Price & quantity match PO and Goods Receipt Note', status: 'Passed' },
    { id: 'UAT-05', module_id: 'MOD-4', category: 'المبيعات', scenario_ar: 'اعتماد أمر مبيعات بحد ائتماني متجاوز للعميل', scenario_en: 'Confirm Sales Order exceeding customer Credit Limit', expected_ar: 'حظر أمر المبيعات وتحويله لاعتماد مدير المبيعات', expected_en: 'Order blocked and sent for Sales Manager approval', status: 'Passed' }
  ];

  const MIGRATION_CHECKLIST = [
    { id: 'MIG-01', step_ar: 'تجهيز دليل الحسابات المستهدف (Chart of Accounts)', step_en: 'Chart of Accounts (COA) Structure & Codes', required: true },
    { id: 'MIG-02', step_ar: 'تجهيز دليل الأصناف والرموز الشريطية (Item Master Data)', step_en: 'Item Master & Barcodes Data Clean-up', required: true },
    { id: 'MIG-03', step_ar: 'تجهيز كروت العملاء والموردين وتحديد الفئات الضريبية', step_en: 'Customer & Vendor Master Data with Tax IDs', required: true },
    { id: 'MIG-04', step_ar: 'تجهيز الأرصدة الافتتاحية للمخزون (Opening Inventory Valuation)', step_en: 'Opening Inventory On-Hand Balances & Costing', required: true },
    { id: 'MIG-05', step_ar: 'تجهيز ميزان المراجعة الافتتاحي (Opening Trial Balance)', step_en: 'Opening Trial Balance & G/L Balances', required: true }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🛠️ ${isAr ? 'حزمة أدوات استشاري ومطبق الـ ERP' : 'ERP Implementer Toolkit'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'قوالب سيناريوهات اختبارات القبول (UAT) وقوائم نقل وتجهيز البيانات (Data Migration)' : 'User Acceptance Testing (UAT) templates & Data Migration checklists'}
          </small>
        </div>

        <div>
          <button class="btn btn-primary" id="toolkit-export-csv-btn">
            📥 ${isAr ? 'تصدير سيناريوهات UAT لـ CSV' : 'Export UAT Scenarios (CSV)'}
          </button>
        </div>
      </div>

      <!-- Section Tabs -->
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

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportUATCSV();
      });
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
