import { getDashboardStats } from '@/app/actions';
import { Package, Users, FileText, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboardPage() {
  const t = await getTranslations('AdminDashboard');
  let stats;
  try {
    stats = await getDashboardStats();
  } catch (error) {
    stats = null;
  }

  if (!stats) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-xl flex flex-col items-center max-w-md text-center">
          <Activity size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">{t('loadFailTitle')}</h2>
          <p className="text-sm opacity-80">{t('loadFailDesc')}</p>
        </div>
      </div>
    );
  }

  const { metrics, leadsByStatus, recentInquiries } = stats;

  return (
    <div className="p-8 space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t('overview')}</h1>
        <p className="opacity-70 mt-2">{t('welcomeMsg')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg/50 backdrop-blur-3xl border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} className="text-primary" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-inner">
              <Users size={24} />
            </div>
            <h3 className="font-semibold text-lg opacity-80">{t('totalLeads')}</h3>
          </div>
          <p className="text-4xl font-black tabular-nums">{metrics.totalLeads}</p>
        </div>

        <div className="bg-card-bg/50 backdrop-blur-3xl border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package size={80} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shadow-inner">
              <Package size={24} />
            </div>
            <h3 className="font-semibold text-lg opacity-80">{t('products')}</h3>
          </div>
          <p className="text-4xl font-black tabular-nums">{metrics.totalProducts}</p>
        </div>

        <div className="bg-card-bg/50 backdrop-blur-3xl border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={80} className="text-purple-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl shadow-inner">
              <FileText size={24} />
            </div>
            <h3 className="font-semibold text-lg opacity-80">{t('blogPosts')}</h3>
          </div>
          <p className="text-4xl font-black tabular-nums">{metrics.totalPosts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads by Status */}
        <div className="bg-card-bg/50 backdrop-blur-md border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
            <TrendingUp className="text-primary" size={20} /> {t('pipelineBreakdown')}
          </h2>
          <div className="space-y-5">
            {leadsByStatus.map((statusItem: any) => (
              <div key={statusItem.status} className="flex flex-col gap-2 group">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="opacity-90">{statusItem.status}</span>
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity tabular-nums">{statusItem._count.status} {t('leads')}</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary hover:bg-primary/80 transition-colors h-full rounded-full" 
                    style={{ width: `${Math.min((statusItem._count.status / (metrics.totalLeads || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {leadsByStatus.length === 0 && (
              <p className="opacity-50 text-sm text-center py-4">{t('noLeads')}</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card-bg/50 backdrop-blur-md border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary" size={20} /> {t('recentInquiries')}
            </h2>
            <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
              {t('viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentInquiries.map((inquiry: any) => (
              <Link href={`/admin/leads/${inquiry.id}`} key={inquiry.id} className="block group border border-card-border/50 bg-background/50 hover:bg-primary/5 active:scale-[0.99] p-4 rounded-xl transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{inquiry.contactName || t('unknown')}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium tracking-wide">
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-sm opacity-70 mb-1">
                  <span className="font-medium">{inquiry.companyName || t('noCompany')}</span> - {inquiry.subject || t('noSubject')}
                </p>
                <div className="text-xs opacity-50 tabular-nums">
                  {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </Link>
            ))}
            {recentInquiries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <FileText size={32} className="mb-2" />
                <p className="text-sm text-center">{t('noInquiries')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
