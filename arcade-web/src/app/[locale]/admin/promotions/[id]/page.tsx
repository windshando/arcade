import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { redirect } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

async function savePromotion(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as string;
  const bodyHtml = formData.get('bodyHtml') as string;
  const targetProductId = formData.get('targetProductId') as string;
  const targetCategoryId = formData.get('targetCategoryId') as string;
  
  await fetchAdminAPI(`/promotions/admin`, {
    method: 'POST',
    body: JSON.stringify({ id, title, slug, description, status, bodyHtml, targetProductId, targetCategoryId })
  });
  
  redirect('/en/admin/promotions');
}

export default async function AdminPromotionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';

  let promo = {
    id: 'new',
    title: '',
    slug: '',
    description: '',
    status: 'DRAFT',
    bodyHtml: ''
  } as any;

  if (!isNew) {
    promo = await fetchAdminAPI(`/promotions/admin/${resolvedParams.id}`);
  }

  const [products, categories] = await Promise.all([
    fetchAdminAPI('/products/admin'),
    fetchAdminAPI('/categories/admin')
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto mb-20">
      <div className="mb-8">
        <Link href="/admin/promotions" className="text-primary text-sm hover:underline font-bold mb-4 inline-block">
          ← Back to Marketing Engine
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground mb-1">
          {isNew ? 'Launch New Campaign' : 'Edit Campaign'}
        </h1>
        <p className="opacity-60 text-sm">Design the public landing page. Any leads generated through this route will be organically tagged.</p>
      </div>

      <div className="glass-panel p-8 md:p-12 border border-card-border shadow-sm rounded-2xl bg-card-bg">
        <form action={savePromotion} className="space-y-8">
          <input type="hidden" name="id" value={promo.id} />

          <div className="flex gap-4 items-center bg-primary/10 border border-primary/20 p-6 rounded-xl">
            <div className="flex-1">
              <label className="block text-sm font-bold opacity-70 uppercase tracking-widest text-primary mb-2">Live Availability</label>
              <p className="text-xs opacity-70 max-w-md">If set to published, the link resolves correctly and leads begin tracking automatically.</p>
            </div>
            <select 
              name="status" 
              defaultValue={promo.status}
              className={`px-6 py-4 rounded-xl font-black uppercase tracking-widest shadow-sm ${
                promo.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-background text-foreground'
              }`}
            >
              <option value="DRAFT">DRAFT (Hidden)</option>
              <option value="PUBLISHED">PUBLISHED (Live)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Campaign Name</label>
              <input 
                name="title" 
                defaultValue={promo.title}
                required 
                placeholder="e.g. Summer Mega Arcade Sale"
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">URL Route Slug</label>
              <div className="flex">
                <span className="bg-background border border-r-0 border-card-border px-4 py-3 rounded-l-xl opacity-50 font-mono text-sm hidden md:block">
                  yoursite.com/promotions/
                </span>
                <input 
                  name="slug" 
                  defaultValue={promo.slug || ''}
                  required 
                  placeholder="summer-mega-sale"
                  className="w-full px-4 py-3 bg-background border border-card-border md:rounded-l-none rounded-r-xl rounded-l-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-card-border/50 pt-8 mt-8">
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Connect Specific Product</label>
              <select name="targetProductId" defaultValue={promo.targetProductId || ''} className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium">
                <option value="">-- None (Generic Promotion) --</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.translations?.[0]?.name || p.slug}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Connect Whole Category</label>
              <select name="targetCategoryId" defaultValue={promo.targetCategoryId || ''} className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium">
                <option value="">-- None --</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.translations?.[0]?.name || c.slug}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-8 border-t border-card-border">
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">SEO Meta Description</label>
            <textarea 
              name="description" 
              defaultValue={promo.description || ''}
              rows={2}
              placeholder="A short punchy description that shows up on Google Search beneath the title."
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl resize-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Page Body (Rich Display)</label>
            <p className="text-xs opacity-50 mb-4 max-w-xl">Use the formatting tools to embed YouTube videos, images, and sales copy. The container is natively styled for dark-mode.</p>
            <div className="bg-background rounded-xl">
               <RichTextEditor name="bodyHtml" placeholder="Design your landing page visually..." defaultValue={promo.bodyHtml} />
            </div>
          </div>

          <div className="pt-8 border-t border-card-border flex justify-end">
             <button type="submit" className="btn-primary py-4 px-12 text-lg">
               Save Marketing Page
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
