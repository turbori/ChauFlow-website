-- ============================================
-- Update Expense Categories
-- Run this in Supabase SQL Editor
-- ============================================

-- This script:
-- 1. Updates existing "Car Payment" entries to "Vehicle Maintenance & Repairs"
-- 2. Updates the category constraint to reflect the new category name
-- 3. Adds "Interest Expense" category (auto-created by loan payment system)

-- ============================================
-- Step 1: Update existing "Car Payment" entries
-- ============================================

UPDATE public.expenses
SET category = 'Vehicle Maintenance & Repairs'
WHERE category = 'Car Payment';

-- ============================================
-- Step 2: Drop old constraint and add new one
-- ============================================

-- Drop the old constraint
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_category_check;

-- Add updated constraint with new categories
ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_category_check 
CHECK (category IN (
    'Gas',
    'Tolls',
    'Parking',
    'Car Wash',
    'Maintenance & Repairs',
    'Insurance',
    'Vehicle Maintenance & Repairs',
    'Phone Bill',
    'Supplies',
    'Meals',
    'Interest Expense',
    'Other'
));

-- ============================================
-- Verification
-- ============================================

-- Check if any "Car Payment" entries remain
SELECT 
    'Old Car Payment entries' AS check_type,
    COUNT(*) AS count
FROM public.expenses
WHERE category = 'Car Payment';

-- Show updated entries
SELECT 
    'Updated to Vehicle Maintenance & Repairs' AS check_type,
    COUNT(*) AS count
FROM public.expenses
WHERE category = 'Vehicle Maintenance & Repairs';

-- Show Interest Expense entries (from loan payments)
SELECT 
    'Interest Expense entries' AS check_type,
    COUNT(*) AS count
FROM public.expenses
WHERE category = 'Interest Expense';

-- ============================================
-- SUCCESS!
-- ============================================
-- Expense categories have been updated!
-- - "Car Payment" → "Vehicle Maintenance & Repairs"
-- - Added "Interest Expense" for loan payment system

