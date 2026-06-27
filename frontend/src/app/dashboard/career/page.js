'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import ResumeUpload from '@/components/career/ResumeUpload';
import CareerPath from '@/components/career/CareerPath';
import LiveRoutingFeed from '@/components/dashboard/LiveRoutingFeed';
import { useSocket } from '@/hooks/useSocket';
import { useBudget } from '@/hooks/useBudget';

export default function CareerPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const sessionId = 'demo-session-id';
  const { routingEvents, isConnected } = useSocket(sessionId);
  const { budget, fetchBudget } = useBudget(sessionId);

  const handleAnalyze = async (data) => {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const res = await api.post('/api/career/analyze', { ...data, sessionId });
      setReport(res.paths);
      fetchBudget();
    } catch (err) {
      if (err.data?.injectionDetected) {
        setError('PIGuard blocked analysis: Potential prompt injection detected.');
      } else {
        setError(err.message || 'Failed to generate career report');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-2">Career Simulator</h1>
          <p className="text-gray-400">Discover AI-generated career paths based on your skills and goals.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {!report && (
          <div className="max-w-xl">
            <ResumeUpload onAnalyze={handleAnalyze} loading={loading} />
          </div>
        )}

        {report && (
          <div className="max-w-3xl">
            <button
              onClick={() => setReport(null)}
              className="mb-4 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest"
            >
              ← Start Over
            </button>
            <CareerPath report={report} />
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
