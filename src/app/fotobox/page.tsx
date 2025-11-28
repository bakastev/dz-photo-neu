import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Check, Star, ArrowRight, Sparkles, Users, Clock, Gift } from 'lucide-react';
import { supabase, type FotoboxService } from '@/lib/supabase';
import { getImageUrl, defaultBlurDataURL, formatPrice } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchemaOrg from '@/components/shared/SchemaOrg';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';

export const metadata: Metadata = {
  title: 'Fotobox mieten | Hochzeit & Events | Daniel Zangerle',
  description: 'Professionelle Fotobox für Ihre Hochzeit oder Veranstaltung in Oberösterreich. Sofortdruck, digitale Galerie und unvergesslicher Spaß für Ihre Gäste.',
  openGraph: {
    title: 'Fotobox mieten | Daniel Zangerle',
    description: 'Professionelle Fotobox für Hochzeiten & Events',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at/fotobox',
  },
};

async function getFotoboxPackages(): Promise<FotoboxService[]> {
  const { data, error } = await supabase
    .from('fotobox_services')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching fotobox packages:', error);
    return [];
  }

  return data || [];
}

// Features that are included in all packages
const baseFeatures = [
  'Hochwertige DSLR-Kamera',
  'Professionelle Studiobeleuchtung',
  'Requisiten-Koffer',
  'Digitale Galerie',
  'Auf- und Abbau inklusive',
  'Technische Betreuung',
];

// Premium features
const premiumFeatures = [
  { icon: Camera, title: 'Sofortdruck', description: 'Fotos in Sekunden ausgedruckt' },
  { icon: Users, title: 'Unbegrenzte Fotos', description: 'So viele Bilder wie Sie möchten' },
  { icon: Sparkles, title: 'GIF & Video', description: 'Animierte Erinnerungen' },
  { icon: Gift, title: 'Gästebuch', description: 'Persönliche Nachrichten' },
];

export default async function FotoboxPage() {
  const packages = await getFotoboxPackages();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Fotobox mieten',
    description: 'Professionelle Fotobox für Hochzeiten und Events in Oberösterreich',
    url: 'https://www.dz-photo.at/fotobox',
    provider: {
      '@type': 'LocalBusiness',
      name: 'DZ-Photo',
      url: 'https://www.dz-photo.at',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Oberösterreich, Österreich',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fotobox Pakete',
      itemListElement: packages.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        priceCurrency: 'EUR',
      })),
    },
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
            <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[100px] z-0" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center reveal">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
                  <Camera className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Fotobox mieten</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                  Fotobox mieten – wenige Klicks zum <span className="text-gold">must-have</span> für jede Party!
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  Mietet hier eure Fotobox für die nächste Feier. Schnell, einfach und bequem. Ihr wählt ein Modell aus und wir kümmern uns um den Rest. Inklusive Lieferung, Aufbau, Einstellung, Abbau und Abholung. Lehnt euch zurück und konzentriert euch auf eure Feier, die Planung ist meist stressig genug!
                </p>

                <Link
                  href="#pakete"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <span>Pakete ansehen</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-16 reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Was macht unsere Fotobox <span className="text-gold">besonders</span>?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal mb-16">
                {premiumFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="max-w-4xl mx-auto reveal">
                <div className="glass-card rounded-3xl p-8 md:p-12">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      <strong className="text-gold">Flexibel bleiben:</strong> Bestimmt vor jedem Durchgang, welches Layout das Foto haben soll. Wählt zwischen Fotostreifen, einem großen Foto oder vier kleinen Fotos.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Direkt nach jedem Durchgang können eure Gäste die Bilder online bewundern, herunterladen, teilen und ausdrucken. Jeder Gast hat einen Code auf dem Foto, mit dem er nur sein eigenes Foto in der online Galerie einsehen kann. Ihr als Gastgeber erhaltet einen Code für die gesamte Galerie. Ein Ausdruck ist nicht genug? Kein Problem, es kann zwischen 0 – 5 Ausdrucken selbst ausgewählt werden.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Fertigt bis zu <strong className="text-gold">400 Ausdrucke (800 bei Streifen)</strong> an, ohne das Material zu wechseln. Eure Gäste müssen nicht lange auf ihre Bilder warten: In spätestens <strong className="text-gold">neun Sekunden</strong> hält jeder sein fotografisches Kunstwerk in den Händen.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      <strong className="text-gold">Unternehmen</strong> können den Fotos ihre ganz eigene Handschrift verpassen. Layouts der Fotos, Hintergrund, Ablaufbildschirm und selbst die Fotobox kann in der corporate identity des Unternehmens erstrahlen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Packages Section */}
          <section id="pakete" className="py-20 md:py-32 bg-black/30">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-16 reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Unsere <span className="text-gold">Pakete</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Wählen Sie das passende Paket für Ihre Veranstaltung
                </p>
              </div>

              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto reveal">
                  {packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`glass-card rounded-3xl overflow-hidden relative ${
                        pkg.popular ? 'ring-2 ring-gold' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Beliebt
                        </div>
                      )}

                      {/* Package Image */}
                      {pkg.cover_image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getImageUrl(pkg.cover_image)}
                            alt={pkg.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={defaultBlurDataURL}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-background to-transparent" />
                        </div>
                      )}

                      {/* Package Content */}
                      <div className="p-8">
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">
                          {pkg.name}
                        </h3>
                        
                        {pkg.description && (
                          <p className="text-gray-400 mb-6">
                            {pkg.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                          <span className="text-4xl font-bold text-gold">
                            {formatPrice(pkg.price || 0)}
                          </span>
                          {pkg.currency && (
                            <span className="text-gray-400 ml-2">
                              {pkg.currency}
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* CTA */}
                        <Link
                          href="/#kontakt"
                          className={`block w-full text-center py-4 rounded-full font-medium transition-all duration-300 ${
                            pkg.popular
                              ? 'bg-gold hover:bg-gold-light text-white'
                              : 'glass-card text-white hover:bg-gold/10'
                          }`}
                        >
                          Anfragen
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 reveal">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-4">
                    Pakete werden geladen...
                  </h3>
                </div>
              )}
            </div>
          </section>

          {/* Base Features */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="reveal">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                    In jedem Paket <span className="text-gold">enthalten</span>
                  </h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Unabhängig vom gewählten Paket erhalten Sie immer unseren 
                    Premium-Service mit professioneller Ausrüstung und persönlicher Betreuung.
                  </p>

                  <ul className="space-y-4">
                    {baseFeatures.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-4 glass-card rounded-xl p-4"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-gold" />
                        </div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="reveal">
                  <div className="glass-card rounded-3xl p-8 md:p-12">
                    <Clock className="w-12 h-12 text-gold mb-6" />
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">
                      Schnelle Verfügbarkeit
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Fragen Sie jetzt an und sichern Sie sich die Fotobox für Ihr 
                      Wunschdatum. Beliebte Termine sind schnell vergeben!
                    </p>
                    <Link
                      href="/#kontakt"
                      className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
                    >
                      <span>Verfügbarkeit prüfen</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 md:py-32 bg-black/30">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12 reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Häufige <span className="text-gold">Fragen</span>
                </h2>
              </div>

              <div className="max-w-3xl mx-auto space-y-4 reveal">
                {[
                  {
                    q: 'Wie viel Platz benötigt die Fotobox?',
                    a: 'Die Fotobox benötigt ca. 2x3 Meter Platz. Wir beraten Sie gerne vor Ort für die optimale Positionierung.',
                  },
                  {
                    q: 'Werden die Fotos auch digital bereitgestellt?',
                    a: 'Ja! Alle Fotos werden in einer Online-Galerie bereitgestellt und können von Ihren Gästen heruntergeladen werden.',
                  },
                  {
                    q: 'Kann die Fotobox auch outdoor aufgestellt werden?',
                    a: 'Bei gutem Wetter und überdachtem Bereich ist das möglich. Wir besprechen die Details gerne bei der Planung.',
                  },
                  {
                    q: 'Wie lange dauert der Auf- und Abbau?',
                    a: 'Der Aufbau dauert ca. 45-60 Minuten, der Abbau ca. 30 Minuten. Dies ist bereits im Paketpreis enthalten.',
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="glass-card rounded-2xl p-6"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-400">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center reveal">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Bereit für <span className="text-gold">unvergesslichen Spaß</span>?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Kontaktieren Sie mich jetzt und sichern Sie sich die Fotobox 
                  für Ihre Hochzeit oder Veranstaltung.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  <Camera className="w-5 h-5" />
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

