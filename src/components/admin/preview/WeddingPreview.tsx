'use client';

import Image from 'next/image';
import { Calendar, MapPin, Heart, Camera } from 'lucide-react';
import { usePreview } from '../PreviewProvider';
import { getImageUrl } from '@/lib/utils';

export default function WeddingPreview() {
  const { previewData } = usePreview();
  
  const {
    title = 'Hochzeitstitel',
    coupleNames = 'Brautpaar',
    weddingDate,
    location = 'Location',
    description = 'Beschreibung der Hochzeit...',
    content = '',
    coverImage,
    images = [],
  } = previewData;

  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-AT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Datum';

  const coverImageUrl = coverImage ? getImageUrl(coverImage) : null;

  return (
    <div className="bg-[#0A0A0A] min-h-full text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
            <Camera className="w-24 h-24 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-gold mb-4">
              <Heart className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Hochzeit</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {coupleNames || title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>{formattedDate}</span>
              </div>
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </section>
      )}

      {/* Content Section */}
      {content && (
        <section className="py-12 px-8 bg-black/30">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:font-serif prose-headings:text-white
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {images.length > 0 && (
        <section className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">
              Galerie <span className="text-gold">Vorschau</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.slice(0, 8).map((img, index) => {
                const imgUrl = getImageUrl(img);
                return (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={`Galerie Bild ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {images.length > 8 && (
              <p className="text-center text-gray-500 mt-4">
                +{images.length - 8} weitere Bilder
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

