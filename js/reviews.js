/**
 * js/reviews.js
 * Review Center (Due Today / Overdue / Due This Week / Recently Learned)
 * and the per-topic Reviews tab with "Mark as Reviewed".
 */

const Reviews = (function () {

  // ---------------------------------------------------------------- topic tab
  function renderTopicReviewsTab(topic, reviews) {
    return `
      <form id="review-form" style="margin-bottom:18px;">
        <div class="section-title">Mark As Reviewed</div>
        <div class="field">
          <label>Understanding Level</label>
          <select name="understanding">
            <option>Weak</option><option selected>Good</option><option>Strong</option>
          </select>
        </div>
        <div class="field">
          <label>Notes</label>
          <textarea name="notes" placeholder="What did you reinforce in this review?"></textarea>
        </div>
        <div class="field">
          <label>Next Review In (days)</label>
          <input type="number" name="next_review_days" value="14" min="1" max="180">
        </div>
        <button type="submit" class="btn btn-primary">Mark as Reviewed</button>
      </form>

      <div class="section-title">Review History</div>
      ${reviews.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Understanding</th><th>Notes</th></tr></thead>
            <tbody>
              ${reviews.slice().reverse().map(r => `
                <tr><td class="mono">${UI.fmtDate(r.review_date)}</td><td>${r.understanding}</td><td>${Topics.escapeHtml(r.notes)}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>` : `<p class="field-hint">No reviews logged yet for this topic.</p>`}
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
        UI.toast('Review completed', 'success');
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
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading review center...</div>`;
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
      ${section('Overdue', overdue, 'rust')}
      ${section('Due Today', dueToday, 'brass')}
      ${section('Due This Week', dueThisWeek, '')}
      ${section('Recently Learned', recentlyLearned, 'teal', true)}
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
          UI.toast('Review completed', 'success');
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
              <thead><tr><th>Topic</th><th>Status</th><th>Next Review</th>${hideMarkBtn ? '<th>Completed</th>' : '<th></th>'}</tr></thead>
              <tbody>
                ${topics.map(t => `
                  <tr data-topic-id="${t.id}">
                    <td><strong>${Topics.escapeHtml(t.topic)}</strong></td>
                    <td>${Topics.statusBadge(t.status)}</td>
                    <td class="mono">${UI.fmtDate(t.next_review)}</td>
                    ${hideMarkBtn
                      ? `<td class="mono">${UI.fmtDate(t.completed_at)}</td>`
                      : `<td><button class="btn btn-sm mark-reviewed-btn" data-topic-id="${t.id}">Mark as Reviewed</button></td>`}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<p class="field-hint">${title === 'Recently Learned' ? 'Nothing mastered yet.' : 'No topics are due for review.'}</p>`}
      </div>
    `;
  }

  return { renderTopicReviewsTab, bindTab, renderCenter };
})();
