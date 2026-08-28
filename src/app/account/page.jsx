'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { countries } from '../../lib/countries';
import api from '../../lib/api';
import { toast } from 'sonner';
import {
  User,
  Lock,
  HelpCircle,
  Copy,
  Check,
  Camera,
  LogOut,
  ChevronRight,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  Wallet,
  Coins,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  X,
  RotateCcw,
  Layers,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  Disc,
  FileText,
  Gift,
  Download,
  MessageCircle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const fileInputRef = useRef(null);

  // --- Balances Eye Toggle State ---
  const [showBalances, setShowBalances] = useState(true);

  // --- Profile Form State ---
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    mobile: '',
    address: '',
    state: '',
    zip_code: '',
    city: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // --- Password Form State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // --- About Us Modal State ---
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        fullName: user.full_name || user.username || '',
        mobile: user.mobile ? user.mobile.replace(/^\+\d+\s*/, '') : '',
        address: user.address || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        city: user.city || '',
      });
      if (user.profile_image) {
        setProfileImage(user.profile_image);
      }
      if (user.country) {
        const found = countries.find((c) => c.name.toLowerCase() === user.country.toLowerCase());
        if (found) setSelectedCountry(found);
      }
    }
  }, [user]);

  // --- Referral Copy ---
  const referralCode = user?.referral_code || user?.id?.substring(0, 8) || 'EVER100';
  const handleCopyReferral = () => {
    const fullLink = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedCode(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // --- Avatar Image Upload ---
  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Profile image must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      toast.success('Profile picture ready to save!');
    };
    reader.readAsDataURL(file);
  };

  // --- Save Profile Handler ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    setSavingProfile(true);
    try {
      const fullMobile = `${selectedCountry.dialCode} ${formData.mobile.trim()}`;
      const res = await api.post('/user/data', {
        username: formData.username.trim(),
        full_name: formData.fullName.trim(),
        country: selectedCountry.name,
        mobile: fullMobile,
        address: formData.address.trim(),
        state: formData.state.trim(),
        zip_code: formData.zip_code.trim(),
        city: formData.city.trim(),
        profile_image: profileImage,
      });

      if (res.data.success) {
        toast.success('Profile updated successfully!');
        await refreshUser();
      } else {
        toast.error(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Change Password Handler ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post('/auth/change-password', {
        current_password: currentPassword,
        password: newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = () => {
    const name = user?.full_name || user?.username || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <UserSidebarLayout>
      <div className="max-w-6xl mx-auto space-y-6 font-sans animate-in fade-in duration-300 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
              Account Settings
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage your personal profile, security, balances, and platform preferences.
            </p>
          </div>

          {/* Eye Toggle All Balances */}
          <button
            type="button"
            onClick={() => setShowBalances(!showBalances)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0a1835] border border-[#182848] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md select-none"
          >
            {showBalances ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{showBalances ? 'Hide Balances' : 'Show Balances'}</span>
          </button>
        </div>

        {/* 5 Balances & Account Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Main Wallet Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Main Balance</span>
              <Wallet className="w-4 h-4 text-[#ff0044]" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.balance || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 2. Staking Balance */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Staking Balance</span>
              <Coins className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.staking_balance || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 3. Total Deposit */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Total Deposit</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.total_deposit || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 4. Total Withdraw */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Total Withdraw</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {showBalances ? `$${parseFloat(user?.total_withdraw || 0).toFixed(2)}` : '••••••'}
            </div>
          </div>

          {/* 5. Total Members / Referrals */}
          <div className="col-span-2 sm:col-span-1 bg-[#0a1835] border border-[#182848] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Team Members</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-righteous mt-2">
              {user?.referral_count || 0} Members
            </div>
          </div>
        </div>

        {/* 12 Quick Action Shortcuts Grid */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#182848] pb-3">
            <h2 className="text-sm font-extrabold text-white font-righteous tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fe780b] animate-ping" />
              Quick Platform Shortcuts
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Instant Access</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6 pt-1">
            {[
              {
                label: 'Deposit',
                link: '/deposit',
                bgColor: 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/20',
                icon: Wallet,
              },
              {
                label: 'Withdraw',
                link: '/withdraw',
                bgColor: 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20',
                icon: RotateCcw,
              },
              {
                label: 'Stake',
                link: '/staking/create',
                bgColor: 'bg-gradient-to-tr from-[#ff0044] to-[#fe780b] shadow-red-500/20',
                icon: Layers,
              },
              {
                label: 'My Staking',
                link: '/staking',
                bgColor: 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20',
                icon: DollarSign,
              },
              {
                label: 'Daily Check-in',
                link: '/tasks',
                bgColor: 'bg-gradient-to-tr from-blue-500 to-sky-400 shadow-blue-500/20',
                icon: CalendarCheck,
              },
              {
                label: 'Tasks',
                link: '/tasks',
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-400 shadow-emerald-500/20',
                icon: ClipboardList,
              },
              {
                label: 'Lucky Spin',
                link: '/spin',
                bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/20',
                icon: Disc,
              },
              {
                label: 'Transaction Log',
                link: '/transactions',
                bgColor: 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-orange-500/20',
                icon: FileText,
              },
              {
                label: 'Bonus Code',
                link: '/treasure',
                bgColor: 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-500/20',
                icon: Gift,
              },
              {
                label: 'Download App',
                link: '#',
                bgColor: 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/20',
                icon: Download,
              },
              {
                label: 'Referrals',
                link: '/referrals',
                bgColor: 'bg-gradient-to-tr from-violet-600 to-purple-500 shadow-violet-500/20',
                icon: Users,
              },
              {
                label: 'WhatsApp Group',
                link: 'https://chat.whatsapp.com',
                isExternal: true,
                bgColor: 'bg-gradient-to-tr from-emerald-500 to-green-500 shadow-emerald-500/20',
                icon: MessageCircle,
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              const content = (
                <div className="flex flex-col items-center group cursor-pointer">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${action.bgColor} flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 text-center group-hover:text-white transition-colors leading-tight">
                    {action.label}
                  </span>
                </div>
              );

              if (action.isExternal) {
                return (
                  <a key={idx} href={action.link} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }

              return (
                <Link key={idx} href={action.link}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Profile Info & Security Password Change */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Details Card (Col Span 8) */}
          <div className="lg:col-span-8 bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white font-righteous">Profile Details</h2>
                <p className="text-xs text-slate-400 mt-0.5">Update your personal information and contact details.</p>
              </div>

              {/* Referral Badge */}
              <div className="flex items-center gap-2 bg-[#061025] px-3.5 py-1.5 rounded-full border border-[#1b2f56]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref Code:</span>
                <span className="text-xs font-mono font-bold text-white">{referralCode}</span>
                <button
                  onClick={handleCopyReferral}
                  className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Referral Link"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Upload Container */}
                <div className="flex flex-col items-center space-y-3 shrink-0 mx-auto md:mx-0">
                  <div className="relative group">
                    <div
                      onClick={handleImageClick}
                      className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#1c305a] shadow-xl bg-[#060f22] transition-all group-hover:border-[#ff0044]/60 cursor-pointer relative"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#ff0044] to-[#fe780b]">
                          <span className="text-2xl font-black text-white font-righteous">{getInitials()}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="absolute bottom-1 right-1 w-8 h-8 bg-[#ff0044] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#0a1835] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-sm text-white">{user?.full_name || user?.username || 'User Account'}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">@{user?.username || 'user'}</p>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Username <span className="text-[#ff0044]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="username"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address (Verified)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full h-11 bg-[#060d1f] border border-[#142340] rounded-xl px-4 text-slate-400 text-xs font-bold cursor-not-allowed opacity-80"
                    />
                  </div>

                  {/* Country & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country Searchable Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <Select
                        value={selectedCountry.name}
                        onValueChange={(cName) => {
                          const found = countries.find((c) => c.name === cName) || countries[0];
                          setSelectedCountry(found);
                        }}
                      >
                        <SelectTrigger className="h-11 border-[#182848] rounded-xl">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent searchPlaceholder="Search country...">
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="8012345678"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>
                  </div>

                  {/* Address, City, State */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                        placeholder="100001"
                        className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl px-4 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                      />
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full sm:w-auto px-8 h-11 bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Security & Password Card (Col Span 4) */}
          <div className="lg:col-span-4 bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
            <div>
              <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4">
                <h2 className="text-base font-extrabold text-white font-righteous">Security</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage your account password and security.</p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#060f22] border border-[#182848] rounded-xl pl-4 pr-10 text-white text-xs font-bold focus:outline-none focus:border-[#ff0044] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Change Password Button */}
                <button
                  type="submit"
                  disabled={changingPassword || !currentPassword || !newPassword}
                  className="w-full h-11 bg-[#142345] hover:bg-[#ff0044] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-[#ff0044]/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lower Section: Support, Help & Sign Out */}
        <div className="w-full">
          {/* Support & Help Navigation Card */}
          <div className="bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-[#182848]">
              {/* Help Center */}
              <Link
                href="/support"
                className="flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="uppercase tracking-wider">Help Center & Live Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* About EverStake */}
              <button
                type="button"
                onClick={() => setAboutModalOpen(true)}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-[#0e1d3e] transition-colors group text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="uppercase tracking-wider">About EverStake Platform</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="uppercase tracking-wider">Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* About EverStake Modal */}
        {aboutModalOpen && (
          <div
            onClick={() => setAboutModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 shadow-2xl text-white font-sans space-y-5 animate-in zoom-in-95 duration-200 cursor-default"
            >
              <button
                onClick={() => setAboutModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-righteous tracking-wide flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#ff0044]" /> About EverStake Platform
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">EverStake</span> is a premier crypto yield protocol offering high-performance, automated staking pools with institutional-grade security, instant payouts, and zero lockup friction.
                </p>
              </div>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocol Network:</span>
                  <span className="font-bold text-white">Multichain (BEP20 / TRC20 / ERC20)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Architecture:</span>
                  <span className="font-bold text-emerald-400">Institutional-Grade Encrypted Vault</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Payout Engine:</span>
                  <span className="font-bold text-amber-400">Automated Smart Distribution</span>
                </div>
              </div>

              <button
                onClick={() => setAboutModalOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20"
              >
                Close Information
              </button>
            </div>
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
