# ERP Knowledge & Learning Tracker

Track your understanding of every ERP module — what you know, what you don't,
what you need to learn — plus practical experience and spaced-repetition
review, module by module.

**Stack**
- GitHub Pages → static frontend (this repo)
- Google Apps Script → REST-style API, authentication, sessions, business logic
- Google Sheets → database

No localStorage-as-database, no mock API, no fake data. Every read/write goes
through the real Apps Script backend.

---

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it e.g. `ERP Knowledge Tracker DB`.
2. Copy the spreadsheet ID out of its URL:
   `https://docs.google.com/spreadsheets/d/**THIS_PART**/edit`

You do **not** need to manually create the individual sheets/tabs or headers —
step 4 below does that for you automatically.

## 2. Open the Apps Script editor

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Delete the default `Code.gs` contents.
3. Paste in the full contents of `google-apps-script/Code.gs` from this repo.

## 3. Set the Script Property (SHEET_ID)

The Sheet ID is a secret and must never live in the frontend or in GitHub.

1. In the Apps Script editor, go to **Project Settings** (gear icon).
2. Under **Script Properties**, click **Add script property**.
3. Key: `SHEET_ID` — Value: the spreadsheet ID you copied in step 1.

## 4. Create the sheets, headers, and seed data

1. Back in the Apps Script editor, open `Code.gs`.
2. In the function dropdown at the top, select `setupSpreadsheet`.
3. Click **Run**. The first run will ask you to authorize the script —
   approve it (it only touches the one spreadsheet you created).
4. This creates the `Users`, `Sessions`, `Modules`, `Categories`, `Topics`,
   `Knowledge`, and `Reviews` sheets with the correct headers, and seeds all
   10 modules (Inventory, Accounting, Maintenance, Assets, Transportation,
   HR, Real Estate, Contracting, Fuel Stations, Law Firm) with their
   categories.
5. Open the spreadsheet and confirm the sheets and seed data are there.

## 5. Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Description: `ERP Knowledge Tracker API`.
4. **Execute as:** `Me`.
5. **Who has access:** `Anyone`.
6. Click **Deploy**, then **Authorize access** again if prompted.
7. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXX/exec`

> Whenever you edit `Code.gs` after this, use **Deploy → Manage deployments →
> Edit (pencil) → New version** so the live URL picks up your changes.

## 6. Configure the frontend

1. In this repo, open `config.js`.
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the Web app URL from step 5:

```javascript
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/XXXXXXXX/exec"
};
```

## 7. Push to GitHub and enable GitHub Pages

1. Create a new GitHub repository, e.g. `erp-knowledge-tracker`.
2. Push the contents of this project (everything except
   `google-apps-script/`, which stays in Apps Script, not GitHub — though
   it's harmless to keep a copy in the repo for reference).
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose the branch (e.g. `main`) and root folder `/`.
5. Save. GitHub gives you a URL like
   `https://yourusername.github.io/erp-knowledge-tracker/`.
6. Open that URL — you should see the Sign Up / Log In screen.

## 8. First login and admin access

The **first account you sign up with automatically becomes Admin**. Every
account after that is a regular `User`. You can change roles later directly
in the `Users` sheet if needed (`role` column: `Admin` or `User`).

---

## How the pieces fit together

```
GitHub Pages (index.html, css/, js/, config.js)
        ↓  fetch(API_URL, { method: 'POST', body: JSON })
Google Apps Script Web App (Code.gs)
        ↓  SpreadsheetApp
Google Sheets (Users, Sessions, Modules, Categories, Topics, Knowledge, Reviews)
```

- **Authentication** happens entirely in `Code.gs` — passwords are hashed
  (SHA-256 + per-user salt) before they're ever written to the `Users`
  sheet, and are never sent back to the frontend.
- **Sessions** are random tokens stored in the `Sessions` sheet with an
  expiry (7 days, or 30 with "Remember me"). The frontend sends the token as
  `token` in every request body; the backend re-validates it on every call
  and derives `user_id` from the session — the frontend never gets to assert
  whose data it wants.
- **User isolation**: every row in `Topics`, `Knowledge`, and `Reviews`
  carries a `user_id`. All reads/writes are filtered/scoped to the session's
  `user_id` server-side, so one user can never see or edit another user's
  data by changing an ID in a request.
- Requests use `Content-Type: text/plain` on purpose — this avoids a CORS
  preflight `OPTIONS` request, which Apps Script Web Apps don't handle well.
  The body is still parsed as JSON on the server.

## Project structure

```
erp-knowledge-tracker/
├── index.html              SPA shell (auth screen + app shell)
├── config.js                Frontend config (API_URL only — no secrets)
├── css/
│   └── style.css             Design system, layout, dark mode
├── js/
│   ├── i18n.js                 Centralized EN/AR translation dictionary + RTL
│   ├── api.js                   Fetch wrapper (+ request de-duplication)
│   ├── auth.js                    Sign up / log in / log out / session restore
│   ├── app.js                       UI helpers, global state, router, i18n bootstrap
│   ├── dashboard.js                  Dashboard: KPIs + module gauge cards
│   ├── modules.js                     Per-module dashboard + topics table + categories section
│   ├── categories.js                   Category management: add/edit/delete/toggle (Admin)
│   ├── topics.js                        Topics table, Add/Detail modals, status lifecycle
│   ├── knowledge.js                      Knowledge tab (know / don't know / need to learn, business & ERP understanding, practical experience)
│   ├── reviews.js                         Review Center + per-topic review history
│   ├── analytics.js                        Analytics page
│   └── profile.js                           My Profile + Administration
└── google-apps-script/
    └── Code.gs               Backend: auth, sessions, CRUD, dashboard, analytics
```

## Notes on scope / things you may want to extend

- **Seed demo topics**: each new signup gets one small demo topic
  (Inventory → Stock Valuation) so the UI isn't empty on first login. Every
  other topic is added by the user via "Add Knowledge Gap" / "Quick Add".
- **Global search** (top bar) searches topic name/description across all of
  your modules.
- **Light/Dark mode** toggle is in the top bar and persists per browser.
- **Language (English/Arabic + RTL)**: switch with the EN/AR toggle in the
  top bar (or on the login screen). The choice is saved to your browser
  immediately and, once you're logged in, synced to your account
  (`Users.language`) so it's remembered on your next login from anywhere.
  See `PERFORMANCE_REPORT.md` for how the translation system works.
- **Category management**: each module's page has a "Categories" section.
  Admins can add/edit/deactivate/delete categories there; a category that
  still has topics attached can't be deleted (deactivate it instead). All
  users can see the category list; only Admins can change it, since
  categories are shared reference data across every account.
- **Upgrading from an earlier version of this project**: just paste the
  new `Code.gs` over the old one and redeploy — `ensureSchema()` safely
  adds the new `Categories.description/created_at/updated_at` and
  `Users.language` columns to your existing sheet on the first request,
  without touching any existing data. See `PERFORMANCE_REPORT.md` §8.
- If you want per-field password rules, rate limiting, or email verification
  beyond what's described in the brief, extend `actionSignup` /
  `actionLogin` in `Code.gs` — the brief explicitly excludes OTP/email
  confirmation, so none is implemented.

## Performance

See `PERFORMANCE_REPORT.md` for the full before/after breakdown of Google
Sheets calls, the caching layers added, and what was deferred/lazy-loaded
on the frontend.
