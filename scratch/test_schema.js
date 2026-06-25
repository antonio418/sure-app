const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Generate a test cold email sequence of 3 emails for a product called "Smart Widget".',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            email_1_subject: { type: 'STRING' },
            email_1_content: { type: 'STRING' },
            email_2_subject: { type: 'STRING' },
            email_2_content: { type: 'STRING' },
            email_3_subject: { type: 'STRING' },
            email_3_content: { type: 'STRING' }
          },
          required: [
            'email_1_subject',
            'email_1_content',
            'email_2_subject',
            'email_2_content',
            'email_3_subject',
            'email_3_content'
          ]
        }
      }
    });

    console.log("Response text:");
    console.log(response.text);
    const parsed = JSON.parse(response.text);
    console.log("Parsed keys:", Object.keys(parsed));
  } catch (err) {
    console.error("Error testing schema:", err);
  }
}

run();
