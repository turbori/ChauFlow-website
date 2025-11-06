# Chart of Accounts - Quick Summary

## What Was Created

### 1. Database Table: `chart_of_accounts`

A new table with **33 pre-seeded accounts**:
- **9 Income Accounts** (4000 series)
- **24 Expense Accounts** (5000-7000 series)

### 2. Account Categories

**Income (9 accounts):**
- Rideshare Income
- Private Client Income
- Airport Transfers
- Corporate Accounts
- Hourly Hires
- Affiliate / Referral Income
- Tips Received
- Reimbursements
- Other Income

**Vehicle-Related Expenses (9 accounts):**
- Fuel / Gas ✓
- Tolls ✓
- Parking Fees ✓
- Car Wash / Cleaning ✓
- Maintenance & Repairs ✓
- Insurance ✓
- Lease / Loan Payments ✗
- Registration & DMV Fees ✓
- Vehicle Depreciation ✓

**Operations Expenses (8 accounts):**
- Mobile Phone / Internet ✓
- Business Software / Apps ✓
- Marketing & Ads ✓
- Accounting / Tax Prep ✓
- Supplies & Office ✓
- Bank Fees ✓
- Meals (Client-related) ⚠ (50% deductible)
- Training / Licensing ✓

**Advanced Expenses (5 accounts):**
- Owner Draws / Distributions ✗
- Business Gifts ⚠ (limited)
- Legal & Professional Fees ✓
- Storage Fees ✓
- Utilities (Home Office) ⚠ (prorated)

**Legend:**
- ✓ = Fully tax deductible
- ✗ = Not deductible
- ⚠ = Partially deductible

---

## Files Created

1. **`chart-of-accounts-setup.sql`** - Standalone SQL file (can be run independently)
2. **`supabase-setup.sql`** - Updated with COA system appended
3. **`CHART_OF_ACCOUNTS_GUIDE.md`** - Complete documentation (33KB)
4. **`COA_INTEGRATION_STEPS.md`** - Step-by-step integration guide
5. **`COA_SUMMARY.md`** - This file (quick reference)

---

## Key Features

### Database Features
- ✅ Unique account codes (e.g., "5000" for Fuel)
- ✅ Tax deductibility tracking (true/false/partial)
- ✅ Category grouping for reports
- ✅ Active/inactive status (for archiving)
- ✅ Default vs custom accounts
- ✅ Row Level Security (RLS) enabled
- ✅ Helper views for easy querying
- ✅ Automatic timestamps

### Business Benefits
- 📊 Proper bookkeeping for tax time
- 💰 Know what's deductible vs not
- 📈 Category-based spending analysis
- 🧾 Professional financial reports
- 🔍 Better business insights
- ✅ IRS-compliant categorization

---

## How to Use

### Step 1: Run SQL Script
```bash
1. Open Supabase SQL Editor
2. Copy entire contents of supabase-setup.sql
3. Click "Run"
4. Verify: SELECT COUNT(*) FROM chart_of_accounts; -- Should return 33
```

### Step 2: Update Forms
Replace hardcoded dropdowns with dynamic COA-powered dropdowns:

**Before:**
```html
<option value="Gas">Gas</option>
<option value="Tolls">Tolls</option>
```

**After:**
```javascript
// Load from database
const { data } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'expense')
    .order('account_code');
```

### Step 3: Add account_id Column
```sql
ALTER TABLE public.income
ADD COLUMN account_id UUID REFERENCES chart_of_accounts(id);

ALTER TABLE public.expenses
ADD COLUMN account_id UUID REFERENCES chart_of_accounts(id);
```

### Step 4: Update Form Submissions
Store `account_id` instead of just text category:
```javascript
const incomeData = {
    user_id: session.user.id,
    amount: parseFloat(amount),
    account_id: selectedAccountId, // NEW
    source: selectedAccountName, // Keep for backward compatibility
    // ... rest of fields
};
```

---

## Query Examples

### Get All Income Categories
```javascript
const { data } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'income')
    .eq('is_active', true)
    .order('account_code');
```

### Get Expense Categories Grouped
```javascript
const { data } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'expense')
    .eq('is_active', true)
    .order('category_group, account_code');

// Group by category_group
const grouped = data.reduce((acc, account) => {
    if (!acc[account.category_group]) {
        acc[account.category_group] = [];
    }
    acc[account.category_group].push(account);
    return acc;
}, {});
```

### Get Only Deductible Expenses
```javascript
const { data } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('type', 'expense')
    .in('is_deductible', ['true', 'partial'])
    .eq('is_active', true);
```

### Calculate Total Deductible Expenses
```sql
SELECT 
    SUM(e.amount) as total_deductible
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
    AND coa.is_deductible = 'true'
    AND EXTRACT(YEAR FROM e.date) = $2;
```

### Expense Breakdown by Category Group
```sql
SELECT 
    coa.category_group,
    COUNT(*) as transaction_count,
    SUM(e.amount) as total_amount
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
GROUP BY coa.category_group
ORDER BY total_amount DESC;
```

---

## UI Components

### Dropdown with Deductibility Indicators
```html
<select id="expense-category">
    <option value="">Select category</option>
    <optgroup label="Vehicle-Related">
        <option value="uuid-1">Fuel / Gas (Tax Deductible)</option>
        <option value="uuid-2">Tolls (Tax Deductible)</option>
        <option value="uuid-3">Lease Payments</option>
    </optgroup>
    <optgroup label="Operations">
        <option value="uuid-4">Phone Bill (Tax Deductible)</option>
        <option value="uuid-5">Meals (Partially Deductible)</option>
    </optgroup>
</select>
```

### Deductibility Badge
```html
<span class="badge badge-green">✓ Deductible</span>
<span class="badge badge-yellow">⚠ Partial</span>
<span class="badge badge-gray">Not Deductible</span>
```

---

## Future Enhancements

### Phase 2: Custom Categories
Allow users to create their own categories:
```javascript
const { data, error } = await supabase
    .from('chart_of_accounts')
    .insert({
        account_code: '5999', // Auto-generate
        name: 'My Custom Category',
        type: 'expense',
        category_group: 'Vehicle-Related',
        is_deductible: 'true',
        is_default: false // User-created
    });
```

### Phase 3: Tax Reports
Generate year-end tax summaries:
- Total income by source
- Deductible expenses by category
- Non-deductible expenses
- Partially deductible items with notes

### Phase 4: Budget Tracking
Set monthly budgets per category:
```sql
CREATE TABLE category_budgets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    account_id UUID REFERENCES chart_of_accounts(id),
    monthly_budget DECIMAL(10, 2),
    year INTEGER,
    month INTEGER
);
```

### Phase 5: Analytics Dashboard
- Spending trends by category
- Compare month-over-month
- Identify cost-saving opportunities
- Tax deduction maximization tips

---

## Testing Checklist

- [ ] SQL script runs without errors
- [ ] 33 accounts created in database
- [ ] Can query `income_accounts` view
- [ ] Can query `expense_accounts` view
- [ ] Income form dropdown populates
- [ ] Expense form dropdown populates with groups
- [ ] Can submit income with account_id
- [ ] Can submit expense with account_id
- [ ] Dashboard displays categorized data
- [ ] Filters work with new categories
- [ ] Deductibility indicators show correctly

---

## Support & Documentation

📖 **Full Documentation**: See `CHART_OF_ACCOUNTS_GUIDE.md`  
🔧 **Integration Guide**: See `COA_INTEGRATION_STEPS.md`  
💾 **SQL Script**: See `supabase-setup.sql` (lines 425+)  
🆘 **Troubleshooting**: See integration guide Step 10

---

## Quick Stats

- **Total Accounts**: 33
- **Income Categories**: 9
- **Expense Categories**: 24
- **Fully Deductible**: 19
- **Partially Deductible**: 4
- **Not Deductible**: 2
- **Category Groups**: 4 (Income, Vehicle-Related, Operations, Advanced)

---

## Account Code Reference

| Series | Type | Category |
|--------|------|----------|
| 4000-4099 | Income | All income sources |
| 5000-5099 | Expense | Vehicle-related |
| 6000-6099 | Expense | Operations/Business |
| 7000-7099 | Expense | Advanced/Optional |

---

**Status**: ✅ Ready to implement  
**Last Updated**: November 6, 2025  
**Version**: 1.0

---

## Next Action

👉 **Start with**: Run `supabase-setup.sql` in your Supabase SQL Editor

Then follow the integration steps in `COA_INTEGRATION_STEPS.md` to update your forms!

