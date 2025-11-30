'use client';

import { useEffect, useRef, useState } from 'react';

interface KreativManagementFormProps {
  formId?: string;
  theme?: 'default' | 'dark' | 'light';
  className?: string;
}

export default function KreativManagementForm({
  formId = '472b1e77-ff01-486e-91c4-02ca208351ec',
  theme = 'default',
  className = '',
}: KreativManagementFormProps) {
  const formElementRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to ensure element is in DOM
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run in browser and after mount
    if (typeof window === 'undefined' || !isMounted || !formElementRef.current) return;

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="kreativ.management"]');
    if (existingScript) {
      console.log('kreativ.management script already loaded');
      // If script is already loaded, it should have already initialized forms
      // But we can try to trigger re-initialization
      setTimeout(() => {
        // Dispatch a custom event to trigger form initialization
        window.dispatchEvent(new Event('DOMContentLoaded'));
      }, 100);
      return;
    }

    // Wait a bit to ensure DOM is ready
    const timer = setTimeout(() => {
      // Load script dynamically
      const script = document.createElement('script');
      script.src = 'https://api.kreativ.management/Form/GetContactFormWidget';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('kreativ.management form script loaded');
        // Script should automatically find and initialize .js-hm-form elements
        // Give it a moment to process
        setTimeout(() => {
          const formElement = formElementRef.current;
          if (formElement && !formElement.querySelector('form, iframe')) {
            console.warn('Form element found but not initialized. Checking for manual init...');
            // Try to trigger initialization manually if needed
            if ((window as any).kreativManagementFormWidget) {
              console.log('Found kreativManagementFormWidget, attempting manual init');
            }
          }
        }, 500);
      };

      script.onerror = (error) => {
        console.error('Error loading kreativ.management form script:', error);
      };

      // Append script to document head
      document.head.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]);

  return (
    <div className={className}>
      <div 
        ref={formElementRef}
        className="js-hm-form" 
        id="kreativmanagement" 
        data-theme={theme} 
        data-form-id={formId}
      />
    </div>
  );
}

