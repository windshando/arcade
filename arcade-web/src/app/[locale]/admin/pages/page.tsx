import { fetchAdminAPI } from '@/lib/adminApi';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminPagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('AdminPages');
  const pages = await fetchAdminAPI('/pages/admin');

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/admin/pages/create`} className="btn-primary py-2 px-6">
          {t('createPage')}
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-card-border/50">
            <tr>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Status</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Page Key</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {pages.map((p: any) => (
              <tr key={p.id} className="hover:bg-card-border/30 transition-colors">
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    p.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' :
                    'bg-card-border text-foreground'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-sm">
                  {p.pageKey}
                </td>
                <td className="py-4 px-6 text-sm opacity-70">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/${locale}/admin/pages/${p.id}`} className="text-primary text-sm font-bold hover:underline">
                    {t('edit')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
