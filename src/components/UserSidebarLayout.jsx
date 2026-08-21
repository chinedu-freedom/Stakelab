'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  Coins,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Users,
  Headphones,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  Bell,
} from 'lucide-react';

import api from '../lib/api';

export default function UserSidebarLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);
  }, []);

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Wallet', path: '/wallet', icon: Wallet },
    { label: 'Staking', path: '/staking', icon: Coins },
    {
      label: 'Currency',
      icon: DollarSign,
      matchPath: '/currency',
      submenu: [
        { label: 'Currency List', path: '/currency' },
      ],
    },
    {
      label: 'Deposits',
      icon: ArrowDownLeft,
      matchPath: '/deposit',
      submenu: [
        { label: 'New Deposit', path: '/deposit' },
        { label: 'Deposit history', path: '/deposit/history' },
      ],
    },
    {
      label: 'Manage Withdraw',
      icon: ArrowUpRight,
      matchPath: '/withdraw',
      submenu: [
        { label: 'Withdraw', path: '/withdraw' },
        { label: 'Add Wallet', path: '/withdraw/wallet' },
        { label: 'Withdraw history', path: '/withdraw/history' },
      ],
    },
    { label: 'Transaction', path: '/transactions', icon: History },
    { label: 'Referrals', path: '/referrals', icon: Users },
    {
      label: 'Support',
      icon: Headphones,
      matchPath: '/support',
      submenu: [
        { label: 'WhatsApp Live Support', path: whatsappLink, external: true },
        { label: 'Create Ticket', path: '/support/create' },
        { label: 'All Tickets', path: '/support' },
      ],
    },
    { label: '2FA Security', path: '/security', icon: ShieldCheck },
  ];

  // Auto expand parent submenu if current route matches
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.submenu) {
        const isMatch = item.submenu.some((sub) => pathname === sub.path || (item.matchPath && pathname.startsWith(item.matchPath)));
        if (isMatch) {
          setOpenSubmenu(item.label);
        }
      }
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#061127] text-slate-100 font-sans flex flex-col">
      {/* Top Header Navbar */}
      <header className="h-16 bg-[#07142d] border-b border-[#142343] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center font-righteous text-white font-bold text-lg shadow-md shadow-red-500/20">
              S
            </div>
            <span className="text-xl font-extrabold text-white font-righteous tracking-wide">
              Stake<span className="text-gradient-stakelab">Lab</span>
            </span>
          </Link>
        </div>

        {/* Right Side: User Profile Header Badge */}
        <div className="flex items-center space-x-3">
          <div
            onClick={logout}
            className="flex items-center space-x-3 bg-[#0c1a38] hover:bg-[#12234a] border border-[#18294d] rounded-full pl-1.5 pr-4 py-1 cursor-pointer transition-all"
            title="Click to Log Out"
          >
            <div className="w-8 h-8 rounded-full bg-[#16274a] text-slate-200 flex items-center justify-center border border-[#233863]">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {user?.username || user?.full_name || 'Sparko'}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                [Email is protected for the demo]
              </div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-red-400 hover:scale-110 transition-transform" />
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Sidebar & Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Drawer */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#07142d] border-r border-[#142343] transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto no-scrollbar ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div>
            {/* User Info Sidebar Card (Matching Reference Screenshot) */}
            <div className="p-4">
              <div className="bg-[#0b1834] border border-red-500/40 rounded-xl p-4 text-center relative overflow-hidden shadow-lg shadow-red-500/5">
                {/* Red Dollar Circle Icon */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold flex items-center justify-center mx-auto mb-2 text-xs shadow-md shadow-red-500/30">
                  $
                </div>
                {/* User Name */}
                <div className="text-sm font-bold text-white truncate font-righteous">
                  {user?.full_name || 'Chinedu Afamefuna'}
                </div>
                {/* Balance Label */}
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  Balance
                </div>
                {/* Balance Amount with Tether Symbol ₮ */}
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ₮{parseFloat(user?.balance || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="px-3 space-y-1.5 pb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                const hasSubmenu = Boolean(item.submenu);
                const isSubOpen = openSubmenu === item.label;

                if (hasSubmenu) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                          pathname.startsWith(item.path || '')
                            ? 'text-white bg-[#0e1d3e]'
                            : 'text-slate-300 hover:text-white hover:bg-[#0c1a38]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            isSubOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Submenu Dropdown Items */}
                      {isSubOpen && (
                        <div className="pl-6 pr-2 space-y-1 py-1">
                          {item.submenu.map((sub) => {
                            const isSubActive = pathname === sub.path;
                            if (sub.external) {
                              return (
                                <a
                                  key={sub.path}
                                  href={sub.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-2.5 py-2 px-3.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:bg-[#0c1a38] transition-all"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-90" />
                                  <span>{sub.label}</span>
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={sub.path}
                                href={sub.path}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2.5 py-2 px-3.5 rounded-lg text-xs font-semibold transition-all ${
                                  isSubActive
                                    ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20 font-bold'
                                    : 'text-slate-400 hover:text-white hover:bg-[#0c1a38]'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-[#0c1a38]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Log Out Action Item */}
              <button
                onClick={logout}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Backdrop overlay for mobile drawer */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-[#061127] p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
