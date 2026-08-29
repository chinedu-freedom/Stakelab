'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import HeaderNav from '../components/HeaderNav';
import RealPersonHero from '../components/RealPersonHero';
import HandPhoneMockup from '../components/HandPhoneMockup';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  UserCheck,
  Headphones,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  MapPin,
  Mail,
  Phone,
  ChevronsUp,
  Plus,
  Minus,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Wallet,
  Banknote,
  Sprout,
  Users,
  Award,
  Shield,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [refRates, setRefRates] = useState([
    { level: 'Level 01', rate: '10%', icon: '/images/ref-level1.png' },
    { level: 'Level 02', rate: '5%', icon: '/images/ref-level2.png' },
    { level: 'Level 03', rate: '3%', icon: '/images/ref-level3.png' },
  ]);

  useEffect(() => {
    const fetchReferralRates = async () => {
      try {
        const res = await api.get('/public/referral-settings');
        if (res.data && res.data.success && res.data.referralSettings?.depositLevels) {
          const dl = res.data.referralSettings.depositLevels;
          if (dl.length >= 3) {
            setRefRates([
              { level: 'Level 01', rate: `${dl[0].percent}%`, icon: '/images/ref-level1.png' },
              { level: 'Level 02', rate: `${dl[1].percent}%`, icon: '/images/ref-level2.png' },
              { level: 'Level 03', rate: `${dl[2].percent}%`, icon: '/images/ref-level3.png' },
            ]);
          }
        }
      } catch (err) {
        // Quiet fallback
      }
    };
    fetchReferralRates();
  }, []);

  // Calculator & Staking Plans state
  const [dbPlans, setDbPlans] = useState([]);
  const [activeTier, setActiveTier] = useState('Flexible Tier');
  const [calcAmount, setCalcAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('silver');
  const [isCompounding, setIsCompounding] = useState(true);

  useEffect(() => {
    const fetchDbPlans = async () => {
      try {
        const res = await api.get('/staking/plans');
        if (res.data && res.data.success && res.data.plans?.length > 0) {
          const uniqueMap = new Map();
          res.data.plans.forEach((p) => {
            const key = p.title.trim().toLowerCase();
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, p);
            }
          });
          setDbPlans(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        // Quiet fallback
      }
    };
    fetchDbPlans();
  }, []);

  const displayPlans = dbPlans.filter((p) => {
    const planTier = (p.tier || '').trim().toLowerCase();
    const currentTier = activeTier.trim().toLowerCase();
    if (currentTier.includes('dynamic')) {
      return planTier.includes('dynamic');
    }
    return !planTier || planTier.includes('flex');
  });

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState(0);

  // Live Crypto Market state
  const [marketTab, setMarketTab] = useState('Hot');
  const [flashingPair, setFlashingPair] = useState(null);
  const [marketData, setMarketData] = useState([
    { id: 'cardano', pair: 'ADA/USDT', name: 'Cardano', amount: 0.2186, change: 11.31, isPositive: true, category: ['Hot', 'Layer 1/2'] },
    { id: 'avalanche-2', pair: 'AVAX/USDT', name: 'Avalanche', amount: 7.66, change: 8.39, isPositive: true, category: ['Hot', 'Layer 1/2'] },
    { id: 'binancecoin', pair: 'BNB/USDT', name: 'BNB', amount: 680.66, change: 5.23, isPositive: true, category: ['Hot', 'Turnover', 'Layer 1/2'] },
    { id: 'bitcoin', pair: 'BTC/USDT', name: 'Bitcoin', amount: 77676.48, change: 7.50, isPositive: true, category: ['Hot', 'Turnover', 'Layer 1/2'] },
    { id: 'dogecoin', pair: 'DOGE/USDT', name: 'Dogecoin', amount: 0.0847, change: 6.50, isPositive: true, category: ['Hot', 'Meme'] },
    { id: 'polkadot', pair: 'DOT/USDT', name: 'Polkadot', amount: 0.8977, change: 7.89, isPositive: true, category: ['Hot', 'Layer 1/2'] },
    { id: 'ethereum', pair: 'ETH/USDT', name: 'Ethereum', amount: 2398.10, change: 4.57, isPositive: true, category: ['Hot', 'Turnover', 'Layer 1/2'] },
    { id: 'chainlink', pair: 'LINK/USDT', name: 'Chainlink', amount: 11.59, change: 12.51, isPositive: true, category: ['Hot', 'DeFi'] },
    { id: 'solana', pair: 'SOL/USDT', name: 'Solana', amount: 92.87, change: 9.56, isPositive: true, category: ['Hot', 'Turnover', 'Layer 1/2'] },
    { id: 'ripple', pair: 'XRP/USDT', name: 'XRP', amount: 1.41, change: 14.14, isPositive: true, category: ['Hot', 'Turnover'] },
    { id: 'pepe', pair: 'PEPE/USDT', name: 'Pepe', amount: 0.0000089, change: 18.42, isPositive: true, category: ['Meme', 'Gainers'] },
    { id: 'shiba-inu', pair: 'SHIB/USDT', name: 'Shiba Inu', amount: 0.0000174, change: 4.12, isPositive: true, category: ['Meme'] },
    { id: 'sui', pair: 'SUI/USDT', name: 'Sui', amount: 1.84, change: 15.68, isPositive: true, category: ['Hot', 'Layer 1/2'] },
    { id: 'near', pair: 'NEAR/USDT', name: 'Near Protocol', amount: 3.42, change: 8.91, isPositive: true, category: ['Layer 1/2'] },
    { id: 'uniswap', pair: 'UNI/USDT', name: 'Uniswap', amount: 7.85, change: 3.84, isPositive: true, category: ['DeFi'] },
    { id: 'aave', pair: 'AAVE/USDT', name: 'Aave', amount: 142.30, change: 10.15, isPositive: true, category: ['DeFi'] },
    { id: 'injective-protocol', pair: 'INJ/USDT', name: 'Injective', amount: 18.90, change: -2.45, isPositive: false, category: ['DeFi', 'Losers'] },
    { id: 'arbitrum', pair: 'ARB/USDT', name: 'Arbitrum', amount: 0.542, change: -4.18, isPositive: false, category: ['Layer 1/2', 'Losers'] },
    { id: 'optimism', pair: 'OP/USDT', name: 'Optimism', amount: 1.35, change: -3.85, isPositive: false, category: ['Layer 1/2', 'Losers'] },
    { id: 'litecoin', pair: 'LTC/USDT', name: 'Litecoin', amount: 72.40, change: -1.20, isPositive: false, category: ['Turnover', 'Losers'] },
  ]);

  // Fetch real market rates from CoinGecko API on mount and every 30s
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        const ids = marketData.map((m) => m.id).join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) return;
        const data = await res.json();
        setMarketData((prev) =>
          prev.map((item) => {
            if (data[item.id] && data[item.id].usd !== undefined) {
              const newAmount = data[item.id].usd;
              const newChange = data[item.id].usd_24h_change || item.change;
              return {
                ...item,
                amount: newAmount,
                change: parseFloat(newChange.toFixed(2)),
                isPositive: newChange >= 0,
              };
            }
            return item;
          })
        );
      } catch (e) {
        // Fallback silently if offline
      }
    };

    fetchRealPrices();
    const fetchInterval = setInterval(fetchRealPrices, 30000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Live order-book fluctuation animation every 1.8 seconds across all crypto pairs simultaneously
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => {
          // Dynamic fluctuation between -0.25% and +0.25% for every pair
          const deltaPercent = (Math.random() * 0.5 - 0.245) / 100;
          const oldAmount = item.amount;
          let newAmount = oldAmount * (1 + deltaPercent);

          if (newAmount < 1) {
            newAmount = parseFloat(newAmount.toFixed(4));
          } else {
            newAmount = parseFloat(newAmount.toFixed(2));
          }

          const isUp = newAmount >= oldAmount;
          const changeDiff = Math.random() * 0.08 - 0.035;
          const newChange = parseFloat((item.change + changeDiff).toFixed(2));

          return {
            ...item,
            amount: newAmount,
            change: newChange,
            isPositive: newChange >= 0,
            tickDir: isUp ? 'up' : 'down',
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const getFilteredMarketData = () => {
    let list = [...marketData];
    if (marketTab === 'Gainers') {
      return list.sort((a, b) => b.change - a.change);
    } else if (marketTab === 'Losers') {
      return list.sort((a, b) => a.change - b.change);
    } else if (marketTab === 'Turnover') {
      return list.sort((a, b) => b.amount - a.amount);
    } else if (marketTab === 'Hot') {
      return list.filter((item) => item.category.includes('Hot'));
    } else {
      return list.filter((item) => item.category.includes(marketTab));
    }
  };

  const formatPrice = (val) => {
    if (val < 0.001) return `$${val.toFixed(7)}`;
    if (val < 1) return `$${val.toFixed(4)}`;
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const defaultPlansList = [
    { id: 'default-1', title: 'KRYPTEX-BASIC POOL', min_amount: 30, max_amount: 9999, daily_return_percent: 7.5, duration_days: 20, capital_return: true },
    { id: 'default-2', title: 'KRYPTEX-PRO POOL', min_amount: 100, max_amount: 25000, daily_return_percent: 12.5, duration_days: 30, capital_return: true },
    { id: 'default-3', title: 'KRYPTEX-VIP POOL', min_amount: 500, max_amount: 100000, daily_return_percent: 18.0, duration_days: 45, capital_return: true },
  ];

  const availablePlans = dbPlans.length > 0 ? dbPlans : defaultPlansList;
  const activeCalcPlan = availablePlans.find((p) => p.id === selectedPlan || p.title === selectedPlan) || availablePlans[0];

  const calculateReturn = () => {
    const plan = activeCalcPlan;
    const days = plan?.duration_days || 30;
    const ratePercent = parseFloat(plan?.daily_return_percent || 1.5);
    const rate = ratePercent / 100;
    const amount = Math.max(0, parseFloat(calcAmount || 0));

    const simpleProfit = amount * rate * days;
    const compoundingTotal = amount * Math.pow(1 + rate, days);
    const compoundingProfit = compoundingTotal - amount;
    const compoundingBonus = Math.max(0, compoundingProfit - simpleProfit);

    if (isCompounding) {
      return {
        ratePercent: ratePercent.toFixed(1),
        days,
        isCompounding: true,
        profit: compoundingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        total: compoundingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        compoundingBonus: compoundingBonus.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };
    } else {
      const totalReturn = amount + simpleProfit;
      return {
        ratePercent: ratePercent.toFixed(1),
        days,
        isCompounding: false,
        profit: simpleProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        total: totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        compoundingBonus: '0.00',
      };
    }
  };

  // Dynamic API state for plans, market activity, announcements, partners, why choose us, and contact links
  const [dynamicPlans, setDynamicPlans] = useState([]);
  const [dynamicHowItWorks, setDynamicHowItWorks] = useState([]);
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState([]);
  const [dynamicPartners, setDynamicPartners] = useState([]);
  const [dynamicWhyChooseUs, setDynamicWhyChooseUs] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/1234567890');

  useEffect(() => {
    // Fetch live plans
    api
      .get('/staking/plans')
      .then((res) => {
        if (res.data.success && res.data.plans?.length > 0) {
          setDynamicPlans(res.data.plans.slice(0, 3));
        }
      })
      .catch(() => null);

    // Fetch live How It Works steps
    api
      .get('/public/how-it-works')
      .then((res) => {
        if (res.data.success && res.data.steps?.length > 0) {
          setDynamicHowItWorks(res.data.steps);
        }
      })
      .catch(() => null);

    // Fetch live Testimonials
    api
      .get('/public/testimonials')
      .then((res) => {
        if (res.data.success && res.data.testimonials?.length > 0) {
          setDynamicTestimonials(res.data.testimonials);
        }
      })
      .catch(() => null);

    // Fetch live Announcements
    api
      .get('/public/announcements')
      .then((res) => {
        if (res.data.success && res.data.announcements?.length > 0) {
          setDynamicAnnouncements(res.data.announcements);
        }
      })
      .catch(() => null);

    // Fetch live Partners
    api
      .get('/public/partners')
      .then((res) => {
        if (res.data.success && res.data.partners?.length > 0) {
          setDynamicPartners(res.data.partners);
        }
      })
      .catch(() => null);

    // Fetch live Why Choose Us
    api
      .get('/public/why-choose-us')
      .then((res) => {
        if (res.data.success && res.data.items?.length > 0) {
          setDynamicWhyChooseUs(res.data.items);
        }
      })
      .catch(() => null);

    // Fetch live Contact links
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data.success && res.data.contactLinks?.whatsappSupport) {
          setWhatsappLink(res.data.contactLinks.whatsappSupport);
        }
      })
      .catch(() => null);
  }, []);

  const calcRes = calculateReturn();

  const faqs = [
    {
      q: 'Why Should I Trust EverStake?',
      a: `EverStake is built around transparency, security, reliability, and a user-first approach. Our platform is designed to provide a structured and accessible environment for digital-asset staking, supported by secure infrastructure and established operational procedures.

Where applicable, digital assets are protected through security controls such as multi-signature authorization, secure wallet infrastructure, and automated blockchain-based processes. We maintain a strong focus on protecting user assets, maintaining platform integrity, and providing clear information about our staking services and applicable terms.`,
    },
    {
      q: 'How Do I Start Staking?',
      a: `Getting started with EverStake is straightforward:

1. Fund your account by making a supported cryptocurrency deposit.
2. Select your preferred staking plan from the available options.
3. Review the plan details, including the staking period, reward rate, and applicable conditions.
4. Confirm your staking position to activate the selected plan.

Once successfully activated, your staking position will operate according to the terms applicable to the selected plan.`,
    },
    {
      q: 'What Is EverStake’s Mission and Vision?',
      a: `Our Mission

Our mission is to make digital-asset staking more accessible by providing users with a structured, transparent, and technology-driven platform for participating in blockchain-based financial opportunities.

Our Vision

Our vision is to contribute to the evolution of digital finance by developing reliable staking infrastructure and creating accessible solutions that enable individuals and institutions to participate in the growing blockchain economy.`,
    },
    {
      q: 'How Do I Deposit Funds?',
      a: `Depositing funds into your EverStake account is simple:

1. Log in securely to your EverStake account.
2. Navigate to the Deposit section.
3. Select your preferred supported cryptocurrency and network.
4. Copy the deposit address provided by EverStake.
5. Send the desired amount from your external wallet or exchange.
6. Wait for the required blockchain confirmations.
7. Once the transaction has been successfully confirmed and processed, the funds will appear in your EverStake account.

Supported networks and assets may include USDT (BEP20/TRC20), BTC, and ETH, subject to current platform availability.

Always verify the asset, blockchain network, and receiving address before confirming a transaction. Sending an asset through an unsupported network or to an incorrect address may result in permanent loss of funds.`,
    },
    {
      q: 'How Do I Withdraw My Funds?',
      a: `Withdrawing funds from EverStake is designed to be simple and straightforward:

1. Log in securely to your EverStake account.
2. Navigate to the Withdraw section on your dashboard.
3. Select the cryptocurrency and supported network you wish to use.
4. Enter the destination wallet address and withdrawal amount.
5. Carefully review the transaction details, including the asset, network, wallet address, and applicable fees.
6. Confirm your withdrawal request and complete any required security verification.
7. Once approved and processed, the funds will be sent to the wallet address you provided.

Withdrawal processing times may vary depending on blockchain network conditions, required confirmations, security checks, and the applicable asset.

Important: Always verify that the destination wallet address and selected network are correct before confirming your withdrawal. Cryptocurrency transactions may be irreversible, and EverStake may be unable to recover assets sent to an incorrect or unsupported address.`,
    },
  ];

  const testimonials = [
    {
      quote:
        'Their crypto staking options are top-notch. I love how easy it is to diversify and earn daily passive returns without dealing with manual yield calculations.',
      name: 'Liam O’Connor',
      country: 'Ireland',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'I started with USDT and Bitcoin staking through EverStake, and the returns have been solid. Their platform makes crypto yield investing straightforward for beginners.',
      name: 'Sofia Martinez',
      country: 'Spain',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'EverStake’s automated withdrawal and daily payout system helped me fund my business opportunities quickly and safely. The process is fast, transparent, and professional.',
      name: 'Rahul Kumar',
      country: 'India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'The security features and transparent audit reporting gave me complete confidence to stake larger amounts. Customer support responded in minutes when I had questions.',
      name: 'Elena Rostova',
      country: 'Germany',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'I’ve tried multiple crypto yield platforms, but EverStake is by far the most reliable. Automated daily compounding increased my monthly staking rewards significantly.',
      name: 'David Chen',
      country: 'Singapore',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'Instant deposits and guaranteed capital returns make this protocol stand out. The dashboard user interface is clean, intuitive, and extremely easy to navigate.',
      name: 'Amara Okafor',
      country: 'Nigeria',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#07193b] text-slate-100 flex flex-col font-sans">
      {/* Header Navigation */}
      <HeaderNav />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#07193b] via-[#092552] to-[#051430] border-b border-white/10">
        {/* Subtle Background Grid Line Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column (span 7) */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left pt-2">
              {/* Outlined Headline Title */}
              <h1 className="font-righteous text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide leading-[1.18] text-stroke-white select-none">
                Explore Staking<br />Opportunities
              </h1>

              {/* Subtext Paragraph */}
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                Unlock the potential of your assets with our comprehensive staking opportunities. Dive into the world of secure staking solutions and harness the power of passive income generation. Our platform offers a range of options tailored to your investment goals, providing stability and growth for your portfolio
              </p>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/register" className="btn-stakelab px-8 py-3.5 text-base w-full sm:w-44 text-center font-bold shadow-lg shadow-red-500/20 flex items-center justify-center">
                  Get Started
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stakelab-outline px-8 py-3.5 text-base w-full sm:w-44 text-center font-bold bg-[#07193b]/60 flex items-center justify-center cursor-pointer"
                >
                  Get Support
                </a>
              </div>

              {/* Members Banner Counter Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center -space-x-3">
                  <div className="w-11 h-11 rounded-full border-2 border-[#ff0044] overflow-hidden bg-slate-800">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Member" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#ff0044] overflow-hidden bg-slate-800">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Member" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#ff0044] overflow-hidden bg-slate-800">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Member" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#ff0044] bg-white flex items-center justify-center text-[#ff0044] font-extrabold text-lg shadow-md">
                    +
                  </div>
                </div>
                <div className="text-left pl-2">
                  <h3 className="text-2xl font-black text-[#ff0044]">20M Members</h3>
                  <p className="text-xs text-slate-300 font-medium">World Wide Investment</p>
                </div>
              </div>
            </div>

            {/* Right Banner Illustration Column with 2 Animated Coins (span 5) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-md flex items-center justify-center">
                {/* Floating Coin 1 (Adjusted to neck level & moved right) */}
                <img
                  src="/images/hero-coin1.png"
                  alt="Floating Bitcoin Coin 1"
                  className="absolute top-28 sm:top-32 left-8 sm:left-14 w-16 sm:w-20 z-20 animate-bounce duration-1000 filter drop-shadow-xl"
                />

                {/* Floating Coin 2 (Right Animation) */}
                <img
                  src="/images/hero-coin2.png"
                  alt="Floating Bitcoin Coin 2"
                  className="absolute top-12 -right-4 w-16 sm:w-20 z-20 animate-bounce duration-1000 delay-300 filter drop-shadow-xl"
                />

                {/* Main Hero Illustration (Sitting Person with Laptop & Red Arch) */}
                <img
                  src="/images/hero-banner.png"
                  alt="StakeLab Staking Hero Illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl relative z-10 hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-20 border-b border-[#1c243f]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Official ViserLab StakeLab About Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg p-2 flex items-center justify-center">
                <img
                  src="/images/about-img.png"
                  alt="About StakeLab Wallet & Crypto Staking"
                  className="w-full h-auto object-contain max-h-[480px] drop-shadow-2xl hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0044]/10 text-[#ff0044] text-xs font-bold uppercase">
                About EverStake
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                About <span className="text-gradient-stakelab">Us</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                EverStake is a global, institutional-grade digital asset staking infrastructure provider focused on making blockchain participation secure, reliable, and accessible.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Founded in 2018 by a team of blockchain engineers, EverStake operates non-custodial validators across more than 130 Proof-of-Stake (PoS) blockchain networks, supporting the security and decentralization of leading blockchain ecosystems. Today, the infrastructure secures more than $7 billion in staked assets on behalf of over 1.6 million retail and institutional users worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STAKING INVESTMENT PLANS SECTION */}
      <section id="plans" className="py-20 border-b border-[#1c243f] bg-[#090d16]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Stake <span className="text-gradient-stakelab">Investment Plan</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Grow your digital assets through a structured staking strategy designed for reliability, sustainable rewards, and long-term financial growth.
            </p>
          </div>

          {/* Tier Selection Tabs (Centered & Full Width on Mobile) */}
          <div className="flex justify-center items-center gap-3 mb-10 w-full sm:w-auto max-w-md mx-auto">
            {['Flexible Tier', 'Dynamic Tier'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTier(tab)}
                aria-pressed={activeTier === tab}
                className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-righteous text-xs sm:text-sm uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer select-none ${
                  activeTier === tab
                    ? 'bg-gradient-to-r from-[#fe500b] to-[#ff0044] text-white shadow-red-500/30 scale-[1.02] sm:scale-105'
                    : 'bg-[#0a1835] hover:bg-[#12244a] border border-[#182848] text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
            {(displayPlans.length > 0
              ? displayPlans
              : [
                  { title: 'KRYPTEX-BASIC POOL', min_amount: 30, max_amount: 9999, daily_return_percent: 7.5, duration_days: 20, capital_return: true },
                  { title: 'KRYPTEX-PRO POOL', min_amount: 100, max_amount: 25000, daily_return_percent: 12.5, duration_days: 30, capital_return: true },
                  { title: 'KRYPTEX-VIP POOL', min_amount: 500, max_amount: 100000, daily_return_percent: 18.0, duration_days: 45, capital_return: true },
                ]
            ).map((plan, idx) => {
              const minAmt = parseFloat(plan.min_amount || 0);
              const maxAmt = parseFloat(plan.max_amount || 0);
              const dailyReturn = parseFloat(plan.daily_return_percent || 0);
              const days = plan.duration_days || 30;

              return (
                <div key={idx} className="relative group flex flex-col max-w-sm sm:max-w-none mx-auto w-full">
                  {/* Outer Gradient Border Wrap with Pointed Shield Bottom */}
                  <div
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                    }}
                    className="p-[2px] bg-gradient-to-b from-slate-800 via-[#ff0044] to-[#fe780b] rounded-t-3xl flex-1 flex flex-col drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                  >
                    {/* Inner Dark Card Body */}
                    <div
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                      }}
                      className="w-full bg-[#0c1424] rounded-t-3xl pt-5 sm:pt-8 pb-10 sm:pb-16 px-4 sm:px-8 text-slate-100 flex-1 flex flex-col justify-between relative"
                    >
                      {/* Top Header Plan Title */}
                      <div>
                        <h3 className="font-righteous text-xl sm:text-3xl font-extrabold text-white text-center tracking-wide uppercase">
                          {plan.title}
                        </h3>

                        {/* Overhanging Gradient Ribbon Banner (Middle Header) */}
                        <div className="relative my-4 sm:my-6 -mx-4 sm:-mx-8">
                          <div className="bg-gradient-to-r from-[#fe500b] via-[#ff0044] to-[#fe880b] text-white font-righteous text-xs sm:text-base font-bold py-2 sm:py-3 text-center shadow-lg tracking-wide uppercase">
                            Stake for {days} Days
                          </div>
                          <div className="absolute -left-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-l-[8px] border-l-transparent" />
                          <div className="absolute -right-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-r-[8px] border-r-transparent" />
                        </div>

                        {/* Features List (Exact Match to /staking/create) */}
                        <div className="space-y-2.5 sm:space-y-4 my-4 sm:my-8 font-sans">
                          <div className="flex justify-between items-center text-xs sm:text-base border-b border-slate-800/80 pb-2 sm:pb-2.5">
                            <span className="text-slate-400 font-semibold">Minimum Staking</span>
                            <span className="font-bold text-white font-mono">${minAmt.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs sm:text-base border-b border-slate-800/80 pb-2 sm:pb-2.5">
                            <span className="text-slate-400 font-semibold">Maximum Staking</span>
                            <span className="font-bold text-white font-mono">${maxAmt.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs sm:text-base border-b border-slate-800/80 pb-2 sm:pb-2.5">
                            <span className="text-slate-400 font-semibold">Daily Profits rate</span>
                            <span className="font-bold text-emerald-400 font-mono text-xs sm:text-lg">{dailyReturn.toFixed(1)}% Daily</span>
                          </div>

                          <div className="flex justify-between items-center text-xs sm:text-base border-b border-slate-800/80 pb-2 sm:pb-2.5">
                            <span className="text-slate-400 font-semibold">Compounding rate</span>
                            <span className="font-bold text-emerald-400 font-mono text-xs sm:text-lg">{dailyReturn.toFixed(1)}%</span>
                          </div>

                          <div className="flex justify-between items-center text-xs sm:text-base border-b border-slate-800/80 pb-2 sm:pb-2.5">
                            <span className="text-slate-400 font-semibold">Capital Return</span>
                            <span className={`font-bold ${plan.capital_return !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {plan.capital_return !== false ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stake Button */}
                      <div className="pt-2 text-center">
                        <Link
                          href="/staking/create"
                          className="w-full btn-stakelab py-4 rounded-xl text-white font-sans text-base sm:text-lg tracking-wider font-extrabold transition-all shadow-xl shadow-red-500/25 cursor-pointer block"
                        >
                          Stake
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE STAKING CALCULATOR */}
      <section id="calculator" className="py-20 border-b border-[#1c243f]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Staking Profit Calculator</h2>
            <p className="text-slate-400 text-sm mt-2">Select a plan and input your deposit amount to estimate your exact returns.</p>
          </div>

          <div className="stakelab-card p-8 rounded-3xl border border-[#1c243f] grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Staking Plan
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePlans.map((p) => {
                    const isSelected = activeCalcPlan?.id === p.id || activeCalcPlan?.title === p.title;
                    return (
                      <button
                        key={p.id || p.title}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(p.id || p.title);
                          const minVal = parseFloat(p.min_amount || 30);
                          setCalcAmount(minVal);
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold font-sans border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#fe500b] to-[#ff0044] text-white border-transparent shadow-lg shadow-red-500/20'
                            : 'bg-[#0b0f19] border-[#1c243f] text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {p.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Deposit Amount (USDT $)
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full bg-[#0b0f19] border border-[#1c243f] rounded-xl py-3 px-4 text-white font-bold text-lg focus:border-[#ff0044] focus:outline-none"
                />
              </div>

              {/* Compounding Return Mode Toggle Switch */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Yield Calculation Method
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#0b0f19] p-1.5 rounded-xl border border-[#1c243f]">
                  <button
                    type="button"
                    onClick={() => setIsCompounding(true)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCompounding
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Compounding Yield
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCompounding(false)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      !isCompounding
                        ? 'bg-[#1c243f] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Simple Return
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f19] p-6 rounded-2xl border border-[#1c243f] flex flex-col justify-between space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                  <span className="text-slate-400">Lockup Period</span>
                  <span className="font-bold text-white">{calcRes.days} Days</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                  <span className="text-slate-400">Daily Return Rate (r)</span>
                  <span className="font-bold text-emerald-400">{calcRes.ratePercent}% Daily</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                  <span className="text-slate-400">Yield Strategy</span>
                  <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded-full border ${
                    calcRes.isCompounding
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {calcRes.isCompounding ? 'Daily Compounding FV = PV(1+r)ⁿ' : 'Simple Non-Compounding'}
                  </span>
                </div>
                {calcRes.isCompounding && (
                  <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                    <span className="text-slate-400">Compounding Growth Bonus</span>
                    <span className="font-bold text-amber-400">+${calcRes.compoundingBonus}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                  <span className="text-slate-400">Net Estimated Profit</span>
                  <span className="font-bold text-emerald-400">+${calcRes.profit}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1c243f] flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400">Total Final Return (FV)</span>
                  <div className="text-2xl font-black text-white">${calcRes.total}</div>
                </div>
                <Link href="/register" className="btn-stakelab px-6 py-2.5 text-xs font-bold">
                  Stake Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE STAKELAB SECTION */}
      <section className="py-20 border-b border-[#1c243f] bg-[#090d16]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Choose <span className="text-gradient-stakelab">EverStake</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Discover the advantages of our investment plan and see what you will get from us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(dynamicWhyChooseUs.length > 0
              ? dynamicWhyChooseUs
              : [
                  {
                    title: 'Money Security',
                    desc: 'We provide highest secure transaction, deposit and withdrawal process for your security.',
                    icon: 'ShieldCheck',
                  },
                  {
                    title: 'Fast Withdraw',
                    desc: 'Our withdrawal process is very fast. Any stakeholders can withdraw anytime from our system.',
                    icon: 'Zap',
                  },
                  {
                    title: 'Automated Earning',
                    desc: 'Stakeholders earning is automated, while they stake money the get their profit automatically.',
                    icon: 'TrendingUp',
                  },
                  {
                    title: 'Profitable Plan',
                    desc: 'All of our plans are designed to be profitable for stakeholders, allowing them to earn money in a short period.',
                    icon: 'Coins',
                  },
                  {
                    title: '24/7 Customer Support',
                    desc: "Our 24/7 customer support ensures you're always assisted, no matter the time or issue.",
                    icon: 'Headphones',
                  },
                  {
                    title: 'User-Friendly Interface',
                    desc: 'We offer a user-friendly interface, making it easy for anyone to navigate and manage their investments easily.',
                    icon: 'Users',
                  },
                ]
            ).map((item, idx) => {
              const iconMap = {
                ShieldCheck,
                Zap,
                TrendingUp,
                Coins,
                Headphones,
                Users,
                Smartphone,
                Lock,
                Award,
                Shield,
                DollarSign,
                Wallet,
                Star,
              };
              const Icon = iconMap[item.icon] || ShieldCheck;
              return (
                <div key={idx} className="stakelab-card p-8 rounded-3xl border border-[#1c243f] space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. REFERRAL COMMISSION SECTION */}
      <section id="referral" className="py-24 border-b border-[#1c243f] relative overflow-hidden bg-[#07142d]">
        {/* Right Vertical Outlined Side Text */}
        {/* <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block select-none pointer-events-none z-0">
          <div className="[writing-mode:vertical-lr] font-righteous text-6xl lg:text-7xl font-extrabold tracking-widest text-transparent text-stroke-white opacity-10 uppercase">
            REFERRAL COMMISSION
          </div>
        </div> */}

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Official ViserLab StakeLab Referral Illustration */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg flex items-center justify-center p-2">
                <img
                  src="/images/referral-tree.png"
                  alt="Referral Commission Money Tree"
                  className="w-full h-auto object-contain max-h-[500px] drop-shadow-2xl hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: Heading & Level Cards */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-righteous leading-tight">
                  Earn Through <span className="text-gradient-stakelab">Referrals!</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
                  Expand your network and unlock additional rewards through the EverStake Referral Program. Invite others to discover our staking services and earn commissions in accordance with our referral program terms.
                </p>
              </div>

              {/* 3 Tier Level Cards */}
              <div className="space-y-5 pt-2">
                {refRates.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full max-w-lg p-[1.5px] bg-gradient-to-r from-[#fe780b] to-[#ff0044] rounded-full shadow-xl transition-transform duration-300 hover:scale-[1.01] group"
                  >
                    <div className="w-full bg-[#081329] rounded-full flex items-center justify-between p-1.5 pr-8 sm:pr-10">
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Left Circular Red Badge with Animated Rotating Dashed Ring */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#ff0044] via-[#fe500b] to-[#fe880b] p-3 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30 relative overflow-hidden group-hover:scale-105 transition-transform">
                          {/* Rotating Dashed Border Ring */}
                          <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-white/90 animate-spin-slow pointer-events-none" />

                          {/* Official Sprout Icon Asset */}
                          <img
                            src={item.icon}
                            alt={item.level}
                            className="w-9 h-9 sm:w-11 sm:h-11 object-contain relative z-10 filter drop-shadow-md"
                          />
                        </div>

                        {/* Level Title */}
                        <span className="font-righteous text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {item.level}
                        </span>
                      </div>

                      {/* Percentage Rate */}
                      <span className="font-righteous text-3xl sm:text-4xl font-extrabold text-[#ff0044] tracking-tight">
                        {item.rate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 border-b border-[#1c243f] relative overflow-hidden bg-[#060e20]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-righteous">
              How It <span className="text-gradient-stakelab">Works!</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
              We’ve simplified the staking process into four straightforward steps, making it easy to participate in digital asset staking with EverStake.
            </p>
          </div>

          {/* 4 Professional Institutional Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch relative">
            {(dynamicHowItWorks.length > 0
              ? dynamicHowItWorks
              : [
                  {
                    num: '01',
                    title: 'Create Your Account',
                    desc: 'Register your EverStake account and complete the required verification steps.',
                    icon: 'UserPlus',
                  },
                  {
                    num: '02',
                    title: 'Fund Your Wallet',
                    desc: 'Deposit your eligible digital assets into your EverStake wallet.',
                    icon: 'Wallet',
                  },
                  {
                    num: '03',
                    title: 'Start Staking',
                    desc: 'Select an available staking option and allocate your assets according to your chosen plan. Where supported, staking rewards can be automatically reinvested to facilitate compounding.',
                    icon: 'Coins',
                  },
                  {
                    num: '04',
                    title: 'Withdraw Your Assets',
                    badge: 'When eligible',
                    desc: 'Request a withdrawal and transfer your available assets to your preferred wallet or exchange, subject to applicable network and platform conditions.',
                    icon: 'ArrowDownLeft',
                  },
                ]
            ).map((step, idx) => {
              const iconsList = [UserPlus, Wallet, Coins, ArrowDownLeft];
              const FallbackIcon = iconsList[idx] || UserPlus;

              return (
                <div
                  key={idx}
                  className="relative bg-[#09152e]/90 backdrop-blur-xl border border-[#1a2d59] hover:border-[#ff0044] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 group"
                >
                  {/* Top Row: Glowing Step Number Badge & Optional Badge Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff0044] via-[#fe500b] to-[#fe880b] p-[1.5px] shadow-lg shadow-red-500/20">
                        <div className="w-full h-full bg-[#081226] rounded-2xl flex items-center justify-center font-righteous text-white font-extrabold text-lg">
                          {step.num || `0${idx + 1}`}
                        </div>
                      </div>
                      {step.badge && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {step.badge}
                        </span>
                      )}
                    </div>

                    {/* Step Icon Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fe500b] to-[#ff0044] p-3 flex items-center justify-center text-white shadow-xl shadow-red-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon && typeof step.icon === 'string' && step.icon.startsWith('/') ? (
                        <img src={step.icon} alt={step.title} className="w-full h-full object-contain filter drop-shadow-md" />
                      ) : (
                        <FallbackIcon className="w-7 h-7 text-white" />
                      )}
                    </div>

                    {/* Step Title */}
                    <h3 className="font-righteous text-lg sm:text-xl font-bold text-white mb-3 tracking-wide group-hover:text-[#fe780b] transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS MOVING CAROUSEL SECTION */}
      <section id="testimonials" className="py-20 border-b border-[#1c243f] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#ff0044] tracking-widest uppercase block">
              WHAT THEY SAY ABOUT US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Real Stories. Real Impact. <span className="text-gradient-stakelab">Real Results.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              At EverStake, we're proud of the trust our stakers place in us and the results we've helped them achieve. From first-time investors to seasoned crypto traders, our community spans individuals across the globe who are building smarter, stronger financial futures with us.
            </p>
          </div>

          {/* Moving Carousel Container */}
          <div className="relative">
            {/* Active Moving Card View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch transition-all duration-500">
              {[0, 1, 2].map((offset) => {
                const activeList = dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonials;
                const itemIndex = (activeSlide + offset) % activeList.length;
                const item = activeList[itemIndex];
                return (
                  <div key={itemIndex} className="flex flex-col items-center justify-between text-center space-y-6 transition-all duration-500 transform">
                    {/* Speech Bubble Card */}
                    <div className="stakelab-card p-8 rounded-md border border-[#1c243f] bg-[#13192b] relative space-y-6 w-full flex-1 shadow-xl flex flex-col justify-between">
                      {/* Quote Badge Icon */}
                      <div className="w-12 h-12 rounded-full bg-[#ff0044]/10 border border-[#ff0044]/30 text-[#ff0044] mx-auto flex items-center justify-center shadow-md">
                        <Quote className="w-6 h-6 stroke-[2.5]" />
                      </div>

                      {/* Quote Paragraph */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal italic">
                        "{item.quote}"
                      </p>

                      {/* 5-Star Rating */}
                      <div className="flex items-center justify-center space-x-1 pt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Speech Card Bottom Pointer Tail */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#13192b] border-r border-b border-[#1c243f] rotate-45 pointer-events-none" />
                    </div>

                    {/* User Avatar & Info */}
                    <div className="pt-2 flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 rounded-full border-2 border-[#ff0044] overflow-hidden shadow-lg">
                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <h4 className="text-base font-bold text-white tracking-wide pt-1">{item.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">{item.country}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Pagination Dots */}
            <div className="flex justify-center items-center space-x-2 pt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-8 bg-[#ff0044]'
                      : 'w-2.5 bg-[#1c243f] hover:bg-slate-500'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIVE CRYPTO MARKET TICKER SECTION (Matching Reference Screenshots 1 & 2) */}
      <section id="market" className="py-20 border-b border-[#1c243f] bg-[#071126]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-righteous">
              Live Crypto <span className="text-gradient-stakelab">Market Rates</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Real-time cryptocurrency price updates, order-book fluctuations, and 24h market trends.
            </p>
          </div>

          {/* Market Category Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 justify-start overflow-x-auto pb-2 no-scrollbar">
            {['Hot', 'Gainers', 'Losers', 'Turnover', 'Layer 1/2', 'DeFi', 'Meme'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMarketTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  marketTab === tab
                    ? 'bg-[#0f1d3a] border-amber-500/80 text-amber-400 font-righteous shadow-lg shadow-amber-500/10'
                    : 'bg-[#0b162c] border-[#182848] text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Live Crypto Prices Card Table Container */}
          <div className="bg-[#0b152a] rounded-2xl border border-[#182848] p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#182848] text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">PAIR</th>
                    <th className="py-3 px-4 text-center">AMOUNT</th>
                    <th className="py-3 px-4 text-right">24H CHANGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182848]/60 font-sans">
                  {getFilteredMarketData().map((row) => {
                    const isUpTick = row.tickDir === 'up';

                    return (
                      <tr
                        key={row.pair}
                        className="hover:bg-[#0f1d3c]/80 transition-colors"
                      >
                        <td className="py-4 px-4 font-black text-white font-righteous tracking-wide">
                          <div className="flex items-center gap-2">
                            <span>{row.pair}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-normal">({row.name})</span>
                          </div>
                        </td>
                        <td
                          className={`py-4 px-4 text-center font-extrabold font-mono transition-colors duration-300 ${
                            isUpTick ? 'text-[#10b981]' : 'text-[#ff4d4d]'
                          }`}
                        >
                          {formatPrice(row.amount)}
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-extrabold font-mono transition-colors duration-300 ${
                            row.isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {row.isPositive ? `↑ +${Math.abs(row.change).toFixed(2)}%` : `↓ -${Math.abs(row.change).toFixed(2)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SUPPORTED EXCHANGE PARTNERS SECTION (Continuous Moving Infinite Marquee - No Border Box) */}
      <section id="partners" className="py-16 border-b border-[#1c243f] bg-[#050c1c] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mb-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-white font-righteous">
              Supported <span className="text-gradient-stakelab">Exchange Partners</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              We collaborate with top-tier global cryptocurrency exchanges and liquidity providers.
            </p>
          </div>
        </div>

        {/* Infinite Moving Marquee Container (No Border Containers, Real Color Logos) */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Gradient Edge Masks for Smooth Fade In/Out */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050c1c] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050c1c] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-scroll flex items-center gap-10 sm:gap-16">
            {[
              {
                name: 'Binance',
                color: '#F0B90B',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#F0B90B">
                    <path d="M12 2L6.5 7.5L9.3 10.3L12 7.6L14.7 10.3L17.5 7.5L12 2ZM2 12L7.5 6.5L10.3 9.3L7.6 12L10.3 14.7L7.5 17.5L2 12ZM12 22L17.5 16.5L14.7 13.7L12 16.4L9.3 13.7L6.5 16.5L12 22ZM22 12L16.5 17.5L13.7 14.7L16.4 12L13.7 9.3L16.5 6.5L22 12ZM12 10.1L13.9 12L12 13.9L10.1 12L12 10.1Z" />
                  </svg>
                ),
              },
              {
                name: 'Bybit',
                color: '#F7A600',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#17181E" />
                    <path d="M6 7H13.5C15.5 7 17 8.5 17 10.5C17 12 16 13.2 14.6 13.7C16.3 14.2 17.5 15.6 17.5 17.3C17.5 19.4 15.8 21 13.6 21H6V7Z" fill="#F7A600" />
                  </svg>
                ),
              },
              {
                name: 'MEXC',
                color: '#00B897',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#00B897">
                    <path d="M3 18L7.5 7L12 14L16.5 7L21 18H17L14.5 11.5L12 15.5L9.5 11.5L7 18H3Z" />
                  </svg>
                ),
              },
              {
                name: 'HTX',
                color: '#007AFF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#007AFF">
                    <path d="M6 4V20H9.5V13.5H14.5V20H18V4H14.5V10.5H9.5V4H6Z" />
                  </svg>
                ),
              },
              {
                name: 'OKX',
                color: '#FFFFFF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#FFFFFF">
                    <rect x="3" y="3" width="6" height="6" rx="1" />
                    <rect x="15" y="3" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                    <rect x="3" y="15" width="6" height="6" rx="1" />
                    <rect x="15" y="15" width="6" height="6" rx="1" />
                  </svg>
                ),
              },
              {
                name: 'BingX',
                color: '#0052FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0052FF">
                    <path d="M4 4L12 12L4 20H8.5L14.25 14.25L20 20H20.5L12.5 12L20 4H15.5L9.75 9.75L4 4Z" />
                  </svg>
                ),
              },
              {
                name: 'Kraken',
                color: '#5741D9',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#5741D9">
                    <path d="M12 2C7.03 2 3 6.03 3 11C3 15.97 7.03 20 12 20C13.5 20 14.8 19.6 16 18.9V22H19V16.5C20.9 15 22 12.6 22 10C22 5.58 17.52 2 12 2ZM10.5 13.5C9.67 13.5 9 12.83 9 12C9 11.17 9.67 10.5 10.5 10.5C11.33 10.5 12 11.17 12 12C12 12.83 11.33 13.5 10.5 13.5Z" />
                  </svg>
                ),
              },
              {
                name: 'Luno',
                color: '#0027BD',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0027BD">
                    <circle cx="12" cy="12" r="9" fill="#0027BD" />
                    <path d="M8 8L16 12L8 16V8Z" fill="#FFFFFF" />
                  </svg>
                ),
              },
              {
                name: 'Coinbase',
                color: '#0052FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0052FF">
                    <circle cx="12" cy="12" r="10" />
                    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#071126" />
                  </svg>
                ),
              },
              {
                name: 'KuCoin',
                color: '#24AD7F',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#24AD7F">
                    <path d="M4 4V20H8V13L15 20H20L12 12L20 4H15L8 11V4H4Z" />
                  </svg>
                ),
              },
              {
                name: 'Bitget',
                color: '#00F0FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#00F0FF">
                    <path d="M4 8L12 4L20 8L12 12L4 8ZM4 16L12 12L20 16L12 20L4 16Z" />
                  </svg>
                ),
              },
              {
                name: 'Gate.io',
                color: '#FF4D4D',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#FF4D4D">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12H12V2Z" />
                  </svg>
                ),
              },
              // Duplicate set for seamless continuous marquee loop
              {
                name: 'Binance',
                color: '#F0B90B',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#F0B90B">
                    <path d="M12 2L6.5 7.5L9.3 10.3L12 7.6L14.7 10.3L17.5 7.5L12 2ZM2 12L7.5 6.5L10.3 9.3L7.6 12L10.3 14.7L7.5 17.5L2 12ZM12 22L17.5 16.5L14.7 13.7L12 16.4L9.3 13.7L6.5 16.5L12 22ZM22 12L16.5 17.5L13.7 14.7L16.4 12L13.7 9.3L16.5 6.5L22 12ZM12 10.1L13.9 12L12 13.9L10.1 12L12 10.1Z" />
                  </svg>
                ),
              },
              {
                name: 'Bybit',
                color: '#F7A600',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#17181E" />
                    <path d="M6 7H13.5C15.5 7 17 8.5 17 10.5C17 12 16 13.2 14.6 13.7C16.3 14.2 17.5 15.6 17.5 17.3C17.5 19.4 15.8 21 13.6 21H6V7Z" fill="#F7A600" />
                  </svg>
                ),
              },
              {
                name: 'MEXC',
                color: '#00B897',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#00B897">
                    <path d="M3 18L7.5 7L12 14L16.5 7L21 18H17L14.5 11.5L12 15.5L9.5 11.5L7 18H3Z" />
                  </svg>
                ),
              },
              {
                name: 'HTX',
                color: '#007AFF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#007AFF">
                    <path d="M6 4V20H9.5V13.5H14.5V20H18V4H14.5V10.5H9.5V4H6Z" />
                  </svg>
                ),
              },
              {
                name: 'OKX',
                color: '#FFFFFF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#FFFFFF">
                    <rect x="3" y="3" width="6" height="6" rx="1" />
                    <rect x="15" y="3" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                    <rect x="3" y="15" width="6" height="6" rx="1" />
                    <rect x="15" y="15" width="6" height="6" rx="1" />
                  </svg>
                ),
              },
              {
                name: 'BingX',
                color: '#0052FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0052FF">
                    <path d="M4 4L12 12L4 20H8.5L14.25 14.25L20 20H20.5L12.5 12L20 4H15.5L9.75 9.75L4 4Z" />
                  </svg>
                ),
              },
              {
                name: 'Kraken',
                color: '#5741D9',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#5741D9">
                    <path d="M12 2C7.03 2 3 6.03 3 11C3 15.97 7.03 20 12 20C13.5 20 14.8 19.6 16 18.9V22H19V16.5C20.9 15 22 12.6 22 10C22 5.58 17.52 2 12 2ZM10.5 13.5C9.67 13.5 9 12.83 9 12C9 11.17 9.67 10.5 10.5 10.5C11.33 10.5 12 11.17 12 12C12 12.83 11.33 13.5 10.5 13.5Z" />
                  </svg>
                ),
              },
              {
                name: 'Luno',
                color: '#0027BD',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0027BD">
                    <circle cx="12" cy="12" r="9" fill="#0027BD" />
                    <path d="M8 8L16 12L8 16V8Z" fill="#FFFFFF" />
                  </svg>
                ),
              },
              {
                name: 'Coinbase',
                color: '#0052FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#0052FF">
                    <circle cx="12" cy="12" r="10" />
                    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#071126" />
                  </svg>
                ),
              },
              {
                name: 'KuCoin',
                color: '#24AD7F',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#24AD7F">
                    <path d="M4 4V20H8V13L15 20H20L12 12L20 4H15L8 11V4H4Z" />
                  </svg>
                ),
              },
              {
                name: 'Bitget',
                color: '#00F0FF',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#00F0FF">
                    <path d="M4 8L12 4L20 8L12 12L4 8ZM4 16L12 12L20 16L12 20L4 16Z" />
                  </svg>
                ),
              },
              {
                name: 'Gate.io',
                color: '#FF4D4D',
                logo: (
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="#FF4D4D">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12H12V2Z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all shrink-0 cursor-pointer group"
              >
                {item.logo}
                <span className="font-righteous text-base font-bold text-white tracking-wide group-hover:text-slate-200">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="faq" className="py-20 border-b border-[#1c243f]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-white">
              Frequently Asked <span className="text-gradient-stakelab">Questions (FAQs)</span>
            </h2>
            <p className="text-slate-300 text-sm">Explore Common Queries in Our FAQ Section</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`stakelab-card rounded-md border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#ff0044]/60 bg-[#13192b] shadow-lg shadow-red-500/10'
                      : 'border-[#1c243f] bg-[#0d1322] hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-6 text-left text-white flex justify-between items-center text-base sm:text-lg gap-4"
                  >
                    <span className="font-semibold text-slate-100">{faq.q}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#ff0044] text-white shadow-md shadow-red-500/30'
                          : 'bg-[#1c243f] text-slate-300 hover:bg-[#253154]'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-300 text-sm border-t border-[#1c243f]/80 pt-4 leading-relaxed bg-[#0f1526]/50 whitespace-pre-line space-y-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. LATEST ANNOUNCEMENTS SECTION (Dynamic API Synced) */}
      <section id="blog" className="py-20 border-b border-[#1c243f]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Latest <span className="text-gradient-stakelab">Announcements</span>
            </h2>
            <p className="text-slate-300 text-sm">
              Explore the Latest Trends, Tips, and Analysis in Our Blog
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(dynamicAnnouncements.length > 0
              ? dynamicAnnouncements
              : [
                  {
                    date: '18 March, 2024',
                    title: 'Planning for Retirement: Strategies for a Secure Future',
                    desc: 'Crypto currencies are sets of software protocols for generating digital tokens and tracking transactions to build long-term wealth.',
                    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    date: '18 March, 2024',
                    title: "Demystifying Cryptocurrency: A Beginner's Guide",
                    desc: "Invest in the world's leading digital assets and proof-of-stake networks with automated yield generation and high security.",
                    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    date: '18 March, 2024',
                    title: 'Maximizing Yield Returns with Stakelab Proof-of-Stake',
                    desc: 'Discover advanced staking pool allocation strategies designed for consistent high-yield earnings and asset protection.',
                    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
                  },
                ]
            ).map((blog, idx) => (
              <div
                key={idx}
                className="stakelab-card p-5 rounded-md border border-[#1c243f] flex flex-col justify-between group hover:border-[#ff0044]/50 transition-all duration-300 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-full h-48 rounded-md overflow-hidden bg-slate-800">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#ff0044] block">
                      {blog.date}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff0044] transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {blog.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1c243f]/60">
                  <a
                    href="#"
                    className="text-xs font-bold text-[#ff0044] hover:underline uppercase flex items-center gap-1 tracking-wider"
                  >
                    SEE MORE <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 12. CTA BANNER SECTION */}
      <section className="py-20 border-b border-[#1c243f]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="stakelab-card p-8 sm:p-12 lg:p-16 rounded-md bg-gradient-to-r from-[#07193b] via-[#0b2554] to-[#05122b] border border-[#ff0044]/30 shadow-2xl relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Heading & Subtitle */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff0044]/10 border border-[#ff0044]/30 text-[#ff0044] text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044]"></span> READY TO STAKE?
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  Combine high yields, security and <span className="text-gradient-stakelab">staking technology.</span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Join over 20M+ stakers leveraging automated daily yield payouts, multi-sig capital security, and transparent crypto growth protocols.
                </p>
              </div>

              {/* Right Column: CTA Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-stretch lg:items-end">
                <Link
                  href="/register"
                  className="btn-stakelab px-8 py-3.5 text-sm font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 rounded-md w-full sm:w-48 lg:w-48"
                >
                  Sign Up Now <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#contact"
                  className="btn-stakelab-outline px-8 py-3.5 text-sm font-bold text-center bg-[#07193b]/60 rounded-md w-full sm:w-48 lg:w-48 flex items-center justify-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER AREA */}
      <footer id="contact" className="relative bg-gradient-to-r from-[#051430] via-[#09224f] to-[#041026] text-slate-200 pt-20 border-t border-[#132c5e]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Col 1: Logo & Desc (span 3) */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                  <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  Stake<span className="text-[#ff0044]">Lab</span>
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal pt-2">
                Explore our latest updates, investment opportunities, and educational resources. Join our community for valuable insights and support on your journey to financial empowerment.
              </p>
            </div>

            {/* Spacer 1 (span 1) */}
            <div className="hidden md:block md:col-span-1"></div>

            {/* Col 2: Useful Link (span 2) */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <h5 className="text-lg font-bold text-white">Useful Link</h5>
                <span className="block w-6 h-[2px] bg-[#ff0044] mt-1.5"></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200 pt-2">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> About
                  </a>
                </li>
                <li>
                  <a href="#plans" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Policy Pages (span 2) */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <h5 className="text-lg font-bold text-white">Policy Pages</h5>
                <span className="block w-6 h-[2px] bg-[#ff0044] mt-1.5"></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200 pt-2">
                <li>
                  <Link href="/privacy-policy" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/staking-policy" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Staking Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Spacer 2 (span 1) */}
            <div className="hidden md:block md:col-span-1"></div>

            {/* Col 4: Contact Us (span 3) */}
            <div className="md:col-span-3 space-y-3">
              <div>
                <h5 className="text-lg font-bold text-white">Contact Us</h5>
                <span className="block w-6 h-[2px] bg-[#ff0044] mt-1.5"></span>
              </div>
              <ul className="space-y-4 text-sm text-slate-200 pt-2">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#ff0044] shrink-0 mt-0.5" />
                  <span className="leading-snug">15205 North Kierland Blvd.100</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#ff0044] shrink-0" />
                  <span>demo@site.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#ff0044] shrink-0" />
                  <span>+1 91145434343</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="bg-[#050b17] py-5 border-t border-[#132448] text-center text-sm text-slate-200 relative">
          <p>© Copyright 2026 | <span className="text-[#ff0044] font-bold">EverStake</span> All rights reserved</p>

          {/* Floating Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-xl shadow-red-500/40 hover:scale-110 transition-all z-50"
            title="Scroll to Top"
          >
            <ChevronsUp className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </footer>
    </div>
  );
}
