const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

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

const promptText = `
Eres un experto redactor de correos B2B corporativos (Cold Emails). Tu tarea es adaptar la siguiente plantilla del proyecto de Medidores Inteligentes ANSI para este prospecto específico.

PLANTILLA A ADAPTAR:
"""
${metersTemplate}
"""

Información del Prospecto:
- Empresa: SALZER ELECTRONICS
- Contacto (Nombre completo): Rajesh Doraiswamy
- Rol o Cargo en LinkedIn: Fabricantes de Medidores Inteligentes
- Sector o Productos: Fabricantes de Medidores Inteligentes

REGLAS DE ADAPTACIÓN:
1. Saludo inicial:
   - Si el Contacto no es 'VACÍO', usa un saludo formal en inglés usando su apellido (ej: 'Dear Mr. Liu,' o 'Dear Allen Liu,').
   - Si el Contacto es 'VACÍO', usa el cargo/rol del prospecto (ej: 'Dear LATAM Sales Manager,' o 'Dear Sales Manager,') si es coherente. Si no, usa 'Dear Sales Team at SALZER ELECTRONICS,'.
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

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192
      }
    });

    console.log("=== RAW TEXT FROM GEMINI ===");
    console.log(response.text);
    console.log("============================");

    try {
      const parsed = JSON.parse(response.text);
      console.log("JSON.parse succeeded!");
    } catch (e) {
      console.error("JSON.parse FAILED:", e.message);
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}

main();
