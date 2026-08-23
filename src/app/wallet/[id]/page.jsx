'use client';

import UserSidebarLayout from '../../../components/UserSidebarLayout';

export default function WalletDetailsPage({ params }) {
  /*
  const resolvedParams = typeof params?.then === 'function' ? use(params) : (params || {});
  const walletId = (resolvedParams?.id || 'btc').toLowerCase();
  */

  return (
    <UserSidebarLayout>
      {/* 
        Wallet Details page is commented out per user request.
        Uncomment when ready to enable.
      */}
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm font-medium">Wallet Details is currently disabled.</p>
      </div>
    </UserSidebarLayout>
  );
}
