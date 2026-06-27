'use client';
import RoutingChip from '@/components/ui/RoutingChip';
import InjectionBadge from '@/components/ui/InjectionBadge';
import { RiUser3Line, RiRobot2Line } from 'react-icons/ri';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 p-4 animate-slide-up ${isUser ? '' : 'bg-brutal-card/50'}`}>
      <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm font-bold ${isUser ? 'bg-iris-600 text-white' : 'bg-brutal-border text-iris-400'}`}>
        {isUser ? <RiUser3Line className="w-4 h-4" /> : <RiRobot2Line className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0">
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

        {!isUser && message.routing && (
          <RoutingChip routing={message.routing} cost={message.cost} />
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
