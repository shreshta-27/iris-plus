import { getAllBudgetStats, resetBudget } from '../services/budget.service.js';

export async function getBudgetStats(req, res, next) {
  try {
    const stats = await getAllBudgetStats(req.params.sessionId);
    return res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function resetBudgetHandler(req, res, next) {
  try {
    await resetBudget(req.params.sessionId);
    const stats = await getAllBudgetStats(req.params.sessionId);
    return res.json({ message: 'Budget reset for demo', stats });
  } catch (err) {
    next(err);
  }
}
