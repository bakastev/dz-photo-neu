'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ReactNode } from 'react';

interface ScrollRevealWrapperProps {
  children: ReactNode;
}

export default function ScrollRevealWrapper({ children }: ScrollRevealWrapperProps) {
  // Use hook without ref - will use document.querySelectorAll
  useScrollReveal(undefined, []);
  
  return <>{children}</>;
}




