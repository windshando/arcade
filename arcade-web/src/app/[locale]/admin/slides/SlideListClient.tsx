'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { deleteSlide, updateSlide } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, Eye, EyeOff, Move, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function SlideListClient({ initialSlides }: { initialSlides: any[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const router = useRouter();

  useEffect(() => {
    setSlides(initialSlides);
  }, [initialSlides]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await deleteSlide(id);
      setSlides(slides.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete slide');
    }
  };

  const toggleStatus = async (slide: any) => {
    const newStatus = slide.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await updateSlide(slide.id, { status: newStatus });
      setSlides(slides.map(s => s.id === slide.id ? { ...s, status: newStatus } : s));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {slides.length === 0 ? (
        <div className="text-center py-20 bg-card-bg/30 border border-dashed border-card-border rounded-3xl">
          <p className="opacity-50">No slides created yet. Start by adding a new one.</p>
        </div>
      ) : (
        slides.map((slide, index) => (
          <div key={slide.id} className="glass-panel p-4 rounded-2xl flex items-center gap-6 group hover:border-primary/30 transition-all">
            {/* Preview */}
            <div className="relative w-48 h-28 bg-slate-900 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
               {slide.desktopMedia ? (
                 <img 
                    src={`${API_BASE_URL}/media/public/${slide.desktopMedia.storageKey}`} 
                    className="w-full h-full object-cover" 
                    alt="" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon size={32} />
                 </div>
               )}
               <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-[10px] text-white rounded font-bold uppercase transition-colors">
                  {slide.layoutStyle}
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-extrabold text-lg truncate">{slide.translations[0]?.title || 'Untitled Slide'}</h3>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    slide.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-500'
                 }`}>
                    {slide.status}
                 </span>
              </div>
              <p className="text-sm opacity-60 truncate mb-2">{slide.translations[0]?.subtitle || 'No subtitle'}</p>
              <div className="flex items-center gap-4 text-xs font-medium opacity-50">
                <span className="flex items-center gap-1"><Move size={12} /> Index: {slide.sortOrder}</span>
                <span className="flex items-center gap-1"><ImageIcon size={12} /> {slide.buttonStyle} Button</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pr-2">
              <button 
                onClick={() => toggleStatus(slide)}
                className={`p-2 rounded-lg transition-colors ${
                  slide.status === 'PUBLISHED' ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-success/10 text-success'
                }`}
                title={slide.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              >
                {slide.status === 'PUBLISHED' ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <Link 
                href={`/admin/slides/${slide.id}`}
                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                title="Edit Slide"
              >
                <Edit3 size={20} />
              </Link>
              <button 
                onClick={() => handleDelete(slide.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
