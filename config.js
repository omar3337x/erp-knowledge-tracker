// ---------------------------------------------------------------------------
// ERP Knowledge & Learning Tracker — Frontend Configuration
// ---------------------------------------------------------------------------
// Paste the Web App URL you get after deploying google-apps-script/Code.gs.
// This file must NEVER contain the Sheet ID, passwords, or any secret —
// those live only in Apps Script Script Properties on the server side.
// ---------------------------------------------------------------------------

const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbz9ISjqcgtG6ReC6ZxeQrOH69amssRYUkUf5qYBhAdhUCNh48ifh1QF7LSaOFe0LhrV7Q/exec"
};

const DEFAULT_MODULES = [
  { id: 'MOD-1', name_en: 'Inventory', name_ar: 'المخزون' },
  { id: 'MOD-2', name_en: 'Accounting', name_ar: 'الحسابات' },
  { id: 'MOD-3', name_en: 'Maintenance', name_ar: 'الصيانة' },
  { id: 'MOD-4', name_en: 'Assets', name_ar: 'الأصول' },
  { id: 'MOD-5', name_en: 'Transportation', name_ar: 'النقليات' },
  { id: 'MOD-6', name_en: 'HR', name_ar: 'الموارد البشرية' },
  { id: 'MOD-7', name_en: 'Real Estate', name_ar: 'العقارات' },
  { id: 'MOD-8', name_en: 'Contracting', name_ar: 'المقاولات' },
  { id: 'MOD-9', name_en: 'Fuel Stations', name_ar: 'الوقود' },
  { id: 'MOD-10', name_en: 'Law Firm', name_ar: 'المحاماة' }
];
