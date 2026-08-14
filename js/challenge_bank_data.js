/**
 * js/challenge_bank_data.js
 * 📚 Complete Multi-Pool Question Bank with 100% Full Bilingual Arabic & English
 * Every question contains dedicated:
 * - question_ar / question_en
 * - options: text_ar / text_en
 * - explanation_ar / explanation_en
 * - hints_ar / hints_en (3 distinct tiers: Concept -> Hint -> Direct Lead)
 * - distractors_ar / distractors_en (Specific reasoning for every distractor)
 * - reference: title_ar / title_en / source_ar / source_en
 */

const CHALLENGE_BANK_DATA = (function () {

  const QUESTIONS_DATA = {
    // =========================================================================
    // 1. INVENTORY (المخزون) - 20 Distinct High-Yield Questions
    // =========================================================================
    'MOD-1': [
      {
        id: 'Q-INV-001',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-VAL',
        topic_id: 'TOP-FIFO',
        concept_id: 'CON-FIFO-VAL',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question_en: 'Under FIFO inventory valuation, if 100 units are purchased at $10 and 100 units at $12, then 150 units are issued to production: What is the resulting COGS and ending inventory value?',
        question_ar: 'عند شراء 100 وحدة بسعر 10 ريال ثم 100 وحدة بسعر 12 ريال، ثم صرف 150 وحدة للإنتاج بنظام FIFO: ما هي تكلفة البضاعة المباعة (COGS) وقيمة المخزون المتبقي؟',
        options: [
          { id: 'A', text_en: 'COGS: $1,600 | Ending Inventory: $600', text_ar: 'COGS: 1,600 ريال | المخزون المتبقي: 600 ريال' },
          { id: 'B', text_en: 'COGS: $1,500 | Ending Inventory: $700', text_ar: 'COGS: 1,500 ريال | المخزون المتبقي: 700 ريال' },
          { id: 'C', text_en: 'COGS: $1,650 | Ending Inventory: $550', text_ar: 'COGS: 1,650 ريال | المخزون المتبقي: 550 ريال' },
          { id: 'D', text_en: 'COGS: $1,700 | Ending Inventory: $500', text_ar: 'COGS: 1,700 ريال | المخزون المتبقي: 500 ريال' }
        ],
        correct_answer: 'A',
        explanation_en: 'Under FIFO, older units are depleted first: (100 units * $10 = $1,000) + (50 units * $12 = $600) = $1,600 COGS. Ending inventory comprises the remaining 50 units * $12 = $600.',
        explanation_ar: 'في نظام الوارد أولاً يصرف أولاً (FIFO)، يتم استنفاد الدفعة الأولى الأقدم: (100 وحدة × 10 ريال = 1,000 ريال) ثم استكمال 50 وحدة من الدفعة الثانية (50 وحدة × 12 ريال = 600 ريال) ليكون إجمالي تكلفة البضاعة المباعة 1,600 ريال. ويتبقى في المخزون 50 وحدة بسعر 12 ريال بقيمة 600 ريال.',
        distractors_ar: {
          'B': 'خطأ: يفترض حساب متوسط بسيط للأسعار بدلاً من تتبع طابور FIFO.',
          'C': 'خطأ حسابي في توزيع تكلفة الوحدات المنصرفة والمتبقية.',
          'D': 'خطأ: يمثل تقييم الوارد أخيراً يصرف أولاً (LIFO) المحظور في المعايير الدولية.'
        },
        distractors_en: {
          'B': 'Incorrect: Assumes simple average pricing rather than FIFO queue.',
          'C': 'Incorrect: Arithmetic error in unit cost allocation.',
          'D': 'Incorrect: Represents LIFO valuation which is prohibited under IFRS.'
        },
        hints_ar: [
          'تذكر قاعدة الوارد أولاً يصرف أولاً: أصناف الشراء الأقدم تُصرف للإنتاج بالبداية.',
          'احسب أول 100 وحدة من الشحنة الأولى بسعر 10 ريال (1,000 ريال).',
          'مفتاح الحل: أضف الـ 50 وحدة المتبقية من الشحنة الثانية بسعر 12 ريال (600 ريال)، ليصبح الإجمالي 1,600 ريال.'
        ],
        hints_en: [
          'Remember FIFO principle: oldest purchased units are issued first.',
          'Calculate the first 100 units from the initial batch at $10 ($1,000).',
          'Direct Key: Add the remaining 50 units from the second batch at $12 ($600), total COGS = $1,600.'
        ],
        reference: {
          title_ar: 'معيار المحاسبة الدولي IAS 2 - تقييم المخزون وصيغ التكلفة',
          title_en: 'IAS 2 - Inventories Standard & Cost Formulas',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/',
          source_ar: 'المعايير الدولية لإعداد التقارير المالية IFRS',
          source_en: 'IFRS Official Standards'
        }
      },
      {
        id: 'Q-INV-002',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-OPS',
        topic_id: 'TOP-TRANSIT',
        concept_id: 'CON-INTER-WH',
        question_type: 'Troubleshooting',
        difficulty: 'Advanced',
        question_en: 'An internal transfer between Riyadh and Jeddah warehouses was dispatched, but inventory is not showing in Jeddah after 3 days. What is the root cause and standard ERP remedy?',
        question_ar: 'تم إنشاء أمر تحويل مخزني بين مستودع الرياض ومستودع جدة، وتم تأكيد الشحن ولكن البضاعة لم تظهر في رصيد مستودع جدة لمدة 3 أيام. ما هو السبب الأكثر ترجيحاً وكيف تعالجه؟',
        options: [
          { id: 'A', text_en: 'The stock is in the Inter-warehouse Transit Location awaiting Goods Receipt validation at Jeddah.', text_ar: 'البضاعة ما زالت في موقع العبور (Transit Location) بانتظار تأكيد استلام مستودع جدة.' },
          { id: 'B', text_en: 'The stock was automatically written off due to dispatch timeout.', text_ar: 'تم شطب البضاعة تلقائياً بسبب انتهاء مهلة الشحن.' },
          { id: 'C', text_en: 'The ERP deleted the inventory journal entry due to negative stock.', text_ar: 'النظام حذف القيد المخزني بسبب نقص الكميات.' },
          { id: 'D', text_en: 'The transfer must be canceled and converted into an inter-company sales invoice.', text_ar: 'يجب إلغاء أمر الشحن وإعادة إصدار فاتورة مبيعات جديدة.' }
        ],
        correct_answer: 'A',
        explanation_en: 'In two-step warehouse transfers, goods stay in the intermediate Transit location until the receiving warehouse validates the inbound Goods Receipt.',
        explanation_ar: 'في التحويلات المخزنية ذات الخطوتين (Two-Step Transfer)، تخرج البضاعة من مستودع المصدر وتستقر في موقع عبور وسيط (Transit Location) حتى يقوم أمين مستودع الوجهة بتأكيد الفحص وإذن الاستلام المخزني.',
        distractors_ar: {
          'B': 'خطأ: أنظمة الـ ERP لا تشطب البضائع في الطريق بشكل تلقائي.',
          'C': 'خطأ: القيود المخزنية المرحلة لا تُحذف تلقائياً في سجلات التدقيق.',
          'D': 'خطأ: التحويل الداخلي بين مستودعات نفس المنشأة لا يتطلب فاتورة مبيعات.'
        },
        distractors_en: {
          'B': 'Incorrect: ERPs never automatically write off stock in transit.',
          'C': 'Incorrect: Posted stock moves cannot be deleted.',
          'D': 'Incorrect: Internal transfers within the same company do not require sales invoices.'
        },
        hints_ar: [
          'تذكر دورة التحويلات المخزنية ثنائية الخطوات (Two-Step).',
          'أين تستقر البضاعة محاسبياً ولوجستياً وهي على متن الشاحنة بالطريق؟',
          'مفتاح الحل: البضاعة في موقع العبور (Transit) بانتظار اعتماد إذن الاستلام في جدة.'
        ],
        hints_en: [
          'Consider two-step transfer workflows.',
          'Where does stock sit while on the truck?',
          'Direct Key: Stock is sitting in Transit location awaiting inbound Goods Receipt validation.'
        ],
        reference: {
          title_ar: 'دليل إدارة المستودعات والتحويلات ومواقع العبور الوسيطة',
          title_en: 'Odoo Inventory - Internal Transfers & Transit Locations',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/transfers.html',
          source_ar: 'توثيق Odoo وممارسات الـ ERP العالمية',
          source_en: 'Odoo Official Documentation'
        }
      },
      {
        id: 'Q-INV-003',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-REORDER',
        topic_id: 'TOP-MINMAX',
        concept_id: 'CON-REORDER-RULE',
        question_type: 'Process Decision',
        difficulty: 'Intermediate',
        question_en: 'A product has Min Stock = 20, Max Stock = 100, and current On Hand = 12. If Reordering Rule runs, what Purchase Order quantity will the ERP generate?',
        question_ar: 'صنف لديه حد أدنى = 20، وحد أقصى = 100، والرصيد الفعلي الحالي = 12. عند تشغيل قاعدة إعادة الطلب التلقائية، كم تكون كمية أمر الشراء المقترحة؟',
        options: [
          { id: 'A', text_en: '88 units (100 - 12)', text_ar: '88 وحدة (100 - 12)' },
          { id: 'B', text_en: '8 units (20 - 12)', text_ar: '8 وحدات (20 - 12)' },
          { id: 'C', text_en: '100 units', text_ar: '100 وحدة' },
          { id: 'D', text_en: '20 units', text_ar: '20 وحدة' }
        ],
        correct_answer: 'A',
        explanation_en: 'When on-hand inventory drops below the Minimum threshold (12 < 20), the ERP automatically orders up to the Maximum level: 100 - 12 = 88 units.',
        explanation_ar: 'عندما ينخفض الرصيد الفعلي (12) عن نقطة إعادة الطلب الدنيا (20)، يقوم النظام آلياً بتوليد أمر شراء بالكمية التي تعيد الرصيد إلى الحد الأقصى المستهدف: 100 - 12 = 88 وحدة.',
        distractors_ar: {
          'B': 'خطأ: الشراء للحد الأدنى فقط يسبب تكرار انخفاض المخزون فورياً.',
          'C': 'خطأ: يتجاهل الرصيد المتوفر الحالي ويؤدي لزيادة تكدس المخزون.',
          'D': 'خطأ: يطلب معامل الحد الأدنى بدلاً من فرق الكمية المطلوبة.'
        },
        distractors_en: {
          'B': 'Incorrect: Only reaches the minimum threshold, causing immediate stockouts.',
          'C': 'Incorrect: Ignores existing on-hand stock and over-orders.',
          'D': 'Incorrect: Orders the minimum parameter instead of the replenishment delta.'
        },
        hints_ar: [
          'الحد الأدنى (Min) هو زر الإطلاق، والحد الأقصى (Max) هو الهدف المطلوب الوصول إليه.',
          'اطرح الرصيد الفعلي الحالي من الحد الأقصى المستهدف.',
          'مفتاح الحل: 100 - 12 = 88 وحدة.'
        ],
        hints_en: [
          'Min triggers the reorder; Max dictates the target replenishment stock.',
          'Calculate target stock minus current stock.',
          'Direct Key: 100 - 12 = 88 units.'
        ],
        reference: {
          title_ar: 'تخطيط نقاط إعادة الطلب وإدارة المستويات في SAP',
          title_en: 'SAP Inventory Management - Reorder Point Planning',
          url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/inventory-management',
          source_ar: 'توثيق SAP S/4HANA Supply Chain',
          source_en: 'SAP Documentation'
        }
      },
      {
        id: 'Q-INV-004',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-LOT',
        topic_id: 'TOP-FEFO',
        concept_id: 'CON-EXPIRY',
        question_type: 'Scenario',
        difficulty: 'Advanced',
        question_en: 'In a pharmaceutical ERP, warehouse has Lot A (Expiry: Dec 2026) and Lot B (Expiry: Aug 2026). Which lot must the ERP pick for delivery under FEFO?',
        question_ar: 'في نظام ERP للأدوية، يتوفر في المستودع تشغيلة (Lot A) تنتهي في ديسمبر 2026، وتشغيلة (Lot B) تنتهي في أغسطس 2026. أي تشغيلة يختارها النظام آلياً وفق سياسة FEFO؟',
        options: [
          { id: 'A', text_en: 'Lot B (First Expired, First Out)', text_ar: 'تشغيلة Lot B (الأقرب انتهاءً تخرج أولاً FEFO)' },
          { id: 'B', text_en: 'Lot A', text_ar: 'تشغيلة Lot A' },
          { id: 'C', text_en: 'Random selection between Lot A and B', text_ar: 'اختيار عشوائي' },
          { id: 'D', text_en: 'The lot with lower purchase cost', text_ar: 'التشغيلة الأقل تكلفة شراء' }
        ],
        correct_answer: 'A',
        explanation_en: 'FEFO (First Expired, First Out) strictly picks the batch with the earliest expiration date (Aug 2026) to eliminate perishable inventory waste.',
        explanation_ar: 'سياسة FEFO (الأقرب انتهاءً يخرج أولاً) تلزم النظام بصرف التشغيلة ذات تاريخ الصلاحية الأقرب (أغسطس 2026) لتفادي تلف المخزون الدوائي والغذائي وتكبّد خسائر الهالك.',
        distractors_ar: {
          'B': 'خطأ: التشغيلة A تنتهي في موعد لاحق (ديسمبر 2026) وترك التشغيلة B سيعرضها للتلف.',
          'C': 'خطأ: الصرف العشوائي مخالف للوائح هيئات الغذاء والدواء ومعايير GxP.',
          'D': 'خطأ: تاريخ الصلاحية يتقدم كلياً على فروق تكلفة الشراء في المواد سريعة التلف.'
        },
        distractors_en: {
          'B': 'Incorrect: Lot A has a later expiry date.',
          'C': 'Incorrect: Random picking violates regulated pharma GxP standards.',
          'D': 'Incorrect: Expiration date takes strict priority over purchase cost.'
        },
        hints_ar: [
          'تذكر معنى FEFO: First Expired, First Out (الأقرب انتهاءً يصرف أولاً).',
          'قارن بين أغسطس 2026 وديسمبر 2026.',
          'مفتاح الحل: أغسطس يسبق ديسمبر، إذن تشغيلة Lot B تُصرف أولاً.'
        ],
        hints_en: [
          'FEFO stands for First Expired, First Out.',
          'Compare expiry dates: Aug 2026 vs Dec 2026.',
          'Direct Key: August comes before December, so Lot B is selected.'
        ],
        reference: {
          title_ar: 'الممارسات الجيدة للتخزين والتوزيع الدوائي وسياسات FEFO',
          title_en: 'FDA Good Warehouse Practices & FEFO Stock Rotation',
          url: 'https://www.fda.gov/drugs',
          source_ar: 'معايير هيئات الدواء والرقابة الصحية',
          source_en: 'FDA Regulatory Standards'
        }
      },
      {
        id: 'Q-INV-005',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-COUNT',
        topic_id: 'TOP-CYCLE',
        concept_id: 'CON-ABC-COUNT',
        question_type: 'Implementation Decision',
        difficulty: 'Intermediate',
        question_en: 'Why do high-volume enterprises prefer ABC Cycle Counting over annual physical warehouse shutdown inventory counts?',
        question_ar: 'لماذا تفضل المنشآت الكبرى تطبيق الجرد الدوري المستمر (ABC Cycle Counting) بدلاً من الإغلاق السنوي الكامل للجرد؟',
        options: [
          { id: 'A', text_en: 'Allows continuous count without business disruption and focuses frequency on high-value Category A items.', text_ar: 'يتيح استمرار العمليات دون إيقاف المبيعات، ويركز تكرار الفحص على الأصناف عالية القيمة (فئة A).' },
          { id: 'B', text_en: 'Eliminates the need for inventory adjustment journal entries.', text_ar: 'يلغي الحاجة لقيود تسوية الفروقات المخزنية.' },
          { id: 'C', text_en: 'Requires only 1 warehouse employee to count the entire facility in one day.', text_ar: 'يتيح لموظف واحد جرد المستودع بالكامل في يوم واحد.' },
          { id: 'D', text_en: 'Allows negative inventory levels permanently.', text_ar: 'يسمح بظهور أرصدة سالبة بشكل دائم.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Cycle counting categorizes items by Pareto ABC value, checking fast-moving and high-value items frequently without halting plant operations.',
        explanation_ar: 'الجرد الدوري المستمر يوزع مهام العد على مدار العام وفق تحليل باريتو (ABC)، فيتم جرد الأصناف الحساسة والعالية القيمة شهرياً دون الحاجة لإيقاف عمليات البيع والتسليم وشل حركة الشركة.',
        distractors_ar: {
          'B': 'خطأ: قيود التسوية تظل واجبة عند اكتشاف أي فروقات بين الفعلي والدفتري.',
          'C': 'خطأ: الجرد المستمر عمل مؤسسي منتظم يتم وفق جداول وليس في يوم واحد.',
          'D': 'خطأ: الأرصدة السالبة خلل رقابي لا يجوز السماح به.'
        },
        distractors_en: {
          'B': 'Incorrect: Adjustments are still recorded for variances.',
          'C': 'Incorrect: Cycle counting is structured across the entire year.',
          'D': 'Incorrect: Negative inventory is an operational flaw.'
        },
        hints_ar: [
          'ركز على استمرارية الأعمال وقاعدة باريتو (80/20).',
          'الأصناف فئة A تمثل القيمة المالية الكبرى وتتطلب رقابة مستمرة.',
          'مفتاح الحل: العد المستمر يمنع تعطيل المبيعات ويركز على الأصناف الحساسة.'
        ],
        hints_en: [
          'Focus on operational continuity and Pareto analysis.',
          'High value Category A items need frequent checking.',
          'Direct Key: Cycle counting prevents shutdown while prioritizing high-value inventory.'
        ],
        reference: {
          title_ar: 'معايير الجمعية الأمريكية لسلاسل الإمداد ASCM في الرقابة المخزنية',
          title_en: 'APICS / ASCM Inventory Control Best Practices',
          url: 'https://www.ascm.org/',
          source_ar: 'المعهد الدولي لسلاسل الإمداد ASCM/APICS',
          source_en: 'ASCM Standards'
        }
      },
      {
        id: 'Q-INV-006',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-COST',
        topic_id: 'TOP-LANDED',
        concept_id: 'CON-LANDED-COST',
        question_type: 'Accounting Impact',
        difficulty: 'Advanced',
        question_en: 'A company imports 1,000 units of Product X ($10 each) and incurs $2,000 customs + $1,000 international freight. What is the landed unit cost in ERP?',
        question_ar: 'استوردت شركة 1,000 وحدة من الصنف (X) بسعر 10 دولار للوحدة، وتكبدت 2,000 دولار جمارك + 1,000 دولار شحن بحري. ما هي التكلفة الحقيقية للوحدة بعد توزيع التكاليف الإضافية (Landed Cost)؟',
        options: [
          { id: 'A', text_en: '$13.00 per unit ($10 + $2 + $1)', text_ar: '13.00 دولار للوحدة (10 + 2 + 1)' },
          { id: 'B', text_en: '$10.00 per unit (freight is expensed immediately)', text_ar: '10.00 دولار (تحميل الشحن كمصروف فوري)' },
          { id: 'C', text_en: '$12.00 per unit', text_ar: '12.00 دولار' },
          { id: 'D', text_en: '$15.00 per unit', text_ar: '15.00 دولار' }
        ],
        correct_answer: 'A',
        explanation_en: 'Landed Costs capitalize all direct costs necessary to bring goods to their current location: ($10,000 purchase + $2,000 customs + $1,000 freight) / 1,000 units = $13.00/unit.',
        explanation_ar: 'وفق معيار IAS 2، تُرسمل كافة التكاليف المباشرة اللازمة لوصول المخزون لحالته وموقعه الحالي: (10,000 شراء + 2,000 جمارك + 1,000 شحن) = 13,000 دولار / 1,000 وحدة = 13.00 دولار للوحدة.',
        distractors_ar: {
          'B': 'خطأ: معايير المحاسبة تلزم برسملة الجمارك والشحن ضمن قيمة المخزون وليس كمصروف فوري.',
          'C': 'خطأ: أسقط تكلفة الشحن البحري من التقييم.',
          'D': 'خطأ حسابي في نسبة التوزيع.'
        },
        distractors_en: {
          'B': 'Incorrect: Under IAS 2, import duties and freight must be capitalized into inventory.',
          'C': 'Incorrect: Omits freight cost from valuation.',
          'D': 'Incorrect: Over-allocates overhead.'
        },
        hints_ar: [
          'اجمع تكلفة الشراء الأساسية + الجمارك + الشحن البحري.',
          'إجمالي التكاليف = 10,000 + 2,000 + 1,000 = 13,000 دولار.',
          'مفتاح الحل: اقسم 13,000 على 1,000 وحدة = 13.00 دولار للوحدة.'
        ],
        hints_en: [
          'Add purchase total + customs + freight.',
          'Total cost = $10,000 + $2,000 + $1,000 = $13,000.',
          'Direct Key: Divide $13,000 by 1,000 units = $13.00 per unit.'
        ],
        reference: {
          title_ar: 'معيار IAS 2 - تكلفة الشراء ورسملة المصاريف المباشرة Landed Cost',
          title_en: 'IAS 2 - Costs of Purchase & Landed Valuation',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/',
          source_ar: 'معايير المحاسبة الدولية IFRS',
          source_en: 'IFRS Standards'
        }
      },
      {
        id: 'Q-INV-007',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-ROUTES',
        topic_id: 'TOP-DROPSHIP',
        concept_id: 'CON-DROPSHIP',
        question_type: 'Business Analysis',
        difficulty: 'Intermediate',
        question_en: 'In a Dropshipping route configuration, which ERP transaction is bypassed completely?',
        question_ar: 'في دورة المبيعات بنظام الشحن المباشر (Dropshipping)، ما هي العملية المخزنية التي يتم تخطيها بالكامل؟',
        options: [
          { id: 'A', text_en: 'Physical warehouse receipt and internal picking at company warehouse.', text_ar: 'استلام البضاعة وتخزينها وصرفها فعلياً داخل مستودعات الشركة.' },
          { id: 'B', text_en: 'Vendor Purchase Order creation.', text_ar: 'إنشاء أمر شراء المورد.' },
          { id: 'C', text_en: 'Customer Invoicing.', text_ar: 'إصدار فاتورة العميل.' },
          { id: 'D', text_en: 'Accounts Payable payment to supplier.', text_ar: 'سداد مستحقات المورد.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Dropshipping delivers goods directly from the external supplier to the customer, bypassing internal warehouse storage while maintaining financial invoicing.',
        explanation_ar: 'في نظام الدروب شيبينغ (الشحن المباشر)، يسلّم المورد البضاعة للعميل النهائي مباشرة، مما يلغي دورة التخزين والاستلام والصرف الفيزيائي بالمستودع، مع بقاء فواتير الشراء والبيع في النظام المالي.',
        distractors_ar: {
          'B': 'خطأ: أمر الشراء إلزامي لتوجيه المورد بالشحن وإثبات الالتزام المالي.',
          'C': 'خطأ: فاتورة العميل تصدر لتحصيل الإيرادات والأرباح.',
          'D': 'خطأ: يجب سداد مستحقات المورد الخارجي وفق شروط الدفع.'
        },
        distractors_en: {
          'B': 'Incorrect: Vendor PO is required to trigger supplier shipment.',
          'C': 'Incorrect: Customer invoice is still generated.',
          'D': 'Incorrect: Vendor must still be paid.'
        },
        hints_ar: [
          'المورد يشحن الصناديق مباشرة من مصنعه إلى باب العميل.',
          'هل تدخل الشاحنة مستودع شركتك أصلاً؟',
          'مفتاح الحل: لا يوجد استلام وتخزين فيزيائي داخل مستودعات الشركة.'
        ],
        hints_en: [
          'Vendor delivers straight to client.',
          'Physical inventory does not enter your warehouse.',
          'Direct Key: Physical warehouse receiving and picking are bypassed.'
        ],
        reference: {
          title_ar: 'مسارات سلاسل الإمداد والشحن المباشر Dropshipping في أنظمة الـ ERP',
          title_en: 'ERP Supply Chain Routes & Dropshipping Flows',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/shipping_receiving/advanced_routes_concepts/dropshipping.html',
          source_ar: 'دليل عمليات الـ ERP وسلاسل التوريد',
          source_en: 'Odoo Documentation'
        }
      },
      {
        id: 'Q-INV-008',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-NEG',
        topic_id: 'TOP-NEGSTOCK',
        concept_id: 'CON-NEG-PREVENT',
        question_type: 'Troubleshooting',
        difficulty: 'Advanced',
        question_en: 'Why is allowing Negative Inventory in ERP considered a dangerous practice that corrupts financial valuation?',
        question_ar: 'لماذا يعتبر السماح بالأرصدة المخزنية السالبة (Negative Inventory) ممارسة خطرة تفسد حسابات التكاليف والقوائم المالية؟',
        options: [
          { id: 'A', text_en: 'Sales COGS is calculated against estimated or zero costs, causing major retroactive adjustments upon vendor bill entry.', text_ar: 'يتم احتساب تكلفة المبيعات بتكلفة صفرية أو تقديرية مما يسبب تشوهات وفروقات جسيمة عند إدخال فواتير الشراء لاحقاً.' },
          { id: 'B', text_en: 'It crashes the database server immediately.', text_ar: 'يؤدي لتوقف خادم قاعدة البيانات فورياً.' },
          { id: 'C', text_en: 'It prevents creating any new customer master records.', text_ar: 'يمنع إنشاء عملاء جدد.' },
          { id: 'D', text_en: 'It doubles the sales tax automatically.', text_ar: 'يضاعف ضريبة القيمة المضافة.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Issuing stock before recording the receipt forces the ERP to calculate COGS with undefined unit costs, resulting in massive costing distortions.',
        explanation_ar: 'صرف بضاعة غير مسجلة دفترياً يجبر النظام على حساب تكلفة المبيعات (COGS) بتكلفة صفرية أو تقريبية، وعند إدخال فاتورة الشراء لاحقاً تتولد قيود تسوية بأثر رجعي تشوه أرباح الفترات المالية.',
        distractors_ar: {
          'B': 'خطأ: قاعدة البيانات لا تتوقف ولكن دقة البيانات المالية تتدمر.',
          'C': 'خطأ: بطاقات العملاء لا علاقة لها بحركة المخزون السالب.',
          'D': 'خطأ: ضريبة القيمة المضافة تحتسب على قيمة البيع وليس أرصدة الكميات.'
        },
        distractors_en: {
          'B': 'Incorrect: Database does not crash, but financial integrity is lost.',
          'C': 'Incorrect: Customer records are unrelated.',
          'D': 'Incorrect: VAT rules are unaffected.'
        },
        hints_ar: [
          'كيف يحسب النظام تكلفة الصنف المباع إذا كان رصيد الشراء غير مسجل أصلاً؟',
          'حساب تكلفة المبيعات (COGS) ينهار بدون تكلفة شراء حقيقية.',
          'مفتاح الحل: احتساب COGS بتكلفة خاطئة يسبب انحرافات حادة في الأرباح.'
        ],
        hints_en: [
          'How does ERP determine unit cost if receipt was never entered?',
          'COGS calculation fails without cost foundation.',
          'Direct Key: Zero or estimated COGS distorts gross profit and ledger integrity.'
        ],
        reference: {
          title_ar: 'الرقابة المحاسبية ومنع الأرصدة السالبة في Microsoft Dynamics',
          title_en: 'ERP Financial Integrity & Negative Inventory Controls',
          url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/inventory/',
          source_ar: 'أفضل ممارسات إدارة المخزون في Dynamics 365',
          source_en: 'Microsoft Dynamics 365'
        }
      },
      {
        id: 'Q-INV-009',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-COST',
        topic_id: 'TOP-AVCO',
        concept_id: 'CON-AVCO-MATH',
        question_type: 'Multiple Choice',
        difficulty: 'Intermediate',
        question_en: 'A warehouse has 50 units at $20 ($1,000 total). A new purchase of 50 units at $30 is received. What is the new Moving Average (AVCO) unit cost?',
        question_ar: 'مستودع يحتوي على 50 وحدة بسعر 20 ريال (إجمالي 1,000 ريال). تم استلام شحنة جديدة 50 وحدة بسعر 30 ريال. ما هو متوسط التكلفة المرجح الجديد (AVCO)؟',
        options: [
          { id: 'A', text_en: '$25.00 per unit (($1,000 + $1,500) / 100)', text_ar: '25.00 ريال للوحدة ((1,000 + 1,500) / 100)' },
          { id: 'B', text_en: '$30.00 per unit', text_ar: '30.00 ريال' },
          { id: 'C', text_en: '$20.00 per unit', text_ar: '20.00 ريال' },
          { id: 'D', text_en: '$27.50 per unit', text_ar: '27.50 ريال' }
        ],
        correct_answer: 'A',
        explanation_en: 'AVCO formula = Total Value / Total Quantity = ($1,000 + $1,500) / 100 units = $2,500 / 100 = $25.00 per unit.',
        explanation_ar: 'قانون المتوسط المتحرك المرجح (AVCO) = إجمالي القيمة / إجمالي الكمية = (1,000 + 1,500) / (50 + 50) = 2,500 ريال / 100 وحدة = 25.00 ريال للوحدة.',
        distractors_ar: {
          'B': 'خطأ: يمثل سعر الشراء الجديد فقط متجاهلاً الرصيد القديم.',
          'C': 'خطأ: يتجاهل تكلفة الشحنة الجديدة المرتفعة.',
          'D': 'خطأ حسابي في احتساب الأوزان النسبية.'
        },
        distractors_en: {
          'B': 'Incorrect: Only represents the new receipt price.',
          'C': 'Incorrect: Ignores the higher cost of new incoming stock.',
          'D': 'Incorrect: Mathematical weighting error.'
        },
        hints_ar: [
          'قانون المتوسط المرجح: إجمالي القيمة الإجمالية مقسوماً على إجمالي عدد الوحدات.',
          'القيمة الإجمالية = 1,000 + 1,500 = 2,500 ريال.',
          'مفتاح الحل: اقسم 2,500 على 100 وحدة = 25.00 ريال.'
        ],
        hints_en: [
          'Total Value divided by Total Quantity.',
          '$1,000 + $1,500 = $2,500 total.',
          'Direct Key: Divide $2,500 by 100 units = $25.00.'
        ],
        reference: {
          title_ar: 'معيار IAS 2 - معادلة المتوسط المرجح لتكلفة المخزون',
          title_en: 'IAS 2 - Weighted Average Cost Formula',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/',
          source_ar: 'معايير إعداد التقارير المالية الدولية',
          source_en: 'IFRS Standards'
        }
      },
      {
        id: 'Q-INV-010',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-SCRAP',
        topic_id: 'TOP-SCRAP',
        concept_id: 'CON-SCRAP-ENTRY',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question_en: 'When inventory scrap/loss of $500 is confirmed in the ERP, what is the automated journal entry created?',
        question_ar: 'عند اعتماد إذن تالف/فاقد مخزني (Scrap) بقيمة 500 ريال في النظام، ما هو القيد المحاسبي الآلي المتولد؟',
        options: [
          { id: 'A', text_en: 'Debit: Inventory Scrap Expense $500 | Credit: Inventory Asset Account $500', text_ar: 'مدين: حـ/ خسائر وهالك المخزون 500 ريال | دائن: حـ/ المخزون 500 ريال' },
          { id: 'B', text_en: 'Debit: Inventory Asset $500 | Credit: Cash $500', text_ar: 'مدين: حـ/ المخزون | دائن: حـ/ النقدية' },
          { id: 'C', text_en: 'Debit: Sales Revenue $500 | Credit: Inventory $500', text_ar: 'مدين: حـ/ المبيعات | دائن: حـ/ المخزون' },
          { id: 'D', text_en: 'Debit: Accounts Payable $500 | Credit: Scrap Expense $500', text_ar: 'مدين: حـ/ الموردين | دائن: هالك المخزون' }
        ],
        correct_answer: 'A',
        explanation_en: 'Scrap removes the asset from the balance sheet (Crediting Inventory) and recognizes an operational loss (Debiting Inventory Loss/Scrap Expense).',
        explanation_ar: 'إذن الهالك يخفض أصل المخزون في الميزانية العمومية بجعله دائناً، ويثبت خسارة تشغيلية بجعل حساب هالك المخزون (P&L) مديناً.',
        distractors_ar: {
          'B': 'خطأ: هذا القيد يمثل عملية شراء وسداد نقدي.',
          'C': 'خطأ: إيرادات المبيعات لا تُجعل مدينة عند تلف البضائع.',
          'D': 'خطأ: حساب الموردين لا يتأثر إلا في حال قبول المورد لمطالبة تعويض.'
        },
        distractors_en: {
          'B': 'Incorrect: This represents an inventory purchase.',
          'C': 'Incorrect: Sales revenue is not debited on scrap.',
          'D': 'Incorrect: Vendor is not credited unless a claim is accepted.'
        },
        hints_ar: [
          'رصيد المخزون ينقص (دائن)، ومصروف الخسارة التشغيلية يزيد (مدين).',
          'اجعل حساب الأصل دائناً لإخراجه من الميزانية.',
          'مفتاح الحل: مدين خسائر وهالك المخزون، دائن أصل المخزون.'
        ],
        hints_en: [
          'Inventory balance decreases (credit), expense increases (debit).',
          'Credit the asset account to remove it from balance sheet.',
          'Direct Key: Debit Scrap Expense, Credit Inventory Asset.'
        ],
        reference: {
          title_ar: 'المعالجة المحاسبية لهالك وفواقد المخزون في SAP S/4HANA',
          title_en: 'ERP Inventory Scrap & Loss Accounting Entries',
          url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/inventory-management',
          source_ar: 'توثيق SAP المالي والتشغيلي',
          source_en: 'SAP S/4HANA Finance'
        }
      },

      // ── SET 2: Advanced Supply Chain, WMS & NRV (Questions 11 to 20) ──
      {
        id: 'Q-INV-011',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-VMI',
        topic_id: 'TOP-CONSIGNMENT',
        concept_id: 'CON-VMI-OWNERSHIP',
        question_type: 'Accounting Impact',
        difficulty: 'Advanced',
        question_en: 'In Vendor-Managed Inventory (Consignment Stock), goods are physically stored in your warehouse. When is the financial liability and inventory asset recognized in your General Ledger?',
        question_ar: 'في نظام بضاعة الأمانة (Consignment Stock / VMI)، البضاعة موجودة في مستودع شركتك ولكنها مملوكة للمورد. متى يتم إنشاء القيد المحاسبي لإثبات المديونية ودخول الأصل في دفاترك؟',
        options: [
          { id: 'A', text_en: 'Only when the consignment goods are consumed in production or sold to a customer.', text_ar: 'فقط عند سحب واستهلاك البضاعة للإنتاج أو بيعها للعميل النهائي.' },
          { id: 'B', text_en: 'Upon initial truck arrival and unloading at warehouse dock.', text_ar: 'فور وصول الشاحنة وتفريغ الصناديق على رصيف المستودع.' },
          { id: 'C', text_en: 'When the supplier signs the framework consignment contract.', text_ar: 'عند توقيع عقد التوريد بالأمانة.' },
          { id: 'D', text_en: 'At the end of the calendar year regardless of usage.', text_ar: 'في نهاية السنة المالية بغض النظر عن الاستخدام.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Consignment inventory remains off-balance sheet until control/risk transfers upon consumption. At consumption, ERP generates: Debit Inventory/COGS, Credit Accounts Payable to Consignor.',
        explanation_ar: 'وفق معايير IFRS 15 و IAS 2، تظل بضاعة الأمانة خارج الميزانية العمومية لأن مخاطر وملكية الأصل ما زالت بيد المورد. وعند قيامك بسحب الصنف واستهلاكه أو بيعه فعلياً، يقوم النظام آلياً بإنشاء القيد المحاسبي: مدين المخزون/تكلفة المبيعات، دائن حـ/ الموردين.',
        distractors_ar: {
          'B': 'خطأ: الاستلام الفيزيائي دون انتقال الملكية والمخاطر لا يُنشئ التزاماً مالياً بالأستاذ العام.',
          'C': 'خطأ: توقيع العقود الإطارية ليس حدثاً محاسبياً يترتب عليه قيد مالي.',
          'D': 'خطأ: البضاعة غير المستهلكة تظل ملكاً للمورد ولا تُرسمل تعسفياً نهاية العام.'
        },
        distractors_en: {
          'B': 'Incorrect: Physical receipt without ownership transfer does not trigger GL liability.',
          'C': 'Incorrect: Contract signing is not an accounting transaction.',
          'D': 'Incorrect: Unconsumed stock is never capitalized arbitrarily.'
        },
        hints_ar: [
          'من يتحمل مخاطر الملكية والتلف طالما البضاعة مخزنة ولم تُسحب بعد؟',
          'الالتزام المحاسبي المالي ينشأ فقط لحظة انتقال السيطرة والاستهلاك.',
          'مفتاح الحل: البضاعة خارج الميزانية حتى يتم استهلاكها في الإنتاج أو بيعها.'
        ],
        hints_en: [
          'Who bears the ownership risk while the stock sits untouched on your shelf?',
          'Financial liability occurs strictly upon control transfer at consumption.',
          'Direct Key: Stays off-balance sheet until consumed in production or sold.'
        ],
        reference: {
          title_ar: 'المعالجة المحاسبية لبضاعة الأمانة وفق معايير IFRS 15 و IAS 2',
          title_en: 'IFRS 15 & IAS 2 - Consignment Inventory Accounting Treatment',
          url: 'https://www.ifrs.org/',
          source_ar: 'المعايير الدولية لإعداد التقارير المالية IFRS',
          source_en: 'IFRS Accounting Standards'
        }
      },
      {
        id: 'Q-INV-012',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-NRV',
        topic_id: 'TOP-SLOWMOVING',
        concept_id: 'CON-NRV-WRITEDOWN',
        question_type: 'Accounting Impact',
        difficulty: 'Expert',
        question_en: 'Under IAS 2 (Lower of Cost and Net Realizable Value), an inventory item with historical cost of $50,000 has an estimated selling price of $42,000 and estimated disposal costs of $2,000. What is the required write-down journal amount?',
        question_ar: 'وفق معيار المحاسبة الدولي (IAS 2 - التكلفة أو صافي القيمة البيعية NRV أيهما أقل)، صنف مخزني تكلفته التاريخية 50,000 ريال، وسعر بيعه التقديري الحالي 42,000 ريال، وتكاليف تجهيز بيعه 2,000 ريال. ما هو مبلغ قيد هبوط المخزون الواجب إثباته؟',
        options: [
          { id: 'A', text_en: '$10,000 write-down ($50,000 cost - $40,000 NRV)', text_ar: '10,000 ريال (التكلفة 50,000 - صافي القيمة البيعية 40,000)' },
          { id: 'B', text_en: '$8,000 write-down ($50,000 - $42,000)', text_ar: '8,000 ريال (إهمال مصاريف البيع)' },
          { id: 'C', text_en: '$2,000 write-down (only selling cost)', text_ar: '2,000 ريال (مصاريف البيع فقط)' },
          { id: 'D', text_en: 'No write-down required until physical sale occurs', text_ar: 'لا يتم إثبات أي هبوط إلا بعد البيع الفعلي' }
        ],
        correct_answer: 'A',
        explanation_en: 'NRV = Estimated Selling Price ($42,000) - Costs to Sell ($2,000) = $40,000. Since NRV ($40,000) is below Cost ($50,000), a write-down of $10,000 is recognized in P&L: Debit Inventory Valuation Loss $10,000, Credit Allowance for Inventory NRV $10,000.',
        explanation_ar: 'صافي القيمة البيعية (NRV) = سعر البيع التقديري (42,000) - مصاريف إتمام البيع (2,000) = 40,000 ريال. بما أن صافي القيمة البيعية (40,000) أقل من التكلفة الدفترية (50,000)، يثبت النظام قيد هبوط بقيمة 10,000 ريال: مدين حـ/ خسائر هبوط المخزون (قائمة الدخل)، دائن حـ/ مخصص هبوط المخزون (الميزانية).',
        distractors_ar: {
          'B': 'خطأ: أسقط خصم مصاريف تجهيز البيع (2,000 ريال) من معادلة NRV.',
          'C': 'خطأ: احتسب مصاريف البيع فقط دون مقارنة القيمة الإجمالية مع التكلفة.',
          'D': 'خطأ: معيار IAS 2 يلزم بإثبات مخصص الهبوط فورياً في تاريخ إعداد القوائم المالية.'
        },
        distractors_en: {
          'B': 'Incorrect: Forgot to deduct the $2,000 estimated costs to sell from NRV.',
          'C': 'Incorrect: Only considered the selling cost without comparing to market drop.',
          'D': 'Incorrect: IAS 2 mandates immediate lower-of-cost-and-NRV recognition at reporting date.'
        },
        hints_ar: [
          'احسب صافي القيمة البيعية (NRV) أولاً: سعر البيع ناقص مصاريف البيع.',
          'صافي القيمة البيعية = 42,000 - 2,000 = 40,000 ريال.',
          'مفتاح الحل: قارن التكلفة (50,000) مع صافي القيمة (40,000) = فارق هبوط 10,000 ريال.'
        ],
        hints_en: [
          'Calculate NRV first: Estimated selling price minus estimated costs to sell.',
          'NRV = 42,000 - 2,000 = 40,000.',
          'Direct Key: Compare 50,000 cost with 40,000 NRV = $10,000 write-down.'
        ],
        reference: {
          title_ar: 'معيار IAS 2 - قياس المخزون بالتكلفة أو صافي القيمة البيعية أيهما أقل',
          title_en: 'IAS 2 - Measurement of Inventories at Lower of Cost and NRV',
          url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/',
          source_ar: 'معايير المحاسبة الدولية',
          source_en: 'IFRS Standards'
        }
      },
      {
        id: 'Q-INV-013',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-WMS',
        topic_id: 'TOP-PUTAWAY',
        concept_id: 'CON-BIN-ROUTING',
        question_type: 'Process Decision',
        difficulty: 'Advanced',
        question_en: 'How does an automated WMS Putaway Strategy rule optimize warehouse operations upon inbound Goods Receipt?',
        question_ar: 'كيف تساهم استراتيجيات التخزين الآلي (Putaway Strategies & Rules) في تحسين كفاءة المستودع فور تأكيد استلام الشحنة؟',
        options: [
          { id: 'A', text_en: 'Directs forklift operators to the exact optimal Bin/Rack location based on product volume, weight, turnover velocity, and temperature zones.', text_ar: 'توجه عامل الرافعة تلقائياً إلى الرف والموقع (Bin) الأمثل وفق أبعاد الصنف، وزنه، سرعة دورانه، ومنطقة التبريد.' },
          { id: 'B', text_en: 'Automatically deletes old invoices from the system.', text_ar: 'تقوم بحذف فواتير الشراء القديمة تلقائياً.' },
          { id: 'C', text_en: 'Forces all products to be placed in the entrance corridor.', text_ar: 'تجبر العمال على وضع كافة المنتجات عند بوابة المدخل فقط.' },
          { id: 'D', text_en: 'Eliminates the requirement for product barcode labels.', text_ar: 'تلغي الحاجة لباركود الأصناف.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Putaway rules match product master attributes (e.g. hazardous, refrigerated, heavy, fast-moving) to pre-defined storage locations to minimize travel distance and ensure safety compliance.',
        explanation_ar: 'قواعد التوجيه المخزني (Putaway) تربط خصائص الصنف (مثل الوزن، الحجم، درجة التبريد، وسرعة الحركة) بمواقع الرفوف المناسبة لتقليل مسافات انتقال الرافعات وتفادي الازدحام وتحقيق معايير السلامة.',
        distractors_ar: {
          'B': 'خطأ: قواعد الـ WMS التشغيلية لا علاقة لها بحذف الفواتير المالية.',
          'C': 'خطأ: تكديس البضائع في الممرات يسبب حوادث مهنية ويعطل مسارات العمل.',
          'D': 'خطأ: قراءة الباركود أساسية لتأكيد وصول الرافعة للرف الصحيح.'
        },
        distractors_en: {
          'B': 'Incorrect: WMS rules have zero impact on financial invoice lifecycle.',
          'C': 'Incorrect: Corridor dumping creates severe safety and operational bottlenecks.',
          'D': 'Incorrect: Barcode scanning is fundamental to verifying correct bin destination.'
        },
        hints_ar: [
          'فكر في توزيع الأصناف: الأصناف السريعة بالقرب من الشحن، والثقيلة على الأرضيات.',
          'النظام يوجه السائق آلياً للموقع المثالي المحدد مسبقاً للصنف.',
          'مفتاح الحل: توجيه المشغل إلى الرف الأمثل وفق الوزن وسرعة الدوران والحرارة.'
        ],
        hints_en: [
          'Think of bin location optimization based on product characteristics.',
          'Fast-moving items go near dispatch; heavy items go on ground racks.',
          'Direct Key: Automated routing to the optimal bin based on velocity and physical attributes.'
        ],
        reference: {
          title_ar: 'دليل تخطيط المستودعات وقواعد التخزين الآلي Putaway في Odoo WMS',
          title_en: 'WMS Warehouse Layout & Putaway Strategies',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/advanced_warehouses_management/putaway.html',
          source_ar: 'توثيق Odoo WMS المتقدم',
          source_en: 'Odoo WMS Documentation'
        }
      },
      {
        id: 'Q-INV-014',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-RMA',
        topic_id: 'TOP-REVERSE-LOG',
        concept_id: 'CON-RMA-WORKFLOW',
        question_type: 'Troubleshooting',
        difficulty: 'Intermediate',
        question_en: 'When a customer returns a defective product under an authorized RMA (Return Merchandise Authorization), what is the correct ERP quarantine workflow before issuing a credit note?',
        question_ar: 'عند استلام مرتجع بضاعة معيبة من عميل بموجب ترخيص إرجاع (RMA)، ما هو المسار المخزني والرقابي السليم قبل إصدار الإشعار الدائن (Credit Note)؟',
        options: [
          { id: 'A', text_en: 'Receive item into Quality Inspection / Quarantine location for inspection, then route to either Scrap, Vendor Return, or Refurbished stock.', text_ar: 'استلام الصنف في موقع حجر الفحص الفني (Quality / Quarantine)، ثم توجيهه إما للهالك أو الإرجاع للمورد أو إعادة التأهيل.' },
          { id: 'B', text_en: 'Immediately place defective item on active sales shelf for other customers.', text_ar: 'وضع الصنف المعيب مباشرة على رفوف البيع الفوري لعميل آخر.' },
          { id: 'C', text_en: 'Delete the customer account to cancel the return.', text_ar: 'حذف حساب العميل لمنع تسجيل المرتجع.' },
          { id: 'D', text_en: 'Change the sales price to zero.', text_ar: 'تعديل سعر البيع إلى صفر.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Returned goods must enter a non-sellable Quarantine location first to undergo technical QA testing. Mixing uninspected returns with saleable stock causes repeat customer defects.',
        explanation_ar: 'البضائع المرتجعة يجب أن تدخل موقع الحجر الفني غير القابل للبيع (Quarantine) لفحصها والتأكد من العيب قبل اتخاذ قرار شطبها أو إعادتها للمورد أو إعادة تصليحها، لمنع اختلاط المعيب بالمخزون الصالح للبيع.',
        distractors_ar: {
          'B': 'خطأ: بيع منتج معيب لعميل آخر يدمر سمعة المنشأة ويخالف معايير الجودة.',
          'C': 'خطأ: حذف حساب العميل مستحيل برمجياً في سجلات التدقيق.',
          'D': 'خطأ: تصفير السعر تحايل محاسبي يلغي دورة الإشعار الدائن الرسمية.'
        },
        distractors_en: {
          'B': 'Incorrect: Selling uninspected defective goods damages reputation and violates quality SLAs.',
          'C': 'Incorrect: Customer accounts cannot be deleted to hide returns.',
          'D': 'Incorrect: Price modification bypasses standard RMA debit/credit reversal.'
        },
        hints_ar: [
          'يجب حجر البضاعة المعيبة وفحصها فنياً قبل أي تسوية مالية.',
          'لا تخلط أبداً بين البضائع المعيبة المرتجعة والمخزون الجاهز للبيع.',
          'مفتاح الحل: الاستلام في موقع الفحص (Quarantine) ثم توجيهه للهالك أو المورد.'
        ],
        hints_en: [
          'Goods must be quarantined and inspected before restocked or credited.',
          'Never mix defective returns with fresh saleable inventory.',
          'Direct Key: Receive into Quarantine for QA testing before dispositioning.'
        ],
        reference: {
          title_ar: 'اللوجستيات العكسية وحجر الجودة الفني في SAP Supply Chain',
          title_en: 'Reverse Logistics & Quality Quarantine in Enterprise ERP',
          url: 'https://help.sap.com/',
          source_ar: 'دليل عمليات اللوجستيات في SAP',
          source_en: 'SAP Supply Chain Logistics'
        }
      },
      {
        id: 'Q-INV-015',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-BOM',
        topic_id: 'TOP-PHANTOM-BOM',
        concept_id: 'CON-PHANTOM-EXPLODE',
        question_type: 'Implementation Decision',
        difficulty: 'Advanced',
        question_en: 'In ERP Manufacturing & Inventory, what is the purpose of configuring a sub-assembly Bill of Materials (BOM) as "Phantom"?',
        question_ar: 'في موديول التصنيع والمخزون، ما هو الغرض من تعريف شجرة منتج فرعي (Sub-Assembly BOM) كـ "شجرة وهمية (Phantom BOM)"؟',
        options: [
          { id: 'A', text_en: 'It groups components for engineering purposes without generating a separate manufacturing order or intermediate stocking step during production.', text_ar: 'تجميع المكونات لأغراض هندسية دون توليد أمر إنتاج منفصل أو تخزين وسيط، بل تُصرف مكوناتها المباشرة فورياً مع المنتج النهائي.' },
          { id: 'B', text_en: 'It hides production costs from the general ledger.', text_ar: 'إخفاء تكاليف الإنتاج عن الأستاذ العام.' },
          { id: 'C', text_en: 'It prevents issuing materials from warehouse.', text_ar: 'منع صرف المواد من المستودع.' },
          { id: 'D', text_en: 'It permanently disables standard costing.', text_ar: 'إلغاء التكاليف المعيارية نهائياً.' }
        ],
        correct_answer: 'A',
        explanation_en: 'A Phantom BOM is a transient sub-assembly that is never stocked. When the parent MO is confirmed, the ERP "explodes" through the phantom directly to its raw material children.',
        explanation_ar: 'شجرة المنتج الوهمية (Phantom BOM) تُستخدم لتجميع القطع هندسياً وتصميمياً فقط، لكنها لا تُخزن ولا يُنشأ لها أمر تصنيع مستقل؛ بل تنفجر شجرتها آلياً في أمر تصنيع المنتج النهائي لتُصرف مكوناتها الخام فورياً.',
        distractors_ar: {
          'B': 'خطأ: التكاليف المحاسبية تُجمع بدقة من المكونات الأولية دون إخفاء.',
          'C': 'خطأ: المواد تُصرف وتُسحب فعلياً من المستودع على أمر التشغيل الرئيسي.',
          'D': 'خطأ: التكاليف المعيارية تدعم الـ Phantom BOM وتعمل بكفاءة.'
        },
        distractors_en: {
          'B': 'Incorrect: Financial costing accurately rolls up raw component costs.',
          'C': 'Incorrect: Components are actively picked and issued on the parent order.',
          'D': 'Incorrect: Standard costing operates transparently through phantom levels.'
        },
        hints_ar: [
          'التجميعات الوهمية (Phantom) موجودة منطقياً في التصميم لكن لا يتم تخزينها فيزيائياً.',
          'أمر الإنتاج ينفجر مباشرة ليصل إلى المواد الخام الأولية.',
          'مفتاح الحل: تجميع المكونات دون أمر إنتاج فرعي أو تخزين وسيط.'
        ],
        hints_en: [
          'Phantom sub-assemblies exist logically for design but are not stocked physically.',
          'Parent production order explodes directly to raw components.',
          'Direct Key: Component grouping without separate manufacturing order or intermediate stocking.'
        ],
        reference: {
          title_ar: 'أنواع شجرة المنتج والتجميعات الوهمية Phantom في أنظمة MRP/ERP',
          title_en: 'BOM Types & Phantom Assemblies in ERP/MRP',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/manufacturing/management/kit_shipping.html',
          source_ar: 'دليل التصنيع وإدارة المواد',
          source_en: 'Odoo Manufacturing Guide'
        }
      },
      {
        id: 'Q-INV-016',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-BARCODE',
        topic_id: 'TOP-GS1-BARCODE',
        concept_id: 'CON-BARCODE-PARSE',
        question_type: 'Process Decision',
        difficulty: 'Intermediate',
        question_en: 'What critical operational efficiency is achieved by scanning GS1-128 / GS1 DataMatrix barcodes with Application Identifiers (AI) in ERP warehouse mobile scanners?',
        question_ar: 'ما هي الفائدة التشغيلية الرئيسية لقراءة باركودات المعايير الدولية (GS1-128 / DataMatrix) عبر أجهزة الجرد والماسحات اللاسلكية في الـ ERP؟',
        options: [
          { id: 'A', text_en: 'A single scan automatically parses Item Code, Lot Number, Expiry Date, and Quantity into the ERP in one step without manual data entry.', text_ar: 'قراءة كود الصنف، رقم التشغيلة (Lot)، تاريخ الانتهاء، والكمية في مسحة ضوئية واحدة وتعبئتها آلياً دون كتابة يدوية.' },
          { id: 'B', text_en: 'It increases purchase order approval limits automatically.', text_ar: 'رفع سقف صلاحيات أوامر الشراء تلقائياً.' },
          { id: 'C', text_en: 'It converts foreign currency payments.', text_ar: 'تحويل العملات الأجنبية.' },
          { id: 'D', text_en: 'It prints shipping invoices in 5 languages.', text_ar: 'طباعة الفواتير بخمس لغات.' }
        ],
        correct_answer: 'A',
        explanation_en: 'GS1 Application Identifiers (e.g. (01) GTIN, (10) Lot, (17) Expiry Date, (30) Qty) allow handheld ERP barcode scanners to populate complex traceability fields simultaneously with zero human typing error.',
        explanation_ar: 'معرفات التطبيقات الدولية (GS1 Application Identifiers) تدمج كود الصنف العالمي ورقم التشغيلة وتاريخ الصلاحية والكمية في باركود واحد؛ فتقوم ماسحة الـ ERP بتوزيعها في الحقول المناسبة بمسحة واحدة دون أي خطأ إدخال بشري.',
        distractors_ar: {
          'B': 'خطأ: الصلاحيات المالية تخضع لجدول الصلاحيات (RBAC) وليس لبروتوكول الباركود.',
          'C': 'خطأ: تحويل العملات عملية محاسبية لا علاقة لها بالماسح الضوئي.',
          'D': 'خطأ: وظيفة الماسح قراءة وتغذية البيانات وليس تصميم قوالب الطباعة.'
        },
        distractors_en: {
          'B': 'Incorrect: Approval hierarchies are governed by RBAC, not barcode protocols.',
          'C': 'Incorrect: Currency revaluation is unrelated to physical scanning.',
          'D': 'Incorrect: Barcode scanners capture input, they do not manage multi-lingual reporting.'
        },
        hints_ar: [
          'باركود GS1 يجمع عدة بيانات في رمز واحد: الصنف + التشغيلة + تاريخ الانتهاء.',
          'يلغي الحاجة للكتابة اليدوية لأرقام التشغيلات والتواريخ على الشاشات المحمولة.',
          'مفتاح الحل: قراءة كود الصنف والتشغيلة وتاريخ الانتهاء والكمية في مسحة واحدة.'
        ],
        hints_en: [
          'GS1 barcodes embed multiple data points: GTIN + Lot + Expiry in one symbol.',
          'Eliminates manual keyboard entry on mobile devices.',
          'Direct Key: Parses item code, lot, expiry date and quantity in a single scan.'
        ],
        reference: {
          title_ar: 'معايير باركود GS1-128 في إدارة سلاسل الإمداد والمستودعات',
          title_en: 'GS1-128 Barcode Standard in Supply Chain Management',
          url: 'https://www.gs1.org/standards/barcodes',
          source_ar: 'منظمة المعايير الدولية GS1',
          source_en: 'GS1 International Standards'
        }
      },
      {
        id: 'Q-INV-017',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-VARIANCE',
        topic_id: 'TOP-PPV',
        concept_id: 'CON-PPV-JOURNAL',
        question_type: 'Accounting Impact',
        difficulty: 'Advanced',
        question_en: 'Under Standard Costing, a company standard cost for Material Z is $50/unit. A purchase of 100 units is invoiced by the supplier at $55/unit. What is the Purchase Price Variance (PPV) journal entry?',
        question_ar: 'في نظام التكاليف المعيارية (Standard Costing)، التكلفة المعيارية للصنف (Z) هي 50 ريال/وحدة. تم شراء وفلترة 100 وحدة من المورد بسعر 55 ريال/وحدة. ما هو قيد فروق أسعار الشراء (PPV) المتولد في النظام؟',
        options: [
          { id: 'A', text_en: 'Debit: Inventory Asset $5,000 | Debit: Purchase Price Variance (PPV Expense) $500 | Credit: Accounts Payable $5,500', text_ar: 'مدين: حـ/ المخزون 5,000 ريال | مدين: حـ/ فروق أسعار الشراء (انحراف مدين غير ملائم) 500 ريال | دائن: حـ/ الموردين 5,500 ريال' },
          { id: 'B', text_en: 'Debit: Inventory Asset $5,500 | Credit: Accounts Payable $5,500 (no PPV recorded)', text_ar: 'مدين: المخزون 5,500 | دائن: الموردين 5,500 (بدون إثبات انحراف)' },
          { id: 'C', text_en: 'Debit: Cash $500 | Credit: PPV $500', text_ar: 'مدين: النقدية | دائن: الفروقات' },
          { id: 'D', text_en: 'Debit: Sales Revenue $5,500 | Credit: Inventory $5,500', text_ar: 'مدين: المبيعات | دائن: المخزون' }
        ],
        correct_answer: 'A',
        explanation_en: 'Under Standard Costing, Inventory Asset is debited strictly at standard ($50 * 100 = $5,000). The $5/unit unfavorable variance ($500) hits the PPV variance account in P&L, and Vendor is credited for the actual invoice total ($5,500).',
        explanation_ar: 'في التكاليف المعيارية يدخل المخزون بسعره المعياري الثابت (100 × 50 = 5,000 ريال)، ويثبت استحقاق المورد الفعلي كاملاً (5,500 ريال)، ويُحمل فارق السعر غير الملائم (500 ريال) كحساب انحراف أسعار شراء مدين (PPV) في قائمة الدخل.',
        distractors_ar: {
          'B': 'خطأ: هذا القيد يمثل نظام المتوسط المتحرك وليس نظام التكاليف المعيارية.',
          'C': 'خطأ: حساب النقدية لا يتأثر عند ترحيل فواتير الاستحقاق الآجلة.',
          'D': 'خطأ: إيرادات المبيعات لا تُجعل مدينة عند شراء المخزون من الموردين.'
        },
        distractors_en: {
          'B': 'Incorrect: Represents Moving Average valuation, not Standard Costing.',
          'C': 'Incorrect: Cash is not touched during voucher accrual validation.',
          'D': 'Incorrect: Sales revenue is not debited during vendor inventory purchasing.'
        },
        hints_ar: [
          'المخزون يُسجل بالتكلفة المعيارية (100 × 50 = 5,000 ريال).',
          'المورد يستحق القيمة الفعلية للفاتورة (100 × 55 = 5,500 ريال).',
          'مفتاح الحل: فارق الـ 500 ريال يوازن القيد كحساب انحراف أسعار شراء (PPV) مدين.'
        ],
        hints_en: [
          'Inventory is debited at standard cost (100 * $50 = $5,000).',
          'Vendor is credited at actual invoice price (100 * $55 = $5,500).',
          'Direct Key: Variance of $500 balances the entry as an unfavorable debit expense.'
        ],
        reference: {
          title_ar: 'محاسبة التكاليف المعيارية وانحرافات أسعار الشراء PPV في SAP Controlling',
          title_en: 'Standard Costing & Purchase Price Variance (PPV) Accounting',
          url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/controlling',
          source_ar: 'دليل محاسبة التكاليف في SAP S/4HANA',
          source_en: 'SAP Controlling & Cost Accounting'
        }
      },
      {
        id: 'Q-INV-018',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-PICK',
        topic_id: 'TOP-PICK-METHODS',
        concept_id: 'CON-WAVE-BATCH-PICK',
        question_type: 'Scenario',
        difficulty: 'Intermediate',
        question_en: 'An e-commerce distribution warehouse receives 500 orders containing identical single items. Which picking methodology in WMS minimizes picker walking distance?',
        question_ar: 'مستودع تجارة إلكترونية استلم 500 طلب بيع تحتوي جميعها على نفس الصنف الفردي. أي استراتيجية صرف (Picking Strategy) في نظام الـ WMS تقلل مسافة حركة العمال إلى أدنى حد ممكن؟',
        options: [
          { id: 'A', text_en: 'Batch / Wave Picking (collecting all 500 units in a single bulk trip from the storage bin, then sorting at packing stations).', text_ar: 'الصرف التجميعي بالموجات (Batch / Wave Picking) بسحب الـ 500 وحدة دفعة واحدة في رحلة واحدة ثم فرزها على محطة التعبئة.' },
          { id: 'B', text_en: 'Discrete Single-Order Picking (making 500 individual round trips to the bin).', text_ar: 'الصرف الفردي المنفصل بعمل 500 مشوار ذهاب وإياب لنفس الرف.' },
          { id: 'C', text_en: 'Manual random picking without a list.', text_ar: 'الالتقاط العشوائي بدون قوائم صرف.' },
          { id: 'D', text_en: 'Waiting for annual physical count.', text_ar: 'الانتظار حتى موعد الجرد السنوي.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Batch picking consolidates identical items across multiple sales orders into one consolidated picking route, drastically reducing warehouse travel time by up to 80%.',
        explanation_ar: 'الصرف بالمجموعات والموجات (Batch / Wave Picking) يدمج بنود الطلبات المتشابهة في مسار واحد، فيقوم العامل بسحب الـ 500 وحدة دفعة واحدة من موقع الرف برحلة واحدة فقط، ثم يتم فرزها وتغليفها بمحطة الشحن.',
        distractors_ar: {
          'B': 'خطأ: الصرف المنفصل يجبر العامل على الذهاب والإياب 500 مرة لنفس الموقع ويهدر الوقت.',
          'C': 'خطأ: الصرف العشوائي يتسبب بنسب خطأ مرتفعة وانعدام الرقابة.',
          'D': 'خطأ: الجرد السنوي لا علاقة له بتجهيز طلبات العملاء اليومية.'
        },
        distractors_en: {
          'B': 'Incorrect: Discrete picking creates 500 redundant trips to the exact same rack location.',
          'C': 'Incorrect: Random picking results in high error rates and zero auditability.',
          'D': 'Incorrect: Physical inventory counts do not fulfill customer delivery orders.'
        },
        hints_ar: [
          'اجمع الكمية في مشوار واحد ثم افرزها على طاولة التغليف.',
          'قارن بين رحلة واحدة مجمعة مقابل 500 مشوار فردي مكرر.',
          'مفتاح الحل: الصرف التجميعي (Batch/Wave Picking) يقلل مسافة الحركة بنسبة 80%.'
        ],
        hints_en: [
          'Pick once in bulk, sort at packing station.',
          'Compare 1 consolidated trip vs 500 individual trips.',
          'Direct Key: Batch/Wave picking slashes warehouse travel distance.'
        ],
        reference: {
          title_ar: 'استراتيجيات الصرف بالموجات والمجموعات في Odoo WMS',
          title_en: 'WMS Warehouse Picking Strategies: Batch vs Wave vs Zone',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/shipping_receiving/picking_methods.html',
          source_ar: 'دليل إدارة المستودعات المتطورة',
          source_en: 'Odoo WMS Guide'
        }
      },
      {
        id: 'Q-INV-019',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-3PL',
        topic_id: 'TOP-3PL-INTEG',
        concept_id: 'CON-3PL-SYNC',
        question_type: 'Troubleshooting',
        difficulty: 'Advanced',
        question_en: 'An enterprise integrates its ERP with an external 3PL warehouse via EDI / API. Daily synchronization shows stock discrepancies between the ERP virtual location and the 3PL system. What is the root cause diagnosis?',
        question_ar: 'شركة تربط نظام الـ ERP مع مستودع لوجستي خارجي (3PL) عبر الـ API، وظهرت فروقات يومية بين الأرصدة في الـ ERP ونظام الـ 3PL. ما هو الإجراء التشخيصي الأول؟',
        options: [
          { id: 'A', text_en: 'Inspect the API middleware integration payload error logs for failed Inbound ASNs (Advanced Shipping Notices) and unconfirmed Goods Delivery receipts.', text_ar: 'فحص سجلات أخطاء واجهة الـ API (Error Logs) للبحث عن إشعارات الشحن المسبقة (ASN) وأذونات الصرف المعلقة التي لم تُؤكد.' },
          { id: 'B', text_en: 'Manually delete all ERP stock balances without investigating.', text_ar: 'حذف أرصدة الـ ERP يدوياً بدون فحص.' },
          { id: 'C', text_en: 'Disconnect the internet permanently.', text_ar: 'قطع الإنترنت نهائياً.' },
          { id: 'D', text_en: 'Change the chart of accounts.', text_ar: 'تعديل شجرة الحسابات.' }
        ],
        correct_answer: 'A',
        explanation_en: 'Timing mismatches and dropped API payload webhooks (e.g. unconfirmed ASN receipts, unposted returns, or delayed goods issue callbacks) are the primary source of 3PL sync variances.',
        explanation_ar: 'فحص سجلات رسائل الـ API يكشف العمليات وإشعارات الشحن المسبقة (ASN) أو أذونات الصرف التي فشل وصولها أو تأكيدها بين النظامين، مما يسمح بإعادة معالجتها برمجياً ومطابقة الأرصدة بدقة.',
        distractors_ar: {
          'B': 'خطأ: حذف الأرصدة دفترياً يدمر مسار التدقيق الرقابي والمحاسبي.',
          'C': 'خطأ: قطع الاتصال يوقف العمليات اللوجستية بالكامل.',
          'D': 'خطأ: شجرة الحسابات لا علاقة لها بحزم بيانات الـ API والـ EDI.'
        },
        distractors_en: {
          'B': 'Incorrect: Blind balance deletion corrupts accounting audit trails.',
          'C': 'Incorrect: Disconnecting communications halts all logistics operations.',
          'D': 'Incorrect: Chart of accounts has no impact on EDI integration payloads.'
        },
        hints_ar: [
          'ابحث في سجلات أخطاء الـ API والويب هوك المعلق.',
          'فروقات الـ 3PL تنشأ من عدم تأكيد إشعارات الشحن (ASN) أو حركات الاستلام.',
          'مفتاح الحل: فحص سجلات أخطاء واجهة التكامل (API Logs).'
        ],
        hints_en: [
          'Check failed API webhooks and pending ASN documents.',
          'EDI / API integration error logs provide exact transaction mismatch root causes.',
          'Direct Key: Inspect API middleware integration error logs.'
        ],
        reference: {
          title_ar: 'أفضل ممارسات ربط المستودعات الخارجية 3PL ومعايير EDI في Dynamics 365',
          title_en: '3PL Logistics Integration Best Practices & EDI Standards',
          url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/',
          source_ar: 'دليل سلاسل الإمداد في Microsoft Dynamics',
          source_en: 'Microsoft Dynamics 365 Supply Chain'
        }
      },
      {
        id: 'Q-INV-020',
        module_id: 'MOD-1',
        category_id: 'CAT-INV-UOM',
        topic_id: 'TOP-UOM-CONV',
        concept_id: 'CON-UOM-PRECISION',
        question_type: 'Troubleshooting',
        difficulty: 'Advanced',
        question_en: 'A chemical raw material is purchased in Metric Tons (1 Ton = 1,000 Kg) but issued to production recipes in Grams. After 6 months, a rounding inventory variance of 14.5 Kg appears in ERP. How should this be resolved and prevented?',
        question_ar: 'مادة كيميائية تُشترى بالطن المتري (1 طن = 1,000 كجم) وتُصرف للخلطات التصنيعية بالجرام. بعد 6 أشهر ظهر فارق تقريب مقداره 14.5 كجم في رصيد المستودع. كيف يتم علاج وضبط هذه الحالة في النظام؟',
        options: [
          { id: 'A', text_en: 'Set the Reference Base Unit of Measure (UoM) to the smallest transaction unit (Gram) and increase decimal accuracy precision in UoM conversion configuration.', text_ar: 'ضبط وحدة القياس الأساسية (Base UoM) لتكون الوحدة الأصغر (الجرام) ورفع دقة المنازل العشرية (Decimal Precision) في جدول التحويلات.' },
          { id: 'B', text_en: 'Stop using chemical recipes.', text_ar: 'إلغاء استخدام معادلات التصنيع الكيميائي.' },
          { id: 'C', text_en: 'Allow negative stock without tracking.', text_ar: 'السماح بالأرصدة السالبة دون قيود.' },
          { id: 'D', text_en: 'Always round down every production order to zero.', text_ar: 'تقريب كافة أوامر الإنتاج إلى الصفر.' }
        ],
        correct_answer: 'A',
        explanation_en: 'In ERP architecture, defining the smallest consumed unit as the Base UoM and configuring high decimal precision (e.g. 5 decimals) eliminates compounding floating-point rounding errors during unit conversions.',
        explanation_ar: 'أفضل ممارسة معمارية في الـ ERP هي جعل وحدة القياس الأساسية المرجعية (Base UoM) هي الوحدة الأصغر استهلاكاً (الجرام)، وتفعيل دقة منازل عشرية مرتفعة (5 منازل) في نسب التحويل لمنع تراكم فروق التقريب الحسابية بمرور الوقت.',
        distractors_ar: {
          'B': 'خطأ: وصفات التصنيع متطلب تشغيلي أساسي للمصنع.',
          'C': 'خطأ: الأرصدة السالبة تزيد من تشوه التكاليف.',
          'D': 'خطأ: التقريب للصفر يدمر حسابات تكاليف أوامر الشغل.'
        },
        distractors_en: {
          'B': 'Incorrect: Manufacturing formulas are core business requirements.',
          'C': 'Incorrect: Negative stock compounds valuation distortions.',
          'D': 'Incorrect: Zero rounding ruins production batch cost accounting.'
        },
        hints_ar: [
          'يجب أن تكون وحدة القياس الأساسية دائماً هي أصغر وحدة يتم التعامل بها.',
          'ارفع دقة المنازل العشرية (Decimal Precision) في إعدادات وحدات القياس.',
          'مفتاح الحل: ضبط Base UoM بالجرام ورفع دقة المنازل العشرية.'
        ],
        hints_en: [
          'Base UoM should always be the lowest common denominator unit.',
          'Increase decimal rounding precision to 4 or 5 decimal places.',
          'Direct Key: Set Base UoM to smallest unit (Gram) and increase decimal precision.'
        ],
        reference: {
          title_ar: 'دليل إدارة وحدات القياس UoM ودقة المنازل العشرية في الـ ERP',
          title_en: 'Units of Measure (UoM) Conversion & Decimal Precision in ERP',
          url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/management/products/uom.html',
          source_ar: 'توثيق إدارة المنتجات والقياسات العالمية',
          source_en: 'Odoo Product UoM Standards'
        }
      }
    ]
  };

  /**
   * Universal Module Matcher: Resolves any dynamic UUID or slug to canonical key
   */
  function resolveModuleKey(moduleId) {
    const str = String(moduleId || '').toLowerCase().trim();
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    
    const modObj = modules.find(m => String(m.id).toLowerCase() === str || String(m.name_en).toLowerCase() === str || String(m.name_ar).toLowerCase() === str);
    let modIdx = modules.indexOf(modObj);

    if (modIdx === -1) {
      if (str.indexOf('inv') !== -1 || str.indexOf('مخزون') !== -1 || str.indexOf('e05842a37c') !== -1) modIdx = 0;
      else if (str.indexOf('acc') !== -1 || str.indexOf('حسابات') !== -1 || str.indexOf('24696b93e6') !== -1) modIdx = 1;
      else if (str.indexOf('maint') !== -1 || str.indexOf('صيانة') !== -1 || str.indexOf('5f64e5e611') !== -1) modIdx = 2;
      else if (str.indexOf('asset') !== -1 || str.indexOf('أصول') !== -1 || str.indexOf('3b75b88e6d') !== -1) modIdx = 3;
      else if (str.indexOf('trans') !== -1 || str.indexOf('نقليات') !== -1 || str.indexOf('423d4887a2') !== -1) modIdx = 4;
      else if (str.indexOf('hr') !== -1 || str.indexOf('بشرية') !== -1 || str.indexOf('295e659c72') !== -1) modIdx = 5;
      else if (str.indexOf('real') !== -1 || str.indexOf('عقار') !== -1 || str.indexOf('ea5d739d7e') !== -1) modIdx = 6;
      else if (str.indexOf('contract') !== -1 || str.indexOf('مقاول') !== -1 || str.indexOf('7b2c96fc4e') !== -1) modIdx = 7;
      else if (str.indexOf('fuel') !== -1 || str.indexOf('وقود') !== -1 || str.indexOf('0d359dd002') !== -1) modIdx = 8;
      else if (str.indexOf('law') !== -1 || str.indexOf('محام') !== -1 || str.indexOf('a7fdd513be') !== -1) modIdx = 9;
    }

    return `MOD-${(modIdx >= 0 ? modIdx + 1 : 1)}`;
  }

  /**
   * Retrieves 10 distinct questions for any module, rotating through distinct question pools!
   */
  function getQuestionsForModule(moduleId, isAr, poolIndex = 0) {
    const canonicalKey = resolveModuleKey(moduleId);
    
    if (QUESTIONS_DATA[canonicalKey]) {
      const allModQ = QUESTIONS_DATA[canonicalKey];
      const pageSize = 10;
      const start = (poolIndex * pageSize) % allModQ.length;
      let sliced = allModQ.slice(start, start + pageSize);
      if (sliced.length < pageSize && allModQ.length >= pageSize) {
        sliced = sliced.concat(allModQ.slice(0, pageSize - sliced.length));
      }
      return formatModuleQuestions(sliced, isAr, moduleId);
    }

    return generateCurated10Questions(moduleId, isAr, poolIndex);
  }

  function formatModuleQuestions(qList, isAr, requestedModuleId) {
    return qList.map(q => {
      // Pick Arabic vs English hints properly
      const hints = isAr ? (q.hints_ar || q.hints || []) : (q.hints_en || q.hints || []);
      // Pick Arabic vs English distractors properly
      const distractors = isAr ? (q.distractors_ar || q.distractors || {}) : (q.distractors_en || q.distractors || {});
      // Pick Arabic vs English reference properly
      const reference = {
        title: isAr ? (q.reference?.title_ar || q.reference?.title || '') : (q.reference?.title_en || q.reference?.title || ''),
        url: q.reference?.url || '',
        source: isAr ? (q.reference?.source_ar || q.reference?.source || '') : (q.reference?.source_en || q.reference?.source || '')
      };

      const rawOptions = (q.options || []).map(opt => ({
        id: opt.id,
        text: isAr ? (opt.text_ar || opt.text) : (opt.text_en || opt.text),
        _isCorrect: opt.id === q.correct_answer,
        _origId: opt.id
      }));

      // Fisher-Yates Random Shuffling of Options
      const shuffledOptions = [...rawOptions];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledOptions[i];
        shuffledOptions[i] = shuffledOptions[j];
        shuffledOptions[j] = temp;
      }

      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const newDistractors = {};
      let newCorrectLetter = 'A';

      const finalOptions = shuffledOptions.map((opt, idx) => {
        const newLetter = letters[idx];
        if (opt._isCorrect) {
          newCorrectLetter = newLetter;
        } else if (distractors[opt._origId]) {
          newDistractors[newLetter] = distractors[opt._origId];
        }
        return {
          id: newLetter,
          text: opt.text
        };
      });

      return {
        id: q.id,
        module_id: requestedModuleId || q.module_id,
        category_id: q.category_id,
        topic_id: q.topic_id,
        concept_id: q.concept_id,
        question_type: q.question_type,
        difficulty: q.difficulty,
        question: isAr ? (q.question_ar || q.question) : (q.question_en || q.question),
        options: finalOptions,
        correct_answer: newCorrectLetter,
        explanation: isAr ? (q.explanation_ar || q.explanation) : (q.explanation_en || q.explanation),
        distractors: newDistractors,
        hints: hints,
        reference: reference
      };
    });
  }

  function generateCurated10Questions(moduleId, isAr, poolIndex = 0) {
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const mod = modules.find(m => String(m.id) === String(moduleId)) || { name_en: moduleId, name_ar: moduleId };
    const modName = isAr ? (mod.name_ar || mod.name_en) : (mod.name_en || mod.name_ar);

    const questions = [
      {
        type: 'Accounting Impact',
        diff: 'Intermediate',
        q_en: `When posting an operational transaction in ${mod.name_en}, what is the automated General Ledger debit and credit impact?`,
        q_ar: `عند ترحيل مستند تشغيلي معتمد في موديول ${modName}، ما هو الأثر والقيد المحاسبي المزدوج المتولد آلياً؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Debit: Operating Expense / Asset Control Account | Credit: Accounts Payable / Clearing Account`, ar: `مدين: حـ/ المصروف التشغيلي أو الأصل المرتبط | دائن: حـ/ وسيط الاستحقاق أو الموردين` },
          { id: 'B', en: `Debit: Cash on Hand | Credit: Share Capital`, ar: `مدين: حـ/ النقدية بالصندوق | دائن: حـ/ رأس المال` },
          { id: 'C', en: `Debit: Sales Revenue | Credit: Depreciation Expense`, ar: `مدين: حـ/ إيراد المبيعات | دائن: حـ/ مجمع الإهلاك` },
          { id: 'D', en: `No journal entries are ever generated from this subledger`, ar: `لا تتولد أي قيود محاسبية من هذا الأستاذ المساعد إطلاقاً` }
        ],
        exp_en: `Operational subledgers in ERP map directly to general ledger control and clearing accounts to maintain continuous financial integration.`,
        exp_ar: `الأستاذ المساعد في الـ ERP يرتبط بحسابات مراقبة ووساطة بالأستاذ العام لترحيل الأثر المالي فورياً ودقيقاً.`,
        dist_ar: {
          'B': 'خطأ: العمليات التشغيلية الآجلة لا تمس رأس المال أو النقدية المباشرة.',
          'C': 'خطأ: إيرادات المبيعات لا ترتبط بقيود الإهلاك التشغيلي.',
          'D': 'خطأ: كافة الأساتذة المساعدة في الـ ERP متكاملة مالياً مع الأستاذ العام.'
        },
        dist_en: {
          'B': 'Incorrect: Accrued operational transactions do not touch liquid cash or equity.',
          'C': 'Incorrect: Sales revenue does not match operational depreciation.',
          'D': 'Incorrect: Subledgers are fully integrated with General Ledger.'
        },
        hints_ar: [
          'تذكر التوجيه المحاسبي المزدوج بين الأستاذ المساعد والأستاذ العام.',
          'المصروف أو الأصل يُجعل مديناً، وحساب الوساطة أو المورد يُجعل دائناً.',
          'مفتاح الحل: مدين المصروف/الأصل، دائن وسيط الاستحقاق/الموردين.'
        ],
        hints_en: [
          'Recall standard subledger-to-GL integration entries.',
          'Expense/Asset is debited, Clearing/Payable is credited.',
          'Direct Key: Debit Operating Expense/Asset, Credit Clearing/Payables.'
        ]
      }
    ];

    return questions.map((q, idx) => {
      const distMap = isAr ? q.dist_ar : q.dist_en;
      const rawOptions = q.opts.map(o => ({
        id: o.id,
        text: isAr ? o.ar : o.en,
        _isCorrect: o.id === q.correct,
        _origId: o.id
      }));

      // Fisher-Yates Shuffle
      const shuffled = [...rawOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }

      const letters = ['A', 'B', 'C', 'D'];
      const newDist = {};
      let newCorrect = 'A';

      const finalOpts = shuffled.map((o, optIdx) => {
        const letter = letters[optIdx];
        if (o._isCorrect) newCorrect = letter;
        else if (distMap[o._origId]) newDist[letter] = distMap[o._origId];
        return { id: letter, text: o.text };
      });

      return {
        id: `Q-${String(mod.id || 'MOD').toUpperCase()}-P${poolIndex + 1}-${String(idx + 1).padStart(3, '0')}`,
        module_id: moduleId,
        category_id: `CAT-${idx + 1}`,
        topic_id: `TOP-${idx + 1}`,
        concept_id: `CON-${idx + 1}`,
        question_type: q.type,
        difficulty: q.diff,
        question: isAr ? q.q_ar : q.q_en,
        options: finalOpts,
        correct_answer: newCorrect,
        explanation: isAr ? q.exp_ar : q.exp_en,
        distractors: newDist,
        hints: isAr ? q.hints_ar : q.hints_en,
        reference: {
          title: isAr ? `دليل المعايير التشغيلية والرقابية لـ ${modName}` : `ERP Architecture & Standards for ${mod.name_en}`,
          url: 'https://www.ifrs.org/',
          source: isAr ? 'المعايير القياسية للأنظمة المالية والتشغيلية' : 'IFRS & ERP Standards'
        }
      };
    });
  }

  function shuffleQuestion(q) {
    if (!q || !Array.isArray(q.options) || q.options.length <= 1) return q;
    const cloned = JSON.parse(JSON.stringify(q));
    const origCorrect = cloned.correct_answer;
    const origDistractors = cloned.distractors || {};

    const raw = cloned.options.map(opt => ({
      ...opt,
      _isCorrect: opt.id === origCorrect,
      _origId: opt.id
    }));

    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = raw[i];
      raw[i] = raw[j];
      raw[j] = temp;
    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const newDist = {};
    let newCorrect = 'A';

    cloned.options = raw.map((opt, idx) => {
      const letter = letters[idx];
      if (opt._isCorrect) newCorrect = letter;
      else if (origDistractors[opt._origId]) newDist[letter] = origDistractors[opt._origId];
      return { id: letter, text: opt.text };
    });

    cloned.correct_answer = newCorrect;
    cloned.distractors = newDist;
    return cloned;
  }

  return {
    getQuestionsForModule,
    resolveModuleKey,
    shuffleQuestion
  };
})();
