import { otariClient, calculateCost } from '../config/otari.js';

export async function callOtari({
  model,
  messages,
  systemPrompt,
  guardrailMode = 'block',
  useWebSearch = false,
  sessionId,
}) {
  const requestBody = {
    model,
    messages: systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages,
    max_tokens: 1024,
    guardrails: [{ profile: 'prompt-injection', mode: guardrailMode }],
  };

  if (useWebSearch) {
    requestBody.tools = [{ type: 'otari_web_search' }];
  }

  const response = await otariClient.chat.completions.create(requestBody);

  const inputTokens = response.usage?.prompt_tokens || 0;
  const outputTokens = response.usage?.completion_tokens || 0;
  const cost = calculateCost(model, inputTokens, outputTokens);

  const contentBlocks = response.choices?.[0]?.message?.content;
  let answer = '';
  if (typeof contentBlocks === 'string') {
    answer = contentBlocks;
  } else if (Array.isArray(contentBlocks)) {
    answer = contentBlocks
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');
  } else {
    answer = response.choices?.[0]?.message?.content || '';
  }

  return {
    answer,
    model,
    inputTokens,
    outputTokens,
    cost,
    usage: response.usage,
  };
}
