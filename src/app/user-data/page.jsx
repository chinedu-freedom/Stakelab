'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { countries } from '../../lib/countries';
import api from '../../lib/api';
import { toast } from 'sonner';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        mobile: user.mobile ? user.mobile.replace(/^\+\d+\s*/, '') : '',
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

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const found = countries.find((c) => c.name === countryName);
    if (found) {
      setSelectedCountry(found);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!selectedCountry?.name) newErrors.country = 'Country is required';

    const cleanMobile = formData.mobile.trim().replace(/[\s-]/g, '');
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{6,15}$/.test(cleanMobile)) {
      newErrors.mobile = 'Please enter a valid phone number (6-15 digits only)';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'Zip Code is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const fullMobile = `${selectedCountry.dialCode} ${formData.mobile.trim()}`;
      const res = await api.post('/user/data', {
        username: formData.username.trim(),
        country: selectedCountry.name,
        mobile: fullMobile,
        address: formData.address.trim(),
        state: formData.state.trim(),
        zip_code: formData.zip_code.trim(),
        city: formData.city.trim(),
      });

      if (res.data.success) {
        toast.success('User data saved successfully!');
        await refreshUser();
        router.push('/dashboard');
      } else {
        setErrors({ form: res.data.message || 'Failed to save user data' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save user data';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        {/* Top Header Title */}
        <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
          User Data
        </h1>

        {/* Main Form Center Container */}
        <div className="bg-[#0b162c] border border-[#1a2846] rounded-xl shadow-2xl overflow-hidden">
          {/* Card Header Bar */}
          <div className="bg-[#0e1c38] border-b border-[#1a2846] px-6 py-4">
            <h2 className="text-lg font-bold text-white font-righteous">
              User Data
            </h2>
          </div>

          {/* Card Form Body */}
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            {errors.form && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
                {errors.form}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Username <span className="text-[#ff0044]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                placeholder="Username"
                className={`w-full h-12 bg-[#060f22] border rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                  errors.username ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                }`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.username}</p>}
            </div>

            {/* Country & Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Country <span className="text-[#ff0044]">*</span>
                </label>
                <Select
                  value={selectedCountry.name}
                  onValueChange={(countryName) => {
                    const countryObj = countries.find((c) => c.name === countryName) || countries[0];
                    setSelectedCountry(countryObj);
                    setFormData({ ...formData, country: countryObj.name });
                    if (errors.country) setErrors({ ...errors, country: null });
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.country}</p>}
              </div>

              {/* Mobile Input with Dynamic Dial Code Badge */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Mobile <span className="text-[#ff0044]">*</span>
                </label>
                <div className={`flex items-center bg-[#060f22] border rounded-md overflow-hidden transition-all ${
                  errors.mobile ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus-within:ring-1 focus-within:ring-[#ff0044]'
                }`}>
                  {/* Dynamic Gradient Dial Code Box (+93, +1, +234, etc.) */}
                  <div className="h-12 px-3.5 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white font-righteous font-bold text-sm flex items-center justify-center shrink-0 min-w-[54px]">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData({ ...formData, mobile: e.target.value });
                      if (errors.mobile) setErrors({ ...errors, mobile: null });
                    }}
                    placeholder="Mobile Number"
                    className="w-full h-12 bg-transparent border-0 outline-none px-3.5 text-white placeholder-slate-500 font-sans text-sm"
                  />
                </div>
                {errors.mobile && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.mobile}</p>}
              </div>
            </div>

            {/* Address & State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Address <span className="text-[#ff0044]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: null });
                  }}
                  placeholder="Address"
                  className={`w-full h-12 bg-[#060f22] border rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  State <span className="text-[#ff0044]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: null });
                  }}
                  placeholder="State"
                  className={`w-full h-12 bg-[#060f22] border rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.state ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                {errors.state && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Zip Code <span className="text-[#ff0044]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip_code}
                  onChange={(e) => {
                    setFormData({ ...formData, zip_code: e.target.value });
                    if (errors.zip_code) setErrors({ ...errors, zip_code: null });
                  }}
                  placeholder="Postal / Zip Code"
                  className={`w-full h-12 bg-[#060f22] border rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.zip_code ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                {errors.zip_code && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.zip_code}</p>}
              </div>
            </div>

            {/* City Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                City <span className="text-[#ff0044]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: null });
                }}
                placeholder="City"
                className={`w-full h-12 bg-[#060f22] border rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                  errors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                }`}
              />
              {errors.city && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.city}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-stakelab py-3.5 rounded-xl text-white font-sans text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Profile
                </span>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
