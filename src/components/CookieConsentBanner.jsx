'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';

export default function CookieConsentBanner() {
  const [cookiePolicy, setCookiePolicy] = useState({
    isEnabled: false,
    shortDescription: '',
    fullDescription: '',
  });
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCookiePolicy = async () => {
      try {
        const consent = localStorage.getItem('everstake_cookie_consent');
        if (consent === 'accepted') return;

        const res = await api.get('/public/cookie-policy');
        if (res.data && res.data.success && res.data.settings) {
          const s = res.data.settings;
          setCookiePolicy(s);
          if (s.isEnabled) {
            setVisible(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch cookie policy:', err);
      }
    };
    fetchCookiePolicy();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('everstake_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible || !cookiePolicy.isEnabled) return null;

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-[#0a1835]/95 backdrop-blur-md border border-[#1e3463] rounded-2xl p-4 sm:p-5 shadow-2xl text-white font-sans space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white shrink-0 shadow-md">
                <Cookie className="w-5 h-5" />
              </div>
              <h3 className="font-righteous font-bold text-sm text-white tracking-wide">
                We Value Your Privacy
              </h3>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-slate-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {cookiePolicy.shortDescription ||
              'We use cookies to enhance your experience, analyze site traffic, and assist in our marketing efforts.'}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold text-[#fe780b] hover:underline"
            >
              Read Cookie Policy
            </button>

            <button
              onClick={handleAccept}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Allow Cookies
            </button>
          </div>
        </div>
      </div>

      {/* Full Policy Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a1835] border border-[#1e3463] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans cursor-default"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#fe780b]" />
                <h3 className="font-righteous font-bold text-base text-white">
                  Cookie & Privacy Policy
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line no-scrollbar">
              {cookiePolicy.fullDescription}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleAccept();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-bold text-xs uppercase tracking-wider"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
