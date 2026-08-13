/**
 * js/modules.js - High Performance Module Dashboard Renderer
 *
 * PERF FEATURES:
 *  - Skeleton UI Shimmers: Displays table skeletons during fetch
 *  - Memory-based Filtering: Instant 0ms response on status/priority/category dropdown changes
 *  - Fast DocumentFragment insertion for DOM updates
 */

const Modules = (function () {

  async function render(container, moduleId) {
    const mod = State.modulesCache.find(m => m.id === moduleId);
    if (!mod) { container.innerHTML = UI.errorState({ code: 'MODULE_NOT_FOUND' }); return; }

    // PERF: Layout Shimmer UI instead of spinner
    container.innerHTML = `
      <div style="margin-bottom:20px;">${UI.skeleton('kpi')}</div>
      ${UI.skeleton('table')}
    `;

    let allTopics;
    try {
      allTopics = await API.topics({});
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    const topics = allTopics.filter(t => t.module_id === moduleId);
    const stats   = computeStats(topics);

    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.moduleProgress')}</div><div class="kpi-value brass">${stats.progress}%</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.totalTopics')}</div><div class="kpi-value">${topics.length}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.completed')}</div><div class="kpi-value teal">${stats.mastered}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.learning')}</div><div class="kpi-value">${stats.learning}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.knowledgeGaps')}</div><div class="kpi-value rust">${stats.gaps}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.mastered')}</div><div class="kpi-value teal">${stats.mastered}</div></div>
      </div>

      <div class="toolbar">
        <div class="field" id="filter-cat-wrap">
          <select id="filter-category">
            <option value="">${I18n.t('module.allCategories')}</option>
            ${_buildCatOptions(moduleId)}
          </select>
        </div>
        <div class="field">
          <select id="filter-status">
            <option value="">${I18n.t('module.allStatuses')}</option>
            ${Topics.STATUS_VALUES.map(s => `<option value="${s}">${I18n.statusLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-priority">
            <option value="">${I18n.t('module.allPriorities')}</option>
            ${Topics.PRIORITY_VALUES.map(p => `<option value="${p}">${I18n.priorityLabel(p)}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="add-gap-btn">${I18n.t('module.addKnowledgeGap')}</button>
      </div>

      <div id="ai-insights-section-wrap" style="margin-top:24px; margin-bottom:28px;"></div>
      <div id="topics-table-wrap"></div>
      <div id="notes-section-wrap-module"></div>
      <div id="categories-section-wrap" style="margin-top:32px;"></div>
    `;

    // ---- AI Insights Section (Asynchronous 0ms load) ----
    const aiWrap = container.querySelector('#ai-insights-section-wrap');
    loadAIInsightsSection(aiWrap, moduleId);

    // ---- topics table ----
    const tableWrap = container.querySelector('#topics-table-wrap');
    const draw = () => {
      const catF  = container.querySelector('#filter-category').value;
      const statF = container.querySelector('#filter-status').value;
      const prioF = container.querySelector('#filter-priority').value;
      let filtered = topics;
      if (catF)  filtered = filtered.filter(t => t.category_id === catF);
      if (statF) filtered = filtered.filter(t => t.status === statF);
      if (prioF) filtered = filtered.filter(t => t.priority === prioF);
      Topics.renderTable(tableWrap, filtered, { emptyHint: I18n.t('empty.startAdding') });
    };
    draw();

    // PERF: Instant 0ms memory filter change
    container.querySelectorAll('#filter-category,#filter-status,#filter-priority')
      .forEach(el => el.addEventListener('change', draw));

    container.querySelector('#add-gap-btn').addEventListener('click', () => {
      Topics.openAddModal(moduleId, () => {
        API.cacheBust('topics');
        Router.go('module', { id: moduleId });
      });
    });

    // ---- notes section ----
    const notesWrap = container.querySelector('#notes-section-wrap-module');
    Notes.renderSection(notesWrap, moduleId);

    // ---- categories section ----
    const catWrap = container.querySelector('#categories-section-wrap');
    const onCategoryChange = () => {
      const sel = container.querySelector('#filter-category');
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = `<option value="">${I18n.t('module.allCategories')}</option>${_buildCatOptions(moduleId)}`;
      if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
      draw();
    };

    Categories.renderSection(catWrap, moduleId, onCategoryChange);
  }

  async function loadAIInsightsSection(wrapEl, moduleId) {
    if (!wrapEl) return;

    wrapEl.innerHTML = `
      <div class="ai-insights-section">
        <div class="ai-insights-header">
          <h3 class="ai-insights-title">✨ ${I18n.t('ai.sectionTitle')}</h3>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-ai-insights">🔄 ${I18n.t('ai.refreshBtn')}</button>
        </div>
        <div id="ai-insights-cards-container">
          <div style="padding:16px;">${UI.skeleton('card')}</div>
        </div>
      </div>
    `;

    const cardsContainer = wrapEl.querySelector('#ai-insights-cards-container');
    const refreshBtn = wrapEl.querySelector('#btn-refresh-ai-insights');

    let currentInsights = [];
    let favoritesMap = {};

    const renderInsightsList = () => {
      if (!currentInsights || !currentInsights.length) {
        cardsContainer.innerHTML = `<p style="font-size:13px; color:var(--ink-soft); margin:0;">${I18n.t('ai.error')}</p>`;
        return;
      }

      cardsContainer.innerHTML = currentInsights.map(insight => {
        const isFav = !!favoritesMap[insight.id];
        const badgeClass = getBadgeClass(insight.type);

        return `
          <div class="ai-insight-card" data-id="${insight.id}">
            <div class="ai-insight-head">
              <span class="ai-type-badge ${badgeClass}">${Topics.escapeHtml(insight.type || 'INSIGHT')}</span>
              <button class="btn-fav-toggle ${isFav ? 'is-fav' : ''}" data-action="toggle-fav" data-id="${insight.id}">
                ${isFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd')}
              </button>
            </div>
            <h4 style="font-size:15px; font-weight:700; margin:0 0 8px; color:var(--ink);">${Topics.escapeHtml(insight.title)}</h4>
            <div style="font-size:13.5px; color:var(--ink); line-height:1.5; margin-bottom:10px; white-space:pre-wrap;">${Topics.escapeHtml(insight.content)}</div>
            ${insight.example ? `
              <div style="background:var(--paper-raised); border-radius:var(--radius-sm); padding:8px 12px; margin-bottom:8px; font-size:12.5px;">
                <strong>${I18n.t('ai.example')}:</strong> ${Topics.escapeHtml(insight.example)}
              </div>
            ` : ''}
            ${insight.why_it_matters ? `
              <div style="font-size:12.5px; color:var(--ink-soft);">
                <strong>${I18n.t('ai.whyItMatters')}:</strong> ${Topics.escapeHtml(insight.why_it_matters)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      cardsContainer.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const insightId = btn.dataset.id;
          const targetInsight = currentInsights.find(i => String(i.id) === String(insightId));
          if (!targetInsight) return;

          const wasFav = !!favoritesMap[insightId];
          favoritesMap[insightId] = !wasFav;
          btn.classList.toggle('is-fav', !wasFav);
          btn.innerHTML = !wasFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd');

          try {
            if (wasFav) {
              await API.removeFavorite({ insight_id: insightId });
            } else {
              await API.addFavorite({
                insight_id: insightId,
                module_id: moduleId,
                title: targetInsight.title,
                type: targetInsight.type,
                content: targetInsight.content,
                example: targetInsight.example || '',
                why_it_matters: targetInsight.why_it_matters || ''
              });
            }
          } catch (err) {
            favoritesMap[insightId] = wasFav;
            btn.classList.toggle('is-fav', wasFav);
            btn.innerHTML = wasFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd');
            UI.toastError(err);
          }
        });
      });
    };

    try {
      const [res, favs] = await Promise.all([
        API.getModuleInsights(moduleId).catch(() => null),
        API.getFavorites().catch(() => [])
      ]);

      if (favs && Array.isArray(favs)) {
        favs.forEach(f => { favoritesMap[f.insight_id] = true; });
      }

      currentInsights = (res && Array.isArray(res.insights)) ? res.insights : [];
      renderInsightsList();
    } catch (err) {
      cardsContainer.innerHTML = `<p style="font-size:13px; color:var(--ink-soft); margin:0;">${I18n.t('ai.error')}</p>`;
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        if (!confirm(I18n.t('ai.refreshConfirmBody'))) return;
        refreshBtn.disabled = true;
        cardsContainer.innerHTML = `<div style="padding:16px;">${UI.skeleton('card')}</div>`;
        try {
          const freshRes = await API.refreshModuleInsights(moduleId);
          currentInsights = (freshRes && Array.isArray(freshRes.insights)) ? freshRes.insights : [];
          renderInsightsList();
          UI.toast(I18n.getLang() === 'ar' ? 'تمت إضافة الـ Insights الجديدة بنجاح' : 'New AI Insights generated', 'success');
        } catch (err) {
          renderInsightsList();
          UI.toastError(err);
        } finally {
          refreshBtn.disabled = false;
        }
      });
    }
  }

  function getBadgeClass(type) {
    const t = String(type || '').toLowerCase();
    if (t.includes('tip')) return 'ai-type-tip';
    if (t.includes('trick')) return 'ai-type-trick';
    if (t.includes('business') || t.includes('process')) return 'ai-type-business';
    if (t.includes('mistake') || t.includes('error')) return 'ai-type-mistake';
    if (t.includes('warn')) return 'ai-type-warning';
    if (t.includes('practice') || t.includes('best')) return 'ai-type-practice';
    if (t.includes('account') || t.includes('tax')) return 'ai-type-accounting';
    return 'ai-type-default';
  }

  function _buildCatOptions(moduleId) {
    return State.categoriesForModule(moduleId)
      .map(c => `<option value="${c.id}">${I18n.localizedName(c)}</option>`)
      .join('');
  }

  function computeStats(topics) {
    const total = topics.length;
    const sum   = topics.reduce((a, t) => a + Number(t.progress || 0), 0);
    return {
      progress:  total ? Math.round(sum / total) : 0,
      mastered:  topics.filter(t => t.status === 'Mastered').length,
      practiced: topics.filter(t => t.status === 'Practiced').length,
      learning:  topics.filter(t => t.status === 'Learning').length,
      gaps:      topics.filter(t => t.status === 'Not Started' || t.status === 'Learning').length,
    };
  }

  return { render };
})();
