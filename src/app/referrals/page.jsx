'use client';

import { useState, useEffect } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Copy, Check, QrCode, Users, Award, ClipboardList, UserCheck, DollarSign, ChevronRight, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'level1' | 'level2' | 'level3'
  const [teamStats, setTeamStats] = useState({
    totalTeamMembers: 0,
    teamCommission: 0,
    levels: {
      level1: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
      level2: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
      level3: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
    },
  });

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
        const res = await api.get('/user/referrals').catch(() => null);
        if (res?.data?.success) {
          setTeamStats({
            totalTeamMembers: res.data.totalTeamMembers || 0,
            teamCommission: res.data.teamCommission || 0,
            levels: res.data.levels || teamStats.levels,
          });
        }
      } catch (err) {
        console.error('Failed to load referral details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, []);

  const level1 = teamStats.levels.level1 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };
  const level2 = teamStats.levels.level2 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };
  const level3 = teamStats.levels.level3 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };

  return (
    <UserSidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
          Referrals
        </h1>

        {/* Free Spin Referral Rule Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-xl p-5 text-slate-200 shadow-xl flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0">
            🎁
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              Free Spin Referral Bonus
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              For every friend you invite who registers, completes a deposit, and invests in any staking plan, you will automatically earn <b className="text-amber-400">+1 Lucky Free Spin</b> to win instant crypto prizes!
            </p>
          </div>
        </div>

        {/* Top Referral Link Banner Container */}
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

            {/* Red-Orange Gradient Copy Square Button */}
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

        {/* Top Overview Cards (Matching User Reference Image) */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Total Team Members Card */}
            <div className="bg-[#07132a] border border-[#182848] rounded-xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white shadow-md shadow-red-500/30">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2 font-sans">
                  {teamStats.totalTeamMembers}
                </div>
                <div className="text-xs font-medium text-slate-400 font-sans">
                  Total Team Members
                </div>
              </div>
            </div>

            {/* Team Commission Card */}
            <div className="bg-[#07132a] border border-[#182848] rounded-xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white shadow-md shadow-red-500/30">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2 font-sans">
                  ${teamStats.teamCommission.toFixed(2)}
                </div>
                <div className="text-xs font-medium text-slate-400 font-sans">
                  Team Commission
                </div>
              </div>
            </div>
          </div>

          {/* Level Selection Tabs (Matching Red Pills from Reference Image) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-[#182848]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-sans transition-all shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20'
                  : 'bg-[#07132a] text-slate-400 border border-[#182848] hover:text-white'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setActiveTab('level1')}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-sans transition-all shrink-0 cursor-pointer ${
                activeTab === 'level1'
                  ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20'
                  : 'bg-[#07132a] text-slate-400 border border-[#182848] hover:text-white'
              }`}
            >
              Level 1
            </button>
            <button
              onClick={() => setActiveTab('level2')}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-sans transition-all shrink-0 cursor-pointer ${
                activeTab === 'level2'
                  ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20'
                  : 'bg-[#07132a] text-slate-400 border border-[#182848] hover:text-white'
              }`}
            >
              Level 2
            </button>
            <button
              onClick={() => setActiveTab('level3')}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-sans transition-all shrink-0 cursor-pointer ${
                activeTab === 'level3'
                  ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-md shadow-red-500/20'
                  : 'bg-[#07132a] text-slate-400 border border-[#182848] hover:text-white'
              }`}
            >
              Level 3
            </button>
          </div>

          {/* 3 Level Breakdown Cards Grid (Matching Reference Screenshot 2x2 Layout) */}
          <div className="space-y-6">
            {/* Level 1 Card */}
            {(activeTab === 'all' || activeTab === 'level1') && (
              <div className="bg-[#07132a] border border-[#182848] rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#182848] pb-3">
                  <h3 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff0044]" /> 1 Level (Direct Invites)
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    10.00% Commission
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Total Headcount */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level1.totalHeadcount}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Headcount</div>
                  </div>
                  {/* Number of Active */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level1.numberActive}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Number of Active</div>
                  </div>
                  {/* Total Recharge */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">${level1.totalRecharge.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Recharge</div>
                  </div>
                  {/* Commission */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-emerald-400 font-sans">${level1.commission.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Commission</div>
                  </div>
                </div>

                {/* Level 1 Referred Users Table */}
                {level1.users.length > 0 && (
                  <div className="pt-3 border-t border-[#182848]">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Level 1 Members List</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#08152e] text-slate-400 font-semibold uppercase">
                            <th className="py-2.5 px-3">Member</th>
                            <th className="py-2.5 px-3">Joined Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Recharge</th>
                            <th className="py-2.5 px-3 text-right">Staked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#182848]">
                          {level1.users.map((u) => (
                            <tr key={u.id} className="hover:bg-[#0c1a38]/50 text-slate-200">
                              <td className="py-2.5 px-3 font-bold text-white">
                                {u.username || u.full_name || u.email}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {new Date(u.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {u.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-white">
                                ${u.totalRecharge.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                                ${u.totalStaked.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Level 2 Card */}
            {(activeTab === 'all' || activeTab === 'level2') && (
              <div className="bg-[#07132a] border border-[#182848] rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#182848] pb-3">
                  <h3 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#fe780b]" /> 2 Level (Indirect Level 2)
                  </h3>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    5.00% Commission
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Total Headcount */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level2.totalHeadcount}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Headcount</div>
                  </div>
                  {/* Number of Active */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level2.numberActive}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Number of Active</div>
                  </div>
                  {/* Total Recharge */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">${level2.totalRecharge.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Recharge</div>
                  </div>
                  {/* Commission */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-emerald-400 font-sans">${level2.commission.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Commission</div>
                  </div>
                </div>

                {/* Level 2 Referred Users Table */}
                {level2.users.length > 0 && (
                  <div className="pt-3 border-t border-[#182848]">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Level 2 Members List</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#08152e] text-slate-400 font-semibold uppercase">
                            <th className="py-2.5 px-3">Member</th>
                            <th className="py-2.5 px-3">Joined Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Recharge</th>
                            <th className="py-2.5 px-3 text-right">Staked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#182848]">
                          {level2.users.map((u) => (
                            <tr key={u.id} className="hover:bg-[#0c1a38]/50 text-slate-200">
                              <td className="py-2.5 px-3 font-bold text-white">
                                {u.username || u.full_name || u.email}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {new Date(u.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {u.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-white">
                                ${u.totalRecharge.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                                ${u.totalStaked.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Level 3 Card */}
            {(activeTab === 'all' || activeTab === 'level3') && (
              <div className="bg-[#07132a] border border-[#182848] rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#182848] pb-3">
                  <h3 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> 3 Level (Indirect Level 3)
                  </h3>
                  <span className="text-xs text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    3.00% Commission
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Total Headcount */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level3.totalHeadcount}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Headcount</div>
                  </div>
                  {/* Number of Active */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">{level3.numberActive}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Number of Active</div>
                  </div>
                  {/* Total Recharge */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-white font-sans">${level3.totalRecharge.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total Recharge</div>
                  </div>
                  {/* Commission */}
                  <div className="bg-[#0c1a38] border border-[#18294d] rounded-lg p-3.5 text-center">
                    <div className="text-lg font-bold text-emerald-400 font-sans">${level3.commission.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Commission</div>
                  </div>
                </div>

                {/* Level 3 Referred Users Table */}
                {level3.users.length > 0 && (
                  <div className="pt-3 border-t border-[#182848]">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Level 3 Members List</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#08152e] text-slate-400 font-semibold uppercase">
                            <th className="py-2.5 px-3">Member</th>
                            <th className="py-2.5 px-3">Joined Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Recharge</th>
                            <th className="py-2.5 px-3 text-right">Staked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#182848]">
                          {level3.users.map((u) => (
                            <tr key={u.id} className="hover:bg-[#0c1a38]/50 text-slate-200">
                              <td className="py-2.5 px-3 font-bold text-white">
                                {u.username || u.full_name || u.email}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {new Date(u.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {u.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-white">
                                ${u.totalRecharge.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                                ${u.totalStaked.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* QR Code & Direct Link Details Box */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
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
      </div>
    </UserSidebarLayout>
  );
}
