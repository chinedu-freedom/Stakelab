'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { toast } from 'sonner';
import PageLoader from '../../components/PageLoader';
import { Mail, CheckCircle, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    if (!loading && user && user.email_verified && typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 4) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/verify-email', { code: cleanCode });
      if (res.data && res.data.success) {
        toast.success('Email address verified successfully!');
        await refreshUser();
        window.location.href = '/dashboard';
      } else {
        toast.error(res.data?.message || 'Invalid verification code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please check code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      const res = await api.post('/auth/send-email-verification');
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Verification code sent to your email address!');
        setCountdown(60);
      } else {
        toast.error(res.data?.message || 'Failed to resend code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#07193b] text-slate-100 font-sans flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-[#091836] border border-[#14264a] rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Glowing Mail Icon Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
            <Mail className="w-8 h-8 stroke-[2]" />
          </div>

          <h1 className="text-2xl font-extrabold text-white font-righteous tracking-wide">
            Verify Email Address
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            We sent a 6-digit verification code to{' '}
            <span className="text-white font-bold">{user?.email || 'your email'}</span>. Please enter it below to activate full account capabilities.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full h-14 bg-[#06122b] border border-[#14264a] focus:border-[#ff0044] rounded-xl text-center text-2xl font-mono font-extrabold text-white tracking-[0.4em] outline-none transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || code.length < 4}
            className="w-full py-3.5 bg-gradient-to-r from-[#ff0044] via-[#fe500b] to-[#fe880b] hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all font-righteous flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Verifying...' : 'Verify Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Resend & Status Footer */}
        <div className="pt-4 border-t border-[#14264a] text-center space-y-3">
          <p className="text-xs text-slate-400 font-sans">
            Didn't receive the email code?
          </p>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={countdown > 0 || resending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fe780b] hover:text-[#ff0044] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {countdown > 0
                ? `Resend Code in ${countdown}s`
                : resending
                ? 'Sending Code...'
                : 'Resend Verification Code'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
