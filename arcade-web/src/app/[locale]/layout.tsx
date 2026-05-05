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
  const isAdmin = pathname.includes('/admin');

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />
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
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TrackingProvider>
            <ProductStoreProvider>
              <LayoutManager 
                layout={currentLayout} 
                isAdmin={isAdmin} 
                headerNode={<Header />}
                footerNode={<Footer copyright={globalOps.copyright} />}
              >
                {children}
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
