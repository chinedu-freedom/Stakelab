'use client';

import { useEffect } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

export default function GlobalErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Automatically recover from deployment hash / server action build mismatch
    const isDeploymentMismatch =
      error?.message?.includes('Server Action') ||
      error?.message?.includes('ChunkLoadError') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('workers');

    if (isDeploymentMismatch && typeof window !== 'undefined') {
      console.warn('Deployment mismatch detected. Refreshing page...');
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07142c] text-white flex items-center justify-center p-6 font-sans">
      <div className="bg-[#0b1836] border border-[#1b2c54] rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#ff0044] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-righteous text-white">
            Application Updated
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            A new version of the app was deployed. Please refresh to load the latest features.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
