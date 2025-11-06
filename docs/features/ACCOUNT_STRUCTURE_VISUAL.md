# ChauFlow Chart of Accounts - Visual Structure

## Complete Account Hierarchy

```
ChauFlow Chart of Accounts
│
├── 📊 INCOME (4000 Series)
│   │
│   ├── 4000 - Rideshare Income
│   │   └── Uber, Lyft, other rideshare platforms
│   │
│   ├── 4010 - Private Client Income
│   │   └── Direct bookings from private clients
│   │
│   ├── 4020 - Airport Transfers
│   │   └── Airport pickup/drop-off services
│   │
│   ├── 4030 - Corporate Accounts
│   │   └── Corporate contracts and business accounts
│   │
│   ├── 4040 - Hourly Hires
│   │   └── Hourly chauffeur services
│   │
│   ├── 4050 - Affiliate / Referral Income
│   │   └── Referral bonuses and affiliate programs
│   │
│   ├── 4060 - Tips Received
│   │   └── Tips and gratuities from passengers
│   │
│   ├── 4070 - Reimbursements
│   │   └── Client reimbursements for expenses
│   │
│   └── 4090 - Other Income
│       └── Miscellaneous income
│
├── 🚗 VEHICLE-RELATED EXPENSES (5000 Series)
│   │
│   ├── 5000 - Fuel / Gas ✓
│   │   └── Gasoline for business use
│   │
│   ├── 5010 - Tolls ✓
│   │   └── Highway tolls and bridge fees
│   │
│   ├── 5020 - Parking Fees ✓
│   │   └── Parking and garage charges
│   │
│   ├── 5030 - Car Wash / Cleaning ✓
│   │   └── Vehicle washing and cleaning
│   │
│   ├── 5040 - Maintenance & Repairs ✓
│   │   └── Repairs, parts, oil changes
│   │
│   ├── 5050 - Insurance ✓
│   │   └── Vehicle insurance premiums
│   │
│   ├── 5060 - Lease / Loan Payments ✗
│   │   └── Principal portion not deductible
│   │
│   ├── 5070 - Registration & DMV Fees ✓
│   │   └── Tags, registration, DMV fees
│   │
│   └── 5080 - Vehicle Depreciation ✓
│       └── Depreciation for owned vehicles
│
├── 💼 OPERATIONS EXPENSES (6000 Series)
│   │
│   ├── 6000 - Mobile Phone / Internet ✓
│   │   └── Phone and internet for business
│   │
│   ├── 6010 - Business Software / Apps ✓
│   │   └── Software subscriptions (ChauFlow, etc.)
│   │
│   ├── 6020 - Marketing & Ads ✓
│   │   └── Advertising and marketing costs
│   │
│   ├── 6030 - Accounting / Tax Prep ✓
│   │   └── Accounting and tax preparation
│   │
│   ├── 6040 - Supplies & Office ✓
│   │   └── Office supplies and materials
│   │
│   ├── 6050 - Bank Fees ✓
│   │   └── Bank fees and transaction charges
│   │
│   ├── 6060 - Meals (Client-related) ⚠
│   │   └── Business meals (50% deductible)
│   │
│   └── 6070 - Training / Licensing ✓
│       └── Training courses and licensing
│
└── 🔧 ADVANCED EXPENSES (7000 Series)
    │
    ├── 7000 - Owner Draws / Distributions ✗
    │   └── Personal withdrawals (not deductible)
    │
    ├── 7010 - Business Gifts ⚠
    │   └── Client gifts (limited deduction)
    │
    ├── 7020 - Legal & Professional Fees ✓
    │   └── Legal and professional services
    │
    ├── 7030 - Storage Fees ✓
    │   └── Storage unit or garage rental
    │
    └── 7040 - Utilities (Home Office) ⚠
        └── Home office utilities (prorated)
```

---

## Tax Deductibility Legend

| Symbol | Meaning | Tax Treatment |
|--------|---------|---------------|
| ✓ | Fully Deductible | 100% tax deductible |
| ⚠ | Partially Deductible | Special rules apply (50%, limited, prorated) |
| ✗ | Not Deductible | Cannot be deducted |

---

## Account Distribution

### By Type
```
INCOME:    9 accounts (27%)
EXPENSES: 24 accounts (73%)
───────────────────────
TOTAL:    33 accounts
```

### By Deductibility (Expenses Only)
```
Fully Deductible:     19 accounts (79%)
Partially Deductible:  4 accounts (17%)
Not Deductible:        2 accounts (8%)
                      ─────────────────
Total Expenses:       24 accounts
```

### By Category Group
```
Income:           9 accounts
Vehicle-Related:  9 accounts
Operations:       8 accounts
Advanced:         5 accounts
```

---

## Common Use Cases

### For Rideshare Drivers (Uber/Lyft)

**Most Used Income Accounts:**
- 4000 - Rideshare Income (primary)
- 4060 - Tips Received
- 4050 - Affiliate / Referral Income

**Most Used Expense Accounts:**
- 5000 - Fuel / Gas
- 5010 - Tolls
- 5030 - Car Wash / Cleaning
- 5040 - Maintenance & Repairs
- 6000 - Mobile Phone / Internet

### For Private Chauffeurs

**Most Used Income Accounts:**
- 4010 - Private Client Income (primary)
- 4020 - Airport Transfers
- 4040 - Hourly Hires
- 4060 - Tips Received

**Most Used Expense Accounts:**
- 5000 - Fuel / Gas
- 5010 - Tolls
- 5020 - Parking Fees
- 5030 - Car Wash / Cleaning
- 6060 - Meals (Client-related)

### For Fleet Owners

**Most Used Income Accounts:**
- 4030 - Corporate Accounts
- 4010 - Private Client Income
- 4020 - Airport Transfers

**Most Used Expense Accounts:**
- 5050 - Insurance
- 5040 - Maintenance & Repairs
- 5060 - Lease / Loan Payments
- 6030 - Accounting / Tax Prep
- 7020 - Legal & Professional Fees

---

## Expense Category Breakdown

### Vehicle-Related (37.5% of expenses)
Most common category for drivers. Includes all direct vehicle costs.

**Fully Deductible (7):**
- Fuel / Gas
- Tolls
- Parking Fees
- Car Wash / Cleaning
- Maintenance & Repairs
- Insurance
- Registration & DMV Fees
- Vehicle Depreciation

**Not Deductible (1):**
- Lease / Loan Payments (principal)

---

### Operations (33.3% of expenses)
Business operating costs not directly related to the vehicle.

**Fully Deductible (7):**
- Mobile Phone / Internet
- Business Software / Apps
- Marketing & Ads
- Accounting / Tax Prep
- Supplies & Office
- Bank Fees
- Training / Licensing

**Partially Deductible (1):**
- Meals (Client-related) - 50% deductible

---

### Advanced (20.8% of expenses)
Less common expenses, often for established businesses.

**Fully Deductible (2):**
- Legal & Professional Fees
- Storage Fees

**Partially Deductible (2):**
- Business Gifts - limited to $25 per person per year
- Utilities (Home Office) - prorated based on business use %

**Not Deductible (1):**
- Owner Draws / Distributions

---

## Tax Planning Tips

### Maximize Deductions

**Track Everything:**
- Keep receipts for all deductible expenses
- Log mileage for business trips
- Document business purpose of meals and gifts

**Separate Business & Personal:**
- Use dedicated business bank account
- Get a business credit card
- Keep personal expenses separate

**Understand Partial Deductions:**
- Meals: Only 50% deductible
- Business Gifts: Max $25 per person per year
- Home Office: Must calculate business use percentage

### Common Mistakes to Avoid

❌ **Don't deduct:**
- Personal meals
- Commuting to first pickup
- Personal vehicle use
- Principal portion of loans

✅ **Do deduct:**
- All business mileage
- Tolls during business trips
- Phone bill (business portion)
- Software subscriptions for business

---

## Account Code Patterns

### Numbering System

```
4000-4999: Income
  4000-4099: All income types

5000-5999: Vehicle Expenses
  5000-5099: Direct vehicle costs

6000-6999: Business Operations
  6000-6099: Operating expenses

7000-7999: Advanced/Special
  7000-7099: Specialized expenses
```

### Code Increments

- **x000**: Primary category (e.g., 4000 = main rideshare income)
- **x010**: Secondary category (e.g., 4010 = private clients)
- **x020**: Tertiary category (e.g., 4020 = airport transfers)
- **x090**: Catch-all "Other" (e.g., 4090 = other income)

---

## Database Schema Quick Reference

```sql
chart_of_accounts
├── id (UUID, Primary Key)
├── account_code (TEXT, Unique) -- e.g., "5000"
├── name (TEXT) -- e.g., "Fuel / Gas"
├── type (TEXT) -- "income" or "expense"
├── category_group (TEXT) -- e.g., "Vehicle-Related"
├── is_deductible (TEXT) -- "true", "false", or "partial"
├── is_default (BOOLEAN) -- System vs user-created
├── is_active (BOOLEAN) -- Active vs archived
├── description (TEXT) -- Helpful explanation
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## Integration Points

### 1. Income Form
```javascript
// Load income accounts (4000 series)
SELECT * FROM chart_of_accounts
WHERE type = 'income' AND is_active = true
ORDER BY account_code;
```

### 2. Expense Form
```javascript
// Load expense accounts grouped (5000-7000 series)
SELECT * FROM chart_of_accounts
WHERE type = 'expense' AND is_active = true
ORDER BY category_group, account_code;
```

### 3. Dashboard Summary
```javascript
// Get totals by category group
SELECT 
    coa.category_group,
    SUM(e.amount) as total
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
GROUP BY coa.category_group;
```

### 4. Tax Reports
```javascript
// Get deductible vs non-deductible
SELECT 
    coa.is_deductible,
    SUM(e.amount) as total
FROM expenses e
JOIN chart_of_accounts coa ON e.account_id = coa.id
WHERE e.user_id = $1
GROUP BY coa.is_deductible;
```

---

## Future Expansion

### Custom Accounts (User-Created)

Users can add their own categories:
```
8000-8999: Custom Income
9000-9999: Custom Expenses
```

Example:
```sql
INSERT INTO chart_of_accounts (
    account_code, name, type, category_group,
    is_deductible, is_default
) VALUES (
    '9001', 'Custom Category', 'expense', 'Operations',
    'true', false
);
```

### Subcategories

Future enhancement to add subcategories:
```
5000 - Fuel / Gas
  5001 - Regular Gas
  5002 - Premium Gas
  5003 - Diesel
```

---

## Visual Hierarchy

```
Level 1: Type (Income vs Expense)
    │
    ├── Level 2: Category Group (Vehicle, Operations, etc.)
    │       │
    │       └── Level 3: Individual Account (Fuel, Tolls, etc.)
    │               │
    │               └── Level 4: Description & Rules
```

---

**Quick Reference**: Save this file for easy lookup of account codes and categories!

**Status**: ✅ Complete  
**Accounts**: 33 total  
**Last Updated**: November 6, 2025

