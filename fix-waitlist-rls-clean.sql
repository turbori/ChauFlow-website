-- ============================================
-- Clean Waitlist RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop ALL existing policies on waitlist table
DROP POLICY IF EXISTS "Anonymous users can insert waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Service role can view all waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist;

-- ============================================
-- CREATE CLEAN POLICIES
-- ============================================

-- Policy 1: Allow ANYONE (including anonymous) to insert into waitlist
CREATE POLICY "Public can join waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Authenticated users can view their own entries
CREATE POLICY "Users can view own entry"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Service role can view all (for admin dashboard)
CREATE POLICY "Service role full access"
ON public.waitlist
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY policyname;

-- ============================================
-- TEST THE SETUP
-- ============================================

-- Test 1: Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'waitlist';

-- Test 2: Check table structure
\d public.waitlist

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- You should see 3 policies:
-- 1. "Public can join waitlist" - INSERT for {anon, authenticated}
-- 2. "Users can view own entry" - SELECT for {authenticated}
-- 3. "Service role full access" - ALL for {service_role}
-- ============================================

