/**
 * js/notes.js
 * Module Notes section renderer + Add, Edit, View, Delete modals + Live Search.
 *
 * OPTIMISTIC UI UPDATES:
 *   All user actions (Add, Edit, Delete) update the local UI and local state
 *   INSTANTLY (0ms perception), then sync with the Google Apps Script API
 *   asynchronously in the background.
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
      openAddModal(moduleId, listWrap, badgeEl, searchInput);
    });

    searchInput.addEventListener('input', () => {
      renderNotesList(listWrap, searchInput.value);
    });

    await reloadNotes(listWrap, badgeEl, '');
  }

  function normalizeNote(n) {
    if (!n || typeof n !== 'object') return null;
    return {
      id: String(n.id || ''),
      user_id: String(n.user_id || ''),
      module_id: String(n.module_id || ''),
      title: String(n.title || '').trim(),
      section_name: String(n.section_name || '').trim(),
      content: String(n.content || ''),
      created_at: n.created_at || new Date().toISOString(),
      updated_at: n.updated_at || n.created_at || new Date().toISOString()
    };
  }

  /**
   * Fetches fresh notes for the current module from API and updates UI.
   */
  async function reloadNotes(listWrap, badgeEl, searchQuery) {
    try {
      const raw = await API.notes(_currentModuleId);
      _currentNotes = (Array.isArray(raw) ? raw : []).map(normalizeNote).filter(Boolean);
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
        String(n.title || '').toLowerCase().includes(query) ||
        String(n.section_name || '').toLowerCase().includes(query) ||
        String(n.content || '').toLowerCase().includes(query)
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
      const section = String(note.section_name || '').trim() || I18n.t('notes.uncategorized');
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
        const note = _currentNotes.find(n => String(n.id) === String(noteId));
        if (!note) return;

        const badgeEl = document.querySelector('#notes-count-badge');
        const searchInput = document.querySelector('#notes-search-input');

        if (action === 'view') openViewModal(note);
        else if (action === 'edit') openEditModal(note, listWrap, badgeEl, searchInput);
        else if (action === 'delete') openDeleteConfirmModal(note, listWrap, badgeEl, searchInput);
      });
    });

    // Clicking anywhere on card opens View modal
    listWrap.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.note-action-btn')) return;
        const noteId = card.dataset.id;
        const note = _currentNotes.find(n => String(n.id) === String(noteId));
        if (note) openViewModal(note);
      });
    });
  }

  function noteCardHtml(n) {
    const sName = String(n.section_name || '').trim();
    const sectionBadge = sName ? escapeHtml(sName) : I18n.t('notes.uncategorized');
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
  // MODALS WITH OPTIMISTIC (0ms) UI UPDATES
  // --------------------------------------------------------------------

  function openAddModal(moduleId, listWrap, badgeEl, searchInput) {
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      const tempId = 'NOTE-temp-' + Date.now();
      const now = new Date().toISOString();
      const tempNote = {
        id: tempId,
        module_id: moduleId,
        title: title,
        section_name: sectionName,
        content: content,
        created_at: now,
        updated_at: now
      };

      _currentNotes.unshift(tempNote);
      if (badgeEl) badgeEl.textContent = _currentNotes.length;
      renderNotesList(listWrap, searchInput ? searchInput.value : '');

      UI.closeModal();
      UI.toast(I18n.t('toast.noteSaved'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.createNote({
        module_id: moduleId,
        title: title,
        section_name: sectionName,
        content: content
      }).then(realNote => {
        // Swap temp note with real server note
        const idx = _currentNotes.findIndex(n => String(n.id) === String(tempId));
        if (idx !== -1 && realNote && realNote.id) {
          _currentNotes[idx] = realNote;
          renderNotesList(listWrap, searchInput ? searchInput.value : '');
        }
      }).catch(err => {
        // Revert local optimistic addition on error
        _currentNotes = _currentNotes.filter(n => String(n.id) !== String(tempId));
        if (badgeEl) badgeEl.textContent = _currentNotes.length;
        renderNotesList(listWrap, searchInput ? searchInput.value : '');
        UI.toast(I18n.errorMessage(err), 'error');
      });
    });
  }

  function openEditModal(note, listWrap, badgeEl, searchInput) {
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.editNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="edit-note-form">
        <div class="field">
          <label class="required">${I18n.t('notes.noteTitle')}</label>
          <input type="text" name="title" required value="${escapeHtml(note.title)}" placeholder="${I18n.t('notes.noteTitlePlaceholder')}">
        </div>
        <div class="field">
          <label>${I18n.t('notes.sectionName')}</label>
          <input type="text" name="section_name" value="${escapeHtml(note.section_name)}" placeholder="${I18n.t('notes.sectionNamePlaceholder')}">
        </div>
        <div class="field">
          <label class="required">${I18n.t('notes.content')}</label>
          <textarea name="content" rows="6" required placeholder="${I18n.t('notes.contentPlaceholder')}">${escapeHtml(note.content)}</textarea>
        </div>
        <div class="modal-footer" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.cancel')}</button>
          <button type="submit" class="btn btn-primary">${I18n.t('common.save')}</button>
        </div>
      </form>
    `;

    UI.openModal(html);

    const form = document.getElementById('edit-note-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      // Preserve previous values in case of rollback
      const prevTitle = note.title;
      const prevSection = note.section_name;
      const prevContent = note.content;
      const prevUpdated = note.updated_at;

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      note.title = title;
      note.section_name = sectionName;
      note.content = content;
      note.updated_at = new Date().toISOString();

      renderNotesList(listWrap, searchInput ? searchInput.value : '');

      UI.closeModal();
      UI.toast(I18n.t('toast.noteUpdated'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.updateNote({
        id: note.id,
        title: title,
        section_name: sectionName,
        content: content
      }).catch(err => {
        // Rollback on error
        note.title = prevTitle;
        note.section_name = prevSection;
        note.content = prevContent;
        note.updated_at = prevUpdated;
        renderNotesList(listWrap, searchInput ? searchInput.value : '');
        UI.toast(I18n.errorMessage(err), 'error');
      });
    });
  }

  function openViewModal(note) {
    const sName = String(note.section_name || '').trim();
    const sectionBadge = sName ? escapeHtml(sName) : I18n.t('notes.uncategorized');
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

  function openDeleteConfirmModal(note, listWrap, badgeEl, searchInput) {
    const sName = String(note.section_name || '').trim();
    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.deleteNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <p style="margin-bottom:20px; font-size:14px; color:var(--ink);">${I18n.t('notes.confirmDelete')}</p>
      <div style="padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm); margin-bottom:20px;">
        <strong>${escapeHtml(note.title)}</strong>
        ${sName ? `<small style="display:block; color:var(--ink-soft);">[ ${escapeHtml(sName)} ]</small>` : ''}
      </div>
      <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" class="btn btn-secondary" data-close>${I18n.t('common.cancel')}</button>
        <button type="button" id="confirm-delete-note-btn" class="btn btn-danger">${I18n.t('common.delete')}</button>
      </div>
    `;

    UI.openModal(html);

    const deleteBtn = document.getElementById('confirm-delete-note-btn');
    deleteBtn.addEventListener('click', () => {
      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      const deletedIdx = _currentNotes.findIndex(n => String(n.id) === String(note.id));
      if (deletedIdx !== -1) {
        _currentNotes.splice(deletedIdx, 1);
      }
      if (badgeEl) badgeEl.textContent = _currentNotes.length;
      renderNotesList(listWrap, searchInput ? searchInput.value : '');

      UI.closeModal();
      UI.toast(I18n.t('toast.noteDeleted'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.deleteNote(note.id).catch(err => {
        // Rollback on error
        if (deletedIdx !== -1) {
          _currentNotes.splice(deletedIdx, 0, note);
        }
        if (badgeEl) badgeEl.textContent = _currentNotes.length;
        renderNotesList(listWrap, searchInput ? searchInput.value : '');
        UI.toast(I18n.errorMessage(err), 'error');
      });
    });
  }

  function escapeHtml(str) {
    if (str == null) return '';
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
