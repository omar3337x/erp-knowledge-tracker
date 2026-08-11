# 🌍 Arabic Language & RTL Support + Category Management

## Overview
This update adds full bilingual support (English/Arabic) with RTL layout, plus complete Category Management UI to the ERP Knowledge & Learning Tracker.

---

## Changes Summary

### 1. Backend (Code.gs)

#### Users Sheet - New Column
- Added `language` column to Users schema (default: 'en')

#### Categories Sheet - Enhanced Schema
**Before:**
```
id | module_id | name_ar | name_en | active
```
**After:**
```
id | module_id | name_ar | name_en | description | active | created_at | updated_at
```

#### New API Endpoints
| Action | Method | Description |
|--------|--------|-------------|
| `createCategory` | POST | Add new category with bilingual names |
| `updateCategory` | POST | Edit existing category |
| `deleteCategory` | POST | Delete category (if no topics linked) |
| `toggleCategoryStatus` | POST | Activate/Deactivate category |

#### Profile Update - Language Support
- Added `language` field handling in `actionUpdateProfile()`
- Accepts 'en' or 'ar' values
- Persists to Google Sheets

#### Migration Support
- `migrateSheet()` function automatically adds missing columns to existing sheets
- Safe migration: doesn't delete existing data
- Updates cache headers after migration

#### Cache Invalidation
- All category mutations invalidate `ref:categories:*` cache
- Prevents stale data display

---

### 2. Frontend - i18n System (`js/i18n.js`)

#### Centralized Translation System
```javascript
// Usage
I18N.t("dashboard.title")              // → "Dashboard" or "لوحة التحكم"
I18N.t("auth.login")                   // → "Log In" or "تسجيل الدخول"
I18N.t("categories.delete_confirm")    // → With variables: I18N.t("key", {name: "X"})
```

#### Supported Languages
- **English (en)** - LTR
- **Arabic (ar)** - RTL

#### Key Functions
| Function | Description |
|----------|-------------|
| `I18N.t(key, vars?)` | Translate string with optional variable interpolation |
| `I18N.setLocale(locale)` | Switch language and apply RTL/LTR |
| `I18N.getLocale()` | Get current locale ('en' or 'ar') |
| `I18N.isRTL()` | Check if current locale is RTL |
| `I18N.getCategoryName(cat)` | Get localized category name |
| `I18N.getModuleName(mod)` | Get localized module name |
| `I18N.statusLabel(status)` | Get localized status label |
| `I18N.priorityLabel(priority)` | Get localized priority label |

---

### 3. Frontend - RTL Support (`css/style.css`)

#### CSS Logical Properties
All directional styles use logical properties:
- `padding-inline-start` instead of `padding-left`
- `margin-inline-end` instead of `margin-right`
- `inset-inline-start` instead of `left`

#### RTL-Specific Overrides
```css
[dir="rtl"] .sidebar { transform: translateX(104%); }
[dir="rtl"] .search-box .icon { right: 10px; }
[dir="rtl"] .module-card-head { flex-direction: row-reverse; }
[dir="rtl"] .kpi-card { text-align: center; }
[dir="rtl"] .field label { text-align: right; }
```

#### Layout Adaptations
- Sidebar slides from correct side based on direction
- Search icon position flips
- Form labels align right in RTL
- KPI cards center-aligned in RTL
- Toast notifications position correctly in both directions

---

### 4. Frontend - App Integration (`js/app.js`)

#### Language Switcher
- Dropdown in topbar: `EN` / `عربي`
- Persists to localStorage
- Syncs with user profile on server

#### Dynamic UI Updates
```javascript
function updateUIStrings() {
  // Updates all static text elements
  // Nav items, buttons, labels, placeholders
}
```

#### Session Restoration
- Loads user's language preference from profile
- Applies RTL/LTR on page load
- Re-renders current route with correct language

---

### 5. Frontend - Category Management (`js/categories.js`)

#### Features
| Feature | Description |
|---------|-------------|
| **Add Category** | Modal with bilingual name fields |
| **Edit Category** | Pre-filled form for editing |
| **Delete Category** | Confirmation + safety check for linked topics |
| **Activate/Deactivate** | Toggle button in table |
| **RTL Compatible** | All UI elements work in both directions |

#### Table Columns
- Category Name (localized)
- Description
- Topics Count
- Status (Active/Inactive)
- Actions (Edit/Delete/Toggle)

---

### 6. Frontend - Module View (`js/modules.js`)

#### Updated Structure
```
[Module Stats Cards]
    ↓
[Filter Toolbar: Category/Status/Priority]
    ↓
[Topics Table]
    ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Category Management Section]
    ↓
[Categories Table with CRUD actions]
```

---

### 7. Frontend - API (`js/api.js`)

#### New Methods
```javascript
API.createCategory(payload)     // { module_id, name_en, name_ar, description, active }
API.updateCategory(payload)     // { id, name_en, name_ar, description, active }
API.deleteCategory(id)          // Returns success/error
API.toggleCategoryStatus(id)    // Toggles active status
```

---

### 8. HTML Updates (`index.html`)

- Added `<select id="lang-switcher">` in topbar
- Added `<script src="js/i18n.js"></script>`
- Added `<script src="js/categories.js"></script>`

---

## Data Flow

### Language Preference Storage
```
User Login → GET /api?action=validateSession
                ↓
        Returns user.language ('en' or 'ar')
                ↓
        Frontend sets locale via I18N.setLocale()
                ↓
        Applies RTL/LTR direction
                ↓
        All text re-rendered with translations
```

### Category CRUD Flow
```
User clicks "+ Add Category"
    ↓
Modal opens with bilingual form
    ↓
User fills: name_en, name_ar, description, active
    ↓
POST /api?action=createCategory
    ↓
Google Apps Script validates & saves to Sheets
    ↓
Invalidates category cache
    ↓
Returns success response
    ↓
Frontend refreshes category table
```

---

## Security Preserved

✅ Password hashing (SHA-256 + salt)  
✅ Session-based authentication  
✅ User isolation (topics filtered by user_id)  
✅ Role-based access control  
✅ No trust in client-side user_id  
✅ Email uniqueness validation  
✅ Password strength requirements  

---

## Backward Compatibility

✅ Existing modules preserved  
✅ Existing topics preserved  
✅ Existing reviews preserved  
✅ Database auto-migration for new columns  
✅ No breaking changes to API contracts  

---

## Files Modified/Created

| File | Change |
|------|--------|
| `google-apps-script/Code.gs` | +Category APIs, +language field, +migration |
| `js/i18n.js` | **NEW** - Translation system |
| `js/categories.js` | **NEW** - Category management UI |
| `js/api.js` | +category methods, +language sync |
| `js/app.js` | +i18n integration, +lang switcher |
| `js/auth.js` | +language restoration on login |
| `js/modules.js` | +category section rendering |
| `css/style.css` | +RTL overrides |
| `index.html` | +lang switcher, +scripts |

---

## Testing Checklist

- [ ] Login with English → All UI in English
- [ ] Switch to Arabic → All UI in Arabic + RTL layout
- [ ] Create category with bilingual names
- [ ] Edit category → Names update in both languages
- [ ] Delete category with no topics → Success
- [ ] Delete category with topics → Error message
- [ ] Toggle category active/inactive
- [ ] Refresh page → Language preference persists
- [ ] Different users can have different languages
- [ ] Existing data still works after migration
