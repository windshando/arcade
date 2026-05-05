import { getPublicProducts, getPublicCategories } from '@/lib/api';
import { Link } from '@/i18n/routing';
import ProductActions from '@/components/products/ProductActions';

export const revalidate = 60; // 1 minute

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;

  const [products, categories] = await Promise.all([
    getPublicProducts(locale === 'zh-CN' ? 'ZH_CN' : 'EN', { categorySlug }),
    getPublicCategories(locale === 'zh-CN' ? 'ZH_CN' : 'EN'),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Our Products
        </h1>
        <p className="mt-4 max-w-2xl text-xl opacity-70 mx-auto">
          Explore our complete range of commercial arcade machines.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className={`block transition-colors hover:text-primary ${!categorySlug ? 'text-primary font-semibold' : 'text-foreground opacity-80'}`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block transition-colors hover:text-primary ${categorySlug === cat.slug ? 'text-primary font-semibold' : 'text-foreground opacity-80'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group card-hover">
                <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden flex items-center justify-center">
                    {/* Placeholder for Media */}
                    {product.media.length > 0 ? (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.media[0].url})` }} />
                    ) : (
                      <span className="text-gray-400 font-medium tracking-widest text-sm">NO IMAGE</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-primary font-medium mb-1">{product.category}</p>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ProductActions slug={product.slug} />
                      </div>
                    </div>
                    <p className="text-sm opacity-70 flex-1 line-clamp-3">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-12 text-center text-foreground opacity-60">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
