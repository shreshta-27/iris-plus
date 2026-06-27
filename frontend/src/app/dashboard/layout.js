'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Sidebar from '@/components/dashboard/Sidebar';
import BudgetMeter from '@/components/ui/BudgetMeter';
import { useBudget } from '@/hooks/useBudget';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { stats, fetchStats } = useBudget('demo-session-id'); // use fixed session for demo

  useEffect(() => {
    api.get('/api/auth/me')
      .then(data => {
        setUser(data.user);
        fetchStats();
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router, fetchStats]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brutal-black text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-brutal-black text-white overflow-hidden">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b-2 border-brutal-border flex items-center justify-between px-6 bg-brutal-card shrink-0">
          <h2 className="font-bold text-lg hidden sm:block">IRIS Student Dashboard</h2>
          <div className="w-64 md:w-80">
            {stats && <BudgetMeter stats={stats} />}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-brutal-black">
          {children}
        </div>
      </main>
    </div>
  );
}
