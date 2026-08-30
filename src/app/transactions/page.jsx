'use client';

import { useEffect, useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { ClipboardList, Loader2, Calendar } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import api from '../../lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live filter states
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/transactions');
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Live filtering logic
  const filteredTransactions = transactions.filter((tx) => {
    // 1. Type filter
    if (typeFilter !== 'All') {
      if (typeFilter === 'Plus (+)') {
        if (parseFloat(tx.amount || 0) < 0 || ['WITHDRAWAL', 'STAKE', 'ADMIN_DEBIT'].includes(tx.type)) {
          return false;
        }
      } else if (typeFilter === 'Minus (-)') {
        if (parseFloat(tx.amount || 0) > 0 || !['WITHDRAWAL', 'STAKE', 'ADMIN_DEBIT'].includes(tx.type)) {
          return false;
        }
      } else if (tx.type !== typeFilter) {
        return false;
      }
    }
    // 2. Date range filter
    if (startDate) {
      const txDate = new Date(tx.created_at);
      const start = new Date(startDate);
      if (txDate < start) return false;
    }
    if (endDate) {
      const txDate = new Date(tx.created_at);
      const end = new Date(endDate + 'T23:59:59');
      if (txDate > end) return false;
    }
    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
          Transactions History
        </h1>

        {/* Filter Controls Bar (Type Filter & Date Range Filter) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-5 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* TYPE Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-sans">
                Filter by Transaction Type
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full bg-[#060f22] border-[#182848] text-white rounded-xl h-11 text-xs focus:ring-1 focus:ring-[#ff0044]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b162c] border-[#1c2e54] text-white" searchPlaceholder="Search type...">
                  <SelectItem value="All" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">All Types</SelectItem>
                  <SelectItem value="Plus (+)" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2 font-bold text-emerald-400">Plus (+) Credits Only</SelectItem>
                  <SelectItem value="Minus (-)" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2 font-bold text-red-400">Minus (-) Debits Only</SelectItem>
                  <SelectItem value="SPIN_WIN" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">SPIN_WIN (Spin Wheel Reward)</SelectItem>
                  <SelectItem value="DAILY_CHECKIN" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">DAILY_CHECKIN (Daily Check-in)</SelectItem>
                  <SelectItem value="GIFT_BONUS" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">GIFT_BONUS (Gift Voucher)</SelectItem>
                  <SelectItem value="TASK_REWARD" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">TASK_REWARD (Task Reward)</SelectItem>
                  <SelectItem value="TREASURE_BOX" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">TREASURE_BOX (Treasure Reward)</SelectItem>
                  <SelectItem value="DEPOSIT" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">DEPOSIT (Deposit)</SelectItem>
                  <SelectItem value="WITHDRAWAL" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">WITHDRAWAL (Withdrawal)</SelectItem>
                  <SelectItem value="STAKE" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">STAKE (Staking Activation)</SelectItem>
                  <SelectItem value="STAKE_PROFIT" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">STAKE_PROFIT (Daily Profit)</SelectItem>
                  <SelectItem value="CAPITAL_RETURN" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">CAPITAL_RETURN (Capital Return)</SelectItem>
                  <SelectItem value="REFERRAL_COMMISSION" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">REFERRAL_COMMISSION (Referral Bonus)</SelectItem>
                  <SelectItem value="ADMIN_CREDIT" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">ADMIN_CREDIT (Admin Credit)</SelectItem>
                  <SelectItem value="ADMIN_DEBIT" className="focus:bg-[#142548] focus:text-white cursor-pointer text-xs py-2">ADMIN_DEBIT (Admin Debit)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FILTER BY DATE Range Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-sans">
                  Filter by Date Range
                </label>
                {(startDate || endDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="text-[10px] font-bold text-[#ff0044] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Clear Dates
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={(e) => {
                    const inp = e.currentTarget.querySelector('input');
                    if (inp && inp.showPicker) try { inp.showPicker(); } catch (err) {}
                  }}
                  className="flex items-center bg-[#060f22] border border-[#182848] rounded-xl h-11 px-3 focus-within:ring-1 focus-within:ring-[#ff0044] cursor-pointer hover:border-[#283d66] transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="bg-transparent border-0 outline-none text-[11px] text-white font-sans cursor-pointer w-full"
                    title="Start Date"
                  />
                </div>

                <div
                  onClick={(e) => {
                    const inp = e.currentTarget.querySelector('input');
                    if (inp && inp.showPicker) try { inp.showPicker(); } catch (err) {}
                  }}
                  className="flex items-center bg-[#060f22] border border-[#182848] rounded-xl h-11 px-3 focus-within:ring-1 focus-within:ring-[#ff0044] cursor-pointer hover:border-[#283d66] transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="bg-transparent border-0 outline-none text-[11px] text-white font-sans cursor-pointer w-full"
                    title="End Date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table Container / Empty State */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Loading transaction history</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#ff0044]" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          /* Empty State Card */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#08142c] border border-[#182848] flex items-center justify-center text-slate-400">
              <ClipboardList className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-sm font-bold text-slate-300 font-sans">
              No Transaction Found
            </p>
          </div>
        ) : (
          /* Transactions Table with 10-Item Pagination */
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#182848] bg-[#07132a] text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-3">Transaction ID</th>
                    <th className="py-4 px-3">Type</th>
                    <th className="py-4 px-3">Amount</th>
                    <th className="py-4 px-3">Post Balance</th>
                    <th className="py-4 px-3">Details</th>
                    <th className="py-4 px-3 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#142343]">
                  {paginatedTransactions.map((tx) => {
                    const isMinus = ['WITHDRAWAL', 'STAKE', 'ADMIN_DEBIT'].includes(tx.type);
                    const amountVal = parseFloat(tx.amount || 0);

                    return (
                      <tr key={tx.id} className="hover:bg-[#0e1d3e]/80 text-slate-200 transition-colors">
                        <td className="py-4 px-3 font-mono text-slate-300 font-bold">
                          {tx.id.length > 12 ? `${tx.id.substring(0, 10)}...` : tx.id}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border whitespace-nowrap inline-flex items-center justify-center ${
                              isMinus
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-3 font-righteous font-extrabold text-sm whitespace-nowrap ${
                            isMinus ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {isMinus ? '-' : '+'}${amountVal.toFixed(2)}
                        </td>
                        <td className="py-4 px-3 font-righteous text-white font-bold whitespace-nowrap">
                          ${parseFloat(tx.balance_after || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                          {tx.description || tx.remark || 'Transaction Completed'}
                        </td>
                        <td className="py-4 px-3 text-slate-400 text-right whitespace-nowrap font-mono text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 10-Item Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-[#07132a] border-t border-[#182848]">
                <div className="text-xs text-slate-400 font-mono">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
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
