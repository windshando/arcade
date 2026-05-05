'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  if (pathname.includes('/admin/login')) {
    return null;
  }
  
  return <>{children}</>;
}
