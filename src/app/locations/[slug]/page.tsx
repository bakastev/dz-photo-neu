import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowLeft, Camera, Navigation, ExternalLink } from 'lucide-react';
import { supabase, type Location } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import ImageGallery from '@/components/shared/ImageGallery';
import ShareButton from '@/components/shared/ShareButton';
import LocationMap from '@/components/shared/LocationMap';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getLocation(slug: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedLocations(currentId: string, city?: string): Promise<Location[]> {
  let query = supabase
    .from('locations')
    .select('*')
    .eq('published', true)
    .neq('id', currentId);

  // Prefer locations from the same city
  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query.limit(4);

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);

  if (!location) {
    return {
      title: 'Location nicht gefunden',
    };
  }

  return {
    title: `${location.name} | Hochzeitslocation Oberösterreich`,
    description: location.meta_description || location.description || `Hochzeitslocation: ${location.name}`,
    openGraph: {
      title: location.name,
      description: location.description || '',
      type: 'website',
      images: location.cover_image ? [getImageUrl(location.cover_image)] : [],
    },
    alternates: {
      canonical: `https://www.dz-photo.at/locations/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('locations')
    .select('slug')
    .eq('published', true);

  return (data || []).map((location) => ({
    slug: location.slug,
  }));
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = await getLocation(slug);

  if (!location) {
    notFound();
  }

  const relatedLocations = await getRelatedLocations(location.id, location.city || undefined);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: location.name,
    description: location.description,
    url: `https://www.dz-photo.at/locations/${slug}`,
    image: location.cover_image ? getImageUrl(location.cover_image) : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city || 'Oberösterreich',
      addressRegion: 'Oberösterreich',
      addressCountry: 'AT',
    },
    geo: location.latitude && location.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: location.latitude,
      longitude: location.longitude,
    } : undefined,
    photo: location.images?.map((img: any) => ({
      '@type': 'Photograph',
      contentUrl: getImageUrl(typeof img === 'string' ? img : img.url),
      creator: {
        '@type': 'Person',
        name: 'Daniel Zangerle',
      },
    })),
  };

  const images = location.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [];
  if (location.cover_image && !images.includes(location.cover_image)) {
    images.unshift(location.cover_image);
  }

  return (
    <>
      <SchemaOrg data={schemaData} />
      <Navbar />
      
      <main className="min-h-screen bg-dark-background">
        <ScrollRevealWrapper>
          {/* Hero Section */}
          <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
            {/* Background Image */}
            <Image
              src={getImageUrl(location.cover_image)}
              alt={location.name}
              fill
              priority
              className="object-cover"
              placeholder="blur"
              blurDataURL={defaultBlurDataURL}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-black/50 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
                <div className="reveal">
                  {/* Back Link */}
                  <Link
                    href="/locations"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Alle Locations</span>
                  </Link>
                  
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
                    {location.name}
                  </h1>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-white/80">
                    {location.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gold" />
                        <span>{location.city}, Oberösterreich</span>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-gold" />
                        <span>{images.length} Fotos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 reveal">
                  {location.description && (
                    <>
                      <h2 className="text-2xl font-serif font-bold text-white mb-6">
                        Über diese <span className="text-gold">Location</span>
                      </h2>
                      <div className="prose prose-lg prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {location.description}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Rich Text Content from CMS */}
                  {location.content && (
                    <div 
                      className="mt-8 prose prose-lg prose-invert max-w-none
                        prose-headings:font-serif prose-headings:text-white
                        prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
                        prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-6
                        prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-4
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white prose-strong:font-semibold
                        prose-em:text-gray-200
                        prose-ul:text-gray-300 prose-ol:text-gray-300
                        prose-li:mb-2
                        prose-blockquote:border-l-gold prose-blockquote:text-gray-300 prose-blockquote:italic
                        prose-img:rounded-xl prose-img:shadow-lg"
                      dangerouslySetInnerHTML={{ __html: location.content }}
                    />
                  )}
                </div>

                {/* Sidebar */}
                <div className="reveal">
                  <div className="glass-card rounded-2xl p-6 sticky top-24">
                    <h3 className="text-lg font-serif font-bold text-white mb-4">
                      Location Details
                    </h3>
                    
                    <div className="space-y-4">
                      {location.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gold mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-400">Ort</p>
                            <p className="text-white">{location.city}</p>
                          </div>
                        </div>
                      )}
                      
                      {location.latitude && location.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Auf Google Maps ansehen</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <hr className="border-white/10 my-6" />

                    <Link
                      href="/#kontakt"
                      className="block w-full bg-gold hover:bg-gold-light text-white text-center px-6 py-3 rounded-full font-medium transition-all duration-300"
                    >
                      Anfrage senden
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          {images.length > 0 && (
            <section className="py-16 md:py-24 bg-black/30">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Impressionen
                  </h2>
                  <p className="text-gray-400">
                    Entdecken Sie die Schönheit dieser Location
                  </p>
                </div>
                
                <div className="reveal">
                  <ImageGallery images={images} title={location.name} layout="masonry" />
                </div>
              </div>
            </section>
          )}

          {/* Map Section - OpenStreetMap */}
          {location.latitude && location.longitude && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    <span className="text-gold">Standort</span> & Anfahrt
                  </h2>
                  <p className="text-gray-400">
                    So finden Sie diese wunderschöne Location
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto reveal">
                  <LocationMap
                    latitude={location.latitude}
                    longitude={location.longitude}
                    name={location.name}
                    address={location.address || `${location.city || ''}, ${location.region || 'Österreich'}`}
                    zoom={14}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Share Section */}
          <section className="py-12">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-center reveal">
                <ShareButton 
                  title={location.name} 
                  text={location.description || ''} 
                />
              </div>
            </div>
          </section>

          {/* Related Locations */}
          {relatedLocations.length > 0 && (
            <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Weitere <span className="text-gold">Locations</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                  {relatedLocations.map((relatedLocation, index) => (
                    <Link
                      key={relatedLocation.id}
                      href={`/locations/${relatedLocation.slug}`}
                      className="group"
                    >
                      <article 
                        className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={getImageUrl(relatedLocation.cover_image)}
                            alt={relatedLocation.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold transition-colors">
                            {relatedLocation.name}
                          </h3>
                          {relatedLocation.city && (
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {relatedLocation.city}
                            </p>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Hochzeitsfotos an dieser <span className="text-gold">Location</span>?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Ich kenne diese Location und kann Ihnen die besten Spots für 
                  unvergessliche Hochzeitsfotos zeigen.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Jetzt anfragen</span>
                </Link>
              </div>
            </div>
          </section>
        </ScrollRevealWrapper>
      </main>
      
      <Footer />
    </>
  );
}

