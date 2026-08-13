/**
 * js/topics.js
 * Shared topic table renderer + Add Knowledge Gap modal + Topic Detail modal
 * (basic info, What I Know/Don't Know/Need to Learn, Business & ERP
 * understanding, Practical Experience, Notes, status lifecycle, reviews).
 * Features: Tags, Pinning (📌), Target Completion Dates (🎯 Goals), Multi-Filter Bar, PDF/CSV Export.
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

  function targetDateBadge(targetDateStr) {
    if (!targetDateStr) return '';
    const now = new Date();
    const target = new Date(targetDateStr);
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `<span class="target-date-badge urgent">⚠️ ${I18n.t('common.overdue')} (${Math.abs(diffDays)}d)</span>`;
    } else if (diffDays <= 3) {
      return `<span class="target-date-badge urgent">🎯 ${diffDays} ${I18n.t('common.daysLeft')}</span>`;
    } else {
      return `<span class="target-date-badge">🎯 ${diffDays} ${I18n.t('common.daysLeft')}</span>`;
    }
  }

  // --------------------------------------------------------------------
  // TABLE WITH MULTI-FILTER BAR & EXPORT
  // --------------------------------------------------------------------
  function renderTable(container, topics, opts) {
    opts = opts || {};

    if (!topics || !topics.length) {
      container.innerHTML = UI.emptyState(I18n.t('empty.noKnowledgeGaps'), opts.emptyHint || I18n.t('empty.startAdding'));
      return;
    }

    const isAr = I18n.getLang() === 'ar';
    const showModuleCol = !!opts.showModule;

    const catName = (id) => {
      const c = State.allCategories.find(c => c.id === id);
      return c ? I18n.localizedName(c) : '—';
    };
    const modName = (id) => {
      const m = State.modulesCache.find(m => m.id === id);
      return m ? I18n.localizedName(m) : '—';
    };

    let filterPriority = '';
    let filterStatus = '';

    function filterAndRender() {
      let list = topics;
      if (filterPriority) list = list.filter(t => t.priority === filterPriority);
      if (filterStatus) list = list.filter(t => t.status === filterStatus);

      // Sort pinned topics to top
      list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

      const tableBodyHtml = list.map(t => {
        const rawTags = t.tags || '';
        const tagsArr = Array.isArray(rawTags) ? rawTags : String(rawTags).split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean);
        const tagsHtml = tagsArr.map(tag => `<span class="tag-badge">#${escapeHtml(tag)}</span>`).join(' ');
        const pinBadge = t.pinned ? `<span class="pinned-badge">📌</span>` : '';
        const goalBadge = targetDateBadge(t.target_date);

        return `
          <tr data-id="${t.id}" class="${t.pinned ? 'is-pinned' : ''}">
            <td>
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                ${pinBadge}
                <strong>${escapeHtml(t.topic)}</strong>
                ${goalBadge}
              </div>
              ${tagsHtml ? `<div style="margin-top:4px;">${tagsHtml}</div>` : ''}
            </td>
            ${showModuleCol ? `<td>${modName(t.module_id)}</td>` : ''}
            <td>${catName(t.category_id)}</td>
            <td>${statusBadge(t.status)}</td>
            <td>${priorityBadge(t.priority)}</td>
            <td class="mono">${t.progress}%</td>
            <td class="mono">${UI.fmtDate(t.last_review)}</td>
            <td class="mono">${UI.fmtDate(t.next_review)}</td>
          </tr>
        `;
      }).join('');

      const tableWrap = container.querySelector('#topics-tbody-wrap');
      if (tableWrap) {
        tableWrap.innerHTML = tableBodyHtml;
        container.querySelectorAll('tbody tr').forEach(row => {
          row.addEventListener('click', () => openDetail(row.dataset.id));
        });
      }
    }

    container.innerHTML = `
      <div class="card" style="margin-bottom:16px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-radius:var(--radius-md);">
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:600; color:var(--ink-soft);">🔍 ${isAr ? 'تصفية' : 'Filters'}:</span>
          <select id="filter-priority-sel" style="padding:6px 10px; border:1px solid var(--line); border-radius:var(--radius-sm); background:var(--paper); color:var(--ink); font-size:12px;">
            <option value="">${I18n.t('module.allPriorities')}</option>
            ${PRIORITY_VALUES.map(p => `<option value="${p}">${I18n.priorityLabel(p)}</option>`).join('')}
          </select>
          <select id="filter-status-sel" style="padding:6px 10px; border:1px solid var(--line); border-radius:var(--radius-sm); background:var(--paper); color:var(--ink); font-size:12px;">
            <option value="">${I18n.t('module.allStatuses')}</option>
            ${STATUS_VALUES.map(s => `<option value="${s}">${I18n.statusLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" id="export-gaps-csv-btn">📥 CSV</button>
          <button class="btn btn-secondary btn-sm" id="export-gaps-pdf-btn">📄 PDF</button>
        </div>
      </div>

      <!-- Bulk Action Toolbar (hidden until rows selected) -->
      <div id="bulk-toolbar" style="display:none; margin-bottom:12px; padding:10px 16px; background:var(--brass-soft, #fef3c7); border:1px solid var(--brass); border-radius:var(--radius-md); display:none; align-items:center; gap:12px; flex-wrap:wrap;">
        <span id="bulk-count" style="font-weight:600; font-size:13px; color:var(--ink);">0 ${isAr ? 'محدد' : 'selected'}</span>
        <span style="color:var(--ink-soft); font-size:12px;">${isAr ? 'تغيير الحالة إلى:' : 'Change status to:'}</span>
        ${STATUS_VALUES.map(s => `
          <button class="btn btn-sm btn-secondary bulk-status-btn" data-status="${s}"
                  style="padding:4px 10px; font-size:12px;">${I18n.statusLabel(s)}</button>
        `).join('')}
        <button class="btn btn-sm btn-ghost" id="bulk-cancel-btn" style="margin-inline-start:auto; font-size:12px;">${isAr ? 'إلغاء التحديد' : 'Clear selection'}</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:36px;"><input type="checkbox" id="select-all-topics" title="${isAr ? 'تحديد الكل' : 'Select all'}"></th>
            <th>${I18n.t('table.topic')}</th>
            ${showModuleCol ? `<th>${I18n.t('table.module')}</th>` : ''}
            <th>${I18n.t('table.category')}</th>
            <th>${I18n.t('table.status')}</th>
            <th>${I18n.t('table.priority')}</th>
            <th>${I18n.t('table.progress')}</th>
            <th>${I18n.t('table.lastReview')}</th>
            <th>${I18n.t('table.nextReview')}</th>
          </tr></thead>
          <tbody id="topics-tbody-wrap"></tbody>
        </table>
      </div>
    `;

    const priSel = container.querySelector('#filter-priority-sel');
    const statSel = container.querySelector('#filter-status-sel');
    const csvBtn = container.querySelector('#export-gaps-csv-btn');
    const pdfBtn = container.querySelector('#export-gaps-pdf-btn');
    const bulkToolbar = container.querySelector('#bulk-toolbar');
    const bulkCountEl = container.querySelector('#bulk-count');
    const selectAllCb = container.querySelector('#select-all-topics');
    const bulkCancelBtn = container.querySelector('#bulk-cancel-btn');

    // Redefine filterAndRender to include checkbox column
    function filterAndRenderFull() {
      let list = topics;
      if (filterPriority) list = list.filter(t => t.priority === filterPriority);
      if (filterStatus)   list = list.filter(t => t.status   === filterStatus);
      list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

      const tableBodyHtml = list.map(t => {
        const rawTags = t.tags || '';
        const tagsArr = Array.isArray(rawTags) ? rawTags : String(rawTags).split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean);
        const tagsHtml = tagsArr.map(tag => `<span class="tag-badge">#${escapeHtml(tag)}</span>`).join(' ');
        const pinBadge = t.pinned ? `<span class="pinned-badge">📌</span>` : '';
        const goalBadge = targetDateBadge(t.target_date);
        return `
          <tr data-id="${t.id}" class="${t.pinned ? 'is-pinned' : ''}">
            <td onclick="event.stopPropagation();" style="text-align:center;">
              <input type="checkbox" class="topic-select-cb" data-id="${t.id}">
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                ${pinBadge}<strong>${escapeHtml(t.topic)}</strong>${goalBadge}
              </div>
              ${tagsHtml ? `<div style="margin-top:4px;">${tagsHtml}</div>` : ''}
            </td>
            ${showModuleCol ? `<td>${modName(t.module_id)}</td>` : ''}
            <td>${catName(t.category_id)}</td>
            <td>${statusBadge(t.status)}</td>
            <td>${priorityBadge(t.priority)}</td>
            <td class="mono">${t.progress}%</td>
            <td class="mono">${UI.fmtDate(t.last_review)}</td>
            <td class="mono">${UI.fmtDate(t.next_review)}</td>
          </tr>
        `;
      }).join('');

      const tableWrap = container.querySelector('#topics-tbody-wrap');
      if (tableWrap) {
        tableWrap.innerHTML = tableBodyHtml;
        // Row click → detail (skip checkbox cell)
        container.querySelectorAll('tbody tr').forEach(row => {
          row.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return;
            const item = list.find(x => String(x.id) === String(row.dataset.id));
            openDetail(row.dataset.id, item);
          });
        });
        // Checkbox change → update bulk toolbar
        container.querySelectorAll('.topic-select-cb').forEach(cb => {
          cb.addEventListener('change', updateBulkToolbar);
        });
      }
      // Reset select-all state
      if (selectAllCb) selectAllCb.checked = false;
      bulkToolbar.style.display = 'none';
    }

    function updateBulkToolbar() {
      const checked = [...container.querySelectorAll('.topic-select-cb:checked')];
      const count = checked.length;
      if (bulkCountEl) bulkCountEl.textContent = `${count} ${isAr ? 'محدد' : 'selected'}`;
      bulkToolbar.style.display = count > 0 ? 'flex' : 'none';
    }

    selectAllCb && selectAllCb.addEventListener('change', () => {
      container.querySelectorAll('.topic-select-cb').forEach(cb => { cb.checked = selectAllCb.checked; });
      updateBulkToolbar();
    });

    bulkCancelBtn && bulkCancelBtn.addEventListener('click', () => {
      container.querySelectorAll('.topic-select-cb').forEach(cb => { cb.checked = false; });
      if (selectAllCb) selectAllCb.checked = false;
      bulkToolbar.style.display = 'none';
    });

    // Bulk status update buttons
    container.querySelectorAll('.bulk-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const checked = [...container.querySelectorAll('.topic-select-cb:checked')];
        const ids = checked.map(cb => cb.dataset.id);
        const status = btn.dataset.status;
        if (!ids.length) return;
        btn.disabled = true;
        try {
          await API.updateStatusBulk(ids, status);
          API.cacheBust('topics', 'topic', 'dashboard', 'analytics');
          UI.toast(isAr ? `تم تحديث ${ids.length} مواضيع إلى "${I18n.statusLabel(status)}"` : `${ids.length} topics updated to "${I18n.statusLabel(status)}"`, 'success');
          // Optimistically update local topics array
          ids.forEach(id => {
            const t = topics.find(x => x.id === id);
            if (t) { t.status = status; t.progress = { 'Not Started': 0, 'Learning': 25, 'Understood': 50, 'Practiced': 75, 'Mastered': 100 }[status] || 0; }
          });
          filterAndRenderFull();
        } catch (err) {
          UI.toastError(err);
        } finally {
          btn.disabled = false;
        }
      });
    });

    priSel.addEventListener('change', (e) => { filterPriority = e.target.value; filterAndRenderFull(); });
    statSel.addEventListener('change', (e) => { filterStatus  = e.target.value; filterAndRenderFull(); });

    csvBtn.addEventListener('click', () => {
      const headers = ['Topic', 'Module', 'Category', 'Status', 'Priority', 'Progress', 'Target Date', 'Last Review', 'Next Review'];
      const rows = topics.map(t => [
        t.topic, modName(t.module_id), catName(t.category_id),
        t.status, t.priority, `${t.progress}%`,
        t.target_date || '', UI.fmtDate(t.last_review), UI.fmtDate(t.next_review)
      ]);
      ExportUtil.downloadCsv('knowledge-gaps.csv', headers, rows);
    });

    pdfBtn.addEventListener('click', () => ExportUtil.exportPdf());

    filterAndRenderFull();
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
        <div class="field-row">
          <div class="field">
            <label>${I18n.t('addTopic.priority')}</label>
            <select name="priority">
              ${PRIORITY_VALUES.map(p => `<option value="${p}" ${p==='Medium'?'selected':''}>${I18n.priorityLabel(p)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>🎯 ${I18n.t('common.targetDate')}</label>
            <input type="date" name="target_date">
          </div>
        </div>
        <div class="field">
          <label>🏷️ ${I18n.t('common.tags')}</label>
          <input type="text" name="tags" placeholder="${I18n.t('common.addTags')}">
        </div>
        <div class="field">
          <label>${I18n.t('addTopic.description')}</label>
          <textarea name="description" placeholder="${I18n.t('addTopic.descriptionPlaceholder')}"></textarea>
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
        <div class="field checkbox-row">
          <input type="checkbox" id="add-topic-pinned" name="pinned">
          <label for="add-topic-pinned" style="margin:0;">📌 ${I18n.t('common.pin')}</label>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">${I18n.t('addTopic.save')}</button>
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
      payload.pinned = modal.querySelector('#add-topic-pinned').checked;

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
  // TOPIC DETAIL MODAL (0ms Instant Render)
  // --------------------------------------------------------------------
  async function openDetail(id, initialTopicObj) {
    let t = initialTopicObj;
    if (!t) {
      const cachedDashboard = API.cacheGet('dashboard:', 'dashboard');
      if (cachedDashboard && Array.isArray(cachedDashboard.topics)) {
        t = cachedDashboard.topics.find(x => String(x.id) === String(id));
      }
    }

    const modalHtml = (topicObj) => {
      const mod = State.modulesCache.find(m => m.id === topicObj.module_id);
      const cat = State.allCategories.find(c => c.id === topicObj.category_id);
      const goalBadge = targetDateBadge(topicObj.target_date);
      return `
        <div class="modal-head">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3>${escapeHtml(topicObj.topic)}</h3>
              ${goalBadge}
            </div>
            <div class="field-hint">${mod ? I18n.localizedName(mod) : ''} ${cat ? '· ' + I18n.localizedName(cat) : ''}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-danger btn-sm" id="delete-topic-btn">${I18n.t('topicDetail.deleteTopic')}</button>
            <button class="btn btn-icon btn-ghost" data-close>&times;</button>
          </div>
        </div>

        <div class="status-stepper" id="topic-status-stepper" style="margin-bottom:18px;">
          ${_renderStepperHtml(topicObj.status)}
        </div>

        <div class="tabs">
          <button class="tab active" data-tab="knowledge">${I18n.t('topicDetail.tabKnowledge')}</button>
          <button class="tab" data-tab="business">${I18n.t('topicDetail.tabBusiness')}</button>
          <button class="tab" data-tab="practical">${I18n.t('topicDetail.tabPractical')}</button>
          <button class="tab" data-tab="reviews">${I18n.t('topicDetail.tabReviews')}</button>
        </div>

        <div id="tab-panels">${UI.skeleton('card')}</div>
      `;
    };

    let modal;
    if (t) {
      // PERF: Render modal shell instantly in 0ms using memory topic
      modal = UI.openModal(modalHtml(t), 'modal-lg');
      _bindStepper(modal, t, id);
    } else {
      modal = UI.openModal(UI.skeleton('card'), 'modal-lg');
    }

    let data;
    try {
      data = await API.topic(id);
    } catch (err) {
      if (!t) modal.innerHTML = UI.errorState(err);
      return;
    }

    t = data.topic;
    const knowledge = data.knowledge || {};
    const reviews = data.reviews || [];

    if (!modal.querySelector('#tab-panels')) {
      modal.innerHTML = modalHtml(t);
      _bindStepper(modal, t, id);
    }

    const panels = modal.querySelector('#tab-panels');
    function paintTab(tab) {
      modal.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      if (tab === 'knowledge') panels.innerHTML = Knowledge.renderKnowledgeTab(t, knowledge);
      if (tab === 'business') panels.innerHTML = Knowledge.renderBusinessErpTab(knowledge);
      if (tab === 'practical') panels.innerHTML = Knowledge.renderPracticalTab(t, knowledge);
      if (tab === 'reviews') panels.innerHTML = Reviews.renderTopicReviewsTab(t, reviews);
      Knowledge.bindTab(panels, t.id);
      Reviews.bindTab(panels, t.id, () => openDetail(id, t));
    }

    modal.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => paintTab(b.dataset.tab)));
    paintTab('knowledge');

    modal.querySelector('#delete-topic-btn').addEventListener('click', () => {
      if (!confirm(I18n.t('topicDetail.confirmDeleteTopic'))) return;
      UI.closeModal();

      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (row) row.style.display = 'none';

      let undoClicked = false;
      const isAr = I18n.getLang() === 'ar';

      const timer = setTimeout(() => {
        if (!undoClicked) {
          API.deleteTopic(id).then(() => Router.reload()).catch(err => {
            if (row) row.style.display = '';
            UI.toastError(err);
          });
        }
      }, 3000);

      UI.toast(
        `${I18n.t('toast.topicDeleted')} — <button id="undo-del-topic-${id}" style="background:none; border:none; color:var(--brass); text-decoration:underline; cursor:pointer; font-weight:700;">${isAr ? 'تراجع (Undo)' : 'Undo'}</button>`,
        'info'
      );

      setTimeout(() => {
        const undoBtn = document.getElementById(`undo-del-topic-${id}`);
        if (undoBtn) {
          undoBtn.addEventListener('click', () => {
            undoClicked = true;
            clearTimeout(timer);
            if (row) row.style.display = '';
            UI.toast(isAr ? 'تم إلغاء الحذف' : 'Deletion undone', 'success');
          });
        }
      }, 50);
    });
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

        const progressByStatus = { 'Not Started': 0, 'Learning': 25, 'Understood': 50, 'Practiced': 75, 'Mastered': 100 };

        // ── OPTIMISTIC STATUS UPDATE (0ms) ───────────────────────────────
        t.status = newStatus;
        t.progress = progressByStatus[newStatus] !== undefined ? progressByStatus[newStatus] : t.progress;

        stepperContainer.innerHTML = _renderStepperHtml(newStatus);
        _bindStepper(modal, t, id);
        UI.toast(I18n.t('toast.statusUpdated'), 'success');

        // ── INSTANT 0ms DOM TABLE ROW UPDATE BEHIND MODAL ────────────────
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          const cells = row.querySelectorAll('td');
          cells.forEach(td => {
            if (td.querySelector('.badge')) {
              td.innerHTML = statusBadge(newStatus);
            } else if (td.classList.contains('mono') && td.textContent.includes('%')) {
              td.textContent = `${t.progress}%`;
            }
          });
        }

        modal.dataset.statusModified = 'true';

        // ── BACKGROUND API CALL ──────────────────────────────────────────
        API.updateStatus(id, newStatus).then(() => {
          API.cacheBust('topics', 'topic', 'dashboard', 'analytics');
        }).catch(err => UI.toastError(err));
      });
    });

    modal.querySelectorAll('[data-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        if (modal.dataset.statusModified === 'true') {
          Router.reload();
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderTable, openAddModal, openDetail, statusBadge, priorityBadge, escapeHtml, STATUS_VALUES, PRIORITY_VALUES };
})();
