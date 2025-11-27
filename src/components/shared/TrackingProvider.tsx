'use client';

import { useEffect, createContext, useContext, ReactNode } from 'react';

interface TrackingContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (url?: string) => void;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}

interface TrackingProviderProps {
  children: ReactNode;
}

export default function TrackingProvider({ children }: TrackingProviderProps) {
  useEffect(() => {
    // Initialize Meta Pixel
    const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (metaPixelId && typeof window !== 'undefined') {
      // Meta Pixel Code
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );

      (window as any).fbq('init', metaPixelId);
      (window as any).fbq('track', 'PageView');
    }

    // Track initial page view
    trackPageView();
  }, []);

  const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    try {
      // Track with Meta Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', eventName, properties);
      }

      // Track with Supabase (server-side)
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          event_data: properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  const trackPageView = (url?: string) => {
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    trackEvent('PageView', { url: currentUrl });
  };

  const contextValue: TrackingContextType = {
    trackEvent,
    trackPageView,
  };

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
}
