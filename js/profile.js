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
            <button type="submit" class="btn btn-primary">${I18n.t('profile.saveChanges')}</button>
          </form>
        </div>

        <div class="card">
          <h3 style="margin-bottom:14px;">${I18n.t('profile.changePassword')}</h3>
          <form id="password-form">
            <div class="field"><label>${I18n.t('profile.currentPassword')}</label><input name="current_password" type="password" required></div>
            <div class="field"><label>${I18n.t('profile.newPassword')}</label><input name="new_password" type="password" required minlength="8"></div>
            <div class="field"><label>${I18n.t('profile.confirmNewPassword')}</label><input name="confirm_password" type="password" required minlength="8"></div>
            <button type="submit" class="btn btn-primary">${I18n.t('profile.changePassword')}</button>
          </form>
        </div>
      </div>
    `;

    container.querySelector('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      const btn = e.target.querySelector('button');
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
  }

  async function renderAdmin(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> ${I18n.t('common.loading')}</div>`;
    let data;
    try {
      data = await API.adminUsers();
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }
    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.totalUsers')}</div><div class="kpi-value">${data.total_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.activeUsers')}</div><div class="kpi-value teal">${data.active_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('admin.newUsers')}</div><div class="kpi-value brass">${data.new_users}</div></div>
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
  }

  return { render, renderAdmin };
})();
