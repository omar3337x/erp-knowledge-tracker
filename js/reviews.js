/**
 * js/reviews.js
 * Review Center (Due Today / Overdue / Due This Week / Recently Learned)
 * and the per-topic Reviews tab with "Mark as Reviewed".
 * ONE API call (API.topics({})) drives the whole Review Center page.
 */

const Reviews = (function () {

  // ---------------------------------------------------------------- topic tab
  function renderTopicReviewsTab(topic, reviews) {
    return `
      <form id="review-form" style="margin-bottom:18px;">
        <div class="section-title">${I18n.t('reviews.markAsReviewed')}</div>
        <div class="field">
          <label>${I18n.t('reviews.understandingLevel')}</label>
          <select name="understanding">
            <option value="Weak">${I18n.t('reviews.weak')}</option>
            <option value="Good" selected>${I18n.t('reviews.good')}</option>
            <option value="Strong">${I18n.t('reviews.strong')}</option>
          </select>
        </div>
        <div class="field">
          <label>${I18n.t('reviews.notes')}</label>
          <textarea name="notes" placeholder="${I18n.t('reviews.notesPlaceholder')}"></textarea>
        </div>
        <div class="field">
          <label>${I18n.t('reviews.nextReviewDays')}</label>
          <input type="number" name="next_review_days" value="14" min="1" max="180">
        </div>
        <button type="submit" class="btn btn-primary">${I18n.t('reviews.submit')}</button>
      </form>

      <div class="section-title">${I18n.t('reviews.reviewHistory')}</div>
      ${reviews.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>${I18n.t('reviews.date')}</th><th>${I18n.t('reviews.understanding')}</th><th>${I18n.t('reviews.notesCol')}</th></tr></thead>
            <tbody>
              ${reviews.slice().reverse().map(r => `
                <tr><td class="mono">${UI.fmtDate(r.review_date)}</td><td>${understandingLabel(r.understanding)}</td><td>${Topics.escapeHtml(r.notes)}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>` : `<p class="field-hint">${I18n.t('reviews.noReviewsYet')}</p>`}
    `;
  }

  function understandingLabel(v) {
    if (v === 'Weak') return I18n.t('reviews.weak');
    if (v === 'Strong') return I18n.t('reviews.strong');
    if (v === 'Good') return I18n.t('reviews.good');
    return v || '—';
  }

  function bindTab(panelEl, topicId, onDone) {
    const form = panelEl.querySelector('#review-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      // ── OPTIMISTIC LOCAL UPDATE (0ms) ───────────────────────────────
      UI.toast(I18n.t('toast.reviewCompleted'), 'success');
      if (onDone) onDone();

      // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
      API.markReviewed(topicId, payload).catch(err => UI.toastError(err));
    });
  }

  // ---------------------------------------------------------------- Review Center page
  async function renderCenter(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let topics;
    try {
      topics = await API.topics({});
    } catch (err) {
      container.innerHTML = UI.errorState(err);
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
      ${section(I18n.t('reviews.overdue'), overdue, false)}
      ${section(I18n.t('reviews.dueToday'), dueToday, false)}
      ${section(I18n.t('reviews.dueThisWeek'), dueThisWeek, false)}
      ${section(I18n.t('reviews.recentlyLearned'), recentlyLearned, true)}
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
          UI.toast(I18n.t('toast.reviewCompleted'), 'success');
          renderCenter(container);
        } catch (err) { UI.toastError(err); }
      });
    });
  }

  function section(title, topics, hideMarkBtn) {
    return `
      <div style="margin-bottom:26px;">
        <h2 style="margin-bottom:10px;">${title} <span class="badge" style="background:var(--line-soft); color:var(--ink-soft);">${topics.length}</span></h2>
        ${topics.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>${I18n.t('table.topic')}</th><th>${I18n.t('table.status')}</th><th>${I18n.t('table.nextReview')}</th>${hideMarkBtn ? `<th>${I18n.t('reviews.completed')}</th>` : '<th></th>'}</tr></thead>
              <tbody>
                ${topics.map(t => `
                  <tr data-topic-id="${t.id}">
                    <td><strong>${Topics.escapeHtml(t.topic)}</strong></td>
                    <td>${Topics.statusBadge(t.status)}</td>
                    <td class="mono">${UI.fmtDate(t.next_review)}</td>
                    ${hideMarkBtn
                      ? `<td class="mono">${UI.fmtDate(t.completed_at)}</td>`
                      : `<td><button class="btn btn-sm mark-reviewed-btn" data-topic-id="${t.id}">${I18n.t('reviews.markAsReviewed')}</button></td>`}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">${title === I18n.t('reviews.recentlyLearned') ? I18n.t('reviews.nothingMastered') : I18n.t('reviews.noTopicsDue')}</p>`}
      </div>
    `;
  }

  return { renderTopicReviewsTab, bindTab, renderCenter };
})();
