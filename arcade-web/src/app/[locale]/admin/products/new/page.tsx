import NewProductForm from './NewProductForm';
import { cookies } from 'next/headers';
import { Link } from '@/i18n/routing';

export const revalidate = 0;

export default async function NewProductPage() {
  let categories: any[] = [];

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    const response = await fetch(`${API_BASE_URL}/categories/admin`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      categories = await response.json();
    }
  } catch (e) {
    // Silently fail — page renders with empty categories
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto animate-fade-in space-y-6">
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
        <NewProductForm categories={categories} />
      </div>
    </div>
  );
}
