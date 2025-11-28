// Client-Side Tracking Library für dz-photo.at
// Server-Side Tracking mit Meta Conversion API & Google Analytics 4
// GDPR-konform mit Consent Management

interface TrackingConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  metaPixelId: string;
  googleAnalyticsId?: string;
  debugMode?: boolean;
  consentRequired?: boolean;
}

interface TrackingEvent {
  event_type: 'page_view' | 'contact_form_submit' | 'email_click' | 'phone_click' | 
             'portfolio_view' | 'location_view' | 'blog_read' | 'service_inquiry' |
             'image_gallery_view' | 'download' | 'social_share' | 'external_link_click';
  event_name: string;
  page_url?: string;
  page_title?: string;
  content_type?: string;
  content_id?: string;
  event_parameters?: Record<string, any>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface ConsentData {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
}

class DZPhotoTracking {
  private config: TrackingConfig;
  private sessionId: string;
  private clientId: string;
  private consent: ConsentData | null = null;
  private fbp: string | null = null; // Facebook Browser ID
  private fbc: string | null = null; // Facebook Click ID
  private initialized = false;

  constructor(config: TrackingConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.clientId = this.generateClientId();
    
    // Initialize tracking
    this.init();
  }

  private async init() {
    try {
      // Load consent from localStorage
      this.loadConsent();
      
      // Extract UTM parameters
      this.extractUTMParameters();
      
      // Extract Facebook parameters
      this.extractFacebookParameters();
      
      // Initialize Meta Pixel (client-side for immediate tracking)
      if (this.consent?.marketing) {
        this.initMetaPixel();
      }
      
      // Initialize Google Analytics
      if (this.consent?.analytics && this.config.googleAnalyticsId) {
        this.initGoogleAnalytics();
      }
      
      this.initialized = true;
      
      // Track initial page view
      await this.trackPageView();
      
      if (this.config.debugMode) {
        console.log('DZ-Photo Tracking initialized', {
          sessionId: this.sessionId,
          clientId: this.clientId,
          consent: this.consent,
          fbp: this.fbp,
          fbc: this.fbc
        });
      }
    } catch (error) {
      console.error('Error initializing DZ-Photo Tracking:', error);
    }
  }

  // Consent Management
  public setConsent(consent: Partial<ConsentData>) {
    this.consent = {
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      functional: consent.functional || false,
      timestamp: Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('dzphoto_consent', JSON.stringify(this.consent));
    
    // Initialize tracking services based on consent
    if (this.consent.marketing && !this.isMetaPixelLoaded()) {
      this.initMetaPixel();
    }
    
    if (this.consent.analytics && this.config.googleAnalyticsId && !this.isGoogleAnalyticsLoaded()) {
      this.initGoogleAnalytics();
    }
    
    if (this.config.debugMode) {
      console.log('Consent updated:', this.consent);
    }
  }

  public getConsent(): ConsentData | null {
    return this.consent;
  }

  private loadConsent() {
    try {
      const stored = localStorage.getItem('dzphoto_consent');
      if (stored) {
        this.consent = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading consent:', error);
    }
  }

  // Core Tracking Methods
  public async track(event: TrackingEvent): Promise<void> {
    if (!this.initialized) {
      console.warn('Tracking not initialized yet');
      return;
    }

    // Check consent requirements
    if (this.config.consentRequired && !this.hasRequiredConsent(event.event_type)) {
      if (this.config.debugMode) {
        console.log('Event blocked due to missing consent:', event.event_type);
      }
      return;
    }

    try {
      // Prepare tracking data
      const trackingData = {
        ...event,
        session_id: this.sessionId,
        page_url: event.page_url || window.location.href,
        page_title: event.page_title || document.title,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        client_id: this.clientId,
        facebook_browser_id: this.fbp,
        facebook_click_id: this.fbc,
        consent_given: this.consent !== null,
        consent_categories: this.getConsentCategories(),
        ...this.getUTMParameters()
      };

      // Send to server-side tracking
      await this.sendToServer(trackingData);

      // Client-side tracking (for immediate feedback)
      if (this.consent?.marketing) {
        this.sendToMetaPixel(event);
      }

      if (this.consent?.analytics) {
        this.sendToGoogleAnalytics(event);
      }

      if (this.config.debugMode) {
        console.log('Event tracked:', event.event_type, trackingData);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Convenience Methods
  public async trackPageView(contentType?: string, contentId?: string): Promise<void> {
    await this.track({
      event_type: 'page_view',
      event_name: 'PageView',
      content_type: contentType,
      content_id: contentId,
      event_parameters: {
        page_category: this.getPageCategory(),
        scroll_depth: 0
      }
    });
  }

  public async trackPortfolioView(portfolioId: string, portfolioType: 'wedding' | 'location'): Promise<void> {
    await this.track({
      event_type: 'portfolio_view',
      event_name: 'ViewContent',
      content_type: portfolioType,
      content_id: portfolioId,
      event_parameters: {
        content_category: portfolioType,
        value: this.getEstimatedValue(portfolioType),
        currency: 'EUR'
      }
    });
  }

  public async trackContactFormSubmit(formType: string = 'contact'): Promise<void> {
    await this.track({
      event_type: 'contact_form_submit',
      event_name: 'Lead',
      content_type: 'form',
      event_parameters: {
        form_type: formType,
        lead_value: 500, // Estimated lead value
        currency: 'EUR'
      }
    });
  }

  public async trackEmailClick(email: string): Promise<void> {
    await this.track({
      event_type: 'email_click',
      event_name: 'Contact',
      event_parameters: {
        contact_method: 'email',
        contact_value: email
      }
    });
  }

  public async trackPhoneClick(phone: string): Promise<void> {
    await this.track({
      event_type: 'phone_click',
      event_name: 'Contact',
      event_parameters: {
        contact_method: 'phone',
        contact_value: phone
      }
    });
  }

  public async trackServiceInquiry(serviceType: string): Promise<void> {
    await this.track({
      event_type: 'service_inquiry',
      event_name: 'Lead',
      content_type: 'service',
      event_parameters: {
        service_type: serviceType,
        inquiry_value: this.getEstimatedValue(serviceType),
        currency: 'EUR'
      }
    });
  }

  public async trackSocialShare(platform: string, contentType?: string): Promise<void> {
    await this.track({
      event_type: 'social_share',
      event_name: 'Share',
      event_parameters: {
        method: platform,
        content_type: contentType || 'page',
        item_id: contentType || window.location.pathname
      }
    });
  }

  // Private Helper Methods
  private async sendToServer(data: any): Promise<void> {
    try {
      const response = await fetch(`${this.config.supabaseUrl}/functions/v1/track-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
          'apikey': this.config.supabaseAnonKey
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Server tracking failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Server tracking error:', error);
    }
  }

  private sendToMetaPixel(event: TrackingEvent): void {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const fbq = (window as any).fbq;
      
      // Map event types to Facebook events
      const fbEventName = this.mapToFacebookEvent(event.event_name);
      const eventData = {
        ...event.event_parameters,
        content_type: event.content_type,
        content_ids: event.content_id ? [event.content_id] : undefined
      };

      fbq('track', fbEventName, eventData, {
        eventID: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
  }

  private sendToGoogleAnalytics(event: TrackingEvent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;
      
      gtag('event', event.event_name, {
        event_category: event.content_type || 'general',
        event_label: event.content_id,
        value: event.event_parameters?.value,
        currency: event.event_parameters?.currency,
        custom_parameter_1: event.content_type,
        custom_parameter_2: event.content_id
      });
    }
  }

  private initMetaPixel(): void {
    if (typeof window === 'undefined' || this.isMetaPixelLoaded()) return;

    // Load Meta Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.config.metaPixelId}');
    `;
    document.head.appendChild(script);

    // Add noscript pixel
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${this.config.metaPixelId}&ev=PageView&noscript=1" />`;
    document.head.appendChild(noscript);
  }

  private initGoogleAnalytics(): void {
    if (typeof window === 'undefined' || !this.config.googleAnalyticsId || this.isGoogleAnalyticsLoaded()) return;

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize gtag
    const gtagScript = document.createElement('script');
    gtagScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.config.googleAnalyticsId}', {
        client_id: '${this.clientId}',
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(gtagScript);
  }

  private isMetaPixelLoaded(): boolean {
    return typeof window !== 'undefined' && !!(window as any).fbq;
  }

  private isGoogleAnalyticsLoaded(): boolean {
    return typeof window !== 'undefined' && !!(window as any).gtag;
  }

  private generateSessionId(): string {
    // Try to get existing session ID from sessionStorage
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('dzphoto_session_id');
      if (existing) return existing;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dzphoto_session_id', sessionId);
    }
    
    return sessionId;
  }

  private generateClientId(): string {
    // Try to get existing client ID from localStorage
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('dzphoto_client_id');
      if (existing) return existing;
    }

    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('dzphoto_client_id', clientId);
    }
    
    return clientId;
  }

  private extractUTMParameters(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };

    // Store in sessionStorage for the session
    sessionStorage.setItem('dzphoto_utm_params', JSON.stringify(utmParams));
  }

  private extractFacebookParameters(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    
    // Facebook Click ID (fbc)
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      this.fbc = `fb.1.${Date.now()}.${fbclid}`;
      localStorage.setItem('dzphoto_fbc', this.fbc);
    } else {
      this.fbc = localStorage.getItem('dzphoto_fbc');
    }

    // Facebook Browser ID (fbp) - generated client-side
    this.fbp = localStorage.getItem('dzphoto_fbp');
    if (!this.fbp) {
      this.fbp = `fb.1.${Date.now()}.${Math.random().toString().substr(2, 9)}`;
      localStorage.setItem('dzphoto_fbp', this.fbp);
    }
  }

  private getUTMParameters(): any {
    if (typeof window === 'undefined') return {};

    try {
      const stored = sessionStorage.getItem('dzphoto_utm_params');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private hasRequiredConsent(eventType: string): boolean {
    if (!this.consent) return false;

    // Marketing events require marketing consent
    const marketingEvents = ['contact_form_submit', 'service_inquiry', 'email_click', 'phone_click'];
    if (marketingEvents.includes(eventType)) {
      return this.consent.marketing;
    }

    // All events require at least analytics consent
    return this.consent.analytics;
  }

  private getConsentCategories(): string[] {
    if (!this.consent) return [];

    const categories = [];
    if (this.consent.analytics) categories.push('analytics');
    if (this.consent.marketing) categories.push('marketing');
    if (this.consent.functional) categories.push('functional');
    
    return categories;
  }

  private getPageCategory(): string {
    if (typeof window === 'undefined') return 'unknown';

    const path = window.location.pathname;
    
    if (path === '/') return 'homepage';
    if (path.startsWith('/hochzeit/')) return 'wedding';
    if (path.startsWith('/locations/')) return 'location';
    if (path.startsWith('/tipp/')) return 'blog';
    if (path.startsWith('/fotobox')) return 'fotobox';
    if (path.includes('kontakt')) return 'contact';
    
    return 'page';
  }

  private getEstimatedValue(type: string): number {
    const values: Record<string, number> = {
      wedding: 2500,
      location: 1500,
      fotobox: 800,
      blog: 100,
      contact: 500,
      service: 1000
    };
    
    return values[type] || 500;
  }

  private mapToFacebookEvent(eventName: string): string {
    const mapping: Record<string, string> = {
      'PageView': 'PageView',
      'ViewContent': 'ViewContent',
      'Lead': 'Lead',
      'Contact': 'Contact',
      'Share': 'Share'
    };
    
    return mapping[eventName] || 'CustomEvent';
  }
}

// Export singleton instance
let trackingInstance: DZPhotoTracking | null = null;

export function initTracking(config: TrackingConfig): DZPhotoTracking {
  if (!trackingInstance) {
    trackingInstance = new DZPhotoTracking(config);
  }
  return trackingInstance;
}

export function getTracking(): DZPhotoTracking | null {
  return trackingInstance;
}

export { DZPhotoTracking };
export type { TrackingConfig, TrackingEvent, ConsentData };



