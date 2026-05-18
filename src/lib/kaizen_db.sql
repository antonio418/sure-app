-- Create the Kaizen Feedback table for continuous improvement
CREATE TABLE IF NOT EXISTS public.dns_kaizen_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_analyzed TEXT, -- Optional, helps track which domain the user was auditing
    q1_ease INTEGER CHECK (q1_ease >= 1 AND q1_ease <= 5),
    q2_accuracy INTEGER CHECK (q2_accuracy >= 1 AND q2_accuracy <= 5),
    q3_value INTEGER CHECK (q3_value >= 1 AND q3_value <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.dns_kaizen_feedback ENABLE ROW LEVEL SECURITY;

-- Allow Service Role to insert and select
CREATE POLICY "Allow Service Role full access to dns_kaizen_feedback"
ON public.dns_kaizen_feedback
FOR ALL
USING (true)
WITH CHECK (true);
