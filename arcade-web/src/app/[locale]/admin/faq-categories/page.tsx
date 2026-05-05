import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { revalidatePath } from 'next/cache';

async function createFaqCategory(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  await fetchAdminAPI('/faq/admin/category', {
    method: 'POST',
    body: JSON.stringify({ slug, name })
  });
  revalidatePath('/[locale]/admin/faq-categories');
}

export default async function AdminFaqCategoriesPage() {
  const categories = await fetchAdminAPI('/faq/admin');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">FAQ Categories</h1>
          <p className="text-foreground opacity-60">Manage your high-level FAQ grouping containers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Creation Box */}
        <div className="glass-panel p-6 border-t-4 border-primary shadow-sm rounded-xl bg-card-bg h-fit">
          <h2 className="font-bold text-lg mb-4">Quick Create</h2>
          <form action={createFaqCategory} className="space-y-4">
            <input 
              name="name" 
              required 
              placeholder="Category Name" 
              className="w-full px-4 py-2 bg-background border border-card-border rounded-lg"
            />
            <button type="submit" className="w-full btn-primary py-2 text-sm">Add Category</button>
          </form>
        </div>

        {/* Table View */}
        <div className="lg:col-span-3">
          <div className="glass-panel overflow-hidden border border-card-border shadow-sm rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-card-bg/50 border-b border-card-border/50 text-sm opacity-70">
                  <th className="p-4 font-bold uppercase tracking-wider">Name</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-center">Slug</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-center">Linked FAQs</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/30">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center opacity-50">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-card-border/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{cat.translations[0]?.name || '-'}</td>
                      <td className="p-4 font-mono text-xs opacity-70 text-center">{cat.slug}</td>
                      <td className="p-4 text-center">{cat.faqs?.length || 0} items</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${cat.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/faq-categories/${cat.id}`} className="text-sm text-primary hover:underline font-semibold">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
