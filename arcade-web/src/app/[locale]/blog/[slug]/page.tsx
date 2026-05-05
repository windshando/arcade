import { getPublicPostDetail } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await getPublicPostDetail(slug, locale === 'zh-CN' ? 'ZH_CN' : 'EN');
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <article>
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center space-x-2 text-primary font-bold tracking-widest uppercase mb-4 text-sm">
            <span>{post.category}</span>
            <span className="text-card-border">•</span>
            <span className="opacity-70 text-foreground font-medium">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-foreground opacity-70 font-light leading-relaxed max-w-2xl mx-auto">
            {post.excerpt}
          </p>
        </header>

        {post.coverMediaId ? (
            <div className="w-full aspect-video rounded-3xl mb-12 bg-gray-200" />
        ) : (
            <div className="w-full aspect-[21/9] rounded-3xl mb-12 bg-card-border flex items-center justify-center">
              <span className="opacity-30 tracking-widest">NO IMAGE PRODUCED</span>
            </div>
        )}

        <div 
          className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:text-foreground
          prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </main>
  );
}
