export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const MODEL_DISPLAY_NAMES = {
  'mzai:moonshotai/Kimi-K2.6': 'Kimi K2.6',
  'anthropic:claude-haiku-4-5': 'Claude Haiku 4.5',
  'anthropic:claude-sonnet-4-6': 'Claude Sonnet 4.6',
  'Local KB': 'Local KB',
};

export const TIER_COLORS = {
  simple: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  complex: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  cached: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export const BUDGET_MODES = {
  normal: { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Normal' },
  caution: { color: 'text-amber-400', bg: 'bg-amber-500', label: 'Caution' },
  critical: { color: 'text-red-400', bg: 'bg-red-500', label: 'Critical' },
  exceeded: { color: 'text-red-600', bg: 'bg-red-600', label: 'Exceeded' },
};
