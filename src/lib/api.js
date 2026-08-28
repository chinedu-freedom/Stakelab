import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stakelab_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401 || error.response?.status === 403) && typeof window !== 'undefined') {
      const authPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp', '/'];
      const isAuthPage = authPages.some((path) => window.location.pathname === path);

      localStorage.removeItem('stakelab_token');
      localStorage.removeItem('sec-prd-token');
      localStorage.removeItem('impersonate_token');

      const isLocal = window.location.hostname.includes('localhost');
      const domainAttr = !isLocal ? '; domain=.everstake.cx' : '';
      document.cookie = `stakelab_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`;
      document.cookie = `sec-prd-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`;
      document.cookie = 'stakelab_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'sec-prd-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      if (!isAuthPage) {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
