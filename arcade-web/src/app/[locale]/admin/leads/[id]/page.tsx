import { fetchAdminAPI } from '@/lib/adminApi';
import { notFound } from 'next/navigation';
import { postLeadNote } from '@/app/actions';
import { Link } from '@/i18n/routing';
import LeadActions from './LeadActions';

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let lead;
  try {
    lead = await fetchAdminAPI(`/admin/crm/leads/${id}`);
  } catch (err) {
    notFound();
  }

  // Create a bound Server Action for posting notes internally
  // It handles its own hydration
  const boundNoteAction = postLeadNote.bind(null, id);

  // Combine everything into a unified chronological timeline
  const timelineEvents: any[] = [
    ...(lead.message ? [{
      type: 'INQUIRY_RECEIVED',
      date: new Date(lead.createdAt),
      content: lead.message,
      author: lead.contactName || 'Customer',
      tag: 'Form Submission',
    }] : []),
    ...(lead.notes || []).map((n: any) => ({
      type: 'ADMIN_NOTE',
      date: new Date(n.createdAt),
      content: n.body,
      author: n.adminUser?.displayName || 'Admin',
      tag: 'Internal Note',
    })),
    ...(lead.activities || []).map((act: any) => ({
      type: act.activityType,
      date: new Date(act.createdAt),
      content: act.metadataJson?.bodyPlain || act.summary,
      author: act.metadataJson?.sender ? act.metadataJson.sender : (act.adminUser?.displayName || 'System API'),
      tag: act.activityType === 'EMAIL_RECEIVED' ? 'External Email' : 'System Event',
      isSystem: act.activityType === 'STATUS_CHANGE',
    })),
    ...(lead.chatSessions || []).flatMap((session: any) => 
      (session.messages || []).map((msg: any) => ({
        type: 'CHAT_MESSAGE',
        date: new Date(msg.createdAt),
        content: msg.content,
        author: msg.senderName || (msg.senderType === 'VISITOR' ? (lead.contactName || 'Visitor') : 'Admin'),
        tag: msg.senderType === 'VISITOR' ? 'Live Chat (Visitor)' : 'Live Chat (Admin)',
        isSystem: msg.senderType === 'SYSTEM',
        senderType: msg.senderType,
      }))
    )
  ];

  // Sort Descending (Newest at Top)
  timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in pb-32">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/leads" className="text-primary hover:underline font-bold text-sm inline-flex items-center gap-2">
          ← Back to CRM Inbox
        </Link>
        <Link href={`/admin/leads/${id}/quote`} target="_blank" className="btn-primary py-2 px-6 rounded-lg text-sm font-bold shadow-md shadow-primary/20 flex gap-2 items-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Generate PDF Quote
        </Link>
      </div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">
            {lead.inquiryType} INQUIRY
          </span>
          <h1 className="text-3xl font-extrabold text-foreground">
            {lead.companyName ? `${lead.companyName} (${lead.contactName})` : lead.contactName}
          </h1>
          <p className="opacity-70 mt-1">Submitted on {new Date(lead.createdAt).toLocaleString()}</p>
        </div>
        <LeadActions leadId={id} currentStatus={lead.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Unified Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Unified Timeline</h3>

            {/* Note Input at the Top (closest to newest events) */}
            <form action={boundNoteAction} className="flex gap-4 mb-10 pb-10 border-b border-card-border/50">
              <input 
                required 
                type="text" 
                name="notes" 
                placeholder="Type a fast internal note..." 
                className="flex-1 bg-background/50 backdrop-blur border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner" 
              />
              <button type="submit" className="btn-primary px-6 rounded-xl font-bold whitespace-nowrap shadow-md">Add Note</button>
            </form>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-card-border/60 space-y-10">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[32px] sm:-left-[40px] w-4 h-4 rounded-full border-4 border-card-bg shadow-sm ${
                    event.type === 'INQUIRY_RECEIVED' ? 'bg-green-500' :
                    event.type === 'EMAIL_RECEIVED' ? 'bg-blue-500' :
                    event.type === 'ADMIN_NOTE' ? 'bg-purple-500' :
                    event.type === 'CHAT_MESSAGE' ? (event.senderType === 'VISITOR' ? 'bg-orange-500' : 'bg-amber-500') :
                    'bg-zinc-400'
                  }`} />
                  
                  {/* Content Box */}
                  <div className="mb-1 flex items-baseline justify-between flex-wrap gap-2">
                    <span className="font-bold text-foreground opacity-90">{event.author}</span>
                    <span className="text-xs font-semibold opacity-60 tracking-wider">
                      {event.date.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={`p-4 sm:p-5 rounded-2xl ${
                    event.isSystem ? 'bg-transparent border border-card-border/50 text-sm opacity-80' : 
                    event.type === 'ADMIN_NOTE' ? 'bg-purple-500/10 border border-purple-500/20' :
                    event.type === 'EMAIL_RECEIVED' ? 'bg-blue-500/10 border border-blue-500/20' :
                    event.type === 'CHAT_MESSAGE' ? (event.senderType === 'VISITOR' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-amber-500/10 border border-amber-500/20') :
                    'bg-card-border/20 border border-card-border'
                  }`}>
                    <div className="w-full whitespace-pre-wrap leading-relaxed">
                      {event.content}
                    </div>
                    {event.tag && (
                      <div className="mt-3 text-xs font-bold inline-block px-2 py-1 rounded-md opacity-50 bg-black/5 dark:bg-white/5 uppercase tracking-wide">
                        {event.tag}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Meta Profiling */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold mb-4 opacity-90">Prospect Card</h3>
            <ul className="space-y-4 text-sm">
              <li><span className="opacity-60 block">Email Address</span><span className="font-medium text-blue-500 hover:underline">{lead.contactEmail || '-'}</span></li>
              <li><span className="opacity-60 block">Phone Target</span><span className="font-medium">{lead.contactPhone || '-'}</span></li>
              <div className="h-px w-full bg-card-border/50 my-2"></div>
              <li><span className="opacity-60 block">WhatsApp Handle</span><span className="font-medium">{lead.contactWhatsapp || '-'}</span></li>
              <li><span className="opacity-60 block">WeChat ID</span><span className="font-medium">{lead.contactWechat || '-'}</span></li>
              <li><span className="opacity-60 block">Geo Country Code</span><span className="font-medium">{lead.countryCode || '-'}</span></li>
              
              <div className="h-px w-full bg-card-border/50 my-2"></div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">Digital Fingerprint (Anti-Risk)</h4>
              <li className="space-y-1">
                <span className="opacity-60 block text-xs">IP Address</span>
                <span className="font-mono text-[11px] bg-background/50 px-2 py-0.5 rounded border border-card-border/50">{lead.ipAddress || '-'}</span>
              </li>
              <li>
                <span className="opacity-60 block text-xs">Device Type</span>
                <span className="text-[11px] leading-tight block opacity-80 max-w-full truncate" title={lead.userAgent}>
                  {lead.userAgent || '-'}
                </span>
              </li>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-background/40 p-2 rounded-lg border border-card-border/30">
                  <span className="opacity-60 block text-[10px] uppercase">Session Duration</span>
                  <span className="font-bold text-xs">{lead.sessionDuration ? `${Math.floor(lead.sessionDuration / 60)}m ${lead.sessionDuration % 60}s` : '-'}</span>
                </div>
                <div className="bg-background/40 p-2 rounded-lg border border-card-border/30">
                  <span className="opacity-60 block text-[10px] uppercase">Page Views</span>
                  <span className="font-bold text-xs">{lead.pageViews || '-'} pages</span>
                </div>
              </div>
            </ul>
          </div>

          {lead.product && (
            <div className="glass-panel p-6 rounded-3xl border border-primary/20">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                 Target Request
               </h3>
               <div className="bg-primary/5 p-4 rounded-xl">
                 <p className="font-extrabold text-primary text-lg">{lead.product.name}</p>
                 <p className="text-xs opacity-70 mt-1 font-mono">SKU: {lead.product.sku}</p>
                 <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 text-primary font-bold text-xs rounded-full">
                   QTY: {lead.requestedQuantity || 0}
                 </div>
               </div>
            </div>
          )}

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold mb-4 opacity-90 block">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(lead.tags || []).map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
              {(!lead.tags || lead.tags.length === 0) && (
                 <span className="text-xs opacity-50 italic">No tags added.</span>
              )}
            </div>
            <form action={async (formData) => {
              'use server';
              const newTag = formData.get('newTag') as string;
              if (!newTag || !newTag.trim()) return;
              const tags = Array.from(new Set([...(lead.tags || []), newTag.trim()]));
              await fetchAdminAPI(`/admin/crm/leads/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ tags })
              });
              const { revalidatePath } = await import('next/cache');
              revalidatePath('/[locale]/admin/leads/[id]', 'page');
              revalidatePath('/[locale]/admin/leads', 'page');
            }} className="flex gap-2">
              <input type="text" name="newTag" placeholder="Add tag (e.g. VIP)" className="flex-1 bg-background/50 border border-card-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary" />
              <button type="submit" className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
