'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Star, ArrowDown } from 'lucide-react';
import { useTracking } from '@/components/shared/TrackingProvider';

interface HeroSectionProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { trackEvent } = useTracking();

  // Static hero background - using the original hero image from the website
  const heroBackgroundImage = 'https://www.dz-photo.at/wp-content/uploads/DDZ_0106-1.jpg';

  const handleCTAClick = (type: 'primary' | 'secondary') => {
    trackEvent('CTAClick', { 
      section: 'hero', 
      type,
      button_text: type === 'primary' ? data.ctaPrimary : data.ctaSecondary 
    });

    if (type === 'primary') {
      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Scroll to portfolio section
      const portfolioSection = document.getElementById('portfolio');
      portfolioSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    trackEvent('ScrollDown', { section: 'hero' });
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Static Background Image - Original Design */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="Emotionale Hochzeitsfotografie von Daniel Zangerle"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70 z-10" />
      </div>

      {/* Gold Accent Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gold-light/20 rounded-full blur-[100px] z-10" />

      {/* Content - Following Original Layout */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
        <div className="reveal max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-8 animate-fadeIn">
            <Star className="w-5 h-5 text-gold" />
            <span className="text-gold font-medium">15+ Jahre Erfahrung</span>
            <div className="w-1 h-1 bg-gold rounded-full" />
            <span className="text-gold font-medium">200+ Hochzeiten</span>
          </div>

          {/* Original Hero Text - Matching the Website */}
          <h1 className="hero-title text-white mb-6 animate-slideUp">
            <span className="block text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
              Stellt euch vor - Ihr könnt jeden Moment,
            </span>
            <span className="gold-gradient-text block mt-2 text-4xl md:text-6xl lg:text-7xl font-serif font-bold">
              jedes Gefühl
            </span>
          </h1>

          {/* Subtitle with Heart */}
          <div className="flex items-center justify-center mb-12 animate-fadeIn">
            <Heart className="w-6 h-6 text-gold mr-3" />
            <p className="text-2xl md:text-3xl text-gold font-light italic">
              jedes Mal aufs neue spüren
            </p>
            <Heart className="w-6 h-6 text-gold ml-3" />
          </div>

          {/* Subheading */}
          <h4 className="text-xl md:text-2xl text-gray-200 mb-8 font-medium animate-slideUp">
            emotionale Hochzeitsreportagen aus Linz
          </h4>

          {/* Main Description */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-12 leading-tight animate-slideUp max-w-4xl mx-auto">
            Auf eurer Hochzeit gibt es viele kleine Geschichten.
          </h2>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-16 animate-slideUp">
            <Button
              variant="gold"
              size="xl"
              onClick={() => handleCTAClick('primary')}
              className="group min-w-[280px] text-lg py-4"
            >
              <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Jetzt Wunschtermin sichern
            </Button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="animate-bounce">
            <button
              onClick={handleScrollDown}
              className="text-white/70 hover:text-gold transition-colors group"
              aria-label="Nach unten scrollen"
            >
              <ArrowDown className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-gold/30 rounded-full animate-pulse z-15 hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-gold-light/40 rounded-full animate-pulse delay-1000 z-15 hidden lg:block" />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-gold/50 rounded-full animate-pulse delay-2000 z-15 hidden lg:block" />
    </section>
  );
}