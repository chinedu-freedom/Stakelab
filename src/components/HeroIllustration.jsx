'use client';

import { Coins, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
      {/* Background Glowing Arch Shape */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="w-[85%] h-[90%] rounded-t-[180px] bg-gradient-to-b from-[#fe780b] via-[#ff0044] to-[#cc0033] relative overflow-hidden shadow-2xl shadow-red-500/30 border-2 border-white/20">
          {/* Subtle Grid Line Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Floating 3D Coin 1 (Left) */}
      <div className="absolute top-16 left-2 z-20 animate-bounce duration-1000">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-500/40">
          ₿
        </div>
      </div>

      {/* Floating 3D Coin 2 (Right) */}
      <div className="absolute top-24 right-2 z-20 animate-bounce duration-1000 delay-300">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-500/40">
          ₿
        </div>
      </div>

      {/* Floating Staking Badge (Top Center) */}
      <div className="absolute top-4 bg-[#0b0f19]/90 border border-emerald-500/40 px-4 py-2 rounded-full z-30 shadow-xl flex items-center gap-2 backdrop-blur-md">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold text-white">Daily Automated Earnings</span>
        <span className="text-xs font-extrabold text-emerald-400">+70% APY</span>
      </div>

      {/* Center Character Vector SVG Illustration */}
      <div className="relative z-10 w-[90%] h-[90%] flex items-end justify-center">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
          {/* Leaves */}
          <path d="M 50 420 Q 90 320 140 380 Q 90 440 50 420 Z" fill="#2563eb" opacity="0.8" />
          <path d="M 450 420 Q 410 320 360 380 Q 410 440 450 420 Z" fill="#2563eb" opacity="0.8" />
          <path d="M 70 450 Q 120 360 170 420 Q 120 480 70 450 Z" fill="#3b82f6" opacity="0.9" />
          <path d="M 430 450 Q 380 360 330 420 Q 380 480 430 450 Z" fill="#3b82f6" opacity="0.9" />

          {/* Person Body & Arms (Blue Shirt) */}
          <path d="M 180 340 C 180 250 320 250 320 340 L 330 440 L 170 440 Z" fill="#2563eb" />

          {/* Crossed Legs (Pants) */}
          <path d="M 140 420 Q 250 470 360 420 C 370 450 350 480 250 480 C 150 480 130 450 140 420 Z" fill="#1d4ed8" />

          {/* White Collar */}
          <path d="M 230 255 L 250 280 L 270 255 L 260 250 L 250 260 L 240 250 Z" fill="#ffffff" />

          {/* Head & Neck */}
          <path d="M 235 240 L 235 255 L 265 255 L 265 240 Z" fill="#fca5a5" />
          <circle cx="250" cy="200" r="40" fill="#fca5a5" />

          {/* Smiling Face Details */}
          <path d="M 240 215 Q 250 225 260 215" stroke="#7f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="238" cy="195" r="4" fill="#7f1d1d" />
          <circle cx="262" cy="195" r="4" fill="#7f1d1d" />

          {/* Hair */}
          <path d="M 210 190 C 210 140 290 140 290 190 C 290 170 270 155 250 155 C 230 155 210 170 210 190 Z" fill="#450a0a" />

          {/* White Laptop */}
          <polygon points="160,370 340,370 320,400 180,400" fill="#e2e8f0" />
          <rect x="170" y="290" width="160" height="80" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="180" y="300" width="140" height="60" rx="4" fill="#0f172a" />
          <circle cx="250" cy="330" r="10" fill="#ff0044" />
        </svg>
      </div>
    </div>
  );
}
