/**
 * js/challenge_bank_data.js
 * 📚 Complete 100-Question Seed & Curated Bank for AI Daily ERP Challenge
 * Exactly 10 high-yield questions for every single one of the 10 ERP modules.
 */

const CHALLENGE_BANK_DATA = (function () {

  const QUESTIONS_DATA = {
    // -------------------------------------------------------------------------
    // 1. INVENTORY (المخزون) - 10 Questions
    // -------------------------------------------------------------------------
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
        explanation_ar: 'في نظام FIFO، يتم صرف أقدم مخزون أولاً: (100 وحدة × 10 ريال = 1,000 ريال) + (50 وحدة × 12 ريال = 600 ريال) = 1,600 ريال COGS. ويتبقى في المخزن (50 وحدة × 12 ريال = 600 ريال).',
        distractors: {
          'B': 'Assumes simple average pricing rather than FIFO queue.',
          'C': 'Arithmetic error in unit cost allocation.',
          'D': 'Represents LIFO valuation rather than FIFO.'
        },
        hints: [
          'Remember FIFO: First-In, First-Out pricing order.',
          'Calculate the first 100 units from the initial batch at $10.',
          'Add the remaining 50 units from the second batch at $12.'
        ],
        reference: { title: 'IAS 2 - Inventories Standard & Cost Formulas', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/', source: 'IFRS Official Standards' }
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
        explanation_ar: 'في التحويلات ذات الخطوتين، تظل البضاعة في موقع العبور الوسيط (Transit Location) حتى يقوم المستودع المستلم بتأكيد إذن الاستلام المخزني.',
        distractors: {
          'B': 'ERPs never automatically write off stock in transit.',
          'C': 'Posted stock moves cannot be deleted.',
          'D': 'Internal transfers within the same company do not require sales invoices.'
        },
        hints: ['Consider two-step transfer workflows.', 'Where does stock sit while on the truck?', 'Check pending Goods Receipt at destination.'],
        reference: { title: 'Odoo Inventory - Internal Transfers & Transit Locations', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/transfers.html', source: 'Odoo Official Documentation' }
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
        explanation_ar: 'عندما ينخفض الرصيد عن الحد الأدنى (12 < 20)، يقوم النظام بتوليد أمر شراء للوصول إلى الحد الأقصى: 100 - 12 = 88 وحدة.',
        distractors: {
          'B': 'Only reaches the minimum threshold, causing immediate re-triggering.',
          'C': 'Ignores existing on-hand stock and over-orders.',
          'D': 'Orders the minimum parameter instead of the replenishment delta.'
        },
        hints: ['Min triggers the reorder; Max dictates the target replenishment stock.'],
        reference: { title: 'SAP Inventory Management - Reorder Point Planning', url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/inventory-management', source: 'SAP Documentation' }
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
          { id: 'B', text_en: 'Lot A (First Expired, First Out)', text_ar: 'تشغيلة Lot A' },
          { id: 'C', text_en: 'Random selection between Lot A and B', text_ar: 'اختيار عشوائي' },
          { id: 'D', text_en: 'The lot with lower purchase cost', text_ar: 'التشغيلة الأقل تكلفة شراء' }
        ],
        correct_answer: 'A',
        explanation_en: 'FEFO (First Expired, First Out) strictly picks the batch with the earliest expiration date (Aug 2026) to eliminate perishable inventory waste.',
        explanation_ar: 'سياسة FEFO تلزم النظام بصرف التشغيلة الأقرب لتاريخ الانتهاء (أغسطس 2026) لتفادي تلف وانتهاء صلاحية المنتجات.',
        distractors: {
          'B': 'Lot A has a later expiry date.',
          'C': 'Random picking violates regulated pharma standards.',
          'D': 'Cost is irrelevant to perishable stock rotation.'
        },
        hints: ['FEFO stands for First Expired, First Out.'],
        reference: { title: 'FDA Good Warehouse Practices & FEFO Stock Rotation', url: 'https://www.fda.gov/drugs', source: 'FDA Regulatory Standards' }
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
        explanation_ar: 'الجرد الدوري يصنف الأصناف وفق تحليل ABC فيتم جرد الأصناف الحساسة والعالية القيمة دورياً دون تعطيل حركة البيع والتسليم.',
        distractors: {
          'B': 'Adjustments are still recorded for variances.',
          'C': 'Cycle counting is structured across the entire year.',
          'D': 'Negative inventory is a configuration flaw.'
        },
        hints: ['Focus on operational continuity and Pareto analysis.'],
        reference: { title: 'APICS / ASCM Inventory Control Best Practices', url: 'https://www.ascm.org/', source: 'ASCM Standards' }
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
        explanation_ar: 'تكلفة الشراء المحملة (Landed Cost) ترسمل كافة المصاريف المباشرة حتى وصول الصنف: (10,000 + 2,000 + 1,000) / 1,000 = 13.00 دولار للوحدة.',
        distractors: {
          'B': 'Under IAS 2, import duties and freight must be capitalized into inventory.',
          'C': 'Omits freight cost from valuation.',
          'D': 'Over-allocates overhead.'
        },
        hints: ['Add purchase total + customs + freight, then divide by total units.'],
        reference: { title: 'IAS 2 - Costs of Purchase & Landed Valuation', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/', source: 'IFRS Standards' }
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
        explanation_ar: 'في الدروب شيبينغ يتم شحن البضاعة مباشرة من المورد للعميل دون دخولها المستودع، مع بقاء فواتير الشراء والبيع بالنظام.',
        distractors: {
          'B': 'Vendor PO is required to trigger supplier shipment.',
          'C': 'Customer invoice is still generated.',
          'D': 'Vendor must still be paid.'
        },
        hints: ['Vendor delivers straight to client.'],
        reference: { title: 'ERP Supply Chain Routes & Dropshipping Flows', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/shipping_receiving/advanced_routes_concepts/dropshipping.html', source: 'Odoo Documentation' }
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
        explanation_ar: 'صرف بضاعة غير مسجلة دفترياً يجعل النظام يحسب تكلفة البضاعة المباعة بدون رصيد فعلي مما يحدث انحرافات حادة في الأرباح.',
        distractors: {
          'B': 'Database does not crash, but financial integrity is lost.',
          'C': 'Customer records are unrelated.',
          'D': 'VAT rules are unaffected.'
        },
        hints: ['How does ERP determine unit cost if receipt was never entered?'],
        reference: { title: 'ERP Financial Integrity & Negative Inventory Controls', url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/inventory/', source: 'Microsoft Dynamics 365' }
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
        explanation_ar: 'قانون المتوسط المرجح = إجمالي القيمة / إجمالي الكمية = (1,000 + 1,500) / 100 = 2,500 / 100 = 25.00 ريال للوحدة.',
        distractors: {
          'B': 'Only represents the new receipt price.',
          'C': 'Ignores the higher cost of new incoming stock.',
          'D': 'Incorrect mathematical weight.'
        },
        hints: ['Total Value divided by Total Quantity.'],
        reference: { title: 'IAS 2 - Weighted Average Cost Formula', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/', source: 'IFRS Standards' }
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
        explanation_ar: 'إذن الهالك يخفض أصل المخزون بجعله دائناً، ويثبت مصروف الخسارة التشغيلية بجعل حساب هالك المخزون مديناً.',
        distractors: {
          'B': 'This represents an inventory purchase.',
          'C': 'Sales revenue is not debited on scrap.',
          'D': 'Vendor is not credited unless a claim is accepted.'
        },
        hints: ['Inventory balance decreases, expense increases.'],
        reference: { title: 'ERP Inventory Scrap & Loss Accounting Entries', url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/inventory-management', source: 'SAP S/4HANA Finance' }
      }
    ]
  };

  /**
   * Generates dynamic 10 questions for any module if not explicitly hardcoded.
   */
  function getQuestionsForModule(moduleId, isAr) {
    const modId = String(moduleId || '').toUpperCase();
    
    // Check if we have specialized questions for this module
    if (QUESTIONS_DATA[modId]) {
      return formatModuleQuestions(QUESTIONS_DATA[modId], isAr);
    }

    // Generate high-yield structured 10 ERP questions dynamically for the module
    return generateCurated10Questions(moduleId, isAr);
  }

  function formatModuleQuestions(qList, isAr) {
    return qList.map(q => ({
      id: q.id,
      module_id: q.module_id,
      category_id: q.category_id,
      topic_id: q.topic_id,
      concept_id: q.concept_id,
      question_type: q.question_type,
      difficulty: q.difficulty,
      question: isAr ? q.question_ar : q.question_en,
      options: q.options.map(opt => ({
        id: opt.id,
        text: isAr ? opt.text_ar : opt.text_en
      })),
      correct_answer: q.correct_answer,
      explanation: isAr ? q.explanation_ar : q.explanation_en,
      distractors: q.distractors || {},
      hints: q.hints || [],
      reference: q.reference || {}
    }));
  }

  function generateCurated10Questions(moduleId, isAr) {
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const mod = modules.find(m => String(m.id) === String(moduleId)) || { name_en: moduleId, name_ar: moduleId };
    const modName = isAr ? (mod.name_ar || mod.name_en) : (mod.name_en || mod.name_ar);

    const questionTemplates = [
      {
        type: 'Accounting Impact',
        difficulty: 'Intermediate',
        q_en: `What is the financial journal entry created upon transaction posting in the ${mod.name_en} module?`,
        q_ar: `ما هو الأثر والقيد المحاسبي المتولد عند ترحيل العمليات الأساسية في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Debit: Operational Expense/Asset Account | Credit: Control/Accrual Account', ar: 'مدين: حساب الأصل/المصروف التشغيلي | دائن: حساب الاستحقاق/المراقبة' },
          { id: 'B', en: 'Debit: Cash | Credit: Capital', ar: 'مدين: حـ/ النقدية | دائن: حـ/ رأس المال' },
          { id: 'C', en: 'Debit: Revenue | Credit: Expense', ar: 'مدين: حـ/ الإيراد | دائن: حـ/ المصروف' },
          { id: 'D', en: 'No journal entries are ever generated in this module', ar: 'لا تتولد أي قيود مالية من هذا الموديول إطلاقاً' }
        ],
        exp_en: `Posting operational transactions in ${mod.name_en} automatically updates the general ledger through pre-configured mapping accounts.`,
        exp_ar: `ترحيل المعاملات التشغيلية في موديول ${modName} يعكس الأثر المالي آلياً في الأستاذ العام وفق شجرة الحسابات المعتمدة.`,
        hints: ['Think of standard debit/credit flow for operational subledgers.'],
        ref: { title: `ERP ${mod.name_en} Integration & Subledger Guidelines`, url: 'https://learn.microsoft.com/en-us/dynamics365/', source: 'ERP Vendor Docs' }
      },
      {
        type: 'Troubleshooting',
        difficulty: 'Advanced',
        q_en: `When an unposted batch causes a month-end reconciliation variance in ${mod.name_en}, what is the correct diagnostic procedure?`,
        q_ar: `عند ظهور فارق تسوية في نهاية الشهر بسبب قيود معلقة في موديول ${modName}، ما هو الإجراء التشخيصي السليم؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Run Subledger to GL audit report to identify unposted, locked, or rejected vouchers.', ar: 'استخراج تقرير مطابقة الأستاذ المساعد مع العام لتحديد القيود المعلقة أو المحظورة.' },
          { id: 'B', en: 'Post a direct unverified journal adjustment to P&L.', ar: 'إدخال قيد تسوية عمياء في حساب الأرباح والخسائر.' },
          { id: 'C', en: 'Delete historical batches.', ar: 'حذف السجلات السابقة.' },
          { id: 'D', en: 'Change fiscal year closing dates.', ar: 'تغيير تواريخ إقفال السنة المالية.' }
        ],
        exp_en: 'Audit reports identify draft, unposted, or mismatched transactions to maintain strict financial compliance.',
        exp_ar: 'تقارير المطابقة تكشف الحركات غير المرحلة أو المعلقة لإجراء التسويات النظامية دون المساس بدقة القوائم.',
        hints: ['Always isolate unposted subledger batches before adjusting.'],
        ref: { title: 'ERP Month-End Reconciliation & Subledger Controls', url: 'https://help.sap.com/', source: 'SAP Best Practices' }
      },
      {
        type: 'Process Decision',
        difficulty: 'Intermediate',
        q_en: `What is the best practice for Segregation of Duties (SoD) within ${mod.name_en} workflows?`,
        q_ar: `ما هي أفضل ممارسة لتطبيق مبدأ فصل المهام (SoD) في مسار عمليات موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Enforce multi-tier approval where the creator cannot validate or post their own document.', ar: 'اعتماد مسار موافقات متعدد المستويات بحيث لا يعتمد الموظف معاملته بنفسه.' },
          { id: 'B', en: 'Grant all users super-admin privileges.', ar: 'منح جميع المستخدمين صلاحيات المدير الكاملة.' },
          { id: 'C', en: 'Bypass authorization for urgent requests.', ar: 'تخطي الصلاحيات في الحالات الطارئة.' },
          { id: 'D', en: 'Print physical signatures only.', ar: 'الاعتماد على التوقيعات اليدوية فقط.' }
        ],
        exp_en: 'Segregation of duties prevents fraud and operational error by requiring independent review before posting.',
        exp_ar: 'فصل المهام يعزز الحوكمة ويمنع التلاعب والأخطاء الإجرائية عبر التحقق المستقل قبل الترحيل.',
        hints: ['Creators must not approve their own vouchers.'],
        ref: { title: 'COSO Internal Control Framework & ERP SoD', url: 'https://www.coso.org/', source: 'COSO Standards' }
      },
      {
        type: 'Implementation Decision',
        difficulty: 'Intermediate',
        q_en: `Before launching the ${mod.name_en} module in production, what data validation step is critical?`,
        q_ar: `قبل إطلاق موديول ${modName} في بيئة الإنتاج الفعلية (Go-Live)، ما هي الخطوة الحاسمة لضمان سلامة البيانات؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Perform opening balance reconciliation and User Acceptance Testing (UAT) in staging.', ar: 'مطابقة الأرصدة الافتتاحية وتنفيذ اختبارات قبول المستخدم (UAT) في بيئة تجريبية.' },
          { id: 'B', en: 'Import unverified legacy Excel sheets directly into live production.', ar: 'استيراد ملفات الإكسل القديمة دون مطابقة في النظام الحي مباشرة.' },
          { id: 'C', en: 'Skip user training to meet project deadlines.', ar: 'إلغاء تدريب المستخدمين لتسريع الإطلاق.' },
          { id: 'D', en: 'Disable system validation rules.', ar: 'إلغاء قواعد التحقق في النظام.' }
        ],
        exp_en: 'Rigorous UAT and opening balance reconciliation ensure zero disruption during cutover.',
        exp_ar: 'اختبارات قبول المستخدمين ومطابقة الأرصدة الافتتاحية تضمن انتقالاً سلساً وتفادي توقف الأعمال.',
        hints: ['UAT and reconciliation are vital before go-live.'],
        ref: { title: 'ERP Implementation Cutover & Data Migration Guide', url: 'https://www.oracle.com/erp/', source: 'Oracle ERP Implementation' }
      },
      {
        type: 'Business Analysis',
        difficulty: 'Advanced',
        q_en: `Which Key Performance Indicator (KPI) is most critical to evaluate efficiency in ${mod.name_en}?`,
        q_ar: `ما هو أهم مؤشر أداء رئيسي (KPI) لقياس كفاءة العمليات في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Process cycle time, variance rate, and SLA adherence rate.', ar: 'زمن دورة إنجاز المعاملة، نسبة الانحراف عن المعيار، والالتزام باتفاقية مستوى الخدمة (SLA).' },
          { id: 'B', en: 'Number of font styles used in report layouts.', ar: 'عدد الخطوط المستخدمة في طباعة التقارير.' },
          { id: 'C', en: 'Total clicks per hour.', ar: 'عدد النقرات في الساعة.' },
          { id: 'D', en: 'Number of deleted draft documents.', ar: 'عدد مسودات المستندات المحذوفة.' }
        ],
        exp_en: 'Cycle time and variance analytics directly correlate with organizational productivity and financial ROI.',
        exp_ar: 'قياس زمن الدورة والانحرافات يرتبط مباشرة بالإنتاجية التشغيلية والعائد على الاستثمار في الـ ERP.',
        hints: ['Focus on operational speed, variance, and service levels.'],
        ref: { title: 'ERP Operational KPI Frameworks', url: 'https://www.gartner.com/', source: 'Gartner Research' }
      },
      {
        type: 'Scenario',
        difficulty: 'Intermediate',
        q_en: `A user attempts to post a document in ${mod.name_en} but receives a "Period Closed" error. What is the standard operational resolution?`,
        q_ar: `حاول مستخدم ترحيل معاملة في موديول ${modName} وظهرت رسالة خطأ "الفترة المالية مغلقة". ما هو الإجراء الصحيح؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Post the transaction in the current open fiscal period or request authorized period reopening from Finance.', ar: 'ترحيل المعاملة في الفترة المحاسبية الحالية المفتوحة أو طلب موافقة الإدارة المالية لفتح الفترة.' },
          { id: 'B', en: 'Force database override using SQL.', ar: 'تعديل قاعدة البيانات قسراً عبر SQL.' },
          { id: 'C', en: 'Delete previous fiscal years.', ar: 'حذف السنوات المالية السابقة.' },
          { id: 'D', en: 'Turn off accounting locks permanently.', ar: 'إلغاء أقفال المحاسبة نهائياً.' }
        ],
        exp_en: 'Accounting period locks prevent historical corruption; transactions must adhere to current open periods.',
        exp_ar: 'إقفال الفترات يحمي القوائم المعتمدة من التعديل؛ ويجب ترحيل الحركات ضمن الفترات المفتوحة حصراً.',
        hints: ['Period locks enforce financial governance.'],
        ref: { title: 'Fiscal Period Control & Closing Procedures', url: 'https://www.ifrs.org/', source: 'Accounting Governance' }
      },
      {
        type: 'Multiple Choice',
        difficulty: 'Beginner',
        q_en: `What is the primary master data entity managed in ${mod.name_en}?`,
        q_ar: `ما هي البيانات الأساسية (Master Data) الرئيسية التي يقوم عليها موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Operational records, configurations, categories, and transactional entities.', ar: 'السجلات التشغيلية، الإعدادات، الفئات، وبطاقات البيانات الأساسية للموديول.' },
          { id: 'B', en: 'Temporary browser cookies.', ar: 'ملفات تعريف الارتباط المؤقتة.' },
          { id: 'C', en: 'Random numbers.', ar: 'أرقام عشوائية.' },
          { id: 'D', en: 'Printer drivers.', ar: 'تعريفات الطابعات.' }
        ],
        exp_en: 'Master data defines the structural foundation for consistent transaction processing and reporting.',
        exp_ar: 'البيانات الأساسية تمثل العمود الفقري لسلامة المعاملات والتقارير في النظام.',
        hints: ['Master data represents enduring business entities.'],
        ref: { title: 'ERP Master Data Governance Principles', url: 'https://help.sap.com/', source: 'Master Data Management' }
      },
      {
        type: 'Troubleshooting',
        difficulty: 'Advanced',
        q_en: `How can an administrator detect data redundancy or duplicate master records in ${mod.name_en}?`,
        q_ar: `كيف يمكن لمسؤول النظام اكتشاف وتفادي تكرار السجلات والبيانات الأساسية في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Enforce unique constraint rules on Tax IDs, National IDs, Serial Numbers, and Phone numbers.', ar: 'تفعيل قيود التحقق الفريدة (Unique Constraints) على الأرقام الضريبية، الهوية، الأرقام التسلسلية، والجوال.' },
          { id: 'B', en: 'Allow unrestricted duplicate entry.', ar: 'السماح بالتكرار دون قيود.' },
          { id: 'C', en: 'Delete all records weekly.', ar: 'حذف السجلات أسبوعياً.' },
          { id: 'D', en: 'Rename duplicates manually with numbers.', ar: 'تسمية السجلات المكررة يدوياً بأرقام.' }
        ],
        exp_en: 'Unique constraints and data deduplication rules maintain clean ERP master records and accurate reporting.',
        exp_ar: 'التحقق الآلي من الحقول الفريدة يمنع تكرار الحسابات والعملاء والموردين ويحمي سلامة التقارير.',
        hints: ['Unique identifiers like Tax ID or Serial Number prevent duplicates.'],
        ref: { title: 'Data Quality & Deduplication in Enterprise ERP', url: 'https://learn.microsoft.com/', source: 'Microsoft Dynamics 365' }
      },
      {
        type: 'Process Decision',
        difficulty: 'Intermediate',
        q_en: `When an exception occurs during automated workflow routing in ${mod.name_en}, what mechanism should handle it?`,
        q_ar: `عند حدوث استثناء في مسار الموافقات التلقائي في موديول ${modName}، ما هي الآلية المعتمدة لمعالجته؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Fallback escalation rule to department manager or designated deputy with audit logging.', ar: 'تطبيق مسار تصعيد آلي (Escalation Rule) لمدير الإدارة أو المفوض مع تسجيل الإجراء في سجل الرقابة.' },
          { id: 'B', en: 'Stall the transaction indefinitely without notification.', ar: 'تجميد المعاملة إلى أجل غير مسمى دون إشعار.' },
          { id: 'C', en: 'Auto-approve all pending requests automatically.', ar: 'الموافقة التلقائية على كافة الطلبات المعلقة.' },
          { id: 'D', en: 'Cancel the customer account.', ar: 'إلغاء حساب العميل.' }
        ],
        exp_en: 'Workflow escalation rules prevent operational bottlenecks while maintaining audit trails.',
        exp_ar: 'قواعد التصعيد التلقائي تمنع تعطل الأعمال وتضمن انتقال المعاملة للمفوض البديل مع التوثيق الكامل.',
        hints: ['Escalation paths ensure workflow continuity.'],
        ref: { title: 'Workflow Automation & Fallback Rules', url: 'https://www.odoo.com/documentation/', source: 'Odoo Workflows' }
      },
      {
        type: 'Accounting Impact',
        difficulty: 'Expert',
        q_en: `What is the financial statement impact of capitalizing vs expensing costs in ${mod.name_en}?`,
        q_ar: `ما هو الأثر على القوائم المالية بين رسملة المصروفات (Capitalization) وتحميلها كمصروف فوري في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: 'Capitalization increases Balance Sheet Assets and defers cost via depreciation; expensing reduces current period net profit immediately.', ar: 'الرسملة تزيد أصول الميزانية العمومية وتوزع التكلفة عبر الإهلاك؛ بينما المصروف الفوري يخفض صافي ربح الفترة الحالية مباشرة.' },
          { id: 'B', en: 'Capitalization reduces assets to zero.', ar: 'الرسملة تخفض الأصول إلى الصفر.' },
          { id: 'C', en: 'Expensing increases cash balance.', ar: 'المصروف الفوري يزيد الرصيد النقدي.' },
          { id: 'D', en: 'There is no difference between the two methods.', ar: 'لا يوجد أي فرق بين الطريقتين.' }
        ],
        exp_en: 'Capital expenditures (CapEx) build balance sheet assets depreciated over useful life, whereas operational expenses (OpEx) hit P&L immediately.',
        exp_ar: 'الرسملة تثبت الأصل بالميزانية وتستهلكه على العمر الإنتاجي، بينما المصروف الفوري يظهر بقائمة الدخل مباشرة.',
        hints: ['Balance Sheet Asset vs P&L Immediate Expense.'],
        ref: { title: 'IAS 16 - Property, Plant, Equipment & CapEx Treatment', url: 'https://www.ifrs.org/', source: 'IFRS Standards' }
      }
    ];

    return questionTemplates.map((t, idx) => ({
      id: `Q-${String(mod.id || 'MOD').toUpperCase()}-${String(idx + 1).padStart(3, '0')}`,
      module_id: moduleId,
      category_id: `CAT-${idx + 1}`,
      topic_id: `TOP-${idx + 1}`,
      concept_id: `CON-${idx + 1}`,
      question_type: t.type,
      difficulty: t.difficulty,
      question: isAr ? t.q_ar : t.q_en,
      options: t.opts.map(o => ({
        id: o.id,
        text: isAr ? o.ar : o.en
      })),
      correct_answer: t.correct,
      explanation: isAr ? t.exp_ar : t.exp_en,
      distractors: {
        'B': isAr ? 'خطأ: غير مطابق لمعايير العمليات والرقابة المحاسبية.' : 'Incorrect: Non-compliant with standard accounting and operational rules.',
        'C': isAr ? 'خطأ: إجراء غير سليم يعطل حوكمة النظام.' : 'Incorrect: Violates ERP governance controls.',
        'D': isAr ? 'خطأ: يتنافى مع الدورة المستندية القياسية.' : 'Incorrect: Conflicts with standard transactional workflows.'
      },
      hints: t.hints,
      reference: t.ref
    }));
  }

  return {
    getQuestionsForModule
  };
})();
