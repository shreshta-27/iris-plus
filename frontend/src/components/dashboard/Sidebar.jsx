'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiRobot2Line, RiBookOpenLine, RiRocketLine, RiLogoutBoxLine, RiCloseLine } from 'react-icons/ri';

const navItems = [
  { href: '/dashboard', icon: RiRobot2Line, label: 'AI Assistant', color: 'iris-purple' },
  { href: '/dashboard/quiz', icon: RiBookOpenLine, label: 'Quiz Forge', color: 'sunny' },
  { href: '/dashboard/career', icon: RiRocketLine, label: 'Career Sim', color: 'peach' },
];

export default function Sidebar({ user, onLogout, onClose }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r-3 border-ink flex flex-col h-screen relative">
      <div className="p-5 border-b-3 border-ink flex justify-between items-center bg-cream">
        <Link href="/" className="flex flex-col">
          <span className="text-3xl font-black text-ink flex items-center gap-1">
            IRIS <span className="text-iris-purple">✦</span>
          </span>
          <span className="font-caveat text-ink/70 text-lg leading-none -mt-1 ml-1">
            Intelligent Routing
          </span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-ink border-2 border-transparent hover:border-ink bg-white shadow-[2px_2px_0_#1A1A2E]"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 font-bold transition-all border-3
                ${active
                  ? `bg-${item.color}/10 border-${item.color} shadow-[4px_4px_0_var(--color-${item.color})] text-ink`
                  : 'bg-cream border-transparent text-ink/70 hover:border-ink hover:text-ink hover:shadow-[4px_4px_0_#1A1A2E] hover:-translate-y-1'
                }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center border-2 border-ink bg-${item.color} shadow-[2px_2px_0_#1A1A2E]`}>
                <item.icon className="w-4 h-4 text-ink" />
              </div>
              <span className="text-base tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t-3 border-ink bg-cream">
        {user && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-white border-2 border-ink shadow-[2px_2px_0_#1A1A2E]">
            <div className="w-10 h-10 bg-mint border-2 border-ink flex items-center justify-center text-ink font-black text-lg">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-ink truncate">{user.name}</p>
              <p className="text-xs font-mono text-ink/60 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 font-bold text-ink bg-coral border-3 border-ink px-4 py-3 w-full shadow-[4px_4px_0_#1A1A2E] hover:-translate-y-1 transition-transform"
        >
          <RiLogoutBoxLine className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
