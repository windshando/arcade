import { fetchAdminAPI } from '@/lib/adminApi';
import ProductForm from '../ProductForm';
import { Link } from '@/i18n/routing';

export const revalidate = 0;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [categories, product] = await Promise.all([
    fetchAdminAPI('/categories/admin'),
    fetchAdminAPI(`/products/admin/${resolvedParams.id}`)
  ]);

  return (
    <div className="p-8 animate-fade-in max-w-4xl mx-auto pb-32">
      <div className="mb-8">
        <Link href="/admin/products" className="text-primary font-bold text-sm hover:underline mb-4 inline-block">
          ← Back to Catalog
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="opacity-70 mt-1">
          Modify product fields, content, and typesetting. Updates affect all regions.
        </p>
      </div>

      <div className="bg-card-bg/30 border border-card-border p-8 rounded-2xl shadow-sm">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
