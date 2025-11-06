-- ============================================
-- Fix RLS Security for Views
-- ============================================
-- Run this in Supabase SQL Editor to secure your views
-- This prevents users from seeing each other's aggregated data

-- ============================================
-- Enable RLS on Views
-- ============================================

ALTER VIEW public.monthly_income_summary SET (security_invoker = on);
ALTER VIEW public.monthly_expense_summary SET (security_invoker = on);
ALTER VIEW public.expense_by_category SET (security_invoker = on);

-- ============================================
-- Explanation
-- ============================================
-- Setting security_invoker = on makes the view use the permissions
-- of the user querying it, not the view creator.
-- 
-- Since the underlying tables (income, expenses) already have RLS policies
-- that filter by user_id = auth.uid(), the views will automatically
-- only show data for the authenticated user.
--
-- This is the recommended approach for Supabase views.

-- ============================================
-- Verify Security (Run these queries as a test)
-- ============================================
-- After running the above, test by querying:
-- SELECT * FROM monthly_income_summary;
-- SELECT * FROM monthly_expense_summary;
-- SELECT * FROM expense_by_category;
--
-- You should only see YOUR data, not other users' data.

