'use client';

import { useState, useEffect } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { ShieldCheck, Info, Lock, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const [gateways] = useState([
    { id: '1', name: 'Tether USDT (BEP20 - BSC)', code: 'USDT_BEP20', badge: 'BSC', feePercent: 1.0, min: 10, max: 50000 },
    { id: '2', name: 'Tether USDT (TRC20 - TRON)', code: 'USDT_TRC20', badge: 'TRON', feePercent: 1.0, min: 10, max: 50000 },
    { id: '3', name: 'Bitcoin (BTC Native)', code: 'BTC', badge: 'BTC', feePercent: 1.0, min: 25, max: 100000 },
    { id: '4', name: 'Ethereum (ERC20)', code: 'ETH', badge: 'ETH', feePercent: 1.0, min: 25, max: 100000 },
  ]);

  const [selectedGateway, setSelectedGateway] = useState(gateways[0]);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState(
    '• Safely withdraw your funds using our highly secure process and various withdrawal methods.\n• Minimum withdrawal limit: $2.00.\n• Processing time: 1–24 hours.\n• Security PIN verification is required for all payout requests.'
  );

  useEffect(() => {
    api.get('/public/deposit-withdrawal-settings').then((res) => {
      if (res.data.success && res.data.settings?.withdrawNotice) {
        setWithdrawNotice(res.data.settings.withdrawNotice);
      }
    }).catch(() => null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !walletAddress || !selectedGateway) return;

    const amountNum = parseFloat(amount);
    if (amountNum < selectedGateway.min || amountNum > selectedGateway.max) {
      toast.error(`Withdrawal amount must be between ₮${selectedGateway.min} and ₮${selectedGateway.max}`);
      return;
    }

    if (amountNum > parseFloat(user?.balance || 0)) {
      toast.error('Insufficient withdrawable balance');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/withdrawals', {
        amount: amountNum,
        withdrawal_method: selectedGateway.code,
        wallet_address: walletAddress,
        withdrawal_pin: pin,
      });

      if (res.data.success) {
        toast.success('Withdrawal request submitted successfully! Pending admin processing.');
        setAmount('');
        setWalletAddress('');
        setPin('');
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const amountNum = parseFloat(amount || 0);
  const fee = (amountNum * selectedGateway.feePercent) / 100;
  const netPayout = Math.max(0, amountNum - fee);

  return (
    <UserSidebarLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Header Banner Pill (Matching Deposit Page Layout) */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white py-3 px-8 rounded-xl font-righteous font-black text-center text-lg tracking-wider uppercase shadow-xl shadow-red-500/20">
            Withdraw Money
          </div>
        </div>

        {/* Main 2-Column Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Withdrawal Gateway Selector & Official Rules (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Balance Card Container */}
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-2xl flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400 font-medium">Available Withdrawable Balance</div>
                <div className="text-2xl font-extrabold text-white font-righteous mt-0.5">
                  ₮{parseFloat(user?.balance || 0).toFixed(2)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-0.5 font-medium">
                <div>Min Limit: <strong className="text-white">₮{selectedGateway.min}.00</strong></div>
                <div>Fee Rate: <strong className="text-[#ff0044]">{selectedGateway.feePercent.toFixed(2)}%</strong></div>
              </div>
            </div>

            {/* Gateway Selector List Card */}
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-2xl space-y-3">
              <label className="block text-xs font-semibold text-slate-300 font-sans mb-1">
                Select Withdrawal Gateway
              </label>
              <div className="divide-y divide-[#16274a]">
                {gateways.map((gw) => {
                  const isSelected = selectedGateway.id === gw.id;
                  return (
                    <div
                      key={gw.id}
                      onClick={() => setSelectedGateway(gw)}
                      className={`flex items-center justify-between py-3.5 px-4 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#12234e] text-white font-bold border-l-4 border-[#ff0044]'
                          : 'text-slate-300 hover:bg-[#0e1d44]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#ff0044] bg-[#ff0044]' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-semibold font-sans">{gw.name}</span>
                      </div>

                      <span className="text-[11px] font-righteous font-bold tracking-wider px-2.5 py-1 rounded bg-[#06102b] border border-[#1a2b57] text-[#ff0044]">
                        {gw.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backend Configured Withdrawal Rules Box (Configured from Admin Dashboard) */}
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white font-righteous flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Withdrawal Rules & Security Policy
              </h3>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-[#06102b] p-3.5 rounded-lg border border-[#1a2b57]">
                {withdrawNotice}
              </div>
            </div>
          </div>

          {/* Right Column: Amount, Fee Calculation & Payout Confirmation Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0b1739] border border-[#1a2b57] rounded-xl p-6 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Withdrawal Amount (₮)
                </label>
                <div className="flex items-center bg-[#06102b] border border-[#1a2b57] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                  <span className="px-3.5 text-xs font-bold text-slate-400 select-none">₮</span>
                  <input
                    type="number"
                    step="any"
                    required
                    min={selectedGateway.min}
                    max={parseFloat(user?.balance || 0)}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-11 bg-transparent border-0 outline-none px-2 text-white font-righteous font-bold text-sm"
                  />
                </div>
              </div>

              {/* Live Calculation Breakdown List */}
              <div className="space-y-2.5 text-xs text-slate-300 border-t border-b border-[#16274a] py-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Limit Range</span>
                  <span className="font-bold text-white font-righteous">
                    ₮{selectedGateway.min}.00 - ₮{selectedGateway.max}.00
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    Processing Fee ({selectedGateway.feePercent.toFixed(2)}%) <Info className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="font-bold text-[#ff0044] font-righteous">
                    ₮{fee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#16274a]/50">
                  <span className="text-slate-400 font-medium">Net Payout Amount</span>
                  <span className="font-bold text-emerald-400 font-righteous text-sm">
                    ₮{netPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Destination Wallet Address Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans flex items-center justify-between">
                  <span>Destination Wallet Address</span>
                  <span className="text-[10px] text-slate-400">({selectedGateway.badge})</span>
                </label>
                <div className="flex items-center gap-2 bg-[#06102b] p-3 rounded-lg border border-[#1a2b57]">
                  <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Paste destination wallet address"
                    className="bg-transparent text-xs font-mono text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Security PIN Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Security PIN Verification
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit security PIN"
                  className="w-full h-11 bg-[#06102b] border border-[#1a2b57] rounded-lg px-3 text-white text-xs font-mono focus:border-[#ff0044] focus:outline-none transition-all"
                />
              </div>

              {/* Confirm Withdrawal Red-Orange Gradient Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-95 text-white font-righteous font-bold py-3.5 rounded-lg text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Processing Request...' : 'Confirm Withdrawal'}
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed font-sans pt-1">
                Your withdrawal request will be processed securely using anti-fraud verification filters.
              </p>
            </form>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
