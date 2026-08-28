'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { toast } from 'sonner';
import {
  HelpCircle,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Wallet,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  X,
  RotateCcw,
  Layers,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  Disc,
  FileText,
  Gift,
  Download,
  MessageCircle,
  Info,
  Lock,
} from 'lucide-react';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();

  // --- Balances Eye Toggle State ---
  const [showBalances, setShowBalances] = useState(true);

  // --- Password Form State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // --- About Us Modal State ---
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  // --- Change Password Handler ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post('/auth/change-password', {
        current_password: currentPassword,
        password: newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="max-w-6xl mx-auto space-y-6 font-sans animate-in fade-in duration-300 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
              Account Settings
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage your security, balances, quick shortcuts, and platform preferences.
            </p>
          </div>

          {/* Eye Toggle All Balances */}
          <button
            type="button"
            onClick={() => setShowBalances(!showBalances)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0a1835] border border-[#182848] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md select-none"
          >
            {showBalances ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{showBalances ? 'Hide Balances' : 'Show Balances'}</span>
          </button>
        </div>

        {/* 5 Balances & Account Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Main Wallet Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Main Balance</span>
              <Wallet className="w-4 h-4 text-[#ff0044]" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.balance || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 2. Staking Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Staking Balance</span>
              <Coins className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.staking_balance || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 3. Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Total Deposit</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.total_deposit || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 4. Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Total Withdraw</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.total_withdraw || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 5. Total Members / Referrals */}
          <div className="col-span-2 sm:col-span-1 bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Team Members</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {user?.referral_count || 0} Members
            </div>
          </div>
        </div>

        {/* 12 Quick Action Shortcuts Grid */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                label: 'Deposit',
                link: '/deposit',
                bgColor: 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/20',
                icon: Wallet,
              },
              {
                label: 'Withdraw',
                link: '/withdraw',
                bgColor: 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20',
                icon: RotateCcw,
              },
              {
                label: 'Stake',
                link: '/staking/create',
                bgColor: 'bg-gradient-to-tr from-[#ff0044] to-[#fe780b] shadow-red-500/20',
                icon: Layers,
              },
              {
                label: 'My Staking',
                link: '/staking',
                bgColor: 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20',
                icon: DollarSign,
              },
              {
                label: 'Daily Check-in',
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-daily-checkin'));
                  }
                },
                bgColor: 'bg-gradient-to-tr from-blue-500 to-sky-400 shadow-blue-500/20',
                icon: CalendarCheck,
              },
              {
                label: 'Tasks',
                link: '/tasks',
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-400 shadow-emerald-500/20',
                icon: ClipboardList,
              },
              {
                label: 'Lucky Spin',
                link: '/spin',
                bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/20',
                icon: Disc,
              },
              {
                label: 'Transaction Log',
                link: '/transactions',
                bgColor: 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-orange-500/20',
                icon: FileText,
              },
              {
                label: 'Bonus Code',
                link: '/treasure',
                bgColor: 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-500/20',
                icon: Gift,
              },
              {
                label: 'Download App',
                onClick: async () => {
                  try {
                    const response = await api.get('/app-download', { responseType: 'blob' });
                    const blob = new Blob([response.data], { type: 'application/vnd.android.package-archive' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'EverStake-v2.4.0.apk');
                    document.body.appendChild(link);
                    link.click();
                    if (link.parentNode) link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    toast.success('EverStake Mobile App downloaded successfully!');
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to download app file.');
                  }
                },
                bgColor: 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/20',
                icon: Download,
              },
              {
                label: 'Referrals',
                link: '/referrals',
                bgColor: 'bg-gradient-to-tr from-violet-600 to-purple-500 shadow-violet-500/20',
                icon: Users,
              },
              {
                label: 'WhatsApp Group',
                link: 'https://chat.whatsapp.com',
                isExternal: true,
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-500 shadow-emerald-500/20',
                icon: MessageCircle,
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              const content = (
                <div className="flex flex-col items-center group cursor-pointer">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${action.bgColor} flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 text-center group-hover:text-white transition-colors leading-tight">
                    {action.label}
                  </span>
                </div>
              );

              if (action.onClick) {
                return (
                  <div key={idx} onClick={action.onClick}>
                    {content}
                  </div>
                );
              }

              if (action.isExternal) {
                return (
                  <a key={idx} href={action.link} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }

              return (
                <Link key={idx} href={action.link}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Security & Support Grid (Side by Side in 1 Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Security & Password Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
            <div>
              <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4">
                <h2 className="text-base font-extrabold text-white font-righteous flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#ff0044]" /> Security & Password
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Update and protect your account security password.</p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 sm:p-8 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Change Password Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword || !currentPassword || !newPassword}
                    className="w-full h-11 bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Support & Help Navigation Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div>
              <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4">
                <h2 className="text-base font-extrabold text-white font-righteous flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" /> Navigation & Support
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Quick access to support, information, and session logout.</p>
              </div>

              <div className="divide-y divide-[#182848]">
                {/* Help Center */}
                <Link
                  href="/support"
                  className="flex items-center justify-between p-5 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="uppercase tracking-wider">Help Center & Live Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* About EverStake */}
                <Link
                  href="/about"
                  className="w-full flex items-center justify-between p-5 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="uppercase tracking-wider">About EverStake Platform</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center justify-between p-5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="uppercase tracking-wider">Sign Out</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
