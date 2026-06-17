'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '中文' },
];

export default function HeaderClient({ links, locale }: { links: any[], locale: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const toggleDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card-bg/95 backdrop-blur-md border-b border-card-border shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="page-wrapper">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              ARCADE<span className="text-foreground">TRADE</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8 items-center">
            {links.length > 0 ? (
              links.map((item: any) => (
                <div key={item.id} className="relative group">
                  {item.children && item.children.length > 0 ? (
                    <button 
                      onClick={() => toggleDropdown(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setOpenDropdown(null);
                      }}
                      className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium flex items-center gap-1 focus-visible"
                      aria-expanded={openDropdown === item.id}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.id ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                    </button>
                  ) : (
                    <Link 
                      href={item.url} 
                      target={item.isExternal ? '_blank' : undefined}
                      className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium flex items-center gap-1 focus-visible"
                    >
                      {item.label}
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.children && item.children.length > 0 && (
                    <div 
                      className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-card-bg border border-card-border transition-all z-50 ${
                        openDropdown === item.id || 'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 opacity-0 invisible translate-y-2'
                      }`}
                    >
                      <div className="py-1">
                        {item.children.map((child: any) => (
                          <Link 
                            key={child.id} 
                            href={child.url}
                            target={child.isExternal ? '_blank' : undefined}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => setOpenDropdown(null)}
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
              <span className="text-sm text-text-tertiary italic">Setup Main Nav in Admin</span>
            )}
          </nav>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-text-secondary hover:text-foreground transition-colors px-2 py-2 focus-visible">
                {LOCALES.find(l => l.code === locale)?.label || 'Language'}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-card-bg border border-card-border opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                <div className="py-1">
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={pathname}
                      locale={l.code}
                      className={`block px-4 py-2 text-sm transition-colors ${locale === l.code ? 'text-primary font-medium bg-primary/5' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/contact" className="btn-primary">
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
              className="text-foreground p-2 focus-visible"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden overflow-y-auto border-t border-card-border animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {links.map((item: any) => (
              <div key={item.id} className="space-y-1">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="w-full flex justify-between items-center px-3 py-4 text-base font-medium text-foreground border-b border-border-subtle focus-visible"
                      aria-expanded={openDropdown === item.id}
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.id && (
                      <div className="pl-4 py-2 space-y-1 bg-surface-elevated/50">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            target={child.isExternal ? '_blank' : undefined}
                            className="block px-3 py-3 text-sm font-medium text-text-secondary hover:text-primary transition-colors border-b border-border-subtle last:border-0"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.url}
                    target={item.isExternal ? '_blank' : undefined}
                    className="block px-3 py-4 text-base font-medium text-foreground border-b border-border-subtle focus-visible"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-card-border flex flex-col gap-4 px-3">
              <div className="space-y-1">
                <button
                  onClick={() => toggleDropdown('lang')}
                  className="w-full flex justify-between items-center py-4 text-base font-medium text-foreground border-b border-border-subtle focus-visible"
                >
                  Language ({LOCALES.find(l => l.code === locale)?.label || 'EN'})
                  <ChevronDown className={`w-5 h-5 transition-transform ${openDropdown === 'lang' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'lang' && (
                  <div className="pl-4 py-2 space-y-1 bg-surface-elevated/50">
                    {LOCALES.map((l) => (
                      <Link
                        key={l.code}
                        href={pathname}
                        locale={l.code}
                        className={`block px-3 py-3 text-sm font-medium transition-colors border-b border-border-subtle last:border-0 ${locale === l.code ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/contact" className="btn-primary w-full text-center mt-4">
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
