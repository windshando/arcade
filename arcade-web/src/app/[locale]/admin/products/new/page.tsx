import { fetchAdminAPI } from '@/lib/adminApi';
import ProductForm from '../ProductForm';
import { Link } from '@/i18n/routing';

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await fetchAdminAPI('/categories/admin');

  return (
    <div className="p-8 animate-fade-in pb-32 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="text-primary hover:underline font-bold text-sm inline-flex items-center gap-2">
          ← Back to Catalog
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
        <p className="opacity-70 mt-1">
          Provide the base details in English. The system will auto-translate the content to other enabled locales initially.
        </p>
      </div>

      <div className="bg-card-bg/30 border border-card-border p-8 rounded-2xl shadow-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
