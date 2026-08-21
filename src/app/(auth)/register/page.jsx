'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import GoogleReCaptcha from '../../../components/GoogleReCaptcha';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please verify both passwords.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Privacy Policy, Terms of Service, and Staking Policy.';
    }

    if (!captchaToken) {
      newErrors.captcha = 'Please verify the reCAPTCHA checkbox before proceeding.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const full_name = `${firstName} ${lastName}`.trim();
      const res = await registerUser({
        full_name,
        email,
        password,
        username: email.split('@')[0],
        captchaToken,
      });

      if (res && res.error) {
        if (res.error.toLowerCase().includes('email')) {
          setErrors({ email: res.error });
        } else {
          setErrors({ form: res.error });
        }
        setSubmitting(false);
      } else {
        toast.success('Account created successfully!');
        router.push('/user-data');
      }
    } catch (err) {
      setErrors({ form: err.message || 'Failed to create account. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#07193b] text-slate-100 font-sans overflow-hidden">
      {/* Main Container Split: 50% Left Form / 50% Right Image */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Form Container (50% - Pushed down with top padding, scrollable left side) */}
        <div className="flex flex-col justify-start items-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-20 h-full overflow-y-auto no-scrollbar relative z-10">
          <div className="w-full max-w-md my-0">
            {/* Header Title & Copy */}
            <div className="mb-6 text-left space-y-1">
              <h1 className="text-3xl font-extrabold text-white font-righteous tracking-wide">
                Sign <span className="text-gradient-stakelab">up</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Sign up for free and start growing your wealth today
              </p>
            </div>

            {/* General Form Error */}
            {errors.form && (
              <p className="mb-3 text-red-400 text-xs font-medium">{errors.form}</p>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full h-11 bg-[#0c1424] border-0 outline-none focus:outline-none rounded-md px-3.5 text-white placeholder-slate-500 font-sans text-xs sm:text-sm focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full h-11 bg-[#0c1424] border-0 outline-none focus:outline-none rounded-md px-3.5 text-white placeholder-slate-500 font-sans text-xs sm:text-sm focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@example.com"
                  className={`w-full h-11 bg-[#0c1424] outline-none focus:outline-none rounded-md px-3.5 text-white placeholder-slate-500 font-sans text-xs sm:text-sm transition-all shadow-inner ${
                    errors.email ? 'border border-red-500/80 focus:ring-1 focus:ring-red-500' : 'border-0 focus:ring-1 focus:ring-[#ff0044]'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="••••••••"
                    className="w-full h-11 bg-[#0c1424] border-0 outline-none focus:outline-none rounded-md px-3.5 pr-10 text-white placeholder-slate-500 font-sans text-xs sm:text-sm focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="••••••••"
                    className={`w-full h-11 bg-[#0c1424] outline-none focus:outline-none rounded-md px-3.5 pr-10 text-white placeholder-slate-500 font-sans text-xs sm:text-sm transition-all shadow-inner ${
                      errors.confirmPassword ? 'border border-red-500/80 focus:ring-1 focus:ring-red-500' : 'border-0 focus:ring-1 focus:ring-[#ff0044]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Policies Checkbox Row */}
              <div className="pt-1">
                <label className="flex items-start space-x-2.5 cursor-pointer select-none text-xs leading-relaxed">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-[#1c2844] bg-[#0c1424] text-[#ff0044] focus:ring-0 accent-[#ff0044] cursor-pointer shrink-0"
                  />
                  <span className="text-slate-200">
                    I agree with{' '}
                    <span className="text-[#ff0044] font-bold hover:underline">Privacy Policy</span> |{' '}
                    <span className="text-[#ff0044] font-bold hover:underline">Terms of Service</span> |{' '}
                    <span className="text-[#ff0044] font-bold hover:underline">Staking Policy</span>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.terms}</p>
                )}
              </div>

              {/* Official Google reCAPTCHA v2 Component */}
              <div className="pt-1">
                <GoogleReCaptcha
                  onVerify={(token) => {
                    setCaptchaToken(token);
                    if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: '' }));
                  }}
                />
                {errors.captcha && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.captcha}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-stakelab py-3 rounded-md text-white font-righteous text-sm tracking-wider uppercase font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <rect width="6" height="14" x="1" y="4" fill="currentColor">
                      <animate id="SVG9ovaHbIP" fill="freeze" attributeName="opacity" begin="0;SVGa89dAd4w.end-0.25s" dur="0.75s" values="1;.2" />
                    </rect>
                    <rect width="6" height="14" x="9" y="4" fill="currentColor" opacity=".4">
                      <animate fill="freeze" attributeName="opacity" begin="SVG9ovaHbIP.begin+0.15s" dur="0.75s" values="1;.2" />
                    </rect>
                    <rect width="6" height="14" x="17" y="4" fill="currentColor" opacity=".3">
                      <animate id="SVGa89dAd4w" fill="freeze" attributeName="opacity" begin="SVG9ovaHbIP.begin+0.3s" dur="0.75s" values="1;.2" />
                    </rect>
                  </svg>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs text-slate-400 mt-5">
              Already registered?{' '}
              <Link href="/login" className="text-[#ff0044] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Auth Illustration Graphic (50% Equal Split - Local File Cropped) */}
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
