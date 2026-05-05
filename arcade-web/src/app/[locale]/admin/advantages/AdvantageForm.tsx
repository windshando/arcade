'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdvantage, updateAdvantage } from '@/app/actions';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import * as LucideIcons from 'lucide-react';

const ICON_OPTIONS = [
  'Cpu', 'Globe', 'Rocket', 'ShieldCheck', 'Settings', 'Zap', 'Star',
  'Activity', 'Anchor', 'Award', 'BatteryCharging', 'Crosshair',
  'Fingerprint', 'Gamepad2', 'Ghost', 'Microscope', 'Radio', 'Server'
];

export default function AdvantageForm({ initialData = null, isEditing = false }: { initialData?: any, isEditing?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: initialData?.status || 'PUBLISHED',
    iconName: initialData?.iconName || 'Cpu',
    sortOrder: initialData?.sortOrder || 0,
    title: initialData?.translations?.[0]?.title || '',
    description: initialData?.translations?.[0]?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setIcon = (iconName: string) => {
    setFormData(prev => ({ ...prev, iconName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        status: formData.status,
        iconName: formData.iconName,
        sortOrder: parseInt(formData.sortOrder.toString()),
        translations: [
          {
            locale: 'EN',
            title: formData.title,
            description: formData.description,
          }
        ]
      };

      if (isEditing) {
        await updateAdvantage(initialData.id, payload);
      } else {
        await createAdvantage(payload);
      }
      router.push('/admin/advantages');
    } catch (error) {
      alert('Failed to save advantage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/advantages" className="p-2 bg-card-bg border border-card-border rounded-xl hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-bold flex-1">{isEditing ? 'Edit Advantage' : 'New Advantage'}</h2>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSubmitting ? 'Saving...' : 'Save Advantage'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg mb-4 text-primary">Content [English]</h3>
            <div>
              <label className="block text-sm font-bold opacity-70 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full bg-card-bg border border-card-border p-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Advanced Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-bold opacity-70 mb-1">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                rows={4}
                className="w-full bg-card-bg border border-card-border p-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                placeholder="Briefly describe this advantage..."
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="font-bold text-lg mb-4 text-primary">Select Icon</h3>
             <div className="grid grid-cols-6 sm:grid-cols-9 gap-3">
                {ICON_OPTIONS.map(iconName => {
                   const IconComponent = (LucideIcons as any)[iconName];
                   if (!IconComponent) return null;
                   const isSelected = formData.iconName === iconName;
                   
                   return (
                      <button
                         key={iconName}
                         type="button"
                         onClick={() => setIcon(iconName)}
                         className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                            isSelected ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-card-bg border-card-border hover:border-primary/50 text-slate-400'
                         }`}
                         title={iconName}
                      >
                         <IconComponent size={24} />
                      </button>
                   );
                })}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
             <h3 className="font-bold text-lg mb-4 text-primary">Settings</h3>
             <div>
                <label className="block text-sm font-bold opacity-70 mb-1">Visibility Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-card-bg border border-card-border p-3 rounded-xl">
                  <option value="PUBLISHED">Published (Visible)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-bold opacity-70 mb-1">Sort Order</label>
                <input 
                  type="number" 
                  name="sortOrder" 
                  value={formData.sortOrder} 
                  onChange={handleChange} 
                  className="w-full bg-card-bg border border-card-border p-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
             </div>
          </div>

          {/* Live Preview */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
             <h3 className="font-bold text-lg mb-4 text-primary">Live Preview</h3>
             <div className="bg-background rounded-xl p-6 border border-card-border text-center flex flex-col items-center gap-4">
                {formData.iconName && (LucideIcons as any)[formData.iconName] && (
                   <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.15)] mx-auto">
                      {(() => {
                         const PreviewIcon = (LucideIcons as any)[formData.iconName];
                         return <PreviewIcon size={32} />;
                      })()}
                   </div>
                )}
                <div>
                   <h4 className="text-xl font-bold tracking-tight mb-2">{formData.title || 'Advantage Title'}</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">{formData.description || 'Description will appear here...'}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </form>
  );
}
