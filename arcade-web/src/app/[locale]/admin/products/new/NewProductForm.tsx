"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { createProduct, uploadMediaFile } from '@/app/actions';

export default function NewProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [mediaList, setMediaList] = useState<{ id: string, name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    sku: '',
    categoryId: categories.length > 0 ? categories[0].id : '',
    name: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    voltage: '',
    dimensions: '',
    weight: '',
    playerCount: '',
    moq: '',
    leadTimeDays: '',
    warrantyMonths: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    setError('');

    try {
      const newMedia: any[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const data = new FormData();
        data.append('file', file);
        const result = await uploadMediaFile(data);
        newMedia.push({ id: result.id, name: result.originalName });
      }
      setMediaList(prev => [...prev, ...newMedia]);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (idToRemove: string) => {
    setMediaList(prev => prev.filter(m => m.id !== idToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate and clean up
      const payload = {
        ...formData,
        mediaIds: mediaList.map(m => m.id),
        moq: formData.moq ? parseInt(formData.moq) : undefined,
        leadTimeDays: formData.leadTimeDays ? parseInt(formData.leadTimeDays) : undefined,
        warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : undefined,
      };

      await createProduct(payload);
      
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b border-card-border pb-2">Core Identity</h3>
          
          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">Product Name (EN) *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">URL Slug *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">SKU</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">Category *</label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary">
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.slug}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b border-card-border pb-2">Content & Display</h3>
          
          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">Short Description</label>
            <textarea name="shortDescription" rows={3} value={formData.shortDescription} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold opacity-80 mb-1">Full Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary"></textarea>
          </div>

          <label className="flex items-center gap-3 p-4 border border-card-border rounded-xl bg-card-bg/30 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-primary" />
            <span className="font-semibold text-sm">Feature on Homepage</span>
          </label>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="font-bold text-lg border-b border-card-border pb-2 mb-4">Specifications</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">Voltage</label>
            <input type="text" name="voltage" value={formData.voltage} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="e.g. 110V-220V" />
          </div>
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">Dimensions</label>
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="W x D x H" />
          </div>
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">Weight</label>
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="e.g. 120kg" />
          </div>
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">Player Count</label>
            <input type="text" name="playerCount" value={formData.playerCount} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="e.g. 1-8" />
          </div>
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">MOQ</label>
            <input type="number" name="moq" value={formData.moq} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="e.g. 1" />
          </div>
          <div>
            <label className="block text-xs font-semibold opacity-70 mb-1">Lead Time (Days)</label>
            <input type="number" name="leadTimeDays" value={formData.leadTimeDays} onChange={handleChange} className="w-full bg-card-bg/50 border border-card-border p-2 rounded-lg text-sm" placeholder="e.g. 15" />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="font-bold text-lg border-b border-card-border pb-2 mb-4">Media Items</h3>
        <div className="border-2 border-dashed border-card-border rounded-xl p-8 text-center bg-card-bg/30">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,video/*"
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="btn-primary inline-block px-6 py-2.5 rounded-xl font-bold mb-3 shadow-md">
              {isUploading ? 'Uploading...' : 'Browse Files'}
            </div>
          </label>
          <p className="text-sm opacity-60">Upload multiple images or videos. The first item becomes the primary cover.</p>
        </div>
        
        {mediaList.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {mediaList.map((media, idx) => (
              <div key={media.id} className="relative bg-card-bg border border-card-border px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                <span className="text-sm font-medium pr-8 truncate max-w-[150px]">{media.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(media.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/10 text-red-500 rounded flex items-center justify-center hover:bg-red-500/20"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-8 border-t border-card-border gap-4">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl font-bold border border-card-border hover:bg-card-border/50 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting || isUploading} className="btn-primary px-8 py-2.5 rounded-xl font-bold shadow-lg">
          {isSubmitting ? 'Saving...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
