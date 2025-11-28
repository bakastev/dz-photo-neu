'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, ArrowDown, Camera, Award } from 'lucide-react';
import { useTracking } from '@/components/shared/TrackingProvider';

interface HeroSectionProps {
  data: {
    badge?: {
      text1: string;
      text2: string;
    };
    headline1?: string;
    headline2?: string;
    subtitle?: string;
    subheading?: string;
    description?: string;
    ctaButton?: string;
    backgroundImage?: string;
    altText?: string;
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { trackEvent } = useTracking();

  // Use data from database with fallbacks
  const heroBackgroundImage = data.backgroundImage || 'https://www.dz-photo.at/wp-content/uploads/DDZ_0106-1.jpg';
  const badge = data.badge || { text1: '15+ Jahre Erfahrung', text2: '200+ Hochzeiten' };
  const headline1 = data.headline1 || 'Stellt euch vor – Ihr könnt jeden Moment,';
  const headline2 = data.headline2 || 'jedes Gefühl';
  const subtitle = data.subtitle || 'jedes Mal aufs Neue spüren';
  const subheading = data.subheading || 'Emotionale Hochzeitsreportagen aus Linz';
  const description = data.description || 'Auf eurer Hochzeit gibt es viele kleine Geschichten.';
  const ctaButton = data.ctaButton || 'Jetzt Wunschtermin sichern';
  const altText = data.altText || 'Emotionale Hochzeitsfotografie von Daniel Zangerle';

  const handleCTAClick = () => {
    trackEvent('CTAClick', { 
      section: 'hero', 
      type: 'primary',
      button_text: ctaButton
    });

    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    trackEvent('ScrollDown', { section: 'hero' });
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt={altText}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-10" />
      </div>

      {/* Subtle Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/10 rounded-full blur-[150px] z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-4xl mx-auto text-center">
          
          {/* Stats Badges - Stacked on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 animate-fadeIn">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-white/90 text-sm font-medium">{badge.text1}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <Camera className="w-4 h-4 text-gold" />
              <span className="text-white/90 text-sm font-medium">{badge.text2}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 sm:mb-6 animate-slideUp">
            {/* First line - smaller on mobile */}
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white/90 leading-tight mb-2">
              {headline1}
            </span>
            {/* Emphasis word - big & gold */}
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-gold leading-[0.9]">
              {headline2}
            </span>
            {/* Continuation - medium */}
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white/90 mt-2 leading-tight">
              {subtitle}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-gold/80 uppercase tracking-[0.2em] font-medium mb-6 sm:mb-8 animate-fadeIn">
            {subheading}
          </p>

          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
            {description}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center space-y-8 animate-slideUp">
            <Button
              variant="gold"
              size="xl"
              onClick={handleCTAClick}
              className="group w-full sm:w-auto min-w-[280px] text-base sm:text-lg py-4 shadow-2xl shadow-gold/20 hover:shadow-gold/30 transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {ctaButton}
            </Button>
            
            {/* Trust indicator */}
            <p className="text-white/50 text-sm">
              Kostenlose Beratung • Unverbindliches Angebot
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 sm:mt-20 animate-bounce">
            <button
              onClick={handleScrollDown}
              className="text-white/50 hover:text-gold transition-colors duration-300 group"
              aria-label="Nach unten scrollen"
            >
              <ArrowDown className="w-7 h-7 mx-auto group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Desktop only */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-gold/40 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000 hidden lg:block" />
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-gold/30 rounded-full animate-pulse delay-2000 hidden lg:block" />
    </section>
  );
}
