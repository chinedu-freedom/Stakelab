'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  FileText,
  MessageSquare,
  HandCoins,
  ClipboardList,
  RefreshCw,
  Coins,
  ChevronRight,
  BellRing,
  Eye,
  EyeOff,
  TrendingUp,
} from 'lucide-react';
import OfficialInfoReleaseModal from '../../components/OfficialInfoReleaseModal';
import PageLoader from '../../components/PageLoader';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleClaim = async (stakeId) => {
    try {
      const res = await api.post('/staking/claim', { stake_id: stakeId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchDashboard();
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    }
  };

  const activeStakesList = dashboardData?.activeStakes || [];
  const stakingBalance =
    dashboardData?.user?.staking_balance ||
    activeStakesList.reduce((acc, s) => acc + parseFloat(s.amount || 0), 0) ||
    0;
  const earningBalance = dashboardData?.user?.earning_balance || dashboardData?.user?.total_earned || user?.total_earned || 0;
  const totalDeposit = dashboardData?.user?.total_deposit || 0;
  const totalWithdraw = dashboardData?.user?.total_withdraw || 0;
  const referralEarning = dashboardData?.user?.referral_earning || 0;
  const transactions = dashboardData?.recentTransactions || [];

  if (loading) {
    return (
      <UserSidebarLayout>
        <PageLoader />
      </UserSidebarLayout>
    );
  }

  return (
    <UserSidebarLayout>
      <OfficialInfoReleaseModal />
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Dashboard
          </h1>
        </div>

        {/* Browser Notification Alert Card (Commented out for now) */}
        {/*
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 text-slate-200 shadow-xl">
          <h2 className="text-sm font-bold text-white font-righteous flex items-center gap-2">
            Please Allow / Reset Browser Notification{' '}
            <span className="text-[#ff0044] animate-bounce inline-block">🔔</span>
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            If you want to get push notification then you have to allow notification from your browser
          </p>
        </div>
        */}

        {/* 5 Stat Cards Grid (Staking Balance & Earning Balance come FIRST) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Stat Card 1: Staking Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-emerald-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-emerald-400 shrink-0">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span>Staking Balance</span>
                  <button
                    type="button"
                    onClick={() => setShowBalances(!showBalances)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={showBalances ? 'Hide Balance' : 'Show Balance'}
                  >
                    {showBalances ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  {showBalances ? `$${parseFloat(stakingBalance).toFixed(2)}` : '••••••'}
                </div>
              </div>
            </div>

            <Link
              href="/staking"
              className="btn-stakelab-outline px-4 py-1.5 text-xs rounded-full font-bold transition-all"
            >
              View All
            </Link>
          </div>

          {/* Stat Card 2: Earning Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-amber-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-amber-400 shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span>Earning Balance</span>
                  <button
                    type="button"
                    onClick={() => setShowBalances(!showBalances)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={showBalances ? 'Hide Balance' : 'Show Balance'}
                  >
                    {showBalances ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  {showBalances ? `$${parseFloat(earningBalance).toFixed(2)}` : '••••••'}
                </div>
              </div>
            </div>

            <Link
              href="/transactions"
              className="btn-stakelab-outline px-4 py-1.5 text-xs rounded-full font-bold transition-all"
            >
              View All
            </Link>
          </div>

          {/* Stat Card 3: Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <FileText className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span>Total Deposit</span>
                  <button
                    type="button"
                    onClick={() => setShowBalances(!showBalances)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={showBalances ? 'Hide Balance' : 'Show Balance'}
                  >
                    {showBalances ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  {showBalances ? `$${parseFloat(totalDeposit).toFixed(2)}` : '••••••'}
                </div>
              </div>
            </div>

            <Link
              href="/deposit"
              className="btn-stakelab-outline px-4 py-1.5 text-xs rounded-full font-bold transition-all"
            >
              View All
            </Link>
          </div>

          {/* Stat Card 4: Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <MessageSquare className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Withdraw</div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ${parseFloat(totalWithdraw).toFixed(2)}
                </div>
              </div>
            </div>

            <Link
              href="/withdraw"
              className="btn-stakelab-outline px-4 py-1.5 text-xs rounded-full font-bold transition-all"
            >
              View All
            </Link>
          </div>

          {/* Stat Card 5: Referral Earning */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <HandCoins className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Referral Earning</div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ${parseFloat(referralEarning).toFixed(2)}
                </div>
              </div>
            </div>

            <Link
              href="/referrals"
              className="btn-stakelab-outline px-4 py-1.5 text-xs rounded-full font-bold transition-all"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Active Staking Pools (If Active) */}
        {dashboardData?.activeStakes?.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-white font-righteous flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#ff0044]" /> Active Staking Subscriptions
              </h2>
              <Link href="/staking" className="text-xs font-semibold text-[#ff0044] hover:underline flex items-center gap-1">
                Explore Pools <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData?.activeStakes?.map((stake) => (
                <div key={stake.id} className="bg-[#0a1835] border border-[#182848] p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {stake.plan.badge || 'ACTIVE POOL'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 font-righteous">{stake.plan.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-white font-righteous">${parseFloat(stake.amount).toFixed(2)}</div>
                      <div className="text-xs text-slate-400">Amount Staked</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#060f22] p-3 rounded-lg border border-[#182848]">
                    <div>
                      <span className="text-slate-400">Daily Return:</span>
                      <span className="text-emerald-400 font-bold ml-1">${parseFloat(stake.daily_profit).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Claimed:</span>
                      <span className="text-white font-bold ml-1">${parseFloat(stake.total_earned).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(stake.id)}
                    className="w-full py-2.5 rounded-lg bg-[#142345] text-[#ff0044] hover:bg-[#ff0044] hover:text-white font-bold text-xs border border-[#ff0044]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Claim Daily Return (${parseFloat(stake.daily_profit).toFixed(2)})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Grid Section (Matching Reference Image) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-4 gap-y-7 gap-x-3 sm:gap-x-6 text-center font-sans">
            {/* 1. Deposit */}
            <Link href="/deposit" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#fcd34d] to-[#d97706] flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">💰</span>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Deposit
              </span>
            </Link>

            {/* 2. Withdraw */}
            <Link href="/withdraw" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#16274a] border border-[#233a69] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14L4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Withdraw
              </span>
            </Link>

            {/* 3. Stake */}
            <Link href="/staking/create" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Stake
              </span>
            </Link>

            {/* 4. My Staking */}
            <Link href="/staking" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#16274a] border border-[#233a69] flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-emerald-400 fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                My Staking
              </span>
            </Link>

            {/* 5. Daily Check-in */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-daily-checkin'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="14" r="1" fill="currentColor" />
                  <circle cx="12" cy="14" r="1" fill="currentColor" />
                  <circle cx="16" cy="14" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Daily Check-in
              </span>
            </button>

            {/* 6. Tasks */}
            <Link href="/tasks" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#059669] flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 stroke-white" />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Tasks
              </span>
            </Link>

            {/* 6. Lucky Spin */}
            <Link href="/spin" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">🎰</span>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Lucky Spin
              </span>
            </Link>

            {/* 6. Transaction Log */}
            <Link href="/transactions" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#d97706] flex items-center justify-center text-white shadow-lg shadow-amber-600/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="15" y2="16" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Transaction Log
              </span>
            </Link>

            {/* 7. Bonus Code */}
            <Link href="/bonus" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#dc2626] flex items-center justify-center text-amber-300 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">🎁</span>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Bonus Code
              </span>
            </Link>

            {/* 8. Download App */}
            <button
              type="button"
              onClick={() => alert('App download link will be available soon!')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0284c7] flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Download App
              </span>
            </button>

            {/* 9. Referrals */}
            <Link href="/referrals" className="flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Referrals
              </span>
            </Link>

            {/* 11. WhatsApp Group */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-whatsapp-modal'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-white" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.478 1.333 4.992L2 22l5.148-1.349a9.96 9.96 0 0 0 4.863 1.258h.005c5.507 0 9.989-4.479 9.99-9.985A9.94 9.94 0 0 0 19.08 5.09 9.93 9.93 0 0 0 12.012 2zm5.834 14.154c-.246.691-1.424 1.321-1.993 1.406-.51.076-1.156.108-1.865-.117-.43-.137-.982-.319-1.688-.624-2.973-1.284-4.914-4.281-5.062-4.478-.148-.198-1.206-1.603-1.206-3.057 0-1.455.76-2.17 1.03-2.464.27-.297.589-.371.786-.371.197 0 .394.001.566.01.18.009.424-.068.664.509.246.594.836 2.039.91 2.187.074.148.123.321.025.518-.098.198-.148.321-.295.495-.148.174-.311.389-.444.522-.148.148-.302.309-.13.606.173.297.77 1.272 1.653 2.059 1.134 1.011 2.091 1.325 2.388 1.474.297.148.471.124.644-.074.173-.198.742-.867.939-1.164.197-.297.394-.247.691-.099.297.148 1.884.887 2.208 1.047.324.16.541.238.615.362.074.124.074.719-.172 1.41z" />
                </svg>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                WhatsApp Group
              </span>
            </button>
          </div>
        </div>

        {/* Transactions Card / Empty State Section (Matching Reference Image) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-12 text-center shadow-xl">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              {/* Clipboard Document Outline Icon */}
              <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
                <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
              </div>
              <p className="text-sm font-semibold text-slate-300 font-sans">
                No Transaction Found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#182848] text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Balance After</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182848]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e1d3e]/50 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 font-bold text-white">{tx.type}</td>
                      <td className="py-3 px-4 font-righteous text-emerald-400">${parseFloat(tx.amount).toFixed(2)}</td>
                      <td className="py-3 px-4 font-righteous text-white">${parseFloat(tx.balance_after).toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
