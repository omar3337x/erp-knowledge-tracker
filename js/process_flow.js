/**
 * js/process_flow.js
 * Interactive Business Process Flow (BPMN / Swimlane) Visualizer — 5 Complete Core Lifecycles.
 * Lifecycles: P2P (Procure-to-Pay), O2C (Order-to-Cash), R2R (Record-to-Report), M2S (Make-to-Stock), H2R (Hire-to-Retire).
 * 0ms Instant SVG & CSS node rendering.
 */

const ProcessFlow = (function () {

  const PROCESS_FLOWS = {
    'P2P': {
      title_ar: '🛒 دورة الشراء إلى السداد (Procure-to-Pay - P2P)',
      title_en: 'Procure-to-Pay (P2P) Lifecycle Flow',
      steps: [
        { num: 1, role_ar: 'الأقسام الطالبة', role_en: 'Department', name_ar: 'طلب الشراء (Purchase Requisition)', name_en: 'Purchase Requisition', doc: 'PR Doc', gl_ar: 'بدون قيد محاسبي', gl_en: 'No G/L Posting' },
        { num: 2, role_ar: 'إدارة المشتريات', role_en: 'Purchasing', name_ar: 'طلب عروض الأسعار (RFQ & Quotation)', name_en: 'RFQ & Vendor Quote', doc: 'RFQ Doc', gl_ar: 'بدون قيد محاسبي', gl_en: 'No G/L Posting' },
        { num: 3, role_ar: 'إدارة المشتريات', role_en: 'Purchasing', name_ar: 'أمر الشراء المؤكد (Purchase Order)', name_en: 'Purchase Order (PO)', doc: 'PO Doc', gl_ar: 'التزام تعاقدي (No Direct G/L)', gl_en: 'Commitment (No Direct G/L)' },
        { num: 4, role_ar: 'إدارة المستودعات', role_en: 'Warehouse', name_ar: 'سند استلام البضاعة (Goods Receipt Note)', name_en: 'Goods Receipt Note (GRN)', doc: 'GRN Doc', gl_ar: 'من حـ/ المخزون — إلى حـ/ GR/IR المعلق', gl_en: 'Dr. Inventory — Cr. GR/IR Accrual' },
        { num: 5, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'فاتورة المورد والمطابقة (Vendor Bill & 3-Way Match)', name_en: 'Vendor Bill & 3-Way Match', doc: 'Bill Doc', gl_ar: 'من حـ/ GR/IR المعلق + ضريبة المدخلات — إلى حـ/ الموردين', gl_en: 'Dr. GR/IR Accrual + Input VAT — Cr. Accounts Payable' },
        { num: 6, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'سداد المورد وتسوية البنك (Vendor Payment & Bank Recon)', name_en: 'Vendor Payment & Bank Recon', doc: 'Payment Doc', gl_ar: 'من حـ/ الموردين — إلى حـ/ البنك', gl_en: 'Dr. Accounts Payable — Cr. Bank' }
      ]
    },
    'O2C': {
      title_ar: '💰 دورة البيع إلى التحصيل (Order-to-Cash - O2C)',
      title_en: 'Order-to-Cash (O2C) Lifecycle Flow',
      steps: [
        { num: 1, role_ar: 'إدارة المبيعات', role_en: 'Sales', name_ar: 'عرض السعر (Quotation)', name_en: 'Sales Quotation', doc: 'Quote Doc', gl_ar: 'بدون قيد محاسبي', gl_en: 'No G/L Posting' },
        { num: 2, role_ar: 'إدارة المبيعات', role_en: 'Sales', name_ar: 'أمر المبيعات وحجز المخزون (Sales Order)', name_en: 'Confirmed Sales Order', doc: 'SO Doc', gl_ar: 'حجز المخزون (Stock Allocation)', gl_en: 'Stock Allocation (No G/L)' },
        { num: 3, role_ar: 'إدارة المستودعات', role_en: 'Warehouse', name_ar: 'إذن صرف البضاعة (Delivery Order / Outbound)', name_en: 'Goods Issue / Delivery Order', doc: 'DN Doc', gl_ar: 'من حـ/ COGS — إلى حـ/ المخزون', gl_en: 'Dr. COGS Expense — Cr. Inventory' },
        { num: 4, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'فاتورة العميل والضريبة (Customer Sales Invoice)', name_en: 'Customer Sales Invoice', doc: 'INV Doc', gl_ar: 'من حـ/ العملاء — إلى حـ/ المبيعات + ضريبة المبيعات', gl_en: 'Dr. Accounts Receivable — Cr. Sales Revenue + Output VAT' },
        { num: 5, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'تحصيل نقدية العميل (Customer Payment & Receipt)', name_en: 'Customer Cash Receipt', doc: 'Receipt Doc', gl_ar: 'من حـ/ البنك — إلى حـ/ العملاء', gl_en: 'Dr. Bank — Cr. Accounts Receivable' }
      ]
    },
    'R2R': {
      title_ar: '📊 دورة التسجيل إلى التقرير المالي (Record-to-Report - R2R)',
      title_en: 'Record-to-Report (R2R) Financial Closing Flow',
      steps: [
        { num: 1, role_ar: 'المحاسبة العامة', role_en: 'General Ledger', name_ar: 'تسجيل القيود اليومية (General Journal Posting)', name_en: 'General Journal Entry', doc: 'JV Doc', gl_ar: 'من حـ/ المصروفات — إلى حـ/ النقدية/التزامات', gl_en: 'Dr. Expense / Asset — Cr. Cash / Liability' },
        { num: 2, role_ar: 'محاسبة الأصول', role_en: 'Asset Accounting', name_ar: 'تشغيل الإهلاك الشهري (Monthly Asset Depreciation)', name_en: 'Asset Depreciation Run', doc: 'DEP Doc', gl_ar: 'من حـ/ مصروف الإهلاك — إلى حـ/ مجمع الإهلاك', gl_en: 'Dr. Depreciation Expense — Cr. Accumulated Depreciation' },
        { num: 3, role_ar: 'المحاسبة المالية', role_en: 'Finance', name_ar: 'إعادة تقييم العملات الأجنبية (FX Revaluation)', name_en: 'Foreign Currency Revaluation', doc: 'FX Doc', gl_ar: 'من حـ/ النقدية الأجنبية — إلى حـ/ أرباح عملة غير محققة', gl_en: 'Dr. Foreign Bank — Cr. Unrealized FX Gain' },
        { num: 4, role_ar: 'الإدارة المالية', role_en: 'Financial Controller', name_ar: 'إغلاق الفترات المالية والقوائم (Period Close & Financial Statements)', name_en: 'Period Close & Financial Reports', doc: 'Close Doc', gl_ar: 'من حـ/ أرباح الفترة — إلى حـ/ الأرباح المبقاة', gl_en: 'Dr. Retained Earnings / Clearing Accounts' }
      ]
    },
    'M2S': {
      title_ar: '🏭 دورة التصنيع والتكاليف (Make-to-Stock - M2S)',
      title_en: 'Make-to-Stock (M2S) Manufacturing Flow',
      steps: [
        { num: 1, role_ar: 'تخطيط الإنتاج', role_en: 'PP Planner', name_ar: 'تخطي الاحتياجات وأمر الإنتاج (MRP & Production Order)', name_en: 'MRP Run & Production Order', doc: 'MO Doc', gl_ar: 'بدون قيد محاسبي (خطه إنتاجية)', gl_en: 'No G/L Posting (Planned Demand)' },
        { num: 2, role_ar: 'إدارة المستودعات', role_en: 'Warehouse', name_ar: 'صرف الخامات لأمر الإنتاج (Raw Material Issue)', name_en: 'Component Raw Material Issue', doc: 'Pick Doc', gl_ar: 'من حـ/ الإنتاج تحت التشغيل (WIP) — إلى حـ/ المواد الخام', gl_en: 'Dr. WIP Inventory — Cr. Raw Materials' },
        { num: 3, role_ar: 'إدارة المصنع', role_en: 'Production Line', name_ar: 'تأكيد عمليات خطوط الإنتاج والعمالة (Routing Confirmation)', name_en: 'Workcenter Labor & Overhead Confirmation', doc: 'Job Doc', gl_ar: 'من حـ/ WIP — إلى حـ/ أجور وأعباء تصنيع ممتصة', gl_en: 'Dr. WIP Inventory — Cr. Absorbed Labor/Overhead' },
        { num: 4, role_ar: 'المستودعات والحسابات', role_en: 'Warehouse & Costing', name_ar: 'استلام المنتج التام والتسوية (Finished Goods Receipt & Settlement)', name_en: 'Finished Goods Receipt & Order Settlement', doc: 'FG Doc', gl_ar: 'من حـ/ المنتجات التامة — إلى حـ/ WIP + فروق تكاليف', gl_en: 'Dr. Finished Goods Inventory — Cr. WIP & Price Variance' }
      ]
    },
    'H2R': {
      title_ar: '👥 دورة التوظيف إلى التقاعد والرواتب (Hire-to-Retire - H2R)',
      title_en: 'Hire-to-Retire (H2R) Payroll & HCM Flow',
      steps: [
        { num: 1, role_ar: 'الموارد البشرية', role_en: 'Human Resources', name_ar: 'التوظيف والعقد الفعلي (Recruitment & Employee Contract)', name_en: 'Onboarding & Employment Contract', doc: 'HR Doc', gl_ar: 'بدون قيد محاسبي (بيانات أساسية)', gl_en: 'No G/L Posting (Master Record)' },
        { num: 2, role_ar: 'إدارة الحضور', role_en: 'Time & Attendance', name_ar: 'تجميع الحضور والساعات الإضافية (Timesheet & Attendance)', name_en: 'Time & Attendance Consolidation', doc: 'Time Doc', gl_ar: 'تجميع البيانات لاستحقاق المسير', gl_en: 'Data Consolidation for Payroll' },
        { num: 3, role_ar: 'إدارة الرواتب', role_en: 'Payroll Specialist', name_ar: 'احتساب وتأكيد مسير الرواتب (Monthly Payroll Run)', name_en: 'Monthly Payroll Run & Accruals', doc: 'Pay Doc', gl_ar: 'من حـ/ مصروف الأجور — إلى حـ/ الرواتب المستحقة والتأمينات', gl_en: 'Dr. Salary Expense — Cr. Net Salaries Payable & Taxes' },
        { num: 4, role_ar: 'إدارة الخزينة', role_en: 'Treasury', name_ar: 'صرف الرواتب بالبنك ومكافأة نهاية الخدمة (Salary Bank Transfer & EOS)', name_en: 'Salary Disbursement & End of Service (EOS)', doc: 'Disburse Doc', gl_ar: 'من حـ/ الرواتب المستحقة — إلى حـ/ البنك', gl_en: 'Dr. Net Salaries Payable — Cr. Bank' }
      ]
    }
  };

  function render(container, selectedFlowKey = 'P2P') {
    const isAr = I18n.getLang() === 'ar';
    const flow = PROCESS_FLOWS[selectedFlowKey] || PROCESS_FLOWS['P2P'];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🔄 ${isAr ? 'مصمم ومستكشف خرائط العمليات والدورات المستندية (5 دورات فائقة)' : 'Business Process Flow Visualizer (5 Core Lifecycles)'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'تتبع تفاعلي للمستندات والمسئوليات والقيود المحاسبية عبر مراحل العمليات' : 'Interactive step-by-step visual map of ERP lifecycle workflows'}
          </small>
        </div>

        <div>
          <select id="flow-select-btn" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            <option value="P2P" ${selectedFlowKey === 'P2P' ? 'selected' : ''}>🛒 ${isAr ? 'دورة الشراء إلى السداد (P2P)' : 'Procure-to-Pay (P2P)'}</option>
            <option value="O2C" ${selectedFlowKey === 'O2C' ? 'selected' : ''}>💰 ${isAr ? 'دورة البيع إلى التحصيل (O2C)' : 'Order-to-Cash (O2C)'}</option>
            <option value="R2R" ${selectedFlowKey === 'R2R' ? 'selected' : ''}>📊 ${isAr ? 'دورة التسجيل إلى التقرير (R2R)' : 'Record-to-Report (R2R)'}</option>
            <option value="M2S" ${selectedFlowKey === 'M2S' ? 'selected' : ''}>🏭 ${isAr ? 'دورة التصنيع والتكاليف (M2S)' : 'Make-to-Stock (M2S)'}</option>
            <option value="H2R" ${selectedFlowKey === 'H2R' ? 'selected' : ''}>👥 ${isAr ? 'دورة الرواتب والتوظيف (H2R)' : 'Hire-to-Retire (H2R)'}</option>
          </select>
        </div>
      </div>

      <!-- Header Title Card -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <h3 style="margin:0;">${isAr ? flow.title_ar : flow.title_en}</h3>
      </div>

      <!-- Process Diagram Visual Box -->
      <div id="flow-diagram-container">
        ${renderFlowDiagram(flow)}
      </div>
    `;

    const select = container.querySelector('#flow-select-btn');
    if (select) {
      select.addEventListener('change', (e) => {
        const diagramBox = container.querySelector('#flow-diagram-container');
        if (diagramBox) diagramBox.innerHTML = renderFlowDiagram(PROCESS_FLOWS[e.target.value]);
      });
    }
  }

  function renderFlowDiagram(flow) {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${flow.steps.map(step => `
          <div class="card" style="padding:16px 20px; transition:transform 0.15s ease;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="width:28px; height:28px; border-radius:50%; background:var(--brass); color:#1C1204; font-weight:700; display:inline-flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:13px;">${step.num}</span>
                <h4 style="margin:0; font-size:15px;">${isAr ? step.name_ar : step.name_en}</h4>
              </div>

              <div style="display:flex; gap:8px;">
                <span class="badge badge-status-learning">${isAr ? step.role_ar : step.role_en}</span>
                <span class="badge badge-priority-medium" style="font-family:var(--font-mono);">${step.doc}</span>
              </div>
            </div>

            <div style="padding:10px 14px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12.5px; font-family:var(--font-mono); color:var(--ink-soft);">
              ⚡ <strong>${isAr ? 'التأثير المحاسبي (G/L Impact):' : 'G/L Impact:'}</strong> ${isAr ? step.gl_ar : step.gl_en}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return { render };
})();
