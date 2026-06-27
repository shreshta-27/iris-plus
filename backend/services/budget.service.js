import dotenv from 'dotenv';
dotenv.config();

const budgetMap = new Map();
const SESSION_BUDGET = parseFloat(process.env.SESSION_BUDGET || '2.00');

export function getBudgetState(sessionId) {
  if (!budgetMap.has(sessionId)) {
    budgetMap.set(sessionId, { spent: 0, calls: 0, blockedCalls: 0, history: [] });
  }
  return budgetMap.get(sessionId);
}

export function getDegradedModel(sessionId, classifiedModel) {
  const state = getBudgetState(sessionId);
  const remaining = SESSION_BUDGET - state.spent;

  if (remaining <= 0) return null;
  if (remaining < 0.10) return 'mzai:moonshotai/Kimi-K2.6';
  if (remaining < 0.40) {
    if (classifiedModel === 'anthropic:claude-haiku-4-5') return 'mzai:moonshotai/Kimi-K2.6';
  }
  return classifiedModel;
}

export function getBudgetMode(sessionId) {
  const state = getBudgetState(sessionId);
  const spent = state.spent;
  if (spent >= SESSION_BUDGET) return 'exceeded';
  if (spent >= 1.90) return 'critical';
  if (spent >= 1.60) return 'caution';
  return 'normal';
}

export function recordSpend(sessionId, model, cost, routingData) {
  const state = getBudgetState(sessionId);
  state.spent = Math.min(parseFloat((state.spent + cost).toFixed(8)), SESSION_BUDGET);
  state.calls += 1;
  state.history.push({
    timestamp: new Date().toISOString(),
    model,
    cost,
    ...routingData,
  });
  budgetMap.set(sessionId, state);
  return state;
}

export function recordBlockedCall(sessionId) {
  const state = getBudgetState(sessionId);
  state.blockedCalls += 1;
  budgetMap.set(sessionId, state);
}

export function resetBudget(sessionId) {
  budgetMap.set(sessionId, { spent: 0, calls: 0, blockedCalls: 0, history: [] });
}

export function getAllBudgetStats(sessionId) {
  const state = getBudgetState(sessionId);
  return {
    spent: state.spent,
    remaining: Math.max(0, SESSION_BUDGET - state.spent),
    total: SESSION_BUDGET,
    percentUsed: (state.spent / SESSION_BUDGET) * 100,
    mode: getBudgetMode(sessionId),
    calls: state.calls,
    blockedCalls: state.blockedCalls,
    history: state.history.slice(-20),
  };
}
