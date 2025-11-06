-- ============================================
-- Fix Balance Sheet Constraints
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the old constraints
ALTER TABLE public.assets DROP CONSTRAINT IF EXISTS assets_asset_type_check;
ALTER TABLE public.liabilities DROP CONSTRAINT IF EXISTS liabilities_liability_type_check;

-- Add the correct constraints that match the form
ALTER TABLE public.assets 
ADD CONSTRAINT assets_asset_type_check 
CHECK (asset_type IN (
    'vehicle',
    'equipment',
    'cash',
    'receivable',
    'other'
));

ALTER TABLE public.liabilities 
ADD CONSTRAINT liabilities_liability_type_check 
CHECK (liability_type IN (
    'auto_loan',
    'lease',
    'credit_card',
    'tax',
    'other'
));

-- Success message
SELECT 'Constraints updated successfully!' AS status;

