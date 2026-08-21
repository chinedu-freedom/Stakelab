'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  // Calculator state
  const [calcAmount, setCalcAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('silver');
  const [isCompounding, setIsCompounding] = useState(true);

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState(0);

  const calculateReturn = () => {
    let rate = 0.015; // 1.5% daily
    let days = 30;
    if (selectedPlan === 'silver') {
      days = 30;
      rate = calcAmount >= 251 ? 0.025 : calcAmount >= 101 ? 0.020 : 0.015;
    } else if (selectedPlan === 'golden') {
      days = 90;
      rate = calcAmount >= 2001 ? 0.035 : calcAmount >= 501 ? 0.030 : 0.025;
    } else if (selectedPlan === 'platinum') {
      days = 180;
      rate = calcAmount >= 5001 ? 0.050 : calcAmount >= 1001 ? 0.040 : 0.035;
    }

    if (isCompounding) {
      // Compounding Interest: FV = PV * (1 + r)^n
      const fv = calcAmount * Math.pow(1 + rate, days);
      const compoundProfit = fv - calcAmount;
      const simpleProfit = calcAmount * rate * days;
      const compoundingBonus = compoundProfit - simpleProfit;

      return {
        ratePercent: (rate * 100).toFixed(1),
        days,
        isCompounding: true,
        profit: compoundProfit.toFixed(2),
        total: fv.toFixed(2),
        simpleProfit: simpleProfit.toFixed(2),
        compoundingBonus: compoundingBonus.toFixed(2),
      };
    } else {
      // Non-compounding Simple Profit: P * r * n
      const profit = calcAmount * rate * days;
      return {
        ratePercent: (rate * 100).toFixed(1),
        days,
        isCompounding: false,
        profit: profit.toFixed(2),
        total: (calcAmount + profit).toFixed(2),
        simpleProfit: profit.toFixed(2),
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
  const [marketTab, setMarketTab] = useState('Hot');

  useEffect(() => {
    // Fetch live plans
    api
      .get('/staking/plans')
      .then((res) => {
        if (res.data.success && res.data.plans?.length > 0) {
          setDynamicPlans(res.data.plans);
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
      q: 'Why should I trust Stakelab?',
      a: 'At Stakelab, we prioritize transparency, security, and customer satisfaction above all else. All stakers assets are backed by multi-sig cold storage and automated smart contract yield execution.',
    },
    {
      q: 'How do I start staking?',
      a: 'Deposit First, convert your USDT to any wallet currency. Select a staking plan from Silver, Golden, or Platinum. Then complete your stake instantly.',
    },
    {
      q: 'What is our Mission and Vision?',
      a: 'Our mission is to democratize access to financial opportunities and empower individuals to build wealth through innovative technologies and transparent investment solutions. Our vision is to revolutionize wealth accumulation worldwide.',
    },
    {
      q: 'How do I deposit money?',
      a: 'Start by logging in to your Stakelab account. Navigate to the Deposit section, select your preferred crypto network (USDT BEP20/TRC20, BTC, ETH), enter deposit amount, and confirm transfer.',
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
        'I started with USDT and Bitcoin staking through StakeLab, and the returns have been solid. Their platform makes crypto yield investing straightforward for beginners.',
      name: 'Sofia Martinez',
      country: 'Spain',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    },
    {
      quote:
        'StakeLab’s automated withdrawal and daily payout system helped me fund my business opportunities quickly and safely. The process is fast, transparent, and professional.',
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
        'I’ve tried multiple crypto yield platforms, but StakeLab is by far the most reliable. Automated daily compounding increased my monthly staking rewards significantly.',
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
                  Contact Support
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
                About StakeLab
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                About <span className="text-gradient-stakelab">Us</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                We are an international financial company engaged in investment activities, which are related to trading on financial markets and cryptocurrency exchanges performed by qualified professional traders.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our goal is to provide our investors with a reliable source of high income, while minimizing any possible risks and offering a high-quality service, allowing us to automate and simplify the relations between the investors and the trustees. We work towards increasing your profit margin by profitable investment.
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
            <p className="text-slate-400 text-sm">
              Secure your future by discovering the benefits of our stake investment plan, designed to build wealth and ensure financial stability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
            {(dynamicPlans.length > 0
              ? dynamicPlans.map((p) => ({
                  name: p.title || p.name,
                  duration: `Stake for ${p.duration_days || p.days || 30} Days`,
                  status: p.status,
                  isAvailable: p.is_active !== false && p.status !== 'Unavailable',
                  rates: p.tiers || [
                    { range: `${p.min_amount || 10}.00-${p.max_amount || 1000}.00`, interest: `${p.daily_return_percent || 15}%` },
                  ],
                }))
              : [
                  {
                    name: 'Silver',
                    duration: 'Stake for 30 Days',
                    isAvailable: true,
                    rates: [
                      { range: '10.00-100.00', interest: '15%' },
                      { range: '101.00-250.00', interest: '30%' },
                      { range: '251.00-500.00', interest: '50%' },
                    ],
                  },
                  {
                    name: 'Golden',
                    duration: 'Stake for 90 Days',
                    isAvailable: true,
                    rates: [
                      { range: '50.00-500.00', interest: '20%' },
                      { range: '501.00-2,000.00', interest: '40%' },
                      { range: '2,001.00-5,000.00', interest: '60%' },
                    ],
                  },
                  {
                    name: 'Platinum',
                    duration: 'Stake for 180 Days',
                    isAvailable: true,
                    rates: [
                      { range: '100.00-1,000.00', interest: '40%' },
                      { range: '1,001.00-5,000.00', interest: '50%' },
                      { range: '5,001.00-20,000.00', interest: '70%' },
                    ],
                  },
                ]
            ).map((plan, idx) => (
              <div key={idx} className="relative group flex flex-col">
                {/* Outer Gradient Border Wrap with Pointed Shield Bottom */}
                <div
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                  }}
                  className="p-[2px] bg-gradient-to-b from-slate-800 via-[#ff0044] to-[#fe780b] rounded-t-3xl flex-1 flex flex-col drop-shadow-2xl"
                >
                  {/* Inner Dark Card Body */}
                  <div
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
                    }}
                    className="w-full bg-[#0c1424] rounded-t-3xl pt-8 pb-16 px-6 sm:px-8 text-slate-100 flex-1 flex flex-col justify-between relative"
                  >
                    {/* Top Header Plan Title */}
                    <div>
                      <h3 className="font-righteous text-3xl sm:text-4xl font-extrabold text-white text-center tracking-wide">
                        {plan.name}
                      </h3>

                      {/* Overhanging Gradient Ribbon Banner (Middle Header) */}
                      <div className="relative my-6 -mx-6 sm:-mx-8">
                        {/* Ribbon Body */}
                        <div className="bg-gradient-to-r from-[#fe500b] via-[#ff0044] to-[#fe880b] text-white font-righteous text-lg sm:text-xl font-bold py-3 text-center shadow-lg tracking-wide">
                          {plan.duration}
                        </div>
                        {/* Left Ribbon Fold Triangle */}
                        <div className="absolute -left-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-l-[8px] border-l-transparent" />
                        {/* Right Ribbon Fold Triangle */}
                        <div className="absolute -right-2 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#a3002b] border-r-[8px] border-r-transparent" />
                      </div>

                      {/* Range & Interest Rates Table */}
                      <div className="space-y-4 pt-2">
                        {/* Table Header */}
                        <div className="flex justify-between items-center text-slate-300 text-sm font-semibold pb-2 border-b border-[#1c2844]">
                          <span>Range</span>
                          <span>Interest</span>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-3">
                          {plan.rates.map((row, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex justify-between items-center text-sm sm:text-base pb-2.5 border-b border-[#18233c] last:border-b-0"
                            >
                              <div className="font-semibold text-slate-200">
                                <span className="text-[#ff0044] font-bold mr-0.5">₮</span>
                                {row.range}
                              </div>
                              <span className="font-bold text-white tracking-wide">{row.interest}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button: Stake Now or Unavailable (Matching Reference Screenshot) */}
                    <div className="pt-8 text-center">
                      {!plan.isAvailable ? (
                        <button
                          disabled
                          className="w-full max-w-[200px] mx-auto py-3.5 text-center text-xs font-bold block bg-slate-700/80 text-slate-400 rounded-md font-righteous uppercase tracking-wider cursor-not-allowed border border-slate-600/50 shadow-md"
                        >
                          Unavailable
                        </button>
                      ) : (
                        <Link
                          href="/register"
                          className="btn-stakelab w-full max-w-[200px] mx-auto py-3.5 text-center text-sm font-bold block shadow-lg shadow-red-500/30 rounded-md font-righteous uppercase tracking-wider hover:scale-105 transition-transform"
                        >
                          Stake Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                <div className="grid grid-cols-3 gap-2">
                  {['silver', 'golden', 'platinum'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlan(p)}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${selectedPlan === p
                          ? 'bg-brand-gradient text-white border-transparent'
                          : 'bg-[#0b0f19] border-[#1c243f] text-slate-400 hover:text-white'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Deposit Amount (USDT ₮)
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
                    <span className="font-bold text-amber-400">+₮{calcRes.compoundingBonus}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-[#1c243f]">
                  <span className="text-slate-400">Net Estimated Profit</span>
                  <span className="font-bold text-emerald-400">+₮{calcRes.profit}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1c243f] flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400">Total Final Return (FV)</span>
                  <div className="text-2xl font-black text-white">₮{calcRes.total}</div>
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
              Why Choose <span className="text-gradient-stakelab">StakeLab</span>
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
                  Earn Money Through <span className="text-white">Referrals</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
                  Grow your wealth with others by exploring our rewarding referral commission program.
                </p>
              </div>

              {/* 3 Tier Level Cards */}
              <div className="space-y-5 pt-2">
                {[
                  {
                    level: 'Level 01',
                    rate: '60%',
                    icon: '/images/ref-level1.png',
                  },
                  {
                    level: 'Level 02',
                    rate: '40%',
                    icon: '/images/ref-level2.png',
                  },
                  {
                    level: 'Level 03',
                    rate: '20%',
                    icon: '/images/ref-level3.png',
                  },
                ].map((item, idx) => (
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
      <section id="how-it-works" className="pt-24 pb-32 border-b border-[#1c243f] relative overflow-hidden bg-[#07132b]">
        {/* Left Vertical Outlined Side Text */}
        {/* <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:block select-none pointer-events-none z-0">
          <div className="[writing-mode:vertical-lr] rotate-180 font-righteous text-6xl lg:text-7xl font-extrabold tracking-widest text-transparent text-stroke-white opacity-10 uppercase">
            HOW IT WORKS
          </div>
        </div> */}

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          {/* Header */}
          <div className="max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-righteous">
              How It <span className="text-white">Works</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              We've simplified the staking process into four simple steps, making it easy and hassle-free to stake with us.
            </p>
          </div>

          {/* 4 Capsule Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {(dynamicHowItWorks.length > 0
              ? dynamicHowItWorks
              : [
                  {
                    num: '1',
                    title: 'Sign Up Account',
                    desc: 'First, you need to sign up for our system.',
                    icon: '/images/step1.png',
                  },
                  {
                    num: '2',
                    title: 'Deposit',
                    desc: 'Then deposit to your wallet.',
                    icon: '/images/step2.png',
                  },
                  {
                    num: '3',
                    title: 'Stake',
                    desc: 'Purchase plan and stake money as per your plan.',
                    icon: '/images/step3.png',
                  },
                  {
                    num: '4',
                    title: 'Withdraw Money',
                    desc: 'Finally, you can withdraw your money.',
                    icon: '/images/step4.png',
                  },
                ]
            ).map((step, idx) => {
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    idx % 2 === 1 ? 'lg:translate-y-20' : ''
                  }`}
                >
                  {/* Top Large Outlined Number */}
                  <span className="font-righteous text-6xl text-transparent text-stroke-white opacity-40 font-bold block mb-4">
                    {step.num}
                  </span>

                  {/* Capsule Card Container */}
                  <div
                    style={{ borderRadius: '9999px' }}
                    className="w-full max-w-[200px] mx-auto bg-[#0d1e3d] border border-[#1b3464] hover:border-[#ff0044]/70 pt-8 pb-14 px-6 text-center flex flex-col items-center shadow-2xl transition-all duration-300 group"
                  >
                    {/* Vibrant Orange-Red Gradient Circle */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff0044] via-[#fe500b] to-[#fe880b] p-5 flex items-center justify-center shadow-xl shadow-red-500/30 mb-8 group-hover:scale-105 transition-transform duration-300">
                      <img src={step.icon} alt={step.title} className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>

                    {/* Step Title */}
                    <h3 className="font-righteous text-xl font-bold text-white mb-3 tracking-wide">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-[180px]">
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
              At StakeLab, we're proud of the trust our stakers place in us and the results we've helped them achieve. From first-time investors to seasoned crypto traders, our community spans individuals across the globe who are building smarter, stronger financial futures with us.
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
              Real-time cryptocurrency price updates and 24h market trends across top global pairs.
            </p>
          </div>

          {/* Market Category Filter Tabs (Hot, Gainers, Losers, Turnover) */}
          <div className="flex items-center gap-2 mb-6 justify-start overflow-x-auto pb-2">
            {['Hot', 'Gainers', 'Losers', 'Turnover'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMarketTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  marketTab === tab
                    ? 'bg-[#0f1d3a] border-amber-500/80 text-amber-400 font-righteous shadow-md'
                    : 'bg-[#0b162c] border-[#182848] text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Live Crypto Prices Card Table Container (Matching Screenshots 1 & 2) */}
          <div className="bg-[#0b152a] rounded-2xl border border-[#182848] p-6 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#182848] text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">PAIR</th>
                  <th className="py-3 px-4 text-center">AMOUNT</th>
                  <th className="py-3 px-4 text-right">CHANGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182848]/60 font-sans">
                {[
                  { pair: 'ADA/USDT', amount: '$0.2186', change: '+11.31%', positive: true },
                  { pair: 'AVAX/USDT', amount: '$7.66', change: '+8.39%', positive: true },
                  { pair: 'BNB/USDT', amount: '$680.66', change: '+5.23%', positive: true },
                  { pair: 'BTC/USDT', amount: '$77,676.48', change: '+7.50%', positive: true },
                  { pair: 'DOGE/USDT', amount: '$0.0847', change: '+6.50%', positive: true },
                  { pair: 'DOT/USDT', amount: '$0.8977', change: '+7.89%', positive: true },
                  { pair: 'ETH/USDT', amount: '$2,398.10', change: '+4.57%', positive: true },
                  { pair: 'LINK/USDT', amount: '$11.59', change: '+9.06%', positive: true },
                  { pair: 'SOL/USDT', amount: '$91.87', change: '+5.56%', positive: true },
                  { pair: 'XRP/USDT', amount: '$1.41', change: '+12.14%', positive: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0f1d3c]/80 transition-colors">
                    <td className="py-4 px-4 font-black text-white font-righteous tracking-wide">{row.pair}</td>
                    <td className="py-4 px-4 text-center font-extrabold text-[#ff4d4d] font-mono">{row.amount}</td>
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-400 font-mono">
                      ↑ {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. SUPPORTED EXCHANGE PARTNERS SECTION (Matching Reference Screenshot 3) */}
      <section id="partners" className="py-16 border-b border-[#1c243f] bg-[#050c1c]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-white font-righteous">
              Supported <span className="text-gradient-stakelab">Exchange Partners</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              We collaborate with top-tier global cryptocurrency exchanges and liquidity providers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
            {(dynamicPartners.length > 0
              ? dynamicPartners
              : [
                  { name: 'Binance', logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', status: 'ACTIVE' },
                  { name: 'Bybit', logo: 'https://cryptologos.cc/logos/bybit-logo.png', status: 'ACTIVE' },
                  { name: 'Mexc', logo: 'https://cryptologos.cc/logos/mexc-logo.png', status: 'ACTIVE' },
                  { name: 'HTX', logo: 'https://cryptologos.cc/logos/htx-logo.png', status: 'ACTIVE' },
                  { name: 'OKX', logo: 'https://cryptologos.cc/logos/okx-logo.png', status: 'ACTIVE' },
                  { name: 'BingX', logo: 'https://cryptologos.cc/logos/bingx-logo.png', status: 'ACTIVE' },
                  { name: 'Kraken', logo: 'https://cryptologos.cc/logos/kraken-logo.png', status: 'ACTIVE' },
                  { name: 'Luno', logo: 'https://cryptologos.cc/logos/luno-logo.png', status: 'ACTIVE' },
                ]
            ).map((partner, idx) => (
              <div
                key={idx}
                className="bg-[#0b152a] rounded-2xl border border-[#182848] p-5 flex flex-col items-center justify-between space-y-3 shadow-lg hover:border-slate-500 transition-all group"
              >
                {/* Exchange Logo Square Container */}
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center p-2.5 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
                  <span className="text-white font-black text-xs font-mono">{partner.name.toUpperCase()}</span>
                </div>

                {/* Exchange Name */}
                <h4 className="font-righteous text-sm font-bold text-white tracking-wide">{partner.name}</h4>

                {/* Active Indicator Badge */}
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {partner.status || 'ACTIVE'}
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
                    <div className="px-6 pb-6 text-slate-300 text-sm border-t border-[#1c243f]/80 pt-4 leading-relaxed bg-[#0f1526]/50">
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
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff0044] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0044] inline-block"></span> Staking Policy
                  </a>
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
          <p>© Copyright 2026 | <span className="text-[#ff0044] font-bold">StakeLab</span> All rights reserved</p>

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
