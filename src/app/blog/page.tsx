import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight, Tag, User } from 'lucide-react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';

export const metadata: Metadata = {
  title: 'Hochzeitsfotografie Blog | Tipps & Inspiration | Daniel Zangerle',
  description: 'Tipps, Inspiration und Einblicke rund um Hochzeitsfotografie in Oberösterreich. Erfahren Sie mehr über Locations, Planung und unvergessliche Momente.',
  openGraph: {
    title: 'Hochzeitsfotografie Blog | Daniel Zangerle',
    description: 'Tipps & Inspiration für Ihre Hochzeit',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at/blog',
  },
};

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Get featured post (first one or one marked as featured)
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id);

  // Get unique categories
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'DZ-Photo Hochzeitsfotografie Blog',
    description: 'Tipps, Inspiration und Einblicke rund um Hochzeitsfotografie in Oberösterreich',
    url: 'https://www.dz-photo.at/blog',
    author: {
      '@type': 'Person',
      name: 'Daniel Zangerle',
      url: 'https://www.dz-photo.at',
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://www.dz-photo.at/blog/${post.slug}`,
      image: post.featured_image ? getImageUrl(post.featured_image) : undefined,
      datePublished: post.published_at,
      author: {
        '@type': 'Person',
        name: 'Daniel Zangerle',
      },
    })),
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
            <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gold/10 rounded-full blur-[100px] z-0" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center reveal">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Blog & Tipps</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                  Inspiration & <span className="text-gold">Tipps</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Entdecken Sie wertvolle Tipps für Ihre Hochzeit, inspirierende Geschichten 
                  und Einblicke hinter die Kulissen meiner Arbeit als Hochzeitsfotograf.
                </p>
              </div>
            </div>
          </section>

          {/* Categories */}
          {categories.length > 0 && (
            <section className="py-8 border-b border-white/10">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap justify-center gap-3 reveal">
                  <span className="glass-card px-4 py-2 rounded-full text-gold text-sm font-medium">
                    Alle Beiträge
                  </span>
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="glass-card px-4 py-2 rounded-full text-gray-300 text-sm hover:text-gold transition-colors cursor-pointer"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured Post */}
          {featuredPost && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4 md:px-6">
                <Link href={`/blog/${featuredPost.slug}`} className="group block reveal">
                  <article className="glass-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
                      <Image
                        src={getImageUrl(featuredPost.featured_image)}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL={defaultBlurDataURL}
                        priority
                      />
                      <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      {featuredPost.category && (
                        <div className="flex items-center gap-2 text-gold text-sm mb-4">
                          <Tag className="w-4 h-4" />
                          <span>{featuredPost.category}</span>
                        </div>
                      )}
                      
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 group-hover:text-gold transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      {featuredPost.excerpt && (
                        <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-gray-400 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Daniel Zangerle</span>
                        </div>
                        {featuredPost.published_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredPost.published_at)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-gold group-hover:text-gold-light transition-colors">
                        <span className="font-medium">Weiterlesen</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            </section>
          )}

          {/* Blog Grid */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                  {regularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group"
                    >
                      <article 
                        className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 h-full flex flex-col"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={getImageUrl(post.featured_image)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                          
                          {/* Category Badge */}
                          {post.category && (
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                              {post.category}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h2 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors">
                            {post.title}
                          </h2>
                          
                          {post.excerpt && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                            {post.published_at && (
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(post.published_at)}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-gold group-hover:text-gold-light transition-colors text-sm">
                              <span>Lesen</span>
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 reveal">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-4">
                    Blog-Beiträge werden geladen...
                  </h2>
                  <p className="text-gray-400">
                    Bald finden Sie hier wertvolle Tipps und Inspiration für Ihre Hochzeit.
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Keine Tipps <span className="text-gold">verpassen</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Erhalten Sie regelmäßig Inspiration und wertvolle Tipps 
                  für Ihre Hochzeitsplanung direkt in Ihr Postfach.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Kontakt aufnehmen</span>
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

