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
    <div className="h-full flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pr-2 relative z-10 custom-scrollbar">
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 bg-peach border-[4px] border-ink px-6 py-3 shadow-[6px_6px_0_#1A1A2E] rounded-2xl mb-6 rotate-2 hover:rotate-0 transition-transform">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-black text-ink uppercase tracking-tight">Career Simulator</h1>
          </div>
          <p className="text-ink font-bold text-xl opacity-80">Discover AI-generated career paths based on your skills and goals.</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-coral/20 border-[4px] border-coral rounded-2xl text-coral font-bold flex items-center gap-3 shadow-[4px_4px_0_var(--color-coral)]">
            <span className="text-2xl animate-wiggle">⚠️</span>
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
              className="mb-8 font-black font-caveat text-2xl text-ink bg-white px-5 py-2 rounded-full border-[3px] border-ink shadow-[4px_4px_0_#1A1A2E] hover:text-iris-purple hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A2E] transition-all inline-block"
            >
              ← Generate New Paths
            </button>
            <CareerPath report={report} />
          </div>
        )}
      </div>

      <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 h-[400px] lg:h-auto z-10">
        <div className="bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] p-5 flex-1 flex flex-col min-h-0 relative">
          <div className="flex items-center justify-between mb-5 pb-4 border-b-[3px] border-ink shrink-0">
            <div className="flex items-center gap-3">
              <span className="tag-sticker bg-sky text-ink !border-[2px] !shadow-[2px_2px_0_#1A1A2E]">Live</span>
              <h3 className="font-black text-sm uppercase tracking-widest text-ink">Routing Feed</h3>
            </div>
            <div className={`w-4 h-4 rounded-full border-[3px] border-ink shadow-[2px_2px_0_#1A1A2E] ${isConnected ? 'bg-mint animate-pulse' : 'bg-coral'}`} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <LiveRoutingFeed events={routingEvents} />
          </div>
        </div>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-20 left-1/4 w-40 h-10 bg-sky/50 border-[4px] border-ink/30 rounded-full animate-wiggle pointer-events-none z-0 blur-sm"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-coral/50 border-[4px] border-ink/30 animate-float pointer-events-none z-0 rotate-45 rounded-[2rem] blur-md"></div>
    </div>
  );
}
