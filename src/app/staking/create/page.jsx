'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

export default function CreateStakingPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBackendPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staking/plans');
      if (res.data && res.data.success && Array.isArray(res.data.plans)) {
        setPlans(res.data.plans);
      }
    } catch (e) {
      console.error('Failed to fetch backend staking plans:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendPlans();
  }, []);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setSelectedWallet('main');
    const minVal = parseFloat(plan.min_amount || 30);
    setStakeAmount(minVal.toString());
  };

  const handleConfirmStake = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !stakeAmount) return;

    if (!selectedWallet) {
      toast.error('Please select a wallet.');
      return;
    }

    const amountNum = parseFloat(stakeAmount);
    const minAmt = parseFloat(selectedPlan.min_amount || 0);
    const maxAmt = parseFloat(selectedPlan.max_amount || 999999);

    if (amountNum < minAmt || amountNum > maxAmt) {
      toast.error(`Stake amount must be between $${minAmt.toLocaleString()} and $${maxAmt.toLocaleString()}`);
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
      });

      if (res.data && res.data.success) {
        toast.success(res.data.message || `Successfully staked $${amountNum} in ${selectedPlan.title}!`);
        setSelectedPlan(null);
        setStakeAmount('');
        refreshUser();
      } else {
        toast.error(res.data?.message || 'Staking failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process stake. Please check your balance.');
    } finally {
      setSubmitting(false);
    }
  };

  const amtNum = parseFloat(stakeAmount) || 0;
  const returnRate = selectedPlan ? parseFloat(selectedPlan.daily_return_percent || selectedPlan.apy_percent || 0) : 0;
  const durationDays = selectedPlan ? parseInt(selectedPlan.duration_days || 30) : 30;
  const dailyProfitCalc = (amtNum * returnRate) / 100;
  const totalReturnCalc = dailyProfitCalc * durationDays;

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-wide">
              Staking & Investment Pools
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select a pool to earn guaranteed daily yield synced directly with your wallet.
            </p>
          </div>

          <Link
            href="/staking"
            className="border border-[#182848] text-slate-300 hover:text-white font-bold px-4 py-2 rounded-xl text-xs bg-[#0a1835] hover:bg-[#12244d] transition-all cursor-pointer shadow-md"
          >
            My Active Investments →
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-16 text-center text-slate-400 font-sans">
            Loading active pools from server...
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-16 text-center text-slate-400 font-sans">
            No active staking pools currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const minAmt = parseFloat(plan.min_amount || 0);
              const maxAmt = parseFloat(plan.max_amount || 0);
              const ratePercent = parseFloat(plan.daily_return_percent || 0);
              const days = plan.duration_days || 30;

              return (
                <div
                  key={plan.id}
                  className="bg-[#0c1938] border border-[#1a2b4c] rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-[#fe780b]/50 transition-all group relative overflow-hidden"
                >
                  {plan.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fe780b]/15 text-[#fe780b] border border-[#fe780b]/30">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start pr-12">
                      <h2 className="text-white font-black text-base uppercase tracking-wide font-sans">
                        {plan.title}
                      </h2>
                    </div>

                    <div className="my-3 flex items-baseline justify-between border-b border-[#182848] pb-3">
                      <span className="text-xs text-slate-400 font-medium">Daily Return</span>
                      <span className="text-2xl font-black text-[#fe780b] font-righteous tracking-tight">
                        {ratePercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400 font-medium">Minimum Deposit:</span>
                        <span className="font-bold text-white font-righteous">
                          ${minAmt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400 font-medium">Maximum Deposit:</span>
                        <span className="font-bold text-white font-righteous">
                          ${maxAmt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400 font-medium">Staking Duration:</span>
                        <span className="font-bold text-white font-sans">{days} Days</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenModal(plan)}
                    className="mt-5 w-full bg-gradient-to-r from-[#fe500b] to-[#ff0044] hover:from-[#e04508] hover:to-[#e6003d] text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase font-righteous shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    Stake
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {selectedPlan && (
          <div
            onClick={() => setSelectedPlan(null)}
            className="fixed inset-0 min-h-screen w-full bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b162c] border border-[#1a2846] p-6 sm:p-7 rounded-2xl max-w-md w-full space-y-5 relative shadow-2xl my-auto text-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#182848]">
                <div>
                  <h3 className="text-lg font-bold text-white font-righteous">
                    {selectedPlan.title}
                  </h3>
                  <p className="text-[11px] text-[#fe780b] font-medium">
                    Earn {parseFloat(selectedPlan.daily_return_percent || 0).toFixed(1)}% Daily for {selectedPlan.duration_days} Days
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="w-7 h-7 rounded-full bg-[#142345] hover:bg-[#1e325c] border border-[#233863] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmStake} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Wallet Source
                  </label>
                  <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger className="w-full bg-[#071020] border-[#1b2b4d] text-white rounded-xl h-11 text-xs focus:ring-1 focus:ring-[#ff0044]">
                      <SelectValue placeholder="Select Wallet" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b162c] border-[#1c2e54] text-white">
                      <SelectItem value="main" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">
                        Main Wallet (${parseFloat(user?.balance || 0).toFixed(2)})
                      </SelectItem>
                      <SelectItem value="profit" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">
                        Profit Wallet (${parseFloat(user?.total_earned || 0).toFixed(2)})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter Stake Amount (USD)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Min: ${parseFloat(selectedPlan.min_amount).toLocaleString()} | Max: ${parseFloat(selectedPlan.max_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="any"
                      required
                      min={parseFloat(selectedPlan.min_amount)}
                      max={parseFloat(selectedPlan.max_amount)}
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`${selectedPlan.min_amount}`}
                      className="w-full bg-[#071020] border border-[#1b2b4d] rounded-xl py-2.5 pl-8 pr-4 text-white font-bold text-sm placeholder-slate-600 focus:outline-none focus:border-[#ff0044] transition-all"
                    />
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
