'use client';

import { Heart, MapPin, Camera, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/components/shared/TrackingProvider';

// Icon mapping
const iconMap: Record<string, any> = {
  Heart, MapPin, Camera
};

interface ServicesSectionProps {
  data: {
    sectionTitle?: string;
    sectionTitleHighlight?: string;
    description?: string;
    services?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      features: string[];
      gradient?: string;
      borderColor?: string;
      iconBg?: string;
      link?: string;
    }>;
    ctaBox?: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const { trackEvent } = useTracking();

  // Defaults from database
  const sectionTitle = data.sectionTitle || 'Meine';
  const sectionTitleHighlight = data.sectionTitleHighlight || 'Services';
  const description = data.description || 'Von der emotionalen Hochzeitsreportage bis zur professionellen Fotobox - ich biete Ihnen das komplette Paket für Ihren besonderen Tag.';
  const ctaBox = data.ctaBox || {
    title: 'Nicht sicher, welcher Service der richtige ist?',
    description: 'Lassen Sie uns bei einem unverbindlichen Gespräch herausfinden, wie ich Ihren besonderen Tag perfekt festhalten kann.',
    buttonText: 'Kostenlose Beratung'
  };

  // Default services if not provided
  const defaultServices = [
    {
      id: 'wedding',
      title: 'Hochzeitsfotografie',
      description: 'Emotionale Momente Ihres besonderen Tages',
      icon: 'Heart',
      features: ['Ganztägige Begleitung', 'Professionelle Nachbearbeitung', 'Online-Galerie'],
      gradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30',
      iconBg: 'bg-red-500/10',
      link: '/hochzeit'
    },
    {
      id: 'locations',
      title: 'Traumhafte Locations',
      description: 'Die schönsten Hochzeitslocations in Oberösterreich',
      icon: 'MapPin',
      features: ['Location-Scouting', 'Beste Fotospots', 'Regionale Expertise'],
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/10',
      link: '/locations'
    },
    {
      id: 'fotobox',
      title: 'Fotobox Services',
      description: 'Unvergessliche Momente mit unserer Deluxe-Fotobox',
      icon: 'Camera',
      features: ['Sofortausdrucke', 'Online-Galerie', 'Accessoires inklusive'],
      gradient: 'from-gold/20 to-gold-light/20',
      borderColor: 'border-gold/30',
      iconBg: 'bg-gold/10',
      link: '/fotobox'
    }
  ];

  const services = data.services && data.services.length > 0 ? data.services : defaultServices;

  const handleServiceClick = (serviceType: string, action: string) => {
    trackEvent('ServiceInteraction', { 
      section: 'services', 
      service_type: serviceType,
      action: action
    });

    if (action === 'learn_more') {
      const service = services.find(s => s.id === serviceType);
      if (service?.link) {
        window.location.href = service.link;
      } else {
        const portfolioSection = document.getElementById('portfolio');
        portfolioSection?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'contact') {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gold/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-blue-500/20 rounded-full blur-[80px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            {sectionTitle} <span className="text-gold">{sectionTitleHighlight}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Heart;
            
            return (
              <div
                key={service.id}
                className={`glass-card rounded-3xl p-8 hover:scale-105 transition-all duration-500 border ${service.borderColor || 'border-white/10'} group`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Service Icon */}
                <div className={`w-20 h-20 rounded-full ${service.iconBg || 'bg-gold/10'} flex items-center justify-center mb-6 mx-auto liquid-glass-icon group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-10 h-10 text-gold" />
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="gold"
                    className="w-full group"
                    onClick={() => handleServiceClick(service.id, 'learn_more')}
                  >
                    <span>Mehr erfahren</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button
                    variant="gold-outline"
                    className="w-full"
                    onClick={() => handleServiceClick(service.id, 'contact')}
                  >
                    Anfrage stellen
                  </Button>
                </div>

                {/* Decorative Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || 'from-gold/20 to-gold-light/20'} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="reveal glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              {ctaBox.title}
            </h3>
            <p className="text-gray-300 mb-6">
              {ctaBox.description}
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => handleServiceClick('consultation', 'contact')}
              className="group"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {ctaBox.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
