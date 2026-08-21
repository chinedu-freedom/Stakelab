'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { countries } from '../../lib/countries';
import api from '../../lib/api';
import { toast } from 'sonner';

export default function UserDataPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    address: '',
    state: '',
    zip_code: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || prev.username || '',
        mobile: user.mobile ? user.mobile.replace(/^\+\d+\s*/, '') : '',
        address: user.address || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        city: user.city || '',
      }));
      if (user.country) {
        const found = countries.find((c) => c.name.toLowerCase() === user.country.toLowerCase());
        if (found) setSelectedCountry(found);
      }
    }
  }, [user]);

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const found = countries.find((c) => c.name === countryName);
    if (found) {
      setSelectedCountry(found);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobile || !formData.address || !formData.state || !formData.zip_code || !formData.city) {
      toast.error('All required fields marked with * must be filled.');
      return;
    }

    setSubmitting(true);

    try {
      const fullMobile = `${selectedCountry.dialCode} ${formData.mobile.trim()}`;
      const res = await api.post('/user/data', {
        username: formData.username,
        country: selectedCountry.name,
        mobile: fullMobile,
        address: formData.address,
        state: formData.state,
        zip_code: formData.zip_code,
        city: formData.city,
      });

      if (res.data.success) {
        toast.success('User data saved successfully!');
        await refreshUser();
        router.push('/dashboard');
      } else {
        toast.error(res.data.message || 'Failed to save user data');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save user data';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07193b] text-slate-100 font-sans flex flex-col">
      {/* Top Header Title */}
      <div className="w-full px-6 sm:px-12 py-6 bg-[#07193b]">
        <h1 className="text-3xl font-extrabold text-white font-righteous tracking-wide">
          User Data
        </h1>
      </div>

      {/* Main Form Center Container */}
      <div className="flex-1 flex justify-center items-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-2xl bg-[#0b162c] border border-[#1a2846] rounded-xl shadow-2xl overflow-hidden">
          {/* Card Header Bar */}
          <div className="bg-[#0e1c38] border-b border-[#1a2846] px-6 py-4">
            <h2 className="text-lg font-bold text-white font-righteous">
              User Data
            </h2>
          </div>

          {/* Card Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
              />
            </div>

            {/* Country & Mobile Row (Exact layout matching reference image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Country <span className="text-[#ff0044]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCountry.name}
                    onChange={handleCountryChange}
                    className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 pr-10 text-white font-sans text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#060f22] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mobile Input with Dynamic Dial Code Badge */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Mobile <span className="text-[#ff0044]">*</span>
                </label>
                <div className="flex items-center bg-[#060f22] border border-[#182848] rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                  {/* Dynamic Gradient Dial Code Box (+93, +1, +234, etc.) */}
                  <div className="h-12 px-3.5 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold text-sm flex items-center justify-center shrink-0 min-w-[54px]">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full h-12 bg-transparent border-0 outline-none px-3.5 text-white placeholder-slate-500 font-sans text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Address & State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address"
                  className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Zip Code & City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="Zip Code"
                  className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-stakelab py-3 rounded-md text-white font-righteous text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {submitting ? (
                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
