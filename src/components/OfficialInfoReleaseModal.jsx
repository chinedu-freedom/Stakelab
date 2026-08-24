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
          <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.807 0-3.578-.485-5.132-1.401l-.368-.218-3.818 1.001 1.019-3.722-.24-.382c-1.007-1.602-1.54-3.468-1.54-5.38 0-5.419 4.408-9.827 9.83-9.827 2.628 0 5.098 1.023 6.956 2.883 1.859 1.859 2.88 4.33 2.88 6.954 0 5.421-4.408 9.83-9.83 9.83M12.05 2C6.502 2 2 6.502 2 12.05c0 1.942.556 3.844 1.61 5.485L2 22l4.636-1.216c1.583.929 3.39 1.418 5.414 1.418 5.548 0 10.05-4.502 10.05-10.05C22.1 6.502 17.598 2 12.05 2" />
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
