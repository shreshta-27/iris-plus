'use client';
import RoutingChip from '@/components/ui/RoutingChip';
import InjectionBadge from '@/components/ui/InjectionBadge';
import { RiUser3Line, RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isBlocked = message.isBlocked;

  let bgClass = 'bg-white border-3 border-ink shadow-[4px_4px_0_#1A1A2E]';
  let accentClass = 'border-l-[8px] border-l-mint';
  
  if (isUser) {
    bgClass = 'bg-iris-purple/10 border-3 border-ink shadow-[4px_4px_0_#1A1A2E]';
    accentClass = 'border-l-[8px] border-l-iris-purple';
  } else if (isError || isBlocked) {
    bgClass = 'bg-coral/10 border-3 border-ink shadow-[4px_4px_0_#1A1A2E]';
    accentClass = 'border-l-[8px] border-l-coral';
  }

  return (
    <div className={`flex gap-3 md:gap-4 p-4 md:p-5 mb-4 animate-slide-up ${bgClass} ${accentClass}`}>
      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 border-ink shadow-[2px_2px_0_#1A1A2E] ${isUser ? 'bg-iris-purple text-white' : 'bg-mint text-ink'}`}>
        {isUser ? <RiUser3Line className="w-5 h-5" /> : <RiRobot2Line className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-sm font-black text-ink uppercase tracking-wider">
            {isUser ? 'You' : 'IRIS'}
          </span>
          {!isUser && message.injectionStatus && (
            <InjectionBadge status={message.injectionStatus} />
          )}
        </div>

        <div className="text-base text-ink font-medium leading-relaxed break-words prose prose-sm max-w-none prose-headings:font-black prose-a:text-iris-purple prose-code:font-mono prose-code:bg-cream prose-code:border prose-code:border-ink/20 prose-code:px-1 prose-pre:border-3 prose-pre:border-ink prose-pre:bg-ink prose-pre:text-cream prose-pre:shadow-[4px_4px_0_#1A1A2E]">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.routing && (
          <div className="mt-4 pt-4 border-t-2 border-ink/10">
            <RoutingChip routing={message.routing} cost={message.cost} />
            {message.routing.reason && (
              <p className="text-[11px] font-mono font-bold text-ink/50 mt-2 bg-cream p-2 border-2 border-ink/20">
                <span className="text-ink">ROUTING_REASON:</span> {message.routing.reason}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
