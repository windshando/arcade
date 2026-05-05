import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function AdminPromotionsPage() {
  const t = await getTranslations('AdminPromotions');
  const promotions = await fetchAdminAPI('/promotions/admin');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('title')}</h1>
          <p className="text-foreground opacity-60">{t('subtitle')}</p>
        </div>
        <Link href="/admin/promotions/new" className="btn-primary shadow-lg shadow-primary/20 shrink-0">
          {t('createPromotion')}
        </Link>
      </div>

      <div className="glass-panel overflow-hidden border border-card-border shadow-sm rounded-xl bg-card-bg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card-bg/50 border-b border-card-border/50 text-sm opacity-70">
              <th className="p-4 font-bold uppercase tracking-wider">Campaign Name</th>
              <th className="p-4 font-bold uppercase tracking-wider">Performance Tracking</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/30">
            {promotions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center opacity-50">{t('noPromotions')}</td>
              </tr>
            ) : (
              promotions.map((promo: any) => {
                const cvr = promo.viewCount > 0 ? ((promo.inquiryCount / promo.viewCount) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={promo.id} className="hover:bg-card-border/10 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground line-clamp-1">{promo.title}</p>
                      <Link href={`/promotions/${promo.slug}`} target="_blank" className="text-xs font-mono opacity-50 hover:text-primary transition-colors">
                        /promotions/{promo.slug} ↗
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4 items-center">
                        <div>
                           <p className="text-[10px] font-bold uppercase opacity-50">Page Views</p>
                           <p className="font-mono font-bold text-blue-500">{promo.viewCount}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase opacity-50">Generated Leads</p>
                           <p className="font-mono font-bold text-green-500">{promo.inquiryCount}</p>
                        </div>
                        <div className="bg-green-500/10 px-2 py-1 rounded">
                           <p className="text-[10px] font-bold text-green-600 uppercase">CVR</p>
                           <p className="text-sm font-bold text-green-600">{cvr}%</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-[10px] font-black rounded-md uppercase tracking-widest ${
                        promo.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {promo.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/promotions/${promo.id}`} className="text-sm text-primary hover:underline font-semibold">
                        {t('edit')}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
