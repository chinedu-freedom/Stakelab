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
  Camera,
  Upload,
  Loader2,
  Check,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function MyProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // --- Profile Form State ---
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    state: '',
    zip_code: '',
    city: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        fullName: user.full_name || user.username || '',
        email: user.email || '',
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
    setSavingProfile(true);
    try {
      const fullMobile = `${selectedCountry.dialCode} ${formData.mobile.trim()}`;
      const res = await api.post('/user/data', {
        username: formData.username,
        full_name: formData.fullName,
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
      toast.error(err.response?.data?.message || 'Failed to update profile details');
    } finally {
      setSavingProfile(false);
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
      <div className="max-w-4xl mx-auto space-y-6 font-sans animate-in fade-in duration-300 pb-16">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
              My Profile
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              View and manage your account details, profile picture, and contact information.
            </p>
          </div>
          <Link
            href="/user-data"
            className="px-4 py-2 rounded-xl bg-[#0a1835] border border-[#182848] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <span>Account Overview</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Profile Card Form */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-[#0e1d3e] border-b border-[#182848] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white font-righteous flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#fe780b]" /> Personal Profile
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Note: Full Name, Username, and Email are fixed for security.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              Account Active
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
            {/* Avatar Photo Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#061025] border border-[#182848]">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#1e3463] bg-[#0c1a38] overflow-hidden flex items-center justify-center shadow-xl transition-all group-hover:border-[#ff0044]">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-white font-righteous">{getInitials()}</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-bold text-white mt-1 uppercase">Change</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-base font-extrabold text-white font-righteous">Profile Picture</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Upload your avatar image (JPG, PNG, GIF up to 2MB). Recommended size 300x300px.
                </p>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#142852] hover:bg-[#1c366e] text-slate-200 text-xs font-bold transition-all border border-[#1e3b78] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-300" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Read-Only Fixed Credentials (Full Name, Username, Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#061025]/60 border border-[#142343]">
              {/* Full Name (Fixed) */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span>Full Name</span>
                  <Lock className="w-3 h-3 text-amber-400" title="Fixed field" />
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  disabled
                  className="w-full bg-[#0c1a38]/80 border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-medium select-none"
                />
              </div>

              {/* Username (Fixed) */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span>Username</span>
                  <Lock className="w-3 h-3 text-amber-400" title="Fixed field" />
                </label>
                <input
                  type="text"
                  value={formData.username}
                  disabled
                  className="w-full bg-[#0c1a38]/80 border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-medium select-none"
                />
              </div>

              {/* Email (Fixed) */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span>Email Address</span>
                  <Lock className="w-3 h-3 text-amber-400" title="Fixed field" />
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-[#0c1a38]/80 border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-medium select-none"
                />
              </div>
            </div>

            {/* Editable Contact & Address Fields */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider border-b border-[#182848] pb-2">
                Editable Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number with Country Dial Prefix */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2.5 bg-[#061025] border border-[#182848] rounded-xl text-xs font-bold text-slate-300 shrink-0">
                      {selectedCountry.dialCode}
                    </div>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. 8123456789"
                      className="w-full bg-[#061025] border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Country Searchable Dropdown */}
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Country</label>
                  <Select
                    value={selectedCountry.name}
                    onValueChange={(val) => {
                      const found = countries.find((c) => c.name === val);
                      if (found) setSelectedCountry(found);
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#061025] border border-[#182848] text-white rounded-xl h-10 px-4 text-xs font-medium focus:ring-0 focus:border-red-500">
                      <SelectValue placeholder="Select Country">
                        <span className="flex items-center gap-2">
                          <span className="text-base">{selectedCountry.flag}</span>
                          <span>{selectedCountry.name}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#091630] border border-[#182848] text-white max-h-60 overflow-y-auto no-scrollbar z-50">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name} className="hover:bg-[#142852] focus:bg-[#142852] text-xs py-2">
                          <span className="flex items-center gap-2">
                            <span className="text-base">{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address or P.O. Box"
                  className="w-full bg-[#061025] border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-sans"
                />
              </div>

              {/* City, State, Zip Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-[#061025] border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">State / Region</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-[#061025] border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Zip / Postal Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    placeholder="Zip code"
                    className="w-full bg-[#061025] border border-[#182848] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Profile Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
