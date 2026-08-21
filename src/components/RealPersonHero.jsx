'use client';

import { TrendingUp } from 'lucide-react';

export default function RealPersonHero() {
  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
      {/* Red-Orange Arch Backdrop with Grid Lines */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="w-[85%] h-[92%] rounded-t-[180px] bg-gradient-to-b from-[#fe780b] via-[#ff0044] to-[#cc0033] relative overflow-hidden shadow-2xl shadow-red-500/40 border-2 border-white/20">
          {/* Grid Texture Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Floating 3D Gold Coin 1 (Left) */}
      <div className="absolute top-12 left-0 z-30 animate-bounce duration-1000">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-amber-500/50">
          ₿
        </div>
      </div>

      {/* Floating 3D Gold Coin 2 (Right) */}
      <div className="absolute top-20 right-0 z-30 animate-bounce duration-1000 delay-300">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-amber-500/50">
          ₿
        </div>
      </div>

      {/* Floating Daily Yield Badge */}
      <div className="absolute top-2 bg-[#07193b]/95 border border-emerald-500/50 px-4 py-2 rounded-full z-40 shadow-xl flex items-center gap-2 backdrop-blur-md">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold text-white">Daily Staking Returns</span>
        <span className="text-xs font-extrabold text-emerald-400">+70% APY</span>
      </div>

      {/* Real Person Photo Cutout Mask */}
      <div className="relative z-20 w-[88%] h-[88%] flex items-end justify-center overflow-hidden rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          alt="Real Person Working on Laptop - Stakelab Investor"
          className="w-full h-full object-cover object-top drop-shadow-2xl mix-blend-normal hover:scale-105 transition-transform duration-500 rounded-b-3xl"
        />
        {/* Soft bottom vignette gradient blend */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07193b] via-[#07193b]/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
