'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import QuizUpload from '@/components/quiz/QuizUpload';
import QuizCard from '@/components/quiz/QuizCard';
import QuizResults from '@/components/quiz/QuizResults';
import LiveRoutingFeed from '@/components/dashboard/LiveRoutingFeed';
import { useSocket } from '@/hooks/useSocket';
import { useBudget } from '@/hooks/useBudget';

export default function QuizPage() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const sessionId = 'demo-session-id';
  const { routingEvents, isConnected } = useSocket(sessionId);
  const { budget: stats, fetchBudget: fetchStats } = useBudget(sessionId);

  const handleGenerate = async (params) => {
    setLoading(true);
    setError('');
    setQuiz(null);
    setResults(null);
    try {
      const res = await api.post('/api/quiz/generate', { ...params, sessionId });
      setQuiz({ id: res.attemptId, questions: res.questions });
      fetchStats();
    } catch (err) {
      if (err.data?.injectionDetected) {
        setError('PIGuard blocked generation: Potential prompt injection detected.');
      } else {
        setError(err.message || 'Failed to generate quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answers) => {
    setLoading(true);
    try {
      const res = await api.post('/api/quiz/submit', { attemptId: quiz.id, answers });
      setResults(res.results);
    } catch (err) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pr-2 relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-sunny border-3 border-ink px-4 py-2 shadow-[4px_4px_0_#1A1A2E] mb-6 -rotate-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl font-black text-ink uppercase tracking-tight">Quiz Forge</h1>
          </div>
          <p className="text-ink font-bold text-lg">Generate custom quizzes from topics or your own notes.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-coral/20 border-3 border-coral text-coral font-bold flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {!quiz && !results && (
          <div className="max-w-2xl">
            <QuizUpload onGenerate={handleGenerate} loading={loading} />
          </div>
        )}

        {quiz && !results && (
          <div className="max-w-3xl">
            <QuizCard quiz={quiz} onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {results && (
          <div className="max-w-3xl">
            <QuizResults results={results} onRetry={() => {
              setQuiz(null);
              setResults(null);
            }} />
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-[400px] lg:h-auto z-10">
        <div className="bg-white border-3 border-ink shadow-[6px_6px_0_#1A1A2E] p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-3 border-ink shrink-0">
            <div className="flex items-center gap-2">
              <span className="tag-sticker bg-sky text-ink border-2 text-[10px]">Live</span>
              <h3 className="font-black text-sm uppercase tracking-widest text-ink">Routing Feed</h3>
            </div>
            <div className={`w-3 h-3 rounded-full border-2 border-ink ${isConnected ? 'bg-mint animate-pulse' : 'bg-coral'}`} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <LiveRoutingFeed events={routingEvents} />
          </div>
        </div>
      </div>
      
      {/* Decorative background shapes */}
      <div className="absolute top-40 right-1/4 w-24 h-24 bg-mint/50 rounded-full border-3 border-ink/30 animate-float pointer-events-none z-0"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-peach/50 border-3 border-ink/30 rotate-12 animate-wiggle pointer-events-none z-0"></div>
    </div>
  );
}
