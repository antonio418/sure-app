require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function test() {
  const models = ['claude-sonnet-4-6', 'claude-opus-4-7', 'claude-3-5-sonnet-latest', 'claude-4-sonnet'];
  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const msg = await anthropic.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      });
      console.log(`✅ Success with ${model}`);
      return;
    } catch (e) {
      console.error(`❌ Error with ${model}:`, e.message);
    }
  }
}

test();
