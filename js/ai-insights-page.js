/**
 * js/ai-insights-page.js — Standalone AI Daily Insights Page
 *
 * Dedicated Learning section view rendering AI ERP Insights across all modules
 * with 0ms instant first paint, live search, module filtering, type filtering,
 * and 0ms real-time favorite toggling.
 */

const AIInsightsPage = (function () {

  async function render(container) {
    const modules = (State.modulesCache && State.modulesCache.length > 0) ? State.modulesCache : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:22px; font-weight:700; margin:0 0 6px; color:var(--ink);">✨ ${I18n.t('ai.sectionTitle')}</h2>
          <p style="font-size:13.5px; color:var(--ink-soft); margin:0;">
            ${isAr ? 'تجميع شامل اليومي لأهم نصائح وحيل ورؤى أنظمة الـ ERP عبر كافة الموديولات.' : 'Comprehensive daily ERP tips, tricks, and business insights across all modules.'}
          </p>
        </div>
      </div>

      <div class="toolbar" style="margin-bottom:20px;">
        <div class="search-box" style="flex:1; max-width:320px;">
          <span class="icon">&#128269;</span>
          <input id="ai-page-search" type="text" placeholder="${I18n.t('favorites.searchPlaceholder')}">
        </div>
        <div class="field">
          <select id="ai-page-mod-filter">
            <option value="">${isAr ? 'جميع الموديولات' : 'All Modules'}</option>
            ${modules.map(m => `<option value="${m.id}">${I18n.localizedName(m)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="ai-page-type-filter">
            <option value="">${I18n.t('favorites.allTypes')}</option>
            <option value="Tip">${isAr ? 'نصيحة (Tip)' : 'Tip'}</option>
            <option value="Trick">${isAr ? 'حيلة عملية (Trick)' : 'Trick'}</option>
            <option value="Business Insight">${isAr ? 'رؤية أعمال (Business)' : 'Business Insight'}</option>
            <option value="Common Mistake">${isAr ? 'خطأ شائع (Mistake)' : 'Common Mistake'}</option>
            <option value="Best Practice">${isAr ? 'ممارسة فضلى (Best Practice)' : 'Best Practice'}</option>
            <option value="Accounting Impact">${isAr ? 'أثر محاسبي (Accounting)' : 'Accounting Impact'}</option>
          </select>
        </div>
      </div>

      <div id="ai-page-cards-container">
        <div style="padding:16px;">${UI.skeleton('card')}</div>
      </div>
    `;

    const cardsContainer = container.querySelector('#ai-page-cards-container');
    const searchInput = container.querySelector('#ai-page-search');
    const modSelect = container.querySelector('#ai-page-mod-filter');
    const typeSelect = container.querySelector('#ai-page-type-filter');

    let allInsightsList = [];

    // Combine cached insights across all modules
    const collectInsights = () => {
      let combined = [];
      modules.forEach(m => {
        const cached = API.cacheGet('insights:' + m.id) || (typeof Modules !== 'undefined' && Modules.getFallbackInsightsLocal ? Modules.getFallbackInsightsLocal(m.id) : []);
        if (Array.isArray(cached)) {
          cached.forEach(item => {
            combined.push(Object.assign({}, item, { module_id: item.module_id || m.id }));
          });
        }
      });
      return combined;
    };

    allInsightsList = collectInsights();

    const drawList = () => {
      const q = (searchInput.value || '').toLowerCase().trim();
      const modF = modSelect.value;
      const typeF = typeSelect.value;

      let filtered = allInsightsList;
      if (modF) filtered = filtered.filter(i => String(i.module_id) === String(modF));
      if (typeF) filtered = filtered.filter(i => String(i.type || '').toLowerCase().includes(typeF.toLowerCase()));
      if (q) {
        filtered = filtered.filter(i =>
          String(i.title || '').toLowerCase().includes(q) ||
          String(i.content || '').toLowerCase().includes(q) ||
          String(i.type || '').toLowerCase().includes(q) ||
          String(i.module_id || '').toLowerCase().includes(q)
        );
      }

      if (!filtered.length) {
        cardsContainer.innerHTML = `
          <div class="card" style="padding:32px; text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">✨</div>
            <h3 style="font-size:16px; font-weight:700; margin:0 0 6px;">${I18n.t('common.notFound')}</h3>
            <p style="font-size:13px; color:var(--ink-soft); margin:0;">${isAr ? 'جرب البحث بنص أو موديول آخر.' : 'Try a different search query or module filter.'}</p>
          </div>
        `;
        return;
      }

      cardsContainer.innerHTML = filtered.map(insight => {
        const modObj = modules.find(m => String(m.id) === String(insight.module_id));
        const modName = modObj ? I18n.localizedName(modObj) : insight.module_id;
        const isFav = State.isFavorite(insight.id);
        const badgeClass = getBadgeClass(insight.type);

        return `
          <div class="ai-insight-card" data-id="${insight.id}">
            <div class="ai-insight-head">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="badge" style="background:var(--paper-raised); border:1px solid var(--line); font-weight:600; font-size:11px;">📦 ${Topics.escapeHtml(modName)}</span>
                <span class="ai-type-badge ${badgeClass}">${Topics.escapeHtml(insight.type || 'INSIGHT')}</span>
              </div>
              <button class="btn-fav-toggle ${isFav ? 'is-fav' : ''}" data-action="toggle-fav" data-id="${insight.id}" data-mod="${insight.module_id}">
                ${isFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd')}
              </button>
            </div>
            <h4 style="font-size:16px; font-weight:700; margin:0 0 8px; color:var(--ink);">${Topics.escapeHtml(insight.title)}</h4>
            <div style="font-size:14px; color:var(--ink); line-height:1.5; margin-bottom:10px; white-space:pre-wrap;">${Topics.escapeHtml(insight.content)}</div>
            ${insight.example ? `
              <div style="background:var(--paper-raised); border-radius:var(--radius-sm); padding:8px 12px; margin-bottom:8px; font-size:12.5px;">
                <strong>${I18n.t('ai.example')}:</strong> ${Topics.escapeHtml(insight.example)}
              </div>
            ` : ''}
            ${insight.why_it_matters ? `
              <div style="font-size:12.5px; color:var(--ink-soft);">
                <strong>${I18n.t('ai.whyItMatters')}:</strong> ${Topics.escapeHtml(insight.why_it_matters)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      // Bind Favorite toggle listeners
      cardsContainer.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const insightId = btn.dataset.id;
          const targetInsight = allInsightsList.find(i => String(i.id) === String(insightId));
          if (!targetInsight) return;

          const wasFav = State.isFavorite(insightId);

          // 0ms Instant Real-time State Update
          if (wasFav) {
            State.removeFavorite(insightId, insightId);
          } else {
            State.addFavorite({
              insight_id: insightId,
              module_id: targetInsight.module_id,
              title: targetInsight.title,
              type: targetInsight.type,
              content: targetInsight.content,
              example: targetInsight.example || '',
              why_it_matters: targetInsight.why_it_matters || ''
            });
          }

          btn.classList.toggle('is-fav', !wasFav);
          btn.innerHTML = !wasFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd');
          UI.toast(!wasFav ? (isAr ? 'تمت الإضافة للمفضلة' : 'Saved to favorites') : I18n.t('favorites.removedToast'), 'info');

          try {
            if (wasFav) {
              await API.removeFavorite({ insight_id: insightId });
            } else {
              await API.addFavorite({
                insight_id: insightId,
                module_id: targetInsight.module_id,
                title: targetInsight.title,
                type: targetInsight.type,
                content: targetInsight.content,
                example: targetInsight.example || '',
                why_it_matters: targetInsight.why_it_matters || ''
              });
            }
          } catch (err) {
            UI.toastError(err);
          }
        });
      });
    };

    // 0ms Instant Render
    drawList();

    if (searchInput) searchInput.addEventListener('input', drawList);
    if (modSelect) modSelect.addEventListener('change', drawList);
    if (typeSelect) typeSelect.addEventListener('change', drawList);

    // Background Async Sync across modules
    Promise.all(modules.map(m => API.getModuleInsights(m.id).catch(() => null))).then(results => {
      allInsightsList = collectInsights();
      drawList();
    });
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
