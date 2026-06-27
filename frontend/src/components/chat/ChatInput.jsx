'use client';
import { useState, useRef, useCallback } from 'react';
import { RiSendPlaneLine, RiLoader4Line } from 'react-icons/ri';

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

    const textToSend = message.trim();
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await onSend(textToSend);
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
    <div className="border-t-2 border-brutal-border bg-brutal-card p-4">
      {budgetExceeded && (
        <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          ⛔ Budget exceeded ($2.00 limit reached). Reset budget for demo or start a new session.
        </div>
      )}
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={budgetExceeded ? 'Budget exceeded...' : 'Ask IRIS anything...'}
          disabled={disabled || budgetExceeded}
          rows={1}
          className="input-brutal flex-1 resize-none min-h-[44px] max-h-[200px] disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending || disabled || budgetExceeded}
          className="btn-primary p-3 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {sending ? (
            <RiLoader4Line className="w-5 h-5 animate-spin" />
          ) : (
            <RiSendPlaneLine className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-gray-600 mt-2 font-mono">
        Shift+Enter for new line · Rate limited to 15 messages/min
      </p>
    </div>
  );
}
