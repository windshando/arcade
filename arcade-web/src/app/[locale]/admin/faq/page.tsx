import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { revalidatePath } from 'next/cache';
import RichTextEditor from '@/components/RichTextEditor';

async function createFaqCategory(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  await fetchAdminAPI('/faq/admin/category', {
    method: 'POST',
    body: JSON.stringify({ slug, name })
  });
  revalidatePath('/[locale]/admin/faq');
}

async function createFaqItem(formData: FormData) {
  'use server';
  const categoryId = formData.get('categoryId') as string;
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;

  await fetchAdminAPI('/faq/admin', {
    method: 'POST',
    body: JSON.stringify({ categoryId, question, answer })
  });
  revalidatePath('/[locale]/admin/faq');
}

export default async function AdminFaqPage() {
  const categories = await fetchAdminAPI('/faq/admin');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">FAQ Manager</h1>
          <p className="text-foreground opacity-60">Add and organize your public frequently asked questions here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Creators */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-t-4 border-primary shadow-sm rounded-xl bg-card-bg">
            <h2 className="font-bold text-lg mb-4">New Category</h2>
            <form action={createFaqCategory} className="space-y-4">
              <input 
                name="name" 
                required 
                placeholder="e.g. Shipping & Returns" 
                className="w-full px-4 py-2 bg-background border border-card-border rounded-lg"
              />
              <button type="submit" className="w-full btn-primary py-2 text-sm">Create Category</button>
            </form>
          </div>

          <div className="glass-panel p-6 border-t-4 border-blue-500 shadow-sm rounded-xl bg-card-bg">
            <h2 className="font-bold text-lg mb-4">New FAQ Item</h2>
            <form action={createFaqItem} className="space-y-4">
              <select 
                name="categoryId" 
                required 
                className="w-full px-4 py-2 bg-background border border-card-border rounded-lg"
              >
                <option value="">Select Category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.translations[0]?.name || c.slug}</option>
                ))}
              </select>
              <input 
                name="question" 
                required 
                placeholder="Question (e.g. How long is shipping?)" 
                className="w-full px-4 py-2 bg-background border border-card-border rounded-lg"
              />
              <RichTextEditor name="answer" placeholder="Write your rich-text answer here (supports images & video embed)..." />
              <button type="submit" className="w-full btn-primary py-2 text-sm bg-blue-500 hover:bg-blue-600">Add Question</button>
            </form>
          </div>
        </div>

        {/* Right Col: Database View */}
        <div className="lg:col-span-2 space-y-6">
          {categories.length === 0 ? (
             <div className="glass-panel p-12 text-center text-foreground opacity-50 rounded-xl">
               No categories built yet. Create one to the left.
             </div>
          ) : (
             categories.map((cat: any) => (
               <div key={cat.id} className="glass-panel rounded-xl overflow-hidden border border-card-border shadow-sm">
                 <div className="bg-card-border/30 px-6 py-4 flex justify-between items-center">
                   <h3 className="font-bold text-lg">{cat.translations[0]?.name}</h3>
                   <span className="text-xs font-mono opacity-50">{cat.slug}</span>
                 </div>
                 <div className="p-6 space-y-4">
                   {cat.faqs.length === 0 ? (
                     <p className="text-sm opacity-50 italic">No questions in this category yet.</p>
                   ) : (
                     <div className="divide-y divide-card-border/50">
                       {cat.faqs.map((faq: any) => (
                         <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                           <div className="flex justify-between items-start mb-2">
                             <h4 className="font-semibold text-primary">{faq.translations[0]?.question}</h4>
                             <div className="flex items-center gap-3 shrink-0 ml-4">
                               <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                 👍 {faq.upvotes}
                               </span>
                               <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">
                                 👎 {faq.downvotes}
                               </span>
                             </div>
                           </div>
                           <p className="text-sm opacity-70 line-clamp-2">{faq.translations[0]?.answer}</p>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))
          )}
        </div>
        
      </div>
    </div>
  );
}
