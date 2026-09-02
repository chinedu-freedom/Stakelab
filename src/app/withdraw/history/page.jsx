'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { ClipboardList, ArrowUpRight, Loader2 } from 'lucide-react';

export default function WithdrawHistoryPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get('/user/withdrawals');
      } catch (e) {
        res = await api.get('/withdrawals');
      }
      if (res?.data?.success) {
        setWithdrawals(res.data.withdrawals || []);
      }
    } catch (err) {
      console.error('Failed to load withdrawal history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage) || 1;
  const paginatedWithdrawals = withdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Withdrawal Log
          </h1>

          <Link
            href="/withdraw"
            className="btn-stakelab px-4 sm:px-5 py-2 rounded-lg text-xs font-bold font-righteous uppercase transition-all shadow-md shadow-red-500/20 flex items-center gap-2 shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw Now
          </Link>
        </div>

        {/* Withdrawal Table Container or Empty State (Matching Reference Screenshot) */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Loading withdrawal log</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#ff0044]" />
          </div>
        ) : withdrawals.length === 0 ? (
          /* Empty State Card */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              No Withdraw Found
            </p>
          </div>
        ) : (
          /* Withdrawal History Table */
          <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-white font-bold uppercase tracking-wider">
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Gateway</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Amount</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Status</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Date</th>
                    <th className="py-4 px-4 text-right">Wallet Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {paginatedWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all">
                      <td className="py-4 px-4 font-bold text-white border-r border-[#ff0044]/10">
                        {w.withdrawal_method}
                      </td>
                      <td className="py-4 px-4 font-righteous text-red-400 border-r border-[#ff0044]/10 whitespace-nowrap">
                        ${parseFloat(w.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 border-r border-[#ff0044]/10">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap inline-flex items-center justify-center ${
                            w.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : w.status === 'REJECTED'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 border-r border-[#ff0044]/10 font-mono text-[11px] whitespace-nowrap">
                        {new Date(w.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-[11px] text-slate-300">
                        {w.wallet_address ? (
                          <span className="truncate max-w-xs block ml-auto">{w.wallet_address}</span>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, withdrawals.length)} of {withdrawals.length}
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
