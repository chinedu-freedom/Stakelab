'use client';

import { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import api from '../lib/api';

export default function TelegramModal({ isOpen, setIsOpen }) {
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/everstake_channel');

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data && res.data.success && res.data.contactLinks) {
          const l = res.data.contactLinks;
          if (l.telegramChannel) setTelegramUrl(l.telegramChannel);
          else if (l.telegramSupport) setTelegramUrl(l.telegramSupport);
        }
      })
      .catch(() => null);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-full h-full min-h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans overflow-y-auto">
      <div className="relative w-full max-w-sm bg-[#09152e] border border-[#1d335f] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Telegram Icon Circle */}
        <div className="mx-auto w-16 h-16 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/20">
          <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-md">
            <Send className="w-6 h-6 -ml-0.5 mt-0.5 fill-current" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Join Our Official Telegram
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Join our Telegram channel to get exclusive promo gift codes, platform announcements, and connect with our official community!
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            window.open(telegramUrl, '_blank', 'noopener,noreferrer');
          }}
          className="w-full bg-[#0ea5e9] hover:bg-sky-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4 fill-current" /> Join Telegram Channel
        </button>
      </div>
    </div>
  );
}
