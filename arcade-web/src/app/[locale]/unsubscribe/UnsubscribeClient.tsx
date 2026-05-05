'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertTriangle, Settings, XCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const availableTopics = [
  { value: 'ALL', label: 'All Updates' },
  { value: 'news', label: 'Company News' },
  { value: 'promotions', label: 'Special Promotions' },
  { value: 'new_products', label: 'New Machine Releases' },
];

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [currentTopics, setCurrentTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [status, setStatus] = useState<'LOADING' | 'READY' | 'UNSUBSCRIBED' | 'UPDATED' | 'ERROR' | 'INVALID'>('LOADING');

  useEffect(() => {
    if (!token) { setStatus('INVALID'); return; }

    fetch(`${API_BASE_URL}/newsletter/public/unsubscribe?token=${token}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        setSubscriberEmail(data.email);
        setCurrentTopics(data.topics);
        setSelectedTopics(data.topics);
        if (!data.isActive) {
          setStatus('UNSUBSCRIBED');
        } else {
          setStatus('READY');
        }
      })
      .catch(() => setStatus('INVALID'));
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      await fetch(`${API_BASE_URL}/newsletter/public/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      setStatus('UNSUBSCRIBED');
    } catch {
      setStatus('ERROR');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await fetch(`${API_BASE_URL}/newsletter/public/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, topics: selectedTopics })
      });
      setStatus('UPDATED');
    } catch {
      setStatus('ERROR');
    }
  };

  const toggleTopic = (val: string) => {
    if (val === 'ALL') {
      setSelectedTopics(['ALL']);
    } else {
      let next = selectedTopics.filter(t => t !== 'ALL');
      if (next.includes(val)) {
        next = next.filter(t => t !== val);
      } else {
        next.push(val);
      }
      if (next.length === 0) next = ['ALL'];
      setSelectedTopics(next);
    }
  };

  if (status === 'LOADING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground opacity-50 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (status === 'INVALID') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold mb-2 text-foreground">Invalid Link</h1>
          <p className="opacity-70">This unsubscribe link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (status === 'UNSUBSCRIBED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold mb-2 text-foreground">Unsubscribed</h1>
          <p className="opacity-70 mb-1">
            <strong>{subscriberEmail}</strong> has been removed from our mailing list.
          </p>
          <p className="text-sm opacity-50">You will no longer receive emails from us.</p>
        </div>
      </div>
    );
  }

  if (status === 'UPDATED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold mb-2 text-foreground">Preferences Updated</h1>
          <p className="opacity-70">Your subscription preferences have been saved.</p>
        </div>
      </div>
    );
  }

  // READY — show preferences + unsubscribe options
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 max-w-lg w-full">
        <div className="text-center mb-8">
          <Mail className="w-10 h-10 text-primary mx-auto mb-3 opacity-80" />
          <h1 className="text-2xl font-extrabold text-foreground mb-1">Email Preferences</h1>
          <p className="text-sm opacity-60">{subscriberEmail}</p>
        </div>

        {/* Topic Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 opacity-50" />
            <h2 className="font-bold text-sm uppercase tracking-widest opacity-70">Choose what you receive</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {availableTopics.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleTopic(t.value)}
                className={`px-4 py-3 text-sm font-bold rounded-xl border transition-all ${
                  selectedTopics.includes(t.value) 
                    ? 'bg-primary/15 text-primary border-primary/40 shadow-sm' 
                    : 'bg-transparent border-card-border text-foreground hover:border-primary/30'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="btn-primary w-full py-3 text-sm font-bold rounded-xl mb-4"
        >
          Save Preferences
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border"></div></div>
          <div className="relative flex justify-center"><span className="bg-card-bg px-4 text-xs opacity-50 uppercase tracking-widest font-bold">or</span></div>
        </div>

        <button
          onClick={handleUnsubscribe}
          className="w-full py-3 text-sm font-medium text-red-500 hover:text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Unsubscribe from all emails
        </button>
      </div>
    </div>
  );
}
