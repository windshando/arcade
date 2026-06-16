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
      <div className="container-page mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
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

      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, idx) => {
            const hasMedia = product.media && product.media.length > 0;
            // Gradient backgrounds for cards without images
            const gradients = [
              'from-blue-100 via-indigo-50 to-purple-100',
              'from-emerald-100 via-teal-50 to-cyan-100',
              'from-amber-100 via-orange-50 to-rose-100',
              'from-violet-100 via-fuchsia-50 to-pink-100',
              'from-sky-100 via-blue-50 to-indigo-100',
              'from-lime-100 via-green-50 to-emerald-100',
            ];
            const gradientBg = gradients[idx % gradients.length];

            return (
              <Link 
                href={`/products/${product.slug}`} 
                key={product.id} 
                className="group overflow-hidden rounded-3xl bg-card-bg border border-card-border card-hover flex flex-col shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  {hasMedia ? (
                    <Image
                      src={product.media[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} flex items-center justify-center`}>
                      <span className="text-sm font-bold tracking-widest text-text-tertiary uppercase">No Image</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-card-bg/90 backdrop-blur-sm text-primary border border-card-border rounded-full shadow-sm">
                      {product.category || 'Arcade'}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
                    <ProductActions slug={product.slug} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 flex-1">
                    {product.shortDescription || 'Experience industry-leading ROI with our state-of-the-art gaming hardware.'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-card-border/50 flex items-center justify-between text-sm font-bold text-primary">
                    <span>View Details</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
