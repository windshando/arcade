'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { deleteAdvantage, updateAdvantage } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, Eye, EyeOff, Move, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function AdvantageListClient({ initialAdvantages }: { initialAdvantages: any[] }) {
  const [advantages, setAdvantages] = useState(initialAdvantages);

  useEffect(() => {
    setAdvantages(initialAdvantages);
  }, [initialAdvantages]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advantage?')) return;
    try {
      await deleteAdvantage(id);
      setAdvantages(advantages.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete advantage');
    }
  };

  const toggleStatus = async (adv: any) => {
    const newStatus = adv.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await updateAdvantage(adv.id, { status: newStatus });
      setAdvantages(advantages.map(a => a.id === adv.id ? { ...a, status: newStatus } : a));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {advantages.length === 0 ? (
        <div className="text-center py-20 bg-card-bg/30 border border-dashed border-card-border rounded-3xl">
          <p className="opacity-50">No advantages created yet. Start by adding a new one.</p>
        </div>
      ) : (
        advantages.map((adv) => {
          const IconComponent = (LucideIcons as any)[adv.iconName] || Star;

          return (
            <div key={adv.id} className="glass-panel p-4 rounded-2xl flex items-center gap-6 group hover:border-primary/30 transition-all">
              {/* Preview */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <IconComponent size={32} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-extrabold text-lg truncate">{adv.translations[0]?.title || 'Untitled'}</h3>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      adv.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-500'
                   }`}>
                      {adv.status}
                   </span>
                </div>
                <p className="text-sm opacity-60 truncate mb-2">{adv.translations[0]?.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-xs font-medium opacity-50">
                  <span className="flex items-center gap-1"><Move size={12} /> Index: {adv.sortOrder}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pr-2">
                <button 
                  onClick={() => toggleStatus(adv)}
                  className={`p-2 rounded-lg transition-colors ${
                    adv.status === 'PUBLISHED' ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-success/10 text-success'
                  }`}
                  title={adv.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                >
                  {adv.status === 'PUBLISHED' ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Link 
                  href={`/admin/advantages/${adv.id}`}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Edit Advantage"
                >
                  <Edit3 size={20} />
                </Link>
                <button 
                  onClick={() => handleDelete(adv.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
