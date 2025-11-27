'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, Lightbulb, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useTracking } from '@/components/shared/TrackingProvider';
import { getImageUrl, defaultBlurDataURL, formatDate, truncateText } from '@/lib/utils';
import type { BlogPost } from '@/lib/supabase';

interface BlogSectionProps {
  data: BlogPost[];
}

export default function BlogSection({ data }: BlogSectionProps) {
  // const { trackEvent } = useTracking();

  // Fallback blog posts if no data from backend
  const fallbackPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'hochzeitsplanung-checkliste',
      title: 'Die ultimative Hochzeitsplanung Checkliste',
      number: 1,
      excerpt: 'Schritt für Schritt zur perfekten Hochzeit - mit unserer detaillierten Checkliste vergessen Sie garantiert nichts Wichtiges.',
      content: 'Eine detaillierte Anleitung zur Hochzeitsplanung...',
      featured_image: '/blog-hochzeitsplanung.jpg',
      meta_title: 'Hochzeitsplanung Checkliste - DZ-Photo Blog',
      meta_description: 'Die ultimative Checkliste für Ihre Hochzeitsplanung. Schritt für Schritt zur perfekten Hochzeit.',
      focus_keywords: ['Hochzeitsplanung', 'Checkliste', 'Hochzeit planen'],
      word_count: 1200,
      published: true,
      published_at: '2024-11-20',
      created_at: '2024-11-20'
    },
    {
      id: '2',
      slug: 'beste-hochzeitslocations-oberoesterreich',
      title: 'Die 10 schönsten Hochzeitslocations in Oberösterreich',
      number: 2,
      excerpt: 'Entdecken Sie traumhafte Locations für Ihre Hochzeit - von romantischen Schlössern bis zu modernen Event-Locations.',
      content: 'Eine Übersicht der schönsten Hochzeitslocations...',
      featured_image: '/blog-locations.jpg',
      meta_title: 'Schönste Hochzeitslocations Oberösterreich - DZ-Photo',
      meta_description: 'Die 10 schönsten Hochzeitslocations in Oberösterreich für Ihre Traumhochzeit.',
      focus_keywords: ['Hochzeitslocations', 'Oberösterreich', 'Hochzeitslocation'],
      word_count: 1500,
      published: true,
      published_at: '2024-11-15',
      created_at: '2024-11-15'
    },
    {
      id: '3',
      slug: 'hochzeitsfotografie-tipps-brautpaar',
      title: 'Hochzeitsfotografie Tipps für das perfekte Brautpaar-Shooting',
      number: 3,
      excerpt: 'Wie Sie sich optimal auf Ihr Hochzeitsshooting vorbereiten und natürliche, emotionale Bilder entstehen lassen.',
      content: 'Tipps für das perfekte Brautpaar-Shooting...',
      featured_image: '/blog-fotografie-tipps.jpg',
      meta_title: 'Hochzeitsfotografie Tipps - DZ-Photo Blog',
      meta_description: 'Profi-Tipps für natürliche und emotionale Hochzeitsfotos vom erfahrenen Fotografen.',
      focus_keywords: ['Hochzeitsfotografie', 'Tipps', 'Brautpaar-Shooting'],
      word_count: 900,
      published: true,
      published_at: '2024-11-10',
      created_at: '2024-11-10'
    }
  ];

  const blogPosts = data.length > 0 ? data : fallbackPosts;

  const handlePostClick = (slug: string, title: string) => {
    // trackEvent('BlogPostClick', { 
    //   section: 'blog', 
    //   slug: slug,
    //   title: title 
    // });
  };

  const handleCTAClick = (action: string) => {
    // trackEvent('BlogCTA', { 
    //   section: 'blog', 
    //   action: action 
    // });

    if (action === 'view_all') {
      window.location.href = '/blog';
    }
  };

  const calculateReadTime = (wordCount: number): string => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} Min. Lesezeit`;
  };

  return (
    <section id="blog-preview" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-blue-500/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-gold/20 rounded-full blur-[100px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-6">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Hochzeits-Tipps</span>
          </div>
          
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Tipps & <span className="text-gold">Ratgeber</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professionelle Tipps und Ratschläge für Ihre Hochzeitsplanung - 
            von der Location-Wahl bis zur perfekten Hochzeitsfotografie.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <div className="reveal max-w-6xl mx-auto mb-16">
            <div className="reveal glass-card rounded-3xl overflow-hidden">
              <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Featured Image */}
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={getImageUrl(blogPosts[0].featured_image)}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Featured Tipp
                  </div>

                  {/* Tip Number */}
                  {blogPosts[0].number && (
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-dark-background font-bold text-lg">
                        #{blogPosts[0].number}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                    {blogPosts[0].published_at && (
                      <>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(blogPosts[0].published_at)}
                        </div>
                      </>
                    )}
                    {blogPosts[0].word_count && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {calculateReadTime(blogPosts[0].word_count)}
                        </div>
                      </>
                    )}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                    {blogPosts[0].title}
                  </h3>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {blogPosts[0].excerpt}
                  </p>

                  <Link
                    href={`/blog/${blogPosts[0].slug}`}
                    onClick={() => handlePostClick(blogPosts[0].slug, blogPosts[0].title)}
                    className="inline-flex items-center text-gold hover:text-gold-light transition-colors group text-lg font-medium"
                  >
                    <span>Tipp lesen</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogPosts.length > 1 && (
          <div className="reveal max-w-7xl mx-auto mb-16">
            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1, 4).map((post, index) => (
                <article
                  key={post.id}
                  className="reveal glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      placeholder="blur"
                      blurDataURL={defaultBlurDataURL}
                    />
                    
                    {/* Tip Number */}
                    {post.number && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          #{post.number}
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center space-x-3 text-gray-400 text-sm mb-3">
                      {post.published_at && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(post.published_at)}
                        </div>
                      )}
                      {post.word_count && post.published_at && (
                        <>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {calculateReadTime(post.word_count)}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-serif font-bold text-white mb-3 leading-tight group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <Link
                      href={`/blog/${post.slug}`}
                      onClick={() => handlePostClick(post.slug, post.title)}
                      className="inline-flex items-center text-gold hover:text-gold-light transition-colors group/link text-sm font-medium"
                    >
                      <span>Weiterlesen</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Blog Categories */}
        <div className="reveal max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-serif font-bold text-white text-center mb-8">
            Beliebte Themen
          </h3>
          
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Hochzeitsplanung', icon: Heart, count: 12 },
              { name: 'Locations', icon: BookOpen, count: 8 },
              { name: 'Fotografie-Tipps', icon: Lightbulb, count: 15 },
              { name: 'Fotobox', icon: BookOpen, count: 6 }
            ].map((category, index) => {
              const IconComponent = category.icon;
              
              return (
                <button
                  key={category.name}
                  onClick={() => handleCTAClick('category')}
                  className="reveal glass-card p-4 rounded-xl text-center hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                    <IconComponent className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-white font-medium text-sm mb-1">
                    {category.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {category.count} Tipps
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button
            variant="gold"
            size="xl"
            onClick={() => handleCTAClick('view_all')}
            className="group"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            <span>Alle Hochzeits-Tipps ansehen</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
