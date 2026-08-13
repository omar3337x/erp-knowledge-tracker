/**
 * js/categories.js
 * Fully dynamic Category management for a Module: list, add, edit, delete
 * (guarded against categories that still have topics), activate/deactivate.
 *
 * Performance: after any mutation, only the categories section and the
 * filter-dropdown are re-rendered in place — no full Router.reload() needed.
 *
 * UX: the section is collapsible so it doesn't dominate the screen.
 */

const Categories = (function () {

  function isAdmin() {
    return !!(State.currentUser && State.currentUser.role === 'Admin');
  }

  async function refreshCategoriesFromServer() {
    // Bust the cache so the next call to API.categories() hits the network
    API.cacheBust('categories');
    const fresh = await API.categories();
    State.allCategories = fresh;
    try {
      const raw = localStorage.getItem(REF_CACHE_KEY);
      const cached = raw ? JSON.parse(raw) : { modules: State.modulesCache };
      localStorage.setItem(REF_CACHE_KEY, JSON.stringify({
        savedAt: Date.now(),
        modules: cached.modules || State.modulesCache,
        categories: fresh
      }));
    } catch (e) { /* non-fatal */ }
  }

  /**
   * Renders the categories accordion section.
   *
   * @param {Element}  container  - the div that wraps this section
   * @param {string}   moduleId
   * @param {Array}    topics     - current topics array (for topic counts)
   * @param {Function} [onCategoryChange]
   *          Called after any mutation so the parent view can refresh
   *          the filter dropdown and re-filter the topics table without
   *          doing a full Router.reload().
   */
  function renderSection(container, moduleId, topics, onCategoryChange) {
    if (typeof topics === 'function') {
      onCategoryChange = topics;
      topics = null;
    }
    topics = Array.isArray(topics) ? topics : [];
    const categories = State.categoriesForModule(moduleId, { includeInactive: true });
    const countFor = (catId) => topics.filter(t => t.category_id === catId).length;

    // Persist open/close state across re-renders
    const PREF_KEY = `cat_section_open_${moduleId}`;
    const isOpen = sessionStorage.getItem(PREF_KEY) === 'true'; // default CLOSED

    container.innerHTML = `
      <div class="cat-section-header" id="cat-section-toggle" role="button" tabindex="0"
           aria-expanded="${isOpen}" style="display:flex; align-items:center; justify-content:space-between;
           cursor:pointer; padding:10px 0; margin-bottom:0; user-select:none;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="cat-chevron" style="display:inline-block; transition:transform .2s; transform:rotate(${isOpen ? 0 : -90}deg);">&#9660;</span>
          <h2 style="margin:0; font-size:16px;">${I18n.t('module.categoriesSection')}</h2>
          <span class="badge badge-status-not-started" style="font-size:11px;">${categories.length}</span>
        </div>
        ${isAdmin() ? `<button class="btn btn-sm btn-primary" id="add-category-btn" style="flex-shrink:0;"
          onclick="event.stopPropagation();">${I18n.t('module.addCategory')}</button>` : ''}
      </div>

      <div id="cat-section-body" style="display:${isOpen ? 'block' : 'none'}; margin-top:8px;">
        <p class="field-hint" style="margin-bottom:12px;">${I18n.t('module.manageCategoriesHint')}</p>

        ${categories.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr>
                <th>${I18n.t('table.category')}</th>
                <th>${I18n.t('common.description')}</th>
                <th>${I18n.t('table.topicsCount')}</th>
                <th>${I18n.t('common.status')}</th>
                ${isAdmin() ? `<th>${I18n.t('common.actions')}</th>` : ''}
              </tr></thead>
              <tbody>
                ${categories.map(c => `
                  <tr>
                    <td><strong>${Topics.escapeHtml(I18n.localizedName(c))}</strong></td>
                    <td>${Topics.escapeHtml(c.description || '—')}</td>
                    <td class="mono">${countFor(c.id)}</td>
                    <td><span class="badge ${(c.active === true || c.active === 'TRUE') ? 'badge-status-mastered' : 'badge-status-not-started'}">
                      ${(c.active === true || c.active === 'TRUE') ? I18n.t('categories.active') : I18n.t('categories.inactive')}
                    </span></td>
                    ${isAdmin() ? `
                    <td style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button class="btn btn-sm" data-edit="${c.id}">${I18n.t('common.edit')}</button>
                      <button class="btn btn-sm" data-toggle="${c.id}">${(c.active === true || c.active === 'TRUE') ? I18n.t('common.deactivate') : I18n.t('common.activate')}</button>
                      <button class="btn btn-sm btn-danger" data-delete="${c.id}">${I18n.t('common.delete')}</button>
                    </td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">${I18n.t('categories.noCategories')}</p>`}
      </div>
    `;

    // Toggle collapse
    const header = container.querySelector('#cat-section-toggle');
    const body   = container.querySelector('#cat-section-body');
    const chevron = container.querySelector('.cat-chevron');
    const toggle = () => {
      const open = body.style.display === 'none';
      body.style.display  = open ? 'block' : 'none';
      chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(-90deg)';
      header.setAttribute('aria-expanded', String(open));
      sessionStorage.setItem(PREF_KEY, String(open));
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    if (!isAdmin()) return;

    // Add category
    container.querySelector('#add-category-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openFormModal(moduleId, null, () => {
        _rebuildSection(container, moduleId, topics, onCategoryChange);
        if (onCategoryChange) onCategoryChange();
      });
    });

    // Edit
    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = categories.find(c => c.id === btn.dataset.edit);
        openFormModal(moduleId, cat, () => {
          _rebuildSection(container, moduleId, topics, onCategoryChange);
          if (onCategoryChange) onCategoryChange();
        });
      });
    });

    // Toggle active/inactive
    container.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await API.toggleCategoryStatus(btn.dataset.toggle);
          UI.toast(I18n.t('categories.statusUpdated'), 'success');
          await refreshCategoriesFromServer();
          _rebuildSection(container, moduleId, topics, onCategoryChange);
          if (onCategoryChange) onCategoryChange();
        } catch (err) {
          UI.toastError(err);
          btn.disabled = false;
        }
      });
    });

    // Delete
    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(I18n.t('categories.confirmDelete'))) return;
        btn.disabled = true;
        try {
          await API.deleteCategory(btn.dataset.delete);
          UI.toast(I18n.t('categories.deleted'), 'success');
          await refreshCategoriesFromServer();
          _rebuildSection(container, moduleId, topics, onCategoryChange);
          if (onCategoryChange) onCategoryChange();
        } catch (err) {
          if (err.code === 'CATEGORY_HAS_TOPICS') {
            UI.toast(`${I18n.errorMessage(err)} ${I18n.t('categories.deactivateInstead')}`, 'error');
          } else {
            UI.toastError(err);
          }
          btn.disabled = false;
        }
      });
    });
  }

  // Re-render only the category section in place (no full reload)
  function _rebuildSection(container, moduleId, topics, onCategoryChange) {
    renderSection(container, moduleId, topics, onCategoryChange);
  }

  function openFormModal(moduleId, existing, onSaved) {
    const isEdit = !!existing;
    const body = `
      <div class="modal-head">
        <h3>${isEdit ? I18n.t('categories.editCategory') : I18n.t('categories.addCategory')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="category-form">
        <div class="field">
          <label>${I18n.t('categories.nameEn')}</label>
          <input name="name_en" required value="${Topics.escapeHtml(existing ? existing.name_en : '')}">
        </div>
        <div class="field">
          <label>${I18n.t('categories.nameAr')}</label>
          <input name="name_ar" required dir="rtl" value="${Topics.escapeHtml(existing ? existing.name_ar : '')}">
        </div>
        <div class="field">
          <label>${I18n.t('categories.description')}</label>
          <textarea name="description">${Topics.escapeHtml(existing ? existing.description : '')}</textarea>
        </div>
        <div class="field checkbox-row">
          <input type="checkbox" id="cat-active" ${(!existing || existing.active === true || existing.active === 'TRUE') ? 'checked' : ''}>
          <label for="cat-active" style="margin:0;">${I18n.t('categories.active')}</label>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">${I18n.t('common.save')}</button>
      </form>
    `;
    const modal = UI.openModal(body);
    modal.querySelector('#category-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      payload.active = modal.querySelector('#cat-active').checked;
      if (!isEdit) payload.module_id = moduleId;
      else         payload.id = existing.id;

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ──────────────────────────────────
      UI.closeModal();
      UI.toast(I18n.t(isEdit ? 'categories.updated' : 'categories.created'), 'success');
      if (onSaved) onSaved();

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      const actionPromise = isEdit ? API.updateCategory(payload) : API.createCategory(payload);
      actionPromise.then(() => refreshCategoriesFromServer()).catch(err => UI.toastError(err));
    });
  }

  return { renderSection, refreshCategoriesFromServer };
})();
