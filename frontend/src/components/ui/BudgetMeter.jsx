'use client';
import { RiWallet3Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function BudgetMeter({ budget }) {
  if (!budget) return null;
  
  const { totalCost, maxBudget, mode } = budget;
  const percentage = Math.min((totalCost / maxBudget) * 100, 100);
  
  let statusColor = 'bg-mint';
  if (mode === 'warning') statusColor = 'bg-sunny';
  if (mode === 'exceeded') statusColor = 'bg-coral';

  return (
    <div className="bg-cream border-3 border-ink p-2 sm:p-3 shadow-[4px_4px_0_#1A1A2E] flex flex-col gap-2 w-full max-w-sm">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <RiWallet3Line className="text-ink w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-ink">Session Budget</span>
        </div>
        <div className="font-mono font-bold text-xs sm:text-sm text-ink bg-white px-2 py-0.5 border-2 border-ink">
          ${totalCost.toFixed(4)} <span className="text-ink/50">/ ${maxBudget.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="h-4 sm:h-5 w-full bg-white border-2 border-ink shadow-[inset_2px_2px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
        <motion.div 
          className={`h-full ${statusColor} border-r-2 border-ink`}
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
