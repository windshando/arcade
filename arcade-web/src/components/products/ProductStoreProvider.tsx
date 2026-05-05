'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ProductStoreContextType = {
  wishlist: string[];
  compareList: string[];
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  mounted: boolean; // exposed so UI doesn't mismatch on hydration
};

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('arcade_wishlist');
      const storedCompare = localStorage.getItem('arcade_compare');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedCompare) setCompareList(JSON.parse(storedCompare));
    } catch (e) {
      console.warn('Could not load product store from local storage', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('arcade_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('arcade_compare', JSON.stringify(compareList));
    }
  }, [wishlist, compareList, mounted]);

  const toggleWishlist = (slug: string) => {
    setWishlist(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const toggleCompare = (slug: string) => {
    setCompareList(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 4) {
        alert("You can only compare up to 4 machines at once.");
        return prev;
      }
      return [...prev, slug];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <ProductStoreContext.Provider value={{ wishlist, compareList, toggleWishlist, toggleCompare, clearCompare, mounted }}>
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductStoreContext);
  if (context === undefined) {
    throw new Error('useProductStore must be used within a ProductStoreProvider');
  }
  return context;
}
