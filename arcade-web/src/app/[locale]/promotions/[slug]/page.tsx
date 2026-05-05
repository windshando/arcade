import React from 'react';
import { getPublicPromotion } from '@/lib/api';
import { notFound } from 'next/navigation';
import PromotionTracker from './PromotionTracker'; // Client component

export default async function PublicPromotionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // This fetch dynamically tallies +1 to viewCount precisely because it's configured natively on the backend
  const promotion = await getPublicPromotion(resolvedParams.slug).catch(() => null);

  if (!promotion) {
    notFound();
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-5xl mx-auto px-4 py-16">
      
      {/* Invisibly injects the campaign ID into the client's browser layer immediately on load */}
      <PromotionTracker slug={promotion.slug} />

      <div className="glass-panel p-8 md:p-16 border-t-4 border-primary rounded-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold tracking-widest uppercase rounded-full text-sm">
          Exclusive Promotion
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-foreground drop-shadow-md">
          {promotion.title}
        </h1>

        <div className="prose prose-invert prose-lg max-w-none text-left bg-background/30 p-8 rounded-2xl border border-card-border shadow-inner" 
             dangerouslySetInnerHTML={{ __html: promotion.bodyHtml || '<p>No content provided.</p>' }} 
        />
        
        <div className="pt-8 flex justify-center gap-6">
          <a href={
            promotion.targetProduct
              ? `/en/products/${promotion.targetProduct.slug}`
              : promotion.targetCategory 
              ? `/en/products?categorySlug=${promotion.targetCategory.slug}`
              : "/en/products"
          } className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20">
             {promotion.targetProduct ? 'View Featured Machine →' : 'Explore Eligible Products →'}
          </a>
        </div>
      </div>
    </div>
  );
}
