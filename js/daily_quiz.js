/**
 * js/daily_quiz.js
 * Daily ERP Scenario Quiz & Challenge Engine.
 * 0ms Instant local render with streak & XP tracking.
 */

const DailyQuiz = (function () {
  const SCORE_KEY = 'erp_tracker_quiz_score_v1';

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      module_id: 'MOD-1',
      module_name: 'المخزون (Inventory)',
      question_ar: 'عند صرف بضاعة مباعة للعميل في نظام ERP يعتمد تقييم المخزون الآلي (Automated FIFO)، ما هو القيد المحاسبي المتولد تلقائياً؟',
      question_en: 'When issuing sold goods to a customer in an automated FIFO inventory ERP system, what is the automatic journal entry?',
      options: [
        { text_ar: 'من حـ/ تكلفة البضاعة المباعة (COGS) — إلى حـ/ المخزون', text_en: 'Dr. Cost of Goods Sold (COGS) — Cr. Inventory', correct: true },
        { text_ar: 'من حـ/ العملاء — إلى حـ/ المبيعات', text_en: 'Dr. Accounts Receivable — Cr. Sales', correct: false },
        { text_ar: 'من حـ/ المخزون — إلى حـ/ المشتريات', text_en: 'Dr. Inventory — Cr. Purchases', correct: false },
        { text_ar: 'من حـ/ تسوية المخزون — إلى حـ/ الأرباح والخسائر', text_en: 'Dr. Inventory Adjustment — Cr. P&L', correct: false }
      ],
      explanation_ar: 'عند صرف البضاعة من المستودع، يُسجل النظام قيد التكلفة فورياً: خفض حساب المخزون بالأصل (دائن) مقابل تحميل حساب تكلفة البضاعة المباعة (مدين). فاتورة المبيعات تسجل قيد الإيراد بشكل منفصل.',
      explanation_en: 'Upon goods issue, the ERP registers the inventory movement: reducing Inventory (Credit) and recognizing Cost of Goods Sold (Debit). Invoice generation handles the revenue entry separately.'
    },
    {
      id: 2,
      module_id: 'MOD-2',
      module_name: 'الحسابات والمالية (Accounting & Finance)',
      question_ar: 'في نهاية الفترة المالية، عند إعادة تقييم الحسابات بالعملات الأجنبية (Multi-currency Revaluation)، كيف تُعامل أرباح/خسائر فروق العملة غير المحققة؟',
      question_en: 'At period-end multi-currency revaluation, how are unrealized foreign exchange gains/losses treated?',
      options: [
        { text_ar: 'تُرحل إلى حساب أرباح/خسائر فروق عملة غير محققة في قائمة الدخل مع إمكانية العكس في بداية الفترة التالية', text_en: 'Posted to Unrealized FX Gain/Loss in P&L with reversing entry at next period start', correct: true },
        { text_ar: 'تُضاف مباشرة لحساب رأس المال بدون التأثير على قائمة الدخل', text_en: 'Added directly to Equity without affecting P&L', correct: false },
        { text_ar: 'تُلغى تماماً ولا يتم تسجيل أي قيد حتى يتم السداد الفعلي', text_en: 'Ignored completely until actual payment occurs', correct: false },
        { text_ar: 'تُحسب كخصم تجاري على العميل', text_en: 'Calculated as a trade discount', correct: false }
      ],
      explanation_ar: 'إعادة التقييم بنهاية الشهر تقيم الأرصدة القائمة بسعر الصرف الحالي، وتُسجل الفرق في حساب فروق العملة غير المحققة بقائمة الدخل، وتُعكس تلقائياً في بداية الشهر التالي لتجنب تكرار التأثير عند السداد الفعلي.',
      explanation_en: 'Period-end revaluation evaluates open balances at current spot rates, posting the unrealized gain/loss to P&L, which is automatically reversed at the start of the next period.'
    },
    {
      id: 3,
      module_id: 'MOD-3',
      module_name: 'المشتريات والموردين (Purchasing)',
      question_ar: 'ما هو الهدف الأساسي من مطابقة الفواتير الثلاثية (3-Way Matching) في موديول المشتريات؟',
      question_en: 'What is the primary objective of 3-Way Matching in the Purchasing module?',
      options: [
        { text_ar: 'التحقق من مطابقة الكميات والأسعار بين أمر الشراء (PO) وسند الاستلام (GRN) وفاتورة المورد (Vendor Invoice)', text_en: 'Verify quantity & price alignment between Purchase Order, Goods Receipt, and Vendor Invoice', correct: true },
        { text_ar: 'مقارنة أسعار المورد مع 3 موردين منافسين', text_en: 'Compare prices with 3 competing vendors', correct: false },
        { text_ar: 'طباعة 3 نسخ من طلب الشراء للأرشيف', text_en: 'Print 3 copies of PO for archiving', correct: false },
        { text_ar: 'المطابقة بين خصم المورد والضريبة والخصم النقدي', text_en: 'Match vendor discount, VAT, and cash discount', correct: false }
      ],
      explanation_ar: 'المطابقة الثلاثية (3-Way Match) هي الرقابة الأساسية لحماية أموال الشركة، حيث يرفض النظام صرف فاتورة المورد إلا إذا تطابقت كمياتها وأسعارها مع أمر الشراء وما تم استلامه فعلياً في المستودع.',
      explanation_en: '3-Way Matching ensures internal control by ensuring vendor invoices are only paid if items, quantities, and prices strictly match PO and Goods Receipt Note (GRN).'
    },
    {
      id: 4,
      module_id: 'MOD-4',
      module_name: 'المبيعات والعملاء (Sales & CRM)',
      question_ar: 'عند اعتماد طلب مبيعات (Sales Order) في الـ ERP، ما هو الإجراء التلقائي الذي يقوم به النظام للمخزون؟',
      question_en: 'Upon confirming a Sales Order in ERP, what automatic inventory action is triggered?',
      options: [
        { text_ar: 'حجز الكمية المطلوب بيعها (Reserved / Allocated Quantity) دون خصمها من المخزون الفعلي', text_en: 'Reserves/allocates the requested quantity without deducting actual physical stock', correct: true },
        { text_ar: 'خصم الكمية فورياً من المستودع الفعلي', text_en: 'Immediately deducts stock from physical warehouse', correct: false },
        { text_ar: 'إلغاء أي طلبات شراء قادمة للصنف', text_en: 'Cancels any incoming POs for that item', correct: false },
        { text_ar: 'إنشاء قيد محاسبي دائن بحساب العميل', text_en: 'Creates a credit journal entry on customer account', correct: false }
      ],
      explanation_ar: 'طلب المبيعات المؤكد يقوم بعمل "حجز" (Reserved/Allocated) للكمية لمنع بيعها لعميل آخر، بينما يتم الخصم الفعلي من المخزون المتاح (Physical Hand) عند إذن الصرف (Delivery Order).',
      explanation_en: 'Confirming a Sales Order reserves stock to prevent double-allocation, whereas physical inventory deduction occurs upon Delivery Note processing.'
    },
    {
      id: 5,
      module_id: 'MOD-6',
      module_name: 'التصنيع والإنتاج (Manufacturing / MRP)',
      question_ar: 'ما هي قائمة المكونات (BOM - Bill of Materials) في موديول التصنيع بالـ ERP؟',
      question_en: 'What is a Bill of Materials (BOM) in the Manufacturing ERP module?',
      options: [
        { text_ar: 'قائمة تفصيلية بالخامات والكميات والمكونات اللازمة لإنتاج وحدة واحدة من المنتج النهائي', text_en: 'A detailed list of raw materials, quantities, and components required to produce 1 unit of finished product', correct: true },
        { text_ar: 'فاتورة الحساب المالي الموحدة لمصانع التوريد', text_en: 'Unified financial invoice for supply factories', correct: false },
        { text_ar: 'بيان أسماء عمال خط الإنتاج والأجور', text_en: 'List of production line workers and wages', correct: false },
        { text_ar: 'تقرير الصيانة الدورية لآلات المصنع', text_en: 'Periodic maintenance report for factory machinery', correct: false }
      ],
      explanation_ar: 'تعد قائمة المكونات (BOM) قلب نظام التصنيع (MRP)، حيث يحدد فيها النظام المكونات والخامات المطلوبة ومحطات العمل (Work Centers) لحساب التكلفة المعيارية واحتياجات المواد.',
      explanation_en: 'The BOM is the core recipe in MRP specifying exact raw material components and routing operations required to build the finished good.'
    }
  ];

  function getSavedData() {
    try {
      const raw = localStorage.getItem(SCORE_KEY);
      return raw ? JSON.parse(raw) : { streak: 1, xp: 50, answered: {} };
    } catch (e) {
      return { streak: 1, xp: 50, answered: {} };
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(SCORE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getTodayQuestionIndex() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dayOfYear % QUIZ_QUESTIONS.length;
  }

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const store = getSavedData();
    const qIdx = getTodayQuestionIndex();
    const q = QUIZ_QUESTIONS[qIdx];
    const isAnswered = store.answered && store.answered[q.id];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🎯 ${isAr ? 'التحدي اليومي لخبرات الـ ERP' : 'Daily ERP Challenge & Quiz'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'تحدي يومي سريع لاختبار المفاهيم المحاسبية والتشغيلية وزيادة نقاط الخبرة' : 'Daily scenario quiz to test your ERP domain knowledge and earn XP'}
          </small>
        </div>

        <div style="display:flex; gap:12px;">
          <div class="card" style="padding:8px 14px; display:flex; align-items:center; gap:6px;">
            <span style="font-size:18px;">🔥</span>
            <div>
              <small style="color:var(--ink-soft); display:block; font-size:10px;">${isAr ? 'سلسلة التحدي' : 'Quiz Streak'}</small>
              <strong style="font-family:var(--font-mono);">${store.streak || 1} ${isAr ? 'أيام' : 'days'}</strong>
            </div>
          </div>

          <div class="card" style="padding:8px 14px; display:flex; align-items:center; gap:6px;">
            <span style="font-size:18px;">⭐</span>
            <div>
              <small style="color:var(--ink-soft); display:block; font-size:10px;">${isAr ? 'نقاط الخبرة' : 'Total XP'}</small>
              <strong style="color:var(--brass); font-family:var(--font-mono);">${store.xp || 50} XP</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="card" id="quiz-card" style="margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <span class="badge badge-status-learning">${q.module_name}</span>
          <small style="color:var(--ink-soft); font-family:var(--font-mono);">#${q.id} of ${QUIZ_QUESTIONS.length}</small>
        </div>

        <h3 style="margin-bottom:18px; line-height:1.5;">${isAr ? q.question_ar : q.question_en}</h3>

        <div id="quiz-options-container" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
          ${q.options.map((opt, idx) => `
            <button class="btn quiz-option-btn" data-opt-idx="${idx}" style="justify-content:flex-start; text-align:start; padding:12px 16px; width:100%; border-radius:var(--radius-md);">
              <span style="width:24px; height:24px; border-radius:50%; background:var(--line-soft); display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; margin-inline-end:10px; flex-shrink:0;">${String.fromCharCode(65 + idx)}</span>
              <span>${isAr ? opt.text_ar : opt.text_en}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-result-box" style="display:none; padding:16px; border-radius:var(--radius-md); background:var(--line-soft); border-inline-start:4px solid var(--brass);">
          <h4 id="quiz-result-title" style="margin-bottom:6px;"></h4>
          <p id="quiz-result-exp" style="margin:0; font-size:13px; color:var(--ink-soft); line-height:1.5;"></p>
        </div>
      </div>

      <!-- Question Navigation -->
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <small style="color:var(--ink-soft);">${isAr ? 'يتجدد السؤال تلقائياً يومياً' : 'Questions refresh daily automatically'}</small>
        <button class="btn btn-secondary" id="quiz-next-btn">
          ${isAr ? 'السؤال التالي ➔' : 'Next Question ➔'}
        </button>
      </div>
    `;

    bindQuizEvents(container, qIdx, store);
  }

  function bindQuizEvents(container, currentQIdx, store) {
    let activeQIdx = currentQIdx;

    const optBtns = container.querySelectorAll('.quiz-option-btn');
    const resultBox = container.querySelector('#quiz-result-box');
    const resultTitle = container.querySelector('#quiz-result-title');
    const resultExp = container.querySelector('#quiz-result-exp');
    const nextBtn = container.querySelector('#quiz-next-btn');

    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.optIdx, 10);
        const q = QUIZ_QUESTIONS[activeQIdx];
        const isAr = I18n.getLang() === 'ar';
        const selectedOpt = q.options[idx];

        optBtns.forEach(b => b.disabled = true);

        if (selectedOpt.correct) {
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
          btn.style.borderColor = '#10b981';
          resultTitle.textContent = isAr ? '🎉 إجابة صحيحة! (+20 XP)' : '🎉 Correct Answer! (+20 XP)';
          resultTitle.style.color = '#10b981';

          if (!store.answered[q.id]) {
            store.xp = (store.xp || 50) + 20;
            store.answered[q.id] = true;
            saveData(store);
          }
        } else {
          btn.style.background = 'rgba(239, 68, 68, 0.15)';
          btn.style.borderColor = '#ef4444';
          resultTitle.textContent = isAr ? '❌ إجابة غير صحيحة' : '❌ Incorrect Answer';
          resultTitle.style.color = '#ef4444';

          // Highlight correct option
          q.options.forEach((o, i) => {
            if (o.correct) {
              const correctBtn = container.querySelector(`[data-opt-idx="${i}"]`);
              if (correctBtn) {
                correctBtn.style.background = 'rgba(16, 185, 129, 0.15)';
                correctBtn.style.borderColor = '#10b981';
              }
            }
          });
        }

        resultExp.textContent = isAr ? q.explanation_ar : q.explanation_en;
        resultBox.style.display = 'block';
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeQIdx = (activeQIdx + 1) % QUIZ_QUESTIONS.length;
        renderQuestion(container, activeQIdx, store);
      });
    }
  }

  function renderQuestion(container, qIdx, store) {
    const q = QUIZ_QUESTIONS[qIdx];
    const isAr = I18n.getLang() === 'ar';

    const card = container.querySelector('#quiz-card');
    if (!card) return;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span class="badge badge-status-learning">${q.module_name}</span>
        <small style="color:var(--ink-soft); font-family:var(--font-mono);">#${q.id} of ${QUIZ_QUESTIONS.length}</small>
      </div>

      <h3 style="margin-bottom:18px; line-height:1.5;">${isAr ? q.question_ar : q.question_en}</h3>

      <div id="quiz-options-container" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
        ${q.options.map((opt, idx) => `
          <button class="btn quiz-option-btn" data-opt-idx="${idx}" style="justify-content:flex-start; text-align:start; padding:12px 16px; width:100%; border-radius:var(--radius-md);">
            <span style="width:24px; height:24px; border-radius:50%; background:var(--line-soft); display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; margin-inline-end:10px; flex-shrink:0;">${String.fromCharCode(65 + idx)}</span>
            <span>${isAr ? opt.text_ar : opt.text_en}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-result-box" style="display:none; padding:16px; border-radius:var(--radius-md); background:var(--line-soft); border-inline-start:4px solid var(--brass);">
        <h4 id="quiz-result-title" style="margin-bottom:6px;"></h4>
        <p id="quiz-result-exp" style="margin:0; font-size:13px; color:var(--ink-soft); line-height:1.5;"></p>
      </div>
    `;

    bindQuizEvents(container, qIdx, store);
  }

  return { render };
})();
