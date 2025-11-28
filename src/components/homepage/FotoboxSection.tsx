'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Star, CheckCircle, ArrowRight, Play, Sparkles, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useTracking } from '@/components/shared/TrackingProvider';
import { getImageUrl, defaultBlurDataURL, formatPrice } from '@/lib/utils';
import type { FotoboxService } from '@/lib/supabase';

const FOTOBOX_VIDEO_URL = '/videos/fotobox-video.mp4';

interface FotoboxSectionProps {
  data: FotoboxService[];
}

export default function FotoboxSection({ data }: FotoboxSectionProps) {
  console.log('📦 FotoboxSection data:', {
    services: data?.length || 0,
    servicesData: data
  });
  
  console.log('🔍 FotoboxSection detailed check:');
  console.log('  data:', data);
  console.log('  Array.isArray(data):', Array.isArray(data));
  console.log('  data.length:', data?.length);
  console.log('  typeof data:', typeof data);

  const [activeService, setActiveService] = useState(0);
  // const { trackEvent } = useTracking();

  const handleServiceChange = (index: number) => {
    setActiveService(index);
    // trackEvent('FotoboxServiceChange', { 
    //   section: 'fotobox', 
    //   service_index: index,
    //   service_name: data[index]?.name 
    // });
  };

  const handleCTAClick = (action: string, serviceId?: string) => {
    // trackEvent('FotoboxCTA', { 
    //   section: 'fotobox', 
    //   action: action,
    //   service_id: serviceId 
    // });

    if (action === 'view_all') {
      window.location.href = '/fotobox';
    } else if (action === 'contact') {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback data if no services are provided (sollte nicht mehr benötigt werden, da echte Daten in DB)
  const fallbackServices: FotoboxService[] = [];

  const services = data.length > 0 ? data : fallbackServices;
  const featuredService = services[activeService] || services[0];

  return (
    <section id="fotobox" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/20 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-purple-500/20 rounded-full blur-[100px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center space-x-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-gold font-medium">Neu im Angebot</span>
          </div>
          
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Fotobox mieten – wenige Klicks zum <span className="text-gold">must-have</span> für jede Party!
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mietet hier eure Fotobox für die nächste Feier. Schnell, einfach und bequem. Ihr wählt ein Modell aus und wir kümmern uns um den Rest. Inklusive Lieferung, Aufbau, Einstellung, Abbau und Abholung.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="reveal max-w-7xl mx-auto">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Featured Service */}
            <div className="">
              <div className="reveal glass-card rounded-3xl p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mr-4">
                    <Camera className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                      {featuredService.name}
                    </h3>
                    {featuredService.popular && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-gold mr-1" />
                        <span className="text-gold text-sm font-medium">Beliebteste Wahl</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {featuredService.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {featuredService.features?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gold mb-1">
                      {formatPrice(featuredService.price || 349, featuredService.currency)}
                    </div>
                    <div className="text-gray-400 text-sm line-through">
                      {formatPrice((featuredService.price || 349) + 50, featuredService.currency)}
                    </div>
                  </div>
                  
                  <Button 
                    variant="gold" 
                    size="lg"
                    onClick={() => handleCTAClick('contact', featuredService.id)}
                    className="group"
                  >
                    <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Jetzt buchen
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Fotobox Demo Video */}
            <div className="">
              <div className="relative">
                {/* Video Player */}
                <div className="relative h-96 rounded-3xl overflow-hidden glass-card">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster="/fotobox-video-poster.jpg"
                  >
                    <source src={FOTOBOX_VIDEO_URL} type="video/mp4" />
                    Ihr Browser unterstützt das Video-Element nicht.
                  </video>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    Demo Video
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/30 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/30 rounded-full blur-lg" />
              </div>
            </div>
          </div>

          {/* Service Selector */}
          <div className="mb-16">
            <h3 className="text-2xl font-serif font-bold text-white text-center mb-8">
              Wählen Sie Ihr Fotobox-Paket
            </h3>
            
            <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.slice(0, 3).map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceChange(index)}
                  className={`glass-card p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 ${
                    activeService === index 
                      ? 'border-2 border-gold bg-gold/10' 
                      : 'border border-white/10 hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-serif font-bold text-white">
                      {service.name}
                    </h4>
                    {service.popular && (
                      <div className="bg-gold text-white text-xs px-2 py-1 rounded-full">
                        Beliebt
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {service.description}
                  </p>
                  
                  <div className="text-2xl font-bold text-gold">
                    {formatPrice(service.price || 249, service.currency)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-gold mb-2">50+</div>
              <div className="text-gray-300">Fotobox Events</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-gold mb-2">10k+</div>
              <div className="text-gray-300">Fotos gedruckt</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-gold mb-2">100%</div>
              <div className="text-gray-300">Zufriedenheit</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-gold mb-2">24h</div>
              <div className="text-gray-300">Online verfügbar</div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Button
              variant="gold"
              size="xl"
              onClick={() => handleCTAClick('view_all')}
              className="group"
            >
              <span>Alle Fotobox-Services ansehen</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
