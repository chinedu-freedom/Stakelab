'use client';

import { useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Copy, Check, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Security2FAPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setupKey = (user?.id ? 'STK' + user.id.replace(/-/g, '').substring(0, 12).toUpperCase() : 'M5FLLPUDR3336FAG');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `otpauth://totp/EverStake:${user?.email || 'user@everstake.cx'}?secret=${setupKey}&issuer=EverStake`
  )}`;

  const handleCopySetupKey = () => {
    navigator.clipboard.writeText(setupKey);
    setCopied(true);
    toast.success('Setup key copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnable2FA = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter the 6-digit Google Authenticator OTP.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      if (is2FAEnabled) {
        setIs2FAEnabled(false);
        toast.info('Two-Factor Authentication disabled.');
      } else {
        setIs2FAEnabled(true);
        toast.success('Two-Factor Authentication enabled successfully!');
      }
      setOtpCode('');
      setSubmitting(false);
    }, 800);
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Two Column Grid: Add Your Account (Left) & Enable 2FA Security (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Card: Add Your Account */}
          <div className="bg-[#0b162c] border border-[#16274a] rounded-xl overflow-hidden shadow-2xl">
            {/* Card Header Bar */}
            <div className="bg-[#0e1c38] border-b border-[#16274a] px-6 py-4">
              <h2 className="text-base font-bold text-white font-righteous">
                Add Your Account
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Use the QR code or setup key on your Google Authenticator app to add your account.
              </p>

              {/* QR Code Container */}
              <div className="flex justify-center py-2">
                <div className="p-3 bg-white rounded-xl shadow-inner inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Google Authenticator QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>

              {/* Setup Key Input Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Setup Key
                </label>

                <div className="flex items-center bg-[#060f22] border border-[#182848] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#ff0044] transition-all">
                  <input
                    type="text"
                    readOnly
                    value={setupKey}
                    className="w-full h-12 bg-transparent border-0 outline-none px-4 text-white text-xs font-mono font-bold select-all"
                  />

                  {/* Red-Orange Gradient Copy Button (Exact Match to Screenshot) */}
                  <button
                    type="button"
                    onClick={handleCopySetupKey}
                    className="h-12 w-12 bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-all cursor-pointer shadow-md shadow-red-500/20"
                    title="Copy Setup Key"
                  >
                    {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>

              {/* Help Description Section */}
              <div className="space-y-2 pt-2 border-t border-[#16274a]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>Help</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Google Authenticator is a multifactor app for mobile devices. It generates timed codes used during the 2-step verification process. To use Google Authenticator, install the Google Authenticator application on your mobile device.{' '}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ff0044] font-bold hover:underline"
                  >
                    Download
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Enable / Disable 2FA Security */}
          <div className="bg-[#0b162c] border border-[#16274a] rounded-xl overflow-hidden shadow-2xl">
            {/* Card Header Bar */}
            <div className="bg-[#0e1c38] border-b border-[#16274a] px-6 py-4">
              <h2 className="text-base font-bold text-white font-righteous">
                {is2FAEnabled ? 'Disable 2FA Security' : 'Enable 2FA Security'}
              </h2>
            </div>

            {/* Card Body */}
            <form onSubmit={handleEnable2FA} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-sans mb-2">
                  Google Authenticator OTP <span className="text-[#ff0044]">*</span>
                </label>

                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full h-12 bg-[#060f22] border border-[#182848] rounded-lg px-4 text-white text-sm font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#ff0044] transition-all shadow-inner"
                />
              </div>

              {/* Red-Orange Gradient Submit Button (Exact Match) */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-stakelab py-3 rounded-lg text-white font-righteous text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
