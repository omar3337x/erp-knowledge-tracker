/**
 * js/analytics.js — Optimized with skeleton loading.
 */

const Analytics = (function () {

  async function render(container) {
    container.innerHTML = `
      <div class="loading-row"><span class="spinner"></span> ${I18N.t('analytics.loading')}</div>
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18N.t('analytics.progress_by_module')}</h3>
        <div class="skeleton" style="height:16px;width:80%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:16px;width:60%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:16px;width:70%;"></div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card"><h3 style="margin-bottom:14px;">${I18N.t('analytics.topics_by_status')}</h3><div class="skeleton" style="height:16px;width:90%;margin-bottom:8px;"></div><div class="skeleton" style="height:16px;width:70%;"></div></div>
        <div class="card"><h3 style="margin-bottom:14px;">${I18N.t('analytics.topics_by_priority')}</h3><div class="skeleton" style="height:16px;width:90%;margin-bottom:8px;"></div><div class="skeleton" style="height:16px;width:70%;"></div></div>
      </div>
    `;

    let data;
    try {
      data = await API.analytics();
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }

    container.innerHTML = `
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18N.t('analytics.progress_by_module')}</h3>
        ${barList(data.progress_by_module.map(m => ({ label: m.name_en, value: m.progress })))}
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18N.t('analytics.topics_by_status')}</h3>
          ${barList(Object.entries(data.topics_by_status).map(([k, v]) => ({ label: k, value: v, isCount: true, max: data.progress_by_module.reduce((a,m)=>a+m.total,0) || 1 })))}
        </div>
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18N.t('analytics.topics_by_priority')}</h3>
          ${barList(Object.entries(data.topics_by_priority).map(([k, v]) => ({ label: k, value: v, isCount: true, max: data.progress_by_module.reduce((a,m)=>a+m.total,0) || 1 })))}
        </div>
      </div>

      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18N.t('analytics.knowledge_gaps_by_module')}</h3>
        ${barList(data.knowledge_gaps_by_module.map(m => ({ label: m.name_en, value: m.gaps, isCount: true, max: Math.max(1, ...data.knowledge_gaps_by_module.map(x=>x.gaps)) })))}
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card">
          <h3 style="margin-bottom:10px;">${I18N.t('analytics.strongest_modules')}</h3>
          ${moduleList(data.strongest_modules)}
        </div>
        <div class="card">
          <h3 style="margin-bottom:10px;">${I18N.t('analytics.weakest_modules')}</h3>
          ${moduleList(data.weakest_modules)}
        </div>
      </div>

      <div class="grid grid-kpi" style="margin-bottom:18px;">
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('analytics.mastered_topics')}</div><div class="kpi-value teal">${data.mastered_total}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('analytics.needing_review')}</div><div class="kpi-value rust">${data.topics_needing_review}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('analytics.total_reviews')}</div><div class="kpi-value">${data.total_reviews}</div></div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:14px;">${I18N.t('analytics.learning_over_time')}</h3>
        ${data.learning_over_time.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>${I18N.t('topics.table.topic')}</th><th>${I18N.t('analytics.mastered_on')}</th></tr></thead>
              <tbody>
                ${data.learning_over_time.slice().reverse().map(t => `
                  <tr><td>${Topics.escapeHtml(t.topic)}</td><td class="mono">${UI.fmtDate(t.completed_at)}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">No mastered topics yet — timeline will fill in as you progress.</p>`}
      </div>
    `;
  }

  function barList(items) {
    if (!items.length) return `<p class="field-hint">${I18N.t('analytics.no_data')}</p>`;
    return items.map(it => {
      const pct = it.isCount ? Math.round((it.value / (it.max || 1)) * 100) : it.value;
      return `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:9px;">
          <div style="width:130px; font-size:12.5px; color:var(--ink-soft);">${I18N.t(it.label) || it.label}</div>
          <div class="gauge-bar" style="flex:1;"><div class="gauge-bar-fill" style="width:${pct}%"></div></div>
          <div class="mono" style="width:44px; text-align:end; font-size:12.5px;">${it.isCount ? it.value : it.value + '%'}</div>
        </div>`;
    }).join('');
  }

  function moduleList(mods) {
    if (!mods.length) return `<p class="field-hint">${I18N.t('analytics.not_enough_data')}</p>`;
    return `<div style="display:flex; flex-direction:column; gap:8px;">
      ${mods.map(m => `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>${m.name_en}</span>
          <span class="mono badge" style="background:var(--line-soft);">${m.progress}%</span>
        </div>
      `).join('')}
    </div>`;
  }

  return { render };
})();
