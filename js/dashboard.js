/**
 * js/dashboard.js - High Performance Dashboard Renderer
 *
 * PERF FEATURES:
 *  - Aggressive Stale-While-Revalidate (0ms instant render using cache, no spinner if cache exists)
 *  - Skeleton UI Shimmers (Replaces raw spinner when first loading without cache)
 *  - DOM Hash Diffing: Avoids layout thrashing if background fetch data matches current rendered state
 *  - requestAnimationFrame scheduling for smooth 60fps gauge rendering
 */

const Dashboard = (function () {

  let _prefetchDone = false;
  let _lastRenderedHash = '';
  const DASHBOARD_LS_KEY = 'erp_dashboard_cache_v1';

  function getCachedDashboard() {
    // First check shared API cache (populated by prefetchAll batch)
    const apiCached = (typeof API !== 'undefined' && API.cacheGet) ? API.cacheGet('dashboard:{}', 'dashboard') : null;
    if (apiCached && apiCached.kpis) return apiCached;
    // Fallback: own localStorage snapshot
    try {
      const raw = localStorage.getItem(DASHBOARD_LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveCachedDashboard(data) {
    try {
      if (data) localStorage.setItem(DASHBOARD_LS_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function computeHash(data) {
    if (!data) return '';
    return JSON.stringify(data.kpis) + ':' + (data.topics ? data.topics.length : 0) + ':' + (data.modules ? data.modules.map(m=>m.id+m.progress).join(',') : '');
  }

  async function render(container) {
    const cachedData = getCachedDashboard();

    // PERF: 0ms Instant Render using cache or instant fallback data — NEVER hang on skeleton
    if (cachedData && cachedData.kpis) {
      drawDashboard(container, cachedData);
    } else {
      const fallbackData = buildFallbackDashboard();
      drawDashboard(container, fallbackData);
    }

    // Background network fetch (reads from cache if prefetchAll batch already completed, or fetches fresh)
    try {
      const freshData = await API.dashboard();
      saveCachedDashboard(freshData);
      
      const freshHash = computeHash(freshData);
      if (freshHash !== _lastRenderedHash || !cachedData) {
        drawDashboard(container, freshData);
      }
    } catch (err) {
      // If network fails but we rendered fallback or cached data, keep the view functional
    }
  }

  function buildFallbackDashboard() {
    const modules = (State.modulesCache && State.modulesCache.length) ? State.modulesCache : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const topicsCached = (typeof API !== 'undefined' && API.cacheGet) ? (API.cacheGet('topics:{}', 'topics') || []) : [];
    
    const total = topicsCached.length;
    const notStarted = topicsCached.filter(t => t.status === 'Not Started').length;
    const learning = topicsCached.filter(t => t.status === 'Learning').length;
    const understood = topicsCached.filter(t => t.status === 'Understood').length;
    const practiced = topicsCached.filter(t => t.status === 'Practiced').length;
    const mastered = topicsCached.filter(t => t.status === 'Mastered').length;
    const progress = total ? Math.round(((mastered + practiced * 0.8 + understood * 0.5 + learning * 0.2) / total) * 100) : 0;

    const mappedModules = modules.map(m => {
      const modTopics = topicsCached.filter(t => String(t.module_id || '').toLowerCase() === String(m.id || '').toLowerCase());
      const mTotal = modTopics.length;
      const mNotStarted = modTopics.filter(t => t.status === 'Not Started').length;
      const mLearning = modTopics.filter(t => t.status === 'Learning').length;
      const mMastered = modTopics.filter(t => t.status === 'Mastered').length;
      const mPracticed = modTopics.filter(t => t.status === 'Practiced').length;
      const mUnderstood = modTopics.filter(t => t.status === 'Understood').length;
      const mProg = mTotal ? Math.round(((mMastered + mPracticed * 0.8 + mUnderstood * 0.5 + mLearning * 0.2) / mTotal) * 100) : (m.progress || 0);

      return Object.assign({}, m, {
        progress: mProg,
        total: mTotal,
        not_started: mNotStarted,
        learning: mLearning
      });
    });

    return {
      kpis: {
        overall_progress: progress,
        total_topics: total,
        not_started: notStarted,
        learning: learning,
        understood: understood,
        practiced: practiced,
        mastered: mastered,
        knowledge_gaps: notStarted + learning,
        topics_to_review: topicsCached.filter(t => t.next_review_date && new Date(t.next_review_date) <= new Date()).length
      },
      modules: mappedModules,
      topics: topicsCached,
      review_summary: { due_today: 0, overdue: 0 }
    };
  }



  function drawDashboard(container, data) {
    _lastRenderedHash = computeHash(data);
    const k = data.kpis;
    const isAr = I18n.getLang() === 'ar';

    const allTopics = Array.isArray(data.topics) ? data.topics : [];
    const pinnedTopics = allTopics.filter(t => t.pinned === true || t.pinned === 'TRUE' || t.pinned === 'true' || t.pinned === 1);
    const goalsTopics  = allTopics.filter(t => t.target_date && t.status !== 'Mastered');

    if (allTopics.length) API._dashboardTopics = allTopics;

    const html = `
      <!-- 🧠 AI DAILY ERP CHALLENGE HERO BANNER -->
      <div class="card" style="margin-bottom:24px; padding:20px; background:linear-gradient(135deg, rgba(181, 119, 46, 0.08) 0%, rgba(44, 122, 107, 0.08) 100%); border-inline-start:4px solid var(--brass); display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="flex:1; min-width:240px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <h2 style="font-size:18px; font-weight:700; color:var(--ink); margin:0;">
              🧠 ${isAr ? 'تحدي الـ ERP اليومي بالذكاء الاصطناعي' : 'Today\'s AI Daily ERP Challenge'}
            </h2>
            <span class="badge badge-brass" style="font-size:11px;">10 Questions</span>
          </div>
          <p style="font-size:13px; color:var(--ink-soft); margin:0;">
            ${isAr ? 'أسئلة تدريب تفاعلية مخصصة اليوم تركز على فجواتك المعرفية والمواضيع المستحقة للمراجعة.' : 'Personalized interactive practice questions tailored to your knowledge gaps & review queue.'}
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="Router.go('daily-challenge')" style="padding:10px 18px; font-weight:600; font-size:13px;">
            🧠 ${isAr ? 'بدء تحدي اليوم' : 'Daily Challenge'}
          </button>
          <button class="btn btn-secondary" onclick="Router.go('database-explorer')" style="padding:10px 16px; font-size:13px; color:var(--brass-deep); font-weight:600;">
            🗄️ ${isAr ? 'مستكشف الداتا بيز' : 'DB Explorer'}
          </button>
          <button class="btn btn-secondary" onclick="Router.go('scripts')" style="padding:10px 16px; font-size:13px; color:var(--teal); font-weight:600;">
            🛠️ ${isAr ? 'مكتبة السكربتات' : 'Script Toolkit'}
          </button>
          <button class="btn btn-secondary" onclick="Router.go('question-bank')" style="padding:10px 16px; font-size:13px;">
            📚 ${isAr ? 'بنك الأسئلة' : 'Question Bank'}
          </button>
        </div>
      </div>

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

      ${data.review_summary && (data.review_summary.due_today + data.review_summary.overdue > 0) ? `
      <div class="card" style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
        <div>${I18n.t('dashboard.overdueAndDue', { overdue: data.review_summary.overdue, due: data.review_summary.due_today })}</div>
        <button class="btn btn-sm btn-primary" data-route="review">${I18n.t('dashboard.goToReview')}</button>
      </div>` : ''}

      <!-- 🔥 STREAK, 📌 PINNED & 🎯 GOALS WIDGETS ROW -->
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-bottom:28px;">

        <!-- 🔥 Study Streak Widget -->
        <div class="card streak-widget-card" id="streak-widget-container" style="padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="streak-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-size:16px; font-weight:700; margin:0; display:flex; align-items:center; gap:6px;">
                🔥 ${I18n.t('dashboard.studyStreak')}
              </h3>
              <span class="badge" style="background:var(--rust-soft); color:var(--rust); font-weight:700;" id="streak-badge-current">0d</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px;">
              <span>${I18n.t('dashboard.currentStreak')}: <strong id="streak-val-current" class="mono">0</strong></span>
              <span>🏆 ${I18n.t('dashboard.longestStreak')}: <strong id="streak-val-longest" class="mono">0</strong></span>
            </div>
            <p style="font-size:12px; color:var(--ink-soft); margin:0 0 12px; line-height:1.4;">
              ${isAr ? 'تُسجل أيام التعلّم اليومية تلقائياً بمجرد إضافة، مراجعة، أو تحديث أي موضوع!' : 'Tracks your active learning days automatically when adding or reviewing topics!'}
            </p>
          </div>
          <div class="streak-7days" id="streak-7days-circles">
            ${Array(7).fill(0).map((_, i) => `<div class="streak-day-circle">—</div>`).join('')}
          </div>
        </div>

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

    // PERF: Scheduled 60fps DOM render
    window.requestAnimationFrame(() => {
      container.innerHTML = html;

      container.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => Router.go('module', { id: card.dataset.moduleId }));
      });
      container.querySelectorAll('.dash-pinned-item, .dash-goal-item').forEach(el => {
        el.addEventListener('click', () => Topics.openDetail(el.dataset.id));
      });

      const reviewBtn = container.querySelector('[data-route="review"]');
      if (reviewBtn) reviewBtn.addEventListener('click', () => Router.go('review'));

      // PERF: Populate 🔥 Streak Widget data asynchronously
      API.getStreak().then(streakData => {
        if (!streakData) return;
        const curEl = container.querySelector('#streak-val-current');
        const longEl = container.querySelector('#streak-val-longest');
        const badgeEl = container.querySelector('#streak-badge-current');
        const circlesEl = container.querySelector('#streak-7days-circles');

        if (curEl) curEl.textContent = streakData.current_streak || 0;
        if (longEl) longEl.textContent = streakData.longest_streak || 0;
        if (badgeEl) badgeEl.textContent = (streakData.current_streak || 0) + 'd';

        if (circlesEl && Array.isArray(streakData.last_7_days)) {
          circlesEl.innerHTML = streakData.last_7_days.map(d => {
            const dayName = new Date(d.date).toLocaleDateString(I18n.getLang() === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'narrow' });
            return `<div class="streak-day-circle ${d.active ? 'active' : ''}" title="${d.date}">${dayName}</div>`;
          }).join('');
        }
      }).catch(() => {});
    });

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
