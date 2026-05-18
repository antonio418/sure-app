import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if(data.models) {
        console.log(data.models.map(m => m.name).join('\n'));
    } else {
        console.log("No models returned:", data);
    }
  } catch (e) {
    console.log(e);
  }
}
run();
