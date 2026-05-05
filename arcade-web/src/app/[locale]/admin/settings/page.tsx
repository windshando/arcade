import React from 'react';
import { fetchAdminAPI } from '@/lib/adminApi';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

async function saveMailgunOptions(formData: FormData) {
  'use server';
  const apiKey = formData.get('apiKey') as string;
  const domain = formData.get('domain') as string;
  const fromEmail = formData.get('fromEmail') as string;
  
  await fetchAdminAPI('/newsletter/admin/settings', {
    method: 'POST',
    body: JSON.stringify({ apiKey, domain, fromEmail })
  });
  
  revalidatePath('/[locale]/admin/settings');
}

async function saveGlobalOptions(formData: FormData) {
  'use server';
  const settings = {
    copyright: formData.get('copyright') as string,
    gaTrackingId: formData.get('gaTrackingId') as string,
    isRecaptchaEnabled: formData.get('isRecaptchaEnabled') === 'on',
    recaptchaSiteKey: formData.get('recaptchaSiteKey') as string,
    recaptchaSecretKey: formData.get('recaptchaSecretKey') as string,
    contactWhatsapp: formData.get('contactWhatsapp') as string,
    contactPhone: formData.get('contactPhone') as string,
    currentTheme: formData.get('currentTheme') as string,
    currentLayout: formData.get('currentLayout') as string,
  };
  
  await fetchAdminAPI('/settings/admin', {
    method: 'POST',
    body: JSON.stringify({ key: 'global_options', value: settings })
  });
  
  revalidatePath('/[locale]/admin/settings');
}

export default async function AdminSettingsPage() {
  const t = await getTranslations('AdminSettings');
  const mailgun = await fetchAdminAPI('/newsletter/admin/settings');
  const allSettings = await fetchAdminAPI('/settings/admin');
  const _g = allSettings?.find((s:any) => s.settingKey === 'global_options');
  const globalOps = _g?.settingValue || {};

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('title')}</h1>
        <p className="text-foreground opacity-60">{t('subtitle')}</p>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-primary">{t('globalOptions')}</h2>
          <p className="text-sm opacity-70">{t('globalDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 border border-card-border rounded-2xl bg-card-bg">
            <h3 className="text-sm font-bold opacity-70 mb-4 uppercase tracking-widest">{t('siteTheme')}</h3>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { id: 'arcade', name: t('themeArcade'), desc: t('themeArcadeDesc') },
                 { id: 'minimalist', name: t('themeMinimalist'), desc: t('themeMinimalistDesc') },
                 { id: 'dark-night', name: t('themeDarkNight'), desc: t('themeDarkNightDesc') },
                 { id: 'retro-arcade', name: t('themeRetro'), desc: t('themeRetroDesc') }
               ].map(theme => (
                 <label key={theme.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${globalOps.currentTheme === theme.id ? 'border-primary bg-primary/5' : 'border-card-border hover:bg-card-border/30'}`}>
                   <input 
                     type="radio" 
                     name="currentTheme" 
                     value={theme.id} 
                     defaultChecked={globalOps.currentTheme === theme.id || (theme.id === 'arcade' && !globalOps.currentTheme)}
                     form="global-settings-form"
                     className="mt-1"
                   />
                   <div>
                     <p className="font-bold text-sm">{theme.name}</p>
                     <p className="text-xs opacity-60 tracking-tight">{theme.desc}</p>
                   </div>
                 </label>
               ))}
            </div>
          </div>

          <div className="glass-panel p-6 border border-card-border rounded-2xl bg-card-bg">
            <h3 className="text-sm font-bold opacity-70 mb-4 uppercase tracking-widest">{t('navLayout')}</h3>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { id: 'header', name: t('layoutHeader'), desc: t('layoutHeaderDesc') },
                 { id: 'sidebar', name: t('layoutSidebar'), desc: t('layoutSidebarDesc') }
               ].map(layout => (
                 <label key={layout.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${globalOps.currentLayout === layout.id ? 'border-primary bg-primary/5' : 'border-card-border hover:bg-card-border/30'}`}>
                   <input 
                     type="radio" 
                     name="currentLayout" 
                     value={layout.id} 
                     defaultChecked={globalOps.currentLayout === layout.id || (layout.id === 'header' && !globalOps.currentLayout)}
                     form="global-settings-form"
                     className="mt-1"
                   />
                   <div>
                     <p className="font-bold text-sm">{layout.name}</p>
                     <p className="text-xs opacity-60 tracking-tight">{layout.desc}</p>
                   </div>
                 </label>
               ))}
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-8 border border-card-border shadow-sm rounded-2xl bg-card-bg">
          <form id="global-settings-form" action={saveGlobalOptions} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('copyright')}</label>
                <input 
                  name="copyright" 
                  defaultValue={globalOps.copyright || ''}
                  placeholder="e.g. Arcade Trade Ltd."
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('gaTracking')}</label>
                <input 
                  name="gaTrackingId" 
                  defaultValue={globalOps.gaTrackingId || ''}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('contactWhatsapp')}</label>
                  <input 
                    name="contactWhatsapp" 
                    defaultValue={globalOps.contactWhatsapp || ''}
                    placeholder="e.g. +1234567890"
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('contactPhone')}</label>
                  <input 
                    name="contactPhone" 
                    defaultValue={globalOps.contactPhone || ''}
                    placeholder="e.g. +1 234 567 890"
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div className="border border-card-border rounded-xl p-4 bg-background mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox"
                    name="isRecaptchaEnabled"
                    defaultChecked={globalOps.isRecaptchaEnabled}
                    className="w-5 h-5 accent-primary"
                    id="isRecaptchaEnabled"
                  />
                  <label htmlFor="isRecaptchaEnabled" className="font-bold text-sm tracking-wide">{t('recaptchaEnable')}</label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold opacity-70 mb-1 tracking-wider">{t('siteKey')}</label>
                    <input 
                      name="recaptchaSiteKey" 
                      defaultValue={globalOps.recaptchaSiteKey || ''}
                      placeholder="Public key..."
                      className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold opacity-70 mb-1 tracking-wider">{t('secretKey')}</label>
                    <input 
                      type="password"
                      name="recaptchaSecretKey" 
                      defaultValue={globalOps.recaptchaSecretKey || ''}
                      placeholder="Private key..."
                      className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn-primary py-3 px-8 text-sm">{t('saveGlobal')}</button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-primary">{t('mailgun')}</h2>
          <p className="text-sm opacity-70">{t('mailgunDesc')}</p>
        </div>
        
        <div className="glass-panel p-8 border border-card-border shadow-sm rounded-2xl bg-card-bg">
          <form action={saveMailgunOptions} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('mailgunDomain')}</label>
                <input 
                  name="domain" 
                  defaultValue={mailgun.domain || ''}
                  placeholder="mg.yourarcade.com"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('senderAddress')}</label>
                <input 
                  name="fromEmail" 
                  defaultValue={mailgun.fromEmail || ''}
                  placeholder="ArcadeTrade <no-reply@yourarcade.com>"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold opacity-70 mb-2 uppercase tracking-widest">{t('secretApiKey')}</label>
              <input 
                type="password"
                name="apiKey" 
                defaultValue={mailgun.apiKey || ''}
                placeholder="key-........................"
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl font-mono text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn-primary py-3 px-8 text-sm">{t('saveMailgun')}</button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
