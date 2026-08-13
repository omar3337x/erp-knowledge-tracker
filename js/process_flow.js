/**
 * js/process_flow.js
 * 🔄 AI Business Process Flow Visualizer — Natural Language Process Diagram Generator + Page Template Integration.
 */

const ProcessFlow = (function () {

  const PROCESS_FLOWS = {
    'P2P': {
      title_ar: '🛒 دورة الشراء إلى السداد (Procure-to-Pay - P2P)',
      title_en: 'Procure-to-Pay (P2P) Lifecycle Flow',
      steps: [
        { num: 1, role_ar: 'الأقسام الطالبة', role_en: 'Department', name_ar: 'طلب الشراء (Purchase Requisition)', name_en: 'Purchase Requisition', doc: 'PR Doc', gl_ar: 'بدون قيد محاسبي مباشر', gl_en: 'No G/L Posting' },
        { num: 2, role_ar: 'إدارة المشتريات', role_en: 'Purchasing', name_ar: 'طلب عروض الأسعار (RFQ & Quotation)', name_en: 'RFQ & Vendor Quote', doc: 'RFQ Doc', gl_ar: 'بدون قيد محاسبي مباشر', gl_en: 'No G/L Posting' },
        { num: 3, role_ar: 'إدارة المشتريات', role_en: 'Purchasing', name_ar: 'أمر الشراء المؤكد (Purchase Order)', name_en: 'Purchase Order (PO)', doc: 'PO Doc', gl_ar: 'التزام تعاقدي (No Direct G/L)', gl_en: 'Commitment (No Direct G/L)' },
        { num: 4, role_ar: 'إدارة المستودعات', role_en: 'Warehouse', name_ar: 'سند استلام البضاعة (Goods Receipt Note)', name_en: 'Goods Receipt Note (GRN)', doc: 'GRN Doc', gl_ar: 'من حـ/ المخزون — إلى حـ/ GR/IR المعلق', gl_en: 'Dr. Inventory — Cr. GR/IR Accrual' }
      ]
    }
  };

  function render(container, selectedFlowKey = 'P2P') {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const flow = PROCESS_FLOWS[selectedFlowKey] || PROCESS_FLOWS['P2P'];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            🔄 ${isAr ? 'مصمم ومستكشف خرائط العمليات والدورات بالـ AI' : 'AI Business Process Flow Visualizer'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'صف أي دورة مستندية باللغة الطبيعية ليقوم الـ AI برسم خطوات العملية والأثر المحاسبي فورياً' : 'Describe any workflow to generate visual step-by-step BPMN diagrams & G/L impacts'}
          </small>
        </div>

        <div style="min-width:200px;">
          <select id="flow-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Prompt Input Card -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft); display:block; margin-bottom:8px;">
          ${isAr ? 'صف الدورة المستندية المطلوبة باللغة الطبيعية:' : 'Describe Business Process in Natural Language:'}
        </label>
        <div style="display:flex; gap:10px; margin-bottom:12px;">
          <input type="text" id="flow-prompt-input" class="field" placeholder="${isAr ? 'مثال: دورة شراء الأصول الثابتة من أول طلب الأصل إلى الاستلام وقيد الإهلاك...' : 'e.g. Fixed asset purchase cycle from requisition to GRN & depreciation...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="flow-ai-gen-btn">
            🧠 ${isAr ? 'توليد الخريطة بالـ AI' : 'Generate Flowchart'}
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <small style="color:var(--ink-soft);">${isAr ? 'أو اختر دورة معتمدة جاهزة:' : 'Or select preset flow:'}</small>
          <select id="flow-select-btn" class="field" style="margin:0; padding:4px 8px; font-size:12px; flex:1;">
            <option value="P2P" ${selectedFlowKey === 'P2P' ? 'selected' : ''}>🛒 ${isAr ? 'دورة الشراء إلى السداد (P2P)' : 'Procure-to-Pay (P2P)'}</option>
          </select>
        </div>
      </div>

      <div id="flow-diagram-container">
        ${renderFlowDiagram(flow)}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#flow-ai-gen-btn');
    const promptInput = container.querySelector('#flow-prompt-input');
    const modSelect = container.querySelector('#flow-mod-select');
    const select = container.querySelector('#flow-select-btn');
    const diagramBox = container.querySelector('#flow-diagram-container');

    if (select && diagramBox) {
      select.addEventListener('change', (e) => {
        diagramBox.innerHTML = renderFlowDiagram(PROCESS_FLOWS[e.target.value] || PROCESS_FLOWS['P2P']);
      });
    }

    if (aiBtn && promptInput && diagramBox) {
      aiBtn.addEventListener('click', async () => {
        const text = promptInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        diagramBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('process_flow', text || 'Business process flow steps', { moduleId: modId });

        if (res.success) {
          let parsedData = res.parsed || {};
          let customSteps = [];

          // Try extracting steps from parsed JSON or explanation object
          if (parsedData.steps && Array.isArray(parsedData.steps)) {
            customSteps = parsedData.steps.map((s, idx) => ({
              num: s.step || s.step_number || (idx + 1),
              name_ar: s.name || s.step_name || s.action || `الخطوة ${idx + 1}`,
              name_en: s.name || s.action || `Step ${idx + 1}`,
              role_ar: s.role || s.department || 'إدارة الموديل',
              role_en: s.role || 'Department',
              doc: s.document || s.doc || 'ERP Doc',
              gl_ar: s.gl_impact || s.system_response || s.description || 'تأثير آلي على النظام',
              gl_en: s.gl_impact || s.system_response || 'System G/L Action'
            }));
          } else if (parsedData.explanation && parsedData.explanation.key_phases) {
            customSteps = parsedData.explanation.key_phases.map((ph, idx) => ({
              num: ph.phase || (idx + 1),
              name_ar: ph.name || `المرحلة ${idx + 1}`,
              name_en: ph.name || `Phase ${idx + 1}`,
              role_ar: 'فريق التنفيذ',
              role_en: 'ERP Team',
              doc: 'Phase Doc',
              gl_ar: ph.description || 'تأثير إجرائي ومحاسبي',
              gl_en: ph.description || 'Process Impact'
            }));
          }

          if (customSteps.length > 0) {
            diagramBox.innerHTML = renderFlowDiagram({ steps: customSteps }, res.text);
          } else {
            diagramBox.innerHTML = `
              <div class="card" style="border-inline-start:4px solid var(--brass);">
                <h3 style="margin-bottom:12px;">🔄 ${isAr ? 'تحليل خريطة العمليات والدورة المستندية بالـ AI' : 'AI Process Flow Chart'}</h3>
                <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                  ${AIService.formatMarkdown(res.text)}
                </div>
              </div>
            `;
          }
        } else {
          diagramBox.innerHTML = renderFlowDiagram(PROCESS_FLOWS[select ? select.value : 'P2P'] || PROCESS_FLOWS['P2P']);
        }
      });
    }
  }

  function renderFlowDiagram(flow, rawText) {
    const isAr = I18n.getLang() === 'ar';
    const steps = flow.steps || [];

    let html = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${steps.map(step => `
          <div class="card" style="padding:16px 20px; border-inline-start:4px solid var(--brass);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="width:28px; height:28px; border-radius:50%; background:var(--brass); color:#1C1204; font-weight:700; display:inline-flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:13px;">${step.num}</span>
                <h4 style="margin:0; font-size:15px; color:var(--ink); font-weight:700;">${Topics.escapeHtml(isAr ? (step.name_ar || step.name_en) : (step.name_en || step.name_ar))}</h4>
              </div>

              <div style="display:flex; gap:8px;">
                <span class="badge badge-status-learning">${Topics.escapeHtml(isAr ? (step.role_ar || step.role_en) : (step.role_en || step.role_ar))}</span>
                <span class="badge badge-priority-medium" style="font-family:var(--font-mono);">${Topics.escapeHtml(step.doc || 'ERP Doc')}</span>
              </div>
            </div>

            <div style="padding:10px 14px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12.5px; font-family:var(--font-mono); color:var(--ink-soft);">
              ⚡ <strong>${isAr ? 'التأثير المحاسبي ومسار العمل (G/L & System Action):' : 'G/L Impact:'}</strong> ${Topics.escapeHtml(isAr ? (step.gl_ar || step.gl_en) : (step.gl_en || step.gl_ar))}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    if (rawText && !steps.length) {
      html += `<div style="margin-top:16px;">${AIService.formatMarkdown(rawText)}</div>`;
    }

    return html;
  }

  return { render };
})();
