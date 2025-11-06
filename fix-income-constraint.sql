-- ============================================
-- Fix Income Source Constraint (Step-by-Step)
-- ============================================
-- Run this in Supabase SQL Editor

-- STEP 1: Check what data is causing the issue
-- This will show you any income entries with invalid sources
SELECT id, source, amount, date, created_at
FROM public.income
WHERE source NOT IN (
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
);

-- STEP 2: Fix the invalid data
-- Option A: Delete invalid entries (if they're test data)
-- Uncomment the line below to delete them:
-- DELETE FROM public.income WHERE source NOT IN ('Rideshare App Income', 'Black Car Jobs', 'Direct Client Income', 'Airport Transfers', 'Hourly Charters', 'Long-Distance Trips', 'Cash Tips', 'Digital Tips', 'Referral Bonuses', 'Platform Bonuses', 'Wait Time Charges', 'Additional Stop Fees', 'Toll Reimbursements', 'Cancellation Fees', 'Event Package Income', 'Vehicle Rental Income', 'Vehicle Advertising', 'Other Income');

-- Option B: Update invalid entries to 'Other Income'
-- Uncomment the line below to update them:
-- UPDATE public.income SET source = 'Other Income' WHERE source NOT IN ('Rideshare App Income', 'Black Car Jobs', 'Direct Client Income', 'Airport Transfers', 'Hourly Charters', 'Long-Distance Trips', 'Cash Tips', 'Digital Tips', 'Referral Bonuses', 'Platform Bonuses', 'Wait Time Charges', 'Additional Stop Fees', 'Toll Reimbursements', 'Cancellation Fees', 'Event Package Income', 'Vehicle Rental Income', 'Vehicle Advertising', 'Other Income');

-- STEP 3: Drop the old constraint
ALTER TABLE public.income DROP CONSTRAINT IF EXISTS income_source_check;

-- STEP 4: Add the updated constraint
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

-- STEP 5: Verify the constraint was added successfully
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.income'::regclass 
AND conname = 'income_source_check';

