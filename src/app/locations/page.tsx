import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Camera, Star } from 'lucide-react';
import { supabase, type Location } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';

export const metadata: Metadata = {
  title: 'Hochzeitslocations Oberösterreich | Daniel Zangerle',
  description: 'Entdecken Sie die schönsten Hochzeitslocations in Oberösterreich. Traumhafte Orte für Ihre Hochzeitsfotos.',
  openGraph: {
    title: 'Hochzeitslocations Oberösterreich | Daniel Zangerle',
    description: 'Die schönsten Hochzeitslocations in Oberösterreich',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at/locations',
  },
};

async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('published', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  return data || [];
}

export default async function LocationsPage() {
  const locations = await getLocations();

  // Group locations by city/region
  const locationsByCity = locations.reduce((acc, location) => {
    const city = location.city || 'Oberösterreich';
    if (!acc[city]) acc[city] = [];
    acc[city].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hochzeitslocations Oberösterreich',
    description: 'Sammlung der schönsten Hochzeitslocations in Oberösterreich',
    url: 'https://www.dz-photo.at/locations',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DZ-Photo',
      url: 'https://www.dz-photo.at',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: locations.length,
      itemListElement: locations.map((location, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Place',
          name: location.name,
          url: `https://www.dz-photo.at/locations/${location.slug}`,
          image: getImageUrl(location.cover_image),
          address: location.city ? {
            '@type': 'PostalAddress',
            addressLocality: location.city,
            addressRegion: 'Oberösterreich',
            addressCountry: 'AT',
          } : undefined,
        },
      })),
    },
  };

  return (
    <>
      <SchemaOrg data={schemaData} />
      <Navbar />
      
      <main className="min-h-screen bg-dark-background">
        <ScrollRevealWrapper>
          {/* Hero Section */}
          <section className="relative py-32 md:py-40 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-dark-background to-dark-background z-0" />
            <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gold/10 rounded-full blur-[100px] z-0" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center reveal">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Hochzeitslocations</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                  Traumhafte <span className="text-gold">Locations</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Entdecken Sie die schönsten Hochzeitslocations in Oberösterreich. 
                  Jeder Ort erzählt seine eigene Geschichte und bietet die perfekte Kulisse für Ihre Hochzeitsfotos.
                </p>
              </div>
            </div>
          </section>

          {/* Locations Grid */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              {locations.length > 0 ? (
                <>
                  {/* All Locations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal">
                    {locations.map((location, index) => (
                      <Link
                        key={location.id}
                        href={`/locations/${location.slug}`}
                        className="group"
                      >
                        <article 
                          className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 h-full"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          {/* Image */}
                          <div className="relative h-56 overflow-hidden">
                            <Image
                              src={getImageUrl(location.cover_image)}
                              alt={location.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              placeholder="blur"
                              blurDataURL={defaultBlurDataURL}
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Featured Badge */}
                            {location.featured && (
                              <div className="absolute top-3 left-3 bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Featured
                              </div>
                            )}
                            
                            {/* Image Count */}
                            {location.images && location.images.length > 0 && (
                              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {location.images.length}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h2 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                              {location.name}
                            </h2>
                            
                            {location.city && (
                              <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                                <MapPin className="w-3 h-3" />
                                <span>{location.city}</span>
                              </div>
                            )}

                            {location.description && (
                              <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                {location.description}
                              </p>
                            )}

                            <div className="flex items-center text-gold group-hover:text-gold-light transition-colors text-sm">
                              <span>Location entdecken</span>
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Locations by City */}
                  {Object.keys(locationsByCity).length > 1 && (
                    <div className="mt-20">
                      <h2 className="text-2xl font-serif font-bold text-white mb-8 reveal">
                        Locations nach <span className="text-gold">Region</span>
                      </h2>
                      
                      <div className="flex flex-wrap gap-4 reveal">
                        {Object.entries(locationsByCity).map(([city, cityLocations]) => (
                          <div
                            key={city}
                            className="glass-card rounded-full px-6 py-3 flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4 text-gold" />
                            <span className="text-white">{city}</span>
                            <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-sm">
                              {cityLocations.length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 reveal">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-4">
                    Locations werden geladen...
                  </h2>
                  <p className="text-gray-400">
                    Bald finden Sie hier eine Auswahl der schönsten Hochzeitslocations.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Die perfekte Location für <span className="text-gold">Ihre Hochzeit</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Sie haben noch keine Location? Ich berate Sie gerne und zeige Ihnen 
                  die schönsten Plätze für Ihre Hochzeitsfotos in Oberösterreich.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Beratung anfragen</span>
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




