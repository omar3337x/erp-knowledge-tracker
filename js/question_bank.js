/**
 * js/question_bank.js
 * 📚 ERP Question Bank Explorer & Repository
 * Interactive catalog with hidden answers by default, status tabs, and practice launcher.
 */

const QuestionBank = (function () {
  let _questions = [];
  let _filterModule = '';
  let _filterDifficulty = '';
  let _filterTab = 'all'; // 'all', 'solved', 'wrong', 'unattempted'
  let _searchQuery = '';
  let _revealedAnswers = {}; // question_id -> boolean

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
                ${isAr ? 'مستودع متكامل للأسئلة مع إمكانية التدرب الفردي وكشف الإجابات والشرح عند الطلب.' : 'Explore ERP questions, practice individually, and reveal explanations on demand.'}
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="btn-start-challenge-from-bank" class="btn btn-primary btn-sm" style="font-size: 13px;">
                🧠 ${isAr ? 'بدء التحدي اليومي' : 'Start Daily Challenge'}
              </button>
            </div>
          </div>

          <!-- Status Tabs -->
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line);">
            <button type="button" class="btn btn-sm ${_filterTab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-tab-pill" data-tab="all">
              🌐 ${isAr ? 'جميع الأسئلة' : 'All Questions'}
            </button>
            <button type="button" class="btn btn-sm ${_filterTab === 'solved' ? 'btn-primary' : 'btn-secondary'} btn-tab-pill" data-tab="solved">
              ✅ ${isAr ? 'أسئلة قمت بحلها' : 'Solved Questions'}
            </button>
            <button type="button" class="btn btn-sm ${_filterTab === 'wrong' ? 'btn-primary' : 'btn-secondary'} btn-tab-pill" data-tab="wrong">
              ⚠️ ${isAr ? 'أخطاء تحتاج مراجعة' : 'Mistakes to Review'}
            </button>
            <button type="button" class="btn btn-sm ${_filterTab === 'unattempted' ? 'btn-primary' : 'btn-secondary'} btn-tab-pill" data-tab="unattempted">
              ⏳ ${isAr ? 'أسئلة جديدة' : 'New / Unattempted'}
            </button>
          </div>

          <!-- Filters Bar -->
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 14px;">
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
        Router.go('daily-challenge');
      });
    }

    const tabBtns = container.querySelectorAll('.btn-tab-pill');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.className = 'btn btn-sm btn-secondary btn-tab-pill');
        btn.className = 'btn btn-sm btn-primary btn-tab-pill';
        _filterTab = btn.getAttribute('data-tab');
        renderQuestionList();
      });
    });

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
    if (!listEl) return;
    const isAr = I18n.getLang() === 'ar';

    listEl.innerHTML = `
      <div class="card" style="padding: 30px; text-align: center;">
        <div class="spinner" style="margin: 0 auto 12px auto;"></div>
        <p style="color: var(--ink-soft); font-size: 13px;">${isAr ? 'تصفية الأسئلة...' : 'Filtering questions...'}</p>
      </div>
    `;

    try {
      let res = null;
      try {
        res = await API.getQuestionBank({
          module_id: _filterModule,
          difficulty: _filterDifficulty,
          search: _searchQuery,
          limit: 100
        });
      } catch (e) {
        res = { questions: [] };
      }

      let questions = (res && Array.isArray(res.questions)) ? [...res.questions] : [];

      if (typeof CHALLENGE_BANK_DATA !== 'undefined') {
        const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
        const targetModules = _filterModule ? [modules.find(m => m.id === _filterModule) || { id: _filterModule }] : modules;

        const existingIds = new Set(questions.map(q => q.id));
        for (let mod of targetModules) {
          const modBank = CHALLENGE_BANK_DATA.getQuestionsForModule(mod.id, isAr);
          for (let bq of modBank) {
            if (!existingIds.has(bq.id)) {
              if (_filterDifficulty && String(bq.difficulty).toLowerCase() !== _filterDifficulty.toLowerCase()) continue;
              if (_searchQuery) {
                const text = (bq.question + ' ' + (bq.explanation || '')).toLowerCase();
                if (text.indexOf(_searchQuery.toLowerCase()) === -1) continue;
              }
              questions.push(bq);
              existingIds.add(bq.id);
            }
          }
        }
      }

      _questions = questions;
      renderQuestionList();

    } catch (err) {
      listEl.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; border-inline-start: 4px solid var(--rust);">
          <p style="color: var(--rust); font-size: 13px;">${isAr ? 'فشل تحميل بنك الأسئلة: ' + err.message : 'Error: ' + err.message}</p>
        </div>
      `;
    }
  }

  function renderQuestionList() {
    const listEl = document.getElementById('bank-questions-list');
    const countEl = document.getElementById('bank-total-count');
    if (!listEl) return;
    const isAr = I18n.getLang() === 'ar';

    // Filter by Tab
    let filtered = _questions;
    if (_filterTab === 'solved') {
      filtered = _questions.filter(q => (q.times_asked && q.times_asked > 0));
    } else if (_filterTab === 'wrong') {
      filtered = _questions.filter(q => (q.times_wrong && q.times_wrong > 0));
    } else if (_filterTab === 'unattempted') {
      filtered = _questions.filter(q => (!q.times_asked || q.times_asked === 0));
    }

    if (countEl) countEl.textContent = `${filtered.length} ${isAr ? 'سؤال' : 'Questions'}`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="padding: 40px; text-align: center;">
          <p style="color: var(--ink-soft); font-size: 14px;">
            ${isAr ? 'لا توجد أسئلة تطابق الفلتر أو التبويب المحدد.' : 'No questions match the active tab and filters.'}
          </p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${filtered.map((q, idx) => {
          const isRevealed = !!_revealedAnswers[q.id];
          const hasAttempted = Number(q.times_asked) > 0;
          const isWrong = Number(q.times_wrong) > 0;

          let diffColor = 'badge-teal';
          if (q.difficulty === 'Intermediate') diffColor = 'badge-brass';
          if (q.difficulty === 'Advanced' || q.difficulty === 'Expert') diffColor = 'badge-rust';

          return `
            <div class="card" id="bank-q-card-${escapeHtml(q.id)}" style="padding: 18px 20px;">
              <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px;">
                  <span class="mono" style="font-size: 12px; font-weight: 700; color: var(--ink-soft);">#${idx + 1}</span>
                  <span class="badge badge-secondary" style="font-size: 11px;">🏷️ ${escapeHtml(q.question_type || 'MCQ')}</span>
                  <span class="badge ${diffColor}" style="font-size: 11px;">⚡ ${escapeHtml(q.difficulty || 'Intermediate')}</span>
                  ${q.topic_id ? `<span class="badge badge-secondary" style="font-size: 11px;">📌 ${escapeHtml(q.topic_id)}</span>` : ''}
                  ${hasAttempted ? (isWrong ? `<span class="badge badge-rust" style="font-size: 11px;">❌ ${isAr ? 'تمت المحاولة (خطأ سابق)' : 'Previously Wrong'}</span>` : `<span class="badge badge-teal" style="font-size: 11px;">✅ ${isAr ? 'تم حله بنجاح' : 'Solved'}</span>`) : `<span class="badge badge-secondary" style="font-size: 11px; opacity:0.8;">⏳ ${isAr ? 'جديد' : 'New'}</span>`}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn btn-secondary btn-sm btn-reveal-answer" data-id="${escapeHtml(q.id)}" style="font-size: 12px; padding: 3px 10px;">
                    ${isRevealed ? `🙈 ${isAr ? 'إخفاء الإجابة' : 'Hide Answer'}` : `👁️ ${isAr ? 'كشف الإجابة والشرح' : 'Reveal Answer'}`}
                  </button>
                </div>
              </div>

              <!-- Question Text -->
              <div style="font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.5; margin-bottom: 12px;">
                ${escapeHtml(q.question)}
              </div>

              <!-- Options Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px; margin-bottom: 12px;">
                ${(q.options || []).map(opt => {
                  const isCorrect = opt.id === q.correct_answer;
                  const border = isRevealed && isCorrect ? 'var(--teal)' : 'var(--line)';
                  const bg = isRevealed && isCorrect ? 'rgba(44, 122, 107, 0.08)' : 'var(--paper)';
                  const labelColor = isRevealed && isCorrect ? 'var(--teal)' : 'var(--ink-soft)';

                  return `
                    <div style="
                      font-size: 13px; padding: 8px 12px; border-radius: var(--radius-sm);
                      border: 1px solid ${border}; background: ${bg}; color: var(--ink);
                      transition: all 0.2s ease;
                    ">
                      <strong style="color: ${labelColor};">${escapeHtml(opt.id)}:</strong> ${escapeHtml(opt.text)}
                      ${isRevealed && isCorrect ? ` <span style="color: var(--teal); font-weight: 700;">✓ (${isAr ? 'الإجابة الصحيحة' : 'Correct'})</span>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Collapsible Explanation & Distractor Analysis -->
              ${isRevealed ? `
                <div style="font-size: 13px; color: var(--ink); line-height: 1.6; padding-top: 12px; border-top: 1px dashed var(--line); display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.02); padding: 12px; border-radius: var(--radius-sm);">
                  <div>
                    <strong style="color: var(--teal);">💡 ${isAr ? 'التفسير المحاسبي والتشغيلي:' : 'Explanation:'}</strong>
                    <div style="margin-top: 4px;">${escapeHtml(q.explanation || '—')}</div>
                  </div>
                  ${(q.reference && q.reference.url) ? `
                    <div style="margin-top: 4px;">
                      <a href="${escapeHtml(q.reference.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px; display: inline-flex; align-items: center; gap: 4px;">
                        🔗 ${escapeHtml(q.reference.title || (isAr ? 'التوثيق المعتمد' : 'Reference Source'))}
                      </a>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind reveal toggles
    listEl.querySelectorAll('.btn-reveal-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        _revealedAnswers[id] = !_revealedAnswers[id];
        renderQuestionList();
      });
    });
  }

  return {
    render,
    loadQuestions
  };
})();
