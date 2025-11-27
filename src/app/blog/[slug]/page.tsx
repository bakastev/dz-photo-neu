import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Tag, User, Clock, ArrowRight } from 'lucide-react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import ShareButton from '@/components/shared/ShareButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedPosts(currentId: string, category?: string): Promise<BlogPost[]> {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .neq('id', currentId);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Beitrag nicht gefunden',
    };
  }

  return {
    title: `${post.title} | DZ-Photo Blog`,
    description: post.meta_description || post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: ['Daniel Zangerle'],
      images: post.cover_image ? [getImageUrl(post.cover_image)] : [],
    },
    alternates: {
      canonical: `https://www.dz-photo.at/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);

  return (data || []).map((post) => ({
    slug: post.slug,
  }));
}

// Estimate reading time
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  return Math.ceil(words / wordsPerMinute);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category || undefined);
  const readingTime = getReadingTime(post.content || '');

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta_description,
    url: `https://www.dz-photo.at/blog/${slug}`,
    image: post.cover_image ? getImageUrl(post.cover_image) : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: 'Daniel Zangerle',
      url: 'https://www.dz-photo.at',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DZ-Photo',
      url: 'https://www.dz-photo.at',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.dz-photo.at/dz-photo-logo-white.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.dz-photo.at/blog/${slug}`,
    },
    articleSection: post.category,
    wordCount: post.content?.split(/\s+/).length || 0,
  };

  return (
    <>
      <SchemaOrg data={schemaData} />
      <Navbar />
      
      <main className="min-h-screen bg-dark-background">
        <ScrollRevealWrapper>
          {/* Hero Section */}
          <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
            {/* Background Image */}
            {post.cover_image && (
              <Image
                src={getImageUrl(post.cover_image)}
                alt={post.title}
                fill
                priority
                className="object-cover"
                placeholder="blur"
                blurDataURL={defaultBlurDataURL}
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-black/60 to-black/40" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
                <div className="max-w-4xl reveal">
                  {/* Back Link */}
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Alle Beiträge</span>
                  </Link>
                  
                  {/* Category */}
                  {post.category && (
                    <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-1 mb-4">
                      <Tag className="w-3 h-3 text-gold" />
                      <span className="text-gold text-sm">{post.category}</span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                    {post.title}
                  </h1>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gold" />
                      <span>Daniel Zangerle</span>
                    </div>
                    {post.published_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold" />
                      <span>{readingTime} Min. Lesezeit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <article className="lg:col-span-3 reveal">
                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 font-serif italic border-l-4 border-gold pl-6">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* Content */}
                  <div 
                    className="prose prose-lg prose-invert max-w-none
                      prose-headings:font-serif prose-headings:text-white
                      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                      prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-white
                      prose-ul:text-gray-300 prose-ol:text-gray-300
                      prose-li:marker:text-gold
                      prose-blockquote:border-gold prose-blockquote:text-gray-400 prose-blockquote:italic
                      prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="glass-card px-4 py-2 rounded-full text-gray-300 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1 reveal">
                  <div className="sticky top-24 space-y-8">
                    {/* Author Card */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-serif font-bold text-white mb-4">
                        Über den Autor
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                          <User className="w-8 h-8 text-gold" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Daniel Zangerle</p>
                          <p className="text-gray-400 text-sm">Hochzeitsfotograf</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Professioneller Hochzeitsfotograf aus Oberösterreich mit Leidenschaft 
                        für emotionale Momente.
                      </p>
                    </div>

                    {/* Share */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-serif font-bold text-white mb-4">
                        Teilen
                      </h3>
                      <ShareButton 
                        title={post.title} 
                        text={post.excerpt || ''} 
                        className="w-full flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-3 rounded-full transition-colors"
                        buttonText="Beitrag teilen"
                      />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-20 md:py-32 bg-black/30">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Weitere <span className="text-gold">Beiträge</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <article 
                        className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getImageUrl(relatedPost.cover_image)}
                            alt={relatedPost.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          {relatedPost.published_at && (
                            <p className="text-gray-400 text-sm mt-2">
                              {formatDate(relatedPost.published_at)}
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
                  Bereit für Ihre <span className="text-gold">Traumhochzeit</span>?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Lassen Sie uns gemeinsam Ihre einzigartige Geschichte in 
                  unvergesslichen Bildern festhalten.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <span>Jetzt anfragen</span>
                  <ArrowRight className="w-5 h-5" />
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

