-- ============================================
-- Fix Waitlist RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist;

-- ============================================
-- NEW POLICIES: Allow public waitlist signups
-- ============================================

-- Policy 1: Allow anyone (including anonymous users) to insert into waitlist
CREATE POLICY "Anyone can insert into waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Users can view their own waitlist entry (if authenticated)
CREATE POLICY "Users can view their own waitlist entry"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Allow service role to view all (for admin purposes)
CREATE POLICY "Service role can view all waitlist entries"
ON public.waitlist
FOR SELECT
TO service_role
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created
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

-- ============================================
-- SUCCESS!
-- ============================================
-- Waitlist form should now work for public users!

