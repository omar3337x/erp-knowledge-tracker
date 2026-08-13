/**
 * js/ai_troubleshooter.js
 * 🛠️ AI ERP Troubleshooter — Operational Problem Diagnostic Engine.
 * Dynamic AI troubleshooting with fallback diagnostic tree.
 */

const AITroubleshooter = (function () {

  const STATIC_PROBLEMS = [
    {
      id: 'ERR-01',
      title_ar: 'عجز رصيد المخزون وعدم تطابقه مع الحسابات المالية (Stock vs G/L Mismatch)',
      title_en: 'Stock Balance vs G/L Account Mismatch',
      causes_ar: 'عدم تفعيل التقييم الآلي للفئات (Manual Valuation) أو وجود تسويات مخزنية ترحلت لحسابات غير مخصصة.',
      fix_ar: 'تشغيل تقرير المطابقة المخزنية Stock Valuation Reconciliation، وفحص حركات المخزون التي تمت بدون قيد تلقائي.',
      impact_ar: 'عجز في الأصول وعدم دقة قائمة المركز المالي.'
    },
    {
      id: 'ERR-02',
      title_ar: 'خطأ الفترة المالية مغلقة (Period Closed Error)',
      title_en: 'Financial Period Closed Error',
      causes_ar: 'محاولة الترحيل بتاريخ يقع ضمن فترة مالية تم إقفالها لحماية الأرصدة التاريخية.',
      fix_ar: 'فتح الفترة المالية مؤقتاً من شاشة إقفال الفترات (Fiscal Period Lock) للمستخدمين المصرح لهم فقط.',
      impact_ar: 'توقف ترحيل الفواتير وإذون الاستلام.'
    }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🛠️ ${isAr ? 'مستكشف ومعدل أخطاء الـ ERP بالذكاء الاصطناعي' : 'AI ERP Troubleshooter'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'ادخل وصف المشكلة التشغيلية أو الخطأ الفني ليقوم الذكاء الاصطناعي بتشخيص السبب والحل' : 'Describe any ERP runtime error to get instant AI diagnostic steps & resolution'}
          </small>
        </div>
      </div>

      <!-- Problem Input Box -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; gap:12px; margin-bottom:14px; flex-wrap:wrap;">
          <div style="flex:1; min-width:200px;">
            <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft);">${isAr ? 'الموديول' : 'Module'}</label>
            <select id="trouble-mod-select" class="field" style="margin:0;">
              ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
            </select>
          </div>

          <div style="flex:3; min-width:280px;">
            <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft);">${isAr ? 'صف المشكلة أو كود الخطأ' : 'Describe Problem or Error Code'}</label>
            <input type="text" id="trouble-prompt-input" class="field" placeholder="${isAr ? 'مثال: رصيد المخزون لا يتطابق مع الحسابات، أو ظهر خطأ عدم توازن القيد...' : 'e.g., Inventory balance does not match G/L account balance...'}" style="margin:0;">
          </div>
        </div>

        <button class="btn btn-primary" id="trouble-analyze-btn" style="width:100%;">
          🧠 ${isAr ? 'تشخيص المشكلة وتحليل الحل بالـ AI' : 'Analyze & Troubleshoot with AI'}
        </button>
      </div>

      <!-- Result Container -->
      <div id="trouble-result-container">
        ${renderStaticFallback()}
      </div>
    `;

    bindEvents(container);
  }

  function renderStaticFallback() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="grid grid-modules">
        ${STATIC_PROBLEMS.map(p => `
          <div class="card" style="border-top:3px solid var(--rust);">
            <h3 style="font-size:15px; margin-bottom:10px;">⚠️ ${isAr ? p.title_ar : p.title_en}</h3>
            <p style="font-size:13px; color:var(--ink-soft); margin-bottom:8px;"><strong>${isAr ? 'السبب المحتمل:' : 'Possible Cause:'}</strong> ${isAr ? p.causes_ar : p.causes_en}</p>
            <p style="font-size:13px; color:var(--ink); margin-bottom:8px;"><strong>${isAr ? 'خطوات الاصلاح:' : 'Fix Steps:'}</strong> ${isAr ? p.fix_ar : p.fix_en}</p>
            <small style="color:var(--rust); font-weight:600;">⚡ ${isAr ? 'الأثر التشغيلي:' : 'Impact:'} ${isAr ? p.impact_ar : p.impact_en}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  function bindEvents(container) {
    const analyzeBtn = container.querySelector('#trouble-analyze-btn');
    const input = container.querySelector('#trouble-prompt-input');
    const modSelect = container.querySelector('#trouble-mod-select');
    const resultBox = container.querySelector('#trouble-result-container');

    if (analyzeBtn && input && resultBox) {
      analyzeBtn.addEventListener('click', async () => {
        const text = input.value.trim();
        const modId = modSelect.value;
        const isAr = I18n.getLang() === 'ar';

        resultBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('troubleshooter', text || 'General module troubleshooting', { moduleId: modId });

        if (res.success && res.text) {
          resultBox.innerHTML = `
            <div class="card" style="border-inline-start:4px solid var(--brass);">
              <h3 style="margin-bottom:12px;">🧠 ${isAr ? 'تقرير التشخيص الذكي والحل التخصصي' : 'AI Diagnostic Report'}</h3>
              <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          resultBox.innerHTML = renderStaticFallback();
        }
      });
    }
  }

  return { render };
})();
