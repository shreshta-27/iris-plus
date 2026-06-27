'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { RiMoneyDollarCircleLine, RiBrainLine, RiRouteLine, RiLineChartLine } from 'react-icons/ri';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/overview')
      .then(setData)
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse p-6 bg-brutal-card h-full border-2 border-brutal-border">Loading Analytics...</div>;
  }

  if (!data) return <div>Failed to load analytics.</div>;

  const modelData = Object.entries(data.modelDistribution).map(([name, value]) => ({ name: name.split('/')[1] || name, value }));
  const complexityData = [
    { name: 'Simple', value: data.complexityBuckets.simple },
    { name: 'Medium', value: data.complexityBuckets.medium },
    { name: 'Complex', value: data.complexityBuckets.complex },
  ].filter(d => d.value > 0);

  const historyChartData = data.recentHistory.map((h, i) => ({
    name: `Q${i + 1}`,
    cost: h.cost,
    score: h.score
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Usage & Analytics</h1>
        <p className="text-sm text-gray-400 font-mono">Real-time insights into your AI budget and routing efficiency.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brutal-card border-2 border-brutal-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <RiRouteLine className="w-5 h-5" />
            <span className="text-xs uppercase font-bold">Total Queries</span>
          </div>
          <span className="text-3xl font-black">{data.summary.totalCalls}</span>
        </div>
        
        <div className="bg-brutal-card border-2 border-brutal-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <RiMoneyDollarCircleLine className="w-5 h-5" />
            <span className="text-xs uppercase font-bold">Actual Cost</span>
          </div>
          <span className="text-3xl font-black text-white">${data.summary.totalCost.toFixed(4)}</span>
        </div>

        <div className="bg-emerald-500/10 border-2 border-emerald-500 p-4 flex flex-col gap-2 lg:col-span-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 z-10">
            <RiLineChartLine className="w-5 h-5" />
            <span className="text-xs uppercase font-bold">IRIS Saved You</span>
          </div>
          <div className="flex items-end gap-3 z-10">
            <span className="text-3xl font-black text-emerald-400">${data.summary.savedCost.toFixed(4)}</span>
            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/20 px-2 py-0.5 mb-1">
              {data.summary.savingsPercent}% savings
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-1 z-10">Compared to routing all queries to Claude Sonnet 4.6</p>
          <RiMoneyDollarCircleLine className="absolute -right-4 -bottom-8 w-32 h-32 text-emerald-500/10 rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost over time */}
        <div className="bg-brutal-card border-2 border-brutal-border p-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Cost Per Query Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '0' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-brutal-card border-2 border-brutal-border p-4 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Model Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            {modelData.length > 0 ? (
              <div className="w-full h-64 relative flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {modelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {modelData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs font-mono">
                      <div className="w-3 h-3" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-300">{entry.name}</span>
                      <span className="font-bold ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 font-mono text-xs">No model data yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
