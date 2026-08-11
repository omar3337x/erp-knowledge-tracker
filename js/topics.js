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
      container.innerHTML = UI.emptyState('No knowledge gaps yet.', opts.emptyHint || 'Start by adding the first topic you want to learn.');
      return;
    }
    const catName = (id) => {
      const c = (opts.categories || []).find(c => c.id === id);
      return c ? c.name_en : '—';
    };
    const modName = (id) => {
      const m = State.modulesCache.find(m => m.id === id);
      return m ? m.name_en : '—';
    };
    const showModuleCol = !!opts.showModule;

    container.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Topic</th>
            ${showModuleCol ? '<th>Module</th>' : ''}
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Progress</th>
            <th>Last Review</th>
            <th>Next Review</th>
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
        <h3>Add Knowledge Gap</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="add-topic-form">
        <div class="field">
          <label>Topic Name</label>
          <input name="topic" required placeholder="e.g. Stock Valuation">
        </div>
        <div class="field-row">
          <div class="field">
            <label>Module</label>
            <select name="module_id" id="at-module" required>
              ${modules.map(m => `<option value="${m.id}" ${m.id===defaultModuleId?'selected':''}>${m.name_en}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Category</label>
            <select name="category_id" id="at-category"></select>
          </div>
        </div>
        <div class="field">
          <label>Description</label>
          <textarea name="description" placeholder="Short context for this topic"></textarea>
        </div>
        <div class="field">
          <label>Priority</label>
          <select name="priority">
            ${PRIORITY_VALUES.map(p => `<option ${p==='Medium'?'selected':''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Current Understanding</label>
          <textarea name="current_understanding" placeholder="What you already understand, if anything"></textarea>
        </div>
        <div class="field">
          <label>What I Don't Know</label>
          <textarea name="what_i_dont_know" placeholder="e.g. الفرق بين FIFO و Average Cost"></textarea>
        </div>
        <div class="field">
          <label>What I Need To Learn</label>
          <textarea name="what_i_need_to_learn" placeholder="e.g. إزاي تقييم المخزون بيأثر على القيود المحاسبية"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Save</button>
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
          <div class="field-hint">${mod ? mod.name_en : ''} ${cat ? '· ' + cat.name_en : ''}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-danger btn-sm" id="delete-topic-btn">Delete</button>
          <button class="btn btn-icon btn-ghost" data-close>&times;</button>
        </div>
      </div>

      <div class="status-stepper" style="margin-bottom:18px;">
        ${STATUS_VALUES.map((s, i) => {
          const currentIdx = STATUS_VALUES.indexOf(t.status);
          const cls = i < currentIdx ? 'done' : (i === currentIdx ? 'current' : '');
          return `<button class="status-step ${cls}" data-status="${s}">${s}</button>`;
        }).join('')}
      </div>

      <div class="tabs">
        <button class="tab active" data-tab="knowledge">Knowledge</button>
        <button class="tab" data-tab="business">Business &amp; ERP</button>
        <button class="tab" data-tab="practical">Practical</button>
        <button class="tab" data-tab="reviews">Reviews</button>
      </div>

      <div id="tab-panels"></div>
    `;

    modal.querySelector('#delete-topic-btn').addEventListener('click', async () => {
      if (!confirm('Delete this topic? This cannot be undone.')) return;
      try {
        await API.deleteTopic(id);
        UI.toast('Topic deleted', 'success');
        UI.closeModal();
        Router.reload();
      } catch (err) { UI.toast(err.message, 'error'); }
    });

    modal.querySelectorAll('.status-step').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await API.updateStatus(id, btn.dataset.status);
          UI.toast('Status updated', 'success');
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
