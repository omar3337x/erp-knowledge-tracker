/**
 * js/favorites.js — Bookmarked AI Insights Page
 *
 * Provides a dedicated page listing all saved AI Insights across all modules
 * with instant 0ms memory search, module filtering, type filtering, and
 * optimistic removal without page reloads.
 */

const Favorites = (function () {

  async function render(container) {
    const modules = State.modulesCache || [];
    const isAr = I18n.getLang() === 'ar';

    // 0ms Instant Load from State.favoritesCache
    const renderPage = () => {
      const list = State.favoritesCache || [];
      const typesSet = new Set();
      list.forEach(f => { if (f.type) typesSet.add(f.type); });

      container.innerHTML = `
        <div style="margin-bottom:20px;">
          <h2 style="font-size:22px; font-weight:700; margin:0 0 6px; color:var(--ink);">${I18n.t('favorites.title')}</h2>
          <p style="font-size:13.5px; color:var(--ink-soft); margin:0;">${I18n.t('favorites.subtitle')}</p>
        </div>

        <div class="toolbar" style="margin-bottom:20px;">
          <div class="search-box" style="flex:1; max-width:360px;">
            <span class="icon">&#128269;</span>
            <input id="fav-search" type="text" placeholder="${I18n.t('favorites.searchPlaceholder')}">
          </div>
          <div class="field">
            <select id="fav-mod-filter">
              <option value="">${isAr ? 'جميع الموديولات' : 'All Modules'}</option>
              ${modules.map(m => `<option value="${m.id}">${I18n.localizedName(m)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <select id="fav-type-filter">
              <option value="">${I18n.t('favorites.allTypes')}</option>
              ${Array.from(typesSet).map(t => `<option value="${t}">${Topics.escapeHtml(t)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="favorites-list-container"></div>
      `;

      const listContainer = container.querySelector('#favorites-list-container');
      const searchInput = container.querySelector('#fav-search');
      const modSelect = container.querySelector('#fav-mod-filter');
      const typeSelect = container.querySelector('#fav-type-filter');

      const drawList = () => {
        const q = (searchInput ? searchInput.value || '' : '').toLowerCase().trim();
        const modF = modSelect ? modSelect.value : '';
        const typeF = typeSelect ? typeSelect.value : '';

        let filtered = State.favoritesCache || [];
        if (modF) filtered = filtered.filter(f => String(f.module_id) === String(modF));
        if (typeF) filtered = filtered.filter(f => String(f.type) === String(typeF));
        if (q) {
          filtered = filtered.filter(f =>
            String(f.title || '').toLowerCase().includes(q) ||
            String(f.content || '').toLowerCase().includes(q) ||
            String(f.type || '').toLowerCase().includes(q) ||
            String(f.module_id || '').toLowerCase().includes(q)
          );
        }

        if (!filtered.length) {
          listContainer.innerHTML = `
            <div class="card" style="padding:32px; text-align:center;">
              <div style="font-size:32px; margin-bottom:8px;">⭐</div>
              <h3 style="font-size:16px; font-weight:700; margin:0 0 6px;">${I18n.t('favorites.noFavorites')}</h3>
              <p style="font-size:13px; color:var(--ink-soft); margin:0;">${I18n.t('favorites.noFavoritesHint')}</p>
            </div>
          `;
          return;
        }

        listContainer.innerHTML = filtered.map(fav => {
          const modObj = modules.find(m => String(m.id) === String(fav.module_id));
          const modName = modObj ? I18n.localizedName(modObj) : (fav.module_id || 'ERP');
          const badgeClass = getBadgeClass(fav.type);

          return `
            <div class="ai-insight-card" data-id="${fav.id}">
              <div class="ai-insight-head">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="badge" style="background:var(--paper-raised); border:1px solid var(--line); font-weight:600; font-size:11px;">📦 ${Topics.escapeHtml(modName)}</span>
                  <span class="ai-type-badge ${badgeClass}">${Topics.escapeHtml(fav.type || 'INSIGHT')}</span>
                </div>
                <button class="btn-fav-toggle is-fav" data-action="remove-fav" data-id="${fav.id}" data-insight-id="${fav.insight_id}">
                  ★ ${I18n.t('ai.favoriteRemove')}
                </button>
              </div>
              <h4 style="font-size:16px; font-weight:700; margin:0 0 8px; color:var(--ink);">${Topics.escapeHtml(fav.title)}</h4>
              <div style="font-size:14px; color:var(--ink); line-height:1.5; margin-bottom:12px; white-space:pre-wrap;">${Topics.escapeHtml(fav.content)}</div>
              ${fav.example ? `
                <div style="background:var(--paper-raised); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:10px; font-size:13px;">
                  <strong>${I18n.t('ai.example')}:</strong> ${Topics.escapeHtml(fav.example)}
                </div>
              ` : ''}
              ${fav.why_it_matters ? `
                <div style="font-size:13px; color:var(--ink-soft); margin-bottom:12px;">
                  <strong>${I18n.t('ai.whyItMatters')}:</strong> ${Topics.escapeHtml(fav.why_it_matters)}
                </div>
              ` : ''}
              <div style="font-size:11.5px; color:var(--ink-soft); display:flex; justify-content:flex-end;" class="mono">
                ${UI.fmtDate(fav.created_at)}
              </div>
            </div>
          `;
        }).join('');

        // Bind remove handlers
        listContainer.querySelectorAll('[data-action="remove-fav"]').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const favId = btn.dataset.id;
            const insightId = btn.dataset.insightId;

            // 0ms Optimistic UI removal
            State.removeFavorite(insightId, favId);
            drawList();
            UI.toast(I18n.t('favorites.removedToast'), 'info');

            try {
              await API.removeFavorite({ id: favId, insight_id: insightId });
            } catch (err) {
              UI.toastError(err);
            }
          });
        });
      };

      drawList();
      if (searchInput) searchInput.addEventListener('input', drawList);
      if (modSelect) modSelect.addEventListener('change', drawList);
      if (typeSelect) typeSelect.addEventListener('change', drawList);
    };

    renderPage();

    // Background Async Fetch & Sync
    API.getFavorites().then(favs => {
      if (favs && Array.isArray(favs)) {
        State.setFavorites(favs);
        renderPage();
      }
    }).catch(() => {});
  }

  function getBadgeClass(type) {
    const t = String(type || '').toLowerCase();
    if (t.includes('tip')) return 'ai-type-tip';
    if (t.includes('trick')) return 'ai-type-trick';
    if (t.includes('business') || t.includes('process')) return 'ai-type-business';
    if (t.includes('mistake') || t.includes('error')) return 'ai-type-mistake';
    if (t.includes('warn')) return 'ai-type-warning';
    if (t.includes('practice') || t.includes('best')) return 'ai-type-practice';
    if (t.includes('account') || t.includes('tax')) return 'ai-type-accounting';
    return 'ai-type-default';
  }

  return { render };
})();
