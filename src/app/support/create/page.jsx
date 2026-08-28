'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import { X, MessageCircle, Loader2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { toast } from 'sonner';

export default function CreateTicketPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('High');
  const [message, setMessage] = useState('');
  const [fileRows, setFileRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // WhatsApp Support Modal State
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');

  useEffect(() => {
    // Show WhatsApp support modal automatically when user lands on create ticket page
    setWhatsappModalOpen(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Subject and message are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/support/create', {
        subject,
        priority,
        message,
      });

      if (res.data.success) {
        toast.success('Ticket opened successfully!');
        const ticketIdClean = res.data.ticket.ticket_id.replace('#', '');
        setTimeout(() => {
          router.push(`/support/${ticketIdClean}`);
        }, 500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Page Title & WhatsApp Direct Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Open Ticket
          </h1>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" /> WhatsApp Direct Message
          </button>
        </div>

        {/* Open Ticket Form Card Container */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Subject & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject <span className="text-[#ff0044]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter ticket subject"
                  className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-lg px-4 text-white text-xs font-sans placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Priority <span className="text-[#ff0044]">*</span>
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="h-11 bg-[#060f22] border-[#182848] rounded-lg">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Message Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Message <span className="text-[#ff0044]">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your support message here..."
                className="w-full bg-[#060f22] border border-[#182848] rounded-lg p-4 text-white text-xs font-sans placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
              />
            </div>

            {/* Row 3: Buttons Row (+ Add Attachment / Submit) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleAddFileRow}
                className="bg-[#142345] hover:bg-[#1a2c54] text-white text-xs font-semibold px-4 py-2.5 rounded-md border border-[#1e325c] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+ Add Attachment</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-stakelab px-8 py-2.5 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    Submitting <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  '▶ Submit'
                )}
              </button>
            </div>

            {/* File Upload Info Notice Bar */}
            <div className="pt-1">
              <p className="text-cyan-400 text-xs font-medium leading-relaxed">
                Max 5 files can be uploaded | Maximum upload size is 256MB | Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
              </p>
            </div>

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
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* WhatsApp Direct Support Modal Popup (Full Screen & Click Outside to Close) */}
        {whatsappModalOpen && (
          <div
            onClick={() => setWhatsappModalOpen(false)}
            className="fixed inset-0 min-h-screen w-full bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c1a3a] border border-[#233b6e] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-center my-auto"
            >
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center mx-auto text-[#25D366]">
                <MessageCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white font-righteous">
                  WhatsApp Direct Support
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Prefer instant assistance? Chat directly with our official support representative on WhatsApp for fast, real-time resolution!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenWhatsApp();
                    setWhatsappModalOpen(false);
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Directly
                </button>

                <button
                  type="button"
                  onClick={() => setWhatsappModalOpen(false)}
                  className="w-full bg-[#142548] hover:bg-[#1a2e58] text-slate-300 hover:text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all border border-[#233b6e] cursor-pointer"
                >
                  Continue to Open Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}

