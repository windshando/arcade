import { getPublicProductDetail } from '@/lib/api';
import ProductActions from '@/components/products/ProductActions';
import { notFound } from 'next/navigation';
import ProductGallery from './ProductGallery';
import DynamicPrice from '@/components/products/DynamicPrice';
import SocialShare from '@/components/products/SocialShare';
import RequestQuoteButton from '@/components/products/RequestQuoteButton';

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const product = await getPublicProductDetail(slug, locale === 'zh-CN' ? 'ZH_CN' : 'EN');
  if (!product) {
    notFound();
  }

  // Fetch Public Settings for reCAPTCHA key
  let recaptchaSiteKey = '';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      recaptchaSiteKey = data.global_options?.recaptchaSiteKey || '';
    }
  } catch (err) {}

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="w-full lg:w-1/2">
          <ProductGallery media={product.media} />
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-8">
          <div>
            <p className="text-primary font-bold tracking-wide uppercase text-sm mb-2">
              {product.category}
            </p>
            <div className="flex justify-between items-start mb-4 gap-6 align-top">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
                {product.name}
              </h1>
              <ProductActions slug={product.slug} className="mt-2" />
            </div>
            
            <DynamicPrice basePrice={product.basePrice} baseCurrency={product.baseCurrency} />

            <div 
              className="text-xl opacity-80 leading-relaxed font-light text-foreground space-y-4"
              dangerouslySetInnerHTML={{ __html: product.description || '' }}
            />
          </div>

          <hr className="border-card-border" />

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-6">
            {product.dimensions && (
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-sm opacity-60 font-medium uppercase mb-1">Dimensions</p>
                <p className="font-semibold">{product.dimensions}</p>
              </div>
            )}
            {product.voltage && (
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-sm opacity-60 font-medium uppercase mb-1">Voltage</p>
                <p className="font-semibold">{product.voltage}</p>
              </div>
            )}
            {product.playerCount && (
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-sm opacity-60 font-medium uppercase mb-1">Players</p>
                <p className="font-semibold">{product.playerCount}</p>
              </div>
            )}
            {product.warrantyMonths && (
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-sm opacity-60 font-medium uppercase mb-1">Warranty</p>
                <p className="font-semibold">{product.warrantyMonths} Months</p>
              </div>
            )}
          </div>

          {/* Detailed Specs */}
          {product.specs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Specifications</h3>
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-card-border">
                    {product.specs.map((spec: any, i: number) => (
                      <tr key={i} className="hover:bg-card-border transition-colors">
                        <td className="py-4 px-6 text-sm font-medium opacity-80 w-1/3">
                          {spec.key.replace(/_/g, ' ').toUpperCase()}
                        </td>
                        <td className="py-4 px-6 font-semibold">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customization Options */}
          {product.customizationEnabled && product.customizationOptions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Customization Options</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.customizationOptions.map((opt: any, i: number) => (
                   <li key={i} className="flex items-center space-x-3 glass-panel p-4 rounded-xl">
                    <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">{opt.key.replace(/_/g, ' ').toUpperCase()}</p>
                      <p className="text-xs opacity-70">{opt.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-8 text-foreground">
            <RequestQuoteButton 
              productName={product.name} 
              productSlug={product.slug} 
              productId={product.id}
              recaptchaSiteKey={recaptchaSiteKey} 
            />
            <SocialShare title={product.name} text={product.shortDescription} />
          </div>
        </div>
      </div>
    </main>
  );
}
