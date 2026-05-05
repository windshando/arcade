'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { saveJobPosting } from '@/app/actions';

export default function EditPostingClient({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const LOCALES = ['EN', 'ZH_CN', 'JA', 'AR'];
  const [activeLocale, setActiveLocale] = useState('EN');

  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [type, setType] = useState(initialData?.type || 'FULL_TIME');
  const [salaryRange, setSalaryRange] = useState(initialData?.salaryRange || '');
  
  // Initialize translations state
  const [translations, setTranslations] = useState(LOCALES.map(loc => {
    const existing = initialData?.translations?.find((t: any) => t.locale === loc);
    return {
      locale: loc,
      title: existing?.title || '',
      description: existing?.description || '',
      requirements: existing?.requirements || ''
    };
  }));

  const handleUpdateTranslation = (field: string, value: string) => {
    setTranslations(prev => prev.map(t => 
      t.locale === activeLocale ? { ...t, [field]: value } : t
    ));
  };

  const getActiveT = () => translations.find(t => t.locale === activeLocale) || translations[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      status,
      department,
      location,
      type,
      salaryRange,
      translations: translations.filter(t => t.title || t.description)
    };

    try {
      await saveJobPosting(initialData?.id || null, payload);
      router.push(`/${locale}/admin/recruitment`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save job posting');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Status</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Department</label>
          <input 
            value={department} 
            onChange={e => setDepartment(e.target.value)} 
            placeholder="e.g. Sales & Marketing"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Location</label>
          <input 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            placeholder="e.g. Remote / New York"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Role Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">Salary / Compensation (Optional)</label>
          <input 
            value={salaryRange} 
            onChange={e => setSalaryRange(e.target.value)} 
            placeholder="e.g. Negotiable, or $70k - $90k"
            className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-card-border">
        {/* Locale Tabs */}
        <div className="flex gap-2 mb-6 border-b border-card-border pb-4">
          {LOCALES.map(loc => (
            <button 
              key={loc} 
              type="button" 
              onClick={() => setActiveLocale(loc)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeLocale === loc ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card-border/50 opacity-70 hover:opacity-100'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Locale specific fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Job Title ({activeLocale})</label>
            <input 
              required
              value={getActiveT().title} 
              onChange={e => handleUpdateTranslation('title', e.target.value)}
              placeholder="e.g. Senior Regional Sales Manager"
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Job Description ({activeLocale})</label>
            <div key={`${activeLocale}-desc`}>
              <RichTextEditor 
                name="description" 
                defaultValue={getActiveT().description} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Requirements / Qualifications ({activeLocale})</label>
            <div key={`${activeLocale}-req`}>
              <RichTextEditor 
                name="requirements" 
                defaultValue={getActiveT().requirements} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-card-border">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-card-border rounded-full hover:bg-card-border transition-colors text-sm font-bold">Cancel</button>
        <button type="submit" className="btn-primary py-3 px-8 text-sm font-bold tracking-wider" onClick={() => {
           // Standard DOM hack to pull current quill values into react state before we post the json
           const descHtml = document.querySelector('input[name="description"]');
           if (descHtml) handleUpdateTranslation('description', (descHtml as HTMLInputElement).value);
           const reqHtml = document.querySelector('input[name="requirements"]');
           if (reqHtml) handleUpdateTranslation('requirements', (reqHtml as HTMLInputElement).value);
        }}>
          Save Posting
        </button>
      </div>
    </form>
  );
}
