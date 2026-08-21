'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { Shield, Lock, Wallet, Plus, Check, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AddWithdrawalWalletPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [withdrawalPin, setWithdrawalPin] = useState('');

  const cryptoOptions = [
    { value: 'USDT_TRC20', name: 'USDT (Tron TRC20)', symbol: 'USDT', network: 'TRC20' },
    { value: 'USDT_BEP20', name: 'USDT (BNB Smart Chain BEP20)', symbol: 'USDT', network: 'BEP20' },
    { value: 'BTC', name: 'Bitcoin (BTC)', symbol: 'BTC', network: 'Bitcoin' },
    { value: 'ETH', name: 'Ethereum (ERC20)', symbol: 'ETH', network: 'ERC20' },
    { value: 'SOL', name: 'Solana (SOL)', symbol: 'SOL', network: 'Solana' },
    { value: 'BNB', name: 'Binance Coin (BNB)', symbol: 'BNB', network: 'BEP20' },
  ];

  const fetchUserWallets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/wallets');
      if (res.data.success) {
        setWallets(res.data.wallets || []);
      }
    } catch (err) {
      console.error('Failed to fetch user wallets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWallets();
  }, []);

  const handleSaveWallet = async (e) => {
    e.preventDefault();
    if (!walletAddress || walletAddress.trim().length < 10) {
      toast.error('Please enter a valid wallet address.');
      return;
    }

    const currentCrypto = cryptoOptions.find((c) => c.value === selectedCrypto) || cryptoOptions[0];

    setSubmitting(true);
    try {
      const res = await api.post('/user/wallets', {
        symbol: currentCrypto.symbol,
        network: currentCrypto.network,
        address: walletAddress.trim(),
        label: walletLabel || `${currentCrypto.name} Payout Wallet`,
        withdrawal_pin: withdrawalPin,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Payout wallet address saved successfully!');
        setWalletAddress('');
        setWalletLabel('');
        setWithdrawalPin('');
        fetchUserWallets();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to link wallet. Check security password/PIN.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Wallet address copied to clipboard!');
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Add Payout Wallet
          </h1>
          <Link
            href="/withdraw"
            className="btn-stakelab-outline px-4 py-2 text-xs rounded-lg font-bold"
          >
            ← Back to Withdraw
          </Link>
        </div>

        {/* Security Alert Header Banner */}
        <div className="bg-[#0a1835] border border-amber-500/30 rounded-xl p-5 text-slate-200 shadow-xl flex items-start gap-3.5">
          <Shield className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white font-righteous">
              Security Notice: Withdrawal Address Protection
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Linking or changing a payout wallet address requires entering your Security Withdrawal PIN / Password. An automatic email security notification will be sent upon each address update.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add Wallet Form Card (2 Cols on Desktop) */}
          <div className="lg:col-span-1 bg-[#0b162c] border border-[#ff0044]/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <h2 className="text-base font-bold text-white font-righteous border-b border-[#182848] pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#ff0044]" /> Link New Wallet
            </h2>

            <form onSubmit={handleSaveWallet} className="space-y-4">
              {/* Select Cryptocurrency & Network */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payout Cryptocurrency & Network <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full bg-[#060f22] border border-[#182848] rounded-xl py-3 px-4 text-white font-bold text-xs focus:border-[#ff0044] focus:outline-none cursor-pointer"
                >
                  {cryptoOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wallet Address Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Destination Wallet Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter crypto wallet address..."
                  className="w-full bg-[#060f22] border border-[#182848] rounded-xl py-3 px-4 text-white font-mono text-xs focus:border-[#ff0044] focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Label / Nickname */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Wallet Label / Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                  placeholder="e.g. My Binance Wallet / Trust Wallet"
                  className="w-full bg-[#060f22] border border-[#182848] rounded-xl py-3 px-4 text-white text-xs focus:border-[#ff0044] focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Security Verification Password / PIN Field */}
              <div className="pt-2 border-t border-[#182848]">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Security PIN / Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={withdrawalPin}
                  onChange={(e) => setWithdrawalPin(e.target.value)}
                  placeholder="Enter 4-digit PIN or password..."
                  className="w-full bg-[#060f22] border border-amber-500/40 rounded-xl py-3 px-4 text-white font-bold text-xs focus:border-amber-400 focus:outline-none transition-all shadow-inner"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Protects your account against unauthorized wallet address changes.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-stakelab py-3.5 rounded-xl text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {submitting ? 'Verifying & Saving...' : 'Save & Link Payout Wallet'}
              </button>
            </form>
          </div>

          {/* Saved Linked Payout Wallets Table (2 Cols on Desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white font-righteous">
              Linked Payout Wallets
            </h2>

            <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-xs font-bold text-white uppercase tracking-wider">
                      <th className="py-4 px-6">Crypto & Network</th>
                      <th className="py-4 px-6">Wallet Address</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#16274a]">
                    {wallets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-medium">
                          No saved payout wallets linked yet. Fill out the form to link your payout address.
                        </td>
                      </tr>
                    ) : (
                      wallets.map((w) => (
                        <tr key={w.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all text-xs">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white">{w.label || w.symbol}</div>
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                              {w.symbol} ({w.network})
                            </span>
                          </td>

                          <td className="py-4 px-6 font-mono text-slate-300">
                            {w.address.substring(0, 10)}...{w.address.substring(w.address.length - 8)}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              <Check className="w-3 h-3" /> Verified Active
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => copyToClipboard(w.address)}
                              className="btn-stakelab-outline px-3 py-1.5 rounded text-[11px] font-bold inline-flex items-center gap-1.5"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
