/**
 * js/scripts_bank_data.js
 * 🛠️ Complete Historical Script Library & Troubleshooting Seed Data
 * Compiled from /اسكربتات and validated against newdatabase2026.sql
 */
const SCRIPTS_BANK_DATA = [
  {
    "id": "SCR-001",
    "filename": "compare inv with acc.am",
    "title_ar": "مقارنة فواتير المبيعات والمرتجعات مع قيود الأستاذ العام GL",
    "title_en": "Reconcile Sales & Return Invoices with General Ledger GL",
    "problem_ar": "وجود فروقات بين إجمالي فواتير المبيعات أو المرتجعات في موديول المخزون والمبالغ المرحلة في قيود اليومية والأستاذ العام (GL)، مما يسبب عدم تطابق بين المخزون والحسابات.",
    "problem_en": "وجود فروقات بين إجمالي فواتير المبيعات أو المرتجعات في موديول المخزون والمبالغ المرحلة في قيود اليومية والأستاذ العام (GL)، مما يسبب عدم تطابق بين المخزون والحسابات.",
    "solution_ar": "استعلام تشخيصي يقارن صافي قيمة الفاتورة بعد الخصم مع قيد اليومية المرتبط (account_id = 315) لاستخراج الفواتير ذات الفروقات، مع تنظيف القيود المحذوفة والمعلقة.",
    "solution_en": "استعلام تشخيصي يقارن صافي قيمة الفاتورة بعد الخصم مع قيد اليومية المرتبط (account_id = 315) لاستخراج الفواتير ذات الفروقات، مع تنظيف القيود المحذوفة والمعلقة.",
    "category_id": "CAT-RECON",
    "category_name_ar": "مطابقة وتسوية",
    "category_name_en": "Reconciliation",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "HIGH",
    "tags": [
      "#reconciliation",
      "#inventory",
      "#accounting",
      "#gl_trans",
      "#journal",
      "#bills",
      "#bills_returned"
    ],
    "code_type": "sql",
    "code": "SELECT bills.id,bills.amount,gl_trans.amount ,bills.discount_type,bills.discount,bills.amount + gl_trans.amount - round(case when bills.discount_type = 0 then bills.discount * bills.amount /100 else bills.discount end,2) as tot FROM gl_trans INNER join journal on journal.id = gl_trans.type_no LEFT outer join bills ON journal.reference = bills.id and journal.type_id in (45) where account_id = 315 having bills.amount + gl_trans.amount - round(case when bills.discount_type = 0 then bills.discount * bills.amount /100 else bills.discount end,2) <> 0 ORDER BY `tot` ASC\r\n\r\n\r\n\r\n<<<<مرتجعات >>>>>\r\nSELECT bills_returned.id,bills_returned.amount,gl_trans.amount ,bills_returned.amount + gl_trans.amount as tot FROM gl_trans INNER join journal on journal.id = gl_trans.type_no LEFT outer join bills_returned ON journal.reference = bills_returned.id and journal.type_id in (57) where account_id = 315 having bills_returned.amount + gl_trans.amount <> 0 ORDER BY `tot` ASC\r\n\r\n\r\n\r\n\r\n\r\n    delete from journal where deleted_at is not null;\r\n    delete from gl_trans where type_no not in (select id from journal);",
    "tables": [
      "gl_trans",
      "journal",
      "bills",
      "bills_returned"
    ],
    "missing_tables": [],
    "existing_tables": [
      "gl_trans",
      "journal",
      "bills",
      "bills_returned"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.814Z",
    "backup_required": true,
    "rollback_notes_ar": "الاستعلامات الأولى للقراءة فقط. أوامر الحذف في النهاية يجب أخذ نسخة احتياطية من جادول journal و gl_trans قبل تنفيذها.",
    "rollback_notes_en": "SELECT queries are read-only. For the DELETE statements at the bottom, take backups of journal and gl_trans before execution.",
    "playbook_steps_ar": [
      "أخذ نسخة احتياطية كاملة من قاعدة البيانات قبل أي عملية حذف.",
      "تشغيل استعلام فحص فواتير المبيعات (bills vs gl_trans) ومراجعة السجلات التي بها فروقات.",
      "تشغيل استعلام فحص فواتير المرتجعات (bills_returned vs gl_trans).",
      "فحص قيود اليومية المعلقة والمحذوفة دفترياً قبل تنفيذ أوامر الحذف.",
      "إعادة احتساب ميزان المراجعة والتأكد من مطابقة حساب المراقبة."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-002",
    "filename": "convert دمج مرتجع المشتريات بالتاريخ.txt",
    "title_ar": "تحويل وتصحيح كميات وأسعار مرتجع المشتريات وفق معامل التحويل",
    "title_en": "Correct Purchase Return Quantities & Costs via UoM Conversion",
    "problem_ar": "تسجيل كميات وأسعار مرتجعات المشتريات بوحدات قياس غير محولة بشكل سليم (Sizes/Packs)، مما يسبب أخطاء في تكلفة المرتجع ورصيد المستودع.",
    "problem_en": "تسجيل كميات وأسعار مرتجعات المشتريات بوحدات قياس غير محولة بشكل سليم (Sizes/Packs)، مما يسبب أخطاء في تكلفة المرتجع ورصيد المستودع.",
    "solution_ar": "تحديث تفاصيل مرتجعات المشتريات (purchases_returns_details) بحساب الكمية الفعلية مقسومة على معامل التحويل (sizes.convert) وتحديث سعر الوحدة والإجمالي بدقة.",
    "solution_en": "تحديث تفاصيل مرتجعات المشتريات (purchases_returns_details) بحساب الكمية الفعلية مقسومة على معامل التحويل (sizes.convert) وتحديث سعر الوحدة والإجمالي بدقة.",
    "category_id": "CAT-DATA-FIX",
    "category_name_ar": "تصحيح بيانات",
    "category_name_en": "Data Fix",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "HIGH",
    "tags": [
      "#purchases_returns",
      "#uom",
      "#sizes",
      "#data_fix",
      "#inventory_cost"
    ],
    "code_type": "sql",
    "code": "UPDATE purchases_returns_details p, (SELECT purchases_returns_details.id,purchases_returns_details.quantity/sizes.convert as quantity,sizes.purchase_price*-1 as unit_price,sizes.serial FROM `purchases_returns_details` left join purchases_returns on purchases_returns.id=purchases_returns_details.purchase_id LEFT JOIN sizes ON sizes.product_id=purchases_returns_details.product_id AND sizes.pack=2 WHERE purchases_returns_details.invoice_no is not null and purchases_returns.date BETWEEN '2023-03-01' and '2023-03-31' ) p1 SET p.quantity=p1.quantity,p.unit_price=p1.unit_price,p.price=p1.quantity*p1.unit_price,p.size=p1.serial WHERE p.id=p1.id;",
    "tables": [
      "purchases_returns_details",
      "purchases_returns",
      "sizes"
    ],
    "missing_tables": [],
    "existing_tables": [
      "purchases_returns_details",
      "purchases_returns",
      "sizes"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.817Z",
    "backup_required": true,
    "rollback_notes_ar": "الاحتفاظ بنسخة احتياطية من جدول purchases_returns_details قبل تشغيل الـ UPDATE.",
    "rollback_notes_en": "Backup purchases_returns_details table before running UPDATE.",
    "playbook_steps_ar": [
      "تحديد الفترة الزمنية المستهدفة لتصحيح المرتجعات.",
      "أخذ نسخة احتياطية من جدول purchases_returns_details.",
      "فحص الأصناف المشتملة على عبوات (pack=2) ومعاملات التحويل في جدول sizes.",
      "تنفيذ أمر التحديث والتحقق من صحة الأسعار والكميات الناتجة."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-003",
    "filename": "journalold_2023.sql",
    "title_ar": "مكتبة تسويات وتصحيحات المشتريات والقيود والتحويلات المخزنية الشاملة",
    "title_en": "Comprehensive Purchases, Journal Entries & Stock Transfer Corrections Toolkit",
    "problem_ar": "تراكم انحرافات في أسعار شراء الأصناف بعد الخصم، وفروقات قيود الصرف والقبض، وأخطاء في تكلفة بضاعة أول المدة والتحويلات بين الفروع لسنة 2023.",
    "problem_en": "تراكم انحرافات في أسعار شراء الأصناف بعد الخصم، وفروقات قيود الصرف والقبض، وأخطاء في تكلفة بضاعة أول المدة والتحويلات بين الفروع لسنة 2023.",
    "solution_ar": "مجموعة شاملة من السكربتات المتسلسلة لتحديث تكلفة الشراء بالخصم، ومطابقة القيود مع الفواتير، وضبط تكاليف التحويلات، وتحديث الأستاذ العام.",
    "solution_en": "مجموعة شاملة من السكربتات المتسلسلة لتحديث تكلفة الشراء بالخصم، ومطابقة القيود مع الفواتير، وضبط تكاليف التحويلات، وتحديث الأستاذ العام.",
    "category_id": "CAT-ACCOUNTING",
    "category_name_ar": "الحسابات والتكاليف",
    "category_name_en": "Accounting & Costing",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Expert",
    "risk_level": "CRITICAL",
    "tags": [
      "#purchases",
      "#general_table",
      "#journal",
      "#gl_trans",
      "#transfers",
      "#accounting",
      "#cost_update"
    ],
    "code_type": "sql",
    "code": "تحديث سعر الشراء بالخصم\r\nUPDATE general_table AS t1, (SELECT purchases.id,purchases_details.product_id, purchases_details.quantity * sizes.convert as quantity,purchases.discount / purchases.sub_total as discount_prc,purchases_details.unit_price - (purchases_details.unit_price * (purchases.discount / purchases.sub_total)) as unit_price2 ,purchases_details.unit_price,sizes.convert as conv FROM `purchases` inner join purchases_details on purchases_details.purchase_id = purchases.id inner join sizes on purchases_details.size = sizes.serial WHERE purchases.`discount` > 0 and purchases.discount_type = 1) AS t2 SET t1.cost = t2.unit_price2/conv WHERE t1.product_id = t2.product_id and t1.link_id = t2.id and t1.quantity = t2.quantity and t1.type = 3;\r\n\r\nUPDATE general_table AS t1, (SELECT purchases.id,purchases_details.product_id, purchases_details.quantity * sizes.convert as quantity,purchases.discount,purchases_details.unit_price - (purchases_details.unit_price * (purchases.discount / 100)) as unit_price2 ,purchases_details.unit_price, sizes.convert as conv FROM `purchases` inner join purchases_details on purchases_details.purchase_id = purchases.id inner join sizes on purchases_details.size = sizes.serial WHERE purchases.`discount` > 0 and purchases.discount_type = 0) AS t2\r\n  SET t1.cost = t2.unit_price2/t2.conv\r\n  WHERE t1.product_id = t2.product_id and t1.link_id = t2.id and t1.quantity = t2.quantity and t1.type = 3;\r\n\r\n--تحديث سعر الشراء من المشتريات \r\nUPDATE sizes AS t1,\r\n (SELECT * FROM purchases_details)\r\n  AS t2 SET t1.purchase_price = t2.unit_price\r\n   WHERE t1.product_id = t2.product_id and t1.serial = t2.size\r\n   AND (t1.purchase_price = 0 OR t1.purchase_price IS NULL) ;\r\n\r\n--تحديث أسعار الأحجام المختلفة\r\nUPDATE sizes AS t1,\r\n (SELECT * FROM sizes)\r\n  AS t2 SET t1.purchase_price = t2.purchase_price / t2.convert\r\n   WHERE t1.product_id = t2.product_id and t1.convert = 1 and t2.convert > 1 \r\n   AND (t1.purchase_price = 0 OR t1.purchase_price IS NULL) AND (t2.purchase_price <> 0 and t2.purchase_price IS not NULL)\r\n\r\n\r\n--تحديث التكلفة في ال general_table\r\nUPDATE general_table AS t1, (SELECT\r\n      *\r\n    FROM sizes) AS t2\r\n  SET t1.cost = t2.purchase_price\r\n  WHERE t1.product_id = t2.product_id and t2.convert = 1 \r\n  AND (t1.cost = 0 OR t1.cost IS NULL);\r\n  \r\n  --حذف المكرر في القيد\r\n  DELETE t1\r\n    FROM journal t1\r\n      INNER JOIN journal t2\r\n  WHERE t1.id < t2.id\r\n    AND t1.type_id IN (44, 42, 45, 46,51,54,57)\r\n    AND t1.type_id = t2.type_id\r\n    AND t1.reference = t2.reference;\r\n--حذف حركات القيود\r\n  DELETE\r\n    FROM gl_trans\r\n  WHERE type_id IN (44, 42, 45, 46,51,54,57)\r\n    AND gl_trans.trans_date >= '2019-01-01';\r\n    delete from gl_trans where type_no not in (select id from journal);\r\n--صرف داخلي 54\r\n INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      54 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND type = 8\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 54)\r\n    GROUP BY link_id;\r\n\r\n     DELETE\r\n    FROM gl_trans\r\n  WHERE type_id IN (54)\r\n    AND gl_trans.trans_date >= '2019-01-01';\r\n\r\n    \r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      54 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'in' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 54))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 8)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      54 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      sides.gl_account_id AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'out' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN internal_paids\r\n        ON (( general_table.link_id = internal_paids.id)))\r\n      JOIN sides ON (side_id = sides.id)\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 54))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 8)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             sides.gl_account_id,\r\n             journal.id;\r\n\r\n\r\n-- المشتريات\r\n\r\n\r\n    INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      5 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      1 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND type = 3\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 5)\r\n    GROUP BY link_id;\r\n\r\n DELETE\r\n    FROM gl_trans\r\n  WHERE type_id IN (5)\r\n    AND gl_trans.trans_date >= '2019-01-01';\r\n      INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      5 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      purchases.total-tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM stores\r\n      INNER JOIN journal\r\n        ON journal.type_id = 5\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.store_id = stores.id\r\n        AND journal.reference = purchases.id\r\n    GROUP BY stores.gl_account_id,\r\n             journal.id,\r\n             purchases.date,\r\n             purchases.total-tax_value;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      5 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      system_config.value,\r\n      purchases.tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN purchases\r\n             ON purchases.date >= '2019-01-01'\r\n             AND journal.reference = purchases.id\r\n             AND journal.type_id = 5\r\n    WHERE purchases.tax_value <> 0\r\n    AND system_config.key = 'value_added_account_id'\r\n    GROUP BY journal.id,\r\n             purchases.date,\r\n             purchases.tax_value;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      5 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      suppliers.gl_account_id AS gl_account_id,\r\n      (purchases.total - purchases.paid) * (-1) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.id = journal.reference\r\n        AND journal.type_id = 5\r\n      INNER JOIN suppliers\r\n        ON purchases.supplier_id = suppliers.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      5 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      branches.branch_box_gl_account_id,\r\n      (purchases.paid) * (-1) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.id = journal.reference\r\n        AND journal.type_id = 5\r\n      INNER JOIN branches\r\n        ON purchases.branch_id = branches.id\r\n    WHERE journal.type_id = 5\r\n    AND purchases.paid > 0;\r\n\r\n--مرتجع المشتريات\r\nnn\r\n--سند الصرف\r\n    INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      51 AS type,\r\n      accounting.date AS trans_date,\r\n      accounting.serial,\r\n      accounting.date AS event_date,\r\n      accounting.date AS doc_date,\r\n      55 AS currency_id,\r\n      0 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM accounting\r\n      INNER JOIN branches\r\n        ON accounting.branch_id = branches.id\r\n    WHERE accounting.date >= '2019-01-01'\r\n    AND accounting.serial NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 51)\r\n    AND paid_type = 0;\r\n\r\ndelete from gl_trans where type_id = 51;\r\n\r\n\r\n INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      51 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      branches.branch_box_gl_account_id AS gl_account_id,\r\n      accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 51\r\n        and  accounting.amount > 0 \r\n      INNER JOIN branches\r\n        ON accounting.branch_id = branches.id;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      51 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      users.gl_account_id AS gl_account_id,\r\n      -1 * accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 51\r\n        and  accounting.amount > 0 \r\n      INNER JOIN users\r\n        ON accounting.delegate_id = users.id;\r\n\r\n        INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      51 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      payment_methods.accounting_id AS gl_account_id,\r\n      -1 * accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 51\r\n        and  accounting.amount > 0 and accounting.delegate_id = 0 \r\n      INNER JOIN payment_methods\r\n        ON accounting.payment_type = payment_methods.id;\r\n\r\n=======================================================================================\r\n--التحويل\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      44 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE date >= '2019-01-01'\r\n    AND type = 1\r\n    AND quantity_type = 'out'\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 44)\r\n    GROUP BY link_id;\r\n    delete from gl_trans where type_id = 44;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      44 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      round(sum(CASE WHEN  general_table.quantity_type = 'in' THEN  general_table.cost *  general_table.quantity ELSE  general_table.cost *  general_table.quantity * -1 END) ,2) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 44))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 1)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n--انتاج\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      18 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE date >= '2019-01-01'\r\n    AND type = 9\r\n    AND quantity_type = 'out'\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 18)\r\n    GROUP BY link_id;\r\n    delete from gl_trans where type_id = 18;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      18 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      round(sum(CASE WHEN  general_table.quantity_type = 'in' THEN  general_table.cost *  general_table.quantity ELSE  general_table.cost *  general_table.quantity * -1 END) ,2) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 18))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 9)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;             \r\n\r\n  --تجميع\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      22 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE date >= '2019-01-01'\r\n    AND type = 10\r\n    AND quantity_type = 'out'\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 22)\r\n    GROUP BY link_id;\r\n    delete from gl_trans where type_id = 22;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      22 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      round(sum(CASE WHEN  general_table.quantity_type = 'in' THEN  general_table.cost *  general_table.quantity ELSE  general_table.cost *  general_table.quantity * -1 END) ,2) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 18))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 10)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;             \r\n\r\n--جرد المخزون\r\nINSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      55 AS type,\r\n      date AS trans_date,\r\n       store_inventory.id ,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n     1 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  store_inventory\r\n      INNER JOIN branches\r\n        ON  store_inventory.branch_id = branches.id\r\n    WHERE date >= '2021-01-01'\r\n    AND store_inventory.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 55)\r\n    GROUP BY  store_inventory.id ;\r\n    delete from gl_trans where type_id = 55;\r\n  \r\n   INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      55 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      sum(round(CASE WHEN  general_table.quantity_type = 'in' THEN  general_table.cost *  general_table.quantity  ELSE  general_table.cost *  general_table.quantity * -1 END ,2))AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 55))))\r\n    WHERE  general_table.date >= '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      55 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      512 AS gl_account_id,\r\n      sum(round(CASE WHEN  general_table.quantity_type = 'in' THEN  general_table.cost *  general_table.quantity *-1 ELSE  general_table.cost *  general_table.quantity  END ,2))AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 55))))\r\n    WHERE  general_table.date >= '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n/*             \r\nINSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      46 AS type,\r\n      date AS trans_date,\r\n       store_inventory.id ,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      55 AS currency_id,\r\n     1 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  store_inventory\r\n      INNER JOIN branches\r\n        ON  store_inventory.branch_id = branches.id\r\n    WHERE date < '2021-01-01'\r\n    AND store_inventory.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 46)\r\n    GROUP BY  store_inventory.id ;\r\n    delete from gl_trans where type_id = 46;\r\n  \r\n   INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      46 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'in' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 46))))\r\n    WHERE  general_table.date < '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      46 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      512 AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'out' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 46))))\r\n    WHERE  general_table.date < '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n*/\r\n\r\n\r\n\r\n--المبيعات\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      45 AS type,\r\n      bills.date AS trans_date,\r\n      bills.id,\r\n      bills.date AS event_date,\r\n      bills.date AS doc_date,\r\n      55 AS currency_id,\r\n      0 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM bills\r\n      INNER JOIN branches\r\n        ON bills.branch_id = branches.id\r\n    WHERE bills.date >= '2019-01-01'\r\n    AND bills.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 45);\r\n\r\ndelete from gl_trans where type_id = 45;\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      45 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      users.gl_account_id AS gl_account_id,\r\n      bills.total AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN bills\r\n        ON bills.date >= '2019-01-01'\r\n        AND journal.reference = bills.id\r\n        AND journal.type_id =45\r\n      INNER JOIN users\r\n        ON bills.delegate_id = users.id;  \r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      45 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      system_config.value,\r\n      (-1) * (bills.total - bills.tax_value) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills\r\n             ON bills.date >= '2019-01-01'\r\n             AND journal.reference = bills.id\r\n             AND journal.type_id = 45\r\n    WHERE system_config.key = 'sales_account_id'\r\n    GROUP BY journal.id,\r\n             bills.amount,\r\n             bills.date,\r\n             bills.total,\r\n             bills.tax_value;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      45 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      system_config.value,\r\n      -1 * bills.tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills\r\n             ON bills.date >= '2019-01-01'\r\n             AND journal.reference = bills.id\r\n             AND journal.type_id = 45\r\n    WHERE system_config.key = 'value_added_account_id'\r\n    GROUP BY journal.id,\r\n             bills.tax_value,\r\n             bills.date;\r\n\r\n  \r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\n  SELECT 45 AS typ, journal.id AS id, vgeneralcost.date AS date,\r\n   stores.gl_account_id AS gl_account_id, vgeneralcost.cost, 0 AS dimension_id, 0 AS dimension2_id, journal.branch_id \r\n   FROM vgeneralcost \r\n   INNER JOIN stores on\r\n   vgeneralcost.store_id = stores.id \r\n   INNER JOIN journal ON vgeneralcost.link_id = journal.reference AND vgeneralcost.date = journal.trans_date\r\n   AND journal.type_id = 45 \r\n   GROUP BY vgeneralcost.link_id, vgeneralcost.date, vgeneralcost.store_id, stores.gl_account_id, journal.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      45 AS typ,\r\n      journal.id AS id,\r\n      vgeneralcost.date AS date,\r\n      system_config.value,\r\n      -1 * vgeneralcost.cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         vgeneralcost\r\n           INNER JOIN stores\r\n             ON vgeneralcost.store_id = stores.id\r\n           INNER JOIN journal\r\n             ON vgeneralcost.link_id = journal.reference AND vgeneralcost.date = journal.trans_date\r\n             AND journal.type_id = 45 and vgeneralcost.type = 0\r\n    WHERE  system_config.key = 'sales_cost_account'\r\n    GROUP BY vgeneralcost.link_id,\r\n             vgeneralcost.date,\r\n             vgeneralcost.store_id,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n    \r\n\r\n--مرتجعات المبيعات\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      57 AS type,\r\n      bills_returned.date AS trans_date,\r\n      bills_returned.id,\r\n      bills_returned.date AS event_date,\r\n      bills_returned.date AS doc_date,\r\n      55 AS currency_id,\r\n      0 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM bills_returned\r\n      INNER JOIN branches\r\n        ON bills_returned.branch_id = branches.id\r\n    WHERE bills_returned.date >= '2019-01-01'\r\n    AND bills_returned.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 57);\r\n\r\ndelete from gl_trans where type_id = 57;\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      57 AS typ,\r\n      journal.id AS id,\r\n      bills_returned.date AS date,\r\n      users.gl_account_id AS gl_account_id,\r\n      bills_returned.total AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN bills_returned\r\n        ON bills_returned.date >= '2019-01-01'\r\n        AND journal.reference = bills_returned.id\r\n        AND journal.type_id = 57\r\n      INNER JOIN users\r\n        ON bills_returned.delegate_id = users.id;  \r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      57 AS typ,\r\n      journal.id AS id,\r\n      bills_returned.date AS date,\r\n      system_config.value,\r\n      (-1) * (bills_returned.total - bills_returned.tax_value) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills_returned\r\n             ON bills_returned.date >= '2019-01-01'\r\n             AND journal.reference = bills_returned.id\r\n             AND journal.type_id = 57\r\n    WHERE system_config.key = 'sales_account_id'\r\n    GROUP BY journal.id,\r\n             bills_returned.amount,\r\n             bills_returned.date,\r\n             bills_returned.total,\r\n             bills_returned.tax_value;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      57 AS typ,\r\n      journal.id AS id,\r\n      bills_returned.date AS date,\r\n      system_config.value,\r\n      -1 * bills_returned.tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills_returned\r\n             ON bills_returned.date >= '2019-01-01'\r\n             AND journal.reference = bills_returned.id\r\n             AND journal.type_id = 57\r\n    WHERE system_config.key = 'value_added_account_id'\r\n    GROUP BY journal.id,\r\n             bills_returned.tax_value,\r\n             bills_returned.date;\r\n\r\n  \r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\n  SELECT 57 AS typ, journal.id AS id, vgeneralcost.date AS date,\r\n   stores.gl_account_id AS gl_account_id,  abs(vgeneralcost.cost), 0 AS dimension_id, 0 AS dimension2_id, journal.branch_id \r\n   FROM vgeneralcost \r\n   INNER JOIN stores on\r\n   vgeneralcost.store_id = stores.id \r\n   INNER JOIN journal ON vgeneralcost.link_id = journal.reference \r\n   AND journal.type_id = 57 and vgeneralcost.type = 2\r\n   GROUP BY vgeneralcost.link_id, vgeneralcost.date, vgeneralcost.store_id, stores.gl_account_id, journal.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      57 AS typ,\r\n      journal.id AS id,\r\n      vgeneralcost.date AS date,\r\n      system_config.value,\r\n      -1 * abs(vgeneralcost.cost),\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         vgeneralcost\r\n           INNER JOIN stores\r\n             ON vgeneralcost.store_id = stores.id\r\n           INNER JOIN journal\r\n             ON vgeneralcost.link_id = journal.reference\r\n             AND journal.type_id = 57 and vgeneralcost.type = 2\r\n    WHERE  system_config.key = 'sales_cost_account'\r\n    GROUP BY vgeneralcost.link_id,\r\n             vgeneralcost.date,\r\n             vgeneralcost.store_id,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n    \r\n  UPDATE journal AS t1, (SELECT\r\n      type_no,\r\n      type_id,\r\n      SUM(amount) AS amount\r\n    FROM gl_trans\r\n    WHERE amount > 0\r\n    GROUP BY type_no,\r\n             type_id) AS t2\r\n  SET t1.amount = t2.amount\r\n  WHERE t1.id = t2.type_no\r\n  AND t1.type_id = t2.type_id\r\n  AND t1.type_id IN (44, 42, 45,46, 51);\r\n\r\n  UPDATE purchases AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 42;\r\n\r\nUPDATE bills AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 45;\r\n\r\nUPDATE transfers AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 44;\r\n\r\nUPDATE accounting AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 51;\r\n\r\n\r\ndelete gl_trans where type_no not in (select id from journal)\r\n\r\n\r\n\r\nupdate `journal` set `monthly_sequence` = MONTH(`trans_date`)\r\n\r\nSELECT\r\n*\r\n    FROM gl_trans t2 inner join journal t1 \r\n  on t1.id = t2.type_no\r\n  AND t1.type_id = t2.type_id\r\n  AND t1.type_id IN (44, 42, 45, 51) and t1.id = 4323;\r\n\r\n\r\nSELECT `type_id`,`type_no`,sum(`amount`) FROM `gl_trans` group by `type_id`,`type_no` having sum(`amount`) <> 0 ORDER BY `sum(``amount``)` DESC\r\n\r\n--افتتاحي\r\n\r\ndelete from gl_trans where type_no = 2829;\r\nINSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\nSELECT 40 AS typ, 2829 AS id, '2021-12-31' AS date, account_id AS gl_account_id, sum(amount) AS cost, 0 AS dimension_id, 0 AS dimension2_id, 6 as branch from gl_trans where account_id in \r\n( SELECT id FROM `chart_master` WHERE `account_type` LIKE '1%' or `account_type` LIKE '2%' or `account_type` LIKE '5%') group by account_id having sum(amount) <> 0;\r\n\r\n\r\nINSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\nSELECT 40 AS typ, 2829 AS id, '2021-12-31' AS date, 51 AS gl_account_id, sum(amount) AS cost, 0 AS dimension_id, 0 AS dimension2_id, 6 as branch from gl_trans where account_id in \r\n( SELECT id FROM `chart_master` WHERE `account_type` LIKE '3%' or `account_type` LIKE '4%' ) ;\r\n\r\n--مقارنة رصيد المندوب سند الصرف حسابات ومخزون\r\nSELECT\r\n accounting.delegate_id,users.name ,accounting.id as accounting_id,accounting.amount AS inv ,gl_trans.amount AS acc\r\nFROM accounting\r\n  INNER JOIN users\r\n    ON accounting.delegate_id = users.id\r\n  RIGHT OUTER JOIN journal\r\n    ON accounting.id = journal.reference\r\n  INNER JOIN gl_trans\r\n    ON journal.id = gl_trans.type_no\r\n    AND users.gl_account_id = gl_trans.account_id AND journal.type_id = 51 AND ABS(accounting.amount)<> ABS(gl_trans.amount) and accounting.type = 'out'\r\n\r\n--مقارنة رصيد المندوب فاتورة المبيعات حسابات ومخزون\r\n    SELECT\r\n bills.delegate_id,users.name ,bills.id as bill_id,bills.total AS inv ,gl_trans.amount AS acc\r\nFROM bills\r\n  INNER JOIN users\r\n    ON bills.delegate_id = users.id\r\n  RIGHT OUTER JOIN journal\r\n    ON bills.id = journal.reference\r\n  INNER JOIN gl_trans\r\n    ON journal.id = gl_trans.type_no\r\n    AND users.gl_account_id = gl_trans.account_id AND journal.type_id = 45 AND ABS(bills.total)<> ABS(gl_trans.amount) \r\n\r\nSELECT gl_trans.type_id,journal.reference,gl_trans.amount,bills.amount ,bills.discount,bills.discount_type,gl_trans.amount+bills.amount FROM gl_trans  inner JOIN journal on journal.id = gl_trans.type_no and journal.deleted_at is null RIGHT outer join bills on bills.id = journal.reference where account_id = 1074 and gl_trans.type_id = 8 and gl_trans.amount + bills.amount <> 0",
    "tables": [
      "general_table",
      "purchases",
      "purchases_details",
      "sizes",
      "journal",
      "gl_trans",
      "branches",
      "stores",
      "internal_paids",
      "sides",
      "system_config",
      "suppliers",
      "accounting",
      "users",
      "payment_methods",
      "store_inventory",
      "bills",
      "vgeneralcost",
      "bills_returned",
      "transfers",
      "chart_master"
    ],
    "missing_tables": [
      "vgeneralcost"
    ],
    "existing_tables": [
      "general_table",
      "purchases",
      "purchases_details",
      "sizes",
      "journal",
      "gl_trans",
      "branches",
      "stores",
      "internal_paids",
      "sides",
      "system_config",
      "suppliers",
      "accounting",
      "users",
      "payment_methods",
      "store_inventory",
      "bills",
      "bills_returned",
      "transfers",
      "chart_master"
    ],
    "database_compatibility": "YELLOW",
    "compatibility_reason_ar": "السكربت متوافق جزئياً. الجداول المفقودة في الهيكل الحالي: (vgeneralcost). يحتاج مراجعة قبل الاستخدام.",
    "compatibility_reason_en": "Partially compatible. Missing tables in current schema: (vgeneralcost). Requires review.",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.819Z",
    "backup_required": true,
    "rollback_notes_ar": "سكربت ضخم وشامل يمس الأستاذ العام واليومية وحركات المخزون. يتطلب نسخة احتياطية كاملة وإيقاف حركة المستخدمين أثناء التطبيق.",
    "rollback_notes_en": "Comprehensive enterprise script modifying GL and inventory valuation. Full DB backup mandatory.",
    "playbook_steps_ar": [
      "أخذ نسخة احتياطية كاملة من قاعدة البيانات.",
      "تشغيل السكربت مرحلياً وفق الأقسام المحددة (سعر الشراء -> تسوية القيود -> التحويلات).",
      "فحص الجداول المرتبطة والتحقق من عدم وجود قيود غير متوازنة.",
      "مطابقة تقارير كشف الحساب وميزان المراجعة."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-004",
    "filename": "truncate database مخزون وحسابات.txt",
    "title_ar": "تفريغ وتصفير بيانات حركات المخزون والحسابات (بيئة الاختبار / التهيئة)",
    "title_en": "Truncate Inventory & Accounting Operational Data (Test / Staging Reset)",
    "problem_ar": "الحاجة لتصفير حركات المبيعات والمشتريات والقيود واليومية ومخزون المستودعات لبدء سنة جديدة أو إعادة تهيئة بيئة الاختبار مع الحفاظ على الدليل المحاسبي وبيانات الأصناف.",
    "problem_en": "الحاجة لتصفير حركات المبيعات والمشتريات والقيود واليومية ومخزون المستودعات لبدء سنة جديدة أو إعادة تهيئة بيئة الاختبار مع الحفاظ على الدليل المحاسبي وبيانات الأصناف.",
    "solution_ar": "أوامر TRUNCATE متسلسلة لجميع جداول العمليات والحركات والأرشيف للمخزون والحسابات.",
    "solution_en": "أوامر TRUNCATE متسلسلة لجميع جداول العمليات والحركات والأرشيف للمخزون والحسابات.",
    "category_id": "CAT-CLEANUP",
    "category_name_ar": "تفريغ وتهيئة",
    "category_name_en": "Data Cleanup",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "CRITICAL",
    "tags": [
      "#truncate",
      "#cleanup",
      "#reset",
      "#database",
      "#dangerous"
    ],
    "code_type": "sql",
    "code": "TRUNCATE accounting;\r\nTRUNCATE accounting_2022;\r\nTRUNCATE accounting_2021;\r\nTRUNCATE accounts_tags;\r\nTRUNCATE account_tags;\r\nTRUNCATE bills;\r\nTRUNCATE bills_2022;\r\nTRUNCATE bills_2021;\r\nTRUNCATE bill_details;\r\nTRUNCATE bill_details_2022;\r\nTRUNCATE bill_details_2021;\r\nTRUNCATE bills_returned;\r\nTRUNCATE bills_returned_2022;\r\nTRUNCATE bills_returned_2021;\r\nTRUNCATE bill_details_returned;\r\nTRUNCATE bill_details_returned_2022;\r\nTRUNCATE bill_details_returned_2021;\r\nTRUNCATE audit_trail;\r\nTRUNCATE a_customers;\r\nTRUNCATE cash_receipt_details;\r\nTRUNCATE cash_receipt_details_2022;\r\nTRUNCATE cash_receipt_details_2021;\r\nTRUNCATE categories;\r\nTRUNCATE accounts_tags;\r\nTRUNCATE customer_paid_bank;\r\nTRUNCATE delegate_tracking;\r\nTRUNCATE diacount_offers;\r\nTRUNCATE diacount_offers_details;\r\nTRUNCATE expectations;\r\nTRUNCATE general_table;\r\nTRUNCATE general_table_2022;\r\nTRUNCATE general_table_2021;\r\nTRUNCATE gl_trans;\r\nTRUNCATE gl_trans_2022;\r\nTRUNCATE gl_trans_2021;\r\nTRUNCATE journal;\r\nTRUNCATE journal_2022;\r\nTRUNCATE journal_2021;\r\nTRUNCATE a_logs;\r\nTRUNCATE logs;\r\nTRUNCATE logs_2022;\r\nTRUNCATE logs_2021;\r\nTRUNCATE patches;\r\nTRUNCATE patches_2022;\r\nTRUNCATE patches_2021;\r\nTRUNCATE paid_opening_bills;\r\nTRUNCATE paid_opening_bills_2022;\r\nTRUNCATE paid_opening_bills_2021;\r\nTRUNCATE products;\r\nTRUNCATE purchases_details;\r\nTRUNCATE purchases_details_2021;\r\nTRUNCATE purchases;\r\nTRUNCATE purchases_2022;\r\nTRUNCATE purchases_2021;\r\nTRUNCATE sizes;\r\nTRUNCATE stores;\r\nTRUNCATE store_inventory;\r\nTRUNCATE store_inventory_2022;\r\nTRUNCATE store_inventory_2021;\r\nTRUNCATE store_inventory_details;\r\nTRUNCATE store_inventory_details_2022;\r\nTRUNCATE store_inventory_details_2021;\r\nTRUNCATE suppliers;\r\nTRUNCATE targets;\r\nTRUNCATE transfers;\r\nTRUNCATE transfers_2022;\r\nTRUNCATE transfers_2021;\r\nTRUNCATE transfer_details;\r\nTRUNCATE transfer_details_2022;\r\nTRUNCATE transfer_details_2021;\r\nTRUNCATE visits;\r\nTRUNCATE orders_offers_details;\r\nTRUNCATE orders_offers;\r\nTRUNCATE price_list_customers;\r\nTRUNCATE price_list_details;\r\nTRUNCATE products_g_order_additions;\r\nTRUNCATE price_list;\r\nTRUNCATE products_g_order_details;\r\nTRUNCATE products_g_details;\r\nTRUNCATE products_g_orders;\r\ntruncate internal_paids;\r\nTRUNCATE internal_paid_details;",
    "tables": [],
    "missing_tables": [],
    "existing_tables": [],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.821Z",
    "backup_required": true,
    "rollback_notes_ar": "خطر للغاية: أوامر TRUNCATE تحذف كافة السجلات التشغيلية بشكل نهائي ولا يمكن التراجع عنها إلا عبر استعادة Backup كامل.",
    "rollback_notes_en": "CRITICAL DANGER: TRUNCATE permanently removes all transactional records. Irreversible without full DB restore.",
    "playbook_steps_ar": [
      "التأكد التام 100% أن البيئة الحالية ليست بيئة الإنتاج الفعلي (Live Production).",
      "أخذ نسختين احتياطيتين مستقلتين من قاعدة البيانات.",
      "التأكد من عدم وجود مستخدمين متصلين بالنظام.",
      "تنفيذ أوامر التفريغ والتحقق من نظافة الجداول وإعادة بناء الأرصدة الافتتاحية."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-005",
    "filename": "truncate hr.txt",
    "title_ar": "تفريغ وتصفير سجلات حركات الموارد البشرية والرواتب والحضور",
    "title_en": "Truncate HR, Attendance & Payroll Transactional Logs",
    "problem_ar": "الحاجة لمسح سجلات الحضور والانصراف، الجزاءات، المكافآت، ومسيرات الرواتب التجريبية قبل إطلاق النظام الفعلي للموظفين.",
    "problem_en": "الحاجة لمسح سجلات الحضور والانصراف، الجزاءات، المكافآت، ومسيرات الرواتب التجريبية قبل إطلاق النظام الفعلي للموظفين.",
    "solution_ar": "أوامر TRUNCATE لتنظيف جداول الحركات الفرعية في موديول الموارد البشرية (attendance, awards, deductions, payroll, loans).",
    "solution_en": "أوامر TRUNCATE لتنظيف جداول الحركات الفرعية في موديول الموارد البشرية (attendance, awards, deductions, payroll, loans).",
    "category_id": "CAT-HR",
    "category_name_ar": "الموارد البشرية",
    "category_name_en": "Human Resources",
    "modules": [
      "MOD-6"
    ],
    "difficulty": "Intermediate",
    "risk_level": "CRITICAL",
    "tags": [
      "#hr",
      "#payroll",
      "#attendance",
      "#truncate",
      "#cleanup"
    ],
    "code_type": "sql",
    "code": "TRUNCATE `attendance`;\r\nTRUNCATE `awards`;\r\nTRUNCATE `bank_details`;\r\nTRUNCATE `browse_history`;\r\nTRUNCATE `deductions`;\r\nTRUNCATE `department`;\r\nTRUNCATE `departures`;\r\nTRUNCATE `employees`;\r\nTRUNCATE `employee_documents`;\r\nTRUNCATE `employee_followers`;\r\nTRUNCATE `expenses`;\r\nTRUNCATE `holidays`;\r\nTRUNCATE `leave_applications`;\r\nTRUNCATE `loans`;\r\nTRUNCATE `noticeboards`;\r\nTRUNCATE `payrolls`;\r\nTRUNCATE `request_applications`;\r\nTRUNCATE `social_insurance`;\r\nTRUNCATE `work_contracts`;\r\nTRUNCATE `tickets`;",
    "tables": [],
    "missing_tables": [],
    "existing_tables": [],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.822Z",
    "backup_required": true,
    "rollback_notes_ar": "يمسح سجلات الحضور والمسيرات نهائياً. يتطلب Backup قبل التشغيل.",
    "rollback_notes_en": "Permanently wipes HR operational logs. Backup required.",
    "playbook_steps_ar": [
      "التأكد من حفظ مسيرات الرواتب المدققة في أرشيف خارجي.",
      "أخذ نسخة احتياطية من جداول الموارد البشرية.",
      "تنفيذ أوامر التفريغ لجداول الحركات التجريبية."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-006",
    "filename": "view csustomerbil.txt",
    "title_ar": "إنشاء View موحد لمطابقة فواتير العملاء وسندات القبض والأرصدة الافتتاحية",
    "title_en": "Create Consolidated Customer Billing, Receipts & Opening Balance View",
    "problem_ar": "تشتت مديونيات وفواتير العملاء بين فواتير المبيعات النشطة، وسندات القبض المباشرة، وسندات القبض البنكية، والأرصدة الافتتاحية السابقة.",
    "problem_en": "تشتت مديونيات وفواتير العملاء بين فواتير المبيعات النشطة، وسندات القبض المباشرة، وسندات القبض البنكية، والأرصدة الافتتاحية السابقة.",
    "solution_ar": "إنشاء View مالي مجمع (csutomer_bill) يدمج الفواتير، الأرصدة الافتتاحية، وسندات القبض عبر UNION ALL موحد لحساب المسدد والمتبقي بدقة.",
    "solution_en": "إنشاء View مالي مجمع (csutomer_bill) يدمج الفواتير، الأرصدة الافتتاحية، وسندات القبض عبر UNION ALL موحد لحساب المسدد والمتبقي بدقة.",
    "category_id": "CAT-VIEWS",
    "category_name_ar": "عروض وتقارير Views",
    "category_name_en": "Views & Reporting",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "LOW",
    "tags": [
      "#view",
      "#customers",
      "#bills",
      "#receipts",
      "#opening_balance",
      "#reporting"
    ],
    "code_type": "sql",
    "code": "create or replace view csutomer_bill as SELECT\r\n        bills.`id` AS bill_id,\r\n        bills.`serial` AS id2,\r\n        bills.`branch_id` AS branch_id,\r\n        bills.`customer_id` AS customer_id,\r\n        bills.`date` AS date,\r\n        bills.`delegate_id` AS delegate_id,\r\n        bills.`store_id` AS store_id,\r\n        ROUND(bills.`amount`, 2) AS amount,\r\n        bills.`discount` AS discount,\r\n        bills.`discount_type` AS discount_type,\r\n        bills.`tax_value` AS tax_value,\r\n        bills.`total` AS total,\r\n        bills.`paid` AS paid,\r\n        IFNULL(SUM(ROUND(cash_receipt_details.`paid_amount`, 2)), 0) AS receipt_pay,\r\n        ROUND(bills.`paid` + IFNULL(SUM(ROUND(cash_receipt_details.`paid_amount`, 2)), 0), 2) AS total_pay,\r\n        ROUND(bills.`total` - bills.`paid` - IFNULL(SUM(ROUND(cash_receipt_details.`paid_amount`, 2)), 0), 2) AS remain,\r\n        customers.`name` AS customer_name,\r\n        users.`name` AS delegate_name,\r\n        branches.`name` AS name,\r\n        'sales' as typeName,\r\n        1 AS type\r\n      FROM ((((bills\r\n        LEFT JOIN cash_receipt_details\r\n          ON (bills.`id` = cash_receipt_details.`bill_id`))\r\n        LEFT JOIN customers\r\n          ON (bills.`customer_id` = customers.`id`))\r\n        LEFT JOIN users\r\n          ON (bills.`delegate_id` = users.`id`))\r\n        LEFT JOIN branches\r\n          ON (users.`branch_id` = branches.`id`))\r\n      GROUP BY bills.`branch_id`,\r\n                bills.`customer_id`,\r\n                bills.`date`,\r\n                bills.`delegate_id`,\r\n                bills.`store_id`,\r\n                bills.`amount`,\r\n                bills.`discount`,\r\n                bills.`discount_type`,\r\n                bills.`tax_value`,\r\n                bills.`total`,\r\n                bills.`paid`,\r\n                bills.`remain`,\r\n                bills.`id`,\r\n                customers.`name`,\r\n                users.`name`,\r\n                branches.`name`\r\n      UNION ALL\r\n      SELECT\r\n        'Open balance' AS bill_id,\r\n        'Open balance' AS id2,\r\n        0 AS branch_id,\r\n        customers.`id` AS customer_id,\r\n        '2019-01-01' AS date,\r\n        customers.`delegate_id` AS delegate_id,\r\n        0 AS store_id,\r\n        customers.`bank` AS amount,\r\n        0 AS discount,\r\n        0 AS discount_type,\r\n        0 AS tax_value,\r\n        customers.`bank` AS total,\r\n        0 AS paid,\r\n        IFNULL(SUM(ROUND(customer_paid_bank.`amount`, 2)), 0) AS receipt_pay,\r\n        ROUND(IFNULL(SUM(ROUND(customer_paid_bank.`amount`, 2)), 0), 2) AS total_pay,\r\n        ROUND(customers.`bank` - IFNULL(SUM(ROUND(customer_paid_bank.`amount`, 2)), 0), 2) AS remain,\r\n        customers.`name` AS customer_name,\r\n        users.`name` AS delegate_name,\r\n        branches.`name` AS name,\r\n        'opening balance' as typeName,\r\n        2 AS type\r\n      FROM (((customers\r\n        LEFT JOIN customer_paid_bank\r\n          ON (customers.`id` = customer_paid_bank.`customer_id`))\r\n        LEFT JOIN users\r\n          ON (customers.`delegate_id` = users.`id`))\r\n        LEFT JOIN branches\r\n          ON (users.`branch_id` = branches.`id`))      \r\n      GROUP BY customers.`id`,\r\n                customers.`delegate_id`,\r\n                customers.`bank`,\r\n                customers.`name`,\r\n                users.`name`,\r\n                branches.`name`\r\n      UNION ALL\r\n      SELECT\r\n        opening_bill_details.`bill_id` AS bill_id,\r\n        opening_bill_details.`bill_id` AS id2,\r\n        opening_bills.`branch_id` AS branch_id,\r\n        opening_bill_details.`customer_id` AS customer_id,\r\n        opening_bill_details.`date` AS date,\r\n        opening_bills.`delegate_id` AS delegate_id,\r\n        0 AS store_id,\r\n        opening_bill_details.`total` AS amount,\r\n        0 AS discount,\r\n        0 AS discount_type,\r\n        0 AS tax_value,\r\n        opening_bill_details.`total` AS total,\r\n        opening_bill_details.`paid` AS paid,\r\n        IFNULL(SUM(ROUND(paid_opening_bills.`paid_amount`, 2)), 0) AS receipt_pay,\r\n        ROUND(opening_bill_details.`paid` + IFNULL(SUM(ROUND(paid_opening_bills.`paid_amount`, 2)), 0), 2) AS total_pay,\r\n        ROUND(opening_bill_details.`remain` - IFNULL(SUM(ROUND(paid_opening_bills.`paid_amount`, 2)), 0), 2) AS remain,\r\n        customers.`name` AS customer_name,\r\n        users.`name` AS delegate_name,\r\n        branches.`name` AS name,\r\n        'opening_bills' as typeName,\r\n        3 AS type\r\n      FROM (((((opening_bills\r\n        JOIN opening_bill_details\r\n          ON (opening_bills.`id` = opening_bill_details.`opening_bill_id`))\r\n        LEFT JOIN customers\r\n          ON (opening_bill_details.`customer_id` = customers.`id`))\r\n        LEFT JOIN paid_opening_bills\r\n          ON (opening_bill_details.`bill_id` = paid_opening_bills.`bill_id`))\r\n        LEFT JOIN users\r\n          ON (customers.`delegate_id` = users.`id`))\r\n        LEFT JOIN branches\r\n          ON (opening_bills.`branch_id` = branches.`id`))\r\n      GROUP BY opening_bill_details.`id`,\r\n                opening_bills.`branch_id`,\r\n                opening_bill_details.`customer_id`,\r\n                opening_bill_details.`date`,\r\n                opening_bills.`delegate_id`,\r\n                customers.`name`,\r\n                users.`name`,\r\n                branches.`name`",
    "tables": [
      "cash_receipt_details",
      "customers",
      "users",
      "branches",
      "customer_paid_bank",
      "opening_bill_details",
      "paid_opening_bills"
    ],
    "missing_tables": [],
    "existing_tables": [
      "cash_receipt_details",
      "customers",
      "users",
      "branches",
      "customer_paid_bank",
      "opening_bill_details",
      "paid_opening_bills"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.823Z",
    "backup_required": false,
    "rollback_notes_ar": "إنشاء View آمن (CREATE OR REPLACE VIEW) ولا يمس البيانات الفعلية في الجداول.",
    "rollback_notes_en": "Safe DDL creation. Does not modify underlying table rows.",
    "playbook_steps_ar": [
      "التحقق من وجود الجداول: bills, cash_receipt_details, customers, users, branches.",
      "تنفيذ كود إنشاء الـ View (csutomer_bill).",
      "اختبار الاستعلام من الـ View ومقارنة إجمالي مديونية عينة من العملاء."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-007",
    "filename": "افتتاحي حسابات.txt",
    "title_ar": "توليد وترحيل القيد الافتتاحي للحسابات من أرصدة السنة السابقة",
    "title_en": "Generate & Post Opening Balance Journal from Previous Year GL Balances",
    "problem_ar": "الحاجة لنقل وإقفال أرصدة ميزان المراجعة للسنة السابقة (الأصول والخصوم وحقوق الملكية وحساب الأرباح والخسائر) كقيد افتتاحي للسنة الجديدة.",
    "problem_en": "الحاجة لنقل وإقفال أرصدة ميزان المراجعة للسنة السابقة (الأصول والخصوم وحقوق الملكية وحساب الأرباح والخسائر) كقيد افتتاحي للسنة الجديدة.",
    "solution_ar": "حذف القيد الافتتاحي السابق برقم المعاملة وتوليد قيود افتتاحية مجمعة في gl_trans لحسابات المركز المالي وقيد صافي الأرباح/الخسائر المجمعة في حساب الأرباح المبقاة.",
    "solution_en": "حذف القيد الافتتاحي السابق برقم المعاملة وتوليد قيود افتتاحية مجمعة في gl_trans لحسابات المركز المالي وقيد صافي الأرباح/الخسائر المجمعة في حساب الأرباح المبقاة.",
    "category_id": "CAT-OPENING",
    "category_name_ar": "أرصدة افتتاحية",
    "category_name_en": "Opening Balances",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "HIGH",
    "tags": [
      "#opening_balance",
      "#gl_trans",
      "#chart_master",
      "#retained_earnings",
      "#journal"
    ],
    "code_type": "sql",
    "code": "delete from gl_trans where type_no = 2829;\r\nINSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\nSELECT 40 AS typ, 2829 AS id, '2020-12-31' AS date, account_id AS gl_account_id, sum(amount) AS cost, 0 AS dimension_id, 0 AS dimension2_id, 6 as branch from gl_trans_2020 where account_id in \r\n( SELECT id FROM chart_master WHERE account_type LIKE '1%' or account_type LIKE '2%' or account_type LIKE '5%') group by account_id having sum(amount) <> 0;\r\n\r\n\r\nINSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\nSELECT 40 AS typ, 2829 AS id, '2020-12-31' AS date, 51 AS gl_account_id, sum(amount) AS cost, 0 AS dimension_id, 0 AS dimension2_id, 6 as branch from gl_trans_2020 where account_id in \r\n( SELECT id FROM chart_master WHERE account_type LIKE '3%' or account_type LIKE '4%' ) ;",
    "tables": [
      "gl_trans",
      "gl_trans_2020",
      "chart_master"
    ],
    "missing_tables": [
      "gl_trans_2020"
    ],
    "existing_tables": [
      "gl_trans",
      "chart_master"
    ],
    "database_compatibility": "YELLOW",
    "compatibility_reason_ar": "السكربت متوافق جزئياً. الجداول المفقودة في الهيكل الحالي: (gl_trans_2020). يحتاج مراجعة قبل الاستخدام.",
    "compatibility_reason_en": "Partially compatible. Missing tables in current schema: (gl_trans_2020). Requires review.",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.824Z",
    "backup_required": true,
    "rollback_notes_ar": "يمسح القيد الافتتاحي السابق ويعيد بناءه. تأكد من صحة رقم المعاملة type_no ورمز الفرع.",
    "rollback_notes_en": "Deletes existing opening journal entry and regenerates. Verify type_no and branch_id.",
    "playbook_steps_ar": [
      "مطابقة وإغلاق حسابات السنة السابقة بالكامل.",
      "التحقق من رقم القيد الافتتاحي (type_no = 2829 أو الرقم المعتمد).",
      "تنفيذ سكربت نقل أرصدة الأصول والخصوم (1%, 2%, 5%).",
      "تنفيذ قيد صافي أرباح حسابات الإيرادات والمصروفات (3%, 4%) في حساب الأرباح المبقاة (حساب 51).",
      "فحص توازن القيد الافتتاحي في ميزان المراجعة (المدين = الدائن)."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-008",
    "filename": "تحديث اجمالي الفواتير من التفصيلي.txt",
    "title_ar": "مزامنة وتحديث إجمالي الفاتورة في الترويسة من مجموع بنود التفاصيل",
    "title_en": "Sync & Update Invoice Header Amounts from Line Item Details",
    "problem_ar": "وجود فواتير مبيعات في جدول bills يختلف مبلغ الإجمالي المسجل في الترويسة (bills.amount) عن مجموع أصنافها في جدول bill_details.",
    "problem_en": "وجود فواتير مبيعات في جدول bills يختلف مبلغ الإجمالي المسجل في الترويسة (bills.amount) عن مجموع أصنافها في جدول bill_details.",
    "solution_ar": "استعلام UPDATE يربط جدول bills بمجموع البنود الفرعية المجمعة بواسطة (GROUP BY bill_id) لتصحيح الإجمالي آلياً.",
    "solution_en": "استعلام UPDATE يربط جدول bills بمجموع البنود الفرعية المجمعة بواسطة (GROUP BY bill_id) لتصحيح الإجمالي آلياً.",
    "category_id": "CAT-INVOICES",
    "category_name_ar": "فواتير ومبيعات",
    "category_name_en": "Invoices & Sales",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "MEDIUM",
    "tags": [
      "#bills",
      "#bill_details",
      "#sync",
      "#data_fix",
      "#invoice_total"
    ],
    "code_type": "sql",
    "code": "update bills ,(SELECT bill_details.bill_id sum(total_price)as price  FROM `bill_details` GROUP by bill_id)x\r\nset bills.amount = x.price where bills.id = x.bill_id;\r\n\r\n\r\nالمرتجع",
    "tables": [
      "bills",
      "bill_details"
    ],
    "missing_tables": [],
    "existing_tables": [
      "bills",
      "bill_details"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.825Z",
    "backup_required": true,
    "rollback_notes_ar": "أخذ نسخة احتياطية من جدول bills قبل التحديث.",
    "rollback_notes_en": "Backup bills table before running UPDATE.",
    "playbook_steps_ar": [
      "فحص الفواتير التي تحتوي على فروقات قبل التحديث.",
      "أخذ نسخة من جدول bills.",
      "تنفيذ أمر التحديث والتحقق من مطابقة الإجماليات."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-009",
    "filename": "تحديث الربط في صلاحيات الدليل المحاسبي.txt",
    "title_ar": "منح وربط صلاحيات الدليل المحاسبي الكاملة لمسؤولي النظام",
    "title_en": "Batch Assign Full Chart of Accounts Permissions to Admin Role",
    "problem_ar": "عدم ظهور بعض حسابات الدليل المحاسبي الجديدة للمشرفين بسبب نقص سجلات الربط في جدول الصلاحيات chartmasterpermissions.",
    "problem_en": "عدم ظهور بعض حسابات الدليل المحاسبي الجديدة للمشرفين بسبب نقص سجلات الربط في جدول الصلاحيات chartmasterpermissions.",
    "solution_ar": "استعلام INSERT جماعي يربط جميع حسابات chart_master بدور المشرف (role_id = 1).",
    "solution_en": "استعلام INSERT جماعي يربط جميع حسابات chart_master بدور المشرف (role_id = 1).",
    "category_id": "CAT-PERM",
    "category_name_ar": "صلاحيات وأمان",
    "category_name_en": "Permissions & Security",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Beginner",
    "risk_level": "LOW",
    "tags": [
      "#permissions",
      "#chart_master",
      "#chartmasterpermissions",
      "#rbac",
      "#security"
    ],
    "code_type": "sql",
    "code": "Insert into chartmasterpermissions (role_id,chartmaster_id) select 1,chart_master.id from chart_master",
    "tables": [
      "chartmasterpermissions",
      "chart_master"
    ],
    "missing_tables": [],
    "existing_tables": [
      "chartmasterpermissions",
      "chart_master"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.827Z",
    "backup_required": false,
    "rollback_notes_ar": "إضافة سجلات صلاحيات إضافية للدور الإداري. آمن ولا يحذف بيانات.",
    "rollback_notes_en": "Adds admin role permissions. Low risk.",
    "playbook_steps_ar": [
      "التحقق من رقم دور المشرف المستهدف (role_id).",
      "تنفيذ الاستعلام لربط الحسابات الشاغرة.",
      "تسجيل خروج ودخول المشرف للتحقق من ظهور الدليل كاملاً."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-009B",
    "filename": "تعديل اجمالي لشامل الضريبة.txt",
    "title_ar": "إعادة احتساب مبالغ مرتجع المبيعات متضمنة ضريبة القيمة المضافة",
    "title_en": "Recalculate Sales Return Header Totals with VAT Inclusion",
    "problem_ar": "فواتير مرتجع مبيعات تم تسجيل مبالغها بدون إضافة نسبة ضريبة القيمة المضافة (15%) مما سبب نقصاً في الإشعار الدائن.",
    "problem_en": "فواتير مرتجع مبيعات تم تسجيل مبالغها بدون إضافة نسبة ضريبة القيمة المضافة (15%) مما سبب نقصاً في الإشعار الدائن.",
    "solution_ar": "تحديث مبالغ فواتير المرتجع (bills_returned.amount) بضرب مجموع أصنافها في 1.15 لإدراج ضريبة القيمة المضافة آلياً.",
    "solution_en": "تحديث مبالغ فواتير المرتجع (bills_returned.amount) بضرب مجموع أصنافها في 1.15 لإدراج ضريبة القيمة المضافة آلياً.",
    "category_id": "CAT-INVOICES",
    "category_name_ar": "فواتير وضريبة",
    "category_name_en": "Invoices & Taxes",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "MEDIUM",
    "tags": [
      "#bills_returned",
      "#bill_details_returned",
      "#vat",
      "#tax",
      "#data_fix"
    ],
    "code_type": "sql",
    "code": "update bills_returned ,(SELECT sum(quantity*unit_price)as x,bill_id FROM `bill_details_returned` GROUP by bill_id) t1 set bills_returned.amount=t1.x*100/115 where bills_returned.id =t1.bill_id;",
    "tables": [
      "bills_returned",
      "bill_details_returned"
    ],
    "missing_tables": [],
    "existing_tables": [
      "bills_returned",
      "bill_details_returned"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.828Z",
    "backup_required": true,
    "rollback_notes_ar": "أخذ نسخة من bills_returned قبل التعديل.",
    "rollback_notes_en": "Backup bills_returned before update.",
    "playbook_steps_ar": [
      "التأكد من نسبة الضريبة القانونية (15%).",
      "فحص الفواتير المستهدفة بنطاق تاريخ محدد.",
      "تشغيل التحديث ومراجعة الإقرارات الضريبية."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-010",
    "filename": "توزيع ارصدة على فواتير قديمة.txt",
    "title_ar": "تنظيف وإعادة توزيع سندات القبض القديمة على فواتير المبيعات",
    "title_en": "Cleanup & Reallocate Historical Cash Receipts onto Invoices",
    "problem_ar": "وجود سجلات توزيع سندات قبض معلقة لسنة سابقة (2021) بدون فواتير صالحة أو مطابقة غير سليمة.",
    "problem_en": "وجود سجلات توزيع سندات قبض معلقة لسنة سابقة (2021) بدون فواتير صالحة أو مطابقة غير سليمة.",
    "solution_ar": "حذف توزيعات السندات المعلقة وتحديث مبالغ المسدد في فواتير 2021 وفق التحصيلات الفعلية.",
    "solution_en": "حذف توزيعات السندات المعلقة وتحديث مبالغ المسدد في فواتير 2021 وفق التحصيلات الفعلية.",
    "category_id": "CAT-DATA-FIX",
    "category_name_ar": "تسوية مقبوضات",
    "category_name_en": "Receipts Allocation",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "HIGH",
    "tags": [
      "#cash_receipt_details",
      "#accounting",
      "#bills",
      "#legacy_tables"
    ],
    "code_type": "sql",
    "code": "delete from cash_receipt_details_2021 where cash_receipt_details_2021.cash_receipt_id not \r\nin (SELECT id from accounting_2021 where bill_id >0) ;\r\nupdate  accounting_2021 set bill_id = 0 where  `type` = 'in' and bill_id > 0 and amount not in (SELECT bills_2021.paid from bills_2021 where bills_2021.id = bill_id)",
    "tables": [
      "cash_receipt_details_2021",
      "accounting_2021",
      "bills_2021"
    ],
    "missing_tables": [
      "cash_receipt_details_2021",
      "accounting_2021",
      "bills_2021"
    ],
    "existing_tables": [],
    "database_compatibility": "RED",
    "compatibility_reason_ar": "السكربت غير متوافق (قديم). جميع الجداول المستخدمة غير موجودة في الهيكل الحالي: (cash_receipt_details_2021, accounting_2021, bills_2021).",
    "compatibility_reason_en": "Incompatible (Outdated). Missing tables: (cash_receipt_details_2021, accounting_2021, bills_2021).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.829Z",
    "backup_required": true,
    "rollback_notes_ar": "يستخدم جداول مخصصة لسنة 2021 (مثل cash_receipt_details_2021). تحقق من وجودها في قاعدة البيانات الحالية.",
    "rollback_notes_en": "Uses legacy 2021 partitioned tables. Validate schema presence first.",
    "playbook_steps_ar": [
      "فحص أسماء الجداول ومطابقتها مع قاعدة البيانات الحالية.",
      "أخذ نسخة احتياطية من جداول المقبوضات.",
      "تنفيذ أوامر الحذف والتحديث ومراجعة حسابات العملاء."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-011",
    "filename": "حذف توزيعات بدون سندات.txt",
    "title_ar": "كشف وحذف توزيعات سداد فواتير الافتتاحي اليتيمة (بدون سند قبض)",
    "title_en": "Identify & Purge Orphaned Opening Bill Allocations Missing Cash Receipts",
    "problem_ar": "وجود سجلات سداد وتوزيع في جدول paid_opening_bills تشير إلى سندات قبض محذوفة من جدول accounting، مما يعطي رصيد مسدد وهمي.",
    "problem_en": "وجود سجلات سداد وتوزيع في جدول paid_opening_bills تشير إلى سندات قبض محذوفة من جدول accounting، مما يعطي رصيد مسدد وهمي.",
    "solution_ar": "استعلام تشخيصي لاستخراج معرفات التوزيعات اليتيمة لحذفها وتصحيح المتبقي على الفاتورة الافتتاحية.",
    "solution_en": "استعلام تشخيصي لاستخراج معرفات التوزيعات اليتيمة لحذفها وتصحيح المتبقي على الفاتورة الافتتاحية.",
    "category_id": "CAT-CLEANUP",
    "category_name_ar": "تنظيف بيانات",
    "category_name_en": "Data Cleanup",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "MEDIUM",
    "tags": [
      "#paid_opening_bills",
      "#accounting",
      "#cleanup",
      "#orphaned_records"
    ],
    "code_type": "sql",
    "code": "SELECT id FROM paid_opening_bills WHERE paid_opening_bills.cash_receipt_id NOT IN (SELECT id FROM accounting)",
    "tables": [
      "paid_opening_bills",
      "accounting"
    ],
    "missing_tables": [],
    "existing_tables": [
      "paid_opening_bills",
      "accounting"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.830Z",
    "backup_required": true,
    "rollback_notes_ar": "الاستعلام المكتوب هو SELECT آمن للاكتشاف. عند تحويله لـ DELETE خذ نسخة احتياطية.",
    "rollback_notes_en": "Currently a safe SELECT probe. Backup before converting to DELETE.",
    "playbook_steps_ar": [
      "تشغيل الاستعلام لحصر التوزيعات اليتيمة.",
      "مراجعة الأسباب ومطابقتها مع كشف حساب العميل.",
      "حذف السجلات غير المعتمدة وتحديث رصيد الفاتورة."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-012",
    "filename": "ربط الحسابات بمراكز التكلفة .txt",
    "title_ar": "ربط جماعي لحسابات المصروفات والإيرادات بمراكز التكلفة والوسوم",
    "title_en": "Batch Link Expense & Revenue Accounts to Cost Center Tags",
    "problem_ar": "عدم توجيه قيود الحسابات التشغيلية إلى مراكز التكلفة المناسبة تلقائياً لعدم وجود ربط في جدول accounts_tags.",
    "problem_en": "عدم توجيه قيود الحسابات التشغيلية إلى مراكز التكلفة المناسبة تلقائياً لعدم وجود ربط في جدول accounts_tags.",
    "solution_ar": "استعلام INSERT يربط جميع حسابات المصروفات والإيرادات (class_id IN 3, 4) بمركز التكلفة المطلوب (tag_id = 5).",
    "solution_en": "استعلام INSERT يربط جميع حسابات المصروفات والإيرادات (class_id IN 3, 4) بمركز التكلفة المطلوب (tag_id = 5).",
    "category_id": "CAT-ACCOUNTING",
    "category_name_ar": "مراكز التكلفة",
    "category_name_en": "Cost Centers",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "LOW",
    "tags": [
      "#accounts_tags",
      "#chart_master",
      "#chart_types",
      "#cost_centers",
      "#accounting"
    ],
    "code_type": "sql",
    "code": "INSERT INTO accounts_tags (tag_id, account_id) SELECT 5, id FROM chart_master WHERE account_type IN ( SELECT tid FROM chart_types WHERE class_id IN (3, 4) );",
    "tables": [
      "accounts_tags",
      "chart_master",
      "chart_types"
    ],
    "missing_tables": [],
    "existing_tables": [
      "accounts_tags",
      "chart_master",
      "chart_types"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.831Z",
    "backup_required": false,
    "rollback_notes_ar": "إضافة وسوم مراكز تكلفة للحسابات. آمن مع إمكانية حذف الوسم بسهولة.",
    "rollback_notes_en": "Adds tag linkages. Low risk and reversible.",
    "playbook_steps_ar": [
      "تحديد رقم مركز التكلفة / الوسم المستهدف (tag_id).",
      "تحديد فئات الحسابات المطلوب ربطها (المصروفات والإيرادات).",
      "تنفيذ أمر الربط والتحقق من ظهور مركز التكلفة في شاشة إدخال القيود."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-013",
    "filename": "مقارنة رصيد المندوب سند الصرف حسابات ومخزون.txt",
    "title_ar": "مطابقة رصيد المندوب وسندات الصرف بين حركات المخزون وقيود الأستاذ العام",
    "title_en": "Reconcile Sales Rep Expense Vouchers & Invoices vs Accounting Ledger",
    "problem_ar": "ظهور فروقات بين مبالغ سندات الصرف أو فواتير المبيعات المسجلة للمندوب في موديول المخزون والمبالغ المسجلة في حساب المندوب بالأستاذ العام (gl_trans).",
    "problem_en": "ظهور فروقات بين مبالغ سندات الصرف أو فواتير المبيعات المسجلة للمندوب في موديول المخزون والمبالغ المسجلة في حساب المندوب بالأستاذ العام (gl_trans).",
    "solution_ar": "استعلامان تشخيصيان لمطابقة سندات الصرف وفواتير المبيعات مع قيود اليومية الخاصة بحساب المندوب واستخراج الحركات غير المتطابقة (ABS(inv) <> ABS(acc)).",
    "solution_en": "استعلامان تشخيصيان لمطابقة سندات الصرف وفواتير المبيعات مع قيود اليومية الخاصة بحساب المندوب واستخراج الحركات غير المتطابقة (ABS(inv) <> ABS(acc)).",
    "category_id": "CAT-RECON",
    "category_name_ar": "مطابقة وتسوية",
    "category_name_en": "Reconciliation",
    "modules": [
      "MOD-1",
      "MOD-2",
      "MOD-5"
    ],
    "difficulty": "Advanced",
    "risk_level": "LOW",
    "tags": [
      "#delegates",
      "#accounting",
      "#bills",
      "#gl_trans",
      "#journal",
      "#reconciliation"
    ],
    "code_type": "sql",
    "code": "SELECT\r\n accounting.delegate_id,users.name ,accounting.id as accounting_id,accounting.amount AS inv ,gl_trans.amount AS acc\r\nFROM accounting\r\n  INNER JOIN users\r\n    ON accounting.delegate_id = users.id\r\n  RIGHT OUTER JOIN journal\r\n    ON accounting.id = journal.reference\r\n  INNER JOIN gl_trans\r\n    ON journal.id = gl_trans.type_no\r\n    AND users.gl_account_id = gl_trans.account_id AND journal.type_id = 51 AND ABS(accounting.amount)<> ABS(gl_trans.amount) and accounting.type = 'out'\r\n\r\n--مقارنة رصيد المندوب فاتورة المبيعات حسابات ومخزون\r\n    SELECT\r\n bills.delegate_id,users.name ,bills.id as bill_id,bills.total AS inv ,gl_trans.amount AS acc\r\nFROM bills\r\n  INNER JOIN users\r\n    ON bills.delegate_id = users.id\r\n  RIGHT OUTER JOIN journal\r\n    ON bills.id = journal.reference\r\n  INNER JOIN gl_trans\r\n    ON journal.id = gl_trans.type_no\r\n    AND users.gl_account_id = gl_trans.account_id AND journal.type_id = 45 AND ABS(bills.total)<> ABS(gl_trans.amount)",
    "tables": [
      "accounting",
      "users",
      "journal",
      "gl_trans",
      "bills"
    ],
    "missing_tables": [],
    "existing_tables": [
      "accounting",
      "users",
      "journal",
      "gl_trans",
      "bills"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.832Z",
    "backup_required": false,
    "rollback_notes_ar": "استعلامات SELECT قراءة فقط آمنة 100% لفحص ومطابقة الأرصدة.",
    "rollback_notes_en": "Read-only SELECT audit queries. 100% safe.",
    "playbook_steps_ar": [
      "تشغيل استعلام مطابقة سندات الصرف لمندوبي المبيعات.",
      "تشغيل استعلام مطابقة فواتير المبيعات مع القيود.",
      "حصر الفروقات ومعالجة القيود المعلقة لكل مندوب."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-014",
    "filename": "ميزان المراجعة.txt",
    "title_ar": "بناء الـ View الهيكلي لميزان المراجعة ومستويات الدليل المحاسبي (vchart)",
    "title_en": "Create Hierarchical Chart of Accounts & Trial Balance View (vchart)",
    "problem_ar": "صعوبة استخراج ميزان مراجعة هرمي متعدد المستويات (المستوى 1، المستوى 2، المستوى 3، والحساب الرئيسي) بربط مباشر.",
    "problem_en": "صعوبة استخراج ميزان مراجعة هرمي متعدد المستويات (المستوى 1، المستوى 2، المستوى 3، والحساب الرئيسي) بربط مباشر.",
    "solution_ar": "إنشاء View مالي احترافي باسم vchart يربط chart_types مع chart_class ومستويات الدليل المحاسبي وتصنيف الحسابات (أصول، خصوم، ملكية، إيرادات، مصروفات).",
    "solution_en": "إنشاء View مالي احترافي باسم vchart يربط chart_types مع chart_class ومستويات الدليل المحاسبي وتصنيف الحسابات (أصول، خصوم، ملكية، إيرادات، مصروفات).",
    "category_id": "CAT-VIEWS",
    "category_name_ar": "عروض وتقارير Views",
    "category_name_en": "Views & Reporting",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "LOW",
    "tags": [
      "#vchart",
      "#trial_balance",
      "#chart_master",
      "#chart_class",
      "#chart_types",
      "#view"
    ],
    "code_type": "sql",
    "code": "CREATE or replace VIEW vchart  AS SELECT\r\n  t1.`tid` AS tid,\r\n  t1.`class_id` AS lvl1,\r\n  chart_class.`name` AS lvl1_name,\r\n  SUBSTR(t1.`tid`, 1, 2) AS lvl2,\r\n  t2.`name` AS lvl2_name,\r\n  CASE WHEN OCTET_LENGTH(t1.`tid`) >= 4 THEN SUBSTR(t1.`tid`, 1, 4) ELSE NULL END AS lvl3,\r\n  t3.`name` AS lvl3_name,\r\n  CASE WHEN OCTET_LENGTH(t1.`tid`) >= 8 THEN SUBSTR(t1.`tid`, 1, 😎 ELSE NULL END AS lvl4,\r\n  t4.`name` AS lvl4_name,\r\n  CASE WHEN OCTET_LENGTH(t1.`tid`) >= 12 THEN SUBSTR(t1.`tid`, 1, 12) ELSE NULL END AS lvl5,\r\n  t5.`name` AS lvl5_name,\r\n  CASE WHEN OCTET_LENGTH(t1.`tid`) >= 16 THEN t1.`tid` ELSE NULL END AS lvl6,\r\n  t6.`name` AS lvl6_name\r\nFROM ((((((chart_types\r\nt1\r\n  JOIN chart_class\r\n    ON (t1.`class_id` = chart_class.`id`))\r\n  LEFT JOIN chart_types\r\nt2\r\n    ON (SUBSTR(t1.`tid`, 1, 2) = t2.`tid`))\r\n  LEFT JOIN chart_types\r\nt3\r\n    ON (SUBSTR(t1.`tid`, 1, 4) = t3.`tid`\r\n    AND OCTET_LENGTH(t1.`tid`) >= 4))\r\n  LEFT JOIN chart_types\r\nt4\r\n    ON (SUBSTR(t1.`tid`, 1, 😎 = t4.`tid`\r\n    AND OCTET_LENGTH(t1.`tid`) >= 8))\r\n  LEFT JOIN chart_types\r\nt5\r\n    ON (SUBSTR(t1.`tid`, 1, 12) = t5.`tid`\r\n    AND OCTET_LENGTH(t1.`tid`) >= 12))\r\n  LEFT JOIN chart_types\r\nt6\r\n    ON (t1.`tid` = t6.`tid`\r\n    AND OCTET_LENGTH(t1.`tid`) >= 16));",
    "tables": [
      "chart_class",
      "chart_types"
    ],
    "missing_tables": [],
    "existing_tables": [
      "chart_class",
      "chart_types"
    ],
    "database_compatibility": "GREEN",
    "compatibility_reason_ar": "جميع الجداول المستخدمة في السكربت متطابقة وموجودة في قاعدة البيانات الحالية (newdatabase2026.sql).",
    "compatibility_reason_en": "All referenced tables exist in Current Database (newdatabase2026.sql).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.834Z",
    "backup_required": false,
    "rollback_notes_ar": "إنشاء View تقارير آمن ولا يمس بيانات الجداول.",
    "rollback_notes_en": "Safe reporting view creation.",
    "playbook_steps_ar": [
      "التحقق من وجود جداول: chart_types, chart_class.",
      "تنفيذ كود إنشاء الـ View (vchart).",
      "استعراض شجرة الحسابات وميزان المراجعة من خلال الـ View."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-015",
    "filename": "نقل البيان لسندات الصرف في الحسابات.txt",
    "title_ar": "نقل وتحديث نص البيان والملاحظات من سندات الصرف إلى قيود اليومية",
    "title_en": "Propagate Description Memos from Payment Vouchers to Journal Entries",
    "problem_ar": "ظهور قيود اليومية لسندات الصرف والقبض ببيان فارغ أو غير واضح في تقارير كشف الحساب ودفتر الأستاذ.",
    "problem_en": "ظهور قيود اليومية لسندات الصرف والقبض ببيان فارغ أو غير واضح في تقارير كشف الحساب ودفتر الأستاذ.",
    "solution_ar": "تحديث حقل memo في جدول journal بنص الملاحظات (notes) المسجل في جدول accounting المقابل لكل حركة وسند.",
    "solution_en": "تحديث حقل memo في جدول journal بنص الملاحظات (notes) المسجل في جدول accounting المقابل لكل حركة وسند.",
    "category_id": "CAT-DATA-FIX",
    "category_name_ar": "تصحيح بيانات",
    "category_name_en": "Data Fix",
    "modules": [
      "MOD-2"
    ],
    "difficulty": "Intermediate",
    "risk_level": "MEDIUM",
    "tags": [
      "#journal",
      "#accounting",
      "#memo",
      "#notes",
      "#audit_trail"
    ],
    "code_type": "sql",
    "code": "UPDATE journal\r\nSET memo = (\r\n    SELECT notes\r\n    FROM accounting\r\n    WHERE accounting.id = journal.reference and journal.type_id = 12\r\n)\r\nWHERE EXISTS (\r\n    SELECT 1\r\n    FROM accounting\r\n    WHERE accounting.id = journal.reference and journal.type_id = 12\r\n);\r\n-- Update memo column in gl_trans table\r\nUPDATE gl_trans\r\nSET memo = (\r\n    SELECT memo\r\n    FROM journal\r\n    WHERE journal.id = gl_trans.type_no and gl_trans.type_id = 12\r\n)\r\nWHERE EXISTS (\r\n    SELECT 1\r\n    FROM journal\r\n    WHERE journal.id = gl_trans.type_no and gl_trans.type_id = 12\r\n);",
    "tables": [
      "journal",
      "accounting",
      "memo",
      "update"
    ],
    "missing_tables": [
      "memo",
      "update"
    ],
    "existing_tables": [
      "journal",
      "accounting"
    ],
    "database_compatibility": "YELLOW",
    "compatibility_reason_ar": "السكربت متوافق جزئياً. الجداول المفقودة في الهيكل الحالي: (memo, update). يحتاج مراجعة قبل الاستخدام.",
    "compatibility_reason_en": "Partially compatible. Missing tables in current schema: (memo, update). Requires review.",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.835Z",
    "backup_required": true,
    "rollback_notes_ar": "أخذ نسخة من جدول journal قبل تحديث حقول البيان.",
    "rollback_notes_en": "Backup journal table before running UPDATE.",
    "playbook_steps_ar": [
      "أخذ نسخة احتياطية من جدول journal.",
      "فحص أنواع السندات المستهدفة (type_id = 12 وغيرها).",
      "تنفيذ التحديث ومراجعة ظهور البيان في كشف الحساب."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-016",
    "filename": "نقل مديونية العملاء رصيد الافتتاحي.txt",
    "title_ar": "ترحيل ونقل مديونيات العملاء والأرصدة الافتتاحية من قاعدة بيانات قديمة",
    "title_en": "Migrate Customer Balances & Opening Indebtedness from Legacy Database",
    "problem_ar": "الحاجة لنقل مديونيات العملاء السابقة مع أسماء المندوبين والفروع من قاعدة بيانات قديمة ودمجها في النظام الجديد بدقة.",
    "problem_en": "الحاجة لنقل مديونيات العملاء السابقة مع أسماء المندوبين والفروع من قاعدة بيانات قديمة ودمجها في النظام الجديد بدقة.",
    "solution_ar": "سكربت ترحيل بيانات متقدم يجمع الأرصدة الافتتاحية، والمقبوضات، والمرتجعات، وفواتير المبيعات ويربطها بحسابات الدليل المحاسبي لكل عميل.",
    "solution_en": "سكربت ترحيل بيانات متقدم يجمع الأرصدة الافتتاحية، والمقبوضات، والمرتجعات، وفواتير المبيعات ويربطها بحسابات الدليل المحاسبي لكل عميل.",
    "category_id": "CAT-MIGRATION",
    "category_name_ar": "ترحيل وهجرة بيانات",
    "category_name_en": "Data Migration",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Expert",
    "risk_level": "HIGH",
    "tags": [
      "#customers",
      "#migration",
      "#opening_balance",
      "#legacy_database",
      "#data_import"
    ],
    "code_type": "sql",
    "code": "update raitotec_naqa_alsama.customers,(select * from (select\r\n            q.customer_id,\r\n            q.gl_account_id,\r\n            q.customer_name,\r\n            q.membership_no,\r\n            q.delegate_name,\r\n            q.delegate_id,\r\n            q.type,\r\n            q.id,\r\n            q.date,\r\n            q.time,\r\n            round(sum( q.total),2) as total from (SELECT\r\n    '' AS `notes`,\r\n  raitotec_atyab2.customers.`id` AS `customer_id`,\r\n  raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n  raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n  raitotec_atyab2.users.`name` AS `delegate_name`,\r\n  raitotec_atyab2.users.`id` AS `delegate_id`,\r\n  'Open balace' AS `type`,\r\n  0 AS `id`,\r\n  '2020-01-01' AS `date`,\r\n  '00:00' AS `time`,\r\n  raitotec_atyab2.customers.`bank` AS `total`\r\n  FROM\r\n      (\r\n          raitotec_atyab2.customers\r\n     left JOIN raitotec_atyab2.users ON\r\n          (\r\n              raitotec_atyab2.customers.`delegate_id` = raitotec_atyab2.users.`id`\r\n          )\r\n      )\r\n  WHERE\r\n    raitotec_atyab2.customers.`bank` > 0\r\n\r\n\r\nUNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    CASE WHEN raitotec_atyab2.bills.`total` < 0 THEN 'Return' ELSE 'Sales'\r\nEND AS `type`,\r\nraitotec_atyab2.bills.`id` AS `id`,\r\nraitotec_atyab2.bills.`date` AS `date`,\r\nraitotec_atyab2.bills.`time` AS `time`,\r\nROUND(raitotec_atyab2.bills.`total`, 2) AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.bills\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.bills.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.bills.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\nUNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n   raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'Return' AS `type`,\r\n    raitotec_atyab2.bills_returned.`id` AS `id`,\r\n    raitotec_atyab2.bills_returned.`date` AS `date`,\r\n    raitotec_atyab2.bills_returned.`time` AS `time`,\r\n    ROUND(raitotec_atyab2.bills_returned.`total`, 2) AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.bills_returned\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.bills_returned.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.bills_returned.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\n    UNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n   raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'debitnote' AS `type`,\r\n    raitotec_atyab2.debitnote.`id` AS `id`,\r\n    raitotec_atyab2.debitnote.`date` AS `date`,\r\n    raitotec_atyab2.debitnote.`time` AS `time`,\r\n    ROUND(raitotec_atyab2.debitnote.`total`, 2) AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.debitnote\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.debitnote.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.debitnote.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\n    UNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n   raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'creditnote' AS `type`,\r\n    raitotec_atyab2.creditnote.`id` AS `id`,\r\n    raitotec_atyab2.creditnote.`date` AS `date`,\r\n    raitotec_atyab2.creditnote.`time` AS `time`,\r\n    ROUND(raitotec_atyab2.creditnote.`total`*-1, 2) AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.creditnote\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.creditnote.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.creditnote.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\nUNION ALL\r\nSELECT\r\n    raitotec_atyab2.accounting.`notes` AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'Cash Receipt' AS `type`,\r\n    raitotec_atyab2.accounting.`id` AS `id`,\r\n    raitotec_atyab2.accounting.`date` AS `date`,\r\n    raitotec_atyab2.accounting.`time` AS `time`,\r\n    raitotec_atyab2.accounting.`amount` * -1 AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.accounting.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.accounting.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\nWHERE\r\n    raitotec_atyab2.accounting.`type` = 'in' AND raitotec_atyab2.accounting.`cash_type` = 0\r\n    union all\r\n    SELECT\r\n    raitotec_atyab2.accounting.`notes` AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n    raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'paid receipt' AS `type`,\r\n\r\n    raitotec_atyab2.accounting.`id` AS `id`,\r\n    raitotec_atyab2.accounting.`date` AS `date`,\r\n    raitotec_atyab2.accounting.`time` AS `time`,\r\n    raitotec_atyab2.accounting.`amount` AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                (\r\n                    raitotec_atyab2.accounting.`customer_id` = raitotec_atyab2.customers.`id`\r\n                )\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            (\r\n                raitotec_atyab2.accounting.`delegate_id` = raitotec_atyab2.users.`id`\r\n            )\r\n        )\r\n    )\r\nWHERE\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting.`type` = 'return'\r\n        ) AND(\r\n            raitotec_atyab2.accounting.`paid_type` = 2\r\n        ) AND(\r\n            raitotec_atyab2.accounting.`customer_id` IS NOT NULL\r\n        )\r\n    )\r\n    union all\r\n    SELECT\r\n    raitotec_atyab2.accounting.`notes` AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n    raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'paid receipt for customer' AS `type`,\r\n\r\n    raitotec_atyab2.accounting.`id` AS `id`,\r\n    raitotec_atyab2.accounting.`date` AS `date`,\r\n    raitotec_atyab2.accounting.`time` AS `time`,\r\n    raitotec_atyab2.accounting.`amount` AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                (\r\n                    raitotec_atyab2.accounting.`customer_id` = raitotec_atyab2.customers.`id`\r\n                )\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            (\r\n                raitotec_atyab2.accounting.`delegate_id` = raitotec_atyab2.users.`id`\r\n            )\r\n        )\r\n    )\r\nWHERE\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting.`type` = 'out'\r\n        ) AND(\r\n            raitotec_atyab2.accounting.`paid_type` = 3\r\n        ) AND(\r\n            raitotec_atyab2.accounting.`customer_id` IS NOT NULL\r\n        )\r\n    )\r\nUNION ALL\r\nSELECT\r\n    raitotec_atyab2.accounting.`notes` AS `notes`,\r\n    raitotec_atyab2.customers.`id` AS `customer_id`,\r\n    raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n    raitotec_atyab2.customers.`name` AS `customer_name`,\r\n    raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n    raitotec_atyab2.users.`name` AS `delegate_name`,\r\n    raitotec_atyab2.users.`id` AS `delegate_id`,\r\n    'discount' AS `type`,\r\n    raitotec_atyab2.accounting.`id` AS `id`,\r\n    raitotec_atyab2.accounting.`date` AS `date`,\r\n    raitotec_atyab2.accounting.`time` AS `time`,\r\n    raitotec_atyab2.accounting.`amount` * -1 AS `total`\r\nFROM\r\n    (\r\n        (\r\n            raitotec_atyab2.accounting\r\n        JOIN raitotec_atyab2.customers ON\r\n            (\r\n                raitotec_atyab2.accounting.`customer_id` = raitotec_atyab2.customers.`id`\r\n            )\r\n        )\r\n    JOIN raitotec_atyab2.users ON\r\n        (\r\n            raitotec_atyab2.accounting.`delegate_id` = raitotec_atyab2.users.`id`\r\n        )\r\n    )\r\nWHERE\r\n    raitotec_atyab2.accounting.`type` = 'in' AND raitotec_atyab2.accounting.`cash_type` = 1\r\n\r\nUNION ALL\r\n  SELECT\r\n  raitotec_atyab2.accounting_2022.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'Cash Receipt' AS `type`,\r\n      raitotec_atyab2.accounting_2022.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2022.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2022.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2022.`amount` * -1 AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2022\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  raitotec_atyab2.accounting_2022.`customer_id` = raitotec_atyab2.customers.`id`\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              raitotec_atyab2.accounting_2022.`delegate_id` = raitotec_atyab2.users.`id`\r\n          )\r\n      )\r\n  WHERE\r\n      raitotec_atyab2.accounting_2022.`type` = 'in'\r\n\r\n      union all\r\n      SELECT\r\n      raitotec_atyab2.accounting_2022.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n      raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'paid receipt' AS `type`,\r\n\r\n      raitotec_atyab2.accounting_2022.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2022.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2022.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2022.`amount` AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2022\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  (\r\n                      raitotec_atyab2.accounting_2022.`customer_id` = raitotec_atyab2.customers.`id`\r\n                  )\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              (\r\n                  raitotec_atyab2.accounting_2022.`delegate_id` = raitotec_atyab2.users.`id`\r\n              )\r\n          )\r\n      )\r\n  WHERE\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2022.`type` = 'return'\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2022.`paid_type` = 2\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2022.`customer_id` IS NOT NULL\r\n          )\r\n      )\r\n      union all\r\n      SELECT\r\n      raitotec_atyab2.accounting_2022.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n      raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'paid receipt for customer' AS `type`,\r\n\r\n      raitotec_atyab2.accounting_2022.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2022.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2022.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2022.`amount` AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2022\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  (\r\n                      raitotec_atyab2.accounting_2022.`customer_id` = raitotec_atyab2.customers.`id`\r\n                  )\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              (\r\n                  raitotec_atyab2.accounting_2022.`delegate_id` = raitotec_atyab2.users.`id`\r\n              )\r\n          )\r\n      )\r\n  WHERE\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2022.`type` = 'out'\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2022.`paid_type` = 3\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2022.`customer_id` IS NOT NULL\r\n          )\r\n      )\r\n      UNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n  raitotec_atyab2.customers.`id` AS `customer_id`,\r\n  raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n  raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n  raitotec_atyab2.users.`name` AS `delegate_name`,\r\n  raitotec_atyab2.users.`id` AS `delegate_id`,\r\n  CASE WHEN raitotec_atyab2.bills_2022.`total` < 0 THEN 'Return' ELSE 'Sales'\r\nEND AS `type`,\r\nraitotec_atyab2.bills_2022.`id` AS `id`,\r\nraitotec_atyab2.bills_2022.`date` AS `date`,\r\nraitotec_atyab2.bills_2022.`time` AS `time`,\r\nROUND(raitotec_atyab2.bills_2022.`total`, 2) AS `total`\r\nFROM\r\n  (\r\n      (\r\n          raitotec_atyab2.bills_2022\r\n      JOIN raitotec_atyab2.customers ON\r\n          (\r\n              raitotec_atyab2.bills_2022.`customer_id` = raitotec_atyab2.customers.`id`\r\n          )\r\n      )\r\n  JOIN raitotec_atyab2.users ON\r\n      (\r\n          raitotec_atyab2.bills_2022.`delegate_id` = raitotec_atyab2.users.`id`\r\n      )\r\n  )\r\nUNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n  raitotec_atyab2.customers.`id` AS `customer_id`,\r\n  raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n  raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n  raitotec_atyab2.users.`name` AS `delegate_name`,\r\n  raitotec_atyab2.users.`id` AS `delegate_id`,\r\n  'Return' AS `type`,\r\n  raitotec_atyab2.bills_returned_2022.`id` AS `id`,\r\n  raitotec_atyab2.bills_returned_2022.`date` AS `date`,\r\n  raitotec_atyab2.bills_returned_2022.`time` AS `time`,\r\n  ROUND(\r\n      raitotec_atyab2.bills_returned_2022.`total`,\r\n      2\r\n  ) AS `total`\r\nFROM\r\n  (\r\n      (\r\n          raitotec_atyab2.bills_returned_2022\r\n      JOIN raitotec_atyab2.customers ON\r\n          (\r\n              raitotec_atyab2.bills_returned_2022.`customer_id` = raitotec_atyab2.customers.`id`\r\n          )\r\n      )\r\n  JOIN raitotec_atyab2.users ON\r\n      (\r\n          raitotec_atyab2.bills_returned_2022.`delegate_id` = raitotec_atyab2.users.`id`\r\n      )\r\n  )\r\n  UNION ALL\r\n  SELECT\r\n  raitotec_atyab2.accounting_2023.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'Cash Receipt' AS `type`,\r\n      raitotec_atyab2.accounting_2023.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2023.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2023.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2023.`amount` * -1 AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2023\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  raitotec_atyab2.accounting_2023.`customer_id` = raitotec_atyab2.customers.`id`\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              raitotec_atyab2.accounting_2023.`delegate_id` = raitotec_atyab2.users.`id`\r\n          )\r\n      )\r\n  WHERE\r\n      raitotec_atyab2.accounting_2023.`type` = 'in'\r\n\r\n      union all\r\n      SELECT\r\n      raitotec_atyab2.accounting_2023.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n      raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'paid receipt' AS `type`,\r\n\r\n      raitotec_atyab2.accounting_2023.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2023.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2023.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2023.`amount` AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2023\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  (\r\n                      raitotec_atyab2.accounting_2023.`customer_id` = raitotec_atyab2.customers.`id`\r\n                  )\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              (\r\n                  raitotec_atyab2.accounting_2023.`delegate_id` = raitotec_atyab2.users.`id`\r\n              )\r\n          )\r\n      )\r\n  WHERE\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2023.`type` = 'return'\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2023.`paid_type` = 2\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2023.`customer_id` IS NOT NULL\r\n          )\r\n      )\r\n      union all\r\n      SELECT\r\n      raitotec_atyab2.accounting_2023.`notes` AS `notes`,\r\n      raitotec_atyab2.customers.`id` AS `customer_id`,\r\n      raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n      raitotec_atyab2.customers.`name` AS `customer_name`,\r\n      raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n      raitotec_atyab2.users.`name` AS `delegate_name`,\r\n      raitotec_atyab2.users.`id` AS `delegate_id`,\r\n      'paid receipt for customer' AS `type`,\r\n\r\n      raitotec_atyab2.accounting_2023.`id` AS `id`,\r\n      raitotec_atyab2.accounting_2023.`date` AS `date`,\r\n      raitotec_atyab2.accounting_2023.`time` AS `time`,\r\n      raitotec_atyab2.accounting_2023.`amount` AS `total`\r\n  FROM\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2023\r\n          JOIN raitotec_atyab2.customers ON\r\n              (\r\n                  (\r\n                      raitotec_atyab2.accounting_2023.`customer_id` = raitotec_atyab2.customers.`id`\r\n                  )\r\n              )\r\n          )\r\n      JOIN raitotec_atyab2.users ON\r\n          (\r\n              (\r\n                  raitotec_atyab2.accounting_2023.`delegate_id` = raitotec_atyab2.users.`id`\r\n              )\r\n          )\r\n      )\r\n  WHERE\r\n      (\r\n          (\r\n              raitotec_atyab2.accounting_2023.`type` = 'out'\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2023.`paid_type` = 3\r\n          ) AND(\r\n              raitotec_atyab2.accounting_2023.`customer_id` IS NOT NULL\r\n          )\r\n      )\r\n      UNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n  raitotec_atyab2.customers.`id` AS `customer_id`,\r\n  raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n  raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n  raitotec_atyab2.users.`name` AS `delegate_name`,\r\n  raitotec_atyab2.users.`id` AS `delegate_id`,\r\n  CASE WHEN raitotec_atyab2.bills_2023.`total` < 0 THEN 'Return' ELSE 'Sales'\r\nEND AS `type`,\r\nraitotec_atyab2.bills_2023.`id` AS `id`,\r\nraitotec_atyab2.bills_2023.`date` AS `date`,\r\nraitotec_atyab2.bills_2023.`time` AS `time`,\r\nROUND(raitotec_atyab2.bills_2023.`total`, 2) AS `total`\r\nFROM\r\n  (\r\n      (\r\n          raitotec_atyab2.bills_2023\r\n      JOIN raitotec_atyab2.customers ON\r\n          (\r\n              raitotec_atyab2.bills_2023.`customer_id` = raitotec_atyab2.customers.`id`\r\n          )\r\n      )\r\n  JOIN raitotec_atyab2.users ON\r\n      (\r\n          raitotec_atyab2.bills_2023.`delegate_id` = raitotec_atyab2.users.`id`\r\n      )\r\n  )\r\nUNION ALL\r\nSELECT\r\n    '' AS `notes`,\r\n  raitotec_atyab2.customers.`id` AS `customer_id`,\r\n  raitotec_atyab2.customers.`gl_account_id` AS `gl_account_id`,\r\n  raitotec_atyab2.customers.`name` AS `customer_name`,\r\n  raitotec_atyab2.customers.`membership_no` AS `membership_no`,\r\n\r\n  raitotec_atyab2.users.`name` AS `delegate_name`,\r\n  raitotec_atyab2.users.`id` AS `delegate_id`,\r\n  'Return' AS `type`,\r\n  raitotec_atyab2.bills_returned_2023.`id` AS `id`,\r\n  raitotec_atyab2.bills_returned_2023.`date` AS `date`,\r\n  raitotec_atyab2.bills_returned_2023.`time` AS `time`,\r\n  ROUND(\r\n      raitotec_atyab2.bills_returned_2023.`total`,\r\n      2\r\n  ) AS `total`\r\nFROM\r\n  (\r\n      (\r\n          raitotec_atyab2.bills_returned_2023\r\n      JOIN raitotec_atyab2.customers ON\r\n          (\r\n              raitotec_atyab2.bills_returned_2023.`customer_id` = raitotec_atyab2.customers.`id`\r\n          )\r\n      )\r\n  JOIN raitotec_atyab2.users ON\r\n      (\r\n          raitotec_atyab2.bills_returned_2023.`delegate_id` = raitotec_atyab2.users.`id`\r\n      )\r\n  )\r\n  )q where q.customer_id>0  AND q.`date` < '2024-05-01'  group by q.customer_id) customerdata)oldatyab\r\n  set raitotec_naqa_alsama.customers.bank=oldatyab.total\r\n  WHERE  raitotec_naqa_alsama.customers.id=oldatyab.customer_id;",
    "tables": [
      "raitotec_naqa_alsama",
      "raitotec_atyab2"
    ],
    "missing_tables": [
      "raitotec_naqa_alsama",
      "raitotec_atyab2"
    ],
    "existing_tables": [],
    "database_compatibility": "RED",
    "compatibility_reason_ar": "السكربت غير متوافق (قديم). جميع الجداول المستخدمة غير موجودة في الهيكل الحالي: (raitotec_naqa_alsama, raitotec_atyab2).",
    "compatibility_reason_en": "Incompatible (Outdated). Missing tables: (raitotec_naqa_alsama, raitotec_atyab2).",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.837Z",
    "backup_required": true,
    "rollback_notes_ar": "يتطلب فحص أسماء قواعد البيانات القديمة والتأكد من تطابق مفاتيح العملاء والحسابات قبل التنفيذ.",
    "rollback_notes_en": "Cross-database migration script. Verify database names and customer ID mapping.",
    "playbook_steps_ar": [
      "توفير نسخة من قاعدة البيانات القديمة على نفس السيرفر.",
      "مطابقة أكواد العملاء ودليل الحسابات بين القاعدتين.",
      "أخذ نسخة احتياطية من جدول customers في النظام الجديد.",
      "تنفيذ الترحيل ومراجعة أرصدة العملاء الناتجة."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  },
  {
    "id": "SCR-017",
    "filename": "2021.txt",
    "title_ar": "مستودع استعلامات وتصحيحات حركات وفواتير سنة 2021 التاريخية",
    "title_en": "Historical 2021 Invoices, Receipts & Stock Transactions Toolkit",
    "problem_ar": "مجموعة استعلامات لمعالجة فروقات فواتير ومقبوضات سنة 2021 التاريخية التي كانت تستخدم جداول منفصلة ومجزأة بالسنوات.",
    "problem_en": "مجموعة استعلامات لمعالجة فروقات فواتير ومقبوضات سنة 2021 التاريخية التي كانت تستخدم جداول منفصلة ومجزأة بالسنوات.",
    "solution_ar": "استعلامات فحص وتعديل لفواتير 2021 وجداول السندات المنفصلة.",
    "solution_en": "استعلامات فحص وتعديل لفواتير 2021 وجداول السندات المنفصلة.",
    "category_id": "CAT-DATA-FIX",
    "category_name_ar": "أرشيف وتصحيح قديم",
    "category_name_en": "Historical Archive",
    "modules": [
      "MOD-1",
      "MOD-2"
    ],
    "difficulty": "Advanced",
    "risk_level": "HIGH",
    "tags": [
      "#archive_2021",
      "#historical_data",
      "#bills_2021",
      "#accounting_2021"
    ],
    "code_type": "sql",
    "code": "--تحديث سعر الشراء من المشتريات \r\nUPDATE sizes AS t1,\r\n (SELECT * FROM purchases_details)\r\n  AS t2 SET t1.purchase_price = t2.unit_price\r\n   WHERE t1.product_id = t2.product_id and t1.serial = t2.size and t2.unit_price > 0 \r\n   AND (t1.purchase_price <= 0 OR t1.purchase_price IS NULL) ;\r\n\r\n--تحديث أسعار الأحجام المختلفة\r\nUPDATE sizes AS t1,\r\n (SELECT * FROM sizes)\r\n  AS t2 SET t1.purchase_price = t2.purchase_price / t2.convert\r\n   WHERE t1.product_id = t2.product_id and t1.convert = 1 and t2.convert > 1 \r\n   AND (t1.purchase_price = 0 OR t1.purchase_price IS NULL) AND (t2.purchase_price <> 0 and t2.purchase_price IS not NULL)\r\n\r\nupdate sizes set purchase_price = abs(purchase_price);\r\n\r\n--تحديث التكلفة في ال general_table\r\nUPDATE general_table AS t1, (SELECT\r\n      *\r\n    FROM sizes) AS t2\r\n  SET t1.cost = t2.purchase_price\r\n  WHERE t1.product_id = t2.product_id and t2.convert = 1 \r\nGL_InquiryController\r\n\r\nUPDATE patches AS t1, (SELECT\r\n      *\r\n    FROM sizes) AS t2\r\n  SET t1.cost = t2.purchase_price\r\n  WHERE t1.product_id = t2.product_id and t2.convert = 1 \r\n  AND (t1.cost = 0 OR t1.cost IS NULL);\r\n  \r\n  --حذف المكرر في القيد\r\n  DELETE t1\r\n    FROM journal t1\r\n      INNER JOIN journal t2\r\n  WHERE t1.id < t2.id\r\n    AND t1.type_id IN (12, 10, 13,20, 16)\r\n    AND t1.type_id = t2.type_id\r\n    AND t1.reference = t2.reference \r\n--حذف حركات القيود\r\n  DELETE\r\n    FROM gl_trans\r\n  WHERE type_id IN (12, 10, 13, 20,16)\r\n    AND gl_trans.trans_date >= '2019-01-01';\r\n\r\n--10 مشتريات\r\n    INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      10 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      20 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND type = 3\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 10)\r\n    GROUP BY link_id;\r\n\r\n DELETE\r\n    FROM gl_trans\r\n  WHERE type_id IN (10)\r\n    AND gl_trans.trans_date >= '2019-01-01';\r\n    \r\n      INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      10 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      purchases.sub_total AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM stores\r\n      INNER JOIN journal\r\n        ON journal.type_id = 10\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.store_id = stores.id\r\n        AND journal.reference = purchases.id\r\n    GROUP BY stores.gl_account_id,\r\n             journal.id,\r\n             purchases.date,\r\n             purchases.sub_total;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      10 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      system_config.value,\r\n      purchases.tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN purchases\r\n             ON purchases.date >= '2019-01-01'\r\n             AND journal.reference = purchases.id\r\n             AND journal.type_id = 10\r\n    WHERE purchases.tax_value <> 0\r\n    AND system_config.key = 'value_added_account_id'\r\n    GROUP BY journal.id,\r\n             purchases.date,\r\n             purchases.tax_value;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      10 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      suppliers.gl_account_id AS gl_account_id,\r\n      (purchases.total - purchases.paid) * (-1) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.id = journal.reference\r\n        AND journal.type_id = 10\r\n      INNER JOIN suppliers\r\n        ON purchases.supplier_id = suppliers.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      10 AS typ,\r\n      journal.id AS id,\r\n      purchases.date AS date,\r\n      branches.branch_box_gl_account_id,\r\n      (purchases.paid) * (-1) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN purchases\r\n        ON purchases.date >= '2019-01-01'\r\n        AND purchases.id = journal.reference\r\n        AND journal.type_id = 10\r\n      INNER JOIN branches\r\n        ON purchases.branch_id = branches.id\r\n    WHERE journal.type_id = 10\r\n    AND purchases.paid > 0;\r\n\r\n    INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      16 AS type,\r\n      accounting.date AS trans_date,\r\n      accounting.id,\r\n      accounting.date AS event_date,\r\n      accounting.date AS doc_date,\r\n      20 AS currency_id,\r\n      0 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM accounting\r\n      INNER JOIN branches\r\n        ON accounting.branch_id = branches.id\r\n    WHERE accounting.date >= '2019-01-01'\r\n    AND accounting.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 16)\r\n    AND paid_type = 0;\r\n\r\ndelete from gl_trans where type_id = 16;\r\n/* مروج\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      16 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      payment_methods.accounting_id AS gl_account_id,\r\n      accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 16\r\n        and  accounting.amount > 0 \r\n      INNER JOIN payment_methods\r\n        ON accounting.payment_method_id = payment_methods.id;*/\r\n\r\n INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      16 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      branches.branch_box_gl_account_id AS gl_account_id,\r\n      accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 16\r\n        and  accounting.amount > 0 \r\n      INNER JOIN branches\r\n        ON accounting.branch_id = branches.id;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      16 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      users.gl_account_id AS gl_account_id,\r\n      -1 * accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 16\r\n        and  accounting.amount > 0 \r\n      INNER JOIN users\r\n        ON accounting.delegate_id = users.id;\r\n\r\n        INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      16 AS typ,\r\n      journal.id AS id,\r\n      accounting.date AS date,\r\n      payment_methods.accounting_id AS gl_account_id,\r\n      -1 * accounting.amount AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN accounting\r\n        ON accounting.date >= '2019-01-01'\r\n        AND journal.reference = accounting.id\r\n        AND journal.type_id = 16\r\n        and  accounting.amount > 0 and accounting.delegate_id = 0 \r\n      INNER JOIN payment_methods\r\n        ON accounting.payment_type = payment_methods.id;\r\n\r\n=======================================================================================\r\n\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      12 AS type,\r\n      date AS trans_date,\r\n      link_id,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      20 AS currency_id,\r\n      ROUND(SUM(quantity * cost), 2) AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  general_table\r\n      INNER JOIN branches\r\n        ON  general_table.branch_id = branches.id\r\n    WHERE date >= '2019-01-01'\r\n    AND type = 1\r\n    AND quantity_type = 'out'\r\n    AND link_id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 12)\r\n    GROUP BY link_id;\r\n    delete from gl_trans where type_id = 12;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      12 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'in' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 12))))\r\n    WHERE  general_table.date >= '2019-01-01'\r\n    AND ( general_table.type = 1)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\nINSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      20 AS type,\r\n      date AS trans_date,\r\n       store_inventory.id ,\r\n      date AS event_date,\r\n      date AS doc_date,\r\n      20 AS currency_id,\r\n     1 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM  store_inventory\r\n      INNER JOIN branches\r\n        ON  store_inventory.branch_id = branches.id\r\n    WHERE date < '2021-01-01'\r\n    AND store_inventory.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 20)\r\n    GROUP BY  store_inventory.id ;\r\n    delete from gl_trans where type_id = 20;\r\n  \r\n   INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      20 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      stores.gl_account_id AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'in' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 20))))\r\n    WHERE  general_table.date < '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      20 AS typ,\r\n      journal.id AS id,\r\n       general_table.date AS date,\r\n      162 AS gl_account_id,\r\n      CASE WHEN  general_table.quantity_type = 'out' THEN ROUND(SUM(( general_table.cost *  general_table.quantity)), 2) ELSE ROUND(SUM(( general_table.cost *  general_table.quantity * -1)), 2) END AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM (( general_table\r\n      JOIN stores\r\n        ON (( general_table.store_id = stores.id)))\r\n      JOIN journal\r\n        ON ((( general_table.link_id = journal.reference)\r\n        AND (journal.type_id = 20))))\r\n    WHERE  general_table.date < '2021-01-01'\r\n    AND ( general_table.type = 5)\r\n    GROUP BY  general_table.link_id,\r\n              general_table.date,\r\n              general_table.store_id,\r\n              general_table.quantity_type,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n\r\n\r\n\r\n\r\n\r\n  INSERT INTO journal (type_id,\r\n  trans_date,\r\n  reference\r\n  , event_date\r\n  , doc_date\r\n  , currency_id\r\n  , amount\r\n  , exchange_rate\r\n  , user_id\r\n  , branch_id\r\n  , is_closed\r\n  , is_cross)\r\n    SELECT\r\n      13 AS type,\r\n      bills.date AS trans_date,\r\n      bills.id,\r\n      bills.date AS event_date,\r\n      bills.date AS doc_date,\r\n      20 AS currency_id,\r\n      0 AS amount,\r\n      1 AS exchange_rate,\r\n      1 as accounting_user_id,\r\n      accounting_branch_id,\r\n      0 AS is_closed,\r\n      1 AS is_cross\r\n    FROM bills\r\n      INNER JOIN branches\r\n        ON bills.branch_id = branches.id\r\n    WHERE bills.date >= '2019-01-01'\r\n    AND bills.id NOT IN (SELECT\r\n        reference\r\n      FROM journal\r\n      WHERE type_id = 13);\r\n\r\ndelete from gl_trans where type_id = 13;\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      13 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      users.gl_account_id AS gl_account_id,\r\n      bills.total AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM journal\r\n      INNER JOIN bills\r\n        ON bills.date >= '2019-01-01'\r\n        AND journal.reference = bills.id\r\n        AND journal.type_id = 13\r\n      INNER JOIN users\r\n        ON bills.delegate_id = users.id;  \r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      13 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      system_config.value,\r\n      (-1) * (bills.total - bills.tax_value) AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills\r\n             ON bills.date >= '2019-01-01'\r\n             AND journal.reference = bills.id\r\n             AND journal.type_id = 13\r\n    WHERE system_config.key = 'sales_account_id'\r\n    GROUP BY journal.id,\r\n             bills.amount,\r\n             bills.date,\r\n             bills.total,\r\n             bills.tax_value;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      13 AS typ,\r\n      journal.id AS id,\r\n      bills.date AS date,\r\n      system_config.value,\r\n      -1 * bills.tax_value AS cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         journal\r\n           INNER JOIN bills\r\n             ON bills.date >= '2019-01-01'\r\n             AND journal.reference = bills.id\r\n             AND journal.type_id = 13\r\n    WHERE system_config.key = 'value_added_account_id'\r\n    GROUP BY journal.id,\r\n             bills.tax_value,\r\n             bills.date;\r\n\r\n  \r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id) \r\n  SELECT 13 AS typ, journal.id AS id, vgeneralcost.date AS date,\r\n   stores.gl_account_id AS gl_account_id, vgeneralcost.cost, 0 AS dimension_id, 0 AS dimension2_id, journal.branch_id \r\n   FROM vgeneralcost \r\n   INNER JOIN stores on\r\n   vgeneralcost.store_id = stores.id \r\n   INNER JOIN journal ON vgeneralcost.link_id = journal.reference \r\n   AND journal.type_id = 13 \r\n   GROUP BY vgeneralcost.link_id, vgeneralcost.date, vgeneralcost.store_id, stores.gl_account_id, journal.id;\r\n\r\n\r\n  INSERT INTO gl_trans (type_id, type_no, trans_date, account_id, amount, dimension_id, dimension2_id, branch_id)\r\n    SELECT\r\n      13 AS typ,\r\n      journal.id AS id,\r\n      vgeneralcost.date AS date,\r\n      system_config.value,\r\n      -1 * vgeneralcost.cost,\r\n      0 AS dimension_id,\r\n      0 AS dimension2_id,\r\n      journal.branch_id\r\n    FROM system_config,\r\n         vgeneralcost\r\n           INNER JOIN stores\r\n             ON vgeneralcost.store_id = stores.id\r\n           INNER JOIN journal\r\n             ON vgeneralcost.link_id = journal.reference\r\n             AND journal.type_id = 13\r\n    WHERE  system_config.key = 'sales_cost_account'\r\n    GROUP BY vgeneralcost.link_id,\r\n             vgeneralcost.date,\r\n             vgeneralcost.store_id,\r\n             stores.gl_account_id,\r\n             journal.id;\r\n    \r\n\r\n  UPDATE journal AS t1, (SELECT\r\n      type_no,\r\n      type_id,\r\n      SUM(amount) AS amount\r\n    FROM gl_trans\r\n    WHERE amount > 0\r\n    GROUP BY type_no,\r\n             type_id) AS t2\r\n  SET t1.amount = t2.amount\r\n  WHERE t1.id = t2.type_no\r\n  AND t1.type_id = t2.type_id\r\n  AND t1.type_id IN (12, 10, 13,20, 16);\r\n\r\n  UPDATE purchases AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 10;\r\n\r\nUPDATE bills AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 13;\r\n\r\nUPDATE transfers AS t1, (SELECT * FROM journal) AS t2 SET t1.gl_journal_transaction_id = t2.id WHERE t1.id = t2.reference AND t2.type_id = 12;\r\n\r\n\r\n\r\n\r\n\r\n\r\nupdate `journal` set `monthly_sequence` = MONTH(`trans_date`)\r\n\r\nSELECT\r\n*\r\n    FROM gl_trans t2 inner join journal t1 \r\n  on t1.id = t2.type_no\r\n  AND t1.type_id = t2.type_id\r\n  AND t1.type_id IN (12, 10, 13, 16) and t1.id = 4323;\r\n\r\n\r\n\r\nSELECT `type_id`,`type_no`,sum(`amount`) FROM `gl_trans` group by `type_id`,`type_no` having sum(`amount`) <> 0 ORDER BY `sum(``amount``)` DESC",
    "tables": [
      "sizes",
      "purchases_details",
      "general_table",
      "patches",
      "journal",
      "gl_trans",
      "branches",
      "stores",
      "purchases",
      "system_config",
      "suppliers",
      "accounting",
      "payment_methods",
      "users",
      "store_inventory",
      "bills",
      "vgeneralcost",
      "transfers"
    ],
    "missing_tables": [
      "vgeneralcost"
    ],
    "existing_tables": [
      "sizes",
      "purchases_details",
      "general_table",
      "patches",
      "journal",
      "gl_trans",
      "branches",
      "stores",
      "purchases",
      "system_config",
      "suppliers",
      "accounting",
      "payment_methods",
      "users",
      "store_inventory",
      "bills",
      "transfers"
    ],
    "database_compatibility": "YELLOW",
    "compatibility_reason_ar": "السكربت متوافق جزئياً. الجداول المفقودة في الهيكل الحالي: (vgeneralcost). يحتاج مراجعة قبل الاستخدام.",
    "compatibility_reason_en": "Partially compatible. Missing tables in current schema: (vgeneralcost). Requires review.",
    "validated_against": "newdatabase2026.sql",
    "validated_at": "2026-08-15T20:26:10.839Z",
    "backup_required": true,
    "rollback_notes_ar": "يعتمد على جداول مؤرشفة قديمة _2021 غير موجودة في الهيكل الموحد الحديث.",
    "rollback_notes_en": "References legacy partitioned 2021 tables.",
    "playbook_steps_ar": [
      "التحقق من وجود جداول الأرشيف القديمة _2021 قبل محاولة التشغيل.",
      "فحص البيانات المراد معالجتها وأخذ نسخة احتياطية."
    ],
    "version": "1.0",
    "views_count": 0,
    "copies_count": 0,
    "created_at": "2026-08-15T00:00:00.000Z",
    "updated_at": "2026-08-15T00:00:00.000Z"
  }
];
if (typeof module !== 'undefined') module.exports = SCRIPTS_BANK_DATA;
