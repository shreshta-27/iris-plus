import { callOtari } from './services/otari.service.js';

async function test() {
  try {
    const res = await callOtari({
      model: 'mzai:moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: 'hello' }],
      systemPrompt: 'You are an AI.',
    });
    console.log("FINAL SUCCESS:", res);
  } catch (err) {
    console.error("FINAL ERROR:", err.message);
  }
}

test();
