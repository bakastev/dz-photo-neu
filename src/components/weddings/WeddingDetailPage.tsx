'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Calendar, MapPin, Users, Camera, ArrowLeft, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { useTracking } from '@/components/shared/TrackingProvider';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import type { Wedding } from '@/lib/supabase';

interface WeddingDetailPageProps {
  wedding: Wedding;
}

export default function WeddingDetailPage({ wedding }: WeddingDetailPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { trackEvent } = useTracking();

  // Parse images from the wedding data
  const images = wedding.images ? 
    (Array.isArray(wedding.images) ? wedding.images : [wedding.images]).filter(Boolean) : 
    [];

  // Add cover image if it exists and isn't already in images
  const allImages = wedding.cover_image && !images.includes(wedding.cover_image) 
    ? [wedding.cover_image, ...images] 
    : images;

  // Convert to lightbox format
  const slides = allImages.map((img) => ({
    src: getImageUrl(img),
    alt: wedding.title,
  }));

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    trackEvent('ImageView', { 
      section: 'wedding_detail', 
      wedding_slug: wedding.slug,
      image_index: index 
    });
  };

  const handleShare = async () => {
    trackEvent('Share', { 
      section: 'wedding_detail', 
      wedding_slug: wedding.slug 
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hochzeit ${wedding.couple_names} - DZ-Photo`,
          text: wedding.description || `Hochzeitsfotografie von ${wedding.couple_names}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCTAClick = () => {
    trackEvent('CTAClick', { 
      section: 'wedding_detail', 
      wedding_slug: wedding.slug,
      type: 'contact' 
    });
  };

  return (
    <div className="min-h-screen bg-dark-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {wedding.cover_image && (
            <Image
              src={getImageUrl(wedding.cover_image)}
              alt={`Hochzeit ${wedding.couple_names}`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/hochzeit"
              className="inline-flex items-center text-white/80 hover:text-gold transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Zurück zu allen Hochzeiten
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-gold" />
              <span className="text-gold font-medium">Hochzeitsfotografie</span>
            </div>

            {/* Couple Names */}
            <h1 className="section-title font-serif font-bold mb-6 text-white">
              {wedding.couple_names}
            </h1>

            {/* Wedding Details */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-gray-300">
              {wedding.wedding_date && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gold" />
                  {formatDate(wedding.wedding_date)}
                </div>
              )}
              
              {wedding.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gold" />
                  {wedding.location}
                </div>
              )}

              {wedding.guest_count && (
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gold" />
                  {wedding.guest_count} Gäste
                </div>
              )}
            </div>

            {/* Description */}
            {wedding.description && (
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                {wedding.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gold"
                size="lg"
                onClick={handleCTAClick}
                className="group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Ähnliche Hochzeit anfragen
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleShare}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Teilen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {allImages.length > 0 && (
        <section className="py-20 bg-dark-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Hochzeitsgalerie
              </h2>
              <p className="text-gray-400">
                {allImages.length} Bilder von diesem besonderen Tag
              </p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`Hochzeitsfoto ${index + 1} von ${wedding.couple_names}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Image Number */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wedding Story Section */}
      {wedding.content && (
        <section className="py-20 bg-dark-background/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <Camera className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h2 className="text-3xl font-serif font-bold text-white mb-4">
                    Die Geschichte dieser Hochzeit
                  </h2>
                </div>

                <div 
                  className="prose prose-lg prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: wedding.content }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

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
                Gefällt Ihnen dieser Stil? Lassen Sie uns über Ihre Hochzeit sprechen 
                und gemeinsam unvergessliche Momente schaffen.
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

      {/* Professional Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter, Fullscreen]}
        thumbnails={{
          position: 'bottom',
          width: 100,
          height: 70,
          gap: 8,
          borderRadius: 8,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        carousel={{
          finite: false,
          preload: 2,
        }}
        animation={{
          swipe: 300,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
          closeOnPullUp: true,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
          },
          thumbnailsContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      />
    </div>
  );
}
