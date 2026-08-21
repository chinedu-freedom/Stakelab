'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Layers, User, ChevronDown, Menu, X, TrendingUp, Check } from 'lucide-react';

import api from '../lib/api';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');

  const langRef = useRef(null);

  useEffect(() => {
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-white/10 bg-transparent relative z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-md bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Stake<span className="text-[#ff0044]">Lab</span>
          </span>
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

        {/* Right Actions: Connected Log in | Sign up Button Group + World Language Selector */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Connected Segmented Log in | Sign up Button Group */}
          <div className="inline-flex rounded-lg bg-[#0e1b38] p-0.5 shadow-md overflow-hidden border border-white/15">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors flex items-center justify-center border-r border-white/15 select-none"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors flex items-center justify-center select-none"
            >
              Sign up
            </Link>
          </div>

          {/* Custom Searchable World Language Dropdown Component (Matching Width Trigger & Menu) */}
          <div className="relative w-36" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full bg-brand-gradient text-white text-xs font-bold rounded-lg px-3 py-1.5 flex items-center justify-between gap-1.5 cursor-pointer shadow-sm hover:opacity-95 transition-all select-none"
            >
              <span className="truncate flex items-center gap-1.5">
                <span>{currentLangObj.flag}</span>
                <span className="truncate">{currentLangObj.name.split(' ')[0]}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white stroke-[2.5] transition-transform duration-200 shrink-0 ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Panel with Exact Matching Width (w-full / w-36) */}
            {langDropdownOpen && (
              <div className="absolute right-0 w-36 top-full mt-1.5 bg-[#081226] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50 font-sans">
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
                          onClick={() => {
                            setSelectedLang(lang.code);
                            setLangDropdownOpen(false);
                          }}
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
          
          {/* Mobile Log in | Sign up Button Group */}
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
        </div>
      )}
    </header>
  );
}
