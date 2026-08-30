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
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStakingBalance, setShowStakingBalance] = useState(true);
  const [showEarningBalance, setShowEarningBalance] = useState(true);
  const [showTotalDeposit, setShowTotalDeposit] = useState(true);
  const [showTotalWithdraw, setShowTotalWithdraw] = useState(true);
  const [showReferralEarning, setShowReferralEarning] = useState(true);

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

  if (loading) {
    return (
      <UserSidebarLayout>
        <PageLoader />
      </UserSidebarLayout>
    );
  }

  const stakingBalance = dashboardData?.user?.staked_balance !== undefined ? dashboardData.user.staked_balance : (user?.staked_balance || 0);
  const earningBalance = dashboardData?.user?.balance !== undefined ? dashboardData.user.balance : (user?.balance || 0);
  const totalDeposit = dashboardData?.user?.total_deposit !== undefined ? dashboardData.user.total_deposit : (user?.total_deposit || 0);
  const totalWithdraw = dashboardData?.user?.total_withdraw !== undefined ? dashboardData.user.total_withdraw : (user?.total_withdraw || 0);
  const referralEarning = dashboardData?.user?.referral_earning !== undefined ? dashboardData.user.referral_earning : (user?.referral_earning || 0);
  const transactions = dashboardData?.recentTransactions || [];

  return (
    <UserSidebarLayout>
      <OfficialInfoReleaseModal />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a1835] border border-[#182848] rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide leading-tight">
              <span>Welcome back,</span>
              <span className="block text-emerald-400 mt-1">
                {user?.full_name?.trim() || user?.username || user?.email} 👋
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Monitor your active staking yield, manage deposits, and track daily returns in real-time.
            </p>
          </div>
          <Link
            href="/staking/create"
            className="bg-[#ff0044] hover:bg-[#d60039] text-white px-5 py-2.5 rounded-xl font-righteous text-xs sm:text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 shrink-0"
          >
            + Start Staking
          </Link>
        </div>

        {/* 5 Main Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stat Card 1: Staking Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#ff0044]/30 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f2d29] border border-[#1b4d45] flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Staking Balance</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-tight">
                {showStakingBalance ? `$${parseFloat(stakingBalance).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStakingBalance(!showStakingBalance)}
                  className="w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showStakingBalance ? 'Hide Balance' : 'Show Balance'}
                >
                  {showStakingBalance ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                <Link
                  href="/deposit"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black px-4 py-1.5 text-xs sm:text-sm rounded-full shadow-lg border border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center tracking-wide"
                >
                  Deposit
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Earning Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/30 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#242114] border border-[#4d4220] flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Earning Balance</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-tight">
                {showEarningBalance ? `$${parseFloat(earningBalance).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEarningBalance(!showEarningBalance)}
                  className="w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showEarningBalance ? 'Hide Balance' : 'Show Balance'}
                >
                  {showEarningBalance ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                <Link
                  href="/withdraw"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black px-4 py-1.5 text-xs sm:text-sm rounded-full shadow-lg border border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center tracking-wide"
                >
                  Withdraw
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Card 3: Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#28131e] border border-[#52203b] flex items-center justify-center text-[#ff0044] shrink-0 shadow-inner">
                <FileText className="w-5 h-5 text-[#ff0044]" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Total Deposit</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-tight">
                {showTotalDeposit ? `$${parseFloat(totalDeposit).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTotalDeposit(!showTotalDeposit)}
                  className="w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showTotalDeposit ? 'Hide Balance' : 'Show Balance'}
                >
                  {showTotalDeposit ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                <Link
                  href="/deposit/history"
                  className="bg-[#0a1835] hover:bg-[#ff0044]/10 text-white font-bold px-3.5 py-1.5 text-xs rounded-lg border-2 border-[#ff0044] transition-all cursor-pointer flex items-center justify-center shadow-md"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Card 4: Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#28131e] border border-[#52203b] flex items-center justify-center text-[#ff0044] shrink-0 shadow-inner">
                <MessageSquare className="w-5 h-5 text-[#ff0044]" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Total Withdraw</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-tight">
                {showTotalWithdraw ? `$${parseFloat(totalWithdraw).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTotalWithdraw(!showTotalWithdraw)}
                  className="w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showTotalWithdraw ? 'Hide Balance' : 'Show Balance'}
                >
                  {showTotalWithdraw ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                <Link
                  href="/withdraw/history"
                  className="bg-[#0a1835] hover:bg-[#ff0044]/10 text-white font-bold px-3.5 py-1.5 text-xs rounded-lg border-2 border-[#ff0044] transition-all cursor-pointer flex items-center justify-center shadow-md"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Card 5: Referral Earning */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0 shadow-inner">
                <HandCoins className="w-5 h-5 text-[#ff0044]" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Referral Earning</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-tight">
                {showReferralEarning ? `$${parseFloat(referralEarning).toFixed(2)}` : '••••••'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReferralEarning(!showReferralEarning)}
                  className="w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] hover:bg-[#1b3469] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                  title={showReferralEarning ? 'Hide Balance' : 'Show Balance'}
                >
                  {showReferralEarning ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                <Link
                  href="/referrals"
                  className="bg-[#0a1835] hover:bg-[#ff0044]/10 text-white font-bold px-3.5 py-1.5 text-xs rounded-lg border-2 border-[#ff0044] transition-all cursor-pointer flex items-center justify-center shadow-md"
                >
                  View All
                </Link>
              </div>
            </div>
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



        {/* Transactions Card / Empty State Section (Matching Reference Image) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-4 sm:p-6 text-center shadow-xl">
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
                    <th className="py-4 px-2">Transaction ID</th>
                    <th className="py-4 px-2">Type</th>
                    <th className="py-4 px-2">Amount</th>
                    <th className="py-4 px-2">Balance After</th>
                    <th className="py-4 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182848]">
                  {transactions.slice(0, 10).map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e1d3e]/50 text-slate-200">
                      <td className="py-4 px-2 font-mono text-[11px] text-slate-400">{tx.id.substring(0, 8)}...</td>
                      <td className="py-4 px-2 font-bold text-white whitespace-nowrap">{tx.type}</td>
                      <td className="py-4 px-2 font-righteous text-emerald-400 whitespace-nowrap">${parseFloat(tx.amount).toFixed(2)}</td>
                      <td className="py-4 px-2 font-righteous text-white whitespace-nowrap">${parseFloat(tx.balance_after).toFixed(2)}</td>
                      <td className="py-4 px-2 text-slate-400 font-mono text-[11px] whitespace-nowrap">{new Date(tx.created_at).toLocaleString()}</td>
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
