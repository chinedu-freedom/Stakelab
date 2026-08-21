'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateStakingPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState([
    {
      id: 'silver',
      name: 'Silver',
      duration: 'Stake for 30 Days',
      durationDays: 30,
      tiers: [
        { range: '₮10.00-100.00', interest: '15.00%', min: 10, max: 100, percent: 15 },
        { range: '₮101.00-250.00', interest: '30.00%', min: 101, max: 250, percent: 30 },
        { range: '₮251.00-500.00', interest: '50.00%', min: 251, max: 500, percent: 50 },
      ],
    },
    {
      id: 'golden',
      name: 'Golden',
      duration: 'Stake for 90 Days',
      durationDays: 90,
      tiers: [
        { range: '₮50.00-500.00', interest: '20.00%', min: 50, max: 500, percent: 20 },
        { range: '₮501.00-2,000.00', interest: '40.00%', min: 501, max: 2000, percent: 40 },
        { range: '₮2,001.00-5,000.00', interest: '60.00%', min: 2001, max: 5000, percent: 60 },
      ],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      duration: 'Stake for 180 Days',
      durationDays: 180,
      tiers: [
        { range: '₮100.00-1,000.00', interest: '40.00%', min: 100, max: 1000, percent: 40 },
        { range: '₮1,001.00-5,000.00', interest: '50.00%', min: 1001, max: 5000, percent: 50 },
        { range: '₮5,001.00-20,000.00', interest: '70.00%', min: 5001, max: 20000, percent: 70 },
      ],
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setSelectedTier(plan.tiers[0]);
    setStakeAmount(plan.tiers[0].min.toString());
  };

  const handleConfirmStake = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !selectedTier || !stakeAmount) return;

    const amountNum = parseFloat(stakeAmount);
    if (amountNum < selectedTier.min || amountNum > selectedTier.max) {
      toast.error(`Amount must be between ₮${selectedTier.min} and ₮${selectedTier.max}`);
      return;
    }

    setSubmitting(true);
    try {
      // Simulate or post to backend API endpoint
      const res = await api.post('/staking/stake', {
        plan_id: selectedPlan.id,
        amount: amountNum,
      }).catch(() => null);

      toast.success(`Successfully staked ₮${amountNum} in ${selectedPlan.name} Plan!`);
      setSelectedPlan(null);
      setStakeAmount('');
      refreshUser();
    } catch (err) {
      toast.error('Failed to process stake. Please check your balance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Title */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Staking Plan
        </h1>

        {/* Staking Cards Grid (Filtering out Unavailable plans from public purchase catalog) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
          {plans
            .filter((p) => p.status !== 'Unavailable' && p.isAvailable !== false)
            .map((plan) => (
            <div
              key={plan.id}
              className="bg-[#08152e] rounded-3xl border border-[#16274a] shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Card Title Header */}
              <div className="pt-6 pb-2 text-center">
                <h2 className="text-2xl font-black text-white font-righteous tracking-wide">
                  {plan.name}
                </h2>
              </div>

              {/* Orange/Red Ribbon Banner (Stake for X Days) */}
              <div className="relative my-2">
                <div className="w-[104%] -ml-[2%] bg-gradient-to-r from-[#ff0044] to-[#fe780b] py-2.5 text-center text-white font-righteous font-bold text-sm tracking-wider uppercase shadow-xl shadow-red-500/20">
                  {plan.duration}
                </div>
              </div>

              {/* Tiers Table inside Card */}
              <div className="p-6 space-y-4">
                {/* Table Header Row */}
                <div className="flex justify-between text-xs font-semibold text-[#8a99b5] border-b border-[#16274a] pb-2">
                  <span>Range</span>
                  <span>Interest</span>
                </div>

                {/* Tiers Rows */}
                <div className="space-y-3.5 text-xs">
                  {plan.tiers.map((tier, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-200">
                      <span className="font-medium text-slate-300">{tier.range}</span>
                      <span className="font-bold text-white font-righteous">{tier.interest}</span>
                    </div>
                  ))}
                </div>

                {/* Plan Rules & Features Badges Container */}
                <div className="pt-3 border-t border-[#16274a] space-y-2 text-[11px]">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Fixed Deposit:</span>
                    <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      🔒 Locked for {plan.durationDays} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Capital Return:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      🔄 Returned at Maturity (PV + Profit)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Yield Model:</span>
                    <span className="font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      ⚡ Daily Compounding Yield
                    </span>
                  </div>
                </div>

                {/* Action Button: Stake Now, Coming Soon, or Unavailable */}
                <div className="pt-4 text-center">
                  {plan.status === 'Coming Soon' ? (
                    <button
                      disabled
                      className="bg-gradient-to-r from-amber-600/30 to-purple-600/30 text-amber-300 border border-amber-500/50 font-bold font-righteous px-8 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-not-allowed shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 mx-auto"
                    >
                      ✨ Coming Soon
                    </button>
                  ) : plan.isAvailable === false || plan.status === 'Unavailable' ? (
                    <button
                      disabled
                      className="bg-slate-700/80 text-slate-400 font-bold px-8 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-not-allowed border border-slate-600/50 shadow-md"
                    >
                      Unavailable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="btn-stakelab px-8 py-2.5 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 hover:scale-105"
                    >
                      Stake Now
                    </button>
                  )}
                </div>
              </div>

              {/* Curved V-Shield Bottom Edge Graphic */}
              <div className="w-full h-6 bg-[#08152e] relative flex justify-center overflow-hidden">
                <div className="w-full h-12 border-b-4 border-gradient-to-r from-[#ff0044] to-[#fe780b] rounded-[100%] border-t-0 shadow-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Stake Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0b162c] border border-[#ff0044]/30 p-6 sm:p-8 rounded-2xl max-w-lg w-full space-y-6 relative shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-[#182848]">
                <h3 className="text-lg font-bold text-white font-righteous">
                  Stake in {selectedPlan.name} Plan
                </h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmStake} className="space-y-5">
                {/* Select Tier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Range & Interest Tier
                  </label>
                  <div className="space-y-2">
                    {selectedPlan.tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedTier(tier);
                          setStakeAmount(tier.min.toString());
                        }}
                        className={`p-3.5 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                          selectedTier?.range === tier.range
                            ? 'border-[#ff0044] bg-[#ff0044]/10 text-white font-bold'
                            : 'border-[#182848] bg-[#060f22] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-xs font-medium text-white">{tier.range}</span>
                        <span className="text-xs font-bold text-emerald-400 font-righteous">{tier.interest}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Amount to Stake (₮)</span>
                    <span>Available: ₮{parseFloat(user?.balance || 0).toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    required
                    min={selectedTier?.min}
                    max={selectedTier?.max}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder={`Min: ₮${selectedTier?.min} - Max: ₮${selectedTier?.max}`}
                    className="w-full bg-[#060f22] border border-[#182848] rounded-xl py-3 px-4 text-white font-bold text-sm focus:border-[#ff0044] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Confirmation Box with Compounding Yield Details */}
                <div className="bg-[#060f22] p-4 rounded-xl text-xs space-y-2.5 border border-[#182848]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lockup Duration:</span>
                    <span className="text-white font-bold font-righteous">{selectedPlan.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest Rate (r):</span>
                    <span className="text-emerald-400 font-bold font-righteous">{selectedTier?.interest}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#182848]">
                    <span className="text-slate-400 font-medium">Compounding Strategy:</span>
                    <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Daily Compounding FV = PV(1+r)ⁿ
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-stakelab py-3.5 rounded-xl text-white font-righteous text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Processing Stake...' : 'Confirm & Stake Now (Compounding Yield)'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
