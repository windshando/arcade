import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import EditPostingClient from './EditPostingClient';

export default async function EditPostingWrapper({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  let posting = null;
  
  if (id !== 'create') {
    posting = await fetchAdminAPI(`/recruitment/admin/postings/${id}`);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {posting ? 'Edit Job Posting' : 'Create Job Posting'}
        </h1>
        <p className="text-foreground opacity-60">Manage job roles, requirements, and descriptions publicly visible on the Careers page.</p>
      </div>
      <EditPostingClient initialData={posting} locale={locale} />
    </div>
  );
}
