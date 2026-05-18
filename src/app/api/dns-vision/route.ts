import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, context } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Falta la imagen' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta GEMINI_API_KEY' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Extraemos la data real del base64 (quitamos el prefix data:image/png;base64, si lo tiene)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const missionContext = context?.mission || 'Find DNS Settings';
    const domainContext = context?.domain || 'unknown';
    const userComment = context?.userComment || '';

    const language = context?.language || 'en';
    const browserLanguage = context?.browserLanguage || 'unknown';
    const missingDmarc = context?.missingDmarc || false;
    const missingSpf = context?.missingSpf || false;
    const dnsIssues = context?.dnsIssues || [];

    let requiredActions = "";
    if (missingDmarc) requiredActions += "\n- MISSING DMARC RECORD: Tell the user to add a record with Type: TXT, Host/Name: _dmarc, Value: v=DMARC1; p=quarantine; (Add an explicit note telling them to copy the trailing ';' as well).";
    if (missingSpf) requiredActions += "\n- MISSING/BAD SPF RECORD: Tell the user to add/modify the record with Type: TXT, Host/Name: @ (or leave blank), Value: v=spf1 a mx -all";
    
    if (dnsIssues.includes('issue_no_mx')) {
      requiredActions += "\n- MISSING MX RECORDS: You MUST include this exact warning addressing the user directly: 'We highly recommend that you add the MX records provided by your email hosting provider (like Google Workspace, Microsoft 365, etc.). If you do NOT add MX records, the consequences will be:\n1.- You will be physically unable to receive ANY emails or replies from clients.\n2.- Many strict corporate spam filters will automatically reject your outbound emails because your sender domain lacks a valid receiving server.'";
    }

    if (!missingDmarc && !missingSpf && !dnsIssues.includes('issue_no_mx') && dnsIssues.length > 0) {
      requiredActions += `\n- OTHER DETECTED ISSUES: ${dnsIssues.join(', ')}`;
    }

    const languageInstruction = `CRITICAL LANGUAGE INSTRUCTION: You are a universal assistant. You MUST detect the user's native language by analyzing the text in the uploaded screenshot, the browser locale code (${browserLanguage}), and the UI language selection (${language}). \nTranslate your entire instruction STRICTLY into that detected native language (e.g. Vietnamese, Swahili, Japanese, Portuguese, etc). DO NOT default to English or Spanish if the user is from another region.\n\nFORMAT: If the phase is 'correction', you MUST strictly use the following numbered and structured format with newlines (\\n). VERY IMPORTANT: REPLACE the variables with the data from REQUIRED TECHNICAL ACTIONS FOR THIS DOMAIN, but DO NOT translate the technical values (like TXT, _dmarc, v=spf1, etc):\n1.- Click the 'Add Record' button (or corresponding button), which I have marked with a pulsing red indicator.\n2.- In the new record, enter exactly these details:\n  - Type: [INSERT TYPE HERE]\n  - Host/Name: [INSERT HOST HERE]\n  - Value: [INSERT VALUE HERE]\n3.- (If another record needs to be created, indicate it here with its real data based on REQUIRED TECHNICAL ACTIONS).\n4.- (If you detect an existing bad record, indicate it here and provide the new data to modify it). Answer the User Comment if it exists.`;

    const unknownInstruction = `Detailed instruction translated to the user's native language on what to do next.`;

    const prompt = `
      You are an expert IT support assistant for the SURE-DNS platform. The user is a non-technical CEO who has uploaded a screenshot of their domain registrar or web hosting dashboard.
      
      CURRENT MISSION: ${missionContext}
      USER DOMAIN: ${domainContext}
      REQUIRED TECHNICAL ACTIONS FOR THIS DOMAIN: ${requiredActions || "No specific actions detected. Read the user's screenshot."}

      Your task is to analyze the screenshot, determine what phase the user is in, and guide them visually.
      
      CRITICAL VALIDATION (DOMAIN MISMATCH):
      You MUST actively look for the domain name in the screenshot and compare it with the USER DOMAIN (${domainContext}).
      If the screenshot clearly shows that the user is managing a DIFFERENT domain (e.g., they are auditing 'company.com' but the screenshot shows settings for 'other-store.com'), you MUST abort. 
      NOTE: The URL of the dashboard itself (like godaddy.com, titan.email, hostgator.com, etc.) does NOT mean it's the wrong domain. The validation is whether the ACCOUNT or SETTINGS shown in the dashboard belong to a different domain.
      If it is clearly the wrong domain, set found: false, phase: "unknown", and instruct the user politely that they uploaded a screenshot for the wrong domain, and they must upload a screenshot of the settings for ${domainContext} specifically.

      PHASE DETECTION:
      - "navigation": The user is on a generic dashboard or home page and needs to find the button to access DNS Settings (e.g., "Manage DNS", "DNS Settings", "Advanced DNS", "Zone Editor").
      - "correction": The user is ALREADY looking at their detailed DNS records table.

      INSTRUCTIONS:
      1. If phase is "navigation", find the single button to click to access DNS settings.
      2. If phase is "correction", find ALL the areas that must be corrected. If they need to add a new record, find the "Add Record" or "Add New" button. If they need to fix an existing bad record (like an SPF loop), find the row of that bad record.
      3. CRITICAL FOR CORRECTION PHASE: You MUST append a final note to your instruction explaining that DNS changes can take between 30 minutes and 1 hour to propagate globally over the internet. Tell the user to wait a few minutes and then use the "Force Re-scan" button on the platform to verify if the changes were detected.
      4. Return the bounding boxes for all these areas.
      5. IF the user provided a specific question or comment, answer it directly in the instruction field.
      USER COMMENT: "${userComment}"

      The coordinates must be integers between 0 and 1000, representing a scaled 1000x1000 grid over the image. format: [ymin, xmin, ymax, xmax].
      CRITICAL: BE EXTREMELY PRECISE with your bounding box coordinates. Double-check that the box perfectly wraps the target row or button. Do not shift the box down or right. If the image is a window within a desktop, ensure you target the element INSIDE the window.

      Format your response EXACTLY as this JSON:
      {
        "found": true,
        "phase": "navigation" | "correction",
        "boxes_2d": [
          [ymin, xmin, ymax, xmax]
        ],
        "instruction": "${languageInstruction.replace(/\n/g, '\\n')}"
      }
      
      If you cannot find any relevant button or area, return:
      {
        "found": false,
        "phase": "unknown",
        "boxes_2d": [],
        "instruction": "${unknownInstruction}"
      }
    `;

    const generateWithModel = async (modelName: string) => {
      return await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType || 'image/png'
                }
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
    };

    let response;
    try {
      // Intento Principal: El modelo de razonamiento más avanzado
      response = await generateWithModel('gemini-2.5-pro');
    } catch (primaryError: any) {
      console.warn(`[Shield Protocol] Primary vision model failed (${primaryError.message}). Initiating fallback to flash model...`);
      try {
        // Intento Secundario: Si el Pro falla por cuotas o congestión, usamos Flash (súper rápido y resiliente)
        response = await generateWithModel('gemini-2.0-flash');
      } catch (fallbackError: any) {
        console.error("[Shield Protocol] Critical Failure in both vision models:", fallbackError);
        
        let errorMsg = fallbackError.message || "";
        if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE")) {
          return NextResponse.json({ 
            found: false, 
            instruction: "Nuestros servidores de IA están procesando demasiadas solicitudes en este momento. Por favor, intenta subir la imagen de nuevo en 30 segundos." 
          });
        }
        
        return NextResponse.json({ 
          found: false, 
          instruction: "Hubo una interrupción temporal en la conexión segura con la IA. Por favor, vuelve a intentar subir tu captura." 
        });
      }
    }

    const resultText = response.text || "{}";
    
    try {
      const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const resultJson = JSON.parse(cleanedText);
      return NextResponse.json(resultJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", resultText);
      return NextResponse.json({ 
        found: false, 
        instruction: "La IA no pudo procesar esta imagen con certeza. Por favor, asegúrate de que el panel de DNS sea claramente visible." 
      });
    }

  } catch (error: any) {
    console.error("Error en DNS Vision API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
