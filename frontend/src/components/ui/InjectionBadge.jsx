'use client';
import { RiShieldCheckLine, RiShieldCrossLine } from 'react-icons/ri';

export default function InjectionBadge({ status }) {
  if (!status || status === 'unknown') return null;

  const isSafe = status === 'safe';
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 border-2 border-ink shadow-[2px_2px_0_#1A1A2E] ${isSafe ? 'bg-mint' : 'bg-coral text-white'}`}>
      {isSafe ? (
        <RiShieldCheckLine className="w-4 h-4 text-ink" />
      ) : (
        <RiShieldCrossLine className="w-4 h-4 text-white" />
      )}
      <span className={`text-[10px] font-black uppercase tracking-widest ${isSafe ? 'text-ink' : 'text-white'}`}>
        {isSafe ? 'PIGuard Safe' : 'Injection Blocked'}
      </span>
    </div>
  );
}
