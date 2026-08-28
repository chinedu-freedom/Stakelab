'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { ClipboardList, ArrowDownLeft } from 'lucide-react';

export default function DepositHistoryPage() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits');
      if (res.data.success) {
        setDeposits(res.data.deposits || []);
      }
    } catch (err) {
      console.error('Failed to load deposit history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Deposit History
          </h1>

          <Link
            href="/deposit"
            className="btn-stakelab px-4 sm:px-5 py-2 rounded-lg text-xs font-bold font-righteous uppercase transition-all shadow-md shadow-red-500/20 flex items-center gap-2 shrink-0"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit Now
          </Link>
        </div>

        {/* Deposit Table Container or Empty State (Matching Reference Screenshot) */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400">
            Loading deposit history...
          </div>
        ) : deposits.length === 0 ? (
          /* Empty State Card */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              No Deposit Found
            </p>
          </div>
        ) : (
          /* Deposit History Table */
          <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-white font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Gateway</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Amount</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Status</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Date</th>
                    <th className="py-4 px-6 text-right">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all">
                      <td className="py-4 px-6 font-bold text-white border-r border-[#ff0044]/10">
                        {dep.payment_method}
                      </td>
                      <td className="py-4 px-6 font-righteous text-emerald-400 border-r border-[#ff0044]/10">
                        ${parseFloat(dep.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 border-r border-[#ff0044]/10">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            dep.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : dep.status === 'REJECTED'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 border-r border-[#ff0044]/10">
                        {new Date(dep.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-400">
                        {dep.transaction_hash ? (
                          <span className="text-slate-300 font-mono">{dep.transaction_hash.substring(0, 12)}...</span>
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px]">
                            {dep.status === 'PENDING' ? 'Awaiting Network Tx' : `Ref: TRX-${dep.id.substring(0, 8).toUpperCase()}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
