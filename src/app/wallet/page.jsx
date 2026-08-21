'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function WalletPage() {
  const { user } = useAuth();

  const [wallets] = useState([
    { name: 'Bitcoin', symbol: 'BTC', balance: '0.00000000', rate: 77926.52808838, balanceUsdt: 0.0 },
    { name: 'Ethereum', symbol: 'ETH', balance: '0.00000000', rate: 2402.15360773, balanceUsdt: 0.0 },
    { name: 'Litecoin', symbol: 'LTC', balance: '0.00000000', rate: 50.65541403, balanceUsdt: 0.0 },
    { name: 'Dogecoin', symbol: 'DOGE', balance: '0.00000000', rate: 0.08397284, balanceUsdt: 0.0 },
    { name: 'Cardano', symbol: 'ADA', balance: '0.00000000', rate: 0.21368989, balanceUsdt: 0.0 },
    { name: 'Binance COIN', symbol: 'BNB', balance: '0.00000000', rate: 679.76598936, balanceUsdt: 0.0 },
    { name: 'Highstreet', symbol: 'HIGH', balance: '0.00000000', rate: 0.02534224, balanceUsdt: 0.0 },
    { name: 'Solana', symbol: 'SOL', balance: '0.00000000', rate: 91.41547913, balanceUsdt: 0.0 },
    { name: 'Shiba Inu', symbol: 'SHIB', balance: '0.00000000', rate: 0.00000522, balanceUsdt: 0.0 },
  ]);

  const [selectedWallet, setSelectedWallet] = useState(null);
  const totalWalletUsdt = wallets.reduce((acc, curr) => acc + curr.balanceUsdt, 0);

  const handleDetails = (wallet) => {
    setSelectedWallet(wallet);
    toast.info(`${wallet.name} (${wallet.symbol}) wallet details loaded.`);
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar: Title on Left, Total Balance on Right */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            My Wallet
          </h1>
          <div className="text-sm font-semibold text-slate-300 font-righteous">
            Total Wallets balance in USDT : <span className="text-white font-bold">₮{totalWalletUsdt.toFixed(2)}</span>
          </div>
        </div>

        {/* Wallets Table Container (Exact Match to Reference Screenshot) */}
        <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-xs font-bold text-white uppercase tracking-wider">
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Currency Name</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Balance</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Rate</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Balance in USDT</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16274a]">
                {wallets.map((wallet) => (
                  <tr key={wallet.symbol} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all text-xs">
                    <td className="py-4 px-6 font-bold text-white border-r border-[#ff0044]/10">
                      {wallet.name}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-300 border-r border-[#ff0044]/10">
                      {wallet.balance} {wallet.symbol}
                    </td>
                    <td className="py-4 px-6 font-righteous text-white border-r border-[#ff0044]/10">
                      ₮{wallet.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>
                    <td className="py-4 px-6 font-righteous text-slate-300 border-r border-[#ff0044]/10">
                      ₮{wallet.balanceUsdt.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/wallet/${wallet.symbol.toLowerCase()}`}
                        className="btn-stakelab inline-block px-4 py-1.5 rounded text-xs font-bold font-righteous transition-all shadow-md shadow-red-500/20 hover:scale-105"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Wallet Details Modal / Panel */}
        {selectedWallet && (
          <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#16274a] pb-3">
              <h2 className="text-base font-bold text-white font-righteous">
                {selectedWallet.name} ({selectedWallet.symbol}) Details
              </h2>
              <button
                onClick={() => setSelectedWallet(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#060f22] p-4 rounded-lg border border-[#16274a]">
                <div className="text-slate-400 font-medium">Available Balance</div>
                <div className="text-lg font-bold text-white mt-1">{selectedWallet.balance} {selectedWallet.symbol}</div>
              </div>
              <div className="bg-[#060f22] p-4 rounded-lg border border-[#16274a]">
                <div className="text-slate-400 font-medium">Live Rate</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">₮{selectedWallet.rate.toFixed(4)}</div>
              </div>
              <div className="bg-[#060f22] p-4 rounded-lg border border-[#16274a]">
                <div className="text-slate-400 font-medium">Equivalent USDT</div>
                <div className="text-lg font-bold text-white mt-1">₮{selectedWallet.balanceUsdt.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
