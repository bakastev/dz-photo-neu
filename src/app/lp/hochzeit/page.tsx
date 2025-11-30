import { Metadata } from 'next';
import Image from 'next/image';
import { Heart, Calendar, MapPin, Camera, CheckCircle2, Star, Award, Phone, Mail, ZoomIn } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/auth-server';
import type { Wedding } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import TrackingProvider from '@/components/shared/TrackingProvider';
import LandingPageContactForm from '@/components/shared/LandingPageContactForm';
import LandingPagePortfolioGallery from '@/components/shared/LandingPagePortfolioGallery';

export const metadata: Metadata = {
  title: 'Hochzeitsfotograf Oberösterreich 2026 | Jetzt Wunschtermin sichern',
  description: 'Professionelle Hochzeitsfotografie in Oberösterreich. 15+ Jahre Erfahrung, 200+ Hochzeiten. Kostenlose Beratung. Jetzt für 2026 anfragen!',
  openGraph: {
    title: 'Hochzeitsfotograf Oberösterreich 2026 | Daniel Zangerle',
    description: 'Professionelle Hochzeitsfotografie - Jetzt für 2026 Wunschtermin sichern',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at/lp/hochzeit',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getWeddings(): Promise<Wedding[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('wedding_date', { ascending: false })
    .limit(6); // Weniger Items für besseren Fokus

  if (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }

  return data || [];
}

// Statische Bild-URLs von der alten Landing Page
// Diese müssen manuell zu Supabase Storage hochgeladen werden
const LP_IMAGES = {
  hero: 'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-hero-DDZ_7751-scaled-1.jpg',
  portfolio: [
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DDZ_1292.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DDZ_0042-23.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR50295-scaled-1.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR52761.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR52973.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZ_6672-10.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DDZ_0106-1.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DDZ_0226-25.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZ_6740-14.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR68020-scaled-1.jpg',
  ],
  about: 'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-about-DZ_5066-2.jpg',
  reasons: [
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR50295-scaled-1.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR52761.jpg',
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DZR52973.jpg',
  ],
};

export default async function LandingPageHochzeit() {
  const weddings = await getWeddings();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Hochzeitsfotograf Oberösterreich',
    description: 'Professionelle Hochzeitsfotografie in Oberösterreich',
    url: 'https://www.dz-photo.at/lp/hochzeit',
    image: LP_IMAGES.hero,
    provider: {
      '@type': 'Person',
      name: 'Daniel Zangerle',
      jobTitle: 'Hochzeitsfotograf',
    },
  };

  return (
    <TrackingProvider>
      <ScrollRevealWrapper>
        <div className="min-h-screen bg-dark-background">
          <SchemaOrg data={schemaData} />

          {/* Hero Section - Optimized for Google Ads */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={LP_IMAGES.hero}
                alt="Hochzeitsfotografie Oberösterreich"
                fill
                priority
                className="object-cover opacity-30"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={defaultBlurDataURL}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
              <div className="reveal max-w-4xl mx-auto">
                {/* Urgency Badge */}
                <div className="inline-flex items-center space-x-2 bg-gold/20 border border-gold/50 rounded-full px-6 py-3 mb-8">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="text-white font-semibold">
                    Jetzt für 2026 Wunschtermin sichern – noch wenige Termine verfügbar
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                  Keine zweite Chance – auf{' '}
                  <span className="text-gold">einmalige Art</span> zu heiraten
                </h1>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gold mb-6">
                  Unvergessliche <span className="text-white">Momente</span> ❤️ atemberaubend festgehalten
                </h2>

                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  Eure #1 für spektakuläre Hochzeitsfotografie in Oberösterreich
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Award className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">15+ Jahre Erfahrung</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Camera className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">200+ Hochzeiten</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">Über 100 zufriedene Brautpaare</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className="inline-block bg-gold hover:bg-gold/90 text-dark-background font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Jetzt Wunschtermin anfragen
                </a>
              </div>
            </div>
          </section>

          {/* Value Proposition Section */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center reveal">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                  Eure einmalige Hochzeit verdient <span className="text-gold">spektakuläre Bilder</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  <strong className="text-gold">Stellt euch schon mal vor</strong>…wie ihr all die wunderbaren
                  Momente eurer einmaligen Hochzeit, auch in 10, 20 oder 30 Jahren{' '}
                  <strong className="text-white">nochmal erleben</strong> könnt …
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  <strong className="text-white">Auf eurer Hochzeit gibt es viele kleine Geschichten…</strong>
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mt-4">
                  Und diese müssen eingefangen und erzählt werden, sonst werden sie mit der Zeit verblassen.{' '}
                  <strong className="text-gold">Lebensecht und ungestellt,</strong> unbemerkt festgehalten, um
                  den Zauber des Moments nicht zu stören – das ist mein und{' '}
                  <strong className="text-white">unser größtes Ziel.</strong>
                </p>
              </div>

              {/* Three Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto reveal">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={LP_IMAGES.portfolio[0]}
                    alt="Hochzeitsfotografie"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                </div>
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={LP_IMAGES.portfolio[1]}
                    alt="Hochzeitsfotografie"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                </div>
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={LP_IMAGES.portfolio[2]}
                    alt="Hochzeitsfotografie"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={defaultBlurDataURL}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Three Reasons Section */}
          <section className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12 reveal">
                <p className="text-gold font-medium mb-4">Euer Hochzeitsfotograf aus Linz</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                  Drei Gründe warum ich als euer Hochzeitsfotograf eure einmalige Hochzeit begleiten sollte…
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Reason 1 */}
                <div className="glass-card rounded-2xl p-8 text-center reveal">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={LP_IMAGES.reasons[0]}
                      alt="Keine zweite Chance"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={defaultBlurDataURL}
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">
                    <strong className="text-gold">Keine zweite Chance</strong> für einmalige Erinnerungen
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Die Wahrheit ist, dieser Tag ist einmalig. Ein Hochzeitsfotograf hat die riesige
                    Verantwortung diese <strong className="text-gold">einmaligen Erinnerungen</strong> für euch
                    festzuhalten. <strong className="text-white">Ein zweite Chance gibt es nicht.</strong> Ich
                    werde dieser Verantwortung gerecht. <strong className="text-gold">Versprochen!</strong>
                  </p>
                </div>

                {/* Reason 2 */}
                <div className="glass-card rounded-2xl p-8 text-center reveal">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={LP_IMAGES.reasons[1]}
                      alt="Emotionen festhalten"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={defaultBlurDataURL}
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">
                    Emotionen festhalten, <strong className="text-gold">Liebe sichtbar machen</strong>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Was Menschen an so einem <strong className="text-gold">besonderen Tag</strong> fühlen, halte
                    ich in Bildern fest. <strong className="text-white">Meine Bilder haben einen Herzschlag.</strong>{' '}
                    Gänsehaut garantiert. Nichts anderes hat dieser Tag verdient.
                  </p>
                </div>

                {/* Reason 3 */}
                <div className="glass-card rounded-2xl p-8 text-center reveal">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={LP_IMAGES.reasons[2]}
                      alt="Hochzeit noch einmal erleben"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={defaultBlurDataURL}
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">
                    Eure Hochzeit <strong className="text-gold">noch einmal erleben</strong>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Warum sind Fotos an diesem Tag so wichtig? Ganz klar. Damit man auch{' '}
                    <strong className="text-gold">in 5, 10 oder 20 Jahren</strong> diesen besonderen Tag{' '}
                    <strong>nochmal erleben kann.</strong> Jedes Gefühl <strong>nochmal spüren</strong> kann. Um
                    nichts anderes geht es.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section - With Lightbox */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12 reveal">
                <p className="text-gold font-medium mb-4">Heiraten in Oberösterreich</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                  So könnten auch <span className="text-gold">eure Hochzeitsbilder</span> aussehen ❤️
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Lebensecht und ungestellt, unbemerkt festgehalten, um den Zauber des Moments nicht zu stören
                </p>
              </div>

              {/* Portfolio Gallery with Lightbox */}
              <LandingPagePortfolioGallery images={LP_IMAGES.portfolio} />

              {/* CTA */}
              <div className="text-center mt-12 reveal">
                <a
                  href="#contact"
                  className="inline-block bg-gold hover:bg-gold/90 text-dark-background font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Jetzt Wunschtermin anfragen
                </a>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 reveal">
                  <p className="text-gold font-medium mb-4">Daniel Zangerle</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                    Profi mit dem Gespür für eure <span className="text-gold">besonderen Momente</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
                  <div className="relative h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={LP_IMAGES.about}
                      alt="Daniel Zangerle - Hochzeitsfotograf"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={defaultBlurDataURL}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">Über mich</h3>
                    <h4 className="text-xl font-serif font-bold text-gold mb-4">
                      Einfach nur Fotos machen. Das ist nicht meins.
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      Die Hochzeitsfotografie ist eine große Leidenschaft von mir und ich blicke auf über{' '}
                      <strong className="text-gold">10 Jahre Erfahrung</strong> und{' '}
                      <strong className="text-gold">hunderte Hochzeiten</strong> zurück. Auf eurer Hochzeit bin
                      ich nicht nur jemand der Fotos schießt, sondern vor allem jemand, der die Abläufe kennt
                      und Euch jederzeit zur Seite steht. Zusammen werden wir{' '}
                      <strong className="text-white">unvergessliche Momente festhalten</strong> und an diesem
                      besonderen Tag eine gute Zeit haben.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof / Testimonials Section */}
          <section className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 reveal">
                  <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 rounded-full px-6 py-3 mb-6">
                    <Star className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">Über 100 zufriedene Brautpaare</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Das sagen <span className="text-gold">unsere Brautpaare</span>
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Hochzeitsfotografie ist Vertrauenssache. Zu wichtig ist dieser besondere Tag.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                  {/* Testimonial 1 */}
                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-gray-300 italic mb-4">
                      "Wir waren äußerst zufrieden mit dem Team von dz-photo. Angefangen von der Planung und
                      dem Ablauf der Hochzeit, war der erste Eindruck von Daniel sehr kompetent und
                      sympathisch. Das Fotografieren auf der Hochzeit war sehr unkompliziert und lustig, ein
                      großer Pluspunkt war es das 2 Fotografen anwesend waren. Die Fotos selbst sind der
                      ,,OBERHAMMER''!!! Preislich gesehen war das ganze Angebot Top. Wir werden Daniel auf
                      jeden Fall weiter empfehlen und wenn wir irgendwann wieder einen Fotografen brauchen, wird
                      er unsere erste Wahl sein"
                    </p>
                    <p className="text-gold font-semibold">— Julia & Stefan</p>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-gray-300 italic mb-4">
                      "Daniel hat uns an unserem Hochzeitstag begleitet, und ihn unvergesslich gemacht Wir
                      haben ihn auf der Hochzeitsmesse in der Tabakfabrik kennengelernt. Daniel war uns von
                      Beginn an sympathisch und somit fiel unsere Entscheidung auf ihn als Hochzeitsfotograf.
                      Während unserer Hochzeitsvorbereitungen hatte er immer ein offenes Ohr für unsere Wünsche
                      und Ideen und hat dazu beigetragen den für uns passenden Ablauf an unserem Tag zu finden.
                      Am Hochzeitstag wich der Fotograf nicht von unserer Seite und hielt den Tag in einzigartigen
                      Bildern fest. Sowohl vor der Vertragsunterzeichnung, während der Absprachen als auch nach
                      der Bezahlung hat er immer rasch auf unsere telefonischen bzw. schriftlichen Anfragen
                      reagiert. Danke für die tollen Fotos!"
                    </p>
                    <p className="text-gold font-semibold">— Claudia & Thomas</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Drei <span className="text-gold">einfache Schritte</span> um euch euren Hochzeitsfotografen
                    zu sichern
                  </h2>
                </div>

                <div className="space-y-8 reveal">
                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-dark-background font-bold text-xl">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">Wunschtermin anfragen</h3>
                        <p className="text-gray-300 mb-2">
                          Nutzt dieses <strong className="text-gold">Formular</strong> und beantwortet mir ein
                          paar <strong className="text-gold">wenige Fragen</strong> rund um eure Planung zu eurer
                          wunderbaren Hochzeit.
                        </p>
                        <p className="text-gray-400 text-sm">
                          Nach eurer Anfrage könnt ihr euch einen einen für euch{' '}
                          <strong className="text-white">passenden Telefontermin</strong> bei mir{' '}
                          <strong className="text-white">reservieren</strong>.
                        </p>
                        <p className="text-gold font-medium mt-2">Dauer: ca. 1 Minute</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-dark-background font-bold text-xl">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">Wir telefonieren</h3>
                        <p className="text-gray-300">
                          Ich rufe euch zum vereinbarten Termin an. In diesem{' '}
                          <strong className="text-gold">unverbindlichen Telefonat</strong> lernen wir uns kennen
                          und ihr erzählt mir von euch und eurer wunderbaren Hochzeit.
                        </p>
                        <p className="text-gold font-medium mt-2">Dauer: ca. 20 Minuten</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-dark-background font-bold text-xl">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">Brautpaargespräch</h3>
                        <p className="text-gray-300">
                          In diesem Termin erstellen wir gemeinsam euer{' '}
                          <strong className="text-gold">individuelles Arrangement rund um eure fotografische Begleitung.</strong>{' '}
                          Dieser Termin findet persönlich oder in einem Videotelefonat statt. Wenn alles passt,
                          habt ihr nun euren Hochzeitsfotografen gefunden.
                        </p>
                        <p className="text-gold font-medium mt-2">Dauer: ca. 60 Minuten</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section id="contact" className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl mx-auto text-center reveal">
                <p className="text-gold font-medium mb-4">JETZT WUNSCHTERMIN ANFRAGEN</p>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                  Der erste Schritt um gemeinsam atemberaubende Erinnerungen zu schaffen
                </h2>
              </div>

              <div className="max-w-2xl mx-auto mt-12 reveal">
                <LandingPageContactForm />
              </div>
            </div>
          </section>
        </div>
      </ScrollRevealWrapper>
    </TrackingProvider>
  );
}
