import { getPublicPosts } from '@/lib/api';
import { Link } from '@/i18n/routing';

export const revalidate = 3600;

export default async function BlogArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getPublicPosts(locale === 'zh-CN' ? 'ZH_CN' : 'EN');

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Industry Insights & News
        </h1>
        <p className="mt-4 text-xl opacity-70">
          The latest trends and buying guides for commercial arcade machines.
        </p>
      </div>

      <div className="flex flex-col space-y-8">
        {posts.map((post: any) => (
          <article key={post.id} className="glass-panel rounded-3xl overflow-hidden card-hover flex flex-col sm:flex-row">
            {post.coverMediaId ? (
               <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto bg-gray-200" />
            ) : (
                <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto bg-card-border flex items-center justify-center">
                    <span className="opacity-50 font-semibold tracking-wider text-sm">NO IMAGE</span>
                </div>
            )}
            <div className="p-8 flex flex-col justify-center w-full sm:w-2/3">
              <div className="flex items-center space-x-2 text-sm text-primary font-bold tracking-wide uppercase mb-3">
                <span>{post.category}</span>
                <span className="text-card-border">•</span>
                <span className="opacity-70 text-foreground font-medium">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-foreground hover:text-primary transition-colors mb-4 line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-foreground opacity-80 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-6">
                 <Link href={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                   Read Article →
                 </Link>
              </div>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="py-12 text-center text-foreground opacity-60">
            No posts available at the moment.
          </div>
        )}
      </div>
    </main>
  );
}
