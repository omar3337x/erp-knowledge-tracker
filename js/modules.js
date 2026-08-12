/**
 * js/modules.js
 * Renders a single Module's dashboard: stats + filterable Topics table +
 * the Categories management section for that module.
 *
 * Only ONE network call happens here (API.topics({module_id})) — Modules
 * and Categories are already sitting in State from the one-time reference
 * data load at boot, so opening a module never re-fetches them.
 *
 * After a category change, only the categories section + filter dropdown
 * are refreshed in-place. The topics table is NOT reloaded unless needed.
 */

const Modules = (function () {

  async function render(container, moduleId) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;

    const mod = State.modulesCache.find(m => m.id === moduleId);
    if (!mod) { container.innerHTML = UI.errorState({ code: 'MODULE_NOT_FOUND' }); return; }

    let topics;
    try {
      topics = await API.topics({ module_id: moduleId });
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    const stats = computeStats(topics);

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

      <div id="topics-table-wrap"></div>

      <div id="categories-section-wrap" style="margin-top:32px;"></div>
    `;

    // ---- topics table logic ----
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
    container.querySelectorAll('#filter-category,#filter-status,#filter-priority')
      .forEach(el => el.addEventListener('change', draw));

    container.querySelector('#add-gap-btn').addEventListener('click', () => {
      Topics.openAddModal(moduleId, () => Router.go('module', { id: moduleId }));
    });

    // ---- categories section ----
    // When a category changes, just refresh the filter-dropdown options in place
    const catWrap = container.querySelector('#categories-section-wrap');
    const onCategoryChange = () => {
      // Rebuild only the dropdown
      const sel = container.querySelector('#filter-category');
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = `<option value="">${I18n.t('module.allCategories')}</option>${_buildCatOptions(moduleId)}`;
      // Restore previously selected value if it still exists
      if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
      draw();
    };

    Categories.renderSection(catWrap, moduleId, topics, onCategoryChange);
  }

  function _buildCatOptions(moduleId) {
    return State.categoriesForModule(moduleId)
      .map(c => `<option value="${c.id}">${I18n.localizedName(c)}</option>`)
      .join('');
  }

  function computeStats(topics) {
    const total = topics.length;
    const sum = topics.reduce((a, t) => a + Number(t.progress || 0), 0);
    return {
      progress: total ? Math.round(sum / total) : 0,
      mastered:  topics.filter(t => t.status === 'Mastered').length,
      practiced: topics.filter(t => t.status === 'Practiced').length,
      learning:  topics.filter(t => t.status === 'Learning').length,
      gaps:      topics.filter(t => t.status === 'Not Started' || t.status === 'Learning').length,
    };
  }

  return { render };
})();
