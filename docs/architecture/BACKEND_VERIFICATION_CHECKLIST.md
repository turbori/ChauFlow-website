# ChauFlow Backend Verification Checklist

Use this checklist to manually verify all backend functionality.

---

## 1. Data Integrity & Sync

### Income Records
- [ ] Add new income → Check it appears in table
- [ ] Edit income → Check changes save correctly
- [ ] Delete income → Check it's removed from table
- [ ] Add income with all optional fields → Check all fields save
- [ ] Add income with only required fields → Check it saves
- [ ] Check `user_id` matches logged-in user
- [ ] Check `created_at` and `updated_at` timestamps

### Expense Records
- [ ] Add new expense → Check it appears in table
- [ ] Edit expense → Check changes save correctly
- [ ] Delete expense → Check it's removed from table
- [ ] Add expense with vendor → Check vendor saves
- [ ] Add expense without vendor → Check it saves as null
- [ ] Check `user_id` matches logged-in user
- [ ] Check `created_at` and `updated_at` timestamps

### Asset Records
- [ ] Add new asset → Check it appears in list
- [ ] Delete asset → Check it's removed from list
- [ ] Add asset with notes → Check notes save
- [ ] Add asset without notes → Check it saves
- [ ] Check `user_id` matches logged-in user

### Liability Records
- [ ] Add new liability → Check it appears in list
- [ ] Delete liability → Check it's removed from list
- [ ] Add liability with due date → Check date saves
- [ ] Add liability without due date → Check it saves as null
- [ ] Check `user_id` matches logged-in user

---

## 2. Calculations & Aggregates

### Dashboard
- [ ] Add income → Check "Total Income" updates
- [ ] Add expense → Check "Total Expenses" updates
- [ ] Check "Net Profit" = Income - Expenses
- [ ] Add income with trips → Check "Avg Per Trip" updates
- [ ] Add income with hours → Check "Hours" updates
- [ ] Add income with miles → Check "Miles" updates
- [ ] Delete all income → Check totals reset to $0.00

### Income Overview
- [ ] Check "Total Income (month)" shows current month only
- [ ] Check "Avg Income Per Trip" = Total ÷ Trips
- [ ] Check "# of entries" matches table rows
- [ ] Check "Top Income Source" shows highest earning source
- [ ] Check "Most Active Day" shows day with most trips
- [ ] Check "Total Hours" sums all hours_worked
- [ ] Hover over "Avg Income Per Trip" → Check tooltip appears

### Expenses Overview
- [ ] Check "Total Expenses (month)" shows current month only
- [ ] Check "Avg per Expense" = Total ÷ Entries
- [ ] Check "# of Entries" matches table rows
- [ ] Check "Top Vendor" shows vendor with most spending
- [ ] Check "Expense Breakdown" shows categories with percentages
- [ ] Click sortable headers → Check table sorts correctly

### Balance Sheet
- [ ] Check "Business Net Worth" = Assets - Liabilities
- [ ] Check "Total Assets" sums all asset values
- [ ] Check "Total Liabilities" sums all liability balances
- [ ] Check formula breakdown displays correctly
- [ ] Add asset → Check Net Worth increases
- [ ] Add liability → Check Net Worth decreases

---

## 3. Cross-Page Dependencies

### Dashboard ↔ Income
- [ ] Add income on Dashboard → Refresh Dashboard → Check it appears
- [ ] Add income on Income page → Refresh Dashboard → Check total updates
- [ ] Delete income on Income page → Refresh Dashboard → Check total updates

### Dashboard ↔ Expenses
- [ ] Add expense on Dashboard → Refresh Dashboard → Check it appears
- [ ] Add expense on Expenses page → Refresh Dashboard → Check total updates
- [ ] Delete expense on Expenses page → Refresh Dashboard → Check total updates

### Balance Sheet Independence
- [ ] Add asset → Check Net Worth updates immediately
- [ ] Delete asset → Check Net Worth updates immediately
- [ ] Add liability → Check Net Worth updates immediately
- [ ] Delete liability → Check Net Worth updates immediately

---

## 4. Data Types & Schema

### Amount Fields
- [ ] Enter $1.23 → Check it saves as 1.23
- [ ] Enter $1000 → Check it saves as 1000.00
- [ ] Enter $0.01 → Check it saves as 0.01
- [ ] Try entering negative amount → Check it's prevented
- [ ] Try entering text → Check it's prevented

### Date Fields
- [ ] Select today's date → Check it saves correctly
- [ ] Select past date → Check it saves correctly
- [ ] Select future date → Check it saves correctly
- [ ] Check date displays in correct format (MM/DD/YYYY)

### Optional Fields
- [ ] Leave trip_count empty → Check it saves as null
- [ ] Leave hours_worked empty → Check it saves as null
- [ ] Leave miles_driven empty → Check it saves as null
- [ ] Leave vendor empty → Check it saves as null
- [ ] Leave description empty → Check it saves as null

---

## 5. Edge Case Testing

### Empty Forms
- [ ] Try submitting income form with no amount → Check it's prevented
- [ ] Try submitting expense form with no category → Check it's prevented
- [ ] Try submitting asset form with no name → Check it's prevented
- [ ] Check validation messages are clear

### Large Numbers
- [ ] Enter $99,999 income → Check it saves and displays correctly
- [ ] Enter 10,000 miles → Check it saves and displays with commas
- [ ] Enter 999 trips → Check it saves and calculates correctly

### Zero State
- [ ] Delete all income → Check Dashboard shows $0.00
- [ ] Delete all expenses → Check Dashboard shows $0.00
- [ ] Delete all assets → Check Balance Sheet shows $0.00
- [ ] Delete all liabilities → Check Balance Sheet shows $0.00
- [ ] Check "Welcome Banner" appears when no data

### Special Characters
- [ ] Enter description with quotes ("test") → Check it saves
- [ ] Enter vendor with apostrophe (Joe's) → Check it saves
- [ ] Enter description with commas → Check CSV export works
- [ ] Enter very long description (500+ chars) → Check it saves

---

## 6. Performance Check

### Load Times
- [ ] Load Dashboard with 0 entries → Should be < 500ms
- [ ] Load Dashboard with 50 entries → Should be < 800ms
- [ ] Load Income page with 50 entries → Should be < 1s
- [ ] Load Expenses page with 50 entries → Should be < 1s
- [ ] Load Balance Sheet with 20 items → Should be < 800ms

### Filters & Sorting
- [ ] Apply search filter → Should be instant (< 100ms)
- [ ] Apply category filter → Should be instant (< 100ms)
- [ ] Apply date range filter → Should be instant (< 100ms)
- [ ] Sort by date → Should be instant (< 100ms)
- [ ] Sort by amount → Should be instant (< 100ms)

### Responsiveness
- [ ] Add 100+ income entries → Check page still responsive
- [ ] Filter 100+ entries → Check filtering still fast
- [ ] Sort 100+ entries → Check sorting still fast

---

## 7. Export Functions

### Income Export
- [ ] Click "Export" button → Check CSV downloads
- [ ] Check filename format: ChauFlow_Income_YYYY-MM-DD.csv
- [ ] Open CSV → Check headers are correct
- [ ] Check all income entries are present
- [ ] Check special characters are escaped correctly
- [ ] Check amounts are formatted correctly

### Expense Export
- [ ] Click "Export" button → Check CSV downloads
- [ ] Check filename format: ChauFlow_Expenses_YYYY-MM-DD.csv
- [ ] Open CSV → Check headers are correct
- [ ] Check all expense entries are present
- [ ] Check special characters are escaped correctly
- [ ] Check amounts are formatted correctly

---

## 8. Error Handling

### Network Errors
- [ ] Disconnect internet → Try adding income → Check error message
- [ ] Disconnect internet → Try loading page → Check error message
- [ ] Reconnect internet → Check page recovers

### Invalid Data
- [ ] Try entering text in amount field → Check it's prevented
- [ ] Try entering negative amount → Check it's prevented
- [ ] Try submitting without required fields → Check validation

### Console Checks
- [ ] Open Chrome DevTools → Check no errors in Console
- [ ] Check Network tab → All API calls return 200 OK
- [ ] Check no 404 errors
- [ ] Check no 500 errors
- [ ] Check no CORS errors

---

## 9. Security Checks

### User Isolation
- [ ] Create User A → Add income
- [ ] Create User B → Check User B can't see User A's income
- [ ] Try manually changing user_id in query → Check it's blocked

### Authentication
- [ ] Log out → Try accessing dashboard → Check redirect to login
- [ ] Log out → Try accessing income page → Check redirect to login
- [ ] Log in → Check all pages accessible

### SQL Injection
- [ ] Try entering `'; DROP TABLE income; --` in description → Check it's safe
- [ ] Try entering `<script>alert('XSS')</script>` → Check it's escaped

---

## 10. Browser Compatibility

### Chrome
- [ ] Test all functionality in Chrome
- [ ] Check layout is correct
- [ ] Check all buttons work

### Safari
- [ ] Test all functionality in Safari
- [ ] Check layout is correct
- [ ] Check all buttons work

### Firefox
- [ ] Test all functionality in Firefox
- [ ] Check layout is correct
- [ ] Check all buttons work

### Mobile (Optional)
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Check responsive layout

---

## 11. Final Smoke Test

### Happy Path
1. [ ] Sign up new user
2. [ ] Add 3 income entries
3. [ ] Add 3 expense entries
4. [ ] Add 1 asset
5. [ ] Add 1 liability
6. [ ] Check Dashboard shows correct totals
7. [ ] Check Income page shows 3 entries
8. [ ] Check Expenses page shows 3 entries
9. [ ] Check Balance Sheet shows correct net worth
10. [ ] Export income to CSV
11. [ ] Export expenses to CSV
12. [ ] Edit an income entry
13. [ ] Delete an expense entry
14. [ ] Check all totals update correctly
15. [ ] Log out and log back in
16. [ ] Check all data persists

---

## ✅ Sign-Off

**Tested By:** ___________________  
**Date:** ___________________  
**Result:** ☐ PASS  ☐ FAIL  
**Notes:** ___________________

---

**If all checkboxes are checked, backend is verified and ready for production!** 🎉

