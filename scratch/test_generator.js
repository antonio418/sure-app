const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });
const { GoogleGenAI } = require('@google/genai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  const ai = new GoogleGenAI({ apiKey });
  const projectId = 'ac1284eb-9763-48d7-9fdc-7c4d4571fd88';

  // Fetch one lead from this project
  const leadRes = await fetch(`${supabaseUrl}/rest/v1/leads_campaign?project_id=eq.${projectId}&limit=1`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });
  if (!leadRes.ok) {
     console.error("Lead Fetch Error:", await leadRes.text());
     return;
  }
  const leads = await leadRes.json();
  if (leads.length === 0) {
     console.log("No leads found for project.");
     return;
  }
  const lead = leads[0];
  console.log("Selected Lead for Test:", {
    id: lead.id,
    nombre_contacto: lead.nombre_contacto,
    empresa: lead.empresa,
    email: lead.email,
    sector: lead.sector
  });

  const projectName = 'Medidores Inteligentes CNEL EP';
  const campaignGoal = 'Búsqueda de proveedores y cotizaciones para 11,371 medidores inteligentes ANSI AMI para el proyecto CNEL EP Ecuador.';

  // Run our route logic
  const isMetersProject = 
    /medidor|meter|cnel|ecuador|ansi/i.test(projectName || '') ||
    /medidor|meter|cnel|ecuador|ansi/i.test(campaignGoal || '');

  const isSpanish = /español|espanol|spanish/i.test(campaignGoal || '');
  const isPortuguese = /portugués|portugues|portuguese/i.test(campaignGoal || '');
  const isLithuanian = /gerb|laba diena|marija ai|odontologijos|klinika|šypsenos/i.test(campaignGoal || '');
  
  const isImportDiligence = !isLithuanian && !isMetersProject && (/import|mid-market|\brma\b|distribuidor/i.test(campaignGoal || '') || /import|mid-market|\brma\b|distribuidor/i.test(projectName || ''));
  const isProcdiProject = 
    isMetersProject ||
    /clinica|clínica|medical|kaun|vilniu|marija|procdi|odontolog|dant|lietuva/i.test(projectName || '') ||
    /clinica|clínica|medical|kaun|vilniu|marija|procdi|odontolog|dant|lietuva|antonio@procdi\.com/i.test(campaignGoal || '');
  
  const cleanEmpresaName = (lead.empresa || '').replace(/\.(com|co|net|org|io|ai|biz|info|us|uk|br|cn|in|de|fr|es|it|jp|ru|au)(\.[a-z]{2})?$/i, '').trim().toUpperCase() || 'TEAM';

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

  let promptText = `
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

  console.log("GENERATING CONTENT...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    config: { responseMimeType: "application/json" }
  });

  const text = response.text || '{}';
  console.log("RAW RESPONSE:", text);
  try {
     const parsed = JSON.parse(text);
     console.log("SUBJECT 1:", parsed.email_1_subject);
     console.log("CONTENT 1:\n", parsed.email_1_content);
     console.log("------------------------");
     console.log("SUBJECT 2:", parsed.email_2_subject);
     console.log("CONTENT 2:\n", parsed.email_2_content);
     console.log("------------------------");
     console.log("SUBJECT 3:", parsed.email_3_subject);
     console.log("CONTENT 3:\n", parsed.email_3_content);
  } catch (err) {
     console.error("JSON Parse Error:", err);
  }
}

test();
