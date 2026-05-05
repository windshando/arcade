'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface TrackingContextType {
  getTrackingData: () => { sessionDuration: number; pageViews: number };
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) throw new Error('useTracking must be used within a TrackingProvider');
  return context;
};

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize session start time if not exists
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('arcade_session_start')) {
        sessionStorage.setItem('arcade_session_start', Date.now().toString());
      }
      
      // Initialize page views if not exists
      if (!sessionStorage.getItem('arcade_page_views')) {
        sessionStorage.setItem('arcade_page_views', '0');
      }
    }
  }, []);

  useEffect(() => {
    // Increment page views on route change
    if (typeof window !== 'undefined') {
      const currentViews = parseInt(sessionStorage.getItem('arcade_page_views') || '0');
      sessionStorage.setItem('arcade_page_views', (currentViews + 1).toString());
    }
  }, [pathname]);

  const getTrackingData = () => {
    if (typeof window === 'undefined') return { sessionDuration: 0, pageViews: 0 };
    
    const startTime = parseInt(sessionStorage.getItem('arcade_session_start') || Date.now().toString());
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    const pageViews = parseInt(sessionStorage.getItem('arcade_page_views') || '1');
    
    return {
      sessionDuration: durationSeconds,
      pageViews
    };
  };

  return (
    <TrackingContext.Provider value={{ getTrackingData }}>
      {children}
    </TrackingContext.Provider>
  );
}
