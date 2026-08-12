/**
 * js/notes.js
 * Module Notes section renderer + Dedicated "All Notes" page + Add/Edit/View/Delete modals.
 *
 * OPTIMISTIC UI & 0ms SPEED:
 *   All user actions update the local UI and in-memory cache INSTANTLY (0ms),
 *   then sync with Google Apps Script API asynchronously in the background.
 */

const Notes = (function () {

  let _allNotesCache = [];
  let _currentModuleId = '';

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
   * Renders the Notes section inside a module detail view.
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
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="sync-notes-btn" title="Sync from Sheets">
              🔄 ${I18n.getLang() === 'ar' ? 'مزامنة' : 'Sync'}
            </button>
            <button class="btn btn-primary btn-sm" id="add-note-btn">
              ${I18n.t('notes.addNote')}
            </button>
          </div>
        </div>
        <div id="notes-list-wrap">
          <div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>
        </div>
      </div>
    `;

    const listWrap = container.querySelector('#notes-list-wrap');
    const searchInput = container.querySelector('#notes-search-input');
    const addBtn = container.querySelector('#add-note-btn');
    const syncBtn = container.querySelector('#sync-notes-btn');
    const badgeEl = container.querySelector('#notes-count-badge');

    addBtn.addEventListener('click', () => {
      openAddModal(moduleId, listWrap, badgeEl, searchInput, false);
    });

    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      API.cacheBust('notes');
      UI.toast(I18n.getLang() === 'ar' ? 'جاري المزامنة مع الجدول...' : 'Syncing from Sheets...', 'info');
      await reloadNotes(listWrap, badgeEl, searchInput.value);
      syncBtn.disabled = false;
      UI.toast(I18n.getLang() === 'ar' ? 'تمت المزامنة بنجاح' : 'Synced successfully', 'success');
    });

    searchInput.addEventListener('input', () => {
      renderModuleNotesList(listWrap, searchInput.value, badgeEl);
    });

    await reloadNotes(listWrap, badgeEl, '');
  }

  /**
   * Renders the dedicated "All Notes" page (جمع كل الملاحظات).
   */
  async function renderAllNotesPage(container) {
    _currentModuleId = '';
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div class="card" style="margin-bottom:24px; padding:20px; border-radius:var(--radius-lg); background:var(--paper-raised); border:1px solid var(--line);">
        <div class="notes-topbar" style="margin-bottom:0; flex-wrap:wrap; gap:16px;">
          <div class="notes-title-area">
            <h2 style="font-size:20px; margin:0;">${isAr ? 'جميع ملاحظات الموديولات' : 'All Module Notes'}</h2>
            <span class="notes-count-badge" id="all-notes-count-badge">0</span>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap; flex:1; justify-content:flex-end; align-items:center;">
            <select id="all-notes-module-filter" style="padding:8px 14px; border:1px solid var(--line); border-radius:var(--radius-md); background:var(--paper); color:var(--ink); font-size:13px; outline:none; height:38px;">
              <option value="">${isAr ? 'كل الموديولات' : 'All Modules'}</option>
              ${(State.modulesCache || []).map(m => `<option value="${m.id}">${I18n.localizedName(m)}</option>`).join('')}
            </select>
            <div class="notes-search-wrap" style="max-width:280px;">
              <input type="text" id="all-notes-search-input" class="notes-search-input"
                     placeholder="${I18n.t('notes.searchPlaceholder')}" autocomplete="off" style="height:38px;">
            </div>
            <button class="btn btn-secondary btn-sm" id="all-notes-sync-btn" title="Sync from Sheets" style="height:38px; padding:0 14px;">
              🔄 ${isAr ? 'مزامنة' : 'Sync'}
            </button>
            <button class="btn btn-primary btn-sm" id="all-notes-add-btn" style="height:38px; padding:0 16px;">
              ${I18n.t('notes.addNote')}
            </button>
          </div>
        </div>
      </div>
      <div id="all-notes-list-wrap">
        <div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>
      </div>
    `;

    const listWrap = container.querySelector('#all-notes-list-wrap');
    const searchInput = container.querySelector('#all-notes-search-input');
    const moduleFilter = container.querySelector('#all-notes-module-filter');
    const addBtn = container.querySelector('#all-notes-add-btn');
    const syncBtn = container.querySelector('#all-notes-sync-btn');
    const badgeEl = container.querySelector('#all-notes-count-badge');

    addBtn.addEventListener('click', () => {
      const defaultMod = moduleFilter.value || (State.modulesCache.length ? State.modulesCache[0].id : '');
      openAddModal(defaultMod, listWrap, badgeEl, searchInput, true);
    });

    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      API.cacheBust('notes');
      UI.toast(isAr ? 'جاري المزامنة...' : 'Syncing...', 'info');
      await reloadAllNotesPage(listWrap, badgeEl, searchInput.value, moduleFilter.value);
      syncBtn.disabled = false;
      UI.toast(isAr ? 'تمت المزامنة بنجاح' : 'Synced successfully', 'success');
    });

    const triggerRender = () => renderAllNotesGrouped(listWrap, searchInput.value, moduleFilter.value, badgeEl);

    searchInput.addEventListener('input', triggerRender);
    moduleFilter.addEventListener('change', triggerRender);

    await reloadAllNotesPage(listWrap, badgeEl, '', '');
  }

  async function reloadNotes(listWrap, badgeEl, searchQuery) {
    try {
      const raw = await API.notes(_currentModuleId);
      _allNotesCache = (Array.isArray(raw) ? raw : []).map(normalizeNote).filter(Boolean);
      renderModuleNotesList(listWrap, searchQuery, badgeEl);
    } catch (err) {
      if (listWrap) listWrap.innerHTML = UI.errorState(err);
    }
  }

  async function reloadAllNotesPage(listWrap, badgeEl, searchQuery, selectedModuleId) {
    try {
      const raw = await API.notes();
      _allNotesCache = (Array.isArray(raw) ? raw : []).map(normalizeNote).filter(Boolean);
      renderAllNotesGrouped(listWrap, searchQuery, selectedModuleId, badgeEl);
    } catch (err) {
      if (listWrap) listWrap.innerHTML = UI.errorState(err);
    }
  }

  /**
   * Render notes inside a specific module view.
   */
  function renderModuleNotesList(listWrap, query, badgeEl) {
    if (!listWrap) return;

    query = (query || '').trim().toLowerCase();
    const moduleNotes = _allNotesCache.filter(n => String(n.module_id) === String(_currentModuleId));

    if (badgeEl) badgeEl.textContent = moduleNotes.length;

    let filtered = moduleNotes;
    if (query) {
      filtered = moduleNotes.filter(n =>
        String(n.title || '').toLowerCase().includes(query) ||
        String(n.section_name || '').toLowerCase().includes(query) ||
        String(n.content || '').toLowerCase().includes(query)
      );
    }

    if (!moduleNotes.length) {
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

    // Group by section_name
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
            ${groups[sectionName].map(n => noteCardHtml(n, false)).join('')}
          </div>
        </div>
      `;
    });

    listWrap.innerHTML = html;
    bindCardActions(listWrap, badgeEl, query, false);
  }

  /**
   * Render notes grouped by Module & Section Name for the "All Notes" page.
   */
  function renderAllNotesGrouped(listWrap, query, selectedModuleId, badgeEl) {
    if (!listWrap) return;

    query = (query || '').trim().toLowerCase();
    let filtered = _allNotesCache;

    if (selectedModuleId) {
      filtered = filtered.filter(n => String(n.module_id) === String(selectedModuleId));
    }

    if (query) {
      filtered = filtered.filter(n => {
        const mod = (State.modulesCache || []).find(m => String(m.id) === String(n.module_id));
        const modNameAr = mod ? String(mod.name_ar || '').toLowerCase() : '';
        const modNameEn = mod ? String(mod.name_en || '').toLowerCase() : '';
        return (
          String(n.title || '').toLowerCase().includes(query) ||
          String(n.section_name || '').toLowerCase().includes(query) ||
          String(n.content || '').toLowerCase().includes(query) ||
          modNameAr.includes(query) ||
          modNameEn.includes(query)
        );
      });
    }

    if (badgeEl) badgeEl.textContent = filtered.length;

    if (!_allNotesCache.length) {
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

    // Group by Module ID -> then Section Name
    const moduleMap = {};
    filtered.forEach(note => {
      const modId = note.module_id || 'UNKNOWN';
      if (!moduleMap[modId]) moduleMap[modId] = {};
      const section = String(note.section_name || '').trim() || I18n.t('notes.uncategorized');
      if (!moduleMap[modId][section]) moduleMap[modId][section] = [];
      moduleMap[modId][section].push(note);
    });

    let html = '';
    Object.keys(moduleMap).forEach(modId => {
      const modObj = (State.modulesCache || []).find(m => String(m.id) === String(modId));
      const modTitle = modObj ? `📦 ${I18n.localizedName(modObj)}` : `📦 ${modId}`;
      const sections = moduleMap[modId];

      html += `
        <div class="card" style="margin-bottom:24px; padding:20px; border-radius:var(--radius-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--line); padding-bottom:12px; margin-bottom:16px;">
            <h3 style="font-size:17px; font-weight:700; color:var(--ink); margin:0;">${escapeHtml(modTitle)}</h3>
            <span class="badge" style="background:var(--paper-raised); color:var(--ink-soft);">${Object.values(sections).flat().length} ${I18n.t('notes.notesSection')}</span>
          </div>
      `;

      Object.keys(sections).forEach(sectionName => {
        html += `
          <div class="notes-group" style="margin-bottom:16px;">
            <div class="notes-group-header">
              <span>[ ${escapeHtml(sectionName)} ]</span>
            </div>
            <div class="notes-grid">
              ${sections[sectionName].map(n => noteCardHtml(n, true)).join('')}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    listWrap.innerHTML = html;
    bindCardActions(listWrap, badgeEl, query, true);
  }

  function noteCardHtml(n, showModuleBadge) {
    const sName = String(n.section_name || '').trim();
    const sectionBadge = sName ? escapeHtml(sName) : I18n.t('notes.uncategorized');

    let modBadgeHtml = '';
    if (showModuleBadge) {
      const modObj = (State.modulesCache || []).find(m => String(m.id) === String(n.module_id));
      const modName = modObj ? I18n.localizedName(modObj) : n.module_id;
      modBadgeHtml = `<span class="badge" style="background:var(--gold-soft); color:var(--ink); font-size:11px; font-weight:600;">📦 ${escapeHtml(modName)}</span>`;
    }

    return `
      <div class="note-card" data-id="${n.id}">
        <div class="note-card-header" style="flex-wrap:wrap; gap:6px;">
          <h3 class="note-card-title">${escapeHtml(n.title)}</h3>
          <div style="display:flex; gap:6px; align-items:center;">
            ${modBadgeHtml}
            <span class="note-section-badge">${sectionBadge}</span>
          </div>
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

  function bindCardActions(listWrap, badgeEl, query, isAllNotesPage) {
    const searchInput = document.querySelector(isAllNotesPage ? '#all-notes-search-input' : '#notes-search-input');
    const moduleFilter = isAllNotesPage ? document.querySelector('#all-notes-module-filter') : null;

    listWrap.querySelectorAll('.note-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const noteId = btn.dataset.id;
        const note = _allNotesCache.find(n => String(n.id) === String(noteId));
        if (!note) return;

        if (action === 'view') openViewModal(note);
        else if (action === 'edit') openEditModal(note, listWrap, badgeEl, searchInput, isAllNotesPage);
        else if (action === 'delete') openDeleteConfirmModal(note, listWrap, badgeEl, searchInput, isAllNotesPage);
      });
    });

    listWrap.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.note-action-btn')) return;
        const noteId = card.dataset.id;
        const note = _allNotesCache.find(n => String(n.id) === String(noteId));
        if (note) openViewModal(note);
      });
    });
  }

  // --------------------------------------------------------------------
  // MODALS WITH OPTIMISTIC (0ms) UI UPDATES
  // --------------------------------------------------------------------

  function openAddModal(defaultModuleId, listWrap, badgeEl, searchInput, isAllNotesPage) {
    const isAr = I18n.getLang() === 'ar';
    const modulesOptions = (State.modulesCache || []).map(m => `
      <option value="${m.id}" ${String(m.id) === String(defaultModuleId) ? 'selected' : ''}>${I18n.localizedName(m)}</option>
    `).join('');

    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.addNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="add-note-form">
        <div class="field">
          <label class="required">${I18n.t('addTopic.module')}</label>
          <select name="module_id" required style="width:100%; padding:8px 12px; border:1px solid var(--line); border-radius:var(--radius-sm); background:var(--paper); color:var(--ink);">
            ${modulesOptions}
          </select>
        </div>
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
      const targetModuleId = form.elements['module_id'].value;
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content || !targetModuleId) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      const tempId = 'NOTE-temp-' + Date.now();
      const now = new Date().toISOString();
      const tempNote = {
        id: tempId,
        module_id: targetModuleId,
        title: title,
        section_name: sectionName,
        content: content,
        created_at: now,
        updated_at: now
      };

      _allNotesCache.unshift(tempNote);

      if (isAllNotesPage) {
        const modFilter = document.querySelector('#all-notes-module-filter');
        renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
      } else {
        renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
      }

      UI.closeModal();
      UI.toast(I18n.t('toast.noteSaved'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.createNote({
        module_id: targetModuleId,
        title: title,
        section_name: sectionName,
        content: content
      }).then(realNote => {
        const idx = _allNotesCache.findIndex(n => String(n.id) === String(tempId));
        if (idx !== -1 && realNote && realNote.id) {
          _allNotesCache[idx] = normalizeNote(realNote);
          if (isAllNotesPage) {
            const modFilter = document.querySelector('#all-notes-module-filter');
            renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
          } else {
            renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
          }
        }
      }).catch(err => {
        _allNotesCache = _allNotesCache.filter(n => String(n.id) !== String(tempId));
        if (isAllNotesPage) {
          const modFilter = document.querySelector('#all-notes-module-filter');
          renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
        } else {
          renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
        }
        UI.toast(I18n.errorMessage(err), 'error');
      });
    });
  }

  function openEditModal(note, listWrap, badgeEl, searchInput, isAllNotesPage) {
    const modulesOptions = (State.modulesCache || []).map(m => `
      <option value="${m.id}" ${String(m.id) === String(note.module_id) ? 'selected' : ''}>${I18n.localizedName(m)}</option>
    `).join('');

    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.editNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="edit-note-form">
        <div class="field">
          <label class="required">${I18n.t('addTopic.module')}</label>
          <select name="module_id" required style="width:100%; padding:8px 12px; border:1px solid var(--line); border-radius:var(--radius-sm); background:var(--paper); color:var(--ink);">
            ${modulesOptions}
          </select>
        </div>
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
      const targetModuleId = form.elements['module_id'].value;
      const title = form.elements['title'].value.trim();
      const sectionName = form.elements['section_name'].value.trim();
      const content = form.elements['content'].value.trim();

      if (!title || !content || !targetModuleId) {
        UI.toast(I18n.t('errors.NOTE_FIELDS_REQUIRED'), 'error');
        return;
      }

      const prevModule = note.module_id;
      const prevTitle = note.title;
      const prevSection = note.section_name;
      const prevContent = note.content;
      const prevUpdated = note.updated_at;

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      note.module_id = targetModuleId;
      note.title = title;
      note.section_name = sectionName;
      note.content = content;
      note.updated_at = new Date().toISOString();

      if (isAllNotesPage) {
        const modFilter = document.querySelector('#all-notes-module-filter');
        renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
      } else {
        renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
      }

      UI.closeModal();
      UI.toast(I18n.t('toast.noteUpdated'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.updateNote({
        id: note.id,
        module_id: targetModuleId,
        title: title,
        section_name: sectionName,
        content: content
      }).catch(err => {
        note.module_id = prevModule;
        note.title = prevTitle;
        note.section_name = prevSection;
        note.content = prevContent;
        note.updated_at = prevUpdated;
        if (isAllNotesPage) {
          const modFilter = document.querySelector('#all-notes-module-filter');
          renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
        } else {
          renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
        }
        UI.toast(I18n.errorMessage(err), 'error');
      });
    });
  }

  function openViewModal(note) {
    const sName = String(note.section_name || '').trim();
    const sectionBadge = sName ? escapeHtml(sName) : I18n.t('notes.uncategorized');
    const modObj = (State.modulesCache || []).find(m => String(m.id) === String(note.module_id));
    const modName = modObj ? I18n.localizedName(modObj) : note.module_id;

    const html = `
      <div class="modal-head">
        <h3>${I18n.t('notes.viewNote')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <div class="note-detail-wrap">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; gap:8px; align-items:center;">
            <span class="badge" style="background:var(--gold-soft); color:var(--ink); font-size:12px; font-weight:600;">📦 ${escapeHtml(modName)}</span>
            <span class="note-section-badge">${sectionBadge}</span>
          </div>
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

  function openDeleteConfirmModal(note, listWrap, badgeEl, searchInput, isAllNotesPage) {
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
      const deletedIdx = _allNotesCache.findIndex(n => String(n.id) === String(note.id));
      if (deletedIdx !== -1) {
        _allNotesCache.splice(deletedIdx, 1);
      }

      if (isAllNotesPage) {
        const modFilter = document.querySelector('#all-notes-module-filter');
        renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
      } else {
        renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
      }

      UI.closeModal();
      UI.toast(I18n.t('toast.noteDeleted'), 'success');

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.deleteNote(note.id).catch(err => {
        if (deletedIdx !== -1) {
          _allNotesCache.splice(deletedIdx, 0, note);
        }
        if (isAllNotesPage) {
          const modFilter = document.querySelector('#all-notes-module-filter');
          renderAllNotesGrouped(listWrap, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', badgeEl);
        } else {
          renderModuleNotesList(listWrap, searchInput ? searchInput.value : '', badgeEl);
        }
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
    renderAllNotesPage,
    openAddModal,
    openEditModal,
    openViewModal,
    openDeleteConfirmModal
  };

})();
