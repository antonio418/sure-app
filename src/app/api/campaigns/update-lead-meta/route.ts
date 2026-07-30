import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';

// Actualiza campos manuales del lead: form_enviado (checkbox) y/o comentario (texto libre).
export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const { lead_id, form_enviado, comentario } = await req.json();
    if (!lead_id) {
      throw new Error("Falta lead_id");
    }

    const updates: Record<string, any> = {};
    if (typeof form_enviado === 'boolean') {
      updates.form_enviado = form_enviado;
    }
    if (comentario !== undefined) {
      updates.comentario = (comentario || '').toString().trim().slice(0, 500) || null;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("Nada que actualizar");
    }

    const { error } = await supabaseAdmin
      .from('leads_campaign')
      .update(updates)
      .eq('id', lead_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update Lead Meta Error:', error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
