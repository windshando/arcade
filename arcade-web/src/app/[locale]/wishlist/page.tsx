'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/components/products/ProductStoreProvider';
import { getPublicProducts } from '@/lib/api';
import { Link } from '@/i18n/routing';
import ProductActions from '@/components/products/ProductActions';

export default function WishlistPage() {
  const { wishlist, mounted } = useProductStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    // We fetch all products globally and filter to ensure we get up-to-date catalog info
    getPublicProducts('EN')
      .then(allProducts => {
        setProducts(allProducts.filter((p: any) => wishlist.includes(p.slug)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wishlist, mounted]);

  if (!mounted || loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold tracking-widest text-primary animate-pulse">LOADING...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in min-h-screen">
      <div className="mb-12 border-b border-card-border/50 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          My Saved Machines
        </h1>
        <p className="mt-2 opacity-70">
          You have {products.length} machine{products.length !== 1 ? 's' : ''} in your wishlist. {products.length > 0 && "Your list is securely saved on this device."}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl border-dashed border-2 bg-card-bg/30">
          <div className="text-6xl mb-6">💔</div>
          <h2 className="text-2xl font-bold mb-2">Your wishlist is completely empty</h2>
          <p className="opacity-60 mb-8 max-w-sm mx-auto">Explore our catalog and click the heart icon to save arcade machines here for later.</p>
          <Link href="/products" className="btn-primary shadow-lg shadow-primary/20">
            Browse All Machines
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group card-hover">
              <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col relative border border-card-border/50 hover:border-red-500/50">
                <div className="absolute top-3 right-3 z-10">
                  <ProductActions slug={product.slug} />
                </div>
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.media[0] ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.media[0].url})` }} />
                  ) : (
                    <span className="text-gray-400 font-medium tracking-widest text-xs">NO IMAGE</span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs text-primary font-black tracking-widest uppercase mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-red-500 line-clamp-1 pb-1">
                    {product.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
