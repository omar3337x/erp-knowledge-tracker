/**
 * js/notes.js
 * Module Notes section renderer + Add, Edit, View, Delete modals + Live Search.
 *
 * Each note is associated with user_id and module_id.
 * Notes are loaded ONLY when opening a module (performance requirement).
 * Notes are grouped and rendered by Section Name.
 */

const Notes = (function () {

  let _currentNotes = [];
  let _currentModuleId = '';

  /**
   * Renders the Notes section inside a module view.
   *
   * @param {Element} container - wrapper element
   * @param {string}  moduleId  - current module ID
   */
  async function renderSection(container, moduleId) {
    _currentModuleId = moduleId;

    container.innerHTML = `
      <div class="notes-section-wrap">
        <div class="notes-topbar">
          <div class="notes-title-area">
            <h2>${I18n.t('notes.notesSection')}</h2>
            <span class="notes-count-badge" id="notes-count-badge">0</span>
          </div>
          <div class="notes-search-wrap">
            <input type="text" id="notes-search-input" class="notes-search-input"
                   placeholder="${I18n.t('notes.searchPlaceholder')}" autocomplete="off">
          </div>
          <button class="btn btn-primary btn-sm" id="add-note-btn">
            ${I18n.t('notes.addNote')}
          </button>
        </div>
        <div id="notes-list-wrap">
          <div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>
        </div>
      </div>
    `;

    const listWrap = container.querySelector('#notes-list-wrap');
    const searchInput = container.querySelector('#notes-search-input');
    const addBtn = container.querySelector('#add-note-btn');
    const badgeEl = container.querySelector('#notes-count-badge');

    addBtn.addEventListener('click', () => {
      openAddModal(moduleId, () => reloadNotes(listWrap, badgeEl, searchInput.value));
    });

    searchInput.addEventListener('input', () => {
      renderNotesList(listWrap, searchInput.value);
    });

    await reloadNotes(listWrap, badgeEl, '');
  }

  /**
   * Fetches fresh notes for the current module from API and updates UI.
   */
  async function reloadNotes(listWrap, badgeEl, searchQuery) {
    try {
      _currentNotes = await API.notes(_currentModuleId);
      if (badgeEl) badgeEl.textContent = _currentNotes.length;
      renderNotesList(listWrap, searchQuery);
    } catch (err) {
      if (listWrap) listWrap.innerHTML = UI.errorState(err);
    }
  }

  /**
   * Filters and renders the notes grouped by Section Name.
   */
  function renderNotesList(listWrap, query) {
    if (!listWrap) return;

    query = (query || '').trim().toLowerCase();
    let filtered = _currentNotes;

    if (query) {
      filtered = _currentNotes.filter(n =>
        (n.title || '').toLowerCase().includes(query) ||
        (n.section_name || '').toLowerCase().includes(query) ||
        (n.content || '').toLowerCase().includes(query)
      );
    }

    if (!_currentNotes.length) {
      listWrap.innerHTML = UI.emptyState(
        I18n.t('notes.noNotes'),
        I18n.t('notes.addFirstNote')
      );
      return;
    }

    if (!filtered.length) {
      listWrap.innerHTML = UI.emptyState(
        I18n.t('notes.noSearchResults'),
        I18n.t('empty.tryDifferentSearch')
      );
      return;
    }

    // Group notes by section_name
    const groups = {};
    filtered.forEach(note => {
      const section = (note.section_name || '').trim() || I18n.t('notes.uncategorized');
      if (!groups[section]) groups[section] = [];
      groups[section].push(note);
    });

    let html = '';
    Object.keys(groups).forEach(sectionName => {
      html += `
        <div class="notes-group">
          <div class="notes-group-header">
            <span>[ ${escapeHtml(sectionName)} ]</span>
          </div>
          <div class="notes-grid">
            ${groups[sectionName].map(noteCardHtml).join('')}
          </div>
        </div>
      `;
    });

    listWrap.innerHTML = html;

    // Attach event listeners for card actions
    listWrap.querySelectorAll('.note-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const noteId = btn.dataset.id;
        const note = _currentNotes.find(n => n.id === noteId);
        if (!note) return;

        if (action === 'view') openViewModal(note);
        else if (action === 'edit') openEditModal(note, () => {
          const listWrapEl = document.querySelector('#notes-list-wrap');
          const badgeEl = document.querySelector('#notes-count-badge');
          const searchInput = document.querySelector('#notes-search-input');
          reloadNotes(listWrapEl, badgeEl, searchInput ? searchInput.value : '');
        });
        else if (action === 'delete') openDeleteConfirmModal(note, () => {
          const listWrapEl = document.querySelector('#notes-list-wrap');
          const badgeEl = document.querySelector('#notes-count-badge');
          const searchInput = document.querySelector('#notes-search-input');
          reloadNotes(listWrapEl, badgeEl, searchInput ? searchInput.value : '');
        });
      });
    });

    // Also clicking anywhere on card opens View modal
    listWrap.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.note-action-btn')) return;
        const noteId = card.dataset.id;
        const note = _currentNotes.find(n => n.id === noteId);
        if (note) openViewModal(note);
      });
    });
  }

  function noteCardHtml(n) {
    const sectionBadge = (n.section_name || '').trim() ? escapeHtml(n.section_name) : I18n.t('notes.uncategorized');
    return `
      <div class="note-card" data-id="${n.id}">
        <div class="note-card-header">
          <h3 class="note-card-title">${escapeHtml(n.title)}</h3>
          <span class="note-section-badge">${sectionBadge}</span>
        </div>
        <div class="note-card-content">${escapeHtml(n.content)}</div>
        <div class="note-card-footer">
          <div class="note-card-dates">
            <span>${I18n.t('notes.createdAt')}: ${UI.fmtDate(n.created_at)}</span>
            ${n.updated_at && n.updated_at !== n.created_at ? `<span>${I18n.t('notes.updatedAt')}: ${UI.fmtDate(n.updated_at)}</span>` : ''}
          </div>
          <div class="note-card-actions">
            <button class="note-action-btn" data-action="view" data-id="${n.id}">${I18n.t('notes.view')}</button>
            <button class="note-action-btn" data-action="edit" data-id="${n.id}">${I18n.t('notes.edit')}</button>
            <button class="note-action-btn danger" data-action="delete" data-id="${n.id}">${I18n.t('notes.delete')}</button>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------
  // MODALS: Add, Edit, View, Delete Confirmation
  // --------------------------------------------------------------------

  function openAddModal(moduleId, onSaved) {
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.addNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="add-note-form">
        <div class="field">
          <label class="required">${I18n.t('notes.noteTitle')}</label>
          <input type="text" name="title" required placeholder="${I18n.t('notes.noteTitlePlaceholder')}">
        </div>
        <div class="field">
          <label>${I18n.t('notes.sectionName')}</label>
          <input type="text" name="section_name" placeholder="${I18n.t('notes.sectionNamePlaceholder')}">
        </div>
        <div class="field">
          <label class="required">${I18n.t('notes.content')}</label>
          <textarea name="content" rows="6" required placeholder="${I18n.t('notes.contentPlaceholder')}"></textarea>
        </div>
        <div class="modal-footer" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.cancel')}</button>
          <button type="submit" class="btn btn-primary">${I18n.t('common.save')}</button>
        </div>
      </form>
    `;

    UI.openModal(html);

    const form = document.getElementById('add-note-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = I18n.t('common.saving');

      try {
        await API.createNote({
          module_id: moduleId,
          title: title,
          section_name: sectionName,
          content: content
        });
        UI.closeModal();
        UI.toast(I18n.t('toast.noteSaved'), 'success');
        if (typeof onSaved === 'function') onSaved();
      } catch (err) {
        UI.toast(I18n.errorMessage(err), 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = I18n.t('common.save');
      }
    });
  }

  function openEditModal(note, onSaved) {
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.editNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="edit-note-form">
        <div class="field">
          <label class="required">${I18n.t('notes.noteTitle')}</label>
          <input type="text" name="title" required value="${escapeHtml(note.title || '')}" placeholder="${I18n.t('notes.noteTitlePlaceholder')}">
        </div>
        <div class="field">
          <label>${I18n.t('notes.sectionName')}</label>
          <input type="text" name="section_name" value="${escapeHtml(note.section_name || '')}" placeholder="${I18n.t('notes.sectionNamePlaceholder')}">
        </div>
        <div class="field">
          <label class="required">${I18n.t('notes.content')}</label>
          <textarea name="content" rows="6" required placeholder="${I18n.t('notes.contentPlaceholder')}">${escapeHtml(note.content || '')}</textarea>
        </div>
        <div class="modal-footer" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.cancel')}</button>
          <button type="submit" class="btn btn-primary">${I18n.t('common.save')}</button>
        </div>
      </form>
    `;

    UI.openModal(html);

    const form = document.getElementById('edit-note-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = I18n.t('common.saving');

      try {
        await API.updateNote({
          id: note.id,
          title: title,
          section_name: sectionName,
          content: content
        });
        UI.closeModal();
        UI.toast(I18n.t('toast.noteUpdated'), 'success');
        if (typeof onSaved === 'function') onSaved();
      } catch (err) {
        UI.toast(I18n.errorMessage(err), 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = I18n.t('common.save');
      }
    });
  }

  function openViewModal(note) {
    const sectionBadge = (note.section_name || '').trim() ? escapeHtml(note.section_name) : I18n.t('notes.uncategorized');
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.viewNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <div class="note-detail-wrap">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="note-section-badge">${sectionBadge}</span>
          <span class="mono" style="font-size:12px; color:var(--ink-soft);">${UI.fmtDate(note.created_at)}</span>
        </div>
        <h3 style="font-size:18px; font-weight:700; margin:0 0 12px; color:var(--ink);">${escapeHtml(note.title)}</h3>
        <div class="note-detail-content">${escapeHtml(note.content)}</div>
        <div class="modal-footer" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.close')}</button>
        </div>
      </div>
    `;

    UI.openModal(html);
  }

  function openDeleteConfirmModal(note, onDeleted) {
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.deleteNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <p style="margin-bottom:20px; font-size:14px; color:var(--ink);">${I18n.t('notes.confirmDelete')}</p>
      <div style="padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm); margin-bottom:20px;">
        <strong>${escapeHtml(note.title)}</strong>
        ${(note.section_name || '').trim() ? `<small style="display:block; color:var(--ink-soft);">[ ${escapeHtml(note.section_name)} ]</small>` : ''}
      </div>
      <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.cancel')}</button>
        <button type="button" id="confirm-delete-note-btn" class="btn btn-danger">${I18n.t('common.delete')}</button>
      </div>
    `;

    UI.openModal(html);

    const deleteBtn = document.getElementById('confirm-delete-note-btn');
    deleteBtn.addEventListener('click', async () => {
      deleteBtn.disabled = true;
      try {
        await API.deleteNote(note.id);
        UI.closeModal();
        UI.toast(I18n.t('toast.noteDeleted'), 'success');
        if (typeof onDeleted === 'function') onDeleted();
      } catch (err) {
        UI.toast(I18n.errorMessage(err), 'error');
      } finally {
        deleteBtn.disabled = false;
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    renderSection,
    openAddModal,
    openEditModal,
    openViewModal,
    openDeleteConfirmModal
  };

})();
