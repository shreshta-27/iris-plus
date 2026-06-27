import OpenAI from 'openai';

const otariClient = new OpenAI({
  apiKey: 'tk_1K7H79YyqvTVnWujgiHrqX5iSY0lhylY',
  baseURL: 'https://api.otari.ai/v1',
});

async function test() {
  try {
    console.log("Testing with guardrails...");
    const res1 = await otariClient.chat.completions.create({
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: 'hello' }],
      guardrails: [{ profile: 'prompt-injection', mode: 'monitor' }]
    });
    console.log("Success with guardrails:", res1.choices[0].message);
  } catch (err) {
    console.error("Error with guardrails:", err.message);
  }

  try {
    console.log("\nTesting without guardrails...");
    const res2 = await otariClient.chat.completions.create({
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: 'hello' }]
    });
    console.log("Success without guardrails:", res2.choices[0].message);
  } catch (err) {
    console.error("Error without guardrails:", err.message);
  }
}

test();
