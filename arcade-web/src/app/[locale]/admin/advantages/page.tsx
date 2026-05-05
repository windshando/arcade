import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import AdvantageListClient from './AdvantageListClient';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminAdvantagesPage() {
  const t = await getTranslations('AdminAdvantages');
  const advantages = await fetchAdminAPI('/advantages/admin');

  return (
    <div className="p-8 animate-fade-in pb-32 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <Link 
          href="/admin/advantages/new"
          className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all"
        >
          <Plus size={20} /> {t('addNew')}
        </Link>
      </div>

      <AdvantageListClient initialAdvantages={advantages} />
    </div>
  );
}
