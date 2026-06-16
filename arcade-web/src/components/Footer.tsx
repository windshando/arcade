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
           <p className="text-text-secondary text-xs">
             &copy; {new Date().getFullYear()} {copyright || 'Arcade Machine Trade'}. All rights reserved.
           </p>
           <div className="flex gap-6 items-center">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#main-content" className="ml-4 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
                Back to Top ↑
              </a>
           </div>
        </div>

      </div>
    </footer>
  );
}
