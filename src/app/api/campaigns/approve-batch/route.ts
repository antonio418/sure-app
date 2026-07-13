import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const { lead_ids } = await req.json();
    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      throw new Error("Falta array de lead_ids");
    }

    const { error } = await supabaseAdmin
      .from('leads_campaign')
      .update({ status: 'APPROVED' })
      .in('id', lead_ids);

    if (error) throw error;

    return NextResponse.json({ success: true, count: lead_ids.length });
  } catch (error: any) {
    console.error('Approve Batch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
