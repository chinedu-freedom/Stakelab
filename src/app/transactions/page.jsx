'use client';

import { useEffect, useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { ClipboardList } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live filter states
  const [trxNumber, setTrxNumber] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currencyFilter, setCurrencyFilter] = useState('All');

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
    return true;
  });

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Title */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Transactions
        </h1>

        {/* Filter Controls Row (Transaction Number, Type, Currency - Live Filtering, NO Remark, NO Filter Button) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-[#07132a] border border-[#142343] p-4 sm:p-5 rounded-xl shadow-lg">
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
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table Container / Empty State */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400">
            Loading transaction history...
          </div>
        ) : filteredTransactions.length === 0 ? (
          /* Empty State Card Matching Reference Screenshot */
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              No Transaction Found
            </p>
          </div>
        ) : (
          /* Transactions Table */
          <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-white font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Transaction ID</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Type</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Amount</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Balance After</th>
                    <th className="py-4 px-6 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all">
                      <td className="py-4 px-6 font-mono text-slate-300 border-r border-[#ff0044]/10">
                        {tx.id.substring(0, 8)}...
                      </td>
                      <td className="py-4 px-6 font-bold text-white border-r border-[#ff0044]/10">
                        {tx.type}
                      </td>
                      <td className="py-4 px-6 font-righteous text-emerald-400 border-r border-[#ff0044]/10">
                        ${parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 font-righteous text-white border-r border-[#ff0044]/10">
                        ${parseFloat(tx.balance_after).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-right">
                        {new Date(tx.created_at).toLocaleString()}
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
