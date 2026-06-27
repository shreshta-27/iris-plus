import OpenAI from 'openai';

const otariClient = new OpenAI({
  apiKey: 'tk_1K7H79YyqvTVnWujgiHrqX5iSY0lhylY',
  baseURL: 'https://api.otari.ai/v1',
});

async function test() {
  try {
    const res1 = await otariClient.chat.completions.create({
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello' }, { role: 'user', content: 'hi again' }]
    });
    console.log("Success!", res1.choices[0].message);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
