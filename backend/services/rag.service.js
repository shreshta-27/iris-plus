import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let knowledgeBase = [];
try {
  const raw = readFileSync(join(__dirname, '../data/knowledge-base.json'), 'utf-8');
  knowledgeBase = JSON.parse(raw);
} catch (e) {
  console.log('No knowledge base found, RAG will be skipped');
}

const responseCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function normalizeQuery(text) {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function tokenOverlap(a, b) {
  const tokensA = new Set(normalizeQuery(a).split(' '));
  const tokensB = new Set(normalizeQuery(b).split(' '));
  const intersection = [...tokensA].filter(t => tokensB.has(t) && t.length > 3);
  return intersection.length / Math.max(tokensA.size, tokensB.size);
}

export function searchKnowledgeBase(query) {
  if (knowledgeBase.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = tokenOverlap(query, entry.question || entry.content);
    if (score > bestScore && score > 0.45) {
      bestScore = score;
      bestMatch = entry;
    }
  }
  return bestMatch ? { answer: bestMatch.answer, source: 'knowledge-base', score: bestScore } : null;
}

export function getCachedResponse(query) {
  const key = normalizeQuery(query);
  const cached = responseCache.get(key);
  if (!cached) return null;
  if (Date.now() - new Date(cached.timestamp).getTime() > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return cached;
}

export function setCachedResponse(query, data) {
  const key = normalizeQuery(query);
  responseCache.set(key, { ...data, timestamp: new Date().toISOString() });
  if (responseCache.size > 500) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}
