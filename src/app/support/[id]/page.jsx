'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import { X, CornerUpLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function TicketDetailsPage({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const ticketId = resolvedParams?.id || '847725';
  const querySubject = searchParams.get('subject') || 'Hi';
  const queryMessage = searchParams.get('message') || 'Are you there';

  const [status, setStatus] = useState('Open');
  const [replyMessage, setReplyMessage] = useState('');
  const [fileRows, setFileRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: user?.full_name || 'Chinedu Afamefuna',
      message: queryMessage,
      date: 'Posted on Friday, 21st August 2026 @ 11:22 am',
    },
  ]);

  const handleAddFileRow = () => {
    if (fileRows.length >= 5) {
      toast.error('Maximum 5 files can be uploaded');
      return;
    }
    setFileRows([...fileRows, { file: null, name: 'No file chosen' }]);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const newRows = [...fileRows];
      newRows[index] = { file, name: file.name };
      setFileRows(newRows);
    }
  };

  const handleRemoveFileRow = (index) => {
    setFileRows(fileRows.filter((_, idx) => idx !== index));
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error('Please write a message before replying.');
      return;
    }

    setSubmitting(true);

    const newMsg = {
      id: (messages.length + 1).toString(),
      sender: user?.full_name || 'Chinedu Afamefuna',
      message: replyMessage,
      date: `Posted on ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setMessages([...messages, newMsg]);
    setReplyMessage('');
    setFileRows([]);
    toast.success('Reply submitted successfully!');
    setSubmitting(false);
  };

  const handleCloseTicket = () => {
    setStatus('Closed');
    toast.info(`Ticket #${ticketId} has been closed.`);
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Reply Box Card Container (Matching Exact Reference Screenshot 2) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Header Bar: Status Badge + Ticket ID & Subject + Red Close Button */}
          <div className="flex justify-between items-center pb-3 border-b border-[#182848]">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                  status === 'Open' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              >
                {status}
              </span>
              <h2 className="text-base font-bold text-white font-righteous">
                [Ticket#{ticketId}] {querySubject}
              </h2>
            </div>

            {/* Red Square Close Button */}
            <button
              type="button"
              onClick={handleCloseTicket}
              className="bg-[#ff0044] hover:bg-[#e0003c] text-white p-2 rounded-md transition-all cursor-pointer shadow-md shadow-red-500/20"
              title="Close Ticket"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleReplySubmit} className="space-y-4">
            {/* Red Highlighted Textarea Input */}
            <textarea
              rows={5}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-[#060f22] border border-[#ff0044] rounded-xl p-4 text-white text-xs font-sans placeholder-slate-500 focus:outline-none shadow-inner"
            />

            {/* Buttons Row: Add Attachment & Reply Submit */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button
                type="button"
                onClick={handleAddFileRow}
                className="bg-[#142345] hover:bg-[#1a2c54] text-white text-xs font-semibold px-4 py-2.5 rounded-md border border-[#1e325c] transition-all cursor-pointer"
              >
                + Add Attachment
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-stakelab px-8 py-2.5 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <CornerUpLeft className="w-3.5 h-3.5" /> Reply
              </button>
            </div>

            {/* Cyan File Info Notice Bar */}
            <div className="pt-1">
              <p className="text-cyan-400 text-xs font-medium leading-relaxed">
                Max 5 files can be uploaded | Maximum upload size is 256MB | Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
              </p>
            </div>

            {/* Dynamic File Attachment Chooser Rows */}
            {fileRows.length > 0 && (
              <div className="space-y-3 pt-2">
                {fileRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-0 max-w-md">
                    <label className="bg-[#ff0044] hover:bg-[#e0003c] text-white text-xs font-bold px-4 py-2 rounded-l-md cursor-pointer shrink-0 transition-all">
                      Choose file
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(idx, e)}
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="hidden"
                      />
                    </label>
                    <div className="bg-[#060f22] border-y border-[#182848] text-slate-300 text-xs px-4 py-2 flex-1 truncate">
                      {row.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFileRow(idx)}
                      className="bg-[#ff0044] hover:bg-[#e0003c] text-white text-xs font-bold px-3.5 py-2 rounded-r-md cursor-pointer shrink-0 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Bottom Conversation Thread Messages List (Matching Exact Reference Screenshot 2) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border border-[#182848] rounded-xl p-5 bg-[#060f22] flex flex-col md:flex-row items-start md:items-stretch gap-5"
            >
              {/* Left Side: Sender Name */}
              <div className="md:w-52 shrink-0 font-bold text-white font-righteous text-sm flex items-center">
                {msg.sender}
              </div>

              {/* Vertical Line Divider */}
              <div className="hidden md:block w-px bg-[#182848] self-stretch" />

              {/* Right Side: Timestamp & Message Content */}
              <div className="flex-1 space-y-2">
                <div className="text-slate-400 text-xs font-medium">
                  {msg.date}
                </div>
                <div className="text-slate-200 text-xs leading-relaxed font-sans">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
