'use client';

import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Coins,
  Cpu,
  Globe,
  Layers,
  Lock,
  Users,
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <UserSidebarLayout>
      <div className="max-w-6xl mx-auto space-y-10 font-sans animate-in fade-in duration-300 pb-20">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1835] via-[#0c1e42] to-[#07142e] border border-[#182848] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ff0044]/15 via-[#fe780b]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ff0044]/10 border border-[#ff0044]/20 text-[#ff0044] text-xs font-bold uppercase tracking-widest">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Staking & Yield Ecosystem</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-righteous tracking-wide leading-tight">
              About <span className="text-gradient-stakelab">EverStake</span>
            </h1>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                <span className="font-bold text-white">EverStake</span> is a global, institutional-grade digital asset staking infrastructure provider focused on making blockchain participation secure, reliable, and accessible.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Founded in 2018 by a team of blockchain engineers, EverStake operates non-custodial validators across more than 130 Proof-of-Stake (PoS) blockchain networks, supporting the security and decentralization of leading blockchain ecosystems. Today, the infrastructure secures more than $7 billion in staked assets on behalf of over 1.6 million retail and institutional users worldwide.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                At EverStake, we believe that participation in the blockchain economy should not require investors and asset holders to compromise between security, operational efficiency, and performance. Our infrastructure is designed to simplify the staking experience while maintaining institutional standards for reliability, transparency, and risk management.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Our approach combines enterprise-grade validator infrastructure, blockchain-native expertise, continuous network monitoring, and disciplined operational processes. By providing non-custodial staking infrastructure, we enable users to retain control of their digital assets while delegating the technical complexity of validator operations to a specialized infrastructure provider.
              </p>
            </div>
          </div>

          {/* 3 High-Impact Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#182848]/80">
            <div className="bg-[#060f22]/80 border border-[#182848] rounded-2xl p-5 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-righteous">1.6M+</div>
              <div className="text-xs font-bold text-[#ff0044] uppercase tracking-wider mt-1">Retail & Institutional Users</div>
            </div>
            <div className="bg-[#060f22]/80 border border-[#182848] rounded-2xl p-5 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-righteous">$7B+</div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1">Secured Staked Assets</div>
            </div>
            <div className="bg-[#060f22]/80 border border-[#182848] rounded-2xl p-5 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-righteous">130+</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-1">PoS Blockchain Networks</div>
            </div>
          </div>
        </div>

        {/* How It Works (4-Step Flow) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous">How It Works</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Getting started on EverStake is fast, transparent, and seamless:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 relative space-y-3 shadow-lg hover:border-[#ff0044]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#ff0044]/15 border border-[#ff0044]/30 text-[#ff0044] font-black font-righteous text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-white font-righteous">Register Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create your secure personal account in seconds with zero complicated verification delays.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 relative space-y-3 shadow-lg hover:border-amber-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black font-righteous text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-white font-righteous">Fund Your Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deposit crypto assets (USDT, BTC, ETH, TRX) instantly with automated multi-network routing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 relative space-y-3 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black font-righteous text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-white font-righteous">Activate Staking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your preferred high-yield pool package and lock in daily automated return contracts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 relative space-y-3 shadow-lg hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 font-black font-righteous text-lg flex items-center justify-center">
                4
              </div>
              <h3 className="text-base font-bold text-white font-righteous">Earn Daily Rewards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive continuous daily return distributions credited directly to your balance ready for withdrawal.
              </p>
            </div>
          </div>
        </div>

        {/* Staking Pools Overview Section */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous">
              Staking Pools Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              High-yield liquidity pools structured for short-term returns and long-term capital growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pool 1: Basic Pool */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 space-y-5 shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Basic Liquidity Pool
                </div>
                <h3 className="text-xl font-bold text-white font-righteous">EverStake Basic Pool</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Basic Pool offers a daily return of <span className="text-emerald-400 font-bold">7.5% for 20 days</span>, providing a total return of 150% over the investment period without requiring referrals or compounding. Users may also compound profits by following the platform&apos;s activation process.
                </p>
              </div>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Activation Amount:</span>
                  <span className="font-bold text-white">$30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Compounding:</span>
                  <span className="font-bold text-white">$30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Withdrawal:</span>
                  <span className="font-bold text-emerald-400">$20 (Anytime once reached)</span>
                </div>
              </div>
            </div>

            {/* Pool 2: VIP Pool */}
            <div className="bg-[#0a1835] border border-[#ff0044]/30 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff0044]/10 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#ff0044]/15 text-[#ff0044] border border-[#ff0044]/30 uppercase tracking-wider">
                  VIP High-Yield Pool
                </div>
                <h3 className="text-xl font-bold text-white font-righteous">EverStake VIP Pool</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The VIP Pool offers an accelerated daily return of <span className="text-emerald-400 font-bold">8.5% for 20 days</span> and is designed for users seeking higher tier investment opportunities with priority liquidity routing.
                </p>
              </div>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Activation Amount:</span>
                  <span className="font-bold text-white">$10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Withdrawal:</span>
                  <span className="font-bold text-emerald-400">$20 (Withdraw anytime)</span>
                </div>
              </div>
            </div>

            {/* Pool 3: Contract Pool */}
            <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 space-y-5 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Fixed Contract Pool
                </div>
                <h3 className="text-xl font-bold text-white font-righteous">EverStake Contract Pool</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fixed-income, long-term plan providing a fixed daily return of <span className="text-amber-400 font-bold">10.5% for 183 days (6 months)</span>. Withdrawals are released upon completion of the contract period alongside accumulated capital.
                </p>
              </div>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-bold text-white">183 Days (6 Months)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Release Schedule:</span>
                  <span className="font-bold text-amber-400">End of Contract Release</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Platform Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-7 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ff0044]/15 border border-[#ff0044]/30 text-[#ff0044] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-righteous">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our mission is to remove the complexity from cryptocurrency staking and node operation. Whether you are using a personal laptop, specialized hardware, or institutional capital, EverStake provides the tools and infrastructure needed to maximize performance and yield while maintaining a seamless user experience.
            </p>
          </div>

          {/* Platform */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-7 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-righteous">Our Platform</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              EverStake combines powerful automated smart engines with real-time liquidity routing. Our platform automatically selects the most profitable yield algorithms and handles token conversions in real time to optimize returns, while providing real-time stats and transparent monitoring.
            </p>
          </div>
        </div>

        {/* Why Millions Choose EverStake Checklist */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous">
              Why Millions Choose EverStake
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Industry-leading yield parameters built for security, scale, and maximum return.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>More than <strong>5M+ application downloads</strong> worldwide.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>A global community of over <strong>15M+ registered staking pool users</strong>.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>More than <strong>30,000 active stakers</strong> connected across 32 yield pools.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Over <strong>$50,000 in daily payouts</strong> processed seamlessly.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Support for multichain tokens (BEP20, TRC20, ERC20, and native crypto).</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Automatic profitability optimization with intelligent coin switching.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Real-time monitoring of yield rates, pool health, and payout history.</span>
            </div>

            <div className="flex items-start space-x-3 bg-[#060f22] p-4 rounded-xl border border-[#182848]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Flexible cryptocurrency payout options with instant withdrawal processing.</span>
            </div>
          </div>
        </div>

        {/* Security & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-righteous">Built for Performance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Effortless automated routines. Our software continuously updates yield routing so you can earn cryptocurrency without complex setup.
            </p>
          </div>

          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-righteous">Security & Transparency</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trust is our foundation. EverStake is committed to transparent operations, secure vault infrastructure, and reliable automated payout systems.
            </p>
          </div>

          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-righteous">Our Vision</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We envision a future where decentralized finance and high-yield staking are accessible to everyone with enterprise-grade confidence.
            </p>
          </div>
        </div>

        {/* Start Earning CTA Box */}
        <div className="bg-gradient-to-r from-[#ff0044] to-[#fe780b] rounded-3xl p-8 sm:p-10 text-center text-white space-y-4 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-black font-righteous tracking-wide">
            Start Earning Now
          </h2>
          <p className="text-xs sm:text-sm font-semibold max-w-xl mx-auto text-white/90">
            EverStake — Simple. Reliable. Profitable Staking & Yield Protocol.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/staking/create"
              className="px-8 py-3.5 rounded-full bg-white text-[#ff0044] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider shadow-xl transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore Mining Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-full bg-black/30 hover:bg-black/40 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
