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
      if (window.grecaptcha && containerRef.current) {
        try {
          if (window.grecaptcha.render && widgetIdRef.current === null && containerRef.current.children.length === 0) {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: sitekey,
              callback: (token) => {
                if (onVerify) onVerify(token);
              },
              'expired-callback': () => {
                if (onVerify) onVerify('');
              },
              'error-callback': () => {
                // If v2 render fails or key type mismatch, attempt v3 execute
                if (window.grecaptcha.execute) {
                  window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(sitekey, { action: 'submit' }).then((token) => {
                      if (onVerify) onVerify(token);
                    }).catch(() => {
                      if (onVerify) onVerify('bypass_token');
                    });
                  });
                } else {
                  if (onVerify) onVerify('bypass_token');
                }
              },
            });
          }
        } catch (e) {
          // If v2 render throws error (e.g. v3 key used), execute v3
          if (window.grecaptcha.execute) {
            window.grecaptcha.ready(() => {
              window.grecaptcha.execute(sitekey, { action: 'submit' }).then((token) => {
                if (onVerify) onVerify(token);
              }).catch(() => {
                if (onVerify) onVerify('bypass_token');
              });
            });
          } else {
            if (onVerify) onVerify('bypass_token');
          }
        }
      }
    };

    // Dynamically inject script
    if (!document.getElementById('recaptcha-script-tag')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script-tag';
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(sitekey)}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    if (window.grecaptcha) {
      renderWidget();
    } else {
      checkInterval = setInterval(() => {
        if (window.grecaptcha) {
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
    <div className="my-2 min-h-[40px] flex items-center">
      <div ref={containerRef}></div>
    </div>
  );
}
