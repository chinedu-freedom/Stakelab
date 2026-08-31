'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserSidebarLayout from '../../../components/UserSidebarLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { Users, Search, ArrowLeft, Loader2 } from 'lucide-react';

function ReferralMembersContent() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');
  const initialLevel = levelParam ? `level${levelParam}` : 'level1';

  const [activeTab, setActiveTab] = useState(initialLevel); // 'level1' | 'level2' | 'level3' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [teamStats, setTeamStats] = useState({
    totalTeamMembers: 0,
    teamCommission: 0,
    levels: {
      level1: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
      level2: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
      level3: { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] },
    },
  });

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
        console.error('Failed to load referral members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, []);

  const level1 = teamStats.levels.level1 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };
  const level2 = teamStats.levels.level2 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };
  const level3 = teamStats.levels.level3 || { totalHeadcount: 0, numberActive: 0, totalRecharge: 0, commission: 0, users: [] };

  const getDisplayedUsers = () => {
    let list = [];
    if (activeTab === 'level1') {
      list = level1.users.map((u) => ({ ...u, levelName: 'Level 1' }));
    } else if (activeTab === 'level2') {
      list = level2.users.map((u) => ({ ...u, levelName: 'Level 2' }));
    } else if (activeTab === 'level3') {
      list = level3.users.map((u) => ({ ...u, levelName: 'Level 3' }));
    } else {
      list = [
        ...level1.users.map((u) => ({ ...u, levelName: 'Level 1' })),
        ...level2.users.map((u) => ({ ...u, levelName: 'Level 2' })),
        ...level3.users.map((u) => ({ ...u, levelName: 'Level 3' })),
      ];
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((u) =>
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  };

  const displayedUsers = getDisplayedUsers();

  const currentLevelInfo =
    activeTab === 'level1'
      ? { title: 'Level 1 Members', commissionRate: '10.00%', color: 'from-[#ff0044] to-[#fe780b]', stats: level1 }
      : activeTab === 'level2'
      ? { title: 'Level 2 Members', commissionRate: '5.00%', color: 'from-[#fe780b] to-amber-500', stats: level2 }
      : activeTab === 'level3'
      ? { title: 'Level 3 Members', commissionRate: '3.00%', color: 'from-purple-600 to-indigo-500', stats: level3 }
      : { title: 'All Team Members', commissionRate: 'Multi-Level', color: 'from-blue-600 to-cyan-500', stats: { totalHeadcount: teamStats.totalTeamMembers, numberActive: level1.numberActive + level2.numberActive + level3.numberActive, totalRecharge: level1.totalRecharge + level2.totalRecharge + level3.totalRecharge, commission: teamStats.teamCommission } };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage) || 1;
  const paginatedMembers = displayedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/referrals"
              className="w-9 h-9 rounded-xl bg-[#08152e] border border-[#182848] flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
                Team Members List
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Full breakdown of your multi-level referral network
              </p>
            </div>
          </div>
        </div>

        {/* Level Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#07132a] border border-[#142343] rounded-xl">
          <button
            onClick={() => setActiveTab('level1')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'level1'
                ? 'bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white shadow-lg shadow-red-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1a38]'
            }`}
          >
            <span>Level 1</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {level1.users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('level2')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'level2'
                ? 'bg-gradient-to-r from-[#fe780b] to-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1a38]'
            }`}
          >
            <span>Level 2</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {level2.users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('level3')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'level3'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1a38]'
            }`}
          >
            <span>Level 3</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {level3.users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-[#182848] text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1a38]'
            }`}
          >
            <span>All Levels</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {teamStats.totalTeamMembers}
            </span>
          </button>
        </div>

        {/* Level Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#07132a] border border-[#182848] rounded-xl p-4 text-center">
            <div className="text-xl font-black text-white font-righteous">{currentLevelInfo.stats.totalHeadcount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Total Headcount</div>
          </div>

          <div className="bg-[#07132a] border border-[#182848] rounded-xl p-4 text-center">
            <div className="text-xl font-black text-emerald-400 font-righteous">{currentLevelInfo.stats.numberActive}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Active Members</div>
          </div>

          <div className="bg-[#07132a] border border-[#182848] rounded-xl p-4 text-center">
            <div className="text-xl font-black text-white font-righteous">${parseFloat(currentLevelInfo.stats.totalRecharge || 0).toFixed(2)}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Total Recharge</div>
          </div>

          <div className="bg-[#07132a] border border-[#182848] rounded-xl p-4 text-center">
            <div className="text-xl font-black text-amber-400 font-righteous">${parseFloat(currentLevelInfo.stats.commission || 0).toFixed(2)}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Commission Earned</div>
          </div>
        </div>

        {/* Filter / Search Row */}
        <div className="bg-[#07132a] border border-[#182848] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member by username, name or email..."
              className="w-full bg-[#060f22] border border-[#182848] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0044] transition-all"
            />
          </div>

          <div className="text-xs text-slate-400 font-semibold font-mono">
            Showing {displayedUsers.length} member{displayedUsers.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Full Members Table with 10-Item Pagination */}
        {loading ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Loading members list</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#ff0044]" />
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl p-12 text-center shadow-xl space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#08142c] border border-[#182848] flex items-center justify-center text-slate-400 mx-auto">
              <Users className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-sm font-bold text-slate-300 font-sans">
              No Members Found in this Level
            </p>
            <p className="text-xs text-slate-500">
              Share your referral link with friends to grow your team network.
            </p>
          </div>
        ) : (
          <div className="bg-[#0a1835] border border-[#182848] rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-[#07132a] border-b border-[#182848] text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4">Member</th>
                    <th className="py-4 px-4">Level</th>
                    <th className="py-4 px-4">Joined Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Total Recharge</th>
                    <th className="py-4 px-4 text-right">Staked Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#142343]">
                  {paginatedMembers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#0c1a38]/60 text-slate-200 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-xs">{u.username || u.full_name || u.email}</div>
                        {u.full_name && <div className="text-[11px] text-slate-400 font-normal">{u.full_name}</div>}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#142345] text-slate-300 border border-[#1e325c]">
                          {u.levelName || 'Level 1'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(u.created_at || Date.now()).toLocaleString()}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center justify-center ${
                            u.is_active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                          }`}
                        >
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-righteous text-white font-extrabold text-sm whitespace-nowrap">
                        ${parseFloat(u.totalRecharge || 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 text-right font-righteous text-emerald-400 font-extrabold text-sm whitespace-nowrap">
                        ${parseFloat(u.totalStaked || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 10-Item Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-[#07132a] border-t border-[#182848]">
                <div className="text-xs text-slate-400 font-mono">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, displayedUsers.length)} of {displayedUsers.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1d3e] border border-[#182848] text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#152a57] transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-300 font-bold font-mono px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1d3e] border border-[#182848] text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#152a57] transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}

export default function ReferralMembersPage() {
  return (
    <Suspense
      fallback={
        <UserSidebarLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff0044]" />
          </div>
        </UserSidebarLayout>
      }
    >
      <ReferralMembersContent />
    </Suspense>
  );
}
