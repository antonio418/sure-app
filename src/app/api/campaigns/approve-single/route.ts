import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { lead_id, subject, content } = await req.json();
    if (!lead_id) throw new Error("Falta lead_id");

    const updateData: any = { status: 'APPROVED' };
    if (subject !== undefined) updateData.email_1_subject = subject;
    if (content !== undefined) updateData.email_1_content = content;

    const { error } = await supabaseAdmin
      .from('leads_campaign')
      .update(updateData)
      .eq('id', lead_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approve Single Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
