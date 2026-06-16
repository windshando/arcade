'use client';

import React, { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('arcade_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('arcade_cookie_consent', 'accepted');
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem('arcade_cookie_consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 transform transition-transform animate-slide-up">
      <div className="glass-panel mx-auto max-w-4xl p-6 rounded-2xl border border-card-border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-surface-elevated/80">
        <div className="text-sm opacity-90 max-w-2xl">
          <p className="font-bold mb-1">We respect your privacy</p>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies per GDPR guidelines.
        </div>
        <div className="flex gap-3 whitespace-nowrap">
          <button onClick={reject} className="btn-secondary text-xs">
            Reject All
          </button>
          <button onClick={accept} className="btn-primary text-xs">
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
