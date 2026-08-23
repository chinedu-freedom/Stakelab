'use client';

import { useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import api from '../../lib/api';
import { toast } from 'sonner';
import { Key, Lock, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/user/change-password', {
        current_password: formData.current_password,
        password: formData.password,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setFormData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        setErrors({ form: res.data.message || 'Failed to change password' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-xl mx-auto font-sans">
        {/* Page Title */}
        <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
          Change Password
        </h1>

        {/* Change Password Card Container */}
        <div className="bg-[#0b162c] border border-[#1a2846] rounded-xl shadow-2xl overflow-hidden">
          {/* Card Header Bar */}
          <div className="bg-[#0e1c38] border-b border-[#1a2846] px-6 py-4 flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#ff0044]" />
            <h2 className="text-sm font-bold text-white font-sans">
              Password Change
            </h2>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            {errors.form && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
                {errors.form}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
                Current Password <span className="text-[#ff0044]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={formData.current_password}
                  onChange={(e) => {
                    setFormData({ ...formData, current_password: e.target.value });
                    if (errors.current_password) setErrors({ ...errors, current_password: null });
                  }}
                  placeholder="Enter current password"
                  className={`w-full h-12 bg-[#060f22] border rounded-md pl-4 pr-11 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.current_password ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.current_password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.current_password}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
                New Password <span className="text-[#ff0044]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="Enter new password"
                  className={`w-full h-12 bg-[#060f22] border rounded-md pl-4 pr-11 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
                Confirm Password <span className="text-[#ff0044]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => {
                    setFormData({ ...formData, password_confirmation: e.target.value });
                    if (errors.password_confirmation) setErrors({ ...errors, password_confirmation: null });
                  }}
                  placeholder="Confirm new password"
                  className={`w-full h-12 bg-[#060f22] border rounded-md pl-4 pr-11 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all shadow-inner ${
                    errors.password_confirmation ? 'border-red-500 ring-1 ring-red-500' : 'border-[#182848] focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password_confirmation && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password_confirmation}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-stakelab py-3.5 rounded-xl text-white font-sans text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-6 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating Password...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
