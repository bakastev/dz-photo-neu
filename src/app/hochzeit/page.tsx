import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Calendar, MapPin, ArrowRight, Camera } from 'lucide-react';
import { supabase, type Wedding } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';

export const metadata: Metadata = {
  title: 'Hochzeitsreportagen | Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
  description: 'Entdecken Sie emotionale Hochzeitsreportagen aus Oberösterreich. Professionelle Hochzeitsfotografie mit Liebe zum Detail.',
  openGraph: {
    title: 'Hochzeitsreportagen | Daniel Zangerle',
    description: 'Emotionale Hochzeitsreportagen aus Oberösterreich',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at/hochzeit',
  },
};

async function getWeddings(): Promise<Wedding[]> {
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('published', true)
    .order('wedding_date', { ascending: false });

  if (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }

  return data || [];
}

export default async function WeddingsPage() {
  const weddings = await getWeddings();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hochzeitsreportagen',
    description: 'Sammlung emotionaler Hochzeitsreportagen aus Oberösterreich',
    url: 'https://www.dz-photo.at/hochzeit',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DZ-Photo',
      url: 'https://www.dz-photo.at',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: weddings.length,
      itemListElement: weddings.map((wedding, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Event',
          name: wedding.title,
          url: `https://www.dz-photo.at/hochzeit/${wedding.slug}`,
          image: getImageUrl(wedding.cover_image),
          startDate: wedding.wedding_date,
          location: wedding.location ? {
            '@type': 'Place',
            name: wedding.location,
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
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/10 rounded-full blur-[100px] z-0" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center reveal">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
                  <Heart className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Hochzeitsreportagen</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                  Emotionale <span className="text-gold">Momente</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Jede Hochzeit erzählt eine einzigartige Geschichte. Entdecken Sie meine 
                  Hochzeitsreportagen und lassen Sie sich von echten Emotionen inspirieren.
                </p>
              </div>
            </div>
          </section>

          {/* Weddings Grid */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              {weddings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                  {weddings.map((wedding, index) => (
                    <Link
                      key={wedding.id}
                      href={`/hochzeit/${wedding.slug}`}
                      className="group"
                    >
                      <article 
                        className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image */}
                        <div className="relative h-72 overflow-hidden">
                          <Image
                            src={getImageUrl(wedding.cover_image)}
                            alt={wedding.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Featured Badge */}
                          {wedding.featured && (
                            <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </div>
                          )}
                          
                          {/* Image Count */}
                          {wedding.images && wedding.images.length > 0 && (
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {wedding.images.length}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h2 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                            {wedding.title}
                          </h2>
                          
                          {wedding.couple_names && (
                            <p className="text-gold font-medium mb-3">{wedding.couple_names}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                            {wedding.wedding_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(wedding.wedding_date)}</span>
                              </div>
                            )}
                            {wedding.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{wedding.location}</span>
                              </div>
                            )}
                          </div>

                          {wedding.description && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                              {wedding.description}
                            </p>
                          )}

                          <div className="flex items-center text-gold group-hover:text-gold-light transition-colors">
                            <span>Reportage ansehen</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 reveal">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-4">
                    Hochzeitsreportagen werden geladen...
                  </h2>
                  <p className="text-gray-400">
                    Bald finden Sie hier eine Auswahl meiner schönsten Hochzeitsreportagen.
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
                  Ihre Hochzeit verdient <span className="text-gold">besondere Bilder</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Lassen Sie uns gemeinsam Ihre einzigartige Liebesgeschichte in 
                  unvergesslichen Bildern festhalten.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-5 h-5" />
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
