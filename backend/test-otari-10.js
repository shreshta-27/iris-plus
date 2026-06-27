import OpenAI from 'openai';

const otariClient = new OpenAI({
  apiKey: 'tk_1K7H79YyqvTVnWujgiHrqX5iSY0lhylY',
  baseURL: 'https://api.otari.ai/v1',
});

async function test() {
  try {
    const requestBody = {
      model: 'anthropic:claude-sonnet-4-6',
      messages: [{ role: 'user', content: 'test' }],
    };
    const res1 = await otariClient.chat.completions.create(requestBody);
    console.log("Success with Sonnet!", res1.choices[0].message);
  } catch (err) {
    console.error("Error Sonnet:", err.message);
  }
}

test();
