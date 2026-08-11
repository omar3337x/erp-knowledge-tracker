/**
 * js/dashboard.js
 * Renders the main Dashboard: KPI row, module gauge cards, review summary.
 */

const Dashboard = (function () {

  async function render(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading dashboard...</div>`;
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
        ${kpiCard('Overall Progress', k.overall_progress + '%', 'brass')}
        ${kpiCard('Total Topics', k.total_topics, '')}
        ${kpiCard('Not Started', k.not_started, '')}
        ${kpiCard('Learning', k.learning, '')}
        ${kpiCard('Understood', k.understood, '')}
        ${kpiCard('Practiced', k.practiced, '')}
        ${kpiCard('Mastered', k.mastered, 'teal')}
        ${kpiCard('Knowledge Gaps', k.knowledge_gaps, 'rust')}
        ${kpiCard('To Review', k.topics_to_review, 'rust')}
      </div>

      ${data.review_summary.due_today + data.review_summary.overdue > 0 ? `
      <div class="card" style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${data.review_summary.overdue} overdue</strong> · ${data.review_summary.due_today} due today for review.
        </div>
        <button class="btn btn-sm btn-primary" data-route="review">Go to Review Center</button>
      </div>` : ''}

      <h2 style="margin-bottom:14px;">Modules</h2>
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
        <div class="module-card-title">${m.name_en}<small>${m.name_ar}</small></div>
        ${UI.gaugeRing(m.progress, 48)}
      </div>
      <div class="gauge-bar"><div class="gauge-bar-fill" style="width:${m.progress}%"></div></div>
      <div class="module-stats">
        <span>Total: <b>${m.total}</b></span>
        <span>Mastered: <b>${m.mastered}</b></span>
        <span>Practiced: <b>${m.practiced}</b></span>
        <span>Learning: <b>${m.learning}</b></span>
        <span>Gaps: <b>${m.not_started}</b></span>
      </div>
    </div>`;
  }

  return { render };
})();
