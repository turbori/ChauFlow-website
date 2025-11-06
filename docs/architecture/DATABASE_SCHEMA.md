# ChauFlow Database Schema Reference

Quick reference for the ChauFlow database structure.

---

## Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `waitlist` | Pre-launch email signups | User contact info |
| `income` | User income/trip entries | Earnings, trips, hours, miles |
| `expenses` | User expense entries | Spending, categories, receipts |

---

## `income` Table

**Purpose:** Track all user income and trip details

### Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes (auto) | Primary key |
| `user_id` | UUID | Yes | Foreign key to auth.users |
| `amount` | DECIMAL(10,2) | Yes | Income amount (must be ≥ 0) |
| `source` | TEXT | Yes | Income source (see options below) |
| `description` | TEXT | No | Optional notes |
| `date` | DATE | Yes | Date of income (defaults to today) |
| `trip_count` | INTEGER | No | Number of trips |
| `hours_worked` | DECIMAL(5,2) | No | Hours worked |
| `miles_driven` | DECIMAL(8,2) | No | Miles driven |
| `created_at` | TIMESTAMP | Yes (auto) | Record creation time |
| `updated_at` | TIMESTAMP | Yes (auto) | Last update time |

### Valid `source` Values

- `Rideshare Trip` 🚗
- `Black Car Service` 🚙
- `Private Client` 👤
- `Delivery` 📦
- `Other` 📋

### Example Row

```sql
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "user-uuid-here",
  "amount": 45.00,
  "source": "Rideshare Trip",
  "description": "Evening shift downtown",
  "date": "2025-11-05",
  "trip_count": 1,
  "hours_worked": 1.5,
  "miles_driven": 12.3,
  "created_at": "2025-11-05T14:30:00Z",
  "updated_at": "2025-11-05T14:30:00Z"
}
```

### Indexes

- `idx_income_user_id` - Fast user lookups
- `idx_income_date` - Date range queries
- `idx_income_created_at` - Recent activity
- `idx_income_source` - Filter by source

### RLS Policies

- **SELECT**: Users can only view their own income
- **INSERT**: Users can only insert income for themselves
- **UPDATE**: Users can only update their own income
- **DELETE**: Users can only delete their own income

---

## `expenses` Table

**Purpose:** Track all user expenses with categories

### Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes (auto) | Primary key |
| `user_id` | UUID | Yes | Foreign key to auth.users |
| `amount` | DECIMAL(10,2) | Yes | Expense amount (must be ≥ 0) |
| `category` | TEXT | Yes | Expense category (see options below) |
| `vendor` | TEXT | No | Vendor/merchant name |
| `description` | TEXT | No | Optional notes |
| `date` | DATE | Yes | Date of expense (defaults to today) |
| `receipt_url` | TEXT | No | Link to receipt image (future use) |
| `has_receipt` | BOOLEAN | Yes (auto) | Whether receipt exists |
| `created_at` | TIMESTAMP | Yes (auto) | Record creation time |
| `updated_at` | TIMESTAMP | Yes (auto) | Last update time |

### Valid `category` Values

- `Gas` ⛽
- `Tolls` 🚗
- `Parking` 🅿️
- `Car Wash` 💧
- `Maintenance & Repairs` 🔧
- `Insurance` 🛡️
- `Car Payment` 💳
- `Phone Bill` 📱
- `Supplies` 📦
- `Other` 📋

### Example Row

```sql
{
  "id": "223e4567-e89b-12d3-a456-426614174001",
  "user_id": "user-uuid-here",
  "amount": 52.00,
  "category": "Gas",
  "vendor": "Shell",
  "description": "Fill up before evening shift",
  "date": "2025-11-05",
  "receipt_url": null,
  "has_receipt": false,
  "created_at": "2025-11-05T10:15:00Z",
  "updated_at": "2025-11-05T10:15:00Z"
}
```

### Indexes

- `idx_expenses_user_id` - Fast user lookups
- `idx_expenses_date` - Date range queries
- `idx_expenses_created_at` - Recent activity
- `idx_expenses_category` - Filter by category

### RLS Policies

- **SELECT**: Users can only view their own expenses
- **INSERT**: Users can only insert expenses for themselves
- **UPDATE**: Users can only update their own expenses
- **DELETE**: Users can only delete their own expenses

---

## `waitlist` Table

**Purpose:** Store pre-launch email signups

### Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes (auto) | Primary key |
| `full_name` | TEXT | Yes | User's full name |
| `email` | TEXT | Yes | Email address (unique) |
| `user_type` | TEXT | Yes | User category |
| `company_name` | TEXT | No | Company (for fleet owners) |
| `source` | TEXT | No | How they heard about us |
| `joined_at` | TIMESTAMP | Yes (auto) | Signup timestamp |
| `user_id` | UUID | No | Link to auth.users (when they sign up) |
| `has_access` | BOOLEAN | Yes (default false) | Whether granted early access |
| `created_at` | TIMESTAMP | Yes (auto) | Record creation |

### Valid `user_type` Values

- `Independent Driver`
- `Fleet Owner`
- `Accountant / Tax Pro`
- `Other`

---

## Helper Views

### `monthly_income_summary`

Aggregates income by month per user

```sql
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS month,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_income,
    SUM(trip_count) AS total_trips,
    SUM(hours_worked) AS total_hours,
    SUM(miles_driven) AS total_miles,
    AVG(amount) AS avg_income_per_entry
FROM income
GROUP BY user_id, DATE_TRUNC('month', date);
```

### `monthly_expense_summary`

Aggregates expenses by month per user

```sql
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS month,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_expenses,
    COUNT(DISTINCT category) AS unique_categories
FROM expenses
GROUP BY user_id, DATE_TRUNC('month', date);
```

### `expense_by_category`

Breaks down expenses by category per user

```sql
SELECT 
    user_id,
    category,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM expenses
GROUP BY user_id, category;
```

---

## Common Queries

### Get user's current month income total

```sql
SELECT SUM(amount) as total
FROM income
WHERE user_id = 'YOUR_USER_ID'
  AND date >= DATE_TRUNC('month', CURRENT_DATE)
  AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
```

### Get user's current month expenses by category

```sql
SELECT category, SUM(amount) as total
FROM expenses
WHERE user_id = 'YOUR_USER_ID'
  AND date >= DATE_TRUNC('month', CURRENT_DATE)
  AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY category
ORDER BY total DESC;
```

### Get recent activity (last 10 transactions)

```sql
SELECT 'income' as type, amount, source as title, created_at
FROM income
WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'expense' as type, amount, category as title, created_at
FROM expenses
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

### Calculate net profit for current month

```sql
SELECT 
  (SELECT COALESCE(SUM(amount), 0) FROM income 
   WHERE user_id = 'YOUR_USER_ID' 
   AND date >= DATE_TRUNC('month', CURRENT_DATE)) -
  (SELECT COALESCE(SUM(amount), 0) FROM expenses 
   WHERE user_id = 'YOUR_USER_ID' 
   AND date >= DATE_TRUNC('month', CURRENT_DATE)) 
AS net_profit;
```

---

## Database Functions

### `update_updated_at_column()`

Automatically updates the `updated_at` timestamp on any UPDATE

**Trigger**: Applied to both `income` and `expenses` tables

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### `check_waitlist_email_exists(email TEXT)`

Check if an email already exists in waitlist

**Usage:**
```sql
SELECT check_waitlist_email_exists('test@example.com');
-- Returns: true or false
```

---

## Constraints & Validation

### Amount Validation
- All amounts must be ≥ 0 (CHECK constraint)
- Stored as DECIMAL(10,2) for precision

### Date Validation
- Dates default to CURRENT_DATE
- Must be valid DATE format

### Enum Validation
- `income.source` - Must be one of valid sources
- `expenses.category` - Must be one of valid categories
- `waitlist.user_type` - Must be one of valid types

### Unique Constraints
- `waitlist.email` - Must be unique

### Foreign Key Constraints
- `income.user_id` → `auth.users.id` (CASCADE DELETE)
- `expenses.user_id` → `auth.users.id` (CASCADE DELETE)
- `waitlist.user_id` → `auth.users.id` (CASCADE DELETE)

---

## Security (RLS)

All tables have **Row Level Security (RLS)** enabled.

### Policy Pattern

```sql
-- Users can only access their own data
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Anonymous Access

- **Waitlist**: Anonymous users can INSERT (for signups)
- **Income/Expenses**: Requires authentication

---

## Performance Considerations

### Indexes
- All tables indexed on `user_id` for fast user-specific queries
- Date columns indexed for range queries
- Created_at indexed for recent activity

### Views
- Pre-aggregated data for faster dashboard loading
- Use views for complex reports instead of joining tables

### Query Optimization
- Always filter by `user_id` first (indexed)
- Use date ranges for month/year queries
- Limit results for recent activity

---

## Backup & Maintenance

### Recommended Practices

1. **Regular Backups**: Supabase handles automatic backups
2. **Data Retention**: Keep all historical data for tax purposes
3. **Archiving**: Consider archiving data older than 7 years
4. **Audit Logs**: Track changes to sensitive fields (future enhancement)

---

## Migration & Versioning

Current schema version: **v1.0.0**

### Version History

- **v1.0.0** (2025-11-05) - Initial schema with income, expenses, waitlist

### Future Migrations

When making schema changes:
1. Create new migration file
2. Test on development database
3. Backup production before applying
4. Run migration with rollback plan
5. Update this document

---

**Last Updated:** November 5, 2025  
**Schema Version:** 1.0.0

