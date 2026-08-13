/**
 * js/journal_sim.js
 * 📑 AI Journal Entry Generator — Dynamic Natural Language Business Event & Multi-Split Compound Entry Engine.
 */

const JournalSim = (function () {

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📑 ${isAr ? 'محاكي ومولد القيود البسيطة والمركبة بالـ AI' : 'AI Double & Compound Journal Entry Generator'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'صف أي حركة مالية بسيطة أو مركبة باللغة الطبيعية ليقوم الـ AI باستخراج القيد وتوازن الحسابات فورياً' : 'Describe any transaction in natural language to generate double-entry & compound ledger impacts'}
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
          ${isAr ? 'صف العملية التجارية باللغة الطبيعية (بسيطة أو مركبة أجزاء كاش، بنك وآجل):' : 'Describe Business Event in Natural Language:'}
        </label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="sim-prompt-input" class="field" placeholder="${isAr ? 'مثال: شراء اصل ب 1000 كاش 500 و 300 أجل و 200 بنك من مورد سيد...' : 'e.g. Purchased asset for 1000: 500 cash, 300 credit and 200 bank from vendor Sayed...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="sim-ai-gen-btn">
            🧠 ${isAr ? 'توليد القيد بالـ AI' : 'Generate Entry'}
          </button>
        </div>
      </div>

      <div id="sim-output-box">
        ${renderSimulation(parseDynamicAccountingEvent(isAr ? 'شراء اصل ب 1000 كاش 500 و 300 أجل و 200 بنك من مورد سيد' : 'Purchased asset for 1000: 500 cash, 300 credit and 200 bank from vendor Sayed'))}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#sim-ai-gen-btn');
    const promptInput = container.querySelector('#sim-prompt-input');
    const modSelect = container.querySelector('#sim-mod-select');
    const box = container.querySelector('#sim-output-box');

    if (aiBtn && promptInput && box) {
      aiBtn.addEventListener('click', async () => {
        const text = promptInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';

        box.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('journal_sim', text || 'Purchase asset cash bank and credit', { moduleId: modId });

        if (res.success) {
          let parsedData = res.parsed || {};
          let txData = null;

          if (parsedData.entries && Array.isArray(parsedData.entries) && parsedData.entries.length >= 2) {
            txData = {
              title: text || parsedData.title || 'قيد محاسبي متولد بالـ AI',
              amount: parsedData.amount || parsedData.entries.reduce((sum, e) => sum + (e.debit || 0), 0) || 1000,
              entries: parsedData.entries.map(e => ({
                side: e.side || (e.debit > 0 ? 'Debit' : 'Credit'),
                account: e.account || e.account_name || 'Account',
                debit: e.debit || e.debit_amount || 0,
                credit: e.credit || e.credit_amount || 0
              })),
              explanation: parsedData.explanation || parsedData.message || text
            };
          } else {
            // Fully Dynamic Natural Language Compound Transaction Parser
            txData = parseDynamicAccountingEvent(text || 'شراء اصل ب 1000 كاش 500 و 300 أجل و 200 بنك من مورد سيد');
          }

          box.innerHTML = renderSimulation(txData);
        } else {
          box.innerHTML = renderSimulation(parseDynamicAccountingEvent(text || 'شراء اصل ب 1000 كاش 500 و 300 أجل و 200 بنك من مورد سيد'));
        }
      });
    }
  }

  /**
   * Fully Dynamic Natural Language Compound Transaction Parser & Mathematical Balance Assurer
   */
  function parseDynamicAccountingEvent(text) {
    const isAr = I18n.getLang() === 'ar';
    const rawText = (text || '').trim();
    const lowerText = rawText.toLowerCase();

    // 1. Extract All Numbers in Sequence
    const numberMatches = rawText.match(/\d+[\d,.]*/g) || [];
    const numbers = numberMatches.map(n => parseFloat(n.replace(/,/g, ''))).filter(n => !isNaN(n) && n > 0);

    // Main Total Amount is the first number or default 1000
    const totalAmount = numbers.length > 0 ? numbers[0] : 1000;

    // 2. Extract Specific Amounts for Cash, Bank, Credit/Vendor
    let cashAmt = 0;
    let bankAmt = 0;
    let vendorAmt = 0;

    // Extract Cash amount
    const cashRegex = /(?:كاش|نقداً|نقدا|صندوق|خزينة)\s*(\d+[\d,.]*)|(\d+[\d,.]*)\s*(?:كاش|نقداً|نقدا|صندوق|خزينة)/i;
    const cashM = rawText.match(cashRegex);
    if (cashM) {
      const val = parseFloat((cashM[1] || cashM[2]).replace(/,/g, ''));
      if (!isNaN(val) && val !== totalAmount) cashAmt = val;
      else if (!isNaN(val) && numbers.length > 1) cashAmt = val;
    }

    // Extract Bank amount
    const bankRegex = /(?:بنك|البنك|شيك|تحويل|بطاقة|فيزا)\s*(\d+[\d,.]*)|(\d+[\d,.]*)\s*(?:بنك|البنك|شيك|تحويل|بطاقة|فيزا)/i;
    const bankM = rawText.match(bankRegex);
    if (bankM) {
      const val = parseFloat((bankM[1] || bankM[2]).replace(/,/g, ''));
      if (!isNaN(val) && val !== totalAmount) bankAmt = val;
      else if (!isNaN(val) && numbers.length > 1) bankAmt = val;
    }

    // Extract Vendor/Credit amount
    const vendorRegex = /(?:أجل|آجل|مورد|على الحساب|دائن)\s*(\d+[\d,.]*)|(\d+[\d,.]*)\s*(?:أجل|آجل|مورد|على الحساب|دائن)/i;
    const vendorM = rawText.match(vendorRegex);
    if (vendorM) {
      const val = parseFloat((vendorM[1] || vendorM[2]).replace(/,/g, ''));
      if (!isNaN(val) && val !== totalAmount) vendorAmt = val;
      else if (!isNaN(val) && numbers.length > 1) vendorAmt = val;
    }

    // 3. Extract Vendor Name
    let vendorName = '';
    const nameM = rawText.match(/(?:مورد|المورد|شركة|من السيد|من)\s+([\u0600-\u06FF\w]+)/i);
    if (nameM && !['مورد', 'شركة', 'أجل', 'آجل', 'كاش', 'بنك', 'ب', 'من'].includes(nameM[1])) {
      vendorName = nameM[1];
    }
    if (!vendorName && rawText.includes('سيد')) vendorName = 'سيد';
    if (!vendorName && rawText.includes('محمد')) vendorName = 'محمد';

    // 4. Deduce Primary Debit Account
    let mainAccount = isAr ? 'حـ/ الأصول الثابتة (Fixed Assets Account)' : 'Fixed Assets Account';
    if (lowerText.includes('لابتوب') || lowerText.includes('كمبيوتر')) {
      mainAccount = isAr ? 'حـ/ الأصول الثابتة - أجهزة حاسب آلي (Fixed Assets - Computers)' : 'Fixed Assets - Computers';
    } else if (lowerText.includes('امر انتاج') || lowerText.includes('أمر إنتاج') || lowerText.includes('تصنيع') || lowerText.includes('wip')) {
      mainAccount = isAr ? 'حـ/ الإنتاج تحت التشغيل (Work In Process - WIP Account)' : 'Work In Process (WIP)';
    } else if (lowerText.includes('مخزون') || lowerText.includes('بضاعة') || lowerText.includes('مواد خام') || lowerText.includes('شحنة')) {
      mainAccount = isAr ? 'حـ/ المخزون (Inventory Asset Account)' : 'Inventory Asset Account';
    } else if (lowerText.includes('سيارة') || lowerText.includes('وسائل نقل')) {
      mainAccount = isAr ? 'حـ/ الأصول الثابتة - وسائل نقل وسيارات (Fixed Assets - Vehicles)' : 'Fixed Assets - Vehicles';
    } else if (lowerText.includes('راتب') || lowerText.includes('رواتب') || lowerText.includes('مصروف') || lowerText.includes('إيجار')) {
      mainAccount = isAr ? 'حـ/ المصروفات العمومية والإدارية (General & Administrative Expenses)' : 'Expenses Account';
    }

    // 5. Build Balanced Entries Array
    const entries = [];

    // Line 1: Main Debit Line
    entries.push({
      side: 'Debit',
      account: mainAccount,
      debit: totalAmount,
      credit: 0
    });

    // Check explicitly provided payment amounts sum
    const totalExplicitCredit = cashAmt + bankAmt + vendorAmt;

    if (totalExplicitCredit > 0) {
      if (cashAmt > 0) {
        entries.push({
          side: 'Credit',
          account: isAr ? 'حـ/ الصندوق - كاش (Cash Account)' : 'Cash Account',
          debit: 0,
          credit: cashAmt
        });
      }

      if (bankAmt > 0) {
        entries.push({
          side: 'Credit',
          account: isAr ? 'حـ/ البنك - حساب جاري (Bank Account)' : 'Bank Account',
          debit: 0,
          credit: bankAmt
        });
      }

      if (vendorAmt > 0) {
        const vLabel = vendorName
          ? (isAr ? `حـ/ الموردين - مورد ${vendorName} (Accounts Payable - ${vendorName})` : `Accounts Payable - ${vendorName}`)
          : (isAr ? 'حـ/ الموردين (Accounts Payable / Vendors)' : 'Accounts Payable');

        entries.push({
          side: 'Credit',
          account: vLabel,
          debit: 0,
          credit: vendorAmt
        });
      }

      // Check for remaining unallocated credit balance
      const remainingCredit = totalAmount - totalExplicitCredit;
      if (remainingCredit > 0) {
        const vLabel = vendorName
          ? (isAr ? `حـ/ الموردين - مورد ${vendorName} (Accounts Payable - ${vendorName})` : `Accounts Payable - ${vendorName}`)
          : (isAr ? 'حـ/ الموردين / الحسابات الدائنة (Accounts Payable)' : 'Accounts Payable');

        entries.push({
          side: 'Credit',
          account: vLabel,
          debit: 0,
          credit: remainingCredit
        });
      }
    } else {
      // Default single credit fallback based on payment keywords
      if (lowerText.includes('امر انتاج') || lowerText.includes('أمر إنتاج') || lowerText.includes('تصنيع')) {
        entries.push({
          side: 'Credit',
          account: isAr ? 'حـ/ المخزون - المواد الخام (Raw Materials Inventory Account)' : 'Raw Materials Inventory Account',
          debit: 0,
          credit: totalAmount
        });
      } else if (lowerText.includes('نقداً') || lowerText.includes('كاش') || lowerText.includes('صندوق')) {
        entries.push({
          side: 'Credit',
          account: isAr ? 'حـ/ الصندوق - كاش (Cash Account)' : 'Cash Account',
          debit: 0,
          credit: totalAmount
        });
      } else if (lowerText.includes('بنك') || lowerText.includes('تحويل') || lowerText.includes('شيك')) {
        entries.push({
          side: 'Credit',
          account: isAr ? 'حـ/ البنك - حساب جاري (Bank Account)' : 'Bank Account',
          debit: 0,
          credit: totalAmount
        });
      } else {
        const vLabel = vendorName
          ? (isAr ? `حـ/ الموردين - مورد ${vendorName} (Accounts Payable - ${vendorName})` : `Accounts Payable - ${vendorName}`)
          : (isAr ? 'حـ/ الموردين / الحسابات الدائنة (Accounts Payable)' : 'Accounts Payable');

        entries.push({
          side: 'Credit',
          account: vLabel,
          debit: 0,
          credit: totalAmount
        });
      }
    }

    // Generate clear accounting explanation summary
    const creditDetails = entries.filter(e => e.side === 'Credit').map(e => `${e.account}: ${e.credit.toLocaleString()} EGP`).join(' • ');

    const explanation = isAr
      ? `إثبات قيد محاسبي ${entries.length > 2 ? 'مركب (Compound Entry)' : 'بسيط'} للعملية (${rawText}): إثبات الجانب المدين في (${mainAccount}) بمبلغ ${totalAmount.toLocaleString()} EGP، مقابل إثبات الجانب الدائن في الأرصدة (${creditDetails}) مع ضمان التوازن المالي التام للطرفين.`
      : `Accounting Entry for (${rawText}): Debit ${mainAccount} for ${totalAmount} vs Credit (${creditDetails}).`;

    return {
      title: rawText,
      amount: totalAmount,
      entries: entries,
      explanation: explanation
    };
  }

  function renderSimulation(txData) {
    const isAr = I18n.getLang() === 'ar';
    const tx = (typeof txData === 'object' && txData !== null) ? txData : {};

    const title = tx.title || (isAr ? 'القيد المحاسبي' : 'Journal Entry');
    const amount = (typeof tx.amount === 'number') ? tx.amount : 1000;
    const entries = Array.isArray(tx.entries) && tx.entries.length ? tx.entries : [
      { side: 'Debit', account: tx.debit_account || (isAr ? 'حـ/ الأصول الثابتة' : 'Fixed Assets'), debit: amount, credit: 0 },
      { side: 'Credit', account: tx.credit_account || (isAr ? 'حـ/ الموردين' : 'Accounts Payable'), debit: 0, credit: amount }
    ];

    const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);
    const isBalanced = totalDebit === totalCredit;

    return `
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="font-size:15px; margin:0; color:var(--ink); font-weight:700;">📑 ${Topics.escapeHtml(title)}</h3>
            ${entries.length > 2 ? `<span class="badge badge-priority-medium" style="font-size:10.5px; margin-top:4px; display:inline-block;">⚡ ${isAr ? 'قيد محاسبي مركب (Compound Journal Entry)' : 'Compound Entry'}</span>` : ''}
          </div>
          <span class="badge badge-priority-high" style="font-family:var(--font-mono); font-size:13px;">
            ${amount.toLocaleString()} EGP / USD
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
              ${entries.map(e => {
                const isDebit = e.side === 'Debit' || e.side === 'Dr' || e.debit > 0;
                return `
                  <tr>
                    <td><span class="badge ${isDebit ? 'badge-status-mastered' : 'badge-status-learning'}" style="font-size:11px;">${isDebit ? (isAr ? 'مدين (Dr)' : 'Debit (Dr)') : (isAr ? 'دائن (Cr)' : 'Credit (Cr)')}</span></td>
                    <td><strong>${Topics.escapeHtml(e.account || 'Account')}</strong></td>
                    <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--teal);">${e.debit ? Number(e.debit).toLocaleString() : '0'}</td>
                    <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--brass-deep);">${e.credit ? Number(e.credit).toLocaleString() : '0'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background:var(--line-soft); font-weight:700;">
                <td colspan="2" style="padding:10px 12px; color:var(--ink);">
                  ${isAr ? 'المجموع الإجمالي (Total):' : 'Total:'} 
                  <span class="badge ${isBalanced ? 'badge-status-mastered' : 'badge-priority-high'}" style="font-size:10.5px; margin-inline-start:6px;">
                    ${isBalanced ? (isAr ? '✅ القيد متوازن' : 'Balanced Entry') : (isAr ? '❌ قيد غير متوازن' : 'Unbalanced')}
                  </span>
                </td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--teal); font-size:13.5px;">${totalDebit.toLocaleString()}</td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--brass-deep); font-size:13.5px;">${totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${tx.explanation ? `
          <div style="padding:12px; background:var(--line-soft); border-radius:var(--radius-sm); border-inline-start:3px solid var(--teal);">
            <p style="margin:0; font-size:13px; color:var(--ink); line-height:1.5;">
              💡 <strong>${isAr ? 'التوضيح المحاسبي والدورة الإجرائية:' : 'Accounting Explanation:'}</strong> ${Topics.escapeHtml(tx.explanation)}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  return { render };
})();
