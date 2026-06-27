'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import Sidebar from '@/components/dashboard/Sidebar';
import BudgetMeter from '@/components/ui/BudgetMeter';
import { useBudget } from '@/hooks/useBudget';
import { RiMenuLine } from 'react-icons/ri';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { budget: stats, fetchBudget: fetchStats } = useBudget('demo-session-id');

  useEffect(() => {
    api.get('/api/auth/me')
      .then(data => {
        setUser(data.user);
        fetchStats();
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink">
        <div className="w-20 h-20 bg-iris-purple border-[4px] border-ink rounded-full animate-float mb-6 shadow-[8px_8px_0_#1A1A2E]"></div>
        <p className="font-mono font-bold animate-pulse text-lg">Loading IRIS...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDF9F3] text-ink overflow-hidden p-2 md:p-4 gap-4">
      
      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden bg-cream border-[4px] border-ink rounded-[2rem] shadow-[8px_8px_0_#1A1A2E] relative">
        {/* Header bar */}
        <header className="h-20 border-b-[4px] border-ink flex items-center justify-between px-6 bg-white shrink-0 relative z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 text-ink bg-sunny border-[3px] border-ink rounded-xl hover:bg-iris-purple hover:text-white transition-colors shadow-[4px_4px_0_#1A1A2E] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A2E]"
            >
              <RiMenuLine className="w-6 h-6" />
            </button>
            <h2 className="font-black text-2xl hidden sm:block tracking-tight text-ink">Student Dashboard</h2>
          </div>
          <div className="w-48 sm:w-64 md:w-80">
            {stats && <BudgetMeter budget={stats} />}
          </div>
        </header>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-cream relative z-0 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
