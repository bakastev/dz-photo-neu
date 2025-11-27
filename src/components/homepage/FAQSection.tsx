'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/components/shared/TrackingProvider';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  data: FAQItem[];
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const { trackEvent } = useTracking();

  // Fallback FAQ data
  const fallbackFAQs: FAQItem[] = [
    {
      question: 'Wie weit im Voraus sollte ich buchen?',
      answer: 'Idealerweise sollten Sie 6-12 Monate vor Ihrem Hochzeitstermin buchen, besonders für beliebte Termine wie Samstage im Sommer. Für spontane Anfragen bin ich aber auch gerne da - kontaktieren Sie mich einfach!',
      category: 'Buchung'
    },
    {
      question: 'Was ist in meinem Hochzeitspaket enthalten?',
      answer: 'Meine Hochzeitspakete beinhalten die ganztägige Begleitung (von den Vorbereitungen bis zum Hochzeitstanz), professionelle Nachbearbeitung aller Bilder, eine Online-Galerie für Sie und Ihre Gäste, sowie eine Auswahl der schönsten Momente als hochauflösende Downloads.',
      category: 'Leistungen'
    },
    {
      question: 'Können wir ein Verlobungsshooting machen?',
      answer: 'Ja, sehr gerne! Ein Verlobungsshooting ist eine perfekte Gelegenheit, sich vor der Hochzeit kennenzulernen und entspannt vor der Kamera zu sein. Außerdem können wir die Bilder für Save-the-Date Karten oder Einladungen verwenden.',
      category: 'Shootings'
    },
    {
      question: 'Wie lange dauert die Bildbearbeitung?',
      answer: 'In der Regel erhalten Sie Ihre fertig bearbeiteten Bilder 2-4 Wochen nach der Hochzeit. Bei besonderen Terminen oder in der Hochsaison kann es etwas länger dauern - ich informiere Sie aber immer über den aktuellen Stand.',
      category: 'Nachbearbeitung'
    },
    {
      question: 'Arbeiten Sie auch außerhalb von Oberösterreich?',
      answer: 'Ja, ich fotografiere gerne auch in ganz Österreich und darüber hinaus. Für Hochzeiten außerhalb von Oberösterreich berechne ich zusätzlich die Anfahrtskosten - diese besprechen wir gerne individuell.',
      category: 'Anfahrt'
    },
    {
      question: 'Was passiert bei schlechtem Wetter?',
      answer: 'Schlechtes Wetter ist kein Problem! Ich habe immer einen Plan B und kenne viele überdachte Locations. Oft entstehen bei Regen oder bewölktem Himmel sogar besonders romantische und stimmungsvolle Bilder.',
      category: 'Wetter'
    },
    {
      question: 'Können wir die Bilder auch für Social Media nutzen?',
      answer: 'Selbstverständlich! Sie erhalten alle Bilder in hoher Auflösung und können diese für private Zwecke, Social Media und Ihre Hochzeitswebsite frei verwenden. Ich freue mich sogar über eine Verlinkung!',
      category: 'Nutzungsrechte'
    },
    {
      question: 'Wie funktioniert die Fotobox?',
      answer: 'Unsere Fotobox ist kinderleicht zu bedienen! Ihre Gäste können selbstständig Fotos machen, die sofort ausgedruckt werden. Gleichzeitig werden alle Bilder in einer Online-Galerie gesammelt, die Sie nach der Hochzeit erhalten.',
      category: 'Fotobox'
    }
  ];

  const faqs = data.length > 0 ? data : fallbackFAQs;

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const isOpen = prev.includes(index);
      
      trackEvent('FAQToggle', { 
        section: 'faq', 
        question_index: index,
        question: faqs[index].question,
        action: isOpen ? 'close' : 'open'
      });

      if (isOpen) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleContactClick = () => {
    trackEvent('CTAClick', { 
      section: 'faq', 
      type: 'contact' 
    });

    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(faq => faq.category || 'Allgemein')));
  const groupedFAQs = categories.map(category => ({
    category,
    items: faqs.filter(faq => (faq.category || 'Allgemein') === category)
  }));

  return (
    <section id="faq" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gold/20 rounded-full blur-[100px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Häufige Fragen</span>
          </div>
          
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Fragen & <span className="text-gold">Antworten</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Die wichtigsten Fragen rund um Hochzeitsfotografie und unsere Services - 
            schnell und übersichtlich beantwortet.
          </p>
        </div>

        <div className="reveal max-w-4xl mx-auto">
          {/* FAQ Categories */}
          {groupedFAQs.map((group, groupIndex) => (
            <div key={group.category} className="mb-12">
              {categories.length > 1 && (
                <h3 className="text-xl font-serif font-bold text-gold mb-6 text-center">
                  {group.category}
                </h3>
              )}
              
              <div className="space-y-4">
                {group.items.map((faq, itemIndex) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div
                      key={globalIndex}
                      className="reveal glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4 leading-relaxed">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-gold" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen 
                            ? 'max-h-96 opacity-100' 
                            : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-white/10 pt-4">
                            <p className="text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Stats */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="reveal glass-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gold" />
              </div>
              <div className="text-2xl font-bold text-gold mb-2">24h</div>
              <div className="text-gray-300">Antwortzeit</div>
            </div>
            
            <div className="reveal glass-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <Phone className="w-8 h-8 text-gold" />
              </div>
              <div className="text-2xl font-bold text-gold mb-2">100%</div>
              <div className="text-gray-300">Erreichbarkeit</div>
            </div>
            
            <div className="reveal glass-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-gold" />
              </div>
              <div className="text-2xl font-bold text-gold mb-2">∞</div>
              <div className="text-gray-300">Beratung</div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="reveal glass-card rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Ihre Frage ist nicht dabei?
              </h3>
              <p className="text-gray-300 mb-6">
                Kein Problem! Kontaktieren Sie mich gerne direkt - ich beantworte 
                alle Ihre Fragen rund um Hochzeitsfotografie und unsere Services.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleContactClick}
                  className="group min-w-[200px]"
                >
                  <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Nachricht senden
                </Button>
                
                <Button
                  variant="gold-outline"
                  size="lg"
                  onClick={() => {
                    trackEvent('CTAClick', { section: 'faq', type: 'phone' });
                    window.location.href = 'tel:+43XXXXXXXXX';
                  }}
                  className="min-w-[200px]"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Anrufen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

