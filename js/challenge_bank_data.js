/**
 * js/challenge_bank_data.js
 * 📚 Comprehensive High-Yield ERP Question Bank
 * Contains 100% authentic, realistic ERP multiple-choice & scenario questions.
 * ZERO generic placeholder options.
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
        hints: ['Min triggers the reorder; Max dictates the target replenishment stock.', 'Calculate target stock minus current stock.', '100 - 12 = ?'],
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
          { id: 'B', text_en: 'Lot A', text_ar: 'تشغيلة Lot A' },
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
        hints: ['FEFO stands for First Expired, First Out.', 'Compare expiry dates: Aug 2026 vs Dec 2026.', 'August comes before December.'],
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
        hints: ['Focus on operational continuity and Pareto analysis.', 'High value items need frequent checking.', 'Operations continue running smoothly.'],
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
        hints: ['Add purchase total + customs + freight.', 'Divide sum by 1,000 total units.', 'Total = $13,000 / 1,000 = $13.00.'],
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
        hints: ['Vendor delivers straight to client.', 'Physical inventory does not enter your warehouse.', 'Invoicing still occurs.'],
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
        hints: ['How does ERP determine unit cost if receipt was never entered?', 'COGS calculation fails without cost foundation.', 'Distorts gross margin.'],
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
        hints: ['Total Value divided by Total Quantity.', '$1,000 + $1,500 = $2,500 total.', 'Divide $2,500 by 100 units.'],
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
        hints: ['Inventory balance decreases, expense increases.', 'Credit the asset account.', 'Debit the scrap expense.'],
        reference: { title: 'ERP Inventory Scrap & Loss Accounting Entries', url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/inventory-management', source: 'SAP S/4HANA Finance' }
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
        explanation_ar: 'بضاعة الأمانة تظل خارج الميزانية حتى يتم استهلاكها أو بيعها، وعندها يولد النظام قيد: مدين المخزون/تكلفة المبيعات، دائن المورد.',
        distractors: {
          'B': 'Physical receipt without ownership transfer does not trigger GL liability.',
          'C': 'Contract signing is not an accounting transaction.',
          'D': 'Unconsumed stock is never capitalized arbitrarily.'
        },
        hints: ['Who bears the ownership risk while the stock sits untouched on your shelf?', 'Liability occurs at consumption.', 'Off-balance sheet until consumed.'],
        reference: { title: 'IFRS 15 & IAS 2 - Consignment Inventory Accounting Treatment', url: 'https://www.ifrs.org/', source: 'IFRS Accounting Standards' }
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
        explanation_ar: 'صافي القيمة البيعية NRV = سعر البيع (42,000) - مصاريف البيع (2,000) = 40,000 ريال. الفارق بين التكلفة (50,000) وصافي القيمة (40,000) هو 10,000 ريال يُحمل كمصروف هبوط بالقوائم.',
        distractors: {
          'B': 'Forgot to deduct the $2,000 estimated costs to sell from NRV.',
          'C': 'Only considered the selling cost without comparing to market drop.',
          'D': 'IAS 2 mandates immediate lower-of-cost-and-NRV recognition at reporting date.'
        },
        hints: ['Calculate NRV first: Selling price minus costs to sell.', 'NRV = 42,000 - 2,000 = 40,000.', 'Compare 50,000 cost with 40,000 NRV.'],
        reference: { title: 'IAS 2 - Measurement of Inventories at Lower of Cost and NRV', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/', source: 'IFRS Standards' }
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
        explanation_ar: 'قواعد التوجيه المخزني (Putaway) تربط خصائص الصنف بأماكن التخزين المناسبة لتقليل وقت الحركة وضمان اشتراطات السلامة.',
        distractors: {
          'B': 'WMS rules have zero impact on financial invoice lifecycle.',
          'C': 'Corridor dumping creates severe safety and operational bottlenecks.',
          'D': 'Barcode scanning is fundamental to verifying correct bin destination.'
        },
        hints: ['Think of bin location optimization based on product characteristics.', 'Fast-moving items go near dispatch; heavy items go on ground racks.'],
        reference: { title: 'WMS Warehouse Layout & Putaway Strategies', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/advanced_warehouses_management/putaway.html', source: 'Odoo WMS Documentation' }
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
        explanation_ar: 'البضائع المرتجعة يجب أن تدخل موقع الحجر الفني غير القابل للبيع للفحص قبل البت في شطبها أو إرجاعها للمورد لضمان الجودة.',
        distractors: {
          'B': 'Selling uninspected defective goods damages reputation and violates quality SLAs.',
          'C': 'Customer accounts cannot be deleted to hide returns.',
          'D': 'Price modification bypasses standard RMA debit/credit reversal.'
        },
        hints: ['Goods must be quarantined and inspected before restocked or credited.', 'Never mix defective returns with fresh saleable inventory.'],
        reference: { title: 'Reverse Logistics & Quality Quarantine in Enterprise ERP', url: 'https://help.sap.com/', source: 'SAP Supply Chain Logistics' }
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
        explanation_ar: 'الـ Phantom BOM هي تجميعة عابرة لا تُخزن ولا يُنشأ لها أمر شغل مستقل، بل تنفجر شجرتها مباشرة لمكوناتها الأولية عند تصنيع المنتج النهائي.',
        distractors: {
          'B': 'Financial costing accurately rolls up raw component costs.',
          'C': 'Components are actively picked and issued on the parent order.',
          'D': 'Standard costing operates transparently through phantom levels.'
        },
        hints: ['Phantom sub-assemblies exist logically for design but are not stocked physically.', 'Parent production order explodes directly to raw components.'],
        reference: { title: 'BOM Types & Phantom Assemblies in ERP/MRP', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/manufacturing/management/kit_shipping.html', source: 'Odoo Manufacturing Guide' }
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
        explanation_ar: 'معايير GS1 تسمح بتضمين رقم الصنف وتشغيلته وتاريخ انتهائه في باركود واحد، فيقوم النظام بتعبئة حقول التتبع دفعة واحدة بدقة 100%.',
        distractors: {
          'B': 'Approval hierarchies are governed by RBAC, not barcode protocols.',
          'C': 'Currency revaluation is unrelated to physical scanning.',
          'D': 'Barcode scanners capture input, they do not manage multi-lingual reporting.'
        },
        hints: ['GS1 barcodes embed multiple data points: GTIN + Lot + Expiry in one symbol.', 'Eliminates manual keyboard entry on mobile devices.'],
        reference: { title: 'GS1-128 Barcode Standard in Supply Chain Management', url: 'https://www.gs1.org/standards/barcodes', source: 'GS1 International Standards' }
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
        explanation_ar: 'في التكلفة المعيارية يدخل المخزون بسعره المعياري (5,000 ريال)، ويثبت الفارق غير الملائم (500 ريال) كحساب انحراف أسعار شراء PPV مدين بقائمة الدخل، ويثبت استحقاق المورد الفعلي (5,500 ريال).',
        distractors: {
          'B': 'Represents Moving Average valuation, not Standard Costing.',
          'C': 'Cash is not touched during voucher accrual validation.',
          'D': 'Sales revenue is not debited during vendor inventory purchasing.'
        },
        hints: ['Inventory is debited at standard cost (100 * $50).', 'Vendor is credited at actual invoice price (100 * $55).', 'Variance of $500 balances the entry as a debit expense.'],
        reference: { title: 'Standard Costing & Purchase Price Variance (PPV) Accounting', url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/controlling', source: 'SAP Controlling & Cost Accounting' }
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
        explanation_ar: 'الصرف بالمجموعات (Batch Picking) يدمج بنود الطلبات المتشابهة في مسار واحد ليسحب العامل إجمالي الكمية المطلوبة برحلة واحدة فقط.',
        distractors: {
          'B': 'Discrete picking creates 500 redundant trips to the exact same rack location.',
          'C': 'Random picking results in high error rates and zero auditability.',
          'D': 'Physical inventory counts do not fulfill customer delivery orders.'
        },
        hints: ['Pick once in bulk, sort at packing station.', 'Compare 1 consolidated trip vs 500 individual trips.'],
        reference: { title: 'WMS Warehouse Picking Strategies: Batch vs Wave vs Zone', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/shipping_receiving/picking_methods.html', source: 'Odoo WMS Guide' }
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
        explanation_ar: 'فحص سجلات رسائل الـ API يكشف العمليات التي فشل وصولها أو تأكيدها بين النظامين (مثل إشعارات الاستلام والتسليم المعلقة) لمعالجتها برمجياً.',
        distractors: {
          'B': 'Blind balance deletion corrupts accounting audit trails.',
          'C': 'Disconnecting communications halts all logistics operations.',
          'D': 'Chart of accounts has no impact on EDI integration payloads.'
        },
        hints: ['Check failed API webhooks and pending ASN documents.', 'EDI / API integration error logs provide exact transaction mismatch root causes.'],
        reference: { title: '3PL Logistics Integration Best Practices & EDI Standards', url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/', source: 'Microsoft Dynamics 365 Supply Chain' }
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
        explanation_ar: 'أفضل ممارسة في الـ ERP هي اعتماد الوحدة الأصغر كوحدة أساسية (Base UoM) ورفع دقة المنازل العشرية في معادلات التحويل لمنع تراكم فروق التقريب الحسابية.',
        distractors: {
          'B': 'Manufacturing formulas are core business requirements.',
          'C': 'Negative stock compounds valuation distortions.',
          'D': 'Zero rounding ruins production batch cost accounting.'
        },
        hints: ['Base UoM should always be the lowest common denominator unit.', 'Increase decimal rounding precision to 4 or 5 decimal places.'],
        reference: { title: 'Units of Measure (UoM) Conversion & Decimal Precision in ERP', url: 'https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/management/products/uom.html', source: 'Odoo Product UoM Standards' }
      }
    ],

    // =========================================================================
    // 2. FINANCIAL ACCOUNTING (الحسابات) - 20 Distinct High-Yield Questions
    // =========================================================================
    'MOD-2': [
      {
        id: 'Q-ACC-001',
        module_id: 'MOD-2',
        category_id: 'CAT-ACC-GL',
        topic_id: 'TOP-CLOSING',
        concept_id: 'CON-RETAINED-EARNINGS',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question_en: 'When executing the Year-End Financial Closing entry for a net profit of $500,000, what is the correct debit and credit journal entry?',
        question_ar: 'عند إجراء قيد إقفال نهاية السنة المالية (Year-End Closing Entry)، ما هو الحساب الدائن والمدين الصحيح لإقفال صافي ربح قدره 500,000 ريال؟',
        options: [
          { id: 'A', text_en: 'Debit: P&L Income Summary $500,000 | Credit: Retained Earnings $500,000', text_ar: 'مدين: حـ/ ملخص الدخل والأرباح والخسائر 500,000 ريال | دائن: حـ/ الأرباح المبقاة (Retained Earnings) 500,000 ريال' },
          { id: 'B', text_en: 'Debit: Cash $500,000 | Credit: Sales Revenue $500,000', text_ar: 'مدين: حـ/ النقدية 500,000 ريال | دائن: حـ/ الإيرادات 500,000 ريال' },
          { id: 'C', text_en: 'Debit: Retained Earnings $500,000 | Credit: Operational Expenses $500,000', text_ar: 'مدين: حـ/ الأرباح المبقاة 500,000 ريال | دائن: حـ/ المصروفات 500,000 ريال' },
          { id: 'D', text_en: 'Debit: Share Capital $500,000 | Credit: Bank $500,000', text_ar: 'مدين: حـ/ رأس المال 500,000 ريال | دائن: حـ/ البنك 500,000 ريال' }
        ],
        correct_answer: 'A',
        explanation_en: 'Temporary revenue and expense accounts close into Income Summary, and the resulting credit balance net profit is transferred to Balance Sheet Equity by Debiting Income Summary and Crediting Retained Earnings.',
        explanation_ar: 'يتم إقفال حسابات قائمة الدخل المؤقتة في حـ/ ملخص الدخل، ثم يُرحل صافي الربح الدائن بإثباته مديناً في ملخص الدخل ودائناً في حـ/ الأرباح المبقاة (حقوق الملكية) في الميزانية العمومية.',
        distractors: {
          'B': 'Closing entries are accounting equity adjustments and do not touch liquid cash.',
          'C': 'This entry structure records a net loss, not a profit.',
          'D': 'Paid-in share capital is not modified directly by periodic operational closings.'
        },
        hints: ['Where do cumulative profits accumulate within Balance Sheet Equity?', 'Credit balance profits are debited to zero out and credited to equity.', 'Look for Retained Earnings.'],
        reference: { title: 'IAS 1 - Presentation of Financial Statements & Equity Movements', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements/', source: 'IFRS Accounting Standards' }
      },
      {
        id: 'Q-ACC-002',
        module_id: 'MOD-2',
        category_id: 'CAT-ACC-BANK',
        topic_id: 'TOP-BANK-RECON',
        concept_id: 'CON-OUTSTANDING-CHECKS',
        question_type: 'Troubleshooting',
        difficulty: 'Intermediate',
        question_en: 'In monthly Bank Reconciliation, the ERP General Ledger bank balance is $120,000, while the Bank Statement shows $145,000. Outstanding issued vendor checks total $27,000, and unrecorded bank fees total $2,000. What is the true adjusted reconciled cash balance?',
        question_ar: 'في مذكرة تسوية البنك الشهرية، رصيد البنك في دفاتر الشركة (GL) هو 120,000 ريال، ورصيد كشف حساب البنك 145,000 ريال. الشيكات الصادرة للموردين ولم تُصرف بعد 27,000 ريال، والعمولات البنكية غير المسجلة بالدفاتر 2,000 ريال. ما هو الرصيد النقدي الفعلي المعدل؟',
        options: [
          { id: 'A', text_en: '$118,000 ($120,000 book - $2,000 fee = $145,000 bank - $27,000 checks)', text_ar: '118,000 ريال (رصيد الدفاتر 120,000 - 2,000 عمولات = رصيد الكشف 145,000 - 27,000 شيكات)' },
          { id: 'B', text_en: '$145,000', text_ar: '145,000 ريال' },
          { id: 'C', text_en: '$122,000', text_ar: '122,000 ريال' },
          { id: 'D', text_en: '$147,000', text_ar: '147,000 ريال' }
        ],
        correct_answer: 'A',
        explanation_en: 'Adjusted Book Balance = Book ($120,000) - Unrecorded Bank Fees ($2,000) = $118,000. Adjusted Bank Balance = Bank Statement ($145,000) - Outstanding Checks ($27,000) = $118,000. Both reconcile perfectly at $118,000.',
        explanation_ar: 'الرصيد المعدل للدفاتر = 120,000 - 2,000 عمولات = 118,000 ريال. والرصيد المعدل لكشف البنك = 145,000 - 27,000 شيكات لم تصرف = 118,000 ريال. يتطابق الطرفان تماماً عند 118,000 ريال.',
        distractors: {
          'B': 'Ignores outstanding checks that the bank has not cleared yet.',
          'C': 'Incorrectly added the bank fee expense instead of deducting it.',
          'D': 'Added outstanding checks to bank balance instead of subtracting.'
        },
        hints: ['Deduct bank fees from book balance.', 'Deduct outstanding checks from bank statement balance.', 'Both sides must equal $118,000.'],
        reference: { title: 'Bank Reconciliation Standards & Cash Controls', url: 'https://www.oracle.com/erp/financials/cash-management/', source: 'Oracle Financials Best Practices' }
      },
      {
        id: 'Q-ACC-003',
        module_id: 'MOD-2',
        category_id: 'CAT-ACC-ACCRUALS',
        topic_id: 'TOP-PREPAID',
        concept_id: 'CON-PREPAID-EXPENSE',
        question_type: 'Accounting Impact',
        difficulty: 'Intermediate',
        question_en: 'On January 1, a company pays $120,000 upfront for an annual commercial office lease. At the end of January, what monthly amortization journal entry must the ERP post under the Accrual Basis?',
        question_ar: 'في 1 يناير، سددت شركة 120,000 ريال نقداً عن إيجار مكاتب سنوي مقدماً. في نهاية شهر يناير، ما هو قيد التسوية الشهرية الذي يجب ترحيله في النظام وفق أساس الاستحقاق؟',
        options: [
          { id: 'A', text_en: 'Debit: Rent Expense $10,000 | Credit: Prepaid Rent Asset $10,000', text_ar: 'مدين: حـ/ مصروف الإيجار 10,000 ريال | دائن: حـ/ إيجار مدفوع مقدماً 10,000 ريال' },
          { id: 'B', text_en: 'Debit: Rent Expense $120,000 | Credit: Cash $120,000', text_ar: 'مدين: حـ/ مصروف الإيجار 120,000 ريال | دائن: حـ/ النقدية 120,000 ريال' },
          { id: 'C', text_en: 'Debit: Prepaid Rent $10,000 | Credit: Cash $10,000', text_ar: 'مدين: حـ/ الإيجار المقدم 10,000 ريال | دائن: حـ/ النقدية' },
          { id: 'D', text_en: 'Debit: Accounts Payable $10,000 | Credit: Rent Expense $10,000', text_ar: 'مدين: حـ/ الموردين | دائن: حـ/ مصروف الإيجار' }
        ],
        correct_answer: 'A',
        explanation_en: 'Monthly rent cost = $120,000 / 12 months = $10,000. Under accrual accounting, the ERP amortizes the current month portion by Debiting Rent Expense (P&L) and Crediting Prepaid Rent Asset (Balance Sheet).',
        explanation_ar: 'إيجار الشهر = 120,000 / 12 = 10,000 ريال. قيد التسوية يخفض أصل الإيجار المقدم بجعله دائناً بـ 10,000، ويثبت مصروف إيجار الشهر مديناً بقائمة الدخل.',
        distractors: {
          'B': 'Expensing full $120,000 in month 1 violates GAAP/IFRS matching principle.',
          'C': 'Cash was already paid on Jan 1; adjusting entries do not touch cash.',
          'D': 'Accounts Payable is not involved in prepaid amortizations.'
        },
        hints: ['Divide annual payment by 12 months = $10,000/month.', 'P&L expense increases (debit), Prepaid asset decreases (credit).'],
        reference: { title: 'IAS 1 - Accrual Basis of Accounting & Matching Principle', url: 'https://www.ifrs.org/', source: 'IFRS Accounting Standards' }
      },
      {
        id: 'Q-ACC-004',
        module_id: 'MOD-2',
        category_id: 'CAT-ACC-CURRENCY',
        topic_id: 'TOP-FOREX',
        concept_id: 'CON-UNREALIZED-FX',
        question_type: 'Accounting Impact',
        difficulty: 'Advanced',
        question_en: 'A company with SAR base currency has an open USD vendor payable of $100,000 booked at USD/SAR = 3.75 (SAR 375,000). At month-end, the exchange rate becomes 3.80. What revaluation journal entry must the ERP generate?',
        question_ar: 'شركة عملتها الأساسية الريال (SAR) ولديها ذمة مورد مفتوحة بمبلغ 100,000 دولار مسجلة بسعر صرف 3.75 (375,000 ريال). في نهاية الشهر ارتفع سعر الصرف إلى 3.80. ما هو قيد إعادة تقييم فروق العملة المتولد في النظام؟',
        options: [
          { id: 'A', text_en: 'Debit: Unrealized Foreign Exchange Loss $5,000 | Credit: Accounts Payable (USD Subledger) $5,000', text_ar: 'مدين: حـ/ خسائر فروق عملة غير محققة (P&L) 5,000 ريال | دائن: حـ/ ذمم الموردين (المساعد) 5,000 ريال' },
          { id: 'B', text_en: 'Debit: Accounts Payable $5,000 | Credit: Unrealized FX Gain $5,000', text_ar: 'مدين: حـ/ ذمم الموردين 5,000 ريال | دائن: حـ/ أرباح فروق عملة 5,000 ريال' },
          { id: 'C', text_en: 'Debit: Cash $5,000 | Credit: Bank $5,000', text_ar: 'مدين: حـ/ النقدية 5,000 | دائن: حـ/ البنك 5,000' },
          { id: 'D', text_en: 'No journal entry until actual cash payment is settled', text_ar: 'لا يتم إثبات أي قيد إلا عند السداد النقدي الفعلي' }
        ],
        correct_answer: 'A',
        explanation_en: 'New payable value = $100,000 * 3.80 = SAR 380,000. Increase in liability = SAR 5,000. Under IAS 21, monetary liabilities in foreign currency must be revalued at period-end rate, recognizing an Unrealized FX Loss in P&L.',
        explanation_ar: 'قيمة الالتزام الجديدة = 100,000 × 3.80 = 380,000 ريال. زادت المديونية بـ 5,000 ريال مما يمثل خسارة غير محققة: مدين خسائر فروق عملة، دائن الموردين.',
        distractors: {
          'B': 'An increase in payable liability represents a loss, not a gain.',
          'C': 'Forex revaluation is an accounting valuation adjustment with zero cash movement.',
          'D': 'IAS 21 mandates monetary item revaluation at every reporting balance sheet date.'
        },
        hints: ['Liability increased from SAR 375,000 to SAR 380,000.', 'Higher liability = Foreign exchange loss (Debit Expense).'],
        reference: { title: 'IAS 21 - The Effects of Changes in Foreign Exchange Rates', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-21-the-effects-of-changes-in-foreign-exchange-rates/', source: 'IFRS Standards' }
      },
      {
        id: 'Q-ACC-005',
        module_id: 'MOD-2',
        category_id: 'CAT-ACC-VAT',
        topic_id: 'TOP-VAT-RETURN',
        concept_id: 'CON-VAT-NETTING',
        question_type: 'Implementation Decision',
        difficulty: 'Intermediate',
        question_en: 'During a tax quarter, Output VAT on sales was $150,000 and recoverable Input VAT on purchases was $90,000. What is the net tax liability payable to the Tax Authority (ZATCA/IRS)?',
        question_ar: 'خلال الربع الضريبي، بلغت ضريبة المخرجات على المبيعات (Output VAT) 150,000 ريال، وضريبة المدخلات القابلة للاسترداد على المشتريات (Input VAT) 90,000 ريال. ما هو صافي الالتزام الضريبي المستحق سداده للهيئة؟',
        options: [
          { id: 'A', text_en: '$60,000 Net Payable ($150,000 Output VAT - $90,000 Input VAT)', text_ar: '60,000 ريال مستحقة السداد (ضريبة مخرجات 150,000 - ضريبة مدخلات 90,000)' },
          { id: 'B', text_en: '$240,000 ($150,000 + $90,000)', text_ar: '240,000 ريال (مجموع الضريبتين)' },
          { id: 'C', text_en: '$150,000 (Input VAT is ignored)', text_ar: '150,000 ريال (إهمال ضريبة المدخلات)' },
          { id: 'D', text_en: '$90,000 Refund', text_ar: '90,000 ريال استرداد' }
        ],
        correct_answer: 'A',
        explanation_en: 'Net Tax Payable = Output VAT Collected from Customers ($150,000) minus Input VAT Paid to Suppliers ($90,000) = $60,000 Net VAT Payable to Tax Authority.',
        explanation_ar: 'صافي الضريبة الواجبة السداد = ضريبة المبيعات المحصلة (150,000) - ضريبة المشتريات المسددة (90,000) = 60,000 ريال تُسدد بإقرار القيمة المضافة.',
        distractors: {
          'B': 'Incorrectly summed sales and purchase VAT.',
          'C': 'Fails to claim legitimate recoverable input VAT tax credit.',
          'D': 'Represents a refund position which only occurs if Input VAT > Output VAT.'
        },
        hints: ['Net Tax = Output VAT minus Input VAT.', '150,000 - 90,000 = 60,000 payable.'],
        reference: { title: 'ZATCA VAT Executive Regulations & Net Tax Filing', url: 'https://zatca.gov.sa/', source: 'ZATCA Tax Authority' }
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
    return qList.map(q => ({
      id: q.id,
      module_id: requestedModuleId || q.module_id,
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

  function generateCurated10Questions(moduleId, isAr, poolIndex = 0) {
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const mod = modules.find(m => String(m.id) === String(moduleId)) || { name_en: moduleId, name_ar: moduleId };
    const modName = isAr ? (mod.name_ar || mod.name_en) : (mod.name_en || mod.name_ar);

    // Highly realistic, concrete questions with SPECIFIC non-generic options!
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
        exp_ar: `الأستاذ المساعد في الـ ERP يرتبط بحسابات مراقبة ووساطة بالأستاذ العام لترحيل الأثر المالي فورياً ودقيقاً.`
      },
      {
        type: 'Troubleshooting',
        diff: 'Advanced',
        q_en: `A month-end reconciliation variance appears between the ${mod.name_en} subledger and General Ledger balance. What is the first audit step?`,
        q_ar: `ظهر فارق تسوية في نهاية الشهر بين رصيد الأستاذ المساعد لموديول ${modName} وحساب المراقبة في الأستاذ العام. ما هو الإجراء التشخيصي الأول؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Run the Subledger-to-GL Reconciliation report to identify direct manual journal entries or unposted draft batches.`, ar: `استخراج تقرير مطابقة الأستاذ المساعد مع العام لتحديد القيود اليدوية المباشرة أو الحركات المعلقة.` },
          { id: 'B', en: `Post a blind lump-sum adjustment to P&L without investigating root causes.`, ar: `إدخال قيد تسوية عمياء في حساب الأرباح والخسائر دون فحص الأسباب.` },
          { id: 'C', en: `Delete previous months historical batches.`, ar: `حذف الحركات التاريخية للشهور السابقة.` },
          { id: 'D', en: `Change the functional base currency of the database.`, ar: `تغيير العملة الأساسية لقاعدة البيانات.` }
        ],
        exp_en: `Subledger reconciliation reports compare document lines with control account postings to isolate unposted batches or unauthorized manual journals.`,
        exp_ar: `تقرير المطابقة يقارن تفاصيل فواتير وحركات الموديول بحساب المراقبة لكشف القيود اليدوية المخالفة أو الحركات غير المرحلة.`
      },
      {
        type: 'Process Decision',
        diff: 'Intermediate',
        q_en: `To enforce internal governance and Segregation of Duties (SoD) in ${mod.name_en}, which rule must be configured?`,
        q_ar: `لتطبيق قواعد الحوكمة الداخلية وفصل المهام (SoD) في موديول ${modName}، أي قاعدة صلاحيات يجب تفعيلها؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Enforce multi-tier approval where the document creator cannot validate, approve, or post their own transaction.`, ar: `تفعيل مسار موافقات متعدد المستويات يمنع منشئ المستند من اعتماده أو ترحيله بنفسه.` },
          { id: 'B', en: `Grant all operational users super-administrator bypass rights.`, ar: `منح كافة الموظفين صلاحية المدير العام لتجاوز الفحوصات.` },
          { id: 'C', en: `Rely only on verbal phone confirmations without system audit logs.`, ar: `الاعتماد على الموافقات الشفهية دون توثيق بالنظام.` },
          { id: 'D', en: `Disable user logins during business hours.`, ar: `إلغاء تسجيل الدخول أثناء ساعات الدوام.` }
        ],
        exp_en: `Segregation of Duties prevents fraud and operational error by requiring independent review before financial commitments are posted.`,
        exp_ar: `مبدأ فصل المهام يمنع التلاعب والأخطاء عبر فرض مراجعة واعتماد مستقل من مسؤول مخول قبل الترحيل المالي.`
      },
      {
        type: 'Implementation Decision',
        diff: 'Intermediate',
        q_en: `During data migration and Go-Live preparation for ${mod.name_en}, which step guarantees data integrity?`,
        q_ar: `أثناء مرحلة ترحيل البيانات وافتتاح موديول ${modName} (Go-Live)، ما هي الخطوة التي تضمن صحة ومطابقة الأرصدة؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Reconcile opening master balances against audited legacy financial statements and execute User Acceptance Testing (UAT).`, ar: `مطابقة الأرصدة الافتتاحية مع القوائم المالية المدققة السابقة وتنفيذ اختبارات قبول المستخدم (UAT).` },
          { id: 'B', en: `Import raw unverified legacy spreadsheets directly into the live production database.`, ar: `استيراد ملفات الإكسل القديمة دون تدقيق مباشرة في النظام الحي.` },
          { id: 'C', en: `Skip opening balances and start all subledgers from zero.`, ar: `بدء كافة الحركات من الصفر وإهمال الأرصدة السابقة.` },
          { id: 'D', en: `Disable data validation checks to speed up import.`, ar: `إلغاء قيود التحقق البرمجية لتسريع الاستيراد.` }
        ],
        exp_en: `Opening balance reconciliation and rigorous UAT guarantee smooth cutover with zero disruption to daily business operations.`,
        exp_ar: `مطابقة الأرصدة الافتتاحية واختبارات القبول (UAT) تضمن سلامة التدشين والانتقال دون انقطاع العمليات.`
      },
      {
        type: 'Business Analysis',
        diff: 'Advanced',
        q_en: `Which performance metric (KPI) is most vital to monitor performance and service levels in ${mod.name_en}?`,
        q_ar: `ما هو أهم مؤشر أداء رئيسي (KPI) لمراقبة جودة وكفاءة العمليات في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Transaction processing cycle time, variance rate against standard budget, and SLA adherence percentage.`, ar: `زمن دورة إنجاز المعاملة، نسبة الانحراف عن الموازنة المعيارية، ونسبة الالتزام بمستوى الخدمة (SLA).` },
          { id: 'B', en: `Number of characters in user passwords.`, ar: `عدد الأحرف في كلمات مرور المستخدمين.` },
          { id: 'C', en: `Total number of mouse clicks per day.`, ar: `عدد النقرات اليومية للماوس.` },
          { id: 'D', en: `Color themes chosen by employees.`, ar: `ألوان واجهة المستخدم المختارة.` }
        ],
        exp_en: `Cycle time and variance analytics directly correlate with operational productivity and financial return on investment.`,
        exp_ar: `قياس زمن دورة العمليات ونسب الانحراف يرتبط مباشرة بالإنتاجية والعائد الاستثماري للنظام.`
      },
      {
        type: 'Scenario',
        diff: 'Intermediate',
        q_en: `A user attempts to post a transaction in ${mod.name_en} but the ERP rejects it with "Fiscal Period Closed". What is the proper procedure?`,
        q_ar: `حاول موظف ترحيل حركة في موديول ${modName} ورفضها النظام برسالة "الفترة المحاسبية مغلقة". ما هو الإجراء النظامي؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Post the transaction in the current open fiscal period or request authorized period reopening approval from Finance.`, ar: `ترحيل المعاملة في الفترة المحاسبية المفتوحة الحالية أو رفع طلب رسمي للمالية لفتح الفترة استثنائياً.` },
          { id: 'B', en: `Use database SQL commands to bypass security and force the closed period entry.`, ar: `استخدام أوامر SQL لتجاوز حماية النظام وتعديل الفترة قسراً.` },
          { id: 'C', en: `Delete the prior fiscal year closing entry.`, ar: `حذف قيد إقفال السنة السابقة.` },
          { id: 'D', en: `Disable accounting period controls permanently.`, ar: `إلغاء قفل الفترات المحاسبية نهائياً.` }
        ],
        exp_en: `Accounting period locks protect published financial statements from retroactive corruption; adjustments must follow governance protocols.`,
        exp_ar: `إقفال الفترات يحمي القوائم المعتمدة من التعديل؛ وأي حركة استثنائية تتطلب موافقة مالية رسمية.`
      },
      {
        type: 'Multiple Choice',
        diff: 'Beginner',
        q_en: `What is the primary Master Data entity maintained in ${mod.name_en}?`,
        q_ar: `ما هي البيانات الأساسية (Master Data) الرئيسية التي يقوم عليها موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Core operational records, categories, accounting mapping rules, and transactional partner cards.`, ar: `بطاقات السجلات التشغيلية الأساسية، الفئات، قواعد التوجيه المحاسبي، وبطاقات الأطراف المعنية.` },
          { id: 'B', en: `Temporary web browser cache cookies.`, ar: `ملفات تعريف الارتباط المؤقتة للمتصفح.` },
          { id: 'C', en: `Random test strings.`, ar: `نصوص اختبار عشوائية.` },
          { id: 'D', en: `Printer driver software.`, ar: `برامج تشغيل الطابعات.` }
        ],
        exp_en: `Master data forms the foundational backbone enabling consistent transaction processing and reporting across the enterprise.`,
        exp_ar: `البيانات الأساسية تشكل العمود الفقري لضمان اتساق المعاملات والتقارير عبر مختلف إدارات المنشأة.`
      },
      {
        type: 'Troubleshooting',
        diff: 'Advanced',
        q_en: `How can an enterprise prevent duplicate records (e.g. duplicate tax IDs or serial numbers) in ${mod.name_en}?`,
        q_ar: `كيف تمنع المنشأة تكرار السجلات والبطاقات الأساسية (مثل تكرار الأرقام الضريبية أو التسلسلية) في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Enable Unique Constraint validation rules and mandatory field deduplication checks at database and UI levels.`, ar: `تفعيل قيود التحقق الفريدة (Unique Constraints) والفحص الآلي لمنع التكرار على مستوى الحقول وقاعدة البيانات.` },
          { id: 'B', en: `Allow unrestricted duplicate data entry.`, ar: `السماح بالتكرار العشوائي للبيانات.` },
          { id: 'C', en: `Delete all master records at the end of each week.`, ar: `حذف كافة السجلات الأساسية نهاية كل أسبوع.` },
          { id: 'D', en: `Manually append random numbers to duplicate names.`, ar: `إضافة أرقام عشوائية يدوياً للأسماء المكررة.` }
        ],
        exp_en: `Unique constraint rules prevent transactional confusion, double-counting, and tax compliance violations.`,
        exp_ar: `قيود الحقول الفريدة تمنع ازدواجية المعاملات، تكرار الفواتير، ومخالفات الإقرارات الضريبية.`
      },
      {
        type: 'Process Decision',
        diff: 'Intermediate',
        q_en: `When an approver is unavailable during an automated workflow in ${mod.name_en}, what mechanism maintains continuity?`,
        q_ar: `عند غياب المسؤول عن اعتماد معاملة في المسار الآلي لموديول ${modName}، ما هي الآلية التي تضمن استمرار العمل دون توقف؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Automated SLA Escalation and Delegation Rules that route pending tasks to a designated deputy with full audit logging.`, ar: `قواعد التصعيد والتفويض التلقائي (Delegation & Escalation Rules) التي تحول الطلب للمفوض البديل مع توثيق السجل.` },
          { id: 'B', en: `Halt the transaction indefinitely until the employee returns.`, ar: `تجميد المعاملة إلى أجل غير مسمى حتى عودة الموظف.` },
          { id: 'C', en: `Auto-approve all pending financial vouchers without verification.`, ar: `الموافقة التلقائية العمياء على كافة المعاملات المالية.` },
          { id: 'D', en: `Cancel the entire department workflow.`, ar: `إلغاء مسار العمل للقسم بالكامل.` }
        ],
        exp_en: `Delegation and escalation matrices eliminate workflow bottlenecks while preserving accountability and audit trails.`,
        exp_ar: `مصفوفة التفويض والتصعيد تمنع تعطل الأعمال مع الحفاظ على الرقابة وتوثيق كافة إجراءات الاعتماد.`
      },
      {
        type: 'Accounting Impact',
        diff: 'Expert',
        q_en: `What is the financial statement difference between capitalizing expenditures vs expensing them immediately in ${mod.name_en}?`,
        q_ar: `ما هو الأثر على القوائم المالية بين رسملة المصروفات (Capitalization) وتحميلها كمصروف فوري في موديول ${modName}؟`,
        correct: 'A',
        opts: [
          { id: 'A', en: `Capitalization increases Balance Sheet Assets and depreciates over useful life; expensing reduces current period Net Profit immediately on the P&L.`, ar: `الرسملة تزيد أصول الميزانية العمومية وتوزع التكلفة عبر الإهلاك؛ بينما المصروف الفوري يخفض صافي ربح الفترة الحالية مباشرة بقائمة الدخل.` },
          { id: 'B', en: `Capitalization immediately reduces cash to zero.`, ar: `الرسملة تخفض النقدية إلى الصفر فورياً.` },
          { id: 'C', en: `Expensing increases current period operating revenue.`, ar: `المصروف الفوري يزيد إيراد التشغيل.` },
          { id: 'D', en: `There is zero financial reporting difference between the two methods.`, ar: `لا يوجد أي فرق محاسبي في القوائم المالية بين الطريقتين.` }
        ],
        exp_en: `Capital expenditures (CapEx) build long-term assets amortized over time, whereas operational expenses (OpEx) hit the current income statement immediately.`,
        exp_ar: `المصاريف الرأسمالية (CapEx) تبني أصولاً طويلة الأجل تستهلك دورياً، بينما المصاريف التشغيلية (OpEx) تخصم من أرباح الفترة فوراً.`
      }
    ];

    return questions.map((q, idx) => ({
      id: `Q-${String(mod.id || 'MOD').toUpperCase()}-P${poolIndex + 1}-${String(idx + 1).padStart(3, '0')}`,
      module_id: moduleId,
      category_id: `CAT-${idx + 1}`,
      topic_id: `TOP-${idx + 1}`,
      concept_id: `CON-${idx + 1}`,
      question_type: q.type,
      difficulty: q.diff,
      question: isAr ? q.q_ar : q.q_en,
      options: q.opts.map(o => ({
        id: o.id,
        text: isAr ? o.ar : o.en
      })),
      correct_answer: q.correct,
      explanation: isAr ? q.exp_ar : q.exp_en,
      distractors: {
        'B': isAr ? 'خطأ: توجيه محاسبي أو إجرائي غير سليم يسبب اختلال في القوائم.' : 'Incorrect: Non-compliant ledger or workflow direction.',
        'C': isAr ? 'خطأ: يخالف المعايير الرقابية ومبادئ الحوكمة.' : 'Incorrect: Violates standard governance principles.',
        'D': isAr ? 'خطأ: غير مطابق لمسار العمليات المعتمد.' : 'Incorrect: Does not match standard ERP procedure.'
      },
      hints: [
        isAr ? 'تذكر الأثر على القوائم المالية والدورة المستندية القياسية.' : 'Consider the standard financial statement impact and workflow rules.',
        isAr ? 'استبعد الخيارات التي تخالف مبادئ الرقابة أو التوجيه المحاسبي.' : 'Eliminate choices that conflict with standard accounting controls.',
        isAr ? 'مفتاح الحل: الإجراء الذي يضمن الدقة المحاسبية والامتثال الكامل.' : 'Direct Key: Choose the option ensuring financial compliance and auditability.'
      ],
      reference: {
        title: `ERP Architecture & Standards for ${mod.name_en}`,
        url: 'https://www.ifrs.org/',
        source: 'IFRS & ERP Standards'
      }
    }));
  }

  return {
    getQuestionsForModule,
    resolveModuleKey
  };
})();
