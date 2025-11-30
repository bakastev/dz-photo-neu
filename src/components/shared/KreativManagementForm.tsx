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
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Mark as mounted to ensure element is in DOM
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run in browser and after mount
    if (typeof window === 'undefined' || !isMounted || !formElementRef.current) return;

    const formElement = formElementRef.current;

    // Function to check if form is initialized
    const isFormInitialized = () => {
      if (!formElement) return false;
      // Check if form has content (form, iframe, or any child elements added by the script)
      const hasContent = formElement.children.length > 0 || 
                       formElement.querySelector('form, iframe, [class*="form"], [id*="form"]');
      return !!hasContent;
    };

    // Function to try initializing the form
    const tryInitializeForm = () => {
      if (!formElement || isFormInitialized()) return true;

      console.log('Attempting to initialize kreativ.management form...');

      // Method 1: Check for global initialization function
      if ((window as any).kreativManagementFormWidget) {
        console.log('Found kreativManagementFormWidget, attempting manual init');
        try {
          if (typeof (window as any).kreativManagementFormWidget.init === 'function') {
            (window as any).kreativManagementFormWidget.init();
          }
        } catch (e) {
          console.warn('Manual init failed:', e);
        }
      }

      // Method 2: Dispatch DOMContentLoaded event (some scripts listen to this)
      window.dispatchEvent(new Event('DOMContentLoaded'));

      // Method 3: Try MutationObserver to detect when form is added
      // This is a fallback - the script should handle it automatically

      return isFormInitialized();
    };

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="kreativ.management"]');
    
    if (existingScript && scriptLoadedRef.current) {
      console.log('kreativ.management script already loaded, trying to initialize');
      // Script exists, try to initialize
      setTimeout(() => {
        if (!tryInitializeForm()) {
          // If not initialized, try again after delays
          setTimeout(() => tryInitializeForm(), 500);
          setTimeout(() => tryInitializeForm(), 1500);
        }
      }, 200);
      return;
    }

    // Load script dynamically if not already loaded
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://api.kreativ.management/Form/GetContactFormWidget';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('kreativ.management form script loaded');
        scriptLoadedRef.current = true;
        
        // Wait for script to process, then try to initialize
        setTimeout(() => {
          if (!tryInitializeForm()) {
            // Retry with increasing delays
            setTimeout(() => {
              if (!tryInitializeForm()) {
                setTimeout(() => tryInitializeForm(), 1000);
              }
            }, 500);
          }
        }, 300);
      };

      script.onerror = (error) => {
        console.error('Error loading kreativ.management form script:', error);
      };

      // Append script to document head
      document.head.appendChild(script);
    } else {
      // Script exists but might not be loaded yet
      scriptLoadedRef.current = true;
      setTimeout(() => {
        tryInitializeForm();
      }, 500);
    }

    // Set up MutationObserver to detect when form is initialized
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0 && isFormInitialized()) {
          console.log('Form initialized successfully!');
          observer.disconnect();
        }
      });
    });

    if (formElement) {
      observer.observe(formElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [isMounted, formId]);

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
