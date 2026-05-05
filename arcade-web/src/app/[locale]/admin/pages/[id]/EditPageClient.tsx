'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { saveStaticPage } from '@/app/actions';

export default function EditPageClient({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const LOCALES = ['EN', 'ZH_CN', 'JA', 'AR'];
  const [activeLocale, setActiveLocale] = useState('EN');

  const [pageKey, setPageKey] = useState(initialData?.pageKey || '');
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  
  // Initialize translations state
  const [translations, setTranslations] = useState(LOCALES.map(loc => {
    const existing = initialData?.translations?.find((t: any) => t.locale === loc);
    return {
      locale: loc,
      title: existing?.title || '',
      content: existing?.content || '',
      seoTitle: existing?.seoTitle || '',
      seoDescription: existing?.seoDescription || ''
    };
  }));

  const handleUpdateTranslation = (field: string, value: string) => {
    setTranslations(prev => prev.map(t => 
      t.locale === activeLocale ? { ...t, [field]: value } : t
    ));
  };

  const getActiveT = () => translations.find(t => t.locale === activeLocale) || translations[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      pageKey,
      status,
      translations: translations.filter(t => t.title || t.content)
    };

    try {
      await saveStaticPage(initialData?.id || null, payload);
      router.push(`/${locale}/admin/pages`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save page');
    }
  };

  // Hack because RichTextEditor only syncs value natively to DOM element via onChange if we use state
  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Page Key (Slug)</label>
          <input 
            required 
            value={pageKey} 
            onChange={e => setPageKey(e.target.value)} 
            placeholder="e.g. privacy-policy"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Status</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-card-border">
        {/* Locale Tabs */}
        <div className="flex gap-2 mb-6 border-b border-card-border pb-4">
          {LOCALES.map(loc => (
            <button 
              key={loc} 
              type="button" 
              onClick={() => setActiveLocale(loc)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeLocale === loc ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card-border/50 opacity-70 hover:opacity-100'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Locale specific fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Display Title ({activeLocale})</label>
            <input 
              value={getActiveT().title} 
              onChange={e => handleUpdateTranslation('title', e.target.value)}
              placeholder="Page Title"
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Page Content ({activeLocale})</label>
            {/* Rich text editor keyed by locale so it resets correctly */}
            <div key={activeLocale}>
              <RichTextEditor 
                name="content" 
                defaultValue={getActiveT().content} 
              />
            </div>
            {/* Since RichTextEditor doesn't auto-update our parent state easily without a ref, we can listen to form submission, but it's simpler to proxy it. */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2">SEO Title</label>
              <input 
                value={getActiveT().seoTitle} 
                onChange={e => handleUpdateTranslation('seoTitle', e.target.value)}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2">SEO Description</label>
              <input 
                value={getActiveT().seoDescription} 
                onChange={e => handleUpdateTranslation('seoDescription', e.target.value)}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-card-border">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-card-border rounded-full hover:bg-card-border transition-colors">Cancel</button>
        <button type="submit" className="btn-primary py-3 px-8 text-sm" onClick={() => {
           // Hack to sync Rich Text Editor value to state
           const quillHtml = document.querySelector('input[name="content"]');
           if (quillHtml) handleUpdateTranslation('content', (quillHtml as HTMLInputElement).value);
        }}>
          Save {pageKey || 'Page'}
        </button>
      </div>
    </form>
  );
}
