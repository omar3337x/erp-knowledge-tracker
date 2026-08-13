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
    const modulesList = (State.modulesCache && State.modulesCache.length) ? State.modulesCache : (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : []);
    const mod = modulesList.find(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase())
      || (typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES.find(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase()) : null);
    if (!mod) { container.innerHTML = UI.errorState({ code: 'MODULE_NOT_FOUND' }); return; }

    // PERF: Layout Shimmer UI instead of spinner
    container.innerHTML = `
      <div style="margin-bottom:20px;">${UI.skeleton('kpi')}</div>
      ${UI.skeleton('table')}
    `;

    let allTopics;
    // PERF: Read from prefetchAll batch cache (topics:{}) — 0ms if batch already done
    const cachedTopics = API.cacheGet('topics:{}', 'topics');
    if (cachedTopics && Array.isArray(cachedTopics)) {
      allTopics = cachedTopics;
    } else {
      // Batch still in-flight: poll up to 3s in 300ms increments, then fallback to direct call
      let waited = 0;
      while (waited < 3000) {
        await new Promise(r => setTimeout(r, 300));
        waited += 300;
        const poll = API.cacheGet('topics:{}', 'topics');
        if (poll && Array.isArray(poll)) { allTopics = poll; break; }
      }
      if (!allTopics) {
        try {
          allTopics = await API.topics({});
        } catch (err) {
          container.innerHTML = UI.errorState(err);
          return;
        }
      }
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

    // PERF: Read favorites from prefetchAll batch cache (no extra GAS request)
    const cachedFavs = API.cacheGet('getFavorites:{}', 'getFavorites');
    if (cachedFavs && Array.isArray(cachedFavs)) {
      State.setFavorites(cachedFavs);
      renderInsightsList();
    } else {
      // Fallback: fetch only if not in cache yet
      API.getFavorites().then(favs => {
        if (favs && Array.isArray(favs)) {
          State.setFavorites(favs);
          renderInsightsList();
        }
      }).catch(() => {});
    }

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
    const defaultList = typeof DEFAULT_MODULES !== 'undefined' ? DEFAULT_MODULES : [];
    const stateList = (State.modulesCache && State.modulesCache.length) ? State.modulesCache : defaultList;

    // 1. Direct match in DEFAULT_MODULES first by ID (e.g., MOD-1..MOD-10)
    let defObj = defaultList.find(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase());
    
    // 2. Direct match in State.modulesCache by ID
    let stateObj = stateList.find(m => String(m.id).toLowerCase() === String(moduleId).toLowerCase());
    
    // 3. Fallback via index if numeric (MOD-10 -> idx 9)
    if (!defObj && !stateObj) {
      const numMatch = String(moduleId || '').match(/\d+/);
      if (numMatch) {
        const idx = parseInt(numMatch[0], 10) - 1;
        if (idx >= 0 && idx < defaultList.length) defObj = defaultList[idx];
        if (idx >= 0 && idx < stateList.length) stateObj = stateList[idx];
      }
    }

    const targetObj = defObj || stateObj;
    const modName = targetObj ? I18n.localizedName(targetObj) : (isAr ? 'الموديول الحالي' : 'Current Module');

    const nameEn = String(targetObj ? (targetObj.name_en || '') : '').toLowerCase();
    const nameAr = String(targetObj ? (targetObj.name_ar || '') : '').toLowerCase();
    const idLower = String(moduleId || '').toLowerCase();
    const modLower = nameEn + ' ' + nameAr + ' ' + idLower;

    // 1. Inventory (المخزون)
    if (modLower.includes('inventory') || modLower.includes('مخزون') || /\bmod-1\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تفعيل تتبع الرقم التسلسلي والتشغيلة (Serial & Batch Tracking)' : 'Serial & Batch Number Lot Tracking',
          type: 'Best Practice',
          content: isAr ? 'تفعيل تتبع الباتش وتواريخ الصلاحية يحمي الشركات الغذائية والدوائية من تداول المنتجات المنتهية الصلاحية.' : 'Enabling Lot & Serial tracking ensures strict FEFO/FIFO dispatching and fast product recall management.',
          example: isAr ? 'سحب دفعة منتجات محددة برقم الباتش فور اكتشاف عيب مصنعي.' : 'Isolate specific batch numbers immediately upon supplier quality advisory.',
          why_it_matters: isAr ? 'ضمان جودة المنتجات وحماية الشركة من القضايا والتعويضات.' : 'Ensures regulatory compliance and protects brand reputation.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'تحليل مخزون الراكد والبطيء (ABC & Deadstock Analysis)' : 'ABC Classification & Deadstock Reduction',
          type: 'Process Insight',
          content: isAr ? 'تصنيف المنتجات حسب القيمة والتداول (ABC) يركز الجهود الرقابية على 20% من المنتجات التي تشكل 80% من قيمة المخزون.' : 'Categorizing inventory into ABC tiers concentrates auditing controls on high-value A-class items.',
          example: isAr ? 'عمل جرد أسبوعي لفئة A وجرد ربع سنوي لفئة C.' : 'Perform weekly cycle counts for A-class items and quarterly counts for C-class.',
          why_it_matters: isAr ? 'التخلص من المخزون الميت وتحرير السيولة المجمدة.' : 'Frees up locked working capital and reduces warehouse holding costs.'
        }
      ];
    }

    // 2. Accounting (الحسابات)
    if (modLower.includes('account') || modLower.includes('حسابات') || /\bmod-2\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'الاعتماد الآلي للفواتير والضرائب (Automated E-Invoicing & E-Tax)' : 'Automated E-Invoicing & Tax Reporting Sync',
          type: 'Tip',
          content: isAr ? 'ربط فواتير المبيعات والمشتريات بنظام الفوترة الإلكترونية والضريبة يضمن تقديم الإقرارات الضريبية دون أخطاء.' : 'Integrating sales and purchase invoices directly with national tax portals eliminates manual VAT reporting errors.',
          example: isAr ? 'توليد كود QR وقيد ضريبة القيمة المضافة تلقائياً مع كل فاتورة مبيعات.' : 'Auto-generate QR XML payload and VAT output ledger entry on invoice confirmation.',
          why_it_matters: isAr ? 'تجنب غرامات التأخير وعدم التطابق الضريبي.' : 'Prevents costly late-filing tax penalties and non-compliance fines.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تسوية حسابات الوسيط والمقاصة (Intercompany & Clearing Accounts)' : 'Intercompany & Clearing Account Settlement',
          type: 'Accounting Impact',
          content: isAr ? 'تصفية حسابات التحويلات البنكية وحسابات المشتريات المعلقة نهاية كل شهر يمنع تضخم الحسابات الوسيطة.' : 'Reconciling transit and clearing ledgers monthly prevents unmapped balance sheet bloat.',
          example: isAr ? 'قيد تسوية: من ح/ البنك المستلم إلى ح/ نقدية في الطريق.' : 'Clearing entry: Dr Receiving Bank, Cr Cash-in-Transit.',
          why_it_matters: isAr ? 'يضمن مطابقة الحسابات المالية بين الفروع والشركات الشقيقة.' : 'Guarantees clean intercompany ledger balance matching.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'مراقبة الديون المعدومة وتخصيص التعثر (Bad Debts Provisioning)' : 'Bad Debts Provisioning & Aging Schedule',
          type: 'Common Mistake',
          content: isAr ? 'إهمال تقارير تعمير الديون (Aging Report) يؤدي إلى تراكم ديون معدومة غير مخصص لها حسابياً.' : 'Ignoring customer A/R aging buckets leads to sudden unbudgeted write-offs of bad debts.',
          example: isAr ? 'احتساب مخصص 5% للديون المتأخرة فوق 90 يوماً و50% لفوق 180 يوماً.' : 'Provision 5% for >90 days overdue and 50% for >180 days overdue.',
          why_it_matters: isAr ? 'حماية رأس المال العامل وصحة قائمة المركز المالي.' : 'Protects balance sheet asset quality and working capital health.'
        }
      ];
    }

    // 3. HR (الموارد البشرية)
    if (modLower.includes('hr') || modLower.includes('human') || modLower.includes('بشرية') || modLower.includes('موارد') || /\bmod-6\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'أتمتة طلبات الإجازات والتأشيرات (Self-Service Leave Workflow)' : 'Employee Self-Service Leave & Visa Automation',
          type: 'Process Insight',
          content: isAr ? 'تمكين الموظفين من تقديم طلبات الإجازات وتأشيرات الخروج والعودة عبر تطبيق الخدمة الذاتية يقلل المعاملات الورقية.' : 'Employee self-service portals streamline leave requests, exit/re-entry visas, and salary certificates without HR bottlenecks.',
          example: isAr ? 'خصم رصيد الإجازة التلقائي فور خصم الاعتماد من المدير المباشر.' : 'Auto-deduct leave balance upon direct manager approval signoff.',
          why_it_matters: isAr ? 'رفع رضا الموظفين وتقليل الهدر الإداري لخدمات الأفراد.' : 'Improves employee satisfaction and cuts administrative overhead.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'تقييم الأداء الربعي المربوط بالحوافز (KPI & Commission Automation)' : 'Automated Commission & KPI Performance Scoring',
          type: 'Trick',
          content: isAr ? 'ربط تحقيق الأهداف (KPIs) ونسب المبيعات بمسيرات الرواتب آلياً يضمن توزيع العمولات والحوافز بدقة.' : 'Auto-calculating sales commissions and KPI performance bonuses inside payroll prevents manual payout errors.',
          example: isAr ? 'إضافة نسبة عمولة المبيعات تلقائياً لمسير راتب الشريك التجاري عند تحصيل الفاتورة.' : 'Auto-add sales commission line item to payroll upon customer payment collection.',
          why_it_matters: isAr ? 'تحفيز الفريق وزيادة الإنتاجية دون تأخير المستحقات.' : 'Drives employee motivation and eliminates incentive payout disputes.'
        }
      ];
    }

    // 4. Maintenance (الصيانة)
    if (modLower.includes('maint') || modLower.includes('صيانة') || /\bmod-3\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'تتبع تكلفة الصيانة لكل معدة (Total Maintenance Cost per Asset)' : 'Total Cost of Maintenance (TCM) Tracking',
          type: 'Accounting Impact',
          content: isAr ? 'تجميع قطع الغيار، أجور الفنيين، والخدمات الخارجية على حساب المعدة يوضح جدوى الاستمرار في تشغيلها.' : 'Aggregating spare parts, technician labor, and contractor fees against asset IDs reveals true cost of ownership.',
          example: isAr ? 'تقرير يبين أن مصاريف صيانة معدة تجاوزت 60% من قيمة إحلالها كجديدة.' : 'Report showing asset maintenance exceeded 60% of replacement value.',
          why_it_matters: isAr ? 'تسهيل اتخاذ قرار إحلال وتكاهين المعدات المتهالكة.' : 'Facilitates timely capital asset replacement decisions.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تفعيل بلاغات الأعطال من خطوط الإنتاج (Work Center Downtime Alerts)' : 'Automated Machine Downtime Tracking',
          type: 'Process Insight',
          content: isAr ? 'تسجيل ساعات توقف المعدات فورياً يتيح تقييم كفاءة التشغيل الإجمالية (OEE) وتحليل أسباب التوقف.' : 'Logging machine downtime hours automatically tracks Overall Equipment Effectiveness (OEE) and root causes.',
          example: isAr ? 'إرسال إشعار للمهندس المسؤول فور توقف خط الإنتاج لأكثر من 15 دقيقة.' : 'Auto-alert maintenance engineer when production line halts for >15 minutes.',
          why_it_matters: isAr ? 'تقليل ساعات التوقف الفعلي وزيادة الطاقة الإنتاجية.' : 'Maximizes production throughput and minimizes downtime losses.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'إدارة عقود الصيانة الضامنة (Vendor Warranty & SLA Tracking)' : 'Vendor Warranty & SLA Management',
          type: 'Tip',
          content: isAr ? 'تنبيه الفنيين بوجود ضمان ساري للمعدة لمنع شراء قطع غيار أو دفع مصاريف صيانة خارج الضمان.' : 'Alerting technicians about active vendor warranties prevents paying for covered spare parts and repairs.',
          example: isAr ? 'إظهار شارة "تحت الضمان" عند فتح أمر شغل لمعدة تم شراؤها خلال السنة الأخيرة.' : 'Display "Under Warranty" banner when creating Work Order for recently purchased assets.',
          why_it_matters: isAr ? 'توفير آلاف الريالات والاستفادة الكاملة من الضمانات المصنعية.' : 'Saves thousands by utilizing active manufacturer warranties.'
        }
      ];
    }

    // 5. Assets (الأصول)
    if (modLower.includes('asset') || modLower.includes('أصول') || /\bmod-4\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'إدارة استبعاد وبيع الأصول الثابتة (Asset Disposal & Scrap Realization)' : 'Fixed Asset Disposal & Scrap Accounting',
          type: 'Common Mistake',
          content: isAr ? 'بيع أو استبعاد الأصل بدون إقفال القيمة الدفترية ومجمع الإهلاك يتسبب في أخطاء جوهرية بالأرباح والخسائر.' : 'Scrapping or selling an asset without closing its accumulated depreciation ledger distorts P&L gain/loss on disposal.',
          example: isAr ? 'إثبات قيد التخريد: إقفال ح/ مجمع الإهلاك واحتساب صافي الربح/الخسارة الناتج عن البيع.' : 'Disposal entry: Dr Cash, Dr Accumulated Depreciation, Cr Asset Cost, Cr/Dr Gain/Loss.',
          why_it_matters: isAr ? 'دقة التقارير المالية ومطابقة القوائم الختامية.' : 'Guarantees compliant financial gain/loss reporting on disposals.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تجميع تكاليف المشروعات قيد التنفيذ (CWIP Asset Capitalization)' : 'Capital Work-in-Progress (CWIP) Capitalization',
          type: 'Accounting Impact',
          content: isAr ? 'تأجيل إهلاك المشروعات الثابتة لحين اكتمال التركيب والتشغيل الفعلي وتحويلها من ح/ مشاريع تحت التنفيذ إلى أصل ثابت.' : 'Capitalizing CWIP costs into active Fixed Assets only upon commercial commissioning starts depreciation correctly.',
          example: isAr ? 'تحويل حساب خط الإنتاج من ح/ مشاريع تحت التنفيذ إلى ح/ أصل آلات ومعدات فور التشغيل.' : 'Transfer CWIP balance to Active Machinery ledger on commercial launch date.',
          why_it_matters: isAr ? 'تجنب تحميل الفترات المحاسبية بمصاريف إهلاك قبل بدء توليد الإيراد.' : 'Prevents premature depreciation expenses before revenue generation starts.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'إعادة تقييم الأصول بالقيمة العادلة (Asset Revaluation & Impairment)' : 'Asset Revaluation & Impairment Audit Controls',
          type: 'Best Practice',
          content: isAr ? 'إجراء اختبار هبوط قيمة الأصول (Impairment Test) عند تراجع قيمتها السوقية لحماية القوائم المالية.' : 'Testing fixed assets for impairment when market values drop guarantees compliance with IFRS IAS 36.',
          example: isAr ? 'إثبات قيد خسائر هبوط أصل عقاري تراجعت قيمته السوقية.' : 'Post Dr Impairment Expense, Cr Accumulated Impairment Allowance.',
          why_it_matters: isAr ? 'عرض الأصول بقيمتها الحقيقية العادلة أمام المستثمرين والبنوك.' : 'Ensures true fair-value asset representation for stakeholders.'
        }
      ];
    }

    // 6. Transportation (النقليات)
    if (modLower.includes('trans') || modLower.includes('fleet') || modLower.includes('نقليات') || modLower.includes('مركبات') || /\bmod-5\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'جدولة تراخيص الفحص والرخص (Fleet License & Renewal Pipeline)' : 'Fleet Vehicle Inspection & Registration Renewal Alerts',
          type: 'Tip',
          content: isAr ? 'إعداد تنبيهات آلية لتراخيص المركبات والتأمين والفحص الدوري تجنباً لحجز الشاحنات بالغرامات الميدانية.' : 'Auto-alerting fleet operations 30 days before vehicle registration and insurance expiry avoids road fines.',
          example: isAr ? 'تنبيه مسئول الحركة قبل 30 يوماً من انتهاء رخصة سير الشاحنة.' : 'Auto-notify dispatch team 30 days prior to truck registration expiry.',
          why_it_matters: isAr ? 'تجنب توقف الرحلات والغرامات المرورية.' : 'Prevents fleet grounding and avoids heavy traffic fines.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تتبع مسارات الشاحنات وتحديد الحمولة الزائدة (Overload & GPS Tracking)' : 'GPS Route Tracking & Axle Overload Monitoring',
          type: 'Common Mistake',
          content: isAr ? 'تجاوز أوزان المحاور المسموحة يتسبب في تلف الإطارات وتوقيع غرامات موازين النقل.' : 'Exceeding axle weight limits damages tires and incurs heavy weigh-station highway fines.',
          example: isAr ? 'منع إصدار وثيقة التحرير إذا تجاوز الوزن الإجمالي الموزون الحد المسموح.' : 'Block waybill confirmation if scale weight exceeds maximum legal axle limit.',
          why_it_matters: isAr ? 'حماية أسطول المركبات وتخفيض مصاريف صيانة الإطارات.' : 'Extends tire lifespan and prevents costly highway overload penalties.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'حساب تكلفة الكيلومتر الفعلي للرحلة (Cost Per Ton/Km Ratio)' : 'Freight Profitability per Ton/Km Ratio',
          type: 'Accounting Impact',
          content: isAr ? 'ربط مصاريف السائق والوقود والصيانة والضرائب بحمولة الرحلة يحدد ربحية كل خط سير.' : 'Allocating driver allowances, fuel, tolls, and maintenance per trip calculates true net margin per route.',
          example: isAr ? 'تقرير يبين أن خط نقل "الرياض - الدمام" يحقق هامش ربح 28% مقارنة بـ 12% لخط آخر.' : 'Route profitability report showing 28% margin vs 12% on low-yield trips.',
          why_it_matters: isAr ? 'تركيز الأسطول على الخطوط والرحلات الأكثر ربحية.' : 'Focuses fleet capacity on high-margin logistics corridors.'
        }
      ];
    }

    // 7. Real Estate (العقارات)
    if (modLower.includes('real') || modLower.includes('estate') || modLower.includes('عقارات') || modLower.includes('عقار') || /\bmod-7\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'أتمتة الفواتير وربط الخدمات بالمستأجرين (Tenant Utility Cost Recovery)' : 'Tenant Utility & Maintenance Re-invoicing Automation',
          type: 'Best Practice',
          content: isAr ? 'إعادة توزيع فواتير الكهرباء والمياه والصيانة العامة على المستأجرين تلقائياً بحسب مساحة كل وحدة.' : 'Auto-allocating shared building utility and maintenance costs to tenant ledgers by square footage.',
          example: isAr ? 'إصدار فاتورة صيانة دورية للمستأجر بحسب نسبة مساحة محله من المجمع.' : 'Auto-bill tenant for shared HVAC maintenance based on leased floor area ratio.',
          why_it_matters: isAr ? 'منع استنزاف المصاريف التشغيلية على مالك العقار.' : 'Prevents unrecovered building operational costs from eroding owner returns.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'تحصيل الإيجارات عبر بوابة الدفع السريع (Online Tenant Payment Portal)' : 'Digital Lease Payments & Auto-Receipting',
          type: 'Process Insight',
          content: isAr ? 'ربط التحصيل الإلكتروني والخصم المباشر بنظام العقارات يحدث رصيد المستأجر ويصدر السند فورياً.' : 'Integrating online payment portals with tenant sub-ledgers auto-posts receipts and updates balances.',
          example: isAr ? 'تسوية الدفعة وتوليد سند القبض تلقائياً بمجرد سداد المستأجر عبر سداد/مدى.' : 'Auto-post receipt voucher upon instant tenant SADAD/Mada payment confirmation.',
          why_it_matters: isAr ? 'تقليل الديون المعلقة وتسريع دورة التحصيل النقدية.' : 'Dramatically cuts collection delays and manual receipting work.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'متابعة الصيانة الدورية للوحدات المؤجرة (Leased Unit Inspection)' : 'Periodic Leased Unit Physical Inspection Audits',
          type: 'Common Mistake',
          content: isAr ? 'تسليم أو استلام الوحدات دون توثيق حالة المبنى بالصور والتقرير المعتمد يسبب نزاعات الودائع الإيجارية.' : 'Handing over units without digital photo inspection logs triggers deposit security disputes upon lease termination.',
          example: isAr ? 'تعبئة نموذج فحص الاستلام الرقمي وتوقيع المستأجر الكترونياً قبل تسليم المفاتيح.' : 'Complete digital handover checklist with signed tenant photos prior to key release.',
          why_it_matters: isAr ? 'حماية الأصول العقارية من التلف وضمان حقوق الصيانة.' : 'Protects property value and eliminates tenant deposit settlement conflicts.'
        }
      ];
    }

    // 8. Contracting (المقاولات)
    if (modLower.includes('contract') || modLower.includes('مقاولات') || modLower.includes('مشروع') || /\bmod-8\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'إدارة التغييرات وأوامر التكليف (Variation Orders Control)' : 'Variation Order (VO) Approval & Revenue Realization',
          type: 'Common Mistake',
          content: isAr ? 'تنفيذ الأعمال الإضافية للمشروع بناءً على طلبات شفهية دون أوامر تغيير مقتطعة وموثقة يضيع مستحقات المقاول.' : 'Executing unapproved scope changes without signed Variation Orders leads to uncollectible work expenses.',
          example: isAr ? 'حظر صرف مواد العمل الإضافي لحين اعتماد الاستشاري لأمر التغيير رقم VO-04.' : 'Block material issue for extra scope until client signs Variation Order VO-04.',
          why_it_matters: isAr ? 'ضمان فوترة كافة الأعمال الإضافية وحماية حقوق الشركة.' : 'Guarantees full customer billing for scope changes.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'توزيع مصاريف الموقع غير المباشرة (Subcontractor & Overhead Distribution)' : 'Subcontractor Ledger & Site Overhead Allocation',
          type: 'Accounting Impact',
          content: isAr ? 'توزيع رواتب الإداريين والمعدات المشتركة ومصاريف الموقع المؤقتة على بند المشروع بحسب نسبة الإنجاز.' : 'Allocating shared site equipment, site engineers, and camp overheads by project completion percentage.',
          example: isAr ? 'قيد توزيع مصاريف الموقع الشهرية بنسبة إنجاز كل مشروع من إجمالي الأعمال.' : 'Post monthly site overhead allocation proportional to project IPC revenue weight.',
          why_it_matters: isAr ? 'تحديد الربحية الحقيقية والدقيقة لكل مشروع مقاولات.' : 'Reveals true net profitability per construction site.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'متابعة خطاب الضمان المالي والنهائي (Letter of Guarantee LG Expiry)' : 'Letter of Guarantee (LG) Expiry & Margin Tracking',
          type: 'Tip',
          content: isAr ? 'تفعيل تنبيهات 45 يوماً قبل انتهاء خطابات الضمان الابتدائية والنهائية لتمديدها أو الإفراج عن الهوامش النقدية.' : 'Tracking Bank Performance & Advance Payment LG expiry dates prevents automatic cash margin liquidations.',
          example: isAr ? 'إرسال إشعار للإدارة المالية لمخاطبة البنك لتمديد أو استرداد غطاء الضمان.' : 'Notify finance team 45 days prior to LG expiry to release banked cash margins.',
          why_it_matters: isAr ? 'استرداد السيولة المحتجزة وتجنب مصاريف التمديد البنكية.' : 'Recovers banked cash margins and avoids unnecessary bank extension fees.'
        }
      ];
    }

    // 9. Fuel Stations (الوقود)
    if (modLower.includes('fuel') || modLower.includes('وقود') || modLower.includes('محطة') || /\bmod-9\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'مراقبة أسعار التوريد وهامش ربح لتر الوقود (Margin & Price Update Automation)' : 'Automated Fuel Retail Margin & Cost Update',
          type: 'Accounting Impact',
          content: isAr ? 'تحديث أسعار لتر الوقود فور اعتماد التسعيرة الرسمية يضمن دقة حساب قيود المبيعات وهامش الربح.' : 'Auto-updating pump retail prices upon official tariff changes ensures immediate gross margin accuracy.',
          example: isAr ? 'تحديث سعر البنزين 91 تلقائياً في جميع الشاشات والمضخات بداية الشهر.' : 'Batch update 91 Octane retail price across all station POS pumps at midnight.',
          why_it_matters: isAr ? 'حماية أرباح المحطة وتجنب الفروقات الحسابية في التكاليف.' : 'Protects retail margins and prevents inventory revaluation errors.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'ربط بطاقات الأسطول والشركات بالشبكة (Fleet RFID Fueling System)' : 'Fleet RFID Smart Fueling & Direct Ledger Billing',
          type: 'Best Practice',
          content: isAr ? 'صرف الوقود لمركبات الشركات عبر الشريحة الذكية (RFID) يمنع التلاعب ويعكس التكلفة في حساب العميل فوراً.' : 'Dispensing fuel via smart vehicle RFID tags auto-debts corporate customer accounts without cash handling.',
          example: isAr ? 'مسح شريحة الشاحنة على المضخة وخصم قيمة اللترات تلقائياً من رصيد الشركة.' : 'Auto-read RFID windshield tag on nozzle pick-up to charge corporate sub-ledger.',
          why_it_matters: isAr ? 'زيادة مبيعات الآجل وسرعة تسوية فواتير كبار العملاء.' : 'Drives corporate fleet sales volume and eliminates credit billing disputes.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'فحص المعايرة الفنية وحساب الفقد الحراري (Thermal Loss Calculation)' : 'Pump Meter Calibration & Thermal Expansion Audits',
          type: 'Tip',
          content: isAr ? 'معايرة المضخات بانتظام واحتساب الفروقات الحرارية الصيفية يحمي الخزانات من العجز الفني المنظور.' : 'Calibrating meter nozzles and accounting for fuel thermal expansion prevents unexplained stock variance.',
          example: isAr ? 'معايرة وعاء 20 لتر القياسي شهرياً للتأكد من عدم وجود ضخ زائد عن المقدار.' : 'Calibrate 20L standard test measure monthly to verify exact nozzle dispensing accuracy.',
          why_it_matters: isAr ? 'الالتزام بمعايير الجودة وتجنب المخالفات الرقابية.' : 'Guarantees commercial compliance and prevents customer over-dispensing losses.'
        }
      ];
    }

    // 10. Law Firm (المحاماة)
    if (modLower.includes('law') || modLower.includes('legal') || modLower.includes('محاماة') || modLower.includes('قانون') || /\bmod-10\b/i.test(modLower)) {
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
        },
        {
          id: 'AI-' + moduleId + '-3', module_id: moduleId,
          title: isAr ? 'إدارة أتعاب القضايا وحسابات الأمانات (Legal Retainer & Escrow Trust Accounting)' : 'Legal Retainer Deposit & Escrow Trust Ledger Controls',
          type: 'Accounting Impact',
          content: isAr ? 'فصل حسابات أمانات العملاء عن الحساب الجاري للمكتب والاعتراف بالأتعاب فقط عند تقديم الخدمة فعلياً.' : 'Separating client escrow trust funds from law firm operating ledgers ensures strict legal ethics compliance.',
          example: isAr ? 'ترحيل الأتعاب المستحقة من ح/ أمانات العملاء إلى ح/ إيرادات الاستشارات المكتسبة.' : 'Transfer earned fees from Client Trust Liability to Operating Revenue upon milestone completion.',
          why_it_matters: isAr ? 'الالتزام بقواعد أمانات المهن القانونية وتجنب المخالفات.' : 'Ensures strict legal accounting ethics and regulatory compliance.'
        },
        {
          id: 'AI-' + moduleId + '-4', module_id: moduleId,
          title: isAr ? 'توثيق وإدارة أوراق القضايا الكترونياً (Case Document Archiving)' : 'Electronic Case File & Evidence Archiving',
          type: 'Process Insight',
          content: isAr ? 'أرشفة كافة اللوائح، العقود، والمستندات بملف القضية الرقمي يتيح الوصول الفوري للفريق القانوني من أي مكان.' : 'Archiving court pleadings, contracts, and evidence under centralized digital Case IDs enables instant team access.',
          example: isAr ? 'ربط المذكرة الجوابية برقم القضية ليطلع عليها المحامي المساند قبل الجلسة.' : 'Attach defense brief PDF to Case ID for co-counsel review prior to hearing.',
          why_it_matters: isAr ? 'تسريع إعداد المذكرات وحماية أصول ومستندات العملاء من الضياع.' : 'Accelerates brief drafting and secures confidential client documentation.'
        },
        {
          id: 'AI-' + moduleId + '-5', module_id: moduleId,
          title: isAr ? 'متابعة تحصيل الدفعات المستحقة للقضايا (Milestone Fee Collection)' : 'Legal Fee Milestone Collection & Retainer Alerts',
          type: 'Common Mistake',
          content: isAr ? 'الاستمرار في الترافع والعمل على القضية بعد استنفاذ الدفعة المقدمة دون مطالبتهم بالدفعة التالية يسبب تعثر التحصيل.' : 'Continuing litigation work after exhausting client retainer balance risks uncollectible legal fees.',
          example: isAr ? 'إرسال تنبيه آلي للمحامي والعميل فور انخفاض رصيد الدفعة المقدمة عن 20%.' : 'Trigger auto-alert when client retainer balance drops below 20% threshold.',
          why_it_matters: isAr ? 'حماية التدفقات النقدية لمكتب المحاماة وضمان التحصيل أولاً بأول.' : 'Protects law firm cash flow and eliminates overdue fee collection risks.'
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
