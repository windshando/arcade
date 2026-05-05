'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  url: string;
  layoutStyle: string; // LEFT_TEXT, RIGHT_TEXT, CENTER_BOTTOM
  buttonStyle: string; // LIGHT, DARK
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  if (!slides || slides.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
             {/* Desktop Image */}
             <div className="hidden md:block w-full h-full relative">
                <Image
                    src={slide.desktopImageUrl || '/placeholder.jpg'}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    className={`object-cover object-center transition-transform duration-[6000ms] ease-linear ${
                        idx === current ? 'scale-110' : 'scale-100'
                    }`}
                />
             </div>
             {/* Mobile Image */}
             <div className="block md:hidden w-full h-full relative">
                <Image
                    src={slide.mobileImageUrl || slide.desktopImageUrl || '/placeholder.jpg'}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center"
                />
             </div>
          </div>

          {/* Tech Overlays */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          {/* Content Wrapper */}
          <div className={`relative h-full container mx-auto px-6 flex items-center ${
            slide.layoutStyle === 'RIGHT_TEXT' ? 'justify-end text-right' : 
            slide.layoutStyle === 'CENTER_BOTTOM' ? 'justify-center items-end pb-32 text-center' : 
            'justify-start text-left'
          }`}>
            <div className={`max-w-3xl transform transition-all duration-700 delay-300 ${
                idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <h1 className="text-4xl md:text-8xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-6 leading-[1] uppercase tracking-tight">
                    {slide.title}
                </h1>
                <p className="text-lg md:text-2xl text-white/90 mb-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-medium max-w-2xl mx-auto md:mx-0"
                   style={{ marginLeft: slide.layoutStyle === 'CENTER_BOTTOM' ? 'auto' : (slide.layoutStyle === 'RIGHT_TEXT' ? 'auto' : '0') }}
                >
                    {slide.subtitle}
                </p>
                {slide.ctaText && (
                    <a 
                        href={slide.url || '#'}
                        className={`inline-block px-12 py-5 rounded-full text-lg font-bold uppercase tracking-wider transition-all shadow-2xl hover:scale-105 active:scale-95 ${
                            slide.buttonStyle === 'DARK' 
                            ? 'bg-primary text-white hover:bg-primary-hover shadow-primary/40' 
                            : 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 shadow-white/10'
                        }`}
                    >
                        {slide.ctaText}
                    </a>
                )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation UI */}
      {slides.length > 1 && (
        <>
          {/* Side Arrows */}
          <button 
            onClick={prev}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/10 hover:bg-white/10 border border-white/10 text-white backdrop-blur-lg transition-all group"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={next}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/10 hover:bg-white/10 border border-white/10 text-white backdrop-blur-lg transition-all group"
          >
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
            {slides.map((_, dotIdx) => (
                <button 
                    key={dotIdx}
                    onClick={() => setCurrent(dotIdx)}
                    className={`group relative h-1 transition-all duration-500 rounded-full overflow-hidden ${
                        dotIdx === current ? 'w-16 bg-white/20' : 'w-8 bg-white/10 hover:bg-white/30'
                    }`}
                >
                    {dotIdx === current && (
                        <div className="absolute left-0 top-0 h-full bg-primary animate-[progress_6s_linear_forwards]" />
                    )}
                </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
