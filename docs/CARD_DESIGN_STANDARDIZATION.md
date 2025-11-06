# Card Design Standardization - Complete ✅

## Summary
All summary cards across Dashboard, Income, Expenses, and Balance Sheet pages have been standardized to use a consistent design system.

## Standard Card Design Pattern

### Structure
```html
<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between mb-4">
        <!-- Icon on left -->
        <div class="w-12 h-12 bg-[color]-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-[color]-600">...</svg>
        </div>
        <!-- Badge or tooltip on right -->
        <span class="text-xs font-semibold text-[color]-600 bg-[color]-50 px-3 py-1 rounded-full">
            Label
        </span>
    </div>
    <p class="text-sm text-gray-500 mb-1">Card Title</p>
    <p class="text-3xl font-bold text-[color]">$0.00</p>
    <p class="text-xs text-gray-500 mt-2">Subtitle</p>
</div>
```

### Key Design Elements

1. **Container**
   - White background (`bg-white`)
   - Rounded corners (`rounded-2xl`)
   - Consistent padding (`p-6`)
   - Subtle shadow (`shadow-sm`)
   - Gray border (`border border-gray-200`)
   - Hover effect (`hover:shadow-md transition-shadow duration-200`)

2. **Icon Container (Top Left)**
   - Fixed size: `w-12 h-12`
   - Light background matching theme color: `bg-[color]-100`
   - Rounded corners: `rounded-xl`
   - Centered icon: `flex items-center justify-center`
   - Icon size: `w-6 h-6 text-[color]-600`

3. **Badge/Tooltip (Top Right)**
   - Small text: `text-xs font-semibold`
   - Colored text and background: `text-[color]-600 bg-[color]-50`
   - Pill shape: `px-3 py-1 rounded-full`

4. **Typography**
   - Card label: `text-sm text-gray-500 mb-1`
   - Main value: `text-3xl font-bold text-[color]`
   - Subtitle: `text-xs text-gray-500 mt-2`

## Color Themes by Page

### Dashboard
- **Income Card**: Green (`green-100`, `green-600`, `text-accent`)
- **Expenses Card**: Red (`red-100`, `red-600`, `text-danger`)
- **Net Profit Card**: Blue gradient (special treatment - `bg-gradient-to-br from-primary to-blue-700`)

### Income Page
- **Total Income**: Green (`green-100`, `green-600`, `text-accent`)
- **Avg Per Trip**: Blue (`blue-100`, `blue-600`, `text-primary`)
- **Total Entries**: Purple (`purple-100`, `purple-600`, `text-purple-600`)

### Expenses Page ✅ UPDATED
- **Total Expenses**: Red (`red-100`, `red-600`, `text-danger`)
- **Avg per Expense**: Blue (`blue-100`, `blue-600`, `text-primary`)
- **Total Entries**: Purple (`purple-100`, `purple-600`, `text-purple-600`)

### Balance Sheet ✅ UPDATED
- **Business Net Worth**: Blue (`blue-100`, `blue-600`, `text-primary`)
- **What You Own (Assets)**: Green (`green-100`, `green-600`, `text-accent`)
- **What You Owe (Liabilities)**: Red (`red-100`, `red-600`, `text-danger`)

## Changes Made

### Expenses Page
**Before**: 
- Cards had different layouts with icons on the right
- Used `border-l-4` accent border on left
- Text and icon positions were inconsistent
- Used `rounded-xl` instead of `rounded-2xl`
- Used `shadow-md` by default instead of `shadow-sm`

**After**:
- Icons moved to top-left in consistent containers
- Removed left border accent
- Added badges to match other pages
- Standardized to `rounded-2xl` and `shadow-sm`
- Added hover effects

### Balance Sheet Page
**Before**:
- Cards used full gradient backgrounds (`bg-gradient-to-br from-[color]-500 to-[color]-600`)
- White text on colored backgrounds
- Icons had white semi-transparent backgrounds
- Different padding and spacing
- Larger icons (`w-7 h-7`)

**After**:
- White card backgrounds with colored icon containers
- Dark text on white backgrounds
- Icons in colored containers matching other pages
- Consistent padding (`p-6`)
- Standard icon size (`w-6 h-6`)

## Visual Consistency Checklist ✅

- ✅ All cards use `rounded-2xl`
- ✅ All cards use `p-6` padding
- ✅ All cards use `shadow-sm` with `hover:shadow-md`
- ✅ All cards use `border border-gray-200`
- ✅ All icons are `w-12 h-12` containers with `w-6 h-6` SVGs
- ✅ All icon containers use `rounded-xl`
- ✅ All icon containers use `bg-[color]-100` with `text-[color]-600` icons
- ✅ All badges use `text-xs font-semibold` with `px-3 py-1 rounded-full`
- ✅ All main values use `text-3xl font-bold`
- ✅ All labels use `text-sm text-gray-500 mb-1`
- ✅ All subtitles use `text-xs text-gray-500 mt-2`
- ✅ Icons positioned top-left, badges/tooltips top-right
- ✅ Consistent `mb-4` spacing after icon row

## Exception: Dashboard Net Profit Card

The Dashboard's Net Profit card intentionally uses a gradient background to highlight it as the most important metric:
- `bg-gradient-to-br from-primary to-blue-700`
- White text instead of dark text
- Semi-transparent white icon container
- This is the ONLY exception to the standard white card design

## Result

All pages now have a cohesive, professional look with:
- Consistent spacing and sizing
- Uniform icon placement and styling
- Matching color themes (Green for income/assets, Red for expenses/liabilities, Blue for profit/net worth, Purple for entries)
- Professional hover effects
- Clean, modern aesthetic

The design is now uniform across all pages while maintaining semantic color coding that helps users quickly identify different types of financial data.

