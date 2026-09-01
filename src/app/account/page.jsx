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
  ArrowDown,
  ArrowUp,
  Shield,
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
  Smartphone,
  TrendingUp,
} from 'lucide-react';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();

  // --- Balances Eye Toggle States ---
  const [showStakingBalance, setShowStakingBalance] = useState(true);
  const [showEarningBalance, setShowEarningBalance] = useState(true);

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

  const [systemFeatures, setSystemFeatures] = useState({
    giftBonus: true,
    tasks: true,
    dailyCheckin: true,
    spinWheel: true,
  });

  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('https://chat.whatsapp.com');

  useEffect(() => {
    refreshUser();
    api
      .get('/public/system-features')
      .then((res) => {
        if (res.data && res.data.success && res.data.features) {
          setSystemFeatures(res.data.features);
        }
      })
      .catch(() => null);

    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data && res.data.success && res.data.contactLinks) {
          const links = res.data.contactLinks;
          if (links.whatsappGroupModal) setWhatsappGroupUrl(links.whatsappGroupModal);
          else if (links.whatsappSupport) setWhatsappGroupUrl(links.whatsappSupport);
        }
      })
      .catch(() => null);
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
            Account Settings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your security, balances, quick shortcuts, and platform preferences.
          </p>
        </div>

        {/* 5 Balances & Account Stats Grid (1 Card Per Line on Mobile, 4 Cards Per Row on Big Screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Staking Balance Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-emerald-500/30 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0f2d29] border border-[#1b4d45] flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Staking Balance</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-base sm:text-lg lg:text-xl font-extrabold text-white font-righteous tracking-tight">
                {showStakingBalance ? `$${parseFloat(user?.staked_balance || 0).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowStakingBalance(!showStakingBalance)}
                  className="w-7 h-7 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showStakingBalance ? 'Hide Balance' : 'Show Balance'}
                >
                  {showStakingBalance ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                <Link
                  href="/deposit"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black px-3 py-1 text-xs rounded-full shadow-lg border border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center tracking-wide"
                >
                  Deposit
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Earning Balance Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-500/30 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#242114] border border-[#4d4220] flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Earning Balance</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-base sm:text-lg lg:text-xl font-extrabold text-white font-righteous tracking-tight">
                {showEarningBalance ? `$${parseFloat(user?.balance || 0).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEarningBalance(!showEarningBalance)}
                  className="w-7 h-7 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showEarningBalance ? 'Hide Balance' : 'Show Balance'}
                >
                  {showEarningBalance ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                <Link
                  href="/withdraw"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black px-3 py-1 text-xs rounded-full shadow-lg border border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center tracking-wide"
                >
                  Withdraw
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Deposit</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-lg sm:text-xl lg:text-xl font-black text-white font-righteous">
              ${parseFloat(user?.total_deposit || 0).toFixed(2)}
            </div>
          </div>

          {/* 4. Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Withdraw</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl lg:text-xl font-black text-white font-righteous">
              ${parseFloat(user?.total_withdraw || 0).toFixed(2)}
            </div>
          </div>

          {/* 5. Team Members */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl sm:col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Team Members & Referrals</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg sm:text-xl lg:text-xl font-black text-white font-righteous">
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
                icon: ArrowDown,
                enabled: true,
              },
              {
                label: 'Withdrawal',
                link: '/withdraw',
                bgColor: 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20',
                icon: ArrowUp,
                enabled: true,
              },
              {
                label: 'Stake',
                link: '/staking/create',
                bgColor: 'bg-gradient-to-tr from-[#ff0044] to-[#fe780b] shadow-red-500/20',
                icon: Layers,
                enabled: true,
              },
              {
                label: 'My Staking',
                link: '/staking',
                bgColor: 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20',
                icon: DollarSign,
                enabled: true,
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
                enabled: Boolean(systemFeatures.dailyCheckin),
              },
              {
                label: 'Tasks',
                link: '/tasks',
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-400 shadow-emerald-500/20',
                icon: ClipboardList,
                enabled: Boolean(systemFeatures.tasks),
              },
              {
                label: 'Lucky Spin',
                link: '/spin',
                bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/20',
                icon: Disc,
                enabled: Boolean(systemFeatures.spinWheel),
              },
              {
                label: 'Transaction Log',
                link: '/transactions',
                bgColor: 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-orange-500/20',
                icon: FileText,
                enabled: true,
              },
              {
                label: 'Bonus Code',
                link: '/treasure',
                bgColor: 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-500/20',
                icon: Gift,
                enabled: Boolean(systemFeatures.giftBonus),
              },
              {
                label: 'Download App',
                onClick: () => {
                  try {
                    const link = document.createElement('a');
                    link.href = '/EverStake-v2.4.0.apk';
                    link.setAttribute('download', 'EverStake-v2.4.0.apk');
                    document.body.appendChild(link);
                    link.click();
                    if (link.parentNode) link.parentNode.removeChild(link);
                    toast.success('EverStake Mobile App downloaded successfully!');
                  } catch (err) {
                    toast.success('Downloading EverStake Mobile App...');
                  }
                },
                bgColor: 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/20',
                icon: Smartphone,
              },
              {
                label: 'Referrals',
                link: '/referrals',
                bgColor: 'bg-gradient-to-tr from-violet-600 to-purple-500 shadow-violet-500/20',
                icon: Users,
              },
              {
                label: 'WhatsApp Group',
                link: whatsappGroupUrl,
                isExternal: true,
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-500 shadow-emerald-500/20',
                icon: MessageCircle,
              },
            ].filter((action) => action.enabled !== false).map((action, idx) => {
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

        {/* Support & Help Navigation Card */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4">
            <h2 className="text-base font-extrabold text-white font-righteous flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" /> Navigation & Support
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Quick access to support, platform policies, information, and session logout.</p>
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

            {/* Privacy Policy */}
            <Link
              href="/privacy-policy"
              className="w-full flex items-center justify-between p-5 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="uppercase tracking-wider">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Terms of Service */}
            <Link
              href="/terms-of-service"
              className="w-full flex items-center justify-between p-5 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="uppercase tracking-wider">Terms of Service</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Staking Policy */}
            <Link
              href="/staking-policy"
              className="w-full flex items-center justify-between p-5 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="uppercase tracking-wider">Staking Policy</span>
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
    </UserSidebarLayout>
  );
}
