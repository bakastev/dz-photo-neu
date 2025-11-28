/**
 * Cookie Blocker Script Component
 * Wird im <head> geladen, um Prior Consent zu gewährleisten
 * Blockiert alle nicht-notwendigen Cookies und Scripts vor Einwilligung
 */

import Script from 'next/script';

export default function CookieBlockerScript() {
  const scriptContent = `
    (function() {
      'use strict';
      
      // Prior Consent Implementation für DSGVO 2025
      // Blockiert alle nicht-notwendigen Cookies bis Einwilligung erteilt wurde
      
      // Speichere den ursprünglichen Cookie-Descriptor BEVOR wir ihn überschreiben
      const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
      const originalGetter = originalDescriptor ? originalDescriptor.get : null;
      const originalSetter = originalDescriptor ? originalDescriptor.set : null;
      
      // Hilfsfunktion um Cookies zu lesen OHNE den Getter zu verwenden
      function getCookieValue(name) {
        if (!originalGetter) return null;
        try {
          const allCookies = originalGetter.call(document);
          const cookie = allCookies.split('; ').find(row => row.startsWith(name + '='));
          return cookie ? cookie.split('=')[1] : null;
        } catch (e) {
          return null;
        }
      }
      
      function hasConsent(category) {
        if (category === 'necessary') return true;
        
        try {
          const consentValue = getCookieValue('dzphoto-cookie-consent');
          if (!consentValue) return false;
          
          const consent = JSON.parse(decodeURIComponent(consentValue));
          return consent[category] === true;
        } catch (e) {
          return false;
        }
      }
      
      // Blockiere Analytics-Scripts
      if (!hasConsent('analytics')) {
        window.ga = window.ga || function(){(window.ga.q=window.ga.q||[]).push(arguments)};
        window.ga.l = +new Date();
        window.gtag = window.gtag || function(){};
      }
      
      // Blockiere Marketing-Scripts
      if (!hasConsent('marketing')) {
        window.fbq = window.fbq || function(){};
        if (window._fbp) delete window._fbp;
        if (window._fbc) delete window._fbc;
      }
      
      // Cookie-Setter überwachen
      if (originalSetter && originalGetter) {
        Object.defineProperty(document, 'cookie', {
          set: function(value) {
            const cookieName = value.split('=')[0].trim();
            
            // Erlaube notwendige Cookies immer
            if (cookieName.includes('dzphoto-cookie-consent') || 
                cookieName.includes('CookieConsent') ||
                cookieName.includes('session') ||
                cookieName.includes('csrf')) {
              originalSetter.call(this, value);
              return;
            }
            
            // Blockiere Analytics-Cookies ohne Einwilligung
            if (cookieName.includes('_ga') || 
                cookieName.includes('_gid') ||
                cookieName.includes('analytics')) {
              if (!hasConsent('analytics')) {
                return; // Cookie wird nicht gesetzt
              }
            }
            
            // Blockiere Marketing-Cookies ohne Einwilligung
            if (cookieName.includes('_fbp') || 
                cookieName.includes('_fbc') ||
                cookieName.includes('marketing') ||
                cookieName.includes('advertising')) {
              if (!hasConsent('marketing')) {
                return; // Cookie wird nicht gesetzt
              }
            }
            
            // Erlaube Cookie
            originalSetter.call(this, value);
          },
          get: function() {
            // Verwende den ursprünglichen Getter direkt
            return originalGetter.call(this);
          },
          configurable: true,
        });
      }
    })();
  `;

  return (
    <Script
      id="cookie-blocker"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
}

