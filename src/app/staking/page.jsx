'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { ClipboardList, Coins, Check, Zap, ShieldCheck, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function StakingPage() {
  const { user, refreshUser } = useAuth();
  const [allStakes, setAllStakes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStakingData = async () => {
    try {
      setLoading(true);
      const [stakesRes, plansRes] = await Promise.all([
        api.get('/staking/my-stakes'),
        api.get('/staking/plans'),
      ]);

      if (stakesRes.data && stakesRes.data.success) {
        setAllStakes(stakesRes.data.stakes || []);
      }
      if (plansRes.data && plansRes.data.success) {
        setPlans(plansRes.data.plans || []);
      }
    } catch (err) {
      console.error('Failed to load staking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingData();
  }, []);

  const handleStake = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !stakeAmount) return;

    if (!selectedWallet) {
      toast.error('Please select a wallet.');
      return;
    }

    const amountNum = parseFloat(stakeAmount);
    const mainBal = parseFloat(user?.balance || 0);
    const profitBal = parseFloat(user?.staked_balance || 0);

    if (selectedWallet === 'main' && amountNum > mainBal) {
      toast.error(`Insufficient balance in Staking Wallet ($${mainBal.toFixed(2)})`);
      return;
    }

    if (selectedWallet === 'profit' && amountNum > profitBal) {
      toast.error(`Insufficient balance in Profits Wallet ($${profitBal.toFixed(2)})`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/staking/stake', {
        plan_id: selectedPlan.id,
        amount: amountNum,
        wallet_type: selectedWallet,
      });

      if (res.data.success) {
        toast.success(`Successfully staked $${stakeAmount} in ${selectedPlan.title}!`);
        setShowModal(false);
        setSelectedPlan(null);
        setStakeAmount('');
        fetchStakingData();
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Staking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStakesList = allStakes.filter((s) => s.status !== 'COMPLETED');
  const completedStakesList = allStakes.filter((s) => s.status === 'COMPLETED');

  const activeCount = activeStakesList.length;
  const totalInvested = allStakes.reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);
  const totalExpectedReturn = allStakes.reduce((acc, s) => {
    if (s.expected_total_return !== undefined && s.expected_total_return !== null) {
      return acc + parseFloat(s.expected_total_return || 0);
    }
    const amt = parseFloat(s.amount || 0);
    const dailyPct = parseFloat(s.plan?.daily_return_percent || 0);
    const durationDays = s.plan?.duration_days || 30;
    const isCompounding = s.plan?.is_compounding !== false;
    const capitalReturn = s.plan?.capital_return !== false;

    let ret = amt;
    if (isCompounding) {
      ret = amt * Math.pow(1 + dailyPct / 100, durationDays);
    } else {
      ret = amt + (amt * (dailyPct / 100) * durationDays);
    }

    if (!capitalReturn) {
      ret = Math.max(0, ret - amt);
    }

    return acc + ret;
  }, 0);

  const displayedStakes = activeTab === 'active' ? activeStakesList : completedStakesList;

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            My Staking
          </h1>

          <Link
            href="/staking/create"
            className="border border-red-500/80 text-red-400 font-bold px-5 py-2 rounded text-xs font-righteous hover:bg-red-500/15 transition-all shadow-md shadow-red-500/10 cursor-pointer shrink-0"
          >
            Stake
          </Link>
        </div>

        {/* Top 3 Staking Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Investments */}
          <div className="bg-[#0a1835] border border-[#182848] p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-sans">Active Investments</div>
              <div className="text-2xl font-extrabold text-white font-righteous">{activeCount}</div>
              <div className="text-[11px] text-emerald-400 font-medium font-sans">Currently running</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Amount Invested */}
          <div className="bg-[#0a1835] border border-[#182848] p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-sans">Total Invested</div>
              <div className="text-2xl font-extrabold text-white font-righteous">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</div>
              <div className="text-[11px] text-indigo-400 font-medium font-sans">Capital allocated</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Expected Return */}
          <div className="bg-[#0a1835] border border-[#182848] p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-sans">Expected Total Return</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-righteous">${totalExpectedReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</div>
              <div className="text-[11px] text-emerald-300 font-medium font-sans">Maturity yield</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tabs Navigation: Active Staking vs Completed Staking */}
        <div className="flex items-center gap-3 border-b border-[#182848] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-xl font-righteous text-xs transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#5b5bf5] text-white shadow-lg shadow-indigo-500/20 font-bold'
                : 'bg-[#0a1835] text-slate-400 hover:text-white border border-[#182848]'
            }`}
          >
            Active Staking ({activeStakesList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-xl font-righteous text-xs transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#5b5bf5] text-white shadow-lg shadow-indigo-500/20 font-bold'
                : 'bg-[#0a1835] text-slate-400 hover:text-white border border-[#182848]'
            }`}
          >
            Completed Staking ({completedStakesList.length})
          </button>
        </div>

        {/* Stakes List or Empty State */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Loading staking data</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#ff0044]" />
          </div>
        ) : displayedStakes.length === 0 ? (
          /* Empty State */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              {activeTab === 'active' ? 'No Active Staking Investments Found' : 'No Completed Staking Investments Found'}
            </p>
          </div>
        ) : (
          /* Subscriptions Horizontally Scrollable Table */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs font-sans min-w-[700px]">
                <thead>
                  <tr className="bg-[#0f2249] text-slate-300 border-b border-[#182848] font-righteous uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Plan Name</th>
                    <th className="py-4 px-5">Invested Date & Time</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Amount Invested</th>
                    <th className="py-4 px-5">Expected Return</th>
                    <th className="py-4 px-5">End Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182848]/60 text-slate-200">
                  {displayedStakes.map((stake) => {
                    const isPlanUnavailable = stake.plan?.is_active === false || stake.plan?.status === 'UNAVAILABLE' || stake.plan?.status === 'INACTIVE' || stake.plan?.badge === 'UNAVAILABLE' || stake.plan?.badge === 'INACTIVE';
                    const isCompleted = stake.status === 'COMPLETED';

                    const planName = stake.plan?.title || stake.plan?.name || 'Staking Plan';
                    const amount = parseFloat(stake.amount || 0);
                    const dailyPercent = parseFloat(stake.plan?.daily_return_percent || 0);
                    const durationDays = stake.plan?.duration_days || 30;

                    const dailyProfit = (amount * dailyPercent) / 100;
                    const expectedTotal = stake.expected_total_return || (amount + (dailyProfit * durationDays));

                    const startDateStr = stake.start_date || stake.created_at ? new Date(stake.start_date || stake.created_at).toLocaleString() : 'N/A';
                    const endDateStr = stake.end_date ? new Date(stake.end_date).toLocaleString() : 'N/A';

                    return (
                      <tr key={stake.id} className="hover:bg-[#10234a]/60 transition-colors">
                        {/* Plan Name */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-white font-righteous text-sm">{planName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">#{stake.id.substring(0, 8)}</div>
                        </td>

                        {/* Invested Date & Time */}
                        <td className="py-4 px-5">
                          <div className="font-medium text-slate-200">{startDateStr}</div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          {isCompleted ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                              COMPLETED
                            </span>
                          ) : isPlanUnavailable ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                              UNAVAILABLE
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                              RUNNING
                            </span>
                          )}
                        </td>

                        {/* Amount Invested */}
                        <td className="py-4 px-5 font-bold text-white font-mono text-sm">
                          ${amount.toFixed(2)} USDT
                        </td>

                        {/* Expected Return */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-emerald-400 font-righteous text-sm">
                            ${parseFloat(expectedTotal).toFixed(2)} USDT
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ${dailyProfit.toFixed(2)} / day ({dailyPercent}%)
                          </div>
                        </td>

                        {/* Investment End Date & Time */}
                        <td className="py-4 px-5 font-medium text-slate-200">
                          {endDateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stake Now Modal (Matching Screenshot Design - Full Height & Click Outside to Close) */}
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b162c] border border-[#1a2846] p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-6 relative shadow-2xl my-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[#182848]">
                <h3 className="text-xl font-extrabold text-white font-sans">
                  Staking
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full bg-[#142345] hover:bg-[#1e325c] border border-[#233863] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plan Selection Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 font-sans uppercase tracking-wider">
                  Select Staking Plan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {plans
                    .filter((p) => p.is_active !== false && p.status !== 'UNAVAILABLE' && p.status !== 'INACTIVE' && p.badge !== 'UNAVAILABLE' && p.badge !== 'INACTIVE')
                    .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(p);
                        setStakeAmount(p.min_amount);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPlan?.id === p.id
                          ? 'border-[#ff0044] bg-[#ff0044]/10 text-white font-bold'
                          : 'border-[#182848] bg-[#060f22] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-0.5">{p.daily_return_percent}% Daily</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlan && (
                <form onSubmit={handleStake} className="space-y-5 pt-2">
                  {/* Field 1: Wallet * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
                      Select Source <span className="text-[#ff0044]">*</span>
                    </label>
                    <Select
                      value={selectedWallet}
                      onValueChange={(val) => setSelectedWallet(val)}
                    >
                      <SelectTrigger className="h-12 bg-[#060f22] border-[#182848] text-white">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent searchPlaceholder="Search source...">
                        <SelectItem value="main">
                          Staking Wallet (${parseFloat(user?.balance || 0).toFixed(2)})
                        </SelectItem>
                        <SelectItem value="profit">
                          Profits Wallet (${parseFloat(user?.staked_balance || 0).toFixed(2)})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field 2: Amount * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
                      Amount <span className="text-[#ff0044]">*</span>
                    </label>
                    <div className="flex items-center bg-[#060f22] border border-[#182848] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                      <input
                        type="number"
                        step="any"
                        required
                        min={selectedPlan.min_amount}
                        max={selectedPlan.max_amount}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder={`Min: $${selectedPlan.min_amount}`}
                        className="w-full h-12 bg-transparent border-0 outline-none px-4 text-white font-bold text-sm"
                      />
                      <div className="h-12 px-4 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-bold text-xs uppercase flex items-center justify-center shrink-0">
                        USDT
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-stakelab py-3.5 rounded-xl text-white font-sans text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing Stake
                      </span>
                    ) : (
                      'Stake Now'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
