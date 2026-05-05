import { fetchAPI } from '@/lib/api';
import { notFound } from 'next/navigation';
import ApplyButton from './ApplyButton';

export const revalidate = 60;

export default async function JobDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const extLocale = locale === 'zh-cn' || locale === 'zh-CN' ? 'ZH_CN' : locale.toUpperCase();

  let globalOps: any = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      globalOps = data.global_options || {};
    }
  } catch (err) {}

  const postings = await fetchAPI(`/recruitment/public/postings?locale=${extLocale}`).catch(() => []);
  const job = postings.find((p: any) => p.id === id);
  if (!job) notFound();

  const t = job.translations?.[0];

  return (
    <main className="py-20 px-8 mx-auto max-w-3xl min-h-screen animate-fade-in">
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
          {job.department && (
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">{job.department}</span>
          )}
          {job.location && (
            <span className="px-4 py-1.5 bg-card-border rounded-full text-xs font-bold uppercase tracking-wider">{job.location}</span>
          )}
          {job.type && (
            <span className="px-4 py-1.5 bg-card-border rounded-full text-xs font-bold uppercase tracking-wider">{job.type?.replace(/_/g, ' ')}</span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">{t?.title || 'Untitled Role'}</h1>

        {job.salaryRange && (
          <p className="text-xl font-bold text-primary mb-8">{job.salaryRange}</p>
        )}
      </div>

      {t?.description && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Job Description</h2>
          <div
            className="prose prose-invert max-w-none opacity-85 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: t.description }}
          />
        </section>
      )}

      {t?.requirements && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Requirements & Qualifications</h2>
          <div
            className="prose prose-invert max-w-none opacity-85 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: t.requirements }}
          />
        </section>
      )}

      <ApplyButton
        jobTitle={t?.title || ''}
        recaptchaSiteKey={globalOps.recaptchaSiteKey}
        isRecaptchaEnabled={globalOps.isRecaptchaEnabled === true || globalOps.isRecaptchaEnabled === 'true'}
      />
    </main>
  );
}
