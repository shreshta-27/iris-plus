'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import LiveRoutingFeed from '@/components/dashboard/LiveRoutingFeed';
import BudgetWarningBanner from '@/components/ui/BudgetWarningBanner';
import { useSocket } from '@/hooks/useSocket';
import { useBudget } from '@/hooks/useBudget';

export default function DashboardPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded session for demo/hackathon purposes
  const sessionId = 'demo-session-id';
  const { routingEvents, isConnected } = useSocket(sessionId);
  const { budget: stats, fetchBudget: fetchStats } = useBudget(sessionId);

  const handleSend = async (text) => {
    const newMessage = { role: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const res = await api.post('/api/ai/chat', { message: text, sessionId });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        id: Date.now() + 1,
        tier: res.routing?.tier,
        model: res.routing?.modelDisplayName,
        routing: res.routing,
        cost: res.cost,
        injectionStatus: res.injectionStatus
      }]);
      fetchStats();
    } catch (err) {
      if (err.data?.injectionDetected) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I cannot answer that. Potential prompt injection detected and blocked by PIGuard.',
          id: Date.now() + 1,
          isBlocked: true,
          injectionStatus: 'blocked'
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: err.message || 'An error occurred while connecting to IRIS.',
          id: Date.now() + 1,
          isError: true,
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
      <div className="flex-1 flex flex-col min-w-0 bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] overflow-hidden relative z-10">
        {stats && (
          <BudgetWarningBanner mode={stats.mode} />
        )}
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput 
          onSend={handleSend} 
          disabled={!isConnected} 
          budgetExceeded={stats?.mode === 'exceeded'} 
        />
      </div>

      <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 z-10">
        <div className="bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] p-5 flex-1 h-[400px] lg:h-auto overflow-hidden flex flex-col relative">
          
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
      
      {/* Decorative background shape */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-iris-purple/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}
