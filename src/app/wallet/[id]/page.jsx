'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import { Wallet, MessageSquare, HandCoins, ClipboardList, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';

const walletPresets = {
  btc: { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.00000000', rate: 77818.07684452, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  eth: { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '0.00000000', rate: 2402.15360773, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  ltc: { id: 'ltc', name: 'Litecoin', symbol: 'LTC', balance: '0.00000000', rate: 50.65541403, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  doge: { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', balance: '0.00000000', rate: 0.08397284, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  ada: { id: 'ada', name: 'Cardano', symbol: 'ADA', balance: '0.00000000', rate: 0.21368989, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  bnb: { id: 'bnb', name: 'Binance COIN', symbol: 'BNB', balance: '0.00000000', rate: 679.76598936, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  high: { id: 'high', name: 'Highstreet', symbol: 'HIGH', balance: '0.00000000', rate: 0.02534224, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  sol: { id: 'sol', name: 'Solana', symbol: 'SOL', balance: '0.00000000', rate: 91.41547913, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
  shib: { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', balance: '0.00000000', rate: 0.00000522, balanceUsdt: 0.0, totalBuy: '0.00000000', totalSale: '0.00000000' },
};

export default function WalletDetailsPage({ params }) {
  const resolvedParams = use(params);
  const walletId = (resolvedParams?.id || 'btc').toLowerCase();
  const wallet = walletPresets[walletId] || walletPresets.btc;

  const [transactions] = useState([]);

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Wallets: {wallet.name} ({wallet.symbol})
        </h1>

        {/* 3 Top Stat Cards (Matching Reference Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat Card 1: Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <Wallet className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Balance</div>
                <div className="text-sm font-bold text-white font-righteous mt-0.5">
                  {wallet.balance} {wallet.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Total Sale */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <MessageSquare className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Sale</div>
                <div className="text-sm font-bold text-white font-righteous mt-0.5">
                  {wallet.totalSale} {wallet.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 3: Total Buy */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <HandCoins className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Buy</div>
                <div className="text-sm font-bold text-white font-righteous mt-0.5">
                  {wallet.totalBuy} {wallet.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Wallet Overview Box & Action Buttons */}
          <div className="lg:col-span-5 bg-[#0a1835] border border-[#182848] rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
            {/* Card Header Bar */}
            <div className="bg-[#0e1c38] border-b border-[#182848] px-6 py-4 text-center">
              <h2 className="text-base font-bold text-white font-righteous">
                {wallet.name}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              {/* Available Balance Box */}
              <div className="bg-[#060f22] border border-[#182848] rounded-lg p-4">
                <div className="text-base font-extrabold text-white font-righteous">
                  {wallet.balance} {wallet.symbol}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">
                  Available Balance
                </div>
              </div>

              {/* Rate & Balance in USDT Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#060f22] border border-[#182848] rounded-lg p-3.5">
                  <div className="text-xs font-bold text-white font-righteous truncate">
                    ₮{wallet.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Rate
                  </div>
                </div>

                <div className="bg-[#060f22] border border-[#182848] rounded-lg p-3.5">
                  <div className="text-xs font-bold text-white font-righteous">
                    ₮{wallet.balanceUsdt.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Balance in USDT
                  </div>
                </div>
              </div>

              {/* Buy & Sale Outline Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/deposit"
                  className="w-full border border-emerald-500/80 text-emerald-400 font-bold py-2.5 rounded-lg text-center text-xs font-righteous hover:bg-emerald-500/15 transition-all"
                >
                  Buy
                </Link>

                <Link
                  href="/withdraw"
                  className="w-full border border-red-500/80 text-red-400 font-bold py-2.5 rounded-lg text-center text-xs font-righteous hover:bg-red-500/15 transition-all"
                >
                  Sale
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Transactions Empty State */}
          <div className="lg:col-span-7 bg-[#0a1835] border border-[#182848] rounded-xl p-12 text-center shadow-xl flex flex-col items-center justify-center min-h-[300px]">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
                  <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
                </div>
                <p className="text-sm font-semibold text-slate-300 font-sans">
                  No Transaction Found
                </p>
              </div>
            ) : (
              <div className="w-full text-left">
                {/* Table for transactions */}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
