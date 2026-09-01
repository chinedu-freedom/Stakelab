import './globals.css';
import { Inter, Righteous } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous',
  display: 'swap',
  fallback: ['system-ui', 'cursive'],
  adjustFontFallback: false,
});

import Script from 'next/script';

export const metadata = {
  title: 'EverStake - Premier Crypto Staking & Yield Platform',
  description: 'Explore EverStake – your premier destination for hassle-free crypto buying, selling, and high-yield staking. Maximize your investment potential with our seamless platform at everstake.cx.',
};

import MaintenanceGuard from '../components/MaintenanceGuard';
import CookieConsentBanner from '../components/CookieConsentBanner';
import DailyCheckinModal from '../components/DailyCheckinModal';
import FaviconGuard from '../components/FaviconGuard';
import PwaInstallHandler from '../components/PwaInstallHandler';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${righteous.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EverStake" />
        <meta name="theme-color" content="#07193b" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" />
        <Script
          id="google-translate-script"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement(
                { pageLanguage: 'en', autoDisplay: false },
                'google_translate_element'
              );
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-[#07193b] text-slate-100 antialiased min-h-screen font-sans`}>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <FaviconGuard />
        <AuthProvider>
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
          <DailyCheckinModal />
          <CookieConsentBanner />
          <PwaInstallHandler />
          <Toaster position="top-right" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
