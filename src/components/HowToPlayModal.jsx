'use client';

import { X, HelpCircle, Gift, Sparkles, Coins, RefreshCw } from 'lucide-react';

export default function HowToPlayModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[100] w-full h-full min-h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fadeIn font-sans overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#09152e] border border-[#1d335f] rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-5 cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#fe780b] shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-righteous tracking-wide">
              How to Play Lucky Spin
            </h2>
            <p className="text-xs text-slate-400">Rules & reward claiming process</p>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex items-start space-x-3 bg-[#061127] border border-[#1d335f] p-3.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
              1
            </div>
            <div>
              <p className="font-bold text-white font-righteous">Earn Free Spins</p>
              <p className="text-slate-400 mt-0.5">Earn +1 Free Spin credit every time a new user registers using your referral link!</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-[#061127] border border-[#1d335f] p-3.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-bold">
              2
            </div>
            <div>
              <p className="font-bold text-white">Spin & Win Cash</p>
              <p className="text-slate-400 mt-0.5">Click the "START / SPIN" button to spin the wheel. Land on prize slices to win instant rewards.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-[#061127] border border-[#1d335f] p-3.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 font-bold">
              3
            </div>
            <div>
              <p className="font-bold text-white">Instant Balance Credit</p>
              <p className="text-slate-400 mt-0.5">All cash prizes won are credited directly to your main account balance and withdrawable anytime!</p>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all cursor-pointer"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
