-- Create the DNS Leads table to store extracted Outlook emails
CREATE TABLE IF NOT EXISTS public.dns_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    dns_status TEXT DEFAULT 'pending' CHECK (dns_status IN ('pending', 'passed', 'failed')),
    failure_reason TEXT, -- Stores specific reasons like "Missing DMARC", "No SPF"
    campaign_sent BOOLEAN DEFAULT false, -- Tracks if the Drip Engine has emailed them yet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_audited_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster bulk scanning
CREATE INDEX idx_dns_leads_status ON public.dns_leads(dns_status);
CREATE INDEX idx_dns_leads_domain ON public.dns_leads(domain);

-- Row Level Security (RLS)
ALTER TABLE public.dns_leads ENABLE ROW LEVEL SECURITY;

-- Allow Service Role to manage the table
CREATE POLICY "Allow Service Role full access to dns_leads"
ON public.dns_leads
FOR ALL
USING (true)
WITH CHECK (true);
