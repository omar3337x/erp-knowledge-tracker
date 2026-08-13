/**
 * js/ai_kpi_advisor.js
 * 📊 AI Reports & KPI Advisor Tool.
 * Module-specific KPI formulas, data sources, warning thresholds, & executive reports.
 */

const AIKPIAdvisor = (function () {

  function render(container) {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
            📊 ${isAr ? 'مستشار مؤشرات الأداء والتقارير التنفيذية بالـ AI' : 'AI Reports & KPI Advisor'}
          </h2>
          <small style="color:var(--ink-soft);">
            ${isAr ? 'احصل على أهم مؤشرات قياس الأداء (KPIs) ومعادلاتها ومصادر بياناتها لكل موديول' : 'Get module-specific KPIs, formulas, data sources & threshold warnings'}
          </small>
        </div>

        <div style="min-width:240px;">
          <select id="kpi-mod-select" class="field" style="margin:0; padding:8px 12px; font-weight:600;">
            ${modules.map(m => `<option value="${m.id}">${I18n.getLang() === 'ar' ? m.name_ar : m.name_en} (${m.id})</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="kpi-result-container">
        ${renderSkeletonFallback(modules[0] ? modules[0].id : 'MOD-1')}
      </div>
    `;

    const select = container.querySelector('#kpi-mod-select');
    if (select) {
      select.addEventListener('change', (e) => loadKPIs(e.target.value, container));
      loadKPIs(modules[0] ? modules[0].id : 'MOD-1', container);
    }
  }

  async function loadKPIs(modId, container) {
    const isAr = I18n.getLang() === 'ar';
    const resultBox = container.querySelector('#kpi-result-container');
    if (!resultBox) return;

    resultBox.innerHTML = UI.skeleton('cards');

    const res = await AIService.ask('kpi_advisor', 'Generate key executive KPIs and reporting matrix', { moduleId: modId });

    if (res.success && res.text) {
      resultBox.innerHTML = `
        <div class="card" style="border-inline-start:4px solid var(--brass);">
          <h3 style="margin-bottom:14px;">📊 ${isAr ? 'دليل مؤشرات الأداء والتقارير القيادية' : 'Executive KPI & Reports Matrix'}</h3>
          <div style="font-size:13.5px; line-height:1.6; color:var(--ink);">
            ${AIService.formatMarkdown(res.text)}
          </div>
        </div>
      `;
    } else {
      resultBox.innerHTML = renderSkeletonFallback(modId);
    }
  }

  function renderSkeletonFallback(modId) {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="grid grid-kpi">
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'معدل دوران المخزون (Inventory Turnover)' : 'Inventory Turnover Ratio'}</div>
          <div class="kpi-value brass">8.5x</div>
          <small style="color:var(--ink-soft); display:block; margin-top:6px;">COGS / Avg Inventory</small>
        </div>
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'دقة الجرد الفعلي (Stock Accuracy)' : 'Stock Count Accuracy'}</div>
          <div class="kpi-value teal">98.4%</div>
          <small style="color:var(--ink-soft); display:block; margin-top:6px;">System Units / Physical Count</small>
        </div>
        <div class="card kpi-card">
          <div class="kpi-label">${isAr ? 'أعمار الديون (AR Aging > 90 Days)' : 'Overdue AR Ratio'}</div>
          <div class="kpi-value rust">3.2%</div>
          <small style="color:var(--ink-soft); display:block; margin-top:6px;">Overdue Receivables / Total AR</small>
        </div>
      </div>
    `;
  }

  return { render };
})();
