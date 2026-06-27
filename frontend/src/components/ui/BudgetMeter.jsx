'use client';
import { BUDGET_MODES } from '@/lib/constants';

export default function BudgetMeter({ budget }) {
  if (!budget) return null;

  const modeStyle = BUDGET_MODES[budget.mode] || BUDGET_MODES.normal;
  const percent = Math.min(budget.percentUsed || 0, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget</span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase ${modeStyle.color}`}>
            {modeStyle.label}
          </span>
          <span className="text-xs font-mono text-gray-400">
            ${budget.spent?.toFixed(4)} / ${budget.total?.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="h-2 bg-brutal-black border border-brutal-border overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${modeStyle.bg}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] font-mono text-gray-600">
          {budget.calls || 0} calls · {budget.blockedCalls || 0} blocked
        </span>
        <span className="text-[10px] font-mono text-gray-600">
          ${budget.remaining?.toFixed(4)} left
        </span>
      </div>
    </div>
  );
}
