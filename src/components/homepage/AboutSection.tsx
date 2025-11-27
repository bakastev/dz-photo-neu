'use client';

import Image from 'next/image';
import { Heart, Camera, MapPin, Award, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/components/shared/TrackingProvider';

// Icon mapping
const iconMap: Record<string, any> = {
  Heart, Camera, MapPin, Award, Users, Clock
};

interface AboutSectionProps {
  data: {
    sectionTitle?: string;
    sectionTitleHighlight?: string;
    quickAnswer?: {
      label: string;
      text: string;
    };
    intro?: string[];
    image?: string;
    imageAlt?: string;
    storyTitle?: string;
    storyParagraphs?: string[];
    ctaButton?: string;
    features?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    trustTitle?: string;
    stats?: Array<{
      value: string;
      label: string;
      icon: string;
    }>;
  };
}

export default function AboutSection({ data }: AboutSectionProps) {
  const { trackEvent } = useTracking();

  // Defaults from database
  const sectionTitle = data.sectionTitle || 'Über';
  const sectionTitleHighlight = data.sectionTitleHighlight || 'Daniel Zangerle';
  const quickAnswer = data.quickAnswer || {
    label: 'Quick Answer:',
    text: 'Professioneller Hochzeitsfotograf aus Oberösterreich mit über 15 Jahren Erfahrung.'
  };
  const intro = data.intro || [];
  const image = data.image || 'https://www.dz-photo.at/wp-content/uploads/DDZ_0039.jpg';
  const imageAlt = data.imageAlt || 'Daniel Zangerle - Hochzeitsfotograf';
  const storyTitle = data.storyTitle || 'Meine Geschichte';
  const storyParagraphs = data.storyParagraphs || [];
  const ctaButton = data.ctaButton || 'Jetzt kennenlernen';
  const features = data.features || [];
  const trustTitle = data.trustTitle || 'Warum Paare mir vertrauen';
  const stats = data.stats || [];

  const handleContactClick = () => {
    trackEvent('CTAClick', { 
      section: 'about', 
      type: 'contact',
      button_text: ctaButton
    });

    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Gold Radial Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gold/30 rounded-full blur-[120px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Main Intro */}
        <div className="reveal max-w-4xl mx-auto text-center mb-16">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            {sectionTitle} <span className="text-gold">{sectionTitleHighlight}</span>
          </h2>
          
          {/* Quick Answer Box */}
          <div className="rapid-response mb-8 p-6 bg-gold/10 rounded-2xl border-2 border-gold/20 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              <strong className="text-gold">{quickAnswer.label}</strong> {quickAnswer.text}
            </p>
          </div>
          
          {intro.map((paragraph, index) => (
            <p key={index} className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Detailed Content */}
        <div className="reveal max-w-6xl mx-auto">
          <div className="reveal glass-card rounded-3xl p-8 md:p-12">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <Image 
                    src={image}
                    alt={imageAlt}
                    width={600}
                    height={700}
                    className="w-full rounded-2xl shadow-2xl"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
                  />
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-light/30 rounded-full blur-lg" />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl md:text-4xl font-serif font-bold mb-8 text-white">
                  {storyTitle}
                </h3>
                <div className="prose prose-lg max-w-none text-gray-300 space-y-6">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button 
                    variant="gold" 
                    size="lg"
                    onClick={handleContactClick}
                    className="group"
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {ctaButton}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Icons */}
          {features.length > 0 && (
            <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Heart;
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center liquid-glass-icon">
                      <IconComponent className="w-10 h-10 text-gold" />
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stats & Achievements */}
          {stats.length > 0 && (
            <div className="mt-16 glass-card rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-white text-center">
                {trustTitle}
              </h3>
              
              <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const IconComponent = iconMap[stat.icon] || Award;
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <IconComponent className="w-8 h-8 text-gold mr-2" />
                        <span className="text-3xl font-bold text-gold">{stat.value}</span>
                      </div>
                      <p className="text-gray-300">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
