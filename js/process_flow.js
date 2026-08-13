/**
 * js/process_flow.js
 * Interactive Business Process Flow (BPMN / Swimlane) Visualizer.
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
        { num: 5, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'فاتورة المورد والمطابقة (Vendor Bill & 3-Way Match)', name_en: 'Vendor Bill & 3-Way Match', doc: 'Bill Doc', gl_ar: 'من حـ/ GR/IR المعلق — إلى حـ/ الموردين', gl_en: 'Dr. GR/IR Accrual — Cr. Accounts Payable' },
        { num: 6, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'سداد المورد (Vendor Payment)', name_en: 'Vendor Payment', doc: 'Payment Doc', gl_ar: 'من حـ/ الموردين — إلى حـ/ البنك', gl_en: 'Dr. Accounts Payable — Cr. Bank' }
      ]
    },
    'O2C': {
      title_ar: '💰 دورة البيع إلى التحصيل (Order-to-Cash - O2C)',
      title_en: 'Order-to-Cash (O2C) Lifecycle Flow',
      steps: [
        { num: 1, role_ar: 'إدارة المبيعات', role_en: 'Sales', name_ar: 'عرض السعر (Quotation)', name_en: 'Sales Quotation', doc: 'Quote Doc', gl_ar: 'بدون قيد محاسبي', gl_en: 'No G/L Posting' },
        { num: 2, role_ar: 'إدارة المبيعات', role_en: 'Sales', name_ar: 'أمر المبيعات وحجز المخزون (Sales Order)', name_en: 'Confirmed Sales Order', doc: 'SO Doc', gl_ar: 'حجز المخزون (Stock Allocation)', gl_en: 'Stock Allocation (No G/L)' },
        { num: 3, role_ar: 'إدارة المستودعات', role_en: 'Warehouse', name_ar: 'إذن صرف البضاعة (Delivery Order)', name_en: 'Goods Issue / Delivery Order', doc: 'DN Doc', gl_ar: 'من حـ/ COGS — إلى حـ/ المخزون', gl_en: 'Dr. COGS Expense — Cr. Inventory' },
        { num: 4, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'فاتورة العميل (Customer Invoice)', name_en: 'Customer Sales Invoice', doc: 'INV Doc', gl_ar: 'من حـ/ العملاء — إلى حـ/ المبيعات', gl_en: 'Dr. Accounts Receivable — Cr. Sales' },
        { num: 5, role_ar: 'إدارة الحسابات', role_en: 'Finance', name_ar: 'تحصيل نقدية العميل (Customer Payment)', name_en: 'Customer Cash Receipt', doc: 'Receipt Doc', gl_ar: 'من حـ/ البنك — إلى حـ/ العملاء', gl_en: 'Dr. Bank — Cr. Accounts Receivable' }
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
            🔄 ${isAr ? 'مصمم ومستكشف خرائط العمليات والدورات المستندية' : 'Business Process Flow Visualizer'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'تتبع تفاعلي للمستندات والمسئوليات والقيود المحاسبية عبر مراحل العمليات' : 'Interactive step-by-step visual map of ERP lifecycle workflows'}
          </small>
        </div>

        <div>
          <select id="flow-select-btn" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            <option value="P2P" ${selectedFlowKey === 'P2P' ? 'selected' : ''}>🛒 ${isAr ? 'دورة الشراء إلى السداد (P2P)' : 'Procure-to-Pay (P2P)'}</option>
            <option value="O2C" ${selectedFlowKey === 'O2C' ? 'selected' : ''}>💰 ${isAr ? 'دورة البيع إلى التحصيل (O2C)' : 'Order-to-Cash (O2C)'}</option>
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
