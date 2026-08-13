/**
 * js/multi_erp.js
 * 🔄 AI Multi-ERP Systems Advisor — Interactive AI Comparison Engine + Static Fallback.
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
    }
  };

  function render(container, selectedModId = 'MOD-1') {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🔄 ${isAr ? 'مستشار مقارنة أنظمة الـ ERP بالذكاء الاصطناعي' : 'AI Multi-ERP Systems Advisor'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'مقارنة فنية حية واستشارية عبر Odoo, SAP, NetSuite, و Dynamics 365 بناءً على متطلباتك' : 'Live architectural comparison for Odoo 18/19, SAP S/4HANA 2026, NetSuite 2026.1 & Dynamics 365'}
          </small>
        </div>

        <div style="min-width:240px;">
          <select id="multi-erp-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}" ${m.id === selectedModId ? 'selected' : ''}>${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- AI Prompt Search Input -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft); display:block; margin-bottom:8px;">
          ${isAr ? 'اسأل الـ AI مقارنة تخصصية لشركتك:' : 'Ask AI ERP Comparison Question:'}
        </label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="multi-erp-query-input" class="field" placeholder="${isAr ? 'مثال: قارن بين Odoo و SAP في معالجة تقييم المخزون والضرائب بالشركات الصناعية...' : 'e.g., Compare inventory valuation & VAT handling in Odoo vs SAP...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="multi-erp-ai-btn">
            🧠 ${isAr ? 'استشارة الـ AI' : 'Consult AI'}
          </button>
        </div>
      </div>

      <!-- Matrix Container -->
      <div id="multi-erp-matrix-content">
        ${renderMatrix(selectedModId)}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const select = container.querySelector('#multi-erp-mod-select');
    const aiBtn = container.querySelector('#multi-erp-ai-btn');
    const queryInput = container.querySelector('#multi-erp-query-input');
    const matrixContent = container.querySelector('#multi-erp-matrix-content');

    if (select && matrixContent) {
      select.addEventListener('change', (e) => {
        matrixContent.innerHTML = renderMatrix(e.target.value);
      });
    }

    if (aiBtn && queryInput && matrixContent) {
      aiBtn.addEventListener('click', async () => {
        const text = queryInput.value.trim();
        const modId = select ? select.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        matrixContent.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('multi_erp', text || 'Compare ERP systems for this module', { moduleId: modId });

        if (res.success && res.text) {
          matrixContent.innerHTML = `
            <div class="card" style="border-inline-start:4px solid var(--brass);">
              <h3 style="margin-bottom:12px;">🤖 ${isAr ? 'استشارة الـ AI لمقارنة الأنظمة' : 'AI Multi-ERP Advisory Analysis'}</h3>
              <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          matrixContent.innerHTML = renderMatrix(modId);
        }
      });
    }
  }

  function renderMatrix(modId) {
    const isAr = I18n.getLang() === 'ar';
    const item = ERP_DATA[modId] || ERP_DATA['MOD-1'];
    const sys = item.systems;

    return `
      <div class="grid grid-modules" style="margin-bottom:20px;">
        <div class="card" style="border-top:4px solid #714B67;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#714B67; font-size:16px;">🟪 ${sys.odoo.name}</h3>
            <span class="badge" style="background:rgba(113,75,103,0.15); color:#714B67;">${sys.odoo.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.odoo.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.odoo.logic}</p>
        </div>

        <div class="card" style="border-top:4px solid #005691;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#005691; font-size:16px;">🟦 ${sys.sap.name}</h3>
            <span class="badge" style="background:rgba(0,86,145,0.15); color:#005691;">${sys.sap.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.sap.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.sap.logic}</p>
        </div>

        <div class="card" style="border-top:4px solid #D64000;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:#D64000; font-size:16px;">🟧 ${sys.netsuite.name}</h3>
            <span class="badge" style="background:rgba(214,64,0,0.15); color:#D64000;">${sys.netsuite.module}</span>
          </div>
          <small style="color:var(--ink-soft); font-family:var(--font-mono); display:block; margin-bottom:10px;">📍 ${sys.netsuite.menu}</small>
          <p style="font-size:13px; color:var(--ink); line-height:1.5; margin:0;">${sys.netsuite.logic}</p>
        </div>

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
