import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';
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
      const isMetersProject = 
        /medidor|meter|cnel|ecuador|ansi/i.test(projectName || '') ||
        /medidor|meter|cnel|ecuador|ansi/i.test(campaignGoal || '');

      const isSpanish = /español|espanol|spanish/i.test(campaignGoal || '');
      const isPortuguese = /portugués|portugues|portuguese/i.test(campaignGoal || '');
      const isLithuanian = /gerb|laba diena|marija ai|odontologijos|klinika|šypsenos/i.test(campaignGoal || '');
      
      const isImportDiligence = !isLithuanian && !isMetersProject && (/import|mid-market|\brma\b|distribuidor/i.test(campaignGoal || '') || /import|mid-market|\brma\b|distribuidor/i.test(projectName || ''));
      const isDNSProject = /dns/i.test(projectName || '') || /dns/i.test(campaignGoal || '');
      const isProcdiProject = 
        isMetersProject ||
        /clinica|clínica|medical|kaun|vilniu|marija|procdi|odontolog|dant|lietuva/i.test(projectName || '') ||
        /clinica|clínica|medical|kaun|vilniu|marija|procdi|odontolog|dant|lietuva|antonio@procdi\.com/i.test(campaignGoal || '');
      
      const languageCode = isSpanish ? 'es' : (isPortuguese ? 'pt' : (isLithuanian ? 'lt' : 'en'));
      const languageName = isSpanish ? 'ESPAÑOL' : (isPortuguese ? 'PORTUGUÉS' : (isLithuanian ? 'LITUANO' : 'INGLÉS'));

      const cleanEmpresaName = (lead.empresa || '').replace(/\.(com|co|net|org|io|ai|biz|info|us|uk|br|cn|in|de|fr|es|it|jp|ru|au)(\.[a-z]{2})?$/i, '').trim().toUpperCase() || 'TEAM';

      let subject = "SURE: Oportunidad Estratégica";
      let body = `Estimado ${lead.nombre_contacto || 'Equipo Directivo'},\n\nNos ponemos en contacto en relación a sus operaciones en el sector de ${lead.sector}.\n\nAtentamente,\nSURE Ecosystem`;
      let emailContentText = body; 
      let htmlBody: string | undefined = undefined;

      try {
         let promptText = "";
         if (isMetersProject) {
            const metersTemplate = `Dear [Contact Person],
I hope this email finds you well.

Our company is currently managing the technical integration and sourcing package for a bidding consortium preparing a turnkey proposal for a major smart grid expansion project for a leading utility in South America, encompassing the supply of approx. 12,000 advanced ANSI smart electricity meters with integrated 4G LTE telemetry.

We are conducting a preliminary sourcing process to select a reliable technology partner/manufacturer to supply the meters and provide technical backing for our bid. We are looking to establish an exclusive partnership for this specific opportunity with a manufacturer that can comply with the following critical requirements:

1. ANSI Standard Portfolio: Full compliance with ANSI C12.1, C12.10, C12.18, and C12.19. We require Form 2S (with disconnect), Form 3S, Form 4S, Form 9S, Form 12S (with disconnect), and Form 16S.
2. Telecommunications: Integrated 4G LTE communication module supporting bands compatible with South American carriers (including B2, B4, B8, and B28) concurrently, with fallback to 3G/2G. Fully internal antenna with gain >= +3 dBi and efficiency > 60%.
3. Interoperability: Willingness to support and certify compatibility with major HES platforms (including Trilliant and Honeywell NetSense).
4. Physical Design: 3.6 V Lithium battery for RTC, which must be fully accessible and replaceable from an external socket/compartment without breaking the main metrological enclosure seals.
5. Commercial & Logistics: 60-month factory warranty and standard industrial palletization.

Please note that to protect our bidding consortium's position, the exact name of the utility, country coordinates, and detailed bill of quantities will only be disclosed under a mutual Non-Disclosure and Non-Circumvention Agreement (NDA/NCND).

Please let us know if your company has ANSI C12 certified models that meet these requirements and if you are interested in discussing an exclusive partnership and price quotation under NDA.

We look forward to your prompt response.

Best regards,

Antonio Baronas
Sourcing Integration Team | PROCDI
Ph: +37068941110
e-mail: antonio@procdi.com

Company code: 307515454
Partizanų g. 61-806, LT-49282
Kaunas, Lithuania`;

            promptText = `
            Eres un experto redactor de correos B2B corporativos (Cold Emails). Tu tarea es adaptar la siguiente plantilla del proyecto de Medidores Inteligentes ANSI para este prospecto específico.
            
            PLANTILLA A ADAPTAR:
            """
            ${metersTemplate}
            """
            
            Información del Prospecto:
            - Empresa: ${cleanEmpresaName}
            - Contacto (Nombre completo): ${(!lead.nombre_contacto || lead.nombre_contacto.length <= 4 || /^(ltd|inc|co|llc)/i.test(lead.nombre_contacto.replace(/[^a-zA-Z]/g, ''))) ? 'VACÍO' : lead.nombre_contacto}
            - Rol o Cargo en LinkedIn: ${lead.nota_contacto || 'VACÍO'}
            - Sector o Productos: ${lead.sector || 'Smart Meters'}
            
            REGLAS DE ADAPTACIÓN:
            1. Saludo inicial:
               - Si el Contacto no es 'VACÍO', usa un saludo formal en inglés usando su apellido (ej: 'Dear Mr. Liu,' o 'Dear Allen Liu,').
               - Si el Contacto es 'VACÍO', usa el cargo/rol del prospecto (ej: 'Dear LATAM Sales Manager,' o 'Dear Sales Manager,') si es coherente. Si no, usa 'Dear Sales Team at ${cleanEmpresaName},'.
               - NUNCA dejes corchetes o marcadores como '[Contact Person]' o '[Nombre del Contacto C-Level / LATAM Sales Manager]'. El saludo final resultante debe ser 100% limpio y de apariencia humana.
            2. Cuerpo del correo: Manten las especificaciones técnicas (las 5 especificaciones completas: ANSI standard, 4G LTE, HES interoperability, external battery compartment, 60-month warranty) y el texto exactamente igual que en la plantilla. No inventes otros requisitos ni borres estos.
            3. Asunto: Crea un asunto profesional en inglés que no sea genérico y capte el interés (ej: "Sourcing of ANSI Smart Meters - exclusive partnership for South American utility bid").
            4. Genera también el correo 2 (seguimiento corto en inglés de 2-3 líneas) y el correo 3 (cierre respetuoso de 2-3 líneas en inglés).
            
            Devuelve ÚNICAMENTE un objeto JSON válido, sin formato markdown (\`\`\`), sin texto adicional.
            
            Estructura JSON estricta requerida:
            {
               "email_1_subject": "Sourcing of ANSI Smart Meters - Partnership with [Empresa limpia]",
               "email_1_content": "[Cuerpo adaptado del correo 1, incluyendo la firma completa de Antonio Baronas al final exactamente como en la plantilla]",
               "email_2_subject": "Re: Sourcing of ANSI Smart Meters - Partnership with [Empresa limpia]",
               "email_2_content": "[Cuerpo del correo 2 en inglés, preguntando brevemente si pudieron revisar la propuesta de los 12,000 medidores ANSI]",
               "email_3_subject": "Closing project sourcing: Sourcing of ANSI Smart Meters",
               "email_3_content": "[Cuerpo del correo 3 en inglés de despedida, indicando amablemente que cerramos el expediente por falta de contacto]"
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
            1. Analiza el idioma del "MODELO EXACTO Y CONDICIONES" proporcionado arriba por el usuario. Si el modelo/plantilla del usuario está escrito en LITUANO (LIETUVIŲ), se establece el lituano como idioma maestro absoluto. DEBES escribir toda la secuencia de 3 correos (Asuntos y Cuerpos de Email 1, 2 y 3) OBLIGATORIAMENTE en LITUANO formal, adaptándolo de manera natural para la clínica lituana.
            2. De lo contrario (si el modelo original está en inglés o español), analiza el dominio del correo y procedencia:
            3. Si el dominio termina en .br o la empresa es de Brasil -> Escribe obligatoria o alternativamente en PORTUGUÉS (traduce el modelo al portugués corporativo).
            4. Si la empresa es de España o Latinoamérica -> Escribe en ESPAÑOL.
            5. CRÍTICO: Para cualquier otro país (China, India, USA, Europa), o si NO TIENES 100% DE CERTEZA absoluta, usa el MODELO EN INGLÉS. No uses español si tienes dudas.

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
           model: 'gemini-3.5-flash',
           contents: [{ role: 'user', parts: [{ text: promptText }] }],
           config: {
             responseMimeType: "application/json",
             maxOutputTokens: 8192
           }
         });

         let rawText = response.text || '{}';
         let parsedEmails: any = {};
         
         // Extracción robusta de JSON de bloques markdown
         const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/```\s*([\s\S]*?)\s*```/);
         if (jsonMatch) {
           rawText = jsonMatch[1];
         }

         // Buscamos específicamente el objeto { ... }
         const objStart = rawText.indexOf('{');
         const objEnd = rawText.lastIndexOf('}');
         if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
           rawText = rawText.substring(objStart, objEnd + 1);
         }
         
         try {
             parsedEmails = JSON.parse(rawText.trim());
         } catch (e) {
             console.warn("Fallo al parsear JSON, usando respaldo.");
             parsedEmails = {
                 email_1_subject: "SURE: Oportunidad Estratégica",
                 email_1_content: rawText,
                 email_2_subject: "Re: SURE: Seguimiento",
                 email_2_content: "¿Pudo revisar mi correo anterior?",
                 email_3_subject: "Cerrando expediente",
                 email_3_content: "Asumo que no es el momento. Saludos."
             };
         }
         
         if (isImportDiligence) {
            subject = parsedEmails.email_1_subject || "SURE: Cadena de Suministro";
            const ice_breaker = parsedEmails.email_1_content || "Le escribo por su volumen de importaciones.";
            htmlBody = generateImportDiligenceHtml({
                nombre_contacto: lead.nombre_contacto || 'Equipo Directivo',
                nombre_empresa: cleanEmpresaName,
                productos_importados: parsedEmails.translated_sector || lead.sector || 'bienes internacionales',
                ice_breaker: ice_breaker,
                language: languageCode as 'es'|'pt'|'en',
                isProcdi: isProcdiProject
            });
            emailContentText = htmlBody;
         } else {
            subject = parsedEmails.email_1_subject || "SURE: Oportunidad";
            let emailContentTextRaw = parsedEmails.email_1_content || "Cuerpo vacío.";
            if (isProcdiProject) {
               const signature = `\n\nBest regards,\n\nAntonio Baronas\nSourcing Integration Team | PROCDI\nPh: +37068941110\ne-mail: antonio@procdi.com\n\nCompany code: 307515454\nPartizanų g. 61-806, LT-49282\nKaunas, Lithuania`;
               if (!emailContentTextRaw.includes('antonio@procdi.com') && !emailContentTextRaw.includes('Antonio Baronas')) {
                  emailContentTextRaw = emailContentTextRaw + signature;
               }
            }
            emailContentText = emailContentTextRaw;
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
