import { fetchAdminAPI } from '@/lib/adminApi';
import EditBlogClient from './EditBlogClient';

export const revalidate = 0;

export default async function AdminBlogEditPage({
  params
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params;
  
  let initialData = null;
  if (id !== 'new') {
    const posts = await fetchAdminAPI('/blog/admin/posts');
    initialData = posts.find((p: any) => p.id === id);
  }

  // Fetch blog categories if available, else empty array
  let categories = [];
  try {
    categories = await fetchAdminAPI('/blog/admin/categories'); 
  } catch (e) {}

  return (
    <div className="p-8 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {id === 'new' ? 'Create Blog Post' : 'Edit Blog Post'}
        </h1>
        <p className="opacity-70 mt-1">
          {id === 'new' ? 'Draft a new article.' : `Editing ${initialData?.slug || 'post'}`}
        </p>
      </div>

      <EditBlogClient initialData={initialData} locale={locale} categories={categories} />
    </div>
  );
}
