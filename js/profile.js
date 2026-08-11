/**
 * js/profile.js
 * My Profile (view/edit name & email, change password) and, for Admins,
 * the Administration page (user list + progress overview).
 */

const Profile = (function () {

  async function render(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading profile...</div>`;
    let user, dash;
    try {
      [user, dash] = await Promise.all([API.currentUser(), API.dashboard()]);
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }

    container.innerHTML = `
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:18px; align-items:start;">
        <div class="card">
          <h3 style="margin-bottom:14px;">Account</h3>
          <div class="field-hint" style="margin-bottom:14px;">
            Overall Progress: <strong class="mono">${dash.kpis.overall_progress}%</strong> ·
            Account Created: <span class="mono">${UI.fmtDate(user.created_at)}</span> ·
            Last Login: <span class="mono">${UI.fmtDate(user.last_login)}</span>
          </div>
          <form id="profile-form">
            <div class="field"><label>Full Name</label><input name="full_name" value="${Topics.escapeHtml(user.full_name)}" required></div>
            <div class="field"><label>Username</label><input value="${Topics.escapeHtml(user.username)}" disabled></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${Topics.escapeHtml(user.email)}" required></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>

        <div class="card">
          <h3 style="margin-bottom:14px;">Change Password</h3>
          <form id="password-form">
            <div class="field"><label>Current Password</label><input name="current_password" type="password" required></div>
            <div class="field"><label>New Password</label><input name="new_password" type="password" required minlength="8"></div>
            <div class="field"><label>Confirm New Password</label><input name="confirm_password" type="password" required minlength="8"></div>
            <button type="submit" class="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    `;

    container.querySelector('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      try {
        const updated = await API.updateProfile(Object.fromEntries(fd.entries()));
        State.currentUser = updated;
        UI.toast('Profile updated successfully', 'success');
      } catch (err) { UI.toast(err.message, 'error'); }
      finally { btn.disabled = false; }
    });

    container.querySelector('#password-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      try {
        await API.changePassword(Object.fromEntries(fd.entries()));
        UI.toast('Password changed successfully', 'success');
        e.target.reset();
      } catch (err) { UI.toast(err.message, 'error'); }
      finally { btn.disabled = false; }
    });
  }

  async function renderAdmin(container) {
    container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Loading administration...</div>`;
    let data;
    try {
      data = await API.adminUsers();
    } catch (err) {
      container.innerHTML = UI.errorState(err.message);
      return;
    }
    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">Total Users</div><div class="kpi-value">${data.total_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Active Users</div><div class="kpi-value teal">${data.active_users}</div></div>
        <div class="card kpi-card"><div class="kpi-label">New Users (30d)</div><div class="kpi-value brass">${data.new_users}</div></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Progress</th><th>Topics</th><th>Last Login</th></tr></thead>
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
