"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { uploadMediaFile, createSlide, updateSlide } from '@/app/actions';
import { Layout, Image as ImageIcon, Type, Link as LinkIcon, Palette, Eye } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface SlideFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function SlideForm({ initialData, isEditing }: SlideFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    status: initialData?.status || 'DRAFT',
    url: initialData?.url || '',
    layoutStyle: initialData?.layoutStyle || 'LEFT_TEXT',
    buttonStyle: initialData?.buttonStyle || 'LIGHT',
    sortOrder: initialData?.sortOrder || 0,
    title: initialData?.translations?.[0]?.title || '',
    subtitle: initialData?.translations?.[0]?.subtitle || '',
    ctaText: initialData?.translations?.[0]?.ctaText || 'Learn More',
    desktopMediaId: initialData?.desktopMediaId || '',
    mobileMediaId: initialData?.mobileMediaId || '',
  });

  const [previews, setPreviews] = useState({
    desktop: initialData?.desktopMedia ? `${API_BASE_URL}/media/public/${initialData.desktopMedia.storageKey}` : '',
    mobile: initialData?.mobileMedia ? `${API_BASE_URL}/media/public/${initialData.mobileMedia.storageKey}` : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'desktopMediaId' | 'mobileMediaId') => {
    if (!e.target.files?.length) return;
    setUploadingField(field);
    setError('');

    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      const result = await uploadMediaFile(data);
      
      setFormData(prev => ({ ...prev, [field]: result.id }));
      setPreviews(prev => ({ 
        ...prev, 
        [field === 'desktopMediaId' ? 'desktop' : 'mobile']: `${API_BASE_URL}/media/public/${result.storageKey}` 
      }));
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      status: formData.status,
      url: formData.url,
      layoutStyle: formData.layoutStyle,
      buttonStyle: formData.buttonStyle,
      sortOrder: parseInt(formData.sortOrder.toString()),
      desktopMediaId: formData.desktopMediaId || null,
      mobileMediaId: formData.mobileMediaId || null,
      translations: [
        {
          locale: 'EN',
          title: formData.title,
          subtitle: formData.subtitle,
          ctaText: formData.ctaText,
        },
        // In a real app, I'd add ZH_CN etc. here or handle them in the UI
        { locale: 'ZH_CN', title: `[ZH] ${formData.title}`, subtitle: `[ZH] ${formData.subtitle}`, ctaText: `[ZH] ${formData.ctaText}` }
      ]
    };

    try {
      if (isEditing) {
        await updateSlide(initialData.id, payload);
      } else {
        await createSlide(payload);
      }
      router.push('/admin/slides');
    } catch (err: any) {
      setError(err.message || 'Failed to save slide');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Layout */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-lg mb-6"><ImageIcon size={20} className="text-primary" /> Slide Visuals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desktop Image */}
              <div>
                <label className="block text-sm font-bold opacity-70 mb-3">Desktop Background (1920x800+)</label>
                <div className="relative aspect-[16/7] bg-slate-900 rounded-xl overflow-hidden border border-card-border group">
                  {previews.desktop ? (
                    <img src={previews.desktop} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-2">
                       <ImageIcon size={40} />
                       <span className="text-xs">No image selected</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">
                        {uploadingField === 'desktopMediaId' ? 'Uploading...' : 'Change Image'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'desktopMediaId')} accept="image/*" />
                     </label>
                  </div>
                </div>
              </div>

              {/* Mobile Image */}
              <div>
                <label className="block text-sm font-bold opacity-70 mb-3">Mobile Background (Optional)</label>
                <div className="relative aspect-[9/16] h-[250px] mx-auto bg-slate-900 rounded-xl overflow-hidden border border-card-border group">
                   {previews.mobile ? (
                    <img src={previews.mobile} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-2 text-center px-4">
                       <ImageIcon size={32} />
                       <span className="text-[10px]">Use a vertical image for better mobile display</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">
                        {uploadingField === 'mobileMediaId' ? 'Uploading...' : 'Upload Mobile'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'mobileMediaId')} accept="image/*" />
                     </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="flex items-center gap-2 font-bold text-lg mb-6"><Type size={20} className="text-primary" /> Component Text</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Headline (Title)</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl text-lg font-bold" placeholder="READY FOR WINNING?" />
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Sub-headline (Description)</label>
                  <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl h-24" placeholder="High-performance arcade machines for your venue." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold opacity-70 mb-1">Call to Action Button</label>
                    <input name="ctaText" value={formData.ctaText} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl" placeholder="GET STARTED" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold opacity-70 mb-1">Destination URL</label>
                    <input name="url" value={formData.url} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl font-mono text-sm" placeholder="/products" />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="flex items-center gap-2 font-bold text-lg mb-6"><Palette size={20} className="text-primary" /> Visual Style</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Text Layout</label>
                  <select name="layoutStyle" value={formData.layoutStyle} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl">
                    <option value="LEFT_TEXT">Left Aligned Text</option>
                    <option value="RIGHT_TEXT">Right Aligned Text</option>
                    <option value="CENTER_BOTTOM">Center Bottom (Immersive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Button Theme</label>
                  <select name="buttonStyle" value={formData.buttonStyle} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl">
                    <option value="LIGHT">Light (Frosted/Glass)</option>
                    <option value="DARK">Dark (Primary Tech-Blue)</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="flex items-center gap-2 font-bold text-lg mb-6"><Eye size={20} className="text-primary" /> Status & Rank</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Visibility Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl">
                    <option value="PUBLISHED">Published (Visible)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-1">Display Priority</label>
                  <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl" />
                  <p className="text-[10px] opacity-40 mt-2">Lower numbers appear first.</p>
                </div>
             </div>
          </div>

          <div className="pt-4 space-y-4">
             <button type="submit" disabled={isSubmitting || !!uploadingField} className="w-full btn-primary py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                {isSubmitting ? 'SAVING...' : (isEditing ? 'UPDATE SLIDE' : 'CREATE SLIDE')}
             </button>
             <button type="button" onClick={() => router.back()} className="w-full py-4 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">
                Cancel and Go Back
             </button>
          </div>
        </div>
      </div>
    </form>
  );
}
