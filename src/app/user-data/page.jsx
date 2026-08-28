'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { countries } from '../../lib/countries';
import api from '../../lib/api';
import { toast } from 'sonner';
import PageLoader from '../../components/PageLoader';
import SearchableCountrySelect from '../../components/SearchableCountrySelect';

export default function UserDataPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      let rawMob = user.mobile || '';
      rawMob = rawMob.replace(/^\+\d+\s*/, '').replace(/\D/g, '');
      if (rawMob.startsWith('0') && rawMob.length === 11) {
        rawMob = rawMob.substring(1);
      }

      setFormData({
        username: user.username || user.email?.split('@')[0] || '',
        fullName: user.full_name || '',
        mobile: rawMob.slice(0, 10),
        address: user.address || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        city: user.city || '',
      });

      if (user.country) {
        const found = countries.find((c) => c.name.toLowerCase() === user.country.toLowerCase());
        if (found) setSelectedCountry(found);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = formData.username.trim();
    let cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.startsWith('0')) cleanMobile = cleanMobile.substring(1);
    cleanMobile = cleanMobile.slice(0, 10);

    const cleanAddress = formData.address.trim();
    const cleanCity = formData.city.trim();
    const cleanState = formData.state.trim();
    const cleanZip = formData.zip_code.trim();

    if (!cleanUsername) {
      toast.error('Username is required');
      return;
    }
    if (!cleanMobile || cleanMobile.length !== 10) {
      toast.error('Mobile number is required (10 digits)');
      return;
    }
    if (!cleanAddress) {
      toast.error('Address is required');
      return;
    }
    if (!cleanState) {
      toast.error('State is required');
      return;
    }
    if (!cleanZip) {
      toast.error('Zip Code is required');
      return;
    }
    if (!cleanCity) {
      toast.error('City is required');
      return;
    }

    setSubmitting(true);
    try {
      const fullMobile = `${selectedCountry.dialCode} ${cleanMobile}`;
      const res = await api.post('/user/data', {
        username: cleanUsername,
        full_name: formData.fullName || cleanUsername,
        country: selectedCountry.name,
        mobile: fullMobile,
        address: cleanAddress,
        state: cleanState,
        zip_code: cleanZip,
        city: cleanCity,
      });

      if (res.data && res.data.success) {
        toast.success('User data saved successfully!');
        await refreshUser();
        window.location.href = '/dashboard';
      } else {
        toast.error(res.data?.message || 'Failed to save user data');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user data');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#07193b] text-slate-100 font-sans flex flex-col justify-start items-center p-6 sm:p-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Top Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
          User Data
        </h1>

        {/* User Data Form Card Container (Matching Reference Screenshot) */}
        <div className="bg-[#091836] border border-[#14264a] rounded-2xl overflow-hidden shadow-2xl">
          <div className="border-b border-[#14264a] px-6 py-4">
            <h2 className="text-base font-extrabold text-white font-righteous">
              User Data
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                className="w-full h-11 bg-[#06122b] border border-[#14264a] rounded-lg px-4 text-xs sm:text-sm text-white outline-none focus:border-[#ff0044] transition-all"
              />
            </div>

            {/* Country & Mobile Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  Country <span className="text-red-500">*</span>
                </label>
                <SearchableCountrySelect
                  value={selectedCountry}
                  onChange={(c) => setSelectedCountry(c)}
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-[#14264a] rounded-lg overflow-hidden bg-[#06122b] focus-within:border-[#ff0044]">
                  <div className="h-11 bg-gradient-to-r from-[#ff0044] to-[#fe780b] px-3.5 text-xs font-bold text-white flex items-center shrink-0">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.startsWith('0')) val = val.substring(1);
                      setFormData({ ...formData, mobile: val.slice(0, 10) });
                    }}
                    placeholder="10-digit number"
                    className="w-full h-11 bg-transparent border-0 outline-none px-4 text-xs sm:text-sm text-white font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Address & State Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street Address"
                  className="w-full h-11 bg-[#06122b] border border-[#14264a] rounded-lg px-4 text-xs sm:text-sm text-white outline-none focus:border-[#ff0044] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State / Province"
                  className="w-full h-11 bg-[#06122b] border border-[#14264a] rounded-lg px-4 text-xs sm:text-sm text-white outline-none focus:border-[#ff0044] transition-all"
                />
              </div>
            </div>

            {/* Zip Code & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  Zip Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="Zip / Postal Code"
                  className="w-full h-11 bg-[#06122b] border border-[#14264a] rounded-lg px-4 text-xs sm:text-sm text-white outline-none focus:border-[#ff0044] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full h-11 bg-[#06122b] border border-[#14264a] rounded-lg px-4 text-xs sm:text-sm text-white outline-none focus:border-[#ff0044] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#ff0044] via-[#fe500b] to-[#fe880b] hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-red-500/20 transition-all font-righteous cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
