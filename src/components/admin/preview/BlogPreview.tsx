'use client';

import Image from 'next/image';
import { Calendar, Tag, Clock, Camera, BookOpen } from 'lucide-react';
import { usePreview } from '../PreviewProvider';
import { getImageUrl } from '@/lib/utils';

export default function BlogPreview() {
  const { previewData } = usePreview();
  
  const {
    title = 'Blog-Titel',
    excerpt = '',
    content = '<p>Ihr Blog-Inhalt erscheint hier...</p>',
    featuredImage,
    coverImage,
    category = '',
    tags = [],
    publishedAt,
  } = previewData;

  const imageUrl = featuredImage || coverImage;
  const resolvedImageUrl = imageUrl ? getImageUrl(imageUrl) : null;

  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('de-AT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('de-AT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  // Estimate reading time (200 words per minute)
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-[#0A0A0A] min-h-full text-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px]">
        {resolvedImageUrl ? (
          <Image
            src={resolvedImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-3xl mx-auto">
            {category && (
              <div className="flex items-center gap-2 text-gold mb-4">
                <Tag className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wider">{category}</span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>{readingTime} Min. Lesezeit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excerpt */}
      {excerpt && (
        <section className="py-8 px-8 border-b border-white/10">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed italic">
              {excerpt}
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <article className="py-12 px-8">
        <div className="max-w-3xl mx-auto">
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
              prose-img:rounded-xl prose-img:shadow-lg
              prose-code:bg-[#1a1a1a] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-gold
              prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-white/10"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      {/* Tags */}
      {tags.length > 0 && (
        <section className="py-8 px-8 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#141414] border border-white/10 rounded-full text-gray-300 text-sm hover:border-gold/50 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Author Section (Static for preview) */}
      <section className="py-12 px-8 bg-black/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960F] flex items-center justify-center text-white font-bold text-xl">
              DZ
            </div>
            <div>
              <p className="text-white font-semibold">Daniel Zangerle</p>
              <p className="text-gray-500 text-sm">Hochzeitsfotograf</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

