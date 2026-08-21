'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Layers, LayoutDashboard, Coins, ArrowDownLeft, ArrowUpRight, History, LogOut, User } from 'lucide-react';

export default function UserNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Staking Pools', path: '/staking', icon: Coins },
    { label: 'Deposit', path: '/deposit', icon: ArrowDownLeft },
    { label: 'Withdraw', path: '/withdraw', icon: ArrowUpRight },
    { label: 'Transactions', path: '/transactions', icon: History },
  ];

  return (
    <header className="border-b border-slate-800 bg-darkBg/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-brand-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Layers className="w-6 h-6 text-darkBg stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Stake<span className="text-brandPrimary">lab</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-brandPrimary/10 text-brandPrimary border border-brandPrimary/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium">{user?.full_name || 'Staker'}</span>
            <span className="text-xs text-brandPrimary font-mono font-bold">${parseFloat(user?.balance || 0).toFixed(2)}</span>
          </div>

          <button
            onClick={logout}
            className="p-2.5 rounded-md bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-slate-700/50"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
