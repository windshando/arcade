import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import SlideListClient from './SlideListClient';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminSlidesPage() {
  const t = await getTranslations('AdminSlides');
  const slides = await fetchAdminAPI('/slides/admin');

  return (
    <div className="p-8 animate-fade-in pb-32 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <Link href="/admin/slides/new" className="btn-primary py-2.5 px-6 font-bold tracking-wide rounded-xl shadow-md inline-block text-sm">
          {t('addNew')}
        </Link>
      </div>

      <SlideListClient initialSlides={slides} />
    </div>
  );
}
