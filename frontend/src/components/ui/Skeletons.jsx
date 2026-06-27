'use client';

export function SkeletonCard() {
  return (
    <div className="neo-card p-6 animate-pulse">
      <div className="skeleton h-4 w-24 mb-4" />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="flex gap-3 p-4 animate-fade-in">
      <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="skeleton h-3 w-20 mb-3" />
        <div className="skeleton h-3 w-full mb-2" />
        <div className="skeleton h-3 w-4/5 mb-2" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
