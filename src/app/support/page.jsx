'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Monitor, ClipboardList, Plus, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SupportTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/1234567890', '_blank');
    toast.success('Opening WhatsApp Direct Support...');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('stakelab_tickets') || '[]');
      if (stored.length === 0) {
        const defaultTicket = {
          id: '847725',
          subject: 'Hi',
          message: 'Are you there',
          status: 'Customer Reply',
          priority: 'High',
          lastReply: '6 seconds ago',
          created_at: new Date().toISOString(),
        };
        setTickets([defaultTicket]);
      } else {
        setTickets(stored);
      }
    }
  }, []);

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Support Tickets
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" /> WhatsApp Support
            </button>

            <Link
              href="/support/create"
              className="btn-stakelab px-5 py-2.5 rounded-lg text-xs font-bold font-righteous uppercase transition-all shadow-md shadow-red-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Open Ticket
            </Link>
          </div>
        </div>

        {/* Support Tickets Table Container (Matching Exact Reference Screenshot) */}
        {tickets.length === 0 ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center shadow-2xl flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300 font-sans">
              No Support Tickets Found
            </p>
          </div>
        ) : (
          <div className="bg-[#0b162c] border border-[#ff0044]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ff0044]/30 bg-[#07132a] text-xs font-bold text-white tracking-wider">
                    <th className="py-4 px-6 border-r border-[#ff0044]/20">Subject</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20 text-center">Status</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20 text-center">Priority</th>
                    <th className="py-4 px-6 border-r border-[#ff0044]/20 text-center">Last Reply</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#0e1d3e]/60 text-slate-200 transition-all text-xs">
                      {/* Subject Column */}
                      <td className="py-4 px-6 font-bold text-[#ff0044] font-righteous border-r border-[#ff0044]/10">
                        <Link href={`/support/${t.id}?subject=${encodeURIComponent(t.subject)}&message=${encodeURIComponent(t.message || '')}`} className="hover:underline">
                          [Ticket#{t.id}] {t.subject}
                        </Link>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 border-r border-[#ff0044]/10 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold text-white inline-block shadow-md ${
                            t.status === 'Customer Reply'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : t.status === 'Open'
                              ? 'bg-emerald-500'
                              : t.status === 'Answered'
                              ? 'bg-cyan-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {t.status || 'Customer Reply'}
                        </span>
                      </td>

                      {/* Priority Column */}
                      <td className="py-4 px-6 border-r border-[#ff0044]/10 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold text-white inline-block shadow-md ${
                            t.priority === 'High'
                              ? 'bg-gradient-to-r from-[#ff0044] to-[#e0003c]'
                              : t.priority === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-slate-600'
                          }`}
                        >
                          {t.priority || 'High'}
                        </span>
                      </td>

                      {/* Last Reply Column */}
                      <td className="py-4 px-6 border-r border-[#ff0044]/10 text-center font-medium text-slate-300">
                        {t.lastReply || '6 seconds ago'}
                      </td>

                      {/* Action Column (Monitor Icon Button) */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/support/${t.id}?subject=${encodeURIComponent(t.subject)}&message=${encodeURIComponent(t.message || '')}`}
                          className="w-8 h-8 rounded bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white inline-flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-red-500/20"
                          title="View Ticket"
                        >
                          <Monitor className="w-4 h-4 text-white" />
                        </Link>
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
