'use client';

import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Element ist sichtbar wenn der obere Teil im Viewport ist
        // oder wenn es bereits teilweise sichtbar ist
        if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
          element.classList.add('active');
        }
      });
    };

    // Initial check beim Laden
    revealOnScroll();

    // Bei Scroll
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    
    // Bei Resize (falls sich Layout ändert)
    window.addEventListener('resize', revealOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('resize', revealOnScroll);
    };
  }, []);
}


