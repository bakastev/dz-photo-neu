'use client';

import Image from 'next/image';
import { MapPin, Users, Star, Camera, Navigation } from 'lucide-react';
import { usePreview } from '../PreviewProvider';
import { getImageUrl } from '@/lib/utils';

export default function LocationPreview() {
  const { previewData } = usePreview();
  
  const {
    name = 'Location Name',
    city = '',
    region = '',
    address = '',
    description = 'Beschreibung der Location...',
    content = '',
    coverImage,
    images = [],
    features = [],
    capacityMin,
    capacityMax,
    latitude,
    longitude,
  } = previewData;

  const coverImageUrl = coverImage ? getImageUrl(coverImage) : null;
  const locationString = [city, region].filter(Boolean).join(', ');

  return (
    <div className="bg-[#0A0A0A] min-h-full text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={name}
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
              <MapPin className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Location</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {name}
            </h1>
            {locationString && (
              <div className="flex items-center gap-2 text-gray-300">
                <Navigation className="w-5 h-5 text-gold" />
                <span>{locationString}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-8 px-8 -mt-16 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {(capacityMin || capacityMax) && (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-white font-semibold">
                {capacityMin && capacityMax 
                  ? `${capacityMin} - ${capacityMax}`
                  : capacityMax || capacityMin
                }
              </p>
              <p className="text-gray-500 text-sm">Kapazität</p>
            </div>
          )}
          {latitude && longitude && (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
              <MapPin className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
              <p className="text-gray-500 text-sm">Koordinaten</p>
            </div>
          )}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
            <Star className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-white font-semibold">Premium</p>
            <p className="text-gray-500 text-sm">Location</p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Über diese <span className="text-gold">Location</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-12 px-8 bg-black/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Ausstattung & <span className="text-gold">Features</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#141414] border border-white/10 rounded-full text-gray-300 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      {content && (
        <section className="py-12 px-8">
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
        <section className="py-12 px-8 bg-black/30">
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

      {/* Address */}
      {address && (
        <section className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Adresse</h3>
              <p className="text-gray-400">{address}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

