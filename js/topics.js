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
    return `<span class="badge badge-status-${slug}">${I18n.statusLabel(status)}</span>`;
  }
  function priorityBadge(priority) {
    const slug = priority.toLowerCase();
    return `<span class="badge badge-priority-${slug}">${I18n.priorityLabel(priority)}</span>`;
  }

  // --------------------------------------------------------------------
  // TABLE
  // --------------------------------------------------------------------
  function renderTable(container, topics, opts) {
    opts = opts || {};
    if (!topics.length) {
      container.innerHTML = UI.emptyState(I18n.t('empty.noKnowledgeGaps'), opts.emptyHint || I18n.t('empty.startAdding'));
      return;
    }
    const catName = (id) => {
      const c = State.allCategories.find(c => c.id === id);
      return c ? I18n.localizedName(c) : '—';
    };
    const modName = (id) => {
      const m = State.modulesCache.find(m => m.id === id);
      return m ? I18n.localizedName(m) : '—';
    };
    const showModuleCol = !!opts.showModule;

    container.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${I18n.t('table.topic')}</th>
            ${showModuleCol ? `<th>${I18n.t('table.module')}</th>` : ''}
            <th>${I18n.t('table.category')}</th>
            <th>${I18n.t('table.status')}</th>
            <th>${I18n.t('table.priority')}</th>
            <th>${I18n.t('table.progress')}</th>
            <th>${I18n.t('table.lastReview')}</th>
            <th>${I18n.t('table.nextReview')}</th>
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
  function openAddModal(defaultModuleId, onSaved) {
    const modules = State.modulesCache;
    defaultModuleId = defaultModuleId || (modules[0] && modules[0].id);

    const body = `
      <div class="modal-head">
        <h3>${I18n.t('addTopic.title')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="add-topic-form">
        <div class="field">
          <label>${I18n.t('addTopic.topicName')}</label>
          <input name="topic" required placeholder="${I18n.t('addTopic.topicNamePlaceholder')}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>${I18n.t('addTopic.module')}</label>
            <select name="module_id" id="at-module" required>
              ${modules.map(m => `<option value="${m.id}" ${m.id===defaultModuleId?'selected':''}>${I18n.localizedName(m)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>${I18n.t('addTopic.category')}</label>
            <select name="category_id" id="at-category"></select>
          </div>
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.description')}</label>
          <textarea name="description" placeholder="${I18n.t('addTopic.descriptionPlaceholder')}"></textarea>
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.priority')}</label>
          <select name="priority">
            ${PRIORITY_VALUES.map(p => `<option value="${p}" ${p==='Medium'?'selected':''}>${I18n.priorityLabel(p)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.currentUnderstanding')}</label>
          <textarea name="current_understanding" placeholder="${I18n.t('addTopic.currentUnderstandingPlaceholder')}"></textarea>
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.whatIDontKnow')}</label>
          <textarea name="what_i_dont_know" placeholder="${I18n.t('addTopic.whatIDontKnowPlaceholder')}"></textarea>
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.whatINeedToLearn')}</label>
          <textarea name="what_i_need_to_learn" placeholder="${I18n.t('addTopic.whatINeedToLearnPlaceholder')}"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">${I18n.t('addTopic.save')}</button>
      </form>
    `;
    const modal = UI.openModal(body);

    function paintCategories(moduleId) {
      const catSelect = modal.querySelector('#at-category');
      const cats = State.categoriesForModule(moduleId);
      catSelect.innerHTML = cats.map(c => `<option value="${c.id}">${I18n.localizedName(c)}</option>`).join('');
    }
    paintCategories(defaultModuleId);
    modal.querySelector('#at-module').addEventListener('change', (e) => paintCategories(e.target.value));

    modal.querySelector('#add-topic-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      UI.closeModal();
      UI.toast(I18n.t('toast.topicAdded'), 'success');
      if (onSaved) onSaved();

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.createTopic(payload).catch(err => {
        UI.toastError(err);
      });
    });
  }

  // --------------------------------------------------------------------
  // TOPIC DETAIL MODAL
  // --------------------------------------------------------------------
  async function openDetail(id) {
    const modal = UI.openModal(`<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`, 'modal-lg');
    let data;
    try {
      data = await API.topic(id);
    } catch (err) {
      modal.innerHTML = UI.errorState(err);
      return;
    }
    const t = data.topic;
    const knowledge = data.knowledge || {};
    const mod = State.modulesCache.find(m => m.id === t.module_id);
    const cat = State.allCategories.find(c => c.id === t.category_id);

    modal.innerHTML = `
      <div class="modal-head">
        <div>
          <h3>${escapeHtml(t.topic)}</h3>
          <div class="field-hint">${mod ? I18n.localizedName(mod) : ''} ${cat ? '· ' + I18n.localizedName(cat) : ''}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-danger btn-sm" id="delete-topic-btn">${I18n.t('topicDetail.deleteTopic')}</button>
          <button class="btn btn-icon btn-ghost" data-close>&times;</button>
        </div>
      </div>

      <div class="status-stepper" id="topic-status-stepper" style="margin-bottom:18px;">
        ${_renderStepperHtml(t.status)}
      </div>

      <div class="tabs">
        <button class="tab active" data-tab="knowledge">${I18n.t('topicDetail.tabKnowledge')}</button>
        <button class="tab" data-tab="business">${I18n.t('topicDetail.tabBusiness')}</button>
        <button class="tab" data-tab="practical">${I18n.t('topicDetail.tabPractical')}</button>
        <button class="tab" data-tab="reviews">${I18n.t('topicDetail.tabReviews')}</button>
      </div>

      <div id="tab-panels"></div>
    `;

    modal.querySelector('#delete-topic-btn').addEventListener('click', () => {
      if (!confirm(I18n.t('topicDetail.confirmDeleteTopic'))) return;
      // ── OPTIMISTIC DELETE (0ms) ────────────────────────────────────────
      UI.closeModal();
      UI.toast(I18n.t('toast.topicDeleted'), 'success');
      Router.reload();
      API.deleteTopic(id).catch(err => UI.toastError(err));
    });

    _bindStepper(modal, t, id);

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

  function _renderStepperHtml(currentStatus) {
    const currentIdx = STATUS_VALUES.indexOf(currentStatus);
    return STATUS_VALUES.map((s, i) => {
      const cls = i < currentIdx ? 'done' : (i === currentIdx ? 'current' : '');
      return `<button class="status-step ${cls}" data-status="${s}">${I18n.statusLabel(s)}</button>`;
    }).join('');
  }

  function _bindStepper(modal, t, id) {
    const stepperContainer = modal.querySelector('#topic-status-stepper');
    if (!stepperContainer) return;
    stepperContainer.querySelectorAll('.status-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const newStatus = btn.dataset.status;
        if (t.status === newStatus) return;

        // ── OPTIMISTIC STATUS UPDATE (0ms) ───────────────────────────────
        t.status = newStatus;
        stepperContainer.innerHTML = _renderStepperHtml(newStatus);
        _bindStepper(modal, t, id);
        UI.toast(I18n.t('toast.statusUpdated'), 'success');

        // ── BACKGROUND API CALL ──────────────────────────────────────────
        API.updateStatus(id, newStatus).catch(err => UI.toastError(err));
      });
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderTable, openAddModal, openDetail, statusBadge, priorityBadge, escapeHtml, STATUS_VALUES, PRIORITY_VALUES };
})();
