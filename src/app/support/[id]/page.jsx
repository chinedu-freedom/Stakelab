'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { X, CornerUpLeft, Loader2, Trash2, Paperclip, Eye, Download, FileText, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function TicketDetailsPage({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? use(params) : (params || {});
  const { user } = useAuth();
  const ticketId = resolvedParams?.id;

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lightbox Modal state
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

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

  const [fileRows, setFileRows] = useState([]);

  const handleAddFileRow = () => {
    if (fileRows.length >= 5) {
      toast.error('Maximum 5 files allowed.');
      return;
    }
    setFileRows([...fileRows, { name: 'No file chosen', file: null, type: '', url: '' }]);
  };

  const handleRemoveFileRow = (index) => {
    setFileRows(fileRows.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const updated = [...fileRows];
      updated[index] = {
        name: file.name,
        file,
        type: file.type || 'application/octet-stream',
        url: dataUrl,
      };
      setFileRows(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectReplyTarget = (msg) => {
    setReplyTo({
      id: msg.id,
      sender_name: msg.sender_name,
      text: msg.message,
    });
    if (typeof window !== 'undefined') {
      const el = document.getElementById('reply-textarea');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      toast.success('Message deleted!');
      await api.delete(`/support/messages/${msgId}`);
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  const handleConfirmCloseTicket = async () => {
    try {
      const res = await api.post(`/support/tickets/${ticketId}/close`);
      if (res.data.success) {
        setTicket((prev) => (prev ? { ...prev, status: 'CLOSED' } : prev));
        setCloseModalOpen(false);
        setShowChatHistory(false);
        toast.success('Support ticket closed successfully!');
        fetchTicketDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close ticket');
    }
  };

  const handleConfirmReopenTicket = async () => {
    try {
      const res = await api.post(`/support/tickets/${ticketId}/reopen`);
      if (res.data.success) {
        setTicket((prev) => (prev ? { ...prev, status: 'OPEN' } : prev));
        setReopenModalOpen(false);
        setShowChatHistory(true);
        toast.success('Support ticket reopened successfully!');
        fetchTicketDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reopen ticket');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error('Please write a message before replying.');
      return;
    }

    const attachmentsPayload = fileRows
      .filter((r) => r.url)
      .map((r) => ({ name: r.name, type: r.type, url: r.url }));

    try {
      setSubmitting(true);
      const res = await api.post(`/support/tickets/${ticketId}/reply`, {
        message: replyMessage,
        attachments: attachmentsPayload,
        reply_to_id: replyTo?.id,
        reply_to_name: replyTo?.sender_name,
        reply_to_text: replyTo?.text,
      });

      if (res.data.success) {
        toast.success('Reply submitted successfully!');
        setReplyMessage('');
        setReplyTo(null);
        setFileRows([]);
        fetchTicketDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const isImageAttachment = (att) => {
    if (!att) return false;
    const type = att.type || '';
    const url = att.url || (typeof att === 'string' ? att : '');
    return (
      type.startsWith('image/') ||
      url.startsWith('data:image') ||
      /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
    );
  };

  const isClosed = ticket?.status === 'CLOSED';

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Single Unified Chat Card Container */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Status & Ticket Subject Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#182848]">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase whitespace-nowrap inline-flex items-center justify-center ${
                  ticket?.status === 'OPEN'
                    ? 'bg-emerald-500'
                    : ticket?.status === 'REPLIED'
                    ? 'bg-cyan-500'
                    : 'bg-red-500'
                }`}
              >
                {ticket?.status || 'OPEN'}
              </span>
              <span className="text-xs font-bold text-slate-300 font-mono bg-[#07132c] px-2.5 py-1 rounded border border-[#182848]">
                Ticket {ticket?.ticket_id || `#${ticketId}`}
              </span>
              <h2 className="text-base font-bold text-white font-righteous">
                <span className="text-slate-400 font-sans text-xs font-semibold mr-1">Subject:</span>
                {ticket?.subject || 'Support Ticket'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {isClosed ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="bg-[#142345] hover:bg-[#1e3466] text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs border border-[#1e325c] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{showChatHistory ? 'Hide Chat' : 'View Chat'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReopenModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reopen Ticket
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setCloseModalOpen(true)}
                  className="bg-[#ff0044] hover:bg-[#e0003c] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" /> Close Ticket
                </button>
              )}
            </div>
          </div>

          {/* Compact Closed Summary Card (Shown when Closed and Chat History Hidden) */}
          {isClosed && !showChatHistory && (
            <div className="bg-[#060f22] border border-[#182848] rounded-xl p-6 text-center space-y-4 shadow-inner">
              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                This support ticket was closed. You can view past messages or reopen the ticket below to continue.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowChatHistory(true)}
                  className="bg-[#142345] hover:bg-[#1e3466] text-white text-xs font-semibold px-5 py-2 rounded-lg border border-[#1e325c] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-cyan-300" /> View Chat History
                </button>
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" /> Reopen Ticket
                </button>
              </div>
            </div>
          )}

          {/* Integrated Chat Stream Box (Visible if Open OR if View Chat is Toggled) */}
          {(!isClosed || showChatHistory) && (
            <div className="bg-[#060f22] border border-[#182848] rounded-2xl p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
              {messages.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No messages in this ticket thread yet.</div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.sender_type === 'USER';
                  const formattedDate = msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                      ' · ' +
                      new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    : '';

                  let parsedAttachments = [];
                  if (msg.attachments) {
                    try {
                      parsedAttachments = typeof msg.attachments === 'string' ? JSON.parse(msg.attachments) : msg.attachments;
                    } catch (e) {
                      console.error('Failed to parse message attachments:', e);
                    }
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      {/* Sender Label & Action */}
                      <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-200 font-sans">{msg.sender_name}</span>
                      {!isUser && (
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded uppercase font-sans">
                          Support
                        </span>
                      )}
                      <span>· {formattedDate}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectReplyTarget(msg)}
                        className="text-red-400 hover:text-white font-bold ml-1 flex items-center gap-0.5 transition-colors cursor-pointer"
                        title="Reply to this message"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                        <span className="text-[10px]">Reply</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-slate-400 hover:text-red-400 font-bold ml-1 flex items-center gap-0.5 transition-colors cursor-pointer p-0.5"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`relative rounded-2xl p-4 text-xs font-sans leading-relaxed max-w-[85%] sm:max-w-[75%] shadow-md transition-all ${
                        replyTo?.id === msg.id ? 'ring-2 ring-[#ff0044]' : ''
                      } ${
                        isUser
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none'
                          : 'bg-[#0e1d3e] border border-[#1d3363] text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {/* Quoted Parent Reply (if replying to an earlier message) */}
                      {msg.reply_to_name && (
                        <div
                          className={`mb-2.5 p-2.5 rounded-xl border-l-4 text-[11px] space-y-0.5 ${
                            isUser
                              ? 'bg-black/20 border-white/60 text-slate-100'
                              : 'bg-[#07132c] border-[#ff0044] text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-[10px] uppercase tracking-wider opacity-90">
                            ↵ Replying to {msg.reply_to_name}
                          </div>
                          <div className="italic truncate text-[10.5px]">
                            "{msg.reply_to_text}"
                          </div>
                        </div>
                      )}

                      <div className="whitespace-pre-line font-sans">{msg.message}</div>

                      {/* Render Attachments inside message bubble */}
                      {parsedAttachments && parsedAttachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                          {parsedAttachments.map((att, attIdx) => {
                            const isImg = isImageAttachment(att);
                            const attUrl = typeof att === 'string' ? att : att.url;
                            const attName = typeof att === 'string' ? `Attachment #${attIdx + 1}` : (att.name || `Attachment #${attIdx + 1}`);

                            if (isImg) {
                              return (
                                <div
                                  key={attIdx}
                                  onClick={() => setActiveAttachment({ url: attUrl, name: attName, isImg: true })}
                                  className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-white/30 cursor-pointer bg-black/40 hover:opacity-90 transition-all shrink-0"
                                >
                                  <img
                                    src={attUrl}
                                    alt={attName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <Eye className="w-5 h-5 drop-shadow" />
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={attIdx}
                                type="button"
                                onClick={() => setActiveAttachment({ url: attUrl, name: attName, isImg: false })}
                                className="flex items-center gap-2 bg-black/30 hover:bg-black/50 border border-white/30 px-3 py-2 rounded-lg text-xs transition-all text-white max-w-full cursor-pointer"
                              >
                                <Paperclip className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate max-w-[140px] font-mono text-[11px]">{attName}</span>
                                <Eye className="w-3.5 h-3.5 shrink-0 text-cyan-300 ml-1" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Reply Form (Inside the Same Card) */}
          <form onSubmit={handleReplySubmit} className="space-y-4 pt-2 border-t border-[#182848]">
            {/* Active Replying Target Banner */}
            {replyTo && (
              <div className="bg-[#0f2146] border-l-4 border-[#ff0044] p-3 rounded-lg flex items-center justify-between text-xs text-slate-200 shadow-md">
                <div>
                  <span className="font-bold text-red-400 text-[11px] uppercase tracking-wider block">
                    ↵ Replying to {replyTo.sender_name}
                  </span>
                  <span className="text-slate-300 italic line-clamp-1">
                    "{replyTo.text}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-slate-400 hover:text-white p-1 rounded font-bold transition-all"
                  title="Cancel reply"
                >
                  ✕
                </button>
              </div>
            )}

            <textarea
              id="reply-textarea"
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={replyTo ? `Write reply to ${replyTo.sender_name}...` : "Write your reply..."}
              className="w-full bg-[#060f22] border border-[#ff0044] rounded-xl p-4 text-white text-xs font-sans placeholder-slate-500 focus:outline-none shadow-inner"
            />

            {/* File Upload Info Notice Bar */}
            <div>
              <p className="text-cyan-400 text-[11px] font-medium leading-relaxed">
                Max 5 files can be uploaded | Maximum upload size is 256MB | Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
              </p>
            </div>

            {/* File Attachment Rows with Live Thumbnail Previews */}
            {fileRows.length > 0 && (
              <div className="space-y-3">
                {fileRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-3 max-w-md">
                    {/* Live Thumbnail Preview if Image */}
                    {row.url && row.type?.startsWith('image/') && (
                      <img
                        src={row.url}
                        alt="Preview"
                        className="w-9 h-9 object-cover rounded border border-[#182848] shrink-0"
                      />
                    )}

                    <div className="flex items-center border border-[#182848] rounded-lg overflow-hidden bg-[#060f22] w-full shadow-sm">
                      <label className="bg-[#ff0044] hover:bg-[#e0003c] text-white text-xs font-bold px-4 py-2 cursor-pointer shrink-0 transition-all">
                        Choose file
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(idx, e)}
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          className="hidden"
                        />
                      </label>
                      <span className="px-3 text-xs text-slate-300 truncate flex-1">
                        {row.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFileRow(idx)}
                      className="bg-[#ff0044] hover:bg-[#e0003c] text-white text-xs font-bold p-2.5 rounded-lg cursor-pointer shrink-0 transition-all"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons Row (+ Add Attachment & Submit Reply) */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-1">
              <button
                type="button"
                onClick={handleAddFileRow}
                className="w-full sm:w-auto justify-center bg-[#142345] hover:bg-[#1a2c54] text-white text-xs font-semibold px-4 py-2.5 rounded-md border border-[#1e325c] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+ Add Attachment</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto justify-center btn-stakelab px-8 py-2.5 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
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

        {/* Attachment Lightbox Modal */}
        {activeAttachment && (
          <div
            onClick={() => setActiveAttachment(null)}
            className="fixed inset-0 min-h-screen w-full bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a1835] border border-[#182848] rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="flex justify-between items-center pb-3 border-b border-[#182848]">
                <div className="flex items-center gap-2 text-white font-righteous text-sm">
                  <Paperclip className="w-4 h-4 text-[#ff0044]" />
                  <span className="truncate max-w-md">{activeAttachment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeAttachment.url}
                    download={activeAttachment.name}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#142345] hover:bg-[#1e3466] text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-[#1e325c] flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Open / Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveAttachment(null)}
                    className="text-slate-400 hover:text-white p-1 rounded font-bold transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Viewer Body */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-2 min-h-[300px]">
                {activeAttachment.isImg ? (
                  <img
                    src={activeAttachment.url}
                    alt={activeAttachment.name}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#182848]"
                  />
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <FileText className="w-16 h-16 text-[#ff0044] mx-auto animate-pulse" />
                    <p className="text-sm font-semibold text-slate-200">{activeAttachment.name}</p>
                    <a
                      href={activeAttachment.url}
                      download={activeAttachment.name}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 btn-stakelab px-6 py-2.5 rounded-lg text-white font-righteous text-xs uppercase"
                    >
                      <Download className="w-4 h-4" /> Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        {/* Close Support Ticket Confirmation Modal */}
        {closeModalOpen && (
          <div
            onClick={() => setCloseModalOpen(false)}
            className="fixed inset-0 min-h-screen w-full bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a1835] border border-[#182848] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative my-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#182848]">
                <h3 className="text-sm font-bold text-white font-righteous">
                  Close Support Ticket!
                </h3>
                <button
                  onClick={() => setCloseModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Are you sure you want to close this support ticket?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCloseModalOpen(false)}
                  className="bg-[#142345] hover:bg-[#1e3466] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all border border-[#1e325c] cursor-pointer"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCloseTicket}
                  className="bg-[#ff0044] hover:bg-[#e0003c] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-md"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        {/* Reopen Support Ticket Confirmation Modal */}
        {reopenModalOpen && (
          <div
            onClick={() => setReopenModalOpen(false)}
            className="fixed inset-0 min-h-screen w-full bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a1835] border border-[#182848] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative my-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#182848]">
                <h3 className="text-sm font-bold text-white font-righteous">
                  Reopen Support Ticket!
                </h3>
                <button
                  onClick={() => setReopenModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Are you sure you want to reopen this support ticket?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="bg-[#142345] hover:bg-[#1e3466] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all border border-[#1e325c] cursor-pointer"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={handleConfirmReopenTicket}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-md"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
