/**
 * js/categories.js
 * Fully dynamic Category management for a Module: list, add, edit, delete
 * (guarded against categories that still have topics), activate/deactivate.
 * Categories are global reference data shared by every user, so mutation
 * is restricted to Admins — everyone can see the list.
 *
 * After any mutation, the shared reference-data cache (modules+categories)
 * is refreshed from the server and the module view re-renders in place —
 * no full page reload.
 */

const Categories = (function () {

  function isAdmin() {
    return !!(State.currentUser && State.currentUser.role === 'Admin');
  }

  async function refreshCategoriesFromServer() {
    const fresh = await API.categories();
    State.allCategories = fresh;
    try {
      const raw = localStorage.getItem(REF_CACHE_KEY);
      const cached = raw ? JSON.parse(raw) : { modules: State.modulesCache };
      localStorage.setItem(REF_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), modules: cached.modules || State.modulesCache, categories: fresh }));
    } catch (e) { /* non-fatal */ }
  }

  function renderSection(container, moduleId, topics) {
    const categories = State.categoriesForModule(moduleId, { includeInactive: true });
    const countFor = (catId) => topics.filter(t => t.category_id === catId).length;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
        <h2>${I18n.t('module.categoriesSection')}</h2>
        ${isAdmin() ? `<button class="btn btn-sm btn-primary" id="add-category-btn">${I18n.t('module.addCategory')}</button>` : ''}
      </div>
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
    `;

    if (!isAdmin()) return; // read-only for non-admins, nothing more to bind

    container.querySelector('#add-category-btn').addEventListener('click', () => openFormModal(moduleId));
    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openFormModal(moduleId, categories.find(c => c.id === btn.dataset.edit)));
    });
    container.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await API.toggleCategoryStatus(btn.dataset.toggle);
          UI.toast(I18n.t('categories.statusUpdated'), 'success');
          await refreshCategoriesFromServer();
          Router.reload();
        } catch (err) { UI.toastError(err); }
      });
    });
    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(I18n.t('categories.confirmDelete'))) return;
        try {
          await API.deleteCategory(btn.dataset.delete);
          UI.toast(I18n.t('categories.deleted'), 'success');
          await refreshCategoriesFromServer();
          Router.reload();
        } catch (err) {
          if (err.code === 'CATEGORY_HAS_TOPICS') {
            UI.toast(`${I18n.errorMessage(err)} ${I18n.t('categories.deactivateInstead')}`, 'error');
          } else {
            UI.toastError(err);
          }
        }
      });
    });
  }

  function openFormModal(moduleId, existing) {
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
    modal.querySelector('#category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      payload.active = modal.querySelector('#cat-active').checked;
      if (!isEdit) payload.module_id = moduleId;
      else payload.id = existing.id;

      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        if (isEdit) {
          await API.updateCategory(payload);
          UI.toast(I18n.t('categories.updated'), 'success');
        } else {
          await API.createCategory(payload);
          UI.toast(I18n.t('categories.created'), 'success');
        }
        await refreshCategoriesFromServer();
        UI.closeModal();
        Router.reload();
      } catch (err) {
        UI.toastError(err);
      } finally {
        btn.disabled = false;
      }
    });
  }

  return { renderSection, refreshCategoriesFromServer };
})();
