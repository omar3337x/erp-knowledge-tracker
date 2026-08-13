/**
 * js/profile.js
 * My Profile (view/edit name & email & language, change password) and,
 * for Admins, the Administration page. Reuses the Dashboard's aggregated
 * response for the user's own summary instead of a separate currentUser
 * call, to keep this page to a single request.
 */

const Profile = (function () {

  async function render(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let dash;
    try {
      dash = await API.dashboard(); // includes publicUser() — no separate currentUser() call needed
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }
    const user = dash.user;

    container.innerHTML = `
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:18px; align-items:start;">
        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('profile.account')}</h3>
          <div class="field-hint" style="margin-bottom:14px;">
            ${I18n.t('profile.overallProgress')}: <strong class="mono">${dash.kpis.overall_progress}%</strong> ·
            ${I18n.t('profile.accountCreated')}: <span class="mono">${UI.fmtDate(user.created_at)}</span> ·
            ${I18n.t('profile.lastLogin')}: <span class="mono">${UI.fmtDate(user.last_login)}</span>
          </div>
          <form id="profile-form">
            <div class="field"><label>${I18n.t('profile.fullName')}</label><input name="full_name" value="${Topics.escapeHtml(user.full_name)}" required></div>
            <div class="field"><label>${I18n.t('profile.username')}</label><input value="${Topics.escapeHtml(user.username)}" disabled></div>
            <div class="field"><label>${I18n.t('profile.email')}</label><input name="email" type="email" value="${Topics.escapeHtml(user.email)}" required></div>
            <div class="field">
              <label>${I18n.t('profile.language')}</label>
              <select name="language">
                <option value="en" ${user.language !== 'ar' ? 'selected' : ''}>English</option>
                <option value="ar" ${user.language === 'ar' ? 'selected' : ''}>العربية</option>
              </select>
            </div>
            <div class="field checkbox-row" style="margin-top:10px; margin-bottom:14px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <input type="checkbox" id="digest-enabled-cb" name="digest_enabled" ${user.digest_enabled !== false && user.digest_enabled !== 'FALSE' ? 'checked' : ''}>
              <label for="digest-enabled-cb" style="margin:0;">📧 ${I18n.t('digest.receiveWeeklyDigest')}</label>
              <button type="button" class="btn btn-secondary btn-sm" id="send-test-digest-profile-btn" style="margin-inline-start:auto;">
                📧 ${I18n.t('digest.sendTestDigest')}
              </button>
            </div>
            <button type="submit" class="btn btn-primary">${I18n.t('profile.saveChanges')}</button>
          </form>
        </div>

        <div style="display:flex; flex-direction:column; gap:18px;">
          <div class="card">
            <h3 style="margin-bottom:14px;">${I18n.t('profile.changePassword')}</h3>
            <form id="password-form">
              <div class="field"><label>${I18n.t('profile.currentPassword')}</label><input name="current_password" type="password" required></div>
              <div class="field"><label>${I18n.t('profile.newPassword')}</label><input name="new_password" type="password" required minlength="8"></div>
              <div class="field"><label>${I18n.t('profile.confirmNewPassword')}</label><input name="confirm_password" type="password" required minlength="8"></div>
              <button type="submit" class="btn btn-primary">${I18n.t('profile.changePassword')}</button>
            </form>
          </div>

          <!-- Feature 5: Full Data Export & Backup (JSON) -->
          <div class="card">
            <h3 style="margin-bottom:12px;">💾 ${I18n.t('backup.title')}</h3>
            <p style="font-size:13px; color:var(--ink-soft); margin-bottom:14px;">${I18n.getLang() === 'ar' ? 'يمكنك تصدير كافة بياناتك كملف JSON أوفلاين أو استعادتها في أي وقت.' : 'Export all your topics, knowledge, notes and streaks as a backup JSON file.'}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btn-secondary" id="export-backup-btn">📥 ${I18n.t('backup.exportData')}</button>
              <button class="btn btn-secondary" id="import-backup-btn">📤 ${I18n.t('backup.importData')}</button>
              <input type="file" id="import-backup-file-input" accept=".json" style="display:none;">
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      payload.digest_enabled = container.querySelector('#digest-enabled-cb').checked;
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const updated = await API.updateProfile(payload);
        State.currentUser = updated;
        if (updated.language !== I18n.getLang()) I18n.setLang(updated.language);
        UI.toast(I18n.t('toast.profileUpdated'), 'success');
      } catch (err) { UI.toastError(err); }
      finally { btn.disabled = false; }
    });

    container.querySelector('#password-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      try {
        await API.changePassword(Object.fromEntries(fd.entries()));
        UI.toast(I18n.t('toast.passwordChanged'), 'success');
        e.target.reset();
      } catch (err) { UI.toastError(err); }
      finally { btn.disabled = false; }
    });

    const testDigestProfileBtn = container.querySelector('#send-test-digest-profile-btn');
    if (testDigestProfileBtn) {
      testDigestProfileBtn.addEventListener('click', async () => {
        testDigestProfileBtn.disabled = true;
        UI.toast(I18n.getLang() === 'ar' ? 'جاري إرسال البريد التجريبي...' : 'Sending test email...', 'info');
        try {
          await API.sendTestDigest();
          UI.toast(I18n.t('digest.testDigestSent'), 'success');
        } catch (err) { UI.toastError(err); }
        finally { testDigestProfileBtn.disabled = false; }
      });
    }

    // Feature 5: Export & Import Handlers
    const exportBtn = container.querySelector('#export-backup-btn');
    const importBtn = container.querySelector('#import-backup-btn');
    const fileInput = container.querySelector('#import-backup-file-input');

    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        exportBtn.disabled = true;
        UI.toast(I18n.getLang() === 'ar' ? 'جاري تجهيز النسخة الاحتياطية...' : 'Preparing backup...', 'info');
        try {
          const data = await API.exportMyData();
          const jsonStr = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `erp-backup-${new Date().toISOString().slice(0,10)}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          UI.toast(I18n.getLang() === 'ar' ? 'تمت عملية التصدير بنجاح' : 'Backup exported successfully', 'success');
        } catch (err) { UI.toastError(err); }
        finally { exportBtn.disabled = false; }
      });
    }

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (!confirm(I18n.t('backup.importConfirm'))) return;

            UI.toast(I18n.getLang() === 'ar' ? 'جاري استعادة البيانات...' : 'Importing data...', 'info');
            await API.importMyData(parsed);
            UI.toast(I18n.t('backup.importSuccess'), 'success');
            setTimeout(() => Router.reload(), 1000);
          } catch (err) {
            UI.toast(I18n.t('backup.importError'), 'error');
          }
        };
        reader.readAsText(file);
      });
    }
  }

  async function renderAdmin(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let data;
    let aiSettings = { endpoint: 'https://router.bynara.id/v1', model: 'gemini-3.6-medium', masked_key: '••••••••••••••••', daily_count: 5, enabled: true };
    try {
      [data, aiSettings] = await Promise.all([
        API.adminUsers(),
        API.getAISettings().catch(() => aiSettings)
      ]);
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="margin:0;">${I18n.t('admin.title')}</h2>
        <button class="btn btn-secondary btn-sm" id="send-test-digest-btn">📧 ${I18n.t('digest.sendTestDigest')}</button>
      </div>

      <div class="grid grid-kpi" style="margin-bottom:24px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.totalUsers')}</div><div class="kpi-value">${data.total_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.activeUsers')}</div><div class="kpi-value teal">${data.active_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.newUsers')}</div><div class="kpi-value brass">${data.new_users}</div></div>
      </div>

      <!-- AI Settings Section -->
      <div class="card" style="margin-bottom:24px;">
        <h3 style="margin-bottom:12px; display:flex; align-items:center; gap:8px;">✨ ${I18n.t('aiSettings.title')}</h3>
        <form id="ai-settings-form">
          <div class="grid" style="grid-template-columns:1fr 1fr; gap:14px;">
            <div class="field">
              <label>${I18n.t('aiSettings.apiEndpoint')}</label>
              <input name="api_endpoint" value="${Topics.escapeHtml(aiSettings.endpoint || 'https://router.bynara.id/v1')}" required>
            </div>
            <div class="field">
              <label>${I18n.t('aiSettings.model')}</label>
              <input name="model" value="${Topics.escapeHtml(aiSettings.model || 'gemini-3.6-medium')}" required>
            </div>
          </div>

          <div class="grid" style="grid-template-columns:1fr 1fr; gap:14px; margin-top:10px;">
            <div class="field">
              <label>${I18n.t('aiSettings.apiKey')}</label>
              <input name="api_key" type="password" placeholder="${aiSettings.masked_key || 'Leave blank to keep unchanged'}" autocomplete="off">
              <small class="field-hint">${I18n.t('aiSettings.apiKeyHint')}</small>
            </div>
            <div class="field">
              <label>${I18n.t('aiSettings.dailyCount')}</label>
              <input name="daily_count" type="number" min="1" max="10" value="${aiSettings.daily_count || 5}" required>
            </div>
          </div>

          <div class="field checkbox-row" style="margin-top:12px; margin-bottom:16px;">
            <input type="checkbox" id="ai-enabled-cb" name="enabled" ${aiSettings.enabled !== false ? 'checked' : ''}>
            <label for="ai-enabled-cb" style="margin:0;">✨ ${I18n.t('aiSettings.enableAI')}</label>
          </div>

          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button type="submit" class="btn btn-primary">${I18n.t('profile.saveChanges')}</button>
            <button type="button" class="btn btn-secondary" id="btn-test-ai-conn">🔌 ${I18n.t('aiSettings.testConnection')}</button>
          </div>
        </form>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>${I18n.t('admin.name')}</th><th>${I18n.t('admin.username')}</th><th>${I18n.t('admin.role')}</th><th>${I18n.t('admin.progress')}</th><th>${I18n.t('admin.topics')}</th><th>${I18n.t('admin.lastLogin')}</th></tr></thead>
          <tbody>
            ${data.users.map(u => `
              <tr>
                <td>${Topics.escapeHtml(u.full_name)}</td>
                <td class="mono">${u.username}</td>
                <td>${u.role}</td>
                <td class="mono">${u.overall_progress}%</td>
                <td class="mono">${u.total_topics}</td>
                <td class="mono">${UI.fmtDate(u.last_login)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const testDigestBtn = container.querySelector('#send-test-digest-btn');
    if (testDigestBtn) {
      testDigestBtn.addEventListener('click', async () => {
        testDigestBtn.disabled = true;
        UI.toast(I18n.getLang() === 'ar' ? 'جاري إرسال البريد التجريبي...' : 'Sending test email...', 'info');
        try {
          await API.sendTestDigest();
          UI.toast(I18n.t('digest.testDigestSent'), 'success');
        } catch (err) { UI.toastError(err); }
        finally { testDigestBtn.disabled = false; }
      });
    }

    const aiForm = container.querySelector('#ai-settings-form');
    if (aiForm) {
      aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(aiForm);
        const payload = Object.fromEntries(fd.entries());
        payload.enabled = container.querySelector('#ai-enabled-cb').checked;
        const btn = aiForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
          await API.updateAISettings(payload);
          UI.toast(I18n.t('aiSettings.saveSuccess'), 'success');
        } catch (err) { UI.toastError(err); }
        finally { btn.disabled = false; }
      });
    }

    const testAiBtn = container.querySelector('#btn-test-ai-conn');
    if (testAiBtn) {
      testAiBtn.addEventListener('click', async () => {
        testAiBtn.disabled = true;
        UI.toast(I18n.t('aiSettings.connectionTesting'), 'info');
        try {
          await API.testAIConnection();
          UI.toast(I18n.t('aiSettings.connectionSuccess'), 'success');
        } catch (err) { UI.toastError(err); }
        finally { testAiBtn.disabled = false; }
      });
    }
  }

  return { render, renderAdmin };
})();
