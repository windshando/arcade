import { fetchAdminAPI } from '@/lib/adminApi';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function RecruitmentDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('AdminRecruitment');
  const jobs = await fetchAdminAPI('/recruitment/admin/jobs').catch(() => []);
  const franchise = await fetchAdminAPI('/recruitment/admin/franchise').catch(() => []);
  const postings = await fetchAdminAPI('/recruitment/admin/postings').catch(() => []);

  return (
    <div className="p-8 animate-fade-in max-w-6xl mx-auto space-y-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="opacity-70 mt-1">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/admin/recruitment/jobs/create`} className="btn-primary py-2 px-6">
          {t('createJob')}
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">Active Job Postings</h2>
        <div className="glass-panel rounded-2xl overflow-hidden shadow-md border border-card-border mb-8">
          <table className="w-full text-left">
            <thead className="bg-card-border/50">
              <tr>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Role Title</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Department</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Location</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Type</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {postings.length === 0 && (
                <tr className="opacity-50"><td colSpan={5} className="p-6 text-center">No active job postings.</td></tr>
              )}
              {postings.map((p: any) => (
                <tr key={p.id} className="hover:bg-card-border/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-sm">
                    {p.translations?.[0]?.title || 'Untitled'} 
                    {p.status === 'DRAFT' && <span className="ml-2 text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">DRAFT</span>}
                  </td>
                  <td className="py-4 px-6 text-sm opacity-70">{p.department || '-'}</td>
                  <td className="py-4 px-6 text-sm opacity-70">{p.location || '-'}</td>
                  <td className="py-4 px-6 text-sm">{p.type}</td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/${locale}/admin/recruitment/jobs/${p.id}`} className="text-primary text-sm font-bold hover:underline">
                      Edit Role
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">Franchise Applications</h2>
        <div className="glass-panel rounded-2xl overflow-hidden shadow-md border border-card-border">
          <table className="w-full text-left">
            <thead className="bg-card-border/50">
              <tr>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Date</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Partner</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Company</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Region</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs text-right">Action</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Status</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Technical Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {franchise.length === 0 && (
                <tr className="opacity-50"><td colSpan={5} className="p-6 text-center">No franchise applications found.</td></tr>
              )}
              {franchise.map((p: any) => (
                <tr key={p.id} className="hover:bg-card-border/30 transition-colors">
                  <td className="py-4 px-6 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 font-semibold text-sm">{p.firstName} {p.lastName} <br/><span className="text-xs font-normal opacity-70">{p.email}</span></td>
                  <td className="py-4 px-6 text-sm opacity-70">{p.companyName || '-'}</td>
                  <td className="py-4 px-6 text-sm">{p.region || p.countryCode}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-primary text-sm font-bold hover:underline">View Detail</button>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-card-border text-foreground">{p.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[10px] space-y-1 opacity-60">
                      <div className="font-mono">{p.ipAddress || '-'}</div>
                      <div>{p.pageViews ? `${p.pageViews} views` : '-'} | {p.sessionDuration ? `${Math.floor(p.sessionDuration / 60)}m` : '-'}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">Job Applications</h2>
        <div className="glass-panel rounded-2xl overflow-hidden shadow-md border border-card-border">
          <table className="w-full text-left">
            <thead className="bg-card-border/50">
              <tr>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Date</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Applicant</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Position</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Status</th>
                <th className="py-4 px-6 font-semibold opacity-80 text-xs">Technical Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {jobs.length === 0 && (
                <tr className="opacity-50"><td colSpan={5} className="p-6 text-center">No job applications found.</td></tr>
              )}
              {jobs.map((p: any) => (
                <tr key={p.id} className="hover:bg-card-border/30 transition-colors">
                  <td className="py-4 px-6 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 font-semibold text-sm">{p.firstName} {p.lastName} <br/><span className="text-xs font-normal opacity-70">{p.email}</span></td>
                  <td className="py-4 px-6 text-sm text-primary font-bold">{p.position}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-card-border text-foreground">{p.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[10px] space-y-1 opacity-60">
                      <div className="font-mono">{p.ipAddress || '-'}</div>
                      <div>{p.pageViews ? `${p.pageViews} views` : '-'} | {p.sessionDuration ? `${Math.floor(p.sessionDuration / 60)}m` : '-'}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
