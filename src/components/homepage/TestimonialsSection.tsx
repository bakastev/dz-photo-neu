'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useTracking } from '@/components/shared/TrackingProvider';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/lib/supabase';

interface TestimonialsSectionProps {
  data: Review[];
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // const { trackEvent } = useTracking();

  // Fallback testimonials if no data from backend
  const fallbackTestimonials: Review[] = [
    {
      id: '1',
      author_name: 'Sarah & Michael',
      rating: 5,
      review_text: 'Daniel hat unsere Hochzeit so wunderschön festgehalten! Die Bilder sind einfach traumhaft und wir können sie uns immer wieder ansehen. Er war den ganzen Tag über so professionell und unaufdringlich.',
      review_date: '2024-09-15',
      published: true,
      created_at: '2024-09-15'
    },
    {
      id: '2',
      author_name: 'Lisa & Thomas',
      rating: 5,
      review_text: 'Wir sind so dankbar, dass wir Daniel für unsere Hochzeit gebucht haben. Seine Art zu fotografieren ist einzigartig - er fängt die Emotionen perfekt ein. Absolute Empfehlung!',
      review_date: '2024-08-22',
      published: true,
      created_at: '2024-08-22'
    },
    {
      id: '3',
      author_name: 'Anna & Markus',
      rating: 5,
      review_text: 'Die Fotobox war der absolute Hit auf unserer Hochzeit! Alle Gäste hatten so viel Spaß und die Bilder sind einfach genial geworden. Daniel ist ein echter Profi!',
      review_date: '2024-07-10',
      published: true,
      created_at: '2024-07-10'
    },
    {
      id: '4',
      author_name: 'Julia & Stefan',
      rating: 5,
      review_text: 'Von der ersten Beratung bis zur Übergabe der Bilder - alles war perfekt! Daniel versteht es, die besonderen Momente einzufangen. Wir würden ihn jederzeit wieder buchen.',
      review_date: '2024-06-18',
      published: true,
      created_at: '2024-06-18'
    }
  ];

  const testimonials = data.length > 0 ? data : fallbackTestimonials;

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    
    // trackEvent('TestimonialNavigation', { 
    //   section: 'testimonials', 
    //   direction: direction,
    //   current_index: currentIndex 
    // });

    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }

    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    
    // trackEvent('TestimonialDotClick', { 
    //   section: 'testimonials', 
    //   index: index 
    // });

    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleCTAClick = () => {
    // trackEvent('CTAClick', { 
    //   section: 'testimonials', 
    //   type: 'contact' 
    // });

    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-gold fill-gold' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-pink-500/20 rounded-full blur-[100px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Was unsere <span className="text-gold">Paare sagen</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Die schönsten Komplimente kommen von zufriedenen Brautpaaren. 
            Lesen Sie, was andere über ihre Erfahrung mit DZ-Photo sagen.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="reveal max-w-5xl mx-auto mb-16">
          <div className="reveal glass-card rounded-3xl p-8 md:p-12 text-center">
            {/* Quote Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
              <Quote className="w-10 h-10 text-gold" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {renderStars(currentTestimonial.rating)}
            </div>

            {/* Review Text */}
            <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-light italic">
              "{currentTestimonial.review_text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <div className="text-left">
                <div className="font-serif font-bold text-xl text-white">
                  {currentTestimonial.author_name}
                </div>
                {currentTestimonial.review_date && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(currentTestimonial.review_date)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('prev')}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gold scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('next')}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">200+</div>
            <div className="text-gray-300">Zufriedene Paare</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">5.0</div>
            <div className="text-gray-300">⭐ Durchschnitt</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">100%</div>
            <div className="text-gray-300">Weiterempfehlung</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">15+</div>
            <div className="text-gray-300">Jahre Erfahrung</div>
          </div>
        </div>

        {/* Testimonial Grid Preview */}
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                index === currentIndex ? 'border-2 border-gold' : 'border border-white/10'
              }`}
              onClick={() => handleDotClick(index)}
            >
              {/* Mini Rating */}
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Mini Review */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                "{testimonial.review_text}"
              </p>

              {/* Mini Author */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center mr-3">
                  <Heart className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">
                    {testimonial.author_name}
                  </div>
                  {testimonial.review_date && (
                    <div className="text-gray-400 text-xs">
                      {formatDate(testimonial.review_date)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="reveal glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              Werden Sie unser nächstes zufriedenes Paar!
            </h3>
            <p className="text-gray-300 mb-6">
              Lassen Sie uns gemeinsam Ihre Traumhochzeit unvergesslich machen. 
              Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={handleCTAClick}
              className="group"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Jetzt Beratung anfragen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
