'use client';

import { useState } from 'react';
import RecaptchaField from './RecaptchaField';
import { useTracking } from '../TrackingProvider';

type FormType = 'JOB' | 'FRANCHISE';

export default function RecruitmentForm({ 
  type, 
  recaptchaSiteKey, 
  isRecaptchaEnabled,
  postings = []
}: { 
  type: FormType, 
  recaptchaSiteKey?: string,
  isRecaptchaEnabled?: boolean,
  postings?: any[]
}) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { getTrackingData } = useTracking();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRecaptchaEnabled && !token) {
      alert("Please complete the ReCAPTCHA");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.recaptchaToken = token;
    
    // Add tracking data
    const tracking = getTrackingData();
    payload.sessionDuration = tracking.sessionDuration.toString();
    payload.pageViews = tracking.pageViews.toString();

    const endpoint = type === 'JOB' ? '/api/v1/recruitment/public/jobs' : '/api/v1/recruitment/public/franchise';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit application');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center bg-card-bg border border-card-border rounded-3xl backdrop-blur-md">
        <h3 className="text-2xl font-bold text-green-500 mb-2">Application Received!</h3>
        <p className="opacity-70">Thank you for your interest. Our team will reach out to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-card-border shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">First Name</label>
          <input required name="firstName" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Last Name</label>
          <input required name="lastName" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Email Address</label>
          <input required type="email" name="email" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Phone Number</label>
          <input required type="tel" name="phone" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
        </div>
      </div>

      {type === 'JOB' ? (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Position Applied For</label>
          {postings?.length > 0 ? (
            <select required name="position" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border font-medium">
              <option value="">-- Select a role --</option>
              {postings.map(p => (
                <option key={p.id} value={p.translations?.[0]?.title || p.id}>
                  {p.translations?.[0]?.title || 'Unknown'} - {p.location}
                </option>
              ))}
              <option value="Spontaneous Application">General / Spontaneous Application</option>
            </select>
          ) : (
            <input required name="position" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
          )}
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Company Name</label>
            <input required name="companyName" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Expected Investment ($)</label>
              <input required name="investmentBudget" placeholder="e.g. 50,000" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Target Region</label>
              <input required name="region" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border" />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Message / Cover Letter</label>
        <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-card-border resize-none"></textarea>
      </div>

      {isRecaptchaEnabled && recaptchaSiteKey && (
        <RecaptchaField siteKey={recaptchaSiteKey} onChange={(t) => setToken(t)} />
      )}

      <button disabled={loading} type="submit" className="w-full btn-primary py-4 text-sm tracking-widest mt-4">
        {loading ? 'SUBMITTING...' : type === 'JOB' ? 'SUBMIT APPLICATION' : 'APPLY AS FRANCHISEE'}
      </button>
    </form>
  );
}
