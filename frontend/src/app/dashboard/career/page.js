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
  const { budget: stats, fetchBudget: fetchStats } = useBudget(sessionId);

  const handleAnalyze = async (data) => {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const res = await api.post('/api/career/analyze', { ...data, sessionId });
      setReport(res.paths);
      fetchStats();
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
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pr-2 relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-peach border-3 border-ink px-4 py-2 shadow-[4px_4px_0_#1A1A2E] mb-6 rotate-2">
            <span className="text-2xl">🚀</span>
            <h1 className="text-2xl font-black text-ink uppercase tracking-tight">Career Simulator</h1>
          </div>
          <p className="text-ink font-bold text-lg">Discover AI-generated career paths based on your skills and goals.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-coral/20 border-3 border-coral text-coral font-bold flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {!report && (
          <div className="max-w-2xl">
            <ResumeUpload onAnalyze={handleAnalyze} loading={loading} />
          </div>
        )}

        {report && (
          <div className="max-w-3xl pb-10">
            <button
              onClick={() => setReport(null)}
              className="mb-8 font-black font-caveat text-xl text-ink hover:text-iris-purple transition-colors inline-block"
            >
              ← Generate New Paths
            </button>
            <CareerPath report={report} />
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
      <div className="absolute top-20 left-1/4 w-32 h-8 bg-sky/50 border-3 border-ink/30 animate-wiggle pointer-events-none z-0" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }}></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-coral/50 border-3 border-ink/30 animate-float pointer-events-none z-0 rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
    </div>
  );
}
