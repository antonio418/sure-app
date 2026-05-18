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

    const ai = new GoogleGenAI({ apiKey });
    
    let searchPrompt = `Busca prospectos comerciales corporativos en la web. El objetivo principal de nuestro proyecto es: "${project.objective}".`;
    
    if (limit) {
      searchPrompt += `\nESTRICTO: Entrega exactamente ${limit} empresas.`;
    }
    if (iteration && iteration > 1) {
      searchPrompt += `\nESTRICTO: Esta es la iteración número ${iteration} de esta búsqueda. Por favor, asegúrate de devolver OTRAS empresas, NO repitas las empresas más obvias que ya me habrías dado en la primera iteración. Ve más profundo.`;
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
            temperature: 0.4, // Temperatura media para permitir recall de memoria sin alucinar en exceso
            responseMimeType: "application/json",
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

    let rawText = response.text;
    if (!rawText) throw new Error("Respuesta vacía de Gemini");

    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '');
    }

    const leads = JSON.parse(rawText.trim());

    if (!Array.isArray(leads)) {
       throw new Error("El formato devuelto no es un array de prospectos válido.");
    }

    const sanitizedLeads = leads.map((lead: any) => ({
      empresa: lead.empresa || 'Unknown',
      nombre_oficial_empresa: lead.nombre_oficial_empresa || '',
      direccion: lead.direccion || '',
      nota_empresa: lead.nota_empresa || '',
      nombre_contacto: lead.nombre_contacto || '',
      cargo: lead.cargo || lead.position || lead.rol || '',
      nota_contacto: lead.nota_contacto || '',
      email: lead.email || '',
      telefono: lead.telefono || lead.phone || '',
      pais: lead.pais || lead.country || '',
      sector: lead.sector || '',
      linkedin: lead.linkedin || '',
      website: lead.website || '',
      status: 'NEW',
      project_id: project_id || null
    })).filter((lead: any) => lead.website && lead.website.trim() !== ''); // Filtro estricto anti-alucinaciones

    // Insert into Supabase directly
    if (sanitizedLeads.length > 0) {
       // --- HUNTER.IO VERIFICATION ---
       const hunterKey = process.env.HUNTER_API_KEY;
       let verifiedLeads = sanitizedLeads;
       
       if (hunterKey) {
          console.log("Iniciando verificación con Hunter.io...");
          verifiedLeads = [];
          for (const lead of sanitizedLeads) {
             if (!lead.email) {
                verifiedLeads.push(lead); // Conservamos el lead para contacto por LinkedIn aunque no tenga email
                continue;
             }
             try {
                const res = await fetch(`https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(lead.email)}&api_key=${hunterKey}`);
                const data = await res.json();
                if (data && data.data && data.data.status) {
                   const status = data.data.status;
                   // accept_all and valid are generally safe to send
                   if (status === 'valid' || status === 'accept_all') {
                      verifiedLeads.push(lead);
                   } else {
                      console.log(`Hunter.io descartó: ${lead.email} (Status: ${status})`);
                   }
                } else {
                   // Si hay un error con Hunter, lo guardamos por si acaso (para no perder el lead)
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
           return NextResponse.json({ success: true, count: 0, leads: [], message: 'Todos los correos fueron descartados por Hunter.io.' });
       }

       const { error: insertError } = await supabaseAdmin
         .from('leads_campaign')
         .upsert(verifiedLeads, { onConflict: 'email', ignoreDuplicates: true });
         
       if (insertError) {
         console.error("Supabase insert error:", insertError);
         return NextResponse.json({ error: `Error DB: ${insertError.message}` }, { status: 500 });
       }
       
       return NextResponse.json({ success: true, count: verifiedLeads.length, leads: verifiedLeads });
    }

    return NextResponse.json({ success: true, count: 0, leads: [] });

  } catch (error: any) {
    console.error('Error in Alfredo API:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
