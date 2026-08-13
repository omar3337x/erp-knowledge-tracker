/**
 * js/journal_sim.js
 * Journal Entry & Financial Impact Simulator.
 * Real-time double-entry ledger calculation and P&L / Balance Sheet meter updates.
 */

const JournalSim = (function () {

  const TRANSACTIONS = [
    {
      id: 'tx-1',
      title_ar: '📦 استلام شحنة مشتريات (Goods Receipt Note - GRN)',
      title_en: 'Goods Receipt Note (GRN)',
      amount: 10000,
      debit_account_ar: 'حـ/ المخزون (Inventory Asset)',
      debit_account_en: 'Inventory Asset Account',
      credit_account_ar: 'حـ/ المشتريات المعلقة (GR/IR Interim Accrual)',
      credit_account_en: 'GR/IR Interim Accrual Account',
      bs_asset_change: 10000,
      bs_liability_change: 10000,
      bs_equity_change: 0,
      pnl_revenue_change: 0,
      pnl_expense_change: 0,
      explanation_ar: 'يزيد حساب الأصول (المخزون) بـ 10,000 دائن مقابل إثبات التزام مؤقت (GR/IR) حتى وصول فاتورة المورد.',
      explanation_en: 'Increases Asset (Inventory) by 10,000 while establishing a temporary liability (GR/IR) until invoice arrival.'
    },
    {
      id: 'tx-2',
      title_ar: '🚚 تسليم بضاعة مباعة للعميل (Goods Issue / Delivery Order)',
      title_en: 'Goods Issue / Delivery Order',
      amount: 6500,
      debit_account_ar: 'حـ/ تكلفة البضاعة المباعة (COGS Expense)',
      debit_account_en: 'Cost of Goods Sold (COGS Expense)',
      credit_account_ar: 'حـ/ المخزون (Inventory Asset)',
      credit_account_en: 'Inventory Asset Account',
      bs_asset_change: -6500,
      bs_liability_change: 0,
      bs_equity_change: -6500,
      pnl_revenue_change: 0,
      pnl_expense_change: 6500,
      explanation_ar: 'يُخفض حساب الأصول (المخزون) بـ 6,500 ويُحمل حساب المصروفات (COGS) بتكلفة البضاعة المباعة، مما يخفض صافي الأرباح والملكية.',
      explanation_en: 'Reduces Asset (Inventory) by 6,500 and recognizes COGS expense, reducing net income and equity.'
    },
    {
      id: 'tx-3',
      title_ar: '⚠️ تسوية جردية بالسالب (Inventory Scrap / Loss Adjustment)',
      title_en: 'Inventory Scrap / Loss Adjustment',
      amount: 1200,
      debit_account_ar: 'حـ/ خسائر وتسويات المخزون (Inventory Loss Expense)',
      debit_account_en: 'Inventory Loss Expense Account',
      credit_account_ar: 'حـ/ المخزون (Inventory Asset)',
      credit_account_en: 'Inventory Asset Account',
      bs_asset_change: -1200,
      bs_liability_change: 0,
      bs_equity_change: -1200,
      pnl_revenue_change: 0,
      pnl_expense_change: 1200,
      explanation_ar: 'يتم إثبات التالف أو المفقود كمصروف خسائر مخزنية ويُخصم فورياً من قيمة المخزون الدفتري.',
      explanation_en: 'Recognizes lost or damaged inventory as an expense loss and deducts it immediately from book inventory asset value.'
    },
    {
      id: 'tx-4',
      title_ar: '🏗️ إهلاك أصل ثابت (Fixed Asset Depreciation)',
      title_en: 'Fixed Asset Depreciation',
      amount: 2500,
      debit_account_ar: 'حـ/ مصروف إهلاك الأصول (Depreciation Expense)',
      debit_account_en: 'Depreciation Expense Account',
      credit_account_ar: 'حـ/ مجمع إهلاك الأصول (Accumulated Depreciation)',
      credit_account_en: 'Accumulated Depreciation Account',
      bs_asset_change: -2500,
      bs_liability_change: 0,
      bs_equity_change: -2500,
      pnl_revenue_change: 0,
      pnl_expense_change: 2500,
      explanation_ar: 'يُسجل مجمع الإهلاك كحساب أصول مقابل (Contra-Asset) يخفض صافي قيمة الأصل بميزانية الشركة مقابل إثبات مصروف الإهلاك الفتري.',
      explanation_en: 'Accumulated depreciation acts as a contra-asset reducing net book asset value while recognizing monthly depreciation expense.'
    }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📑 ${isAr ? 'محاكي القيود والتأثير المالي التفاعلي' : 'Journal Entry & Financial Impact Simulator'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'اختر الحركة التلقائية لتشاهد القيد المزدوج والتأثير الفوري على الميزانية وقائمة الدخل' : 'Simulate ERP transactions to see live double-entry journal postings & statement impact'}
          </small>
        </div>
      </div>

      <!-- Transaction Selector -->
      <div class="card" style="margin-bottom:20px;">
        <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft); display:block; margin-bottom:8px;">
          ${isAr ? 'اختر نوع الحركة الميدانية:' : 'Select ERP Transaction Event:'}
        </label>
        <select id="sim-tx-select" class="field" style="margin:0; padding:10px 14px; font-weight:600; font-size:14px;">
          ${TRANSACTIONS.map(tx => `
            <option value="${tx.id}">${isAr ? tx.title_ar : tx.title_en}</option>
          `).join('')}
        </select>
      </div>

      <!-- Dynamic Simulation Output -->
      <div id="sim-output-box">
        ${renderSimulation(TRANSACTIONS[0].id)}
      </div>
    `;

    const select = container.querySelector('#sim-tx-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const box = container.querySelector('#sim-output-box');
        if (box) box.innerHTML = renderSimulation(e.target.value);
      });
    }
  }

  function renderSimulation(txId) {
    const isAr = I18n.getLang() === 'ar';
    const tx = TRANSACTIONS.find(t => t.id === txId) || TRANSACTIONS[0];

    return `
      <!-- Double Entry Ledger Card -->
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

      <!-- Financial Statement Impact Meters -->
      <div class="grid grid-kpi">
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'التأثير على الأصول (Assets)' : 'Assets Impact'}</div>
          <div class="kpi-value ${tx.bs_asset_change >= 0 ? 'teal' : 'rust'}" style="font-size:22px; font-family:var(--font-mono);">
            ${tx.bs_asset_change >= 0 ? '+' : ''}${tx.bs_asset_change.toLocaleString()}
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'التأثير على الالتزامات (Liabilities)' : 'Liabilities Impact'}</div>
          <div class="kpi-value ${tx.bs_liability_change > 0 ? 'brass' : ''}" style="font-size:22px; font-family:var(--font-mono);">
            ${tx.bs_liability_change >= 0 ? '+' : ''}${tx.bs_liability_change.toLocaleString()}
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'التأثير على المصروفات (Expenses)' : 'Expenses Impact'}</div>
          <div class="kpi-value ${tx.pnl_expense_change > 0 ? 'rust' : 'teal'}" style="font-size:22px; font-family:var(--font-mono);">
            ${tx.pnl_expense_change >= 0 ? '+' : ''}${tx.pnl_expense_change.toLocaleString()}
          </div>
        </div>
      </div>
    `;
  }

  return { render };
})();
