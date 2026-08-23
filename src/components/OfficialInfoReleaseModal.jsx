'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import api from '../lib/api';

export default function OfficialInfoReleaseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/everstake_group');

  useEffect(() => {
    // Show modal automatically on entry
    setIsOpen(true);

    // Fetch dynamic WhatsApp group modal link from backend
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data && res.data.success && res.data.contactLinks?.whatsappGroupModal) {
          setWhatsappLink(res.data.contactLinks.whatsappGroupModal);
        }
      })
      .catch(() => null);
  }, []);

  const handleJoinNow = () => {
    window.open(whatsappLink, '_blank');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-white font-sans space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button (X) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing WhatsApp Green Icon Circle */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.45)] transform hover:scale-105 transition-transform">
          <MessageCircle className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-white stroke-none" />
        </div>

        {/* Modal Text Content */}
        <div className="space-y-2.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide font-righteous">
            Official Information Release
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xs mx-auto">
            Join our official WhatsApp group to get the latest news and welfare information about <span className="font-semibold text-white">EverStake</span> Platform.
          </p>
        </div>

        {/* EverStake Brand Gradient CTA Button (NOT plain orange) */}
        <div className="pt-2">
          <button
            onClick={handleJoinNow}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-red-500/20 transition-all transform active:scale-98 cursor-pointer"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
