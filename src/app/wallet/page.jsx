'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function WalletPage() {
  /*
  const { user } = useAuth();
  const [wallets] = useState([ ... ]);
  */

  return (
    <UserSidebarLayout>
      {/* 
        Wallet page is commented out per user request.
        Uncomment when ready to enable.
      */}
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm font-medium">My Wallet is currently disabled.</p>
      </div>
    </UserSidebarLayout>
  );
}
