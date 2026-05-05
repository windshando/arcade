import { logoutAdmin } from '@/app/actions';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import AdminSidebarWrapper from '@/components/layout/AdminSidebarWrapper';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('Admin');

  return (
    <div
      data-admin
      className="flex h-screen overflow-hidden"
      style={{
        '--background': '#f8f9fb',
        '--foreground': '#1e293b',
        '--primary': '#3b82f6',
        '--primary-hover': '#2563eb',
        '--secondary': '#64748b',
        '--accent': '#0ea5e9',
        '--success': '#22c55e',
        '--danger': '#ef4444',
        '--card-bg': '#ffffff',
        '--card-border': '#e2e8f0',
        '--radius': '0.75rem',
        '--glass-bg': 'rgba(255, 255, 255, 0.8)',
        '--glass-border': 'rgba(0, 0, 0, 0.06)',
        background: '#f8f9fb',
        color: '#1e293b',
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      } as React.CSSProperties}
    >
      <AdminSidebarWrapper>
        <aside className="w-64 border-r flex flex-col z-20 shadow-sm print:hidden" style={{ background: '#ffffff', borderColor: '#e2e8f0' }}>
          <div className="h-14 flex items-center justify-center" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <Link href="/admin" className="font-extrabold text-xl tracking-tight" style={{ color: '#3b82f6' }}>
              {t('brand')}<span style={{ color: '#1e293b' }}>{t('brandSuffix')}</span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-3 overflow-y-auto">
            <Link href="/admin" className="block px-3 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ color: '#1e293b' }}>
              {t('dashboard')}
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1" style={{ color: '#94a3b8' }}>{t('crmInbox')}</p>
            <Link href="/admin/leads" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('leads')}
            </Link>
            <Link href="/admin/chat" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('liveChat')}
            </Link>
            <Link href="/admin/recruitment" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('recruitment')}
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1" style={{ color: '#94a3b8' }}>{t('catalog')}</p>
            <Link href="/admin/products" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('products')}
            </Link>
            <Link href="/admin/categories" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('categories')}
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1" style={{ color: '#94a3b8' }}>{t('content')}</p>
            <Link href="/admin/blog" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('blogPosts')}
            </Link>
            <Link href="/admin/pages" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('staticPages')}
            </Link>
            <Link href="/admin/faqs" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('faq')}
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1" style={{ color: '#94a3b8' }}>{t('marketing')}</p>
            <Link href="/admin/campaigns" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('campaigns')}
            </Link>
            <Link href="/admin/promotions" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('promotions')}
            </Link>
            <Link href="/admin/subscribers" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('subscribers')}
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1" style={{ color: '#94a3b8' }}>{t('site')}</p>
            <Link href="/admin/slides" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('heroSlider')}
            </Link>
            <Link href="/admin/advantages" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('advantages')}
            </Link>
            <Link href="/admin/navigation" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('navigation')}
            </Link>
            <Link href="/admin/settings" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors" style={{ color: '#475569' }}>
              {t('settings')}
            </Link>
          </nav>
          <div className="p-3" style={{ borderTop: '1px solid #e2e8f0' }}>
            <form action={logoutAdmin}>
               <button type="submit" className="w-full py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2" style={{ color: '#94a3b8' }}>
                 {t('logOut')}
               </button>
            </form>
          </div>
        </aside>
      </AdminSidebarWrapper>
      <main className="flex-1 overflow-y-auto relative animate-fade-in print:overflow-visible print:bg-white print:block" style={{ background: '#f8f9fb' }}>
        {children}
      </main>
    </div>
  );
}
