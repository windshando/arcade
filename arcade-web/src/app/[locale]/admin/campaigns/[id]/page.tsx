import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import { redirect } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

async function saveCampaign(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const subject = formData.get('subject') as string;
  const bodyHtml = formData.get('bodyHtml') as string;
  const scheduledFor = formData.get('scheduledFor') as string;
  const targetTopics = formData.getAll('targetTopics');
  
  await fetchAdminAPI(`/newsletter/admin/campaign`, {
    method: 'POST',
    body: JSON.stringify({ 
      id, 
      status, 
      subject, 
      bodyHtml, 
      targetTopics: targetTopics.length ? targetTopics : ['ALL'],
      scheduledFor: status === 'SCHEDULED' && scheduledFor ? scheduledFor : null
    })
  });
  
  redirect('/en/admin/campaigns');
}

export default async function AdminCampaignEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';

  let campaign = {
    id: 'new',
    subject: '',
    bodyHtml: '',
    targetTopics: ['ALL'],
    status: 'DRAFT',
    scheduledFor: null
  } as any;

  if (!isNew) {
    campaign = await fetchAdminAPI(`/newsletter/admin/campaign/${resolvedParams.id}`);
  }

  // Formatting date for HTML datetime-local input safely
  let dateString = '';
  if (campaign.scheduledFor) {
    const d = new Date(campaign.scheduledFor);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    dateString = d.toISOString().slice(0,16);
  }

  const isLocked = campaign.status === 'COMPLETED' || campaign.status === 'SENDING';

  return (
    <div className="p-8 max-w-4xl mx-auto mb-20">
      <div className="mb-8">
        <Link href="/admin/campaigns" className="text-primary text-sm hover:underline font-bold mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {isNew ? 'Compose Campaign' : isLocked ? 'View Campaign Archive' : 'Edit Campaign'}
        </h1>
        {isLocked && (
          <p className="text-red-500 font-bold bg-red-500/10 px-4 py-2 rounded-lg inline-block mt-2 border border-red-500/20">
            This campaign has already dispatched and is securely locked.
          </p>
        )}
      </div>

      <div className="glass-panel p-8 border border-card-border shadow-sm rounded-2xl bg-card-bg relative overflow-hidden">
        {/* Overlay block for locking editing */}
        {isLocked && <div className="absolute inset-0 bg-background/50 z-10 pointer-events-none"></div>}

        <form action={saveCampaign} className="space-y-8">
          <input type="hidden" name="id" value={campaign.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Email Subject</label>
                <input 
                  name="subject" 
                  defaultValue={campaign.subject}
                  required 
                  disabled={isLocked}
                  placeholder="e.g. 50% Off Mega Arcade Winter Sale!"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Target Audience (Hold Ctrl to multiselect)</label>
                <select 
                  name="targetTopics" 
                  multiple 
                  defaultValue={campaign.targetTopics}
                  required 
                  disabled={isLocked}
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-medium h-32"
                >
                  <option value="ALL">Everyone</option>
                  <option value="news">News Readers</option>
                  <option value="promotions">Promotions Alert List</option>
                  <option value="new_products">New Product Updates</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-card-border/10 rounded-xl border border-card-border shadow-inner">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest text-primary">Execution Engine</label>
                <select 
                  name="status" 
                  defaultValue={campaign.status}
                  disabled={isLocked}
                  className={`w-full px-4 py-3 border border-card-border rounded-xl font-extrabold shadow-sm ${
                    campaign.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-600' : 'bg-background text-foreground'
                  }`}
                >
                  <option value="DRAFT">DRAFT (Keep editing)</option>
                  <option value="SCHEDULED">SCHEDULED (Enable Auto-Dispatch)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Execution Time (Local Time)</label>
                <input 
                  type="datetime-local" 
                  name="scheduledFor" 
                  defaultValue={dateString}
                  disabled={isLocked}
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                />
                <p className="text-xs opacity-50 mt-2">Only triggers if Execution Engine is set to SCHEDULED. If the time has already passed, it will send exactly within 60 seconds.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Email Body (Rich HTML)</label>
            <div className="bg-background rounded-xl">
               {/* Note: since RichTextEditor is a client component, we override the actual hidden input for ReactQuill if locked. For simplicity, just rendering native if locked. */}
               {isLocked ? (
                  <div className="p-4 border border-card-border rounded-xl bg-background text-sm opacity-80" dangerouslySetInnerHTML={{__html: campaign.bodyHtml}} />
               ) : (
                  <RichTextEditor name="bodyHtml" placeholder="Design your newsletter visually..." defaultValue={campaign.bodyHtml} />
               )}
            </div>
          </div>

          {!isLocked && (
            <div className="pt-4 border-t border-card-border flex justify-end">
               <button type="submit" className="btn-primary py-4 px-12 text-lg">
                 Secure & Apply Campaign
               </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
