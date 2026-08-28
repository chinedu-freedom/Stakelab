'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { countries } from '../lib/countries';

export default function SearchableCountrySelect({ value, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const selectedCountry =
    typeof value === 'object' && value?.name
      ? value
      : countries.find((c) => c.name.toLowerCase() === String(value || '').toLowerCase()) || countries[0];

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-11 bg-[#06122b] border border-[#14264a] hover:border-[#243f75] text-white rounded-lg px-3.5 text-xs font-medium flex items-center justify-between transition-all outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          <img
            src={`https://flagcdn.com/w40/${(selectedCountry?.code || 'us').toLowerCase()}.png`}
            alt={selectedCountry?.name || 'Country'}
            className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-slate-700/60"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="truncate text-slate-200">{selectedCountry.name}</span>
          <span className="text-slate-400 font-mono text-[11px]">({selectedCountry.dialCode})</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#091630] border border-[#182848] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
          {/* Search Bar */}
          <div className="p-2 border-b border-[#182848] bg-[#0c1c3d]">
            <div className="flex items-center gap-2 bg-[#06122b] border border-[#1e3463] rounded-lg px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full bg-transparent border-0 text-white text-xs outline-none placeholder-slate-500 font-sans"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto no-scrollbar py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors hover:bg-[#142852] ${
                    c.name === selectedCountry.name ? 'bg-[#142852] text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <img
                      src={`https://flagcdn.com/w40/${(c.code || 'us').toLowerCase()}.png`}
                      alt={c.name}
                      className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-slate-700/60"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] ml-2 shrink-0">{c.dialCode}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 text-center font-sans">
                No matching country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
