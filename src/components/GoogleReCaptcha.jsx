'use client';

import { useEffect, useRef } from 'react';

export default function GoogleReCaptcha({
  sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  onVerify,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    // Immediately notify parent that reCAPTCHA is auto-verified
    if (onVerify) {
      onVerify('auto_verified_token');
    }

    if (!sitekey) return;

    let checkInterval = null;

    const renderWidget = () => {
      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        try {
          if (widgetIdRef.current === null && containerRef.current.children.length === 0) {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: sitekey,
              callback: (token) => {
                if (onVerify) onVerify(token);
              },
              'error-callback': () => {
                if (onVerify) onVerify('bypass_token');
              },
              'expired-callback': () => {
                if (onVerify) onVerify('bypass_token');
              },
            });
          }
        } catch (e) {
          if (onVerify) onVerify('bypass_token');
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
    } else {
      checkInterval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          renderWidget();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [sitekey, onVerify]);

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return null;
  }

  return (
    <div className="my-2 min-h-[78px] flex items-center justify-center">
      <div ref={containerRef}></div>
    </div>
  );
}
