import { fetchAdminAPI } from '@/lib/adminApi';
import ProductListClient from './ProductListClient';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const t = await getTranslations('AdminProducts');
  const products = await fetchAdminAPI('/products/admin');

  return (
    <div className="p-8 animate-fade-in pb-32 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <a href="/en/admin/export?type=products" className="px-6 py-2.5 bg-background border border-card-border hover:bg-card-border/30 rounded-xl font-bold tracking-wide text-sm shadow-sm transition-colors text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t('exportCSV')}
          </a>
          <Link href="/admin/products/new" className="btn-primary py-2.5 px-6 font-bold tracking-wide rounded-xl shadow-md inline-block text-sm">
            {t('addNew')}
          </Link>
        </div>
      </div>

      <ProductListClient initialProducts={products} />
    </div>
  );
}
