/**
 * js/ai_chat.js
 * Global Floating AI Tutor Chatbot Widget.
 * Context-aware AI assistant available across all pages.
 */

const AIChat = (function () {
  const CHAT_CACHE_KEY = 'erp_ai_chat_history_v1';

  function getSavedHistory() {
    try {
      const raw = localStorage.getItem(CHAT_CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(history.slice(-20))); // Keep last 20 messages
    } catch (e) {}
  }

  function init() {
    let container = document.getElementById('ai-chat-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ai-chat-root';
      document.body.appendChild(container);
    }

    const isAr = I18n.getLang() === 'ar';

    container.innerHTML = `
      <!-- Floating Toggle Button -->
      <button id="ai-chat-toggle-btn" class="btn btn-primary" style="position:fixed; bottom:20px; ${isAr ? 'left:20px;' : 'right:20px;'} z-index:9990; border-radius:50px; padding:12px 20px; box-shadow:0 8px 24px rgba(0,0,0,0.3); font-weight:700; display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px;">🤖</span>
        <span>${isAr ? 'اسأل مساعد ERP الذكي' : 'Ask ERP AI Tutor'}</span>
      </button>

      <!-- Chat Drawer -->
      <div id="ai-chat-drawer" style="display:none; position:fixed; bottom:80px; ${isAr ? 'left:20px;' : 'right:20px;'} width:380px; max-width:calc(100vw - 40px); height:520px; max-height:calc(100vh - 120px); background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-lg); box-shadow:0 12px 32px rgba(0,0,0,0.35); z-index:9995; flex-direction:column; overflow:hidden;">
        <!-- Header -->
        <div style="padding:14px 16px; background:var(--surface-subtle); border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">🤖</span>
            <div>
              <strong style="display:block; font-size:14px; color:var(--ink);">${isAr ? 'مساعد الـ ERP الذكي' : 'ERP AI Tutor'}</strong>
              <small id="ai-chat-context-badge" style="font-size:10px; color:var(--ink-soft); font-family:var(--font-mono);"></small>
            </div>
          </div>

          <div style="display:flex; gap:6px;">
            <button id="ai-chat-clear-btn" class="btn btn-sm btn-ghost" title="${isAr ? 'مسح المحادثة' : 'Clear Chat'}" style="padding:4px 8px;">🗑️</button>
            <button id="ai-chat-close-btn" class="btn btn-sm btn-ghost" style="padding:4px 8px;">✕</button>
          </div>
        </div>

        <!-- Messages Box -->
        <div id="ai-chat-messages" style="flex:1; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; font-size:13px; line-height:1.5;">
        </div>

        <!-- Input Box -->
        <div style="padding:12px 14px; border-top:1px solid var(--line); background:var(--surface-subtle); display:flex; gap:8px;">
          <input type="text" id="ai-chat-input" class="field" placeholder="${isAr ? 'اكتب سؤالك عن الـ ERP أو العملية الحالية...' : 'Ask your ERP question...'}" style="margin:0; flex:1; padding:8px 12px; font-size:13px;">
          <button id="ai-chat-send-btn" class="btn btn-primary" style="padding:8px 14px; flex-shrink:0;">${isAr ? 'إرسال' : 'Send'}</button>
        </div>
      </div>
    `;

    bindEvents();
    renderHistory();
  }

  function bindEvents() {
    const toggleBtn = document.getElementById('ai-chat-toggle-btn');
    const closeBtn = document.getElementById('ai-chat-close-btn');
    const clearBtn = document.getElementById('ai-chat-clear-btn');
    const drawer = document.getElementById('ai-chat-drawer');
    const sendBtn = document.getElementById('ai-chat-send-btn');
    const input = document.getElementById('ai-chat-input');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = drawer.style.display === 'none';
        drawer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
          updateContextBadge();
          if (input) input.focus();
        }
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.style.display = 'none';
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem(CHAT_CACHE_KEY);
        renderHistory();
      });
    }

    if (sendBtn && input) {
      const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        sendMessage(text);
      };

      sendBtn.addEventListener('click', handleSend);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

  function getActiveContext() {
    let route = 'dashboard';
    let params = {};
    if (typeof Router !== 'undefined') {
      const decoded = Router.decodeHash ? Router.decodeHash() : (Router.getRoute ? Router.getRoute() : null);
      if (decoded && typeof decoded === 'object') {
        route = decoded.route || 'dashboard';
        params = decoded.params || {};
      } else if (typeof decoded === 'string') {
        route = decoded;
      }
    }
    return { route, params, moduleId: params.id || null, categoryId: params.categoryId || null, topicId: params.topicId || null };
  }

  function updateContextBadge() {
    const badge = document.getElementById('ai-chat-context-badge');
    if (!badge) return;
    const isAr = I18n.getLang() === 'ar';

    const ctxInfo = getActiveContext();
    const modId = ctxInfo.moduleId || 'MOD-1';

    const ctx = AIService.buildModuleContext(modId, ctxInfo.categoryId, ctxInfo.topicId);
    badge.textContent = `📍 ${ctx.module_name} (${ctx.user_level})`;
  }

  function renderHistory() {
    const box = document.getElementById('ai-chat-messages');
    if (!box) return;
    const isAr = I18n.getLang() === 'ar';
    const history = getSavedHistory();

    if (!history.length) {
      box.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--ink-soft);">
          <span style="font-size:32px; display:block; margin-bottom:8px;">💡</span>
          <strong>${isAr ? 'مرحباً بك في مساعد الـ ERP الذكي!' : 'Welcome to ERP AI Tutor!'}</strong>
          <p style="margin-top:6px; font-size:12px; color:var(--ink-soft);">${isAr ? 'يمكنك السؤال عن أي عملية أو قيد أو موديول وسأجيبك فورياً.' : 'Ask any question about ERP modules, G/L entries, or business processes.'}</p>
        </div>
      `;
      return;
    }

    box.innerHTML = history.map(msg => `
      <div style="align-self:${msg.role === 'user' ? 'flex-end' : 'flex-start'}; max-width:85%; padding:10px 14px; border-radius:12px; ${msg.role === 'user' ? 'background:var(--brass); color:#1C1204; font-weight:600;' : 'background:var(--line-soft); color:var(--ink); border:1px solid var(--line);'}">
        ${msg.role === 'user' ? msg.text : AIService.formatMarkdown(msg.text)}
      </div>
    `).join('');

    box.scrollTop = box.scrollHeight;
  }

  async function sendMessage(text) {
    const box = document.getElementById('ai-chat-messages');
    if (!box) return;

    const history = getSavedHistory();
    history.push({ role: 'user', text: text });
    saveHistory(history);
    renderHistory();

    // Render loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = 'align-self:flex-start; max-width:85%; padding:10px 14px; border-radius:12px; background:var(--line-soft); color:var(--ink-soft); font-style:italic;';
    loadingDiv.innerHTML = '🧠 <em>جاري التفكير وتحليل الإجابة...</em>';
    box.appendChild(loadingDiv);
    box.scrollTop = box.scrollHeight;

    const ctxInfo = getActiveContext();
    const res = await AIService.ask('tutor', text, {
      moduleId: ctxInfo.moduleId || 'MOD-1',
      categoryId: ctxInfo.categoryId,
      topicId: ctxInfo.topicId
    });

    if (loadingDiv.parentNode) loadingDiv.parentNode.removeChild(loadingDiv);

    let answer = '';
    if (res.success && res.text) {
      answer = res.text;
    } else {
      answer = I18n.getLang() === 'ar'
        ? 'عذراً، لم أتمكن من الاتصال بمحرك الذكاء الاصطناعي الآن. يمكنك المحاولة لاحقاً.'
        : 'Sorry, unable to connect to AI engine at the moment.';
    }

    history.push({ role: 'assistant', text: answer });
    saveHistory(history);
    renderHistory();
  }

  return { init, updateContextBadge };
})();
