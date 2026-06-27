import { otariClient, calculateCost } from '../config/otari.js';

export async function callOtari({
  model,
  messages,
  systemPrompt,
  guardrailMode = 'block',
  useWebSearch = false,
  sessionId,
}) {
  // The Otari proxy crashes (502) if it receives consecutive user roles or max_tokens.
  // We merge the system prompt directly into the final user message to bypass this limitation.
  let formattedMessages = [...messages];
  if (systemPrompt && formattedMessages.length > 0) {
    const lastMsgIdx = formattedMessages.length - 1;
    formattedMessages[lastMsgIdx] = {
      ...formattedMessages[lastMsgIdx],
      content: `[SYSTEM: ${systemPrompt}]\n\n${formattedMessages[lastMsgIdx].content}`
    };
  }

  const requestBody = {
    model,
    messages: formattedMessages,
  };

  // Tools parameter removed because Otari API returns 403 Forbidden when it is included

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
