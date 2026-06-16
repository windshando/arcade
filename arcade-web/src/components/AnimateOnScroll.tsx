'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function AnimateOnScroll({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  let baseClass = 'transition-all ease-out will-change-[opacity,transform]';
  let hiddenClass = 'opacity-0 ';
  let visibleClass = 'opacity-100 ';

  switch (animation) {
    case 'slide-up':
      hiddenClass += 'translate-y-8';
      visibleClass += 'translate-y-0';
      break;
    case 'scale-in':
      hiddenClass += 'scale-95';
      visibleClass += 'scale-100';
      break;
    case 'fade-in':
    default:
      break;
  }

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isVisible ? visibleClass : hiddenClass} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
