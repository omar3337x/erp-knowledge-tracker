/**
 * js/gantt_builder.js
 * 📅 AI Gantt Implementation Planner — Interactive Project Timeline Engine + Page Template Integration.
 */

const GanttBuilder = (function () {

  const PROJECT_PHASES = [
    { id: 'W1-W2', phase_ar: '1. اكتشاف وتحليل النطاق (Discovery & Blueprinting)', phase_en: '1. Discovery & Blueprinting', duration: '2 Weeks', owner_ar: 'استشاري النظام + مدير المشروع', owner_en: 'Lead Consultant & PM', progress: 100, status: 'Completed' },
    { id: 'W3-W5', phase_ar: '2. بناء ودورة إعداد النظام (System Configuration & Build)', phase_en: '2. System Configuration & Build', duration: '3 Weeks', owner_ar: 'فريق التطبيق المباشر', owner_en: 'Implementation Team', progress: 80, status: 'In Progress' },
    { id: 'W6-W7', phase_ar: '3. تجهيز ونقل البيانات التاريخية (Data Migration)', phase_en: '3. Data Migration & Cleaning', duration: '2 Weeks', owner_ar: 'مدير المستودع + الحسابات', owner_en: 'Data Stewards', progress: 40, status: 'In Progress' },
    { id: 'W8-W9', phase_ar: '4. اختبارات القبول والتدريب (UAT & End-user Training)', phase_en: '4. UAT & User Training', duration: '2 Weeks', owner_ar: 'المستخدمين النهائين (Key Users)', owner_en: 'Key Users & PM', progress: 0, status: 'Not Started' },
    { id: 'W10', phase_ar: '5. التشغيل الفعلي والدعم المباشر (Go-Live & Hypercare)', phase_en: '5. Go-Live & Hypercare', duration: '1 Week', owner_ar: 'الفريق التنفيذي بالكامل', owner_en: 'All Stakeholders', progress: 0, status: 'Not Started' }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📅 ${isAr ? 'مخطط جانت وتخطيط المشاريع بالذكاء الاصطناعي' : 'AI ERP Gantt Timeline & Project Planner'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'توليد الجدول الزمني والمراحل والمهام والمسار الحرج لمشاريع الـ ERP بالـ AI' : 'Generate complete implementation phases, task breakdown & critical path timelines'}
          </small>
        </div>

        <div style="display:flex; gap:10px; align-items:center;">
          <button class="btn btn-secondary" id="gantt-export-csv-btn">
            📥 ${isAr ? 'تصدير الجدول لـ CSV' : 'Export CSV'}
          </button>
          <select id="gantt-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- AI Prompt Input -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <label class="field-label" style="font-size:12px; font-weight:700; color:var(--ink-soft); display:block; margin-bottom:8px;">
          ${isAr ? 'نطاق المشروع ودرجة التعقيد:' : 'Project Scope & Complexity Prompt:'}
        </label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="gantt-scope-input" class="field" placeholder="${isAr ? 'مثال: تطبيق موديول المخزون والمشتريات لشركة مقاولات متعددة الفروع خلال 90 يوم...' : 'e.g. Implement Inventory & Purchasing for multi-branch company in 90 days...'}" style="margin:0; flex:1;">
          <button class="btn btn-primary" id="gantt-ai-gen-btn">
            🧠 ${isAr ? 'توليد المخطط الزمني والمسار الحرج بالـ AI' : 'Generate Gantt Plan'}
          </button>
        </div>
      </div>

      <div id="gantt-table-box">
        ${renderGanttTable()}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#gantt-ai-gen-btn');
    const modSelect = container.querySelector('#gantt-mod-select');
    const scopeInput = container.querySelector('#gantt-scope-input');
    const tableBox = container.querySelector('#gantt-table-box');
    const exportBtn = container.querySelector('#gantt-export-csv-btn');

    if (aiBtn && scopeInput && tableBox) {
      aiBtn.addEventListener('click', async () => {
        const text = scopeInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        tableBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('gantt_builder', text || 'Full ERP implementation timeline & critical path', { moduleId: modId });

        if (res.success) {
          let parsedData = res.parsed || {};
          let customPhases = [];

          if (parsedData.steps && Array.isArray(parsedData.steps)) {
            customPhases = parsedData.steps.map((s, idx) => ({
              id: s.duration || s.time || `Phase ${idx + 1}`,
              phase_ar: s.name || s.step_name || s.title || `المرحلة ${idx + 1}`,
              phase_en: s.name || s.title || `Phase ${idx + 1}`,
              duration: s.duration || s.time || '1 Week',
              owner_ar: s.owner || s.role || s.responsible || 'فريق التطبيق',
              owner_en: s.owner || 'Implementation Team',
              progress: Math.min(100, Math.max(0, 100 - (idx * 20))),
              status: idx === 0 ? 'Completed' : (idx === 1 ? 'In Progress' : 'Not Started')
            }));
          }

          if (customPhases.length > 0) {
            tableBox.innerHTML = renderGanttTable(customPhases, res.text);
          } else {
            tableBox.innerHTML = `
              <div class="card" style="border-inline-start:4px solid var(--brass);">
                <h3 style="margin-bottom:12px;">📅 ${isAr ? 'خطة مخطط جانت والمسار الحرج بالـ AI' : 'AI Gantt Timeline & Critical Path'}</h3>
                <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                  ${AIService.formatMarkdown(res.text)}
                </div>
              </div>
            `;
          }
        } else {
          tableBox.innerHTML = renderGanttTable();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => exportGanttCSV());
    }
  }

  function renderGanttTable(phasesList, rawText) {
    const isAr = I18n.getLang() === 'ar';
    const phases = (Array.isArray(phasesList) && phasesList.length) ? phasesList : PROJECT_PHASES;

    let html = `
      <div class="card" style="padding:0; overflow:hidden; margin-bottom:20px;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code / Time</th>
                <th>${isAr ? 'مرحلة المشروع (Phase)' : 'Project Phase'}</th>
                <th>${isAr ? 'المدة الزمنية' : 'Duration'}</th>
                <th>${isAr ? 'المسئول' : 'Owner'}</th>
                <th style="width:200px;">${isAr ? 'نسبة الإنجاز' : 'Progress'}</th>
                <th>${isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              ${phases.map(p => `
                <tr>
                  <td><strong style="font-family:var(--font-mono); font-size:12px;">${Topics.escapeHtml(p.id)}</strong></td>
                  <td><strong>${Topics.escapeHtml(isAr ? (p.phase_ar || p.phase_en) : (p.phase_en || p.phase_ar))}</strong></td>
                  <td><span class="badge badge-priority-medium" style="font-family:var(--font-mono);">${Topics.escapeHtml(p.duration)}</span></td>
                  <td><small style="color:var(--ink-soft);">${Topics.escapeHtml(isAr ? (p.owner_ar || p.owner_en) : (p.owner_en || p.owner_ar))}</small></td>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div style="flex:1; height:8px; background:var(--line-soft); border-radius:99px; overflow:hidden;">
                        <div style="width:${p.progress || 0}%; height:100%; background:var(--brass); border-radius:99px;"></div>
                      </div>
                      <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; width:35px;">${p.progress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${p.status === 'Completed' ? 'badge-status-mastered' : (p.status === 'In Progress' ? 'badge-status-learning' : 'badge-status-not-started')}">
                      ${Topics.escapeHtml(p.status)}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (rawText && (!phasesList || !phasesList.length)) {
      html += `<div style="margin-top:16px;">${AIService.formatMarkdown(rawText)}</div>`;
    }

    return html;
  }

  function exportGanttCSV() {
    let csv = 'Phase ID,Phase Name,Duration,Owner,Progress,Status\n';
    PROJECT_PHASES.forEach(p => {
      csv += `"${p.id}","${p.phase_en}","${p.duration}","${p.owner_en}","${p.progress}%","${p.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ERP_Gantt_Plan_${Date.now()}.csv`;
    link.click();
    UI.toast(I18n.getLang() === 'ar' ? 'تم تصدير ملف جانت بنجاح' : 'Gantt CSV exported', 'success');
  }

  return { render };
})();
