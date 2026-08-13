/**
 * js/multi_erp.js
 * Comprehensive Multi-ERP Systems Comparison Matrix across ALL 10 ERP Modules (2026 Edition).
 * Systems: Odoo 18/19 (2026), SAP S/4HANA 2026 Cloud, Oracle NetSuite 2026.1, Dynamics 365 F&O 2026.
 * 0ms Instant local render.
 */

const MultiERP = (function () {

  const ERP_DATA = {
    'MOD-1': {
      name_ar: '📦 إدارة المخزون والمستودعات (Inventory 2026)',
      name_en: 'Inventory & Warehouse Management (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'stock (Inventory & WMS)', menu: 'Inventory -> Products -> Lot/Serial', logic: 'Double-entry stock system (stock.move / stock.picking). Automated FIFO/AVCO valuation posts to Stock Interim (In/Out) and COGS accounts automatically upon Goods Issue with AI reordering.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'MM-IM / Extended WM 2026', menu: 'T-Code MIGO / MMBE / MB51 / Fiori Apps', logic: 'Movement Types (e.g. 101 Goods Receipt, 601 Goods Issue, 311 Transfer) drive automatic G/L account determination via OBYC transaction keys (BSX, WRX, GBB) integrated with SAP Central Finance 2026.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Inventory Mgmt & Smart WMS', menu: 'Lists -> Supply Chain -> Items', logic: 'Item records linked to Asset, COGS, and Income accounts. Real-time AI Landed Cost distribution and automated bin routing via Advanced 2026 Inventory.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Inventory & Warehouse Mgmt', menu: 'Inventory management -> Inquiries -> On-hand', logic: 'Item Model Groups define Costing Method (FIFO, LIFO, Weighted Avg, Standard). Copilot 2026 Posting Profiles map Item Groups to main accounts.' }
      }
    },
    'MOD-2': {
      name_ar: '💰 الحسابات والمالية (Accounting & Finance 2026)',
      name_en: 'Financial Accounting & Controlling (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'account (AI Accounting 2026)', menu: 'Accounting -> Customers -> Invoices', logic: 'Unified Journal Entries (account.move) with debit/credit Journal Items (account.move.line). Auto-reconciliation, multi-currency 2026, and automated e-invoicing.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'FI / CO (ACDOCA Universal Journal)', menu: 'T-Code FB50 / FB01 / FAGLB03 / Fiori Financials', logic: 'Universal Journal Table (ACDOCA 2026) integrates General Ledger, Controlling (CO), Asset Accounting (FI-AA), and Material Ledger into a single real-time source of truth.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Financials & OneWorld 2026', menu: 'Transactions -> Financial -> Make Journal Entries', logic: 'Multi-subsidiary OneWorld consolidation architecture with automated Intercompany Elimination Entries, multi-book accounting, and automated FX 2026 revaluation.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'General Ledger & Financials', menu: 'General ledger -> Journal entries -> General journals', logic: 'Main Accounts linked with Account Structures and Financial Dimensions (Business Unit, Department, Cost Center) for dynamic dimensional AI reporting.' }
      }
    },
    'MOD-3': {
      name_ar: '🛒 المشتريات والموردين (Purchasing & Procurement 2026)',
      name_en: 'Purchasing & Procurement (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'purchase (Purchase 2026)', menu: 'Purchase -> Orders -> Purchase Orders', logic: 'RFQ -> Purchase Order -> Receipt (stock.picking) -> Vendor Bill (3-Way Matching). Automated reordering rules and vendor lead-time AI predictions.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'MM-PUR / Ariba Procurement 2026', menu: 'T-Code ME21N / ME23N / MIRO / Fiori Procure', logic: 'Purchase Requisition (ME51N) -> Purchase Order (ME21N) -> Goods Receipt (MIGO 101) -> Logistics Invoice Verification (MIRO 3-Way Match).' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Procurement & Vendor Mgmt 2026', menu: 'Transactions -> Purchases -> Enter Purchase Orders', logic: 'Requisition approval workflow -> Purchase Order -> Item Receipt -> Vendor Bill & 3-Way matching with automated approval routing.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Procurement & Sourcing 2026', menu: 'Procurement and sourcing -> Purchase orders -> All POs', logic: 'Purchase Requisitions -> Purchase Order -> Product Receipt -> Vendor Invoice matching with policy tolerance thresholds.' }
      }
    },
    'MOD-4': {
      name_ar: '📈 المبيعات والعملاء (Sales & CRM 2026)',
      name_en: 'Sales & Commercial Operations (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'sale & crm (2026)', menu: 'Sales -> Orders -> Quotations', logic: 'Opportunity -> Quotation -> Sales Order (Stock Reservation) -> Delivery Order (stock.picking) -> Customer Invoice & Payment.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'SD (Sales & Distribution 2026)', menu: 'T-Code VA01 / VL01N / VF01 / Sales Fiori', logic: 'Sales Order (VA01) -> Outbound Delivery (VL01N) -> Post Goods Issue (PGI) -> Billing Document (VF01) -> AR Release.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Order Management & CRM 2026', menu: 'Transactions -> Sales -> Enter Sales Orders', logic: 'Lead/Opportunity -> Estimate -> Sales Order -> Item Fulfillment -> Invoice / Cash Sale generation with commission calculations.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Sales & Marketing (2026)', menu: 'Sales and marketing -> Sales orders -> All sales orders', logic: 'Quotation -> Confirmed Sales Order -> Packing Slip generation -> Customer Invoice posting with automatic credit limit checking.' }
      }
    },
    'MOD-5': {
      name_ar: '👥 الموارد البشرية والرواتب (HR & Payroll 2026)',
      name_en: 'Human Resources & Payroll (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'hr & hr_payroll (2026)', menu: 'Employees -> Payslips', logic: 'Employee Master -> Contracts -> Salary Rules & Structures -> Work Entries -> Payslip Computation & Accounting Entry Posting.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'SuccessFactors / HCM 2026', menu: 'T-Code PA30 / PA20 / PC00_M99_CALC', logic: 'Infotypes (e.g. 0008 Basic Pay, 0014 Recurrent Payments) driving Payroll Calculation and direct FI Journal Posting.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'SuitePeople HRMS 2026', menu: 'Lists -> Employees -> Employees', logic: 'Employee Master linked to Time Tracking, Expense Reports, Commission Rules, and automated Payroll G/L integration.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Human Resources & Payroll 2026', menu: 'Human resources -> Workers -> Employees', logic: 'Positions, Jobs, Compensation Plans, Benefits administration, and Time & Attendance integrated with G/L accounts.' }
      }
    },
    'MOD-6': {
      name_ar: '🏭 التصنيع والتكاليف (Manufacturing & MRP 2026)',
      name_en: 'Manufacturing & Production Control (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'mrp (Manufacturing 2026)', menu: 'Manufacturing -> Operations -> Manufacturing Orders', logic: 'BOM (Bill of Materials) & Workcenters -> Manufacturing Order -> Component Issue -> Workcenter Operations -> Finished Product Receipt & Scrap.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'PP (Production Planning 2026) & CO-PC', menu: 'T-Code CO01 / COR1 / MD04', logic: 'BOM & Routing (Work Center) -> Planned Order (MRP) -> Production Order (CO01) -> Goods Issue (261) -> Confirmation (CO15) -> Goods Receipt (101) & Cost Variance.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'WIP & Manufacturing 2026', menu: 'Transactions -> Manufacturing -> Work Orders', logic: 'Assembly Items & BOM -> Work Order -> Component Issue -> Assembly Build / WIP Completion & Cost Rollup.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Production Control 2026', menu: 'Production control -> Production orders -> All production orders', logic: 'BOM & Route -> Production Order Estimation -> Release -> Picking List -> Route Card Confirmation -> Report as Finished.' }
      }
    },
    'MOD-7': {
      name_ar: '📊 إدارة المشاريع (Project Management 2026)',
      name_en: 'Project Management & PSA (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'project & hr_timesheet (2026)', menu: 'Project -> Projects -> Tasks', logic: 'Project -> Tasks & Stages -> Timesheets -> Project Profitability & Invoicing based on Milestones or Delivered Hours.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'PS (Project System 2026)', menu: 'T-Code CJ20N / CJ01 / CJ88', logic: 'WBS (Work Breakdown Structure) & Network Activities -> Project Budgeting -> Cost Accumulation -> Settlement to Assets / Expense (CJ88).' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'SuiteProjects / OpenAir 2026', menu: 'Lists -> Relationships -> Projects', logic: 'WBS Tasks -> Resource Allocation -> Time & Expense Entries -> Revenue Recognition (ASC 606 / IFRS 15) & Project Billing.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Project Management & Accounting 2026', menu: 'Project management and accounting -> Projects -> All projects', logic: 'Project Contracts & WBS -> Hour/Expense/Item Hours Journal -> Revenue Recognition & Project Invoicing (Time & Material or Fixed Price).' }
      }
    },
    'MOD-8': {
      name_ar: '🔧 الصيانة الفنية والأصول (Maintenance & Assets 2026)',
      name_en: 'Enterprise Asset Management EAM (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'maintenance & account_asset 2026', menu: 'Maintenance -> Maintenance Requests', logic: 'Equipment & Workcenters -> Preventive / Corrective Maintenance Requests -> Asset Depreciation Board & Asset Disposal.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'PM (Plant Maintenance 2026) & FI-AA', menu: 'T-Code IW31 / IW38 / AS01 / AFAB', logic: 'Functional Location & Equipment -> Maintenance Order (IW31) -> Goods Issue / Order Settlement & Asset Depreciation Run (AFAB).' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Fixed Assets Management FAM 2026', menu: 'Fixed Assets -> Maintenance Requests', logic: 'Asset Master -> Depreciation Schedule -> Maintenance Log -> Depreciation Journal Posting & Asset Sale / Disposal.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Asset Management 2026', menu: 'Asset management -> Assets -> All assets', logic: 'Functional Location & Asset -> Maintenance Work Order -> Spare Parts Issue -> Fixed Asset Depreciation Proposal & Book Posting.' }
      }
    },
    'MOD-9': {
      name_ar: '🤝 العلاقات والخدمات (Quality & Services 2026)',
      name_en: 'Quality Assurance & Services (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'quality & helpdesk (2026)', menu: 'Quality -> Quality Control -> Quality Checks', logic: 'Quality Control Points -> Quality Checks at Receiving / Production -> Inspection Pass/Fail -> Helpdesk Tickets & SLA Escalations.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'QM (Quality Management 2026) & CS', menu: 'T-Code QA01 / QA32 / QA11', logic: 'Inspection Lot (QA01) -> Result Recording -> Usage Decision (QA11) -> Stock Clearance (Unrestricted / Blocked / Return).' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Quality Mgmt & Support 2026', menu: 'Lists -> Support -> Cases', logic: 'Quality Inspection Specs -> Inspection Queue -> Pass/Fail Routing -> Customer Support Case Management with SLA rules.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Quality Management 2026', menu: 'Inventory management -> Setup -> Quality control', logic: 'Quality Orders -> Item Sampling -> Test Group Result Entry -> Inventory Status update (Approved / Quarantined).' }
      }
    },
    'MOD-10': {
      name_ar: '⚖️ الشؤون القانونية والامتثال (Legal & Governance 2026)',
      name_en: 'Legal, Governance & Compliance (2026)',
      systems: {
        odoo: { name: 'Odoo 18/19 (2026 Edition)', module: 'sign & documents (2026)', menu: 'Documents -> Legal / Contracts', logic: 'Digital Signature (Sign) -> Contract Expiry Tracking -> Document Archiving & Automated Renewal Notifications.' },
        sap: { name: 'SAP S/4HANA 2026 (RISE Cloud)', module: 'GRC (Governance & Risk 2026)', menu: 'T-Code GRC / NWBC', logic: 'Segregation of Duties (SoD) Analysis -> Access Control -> Risk Management & Statutory Audit Log Tracking.' },
        netsuite: { name: 'Oracle NetSuite 2026.1', module: 'Contract Renewal & Governance 2026', menu: 'Lists -> Relationships -> Contracts', logic: 'Contract Terms & Milestones -> E-Signature integration -> Compliance Audit Trail & Automated Revenue Contract Amortization.' },
        dynamics: { name: 'Dynamics 365 F&O (2026 Wave)', module: 'Compliance & Audit 2026', menu: 'Compliance and internal control -> Audit framework', logic: 'Audit Policy Rules -> Violation Detection -> Electronic Signatures & Compliance Certificate Tracking.' }
      }
    }
  };

  function render(container, selectedModId = 'MOD-1') {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🔄 ${isAr ? 'مصفوفة مقارنة أنظمة الـ ERP العالمية (تحديثات 2026)' : 'Multi-ERP Systems Comparison Matrix (2026 Edition)'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'مقارنة فنية ودورة تنفيذ كاملة عبر Odoo 18/19, SAP S/4HANA 2026, NetSuite 2026.1, و Dynamics 365 F&O (2026)' : 'Comprehensive 2026 architecture comparison for Odoo 18/19, SAP S/4HANA 2026, NetSuite 2026.1 & Dynamics 365'}
          </small>
        </div>

        <div style="min-width:260px;">
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
