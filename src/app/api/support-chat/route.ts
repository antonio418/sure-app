import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Load QA Database at boot
const qaPath = path.join(process.cwd(), 'src/lib/qa_database.json');
let qaData = "No specific QA data loaded.";
try {
  if (fs.existsSync(qaPath)) {
    const rawQA = fs.readFileSync(qaPath, 'utf8');
    const parsed = JSON.parse(rawQA);
    qaData = parsed.map((item: any) => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
  }
} catch (e) {
  console.error("Failed to load QA Database", e);
}

const SYSTEM_PROMPT = `
You are the Official AI Support Widget for the SURE Forensics Platform.
Your goal is to provide institutional-grade support to high-level B2B clients (e.g. government ministries, enterprise clients).

GOLDEN RULES:
1. Maintain a highly professional, concise, and institutional tone.
2. If the user asks about invoicing, payment issues (like electricity going down), or general processes, answer using ONLY the approved QA knowledge base below.
3. If they mention having a problem paying, remind them they can resume the flow without being charged again.
4. Auto-detect the user's language and respond fluently in that language (support for English, Spanish, French, etc.).

APPROVED KNOWLEDGE BASE:
${qaData}

If the user asks something not covered in the knowledge base, politely inform them that you are an AI support agent and they can contact our human enterprise team at support@sureforensics.com.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, contextPath = '/' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: "API Key not configured." }, { status: 503 });
    }

    // Dynamic Context Injection
    let dynamicPersona = "You are the general SURE platform support.";
    if (contextPath.includes('/auditoria-dns')) {
      dynamicPersona = "You are a DNS Security Expert helping the user audit their DMARC/SPF records. You know that SURE's automated tools can fix DNS vulnerabilities in under 10 minutes.";
    } else if (contextPath.includes('/rma') || contextPath.includes('/intake')) {
      dynamicPersona = "You are a Forensic Intake Assistant helping the user upload their trade documents. You know that the system needs clear PDFs, and will use Agents Moises, Roberto, and Alcides to verify the company.";
    } else if (contextPath.includes('/admin') || contextPath.includes('/alfredo')) {
      dynamicPersona = "You are an Admin Assistant helping the user manage automated campaigns and leads. You know that Agent Alfredo handles automated outbound emails and that campaigns can be paused or resumed from the database.";
    }

    const FINAL_PROMPT = `
${SYSTEM_PROMPT}

DYNAMIC CONTEXT BASED ON USER'S CURRENT PAGE:
${dynamicPersona}
    `;

    const contents = messages.map(msg => {
      const parts: any[] = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.imageBase64) {
        const base64Data = msg.imageBase64.split(',')[1] || msg.imageBase64;
        const mimeMatch = msg.imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
      // Gemini requires at least one part
      if (parts.length === 0) {
        parts.push({ text: "." });
      }

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: parts
      };
    });

    const fullContents = [
      { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${FINAL_PROMPT}` }] },
      { role: 'model', parts: [{ text: "Understood, I will act as the SURE Institutional Support Agent with the requested context." }] },
      ...contents
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: fullContents,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Support Chat API Error:", error);
    return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  }
}
