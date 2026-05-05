import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { CampaignPieChart } from '@/components/campaigns/CampaignCharts';
import { getTranslations } from 'next-intl/server';

export default async function AdminCampaignsPage() {
  const t = await getTranslations('AdminCampaigns');
  const campaigns = await fetchAdminAPI('/newsletter/admin/campaigns');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('title')}</h1>
          <p className="text-foreground opacity-60">{t('subtitle')}</p>
        </div>
        <Link href="/admin/campaigns/new" className="btn-primary shadow-lg shadow-primary/20 shrink-0">
          {t('createCampaign')}
        </Link>
      </div>

      {campaigns.length === 0 ? (
         <div className="glass-panel p-16 text-center shadow-sm rounded-xl">
             <h2 className="text-xl font-bold mb-2">{t('noCampaigns')}</h2>
            <Link href="/admin/campaigns/new" className="btn-primary">Create Campaign</Link>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((camp: any) => (
            <div key={camp.id} className="glass-panel rounded-2xl overflow-hidden border border-card-border shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="bg-card-border/20 p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground line-clamp-1 mb-1">{camp.subject}</h3>
                  <div className="flex gap-2">
                    {camp.targetTopics.map((t: string) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-block px-2 py-1 text-[10px] font-black tracking-widest rounded uppercase ${
                    camp.status === 'COMPLETED' ? 'bg-green-500/20 text-green-600' :
                    camp.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-600' :
                    camp.status === 'SENDING' ? 'bg-amber-500/20 text-amber-600 animate-pulse' :
                    'bg-card-border/50 text-foreground'
                  }`}>
                    {camp.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                {camp.status === 'COMPLETED' ? (
                  <div className="flex-1">
                    <CampaignPieChart data={{
                      total: camp.totalTargets,
                      sent: camp.totalSent,
                      failed: camp.totalFailed,
                      opened: camp.totalOpened,
                      clicked: camp.totalClicked
                    }} />
                    <div className="mt-4 grid grid-cols-3 text-center border-t border-card-border/50 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50">Sent</p>
                        <p className="font-mono font-bold text-foreground">{camp.totalSent}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50">Opened</p>
                        <p className="font-mono font-bold text-green-500">{camp.totalOpened}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50">Failed</p>
                        <p className="font-mono font-bold text-red-500">{camp.totalFailed}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="text-3xl mb-2">{camp.status === 'SCHEDULED' ? '⏳' : '✏️'}</div>
                    <p className="text-sm font-bold">{camp.status === 'SCHEDULED' ? `Scheduled for ${new Date(camp.scheduledFor).toLocaleString()}` : 'Still drafting in progress...'}</p>
                  </div>
                )}
              </div>

              <div className="bg-background border-t border-card-border p-4">
                <Link href={`/admin/campaigns/${camp.id}`} className="text-primary font-bold text-sm w-full block text-center hover:underline">
                  {camp.status === 'DRAFT' || camp.status === 'SCHEDULED' ? 'Edit Campaign Details' : 'View Campaign Source'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
