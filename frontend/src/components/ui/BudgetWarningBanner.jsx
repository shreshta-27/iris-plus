'use client';
import { RiAlertLine, RiErrorWarningLine } from 'react-icons/ri';

export default function BudgetWarningBanner({ mode }) {
  if (!mode || mode === 'normal') return null;

  const isExceeded = mode === 'exceeded';
  const bgColor = isExceeded ? 'bg-coral' : 'bg-sunny';
  const Icon = isExceeded ? RiErrorWarningLine : RiAlertLine;
  const title = isExceeded ? 'Budget Exceeded' : 'Budget Warning';
  const message = isExceeded 
    ? 'You have reached the $2.00 session limit. API calls are now blocked.'
    : 'You are approaching the $2.00 session limit. Watch your usage.';

  return (
    <div className={`${bgColor} border-b-3 border-ink px-4 py-3 flex items-center justify-between shadow-[0_4px_0_#1A1A2E] relative z-20`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white border-2 border-ink flex items-center justify-center shadow-[2px_2px_0_#1A1A2E]">
          <Icon className="w-5 h-5 text-ink animate-wiggle" />
        </div>
        <div>
          <h4 className="font-black text-ink uppercase tracking-widest text-sm leading-tight">{title}</h4>
          <p className="text-ink font-bold text-xs">{message}</p>
        </div>
      </div>
    </div>
  );
}
