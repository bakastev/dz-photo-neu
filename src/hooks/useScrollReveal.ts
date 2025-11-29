'use client';

import { useEffect, RefObject } from 'react';

// Hook that accepts optional ref and dependencies for re-initialization
export function useScrollReveal(ref?: RefObject<HTMLElement>, deps: any[] = []) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Get elements from ref or document
    const getRevealElements = () => {
      if (ref?.current) {
        return ref.current.querySelectorAll('.reveal');
      }
      return document.querySelectorAll('.reveal');
    };

    const revealOnScroll = () => {
      try {
        const revealElements = getRevealElements();
        
        revealElements.forEach((element) => {
          // Safety check: ensure element is a valid Node
          if (!element || !(element instanceof Node)) {
            return;
          }

          try {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            // Element ist sichtbar wenn der obere Teil im Viewport ist
            // oder wenn es bereits teilweise sichtbar ist
            if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
              element.classList.add('active');
            }
          } catch (error) {
            // Silently ignore errors for individual elements
            console.warn('Scroll reveal error for element:', error);
          }
        });
      } catch (error) {
        // Silently ignore errors
        console.warn('Scroll reveal error:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      revealOnScroll();
    }, 100);

    // Bei Scroll
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    
    // Bei Resize (falls sich Layout ändert)
    window.addEventListener('resize', revealOnScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('resize', revealOnScroll);
    };
  }, [ref, ...deps]);
}




