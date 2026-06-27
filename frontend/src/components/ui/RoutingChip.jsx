'use client';
import { RiCpuLine } from 'react-icons/ri';

export default function RoutingChip({ routing, cost }) {
  if (!routing) return null;

  const getTierColor = (tier) => {
    const t = tier?.toLowerCase() || '';
    if (t.includes('complex')) return 'coral';
    if (t.includes('medium')) return 'sunny';
    return 'mint';
  };

  const colorName = getTierColor(routing.tier);

  return (
    <div className={`inline-flex items-center bg-cream border-2 border-ink shadow-[2px_2px_0_#1A1A2E]`}>
      <div className={`bg-${colorName} px-2 py-1 border-r-2 border-ink flex items-center gap-1`}>
        <RiCpuLine className="w-4 h-4 text-ink" />
        <span className="text-[10px] font-black text-ink uppercase tracking-widest">
          {routing.tier || 'Simple'}
        </span>
      </div>
      <div className="px-3 py-1 flex items-center gap-3">
        <span className="text-xs font-bold text-ink">
          {routing.modelDisplayName || 'Kimi K2.6'}
        </span>
        {cost !== undefined && (
          <span className="text-[10px] font-mono font-bold text-ink/70 bg-white px-1 border border-ink/20">
            ${cost.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
