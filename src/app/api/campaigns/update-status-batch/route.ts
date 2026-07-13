import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const { lead_ids, status } = await req.json();
    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      throw new Error("Falta array de lead_ids");
    }
    if (!status) {
      throw new Error("Falta el nuevo status");
    }

    const CHUNK_SIZE = 100;
    for (let i = 0; i < lead_ids.length; i += CHUNK_SIZE) {
      const chunk = lead_ids.slice(i, i + CHUNK_SIZE);
      const { error } = await supabaseAdmin
        .from('leads_campaign')
        .update({ status: status })
        .in('id', chunk);
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true, count: lead_ids.length });
  } catch (error: any) {
    console.error('Update Status Batch Error:', error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: error.message?.includes('Bad Request') ? 400 : 500 });
  }
}
