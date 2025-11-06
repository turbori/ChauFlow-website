# Chart of Accounts - Quick Start Checklist

## 🎯 Goal
Set up a professional Chart of Accounts system for ChauFlow to properly categorize income and expenses for tax purposes.

---

## ✅ Step-by-Step Checklist

### Phase 1: Database Setup (5 minutes)

- [ ] **1.1** Open Supabase SQL Editor
  - URL: https://bvrdimwnarfobmwvthyb.supabase.co/project/_/sql

- [ ] **1.2** Copy the entire `supabase-setup.sql` file
  - File is in your project root
  - Make sure to copy from line 1 to the end

- [ ] **1.3** Paste and click "Run"
  - Wait for success message
  - Should see "Query executed successfully"

- [ ] **1.4** Verify the table was created
  ```sql
  SELECT COUNT(*) FROM chart_of_accounts;
  ```
  - Should return: **33**

- [ ] **1.5** Check the accounts
  ```sql
  SELECT account_code, name, type, is_deductible 
  FROM chart_of_accounts 
  ORDER BY account_code;
  ```
  - Should see 9 income + 24 expense accounts

---

### Phase 2: Add account_id Columns (2 minutes)

- [ ] **2.1** Add account_id to income table
  ```sql
  ALTER TABLE public.income
  ADD COLUMN account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL;
  
  CREATE INDEX idx_income_account_id ON public.income(account_id);
  ```

- [ ] **2.2** Add account_id to expenses table
  ```sql
  ALTER TABLE public.expenses
  ADD COLUMN account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL;
  
  CREATE INDEX idx_expenses_account_id ON public.expenses(account_id);
  ```

- [ ] **2.3** Verify columns were added
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'income' AND column_name = 'account_id';
  
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'expenses' AND column_name = 'account_id';
  ```

---

### Phase 3: Update Dashboard Income Form (10 minutes)

- [ ] **3.1** Open `dashboard.html` in your editor

- [ ] **3.2** Add function to load income accounts (add before `checkAuth()`)
  ```javascript
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
          select.innerHTML = '<option value="">Select income category</option>';
          
          data.forEach(account => {
              const option = document.createElement('option');
              option.value = account.id;
              option.textContent = account.name;
              option.dataset.accountCode = account.account_code;
              select.appendChild(option);
          });
          
          console.log('✅ Loaded income accounts:', data.length);
      } catch (error) {
          console.error('❌ Error loading income accounts:', error);
      }
  }
  ```

- [ ] **3.3** Call `loadIncomeAccounts()` when page loads
  - Find the `checkAuth()` call at the bottom
  - Add after it:
  ```javascript
  checkAuth();
  loadIncomeAccounts(); // Add this line
  ```

- [ ] **3.4** Update the income form submission
  - Find the `submitIncome` function
  - Change this line:
  ```javascript
  // OLD:
  source: document.getElementById('income-source').value,
  
  // NEW:
  account_id: document.getElementById('income-source').value,
  source: document.getElementById('income-source').selectedOptions[0]?.text || 'Unknown',
  ```

- [ ] **3.5** Test the income form
  - Refresh dashboard
  - Click "Add Income"
  - Verify dropdown shows account names
  - Submit a test entry
  - Check console for success

---

### Phase 4: Update Dashboard Expense Form (10 minutes)

- [ ] **4.1** Add function to load expense accounts (add after `loadIncomeAccounts()`)
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
          select.innerHTML = '<option value="">Select expense category</option>';
          
          // Group by category_group
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
                  
                  // Add deductibility indicator
                  if (account.is_deductible === 'true') {
                      option.textContent += ' (Tax Deductible)';
                  } else if (account.is_deductible === 'partial') {
                      option.textContent += ' (Partially Deductible)';
                  }
                  
                  option.dataset.accountCode = account.account_code;
                  option.dataset.deductible = account.is_deductible;
                  optgroup.appendChild(option);
              });
              
              select.appendChild(optgroup);
          });
          
          console.log('✅ Loaded expense accounts:', data.length);
      } catch (error) {
          console.error('❌ Error loading expense accounts:', error);
      }
  }
  ```

- [ ] **4.2** Call `loadExpenseAccounts()` when page loads
  ```javascript
  checkAuth();
  loadIncomeAccounts();
  loadExpenseAccounts(); // Add this line
  ```

- [ ] **4.3** Update the expense form submission
  - Find the `submitExpense` function
  - Change this line:
  ```javascript
  // OLD:
  category: document.getElementById('expense-category').value,
  
  // NEW:
  account_id: document.getElementById('expense-category').value,
  category: document.getElementById('expense-category').selectedOptions[0]?.text.replace(/\(.*?\)/g, '').trim() || 'Unknown',
  ```

- [ ] **4.4** Test the expense form
  - Refresh dashboard
  - Click "Add Expense"
  - Verify dropdown shows grouped categories
  - Verify deductibility indicators show
  - Submit a test entry
  - Check console for success

---

### Phase 5: Update Income Page (10 minutes)

- [ ] **5.1** Open `income.html` in your editor

- [ ] **5.2** Add `loadIncomeAccounts()` function
  - Copy the same function from dashboard.html
  - Paste it in the `<script>` section

- [ ] **5.3** Update the "Add Income" modal
  - Find where the modal opens
  - Call `loadIncomeAccounts()` when modal opens:
  ```javascript
  function openIncomeModal() {
      document.getElementById('income-modal').classList.remove('hidden');
      loadIncomeAccounts(); // Add this
  }
  ```

- [ ] **5.4** Update the category filter dropdown
  - Add function to load categories for filter:
  ```javascript
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

- [ ] **5.5** Call filter function on page load
  - Find `loadIncomeData()` call
  - Add after it:
  ```javascript
  loadIncomeData();
  loadIncomeCategoriesFilter(); // Add this
  ```

- [ ] **5.6** Update income submission
  - Same changes as dashboard (Step 3.4)

- [ ] **5.7** Test income page
  - Navigate to income page
  - Verify "Add Income" modal dropdown works
  - Verify category filter dropdown works
  - Submit a test entry

---

### Phase 6: Verify Everything Works (5 minutes)

- [ ] **6.1** Test Dashboard
  - [ ] Income dropdown loads
  - [ ] Expense dropdown loads with groups
  - [ ] Can submit income
  - [ ] Can submit expense
  - [ ] Recent activity shows entries

- [ ] **6.2** Test Income Page
  - [ ] Page loads without errors
  - [ ] "Add Income" button works
  - [ ] Category filter works
  - [ ] Can submit income
  - [ ] Table updates with new entry

- [ ] **6.3** Check Database
  ```sql
  -- Check recent income entries have account_id
  SELECT id, amount, source, account_id 
  FROM income 
  ORDER BY created_at DESC 
  LIMIT 5;
  
  -- Check recent expense entries have account_id
  SELECT id, amount, category, account_id 
  FROM expenses 
  ORDER BY created_at DESC 
  LIMIT 5;
  ```
  - [ ] account_id fields are populated (not NULL)

- [ ] **6.4** Check Console Logs
  - [ ] No errors in browser console
  - [ ] See "✅ Loaded income accounts: 9"
  - [ ] See "✅ Loaded expense accounts: 24"

---

### Phase 7: Optional - Migrate Existing Data (5 minutes)

If you have existing income/expense entries without account_id:

- [ ] **7.1** Map old income sources to new accounts
  ```sql
  UPDATE public.income
  SET account_id = (
      SELECT id FROM chart_of_accounts
      WHERE name = income.source AND type = 'income'
      LIMIT 1
  )
  WHERE account_id IS NULL;
  ```

- [ ] **7.2** Map old expense categories to new accounts
  ```sql
  UPDATE public.expenses
  SET account_id = (
      SELECT id FROM chart_of_accounts
      WHERE name = expenses.category AND type = 'expense'
      LIMIT 1
  )
  WHERE account_id IS NULL;
  ```

- [ ] **7.3** Set unmapped entries to "Other"
  ```sql
  -- For income
  UPDATE public.income
  SET account_id = (SELECT id FROM chart_of_accounts WHERE account_code = '4090')
  WHERE account_id IS NULL;
  
  -- For expenses
  UPDATE public.expenses
  SET account_id = (SELECT id FROM chart_of_accounts WHERE name = 'Supplies & Office')
  WHERE account_id IS NULL;
  ```

- [ ] **7.4** Verify migration
  ```sql
  -- Should return 0
  SELECT COUNT(*) FROM income WHERE account_id IS NULL;
  SELECT COUNT(*) FROM expenses WHERE account_id IS NULL;
  ```

---

## 🎉 Success Criteria

You'll know it's working when:

✅ Dashboard income dropdown shows 9 categories  
✅ Dashboard expense dropdown shows 24 categories in 4 groups  
✅ Income page category filter shows 9 categories  
✅ New entries have account_id populated in database  
✅ No console errors  
✅ Forms submit successfully  

---

## 🆘 Troubleshooting

### Issue: Dropdown is empty

**Check:**
1. SQL script ran successfully
2. Console shows "Loaded accounts: X"
3. No errors in console

**Fix:**
```sql
-- Verify accounts exist
SELECT COUNT(*) FROM chart_of_accounts;
-- Should return 33

-- Check RLS policy
SELECT * FROM pg_policies WHERE tablename = 'chart_of_accounts';
```

### Issue: Form submission fails

**Check:**
1. account_id column exists
2. Value is a valid UUID
3. Console logs show the account_id

**Fix:**
```javascript
// Add validation before submit
const accountId = document.getElementById('income-source').value;
console.log('Account ID:', accountId);
if (!accountId) {
    alert('Please select a category');
    return;
}
```

### Issue: "column account_id does not exist"

**Fix:**
```sql
-- Run Phase 2 steps again
ALTER TABLE public.income
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.chart_of_accounts(id);

ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.chart_of_accounts(id);
```

---

## 📚 Documentation Reference

- **Full Guide**: `CHART_OF_ACCOUNTS_GUIDE.md`
- **Integration Steps**: `COA_INTEGRATION_STEPS.md`
- **Visual Structure**: `ACCOUNT_STRUCTURE_VISUAL.md`
- **Quick Summary**: `COA_SUMMARY.md`

---

## ⏱️ Estimated Time

- **Database Setup**: 5 minutes
- **Dashboard Updates**: 20 minutes
- **Income Page Updates**: 10 minutes
- **Testing**: 5 minutes
- **Total**: ~40 minutes

---

## 🚀 Next Steps After Completion

Once COA is integrated:

1. **Add Tax Reports**: Show deductible vs non-deductible expenses
2. **Category Analytics**: Spending trends by category
3. **Budget Tracking**: Set monthly budgets per category
4. **Custom Categories**: Let users create their own
5. **Export to CSV**: Export with account codes for accountants

---

**Ready to start?** Begin with Phase 1 and check off each item as you go!

**Status**: ✅ Ready to implement  
**Last Updated**: November 6, 2025

