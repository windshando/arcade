'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import ProductActions from '@/components/products/ProductActions';

export default function FeaturedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  // We should pick the top 6 featured products
  const featured = products.slice(0, 6);

  return (
    <section className="py-24 relative bg-background">
      <div className="container mx-auto px-6 mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-foreground mb-4">
            Flagship <span className="text-primary">Machines</span>
          </h2>
          <p className="text-lg opacity-60">
            Engineered for high-throughput environments. Our most requested cabinet architectures, fully customizable for your venue.
          </p>
        </div>
        <Link 
          href="/products"
          className="group inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase hover:text-white transition-colors border-b-2 border-primary/30 hover:border-primary pb-1"
        >
          View Full Catalog <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => {
            const hasMedia = product.media && product.media.length > 0;
            return (
              <Link 
                href={`/products/${product.slug}`} 
                key={product.id} 
                className="group relative overflow-hidden rounded-3xl bg-card-bg border border-card-border/50 card-hover flex flex-col h-[400px]"
              >
                {/* Image Section */}
                <div className="absolute inset-0 bg-black z-0">
                  {hasMedia ? (
                    <div 
                      className="w-full h-full bg-cover bg-center opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" 
                      style={{ backgroundImage: `url(${product.media[0].url})` }} 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-black">
                       <span className="text-2xl font-black tracking-widest text-slate-700 uppercase">Classified</span>
                    </div>
                  )}
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                  <div className="mb-auto flex justify-between items-start">
                    <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                      {product.category || 'Arcade'}
                    </span>
                    <div onClick={(e) => e.preventDefault()} className="z-20">
                      <ProductActions slug={product.slug} />
                    </div>
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="h-0 group-hover:h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {product.shortDescription || 'Experience industry-leading ROI with our state-of-the-art gaming hardware.'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
