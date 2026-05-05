import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { getTranslations } from 'next-intl/server';

export default async function AdminSubscribersPage() {
  const t = await getTranslations('AdminSubscribers');
  const subscribers = await fetchAdminAPI('/newsletter/admin/subscribers');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('title')}</h1>
          <p className="text-foreground opacity-60">{t('subtitle')}</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-card-border shadow-sm rounded-xl bg-card-bg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card-bg/50 border-b border-card-border/50 text-sm opacity-70">
              <th className="p-4 font-bold uppercase tracking-wider">Email Address</th>
              <th className="p-4 font-bold uppercase tracking-wider">Opt-In Topics</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider text-right">Joined At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/30">
            {subscribers.length === 0 ? (
              <tr>
                 <td colSpan={4} className="p-8 text-center opacity-50">{t('noSubscribers')}</td>
              </tr>
            ) : (
              subscribers.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-card-border/10 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{sub.email}</td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      {sub.topics.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${sub.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {sub.isActive ? 'ACTIVE' : 'UNSUBSCRIBED'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm opacity-70 font-mono">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
