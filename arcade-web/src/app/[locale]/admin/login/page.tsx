'use client';

import { useActionState } from 'react';
import { loginAdmin } from '@/app/actions';
import { useRouter } from '@/i18n/routing';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);
  const router = useRouter();
  const t = useTranslations('AdminLogin');

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/leads');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: '#f8f9fb', fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="w-full max-w-md p-10 rounded-2xl shadow-lg" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1e293b' }}>
            {t('title')}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>{t('subtitle')}</p>
        </div>

        {state?.error && (
          <div className="p-3 rounded-lg mb-6 text-sm text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}>
            {state.error}
          </div>
        )}

        {state?.success ? (
          <div className="text-center font-medium py-8" style={{ color: '#22c55e' }}>
            {t('success')}
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>{t('email')}</label>
              <input 
                required 
                type="email" 
                name="email" 
                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
                placeholder={t('emailPlaceholder')} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>{t('password')}</label>
              <input 
                required 
                type="password" 
                name="password" 
                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
                placeholder={t('passwordPlaceholder')} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full py-3 text-sm font-semibold rounded-lg transition-colors text-white mt-2 ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              style={{ background: '#3b82f6' }}
            >
              {isPending ? t('signingIn') : t('signIn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
