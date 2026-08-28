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
  const [activeStakes, setActiveStakes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStakingData = async () => {
    try {
      setLoading(true);
      const [dashRes, plansRes] = await Promise.all([
        api.get('/user/dashboard'),
        api.get('/staking/plans'),
      ]);

      if (dashRes.data.success) {
        setActiveStakes(dashRes.data.activeStakes || []);
      }
      if (plansRes.data.success) {
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

  const handleClaim = async (stakeId) => {
    try {
      const res = await api.post('/staking/claim', { stake_id: stakeId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchStakingData();
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    }
  };

  const handleStake = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !stakeAmount) return;

    if (!selectedWallet) {
      toast.error('Please select a wallet.');
      return;
    }

    const amountNum = parseFloat(stakeAmount);
    const mainBal = parseFloat(user?.balance || 0);
    const profitBal = parseFloat(user?.total_earned || 0);

    if (selectedWallet === 'main' && amountNum > mainBal) {
      toast.error(`Insufficient balance in Main Wallet ($${mainBal.toFixed(2)})`);
      return;
    }

    if (selectedWallet === 'profit' && amountNum > profitBal) {
      toast.error(`Insufficient balance in Profit Wallet ($${profitBal.toFixed(2)})`);
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

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            My Staking
          </h1>

          <Link
            href="/staking/create"
            className="border border-red-500/80 text-red-400 font-bold px-5 py-2 rounded text-xs font-righteous hover:bg-red-500/15 transition-all shadow-md shadow-red-500/10 cursor-pointer inline-block"
          >
            Stake
          </Link>
        </div>

        {/* Active Stakes List or Empty State */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400">
            Loading staking data...
          </div>
        ) : activeStakes.length === 0 ? (
          /* Empty State Matching Reference Screenshot */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              No Staking Found
            </p>
          </div>
        ) : (
          /* Active Subscriptions Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeStakes.map((stake) => (
              <div key={stake.id} className="bg-[#0a1835] border border-[#182848] p-5 rounded-xl space-y-4 shadow-xl">
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
                  Claim Profit (${parseFloat(stake.daily_profit).toFixed(2)})
                </button>
              </div>
            ))}
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
                  {plans.map((p) => (
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
                      Wallet <span className="text-[#ff0044]">*</span>
                    </label>
                    <Select
                      value={selectedWallet}
                      onValueChange={(val) => setSelectedWallet(val)}
                    >
                      <SelectTrigger className="h-12 bg-[#060f22] border-[#182848] text-white">
                        <SelectValue placeholder="Select Wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">
                          Main Wallet (${parseFloat(user?.balance || 0).toFixed(2)})
                        </SelectItem>
                        <SelectItem value="profit">
                          Profit Wallet (${parseFloat(user?.total_earned || 0).toFixed(2)})
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
