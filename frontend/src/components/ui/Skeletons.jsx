'use client';

export const CardSkeleton = () => (
  <div className="neo-card bg-cream p-6 animate-pulse border-ink border-3">
    <div className="w-12 h-12 bg-ink/20 border-2 border-ink mb-4"></div>
    <div className="h-6 bg-ink/20 w-3/4 mb-4 border-2 border-ink/10"></div>
    <div className="h-4 bg-ink/20 w-full mb-2 border border-ink/10"></div>
    <div className="h-4 bg-ink/20 w-5/6 border border-ink/10"></div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="flex gap-4 p-4 mb-4 bg-white border-3 border-ink shadow-[4px_4px_0_#1A1A2E] animate-pulse">
    <div className="w-10 h-10 bg-ink/20 flex-shrink-0 border-2 border-ink"></div>
    <div className="flex-1">
      <div className="h-4 bg-ink/20 w-1/4 mb-3 border border-ink/10"></div>
      <div className="h-4 bg-ink/20 w-full mb-2 border border-ink/10"></div>
      <div className="h-4 bg-ink/20 w-5/6 border border-ink/10"></div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="neo-card bg-cream p-6 animate-pulse">
    <div className="h-8 bg-ink/20 w-1/3 mb-6 border-2 border-ink"></div>
    <div className="h-48 bg-ink/20 w-full border-3 border-ink"></div>
  </div>
);
