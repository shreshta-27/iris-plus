'use client';
import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-cream p-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
          <div className="text-6xl mb-4 animate-wiggle">✦</div>
          <h2 className="text-3xl font-black text-ink mb-3">Welcome to IRIS</h2>
          <p className="text-ink/70 font-medium max-w-md mb-8">
            Ask anything — from simple facts to complex code problems. Watch how IRIS routes each query to the optimal model.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {[
              { label: 'Simple', example: '"What is HTTP?"', tier: 'Kimi K2.6', color: 'mint' },
              { label: 'Medium', example: '"Explain TCP vs UDP"', tier: 'Haiku 4.5', color: 'sunny' },
              { label: 'Complex', example: '"Write a REST API"', tier: 'Sonnet 4.6', color: 'coral' },
            ].map(item => (
              <div key={item.label} className={`neo-card bg-white p-4 card-${item.color} text-left`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black uppercase text-ink/60 tracking-widest">{item.label}</p>
                  <span className={`w-2 h-2 rounded-full bg-${item.color} border border-ink`}></span>
                </div>
                <p className="text-sm text-ink font-bold mb-3">{item.example}</p>
                <div className="mt-auto">
                  <span className="tag-sticker bg-white text-[9px] border-ink/50 text-ink/70 shadow-none">
                    → {item.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
