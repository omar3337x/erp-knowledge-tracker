/**
 * js/analytics.js
 * Renders the Analytics page. ONE API call (API.analytics()) provides
 * every chart/table on this page.
 */

const Analytics = (function () {

  async function render(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let data;
    try {
      data = await API.analytics();
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    const modName = (m) => I18n.getLang() === 'ar' ? (m.name_ar || m.name_en) : (m.name_en || m.name_ar);

    container.innerHTML = `
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18n.t('analytics.progressByModule')}</h3>
        ${barList(data.progress_by_module.map(m => ({ label: modName(m), value: m.progress })))}
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('analytics.topicsByStatus')}</h3>
          ${barList(Object.entries(data.topics_by_status).map(([k, v]) => ({ label: I18n.statusLabel(k), value: v, isCount: true, max: totalTopics(data) })))}
        </div>
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('analytics.topicsByPriority')}</h3>
          ${barList(Object.entries(data.topics_by_priority).map(([k, v]) => ({ label: I18n.priorityLabel(k), value: v, isCount: true, max: totalTopics(data) })))}
        </div>
      </div>

      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18n.t('analytics.knowledgeGapsByModule')}</h3>
        ${barList(data.knowledge_gaps_by_module.map(m => ({ label: modName(m), value: m.gaps, isCount: true, max: Math.max(1, ...data.knowledge_gaps_by_module.map(x=>x.gaps)) })))}
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card">
          <h3 style="margin-bottom:10px;">${I18n.t('analytics.strongestModules')}</h3>
          ${moduleList(data.strongest_modules, modName)}
        </div>
        <div class="card">
          <h3 style="margin-bottom:10px;">${I18n.t('analytics.weakestModules')}</h3>
          ${moduleList(data.weakest_modules, modName)}
        </div>
      </div>

      <div class="grid grid-kpi" style="margin-bottom:18px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.masteredTopics')}</div><div class="kpi-value teal">${data.mastered_total}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.needingReview')}</div><div class="kpi-value rust">${data.topics_needing_review}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.totalReviewsLogged')}</div><div class="kpi-value">${data.total_reviews}</div></div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:14px;">${I18n.t('analytics.learningOverTime')}</h3>
        ${data.learning_over_time.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>${I18n.t('table.topic')}</th><th>${I18n.t('analytics.masteredOn')}</th></tr></thead>
              <tbody>
                ${data.learning_over_time.slice().reverse().map(t => `
                  <tr><td>${Topics.escapeHtml(t.topic)}</td><td class="mono">${UI.fmtDate(t.completed_at)}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">${I18n.t('analytics.noTimelineYet')}</p>`}
      </div>
    `;
  }

  function totalTopics(data) {
    return data.progress_by_module.reduce((a, m) => a + m.total, 0) || 1;
  }

  function barList(items) {
    if (!items.length) return `<p class="field-hint">${I18n.t('analytics.noDataYet')}</p>`;
    return items.map(it => {
      const pct = it.isCount ? Math.round((it.value / (it.max || 1)) * 100) : it.value;
      return `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:9px;">
          <div style="width:130px; font-size:12.5px; color:var(--ink-soft);">${it.label}</div>
          <div class="gauge-bar" style="flex:1;"><div class="gauge-bar-fill" style="width:${pct}%"></div></div>
          <div class="mono" style="width:44px; text-align:end; font-size:12.5px;">${it.isCount ? it.value : it.value + '%'}</div>
        </div>`;
    }).join('');
  }

  function moduleList(mods, modName) {
    if (!mods.length) return `<p class="field-hint">${I18n.t('analytics.notEnoughData')}</p>`;
    return `<div style="display:flex; flex-direction:column; gap:8px;">
      ${mods.map(m => `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>${modName(m)}</span>
          <span class="mono badge" style="background:var(--line-soft);">${m.progress}%</span>
        </div>
      `).join('')}
    </div>`;
  }

  return { render };
})();
