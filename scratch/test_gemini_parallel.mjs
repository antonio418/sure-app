import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function callModel(id, modelName) {
  console.log(`[Task ${id}] Starting with model ${modelName}...`);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: `Write a short sentence greeting company number ${id}.` }] }],
      config: { responseMimeType: "application/json" }
    });
    console.log(`[Task ${id}] Success! Text: ${response.text?.trim()}`);
  } catch (e) {
    console.error(`[Task ${id}] Failed: ${e.message}`, e);
  }
}

async function main() {
  const modelName = 'gemini-3.5-flash'; // Let's test gemini-3.5-flash
  console.log(`Running parallel tests on model: ${modelName}`);
  const tasks = Array.from({ length: 5 }, (_, i) => callModel(i + 1, modelName));
  await Promise.all(tasks);
  
  console.log("\nRunning parallel tests on model: gemini-2.5-flash");
  const tasks2 = Array.from({ length: 5 }, (_, i) => callModel(i + 1, 'gemini-2.5-flash'));
  await Promise.all(tasks2);
}

main();
