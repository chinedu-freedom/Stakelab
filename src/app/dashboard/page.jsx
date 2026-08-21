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
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const totalDeposit = dashboardData?.user?.total_deposit || 0;
  const totalWithdraw = dashboardData?.user?.total_withdraw || 0;
  const totalEarned = dashboardData?.user?.total_earned || user?.total_earned || 0;
  const transactions = dashboardData?.recentTransactions || [];

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Title */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Dashboard
        </h1>

        {/* Browser Notification Alert Card */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 text-slate-200 shadow-xl">
          <h2 className="text-sm font-bold text-white font-righteous flex items-center gap-2">
            Please Allow / Reset Browser Notification{' '}
            <span className="text-[#ff0044] animate-bounce inline-block">🔔</span>
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            If you want to get push notification then you have to allow notification from your browser
          </p>
        </div>

        {/* 3 Stat Cards Grid (Total Deposit, Total Withdraw, Referral Earning) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat Card 1: Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <FileText className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Deposit</div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ₮{parseFloat(totalDeposit).toFixed(2)}
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

          {/* Stat Card 2: Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <MessageSquare className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Withdraw</div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ₮{parseFloat(totalWithdraw).toFixed(2)}
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

          {/* Stat Card 3: Referral Earning */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 flex items-center justify-between shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <HandCoins className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Referral Earning</div>
                <div className="text-lg font-extrabold text-white font-righteous mt-0.5">
                  ₮{parseFloat(totalEarned).toFixed(2)}
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
                      <div className="text-lg font-black text-white font-righteous">₮{parseFloat(stake.amount).toFixed(2)}</div>
                      <div className="text-xs text-slate-400">Amount Staked</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#060f22] p-3 rounded-lg border border-[#182848]">
                    <div>
                      <span className="text-slate-400">Daily Return:</span>
                      <span className="text-emerald-400 font-bold ml-1">₮{parseFloat(stake.daily_profit).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Claimed:</span>
                      <span className="text-white font-bold ml-1">₮{parseFloat(stake.total_earned).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(stake.id)}
                    className="w-full py-2.5 rounded-lg bg-[#142345] text-[#ff0044] hover:bg-[#ff0044] hover:text-white font-bold text-xs border border-[#ff0044]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Claim Daily Return (₮{parseFloat(stake.daily_profit).toFixed(2)})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      <td className="py-3 px-4 font-righteous text-emerald-400">₮{parseFloat(tx.amount).toFixed(2)}</td>
                      <td className="py-3 px-4 font-righteous text-white">₮{parseFloat(tx.balance_after).toFixed(2)}</td>
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
