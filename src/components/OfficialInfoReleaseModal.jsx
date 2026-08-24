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
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-white font-sans space-y-6 animate-in zoom-in-95 duration-200 cursor-default"
      >
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
          <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 fill-white">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.478 1.333 4.992L2 22l5.148-1.349a9.96 9.96 0 0 0 4.863 1.258h.005c5.507 0 9.989-4.479 9.99-9.985A9.94 9.94 0 0 0 19.08 5.09 9.93 9.93 0 0 0 12.012 2zm5.834 14.154c-.246.691-1.424 1.321-1.993 1.406-.51.076-1.156.108-1.865-.117-.43-.137-.982-.319-1.688-.624-2.973-1.284-4.914-4.281-5.062-4.478-.148-.198-1.206-1.603-1.206-3.057 0-1.455.76-2.17 1.03-2.464.27-.297.589-.371.786-.371.197 0 .394.001.566.01.18.009.424-.068.664.509.246.594.836 2.039.91 2.187.074.148.123.321.025.518-.098.198-.148.321-.295.495-.148.174-.311.389-.444.522-.148.148-.302.309-.13.606.173.297.77 1.272 1.653 2.059 1.134 1.011 2.091 1.325 2.388 1.474.297.148.471.124.644-.074.173-.198.742-.867.939-1.164.197-.297.394-.247.691-.099.297.148 1.884.887 2.208 1.047.324.16.541.238.615.362.074.124.074.719-.172 1.41z" />
          </svg>
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
