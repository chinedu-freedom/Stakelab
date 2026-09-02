'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { ClipboardList, ArrowDownLeft, Loader2 } from 'lucide-react';

export default function DepositHistoryPage() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get('/user/deposits');
      } catch (e) {
        res = await api.get('/deposits');
      }
      if (res?.data?.success) {
        setDeposits(res.data.deposits || []);
      }
    } catch (err) {
      console.error('Failed to fetch deposit history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(deposits.length / itemsPerPage) || 1;
  const paginatedDeposits = deposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        {/* Top Header Pill Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a1835] border border-[#182848] rounded-2xl p-6 shadow-2xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-wide flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#ff0044]" /> Deposit History Log
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Real-time audit log of all your completed and pending deposit requests.
            </p>
          </div>

          <Link
            href="/deposit"
            className="bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-1.5"
          >
            + Deposit Funds
          </Link>
        </div>

        {/* Deposit Table Container or Empty State */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Loading deposit history</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#ff0044]" />
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
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Gateway</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Amount</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Status</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Date</th>
                    <th className="py-4 px-4 text-right">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {paginatedDeposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all">
                      <td className="py-4 px-4 font-bold text-white border-r border-[#ff0044]/10">
                        {dep.payment_method}
                      </td>
                      <td className="py-4 px-4 font-righteous text-emerald-400 border-r border-[#ff0044]/10 whitespace-nowrap">
                        ${parseFloat(dep.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 border-r border-[#ff0044]/10">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap inline-flex items-center justify-center ${
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
                      <td className="py-4 px-4 text-slate-400 border-r border-[#ff0044]/10 font-mono text-[11px] whitespace-nowrap">
                        {new Date(dep.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-[11px] text-slate-300">
                        {dep.tx_hash ? (
                          <span className="truncate max-w-xs block ml-auto">{dep.tx_hash}</span>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 10-Item Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-[#07132a] border-t border-[#182848]">
                <div className="text-xs text-slate-400 font-mono">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, deposits.length)} of {deposits.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1d3e] border border-[#182848] text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#152a57] transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-300 font-bold font-mono px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1d3e] border border-[#182848] text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#152a57] transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
