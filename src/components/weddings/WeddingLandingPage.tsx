'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Calendar, MapPin, Users, Camera, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/components/shared/TrackingProvider';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import type { Wedding } from '@/lib/supabase';

interface WeddingLandingPageProps {
  weddings: Wedding[];
}

export default function WeddingLandingPage({ weddings }: WeddingLandingPageProps) {
  const [filter, setFilter] = useState<'all' | 'recent' | 'featured'>('all');
  const { trackEvent } = useTracking();

  const handleFilterChange = (newFilter: 'all' | 'recent' | 'featured') => {
    setFilter(newFilter);
    trackEvent('WeddingFilter', { 
      section: 'weddings_landing', 
      filter: newFilter 
    });
  };

  const handleWeddingClick = (wedding: Wedding) => {
    trackEvent('WeddingClick', { 
      section: 'weddings_landing', 
      wedding_slug: wedding.slug,
      couple_names: wedding.couple_names 
    });
  };

  const handleCTAClick = () => {
    trackEvent('CTAClick', { 
      section: 'weddings_landing', 
      type: 'contact' 
    });
  };

  // Filter weddings based on selected filter
  const filteredWeddings = weddings.filter(wedding => {
    if (filter === 'featured') return wedding.featured;
    if (filter === 'recent') {
      const weddingDate = new Date(wedding.wedding_date || wedding.created_at || new Date());
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return weddingDate > sixMonthsAgo;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-pink-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-gold" />
              <span className="text-gold font-medium">Hochzeitsfotografie</span>
            </div>

            {/* Title */}
            <h1 className="section-title font-serif font-bold mb-6 text-white">
              Emotionale <span className="text-gold">Hochzeitsreportagen</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Jede Hochzeit erzählt ihre eigene Geschichte. Ich halte die besonderen Momente, 
              spontanen Emotionen und unvergesslichen Augenblicke Ihres großen Tages fest - 
              natürlich und unaufdringlich.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">{weddings.length}+</div>
                <div className="text-gray-300">Hochzeiten</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">15+</div>
                <div className="text-gray-300">Jahre Erfahrung</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">100%</div>
                <div className="text-gray-300">Zufriedenheit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">∞</div>
                <div className="text-gray-300">Erinnerungen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-dark-background/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <h2 className="text-2xl font-serif font-bold text-white mb-4 md:mb-0">
              Unsere Hochzeiten
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'Alle' },
                  { key: 'featured', label: 'Featured' },
                  { key: 'recent', label: 'Aktuell' }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.key}
                    variant={filter === filterOption.key ? 'gold' : 'ghost'}
                    size="sm"
                    onClick={() => handleFilterChange(filterOption.key as any)}
                    className="text-sm"
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Wedding Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWeddings.map((wedding, index) => (
              <article
                key={wedding.id}
                className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Wedding Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getImageUrl(wedding.cover_image)}
                    alt={`Hochzeit ${wedding.couple_names}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                  
                  {/* Featured Badge */}
                  {wedding.featured && (
                    <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="w-3 h-3 inline mr-1" />
                      Featured
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Wedding Content */}
                <div className="p-6">
                  {/* Couple Names */}
                  <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors">
                    {wedding.couple_names}
                  </h3>

                  {/* Wedding Details */}
                  <div className="space-y-2 mb-4">
                    {wedding.wedding_date && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(wedding.wedding_date)}
                      </div>
                    )}
                    
                    {wedding.location && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {wedding.location}
                      </div>
                    )}

                    {wedding.guest_count && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        {wedding.guest_count} Gäste
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {wedding.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {wedding.description}
                    </p>
                  )}

                  {/* View Wedding Link */}
                  <Link
                    href={`/hochzeit/${wedding.slug}`}
                    onClick={() => handleWeddingClick(wedding)}
                    className="inline-flex items-center text-gold hover:text-gold-light transition-colors group/link text-sm font-medium"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    <span>Hochzeit ansehen</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredWeddings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                <Heart className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Keine Hochzeiten gefunden
              </h3>
              <p className="text-gray-400">
                Für den ausgewählten Filter sind derzeit keine Hochzeiten verfügbar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="glass-card rounded-3xl p-12">
              <Heart className="w-16 h-16 text-gold mx-auto mb-6" />
              
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Ihre Traumhochzeit wartet
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Lassen Sie uns gemeinsam Ihre Hochzeit zu einem unvergesslichen 
                Erlebnis machen. Kontaktieren Sie mich für ein persönliches Gespräch.
              </p>
              
              <Button
                variant="gold"
                size="xl"
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
    </div>
  );
}
