'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, Cpu, Anchor, Gamepad2 } from 'lucide-react';

export default function CategoryAccordion({ categories }: { categories: any[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1); // Default center open

  // We are expecting 3 categories specifically for this showcase.
  // If there are more or less, we slice the first 3.
  const showcaseCategories = categories.slice(0, 3);

  // Fallback map because local files copied from generation have timestamps in the name
  // We'll just define an array of fallback image paths, or use gradient blocks if not found.
  const getFallbackIcon = (slug: string) => {
    if (slug.includes('fish')) return <Anchor size={48} className="drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />;
    if (slug.includes('roulette')) return <Cpu size={48} className="drop-shadow-[0_0_15px_rgba(255,0,128,0.8)]" />;
    return <Gamepad2 size={48} className="drop-shadow-[0_0_15px_rgba(255,255,0,0.8)]" />;
  };

  const getFallbackImages = (slug: string) => {
    // These paths might not match the exact timestamp file names, so we just use dynamic fallback colors
    // But since we want the high tech images we generated, let's just reference the local dir if we had exact names.
    // For now, we'll map them via css backgrounds with sleek gradients if no coverUrl is explicitly provided.
    return '';
  };

  if (!showcaseCategories || showcaseCategories.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-foreground mb-4">
          Core <span className="text-primary">Ecosystem</span>
        </h2>
        <p className="text-lg opacity-60 max-w-2xl mx-auto">
          Explore our premier gaming cabinet architectures, engineered for maximum revenue retention and unparalleled player engagement.
        </p>
      </div>

      <div className="container mx-auto px-6 h-[800px] md:h-[600px]">
        <div className="flex flex-col md:flex-row w-full h-full gap-4 transition-all duration-500 ease-in-out">
          {showcaseCategories.map((category, idx) => {
            const isHovered = hoveredIndex === idx;
            const fallbackColor = idx === 0 ? 'from-[rgba(255,0,128,0.2)] to-black/80' : idx === 1 ? 'from-[rgba(0,255,255,0.2)] to-black/80' : 'from-[rgba(255,255,0,0.2)] to-black/80';
            const icon = getFallbackIcon(category.slug);

            return (
              <div 
                key={category.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                /* For mobile touch devices, allow clicking to expand */
                onClick={() => setHoveredIndex(idx)}
                className={`relative group rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border border-white/5 ${
                  isHovered ? 'h-[50%] md:h-auto md:w-[50%] shadow-[0_0_40px_rgba(var(--primary),0.2)]' : 'h-[25%] md:h-auto md:w-[25%] opacity-70 hover:opacity-100'
                }`}
              >
                {/* Background Representation */}
                <div className={`absolute inset-0 bg-gradient-to-b ${fallbackColor} transition-opacity duration-500 z-10 hidden md:block`} />
                <div className={`absolute inset-0 bg-gradient-to-t ${fallbackColor} transition-opacity duration-500 z-10 md:hidden`} />

                {category.coverUrl ? (
                  <Image 
                    src={category.coverUrl} 
                    alt={category.name} 
                    fill 
                    className={`object-cover transition-transform duration-1000 ${isHovered ? 'scale-110' : 'scale-100 grayscale-[50%]'}`} 
                  />
                ) : (
                  <div className={`absolute inset-0 bg-slate-900 transition-transform duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    {/* Placeholder abstract grid for cyber feel */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      perspective: '1000px',
                      transform: 'rotateX(60deg) scale(2)',
                      transformOrigin: 'bottom'
                    }} />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                  <div className={`transition-all duration-700 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-60'}`}>
                    <div className={`mb-4 transition-transform duration-700 ${isHovered ? 'scale-100' : 'scale-75 origin-bottom-left'}`}>
                      {icon}
                    </div>
                    <h3 className={`font-extrabold uppercase tracking-tight transition-all duration-700 ${isHovered ? 'text-4xl text-white' : 'text-2xl text-slate-300'}`}>
                      {category.name}
                    </h3>
                  </div>

                  <div className={`mt-4 overflow-hidden transition-all duration-700 ${isHovered ? 'max-h-40 opacity-100 delay-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-300 mb-6 line-clamp-3">
                      {category.description || 'Dive into our cutting-edge immersive systems tailored for global entertainment hubs.'}
                    </p>
                    <Link 
                      href={`/products?category=${category.slug}`}
                      className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary/50 hover:border-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                    >
                      Explore Systems <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
