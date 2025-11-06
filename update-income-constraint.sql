-- ============================================
-- Update Income Source Constraint
-- ============================================
-- Run this in Supabase SQL Editor to fix the income_source_check error

-- Drop the old constraint
ALTER TABLE public.income DROP CONSTRAINT IF EXISTS income_source_check;

-- Add the updated constraint with all 18 income sources
ALTER TABLE public.income ADD CONSTRAINT income_source_check CHECK (source IN (
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
));

-- Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.income'::regclass 
AND conname = 'income_source_check';

