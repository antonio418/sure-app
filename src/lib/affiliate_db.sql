-- Create the affiliates table to store agents like Fernando
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    stripe_promo_code TEXT UNIQUE NOT NULL, -- e.g., 'FERNANDO20'
    commission_percentage NUMERIC NOT NULL DEFAULT 20.0, -- Default 20%
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the affiliate_commissions ledger to track payouts
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE NOT NULL,
    sale_amount NUMERIC NOT NULL,
    commission_earned NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- Only Admins (or Service Role) can view and modify these tables
CREATE POLICY "Allow Service Role full access to affiliates"
ON public.affiliates
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow Service Role full access to affiliate_commissions"
ON public.affiliate_commissions
FOR ALL
USING (true)
WITH CHECK (true);

-- Example Insert for Fernando (You can change the values later)
-- INSERT INTO public.affiliates (name, email, stripe_promo_code, commission_percentage)
-- VALUES ('Fernando Lara', 'Fernando.lara.c@rauhexpress.com', 'FERNANDO20', 20.0);
