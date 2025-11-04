-- ============================================
-- ChauFlow Waitlist Table Setup
-- ============================================
-- Run this in Supabase SQL Editor: https://bvrdimwnarfobmwvthyb.supabase.co/project/_/sql

-- Drop table if exists (for clean re-runs during development)
-- Uncomment the line below ONLY if you need to reset the table
-- DROP TABLE IF EXISTS public.waitlist CASCADE;

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('Independent Driver', 'Fleet Owner', 'Accountant / Tax Pro', 'Other')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source TEXT,
    has_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_email UNIQUE (email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON public.waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_joined_at ON public.waitlist(joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_has_access ON public.waitlist(has_access);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on the waitlist table
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean re-runs)
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Anonymous users can insert waitlist entries" ON public.waitlist;

-- Policy 1: Allow INSERT only if auth.uid() matches user_id
-- This allows authenticated users to add themselves to the waitlist
CREATE POLICY "Users can insert their own waitlist entry"
ON public.waitlist
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow anonymous INSERT (for users who sign up before creating account)
-- This is optional but useful for waitlist signups before authentication
CREATE POLICY "Anonymous users can insert waitlist entries"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 3: Allow SELECT only for own row
-- Users can only view their own waitlist entry
CREATE POLICY "Users can view their own waitlist entry"
ON public.waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: No UPDATE or DELETE policies = users cannot update or delete their entries

-- ============================================
-- Helper Function (Optional)
-- ============================================
-- Function to check if email already exists in waitlist
CREATE OR REPLACE FUNCTION public.check_waitlist_email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.waitlist WHERE email = check_email
    );
END;
$$;

-- ============================================
-- Grant Permissions
-- ============================================
-- Grant necessary permissions to authenticated and anonymous users
GRANT SELECT, INSERT ON public.waitlist TO authenticated;
GRANT INSERT ON public.waitlist TO anon;

-- Grant usage on the sequence (for ID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify your setup

-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'waitlist'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'waitlist';

-- ============================================
-- Sample Test Data (Optional - for testing)
-- ============================================
-- Uncomment to insert test data

-- INSERT INTO public.waitlist (full_name, email, user_type, source)
-- VALUES 
--     ('John Doe', 'john@example.com', 'Independent Driver', 'landing_page'),
--     ('Jane Smith', 'jane@example.com', 'Fleet Owner', 'google_ads'),
--     ('Bob Johnson', 'bob@example.com', 'Accountant / Tax Pro', 'referral');

-- ============================================
-- DONE!
-- ============================================
-- Your waitlist table is now ready to use!
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify the table was created: Check Tables in Supabase UI
-- 3. Test inserting a row manually
-- 4. Implement the frontend form to save data

