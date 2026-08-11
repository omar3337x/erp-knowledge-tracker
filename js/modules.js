/**
 * js/modules.js
 * Renders a single Module's dashboard: stats + filterable Topics table.
 */

const Modules = (function () {

  async function render(container, moduleId) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading module...</div>`;

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
    if (!mod) { container.innerHTML = UI.errorState('Module not found.'); return; }

    State.categoriesCache[moduleId] = categories;
    const stats = computeStats(topics);

    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">Module Progress</div><div class="kpi-value brass">${stats.progress}%</div></div>
        <div class="card kpi-card"><div class="kpi-label">Total Topics</div><div class="kpi-value">${topics.length}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Completed</div><div class="kpi-value teal">${stats.mastered}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Learning</div><div class="kpi-value">${stats.learning}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Knowledge Gaps</div><div class="kpi-value rust">${stats.gaps}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Mastered</div><div class="kpi-value teal">${stats.mastered}</div></div>
      </div>

      <div class="toolbar">
        <div class="field">
          <select id="filter-category">
            <option value="">All Categories</option>
            ${categories.map(c => `<option value="${c.id}">${c.name_en}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-status">
            <option value="">All Statuses</option>
            ${Topics.STATUS_VALUES.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-priority">
            <option value="">All Priorities</option>
            ${Topics.PRIORITY_VALUES.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="add-gap-btn">+ Add Knowledge Gap</button>
      </div>

      <div id="topics-table-wrap"></div>
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
      Topics.renderTable(tableWrap, filtered, { categories, emptyHint: 'Start by adding the first topic you want to learn.' });
    };
    draw();
    container.querySelectorAll('#filter-category,#filter-status,#filter-priority').forEach(el => el.addEventListener('change', draw));

    container.querySelector('#add-gap-btn').addEventListener('click', () => {
      Topics.openAddModal(moduleId, categories, async () => {
        Router.go('module', { id: moduleId }); // reload
      });
    });
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
