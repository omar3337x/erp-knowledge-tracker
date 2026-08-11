/**
 * js/reviews.js — Review Center (Due Today / Overdue / Due This Week / Recently Learned)
 * and the per-topic Reviews tab with "Mark as Reviewed".
 */

const Reviews = (function () {

  // ---------------------------------------------------------------- topic tab
  function renderTopicReviewsTab(topic, reviews) {
    return `
      <form id="review-form" style="margin-bottom:18px;">
        <div class="section-title">${I18N.t('reviews.mark_as_reviewed')}</div>
        <div class="field">
          <label>${I18N.t('reviews.understanding')}</label>
          <select name="understanding">
            <option value="Weak">${I18N.t('reviews.weak')}</option>
            <option value="Good" selected>${I18N.t('reviews.good')}</option>
            <option value="Strong">${I18N.t('reviews.strong')}</option>
          </select>
        </div>
        <div class="field">
          <label>${I18N.t('reviews.notes_label')}</label>
          <textarea name="notes" placeholder="${I18N.t('reviews.notes_ph')}"></textarea>
        </div>
        <div class="field">
          <label>${I18N.t('reviews.next_review_days')}</label>
          <input type="number" name="next_review_days" value="14" min="1" max="180">
        </div>
        <button type="submit" class="btn btn-primary">${I18N.t('reviews.mark_btn')}</button>
      </form>

      <div class="section-title">${I18N.t('reviews.history_title')}</div>
      ${reviews.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>${I18N.t('reviews.date')}</th><th>${I18N.t('reviews.understanding')}</th><th>${I18N.t('reviews.notes_label')}</th></tr></thead>
            <tbody>
              ${reviews.slice().reverse().map(r => `
                <tr><td class="mono">${UI.fmtDate(r.review_date)}</td><td>${r.understanding}</td><td>${Topics.escapeHtml(r.notes)}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>` : `<p class="field-hint">${I18N.t('reviews.no_reviews')}</p>`}
    `;
  }

  function bindTab(panelEl, topicId, onDone) {
    const form = panelEl.querySelector('#review-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        await API.markReviewed(topicId, payload);
        UI.toast(I18N.t('toast.review_completed'), 'success');
        if (onDone) onDone();
      } catch (err) {
        UI.toast(err.message, 'error');
      } finally {
        btn.disabled = false;
      }
    });
  }

  // ---------------------------------------------------------------- Review Center page
  async function renderCenter(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18N.t('general.loading_review')}</div>`;
    let topics;
    try {
      topics = await API.topics({});
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 86400000);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 86400000);

    const overdue = topics.filter(t => t.next_review && new Date(t.next_review) < startOfDay);
    const dueToday = topics.filter(t => t.next_review && new Date(t.next_review) >= startOfDay && new Date(t.next_review) < endOfDay);
    const dueThisWeek = topics.filter(t => t.next_review && new Date(t.next_review) >= endOfDay && new Date(t.next_review) <= weekFromNow);
    const recentlyLearned = topics
      .filter(t => t.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .slice(0, 8);

    container.innerHTML = `
      ${section(I18N.t('reviews.overdue'), overdue, 'rust')}
      ${section(I18N.t('reviews.due_today'), dueToday, 'brass')}
      ${section(I18N.t('reviews.due_this_week'), dueThisWeek, '')}
      ${section(I18N.t('reviews.recently_learned'), recentlyLearned, 'teal', true)}
    `;

    container.querySelectorAll('[data-topic-id]').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        Topics.openDetail(row.dataset.topicId);
      });
    });
    container.querySelectorAll('.mark-reviewed-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await API.markReviewed(btn.dataset.topicId, { understanding: 'Good', next_review_days: 14 });
          UI.toast(I18N.t('toast.review_completed'), 'success');
          renderCenter(container);
        } catch (err) { UI.toast(err.message, 'error'); }
      });
    });
  }

  function section(title, topics, tone, hideMarkBtn) {
    return `
      <div style="margin-bottom:26px;">
        <h2 style="margin-bottom:10px;">${title} <span class="badge" style="background:var(--line-soft); color:var(--ink-soft);">${topics.length}</span></h2>
        ${topics.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>${I18N.t('topics.table.topic')}</th><th>${I18N.t('topics.table.status')}</th><th>${I18N.t('topics.table.next_review')}</th>${hideMarkBtn ? `<th>${I18N.t('analytics.mastered_on')}</th>` : `<th></th>`}</tr></thead>
              <tbody>
                ${topics.map(t => `
                  <tr data-topic-id="${t.id}">
                    <td><strong>${Topics.escapeHtml(t.topic)}</strong></td>
                    <td>${Topics.statusBadge(t.status)}</td>
                    <td class="mono">${UI.fmtDate(t.next_review)}</td>
                    ${hideMarkBtn
                      ? `<td class="mono">${UI.fmtDate(t.completed_at)}</td>`
                      : `<td><button class="btn btn-sm mark-reviewed-btn" data-topic-id="${t.id}">${I18N.t('reviews.mark_btn')}</button></td>`}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">${title === I18N.t('reviews.recently_learned') ? I18N.t('reviews.no_mastered') : I18N.t('reviews.no_due')}</p>`}
      </div>
    `;
  }

  return { renderTopicReviewsTab, bindTab, renderCenter };
})();
