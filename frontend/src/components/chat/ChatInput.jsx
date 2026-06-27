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
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  };

  return (
    <div className="border-t-[4px] border-ink bg-white p-3 md:p-4 relative z-20">
      <div className="max-w-4xl mx-auto">
        {budgetExceeded && (
          <div className="mb-3 px-4 py-3 bg-coral border-[3px] border-ink rounded-xl flex items-center gap-2 shadow-[3px_3px_0_#1A1A2E]">
            <RiErrorWarningLine className="w-5 h-5 text-ink flex-shrink-0" />
            <p className="text-ink font-black text-xs uppercase tracking-wider leading-tight">
              Budget Exceeded ($2.00 limit). Reset session.
            </p>
          </div>
        )}
        
        <div className="flex items-end gap-3 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={budgetExceeded ? 'Budget exceeded...' : 'Ask IRIS anything...'}
            disabled={disabled || budgetExceeded}
            rows={1}
            className="w-full bg-cream border-[3px] border-ink rounded-2xl text-ink py-3.5 px-5 outline-none transition-all duration-300 font-medium resize-none min-h-[52px] max-h-[160px] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-[4px_4px_0_#1A1A2E] focus:border-iris-purple focus:shadow-[4px_4px_0_var(--color-iris-purple)] custom-scrollbar placeholder:text-ink/40"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending || disabled || budgetExceeded}
            className="bg-iris-purple text-white border-[3px] border-ink rounded-full h-[52px] w-[52px] flex-shrink-0 flex items-center justify-center shadow-[4px_4px_0_#1A1A2E] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#1A1A2E] active:translate-y-[3px] active:shadow-[1px_1px_0_#1A1A2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <RiLoader4Line className="w-6 h-6 animate-spin text-white" />
            ) : (
              <RiSendPlaneLine className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
            Shift+Enter for new line
          </p>
          <p className="text-[10px] text-ink/30 font-mono font-bold">
            15/min
          </p>
        </div>
      </div>
    </div>
  );
}
