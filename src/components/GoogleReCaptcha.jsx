'use client';

import { useEffect, useRef } from 'react';

export default function GoogleReCaptcha({
  sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeD_5QtAAAAALP5DoenKhH2EeLwMzpjNe63iQ59',
  onVerify,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
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
              'expired-callback': () => {
                if (onVerify) onVerify('');
              },
            });
          }
        } catch (e) {
          // Widget already rendered
        }
      }
    };

    // Dynamically inject Google reCAPTCHA script if not present
    if (!document.getElementById('recaptcha-script-tag')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script-tag';
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

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

  return (
    <div className="my-2 min-h-[78px] flex items-center">
      <div ref={containerRef}></div>
    </div>
  );
}
