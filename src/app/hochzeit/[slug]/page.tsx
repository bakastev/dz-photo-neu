import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Calendar, MapPin, ArrowLeft, Camera } from 'lucide-react';
import { createStaticSupabaseClient } from '@/lib/auth-server';
import type { Wedding } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import ImageGallery from '@/components/shared/ImageGallery';
import ShareButton from '@/components/shared/ShareButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWedding(slug: string): Promise<Wedding | null> {
  const supabase = createStaticSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedWeddings(currentId: string): Promise<Wedding[]> {
  const supabase = createStaticSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('published', true)
    .neq('id', currentId)
    .limit(3);

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getWedding(slug);

  if (!wedding) {
    return {
      title: 'Hochzeit nicht gefunden',
    };
  }

  return {
    title: `${wedding.title} | Hochzeitsfotografie Daniel Zangerle`,
    description: wedding.meta_description || wedding.description || `Hochzeitsreportage: ${wedding.title}`,
    openGraph: {
      title: wedding.title,
      description: wedding.description || '',
      type: 'article',
      images: wedding.cover_image ? [getImageUrl(wedding.cover_image)] : [],
    },
    alternates: {
      canonical: `https://www.dz-photo.at/hochzeit/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createStaticSupabaseClient();
  const { data } = await supabase
    .from('weddings')
    .select('slug')
    .eq('published', true);

  return (data || []).map((wedding) => ({
    slug: wedding.slug,
  }));
}

export default async function WeddingPage({ params }: PageProps) {
  const { slug } = await params;
  const wedding = await getWedding(slug);

  if (!wedding) {
    notFound();
  }

  const relatedWeddings = await getRelatedWeddings(wedding.id);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: wedding.title,
    description: wedding.description,
    url: `https://www.dz-photo.at/hochzeit/${slug}`,
    image: wedding.cover_image ? getImageUrl(wedding.cover_image) : undefined,
    startDate: wedding.wedding_date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: wedding.location ? {
      '@type': 'Place',
      name: wedding.location,
    } : undefined,
    organizer: {
      '@type': 'Person',
      name: wedding.couple_names || 'Brautpaar',
    },
    recordedIn: {
      '@type': 'Photograph',
      creator: {
        '@type': 'Person',
        name: 'Daniel Zangerle',
        url: 'https://www.dz-photo.at',
      },
    },
  };

  // Extract image URLs from the images array (can be strings or objects with url property)
  const extractImageUrls = (imgs: any[]): string[] => {
    return imgs.map(img => {
      if (typeof img === 'string') return img;
      if (img && typeof img === 'object' && img.url) return img.url;
      return null;
    }).filter((url): url is string => url !== null);
  };
  
  const images = extractImageUrls(wedding.images || []);
  if (wedding.cover_image && !images.includes(wedding.cover_image)) {
    images.unshift(wedding.cover_image);
  }

  return (
    <>
      <SchemaOrg data={schemaData} />
      <Navbar />
      
      <main className="min-h-screen bg-dark-background">
        <ScrollRevealWrapper>
          {/* Hero Section */}
          <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
            {/* Background Image */}
            <Image
              src={getImageUrl(wedding.cover_image)}
              alt={wedding.title}
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
              <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-20">
                <div className="reveal">
                  {/* Back Link */}
                  <Link
                    href="/hochzeit"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Alle Hochzeiten</span>
                  </Link>
                  
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
                    {wedding.title}
                  </h1>
                  
                  {/* Couple Names */}
                  {wedding.couple_names && (
                    <p className="text-2xl md:text-3xl text-gold font-serif mb-6">
                      {wedding.couple_names}
                    </p>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-white/80">
                    {wedding.wedding_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gold" />
                        <span>{formatDate(wedding.wedding_date)}</span>
                      </div>
                    )}
                    {wedding.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gold" />
                        <span>{wedding.location}</span>
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
          {wedding.description && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center reveal">
                  <Heart className="w-8 h-8 text-gold mx-auto mb-6" />
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-serif italic">
                    "{wedding.description}"
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Content Section - Rich Text from CMS */}
          {wedding.content && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto reveal">
                  <div 
                    className="prose prose-lg prose-invert max-w-none
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
                    dangerouslySetInnerHTML={{ __html: wedding.content }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {images.length > 0 && (
            <section className="py-16 md:py-24 bg-black/30">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Die <span className="text-gold">Galerie</span>
                  </h2>
                  <p className="text-gray-400">
                    Klicken Sie auf ein Bild für die Vollansicht
                  </p>
                </div>
                
                <div className="reveal">
                  <ImageGallery images={images} title={wedding.title} layout="grid" />
                </div>
              </div>
            </section>
          )}

          {/* Share Section */}
          <section className="py-12">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-center reveal">
                <ShareButton 
                  title={wedding.title} 
                  text={wedding.description || ''} 
                />
              </div>
            </div>
          </section>

          {/* Related Weddings */}
          {relatedWeddings.length > 0 && (
            <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Weitere <span className="text-gold">Hochzeiten</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                  {relatedWeddings.map((relatedWedding, index) => (
                    <Link
                      key={relatedWedding.id}
                      href={`/hochzeit/${relatedWedding.slug}`}
                      className="group"
                    >
                      <article 
                        className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getImageUrl(relatedWedding.cover_image)}
                            alt={relatedWedding.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold transition-colors">
                            {relatedWedding.title}
                          </h3>
                          {relatedWedding.couple_names && (
                            <p className="text-gold text-sm">{relatedWedding.couple_names}</p>
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
