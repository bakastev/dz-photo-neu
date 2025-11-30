'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== 'undefined' && (window as any).kreativManagementFormLoaded) {
      setScriptLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Form Container */}
      <div className={className}>
        <div 
          className="js-hm-form" 
          id="kreativmanagement" 
          data-theme={theme} 
          data-form-id={formId}
        />
      </div>

      {/* External Script - loads after page is interactive */}
      <Script
        src="https://api.kreativ.management/Form/GetContactFormWidget"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('kreativ.management form script loaded');
          setScriptLoaded(true);
          if (typeof window !== 'undefined') {
            (window as any).kreativManagementFormLoaded = true;
          }
        }}
        onError={(e) => {
          console.error('Error loading kreativ.management form script:', e);
          setScriptError(true);
        }}
      />

      {/* Error State */}
      {scriptError && (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">
            Das Formular konnte nicht geladen werden. Bitte laden Sie die Seite neu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold hover:bg-gold-light text-dark-background px-6 py-3 rounded-full font-medium transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      )}
    </>
  );
}

