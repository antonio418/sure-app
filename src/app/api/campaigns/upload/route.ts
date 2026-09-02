import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';
import { normalizeLeadLang } from '@/lib/langUtils';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const reqJson = await req.json();
    const csvData = reqJson.csvData;
    
    // Fetch Blacklist
    const { data: blacklistData } = await supabaseAdmin.from('blacklist_domains').select('domain');
    const blacklistedDomains = new Set((blacklistData || []).map(b => b.domain.toLowerCase().trim()));
    
    if (!csvData) {
      return NextResponse.json({ error: 'No CSV data provided' }, { status: 400 });
    }

    // Parser CSV robusto: respeta las comillas y las comas dentro de campos
    // entrecomillados, y desescapa comillas dobles ("" -> "). El export de la app
    // entrecomilla los campos, así que el split ingenuo por comas corrompía los datos
    // (emails con comillas, columnas desalineadas). Esto lo arregla.
    const parseCsvLine = (line: string): string[] => {
      const out: string[] = [];
      let cur = '';
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inQ) {
          if (c === '"') {
            if (line[i + 1] === '"') { cur += '"'; i++; }
            else inQ = false;
          } else { cur += c; }
        } else {
          if (c === '"') inQ = true;
          else if (c === ',') { out.push(cur); cur = ''; }
          else cur += c;
        }
      }
      out.push(cur);
      return out.map((v) => v.trim());
    };

    const lines = csvData.split(/\r?\n/).filter((l: string) => l.trim() !== '');
    const headers = parseCsvLine(lines[0].replace(/^﻿/, '')).map((h: string) => h.toLowerCase());

    const leads = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < 3) continue;

      // Map to columns (assuming basic order if headers don't match exactly)
      const empresaIndex = headers.findIndex((h: string) => h.includes('empresa') || h.includes('company'));
      const contactoIndex = headers.findIndex((h: string) => h.includes('contacto') || h.includes('name'));
      const emailIndex = headers.findIndex((h: string) => h.includes('email') || h.includes('correo'));
      const sectorIndex = headers.findIndex((h: string) => h.includes('sector') || h.includes('industry'));
      const languageIndex = headers.findIndex((h: string) => h === 'language' || h === 'idioma' || h === 'lang' || h.includes('idioma') || h.includes('language'));
      const cargoIndex = headers.findIndex((h: string) => h.includes('cargo') || h.includes('title') || h.includes('role'));
      const telefonoIndex = headers.findIndex((h: string) => h.includes('telefono') || h.includes('teléfono') || h.includes('phone') || h === 'tel');
      const paisIndex = headers.findIndex((h: string) => h === 'pais' || h === 'país' || h.includes('pais') || h.includes('país') || h.includes('country'));
      const comentarioIndex = headers.findIndex((h: string) => h.includes('comentario') || h.includes('coment') || h.includes('notes'));
      const websiteIndex = headers.findIndex((h: string) => h.includes('website') || h.includes('web') || h.includes('sitio') || h === 'url');

      const email = emailIndex >= 0 ? values[emailIndex] : values[2]; // fallback to 3rd col
      const cleanEmail = email ? email.toLowerCase().trim() : '';
      
      if (!cleanEmail || !cleanEmail.includes('@') || /^(no-?reply|do-?not-?reply|bounces?)@/.test(cleanEmail)) continue; // Skip invalid or send-only emails

      const domain = cleanEmail.split('@')[1];
      if (domain && blacklistedDomains.has(domain)) {
          console.log(`[CSV Upload] Saltando ${cleanEmail} (Dominio en lista negra)`);
          continue;
      }

      leads.push({
        empresa: empresaIndex >= 0 ? values[empresaIndex] : values[0],
        nombre_contacto: contactoIndex >= 0 ? values[contactoIndex] : values[1],
        email: email,
        sector: sectorIndex >= 0 && sectorIndex < values.length ? values[sectorIndex] : 'General',
        // Idioma por lead (columna Language S/E -> es/en). Solo se incluye si la columna
        // existe y el valor se reconoce, para no sobrescribir con null al re-subir sin ella.
        ...(languageIndex >= 0 && normalizeLeadLang(values[languageIndex]) ? { language: normalizeLeadLang(values[languageIndex]) } : {}),
        // Preservar el resto de columnas del CSV si vienen (cargo, teléfono, país, comentario).
        // Solo se incluyen si la columna existe y trae valor, para no borrar datos al re-subir.
        ...(cargoIndex >= 0 && cargoIndex < values.length && values[cargoIndex] ? { cargo: values[cargoIndex] } : {}),
        ...(telefonoIndex >= 0 && telefonoIndex < values.length && values[telefonoIndex] ? { telefono: values[telefonoIndex] } : {}),
        ...(paisIndex >= 0 && paisIndex < values.length && values[paisIndex] ? { pais: values[paisIndex] } : {}),
        ...(comentarioIndex >= 0 && comentarioIndex < values.length && values[comentarioIndex] ? { comentario: values[comentarioIndex] } : {}),
        ...(websiteIndex >= 0 && websiteIndex < values.length && values[websiteIndex] ? { website: values[websiteIndex] } : {}),
        status: 'lead_nuevo',
        project_id: reqJson.project_id || null
      });
    }

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found in CSV' }, { status: 400 });
    }

    // Upsert but make sure we UPDATE the project_id if the lead exists
    const { data, error } = await supabaseAdmin
      .from('leads_campaign')
      .upsert(leads, { onConflict: 'email', ignoreDuplicates: false });

    if (error) throw error;

    return NextResponse.json({ success: true, count: leads.length });
  } catch (error: any) {
    console.error("CSV Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
