'use client';
import { TIER_COLORS } from '@/lib/constants';

export default function RoutingChip({ routing, cost }) {
  if (!routing) return null;

  const tierStyle = TIER_COLORS[routing.tier] || TIER_COLORS.simple;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 animate-fade-in">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold font-mono uppercase border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {routing.modelDisplayName || routing.model}
      </span>

      {routing.score !== undefined && (
        <span className="px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-brutal-black border border-brutal-border">
          score {routing.score}
        </span>
      )}

      {cost?.thisCallFormatted && (
        <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          {cost.thisCallFormatted}
        </span>
      )}

      {routing.degraded && (
        <span className="px-2 py-0.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
          ↓ degraded
        </span>
      )}
    </div>
  );
}
