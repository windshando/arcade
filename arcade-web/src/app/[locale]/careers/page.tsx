import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60;

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const extLocale = locale === 'zh-cn' || locale === 'zh-CN' ? 'ZH_CN' : locale.toUpperCase();
  const postings = await fetchAPI(`/recruitment/public/postings?locale=${extLocale}`).catch(() => []);

  return (
    <main className="py-20 px-8 mx-auto max-w-4xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 mt-10">Join <span className="text-primary">Our Team</span></h1>
        <p className="text-xl opacity-70 mb-4 font-light max-w-2xl mx-auto">We are building the next generation of B2B trading platforms. Join us on our mission.</p>
      </div>

      {postings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-card-border">
          <p className="text-xl opacity-60">No open positions at this time. Please check back later!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Open Roles</h2>
          {postings.map((job: any) => (
            <Link key={job.id} href={`/${locale}/careers/${job.id}`} className="block glass-panel p-8 rounded-3xl border border-card-border hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary group-hover:underline">{job.translations?.[0]?.title || 'Untitled Role'}</h3>
                  <div className="flex gap-4 mt-2 text-sm opacity-70 font-semibold tracking-wide">
                    {job.department && <span>{job.department}</span>}
                    {job.location && <><span>•</span><span>{job.location}</span></>}
                    {job.type && <><span>•</span><span>{job.type?.replace(/_/g, ' ')}</span></>}
                  </div>
                </div>
                {job.salaryRange && (
                  <div className="px-4 py-2 bg-background rounded-full text-sm font-bold opacity-80 border border-card-border flex-shrink-0">
                    {job.salaryRange}
                  </div>
                )}
              </div>
              <div className="text-sm opacity-70 leading-relaxed max-w-3xl line-clamp-3" dangerouslySetInnerHTML={{ __html: job.translations?.[0]?.description || '' }} />
              <span className="mt-6 text-primary font-bold text-sm tracking-wider uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                View Details & Apply →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
