'use client';
import { RiShieldCheckLine, RiAlertLine } from 'react-icons/ri';

export default function InjectionBadge({ status }) {
  if (status === 'blocked') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-red-500/15 text-red-400 border border-red-500/30">
        <RiAlertLine className="w-3 h-3" />
        ⛔ Blocked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <RiShieldCheckLine className="w-3 h-3" />
      ✓ Clean
    </span>
  );
}
