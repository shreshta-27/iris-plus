'use client';
import { RiAlertLine, RiErrorWarningLine, RiCloseCircleLine } from 'react-icons/ri';

export default function BudgetWarningBanner({ mode, onDismiss }) {
  if (mode === 'normal') return null;

  const configs = {
    caution: {
      icon: RiAlertLine,
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      message: 'Budget Caution — Medium queries are being routed to Kimi to conserve budget.',
    },
    critical: {
      icon: RiErrorWarningLine,
      bg: 'bg-red-500/15 border-red-500/30',
      text: 'text-red-400',
      message: 'Budget Critical — ALL queries are now routed to Kimi only. Very low budget remaining.',
    },
    exceeded: {
      icon: RiCloseCircleLine,
      bg: 'bg-red-500/20 border-red-600/40',
      text: 'text-red-300',
      message: 'Budget Exceeded — $2.00 daily limit reached. AI features are paused until budget resets.',
    },
  };

  const config = configs[mode];
  if (!config) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border ${config.bg} animate-slide-up`}>
      <config.icon className={`w-5 h-5 flex-shrink-0 ${config.text}`} />
      <p className={`text-sm font-medium flex-1 ${config.text}`}>{config.message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300">
          <RiCloseCircleLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
