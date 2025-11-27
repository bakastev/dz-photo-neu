'use client';

import { useState, useEffect } from 'react';
import { getTracking } from '@/lib/tracking';
import type { ConsentData } from '@/lib/tracking';

interface ConsentBannerProps {
  onConsentChange?: (consent: ConsentData) => void;
}

export default function ConsentBanner({ onConsentChange }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<Partial<ConsentData>>({
    analytics: false,
    marketing: false,
    functional: true // Always true for essential functionality
  });

  useEffect(() => {
    // Check if consent has already been given
    const tracking = getTracking();
    const existingConsent = tracking?.getConsent();
    
    if (!existingConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: ConsentData = {
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now()
    };
    
    saveConsent(fullConsent);
  };

  const handleRejectAll = () => {
    const minimalConsent: ConsentData = {
      analytics: false,
      marketing: false,
      functional: true,
      timestamp: Date.now()
    };
    
    saveConsent(minimalConsent);
  };

  const handleSavePreferences = () => {
    const finalConsent: ConsentData = {
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      functional: true, // Always required
      timestamp: Date.now()
    };
    
    saveConsent(finalConsent);
  };

  const saveConsent = (consentData: ConsentData) => {
    const tracking = getTracking();
    if (tracking) {
      tracking.setConsent(consentData);
    }
    
    setShowBanner(false);
    setShowDetails(false);
    
    if (onConsentChange) {
      onConsentChange(consentData);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        {!showDetails ? (
          // Simple Banner
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cookies & Datenschutz
              </h3>
              <p className="text-sm text-gray-600">
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                Einige sind notwendig für die Funktionalität, andere helfen uns, die Website zu verbessern und Ihnen relevante Inhalte zu zeigen.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Einstellungen
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Nur notwendige
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        ) : (
          // Detailed Settings
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Cookie-Einstellungen
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Functional Cookies - Always Required */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Notwendige Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Analyse-Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
                    indem sie Informationen anonym sammeln und melden.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={consent.analytics || false}
                    onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Marketing-Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Diese Cookies werden verwendet, um Ihnen relevante Werbung und Inhalte zu zeigen. 
                    Sie helfen uns auch, die Effektivität unserer Marketingkampagnen zu messen.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={consent.marketing || false}
                    onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Nur notwendige
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Einstellungen speichern
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
              <p>
                Weitere Informationen finden Sie in unserer{' '}
                <a href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutzerklärung
                </a>
                . Sie können Ihre Einstellungen jederzeit ändern.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
