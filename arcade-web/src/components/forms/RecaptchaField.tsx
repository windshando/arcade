'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function RecaptchaField({ siteKey, onChange }: { siteKey?: string, onChange: (token: string) => void }) {
  const containerId = "recaptcha-container-" + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    const initRecaptcha = () => {
      if (typeof window !== 'undefined' && (window as any).grecaptcha && siteKey) {
        try {
          (window as any).grecaptcha.render(containerId, {
            sitekey: siteKey,
            callback: onChange,
            'expired-callback': () => onChange('')
          });
        } catch(e) {}
      }
    };

    if ((window as any).grecaptcha) {
      initRecaptcha();
    } else {
      (window as any).onRecaptchaLoad = initRecaptcha;
    }
  }, [siteKey, onChange, containerId]);

  if (!siteKey) return null;

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit" strategy="lazyOnload" />
      <div id={containerId} className="my-4 rounded-lg overflow-hidden"></div>
    </>
  );
}
