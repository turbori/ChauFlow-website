-- ============================================
-- CHART OF ACCOUNTS (COA) SYSTEM FOR CHAUFLOW
-- ============================================
-- Purpose: Track income and expenses with proper categorization
-- for independent drivers and fleet owners
-- ============================================

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
INSERT INTO public.chart_of_accounts (account_code, name, type, category_group, is_deductible, is_default, description) VALUES
('4000', 'Rideshare Income', 'income', 'Income', 'false', true, 'Income from Uber, Lyft, and other rideshare platforms'),
('4010', 'Private Client Income', 'income', 'Income', 'false', true, 'Income from direct private clients and bookings'),
('4020', 'Airport Transfers', 'income', 'Income', 'false', true, 'Income from airport pickup and drop-off services'),
('4030', 'Corporate Accounts', 'income', 'Income', 'false', true, 'Income from corporate contracts and business accounts'),
('4040', 'Hourly Hires', 'income', 'Income', 'false', true, 'Income from hourly chauffeur services'),
('4050', 'Affiliate / Referral Income', 'income', 'Income', 'false', true, 'Income from referrals and affiliate programs'),
('4060', 'Tips Received', 'income', 'Income', 'false', true, 'Tips and gratuities from passengers'),
('4070', 'Reimbursements', 'income', 'Income', 'false', true, 'Reimbursements for expenses paid on behalf of clients'),
('4090', 'Other Income', 'income', 'Income', 'false', true, 'Miscellaneous income not categorized elsewhere');

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
('6060', 'Meals (Client-related)', 'expense', 'Operations', 'partial', true, 'Business meals with clients (50% deductible)'),
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

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count total accounts
SELECT 
    type,
    category_group,
    COUNT(*) as count
FROM public.chart_of_accounts
GROUP BY type, category_group
ORDER BY type, category_group;

-- Show all income accounts
SELECT account_code, name, category_group
FROM public.chart_of_accounts
WHERE type = 'income'
ORDER BY account_code;

-- Show all expense accounts grouped by category
SELECT account_code, name, category_group, is_deductible
FROM public.chart_of_accounts
WHERE type = 'expense'
ORDER BY category_group, account_code;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Chart of Accounts table created successfully!';
    RAISE NOTICE '✅ Seeded with % income accounts', (SELECT COUNT(*) FROM public.chart_of_accounts WHERE type = 'income');
    RAISE NOTICE '✅ Seeded with % expense accounts', (SELECT COUNT(*) FROM public.chart_of_accounts WHERE type = 'expense');
    RAISE NOTICE '✅ Total accounts: %', (SELECT COUNT(*) FROM public.chart_of_accounts);
END $$;

