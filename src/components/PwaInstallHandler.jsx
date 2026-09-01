'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Share, PlusSquare, X, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

let deferredInstallPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}

export default function PwaInstallHandler() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));

      const handleOpenInstall = () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              toast.success('EverStake Mobile App installation started!');
              setInstalled(true);
            }
            deferredInstallPrompt = null;
          });
        } else {
          setModalOpen(true);
        }
      };

      window.addEventListener('open-pwa-install', handleOpenInstall);
      return () => {
        window.removeEventListener('open-pwa-install', handleOpenInstall);
      };
    }
  }, []);

  if (!modalOpen) return null;

  return (
    <div
      onClick={() => setModalOpen(false)}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#09152b] border border-[#1b2b4d] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative cursor-default text-white font-sans"
      >
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#122449] border border-[#1d366a] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3.5 border-b border-[#182848] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
            <Smartphone className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-righteous">Install EverStake App</h3>
            <p className="text-xs text-slate-400">Add EverStake to your home screen for quick mobile access</p>
          </div>
        </div>

        {isIos ? (
          <div className="space-y-4 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Follow these simple steps to install on iOS / iPhone:</p>
            <div className="space-y-3 bg-[#071020] border border-[#182848] rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">1. Tap the Share Button</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Tap the Share icon at the bottom of Safari/Chrome.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">2. Select 'Add to Home Screen'</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Scroll down the menu and tap 'Add to Home Screen'.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">3. Tap 'Add' to Complete</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Launch EverStake instantly from your iPhone home screen!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Install EverStake on your mobile device or desktop:</p>
            <div className="space-y-3 bg-[#071020] border border-[#182848] rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">Instant App Installation</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Tap the browser menu (⋮) and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setModalOpen(false)}
          className="w-full btn-stakelab py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
