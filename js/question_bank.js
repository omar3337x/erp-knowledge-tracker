/**
 * js/question_bank.js
 * 📚 ERP Question Bank Explorer & Repository
 * Full filterable catalog, success rate metrics, and quality review tools.
 */

const QuestionBank = (function () {
  let _questions = [];
  let _filterModule = '';
  let _filterDifficulty = '';
  let _searchQuery = '';
  let _isLoading = false;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function render(container) {
    if (!container) return;
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);

    container.innerHTML = `
      <div class="question-bank-page" style="max-width: 1080px; margin: 0 auto; padding: 20px 16px;">
        <!-- Header -->
        <div class="card" style="padding: 20px; margin-bottom: 20px; border-inline-start: 4px solid var(--brass);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-size: 20px; font-weight: 700; color: var(--ink); margin: 0;">
                  📚 ${isAr ? 'بنك الأسئلة والسيناريوهات التطبيقية' : 'ERP Question Bank & Scenarios'}
                </h1>
                <span id="bank-total-count" class="badge badge-brass" style="font-size: 12px;">0 ${isAr ? 'سؤال' : 'Questions'}</span>
              </div>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 4px 0 0 0;">
                ${isAr ? 'مستودع متكامل للأسئلة المولدة بالذكاء الاصطناعي مع إحصائيات الدقة ومعدلات النجاح.' : 'Comprehensive repository of AI-generated ERP questions with accuracy and success rate statistics.'}
              </p>
            </div>
            <button id="btn-start-challenge-from-bank" class="btn btn-primary btn-sm" style="font-size: 13px;">
              🧠 ${isAr ? 'بدء التحدي اليومي' : 'Start Daily Challenge'}
            </button>
          </div>

          <!-- Filters Bar -->
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--line);">
            <div style="flex: 2; min-width: 220px;">
              <input type="text" id="bank-search-input" class="form-control" placeholder="${isAr ? '🔍 بحث في نص السؤال أو المفهوم...' : '🔍 Search question text or concept...'}" value="${escapeHtml(_searchQuery)}" style="font-size: 13px;">
            </div>

            <div style="flex: 1; min-width: 160px;">
              <select id="bank-module-filter" class="form-control" style="font-size: 13px;">
                <option value="">${isAr ? 'كل الموديولات' : 'All Modules'}</option>
                ${modules.map(m => `
                  <option value="${escapeHtml(m.id)}" ${_filterModule === m.id ? 'selected' : ''}>
                    ${escapeHtml(isAr ? (m.name_ar || m.name_en) : (m.name_en || m.name_ar))}
                  </option>
                `).join('')}
              </select>
            </div>

            <div style="flex: 1; min-width: 140px;">
              <select id="bank-difficulty-filter" class="form-control" style="font-size: 13px;">
                <option value="">${isAr ? 'كل المستويات' : 'All Difficulties'}</option>
                <option value="Beginner" ${_filterDifficulty === 'Beginner' ? 'selected' : ''}>Beginner</option>
                <option value="Intermediate" ${_filterDifficulty === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Advanced" ${_filterDifficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
                <option value="Expert" ${_filterDifficulty === 'Expert' ? 'selected' : ''}>Expert</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Questions Grid List -->
        <div id="bank-questions-list">
          <div class="card" style="padding: 40px; text-align: center;">
            <div class="spinner" style="margin: 0 auto 12px auto;"></div>
            <p style="color: var(--ink-soft); font-size: 14px;">${isAr ? 'جارٍ تحميل بنك الأسئلة...' : 'Loading Question Bank...'}</p>
          </div>
        </div>
      </div>
    `;

    bindEvents(container);
    await loadQuestions();
  }

  function bindEvents(container) {
    const isAr = I18n.getLang() === 'ar';
    const searchInput = container.querySelector('#bank-search-input');
    const modFilter = container.querySelector('#bank-module-filter');
    const diffFilter = container.querySelector('#bank-difficulty-filter');
    const startBtn = container.querySelector('#btn-start-challenge-from-bank');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        Router.navigate('daily-challenge');
      });
    }

    let debounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          _searchQuery = e.target.value;
          loadQuestions();
        }, 300);
      });
    }

    if (modFilter) {
      modFilter.addEventListener('change', (e) => {
        _filterModule = e.target.value;
        loadQuestions();
      });
    }

    if (diffFilter) {
      diffFilter.addEventListener('change', (e) => {
        _filterDifficulty = e.target.value;
        loadQuestions();
      });
    }
  }

  async function loadQuestions() {
    const listEl = document.getElementById('bank-questions-list');
    const countEl = document.getElementById('bank-total-count');
    if (!listEl) return;
    const isAr = I18n.getLang() === 'ar';

    listEl.innerHTML = `
      <div class="card" style="padding: 30px; text-align: center;">
        <div class="spinner" style="margin: 0 auto 12px auto;"></div>
        <p style="color: var(--ink-soft); font-size: 13px;">${isAr ? 'تصفية الأسئلة...' : 'Filtering questions...'}</p>
      </div>
    `;

    try {
      const res = await API.getQuestionBank({
        module_id: _filterModule,
        difficulty: _filterDifficulty,
        search: _searchQuery,
        limit: 100
      });

      _questions = (res && res.questions) ? res.questions : [];
      if (countEl) countEl.textContent = `${_questions.length} ${isAr ? 'سؤال' : 'Questions'}`;

      if (_questions.length === 0) {
        listEl.innerHTML = `
          <div class="card" style="padding: 40px; text-align: center;">
            <p style="color: var(--ink-soft); font-size: 14px;">
              ${isAr ? 'لم يتم العثور على أسئلة مطابقة للبحث.' : 'No questions match the selected filters.'}
            </p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${_questions.map((q, idx) => {
            const successRate = q.success_rate !== undefined ? q.success_rate : 100;
            let diffColor = 'badge-teal';
            if (q.difficulty === 'Intermediate') diffColor = 'badge-brass';
            if (q.difficulty === 'Advanced' || q.difficulty === 'Expert') diffColor = 'badge-rust';

            return `
              <div class="card" style="padding: 18px 20px;">
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
                  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px;">
                    <span class="mono" style="font-size: 12px; font-weight: 700; color: var(--ink-soft);">#${idx + 1}</span>
                    <span class="badge badge-secondary" style="font-size: 11px;">🏷️ ${escapeHtml(q.question_type || 'MCQ')}</span>
                    <span class="badge ${diffColor}" style="font-size: 11px;">⚡ ${escapeHtml(q.difficulty || 'Intermediate')}</span>
                    ${q.topic_id ? `<span class="badge badge-secondary" style="font-size: 11px;">📌 ${escapeHtml(q.topic_id)}</span>` : ''}
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge ${successRate < 50 ? 'badge-rust' : (successRate < 75 ? 'badge-brass' : 'badge-teal')}" style="font-size: 11px;">
                      📊 ${isAr ? 'نسبة النجاح:' : 'Success:'} ${successRate}%
                    </span>
                    <span style="font-size: 11px; color: var(--ink-soft);">
                      (${q.times_asked || 0} ${isAr ? 'محاولة' : 'attempts'})
                    </span>
                  </div>
                </div>

                <!-- Question Text -->
                <div style="font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.5; margin-bottom: 12px;">
                  ${escapeHtml(q.question)}
                </div>

                <!-- Options Preview -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px; margin-bottom: 12px;">
                  ${(q.options || []).map(opt => `
                    <div style="
                      font-size: 12px; padding: 6px 10px; border-radius: var(--radius-sm);
                      border: 1px solid ${opt.id === q.correct_answer ? 'var(--teal)' : 'var(--line)'};
                      background: ${opt.id === q.correct_answer ? 'rgba(44, 122, 107, 0.06)' : 'var(--paper)'};
                      color: var(--ink);
                    ">
                      <strong style="color: ${opt.id === q.correct_answer ? 'var(--teal)' : 'var(--ink-soft)'};">${escapeHtml(opt.id)}:</strong> ${escapeHtml(opt.text)}
                    </div>
                  `).join('')}
                </div>

                <!-- Explanation & Reference Footer -->
                <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.5; padding-top: 10px; border-top: 1px dashed var(--line); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;">
                  <div style="flex: 1; min-width: 250px;">
                    <strong style="color: var(--teal);">✓ ${isAr ? 'الإجابة والشرح:' : 'Explanation:'}</strong> ${escapeHtml(q.explanation || '—')}
                  </div>
                  ${(q.reference && q.reference.url) ? `
                    <a href="${escapeHtml(q.reference.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px; white-space: nowrap;">
                      🔗 ${escapeHtml(q.reference.source || (isAr ? 'التوثيق الرسمي' : 'Official Doc'))}
                    </a>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

    } catch (err) {
      listEl.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; border-inline-start: 4px solid var(--rust);">
          <p style="color: var(--rust); font-size: 13px;">${isAr ? 'فشل تحميل بنك الأسئلة: ' + err.message : 'Error: ' + err.message}</p>
        </div>
      `;
    }
  }

  return {
    render,
    loadQuestions
  };
})();
