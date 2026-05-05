'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

const COLUMNS = [
  { id: 'NEW', label: 'New / Inbox', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'CONTACTED', label: 'Contacted', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { id: 'QUOTED', label: 'Quoted', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { id: 'NEGOTIATING', label: 'Negotiating', color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
  { id: 'WON', label: 'Won', color: 'text-success bg-success/10 border-success/20' },
  { id: 'LOST', label: 'Lost', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
];

export default function KanbanBoard({ initialLeads, onLeadMove }: { initialLeads: any[], onLeadMove: (id: string, status: string) => Promise<void> }) {
  const [leads, setLeads] = useState(initialLeads);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    setDraggedLead(null);

    try {
      await onLeadMove(leadId, newStatus);
    } catch (error) {
      console.error('Failed to move lead:', error);
      // Fallback
      setLeads([...initialLeads]);
    }
  };

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-6 h-[calc(100vh-250px)] animate-fade-in snap-x">
      {COLUMNS.map((col) => (
        <div 
          key={col.id}
          className="flex-shrink-0 w-80 flex flex-col bg-card-bg/30 border border-card-border/50 rounded-2xl overflow-hidden snap-center"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-card-border/50 bg-card-bg/50 backdrop-blur-md flex justify-between items-center">
            <h3 className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${col.color}`}>
              {col.label}
            </h3>
            <span className="text-xs font-bold opacity-60">
              {leads.filter(l => l.status === col.id).length}
            </span>
          </div>

          {/* Cards Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
            {leads.filter(l => l.status === col.id).map(lead => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => handleDragStart(e, lead.id)}
                onDragEnd={() => setDraggedLead(null)}
                className={`group cursor-grab active:cursor-grabbing p-4 rounded-xl border transition-all duration-200 shadow-sm ${
                  draggedLead === lead.id ? 'opacity-50 border-primary scale-95' : 'bg-card border-card-border/50 hover:border-primary/50 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black opacity-50 uppercase tracking-wider">{lead.inquiryType}</span>
                  <span className="text-[10px] bg-foreground/5 px-2 py-0.5 rounded opacity-70">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <h4 className="font-extrabold text-sm mb-1">{lead.contactName || 'Unknown Contact'}</h4>
                <p className="text-xs opacity-60 truncate mb-3">{lead.contactEmail || lead.contactPhone}</p>
                
                {lead.product && (
                  <div className="text-xs font-medium bg-primary/10 text-primary w-fit px-2 py-1 rounded-md max-w-full truncate">
                    {lead.product.name}
                  </div>
                )}
                
                {lead.tags && lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {lead.tags.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-bold uppercase bg-foreground/10 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-card-border/50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/leads/${lead.id}`} className="text-xs font-bold text-primary hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Drop Target Placeholder */}
            {draggedLead && (
              <div className="h-24 border-2 border-dashed border-card-border/50 rounded-xl bg-card-bg/20 transition-all"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
