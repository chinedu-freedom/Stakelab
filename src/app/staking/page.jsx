'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { ClipboardList, Coins, Check, Zap, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';

export default function StakingPage() {
  const { user, refreshUser } = useAuth();
  const [activeStakes, setActiveStakes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
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

    try {
      setSubmitting(true);
      const res = await api.post('/staking/stake', {
        plan_id: selectedPlan.id,
        amount: parseFloat(stakeAmount),
      });

      if (res.data.success) {
        toast.success(`Successfully staked ₮${stakeAmount} in ${selectedPlan.title}!`);
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
            Stake Now
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
                  Claim Profit (₮{parseFloat(stake.daily_profit).toFixed(2)})
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stake Now Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0b162c] border border-[#ff0044]/30 p-6 sm:p-8 rounded-2xl max-w-lg w-full space-y-6 relative shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-[#182848]">
                <h3 className="text-lg font-bold text-white font-righteous">
                  Crypto Staking Plans
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Plan Selection Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Pool Tier
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
                <form onSubmit={handleStake} className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                      <span>Amount to Stake (₮)</span>
                      <span>Available: ₮{parseFloat(user?.balance || 0).toFixed(2)}</span>
                    </div>
                    <input
                      type="number"
                      step="any"
                      required
                      min={selectedPlan.min_amount}
                      max={selectedPlan.max_amount}
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Min: ${selectedPlan.min_amount} USDT`}
                      className="w-full bg-[#060f22] border border-[#182848] rounded-xl py-3 px-4 text-white font-bold text-sm focus:border-[#ff0044] focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div className="bg-[#060f22] p-4 rounded-xl text-xs space-y-2 border border-[#182848]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lockup Period:</span>
                      <span className="text-white font-bold">{selectedPlan.duration_days} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Return Rate:</span>
                      <span className="text-emerald-400 font-bold">{selectedPlan.daily_return_percent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Daily Profit:</span>
                      <span className="text-white font-bold font-righteous">
                        ₮{((parseFloat(stakeAmount || 0) * parseFloat(selectedPlan.daily_return_percent)) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-stakelab py-3.5 rounded-xl text-white font-righteous text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Processing Stake...' : 'Confirm & Stake Now'}
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
