'use client';

import { useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';

export default function CurrencyPage() {
  const [currencies] = useState([
    {
      name: 'Binance COIN',
      symbol: 'BNB',
      price: 678.46764179,
      change1h: 0.01,
      change24h: 5.41,
      marketCap: '₮90,346,949,707.0030',
    },
    {
      name: 'Bitcoin',
      symbol: 'Ƀ',
      price: 77670.12344787,
      change1h: -0.19,
      change24h: 7.71,
      marketCap: '₮1,558,957,280,846.2000',
    },
    {
      name: 'Cardano',
      symbol: '₳',
      price: 0.21336606,
      change1h: -1.0,
      change24h: 12.12,
      marketCap: '₮7,800,655,413.8307',
    },
    {
      name: 'Dogecoin',
      symbol: 'Ð',
      price: 0.08448917,
      change1h: -0.03,
      change24h: 9.5,
      marketCap: '₮13,145,111,157.1220',
    },
    {
      name: 'Ethereum',
      symbol: 'Ξ',
      price: 2393.81157077,
      change1h: -0.21,
      change24h: 4.5,
      marketCap: '₮288,889,221,217.9600',
    },
    {
      name: 'Highstreet',
      symbol: 'H',
      price: 0.02103242,
      change1h: -26.57,
      change24h: -13.38,
      marketCap: '₮2,052,989.5726',
    },
    {
      name: 'Litecoin',
      symbol: 'Ł',
      price: 50.81685836,
      change1h: 0.32,
      change24h: 7.26,
      marketCap: '₮3,939,410,731.5787',
    },
    {
      name: 'Shiba Inu',
      symbol: 'S',
      price: 0.00000527,
      change1h: 0.93,
      change24h: 7.16,
      marketCap: '₮3,107,447,291.7288',
    },
    {
      name: 'Solana',
      symbol: 'S',
      price: 91.41826885,
      change1h: -0.27,
      change24h: 4.68,
      marketCap: '₮53,313,161,671.7980',
    },
  ]);

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Currency List
        </h1>

        {/* Currency Table Container (Matching Exact Reference Screenshot) */}
        <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-xs font-bold text-white tracking-wider">
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Currency Name</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Currency Symbol</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">Price</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">1h Change</th>
                  <th className="py-4 px-6 border-r border-[#ff0044]/20">24h Change</th>
                  <th className="py-4 px-6">Marketcap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16274a]">
                {currencies.map((coin, idx) => (
                  <tr key={idx} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all text-xs">
                    {/* Currency Name */}
                    <td className="py-4 px-6 font-bold text-white border-r border-[#ff0044]/10">
                      {coin.name}
                    </td>

                    {/* Currency Symbol */}
                    <td className="py-4 px-6 font-medium text-slate-300 border-r border-[#ff0044]/10">
                      {coin.symbol}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-righteous text-white border-r border-[#ff0044]/10">
                      ₮{coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>

                    {/* 1h Change */}
                    <td
                      className={`py-4 px-6 font-semibold border-r border-[#ff0044]/10 ${
                        coin.change1h >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {coin.change1h >= 0 ? `${coin.change1h.toFixed(2)}%` : `${coin.change1h.toFixed(2)}%`}
                    </td>

                    {/* 24h Change */}
                    <td
                      className={`py-4 px-6 font-semibold border-r border-[#ff0044]/10 ${
                        coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {coin.change24h >= 0 ? `${coin.change24h.toFixed(2)}%` : `${coin.change24h.toFixed(2)}%`}
                    </td>

                    {/* Marketcap */}
                    <td className="py-4 px-6 font-righteous text-slate-200">
                      {coin.marketCap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
