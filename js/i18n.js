/**
 * js/i18n.js
 * Centralized translation system. Every user-facing string in the app goes
 * through I18n.t('namespace.key') — no hardcoded text in the view files.
 * Handles language persistence (localStorage before login, User.language
 * after login) and flips the whole document to RTL for Arabic.
 */

const I18N_LANG_KEY = 'erp_tracker_lang';

const I18N_DICT = {
  en: {
    app: { name: 'ERP Knowledge & Learning Tracker', tagline: 'LEARNING LEDGER' },

    common: {
      save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', close: 'Close',
      activate: 'Activate', deactivate: 'Deactivate', search: 'Search', actions: 'Actions',
      yes: 'Yes', no: 'No', confirm: 'Confirm', loading: 'Loading...', saving: 'Saving...',
      all: 'All', description: 'Description', status: 'Status', active: 'Active', inactive: 'Inactive',
      name: 'Name', total: 'Total', notFound: 'Not found', notFoundHint: 'Use the sidebar to navigate.',
      exportPdf: 'Export PDF', exportCsv: 'Export CSV', tags: 'Tags', addTags: 'Add Tags (comma separated)',
      pin: 'Pin', unpin: 'Unpin', pinned: 'Pinned', targetDate: 'Target Date', learningGoals: 'Learning Goals',
      daysLeft: 'days left', overdue: 'Overdue', attachImage: 'Attach Image / Screenshot',
      pasteImage: 'Click or Paste Image (Ctrl+V)', removeImage: 'Remove Image',
      filterByTag: 'Filter by Tag', filterByPriority: 'Filter by Priority', filterByStatus: 'Filter by Status'
    },

    nav: {
      dashboard: 'Dashboard', modules: 'Modules', learning: 'Learning',
      allNotes: 'All Notes', favorites: 'Favorites', aiInsights: 'AI Daily Insights',
      knowledgeGaps: 'Knowledge Gaps', reviewCenter: 'Review Center', analytics: 'Analytics', systemTest: '🧪 System Test',
      account: 'Account', myProfile: 'My Profile', administration: 'Administration', logout: 'Logout',
      searchPlaceholder: 'Search topics across all modules...', quickAdd: '+ Quick Add'
    },

    ai: {
      sectionTitle: 'AI Daily Insights',
      refreshBtn: 'Refresh Insights',
      refreshConfirmTitle: 'Generate New Insights?',
      refreshConfirmBody: 'Generate new insights for this module? This may use another AI request.',
      example: 'Practical Example',
      whyItMatters: 'Why It Matters',
      favoriteAdd: 'Favorite',
      favoriteRemove: 'Remove Favorite',
      loadingSkeleton: 'AI is generating daily ERP insights...',
      error: 'Unable to load AI insights right now.'
    },

    favorites: {
      title: 'Bookmarked AI Insights',
      subtitle: 'Your saved tips, tricks, best practices, and ERP insights across all modules.',
      searchPlaceholder: 'Search favorites by title, content, or type...',
      allTypes: 'All Types',
      noFavorites: 'No favorites saved yet.',
      noFavoritesHint: 'Click ⭐ Favorite on any AI Insight in any module to save it here for quick access.',
      removedToast: 'Removed from favorites'
    },

    aiSettings: {
      title: 'AI Configuration & Model Settings',
      enableAI: 'Enable AI Insights',
      apiEndpoint: 'API Endpoint (OpenAI Compatible)',
      model: 'AI Model',
      apiKey: 'API Key (Script Property)',
      apiKeyHint: 'Stored securely in Google Apps Script properties — never exposed in code.',
      dailyCount: 'Daily Insights Count',
      testConnection: 'Test AI Connection',
      connectionSuccess: 'AI connection successful!',
      connectionTesting: 'Testing AI connection...',
      saveSuccess: 'AI settings updated successfully!'
    },

    auth: {
      login: 'Log In', signup: 'Sign Up', usernameOrEmail: 'Username or Email',
      password: 'Password', confirmPassword: 'Confirm Password', rememberMe: 'Remember me',
      fullName: 'Full Name', username: 'Username', email: 'Email',
      createAccount: 'Create Account', loginButton: 'Log In'
    },

    dashboard: {
      title: 'Dashboard', overallProgress: 'Overall Progress', totalTopics: 'Total Topics',
      notStarted: 'Not Started', learning: 'Learning', understood: 'Understood', practiced: 'Practiced',
      mastered: 'Mastered', knowledgeGaps: 'Knowledge Gaps', toReview: 'To Review',
      overdueAndDue: '{{overdue}} overdue · {{due}} due today for review.',
      goToReview: 'Go to Review Center', modulesHeading: 'Modules',
      currentStreak: 'Current Streak', longestStreak: 'Longest Streak', studyStreak: 'Study Streak'
    },

    shortcuts: {
      title: 'Keyboard Shortcuts', search: 'Focus Search', addTopic: 'Add New Topic',
      closeModal: 'Close Modal', dashboard: 'Go to Dashboard', modules: 'Go to Modules',
      review: 'Go to Review Center', analytics: 'Go to Analytics', notes: 'Go to All Notes',
      cheatSheet: 'Show Keyboard Shortcuts', toastHint: 'Press / to search, N to add topic, ? for shortcuts'
    },

    digest: {
      receiveWeeklyDigest: 'Receive weekly progress digest emails', sendTestDigest: 'Send Test Digest Email',
      testDigestSent: 'Test digest email sent successfully!'
    },

    backup: {
      title: 'Data Backup & Recovery', exportData: 'Export My Data (JSON)', importData: 'Import Backup (JSON)',
      importConfirm: 'Are you sure? Importing a backup will replace your current Topics, Knowledge, Reviews, Notes, and Streaks data.',
      importSuccess: 'Backup imported successfully!', importError: 'Failed to import backup. Please verify the JSON file format.'
    },

    module: {
      moduleProgress: 'Module Progress', totalTopics: 'Total Topics', completed: 'Completed',
      learning: 'Learning', knowledgeGaps: 'Knowledge Gaps', mastered: 'Mastered',
      allCategories: 'All Categories', allStatuses: 'All Statuses', allPriorities: 'All Priorities',
      addKnowledgeGap: '+ Add Knowledge Gap', categoriesSection: 'Categories', addCategory: '+ Add Category',
      manageCategoriesHint: 'Manage the categories used to organize topics in this module.'
    },

    table: {
      topic: 'Topic', module: 'Module', category: 'Category', status: 'Status', priority: 'Priority',
      progress: 'Progress', lastReview: 'Last Review', nextReview: 'Next Review',
      topicsCount: 'Topics', name: 'Name', description: 'Description'
    },

    status: { 'Not Started': 'Not Started', 'Learning': 'Learning', 'Understood': 'Understood', 'Practiced': 'Practiced', 'Mastered': 'Mastered' },
    priority: { 'Low': 'Low', 'Medium': 'Medium', 'High': 'High', 'Critical': 'Critical' },

    addTopic: {
      title: 'Add Knowledge Gap', topicName: 'Topic Name', topicNamePlaceholder: 'e.g. Stock Valuation',
      module: 'Module', category: 'Category', description: 'Description',
      descriptionPlaceholder: 'Short context for this topic', priority: 'Priority',
      currentUnderstanding: 'Current Understanding', currentUnderstandingPlaceholder: 'What you already understand, if anything',
      whatIDontKnow: "What I Don't Know", whatIDontKnowPlaceholder: "What's still unclear",
      whatINeedToLearn: 'What I Need To Learn', whatINeedToLearnPlaceholder: 'What you still need to study or practice',
      save: 'Save'
    },

    topicDetail: {
      tabKnowledge: 'Knowledge', tabBusiness: 'Business & ERP', tabPractical: 'Practical', tabReviews: 'Reviews',
      whatIKnow: 'What I Know', whatIKnowPlaceholder: 'What you already understand about this topic',
      whatIDontKnow: "What I Don't Know", whatIDontKnowPlaceholder: "What's still unclear",
      whatINeedToLearn: 'What I Need To Learn', whatINeedToLearnPlaceholder: 'What you still need to study or practice',
      notes: 'Notes', notesPlaceholder: 'Any additional notes',
      saveKnowledge: 'Save Knowledge', save: 'Save',
      businessUnderstanding: 'Business Understanding', businessPlaceholder: 'e.g. Business Scenario / Business Rules / Business Process / Inputs / Outputs',
      erpUnderstanding: 'ERP Understanding', erpPlaceholder: 'e.g. Screens / Fields / Configuration / Transactions / Accounting Impact / Inventory Impact / Reports',
      practicalExperience: 'Practical Experience', practicalPlaceholder: 'e.g. Real Scenario / Test Case / Issue / Solution',
      deleteTopic: 'Delete', confirmDeleteTopic: 'Delete this topic? This cannot be undone.'
    },

    reviews: {
      markAsReviewed: 'Mark As Reviewed', understandingLevel: 'Understanding Level',
      weak: 'Weak', good: 'Good', strong: 'Strong', notes: 'Notes',
      notesPlaceholder: 'What did you reinforce in this review?', nextReviewDays: 'Next Review In (days)',
      submit: 'Mark as Reviewed', reviewHistory: 'Review History', noReviewsYet: 'No reviews logged yet for this topic.',
      date: 'Date', understanding: 'Understanding', notesCol: 'Notes',
      overdue: 'Overdue', dueToday: 'Due Today', dueThisWeek: 'Due This Week', recentlyLearned: 'Recently Learned',
      noTopicsDue: 'No topics are due for review.', nothingMastered: 'Nothing mastered yet.', completed: 'Completed'
    },

    analytics: {
      title: 'Analytics', progressByModule: 'Progress by Module', topicsByStatus: 'Topics by Status',
      topicsByPriority: 'Topics by Priority', knowledgeGapsByModule: 'Knowledge Gaps by Module',
      strongestModules: 'Strongest Modules', weakestModules: 'Weakest Modules',
      masteredTopics: 'Mastered Topics', needingReview: 'Needing Review', totalReviewsLogged: 'Total Reviews Logged',
      learningOverTime: 'Learning Progress Over Time', masteredOn: 'Mastered On',
      noDataYet: 'No data yet.', notEnoughData: 'Not enough data yet.',
      noTimelineYet: 'No mastered topics yet — timeline will fill in as you progress.'
    },

    profile: {
      account: 'Account', fullName: 'Full Name', username: 'Username', email: 'Email',
      saveChanges: 'Save Changes', changePassword: 'Change Password', currentPassword: 'Current Password',
      newPassword: 'New Password', confirmNewPassword: 'Confirm New Password',
      overallProgress: 'Overall Progress', accountCreated: 'Account Created', lastLogin: 'Last Login',
      language: 'Language'
    },

    admin: {
      title: 'Administration', totalUsers: 'Total Users', activeUsers: 'Active Users', newUsers: 'New Users (30d)',
      name: 'Name', username: 'Username', role: 'Role', progress: 'Progress', topics: 'Topics', lastLogin: 'Last Login'
    },

    categories: {
      title: 'Categories', addCategory: 'Add Category', editCategory: 'Edit Category',
      nameEn: 'Category Name (English)', nameAr: 'Category Name (Arabic)', description: 'Description',
      status: 'Status', active: 'Active', inactive: 'Inactive', topicsCount: 'Topics',
      confirmDelete: 'Delete this category?', hasTopicsError: 'This category contains topics and cannot be deleted.',
      deactivateInstead: 'You can deactivate it instead so it no longer appears for new topics.',
      created: 'Category created successfully.', updated: 'Category updated successfully.',
      deleted: 'Category deleted.', statusUpdated: 'Category status updated.', noCategories: 'No categories in this module yet.'
    },

    notes: {
      title: 'Module Notes', notesSection: 'Notes', addNote: '+ Add Note', editNote: 'Edit Note', deleteNote: 'Delete Note', viewNote: 'View Note',
      noteTitle: 'Note Title', sectionName: 'Section Name', content: 'Note Content',
      noteTitlePlaceholder: 'e.g. Stock Valuation Summary', sectionNamePlaceholder: 'e.g. Sales Cycle, Inventory Settings',
      contentPlaceholder: 'Write your note here...', searchPlaceholder: 'Search notes by title, section, or content...',
      noNotes: 'No notes in this module yet.', addFirstNote: 'Add your first note to capture key knowledge for this module.',
      noSearchResults: 'No notes match your search criteria.',
      confirmDelete: 'Are you sure you want to delete this note? This cannot be undone.',
      created: 'Note saved successfully.', updated: 'Note updated successfully.', deleted: 'Note deleted successfully.',
      createdAt: 'Created', updatedAt: 'Updated', uncategorized: 'General Notes',
      view: 'View', edit: 'Edit', delete: 'Delete', search: 'Search Notes'
    },

    empty: {
      noKnowledgeGaps: 'No knowledge gaps yet.', startAdding: 'Start by adding the first topic you want to learn.',
      noOpenGaps: 'No open knowledge gaps right now — nice work.', tryDifferentSearch: 'Try a different search term.'
    },

    toast: {
      loginSuccessful: 'Login successful', topicAdded: 'Topic added successfully', topicDeleted: 'Topic deleted',
      statusUpdated: 'Status updated', progressUpdated: 'Progress updated', knowledgeUpdated: 'Knowledge updated successfully',
      reviewCompleted: 'Review completed', profileUpdated: 'Profile updated successfully', passwordChanged: 'Password changed successfully',
      accountCreated: 'Account created. Logging you in...', noteSaved: 'Note saved successfully', noteUpdated: 'Note updated successfully',
      noteDeleted: 'Note deleted'
    },

    errors: {
      NOTE_NOT_FOUND: 'Note not found.', NOTE_FIELDS_REQUIRED: 'Title and content are required.',
      SESSION_EXPIRED: 'Session expired. Please log in again.', ACCOUNT_DISABLED: 'Account is not active.',
      REQUIRED_FIELDS: 'All fields are required.', PASSWORDS_MISMATCH: 'Passwords do not match.',
      WEAK_PASSWORD: 'Password must be at least 8 characters.', INVALID_EMAIL: 'Invalid email address.',
      USERNAME_TAKEN: 'Username is already taken.', EMAIL_TAKEN: 'Email is already registered.',
      INVALID_CREDENTIALS: 'Invalid credentials.', CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect.',
      TOPIC_NOT_FOUND: 'Topic not found.', CATEGORY_NOT_FOUND: 'Category not found.',
      CATEGORY_HAS_TOPICS: 'This category contains topics and cannot be deleted.',
      CATEGORY_FIELDS_REQUIRED: 'Module, English name and Arabic name are required.',
      MODULE_NOT_FOUND: 'Module not found.', ADMIN_REQUIRED: 'Admin access required.',
      INVALID_STATUS: 'Invalid status.', UNKNOWN_ACTION: 'Something went wrong.',
      SERVER_ERROR: 'Server error. Please try again.', NETWORK_ERROR: 'Network error contacting the API.',
      NOT_CONFIGURED: 'API_URL is not configured. Edit config.js after deploying Code.gs.',
      ERROR: 'Something went wrong.'
    }
  },

  ar: {
    app: { name: 'متتبع معرفة ERP والتعلّم', tagline: 'سجل التعلّم' },

    common: {
      save: 'حفظ', cancel: 'إلغاء', edit: 'تعديل', delete: 'حذف', close: 'إغلاق',
      activate: 'تفعيل', deactivate: 'إلغاء التفعيل', search: 'بحث', actions: 'إجراءات',
      yes: 'نعم', no: 'لا', confirm: 'تأكيد', loading: 'جاري التحميل...', saving: 'جاري الحفظ...',
      all: 'الكل', description: 'الوصف', status: 'الحالة', active: 'مفعّل', inactive: 'غير مفعّل',
      name: 'الاسم', total: 'الإجمالي', notFound: 'غير موجود', notFoundHint: 'استخدم القائمة الجانبية للتنقل.',
      exportPdf: 'تصدير PDF', exportCsv: 'تصدير CSV / اكسل', tags: 'الوسوم (التاجات)', addTags: 'إضافة تاجات (مفصولة بفواصل)',
      pin: 'تثبيت', unpin: 'إلغاء التثبيت', pinned: 'مثبت', targetDate: 'تاريخ المستهدف', learningGoals: 'أهداف التعلم',
      daysLeft: 'أيام متبقية', overdue: 'متأخر', attachImage: 'إرفاق صورة / سكرين شوت',
      pasteImage: 'انقر أو الصق صورة (Ctrl+V)', removeImage: 'إزالة الصورة',
      filterByTag: 'تصفية بحسب التاج', filterByPriority: 'تصفية بحسب الأولوية', filterByStatus: 'تصفية بحسب الحالة'
    },

    nav: {
      dashboard: 'لوحة التحكم', modules: 'الموديولات', learning: 'التعلّم',
      allNotes: 'جميع الملاحظات', favorites: 'المفضلة', aiInsights: 'رؤى الذكاء الاصطناعي',
      knowledgeGaps: 'فجوات المعرفة', reviewCenter: 'مركز المراجعة', analytics: 'التحليلات', systemTest: '🧪 الاختبار والتشخيص',
      myProfile: 'ملفي الشخصي', administration: 'الإدارة', account: 'الحساب', logout: 'تسجيل الخروج',
      searchPlaceholder: 'ابحث عن أي موضوع في كل الموديولات...', quickAdd: '+ إضافة سريعة'
    },

    ai: {
      sectionTitle: '✨ نصائح ورؤى الذكاء الاصطناعي اليومية (AI Daily Insights)',
      refreshBtn: 'توليد insights جديدة',
      refreshConfirmTitle: 'توليد نصائح ورؤى جديدة؟',
      refreshConfirmBody: 'هل تريد إنشاء Insights جديدة لهذا الموديول؟ قد يتم استهلاك طلب جديد من خدمة الذكاء الاصطناعي.',
      example: '💡 مثال عملي',
      whyItMatters: '🎯 لماذا هذه المعلومة مهمة؟',
      favoriteAdd: 'إضافة للمفضلة',
      favoriteRemove: 'إزالة من المفضلة',
      loadingSkeleton: 'جاري توليد رؤى ونصائح ERP الذكية لهذا الموديول...',
      error: 'تعذر تحميل رؤى الذكاء الاصطناعي حالياً.'
    },

    favorites: {
      title: '⭐ المفضلة (AI Insights)',
      subtitle: 'جميع النصائح والأفكار والممارسات الأفضل التي قمت بحفظها عبر الموديولات المختلفة.',
      searchPlaceholder: 'ابحث في المفضلة حسب العنوان، المحتوى، أو النوع...',
      allTypes: 'جميع الأنواع',
      noFavorites: 'لا توجد عناصر محفوظة في المفضلة بعد.',
      noFavoritesHint: 'انقر على زر ⭐ إضافة للمفضلة في أي كارد AI Insight داخل الموديولات ليتم حفظه هنا للرجوع إليه في أي وقت.',
      removedToast: 'تمت إزالة العنصر من المفضلة'
    },

    aiSettings: {
      title: 'إعدادات الذكاء الاصطناعي (AI Settings)',
      enableAI: 'تفعيل ميزة الذكاء الاصطناعي (AI Insights)',
      apiEndpoint: 'عنوان الـ API Endpoint (OpenAI-Compatible)',
      model: 'نموذج الذكاء الاصطناعي (AI Model)',
      apiKey: 'مفتاح الـ API Key (Script Property)',
      apiKeyHint: 'يتم حفظ المفتاح بأمان تام داخل Google Apps Script Properties ولا يظهر في الكود إطلاقاً.',
      dailyCount: 'عدد الـ Insights اليومية لكل موديول',
      testConnection: 'اختبار الاتصال بالـ AI',
      connectionSuccess: 'تم الاتصال بالذكاء الاصطناعي بنجاح!',
      connectionTesting: 'جاري اختبار الاتصال بالذكاء الاصطناعي...',
      saveSuccess: 'تم حفظ إعدادات الذكاء الاصطناعي بنجاح!'
    },

    auth: {
      login: 'تسجيل الدخول', signup: 'إنشاء حساب', usernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني',
      password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور', rememberMe: 'تذكرني',
      fullName: 'الاسم الكامل', username: 'اسم المستخدم', email: 'البريد الإلكتروني',
      createAccount: 'إنشاء الحساب', loginButton: 'تسجيل الدخول'
    },

    dashboard: {
      title: 'لوحة التحكم', overallProgress: 'التقدم الإجمالي', totalTopics: 'إجمالي المواضيع',
      notStarted: 'لم يبدأ', learning: 'قيد التعلّم', understood: 'مفهوم', practiced: 'تم التطبيق',
      mastered: 'مُتقَن', knowledgeGaps: 'فجوات المعرفة', toReview: 'للمراجعة',
      overdueAndDue: '{{overdue}} متأخر · {{due}} مستحق اليوم للمراجعة.',
      goToReview: 'الذهاب لمركز المراجعة', modulesHeading: 'الموديولات',
      currentStreak: 'سلسلة الأيام الحالية', longestStreak: 'أطول سلسلة متواصلة', studyStreak: 'سلسلة التعلّم المتواصل'
    },

    shortcuts: {
      title: 'اختصارات لوحة المفاتيح', search: 'التركيز على شريط البحث', addTopic: 'إضافة موضوع جديد',
      closeModal: 'إغلاق النافذة المنبثقة', dashboard: 'الانتقال للوحة التحكم', modules: 'الانتقال للموديولات',
      review: 'الانتقال لمركز المراجعة', analytics: 'الانتقال للتحليلات', notes: 'الانتقال لجميع الملاحظات',
      cheatSheet: 'عرض قائمة اختصارات الكيبورد', toastHint: 'اضغط / للبحث، N لإضافة موضوع، ? لمشاهدة الاختصارات'
    },

    digest: {
      receiveWeeklyDigest: 'استلام التقرير الأسبوعي الملخص عبر البريد الإلكتروني', sendTestDigest: 'إرسال بريد تجريبي ملخص',
      testDigestSent: 'تم إرسال بريد الملخص الأسبوعي التجريبي بنجاح!'
    },

    backup: {
      title: 'نسخ البيانات احتياطياً واستعادتها', exportData: 'تصدير بياناتي بالكامل (JSON)', importData: 'استعادة نسخة احتياطية (JSON)',
      importConfirm: 'هل أنت تأكد؟ استعادة نسخة احتياطية ستقوم باستبدال كافة البيانات الحالية للمواضيع، المعرفة، المراجعات، الملاحظات، والسلاسل.',
      importSuccess: 'تمت استعادة النسخة الاحتياطية بنجاح!', importError: 'فشلت عملية استعادة النسخة الاحتياطية. يرجى التأكد من صحة ملف JSON.'
    },

    module: {
      moduleProgress: 'تقدم الموديول', totalTopics: 'إجمالي المواضيع', completed: 'مكتمل',
      learning: 'قيد التعلّم', knowledgeGaps: 'فجوات المعرفة', mastered: 'مُتقَن',
      allCategories: 'كل الفئات', allStatuses: 'كل الحالات', allPriorities: 'كل الأولويات',
      addKnowledgeGap: '+ إضافة فجوة معرفية', categoriesSection: 'الفئات', addCategory: '+ إضافة فئة',
      manageCategoriesHint: 'إدارة الفئات المستخدمة لتنظيم مواضيع هذا الموديول.'
    },

    table: {
      topic: 'الموضوع', module: 'الموديول', category: 'الفئة', status: 'الحالة', priority: 'الأولوية',
      progress: 'التقدم', lastReview: 'آخر مراجعة', nextReview: 'المراجعة القادمة',
      topicsCount: 'المواضيع', name: 'الاسم', description: 'الوصف'
    },

    status: { 'Not Started': 'لم يبدأ', 'Learning': 'قيد التعلّم', 'Understood': 'مفهوم', 'Practiced': 'تم التطبيق', 'Mastered': 'مُتقَن' },
    priority: { 'Low': 'منخفضة', 'Medium': 'متوسطة', 'High': 'عالية', 'Critical': 'حرجة' },

    addTopic: {
      title: 'إضافة فجوة معرفية', topicName: 'اسم الموضوع', topicNamePlaceholder: 'مثال: تقييم المخزون',
      module: 'الموديول', category: 'الفئة', description: 'الوصف',
      descriptionPlaceholder: 'سياق مختصر لهذا الموضوع', priority: 'الأولوية',
      currentUnderstanding: 'الفهم الحالي', currentUnderstandingPlaceholder: 'ما تفهمه بالفعل، إن وجد',
      whatIDontKnow: 'ما لا أعرفه', whatIDontKnowPlaceholder: 'ما زال غير واضح',
      whatINeedToLearn: 'ما أحتاج لتعلّمه', whatINeedToLearnPlaceholder: 'ما تحتاج لدراسته أو تطبيقه',
      save: 'حفظ'
    },

    topicDetail: {
      tabKnowledge: 'المعرفة', tabBusiness: 'الأعمال و ERP', tabPractical: 'التطبيق العملي', tabReviews: 'المراجعات',
      whatIKnow: 'ما أعرفه', whatIKnowPlaceholder: 'ما تفهمه بالفعل عن هذا الموضوع',
      whatIDontKnow: 'ما لا أعرفه', whatIDontKnowPlaceholder: 'ما زال غير واضح',
      whatINeedToLearn: 'ما أحتاج لتعلّمه', whatINeedToLearnPlaceholder: 'ما تحتاج لدراسته أو تطبيقه',
      notes: 'ملاحظات', notesPlaceholder: 'أي ملاحظات إضافية',
      saveKnowledge: 'حفظ المعرفة', save: 'حفظ',
      businessUnderstanding: 'فهم الأعمال', businessPlaceholder: 'مثال: السيناريو / القواعد / العملية / المدخلات / المخرجات',
      erpUnderstanding: 'فهم النظام (ERP)', erpPlaceholder: 'مثال: الشاشات / الحقول / الإعدادات / الحركات / الأثر المحاسبي / أثر المخزون / التقارير',
      practicalExperience: 'الخبرة العملية', practicalPlaceholder: 'مثال: سيناريو واقعي / حالة اختبار / مشكلة / الحل',
      deleteTopic: 'حذف', confirmDeleteTopic: 'هل تريد حذف هذا الموضوع؟ لا يمكن التراجع عن هذا الإجراء.'
    },

    reviews: {
      markAsReviewed: 'تحديد كمُراجَع', understandingLevel: 'مستوى الفهم',
      weak: 'ضعيف', good: 'جيد', strong: 'قوي', notes: 'ملاحظات',
      notesPlaceholder: 'ماذا رسّخت في هذه المراجعة؟', nextReviewDays: 'المراجعة القادمة بعد (أيام)',
      submit: 'تحديد كمُراجَع', reviewHistory: 'سجل المراجعات', noReviewsYet: 'لا توجد مراجعات مسجلة لهذا الموضوع بعد.',
      date: 'التاريخ', understanding: 'الفهم', notesCol: 'ملاحظات',
      overdue: 'متأخر', dueToday: 'مستحق اليوم', dueThisWeek: 'مستحق هذا الأسبوع', recentlyLearned: 'تم تعلّمه مؤخراً',
      noTopicsDue: 'لا توجد مواضيع مستحقة للمراجعة.', nothingMastered: 'لا شيء تم إتقانه بعد.', completed: 'تاريخ الإتقان'
    },

    analytics: {
      title: 'التحليلات', progressByModule: 'التقدم حسب الموديول', topicsByStatus: 'المواضيع حسب الحالة',
      topicsByPriority: 'المواضيع حسب الأولوية', knowledgeGapsByModule: 'فجوات المعرفة حسب الموديول',
      strongestModules: 'أقوى الموديولات', weakestModules: 'أضعف الموديولات',
      masteredTopics: 'المواضيع المُتقَنة', needingReview: 'تحتاج مراجعة', totalReviewsLogged: 'إجمالي المراجعات المسجلة',
      learningOverTime: 'تقدّم التعلّم عبر الوقت', masteredOn: 'تاريخ الإتقان',
      noDataYet: 'لا توجد بيانات بعد.', notEnoughData: 'لا توجد بيانات كافية بعد.',
      noTimelineYet: 'لا توجد مواضيع مُتقَنة بعد — سيظهر الجدول الزمني مع تقدمك.'
    },

    profile: {
      account: 'الحساب', fullName: 'الاسم الكامل', username: 'اسم المستخدم', email: 'البريد الإلكتروني',
      saveChanges: 'حفظ التغييرات', changePassword: 'تغيير كلمة المرور', currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة', confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
      overallProgress: 'التقدم الإجمالي', accountCreated: 'تاريخ إنشاء الحساب', lastLogin: 'آخر تسجيل دخول',
      language: 'اللغة'
    },

    admin: {
      title: 'الإدارة', totalUsers: 'إجمالي المستخدمين', activeUsers: 'المستخدمون النشطون', newUsers: 'مستخدمون جدد (٣٠ يوم)',
      name: 'الاسم', username: 'اسم المستخدم', role: 'الدور', progress: 'التقدم', topics: 'المواضيع', lastLogin: 'آخر تسجيل دخول'
    },

    categories: {
      title: 'الفئات', addCategory: 'إضافة فئة', editCategory: 'تعديل الفئة',
      nameEn: 'اسم الفئة (إنجليزي)', nameAr: 'اسم الفئة (عربي)', description: 'الوصف',
      status: 'الحالة', active: 'مفعّلة', inactive: 'غير مفعّلة', topicsCount: 'المواضيع',
      confirmDelete: 'هل تريد حذف هذه الفئة؟', hasTopicsError: 'لا يمكن حذف هذه الفئة لأنها تحتوي على مواضيع مرتبطة بها.',
      deactivateInstead: 'يمكنك إلغاء تفعيلها بدلاً من ذلك حتى لا تظهر عند إضافة مواضيع جديدة.',
      created: 'تم إنشاء الفئة بنجاح.', updated: 'تم تحديث الفئة بنجاح.',
      deleted: 'تم حذف الفئة.', statusUpdated: 'تم تحديث حالة الفئة.', noCategories: 'لا توجد فئات في هذا الموديول بعد.'
    },

    notes: {
      title: 'ملاحظات الموديول', notesSection: 'الملاحظات', addNote: '+ إضافة ملاحظة', editNote: 'تعديل الملاحظة', deleteNote: 'حذف الملاحظة', viewNote: 'عرض الملاحظة',
      noteTitle: 'عنوان الملاحظة', sectionName: 'اسم القسم', content: 'محتوى الملاحظة',
      noteTitlePlaceholder: 'مثال: ملخص تقييم المخزون', sectionNamePlaceholder: 'مثال: دورة المبيعات، إعدادات المخزون',
      contentPlaceholder: 'اكتب ملاحظتك هنا...', searchPlaceholder: 'بحث في الملاحظات بالعنوان أو القسم أو المحتوى...',
      noNotes: 'لا توجد ملاحظات لهذا الموديول بعد.', addFirstNote: 'أضف أول ملاحظة لتسجيل المعرفة المهمة لهذا الموديول.',
      noSearchResults: 'لا توجد ملاحظات تطابق معايير البحث.',
      confirmDelete: 'هل أنت تأكد من رغبتك في حذف هذه الملاحظة؟ لا يمكن التراجع عن هذا الإجراء.',
      created: 'تم حفظ الملاحظة بنجاح.', updated: 'تم تحديث الملاحظة بنجاح.', deleted: 'تم حذف الملاحظة بنجاح.',
      createdAt: 'تاريخ الإنشاء', updatedAt: 'تاريخ التحديث', uncategorized: 'ملاحظات عامة',
      view: 'عرض', edit: 'تعديل', delete: 'حذف', search: 'بحث الملاحظات'
    },

    empty: {
      noKnowledgeGaps: 'لا توجد فجوات معرفية بعد.', startAdding: 'ابدأ بإضافة أول موضوع تريد تعلّمه.',
      noOpenGaps: 'لا توجد فجوات معرفية مفتوحة حالياً — عمل رائع.', tryDifferentSearch: 'جرّب كلمة بحث مختلفة.'
    },

    toast: {
      loginSuccessful: 'تم تسجيل الدخول بنجاح', topicAdded: 'تمت إضافة الموضوع بنجاح', topicDeleted: 'تم حذف الموضوع',
      statusUpdated: 'تم تحديث الحالة', progressUpdated: 'تم تحديث التقدم', knowledgeUpdated: 'تم تحديث المعرفة بنجاح',
      reviewCompleted: 'تمت المراجعة بنجاح', profileUpdated: 'تم تحديث الملف الشخصي بنجاح', passwordChanged: 'تم تغيير كلمة المرور بنجاح',
      accountCreated: 'تم إنشاء الحساب. جاري تسجيل الدخول...', noteSaved: 'تم حفظ الملاحظة بنجاح', noteUpdated: 'تم تحديث الملاحظة بنجاح',
      noteDeleted: 'تم حذف الملاحظة'
    },

    errors: {
      NOTE_NOT_FOUND: 'الملاحظة غير موجودة.', NOTE_FIELDS_REQUIRED: 'العنوان والمحتوى مطلوبان.',
      SESSION_EXPIRED: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.', ACCOUNT_DISABLED: 'الحساب غير مفعّل.',
      REQUIRED_FIELDS: 'جميع الحقول مطلوبة.', PASSWORDS_MISMATCH: 'كلمتا المرور غير متطابقتين.',
      WEAK_PASSWORD: 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.', INVALID_EMAIL: 'البريد الإلكتروني غير صالح.',
      USERNAME_TAKEN: 'اسم المستخدم مستخدم بالفعل.', EMAIL_TAKEN: 'البريد الإلكتروني مسجل بالفعل.',
      INVALID_CREDENTIALS: 'بيانات الدخول غير صحيحة.', CURRENT_PASSWORD_INCORRECT: 'كلمة المرور الحالية غير صحيحة.',
      TOPIC_NOT_FOUND: 'الموضوع غير موجود.', CATEGORY_NOT_FOUND: 'الفئة غير موجودة.',
      CATEGORY_HAS_TOPICS: 'لا يمكن حذف هذه الفئة لأنها تحتوي على مواضيع مرتبطة بها.',
      CATEGORY_FIELDS_REQUIRED: 'الموديول، والاسم بالإنجليزية والعربية مطلوبة.',
      MODULE_NOT_FOUND: 'الموديول غير موجود.', ADMIN_REQUIRED: 'يتطلب صلاحية مدير.',
      INVALID_STATUS: 'حالة غير صالحة.', UNKNOWN_ACTION: 'حدث خطأ ما.',
      SERVER_ERROR: 'خطأ في الخادم. يرجى المحاولة مرة أخرى.', NETWORK_ERROR: 'خطأ في الشبكة أثناء الاتصال بالـ API.',
      NOT_CONFIGURED: 'لم يتم إعداد API_URL. عدّل config.js بعد نشر Code.gs.',
      ERROR: 'حدث خطأ ما.'
    }
  }
};

const I18n = (function () {
  var currentLang = 'en';
  var listeners = [];

  function get(dict, path) {
    var parts = path.split('.');
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function t(key, vars) {
    var value = get(I18N_DICT[currentLang], key);
    if (value === undefined) value = get(I18N_DICT.en, key);
    if (value === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.replace(new RegExp('{{' + k + '}}', 'g'), vars[k]);
      });
    }
    return value;
  }

  function statusLabel(status) { return t('status.' + status); }
  function priorityLabel(priority) { return t('priority.' + priority); }

  // Pick the localized display name off a Module/Category object.
  function localizedName(obj) {
    if (!obj) return '';
    return currentLang === 'ar' ? (obj.name_ar || obj.name_en) : (obj.name_en || obj.name_ar);
  }

  function errorMessage(err) {
    if (err && err.code) {
      var msg = t('errors.' + err.code);
      if (msg && msg !== 'errors.' + err.code) return msg;
    }
    return (err && err.message) || t('errors.ERROR');
  }

  function applyDom() {
    var isRtl = currentLang === 'ar';
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }

  function setLang(lang, opts) {
    opts = opts || {};
    if (I18N_DICT[lang] === undefined) lang = 'en';
    currentLang = lang;
    localStorage.setItem(I18N_LANG_KEY, lang);
    applyDom();
    if (!opts.silent) listeners.forEach(function (fn) { fn(lang); });
  }

  function getLang() { return currentLang; }
  function onChange(fn) { listeners.push(fn); }

  function init() {
    var saved = localStorage.getItem(I18N_LANG_KEY) || 'en';
    setLang(saved, { silent: true });
    applyDom();
  }

  return { t: t, statusLabel: statusLabel, priorityLabel: priorityLabel, localizedName: localizedName,
    errorMessage: errorMessage, setLang: setLang, getLang: getLang, onChange: onChange, init: init };
})();
