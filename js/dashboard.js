/**
 * js/dashboard.js — Optimized with skeleton loading and pre-cached data.
 */

const Dashboard = (function () {

  async function render(container) {
    // Show skeleton while loading
    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:24px;">
        ${UI.skeletonCards(9)}
      </div>
      <h2 style="margin-bottom:14px;">Modules</h2>
      <div class="grid grid-modules">
        ${UI.skeletonModuleCards(5)}
      </div>
    `;

    let data;
    try {
      data = await API.dashboard();
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }

    const k = data.kpis;
    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:24px;">
        ${kpiCard(I18N.t('dashboard.kpi.overall_progress'), k.overall_progress + '%', 'brass')}
        ${kpiCard(I18N.t('dashboard.kpi.total_topics'), k.total_topics, '')}
        ${kpiCard(I18N.t('dashboard.kpi.not_started'), k.not_started, '')}
        ${kpiCard(I18N.t('dashboard.kpi.learning'), k.learning, '')}
        ${kpiCard(I18N.t('dashboard.kpi.understood'), k.understood, '')}
        ${kpiCard(I18N.t('dashboard.kpi.practiced'), k.practiced, '')}
        ${kpiCard(I18N.t('dashboard.kpi.mastered'), k.mastered, 'teal')}
        ${kpiCard(I18N.t('dashboard.kpi.knowledge_gaps'), k.knowledge_gaps, 'rust')}
        ${kpiCard(I18N.t('dashboard.kpi.to_review'), k.topics_to_review, 'rust')}
      </div>

      ${data.review_summary.due_today + data.review_summary.overdue > 0 ? `
      <div class="card" style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${data.review_summary.overdue} ${I18N.t('reviews.overdue')}</strong> · ${data.review_summary.due_today} ${I18N.t('reviews.due_today')}.
        </div>
        <button class="btn btn-sm btn-primary" data-route="review">${I18N.t('dashboard.go_to_review')}</button>
      </div>` : ''}

      <h2 style="margin-bottom:14px;">${I18N.t('dashboard.modules')}</h2>
      <div class="grid grid-modules">
        ${data.modules.map(moduleCard).join('')}
      </div>
    `;

    container.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => Router.go('module', { id: card.dataset.moduleId }));
    });
    const reviewBtn = container.querySelector('[data-route="review"]');
    if (reviewBtn) reviewBtn.addEventListener('click', () => Router.go('review'));
  }

  function kpiCard(label, value, tone) {
    return `<div class="card kpi-card">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value ${tone}">${value}</div>
    </div>`;
  }

  function moduleCard(m) {
    return `<div class="card module-card" data-module-id="${m.id}">
      <div class="module-card-head">
        <div class="module-card-title">${I18N.getModuleName(m)}</div>
        ${UI.gaugeRing(m.progress, 48)}
      </div>
      <div class="gauge-bar"><div class="gauge-bar-fill" style="width:${m.progress}%"></div></div>
      <div class="module-stats">
        <span>${I18N.t('module.total_topics')}: <b>${m.total}</b></span>
        <span>${I18N.t('dashboard.kpi.mastered')}: <b>${m.mastered}</b></span>
        <span>${I18N.t('dashboard.kpi.practiced')}: <b>${m.practiced}</b></span>
        <span>${I18N.t('dashboard.kpi.learning')}: <b>${m.learning}</b></span>
        <span>${I18N.t('dashboard.kpi.knowledge_gaps')}: <b>${m.not_started}</b></span>
      </div>
    </div>`;
  }

  return { render };
})();
