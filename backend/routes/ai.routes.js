import { Router } from 'express';
import { handleAIChat } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { aiRateLimit } from '../middlewares/rateLimit.middleware.js';

const router = Router();
router.post('/chat', authenticate, aiRateLimit, handleAIChat);
export default router;
