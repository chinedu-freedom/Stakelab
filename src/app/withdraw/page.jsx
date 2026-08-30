'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import api from '../../lib/api';
import { ShieldCheck, Info, Lock, Wallet, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const [gateways, setGateways] = useState([
    { id: '1', name: 'Tether USDT (BEP20 - BSC)', code: 'USDT_BEP20', badge: 'BSC', symbol: 'USDT', network: 'BEP20' },
    { id: '2', name: 'Tether USDT (TRC20 - TRON)', code: 'USDT_TRC20', badge: 'TRON', symbol: 'USDT', network: 'TRC20' },
    { id: '3', name: 'Bitcoin (BTC Native)', code: 'BTC', badge: 'BTC', symbol: 'BTC', network: 'BTC' },
    { id: '4', name: 'Ethereum (ERC20)', code: 'ETH', badge: 'ETH', symbol: 'ETH', network: 'ERC20' },
  ]);

  const [selectedGateway, setSelectedGateway] = useState(gateways[0]);
  const [userWallets, setUserWallets] = useState([]);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinOtp, setPinOtp] = useState('');
  const [newPinModal, setNewPinModal] = useState('');
  const [showModalPin, setShowModalPin] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState(
    '• Safely withdraw your funds using our highly secure process and various withdrawal methods.\n• Minimum withdrawal limit: $2.00.\n• Processing time: 1–24 hours.\n• Security PIN verification is required for all payout requests.'
  );

  const [globalSettings, setGlobalSettings] = useState({
    minPayout: 2,
    maxPayout: 50000,
    payoutCharge: 1,
  });

  useEffect(() => {
    api.get('/public/deposit-withdrawal-settings').then((res) => {
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        if (s.withdrawNotice) setWithdrawNotice(s.withdrawNotice);
        setGlobalSettings({
          minPayout: parseFloat(s.minPayout || 2),
          maxPayout: parseFloat(s.maxPayout || 50000),
          payoutCharge: parseFloat(s.payoutCharge || 1),
        });
      }
    }).catch(() => null);

    api.get('/payment-methods').then((res) => {
      if (res.data.success && res.data.methods.length > 0) {
        const mapped = res.data.methods.map((m, idx) => ({
          id: m.id || String(idx + 1),
          name: `${m.symbol} (${m.network})`,
          code: `${m.symbol}_${m.network}`,
          badge: m.network,
          symbol: m.symbol,
          network: m.network,
          min: m.min_limit ? parseFloat(m.min_limit) : null,
          max: m.max_limit ? parseFloat(m.max_limit) : null,
          feePercent: m.fee !== undefined && m.fee !== null ? parseFloat(m.fee) : null,
        }));
        setGateways(mapped);
        setSelectedGateway(mapped[0]);
      }
    }).catch(() => null);

    api.get('/user/wallets').then((res) => {
      if (res.data.success && res.data.wallets) {
        setUserWallets(res.data.wallets);
      }
    }).catch(() => null);
  }, []);

  const matchingWallets = userWallets.filter(
    (w) => w.network?.toLowerCase() === selectedGateway?.network?.toLowerCase() ||
           w.symbol?.toLowerCase() === selectedGateway?.symbol?.toLowerCase()
  );

  // Auto-fill wallet address if user has linked a wallet for the selected gateway
  useEffect(() => {
    if (matchingWallets.length > 0) {
      setWalletAddress(matchingWallets[0].address);
    } else {
      setWalletAddress('');
    }
  }, [selectedGateway, userWallets]);

  const minLimit = selectedGateway?.min ?? globalSettings.minPayout;
  const maxLimit = selectedGateway?.max ?? globalSettings.maxPayout;
  const feePercent = selectedGateway?.feePercent ?? globalSettings.payoutCharge;

  const amountNum = parseFloat(amount || 0);
  const fee = (amountNum * feePercent) / 100;
  const netPayout = Math.max(0, amountNum - fee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !walletAddress || !selectedGateway) return;

    if (user && !user.email_verified) {
      toast.error('Please verify your email address to perform withdrawals.');
      window.location.href = '/verify-email';
      return;
    }

    if (amountNum < minLimit || amountNum > maxLimit) {
      toast.error(`Withdrawal amount must be between $${minLimit} and $${maxLimit}`);
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
        withdrawal_method: selectedGateway.code || selectedGateway.name,
        wallet_address: walletAddress,
        withdrawal_pin: pin,
      });

      if (res.data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        setPin('');
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal submission failed');
    } finally {
      setSubmitting(false);
    }
  };

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
                  ${parseFloat(user?.balance || 0).toFixed(2)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-0.5 font-medium">
                <div>Min Limit: <strong className="text-white">${minLimit.toFixed(2)}</strong></div>
                <div>Fee Rate: <strong className="text-[#ff0044]">{feePercent.toFixed(2)}%</strong></div>
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
                      className={`relative flex items-center justify-between py-3.5 px-4 rounded-lg cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? 'bg-[#12234e] text-white font-bold pl-5'
                          : 'text-slate-300 hover:bg-[#0e1d44]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ff0044] to-[#fe780b] rounded-l-lg" />
                      )}
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
                  Withdrawal Amount ($)
                </label>
                <div className="flex items-center bg-[#06102b] border border-[#1a2b57] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                  <span className="pl-3.5 text-xs font-bold text-slate-400 select-none">$</span>
                  <input
                    type="number"
                    step="any"
                    required
                    min={minLimit}
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
                    ${minLimit.toFixed(2)} - ${maxLimit.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    Processing Fee ({feePercent.toFixed(2)}%) <Info className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="font-bold text-[#ff0044] font-righteous">
                    ${fee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#16274a]/50">
                  <span className="text-slate-400 font-medium">Net Payout Amount</span>
                  <span className="font-bold text-emerald-400 font-righteous text-sm">
                    ${netPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Destination Wallet Address Dropdown / Warning */}
              <div className="space-y-2">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-sans">
                    Destination Wallet Address <span className="text-[10px] text-slate-400">({selectedGateway.badge})</span>
                  </label>
                  <Link
                    href="/withdraw/wallet"
                    className="text-[11px] text-[#ff0044] hover:underline font-semibold flex items-center gap-1 shrink-0"
                  >
                    Manage Wallets ➔
                  </Link>
                </div>

                {matchingWallets.length > 0 ? (
                  <Select value={walletAddress} onValueChange={setWalletAddress}>
                    <SelectTrigger className="h-11 bg-[#06102b] border-[#1a2b57] text-white rounded-lg min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0 overflow-hidden w-full">
                        <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                        <SelectValue placeholder="Select Wallet Address" />
                      </div>
                    </SelectTrigger>
                    <SelectContent searchable={false} className="bg-[#081226] border-[#ff0044]/30 text-white shadow-2xl">
                      {matchingWallets.map((w) => (
                        <SelectItem key={w.id || w.address} value={w.address} className="font-mono text-xs text-white">
                          <span className="truncate">{w.label ? `${w.label} - ` : ''}{w.address} ({w.network})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-sans">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> No Payout Wallet Linked for {selectedGateway.badge}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      You must link a verified {selectedGateway.name} payout wallet address before submitting a withdrawal request.
                    </p>
                    <Link
                      href="/withdraw/wallet"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff0044] hover:underline pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Link {selectedGateway.badge} Wallet Now ➔
                    </Link>
                  </div>
                )}
              </div>

              {/* Security PIN Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 font-sans flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Security PIN Verification
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPinModal(true)}
                    className="text-[11px] text-[#ff0044] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot / Set PIN?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit security PIN"
                    className="w-full h-11 bg-[#06102b] border border-[#1a2b57] rounded-lg px-3 pr-10 text-white text-xs font-mono focus:border-[#ff0044] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Withdrawal Red-Orange Gradient Button */}
              <button
                type="submit"
                disabled={submitting || matchingWallets.length === 0}
                className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-95 text-white font-righteous font-bold py-3.5 rounded-lg text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    Processing Request <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  'Confirm Withdrawal'
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed font-sans pt-1">
                Your withdrawal request will be processed securely using anti-fraud verification filters.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Security PIN Reset / Setup Modal */}
      {showPinModal && (
        <div
          onClick={() => setShowPinModal(false)}
          className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-black/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 relative"
          >
            <div className="flex justify-between items-center border-b border-[#16274a] pb-3">
              <h3 className="text-sm font-bold text-white font-righteous flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Set / Reset Security PIN
              </h3>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              To request or set a new 4-digit Security PIN, click <strong className="text-amber-400">Send Verification Code</strong> below to receive a 6-digit OTP code in your registered email.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newPinModal || newPinModal.length < 4) {
                  toast.error('PIN must be 4 digits');
                  return;
                }
                try {
                  setSavingPin(true);
                  const res = await api.post('/user/update-security-pin', {
                    new_pin: newPinModal,
                    otp_code: pinOtp,
                  });
                  if (res.data.success) {
                    toast.success('Security PIN set successfully!');
                    setPin(newPinModal);
                    setShowPinModal(false);
                    setPinOtp('');
                    setNewPinModal('');
                  }
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Failed to update PIN');
                } finally {
                  setSavingPin(false);
                }
              }}
              className="space-y-4"
            >
              {/* Send OTP Button */}
              <div className="flex justify-between items-center bg-[#06102b] p-3 rounded-lg border border-[#1a2b57]">
                <span className="text-xs text-slate-400">Send code to {user?.email}</span>
                <button
                  type="button"
                  disabled={sendingOtp}
                  onClick={async () => {
                    try {
                      setSendingOtp(true);
                      const res = await api.post('/user/send-security-pin-otp');
                      if (res.data.success) {
                        toast.success('6-digit OTP code sent to your email!');
                      }
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Failed to send OTP code');
                    } finally {
                      setSendingOtp(false);
                    }
                  }}
                  className="bg-[#1a2b57] hover:bg-[#253b75] text-amber-400 font-bold px-3 py-1.5 rounded text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {sendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send OTP'}
                </button>
              </div>

              {/* OTP Code Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Email Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={pinOtp}
                  onChange={(e) => setPinOtp(e.target.value)}
                  placeholder="Enter 6-digit email code"
                  className="w-full h-11 bg-[#06102b] border border-[#1a2b57] rounded-lg px-3 text-white text-xs font-mono focus:border-[#ff0044] focus:outline-none"
                />
              </div>

              {/* New 4-Digit PIN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  New 4-Digit Security PIN
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showModalPin ? 'text' : 'password'}
                    maxLength={4}
                    required
                    value={newPinModal}
                    onChange={(e) => setNewPinModal(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full h-11 bg-[#06102b] border border-[#1a2b57] rounded-lg px-3 pr-10 text-white text-xs font-mono focus:border-[#ff0044] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPin(!showModalPin)}
                    className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  >
                    {showModalPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPin}
                className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-95 text-white font-righteous font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
              >
                {savingPin ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving PIN
                  </span>
                ) : (
                  'Save & Verify Security PIN'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </UserSidebarLayout>
  );
}
