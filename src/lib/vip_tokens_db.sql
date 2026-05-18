-- SQL script to create the vip_tokens table in Supabase

CREATE TABLE public.vip_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_by_email TEXT,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.vip_tokens ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (for validation from the client)
CREATE POLICY "Allow public read access on vip_tokens"
ON public.vip_tokens
FOR SELECT
TO public
USING (true);

-- Allow update access from API (service role bypasses RLS anyway, but good practice)
-- Insert/Delete will be handled by service role key in the admin API.

-- Insert a default test token
INSERT INTO public.vip_tokens (token, company_name) VALUES ('SURE_TEST_2026', 'Internal Testing');
