'use client';
import { useState, useEffect } from 'react';

// Hardcoded sample exchange rates for demonstration
// In production, this would be fetched from a Live Currency Exchange API daily via CRON job and stored in context
const MOCK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.23,
  JPY: 151.72,
  AUD: 1.54,
  CAD: 1.36
};

export default function DynamicPrice({ basePrice, baseCurrency = 'USD' }: { basePrice?: number, baseCurrency?: string }) {
  const [currency, setCurrency] = useState(baseCurrency);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('arcade_pref_currency');
    if (stored && MOCK_RATES[stored]) {
      setCurrency(stored);
      return;
    }

    const fetchGeo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.currency && MOCK_RATES[data.currency]) {
            setCurrency(data.currency);
            localStorage.setItem('arcade_pref_currency', data.currency);
          }
        }
      } catch (err) {}
    };
    fetchGeo();
  }, []);

  if (!basePrice) return null;
  if (!isClient) return <div className="h-10 animate-pulse bg-card-border/50 w-32 rounded-lg mb-4 mt-2"></div>;

  const currentRate = MOCK_RATES[currency] || 1;
  const baseRate = MOCK_RATES[baseCurrency] || 1;
  const convertedPrice = (basePrice / baseRate) * currentRate;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  });

  return (
    <div className="flex items-center gap-4 mb-4 mt-2">
      <span className="text-3xl font-extrabold text-primary">{formatter.format(convertedPrice)}</span>
      <select 
        value={currency} 
        onChange={(e) => {
          setCurrency(e.target.value);
          localStorage.setItem('arcade_pref_currency', e.target.value);
        }}
        className="bg-card-border border-none rounded-lg text-sm px-3 py-1.5 font-bold outline-none cursor-pointer text-foreground appearance-none"
      >
        {Object.keys(MOCK_RATES).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
