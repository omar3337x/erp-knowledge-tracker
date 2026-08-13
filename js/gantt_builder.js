/**
 * js/gantt_builder.js
 * 📅 AI Gantt Project Plan Builder — AI ERP Implementation Planner + Static Fallback.
 */

const GanttBuilder = (function () {

  const PROJECT_PHASES = [
    { id: 'PH-1', phase_ar: '1️⃣ الاكتشاف وتحليل الفجوات (Discovery & Fit-Gap)', phase_en: 'Discovery & Fit-Gap Analysis', duration: 'W1 - W3 (3 Wks)', progress: 100, owner_ar: 'استشاري الحلول', owner_en: 'Solution Architect', status: 'Completed' },
    { id: 'PH-2', phase_ar: '2️⃣ التصميم وإعداد المخطط (Solution Blueprint)', phase_en: 'Solution Design & Blueprint', duration: 'W4 - W7 (4 Wks)', progress: 100, owner_ar: 'استشاري الوظائف', owner_en: 'Functional Lead', status: 'Completed' },
    { id: 'PH-3', phase_ar: '3️⃣ البناء والتهيئة البرمجية (Build & Configuration)', phase_en: 'Build, Config & Customization', duration: 'W8 - W14 (7 Wks)', progress: 75, owner_ar: 'فريق التطوير والتهيئة', owner_en: 'Dev & Config Team', status: 'In Progress' }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📅 ${isAr ? 'مخطط جانت وتخطيط المشاريع بالذكاء الاصطناعي' : 'AI ERP Implementation Gantt Planner'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'توليد الجدول الزمني والمراحل والمهام والمسار الحرج لمشاريع الـ ERP بالـ AI' : 'Generate WBS project timeline tasks, durations, dependencies & critical path with AI'}
          </small>
        </div>

        <div>
          <button class="btn btn-primary" id="gantt-export-csv-btn">
            📥 ${isAr ? 'تصدير الجدول لـ CSV' : 'Export Timeline (CSV)'}
          </button>
        </div>
      </div>

      <!-- Scope Setup Card -->
      <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
          <div style="flex:1; min-width:180px;">
            <label class="field-label" style="font-size:12px; font-weight:700;">${isAr ? 'الموديول' : 'Module'}</label>
            <select id="gantt-mod-select" class="field" style="margin:0;">
              ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en}</option>`).join('')}
            </select>
          </div>

          <div style="flex:2; min-width:260px;">
            <label class="field-label" style="font-size:12px; font-weight:700;">${isAr ? 'نطاق المشروع ودرجة التعقيد' : 'Project Scope & Complexity'}</label>
            <input type="text" id="gantt-scope-input" class="field" placeholder="${isAr ? 'مثال: تطبيق موديول المخزون والحسابات لـ 100 مستخدم مع ربط معملي و 3 مستودعات...' : 'e.g. 100 users, 3 warehouses, high customization...'}" style="margin:0;">
          </div>
        </div>

        <button class="btn btn-primary" id="gantt-ai-gen-btn" style="width:100%;">
          🧠 ${isAr ? 'توليد المخطط الزمني والمسار الحرج بالـ AI' : 'Generate AI Gantt Plan'}
        </button>
      </div>

      <div id="gantt-table-container">
        ${renderGanttTable()}
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const aiBtn = container.querySelector('#gantt-ai-gen-btn');
    const scopeInput = container.querySelector('#gantt-scope-input');
    const modSelect = container.querySelector('#gantt-mod-select');
    const exportBtn = container.querySelector('#gantt-export-csv-btn');
    const tableBox = container.querySelector('#gantt-table-container');

    if (aiBtn && scopeInput && tableBox) {
      aiBtn.addEventListener('click', async () => {
        const text = scopeInput.value.trim();
        const modId = modSelect ? modSelect.value : 'MOD-1';
        const isAr = I18n.getLang() === 'ar';

        tableBox.innerHTML = UI.skeleton('cards');

        const res = await AIService.ask('gantt_builder', text || 'Full ERP implementation timeline & critical path', { moduleId: modId });

        if (res.success && res.text) {
          tableBox.innerHTML = `
            <div class="card" style="border-inline-start:4px solid var(--brass);">
              <h3 style="margin-bottom:12px;">📅 ${isAr ? 'خطة مخطط جانت والمسار الحرج بالـ AI' : 'AI Gantt Timeline & Critical Path'}</h3>
              <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
                ${AIService.formatMarkdown(res.text)}
              </div>
            </div>
          `;
        } else {
          tableBox.innerHTML = renderGanttTable();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => exportGanttCSV());
    }
  }

  function renderGanttTable() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="padding:0; overflow:hidden; margin-bottom:20px;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>${isAr ? 'مرحلة المشروع (Phase)' : 'Project Phase'}</th>
                <th>${isAr ? 'المدة الزمنية' : 'Duration'}</th>
                <th>${isAr ? 'المسئول' : 'Owner'}</th>
                <th style="width:200px;">${isAr ? 'نسبة الإنجاز' : 'Progress'}</th>
                <th>${isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              ${PROJECT_PHASES.map(p => `
                <tr>
                  <td><strong style="font-family:var(--font-mono); font-size:12px;">${p.id}</strong></td>
                  <td><strong>${isAr ? p.phase_ar : p.phase_en}</strong></td>
                  <td><span class="badge badge-priority-medium" style="font-family:var(--font-mono);">${p.duration}</span></td>
                  <td><small style="color:var(--ink-soft);">${isAr ? p.owner_ar : p.owner_en}</small></td>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div style="flex:1; height:8px; background:var(--line-soft); border-radius:99px; overflow:hidden;">
                        <div style="width:${p.progress}%; height:100%; background:var(--brass); border-radius:99px;"></div>
                      </div>
                      <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; width:35px;">${p.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${p.status === 'Completed' ? 'badge-status-mastered' : (p.status === 'In Progress' ? 'badge-status-learning' : 'badge-status-not-started')}">
                      ${p.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function exportGanttCSV() {
    let csv = 'ID,Phase,Duration,Owner,Progress,Status\n';
    PROJECT_PHASES.forEach(p => {
      csv += `"${p.id}","${p.phase_en}","${p.duration}","${p.owner_en}","${p.progress}%","${p.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ERP_Gantt_Timeline_${Date.now()}.csv`;
    link.click();
    UI.toast(I18n.getLang() === 'ar' ? 'تم تصدير الجدول الزمني بنجاح' : 'Gantt timeline CSV exported', 'success');
  }

  return { render };
})();
