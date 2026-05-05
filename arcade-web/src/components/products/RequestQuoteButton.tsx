'use client';

import { useState } from 'react';
import { useTracking } from '@/components/TrackingProvider';
import RecaptchaField from '@/components/forms/RecaptchaField';

export default function RequestQuoteButton({ 
  productName, 
  productSlug, 
  productId,
  recaptchaSiteKey 
}: { 
  productName: string; 
  productSlug: string;
  productId: string;
  recaptchaSiteKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { getTrackingData } = useTracking();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const tracking = getTrackingData();

    const payload = {
      contactName: formData.get('contactName'),
      companyName: formData.get('companyName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      countryCode: formData.get('countryCode') || '00',
      message: formData.get('message'),
      locale: 'EN',
      sourceChannel: 'PRODUCT_QUOTE',
      productId: productId,
      recaptchaToken: token,
      sessionDuration: tracking.sessionDuration,
      pageViews: tracking.pageViews
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

    try {
      const res = await fetch(`${baseUrl}/inquiries/public/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit quote request');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full btn-primary py-4 text-xl tracking-wide shadow-xl"
      >
        Request a Quote
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => !loading && setOpen(false)}>
          <div
            className="bg-card-bg border border-card-border rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 sm:p-10 relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-foreground opacity-50 hover:opacity-100 text-2xl leading-none">&times;</button>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Quote Request Sent!</h3>
                <p className="opacity-70 mb-6">Our sales team will prepare a quotation and reach out within 24 hours.</p>
                <button onClick={() => setOpen(false)} className="btn-primary px-8 py-3">Close</button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">Request a Quote</h2>
                <p className="text-primary font-bold mb-6">{productName}</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Full Name *</label>
                      <input required name="contactName" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Company</label>
                      <input name="companyName" placeholder="Acme Corp" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Email *</label>
                      <input required type="email" name="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Phone *</label>
                      <input required type="tel" name="phone" placeholder="+1 234 567 890" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Message / Requirements</label>
                    <textarea name="message" rows={4} defaultValue={`I'd like to request a quote for: ${productName}`} className="w-full px-4 py-3 rounded-xl bg-background border border-card-border resize-none text-sm"></textarea>
                  </div>

                  <RecaptchaField siteKey={recaptchaSiteKey} onChange={setToken} />

                  <button disabled={loading || (!!recaptchaSiteKey && !token)} type="submit" className="w-full btn-primary py-4 text-sm tracking-widest font-bold">
                    {loading ? 'SENDING...' : 'SUBMIT QUOTE REQUEST'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
