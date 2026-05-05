import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import EditPageClient from './EditPageClient';

export default async function EditPageWrapper({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  let page = null;
  
  if (id !== 'create') {
    page = await fetchAdminAPI(`/pages/admin/${id}`);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {page ? 'Edit Static Page' : 'Create New Page'}
        </h1>
        <p className="text-foreground opacity-60">Manage your policy, warranty, and other static content pages here.</p>
      </div>
      <EditPageClient initialData={page} locale={locale} />
    </div>
  );
}
