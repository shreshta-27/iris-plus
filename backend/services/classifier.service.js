export function classifyPrompt(text) {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  const hasCode = /```|function\s*\(|class\s+\w|import\s+|def\s+\w|for\s*\(|while\s*\(|=>\s*\{|async\s+/.test(text);
  const hasMultiPart = (text.match(/\?/g) || []).length > 1 ||
                       (/\band\b/i.test(text) && wordCount > 25);
  const isComparison = /compare|difference between|vs\.?|versus|pros.*cons|advantages.*disadvantages/i.test(text);
  const isFactual = /^(what is|define|who is|when did|capital of|who was|what does|how many|when was)/i.test(text.trim());
  const isDebate = /argue|debate|essay|analyze|evaluate|critically|explain why|discuss/i.test(text);
  const hasNested = /\b(how does .* work|why does|what happens when|can you explain)\b/i.test(text);
  const needsWebSearch = /latest|current|2025|2026|today|recent|news|price of|salary/i.test(text);

  let score = 0;

  if (wordCount > 10) score += 10;
  if (wordCount > 30) score += 15;
  if (wordCount > 60) score += 15;
  if (wordCount > 100) score += 10;

  if (hasCode) score += 35;
  if (hasMultiPart) score += 15;
  if (isComparison) score += 12;
  if (isDebate) score += 20;
  if (hasNested) score += 10;
  if (needsWebSearch) score += 8;

  if (isFactual && wordCount < 20) score -= 25;
  if (wordCount < 8 && !hasCode) score -= 15;

  score = Math.max(0, Math.min(100, score));

  const tier = score < 34 ? 'simple' : score < 67 ? 'medium' : 'complex';

  const reasonMap = {
    simple: `Simple query · score ${score} · direct factual or short answer`,
    medium: `Medium complexity · score ${score} · explanation or multi-step reasoning required`,
    complex: `Complex query · score ${score} · ${hasCode ? 'code analysis, ' : ''}${isComparison ? 'comparison, ' : ''}${isDebate ? 'essay/analysis, ' : ''}deep reasoning required`,
  };

  return {
    tier,
    score,
    reason: reasonMap[tier],
    signals: { hasCode, hasMultiPart, isComparison, isFactual, isDebate, needsWebSearch },
  };
}
