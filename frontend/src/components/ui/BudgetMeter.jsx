'use client';
import { RiWallet3Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function BudgetMeter({ budget }) {
  if (!budget) return null;
  
  const { totalCost = 0, maxBudget = 2, mode = 'normal' } = budget;
  const percentage = Math.min((totalCost / maxBudget) * 100, 100);
  
  let statusColor = 'bg-mint';
  if (mode === 'warning') statusColor = 'bg-sunny';
  if (mode === 'exceeded') statusColor = 'bg-coral';

  return (
    <div className="bg-cream border-[4px] border-ink p-3 shadow-[6px_6px_0_#1A1A2E] flex flex-col gap-3 w-full max-w-sm rounded-2xl hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <RiWallet3Line className="text-ink w-5 h-5" />
          <span className="font-black text-sm uppercase tracking-widest text-ink">Session Budget</span>
        </div>
        <div className="font-mono font-bold text-sm text-ink bg-white px-3 py-1 border-[3px] border-ink rounded-full shadow-[2px_2px_0_#1A1A2E]">
          ${totalCost.toFixed(4)} <span className="text-ink/50">/ ${maxBudget.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="h-6 w-full bg-white border-[4px] border-ink rounded-full shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
        <motion.div 
          className={`h-full ${statusColor} border-r-[3px] border-ink rounded-r-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50 }}
        />
        {/* Zebra stripes for Neo-Brutalist effect on progress bar */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #1A1A2E 10px, #1A1A2E 20px)' }}
        ></div>
      </div>
    </div>
  );
}
