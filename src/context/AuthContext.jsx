'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('stakelab_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      document.cookie = `stakelab_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `sec-prd-token=${token}; path=/; max-age=604800; SameSite=Lax`;
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      localStorage.removeItem('stakelab_token');
      document.cookie = 'stakelab_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'sec-prd-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('stakelab_token', res.data.token);
        document.cookie = `stakelab_token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `sec-prd-token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
        setUser(res.data.user);
        toast.success('Welcome back to EverStake!');
        return { success: true, user: res.data.user };
      } else {
        const msg = res.data.message || 'Login failed';
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('stakelab_token', res.data.token);
        document.cookie = `stakelab_token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `sec-prd-token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
        setUser(res.data.user);
        toast.success('Registration successful! Please complete your user data.');
        return { success: true, user: res.data.user };
      } else {
        const msg = res.data.message || 'Registration failed';
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success(res.data.message || 'OTP code sent to your email!');
        return { success: true, message: res.data.message };
      } else {
        const msg = res.data.message || 'Failed to send OTP code';
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP code';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
        toast.success(res.data.message || 'OTP verified successfully!');
        return { success: true, message: res.data.message };
      } else {
        const msg = res.data.message || 'Invalid or expired OTP code';
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (email, password) => {
    try {
      const res = await api.post('/auth/reset-password', { email, password });
      if (res.data.success) {
        toast.success(res.data.message || 'Password reset successfully! Please login.');
        return { success: true, message: res.data.message };
      } else {
        const msg = res.data.message || 'Failed to reset password';
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('stakelab_token');
    document.cookie = 'stakelab_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sec-prd-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    toast.info('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        requestPasswordReset,
        verifyOtp,
        resetPassword,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
