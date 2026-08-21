'use client';

import { useState } from 'react';
import { Copy, Check, Users, Gift, Share2, Award, ChevronRight } from 'lucide-react';

export default function HandPhoneMockup() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto py-6 select-none">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff0044]/25 via-amber-500/15 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* REALISTIC HAND & PHONE CONTAINER */}
      <div className="relative flex items-center justify-center">
        {/* LEFT HAND FINGERS (Grasping Left Edge) */}
        <div className="absolute -left-5 top-24 z-30 flex flex-col space-y-4 pointer-events-none">
          {/* Index Finger */}
          <div className="w-8 h-10 rounded-l-full bg-gradient-to-r from-[#d48c6e] via-[#e8a385] to-[#f4b89d] shadow-lg border-l border-t border-[#c0785a] transform -rotate-6" />
          {/* Middle Finger */}
          <div className="w-10 h-11 rounded-l-full bg-gradient-to-r from-[#cf8566] via-[#e29a7c] to-[#f0b093] shadow-lg border-l border-t border-[#b87052] transform -rotate-3" />
          {/* Ring Finger */}
          <div className="w-9 h-10 rounded-l-full bg-gradient-to-r from-[#c97e5f] via-[#dd9374] to-[#ecaa8c] shadow-lg border-l border-t border-[#b06749]" />
          {/* Pinky Finger */}
          <div className="w-7 h-9 rounded-l-full bg-gradient-to-r from-[#c27657] via-[#d68a6b] to-[#e6a183] shadow-lg border-l border-t border-[#aa5d3f] transform rotate-3" />
        </div>

        {/* RIGHT HAND THUMB & PALM (Grasping Right Edge) */}
        <div className="absolute -right-7 bottom-4 z-30 pointer-events-none">
          {/* Palm Base Contour */}
          <div className="w-24 h-48 rounded-r-3xl bg-gradient-to-l from-[#d48c6e] via-[#e59e80] to-[#f2b59b] shadow-2xl border-r border-b border-[#bb7255] transform rotate-12 flex items-start pt-6 pl-2">
            {/* Thumb Joint & Tip */}
            <div className="w-12 h-20 rounded-l-full bg-gradient-to-r from-[#d99173] via-[#ea9e80] to-[#f6bca3] shadow-md border-t border-l border-[#c57b5d] transform -rotate-45 -ml-8 -mt-2" />
          </div>
        </div>

        {/* SMARTPHONE DEVICE FRAME */}
        <div className="relative z-10 w-[275px] sm:w-[290px] bg-[#070b14] border-[7px] border-[#1e2942] rounded-[3rem] shadow-2xl overflow-hidden font-sans text-slate-100 ring-1 ring-white/10">
          {/* Screen Notch / Speaker Bar */}
          <div className="w-full bg-[#0b101d] px-5 py-2.5 flex items-center justify-between border-b border-[#18233c]">
            <span className="text-[10px] font-bold text-slate-300">9:41</span>
            <div className="w-14 h-3 bg-[#03060c] rounded-full flex items-center justify-center">
              <div className="w-3.5 h-1 bg-[#1c2944] rounded-full" />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold text-slate-400">5G</span>
            </div>
          </div>

          {/* REFERRAL PROGRAM DASHBOARD SCREEN CONTENT */}
          <div className="p-4 space-y-3.5 bg-[#070d1a] text-xs">
            {/* App Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#ff0044] flex items-center justify-center text-white text-xs font-black shadow-md shadow-red-500/30">
                  🎁
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">Referral Program</h4>
                  <span className="text-[9px] text-slate-400">Affiliate Commission</span>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-[#ff0044]/20 text-[#ff0044] border border-[#ff0044]/40 px-2 py-0.5 rounded-full">
                Active Tier 3
              </span>
            </div>

            {/* Total Earned & Invites Summary Card */}
            <div className="bg-gradient-to-r from-[#0f1d38] via-[#14264a] to-[#0c1830] p-3.5 rounded-2xl border border-[#ff0044]/40 shadow-xl space-y-2.5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-300 font-semibold block">Total Commission Earned</span>
                  <div className="text-xl font-extrabold text-white tracking-tight">$ 4,850.00</div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#ff0044]/20 border border-[#ff0044]/40 flex items-center justify-center text-[#ff0044]">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1c2e56]/80 text-[10px]">
                <div>
                  <span className="text-slate-400 block">Total Partners</span>
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> 124 Stakers
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Bonus</span>
                  <span className="font-bold text-amber-400 text-xs">+60% Max Rate</span>
                </div>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="bg-[#0b1426] p-3 rounded-xl border border-[#1b2b4d] space-y-1.5">
              <span className="text-[10px] font-bold text-slate-300 block">Your Unique Referral Link</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value="https://stakelab.io/ref/usr_9482"
                  className="w-full bg-[#060c18] border border-[#162544] text-[10px] text-slate-200 px-2.5 py-1.5 rounded-lg font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="bg-[#ff0044] hover:bg-[#e0003c] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors shadow-md"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Level Tier Commissions List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-300 block">Tiered Commission Breakdown</span>

              {/* Level 01 */}
              <div className="bg-[#0c172e] p-2.5 rounded-xl border border-[#ff0044]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff0044] to-[#fe650b] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                    L1
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">Level 01 (60%)</span>
                    <span className="text-[9px] text-slate-400">72 Referred Users</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#ff0044]">$ 2,910.00</span>
              </div>

              {/* Level 02 */}
              <div className="bg-[#0c172e] p-2.5 rounded-xl border border-[#ff0044]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff0044] to-[#fe650b] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                    L2
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">Level 02 (40%)</span>
                    <span className="text-[9px] text-slate-400">38 Referred Users</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#ff0044]">$ 1,440.00</span>
              </div>

              {/* Level 03 */}
              <div className="bg-[#0c172e] p-2.5 rounded-xl border border-[#ff0044]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff0044] to-[#fe650b] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                    L3
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">Level 03 (20%)</span>
                    <span className="text-[9px] text-slate-400">14 Referred Users</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#ff0044]">$ 500.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
