import { fetchAdminAPI } from '@/lib/adminApi';
import CategoryManager from './CategoryManager';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function CategoriesPage() {
  const t = await getTranslations('AdminCategories');
  const categories = await fetchAdminAPI('/categories/admin');
  
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="opacity-70 mt-1">{t('subtitle')}</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden p-6 border border-card-border">
        <CategoryManager initialCategories={categories} />
      </div>
    </div>
  );
}
