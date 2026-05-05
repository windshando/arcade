import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function AdminFaqsPage() {
  const t = await getTranslations('AdminFAQ');
  const categories = await fetchAdminAPI('/faq/admin');

  // Flatten the category hierarchy for a comprehensive list view
  const allFaqs = categories.reduce((acc: any[], cat: any) => {
    cat.faqs.forEach((faq: any) => {
      acc.push({
        ...faq,
        categoryName: cat.translations[0]?.name || cat.slug,
        categoryId: cat.id
      });
    });
    return acc;
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('title')}</h1>
          <p className="text-foreground opacity-60">{t('subtitle')}</p>
        </div>
        <Link href="/admin/faqs/new" className="btn-primary shadow-lg shadow-primary/20 shrink-0">
          {t('addNew')}
        </Link>
      </div>

      <div className="glass-panel overflow-hidden border border-card-border shadow-sm rounded-xl bg-card-bg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card-bg/50 border-b border-card-border/50 text-sm opacity-70">
              <th className="p-4 font-bold uppercase tracking-wider">Question</th>
              <th className="p-4 font-bold uppercase tracking-wider">Category</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center">Metrics</th>
              <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/30">
            {allFaqs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center opacity-50">{t('noFAQs')}</td>
              </tr>
            ) : (
              allFaqs.map((faq: any) => (
                <tr key={faq.id} className="hover:bg-card-border/10 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-foreground line-clamp-1">{faq.translations[0]?.question || '(Untitled)'}</p>
                    <p className="text-xs font-mono opacity-50 mt-1">{faq.id}</p>
                  </td>
                  <td className="p-4 text-sm font-medium">{faq.categoryName}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      faq.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' : 
                      faq.status === 'ARCHIVED' ? 'bg-gray-500/20 text-gray-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {faq.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                     <div className="flex items-center justify-center gap-2">
                       <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">👍 {faq.upvotes}</span>
                       <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">👎 {faq.downvotes}</span>
                       <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">👁️ {faq.viewCount}</span>
                     </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/faqs/${faq.id}`} className="text-sm text-primary hover:underline font-semibold">
                       {t('edit')}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
