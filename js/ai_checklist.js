/**
 * js/ai_checklist.js
 * 📋 AI Implementation Checklist — End-to-End Implementation Checklist Engine.
 * Saves user progress in LocalStorage for each ERP module.
 */

const AIChecklist = (function () {
  const CHECKLIST_CACHE_KEY = 'erp_ai_checklist_progress_v1';

  function getSavedProgress() {
    try {
      const raw = localStorage.getItem(CHECKLIST_CACHE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(store) {
    try {
      localStorage.setItem(CHECKLIST_CACHE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const selectedModId = modules[0] ? modules[0].id : 'MOD-1';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📋 ${isAr ? 'قوائم تنفيذ موديولات الـ ERP بالذكاء الاصطناعي' : 'AI Module Implementation Checklist'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'مخطط وقوائم مراجعة شاملة لجميع مراحل التنفيذ (من الاكتشاف وحتى الدعم الفني بعد الإطلاق)' : 'Step-by-step implementation checklist from Discovery to Hypercare support'}
          </small>
        </div>

        <div style="min-width:240px;">
          <select id="check-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="check-result-container">
        ${renderChecklistContent(selectedModId)}
      </div>
    `;

    const select = container.querySelector('#check-mod-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const box = container.querySelector('#check-result-container');
        if (box) box.innerHTML = renderChecklistContent(e.target.value);
        bindChecklistEvents(container, e.target.value);
      });
      bindChecklistEvents(container, selectedModId);
    }
  }

  function renderChecklistContent(modId) {
    const isAr = I18n.getLang() === 'ar';
    const store = getSavedProgress();
    const modStore = store[modId] || {};

    const STAGES = [
      { id: 'STG-1', title_ar: '1️⃣ مرحلة الاكتشاف والـ Blueprinting', title_en: '1. Discovery & Blueprinting', task_ar: 'تحديد متطلبات الدورة المستندية وتحليل الفجوات Fit-Gap', task_en: 'Define business workflow requirements & Fit-Gap analysis' },
      { id: 'STG-2', title_ar: '2️⃣ مرحلة التهيئة والتكييف (Configuration)', title_en: '2. Configuration & Parameterization', task_ar: 'ضبط إعدادات الفئات، ترحيل الحسابات، وقواعد التسعير', task_en: 'Configure product categories, G/L account mapping, & pricelists' },
      { id: 'STG-3', title_ar: '3️⃣ مرحلة تنظيف ونقل البيانات (Data Migration)', title_en: '3. Master Data Clean-up & Migration', task_ar: 'رفع دليل الحسابات، كروت المواد، والأرصدة الافتتاحية', task_en: 'Upload Chart of Accounts, Item Master, & Opening Balances' },
      { id: 'STG-4', title_ar: '4️⃣ مرحلة اختبارات القبول (UAT & Scenarios)', title_en: '4. UAT & Business Scenario Testing', task_ar: 'اختبار سيناريوهات الشراء والتوريد والمطابقة الثلاثية', task_en: 'Execute 3-Way Match & Goods Issue testing scenarios' },
      { id: 'STG-5', title_ar: '5️⃣ مرحلة التشغيل الفعلي (Go-Live & Hypercare)', title_en: '5. Cutover, Go-Live & Post-Support', task_ar: 'الإقفال النهائي، التجهيز للتشغيل الفعلي ودعم المستخدمين', task_en: 'Cutover execution, live transaction support & hypercare' }
    ];

    return `
      <div class="card" style="padding:20px;">
        <h3 style="margin-bottom:16px;">📋 ${isAr ? 'قائمة المهام والتأكد للموديول' : 'Module Implementation Checklist'} (${modId})</h3>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${STAGES.map(stg => {
            const isChecked = !!modStore[stg.id];
            return `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:var(--line-soft); border-radius:var(--radius-md); ${isChecked ? 'opacity:0.6;' : ''}">
                <div style="display:flex; align-items:center; gap:12px;">
                  <input type="checkbox" data-stg-id="${stg.id}" ${isChecked ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;">
                  <div>
                    <strong style="display:block; font-size:14px; ${isChecked ? 'text-decoration:line-through;' : ''}">${isAr ? stg.title_ar : stg.title_en}</strong>
                    <small style="color:var(--ink-soft);">${isAr ? stg.task_ar : stg.task_en}</small>
                  </div>
                </div>
                <span class="badge ${isChecked ? 'badge-status-mastered' : 'badge-status-learning'}">${isChecked ? 'Completed' : 'Pending'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function bindChecklistEvents(container, modId) {
    const checkboxes = container.querySelectorAll('input[data-stg-id]');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', () => {
        const stgId = chk.dataset.stgId;
        const store = getSavedProgress();
        if (!store[modId]) store[modId] = {};
        store[modId][stgId] = chk.checked;
        saveProgress(store);

        const box = container.querySelector('#check-result-container');
        if (box) box.innerHTML = renderChecklistContent(modId);
        bindChecklistEvents(container, modId);
      });
    });
  }

  return { render };
})();
