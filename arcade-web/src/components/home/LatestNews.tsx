import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category?: string;
  coverMediaId?: string;
}

export default function LatestNews({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 px-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Latest News &amp; Insights
            </h2>
            <p className="text-lg opacity-80">
              Stay updated with our newest product releases, industry trends, and company announcements.
            </p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline transition-all mt-6 md:mt-0">
            View All Posts <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full flex flex-col">
              <article className="glass-panel p-2 rounded-3xl h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] hover:-translate-y-2 border border-card-border/50 bg-card-bg/50 backdrop-blur-md">
                
                {/* Image Wrapper */}
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-card-border/20">
                  {post.coverMediaId ? (
                    <Image
                      src={`/api/v1/media/${post.coverMediaId}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                      <span className="opacity-50 font-bold tracking-widest uppercase">No Image</span>
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="glass-panel px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full flex items-center gap-1.5 backdrop-blur-xl">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm opacity-60 mb-4 font-medium">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Draft'}
                    </time>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="opacity-70 line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-card-border/50 flex items-center justify-between font-bold text-sm text-primary">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:hidden flex justify-center">
          <Link href="/blog" className="btn-primary py-3 px-8 w-full text-center">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
