import OpenAI from 'openai';

const otariClient = new OpenAI({
  apiKey: 'tk_1K7H79YyqvTVnWujgiHrqX5iSY0lhylY',
  baseURL: 'https://api.otari.ai/v1',
});

async function test() {
  try {
    const requestBody = {
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: 'hiii' }],
      guardrails: [{ profile: 'prompt-injection', mode: 'block' }]
    };
    const res1 = await otariClient.chat.completions.create(requestBody);
    console.log("Success with guardrails!", res1.choices[0].message);
  } catch (err) {
    console.error("Error guardrails:", err.message);
  }
}

test();
