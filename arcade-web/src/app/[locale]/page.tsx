import { getPublicSlides, getPublicAdvantages, getPublicCategories, getPublicProducts, getPublicPosts } from '@/lib/api';
import HeroSlider from '@/components/home/HeroSlider';
import AdvantageGrid from '@/components/home/AdvantageGrid';
import CategoryAccordion from '@/components/home/CategoryAccordion';
import ClientMarquee from '@/components/home/ClientMarquee';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import LatestNews from '@/components/home/LatestNews';
import FooterCTA from '@/components/home/FooterCTA';
import { getMessages } from 'next-intl/server';

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Arcade Trade | Premium B2B Amusement Machine Platform',
    description: 'The world\'s leading B2B marketplace for high-end arcade, redemption, and VR machines. Get industrial-grade amusement equipment.',
    openGraph: {
      type: 'website',
      siteName: 'Arcade Trade',
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch all parallel data safely
  const [slides, advantages, categories, products, posts] = await Promise.all([
    getPublicSlides(locale).catch(() => []),
    getPublicAdvantages(locale).catch(() => []),
    getPublicCategories(locale).catch(() => []),
    getPublicProducts(locale, { isFeatured: true }).catch(() => []),
    getPublicPosts(locale).catch(() => [])
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider slides={slides || []} />

      {/* Advantages Section */}
      <AdvantageGrid advantages={advantages || []} />

      {/* Category Showcase Section */}
      <CategoryAccordion categories={categories || []} />

      {/* Global Partners Marquee */}
      <ClientMarquee />

      {/* Flagship Products Grid */}
      <FeaturedProducts products={products || []} />

      {/* Latest News & Insights */}
      <LatestNews posts={posts || []} />

      {/* The Closer / Final CTA */}
      <FooterCTA />
    </main>
  );
}

