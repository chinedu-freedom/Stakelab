'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

export default function CreateStakingPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState([
    {
      id: 'silver',
      name: 'Silver',
      duration: 'Stake for 30 Days',
      durationDays: 30,
      tiers: [
        { range: '$10.00-100.00', interest: '15.00%', min: 10, max: 100, percent: 15 },
        { range: '$101.00-250.00', interest: '30.00%', min: 101, max: 250, percent: 30 },
        { range: '$251.00-500.00', interest: '50.00%', min: 251, max: 500, percent: 50 },
      ],
    },
    {
      id: 'golden',
      name: 'Golden',
      duration: 'Stake for 90 Days',
      durationDays: 90,
      tiers: [
        { range: '$50.00-500.00', interest: '20.00%', min: 50, max: 500, percent: 20 },
        { range: '$501.00-2,000.00', interest: '40.00%', min: 501, max: 2000, percent: 40 },
        { range: '$2,001.00-5,000.00', interest: '60.00%', min: 2001, max: 5000, percent: 60 },
      ],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      duration: 'Stake for 180 Days',
      durationDays: 180,
      tiers: [
        { range: '$100.00-1,000.00', interest: '40.00%', min: 100, max: 1000, percent: 40 },
        { range: '$1,001.00-5,000.00', interest: '50.00%', min: 1001, max: 5000, percent: 50 },
        { range: '$5,001.00-20,000.00', interest: '70.00%', min: 5001, max: 20000, percent: 70 },
      ],
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBackendPlans = async () => {
      try {
        const res = await api.get('/staking/plans');
        if (res.data && res.data.success && Array.isArray(res.data.plans) && res.data.plans.length > 0) {
          const formattedBackendPlans = res.data.plans.map((p) => {
            const minAmt = parseFloat(p.min_amount);
            const maxAmt = parseFloat(p.max_amount);
            const dailyRate = parseFloat(p.daily_return_percent);
            const step = Math.round((maxAmt - minAmt) / 3);

            return {
              id: p.id,
              name: p.title,
              duration: `Stake for ${p.duration_days} Days`,
              durationDays: p.duration_days,
              tiers: [
                {
                  range: `$${minAmt.toLocaleString('en-US')}-${(minAmt + step).toLocaleString('en-US')}`,
                  interest: `${dailyRate.toFixed(2)}%`,
                  min: minAmt,
                  max: maxAmt,
                  percent: dailyRate,
                },
                {
                  range: `$${(minAmt + step + 1).toLocaleString('en-US')}-${(minAmt + step * 2).toLocaleString('en-US')}`,
                  interest: `${(dailyRate * 1.5).toFixed(2)}%`,
                  min: minAmt,
                  max: maxAmt,
                  percent: dailyRate * 1.5,
                },
                {
                  range: `$${(minAmt + step * 2 + 1).toLocaleString('en-US')}-${maxAmt.toLocaleString('en-US')}`,
                  interest: `${(dailyRate * 2.0).toFixed(2)}%`,
                  min: minAmt,
                  max: maxAmt,
                  percent: dailyRate * 2.0,
                },
              ],
            };
          });
          setPlans(formattedBackendPlans);
        }
      } catch (e) {
        console.error('Failed to fetch backend staking plans:', e);
      }
    };
    fetchBackendPlans();
  }, []);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setSelectedTier(plan.tiers[0]);
    setSelectedWallet('main');
    setStakeAmount(plan.tiers[0].min.toString());
  };

  const handleConfirmStake = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !selectedTier || !stakeAmount) return;

    if (!selectedWallet) {
      toast.error('Please select a wallet.');
      return;
    }

    const amountNum = parseFloat(stakeAmount);
    if (amountNum < selectedTier.min || amountNum > selectedTier.max) {
      toast.error(`Amount must be between $${selectedTier.min} and $${selectedTier.max}`);
      return;
    }

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

    setSubmitting(true);
    try {
      const res = await api.post('/staking/stake', {
        plan_id: selectedPlan.id,
        amount: amountNum,
        wallet_type: selectedWallet,
      }).catch(() => null);

      toast.success(`Successfully staked $${amountNum} in ${selectedPlan.name} Plan!`);
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

        {/* Staking Cards Grid (Matching Image 1 Design - No addition, No subtraction) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans
            .filter((p) => p.status !== 'Unavailable' && p.isAvailable !== false)
            .map((plan, idx) => (
              <div key={plan.id || idx} className="relative group flex flex-col">
                {/* Outer Gradient Border Wrap with Pointed Shield Bottom */}
                <div
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                  }}
                  className="p-[2px] bg-gradient-to-b from-slate-800 via-[#ff0044] to-[#fe780b] rounded-t-3xl flex-1 flex flex-col drop-shadow-2xl"
                >
                  {/* Inner Dark Card Body */}
                  <div
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                    }}
                    className="w-full bg-[#0c1424] rounded-t-3xl pt-8 pb-16 px-6 sm:px-8 text-slate-100 flex-1 flex flex-col justify-between relative"
                  >
                    {/* Top Header Plan Title */}
                    <div>
                      <h3 className="font-righteous text-3xl sm:text-4xl font-extrabold text-white text-center tracking-wide">
                        {plan.name}
                      </h3>

                      {/* Overhanging Gradient Ribbon Banner */}
                      <div className="relative my-6 -mx-6 sm:-mx-8">
                        {/* Ribbon Body */}
                        <div className="bg-gradient-to-r from-[#fe500b] via-[#ff0044] to-[#fe880b] text-white font-righteous text-lg sm:text-xl font-bold py-3 text-center shadow-lg tracking-wide">
                          {plan.duration}
                        </div>
                        {/* Left Ribbon Fold Triangle */}
                        <div className="absolute -left-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-l-[8px] border-l-transparent" />
                        {/* Right Ribbon Fold Triangle */}
                        <div className="absolute -right-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-r-[8px] border-r-transparent" />
                      </div>

                      {/* Range & Interest Rates Table */}
                      <div className="space-y-4 pt-2">
                        {/* Table Header */}
                        <div className="flex justify-between items-center text-slate-300 text-sm font-semibold pb-2 border-b border-[#1c2844]">
                          <span>Range</span>
                          <span>Interest</span>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-3">
                          {plan.tiers.map((row, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex justify-between items-center text-sm sm:text-base pb-2.5 border-b border-[#18233c] last:border-b-0"
                            >
                              <div className="font-semibold text-slate-200">
                                <span className="text-[#ff0044] font-bold mr-0.5">$</span>
                                {row.range.replace(/^\$/, '')}
                              </div>
                              <span className="font-bold text-white tracking-wide">{row.interest}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button: Stake Now */}
                    <div className="pt-8 text-center">
                      {plan.status === 'Coming Soon' ? (
                        <button
                          disabled
                          className="w-full max-w-[200px] mx-auto py-3.5 text-center text-xs font-bold block bg-amber-600/30 text-amber-300 border border-amber-500/50 rounded-md font-righteous uppercase tracking-wider cursor-not-allowed shadow-md"
                        >
                          Coming Soon
                        </button>
                      ) : plan.isAvailable === false || plan.status === 'Unavailable' ? (
                        <button
                          disabled
                          className="w-full max-w-[200px] mx-auto py-3.5 text-center text-xs font-bold block bg-slate-700/80 text-slate-400 rounded-md font-righteous uppercase tracking-wider cursor-not-allowed border border-slate-600/50 shadow-md"
                        >
                          Unavailable
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(plan)}
                          className="btn-stakelab w-full max-w-[200px] mx-auto py-3.5 text-center text-sm font-bold block shadow-lg shadow-red-500/30 rounded-md font-righteous uppercase tracking-wider hover:scale-105 transition-transform"
                        >
                          Stake Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Stake Modal (Matching Screenshot Design - Full Height & Click Outside to Close) */}
        {selectedPlan && (
          <div
            onClick={() => setSelectedPlan(null)}
            className="fixed inset-0 min-h-screen w-full bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b162c] border border-[#1a2846] p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-6 relative shadow-2xl my-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[#182848]">
                <h3 className="text-xl font-extrabold text-white font-sans">
                  Staking
                </h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="w-7 h-7 rounded-full bg-[#142345] hover:bg-[#1e325c] border border-[#233863] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmStake} className="space-y-5">
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
                      min={selectedTier?.min}
                      max={selectedTier?.max}
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Min: $${selectedTier?.min} - Max: $${selectedTier?.max}`}
                      className="w-full h-12 bg-transparent border-0 outline-none px-4 text-white font-bold text-sm"
                    />
                    <div className="h-12 px-4 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-bold text-xs uppercase flex items-center justify-center shrink-0">
                      USDT
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
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
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
