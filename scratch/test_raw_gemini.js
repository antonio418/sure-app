const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found!");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  console.log("Calling Gemini API directly...");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Busca fabricantes de medidores inteligentes en China y Corea del Sur para exportación a Ecuador.',
      config: {
        temperature: 0.1,
        tools: [{ googleSearch: {} }]
      }
    });

    console.log("Success! Full response:");
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Direct API call error:", err);
  }
}

test();
