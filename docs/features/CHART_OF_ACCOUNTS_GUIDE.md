# Chart of Accounts (COA) System - Complete Guide

## Overview

The Chart of Accounts system provides a structured way to categorize and track all income and expenses for independent drivers and fleet owners. This helps with:

- **Tax Preparation**: Know what's deductible
- **Business Analysis**: See where money comes from and goes
- **Profitability**: Track net income by category
- **Compliance**: Proper bookkeeping for IRS requirements

---

## 📊 Account Structure

### Account Code System

We use a standard numbering system:

- **4000-4999**: Income Accounts
- **5000-5999**: Vehicle-Related Expenses
- **6000-6999**: Operations/Business Expenses  
- **7000-7999**: Advanced/Optional Expenses

---

## 💰 Income Accounts (4000 Series)

| Code | Name | Description |
|------|------|-------------|
| 4000 | Rideshare Income | Uber, Lyft, other rideshare platforms |
| 4010 | Private Client Income | Direct bookings from private clients |
| 4020 | Airport Transfers | Airport pickup/drop-off services |
| 4030 | Corporate Accounts | Corporate contracts and business accounts |
| 4040 | Hourly Hires | Hourly chauffeur services |
| 4050 | Affiliate / Referral Income | Referral bonuses and affiliate programs |
| 4060 | Tips Received | Tips and gratuities from passengers |
| 4070 | Reimbursements | Client reimbursements for expenses |
| 4090 | Other Income | Miscellaneous income |

**Tax Note:** All income is taxable, regardless of category.

---

## 🚗 Vehicle-Related Expenses (5000 Series)

| Code | Name | Deductible | Description |
|------|------|------------|-------------|
| 5000 | Fuel / Gas | ✅ Yes | Gasoline for business use |
| 5010 | Tolls | ✅ Yes | Highway tolls and bridge fees |
| 5020 | Parking Fees | ✅ Yes | Parking and garage charges |
| 5030 | Car Wash / Cleaning | ✅ Yes | Vehicle washing and cleaning |
| 5040 | Maintenance & Repairs | ✅ Yes | Repairs, parts, oil changes |
| 5050 | Insurance | ✅ Yes | Vehicle insurance premiums |
| 5060 | Lease / Loan Payments | ❌ No | Principal portion not deductible |
| 5070 | Registration & DMV Fees | ✅ Yes | Tags, registration, DMV fees |
| 5080 | Vehicle Depreciation | ✅ Yes | Depreciation for owned vehicles |

**Tax Note:** Vehicle expenses are typically deductible based on business use percentage.

---

## 💼 Operations/Business Expenses (6000 Series)

| Code | Name | Deductible | Description |
|------|------|------------|-------------|
| 6000 | Mobile Phone / Internet | ✅ Yes | Phone and internet for business |
| 6010 | Business Software / Apps | ✅ Yes | Software subscriptions (ChauFlow, etc.) |
| 6020 | Marketing & Ads | ✅ Yes | Advertising and marketing costs |
| 6030 | Accounting / Tax Prep | ✅ Yes | Accounting and tax preparation |
| 6040 | Supplies & Office | ✅ Yes | Office supplies and materials |
| 6050 | Bank Fees | ✅ Yes | Bank fees and transaction charges |
| 6060 | Meals (Client-related) | ⚠️ Partial | Business meals (50% deductible) |
| 6070 | Training / Licensing | ✅ Yes | Training courses and licensing |

**Tax Note:** Most business expenses are fully deductible.

---

## 🔧 Advanced/Optional Expenses (7000 Series)

| Code | Name | Deductible | Description |
|------|------|------------|-------------|
| 7000 | Owner Draws / Distributions | ❌ No | Personal withdrawals (not deductible) |
| 7010 | Business Gifts | ⚠️ Partial | Client gifts (limited deduction) |
| 7020 | Legal & Professional Fees | ✅ Yes | Legal and professional services |
| 7030 | Storage Fees | ✅ Yes | Storage unit or garage rental |
| 7040 | Utilities (Home Office) | ⚠️ Partial | Home office utilities (prorated) |

**Tax Note:** Some expenses have special rules or limitations.

---

## 🗄️ Database Schema

### Table: `chart_of_accounts`

```sql
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY,
    account_code TEXT UNIQUE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    category_group TEXT,
    is_deductible TEXT CHECK (is_deductible IN ('true', 'false', 'partial')),
    is_default BOOLEAN,
    is_active BOOLEAN,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Fields Explained

- **account_code**: Unique identifier (e.g., "5000")
- **name**: Display name (e.g., "Fuel / Gas")
- **type**: Either "income" or "expense"
- **category_group**: Grouping for reports (e.g., "Vehicle-Related")
- **is_deductible**: Tax deductibility status
  - `"true"` = Fully deductible
  - `"false"` = Not deductible
  - `"partial"` = Partially deductible (special rules apply)
- **is_default**: System-defined (true) vs user-created (false)
- **is_active**: Can be archived without deleting
- **description**: Helpful explanation for users

---

## 🔌 Integration Points

### 1. Income Form Dropdown

When adding income, users select from income accounts:

```javascript
// Fetch income accounts
const { data: incomeAccounts } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'income')
    .eq('is_active', true)
    .order('account_code');

// Populate dropdown
<select name="income_account">
    {incomeAccounts.map(account => (
        <option value={account.id}>{account.name}</option>
    ))}
</select>
```

### 2. Expense Form Dropdown

When adding expenses, users select from expense accounts:

```javascript
// Fetch expense accounts grouped by category
const { data: expenseAccounts } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'expense')
    .eq('is_active', true)
    .order('category_group, account_code');

// Populate grouped dropdown
<select name="expense_account">
    <optgroup label="Vehicle-Related">
        <option value="...">Fuel / Gas</option>
        <option value="...">Tolls</option>
    </optgroup>
    <optgroup label="Operations">
        <option value="...">Mobile Phone</option>
    </optgroup>
</select>
```

### 3. Dashboard Summary

Show totals by category:

```javascript
// Get income by category
SELECT 
    coa.category_group,
    coa.name,
    SUM(i.amount) as total
FROM income i
JOIN chart_of_accounts coa ON i.account_id = coa.id
WHERE i.user_id = $1
    AND i.date >= $2
    AND i.date <= $3
GROUP BY coa.category_group, coa.name
ORDER BY total DESC;
```

### 4. Tax Reports

Show deductible vs non-deductible expenses:

```javascript
// Get deductible expenses
SELECT 
    coa.name,
    coa.is_deductible,
    SUM(e.amount) as total
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
    AND EXTRACT(YEAR FROM e.date) = $2
GROUP BY coa.name, coa.is_deductible
ORDER BY coa.name;
```

---

## 🎨 UI Components

### Account Selector with Icons

```html
<div class="account-selector">
    <div class="account-option">
        <svg class="icon"><!-- Fuel icon --></svg>
        <div>
            <div class="name">Fuel / Gas</div>
            <div class="code">5000</div>
            <span class="badge deductible">Tax Deductible</span>
        </div>
    </div>
</div>
```

### Category Group Display

```html
<div class="category-group">
    <h3>
        <svg class="icon"><!-- Vehicle icon --></svg>
        Vehicle-Related Expenses
    </h3>
    <div class="accounts-list">
        <!-- Account items -->
    </div>
</div>
```

### Deductibility Indicators

Use color-coded badges:
- **Green**: Fully deductible
- **Gray**: Not deductible
- **Yellow**: Partially deductible

```html
<span class="badge badge-green">✓ Deductible</span>
<span class="badge badge-gray">Not Deductible</span>
<span class="badge badge-yellow">⚠ Partial</span>
```

---

## 🔮 Future Features

### 1. Custom Accounts

Users can create their own categories:

```javascript
// Create custom account
INSERT INTO chart_of_accounts (
    account_code,
    name,
    type,
    category_group,
    is_deductible,
    is_default
) VALUES (
    '5999', -- Auto-generated
    'Custom Category',
    'expense',
    'Vehicle-Related',
    'true',
    false  -- User-created
);
```

### 2. Account Archiving

Instead of deleting, mark as inactive:

```javascript
UPDATE chart_of_accounts
SET is_active = false
WHERE id = $1;
```

### 3. Renaming Accounts

Allow users to rename (but not delete) default accounts:

```javascript
UPDATE chart_of_accounts
SET name = 'New Name'
WHERE id = $1 AND is_default = true;
```

### 4. Account Usage Stats

Show which accounts are used most:

```sql
SELECT 
    coa.name,
    COUNT(*) as usage_count,
    SUM(e.amount) as total_amount
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
GROUP BY coa.name
ORDER BY usage_count DESC
LIMIT 10;
```

---

## 📈 Reporting Examples

### Monthly Expense Breakdown

```sql
SELECT 
    coa.category_group,
    SUM(e.amount) as total,
    COUNT(*) as transaction_count
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
    AND e.date >= date_trunc('month', CURRENT_DATE)
GROUP BY coa.category_group
ORDER BY total DESC;
```

### Year-End Tax Summary

```sql
SELECT 
    CASE 
        WHEN coa.is_deductible = 'true' THEN 'Fully Deductible'
        WHEN coa.is_deductible = 'partial' THEN 'Partially Deductible'
        ELSE 'Not Deductible'
    END as deductibility,
    SUM(e.amount) as total
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
    AND EXTRACT(YEAR FROM e.date) = $2
GROUP BY deductibility;
```

### Profit & Loss by Category

```sql
-- Income by category
SELECT 'Income' as type, coa.name, SUM(i.amount) as amount
FROM income i
JOIN chart_of_accounts coa ON i.account_id = coa.id
WHERE i.user_id = $1
GROUP BY coa.name

UNION ALL

-- Expenses by category
SELECT 'Expense' as type, coa.name, SUM(e.amount) as amount
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
GROUP BY coa.name

ORDER BY type, amount DESC;
```

---

## ✅ Setup Checklist

- [ ] Run `chart-of-accounts-setup.sql` in Supabase SQL Editor
- [ ] Verify 33 accounts created (9 income + 24 expense)
- [ ] Test querying income_accounts view
- [ ] Test querying expense_accounts view
- [ ] Update income form to use COA dropdown
- [ ] Update expense form to use COA dropdown
- [ ] Add COA filtering to reports
- [ ] Create UI components for account selection
- [ ] Add deductibility indicators
- [ ] Test with real transactions

---

## 🆘 Troubleshooting

### Issue: Accounts not showing in dropdown

**Solution:** Check RLS policies and ensure user is authenticated.

### Issue: Can't create custom accounts

**Solution:** Verify `is_default = false` and user has INSERT permission.

### Issue: Deductibility showing wrong

**Solution:** Check `is_deductible` field uses strings ('true', 'false', 'partial'), not booleans.

---

**Last Updated**: November 6, 2025  
**Version**: 1.0  
**Status**: ✅ Ready for Implementation

