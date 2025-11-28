'use client';

import Script from 'next/script';

interface ExternalContactFormProps {
  formId?: string;
  theme?: 'default' | 'dark' | 'light';
  className?: string;
}

export default function ExternalContactForm({
  formId = '1b6b18ec-9614-44a4-9f7f-9700cf4a57e8',
  theme = 'default',
  className = '',
}: ExternalContactFormProps) {
  return (
    <section className={`py-16 bg-gradient-to-b from-dark-background to-black ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-sm font-medium rounded-full mb-4">
            Schnellanfrage
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Jetzt unverbindlich anfragen
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nutzen Sie das Formular für eine schnelle und unkomplizierte Anfrage. 
            Ich melde mich innerhalb von 24 Stunden bei Ihnen.
          </p>
        </div>

        {/* External Form Container */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
          >
            {/* Form Widget */}
            <div 
              className="js-hm-form" 
              data-theme={theme} 
              data-form-id={formId}
            />
          </div>
        </div>
      </div>

      {/* External Script - loads after page is interactive */}
      <Script
        src="https://app.kreativ.management:443/ContactForm/GetContactFormWidget"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('kreativ.management form script loaded');
        }}
        onError={(e) => {
          console.error('Error loading kreativ.management form script:', e);
        }}
      />
    </section>
  );
}

