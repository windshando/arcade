import NewsletterWidget from './NewsletterWidget';
import { getLocale } from 'next-intl/server';
import { getPublicNavigation } from '@/lib/api';
import { Link } from '@/i18n/routing';

export default async function Footer({ copyright }: { copyright?: string }) {
  const locale = await getLocale();
  const navData = await getPublicNavigation('footer-nav', locale).catch(() => ({ items: [] }));
  const columns = navData.items || [];

  return (
    <footer className="bg-card-bg border-t border-card-border pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter — Full Width Centered */}
        <div className="flex justify-center mb-16">
          <NewsletterWidget />
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary inline-block mb-4">
              ARCADE<span className="text-foreground">TRADE</span>
            </Link>
            <p className="opacity-60 max-w-xs">
               Your premier B2B partner for commercial-grade amusement machines.
            </p>
          </div>

          {/* Dynamic Navigation Columns */}
          <div className="col-span-2 md:col-span-8 flex flex-wrap gap-12 justify-start md:justify-end">
            {columns.map((col: any) => (
              <div key={col.id} className="min-w-[120px]">
                <h4 className="font-bold tracking-widest uppercase text-foreground mb-4">{col.label}</h4>
                {col.children && col.children.length > 0 && (
                  <ul className="space-y-3">
                    {col.children.map((child: any) => (
                       <li key={child.id}>
                         <Link 
                           href={child.url} 
                           target={child.isExternal ? '_blank' : undefined}
                           className="opacity-60 hover:opacity-100 hover:text-primary transition-colors text-sm"
                         >
                           {child.label}
                         </Link>
                       </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-card-border/50 text-center md:text-left gap-4">
           <p className="opacity-50 text-xs">
             &copy; {new Date().getFullYear()} {copyright || 'Arcade Machine Trade'}. All rights reserved.
           </p>
           <div className="flex gap-4 opacity-50">
              <span>B2B Platform Engine</span>
           </div>
        </div>

      </div>
    </footer>
  );
}
