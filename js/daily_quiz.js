/**
 * js/daily_quiz.js
 * 🎯 AI Daily ERP Challenge — Dynamic AI Question Generator + Static Fallback.
 * Integrates with AIService for personalized AI questions per module & difficulty.
 */

const DailyQuiz = (function () {
  const SCORE_KEY = 'erp_tracker_quiz_score_v1';

  const QUIZ_QUESTIONS = [
    {
      id: 1, module_id: 'MOD-1', module_name: 'المخزون (Inventory)',
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
      id: 2, module_id: 'MOD-2', module_name: 'الحسابات والمالية (Accounting & Finance)',
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
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % QUIZ_QUESTIONS.length;
  }

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const store = getSavedData();
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const qIdx = getTodayQuestionIndex();
    const q = QUIZ_QUESTIONS[qIdx];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🎯 ${isAr ? 'التحدي اليومي لخبرات الـ ERP (مولّد الـ AI)' : 'AI Daily ERP Challenge'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'تحدي يومي سيناريو ذكي مخصص بناءً على مستوى معرفتك وفجوات التعلم' : 'Adaptive scenario quiz powered by AI based on your skill gaps & progress'}
          </small>
        </div>

        <div style="display:flex; gap:12px; align-items:center;">
          <select id="quiz-mod-select" class="field" style="margin:0; padding:6px 10px; font-size:12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en}</option>`).join('')}
          </select>

          <div class="card" style="padding:6px 12px; display:flex; align-items:center; gap:6px;">
            <span>🔥</span>
            <strong style="font-family:var(--font-mono); font-size:13px;">${store.streak || 1} ${isAr ? 'أيام' : 'days'}</strong>
          </div>

          <div class="card" style="padding:6px 12px; display:flex; align-items:center; gap:6px;">
            <span>⭐</span>
            <strong style="color:var(--brass); font-family:var(--font-mono); font-size:13px;">${store.xp || 50} XP</strong>
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="card" id="quiz-card" style="margin-bottom:20px;">
        ${renderQuestionContent(q)}
      </div>

      <!-- Controls -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <button class="btn btn-primary" id="quiz-ai-gen-btn">
          ✨ ${isAr ? 'توليد سؤال جديد بالـ AI' : 'Generate AI Question'}
        </button>
        <button class="btn btn-secondary" id="quiz-next-btn">
          ${isAr ? 'السؤال التالي ➔' : 'Next Question ➔'}
        </button>
      </div>
    `;

    bindQuizEvents(container, qIdx, store, q);
  }

  function renderQuestionContent(q) {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span class="badge badge-status-learning">${q.module_name || q.module_id}</span>
        <small style="color:var(--ink-soft); font-family:var(--font-mono);">#${q.id || 'AI'} | XP: +20</small>
      </div>

      <h3 style="margin-bottom:18px; line-height:1.5;">${isAr ? (q.question_ar || q.question) : (q.question_en || q.question)}</h3>

      <div id="quiz-options-container" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
        ${q.options.map((opt, idx) => `
          <button class="btn quiz-option-btn" data-opt-idx="${idx}" style="justify-content:flex-start; text-align:start; padding:12px 16px; width:100%; border-radius:var(--radius-md);">
            <span style="width:24px; height:24px; border-radius:50%; background:var(--line-soft); display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; margin-inline-end:10px; flex-shrink:0;">${String.fromCharCode(65 + idx)}</span>
            <span>${isAr ? (opt.text_ar || opt.text) : (opt.text_en || opt.text)}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-result-box" style="display:none; padding:16px; border-radius:var(--radius-md); background:var(--line-soft); border-inline-start:4px solid var(--brass);">
        <h4 id="quiz-result-title" style="margin-bottom:6px;"></h4>
        <p id="quiz-result-exp" style="margin:0; font-size:13px; color:var(--ink-soft); line-height:1.5;"></p>
      </div>
    `;
  }

  function bindQuizEvents(container, currentQIdx, store, activeQ) {
    let q = activeQ;

    const optBtns = container.querySelectorAll('.quiz-option-btn');
    const resultBox = container.querySelector('#quiz-result-box');
    const resultTitle = container.querySelector('#quiz-result-title');
    const resultExp = container.querySelector('#quiz-result-exp');
    const nextBtn = container.querySelector('#quiz-next-btn');
    const aiGenBtn = container.querySelector('#quiz-ai-gen-btn');
    const modSelect = container.querySelector('#quiz-mod-select');

    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.optIdx, 10);
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

        resultExp.textContent = isAr ? (q.explanation_ar || q.explanation) : (q.explanation_en || q.explanation);
        resultBox.style.display = 'block';
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (currentQIdx + 1) % QUIZ_QUESTIONS.length;
        const card = container.querySelector('#quiz-card');
        if (card) {
          q = QUIZ_QUESTIONS[nextIdx];
          card.innerHTML = renderQuestionContent(q);
          bindQuizEvents(container, nextIdx, store, q);
        }
      });
    }

    if (aiGenBtn && modSelect) {
      aiGenBtn.addEventListener('click', async () => {
        const card = container.querySelector('#quiz-card');
        const modId = modSelect.value;
        if (!card) return;

        card.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('daily_quiz', 'Generate MCQ question', { moduleId: modId });

        if (res.success && res.parsed && res.parsed.question) {
          const aiQ = {
            id: 'AI-' + Date.now().toString().slice(-4),
            module_id: modId,
            module_name: modId,
            question_ar: res.parsed.question,
            question_en: res.parsed.question,
            options: (res.parsed.options || []).map(o => ({ text_ar: o.text || o, text_en: o.text || o, correct: !!o.correct })),
            explanation_ar: res.parsed.explanation || 'التوضيح من محرك الذكاء الاصطناعي',
            explanation_en: res.parsed.explanation || 'AI Explanation'
          };
          q = aiQ;
          card.innerHTML = renderQuestionContent(aiQ);
          bindQuizEvents(container, currentQIdx, store, aiQ);
        } else {
          q = QUIZ_QUESTIONS[0];
          card.innerHTML = renderQuestionContent(q);
          bindQuizEvents(container, 0, store, q);
        }
      });
    }
  }

  return { render };
})();
