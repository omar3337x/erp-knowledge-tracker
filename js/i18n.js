/**
 * js/i18n.js — Centralized bilingual (EN/AR) translation system.
 */

const I18N = (function () {

  const translations = {
    en: {
      // ── App Shell ───────────────────────────────────────────────
      "app.title": "ERP Knowledge & Learning Tracker",
      "app.subtitle": "Learning Ledger",
      "auth.logout": "Logout",

      // ── Auth ────────────────────────────────────────────────────
      "auth.login": "Log In",
      "auth.signup": "Sign Up",
      "auth.username_or_email": "Username or Email",
      "auth.password": "Password",
      "auth.remember_me": "Remember me",
      "auth.full_name": "Full Name",
      "auth.username": "Username",
      "auth.email": "Email",
      "auth.confirm_password": "Confirm Password",
      "auth.create_account": "Create Account",
      "auth.all_fields_required": "All fields are required.",
      "auth.passwords_no_match": "Passwords do not match.",
      "auth.password_min_8": "Password must be at least 8 characters.",
      "auth.invalid_email": "Invalid email address.",
      "auth.username_taken": "Username is already taken.",
      "auth.email_registered": "Email is already registered.",
      "auth.invalid_credentials": "Invalid credentials.",
      "auth.account_disabled": "Account is disabled.",
      "auth.session_expired": "Session expired. Please log in again.",
      "auth.account_not_active": "Account is not active.",
      "auth.login_success": "Login successful.",
      "auth.account_created": "Account created. You can log in now.",
      "auth.logging_in": "Logging you in...",

      // ── Navigation ──────────────────────────────────────────────
      "nav.dashboard": "Dashboard",
      "nav.modules": "Modules",
      "nav.learning": "Learning",
      "nav.gaps": "Knowledge Gaps",
      "nav.review": "Review Center",
      "nav.analytics": "Analytics",
      "nav.account": "Account",
      "nav.profile": "My Profile",
      "nav.admin": "Administration",

      // ── Dashboard ───────────────────────────────────────────────
      "dashboard.title": "Dashboard",
      "dashboard.kpi.overall_progress": "Overall Progress",
      "dashboard.kpi.total_topics": "Total Topics",
      "dashboard.kpi.not_started": "Not Started",
      "dashboard.kpi.learning": "Learning",
      "dashboard.kpi.understood": "Understood",
      "dashboard.kpi.practiced": "Practiced",
      "dashboard.kpi.mastered": "Mastered",
      "dashboard.kpi.knowledge_gaps": "Knowledge Gaps",
      "dashboard.kpi.to_review": "To Review",
      "dashboard.review_summary": "{{overdue}} overdue · {{dueToday}} due today for review",
      "dashboard.go_to_review": "Go to Review Center",
      "dashboard.modules": "Modules",

      // ── Module View ─────────────────────────────────────────────
      "module.progress": "Module Progress",
      "module.total_topics": "Total Topics",
      "module.completed": "Completed",
      "module.learning": "Learning",
      "module.gaps": "Knowledge Gaps",
      "module.all_categories": "All Categories",
      "module.all_statuses": "All Statuses",
      "module.all_priorities": "All Priorities",
      "module.add_gap": "+ Add Knowledge Gap",
      "module.no_data": "Start by adding the first topic you want to learn.",
      "module.categories_title": "Categories",
      "module.categories_add": "+ Add Category",
      "module.categories_edit": "Edit",
      "module.categories_delete": "Delete",
      "module.categories_activate": "Activate",
      "module.categories_deactivate": "Deactivate",
      "module.categories_management": "Category Management",

      // ── Topics ──────────────────────────────────────────────────
      "topics.table.topic": "Topic",
      "topics.table.module": "Module",
      "topics.table.category": "Category",
      "topics.table.status": "Status",
      "topics.table.priority": "Priority",
      "topics.table.progress": "Progress",
      "topics.table.last_review": "Last Review",
      "topics.table.next_review": "Next Review",
      "topics.empty": "No knowledge gaps yet.",
      "topics.empty_hint": "Start by adding the first topic you want to learn.",
      "topics.add_title": "Add Knowledge Gap",
      "topics.add_topic_name": "Topic Name",
      "topics.add_topic_name_ph": "e.g. Stock Valuation",
      "topics.add_module": "Module",
      "topics.add_category": "Category",
      "topics.add_description": "Description",
      "topics.add_description_ph": "Short context for this topic",
      "topics.add_priority": "Priority",
      "topics.add_current_understanding": "Current Understanding",
      "topics.add_current_understanding_ph": "What you already understand, if anything",
      "topics.add_what_dont_know": "What I Don't Know",
      "topics.add_what_dont_know_ph": "e.g. الفرق بين FIFO و Average Cost",
      "topics.add_what_need_to_learn": "What I Need To Learn",
      "topics.add_what_need_to_learn_ph": "e.g. إزاي تقييم المخزون بيأثر على القيود المحاسبية",
      "topics.add_save": "Save",
      "topics.add_success": "Topic added successfully.",
      "topics.delete_confirm": "Delete this topic? This cannot be undone.",
      "topics.deleted": "Topic deleted",
      "topics.name_required": "Topic name and module are required.",
      "topics.not_found": "Topic not found.",
      "topics.updated": "Topic updated successfully.",
      "topics.status_updated": "Status updated.",
      "topics.progress_updated": "Progress updated.",
      "topics.invalid_status": "Invalid status.",
      "topics.loading": "Loading topic...",

      // ── Knowledge Tabs ──────────────────────────────────────────
      "knowledge.tab_knowledge": "Knowledge",
      "knowledge.tab_business": "Business & ERP",
      "knowledge.tab_practical": "Practical",
      "knowledge.tab_reviews": "Reviews",
      "knowledge.what_i_know": "What I Know",
      "knowledge.what_i_know_ph": "What you already understand about this topic",
      "knowledge.what_i_dont_know": "What I Don't Know",
      "knowledge.what_i_dont_know_ph": "What's still unclear",
      "knowledge.what_i_need_to_learn": "What I Need To Learn",
      "knowledge.what_i_need_to_learn_ph": "What you still need to study or practice",
      "knowledge.notes": "Notes",
      "knowledge.save": "Save Knowledge",
      "knowledge.updated": "Knowledge updated successfully.",
      "knowledge.business_section": "Business Understanding",
      "knowledge.business_label": "Business Scenario, Rules, Process, Inputs & Outputs",
      "knowledge.business_ph": "e.g. Business Scenario / Business Rules / Business Process / Inputs / Outputs",
      "knowledge.erp_section": "ERP Understanding",
      "knowledge.erp_label": "Screens, Fields, Configuration, Transactions, Impact & Reports",
      "knowledge.erp_ph": "e.g. Screens / Fields / Configuration / Transactions / Accounting Impact / Inventory Impact / Reports",
      "knowledge.practical_section": "Practical Experience",
      "knowledge.practical_label": "Real Scenario, Test Case, Issue & Solution",
      "knowledge.practical_ph": "e.g. Real Scenario / Test Case / Issue / Solution",

      // ── Reviews ─────────────────────────────────────────────────
      "reviews.mark_as_reviewed": "Mark As Reviewed",
      "reviews.understanding": "Understanding Level",
      "reviews.weak": "Weak",
      "reviews.good": "Good",
      "reviews.strong": "Strong",
      "reviews.notes_label": "Notes",
      "reviews.notes_ph": "What did you reinforce in this review?",
      "reviews.next_review_days": "Next Review In (days)",
      "reviews.mark_btn": "Mark as Reviewed",
      "reviews.history_title": "Review History",
      "reviews.date": "Date",
      "reviews.no_reviews": "No reviews logged yet for this topic.",
      "reviews.review_completed": "Review completed.",
      "reviews.overdue": "Overdue",
      "reviews.due_today": "Due Today",
      "reviews.due_this_week": "Due This Week",
      "reviews.recently_learned": "Recently Learned",
      "reviews.no_due": "No topics are due for review.",
      "reviews.no_mastered": "Nothing mastered yet.",

      // ── Analytics ───────────────────────────────────────────────
      "analytics.title": "Analytics",
      "analytics.progress_by_module": "Progress by Module",
      "analytics.topics_by_status": "Topics by Status",
      "analytics.topics_by_priority": "Topics by Priority",
      "analytics.knowledge_gaps_by_module": "Knowledge Gaps by Module",
      "analytics.strongest_modules": "Strongest Modules",
      "analytics.weakest_modules": "Weakest Modules",
      "analytics.mastered_topics": "Mastered Topics",
      "analytics.needing_review": "Needing Review",
      "analytics.total_reviews": "Total Reviews Logged",
      "analytics.learning_over_time": "Learning Progress Over Time",
      "analytics.mastered_on": "Mastered On",
      "analytics.no_mastered_yet": "No mastered topics yet — timeline will fill in as you progress.",
      "analytics.loading": "Loading analytics...",
      "analytics.no_data": "No data yet.",
      "analytics.not_enough_data": "Not enough data yet.",

      // ── Profile ─────────────────────────────────────────────────
      "profile.title": "My Profile",
      "profile.account": "Account",
      "profile.overall_progress": "Overall Progress",
      "profile.account_created": "Account Created",
      "profile.last_login": "Last Login",
      "profile.full_name_label": "Full Name",
      "profile.username_label": "Username",
      "profile.email_label": "Email",
      "profile.save_changes": "Save Changes",
      "profile.changed_successfully": "Profile updated successfully.",
      "profile.change_password": "Change Password",
      "profile.current_password": "Current Password",
      "profile.new_password": "New Password",
      "profile.confirm_new_password": "Confirm New Password",
      "profile.change_pwd_btn": "Change Password",
      "profile.pwd_changed_successfully": "Password changed successfully.",
      "profile.current_pwd_incorrect": "Current password is incorrect.",
      "profile.new_pwd_min_8": "New password must be at least 8 characters.",
      "profile.new_passwords_no_match": "New passwords do not match.",
      "profile.email_invalid": "Invalid email address.",
      "profile.email_taken": "Email is already registered.",

      // ── Admin ───────────────────────────────────────────────────
      "admin.title": "Administration",
      "admin.total_users": "Total Users",
      "admin.active_users": "Active Users",
      "admin.new_users_30d": "New Users (30d)",
      "admin.name": "Name",
      "admin.role": "Role",
      "admin.progress": "Progress",
      "admin.topics_count": "Topics",
      "admin.last_login_col": "Last Login",
      "admin.access_required": "Admin access required.",
      "admin.loading": "Loading administration...",

      // ── General UI ──────────────────────────────────────────────
      "general.loading": "Loading...",
      "general.loading_dashboard": "Loading dashboard...",
      "general.loading_module": "Loading module...",
      "general.loading_gaps": "Loading knowledge gaps...",
      "general.loading_review": "Loading review center...",
      "general.loading_profile": "Loading profile...",
      "general.searching": "Searching...",
      "general.page_not_found": "Page not found",
      "general.use_sidebar": "Use the sidebar to navigate.",
      "general.something_went_wrong": "Something went wrong",
      "general.save": "Save",
      "general.cancel": "Cancel",
      "general.delete": "Delete",
      "general.edit": "Edit",
      "general.add": "Add",
      "general.back": "Back",
      "general.yes": "Yes",
      "general.no": "No",
      "general.close": "Close",
      "general.active": "Active",
      "general.inactive": "Inactive",
      "general.search_results": "Search Results",

      // ── Status Values ───────────────────────────────────────────
      "status.not_started": "Not Started",
      "status.learning": "Learning",
      "status.understood": "Understood",
      "status.practiced": "Practiced",
      "status.mastered": "Mastered",

      // ── Priority Values ─────────────────────────────────────────
      "priority.low": "Low",
      "priority.medium": "Medium",
      "priority.high": "High",
      "priority.critical": "Critical",

      // ── Category Management ─────────────────────────────────────
      "categories.title": "Categories",
      "categories.add": "+ Add Category",
      "categories.table.category": "Category",
      "categories.table.description": "Description",
      "categories.table.topics_count": "Topics",
      "categories.table.status": "Status",
      "categories.table.actions": "Actions",
      "categories.add_title": "Add Category",
      "categories.edit_title": "Edit Category",
      "categories.name_en": "Name (English)",
      "categories.name_en_ph": "e.g. Inventory Valuation",
      "categories.name_ar": "Name (Arabic)",
      "categories.name_ar_ph": "e.g. تقييم المخزون",
      "categories.description_label": "Description",
      "categories.description_ph": "Optional description",
      "categories.active_label": "Active",
      "categories.save_category": "Save Category",
      "categories.add_success": "Category added successfully.",
      "categories.update_success": "Category updated successfully.",
      "categories.delete_confirm": "Are you sure you want to delete this category?",
      "categories.deleted": "Category deleted.",
      "categories.has_topics": "This category contains topics and cannot be deleted.",
      "categories.deactivate": "Deactivate",
      "categories.activate": "Activate",
      "categories.name_required": "Category name is required.",
      "categories.not_found": "Category not found.",

      // ── Language ────────────────────────────────────────────────
      "lang.switch": "Language",
      "lang.english": "English",
      "lang.arabic": "العربية",

      // ── Toast Messages ──────────────────────────────────────────
      "toast.network_error": "Network error contacting the API.",
      "toast.unexpected_response": "Unexpected response from the API.",
      "toast.login_success": "Login successful",
      "toast.topic_added": "Topic added successfully",
      "toast.topic_deleted": "Topic deleted",
      "toast.status_updated": "Status updated",
      "toast.progress_updated": "Progress updated",
      "toast.knowledge_updated": "Knowledge updated successfully",
      "toast.review_completed": "Review completed",
      "toast.profile_updated": "Profile updated successfully",
      "toast.password_changed": "Password changed successfully",
      "toast.category_added": "Category added successfully",
      "toast.category_updated": "Category updated successfully",
      "toast.category_deleted": "Category deleted",
      "toast.session_expired": "Session expired. Please log in again.",

      // ── Search ──────────────────────────────────────────────────
      "search.placeholder": "Search topics across all modules...",
      "search.empty_hint": "Try a different search term.",
      "search.results_for": 'Search: "{{q}}"',
    },

    ar: {
      // ── App Shell ───────────────────────────────────────────────
      "app.title": "متتبع معرفة وتعلم أنظمة ERP",
      "app.subtitle": "سجل التعلم",
      "auth.logout": "تسجيل الخروج",

      // ── Auth ────────────────────────────────────────────────────
      "auth.login": "تسجيل الدخول",
      "auth.signup": "إنشاء حساب",
      "auth.username_or_email": "اسم المستخدم أو البريد الإلكتروني",
      "auth.password": "كلمة المرور",
      "auth.remember_me": "تذكرني",
      "auth.full_name": "الاسم الكامل",
      "auth.username": "اسم المستخدم",
      "auth.email": "البريد الإلكتروني",
      "auth.confirm_password": "تأكيد كلمة المرور",
      "auth.create_account": "إنشاء حساب",
      "auth.all_fields_required": "جميع الحقول مطلوبة.",
      "auth.passwords_no_match": "كلمات المرور غير متطابقة.",
      "auth.password_min_8": "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
      "auth.invalid_email": "عنوان بريد إلكتروني غير صالح.",
      "auth.username_taken": "اسم المستخدم موجود بالفعل.",
      "auth.email_registered": "البريد الإلكتروني مسجل بالفعل.",
      "auth.invalid_credentials": "بيانات الاعتماد غير صحيحة.",
      "auth.account_disabled": "الحساب معطل.",
      "auth.session_expired": "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
      "auth.account_not_active": "الحساب غير نشط.",
      "auth.login_success": "تم تسجيل الدخول بنجاح.",
      "auth.account_created": "تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.",
      "auth.logging_in": "جارٍ تسجيل دخولك...",

      // ── Navigation ──────────────────────────────────────────────
      "nav.dashboard": "لوحة التحكم",
      "nav.modules": "الوحدات",
      "nav.learning": "التعلم",
      "nav.gaps": "فجوات المعرفة",
      "nav.review": "مركز المراجعة",
      "nav.analytics": "التحليلات",
      "nav.account": "الحساب",
      "nav.profile": "الملف الشخصي",
      "nav.admin": "الإدارة",

      // ── Dashboard ───────────────────────────────────────────────
      "dashboard.title": "لوحة التحكم",
      "dashboard.kpi.overall_progress": "التقدم الكلي",
      "dashboard.kpi.total_topics": "إجمالي المواضيع",
      "dashboard.kpi.not_started": "غير شروع",
      "dashboard.kpi.learning": "تحت التعلم",
      "dashboard.kpi.understood": "مفهوم",
      "dashboard.kpi.practiced": "تم التطبيق",
      "dashboard.kpi.mastered": "إتقان",
      "dashboard.kpi.knowledge_gaps": "فجوات المعرفة",
      "dashboard.kpi.to_review": "للمراجعة",
      "dashboard.review_summary": "{{overdue}} متأخر · {{dueToday}} مستحق اليوم للمراجعة",
      "dashboard.go_to_review": "انتقل إلى مركز المراجعة",
      "dashboard.modules": "الوحدات",

      // ── Module View ─────────────────────────────────────────────
      "module.progress": "تقدم الوحدة",
      "module.total_topics": "إجمالي المواضيع",
      "module.completed": "مكتمل",
      "module.learning": "تحت التعلم",
      "module.gaps": "فجوات المعرفة",
      "module.all_categories": "جميع الفئات",
      "module.all_statuses": "جميع الحالات",
      "module.all_priorities": "جميع الأولويات",
      "module.add_gap": "+ أضف فجوة معرفة",
      "module.no_data": "ابدأ بإضافة أول موضوع تريد تعلمه.",
      "module.categories_title": "الفئات",
      "module.categories_add": "+ أضف فئة",
      "module.categories_edit": "تعديل",
      "module.categories_delete": "حذف",
      "module.categories_activate": "تفعيل",
      "module.categories_deactivate": "تعطيل",
      "module.categories_management": "إدارة الفئات",

      // ── Topics ──────────────────────────────────────────────────
      "topics.table.topic": "الموضوع",
      "topics.table.module": "الوحدة",
      "topics.table.category": "الفئة",
      "topics.table.status": "الحالة",
      "topics.table.priority": "الأولوية",
      "topics.table.progress": "التقدم",
      "topics.table.last_review": "آخر مراجعة",
      "topics.table.next_review": "المراجعة القادمة",
      "topics.empty": "لا توجد فجوات معرفة بعد.",
      "topics.empty_hint": "ابدأ بإضافة أول موضوع تريد تعلمه.",
      "topics.add_title": "أضف فجوة معرفة",
      "topics.add_topic_name": "اسم الموضوع",
      "topics.add_topic_name_ph": "مثال: تقييم المخزون",
      "topics.add_module": "الوحدة",
      "topics.add_category": "الفئة",
      "topics.add_description": "الوصف",
      "topics.add_description_ph": "وصف مختصر لهذا الموضوع",
      "topics.add_priority": "الأولوية",
      "topics.add_current_understanding": "الفهم الحالي",
      "topics.add_current_understanding_ph": "ما تعرفه بالفعل عن هذا الموضوع",
      "topics.add_what_dont_know": "ما لا أعرفه",
      "topics.add_what_dont_know_ph": "مثال: الفرق بين FIFO و Average Cost",
      "topics.add_what_need_to_learn": "ما أحتاج لتعلمه",
      "topics.add_what_need_to_learn_ph": "مثال: إزاي تقييم المخزون بيأثر على القيود المحاسبية",
      "topics.add_save": "حفظ",
      "topics.add_success": "تم إضافة الموضوع بنجاح.",
      "topics.delete_confirm": "هل أنت متأكد من حذف هذا الموضوع؟ لا يمكن التراجع.",
      "topics.deleted": "تم حذف الموضوع.",
      "topics.name_required": "اسم الموضوع والوحدة مطلوبان.",
      "topics.not_found": "الموضوع غير موجود.",
      "topics.updated": "تم تحديث الموضوع بنجاح.",
      "topics.status_updated": "تم تحديث الحالة.",
      "topics.progress_updated": "تم تحديث التقدم.",
      "topics.invalid_status": "حالة غير صالحة.",
      "topics.loading": "جارٍ تحميل الموضوع...",

      // ── Knowledge Tabs ──────────────────────────────────────────
      "knowledge.tab_knowledge": "المعرفة",
      "knowledge.tab_business": "الأعمال و ERP",
      "knowledge.tab_practical": "التطبيق العملي",
      "knowledge.tab_reviews": "المراجعات",
      "knowledge.what_i_know": "ما أعرفه",
      "knowledge.what_i_know_ph": "ما تعرفه بالفعل عن هذا الموضوع",
      "knowledge.what_i_dont_know": "ما لا أعرفه",
      "knowledge.what_i_dont_know_ph": "ما لا يزال غامضاُ",
      "knowledge.what_i_need_to_learn": "ما أحتاج لتعلمه",
      "knowledge.what_i_need_to_learn_ph": "ما لا يزال تحتاج دراسته أو ممارسته",
      "knowledge.notes": "ملاحظات",
      "knowledge.save": "حفظ المعرفة",
      "knowledge.updated": "تم تحديث المعرفة بنجاح.",
      "knowledge.business_section": "فهم الأعمال",
      "knowledge.business_label": "سيناريو الأعمال، القواعد، العملية، المدخلات والمخرجات",
      "knowledge.business_ph": "مثال: سيناريو الأعمال / قواعد الأعمال / عملية الأعمال / المدخلات / المخرجات",
      "knowledge.erp_section": "فهم ERP",
      "knowledge.erp_label": "الشاشات، الحقول，الإعدادات，المعاملات，الأثر والتقارير",
      "knowledge.erp_ph": "مثال: الشاشات / الحقول / الإعدادات / المعاملات / الأثر المحاسبي / أثر المخزون / التقارير",
      "knowledge.practical_section": "الخبرة العملية",
      "knowledge.practical_label": "سيناريو حقيقي، حالة اختبار，مشكلة وحل",
      "knowledge.practical_ph": "مثال: سيناريو حقيقي / حالة اختبار / مشكلة / حل",

      // ── Reviews ─────────────────────────────────────────────────
      "reviews.mark_as_reviewed": "تحديد كمراجعة",
      "reviews.understanding": "مستوى الفهم",
      "reviews.weak": "ضعيف",
      "reviews.good": "جيد",
      "reviews.strong": "قوي",
      "reviews.notes_label": "ملاحظات",
      "reviews.notes_ph": "ماذا رسخت في هذه المراجعة؟",
      "reviews.next_review_days": "المراجعة التالية (أيام)",
      "reviews.mark_btn": "تحديد كمراجعة",
      "reviews.history_title": "سجل المراجعات",
      "reviews.date": "التاريخ",
      "reviews.no_reviews": "لا توجد مراجعات مسجلة لهذا الموضوع بعد.",
      "reviews.review_completed": "تمت المراجعة.",
      "reviews.overdue": "متأخر",
      "reviews.due_today": "مستحق اليوم",
      "reviews.due_this_week": "مستحق هذا الأسبوع",
      "reviews.recently_learned": "تعلم مؤخراُ",
      "reviews.no_due": "لا توجد مواضيع مستحقة للمراجعة.",
      "reviews.no_mastered": "لم يتم الإتقان بعد.",

      // ── Analytics ───────────────────────────────────────────────
      "analytics.title": "التحليلات",
      "analytics.progress_by_module": "التقدم حسب الوحدة",
      "analytics.topics_by_status": "المواضيع حسب الحالة",
      "analytics.topics_by_priority": "المواضيع حسب الأولوية",
      "analytics.knowledge_gaps_by_module": "فجوات المعرفة حسب الوحدة",
      "analytics.strongest_modules": "أقوى الوحدات",
      "analytics.weakest_modules": "أضعف الوحدات",
      "analytics.mastered_topics": "مواضيع تم إتقانها",
      "analytics.needing_review": "تحتاج مراجعة",
      "analytics.total_reviews": "إجمالي المراجعات المسجلة",
      "analytics.learning_over_time": "تقدم التعلم مع الوقت",
      "analytics.mastered_on": "تاريخ الإتقان",
      "analytics.no_mastered_yet": "لا توجد مواضيع تم إتقانها بعد — سيظهر الجدول مع تقدمك.",
      "analytics.loading": "جارٍ تحميل التحليلات...",
      "analytics.no_data": "لا توجد بيانات بعد.",
      "analytics.not_enough_data": "البيانات غير كافية بعد.",

      // ── Profile ─────────────────────────────────────────────────
      "profile.title": "الملف الشخصي",
      "profile.account": "الحساب",
      "profile.overall_progress": "التقدم الكلي",
      "profile.account_created": "تاريخ إنشاء الحساب",
      "profile.last_login": "آخر دخول",
      "profile.full_name_label": "الاسم الكامل",
      "profile.username_label": "اسم المستخدم",
      "profile.email_label": "البريد الإلكتروني",
      "profile.save_changes": "حفظ التغييرات",
      "profile.changed_successfully": "تم تحديث الملف الشخصي بنجاح.",
      "profile.change_password": "تغيير كلمة المرور",
      "profile.current_password": "كلمة المرور الحالية",
      "profile.new_password": "كلمة المرور الجديدة",
      "profile.confirm_new_password": "تأكيد كلمة المرور الجديدة",
      "profile.change_pwd_btn": "تغيير كلمة المرور",
      "profile.pwd_changed_successfully": "تم تغيير كلمة المرور بنجاح.",
      "profile.current_pwd_incorrect": "كلمة المرور الحالية غير صحيحة.",
      "profile.new_pwd_min_8": "يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.",
      "profile.new_passwords_no_match": "كلمات المرور الجديدة غير متطابقة.",
      "profile.email_invalid": "عنوان بريد إلكتروني غير صالح.",
      "profile.email_taken": "البريد الإلكتروني مسجل بالفعل.",

      // ── Admin ───────────────────────────────────────────────────
      "admin.title": "الإدارة",
      "admin.total_users": "إجمالي المستخدمين",
      "admin.active_users": "المستخدمين النشطين",
      "admin.new_users_30d": "مستخدمون جدد (30 يوم)",
      "admin.name": "الاسم",
      "admin.role": "الدور",
      "admin.progress": "التقدم",
      "admin.topics_count": "المواضيع",
      "admin.last_login_col": "آخر دخول",
      "admin.access_required": "يحتاج صلاحية إدارة.",
      "admin.loading": "جارٍ تحميل صفحة الإدارة...",

      // ── General UI ──────────────────────────────────────────────
      "general.loading": "جارٍ التحميل...",
      "general.loading_dashboard": "جارٍ تحميل لوحة التحكم...",
      "general.loading_module": "جارٍ تحميل الوحدة...",
      "general.loading_gaps": "جارٍ تحميل فجوات المعرفة...",
      "general.loading_review": "جارٍ تحميل مركز المراجعة...",
      "general.loading_profile": "جارٍ تحميل الملف الشخصي...",
      "general.searching": "جارٍ البحث...",
      "general.page_not_found": "الصفحة غير موجودة",
      "general.use_sidebar": "استخدم القائمة الجانبية للتنقل.",
      "general.something_went_wrong": "حدث خطأ ما",
      "general.save": "حفظ",
      "general.cancel": "إلغاء",
      "general.delete": "حذف",
      "general.edit": "تعديل",
      "general.add": "إضافة",
      "general.back": "رجوع",
      "general.yes": "نعم",
      "general.no": "لا",
      "general.close": "إغلاق",
      "general.active": "نشط",
      "general.inactive": "غير نشط",
      "general.search_results": "نتائج البحث",

      // ── Status Values ───────────────────────────────────────────
      "status.not_started": "غير شروع",
      "status.learning": "تحت التعلم",
      "status.understood": "مفهوم",
      "status.practiced": "تم التطبيق",
      "status.mastered": "إتقان",

      // ── Priority Values ─────────────────────────────────────────
      "priority.low": "منخفض",
      "priority.medium": "متوسط",
      "priority.high": "عالي",
      "priority.critical": "حرج",

      // ── Category Management ─────────────────────────────────────
      "categories.title": "الفئات",
      "categories.add": "+ أضف فئة",
      "categories.table.category": "الفئة",
      "categories.table.description": "الوصف",
      "categories.table.topics_count": "المواضيع",
      "categories.table.status": "الحالة",
      "categories.table.actions": "الإجراءات",
      "categories.add_title": "أضف فئة",
      "categories.edit_title": "تعديل الفئة",
      "categories.name_en": "الاسم (بالإنجليزية)",
      "categories.name_en_ph": "مثال: Inventory Valuation",
      "categories.name_ar": "الاسم (بالعربية)",
      "categories.name_ar_ph": "مثال: تقييم المخزون",
      "categories.description_label": "الوصف",
      "categories.description_ph": "وصف اختياري",
      "categories.active_label": "نشط",
      "categories.save_category": "حفظ الفئة",
      "categories.add_success": "تم إضافة الفئة بنجاح.",
      "categories.update_success": "تم تحديث الفئة بنجاح.",
      "categories.delete_confirm": "هل أنت متأكد من حذف هذه الفئة؟",
      "categories.deleted": "تم حذف الفئة.",
      "categories.has_topics": "لا يمكن حذف هذه الفئة لأنها تحتوي على مواضيع مرتبطة بها.",
      "categories.deactivate": "تعطيل",
      "categories.activate": "تفعيل",
      "categories.name_required": "اسم الفئة مطلوب.",
      "categories.not_found": "الفئة غير موجودة.",

      // ── Language ────────────────────────────────────────────────
      "lang.switch": "اللغة",
      "lang.english": "English",
      "lang.arabic": "العربية",

      // ── Toast Messages ──────────────────────────────────────────
      "toast.network_error": "خطأ في الاتصال بالخادم.",
      "toast.unexpected_response": "استجابة غير متوقعة من الخادم.",
      "toast.login_success": "تم تسجيل الدخول بنجاح",
      "toast.topic_added": "تم إضافة الموضوع بنجاح",
      "toast.topic_deleted": "تم حذف الموضوع",
      "toast.status_updated": "تم تحديث الحالة",
      "toast.progress_updated": "تم تحديث التقدم",
      "toast.knowledge_updated": "تم تحديث المعرفة بنجاح",
      "toast.review_completed": "تمت المراجعة",
      "toast.profile_updated": "تم تحديث الملف الشخصي بنجاح",
      "toast.password_changed": "تم تغيير كلمة المرور بنجاح",
      "toast.category_added": "تم إضافة الفئة بنجاح",
      "toast.category_updated": "تم تحديث الفئة بنجاح",
      "toast.category_deleted": "تم حذف الفئة",
      "toast.session_expired": "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",

      // ── Search ──────────────────────────────────────────────────
      "search.placeholder": "ابحث عن مواضيع عبر جميع الوحدات...",
      "search.empty_hint": "جرب مصطلح بحث مختلف.",
      "search.results_for": 'بحث: "{{q}}"',
    }
  };

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  let currentLocale = 'en';

  function getLocale() { return currentLocale; }
  function isRTL() { return currentLocale === 'ar'; }

  function t(key, vars) {
    var str = (translations[currentLocale] && translations[currentLocale][key]) ||
              (translations['en'][key]) ||
              key;
    if (!vars) return str;
    return str.replace(/\{\{(\w+)\}\}/g, function(_, k) {
      return vars[k] !== undefined ? vars[k] : '{{' + k + '}}';
    });
  }

  function setLocale(locale) {
    if (!translations[locale]) return;
    currentLocale = locale;
    localStorage.setItem('erp_tracker_locale', locale);
    applyDirection(locale);
    if (window.__onLocaleChanged) window.__onLocaleChanged(locale);
  }

  function applyDirection(locale) {
    var dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
    document.body.setAttribute('data-lang', locale);
  }

  function init() {
    var saved = localStorage.getItem('erp_tracker_locale');
    if (saved && translations[saved]) {
      currentLocale = saved;
      applyDirection(saved);
    }
  }

  function getCategoryName(cat) {
    if (!cat) return '—';
    return currentLocale === 'ar' && cat.name_ar ? cat.name_ar : (cat.name_en || '—');
  }

  function getModuleName(mod) {
    if (!mod) return '—';
    return currentLocale === 'ar' && mod.name_ar ? mod.name_ar : (mod.name_en || '—');
  }

  function statusLabel(status) {
    return t('status.' + (status || '').toLowerCase().replace(/\s+/g, '_'));
  }

  function priorityLabel(priority) {
    return t('priority.' + (priority || '').toLowerCase());
  }

  return {
    t, setLocale, getLocale, isRTL, init,
    getCategoryName, getModuleName, statusLabel, priorityLabel,
    translations: Object.keys(translations)
  };
})();

window.I18N = I18N;
