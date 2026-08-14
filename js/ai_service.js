/**
 * js/ai_service.js
 * Centralized AI Service & Dynamic Module Context Builder.
 * Integrates directly with existing system callAI backend proxy.
 * Includes Universal Smart UI Formatter for ERP Workbench.
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

  const _aiResponseCache = new Map();

  /**
   * Dynamically builds a privacy-safe, non-sensitive context payload for a module.
   */
  function buildModuleContext(moduleId, categoryId, topicId) {
    const modules = State.modulesCache || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    
    // Flexible module matching by ID, slug, or index
    let foundMod = modules.find(m => String(m.id).toLowerCase() === String(moduleId || '').toLowerCase());
    if (!foundMod && moduleId) {
      foundMod = modules.find(m => String(m.name_en).toLowerCase() === String(moduleId).toLowerCase() || String(m.name_ar).toLowerCase() === String(moduleId).toLowerCase());
    }
    if (!foundMod) {
      foundMod = modules[0] || { id: 'MOD-1', name_en: 'Inventory', name_ar: 'المخزون' };
    }

    // Retrieve all topics from State or cached data
    const cachedTopics = API.cacheGet('topics:{}', 'topics') || [];
    const allTopics = (Array.isArray(State.allTopics) && State.allTopics.length)
      ? State.allTopics
      : (Array.isArray(cachedTopics) && cachedTopics.length ? cachedTopics : []);

    const topics = allTopics.filter(t => String(t.module_id) === String(foundMod.id));
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

    const modIdx = modules.indexOf(foundMod) + 1;
    const profile = MODULE_PROFILES[foundMod.id] || MODULE_PROFILES[`MOD-${modIdx}`] || MODULE_PROFILES['MOD-1'];

    return {
      module_id: foundMod.id,
      module_name: I18n.getLang() === 'ar' ? foundMod.name_ar : foundMod.name_en,
      category_id: categoryId || '',
      category_name: categoryObj ? I18n.localizedName(categoryObj) : '',
      topic_id: topicId || '',
      topic_name: topicObj ? (topicObj.topic || topicObj.title_ar || topicObj.title_en || '') : '',
      domain_profile: I18n.getLang() === 'ar' ? profile.domain_ar : profile.domain_en,
      key_concepts: profile.key_concepts.join(', '),
      total_topics: topics.length,
      mastered_count: mastered.length,
      knowledge_gaps: gaps.map(g => g.topic || g.title_ar || g.title_en || '').filter(Boolean).slice(0, 5).join('; ') || 'None',
      user_level: userLevel,
      language: I18n.getLang()
    };
  }

  /**
   * Calls backend `askAI` action with built context and client-side LRU response caching.
   */
  async function ask(tool, promptText, options = {}) {
    const context = buildModuleContext(options.moduleId, options.categoryId, options.topicId);
    const cacheKey = `${tool}:${context.module_id}:${(promptText || '').trim()}:${I18n.getLang()}`;

    if (!options.forceFresh && _aiResponseCache.has(cacheKey)) {
      const cached = _aiResponseCache.get(cacheKey);
      if (Date.now() - cached.ts < 30 * 60 * 1000) { // 30 min cache
        return cached.res;
      }
      _aiResponseCache.delete(cacheKey);
    }
    
    try {
      const res = await API.rawCall('askAI', {
        tool: tool,
        prompt: promptText || '',
        context: context,
        language: I18n.getLang()
      });

      if (res && (res.text || res.parsed)) {
        const responseData = {
          success: true,
          text: res.text || '',
          parsed: res.parsed || null,
          tool: tool
        };
        _aiResponseCache.set(cacheKey, { res: responseData, ts: Date.now() });
        return responseData;
      }
      return { success: false, error: 'Empty AI response' };
    } catch (err) {
      console.warn('AI call failed, fallback will be used:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Cleans raw JSON string by removing markdown code block fences of any length.
   */
  function cleanJsonText(rawText) {
    if (!rawText) return '';
    return rawText
      .replace(/`{1,5}json/gi, '')
      .replace(/`{1,5}/g, '')
      .trim();
  }

  /**
   * Universal Smart UI Formatter: Transforms raw JSON or Markdown AI output into elegant,
   * fully-styled HTML Cards, Tables, Badges, and Lists matching the App's Design System.
   */
  function formatMarkdown(input) {
    if (!input) return '';

    // Step 1: If object or valid JSON, render as structured HTML cards
    let dataObj = null;
    if (typeof input === 'object') {
      dataObj = input;
    } else if (typeof input === 'string') {
      const cleaned = cleanJsonText(input);
      if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
        try {
          dataObj = JSON.parse(cleaned);
        } catch (e) {
          // Fallback regex attempt for embedded JSON
          const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (match) {
            try { dataObj = JSON.parse(match[0]); } catch (ex) {}
          }
        }
      }
    }

    if (dataObj) {
      return renderJSONObject(dataObj);
    }

    // Step 2: Render standard prose Markdown with enhanced HTML styling
    return renderMarkdownText(String(input));
  }

  /**
   * Universal Renderer for JSON Objects & Nested Data Structures.
   */
  function renderJSONObject(obj) {
    if (!obj) return '';

    // Un-nest response & data wrappers if present
    if (obj.response && typeof obj.response === 'object') {
      obj = obj.response;
    }
    if (obj.recommendations && typeof obj.recommendations === 'object') {
      obj = obj.recommendations;
    }
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      if (obj.message) {
        obj.data.message = obj.message;
      }
      obj = obj.data;
    }

    let html = '';

    // Title / Header
    if (obj.title || obj.message) {
      const titleText = obj.title || obj.message;
      html += `<div class="card" style="margin-bottom:16px; background:var(--surface-subtle); border-inline-start:4px solid var(--brass); padding:12px 16px;">
        <h3 style="margin:0; font-size:16px; color:var(--ink);">💡 ${Topics.escapeHtml(titleText)}</h3>
      </div>`;
    }

    // ERP Scenario Lab Object
    if (obj.scenario && typeof obj.scenario === 'object') {
      html += renderERPScenarioObject(obj.scenario);
    }

    // Learning Sequence Object (AI Knowledge Gap Coach)
    if (obj.learning_sequence && typeof obj.learning_sequence === 'object') {
      html += renderLearningSequence(obj.learning_sequence);
    }

    // Executive KPIs Object (Financial, Operational, Strategic Metrics)
    if (obj.executive_kpis && typeof obj.executive_kpis === 'object') {
      html += renderExecutiveKPIs(obj.executive_kpis);
    }

    // Executive Reporting Matrix Object
    if (obj.reporting_matrix && typeof obj.reporting_matrix === 'object') {
      html += renderReportingMatrix(obj.reporting_matrix);
    }

    // Diagnostic Troubleshooter Analysis Object
    if (obj.analysis && typeof obj.analysis === 'object') {
      html += renderTroubleshooterAnalysis(obj.analysis);
    }

    // Module Overview Card
    if (obj.module_overview && typeof obj.module_overview === 'object') {
      html += renderModuleOverview(obj.module_overview);
    }

    // Process Explanation Object (Overview, Key Phases, ERP Integration)
    if (obj.explanation && typeof obj.explanation === 'object') {
      html += renderExplanationObject(obj.explanation);
    }

    // Common Challenges & Solutions layout
    if (obj.common_challenges && Array.isArray(obj.common_challenges)) {
      html += renderCommonChallenges(obj.common_challenges);
    }

    // Key Features layout
    if (obj.key_features_to_implement && Array.isArray(obj.key_features_to_implement)) {
      html += renderFeatureList(obj.key_features_to_implement);
    }

    // System Selection Options layout
    if (obj.system_selection && typeof obj.system_selection === 'object') {
      if (obj.system_selection.description) {
        html += `<p style="font-size:13.5px; color:var(--ink-soft); margin-bottom:10px;">${Topics.escapeHtml(obj.system_selection.description)}</p>`;
      }
      if (obj.system_selection.options && Array.isArray(obj.system_selection.options)) {
        html += renderOptionsList(obj.system_selection.options);
      }
    }

    // Workflow Steps layout if obj.steps or obj.implementation_steps exists
    const stepsArray = obj.steps || obj.implementation_steps || obj.key_phases || obj.sequence;
    if (stepsArray && Array.isArray(stepsArray)) {
      html += renderStepsWorkflow(stepsArray);
    }

    // Multi-ERP Comparison layout if obj.comparison exists
    else if (obj.comparison && typeof obj.comparison === 'object') {
      html += renderComparisonSections(obj.comparison);
    }

    // Accounting Journal Entries layout if obj.entries exists
    else if (obj.entries && Array.isArray(obj.entries)) {
      html += renderJournalEntriesTable(obj.entries);
    }

    // Next Steps list if present
    if (obj.next_steps && Array.isArray(obj.next_steps)) {
      html += renderNextStepsList(obj.next_steps);
    }

    // Generic Object iteration for remaining fields
    const skipList = ['title', 'message', 'scenario', 'learning_sequence', 'executive_kpis', 'reporting_matrix', 'analysis', 'module_overview', 'explanation', 'steps', 'implementation_steps', 'key_phases', 'sequence', 'comparison', 'entries', 'common_challenges', 'key_features_to_implement', 'system_selection', 'notes', 'user_context', 'module', 'request', 'status', 'language', 'next_steps', 'metadata', 'resources', 'module_info'];
    html += renderGenericDataStructure(obj, skipList);

    // Notes array or object if present
    if (obj.notes) {
      if (Array.isArray(obj.notes)) {
        html += renderNotesList(obj.notes);
      } else if (typeof obj.notes === 'object') {
        html += renderGenericDataStructure(obj.notes, []);
      }
    }

    return html;
  }

  /**
   * Helper to format ERP Scenario Lab Object.
   */
  function renderERPScenarioObject(sc) {
    if (!sc || typeof sc !== 'object') return '';
    let html = '';
    const isAr = I18n.getLang() === 'ar';

    if (sc.title || sc.description) {
      html += `
        <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--brass); background:var(--surface); padding:14px 16px;">
          <h3 style="margin-top:0; margin-bottom:6px; font-size:16px; color:var(--ink); font-weight:700;">🧪 ${Topics.escapeHtml(sc.title || 'Scenario Lab')}</h3>
          ${sc.description ? `<p style="font-size:13.5px; color:var(--ink-soft); line-height:1.5; margin:0;">${Topics.escapeHtml(sc.description)}</p>` : ''}
        </div>
      `;
    }

    if (sc.context && typeof sc.context === 'object') {
      const ctx = sc.context;
      html += `
        <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--teal); background:var(--surface); padding:12px 16px;">
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            ${ctx.company_name ? `<span class="badge badge-status-learning" style="font-size:11px;">🏢 ${Topics.escapeHtml(ctx.company_name)}</span>` : ''}
            ${ctx.industry ? `<span class="badge badge-priority-medium" style="font-size:11px;">🏭 ${Topics.escapeHtml(ctx.industry)}</span>` : ''}
          </div>
          ${ctx.current_challenges && Array.isArray(ctx.current_challenges) ? `
            <div style="margin-bottom:8px;">
              <strong style="font-size:12px; color:var(--rust); display:block; margin-bottom:4px;">❌ ${isAr ? 'التحديات الحالية:' : 'Current Challenges:'}</strong>
              <ul style="margin:0; padding-inline-start:18px; font-size:12.5px; color:var(--ink-soft); line-height:1.4;">
                ${ctx.current_challenges.map(c => `<li>${Topics.escapeHtml(c)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${ctx.objectives && Array.isArray(ctx.objectives) ? `
            <div>
              <strong style="font-size:12px; color:var(--teal); display:block; margin-bottom:4px;">🎯 ${isAr ? 'الأهداف المرجوة:' : 'Objectives:'}</strong>
              <ul style="margin:0; padding-inline-start:18px; font-size:12.5px; color:var(--ink-soft); line-height:1.4;">
                ${ctx.objectives.map(o => `<li>${Topics.escapeHtml(o)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (sc.tasks && Array.isArray(sc.tasks)) {
      html += renderStepsWorkflow(sc.tasks);
    }

    if (sc.roles_involved && Array.isArray(sc.roles_involved)) {
      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--brass-deep); font-weight:700;">👥 ${isAr ? 'الأدوار المسؤولة ومسؤولياتها' : 'Roles & Responsibilities'}</h4>
          <div class="grid grid-modules" style="gap:10px;">
            ${sc.roles_involved.map(r => `
              <div class="card" style="border-top:3px solid var(--brass); background:var(--surface); padding:12px 14px;">
                <strong style="display:block; font-size:13.5px; color:var(--ink); margin-bottom:4px;">👤 ${Topics.escapeHtml(r.role_name || r.role || 'Role')}</strong>
                ${r.responsibilities && Array.isArray(r.responsibilities) ? `
                  <ul style="margin:0; padding-inline-start:16px; font-size:12px; color:var(--ink-soft); line-height:1.4;">
                    ${r.responsibilities.map(resp => `<li>${Topics.escapeHtml(resp)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (sc.success_metrics && Array.isArray(sc.success_metrics)) {
      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--teal); font-weight:700;">📊 ${isAr ? 'مؤشرات نجاح السيناريو (Success Metrics)' : 'Success Metrics'}</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${sc.success_metrics.map(m => `<span class="badge badge-status-mastered" style="font-size:11.5px; padding:6px 10px;">📊 ${Topics.escapeHtml(m.metric || 'Metric')}: <strong>${Topics.escapeHtml(m.target || '')}</strong></span>`).join('')}
          </div>
        </div>
      `;
    }

    if (sc.potential_issues && Array.isArray(sc.potential_issues)) {
      html += renderCommonChallenges(sc.potential_issues);
    }

    if (sc.tools_technologies && Array.isArray(sc.tools_technologies)) {
      html += `
        <div style="margin-bottom:16px;">
          <strong style="font-size:12px; color:var(--brass-deep); display:block; margin-bottom:4px;">🛠️ ${isAr ? 'الأدوات والتقنيات المقترحة:' : 'Tools & Tech Stack:'}</strong>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${sc.tools_technologies.map(t => `<span class="badge badge-status-learning" style="font-size:11px;">🛠️ ${Topics.escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;
    }

    const skip = ['title', 'description', 'context', 'tasks', 'roles_involved', 'success_metrics', 'potential_issues', 'tools_technologies'];
    html += renderGenericDataStructure(sc, skip);

    return html;
  }

  /**
   * Helper to format Learning Sequence (AI Knowledge Gap Coach).
   */
  function renderLearningSequence(seqObj) {
    if (!seqObj || typeof seqObj !== 'object') return '';
    let html = '';
    const isAr = I18n.getLang() === 'ar';

    if (seqObj.module_name || seqObj.user_level) {
      html += `
        <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--brass); background:var(--surface); padding:14px 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="margin:0; font-size:15px; color:var(--ink); font-weight:700;">🎯 ${isAr ? 'خطة الدراسة والتمكين الشخصية المستهدفة' : 'Personalized Learning & Remediation Sequence'}</h4>
            ${seqObj.user_level ? `<span class="badge badge-status-learning" style="font-size:11px;">Level: ${Topics.escapeHtml(seqObj.user_level)}</span>` : ''}
          </div>
          ${seqObj.module_name ? `<div style="font-size:12.5px; color:var(--ink-soft); margin-top:4px;">${isAr ? 'الموديول المستهدف:' : 'Target Module:'} <strong>${Topics.escapeHtml(seqObj.module_name)}</strong></div>` : ''}
        </div>
      `;
    }

    if (seqObj.sequence && Array.isArray(seqObj.sequence)) {
      html += renderLearningSequenceTimeline(seqObj.sequence);
    }

    if (seqObj.final_assessment && typeof seqObj.final_assessment === 'object') {
      html += renderFinalAssessmentCard(seqObj.final_assessment);
    }

    if (seqObj.recommendations && Array.isArray(seqObj.recommendations)) {
      html += renderNotesList(seqObj.recommendations);
    }

    return html;
  }

  /**
   * Helper to format Learning Sequence Timeline steps.
   */
  function renderLearningSequenceTimeline(sequence) {
    if (!Array.isArray(sequence) || !sequence.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:16px;">
        ${sequence.map((step, idx) => {
          const stepNum = step.step || (idx + 1);
          const title = step.title || `الخطوة ${stepNum}`;
          const desc = step.description || '';
          const duration = step.duration || '';
          const resources = step.resources || [];
          const assessment = step.assessment || null;

          return `
            <div class="card" style="border-inline-start:4px solid var(--brass); background:var(--surface);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge badge-priority-high" style="font-family:var(--font-mono); font-size:11px;">Step ${stepNum}</span>
                  <h4 style="margin:0; font-size:14.5px; color:var(--ink); font-weight:700;">${Topics.escapeHtml(title)}</h4>
                </div>
                ${duration ? `<span class="badge badge-priority-medium" style="font-size:10.5px;">⏰ ${Topics.escapeHtml(duration)}</span>` : ''}
              </div>
              ${desc ? `<p style="font-size:13px; color:var(--ink-soft); line-height:1.5; margin-bottom:10px;">${Topics.escapeHtml(desc)}</p>` : ''}
              
              ${resources && Array.isArray(resources) && resources.length ? `
                <div style="margin-bottom:8px;">
                  <strong style="font-size:11.5px; color:var(--brass-deep); display:block; margin-bottom:4px;">📚 ${isAr ? 'المصادر والوسائط التعليمية:' : 'Resources:'}</strong>
                  <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${resources.map(r => {
                      let icon = '📄';
                      if (r.type === 'video' || r.type === 'demo') icon = '📹';
                      if (r.type === 'tutorial' || r.type === 'guide') icon = '📖';
                      return `<span class="badge badge-status-learning" style="font-size:11px;">${icon} ${Topics.escapeHtml(r.title || r.type || 'Resource')}</span>`;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              ${assessment && typeof assessment === 'object' ? `
                <div style="padding:8px 10px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12px; border-inline-start:3px solid var(--teal);">
                  📝 <strong>${isAr ? 'اختبار التمكين والتحقق:' : 'Assessment:'}</strong> ${Topics.escapeHtml(assessment.task || assessment.type || 'Quiz')} 
                  ${assessment.passing_score ? `<span class="badge badge-status-mastered" style="font-size:10px; margin-inline-start:6px;">Pass Score: ${assessment.passing_score}%</span>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Helper to format Final Assessment Card.
   */
  function renderFinalAssessmentCard(fa) {
    if (!fa || typeof fa !== 'object') return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--teal); background:var(--line-soft);">
        <h4 style="margin-top:0; margin-bottom:6px; font-size:14.5px; color:var(--teal); font-weight:700;">🎓 ${isAr ? 'الاختبار النهائي الشامل والاعتماد' : 'Final Assessment & Certification'}</h4>
        ${fa.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:6px;">${Topics.escapeHtml(fa.description)}</p>` : ''}
        <div style="display:flex; gap:8px;">
          ${fa.passing_score ? `<span class="badge badge-status-mastered" style="font-size:10.5px;">Pass Score: ${fa.passing_score}%</span>` : ''}
          ${fa.duration ? `<span class="badge badge-priority-medium" style="font-size:10.5px;">⏰ ${Topics.escapeHtml(fa.duration)}</span>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Helper to format Executive KPIs (Financial, Operational, Strategic).
   */
  function renderExecutiveKPIs(kpis) {
    if (!kpis || typeof kpis !== 'object') return '';
    let html = '';
    const isAr = I18n.getLang() === 'ar';

    if (kpis.financial_metrics && Array.isArray(kpis.financial_metrics)) {
      html += renderKPICategoryGroup('💰 ' + (isAr ? 'المؤشرات المالية (Financial Metrics)' : 'Financial Metrics'), kpis.financial_metrics, 'var(--brass-deep)');
    }
    if (kpis.operational_metrics && Array.isArray(kpis.operational_metrics)) {
      html += renderKPICategoryGroup('⚡ ' + (isAr ? 'المؤشرات التشغيلية (Operational Metrics)' : 'Operational Metrics'), kpis.operational_metrics, 'var(--teal)');
    }
    if (kpis.strategic_metrics && Array.isArray(kpis.strategic_metrics)) {
      html += renderKPICategoryGroup('🎯 ' + (isAr ? 'المؤشرات الاستراتيجية (Strategic Metrics)' : 'Strategic Metrics'), kpis.strategic_metrics, 'var(--rust)');
    }

    return html;
  }

  /**
   * Helper to format KPI Category Groups.
   */
  function renderKPICategoryGroup(title, metrics, color) {
    if (!Array.isArray(metrics) || !metrics.length) return '';
    return `
      <div style="margin-bottom:16px;">
        <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:${color}; font-weight:700;">${title}</h4>
        <div class="grid grid-modules" style="gap:12px;">
          ${metrics.map(kpi => `
            <div class="card" style="border-top:3px solid ${color}; background:var(--surface); padding:12px 14px;">
              <strong style="display:block; font-size:14px; color:var(--ink); margin-bottom:4px;">📊 ${Topics.escapeHtml(kpi.kpi_name || kpi.name || 'KPI')}</strong>
              ${kpi.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:8px; line-height:1.4;">${Topics.escapeHtml(kpi.description)}</p>` : ''}
              ${kpi.calculation ? `
                <div style="padding:6px 10px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:11.5px; font-family:var(--font-mono); color:var(--teal); margin-bottom:8px;">
                  🧮 <strong>Calculation:</strong> ${Topics.escapeHtml(kpi.calculation)}
                </div>
              ` : ''}
              <div style="display:flex; flex-wrap:wrap; gap:6px;">
                ${kpi.target ? `<span class="badge badge-priority-medium" style="font-size:10px;">🎯 ${Topics.escapeHtml(kpi.target)}</span>` : ''}
                ${kpi.frequency ? `<span class="badge badge-status-learning" style="font-size:10px;">⏰ ${Topics.escapeHtml(kpi.frequency)}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Helper to format Executive Reporting Matrix.
   */
  function renderReportingMatrix(matrix) {
    if (!matrix || typeof matrix !== 'object') return '';
    let html = '';

    ['daily_reports', 'weekly_reports', 'monthly_reports', 'quarterly_reports'].forEach(freqKey => {
      const reports = matrix[freqKey];
      if (!Array.isArray(reports) || !reports.length) return;

      const titleMap = {
        daily_reports: '📅 التقارير اليومية (Daily Reports)',
        weekly_reports: '🗓️ التقارير الأسبوعية (Weekly Reports)',
        monthly_reports: '📊 التقارير الشهرية (Monthly Reports)',
        quarterly_reports: '📈 التقارير الربع سنوية (Quarterly Reports)'
      };

      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--brass-deep); font-weight:700;">${titleMap[freqKey] || freqKey}</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${reports.map(rep => `
              <div class="card" style="border-inline-start:4px solid var(--brass); background:var(--surface); padding:12px 14px;">
                <strong style="display:block; font-size:14px; color:var(--ink); margin-bottom:4px;">📋 ${Topics.escapeHtml(rep.report_name || rep.name || 'Report')}</strong>
                ${rep.purpose ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:6px; line-height:1.4;">${Topics.escapeHtml(rep.purpose)}</p>` : ''}
                ${rep.metrics_included && Array.isArray(rep.metrics_included) ? `
                  <div style="font-size:11.5px; color:var(--teal); margin-bottom:6px;">
                    📊 <strong>Metrics:</strong> ${rep.metrics_included.join(' • ')}
                  </div>
                ` : ''}
                ${rep.audience && Array.isArray(rep.audience) ? `
                  <div style="font-size:11px; color:var(--ink-soft);">
                    👥 <strong>Audience:</strong> ${rep.audience.join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Helper to format Troubleshooter Analysis Diagnostic Report.
   */
  function renderTroubleshooterAnalysis(analysis) {
    if (!analysis || typeof analysis !== 'object') return '';
    let html = '';
    const isAr = I18n.getLang() === 'ar';

    if (analysis.issue) {
      html += `<div class="card" style="margin-bottom:16px; background:var(--line-soft); border-inline-start:4px solid var(--rust); padding:12px 16px;">
        <h4 style="margin:0; font-size:15px; color:var(--rust); font-weight:700;">🔍 ${isAr ? 'المشكلة التي تم تشخيصها:' : 'Diagnosed Issue:'} ${Topics.escapeHtml(analysis.issue)}</h4>
      </div>`;
    }

    if (analysis.root_causes && Array.isArray(analysis.root_causes)) {
      html += renderRootCauses(analysis.root_causes);
    }

    if (analysis.recommended_actions && Array.isArray(analysis.recommended_actions)) {
      html += renderRecommendedActions(analysis.recommended_actions);
    }

    return html;
  }

  /**
   * Helper to format Troubleshooter Root Causes.
   */
  function renderRootCauses(causes) {
    if (!Array.isArray(causes) || !causes.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div style="margin-bottom:16px;">
        <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--rust); font-weight:700;">🧩 ${isAr ? 'الأسباب الجوهرية والتحليل الفني للمشكلة' : 'Root Causes & Diagnostic Analysis'}</h4>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${causes.map((c, idx) => `
            <div class="card" style="border-inline-start:4px solid var(--rust); background:var(--surface);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span class="badge badge-priority-high" style="font-size:11px;">Cause ${idx + 1}</span>
                <h4 style="margin:0; font-size:14.5px; color:var(--ink); font-weight:700;">${Topics.escapeHtml(c.cause || 'Root Cause')}</h4>
              </div>
              ${c.description ? `<p style="font-size:13px; color:var(--ink-soft); line-height:1.5; margin-bottom:8px;">${Topics.escapeHtml(c.description)}</p>` : ''}
              ${c.solution ? renderRootCauseSolution(c.solution) : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Helper to format Troubleshooter Solution steps & tools.
   */
  function renderRootCauseSolution(sol) {
    if (!sol || typeof sol !== 'object') return '';
    let html = `<div style="padding:10px 12px; background:var(--line-soft); border-radius:var(--radius-sm); border-inline-start:3px solid var(--teal);">`;

    if (sol.steps && Array.isArray(sol.steps)) {
      html += `<strong style="font-size:12.5px; color:var(--teal); display:block; margin-bottom:4px;">✅ ${I18n.getLang() === 'ar' ? 'خطوات العلاج والإصلاح:' : 'Remediation Steps:'}</strong>`;
      html += `<ul style="margin:0; padding-inline-start:18px; font-size:12.5px; color:var(--ink); line-height:1.5;">
        ${sol.steps.map(s => `<li style="margin-bottom:3px;">${Topics.escapeHtml(s)}</li>`).join('')}
      </ul>`;
    }

    if (sol.tools && Array.isArray(sol.tools)) {
      html += `<div style="margin-top:6px; font-size:11.5px; color:var(--brass-deep);">
        🛠️ <strong>${I18n.getLang() === 'ar' ? 'الأدوات المطلوبة:' : 'Required Tools:'}</strong> ${sol.tools.map(t => `<span class="badge badge-status-learning" style="font-size:10px; margin-inline-end:4px;">${Topics.escapeHtml(t)}</span>`).join('')}
      </div>`;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Helper to format Recommended Corrective Actions.
   */
  function renderRecommendedActions(actions) {
    if (!Array.isArray(actions) || !actions.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div style="margin-bottom:16px;">
        <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--teal); font-weight:700;">⚡ ${isAr ? 'الإجراءات التصحيحية والوقائية الموصى بها' : 'Recommended Corrective Actions'}</h4>
        <div class="grid grid-modules" style="gap:10px;">
          ${actions.map(a => `
            <div class="card" style="border-top:3px solid var(--teal); background:var(--surface); padding:12px 14px;">
              <strong style="display:block; font-size:13.5px; color:var(--ink); margin-bottom:4px;">✅ ${Topics.escapeHtml(a.action || a.title || 'Action')}</strong>
              ${a.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:6px; line-height:1.4;">${Topics.escapeHtml(a.description)}</p>` : ''}
              ${a.frequency ? `<span class="badge badge-priority-medium" style="font-size:10.5px;">⏰ ${Topics.escapeHtml(a.frequency)}</span>` : ''}
              ${a.target_audience ? `<span class="badge badge-status-learning" style="font-size:10.5px;">👥 ${Topics.escapeHtml(a.target_audience)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Helper to format Next Steps List.
   */
  function renderNextStepsList(nextSteps) {
    if (!Array.isArray(nextSteps) || !nextSteps.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="margin-top:14px; border-inline-start:4px solid var(--brass); background:var(--line-soft);">
        <h4 style="margin-top:0; margin-bottom:8px; font-size:14px; color:var(--brass-deep); font-weight:700;">🚀 ${isAr ? 'الخطوات التنفيذية القادمة' : 'Next Action Items'}</h4>
        <ul style="margin:0; padding-inline-start:18px; font-size:13px; color:var(--ink); line-height:1.5;">
          ${nextSteps.map(ns => `<li style="margin-bottom:4px;">✅ ${renderMarkdownText(String(ns))}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  /**
   * Helper to format Module Overview Card.
   */
  function renderModuleOverview(ov) {
    if (!ov || typeof ov !== 'object') return '';
    return `
      <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--brass); background:var(--surface);">
        <h4 style="margin-top:0; margin-bottom:6px; font-size:15px; color:var(--ink); font-weight:700;">📌 ${Topics.escapeHtml(ov.name || 'Module Overview')}</h4>
        ${ov.purpose ? `<p style="font-size:13px; color:var(--ink-soft); line-height:1.5; margin-bottom:10px;">${Topics.escapeHtml(ov.purpose)}</p>` : ''}
        ${ov.integration && Array.isArray(ov.integration) ? `
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${ov.integration.map(i => `<span class="badge badge-status-learning" style="font-size:11px;">🧩 ${Topics.escapeHtml(i)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Formatter for Process Explanation objects (Overview, Key Phases, Integration).
   */
  function renderExplanationObject(exp) {
    if (!exp || typeof exp !== 'object') return '';
    let html = '';

    if (exp.overview) {
      html += `<div class="card" style="margin-bottom:16px; background:var(--surface-subtle); border-inline-start:4px solid var(--brass); padding:14px 16px;">
        <h4 style="margin-top:0; margin-bottom:8px; font-size:15px; color:var(--ink); font-weight:700;">💡 ${I18n.getLang() === 'ar' ? 'نظرة عامة على العملية' : 'Process Overview'}</h4>
        <p style="font-size:13.5px; color:var(--ink-soft); line-height:1.6; margin:0;">${Topics.escapeHtml(exp.overview)}</p>
      </div>`;
    }

    if (exp.key_phases && Array.isArray(exp.key_phases)) {
      html += renderKeyPhasesList(exp.key_phases);
    }

    if (exp.integration_with_erp && typeof exp.integration_with_erp === 'object') {
      html += renderERPIntegrationSection(exp.integration_with_erp);
    }

    const skip = ['overview', 'key_phases', 'integration_with_erp'];
    html += renderGenericDataStructure(exp, skip);

    return html;
  }

  /**
   * Helper to format Key Phases list.
   */
  function renderKeyPhasesList(phases) {
    if (!Array.isArray(phases) || !phases.length) return '';
    return `
      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:16px;">
        ${phases.map((ph, idx) => {
          const pNum = ph.phase || ph.step || (idx + 1);
          const pName = ph.name || ph.title || `المرحلة ${pNum}`;
          const desc = ph.description || '';
          const activities = ph.activities || ph.actions || [];

          return `
            <div class="card" style="border-inline-start:4px solid var(--brass); background:var(--surface);">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <span class="badge badge-priority-high" style="font-family:var(--font-mono); font-size:12px;">Phase ${pNum}</span>
                <h4 style="margin:0; font-size:15px; color:var(--ink); font-weight:700;">${Topics.escapeHtml(pName)}</h4>
              </div>
              ${desc ? `<p style="font-size:13px; color:var(--ink-soft); line-height:1.5; margin-bottom:10px;">${Topics.escapeHtml(desc)}</p>` : ''}
              ${renderStepActions(activities)}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Helper to format ERP Integration & Workflow Sections.
   */
  function renderERPIntegrationSection(integ) {
    if (!integ || typeof integ !== 'object') return '';
    let html = '';

    if (integ.modules_involved && Array.isArray(integ.modules_involved)) {
      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--brass-deep); font-weight:700;">🧩 ${I18n.getLang() === 'ar' ? 'الموديولات المشتركة في الدورة' : 'Modules Involved'}</h4>
          <div class="grid grid-modules" style="gap:10px;">
            ${integ.modules_involved.map(m => `
              <div class="card" style="border-top:3px solid var(--brass); background:var(--surface); padding:12px 14px;">
                <strong style="display:block; font-size:13.5px; color:var(--ink); margin-bottom:4px;">${Topics.escapeHtml(m.module || m.name || 'Module')}</strong>
                <span style="font-size:12.5px; color:var(--ink-soft); line-height:1.4; display:block;">${Topics.escapeHtml(m.role || m.description || '—')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (integ.workflow_in_erp && Array.isArray(integ.workflow_in_erp)) {
      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin-top:0; margin-bottom:10px; font-size:15px; color:var(--teal); font-weight:700;">🔄 ${I18n.getLang() === 'ar' ? 'مسار العمل وتفاعل النظام الآلي' : 'ERP Workflow & Automated System Action'}</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${integ.workflow_in_erp.map((w, idx) => `
              <div class="card" style="border-inline-start:4px solid var(--teal); background:var(--surface); padding:12px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span class="badge badge-priority-high" style="font-size:11px;">Step ${w.step || (idx + 1)}</span>
                  <strong style="color:var(--ink); font-size:13.5px;">${Topics.escapeHtml(w.action || w.step_name || 'Action')}</strong>
                </div>
                ${w.system_response ? `
                  <div style="font-size:12.5px; color:var(--teal); font-family:var(--font-mono); margin-top:4px;">
                    ⚡ <strong>${I18n.getLang() === 'ar' ? 'استجابة النظام التلقائية:' : 'System Action:'}</strong> ${Topics.escapeHtml(w.system_response)}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * Helper to format common challenges & solutions.
   */
  function renderCommonChallenges(challenges) {
    if (!Array.isArray(challenges) || !challenges.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--rust); background:var(--surface);">
        <h4 style="margin-top:0; margin-bottom:12px; font-size:15px; color:var(--rust); font-weight:700;">⚠️ ${isAr ? 'التحديات الشائعة والحلول الموصى بها' : 'Common Challenges & Recommended Solutions'}</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${challenges.map(c => `
            <div style="padding:10px 14px; background:var(--line-soft); border-radius:var(--radius-sm);">
              <strong style="color:var(--rust); font-size:13px; display:block; margin-bottom:4px;">❌ ${isAr ? 'التحدي:' : 'Challenge:'} ${Topics.escapeHtml(c.challenge || c.issue || '—')}</strong>
              <div style="color:var(--teal); font-size:12.5px; line-height:1.4;">✅ ${isAr ? 'الحل:' : 'Solution:'} ${Topics.escapeHtml(c.solution || c.fix || '—')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Helper to format system options list.
   */
  function renderOptionsList(options) {
    if (!Array.isArray(options) || !options.length) return '';
    return `
      <div class="grid grid-modules" style="gap:12px; margin-bottom:16px;">
        ${options.map(opt => `
          <div class="card" style="border-top:3px solid var(--brass); background:var(--surface);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <h4 style="margin:0; font-size:15px; color:var(--ink);">${Topics.escapeHtml(opt.name || opt.title || 'ERP Option')}</h4>
              ${opt.suitability ? `<span class="badge badge-status-learning" style="font-size:10.5px;">${Topics.escapeHtml(opt.suitability)}</span>` : ''}
            </div>
            ${opt.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:8px;">${Topics.escapeHtml(opt.description)}</p>` : ''}
            ${opt.features ? renderStepActions(opt.features) : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Helper to format key features list.
   */
  function renderFeatureList(features) {
    if (!Array.isArray(features) || !features.length) return '';
    return `
      <div class="grid grid-modules" style="gap:12px; margin-bottom:16px;">
        ${features.map(f => `
          <div class="card" style="border-inline-start:3px solid var(--teal); background:var(--surface);">
            <strong style="display:block; font-size:14px; color:var(--ink); margin-bottom:6px;">⚡ ${Topics.escapeHtml(f.feature || f.name || 'Feature')}</strong>
            ${f.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:6px;">${Topics.escapeHtml(f.description)}</p>` : ''}
            ${f.benefits ? `<div style="font-size:12px; color:var(--teal); font-weight:600;">💎 ${I18n.getLang() === 'ar' ? 'الفوائد:' : 'Benefits:'} ${Array.isArray(f.benefits) ? f.benefits.join(' • ') : f.benefits}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Renders Step-by-Step ERP Workflows into beautiful Cards & Tables.
   */
  function renderStepsWorkflow(steps) {
    if (!Array.isArray(steps) || !steps.length) return '';

    return `
      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:16px;">
        ${steps.map((step, idx) => {
          const stepNum = step.step_number || step.step || step.phase || step.task_id || (idx + 1);
          const stepName = step.step_name || step.action || step.name || step.title || `الخطوة ${stepNum}`;
          const desc = step.description || step.details || '';
          const actions = step.actions || step.requirements || step.activities || step.tasks || step.steps || [];

          return `
            <div class="card" style="border-inline-start:4px solid var(--brass); background:var(--surface);">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="badge badge-priority-high" style="font-family:var(--font-mono); font-size:12px;">Step ${stepNum}</span>
                  <h4 style="margin:0; font-size:15px; color:var(--ink); font-weight:700;">${Topics.escapeHtml(stepName)}</h4>
                </div>
                ${step.dependencies && Array.isArray(step.dependencies) ? `<span class="badge badge-status-learning" style="font-size:10px;">📌 ${step.dependencies.join(' • ')}</span>` : ''}
              </div>
              ${desc ? `<p style="font-size:13.5px; color:var(--ink-soft); line-height:1.5; margin-bottom:10px;">${Topics.escapeHtml(desc)}</p>` : ''}
              ${renderStepActions(actions)}
              ${step.expected_outcome ? `
                <div style="margin-top:8px; padding:6px 10px; background:var(--line-soft); border-radius:var(--radius-sm); font-size:12px; color:var(--teal); font-weight:600;">
                  🎯 <strong>${I18n.getLang() === 'ar' ? 'النتيجة المتوقعة:' : 'Expected Outcome:'}</strong> ${Topics.escapeHtml(step.expected_outcome)}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Helper to format step actions, tasks & fields array.
   */
  function renderStepActions(actions) {
    if (!actions) return '';
    if (typeof actions === 'string') {
      return `<div style="font-size:13px; color:var(--ink); margin-bottom:4px;">⚡ ${renderMarkdownText(actions)}</div>`;
    }
    if (!Array.isArray(actions)) {
      return renderGenericDataStructure(actions, []);
    }

    let html = '<div style="display:flex; flex-direction:column; gap:8px;">';
    actions.forEach(act => {
      if (typeof act === 'string') {
        html += `<div style="font-size:13px; color:var(--ink); display:flex; align-items:flex-start; gap:8px;">
          <span style="color:var(--brass); font-weight:700;">⚡</span>
          <span>${renderMarkdownText(act)}</span>
        </div>`;
      } else if (typeof act === 'object' && act !== null) {
        if (act.task || act.name || act.title) {
          const title = act.task || act.name || act.title;
          html += `
            <div style="padding:10px 12px; background:var(--line-soft); border-radius:var(--radius-sm); border-inline-start:3px solid var(--teal);">
              <strong style="font-size:13.5px; color:var(--ink); display:block; margin-bottom:4px;">⚡ ${Topics.escapeHtml(title)}</strong>
              ${act.description ? `<p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:6px; line-height:1.4;">${Topics.escapeHtml(act.description)}</p>` : ''}
              ${act.example ? renderTaskExample(act.example) : ''}
              ${act.fields && Array.isArray(act.fields) ? renderFieldsTable(act.fields) : ''}
              ${act.considerations && Array.isArray(act.considerations) ? `<div style="font-size:11.5px; color:var(--brass-deep); margin-top:4px;">📌 <strong>${I18n.getLang() === 'ar' ? 'الاعتبارات:' : 'Considerations:'}</strong> ${act.considerations.join(' • ')}</div>` : ''}
              ${act.output ? renderTaskOutput(act.output) : ''}
            </div>
          `;
        } else if (act.fields && Array.isArray(act.fields)) {
          html += renderFieldsTable(act.fields);
        } else if (act.methods && Array.isArray(act.methods)) {
          html += renderMethodsTable(act.methods);
        } else {
          html += renderGenericDataStructure(act, []);
        }
      }
    });
    html += '</div>';
    return html;
  }

  /**
   * Helper to format task example tables (BOM components & Routings).
   */
  function renderTaskExample(ex) {
    if (!ex || typeof ex !== 'object') return '';
    let html = `<div style="margin-top:6px; margin-bottom:6px; padding:8px 10px; background:var(--surface); border-radius:var(--radius-sm); border:1px solid var(--line); font-size:12px;">`;

    if (ex.product_name || ex.production_order) {
      html += `<div style="font-weight:700; color:var(--brass-deep); margin-bottom:4px;">📦 ${Topics.escapeHtml(ex.product_name || ex.production_order)}</div>`;
    }

    if (ex.components && Array.isArray(ex.components)) {
      html += `
        <div class="table-wrap" style="margin-top:4px;">
          <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
            <thead><tr style="background:var(--line-soft);"><th style="padding:4px 6px;">المادة</th><th style="padding:4px 6px;">الكمية</th><th style="padding:4px 6px;">الوحدة</th></tr></thead>
            <tbody>
              ${ex.components.map(c => `<tr><td style="padding:4px 6px; font-weight:600;">${Topics.escapeHtml(c.material || '—')}</td><td style="padding:4px 6px; color:var(--teal); font-family:var(--font-mono);">${c.quantity || 0}</td><td style="padding:4px 6px;">${Topics.escapeHtml(c.unit || '—')}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (ex.steps && Array.isArray(ex.steps)) {
      html += `
        <div class="table-wrap" style="margin-top:4px;">
          <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
            <thead><tr style="background:var(--line-soft);"><th style="padding:4px 6px;">#</th><th style="padding:4px 6px;">العملية</th><th style="padding:4px 6px;">الوقت</th><th style="padding:4px 6px;">المورد/العمالة</th></tr></thead>
            <tbody>
              ${ex.steps.map(s => `<tr><td style="padding:4px 6px;">${s.step || 1}</td><td style="padding:4px 6px; font-weight:600;">${Topics.escapeHtml(s.operation || '—')}</td><td style="padding:4px 6px; color:var(--teal); font-family:var(--font-mono);">${s.time || 0} ${s.unit || ''}</td><td style="padding:4px 6px;">${Topics.escapeHtml(s.machine || s.labor || '—')}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Helper to format production task outputs & scrap ratio.
   */
  function renderTaskOutput(out) {
    if (!out || typeof out !== 'object') return '';
    let html = `<div style="margin-top:6px; font-size:11.5px; color:var(--teal); font-weight:600;">⚡ <strong>${I18n.getLang() === 'ar' ? 'المخرجات والمنتجات النهائية:' : 'Output:'}</strong> `;
    if (out.finished_goods && Array.isArray(out.finished_goods)) {
      html += out.finished_goods.map(fg => `${fg.product} (${fg.quantity} ${fg.unit})`).join(' • ');
    }
    if (out.scrap !== undefined) {
      html += ` <span class="badge badge-priority-medium" style="font-size:10px;">Scrap Ratio: ${out.scrap}</span>`;
    }
    html += `</div>`;
    return html;
  }

  /**
   * Helper to format fields key-value table.
   */
  function renderFieldsTable(fields) {
    if (!Array.isArray(fields) || !fields.length) return '';

    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="table-wrap" style="margin-top:8px; margin-bottom:8px;">
        <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
          <thead>
            <tr>
              <th style="padding:6px 10px; background:var(--line-soft);">${isAr ? 'اسم الحقل (Field Name)' : 'Field Name'}</th>
              <th style="padding:6px 10px; background:var(--line-soft);">${isAr ? 'القيمة / المثال (Example)' : 'Example / Value'}</th>
            </tr>
          </thead>
          <tbody>
            ${fields.map(f => `
              <tr>
                <td style="padding:6px 10px; font-weight:600;">${Topics.escapeHtml(f.field_name || f.name || f.key || '—')}</td>
                <td style="padding:6px 10px; color:var(--teal); font-family:var(--font-mono);">${Topics.escapeHtml(f.example || f.value || f.val || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Helper to format methods table.
   */
  function renderMethodsTable(methods) {
    if (!Array.isArray(methods) || !methods.length) return '';
    return `
      <div class="table-wrap" style="margin-top:8px; margin-bottom:8px;">
        <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
          <thead>
            <tr>
              <th style="padding:6px 10px; background:var(--line-soft);">Method</th>
              <th style="padding:6px 10px; background:var(--line-soft);">Description</th>
            </tr>
          </thead>
          <tbody>
            ${methods.map(m => `
              <tr>
                <td style="padding:6px 10px; font-weight:600; color:var(--brass-deep);">${Topics.escapeHtml(m.method_name || m.name || '—')}</td>
                <td style="padding:6px 10px; color:var(--ink);">${Topics.escapeHtml(m.description || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Special UI Renderer for Multi-ERP comparison matrices.
   */
  function renderComparisonSections(comp) {
    let html = '';
    const sectionLabels = {
      definition: '💡 التعريف والجمهور المستهدف (Overview & Scope)',
      chart_of_accounts: '📑 هيكل الدليل المحاسبي (Chart of Accounts Structure)',
      features: '⚡ الميزات التشغيلية والمالية (Operational & Financial Features)',
      customization: '🛠️ المرونة والتخصيص (Customization & Extensions)',
      cost: '💰 التكلفة والاستضافة (Cost & Hosting)',
      scalability: '📈 إمكانية التوسع (Scalability)',
      support: '🤝 الدعم والدول المتاحة (Support & Localization)'
    };

    Object.keys(comp).forEach(secKey => {
      const secData = comp[secKey];
      if (!secData || typeof secData !== 'object') return;

      const title = sectionLabels[secKey] || secKey.toUpperCase().replace(/_/g, ' ');

      html += `
        <div class="card" style="margin-bottom:16px; border-inline-start:4px solid var(--brass); background:var(--surface);">
          <h4 style="margin-top:0; margin-bottom:12px; font-size:15px; color:var(--brass-deep); font-weight:700;">${title}</h4>
          <div class="grid grid-modules" style="gap:12px;">
            ${Object.keys(secData).map(sysKey => {
              const sysVal = secData[sysKey];
              const sysName = sysKey.replace(/_/g, ' ');
              let badgeColor = '#714B67';
              if (sysName.toLowerCase().includes('sap')) badgeColor = '#005691';
              if (sysName.toLowerCase().includes('netsuite')) badgeColor = '#D64000';
              if (sysName.toLowerCase().includes('dynamics')) badgeColor = '#008272';

              return `
                <div style="background:var(--line-soft); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--line);">
                  <span class="badge" style="background:${badgeColor}; color:#fff; font-size:11px; margin-bottom:8px; display:inline-block;">${Topics.escapeHtml(sysName)}</span>
                  ${renderValueContent(sysVal)}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Helper to format accounting journal entries.
   */
  function renderJournalEntriesTable(entries) {
    if (!Array.isArray(entries) || !entries.length) return '';
    return `
      <div class="table-wrap" style="margin-top:10px; margin-bottom:10px;">
        <table>
          <thead>
            <tr>
              <th>Side</th>
              <th>Account Name</th>
              <th style="text-align:end;">Debit</th>
              <th style="text-align:end;">Credit</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(e => `
              <tr>
                <td><span class="badge ${e.side === 'Debit' || e.type === 'Debit' || e.debit ? 'badge-status-mastered' : 'badge-status-learning'}">${Topics.escapeHtml(e.side || e.type || (e.debit ? 'Debit' : 'Credit'))}</span></td>
                <td><strong>${Topics.escapeHtml(e.account || e.account_name || 'Account')}</strong></td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--teal);">${e.debit || e.debit_amount || 0}</td>
                <td style="text-align:end; font-family:var(--font-mono); font-weight:700; color:var(--brass-deep);">${e.credit || e.credit_amount || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Helper to format notes list.
   */
  function renderNotesList(notes) {
    if (!Array.isArray(notes) || !notes.length) return '';
    const isAr = I18n.getLang() === 'ar';
    return `
      <div class="card" style="margin-top:14px; border-inline-start:4px solid var(--teal); background:var(--line-soft);">
        <h4 style="margin-top:0; margin-bottom:8px; font-size:14px; color:var(--teal); font-weight:700;">💡 ${isAr ? 'ملاحظات وإرشادات مهمة' : 'Important Notes & Guidelines'}</h4>
        <ul style="margin:0; padding-inline-start:18px; font-size:13px; color:var(--ink-soft); line-height:1.5;">
          ${notes.map(n => `<li style="margin-bottom:4px;">${renderMarkdownText(String(n))}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  /**
   * Generic recursive formatter for arbitrary JSON structures.
   */
  function renderGenericDataStructure(data, skipKeys = []) {
    if (typeof data !== 'object' || data === null) {
      return `<p style="margin:4px 0; font-size:13px; color:var(--ink);">${renderMarkdownText(String(data))}</p>`;
    }

    if (Array.isArray(data)) {
      return `
        <ul style="margin:6px 0; padding-inline-start:20px;">
          ${data.map(item => `<li style="margin-bottom:6px;">${renderValueContent(item)}</li>`).join('')}
        </ul>
      `;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:12px;">';
    let count = 0;

    Object.keys(data).forEach(key => {
      if (skipKeys.includes(key)) return;
      const val = data[key];
      const formattedKey = key.replace(/_/g, ' ').toUpperCase();

      count++;
      html += `
        <div class="card" style="padding:12px 16px; background:var(--surface); border-inline-start:3px solid var(--brass);">
          <strong style="color:var(--brass-deep); font-size:13px; text-transform:uppercase; font-family:var(--font-mono); display:block; margin-bottom:6px;">📌 ${Topics.escapeHtml(formattedKey)}</strong>
          ${renderValueContent(val)}
        </div>
      `;
    });
    html += '</div>';

    return count > 0 ? html : '';
  }

  /**
   * Helper to format value contents safely inside JSON nodes.
   */
  function renderValueContent(val) {
    if (val === null || val === undefined) return '<span style="color:var(--ink-soft);">—</span>';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return `<div style="font-size:13px; color:var(--ink); line-height:1.5;">${renderMarkdownText(String(val))}</div>`;
    }
    return renderGenericDataStructure(val, []);
  }

  /**
   * Enhanced Markdown text parser.
   */
  function renderMarkdownText(text) {
    if (!text) return '';

    // Remove any leftover raw json fences if plain text contains them
    let cleaned = cleanJsonText(text);

    let escaped = cleaned
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\*\*(.*?)\*\*(.*?)/g, '<strong>$1</strong>$2')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--line-soft); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px;">$1</code>')
      .replace(/^### (.*$)/gim, '<h4 style="margin-top:14px; margin-bottom:6px; color:var(--brass-deep); font-weight:700;">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="margin-top:16px; margin-bottom:8px; color:var(--ink); font-size:16px;">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 style="margin-top:18px; margin-bottom:10px; color:var(--ink); font-size:18px;">$1</h2>')
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
