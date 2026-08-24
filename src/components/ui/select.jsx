'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

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

export function SelectContent({ className = '', searchable = true, searchPlaceholder = 'Search country...', children }) {
  const { open } = useContext(SelectContext);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [open]);

  if (!open) return null;

  const childrenArray = React.Children.toArray(children);
  const filteredChildren = childrenArray.filter((child) => {
    if (!searchQuery.trim()) return true;
    if (React.isValidElement(child)) {
      const text = child.props.children || child.props.value || '';
      return String(text).toLowerCase().includes(searchQuery.toLowerCase().trim());
    }
    return true;
  });

  return (
    <div className={`absolute left-0 right-0 top-full mt-1.5 bg-[#081226] border border-[#ff0044]/30 rounded-xl shadow-2xl overflow-hidden z-50 font-sans ${className}`}>
      {searchable && (
        <div className="p-2 border-b border-[#16274a] bg-[#060f22] sticky top-0 z-10">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#0d1c3a] border border-[#1d335f] text-white text-xs rounded-lg pl-8 pr-7 py-2 focus:outline-none focus:border-[#ff0044] placeholder-slate-500 font-sans"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                }}
                className="absolute right-2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="max-h-56 overflow-y-auto no-scrollbar py-1 divide-y divide-[#16274a]/40">
        {filteredChildren.length > 0 ? (
          filteredChildren
        ) : (
          <div className="px-4 py-3 text-xs text-slate-400 text-center font-sans">
            No matching items found
          </div>
        )}
      </div>
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
