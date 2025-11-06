-- ============================================
-- FINAL FIX: Waitlist Table for Anonymous Users
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS temporarily to make changes
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;

-- Step 2: Make user_id nullable
ALTER TABLE public.waitlist 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Drop ALL existing policies (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'waitlist') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.waitlist';
    END LOOP;
END $$;

-- Step 4: Create ONLY these 3 policies
CREATE POLICY "enable_insert_for_anon_users"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "enable_select_for_authenticated_users"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "enable_all_for_service_role"
ON public.waitlist
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Re-enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check if user_id is nullable
SELECT 
    column_name, 
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'waitlist' AND column_name = 'user_id';

-- 2. Check all policies
SELECT 
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY policyname;

-- 3. Check RLS status
SELECT 
    tablename, 
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'waitlist';

-- ============================================
-- EXPECTED OUTPUT
-- ============================================
-- Query 1: user_id should show is_nullable = 'YES'
-- Query 2: Should show exactly 3 policies
-- Query 3: RLS Enabled should be 'true'
-- ============================================

-- ============================================
-- TEST INSERT (Optional - run separately)
-- ============================================
-- This should work without authentication:
-- INSERT INTO public.waitlist (full_name, email, user_type, user_id)
-- VALUES ('Test User', 'test@example.com', 'Independent Chauffeur', NULL);
-- ============================================

