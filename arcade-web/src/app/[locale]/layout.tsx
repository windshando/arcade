import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import { ProductStoreProvider } from '@/components/products/ProductStoreProvider';
import StickyCompareBar from '@/components/products/StickyCompareBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import CookieConsent from '@/components/CookieConsent';
import FloatingContactWidget from '@/components/FloatingContactWidget';
import TrackingProvider from '@/components/TrackingProvider';
import LayoutManager from '@/components/layout/LayoutManager';
import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: {
      template: '%s | Arcade Trade',
      default: 'Arcade Trade - Industrial B2B Platform',
    },
    description: 'World-class industrial B2B trading platform for arcades.',
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  // Detect admin route
  const headersList = await headers();
  const pathname = headersList.get('x-next-url') || headersList.get('x-invoke-path') || headersList.get('referer') || '';
  const isAdmin = pathname.includes('/admin') && !pathname.includes('/admin/login');

  // Fetch Public Settings
  let globalOps: any = {};
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`, { 
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      globalOps = data.global_options || {};
    }
  } catch (err) {}

  const currentTheme = globalOps.currentTheme || 'arcade';
  const currentLayout = globalOps.currentLayout || 'header';

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} data-theme={currentTheme}>
      <head>
        {globalOps.gaTrackingId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${globalOps.gaTrackingId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${globalOps.gaTrackingId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`flex flex-col min-h-screen ${inter.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-primary focus:text-white">
          Skip to main content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TrackingProvider>
            <ProductStoreProvider>
              <LayoutManager 
                layout={currentLayout} 
                isAdmin={isAdmin} 
                headerNode={<Header />}
                footerNode={<Footer copyright={globalOps.copyright} />}
              >
                <div id="main-content" className="flex-1 w-full flex flex-col">
                  {children}
                </div>
              </LayoutManager>
              
              <FloatingContactWidget />
              <CookieConsent />
            </ProductStoreProvider>
          </TrackingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
