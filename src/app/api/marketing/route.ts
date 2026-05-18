import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { MARKETING_PROMPT } from '@/lib/agents/marketing';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Google Gemini.' }, { status: 500 });
    }

    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Falta el tema (topic).' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let response;
    let retries = 2;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: topic,
          config: {
            systemInstruction: MARKETING_PROMPT,
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        });
        break; // Éxito, salir del loop
      } catch (e: any) {
        retries--;
        console.warn(`Gemini API Error. Retries left: ${retries}`, e.message);
        if (retries === 0) {
           return NextResponse.json({ error: 'Google Gemini servers are currently overloaded (Error 503). Please try again in 1 minute.' }, { status: 503 });
        }
        // Esperar 2 segundos antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!response) {
      throw new Error("No se pudo obtener respuesta de la Inteligencia Artificial después de múltiples intentos.");
    }

    let rawText = response.text;
    if (!rawText) throw new Error("Respuesta vacía de Gemini");

    // Clean JSON if it has markdown formatting
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }

    const parsedJson = JSON.parse(rawText.trim());

    return NextResponse.json({ posts: parsedJson });

  } catch (error: any) {
    console.error('Error in marketing API:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
