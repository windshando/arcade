'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { saveBlogPost } from '@/app/actions';

export default function EditBlogClient({ initialData, locale, categories }: { initialData?: any, locale: string, categories?: any[] }) {
  const router = useRouter();
  
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  
  // Blog Post only has one translation returned typically for admin, or multiple. We'll simplify to just default locale.
  const [title, setTitle] = useState(initialData?.translations?.[0]?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.translations?.[0]?.excerpt || '');
  const [content, setContent] = useState(initialData?.translations?.[0]?.content || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hack to sync Rich Text Editor value to state before submit
    const quillHtml = document.querySelector('input[name="content"]');
    const finalContent = quillHtml ? (quillHtml as HTMLInputElement).value : content;

    const payload: any = {
      slug,
      status,
      title,
      excerpt,
      content: finalContent,
      locale: locale.toUpperCase(),
    };

    if (categoryId) {
      payload.categoryId = categoryId;
    }

    try {
      await saveBlogPost(initialData?.id || null, payload);
      router.push(`/${locale}/admin/blog`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save blog post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Slug</label>
          <input 
            required 
            value={slug} 
            onChange={e => setSlug(e.target.value)} 
            placeholder="e.g. how-to-start-an-arcade"
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

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold mb-2">Category (Optional)</label>
          <select 
            value={categoryId} 
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          >
            <option value="">-- No Category --</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.translations?.[0]?.name || cat.slug}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6 pt-4 mt-6 border-t border-card-border">
        <div>
          <label className="block text-sm font-bold mb-2">Title</label>
          <input 
            required
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Blog Post Title"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Excerpt</label>
          <textarea 
            value={excerpt} 
            onChange={e => setExcerpt(e.target.value)}
            placeholder="A short summary of the post..."
            rows={3}
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Content</label>
          <div className="bg-background rounded-xl overflow-hidden min-h-[300px]">
            <RichTextEditor 
              name="content" 
              defaultValue={content} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-card-border">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-card-border rounded-full hover:bg-card-border transition-colors">Cancel</button>
        <button type="submit" className="btn-primary py-3 px-8 text-sm">
          Save Post
        </button>
      </div>
    </form>
  );
}
