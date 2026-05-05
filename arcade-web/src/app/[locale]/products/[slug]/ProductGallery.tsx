"use client";

import React, { useState } from 'react';

type MediaItem = { url: string; type: string; isPrimary: boolean };

export default function ProductGallery({ media }: { media: MediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="glass-panel p-2 rounded-3xl sticky top-24">
        <div className="aspect-square bg-card-bg/50 rounded-2xl overflow-hidden relative border border-card-border flex items-center justify-center">
          <span className="opacity-40 font-bold tracking-widest text-lg">NO ASSETS</span>
        </div>
      </div>
    );
  }

  const activeMedia = media[activeIndex];

  return (
    <div className="glass-panel p-2 rounded-3xl sticky top-24">
      <div className="aspect-square bg-black rounded-2xl overflow-hidden relative border border-card-border">
        {activeMedia.type?.startsWith('video/') ? (
          <video 
            src={activeMedia.url} 
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat bg-card-bg/10" 
            style={{ backgroundImage: `url(${activeMedia.url})` }} 
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-4 p-4 mt-2 overflow-x-auto hide-scrollbar scroll-smooth">
          {media.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all duration-300 ${activeIndex === i ? 'border-primary opacity-100 scale-105 shadow-md shadow-primary/20 bg-card-bg' : 'border-card-border opacity-50 hover:opacity-100 bg-card-bg/50'}`}
            >
              {item.type?.startsWith('video/') ? (
                <div className="relative w-full h-full bg-black/80 flex items-center justify-center">
                   <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                     <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur shadow-sm">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3l14 9-14 9V3z"/>
                       </svg>
                     </div>
                   </div>
                   <video src={item.url} className="w-full h-full object-cover opacity-50 pointer-events-none" />
                </div>
              ) : (
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${item.url})` }} 
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
