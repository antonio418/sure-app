import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in env.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function testDocx() {
    const docxPath = 'C:\\Users\\anton_mn7up\\Downloads\\Documents\\01_RFQ_American_Elements.docx';
    
    if (!fs.existsSync(docxPath)) {
        console.error(`❌ File not found at ${docxPath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(docxPath);
    const base64Data = fileBuffer.toString('base64');

    console.log("🚀 Sending DOCX file to Gemini API...");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { 
                            text: "Extract all text from this Word document and format it as clean Markdown. Preserve all structure, headings, lists, and tables." 
                        },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            }
                        }
                    ]
                }
            ]
        });

        console.log("✅ Success! Gemini response received:");
        console.log(response.text?.substring(0, 1000) + "\n...");
    } catch (error) {
        console.error("❌ Failed to parse DOCX directly:", error);
    }
}

testDocx();
