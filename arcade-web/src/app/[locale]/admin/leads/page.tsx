import { fetchAdminAPI } from '@/lib/adminApi';
import KanbanBoard from '@/components/crm/KanbanBoard';
import { revalidatePath } from 'next/cache';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0; // Never cache admin data

export default async function LeadsInboxPage() {
  const t = await getTranslations('AdminLeads');
  const leads = await fetchAdminAPI('/admin/crm/leads');
  const newLeadsCount = leads.filter((l: any) => l.status === 'NEW').length;
  const contactedCount = leads.filter((l: any) => l.status === 'CONTACTED').length;
  const wonCount = leads.filter((l: any) => l.status === 'WON').length;

  async function handleLeadMove(leadId: string, newStatus: string) {
    'use server';
    await fetchAdminAPI(`/admin/crm/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    revalidatePath('/[locale]/admin/leads', 'page');
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('title')}</h1>
          <p className="opacity-70 mt-2 font-medium">{t('subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <a href="/en/admin/export?type=leads" className="px-6 py-2.5 bg-background border border-card-border hover:bg-card-border/30 rounded-xl font-bold tracking-wide text-sm shadow-sm transition-colors text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t('exportCSV')}
          </a>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-blue-500">
          <p className="opacity-70 text-sm font-bold uppercase tracking-wider mb-2">{t('totalInquiries')}</p>
          <p className="text-4xl font-extrabold">{leads.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-green-500">
          <p className="opacity-70 text-sm font-bold uppercase tracking-wider mb-2">{t('newAction')}</p>
          <p className="text-4xl font-extrabold text-green-500">{newLeadsCount}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-yellow-500">
          <p className="opacity-70 text-sm font-bold uppercase tracking-wider mb-2">{t('inProgress')}</p>
          <p className="text-4xl font-extrabold text-yellow-500">{contactedCount}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-purple-500">
          <p className="opacity-70 text-sm font-bold uppercase tracking-wider mb-2">{t('dealsWon')}</p>
          <p className="text-4xl font-extrabold text-purple-500">{wonCount}</p>
        </div>
      </div>

      {/* Kanban Board replaces static table */}
      <KanbanBoard initialLeads={leads} onLeadMove={handleLeadMove} />
    </div>
  );
}
