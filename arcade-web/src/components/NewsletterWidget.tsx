'use client';

import React, { useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('LOADING');

    try {
      await fetchAPI('/newsletter/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topics: ['ALL'] })
      });
      setStatus('SUCCESS');
      setEmail('');
    } catch (e) {
      console.error(e);
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center w-full max-w-2xl">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <h4 className="font-extrabold text-green-500 mb-1">You&apos;re in! 🎉</h4>
        <p className="text-sm opacity-80 text-foreground">You&apos;ll receive all our latest updates.</p>
        <button onClick={() => setStatus('IDLE')} className="mt-4 text-xs font-bold text-green-600 hover:underline">
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card-bg/50 border border-card-border p-8 rounded-2xl w-full max-w-2xl text-center">
      <h3 className="font-extrabold text-lg text-foreground mb-1">Stay heavily wired.</h3>
      <p className="text-sm opacity-60 mb-5">Get first-run access to new shipments, promotions &amp; industry news.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <Mail className="w-4 h-4" />
          </div>
          <input 
            type="email" 
            required 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'LOADING'}
            className="w-full pl-10 pr-28 py-3 bg-background border border-card-border rounded-xl text-sm outline-none focus:border-primary peer"
          />
          <button 
            type="submit" 
            disabled={status === 'LOADING'}
            className="absolute right-1 top-1 bottom-1 px-5 btn-primary rounded-lg text-xs font-bold flex items-center gap-2"
          >
            {status === 'LOADING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
          </button>
        </div>
        {status === 'ERROR' && <p className="text-xs text-red-500 font-bold mt-2">A network error occurred. Try again.</p>}
      </form>
    </div>
  );
}
