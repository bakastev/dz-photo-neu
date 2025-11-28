'use client';

// Consent Data Types
export interface ConsentData {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
}

// Event Types
export interface TrackingEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

// Tracking Configuration
interface TrackingConfig {
  debug?: boolean;
  gaId?: string;
  fbPixelId?: string;
}

// Storage Keys
const CONSENT_KEY = 'dz-photo-consent';
const CLIENT_ID_KEY = 'dz-photo-client-id';

// Singleton Tracking Instance
let trackingInstance: Tracking | null = null;

export class Tracking {
  private consent: ConsentData | null = null;
  private clientId: string;
  private config: TrackingConfig;
  private eventQueue: TrackingEvent[] = [];

  constructor(config: TrackingConfig = {}) {
    this.config = config;
    this.clientId = this.getOrCreateClientId();
    this.loadConsent();
  }

  // Get or create a unique client ID
  private getOrCreateClientId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let clientId = localStorage.getItem(CLIENT_ID_KEY);
    if (!clientId) {
      clientId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
    return clientId;
  }

  // Load consent from localStorage
  private loadConsent(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        this.consent = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading consent:', e);
    }
  }

  // Get current consent
  getConsent(): ConsentData | null {
    return this.consent;
  }

  // Set consent and process queued events
  setConsent(consent: ConsentData): void {
    this.consent = consent;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    }

    // Process queued events if analytics consent given
    if (consent.analytics && this.eventQueue.length > 0) {
      this.eventQueue.forEach(event => this.sendEvent(event));
      this.eventQueue = [];
    }

    // Initialize third-party scripts based on consent
    this.initializeScripts();
    
    if (this.config.debug) {
      console.log('[Tracking] Consent updated:', consent);
    }
  }

  // Initialize third-party tracking scripts
  private initializeScripts(): void {
    if (typeof window === 'undefined' || !this.consent) return;

    // Google Analytics
    if (this.consent.analytics && this.config.gaId) {
      this.initGA();
    }

    // Facebook Pixel
    if (this.consent.marketing && this.config.fbPixelId) {
      this.initFBPixel();
    }
  }

  // Initialize Google Analytics
  private initGA(): void {
    if (!this.config.gaId) return;
    
    // Check if already loaded
    if ((window as any).gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', this.config.gaId, {
      anonymize_ip: true,
      client_id: this.clientId,
    });

    if (this.config.debug) {
      console.log('[Tracking] GA initialized');
    }
  }

  // Initialize Facebook Pixel
  private initFBPixel(): void {
    if (!this.config.fbPixelId) return;
    
    // Check if already loaded
    if ((window as any).fbq) return;

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
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    (window as any).fbq('init', this.config.fbPixelId);
    (window as any).fbq('track', 'PageView');

    if (this.config.debug) {
      console.log('[Tracking] FB Pixel initialized');
    }
  }

  // Track an event
  track(name: string, properties?: Record<string, unknown>): void {
    const event: TrackingEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    // If no consent yet, queue the event
    if (!this.consent?.analytics) {
      this.eventQueue.push(event);
      if (this.config.debug) {
        console.log('[Tracking] Event queued (no consent):', event);
      }
      return;
    }

    this.sendEvent(event);
  }

  // Send event to tracking services
  private sendEvent(event: TrackingEvent): void {
    if (this.config.debug) {
      console.log('[Tracking] Event:', event);
    }

    // Send to our backend
    this.sendToBackend(event);

    // Send to Google Analytics
    if ((window as any).gtag && this.config.gaId) {
      (window as any).gtag('event', event.name, event.properties);
    }

    // Send to Facebook Pixel
    if ((window as any).fbq && this.config.fbPixelId && this.consent?.marketing) {
      (window as any).fbq('trackCustom', event.name, event.properties);
    }
  }

  // Send event to our backend API
  private async sendToBackend(event: TrackingEvent): Promise<void> {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          clientId: this.clientId,
          consent: this.consent,
          url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });
    } catch (e) {
      if (this.config.debug) {
        console.error('[Tracking] Backend error:', e);
      }
    }
  }

  // Track page view
  trackPageView(path?: string): void {
    this.track('PageView', {
      path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
    });
  }

  // Track form submission
  trackFormSubmit(formName: string, data?: Record<string, unknown>): void {
    this.track('FormSubmit', {
      formName,
      ...data,
    });
  }

  // Track CTA click
  trackCTAClick(ctaName: string, location?: string): void {
    this.track('CTAClick', {
      ctaName,
      location,
    });
  }

  // Track portfolio item view
  trackPortfolioView(type: string, slug: string, title: string): void {
    this.track('PortfolioView', {
      type,
      slug,
      title,
    });
  }

  // Track image gallery interaction
  trackGalleryInteraction(action: string, imageIndex?: number): void {
    this.track('GalleryInteraction', {
      action,
      imageIndex,
    });
  }
}

// Get or create tracking instance
export function getTracking(config?: TrackingConfig): Tracking | null {
  if (typeof window === 'undefined') return null;
  
  if (!trackingInstance) {
    trackingInstance = new Tracking(config || {
      debug: process.env.NODE_ENV === 'development',
      gaId: process.env.NEXT_PUBLIC_GA_ID,
      fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    });
  }
  
  return trackingInstance;
}

// Initialize tracking on import
export function initTracking(config?: TrackingConfig): Tracking | null {
  return getTracking(config);
}




