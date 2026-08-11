/**
 * js/knowledge.js — Renders and saves the "Knowledge" record attached to a Topic.
 */

const Knowledge = (function () {

  function ta(name, label, value, placeholder) {
    return `<div class="field">
      <label>${label}</label>
      <textarea name="${name}" placeholder="${placeholder || ''}">${Topics.escapeHtml(value || '')}</textarea>
    </div>`;
  }

  function renderKnowledgeTab(topic, k) {
    return `
      <form id="knowledge-form">
        ${ta('what_i_know', I18N.t('knowledge.what_i_know'), k.what_i_know, I18N.t('knowledge.what_i_know_ph'))}
        ${ta('what_i_dont_know', I18N.t('knowledge.what_i_dont_know'), k.what_i_dont_know, I18N.t('knowledge.what_i_dont_know_ph'))}
        ${ta('what_i_need_to_learn', I18N.t('knowledge.what_i_need_to_learn'), k.what_i_need_to_learn, I18N.t('knowledge.what_i_need_to_learn_ph'))}
        ${ta('notes', I18N.t('knowledge.notes'), k.notes, I18N.t('knowledge.notes_ph'))}
        <button type="submit" class="btn btn-primary">${I18N.t('knowledge.save')}</button>
      </form>
    `;
  }

  function renderBusinessErpTab(k) {
    return `
      <form id="business-form">
        <div class="section-title">${I18N.t('knowledge.business_section')}</div>
        ${ta('business_understanding', I18N.t('knowledge.business_label'), k.business_understanding, I18N.t('knowledge.business_ph'))}
        <div class="section-title">${I18N.t('knowledge.erp_section')}</div>
        ${ta('erp_understanding', I18N.t('knowledge.erp_label'), k.erp_understanding, I18N.t('knowledge.erp_ph'))}
        <button type="submit" class="btn btn-primary">${I18N.t('general.save')}</button>
      </form>
    `;
  }

  function renderPracticalTab(topic, k) {
    return `
      <form id="practical-form">
        <div class="section-title">${I18N.t('knowledge.practical_section')}</div>
        ${ta('practical_experience', I18N.t('knowledge.practical_label'), k.practical_experience, I18N.t('knowledge.practical_ph'))}
        <button type="submit" class="btn btn-primary">${I18N.t('general.save')}</button>
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
          UI.toast(I18N.t('toast.knowledge_updated'), 'success');
        } catch (err) {
          UI.toast(err.message, 'error');
        } finally {
          btn.disabled = false;
        }
      });
    });
  }

  return { renderKnowledgeTab, renderBusinessErpTab, renderPracticalTab, bindTab };
})();
