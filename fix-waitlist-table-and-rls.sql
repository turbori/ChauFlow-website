-- ============================================
-- Fix Waitlist Table and RLS for Anonymous Users
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Make user_id nullable (so anonymous users can submit)
ALTER TABLE public.waitlist 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Anonymous users can insert waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Service role can view all waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view own entry" ON public.waitlist;
DROP POLICY IF EXISTS "Service role full access" ON public.waitlist;

-- Step 3: Create NEW policies that work for anonymous users
CREATE POLICY "Anyone can insert waitlist entry"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own entries"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access"
ON public.waitlist
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Ensure RLS is enabled
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'waitlist'
ORDER BY ordinal_position;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY policyname;

-- Check RLS status
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'waitlist';

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- user_id should be nullable: YES
-- You should see 3 policies for anon, authenticated, and service_role
-- RLS should be enabled: true
-- ============================================

