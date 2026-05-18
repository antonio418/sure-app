import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `
Eres el "Concierge de Ventas" institucional de SURE Infrastructure Intelligence. 
Tu objetivo es resolver dudas de ejecutivos (CFOs, CPOs, Directores de Logística) sobre riesgos en comercio internacional, infraestructura DNS y due diligence, y guiarlos hacia la conversión.

CONTEXTO DE SURE:
- SURE ofrece 2 servicios: Auditoría DNS (Gratuita, tarda 30 segundos) y SURE RMA (Risk Mitigation Architecture, cuesta $70/mes en su Founder's License y tarda 10 minutos).
- El problema: El 91% de los fraudes en comercio internacional comienzan con emails suplantados (falta de DMARC) o proveedores fantasmas. Las firmas tradicionales cobran $10,000+ y tardan semanas.
- Nuestro tono: Directo, clínico, para ejecutivos. No uses emojis excesivos. Habla de riesgo comercial y dólares, no solo de tecnología.

PREGUNTAS FRECUENTES:
- ¿Qué es DMARC? Es un protocolo que impide que alguien use tu dominio para enviar emails falsos a tus clientes. Si no lo tienes, estás expuesto al fraude.
- ¿Qué incluye la Founder's License? Por $70/mes, incluye Protección DNS Continua y 3 Certificados RMA por mes.
- ¿Es difícil de instalar? No requiere instalación técnica ni acceso a tus servidores. Operamos sobre registros públicos.

INSTRUCCIONES:
- Responde de forma concisa. Máximo 2-3 párrafos cortos.
- Si el usuario tiene dudas sobre su propio riesgo, invítalo a correr la "Auditoría DNS Gratuita" en sure.io/auditoria-dns.
- Si el usuario ya sabe del riesgo y quiere protección, invítalo a adquirir la Founder's License ($70).
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 });
    }

    // Usamos gemini-2.5-flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    // Formatear el historial de chat para Gemini
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ message: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 500 });
  }
}
