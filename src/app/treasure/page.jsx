'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Key, Gift, Info, Send, Wallet, History, ArrowRight, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

import TelegramModal from '../../components/TelegramModal';

export default function LuckyTreasurePage() {
  const { user, refreshUser } = useAuth();
  const [giftCode, setGiftCode] = useState('');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(true);
  const [claimedModalData, setClaimedModalData] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/gift-code-claims');
      if (res.data && res.data.success) {
        setClaims(res.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to load user gift claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();

    // Fetch dynamic Telegram support/channel URL
    api
      .get('/public/contact-links')
      .then((res) => {
        if (res.data && res.data.success && res.data.contactLinks) {
          const l = res.data.contactLinks;
          if (l.telegramSupport) setTelegramUrl(l.telegramSupport);
          else if (l.telegramChannel) setTelegramUrl(l.telegramChannel);
        }
      })
      .catch(() => null);
  }, []);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!giftCode.trim()) {
      toast.error('Please enter a valid gift code.');
      return;
    }

    try {
      setClaiming(true);
      const res = await api.post('/user/claim-gift-code', { code: giftCode.trim() });
      if (res.data && res.data.success) {
        const rewardAmt = res.data.amount || res.data.giftCode?.amount || 100.00;
        setClaimedModalData({ amount: rewardAmt, code: giftCode.trim() });
        setGiftCode('');
        fetchClaims();
        if (refreshUser) refreshUser();

        // Auto close after 3 seconds
        setTimeout(() => {
          setClaimedModalData(null);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim gift code.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
        {/* Header Hero Section */}
        <div className="bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white font-righteous text-3xl shadow-lg shadow-red-500/20">
            💎
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
            Lucky Treasure
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Redeem your unique voucher & gift bonus codes to claim instant cash rewards added directly to your account balance!
          </p>
        </div>

        {/* Claim Gift Code Card */}
        <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Ticket className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white font-righteous tracking-wide">
              Enter Gift Voucher Code
            </h2>
          </div>

          <form onSubmit={handleClaim} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                placeholder="Enter code e.g. EVERSTAKE50..."
                className="w-full bg-[#061127] border border-[#1e3463] rounded-xl py-3.5 pl-10 pr-4 text-xs font-mono font-bold text-white placeholder:text-slate-500 outline-none focus:border-[#fe780b] focus:ring-1 focus:ring-[#fe780b] transition-all"
                disabled={claiming}
              />
            </div>

            <button
              type="submit"
              disabled={claiming || !giftCode.trim()}
              className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {claiming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Gift className="w-4 h-4" /> Claim Reward
                </>
              )}
            </button>
          </form>
        </div>

        {/* How It Works Steps Grid */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 px-1">
            <Info className="w-4 h-4 text-[#fe780b]" />
            <h3 className="font-bold text-white text-sm font-righteous">How It Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div
              onClick={() => setIsTelegramModalOpen(true)}
              className="bg-[#0a1835] border border-[#1e3463] hover:border-[#fe780b] p-4 rounded-xl flex flex-col items-center text-center transition-all group cursor-pointer shadow-md"
            >
              <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 mb-2 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">1. Get Gift Code</p>
              <p className="text-[11px] text-slate-400 mt-1">Get codes from official Telegram & promo announcements</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0a1835] border border-[#1e3463] p-4 rounded-xl flex flex-col items-center text-center shadow-md">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-2">
                <Ticket className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">2. Enter Unique Code</p>
              <p className="text-[11px] text-slate-400 mt-1">Type or paste your code into the form field above</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0a1835] border border-[#1e3463] p-4 rounded-xl flex flex-col items-center text-center shadow-md">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-2">
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">3. Instant Reward</p>
              <p className="text-[11px] text-slate-400 mt-1">Bonus cash is credited directly to your balance</p>
            </div>
          </div>
        </div>

        {/* Recent Redemptions Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-[#fe780b]" />
              <h3 className="font-bold text-white text-sm font-righteous">Your Claimed Rewards</h3>
            </div>
            <Link
              href="/dashboard"
              className="text-xs text-[#fe780b] hover:underline flex items-center gap-1 font-semibold"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="py-12 flex items-center justify-center text-slate-400 text-xs font-semibold gap-2">
                <span>Loading redemptions</span>
                <Loader2 className="w-5 h-5 animate-spin text-[#fe780b]" />
              </div>
            ) : claims.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                  <Gift className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 font-semibold">No gift code redemptions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1e3463]/60">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-4 flex items-center justify-between hover:bg-[#0f2147] transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white">{claim.code}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(claim.claimed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-400 font-righteous">
                        +${parseFloat(claim.amount).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                        CLAIMED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TelegramModal isOpen={isTelegramModalOpen} setIsOpen={setIsTelegramModalOpen} />

      {/* Celebratory Gift Code Claim Success Modal (Matching Reference Image) */}
      {claimedModalData && (
        <div
          onClick={() => setClaimedModalData(null)}
          className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-[#09152e] border border-[#1d335f] rounded-3xl p-6 sm:p-8 shadow-2xl text-center font-sans space-y-5 animate-in zoom-in-95 duration-200 cursor-default"
          >
            {/* Close Button (X) */}
            <button
              type="button"
              onClick={() => setClaimedModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Circle with Celebratory Gift Popper */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-[0_0_35px_rgba(56,189,248,0.5)] text-3xl transform hover:scale-105 transition-transform">
              🎁
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-righteous tracking-wide flex items-center justify-center gap-2">
                🎉 Gift Code Claimed!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Congratulations! Your bonus has been claimed.
              </p>
            </div>

            {/* Bonus Credit Added Container (Exact Match to Screenshot) */}
            <div className="bg-[#050e24] border border-[#1d335f] rounded-2xl p-4 sm:p-5 text-center space-y-1 shadow-inner">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest block font-sans">
                BONUS CREDIT ADDED
              </span>
              <div className="text-2xl sm:text-3xl font-black font-righteous text-sky-400 tracking-tight">
                + ${parseFloat(claimedModalData.amount || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </UserSidebarLayout>
  );
}
