'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const SelectContext = createContext(null);

export function Select({ value, onValueChange, defaultValue, children }) {
  const [selectedValue, setSelectedValue] = useState(value !== undefined ? value : defaultValue || '');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue, labelText) => {
    setSelectedValue(newValue);
    if (labelText) setSelectedLabel(labelText);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ selectedValue, selectedLabel, setSelectedLabel, handleSelect, open, setOpen }}>
      <div ref={containerRef} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = '', children }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full flex items-center justify-between px-4 py-3 bg-[#060f22] border border-[#182848] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#ff0044] transition-all cursor-pointer select-none font-sans ${className}`}
    >
      {children}
      <ChevronDown className={`w-4 h-4 ml-2 text-slate-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectValue({ placeholder = 'Select...', children }) {
  const { selectedValue, selectedLabel } = useContext(SelectContext);
  return (
    <span className="truncate text-white font-sans text-xs font-bold">
      {children !== undefined ? children : (selectedLabel || selectedValue || <span className="text-slate-400 font-normal">{placeholder}</span>)}
    </span>
  );
}

export function SelectContent({ className = '', children }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div className={`absolute left-0 right-0 top-full mt-1.5 bg-[#081226] border border-[#ff0044]/30 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto no-scrollbar font-sans py-1 divide-y divide-[#16274a]/40 ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className = '' }) {
  const { selectedValue, handleSelect, setSelectedLabel } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  const labelText = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    if (isSelected && labelText) {
      setSelectedLabel(labelText);
    }
  }, [isSelected, labelText, setSelectedLabel]);

  return (
    <div
      onClick={() => handleSelect(value, labelText)}
      className={`px-4 py-3 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between font-sans ${
        isSelected
          ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-bold'
          : 'text-slate-200 hover:bg-[#12234e] hover:text-white'
      } ${className}`}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="w-4 h-4 text-white stroke-[3] shrink-0 ml-2" />}
    </div>
  );
}
