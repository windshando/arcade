import { getPublicPage } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // 24 hours

export default async function StaticRoutePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Protect root-level slugs from capturing actual routes
  const reservedSlugs = ['products', 'blog', 'contact', 'admin'];
  if (reservedSlugs.includes(slug)) {
    notFound();
  }

  const page = await getPublicPage(slug, locale === 'zh-CN' ? 'ZH_CN' : 'EN');
  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
      <div className="glass-panel p-10 md:p-16 rounded-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-12 text-center drop-shadow-sm">
          {page.title}
        </h1>
        <div 
          className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </main>
  );
}
