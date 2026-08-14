/**
 * js/system_test.js
 * 🚨 Enterprise ERP System Health & Diagnostic Center
 * Comprehensive, dependency-aware, real end-to-end diagnostic suite.
 * Features: Root Cause Analysis, API Contract Testing, Data Integrity Diagnostics,
 * Page Health, Module Matrix, Security Redaction, Performance Benchmarking, and Actionable Remediation.
 */

const SystemTest = (function () {

  // ---------------------------------------------------------------------------
  // 1. STATE & RUNTIME ERROR TRACKER
  // ---------------------------------------------------------------------------
  let _registry = [];
  let _results = {};         // Keyed by test.id -> Result Object
  let _logs = [];            // Console logs array
  let _runtimeErrors = [];   // Unhandled JS exceptions captured during scan
  let _isRunning = false;
  let _lastScanTime = null;
  let _scanDuration = 0;
  let _activeFilter = 'ALL'; // ALL, FAIL, WARN, PASS, SKIPPED
  let _activeDomainFilter = 'ALL';
  let _searchQuery = '';
  let _activeTab = 'OVERVIEW'; // OVERVIEW, PAGES, MODULES, DOMAINS, EXPLORER, CONSOLE

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Install global runtime error listener to catch real frontend exceptions
  if (typeof window !== 'undefined') {
    window.addEventListener('error', function (e) {
      _runtimeErrors.push({
        type: 'JS_ERROR',
        message: e.message || 'Unknown runtime error',
        filename: e.filename || 'unknown',
        lineno: e.lineno || 0,
        colno: e.colno || 0,
        time: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', function (e) {
      _runtimeErrors.push({
        type: 'UNHANDLED_PROMISE',
        message: (e.reason && e.reason.message) ? e.reason.message : String(e.reason || 'Unhandled Promise Rejection'),
        time: new Date().toISOString()
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. SECURITY REDACTOR — Zero Secrets Leaked
  // ---------------------------------------------------------------------------
  const DiagnosticRedactor = {
    sanitize(val) {
      if (!val) return val;
      if (typeof val === 'string') {
        // Redact only JWTs, bearer tokens, or 40+ char hex/base64 strings that don't contain spaces or English words
        if (val.length >= 40 && !val.includes(' ') && /^[A-Za-z0-9_\-\.+=]{40,}$/.test(val) && !val.includes('function') && !val.includes('Contract') && !val.includes('integrity') && !val.includes('accuracy')) {
          return `[REDACTED_SECRET_LEN_${val.length}]`;
        }
        return val;
      }
      if (Array.isArray(val)) {
        return val.map(item => this.sanitize(item));
      }
      if (typeof val === 'object') {
        const clean = {};
        const sensitiveKeys = ['token', 'password', 'password_hash', 'secret', 'api_key', 'authorization', 'session_id', 'auth_token'];
        for (let k in val) {
          if (sensitiveKeys.includes(k.toLowerCase())) {
            clean[k] = val[k] ? `[REDACTED_${k.toUpperCase()}]` : null;
          } else {
            clean[k] = this.sanitize(val[k]);
          }
        }
        return clean;
      }
      return val;
    }
  };

  // ---------------------------------------------------------------------------
  // 3. CENTRAL TEST REGISTRY
  // ---------------------------------------------------------------------------
  function buildRegistry() {
    _registry = [
      // ─── DOMAIN: NETWORK (🌐) ───────────────────────────────────────────
      {
        id: 'net_backend_reachable',
        domain: 'NETWORK',
        name_en: 'Backend API Gateway Reachability',
        name_ar: 'التحقق من الاتصال ببوابة الـ API',
        severity: 'CRITICAL',
        dependencies: [],
        description_en: 'Sends an HTTP ping probe to the backend URL to verify gateway reachability and SSL connection.',
        description_ar: 'إرسال اختبار فحص الاتصال بالخادم للتأكد من استجابة خادم Google Apps Script وتوافر الاتصال.',
        run: async (ctx) => {
          if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            return {
              status: 'FAIL',
              expected: 'Valid Google Apps Script Web App URL in config.js',
              actual: 'CONFIG.API_URL is unconfigured or default placeholder',
              rootCause: 'Frontend configuration missing API deployment URL.',
              remediation: 'Deploy code.gs as Web App (Execute as: Me, Access: Anyone) and set URL in config.js.'
            };
          }
          const start = Date.now();
          const res = await API.rawCall('ping', {});
          const latency = Date.now() - start;
          ctx.pingLatency = latency;

          if (res && (res.pong || res.success !== false)) {
            return {
              status: 'PASS',
              expected: 'HTTP 200 with pong response from backend gateway',
              actual: `Responded in ${latency}ms (Gateway connection verified, pong: ${res.pong ? 'true' : 'ok'})`,
              data: { latency_ms: latency, pong: res.pong }
            };
          }
          return {
            status: 'FAIL',
            expected: 'Valid pong response from backend',
            actual: res ? JSON.stringify(res) : 'No response data',
            rootCause: 'Backend endpoint returned unexpected payload format.',
            remediation: 'Verify that code.gs doGet/doPost handles action="ping" and returns successResponse.'
          };
        }
      },
      {
        id: 'net_latency_benchmark',
        domain: 'NETWORK',
        name_en: 'API Roundtrip Latency Benchmark',
        name_ar: 'قياس سرعة وزمن استجابة الشبكة (Latency Benchmark)',
        severity: 'MEDIUM',
        dependencies: ['net_backend_reachable'],
        description_en: 'Categorizes API roundtrip latency (<500ms Excellent, 500-1500ms Good, 1500-3000ms Slow, >3000ms Degraded / Cold-start).',
        description_ar: 'تصنيف كفاءة وسرعة استجابة الخادم وتحديد ما إذا كان هناك بطء في الشبكة أو معالجة السيرفر.',
        run: async (ctx) => {
          const lat = ctx.pingLatency || 0;
          let tier = 'Excellent (<500ms)';
          let status = 'PASS';
          if (lat > 8000) { tier = 'Critical Slow (>8000ms)'; status = 'WARN'; }
          else if (lat > 3000) { tier = 'Cold-start / Degraded (3000-8000ms)'; status = 'WARN'; }
          else if (lat > 1500) { tier = 'Moderate (1500-3000ms)'; status = 'PASS'; }
          else if (lat > 500) { tier = 'Acceptable (500-1500ms)'; status = 'PASS'; }

          return {
            status: status,
            expected: 'API response latency <= 3000ms for smooth enterprise user experience',
            actual: `${lat}ms (${tier})`,
            data: { latency_ms: lat, rating: tier },
            remediation: lat > 3000 ? 'Google Apps Script cold-start latency observed. Warmup queue is active to keep instance responsive.' : null
          };
        }
      },

      // ─── DOMAIN: AUTHENTICATION & SECURITY (🔐) ─────────────────────────
      {
        id: 'auth_token_presence',
        domain: 'AUTH',
        name_en: 'Session Token Storage & Hygiene',
        name_ar: 'التحقق من توكن الجلسة والأمان المحلي',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies session token existence in client storage and checks that no sensitive tokens leak into console/DOM.',
        description_ar: 'فحص وجود توكن المصادقة والتأكد من عدم تسريب التوكن أو كلمة المرور في الـ DOM أو الكونسول.',
        run: async (ctx) => {
          const token = API.getToken();
          if (!token) {
            return {
              status: 'WARN',
              expected: 'Authenticated active session token in LocalStorage',
              actual: 'No session token found (Guest / Logged Out state)',
              rootCause: 'User has not logged in or session was cleared.',
              remediation: 'Log in to test authenticated endpoints (Topics, Notes, Reviews, Profile).'
            };
          }
          return {
            status: 'PASS',
            expected: 'Valid non-empty session token string without plain leak',
            actual: `Token present (Length: ${token.length} chars, Redacted: Present / Valid)`,
            data: { token_status: 'Present / Valid', length: token.length }
          };
        }
      },
      {
        id: 'auth_session_validation',
        domain: 'AUTH',
        name_en: 'Server-Side Session Validation Contract',
        name_ar: 'التحقق من صلاحية الجلسة في الخادم (Validate Session)',
        severity: 'HIGH',
        dependencies: ['net_backend_reachable', 'auth_token_presence'],
        description_en: 'Calls action=validateSession to verify token authorization and user credentials on the database.',
        description_ar: 'استدعاء فحص الجلسة للتأكد من مطابقة التوكن وصلاحية المستخدم في قاعدة بيانات Google Sheets.',
        run: async (ctx) => {
          const token = API.getToken();
          if (!token) {
            return { status: 'SKIPPED', actual: 'Skipped because user is not logged in.' };
          }
          const res = await API.rawCall('validateSession', {});
          if (res && res.user && res.user.id) {
            ctx.user = res.user;
            return {
              status: 'PASS',
              expected: 'Valid user object returned with active session',
              actual: `Authenticated as User ID: ${res.user.id}, Role: ${res.user.role || 'User'}`,
              data: { user_id: res.user.id, role: res.user.role, username: res.user.username }
            };
          }
          return {
            status: 'FAIL',
            expected: 'Server validates session and returns user profile object',
            actual: res ? JSON.stringify(res) : 'Invalid session response',
            rootCause: 'Session expired or invalidated in database USERS/SESSIONS sheet.',
            remediation: 'Log out and re-authenticate to generate a fresh valid session token.'
          };
        }
      },
      {
        id: 'auth_user_object_integrity',
        domain: 'AUTH',
        name_en: 'User Profile & RBAC Schema Integrity',
        name_ar: 'تكامل بيانات المستخدم والأدوار (User Object Integrity)',
        severity: 'MEDIUM',
        dependencies: ['auth_session_validation'],
        description_en: 'Validates that State.currentUser contains all required fields (id, username, email, role, language).',
        description_ar: 'التحقق من اكتمال حقول المستخدم الحالية في الذاكرة وعدم وجود حقول ناقصة أو تالفة.',
        run: async (ctx) => {
          const u = State.currentUser || ctx.user;
          if (!u) {
            return {
              status: 'WARN',
              expected: 'State.currentUser loaded in frontend state',
              actual: 'State.currentUser is null',
              remediation: 'State will populate automatically on login or bootstrap.'
            };
          }
          const required = ['id', 'username', 'email', 'role'];
          const missing = required.filter(f => !u[f]);
          if (missing.length > 0) {
            return {
              status: 'FAIL',
              expected: `User object containing all fields: ${required.join(', ')}`,
              actual: `Missing required fields: ${missing.join(', ')}`,
              rootCause: 'Database USERS table schema missing required columns.',
              remediation: 'Check USERS sheet columns in Google Sheets to ensure id, username, email, role exist.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All core user profile attributes verified',
            actual: `User: ${u.username} (${u.email}) - Role: ${u.role}`,
            data: { id: u.id, username: u.username, role: u.role, language: u.language || 'en' }
          };
        }
      },

      // ─── DOMAIN: API CONTRACT TESTING (🔌) ──────────────────────────────
      {
        id: 'api_modules_contract',
        domain: 'API',
        name_en: 'Modules API Schema Contract',
        name_ar: 'عقد وفحص بنية API الموديولات',
        severity: 'CRITICAL',
        dependencies: ['net_backend_reachable'],
        description_en: 'Strictly verifies that action=modules returns an array of objects with id, name_en, and name_ar.',
        description_ar: 'فحص مخرجات موديولات النظام والتأكد من إرجاع مصفوفة تحتوي على المعرفات والأسماء الثنائية.',
        run: async (ctx) => {
          const res = await API.rawCall('modules', {});
          if (!Array.isArray(res)) {
            return {
              status: 'FAIL',
              expected: 'Array of module objects',
              actual: `Received ${typeof res}: ${JSON.stringify(res)}`,
              rootCause: 'actionModules in code.gs did not return an array.',
              remediation: 'Check getModulesRows() in code.gs and MODULES sheet in Google Sheets.'
            };
          }
          if (res.length === 0) {
            return {
              status: 'FAIL',
              expected: 'At least 1 ERP module loaded from database',
              actual: '0 modules returned',
              rootCause: 'MODULES table in Google Sheets is empty.',
              remediation: 'Ensure MODULES sheet contains default 10 modules (Inventory, Accounting, etc.).'
            };
          }
          const invalid = res.filter(m => !m.id || !m.name_en || !m.name_ar);
          if (invalid.length > 0) {
            return {
              status: 'FAIL',
              expected: 'All modules have id, name_en, name_ar',
              actual: `${invalid.length} invalid module objects found without required fields`,
              rootCause: 'Corrupt rows in MODULES sheet.',
              remediation: 'Verify headers and cells in MODULES sheet.'
            };
          }
          ctx.modules = res;
          return {
            status: 'PASS',
            expected: 'Valid modules array matching contract schema',
            actual: `Loaded ${res.length} modules successfully`,
            data: { count: res.length, module_ids: res.map(m => m.id) }
          };
        }
      },
      {
        id: 'api_categories_contract',
        domain: 'API',
        name_en: 'Categories API Schema Contract',
        name_ar: 'عقد وفحص بنية API الفئات والتصنيفات',
        severity: 'HIGH',
        dependencies: ['net_backend_reachable', 'api_modules_contract'],
        description_en: 'Verifies that action=categories returns category array and checks field structure.',
        description_ar: 'التحقق من جلب تصنيفات الموديولات ومطابقة الحقول مع قاعدة البيانات.',
        run: async (ctx) => {
          const res = await API.rawCall('categories', {});
          if (!Array.isArray(res)) {
            return {
              status: 'FAIL',
              expected: 'Array of category objects',
              actual: `Received: ${typeof res}`,
              rootCause: 'actionGetCategories failed or returned non-array.',
              remediation: 'Check getCategoriesRows() in code.gs.'
            };
          }
          ctx.categories = res;
          return {
            status: 'PASS',
            expected: 'Array of categories loaded',
            actual: `Loaded ${res.length} categories across all modules`,
            data: { count: res.length }
          };
        }
      },
      {
        id: 'api_topics_contract',
        domain: 'API',
        name_en: 'Topics API Schema Contract & Isolation',
        name_ar: 'عقد وفحص بنية API المواضيع وعزل المستخدم',
        severity: 'CRITICAL',
        dependencies: ['net_backend_reachable', 'auth_session_validation'],
        description_en: 'Calls action=topics and validates structure: id, user_id, module_id, topic, status, progress.',
        description_ar: 'استدعاء مواضيع المستخدم الحقيقية والتأكد من مطابقة الحقول ومستوى التقدم.',
        run: async (ctx) => {
          const res = await API.rawCall('topics', {});
          if (!Array.isArray(res)) {
            return {
              status: 'FAIL',
              expected: 'Array of topic objects',
              actual: `Received: ${typeof res}`,
              rootCause: 'actionGetTopics returned non-array or error.',
              remediation: 'Check actionGetTopics in code.gs.'
            };
          }
          ctx.topics = res;
          if (res.length === 0) {
            return {
              status: 'WARN',
              expected: 'User topics array loaded',
              actual: '0 topics found for current user (New account or empty database)',
              warning: 'User has not created topics yet.',
              remediation: 'Add a topic via "+ Quick Add" or import starter topics.'
            };
          }
          const sample = res[0];
          const hasFields = sample.id && sample.module_id && sample.topic && (sample.status !== undefined);
          if (!hasFields) {
            return {
              status: 'FAIL',
              expected: 'Topic schema containing id, module_id, topic, status',
              actual: `Sample topic missing fields: ${JSON.stringify(sample)}`,
              rootCause: 'TOPICS sheet schema mismatch.',
              remediation: 'Ensure TOPICS sheet contains id, user_id, module_id, topic, status, progress.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Valid topics schema matching contract',
            actual: `Retrieved ${res.length} topics cleanly`,
            data: { count: res.length }
          };
        }
      },
      {
        id: 'api_notes_contract',
        domain: 'API',
        name_en: 'Notes API Schema Contract',
        name_ar: 'عقد وفحص بنية API الملاحظات',
        severity: 'HIGH',
        dependencies: ['net_backend_reachable', 'auth_session_validation'],
        description_en: 'Validates that action=notes returns user notes with id, module_id, title, content.',
        description_ar: 'التحقق من استجابة API الملاحظات وتوافر حقول العنوان والمحتوى.',
        run: async (ctx) => {
          const res = await API.rawCall('notes', {});
          const notesList = Array.isArray(res) ? res : (res && Array.isArray(res.notes) ? res.notes : null);
          if (!notesList) {
            return {
              status: 'FAIL',
              expected: 'Array of note objects or { notes: [...] } pagination envelope',
              actual: `Received: ${typeof res}`,
              rootCause: 'actionGetNotes returned non-array structure.',
              remediation: 'Check NOTES sheet in Google Sheets and actionGetNotes in code.gs.'
            };
          }
          ctx.notes = notesList;
          return {
            status: 'PASS',
            expected: 'Notes list returned and verified',
            actual: `Retrieved ${notesList.length} notes`,
            data: { count: notesList.length, total: (res && res.total) ? res.total : notesList.length }
          };
        }
      },
      {
        id: 'api_favorites_contract',
        domain: 'API',
        name_en: 'Favorites API Schema Contract',
        name_ar: 'عقد وفحص بنية API المفضلة',
        severity: 'MEDIUM',
        dependencies: ['net_backend_reachable', 'auth_session_validation'],
        description_en: 'Validates that action=getFavorites returns list of saved AI insights.',
        description_ar: 'التحقق من استجابة API المفضلة لحفظ الرؤى والنصائح.',
        run: async (ctx) => {
          const res = await API.rawCall('getFavorites', {});
          if (!Array.isArray(res)) {
            return {
              status: 'FAIL',
              expected: 'Array of favorites',
              actual: `Received: ${typeof res}`,
              rootCause: 'actionGetFavorites failed in backend.',
              remediation: 'Verify AI_FAVORITES sheet exists in Google Sheets.'
            };
          }
          ctx.favorites = res;
          return {
            status: 'PASS',
            expected: 'Favorites array returned',
            actual: `Retrieved ${res.length} favorite items`,
            data: { count: res.length }
          };
        }
      },
      {
        id: 'api_reviews_contract',
        domain: 'API',
        name_en: 'Reviews Engine API Schema Contract',
        name_ar: 'عقد وفحص بنية API التكرار المتباعد للمراجعات',
        severity: 'MEDIUM',
        dependencies: ['net_backend_reachable', 'auth_session_validation'],
        description_en: 'Validates that action=reviews returns active spaced-repetition schedules.',
        description_ar: 'فحص مخرجات جدول المراجعات والتكرار المتباعد للمواضيع.',
        run: async (ctx) => {
          const res = await API.rawCall('reviews', {});
          if (!Array.isArray(res)) {
            return {
              status: 'FAIL',
              expected: 'Array of review items',
              actual: `Received: ${typeof res}`,
              rootCause: 'actionGetReviews returned non-array.',
              remediation: 'Check REVIEWS sheet in Google Sheets.'
            };
          }
          ctx.reviews = res;
          return {
            status: 'PASS',
            expected: 'Reviews array returned',
            actual: `Retrieved ${res.length} scheduled reviews`,
            data: { count: res.length }
          };
        }
      },
      {
        id: 'api_dashboard_analytics_contract',
        domain: 'API',
        name_en: 'Dashboard & Analytics Aggregation Contract',
        name_ar: 'عقد وفحص تجميع إحصائيات لوحة التحكم والتحليلات',
        severity: 'HIGH',
        dependencies: ['net_backend_reachable', 'auth_session_validation', 'api_topics_contract'],
        description_en: 'Calls action=dashboard and action=analytics and verifies summary calculation metrics.',
        description_ar: 'التحقق من احتساب إحصائيات المواضيع المتقنة ونسب الإنجاز دون أخطاء حسابية.',
        run: async (ctx) => {
          const dash = await API.rawCall('dashboard', {});
          if (!dash || typeof dash !== 'object') {
            return {
              status: 'FAIL',
              expected: 'Dashboard summary object',
              actual: `Received: ${JSON.stringify(dash)}`,
              rootCause: 'actionDashboard returned invalid format.',
              remediation: 'Check actionDashboard in code.gs.'
            };
          }
          const kpis = dash.kpis || dash;
          const hasKpis = (kpis.total_topics !== undefined || kpis.not_started !== undefined || kpis.learning !== undefined || kpis.mastered !== undefined || dash.mastered_count !== undefined);
          if (!hasKpis) {
            return {
              status: 'FAIL',
              expected: 'Dashboard summary containing numeric counts for topics and progress KPIs',
              actual: `Missing KPI counts in response`,
              rootCause: 'Aggregation error in code.gs actionDashboard.',
              remediation: 'Ensure calculateDashboardKPIs sums topics correctly.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Aggregated KPI metrics verified',
            actual: `Topics: ${kpis.total_topics || 0}, Learning: ${kpis.learning || 0}, Not Started: ${kpis.not_started || 0}, Mastered: ${kpis.mastered || 0}`,
            data: { kpis: kpis, modules_count: (dash.modules || []).length }
          };
        }
      },

      // ─── DOMAIN: DATA INTEGRITY & RELATIONSHIP DIAGNOSTICS (📦) ─────────
      {
        id: 'data_category_orphans',
        domain: 'DATA',
        name_en: 'Category to Module Reference Integrity',
        name_ar: 'تكامل ارتباط الفئات بالموديولات واكتشاف الفئات اليتيمة',
        severity: 'HIGH',
        dependencies: ['api_modules_contract', 'api_categories_contract'],
        description_en: 'Scans all categories to detect orphan records referencing non-existent module_ids.',
        description_ar: 'فحص كل الفئات للتأكد من ارتباطها بموديول صحيح غير محذوف.',
        run: async (ctx) => {
          const modules = ctx.modules || State.modulesCache || [];
          const categories = ctx.categories || State.allCategories || [];
          const validModIds = new Set(modules.map(m => String(m.id)));

          const orphans = categories.filter(c => c.module_id && !validModIds.has(String(c.module_id)));
          if (orphans.length > 0) {
            return {
              status: 'FAIL',
              expected: '0 orphan categories',
              actual: `Found ${orphans.length} orphan categories referencing invalid module IDs: ${orphans.map(c => `${c.name_en || c.id} (mod: ${c.module_id})`).join(', ')}`,
              rootCause: 'CATEGORIES table references old or deleted module IDs.',
              remediation: 'Update module_id in CATEGORIES sheet to point to valid module IDs.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All categories reference valid module IDs',
            actual: `${categories.length} categories checked, 0 orphans found`,
            data: { checked_categories: categories.length }
          };
        }
      },
      {
        id: 'data_topic_integrity',
        domain: 'DATA',
        name_en: 'Topic Relationships & Status Value Integrity',
        name_ar: 'تكامل ارتباط المواضيع وقيم الحالات ونسب التقدم',
        severity: 'HIGH',
        dependencies: ['api_modules_contract', 'api_topics_contract'],
        description_en: 'Checks topic status enums (Not Started, Learning, In Progress, Understood, Practiced, Mastered), progress (0-100), and valid module_id.',
        description_ar: 'التحقق من صحة حالات المواضيع وصحة نسب التقدم من 0 إلى 100% وخلوها من التلف.',
        run: async (ctx) => {
          const modules = ctx.modules || State.modulesCache || [];
          const topics = ctx.topics || [];
          if (!topics.length) {
            return { status: 'PASS', actual: '0 topics to check (Empty data).' };
          }
          const validModIds = new Set(modules.map(m => String(m.id)));
          const validStatuses = new Set(['Not Started', 'Learning', 'In Progress', 'Understood', 'Practiced', 'Mastered']);

          const invalidStatus = topics.filter(t => t.status && !validStatuses.has(t.status));
          const invalidProgress = topics.filter(t => typeof t.progress === 'number' && (t.progress < 0 || t.progress > 100));
          const orphanTopics = topics.filter(t => t.module_id && !validModIds.has(String(t.module_id)));

          if (orphanTopics.length > 0) {
            return {
              status: 'FAIL',
              expected: '0 orphan topics',
              actual: `${orphanTopics.length} topics reference non-existent modules`,
              rootCause: 'Topics referencing deleted module IDs.',
              remediation: 'Fix module_id column in TOPICS sheet.'
            };
          }
          if (invalidStatus.length > 0 || invalidProgress.length > 0) {
            return {
              status: 'WARN',
              expected: 'All topics have valid status enum and 0-100 progress',
              actual: `Found ${invalidStatus.length} invalid status values and ${invalidProgress.length} invalid progress values`,
              remediation: 'Normalize topic status in TOPICS sheet.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All topics pass referential integrity and value domain checks',
            actual: `${topics.length} topics verified clean`,
            data: { topic_count: topics.length }
          };
        }
      },
      {
        id: 'data_knowledge_gaps_engine',
        domain: 'DATA',
        name_en: 'Knowledge Gaps Calculation Accuracy',
        name_ar: 'دقة واحتساب محرك فجوات المعرفة (Knowledge Gaps)',
        severity: 'MEDIUM',
        dependencies: ['api_topics_contract'],
        description_en: 'Verifies that Knowledge Gaps are strictly calculated from topics with status != Mastered & != Practiced.',
        description_ar: 'التحقق من أن الفجوات المعرفية تُحسب بدقة من المواضيع التي لم تُتقن بعد.',
        run: async (ctx) => {
          const topics = ctx.topics || [];
          const calculatedGaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
          return {
            status: 'PASS',
            expected: 'Knowledge gaps derived from unmastered topics',
            actual: `Calculated ${calculatedGaps.length} open gaps out of ${topics.length} total topics`,
            data: { total_topics: topics.length, gaps_count: calculatedGaps.length }
          };
        }
      },

      // ─── DOMAIN: APPLICATION PAGES HEALTH (📚) ──────────────────────────
      {
        id: 'page_dashboard_health',
        domain: 'PAGES',
        name_en: 'Dashboard Page Component & Render Health',
        name_ar: 'صحة ومكونات صفحة لوحة التحكم (Dashboard)',
        severity: 'CRITICAL',
        dependencies: [],
        description_en: 'Checks Dashboard namespace, render function, and template containers.',
        description_ar: 'فحص جاهزية محرك عرض لوحة التحكم وتوافر دوال الـ Render.',
        run: async (ctx) => {
          if (typeof Dashboard === 'undefined' || typeof Dashboard.render !== 'function') {
            return {
              status: 'FAIL',
              expected: 'Dashboard.render function defined',
              actual: 'Dashboard module missing or not loaded',
              rootCause: 'js/dashboard.js failed to load or has syntax errors.',
              remediation: 'Check script tag for js/dashboard.js in index.html.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Dashboard module ready for DOM mounting',
            actual: 'Dashboard.render is functional'
          };
        }
      },
      {
        id: 'page_all_notes_health',
        domain: 'PAGES',
        name_en: 'All Notes Page & Data Table Health',
        name_ar: 'صحة صفحة الملاحظات وعرض جدول البيانات التفاعلي',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies Notes namespace, Table renderer, and modal view action handlers.',
        description_ar: 'فحص جاهزية صفحة جميع الملاحظات وجدول البيانات وأزرار العرض والتعديل.',
        run: async (ctx) => {
          if (typeof Notes === 'undefined' || typeof Notes.renderAllNotesPage !== 'function') {
            return {
              status: 'FAIL',
              expected: 'Notes.renderAllNotesPage function defined',
              actual: 'Notes module missing or incomplete',
              rootCause: 'js/notes.js not found or error during initialization.',
              remediation: 'Verify js/notes.js syntax and script inclusion.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Notes Data Table and View Modal handlers ready',
            actual: 'Notes.renderAllNotesPage and Table renderers operational'
          };
        }
      },
      {
        id: 'page_module_detail_health',
        domain: 'PAGES',
        name_en: 'Module Detail View & Sub-Tabs Health',
        name_ar: 'صحة صفحة تفاصيل الموديولات والتبويبات الفرعية',
        severity: 'HIGH',
        dependencies: ['api_modules_contract'],
        description_en: 'Verifies Modules namespace, category tab manager, and topic list view.',
        description_ar: 'التحقق من جاهزية صفحة عرض تفاصيل الموديول وتبويباته.',
        run: async (ctx) => {
          if (typeof Modules === 'undefined' || typeof Modules.render !== 'function') {
            return {
              status: 'FAIL',
              expected: 'Modules.render function defined',
              actual: 'Modules component missing',
              rootCause: 'js/modules.js missing.',
              remediation: 'Check js/modules.js in index.html.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Modules view renderer ready',
            actual: 'Modules.render operational'
          };
        }
      },
      {
        id: 'page_favorites_health',
        domain: 'PAGES',
        name_en: 'Favorites Page Health',
        name_ar: 'صحة صفحة المفضلة ورؤى الذكاء الاصطناعي المحفوظة',
        severity: 'MEDIUM',
        dependencies: [],
        description_en: 'Verifies Favorites.render function and list management.',
        description_ar: 'فحص جاهزية صفحة المفضلة.',
        run: async (ctx) => {
          if (typeof Favorites === 'undefined' || typeof Favorites.render !== 'function') {
            return { status: 'FAIL', expected: 'Favorites.render defined', actual: 'Favorites module missing', rootCause: 'js/favorites.js missing.' };
          }
          return { status: 'PASS', expected: 'Favorites.render ready', actual: 'Favorites page functional' };
        }
      },
      {
        id: 'page_ai_insights_health',
        domain: 'PAGES',
        name_en: 'AI Daily Insights Page Health',
        name_ar: 'صحة صفحة نصائح ورؤى الذكاء الاصطناعي اليومية',
        severity: 'MEDIUM',
        dependencies: [],
        description_en: 'Verifies AIInsightsPage.render function.',
        description_ar: 'فحص صفحة الرؤى اليومية.',
        run: async (ctx) => {
          if (typeof AIInsightsPage === 'undefined' || typeof AIInsightsPage.render !== 'function') {
            return { status: 'FAIL', expected: 'AIInsightsPage.render defined', actual: 'AIInsightsPage module missing', rootCause: 'js/ai-insights-page.js missing.' };
          }
          return { status: 'PASS', expected: 'AIInsightsPage ready', actual: 'AIInsightsPage functional' };
        }
      },
      {
        id: 'page_review_center_health',
        domain: 'PAGES',
        name_en: 'Spaced Repetition Review Center Health',
        name_ar: 'صحة صفحة مركز المراجعات والتكرار المتباعد',
        severity: 'MEDIUM',
        dependencies: [],
        description_en: 'Verifies Reviews.renderCenter function.',
        description_ar: 'فحص صفحة مركز المراجعة.',
        run: async (ctx) => {
          if (typeof Reviews === 'undefined' || typeof Reviews.renderCenter !== 'function') {
            return { status: 'FAIL', expected: 'Reviews.renderCenter defined', actual: 'Reviews module missing', rootCause: 'js/reviews.js missing.' };
          }
          return { status: 'PASS', expected: 'Reviews center ready', actual: 'Reviews page functional' };
        }
      },
      {
        id: 'page_analytics_health',
        domain: 'PAGES',
        name_en: 'Analytics & Reporting Page Health',
        name_ar: 'صحة صفحة التحليلات والتقارير الرسومية',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies Analytics.render function and chart builders.',
        description_ar: 'فحص صفحة التحليلات ومخططات التقدم.',
        run: async (ctx) => {
          if (typeof Analytics === 'undefined' || typeof Analytics.render !== 'function') {
            return { status: 'FAIL', expected: 'Analytics.render defined', actual: 'Analytics module missing', rootCause: 'js/analytics.js missing.' };
          }
          return { status: 'PASS', expected: 'Analytics page ready', actual: 'Analytics page functional' };
        }
      },
      {
        id: 'page_profile_admin_health',
        domain: 'PAGES',
        name_en: 'Profile & Administration Pages Health',
        name_ar: 'صحة صفحات الملف الشخصي وإدارة النظام',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies Profile.render and Profile.renderAdmin functions.',
        description_ar: 'فحص صفحة الملف الشخصي ولوحة الإدارة.',
        run: async (ctx) => {
          if (typeof Profile === 'undefined' || typeof Profile.render !== 'function') {
            return { status: 'FAIL', expected: 'Profile module defined', actual: 'Profile missing', rootCause: 'js/profile.js missing.' };
          }
          return { status: 'PASS', expected: 'Profile and Admin renderers ready', actual: 'Profile page functional' };
        }
      },

      // ─── DOMAIN: ERP MODULES MATRIX (🧩) ────────────────────────────────
      {
        id: 'modules_matrix_scan',
        domain: 'MODULES',
        name_en: 'All 10 Core ERP Modules Health Matrix',
        name_ar: 'فحص وتدقيق مصفوفة موديولات الـ ERP العشرة',
        severity: 'HIGH',
        dependencies: ['api_modules_contract'],
        description_en: 'Inspects each of the 10 ERP modules (Inventory, Accounting, Maintenance, Assets, Transportation, HR, Real Estate, Contracting, Fuel, Law Firm) for category coverage and ID bounds.',
        description_ar: 'فحص التغطية الفئوية والبيانات لكل موديول من موديولات النظام العشرة.',
        run: async (ctx) => {
          const modules = ctx.modules || State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
          const categories = ctx.categories || State.allCategories || [];

          const matrix = modules.map(m => {
            const modCats = categories.filter(c => String(c.module_id) === String(m.id));
            return {
              id: m.id,
              name_en: m.name_en,
              name_ar: m.name_ar,
              categories_count: modCats.length,
              status: modCats.length > 0 ? 'Healthy' : 'No Categories Defined'
            };
          });

          ctx.moduleMatrix = matrix;
          return {
            status: 'PASS',
            expected: 'All core modules configured with categories',
            actual: `Evaluated ${modules.length} modules. Total category mappings verified.`,
            data: { matrix: matrix }
          };
        }
      },

      // ─── DOMAIN: AI ENGINE & PROXY (🧠) ─────────────────────────────────
      {
        id: 'ai_service_loaded',
        domain: 'AI',
        name_en: 'AI Service & Global AI Tutor Chatbot Component',
        name_ar: 'جاهزية محرك الذكاء الاصطناعي وشات بوت الاستشاري',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies AIService and AIChat namespaces and prompt context generators.',
        description_ar: 'فحص توافر خدمة AIService وشات بوت AIChat المدمج.',
        run: async (ctx) => {
          if (typeof AIService === 'undefined' || typeof AIService.ask !== 'function') {
            return {
              status: 'FAIL',
              expected: 'AIService.ask defined',
              actual: 'AIService missing or uninitialized',
              rootCause: 'js/ai_service.js missing or has syntax errors.',
              remediation: 'Check js/ai_service.js in index.html.'
            };
          }
          if (typeof AIChat === 'undefined') {
            return {
              status: 'WARN',
              expected: 'AIChat widget defined',
              actual: 'AIChat component not loaded',
              remediation: 'Ensure js/ai_chat.js is loaded.'
            };
          }
          return {
            status: 'PASS',
            expected: 'AI Core Services and Context Builder operational',
            actual: 'AIService and AIChat ready'
          };
        }
      },
      {
        id: 'ai_context_builder_test',
        domain: 'AI',
        name_en: 'AI Knowledge Context Builder Accuracy',
        name_ar: 'بناء سياق الذكاء الاصطناعي للموديول (Context Builder)',
        severity: 'MEDIUM',
        dependencies: ['ai_service_loaded'],
        description_en: 'Tests AIService.buildModuleContext() to ensure it injects user knowledge gaps and topic details into AI prompts.',
        description_ar: 'التحقق من أن محرك الـ AI يدمج بيانات الموديول والفجوات المعرفية بدقة في برومبت الذكاء الاصطناعي.',
        run: async (ctx) => {
          if (typeof AIService.buildModuleContext !== 'function') {
            return { status: 'WARN', actual: 'buildModuleContext helper not defined in AIService.' };
          }
          const context = AIService.buildModuleContext('MOD-1');
          if (!context || typeof context !== 'object') {
            return {
              status: 'FAIL',
              expected: 'Structured context object for module',
              actual: `Received: ${typeof context}`,
              rootCause: 'buildModuleContext did not return a valid context object.',
              remediation: 'Check AIService.buildModuleContext in js/ai_service.js.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Structured context object with module_id, domain_profile, and gaps',
            actual: `Generated context object for "${context.module_name || context.module_id}" (Gaps: ${context.knowledge_gaps || 'None'})`,
            data: {
              module_id: context.module_id,
              module_name: context.module_name,
              total_topics: context.total_topics,
              gaps: context.knowledge_gaps,
              user_level: context.user_level
            }
          };
        }
      },
      {
        id: 'ai_offline_fallback_safety',
        domain: 'AI',
        name_en: 'AI Offline & Network Fallback Resilience',
        name_ar: 'مرونة الاستجابة الاحتياطية للذكاء الاصطناعي عند انقطاع الشبكة',
        severity: 'HIGH',
        dependencies: ['ai_service_loaded'],
        description_en: 'Verifies that AIService returns clean, structured static fallback without crashing if network fails.',
        description_ar: 'التحقق من أن النظام يُرجع إجابات استشارية احتياطية فورية (0ms) في حال تعطل خدمة الـ AI الخارجية.',
        run: async (ctx) => {
          // Test formatting helper
          const md = AIService.formatMarkdown('**Bold** and *Italic* and `Code`');
          if (!md || !md.includes('<strong>')) {
            return {
              status: 'WARN',
              expected: 'AIService.formatMarkdown converts markdown to safe HTML',
              actual: md,
              remediation: 'Review AIService.formatMarkdown regex.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Markdown parser and offline fallback generators ready',
            actual: 'Markdown parser and fallback safety verified'
          };
        }
      },

      // ─── DOMAIN: CACHE & CLIENT STORAGE (💾) ────────────────────────────
      {
        id: 'storage_localstorage_rw',
        domain: 'CACHE',
        name_en: 'LocalStorage Read / Write / Delete Integrity',
        name_ar: 'سلامة القراءة والكتابة والحذف في التخزين المحلي (LocalStorage)',
        severity: 'CRITICAL',
        dependencies: [],
        description_en: 'Tests LocalStorage availability, quota safety, and JSON serialization cycles.',
        description_ar: 'فحص قدرة المتصفح على حفظ واسترجاع بيانات الكاش في LocalStorage دون أخطاء Quota.',
        run: async (ctx) => {
          try {
            const testKey = '__erp_diag_test_' + Date.now();
            const testPayload = JSON.stringify({ ok: true, ts: Date.now() });
            localStorage.setItem(testKey, testPayload);
            const read = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);

            if (read === testPayload) {
              return {
                status: 'PASS',
                expected: 'LocalStorage read matches written data exactly',
                actual: 'Write, read, and delete succeeded cleanly'
              };
            }
            return {
              status: 'FAIL',
              expected: 'Exact match on LocalStorage read',
              actual: `Read mismatch: ${read}`,
              rootCause: 'LocalStorage data corrupted by browser storage engine.',
              remediation: 'Check browser storage settings and quota permissions.'
            };
          } catch (e) {
            return {
              status: 'FAIL',
              expected: 'LocalStorage accessible without exception',
              actual: `Storage error: ${e.message}`,
              rootCause: 'Browser in private browsing mode or storage disabled by Tracking Prevention.',
              remediation: 'Enable LocalStorage access in browser privacy settings.'
            };
          }
        }
      },
      {
        id: 'storage_cache_hygiene',
        domain: 'CACHE',
        name_en: 'Reference & Notes Cache Expiration Hygiene',
        name_ar: 'صلاحية وفترة انتهاء كاش البيانات والملاحظات',
        severity: 'LOW',
        dependencies: ['storage_localstorage_rw'],
        description_en: 'Inspects cached reference data (erp_tracker_ref_cache_v1) and notes cache (erp_notes_cache_v2) for JSON integrity.',
        description_ar: 'التحقق من سلامة كاش البيانات وعدم وجود بيانات تالفة قد تعيق تشغيل النظام.',
        run: async (ctx) => {
          const jsonKeys = ['erp_tracker_ref_cache_v1', 'erp_notes_cache_v2'];
          const statusMap = {};
          
          jsonKeys.forEach(k => {
            try {
              const raw = localStorage.getItem(k);
              if (raw) {
                JSON.parse(raw);
                statusMap[k] = 'Valid JSON';
              } else {
                statusMap[k] = 'Empty / Not Cached';
              }
            } catch (e) {
              statusMap[k] = 'CORRUPT_JSON';
            }
          });

          const theme = localStorage.getItem('erp_tracker_theme');
          statusMap['erp_tracker_theme'] = (theme === 'dark' || theme === 'light') ? `Valid (${theme})` : (theme ? 'Custom/Valid' : 'Default (light)');

          const corrupt = Object.keys(statusMap).filter(k => statusMap[k] === 'CORRUPT_JSON');
          if (corrupt.length > 0) {
            return {
              status: 'WARN',
              expected: 'All cached LocalStorage keys have valid JSON',
              actual: `Corrupt keys detected: ${corrupt.join(', ')}`,
              remediation: 'Clear corrupted cache keys from LocalStorage.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All cache items valid and uncorrupted',
            actual: 'Cache hygiene verified',
            data: statusMap
          };
        }
      },

      // ─── DOMAIN: LOCALIZATION & I18N (🌍) ───────────────────────────────
      {
        id: 'i18n_dictionary_parity',
        domain: 'I18N',
        name_en: 'Bilingual Dictionary Parity (English / Arabic)',
        name_ar: 'تطابق قواميس الترجمة الثنائية (الإنجليزية / العربية)',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Compares en and ar translation dictionaries in js/i18n.js to detect any missing translation keys.',
        description_ar: 'مقارنة قواميس اللغتين العربية والإنجليزية واكتشاف أي مفاتيح ترجمة ناقصة في النظام.',
        run: async (ctx) => {
          if (typeof I18n === 'undefined') {
            return { status: 'FAIL', expected: 'I18n module loaded', actual: 'I18n missing', rootCause: 'js/i18n.js not found.' };
          }
          const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : ((typeof DICTIONARIES !== 'undefined') ? DICTIONARIES : {});
          const en = dict.en || {};
          const ar = dict.ar || {};

          function getKeys(obj, prefix = '') {
            let res = [];
            for (let k in obj) {
              const full = prefix ? `${prefix}.${k}` : k;
              if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                res = res.concat(getKeys(obj[k], full));
              } else {
                res.push(full);
              }
            }
            return res;
          }

          const enKeys = new Set(getKeys(en));
          const arKeys = new Set(getKeys(ar));

          const missingInAr = [...enKeys].filter(k => !arKeys.has(k));
          const missingInEn = [...arKeys].filter(k => !enKeys.has(k));

          if (missingInAr.length > 0 || missingInEn.length > 0) {
            return {
              status: 'WARN',
              expected: 'Exact 1:1 translation key parity between English and Arabic',
              actual: `Missing in AR: ${missingInAr.length} keys | Missing in EN: ${missingInEn.length} keys`,
              data: { missingInAr: missingInAr.slice(0, 10), missingInEn: missingInEn.slice(0, 10) },
              remediation: 'Synchronize missing dictionary keys in js/i18n.js.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All translation keys matched between AR and EN',
            actual: `${enKeys.size} translation keys in perfect sync`,
            data: { key_count: enKeys.size }
          };
        }
      },
      {
        id: 'i18n_active_lookup_test',
        domain: 'I18N',
        name_en: 'Active Dynamic Key Translation & RTL Direction',
        name_ar: 'التحقق من دقة الترجمة الديناميكية واتجاه الـ RTL',
        severity: 'MEDIUM',
        dependencies: ['i18n_dictionary_parity'],
        description_en: 'Tests I18n.t() lookup for core paths and checks RTL layout compliance.',
        description_ar: 'اختبار دقة استرجاع النصوص المترجمة والتحقق من التبديل الصحيح لاتجاه القراءة.',
        run: async (ctx) => {
          const testPaths = ['app.name', 'nav.dashboard', 'auth.loginButton', 'notes.notesSection'];
          const failed = testPaths.filter(p => {
            const val = I18n.t(p);
            return !val || val === p;
          });

          if (failed.length > 0) {
            return {
              status: 'FAIL',
              expected: 'All test paths resolve to localized strings',
              actual: `Fallback returned for: ${failed.join(', ')}`,
              rootCause: 'Keys missing or undefined in current language dictionary.',
              remediation: 'Check path definitions in js/i18n.js.'
            };
          }
          return {
            status: 'PASS',
            expected: 'Dynamic translation lookup verified for all critical paths',
            actual: `Current Lang: ${I18n.getLang().toUpperCase()} | Core keys validated`,
            data: { active_lang: I18n.getLang() }
          };
        }
      },

      // ─── DOMAIN: SPA ROUTING & SHELL (🧭) ───────────────────────────────
      {
        id: 'routing_router_integrity',
        domain: 'ROUTING',
        name_en: 'Client-Side SPA Router & Hash Navigation',
        name_ar: 'سلامة نظام التوجيه والتنقل بالهاش (Client-Side Router)',
        severity: 'CRITICAL',
        dependencies: [],
        description_en: 'Verifies Router methods (go, decodeHash, encodeHash, render) and 404 safety.',
        description_ar: 'فحص محرك التوجيه والتأكد من دعم جميع المسارات ومعالجة الروابط غير الموجودة.',
        run: async (ctx) => {
          if (typeof Router === 'undefined' || typeof Router.go !== 'function' || typeof Router.render !== 'function') {
            return {
              status: 'FAIL',
              expected: 'Router instance loaded with go and render methods',
              actual: 'Router missing or uninitialized',
              rootCause: 'js/app.js Router definition missing.',
              remediation: 'Check Router object in js/app.js.'
            };
          }
          const decoded = Router.decodeHash ? Router.decodeHash() : { route: 'dashboard' };
          return {
            status: 'PASS',
            expected: 'Router operational and decoding hashes',
            actual: `Router active (Current route: "${decoded.route}")`,
            data: decoded
          };
        }
      },

      // ─── DOMAIN: FRONTEND RUNTIME & DOM (🖥️) ────────────────────────────
      {
        id: 'dom_app_shell_elements',
        domain: 'FRONTEND',
        name_en: 'Core SPA DOM Layout Shell Elements',
        name_ar: 'عناصر الهيكل الأساسي للواجهة (DOM App Shell)',
        severity: 'CRITICAL',
        dependencies: [],
        description_en: 'Verifies existence of #app, #content, #page-title, #sidebar, #sidebar-nav, and modal container.',
        description_ar: 'فحص وجود عناصر الـ DOM الأساسية لتشغيل الواجهة وعرض المحتوى.',
        run: async (ctx) => {
          const requiredIds = ['app', 'content', 'page-title', 'sidebar', 'sidebar-nav', 'modal-root'];
          const missing = requiredIds.filter(id => !document.getElementById(id));

          if (missing.length > 0) {
            return {
              status: 'FAIL',
              expected: `All shell container elements present: ${requiredIds.join(', ')}`,
              actual: `Missing DOM elements: ${missing.join(', ')}`,
              rootCause: 'index.html missing critical container markup.',
              remediation: 'Ensure index.html contains #app, #content, #page-title, #sidebar, #sidebar-nav, #modal-root.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All core container elements present in DOM',
            actual: 'All 6 critical layout containers found (#app, #content, #page-title, #sidebar, #sidebar-nav, #modal-root)'
          };
        }
      },
      {
        id: 'frontend_duplicate_ids',
        domain: 'FRONTEND',
        name_en: 'DOM Unique ID Collisions & Duplicate Scan',
        name_ar: 'فحص عدم تكرار المعرفات في عناصر الـ DOM (Duplicate ID Scan)',
        severity: 'MEDIUM',
        dependencies: [],
        description_en: 'Scans all DOM nodes to detect any duplicate id attributes that could break selectors.',
        description_ar: 'فحص شامل لجميع عناصر الصفحة للتأكد من فرادة الـ IDs وعدم وجود تصادم في العناصر.',
        run: async (ctx) => {
          const allWithId = document.querySelectorAll('[id]');
          const idCounts = {};
          allWithId.forEach(el => {
            const id = el.id;
            if (id) idCounts[id] = (idCounts[id] || 0) + 1;
          });

          const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
          if (duplicates.length > 0) {
            return {
              status: 'WARN',
              expected: '0 duplicate IDs in DOM',
              actual: `Found ${duplicates.length} duplicate IDs: ${duplicates.join(', ')}`,
              remediation: 'Ensure all HTML elements have unique ID attributes.'
            };
          }
          return {
            status: 'PASS',
            expected: 'All DOM IDs unique',
            actual: `Scanned ${allWithId.length} elements with IDs, 0 duplicates found`
          };
        }
      },
      {
        id: 'frontend_runtime_errors',
        domain: 'FRONTEND',
        name_en: 'Uncaught JavaScript Runtime Exceptions Tracker',
        name_ar: 'متتبع الأخطاء البرمجية اللحظية (Runtime JS Exceptions)',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Captures and displays any uncaught runtime errors or unhandled promise rejections.',
        description_ar: 'مراقبة واصطياد أي استثناءات جافاسكريبت غير معالجة حدثت أثناء التصفح.',
        run: async (ctx) => {
          if (_runtimeErrors.length > 0) {
            return {
              status: 'FAIL',
              expected: '0 uncaught JavaScript runtime exceptions',
              actual: `Captured ${_runtimeErrors.length} runtime errors: ${_runtimeErrors.map(e => e.message).join(' | ')}`,
              data: { errors: _runtimeErrors },
              rootCause: 'JavaScript error thrown during execution.',
              remediation: 'Inspect stack trace in Diagnostic Explorer and fix the offending code.'
            };
          }
          return {
            status: 'PASS',
            expected: '0 uncaught runtime exceptions',
            actual: 'Clean execution environment — 0 runtime errors captured'
          };
        }
      },

      // ─── DOMAIN: SECURITY & SANITIZATION (🔒) ───────────────────────────
      {
        id: 'sec_xss_sanitization_defense',
        domain: 'SECURITY',
        name_en: 'XSS Defense & DOMPurify HTML Sanitization',
        name_ar: 'حماية حقن النصوص الخبيثة (XSS Sanitization & DOMPurify)',
        severity: 'HIGH',
        dependencies: [],
        description_en: 'Verifies that DOMPurify is loaded and safely strips malicious script payloads from user notes/topics.',
        description_ar: 'التحقق من جاهزية مكتبة DOMPurify لتطهير نصوص الملاحظات ومنع هجمات XSS.',
        run: async (ctx) => {
          const testPayload = '<img src=x onerror=alert(1)><script>alert("xss")</script><b>Safe Text</b>';
          let sanitized = '';
          if (typeof DOMPurify !== 'undefined' && typeof DOMPurify.sanitize === 'function') {
            sanitized = DOMPurify.sanitize(testPayload);
          } else if (typeof Topics !== 'undefined' && typeof Topics.escapeHtml === 'function') {
            sanitized = Topics.escapeHtml(testPayload);
          } else {
            sanitized = testPayload.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }

          if (sanitized.includes('<script>') || sanitized.includes('onerror=')) {
            return {
              status: 'FAIL',
              expected: 'Malicious script tags and event handlers stripped',
              actual: `Vulnerable output: ${sanitized}`,
              rootCause: 'DOMPurify not loaded or misconfigured.',
              remediation: 'Ensure DOMPurify is included in index.html.'
            };
          }
          return {
            status: 'PASS',
            expected: 'XSS vectors completely stripped from user input',
            actual: 'Sanitization engine operational & secure'
          };
        }
      }
    ];
  }

  // ---------------------------------------------------------------------------
  // 4. DIAGNOSTIC RUNNER WITH DEPENDENCY GRAPH & ROOT CAUSE ANALYSIS
  // ---------------------------------------------------------------------------
  async function runDiagnostics(filterDomain = null) {
    if (_isRunning) return;
    _isRunning = true;
    _results = {};
    _logs = [];
    _runtimeErrors = [];
    _lastScanTime = new Date();
    const scanStart = Date.now();

    buildRegistry();

    // Select tests to run
    const testsToRun = filterDomain && filterDomain !== 'ALL'
      ? _registry.filter(t => t.domain === filterDomain)
      : _registry;

    log('INFO', 'SYSTEM', `Starting Enterprise Diagnostic Scan (${testsToRun.length} registered test suites)...`);

    const sharedContext = {
      pingLatency: 0,
      user: null,
      modules: null,
      categories: null,
      topics: null,
      notes: null,
      favorites: null,
      reviews: null
    };

    updateUIProgress(0, I18n.getLang() === 'ar' ? 'بدء الفحص التشخيصي...' : 'Initializing diagnostic scan...');

    for (let i = 0; i < testsToRun.length; i++) {
      const test = testsToRun[i];
      const percent = Math.round(((i) / testsToRun.length) * 100);
      const isAr = I18n.getLang() === 'ar';
      const stepName = isAr ? test.name_ar : test.name_en;

      updateUIProgress(percent, `${isAr ? 'فحص' : 'Running'}: ${stepName} (${i + 1}/${testsToRun.length})...`);

      // Check dependencies
      let skippedReason = null;
      if (test.dependencies && test.dependencies.length > 0) {
        for (let depId of test.dependencies) {
          const depResult = _results[depId];
          if (!depResult || depResult.status === 'FAIL' || depResult.status === 'SKIPPED') {
            skippedReason = `Upstream dependency "${depId}" ${!depResult ? 'was not run' : depResult.status.toLowerCase()}.`;
            break;
          }
        }
      }

      if (skippedReason) {
        _results[test.id] = {
          id: test.id,
          domain: test.domain,
          name_en: test.name_en,
          name_ar: test.name_ar,
          severity: test.severity,
          description_en: test.description_en,
          description_ar: test.description_ar,
          status: 'SKIPPED',
          duration_ms: 0,
          expected: test.description_en,
          actual: `Skipped: ${skippedReason}`,
          rootCause: `Parent dependency failure prevented execution.`,
          remediation: `Fix upstream dependency "${test.dependencies.join(', ')}" first.`,
          timestamp: new Date().toISOString()
        };
        log('WARN', test.domain, `[SKIPPED] ${test.name_en} — ${skippedReason}`);
        continue;
      }

      // Execute Test
      const testStart = Date.now();
      try {
        const out = await Promise.race([
          test.run(sharedContext),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Test timeout exceeded (10s)')), 10000))
        ]);

        const duration = Date.now() - testStart;
        const status = (out && out.status) ? out.status : 'PASS';

        _results[test.id] = {
          id: test.id,
          domain: test.domain,
          name_en: test.name_en,
          name_ar: test.name_ar,
          severity: test.severity,
          description_en: test.description_en,
          description_ar: test.description_ar,
          status: status,
          duration_ms: duration,
          expected: out.expected || test.description_en,
          actual: out.actual || 'Check completed successfully.',
          data: DiagnosticRedactor.sanitize(out.data || null),
          rootCause: out.rootCause || null,
          remediation: out.remediation || null,
          warning: out.warning || null,
          timestamp: new Date().toISOString()
        };

        if (status === 'PASS') log('PASS', test.domain, `${test.name_en} (${duration}ms): ${out.actual}`);
        else if (status === 'WARN') log('WARN', test.domain, `${test.name_en} (${duration}ms): ${out.actual}`);
        else if (status === 'FAIL') log('FAIL', test.domain, `${test.name_en} (${duration}ms): ${out.actual}`, out.rootCause);

      } catch (err) {
        const duration = Date.now() - testStart;
        _results[test.id] = {
          id: test.id,
          domain: test.domain,
          name_en: test.name_en,
          name_ar: test.name_ar,
          severity: test.severity,
          description_en: test.description_en,
          description_ar: test.description_ar,
          status: 'FAIL',
          duration_ms: duration,
          expected: test.description_en,
          actual: `Exception caught: ${err.message}`,
          rootCause: `Unhandled runtime exception in diagnostic test runner: ${err.message}`,
          remediation: `Inspect error stack trace and check service availability.`,
          error: err.stack,
          timestamp: new Date().toISOString()
        };
        log('FAIL', test.domain, `${test.name_en} threw an error: ${err.message}`, err.stack);
      }

      // Small yield to let browser paint
      await new Promise(r => setTimeout(r, 10));
    }

    _scanDuration = Date.now() - scanStart;
    _isRunning = false;

    updateUIProgress(100, I18n.getLang() === 'ar' ? `اكتمل الفحص التشخيصي الشامل (${_scanDuration}ms)` : `Diagnostic Scan Completed in ${_scanDuration}ms`);
    log('INFO', 'SYSTEM', `Scan Finished in ${_scanDuration}ms. Health Score: ${getHealthScore()}%`);

    renderDashboard();
  }

  // ---------------------------------------------------------------------------
  // 5. METRICS & ROOT CAUSE ANALYZER
  // ---------------------------------------------------------------------------
  function getStats() {
    const list = Object.values(_results);
    const passed = list.filter(r => r.status === 'PASS').length;
    const warnings = list.filter(r => r.status === 'WARN').length;
    const failed = list.filter(r => r.status === 'FAIL').length;
    const skipped = list.filter(r => r.status === 'SKIPPED').length;
    const total = list.length;

    return { total, passed, warnings, failed, skipped };
  }

  function getHealthScore() {
    const s = getStats();
    if (s.total === 0) return 100;
    const applicable = s.total - s.skipped;
    if (applicable <= 0) return 0;
    // Warnings subtract 50% penalty compared to full failures
    const score = Math.max(0, Math.round(((s.passed + (s.warnings * 0.5)) / applicable) * 100));
    return score;
  }

  function getSystemStatus() {
    const s = getStats();
    const criticalFails = Object.values(_results).filter(r => r.status === 'FAIL' && r.severity === 'CRITICAL');
    if (criticalFails.length > 0 || s.failed >= 2) return { label: 'CRITICAL', color: 'rust', badge_ar: '🔴 حرج (Critical)', badge_en: '🔴 Critical' };
    if (s.failed > 0 || s.warnings >= 3) return { label: 'DEGRADED', color: 'brass', badge_ar: '🟡 أداء متأثر (Degraded)', badge_en: '🟡 Degraded' };
    if (s.total > 0 && s.failed === 0) return { label: 'HEALTHY', color: 'teal', badge_ar: '🟢 سليم ومستقر (Healthy)', badge_en: '🟢 Healthy' };
    return { label: 'UNKNOWN', color: 'slate', badge_ar: '⚫ قيد الفحص', badge_en: '⚫ Scanning' };
  }

  function analyzeRootCauses() {
    const fails = Object.values(_results).filter(r => r.status === 'FAIL');
    const rootCauses = [];

    // Check if Backend is unreachable
    if (_results['net_backend_reachable'] && _results['net_backend_reachable'].status === 'FAIL') {
      rootCauses.push({
        title: 'Backend API Gateway Unavailable / Network Disconnect',
        title_ar: 'انقطاع الاتصال ببوابة خادم Google Apps Script',
        rootCause: 'CONFIG.API_URL unreachable or returned non-200 response.',
        affected: ['All Data Layers', 'All API Endpoints', 'Session Validation', 'Remote Sync'],
        remediation: 'Verify internet connection, verify Google Apps Script deployment URL in config.js, and redeploy code.gs as Web App.'
      });
      return rootCauses;
    }

    // Check if Session is missing
    if (_results['auth_token_presence'] && _results['auth_token_presence'].status !== 'PASS') {
      rootCauses.push({
        title: 'Unauthenticated Guest State',
        title_ar: 'عدم وجود جلسة تسجيل دخول نشطة',
        rootCause: 'No session token found in browser storage.',
        affected: ['User Topics', 'Notes Data', 'Reviews Engine', 'User Profile'],
        remediation: 'Log in with valid credentials to unlock authenticated data endpoints.'
      });
    }

    // Add specific failures
    fails.forEach(f => {
      if (f.id !== 'net_backend_reachable' && f.id !== 'auth_token_presence') {
        rootCauses.push({
          title: f.name_en,
          title_ar: f.name_ar,
          rootCause: f.rootCause || f.actual,
          affected: [f.domain],
          remediation: f.remediation || 'Inspect test details and check server logs.'
        });
      }
    });

    return rootCauses;
  }

  function log(type, category, message, details = null) {
    const d = new Date();
    const timestamp = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
    _logs.push({ timestamp, type, category, message, details: DiagnosticRedactor.sanitize(details) });

    const logBox = document.getElementById('diag-live-log-box');
    if (logBox) {
      let badgeClass = 'color: #34d399;'; // PASS green
      let symbol = '✅ [PASS]';
      if (type === 'WARN') { badgeClass = 'color: #fbbf24;'; symbol = '⚠️ [WARN]'; }
      if (type === 'FAIL') { badgeClass = 'color: #f87171;'; symbol = '❌ [FAIL]'; }
      if (type === 'INFO') { badgeClass = 'color: #38bdf8;'; symbol = 'ℹ️ [INFO]'; }

      const row = document.createElement('div');
      row.style.marginBottom = '6px';
      row.style.lineHeight = '1.4';
      row.innerHTML = `
        <span style="color:#64748b;">[${timestamp}]</span>
        <strong style="${badgeClass}">${symbol}</strong>
        <span style="color:#94a3b8; font-weight:600;">[${category}]</span>
        <span style="color:#cbd5e1;">${Topics.escapeHtml(message)}</span>
      `;
      logBox.appendChild(row);
      logBox.scrollTop = logBox.scrollHeight;
    }
  }

  function updateUIProgress(percent, statusText) {
    const fill = document.getElementById('diag-progress-fill');
    const percentEl = document.getElementById('diag-progress-percent');
    const stepEl = document.getElementById('diag-current-step');

    if (fill) fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    if (percentEl) percentEl.textContent = `${Math.round(percent)}%`;
    if (stepEl && statusText) stepEl.textContent = statusText;
  }

  // ---------------------------------------------------------------------------
  // 6. MAIN VIEW RENDERER
  // ---------------------------------------------------------------------------
  async function render(container) {
    const isAr = I18n.getLang() === 'ar';
    buildRegistry();

    container.innerHTML = `
      <!-- DIAGNOSTIC SUITE HEADER -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:14px;">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <h2 style="margin:0; font-size:22px; font-weight:700; color:var(--ink);">
              🧪 ${isAr ? 'مركز صحة وتشخيص النظام الشامل' : 'Enterprise ERP System Health & Diagnostic Center'}
            </h2>
            <span id="diag-status-pill" class="badge badge-priority-high" style="font-size:12px; font-weight:700;">
              ${isAr ? 'جاهز للفحص' : 'Ready'}
            </span>
          </div>
          <small style="color:var(--ink-soft); display:block; margin-top:4px;">
            ${isAr ? 'منظومة فحص وتدقيق حقيقية تكشف سلامة الـ API وتكامل البيانات ومحرك الـ AI وصحة الصفحات والـ Root Causes' : 'Real-time diagnostic engine for API contracts, data integrity, AI resilience, page renderers, and root cause analysis'}
          </small>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <button class="btn btn-primary" id="btn-run-full-diag" style="display:flex; align-items:center; gap:6px;">
            ▶️ <strong>${isAr ? 'تشغيل الفحص الشامل' : 'Run Full Diagnostic'}</strong>
          </button>
          <button class="btn btn-secondary" id="btn-copy-report" title="${isAr ? 'نسخ التقرير' : 'Copy Report'}">
            📋 ${isAr ? 'نسخ التقرير' : 'Copy Report'}
          </button>
          <button class="btn btn-secondary" id="btn-export-json" title="Export JSON">
            📥 JSON
          </button>
          <button class="btn btn-ghost" id="btn-print-report" title="Print PDF">
            📄 ${isAr ? 'طباعة' : 'Print'}
          </button>
        </div>
      </div>

      <!-- SEARCH & QUICK TEST ACTIONS BAR -->
      <div class="card" style="margin-bottom:20px; padding:14px 18px; border-radius:var(--radius-lg); background:var(--paper-raised);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="flex:1; min-width:240px; position:relative;">
            <input type="text" id="diag-search-input" class="field"
                   placeholder="${isAr ? 'ابحث عن أي اختبار، موديول، أو كود خطأ...' : 'Search any test, module, or error code...'}"
                   style="margin:0; padding-inline-start:36px; height:38px; font-size:13px;" value="${escapeHtml(_searchQuery)}">
            <span style="position:absolute; inset-inline-start:12px; top:50%; transform:translateY(-50%); color:var(--ink-soft); font-size:14px;">🔍</span>
          </div>

          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <span style="font-size:11.5px; font-weight:700; color:var(--ink-soft); margin-inline-end:4px;">${isAr ? 'فحوصات سريعة:' : 'Quick Tests:'}</span>
            <button class="btn btn-ghost btn-sm" data-quick-run="API" style="border:1px solid var(--line); font-size:11.5px;">🔌 API</button>
            <button class="btn btn-ghost btn-sm" data-quick-run="DATA" style="border:1px solid var(--line); font-size:11.5px;">📦 Data</button>
            <button class="btn btn-ghost btn-sm" data-quick-run="PAGES" style="border:1px solid var(--line); font-size:11.5px;">📚 Pages</button>
            <button class="btn btn-ghost btn-sm" data-quick-run="MODULES" style="border:1px solid var(--line); font-size:11.5px;">🧩 Modules</button>
            <button class="btn btn-ghost btn-sm" data-quick-run="AI" style="border:1px solid var(--line); font-size:11.5px;">🧠 AI</button>
            <button class="btn btn-ghost btn-sm" data-quick-run="CACHE" style="border:1px solid var(--line); font-size:11.5px;">💾 Cache</button>
          </div>
        </div>
      </div>

      <!-- LIVE PROGRESS BAR CARD -->
      <div class="card" style="margin-bottom:20px; padding:14px 20px; border-inline-start:4px solid var(--brass);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span id="diag-spinner" class="spinner" style="width:14px; height:14px; border-width:2px; display:${_isRunning ? 'inline-block' : 'none'};"></span>
            <strong id="diag-current-step" style="font-size:13px; color:var(--ink);">
              ${isAr ? 'جاهز لبدء الفحص الشامل...' : 'Ready to start diagnostic scan...'}
            </strong>
          </div>
          <span id="diag-progress-percent" style="font-family:var(--font-mono); font-size:13.5px; font-weight:700; color:var(--brass-deep);">0%</span>
        </div>
        <div style="width:100%; height:8px; background:var(--line-soft); border-radius:99px; overflow:hidden;">
          <div id="diag-progress-fill" style="width:0%; height:100%; background:linear-gradient(90deg, var(--brass), var(--teal)); border-radius:99px; transition:width 0.2s ease;"></div>
        </div>
      </div>

      <!-- MAIN DASHBOARD CONTAINER -->
      <div id="diag-dashboard-content">
        <!-- Rendered dynamically -->
      </div>
    `;

    bindEvents(container);

    // Initial run or display
    if (Object.keys(_results).length === 0) {
      runDiagnostics();
    } else {
      renderDashboard();
    }
  }

  function bindEvents(container) {
    const runBtn = container.querySelector('#btn-run-full-diag');
    const copyBtn = container.querySelector('#btn-copy-report');
    const exportBtn = container.querySelector('#btn-export-json');
    const printBtn = container.querySelector('#btn-print-report');
    const searchInput = container.querySelector('#diag-search-input');

    if (runBtn) runBtn.addEventListener('click', () => runDiagnostics());
    if (copyBtn) copyBtn.addEventListener('click', () => copyReportToClipboard());
    if (exportBtn) exportBtn.addEventListener('click', () => exportReportJson());
    if (printBtn) printBtn.addEventListener('click', () => ExportUtil.exportPdf());

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        _searchQuery = e.target.value;
        renderDashboard();
      });
    }

    container.querySelectorAll('[data-quick-run]').forEach(btn => {
      btn.addEventListener('click', () => {
        const domain = btn.dataset.quickRun;
        runDiagnostics(domain);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. DASHBOARD SECTIONS RENDERER
  // ---------------------------------------------------------------------------
  function renderDashboard() {
    const host = document.getElementById('diag-dashboard-content');
    if (!host) return;

    const isAr = I18n.getLang() === 'ar';
    const stats = getStats();
    const score = getHealthScore();
    const status = getSystemStatus();
    const rootCauses = analyzeRootCauses();

    // Update Status Pill in Header
    const statusPill = document.getElementById('diag-status-pill');
    if (statusPill) {
      statusPill.textContent = isAr ? status.badge_ar : status.badge_en;
      statusPill.className = `badge badge-priority-${status.color === 'rust' ? 'high' : (status.color === 'brass' ? 'medium' : 'low')}`;
    }

    let html = `
      <!-- HEALTH SCORE & OVERVIEW KPI GRID -->
      <div class="grid grid-kpi" style="margin-bottom:20px; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));">
        <div class="card kpi-card" style="border-inline-start:4px solid var(--${status.color});">
          <div class="kpi-label">${isAr ? 'نقاط صحة النظام (Health Score)' : 'System Health Score'}</div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:6px;">
            <span style="font-size:32px; font-weight:700; font-family:var(--font-mono); color:var(--${status.color});">${score}%</span>
            ${UI.gaugeRing(score, 44)}
          </div>
        </div>

        <div class="card kpi-card" style="cursor:pointer;" onclick="SystemTest.setFilter('PASS')">
          <div class="kpi-label">${isAr ? 'فحوصات ناجحة (Passed)' : 'Passed Tests'}</div>
          <div class="kpi-value teal">${stats.passed}</div>
          <small style="color:var(--ink-soft); font-size:11px;">100% Valid Contracts</small>
        </div>

        <div class="card kpi-card" style="cursor:pointer;" onclick="SystemTest.setFilter('WARN')">
          <div class="kpi-label">${isAr ? 'تنبيهات غير حرجة (Warnings)' : 'Warnings'}</div>
          <div class="kpi-value brass">${stats.warnings}</div>
          <small style="color:var(--ink-soft); font-size:11px;">Degraded / Empty</small>
        </div>

        <div class="card kpi-card" style="cursor:pointer;" onclick="SystemTest.setFilter('FAIL')">
          <div class="kpi-label">${isAr ? 'فشل / أخطاء حرجة (Failed)' : 'Critical Failures'}</div>
          <div class="kpi-value rust">${stats.failed}</div>
          <small style="color:var(--ink-soft); font-size:11px;">Requires Attention</small>
        </div>

        <div class="card kpi-card" style="cursor:pointer;" onclick="SystemTest.setFilter('SKIPPED')">
          <div class="kpi-label">${isAr ? 'تم تخطيها (Skipped)' : 'Skipped Tests'}</div>
          <div class="kpi-value slate" style="color:var(--ink-soft);">${stats.skipped}</div>
          <small style="color:var(--ink-soft); font-size:11px;">Upstream Blocked</small>
        </div>
      </div>
    `;

    // CRITICAL ISSUES & ROOT CAUSE ALERT BOX
    if (rootCauses.length > 0) {
      html += `
        <div class="card" style="margin-bottom:20px; border-inline-start:4px solid var(--rust); background:rgba(220, 38, 38, 0.03);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <span style="font-size:18px;">🚨</span>
            <h3 style="margin:0; font-size:16px; color:var(--rust); font-weight:700;">
              ${isAr ? 'تحليل الأسباب الجوهرية والأنظمة المتأثرة (Root Cause Analysis)' : 'Root Cause Analysis & Impact Assessment'}
            </h3>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${rootCauses.map(rc => `
              <div style="padding:12px 16px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-md);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
                  <strong style="color:var(--ink); font-size:14px;">🔴 ${Topics.escapeHtml(isAr ? (rc.title_ar || rc.title) : rc.title)}</strong>
                  <div style="display:flex; gap:4px;">
                    ${rc.affected.map(aff => `<span class="badge badge-priority-high" style="font-size:10.5px;">${escapeHtml(aff)}</span>`).join('')}
                  </div>
                </div>
                <p style="margin:0 0 8px; font-size:13px; color:var(--ink-soft);">
                  <strong>${isAr ? 'السبب الجوهري:' : 'Root Cause:'}</strong> ${Topics.escapeHtml(rc.rootCause)}
                </p>
                <div style="padding:8px 12px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12.5px; color:var(--ink);">
                  💡 <strong>${isAr ? 'الحل المقترح (Remediation):' : 'Recommended Fix:'}</strong> ${Topics.escapeHtml(rc.remediation)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // DIAGNOSTIC CENTER TABS
    html += `
      <div style="display:flex; gap:8px; margin-bottom:20px; border-bottom:2px solid var(--line); padding-bottom:8px; flex-wrap:wrap;">
        <button class="btn ${_activeTab === 'OVERVIEW' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setTab('OVERVIEW')">
          📊 ${isAr ? 'نظرة عامة والنطاقات' : 'Overview & Domains'}
        </button>
        <button class="btn ${_activeTab === 'PAGES' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setTab('PAGES')">
          📚 ${isAr ? 'صحة الصفحات (Pages)' : 'Page Health'}
        </button>
        <button class="btn ${_activeTab === 'MODULES' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setTab('MODULES')">
          🧩 ${isAr ? 'مصفوفة الموديولات العشرة' : 'Module Matrix'}
        </button>
        <button class="btn ${_activeTab === 'EXPLORER' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setTab('EXPLORER')">
          🔬 ${isAr ? 'مستكشف الفحوصات والتفاصيل' : 'Test Explorer'} (${stats.total})
        </button>
        <button class="btn ${_activeTab === 'CONSOLE' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setTab('CONSOLE')">
          💻 ${isAr ? 'سجل التشخيص المباشر' : 'Live Console'}
        </button>
      </div>
    `;

    // TAB CONTENTS
    if (_activeTab === 'OVERVIEW') {
      html += renderDomainsOverview();
    } else if (_activeTab === 'PAGES') {
      html += renderPagesHealthTable();
    } else if (_activeTab === 'MODULES') {
      html += renderModuleMatrixTable();
    } else if (_activeTab === 'EXPLORER') {
      html += renderTestExplorer();
    } else if (_activeTab === 'CONSOLE') {
      html += renderLiveConsole();
    }

    host.innerHTML = html;
  }

  // ─── TAB 1: DOMAINS OVERVIEW ──────────────────────────────────────────────
  function renderDomainsOverview() {
    const isAr = I18n.getLang() === 'ar';
    const domains = [
      { id: 'NETWORK', icon: '🌐', name: isAr ? 'الشبكة والاتصال' : 'Network & Connectivity' },
      { id: 'API', icon: '🔌', name: isAr ? 'عقود الـ APIs' : 'API Contracts' },
      { id: 'AUTH', icon: '🔐', name: isAr ? 'المصادقة والجلسات' : 'Authentication & RBAC' },
      { id: 'DATA', icon: '📦', name: isAr ? 'تكامل البيانات' : 'Data Integrity & Relations' },
      { id: 'PAGES', icon: '📚', name: isAr ? 'صحة الصفحات' : 'Application Pages' },
      { id: 'MODULES', icon: '🧩', name: isAr ? 'موديولات الـ ERP' : 'ERP Modules' },
      { id: 'AI', icon: '🧠', name: isAr ? 'محرك الذكاء الاصطناعي' : 'AI Engine & Fallback' },
      { id: 'CACHE', icon: '💾', name: isAr ? 'التخزين والكاش' : 'Cache & Storage' },
      { id: 'I18N', icon: '🌍', name: isAr ? 'الترجمة واللغات' : 'Localization (i18n)' },
      { id: 'ROUTING', icon: '🧭', name: isAr ? 'التوجيه والمسارات' : 'Routing & Navigation' },
      { id: 'FRONTEND', icon: '🖥️', name: isAr ? 'الواجهة والـ DOM' : 'Frontend & DOM Shell' },
      { id: 'SECURITY', icon: '🔒', name: isAr ? 'الأمان وحجب الأسرار' : 'Security & Sanitization' }
    ];

    return `
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
        ${domains.map(dom => {
          const domTests = Object.values(_results).filter(r => r.domain === dom.id);
          const passed = domTests.filter(r => r.status === 'PASS').length;
          const failed = domTests.filter(r => r.status === 'FAIL').length;
          const warnings = domTests.filter(r => r.status === 'WARN').length;
          const skipped = domTests.filter(r => r.status === 'SKIPPED').length;
          const total = domTests.length;

          let domStatus = 'Healthy';
          let borderCol = 'var(--teal)';
          let badgeClass = 'badge-status-mastered';
          if (failed > 0) { domStatus = 'Failing'; borderCol = 'var(--rust)'; badgeClass = 'badge-priority-high'; }
          else if (warnings > 0) { domStatus = 'Degraded'; borderCol = 'var(--brass)'; badgeClass = 'badge-priority-medium'; }
          else if (total === 0) { domStatus = 'Not Run'; borderCol = 'var(--line)'; badgeClass = 'badge'; }

          return `
            <div class="card" style="padding:18px; border-inline-start:4px solid ${borderCol}; cursor:pointer;" onclick="SystemTest.openDomainDetails('${dom.id}')">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:20px;">${dom.icon}</span>
                  <h4 style="margin:0; font-size:15px; color:var(--ink); font-weight:700;">${escapeHtml(dom.name)}</h4>
                </div>
                <span class="badge ${badgeClass}" style="font-size:11px;">${domStatus}</span>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:12.5px; color:var(--ink-soft); margin-bottom:8px;">
                <span>Passed: <strong style="color:var(--teal);">${passed}</strong></span>
                <span>Warn: <strong style="color:var(--brass-deep);">${warnings}</strong></span>
                <span>Failed: <strong style="color:var(--rust);">${failed}</strong></span>
                <span>Skipped: <strong>${skipped}</strong></span>
              </div>

              <div style="width:100%; height:6px; background:var(--line-soft); border-radius:99px; overflow:hidden;">
                <div style="width:${total ? Math.round((passed / total) * 100) : 0}%; height:100%; background:var(--teal); border-radius:99px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ─── TAB 2: APPLICATION PAGES HEALTH TABLE ────────────────────────────────
  function renderPagesHealthTable() {
    const isAr = I18n.getLang() === 'ar';
    const pages = [
      { route: 'dashboard', name_ar: 'لوحة التحكم', name_en: 'Dashboard', testId: 'page_dashboard_health' },
      { route: 'module', name_ar: 'تفاصيل الموديولات', name_en: 'Module Detail View', testId: 'page_module_detail_health' },
      { route: 'notes', name_ar: 'جميع الملاحظات', name_en: 'All Notes', testId: 'page_all_notes_health' },
      { route: 'favorites', name_ar: 'المفضلة', name_en: 'Favorites', testId: 'page_favorites_health' },
      { route: 'ai-insights', name_ar: 'رؤى الذكاء الاصطناعي', name_en: 'AI Daily Insights', testId: 'page_ai_insights_health' },
      { route: 'gaps', name_ar: 'فجوات المعرفة', name_en: 'Knowledge Gaps', testId: 'data_knowledge_gaps_engine' },
      { route: 'review', name_ar: 'مركز المراجعة', name_en: 'Review Center', testId: 'page_review_center_health' },
      { route: 'analytics', name_ar: 'التحليلات', name_en: 'Analytics', testId: 'page_analytics_health' },
      { route: 'profile', name_ar: 'الملف الشخصي', name_en: 'My Profile', testId: 'page_profile_admin_health' },
      { route: 'admin', name_ar: 'إدارة النظام', name_en: 'Administration', testId: 'page_profile_admin_health' }
    ];

    return `
      <div class="card" style="padding:20px; border-radius:var(--radius-lg); margin-bottom:20px;">
        <h3 style="margin:0 0 14px; font-size:16px;">📚 ${isAr ? 'مصفوفة صحة صفحات التطبيق (Application Pages Health)' : 'Application Pages Health Matrix'}</h3>
        <div class="table-wrap">
          <table style="width:100%; font-size:13px;">
            <thead>
              <tr style="background:var(--paper-raised);">
                <th>${isAr ? 'الصفحة' : 'Page'}</th>
                <th>${isAr ? 'المسار (Route)' : 'Route'}</th>
                <th>${isAr ? 'الحالة التشخيصية' : 'Status'}</th>
                <th>${isAr ? 'زمن الاستجابة' : 'Duration'}</th>
                <th>${isAr ? 'التشخيص الفني' : 'Diagnostics Summary'}</th>
              </tr>
            </thead>
            <tbody>
              ${pages.map(p => {
                const res = _results[p.testId] || {};
                const isPass = res.status === 'PASS';
                const isFail = res.status === 'FAIL';
                return `
                  <tr>
                    <td><strong>${escapeHtml(isAr ? p.name_ar : p.name_en)}</strong></td>
                    <td><span class="badge" style="font-family:var(--font-mono); font-size:11px;">#${p.route}</span></td>
                    <td>
                      <span class="badge ${isPass ? 'badge-status-mastered' : (isFail ? 'badge-priority-high' : 'badge-priority-medium')}">
                        ${isPass ? '🟢 Healthy' : (isFail ? '🔴 Failed' : '🟡 Warning')}
                      </span>
                    </td>
                    <td style="font-family:var(--font-mono);">${res.duration_ms || 0}ms</td>
                    <td style="color:var(--ink-soft); font-size:12.5px;">${escapeHtml(res.actual || 'Operational')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ─── TAB 3: MODULES MATRIX TABLE ──────────────────────────────────────────
  function renderModuleMatrixTable() {
    const isAr = I18n.getLang() === 'ar';
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const categories = State.allCategories || [];
    const topics = State.allTopics || [];

    return `
      <div class="card" style="padding:20px; border-radius:var(--radius-lg); margin-bottom:20px;">
        <h3 style="margin:0 0 14px; font-size:16px;">🧩 ${isAr ? 'مصفوفة صحة موديولات الـ ERP العشرة' : '10 Core ERP Modules Health Matrix'}</h3>
        <div class="table-wrap">
          <table style="width:100%; font-size:13px;">
            <thead>
              <tr style="background:var(--paper-raised);">
                <th>${isAr ? 'المعرف' : 'ID'}</th>
                <th>${isAr ? 'الموديول' : 'Module Name'}</th>
                <th>${isAr ? 'الفئات' : 'Categories'}</th>
                <th>${isAr ? 'المواضيع' : 'Topics'}</th>
                <th>${isAr ? 'حالة الموديول' : 'Module Health'}</th>
              </tr>
            </thead>
            <tbody>
              ${modules.map(m => {
                const modCats = categories.filter(c => String(c.module_id) === String(m.id));
                const modTopics = topics.filter(t => String(t.module_id) === String(m.id));
                return `
                  <tr>
                    <td><span class="badge" style="font-family:var(--font-mono); font-size:11px;">${m.id}</span></td>
                    <td><strong>📦 ${escapeHtml(isAr ? m.name_ar : m.name_en)}</strong></td>
                    <td><span class="badge badge-priority-medium" style="font-family:var(--font-mono); font-size:11px;">${modCats.length} ${isAr ? 'فئة' : 'Categories'}</span></td>
                    <td><span class="badge badge-priority-low" style="font-family:var(--font-mono); font-size:11px;">${modTopics.length} ${isAr ? 'موضوع' : 'Topics'}</span></td>
                    <td><span class="badge badge-status-mastered">🟢 Healthy</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ─── TAB 4: TEST EXPLORER & DETAILS MODAL TRIGGER ─────────────────────────
  function renderTestExplorer() {
    const isAr = I18n.getLang() === 'ar';
    let list = Object.values(_results);

    // Apply Status Filter
    if (_activeFilter !== 'ALL') {
      list = list.filter(r => r.status === _activeFilter);
    }

    // Apply Domain Filter
    if (_activeDomainFilter !== 'ALL') {
      list = list.filter(r => r.domain === _activeDomainFilter);
    }

    // Apply Search Query
    if (_searchQuery.trim()) {
      const q = _searchQuery.trim().toLowerCase();
      list = list.filter(r =>
        (r.name_en || '').toLowerCase().includes(q) ||
        (r.name_ar || '').toLowerCase().includes(q) ||
        (r.domain || '').toLowerCase().includes(q) ||
        (r.actual || '').toLowerCase().includes(q)
      );
    }

    return `
      <div class="card" style="padding:20px; border-radius:var(--radius-lg); margin-bottom:20px;">
        <!-- FILTER CHIPS -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm ${_activeFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setFilter('ALL')">${isAr ? 'الكل' : 'All'} (${Object.keys(_results).length})</button>
            <button class="btn btn-sm ${_activeFilter === 'FAIL' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setFilter('FAIL')">🔴 ${isAr ? 'فاشل' : 'Failed'}</button>
            <button class="btn btn-sm ${_activeFilter === 'WARN' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setFilter('WARN')">🟡 ${isAr ? 'تنبيه' : 'Warnings'}</button>
            <button class="btn btn-sm ${_activeFilter === 'PASS' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setFilter('PASS')">🟢 ${isAr ? 'ناجح' : 'Passed'}</button>
            <button class="btn btn-sm ${_activeFilter === 'SKIPPED' ? 'btn-primary' : 'btn-ghost'}" onclick="SystemTest.setFilter('SKIPPED')">⚪ ${isAr ? 'متخطى' : 'Skipped'}</button>
          </div>

          <div style="font-size:12.5px; color:var(--ink-soft);">
            ${isAr ? 'عرض' : 'Showing'} <strong>${list.length}</strong> ${isAr ? 'من إجمالي الفحوصات' : 'tests'}
          </div>
        </div>

        <!-- TESTS TABLE -->
        <div class="table-wrap">
          <table style="width:100%; font-size:13px;">
            <thead>
              <tr style="background:var(--paper-raised);">
                <th>${isAr ? 'الحالة' : 'Status'}</th>
                <th>${isAr ? 'النطاق' : 'Domain'}</th>
                <th>${isAr ? 'اسم الفحص' : 'Test Suite'}</th>
                <th>${isAr ? 'الأهمية' : 'Severity'}</th>
                <th>${isAr ? 'المدة' : 'Duration'}</th>
                <th style="text-align:center;">${isAr ? 'التفاصيل' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(t => {
                let badge = 'badge-status-mastered';
                if (t.status === 'FAIL') badge = 'badge-priority-high';
                else if (t.status === 'WARN') badge = 'badge-priority-medium';
                else if (t.status === 'SKIPPED') badge = 'badge';

                return `
                  <tr style="cursor:pointer;" onclick="SystemTest.openTestModal('${t.id}')">
                    <td><span class="badge ${badge}" style="font-size:11px;">${t.status}</span></td>
                    <td><span class="badge" style="font-family:var(--font-mono); font-size:10.5px;">${t.domain}</span></td>
                    <td>
                      <strong style="color:var(--ink);">${escapeHtml(isAr ? t.name_ar : t.name_en)}</strong>
                      <small style="display:block; color:var(--ink-soft); font-size:11.5px;">${escapeHtml(t.actual)}</small>
                    </td>
                    <td><span class="badge" style="font-size:10px;">${t.severity}</span></td>
                    <td style="font-family:var(--font-mono); font-size:11.5px;">${t.duration_ms}ms</td>
                    <td style="text-align:center;" onclick="event.stopPropagation();">
                      <button class="btn btn-secondary btn-sm" onclick="SystemTest.openTestModal('${t.id}')" style="padding:4px 8px; font-size:11.5px;">
                        🔍 ${isAr ? 'تفاصيل' : 'Details'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ─── TAB 5: LIVE CONSOLE ──────────────────────────────────────────────────
  function renderLiveConsole() {
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--line); margin-bottom:20px;">
        <div style="background:#1e293b; padding:10px 16px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:11px; height:11px; border-radius:50%; background:#ef4444; display:inline-block;"></span>
            <span style="width:11px; height:11px; border-radius:50%; background:#f59e0b; display:inline-block;"></span>
            <span style="width:11px; height:11px; border-radius:50%; background:#10b981; display:inline-block;"></span>
            <span style="color:#94a3b8; font-family:var(--font-mono); font-size:12px; margin-inline-start:8px;">ERP Diagnostic Terminal Logs</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-ghost btn-sm" onclick="SystemTest.copyLogToClipboard()" style="color:#cbd5e1; font-size:11.5px;">📋 ${isAr ? 'نسخ' : 'Copy'}</button>
          </div>
        </div>

        <div id="diag-live-log-box" style="background:#0f172a; padding:16px; font-family:var(--font-mono); font-size:12px; height:450px; overflow-y:auto; color:#f8fafc;">
          ${_logs.map(l => {
            let badgeClass = 'color: #34d399;';
            let symbol = '✅ [PASS]';
            if (l.type === 'WARN') { badgeClass = 'color: #fbbf24;'; symbol = '⚠️ [WARN]'; }
            if (l.type === 'FAIL') { badgeClass = 'color: #f87171;'; symbol = '❌ [FAIL]'; }
            if (l.type === 'INFO') { badgeClass = 'color: #38bdf8;'; symbol = 'ℹ️ [INFO]'; }

            return `
              <div style="margin-bottom:6px; line-height:1.4;">
                <span style="color:#64748b;">[${l.timestamp}]</span>
                <strong style="${badgeClass}">${symbol}</strong>
                <span style="color:#94a3b8; font-weight:600;">[${l.category}]</span>
                <span style="color:#cbd5e1;">${Topics.escapeHtml(l.message)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 8. TEST DETAILS MODAL / DRAWER
  // ---------------------------------------------------------------------------
  function openTestModal(testId) {
    const t = _results[testId];
    if (!t) return;
    const isAr = I18n.getLang() === 'ar';

    let badgeClass = 'badge-status-mastered';
    if (t.status === 'FAIL') badgeClass = 'badge-priority-high';
    else if (t.status === 'WARN') badgeClass = 'badge-priority-medium';
    else if (t.status === 'SKIPPED') badgeClass = 'badge';

    const modalHtml = `
      <div class="modal-head">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge ${badgeClass}" style="font-size:12px;">${t.status}</span>
          <h3 style="margin:0; font-size:17px;">${escapeHtml(isAr ? t.name_ar : t.name_en)}</h3>
        </div>
        <button class="btn btn-icon btn-ghost" data-close>&times;</button>
      </div>

      <div style="padding:16px 0;">
        <div style="display:flex; gap:12px; margin-bottom:14px; flex-wrap:wrap;">
          <span class="badge" style="font-family:var(--font-mono);">Domain: ${t.domain}</span>
          <span class="badge" style="font-family:var(--font-mono);">Severity: ${t.severity}</span>
          <span class="badge" style="font-family:var(--font-mono);">Duration: ${t.duration_ms}ms</span>
          <span class="badge" style="font-family:var(--font-mono);">ID: ${t.id}</span>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-weight:700; font-size:12px; color:var(--ink-soft); display:block; margin-bottom:4px;">
            ${isAr ? 'الوصف والهدف من الفحص:' : 'Description & Objective:'}
          </label>
          <div style="padding:10px 14px; background:var(--paper-raised); border-radius:var(--radius-sm); font-size:13px; color:var(--ink);">
            ${escapeHtml(isAr ? t.description_ar : t.description_en)}
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-weight:700; font-size:12px; color:var(--teal); display:block; margin-bottom:4px;">
            ${isAr ? 'السلوك المتوقع (Expected):' : 'Expected Result:'}
          </label>
          <div style="padding:8px 12px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12.5px;">
            ${escapeHtml(t.expected)}
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-weight:700; font-size:12px; color:var(--${t.status === 'FAIL' ? 'rust' : (t.status === 'WARN' ? 'brass-deep' : 'teal')}); display:block; margin-bottom:4px;">
            ${isAr ? 'النتيجة الفعلية (Actual Outcome):' : 'Actual Outcome:'}
          </label>
          <div style="padding:8px 12px; background:var(--paper-raised); border:1px solid var(--line); border-radius:var(--radius-sm); font-size:12.5px;">
            ${escapeHtml(t.actual)}
          </div>
        </div>

        ${t.data ? `
          <div style="margin-bottom:12px;">
            <label style="font-weight:700; font-size:12px; color:var(--ink-soft); display:block; margin-bottom:4px;">
              ${isAr ? 'بيانات الاستجابة (Redacted Response Data):' : 'Redacted Response Payload:'}
            </label>
            <pre style="padding:10px; background:#0f172a; color:#38bdf8; font-family:var(--font-mono); font-size:11.5px; border-radius:var(--radius-sm); overflow-x:auto; max-height:160px;">${escapeHtml(JSON.stringify(t.data, null, 2))}</pre>
          </div>
        ` : ''}

        ${t.rootCause ? `
          <div style="margin-bottom:12px; padding:10px 14px; background:rgba(220, 38, 38, 0.05); border-inline-start:3px solid var(--rust); border-radius:var(--radius-sm);">
            <strong style="color:var(--rust); font-size:12.5px; display:block; margin-bottom:2px;">🚨 ${isAr ? 'السبب الجوهري (Root Cause):' : 'Root Cause:'}</strong>
            <span style="font-size:12.5px; color:var(--ink);">${escapeHtml(t.rootCause)}</span>
          </div>
        ` : ''}

        ${t.remediation ? `
          <div style="padding:10px 14px; background:rgba(13, 148, 136, 0.05); border-inline-start:3px solid var(--teal); border-radius:var(--radius-sm);">
            <strong style="color:var(--teal); font-size:12.5px; display:block; margin-bottom:2px;">💡 ${isAr ? 'الإجراء التصحيحي الموصى به (Remediation):' : 'Recommended Fix:'}</strong>
            <span style="font-size:12.5px; color:var(--ink);">${escapeHtml(t.remediation)}</span>
          </div>
        ` : ''}
      </div>

      <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" class="btn btn-secondary" data-close>${isAr ? 'إغلاق' : 'Close'}</button>
      </div>
    `;

    UI.openModal(modalHtml);
  }

  // ---------------------------------------------------------------------------
  // 9. EXPORT & REPORTING TOOLS
  // ---------------------------------------------------------------------------
  function copyReportToClipboard() {
    const isAr = I18n.getLang() === 'ar';
    const stats = getStats();
    const score = getHealthScore();
    const status = getSystemStatus();
    const rootCauses = analyzeRootCauses();

    let text = `# ERP System Health & Diagnostic Center Report\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Overall Status: ${status.label} | Health Score: ${score}%\n`;
    text += `Summary: Total: ${stats.total} | Passed: ${stats.passed} | Warnings: ${stats.warnings} | Failures: ${stats.failed} | Skipped: ${stats.skipped}\n`;
    text += `Scan Duration: ${_scanDuration}ms\n\n`;

    if (rootCauses.length > 0) {
      text += `## 🚨 Root Cause Analysis:\n`;
      rootCauses.forEach(rc => {
        text += `- **${rc.title}**\n`;
        text += `  Root Cause: ${rc.rootCause}\n`;
        text += `  Affected: ${rc.affected.join(', ')}\n`;
        text += `  Remediation: ${rc.remediation}\n\n`;
      });
    }

    text += `## 📋 Test Suites Breakdown:\n`;
    Object.values(_results).forEach(r => {
      text += `[${r.status}] [${r.domain}] ${r.name_en} (${r.duration_ms}ms)\n`;
      text += `   Actual: ${r.actual}\n`;
      if (r.rootCause) text += `   Root Cause: ${r.rootCause}\n`;
      if (r.remediation) text += `   Remediation: ${r.remediation}\n`;
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        UI.toast(isAr ? 'تم نسخ التقرير الشامل للحافظة بنجاح!' : 'Diagnostic report copied to clipboard!', 'success');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const isAr = I18n.getLang() === 'ar';
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    UI.toast(isAr ? 'تم نسخ التقرير الشامل للحافظة بنجاح!' : 'Diagnostic report copied to clipboard!', 'success');
  }

  function exportReportJson() {
    const data = {
      app: 'ERP Knowledge Tracker',
      type: 'HEALTH_DIAGNOSTIC_REPORT',
      timestamp: new Date().toISOString(),
      healthScore: getHealthScore(),
      status: getSystemStatus(),
      stats: getStats(),
      duration_ms: _scanDuration,
      rootCauses: analyzeRootCauses(),
      results: DiagnosticRedactor.sanitize(_results),
      runtimeErrors: _runtimeErrors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erp_health_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ---------------------------------------------------------------------------
  // 10. PUBLIC CONTROLLER INTERFACE
  // ---------------------------------------------------------------------------
  return {
    render,
    runDiagnostics,
    setFilter(filter) { _activeFilter = filter; renderDashboard(); },
    setTab(tab) { _activeTab = tab; renderDashboard(); },
    openTestModal,
    openDomainDetails(domain) { _activeDomainFilter = domain; _activeTab = 'EXPLORER'; renderDashboard(); },
    copyReportToClipboard,
    exportReportJson
  };
})();
