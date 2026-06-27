'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { RiTimeLine } from 'react-icons/ri';

const getTierColor = (tier) => {
  if (tier === 'Haiku 4.5') return 'bg-sunny';
  if (tier === 'Sonnet 4.6') return 'bg-coral';
  return 'bg-mint'; // Kimi K2.6
};

export default function LiveRoutingFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ink/40 space-y-4">
        <div className="w-16 h-16 border-[4px] border-dashed border-ink/20 rounded-full flex items-center justify-center">
          <RiTimeLine className="w-8 h-8" />
        </div>
        <p className="font-bold text-sm uppercase tracking-widest text-center">Waiting for queries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`p-4 bg-white border-[3px] border-ink rounded-2xl shadow-[4px_4px_0_#1A1A2E] relative overflow-hidden`}
          >
            {/* Colored side accent (rounded) */}
            <div className={`absolute left-0 top-0 bottom-0 w-3 border-r-[3px] border-ink ${getTierColor(event.modelDisplayName || event.tier)}`} />
            
            <div className="pl-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-black uppercase text-ink/50 tracking-widest">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-mono font-bold text-[10px] bg-cream border-[2px] border-ink px-2 py-0.5 rounded-full text-ink">
                  ${Number(event.cost).toFixed(4)}
                </span>
              </div>
              
              <h4 className="font-bold text-ink text-sm mb-2 break-words">"{event.promptExcerpt}"</h4>
              
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t-[2px] border-ink/10">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border-[2px] border-ink rounded-full ${getTierColor(event.modelDisplayName || event.tier)}`}>
                  {event.modelDisplayName || event.tier}
                </span>
                <span className="text-[10px] font-bold text-ink/70 px-2 py-1 bg-cream border-[2px] border-transparent rounded-full flex-1 truncate" title={event.reason}>
                  {event.reason}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
