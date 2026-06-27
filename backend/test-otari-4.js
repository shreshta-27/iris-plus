import OpenAI from 'openai';

const otariClient = new OpenAI({
  apiKey: 'tk_1K7H79YyqvTVnWujgiHrqX5iSY0lhylY',
  baseURL: 'https://api.otari.ai/v1',
});

async function test() {
  try {
    console.log("Testing with user role instead of system...");
    const requestBody = {
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [
        { role: 'user', content: 'SYSTEM INSTRUCTIONS: You are IRIS, an intelligent AI assistant for students.' },
        { role: 'user', content: 'hiii' }
      ],
      max_tokens: 1024,
      guardrails: [{ profile: 'prompt-injection', mode: 'block' }]
    };
    const res1 = await otariClient.chat.completions.create(requestBody);
    console.log("Success!", res1.choices[0].message);
  } catch (err) {
    console.error("Error payload:", err.message);
  }
}

test();
