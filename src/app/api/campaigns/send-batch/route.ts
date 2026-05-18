import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';
import { generateGermaniumRFQHtml } from '@/lib/templates/germanium_rfq';
import { generateImportDiligenceHtml } from '@/lib/templates/import_diligence_campaign';

// Configure this to true if deploying to Vercel and you want this to run longer
export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const { project_id, selectedLeads } = await req.json().catch(() => ({ project_id: '', selectedLeads: [] }));
    
    const apiKey = process.env.GEMINI_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!apiKey || !resendKey) {
      return NextResponse.json({ error: 'Faltan claves de API (Gemini o Resend)' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Get pending leads
    let query = supabaseAdmin
      .from('leads_campaign')
      .select('*')
      .in('status', ['NEW', 'lead_nuevo']);

    if (selectedLeads && selectedLeads.length > 0) {
      query = query.in('id', selectedLeads);
    }

    const { data: leads, error } = await query
      .order('created_at', { ascending: false })
      .limit(5); // Reduce batch size to prevent Vercel 10s/60s timeout

    if (error) throw error;
    if (!leads || leads.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay leads nuevos para procesar.', sentCount: 0 });
    }

    // Fetch Project Context
    let campaignGoal = '';
    let attachmentUrl = '';
    let projectName = '';
    if (project_id) {
        const { data: project } = await supabaseAdmin.from('projects').select('*').eq('id', project_id).single();
        if (project) {
            campaignGoal = project.objective;
            attachmentUrl = project.attachment_url || '';
            projectName = project.name || '';
        }
    }

    let sentCount = 0;
    const fallos: string[] = [];

    // Process in parallel to save time
    await Promise.all(leads.map(async (lead) => {
      const isGermaniumRFQ = /germanio|germanium|geo2/i.test(campaignGoal || '');
      const isImportDiligence = /import|mid-market|rma|distribuidor/i.test(campaignGoal || '') || /import|mid-market|rma|distribuidor/i.test(projectName || '');
      const isDNSProject = /dns/i.test(projectName || '') || /dns/i.test(campaignGoal || '');
      
      const isSpanish = /español|espanol|spanish/i.test(campaignGoal || '');
      const isPortuguese = /portugués|portugues|portuguese/i.test(campaignGoal || '');
      const languageCode = isSpanish ? 'es' : (isPortuguese ? 'pt' : 'en');
      const languageName = isSpanish ? 'ESPAÑOL' : (isPortuguese ? 'PORTUGUÉS' : 'INGLÉS');

      const cleanEmpresaName = (lead.empresa || '').replace(/\.(com|co|net|org|io|ai|biz|info|us|uk|br|cn|in|de|fr|es|it|jp|ru|au)(\.[a-z]{2})?$/i, '').trim().toUpperCase() || 'TEAM';

      let subject = "SURE: Oportunidad Estratégica";
      let body = `Estimado ${lead.nombre_contacto || 'Equipo Directivo'},\n\nNos ponemos en contacto en relación a sus operaciones en el sector de ${lead.sector}.\n\nAtentamente,\nSURE Ecosystem`;
      let emailContentText = body; 
      let htmlBody: string | undefined = undefined;

      try {
         let promptText = "";
         if (isGermaniumRFQ) {
             promptText = `
            Eres un consultor experto en compras corporativas B2B (Procurement) actuando en nombre de un cliente final. Estamos enviando un Request for Quotation (RFQ) oficial para solicitar que la empresa ${lead.empresa} suministre Germanio a nuestro cliente.
            
            REGLAS ESTRICTAS DE REDACCIÓN: 
            1. ACTÚAS COMO INTERMEDIARIO: Estás buscando material para TU CLIENTE, no para ti mismo.
            2. NUNCA menciones el nombre de tu propia consultora ni uses comodines como "[Tu Empresa]". Habla siempre en nombre de "nuestro cliente".
            3. ENFOQUE EN EL VENDEDOR: El halago debe ser puramente hacia ellos. Ejemplo: "Dada la excelente reputación de ${cleanEmpresaName} como fabricante de..."
            4. PROHIBIDO decir "nosotros necesitamos para nuestras fábricas" (tú no fabricas nada).
            
            Información del Proveedor (Prospecto):
            - Nombre: ${lead.nombre_contacto || 'Equipo Directivo'}
            - Perfil / Datos adicionales: ${lead.nota_contacto || 'N/A'}
            - Logros Empresa: ${lead.nota_empresa || 'N/A'}

            Tu tarea es generar la estructura base para una Campaña de Seguimiento (Drip) de 3 pasos en ${languageName}. 
            Devuelve ÚNICAMENTE un objeto JSON válido, sin formato markdown (\`\`\`), sin saludos fuera del JSON.
            
            Estructura JSON estricta requerida:
            {
               "email_1_subject": "Solicitud de Cotización (RFQ) – Materiales de Germanio",
               "email_1_content": "UNA sola oración (ice-breaker) hiper-profesional elogiando la sólida reputación o experiencia de la empresa ${cleanEmpresaName} en el mercado. Recuerda: buscas material para TU CLIENTE, no para ti.",
               "email_2_subject": "Re: Solicitud de Cotización (RFQ) – Materiales de Germanio",
               "email_2_content": "Un seguimiento súper corto (2 líneas) preguntando si pudieron revisar la solicitud enviada hace unos días.",
               "email_3_subject": "Actualización: Solicitud de Cotización (RFQ)",
               "email_3_content": "Correo de despedida (Break-Up) indicando que avanzaremos con otras fundiciones/proveedores, pero dejando la puerta abierta."
            }
            `;
         } else if (isImportDiligence) {
            promptText = `
            Eres el Director de Riesgo Forense. Estamos automatizando nuestro acercamiento a la empresa ${cleanEmpresaName}.
            Ellos son importadores o distribuidores del sector ${lead.sector}.
            
            Tu única tarea es redactar UNA oración rompehielo (ice-breaker) extremadamente elegante y personalizada para el prospecto.
            El rompehielo debe reconocer su prestigio en su sector y el hecho de que como importadores internacionales manejan volúmenes críticos que merecen ser protegidos.
            
            Información del Prospecto:
            - Empresa: ${cleanEmpresaName}
            - Contacto: ${lead.nombre_contacto || 'Equipo Directivo'}
            - Rol: ${lead.nota_contacto || 'Directivo'}
            - Sector o Productos: ${lead.sector || lead.nota_empresa || 'importación de bienes internacionales'}
            
            REGLA ESTRICTA DE IDIOMA: DEBES redactar el rompehielo y traducir el sector EXCLUSIVAMENTE en ${languageName}.
            
            Devuelve ÚNICAMENTE un objeto JSON válido, sin formato markdown (\`\`\`).
            
            Estructura JSON estricta requerida:
            {
               "email_1_subject": "SURE: Protección Forense de Capital - ${cleanEmpresaName}",
               "email_1_content": "UNA SOLA ORACIÓN (el ice-breaker en ${languageName}).",
               "translated_sector": "Traduce de forma muy breve (2-4 palabras) el sector '${lead.sector}' al ${languageName}.",
               "email_2_subject": "Re: SURE: Protección Forense de Capital",
               "email_2_content": "Seguimiento corto (2 líneas) en ${languageName}.",
               "email_3_subject": "Cerrando expediente forense: ${cleanEmpresaName}",
               "email_3_content": "Correo de despedida en ${languageName}."
            }
            `;
         } else {
            promptText = `
            Eres un experto redactor de correos B2B corporativos (Cold Emails). Tu tarea es adaptar la siguiente plantilla y condiciones estrictas para este prospecto específico.
            IMPORTANTE: NUNCA uses comodines como "[Your Company Name]". Representas a SURE Ecosystem (o la empresa que se te indique en la plantilla).
            
            MODELO EXACTO Y CONDICIONES (DEBES SEGUIR ESTO AL PIE DE LA LETRA):
            "${campaignGoal || 'Ofrecer los servicios de validación forense de SURE.'}"
            
            ${attachmentUrl ? `\nINSTRUCCIÓN CRÍTICA: Debes incluir el siguiente enlace al final del primer correo indicando que es nuestra Carta de Intención / Documento Oficial: ${attachmentUrl}\n` : ''}

            ADVERTENCIA: No inventes beneficios ni escribas por libre. Adáptate estrictamente a las condiciones, materiales, especificaciones y estilo del modelo proporcionado arriba.
            REGLA DE VARIABLES: REEMPLAZA OBLIGATORIAMENTE cualquier variable o marcador (ej. [contacto], [empresa], [your company]) que esté en el modelo con los datos reales del prospecto. NUNCA dejes corchetes literales [ ] en el correo final.
            REGLA DE DOMINIOS: ESTÁ ESTRICTAMENTE PROHIBIDO incluir extensiones de dominio (.com, .cn, .br, .net, .org, etc.) al escribir el nombre de la empresa, tanto en el Asunto como en el Cuerpo. Usa siempre el nombre limpio (ej. 'Corewise' en lugar de 'corewise.cn').
            
            Información del Prospecto:
            - Empresa: ${cleanEmpresaName}
            - Contacto: ${(!lead.nombre_contacto || lead.nombre_contacto.length <= 4 || /^(ltd|inc|co|llc)/i.test(lead.nombre_contacto.replace(/[^a-zA-Z]/g, ''))) ? 'VACÍO' : lead.nombre_contacto}
            - Sector: ${lead.sector}
            - Email/Dominio: ${lead.email}

            REGLAS ESTRICTAS DE IDIOMA:
            1. Analiza el dominio del correo y el nombre de la empresa.
            2. Si el dominio termina en .br o la empresa es de Brasil -> Escribe obligatoriamente en PORTUGUÉS (traduce el modelo al portugués corporativo).
            3. Si la empresa es de España o Latinoamérica -> Escribe en ESPAÑOL.
            4. CRÍTICO: Para cualquier otro país (China, India, USA, Europa), o si NO TIENES 100% DE CERTEZA absoluta, usa el MODELO EN INGLÉS. No uses español si tienes dudas.

            Genera una SECUENCIA DE 3 CORREOS (Drip Campaign). Adapta y traduce el contenido al idioma seleccionado según las reglas anteriores.
            Devuelve ÚNICAMENTE un objeto JSON válido, sin formato markdown (\`\`\`), sin texto adicional.
            
            Estructura JSON estricta requerida:
            {
               "email_1_subject": "[Asunto B2B elegante y consultivo. PROHIBIDO usar palabras como 'Riesgo', 'Fraude', 'Pagos', 'Facturas', 'Vulnerabilidad' (o sus traducciones: Risk, Fraud, Payment, Invoice). El asunto DEBE enfocarse EXCLUSIVAMENTE en 'Sistemas de Comunicación' o 'Infraestructura Digital' (ej: 'Consulta sobre infraestructura de comunicaciones de [Empresa]' o 'Revisión de protocolos corporativos en [Empresa]')]",
               "email_1_content": "[Cuerpo del primer correo. REGLAS OBLIGATORIAS: 1. Empieza SIEMPRE con un saludo corporativo elegante (ej: 'Estimado/a [Nombre]' o 'Good morning [Name]'). Si el nombre está vacío, usa el nombre de la empresa limpio SIN el .com (ej: 'Hola equipo de ${cleanEmpresaName}' o 'Hello ${cleanEmpresaName} Team'). ESTÁ ESTRICTAMENTE PROHIBIDO INCLUIR EXTENSIONES COMO .com, .br, .net, etc. EN EL SALUDO. 2. PON UN DOBLE SALTO DE LÍNEA ('\\n\\n') inmediatamente después del saludo. 3. Usa '\\n\\n' para separar todos los párrafos y darle mucho respiro visual al texto.]",
               "email_2_subject": "Re: [Asunto del primer correo]",
               "email_2_content": "[Seguimiento corto de 3 líneas preguntando amablemente si pudieron leer el correo anterior.]",
               "email_3_subject": "Cerrando el expediente: [Asunto del primer correo]",
               "email_3_content": "[Correo de despedida profesional. Genera escasez. Diles que asumes que no es el momento y que cerrarás su expediente, pero que quedas a disposición.]"
            }
            `;
         }

         const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: [{ role: 'user', parts: [{ text: promptText }] }],
           config: { responseMimeType: "application/json" }
         });

         const text = response.text || '{}';
         let parsedEmails: any = {};
         
         try {
             parsedEmails = JSON.parse(text);
         } catch (e) {
             console.warn("Fallo al parsear JSON, usando respaldo.");
             parsedEmails = {
                 email_1_subject: "SURE: Oportunidad Estratégica",
                 email_1_content: text.substring(0, 200),
                 email_2_subject: "Re: SURE: Seguimiento",
                 email_2_content: "¿Pudo revisar mi correo anterior?",
                 email_3_subject: "Cerrando expediente",
                 email_3_content: "Asumo que no es el momento. Saludos."
             };
         }
         
         if (isGermaniumRFQ) {
            subject = parsedEmails.email_1_subject || "Request for Quotation (RFQ)";
            const ice_breaker = parsedEmails.email_1_content || "Esperamos establecer una relación comercial.";
            htmlBody = generateGermaniumRFQHtml({
                nombre_contacto: lead.nombre_contacto || 'Team',
                nombre_empresa: lead.empresa || 'your company',
                ice_breaker: ice_breaker,
                language: languageCode as 'es'|'pt'|'en'
            });
            emailContentText = htmlBody; 
         } else if (isImportDiligence) {
            subject = parsedEmails.email_1_subject || "SURE: Cadena de Suministro";
            const ice_breaker = parsedEmails.email_1_content || "Le escribo por su volumen de importaciones.";
            htmlBody = generateImportDiligenceHtml({
                nombre_contacto: lead.nombre_contacto || 'Equipo Directivo',
                nombre_empresa: cleanEmpresaName,
                productos_importados: parsedEmails.translated_sector || lead.sector || 'bienes internacionales',
                ice_breaker: ice_breaker,
                language: languageCode as 'es'|'pt'|'en'
            });
            emailContentText = htmlBody;
         } else {
            subject = parsedEmails.email_1_subject || "SURE: Oportunidad";
            emailContentText = parsedEmails.email_1_content || "Cuerpo vacío.";
         }

         // Update Lead in Supabase to DRAFT state with all 3 emails
         const { error: dbError } = await supabaseAdmin
            .from('leads_campaign')
            .update({
               status: 'DRAFT',
               email_1_subject: subject,
               email_1_content: emailContentText,
               email_2_subject: parsedEmails.email_2_subject || "Seguimiento",
               email_2_content: parsedEmails.email_2_content || "Revisión pendiente.",
               email_3_subject: parsedEmails.email_3_subject || "Último aviso",
               email_3_content: parsedEmails.email_3_content || "Despedida.",
               drip_step: 0
            })
            .eq('id', lead.id);

         if (dbError) {
             throw new Error(`Error BD guardando borrador: ${dbError.message}`);
         }

         sentCount++;
      } catch (err: any) {
         console.error(`Error procesando lead ${lead.email}:`, err);
         fallos.push(err.message || String(err));
      }
    }));

    if (fallos.length > 0) {
       return NextResponse.json({ error: fallos.join(' | ') }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error: any) {
    console.error("Batch Campaign Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
