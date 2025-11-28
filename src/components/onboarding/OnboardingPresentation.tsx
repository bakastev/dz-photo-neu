'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Database, 
  Shield, 
  Zap, 
  Search, 
  Smartphone, 
  BarChart3,
  Lock,
  Edit,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  CreditCard,
  Calendar,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPresentation() {
  const [activeSection, setActiveSection] = useState<'frontend' | 'backend' | 'admin' | null>(null);

  return (
    <div className="min-h-screen bg-dark-background text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gold-light/20 rounded-full blur-[100px] z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-white font-medium">Willkommen zu deiner neuen Website!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Deine professionelle <span className="gold-gradient-text">Hochzeitsfotografie-Website</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Modern, schnell und perfekt optimiert für deine Kunden. 
              Hier erfährst du, was dein neues System alles kann.
            </p>
          </div>
        </div>
      </section>

      {/* Three Main Sections */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Frontend Card */}
            <div 
              className={`glass-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeSection === 'frontend' ? 'ring-2 ring-gold' : ''
              }`}
              onClick={() => setActiveSection(activeSection === 'frontend' ? null : 'frontend')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
                <Globe className="w-8 h-8 text-gold" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-4 text-white">Frontend</h2>
              <p className="text-gray-300 mb-6">
                Das, was deine Kunden sehen – deine öffentliche Website
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Blitzschnell & Modern</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Deine Kunden haben eine perfekte Erfahrung, 
                      egal ob am Handy oder Desktop. Das bedeutet mehr Anfragen!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Search className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">SEO-optimiert</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Google findet dich besser. 
                      Mehr Sichtbarkeit = mehr potenzielle Kunden.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Mobile-First</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Die meisten Besucher kommen vom Handy. 
                      Deine Website sieht überall perfekt aus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Card */}
            <div 
              className={`glass-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeSection === 'backend' ? 'ring-2 ring-gold' : ''
              }`}
              onClick={() => setActiveSection(activeSection === 'backend' ? null : 'backend')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
                <Database className="w-8 h-8 text-gold" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-4 text-white">Backend</h2>
              <p className="text-gray-300 mb-6">
                Die unsichtbare Kraft – Datenbank & intelligente Systeme
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">KI-gestützt</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Deine Inhalte werden automatisch für 
                      Suchmaschinen optimiert. Weniger Arbeit, bessere Ergebnisse!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Analytics & Tracking</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Du siehst genau, was funktioniert. 
                      Welche Seiten werden am meisten besucht? Woher kommen deine Kunden?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Sicher & Zuverlässig</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Automatische Backups, keine Ausfälle. 
                      Deine Website läuft immer, auch bei viel Traffic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Card */}
            <div 
              className={`glass-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeSection === 'admin' ? 'ring-2 ring-gold' : ''
              }`}
              onClick={() => setActiveSection(activeSection === 'admin' ? null : 'admin')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
                <Edit className="w-8 h-8 text-gold" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-4 text-white">Admin-Bereich</h2>
              <p className="text-gray-300 mb-6">
                Dein Kontrollzentrum – alles selbst verwalten
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ImageIcon className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Einfaches Content-Management</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Neue Hochzeiten, Blog-Posts oder Locations 
                      hinzufügen – so einfach wie ein Word-Dokument schreiben!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Sicherer Zugang</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Nur du (und von dir autorisierte Personen) 
                      können Änderungen vornehmen. Deine Website ist geschützt.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Sofort online</h3>
                    <p className="text-sm text-gray-400">
                      Was bringt dir das? Änderungen sind sofort sichtbar. 
                      Keine Wartezeiten, keine technischen Hürden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="py-20 bg-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-white">
              Warum dieses System?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-gold mr-2" />
                  Zeitersparnis
                </h3>
                <p className="text-gray-300">
                  Keine langen Wartezeiten mehr auf deinen Webdesigner. 
                  Ändere Texte, füge Bilder hinzu oder veröffentliche neue Inhalte – 
                  alles selbst, wann immer du willst.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-gold mr-2" />
                  Professioneller Auftritt
                </h3>
                <p className="text-gray-300">
                  Deine Website sieht nicht nur modern aus, sie ist auch technisch 
                  auf dem neuesten Stand. Das merken Suchmaschinen und deine Kunden.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-gold mr-2" />
                  Skalierbar
                </h3>
                <p className="text-gray-300">
                  Egal ob 10 oder 10.000 Besucher pro Tag – deine Website bleibt 
                  schnell und zuverlässig. Wachse ohne technische Sorgen.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-gold mr-2" />
                  Zukunftssicher
                </h3>
                <p className="text-gray-300">
                  Modernste Technologie bedeutet: Deine Website bleibt auch in 
                  den nächsten Jahren aktuell. Keine teuren Neuentwicklungen nötig.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Payment */}
      <section className="py-20 bg-gradient-to-b from-dark-surface to-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-12">
              <div className="flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6 mx-auto">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                Bereit loszulegen?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Nach der Zahlung machen wir gemeinsam einen <strong className="text-gold">Kickoff-/Setup Call</strong>, 
                bei dem ich dir alles Schritt für Schritt zeige und wir deine Website 
                gemeinsam einrichten.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span>Terminvereinbarung über WhatsApp</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  <span>Persönliche Einführung in alle Funktionen</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gold" />
                  <span>Support bei der ersten Einrichtung</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="https://payment-links.mollie.com/payment/yoj63UgbfZebPmdX7uH5b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant="gold" 
                    size="xl"
                    className="w-full sm:w-auto text-lg py-6 px-8 group"
                  >
                    <CreditCard className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Jetzt Zahlung abschließen
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                
                <p className="text-sm text-gray-400 mt-4">
                  Sichere Zahlung über Mollie. Nach erfolgreicher Zahlung erhältst du 
                  eine Bestätigung und wir vereinbaren den Setup-Call.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-300 mb-4">
                  Fragen vorab? Terminvereinbarung für den Setup-Call?
                </p>
                <a
                  href="https://wa.me/436641234567?text=Hallo!%20Ich%20habe%20Fragen%20zu%20meiner%20neuen%20Website%20oder%20möchte%20einen%20Setup-Call%20vereinbaren."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gold hover:text-gold-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Schreib mir auf WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

