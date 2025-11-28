'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px and not dismissed
      const shouldShow = window.scrollY > 500 && !isDismissed;
      setIsVisible(shouldShow);
    };

    // Check if user has dismissed it before
    const dismissed = localStorage.getItem('floating-cta-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('floating-cta-dismissed', 'true');
  };

  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slideUp">
      <div className="glass-card rounded-2xl p-4 max-w-sm shadow-2xl border border-gold/20">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white hover:bg-gold-light transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-gold" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-serif font-bold text-white mb-2">
              Traumhochzeit geplant?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Lassen Sie uns Ihre besonderen Momente festhalten.
            </p>
            
            <Button 
              variant="gold" 
              size="sm" 
              onClick={handleClick}
              className="w-full group"
            >
              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Jetzt anfragen
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>✓ 15+ Jahre Erfahrung</span>
            <span>✓ 200+ Hochzeiten</span>
          </div>
        </div>
      </div>
    </div>
  );
}



