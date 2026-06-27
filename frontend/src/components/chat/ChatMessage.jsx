'use client';
import { useState } from 'react';
import RoutingChip from '@/components/ui/RoutingChip';
import InjectionBadge from '@/components/ui/InjectionBadge';
import { RiUser3Line, RiRobot2Line, RiFileCopyLine, RiCheckLine } from 'react-icons/ri';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 p-4 animate-slide-up ${isUser ? '' : 'bg-brutal-card/50'}`}>
      <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm font-bold ${isUser ? 'bg-iris-600 text-white' : 'bg-brutal-border text-iris-400'}`}>
        {isUser ? <RiUser3Line className="w-4 h-4" /> : <RiRobot2Line className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0 group relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gray-400 uppercase">
            {isUser ? 'You' : 'IRIS'}
          </span>
          {!isUser && message.injectionStatus && (
            <InjectionBadge status={message.injectionStatus} />
          )}
        </div>

        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-3">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 bg-brutal-black border border-brutal-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-[10px] uppercase font-bold"
            >
              {copied ? <RiCheckLine className="w-3 h-3 text-emerald-400" /> : <RiFileCopyLine className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            {message.routing && (
              <RoutingChip routing={message.routing} cost={message.cost} />
            )}
          </div>
        )}

        {!isUser && message.routing?.reason && (
          <p className="text-[10px] font-mono text-gray-600 mt-1.5">
            {message.routing.reason}
          </p>
        )}
      </div>
    </div>
  );
}
