/**
 * js/daily_challenge.js
 * 🧠 AI Daily ERP Challenge Engine (DataCamp-style Interactive ERP Practice)
 * Closed-loop cycle: Generate -> Practice -> Hint -> Confidence -> Feedback -> Distractor Analysis -> Spaced Repetition -> Topic Mastery
 */

const DailyChallenge = (function () {
  let _currentChallenge = null;
  let _currentIndex = 0;
  let _selectedOption = null;
  let _selectedConfidence = 'Confident';
  let _hintsRevealed = 0;
  let _startTime = null;
  let _timerInterval = null;
  let _secondsElapsed = 0;
  let _isSubmitted = false;
  let _activeMode = 'Practice';
  let _activeModuleId = '';
  let _completedResults = [];

  const MODES = [
    { id: 'Practice', name_en: '🎯 Practice', name_ar: '🎯 تدريب قياسي', timed: false },
    { id: 'Learning', name_en: '📖 Learning', name_ar: '📖 تعلم وتوجيه', timed: false },
    { id: 'Interview', name_en: '💼 Interview', name_ar: '💼 أسئلة مقابلات', timed: true },
    { id: 'Troubleshooting', name_en: '🛠️ Troubleshooting', name_ar: '🛠️ حل مشاكل واقعية', timed: false },
    { id: 'Accounting', name_en: '📊 Accounting Impact', name_ar: '📊 أثر محاسبي وقيود', timed: false },
    { id: 'Mixed', name_en: '🔀 Mixed Challenge', name_ar: '🔀 تحدي شامل مختلط', timed: true }
  ];

  const CONFIDENCE_LEVELS = [
    { id: 'Guessing', icon: '😕', text_en: 'Guessing', text_ar: 'تخمين' },
    { id: 'Not Sure', icon: '🤔', text_en: 'Not Sure', text_ar: 'غير متأكد' },
    { id: 'Confident', icon: '🙂', text_en: 'Confident', text_ar: 'واثق' },
    { id: 'Very Confident', icon: '😎', text_en: 'Very Confident', text_ar: 'واثق جداً' }
  ];

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

    // Get current modules from State
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    if (!_activeModuleId && modules.length > 0) {
      _activeModuleId = modules[0].id;
    }

    container.innerHTML = `
      <div class="challenge-container" style="max-width: 960px; margin: 0 auto; padding: 20px 16px;">
        <!-- Header Bar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 20px; border-inline-start: 4px solid var(--brass);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-size: 20px; font-weight: 700; color: var(--ink); margin: 0;">
                  🧠 ${isAr ? 'تحدي الـ ERP اليومي بالذكاء الاصطناعي' : 'AI Daily ERP Challenge'}
                </h1>
                <span class="badge badge-brass" style="font-size: 11px; padding: 2px 8px;">DataCamp Style</span>
              </div>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 4px 0 0 0;">
                ${isAr ? '10 أسئلة مخصصة يومياً تركز على نقاط الضعف، الفجوات المعرفية، والتكرار المتباعد.' : '10 personalized daily questions targeted at your knowledge gaps, weak topics & spaced repetition.'}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button id="btn-challenge-history" class="btn btn-secondary btn-sm" style="font-size: 12px;">
                📅 ${isAr ? 'سجل التحديات' : 'Challenge History'}
              </button>
              <button id="btn-question-bank" class="btn btn-secondary btn-sm" style="font-size: 12px;">
                📚 ${isAr ? 'بنك الأسئلة' : 'Question Bank'}
              </button>
            </div>
          </div>

          <!-- Controls: Module Selector & Modes -->
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--line);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px;">
              <label style="font-size: 13px; font-weight: 600; color: var(--ink-soft); white-space: nowrap;">
                ${isAr ? 'الموديول:' : 'Module:'}
              </label>
              <select id="challenge-module-select" class="form-control" style="font-size: 13px; padding: 6px 10px;">
                ${modules.map(m => `
                  <option value="${escapeHtml(m.id)}" ${_activeModuleId === m.id ? 'selected' : ''}>
                    ${escapeHtml(isAr ? (m.name_ar || m.name_en) : (m.name_en || m.name_ar))}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Mode Selector Pills -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${MODES.map(m => `
                <button type="button" class="btn btn-sm ${m.id === _activeMode ? 'btn-primary' : 'btn-secondary'} btn-mode-pill" data-mode="${m.id}" style="font-size: 12px; padding: 4px 10px;">
                  ${isAr ? m.name_ar : m.name_en}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Main Challenge Workspace -->
        <div id="challenge-workspace">
          <div class="card" style="padding: 40px 20px; text-align: center;">
            <div class="spinner" style="margin: 0 auto 16px auto;"></div>
            <p style="color: var(--ink-soft); font-size: 14px;">
              ${isAr ? 'جارٍ تخصيص أسئلة اليوم ومراجعة الفجوات المعرفية...' : 'Preparing personalized challenge & scanning knowledge gaps...'}
            </p>
          </div>
        </div>
      </div>
    `;

    bindHeaderEvents(container);
    await loadChallengeData();
  }

  function bindHeaderEvents(container) {
    const isAr = I18n.getLang() === 'ar';
    const modSelect = container.querySelector('#challenge-module-select');
    if (modSelect) {
      modSelect.addEventListener('change', async (e) => {
        _activeModuleId = e.target.value;
        await loadChallengeData();
      });
    }

    const modeBtns = container.querySelectorAll('.btn-mode-pill');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        modeBtns.forEach(b => b.className = 'btn btn-sm btn-secondary btn-mode-pill');
        btn.className = 'btn btn-sm btn-primary btn-mode-pill';
        _activeMode = btn.getAttribute('data-mode');
        await loadChallengeData();
      });
    });

    const btnHistory = container.querySelector('#btn-challenge-history');
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        Router.navigate('challenge-history');
      });
    }

    const btnBank = container.querySelector('#btn-question-bank');
    if (btnBank) {
      btnBank.addEventListener('click', () => {
        Router.navigate('question-bank');
      });
    }
  }

  async function loadChallengeData() {
    const workspace = document.getElementById('challenge-workspace');
    if (!workspace) return;
    const isAr = I18n.getLang() === 'ar';

    workspace.innerHTML = `
      <div class="card" style="padding: 40px 20px; text-align: center;">
        <div class="spinner" style="margin: 0 auto 16px auto;"></div>
        <p style="color: var(--ink-soft); font-size: 14px;">
          ${isAr ? 'جارٍ جلب الأسئلة المخصصة...' : 'Loading personalized challenge questions...'}
        </p>
      </div>
    `;

    try {
      const res = await API.getDailyChallenge(_activeModuleId, _activeMode, isAr ? 'ar' : 'en');
      if (res && res.questions && res.questions.length > 0) {
        _currentChallenge = res;
        _currentIndex = 0;
        _completedResults = [];
        resetQuestionState();
        renderQuestionCard();
      } else {
        workspace.innerHTML = `
          <div class="card" style="padding: 30px; text-align: center;">
            <p style="color: var(--ink-soft); font-size: 14px;">
              ${isAr ? 'لم يتم العثور على أسئلة لهذا الموديول حالياً.' : 'No challenge questions found for this module.'}
            </p>
            <button class="btn btn-primary" onclick="DailyChallenge.loadChallengeData()">
              🔄 ${isAr ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        `;
      }
    } catch (err) {
      workspace.innerHTML = `
        <div class="card" style="padding: 30px; text-align: center; border-inline-start: 4px solid var(--rust);">
          <p style="color: var(--rust); font-size: 14px;">
            ${isAr ? 'حدث خطأ أثناء تحميل الأسئلة: ' + escapeHtml(err.message) : 'Failed to load challenge: ' + escapeHtml(err.message)}
          </p>
          <button class="btn btn-secondary" onclick="DailyChallenge.loadChallengeData()">
            🔄 ${isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      `;
    }
  }

  function resetQuestionState() {
    _selectedOption = null;
    _selectedConfidence = 'Confident';
    _hintsRevealed = 0;
    _isSubmitted = false;
    _startTime = Date.now();
    _secondsElapsed = 0;
    if (_timerInterval) clearInterval(_timerInterval);

    const modeObj = MODES.find(m => m.id === _activeMode);
    if (modeObj && modeObj.timed) {
      _timerInterval = setInterval(() => {
        _secondsElapsed++;
        const timerEl = document.getElementById('challenge-timer-display');
        if (timerEl) {
          const mins = Math.floor(_secondsElapsed / 60);
          const secs = _secondsElapsed % 60;
          timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
      }, 1000);
    }
  }

  function renderQuestionCard() {
    const workspace = document.getElementById('challenge-workspace');
    if (!workspace || !_currentChallenge || !_currentChallenge.questions) return;

    const isAr = I18n.getLang() === 'ar';
    const totalQ = _currentChallenge.questions.length;
    const q = _currentChallenge.questions[_currentIndex];
    const progressPct = Math.round(((_currentIndex + 1) / totalQ) * 100);

    let difficultyColor = 'badge-teal';
    if (q.difficulty === 'Intermediate') difficultyColor = 'badge-brass';
    if (q.difficulty === 'Advanced' || q.difficulty === 'Expert') difficultyColor = 'badge-rust';

    workspace.innerHTML = `
      <!-- Progress & Status Meter -->
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px; color: var(--ink-soft);">
          <div>
            <strong>${isAr ? 'السؤال' : 'Question'} ${_currentIndex + 1} / ${totalQ}</strong>
            ${q.is_review_due ? `<span class="badge badge-rust" style="margin-inline-start: 8px;">🔁 ${isAr ? 'مراجعة أخطاء سابقة' : 'Mistake Review'}</span>` : ''}
            ${q.is_targeted_gap ? `<span class="badge badge-brass" style="margin-inline-start: 8px;">🎯 ${isAr ? 'فجوة معرفية' : 'Knowledge Gap'}</span>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span id="challenge-timer-display" class="mono" style="font-size: 13px; font-weight: 600; color: var(--slate-blue);">
              ${MODES.find(m => m.id === _activeMode)?.timed ? '⏱️ 0:00' : ''}
            </span>
            <span style="font-weight: 600;">${progressPct}%</span>
          </div>
        </div>
        <div style="height: 6px; background: var(--line); border-radius: 4px; overflow: hidden;">
          <div style="width: ${progressPct}%; height: 100%; background: var(--brass); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <!-- Interactive Question Card -->
      <div class="card" style="padding: 24px; position: relative;">
        <!-- Card Header Tags -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 14px;">
          <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
            <span class="badge badge-secondary" style="font-size: 11px;">🏷️ ${escapeHtml(q.question_type || 'Multiple Choice')}</span>
            <span class="badge ${difficultyColor}" style="font-size: 11px;">⚡ ${escapeHtml(q.difficulty || 'Intermediate')}</span>
            ${q.topic_id ? `<span class="badge badge-secondary" style="font-size: 11px;">📌 ${escapeHtml(q.topic_id)}</span>` : ''}
          </div>
          <button id="btn-report-q" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px; color: var(--ink-soft);" title="${isAr ? 'الإبلاغ عن مشكلة في السؤال' : 'Report Question'}">
            🚩 ${isAr ? 'إبلاغ' : 'Report'}
          </button>
        </div>

        <!-- Question Statement -->
        <div style="font-size: 16px; font-weight: 600; line-height: 1.6; color: var(--ink); margin-bottom: 20px;">
          ${escapeHtml(q.question)}
        </div>

        <!-- Options Container -->
        <div id="challenge-options-group" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          ${(q.options || []).map(opt => `
            <div class="challenge-opt-item" data-opt-id="${escapeHtml(opt.id)}" style="
              display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px;
              border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--paper-raised);
              cursor: pointer; transition: all 0.15s ease; user-select: none;
            ">
              <div class="opt-badge mono" style="
                width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--line);
                display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
                background: var(--paper); color: var(--ink); flex-shrink: 0; margin-top: 1px;
              ">
                ${escapeHtml(opt.id)}
              </div>
              <div style="font-size: 14px; color: var(--ink); line-height: 1.5; flex: 1;">
                ${escapeHtml(opt.text)}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 3-Tier DataCamp Style Hints -->
        <div id="challenge-hint-box" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <button id="btn-request-hint" class="btn btn-secondary btn-sm" style="font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
              💡 ${isAr ? 'طلب تلميح' : 'Need a Hint?'} (${_hintsRevealed}/3)
            </button>
            <span style="font-size: 11px; color: var(--ink-soft);">
              ${_hintsRevealed > 0 ? (isAr ? `تم استخدام ${_hintsRevealed} تلميحات` : `Hints used: ${_hintsRevealed}`) : ''}
            </span>
          </div>

          <!-- Hint Reveals -->
          <div id="hint-drawer" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
            ${(_hintsRevealed >= 1 && q.hints && q.hints[0]) ? `
              <div class="card" style="padding: 10px 14px; background: rgba(181, 119, 46, 0.08); border-inline-start: 3px solid var(--brass); font-size: 13px; color: var(--ink);">
                <strong>💡 ${isAr ? 'تلميح 1:' : 'Hint 1:'}</strong> ${escapeHtml(q.hints[0])}
              </div>
            ` : ''}
            ${(_hintsRevealed >= 2 && q.hints && q.hints[1]) ? `
              <div class="card" style="padding: 10px 14px; background: rgba(181, 119, 46, 0.12); border-inline-start: 3px solid var(--brass); font-size: 13px; color: var(--ink);">
                <strong>💡 ${isAr ? 'تلميح 2:' : 'Hint 2:'}</strong> ${escapeHtml(q.hints[1])}
              </div>
            ` : ''}
            ${(_hintsRevealed >= 3 && q.hints && q.hints[2]) ? `
              <div class="card" style="padding: 10px 14px; background: rgba(181, 119, 46, 0.18); border-inline-start: 3px solid var(--brass); font-size: 13px; color: var(--ink);">
                <strong>💡 ${isAr ? 'تلميح 3 (مفتاح الحل):' : 'Hint 3 (Direct Lead):'}</strong> ${escapeHtml(q.hints[2])}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Confidence Selector (Before Submit) -->
        <div id="confidence-selector-container" style="margin-bottom: 20px; padding: 12px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line);">
          <div style="font-size: 12px; font-weight: 600; color: var(--ink-soft); margin-bottom: 8px;">
            🤔 ${isAr ? 'ما مدى ثقتك بإجابتك؟' : 'How confident are you with this answer?'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${CONFIDENCE_LEVELS.map(c => `
              <button type="button" class="btn btn-sm ${c.id === _selectedConfidence ? 'btn-primary' : 'btn-secondary'} btn-conf-pill" data-conf="${c.id}" style="font-size: 12px; padding: 4px 10px;">
                ${c.icon} ${isAr ? c.text_ar : c.text_en}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Submit Bar -->
        <div id="challenge-action-bar" style="display: flex; justify-content: flex-end; gap: 12px;">
          <button id="btn-submit-answer" class="btn btn-primary" style="padding: 10px 24px; font-weight: 600; font-size: 14px;" disabled>
            ${isAr ? 'اعتماد الإجابة والتقييم' : 'Submit Answer'}
          </button>
        </div>

        <!-- Feedback & Distractor Explanation (Revealed After Submit) -->
        <div id="challenge-feedback-drawer" style="margin-top: 24px; display: none;"></div>
      </div>
    `;

    bindQuestionEvents(q);
  }

  function bindQuestionEvents(q) {
    const isAr = I18n.getLang() === 'ar';
    const workspace = document.getElementById('challenge-workspace');
    if (!workspace) return;

    // Option Clicks
    const optItems = workspace.querySelectorAll('.challenge-opt-item');
    const submitBtn = workspace.querySelector('#btn-submit-answer');

    optItems.forEach(item => {
      item.addEventListener('click', () => {
        if (_isSubmitted) return;
        optItems.forEach(el => {
          el.style.borderColor = 'var(--line)';
          el.style.background = 'var(--paper-raised)';
          const badge = el.querySelector('.opt-badge');
          if (badge) {
            badge.style.background = 'var(--paper)';
            badge.style.color = 'var(--ink)';
            badge.style.borderColor = 'var(--line)';
          }
        });

        item.style.borderColor = 'var(--brass)';
        item.style.background = 'rgba(181, 119, 46, 0.05)';
        const badge = item.querySelector('.opt-badge');
        if (badge) {
          badge.style.background = 'var(--brass)';
          badge.style.color = '#FFFFFF';
          badge.style.borderColor = 'var(--brass)';
        }

        _selectedOption = item.getAttribute('data-opt-id');
        if (submitBtn) submitBtn.disabled = false;
      });
    });

    // Confidence Level Clicks
    const confBtns = workspace.querySelectorAll('.btn-conf-pill');
    confBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        confBtns.forEach(b => b.className = 'btn btn-sm btn-secondary btn-conf-pill');
        btn.className = 'btn btn-sm btn-primary btn-conf-pill';
        _selectedConfidence = btn.getAttribute('data-conf');
      });
    });

    // Hint Button Click
    const hintBtn = workspace.querySelector('#btn-request-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        if (_hintsRevealed < 3) {
          _hintsRevealed++;
          renderQuestionCard();
        }
      });
    }

    // Submit Answer Click
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (!_selectedOption || _isSubmitted) return;
        _isSubmitted = true;
        submitBtn.disabled = true;
        submitBtn.textContent = isAr ? 'جارٍ التحليل والتقييم...' : 'Evaluating...';

        await evaluateCurrentAnswer(q);
      });
    }

    // Report Question Button
    const reportBtn = workspace.querySelector('#btn-report-q');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        openReportModal(q);
      });
    }
  }

  async function evaluateCurrentAnswer(q) {
    const isAr = I18n.getLang() === 'ar';
    const workspace = document.getElementById('challenge-workspace');
    if (!workspace) return;

    if (_timerInterval) clearInterval(_timerInterval);

    try {
      const payload = {
        question_id: q.id,
        answer: _selectedOption,
        confidence: _selectedConfidence,
        hints_used: _hintsRevealed,
        time_spent_sec: _secondsElapsed,
        module_id: q.module_id || _activeModuleId,
        topic_id: q.topic_id || '',
        category_id: q.category_id || '',
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        distractors: q.distractors || {},
        reference: q.reference || {}
      };

      const res = await API.submitQuestionAttempt(payload);
      const isCorrect = (res && res.correct) || (_selectedOption === q.correct_answer);

      _completedResults.push({
        question: q,
        user_answer: _selectedOption,
        correct: isCorrect,
        hints_used: _hintsRevealed,
        confidence: _selectedConfidence,
        time_spent_sec: _secondsElapsed,
        res: res
      });

      // Render Feedback inside drawer
      const feedbackDrawer = workspace.querySelector('#challenge-feedback-drawer');
      const actionBar = workspace.querySelector('#challenge-action-bar');
      if (actionBar) actionBar.style.display = 'none';

      // Highlight options visually
      const optItems = workspace.querySelectorAll('.challenge-opt-item');
      optItems.forEach(item => {
        const optId = item.getAttribute('data-opt-id');
        const badge = item.querySelector('.opt-badge');
        if (optId === q.correct_answer) {
          item.style.borderColor = 'var(--teal)';
          item.style.background = 'rgba(44, 122, 107, 0.1)';
          if (badge) {
            badge.style.background = 'var(--teal)';
            badge.style.color = '#FFFFFF';
            badge.textContent = '✓';
          }
        } else if (optId === _selectedOption && !isCorrect) {
          item.style.borderColor = 'var(--rust)';
          item.style.background = 'rgba(180, 71, 47, 0.1)';
          if (badge) {
            badge.style.background = 'var(--rust)';
            badge.style.color = '#FFFFFF';
            badge.textContent = '✗';
          }
        }
      });

      if (feedbackDrawer) {
        feedbackDrawer.style.display = 'block';
        feedbackDrawer.innerHTML = `
          <div class="card" style="padding: 20px; border-inline-start: 4px solid ${isCorrect ? 'var(--teal)' : 'var(--rust)'}; background: ${isCorrect ? 'rgba(44, 122, 107, 0.04)' : 'rgba(180, 71, 47, 0.04)'};">
            <!-- Result Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 700; color: ${isCorrect ? 'var(--teal)' : 'var(--rust)'}; margin: 0;">
                ${isCorrect ? (isAr ? '🟢 إجابة صحيحة ومتقنة!' : '🟢 Correct Answer!') : (isAr ? '🔴 إجابة غير صحيحة' : '🔴 Incorrect Answer')}
              </h3>
              <span class="badge ${isCorrect ? 'badge-teal' : 'badge-rust'}" style="font-size: 12px;">
                ${isCorrect ? (isAr ? 'أحسنت!' : 'Well done') : (isAr ? 'تمت جدولتها للمراجعة غداً' : 'Added to tomorrow review')}
              </span>
            </div>

            <!-- Detailed Explanation -->
            <div style="font-size: 14px; line-height: 1.6; color: var(--ink); margin-bottom: 16px;">
              <strong>${isAr ? 'الشرح والتحليل المحاسبي/التشغيلي:' : 'Detailed Explanation:'}</strong>
              <div style="margin-top: 4px;">${escapeHtml(res.explanation || q.explanation || '—')}</div>
            </div>

            <!-- Distractor Analysis (Why others are wrong) -->
            ${(q.distractors && Object.keys(q.distractors).length > 0) ? `
              <div style="margin-bottom: 16px; padding: 12px; background: var(--paper-raised); border-radius: var(--radius-sm); border: 1px solid var(--line);">
                <strong style="font-size: 13px; color: var(--ink-soft); display: block; margin-bottom: 8px;">
                  🔍 ${isAr ? 'تحليل الاختيارات الخاطئة (Distractor Analysis):' : 'Distractor Analysis (Why other options are incorrect):'}
                </strong>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${Object.keys(q.distractors).map(optKey => `
                    <div style="font-size: 12px; color: var(--ink); line-height: 1.4;">
                      <strong style="color: var(--rust);">${escapeHtml(optKey)}:</strong> ${escapeHtml(q.distractors[optKey])}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Official Documentation Reference -->
            ${(q.reference && q.reference.title) ? `
              <div style="margin-bottom: 20px; padding: 10px 14px; background: var(--paper-raised); border-radius: var(--radius-sm); border: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--brass-deep); font-weight: 700;">
                    📚 ${isAr ? 'المصدر والتوثيق الرسمي المعتمد' : 'Verified Official Documentation'}
                  </div>
                  <div style="font-size: 13px; font-weight: 600; color: var(--ink); margin-top: 2px;">
                    ${escapeHtml(q.reference.title)}
                  </div>
                  <div style="font-size: 11px; color: var(--ink-soft);">
                    ${escapeHtml(q.reference.source || '')}
                  </div>
                </div>
                ${q.reference.url ? `
                  <a href="${escapeHtml(q.reference.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 12px; white-space: nowrap;">
                    🔗 ${isAr ? 'فتح التوثيق' : 'Learn More'}
                  </a>
                ` : ''}
              </div>
            ` : ''}

            <!-- Next Question Action Button -->
            <div style="display: flex; justify-content: flex-end;">
              <button id="btn-next-question" class="btn btn-primary" style="padding: 10px 24px; font-weight: 600; font-size: 14px;">
                ${_currentIndex + 1 < _currentChallenge.questions.length ? (isAr ? 'السؤال التالي ➔' : 'Next Question ➔') : (isAr ? 'عرض النتيجة الشاملة 🎉' : 'Complete Challenge 🎉')}
              </button>
            </div>
          </div>
        `;

        const nextBtn = feedbackDrawer.querySelector('#btn-next-question');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (_currentIndex + 1 < _currentChallenge.questions.length) {
              _currentIndex++;
              resetQuestionState();
              renderQuestionCard();
            } else {
              renderCompletionSummary();
            }
          });
        }
      }

    } catch (err) {
      Toast.show(isAr ? 'حدث خطأ أثناء حفظ الإجابة: ' + err.message : 'Error submitting answer: ' + err.message, 'error');
    }
  }

  function renderCompletionSummary() {
    const workspace = document.getElementById('challenge-workspace');
    if (!workspace) return;
    const isAr = I18n.getLang() === 'ar';

    const total = _completedResults.length;
    const correctCount = _completedResults.filter(r => r.correct).length;
    const wrongCount = total - correctCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const totalHints = _completedResults.reduce((acc, r) => acc + (r.hints_used || 0), 0);

    // Identify weak topics from this run
    const weakQuestions = _completedResults.filter(r => !r.correct);

    workspace.innerHTML = `
      <div class="card" style="padding: 32px 24px; text-align: center; max-width: 720px; margin: 0 auto;">
        <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
        <h2 style="font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
          ${isAr ? 'اكتمل التحدي اليومي بنجاح!' : 'Daily Challenge Completed!'}
        </h2>
        <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 24px;">
          ${isAr ? 'تم تحديث مصفوفة الإتقان وجدولة المراجعات المتباعدة تلقائياً في حسابك.' : 'Your topic mastery score and spaced repetition queue have been synchronized.'}
        </p>

        <!-- KPI Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div class="card" style="padding: 16px; background: var(--paper);">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'النتيجة' : 'Score'}</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--brass); margin-top: 4px;">${correctCount} / ${total}</div>
          </div>
          <div class="card" style="padding: 16px; background: var(--paper);">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'الدقة' : 'Accuracy'}</div>
            <div style="font-size: 24px; font-weight: 700; color: ${accuracy >= 80 ? 'var(--teal)' : (accuracy >= 60 ? 'var(--brass)' : 'var(--rust)')}; margin-top: 4px;">${accuracy}%</div>
          </div>
          <div class="card" style="padding: 16px; background: var(--paper);">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'أخطاء للمراجعة' : 'Mistakes'}</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--rust); margin-top: 4px;">${wrongCount}</div>
          </div>
          <div class="card" style="padding: 16px; background: var(--paper);">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'تلميحات مستخدمة' : 'Hints Used'}</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--slate-blue); margin-top: 4px;">${totalHints}</div>
          </div>
        </div>

        <!-- Weak Topics / Review Queue Alert -->
        ${weakQuestions.length > 0 ? `
          <div class="card" style="padding: 16px; text-align: start; margin-bottom: 24px; border-inline-start: 4px solid var(--rust); background: rgba(180, 71, 47, 0.04);">
            <strong style="color: var(--rust); font-size: 14px; display: block; margin-bottom: 8px;">
              ⚠️ ${isAr ? 'مواضيع تحتاج إلى تعزيز ومراجعة غداً:' : 'Topics Requiring Practice (Scheduled for Tomorrow):'}
            </strong>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${weakQuestions.map(w => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--ink);">
                  <span>📌 ${escapeHtml(w.question.topic_id || w.question.category_id || w.question.question.substring(0, 40) + '...')}</span>
                  <span class="badge badge-rust" style="font-size: 11px;">${isAr ? 'مراجعة الغد' : 'Tomorrow'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="card" style="padding: 16px; margin-bottom: 24px; border-inline-start: 4px solid var(--teal); background: rgba(44, 122, 107, 0.04); text-align: start;">
            <strong style="color: var(--teal); font-size: 14px;">🌟 ${isAr ? 'أداء استثنائي! كافة إجاباتك صحيحة دون أخطاء.' : 'Flawless execution! All questions answered accurately.'}</strong>
          </div>
        `}

        <!-- Action Navigation Buttons -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
          <button class="btn btn-primary" onclick="DailyChallenge.loadChallengeData()">
            🔄 ${isAr ? 'بدء تحدي جديد' : 'New Challenge'}
          </button>
          <button class="btn btn-secondary" onclick="Router.navigate('question-bank')">
            📚 ${isAr ? 'استعراض بنك الأسئلة' : 'Explore Question Bank'}
          </button>
          <button class="btn btn-secondary" onclick="Router.navigate('dashboard')">
            📊 ${isAr ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
          </button>
        </div>
      </div>
    `;
  }

  function openReportModal(q) {
    const isAr = I18n.getLang() === 'ar';
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;">
        <div class="card" style="width: 100%; max-width: 480px; padding: 24px; background: var(--paper-raised);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0;">🚩 ${isAr ? 'الإبلاغ عن مشكلة في السؤال' : 'Report Question'}</h3>
            <button id="btn-close-report" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--ink-soft);">&times;</button>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="font-size: 13px; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 6px;">
              ${isAr ? 'سبب الإبلاغ:' : 'Reason:'}
            </label>
            <select id="report-reason-select" class="form-control" style="font-size: 13px;">
              <option value="Incorrect Answer">${isAr ? 'إجابة غير صحيحة' : 'Incorrect Answer'}</option>
              <option value="Ambiguous">${isAr ? 'سؤال غامض أو غير واضح' : 'Ambiguous / Unclear'}</option>
              <option value="Too Easy">${isAr ? 'سهل جداً' : 'Too Easy'}</option>
              <option value="Too Difficult">${isAr ? 'صعب جداً / غير عملي' : 'Too Difficult'}</option>
              <option value="Bad Reference">${isAr ? 'رابط توثيق غير صالح' : 'Bad Reference URL'}</option>
              <option value="Typo">${isAr ? 'خطأ إملائي أو لغوي' : 'Typo / Formatting'}</option>
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="font-size: 13px; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 6px;">
              ${isAr ? 'تفاصيل إضافية (اختياري):' : 'Details (Optional):'}
            </label>
            <textarea id="report-details-text" class="form-control" rows="3" style="font-size: 13px;" placeholder="${isAr ? 'وضح ملاحظتك بالتفصيل...' : 'Explain the issue...'}"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="btn-cancel-report" class="btn btn-secondary">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button id="btn-submit-report" class="btn btn-primary">${isAr ? 'إرسال البلاغ' : 'Submit Report'}</button>
          </div>
        </div>
      </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    modalRoot.querySelector('#btn-close-report').onclick = close;
    modalRoot.querySelector('#btn-cancel-report').onclick = close;

    modalRoot.querySelector('#btn-submit-report').onclick = async () => {
      const reason = modalRoot.querySelector('#report-reason-select').value;
      const details = modalRoot.querySelector('#report-details-text').value;
      try {
        await API.reportQuestion({ question_id: q.id, reason: reason, details: details });
        close();
        Toast.show(isAr ? 'تم استلام بلاغك بنجاح. شكراً لمساهمتك في تحسين جودة الأسئلة.' : 'Report submitted. Thank you for helping improve question quality.', 'success');
      } catch (err) {
        Toast.show(isAr ? 'فشل إرسال البلاغ: ' + err.message : 'Failed to report: ' + err.message, 'error');
      }
    };
  }

  return {
    render,
    loadChallengeData
  };
})();
