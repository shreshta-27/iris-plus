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
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="text-6xl mb-4">✦</div>
          <h2 className="text-2xl font-black text-white mb-2">Welcome to IRIS</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Ask anything — from simple facts to complex code problems. Watch how IRIS routes each query to the optimal model.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full">
            {[
              { label: 'Simple', example: '"What is HTTP?"', tier: 'Kimi K2.6' },
              { label: 'Medium', example: '"Explain TCP vs UDP"', tier: 'Haiku 4.5' },
              { label: 'Complex', example: '"Write a REST API"', tier: 'Sonnet 4.6' },
            ].map(item => (
              <div key={item.label} className="neo-card p-3 text-left">
                <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">{item.label}</p>
                <p className="text-xs text-gray-300 mb-2">{item.example}</p>
                <p className="text-[10px] font-mono text-iris-400">→ {item.tier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
