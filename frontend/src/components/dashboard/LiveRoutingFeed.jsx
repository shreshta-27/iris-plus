'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveRoutingFeed({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center p-4">
        <div className="w-12 h-12 bg-cream border-3 border-ink flex items-center justify-center mb-3 shadow-[2px_2px_0_#1A1A2E]">
          <span className="text-xl animate-pulse">📡</span>
        </div>
        <p className="text-sm font-bold text-ink/60 uppercase tracking-widest">Waiting for traffic...</p>
      </div>
    );
  }

  const getEventColor = (tier) => {
    const t = tier?.toLowerCase() || '';
    if (t.includes('complex')) return 'coral';
    if (t.includes('medium')) return 'sunny';
    return 'mint';
  };

  return (
    <div className="space-y-3 font-mono">
      <AnimatePresence>
        {events.map((ev) => {
          const color = getEventColor(ev.tier);
          
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-cream border-2 border-ink p-2 text-xs relative overflow-hidden shadow-[2px_2px_0_#1A1A2E]"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${color} border-r-2 border-ink`}></div>
              <div className="pl-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-ink uppercase tracking-wider">{ev.type}</span>
                  <span className="text-[9px] text-ink/50 bg-white px-1 border border-ink/20">{ev.timestamp}</span>
                </div>
                <div className="text-[10px] text-ink font-bold mb-1 truncate">
                  User: {ev.user}
                </div>
                <div className="flex justify-between items-center bg-white p-1 border border-ink/20">
                  <span className={`text-${color} font-black drop-shadow-sm`}>{ev.tier}</span>
                  <span className="text-ink font-bold">{ev.model}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
