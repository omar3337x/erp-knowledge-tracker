/**
 * js/journal_sim.js
 * Journal Entry & Financial Impact Simulator — 10 Real-World ERP Transaction Events.
 * Real-time double-entry ledger calculation and P&L / Balance Sheet meter updates.
 */

const JournalSim = (function () {

  const TRANSACTIONS = [
    {
      id: 'tx-1',
      title_ar: '📦 1. استلام شحنة مشتريات (Goods Receipt Note - GRN)',
      title_en: '1. Goods Receipt Note (GRN)',
      amount: 10000,
      debit_account_ar: 'حـ/ المخزون (Inventory Asset Account)',
      debit_account_en: 'Inventory Asset Account',
      credit_account_ar: 'حـ/ المشتريات المعلقة (GR/IR Interim Accrual)',
      credit_account_en: 'GR/IR Interim Accrual Account',
      bs_asset_change: 10000,
      bs_liability_change: 10000,
      bs_equity_change: 0,
      pnl_revenue_change: 0,
      pnl_expense_change: 0,
      explanation_ar: 'إثبات استلام البضاعة بالمخزن: زيادة الأصول (المخزون) بـ 10,000 مقابل تسليج التزام مؤقت (GR/IR) حتى وصول فاتورة المورد.',
      explanation_en: 'Increases Inventory Asset by 10,000 while establishing a temporary GR/IR liability until invoice verification.'
    },
    {
      id: 'tx-2',
      title_ar: '🧾 2. مطابقة فاتورة المورد مع الضريبة (Vendor Bill & 14% VAT)',
      title_en: '2. Vendor Invoice Matching & 14% VAT',
      amount: 11400,
      debit_account_ar: 'حـ/ GR/IR المعلق (10,000) + حـ/ ضريبة القيمة المضافة المدخلات (1,400)',
      debit_account_en: 'GR/IR Accrual (10,000) + Input VAT Tax Receivable (1,400)',
      credit_account_ar: 'حـ/ الموردين (Accounts Payable)',
      credit_account_en: 'Accounts Payable (Vendor Account)',
      bs_asset_change: 1400,
      bs_liability_change: 11400,
      bs_equity_change: 0,
      pnl_revenue_change: 0,
      pnl_expense_change: 0,
      explanation_ar: 'تسوية حساب GR/IR المؤقت وإثبات ضريبة القيمة المضافة المستردة (مدين) مقابل قيد إجمالي المستحق للمورد (دائن) بـ 11,400.',
      explanation_en: 'Clears temporary GR/IR account, records recoverable Input VAT (Debit), and registers total Accounts Payable liability (Credit).'
    },
    {
      id: 'tx-3',
      title_ar: '🚚 3. إذن تسليم بضاعة مباعة للعميل (Goods Issue / Delivery Order)',
      title_en: '3. Goods Issue / Delivery Order',
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
      explanation_ar: 'خفض المخزون الدفتري بالتكلفة الأصلية (دائن) مقابل تحميل مصروفات تكلفة المبيعات (COGS)، مما يقلل صافي الربح والملكية.',
      explanation_en: 'Reduces inventory asset at cost (Credit) and recognizes COGS expense (Debit), decreasing net equity.'
    },
    {
      id: 'tx-4',
      title_ar: '💰 4. إصدار فاتورة مبيعات للعميل مع الضريبة (Customer Invoice & VAT)',
      title_en: '4. Customer Invoice & Sales Revenue',
      amount: 11400,
      debit_account_ar: 'حـ/ العملاء (Accounts Receivable)',
      debit_account_en: 'Accounts Receivable (Customer)',
      credit_account_ar: 'حـ/ الإيرادات (Sales Revenue 10,000) + حـ/ ضريبة المبيعات المستحقة (VAT Payable 1,400)',
      credit_account_en: 'Sales Revenue (10,000) + Output VAT Payable (1,400)',
      bs_asset_change: 11400,
      bs_liability_change: 1400,
      bs_equity_change: 10000,
      pnl_revenue_change: 10000,
      pnl_expense_change: 0,
      explanation_ar: 'إثبات مديونية العميل بـ 11,400 مقابل الاعتراف بإيراد المبيعات (10,000) والالتزام الضريبي للحكومة (1,400).',
      explanation_en: 'Records Accounts Receivable asset (11,400) against Sales Revenue (10,000) and Output VAT liability (1,400).'
    },
    {
      id: 'tx-5',
      title_ar: '⚠️ 5. تسوية جردية وتسديد تلفيات (Inventory Scrap / Loss Adjustment)',
      title_en: '5. Inventory Scrap & Loss Adjustment',
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
      explanation_ar: 'إثبات عجز أو تلف المواد كخسارة تشغيلية بقائمة الدخل (مدين) وخصم القيمة مباشرة من رصيد الأصول المخزنية (دائن).',
      explanation_en: 'Recognizes inventory physical shortage as an operational loss expense while reducing inventory asset balance.'
    },
    {
      id: 'tx-6',
      title_ar: '🏭 6. صرف خامات للتصنيع واستلام منتج تام (Manufacturing WIP & FG)',
      title_en: '6. Manufacturing WIP Issue & Finished Goods',
      amount: 8000,
      debit_account_ar: 'حـ/ مخزون المنتجات التامة (Finished Goods Inventory)',
      debit_account_en: 'Finished Goods Inventory Account',
      credit_account_ar: 'حـ/ مخزون المواد الخام (Raw Materials Inventory)',
      credit_account_en: 'Raw Materials Inventory Account',
      bs_asset_change: 0,
      bs_liability_change: 0,
      bs_equity_change: 0,
      pnl_revenue_change: 0,
      pnl_expense_change: 0,
      explanation_ar: 'تحويل بين الأصول (Asset Reclassification): خفض فئة المواد الخام وزيادة فئة المنتجات التامة بنفس قيمة التكلفة المعيارية.',
      explanation_en: 'Reclassifies inventory asset from Raw Materials to Finished Goods upon production order completion.'
    },
    {
      id: 'tx-7',
      title_ar: '🏗️ 7. قيد إهلاك الأصول الثابتة الشهري (Monthly Asset Depreciation)',
      title_en: '7. Monthly Fixed Asset Depreciation',
      amount: 2500,
      debit_account_ar: 'حـ/ مصروف إهلاك الأصول (Depreciation Expense)',
      debit_account_en: 'Depreciation Expense Account',
      credit_account_ar: 'حـ/ مجمع إهلاك الأصول (Accumulated Depreciation - Contra Asset)',
      credit_account_en: 'Accumulated Depreciation Account',
      bs_asset_change: -2500,
      bs_liability_change: 0,
      bs_equity_change: -2500,
      pnl_revenue_change: 0,
      pnl_expense_change: 2500,
      explanation_ar: 'تحميل مصروف الإهلاك بقائمة الدخل (مدين) مقابل مجمع الإهلاك الذي يخفض الدفتري للأصل الثابت في الميزانية.',
      explanation_en: 'Posts monthly depreciation expense to P&L while increasing contra-asset accumulated depreciation on Balance Sheet.'
    },
    {
      id: 'tx-8',
      title_ar: '💵 8. استحقاق رواتب الموظفين والتأمينات (Payroll Salary Accrual)',
      title_en: '8. Payroll Salary & Social Security Accrual',
      amount: 15000,
      debit_account_ar: 'حـ/ مصروف الرواتب والأجور (Gross Salary Expense)',
      debit_account_en: 'Gross Salary Expense Account',
      credit_account_ar: 'حـ/ الرواتب المستحقة (Net Salaries Payable 12,000) + حـ/ هيئة التأمينات (Social Security Payable 3,000)',
      credit_account_en: 'Salaries Payable (12,000) + Social Security Payable (3,000)',
      bs_asset_change: 0,
      bs_liability_change: 15000,
      bs_equity_change: -15000,
      pnl_revenue_change: 0,
      pnl_expense_change: 15000,
      explanation_ar: 'إثبات مصروف الأجور الشهري الكلي (مدين) مقابل إثبات الالتزامات المستحقة للدفع للموظفين وهيئة التأمينات الاجتماعية (دائن).',
      explanation_en: 'Recognizes total monthly gross salary expense (Debit) while setting up net salary payable and tax/social security liabilities (Credit).'
    },
    {
      id: 'tx-9',
      title_ar: '💱 9. إعادة تقييم الحسابات الأجنبية (Period-End Foreign Exchange Revaluation)',
      title_en: '9. Multi-Currency Period-End FX Revaluation',
      amount: 4000,
      debit_account_ar: 'حـ/ البنك - حساب العملة الأجنبية (FX Bank Account)',
      debit_account_en: 'Foreign Currency Bank Account (Asset)',
      credit_account_ar: 'حـ/ أرباح فروق عملة غير محققة (Unrealized FX Gain)',
      credit_account_en: 'Unrealized Foreign Exchange Gain Account (P&L)',
      bs_asset_change: 4000,
      bs_liability_change: 0,
      bs_equity_change: 4000,
      pnl_revenue_change: 4000,
      pnl_expense_change: 0,
      explanation_ar: 'إعادة تقييم رصيد النقدية بالعملة الأجنبية وفق سعر الصرف الإقفالي: زيادة قيمة الأصول النقية مقابل تسجيل إيراد أرباح فروق عملة.',
      explanation_en: 'Revalues foreign currency bank balance at month-end closing spot rate, recognizing unrealized FX gain in P&L.'
    },
    {
      id: 'tx-10',
      title_ar: '💳 10. دفعة مقدمة من العميل (Customer Down Payment Advance)',
      title_en: '10. Customer Down Payment Advance',
      amount: 20000,
      debit_account_ar: 'حـ/ البنك والنية (Bank Account Asset)',
      debit_account_en: 'Bank Account (Cash Asset)',
      credit_account_ar: 'حـ/ الدفعات المقدمة من العملاء (Customer Advance Liability)',
      credit_account_en: 'Customer Advances Liability Account',
      bs_asset_change: 20000,
      bs_liability_change: 20000,
      bs_equity_change: 0,
      pnl_revenue_change: 0,
      pnl_expense_change: 0,
      explanation_ar: 'استلام نقدية بالبنك (زيادة أصول) مقابل إثبات التزام دائن على الشركة بتقديم خدمات أو توريد بضاعة مستقبلاً للعميل.',
      explanation_en: 'Increases Bank Cash Asset by 20,000 while recognizing a unearned revenue liability to fulfill customer order.'
    }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📑 ${isAr ? 'محاكي القيود والتأثير المالي التفاعلي (10 حركات عملية)' : 'Journal Entry & Financial Impact Simulator (10 Real Events)'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'اختر الحركة التلقائية لتشاهد القيد المزدوج والتأثير الفوري على الميزانية وقائمة الدخل' : 'Simulate real ERP operational events to see live double-entry journal postings & statement impact'}
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
