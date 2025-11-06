-- ============================================
-- Loan Payments Table Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.loan_payments CASCADE;

-- ============================================
-- LOAN PAYMENTS TABLE
-- ============================================

CREATE TABLE public.loan_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Link to liability
    liability_id UUID NOT NULL REFERENCES public.liabilities(id) ON DELETE CASCADE,
    
    -- Payment details
    payment_date DATE NOT NULL,
    total_payment DECIMAL(12, 2) NOT NULL CHECK (total_payment > 0),
    principal_amount DECIMAL(12, 2) NOT NULL CHECK (principal_amount >= 0),
    interest_amount DECIMAL(12, 2) NOT NULL CHECK (interest_amount >= 0),
    
    -- Optional fields
    notes TEXT,
    
    -- Link to auto-created expense entry
    expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: principal + interest should equal total payment
    CONSTRAINT payment_split_valid CHECK (principal_amount + interest_amount = total_payment)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_loan_payments_user_id ON public.loan_payments(user_id);
CREATE INDEX idx_loan_payments_liability_id ON public.loan_payments(liability_id);
CREATE INDEX idx_loan_payments_payment_date ON public.loan_payments(payment_date DESC);
CREATE INDEX idx_loan_payments_created_at ON public.loan_payments(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.loan_payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own loan payments" ON public.loan_payments;
DROP POLICY IF EXISTS "Users can insert their own loan payments" ON public.loan_payments;
DROP POLICY IF EXISTS "Users can update their own loan payments" ON public.loan_payments;
DROP POLICY IF EXISTS "Users can delete their own loan payments" ON public.loan_payments;

-- Policies
CREATE POLICY "Users can view their own loan payments"
ON public.loan_payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loan payments"
ON public.loan_payments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan payments"
ON public.loan_payments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loan payments"
ON public.loan_payments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

DROP TRIGGER IF EXISTS update_loan_payments_updated_at ON public.loan_payments;
CREATE TRIGGER update_loan_payments_updated_at
    BEFORE UPDATE ON public.loan_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-update liability balance after payment
-- ============================================

CREATE OR REPLACE FUNCTION update_liability_after_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Reduce the liability balance by the principal amount
    UPDATE public.liabilities
    SET current_balance = current_balance - NEW.principal_amount,
        updated_at = NOW()
    WHERE id = NEW.liability_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update liability
DROP TRIGGER IF EXISTS trigger_update_liability_after_payment ON public.loan_payments;
CREATE TRIGGER trigger_update_liability_after_payment
    AFTER INSERT ON public.loan_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_liability_after_payment();

-- ============================================
-- FUNCTION: Reverse liability update when payment is deleted
-- ============================================

CREATE OR REPLACE FUNCTION reverse_liability_after_payment_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Add back the principal amount to the liability balance
    UPDATE public.liabilities
    SET current_balance = current_balance + OLD.principal_amount,
        updated_at = NOW()
    WHERE id = OLD.liability_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reverse liability update on delete
DROP TRIGGER IF EXISTS trigger_reverse_liability_after_payment_delete ON public.loan_payments;
CREATE TRIGGER trigger_reverse_liability_after_payment_delete
    AFTER DELETE ON public.loan_payments
    FOR EACH ROW
    EXECUTE FUNCTION reverse_liability_after_payment_delete();

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if table was created
SELECT 'Loan Payments table created' AS status, COUNT(*) AS row_count FROM public.loan_payments;

-- ============================================
-- SUCCESS!
-- ============================================
-- Your Loan Payments tracking is now ready!
-- Payments will automatically update liability balances.

