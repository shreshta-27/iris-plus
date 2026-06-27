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
    <div className="border-t-3 border-ink bg-white p-4 relative z-20">
      {budgetExceeded && (
        <div className="mb-3 px-4 py-3 bg-coral border-3 border-ink flex items-start gap-2 shadow-[2px_2px_0_#1A1A2E]">
          <RiErrorWarningLine className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" />
          <p className="text-ink font-bold text-sm leading-tight">
            Budget Exceeded ($2.00 limit reached). Reset budget for demo or start a new session.
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
          className="input-brutal flex-1 resize-none min-h-[56px] max-h-[200px] disabled:opacity-50 disabled:bg-cream disabled:cursor-not-allowed py-4 text-base"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending || disabled || budgetExceeded}
          className="btn-primary p-4 h-[56px] flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <RiLoader4Line className="w-6 h-6 animate-spin text-white" />
          ) : (
            <RiSendPlaneLine className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-[11px] text-ink/60 font-bold uppercase tracking-widest">
          Shift+Enter for new line
        </p>
        <p className="text-[10px] text-ink/40 font-mono font-bold">
          Rate Limit: 15/min
        </p>
      </div>
    </div>
  );
}
