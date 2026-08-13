/**
 * js/journal_sim.js
 * 📑 AI Journal Entry Generator — Natural Language Business Event Analyzer + Page Template Integration.
 */

const JournalSim = (function () {

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
          ${isAr ? 'صف العملية التجارية باللغة الطبيعية ليقوم الـ AI باستخراج القيد المحاسبي المزدوج:' : 'Describe Business Event in Natural Language:'}
        </label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="sim-prompt-input" class="field" placeholder="${isAr ? 'مثال: قيد أمر إنتاج، أو شراء لابتوب بـ 25 ألف، أو استلام شحنة مشتريات...' : 'e.g. Production order issue, laptop purchase, or GRN receipt...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="sim-ai-gen-btn">
            🧠 ${isAr ? 'توليد القيد بالـ AI' : 'Generate Entry'}
          </button>
        </div>
      </div>

      <div id="sim-output-box">
        ${renderSimulation({
          title: isAr ? 'قيد امر انتاج (مثال توضيحي)' : 'Production Order Journal Entry',
          amount: 25000,
          debit_account: isAr ? 'حـ/ الإنتاج تحت التشغيل (Work In Process - WIP Account)' : 'Work In Process (WIP) Account',
          credit_account: isAr ? 'حـ/ المخزون - المواد الخام (Raw Materials Inventory Account)' : 'Raw Materials Inventory Account',
          explanation: isAr ? 'إثبات إصدار أمر الإنتاج (Production Order Issue): صرف واستخدام المواد الخام من المستودع وتفريغها في حساب الإنتاج تحت التشغيل (WIP) بزيادة الأصول (WIP) بـ 25,000 EGP مقابل خفض حساب مخزون المواد الخام.' : 'Production Order Issue: Debit WIP Account vs Credit Raw Materials Account.'
        })}
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
        const isAr = I18n.getLang() === 'ar';

        box.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('journal_sim', text || 'Production Order Entry', { moduleId: modId });

        if (res.success) {
          let parsedData = res.parsed || {};
          let debitAcc = '';
          let creditAcc = '';
          let amt = 25000;
          let explanationText = '';

          // Parse numeric amount from text prompt if present
          const numMatch = (text || '').match(/\d+[\d,.]*/);
          if (numMatch) {
            const cleanNum = parseFloat(numMatch[0].replace(/,/g, ''));
            if (!isNaN(cleanNum) && cleanNum > 0) amt = cleanNum;
          }

          // Check if AI parsed JSON has entries or fields
          if (parsedData.debit_account) debitAcc = parsedData.debit_account;
          if (parsedData.credit_account) creditAcc = parsedData.credit_account;
          if (parsedData.amount) amt = parsedData.amount;
          if (parsedData.explanation) explanationText = parsedData.explanation;

          if (parsedData.entries && Array.isArray(parsedData.entries) && parsedData.entries.length >= 2) {
            debitAcc = parsedData.entries[0].account || parsedData.entries[0].account_name || debitAcc;
            creditAcc = parsedData.entries[1].account || parsedData.entries[1].account_name || creditAcc;
          }

          // Intelligent Accounting Accounts Inference
          const lowerText = (text || '').toLowerCase();

          // 1. Production Orders & Manufacturing Accounting Rule
          if (lowerText.includes('امر انتاج') || lowerText.includes('أمر إنتاج') || lowerText.includes('تصنيع') || lowerText.includes('إنتاج') || lowerText.includes('تشغيل') || lowerText.includes('wip') || lowerText.includes('خام')) {
            debitAcc = isAr ? 'حـ/ الإنتاج تحت التشغيل (Work In Process - WIP Account)' : 'Work In Process (WIP) Account';
            creditAcc = isAr ? 'حـ/ المخزون - المواد الخام (Raw Materials Inventory Account)' : 'Raw Materials Inventory Account';
            if (!explanationText) {
              explanationText = isAr
                ? `إثبات إصدار أمر الإنتاج (Production Order Issue): صرف المواد الخام من المستودع وتفريغ تكاليف التشكيل في حساب الإنتاج تحت التشغيل (WIP) بزيادة الأصول (WIP) بـ ${amt.toLocaleString()} EGP مقابل خفض حساب مخزون المواد الخام.`
                : `Production Order Issue: Debit WIP Account vs Credit Raw Materials Inventory Account.`;
            }
          }
          // 2. Fixed Assets Purchase Rule
          else if (lowerText.includes('لابتوب') || lowerText.includes('أصل') || lowerText.includes('سيارة') || lowerText.includes('مبنى') || lowerText.includes('كمبيوتر') || lowerText.includes('معدة')) {
            debitAcc = isAr ? 'حـ/ الأصول الثابتة - أجهزة ومعدات (Fixed Assets Account)' : 'Fixed Assets Account';
            if (!creditAcc) creditAcc = lowerText.includes('نقداً') ? (isAr ? 'حـ/ الصندوق (Cash Account)' : 'Cash') : (isAr ? 'حـ/ الموردين (Accounts Payable / Vendors)' : 'Accounts Payable');
            if (!explanationText) {
              explanationText = isAr
                ? `إثبات شراء أصل ثابت (${text}): زيادة الأصول الثابتة بـ ${amt.toLocaleString()} EGP مقابل إثبات التزام الموردين/البنك وتسجيل الأصل في سجل الأصول الثابتة.`
                : `Fixed Asset Purchase: Debit Fixed Assets vs Credit Accounts Payable.`;
            }
          }
          // 3. Inventory Receipt GRN Rule
          else if (lowerText.includes('مخزون') || lowerText.includes('بضاعة') || lowerText.includes('شحنة') || lowerText.includes('grn')) {
            debitAcc = isAr ? 'حـ/ المخزون (Inventory Asset Account)' : 'Inventory Asset Account';
            creditAcc = isAr ? 'حـ/ المشتريات المعلقة (GR/IR Interim Accrual Account)' : 'GR/IR Accrual Account';
            if (!explanationText) {
              explanationText = isAr
                ? `إثبات استلام الشحنة والمخزون: زيادة الأصول (المخزون) بـ ${amt.toLocaleString()} EGP مقابل قيد التزام مؤقت حتى وصول فاتورة المورد.`
                : `Goods Receipt Note: Debit Inventory vs Credit GR/IR Accrual Account.`;
            }
          }
          // 4. Default Fallback
          else {
            if (!debitAcc) debitAcc = isAr ? 'حـ/ الأصول / المصروفات (Assets / Expenses Account)' : 'Assets / Expenses Account';
            if (!creditAcc) creditAcc = isAr ? 'حـ/ الموردين / البنك (Accounts Payable / Bank Account)' : 'Accounts Payable / Bank';
            if (!explanationText) {
              explanationText = isAr
                ? `إثبات عملية (${text}): زيادة الجانب المدين في (${debitAcc}) بـ ${amt.toLocaleString()} EGP مقابل إثبات الجانب الدائن في (${creditAcc}).`
                : `Recording (${text}): Debit (${debitAcc}) vs Credit (${creditAcc}).`;
            }
          }

          box.innerHTML = renderSimulation({
            title: text || (isAr ? 'قيد محاسبي جديد بالـ AI' : 'New AI Journal Entry'),
            amount: amt,
            debit_account: debitAcc,
            credit_account: creditAcc,
            explanation: explanationText
          });
        } else {
          box.innerHTML = renderSimulation({
            title: text || (isAr ? 'قيد محاسبي متولد' : 'Generated Entry'),
            amount: 25000,
            debit_account: isAr ? 'حـ/ الإنتاج تحت التشغيل (Work In Process - WIP Account)' : 'WIP Account',
            credit_account: isAr ? 'حـ/ المخزون - المواد الخام (Raw Materials Inventory)' : 'Raw Materials Account',
            explanation: isAr ? 'إثبات إصدار أمر الإنتاج: زيادة حساب الإنتاج تحت التشغيل (WIP) مقابل خفض مخزون المواد الخام.' : 'Production Order Entry.'
          });
        }
      });
    }
  }

  function renderSimulation(txData) {
    const isAr = I18n.getLang() === 'ar';
    const tx = (typeof txData === 'object' && txData !== null) ? txData : {};

    const title = tx.title || (isAr ? 'القيد المحاسبي' : 'Journal Entry');
    const amount = (typeof tx.amount === 'number') ? tx.amount : 25000;
    const debitAccount = tx.debit_account || (isAr ? 'حـ/ الحساب المدين' : 'Debit Account');
    const creditAccount = tx.credit_account || (isAr ? 'حـ/ الحساب الدائن' : 'Credit Account');
    const explanation = tx.explanation || '';

    return `
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:15px; margin:0;">📑 ${Topics.escapeHtml(title)}</h3>
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
              <tr>
                <td><span class="badge badge-status-mastered" style="font-size:11px;">${isAr ? 'مدين (Dr)' : 'Debit (Dr)'}</span></td>
                <td><strong>${Topics.escapeHtml(debitAccount)}</strong></td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--teal);">${amount.toLocaleString()}</td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--ink-soft);">0</td>
              </tr>
              <tr>
                <td><span class="badge badge-status-learning" style="font-size:11px;">${isAr ? 'دائن (Cr)' : 'Credit (Cr)'}</span></td>
                <td><strong>${Topics.escapeHtml(creditAccount)}</strong></td>
                <td style="text-align:end; font-family:var(--font-mono); color:var(--ink-soft);">0</td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--brass-deep);">${amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${explanation ? `
          <div style="padding:12px; background:var(--line-soft); border-radius:var(--radius-sm); border-inline-start:3px solid var(--teal);">
            <p style="margin:0; font-size:13px; color:var(--ink); line-height:1.5;">
              💡 <strong>${isAr ? 'التوضيح المحاسبي والدورة الإجرائية:' : 'Accounting Explanation:'}</strong> ${Topics.escapeHtml(explanation)}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  return { render };
})();
