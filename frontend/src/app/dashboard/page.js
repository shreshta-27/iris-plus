'use client';
import { useState, useRef, useEffect } from 'react';
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
  const [sessionData, setSessionData] = useState(null);

  // Hardcoded session for demo/hackathon purposes, should match backend assumption
  const sessionId = 'demo-session-id';
  const { socket, routingEvents, isConnected } = useSocket(sessionId);
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
      }]);
      fetchStats();
    } catch (err) {
      if (err.data?.injectionDetected) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I cannot answer that. Potential prompt injection detected and blocked by PIGuard.',
          id: Date.now() + 1,
          isBlocked: true,
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: err.message || 'An error occurred.',
          id: Date.now() + 1,
          isError: true,
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col min-w-0 bg-brutal-card border-2 border-brutal-border overflow-hidden">
        {stats && (
          <BudgetWarningBanner mode={stats.budgetState} />
        )}
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput 
          onSend={handleSend} 
          disabled={!isConnected} 
          budgetExceeded={stats?.budgetState === 'exceeded'} 
        />
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-brutal-card border-2 border-brutal-border p-4 flex-1 max-h-[50vh] lg:max-h-none overflow-hidden flex flex-col">
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
