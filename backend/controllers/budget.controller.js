import { getAllBudgetStats, resetBudget } from '../services/budget.service.js';

export function getBudgetStats(req, res) {
  return res.json(getAllBudgetStats(req.params.sessionId));
}

export function resetBudgetHandler(req, res) {
  resetBudget(req.params.sessionId);
  return res.json({ message: 'Budget reset for demo', stats: getAllBudgetStats(req.params.sessionId) });
}
