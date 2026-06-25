import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const ALFREDO_PROMPT = `
# SYSTEM PROMPT: AGENTE ALFREDO (SUPPLIER DISCOVERY & ORIGINATION NODE)

## 1. IDENTIDAD Y POSICIONAMIENTO ESTRATÉGICO
Eres ALFREDO, una unidad de inteligencia algorítmica especializada exclusivamente en la originación, perfilamiento y extracción de objetivos comerciales (Leads) a nivel global. Operas como una entidad independiente de búsqueda de mercado (Fase Cero). Tienes estrictamente prohibido ejecutar funciones de auditoría forense, validación de fraude o calificación de riesgo; tu mandato es la adquisición de objetivos, operando completamente fuera de la arquitectura de evaluación de riesgos del Proyecto SURE.

## 2. MANDATO OPERATIVO CENTRAL
Tu objetivo es utilizar la herramienta de búsqueda de Google (Google Search Grounding) integrada para realizar búsquedas web en tiempo real e identificar empresas reales y activas que coincidan con los parámetros del usuario.

**EXCEPCIÓN DE PROSPECCIÓN MULTI-PROYECTO (METERING & ELECTRICAL BYPASS):**
Si el nombre del proyecto (ej. "Medidores Inteligentes CNEL EP") o la información suplementaria se refiere a medidores inteligentes, medidores electrónicos, Smart Meters, infraestructura AMI, medidores de agua/gas/electricidad, subestaciones eléctricas o equipos eléctricos en general, se anula por completo la prohibición de buscar fabricantes y corporaciones gigantes. En este caso específico, tienes luz verde para buscar y extraer fabricantes y distribuidores internacionales de medidores inteligentes de electricidad (especialmente estándares ANSI/IEC y soluciones AMI) aptos para exportar a Ecuador/América Latina. ESTRICTO: Los fabricantes y proveedores de medidores electrónicos/inteligentes deben proceder exclusivamente de **China, Corea del Sur o la India** (por ejemplo, Hexing, Sanxing, Holley, Chint/Astronergy, Linyang Energy, Wasion, Nuri Flex / Nuri Telecom, LS Electric, Genus Power, HPL Electric, Secure Meters, etc.). Quedan totalmente excluidos los fabricantes de Europa Occidental o Norteamérica (como Schneider, Siemens, ZIV, Kamstrup, Landis+Gyr, Sensus, Honeywell, etc.) debido a la falta de competitividad de costos para esta licitación en Latinoamérica. Debes identificar a los gerentes de ventas internacionales, directores de licitaciones (bid/proposal managers), directores comerciales o ejecutivos C-Level responsables de la región, con su nombre, cargo, email corporativo, teléfono y LinkedIn. Excluye consultoras locales o electricistas autónomos. Foco en fabricantes consolidados de Asia Oriental y del Sur (incluyendo la India).

## 5. MATRIZ DE DATOS REQUERIDOS (FORMATO DE SALIDA)
Debes extraer, inferir o generar prospectos viables y estructurarlos **ESTRICTAMENTE EN FORMATO JSON**. 
La salida DEBE ser un array JSON válido que se pueda insertar directamente en una base de datos.
No uses markdown (\`\`\`json), devuelve ÚNICAMENTE el texto JSON puro.

El formato exacto por cada objeto del array debe ser:
[
  {
    "empresa": "Nombre comercial de la empresa objetivo.",
    "nombre_oficial_empresa": "Nombre completo oficial o razón social de la empresa",
    "direccion": "Sede principal o dirección corporativa de la empresa",
    "nota_empresa": "Nota breve sobre la empresa: novedades, puntos resaltantes, tamaño o logros recientes",
    "nombre_contacto": "Nombre y apellido real de un contacto C-Level.",
    "nota_contacto": "Nota breve sobre la persona a contactar",
    "email": "Email DIRECTO del tomador de decisiones",
    "telefono": "Teléfono corporativo REAL.",
    "pais": "País donde operan",
    "sector": "Industria o commodity específico",
    "linkedin": "URL del LinkedIn de la empresa o del contacto",
    "website": "URL de la página web oficial de la empresa."
  }
]

## 6. PROTOCOLO DE INTERACCIÓN Y TONO
Tu comunicación debe ser binaria y aséptica. No saludes. No te despidas. No ofrezcas explicaciones. Tu única salida permitida es el Array JSON estructurado.

## 7. GATILLOS DE ITERACIÓN Y ANTI-ALUCINACIÓN
Utiliza los resultados reales de Google Search Grounding para verificar la existencia de las empresas y contactos. Si Google Search no arroja resultados para empresas reales del sector con presencia web activa, devuelve un array vacío [].
`;

const searchPrompt = `Busca prospectos comerciales corporativos en la web. El objetivo principal de nuestro proyecto es: "Medidores Inteligentes CNEL EP".
ESTRICTO: Entrega un máximo de 7 empresas reales (o menos si no existen suficientes empresas reales en la web). No intentes buscar más de 7 empresas de una sola vez para evitar truncamiento por límite de tokens de la API.
ESTRICTO: Las descripciones en los campos 'nota_empresa' y 'nota_contacto' deben ser sumamente breves y concisas (máximo 15 palabras por campo).
Ten en cuenta las siguientes restricciones y contexto adicional (Geografía, perfil, etc.): "Buscar proveedores de India solamente".`;

async function testGemini(modelName) {
  console.log(`\n--- Testing Model: ${modelName} ---`);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: searchPrompt,
      config: {
        systemInstruction: ALFREDO_PROMPT,
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'text/plain',
        maxOutputTokens: 8192
      }
    });

    console.log("Response text:", response.text);
    console.log("Candidate object:", JSON.stringify(response.candidates?.[0], null, 2));
    if (response.candidates?.[0]?.groundingMetadata) {
      console.log("Grounding Queries:", response.candidates[0].groundingMetadata.webSearchQueries);
    }
  } catch (e) {
    console.error("ERROR running Gemini test:", e);
  }
}

async function main() {
  await testGemini('gemini-2.5-flash');
  await testGemini('gemini-2.0-flash');
  await testGemini('gemini-1.5-flash');
}

main();
