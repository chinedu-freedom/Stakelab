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

  const [activeTier, setActiveTier] = useState('Flexible Tier');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [stakeAmount, setStakeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBackendPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staking/plans');
      if (res.data && res.data.success && Array.isArray(res.data.plans)) {
        const uniquePlansMap = new Map();
        res.data.plans.forEach((p) => {
          const key = p.title.trim().toLowerCase();
          if (!uniquePlansMap.has(key)) {
            uniquePlansMap.set(key, p);
          }
        });
        setPlans(Array.from(uniquePlansMap.values()));
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

    if (user && !user.email_verified) {
      toast.error('Please verify your email address to perform staking.');
      window.location.href = '/verify-email';
      return;
    }

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
        if (refreshUser) refreshUser();
      } else {
        toast.error(res.data?.message || 'Staking failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Staking transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (!p.tier) return true;
    return p.tier.toLowerCase() === activeTier.toLowerCase();
  });

  const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans;

  // Stake Modal Live Calculation
  const P = parseFloat(stakeAmount || 0);
  const r = selectedPlan ? parseFloat(selectedPlan.daily_return_percent || 0) / 100 : 0;
  const days = selectedPlan ? parseInt(selectedPlan.duration_days || 1) : 1;
  const isCapitalReturn = selectedPlan ? selectedPlan.capital_return !== false : true;

  const dailyProfit = P * r;
  const totalProfit = dailyProfit * days;
  const capitalBack = isCapitalReturn ? P : 0;
  const estimatedTotalReturn = totalProfit + capitalBack;

  return (
    <UserSidebarLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a1835] border border-[#182848] rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide flex items-center gap-2">
              Staking <span className="text-gradient-stakelab">Pools</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Choose your preferred staking tier and lockup period to generate high daily crypto yield.
            </p>
          </div>
        </div>

        {/* Tier Selector Tabs (Matching User Screenshot) */}
        <div className="flex items-center gap-3">
          {['Flexible Tier', 'Dynamic Tier'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTier(tab)}
              aria-pressed={activeTier === tab}
              className={`px-6 py-2.5 rounded-full font-righteous text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer select-none ${
                activeTier === tab
                  ? 'bg-gradient-to-r from-[#fe500b] to-[#ff0044] text-white shadow-red-500/30 scale-105'
                  : 'bg-[#0a1835] hover:bg-[#12244a] border border-[#182848] text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Staking Plan Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-[#0a1835] border border-[#182848] rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPlans.map((plan) => {
              const days = plan.duration_days || 30;
              const minAmt = parseFloat(plan.min_amount || 0);
              const maxAmt = parseFloat(plan.max_amount || 0);
              const dailyReturn = parseFloat(plan.daily_return_percent || 0);

              return (
                <div key={plan.id} className="relative group flex flex-col">
                  {/* Outer Shield Border Wrap */}
                  <div
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                    }}
                    className="p-[2px] bg-gradient-to-b from-slate-800 via-[#ff0044] to-[#fe780b] rounded-t-3xl flex-1 flex flex-col drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                  >
                    {/* Inner Dark Card Body */}
                    <div
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                      }}
                      className="w-full bg-[#0c1424] rounded-t-3xl pt-8 pb-16 px-6 sm:px-8 text-slate-100 flex-1 flex flex-col justify-between relative"
                    >
                      <div>
                        {/* Title */}
                        <h3 className="font-righteous text-3xl sm:text-4xl font-extrabold text-white text-center tracking-wide uppercase">
                          {plan.title}
                        </h3>

                        {/* Ribbon Banner */}
                        <div className="relative my-6 -mx-6 sm:-mx-8">
                          <div className="bg-gradient-to-r from-[#fe500b] via-[#ff0044] to-[#fe880b] text-white font-righteous text-lg sm:text-xl font-bold py-3 text-center shadow-lg tracking-wide uppercase">
                            Stake for {days} Days
                          </div>
                          <div className="absolute -left-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-l-[8px] border-l-transparent" />
                          <div className="absolute -right-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-r-[8px] border-r-transparent" />
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 my-8 font-sans">
                          <div className="flex justify-between items-center text-sm sm:text-base border-b border-slate-800/80 pb-2.5">
                            <span className="text-slate-400 font-semibold">Daily Return</span>
                            <span className="font-bold text-emerald-400 font-mono text-lg">{dailyReturn.toFixed(1)}%</span>
                          </div>

                          <div className="flex justify-between items-center text-sm sm:text-base border-b border-slate-800/80 pb-2.5">
                            <span className="text-slate-400 font-semibold">Minimum Deposit</span>
                            <span className="font-bold text-white font-mono">${minAmt.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center text-sm sm:text-base border-b border-slate-800/80 pb-2.5">
                            <span className="text-slate-400 font-semibold">Maximum Deposit</span>
                            <span className="font-bold text-white font-mono">${maxAmt.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center text-sm sm:text-base border-b border-slate-800/80 pb-2.5">
                            <span className="text-slate-400 font-semibold">Capital Return</span>
                            <span className={`font-bold ${plan.capital_return !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {plan.capital_return !== false ? 'YES' : 'NO'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stake Button */}
                      <div className="pt-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(plan)}
                          className="w-full btn-stakelab py-4 rounded-xl text-white font-sans text-base sm:text-lg tracking-wider uppercase font-extrabold transition-all shadow-xl shadow-red-500/25 cursor-pointer"
                        >
                          STAKE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stake Now Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
            <div className="bg-[#09152b] border border-[#1b2b4d] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-start border-b border-[#182848] pb-4">
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

                {/* Dynamic Return Calculation Summary Box */}
                <div className="bg-[#050c18] border border-[#1b2b4d] rounded-2xl p-4 space-y-2.5 text-xs font-sans">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Daily Return ({parseFloat(selectedPlan.daily_return_percent || 0).toFixed(1)}%):</span>
                    <span className="font-bold text-white font-mono">${dailyProfit.toFixed(2)} / day</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Total Net Profit ({days} Days):</span>
                    <span className="font-bold text-emerald-400 font-mono">+${totalProfit.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Capital Return at Maturity:</span>
                    <span className={`font-bold font-mono ${isCapitalReturn ? 'text-blue-400' : 'text-slate-500'}`}>
                      {isCapitalReturn ? `+$${P.toFixed(2)} (100% Back)` : 'None (Profit Only)'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#182848] flex items-center justify-between font-bold">
                    <span className="text-white text-xs uppercase tracking-wider font-righteous">Estimated Total Return:</span>
                    <span className="text-base text-gradient-stakelab font-righteous tracking-wide font-black">
                      ${estimatedTotalReturn.toFixed(2)} USD
                    </span>
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
                      Processing Stake <Loader2 className="w-4 h-4 animate-spin" />
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
