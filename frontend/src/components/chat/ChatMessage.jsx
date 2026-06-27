'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Premium dark mode syntax highlighting
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

  // Neo-Brutalist rounded bubble styling
  let containerClass = 'flex gap-4 p-5 md:p-6 mb-2 animate-slide-up bg-white border-[4px] border-ink shadow-[6px_6px_0_#1A1A2E]';
  let borderRadiusClass = 'rounded-[2rem] rounded-tl-sm'; // AI messages: square top-left
  let avatarColor = 'bg-mint text-ink';

  if (isUser) {
    containerClass = 'flex gap-4 p-5 md:p-6 mb-2 animate-slide-up bg-[#F5F0FF] border-[4px] border-ink shadow-[6px_6px_0_#1A1A2E]';
    borderRadiusClass = 'rounded-[2rem] rounded-tr-sm'; // User messages: square top-right
    avatarColor = 'bg-iris-purple text-white';
  } else if (isError || isBlocked) {
    containerClass = 'flex gap-4 p-5 md:p-6 mb-2 animate-slide-up bg-[#FFF0F0] border-[4px] border-ink shadow-[6px_6px_0_#1A1A2E]';
    borderRadiusClass = 'rounded-[2rem] rounded-tl-sm';
    avatarColor = 'bg-coral text-ink';
  }

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${containerClass} ${borderRadiusClass}`}>
        
        {/* Avatar */}
        <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-[3px] border-ink rounded-full shadow-[2px_2px_0_#1A1A2E] ${avatarColor}`}>
          {isUser ? <RiUser3Line className="w-6 h-6" /> : <RiRobot2Line className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0 pt-1 group relative">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-sm font-black text-ink uppercase tracking-widest">
              {isUser ? 'You' : 'IRIS'}
            </span>
            {!isUser && message.injectionStatus && (
              <InjectionBadge status={message.injectionStatus} />
            )}
          </div>

          <div className="text-base md:text-lg text-ink font-medium leading-relaxed break-words prose prose-base max-w-none prose-headings:font-black prose-a:text-iris-purple prose-code:font-mono prose-code:bg-cream prose-code:border-2 prose-code:border-ink/20 prose-code:px-2 prose-code:rounded-lg prose-pre:border-[4px] prose-pre:border-ink prose-pre:bg-ink prose-pre:text-cream prose-pre:shadow-[6px_6px_0_#1A1A2E] prose-pre:rounded-2xl">
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
            <div className="mt-6 pt-5 border-t-[3px] border-ink/10 flex flex-col gap-3">
              <RoutingChip routing={message.routing} cost={message.cost} />
              {message.routing.reason && (
                <p className="text-xs font-mono font-bold text-ink/70 mt-3 bg-white p-3 border-[3px] border-ink/20 rounded-xl">
                  <span className="text-ink">ROUTING_REASON:</span> {message.routing.reason}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
