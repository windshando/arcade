import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { redirect } from 'next/navigation';

async function updateFaqCategory(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const isActive = formData.get('isActive') === 'on';
  
  await fetchAdminAPI(`/faq/admin/category/${id}`, {
    method: 'POST',
    body: JSON.stringify({ slug, name, isActive })
  });
  
  redirect('/en/admin/faq-categories'); // Simple dynamic locale trick assuming 'en' fallback for admin
}

export default async function AdminFaqCategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const category = await fetchAdminAPI(`/faq/admin/category/${resolvedParams.id}`);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/faq-categories" className="text-primary text-sm hover:underline font-bold mb-4 inline-block">
          ← Back to Categories
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Edit Category</h1>
      </div>

      <div className="glass-panel p-8 border border-card-border shadow-sm rounded-2xl bg-card-bg">
        <form action={updateFaqCategory} className="space-y-6">
          <input type="hidden" name="id" value={category.id} />
          
          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Category Name</label>
            <input 
              name="name" 
              defaultValue={category.translations[0]?.name || ''}
              required 
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">URL Slug</label>
            <input 
              name="slug" 
              defaultValue={category.slug}
              required 
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-3 bg-background p-4 border border-card-border rounded-xl">
            <input 
              type="checkbox" 
              name="isActive" 
              id="isActive"
              defaultChecked={category.isActive}
              className="w-5 h-5 accent-primary"
            />
            <label htmlFor="isActive" className="font-bold text-foreground">Active Status</label>
            <span className="text-xs opacity-50 ml-auto">If unchecked, FAQs under this won't show on the public page.</span>
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
