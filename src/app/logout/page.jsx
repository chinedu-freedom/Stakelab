'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-[#07193b] flex items-center justify-center text-white font-sans">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff0044] mx-auto"></div>
        <p className="text-sm font-semibold text-slate-300">Logging out of StakeLab...</p>
      </div>
    </div>
  );
}
