import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { redirect } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

async function saveFaq(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const categoryId = formData.get('categoryId') as string;
  const status = formData.get('status') as string;
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  
  if (id === 'new') {
    await fetchAdminAPI(`/faq/admin`, {
      method: 'POST',
      body: JSON.stringify({ categoryId, question, answer }) // note: backend create defaults to DRAFT inside service
    });
  } else {
    // Needs the route '/faq/admin/faq/:id' which we registered
    await fetchAdminAPI(`/faq/admin/faq/${id}`, {
      method: 'POST',
      body: JSON.stringify({ categoryId, status, question, answer })
    });
  }
  
  redirect('/en/admin/faqs'); // fallback dynamic locale trick
}

export default async function AdminFaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';

  const categories = await fetchAdminAPI('/faq/admin'); // fetch categories for the dropdown
  
  // Default structure
  let faq = {
    id: 'new',
    categoryId: '',
    status: 'DRAFT',
    translations: [{ question: '', answer: '' }]
  };

  if (!isNew) {
    faq = await fetchAdminAPI(`/faq/admin/faq/${resolvedParams.id}`);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto mb-20">
      <div className="mb-8">
        <Link href="/admin/faqs" className="text-primary text-sm hover:underline font-bold mb-4 inline-block">
          ← Back to Questions
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {isNew ? 'Draft New Question' : 'Edit Question'}
        </h1>
      </div>

      <div className="glass-panel p-8 border border-card-border shadow-sm rounded-2xl bg-card-bg">
        <form action={saveFaq} className="space-y-8">
          <input type="hidden" name="id" value={faq.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Target Category</label>
              <select 
                name="categoryId" 
                defaultValue={faq.categoryId}
                required 
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium"
              >
                <option value="" disabled>Select a parent category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.translations[0]?.name || c.slug}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Publish Status</label>
              <select 
                name="status" 
                defaultValue={faq.status}
                required 
                className={`w-full px-4 py-3 border border-card-border rounded-xl font-bold ${
                  faq.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600' : 'bg-background text-foreground'
                }`}
              >
                <option value="DRAFT">DRAFT (Hidden from public)</option>
                <option value="PUBLISHED">PUBLISHED (Live on site)</option>
                <option value="ARCHIVED">ARCHIVED (Disabled)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">The Question</label>
            <input 
              name="question" 
              defaultValue={faq.translations[0]?.question || ''}
              required 
              placeholder="e.g. How long does standard shipping take?"
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">The Answer (Rich Text)</label>
            <div className="bg-background rounded-xl">
               <RichTextEditor name="answer" placeholder="Draft your rich-text answer here (supports Markdown, images & video embed)..." defaultValue={faq.translations[0]?.answer || ''} />
            </div>
          </div>

          <div className="pt-4 border-t border-card-border flex justify-end">
             <button type="submit" className="btn-primary py-4 px-12 text-lg">
               {isNew ? 'Save Draft' : 'Update Record'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
