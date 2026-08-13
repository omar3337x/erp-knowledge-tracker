/**
 * js/journal_sim.js
 * 📑 AI Journal Entry Generator — Natural Language Business Event Analyzer + Static Fallback.
 */

const JournalSim = (function () {

  const TRANSACTIONS = [
    {
      id: 'tx-1', title_ar: '📦 1. استلام شحنة مشتريات (Goods Receipt Note - GRN)', title_en: '1. Goods Receipt Note (GRN)',
      amount: 10000, debit_account_ar: 'حـ/ المخزون (Inventory Asset Account)', debit_account_en: 'Inventory Asset Account',
      credit_account_ar: 'حـ/ المشتريات المعلقة (GR/IR Interim Accrual)', credit_account_en: 'GR/IR Interim Accrual Account',
      bs_asset_change: 10000, bs_liability_change: 10000, bs_equity_change: 0, pnl_revenue_change: 0, pnl_expense_change: 0,
      explanation_ar: 'إثبات استلام البضاعة بالمخزن: زيادة الأصول (المخزون) بـ 10,000 مقابل تسليج التزام مؤقت (GR/IR) حتى وصول فاتورة المورد.',
      explanation_en: 'Increases Inventory Asset by 10,000 while establishing a temporary GR/IR liability until invoice verification.'
    }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📑 ${isAr ? 'محاكي ومولد القيود والتأثير المالي بالـ AI' : 'AI Journal Entry Generator'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'صف الحركة المالية باللغة الطبيعية ليقوم الـ AI باستخراج القيد وتأثير الميزانية وقائمة الدخل' : 'Describe any business transaction in natural language to generate double-entry ledger & statement impact'}
          </small>
        </div>

        <div style="min-width:200px;">
          <select id="sim-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Natural Language Event Input -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft); display:block; margin-bottom:8px;">
          ${isAr ? 'صف العملية التجارية باللغة الطبيعية (أو اختر من الجاهز):' : 'Describe Business Event in Natural Language:'}
        </label>
        <div style="display:flex; gap:10px; margin-bottom:12px;">
          <input type="text" id="sim-prompt-input" class="field" placeholder="${isAr ? 'مثال: تم شراء مواد خام بـ 50 ألف مع ضريبة 14% وتم الاستلام بالمستودع ولم تُدفع الفاتورة بعد...' : 'e.g. Purchased raw materials for 50,000 with 14% VAT, received in warehouse, bill unpaid...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="sim-ai-gen-btn">
            🧠 ${isAr ? 'توليد القيد بالـ AI' : 'Generate Entry'}
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <small style="color:var(--ink-soft);">${isAr ? 'أو اختر حركة سابقة جاهزة:' : 'Or select preset event:'}</small>
          <select id="sim-tx-select" class="field" style="margin:0; padding:4px 8px; font-size:12px; flex:1;">
            ${TRANSACTIONS.map(tx => `<option value="${tx.id}">${isAr ? tx.title_ar : tx.title_en}</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="sim-output-box">
        ${renderSimulation(TRANSACTIONS[0].id)}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#sim-ai-gen-btn');
    const promptInput = container.querySelector('#sim-prompt-input');
    const modSelect = container.querySelector('#sim-mod-select');
    const select = container.querySelector('#sim-tx-select');
    const box = container.querySelector('#sim-output-box');

    if (select && box) {
      select.addEventListener('change', (e) => {
        box.innerHTML = renderSimulation(e.target.value);
      });
    }

    if (aiBtn && promptInput && box) {
      aiBtn.addEventListener('click', async () => {
        const text = promptInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        box.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('journal_sim', text || 'Purchase goods on credit', { moduleId: modId });

        if (res.success && res.text) {
          box.innerHTML = `
            <div class="card" style="border-inline-start:4px solid var(--brass);">
              <h3 style="margin-bottom:12px;">📑 ${isAr ? 'تحليل القيد والتأثير المالي المحاسبي بالـ AI' : 'AI Journal Entry & Impact Analysis'}</h3>
              <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          box.innerHTML = renderSimulation(select ? select.value : TRANSACTIONS[0].id);
        }
      });
    }
  }

  function renderSimulation(txId) {
    const isAr = I18n.getLang() === 'ar';
    const tx = TRANSACTIONS.find(t => t.id === txId) || TRANSACTIONS[0];

    return `
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:15px; margin:0;">${isAr ? 'القيد المحاسبي المتولد تلقائياً (Journal Entry)' : 'Generated Double-Entry Journal'}</h3>
          <span class="badge badge-priority-high" style="font-family:var(--font-mono); font-size:13px;">
            ${tx.amount.toLocaleString()} EGP / USD
          </span>
        </div>

        <div class="table-wrap" style="margin-bottom:14px;">
          <table>
            <thead>
              <tr>
                <th>${isAr ? 'الجانب (Debit / Credit)' : 'Side'}</th>
                <th>${isAr ? 'اسم الحساب في الدليل (Account Name)' : 'Account Name'}</th>
                <th style="text-align:end;">${isAr ? 'مدين (Debit)' : 'Debit'}</th>
                <th style="text-align:end;">${isAr ? 'دائن (Credit)' : 'Credit'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="badge badge-status-mastered" style="font-size:11px;">${isAr ? 'مدين (Dr)' : 'Debit (Dr)'}</span></td>
                <td><strong>${isAr ? tx.debit_account_ar : tx.debit_account_en}</strong></td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--teal);">${tx.amount.toLocaleString()}</td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--ink-soft);">0</td>
              </tr>
              <tr>
                <td><span class="badge badge-status-learning" style="font-size:11px;">${isAr ? 'دائن (Cr)' : 'Credit (Cr)'}</span></td>
                <td><strong>${isAr ? tx.credit_account_ar : tx.credit_account_en}</strong></td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--ink-soft);">0</td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--brass-deep);">${tx.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="margin:0; font-size:13px; color:var(--ink-soft); line-height:1.5;">
          💡 <strong>${isAr ? 'التوضيح المحاسبي:' : 'Accounting Explanation:'}</strong> ${isAr ? tx.explanation_ar : tx.explanation_en}
        </p>
      </div>
    `;
  }

  return { render };
})();
