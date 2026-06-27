'use client';
import { TIER_COLORS } from '@/lib/constants';
import { RiRouteLine, RiShieldLine } from 'react-icons/ri';

export default function LiveRoutingFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 text-xs font-mono">
        No routing events yet. Send a message to see live routing decisions.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {events.slice(0, 15).map((event, i) => {
        const isBlocked = event.type === 'injection_blocked';
        const tierStyle = TIER_COLORS[event.tier] || TIER_COLORS.simple;

        return (
          <div key={i} className={`flex items-start gap-2 p-2 animate-fade-in text-xs ${isBlocked ? 'bg-red-500/5 border border-red-500/20' : 'bg-brutal-black border border-brutal-border'}`}>
            {isBlocked ? (
              <RiShieldLine className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            ) : (
              <RiRouteLine className="w-3.5 h-3.5 text-iris-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              {isBlocked ? (
                <span className="text-red-400 font-bold">Injection Blocked</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${tierStyle.bg} ${tierStyle.text}`}>
                    {event.tier}
                  </span>
                  <span className="text-gray-400 font-mono">{event.modelDisplayName}</span>
                  {event.cost?.thisCallFormatted && (
                    <span className="text-emerald-400 font-mono">{event.cost.thisCallFormatted}</span>
                  )}
                </div>
              )}
              <p className="text-gray-600 font-mono mt-0.5 truncate">
                {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : ''}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
