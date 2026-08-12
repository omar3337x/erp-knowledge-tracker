/**
 * js/dashboard.js
 * Renders the main Dashboard: KPI row, Pinned Items Widget (📌), Learning Goals (🎯), Module Cards, Review Summary.
 */

const Dashboard = (function () {

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
    const isAr = I18n.getLang() === 'ar';

    // Non-blocking cached topics for Pinned & Goals widgets
    let allTopics = [];
    try {
      const cached = API.topics ? API.topics({}).catch(() => []) : [];
      allTopics = Array.isArray(cached) ? cached : [];
    } catch(e) {}

    const pinnedTopics = (allTopics || []).filter(t => t.pinned === true || t.pinned === 'TRUE' || t.pinned === 'true' || t.pinned === 1);
    const goalsTopics = (allTopics || []).filter(t => t.target_date && t.status !== 'Mastered');

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

      <!-- 📌 PINNED & 🎯 GOALS WIDGETS ROW -->
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:28px;">

        <!-- 📌 Pinned Items Widget -->
        <div class="card" style="padding:18px;">
          <h3 style="font-size:16px; font-weight:700; margin:0 0 14px; display:flex; align-items:center; gap:6px;">
            📌 ${isAr ? 'العناصر المثبتة (Pinned)' : 'Pinned Items'}
            <span class="badge" style="background:var(--gold-soft);">${pinnedTopics.length}</span>
          </h3>
          ${!pinnedTopics.length ? `
            <p style="font-size:13px; color:var(--ink-soft); margin:0;">${isAr ? 'لا توجد مواضيع مثبتة بعد. انقر 📌 على أي موضوع لتثبيته هنا.' : 'No pinned topics yet. Click 📌 on any topic to pin it here.'}</p>
          ` : `
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${pinnedTopics.slice(0, 5).map(t => `
                <div class="dash-pinned-item" data-id="${t.id}" style="padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                  <strong>${Topics.escapeHtml(t.topic)}</strong>
                  ${Topics.statusBadge(t.status)}
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- 🎯 Learning Goals & Milestones Widget -->
        <div class="card" style="padding:18px;">
          <h3 style="font-size:16px; font-weight:700; margin:0 0 14px; display:flex; align-items:center; gap:6px;">
            🎯 ${isAr ? 'أهداف التعلم والجدول الزمني' : 'Learning Goals & Targets'}
            <span class="badge" style="background:var(--brass-soft);">${goalsTopics.length}</span>
          </h3>
          ${!goalsTopics.length ? `
            <p style="font-size:13px; color:var(--ink-soft); margin:0;">${isAr ? 'لا توجد أهداف نشطة حالياً. يمكنك تحديد تاريخ هدف عند إضافة أو تعديل أي موضوع.' : 'No active learning goals right now. Set a target date when adding topics.'}</p>
          ` : `
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${goalsTopics.slice(0, 5).map(t => {
                const now = new Date();
                const target = new Date(t.target_date);
                const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
                const isOverdue = diffDays < 0;

                return `
                  <div class="dash-goal-item" data-id="${t.id}" style="padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                    <div>
                      <strong>${Topics.escapeHtml(t.topic)}</strong>
                      <small style="display:block; color:var(--ink-soft);">${UI.fmtDate(t.target_date)}</small>
                    </div>
                    <span class="badge ${isOverdue ? 'badge-status-not-started' : 'badge-status-learning'}">
                      ${isOverdue ? `⚠️ ${isAr ? 'متأخر' : 'Overdue'} (${Math.abs(diffDays)}d)` : `🎯 ${diffDays}d ${isAr ? 'متبقي' : 'left'}`}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

      </div>

      <h2 style="margin-bottom:14px;">${I18n.t('dashboard.modulesHeading')}</h2>
      <div class="grid grid-modules">
        ${data.modules.map(moduleCard).join('')}
      </div>
    `;

    container.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => Router.go('module', { id: card.dataset.moduleId }));
    });
    container.querySelectorAll('.dash-pinned-item, .dash-goal-item').forEach(el => {
      el.addEventListener('click', () => Topics.openDetail(el.dataset.id));
    });

    const reviewBtn = container.querySelector('[data-route="review"]');
    if (reviewBtn) reviewBtn.addEventListener('click', () => Router.go('review'));

    if (!_prefetchDone) {
      _prefetchDone = true;
      setTimeout(() => {
        API.topics({}).catch(() => {});
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
    return `<div class="card module-card" data-module-id="${m.id}" style="cursor:pointer; padding:18px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <h3 style="font-size:16px; font-weight:700; margin:0;">${I18n.localizedName(m)}</h3>
        <span class="mono" style="font-size:13px; font-weight:600; color:var(--brass);">${m.progress}%</span>
      </div>
      <div class="progress-bar-wrap" style="margin-bottom:12px;">
        <div class="progress-bar-fill" style="width:${m.progress}%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--ink-soft);">
        <span>${I18n.t('module.totalTopics')}: ${m.total}</span>
        <span>${I18n.t('module.knowledgeGaps')}: ${m.not_started + m.learning}</span>
      </div>
    </div>`;
  }

  return { render };
})();
