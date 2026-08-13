/**
 * js/modules.js - High Performance Module Dashboard Renderer
 *
 * PERF FEATURES:
 *  - Skeleton UI Shimmers: Displays table skeletons during fetch
 *  - Memory-based Filtering: Instant 0ms response on status/priority/category dropdown changes
 *  - Fast DocumentFragment insertion for DOM updates
 */

const Modules = (function () {

  async function render(container, moduleId) {
    const mod = State.modulesCache.find(m => m.id === moduleId);
    if (!mod) { container.innerHTML = UI.errorState({ code: 'MODULE_NOT_FOUND' }); return; }

    // PERF: Layout Shimmer UI instead of spinner
    container.innerHTML = `
      <div style="margin-bottom:20px;">${UI.skeleton('kpi')}</div>
      ${UI.skeleton('table')}
    `;

    let allTopics;
    try {
      allTopics = await API.topics({});
    } catch (err) {
      container.innerHTML = UI.errorState(err);
      return;
    }

    const topics = allTopics.filter(t => t.module_id === moduleId);
    const stats   = computeStats(topics);

    container.innerHTML = `
      <div class="grid grid-kpi" style="margin-bottom:20px;">
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.moduleProgress')}</div><div class="kpi-value brass">${stats.progress}%</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.totalTopics')}</div><div class="kpi-value">${topics.length}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.completed')}</div><div class="kpi-value teal">${stats.mastered}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.learning')}</div><div class="kpi-value">${stats.learning}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.knowledgeGaps')}</div><div class="kpi-value rust">${stats.gaps}</div></div>
        <div class="card kpi-card"><div class="kpi-label">${I18n.t('module.mastered')}</div><div class="kpi-value teal">${stats.mastered}</div></div>
      </div>

      <div class="toolbar">
        <div class="field" id="filter-cat-wrap">
          <select id="filter-category">
            <option value="">${I18n.t('module.allCategories')}</option>
            ${_buildCatOptions(moduleId)}
          </select>
        </div>
        <div class="field">
          <select id="filter-status">
            <option value="">${I18n.t('module.allStatuses')}</option>
            ${Topics.STATUS_VALUES.map(s => `<option value="${s}">${I18n.statusLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <select id="filter-priority">
            <option value="">${I18n.t('module.allPriorities')}</option>
            ${Topics.PRIORITY_VALUES.map(p => `<option value="${p}">${I18n.priorityLabel(p)}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="add-gap-btn">${I18n.t('module.addKnowledgeGap')}</button>
      </div>

      <div id="topics-table-wrap"></div>
      <div id="notes-section-wrap-module"></div>
      <div id="ai-insights-section-wrap" style="margin-top:28px; margin-bottom:28px;"></div>
      <div id="categories-section-wrap" style="margin-top:32px;"></div>
    `;

    // ---- topics table ----
    const tableWrap = container.querySelector('#topics-table-wrap');
    const draw = () => {
      const catF  = container.querySelector('#filter-category').value;
      const statF = container.querySelector('#filter-status').value;
      const prioF = container.querySelector('#filter-priority').value;
      let filtered = topics;
      if (catF)  filtered = filtered.filter(t => t.category_id === catF);
      if (statF) filtered = filtered.filter(t => t.status === statF);
      if (prioF) filtered = filtered.filter(t => t.priority === prioF);
      Topics.renderTable(tableWrap, filtered, { emptyHint: I18n.t('empty.startAdding') });
    };
    draw();

    // PERF: Instant 0ms memory filter change
    container.querySelectorAll('#filter-category,#filter-status,#filter-priority')
      .forEach(el => el.addEventListener('change', draw));

    container.querySelector('#add-gap-btn').addEventListener('click', () => {
      Topics.openAddModal(moduleId, () => {
        API.cacheBust('topics');
        Router.go('module', { id: moduleId });
      });
    });

    // ---- notes section ----
    const notesWrap = container.querySelector('#notes-section-wrap-module');
    Notes.renderSection(notesWrap, moduleId);

    // ---- AI Insights Section (Asynchronous 0ms load - Below Notes) ----
    const aiWrap = container.querySelector('#ai-insights-section-wrap');
    loadAIInsightsSection(aiWrap, moduleId);

    // ---- categories section ----
    const catWrap = container.querySelector('#categories-section-wrap');
    const onCategoryChange = () => {
      const sel = container.querySelector('#filter-category');
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = `<option value="">${I18n.t('module.allCategories')}</option>${_buildCatOptions(moduleId)}`;
      if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
      draw();
    };

    Categories.renderSection(catWrap, moduleId, topics, onCategoryChange);
  }

  async function loadAIInsightsSection(wrapEl, moduleId) {
    if (!wrapEl) return;

    wrapEl.innerHTML = `
      <div class="ai-insights-section">
        <div class="ai-insights-header">
          <h3 class="ai-insights-title">✨ ${I18n.t('ai.sectionTitle')}</h3>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-ai-insights">🔄 ${I18n.t('ai.refreshBtn')}</button>
        </div>
        <div id="ai-insights-cards-container">
          <div style="padding:16px;">${UI.skeleton('card')}</div>
        </div>
      </div>
    `;

    const cardsContainer = wrapEl.querySelector('#ai-insights-cards-container');
    const refreshBtn = wrapEl.querySelector('#btn-refresh-ai-insights');

    // Compute canonical MOD-N ID by module position for reliable insight type matching
    const modulesList = (State.modulesCache && State.modulesCache.length) ? State.modulesCache : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const modIdx = modulesList.findIndex(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase());
    const canonicalId = (modIdx >= 0 && DEFAULT_MODULES[modIdx]) ? DEFAULT_MODULES[modIdx].id : moduleId;

    let currentInsights = API.cacheGet('insights:' + moduleId) || getFallbackInsightsLocal(canonicalId);
    let favoritesMap = {};

    const renderInsightsList = () => {
      if (!currentInsights || !currentInsights.length) {
        cardsContainer.innerHTML = `<p style="font-size:13px; color:var(--ink-soft); margin:0;">${I18n.t('ai.error')}</p>`;
        return;
      }

      cardsContainer.innerHTML = currentInsights.map(insight => {
        const isFav = State.isFavorite(insight.id);
        const badgeClass = getBadgeClass(insight.type);

        return `
          <div class="ai-insight-card" data-id="${insight.id}">
            <div class="ai-insight-head">
              <span class="ai-type-badge ${badgeClass}">${Topics.escapeHtml(insight.type || 'INSIGHT')}</span>
              <button class="btn-fav-toggle ${isFav ? 'is-fav' : ''}" data-action="toggle-fav" data-id="${insight.id}">
                ${isFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd')}
              </button>
            </div>
            <h4 style="font-size:15px; font-weight:700; margin:0 0 8px; color:var(--ink);">${Topics.escapeHtml(insight.title)}</h4>
            <div style="font-size:13.5px; color:var(--ink); line-height:1.5; margin-bottom:10px; white-space:pre-wrap;">${Topics.escapeHtml(insight.content)}</div>
            ${insight.example ? `
              <div style="background:var(--paper-raised); border-radius:var(--radius-sm); padding:8px 12px; margin-bottom:8px; font-size:12.5px;">
                <strong>${I18n.t('ai.example')}:</strong> ${Topics.escapeHtml(insight.example)}
              </div>
            ` : ''}
            ${insight.why_it_matters ? `
              <div style="font-size:12.5px; color:var(--ink-soft);">
                <strong>${I18n.t('ai.whyItMatters')}:</strong> ${Topics.escapeHtml(insight.why_it_matters)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      cardsContainer.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const insightId = btn.dataset.id;
          const targetInsight = currentInsights.find(i => String(i.id) === String(insightId));
          if (!targetInsight) return;

          const wasFav = State.isFavorite(insightId);

          // 0ms Instant Real-time State Update
          if (wasFav) {
            State.removeFavorite(insightId, insightId);
          } else {
            State.addFavorite({
              insight_id: insightId,
              module_id: moduleId,
              title: targetInsight.title,
              type: targetInsight.type,
              content: targetInsight.content,
              example: targetInsight.example || '',
              why_it_matters: targetInsight.why_it_matters || ''
            });
          }

          btn.classList.toggle('is-fav', !wasFav);
          btn.innerHTML = !wasFav ? '★ ' + I18n.t('ai.favoriteRemove') : '☆ ' + I18n.t('ai.favoriteAdd');
          UI.toast(!wasFav ? (I18n.getLang() === 'ar' ? 'تمت الإضافة للمفضلة' : 'Saved to favorites') : I18n.t('favorites.removedToast'), 'info');

          try {
            if (wasFav) {
              await API.removeFavorite({ insight_id: insightId });
            } else {
              await API.addFavorite({
                insight_id: insightId,
                module_id: moduleId,
                title: targetInsight.title,
                type: targetInsight.type,
                content: targetInsight.content,
                example: targetInsight.example || '',
                why_it_matters: targetInsight.why_it_matters || ''
              });
            }
          } catch (err) {
            UI.toastError(err);
          }
        });
      });
    };

    // 0ms Instant First Paint!
    renderInsightsList();

    // Background Async Fetch & Sync
    API.getFavorites().then(favs => {
      if (favs && Array.isArray(favs)) {
        State.setFavorites(favs);
        renderInsightsList();
      }
    }).catch(() => {});

    API.getModuleInsights(moduleId).then(res => {
      if (res && Array.isArray(res.insights) && res.insights.length > 0) {
        currentInsights = res.insights;
        renderInsightsList();
      }
    }).catch(() => {});

    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        if (!confirm(I18n.t('ai.refreshConfirmBody'))) return;
        refreshBtn.disabled = true;
        cardsContainer.innerHTML = `<div style="padding:16px;">${UI.skeleton('card')}</div>`;
        try {
          const freshRes = await API.refreshModuleInsights(moduleId);
          currentInsights = (freshRes && Array.isArray(freshRes.insights)) ? freshRes.insights : [];
          renderInsightsList();
          UI.toast(I18n.getLang() === 'ar' ? 'تمت إضافة الـ Insights الجديدة بنجاح' : 'New AI Insights generated', 'success');
        } catch (err) {
          renderInsightsList();
          UI.toastError(err);
        } finally {
          refreshBtn.disabled = false;
        }
      });
    }
  }

  function getBadgeClass(type) {
    const t = String(type || '').toLowerCase();
    if (t.includes('tip')) return 'ai-type-tip';
    if (t.includes('trick')) return 'ai-type-trick';
    if (t.includes('business') || t.includes('process')) return 'ai-type-business';
    if (t.includes('mistake') || t.includes('error')) return 'ai-type-mistake';
    if (t.includes('warn')) return 'ai-type-warning';
    if (t.includes('practice') || t.includes('best')) return 'ai-type-practice';
    if (t.includes('account') || t.includes('tax')) return 'ai-type-accounting';
    return 'ai-type-default';
  }

  function getFallbackInsightsLocal(moduleId) {
    const isAr = I18n.getLang() === 'ar';
    const modulesList = (State.modulesCache && State.modulesCache.length) ? State.modulesCache : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    let modObj = modulesList.find(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase());
    if (!modObj) {
      // Fallback: extract numeric index from canonical IDs like MOD-1, MOD-2…
      const numMatch = String(moduleId || '').match(/\d+/);
      if (numMatch) {
        const idx = parseInt(numMatch[0], 10) - 1;
        if (idx >= 0 && idx < modulesList.length) modObj = modulesList[idx];
      }
    }
    const modName = modObj ? I18n.localizedName(modObj) : (isAr ? 'الموديول الحالي' : 'Current Module');

    // Build a composite key from the module's English name + Arabic name + moduleId for reliable matching
    const nameEn = String(modObj ? (modObj.name_en || '') : '').toLowerCase();
    const nameAr = String(modObj ? (modObj.name_ar || '') : '').toLowerCase();
    const idLower = String(moduleId || '').toLowerCase();
    const modLower = nameEn + ' ' + nameAr + ' ' + idLower;

    // 1. Inventory (المخزون)
    if (modLower.includes('inventory') || modLower.includes('mod-1') || modLower.includes('مخزون')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'الربط التلقائي بين تقييم المخزون والقيود المحاسبية' : 'Automated Inventory Valuation & Journal Entries',
          type: 'Accounting Impact',
          content: isAr ? 'عند اختيار طريقة FIFO أو Average Cost، تأكد من ضبط إعدادات الفئات (Product Categories) على "Automated" لترحيل قيود كلفة البضاعة المباعة (COGS) وحساب الفروقات فورياً مع كل حركة مخزنية.' : 'When using FIFO or Average Cost, ensure Product Categories valuation is set to Automated to trigger real-time COGS and valuation ledger entries.',
          example: isAr ? 'تسليم شحنة مبيعات يقود القيد: من ح/ كلفة البضاعة المباعة إلى ح/ المخزون.' : 'Sales delivery auto-posts: Dr COGS, Cr Inventory.',
          why_it_matters: isAr ? 'يمنع تسوية التكاليف يدوياً بنهاية الشهر ويضمن دقة القوائم المالية.' : 'Prevents manual month-end cost reconciliations and guarantees real-time balance sheet accuracy.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'فحص التسويات المخزنية (Stock Adjustments)' : 'Audit Trail on Stock Adjustments',
          type: 'Common Mistake',
          content: isAr ? 'عدم تحديد سبب التسوية المخزنية (تلف، سرقة، عينة تجارية) يجعل تتبع الخسائر صعباً على الإدارة المالية.' : 'Not recording adjustment reason codes (damage, sample, theft) obscures variance analysis in financial reporting.',
          example: isAr ? 'إنشاء حسابات مصاريف مستهدفة لكل سبب تسوية بدل حساب واحد عام.' : 'Map Scrap/Damage to specific Expense Accounts instead of a generic Loss Account.',
          why_it_matters: isAr ? 'يساعد في تقليل الهدر وزيادة رقابة المخازن.' : 'Improves internal control and inventory shrinkage visibility.'
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'إعادة الطلب التلقائية (Reordering Rules)' : 'Automated Reordering Rules & Buffer Safety',
          type: 'Tip',
          content: isAr ? 'حدد الحد الأدنى والأقصى لكل منتج بناءً على زمن التوريد (Lead Time) لتجنب انقطاع المخزون دون تجميد السيولة.' : 'Set Minimum and Maximum safety stock levels based on Lead Time to prevent stockouts without overcapitalizing cash.',
          example: isAr ? 'منتج بـ Lead Time 10 أيام واستهلاك يومي 5 قطع -> الحد الأدنى 50 قطعة.' : 'Lead time 10 days + 5 daily sales = Min safety stock 50 units.',
          why_it_matters: isAr ? 'رفع الكفاءة التشغيلية وحماية المبيعات من التوقف.' : 'Optimizes working capital and avoids lost sales.'
        }
      ];
    }

    // 2. Accounting (الحسابات)
    if (modLower.includes('account') || modLower.includes('mod-2') || modLower.includes('حسابات')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'إقفال الفترات المالية وتثبيت القيود (Period Lock)' : 'Period Lock & Journal Entry Controls',
          type: 'Best Practice',
          content: isAr ? 'قم بإغلاق الفترة المالية شهرياً لمنع تعديل القيود المحاسبية السابقة بعد اعتماد التقارير.' : 'Lock accounting periods monthly to prevent back-dated entries after financial statements approval.',
          example: isAr ? 'تحديد تاريخ الإقفال (Lock Date) في نهاية كل شهر ميلادي.' : 'Set Lock Date on the last day of each calendar month.',
          why_it_matters: isAr ? 'يحمي سلامة البيانات المالية المعتمدة أمام المراجعين والجهات الضريبية.' : 'Ensures financial integrity and compliance with external audit standards.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'تسوية الحسابات البنكية اليومية (Bank Reconciliation)' : 'Daily Automated Bank Reconciliation',
          type: 'Process Insight',
          content: isAr ? 'مطابقة التدفقات النقدية والودائع البنكية يومياً تكتشف الأخطاء والشيكات المعلقة مبكراً.' : 'Reconciling bank feeds daily catches duplicate transactions and uncollected checks early.',
          example: isAr ? 'استيراد ملفات MT940 / CAMT.053 للتسوية الآلية.' : 'Import MT940 statement files for auto-matching.',
          why_it_matters: isAr ? 'ضمان دقة الرصيد النقدي وتفادي التحايل.' : 'Guarantees accurate liquidity management and fraud protection.'
        }
      ];
    }

    // 3. HR (الموارد البشرية)
    if (modLower.includes('hr') || modLower.includes('mod-6') || modLower.includes('human') || modLower.includes('بشرية') || modLower.includes('موارد')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'حساب مكافأة نهاية الخدمة التلقائي (EOS Calculation)' : 'Automated End-of-Service (EOS) & Gratuity Rules',
          type: 'Accounting Impact',
          content: isAr ? 'تأكد من إعداد معادلات نهاية الخدمة طبقاً لقانون العمل المحلي وترحيل المخصص المحاسبي شهرياً لمواجهة الالتزامات المالية المستقبليّة.' : 'Ensure End-of-Service accrual formulas comply strictly with labor laws and auto-post monthly provision ledgers.',
          example: isAr ? 'استحقاق شهري: قيد من ح/ مخصص مكافأة نهاية الخدمة إلى ح/ مخصص مجمع الالتزام.' : 'Monthly accrual: Dr Gratuity Expense, Cr Gratuity Provision Liability.',
          why_it_matters: isAr ? 'تجنب المفاجآت المالية عند إنهاء عقود الموظفين والتأكد من دقة مخصصات الشركة.' : 'Prevents unbudgeted financial shocks upon contract terminations.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'تنبيهات انتهاء وثائق الموظفين (Document Expiry Alerts)' : 'Automated Employee Document Expiry Alerts',
          type: 'Tip',
          content: isAr ? 'تفعيل تنبيهات 30 إلى 60 يوماً قبل انتهاء الإقامات، جوازات السفر، والعقود تجنباً للغرامات الحكومية وتوقف العمل.' : 'Set auto-alerts 30-60 days prior to Iqama, Passport, and Contract renewals to eliminate government fines.',
          example: isAr ? 'إرسال إشعار تلقائي لمدير HR قبل 45 يوماً من انتهاء رخصة عمل موظف حرج.' : 'Auto-email sent to HR Manager 45 days before key engineer residency expires.',
          why_it_matters: isAr ? 'ضمان الاستمرارية القانونية والتشغيلية لكافة العاملين.' : 'Ensures 100% legal compliance and workforce continuity.'
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'ربط الحضور والانصراف بمسيرات الرواتب (Attendance & Payroll Sync)' : 'Attendance Sync with Automated Payroll Deduction',
          type: 'Best Practice',
          content: isAr ? 'ربط البصمة ومسيرات الرواتب تمنع الأخطاء اليدوية في احتساب التأخيرات والغياب والساعات الإضافية.' : 'Linking biometric logs directly with payroll prevents manual calculation mistakes on overtime and absences.',
          example: isAr ? 'تطبيق الخصم التلقائي لغياب بدون عذر وتأكيد ساعات Overtime المعتمدة فقط.' : 'Auto-deduct unexcused absences while approving pre-authorized overtime hours.',
          why_it_matters: isAr ? 'يوفر عشرات الساعات شهرياً لفريق الموارد البشرية ويقضي على الخلافات.' : 'Saves HR teams dozens of hours monthly and eliminates employee disputes.'
        }
      ];
    }

    // 4. Maintenance (الصيانة)
    if (modLower.includes('maint') || modLower.includes('mod-3') || modLower.includes('صيانة')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'جدولة الصيانة الوقائية بالعدادات (Preventive Maintenance)' : 'Meter & Meter-Hour Triggered Maintenance',
          type: 'Best Practice',
          content: isAr ? 'ربط خطط الصيانة الوقائية بساعات التشغيل (Operating Hours) أو العدادات يمنع الأعطال المفاجئة ويرفع عمر المعدات.' : 'Triggering preventive maintenance Work Orders by running hours or odometer readings prevents unexpected equipment breakdowns.',
          example: isAr ? 'إنشاء أمر صيانة تلقائي لمولد عند الوصول لـ 250 ساعة عمل.' : 'Auto-generate Work Order for generator oil change upon reaching 250 operating hours.',
          why_it_matters: isAr ? 'تخفيض تكاليف الأعطال الطارئة الكبيرة بنسبة تصل إلى 40%.' : 'Reduces emergency repair costs by up to 40%.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'ربط قطع الغيار بأوامر الشغل (Spare Parts Linking)' : 'Linking Parts Consumption to Work Orders',
          type: 'Common Mistake',
          content: isAr ? 'صرف قطع الغيار من المخزن بدون ربطها برقم أمر صيانة محدد يضيع تكلفة الصيانة الحقيقية لكل معدة.' : 'Issuing spare parts without linking them to a specific Work Order hides true maintenance costs per asset.',
          example: isAr ? 'إلزام الفني بمسح باركود القطعة وإسنادها لرقم أمر الشغل قبل الإخراج من المخزن.' : 'Require technicians to scan part barcode against active Work Order ID.',
          why_it_matters: isAr ? 'تحديد المعدات المتهالكة التي تستهلك مصاريف صيانة أعلى من قيمتها.' : 'Identifies money-pit assets consuming excessive maintenance budgets.'
        }
      ];
    }

    // 5. Assets (الأصول)
    if (modLower.includes('asset') || modLower.includes('mod-4') || modLower.includes('أصول')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'إهلاك الأصول الآلي شهرياً (Automated Asset Depreciation)' : 'Automated Monthly Depreciation Posting',
          type: 'Accounting Impact',
          content: isAr ? 'ضبط جداول إهلاك الأصول لتوليد القيود المحاسبية الإهلاكية آلياً بنهاية كل شهر دون تدخل يدوي.' : 'Schedule asset depreciation tables to auto-post monthly depreciation journal entries.',
          example: isAr ? 'قيد شهري تلقائي: من ح/ مصروف إهلاك الآلات إلى ح/ مجمع إهلاك الآلات.' : 'Monthly auto-entry: Dr Machinery Depreciation Expense, Cr Accumulated Depreciation.',
          why_it_matters: isAr ? 'يضمن مطابقة صافي القيمة الدفترية للأصول في الميزانية العمومية.' : 'Guarantees accurate Net Book Value on monthly balance sheets.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'الجرود السنوية بـ Barcode / RFID الأصول' : 'Asset Barcode Audit & Physical Verification',
          type: 'Tip',
          content: isAr ? 'استخدام الباركود لتطابق الأصول الميدانية مع سجل الأصول الثابتة تكتشف الأصول المفقودة أو المنقولة بدون إذن.' : 'Using barcodes for annual asset audits matches physical items with Fixed Asset Register ledgers.',
          example: isAr ? 'مسح باركود الأجهزة في فرع جديد وتحديث مواقعها الجغرافية تلقائياً.' : 'Scan asset barcodes during branch inspection to update real-time asset location tags.',
          why_it_matters: isAr ? 'حماية أصول الشركة من الفقدان والسرقة وتحسين الرقابة الداخلية.' : 'Prevents asset leakage and guarantees internal audit readiness.'
        }
      ];
    }

    // 6. Transportation (النقليات)
    if (modLower.includes('trans') || modLower.includes('fleet') || modLower.includes('mod-5') || modLower.includes('نقليات') || modLower.includes('مركبات')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'مراقبة معدل استهلاك الوقود لكل 100 كم (Fuel Consumption Ratio)' : 'Vehicle Fuel Efficiency & Theft Detection Ratio',
          type: 'Process Insight',
          content: isAr ? 'مقارنة لترات الوقود المستهلكة بالمسافة المقطوعة تكتشف سرقات الوقود أو مشاكل المحرك مبكراً.' : 'Comparing fuel liters filled against GPS distance traveled spots fuel theft or engine deterioration early.',
          example: isAr ? 'شاحنة تستهلك 35 لتر/100 كم قفز استهلاكها إلى 50 لتر -> إرسال التنبيه للصيانة والتحقيق.' : 'Truck consumption jumping from 35L/100km to 50L/100km triggers maintenance alert.',
          why_it_matters: isAr ? 'تخفيض فاتورة الوقود التي تشكل الجزء الأكبر من مصاريف النقليات.' : 'Cuts the single largest operational expense category in fleet management.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'أذون الشحن المربوطة بالمبيعات (Waybills & Freight Invoicing)' : 'Waybill Integration with Customer Freight Billing',
          type: 'Best Practice',
          content: isAr ? 'ربط رحلة السائق بأمر الشحن الإلكتروني يمنع تنفيذ الرحلات غير المفوترة ويضمن تحصيل مصاريف النقل.' : 'Linking driver trip dispatches to electronic waybills ensures zero unbilled freight trips.',
          example: isAr ? 'إصدار فاتورة شحن تلقائية للعميل فور تأكيد السائق الاستلام عبر تطبيق الجوال.' : 'Auto-generate freight invoice upon driver Proof of Delivery (POD) confirmation.',
          why_it_matters: isAr ? 'تسريع تحصيل الإيرادات ومنع تشغيل الشاحنات في رحلات خاصة غير مصرح بها.' : 'Accelerates cash collection and prevents unauthorized truck usage.'
        }
      ];
    }

    // 7. Real Estate (العقارات)
    if (modLower.includes('real') || modLower.includes('estate') || modLower.includes('mod-7') || modLower.includes('عقارات') || modLower.includes('عقار')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'توزيع الإيراد المؤجل للإيجارات (Deferred Rent Revenue)' : 'Accrual Accounting on Deferred Rental Revenue',
          type: 'Accounting Impact',
          content: isAr ? 'تحصيل الإيجار سنوياً أو نصف سنوياً يتطلب اعترافاً شهرياً متساوياً بالإيراد مع احتساب الإيراد المؤجل.' : 'Receiving annual rent upfront requires monthly linear revenue recognition via Unearned Rent Liability accounts.',
          example: isAr ? 'عقد إيجار 120,000 ريال سنوياً -> إثبات إيراد 10,000 ريال شهرياً.' : 'Annual rent 120k -> recognize 10k monthly revenue entry.',
          why_it_matters: isAr ? 'تقديم قائمة دخل دقيقة تعبر عن الأداء الفعلي لكل شهر.' : 'Presents accurate monthly profit & loss statements.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'إدارة التجديدات الشاغرة مبكراً (Vacancy & Renewal Alerts)' : 'Automated Lease Expiry & Renewal Pipeline',
          type: 'Tip',
          content: isAr ? 'تفعيل تنبيهات 60 يوماً قبل انتهاء العقود يزيد نسبة تجديد العقود وتخفيض فترات شغور الوحدات.' : 'Alerting property managers 60 days before lease expiration boosts tenant retention and drops vacancy rates.',
          example: isAr ? 'إرسال عروض التجديد الآلية عبر الإيميل/الواتساب للمستأجر قبل شهرين.' : 'Auto-send renewal terms via email/WhatsApp 60 days prior to contract expiry.',
          why_it_matters: isAr ? 'حماية التدفقات النقدية واستقرار عوائد المحفظة العقارية.' : 'Protects cash flow and stabilizes portfolio yield.'
        }
      ];
    }

    // 8. Contracting (المقاولات)
    if (modLower.includes('contract') || modLower.includes('mod-8') || modLower.includes('مقاولات') || modLower.includes('مشروع')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'شهادات إنجاز الأعمال والمحتجزات (IPC & Retention Accounting)' : 'Interim Payment Certificate (IPC) & Retention Accounting',
          type: 'Accounting Impact',
          content: isAr ? 'إثبات المستخلصات الجارية وحسم نسبة المحتجزات (Retention 5-10%) تلقائياً لحين المستخلص النهائي.' : 'Auto-calculate progress billings and retention deductions (5-10%) until final project handover.',
          example: isAr ? 'مستخلص 500k -> 450k ح/ العملاء و 50k ح/ محتجزات عقود لدى الاستشاري.' : '500k IPC -> 450k Accounts Receivable, 50k Retention Receivable.',
          why_it_matters: isAr ? 'ضمان تتبع الأموال المحتجزة لدى ملاك المشاريع وعدم ضياعها.' : 'Guarantees accurate tracking of retention receivables due upon project closeout.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'مقارنة التكلفة الفعلية بالميزانية (BOQ Cost Variance)' : 'Bill of Quantities (BOQ) Budget vs Actual Control',
          type: 'Best Practice',
          content: isAr ? 'مقارنة تكاليف العمالة والمواد والعدات الفعلية ببند جدول الكميات (BOQ) فور تسجيل كل فاتورة أو صرفية.' : 'Comparing actual material, labor, and equipment expenses against BOQ baseline caps cost overruns early.',
          example: isAr ? 'تنبيه مدير المشروع فور تجاوز صرف مادة الخرسانة 90% من الميزانية المعتمدة.' : 'Trigger red flag when concrete material expenses hit 90% of allocated BOQ line item.',
          why_it_matters: isAr ? 'حماية هامش ربح المشروع وتجنب الانحرافات التكلفية الحادة.' : 'Protects project profit margins from cost overruns.'
        }
      ];
    }

    // 9. Fuel Stations (الوقود)
    if (modLower.includes('fuel') || modLower.includes('mod-9') || modLower.includes('وقود') || modLower.includes('محطة')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'تسوية قراءات العدادات ومبيعات الورديات (Shift Nozzle Reconciliation)' : 'Shift Meter Reading & Cash Collection Reconciliation',
          type: 'Process Insight',
          content: isAr ? 'مطابقة الفارق بين قراءة العداد الإلكتروني للمضخة والمبالغ المحصلة نائياً وشركة الصرافة بعد كل وردية.' : 'Reconciling pump nozzle meter deltas against cash and POS card receipts per shift stops leakage.',
          example: isAr ? 'عداد المضخة سجل 1000 لتر (7000 ريال) -> التحقق من تحصيل 7000 ريال كاش+شبكة.' : 'Nozzle meter indicates 1000L ($2000) -> verify exact POS + cash match before shift signoff.',
          why_it_matters: isAr ? 'كشف عجز الورديات وتحديد المسؤولية فورياً على عامل الوردية.' : 'Highlights shift variances and assigns immediate accountability.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'تحليل الفروقات اليومية لخزانات الوقود (Tank Variance Analysis)' : 'Underground Tank Dip Reading vs Sales Variance',
          type: 'Common Mistake',
          content: isAr ? 'إهمال مطابقة قياسات الخزانات الأرضية Daily Dip Readings تسبب في عدم اكتشاف تهريب الوقود أو أخطاء التكاليف.' : 'Ignoring daily underground tank dip gauge checks hides fuel leaks or thermal expansion losses.',
          example: isAr ? 'فارق يظهر بين المخزون الدفتري والفعلي يتجاوز 0.5% -> إرسال فريق الفحص لمعايرة المضخات.' : 'Variance exceeding 0.5% triggers calibration and leak inspection dispatch.',
          why_it_matters: isAr ? 'تجنب الخسائر البيئية والمالية الفادحة الناجمة عن التسريبات.' : 'Prevents severe environmental and financial losses from undetected tank leaks.'
        }
      ];
    }

    // 10. Law Firm (المحاماة)
    if (modLower.includes('law') || modLower.includes('legal') || modLower.includes('mod-10') || modLower.includes('محاماة') || modLower.includes('قانون')) {
      return [
        {
          id: 'AI-' + moduleId + '-1', module_id: moduleId,
          title: isAr ? 'متابعة مواعيد الجلسات القضائية والتنبيه الآلي (Court Session Deadlines)' : 'Court Session & Hearing Calendar Auto-Sync',
          type: 'Tip',
          content: isAr ? 'ربط التقويم الآلي بمواعيد الجلسات ومدد الطعن والاستئناف يمنع فوات المواعيد النظامية للقضايا.' : 'Auto-syncing court hearing dates and appeal deadlines with lawyer calendars prevents missed legal cutoffs.',
          example: isAr ? 'تنبيه تلقائي للمحامي المكلف بالذات قبل 3 أيام من موعد تقديم اللائحة الاعتراضية.' : 'Auto-reminder sent to assigned attorney 3 days before appeal submission deadline.',
          why_it_matters: isAr ? 'حماية حقوق العملاء وتجنب شطب القضايا بسبب التخلف عن الجلسات.' : 'Protects client rights and eliminates default judgments due to missed dates.'
        },
        {
          id: 'AI-' + moduleId + '-2', module_id: moduleId,
          title: isAr ? 'احتساب ساعات العمل القابلة للفوترة (Billable Hours Tracking)' : 'Billable Hours & Legal Retainer Accounting',
          type: 'Best Practice',
          content: isAr ? 'تسجيل ساعات الاستشارات والارتباطات القضائية بدقة وتخصيصها لرقم القضية يضمن صدور الفواتير بدقة.' : 'Logging attorney consultation hours against case IDs ensures accurate client billing and retainer burn tracking.',
          example: isAr ? 'تحويل 5 ساعات دراسة قضية تلقائياً إلى فاتورة العميل بناءً على السعر المتفق عليه.' : 'Convert 5 hours case research directly into client draft invoice at contracted hourly rate.',
          why_it_matters: isAr ? 'تعظيم إيرادات مكتب المحاماة وضمان شفافية أتعاب القضايا.' : 'Maximizes law firm profitability and maintains client fee transparency.'
        }
      ];
    }

    return [
      {
        id: 'AI-' + moduleId + '-1', module_id: moduleId,
        title: isAr ? 'أفضل الممارسات لتنظيم وتوثيق ' + modName : 'Best Practices for ' + modName,
        type: 'Best Practice',
        content: isAr ? 'ربط العمليات الحقلية بموديول ' + modName + ' يسهم في بناء قاعدة بيانات دقيقة لاتخاذ القرارات الإدارية.' : 'Integrating field operations with the ' + modName + ' module establishes data consistency across all business units.',
        example: isAr ? 'اعتماد نماذج موحدة لإدخال البيانات وتحديد الأذونات بناءً على الأدوار الوظيفية.' : 'Standardize data entry forms and enforce role-based permission controls.',
        why_it_matters: isAr ? 'تسريع الدورة التشغيلية وتقليل الأخطاء البشرية.' : 'Accelerates workflow cycle times and eliminates manual entry errors.'
      },
      {
        id: 'AI-' + moduleId + '-2', module_id: moduleId,
        title: isAr ? 'الرقابة والتحليل الدوري لعمليات ' + modName : 'Periodic Process Review for ' + modName,
        type: 'Process Insight',
        content: isAr ? 'مراجعة التقارير الدورية وتحليل الانحرافات تضمن كفاءة استخدام الموارد في موديول ' + modName + '.' : 'Regularly reviewing operational KPIs and variances ensures optimal resource allocation in ' + modName + '.',
        example: isAr ? 'مقارنة التكاليف الفعلية بالميزانية التقديرية بشكل شهري.' : 'Compare actual operational costs against budgeted targets monthly.',
        why_it_matters: isAr ? 'تحسين الربحية وضمان الامتثال للسياسات الإدارية.' : 'Boosts profitability and maintains policy compliance.'
      }
    ];
  }

  function _buildCatOptions(moduleId) {
    return State.categoriesForModule(moduleId)
      .map(c => `<option value="${c.id}">${I18n.localizedName(c)}</option>`)
      .join('');
  }

  function computeStats(topics) {
    const total = topics.length;
    const sum   = topics.reduce((a, t) => a + Number(t.progress || 0), 0);
    return {
      progress:  total ? Math.round(sum / total) : 0,
      mastered:  topics.filter(t => t.status === 'Mastered').length,
      practiced: topics.filter(t => t.status === 'Practiced').length,
      learning:  topics.filter(t => t.status === 'Learning').length,
      gaps:      topics.filter(t => t.status === 'Not Started' || t.status === 'Learning').length,
    };
  }

  return { render, getFallbackInsightsLocal };
})();
