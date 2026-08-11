/**
 * js/topics.js
 * Shared topic table renderer + Add Knowledge Gap modal + Topic Detail modal
 * (basic info, What I Know/Don't Know/Need to Learn, Business & ERP
 * understanding, Practical Experience, Notes, status lifecycle, reviews).
 */

const Topics = (function () {

  const STATUS_VALUES = ['Not Started', 'Learning', 'Understood', 'Practiced', 'Mastered'];
  const PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'];

  function statusBadge(status) {
    const slug = status.toLowerCase().replace(/\s+/g, '-');
    return `<span class="badge badge-status-${slug}">${status}</span>`;
  }
  function priorityBadge(priority) {
    const slug = priority.toLowerCase();
    return `<span class="badge badge-priority-${slug}">${priority}</span>`;
  }

  // --------------------------------------------------------------------
  // TABLE
  // --------------------------------------------------------------------
  function renderTable(container, topics, opts) {
    opts = opts || {};
    if (!topics.length) {
      container.innerHTML = UI.emptyState(I18N.t('topics.empty'), opts.emptyHint || I18N.t('topics.empty_hint'));
      return;
    }
    const catName = (id) => {
      const c = (opts.categories || []).find(c => c.id === id);
      return c ? I18N.getCategoryName(c) : '—';
    };
    const modName = (id) => {
      const m = State.modulesCache.find(m => m.id === id);
      return m ? I18N.getModuleName(m) : '—';
    };
    const showModuleCol = !!opts.showModule;

    container.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${I18N.t('topics.table.topic')}</th>
            ${showModuleCol ? `<th>${I18N.t('topics.table.module')}</th>` : ''}
            <th>${I18N.t('topics.table.category')}</th>
            <th>${I18N.t('topics.table.status')}</th>
            <th>${I18N.t('topics.table.priority')}</th>
            <th>${I18N.t('topics.table.progress')}</th>
            <th>${I18N.t('topics.table.last_review')}</th>
            <th>${I18N.t('topics.table.next_review')}</th>
          </tr></thead>
          <tbody>
            ${topics.map(t => `
              <tr data-id="${t.id}">
                <td><strong>${escapeHtml(t.topic)}</strong></td>
                ${showModuleCol ? `<td>${modName(t.module_id)}</td>` : ''}
                <td>${catName(t.category_id)}</td>
                <td>${statusBadge(t.status)}</td>
                <td>${priorityBadge(t.priority)}</td>
                <td class="mono">${t.progress}%</td>
                <td class="mono">${UI.fmtDate(t.last_review)}</td>
                <td class="mono">${UI.fmtDate(t.next_review)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('click', () => openDetail(row.dataset.id));
    });
  }

  // --------------------------------------------------------------------
  // ADD KNOWLEDGE GAP MODAL
  // --------------------------------------------------------------------
  function openAddModal(defaultModuleId, categories, onSaved) {
    const modules = State.modulesCache;
    const body = `
      <div class="modal-head">
        <h3>${I18N.t('topics.add_title')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="add-topic-form">
        <div class="field">
          <label>${I18N.t('topics.add_topic_name')}</label>
          <input name="topic" required placeholder="${I18N.t('topics.add_topic_name_ph')}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>${I18N.t('topics.add_module')}</label>
            <select name="module_id" id="at-module" required>
              ${modules.map(m => `<option value="${m.id}" ${m.id===defaultModuleId?'selected':''}>${I18N.getModuleName(m)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>${I18N.t('topics.add_category')}</label>
            <select name="category_id" id="at-category"></select>
          </div>
        </div>
        <div class="field">
          <label>${I18N.t('topics.add_description')}</label>
          <textarea name="description" placeholder="${I18N.t('topics.add_description_ph')}"></textarea>
        </div>
        <div class="field">
          <label>${I18N.t('topics.add_priority')}</label>
          <select name="priority">
            ${PRIORITY_VALUES.map(p => `<option ${p==='Medium'?'selected':''}>${I18N.priorityLabel(p)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>${I18N.t('topics.add_current_understanding')}</label>
          <textarea name="current_understanding" placeholder="${I18N.t('topics.add_current_understanding_ph')}"></textarea>
        </div>
        <div class="field">
          <label>${I18N.t('topics.add_what_dont_know')}</label>
          <textarea name="what_i_dont_know" placeholder="${I18N.t('topics.add_what_dont_know_ph')}"></textarea>
        </div>
        <div class="field">
          <label>${I18N.t('topics.add_what_need_to_learn')}</label>
          <textarea name="what_i_need_to_learn" placeholder="${I18N.t('topics.add_what_need_to_learn_ph')}"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">${I18N.t('topics.add_save')}</button>
      </form>
    `;
    const modal = UI.openModal(body);

    async function refreshCategories(moduleId) {
      const catSelect = modal.querySelector('#at-category');
      let cats = State.categoriesCache[moduleId];
      if (!cats) {
        cats = await API.categories(moduleId);
        State.categoriesCache[moduleId] = cats;
      }
      catSelect.innerHTML = cats.map(c => `<option value="${c.id}">${c.name_en}</option>`).join('');
    }
    refreshCategories(defaultModuleId || modules[0].id);
    modal.querySelector('#at-module').addEventListener('change', (e) => refreshCategories(e.target.value));

    modal.querySelector('#add-topic-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        await API.createTopic(payload);
        UI.toast('Topic added successfully', 'success');
        UI.closeModal();
        if (onSaved) onSaved();
      } catch (err) {
        UI.toast(err.message, 'error');
      } finally {
        btn.disabled = false;
      }
    });
  }

  // --------------------------------------------------------------------
  // TOPIC DETAIL MODAL
  // --------------------------------------------------------------------
  async function openDetail(id) {
    const modal = UI.openModal(`<div class="loading-row"><span class="spinner"></span> Loading topic...</div>`, 'modal-lg');
    let data;
    try {
      data = await API.topic(id);
    } catch (err) {
      modal.innerHTML = UI.errorState(err.message);
      return;
    }
    const t = data.topic;
    const knowledge = data.knowledge || {};
    const mod = State.modulesCache.find(m => m.id === t.module_id);
    const cats = State.categoriesCache[t.module_id] || await API.categories(t.module_id);
    const cat = cats.find(c => c.id === t.category_id);

    modal.innerHTML = `
      <div class="modal-head">
        <div>
          <h3>${escapeHtml(t.topic)}</h3>
          <div class="field-hint">${mod ? I18N.getModuleName(mod) : ''} ${cat ? '· ' + I18N.getCategoryName(cat) : ''}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-danger btn-sm" id="delete-topic-btn">${I18N.t('general.delete')}</button>
          <button class="btn btn-icon btn-ghost" data-close>&times;</button>
        </div>
      </div>

      <div class="status-stepper" style="margin-bottom:18px;">
        ${STATUS_VALUES.map((s, i) => {
          const currentIdx = STATUS_VALUES.indexOf(t.status);
          const cls = i < currentIdx ? 'done' : (i === currentIdx ? 'current' : '');
          return `<button class="status-step ${cls}" data-status="${s}">${I18N.statusLabel(s)}</button>`;
        }).join('')}
      </div>

      <div class="tabs">
        <button class="tab active" data-tab="knowledge">${I18N.t('knowledge.tab_knowledge')}</button>
        <button class="tab" data-tab="business">${I18N.t('knowledge.tab_business')}</button>
        <button class="tab" data-tab="practical">${I18N.t('knowledge.tab_practical')}</button>
        <button class="tab" data-tab="reviews">${I18N.t('knowledge.tab_reviews')}</button>
      </div>

      <div id="tab-panels"></div>
    `;

    modal.querySelector('#delete-topic-btn').addEventListener('click', async () => {
      if (!confirm(I18N.t('topics.delete_confirm'))) return;
      try {
        await API.deleteTopic(id);
        UI.toast(I18N.t('toast.topic_deleted'), 'success');
        UI.closeModal();
        Router.reload();
      } catch (err) { UI.toast(err.message, 'error'); }
    });

    modal.querySelectorAll('.status-step').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await API.updateStatus(id, btn.dataset.status);
          UI.toast(I18N.t('toast.status_updated'), 'success');
          openDetail(id); // re-render with fresh state
        } catch (err) { UI.toast(err.message, 'error'); }
      });
    });

    const panels = modal.querySelector('#tab-panels');
    function paintTab(tab) {
      modal.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      if (tab === 'knowledge') panels.innerHTML = Knowledge.renderKnowledgeTab(t, knowledge);
      if (tab === 'business') panels.innerHTML = Knowledge.renderBusinessErpTab(knowledge);
      if (tab === 'practical') panels.innerHTML = Knowledge.renderPracticalTab(t, knowledge);
      if (tab === 'reviews') panels.innerHTML = Reviews.renderTopicReviewsTab(t, data.reviews);
      Knowledge.bindTab(panels, t.id);
      Reviews.bindTab(panels, t.id, () => openDetail(id));
    }
    modal.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => paintTab(b.dataset.tab)));
    paintTab('knowledge');
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderTable, openAddModal, openDetail, statusBadge, priorityBadge, escapeHtml, STATUS_VALUES, PRIORITY_VALUES };
})();
