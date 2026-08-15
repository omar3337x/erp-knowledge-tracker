/**
 * js/script_engine.js
 * ⚙️ Core Engine for ERP Script Knowledge, Troubleshooting, Risk Detection & Database Compatibility
 * Source of Truth for Current Database Schema: newdatabase2026.sql (via CURRENT_DATABASE_SCHEMA)
 */

const ScriptEngine = (function () {

  const STATUS_LEVELS = {
    GREEN: { id: 'GREEN', label_ar: '🟢 متوافق ومعتمد (Current / Verified)', label_en: '🟢 Current / Verified', badge: 'badge-teal', color: 'var(--teal)' },
    YELLOW: { id: 'YELLOW', label_ar: '🟡 يحتاج مراجعة (Needs Validation)', label_en: '🟡 Needs Validation', badge: 'badge-brass', color: 'var(--brass)' },
    ORANGE: { id: 'ORANGE', label_ar: '🟠 غالباً قديم (Possibly Outdated)', label_en: '🟠 Possibly Outdated', badge: 'badge-rust', color: 'var(--brass-deep)' },
    RED: { id: 'RED', label_ar: '🔴 غير متوافق (Incompatible)', label_en: '🔴 Incompatible', badge: 'badge-rust', color: 'var(--rust)' },
    GRAY: { id: 'GRAY', label_ar: '⚪ لم يتم التحقق (Not Checked)', label_en: '⚪ Not Checked', badge: 'badge-secondary', color: 'var(--ink-soft)' }
  };

  const RISK_LEVELS = {
    CRITICAL: { id: 'CRITICAL', label_ar: '🔴 خطورة قصوى (Critical)', label_en: '🔴 Critical Risk', badge: 'badge-rust', color: 'var(--rust)' },
    HIGH: { id: 'HIGH', label_ar: '🟠 خطورة عالية (High Risk)', label_en: '🟠 High Risk', badge: 'badge-rust', color: 'var(--rust)' },
    MEDIUM: { id: 'MEDIUM', label_ar: '🟡 خطورة متوسطة (Medium Risk)', label_en: '🟡 Medium Risk', badge: 'badge-brass', color: 'var(--brass)' },
    LOW: { id: 'LOW', label_ar: '🟢 آمن / قراءة فقط (Low Risk)', label_en: '🟢 Low Risk', badge: 'badge-teal', color: 'var(--teal)' }
  };

  /**
   * Retrieves the active Current Database Schema Map
   */
  function getCurrentSchema() {
    if (typeof CURRENT_DATABASE_SCHEMA !== 'undefined' && CURRENT_DATABASE_SCHEMA && CURRENT_DATABASE_SCHEMA.tables) {
      return CURRENT_DATABASE_SCHEMA;
    }
    return null;
  }

  /**
   * Analyzes raw code for SQL operations, tables, columns, risk factors and schema compatibility.
   */
  function analyzeScript(code, customSchema = null) {
    const rawCode = String(code || '').trim();
    const schema = customSchema || getCurrentSchema();

    // 1. Identify SQL Operations
    const operations = [];
    if (/\bTRUNCATE\b/i.test(rawCode)) operations.push('TRUNCATE');
    if (/\bDROP\b/i.test(rawCode)) operations.push('DROP');
    if (/\bDELETE\b/i.test(rawCode)) operations.push('DELETE');
    if (/\bUPDATE\b/i.test(rawCode)) operations.push('UPDATE');
    if (/\bINSERT\b/i.test(rawCode)) operations.push('INSERT');
    if (/\bCREATE\s+(?:OR\s+REPLACE\s+)?VIEW\b/i.test(rawCode)) operations.push('CREATE VIEW');
    if (/\bALTER\b/i.test(rawCode)) operations.push('ALTER');
    if (/\bSELECT\b/i.test(rawCode) && !operations.includes('SELECT')) operations.push('SELECT');

    // 2. Extract Table Names via regex
    const tableRegex = /\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+`?([a-zA-Z0-9_]+)`?/gi;
    const matchedTables = new Set();
    const ignoreKeywords = new Set([
      'select', 'where', 'set', 'values', 'if', 'not', 'exists', 'null', 'as',
      'inner', 'left', 'right', 'outer', 'join', 'group', 'order', 'by', 'having',
      'union', 'all', 'limit', 'offset', 'and', 'or', 'case', 'when', 'then', 'else', 'end'
    ]);

    let match;
    while ((match = tableRegex.exec(rawCode)) !== null) {
      const tbl = match[1].toLowerCase();
      if (!ignoreKeywords.has(tbl) && tbl.length > 1) {
        matchedTables.add(tbl);
      }
    }

    const tablesArr = Array.from(matchedTables);

    // 3. Extract Column references (table.column or `column`)
    const colRegex = /([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)|`([a-zA-Z0-9_]+)`/g;
    const matchedColumns = new Set();
    while ((match = colRegex.exec(rawCode)) !== null) {
      const col = match[2] || match[3];
      if (col && !ignoreKeywords.has(col.toLowerCase()) && !tablesArr.includes(col.toLowerCase())) {
        matchedColumns.add(col);
      }
    }
    const columnsArr = Array.from(matchedColumns);

    // 4. Evaluate Database Compatibility against Current Database Schema
    let compatibility = 'GRAY';
    let missingTables = [];
    let existingTables = [];
    let reason_ar = '';
    let reason_en = '';

    if (!schema) {
      compatibility = 'GRAY';
      reason_ar = '⚪ لم يتم التحقق لعدم توفر خريطة قاعدة البيانات الحالية (newdatabase2026.sql).';
      reason_en = '⚪ Not validated: Current Database Schema map is not loaded.';
    } else {
      missingTables = tablesArr.filter(t => !schema.tables[t]);
      existingTables = tablesArr.filter(t => !!schema.tables[t]);

      if (tablesArr.length === 0) {
        compatibility = 'GREEN';
        reason_ar = '🟢 استعلام عام أو نص برمجي لا يعتمد على جداول مفقودة.';
        reason_en = '🟢 Generic query with no missing table dependencies.';
      } else if (missingTables.length === 0) {
        compatibility = 'GREEN';
        reason_ar = `🟢 متوافق بالكامل: جميع الجداول المستخدمة (${existingTables.join(', ')}) متوفرة في قاعدة البيانات الحالية (newdatabase2026.sql).`;
        reason_en = `🟢 Fully compatible: All referenced tables (${existingTables.join(', ')}) exist in Current Database (newdatabase2026.sql).`;
      } else if (existingTables.length > 0) {
        compatibility = 'YELLOW';
        reason_ar = `🟡 متوافق جزئياً: توجد جداول غير متوفرة في الهيكل الحالي: (${missingTables.join(', ')}). يجب مراجعة الاستعلام واستبدال الجداول القديمة.`;
        reason_en = `🟡 Needs review: Missing tables in current schema: (${missingTables.join(', ')}).`;
      } else {
        compatibility = 'RED';
        reason_ar = `🔴 غير متوافق (أرشيف قديم): الجداول المطلوبة (${missingTables.join(', ')}) غير موجودة في قاعدة البيانات الحالية (newdatabase2026.sql).`;
        reason_en = `🔴 Incompatible (Outdated): None of the referenced tables exist in newdatabase2026.sql.`;
      }
    }

    // 5. Evaluate Risk Level
    let risk_level = 'LOW';
    const riskFactors_ar = [];
    const riskFactors_en = [];

    // Check TRUNCATE
    if (operations.includes('TRUNCATE')) {
      risk_level = 'CRITICAL';
      riskFactors_ar.push('يحتوي على أمر TRUNCATE الذي يقوم بمسح الجداول بالكامل وبشكل لا رجعة فيه.');
      riskFactors_en.push('Contains TRUNCATE statement which permanently purges all table data.');
    }

    // Check DROP
    if (operations.includes('DROP')) {
      risk_level = 'CRITICAL';
      riskFactors_ar.push('يحتوي على أمر DROP لحذف كائنات أو جداول من قاعدة البيانات.');
      riskFactors_en.push('Contains DROP statement removing database objects.');
    }

    // Check Accounting / General Ledger Modification
    const glTables = ['gl_trans', 'journal', 'accounting', 'bills', 'chart_master'];
    const touchesGL = tablesArr.some(t => glTables.includes(t));
    if (touchesGL && (operations.includes('UPDATE') || operations.includes('DELETE') || operations.includes('INSERT'))) {
      if (risk_level !== 'CRITICAL') risk_level = 'HIGH';
      riskFactors_ar.push('يعدل أو يحذف في جداول الحسابات والأستاذ العام (GL) مما يؤثر مباشرة على ميزان المراجعة والقوائم المالية.');
      riskFactors_en.push('Modifies core General Ledger / Journal tables with direct financial statement impact.');
    }

    // Check DELETE
    if (operations.includes('DELETE') && risk_level !== 'CRITICAL') {
      risk_level = 'HIGH';
      riskFactors_ar.push('يحتوي على أمر حذف بيانات DELETE.');
      riskFactors_en.push('Contains DELETE statements.');
    }

    // Check UPDATE without safe WHERE
    if (operations.includes('UPDATE')) {
      if (!/\bWHERE\b/i.test(rawCode)) {
        risk_level = 'CRITICAL';
        riskFactors_ar.push('تحذير شديد: أمر UPDATE بدون شرط WHERE يحدده، مما قد يعدل كافة صفوف الجدول عشوائياً!');
        riskFactors_en.push('CRITICAL WARNING: UPDATE without WHERE clause threatens to overwrite entire table!');
      } else if (risk_level === 'LOW') {
        risk_level = 'MEDIUM';
        riskFactors_ar.push('يقوم بتعديل بيانات (UPDATE) على السجلات المطابقة للشرط.');
        riskFactors_en.push('Executes targeted UPDATE on matching rows.');
      }
    }

    if (riskFactors_ar.length === 0) {
      riskFactors_ar.push('استعلام قراءة وفحص (SELECT) أو إنشاء View تقارير آمن.');
      riskFactors_en.push('Read-only SELECT query or safe reporting View creation.');
    }

    // 6. Section Parsing (breakdown long scripts into logical parts)
    const lines = rawCode.split('\n');
    const sections = [];
    let currentSec = { title: 'Section 1: Initial Query', startLine: 1, type: operations[0] || 'SQL' };

    lines.forEach((line, idx) => {
      const lineTrim = line.trim();
      const lineNum = idx + 1;
      if (lineTrim.startsWith('--') || lineTrim.startsWith('/*') || lineTrim.startsWith('<<<<')) {
        if (idx > 0) {
          currentSec.endLine = idx;
          sections.push(currentSec);
        }
        currentSec = {
          title: lineTrim.replace(/^[-/*<>\s]+|[-/*<>\s]+$/g, '') || `Section ${sections.length + 1}`,
          startLine: lineNum,
          type: 'COMMENT / STEP'
        };
      } else if (/\b(UPDATE|DELETE|INSERT|SELECT|CREATE|TRUNCATE)\b/i.test(lineTrim)) {
        const op = lineTrim.match(/\b(UPDATE|DELETE|INSERT|SELECT|CREATE|TRUNCATE)\b/i)[1].toUpperCase();
        if (currentSec.type === 'COMMENT / STEP') {
          currentSec.type = op;
        }
      }
    });
    currentSec.endLine = lines.length;
    sections.push(currentSec);

    // 7. Generate Code Fingerprint (Normalized Hash)
    const normalizedCode = rawCode.toLowerCase().replace(/\s+/g, ' ').replace(/[`'"]/g, '');
    let hash = 0;
    for (let i = 0; i < normalizedCode.length; i++) {
      hash = ((hash << 5) - hash) + normalizedCode.charCodeAt(i);
      hash |= 0;
    }
    const fingerprint = `FP-${Math.abs(hash).toString(16)}`;

    return {
      operations,
      tables: tablesArr,
      columns: columnsArr,
      missing_tables: missingTables,
      existing_tables: existingTables,
      database_compatibility: compatibility,
      compatibility_reason_ar: reason_ar,
      compatibility_reason_en: reason_en,
      risk_level,
      risk_factors_ar: riskFactors_ar,
      risk_factors_en: riskFactors_en,
      sections,
      fingerprint,
      line_count: lines.length,
      char_count: rawCode.length
    };
  }

  /**
   * Returns list of all database objects from newdatabase2026.sql with script cross-references
   */
  function getAllDatabaseObjects(scriptsList = []) {
    const schema = getCurrentSchema();
    if (!schema || !schema.tables) return [];

    const tables = Object.keys(schema.tables).map(tblName => {
      const tblObj = schema.tables[tblName];
      const columnNames = Object.keys(tblObj.columns || {});
      
      // Find scripts using this table
      const attachedScripts = scriptsList.filter(s => {
        return (Array.isArray(s.tables) && s.tables.map(t => t.toLowerCase()).includes(tblName.toLowerCase()));
      });

      return {
        name: tblName,
        columns_count: columnNames.length,
        columns: columnNames.map(c => tblObj.columns[c]),
        primary_key: tblObj.primaryKey || [],
        indexes: tblObj.indexes || [],
        scripts_count: attachedScripts.length,
        scripts: attachedScripts.map(s => ({ id: s.id, title_ar: s.title_ar, title_en: s.title_en, risk_level: s.risk_level }))
      };
    });

    return tables.sort((a, b) => b.scripts_count - a.scripts_count || a.name.localeCompare(b.name));
  }

  /**
   * Multi-dimensional Smart Search Engine
   */
  function searchScripts(scripts, query, filters = {}) {
    if (!Array.isArray(scripts)) return [];
    let results = [...scripts];

    // Filter by Module
    if (filters.module_id) {
      results = results.filter(s => Array.isArray(s.modules) && s.modules.includes(filters.module_id));
    }

    // Filter by Category
    if (filters.category_id) {
      results = results.filter(s => s.category_id === filters.category_id);
    }

    // Filter by Risk Level
    if (filters.risk_level) {
      results = results.filter(s => s.risk_level === filters.risk_level);
    }

    // Filter by Database Compatibility
    if (filters.compatibility) {
      results = results.filter(s => s.database_compatibility === filters.compatibility);
    }

    // Filter by Code Type
    if (filters.code_type) {
      results = results.filter(s => s.code_type === filters.code_type);
    }

    // Filter by Table Name
    if (filters.table_name) {
      const targetTable = filters.table_name.toLowerCase();
      results = results.filter(s => Array.isArray(s.tables) && s.tables.some(t => t.toLowerCase() === targetTable));
    }

    // Filter by Favorites
    if (filters.onlyFavorites && filters.favoriteIds) {
      results = results.filter(s => filters.favoriteIds.has(s.id));
    }

    // Free Text / Smart Search
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      
      // Intent dictionary for smart conceptual search
      const conceptAliases = {
        'المخزون مش مطابق': ['reconciliation', 'مطابقة', 'bills', 'gl_trans', 'journal', 'مخزون'],
        'رصيد المندوب': ['delegate', 'مندوب', 'سند الصرف', 'bills', 'accounting'],
        'التكلفة': ['cost', 'purchases', 'سعر الشراء', 'general_table', 'sizes'],
        'القيد': ['journal', 'gl_trans', 'قيد', 'أستاذ'],
        'العميل': ['customer', 'عميل', 'مديونية', 'bills'],
        'تصفير': ['truncate', 'تفريغ', 'مسح', 'cleanup'],
        'صلاحيات': ['permission', 'صلاحيات', 'chartmasterpermissions']
      };

      const matchedConcepts = [];
      Object.keys(conceptAliases).forEach(alias => {
        if (q.includes(alias)) {
          matchedConcepts.push(...conceptAliases[alias]);
        }
      });

      results = results.filter(s => {
        const fullText = [
          s.title_ar, s.title_en,
          s.problem_ar, s.problem_en,
          s.solution_ar, s.solution_en,
          (s.tags || []).join(' '),
          (s.tables || []).join(' '),
          s.filename,
          s.code
        ].filter(Boolean).join(' ').toLowerCase();

        if (fullText.includes(q)) return true;

        // Check if matching any intent concepts
        if (matchedConcepts.length > 0) {
          return matchedConcepts.some(c => fullText.includes(c));
        }

        return false;
      });
    }

    return results;
  }

  /**
   * Formats AI Context Prompt integrating Historical Script with Relevant Current Schema
   */
  function buildAIPromptForScript(script, mode = 'explain') {
    const isAr = I18n.getLang() === 'ar';
    const schema = getCurrentSchema();
    
    // Extract relevant table schemas from newdatabase2026.sql
    let relevantSchemaText = 'Current Database (newdatabase2026.sql) Relevant Schema:\n';
    if (schema && Array.isArray(script.tables)) {
      script.tables.forEach(tblName => {
        const tblObj = schema.tables[tblName.toLowerCase()];
        if (tblObj) {
          const colList = Object.keys(tblObj.columns || {}).map(c => `${c} (${tblObj.columns[c].type})`).join(', ');
          relevantSchemaText += `Table \`${tblName}\`: [${colList}]\n`;
        } else {
          relevantSchemaText += `Table \`${tblName}\`: 🔴 DOES NOT EXIST IN newdatabase2026.sql\n`;
        }
      });
    }

    if (mode === 'safety_review') {
      return `You are a Principal Database Administrator (DBA) and Lead ERP Solution Architect.
Review this ERP troubleshooting script for safety, data integrity, and compliance.

Historical Script Title: ${script.title_en || script.title_ar}
Filename: ${script.filename}
Language: ${isAr ? 'Arabic (العربية الفصحى)' : 'English'}

${relevantSchemaText}

Script Code:
\`\`\`sql
${script.code}
\`\`\`

Perform a comprehensive safety review covering:
1. Operations executed (UPDATE, DELETE, TRUNCATE, INSERT, SELECT).
2. Data loss and irreversible risks.
3. Accounting & General Ledger impact (audit trail, unbalanced journals).
4. Missing WHERE clauses or un-indexed performance bottlenecks.
5. Compatibility verdict against newdatabase2026.sql.
6. Recommended pre-requisites and backup steps before running externally.

Format output cleanly in structured Markdown with alert blocks (> [!CAUTION], > [!IMPORTANT]).`;
    }

    // Default: Explain script
    return `You are an expert ERP Technical Consultant and Database Architect.
Explain this ERP troubleshooting script clearly for business and technical users.

Script Title: ${script.title_en || script.title_ar}
Problem: ${script.problem_ar || script.problem_en}
Language: ${isAr ? 'Arabic (العربية الفصحى)' : 'English'}

${relevantSchemaText}

Script Code:
\`\`\`sql
${script.code}
\`\`\`

Explain in structured format:
1. **Goal & Business Context**: What problem does this solve in ERP workflows?
2. **Step-by-Step Logic**: How does the SQL query work (JOINs, conditions, calculations)?
3. **Affected Tables & Columns**: Which entities are modified or inspected?
4. **Current Database Compatibility**: How does it match newdatabase2026.sql?
5. **Precautions & Rollback Advice**: What must the admin check before applying externally?`;
  }

  return {
    STATUS_LEVELS,
    RISK_LEVELS,
    getCurrentSchema,
    analyzeScript,
    getAllDatabaseObjects,
    searchScripts,
    buildAIPromptForScript
  };
})();

if (typeof module !== 'undefined') module.exports = ScriptEngine;
