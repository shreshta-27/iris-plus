import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocketService } from './services/socket.service.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import careerRoutes from './routes/career.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();
await connectDB();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
});

initSocketService(io);

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/budget', budgetRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`IRIS backend running on port ${PORT}`));
