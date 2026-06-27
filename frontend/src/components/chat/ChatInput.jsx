'use client';
import { useState, useRef, useCallback } from 'react';
import { RiSendPlaneLine, RiLoader4Line, RiErrorWarningLine } from 'react-icons/ri';

export default function ChatInput({ onSend, disabled, budgetExceeded }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);
  const lastSendRef = useRef(0);

  const handleSend = useCallback(async () => {
    const now = Date.now();
    if (now - lastSendRef.current < 1000) return;
    if (!message.trim() || sending || disabled) return;

    lastSendRef.current = now;
    setSending(true);

    try {
      await onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSending(false);
    }
  }, [message, sending, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="border-t-[4px] border-ink bg-cream p-4 md:p-6 relative z-20">
      <div className="max-w-4xl mx-auto">
        {budgetExceeded && (
          <div className="mb-4 px-5 py-4 bg-coral border-[4px] border-ink rounded-2xl flex items-center gap-3 shadow-[4px_4px_0_#1A1A2E]">
            <RiErrorWarningLine className="w-6 h-6 text-ink flex-shrink-0" />
            <p className="text-ink font-black text-sm uppercase tracking-wider leading-tight">
              Budget Exceeded ($2.00 limit reached). Reset session.
            </p>
          </div>
        )}
        
        <div className="flex items-end gap-3 md:gap-4 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={budgetExceeded ? 'Budget exceeded...' : 'Ask IRIS anything...'}
            disabled={disabled || budgetExceeded}
            rows={1}
            className="w-full bg-white border-[4px] border-ink rounded-[2rem] text-ink p-4 md:py-5 md:px-6 outline-none transition-all duration-300 font-medium resize-none min-h-[64px] max-h-[200px] disabled:opacity-50 disabled:bg-cream disabled:cursor-not-allowed text-lg shadow-[6px_6px_0_#1A1A2E] focus:border-iris-purple focus:shadow-[6px_6px_0_var(--color-iris-purple)] focus:translate-y-[-2px] custom-scrollbar"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending || disabled || budgetExceeded}
            className="bg-iris-purple text-white border-[4px] border-ink rounded-full p-4 md:p-5 h-[64px] w-[64px] flex-shrink-0 flex items-center justify-center shadow-[6px_6px_0_#1A1A2E] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#1A1A2E] active:translate-y-[4px] active:shadow-[0_0_0_#1A1A2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <RiLoader4Line className="w-7 h-7 animate-spin text-white" />
            ) : (
              <RiSendPlaneLine className="w-7 h-7 text-white ml-1" />
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-xs text-ink/60 font-black uppercase tracking-widest">
            Shift+Enter for new line
          </p>
          <p className="text-xs text-ink/40 font-mono font-bold bg-white px-2 py-0.5 border-2 border-ink/20 rounded-lg">
            Rate Limit: 15/min
          </p>
        </div>
      </div>
    </div>
  );
}
