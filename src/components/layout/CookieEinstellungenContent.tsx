'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { saveConsentToSupabase } from '@/lib/consent-storage';

export default function CookieEinstellungenContent() {
  const router = useRouter();
  const [consent, setConsent] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current consent from cookie
    const consentCookie = Cookies.get('dzphoto-cookie-consent');
    if (consentCookie) {
      try {
        const parsed = JSON.parse(consentCookie);
        setConsent({
          necessary: true,
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
        });
      } catch (e) {
        // If cookie exists but is not JSON, assume all accepted
        setConsent({
          necessary: true,
          analytics: true,
          marketing: true,
        });
      }
    }
  }, []);

  const handleSave = async () => {
    // DSGVO 2025: Document consent with timestamp for 5-year retention
    const consentData = {
      necessary: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
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
    await saveConsentToSupabase('custom_preferences', consentData);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/');
    }, 2000);
  };

  const handleAcceptAll = async () => {
    setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    // Speichere sofort (ohne auf "Speichern" zu warten)
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

    Cookies.set('CookieConsent', JSON.stringify(consentData), {
      expires: 365,
      sameSite: 'lax',
    });

    // Speichere in Supabase (primär) und localStorage (Backup)
    await saveConsentToSupabase('accept_all', consentData);
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/');
    }, 2000);
  };

  const handleRejectAll = async () => {
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    // Speichere sofort (ohne auf "Speichern" zu warten)
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
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
              Cookie-Einstellungen
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Verwalten Sie Ihre Cookie-Präferenzen. Sie können Ihre Auswahl jederzeit ändern.
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-400">Ihre Cookie-Einstellungen wurden gespeichert.</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-[#C5A572] text-white font-semibold rounded-full hover:from-[#E0C898] hover:to-gold transition-all duration-300"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={handleRejectAll}
            className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-gray-300 font-semibold rounded-full hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            Nur notwendige
          </button>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-6">
          {/* Necessary Cookies */}
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Notwendige Cookies
                </h3>
                <p className="text-gray-400 text-sm">
                  Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/20">
                <Check className="w-6 h-6 text-gold" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                <strong>Verwendete Cookies:</strong> Session-Management, Sicherheit, Cookie-Consent-Präferenzen
              </p>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analyse-Cookies
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden.
                </p>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                  <span className="text-sm text-gray-300">
                    {consent.analytics ? 'Aktiviert' : 'Deaktiviert'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                <strong>Hinweis:</strong> Wir verwenden derzeit keine Analyse-Cookies. Diese Einstellung ist für zukünftige Verwendung vorbereitet.
              </p>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Marketing-Cookies
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Diese Cookies werden verwendet, um Besuchern auf Websites relevante Anzeigen und Marketingkampagnen bereitzustellen.
                </p>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                  <span className="text-sm text-gray-300">
                    {consent.marketing ? 'Aktiviert' : 'Deaktiviert'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                <strong>Hinweis:</strong> Wir verwenden derzeit keine Marketing-Cookies. Diese Einstellung ist für zukünftige Verwendung vorbereitet.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-gold to-[#C5A572] text-white font-semibold rounded-full hover:from-[#E0C898] hover:to-gold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Einstellungen speichern
          </button>
          <Link
            href="/datenschutz"
            className="flex-1 px-8 py-4 bg-transparent border border-white/20 text-gray-300 font-semibold rounded-full hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-center"
          >
            Zur Datenschutzerklärung
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gold/10 border border-gold/20 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-gold">Wichtig:</strong> Ihre Cookie-Präferenzen werden lokal in Ihrem Browser gespeichert und bleiben 365 Tage gültig. 
            Sie können diese Einstellungen jederzeit auf dieser Seite ändern. Weitere Informationen finden Sie in unserer{' '}
            <Link href="/datenschutz" className="text-gold hover:text-gold-light underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

