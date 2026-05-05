'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StickyCompareBar from '@/components/products/StickyCompareBar';
import ChatWidget from '@/components/ChatWidget';

interface LayoutManagerProps {
  children: React.ReactNode;
  layout: 'header' | 'sidebar';
  isAdmin: boolean; // Retained for backwards compatibility but we override it
  headerNode?: React.ReactNode;
  footerNode?: React.ReactNode;
}

export default function LayoutManager({ children, layout, isAdmin, headerNode, footerNode }: LayoutManagerProps) {
  const pathname = usePathname() || '';
  const isActuallyAdmin = isAdmin || pathname.includes('/admin');

  if (isActuallyAdmin) {
    return <>{children}</>;
  }

  if (layout === 'sidebar') {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1">
            {children}
          </main>
          {footerNode}
          <StickyCompareBar />
          <ChatWidget />
        </div>
      </div>
    );
  }

  // Default Header Layout
  return (
    <>
      {headerNode}
      <main className="flex-1">
        {children}
      </main>
      {footerNode}
      <ChatWidget />
      <StickyCompareBar />
    </>
  );
}
