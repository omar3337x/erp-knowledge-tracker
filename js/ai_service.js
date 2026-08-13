/**
 * js/ai_service.js
 * Centralized AI Service & Dynamic Module Context Builder.
 * Integrates directly with existing system callAI backend proxy.
 */

const AIService = (function () {

  const MODULE_PROFILES = {
    'MOD-1': { domain_en: 'Inventory & Warehouse Management', domain_ar: 'إدارة المخزون والمستودعات', key_concepts: ['Product Categories', 'Automated FIFO/AVCO Valuation', 'Stock Adjustments', 'Reordering Rules', 'Lot/Serial Tracking', 'WMS Bins'] },
    'MOD-2': { domain_en: 'Financial Accounting & Controlling', domain_ar: 'الحسابات والمالية والقوائم', key_concepts: ['Chart of Accounts', 'Journal Entries', 'Accounts Receivable & Payable', 'Bank Reconciliation', 'Multi-currency Revaluation', 'Financial Statements', 'Cost Centers'] },
    'MOD-3': { domain_en: 'Plant & Equipment Maintenance', domain_ar: 'الصيانة الفنية والمعدات', key_concepts: ['Equipment Master', 'Preventive Maintenance', 'Work Orders', 'Spare Parts Inventory', 'Maintenance Costs', 'Downtime Tracking'] },
    'MOD-4': { domain_en: 'Fixed Asset Management', domain_ar: 'إدارة الأصول الثابتة والإهلاك', key_concepts: ['Asset Acquisition', 'Depreciation Methods', 'Accumulated Depreciation', 'Asset Transfer', 'Disposal & Scrap Gain/Loss', 'Asset Revaluation'] },
    'MOD-5': { domain_en: 'Fleet & Transportation Management', domain_ar: 'النقليات والأسطول والحركات', key_concepts: ['Vehicle Master', 'Trip Management', 'Driver Allocation', 'Fuel Consumption', 'Vehicle Maintenance', 'Freight Costing'] },
    'MOD-6': { domain_en: 'Human Resources & Payroll', domain_ar: 'الموارد البشرية والرواتب', key_concepts: ['Employee Contracts', 'Attendance & Leaves', 'Payroll Computation', 'Salary Rules', 'Social Security & Taxes', 'End of Service Indemnity'] },
    'MOD-7': { domain_en: 'Real Estate & Property Management', domain_ar: 'إدارة العقارات والتأجير', key_concepts: ['Property Units', 'Lease Contracts', 'Rent Installments', 'Tenant Management', 'Vacancy Tracking', 'Property Expenses'] },
    'MOD-8': { domain_en: 'Contracting & Construction Projects', domain_ar: 'المقاولات وعقود المشاريع', key_concepts: ['WBS Hierarchy', 'BOQ Bill of Quantities', 'Subcontracting', 'Progress Invoicing', 'Retentions', 'Cost Control'] },
    'MOD-9': { domain_en: 'Fuel Stations & Petroleum Retail', domain_ar: 'محطات الوقود والصهاريج', key_concepts: ['Fuel Tanks', 'Dispenser Pumps', 'Shift Reading Reconciliation', 'Tank Calibration', 'Evaporation Fuel Loss', 'Shift Cash Clearance'] },
    'MOD-10': { domain_en: 'Law Firm & Legal Case Management', domain_ar: 'المحاماة والقضايا والعملاء', key_concepts: ['Legal Cases', 'Court Hearings', 'Client Contracts', 'Time Billing', 'Legal Documents', 'Case Expense Tracking'] }
  };

  /**
   * Dynamically builds a privacy-safe, non-sensitive context payload for a module.
   */
  function buildModuleContext(moduleId, categoryId, topicId) {
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const foundMod = modules.find(m => String(m.id).toLowerCase() === String(moduleId || 'MOD-1').toLowerCase()) || modules[0] || { id: 'MOD-1', name_en: 'Inventory', name_ar: 'المخزون' };

    const topics = (State.allTopics || []).filter(t => t.module_id === foundMod.id);
    const gaps = topics.filter(t => t.status !== 'Mastered' && t.status !== 'Practiced');
    const mastered = topics.filter(t => t.status === 'Mastered');

    let categoryObj = null;
    if (categoryId && State.allCategories) {
      categoryObj = State.allCategories.find(c => String(c.id) === String(categoryId));
    }

    let topicObj = null;
    if (topicId && topics.length) {
      topicObj = topics.find(t => String(t.id) === String(topicId));
    }

    const totalTopics = topics.length || 1;
    const masteredRatio = mastered.length / totalTopics;
    let userLevel = 'Beginner';
    if (masteredRatio > 0.75) userLevel = 'Expert';
    else if (masteredRatio > 0.4) userLevel = 'Advanced';
    else if (masteredRatio > 0.15) userLevel = 'Intermediate';

    const profile = MODULE_PROFILES[foundMod.id] || MODULE_PROFILES['MOD-1'];

    return {
      module_id: foundMod.id,
      module_name: I18n.getLang() === 'ar' ? foundMod.name_ar : foundMod.name_en,
      category_id: categoryId || '',
      category_name: categoryObj ? I18n.localizedName(categoryObj) : '',
      topic_id: topicId || '',
      topic_name: topicObj ? topicObj.topic : '',
      domain_profile: I18n.getLang() === 'ar' ? profile.domain_ar : profile.domain_en,
      key_concepts: profile.key_concepts.join(', '),
      total_topics: topics.length,
      mastered_count: mastered.length,
      knowledge_gaps: gaps.map(g => g.topic).slice(0, 5).join('; ') || 'None',
      user_level: userLevel,
      language: I18n.getLang()
    };
  }

  /**
   * Calls backend `askAI` action with built context.
   */
  async function ask(tool, promptText, options = {}) {
    const context = buildModuleContext(options.moduleId, options.categoryId, options.topicId);
    
    try {
      const res = await API.rawCall('askAI', {
        tool: tool,
        prompt: promptText || '',
        context: context,
        language: I18n.getLang()
      });

      if (res && (res.text || res.parsed)) {
        return {
          success: true,
          text: res.text || '',
          parsed: res.parsed || null,
          tool: tool
        };
      }
      return { success: false, error: 'Empty AI response' };
    } catch (err) {
      console.warn('AI call failed, fallback will be used:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Lightweight, safe Markdown-to-HTML parser.
   */
  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--line-soft); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px;">$1</code>')
      .replace(/^### (.*$)/gim, '<h4 style="margin-top:12px; margin-bottom:6px; color:var(--brass-deep);">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="margin-top:14px; margin-bottom:8px; color:var(--ink);">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li style="margin-bottom:4px;">$1</li>')
      .replace(/^- (.*$)/gim, '<li style="margin-bottom:4px;">$1</li>')
      .replace(/\n/g, '<br>');
  }

  return {
    buildModuleContext,
    ask,
    formatMarkdown,
    MODULE_PROFILES
  };
})();
