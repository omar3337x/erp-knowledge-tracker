/**
 * js/categories.js — Category Management UI (Add/Edit/Delete/Toggle).
 */

const Categories = (function () {

  // --------------------------------------------------------------------------
  // RENDER CATEGORY TABLE (inside a module view)
  // --------------------------------------------------------------------------

  function renderTable(container, categoryId, modulesCache, categories, topics) {
    // Get categories for this module
    var modCategories = categories || State.categoriesCache[categoryId] || [];
    var modTopics = topics || [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3>${I18N.t('module.categories_title')}</h3>
        <button class="btn btn-primary btn-sm" id="add-category-btn">${I18N.t('module.categories_add')}</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${I18N.t('categories.table.category')}</th>
            <th>${I18N.t('categories.table.description')}</th>
            <th>${I18N.t('categories.table.topics_count')}</th>
            <th>${I18N.t('categories.table.status')}</th>
            <th>${I18N.t('categories.table.actions')}</th>
          </tr></thead>
          <tbody>
            ${modCategories.length ? modCategories.map(cat => `
              <tr data-cat-id="${cat.id}">
                <td><strong>${I18N.getCategoryName(cat)}</strong></td>
                <td>${escapeHtml(cat.description || '—')}</td>
                <td class="mono">${modTopics.filter(t => t.category_id === cat.id).length}</td>
                <td>${cat.active === false || cat.active === 'FALSE'
                  ? `<span class="badge badge-priority-low">${I18N.t('general.inactive')}</span>`
                  : `<span class="badge badge-status-mastered">${I18N.t('general.active')}</span>`}</td>
                <td>
                  <button class="btn btn-sm btn-ghost edit-cat-btn" data-cat-id="${cat.id}">${I18N.t('general.edit')}</button>
                  ${cat.active !== false && cat.active !== 'FALSE'
                    ? `<button class="btn btn-sm btn-ghost toggle-cat-btn" data-cat-id="${cat.id}" data-active="true">${I18N.t('module.categories_deactivate')}</button>`
                    : `<button class="btn btn-sm btn-ghost toggle-cat-btn" data-cat-id="${cat.id}" data-active="false">${I18N.t('module.categories_activate')}</button>`}
                  <button class="btn btn-sm btn-danger delete-cat-btn" data-cat-id="${cat.id}">${I18N.t('general.delete')}</button>
                </td>
              </tr>
            `).join('')
            : `<tr><td colspan="5" class="field-hint">${I18N.t('analytics.no_data')}</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    // Bind events
    container.querySelector('#add-category-btn').addEventListener('click', () => openAddModal(categoryId, null, () => renderTable(container, categoryId, modulesCache, categories)));
    container.querySelectorAll('.edit-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.dataset.catId;
        const cat = modCategories.find(c => c.id === catId);
        openEditModal(cat, () => renderTable(container, categoryId, modulesCache, categories));
      });
    });
    container.querySelectorAll('.delete-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.dataset.catId;
        const cat = modCategories.find(c => c.id === catId);
        confirmDelete(catId, cat, () => renderTable(container, categoryId, modulesCache, categories));
      });
    });
    container.querySelectorAll('.toggle-cat-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const catId = e.currentTarget.dataset.catId;
        try {
          await API.toggleCategoryStatus(catId);
          UI.toast(I18N.t('toast.category_updated'), 'success');
          renderTable(container, categoryId, modulesCache, categories);
        } catch (err) { UI.toast(err.message, 'error'); }
      });
    });
  }

  // --------------------------------------------------------------------------
  // ADD MODAL
  // --------------------------------------------------------------------------

  function openAddModal(moduleId, existingCat, onSave) {
    const body = `
      <div class="modal-head">
        <h3>${existingCat ? I18N.t('categories.edit_title') : I18N.t('categories.add_title')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <form id="category-form">
        <input type="hidden" name="id" value="${existingCat ? existingCat.id : ''}">
        <input type="hidden" name="module_id" value="${moduleId}">
        <div class="field">
          <label>${I18N.t('categories.name_en')}</label>
          <input name="name_en" required placeholder="${I18N.t('categories.name_en_ph')}">
        </div>
        <div class="field">
          <label>${I18N.t('categories.name_ar')}</label>
          <input name="name_ar" placeholder="${I18N.t('categories.name_ar_ph')}">
        </div>
        <div class="field">
          <label>${I18N.t('categories.description_label')}</label>
          <textarea name="description" placeholder="${I18N.t('categories.description_ph')}"></textarea>
        </div>
        <div class="field checkbox-row">
          <input type="checkbox" name="active" id="cat-active" ${!existingCat || existingCat.active !== false && existingCat.active !== 'FALSE' ? 'checked' : ''}>
          <label for="cat-active" style="margin:0;">${I18N.t('categories.active_label')}</label>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">${I18N.t('categories.save_category')}</button>
      </form>
    `;
    const modal = UI.openModal(body);

    if (existingCat) {
      modal.querySelector('[name="name_en"]').value = existingCat.name_en || '';
      modal.querySelector('[name="name_ar"]').value = existingCat.name_ar || '';
      modal.querySelector('[name="description"]').value = existingCat.description || '';
    }

    modal.querySelector('#category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      payload.active = modal.querySelector('#cat-active').checked;
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        if (existingCat) {
          await API.updateCategory(payload);
          UI.toast(I18N.t('toast.category_updated'), 'success');
        } else {
          await API.createCategory(payload);
          UI.toast(I18N.t('toast.category_added'), 'success');
        }
        UI.closeModal();
        if (onSave) onSave();
      } catch (err) { UI.toast(err.message, 'error'); }
      finally { btn.disabled = false; }
    });
  }

  function openEditModal(cat, onSave) {
    openAddModal(cat.module_id, cat, onSave);
  }

  // --------------------------------------------------------------------------
  // DELETE CONFIRMATION
  // --------------------------------------------------------------------------

  function confirmDelete(catId, cat, onDelete) {
    const hasTopics = /* check in backend */ false;
    const modal = UI.openModal(`
      <div class="modal-head">
        <h3>${I18N.t('general.delete')}</h3>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>
      <p style="margin:16px 0;">${I18N.t('categories.delete_confirm')} <strong>${I18N.getCategoryName(cat)}</strong>?</p>
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn btn-ghost" data-close>${I18N.t('general.cancel')}</button>
        <button class="btn btn-danger" id="confirm-delete-btn">${I18N.t('general.delete')}</button>
      </div>
    `);

    modal.querySelector('#confirm-delete-btn').addEventListener('click', async () => {
      try {
        await API.deleteCategory(catId);
        UI.toast(I18N.t('toast.category_deleted'), 'success');
        UI.closeModal();
        if (onDelete) onDelete();
      } catch (err) {
        UI.toast(err.message, 'error');
        // If category has topics, offer deactivation instead
        if (err.message.includes('contains topics')) {
          modal.innerHTML = `
            <div class="modal-head">
              <h3>${I18N.t('categories.has_topics')}</h3>
              <button class="btn btn-icon btn-ghost" data-close>&times;</button>
            </div>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:16px;">
              <button class="btn btn-ghost" data-close>${I18N.t('general.close')}</button>
              <button class="btn btn-primary" id="deactivate-btn">${I18N.t('categories.deactivate')}</button>
            </div>
          `;
          modal.querySelector('#deactivate-btn').addEventListener('click', async () => {
            try {
              await API.toggleCategoryStatus(catId);
              UI.toast(I18N.t('toast.category_updated'), 'success');
              UI.closeModal();
              if (onDelete) onDelete();
            } catch (e) { UI.toast(e.message, 'error'); }
          });
        }
      }
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderTable, openAddModal, openEditModal };
})();
