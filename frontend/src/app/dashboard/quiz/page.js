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
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-2">Quiz Forge</h1>
          <p className="text-gray-400">Generate custom quizzes from topics or your own notes.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {!quiz && !results && (
          <div className="max-w-xl">
            <QuizUpload onGenerate={handleGenerate} loading={loading} />
          </div>
        )}

        {quiz && !results && (
          <div className="max-w-2xl">
            <QuizCard quiz={quiz} onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {results && (
          <div className="max-w-2xl">
            <QuizResults results={results} onRetry={() => {
              setQuiz(null);
              setResults(null);
            }} />
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-[400px] lg:h-auto">
        <div className="bg-brutal-card border-2 border-brutal-border p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-brutal-border shrink-0">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Live Routing</h3>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <LiveRoutingFeed events={routingEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
