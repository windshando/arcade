'use client';

import React from 'react';
import { useProductStore } from './ProductStoreProvider';
import { X, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StickyCompareBar() {
  const { compareList, clearCompare, mounted } = useProductStore();
  const router = useRouter();

  if (!mounted || compareList.length === 0) return null;

  const handleCompare = () => {
    router.push(`/en/compare?slugs=${compareList.join(',')}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center animate-slide-up">
      <div className="pointer-events-auto bg-card/90 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 rounded-2xl p-4 flex items-center gap-6 max-w-3xl w-full">
        
        <div className="flex items-center gap-3 bg-primary/10 p-2.5 rounded-xl text-primary">
          <Scale size={20} />
          <div className="font-bold flex flex-col leading-tight">
            <span className="text-sm">{compareList.length} / 4 Selected</span>
            <span className="text-[10px] opacity-70 uppercase tracking-widest">Compare Queue</span>
          </div>
        </div>

        <div className="flex-1 flex gap-2 overflow-hidden px-2">
           {/* Visual placeholders for queue length */}
           {[...Array(4)].map((_, i) => (
             <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-300 ${i < compareList.length ? 'bg-primary' : 'bg-card-border/50'}`} />
           ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={clearCompare}
            className="text-xs font-bold text-foreground opacity-60 hover:opacity-100 hover:text-red-500 transition-colors uppercase tracking-widest px-2"
          >
            Clear
          </button>
          <button 
            onClick={handleCompare}
            disabled={compareList.length < 2}
            className="btn-primary flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {compareList.length < 2 ? 'Add 1 More' : 'Compare Now'}
          </button>
          
          <button onClick={clearCompare} className="p-1 rounded-full hover:bg-card-border/50 transition-colors opacity-50 hover:opacity-100">
            <X size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
