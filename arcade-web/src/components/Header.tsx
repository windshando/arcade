import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import { getLocale } from 'next-intl/server';
import { getPublicNavigation } from '@/lib/api';

export default async function Header() {
  const locale = await getLocale();
  const navData = await getPublicNavigation('main-nav', locale).catch(() => ({ items: [] }));
  const links = navData.items || [];
  
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-card-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              ARCADE<span className="text-foreground">TRADE</span>
            </Link>
          </div>
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            {links.length > 0 ? (
              links.map((item: any) => (
                <div key={item.id} className="relative group">
                  <Link 
                    href={item.url} 
                    target={item.isExternal ? '_blank' : undefined}
                    className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium flex items-center gap-1"
                  >
                    {item.label}
                    {item.children && item.children.length > 0 && (
                      <span className="text-xs opacity-50">▼</span>
                    )}
                  </Link>
                  {/* Dropdown Menu */}
                  {item.children && item.children.length > 0 && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-card-bg border border-card-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="py-1">
                        {item.children.map((child: any) => (
                          <Link 
                            key={child.id} 
                            href={child.url}
                            target={child.isExternal ? '_blank' : undefined}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <span className="text-sm opacity-50 italic">Setup Main Nav in Admin</span>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/" locale="en" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">
              EN
            </Link>
            <span className="text-card-border">|</span>
            <Link href="/" locale="zh-CN" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">
              中文
            </Link>
            <Link href="/contact" className="hidden md:block btn-primary ml-4">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
