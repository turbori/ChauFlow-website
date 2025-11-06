# 🎨 ChauFlow Design Uniformity Guide

## 📋 Overview

This document ensures complete design consistency across all ChauFlow pages:
- Dashboard
- Income Overview
- Expenses Overview
- Balance Sheet

---

## 🎯 Design System Standards

### 1. Page Header / Hero Section

**Standard Structure:**
```html
<div class="page-header">
    <h1 class="page-title">[Page Name]</h1>
    <p class="page-subtitle">[Description]</p>
</div>
```

**Specifications:**
- **Title**: `text-4xl font-bold text-gray-900 mb-2`
- **Subtitle**: `text-base text-gray-600`
- **Bottom Margin**: `mb-8` (2rem)

**Examples:**
- Dashboard: "Welcome back!" / "Here's your bookkeeping overview"
- Income: "Income Overview" / "Track and manage all your income sources"
- Expenses: "Expenses Overview" / "Track and manage your business expenses"
- Balance Sheet: "Business Net Worth" / "Track what you own and what you owe"

---

### 2. Summary Cards (Top Stat Boxes)

**Grid Layout:**
```html
<div class="grid md:grid-cols-3 gap-6 mb-8">
    <!-- Cards here -->
</div>
```

**Card Structure:**
```html
<div class="stat-card stat-card-[type]">
    <div class="stat-card-icon">
        <svg>...</svg>
    </div>
    <p class="stat-card-label">[Label]</p>
    <p class="stat-card-value">[Value]</p>
    <span class="stat-card-badge stat-card-badge-[color]">[Badge]</span>
</div>
```

**Card Types & Colors:**

| Type | Background | Icon Color | Badge Color |
|------|------------|------------|-------------|
| **Income** | `bg-white` | Green (`#059669`) | Green |
| **Expense** | `bg-white` | Red (`#DC2626`) | Red |
| **Net Profit/Balance** | `bg-gradient-to-br from-[color]-600 to-[color]-700` | White | N/A |
| **Entries/Count** | `bg-white` | Purple (`#7C3AED`) | Purple |

**Specifications:**
- **Card**: `rounded-2xl p-6 shadow-sm border border-gray-200`
- **Icon Box**: `w-12 h-12 rounded-xl flex items-center justify-center mb-4`
- **Label**: `text-sm text-gray-600 font-medium mb-2`
- **Value**: `text-3xl font-bold text-gray-900 mb-1`
- **Badge**: `text-xs px-3 py-1 rounded-full font-semibold`

---

### 3. Action Buttons (Top Right)

**Layout:**
```html
<div class="flex items-center gap-3 mb-8">
    <button class="btn-secondary">
        <svg>...</svg>
        Export
    </button>
    <button class="btn-[type]">
        <svg>...</svg>
        Add [Item]
    </button>
</div>
```

**Button Types:**

| Page | Primary Button | Class | Color |
|------|----------------|-------|-------|
| Income | Add Income | `btn-primary` | Blue |
| Expenses | Add Expense | `btn-danger` | Red |
| Balance Sheet (Assets) | Add Asset | `btn-success` | Green |
| Balance Sheet (Liabilities) | Add Liability | `btn-danger` | Red |

**Specifications:**
- **Size**: `px-6 py-3`
- **Font**: `text-[15px] font-semibold`
- **Icon**: `w-5 h-5`
- **Radius**: `rounded-lg`
- **Gap**: `gap-2` between icon and text

---

### 4. Insight/Info Boxes

**Standard Structure:**
```html
<div class="insight-box">
    <div class="insight-box-header">
        <svg class="w-5 h-5 text-blue-600">...</svg>
        <h3 class="insight-box-title">[Title]</h3>
        <span class="insight-box-badge">This Month</span>
    </div>
    <div class="grid md:grid-cols-3 gap-4">
        <!-- Insight cards -->
    </div>
</div>
```

**Specifications:**
- **Background**: `bg-gradient-to-br from-blue-50 to-indigo-50`
- **Border**: `border border-blue-100`
- **Padding**: `p-6`
- **Radius**: `rounded-2xl`
- **Margin**: `mb-8`

**Examples:**
- Income: "Trip Insights"
- Expenses: "Top Vendor" + "Expense Breakdown"
- Balance Sheet: "What is a Balance Sheet?"

---

### 5. Filter Section

**Standard Layout:**
```html
<div class="filter-section">
    <div class="filter-grid">
        <!-- Search -->
        <div>
            <label class="filter-label">Search</label>
            <input class="filter-input" type="text" placeholder="...">
        </div>
        
        <!-- Category -->
        <div>
            <label class="filter-label">Category</label>
            <select class="filter-input">...</select>
        </div>
        
        <!-- From Date -->
        <div>
            <label class="filter-label">From Date</label>
            <input class="filter-input" type="date">
        </div>
        
        <!-- To Date -->
        <div>
            <label class="filter-label">To Date</label>
            <input class="filter-input" type="date">
        </div>
        
        <!-- Clear Button -->
        <div>
            <button class="btn-secondary">Clear</button>
        </div>
    </div>
</div>
```

**Grid Breakpoints:**
- **Desktop**: 5 columns (2fr 1.5fr 1fr 1fr auto)
- **Tablet**: 2 columns
- **Mobile**: 1 column

**Specifications:**
- **Container**: `bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200`
- **Label**: `text-sm font-semibold text-gray-700 mb-2`
- **Input**: `w-full px-4 py-2.5 border border-gray-300 rounded-lg text-[15px]`
- **Gap**: `gap-4`

---

### 6. Data Tables

**Standard Structure:**
```html
<div class="data-table">
    <table class="w-full">
        <thead>
            <tr>
                <th>COLUMN 1</th>
                <th>COLUMN 2</th>
                <th class="text-right">AMOUNT</th>
                <th class="text-center">ACTIONS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Data</td>
                <td>Data</td>
                <td class="text-right">$0.00</td>
                <td class="text-center">
                    <div class="flex items-center justify-center gap-2">
                        <!-- Action buttons -->
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

**Specifications:**
- **Container**: `bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200`
- **Header**: `bg-gray-50`
- **Header Cell**: `px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider`
- **Body Cell**: `px-6 py-4 text-[15px] text-gray-900`
- **Row Hover**: `hover:bg-gray-50`
- **Border**: `border-t border-gray-200` between rows

**Action Icons:**
- **View**: Blue eye icon
- **Edit**: Blue pencil icon
- **Delete**: Red trash icon
- **Size**: `w-5 h-5`
- **Spacing**: `gap-2`

---

### 7. Section Spacing

**Standard Margins:**

| Element | Margin Bottom |
|---------|---------------|
| Page Header | `mb-8` (2rem) |
| Summary Cards Grid | `mb-8` (2rem) |
| Insight Box | `mb-8` (2rem) |
| Filter Section | `mb-8` (2rem) |
| Between Major Sections | `mb-12` (3rem) |
| Page Footer | `mt-16` (4rem) |

---

### 8. Typography Scale

**Headings:**
- **Page Title**: `text-4xl font-bold` (36px)
- **Section Title**: `text-xl font-bold` (20px)
- **Card Title**: `text-lg font-bold` (18px)
- **Subsection**: `text-base font-semibold` (16px)

**Body Text:**
- **Primary**: `text-[15px]` (15px)
- **Secondary**: `text-sm` (14px)
- **Small**: `text-xs` (12px)

**Font Weights:**
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-normal` (400)

---

### 9. Color Palette

**Primary Colors:**
```css
--primary: #2563EB (Blue)
--accent: #10B981 (Green)
--danger: #EF4444 (Red)
--warning: #F59E0B (Orange)
--info: #3B82F6 (Light Blue)
```

**Neutral Colors:**
```css
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-600: #4B5563
--gray-700: #374151
--gray-900: #1F2937
```

**Semantic Colors:**
- **Income/Positive**: Green shades
- **Expense/Negative**: Red shades
- **Balance/Info**: Blue shades
- **Entries/Count**: Purple shades

---

### 10. Icon System

**Icon Library:** Heroicons (outline style)

**Standard Sizes:**
- **Large (Cards)**: `w-6 h-6`
- **Medium (Buttons)**: `w-5 h-5`
- **Small (Inline)**: `w-4 h-4`

**Icon Colors:**
- Match the semantic color of the section
- Use `currentColor` for flexibility

---

### 11. Shadow & Border System

**Shadows:**
- **Card**: `shadow-sm` (subtle)
- **Hover**: `hover:shadow-md`
- **Modal**: `shadow-xl`

**Borders:**
- **Default**: `border border-gray-200`
- **Focus**: `border-primary ring-2 ring-primary/10`
- **Radius**: `rounded-lg` (8px) or `rounded-xl` (12px) or `rounded-2xl` (16px)

---

### 12. Responsive Breakpoints

**Grid Adjustments:**
```css
/* Mobile */
@media (max-width: 640px) {
    grid-template-columns: 1fr;
}

/* Tablet */
@media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
}

/* Desktop */
@media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
}
```

---

## ✅ Page-Specific Standards

### Dashboard
- **Hero**: "Welcome back!" with info tooltip
- **Cards**: Total Income (Green), Total Expenses (Red), Net Profit (Dynamic color)
- **Sections**: Recent Activity, Current Month Summary, Pro Tip

### Income Overview
- **Hero**: "Income Overview" / "Track and manage all your income sources"
- **Cards**: Total Income (Green), Avg Income Per Trip (Blue), Total Entries (Purple)
- **Sections**: Trip Insights, Filters, Income Table

### Expenses Overview
- **Hero**: "Expenses Overview" / "Track and manage your business expenses"
- **Cards**: Total Expenses (Red), Avg per Expense (Blue), # of Entries (Purple)
- **Sections**: Top Vendor, Expense Breakdown, Filters, Expenses Table

### Balance Sheet
- **Hero**: "Business Net Worth" / "Track what you own and what you owe"
- **Cards**: Business Net Worth (Blue), What You Own (Green), What You Owe (Red)
- **Sections**: What You Own, What You Owe, Info Box

---

## 🎨 Implementation Checklist

For each page, verify:

- [ ] Page header uses standard title/subtitle structure
- [ ] Summary cards use consistent padding, icons, and colors
- [ ] Buttons match standard sizes and colors
- [ ] Filter section uses standard grid layout
- [ ] Data tables have consistent header and cell styling
- [ ] Section spacing follows standard margins
- [ ] Typography uses standard scale
- [ ] Colors match semantic meanings
- [ ] Icons are consistent size and style
- [ ] Shadows and borders are uniform
- [ ] Responsive breakpoints work correctly
- [ ] Footer is positioned consistently

---

## 📝 Quick Reference

**File to Include:**
```html
<link rel="stylesheet" href="shared-styles.css">
```

**Standard Page Structure:**
```html
<body class="bg-background min-h-screen">
    <nav>...</nav>
    
    <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="page-header">...</div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mb-8">...</div>
        
        <!-- Summary Cards -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">...</div>
        
        <!-- Insight Box (optional) -->
        <div class="insight-box">...</div>
        
        <!-- Filters -->
        <div class="filter-section">...</div>
        
        <!-- Data Table -->
        <div class="data-table">...</div>
        
        <!-- Footer -->
        <footer class="page-footer">...</footer>
    </main>
</body>
```

---

**Last Updated:** November 6, 2025  
**Status:** ✅ Complete Design System  
**Apply To:** All ChauFlow pages

