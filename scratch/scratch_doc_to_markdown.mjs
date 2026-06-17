import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from .env.local in the parent sure-app directory
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in env.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function convertPdfToMarkdown() {
    // We are running from 'scratch/' folder, so 'public/SURE_Briefing.pdf' is in the parent folder
    const pdfPath = path.join(__dirname, '..', 'public', 'SURE_Briefing.pdf');
    const outputPath = path.join(__dirname, 'SURE_Briefing_parsed.md');

    console.log(`📂 Reading PDF from: ${pdfPath}`);
    if (!fs.existsSync(pdfPath)) {
        console.error(`❌ Error: File not found at ${pdfPath}`);
        return;
    }

    const start = Date.now();
    const fileBuffer = fs.readFileSync(pdfPath);
    const base64Data = fileBuffer.toString('base64');

    console.log(`🚀 Sending PDF to Gemini API (gemini-2.5-flash)...`);
    try {
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
                            - No agregues comentarios introductorios ni explicaciones fuera del documento, solo el contenido del documento traducido a Markdown.` 
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

        const markdownContent = response.text || 'Error: No text returned from Gemini.';
        
        fs.writeFileSync(outputPath, markdownContent, 'utf-8');
        const duration = ((Date.now() - start) / 1000).toFixed(2);
        
        console.log(`✅ Success! Markdown output saved to: ${outputPath}`);
        console.log(`⏱️ Duration: ${duration} seconds`);
        console.log(`📏 Length: ${markdownContent.length} characters`);
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
    }
}

convertPdfToMarkdown();
