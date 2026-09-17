import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import officeparser from 'officeparser';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const maxDuration = 60; // Max duration for Vercel/serverless execution

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let buffer: Buffer;
    let fileName: string;
    let fileSize: number;

    if (contentType.includes('application/json')) {
      // NUEVO FLUJO: el archivo ya fue subido directo a Supabase Storage.
      // Aquí solo recibimos la referencia (filePath), sin límite de 4.5MB.
      const { filePath, fileName: originalName } = await req.json();

      if (!filePath || !originalName) {
        return NextResponse.json({ error: 'Falta filePath o fileName.' }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin.storage
        .from('temp_dossiers')
        .download(filePath);

      if (error || !data) {
        return NextResponse.json(
          { error: `No se pudo descargar el archivo: ${error?.message}` },
          { status: 500 }
        );
      }

      const arrayBuffer = await data.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileName = originalName;
      fileSize = buffer.length;

      // Limpieza del temporal (no bloqueante si falla)
      supabaseAdmin.storage.from('temp_dossiers').remove([filePath]).catch(() => {});
    } else {
      // FLUJO ANTIGUO (compatibilidad hacia atrás): archivo pequeño enviado
      // directo en el body del request. Sigue sujeto al límite de Vercel (~4.5MB).
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No se ha proporcionado ningún archivo.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileName = file.name;
      fileSize = file.size;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la clave de API de Gemini (GEMINI_API_KEY).' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    let markdown = '';

    console.log(`[DocuProcessor] Processing file: ${fileName} (${fileSize} bytes) with extension ${fileExtension}`);

    if (fileExtension === '.pdf') {
      const base64Data = buffer.toString('base64');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Lee este documento PDF y extrae todo su contenido de texto de forma estructurada a formato Markdown limpio.
- Si contiene tablas, conviértelas a tablas de Markdown (| Columna 1 | Columna 2 |).
- Conserva la jerarquía de títulos (#, ##, ###), listas y viñetas de forma exacta.
- No agregues comentarios introductorios ni explicaciones fuera del documento, solo el contenido del documento en formato Markdown.
- Mantén el idioma original del documento.`
              },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: 'application/pdf'
                }
              }
            ]
          }
        ]
      });

      markdown = response.text || '';
    } else if (['.txt', '.md', '.csv'].includes(fileExtension)) {
      const rawText = buffer.toString('utf-8');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Toma el siguiente texto plano y estructúralo en formato Markdown limpio y profesional.
- Conserva toda la información del documento original.
- Si hay tablas representadas con texto, conviértelas a tablas de Markdown.
- Organiza los títulos y listas de forma lógica.
- No agregues introducciones ni explicaciones, devuelve únicamente el Markdown estructurado.

TEXTO ORIGINAL:
${rawText}`
              }
            ]
          }
        ]
      });

      markdown = response.text || '';
    } else if (['.docx', '.xlsx', '.pptx', '.rtf'].includes(fileExtension)) {
      console.log(`[DocuProcessor] Extracting text from ${fileExtension} file locally using officeparser...`);
      const ast = await officeparser.parseOffice(buffer);
      const extractedText = typeof ast.toText === 'function' ? ast.toText() : '';

      if (!extractedText || extractedText.trim() === '') {
        return NextResponse.json({ error: 'No se pudo extraer texto legible de este documento de oficina.' }, { status: 422 });
      }

      console.log(`[DocuProcessor] Extracted ${extractedText.length} characters of text. Sending to Gemini for Markdown formatting...`);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `El siguiente texto ha sido extraído de un archivo de oficina (${fileExtension.toUpperCase()}). Reestructúralo en un documento Markdown limpio, legible y bien formateado.
- Si detectas tablas, datos estructurados o listas de especificaciones, conviértelas a tablas de Markdown (| Columna 1 | Columna 2 |) o listas estructuradas.
- Conserva la jerarquía de títulos, listas y viñetas de forma lógica y exacta.
- No agregues comentarios introductorios, explicaciones ni preámbulos, devuelve únicamente el contenido del documento en Markdown.
- Mantén el idioma original del documento.

TEXTO EXTRAÍDO:
${extractedText}`
              }
            ]
          }
        ]
      });

      markdown = response.text || '';
    } else {
      return NextResponse.json({ error: `Formato de archivo no soportado: ${fileExtension}` }, { status: 400 });
    }

    // Clean up markdown block wraps if model returned them (e.g. ```markdown ... ```)
    markdown = markdown.replace(/^```markdown\n/, '').replace(/\n```$/, '').trim();

    return NextResponse.json({
      success: true,
      name: fileName,
      size: fileSize,
      extension: fileExtension,
      markdown: markdown
    });

  } catch (error: any) {
    console.error('[DocuProcessor] Error processing file:', error);
    return NextResponse.json({
      error: error.message || 'Error interno al procesar el archivo.'
    }, { status: 500 });
  }
}