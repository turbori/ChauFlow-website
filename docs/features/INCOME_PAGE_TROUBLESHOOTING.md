# Income Page Error - Troubleshooting Guide

## Error: "Error loading income data. Please refresh the page."

This error appears when the Income page cannot fetch data from Supabase. Here's how to fix it:

---

## 🔍 Step 1: Check Browser Console

1. **Open Developer Tools**
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12`
   - Safari: Enable Developer Menu first, then press `Cmd+Option+I`

2. **Go to Console Tab**
   - Look for red error messages
   - Check for messages starting with "Error loading income data:"

3. **Common Error Messages**

   **Error: "relation 'public.income' does not exist"**
   - ❌ Problem: Income table not created in database
   - ✅ Solution: Run the SQL setup script (see Step 2)

   **Error: "permission denied for table income"**
   - ❌ Problem: RLS policies not set up correctly
   - ✅ Solution: Run the SQL setup script (see Step 2)

   **Error: "JWT expired" or "Invalid JWT"**
   - ❌ Problem: Session expired or authentication issue
   - ✅ Solution: Sign out and sign back in

   **Error: "Failed to fetch"**
   - ❌ Problem: Network connection or Supabase URL issue
   - ✅ Solution: Check internet connection and Supabase config

---

## 🛠️ Step 2: Run SQL Setup Script

The most common cause is that the database tables haven't been created yet.

### How to Create the Income Table

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `bvrdimwnarfobmwvthyb`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run This SQL**

```sql
-- Drop existing table if needed (WARNING: This deletes all data!)
DROP TABLE IF EXISTS public.income CASCADE;

-- Create income table
CREATE TABLE IF NOT EXISTS public.income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    source TEXT NOT NULL CHECK (source IN ('Rideshare Trip', 'Black Car Service', 'Private Client', 'Delivery', 'Other')),
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    trip_count INTEGER CHECK (trip_count >= 0),
    hours_worked DECIMAL(5, 2) CHECK (hours_worked >= 0),
    miles_driven DECIMAL(8, 2) CHECK (miles_driven >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_income_user_id ON public.income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON public.income(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_created_at ON public.income(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own income" ON public.income;
DROP POLICY IF EXISTS "Users can insert their own income" ON public.income;
DROP POLICY IF EXISTS "Users can update their own income" ON public.income;
DROP POLICY IF EXISTS "Users can delete their own income" ON public.income;

-- Create RLS policies
CREATE POLICY "Users can view their own income"
    ON public.income FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income"
    ON public.income FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income"
    ON public.income FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income"
    ON public.income FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_income_updated_at ON public.income;

CREATE TRIGGER update_income_updated_at
    BEFORE UPDATE ON public.income
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "Run"** (or press `Ctrl+Enter`)

5. **Check for Success**
   - Should see: "Success. No rows returned"
   - If you see errors, read them carefully and fix any issues

---

## ✅ Step 3: Verify Table Creation

1. **Go to Table Editor**
   - Click "Table Editor" in left sidebar
   - Look for "income" table in the list

2. **Check Table Structure**
   - Click on "income" table
   - Should see columns: id, user_id, amount, source, description, date, trip_count, hours_worked, miles_driven, created_at, updated_at

3. **Check RLS Policies**
   - Click the shield icon next to table name
   - Should see 4 policies: SELECT, INSERT, UPDATE, DELETE
   - All should be enabled

---

## 🔐 Step 4: Verify Authentication

1. **Check if you're logged in**
   - Open browser console
   - Type: `await supabase.auth.getSession()`
   - Should see session object with user info

2. **If no session:**
   - Sign out completely
   - Clear browser cache/cookies
   - Sign back in
   - Try income page again

---

## 🌐 Step 5: Verify Supabase Configuration

Check that `income.html` has the correct Supabase URL:

1. **Open income.html in code editor**

2. **Find this section** (around line 402):
```javascript
const SUPABASE_URL = 'https://bvrdimwnarfobmwvthyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

3. **Verify it matches your dashboard and login pages**
   - Should be: `bvrdimwnarfobmwvthyb.supabase.co`
   - NOT: `vfxhfpvqfvkbcqhqrjjn.supabase.co` (old/wrong)

---

## 🧪 Step 6: Test with Sample Data

Once the table is created, add a test entry:

1. **Go to Table Editor in Supabase**
2. **Click "Insert row" on income table**
3. **Fill in:**
   - user_id: (copy your user ID from auth.users table)
   - amount: 50.00
   - source: Rideshare Trip
   - date: (today's date)
   - trip_count: 1

4. **Save and refresh income page**
   - Should now see the test entry!

---

## 📊 Step 7: Check Network Tab

If still having issues:

1. **Open Developer Tools → Network Tab**
2. **Refresh the income page**
3. **Look for requests to Supabase**
   - Should see POST request to `/rest/v1/income`
   - Click on it to see details

4. **Check Response**
   - Status 200 = Success
   - Status 401 = Authentication issue
   - Status 403 = Permission/RLS issue
   - Status 404 = Table doesn't exist

---

## 🔄 Quick Fix Checklist

Try these in order:

- [ ] Run the SQL setup script above
- [ ] Verify income table exists in Supabase Table Editor
- [ ] Check RLS policies are enabled
- [ ] Sign out and sign back in
- [ ] Clear browser cache
- [ ] Check browser console for specific error
- [ ] Verify Supabase URL matches other pages
- [ ] Check internet connection
- [ ] Try in incognito/private browsing mode

---

## 💡 Common Solutions

### Solution 1: Fresh Database Setup
```sql
-- Run this to start fresh
DROP TABLE IF EXISTS public.income CASCADE;
-- Then run the full CREATE TABLE script above
```

### Solution 2: Reset RLS Policies
```sql
-- Disable and re-enable RLS
ALTER TABLE public.income DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
-- Then recreate policies (see full script above)
```

### Solution 3: Check User ID
```sql
-- Verify your user ID
SELECT id, email FROM auth.users WHERE email = 'your@email.com';
-- Use this ID when testing
```

---

## 🆘 Still Not Working?

If you've tried everything above and still see the error:

1. **Check the exact error message in console**
   - Copy the full error
   - Look for specific error codes

2. **Verify Supabase project is active**
   - Go to Supabase dashboard
   - Check project status
   - Ensure it's not paused

3. **Test with curl** (advanced):
```bash
curl -X GET 'https://bvrdimwnarfobmwvthyb.supabase.co/rest/v1/income' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Contact Support**
   - Provide: Error message, browser console logs, network tab screenshot
   - Check Supabase status page: https://status.supabase.com/

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Income page loads without errors
- ✅ Summary cards show $0.00 (if no data) or actual amounts
- ✅ Table shows "No income entries found" or your data
- ✅ "Add Income" button works
- ✅ New entries appear immediately after adding

---

**Last Updated**: November 5, 2025  
**Most Common Fix**: Run the SQL setup script to create the income table

