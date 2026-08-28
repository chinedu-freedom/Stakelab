'use client';

import { useEffect, useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live filter states
  const [trxNumber, setTrxNumber] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currencyFilter, setCurrencyFilter] = useState('All');
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
    // 1. Transaction Number filter
    if (trxNumber.trim() && !tx.id?.toLowerCase().includes(trxNumber.toLowerCase().trim())) {
      return false;
    }
    // 2. Type filter
    if (typeFilter !== 'All') {
      if (typeFilter === 'Plus (+)' && !['DEPOSIT', 'STAKE_PROFIT', 'CAPITAL_RETURN', 'REFERRAL_COMMISSION'].includes(tx.type)) {
        return false;
      }
      if (typeFilter === 'Minus (-)' && !['WITHDRAWAL', 'STAKE'].includes(tx.type)) {
        return false;
      }
      if (typeFilter !== 'Plus (+)' && typeFilter !== 'Minus (-)' && tx.type !== typeFilter) {
        return false;
      }
    }
    // 3. Currency filter
    if (currencyFilter !== 'All' && tx.currency && tx.currency.toLowerCase() !== currencyFilter.toLowerCase()) {
      return false;
    }
    // 4. Date range filter
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

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
          Transactions
        </h1>

        {/* Filter Controls Row (Transaction Number, Type, Currency, Date Pickers) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#07132a] border border-[#142343] p-4 sm:p-5 rounded-xl shadow-lg">
          {/* Control 1: Transaction Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Transaction Number
            </label>
            <input
              type="text"
              value={trxNumber}
              onChange={(e) => setTrxNumber(e.target.value)}
              placeholder="Search by Transaction ID..."
              className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-lg px-4 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
            />
          </div>

          {/* Control 2: Type Select Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Type
            </label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-11 bg-[#060f22] border-[#182848] rounded-lg">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Plus (+)">Plus (+)</SelectItem>
                <SelectItem value="Minus (-)">Minus (-)</SelectItem>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                <SelectItem value="STAKE">Staking</SelectItem>
                <SelectItem value="STAKE_PROFIT">Profit Claim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Control 3: Currency Select Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Currency
            </label>
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="h-11 bg-[#060f22] border-[#182848] rounded-lg">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="TRX">TRX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Control 4: Interactive Date Range Pickers */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Filter by Date
            </label>
            <div className="flex items-center gap-1.5 h-11 bg-[#060f22] border border-[#182848] rounded-lg px-3 focus-within:border-[#ff0044] transition-all">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => {
                  try {
                    if (e.target.showPicker) e.target.showPicker();
                  } catch (err) {}
                }}
                style={{ colorScheme: 'dark' }}
                className="bg-transparent border-0 outline-none text-xs text-white font-sans cursor-pointer w-full"
                title="Start Date"
              />
              <span className="text-slate-500 font-bold text-xs">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => {
                  try {
                    if (e.target.showPicker) e.target.showPicker();
                  } catch (err) {}
                }}
                style={{ colorScheme: 'dark' }}
                className="bg-transparent border-0 outline-none text-xs text-white font-sans cursor-pointer w-full"
                title="End Date"
              />
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
          /* Empty State Card Matching Reference Screenshot */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#08142c] border border-[#182848] flex items-center justify-center text-slate-400">
              <ClipboardList className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-sm font-bold text-slate-300 font-sans">
              No Transaction Found
            </p>
          </div>
        ) : (
          /* Transactions Table (Matching Reference Screenshot) */
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#182848] bg-[#07132a] text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Transaction ID</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Post Balance</th>
                    <th className="py-4 px-5">Details</th>
                    <th className="py-4 px-5 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#142343]">
                  {filteredTransactions.map((tx) => {
                    const isMinus = ['WITHDRAWAL', 'STAKE', 'SPIN_FEE'].includes(tx.type);
                    const amountVal = parseFloat(tx.amount || 0);

                    return (
                      <tr key={tx.id} className="hover:bg-[#0e1d3e]/80 text-slate-200 transition-colors">
                        <td className="py-4 px-5 font-mono text-slate-300 font-bold">
                          {tx.id.length > 12 ? `${tx.id.substring(0, 10)}...` : tx.id}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border ${
                              isMinus
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-5 font-righteous font-extrabold text-sm ${
                            isMinus ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {isMinus ? '-' : '+'}${amountVal.toFixed(2)}
                        </td>
                        <td className="py-4 px-5 font-righteous text-white font-bold">
                          ${parseFloat(tx.balance_after || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-5 text-slate-300 text-[11px] max-w-xs truncate">
                          {tx.description || tx.remark || 'Transaction Completed'}
                        </td>
                        <td className="py-4 px-5 text-slate-400 text-right whitespace-nowrap text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
