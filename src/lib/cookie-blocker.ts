/**
 * Cookie Blocker für DSGVO 2025 Prior Consent Anforderungen
 * Blockiert alle nicht-notwendigen Cookies und Scripts bis Einwilligung erteilt wurde
 */

// Extend Window interface for analytics tools
declare global {
  interface Window {
    ga?: ((...args: unknown[]) => void) & { q?: unknown[]; l?: number };
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _fbp?: string;
    _fbc?: string;
  }
}

export interface ConsentData {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version?: string;
}

/**
 * Prüft ob Einwilligung für eine Cookie-Kategorie erteilt wurde
 */
export function hasConsent(category: 'necessary' | 'analytics' | 'marketing'): boolean {
  if (typeof window === 'undefined') return false;
  
  if (category === 'necessary') return true; // Notwendige Cookies sind immer erlaubt
  
  try {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('dzphoto-cookie-consent='));
    
    if (!consentCookie) return false;
    
    const consentValue = consentCookie.split('=')[1];
    const consent: ConsentData = JSON.parse(decodeURIComponent(consentValue));
    
    return consent[category] === true;
  } catch (e) {
    return false;
  }
}

/**
 * Prüft ob überhaupt eine Einwilligung erteilt wurde
 */
export function hasAnyConsent(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('dzphoto-cookie-consent='));
    
    return consentCookie !== undefined;
  } catch (e) {
    return false;
  }
}

/**
 * Blockiert Scripts basierend auf Cookie-Einwilligung
 * Sollte in einem Script-Tag im <head> eingebunden werden, bevor andere Scripts geladen werden
 */
export function blockNonEssentialScripts() {
  if (typeof window === 'undefined') return;
  
  // Blockiere Analytics-Scripts wenn keine Einwilligung
  if (!hasConsent('analytics')) {
    // Blockiere Google Analytics - stub function that does nothing
    if (!window.ga) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gaStub: any = function(..._args: unknown[]) {
        gaStub.q = gaStub.q || [];
        gaStub.q.push(_args);
      };
      gaStub.l = +new Date();
      gaStub.q = [];
      window.ga = gaStub;
    }
    
    // Blockiere andere Analytics-Tools
    if (window.gtag) {
      window.gtag = function() {};
    }
  }
  
  // Blockiere Marketing-Scripts wenn keine Einwilligung
  if (!hasConsent('marketing')) {
    // Blockiere Facebook Pixel
    if (window.fbq) {
      window.fbq = function() {};
    }
    
    // Blockiere andere Marketing-Tools
    if (window._fbp) {
      delete window._fbp;
    }
    if (window._fbc) {
      delete window._fbc;
    }
  }
}

/**
 * Initialisiert den Cookie-Blocker
 * Sollte so früh wie möglich aufgerufen werden
 */
export function initCookieBlocker() {
  if (typeof window === 'undefined') return;
  
  // Blockiere Scripts sofort
  blockNonEssentialScripts();
  
  // Überwache Cookie-Änderungen und blockiere entsprechend
  const originalCookieSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')?.set;
  
  if (originalCookieSetter) {
    Object.defineProperty(document, 'cookie', {
      set: function(value: string) {
        const cookieName = value.split('=')[0].trim();
        
        // Erlaube notwendige Cookies immer
        if (cookieName.includes('dzphoto-cookie-consent') || 
            cookieName.includes('CookieConsent') ||
            cookieName.includes('session') ||
            cookieName.includes('csrf')) {
          originalCookieSetter.call(this, value);
          return;
        }
        
        // Blockiere Analytics-Cookies ohne Einwilligung
        if (cookieName.includes('_ga') || 
            cookieName.includes('_gid') ||
            cookieName.includes('analytics')) {
          if (!hasConsent('analytics')) {
            console.warn('[Cookie Blocker] Analytics cookie blocked:', cookieName);
            return;
          }
        }
        
        // Blockiere Marketing-Cookies ohne Einwilligung
        if (cookieName.includes('_fbp') || 
            cookieName.includes('_fbc') ||
            cookieName.includes('marketing') ||
            cookieName.includes('advertising')) {
          if (!hasConsent('marketing')) {
            console.warn('[Cookie Blocker] Marketing cookie blocked:', cookieName);
            return;
          }
        }
        
        // Erlaube Cookie
        originalCookieSetter.call(this, value);
      },
      get: function() {
        return document.cookie;
      },
      configurable: true,
    });
  }
}

