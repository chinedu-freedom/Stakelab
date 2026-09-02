'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Monitor, ClipboardList, Plus, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SupportTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);
  }, []);

  const handleOpenWhatsApp = () => {
    window.open(whatsappLink, '_blank');
    toast.success('Opening WhatsApp Direct Support...');
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/support/tickets');
      if (res.data.success && res.data.tickets) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Fetch support tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const totalPages = Math.ceil(tickets.length / itemsPerPage) || 1;
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide whitespace-nowrap">
            Support Tickets
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" /> WhatsApp Support
            </button>

            <Link
              href="/support/create"
              className="btn-stakelab px-4 py-2 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-1.5"
            >
              + Create Ticket
            </Link>
          </div>
        </div>

        {/* Support Tickets Table / Empty State */}
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
                    <th className="py-4 px-4 border-r border-[#ff0044]/20">Subject</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20 text-center">Status</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20 text-center">Priority</th>
                    <th className="py-4 px-4 border-r border-[#ff0044]/20 text-center">Last Reply</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16274a]">
                  {paginatedTickets.map((t) => {
                    const ticketCode = t.ticket_id || `#${t.id.substring(0, 8)}`;
                    const lastReplyDate = t.messages && t.messages.length > 0 && t.messages[0].created_at
                      ? new Date(t.messages[0].created_at).toLocaleString()
                      : t.updated_at
                      ? new Date(t.updated_at).toLocaleString()
                      : t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : 'Recently';

                    return (
                      <tr key={t.id} className="hover:bg-[#0c1a38]/50 text-slate-200">
                        {/* Subject Column */}
                        <td className="py-4 px-4 font-bold text-[#ff0044] font-righteous border-r border-[#ff0044]/10">
                          <Link href={`/support/${t.id}`} className="hover:underline">
                            [{ticketCode}] {t.subject}
                          </Link>
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-4 border-r border-[#ff0044]/10 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold text-white whitespace-nowrap inline-flex items-center justify-center shadow-md ${
                              t.status === 'OPEN'
                                ? 'bg-emerald-500'
                                : t.status === 'REPLIED'
                                ? 'bg-cyan-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {t.status || 'OPEN'}
                          </span>
                        </td>

                        {/* Priority Column */}
                        <td className="py-4 px-4 border-r border-[#ff0044]/10 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold text-white whitespace-nowrap inline-flex items-center justify-center shadow-md ${
                              t.priority === 'High'
                                ? 'bg-gradient-to-r from-[#ff0044] to-[#e0003c]'
                                : t.priority === 'Medium'
                                ? 'bg-amber-500'
                                : 'bg-slate-600'
                            }`}
                          >
                            {t.priority || 'Medium'}
                          </span>
                        </td>

                        {/* Last Reply Column */}
                        <td className="py-4 px-4 border-r border-[#ff0044]/10 text-center font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {lastReplyDate}
                        </td>

                        {/* Action Column */}
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/support/${t.id}`}
                            className="w-8 h-8 rounded bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white inline-flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-red-500/20"
                            title="View Ticket"
                          >
                            <Monitor className="w-4 h-4 text-white" />
                          </Link>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, tickets.length)} of {tickets.length}
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
