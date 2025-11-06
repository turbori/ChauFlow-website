-- ============================================
-- Owner's Equity Table Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.owner_equity CASCADE;

-- ============================================
-- OWNER EQUITY TABLE
-- ============================================

CREATE TABLE public.owner_equity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'contribution',  -- Money owner puts into business
        'draw'          -- Money owner takes out of business
    )),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    
    -- Optional fields
    description TEXT,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_owner_equity_user_id ON public.owner_equity(user_id);
CREATE INDEX idx_owner_equity_transaction_date ON public.owner_equity(transaction_date DESC);
CREATE INDEX idx_owner_equity_transaction_type ON public.owner_equity(transaction_type);
CREATE INDEX idx_owner_equity_created_at ON public.owner_equity(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.owner_equity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own equity transactions" ON public.owner_equity;
DROP POLICY IF EXISTS "Users can insert their own equity transactions" ON public.owner_equity;
DROP POLICY IF EXISTS "Users can update their own equity transactions" ON public.owner_equity;
DROP POLICY IF EXISTS "Users can delete their own equity transactions" ON public.owner_equity;

-- Policies
CREATE POLICY "Users can view their own equity transactions"
ON public.owner_equity FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own equity transactions"
ON public.owner_equity FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equity transactions"
ON public.owner_equity FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equity transactions"
ON public.owner_equity FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

DROP TRIGGER IF EXISTS update_owner_equity_updated_at ON public.owner_equity;
CREATE TRIGGER update_owner_equity_updated_at
    BEFORE UPDATE ON public.owner_equity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER VIEW: Calculate Total Equity
-- ============================================

CREATE OR REPLACE VIEW public.owner_equity_summary AS
SELECT 
    user_id,
    SUM(CASE WHEN transaction_type = 'contribution' THEN amount ELSE 0 END) as total_contributions,
    SUM(CASE WHEN transaction_type = 'draw' THEN amount ELSE 0 END) as total_draws,
    SUM(CASE WHEN transaction_type = 'contribution' THEN amount ELSE -amount END) as net_equity
FROM public.owner_equity
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.owner_equity_summary TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.owner_equity_summary SET (security_invoker = on);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if table was created
SELECT 'Owner Equity table created' AS status, COUNT(*) AS row_count FROM public.owner_equity;

-- ============================================
-- SAMPLE QUERIES (for reference)
-- ============================================

-- Get total equity for a user
-- SELECT * FROM public.owner_equity_summary WHERE user_id = auth.uid();

-- Get recent equity transactions
-- SELECT * FROM public.owner_equity 
-- WHERE user_id = auth.uid() 
-- ORDER BY transaction_date DESC 
-- LIMIT 10;

-- Get contributions vs draws breakdown
-- SELECT 
--     transaction_type,
--     COUNT(*) as transaction_count,
--     SUM(amount) as total_amount
-- FROM public.owner_equity
-- WHERE user_id = auth.uid()
-- GROUP BY transaction_type;

-- ============================================
-- SUCCESS!
-- ============================================
-- Your Owner's Equity tracking is now ready!
-- 
-- Understanding Owner's Equity:
-- - CONTRIBUTIONS: Money you invest in your business (increases equity)
-- - DRAWS: Money you take out for personal use (decreases equity)
-- - Net Equity = Total Contributions - Total Draws
-- 
-- Important Notes:
-- - Draws are NOT expenses (they don't affect profit/loss)
-- - Contributions are NOT income (they don't affect profit/loss)
-- - Equity shows how much of the business you own

