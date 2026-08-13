/**
 * js/implementer_toolkit.js
 * Comprehensive ERP Implementer Toolkit across ALL 10 ERP Modules.
 * UAT Test Cases & Data Migration Readiness Checklists.
 * 0ms Instant local render with CSV export capabilities.
 */

const ImplementerToolkit = (function () {

  const UAT_TEST_CASES = [
    { id: 'UAT-01', module_id: 'MOD-1', category: 'المخزون', scenario_ar: 'اختبار تقييم Automated FIFO وحظر السحب بالسالب', scenario_en: 'Automated FIFO Costing & Negative Stock Prohibition Test', expected_ar: 'المنع الفوري وحفظ التكلفة مع إشعار تحذير للمستودع', expected_en: 'System blocks transaction with warning message', status: 'Passed' },
    { id: 'UAT-02', module_id: 'MOD-2', category: 'الحسابات', scenario_ar: 'اختبار توازن القيد الافتتاحي وفروق العملات غير المحققة', scenario_en: 'Opening Balance Journal Balancing & Unrealized FX Revaluation', expected_ar: 'قبول القيد المتوازن وتصنيف أرباح/خسائر العملة بقائمة الدخل', expected_en: 'Journal accepted with zero variance and proper FX classification', status: 'Passed' },
    { id: 'UAT-03', module_id: 'MOD-3', category: 'المشتريات', scenario_ar: 'اختبار المطابقة الثلاثية 3-Way Matching وفاتورة المورد', scenario_en: '3-Way Matching Validation (PO vs GRN vs Vendor Invoice)', expected_ar: 'الرفض التلقائي للسداد عند وجود اختلاف بالسعر أو الكمية', expected_en: 'Automated hold on payment if price/qty variance exceeds tolerance', status: 'Passed' },
    { id: 'UAT-04', module_id: 'MOD-4', category: 'المبيعات', scenario_ar: 'حظر أمر المبيعات عند تجاوز الحد الائتماني للعميل', scenario_en: 'Credit Limit Checking on Sales Order Confirmation', expected_ar: 'حظر التسليم وتحويل الأمر إلى موافقة المدير المالي', expected_en: 'Order locked and escalated for Financial Director approval', status: 'Passed' },
    { id: 'UAT-05', module_id: 'MOD-5', category: 'الموارد البشرية', scenario_ar: 'احتساب مسير الرواتب الشهري وترحيل القيد للـ G/L', scenario_en: 'Monthly Payroll Run Computation & Automatic G/L Posting', expected_ar: 'خصم التأمينات والضرائب وتوزيع الصافي بحسابات البنك', expected_en: 'Accurate net salary calculation & G/L journal generation', status: 'Passed' },
    { id: 'UAT-06', module_id: 'MOD-6', category: 'التصنيع', scenario_ar: 'انفجار قائمة المكونات (BOM Explosion) وصرف الخامات للمصنع', scenario_en: 'BOM Explosion & Production Work Order Raw Material Issue', expected_ar: 'خصم المواد الخام وإثبات الإنتاج التام بالتكلفة المعيارية', expected_en: 'Raw materials deducted and finished goods received at standard cost', status: 'Passed' },
    { id: 'UAT-07', module_id: 'MOD-7', category: 'المشاريع', scenario_ar: 'تسجيل ساعات العمل (Timesheets) واحتساب ربحية المشروع', scenario_en: 'Timesheet Billing & Project Milestone Revenue Recognition', expected_ar: 'ربط التكاليف بالمراحل واحتساب نسبة الإنجاز والربحية', expected_en: 'Costs allocated to WBS with accurate POC revenue recognition', status: 'Passed' },
    { id: 'UAT-08', module_id: 'MOD-8', category: 'الأصول والظروف', scenario_ar: 'تشغيل الإهلاك الشهري التلقائي واستبعاد أصل مكهّن', scenario_en: 'Automated Monthly Depreciation Run & Fixed Asset Disposal', expected_ar: 'خفض الرصيد الدفتري وتسجيل أرباح/خسائر الاستبعاد', expected_en: 'Depreciation posted & gain/loss recognized on disposal', status: 'Passed' },
    { id: 'UAT-09', module_id: 'MOD-9', category: 'الجودة والخدمات', scenario_ar: 'فحص شحنة مشتريات وتحويل التالف لمخزن الحجر الصحي', scenario_en: 'Quality Inspection Sampling & Quarantine Warehouse Transfer', expected_ar: 'حظر الصرف وحجز الكميات الفاسدة لتسويتها مع المورد', expected_en: 'Defective items quarantined and blocked from sales allocation', status: 'Passed' },
    { id: 'UAT-10', module_id: 'MOD-10', category: 'القانونية والامتثال', scenario_ar: 'فحص تعارض الصلاحيات (SoD Analysis) وتوليد التوقيع الرقمي', scenario_en: 'Segregation of Duties (SoD) Audit & Contract E-Signature', expected_ar: 'حظر الصلاحيات المتعارضة وأرشفة العقد برمز تشفير', expected_en: 'Conflicting roles blocked and contract archived with e-signature', status: 'Passed' }
  ];

  const MIGRATION_CHECKLIST = [
    { id: 'MIG-01', step_ar: 'MOD-1: تجهيز كروت الأصناف، فئات التقييم، وتوزيع المستودعات (Item Master)', step_en: 'MOD-1: Item Master Data, Valuation Classes & Warehouses', required: true },
    { id: 'MIG-02', step_ar: 'MOD-2: مراجعة دليل الحسابات المستهدف وميزان المراجعة الافتتاحي (COA & Trial Balance)', step_en: 'MOD-2: Target Chart of Accounts & Opening Trial Balance', required: true },
    { id: 'MIG-03', step_ar: 'MOD-3: تجهيز قائمة الموردين والأرصدة المفتوحة المتبقية (Open Vendor POs & Balances)', step_en: 'MOD-3: Vendor Master, Tax IDs & Open Purchase Orders', required: true },
    { id: 'MIG-04', step_ar: 'MOD-4: تجهيز قائمة العملاء والحدود الائتمانية والأسعار (Customer Master & Limits)', step_en: 'MOD-4: Customer Master, Pricelists & Credit Limits', required: true },
    { id: 'MIG-05', step_ar: 'MOD-5: البيانات الأساسية للموظفين، عقود العمل، والهياكل الراتبية (HR & Contracts)', step_en: 'MOD-5: Employee Records, Contracts & Salary Structures', required: true },
    { id: 'MIG-06', step_ar: 'MOD-6: قائمة المكونات (BOM) ومحطات العمل للتصنيع (BOMs & Workcenters)', step_en: 'MOD-6: Bills of Materials (BOM) & Work Center Routings', required: true },
    { id: 'MIG-07', step_ar: 'MOD-7: هيكل تفتيت أعمال المشاريع المفتوحة (Open Projects & WBS Structures)', step_en: 'MOD-7: Active Projects WBS & Opening Invoiced Amounts', required: true },
    { id: 'MIG-08', step_ar: 'MOD-8: سجل الأصول الثابتة وقيم الإهلاك التاريخي (Fixed Assets Register)', step_en: 'MOD-8: Fixed Assets Register & Accumulated Depreciation', required: true },
    { id: 'MIG-09', step_ar: 'MOD-9: نقاط ومواصفات فحص الجودة وتذاكر الدعم المفتوحة (Quality Inspection Specs)', step_en: 'MOD-9: Quality Inspection Standards & Open Support Cases', required: true },
    { id: 'MIG-10', step_ar: 'MOD-10: عقود الشركة، التراخيص، ومصفوفة الصلاحيات (Legal Contracts & SoD Matrix)', step_en: 'MOD-10: Legal Contracts, Licensing & SoD Security Matrix', required: true }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🛠️ ${isAr ? 'حزمة أدوات استشاري ومطبق الـ ERP (شاملة الـ 10 موديولات)' : 'ERP Implementer Toolkit (All 10 Modules)'}
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
