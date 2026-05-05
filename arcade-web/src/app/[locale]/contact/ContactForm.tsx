'use client';

import { useState, useEffect } from 'react';
import { postContactInquiry } from '@/lib/api';
import RecaptchaField from '@/components/forms/RecaptchaField';

export default function ContactForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [globalOps, setGlobalOps] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`);
        if (res.ok) {
          const data = await res.json();
          setGlobalOps(data.global_options || {});
        }
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (globalOps.isRecaptchaEnabled === true || globalOps.isRecaptchaEnabled === 'true') {
      if (!token) {
        setError('Please complete the ReCAPTCHA challenge.');
        return;
      }
    }
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      locale: locale === 'zh-CN' ? 'ZH_CN' : 'EN',
      contactName: formData.get('contactName'),
      companyName: formData.get('companyName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      countryCode: formData.get('countryCode') || '00',
      message: formData.get('message'),
      sourceChannel: 'WEBSITE_CONTACT',
      utmCampaign: typeof window !== 'undefined' ? localStorage.getItem('arcade_promo_id') : null,
      landingPageUrl: typeof window !== 'undefined' ? window.location.href : null,
      recaptchaToken: token,
    };

    try {
      await postContactInquiry(data);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl animate-fade-in border border-success/20">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4">Message Sent Successfully!</h3>
        <p className="opacity-70 mb-8">Our sales team will get back to you within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="btn-primary px-8 py-3">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 md:p-12 rounded-3xl">
      <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Full Name *</label>
            <input required type="text" name="contactName" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Company Name</label>
            <input type="text" name="companyName" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Arcade Master LLC" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Email Address *</label>
            <input required type="email" name="email" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Phone Number (with Country Code) *</label>
            <input required type="text" name="phone" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="+1 234 567 8900" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Message / Inquiry Details *</label>
          <textarea required name="message" rows={5} className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Required capacity, shipping destination, etc..." />
        </div>

        {(globalOps.isRecaptchaEnabled === true || globalOps.isRecaptchaEnabled === 'true') && globalOps.recaptchaSiteKey && (
          <RecaptchaField siteKey={globalOps.recaptchaSiteKey} onChange={(t) => setToken(t)} />
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 text-lg btn-primary shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Sending...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
