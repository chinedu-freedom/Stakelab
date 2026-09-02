'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import api from '../../lib/api';
import { Copy, Check, ChevronDown, ChevronUp, ShieldCheck, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../context/AuthContext';

export default function DepositPage() {
  const { user } = useAuth();
  const [gateways, setGateways] = useState([
    { id: '1', name: 'USDT (BEP20)', badge: 'BEP20', symbol: 'USDT', minLimit: 10, maxLimit: 100000, fee: 0, rate: 1.0, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: '2', name: 'USDT (TRC20)', badge: 'TRC20', symbol: 'USDT', minLimit: 10, maxLimit: 100000, fee: 0, rate: 1.0, address: 'TYD2v7s8M2yS1x7pL9q3W4e5r6t7y8u9i0' },
    { id: '3', name: 'BTC (Bitcoin)', badge: 'Bitcoin', symbol: 'BTC', minLimit: 10, maxLimit: 100000, fee: 0, rate: 1.0, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: '4', name: 'ETH (ERC20)', badge: 'ERC20', symbol: 'ETH', minLimit: 10, maxLimit: 100000, fee: 0, rate: 1.0, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  ]);

  const [selectedGateway, setSelectedGateway] = useState(gateways[0]);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rechargeNotice, setRechargeNotice] = useState('');

  const [globalSettings, setGlobalSettings] = useState({
    minDeposit: 1,
    maxDeposit: 50000,
    depositCharge: 0,
  });

  useEffect(() => {
    api.get('/public/deposit-withdrawal-settings').then((res) => {
      if (res.data?.success && res.data?.settings) {
        const s = res.data.settings;
        if (s.rechargeNotice !== undefined) setRechargeNotice(s.rechargeNotice);
        setGlobalSettings({
          minDeposit: parseFloat(s.minDeposit || 1),
          maxDeposit: parseFloat(s.maxDeposit || 50000),
          depositCharge: parseFloat(s.depositCharge || 0),
        });
      }
    }).catch(() => null);

    api.get('/payment-methods').then((res) => {
      if (res.data.success && res.data.methods.length > 0) {
        const mapped = res.data.methods.map((m, idx) => ({
          id: m.id || String(idx + 1),
          name: `${m.symbol} (${m.network})`,
          badge: m.network,
          symbol: m.symbol,
          minLimit: m.min_limit ? parseFloat(m.min_limit) : null,
          maxLimit: m.max_limit ? parseFloat(m.max_limit) : null,
          fee: m.fee !== undefined && m.fee !== null ? parseFloat(m.fee) : null,
          rate: m.rate ? parseFloat(m.rate) : 1.0,
          address: m.wallet_address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        }));
        setGateways(mapped);
        setSelectedGateway(mapped[0]);
      }
    }).catch(() => null);
  }, []);

  const copyAddress = () => {
    if (selectedGateway?.address) {
      navigator.clipboard.writeText(selectedGateway.address);
      setCopied(true);
      toast.success('Wallet address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [dynamicInvoice, setDynamicInvoice] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const minLimit = selectedGateway?.minLimit ?? globalSettings.minDeposit;
  const maxLimit = selectedGateway?.maxLimit ?? globalSettings.maxDeposit;
  const feePercent = selectedGateway?.fee ?? globalSettings.depositCharge;

  const amountNum = parseFloat(amount || 0);
  const fee = (amountNum * feePercent) / 100;
  const totalAmount = amountNum + fee;
  const inUSD = totalAmount * (selectedGateway?.rate || 1);

  // Live polling for deposit status when dynamic invoice is active
  useEffect(() => {
    if (!dynamicInvoice || paymentConfirmed) return;

    const pollId = dynamicInvoice.trackId || dynamicInvoice.depositId;
    if (!pollId) return;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/deposits/status/${pollId}`);
        if (res.data && res.data.success && res.data.isConfirmed) {
          setPaymentConfirmed(true);
          toast.success('🎉 Deposit confirmed and credited successfully!');
          setTimeout(() => {
            window.location.href = '/staking';
          }, 3500);
        }
      } catch (err) {
        console.error('Polling deposit status error:', err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3500);

    return () => clearInterval(interval);
  }, [dynamicInvoice, paymentConfirmed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedGateway) return;

    if (user && !user.email_verified) {
      toast.error('Please verify your email address to perform deposits.');
      window.location.href = '/verify-email';
      return;
    }

    if (amountNum < minLimit || amountNum > maxLimit) {
      toast.error(`Amount must be between $${minLimit} and $${maxLimit}`);
      return;
    }

    try {
      setSubmitting(true);
      setPaymentConfirmed(false);

      const res = await api.post('/deposits', {
        amount: totalAmount, // Pass total amount (deposit + processing fee)
        payment_method: selectedGateway.name,
        transaction_hash: txHash,
      });

      if (res.data.success) {
        if (res.data.dynamic && res.data.address) {
          setDynamicInvoice({
            address: res.data.address,
            trackId: res.data.trackId || res.data.deposit?.track_id || res.data.deposit?.id,
            depositId: res.data.deposit?.id || res.data.depositId,
            amount: totalAmount.toFixed(2),
            method: selectedGateway.name,
          });
        } else {
          toast.success('Deposit request submitted successfully! Pending admin verification.');
          setAmount('');
          setTxHash('');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleGateways = showAllOptions ? gateways : gateways.slice(0, 5);

  return (
    <UserSidebarLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Header Banner Pill (Exact Match to Screenshot) */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl bg-gradient-to-r from-[#ff5722] to-[#ff3d00] text-white py-3 px-8 rounded-xl font-righteous font-black text-center text-lg tracking-wider uppercase shadow-xl shadow-orange-500/20">
            Deposit
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-2xl space-y-3">
              <div className="divide-y divide-[#16274a]">
                {gateways.map((gw) => {
                  const isSelected = selectedGateway?.id === gw.id;
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

                      <span className="text-[11px] font-righteous font-bold tracking-wider px-2.5 py-1 rounded bg-[#06102b] border border-[#1a2b57] text-[#4a90e2]">
                        {gw.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {Boolean(rechargeNotice && rechargeNotice.trim() !== '') && (
              <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-white font-righteous flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Deposit Rules & Security Policy
                </h3>
                <div
                  className="text-xs text-slate-300 leading-relaxed font-sans bg-[#06102b] p-3.5 rounded-lg border border-[#1a2b57] prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: rechargeNotice }}
                />
              </div>
            )}
          </div>

          {/* Right Column: Amount, Calculation & Confirmation Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0b1739] border border-[#1a2b57] rounded-xl p-6 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Amount
                </label>
                <div className="flex items-center bg-[#06102b] border border-[#1a2b57] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                  <span className="pl-3.5 text-xs font-bold text-slate-400 select-none">$</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="00.00"
                    className="w-full h-11 bg-transparent border-0 outline-none px-2 text-white font-righteous font-bold text-sm"
                  />
                </div>
              </div>

              {/* Real-time Calculation Breakdown List (Exact Match to Screenshot) */}
              <div className="space-y-2.5 text-xs text-slate-300 border-t border-b border-[#16274a] py-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Limit</span>
                  <span className="font-bold text-white font-righteous">
                    ${minLimit.toFixed(2)} - ${maxLimit.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    Processing Charge <Info className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="font-bold text-white font-righteous">
                    {fee.toFixed(2)} USDT
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Total</span>
                  <span className="font-bold text-white font-righteous">
                    {totalAmount.toFixed(2)} USDT
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Conversion</span>
                  <span className="font-bold text-white font-righteous">
                    1 USDT = 1.00 USD
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#16274a]/50">
                  <span className="text-slate-400 font-medium">In USD</span>
                  <span className="font-bold text-emerald-400 font-righteous text-sm">
                    {inUSD.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Deposit Confirm Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-stakelab py-3.5 rounded-xl text-white font-sans text-xs tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    Processing <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  'Deposit Now →'
                )}
              </button>

              {/* Footnote matching reference screenshot */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed font-sans pt-1">
                Ensuring your funds grow safely through our secure deposit process with world-class payment options.
              </p>
            </form>
          </div>
        </div>

        {/* Dynamic Payment Invoice Modal */}
        {dynamicInvoice && (
          <div
            onClick={() => setDynamicInvoice(null)}
            className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b1739] border border-[#1a2b57] rounded-2xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl relative my-auto animate-in fade-in zoom-in duration-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#16274a]">
                <h3 className="text-sm font-bold text-white font-righteous">
                  {paymentConfirmed ? 'Payment Confirmed' : 'Automated Payment Address'}
                </h3>
                <button
                  onClick={() => setDynamicInvoice(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {paymentConfirmed ? (
                /* Celebration Success Card on Confirmed Deposit */
                <div className="space-y-5 py-2 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-white font-righteous">
                      🎉 Deposit Confirmed & Credited!
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold font-sans">
                      +${dynamicInvoice.amount} USDT has been credited to your Staking Wallet
                    </p>
                  </div>

                  <div className="bg-[#06102b] p-4 rounded-xl border border-emerald-500/30 text-xs text-slate-300 space-y-2 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Status:</span>
                      <span className="text-emerald-400 font-bold">COMPLETED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount Credited:</span>
                      <span className="text-white font-bold">${dynamicInvoice.amount} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Network:</span>
                      <span className="text-slate-200 font-medium">{dynamicInvoice.method}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 animate-pulse font-mono">
                    Redirecting to Staking Plans...
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href="/staking"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-all text-center font-righteous shadow-lg shadow-emerald-500/20"
                    >
                      Start Staking Now
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex-1 bg-[#12234e] hover:bg-[#16274a] text-slate-300 font-bold py-2.5 rounded-lg text-xs transition-all text-center font-righteous"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                /* QR Code & Payment Address Waiting Box */
                <>
                  <div className="bg-[#06102b] p-4 rounded-xl border border-[#1a2b57] space-y-3">
                    <p className="text-xs text-slate-300">
                      Send <span className="font-bold text-emerald-400 font-righteous">${dynamicInvoice.amount} USD</span> via{' '}
                      <span className="font-bold text-white">{dynamicInvoice.method}</span> to the unique address below:
                    </p>

                    {/* QR Code */}
                    <div className="flex justify-center py-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dynamicInvoice.address)}`}
                        alt="Deposit QR Code"
                        className="w-40 h-40 rounded-lg border-4 border-[#16274a] bg-white p-1"
                      />
                    </div>

                    {/* Address Box */}
                    <div className="flex items-center gap-2 bg-[#0b1739] p-3 rounded-lg border border-[#1a2b57]">
                      <input
                        type="text"
                        readOnly
                        value={dynamicInvoice.address}
                        className="bg-transparent text-xs font-mono text-emerald-400 w-full focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(dynamicInvoice.address);
                          toast.success('Payment address copied!');
                        }}
                        className="p-1.5 rounded bg-[#16274a] text-[#ff0044] hover:bg-[#ff0044] hover:text-white transition-all shrink-0 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {dynamicInvoice.trackId && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        Track ID: <span className="text-slate-200">{dynamicInvoice.trackId}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Waiting for blockchain payment... (Auto-credits on completion)
                  </div>

                  <button
                    type="button"
                    onClick={() => setDynamicInvoice(null)}
                    className="w-full bg-[#12234e] hover:bg-[#16274a] text-white font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
