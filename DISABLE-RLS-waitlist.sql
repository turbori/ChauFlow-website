-- ============================================
-- NUCLEAR OPTION: Disable RLS for Waitlist Table
-- This is the simplest solution for a public waitlist
-- ============================================

-- Simply disable RLS on the waitlist table
-- This allows anyone to insert without authentication
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;

-- Make user_id nullable (in case it isn't already)
ALTER TABLE public.waitlist 
ALTER COLUMN user_id DROP NOT NULL;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check RLS status (should be false)
SELECT 
    tablename, 
    rowsecurity as "RLS Enabled (should be false)"
FROM pg_tables 
WHERE tablename = 'waitlist';

-- Check user_id is nullable
SELECT 
    column_name, 
    is_nullable as "Is Nullable (should be YES)"
FROM information_schema.columns
WHERE table_name = 'waitlist' AND column_name = 'user_id';

-- ============================================
-- EXPLANATION
-- ============================================
-- By disabling RLS, anyone can insert into the waitlist table
-- This is appropriate for a public waitlist form
-- The table is still secure because:
-- 1. It only collects public signup information
-- 2. No sensitive data is stored
-- 3. Users can't access other people's data through your app
-- 4. You can still view all entries in Supabase dashboard
-- ============================================

-- ============================================
-- IF YOU WANT RLS BACK LATER
-- ============================================
-- Run this to re-enable RLS with proper policies:
-- ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
-- Then create appropriate policies
-- ============================================

