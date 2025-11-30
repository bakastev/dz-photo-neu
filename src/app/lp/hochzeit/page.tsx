import { Metadata } from 'next';
import Image from 'next/image';
import { Heart, Calendar, MapPin, Camera, CheckCircle2, Star, Award, Phone, Mail } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/auth-server';
import type { Wedding } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatDate } from '@/lib/utils';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import LandingPageContactForm from '@/components/shared/LandingPageContactForm';

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

export default async function LandingPageHochzeit() {
  const weddings = await getWeddings();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Hochzeitsfotografie Oberösterreich',
    description: 'Professionelle Hochzeitsfotografie in Oberösterreich. 15+ Jahre Erfahrung, 200+ Hochzeiten.',
    url: 'https://www.dz-photo.at/lp/hochzeit',
    provider: {
      '@type': 'Person',
      name: 'Daniel Zangerle',
      jobTitle: 'Hochzeitsfotograf',
    },
    areaServed: {
      '@type': 'State',
      name: 'Oberösterreich',
    },
    serviceType: 'Hochzeitsfotografie',
  };

  return (
    <>
      <SchemaOrg data={schemaData} />
      
      <main className="min-h-screen bg-dark-background">
        <ScrollRevealWrapper>
          {/* Hero Section - Conversion Optimized */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {weddings.length > 0 && weddings[0].cover_image && (
                <Image
                  src={getImageUrl(weddings[0].cover_image)}
                  alt="Hochzeitsfotografie Oberösterreich"
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90 z-10" />
            </div>

            {/* Gold Accent Backgrounds */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gold-light/20 rounded-full blur-[100px] z-10" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
              <div className="reveal max-w-5xl mx-auto">
                {/* Trust Badges */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 animate-fadeIn">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                    <Award className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">15+ Jahre Erfahrung</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                    <Camera className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">200+ Hochzeiten</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">Kostenlose Beratung</span>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="hero-title text-white mb-6 animate-slideUp">
                  <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                    Keine zweite Chance – auf <span className="gold-gradient-text">einmalige Art</span> zu heiraten
                  </span>
                </h1>

                {/* Subheadline */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gold mb-4 font-light italic animate-slideUp">
                  Unvergessliche <span className="text-white">Momente</span> ❤️ atemberaubend festgehalten
                </h2>

                {/* Value Proposition */}
                <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed animate-slideUp">
                  Eure #1 für spektakuläre Hochzeitsfotografie in Oberösterreich
                </p>

                {/* Urgency Message */}
                <div className="bg-gold/20 backdrop-blur-sm border border-gold/40 rounded-lg px-6 py-4 mb-8 inline-block animate-fadeIn">
                  <p className="text-white font-semibold text-lg">
                    ⚡ 2026 Termine noch verfügbar – jetzt Wunschtermin sichern
                  </p>
                </div>

                {/* Scroll to Form CTA */}
                <div className="flex flex-col items-center justify-center space-y-6 mb-16 animate-slideUp">
                  <a
                    href="#kontaktformular"
                    className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-dark-background px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-gold/50 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Jetzt Wunschtermin für 2026 anfragen</span>
                  </a>
                  <p className="text-gray-300 text-sm">
                    Unverbindlich • Kostenlos • Antwort innerhalb 24h
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Value Proposition Section */}
          <section className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 reveal">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                    Drei Gründe warum ich als euer Hochzeitsfotograf eure <span className="text-gold">einmalige Hochzeit</span> begleiten sollte
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {/* Reason 1 */}
                  <div className="glass-card rounded-2xl p-8 text-center reveal">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Keine zweite Chance für einmalige Erinnerungen
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Die Wahrheit ist, dieser Tag ist einmalig. Ein Hochzeitsfotograf hat die riesige Verantwortung diese <strong className="text-gold">einmaligen Erinnerungen</strong> für euch festzuhalten. <strong>Eine zweite Chance gibt es nicht.</strong> Ich werde dieser Verantwortung gerecht. <strong className="text-gold">Versprochen!</strong>
                    </p>
                  </div>

                  {/* Reason 2 */}
                  <div className="glass-card rounded-2xl p-8 text-center reveal">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Emotionen festhalten, Liebe sichtbar machen
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Was Menschen an so einem <strong className="text-gold">besonderen Tag</strong> fühlen, halte ich in Bildern fest. <strong className="text-gold">Meine Bilder haben einen Herzschlag.</strong> Gänsehaut garantiert. Nichts anderes hat dieser Tag verdient.
                    </p>
                  </div>

                  {/* Reason 3 */}
                  <div className="glass-card rounded-2xl p-8 text-center reveal">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Eure Hochzeit noch einmal erleben
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Warum sind Fotos an diesem Tag so wichtig? Ganz klar. Damit man auch <strong className="text-gold">in 5, 10 oder 20 Jahren</strong> diesen besonderen Tag <strong>nochmal erleben kann.</strong> Jedes Gefühl <strong>nochmal spüren</strong> kann. Um nichts anderes geht es.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section - Reduced */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12 reveal">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                  So könnten auch <span className="text-gold">eure Hochzeitsbilder</span> aussehen ❤️
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Lebensecht und ungestellt, unbemerkt festgehalten, um den Zauber des Moments nicht zu stören
                </p>
              </div>

              {weddings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto reveal">
                  {weddings.slice(0, 6).map((wedding, index) => (
                    <div
                      key={wedding.id}
                      className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={getImageUrl(wedding.cover_image || '')}
                          alt={wedding.title || 'Hochzeitsreportage'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          placeholder="blur"
                          blurDataURL={defaultBlurDataURL}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                          {wedding.title}
                        </h3>
                        {wedding.couple_names && (
                          <p className="text-gold font-medium mb-3">{wedding.couple_names}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-white text-lg">Portfolio wird geladen...</p>
                </div>
              )}
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
                    <p className="text-gray-300 italic mb-6 leading-relaxed">
                      "Wir waren äußerst zufrieden mit dem Team von dz-photo. Angefangen von der Planung und dem Ablauf der Hochzeit, war der erste Eindruck von Daniel sehr kompetent und sympathisch. Das Fotografieren auf der Hochzeit war sehr unkompliziert und lustig, ein großer Pluspunkt war es das 2 Fotografen anwesend waren. Die Fotos selbst sind der OBERHAMMER!!! Preislich gesehen war das ganze Angebot Top."
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
                    <p className="text-gray-300 italic mb-6 leading-relaxed">
                      "Daniel hat uns an unserem Hochzeitstag begleitet, und ihn unvergesslich gemacht. Während unserer Hochzeitsvorbereitungen hatte er immer ein offenes Ohr für unsere Wünsche und Ideen. Am Hochzeitstag wich der Fotograf nicht von unserer Seite und hielt den Tag in einzigartigen Bildern fest."
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
                <div className="text-center mb-16 reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Drei <span className="text-gold">einfache Schritte</span> um euch euren Hochzeitsfotografen zu sichern
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                  {/* Step 1 */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-dark-background font-bold text-2xl">
                      1
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Wunschtermin anfragen
                    </h3>
                    <p className="text-gray-300">
                      Nutzt das Formular und beantwortet mir ein paar wenige Fragen rund um eure Planung. Nach eurer Anfrage könnt ihr euch einen passenden Telefontermin reservieren.
                    </p>
                    <p className="text-gold text-sm mt-2 font-semibold">Dauer: ca. 1 Minute</p>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-dark-background font-bold text-2xl">
                      2
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Wir telefonieren
                    </h3>
                    <p className="text-gray-300">
                      Ich rufe euch zum vereinbarten Termin an. In diesem unverbindlichen Telefonat lernen wir uns kennen und ihr erzählt mir von euch und eurer wunderbaren Hochzeit.
                    </p>
                    <p className="text-gold text-sm mt-2 font-semibold">Dauer: ca. 20 Minuten</p>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-dark-background font-bold text-2xl">
                      3
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-4">
                      Brautpaargespräch
                    </h3>
                    <p className="text-gray-300">
                      In diesem Termin erstellen wir gemeinsam euer individuelles Arrangement rund um eure fotografische Begleitung. Wenn alles passt, habt ihr nun euren Hochzeitsfotografen gefunden.
                    </p>
                    <p className="text-gold text-sm mt-2 font-semibold">Dauer: ca. 60 Minuten</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section - External Form */}
          <section id="kontaktformular" className="py-20 md:py-32 bg-dark-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 reveal">
                  <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 rounded-full px-6 py-3 mb-6">
                    <Heart className="w-5 h-5 text-gold" />
                    <span className="text-white font-medium">Unverbindliche Anfrage</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
                    Der erste Schritt um gemeinsam <span className="text-gold">atemberaubende Erinnerungen</span> zu schaffen
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Kostenlose Beratung • Unverbindliches Angebot • Antwort innerhalb 24 Stunden
                  </p>
                </div>

                {/* Contact Form Container */}
                <div className="glass-card rounded-3xl p-8 md:p-12 reveal">
                  <LandingPageContactForm />
                </div>

                {/* Trust Signals */}
                <div className="mt-8 text-center reveal">
                  <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Kostenlose Beratung</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Unverbindliches Angebot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Antwort innerhalb 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 md:py-32 bg-gradient-to-b from-dark-background to-black">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center reveal">
                <div className="glass-card rounded-3xl p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                    Eure einmalige Hochzeit verdient <span className="text-gold">spektakuläre Bilder</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Lassen Sie uns gemeinsam Ihre einzigartige Liebesgeschichte in unvergesslichen Bildern festhalten.
                  </p>
                  <a
                    href="#kontaktformular"
                    className="inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-dark-background px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-gold/50 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-6 h-6" />
                    <span>Jetzt Wunschtermin für 2026 anfragen</span>
                  </a>
                  <p className="text-gray-400 text-sm mt-4">
                    ⚡ Begrenzte Kapazität für 2026 – zeitnah anfragen empfohlen
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollRevealWrapper>
      </main>
    </>
  );
}

