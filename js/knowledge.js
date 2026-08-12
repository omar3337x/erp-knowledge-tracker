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
        ${ta('what_i_know', I18n.t('topicDetail.whatIKnow'), k.what_i_know, I18n.t('topicDetail.whatIKnowPlaceholder'))}
        ${ta('what_i_dont_know', I18n.t('topicDetail.whatIDontKnow'), k.what_i_dont_know, I18n.t('topicDetail.whatIDontKnowPlaceholder'))}
        ${ta('what_i_need_to_learn', I18n.t('topicDetail.whatINeedToLearn'), k.what_i_need_to_learn, I18n.t('topicDetail.whatINeedToLearnPlaceholder'))}
        ${ta('notes', I18n.t('topicDetail.notes'), k.notes, I18n.t('topicDetail.notesPlaceholder'))}
        <button type="submit" class="btn btn-primary">${I18n.t('topicDetail.saveKnowledge')}</button>
      </form>
    `;
  }

  function renderBusinessErpTab(k) {
    return `
      <form id="business-form">
        <div class="section-title">${I18n.t('topicDetail.businessUnderstanding')}</div>
        ${ta('business_understanding', I18n.t('topicDetail.businessUnderstanding'), k.business_understanding, I18n.t('topicDetail.businessPlaceholder'))}
        <div class="section-title">${I18n.t('topicDetail.erpUnderstanding')}</div>
        ${ta('erp_understanding', I18n.t('topicDetail.erpUnderstanding'), k.erp_understanding, I18n.t('topicDetail.erpPlaceholder'))}
        <button type="submit" class="btn btn-primary">${I18n.t('topicDetail.save')}</button>
      </form>
    `;
  }

  function renderPracticalTab(topic, k) {
    return `
      <form id="practical-form">
        <div class="section-title">${I18n.t('topicDetail.practicalExperience')}</div>
        ${ta('practical_experience', I18n.t('topicDetail.practicalExperience'), k.practical_experience, I18n.t('topicDetail.practicalPlaceholder'))}
        <button type="submit" class="btn btn-primary">${I18n.t('topicDetail.save')}</button>
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
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());
        payload.topic_id = topicId;

        // ── OPTIMISTIC LOCAL UPDATE (0ms) ───────────────────────────────
        UI.toast(I18n.t('toast.knowledgeUpdated'), 'success');

        // ── BACKGROUND API CALL (non-blocking) ────────────────────────────
        API.saveKnowledge(payload).catch(err => UI.toastError(err));
      });
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  return { renderKnowledgeTab, renderBusinessErpTab, renderPracticalTab, bindTab };
})();
