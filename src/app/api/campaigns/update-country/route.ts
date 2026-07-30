import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const { lead_id, pais } = await req.json();
    if (!lead_id) {
      throw new Error("Falta lead_id");
    }

    // Guardamos el nombre del país tal cual (en inglés), recortado por seguridad, o null si viene vacío.
    const cleanPais = (pais || '').toString().trim().slice(0, 60) || null;

    const { error } = await supabaseAdmin
      .from('leads_campaign')
      .update({ pais: cleanPais })
      .eq('id', lead_id);

    if (error) throw error;

    return NextResponse.json({ success: true, pais: cleanPais });
  } catch (error: any) {
    console.error('Update Country Error:', error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
