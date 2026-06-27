'use client';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 mb-4 bg-white border-3 border-ink shadow-[4px_4px_0_#1A1A2E] border-l-[8px] border-l-mint w-fit animate-slide-up">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-mint border-2 border-ink shadow-[2px_2px_0_#1A1A2E] text-ink text-sm font-bold">
        ✦
      </div>
      <div className="flex items-center gap-2 pt-1 pl-1">
        <span className="w-2.5 h-2.5 bg-ink border border-ink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 bg-ink border border-ink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 bg-ink border border-ink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-sm text-ink/70 ml-3 font-caveat font-bold tracking-wide">IRIS is thinking...</span>
      </div>
    </div>
  );
}
