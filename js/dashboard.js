/**
 * js/dashboard.js
 * Renders the main Dashboard: KPI row, module gauge cards, review summary.
 * ONE API call (API.dashboard()) provides everything on this page.
 *
 * Background prefetch: after rendering, fires ONE single API.topics({}) call
 * that loads ALL topics for all modules in one round-trip. modules.js then
 * reads from this shared cache — so every module page opens instantly.
 */

const Dashboard = (function () {

  // Prevent re-firing the prefetch if the user navigates back to the dashboard
  let _prefetchDone = false;

  async function render(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let data;
    try {
      data = await API.dashboard();
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    const k = data.kpis;
    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:24px;">
        ${kpiCard(I18n.t('dashboard.overallProgress'), k.overall_progress + '%', 'brass')}
        ${kpiCard(I18n.t('dashboard.totalTopics'), k.total_topics, '')}
        ${kpiCard(I18n.t('dashboard.notStarted'), k.not_started, '')}
        ${kpiCard(I18n.t('dashboard.learning'), k.learning, '')}
        ${kpiCard(I18n.t('dashboard.understood'), k.understood, '')}
        ${kpiCard(I18n.t('dashboard.practiced'), k.practiced, '')}
        ${kpiCard(I18n.t('dashboard.mastered'), k.mastered, 'teal')}
        ${kpiCard(I18n.t('dashboard.knowledgeGaps'), k.knowledge_gaps, 'rust')}
        ${kpiCard(I18n.t('dashboard.toReview'), k.topics_to_review, 'rust')}
      </div>

      ${data.review_summary.due_today + data.review_summary.overdue > 0 ? `
      <div class="card" style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
        <div>${I18n.t('dashboard.overdueAndDue', { overdue: data.review_summary.overdue, due: data.review_summary.due_today })}</div>
        <button class="btn btn-sm btn-primary" data-route="review">${I18n.t('dashboard.goToReview')}</button>
      </div>` : ''}

      <h2 style="margin-bottom:14px;">${I18n.t('dashboard.modulesHeading')}</h2>
      <div class="grid grid-modules">
        ${data.modules.map(moduleCard).join('')}
      </div>
    `;

    container.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => Router.go('module', { id: card.dataset.moduleId }));
    });
    const reviewBtn = container.querySelector('[data-route="review"]');
    if (reviewBtn) reviewBtn.addEventListener('click', () => Router.go('review'));

    // ----------------------------------------------------------------
    // Background prefetch — ONE single request fetches ALL topics for
    // ALL modules at once. modules.js will filter from the same cache.
    // This fires after a 200ms idle so it doesn't race the initial render.
    // ----------------------------------------------------------------
    if (!_prefetchDone) {
      _prefetchDone = true;
      setTimeout(() => {
        // Single call — populates cache key 'topics:{}'
        // modules.js reads from this same key when it calls API.topics({})
        API.topics({}).catch(() => {});
        // Also warm up reviews for the Review Center page
        setTimeout(() => { API.reviews().catch(() => {}); }, 1000);
      }, 200);
    }
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
        <div class="module-card-title">${I18n.localizedName(m)}<small>${I18n.getLang() === 'ar' ? m.name_en : m.name_ar}</small></div>
        ${UI.gaugeRing(m.progress, 48)}
      </div>
      <div class="gauge-bar"><div class="gauge-bar-fill" style="width:${m.progress}%"></div></div>
      <div class="module-stats">
        <span>${I18n.t('common.total')}: <b>${m.total}</b></span>
        <span>${I18n.t('dashboard.mastered')}: <b>${m.mastered}</b></span>
        <span>${I18n.t('dashboard.practiced')}: <b>${m.practiced}</b></span>
        <span>${I18n.t('dashboard.learning')}: <b>${m.learning}</b></span>
        <span>${I18n.t('dashboard.knowledgeGaps')}: <b>${m.not_started}</b></span>
      </div>
    </div>`;
  }

  return { render };
})();
