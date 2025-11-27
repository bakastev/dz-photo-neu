'use client';

import Image from 'next/image';
import { Heart, Camera, MapPin, Award, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/components/shared/TrackingProvider';

interface AboutSectionProps {
  data?: any;
}

export default function AboutSection({ data }: AboutSectionProps) {
  const { trackEvent } = useTracking();

  const handleContactClick = () => {
    trackEvent('CTAClick', { 
      section: 'about', 
      type: 'contact',
      button_text: 'Jetzt kennenlernen' 
    });

    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Gold Radial Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gold/30 rounded-full blur-[120px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Main Intro */}
        <div className="reveal max-w-4xl mx-auto text-center mb-16">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Über <span className="text-gold">Daniel Zangerle</span>
          </h2>
          
          {/* Quick Answer Box */}
          <div className="rapid-response mb-8 p-6 bg-gold/10 rounded-2xl border-2 border-gold/20 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              <strong className="text-gold">Quick Answer:</strong> Professioneller Hochzeitsfotograf aus Oberösterreich mit über 15 Jahren Erfahrung. Spezialisiert auf emotionale Hochzeitsreportagen, Locations und Fotobox-Services.
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            Mein Name ist Daniel Zangerle und ich bin leidenschaftlicher Hochzeitsfotograf aus Oberösterreich. 
            Seit über 15 Jahren halte ich die schönsten Momente von Hochzeiten fest und begleite Paare an ihrem besonderen Tag.
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Meine Philosophie: Authentische Emotionen einfangen, ohne zu stören. Jede Hochzeit ist einzigartig - 
            genau wie die Bilder, die dabei entstehen.
          </p>
        </div>

        {/* Detailed Content */}
        <div className="reveal max-w-6xl mx-auto">
          <div className="reveal glass-card rounded-3xl p-8 md:p-12">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <Image 
                    src="https://www.dz-photo.at/wp-content/uploads/DDZ_0039.jpg" 
                    alt="Daniel Zangerle - Hochzeitsfotograf"
                    width={600}
                    height={700}
                    className="w-full rounded-2xl shadow-2xl"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
                  />
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-light/30 rounded-full blur-lg" />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl md:text-4xl font-serif font-bold mb-8 text-white">
                  Meine Geschichte
                </h3>
                <div className="prose prose-lg max-w-none text-gray-300 space-y-6">
                  <p>
                    Was als Hobby begann, wurde schnell zur Leidenschaft. Nach meiner Ausbildung zum 
                    professionellen Fotografen habe ich mich auf Hochzeitsfotografie spezialisiert.
                  </p>
                  <p>
                    Heute darf ich Paare in ganz Oberösterreich an ihrem schönsten Tag begleiten - 
                    von der Vorbereitung bis zum letzten Tanz. Jede Hochzeit erzählt ihre eigene Geschichte, 
                    und ich sorge dafür, dass diese Geschichte in Bildern für die Ewigkeit festgehalten wird.
                  </p>
                  <p>
                    Mein Ansatz ist unaufdringlich und natürlich. Ich arbeite im Hintergrund und fange 
                    die spontanen, emotionalen Momente ein, die Ihre Hochzeit so besonders machen.
                  </p>
                </div>
                
                <div className="mt-8">
                  <Button 
                    variant="gold" 
                    size="lg"
                    onClick={handleContactClick}
                    className="group"
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Jetzt kennenlernen
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center liquid-glass-icon">
                <Heart className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Über 15 Jahre Erfahrung</h4>
              <p className="text-gray-300">Hunderte von Hochzeiten dokumentiert und dabei immer die perfekten Momente eingefangen.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center liquid-glass-icon">
                <Camera className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Professionelle Ausrüstung</h4>
              <p className="text-gray-300">Modernste Kamera- und Lichttechnik für perfekte Ergebnisse bei jedem Wetter.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center liquid-glass-icon">
                <MapPin className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Oberösterreich & Umgebung</h4>
              <p className="text-gray-300">Flexibel in ganz Österreich unterwegs - ich kenne die schönsten Locations.</p>
            </div>
          </div>

          {/* Stats & Achievements */}
          <div className="mt-16 glass-card rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-white text-center">
              Warum Paare mir vertrauen
            </h3>
            
            <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-gold mr-2" />
                  <span className="text-3xl font-bold text-gold">200+</span>
                </div>
                <p className="text-gray-300">Hochzeiten fotografiert</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gold mr-2" />
                  <span className="text-3xl font-bold text-gold">100%</span>
                </div>
                <p className="text-gray-300">Zufriedene Paare</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-gold mr-2" />
                  <span className="text-3xl font-bold text-gold">15+</span>
                </div>
                <p className="text-gray-300">Jahre Erfahrung</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-gold mr-2" />
                  <span className="text-3xl font-bold text-gold">∞</span>
                </div>
                <p className="text-gray-300">Leidenschaft</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
