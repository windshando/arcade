'use client';

import React from 'react';
import { Heart, Scale } from 'lucide-react';
import { useProductStore } from './ProductStoreProvider';

export default function ProductActions({ slug, className = "" }: { slug: string, className?: string }) {
  const { wishlist, compareList, toggleWishlist, toggleCompare, mounted } = useProductStore();

  // Prevent layout shift/hydration mismatch gracefully
  if (!mounted) return (
    <div className={`flex gap-2 opacity-0 ${className}`}>
      <button className="w-10 h-10 rounded-full bg-card/50"></button>
      <button className="w-10 h-10 rounded-full bg-card/50"></button>
    </div>
  );

  const inWishlist = wishlist.includes(slug);
  const inCompare = compareList.includes(slug);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={(e) => { e.preventDefault(); toggleCompare(slug); }}
        aria-pressed={inCompare}
        className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center justify-center group ${
          inCompare 
            ? 'bg-primary text-on-dark border-primary hover:bg-primary-hover' 
            : 'bg-card-bg/50 border-card-border/50 text-foreground hover:border-primary hover:text-primary'
        }`}
        title={inCompare ? "Remove from Compare" : "Add to Compare"}
      >
        <Scale size={18} className={inCompare ? '' : 'opacity-70 group-hover:opacity-100'} />
      </button>
      
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(slug); }}
        aria-pressed={inWishlist}
        className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center justify-center group ${
          inWishlist 
            ? 'bg-danger text-on-dark border-danger hover:brightness-110' 
            : 'bg-card-bg/50 border-card-border/50 text-foreground hover:border-danger hover:text-danger'
        }`}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart size={18} className={inWishlist ? 'fill-current' : 'opacity-70 group-hover:opacity-100'} />
      </button>
    </div>
  );
}
