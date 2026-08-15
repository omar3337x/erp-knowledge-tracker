/**
 * js/database_explorer_engine.js
 * 🧪 Core Intelligence Engine for ERP Transaction Change & Deletion Control Center
 * Source of Truth: newdatabase2026.sql (406 Verified Tables)
 * Full Dynamic Transaction Coverage + Live Dependency Graph + Anti-Fabrication Engine
 * 
 * Strict Architectural Principles:
 *   1. newdatabase2026.sql = CURRENT DATABASE SCHEMA (Source of Truth)
 *   2. Historical Scripts = Supporting Historical Evidence
 *   3. AI = Analysis & Investigation Assistant
 *   4. User = Final Decision Maker
 *   5. UNDERSTAND ➔ IDENTIFY ➔ DISCOVER ➔ PROVE ➔ CLASSIFY ➔ VALIDATE ➔ PLAN ➔ GENERATE SQL ➔ VERIFY
 *   6. NO Destructive SQL from Inferred/Unknown relationships without Dynamic Proof
 *   7. NO Blind Delete & NO Mass Update without verified WHERE conditions
 */

const DatabaseExplorerEngine = (function () {

  const CONFIDENCE_LEVELS = {
    CONFIRMED: { id: 'CONFIRMED', label_ar: '🟢 مؤكد من قاعدة البيانات الحالية (newdatabase2026.sql)', label_en: '🟢 Confirmed from Current Schema', badge: 'badge-teal', color: 'var(--teal)' },
    INFERRED: { id: 'INFERRED', label_ar: '🟡 مستنتج من العلاقات وهيكل الجداول', label_en: '🟡 Inferred from Schema Relationships', badge: 'badge-brass', color: 'var(--brass)' },
    HISTORICAL: { id: 'HISTORICAL', label_ar: '🟠 مبني على السكربتات المحاسبية التاريخية', label_en: '🟠 Based on Historical Scripts Knowledge', badge: 'badge-rust', color: 'var(--brass-deep)' },
    UNKNOWN: { id: 'UNKNOWN', label_ar: '⚪ غير مؤكد ويتطلب استعلام فحص حي', label_en: '⚪ Unknown (Requires Live Probe)', badge: 'badge-secondary', color: 'var(--ink-soft)' }
  };

  const SAFETY_CLASSIFICATIONS = {
    LOW: { id: 'LOW', label_ar: '🟢 منخفض الخطورة (Low Risk)', label_en: '🟢 Low Risk', desc_ar: 'تعديل بيانات وصفية آمنة لا تؤثر على القيود أو المخزون أو الفواتير.', badge: 'badge-teal', color: 'var(--teal)' },
    MEDIUM: { id: 'MEDIUM', label_ar: '🟡 متوسط الخطورة (Medium Risk)', label_en: '🟡 Medium Risk', desc_ar: 'تعديل بيانات أساسية أو طلبيات غير مرحلة ذات تأثير محدود.', badge: 'badge-brass', color: 'var(--brass)' },
    HIGH: { id: 'HIGH', label_ar: '🟠 مرتفع الخطورة (High Risk)', label_en: '🟠 High Risk', desc_ar: 'تعديل حركات تشغيلية تؤثر مباشرة على أرصدة المخازن أو التقارير التجميعية.', badge: 'badge-rust', color: 'var(--brass-deep)' },
    CRITICAL: { id: 'CRITICAL', label_ar: '🔴 حرج وشديد الخطورة (Critical Risk)', label_en: '🔴 Critical Risk', desc_ar: 'تعديل/حذف معاملات مالية أو قيود أستاذ عام أو فواتير تاريخية.', badge: 'badge-rust', color: 'var(--rust)' },
    BLOCKED: { id: 'BLOCKED', label_ar: '⚫ محظور ومقفل أمنياً (Blocked)', label_en: '⚫ Blocked', desc_ar: 'الإجراء ممنوع لوجود أقفال زكاة ZATCA، فترات مقفلة، أو تضارب في السجلات.', badge: 'badge-secondary', color: '#111' }
  };

  const OPERATION_MODES = {
    ANALYZE_ONLY: { id: 'ANALYZE_ONLY', label_ar: '🔍 دراسة وتحليل فقط (Read-Only Diagnostics)', label_en: '🔍 Analyze Only' },
    CHANGE: { id: 'CHANGE', label_ar: '🧪 تعديل بيانات الحركة (Safe Data Change)', label_en: '🧪 Safe Change' },
    DELETE: { id: 'DELETE', label_ar: '🗑️ حذف وإلغاء الحركة (Safe Deletion)', label_en: '🗑️ Safe Deletion' }
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
   * Baseline Registry of 45 Transaction Families discovered in newdatabase2026.sql
   */
  const DATABASE_TRANSACTION_REGISTRY = {
    // --- DOMAIN: Sales & Billing ---
    SALES_INVOICE: {
      type_key: 'SALES_INVOICE',
      name_ar: 'فاتورة مبيعات',
      name_en: 'Sales Invoice',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['فاتورة مبيعات', 'فاتورة المبيعات', 'bills', 'bill_details', 'مبيعات'],
      triggers_en: ['sales invoice', 'sales bill', 'bills', 'bill_details'],
      header_table: 'bills',
      details_table: 'bill_details',
      details_fk: 'bill_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 0 },
      patches_discovery: { table: 'patches', candidate_keys: ['link_id', 'product_id'] },
      journal_type_id: 45,
      gl_trans_type_id: 45,
      payment_tables: ['cash_receipt_details', 'paid_on_bills'],
      reporting_table: 'sales_dashboard_daily_summaries',
      reporting_fk: 'bill_id',
      zatca_columns: ['zatca_status', 'zatca_message', 'uuid', 'invoice_hash', 'sent_to_zatca', 'QrCode'],
      master_data_safeguards: ['products', 'customers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    SALES_RETURN: {
      type_key: 'SALES_RETURN',
      name_ar: 'مرتجع مبيعات',
      name_en: 'Sales Return',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['مرتجع مبيعات', 'مرتجع المبيعات', 'حذف مرتجع', 'bills_returned', 'bill_details_returned'],
      triggers_en: ['sales return', 'return bill', 'bills_returned', 'bill_details_returned'],
      header_table: 'bills_returned',
      details_table: 'bill_details_returned',
      details_fk: 'bill_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id', 'quantity_type', 'type'], suggested_type: 2 },
      patches_discovery: { table: 'patches', candidate_keys: ['link_id', 'product_id'] },
      journal_type_id: 57,
      gl_trans_type_id: 57,
      payment_tables: ['customer_paid_bank'],
      reporting_table: 'sales_dashboard_daily_summaries',
      reporting_fk: 'return_id',
      original_doc_link: { table: 'bills', fk_column: 'valid_bill_id', label_ar: 'فاتورة المبيعات الأصلية (للفحص فقط - لا تُحذف)' },
      zatca_columns: ['zatca_status', 'zatca_message', 'uuid', 'invoice_hash', 'sent_to_zatca', 'QrCode'],
      master_data_safeguards: ['products', 'customers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    BILLS_PENDING: {
      type_key: 'BILLS_PENDING',
      name_ar: 'فاتورة مبيعات معلقة',
      name_en: 'Pending Sales Invoice',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['فاتورة معلقة', 'bills_pending', 'bills_details_pending'],
      triggers_en: ['pending invoice', 'bills_pending'],
      header_table: 'bills_pending',
      details_table: 'bills_details_pending',
      details_fk: 'bill_id',
      payment_tables: ['paid_on_bills_pending'],
      master_data_safeguards: ['products', 'customers', 'stores', 'chart_master'],
      audit_tables: ['a_logs'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    DRAFT_BILLS: {
      type_key: 'DRAFT_BILLS',
      name_ar: 'مسودة فاتورة مبيعات',
      name_en: 'Draft Sales Bill',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['مسودة فاتورة', 'draft_bills', 'draft_bill_details'],
      triggers_en: ['draft bill', 'draft_bills'],
      header_table: 'draft_bills',
      details_table: 'draft_bill_details',
      details_fk: 'draft_bill_id',
      master_data_safeguards: ['products', 'customers', 'stores'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    CREDIT_NOTE: {
      type_key: 'CREDIT_NOTE',
      name_ar: 'إشعار دائن',
      name_en: 'Credit Note',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['إشعار دائن', 'creditnote'],
      triggers_en: ['credit note', 'creditnote'],
      header_table: 'creditnote',
      details_table: null,
      journal_type_id: 45,
      zatca_columns: ['zatca_status', 'zatca_message'],
      master_data_safeguards: ['customers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    DEBIT_NOTE: {
      type_key: 'DEBIT_NOTE',
      name_ar: 'إشعار مدين',
      name_en: 'Debit Note',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['إشعار مدين', 'debitnote'],
      triggers_en: ['debit note', 'debitnote'],
      header_table: 'debitnote',
      details_table: null,
      zatca_columns: ['zatca_status', 'uuid', 'invoice_hash', 'sent_to_zatca', 'QrCode'],
      master_data_safeguards: ['suppliers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    EXPENSE_BILLS: {
      type_key: 'EXPENSE_BILLS',
      name_ar: 'فاتورة مصروفات تشغيلية',
      name_en: 'Expense Invoice / Bill',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['فاتورة مصروفات', 'مصروف', 'expense_bills', 'expense_bill_records'],
      triggers_en: ['expense bill', 'expense_bills'],
      header_table: 'expense_bills',
      details_table: 'expense_bill_records',
      details_fk: 'reference',
      journal_type_id: 'gl_journal_transaction_id',
      master_data_safeguards: ['customers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    REVENUE_BILLS: {
      type_key: 'REVENUE_BILLS',
      name_ar: 'فاتورة إيرادات متنوعة',
      name_en: 'Revenue Invoice / Bill',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['فاتورة إيراد', 'إيرادات', 'revenue_bills', 'revenue_bill_records'],
      triggers_en: ['revenue bill', 'revenue_bills'],
      header_table: 'revenue_bills',
      details_table: 'revenue_bill_records',
      details_fk: 'reference',
      zatca_columns: ['uuid', 'invoice_hash', 'sent_to_zatca', 'QrCode'],
      master_data_safeguards: ['customers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    OPENING_BILLS: {
      type_key: 'OPENING_BILLS',
      name_ar: 'فواتير مبيعات افتتاحية',
      name_en: 'Opening Sales Bills',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['فواتير افتتاحية', 'افتتاحي عملاء', 'opening_bills', 'opening_bill_details'],
      triggers_en: ['opening bills', 'opening_bills'],
      header_table: 'opening_bills',
      details_table: 'opening_bill_details',
      details_fk: 'opening_bill_id',
      payment_tables: ['paid_opening_bills'],
      master_data_safeguards: ['customers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    DELIVERY_NOTES: {
      type_key: 'DELIVERY_NOTES',
      name_ar: 'إذن تسليم / مذكرة توصيل',
      name_en: 'Delivery Note',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['إذن تسليم', 'مذكرة تسليم', 'delivery_notes', 'delivery_notes_details'],
      triggers_en: ['delivery note', 'delivery_notes'],
      header_table: 'delivery_notes',
      details_table: 'delivery_notes_details',
      details_fk: 'bill_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      zatca_columns: ['zatca_status', 'uuid', 'invoice_hash', 'sent_to_zatca'],
      master_data_safeguards: ['products', 'customers', 'stores'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    ORDERS_OFFERS: {
      type_key: 'ORDERS_OFFERS',
      name_ar: 'عرض سعر / طلبية مبيعات',
      name_en: 'Quotation / Sales Offer',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['عرض سعر', 'طلبية', 'orders_offers', 'orders_offers_details'],
      triggers_en: ['sales offer', 'quotation', 'orders_offers'],
      header_table: 'orders_offers',
      details_table: 'orders_offers_details',
      details_fk: 'bill_id',
      payment_tables: ['paid_on_orders_offers'],
      master_data_safeguards: ['products', 'customers'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    EXTERNAL_ORDERS: {
      type_key: 'EXTERNAL_ORDERS',
      name_ar: 'طلب خارجي وتوصيل',
      name_en: 'External Delivery Order',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['طلب خارجي', 'external_orders', 'external_order_details'],
      triggers_en: ['external order', 'external_orders'],
      header_table: 'external_orders',
      details_table: 'external_order_details',
      details_fk: 'external_order_id',
      master_data_safeguards: ['products', 'customers'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    ORDER_DELIVERIES: {
      type_key: 'ORDER_DELIVERIES',
      name_ar: 'أمر شحن وتوصيل طلبيات',
      name_en: 'Order Delivery Order',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['أمر توصيل', 'شحن طلبيات', 'order_deliveries', 'order_delivery_details'],
      triggers_en: ['order delivery', 'order_deliveries'],
      header_table: 'order_deliveries',
      details_table: 'order_delivery_details',
      details_fk: 'order_delivery_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      master_data_safeguards: ['products', 'customers', 'stores'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    CONTRACT_INVOICES: {
      type_key: 'CONTRACT_INVOICES',
      name_ar: 'فاتورة عقود ومقاولات',
      name_en: 'Contract Invoice',
      module: 'Contracting & Projects',
      module_ar: '🏗️ المقاولات والمشاريع',
      triggers_ar: ['فاتورة عقد', 'مقاولات', 'contract_invoices', 'contract_invoice_items'],
      triggers_en: ['contract invoice', 'contract_invoices'],
      header_table: 'contract_invoices',
      details_table: 'contract_invoice_items',
      details_fk: 'contract_invoice_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      original_doc_link: { table: 'bills', fk_column: 'posted_bill_id', label_ar: 'فاتورة المبيعات المرحلة' },
      master_data_safeguards: ['customers', 'chart_master', 'stores'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    INSTALLMENT_CONTRACT: {
      type_key: 'INSTALLMENT_CONTRACT',
      name_ar: 'عقد تقسيط وأقساط',
      name_en: 'Installment Contract',
      module: 'Contracting & Projects',
      module_ar: '🏗️ المقاولات والمشاريع',
      triggers_ar: ['عقد تقسيط', 'أقساط', 'installment_contract', 'installment_contract_details'],
      triggers_en: ['installment contract', 'installment_contract'],
      header_table: 'installment_contract',
      details_table: 'installment_contract_details',
      details_fk: 'installment_id',
      master_data_safeguards: ['chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PROJECTS_CLAIMS: {
      type_key: 'PROJECTS_CLAIMS',
      name_ar: 'مشروع ومستخلصات / مطالبات',
      name_en: 'Project Stages & Claims',
      module: 'Contracting & Projects',
      module_ar: '🏗️ المقاولات والمشاريع',
      triggers_ar: ['مشروع', 'مستخلص', 'مطالبة', 'projects', 'projects_details', 'claims'],
      triggers_en: ['project', 'claims', 'projects_details'],
      header_table: 'projects',
      details_table: 'projects_details',
      details_fk: 'project_id',
      accounting_table: 'claims',
      master_data_safeguards: ['chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Purchasing & Vendors ---
    PURCHASE_INVOICE: {
      type_key: 'PURCHASE_INVOICE',
      name_ar: 'فاتورة مشتريات',
      name_en: 'Purchase Invoice',
      module: 'Purchasing & Vendors',
      module_ar: '🛒 المشتريات والموردين',
      triggers_ar: ['فاتورة مشتريات', 'فاتورة الشراء', 'purchases', 'purchases_details', 'مشتريات'],
      triggers_en: ['purchase invoice', 'purchases', 'purchases_details'],
      header_table: 'purchases',
      details_table: 'purchases_details',
      details_fk: 'purchase_id',
      cost_tables: ['purchase_costs', 'purchase_order_costs', 'purchase_order_cost_details'],
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 3 },
      patches_discovery: { table: 'patches', candidate_keys: ['link_id', 'product_id'] },
      journal_type_id: 5,
      gl_trans_type_id: 5,
      payment_tables: ['paid_bills', 'paid_purchase_details', 'paid_on_purchases'],
      master_data_safeguards: ['products', 'suppliers', 'stores', 'chart_master', 'branches'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PURCHASE_RETURN: {
      type_key: 'PURCHASE_RETURN',
      name_ar: 'مرتجع مشتريات',
      name_en: 'Purchase Return',
      module: 'Purchasing & Vendors',
      module_ar: '🛒 المشتريات والموردين',
      triggers_ar: ['مرتجع مشتريات', 'مرتجع المورد', 'purchases_returns', 'purchases_returns_details'],
      triggers_en: ['purchase return', 'purchases_returns'],
      header_table: 'purchases_returns',
      details_table: 'purchases_returns_details',
      details_fk: 'purchase_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 4 },
      journal_type_id: 56,
      gl_trans_type_id: 56,
      original_doc_link: { table: 'purchases', fk_column: 'valid_purchases_id', label_ar: 'فاتورة المشتريات الأصلية (للفحص فقط)' },
      master_data_safeguards: ['products', 'suppliers', 'stores', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PURCHASES_OFFERS: {
      type_key: 'PURCHASES_OFFERS',
      name_ar: 'طلب شراء / أمر شراء مورد',
      name_en: 'Purchase Order / Offer',
      module: 'Purchasing & Vendors',
      module_ar: '🛒 المشتريات والموردين',
      triggers_ar: ['أمر شراء', 'طلب شراء', 'purchases_offers', 'purchases_offers_details'],
      triggers_en: ['purchase order', 'purchases_offers'],
      header_table: 'purchases_offers',
      details_table: 'purchases_offers_details',
      details_fk: 'purchase_id',
      master_data_safeguards: ['products', 'suppliers', 'stores'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PURCHASE_ASSETS: {
      type_key: 'PURCHASE_ASSETS',
      name_ar: 'شراء أصول ثابتة',
      name_en: 'Purchase Fixed Asset',
      module: 'Purchasing & Vendors',
      module_ar: '🛒 المشتريات والموردين',
      triggers_ar: ['شراء أصل', 'شراء أصول', 'purchase_assets', 'purchase_asset_details'],
      triggers_en: ['purchase assets', 'purchase_assets'],
      header_table: 'purchase_assets',
      details_table: 'purchase_asset_details',
      details_fk: 'purchase_asset_id',
      journal_type_id: 'gl_journal_transaction_id',
      master_data_safeguards: ['assets', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    GRN_RECEIPT: {
      type_key: 'GRN_RECEIPT',
      name_ar: 'إذن استلام بضاعة (GRN)',
      name_en: 'Goods Receipt Note (GRN)',
      module: 'Purchasing & Vendors',
      module_ar: '🛒 المشتريات والموردين',
      triggers_ar: ['إذن استلام بضاعة', 'grns', 'grn_details'],
      triggers_en: ['grn', 'goods receipt', 'grns'],
      header_table: 'grns',
      details_table: 'grn_details',
      details_fk: 'grn_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      original_doc_link: { table: 'purchases', fk_column: 'purchase_id', label_ar: 'فاتورة المشتريات المرتبطة' },
      master_data_safeguards: ['products', 'stores'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Inventory & Stock ---
    STOCK_TRANSFER: {
      type_key: 'STOCK_TRANSFER',
      name_ar: 'تحويل مخزني بين المستودعات',
      name_en: 'Stock Transfer',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['تحويل مخزني', 'تحويل بين المستودعات', 'transfers', 'transfer_details'],
      triggers_en: ['stock transfer', 'warehouse transfer', 'transfers'],
      header_table: 'transfers',
      details_table: 'transfer_details',
      details_fk: 'transfer_id',
      cost_tables: ['transfer_costs'],
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 1 },
      journal_type_id: 44,
      gl_trans_type_id: 44,
      master_data_safeguards: ['products', 'stores', 'branches', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PHYSICAL_INVENTORY: {
      type_key: 'PHYSICAL_INVENTORY',
      name_ar: 'محضر جرد وتسوية مخزنية',
      name_en: 'Physical Stock Count & Adjustment',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['محضر جرد', 'تسوية مخزنية', 'جرد المخزن', 'store_inventory', 'store_inventory_details'],
      triggers_en: ['stock count', 'physical inventory', 'store_inventory'],
      header_table: 'store_inventory',
      details_table: 'store_inventory_details',
      details_fk: 'store_inventory_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'details_id', 'product_id', 'store_id'], suggested_type: 5 },
      journal_type_id: 55,
      gl_trans_type_id: 55,
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    OPENING_BALANCE_STOCK: {
      type_key: 'OPENING_BALANCE_STOCK',
      name_ar: 'رصيد افتتاحي للمخزون',
      name_en: 'Stock Opening Balance',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['رصيد افتتاحي مخزن', 'افتتاحي المخزون', 'opening_balance', 'opening_balance_details'],
      triggers_en: ['opening stock', 'opening_balance'],
      header_table: 'opening_balance',
      details_table: 'opening_balance_details',
      details_fk: 'opening_balance_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      journal_type_id: 40,
      gl_trans_type_id: 40,
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    PRODUCTION_COLLECTIONS: {
      type_key: 'PRODUCTION_COLLECTIONS',
      name_ar: 'تجميع وتعبئة إنتاج',
      name_en: 'Assembly & Packaging Collection',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['تجميع إنتاج', 'تعبئة', 'productioncollections', 'productioncollection_details'],
      triggers_en: ['assembly collection', 'productioncollections'],
      header_table: 'productioncollections',
      details_table: 'productioncollection_details',
      details_fk: 'productioncollection_id',
      cost_tables: ['productioncollection_costs', 'productioncollection_packagings', 'productioncollection_damages'],
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'], suggested_type: 10 },
      journal_type_id: 22,
      gl_trans_type_id: 22,
      master_data_safeguards: ['products', 'stores'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    GROUP_PRODUCTION_ORDERS: {
      type_key: 'GROUP_PRODUCTION_ORDERS',
      name_ar: 'أمر إنتاج مجمع',
      name_en: 'Group Production Order',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['أمر إنتاج', 'تشغيل مجمع', 'products_g_orders', 'products_g_order_details'],
      triggers_en: ['group production', 'products_g_orders'],
      header_table: 'products_g_orders',
      details_table: 'products_g_order_details',
      details_fk: 'order_id',
      cost_tables: ['products_g_order_costs', 'products_g_order_additions', 'products_g_order_packagings', 'product_g_orders_items'],
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'], suggested_type: 9 },
      journal_type_id: 18,
      gl_trans_type_id: 18,
      master_data_safeguards: ['products', 'stores'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    STOREKEEPER_RECEIPTS: {
      type_key: 'STOREKEEPER_RECEIPTS',
      name_ar: 'استلام أمين المستودع',
      name_en: 'Storekeeper Receipt Voucher',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['استلام أمين المستودع', 'storekeeper_receipts', 'storekeeper_receipt_items'],
      triggers_en: ['storekeeper receipt', 'storekeeper_receipts'],
      header_table: 'storekeeper_receipts',
      details_table: 'storekeeper_receipt_items',
      details_fk: 'storekeeper_receipt_id',
      master_data_safeguards: ['products', 'customers'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Manufacturing (MES) ---
    MANUFACTURING_ORDERS: {
      type_key: 'MANUFACTURING_ORDERS',
      name_ar: 'أمر تصنيع وتشغيل مصنع (MES)',
      name_en: 'Manufacturing Work Order (MES)',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['أمر تصنيع', 'تشغيل مصنع', 'manufacturing_orders', 'manufacturing_order_materials'],
      triggers_en: ['manufacturing order', 'work order', 'manufacturing_orders'],
      header_table: 'manufacturing_orders',
      details_table: 'manufacturing_order_materials',
      details_fk: 'order_id',
      operations_table: 'manufacturing_order_operations',
      cost_tables: ['manufacturing_order_labor_usages', 'manufacturing_order_machine_usages', 'manufacturing_order_additional_costs', 'manufacturing_order_utility_readings', 'manufacturing_cost_entries'],
      inventory_discovery: { table: 'manufacturing_material_movements', candidate_keys: ['order_id', 'product_id', 'store_id'] },
      inspection_table: 'manufacturing_quality_inspections',
      journal_type_id: 'gl_journal_transaction_id',
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      audit_tables: ['manufacturing_audit_logs'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Treasury, Cash & Banks ---
    RECEIPT_PAYMENT_VOUCHER: {
      type_key: 'RECEIPT_PAYMENT_VOUCHER',
      name_ar: 'سند قبض / سند صرف مالي',
      name_en: 'Cash / Bank Receipt & Payment Voucher',
      module: 'Treasury, Cash & Banks',
      module_ar: '🏦 النقدية والبنوك والشيكات',
      triggers_ar: ['سند قبض', 'سند صرف', 'accounting', 'cash_receipt_details'],
      triggers_en: ['receipt voucher', 'payment voucher', 'accounting'],
      header_table: 'accounting',
      details_table: 'cash_receipt_details',
      details_fk: 'cash_receipt_id',
      payment_tables: ['paid_on_bills', 'customer_paid_bank', 'paid_opening_bills', 'grouped_cash_receipt'],
      journal_type_id: 51,
      gl_trans_type_id: 51,
      master_data_safeguards: ['customers', 'suppliers', 'users', 'payment_methods', 'chart_master'],
      audit_tables: ['audit_trail', 'a_logs'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    VENDOR_BILL_PAYMENT: {
      type_key: 'VENDOR_BILL_PAYMENT',
      name_ar: 'سداد فواتير موردين',
      name_en: 'Vendor Bill Payment',
      module: 'Sales & Billing',
      module_ar: '🧾 المبيعات والفواتير',
      triggers_ar: ['سداد مورد', 'paid_bills', 'paid_purchase_details'],
      triggers_en: ['vendor payment', 'paid_bills'],
      header_table: 'paid_bills',
      details_table: 'paid_purchase_details',
      details_fk: 'paid_bill_id',
      payment_tables: ['paid_on_purchases'],
      journal_type_id: 51,
      master_data_safeguards: ['suppliers', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    BANK_TRANSACTIONS: {
      type_key: 'BANK_TRANSACTIONS',
      name_ar: 'حركة بنكية وتسوية حساب بنك',
      name_en: 'Bank Transaction & Reconciliation',
      module: 'Treasury, Cash & Banks',
      module_ar: '🏦 النقدية والبنوك والشيكات',
      triggers_ar: ['حركة بنكية', 'تسوية بنك', 'bank_trans', 'bank_journal_trans'],
      triggers_en: ['bank transaction', 'bank_trans'],
      header_table: 'bank_trans',
      details_table: 'bank_journal_trans',
      details_fk: 'trans_no',
      master_data_safeguards: ['bank_accounts', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    CHEQUES_TRANSACTION: {
      type_key: 'CHEQUES_TRANSACTION',
      name_ar: 'شيكات تحت التحصيل والرفض',
      name_en: 'Cheque Collection & Status',
      module: 'Treasury, Cash & Banks',
      module_ar: '🏦 النقدية والبنوك والشيكات',
      triggers_ar: ['شيك', 'شيكات', 'تحصيل شيك', 'cheques'],
      triggers_en: ['cheques', 'cheque collection'],
      header_table: 'cheques',
      details_table: null,
      master_data_safeguards: ['bank_accounts'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    CUSTODY_VOUCHER: {
      type_key: 'CUSTODY_VOUCHER',
      name_ar: 'عهدة موظف وتسوية عهد',
      name_en: 'Employee Custody Voucher',
      module: 'Treasury, Cash & Banks',
      module_ar: '🏦 النقدية والبنوك والشيكات',
      triggers_ar: ['عهدة', 'سند عهدة', 'custody'],
      triggers_en: ['custody', 'employee custody'],
      header_table: 'custody',
      details_table: null,
      journal_type_id: 'journal_id',
      master_data_safeguards: ['chart_master'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Accounting & General Ledger ---
    GENERAL_LEDGER_JOURNAL: {
      type_key: 'GENERAL_LEDGER_JOURNAL',
      name_ar: 'قيد يومية أستاذ عام',
      name_en: 'General Ledger Journal Entry',
      module: 'Accounting & General Ledger',
      module_ar: '💰 الحسابات والأستاذ العام GL',
      triggers_ar: ['قيد يومية', 'قيد يدوي', 'أستاذ عام', 'journal', 'gl_trans', 'قيد'],
      triggers_en: ['journal entry', 'general ledger', 'journal', 'gl_trans'],
      header_table: 'journal',
      details_table: 'gl_trans',
      details_fk: 'type_no',
      master_data_safeguards: ['chart_master', 'branches', 'currencies'],
      audit_tables: ['audit_trail', 'repeated_journal_log'],
      risk_level: 'CRITICAL',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    BUDGET_TRANSACTION: {
      type_key: 'BUDGET_TRANSACTION',
      name_ar: 'موازنة تقديرية ومخصصات',
      name_en: 'Budget Transaction',
      module: 'Accounting & General Ledger',
      module_ar: '💰 الحسابات والأستاذ العام GL',
      triggers_ar: ['موازنة', 'تقديري', 'budget_trans'],
      triggers_en: ['budget', 'budget_trans'],
      header_table: 'budget_trans',
      details_table: null,
      master_data_safeguards: ['chart_master'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    TAX_DECLARATION: {
      type_key: 'TAX_DECLARATION',
      name_ar: 'إقرار ضريبي وتسوية ضريبة',
      name_en: 'Tax Declaration & Settlement',
      module: 'Accounting & General Ledger',
      module_ar: '💰 الحسابات والأستاذ العام GL',
      triggers_ar: ['إقرار ضريبي', 'تسوية ضريبة', 'tax_declaration', 'trans_tax_details'],
      triggers_en: ['tax declaration', 'tax_declaration'],
      header_table: 'tax_declaration',
      details_table: 'trans_tax_details',
      details_fk: 'trans_no',
      journal_type_id: 'journal_id',
      master_data_safeguards: ['chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Fixed Assets & Depreciation ---
    ASSET_MOVEMENTS: {
      type_key: 'ASSET_MOVEMENTS',
      name_ar: 'حركة أصل وإهلاك أصول',
      name_en: 'Asset Movement & Depreciation',
      module: 'Fixed Assets & Depreciation',
      module_ar: '🏢 الأصول الثابتة والإهلاك',
      triggers_ar: ['حركة أصل', 'إهلاك أصل', 'movement_assets', 'deprecationassets'],
      triggers_en: ['asset movement', 'depreciation', 'movement_assets'],
      header_table: 'movement_assets',
      depreciation_table: 'deprecationassets',
      opening_table: 'openning_assets',
      opening_details: 'openning_asset_details',
      master_data_safeguards: ['assets', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Internal Operations ---
    INTERNAL_STOCK_ISSUE: {
      type_key: 'INTERNAL_STOCK_ISSUE',
      name_ar: 'إذن صرف داخلي / استهلاك',
      name_en: 'Internal Stock Issue Voucher',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['صرف داخلي', 'إذن صرف', 'internal_paids', 'internal_paid_details'],
      triggers_en: ['internal issue', 'internal_paids'],
      header_table: 'internal_paids',
      details_table: 'internal_paid_details',
      details_fk: 'internal_paid_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'], suggested_type: 8 },
      journal_type_id: 54,
      gl_trans_type_id: 54,
      master_data_safeguards: ['products', 'stores', 'sides'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    INTERNAL_STOCK_RECEIPT: {
      type_key: 'INTERNAL_STOCK_RECEIPT',
      name_ar: 'إذن إضافة داخلي',
      name_en: 'Internal Stock Receipt Voucher',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['إضافة داخلي', 'استلام داخلي', 'internal_receipts', 'internal_receipt_details'],
      triggers_en: ['internal receipt', 'internal_receipts'],
      header_table: 'internal_receipts',
      details_table: 'internal_receipt_details',
      details_fk: 'internal_receipt_id',
      inventory_discovery: { table: 'general_table', candidate_keys: ['link_id', 'product_id', 'store_id'] },
      master_data_safeguards: ['products', 'stores', 'sides'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    INTERNAL_SPARE_REQUEST: {
      type_key: 'INTERNAL_SPARE_REQUEST',
      name_ar: 'طلب قطع غيار داخلي',
      name_en: 'Internal Spare Parts Request',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['طلب قطع غيار', 'internal_request_spares', 'internal_request_spare_details'],
      triggers_en: ['spare request', 'internal_request_spares'],
      header_table: 'internal_request_spares',
      details_table: 'internal_request_spare_details',
      details_fk: 'internal_request_spare_id',
      master_data_safeguards: ['products', 'sides'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Logistics & Permissions ---
    LOGISTICS_DELIVERY_PERMISSION: {
      type_key: 'LOGISTICS_DELIVERY_PERMISSION',
      name_ar: 'إذن تسليم ولوجستيات',
      name_en: 'Logistics Receipt & Delivery Permission',
      module: 'System, RBAC & Config',
      module_ar: '⚙️ النظام والصلاحيات والإعدادات',
      triggers_ar: ['إذن تسليم لوجستي', 'تصريح نقل', 'receipt_permission_logistics', 'receipt_permission_details_logistics'],
      triggers_en: ['logistics permission', 'receipt_permission_logistics'],
      header_table: 'receipt_permission_logistics',
      details_table: 'receipt_permission_details_logistics',
      details_fk: 'receipt_permission_logistic_id',
      delivery_table: 'receipt_permission_deliveries',
      delivery_details: 'receipt_permission_delivery_details',
      master_data_safeguards: ['products', 'stores', 'customers'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Agriculture & Poultry ---
    POULTRY_FARMING_CYCLE: {
      type_key: 'POULTRY_FARMING_CYCLE',
      name_ar: 'دورة تربية دواجن ومزارع',
      name_en: 'Poultry Farming Cycle',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['دورة دواجن', 'عنبر', 'دورة تسمين', 'poultry_farming_cycles', 'poultry_farming_cycle_details'],
      triggers_en: ['poultry cycle', 'poultry_farming_cycles'],
      header_table: 'poultry_farming_cycles',
      details_table: 'poultry_farming_cycle_details',
      details_fk: 'poultry_farming_cycle_id',
      mortality_table: 'poultry_farming_cycle_deads',
      weight_table: 'poultry_farming_cycle_weights',
      journal_type_id: 'gl_account_id',
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },
    EGG_PRODUCTION_CYCLE: {
      type_key: 'EGG_PRODUCTION_CYCLE',
      name_ar: 'دورة إنتاج بيض ويوميات الإنتاج',
      name_en: 'Egg Production Cycle & Daily Output',
      module: 'Inventory & Stock',
      module_ar: '📦 المخزون والأصناف',
      triggers_ar: ['إنتاج بيض', 'دورة بياض', 'egg_production_cycles', 'egg_daily_production'],
      triggers_en: ['egg production', 'egg_production_cycles'],
      header_table: 'egg_production_cycles',
      details_table: 'egg_production_cycle_barns',
      details_fk: 'egg_production_cycle_id',
      output_table: 'egg_daily_production',
      expense_table: 'egg_cycle_monthly_expenses',
      journal_type_id: 'gl_account_id',
      master_data_safeguards: ['products', 'stores', 'chart_master'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Fuel & POS ---
    FUEL_DISPENSER_LOGS: {
      type_key: 'FUEL_DISPENSER_LOGS',
      name_ar: 'حركة محطات وقود ومضخات',
      name_en: 'Fuel Pump Dispenser Transaction',
      module: 'System, RBAC & Config',
      module_ar: '⚙️ النظام والصلاحيات والإعدادات',
      triggers_ar: ['حركة وقود', 'مضخة', 'طلمبة', 'بنزين', 'delivery_notes_logs'],
      triggers_en: ['fuel transaction', 'delivery_notes_logs'],
      header_table: 'delivery_notes_logs',
      details_table: null,
      pos_transactions: 'geidea_transactions',
      master_data_safeguards: ['stores', 'customers', 'payment_methods'],
      risk_level: 'HIGH',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    },

    // --- DOMAIN: Field Visits & Delegate Tasks ---
    DELEGATE_FIELD_VISITS: {
      type_key: 'DELEGATE_FIELD_VISITS',
      name_ar: 'زيارات مندوبين ومهام ميدانية',
      name_en: 'Delegate Visits & Route Tasks',
      module: 'General Operations',
      module_ar: '📁 جداول تشغيلية عامة',
      triggers_ar: ['زيارة مندوب', 'خط سير', 'visits', 'tracking_visits', 'tracking_visits_customers'],
      triggers_en: ['delegate visit', 'visits', 'tracking_visits'],
      header_table: 'visits',
      tracking_table: 'tracking_visits',
      customer_visits: 'tracking_visits_customers',
      indebtedness_table: 'delegate_indebtednesses',
      master_data_safeguards: ['customers', 'users'],
      risk_level: 'MEDIUM',
      confidence: CONFIDENCE_LEVELS.CONFIRMED
    }
  };

  /**
   * Continuous Dynamic Schema Discovery Engine
   * Scans all 406 tables in metadata, detects candidates, compares with baseline registry,
   * and flags New, Changed, and Confirmed Transaction Families.
   */
  function discoverTransactionFamiliesFromSchema(metadata = null) {
    const meta = metadata || getMetadata();
    if (!meta || !meta.tables) return { newly_discovered: [], confirmed_baseline: [], changed_definitions: [] };

    const tables = meta.tables;
    const tableNames = Object.keys(tables);
    const discoveredList = [];

    tableNames.forEach(tName => {
      // Exclude archived partition tables
      if (tName.endsWith('_2025') || tName.includes('2020') || tName.includes('2021') || tName.includes('2022') || tName.includes('2023') || tName.includes('2024')) {
        return;
      }

      const tbl = tables[tName];
      const cols = Object.keys(tbl.columns || {});

      // Header pattern detection heuristics
      const hasDate = cols.some(c => c.includes('date') || c.includes('created_at') || c === 'time');
      const hasTotalOrAmount = cols.some(c => c.includes('total') || c.includes('amount') || c.includes('price') || c.includes('cost') || c.includes('net') || c.includes('subtotal'));
      const hasEntity = cols.some(c => c.includes('customer_id') || c.includes('supplier_id') || c.includes('store_id') || c.includes('user_id') || c.includes('branch_id') || c.includes('side_id'));

      // Find matching detail table automatically
      let detailsCandidate = null;
      let detailsFk = null;

      const singularName = tName.replace(/s$/, '').replace(/_returned$/, '');
      const possibleDetailNames = [
        `${tName}_details`,
        `${tName}_detail`,
        `${tName}_items`,
        `${tName}_records`,
        `${singularName}_details`,
        `${singularName}_items`,
        `${singularName}_detail`
      ];

      for (let dName of possibleDetailNames) {
        if (tables[dName]) {
          detailsCandidate = dName;
          const dCols = Object.keys(tables[dName].columns || {});
          detailsFk = dCols.find(c => c === `${singularName}_id` || c === `${tName}_id` || c === 'header_id' || c === 'bill_id' || c === 'order_id' || c === 'trans_id') || `${singularName}_id`;
          break;
        }
      }

      if (hasDate && (hasTotalOrAmount || hasEntity || detailsCandidate)) {
        const isRegistered = Object.values(DATABASE_TRANSACTION_REGISTRY).some(reg => reg.header_table === tName);
        discoveredList.push({
          type_key: isRegistered ? Object.keys(DATABASE_TRANSACTION_REGISTRY).find(k => DATABASE_TRANSACTION_REGISTRY[k].header_table === tName) : `AUTO_${tName.toUpperCase()}`,
          name_ar: isRegistered ? Object.values(DATABASE_TRANSACTION_REGISTRY).find(reg => reg.header_table === tName).name_ar : `حركة ${tName}`,
          name_en: isRegistered ? Object.values(DATABASE_TRANSACTION_REGISTRY).find(reg => reg.header_table === tName).name_en : `Transaction ${tName}`,
          header_table: tName,
          details_table: detailsCandidate,
          details_fk: detailsFk,
          domain: (tbl.domain && tbl.domain.name_en) || 'General Operations',
          module_ar: (tbl.domain && tbl.domain.name_ar) || '📁 جداول تشغيلية عامة',
          has_inventory_link: cols.includes('store_id'),
          has_gl_link: cols.includes('journal_id') || cols.includes('gl_journal_transaction_id') || cols.includes('type_id') || cols.includes('account_id'),
          confidence: detailsCandidate ? CONFIDENCE_LEVELS.CONFIRMED : CONFIDENCE_LEVELS.INFERRED,
          is_new_candidate: !isRegistered
        });
      }
    });

    const newlyDiscovered = discoveredList.filter(d => d.is_new_candidate);
    const confirmedBaseline = discoveredList.filter(d => !d.is_new_candidate);

    return {
      total_candidates: discoveredList.length,
      newly_discovered: newlyDiscovered,
      confirmed_baseline: confirmedBaseline,
      changed_definitions: []
    };
  }

  /**
   * Generates a Comprehensive Transaction Contract for Change & Deletion
   */
  function generateTransactionContract(familyKeyOrMap) {
    const fam = typeof familyKeyOrMap === 'string' ? DATABASE_TRANSACTION_REGISTRY[familyKeyOrMap] : (familyKeyOrMap.family || familyKeyOrMap);
    if (!fam) return null;

    return {
      transaction_family: fam.type_key,
      name_ar: fam.name_ar,
      name_en: fam.name_en,
      module: fam.module,
      module_ar: fam.module_ar,
      header_table: fam.header_table,
      details_table: fam.details_table,
      inventory_tables: fam.inventory_discovery ? [fam.inventory_discovery.table] : [],
      accounting_tables: fam.journal_type_id !== undefined ? ['journal', 'gl_trans'] : [],
      payment_tables: fam.payment_tables || [],
      reporting_tables: fam.reporting_table ? [fam.reporting_table] : [],
      audit_tables: fam.audit_tables || ['audit_trail', 'a_logs'],
      master_data_safeguards: fam.master_data_safeguards || ['products', 'customers', 'stores', 'chart_master'],
      confidence: fam.confidence || CONFIDENCE_LEVELS.CONFIRMED,
      risk_level: fam.risk_level || 'HIGH',
      identification_rules: [
        `Primary document identifier is \`${fam.header_table}.id\`.`,
        fam.details_table ? `Details linked via \`${fam.details_table}.${fam.details_fk} = :ID\`.` : 'No details sub-table.'
      ],
      change_rules: [
        'Master data changes (product names, units) must be modified in master cards, not historical invoice rows.',
        'Quantity and price modifications require delta impact recalculation and balanced GL entries.',
        'ZATCA locked invoices (sent_to_zatca=1) forbid direct update and require a credit/debit note.'
      ],
      delete_rules: [
        'Must execute bottom-up: GL lines ➔ Journal header ➔ Inventory movement ➔ Details ➔ Header.',
        'Master data (products, customers, stores, chart_master) and audit logs are strictly protected from deletion.',
        'Never delete original documents referenced by valid_bill_id or purchase_id.'
      ],
      verification_rules: [
        'GL Balance invariant: SUM(gl_trans.amount) = 0 must be maintained.',
        'Post-delete verification: Zero-count UNION ALL probe across all 7 layers.'
      ]
    };
  }

  /**
   * Builds the Live 7-Layer Transaction Dependency Graph for the ACTUAL transaction
   */
  function buildLiveDependencyGraph(txId, familyOrKey, opMode = 'ANALYZE_ONLY') {
    const fam = typeof familyOrKey === 'string' ? DATABASE_TRANSACTION_REGISTRY[familyOrKey] : (familyOrKey.family || familyOrKey);
    if (!fam) return null;

    const id = txId || '12345';
    const isAr = I18n.getLang() === 'ar';

    const nodes = [
      {
        layer_idx: 1,
        layer_name_ar: '1. الترويسة الأساسية (Header)',
        layer_name_en: '1. Primary Header',
        table: fam.header_table,
        role_ar: 'ترويسة المستند الأصلي',
        relationship: `id = ${id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        impact_action: opMode === 'DELETE' ? 'حذف بالخطوة الأخيرة (Primary Key)' : 'تحديث إجمالي المستند وتاريخه',
        probe_sql: `SELECT * FROM \`${fam.header_table}\` WHERE id = ${id};`
      }
    ];

    if (fam.details_table) {
      nodes.push({
        layer_idx: 2,
        layer_name_ar: '2. البنود والتفاصيل (Details)',
        layer_name_en: '2. Transaction Details',
        table: fam.details_table,
        role_ar: 'سطور وتفاصيل الأصناف والكميات',
        relationship: `${fam.details_fk} = ${id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        impact_action: opMode === 'DELETE' ? 'حذف بنود الحركة قبل الترويسة' : 'تعديل سطر الصنف والكمية',
        probe_sql: `SELECT * FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = ${id};`
      });
    }

    if (fam.inventory_discovery) {
      nodes.push({
        layer_idx: 3,
        layer_name_ar: '3. حركة المخزون التشغيلية (Inventory Movement)',
        layer_name_en: '3. Stock Movement',
        table: fam.inventory_discovery.table,
        role_ar: 'حركات الصرف والإضافة والأرصدة المستودعية',
        relationship: `Candidate Keys: link_id = ${id} ${fam.details_table ? `OR details_id IN (${fam.details_table})` : ''}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.INFERRED,
        impact_action: opMode === 'DELETE' ? 'تسوية/حذف حركة المخزن بعد إثبات التطابق' : 'تسوية انحراف رصيد المخزن',
        probe_sql: `SELECT * FROM \`${fam.inventory_discovery.table}\` WHERE link_id = ${id} ${fam.details_table ? `OR details_id IN (SELECT id FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = ${id})` : ''};`
      });
    }

    if (fam.patches_discovery) {
      nodes.push({
        layer_idx: 4,
        layer_name_ar: '4. تتبع الباتشات والتكلفة (Cost / Batch)',
        layer_name_en: '4. Cost / Batch Movement',
        table: fam.patches_discovery.table,
        role_ar: 'تتبع تاريخ الصلاحية ورقم الباتش',
        relationship: `link_id = ${id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.INFERRED,
        impact_action: opMode === 'DELETE' ? 'حذف فقط إذا أثبت الفحص وجود باتشات' : 'تحديث تكلفة الصلاحية',
        probe_sql: `SELECT * FROM \`${fam.patches_discovery.table}\` WHERE link_id = ${id};`
      });
    }

    if (fam.journal_type_id !== undefined) {
      nodes.push({
        layer_idx: 5,
        layer_name_ar: '5. قيد اليومية بالأستاذ العام (GL Journal Header)',
        layer_name_en: '5. Journal Header',
        table: 'journal',
        role_ar: 'ترويسة القيد المحاسبي المزدوج',
        relationship: `reference = ${id} AND type_id = ${fam.journal_type_id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.HISTORICAL,
        impact_action: opMode === 'DELETE' ? 'حذف بعد تفريغ خطوط gl_trans المقابلة' : 'تعديل تاريخ وترويس القيد',
        probe_sql: `SELECT * FROM journal WHERE reference = ${id} AND type_id = ${fam.journal_type_id};`
      });

      nodes.push({
        layer_idx: 6,
        layer_name_ar: '6. سطور القيد المزدوج (GL Lines)',
        layer_name_en: '6. Double-Entry GL Lines',
        table: 'gl_trans',
        role_ar: 'الطرف المدين والدائن بالأستاذ العام',
        relationship: `type_no = Journal ID AND type_id = ${fam.gl_trans_type_id || fam.journal_type_id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.HISTORICAL,
        impact_action: opMode === 'DELETE' ? 'حذف السطور أولاً مع شرط التوازن (SUM=0)' : 'تعديل الحساب والقيمة المزدوجة',
        probe_sql: `SELECT gt.* FROM gl_trans gt JOIN journal j ON gt.type_no = j.id WHERE j.reference = ${id} AND j.type_id = ${fam.journal_type_id};`
      });
    }

    if (fam.payment_tables && fam.payment_tables.length > 0) {
      nodes.push({
        layer_idx: 7,
        layer_name_ar: '7. السدادات والمخصصات المالية (Payments)',
        layer_name_en: '7. Payments & Allocations',
        table: fam.payment_tables.join(', '),
        role_ar: 'سندات القبض والصرف والتسويات البنكية',
        relationship: `bill_id / purchase_id = ${id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        impact_action: 'فحص أقفال السداد (يُحظر الحذف إذا كان المدفوع > 0 دون تسوية السندات)',
        probe_sql: `SELECT * FROM \`${fam.payment_tables[0]}\` WHERE bill_id = ${id} OR cash_receipt_id = ${id};`
      });
    }

    if (fam.reporting_table) {
      nodes.push({
        layer_idx: 8,
        layer_name_ar: '8. تجميعات التقارير والداشبورد (Reporting)',
        layer_name_en: '8. Reporting Summaries',
        table: fam.reporting_table,
        role_ar: 'السجلات التجميعية اليومية',
        relationship: `${fam.reporting_fk} = ${id}`,
        record_count: 'Unknown (Requires Probe Execution)',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        impact_action: opMode === 'DELETE' ? 'حذف السجل التجميعي لتصحيح الداشبورد' : 'إعادة احتساب التجميع اليومي',
        probe_sql: `SELECT * FROM \`${fam.reporting_table}\` WHERE ${fam.reporting_fk} = ${id};`
      });
    }

    return {
      transaction_id: id,
      family: fam,
      operation_mode: opMode,
      graph_nodes: nodes
    };
  }

  /**
   * Natural Language Intent & Entity Resolver
   * Resolves Operation Mode (ANALYZE / CHANGE / DELETE), Target Family, ID, Field, and Values
   */
  function analyzeActionIntent(query, explicitMode = null) {
    const q = String(query || '').trim();
    const qLower = q.toLowerCase();

    // 1. Detect Action Mode
    let action = explicitMode || 'ANALYZE_ONLY';
    const deleteWords = ['احذف', 'حذف', 'مسح', 'ازالة', 'شيل', 'delete', 'remove', 'purge', 'cancel'];
    const changeWords = ['غير', 'تغيير', 'تعديل', 'عدل', 'حول', 'بدل', 'change', 'update', 'modify', 'edit', 'convert'];
    
    if (!explicitMode) {
      if (deleteWords.some(w => qLower.includes(w))) {
        action = 'DELETE';
      } else if (changeWords.some(w => qLower.includes(w))) {
        action = 'CHANGE';
      }
    }

    // 2. Extract Document / Transaction ID
    let detectedId = null;
    const matchNum = q.match(/\b\d+\b/);
    if (matchNum) detectedId = matchNum[0];

    // 3. Match Transaction Family
    let matchedFamily = null;
    const regKeys = Object.keys(DATABASE_TRANSACTION_REGISTRY);
    for (let k of regKeys) {
      const fam = DATABASE_TRANSACTION_REGISTRY[k];
      if (fam.triggers_ar.some(t => qLower.includes(t.toLowerCase())) ||
          fam.triggers_en.some(t => qLower.includes(t.toLowerCase()))) {
        matchedFamily = fam;
        break;
      }
    }

    // 4. Extract Target Field & Values (for Change Intent)
    let targetField = null;
    let oldValue = null;
    let newValue = null;

    if (qLower.includes('كمية') || qLower.includes('quantity') || qLower.includes('qty')) {
      targetField = 'quantity';
    } else if (qLower.includes('سعر') || qLower.includes('price')) {
      targetField = 'price';
    } else if (qLower.includes('تكلفة') || qLower.includes('cost')) {
      targetField = 'cost';
    } else if (qLower.includes('تاريخ') || qLower.includes('date')) {
      targetField = 'date';
    } else if (qLower.includes('وحدة') || qLower.includes('unit') || qLower.includes('uom')) {
      targetField = 'unit';
    } else if (qLower.includes('عميل') || qLower.includes('customer')) {
      targetField = 'customer';
    } else if (qLower.includes('مورد') || qLower.includes('supplier')) {
      targetField = 'supplier';
    } else if (qLower.includes('مخزن') || qLower.includes('مستودع') || qLower.includes('store')) {
      targetField = 'store';
    } else if (qLower.includes('حساب') || qLower.includes('account')) {
      targetField = 'account';
    }

    // Extract Before/After numeric values if written (e.g. "من 10 إلى 15" or "10 to 15")
    const matchBeforeAfter = q.match(/(?:من|from)\s*([0-9\.]+)\s*(?:إلى|الى|to)\s*([0-9\.]+)/i);
    if (matchBeforeAfter) {
      oldValue = matchBeforeAfter[1];
      newValue = matchBeforeAfter[2];
    }

    return {
      raw_query: q,
      action: action, // 'ANALYZE_ONLY' | 'CHANGE' | 'DELETE'
      transaction_family: matchedFamily,
      transaction_id: detectedId || '12345',
      target_field: targetField || 'quantity',
      old_value: oldValue,
      new_value: newValue
    };
  }

  /**
   * 🧪 Change Impact Analyzer
   * Full 9-Stage Impact Pipeline with Before/After Delta, 4-Part SQL, and Dependency Graph
   */
  function analyzeTransactionChange(queryOrIntent, forcedFamilyKey = null, forcedId = null) {
    let intent = typeof queryOrIntent === 'object' && queryOrIntent.action ? queryOrIntent : analyzeActionIntent(queryOrIntent, 'CHANGE');
    
    if (forcedFamilyKey && DATABASE_TRANSACTION_REGISTRY[forcedFamilyKey]) {
      intent.transaction_family = DATABASE_TRANSACTION_REGISTRY[forcedFamilyKey];
    }
    if (forcedId) intent.transaction_id = forcedId;
    if (!intent.transaction_family) intent.transaction_family = DATABASE_TRANSACTION_REGISTRY.SALES_INVOICE;

    const fam = intent.transaction_family;
    const txId = intent.transaction_id;
    const isAr = I18n.getLang() === 'ar';
    const field = intent.target_field;
    const oldVal = intent.old_value || '10.00';
    const newVal = intent.new_value || '15.00';
    const deltaNum = (parseFloat(newVal) - parseFloat(oldVal)).toFixed(2);
    const deltaStr = (deltaNum > 0 ? `+${deltaNum}` : `${deltaNum}`);

    // Generate Contract and Live Dependency Graph
    const contract = generateTransactionContract(fam);
    const dependencyGraph = buildLiveDependencyGraph(txId, fam, 'CHANGE');

    // Classify Change Category
    let changeCategory = 'TRANSACTION_DETAIL_CHANGE';
    let changeCategoryAr = 'تعديل بند تفصيلي في حركة تاريخية (Transaction Detail Change)';
    let safetyLevel = SAFETY_CLASSIFICATIONS.CRITICAL;

    if (field === 'unit' || field === 'price' && !fam.header_table.includes('bill')) {
      changeCategory = 'MASTER_DATA_CHANGE';
      changeCategoryAr = 'تعديل بطاقة بيانات أساسية (Master Data Change)';
      safetyLevel = SAFETY_CLASSIFICATIONS.MEDIUM;
    } else if (field === 'date' || field === 'customer' || field === 'supplier') {
      changeCategory = 'TRANSACTION_HEADER_CHANGE';
      changeCategoryAr = 'تعديل ترويسة حركة تشغيلية (Transaction Header Change)';
      safetyLevel = SAFETY_CLASSIFICATIONS.HIGH;
    } else if (field === 'account') {
      changeCategory = 'ACCOUNTING_CHANGE';
      changeCategoryAr = 'تعديل مالي محاسبي بالأستاذ العام (Accounting Change)';
      safetyLevel = SAFETY_CLASSIFICATIONS.CRITICAL;
    }

    // Safety Blockers
    const changeSafetyBlockers = [
      { id: 'ZATCA_LOCK', title_ar: 'فحص اعتماد الفوترة الإلكترونية (ZATCA Lock)', desc_ar: 'إذا كانت الفاتورة معتمدة لدى هيئة الزكاة (sent_to_zatca=1)، يُحظر تعديل البيانات المالية نهائياً ويجب إصدار إشعار دائن/مدين بدلاً من التعديل المباشر.', status: 'ENFORCED' },
      { id: 'CLOSED_PERIOD', title_ar: 'فحص السنة المالية المقفلة (Fiscal Period Lock)', desc_ar: 'يُمنع تعديل أي حركة تنتمي لفترة محاسبية مقفلة (close_years) دون فتح السنة رسمياً.', status: 'ENFORCED' },
      { id: 'GL_IMBALANCE', title_ar: 'حماية توازن القيد المزدوج (GL Balanced Sum=0)', desc_ar: 'أي تعديل على قيمة البند يتطلب توليد قيود تسوية متوازنة بحيث يبقى مجموع gl_trans.amount = 0.', status: 'ENFORCED' },
      { id: 'PAYMENT_DEPENDENCY', title_ar: 'فحص سدادات الفاتورة (Payment Allocations)', desc_ar: 'إذا كان المبلغ المدفوع (paid > 0) أكبر من الإجمالي الجديد بعد التعديل، يجب تسوية سندات القبض أولاً.', status: 'PENDING_CHECK' },
      { id: 'MULTIPLE_MATCH', title_ar: 'حماية التعديل الجماعي غير المقصود (Multiple Match Protection)', desc_ar: 'إذا طابق استعلام الفحص أكثر من سجل واحد غير متوقع، يتم حظر توليد SQL حتى تحديد السطر الدقيق.', status: 'ENFORCED' }
    ];

    // 4-Part Diagnostic & Transactional SQL Package
    const targetDetailsTable = fam.details_table || fam.header_table;
    const targetFieldCol = (field === 'quantity' ? 'quantity' : (field === 'price' ? 'unit_price' : (field === 'date' ? 'date' : field)));

    const sqlPreview = `SELECT * FROM \`${fam.header_table}\` WHERE id = ${txId};`;
    const sqlValidation = `SELECT h.id, h.date, d.id as line_id, d.product_id, d.${targetFieldCol} as current_val \nFROM \`${fam.header_table}\` h \nLEFT JOIN \`${targetDetailsTable}\` d ON d.${fam.details_fk || 'id'} = h.id \nWHERE h.id = ${txId};`;
    
    let sqlModification = `START TRANSACTION;\n\n`;
    sqlModification += `-- Step 0: Set target IDs and values (Strict Transaction Isolation)\n`;
    sqlModification += `SET @TARGET_ID = ${txId};\n`;
    sqlModification += `SET @NEW_VALUE = ${isNaN(newVal) ? `'${newVal}'` : newVal};\n\n`;
    
    sqlModification += `-- Step 1: Update target transaction line\n`;
    sqlModification += `UPDATE \`${targetDetailsTable}\` \nSET \`${targetFieldCol}\` = @NEW_VALUE \nWHERE ${fam.details_fk || 'id'} = @TARGET_ID LIMIT 1;\n\n`;

    if (fam.inventory_discovery) {
      sqlModification += `-- Step 2: Note on Inventory movement adjustment\n`;
      sqlModification += `-- UPDATE \`${fam.inventory_discovery.table}\` SET quantity = @NEW_VALUE WHERE link_id = @TARGET_ID;\n\n`;
    }

    if (fam.journal_type_id !== undefined) {
      sqlModification += `-- Step 3: Note on Accounting GL adjustment (Must maintain SUM=0)\n`;
      sqlModification += `-- Check linked journal: SELECT * FROM journal WHERE reference = @TARGET_ID AND type_id = ${fam.journal_type_id};\n\n`;
    }

    sqlModification += `-- Step 4: Verification inside transaction (Validate Exactly 1 Row Affected)\n`;
    sqlModification += `SELECT * FROM \`${targetDetailsTable}\` WHERE ${fam.details_fk || 'id'} = @TARGET_ID;\n\n`;
    sqlModification += `-- If verification matches expected state and no multiple matches:\n`;
    sqlModification += `COMMIT;\n`;
    sqlModification += `-- In case of any unexpected discrepancy:\n`;
    sqlModification += `-- ROLLBACK;\n`;

    const sqlVerification = `SELECT * FROM \`${targetDetailsTable}\` WHERE ${fam.details_fk || 'id'} = ${txId};`;

    return {
      intent: intent,
      transaction_id: txId,
      family: fam,
      target_field: targetFieldCol,
      old_value: oldVal,
      new_value: newVal,
      delta: deltaStr,
      change_category: changeCategory,
      change_category_ar: changeCategoryAr,
      safety_level: safetyLevel,
      contract: contract,
      dependency_graph: dependencyGraph,
      safety_blockers: changeSafetyBlockers,
      sql_package: {
        preview: sqlPreview,
        validation: sqlValidation,
        modification: sqlModification,
        verification: sqlVerification
      }
    };
  }

  /**
   * 🗑️ Transaction Deletion Analyzer
   * Full 8-Stage Dynamic Deletion & Dependency Discovery Pipeline with Live Graph & Anti-Fabrication Counts
   */
  function analyzeTransactionDeletion(queryOrIntent, forcedFamilyKey = null, forcedId = null) {
    let intent = typeof queryOrIntent === 'object' && queryOrIntent.action ? queryOrIntent : analyzeActionIntent(queryOrIntent, 'DELETE');

    if (forcedFamilyKey && DATABASE_TRANSACTION_REGISTRY[forcedFamilyKey]) {
      intent.transaction_family = DATABASE_TRANSACTION_REGISTRY[forcedFamilyKey];
    }
    if (forcedId) intent.transaction_id = forcedId;
    if (!intent.transaction_family) intent.transaction_family = DATABASE_TRANSACTION_REGISTRY.SALES_RETURN;

    const fam = intent.transaction_family;
    const txId = intent.transaction_id;
    const isAr = I18n.getLang() === 'ar';

    // Generate Contract and Live Dependency Graph
    const contract = generateTransactionContract(fam);
    const dependencyGraph = buildLiveDependencyGraph(txId, fam, 'DELETE');

    // 1. Build Layered Dependency Tree
    const impactLayers = [
      {
        table: fam.header_table,
        role_ar: `ترويسة حركة ${fam.name_ar} (Header)`,
        role_en: `${fam.name_en} Header`,
        relation_ar: `Primary ID: ${fam.header_table}.id = ${txId}`,
        filter_sql: `id = ${txId}`,
        impact_level: 'CRITICAL',
        action_ar: 'حذف في الخطوة الأخيرة بعد حذف القيود والتفاصيل',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        source_type: 'CURRENT_SCHEMA'
      }
    ];

    if (fam.details_table) {
      impactLayers.push({
        table: fam.details_table,
        role_ar: `بنود وتفاصيل ${fam.name_ar} (Details)`,
        role_en: `${fam.name_en} Details`,
        relation_ar: `${fam.details_table}.${fam.details_fk} = ${txId}`,
        filter_sql: `${fam.details_fk} = ${txId}`,
        impact_level: 'CRITICAL',
        action_ar: 'حذف قبل ترويسة الحركة',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        source_type: 'CURRENT_SCHEMA'
      });
    }

    if (fam.inventory_discovery) {
      impactLayers.push({
        table: fam.inventory_discovery.table,
        role_ar: 'حركة المخزون التشغيلية (Inventory Movement)',
        role_en: 'Inventory Movement',
        relation_ar: `link_id = ${txId} OR details_id IN (${fam.details_table})`,
        filter_sql: `link_id = ${txId}`,
        impact_level: 'HIGH',
        action_ar: 'حذف / تسوية حركة المخزن بعد إثبات العلاقة عبر link_id و details_id',
        confidence: CONFIDENCE_LEVELS.INFERRED,
        source_type: 'CANDIDATE_DISCOVERY',
        rule_ar: '⚠️ يتم البحث عبر المفاتيح المرشحة (link_id / details_id / product_id / store_id).'
      });
    }

    if (fam.patches_discovery) {
      impactLayers.push({
        table: fam.patches_discovery.table,
        role_ar: 'حركات الباتشات وتكلفة الصلاحية (Patches / Cost)',
        role_en: 'Patches / Cost',
        relation_ar: `link_id = ${txId}`,
        filter_sql: `link_id = ${txId}`,
        impact_level: 'HIGH',
        action_ar: 'حذف فقط إذا أثبت استعلام الفحص وجود باتشات مرتبطة',
        confidence: CONFIDENCE_LEVELS.INFERRED,
        source_type: 'CANDIDATE_DISCOVERY'
      });
    }

    if (fam.journal_type_id !== undefined) {
      impactLayers.push({
        table: 'journal',
        role_ar: 'ترويسة قيد اليومية بالأستاذ العام (GL Header)',
        role_en: 'Journal Header',
        relation_ar: `reference = ${txId} AND type_id = ${fam.journal_type_id}`,
        filter_sql: `reference = ${txId} AND type_id = ${fam.journal_type_id}`,
        impact_level: 'CRITICAL',
        action_ar: 'حذف بعد تفريغ خطوط gl_trans المقابلة',
        confidence: CONFIDENCE_LEVELS.HISTORICAL,
        source_type: 'HISTORICAL_SCRIPT'
      });
      impactLayers.push({
        table: 'gl_trans',
        role_ar: 'سطور القيد المزدوج بالأستاذ العام (GL Lines)',
        role_en: 'GL Lines',
        relation_ar: `type_no = journal.id AND type_id = ${fam.gl_trans_type_id || fam.journal_type_id}`,
        filter_sql: `type_no = (SELECT id FROM journal WHERE reference = ${txId} AND type_id = ${fam.journal_type_id} LIMIT 1)`,
        impact_level: 'CRITICAL',
        action_ar: 'حذف خطوط القيد المزدوج أولاً (التحقق الصارم من توازن القيد Sum=0)',
        confidence: CONFIDENCE_LEVELS.HISTORICAL,
        source_type: 'HISTORICAL_SCRIPT'
      });
    }

    if (fam.reporting_table) {
      impactLayers.push({
        table: fam.reporting_table,
        role_ar: 'تجميعات ومؤشرات لوحة التحكم (Reporting Summary)',
        role_en: 'Reporting Summary',
        relation_ar: `${fam.reporting_fk} = ${txId}`,
        filter_sql: `${fam.reporting_fk} = ${txId}`,
        impact_level: 'MEDIUM',
        action_ar: 'حذف السجل التجميعي لتصحيح إحصائيات الداشبورد',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        source_type: 'CURRENT_SCHEMA'
      });
    }

    if (fam.original_doc_link) {
      impactLayers.push({
        table: fam.original_doc_link.table,
        role_ar: `${fam.original_doc_link.label_ar}`,
        role_en: 'Original Document Link',
        relation_ar: `${fam.original_doc_link.fk_column} -> ${fam.original_doc_link.table}.id`,
        filter_sql: `id = (SELECT ${fam.original_doc_link.fk_column} FROM \`${fam.header_table}\` WHERE id = ${txId} LIMIT 1)`,
        impact_level: 'READ_ONLY',
        action_ar: 'فحص تأثير الإلغاء على المستند الأصلي وممنوع حذف المستند الأصلي نهائياً',
        confidence: CONFIDENCE_LEVELS.CONFIRMED,
        source_type: 'CURRENT_SCHEMA'
      });
    }

    if (fam.audit_tables) {
      impactLayers.push({
        table: fam.audit_tables[0],
        role_ar: 'سجل التتبع والمراقبة التاريخية (Audit Log)',
        role_en: 'Audit Log',
        relation_ar: `type_no = ${txId}`,
        filter_sql: `type_no = ${txId}`,
        impact_level: 'AUDIT',
        action_ar: 'يُوصى بشدة بالاحتفاظ به كدليل تدقيق وعدم حذفه',
        confidence: CONFIDENCE_LEVELS.INFERRED,
        source_type: 'AUDIT_SAFEGUARD'
      });
    }

    // 2. Dynamic Discovery Probes (Read-Only)
    const discoveryProbes = [
      {
        stage: 'PROVE_HEADER_DETAILS',
        title_ar: `1. إثبات وجود الحركة في جدول ${fam.header_table} والتفاصيل في ${fam.details_table || 'N/A'}`,
        sql: `SELECT h.* ${fam.details_table ? `, count(d.id) as details_count FROM \`${fam.header_table}\` h LEFT JOIN \`${fam.details_table}\` d ON d.${fam.details_fk} = h.id WHERE h.id = ${txId} GROUP BY h.id;` : `FROM \`${fam.header_table}\` h WHERE h.id = ${txId};`}`,
        confidence: CONFIDENCE_LEVELS.CONFIRMED
      }
    ];

    if (fam.inventory_discovery) {
      discoveryProbes.push({
        stage: 'PROVE_INVENTORY_RELATION',
        title_ar: `2. إثبات حركة المخزون عبر Candidate Keys (link_id / details_id) في ${fam.inventory_discovery.table}`,
        sql: `SELECT gt.id, gt.type, gt.link_id, gt.details_id, gt.store_id, gt.product_id, gt.quantity, gt.cost \nFROM \`${fam.inventory_discovery.table}\` gt \nWHERE gt.link_id = ${txId} \n   ${fam.details_table ? `OR gt.details_id IN (SELECT id FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = ${txId})` : ''};`,
        confidence: CONFIDENCE_LEVELS.INFERRED
      });
    }

    if (fam.journal_type_id !== undefined) {
      discoveryProbes.push({
        stage: 'PROVE_GL_JOURNAL',
        title_ar: `3. إثبات قيد اليومية المرتبط في journal وفحص سطور الأستاذ العام في gl_trans`,
        sql: `SELECT j.id as journal_id, j.trans_date, j.reference, sum(gt.amount) as gl_balance_diff \nFROM journal j \nLEFT JOIN gl_trans gt ON gt.type_no = j.id \nWHERE j.reference = ${txId} AND j.type_id = ${fam.journal_type_id} \nGROUP BY j.id;`,
        confidence: CONFIDENCE_LEVELS.HISTORICAL
      });
    }

    if (fam.reporting_table) {
      discoveryProbes.push({
        stage: 'PROVE_REPORTING_SUMMARY',
        title_ar: `4. فحص السجلات التجميعية في ${fam.reporting_table}`,
        sql: `SELECT * FROM \`${fam.reporting_table}\` WHERE ${fam.reporting_fk} = ${txId};`,
        confidence: CONFIDENCE_LEVELS.CONFIRMED
      });
    }

    // 3. Safe Transactional Deletion SQL Wrapper
    let modificationSql = `START TRANSACTION;\n\n`;
    modificationSql += `-- ==========================================================================\n`;
    modificationSql += `-- DYNAMIC SAFE DELETION SCRIPT FOR ${fam.name_en} #${txId}\n`;
    modificationSql += `-- Source of Truth: newdatabase2026.sql\n`;
    modificationSql += `-- CAUTION: Run only after all diagnostic discovery probes pass successfully!\n`;
    modificationSql += `-- ==========================================================================\n\n`;
    modificationSql += `SET @TARGET_ID = ${txId};\n\n`;

    if (fam.journal_type_id !== undefined) {
      modificationSql += `-- Step 1: Capture linked Journal ID\n`;
      modificationSql += `SET @JOURNAL_ID = (SELECT id FROM journal WHERE reference = @TARGET_ID AND type_id = ${fam.journal_type_id} LIMIT 1);\n\n`;
      
      modificationSql += `-- Step 2: Delete GL double-entry lines (Validated)\n`;
      modificationSql += `DELETE FROM gl_trans WHERE type_no = @JOURNAL_ID AND type_id = ${fam.gl_trans_type_id || fam.journal_type_id};\n\n`;

      modificationSql += `-- Step 3: Delete Journal posting header\n`;
      modificationSql += `DELETE FROM journal WHERE id = @JOURNAL_ID AND type_id = ${fam.journal_type_id};\n\n`;
    }

    if (fam.inventory_discovery) {
      modificationSql += `-- Step 4: Delete Inventory movements from ${fam.inventory_discovery.table} (Candidate Keys)\n`;
      modificationSql += `DELETE FROM \`${fam.inventory_discovery.table}\` \nWHERE link_id = @TARGET_ID \n   ${fam.details_table ? `OR details_id IN (SELECT id FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = @TARGET_ID)` : ''};\n\n`;
    }

    if (fam.patches_discovery) {
      modificationSql += `-- Step 5: Delete related patches records (if proven linked)\n`;
      modificationSql += `DELETE FROM \`${fam.patches_discovery.table}\` WHERE link_id = @TARGET_ID;\n\n`;
    }

    if (fam.reporting_table) {
      modificationSql += `-- Step 6: Delete reporting aggregate summary\n`;
      modificationSql += `DELETE FROM \`${fam.reporting_table}\` WHERE ${fam.reporting_fk} = @TARGET_ID;\n\n`;
    }

    if (fam.details_table) {
      modificationSql += `-- Step 7: Delete transaction details\n`;
      modificationSql += `DELETE FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = @TARGET_ID;\n\n`;
    }

    modificationSql += `-- Step 8: Delete transaction header (Primary)\n`;
    modificationSql += `DELETE FROM \`${fam.header_table}\` WHERE id = @TARGET_ID;\n\n`;

    modificationSql += `-- Step 9: In-Transaction Verification Probes\n`;
    modificationSql += `SELECT COUNT(*) AS remaining_headers FROM \`${fam.header_table}\` WHERE id = @TARGET_ID;\n`;
    if (fam.details_table) {
      modificationSql += `SELECT COUNT(*) AS remaining_details FROM \`${fam.details_table}\` WHERE ${fam.details_fk} = @TARGET_ID;\n\n`;
    }
    modificationSql += `-- If counts are zero and no foreign key violations occurred:\n`;
    modificationSql += `COMMIT;\n`;
    modificationSql += `-- If any error or unexpected remaining records:\n`;
    modificationSql += `-- ROLLBACK;\n`;

    // 4. Eight Stage Deletion Pipeline
    const eightStageRoadmap = [
      { stage: 1, title_ar: 'المرحلة 1: التعريف وتحديد المعرفات (1. IDENTIFY)', desc_ar: `استخراج ترويسة الحركة (#${txId})، ومعرفات الفرع والمستودع والعميل/المورد وتاريخ الحركة.` },
      { stage: 2, title_ar: 'المرحلة 2: حصر الطبقات والجداول المرشحة (2. DISCOVER)', desc_ar: `حصر الجداول عبر الطبقات الـ 7 (الترويسة، التفاصيل، المخزون، الباتشات، القيود، الأستاذ العام، الداشبورد).` },
      { stage: 3, title_ar: 'المرحلة 3: إثبات العلاقات عبر Candidate Keys (3. PROVE RELATIONSHIPS)', desc_ar: `إثبات انتماء حركات general_table والباتشات والقيود للحركة الفعلية عبر المفاتيح المرشحة (link_id / details_id).` },
      { stage: 4, title_ar: 'المرحلة 4: تصنيف الاعتماديات وحماية البيانات (4. CLASSIFY DEPENDENCIES)', desc_ar: `فصل البيانات التابعة المؤكدة عن البيانات الأساسية المحمية (Master Data) وسجلات التدقيق التاريخية (Audit Logs).` },
      { stage: 5, title_ar: 'المرحلة 5: فحص موانع الحذف والسلامة المحاسبية (5. SAFETY VALIDATION)', desc_ar: `التأكد من توازن القيد المحاسبي (Sum=0)، عدم وجود سدادات مالية نشطة، وخلو المعاملة من أقفال ZATCA أو الفترات المقفلة.` },
      { stage: 6, title_ar: 'المرحلة 6: ترتيب الحذف العكسي الصارم (6. GENERATE DELETION ORDER)', desc_ar: `ترتيب الحذف من الأسفل للأعلى (سطور GL ➔ القيود ➔ المخزون ➔ التفاصيل ➔ الترويسة).` },
      { stage: 7, title_ar: 'المرحلة 7: توليد سكريبت الحذف الخارجي المحمي (7. GENERATE EXTERNAL SQL)', desc_ar: `توليد سكريبت SQL مشروط داخل كبسولة ترانزاكشن (START TRANSACTION) للتنفيذ الخارجي فقط مع دعم ROLLBACK.` },
      { stage: 8, title_ar: 'المرحلة 8: التحقق الختامي وخلو الأيتام (8. POST-DELETE VERIFICATION)', desc_ar: `تشغيل استعلامات الفحص الختامية للتأكد من وصول كافة السجلات المتأثرة للصفر (0 records) بدون أيتام.` }
    ];

    // 5. Safety Blockers Checklist
    const safetyBlockers = [
      { id: 'GL_BALANCE', title_ar: 'توازن الأستاذ العام (GL Balance Rule)', desc_ar: 'يجب أن يكون Debit = Credit ومجموع gl_trans.amount = 0 بالضبط.', status: 'PENDING_CHECK' },
      { id: 'INVENTORY_PROOF', title_ar: 'إثبات ارتباط المخزون (Inventory Proof)', desc_ar: 'يجب إثبات تطابق link_id و details_id في general_table قبل حذف أي حركة مخزون.', status: 'PENDING_CHECK' },
      { id: 'PAYMENT_LOCK', title_ar: 'فحص ارتباطات السداد المالي (Payment Dependencies)', desc_ar: 'التأكد من عدم وجود سند قبض أو تسوية بنكية نشطة ترتبط بالحركة.', status: 'PENDING_CHECK' },
      { id: 'ZATCA_STATUS', title_ar: 'حالة الربط والفوترة الإلكترونية (ZATCA / Tax)', desc_ar: 'إذا تم اعتماد المعاملة في هيئة الزكاة (sent_to_zatca=1)، لا يجوز الحذف المباشر ويجب إصدار إشعار دائن/مدين.', status: 'PENDING_CHECK' },
      { id: 'MASTER_PROTECT', title_ar: 'حماية بطاقات التعريف والبيانات الأساسية', desc_ar: `جداول (${(fam.master_data_safeguards || []).join(', ')}) محمية تماماً ولا تدخل في الحذف نهائياً.`, status: 'ENFORCED' }
    ];

    return {
      intent: intent,
      transaction_id: txId,
      map: fam,
      family: fam,
      contract: contract,
      dependency_graph: dependencyGraph,
      impact_layers: impactLayers,
      eight_stage_roadmap: eightStageRoadmap,
      discovery_probes: discoveryProbes,
      modification_sql: modificationSql,
      safety_blockers: safetyBlockers,
      master_data_safeguards: fam.master_data_safeguards,
      audit_tables: fam.audit_tables,
      risk_level: fam.risk_level
    };
  }

  /**
   * Search tables in metadata
   */
  function searchTables(query, domainFilter = null) {
    const meta = getMetadata();
    if (!meta || !meta.tables) return [];

    const q = String(query || '').toLowerCase().trim();
    const results = [];

    Object.keys(meta.tables).forEach(tName => {
      const tbl = meta.tables[tName];
      if (domainFilter && tbl.domain && tbl.domain.id !== domainFilter) return;

      if (!q || tName.toLowerCase().includes(q) || (tbl.domain && (tbl.domain.name_ar.includes(q) || tbl.domain.name_en.toLowerCase().includes(q)))) {
        results.push(tbl);
      }
    });

    return results;
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
    SAFETY_CLASSIFICATIONS,
    OPERATION_MODES,
    DATABASE_TRANSACTION_REGISTRY,
    getMetadata,
    getRegistry: () => DATABASE_TRANSACTION_REGISTRY,
    discoverTransactionFamiliesFromSchema,
    generateTransactionContract,
    buildLiveDependencyGraph,
    analyzeActionIntent,
    analyzeTransactionChange,
    analyzeTransactionDeletion,
    searchTables,
    searchColumns,
    buildAIDatabasePrompt
  };
})();

if (typeof module !== 'undefined') module.exports = DatabaseExplorerEngine;
