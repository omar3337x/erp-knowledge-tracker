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

      <div id="topics-table-wrap"></div>
      <div id="notes-section-wrap-module"></div>
      <div id="categories-section-wrap" style="margin-top:32px;"></div>
    `;

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

    Categories.renderSection(catWrap, moduleId, topics, onCategoryChange);
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
