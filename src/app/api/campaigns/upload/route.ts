import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireUser } from '@/lib/authGuard';

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

    // Basic CSV Parser (assuming format: Empresa,Contacto,Email,Sector)
    // In a real production app, use a library like 'papaparse'
    const lines = csvData.split('\n').filter((l: string) => l.trim() !== '');
    const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
    
    const leads = [];
    
    for (let i = 1; i < lines.length; i++) {
      // Handle commas inside quotes properly if needed, but for simple MVP this works
      const values = lines[i].split(',').map((v: string) => v.trim());
      if (values.length < 3) continue;

      // Map to columns (assuming basic order if headers don't match exactly)
      const empresaIndex = headers.findIndex((h: string) => h.includes('empresa') || h.includes('company'));
      const contactoIndex = headers.findIndex((h: string) => h.includes('contacto') || h.includes('name'));
      const emailIndex = headers.findIndex((h: string) => h.includes('email') || h.includes('correo'));
      const sectorIndex = headers.findIndex((h: string) => h.includes('sector') || h.includes('industry'));

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
