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
    <div className="flex-1 overflow-y-auto bg-[#FDF9F3] p-4 sm:p-6 lg:p-8 custom-scrollbar">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <div className="text-6xl mb-6 animate-wiggle">✦</div>
          <h2 className="text-4xl font-black text-ink mb-4 tracking-tight">Welcome to IRIS</h2>
          <p className="text-ink/70 font-bold max-w-md mb-10 text-lg">
            Ask anything — from simple facts to complex code problems. Watch how IRIS routes each query.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full px-4">
            {[
              { label: 'Simple', example: '"What is HTTP?"', tier: 'Kimi K2.6', color: 'mint' },
              { label: 'Medium', example: '"Explain TCP vs UDP"', tier: 'Haiku 4.5', color: 'sunny' },
              { label: 'Complex', example: '"Write a REST API"', tier: 'Sonnet 4.6', color: 'coral' },
            ].map((item, index) => (
              <div 
                key={item.label} 
                className={`neo-card bg-white p-6 rounded-3xl border-t-[16px] border-t-${item.color} text-left flex flex-col`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase text-ink/60 tracking-widest">{item.label}</p>
                  <span className={`w-3 h-3 rounded-full bg-${item.color} border-[2px] border-ink shadow-[2px_2px_0_#1A1A2E]`}></span>
                </div>
                <p className="text-base text-ink font-bold mb-6 flex-grow">
                  {item.example}
                </p>
                <div>
                  <span className="tag-sticker bg-white text-[10px] text-ink shadow-[2px_2px_0_#1A1A2E]">
                    → {item.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-6" />
      </div>
    </div>
  );
}
