# Chart of Accounts Integration Steps

## Quick Start Guide

Follow these steps to integrate the Chart of Accounts system into ChauFlow.

---

## Step 1: Run the SQL Script

1. Open Supabase SQL Editor: https://bvrdimwnarfobmwvthyb.supabase.co/project/_/sql
2. Copy the ENTIRE contents of `supabase-setup.sql`
3. Paste and click "Run"
4. Verify success:

```sql
-- Check that accounts were created
SELECT COUNT(*) FROM chart_of_accounts;
-- Should return 33

-- View all income accounts
SELECT * FROM income_accounts;

-- View all expense accounts grouped
SELECT * FROM accounts_by_category WHERE type = 'expense';
```

---

## Step 2: Update Income Form (dashboard.html)

### Current Code (Old):

```html
<select id="income-source" class="w-full px-4 py-3 rounded-lg border border-gray-300">
    <option value="">Select income source</option>
    <option value="Rideshare Trip">Rideshare Trip</option>
    <option value="Black Car Service">Black Car Service</option>
    <option value="Private Client">Private Client</option>
    <option value="Delivery">Delivery</option>
    <option value="Other">Other</option>
</select>
```

### New Code (COA-powered):

```html
<select id="income-source" class="w-full px-4 py-3 rounded-lg border border-gray-300">
    <option value="">Select income category</option>
    <!-- This will be populated dynamically -->
</select>
```

### Add JavaScript to Load Income Accounts:

```javascript
// Add this function at the top of your script section
async function loadIncomeAccounts() {
    try {
        const { data, error } = await supabase
            .from('chart_of_accounts')
            .select('*')
            .eq('type', 'income')
            .eq('is_active', true)
            .order('account_code');
        
        if (error) throw error;
        
        const select = document.getElementById('income-source');
        
        // Clear existing options except the first one
        select.innerHTML = '<option value="">Select income category</option>';
        
        // Add accounts as options
        data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = account.name;
            option.dataset.accountCode = account.account_code;
            select.appendChild(option);
        });
        
        console.log('Loaded income accounts:', data.length);
    } catch (error) {
        console.error('Error loading income accounts:', error);
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadIncomeAccounts();
    // ... your other initialization code
});
```

### Update Form Submission:

```javascript
// In your submitIncome function, change this:
// OLD:
const incomeData = {
    user_id: session.user.id,
    amount: parseFloat(unformatCurrency(amountInput)),
    source: document.getElementById('income-source').value,
    // ... rest of fields
};

// NEW:
const incomeData = {
    user_id: session.user.id,
    amount: parseFloat(unformatCurrency(amountInput)),
    account_id: document.getElementById('income-source').value, // Now stores account ID
    source: document.getElementById('income-source').selectedOptions[0].text, // Store name for backward compatibility
    // ... rest of fields
};
```

---

## Step 3: Update Expense Form (dashboard.html)

### Current Code (Old):

```html
<select id="expense-category" class="w-full px-4 py-3 rounded-lg border border-gray-300">
    <option value="">Select category</option>
    <option value="Gas">Gas</option>
    <option value="Tolls">Tolls</option>
    <!-- etc -->
</select>
```

### New Code (COA-powered with grouping):

```html
<select id="expense-category" class="w-full px-4 py-3 rounded-lg border border-gray-300">
    <option value="">Select expense category</option>
    <!-- This will be populated dynamically with optgroups -->
</select>
```

### Add JavaScript to Load Expense Accounts:

```javascript
async function loadExpenseAccounts() {
    try {
        const { data, error } = await supabase
            .from('chart_of_accounts')
            .select('*')
            .eq('type', 'expense')
            .eq('is_active', true)
            .order('category_group, account_code');
        
        if (error) throw error;
        
        const select = document.getElementById('expense-category');
        
        // Clear existing options
        select.innerHTML = '<option value="">Select expense category</option>';
        
        // Group accounts by category_group
        const grouped = {};
        data.forEach(account => {
            if (!grouped[account.category_group]) {
                grouped[account.category_group] = [];
            }
            grouped[account.category_group].push(account);
        });
        
        // Create optgroups
        Object.keys(grouped).forEach(groupName => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName;
            
            grouped[groupName].forEach(account => {
                const option = document.createElement('option');
                option.value = account.id;
                option.textContent = account.name;
                option.dataset.accountCode = account.account_code;
                option.dataset.deductible = account.is_deductible;
                
                // Add deductibility indicator
                if (account.is_deductible === 'true') {
                    option.textContent += ' ✓';
                } else if (account.is_deductible === 'partial') {
                    option.textContent += ' ⚠';
                }
                
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
        
        console.log('Loaded expense accounts:', data.length);
    } catch (error) {
        console.error('Error loading expense accounts:', error);
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadExpenseAccounts();
    // ... your other initialization code
});
```

### Update Expense Form Submission:

```javascript
// In your submitExpense function:
// OLD:
const expenseData = {
    user_id: session.user.id,
    amount: parseFloat(unformatCurrency(amountInput)),
    category: document.getElementById('expense-category').value,
    // ... rest of fields
};

// NEW:
const expenseData = {
    user_id: session.user.id,
    amount: parseFloat(unformatCurrency(amountInput)),
    account_id: document.getElementById('expense-category').value, // Now stores account ID
    category: document.getElementById('expense-category').selectedOptions[0].text.replace(/[✓⚠]/g, '').trim(), // Store name for backward compatibility
    // ... rest of fields
};
```

---

## Step 4: Update Database Schema (Add account_id columns)

You need to add `account_id` columns to your existing `income` and `expenses` tables:

```sql
-- Add account_id to income table
ALTER TABLE public.income
ADD COLUMN account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_income_account_id ON public.income(account_id);

-- Add account_id to expenses table
ALTER TABLE public.expenses
ADD COLUMN account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_expenses_account_id ON public.expenses(account_id);
```

**Note**: We use `ON DELETE SET NULL` so that if an account is deleted, existing transactions aren't deleted, just unlinked.

---

## Step 5: Update Income Page (income.html)

### Update Category Filter Dropdown:

```javascript
// In loadIncomeData function, after fetching income data:
async function loadIncomeData() {
    // ... existing code ...
    
    // Load categories for filter dropdown
    await loadIncomeCategoriesFilter();
}

async function loadIncomeCategoriesFilter() {
    try {
        const { data, error } = await supabase
            .from('chart_of_accounts')
            .select('*')
            .eq('type', 'income')
            .eq('is_active', true)
            .order('name');
        
        if (error) throw error;
        
        const select = document.getElementById('category-filter');
        
        // Keep "All Categories" option
        select.innerHTML = '<option value="">All Categories</option>';
        
        data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = account.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}
```

### Update the Add Income Modal:

Use the same `loadIncomeAccounts()` function from Step 2, but make sure to call it when opening the modal:

```javascript
function openIncomeModal() {
    document.getElementById('income-modal').classList.remove('hidden');
    loadIncomeAccounts(); // Load fresh data each time
}
```

---

## Step 6: Add Visual Indicators for Tax Deductibility

### Create CSS for Badges:

```css
/* Add to your <style> section */
.deductible-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
}

.deductible-badge.full {
    background-color: #10b981;
    color: white;
}

.deductible-badge.partial {
    background-color: #f59e0b;
    color: white;
}

.deductible-badge.none {
    background-color: #6b7280;
    color: white;
}
```

### Add Badges to Expense Form:

```javascript
// Enhance the loadExpenseAccounts function:
grouped[groupName].forEach(account => {
    const option = document.createElement('option');
    option.value = account.id;
    option.textContent = account.name;
    
    // Add deductibility text
    if (account.is_deductible === 'true') {
        option.textContent += ' (Tax Deductible)';
    } else if (account.is_deductible === 'partial') {
        option.textContent += ' (Partially Deductible)';
    }
    
    option.dataset.accountCode = account.account_code;
    option.dataset.deductible = account.is_deductible;
    
    optgroup.appendChild(option);
});
```

---

## Step 7: Update Dashboard Summary Cards

### Show Deductible vs Non-Deductible Expenses:

```javascript
async function loadDashboardData() {
    // ... existing code to fetch income and expenses ...
    
    // Calculate deductible expenses
    const { data: expensesWithAccounts, error: expenseError } = await supabase
        .from('expenses')
        .select(`
            *,
            chart_of_accounts (
                name,
                is_deductible,
                category_group
            )
        `)
        .eq('user_id', session.user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);
    
    if (expensesWithAccounts) {
        const deductibleExpenses = expensesWithAccounts
            .filter(e => e.chart_of_accounts?.is_deductible === 'true')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        const partiallyDeductible = expensesWithAccounts
            .filter(e => e.chart_of_accounts?.is_deductible === 'partial')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        console.log('Deductible expenses:', deductibleExpenses);
        console.log('Partially deductible:', partiallyDeductible);
        
        // Update UI to show this breakdown
        // ... add new cards or tooltips
    }
}
```

---

## Step 8: Create Reports by Category

### Add a new function for category breakdown:

```javascript
async function getCategoryBreakdown(startDate, endDate) {
    const { data: session } = await supabase.auth.getSession();
    
    const { data, error } = await supabase
        .from('expenses')
        .select(`
            amount,
            chart_of_accounts (
                name,
                category_group,
                is_deductible
            )
        `)
        .eq('user_id', session.session.user.id)
        .gte('date', startDate)
        .lte('date', endDate);
    
    if (error) {
        console.error('Error fetching category breakdown:', error);
        return;
    }
    
    // Group by category_group
    const breakdown = {};
    data.forEach(expense => {
        const group = expense.chart_of_accounts?.category_group || 'Uncategorized';
        if (!breakdown[group]) {
            breakdown[group] = {
                total: 0,
                count: 0,
                deductible: 0
            };
        }
        breakdown[group].total += parseFloat(expense.amount);
        breakdown[group].count += 1;
        
        if (expense.chart_of_accounts?.is_deductible === 'true') {
            breakdown[group].deductible += parseFloat(expense.amount);
        }
    });
    
    console.log('Category breakdown:', breakdown);
    return breakdown;
}
```

---

## Step 9: Testing Checklist

- [ ] Run SQL script in Supabase
- [ ] Verify 33 accounts created
- [ ] Test income form - dropdown populates
- [ ] Test expense form - dropdown populates with groups
- [ ] Submit test income entry
- [ ] Submit test expense entry
- [ ] Verify `account_id` is saved in database
- [ ] Check dashboard displays data correctly
- [ ] Test category filters on income page
- [ ] Verify deductibility indicators show up

---

## Step 10: Migration Strategy (Optional)

If you have existing data without `account_id`, you can migrate it:

```sql
-- Map old income sources to new account IDs
UPDATE public.income
SET account_id = (
    SELECT id FROM chart_of_accounts
    WHERE name = income.source AND type = 'income'
    LIMIT 1
)
WHERE account_id IS NULL;

-- Map old expense categories to new account IDs
UPDATE public.expenses
SET account_id = (
    SELECT id FROM chart_of_accounts
    WHERE name = expenses.category AND type = 'expense'
    LIMIT 1
)
WHERE account_id IS NULL;

-- For unmapped entries, set to "Other"
UPDATE public.income
SET account_id = (SELECT id FROM chart_of_accounts WHERE account_code = '4090')
WHERE account_id IS NULL;

UPDATE public.expenses
SET account_id = (SELECT id FROM chart_of_accounts WHERE name = 'Supplies & Office')
WHERE account_id IS NULL;
```

---

## Troubleshooting

### Issue: Dropdown is empty

**Check:**
1. SQL script ran successfully
2. Console shows "Loaded income/expense accounts: X"
3. RLS policies allow reading chart_of_accounts

**Fix:**
```sql
-- Verify RLS policy exists
SELECT * FROM pg_policies WHERE tablename = 'chart_of_accounts';

-- If missing, run:
CREATE POLICY "Anyone can view chart of accounts"
    ON public.chart_of_accounts FOR SELECT
    USING (true);
```

### Issue: Form submission fails

**Check:**
1. `account_id` column exists in income/expenses tables
2. Value being submitted is a valid UUID
3. Console logs show the correct account ID

**Fix:**
```javascript
// Add validation before submitting
const accountId = document.getElementById('income-source').value;
if (!accountId) {
    alert('Please select a category');
    return;
}
console.log('Submitting with account_id:', accountId);
```

---

## Next Steps

Once COA is integrated:

1. **Add Custom Categories**: Allow users to create their own categories
2. **Tax Reports**: Generate year-end tax summaries
3. **Category Analytics**: Show spending trends by category
4. **Budget Tracking**: Set budgets per category
5. **Export to CSV**: Export transactions with account codes for accountants

---

**Ready to integrate?** Start with Step 1 and work through each step systematically!

