'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useTracking } from '@/components/shared/TrackingProvider';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import type { Wedding, Location } from '@/lib/supabase';
// import Lightbox from '@/components/shared/Lightbox';

interface PortfolioSectionProps {
  data: {
    weddings: Wedding[];
    locations: Location[];
  };
}

// Helper to safely extract images array
function getImagesArray(item: Wedding | Location): string[] {
  try {
    if (!item) return [];
    
    // Handle different image formats
    if (Array.isArray(item.images)) {
      // If it's an array of objects with url property
      if (item.images.length > 0 && typeof item.images[0] === 'object' && 'url' in item.images[0]) {
        return item.images.map((img: any) => img.url || '').filter(Boolean);
      }
      // If it's an array of strings
      if (typeof item.images[0] === 'string') {
        return item.images.filter(Boolean);
      }
    }
    
    // Fallback to cover_image
    if (item.cover_image) {
      return [item.cover_image];
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting images:', error);
    return item.cover_image ? [item.cover_image] : [];
  }
}

export default function PortfolioSection({ data }: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState<'weddings' | 'locations'>('weddings');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');
  // const { trackEvent } = useTracking();

  // Memoize data to prevent unnecessary re-renders
  const safeData = useMemo(() => {
    return {
      weddings: Array.isArray(data?.weddings) ? data.weddings : [],
      locations: Array.isArray(data?.locations) ? data.locations : [],
    };
  }, [data?.weddings, data?.locations]);

  const contentRef = useRef<HTMLDivElement>(null);

  // Re-initialize scroll reveal when tab changes
  useEffect(() => {
    if (contentRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const revealElements = contentRef.current?.querySelectorAll('.reveal');
        if (revealElements) {
          revealElements.forEach((element) => {
            element.classList.remove('active');
            // Trigger re-check
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.85) {
              element.classList.add('active');
            }
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'weddings' | 'locations') => {
    try {
      setActiveTab(tab);
      // trackEvent('TabChange', { 
      //   section: 'portfolio', 
      //   tab: tab 
      // });
    } catch (error) {
      console.error('Error in handleTabChange:', error);
    }
  };

  const handleImageClick = (images: string[], index: number, title: string) => {
    try {
      setLightboxImages(images);
      setLightboxIndex(index);
      setLightboxTitle(title);
      setLightboxOpen(true);
      
      // trackEvent('ImageView', { 
      //   section: 'portfolio', 
      //   type: activeTab,
      //   title: title
      // });
    } catch (error) {
      console.error('Error in handleImageClick:', error);
    }
  };

  const handleItemClick = (type: 'wedding' | 'location', slug: string, title: string) => {
    // trackEvent('PortfolioItemClick', { 
    //   section: 'portfolio', 
    //   type: type,
    //   slug: slug,
    //   title: title
    // });
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/3 right-1/3 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 reveal">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Mein <span className="text-gold">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie eine Auswahl meiner schönsten Hochzeitsreportagen und 
            die traumhaftesten Locations in Oberösterreich.
          </p>
        </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 reveal">
          <div className="reveal glass-card rounded-full p-2 inline-flex">
            <button
              onClick={() => handleTabChange('weddings')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'weddings'
                  ? 'bg-gold text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Hochzeiten
            </button>
            <button
              onClick={() => handleTabChange('locations')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'locations'
                  ? 'bg-gold text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MapPin className="w-5 h-5 inline mr-2" />
              Locations
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="reveal max-w-7xl mx-auto">
          {/* Weddings Tab */}
          {activeTab === 'weddings' && (
            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeData.weddings.length > 0 ? safeData.weddings.map((wedding, index) => {
                if (!wedding || !wedding.id) return null;
                
                const weddingImages = getImagesArray(wedding);
                const coverImage = wedding.cover_image || weddingImages[0] || '';
                
                return (
                <div
                  key={wedding.id}
                  className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Wedding Image */}
                  <div className="relative h-64 overflow-hidden image-hover">
                    {coverImage && (
                      <Image
                        src={getImageUrl(coverImage)}
                        alt={wedding.title || 'Hochzeit'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL={defaultBlurDataURL}
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View Button */}
                    {weddingImages.length > 0 && (
                      <button
                        onClick={() => handleImageClick(weddingImages, 0, wedding.title || 'Hochzeit')}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:scale-110"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}

                    {/* Featured Badge */}
                    {wedding.featured && (
                      <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Wedding Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {wedding.title}
                    </h3>
                    
                    {wedding.couple_names && (
                      <p className="text-gold font-medium mb-2">{wedding.couple_names}</p>
                    )}
                    
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      {wedding.wedding_date && (
                        <>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(wedding.wedding_date)}</span>
                        </>
                      )}
                      {wedding.location && wedding.wedding_date && (
                        <span className="mx-2">•</span>
                      )}
                      {wedding.location && (
                        <>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{wedding.location}</span>
                        </>
                      )}
                    </div>

                    {wedding.description && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {wedding.description}
                      </p>
                    )}

                    <Link
                      href={`/hochzeit/${wedding.slug}`}
                      onClick={() => handleItemClick('wedding', wedding.slug, wedding.title)}
                      className="inline-flex items-center text-gold hover:text-gold-light transition-colors group/link"
                    >
                      <span>Hochzeit ansehen</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                );
              }).filter(Boolean) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white text-lg">Keine Hochzeiten gefunden.</p>
                </div>
              )}
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {safeData.locations.length > 0 ? safeData.locations.map((location, index) => {
                if (!location || !location.id) return null;
                
                const locationImages = getImagesArray(location);
                const coverImage = location.cover_image || locationImages[0] || '';
                
                return (
                <div
                  key={location.id}
                  className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Location Image */}
                  <div className="relative h-48 overflow-hidden image-hover">
                    {coverImage && (
                      <Image
                        src={getImageUrl(coverImage)}
                        alt={location.name || 'Location'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL={defaultBlurDataURL}
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View Button */}
                    {locationImages.length > 0 && (
                      <button
                        onClick={() => handleImageClick(locationImages, 0, location.name || 'Location')}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:scale-110"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Location Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-serif font-bold text-white mb-1 group-hover:text-gold transition-colors">
                      {location.name}
                    </h3>
                    
                    {location.city && (
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{location.city}</span>
                      </div>
                    )}

                    <Link
                      href={`/locations/${location.slug}`}
                      onClick={() => handleItemClick('location', location.slug, location.name)}
                      className="inline-flex items-center text-gold hover:text-gold-light transition-colors text-sm group/link"
                    >
                      <span>Location ansehen</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                );
              }).filter(Boolean) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white text-lg">Keine Locations gefunden.</p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === 'weddings' && safeData.weddings.length === 0) || 
            (activeTab === 'locations' && safeData.locations.length === 0)) && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                {activeTab === 'weddings' ? (
                  <Heart className="w-10 h-10 text-gold" />
                ) : (
                  <MapPin className="w-10 h-10 text-gold" />
                )}
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                {activeTab === 'weddings' ? 'Hochzeiten werden geladen...' : 'Locations werden geladen...'}
              </h3>
              <p className="text-gray-400">
                Bald finden Sie hier eine Auswahl meiner schönsten {activeTab === 'weddings' ? 'Hochzeitsreportagen' : 'Locations'}.
              </p>
            </div>
          )}
        </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
          <Button
            variant="gold"
            size="lg"
            onClick={() => {
              // trackEvent('CTAClick', { section: 'portfolio', type: 'view_all' });
              if (activeTab === 'weddings') {
                // Navigate to weddings overview (when implemented)
                console.log('Navigate to weddings overview');
              } else {
                // Navigate to locations overview (when implemented)
                console.log('Navigate to locations overview');
              }
            }}
            className="group"
          >
            <span>Alle {activeTab === 'weddings' ? 'Hochzeiten' : 'Locations'} ansehen</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Lightbox - temporarily disabled */}
      {/* <Lightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrevious={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
        onNext={() => setLightboxIndex(Math.min(lightboxImages.length - 1, lightboxIndex + 1))}
        title={lightboxTitle}
      /> */}
    </section>
  );
}
