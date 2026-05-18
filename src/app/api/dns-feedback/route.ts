import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, q1, q2, q3 } = body;

    // Insert into Supabase dns_survey_results
    const { error } = await supabaseAdmin.from('dns_survey_results').insert({
      domain_analyzed: domain || 'unknown',
      q1_ease: q1 || '',
      q2_confidence: q2 || '',
      q3_recommend: q3 || ''
    });

    if (error) {
      console.error('Supabase Survey Insert Error:', error);
      throw new Error('Database insert failed');
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Kaizen Feedback Error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
