/**
 * js/knowledge.js
 * Renders and saves the "Knowledge" record attached to a Topic:
 * what_i_know / what_i_dont_know / what_i_need_to_learn,
 * business_understanding / erp_understanding, practical_experience, notes.
 */

const Knowledge = (function () {

  function ta(name, label, value, placeholder) {
    return `<div class="field">
      <label>${label}</label>
      <textarea name="${name}" placeholder="${placeholder || ''}">${escapeHtml(value || '')}</textarea>
    </div>`;
  }

  function renderKnowledgeTab(topic, k) {
    return `
      <form id="knowledge-form">
        ${ta('what_i_know', 'What I Know', k.what_i_know, 'What you already understand about this topic')}
        ${ta('what_i_dont_know', "What I Don't Know", k.what_i_dont_know, "What's still unclear")}
        ${ta('what_i_need_to_learn', 'What I Need To Learn', k.what_i_need_to_learn, 'What you still need to study or practice')}
        ${ta('notes', 'Notes', k.notes, 'Any additional notes')}
        <button type="submit" class="btn btn-primary">Save Knowledge</button>
      </form>
    `;
  }

  function renderBusinessErpTab(k) {
    return `
      <form id="business-form">
        <div class="section-title">Business Understanding</div>
        ${ta('business_understanding', 'Business Scenario, Rules, Process, Inputs &amp; Outputs', k.business_understanding,
          'e.g. Business Scenario / Business Rules / Business Process / Inputs / Outputs')}
        <div class="section-title">ERP Understanding</div>
        ${ta('erp_understanding', 'Screens, Fields, Configuration, Transactions, Impact &amp; Reports', k.erp_understanding,
          'e.g. Screens / Fields / Configuration / Transactions / Accounting Impact / Inventory Impact / Reports')}
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    `;
  }

  function renderPracticalTab(topic, k) {
    return `
      <form id="practical-form">
        <div class="section-title">Practical Experience</div>
        ${ta('practical_experience', 'Real Scenario, Test Case, Issue &amp; Solution', k.practical_experience,
          'e.g. Real Scenario / Test Case / Issue / Solution')}
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    `;
  }

  function bindTab(panelEl, topicId) {
    const forms = [
      panelEl.querySelector('#knowledge-form'),
      panelEl.querySelector('#business-form'),
      panelEl.querySelector('#practical-form')
    ].filter(Boolean);

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());
        payload.topic_id = topicId;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
          await API.saveKnowledge(payload);
          UI.toast('Knowledge updated successfully', 'success');
        } catch (err) {
          UI.toast(err.message, 'error');
        } finally {
          btn.disabled = false;
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderKnowledgeTab, renderBusinessErpTab, renderPracticalTab, bindTab };
})();
