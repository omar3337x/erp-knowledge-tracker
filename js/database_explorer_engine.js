/**
 * js/database_explorer_engine.js
 * 🗄️ Core Intelligence Engine for ERP Database Explorer & Safe Data Change Assistant
 * Source of Truth: newdatabase2026.sql (406 Verified Tables)
 */

const DatabaseExplorerEngine = (function () {

  const CONFIDENCE_LEVELS = {
    CONFIRMED: { id: 'CONFIRMED', label_ar: '🟢 مؤكد من قاعدة البيانات الحالية (newdatabase2026.sql)', label_en: '🟢 Confirmed from Current Schema', badge: 'badge-teal', color: 'var(--teal)' },
    INFERRED: { id: 'INFERRED', label_ar: '🟡 مستنتج من العلاقات وهيكل الجداول', label_en: '🟡 Inferred from Schema Relationships', badge: 'badge-brass', color: 'var(--brass)' },
    HISTORICAL: { id: 'HISTORICAL', label_ar: '🟠 مبني على الاستخدام في السكربتات القديمة', label_en: '🟠 Based on Historical Scripts Knowledge', badge: 'badge-rust', color: 'var(--brass-deep)' },
    NOT_CONFIRMED: { id: 'NOT_CONFIRMED', label_ar: '⚪ غير مؤكد في الهيكل الحالي', label_en: '⚪ Not Confirmed in Schema', badge: 'badge-secondary', color: 'var(--ink-soft)' }
  };

  /**
   * Retrieves the pre-generated database metadata
   */
  function getMetadata() {
    if (typeof DATABASE_EXPLORER_DATA !== 'undefined' && DATABASE_EXPLORER_DATA && DATABASE_EXPLORER_DATA.tables) {
      return DATABASE_EXPLORER_DATA;
    }
    if (typeof CURRENT_DATABASE_SCHEMA !== 'undefined' && CURRENT_DATABASE_SCHEMA && CURRENT_DATABASE_SCHEMA.tables) {
      return {
        source_file: 'newdatabase2026.sql',
        schema_version: '2026.1',
        total_tables: Object.keys(CURRENT_DATABASE_SCHEMA.tables).length,
        tables: CURRENT_DATABASE_SCHEMA.tables
      };
    }
    return null;
  }

  /**
   * Business Concept & Change Scenarios Knowledge Matrix
   * Maps natural language intents to real schema entities and impact rules
   */
  const CHANGE_SCENARIOS_KNOWLEDGE = [
    {
      id: 'SCENARIO-UNIT-CONVERT',
      triggers_ar: ['وحدة صنف', 'تغيير الوحدة', 'كرتونة', 'قطعة', 'كيلو', 'تحويل وحدة', 'معامل التحويل', 'وحدة القياس', 'uom', 'unit'],
      triggers_en: ['product unit', 'unit conversion', 'uom', 'change unit', 'carton', 'piece', 'kg'],
      entity_ar: 'الصنف ووحدات القياس (Product & UoM)',
      entity_en: 'Product & Unit of Measure',
      main_table: 'products',
      unit_tables: ['sizes', 'product_sizes'],
      target_columns: ['products.unit_id', 'sizes.convert', 'sizes.pack', 'sizes.purchase_price', 'sizes.selling_price'],
      change_nature: 'MASTER_DATA',
      change_nature_desc_ar: 'تعديل بيانات أساسية (Master Data Change). تغيير وحدة الصنف في بطاقة الصنف لا يعدل تلقائياً الحركات والفواتير التاريخية السابقة.',
      change_nature_desc_en: 'Master Data Change. Modifying unit on master card does NOT automatically adjust historical transactions.',
      related_inventory_tables: ['product_qty', 'store_inventory', 'store_inventory_details', 'patches', 'batches'],
      related_transaction_tables: ['purchases_details', 'purchases_returns_details', 'bill_details', 'bill_details_returned', 'transfer_details'],
      related_views: ['product_qty', 'vgeneralcost'],
      inventory_impact_ar: 'خطر حدوث انحراف في كميات الأرصدة الحالية في المخزن إذا تم تغيير معامل التحويل (convert) لصنف لديه حركات سابقة دون عمل جرد وتسوية مخزنية.',
      inventory_impact_en: 'Risk of inventory stock quantity discrepancy if conversion factor is changed without stock count & reconciliation.',
      accounting_impact_ar: 'تأثير غير مباشر على تكلفة المخزون وتكلفة البضاعة المباعة (COGS) عند احتساب متوسط التكلفة المرجح.',
      accounting_impact_en: 'Indirect impact on inventory valuation and COGS when calculating moving average cost.',
      risk_level: 'HIGH',
      safeguards_ar: [
        'ممنوع تعديل كميات الحركات السابقة في bill_details أو purchases_details مباشرة.',
        'إذا كان الصنف له حركات سابقة، يفضل إنشاء صنف جديد أو وحدة بديلة (Alternative Pack) في جدول sizes مع ربطها بنفس الصنف.',
        'إجراء جرد فعلي وإثبات تسوية مخزنية قبل وبعد التعديل.'
      ],
      read_only_queries: [
        {
          title_ar: 'فحص بيانات الصنف ووحداته في جدول sizes',
          sql: `SELECT p.id, p.name, s.serial, s.convert, s.pack, s.purchase_price, s.selling_price \nFROM products p \nLEFT JOIN sizes s ON p.id = s.product_id \nWHERE p.id = :PRODUCT_ID;`
        },
        {
          title_ar: 'فحص رصيد الصنف الحالي بالمستودعات قبل التعديل',
          sql: `SELECT store_id, product_id, sum(quantity) as current_qty \nFROM store_inventory \nWHERE product_id = :PRODUCT_ID \nGROUP BY store_id, product_id;`
        },
        {
          title_ar: 'فحص آخر حركات الفواتير المرتبطة بهذا الصنف',
          sql: `SELECT b.id as bill_id, b.date, bd.quantity, bd.unit_price, bd.total_price \nFROM bill_details bd \nJOIN bills b ON bd.bill_id = b.id \nWHERE bd.product_id = :PRODUCT_ID \nORDER BY b.date DESC LIMIT 10;`
        }
      ]
    },
    {
      id: 'SCENARIO-PURCHASE-COST',
      triggers_ar: ['سعر شراء', 'تكلفة الصنف', 'سعر المورد', 'تكلفة الشراء', 'تعديل التكلفة', 'متوسط التكلفة', 'purchase cost', 'cost price'],
      triggers_en: ['purchase price', 'item cost', 'purchase cost', 'cost update', 'moving average'],
      entity_ar: 'تكلفة وسعر شراء الصنف (Purchase Cost & Valuation)',
      entity_en: 'Product Purchase Cost & Valuation',
      main_table: 'products',
      unit_tables: ['sizes', 'purchases_details', 'purchase_costs'],
      target_columns: ['products.cost_price', 'sizes.purchase_price', 'purchases_details.unit_price', 'general_table.cost'],
      change_nature: 'MASTER_AND_TRANSACTION',
      change_nature_desc_ar: 'يجب التمييز الدقيق بين: (1) سعر الشراء المرجعي في بطاقة الصنف، (2) سعر الفاتورة الفعلية، (3) متوسط التكلفة المرجح، (4) قيود الأستاذ العام.',
      change_nature_desc_en: 'Distinguish between Master Cost, Invoice Transaction Cost, Weighted Average Cost, and General Ledger.',
      related_inventory_tables: ['store_inventory', 'general_table', 'product_qty'],
      related_transaction_tables: ['purchases', 'purchases_details', 'purchases_returns_details', 'bill_details'],
      related_views: ['vgeneralcost'],
      inventory_impact_ar: 'تعديل تكلفة الشراء في بطاقة الصنف يؤثر على تسعير فواتير الشراء الجديدة فقط ولا يعيد تقييم المخزون التاريخي تلقائياً.',
      inventory_impact_en: 'Updating master cost only affects new purchase orders. Historical stock valuation requires revaluation journal.',
      accounting_impact_ar: 'تعديل أسعار فواتير المشتريات المرحلة يسبب اختلالاً بين رصيد المورد، حـ/ وسيط المشتريات، والأستاذ العام (GL).',
      accounting_impact_en: 'Modifying posted purchase prices unbalances supplier ledger, GR/IR clearing, and General Ledger.',
      risk_level: 'HIGH',
      safeguards_ar: [
        'تعديل سعر الصنف في جدول sizes آمن للفواتير المستقبلية.',
        'تعديل تكلفة المشتريات التاريخية يتطلب تشغيل سكربت تسوية GL وتحديث general_table بحذر.',
        'أخذ نسخة احتياطية من purchases_details و general_table قبل أي تعديل خارجي.'
      ],
      read_only_queries: [
        {
          title_ar: 'فحص أسعار شراء الصنف عبر فواتير المشتريات السابقة',
          sql: `SELECT p.id as purchase_id, p.date, pd.quantity, pd.unit_price, pd.total_price, s.name as supplier_name \nFROM purchases_details pd \nJOIN purchases p ON pd.purchase_id = p.id \nLEFT JOIN suppliers s ON p.supplier_id = s.id \nWHERE pd.product_id = :PRODUCT_ID \nORDER BY p.date DESC LIMIT 10;`
        }
      ]
    },
    {
      id: 'SCENARIO-CUSTOMER-BALANCE',
      triggers_ar: ['رصيد عميل', 'مديونية عميل', 'كشف حساب عميل', 'تعديل رصيد العميل', 'حساب العميل', 'سند قبض عميل', 'customer balance'],
      triggers_en: ['customer balance', 'customer indebtedness', 'statement of account', 'customer ledger'],
      entity_ar: 'رصيد ومديونية العميل (Customer Balance & Ledger)',
      entity_en: 'Customer Balance & Subledger',
      main_table: 'customers',
      unit_tables: ['bills', 'cash_receipt_details', 'customer_paid_bank', 'accounting', 'journal', 'gl_trans'],
      target_columns: ['customers.bank', 'customers.delegate_id', 'bills.remain', 'bills.paid', 'gl_trans.amount'],
      change_nature: 'COMPUTED_AND_TRANSACTION',
      change_nature_desc_ar: 'رصيد العميل ناتج تراكمي للحركات (فواتير المبيعات - المرتجعات - سندات القبض - الأرصدة الافتتاحية) ولا يجوز تعديله كحقل رقمي مباشر دون مستند محاسبي.',
      change_nature_desc_en: 'Customer balance is an aggregate outcome of invoices, returns, receipts and opening balance. Direct update is prohibited.',
      related_inventory_tables: [],
      related_transaction_tables: ['bills', 'bills_returned', 'cash_receipt_details', 'paid_opening_bills', 'accounting'],
      related_views: ['csutomer_bill'],
      inventory_impact_ar: 'لا يوجد تأثير مباشر على المخزون الفيزيائي إلا إذا ارتبط التعديل بمرتجع مبيعات غير مثبت.',
      inventory_impact_en: 'No direct physical stock impact unless tied to unposted sales return.',
      accounting_impact_ar: 'حرج جداً: أي تعديل يدوي في رصيد العميل دون قيد وسند يسبب عدم مطابقة فورية بين كشف حساب العميل وحساب المراقبة في الأستاذ العام (Account 1210 / المدينون).',
      accounting_impact_en: 'CRITICAL: Manual modification breaks reconciliation between Customer Subledger and GL Control Account.',
      risk_level: 'CRITICAL',
      safeguards_ar: [
        'ممنوع عمل UPDATE customers SET bank = ... في بيئة الإنتاج.',
        'الحل الصحيح هو تسجيل سند قبض (Receipt Voucher)، إشعار دائن (Credit Note)، أو قيد تسوية معتمد في journal/gl_trans.',
        'استخدم View csutomer_bill أو سكربت مقارنة الأرصدة لتحديد سبب الفارق.'
      ],
      read_only_queries: [
        {
          title_ar: 'كشف مديونية العميل المجمعة من الـ View csutomer_bill',
          sql: `SELECT customer_id, customer_name, sum(total) as total_invoiced, sum(total_pay) as total_paid, sum(remain) as net_balance \nFROM csutomer_bill \nWHERE customer_id = :CUSTOMER_ID \nGROUP BY customer_id, customer_name;`
        },
        {
          title_ar: 'مطابقة رصيد العميل بالأستاذ العام (gl_trans) مع حركات المبيعات',
          sql: `SELECT c.id, c.name, c.gl_account_id, sum(gt.amount) as gl_balance \nFROM customers c \nJOIN gl_trans gt ON c.gl_account_id = gt.account_id \nWHERE c.id = :CUSTOMER_ID \nGROUP BY c.id, c.name, c.gl_account_id;`
        }
      ]
    },
    {
      id: 'SCENARIO-BILL-MODIFY',
      triggers_ar: ['تعديل فاتورة', 'تغيير صنف في الفاتورة', 'تعديل كمية الفاتورة', 'حذف فاتورة', 'فاتورة مبيعات', 'bill modify', 'invoice edit'],
      triggers_en: ['modify invoice', 'edit bill', 'change item in invoice', 'delete bill', 'sales invoice'],
      entity_ar: 'فاتورة المبيعات (Sales Invoice Transaction)',
      entity_en: 'Sales Invoice Header & Lines',
      main_table: 'bills',
      unit_tables: ['bill_details', 'cash_receipt_details', 'journal', 'gl_trans', 'delivery_notes'],
      target_columns: ['bills.amount', 'bills.tax_value', 'bills.total', 'bills.paid', 'bills.remain', 'bill_details.quantity', 'bill_details.unit_price', 'bill_details.product_id'],
      change_nature: 'TRANSACTION_HISTORICAL',
      change_nature_desc_ar: 'حركة تشغيلية تاريخية مرحلة (Posted Transaction). تؤثر بالتوازي على 4 مسارات: العميل، المخزون، الضريبة، والقيود المحاسبية.',
      change_nature_desc_en: 'Posted Historical Transaction. Parallels 4 tracks: Customer Subledger, Physical Stock, VAT Ledger, and General Ledger.',
      related_inventory_tables: ['store_inventory', 'product_qty', 'patches', 'batches'],
      related_transaction_tables: ['bill_details', 'cash_receipt_details', 'journal', 'gl_trans', 'audit_trail'],
      related_views: ['csutomer_bill', 'product_qty'],
      inventory_impact_ar: 'تعديل كميات أو أصناف الفاتورة يغير رصيد المستودع (store_inventory). يجب التأكد من عدم هبوط المخزون بالسالب.',
      inventory_impact_en: 'Modifying quantities affects store_inventory directly. Guard against negative stock.',
      accounting_impact_ar: 'حرج: الفاتورة تولد آلياً قيد اليومية (مدين: العميل/الصندوق، دائن: المبيعات + ضريبة القيمة المضافة ZATCA + قيد تكلفة المبيعات المخزني).',
      accounting_impact_en: 'CRITICAL: Generates Journal Entry (Debit: Customer/Cash, Credit: Sales + VAT + COGS/Inventory).',
      risk_level: 'CRITICAL',
      safeguards_ar: [
        'لا تقم بتعديل bill_details يدوياً دون تعديل قيد اليومية المقابل في journal و gl_trans.',
        'استخدم سكربت تحديث إجمالي الفواتير من التفصيلي لمزامنة bills.amount مع مجموع bill_details.',
        'في بيئة الإنتاج: الإجراء المعتمد هو إصدار فاتورة مرتجع (Sales Return) أو إشعار دائن بدلاً من التعديل المباشر.'
      ],
      read_only_queries: [
        {
          title_ar: 'فحص ترويسة الفاتورة وتفاصيل أصنافها وقيد اليومية المرتبط',
          sql: `SELECT b.id as bill_id, b.date, b.customer_id, b.amount, b.tax_value, b.total, b.paid, b.remain, j.id as journal_id \nFROM bills b \nLEFT JOIN journal j ON b.id = j.reference AND j.type_id = 45 \nWHERE b.id = :BILL_ID;`
        },
        {
          title_ar: 'فحص خطوط قيد اليومية للأستاذ العام المرتبطة بهذه الفاتورة',
          sql: `SELECT gt.id, gt.trans_date, gt.account_id, cm.name as account_name, gt.amount, gt.memo \nFROM gl_trans gt \nJOIN journal j ON gt.type_no = j.id \nLEFT JOIN chart_master cm ON gt.account_id = cm.id \nWHERE j.reference = :BILL_ID AND j.type_id = 45;`
        }
      ]
    },
    {
      id: 'SCENARIO-STOCK-ADJUST',
      triggers_ar: ['رصيد المخزون', 'تعديل رصيد المخزن', 'كمية الصنف', 'تسوية مخزنية', 'مخزون سالب', 'stock adjust', 'inventory balance'],
      triggers_en: ['stock balance', 'inventory adjustment', 'negative stock', 'stock quantity', 'warehouse balance'],
      entity_ar: 'أرصدة وحركات المخزون المستودعي (Warehouse Stock & Inventory)',
      entity_en: 'Store Inventory & Stock Quantities',
      main_table: 'store_inventory',
      unit_tables: ['store_inventory_details', 'stores', 'products', 'sizes', 'transfers'],
      target_columns: ['store_inventory.quantity', 'store_inventory.product_id', 'store_inventory.store_id'],
      change_nature: 'COMPUTED_AND_TRANSACTION',
      change_nature_desc_ar: 'رصيد المخزون يمثل المحصلة الفيزيائية لحركات الاستلام (Purchases/Returns) وحركات الصرف (Sales/Transfers/Adjustments).',
      change_nature_desc_en: 'Store inventory represents the physical aggregate of receipts and issues.',
      related_inventory_tables: ['products', 'stores', 'product_qty', 'patches', 'batches', 'transfers', 'transfer_details'],
      related_transaction_tables: ['purchases_details', 'bill_details', 'transfer_details', 'journal', 'gl_trans'],
      related_views: ['product_qty'],
      inventory_impact_ar: 'تعديل store_inventory المباشر يحل مشكلة الرصيد في الشاشة مؤقتاً لكنه يسبب انحرافاً مع تقرير حركة الصنف (Stock Movement Card).',
      inventory_impact_en: 'Direct update fixes on-screen qty temporarily but creates a permanent discrepancy with Item Stock Movement Card.',
      accounting_impact_ar: 'يؤثر على حساب تقييم المخزون بالأستاذ العام (حساب الأصول 1310) مقابل حساب فروقات الجرد والتسويات (P&L Inventory Variance).',
      accounting_impact_en: 'Affects Inventory Asset Account vs P&L Inventory Variance Account.',
      risk_level: 'HIGH',
      safeguards_ar: [
        'الطريقة المعتمدة: تسجيل إذن تسوية مخزنية أو جرد معتمد من شاشة الجرد الدوري.',
        'تأكد دائماً من تسجيل الحركة في جدول store_inventory_details لتوثيق تاريخ وسبب الحركة.'
      ],
      read_only_queries: [
        {
          title_ar: 'فحص أرصدة الصنف في جميع المستودعات النشطة',
          sql: `SELECT si.store_id, st.name as store_name, si.product_id, p.name as product_name, si.quantity \nFROM store_inventory si \nJOIN stores st ON si.store_id = st.id \nJOIN products p ON si.product_id = p.id \nWHERE si.product_id = :PRODUCT_ID;`
        }
      ]
    },
    {
      id: 'SCENARIO-JOURNAL-GL',
      triggers_ar: ['قيد يومية', 'الأستاذ العام', 'شجرة الحسابات', 'تعديل قيد', 'حذف قيد', 'فارق ميزان المراجعة', 'gl_trans', 'journal'],
      triggers_en: ['journal entry', 'general ledger', 'chart of accounts', 'gl_trans', 'trial balance mismatch'],
      entity_ar: 'قيود اليومية والأستاذ العام (Journal & General Ledger GL)',
      entity_en: 'Journal Entries & General Ledger',
      main_table: 'journal',
      unit_tables: ['gl_trans', 'chart_master', 'chart_types', 'chart_class', 'audit_trail'],
      target_columns: ['journal.reference', 'journal.type_id', 'journal.memo', 'gl_trans.account_id', 'gl_trans.amount', 'gl_trans.trans_date'],
      change_nature: 'ACCOUNTING_CORE',
      change_nature_desc_ar: 'جوهر النظام المالي: جدول journal يمثل ترويسة القيد، وجدول gl_trans يمثل سطور القيد المزدوج المتوازن (Sum(amount) = 0).',
      change_nature_desc_en: 'Core Financial Ledger: journal is the header, gl_trans contains double-entry balanced lines (Sum(amount) = 0).',
      related_inventory_tables: [],
      related_transaction_tables: ['bills', 'purchases', 'accounting', 'cheques', 'bank_journal_trans'],
      related_views: ['vchart'],
      inventory_impact_ar: 'لا يوجد تأثير فيزيائي مباشر، ولكنه يمس التقييم المالي لحسابات مخزون أول وآخر المدة وتكلفة البضاعة المباعة.',
      inventory_impact_en: 'No direct physical impact, but alters inventory valuation and COGS financial balances.',
      accounting_impact_ar: 'خطورة قصوى: أي تعديل غير متوازن (المدين لا يساوي الدائن) يكسر ميزان المراجعة والقوائم المالية الختامية بالكامل.',
      accounting_impact_en: 'CRITICAL: Any unbalanced change breaks the Trial Balance, Balance Sheet, and Income Statement.',
      risk_level: 'CRITICAL',
      safeguards_ar: [
        'ممنوع حذف أو تعديل أي سطر في gl_trans دون التأكد من أن مجموع القيد (Debit - Credit) يظل صفراً تماماً.',
        'تأكد من رقم نوع الحركة (type_id) ومرجع السند (reference) لعدم قطع الربط بالأستاذ المساعد.',
        'الاحتفاظ بنسخة احتياطية كاملة من journal و gl_trans قبل أي معالجة.'
      ],
      read_only_queries: [
        {
          title_ar: 'فحص توازن القيد المحاسبي بالكامل (المدين والدائن)',
          sql: `SELECT gt.type_no as journal_id, j.trans_date, j.memo, sum(gt.amount) as balance_check, count(gt.id) as lines_count \nFROM gl_trans gt \nJOIN journal j ON gt.type_no = j.id \nWHERE gt.type_no = :JOURNAL_ID \nGROUP BY gt.type_no, j.trans_date, j.memo;`
        },
        {
          title_ar: 'فحص سطور القيد وتفاصيل الحسابات المرتبطة به',
          sql: `SELECT gt.id, gt.account_id, cm.name as account_name, gt.amount, gt.memo, gt.branch_id \nFROM gl_trans gt \nJOIN chart_master cm ON gt.account_id = cm.id \nWHERE gt.type_no = :JOURNAL_ID;`
        }
      ]
    }
  ];

  /**
   * NLP Business Concept Matcher & Impact Analyzer
   */
  function analyzeChangeIntent(userQuery) {
    const q = String(userQuery || '').toLowerCase().trim();
    if (!q) return null;

    // Search against scenario knowledge base
    let matchedScenario = CHANGE_SCENARIOS_KNOWLEDGE.find(sc => {
      return sc.triggers_ar.some(t => q.includes(t.toLowerCase())) ||
             sc.triggers_en.some(t => q.includes(t.toLowerCase()));
    });

    const meta = getMetadata();
    const tablesMap = meta ? meta.tables : {};

    // If no explicit scenario matched, infer dynamically from schema keywords
    if (!matchedScenario) {
      const allTableNames = Object.keys(tablesMap);
      const matchingTables = allTableNames.filter(tbl => q.includes(tbl.toLowerCase()));

      if (matchingTables.length > 0) {
        const primaryTbl = matchingTables[0];
        const tblObj = tablesMap[primaryTbl] || {};
        
        matchedScenario = {
          id: `DYNAMIC-${primaryTbl}`,
          entity_ar: `كيان جدول (${primaryTbl})`,
          entity_en: `Entity (${primaryTbl})`,
          main_table: primaryTbl,
          unit_tables: [],
          target_columns: Object.keys(tblObj.columns || {}).slice(0, 5).map(c => `${primaryTbl}.${c}`),
          change_nature: tblObj.type ? tblObj.type.id : 'Operational Table',
          change_nature_desc_ar: `جدول تشغيلي مستخرج ومؤكد من قاعدة البيانات الحالية (newdatabase2026.sql).`,
          change_nature_desc_en: `Operational table confirmed from current database schema.`,
          related_inventory_tables: [],
          related_transaction_tables: [],
          related_views: [],
          inventory_impact_ar: 'يحتاج فحص تفصيلي حسب طبيعة الحركة.',
          inventory_impact_en: 'Requires detailed inspection based on transaction flow.',
          accounting_impact_ar: primaryTbl.includes('gl') || primaryTbl.includes('journal') ? 'حرج: يرتبط بالأستاذ العام.' : 'تأثير تشغيلي عادي.',
          accounting_impact_en: 'Operational impact.',
          risk_level: primaryTbl.includes('gl') || primaryTbl.includes('journal') || primaryTbl.includes('bill') ? 'HIGH' : 'MEDIUM',
          safeguards_ar: [
            'التحقق من المفاتيح الأساسية والعلاقات الأجنبية قبل التعديل.',
            'أخذ نسخة احتياطية من الجدول قبل تطبيق أي أمر خارجي.'
          ],
          read_only_queries: [
            {
              title_ar: `فحص عينة من سجلات جدول ${primaryTbl}`,
              sql: `SELECT * FROM \`${primaryTbl}\` LIMIT 10;`
            }
          ]
        };
      }
    }

    if (!matchedScenario) return null;

    // Enrich scenario with real schema metadata
    const mainTableObj = tablesMap[matchedScenario.main_table];
    const existsInSchema = !!mainTableObj;

    return {
      query: userQuery,
      scenario: matchedScenario,
      schema_status: existsInSchema ? CONFIDENCE_LEVELS.CONFIRMED : CONFIDENCE_LEVELS.NOT_CONFIRMED,
      main_table_metadata: mainTableObj || null,
      investigation_plan_10_steps: [
        '1. تحديد الكيان المستهدف والتفريق بين بيانات الـ Master Data وحركات الـ Transactions.',
        '2. فحص السجل الحالي عبر استعلامات الـ SELECT التشخيصية (Read-only).',
        '3. حصر الجداول الفرعية والعلاقات المرتبطة (Foreign Keys / Dependencies).',
        '4. فحص الحركات التاريخية المسجلة سابقاً في النظام والتأكد من عدم كسرها.',
        '5. فحص الـ Views المحسوبة (مثل product_qty أو csutomer_bill).',
        '6. فحص الأثر المالي على قيود الأستاذ العام GL وتوازن ميزان المراجعة.',
        '7. فحص الأثر المخزني والتأكد من سلامة كارت حركة الصنف.',
        '8. أخذ نسخة احتياطية كاملة (Backup Snapshot) للجداول المتأثرة.',
        '9. تطبيق التعديل المدروس عبر بيئة الاختبار / الخارجية أولاً.',
        '10. التحقق من مطابقة النتائج وإعادة مطابقة كشف الحساب وميزان المراجعة.'
      ]
    };
  }

  /**
   * Search tables by name, domain, column, or business purpose
   */
  function searchTables(query, domainFilter = '') {
    const meta = getMetadata();
    if (!meta || !meta.tables) return [];

    const q = String(query || '').toLowerCase().trim();
    let tablesList = Object.keys(meta.tables).map(name => ({
      name,
      ...meta.tables[name]
    }));

    if (domainFilter) {
      tablesList = tablesList.filter(t => t.domain && t.domain.id === domainFilter);
    }

    if (!q) return tablesList;

    return tablesList.filter(t => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchDomain = t.domain && (t.domain.name_ar.toLowerCase().includes(q) || t.domain.name_en.toLowerCase().includes(q));
      const matchType = t.type && (t.type.name_ar.toLowerCase().includes(q) || t.type.name_en.toLowerCase().includes(q));
      const matchColumns = t.columns && Object.keys(t.columns).some(col => col.toLowerCase().includes(q));
      return matchName || matchDomain || matchType || matchColumns;
    });
  }

  /**
   * Search specific columns across all 406 tables
   */
  function searchColumns(colQuery) {
    const meta = getMetadata();
    if (!meta || !meta.tables) return [];

    const q = String(colQuery || '').toLowerCase().trim();
    if (!q) return [];

    const results = [];
    Object.keys(meta.tables).forEach(tblName => {
      const tbl = meta.tables[tblName];
      const cols = tbl.columns || {};
      Object.keys(cols).forEach(colName => {
        if (colName.toLowerCase().includes(q)) {
          results.push({
            table_name: tblName,
            column_name: colName,
            type: cols[colName].type,
            nullable: cols[colName].nullable,
            is_primary: (tbl.primary_key || []).includes(colName),
            domain: tbl.domain,
            confidence: CONFIDENCE_LEVELS.CONFIRMED
          });
        }
      });
    });

    return results;
  }

  /**
   * Builds prompt for AI Database Assistant aware of newdatabase2026.sql
   */
  function buildAIDatabasePrompt(userQuestion, selectedTable = null) {
    const meta = getMetadata();
    const isAr = I18n.getLang() === 'ar';

    let schemaSnippet = '';
    if (selectedTable && meta && meta.tables[selectedTable]) {
      const tbl = meta.tables[selectedTable];
      const colList = Object.keys(tbl.columns || {}).map(c => `${c} (${tbl.columns[c].type})`).join(', ');
      schemaSnippet = `Active Inspected Table \`${selectedTable}\`:\nColumns: [${colList}]\nPrimary Key: [${(tbl.primary_key || []).join(', ')}]\nDomain: ${tbl.domain.name_en}\n`;
    }

    return `You are a Principal ERP Technical Architect and Lead Database Administrator (DBA).
Answer the user's ERP database question referencing the CURRENT DATABASE SCHEMA from "newdatabase2026.sql" (406 tables).

Language: ${isAr ? 'Arabic (العربية الفصحى)' : 'English'}

${schemaSnippet}

User Question: "${userQuestion}"

STRICT RULES:
1. Every answer must clearly indicate confidence tags:
   - 🟢 Confirmed from Current Schema (newdatabase2026.sql)
   - 🟡 Inferred from Relationships
   - 🟠 Historical Script Knowledge
   - ⚪ Not Confirmed
2. Clearly distinguish between Master Data, Operational Transactions, and Computed Views.
3. If user asks about modifying data, provide change impact analysis, risks, and READ-ONLY diagnostic SELECT queries first.
4. NEVER invent non-existent table or column names. Only refer to tables proven in newdatabase2026.sql.`;
  }

  /**
   * Comprehensive Dynamic Transaction Deletion Maps & Playbooks
   * Source of Truth: newdatabase2026.sql + Historical Accounting Logic
   * Principle: NEVER TRUST STATIC MAPPING AS ABSOLUTE FACT WITHOUT DISCOVERY & PROOF
   */
  const TRANSACTION_DELETION_MAPS = {
    SALES_RETURN: {
      type_key: 'SALES_RETURN',
      name_ar: 'مرتجع مبيعات (Sales Return)',
      name_en: 'Sales Return',
      triggers_ar: ['مرتجع مبيعات', 'مرتجع المبيعات', 'حذف مرتجع', 'bills_returned', 'bill_details_returned'],
      triggers_en: ['sales return', 'delete return', 'bills_returned', 'return invoice'],
      header_table: 'bills_returned',
      details_table: 'bill_details_returned',
      details_fk: 'bill_id',
      inventory_discovery: {
        table: 'general_table',
        candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id', 'quantity_type', 'type'],
        suggested_type: 2,
        notes_ar: 'يتم فحص العلاقة ديناميكياً عبر link_id = :ID أو details_id المطابقة لبنود المرتجع مع مطابقة store_id و product_id.'
      },
      patches_discovery: {
        table: 'patches',
        candidate_keys: ['link_id', 'product_id', 'store_id'],
        suggested_type: 57,
        notes_ar: 'لا يُعتبر جدول الباتشات إلزامياً إلا إذا أثبت الفحص المسبق وجود سجلات باتشات مرتبطة بالمرتجع.'
      },
      journal_type_id: 57,   // Historical script supported
      gl_trans_type_id: 57,  // Historical script supported
      reporting_table: 'sales_dashboard_daily_summaries',
      reporting_fk: 'return_id',
      original_doc_link: { table: 'bills', fk_column: 'valid_bill_id', label_ar: 'فاتورة المبيعات الأصلية المرتبطة (للفحص فقط - لا تُحذف)' },
      master_data_safeguards: ['products', 'customers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      impact_layers: [
        {
          table: 'bills_returned',
          role_ar: 'ترويسة حركة مرتجع المبيعات (Return Header)',
          role_en: 'Return Header',
          relation_ar: 'الجدول الأساسي (Primary ID: bills_returned.id)',
          filter_sql: 'id = :ID',
          impact_level: 'CRITICAL',
          action_ar: 'حذف في الخطوة الأخيرة بعد حذف القيود والتفاصيل',
          confidence: CONFIDENCE_LEVELS.CONFIRMED,
          source_type: 'CURRENT_SCHEMA'
        },
        {
          table: 'bill_details_returned',
          role_ar: 'بنود وتفاصيل أصناف المرتجع (Return Details)',
          role_en: 'Return Details',
          relation_ar: 'bill_details_returned.bill_id = :ID',
          filter_sql: 'bill_id = :ID',
          impact_level: 'CRITICAL',
          action_ar: 'حذف قبل ترويسة المرتجع',
          confidence: CONFIDENCE_LEVELS.CONFIRMED,
          source_type: 'CURRENT_SCHEMA'
        },
        {
          table: 'general_table',
          role_ar: 'حركة المخزون التشغيلية (Inventory Movement)',
          role_en: 'Inventory Movement',
          relation_ar: 'link_id = :ID AND (details_id IN details OR type probe)',
          filter_sql: 'link_id = :ID',
          impact_level: 'HIGH',
          action_ar: 'حذف / تسوية حركة الدخول للمخزن بعد إثبات العلاقة عبر link_id و details_id',
          confidence: CONFIDENCE_LEVELS.INFERRED,
          source_type: 'CANDIDATE_DISCOVERY',
          rule_ar: '⚠️ لا تفترض type=2 كحقيقة مطلقة بدون التحقق من سجلات general_table الحية.'
        },
        {
          table: 'patches',
          role_ar: 'حركات الباتشات وتكلفة الصلاحية (Patches / Cost)',
          role_en: 'Patches / Cost',
          relation_ar: 'link_id = :ID AND (type = 57 OR product match)',
          filter_sql: 'link_id = :ID',
          impact_level: 'HIGH',
          action_ar: 'حذف فقط إذا أثبت استعلام الفحص وجود باتشات مرتبطة بالمرتجع',
          confidence: CONFIDENCE_LEVELS.INFERRED,
          source_type: 'CANDIDATE_DISCOVERY'
        },
        {
          table: 'journal',
          role_ar: 'ترويسة قيد اليومية بالأستاذ العام (GL Header)',
          role_en: 'Journal Header',
          relation_ar: 'reference = :ID AND type_id = 57',
          filter_sql: 'reference = :ID AND type_id = 57',
          impact_level: 'CRITICAL',
          action_ar: 'حذف بعد حذف خطوط gl_trans المقابلة',
          confidence: CONFIDENCE_LEVELS.HISTORICAL,
          source_type: 'HISTORICAL_SCRIPT'
        },
        {
          table: 'gl_trans',
          role_ar: 'خطوط القيد المحاسبي المزدوج (GL Lines)',
          role_en: 'GL Lines',
          relation_ar: 'type_no = journal.id AND type_id = 57',
          filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 57 LIMIT 1)',
          impact_level: 'CRITICAL',
          action_ar: 'حذف خطوط القيد المزدوج أولاً (شرط إلزامي: توازن القيد Sum=0)',
          confidence: CONFIDENCE_LEVELS.HISTORICAL,
          source_type: 'HISTORICAL_SCRIPT'
        },
        {
          table: 'sales_dashboard_daily_summaries',
          role_ar: 'تجميعات ومؤشرات لوحة المبيعات (Reporting Summary)',
          role_en: 'Reporting Summary',
          relation_ar: 'return_id = :ID',
          filter_sql: 'return_id = :ID',
          impact_level: 'MEDIUM',
          action_ar: 'حذف السجل التجميعي لتصحيح إحصائيات الداشبورد',
          confidence: CONFIDENCE_LEVELS.CONFIRMED,
          source_type: 'CURRENT_SCHEMA'
        },
        {
          table: 'bills',
          role_ar: 'فاتورة المبيعات الأصلية المرتبطة (Original Invoice)',
          role_en: 'Original Sales Invoice',
          relation_ar: 'valid_bill_id = bills.id',
          filter_sql: 'id = (SELECT valid_bill_id FROM bills_returned WHERE id = :ID LIMIT 1)',
          impact_level: 'READ_ONLY',
          action_ar: 'فحص تأثير الإلغاء على الفاتورة الأصلية وممنوع حذف الفاتورة الأصلية نهائياً',
          confidence: CONFIDENCE_LEVELS.CONFIRMED,
          source_type: 'CURRENT_SCHEMA'
        },
        {
          table: 'audit_trail',
          role_ar: 'سجل التتبع والمراقبة التاريخية (Audit Log)',
          role_en: 'Audit Log',
          relation_ar: 'type_no = :ID AND type_id = 57',
          filter_sql: 'type_no = :ID AND type_id = 57',
          impact_level: 'AUDIT',
          action_ar: 'يُوصى بشدة بالاحتفاظ به كدليل تدقيق وعدم حذفه',
          confidence: CONFIDENCE_LEVELS.INFERRED,
          source_type: 'AUDIT_SAFEGUARD'
        }
      ]
    },
    SALES_INVOICE: {
      type_key: 'SALES_INVOICE',
      name_ar: 'فاتورة مبيعات (Sales Invoice)',
      name_en: 'Sales Invoice',
      triggers_ar: ['فاتورة مبيعات', 'فاتورة المبيعات', 'حذف فاتورة', 'bills', 'bill_details'],
      triggers_en: ['sales invoice', 'delete invoice', 'delete bill', 'bills'],
      header_table: 'bills',
      details_table: 'bill_details',
      details_fk: 'bill_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 0 },
      journal_type_id: 45,
      gl_trans_type_id: 45,
      reporting_table: 'sales_dashboard_daily_summaries',
      reporting_fk: 'bill_id',
      master_data_safeguards: ['products', 'customers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      impact_layers: [
        { table: 'bills', role_ar: 'ترويسة الفاتورة', role_en: 'Invoice Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف كآخر خطوة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'bill_details', role_ar: 'بنود أصناف الفاتورة', role_en: 'Invoice Lines', relation_ar: 'bill_id = :ID', filter_sql: 'bill_id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف قبل الترويسة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'general_table', role_ar: 'حركة صرف المخزون', role_en: 'Stock Out', relation_ar: 'link_id = :ID', filter_sql: 'link_id = :ID', impact_level: 'HIGH', action_ar: 'حذف حركة الصرف بعد إثبات العلاقة', confidence: CONFIDENCE_LEVELS.INFERRED, source_type: 'CANDIDATE_DISCOVERY' },
        { table: 'journal', role_ar: 'ترويسة قيد اليومية (type_id=45)', role_en: 'Journal Header', relation_ar: 'reference = :ID AND type_id = 45', filter_sql: 'reference = :ID AND type_id = 45', impact_level: 'CRITICAL', action_ar: 'حذف بعد تفريغ gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'خطوط قيد اليومية (GL Lines)', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 45', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 45 LIMIT 1)', impact_level: 'CRITICAL', action_ar: 'حذف خطوط القيد (Sum=0)', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'sales_dashboard_daily_summaries', role_ar: 'إحصائيات الداشبورد', role_en: 'Dashboard Summary', relation_ar: 'bill_id = :ID', filter_sql: 'bill_id = :ID', impact_level: 'MEDIUM', action_ar: 'حذف الإحصائية التجميعية', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' }
      ]
    },
    PURCHASE_INVOICE: {
      type_key: 'PURCHASE_INVOICE',
      name_ar: 'فاتورة مشتريات (Purchase Invoice)',
      name_en: 'Purchase Invoice',
      triggers_ar: ['فاتورة مشتريات', 'فاتورة الشراء', 'حذف مشتريات', 'purchases', 'purchases_details'],
      triggers_en: ['purchase invoice', 'delete purchase', 'purchases'],
      header_table: 'purchases',
      details_table: 'purchases_details',
      details_fk: 'purchase_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 3 },
      journal_type_id: 5,
      gl_trans_type_id: 5,
      reporting_table: 'purchases',
      master_data_safeguards: ['products', 'suppliers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      impact_layers: [
        { table: 'purchases', role_ar: 'ترويسة فاتورة المشتريات', role_en: 'Purchase Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف بعد التفاصيل', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'purchases_details', role_ar: 'بنود أصناف المشتريات', role_en: 'Purchase Details', relation_ar: 'purchase_id = :ID', filter_sql: 'purchase_id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف قبل الترويسة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'purchase_costs', role_ar: 'التكاليف الإضافية للشراء', role_en: 'Additional Costs', relation_ar: 'purchase_id = :ID', filter_sql: 'purchase_id = :ID', impact_level: 'HIGH', action_ar: 'حذف التكاليف المرتبطة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'general_table', role_ar: 'حركة استلام المخزون (Inbound)', role_en: 'Stock In', relation_ar: 'link_id = :ID', filter_sql: 'link_id = :ID', impact_level: 'HIGH', action_ar: 'حذف حركة الاستلام بعد إثبات العلاقة', confidence: CONFIDENCE_LEVELS.INFERRED, source_type: 'CANDIDATE_DISCOVERY' },
        { table: 'journal', role_ar: 'ترويسة قيد المشتريات', role_en: 'Journal Header', relation_ar: 'reference = :ID AND type_id = 5', filter_sql: 'reference = :ID AND type_id = 5', impact_level: 'CRITICAL', action_ar: 'حذف بعد تفريغ gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'سطور قيد المشتريات (GL Lines)', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 5', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 5 LIMIT 1)', impact_level: 'CRITICAL', action_ar: 'حذف خطوط القيد المزدوج', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' }
      ]
    },
    PURCHASE_RETURN: {
      type_key: 'PURCHASE_RETURN',
      name_ar: 'مرتجع مشتريات (Purchase Return)',
      name_en: 'Purchase Return',
      triggers_ar: ['مرتجع مشتريات', 'مرتجع المورد', 'purchases_returns'],
      triggers_en: ['purchase return', 'purchases_returns'],
      header_table: 'purchases_returns',
      details_table: 'purchases_returns_details',
      details_fk: 'purchase_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'] },
      journal_type_id: 56,
      gl_trans_type_id: 56,
      reporting_table: 'purchases_returns',
      original_doc_link: { table: 'purchases', fk_column: 'valid_purchases_id', label_ar: 'فاتورة المشتريات الأصلية (للفحص فقط)' },
      master_data_safeguards: ['products', 'suppliers', 'stores', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      impact_layers: [
        { table: 'purchases_returns', role_ar: 'ترويسة مرتجع المشتريات', role_en: 'Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف بعد التفاصيل', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'purchases_returns_details', role_ar: 'بنود مرتجع المشتريات', role_en: 'Details', relation_ar: 'purchase_id = :ID', filter_sql: 'purchase_id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف قبل الترويسة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'general_table', role_ar: 'حركة خروج المخزون للمورد', role_en: 'Stock Out', relation_ar: 'link_id = :ID', filter_sql: 'link_id = :ID', impact_level: 'HIGH', action_ar: 'حذف حركة الخروج بعد إثبات العلاقة', confidence: CONFIDENCE_LEVELS.INFERRED, source_type: 'CANDIDATE_DISCOVERY' },
        { table: 'journal', role_ar: 'ترويسة قيد مرتجع المشتريات', role_en: 'Journal', relation_ar: 'reference = :ID AND type_id = 56', filter_sql: 'reference = :ID AND type_id = 56', impact_level: 'CRITICAL', action_ar: 'حذف بعد gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'سطور قيد المرتجع GL', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 56', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 56 LIMIT 1)', impact_level: 'CRITICAL', action_ar: 'حذف سطور القيد', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' }
      ]
    },
    STOCK_TRANSFER: {
      type_key: 'STOCK_TRANSFER',
      name_ar: 'تحويل مخزني بين الفروع/المستودعات (Stock Transfer)',
      name_en: 'Stock Transfer',
      triggers_ar: ['تحويل مخزني', 'تحويل بين المستودعات', 'transfers', 'transfer_details'],
      triggers_en: ['stock transfer', 'warehouse transfer', 'transfers'],
      header_table: 'transfers',
      details_table: 'transfer_details',
      details_fk: 'transfer_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'] },
      journal_type_id: 44,
      gl_trans_type_id: 44,
      master_data_safeguards: ['products', 'stores', 'branches', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'HIGH',
      impact_layers: [
        { table: 'transfers', role_ar: 'ترويسة إذن التحويل', role_en: 'Transfer Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'HIGH', action_ar: 'حذف بعد البنود', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'transfer_details', role_ar: 'أصناف وكميات التحويل', role_en: 'Transfer Details', relation_ar: 'transfer_id = :ID', filter_sql: 'transfer_id = :ID', impact_level: 'HIGH', action_ar: 'حذف قبل الترويسة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'general_table', role_ar: 'حركات الصرف والاستلام بالمستودعين', role_en: 'Stock Movements (In/Out)', relation_ar: 'link_id = :ID', filter_sql: 'link_id = :ID', impact_level: 'HIGH', action_ar: 'حذف حركتي الصرف والاستلام', confidence: CONFIDENCE_LEVELS.INFERRED, source_type: 'CANDIDATE_DISCOVERY' },
        { table: 'journal', role_ar: 'قيد وسيط التحويل المخزني', role_en: 'Journal (type_id=44)', relation_ar: 'reference = :ID AND type_id = 44', filter_sql: 'reference = :ID AND type_id = 44', impact_level: 'HIGH', action_ar: 'حذف بعد تفريغ gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'سطور قيد التحويل (حسابات المخازن الوسيطة)', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 44', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 44 LIMIT 1)', impact_level: 'HIGH', action_ar: 'حذف سطور القيد', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' }
      ]
    },
    RECEIPT_PAYMENT: {
      type_key: 'RECEIPT_PAYMENT',
      name_ar: 'سند قبض / سند صرف مالي (Payment & Receipt Voucher)',
      name_en: 'Payment & Receipt Voucher',
      triggers_ar: ['سند قبض', 'سند صرف', 'إيصال استلام', 'accounting', 'cash_receipt_details'],
      triggers_en: ['receipt voucher', 'payment voucher', 'accounting voucher'],
      header_table: 'accounting',
      details_table: 'cash_receipt_details',
      details_fk: 'cash_receipt_id',
      journal_type_id: 51,
      gl_trans_type_id: 51,
      master_data_safeguards: ['customers', 'suppliers', 'users', 'payment_methods', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'HIGH',
      impact_layers: [
        { table: 'accounting', role_ar: 'ترويسة السند المالي', role_en: 'Voucher Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'HIGH', action_ar: 'حذف كآخر خطوة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'cash_receipt_details', role_ar: 'توزيعات السداد على الفواتير', role_en: 'Invoice Allocations', relation_ar: 'cash_receipt_id = :ID', filter_sql: 'cash_receipt_id = :ID', impact_level: 'HIGH', action_ar: 'حذف توزيعات السداد', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'journal', role_ar: 'قيد الصندوق والوسيط المالي (type_id=51)', role_en: 'Journal Header', relation_ar: 'reference = :ID AND type_id = 51', filter_sql: 'reference = :ID AND type_id = 51', impact_level: 'HIGH', action_ar: 'حذف بعد gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'سطور قيد السند بالأستاذ العام', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 51', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 51 LIMIT 1)', impact_level: 'HIGH', action_ar: 'حذف سطور القيد', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' }
      ]
    },
    PHYSICAL_INVENTORY: {
      type_key: 'PHYSICAL_INVENTORY',
      name_ar: 'محضر جرد وتسوية مخزنية (Inventory Count & Adjustment)',
      name_en: 'Physical Inventory Adjustment',
      triggers_ar: ['تسوية مخزنية', 'محضر جرد', 'جرد المخزن', 'store_inventory'],
      triggers_en: ['inventory count', 'stock adjustment', 'store_inventory'],
      header_table: 'store_inventory',
      details_table: 'store_inventory_details',
      details_fk: 'store_inventory_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'] },
      journal_type_id: 55,
      gl_trans_type_id: 55,
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'HIGH',
      impact_layers: [
        { table: 'store_inventory', role_ar: 'ترويسة محضر الجرد', role_en: 'Count Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'HIGH', action_ar: 'حذف بعد التفاصيل', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'store_inventory_details', role_ar: 'بنود وكميات الجرد الفعلي', role_en: 'Count Lines', relation_ar: 'store_inventory_id = :ID', filter_sql: 'store_inventory_id = :ID', impact_level: 'HIGH', action_ar: 'حذف قبل الترويسة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'general_table', role_ar: 'حركات تسوية فروقات الجرد', role_en: 'Variance Movements', relation_ar: 'link_id = :ID', filter_sql: 'link_id = :ID', impact_level: 'HIGH', action_ar: 'حذف حركات التسوية بعد إثبات العلاقة', confidence: CONFIDENCE_LEVELS.INFERRED, source_type: 'CANDIDATE_DISCOVERY' },
        { table: 'journal', role_ar: 'قيد فروقات الجرد بالأستاذ العام (type_id=55)', role_en: 'Journal', relation_ar: 'reference = :ID AND type_id = 55', filter_sql: 'reference = :ID AND type_id = 55', impact_level: 'HIGH', action_ar: 'حذف بعد gl_trans', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' },
        { table: 'gl_trans', role_ar: 'سطور قيد التسوية (حـ/ فروقات الجرد)', role_en: 'GL Lines', relation_ar: 'type_no = journal.id AND type_id = 55', filter_sql: 'type_no = (SELECT id FROM journal WHERE reference = :ID AND type_id = 55 LIMIT 1)', impact_level: 'HIGH', action_ar: 'حذف سطور القيد', confidence: CONFIDENCE_LEVELS.HISTORICAL, source_type: 'HISTORICAL_SCRIPT' }
      ]
    },
    MANUAL_JOURNAL: {
      type_key: 'MANUAL_JOURNAL',
      name_ar: 'قيد يومية يدوي (Manual Journal Entry)',
      name_en: 'Manual Journal Entry',
      triggers_ar: ['قيد يدوي', 'حذف قيد', 'journal', 'gl_trans'],
      triggers_en: ['manual journal', 'delete journal', 'journal entry'],
      header_table: 'journal',
      details_table: 'gl_trans',
      details_fk: 'type_no',
      master_data_safeguards: ['chart_master', 'branches', 'currencies'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      impact_layers: [
        { table: 'journal', role_ar: 'ترويسة قيد اليومية', role_en: 'Journal Header', relation_ar: 'Primary ID', filter_sql: 'id = :ID', impact_level: 'CRITICAL', action_ar: 'حذف بعد تفريغ gl_trans', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' },
        { table: 'gl_trans', role_ar: 'سطور القيد المزدوج بالأستاذ العام', role_en: 'GL Lines', relation_ar: 'type_no = journal.id', filter_sql: 'type_no = :ID', impact_level: 'CRITICAL', action_ar: 'حذف سطور القيد والتأكد من عدم كسر ميزان المراجعة', confidence: CONFIDENCE_LEVELS.CONFIRMED, source_type: 'CURRENT_SCHEMA' }
      ]
    }
  };

  /**
   * Analyzes Transaction Deletion Request and generates complete 8-stage lifecycle & discovery roadmap
   */
  function analyzeTransactionDeletion(inputQuery, forcedType = null, forcedId = null) {
    const q = String(inputQuery || '').trim();
    
    // Extract ID from query (e.g. "حذف مرتجع 12345" -> "12345")
    let detectedId = forcedId;
    if (!detectedId) {
      const matchNum = q.match(/\b\d+\b/);
      if (matchNum) detectedId = matchNum[0];
    }
    if (!detectedId) detectedId = '12345'; // Default sample ID for visualization

    // Match transaction map
    let matchedMap = null;
    if (forcedType && TRANSACTION_DELETION_MAPS[forcedType]) {
      matchedMap = TRANSACTION_DELETION_MAPS[forcedType];
    } else {
      const qLower = q.toLowerCase();
      const mapKeys = Object.keys(TRANSACTION_DELETION_MAPS);
      for (let k of mapKeys) {
        const m = TRANSACTION_DELETION_MAPS[k];
        if (m.triggers_ar.some(t => qLower.includes(t.toLowerCase())) ||
            m.triggers_en.some(t => qLower.includes(t.toLowerCase()))) {
          matchedMap = m;
          break;
        }
      }
    }

    // Default to SALES_RETURN if no specific type matched
    if (!matchedMap) {
      matchedMap = TRANSACTION_DELETION_MAPS.SALES_RETURN;
    }

    const isAr = I18n.getLang() === 'ar';
    const txId = detectedId;

    // Generate Dynamic Relationship Discovery Probes (Read-Only)
    const discoveryProbes = [
      {
        stage: 'PROVE_HEADER_DETAILS',
        title_ar: `1. إثبات وجود الحركة والتفاصيل في ${matchedMap.header_table} و ${matchedMap.details_table}`,
        sql: `SELECT h.*, count(d.id) as details_count \nFROM \`${matchedMap.header_table}\` h \nLEFT JOIN \`${matchedMap.details_table}\` d ON d.${matchedMap.details_fk} = h.id \nWHERE h.id = ${txId} \nGROUP BY h.id;`,
        confidence: CONFIDENCE_LEVELS.CONFIRMED
      }
    ];

    if (matchedMap.inventory_discovery) {
      discoveryProbes.push({
        stage: 'PROVE_INVENTORY_RELATION',
        title_ar: `2. إثبات حركة المخزون عبر Candidate Keys (link_id / details_id) في general_table`,
        sql: `SELECT gt.id, gt.type, gt.link_id, gt.details_id, gt.store_id, gt.product_id, gt.quantity, gt.quantity_type, gt.cost \nFROM general_table gt \nWHERE gt.link_id = ${txId} \n   OR gt.details_id IN (SELECT id FROM \`${matchedMap.details_table}\` WHERE ${matchedMap.details_fk} = ${txId});`,
        confidence: CONFIDENCE_LEVELS.INFERRED,
        warning_ar: 'يجب مطابقة link_id و details_id للتأكد من انتماء السجلات لنفس المرتجع قبل الحذف.'
      });
    }

    if (matchedMap.patches_discovery) {
      discoveryProbes.push({
        stage: 'PROVE_PATCHES_RELATION',
        title_ar: `3. فحص سجلات الباتشات والتكلفة في patches`,
        sql: `SELECT p.id, p.type, p.link_id, p.store_id, p.product_id, p.quantity, p.cost, p.patch_code \nFROM patches p \nWHERE p.link_id = ${txId};`,
        confidence: CONFIDENCE_LEVELS.INFERRED
      });
    }

    if (matchedMap.journal_type_id !== undefined) {
      discoveryProbes.push({
        stage: 'PROVE_ACCOUNTING_JOURNAL',
        title_ar: `4. إثبات قيد اليومية المرتبط في journal (type_id = ${matchedMap.journal_type_id})`,
        sql: `SELECT id, type_id, trans_date, reference, amount, memo, branch_id, is_closed \nFROM journal \nWHERE reference = ${txId} AND type_id = ${matchedMap.journal_type_id};`,
        confidence: CONFIDENCE_LEVELS.HISTORICAL
      });
      discoveryProbes.push({
        stage: 'PROVE_GL_BALANCE',
        title_ar: `5. الفحص الحاسم لتوازن الأستاذ العام (Sum=0 / Debit=Credit)`,
        sql: `SELECT j.id as journal_id, sum(gt.amount) as gl_balance_difference, \n       sum(case when gt.amount > 0 then gt.amount else 0 end) as total_debit, \n       sum(case when gt.amount < 0 then abs(gt.amount) else 0 end) as total_credit \nFROM gl_trans gt \nJOIN journal j ON gt.type_no = j.id \nWHERE j.reference = ${txId} AND j.type_id = ${matchedMap.journal_type_id} \nGROUP BY j.id;`,
        confidence: CONFIDENCE_LEVELS.HISTORICAL
      });
    }

    if (matchedMap.reporting_table) {
      discoveryProbes.push({
        stage: 'PROVE_REPORTING_SUMMARY',
        title_ar: `6. فحص السجلات التجميعية في ${matchedMap.reporting_table}`,
        sql: `SELECT * FROM \`${matchedMap.reporting_table}\` WHERE ${matchedMap.reporting_fk} = ${txId};`,
        confidence: CONFIDENCE_LEVELS.CONFIRMED
      });
    }

    if (matchedMap.original_doc_link) {
      discoveryProbes.push({
        stage: 'INSPECT_ORIGINAL_DOCUMENT',
        title_ar: `7. فحص الفاتورة الأصلية المرتبطة عبر ${matchedMap.original_doc_link.fk_column} (للقراءة فقط)`,
        sql: `SELECT o.* FROM \`${matchedMap.original_doc_link.table}\` o \nJOIN \`${matchedMap.header_table}\` h ON h.${matchedMap.original_doc_link.fk_column} = o.id \nWHERE h.id = ${txId};`,
        confidence: CONFIDENCE_LEVELS.CONFIRMED
      });
    }

    // Generate Safe Transactional Deletion SQL (Conditional Execution)
    let modificationSql = `START TRANSACTION;\n\n`;
    modificationSql += `-- ==========================================================================\n`;
    modificationSql += `-- DYNAMIC SAFE DELETION SCRIPT FOR ${matchedMap.name_en} #${txId}\n`;
    modificationSql += `-- Source of Truth: newdatabase2026.sql\n`;
    modificationSql += `-- CAUTION: Run only after all diagnostic discovery probes pass successfully!\n`;
    modificationSql += `-- ==========================================================================\n\n`;
    modificationSql += `SET @TARGET_ID = ${txId};\n\n`;

    if (matchedMap.journal_type_id !== undefined) {
      modificationSql += `-- Step 1: Capture linked Journal ID\n`;
      modificationSql += `SET @JOURNAL_ID = (SELECT id FROM journal WHERE reference = @TARGET_ID AND type_id = ${matchedMap.journal_type_id} LIMIT 1);\n\n`;
      
      modificationSql += `-- Step 2: Delete GL double-entry lines (Validated)\n`;
      modificationSql += `DELETE FROM gl_trans WHERE type_no = @JOURNAL_ID AND type_id = ${matchedMap.gl_trans_type_id || matchedMap.journal_type_id};\n\n`;

      modificationSql += `-- Step 3: Delete Journal posting header\n`;
      modificationSql += `DELETE FROM journal WHERE id = @JOURNAL_ID AND type_id = ${matchedMap.journal_type_id};\n\n`;
    }

    if (matchedMap.inventory_discovery) {
      modificationSql += `-- Step 4: Delete Inventory movements from general_table (Candidate Key: link_id & details_id)\n`;
      modificationSql += `DELETE FROM general_table \nWHERE link_id = @TARGET_ID \n   OR details_id IN (SELECT id FROM \`${matchedMap.details_table}\` WHERE ${matchedMap.details_fk} = @TARGET_ID);\n\n`;
    }

    if (matchedMap.patches_discovery) {
      modificationSql += `-- Step 5: Delete related patches records (if proven linked)\n`;
      modificationSql += `DELETE FROM patches WHERE link_id = @TARGET_ID;\n\n`;
    }

    if (matchedMap.reporting_table) {
      modificationSql += `-- Step 6: Delete reporting aggregate summary\n`;
      modificationSql += `DELETE FROM \`${matchedMap.reporting_table}\` WHERE ${matchedMap.reporting_fk} = @TARGET_ID;\n\n`;
    }

    modificationSql += `-- Step 7: Delete transaction details\n`;
    modificationSql += `DELETE FROM \`${matchedMap.details_table}\` WHERE ${matchedMap.details_fk} = @TARGET_ID;\n\n`;

    modificationSql += `-- Step 8: Delete transaction header (Primary)\n`;
    modificationSql += `DELETE FROM \`${matchedMap.header_table}\` WHERE id = @TARGET_ID;\n\n`;

    modificationSql += `-- Step 9: In-Transaction Verification Probes\n`;
    modificationSql += `SELECT COUNT(*) AS remaining_headers FROM \`${matchedMap.header_table}\` WHERE id = @TARGET_ID;\n`;
    modificationSql += `SELECT COUNT(*) AS remaining_details FROM \`${matchedMap.details_table}\` WHERE ${matchedMap.details_fk} = @TARGET_ID;\n\n`;
    modificationSql += `-- If counts are zero and no foreign key violations occurred:\n`;
    modificationSql += `COMMIT;\n`;
    modificationSql += `-- If any error or unexpected remaining records:\n`;
    modificationSql += `-- ROLLBACK;\n`;

    // 8-Stage Lifecycle Roadmap
    const eightStageRoadmap = [
      {
        stage: 1,
        title_ar: 'المرحلة 1: التعريف وتحديد المعرفات (1. IDENTIFY)',
        title_en: '1. IDENTIFY',
        desc_ar: `استخراج ترويسة الحركة (#${txId})، ومعرفات الفرع والمستودع والعميل/المورد وتاريخ الحركة.`
      },
      {
        stage: 2,
        title_ar: 'المرحلة 2: حصر الطبقات والجداول المرشحة (2. DISCOVER)',
        title_en: '2. DISCOVER',
        desc_ar: `حصر الجداول عبر الطبقات الـ 7 (الترويسة، التفاصيل، المخزون، الباتشات، القيود، الأستاذ العام، الداشبورد).`
      },
      {
        stage: 3,
        title_ar: 'المرحلة 3: إثبات العلاقات عبر Candidate Keys (3. PROVE RELATIONSHIPS)',
        title_en: '3. PROVE RELATIONSHIPS',
        desc_ar: `إثبات انتماء حركات general_table والباتشات والقيود للحركة الفعلية عبر المفاتيح المرشحة (link_id / details_id).`
      },
      {
        stage: 4,
        title_ar: 'المرحلة 4: تصنيف الاعتماديات وحماية البيانات (4. CLASSIFY DEPENDENCIES)',
        title_en: '4. CLASSIFY DEPENDENCIES',
        desc_ar: `فصل البيانات التابعة المؤكدة عن البيانات الأساسية المحمية (Master Data) وسجلات التدقيق التاريخية (Audit Logs).`
      },
      {
        stage: 5,
        title_ar: 'المرحلة 5: فحص موانع الحذف والسلامة المحاسبية (5. SAFETY VALIDATION)',
        title_en: '5. SAFETY VALIDATION',
        desc_ar: `التأكد من توازن القيد المحاسبي (Sum=0)، عدم وجود سدادات مالية نشطة، وخلو المعاملة من أقفال ZATCA أو الفترات المقفلة.`
      },
      {
        stage: 6,
        title_ar: 'المرحلة 6: ترتيب الحذف العكسي الصارم (6. GENERATE DELETION ORDER)',
        title_en: '6. GENERATE DELETION ORDER',
        desc_ar: `ترتيب الحذف من الأسفل للأعلى (سطور GL ➔ القيود ➔ المخزون ➔ التفاصيل ➔ الترويسة).`
      },
      {
        stage: 7,
        title_ar: 'المرحلة 7: توليد سكريبت الحذف الخارجي المحمي (7. GENERATE EXTERNAL SQL)',
        title_en: '7. GENERATE EXTERNAL SQL',
        desc_ar: `توليد سكريبت SQL مشروط داخل كبسولة ترانزاكشن (START TRANSACTION) للتنفيذ الخارجي فقط مع دعم ROLLBACK.`
      },
      {
        stage: 8,
        title_ar: 'المرحلة 8: التحقق الختامي وخلو الأيتام (8. POST-DELETE VERIFICATION)',
        title_en: '8. POST-DELETE VERIFICATION',
        desc_ar: `تشغيل استعلامات الفحص الختامية للتأكد من وصول كافة السجلات المتأثرة للصفر (0 records) بدون أيتام.`
      }
    ];

    // Safety Blockers Checklist
    const safetyBlockersChecklist = [
      { id: 'GL_BALANCE', title_ar: 'توازن الأستاذ العام (GL Balance Rule)', desc_ar: 'يجب أن يكون Debit = Credit ومجموع gl_trans.amount = 0 بالضبط.', status: 'PENDING_CHECK' },
      { id: 'INVENTORY_PROOF', title_ar: 'إثبات ارتباط المخزون (Inventory Proof)', desc_ar: 'يجب إثبات تطابق link_id و details_id في general_table قبل حذف أي حركة مخزون.', status: 'PENDING_CHECK' },
      { id: 'PAYMENT_LOCK', title_ar: 'فحص ارتباطات السداد المالي (Payment Dependencies)', desc_ar: 'التأكد من عدم وجود سند قبض أو تسوية بنكية نشطة ترتبط بالحركة.', status: 'PENDING_CHECK' },
      { id: 'ZATCA_STATUS', title_ar: 'حالة الربط والفوترة الإلكترونية (ZATCA / Tax)', desc_ar: 'إذا تم اعتماد المعاملة في هيئة الزكاة (sent_to_zatca=1)، لا يجوز الحذف المباشر ويجب إصدار إشعار دائن/مدين.', status: 'PENDING_CHECK' },
      { id: 'MASTER_PROTECT', title_ar: 'حماية بطاقات التعريف والبيانات الأساسية', desc_ar: 'جداول الأصناف والعملاء والمستودعات والحسابات محمية ولا تدخل في الحذف نهائياً.', status: 'ENFORCED' }
    ];

    return {
      query: inputQuery,
      transaction_id: txId,
      map: matchedMap,
      impact_layers: matchedMap.impact_layers,
      eight_stage_roadmap: eightStageRoadmap,
      discovery_probes: discoveryProbes,
      modification_sql: modificationSql,
      safety_blockers: safetyBlockersChecklist,
      master_data_safeguards: matchedMap.master_data_safeguards,
      audit_tables: matchedMap.audit_tables,
      risk_level: matchedMap.risk_level
    };
  }

  return {
    CONFIDENCE_LEVELS,
    CHANGE_SCENARIOS_KNOWLEDGE,
    TRANSACTION_DELETION_MAPS,
    getMetadata,
    analyzeChangeIntent,
    analyzeTransactionDeletion,
    searchTables,
    searchColumns,
    buildAIDatabasePrompt
  };
})();

if (typeof module !== 'undefined') module.exports = DatabaseExplorerEngine;
