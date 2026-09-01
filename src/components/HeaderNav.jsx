'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Layers, User, ChevronDown, Menu, X, TrendingUp, Check } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

let cachedHeaderBrandInfo = null;

const renderFormattedBrandName = (name) => {
  if (!name) return null;
  const str = String(name);
  if (str.toLowerCase() === 'everstake') {
    return (
      <span className="text-2xl font-extrabold tracking-tight text-white font-righteous">
        Ever<span className="text-[#ff0044]">Stake</span>
      </span>
    );
  }
  return (
    <span className="text-2xl font-extrabold tracking-tight text-white font-righteous">
      {str}
    </span>
  );
};

export default function HeaderNav() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');

  const langRef = useRef(null);

  const [brandInfo, setBrandInfo] = useState(() => {
    return cachedHeaderBrandInfo || { logoUrl: null, siteName: 'EverStake', loaded: !!cachedHeaderBrandInfo };
  });

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);

    if (cachedHeaderBrandInfo) {
      setBrandInfo(cachedHeaderBrandInfo);
      return;
    }

    api
      .get('/public/logo-favicon')
      .then((res) => {
        if (res.data && res.data.success && res.data.settings) {
          const info = {
            logoUrl: res.data.settings.logoUrl || null,
            siteName: res.data.settings.siteName || res.data.settings.siteTitle || 'EverStake',
            loaded: true,
          };
          cachedHeaderBrandInfo = info;
          setBrandInfo(info);
        } else {
          setBrandInfo((prev) => ({ ...prev, loaded: true }));
        }
      })
      .catch(() => setBrandInfo((prev) => ({ ...prev, loaded: true })));

    const handleLogoUpdate = (e) => {
      if (e.detail) {
        const info = { ...brandInfo, logoUrl: e.detail, loaded: true };
        cachedHeaderBrandInfo = info;
        setBrandInfo(info);
      }
    };
    window.addEventListener('site-logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('site-logo-updated', handleLogoUpdate);
  }, []);

  const [searchLang, setSearchLang] = useState('');

  // Comprehensive World Languages List
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
    { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese (Português)', flag: '🇵🇹' },
    { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
    { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
    { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' },
    { code: 'tr', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
    { code: 'pl', name: 'Polish (Polski)', flag: '🇵🇱' },
    { code: 'nl', name: 'Dutch (Nederlands)', flag: '🇳🇱' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)', flag: '🇮🇩' },
    { code: 'sw', name: 'Swahili (Kiswahili)', flag: '🇰🇪' },
    { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭' },
    { code: 'th', name: 'Thai (ไทย)', flag: '🇹🇭' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
    { code: 'fa', name: 'Persian (فارسی)', flag: '🇮🇷' },
    { code: 'sv', name: 'Swedish (Svenska)', flag: '🇸🇪' },
    { code: 'el', name: 'Greek (Ελληνικά)', flag: '🇬🇷' },
    { code: 'cs', name: 'Czech (Čeština)', flag: '🇨🇿' },
    { code: 'ro', name: 'Romanian (Română)', flag: '🇷🇴' },
    { code: 'hu', name: 'Hungarian (Magyar)', flag: '🇭🇺' },
    { code: 'he', name: 'Hebrew (עברית)', flag: '🇮🇱' },
    { code: 'da', name: 'Danish (Dansk)', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish (Suomi)', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian (Norsk)', flag: '🇳🇴' },
    { code: 'uk', name: 'Ukrainian (Українська)', flag: '🇺🇦' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)', flag: '🇲🇾' },
    { code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰' },
    { code: 'am', name: 'Amharic (አማርኛ)', flag: '🇪🇹' },
  ];

  const currentLangObj = languages.find((l) => l.code === selectedLang) || languages[0];

  const filteredLanguages = languages.filter((l) =>
    l.name.toLowerCase().includes(searchLang.toLowerCase())
  );

  // Close dropdown on outside click & read active translate cookie
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    // Read existing googtrans cookie
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2,3})/i);
      if (match && match[1]) {
        setSelectedLang(match[1].toLowerCase());
      }
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode) => {
    setSelectedLang(langCode);
    setLangDropdownOpen(false);

    if (typeof window !== 'undefined') {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/`;

      const selectEl = document.querySelector('.goog-te-combo');
      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <header className="border-b border-white/10 bg-transparent relative z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          {brandInfo.loaded && (
            <>
              {brandInfo.logoUrl && (
                <img
                  src={brandInfo.logoUrl}
                  alt={brandInfo.siteName || 'Logo'}
                  className="h-10 max-w-[180px] object-contain rounded"
                />
              )}
              {brandInfo.siteName && renderFormattedBrandName(brandInfo.siteName)}
            </>
          )}
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-white">
          <a href="#" className="text-[#ff0044] hover:opacity-90 transition-colors">Home</a>
          <a href="#about" className="hover:text-[#ff0044] transition-colors">About</a>
          <a href="#plans" className="hover:text-[#ff0044] transition-colors">Plans</a>
          <a href="#blog" className="hover:text-[#ff0044] transition-colors">Blog</a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff0044] transition-colors flex items-center gap-1"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions: Connected Log in | Sign up OR Dashboard Button + World Language Selector */}
        <div className="hidden lg:flex items-center space-x-3.5">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-red-500/20 hover:opacity-95 transition-all select-none"
            >
              <User className="w-4 h-4 text-white" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="inline-flex rounded-xl bg-[#0e1b38] p-0.5 shadow-md overflow-hidden border border-white/20">
              <Link
                href="/login"
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition-colors flex items-center justify-center border-r border-white/20 select-none"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition-colors flex items-center justify-center select-none"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Custom Searchable World Language Dropdown Component (Matching Taller Trigger) */}
          <div className="relative w-40" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full bg-brand-gradient text-white text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-1.5 cursor-pointer shadow-md hover:opacity-95 transition-all select-none"
            >
              <span className="truncate flex items-center gap-1.5">
                <span>{currentLangObj.flag}</span>
                <span className="truncate">{currentLangObj.name.split(' ')[0]}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white stroke-[2.5] transition-transform duration-200 shrink-0 ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Panel with Exact Matching Width (w-full / w-40) */}
            {langDropdownOpen && (
              <div className="absolute right-0 w-40 top-full mt-1.5 bg-[#081226] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50 font-sans">
                {/* Search Language Input */}
                <div className="p-1.5 border-b border-white/10 bg-[#050c1b]">
                  <input
                    type="text"
                    value={searchLang}
                    onChange={(e) => setSearchLang(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-7 bg-[#0e1b38] border border-white/15 rounded-md px-2 text-[11px] text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Scrollable Language List */}
                <div className="max-h-56 overflow-y-auto divide-y divide-white/5 no-scrollbar">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => {
                      const isSelected = selectedLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`w-full text-left px-2.5 py-2 text-[11px] font-medium flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#ff0044] text-white font-bold'
                              : 'text-slate-200 hover:bg-[#112248] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{lang.flag}</span>
                            <span className="truncate">{lang.name.split(' ')[0]}</span>
                          </span>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3] shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-2 text-[11px] text-slate-400 text-center">No results</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-md bg-brand-gradient text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#051532] border-b border-white/10 px-4 pt-4 pb-6 space-y-4">
          <a href="#" className="block py-2 text-sm font-semibold text-[#ff0044]">Home</a>
          <a href="#about" className="block py-2 text-sm font-semibold text-white">About</a>
          <a href="#plans" className="block py-2 text-sm font-semibold text-white">Plans</a>
          <a href="#blog" className="block py-2 text-sm font-semibold text-white">Blog</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block py-2 text-sm font-semibold text-white">Contact Support (WhatsApp)</a>
          
          {/* Mobile Log in | Sign up OR Dashboard Button */}
          {user ? (
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <User className="w-4 h-4 text-white" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div className="flex rounded-xl bg-[#342e9e] p-0.5 shadow-lg overflow-hidden border border-white/15">
              <Link
                href="/login"
                className="w-1/2 py-2.5 text-xs font-bold text-white text-center border-r border-white/20"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="w-1/2 py-2.5 text-xs font-bold text-white text-center"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
