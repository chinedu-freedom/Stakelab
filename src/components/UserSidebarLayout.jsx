'use client';

import { useState, useEffect, useRef } from 'react';
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
  Gift,
  ClipboardList,
  Disc,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  Bell,
  Key,
} from 'lucide-react';

import PageLoader from './PageLoader';
import api from '../lib/api';

export default function UserSidebarLayout({ children }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState({ unreadCount: 0, tickets: [], deposits: [], withdrawals: [] });
  const [features, setFeatures] = useState({
    giftBonus: true,
    tasks: true,
    dailyCheckin: true,
    spinWheel: true,
  });
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      window.location.href = '/login';
      return;
    }
    if (!loading && user && typeof window !== 'undefined') {
      const isComplete = Boolean(user.profile_complete || (user.country && user.mobile));
      if (!isComplete && pathname !== '/user-data') {
        window.location.href = '/user-data';
      }
    }
  }, [user, loading, pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [customLogo, setCustomLogo] = useState(null);

  useEffect(() => {
    api
      .get('/public/logo-favicon')
      .then((res) => {
        if (res.data.success && res.data.settings?.logoUrl) {
          setCustomLogo(res.data.settings.logoUrl);
        }
      })
      .catch(() => null);

    const handleLogoUpdate = (e) => {
      if (e.detail) setCustomLogo(e.detail);
    };
    window.addEventListener('site-logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('site-logo-updated', handleLogoUpdate);
  }, []);

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);

    api
      .get('/public/system-features')
      .then((res) => {
        if (res.data.success && res.data.features) {
          setFeatures(res.data.features);
        }
      })
      .catch(() => null);
  }, []);

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Staking Plans', path: '/staking/create', icon: Coins },
    { label: 'My Staking', path: '/staking', icon: DollarSign },
    {
      label: 'Manage Deposit',
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
    { label: 'Account Data', path: '/account', icon: Key },
    { label: 'My Profile', path: '/profile', icon: User },
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
    { label: 'Logout', action: 'logout', icon: LogOut },
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

  // Enforce required Profile Data completion (Mobile Number & Country)
  useEffect(() => {
    if (!loading && user) {
      const isMissingData = !user.profile_complete || !user.mobile || !user.country;
      const isDataPage = pathname === '/user-data' || pathname === '/profile' || pathname === '/logout';
      if (isMissingData && !isDataPage) {
        toast.info('Please complete your required profile details (Mobile Number & Country) to continue.');
        if (typeof window !== 'undefined') {
          window.location.href = '/user-data';
        }
      }
    }
  }, [user, loading, pathname]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#061127] text-slate-100 font-sans flex user-dashboard-wrapper">
      {/* Left Sidebar Drawer (Full Height Top-to-Bottom) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#07142d] border-r border-[#142343] transform transition-transform duration-300 ease-in-out flex flex-col h-full shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Sidebar Brand Logo - FIXED (Does NOT scroll) */}
        <div className="h-16 px-6 flex items-center border-b border-[#142343] shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            {customLogo ? (
              <img src={customLogo} alt="EverStake Logo" className="h-9 max-w-[170px] object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center font-righteous text-white font-bold text-lg shadow-md shadow-red-500/20">
                  E
                </div>
                <span className="text-xl font-extrabold text-white font-righteous tracking-wide">
                  Ever<span className="text-gradient-stakelab">Stake</span>
                </span>
              </>
            )}
          </Link>
        </div>

        {/* Scrollable Body: From Balance Card to Nav links */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* User Info Sidebar Card (Exact Matching Reference Image 2 Chamfered Notch & Gradient Border) */}
          <div className="px-4 py-3">
            {/* Outer Gradient Border Wrapper with Clip Path */}
            <div 
              className="bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 p-[1.5px] shadow-xl shadow-red-500/10"
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
              }}
            >
              {/* Inner Card Box with Matching Clip Path */}
              <div 
                className="bg-[#08152e] px-4 py-4 text-center relative overflow-hidden"
                style={{
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                }}
              >
                {/* Red-Orange Circle Icon */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold flex items-center justify-center mx-auto mb-2 text-xs shadow-md shadow-red-500/40">
                  $
                </div>
                {/* User Name */}
                <h4 className="text-sm font-bold text-white mb-2 tracking-wide font-sans text-center">
                  {user?.full_name?.trim() || user?.username || user?.email}
                </h4>
                {/* Stacked Balance Layout */}
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-200 text-center">Balance</div>
                  <div className="text-base font-extrabold text-white text-center font-sans tracking-tight">
                    ${user?.balance ? Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const hasSubmenu = Boolean(item.submenu);
              const isSubOpen = openSubmenu === item.label;

              if (hasSubmenu) {
                const isParentActive = Boolean(item.matchPath) && pathname.startsWith(item.matchPath);
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                        isParentActive
                          ? 'text-white font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-[#0e1d3e]'
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
                          return (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center justify-between py-2 px-3.5 rounded-lg text-xs font-medium transition-all ${
                                isSubActive
                                  ? 'bg-[#5b5bf5] text-white font-bold shadow-md'
                                  : 'text-slate-400 hover:text-white hover:bg-[#0e1d3e]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                <span>{sub.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.action === 'logout') {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all text-red-400 hover:text-white hover:bg-red-500/20 cursor-pointer text-left"
                  >
                    <Icon className="w-4 h-4 text-red-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-[#5b5bf5] text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#0e1d3e]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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

      {/* Right Main Column (Header + Canvas) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Navbar (Joins Sidebar from the Right) */}
        <header className="h-16 bg-[#07142d] border-b border-[#142343] shrink-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          {/* Left Side: Mobile Menu Button & Mobile Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Site Name & Logo on Small Screens */}
            <Link href="/dashboard" className="lg:hidden flex items-center space-x-2">
              {customLogo ? (
                <img src={customLogo} alt="EverStake Logo" className="h-8 max-w-[140px] object-contain" />
              ) : (
                <>
                  <div className="w-7 h-7 rounded bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center font-righteous text-white font-bold text-sm shadow-md shadow-red-500/20">
                    E
                  </div>
                  <span className="text-lg font-extrabold text-white font-righteous tracking-wide">
                    Ever<span className="text-gradient-stakelab">Stake</span>
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Right Side: User Profile Header Badge & Daily Rewards Trigger */}
          <div className="flex items-center space-x-3">
            {/* User Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-full bg-[#0c1a38] hover:bg-[#12234a] border border-[#18294d] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff0044] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md animate-pulse">
                    {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
                  </span>
                )}
              </button>

              {/* User Notifications Dropdown Panel */}
              {notifDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-[#09152e] border border-[#1d335f] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs font-sans animate-in zoom-in-95 duration-200">
                  <div className="p-3.5 bg-[#0e1d3e] border-b border-[#1d335f] flex items-center justify-between">
                    <h3 className="font-bold text-white font-righteous flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#fe780b]" /> Notifications
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {notifications.unreadCount} Unread
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#1d335f]/60">
                    {/* Support Ticket Replies */}
                    {notifications.tickets?.length > 0 && (
                      <div className="p-3">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>📩 Admin Support Ticket Replies ({notifications.tickets.length})</span>
                          <Link href="/support" onClick={() => setNotifDropdownOpen(false)} className="text-amber-400 hover:underline">View All →</Link>
                        </div>
                        <div className="space-y-1.5">
                          {notifications.tickets.map((t) => (
                            <Link
                              key={t.id}
                              href={`/support/tickets/${t.id}`}
                              onClick={() => setNotifDropdownOpen(false)}
                              className="block p-2 rounded-lg bg-[#061127] hover:bg-[#0f2249] border border-[#1d335f] transition-all"
                            >
                              <div className="font-bold text-white truncate">#{t.ticket_code} - {t.subject}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                                <span>{new Date(t.updated_at).toLocaleDateString()}</span>
                                <span className="text-emerald-400 font-semibold uppercase">Replied</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deposit Updates */}
                    {notifications.deposits?.length > 0 && (
                      <div className="p-3">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>📥 Recent Deposit Updates ({notifications.deposits.length})</span>
                          <Link href="/deposit/history" onClick={() => setNotifDropdownOpen(false)} className="text-emerald-400 hover:underline">History →</Link>
                        </div>
                        <div className="space-y-1.5">
                          {notifications.deposits.map((d) => (
                            <Link
                              key={d.id}
                              href="/deposit/history"
                              onClick={() => setNotifDropdownOpen(false)}
                              className="block p-2 rounded-lg bg-[#061127] hover:bg-[#0f2249] border border-[#1d335f] transition-all"
                            >
                              <div className="font-bold text-emerald-400">+${parseFloat(d.amount).toFixed(2)} USDT</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                                <span>{new Date(d.created_at).toLocaleDateString()}</span>
                                <span className={`font-semibold uppercase ${d.status === 'APPROVED' ? 'text-emerald-400' : d.status === 'REJECTED' ? 'text-red-400' : 'text-amber-400'}`}>
                                  {d.status}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Withdrawal Updates */}
                    {notifications.withdrawals?.length > 0 && (
                      <div className="p-3">
                        <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>📤 Recent Withdrawal Updates ({notifications.withdrawals.length})</span>
                          <Link href="/withdraw/history" onClick={() => setNotifDropdownOpen(false)} className="text-sky-400 hover:underline">History →</Link>
                        </div>
                        <div className="space-y-1.5">
                          {notifications.withdrawals.map((w) => (
                            <Link
                              key={w.id}
                              href="/withdraw/history"
                              onClick={() => setNotifDropdownOpen(false)}
                              className="block p-2 rounded-lg bg-[#061127] hover:bg-[#0f2249] border border-[#1d335f] transition-all"
                            >
                              <div className="font-bold text-sky-400">-${parseFloat(w.amount).toFixed(2)} USDT</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                                <span>{new Date(w.created_at).toLocaleDateString()}</span>
                                <span className={`font-semibold uppercase ${w.status === 'APPROVED' ? 'text-emerald-400' : w.status === 'REJECTED' ? 'text-red-400' : 'text-amber-400'}`}>
                                  {w.status}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {notifications.unreadCount === 0 && notifications.tickets?.length === 0 && (
                      <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                        🎉 No unread notifications right now!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Button - Shows ONLY image icon without border on small screens */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 sm:bg-[#0c1a38] sm:hover:bg-[#12234a] sm:border sm:border-[#18294d] sm:rounded-full sm:pl-1.5 sm:pr-3 sm:py-1 cursor-pointer transition-all focus:outline-none select-none"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full sm:bg-[#16274a] text-slate-200 flex items-center justify-center sm:border sm:border-[#233863] shrink-0">
                  <User className="w-5 h-5 sm:w-4 sm:h-4 text-slate-200" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[150px]">
                    {user?.full_name?.trim() || user?.username || user?.email}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[150px]">
                    {user?.email || ''}
                  </div>
                </div>
                <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Panel (Exact Match to User Screenshot) */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#08152e] border border-[#18294d] rounded-xl shadow-2xl overflow-hidden z-50 py-1.5 font-sans">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-[#112349] hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-300" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/user-data"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-[#112349] hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <Key className="w-4 h-4 text-slate-300" />
                    <span>Password Change</span>
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-[#ff0044]/15 hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-300" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Unverified Email Warning Banner */}
        {user && !user.email_verified && (
          <div className="bg-gradient-to-r from-amber-600/90 to-red-600/90 text-white px-4 py-2.5 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
              <span>Your email address ({user.email}) is not verified. Please verify your email to unlock deposits, withdrawals & staking.</span>
            </div>
            <Link
              href="/verify-email"
              className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-extrabold hover:bg-slate-100 transition-all text-[11px] shrink-0 uppercase tracking-wider shadow cursor-pointer"
            >
              Verify Email →
            </Link>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-[#061127] p-4 sm:p-6 lg:p-8 h-full overflow-y-auto no-scrollbar pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Matching Reference Image) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07142d]/95 backdrop-blur-md border-t border-[#142343] px-2 py-1.5 flex items-center justify-around font-sans shadow-2xl">
          {/* 1. Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              pathname === '/dashboard' ? 'text-[#ff0044] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
          </Link>

          {/* 2. Staking Plans */}
          <Link
            href="/staking/create"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              pathname === '/staking/create' ? 'text-[#ff0044] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Staking Plans</span>
          </Link>

          {/* 3. Center Trade / Exchange Button (⇄) */}
          <Link
            href="/staking"
            className="flex flex-col items-center -mt-5 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4M7 4L3 8M7 4L11 8" />
                <path d="M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 text-slate-300 font-semibold">Trade</span>
          </Link>

          {/* 4. My Team */}
          <Link
            href="/referrals"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              pathname === '/referrals' ? 'text-[#ff0044] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">My Team</span>
          </Link>

          {/* 5. Account */}
          <Link
            href="/user-data"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              pathname === '/user-data' ? 'text-[#ff0044] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
