/**
 * js/analytics.js
 * Renders the Analytics page with rich interactive charts:
 *   - Progress by Module (animated bars)
 *   - Topics by Status / Priority (donut-style counts)
 *   - Knowledge Gaps by Module
 *   - Activity Heatmap (GitHub-style 52-week grid)
 *   - Monthly Progress (6-month bar chart)
 *   - Learning Over Time table
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
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <!-- KPI Row -->
      <div class="grid grid-kpi" style="margin-bottom:24px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.masteredTopics')}</div><div class="kpi-value teal">${data.mastered_total}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.needingReview')}</div><div class="kpi-value rust">${data.topics_needing_review}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('analytics.totalReviewsLogged')}</div><div class="kpi-value">${data.total_reviews}</div></div>
      </div>

      <!-- Activity Heatmap -->
      ${data.weekly_activity ? renderHeatmap(data.weekly_activity, isAr) : ''}

      <!-- Monthly Progress Chart -->
      ${data.monthly_progress ? renderMonthlyChart(data.monthly_progress, isAr) : ''}

      <!-- Progress by Module -->
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18n.t('analytics.progressByModule')}</h3>
        ${animatedBarList(data.progress_by_module.map(m => ({ label: modName(m), value: m.progress })), '%')}
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('analytics.topicsByStatus')}</h3>
          ${animatedBarList(Object.entries(data.topics_by_status).map(([k, v]) => ({ label: I18n.statusLabel(k), value: v, isCount: true, max: totalTopics(data) })), '')}
        </div>
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('analytics.topicsByPriority')}</h3>
          ${animatedBarList(Object.entries(data.topics_by_priority).map(([k, v]) => ({ label: I18n.priorityLabel(k), value: v, isCount: true, max: totalTopics(data) })), '')}
        </div>
      </div>

      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">${I18n.t('analytics.knowledgeGapsByModule')}</h3>
        ${animatedBarList(data.knowledge_gaps_by_module.map(m => ({ label: modName(m), value: m.gaps, isCount: true, max: Math.max(1, ...data.knowledge_gaps_by_module.map(x=>x.gaps)) })), '')}
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

      <!-- Learning Over Time -->
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

    // Animate bars on mount
    requestAnimationFrame(() => {
      container.querySelectorAll('.gauge-bar-fill').forEach(el => {
        el.style.transition = 'width 0.7s cubic-bezier(.4,0,.2,1)';
      });
    });
  }

  // ── Activity Heatmap ─────────────────────────────────────────────────────
  function renderHeatmap(activity, isAr) {
    const maxCount = Math.max(1, ...activity.map(d => d.count));
    const weeks = [];
    for (let i = 0; i < activity.length; i += 7) weeks.push(activity.slice(i, i + 7));

    const cellColor = (count) => {
      if (!count) return 'var(--line-soft)';
      const intensity = count / maxCount;
      if (intensity < 0.25) return 'var(--teal-soft, #c6efce)';
      if (intensity < 0.5)  return '#40c9a2';
      if (intensity < 0.75) return '#1aa085';
      return 'var(--teal, #0d7f6e)';
    };

    const cells = weeks.map(week => `
      <div style="display:flex; flex-direction:column; gap:3px;">
        ${week.map(day => `
          <div title="${day.date}: ${day.count} activities"
            style="width:13px; height:13px; border-radius:3px;
                   background:${cellColor(day.count)};
                   cursor:default; transition:transform 0.15s;"
            onmouseenter="this.style.transform='scale(1.4)'"
            onmouseleave="this.style.transform='scale(1)'">
          </div>
        `).join('')}
      </div>
    `).join('');

    return `
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:14px;">
          📊 ${isAr ? 'نشاط التعلم — آخر 52 أسبوع' : 'Learning Activity — Last 52 Weeks'}
        </h3>
        <div style="overflow-x:auto; padding-bottom:4px;">
          <div style="display:flex; gap:3px; min-width:max-content; align-items:flex-start;">
            ${cells}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-top:10px; font-size:11px; color:var(--ink-soft);">
          <span>${isAr ? 'أقل' : 'Less'}</span>
          ${[0, 0.25, 0.5, 0.75, 1].map(i => `
            <div style="width:13px; height:13px; border-radius:3px; background:${cellColor(i * maxCount)};"></div>
          `).join('')}
          <span>${isAr ? 'أكثر' : 'More'}</span>
        </div>
      </div>
    `;
  }

  // ── Monthly Progress Chart ────────────────────────────────────────────────
  function renderMonthlyChart(monthlyProgress, isAr) {
    if (!monthlyProgress || !monthlyProgress.length) return '';
    const max = Math.max(1, ...monthlyProgress.map(m => m.count));

    return `
      <div class="card" style="margin-bottom:18px;">
        <h3 style="margin-bottom:16px;">
          📈 ${isAr ? 'التقدم الشهري — آخر 6 أشهر' : 'Monthly Progress — Last 6 Months'}
        </h3>
        <div style="display:flex; align-items:flex-end; gap:12px; height:100px; padding:0 4px;">
          ${monthlyProgress.map(m => {
            const pct = Math.round((m.count / max) * 100);
            return `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span class="mono" style="font-size:11px; color:var(--brass); font-weight:600;">${m.count}</span>
                <div style="width:100%; background:var(--line-soft); border-radius:4px 4px 0 0; overflow:hidden; height:${Math.max(4, pct)}px;"
                     title="${m.label}: ${m.count} topics">
                  <div style="width:100%; height:100%; background:linear-gradient(to top, var(--brass), var(--teal));
                              border-radius:4px 4px 0 0;"></div>
                </div>
                <span style="font-size:10px; color:var(--ink-soft); text-align:center; white-space:nowrap;">${m.label}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function totalTopics(data) {
    return data.progress_by_module.reduce((a, m) => a + m.total, 0) || 1;
  }

  function animatedBarList(items, unit) {
    if (!items.length) return `<p class="field-hint">${I18n.t('analytics.noDataYet')}</p>`;
    return items.map(it => {
      const pct = it.isCount ? Math.round((it.value / (it.max || 1)) * 100) : it.value;
      return `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:9px;">
          <div style="width:130px; font-size:12.5px; color:var(--ink-soft);">${it.label}</div>
          <div class="gauge-bar" style="flex:1;"><div class="gauge-bar-fill" style="width:${pct}%"></div></div>
          <div class="mono" style="width:44px; text-align:end; font-size:12.5px;">${it.isCount ? it.value : it.value + (unit || '%')}</div>
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
