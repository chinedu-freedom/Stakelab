'use client';

import { useEffect, useRef } from 'react';

export default function GoogleReCaptcha({
  sitekey = '6LdPC88fAAAAADQlUf_DV6Hrvgm-pZuLJFSLDOWV',
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
            });
          }
        } catch (e) {
          // Handled if widget already rendered
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
      }, 50);
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
