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
  Globe,
  Cpu,
  UserPlus,
  Wallet,
  PlayCircle,
  RefreshCw,
  RotateCw,
  CheckSquare,
  BarChart3,
  Download,
  Layers,
  Activity,
  DollarSign,
  Lock,
  LayoutDashboard,
} from 'lucide-react';

export default function AboutUsPage() {
  const steps = [
    {
      num: 1,
      title: 'Register Your Account',
      desc: 'Create your secure personal account in seconds through a simple and straightforward registration process.',
      icon: UserPlus,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
    },
    {
      num: 2,
      title: 'Fund Your Account',
      desc: 'Deposit supported crypto assets such as USDT, BTC, ETH, TRX, and other supported assets through our multi-network deposit infrastructure, including BEP20, TRC20, ERC20, and native networks where available.',
      icon: Wallet,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
    },
    {
      num: 3,
      title: 'Activate Staking',
      desc: 'Choose your preferred staking pool, review the applicable terms, and activate your staking position. Once confirmed, your selected plan begins processing according to its specified parameters.',
      icon: PlayCircle,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
    },
    {
      num: 4,
      title: 'Automated Yield Execution',
      desc: 'Eligible staking positions are processed automatically according to the terms of the selected plan, with applicable returns reflected directly in your EverStake dashboard.',
      icon: RefreshCw,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30',
    },
    {
      num: 5,
      title: 'Automatic Compounding',
      desc: 'For plans with Compounding Enabled, eligible earnings can be automatically added to your active staking balance and used for further yield generation. This allows your position to grow without requiring manual reinvestment.',
      icon: RotateCw,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
    },
    {
      num: 6,
      title: 'Capital Return',
      desc: 'For plans with Capital Return Enabled, your original staking capital is scheduled for release back to your available balance when the applicable staking period reaches maturity, subject to the terms of the selected plan.',
      icon: CheckSquare,
      color: 'from-[#ff0044]/20 to-rose-600/10 text-[#ff0044] border-[#ff0044]/30',
    },
    {
      num: 7,
      title: 'Monitor Your Performance',
      desc: 'Track your initial capital, accumulated returns, compounded earnings, active positions, plan duration, maturity status, payout history, and withdrawal eligibility directly from your personal dashboard.',
      icon: BarChart3,
      color: 'from-sky-500/20 to-sky-600/10 text-sky-400 border-sky-500/30',
    },
    {
      num: 8,
      title: 'Withdraw Your Eligible Funds',
      desc: 'When your funds become eligible for withdrawal under the terms of your selected plan, submit a withdrawal request and choose your preferred supported cryptocurrency payout option.',
      icon: Download,
      color: 'from-teal-500/20 to-teal-600/10 text-teal-400 border-teal-500/30',
    },
  ];

  const features = [
    {
      emoji: '🌐',
      title: 'Global Staking Community',
      desc: 'Built to serve a growing global community, with the platform highlighting $7B+ in staked assets across its ecosystem.',
    },
    {
      emoji: '🔗',
      title: 'Multichain Support',
      desc: 'Support for multiple blockchain standards and networks, including BEP20, TRC20, ERC20, and native cryptocurrencies, giving users greater flexibility when depositing and managing digital assets.',
    },
    {
      emoji: '⚡',
      title: 'Intelligent Profitability Optimization',
      desc: 'Automated optimization mechanisms designed to help manage eligible positions efficiently, including intelligent asset and network switching where supported.',
    },
    {
      emoji: '📊',
      title: 'Real-Time Monitoring',
      desc: 'Stay informed with real-time visibility into yield parameters, pool status, account performance, active positions, and payout history.',
    },
    {
      emoji: '💰',
      title: 'Flexible Cryptocurrency Payouts',
      desc: 'Choose from supported cryptocurrency payout options when your funds become eligible, with streamlined withdrawal processing designed for a smooth user experience.',
    },
    {
      emoji: '🔐',
      title: 'Security-Focused Infrastructure',
      desc: 'EverStake is designed around security-conscious infrastructure, transparent account monitoring, and automated processes intended to provide users with greater confidence when managing their digital assets.',
    },
    {
      emoji: '📈',
      title: 'Transparent Account Management',
      desc: 'Everything you need is available from one centralized dashboard — from your deposited capital and active staking plans to accumulated earnings, compounding activity, maturity dates, and withdrawal status.',
    },
  ];

  return (
    <UserSidebarLayout>
      <div className="max-w-6xl mx-auto space-y-12 font-sans animate-in fade-in duration-300 pb-20">
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
            </div>
          </div>

          {/* Stat Badges */}
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

        {/* How It Works Section */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-righteous">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Getting started on EverStake is fast, transparent, and seamless. Our streamlined platform is designed to make managing your crypto staking positions simple while giving you clear visibility over your account and earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 relative space-y-3.5 shadow-xl hover:border-[#ff0044]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${step.color} border font-black font-righteous text-sm flex items-center justify-center`}>
                        {step.num}
                      </span>
                      <IconComponent className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-white font-righteous">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Millions Choose EverStake Section */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-righteous">
              Why Millions Choose EverStake
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Advanced yield parameters designed for security, scalability, transparency, and efficient digital-asset management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#060f22] border border-[#182848] rounded-2xl p-6 space-y-2 shadow-lg hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{feat.emoji}</span>
                  <h3 className="text-base font-bold text-white font-righteous">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8 font-sans">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Platform Tagline Banner */}
        <div className="bg-gradient-to-r from-[#ff0044] via-[#fe780b] to-indigo-600 rounded-3xl p-8 sm:p-10 text-center text-white space-y-4 shadow-2xl relative overflow-hidden">
          <h2 className="text-xl sm:text-3xl font-black font-righteous tracking-wide">
            EverStake — Simple to Start. Easy to Monitor. Built for Digital Assets.
          </h2>
          <p className="text-xs sm:text-sm font-semibold max-w-xl mx-auto text-white/90">
            Join over 1.6 Million retail and institutional stakers securing yields worldwide.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/staking/create"
              className="px-8 py-3.5 rounded-full bg-white text-[#ff0044] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider shadow-xl transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>EXPLORE STAKING PLANS</span>
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
