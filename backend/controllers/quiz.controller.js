import { getDegradedModel, recordSpend, getAllBudgetStats } from '../services/budget.service.js';
import { callOtari } from '../services/otari.service.js';
import { MODELS } from '../config/otari.js';
import { QuizAttempt } from '../models/QuizAttempt.model.js';

export async function generateQuiz(req, res, next) {
  try {
    const { topic, noteContent, difficulty = 'medium', numQuestions = 5, sessionId } = req.body;
    const content = noteContent || topic;

    const model = getDegradedModel(sessionId, MODELS.COMPLEX) || MODELS.SIMPLE;

    const result = await callOtari({
      model,
      messages: [{ role: 'user', content: `Generate ${numQuestions} ${difficulty} multiple-choice questions from this content:\n\n${content}\n\nReturn ONLY valid JSON: {"questions": [{"id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}]}` }],
      guardrailMode: 'monitor',
      sessionId,
    });

    recordSpend(sessionId, model, result.cost, { tier: 'complex', reason: 'Quiz generation' });

    let questions;
    try {
      const cleaned = result.answer.replace(/```json|```/g, '').trim();
      questions = JSON.parse(cleaned).questions;
    } catch {
      return res.status(500).json({ error: 'Failed to parse quiz from AI response' });
    }

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      topic: topic || 'Custom notes',
      questions,
      model,
      cost: result.cost,
    });

    return res.json({
      attemptId: attempt._id,
      questions: questions.map(q => ({ id: q.id, question: q.question, options: q.options })),
      routing: { model, tier: 'complex', reason: 'Quiz generation requires content synthesis' },
      cost: { thisCall: result.cost, ...getAllBudgetStats(sessionId) },
    });
  } catch (err) {
    next(err);
  }
}

export async function submitQuizAnswers(req, res, next) {
  try {
    const { attemptId, answers, sessionId } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: 'Quiz attempt not found' });

    const results = attempt.questions.map(q => ({
      id: q.id,
      question: q.question,
      userAnswer: answers[q.id],
      correctAnswer: q.correct,
      correct: answers[q.id] === q.correct,
      explanation: q.explanation,
    }));

    const score = results.filter(r => r.correct).length;
    const wrongAnswers = results.filter(r => !r.correct);

    let feedback = '';
    if (wrongAnswers.length > 0) {
      const model = getDegradedModel(sessionId, MODELS.MEDIUM) || MODELS.SIMPLE;
      const feedbackResult = await callOtari({
        model,
        messages: [{
          role: 'user',
          content: `Student got ${score}/${attempt.questions.length} on a quiz about "${attempt.topic}". 
          Wrong answers: ${JSON.stringify(wrongAnswers.map(w => w.question))}.
          Give 3 specific, encouraging study tips to improve. Be concise.`,
        }],
        guardrailMode: 'monitor',
        sessionId,
      });
      feedback = feedbackResult.answer;
      recordSpend(sessionId, model, feedbackResult.cost, { tier: 'medium', reason: 'Quiz feedback generation' });
    }

    attempt.score = score;
    attempt.completedAt = new Date();
    await attempt.save();

    return res.json({
      score,
      total: attempt.questions.length,
      percentage: Math.round((score / attempt.questions.length) * 100),
      results,
      feedback,
      budgetStats: getAllBudgetStats(sessionId),
    });
  } catch (err) {
    next(err);
  }
}
