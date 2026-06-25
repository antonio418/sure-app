import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ALFREDO_PROMPT } from '@/lib/agents/alfredo';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Google Gemini.' }, { status: 500 });
    }

    const { supplementary_info, project_id, iteration, limit } = await req.json();
    if (!project_id) {
      return NextResponse.json({ error: 'Falta el project_id.' }, { status: 400 });
    }

    const { data: project, error: projError } = await supabaseAdmin.from('projects').select('*').eq('id', project_id).single();
    if (projError || !project) {
      return NextResponse.json({ error: 'Proyecto no encontrado.' }, { status: 404 });
    }

    // Obtener prospectos existentes para excluirlos del prompt
    const { data: existingLeads } = await supabaseAdmin
      .from('leads_campaign')
      .select('empresa, website')
      .eq('project_id', project_id);

    const ai = new GoogleGenAI({ apiKey });
    
    let searchPrompt = `Busca prospectos comerciales corporativos en la web. El objetivo principal de nuestro proyecto es: "${project.objective}".`;
    
    if (limit) {
      searchPrompt += `\nESTRICTO: Entrega exactamente ${limit} empresas.`;
    }
    if (iteration && iteration > 1) {
      searchPrompt += `\nESTRICTO: Esta es la iteración número ${iteration} de esta búsqueda. Por favor, asegúrate de devolver OTRAS empresas, NO repitas las empresas más obvias que ya me habrías dado en la primera iteración. Ve más profundo.`;
    }

    if (existingLeads && existingLeads.length > 0) {
      const existingWebsites = existingLeads
        .map((l: any) => {
          if (!l.website) return '';
          return l.website.replace(/^https?:\/\/(www\.)?/, '').trim().toLowerCase();
        })
        .filter((w: string) => w !== '');
      
      const existingNames = existingLeads
        .map((l: any) => l.empresa.trim().toLowerCase())
        .filter((n: string) => n !== '');
        
      if (existingWebsites.length > 0 || existingNames.length > 0) {
        searchPrompt += `\n\nESTRICTO: EVITA COMPLETAMENTE las siguientes empresas y sitios web que ya tenemos registrados en nuestra base de datos (no los repitas bajo ninguna circunstancia):`;
        if (existingNames.length > 0) {
          searchPrompt += `\n- Nombres de empresa a evitar: ${Array.from(new Set(existingNames)).slice(0, 100).join(', ')}`;
        }
        if (existingWebsites.length > 0) {
          searchPrompt += `\n- Sitios web/dominios a evitar: ${Array.from(new Set(existingWebsites)).slice(0, 100).join(', ')}`;
        }
      }
    }

    if (supplementary_info && supplementary_info.trim() !== '') {
      searchPrompt += `\nTen en cuenta las siguientes restricciones y contexto adicional (Geografía, perfil, etc.): "${supplementary_info.trim()}".`;
    }
    
    let response;
    let retries = 2;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: searchPrompt,
          config: {
            systemInstruction: ALFREDO_PROMPT,
            temperature: 0.1, // Temperatura baja para obligar a basarse en los resultados de búsqueda reales
            tools: [{ googleSearch: {} }]
          }
        });
        break; 
      } catch (e: any) {
        retries--;
        console.warn(`Gemini API Error. Retries left: ${retries}`, e.message);
        if (retries === 0) {
           return NextResponse.json({ error: 'Google Gemini servers are overloaded. Please try again later.' }, { status: 503 });
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!response) {
      throw new Error("No se pudo obtener respuesta de la Inteligencia Artificial.");
    }

    let rawText = response.text || '';
    if (!rawText) throw new Error("Respuesta vacía de Gemini");

    // Extracción robusta de JSON de bloques markdown
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      rawText = jsonMatch[1];
    } else {
      // Si no tiene bloques markdown, buscamos el primer '[' y el último ']'
      const startIdx = rawText.indexOf('[');
      const endIdx = rawText.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        rawText = rawText.substring(startIdx, endIdx + 1);
      }
    }

    const leads = JSON.parse(rawText.trim());

    if (!Array.isArray(leads)) {
       throw new Error("El formato devuelto no es un array de prospectos válido.");
    }

    const sanitizedLeads = leads.map((lead: any) => {
      const rawEmail = lead.email || '';
      let email = rawEmail;
      let status = 'NEW';

      const cleanWebsite = (lead.website || 'unknown.com')
        .replace(/^https?:\/\/(www\.)?/, '')
        .split('/')[0];

      if (!rawEmail || rawEmail.trim() === '') {
        const uniqueId = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
        email = `no-email-${uniqueId}@${cleanWebsite}`;
        status = 'PARKED';
      }

      return {
        empresa: lead.empresa || 'Unknown',
        nombre_oficial_empresa: lead.nombre_oficial_empresa || '',
        direccion: lead.direccion || '',
        nota_empresa: lead.nota_empresa || '',
        nombre_contacto: lead.nombre_contacto || '',
        cargo: lead.cargo || lead.position || lead.rol || '',
        nota_contacto: lead.nota_contacto || '',
        email: email,
        telefono: lead.telefono || lead.phone || '',
        pais: lead.pais || lead.country || '',
        sector: lead.sector || '',
        linkedin: lead.linkedin || '',
        website: lead.website || '',
        status: status,
        project_id: project_id || null
      };
    }).filter((lead: any) => lead.website && lead.website.trim() !== ''); // Filtro estricto anti-alucinaciones

    // Insert into Supabase directly
    if (sanitizedLeads.length > 0) {
       // --- HUNTER.IO VERIFICATION ---
       const hunterKey = process.env.HUNTER_API_KEY;
       let verifiedLeads = sanitizedLeads;
       
       if (hunterKey) {
          console.log("Iniciando verificación con Hunter.io...");
          verifiedLeads = [];
          for (const lead of sanitizedLeads) {
             // Si el correo ya es autogenerado por no tener email, lo dejamos en PARKED y continuamos
             if (lead.email.startsWith('no-email-')) {
                verifiedLeads.push(lead);
                continue;
             }

             try {
                const res = await fetch(`https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(lead.email)}&api_key=${hunterKey}`);
                const data = await res.json();
                if (data && data.data && data.data.status) {
                   const status = data.data.status;
                   // Solo los correos 100% válidos son seguros para envío automatizado.
                   // Los catch-all (accept_all) se marcan como PARKED para verificación manual.
                   if (status === 'valid') {
                      verifiedLeads.push(lead);
                   } else {
                      const isCatchAll = status === 'accept_all';
                      console.log(`Hunter.io detectó correo ${isCatchAll ? 'Catch-All' : 'inválido'}: ${lead.email} (Status: ${status}). Guardando como PARKED.`);
                      const cleanWebsite = (lead.website || 'unknown.com')
                        .replace(/^https?:\/\/(www\.)?/, '')
                        .split('/')[0];
                      const uniqueId = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
                      const originalEmail = lead.email;
                      const label = isCatchAll ? 'Correo original no verificado (Catch-All)' : 'Correo original no verificado';
                      
                      verifiedLeads.push({
                         ...lead,
                         email: `no-email-${uniqueId}@${cleanWebsite}`,
                         status: 'PARKED',
                         nota_contacto: `${lead.nota_contacto ? lead.nota_contacto + ' | ' : ''}${label}: ${originalEmail}`
                      });
                   }
                } else {
                   // Si hay un error con Hunter, lo guardamos por si acaso
                   verifiedLeads.push(lead);
                }
             } catch (err) {
                console.error("Error verificando con Hunter:", err);
                verifiedLeads.push(lead); // En caso de fallo de red, asumimos que es bueno
             }
          }
       } else {
          console.warn("No se encontró HUNTER_API_KEY. Saltando verificación de correos.");
       }

       if (verifiedLeads.length === 0) {
           return NextResponse.json({ success: true, count: 0, leads: [], message: 'Todos los leads fueron filtrados/procesados.' });
       }

       const { data: insertedData, error: insertError } = await supabaseAdmin
         .from('leads_campaign')
         .upsert(verifiedLeads, { onConflict: 'email', ignoreDuplicates: true })
         .select();
         
       if (insertError) {
         console.error("Supabase insert error:", insertError);
         return NextResponse.json({ error: `Error DB: ${insertError.message}` }, { status: 500 });
       }
       
       const newLeadsInserted = insertedData || [];
       return NextResponse.json({ success: true, count: newLeadsInserted.length, leads: newLeadsInserted });
    }

    return NextResponse.json({ success: true, count: 0, leads: [] });

  } catch (error: any) {
    console.error('Error in Alfredo API:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
