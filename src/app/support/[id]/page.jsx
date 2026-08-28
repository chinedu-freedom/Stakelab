'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { X, CornerUpLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TicketDetailsPage({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? use(params) : (params || {});
  const { user } = useAuth();
  const ticketId = resolvedParams?.id;

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTicketDetails = async () => {
    if (!ticketId) return;
    try {
      setLoading(true);
      const res = await api.get(`/support/tickets/${ticketId}`);
      if (res.data.success) {
        setTicket(res.data.ticket);
        setMessages(res.data.ticket.messages || []);
      }
    } catch (err) {
      console.error('Fetch ticket error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error('Please write a message before replying.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/support/tickets/${ticketId}/reply`, {
        message: replyMessage,
      });

      if (res.data.success) {
        toast.success('Reply submitted successfully!');
        setReplyMessage('');
        fetchTicketDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTicket = () => {
    toast.info(`Ticket #${ticketId} has been closed.`);
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Reply Box Card Container (Matching Exact Reference Screenshot 2) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Status & Ticket Subject Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#182848]">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                  (ticket?.status || 'OPEN') === 'OPEN'
                    ? 'bg-emerald-500'
                    : (ticket?.status || '').toUpperCase() === 'REPLIED'
                    ? 'bg-indigo-500'
                    : 'bg-red-500'
                }`}
              >
                {ticket?.status || 'OPEN'}
              </span>
              <h2 className="text-base font-bold text-white font-righteous">
                [{ticket?.ticket_id || `#${ticketId}`}] {ticket?.subject || 'Support Ticket'}
              </h2>
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <textarea
              rows={5}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-[#060f22] border border-[#ff0044] rounded-xl p-4 text-white text-xs font-sans placeholder-slate-500 focus:outline-none shadow-inner"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-stakelab px-8 py-2.5 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    Submitting Reply <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  <>
                    <CornerUpLeft className="w-3.5 h-3.5" /> Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Conversation Thread Messages List */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No messages in this ticket thread yet.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="border border-[#182848] rounded-xl p-5 bg-[#060f22] flex flex-col md:flex-row items-start md:items-stretch gap-5"
              >
                {/* Left Side: Sender Name */}
                <div className="md:w-52 shrink-0 font-bold text-white font-righteous text-sm flex items-center justify-between">
                  <span>{msg.sender_name}</span>
                  {msg.sender_type === 'ADMIN' && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-sans uppercase">
                      Admin
                    </span>
                  )}
                </div>

                {/* Vertical Line Divider */}
                <div className="hidden md:block w-px bg-[#182848] self-stretch" />

                {/* Right Side: Timestamp & Message Content */}
                <div className="flex-1 space-y-2">
                  <div className="text-slate-400 text-xs font-medium">
                    Posted on {new Date(msg.created_at || Date.now()).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} @ {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-slate-200 text-xs leading-relaxed font-sans whitespace-pre-line">
                    {msg.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
