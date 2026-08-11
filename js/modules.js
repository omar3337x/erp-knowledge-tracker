/**
 * js/modules.js — Renders a single Module's dashboard with stats, filterable Topics, and Category Management.
 */

const Modules = (function () {

  async function render(container, moduleId) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_module')}</div>`;

    let mod = State.modulesCache.find(m => m.id === moduleId);
    let topics, categories;
    try {
      [topics, categories] = await Promise.all([
        API.topics({ module_id: moduleId }),
        API.categories(moduleId)
      ]);
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }
    if (!mod) { container.innerHTML = UI.errorState(I18N.t('general.page_not_found')); return; }

    State.categoriesCache[moduleId] = categories;
    const stats = computeStats(topics);

    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('module.progress')}</div><div class="kpi-value brass">${stats.progress}%</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('module.total_topics')}</div><div class="kpi-value">${topics.length}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('module.completed')}</div><div class="kpi-value teal">${stats.mastered}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('module.learning')}</div><div class="kpi-value">${stats.learning}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18N.t('module.gaps')}</div><div class="kpi-value rust">${stats.gaps}</div></div>
      </div>

      <div class="toolbar">
        <div class="field">
          <select id="filter-category">
            <option value="">${I18N.t('module.all_categories')}</option>
            ${categories.map(c => `<option value="${c.id}">${I18N.getCategoryName(c)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-status">
            <option value="">${I18N.t('module.all_statuses')}</option>
            ${Topics.STATUS_VALUES.map(s => `<option value="${s}">${I18N.statusLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-priority">
            <option value="">${I18N.t('module.all_priorities')}</option>
            ${Topics.PRIORITY_VALUES.map(p => `<option value="${p}">${I18N.priorityLabel(p)}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="add-gap-btn">${I18N.t('module.add_gap')}</button>
      </div>

      <div id="topics-table-wrap"></div>

      <!-- Category Management Section -->
      <div id="categories-section" style="margin-top:40px; padding-top:24px; border-top:1px solid var(--line);">
      </div>
    `;

    const tableWrap = container.querySelector('#topics-table-wrap');
    const draw = () => {
      const catF = container.querySelector('#filter-category').value;
      const statF = container.querySelector('#filter-status').value;
      const prioF = container.querySelector('#filter-priority').value;
      let filtered = topics;
      if (catF) filtered = filtered.filter(t => t.category_id === catF);
      if (statF) filtered = filtered.filter(t => t.status === statF);
      if (prioF) filtered = filtered.filter(t => t.priority === prioF);
      Topics.renderTable(tableWrap, filtered, { categories, emptyHint: I18N.t('module.no_data') });
    };
    draw();
    container.querySelectorAll('#filter-category,#filter-status,#filter-priority').forEach(el => el.addEventListener('change', draw));

    container.querySelector('#add-gap-btn').addEventListener('click', () => {
      Topics.openAddModal(moduleId, categories, async () => {
        Router.go('module', { id: moduleId });
      });
    });

    // Render Category Management
    Categories.renderTable(
      container.querySelector('#categories-section'),
      moduleId,
      State.modulesCache,
      categories,
      topics
    );
  }

  function computeStats(topics) {
    const total = topics.length;
    const sum = topics.reduce((a, t) => a + Number(t.progress || 0), 0);
    return {
      progress: total ? Math.round(sum / total) : 0,
      mastered: topics.filter(t => t.status === 'Mastered').length,
      practiced: topics.filter(t => t.status === 'Practiced').length,
      learning: topics.filter(t => t.status === 'Learning').length,
      gaps: topics.filter(t => t.status === 'Not Started' || t.status === 'Learning').length
    };
  }

  return { render };
})();
