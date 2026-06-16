import { getLocale } from 'next-intl/server';
import { getPublicNavigation } from '@/lib/api';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const locale = await getLocale();
  const navData = await getPublicNavigation('main-nav', locale).catch(() => ({ items: [] }));
  const links = navData.items || [];
  
  return <HeaderClient links={links} locale={locale} />;
}
