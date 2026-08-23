'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function FaviconGuard() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fetchLogoFavicon = async () => {
      try {
        const res = await api.get('/public/logo-favicon');
        if (res.data && res.data.success && res.data.settings) {
          const { logoUrl: logo, faviconUrl: fav } = res.data.settings;
          
          if (fav) {
            setFaviconUrl(fav);
            // Dynamically update favicon link tag in <head>
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'shortcut icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = fav;
          }

          if (logo) {
            setLogoUrl(logo);
            // Broadcast logo to headers & sidebars
            window.siteCustomLogoUrl = logo;
            window.dispatchEvent(new CustomEvent('site-logo-updated', { detail: logo }));
          }
        }
      } catch (err) {
        // Fallback silently if offline or not configured yet
      }
    };

    fetchLogoFavicon();
  }, []);

  return null;
}
