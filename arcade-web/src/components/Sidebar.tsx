'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingBag, 
  Briefcase, 
  Users, 
  HelpCircle, 
  Mail,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('products'), href: '/products', icon: ShoppingBag },
    { name: t('careers'), href: '/careers', icon: Briefcase },
    { name: t('franchise'), href: '/franchise', icon: Users },
    { name: t('faq'), href: '/faq', icon: HelpCircle },
    { name: t('contact'), href: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[55] w-64 bg-card-bg border-r border-card-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-10 px-2">
            <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
              ARCADE<span className="text-foreground">TRADE</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-foreground/60 hover:bg-card-border hover:text-foreground'}
                  `}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-card-border">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 px-4">
              © {new Date().getFullYear()} ARCADE
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        />
      )}
    </>
  );
}
