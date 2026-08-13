/**
 * js/gantt_builder.js
 * Interactive ERP Implementation Project Gantt Chart Builder.
 * 0ms Instant local timeline render with phase progress & CSV export.
 */

const GanttBuilder = (function () {

  const PROJECT_PHASES = [
    { id: 'PH-1', phase_ar: '1️⃣ الاكتشاف وتحليل الفجوات (Discovery & Fit-Gap)', phase_en: 'Discovery & Fit-Gap Analysis', duration: 'W1 - W3 (3 Wks)', progress: 100, owner_ar: 'استشاري الحلول', owner_en: 'Solution Architect', status: 'Completed' },
    { id: 'PH-2', phase_ar: '2️⃣ التصميم وإعداد المخطط (Solution Blueprint)', phase_en: 'Solution Design & Blueprint', duration: 'W4 - W7 (4 Wks)', progress: 100, owner_ar: 'استشاري الوظائف', owner_en: 'Functional Lead', status: 'Completed' },
    { id: 'PH-3', phase_ar: '3️⃣ البناء والتهيئة البرمجية (Build & Configuration)', phase_en: 'Build, Config & Customization', duration: 'W8 - W14 (7 Wks)', progress: 75, owner_ar: 'فريق التطوير والتهيئة', owner_en: 'Dev & Config Team', status: 'In Progress' },
    { id: 'PH-4', phase_ar: '4️⃣ نقل البيانات وتجهيز القوائم (Data Migration)', phase_en: 'Data Migration & Cutover', duration: 'W15 - W17 (3 Wks)', progress: 40, owner_ar: 'فريق البيانات والحسابات', owner_en: 'Data Migration Lead', status: 'In Progress' },
    { id: 'PH-5', phase_ar: '5️⃣ اختبارات القبول وتدريب المستخدمين (UAT & Training)', phase_en: 'UAT & End-User Training', duration: 'W18 - W20 (3 Wks)', progress: 0, owner_ar: 'المستخدمون الأوائل (Key Users)', owner_en: 'Key Users & Trainers', status: 'Pending' },
    { id: 'PH-6', phase_ar: '6️⃣ التشغيل الفعلي والدعم الفني (Go-Live & Hypercare)', phase_en: 'Go-Live & Hypercare Support', duration: 'W21 - W24 (4 Wks)', progress: 0, owner_ar: 'فريق المشروع المشترك', owner_en: 'Project Steering Team', status: 'Pending' }
  ];

  function render(container) {
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📅 ${isAr ? 'مخطط جانت لمراحل تنفيذ مشروع الـ ERP' : 'ERP Implementation Gantt Builder'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'تخطيط ومتابعة الجدول الزمني ومراحل التحول والتسليمات' : 'Project timeline, milestone tracker & deliverables progress'}
          </small>
        </div>

        <div>
          <button class="btn btn-primary" id="gantt-export-csv-btn">
            📥 ${isAr ? 'تصدير الجدول لـ CSV' : 'Export Timeline (CSV)'}
          </button>
        </div>
      </div>

      <!-- Gantt Progress Table -->
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

    const exportBtn = container.querySelector('#gantt-export-csv-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => exportGanttCSV());
    }
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
