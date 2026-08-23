'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Wrench } from 'lucide-react';

export default function MaintenanceGuard({ children }) {
  const [maintenance, setMaintenance] = useState({
    isMaintenance: false,
    headline: '',
    descriptionText: '',
    imageUrl: null,
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await api.get('/public/maintenance-mode');
        if (res.data && res.data.success && res.data.settings) {
          setMaintenance(res.data.settings);
        }
      } catch (err) {
        console.error('Failed to fetch maintenance status:', err);
      } finally {
        setChecking(false);
      }
    };
    checkMaintenance();
  }, []);

  if (!checking && maintenance.isMaintenance) {
    return (
      <div className="min-h-screen w-full bg-[#061127] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-xl w-full bg-[#0a1835] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white font-righteous font-bold text-xl shadow-md">
              E
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wide font-righteous">
              Ever<span className="text-[#fe780b]">Stake</span>
            </span>
          </div>

          {/* Maintenance Image or SVG Illustration */}
          <div className="w-full flex items-center justify-center py-4">
            {maintenance.imageUrl && maintenance.imageUrl.startsWith('data:') ? (
              <img src={maintenance.imageUrl} alt="Maintenance Illustration" className="max-h-64 object-contain" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff0044]/20 to-[#fe780b]/20 border border-[#ff0044]/40 flex items-center justify-center shadow-lg">
                <Wrench className="w-12 h-12 text-[#fe780b] animate-bounce" />
              </div>
            )}
          </div>

          {/* Maintenance Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ff0044] uppercase tracking-wide">
            {maintenance.headline || 'THE SITE IS UNDER MAINTENANCE'}
          </h1>

          {/* Maintenance Description */}
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line max-w-lg mx-auto">
            {maintenance.descriptionText ||
              "We're currently performing scheduled system upgrades to serve you better.\nPlease check back shortly."}
          </p>

          <div className="pt-4 border-t border-white/10 text-slate-500 text-xs font-semibold">
            © {new Date().getFullYear()} EverStake. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  return children;
}
