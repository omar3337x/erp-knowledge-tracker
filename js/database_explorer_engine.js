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

  return {
    CONFIDENCE_LEVELS,
    CHANGE_SCENARIOS_KNOWLEDGE,
    getMetadata,
    analyzeChangeIntent,
    searchTables,
    searchColumns,
    buildAIDatabasePrompt
  };
})();

if (typeof module !== 'undefined') module.exports = DatabaseExplorerEngine;
