import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';
import { normalizeLeadLang } from '@/lib/langUtils';

// Actualiza campos manuales del lead: form_enviado (checkbox), comentario, cargo,
// email (con validación de formato), website y/o language (S/E->es/en). Todos editables a mano desde la tabla.
export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const { lead_id, form_enviado, comentario, cargo, email, website, empresa, nombre_contacto, pais, sector, has_replied, language } = await req.json();
    if (!lead_id) {
      throw new Error("Falta lead_id");
    }

    const updates: Record<string, any> = {};
    if (typeof form_enviado === 'boolean') {
      updates.form_enviado = form_enviado;
    }
    if (typeof has_replied === 'boolean') {
      // Marcar/desmarcar que el lead respondió. has_replied=true DETIENE el drip
      // (el despacho filtra has_replied=false), y muestra el badge de "respondió".
      updates.has_replied = has_replied;
    }
    if (comentario !== undefined) {
      updates.comentario = (comentario || '').toString().trim().slice(0, 500) || null;
    }
    if (cargo !== undefined) {
      updates.cargo = (cargo || '').toString().trim().slice(0, 150) || null;
    }
    if (email !== undefined) {
      const cleanEmail = (email || '').toString().trim();
      // El correo es campo clave (se usa como conflicto en upsert): solo se actualiza si no está vacío.
      if (cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        updates.email = cleanEmail;
      } else if (cleanEmail) {
        throw new Error("El correo no tiene un formato válido");
      }
    }
    if (website !== undefined) {
      updates.website = (website || '').toString().trim().slice(0, 300) || null;
    }
    if (empresa !== undefined) {
      const v = (empresa || '').toString().trim().slice(0, 200);
      if (!v) throw new Error("El nombre de empresa no puede quedar vacío");
      updates.empresa = v;
    }
    if (nombre_contacto !== undefined) {
      updates.nombre_contacto = (nombre_contacto || '').toString().trim().slice(0, 150) || null;
    }
    if (pais !== undefined) {
      updates.pais = (pais || '').toString().trim().slice(0, 60) || null;
    }
    if (sector !== undefined) {
      updates.sector = (sector || '').toString().trim().slice(0, 250) || null;
    }
    if (language !== undefined) {
      // Acepta S/E, es/en o nombres; guarda el código normalizado ('es'|'en'|...) o null.
      updates.language = normalizeLeadLang(language);
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
