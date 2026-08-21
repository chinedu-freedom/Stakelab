'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff, Check, TrendingUp } from 'lucide-react';
import GoogleReCaptcha from '../../../components/GoogleReCaptcha';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check query params for email verification notice
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now log in.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setKeepMeLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    if (keepMeLoggedIn) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      const res = await login(email, password, keepMeLoggedIn);
      if (res && res.error) {
        setErrorMessage(res.error);
        setSubmitting(false);
      } else {
        if (res.user && !res.user.profile_complete) {
          router.push('/user-data');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to login. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#07193b] text-slate-100 font-sans overflow-hidden">
      {/* Main Container Split: 50% Left Form / 50% Right Carousel Graphic */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Form Container (50% - Only Left Side Scrolls with Hidden Scrollbar) */}
        <div className="flex flex-col justify-start lg:justify-center items-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 pt-12 sm:pt-16 lg:pt-14 pb-12 h-full overflow-y-auto no-scrollbar relative z-10">
          <div className="w-full max-w-md my-0 lg:my-auto">
            {/* Header Title */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-extrabold text-white mb-2 font-righteous tracking-wide">
                Welcome <span className="text-gradient-stakelab">back</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Login to your account to continue
              </p>
            </div>

            {/* Verification Success Toast Notice */}
            {successMessage && (
              <div className="mb-6 p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {successMessage}
              </div>
            )}

            {/* Error Message Notice */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 bg-[#0c1424] border-0 outline-none focus:outline-none rounded-md px-4 text-white placeholder-slate-500 font-sans text-sm focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-[#0c1424] border-0 outline-none focus:outline-none rounded-md px-4 pr-12 text-white placeholder-slate-500 font-sans text-sm focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepMeLoggedIn}
                    onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                    id="keepMeLoggedIn"
                    className="w-4 h-4 rounded border-[#1c2844] bg-[#0c1424] text-[#ff0044] focus:ring-0 accent-[#ff0044] cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">Keep me logged in</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-[#ff0044] font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Official Google reCAPTCHA v2 Component */}
              <div className="pt-1">
                <GoogleReCaptcha />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-stakelab py-3 rounded-md text-white font-righteous text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
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
                  'Login'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-slate-400 mt-6">
              Don’t have an account?{' '}
              <Link href="/register" className="text-[#ff0044] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Auth Illustration Graphic (50% Equal Split - Local File Cropped / Zoomed) */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden bg-[#07193b]">
          <img
            src="/auth-bg.png"
            alt="StakeLab Authentication Illustration"
            className="w-full h-full object-cover object-center scale-135 transform transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#07193b]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ff0044]/20"></div>
            <div className="h-4 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
