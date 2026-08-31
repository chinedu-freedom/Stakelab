'use client';

import { useEffect } from 'react';
import { RotateCw, RefreshCw } from 'lucide-react';

export default function GlobalErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Attempt one automatic hard reload for build hash mismatch
    if (typeof window !== 'undefined') {
      const hasReloaded = sessionStorage.getItem('app_error_reloaded');
      const isDeploymentMismatch =
        error?.message?.includes('Server Action') ||
        error?.message?.includes('ChunkLoadError') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('workers');

      if (isDeploymentMismatch && !hasReloaded) {
        sessionStorage.setItem('app_error_reloaded', 'true');
        window.location.replace(window.location.pathname);
      }
    }
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('app_error_reloaded');
      window.location.href = window.location.pathname;
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#07142c] text-white flex items-center justify-center p-6 font-sans">
      <div className="bg-[#0b1836] border border-[#1b2c54] rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <RefreshCw className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-righteous text-white">
            Page Refresh Required
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            A background update or route refresh is required. Click below to load your account data cleanly.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleHardRefresh}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Refresh Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
