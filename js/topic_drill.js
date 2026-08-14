/**
 * js/topic_drill.js
 * 🎯 Focused Topic Mastery Drill & Weak Concept Deep Dive
 */

const TopicDrill = (function () {
  let _activeTopicId = '';

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

    const route = Router.getRoute();
    _activeTopicId = route.params && route.params.id ? route.params.id : '';

    container.innerHTML = `
      <div class="topic-drill-page" style="max-width: 900px; margin: 0 auto; padding: 20px 16px;">
        <!-- Header -->
        <div class="card" style="padding: 20px; margin-bottom: 20px; border-inline-start: 4px solid var(--brass);">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-size: 18px; font-weight: 700; color: var(--ink); margin: 0;">
                  🎯 ${isAr ? 'معمل تدريب وإتقان الموضوع (Topic Mastery Drill)' : 'Topic Mastery Drill'}
                </h1>
                <span class="badge badge-brass" style="font-size: 11px;">Focus Mode</span>
              </div>
              <p style="font-size: 13px; color: var(--ink-soft); margin: 4px 0 0 0;">
                ${isAr ? 'تحليل الأخطاء السابقة والتدريب المركز لرفع نسبة الدقة والإتقان.' : 'Deep dive into mistakes and targeted practice to elevate topic mastery.'}
              </p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="history.back()">
              ← ${isAr ? 'رجوع' : 'Back'}
            </button>
          </div>
        </div>

        <div id="topic-drill-content">
          <div class="card" style="padding: 40px; text-align: center;">
            <div class="spinner" style="margin: 0 auto 12px auto;"></div>
            <p style="color: var(--ink-soft); font-size: 14px;">${isAr ? 'جارٍ تحليل أداء الموضوع...' : 'Analyzing topic performance...'}</p>
          </div>
        </div>
      </div>
    `;

    if (_activeTopicId) {
      await loadTopicDrillData();
    } else {
      document.getElementById('topic-drill-content').innerHTML = `
        <div class="card" style="padding: 30px; text-align: center;">
          <p style="color: var(--ink-soft);">${isAr ? 'يرجى اختيار موضوع لبدء التدريب المركز.' : 'Please select a topic to start mastery drill.'}</p>
          <button class="btn btn-primary" onclick="Router.navigate('topics')">${isAr ? 'استعراض المواضيع' : 'Browse Topics'}</button>
        </div>
      `;
    }
  }

  async function loadTopicDrillData() {
    const contentEl = document.getElementById('topic-drill-content');
    if (!contentEl) return;
    const isAr = I18n.getLang() === 'ar';

    try {
      const res = await API.getTopicDrill(_activeTopicId);
      const perf = res && res.performance;
      const wrongAttempts = (res && res.wrong_attempts) || [];
      const questions = (res && res.questions) || [];

      const accuracy = perf ? Number(perf.accuracy_pct) || 0 : 0;
      const mastery = perf ? Number(perf.mastery_score) || 0 : 0;
      const totalAttempts = res.total_attempts || 0;

      contentEl.innerHTML = `
        <!-- Topic Performance Summary -->
        <div class="card" style="padding: 20px; margin-bottom: 20px;">
          <h2 style="font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 14px;">
            📊 ${isAr ? 'مؤشرات الأداء والإتقان للموضوع' : 'Topic Performance & Mastery Score'}
          </h2>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 16px;">
            <div class="card" style="padding: 14px; background: var(--paper); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'درجة الإتقان' : 'Mastery Score'}</div>
              <div style="font-size: 22px; font-weight: 700; color: ${mastery >= 80 ? 'var(--teal)' : 'var(--brass)'}; margin-top: 4px;">${mastery}%</div>
            </div>
            <div class="card" style="padding: 14px; background: var(--paper); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'نسبة الدقة' : 'Accuracy'}</div>
              <div style="font-size: 22px; font-weight: 700; color: ${accuracy >= 80 ? 'var(--teal)' : (accuracy >= 60 ? 'var(--brass)' : 'var(--rust)')}; margin-top: 4px;">${accuracy}%</div>
            </div>
            <div class="card" style="padding: 14px; background: var(--paper); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'إجمالي المحاولات' : 'Total Attempts'}</div>
              <div style="font-size: 22px; font-weight: 700; color: var(--ink); margin-top: 4px;">${totalAttempts}</div>
            </div>
            <div class="card" style="padding: 14px; background: var(--paper); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); font-weight: 700;">${isAr ? 'أخطاء مسجلة' : 'Mistakes'}</div>
              <div style="font-size: 22px; font-weight: 700; color: var(--rust); margin-top: 4px;">${wrongAttempts.length}</div>
            </div>
          </div>
        </div>

        <!-- Previous Wrong Questions -->
        ${wrongAttempts.length > 0 ? `
          <div class="card" style="padding: 20px; margin-bottom: 20px; border-inline-start: 4px solid var(--rust); background: rgba(180, 71, 47, 0.03);">
            <h3 style="font-size: 15px; font-weight: 700; color: var(--rust); margin-bottom: 10px;">
              ⚠️ ${isAr ? 'أخطاء ومفاهيم بحاجة إلى مراجعة' : 'Mistakes & Misconceptions'}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${wrongAttempts.map(w => `
                <div style="font-size: 13px; color: var(--ink); padding: 8px 12px; background: var(--paper-raised); border-radius: var(--radius-sm); border: 1px solid var(--line);">
                  <div><strong>${isAr ? 'إجابتك السابقة:' : 'Your previous answer:'}</strong> <span style="color: var(--rust);">${escapeHtml(w.answer)}</span></div>
                  <div style="font-size: 11px; color: var(--ink-soft); margin-top: 2px;">📅 ${new Date(w.created_at).toLocaleDateString()}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Practice Questions for Topic -->
        <div class="card" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 16px; font-weight: 700; color: var(--ink); margin: 0;">
              🧠 ${isAr ? 'أسئلة تدريبية مباشرة على هذا الموضوع' : 'Practice Questions on this Topic'}
            </h3>
            <button class="btn btn-primary btn-sm" onclick="Router.navigate('daily-challenge')">
              ${isAr ? 'بدء التحدي الشامل' : 'Start Full Challenge'}
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${questions.map((q, idx) => `
              <div class="card" style="padding: 14px 16px; background: var(--paper);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12px; font-weight: 700; color: var(--brass-deep);">#${idx + 1} (${escapeHtml(q.difficulty)})</span>
                  <span class="badge badge-teal" style="font-size: 11px;">✓ ${escapeHtml(q.correct_answer)}</span>
                </div>
                <div style="font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 6px;">
                  ${escapeHtml(q.question)}
                </div>
                <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.4;">
                  ${escapeHtml(q.explanation || '')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    } catch (err) {
      contentEl.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; border-inline-start: 4px solid var(--rust);">
          <p style="color: var(--rust); font-size: 13px;">${isAr ? 'فشل تحميل بيانات تدريب الموضوع: ' + err.message : 'Error loading topic drill: ' + err.message}</p>
        </div>
      `;
    }
  }

  return {
    render
  };
})();
