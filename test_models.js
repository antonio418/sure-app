const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY});
async function run() {
  try {
    const models = await anthropic.models.list();
    console.log("AVAILABLE MODELS:", models.data.map(m => m.id));
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
run();
