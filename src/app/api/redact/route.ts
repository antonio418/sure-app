import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Anthropic' }, { status: 500 });
    }
    const anthropic = new Anthropic({ apiKey });
    const { reportJSON } = await req.json();

    if (!reportJSON) {
      return NextResponse.json({ error: 'Falta el reporte a redactar' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6", // Using the same model as analysis to ensure large context window
      max_tokens: 8192,
      temperature: 0,
      system: `You are an expert Data Privacy Officer. Your task is to take a JSON forensic report and output the EXACT SAME JSON structure, but perfectly REDACT all sensitive information. 
- Replace all specific company names, physical addresses, bank details, SWIFT codes, names of individuals, phone numbers, emails, and website domains with '[REDACTED]'.
- Do not change the keys of the JSON or the general array structure.
- Do not change the analysis logic, findings, or severity labels. ONLY censor the sensitive nouns/data.
- Output ONLY valid JSON, without markdown formatting or wrappers.`,
      messages: [
        {
          role: "user",
          content: JSON.stringify(reportJSON)
        }
      ]
    });

    const outputText = (response.content[0] as any).text;
    const cleanJsonString = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
    const redactedJSON = JSON.parse(cleanJsonString);

    return NextResponse.json({ redactedReport: redactedJSON });

  } catch (error: any) {
    console.error("Error en AI Redaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
