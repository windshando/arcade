import { getPublicProductDetail } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function ComparePage({
  searchParams,
  params
}: {
  searchParams: Promise<{ slugs?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { slugs } = await searchParams;

  if (!slugs) {
    return (
      <div className="min-h-screen pt-32 text-center text-foreground animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-4">Compare Machines</h1>
        <p className="opacity-70 mb-8">No machines selected for comparison.</p>
        <Link href="/products" className="btn-primary px-8">Browse Catalog</Link>
      </div>
    );
  }

  const slugList = slugs.split(',').filter(Boolean).slice(0, 4); // Max 4
  const products = await Promise.all(
    slugList.map(slug => getPublicProductDetail(slug, locale === 'zh-CN' ? 'ZH_CN' : 'EN').catch(() => null))
  ).then(res => res.filter(Boolean));

  if (products.length === 0) {
    return notFound();
  }

  // Aggregate all unique specs from the products to form row headers accurately
  const allSpecKeys = Array.from(new Set(
    products.flatMap(p => (p as any).specs.map((s: any) => s.key))
  ));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in min-h-screen">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Side-by-Side Comparison
          </h1>
          <p className="mt-2 text-sm opacity-70">
            Comparing {products.length} machine{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/products" className="text-primary hover:underline font-bold text-sm">
          ← Back to Catalog
        </Link>
      </div>

      <div className="glass-panel overflow-x-auto rounded-3xl p-6">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="w-48 p-4 font-bold opacity-60 uppercase text-xs tracking-widest border-b border-card-border/50 bg-card-bg/50">
                Features
              </th>
              {products.map((p: any) => (
                <th key={p.id} className="p-4 border-b border-card-border/50 text-center w-64 align-top">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner mb-4 relative flex items-center justify-center">
                    {p.media[0] ? (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${p.media[0].url})` }} />
                    ) : (
                       <span className="text-xs opacity-50 font-bold tracking-widest">NO IMAGE</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">{p.name}</h3>
                  <p className="text-xs text-primary mt-1 uppercase font-black tracking-wider">{p.category}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/30 text-sm">
            {/* Core Attributes */}
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">DIMENSIONS</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.dimensions || '-'}</td>)}
            </tr>
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">WEIGHT</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.weight || '-'}</td>)}
            </tr>
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">VOLTAGE</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.voltage || '-'}</td>)}
            </tr>
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">PRODUCT MOQ</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.moq || 1} Units</td>)}
            </tr>
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">LEAD TIME</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.leadTimeDays || '-'} Days</td>)}
            </tr>
            <tr className="hover:bg-card-border/10 transition-colors">
              <td className="p-4 font-bold opacity-70 text-xs tracking-widest">WARRANTY</td>
              {products.map((p: any) => <td key={p.id} className="p-4 text-center font-medium">{p.warrantyMonths || '-'} Months</td>)}
            </tr>

            {/* Dynamic Custom Specs */}
            {allSpecKeys.length > 0 && (
              <tr>
                <td colSpan={products.length + 1} className="py-6 px-4 bg-primary/5 uppercase font-black text-primary text-xs tracking-[0.2em] border-y border-primary/10">
                  Detailed Specifications
                </td>
              </tr>
            )}
            
            {allSpecKeys.map(key => (
              <tr key={key as string} className="hover:bg-card-border/10 transition-colors">
                <td className="p-4 font-bold opacity-70 text-xs tracking-widest">{String(key).replace(/_/g, ' ').toUpperCase()}</td>
                {products.map((p: any) => {
                  const spec = p.specs.find((s: any) => s.key === key);
                  return (
                    <td key={p.id} className="p-4 text-center font-medium opacity-90">
                      {spec ? spec.value : <span className="opacity-30">-</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
