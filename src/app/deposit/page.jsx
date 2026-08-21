'use client';

import { useEffect, useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import api from '../../lib/api';
import { Copy, Check, ChevronDown, ChevronUp, ShieldCheck, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function DepositPage() {
  const [gateways, setGateways] = useState([
    { id: '1', name: '2Checkout - USD', badge: '2checkout', symbol: 'USD', minLimit: 1, maxLimit: 10000, fee: 0, rate: 1.0, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: '2', name: 'Aamarpay - BDT', badge: 'aamarpay', symbol: 'BDT', minLimit: 10, maxLimit: 5000, fee: 0, rate: 0.0091, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: '3', name: 'Authorize.net - USD', badge: 'Authorize.Net', symbol: 'USD', minLimit: 10, maxLimit: 25000, fee: 0, rate: 1.0, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: '4', name: 'Bank Transfer', badge: 'Bank Transfer', symbol: 'USDT', minLimit: 50, maxLimit: 50000, fee: 0, rate: 1.0, address: 'USDT TRC20: TYD2v7s8M2yS1x7pL9q3W4e5r6t7y8u9i0' },
    { id: '5', name: 'Binance - BTC', badge: 'BINANCE', symbol: 'BTC', minLimit: 1, maxLimit: 100000, fee: 0, rate: 1.0, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: '6', name: 'Binance Pay - USDT', badge: 'BINANCE PAY', symbol: 'USDT', minLimit: 1, maxLimit: 50000, fee: 0, rate: 1.0, address: 'TYD2v7s8M2yS1x7pL9q3W4e5r6t7y8u9i0' },
    { id: '7', name: 'Tether USDT (TRC20)', badge: 'TRON', symbol: 'USDT', minLimit: 1, maxLimit: 50000, fee: 0, rate: 1.0, address: 'TYD2v7s8M2yS1x7pL9q3W4e5r6t7y8u9i0' },
    { id: '8', name: 'Tether USDT (BEP20)', badge: 'BSC', symbol: 'USDT', minLimit: 1, maxLimit: 50000, fee: 0, rate: 1.0, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  ]);

  const [selectedGateway, setSelectedGateway] = useState(gateways[0]);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rechargeNotice, setRechargeNotice] = useState(
    '• All deposits are verified on the blockchain automatically.\n• Please send exact amounts to official generated wallet address.\n• Minimum deposit limit: $1.00.\n• Deposits below min limits cannot be credited.'
  );

  useEffect(() => {
    api.get('/payment-methods').then((res) => {
      if (res.data.success && res.data.methods.length > 0) {
        // Map backend methods to display format
        const mapped = res.data.methods.map((m, idx) => ({
          id: m.id || String(idx + 1),
          name: `${m.symbol} (${m.network})`,
          badge: m.network,
          symbol: m.symbol,
          minLimit: 1,
          maxLimit: 50000,
          fee: 0,
          rate: 1.0,
          address: m.wallet_address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        }));
        setGateways(mapped);
        setSelectedGateway(mapped[0]);
      }
    }).catch(() => null);

    api.get('/public/deposit-withdrawal-settings').then((res) => {
      if (res.data.success && res.data.settings?.rechargeNotice) {
        setRechargeNotice(res.data.settings.rechargeNotice);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedGateway) return;

    const amountNum = parseFloat(amount);
    if (amountNum < selectedGateway.minLimit || amountNum > selectedGateway.maxLimit) {
      toast.error(`Amount must be between ₮${selectedGateway.minLimit} and ₮${selectedGateway.maxLimit}`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/deposits', {
        amount: amountNum,
        payment_method: selectedGateway.name,
        transaction_hash: txHash,
      });

      if (res.data.success) {
        toast.success('Deposit request submitted successfully! Pending admin verification.');
        setAmount('');
        setTxHash('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const amountNum = parseFloat(amount || 0);
  const fee = selectedGateway?.fee || 0;
  const totalAmount = amountNum + fee;
  const inUSD = totalAmount * (selectedGateway?.rate || 1);

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

        {/* Main 2-Column Container Grid (Matching Exact Screenshot Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Payment Gateways Selector & Backend Deposit Rules (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Gateways Card Container */}
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-2xl space-y-3">
              <div className="divide-y divide-[#16274a]">
                {visibleGateways.map((gw) => {
                  const isSelected = selectedGateway?.id === gw.id;
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

                      {/* Gateway Badge Logo / Text */}
                      <span className="text-[11px] font-righteous font-bold tracking-wider px-2.5 py-1 rounded bg-[#06102b] border border-[#1a2b57] text-[#4a90e2]">
                        {gw.badge}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Show All Payment Options Accordion Toggle */}
              <button
                type="button"
                onClick={() => setShowAllOptions(!showAllOptions)}
                className="w-full pt-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between border-t border-[#16274a] transition-all cursor-pointer"
              >
                <span>{showAllOptions ? 'Show Less Payment Options' : 'Show All Payment Options'}</span>
                {showAllOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Backend Configured Deposit Rules Box (Configured from Admin Dashboard) */}
            <div className="bg-[#0b1739] border border-[#1a2b57] rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white font-righteous flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Deposit Rules & Security Policy
              </h3>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-[#06102b] p-3.5 rounded-lg border border-[#1a2b57]">
                {rechargeNotice}
              </div>
            </div>
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
                  <span className="px-3.5 text-xs font-bold text-slate-400 select-none">₮</span>
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
                    ₮{selectedGateway?.minLimit || 1}.00 - ₮{selectedGateway?.maxLimit || 50000}.00
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

              {/* Wallet Address & Copy Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Deposit Wallet Address ({selectedGateway?.badge})
                </label>
                <div className="flex items-center gap-2 bg-[#06102b] p-3 rounded-lg border border-[#1a2b57]">
                  <input
                    type="text"
                    readOnly
                    value={selectedGateway?.address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                    className="bg-transparent text-xs font-mono text-white w-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="p-1.5 rounded bg-[#16274a] text-[#ff0044] hover:bg-[#ff0044] hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Transaction Hash Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Transaction Hash / ID
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste blockchain transaction hash"
                  className="w-full h-11 bg-[#06102b] border border-[#1a2b57] rounded-lg px-3 text-white text-xs font-mono focus:border-[#ff0044] focus:outline-none transition-all"
                />
              </div>

              {/* Deposit Confirm Red-Orange Gradient Button (Exact Match to Screenshot) */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-95 text-white font-righteous font-bold py-3.5 rounded-lg text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Processing Deposit...' : 'Deposit Confirm'}
              </button>

              {/* Footnote matching reference screenshot */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed font-sans pt-1">
                Ensuring your funds grow safely through our secure deposit process with world-class payment options.
              </p>
            </form>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
