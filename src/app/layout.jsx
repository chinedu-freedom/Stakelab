import './globals.css';
import { Inter, Righteous } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous',
  display: 'swap',
});

import Script from 'next/script';

export const metadata = {
  title: 'StakeLab - Crypto Buy Sell and Staking Platform',
  description: 'Explore StakeLab – your premier destination for hassle-free crypto buying, selling, and staking. Maximize your investment potential with our seamless platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${righteous.variable}`}>
      <head>
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
        <AuthProvider>
          {children}
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
