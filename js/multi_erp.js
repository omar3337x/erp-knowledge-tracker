/**
 * js/multi_erp.js
 * Multi-ERP Systems Comparison Matrix (Odoo 17, SAP S/4HANA, NetSuite, Dynamics 365).
 * 0ms Instant local render with structured domain mapping.
 */

const MultiERP = (function () {

  const ERP_DATA = {
    'MOD-1': {
      name_ar: 'المخزون (Inventory)',
      name_en: 'Inventory Management',
      systems: {
        odoo: { name: 'Odoo 17', module: 'stock', menu: 'Inventory -> Products -> Lot/Serial', logic: 'Double-entry inventory system. Stock moves generate financial postings via Stock Interim Account.' },
        sap: { name: 'SAP S/4HANA', module: 'MM-IM', menu: 'T-Code MIGO / MMBE', logic: 'Movement Types (e.g. 101 Goods Receipt, 601 Goods Issue) dictate G/L posting rules directly via OBYC.' },
        netsuite: { name: 'Oracle NetSuite', module: 'Inventory Mgmt', menu: 'Lists -> Supply Chain -> Items', logic: 'Item records linked to Asset, COGS, and Income accounts. Asset revaluation via Inventory Adjustments.' },
        dynamics: { name: 'Dynamics 365 F&O', module: 'Inventory Mgmt', menu: 'Inventory management -> Inquiries -> On-hand', logic: 'Inventory Model Groups specify Costing method (FIFO/Weighted Avg) and posting to Item Groups.' }
      }
    },
    'MOD-2': {
      name_ar: 'الحسابات والمالية (Accounting & Finance)',
      name_en: 'Financial Accounting',
      systems: {
        odoo: { name: 'Odoo 17', module: 'account', menu: 'Accounting -> Customers -> Invoices', logic: 'Journal Entries (account.move) with Journal Items. Automatic multi-currency & tax reconciliation.' },
        sap: { name: 'SAP S/4HANA', module: 'FI / CO', menu: 'T-Code FB50 / FB01 / FAGLB03', logic: 'Universal Journal (ACDOCA table). Single source of truth for General Ledger, Controlling, Asset Accounting.' },
        netsuite: { name: 'Oracle NetSuite', module: 'Financials', menu: 'Transactions -> Financial -> Make Journal Entries', logic: 'Multi-subsidiary architecture with automated Elimination Entries and OneWorld consolidation.' },
        dynamics: { name: 'Dynamics 365 F&O', module: 'General Ledger', menu: 'General ledger -> Journal entries -> General journals', logic: 'Main Accounts with Account Structures & Financial Dimensions for deep departmental reporting.' }
      }
    },
    'MOD-3': {
      name_ar: 'المشتريات والموردين (Purchasing)',
      name_en: 'Purchasing & Procurement',
      systems: {
        odoo: { name: 'Odoo 17', module: 'purchase', menu: 'Purchase -> Orders -> Requests for Quotation', logic: 'RFQ -> Purchase Order -> Goods Receipt -> Vendor Bill (3-Way Matching).' },
        sap: { name: 'SAP S/4HANA', module: 'MM-PUR', menu: 'T-Code ME21N / ME23N / MIRO', logic: 'Purchase Requisition -> Purchase Order -> Goods Receipt (MIGO) -> Logistics Invoice Verification (MIRO).' },
        netsuite: { name: 'Oracle NetSuite', module: 'Procurement', menu: 'Transactions -> Purchases -> Enter Purchase Orders', logic: 'Requisition -> Purchase Order -> Item Receipt -> Vendor Bill & Payment approval workflow.' },
        dynamics: { name: 'Dynamics 365 F&O', module: 'Procurement', menu: 'Procurement and sourcing -> Purchase orders -> All POs', logic: 'Purchase Requisition approval workflows -> Purchase Order -> Product Receipt -> Invoice matching.' }
      }
    },
    'MOD-4': {
      name_ar: 'المبيعات والعملاء (Sales & CRM)',
      name_en: 'Sales & CRM',
      systems: {
        odoo: { name: 'Odoo 17', module: 'sale', menu: 'Sales -> Orders -> Quotations', logic: 'Quotation -> Sales Order (Stock Reservation) -> Delivery Order -> Customer Invoice.' },
        sap: { name: 'SAP S/4HANA', module: 'SD (Sales & Distribution)', menu: 'T-Code VA01 / VA02 / VF01', logic: 'Sales Order -> Outbound Delivery (VL01N) -> Goods Issue -> Billing Document (VF01).' },
        netsuite: { name: 'Oracle NetSuite', module: 'Order Mgmt', menu: 'Transactions -> Sales -> Enter Sales Orders', logic: 'Estimate -> Sales Order -> Item Fulfillment -> Invoice / Cash Sale generation.' },
        dynamics: { name: 'Dynamics 365 F&O', module: 'Sales & Marketing', menu: 'Sales and marketing -> Sales orders -> All sales orders', logic: 'Quotation -> Sales Order -> Packing Slip -> Customer Invoice posting.' }
      }
    },
    'MOD-5': {
      name_ar: 'الموارد البشرية (HR & Payroll)',
      name_en: 'HR & Payroll',
      systems: {
        odoo: { name: 'Odoo 17', module: 'hr_payroll', menu: 'Employees -> Payslips', logic: 'Contracts -> Salary Structures -> Payslip computation -> G/L Journal Posting.' },
        sap: { name: 'SAP S/4HANA', module: 'SuccessFactors / HR', menu: 'T-Code PA30 / PA20 / PC00_M99_CALC', logic: 'Infotypes (e.g. 0008 Basic Pay) driving Payroll Run and Posting to FI Accounts.' },
        netsuite: { name: 'Oracle NetSuite', module: 'SuitePeople', menu: 'Lists -> Employees -> Employees', logic: 'Employee Master Records linked to Time Tracking, Expense Reports, and Payroll Integration.' },
        dynamics: { name: 'Dynamics 365 F&O', module: 'Human Resources', menu: 'Human resources -> Workers -> Employees', logic: 'Positions, Jobs, Compensation plans, and Benefit management linked to Payroll G/L.' }
      }
    }
  };

  function render(container, selectedModId = 'MOD-1') {
    const isAr = I18n.getLang() === 'ar';
    const modules = typeof State !== 'undefined' && State.modulesCache ? State.modulesCache : [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🔄 ${isAr ? 'مصفوفة مقارنة أنظمة الـ ERP العالمية' : 'Multi-ERP Systems Comparison Matrix'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'مقارنة دقيقة لتطبيق الأنشطة عبر Odoo 17, SAP S/4HANA, NetSuite, و Dynamics 365' : 'Side-by-side implementation matrix for Odoo 17, SAP S/4HANA, NetSuite & Dynamics 365'}
          </small>
        </div>

        <div style="min-width:200px;">
          <select id="multi-erp-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${Object.keys(ERP_DATA).map(id => `
              <option value="${id}" ${id === selectedModId ? 'selected' : ''}>
                ${ERP_DATA[id].name_ar} (${id})
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Matrix Container -->
      <div id="multi-erp-matrix-content">
        ${renderMatrix(selectedModId)}
      </div>
    `;

    const select = container.querySelector('#multi-erp-mod-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const matrixContent = container.querySelector('#multi-erp-matrix-content');
        if (matrixContent) matrixContent.innerHTML = renderMatrix(e.target.value);
      });
    }
  }

  function renderMatrix(modId) {
    const isAr = I18n.getLang() === 'ar';
    const item = ERP_DATA[modId] || ERP_DATA['MOD-1'];
    const sys = item.systems;

    return `
      <div class="grid grid-modules" style="margin-bottom:20px;">
        <!-- Odoo Card -->
        <div class="card" style="border-top:4px solid #714B67;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#714B67; font-size:16px;">🟪 ${sys.odoo.name}</h3>
            <span class="badge" style="background:rgba(113,75,103,0.15); color:#714B67;">${sys.odoo.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.odoo.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.odoo.logic}</p>
        </div>

        <!-- SAP Card -->
        <div class="card" style="border-top:4px solid #005691;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#005691; font-size:16px;">🟦 ${sys.sap.name}</h3>
            <span class="badge" style="background:rgba(0,86,145,0.15); color:#005691;">${sys.sap.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.sap.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.sap.logic}</p>
        </div>

        <!-- NetSuite Card -->
        <div class="card" style="border-top:4px solid #D64000;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#D64000; font-size:16px;">🟧 ${sys.netsuite.name}</h3>
            <span class="badge" style="background:rgba(214,64,0,0.15); color:#D64000;">${sys.netsuite.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.netsuite.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.netsuite.logic}</p>
        </div>

        <!-- Dynamics Card -->
        <div class="card" style="border-top:4px solid #008272;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#008272; font-size:16px;">🟩 ${sys.dynamics.name}</h3>
            <span class="badge" style="background:rgba(0,130,114,0.15); color:#008272;">${sys.dynamics.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.dynamics.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.dynamics.logic}</p>
        </div>
      </div>
    `;
  }

  return { render };
})();
