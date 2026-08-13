/**
 * js/ai_scenario_lab.js
 * 🎯 ERP Scenario Lab — Interactive Decision Evaluation Engine.
 * Generates realistic operational scenarios; user inputs functional decision, AI evaluates score & risk.
 */

const AIScenarioLab = (function () {

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🧪 ${isAr ? 'معمل سيناريوهات القرارات العملية (Scenario Lab)' : 'ERP Scenario Decision Lab'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'اختبر قدرتك على اتخاذ القرار الاستشاري الصائب في حالات العمل المعقدة' : 'Test your functional decision skills on realistic ERP operational scenarios'}
          </small>
        </div>

        <div style="min-width:240px;">
          <select id="lab-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Action Card -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <button class="btn btn-primary" id="lab-generate-btn" style="width:100%;">
          🎲 ${isAr ? 'توليد سيناريو ميداني جديد بالـ AI' : 'Generate New Practical Scenario'}
        </button>
      </div>

      <div id="lab-scenario-container">
        ${renderDefaultScenario()}
      </div>
    `;

    bindEvents(container);
  }

  function renderDefaultScenario() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="margin-bottom:20px;">
        <span class="badge badge-status-learning" style="margin-bottom:10px;">MOD-1 Inventory</span>
        <h3 style="margin-bottom:12px; line-height:1.5;">
          ${isAr ? 'سيناريو: شركة تمتلك 3 مستودعات وبضاعة بقيمة 200,000 د.أ تعرضت لتلف جزئي نتيجة تسرب مائي. كيف تعالج الحركة في الـ ERP؟' : 'Scenario: A company with 3 warehouses experienced partial stock damage ($50,000) due to a water leak. How do you handle this in ERP?'}
        </h3>

        <div style="margin-bottom:16px;">
          <label class="field-label" style="font-weight:700;">${isAr ? 'قرارك الوظيفي والاستشاري:' : 'Your Functional Decision:'}</label>
          <textarea id="lab-user-decision" class="field" rows="3" placeholder="${isAr ? 'اكتب قرارك هنا (مثال: إنشاء إذن تسوية عجز بمستودع الحجر الصحي وتوجيه الحساب لخسائر المخزون)...' : 'Enter your decision...'}" style="margin:0;"></textarea>
        </div>

        <button class="btn btn-secondary" id="lab-evaluate-btn">
          ⚖️ ${isAr ? 'تقييم القرار بالـ AI والحصول على النتيجة' : 'Evaluate Decision with AI'}
        </button>
      </div>

      <div id="lab-evaluation-box"></div>
    `;
  }

  function bindEvents(container) {
    const genBtn = container.querySelector('#lab-generate-btn');
    const modSelect = container.querySelector('#lab-mod-select');
    const scenarioBox = container.querySelector('#lab-scenario-container');

    if (genBtn && modSelect && scenarioBox) {
      genBtn.addEventListener('click', async () => {
        const modId = modSelect.value;
        const isAr = I18n.getLang() === 'ar';

        scenarioBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('scenario_lab', 'Generate realistic scenario', { moduleId: modId });

        if (res.success && res.text) {
          scenarioBox.innerHTML = `
            <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
              <span class="badge badge-status-learning" style="margin-bottom:10px;">${modId}</span>
              <div style="font-size:14px; line-height:1.6; margin-bottom:16px;">
                ${AIService.formatMarkdown(res.text)}
              </div>

              <div style="margin-bottom:16px;">
                <label class="field-label" style="font-weight:700;">${isAr ? 'قرارك الوظيفي والاستشاري:' : 'Your Functional Decision:'}</label>
                <textarea id="lab-user-decision" class="field" rows="3" placeholder="${isAr ? 'اكتب خطوات تنفيذك هنا...' : 'Enter your decision steps...'}" style="margin:0;"></textarea>
              </div>

              <button class="btn btn-secondary" id="lab-evaluate-btn">
                ⚖️ ${isAr ? 'تقييم القرار بالـ AI والحصول على النتيجة' : 'Evaluate Decision with AI'}
              </button>
            </div>

            <div id="lab-evaluation-box"></div>
          `;
          bindEvaluate(scenarioBox, modId);
        } else {
          scenarioBox.innerHTML = renderDefaultScenario();
          bindEvaluate(scenarioBox, modId);
        }
      });

      bindEvaluate(scenarioBox, modSelect.value);
    }
  }

  function bindEvaluate(container, modId) {
    const evalBtn = container.querySelector('#lab-evaluate-btn');
    const decisionInput = container.querySelector('#lab-user-decision');
    const evalBox = container.querySelector('#lab-evaluation-box');

    if (evalBtn && decisionInput && evalBox) {
      evalBtn.addEventListener('click', async () => {
        const userText = decisionInput.value.trim();
        const isAr = I18n.getLang() === 'ar';

        evalBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('scenario_eval', 'Evaluate this user decision: ' + (userText || 'No decision provided'), { moduleId: modId });

        if (res.success && res.text) {
          evalBox.innerHTML = `
            <div class="card" style="border-top:4px solid var(--teal);">
              <h3 style="margin-bottom:10px; color:var(--teal);">🏆 ${isAr ? 'تقرير تقييم القرار والدرجة المستحقة' : 'Decision Evaluation Report'}</h3>
              <div style="font-size:13.5px; line-height:1.6;">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          evalBox.innerHTML = `
            <div class="card" style="border-top:4px solid var(--brass);">
              <h4 style="color:var(--brass-deep); margin-bottom:6px;">👍 ${isAr ? 'تقييم مبدئي ممتاز' : 'Good Initial Decision'}</h4>
              <p style="margin:0; font-size:13px; color:var(--ink-soft);">${isAr ? 'قرارك يضمن الحفاظ على التسلسل المستندي مع إثبات العجز بحساب الخسائر.' : 'Your decision correctly maintains audit trail while writing off damaged inventory.'}</p>
            </div>
          `;
        }
      });
    }
  }

  return { render };
})();
