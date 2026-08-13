/**
 * js/ai_gap_coach.js
 * 🎯 AI Knowledge Gap Coach Tool.
 * Analyzes user progress, mastered topics, & gaps to generate personalized study sequences.
 */

const AIGapCoach = (function () {

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🎯 ${isAr ? 'مدرب معالجة الفجوات المعرفية بالذكاء الاصطناعي' : 'AI Knowledge Gap Coach'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'يحلل الذكاء الاصطناعي المواضيع المفضلة والمستعصية لديك ليولّد خطة تعلّم تخصصية شخصية' : 'Personalized AI study sequencing based on your knowledge gaps & progress'}
          </small>
        </div>

        <div style="min-width:240px;">
          <select id="coach-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="coach-result-container">
        ${renderSkeletonFallback()}
      </div>
    `;

    const select = container.querySelector('#coach-mod-select');
    if (select) {
      select.addEventListener('change', (e) => loadPlan(e.target.value, container));
      loadPlan(modules[0] ? modules[0].id : 'MOD-1', container);
    }
  }

  async function loadPlan(modId, container) {
    const isAr = I18n.getLang() === 'ar';
    const resultBox = container.querySelector('#coach-result-container');
    if (!resultBox) return;

    resultBox.innerHTML = UI.skeleton('cards');

    const res = await AIService.ask('gap_coach', 'Generate personalized learning sequence for gaps', { moduleId: modId });

    if (res.success && res.text) {
      resultBox.innerHTML = `
        <div class="card" style="border-inline-start:4px solid var(--brass);">
          <h3 style="margin-bottom:14px;">🎯 ${isAr ? 'خطة الدراسة والتمكين الشخصية المستهدفة' : 'Personalized Learning & Remediation Plan'}</h3>
          <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
            ${AIService.formatMarkdown(res.text)}
          </div>
        </div>
      `;
    } else {
      resultBox.innerHTML = renderSkeletonFallback();
    }
  }

  function renderSkeletonFallback() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="border-inline-start:4px solid var(--brass);">
        <h3 style="margin-bottom:10px;">📌 ${isAr ? 'نقاط التركيز المستهدفة لحصتك القادمة' : 'Recommended Focus Areas'}</h3>
        <p style="font-size:13px; color:var(--ink-soft); line-height:1.5;">
          ${isAr ? '1. مراجعة طريقة التقييم الآلي FIFO والمحاكاة المحاسبية.' : '1. Review Automated FIFO Costing & Journal Simulator.'}<br>
          ${isAr ? '2. إتقان تسوية الفروقات الجردية Scrap Loss Adjustments.' : '2. Master Inventory Physical Adjustment & Scrap Loss.'}<br>
          ${isAr ? '3. تطبيق سيناريو المطابقة الثلاثية 3-Way Match في المشتريات.' : '3. Practice 3-Way Matching scenario in Purchasing.'}
        </p>
      </div>
    `;
  }

  return { render };
})();
