'use client';

import { useState } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';

export default function CurrencyPage() {
  /*
  const [currencies] = useState([ ... ]);
  */

  return (
    <UserSidebarLayout>
      {/* 
        Currency page is commented out per user request.
        Uncomment when ready to enable.
      */}
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm font-medium">Manage Currency is currently disabled.</p>
      </div>
    </UserSidebarLayout>
  );
}
