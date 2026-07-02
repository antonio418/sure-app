import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 45; // Límite de tiempo para la traducción

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Anthropic en el servidor.' }, { status: 500 });
    }

    const { language, uiData } = await req.json();

    if (!language || !uiData) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: language o uiData.' }, { status: 400 });
    }

    // Si es español, no requerimos traducir y retornamos el original
    if (language.toLowerCase() === 'español' || language.toLowerCase() === 'spanish' || language.toLowerCase() === 'es') {
      return NextResponse.json({ success: true, translatedUi: uiData });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a professional translator. Translate the values of the provided JSON object into the target language.
Target Language: ${language}

Strict Rules:
- DO NOT translate or modify the keys of the JSON object. Only translate the text values.
- Keep the exact JSON structure.
- Output ONLY valid JSON. Do not write any markdown code block wrappers (like \`\`\`json), explanations, or prefaces. Return the raw JSON string directly.
- Maintain formatting like tags, lists, emojis, and specific terms.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: JSON.stringify(uiData)
        }
      ]
    });

    const outputText = (response.content[0] as any).text.trim();
    
    // Limpiar posibles bloques de código que retorne a pesar del prompt
    let cleanJsonString = outputText.trim();
    if (cleanJsonString.startsWith('```json')) {
      cleanJsonString = cleanJsonString.slice(7);
    } else if (cleanJsonString.startsWith('```')) {
      cleanJsonString = cleanJsonString.slice(3);
    }
    if (cleanJsonString.endsWith('```')) {
      cleanJsonString = cleanJsonString.slice(0, -3);
    }
    cleanJsonString = cleanJsonString.trim();

    const translatedUi = JSON.parse(cleanJsonString);

    return NextResponse.json({ success: true, translatedUi });

  } catch (error: any) {
    console.error("Error en API de traducción de interfaz:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
