'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiRobot2Line, RiBookOpenLine, RiRocketLine, RiLogoutBoxLine, RiHome2Line } from 'react-icons/ri';

const navItems = [
  { href: '/dashboard', icon: RiRobot2Line, label: 'AI Assistant' },
  { href: '/dashboard/quiz', icon: RiBookOpenLine, label: 'Quiz Forge' },
  { href: '/dashboard/career', icon: RiRocketLine, label: 'Career Sim' },
];

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brutal-card border-r-2 border-brutal-border flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b-2 border-brutal-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black gradient-text">IRIS</span>
        </Link>
        <p className="text-[10px] font-mono text-gray-600 mt-0.5">
          Intelligent Routing System
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-all
                ${active
                  ? 'bg-iris-600/15 text-iris-400 border-l-2 border-iris-600'
                  : 'text-gray-400 hover:text-white hover:bg-brutal-hover border-l-2 border-transparent'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-brutal-border">
        {user && (
          <div className="mb-3">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <RiLogoutBoxLine className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
