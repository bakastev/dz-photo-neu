'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { saveConsentToSupabase } from '@/lib/consent-storage';

export default function CookieConsentBanner() {
  useEffect(() => {
    // Add custom CSS for hover effects and equal button prominence (DSGVO 2025 requirement)
    const style = document.createElement('style');
    style.textContent = `
      #rcc-confirm-button {
        background: linear-gradient(to right, #D0B888, #C5A572) !important;
        transition: all 0.3s ease !important;
        flex: 1 !important;
        min-width: 140px !important;
      }
      #rcc-confirm-button:hover {
        background: linear-gradient(to right, #E0C898, #D0B888) !important;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(208, 184, 136, 0.4);
      }
      #rcc-decline-button {
        transition: all 0.3s ease !important;
        flex: 1 !important;
        min-width: 140px !important;
        font-weight: 600 !important;
        color: #E5E7EB !important;
      }
      #rcc-decline-button:hover {
        border-color: rgba(255, 255, 255, 0.4) !important;
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }
      /* Ensure equal prominence - no dark patterns */
      .rcc-buttons {
        display: flex !important;
        gap: 12px !important;
        flex-direction: row !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleAccept = async () => {
    // DSGVO 2025: Document consent with timestamp for 5-year retention
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
      version: '2025-01',
    };
    
    Cookies.set('dzphoto-cookie-consent', JSON.stringify(consentData), {
      expires: 365,
      sameSite: 'lax',
    });

    // Also set the react-cookie-consent cookie format
    Cookies.set('CookieConsent', JSON.stringify(consentData), {
      expires: 365,
      sameSite: 'lax',
    });

    // Speichere in Supabase (primär) und localStorage (Backup)
    await saveConsentToSupabase('accept_all', consentData);
  };

  const handleDecline = async () => {
    // DSGVO 2025: Document consent decline with timestamp
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
      version: '2025-01',
    };
    
    Cookies.set('dzphoto-cookie-consent', JSON.stringify(consentData), {
      expires: 365,
      sameSite: 'lax',
    });

    Cookies.set('CookieConsent', JSON.stringify(consentData), {
      expires: 365,
      sameSite: 'lax',
    });

    // Speichere in Supabase (primär) und localStorage (Backup)
    await saveConsentToSupabase('decline_all', consentData);
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Alle akzeptieren"
      declineButtonText="Nur notwendige"
      enableDeclineButton
      cookieName="dzphoto-cookie-consent"
      style={{
        background: '#141414',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: 'linear-gradient(to right, #D0B888, #C5A572)',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        flex: 1,
        minWidth: '140px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#E5E7EB',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        flex: 1,
        minWidth: '140px',
      }}
      contentStyle={{
        color: '#E5E7EB',
        fontSize: '14px',
        lineHeight: '1.6',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
      expires={365}
      onAccept={handleAccept}
      onDecline={handleDecline}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-300 mb-2">
            Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
            Einige Cookies sind für den Betrieb der Website notwendig, während andere uns helfen, 
            diese Website und die Nutzererfahrung zu verbessern.
          </p>
          <p className="text-sm text-gray-400">
            Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung aller Cookies zu.{' '}
            <Link 
              href="/cookie-einstellungen" 
              className="text-gold hover:text-gold-light underline transition-colors"
            >
              Cookie-Einstellungen anpassen
            </Link>
            {' '}oder lesen Sie unsere{' '}
            <Link 
              href="/datenschutz" 
              className="text-gold hover:text-gold-light underline transition-colors"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </div>
    </CookieConsent>
  );
}

