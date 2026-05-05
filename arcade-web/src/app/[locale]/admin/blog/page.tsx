import { fetchAdminAPI } from '@/lib/adminApi';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminBlogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('AdminBlog');
  const posts = await fetchAdminAPI('/blog/admin/posts');

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/admin/blog/new`} className="btn-primary py-2 px-6">{t('createPost')}</Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-card-border/50">
            <tr>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">{t('status')}</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">{t('postTitle')}</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">{t('category')}</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">{t('publishedAt')}</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {posts.map((p: any) => (
              <tr key={p.id} className="hover:bg-card-border/30 transition-colors group">
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    p.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' :
                    p.status === 'ARCHIVED' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-card-border text-foreground'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-sm">
                  {p.translations?.[0]?.title || p.slug}
                </td>
                <td className="py-4 px-6 font-medium opacity-80 text-sm">
                  {p.category?.slug || '-'}
                </td>
                <td className="py-4 px-6 text-sm opacity-70">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : t('draft')}
                </td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/${locale}/admin/blog/${p.id}`} className="text-primary hover:underline text-sm font-medium">
                    {t('edit')}
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center opacity-50">
                  {t('noPostsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
