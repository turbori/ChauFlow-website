-- ============================================
-- ChauFlow Waitlist Table Setup
-- ============================================
-- Run this in Supabase SQL Editor: https://bvrdimwnarfobmwvthyb.supabase.co/project/_/sql

-- Drop table if exists (for clean re-runs during development)
-- This will reset the waitlist table with the correct schema
DROP TABLE IF EXISTS public.waitlist CASCADE;

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('Independent Driver', 'Fleet Owner', 'Accountant / Tax Pro', 'Other')),
    company_name TEXT,
    source TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    has_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_email UNIQUE (email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON public.waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_has_access ON public.waitlist(has_access);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on the waitlist table
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean re-runs)
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Anonymous users can insert waitlist entries" ON public.waitlist;

-- Policy 1: Allow INSERT only if auth.uid() matches user_id
-- This allows authenticated users to add themselves to the waitlist
CREATE POLICY "Users can insert their own waitlist entry"
ON public.waitlist
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow anonymous INSERT (for users who sign up before creating account)
-- This is optional but useful for waitlist signups before authentication
CREATE POLICY "Anonymous users can insert waitlist entries"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Policy 3: Allow SELECT only for own row
-- Users can only view their own waitlist entry
CREATE POLICY "Users can view their own waitlist entry"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: No UPDATE or DELETE policies = users cannot update or delete their entries

-- ============================================
-- Helper Function (Optional)
-- ============================================
-- Function to check if email already exists in waitlist
CREATE OR REPLACE FUNCTION public.check_waitlist_email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.waitlist WHERE email = check_email
    );
END;
$$;

-- ============================================
-- Grant Permissions
-- ============================================
-- Grant necessary permissions to authenticated and anonymous users
GRANT SELECT, INSERT ON public.waitlist TO authenticated;
GRANT INSERT ON public.waitlist TO anon;

-- Grant usage on the sequence (for ID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify your setup

-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'waitlist'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'waitlist';

-- ============================================
-- Sample Test Data (Optional - for testing)
-- ============================================
-- Uncomment to insert test data

-- INSERT INTO public.waitlist (full_name, email, user_type, source)
-- VALUES 
--     ('John Doe', 'john@example.com', 'Independent Driver', 'landing_page'),
--     ('Jane Smith', 'jane@example.com', 'Fleet Owner', 'google_ads'),
--     ('Bob Johnson', 'bob@example.com', 'Accountant / Tax Pro', 'referral');

-- ============================================
-- DONE!
-- ============================================
-- Your waitlist table is now ready to use!
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify the table was created: Check Tables in Supabase UI
-- 3. Test inserting a row manually
-- 4. Implement the frontend form to save data

-- ============================================
-- ChauFlow Income & Expenses Tables
-- ============================================
-- Phase 1: Core Data Management for MVP Dashboard

-- ============================================
-- Income Table
-- ============================================
-- Drop table if exists (for clean re-runs during development)
DROP TABLE IF EXISTS public.income CASCADE;

CREATE TABLE IF NOT EXISTS public.income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Income details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    source TEXT NOT NULL CHECK (source IN (
        'Rideshare App Income',
        'Black Car Jobs',
        'Direct Client Income',
        'Airport Transfers',
        'Hourly Charters',
        'Long-Distance Trips',
        'Cash Tips',
        'Digital Tips',
        'Referral Bonuses',
        'Platform Bonuses',
        'Wait Time Charges',
        'Additional Stop Fees',
        'Toll Reimbursements',
        'Cancellation Fees',
        'Event Package Income',
        'Vehicle Rental Income',
        'Vehicle Advertising',
        'Other Income'
    )),
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Optional trip details
    trip_count INTEGER CHECK (trip_count >= 0),
    hours_worked DECIMAL(5, 2) CHECK (hours_worked >= 0),
    miles_driven DECIMAL(8, 2) CHECK (miles_driven >= 0),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_income_user_id ON public.income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON public.income(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_created_at ON public.income(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_income_source ON public.income(source);

-- ============================================
-- Expenses Table
-- ============================================
-- Drop table if exists (for clean re-runs during development)
DROP TABLE IF EXISTS public.expenses CASCADE;

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Expense details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL CHECK (category IN (
        'Gas',
        'Tolls',
        'Parking',
        'Car Wash',
        'Maintenance & Repairs',
        'Insurance',
        'Car Payment',
        'Phone Bill',
        'Supplies',
        'Meals',
        'Other'
    )),
    vendor TEXT,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Receipt info
    receipt_url TEXT,
    has_receipt BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- ============================================
-- Row Level Security (RLS) Policies - Income
-- ============================================

-- Enable RLS on the income table
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean re-runs)
DROP POLICY IF EXISTS "Users can view their own income" ON public.income;
DROP POLICY IF EXISTS "Users can insert their own income" ON public.income;
DROP POLICY IF EXISTS "Users can update their own income" ON public.income;
DROP POLICY IF EXISTS "Users can delete their own income" ON public.income;

-- Policy 1: SELECT - Users can only view their own income
CREATE POLICY "Users can view their own income"
ON public.income
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: INSERT - Users can only insert their own income
CREATE POLICY "Users can insert their own income"
ON public.income
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE - Users can only update their own income
CREATE POLICY "Users can update their own income"
ON public.income
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: DELETE - Users can only delete their own income
CREATE POLICY "Users can delete their own income"
ON public.income
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- Row Level Security (RLS) Policies - Expenses
-- ============================================

-- Enable RLS on the expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean re-runs)
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

-- Policy 1: SELECT - Users can only view their own expenses
CREATE POLICY "Users can view their own expenses"
ON public.expenses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: INSERT - Users can only insert their own expenses
CREATE POLICY "Users can insert their own expenses"
ON public.expenses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE - Users can only update their own expenses
CREATE POLICY "Users can update their own expenses"
ON public.expenses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: DELETE - Users can only delete their own expenses
CREATE POLICY "Users can delete their own expenses"
ON public.expenses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- Grant Permissions
-- ============================================
-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.income TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- Utility Functions
-- ============================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_income_updated_at ON public.income;
CREATE TRIGGER update_income_updated_at
    BEFORE UPDATE ON public.income
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Helper Views for Dashboard
-- ============================================

-- Monthly income summary view
CREATE OR REPLACE VIEW public.monthly_income_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS month,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_income,
    SUM(trip_count) AS total_trips,
    SUM(hours_worked) AS total_hours,
    SUM(miles_driven) AS total_miles,
    AVG(amount) AS avg_income_per_entry
FROM public.income
GROUP BY user_id, DATE_TRUNC('month', date);

-- Monthly expense summary view
CREATE OR REPLACE VIEW public.monthly_expense_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS month,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_expenses,
    COUNT(DISTINCT category) AS unique_categories
FROM public.expenses
GROUP BY user_id, DATE_TRUNC('month', date);

-- Expense by category view
CREATE OR REPLACE VIEW public.expense_by_category AS
SELECT 
    user_id,
    category,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM public.expenses
GROUP BY user_id, category;

-- Grant access to views
GRANT SELECT ON public.monthly_income_summary TO authenticated;
GRANT SELECT ON public.monthly_expense_summary TO authenticated;
GRANT SELECT ON public.expense_by_category TO authenticated;

-- ============================================
-- Sample Test Data (Optional - for testing)
-- ============================================
-- Uncomment to insert test data
-- Replace 'YOUR_USER_ID' with an actual user ID from auth.users

-- INSERT INTO public.income (user_id, amount, source, description, date, trip_count, hours_worked, miles_driven)
-- VALUES 
--     ('YOUR_USER_ID', 45.00, 'Rideshare Trip', 'Evening shift', CURRENT_DATE, 1, 1.5, 12.3),
--     ('YOUR_USER_ID', 120.00, 'Private Client', 'Airport run', CURRENT_DATE - INTERVAL '1 day', 1, 2.0, 45.2),
--     ('YOUR_USER_ID', 85.00, 'Black Car Service', 'Corporate client', CURRENT_DATE - INTERVAL '2 days', 1, 1.8, 28.5);

-- INSERT INTO public.expenses (user_id, amount, category, vendor, description, date)
-- VALUES 
--     ('YOUR_USER_ID', 52.00, 'Gas', 'Shell', 'Fill up', CURRENT_DATE),
--     ('YOUR_USER_ID', 16.00, 'Tolls', 'EZPass', 'GWB toll', CURRENT_DATE - INTERVAL '1 day'),
--     ('YOUR_USER_ID', 15.00, 'Car Wash', 'Quick Wash', 'Full service', CURRENT_DATE - INTERVAL '3 days');

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify your setup

-- Check income table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'income' 
-- ORDER BY ordinal_position;

-- Check expenses table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'expenses' 
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('income', 'expenses');

-- ============================================
-- CHART OF ACCOUNTS (COA) SYSTEM
-- ============================================
-- Purpose: Structured categorization for income and expenses
-- Helps with tax preparation, reporting, and business analysis

-- Drop existing table if needed
DROP TABLE IF EXISTS public.chart_of_accounts CASCADE;

-- Create chart_of_accounts table
CREATE TABLE public.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category_group TEXT NOT NULL,
    is_deductible TEXT NOT NULL CHECK (is_deductible IN ('true', 'false', 'partial')),
    is_default BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_coa_type ON public.chart_of_accounts(type);
CREATE INDEX idx_coa_category_group ON public.chart_of_accounts(category_group);
CREATE INDEX idx_coa_is_default ON public.chart_of_accounts(is_default);
CREATE INDEX idx_coa_is_active ON public.chart_of_accounts(is_active);
CREATE INDEX idx_coa_account_code ON public.chart_of_accounts(account_code);

-- Enable Row Level Security
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read chart of accounts (it's reference data)
CREATE POLICY "Anyone can view chart of accounts"
    ON public.chart_of_accounts FOR SELECT
    USING (true);

-- RLS Policy: Only authenticated users can create custom accounts (future feature)
CREATE POLICY "Authenticated users can create custom accounts"
    ON public.chart_of_accounts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND is_default = false);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_coa_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coa_updated_at
    BEFORE UPDATE ON public.chart_of_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_coa_updated_at_column();

-- ============================================
-- SEED DATA: DEFAULT CHART OF ACCOUNTS
-- ============================================

-- INCOME ACCOUNTS (4000 series)
-- Primary Driving Income
INSERT INTO public.chart_of_accounts (account_code, name, type, category_group, is_deductible, is_default, description) VALUES
('4000', 'Rideshare App Income', 'income', 'Primary Driving Income', 'false', true, 'Paid by platforms like Uber, Lyft, Via, Revel, etc. (1099 income)'),
('4010', 'Black Car Jobs', 'income', 'Primary Driving Income', 'false', true, 'Chauffeur jobs contracted by dispatch services, limo companies, or agencies'),
('4020', 'Direct Client Income', 'income', 'Primary Driving Income', 'false', true, 'Trips arranged directly via phone/text or personal referral (cash/Zelle)'),
('4030', 'Airport Transfers', 'income', 'Primary Driving Income', 'false', true, 'Premium pricing for JFK, LGA, EWR, and other airport runs'),
('4040', 'Hourly Charters', 'income', 'Primary Driving Income', 'false', true, 'Hourly hires for weddings, concerts, corporate clients'),
('4050', 'Long-Distance Trips', 'income', 'Primary Driving Income', 'false', true, 'Out-of-state trips (NYC to Boston, Philly, DC) with premium pricing'),

-- Tips & Bonuses
('4100', 'Cash Tips', 'income', 'Tips & Bonuses', 'false', true, 'Cash tips not automatically recorded by platforms'),
('4110', 'Digital Tips', 'income', 'Tips & Bonuses', 'false', true, 'Tips sent through apps like Uber or Lyft'),
('4120', 'Referral Bonuses', 'income', 'Tips & Bonuses', 'false', true, 'Paid by platforms for referring new drivers or completing challenges'),
('4130', 'Platform Bonuses', 'income', 'Tips & Bonuses', 'false', true, 'Weekly streaks, surge bonuses, or boost zones'),

-- Miscellaneous Income
('4200', 'Wait Time Charges', 'income', 'Miscellaneous Income', 'false', true, 'Charged for delays beyond grace period'),
('4210', 'Additional Stop Fees', 'income', 'Miscellaneous Income', 'false', true, 'Extra stops or route changes during trip'),
('4220', 'Toll Reimbursements', 'income', 'Miscellaneous Income', 'false', true, 'Clients reimburse tolls manually (separate from fare)'),
('4230', 'Cancellation Fees', 'income', 'Miscellaneous Income', 'false', true, 'Driver keeps part of fare if client cancels late'),
('4240', 'Event Package Income', 'income', 'Miscellaneous Income', 'false', true, 'Wedding, prom, wine tours with bundled hourly service'),

-- Optional Income
('4900', 'Vehicle Rental Income', 'income', 'Optional Income', 'false', true, 'Rent your car to other drivers'),
('4910', 'Vehicle Advertising', 'income', 'Optional Income', 'false', true, 'Run ads on your vehicle (Wrapify, Carvertise)'),
('4990', 'Other Income', 'income', 'Optional Income', 'false', true, 'Misc work like delivery driving or other business income');

-- EXPENSE ACCOUNTS - VEHICLE-RELATED (5000 series)
INSERT INTO public.chart_of_accounts (account_code, name, type, category_group, is_deductible, is_default, description) VALUES
('5000', 'Fuel / Gas', 'expense', 'Vehicle-Related', 'true', true, 'Gasoline and fuel expenses for business use'),
('5010', 'Tolls', 'expense', 'Vehicle-Related', 'true', true, 'Highway tolls and bridge fees'),
('5020', 'Parking Fees', 'expense', 'Vehicle-Related', 'true', true, 'Parking fees and garage charges'),
('5030', 'Car Wash / Cleaning', 'expense', 'Vehicle-Related', 'true', true, 'Vehicle washing and interior cleaning'),
('5040', 'Maintenance & Repairs', 'expense', 'Vehicle-Related', 'true', true, 'Vehicle maintenance, repairs, and parts'),
('5050', 'Insurance', 'expense', 'Vehicle-Related', 'true', true, 'Vehicle insurance premiums'),
('5060', 'Lease / Loan Payments', 'expense', 'Vehicle-Related', 'false', true, 'Vehicle lease or loan payments (principal portion not deductible)'),
('5070', 'Registration & DMV Fees', 'expense', 'Vehicle-Related', 'true', true, 'Vehicle registration, tags, and DMV fees'),
('5080', 'Vehicle Depreciation', 'expense', 'Vehicle-Related', 'true', true, 'Depreciation expense for owned vehicles');

-- EXPENSE ACCOUNTS - OPERATIONS / BUSINESS (6000 series)
INSERT INTO public.chart_of_accounts (account_code, name, type, category_group, is_deductible, is_default, description) VALUES
('6000', 'Mobile Phone / Internet', 'expense', 'Operations', 'true', true, 'Mobile phone and internet service for business use'),
('6010', 'Business Software / Apps', 'expense', 'Operations', 'true', true, 'Software subscriptions and app fees'),
('6020', 'Marketing & Ads', 'expense', 'Operations', 'true', true, 'Advertising and marketing expenses'),
('6030', 'Accounting / Tax Prep', 'expense', 'Operations', 'true', true, 'Accounting services and tax preparation fees'),
('6040', 'Supplies & Office', 'expense', 'Operations', 'true', true, 'Office supplies and business materials'),
('6050', 'Bank Fees', 'expense', 'Operations', 'true', true, 'Bank fees and transaction charges'),
('6060', 'Meals', 'expense', 'Operations', 'partial', true, 'Business meals are typically 50% deductible. Meals during shift or while traveling for work may qualify'),
('6070', 'Training / Licensing', 'expense', 'Operations', 'true', true, 'Professional training, courses, and licensing fees');

-- EXPENSE ACCOUNTS - ADVANCED / OPTIONAL (7000 series)
INSERT INTO public.chart_of_accounts (account_code, name, type, category_group, is_deductible, is_default, description) VALUES
('7000', 'Owner Draws / Distributions', 'expense', 'Advanced', 'false', true, 'Personal withdrawals from business (not deductible)'),
('7010', 'Business Gifts', 'expense', 'Advanced', 'partial', true, 'Gifts to clients and business associates (limited deduction)'),
('7020', 'Legal & Professional Fees', 'expense', 'Advanced', 'true', true, 'Legal services and professional consultation fees'),
('7030', 'Storage Fees', 'expense', 'Advanced', 'true', true, 'Storage unit or garage rental fees'),
('7040', 'Utilities (Home Office)', 'expense', 'Advanced', 'partial', true, 'Home office utilities (prorated deduction)');

-- ============================================
-- HELPER VIEWS FOR EASY QUERYING
-- ============================================

-- View: Income accounts only
CREATE OR REPLACE VIEW income_accounts AS
SELECT * FROM public.chart_of_accounts
WHERE type = 'income' AND is_active = true
ORDER BY account_code;

-- View: Expense accounts only
CREATE OR REPLACE VIEW expense_accounts AS
SELECT * FROM public.chart_of_accounts
WHERE type = 'expense' AND is_active = true
ORDER BY account_code;

-- View: Deductible expenses only
CREATE OR REPLACE VIEW deductible_expenses AS
SELECT * FROM public.chart_of_accounts
WHERE type = 'expense' AND is_deductible IN ('true', 'partial') AND is_active = true
ORDER BY account_code;

-- View: Grouped by category
CREATE OR REPLACE VIEW accounts_by_category AS
SELECT 
    category_group,
    type,
    COUNT(*) as account_count,
    json_agg(
        json_build_object(
            'id', id,
            'account_code', account_code,
            'name', name,
            'is_deductible', is_deductible
        ) ORDER BY account_code
    ) as accounts
FROM public.chart_of_accounts
WHERE is_active = true
GROUP BY category_group, type
ORDER BY type, category_group;

-- Grant access to views
GRANT SELECT ON income_accounts TO authenticated, anon;
GRANT SELECT ON expense_accounts TO authenticated, anon;
GRANT SELECT ON deductible_expenses TO authenticated;
GRANT SELECT ON accounts_by_category TO authenticated;

-- ============================================
-- ASSETS & LIABILITIES TABLES (Balance Sheet)
-- ============================================
-- Purpose: Track business assets and liabilities for drivers

-- Drop existing tables if needed
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.liabilities CASCADE;

-- Create assets table
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Asset details
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN (
        'vehicle',
        'equipment',
        'cash',
        'receivable',
        'other'
    )),
    value DECIMAL(12, 2) NOT NULL CHECK (value >= 0),
    purchase_date DATE,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create liabilities table
CREATE TABLE public.liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Liability details
    liability_name TEXT NOT NULL,
    liability_type TEXT NOT NULL CHECK (liability_type IN (
        'auto_loan',
        'lease',
        'credit_card',
        'tax',
        'other'
    )),
    balance DECIMAL(12, 2) NOT NULL CHECK (balance >= 0),
    due_date DATE,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_asset_type ON public.assets(asset_type);
CREATE INDEX idx_liabilities_user_id ON public.liabilities(user_id);
CREATE INDEX idx_liabilities_liability_type ON public.liabilities(liability_type);

-- ============================================
-- Row Level Security (RLS) Policies - Assets
-- ============================================

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can insert their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can update their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can delete their own assets" ON public.assets;

CREATE POLICY "Users can view their own assets"
    ON public.assets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets"
    ON public.assets FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
    ON public.assets FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
    ON public.assets FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- Row Level Security (RLS) Policies - Liabilities
-- ============================================

ALTER TABLE public.liabilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can insert their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can update their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can delete their own liabilities" ON public.liabilities;

CREATE POLICY "Users can view their own liabilities"
    ON public.liabilities FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liabilities"
    ON public.liabilities FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liabilities"
    ON public.liabilities FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liabilities"
    ON public.liabilities FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- Grant Permissions
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.liabilities TO authenticated;

-- ============================================
-- Triggers for updated_at
-- ============================================

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_liabilities_updated_at
    BEFORE UPDATE ON public.liabilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Helper Views for Balance Sheet
-- ============================================

-- View: Total assets by type
CREATE OR REPLACE VIEW assets_by_type AS
SELECT 
    user_id,
    asset_type,
    COUNT(*) as count,
    SUM(value) as total_value
FROM public.assets
GROUP BY user_id, asset_type;

-- View: Total liabilities by type
CREATE OR REPLACE VIEW liabilities_by_type AS
SELECT 
    user_id,
    liability_type,
    COUNT(*) as count,
    SUM(balance) as total_balance
FROM public.liabilities
GROUP BY user_id, liability_type;

-- View: Net worth calculation
CREATE OR REPLACE VIEW user_net_worth AS
SELECT 
    COALESCE(a.user_id, l.user_id) as user_id,
    COALESCE(total_assets, 0) as total_assets,
    COALESCE(total_liabilities, 0) as total_liabilities,
    COALESCE(total_assets, 0) - COALESCE(total_liabilities, 0) as net_worth
FROM (
    SELECT user_id, SUM(value) as total_assets
    FROM public.assets
    GROUP BY user_id
) a
FULL OUTER JOIN (
    SELECT user_id, SUM(balance) as total_liabilities
    FROM public.liabilities
    GROUP BY user_id
) l ON a.user_id = l.user_id;

-- Grant access to views
GRANT SELECT ON assets_by_type TO authenticated;
GRANT SELECT ON liabilities_by_type TO authenticated;
GRANT SELECT ON user_net_worth TO authenticated;

-- ============================================
-- PHASE 1 SETUP COMPLETE!
-- ============================================
-- Your income and expenses tables are ready!
-- Chart of Accounts system is seeded with 42 accounts!
-- Assets and Liabilities tables created for Balance Sheet!
-- Next steps:
-- 1. Run this ENTIRE script in Supabase SQL Editor
-- 2. Verify tables were created in Supabase UI
-- 3. Update dashboard.html to add income/expense modals
-- 4. Fetch and display real data on dashboard
-- 5. Integrate COA dropdowns in income/expense forms
-- 6. Create balance-sheet.html page for assets/liabilities tracking
