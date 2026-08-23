'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <PageLoader />;
}
