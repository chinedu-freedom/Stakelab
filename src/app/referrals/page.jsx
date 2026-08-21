'use client';

import { useState, useEffect } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Copy, Check, QrCode, Users, Award, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralsList, setReferralsList] = useState([]);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Generate Referral Link
  const refCode = user?.username || user?.referral_code || 'Sparko';
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?reference=${refCode}`
    : `https://script.viserlab.com/stakelab?reference=${refCode}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}&color=ffffff&bgcolor=060f22`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/dashboard');
        if (res.data.success) {
          setReferralCount(res.data.referralCount || 0);
          // If detailed referral list is provided in response
          if (res.data.referrals) {
            setReferralsList(res.data.referrals);
          }
        }
      } catch (err) {
        console.error('Failed to load referral data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, []);

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white font-righteous tracking-wide">
          Referrals
        </h1>

        {/* Free Spin Referral Rule Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-xl p-5 text-slate-200 shadow-xl flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0">
            🎁
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white font-righteous flex items-center gap-2">
              Free Spin Referral Bonus
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              For every friend you invite who registers, completes a deposit, and invests in any staking plan, you will automatically earn <b className="text-amber-400">+1 Lucky Free Spin</b> to win instant crypto prizes!
            </p>
          </div>
        </div>

        {/* Top Referral Link Banner Container (Matching Reference Screenshot) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 shadow-2xl space-y-3">
          <label className="block text-xs font-semibold text-slate-300 font-sans">
            Referral Link
          </label>

          <div className="flex items-center bg-[#060f22] border border-[#182848] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full h-12 bg-transparent border-0 outline-none px-4 text-white text-xs font-mono select-all"
            />

            {/* Red-Orange Gradient Copy Square Button (Exact Match) */}
            <button
              onClick={copyReferralLink}
              type="button"
              className="h-12 w-12 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-all cursor-pointer shadow-md shadow-red-500/20"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>

        {/* Middle Section: QR Code & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QR Code Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-center">
            <h2 className="text-sm font-bold text-white font-righteous flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#ff0044]" /> Scan QR Code
            </h2>
            <div className="p-3 bg-[#060f22] border border-[#182848] rounded-xl shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Referral QR Code"
                className="w-36 h-36 rounded-lg object-contain mx-auto"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Scan to directly open registration with your referral code.
            </p>
          </div>

          {/* Stats Card 1: Total Referrals */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 shadow-xl flex flex-col justify-between hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <Users className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Referred Users</div>
                <div className="text-2xl font-extrabold text-white font-righteous mt-1">
                  {referralCount}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 pt-4 border-t border-[#182848] mt-4">
              Earn lifetime staking commissions from referred stakers.
            </div>
          </div>

          {/* Stats Card 2: Total Referral Earnings */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 shadow-xl flex flex-col justify-between hover:border-red-500/30 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#142345] border border-[#1e325c] flex items-center justify-center text-[#ff0044] shrink-0">
                <Award className="w-5 h-5 text-[#ff0044]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Referral Earnings</div>
                <div className="text-2xl font-extrabold text-white font-righteous mt-1">
                  ₮{parseFloat(user?.total_earned || 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-xs text-emerald-400 pt-4 border-t border-[#182848] mt-4 font-semibold">
              5.00% Commission Rate on Staking Pools
            </div>
          </div>
        </div>

        {/* Referred Users Table Section / Empty State */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white font-righteous">
            My Referral History
          </h2>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading referral history...</div>
          ) : referralsList.length === 0 ? (
            /* Empty State Card */
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0e1d3e] border border-[#1c305c] flex items-center justify-center mb-3">
                <ClipboardList className="w-8 h-8 text-slate-400 stroke-1" />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                No Referred Users Found
              </p>
            </div>
          ) : (
            /* Referred Users Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#182848] text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182848]">
                  {referralsList.map((ref) => (
                    <tr key={ref.id} className="hover:bg-[#0e1d3e]/50 text-slate-200">
                      <td className="py-3 px-4 font-bold text-white">{ref.full_name || ref.username}</td>
                      <td className="py-3 px-4 text-slate-400">{ref.email}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(ref.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-righteous text-emerald-400 text-right">
                        ₮{parseFloat(ref.commission || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
