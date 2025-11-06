-- ============================================
-- Balance Sheet Tables Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.liabilities CASCADE;

-- ============================================
-- ASSETS TABLE
-- ============================================

CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Asset details
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN (
        'vehicle',
        'equipment',
        'cash',
        'receivable',
        'other'
    )),
    current_value DECIMAL(12, 2) NOT NULL CHECK (current_value >= 0),
    purchase_date DATE,
    purchase_price DECIMAL(12, 2),
    track_depreciation BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LIABILITIES TABLE
-- ============================================

CREATE TABLE public.liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Liability details
    liability_name TEXT NOT NULL,
    liability_type TEXT NOT NULL CHECK (liability_type IN (
        'auto_loan',
        'lease',
        'credit_card',
        'tax',
        'other'
    )),
    current_balance DECIMAL(12, 2) NOT NULL CHECK (current_balance >= 0),
    original_amount DECIMAL(12, 2),
    interest_rate DECIMAL(5, 2),
    monthly_payment DECIMAL(12, 2),
    due_date DATE,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_created_at ON public.assets(created_at DESC);
CREATE INDEX idx_assets_type ON public.assets(asset_type);

CREATE INDEX idx_liabilities_user_id ON public.liabilities(user_id);
CREATE INDEX idx_liabilities_created_at ON public.liabilities(created_at DESC);
CREATE INDEX idx_liabilities_type ON public.liabilities(liability_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liabilities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can insert their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can update their own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can delete their own assets" ON public.assets;

DROP POLICY IF EXISTS "Users can view their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can insert their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can update their own liabilities" ON public.liabilities;
DROP POLICY IF EXISTS "Users can delete their own liabilities" ON public.liabilities;

-- Assets policies
CREATE POLICY "Users can view their own assets"
ON public.assets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets"
ON public.assets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
ON public.assets FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
ON public.assets FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Liabilities policies
CREATE POLICY "Users can view their own liabilities"
ON public.liabilities FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liabilities"
ON public.liabilities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liabilities"
ON public.liabilities FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liabilities"
ON public.liabilities FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_assets_updated_at ON public.assets;
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_liabilities_updated_at ON public.liabilities;
CREATE TRIGGER update_liabilities_updated_at
    BEFORE UPDATE ON public.liabilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if tables were created
SELECT 'Assets table created' AS status, COUNT(*) AS row_count FROM public.assets;
SELECT 'Liabilities table created' AS status, COUNT(*) AS row_count FROM public.liabilities;

-- ============================================
-- SUCCESS!
-- ============================================
-- Your Balance Sheet tables are now ready!
-- You can now add assets and liabilities from the Balance Sheet page.

