'use client';

import { useEffect } from 'react';

// This simply locks the slug into the browser memory natively.
export default function PromotionTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      // Expiration could be added, but holding it for the session is ideal for precise attribution
      localStorage.setItem('arcade_promo_id', slug);
      console.log('✅ Marketing Campaign Tagged:', slug);
    }
  }, [slug]);

  return null; // Entirely invisible
}
