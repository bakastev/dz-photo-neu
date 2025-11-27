'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Heart, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { useTracking } from '@/components/shared/TrackingProvider';

interface ContactSectionProps {
  data: {
    phone: string;
    email: string;
    address: string;
    socialMedia: {
      instagram: string;
      facebook: string;
    };
  };
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    wedding_date: '',
    location: '',
    message: '',
    service_type: 'hochzeitsfotografie'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const { trackEvent } = useTracking();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track form submission
      // trackEvent('ContactFormSubmit', { 
      //   section: 'contact',
      //   service_type: formData.service_type,
      //   has_wedding_date: !!formData.wedding_date,
      //   has_location: !!formData.location
      // });

      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // trackEvent('ContactFormSuccess', { 
        //   section: 'contact',
        //   service_type: formData.service_type
        // });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // trackEvent('ContactFormError', { 
      //   section: 'contact',
      //   error: 'submission_failed'
      // });
      alert('Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectContact = (type: 'phone' | 'email' | 'social') => {
    // trackEvent('DirectContact', { 
    //   section: 'contact',
    //   type: type
    // });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="reveal max-w-2xl mx-auto text-center">
            <div className="reveal glass-card rounded-3xl p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Vielen Dank für Ihre Anfrage!
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Ich habe Ihre Nachricht erhalten und werde mich innerhalb von 24 Stunden bei Ihnen melden. 
                Freue mich darauf, mehr über Ihre Traumhochzeit zu erfahren!
              </p>
              <Button
                variant="gold"
                onClick={() => setIsSubmitted(false)}
                className="group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Neue Anfrage senden
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-dark-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-green-500/20 rounded-full blur-[100px] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="section-title font-serif font-bold mb-6 text-white">
            Lassen Sie uns <span className="text-gold">sprechen</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Erzählen Sie mir von Ihrer Traumhochzeit! Ich freue mich darauf, 
            Sie kennenzulernen und gemeinsam Ihren besonderen Tag zu planen.
          </p>
        </div>

        <div className="reveal max-w-7xl mx-auto">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="">
              <div className="reveal glass-card rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl font-serif font-bold text-white mb-8">
                  Unverbindliche Anfrage
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Welcher Service interessiert Sie?
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors"
                      required
                    >
                      <option value="hochzeitsfotografie">Hochzeitsfotografie</option>
                      <option value="fotobox">Fotobox Service</option>
                      <option value="verlobungsshooting">Verlobungsshooting</option>
                      <option value="beratung">Allgemeine Beratung</option>
                    </select>
                  </div>

                  {/* Name & Email */}
                  <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Ihr Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Max & Maria Mustermann"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        E-Mail Adresse *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ihre@email.at"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Wedding Date */}
                  <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Telefonnummer
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+43 XXX XXX XXXX"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Hochzeitsdatum
                      </label>
                      <Input
                        type="date"
                        name="wedding_date"
                        value={formData.wedding_date}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white focus:border-gold"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Hochzeitslocation
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="z.B. Schloss Ort, Gmunden"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Ihre Nachricht *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Erzählen Sie mir von Ihrer Traumhochzeit..."
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Anfrage senden
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="">
              <div className="space-y-8">
                {/* Direct Contact */}
                <div className="reveal glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-serif font-bold text-white mb-8">
                    Direkter Kontakt
                  </h3>

                  <div className="space-y-6">
                    {/* Phone */}
                    <a
                      href={`tel:${data.phone}`}
                      onClick={() => handleDirectContact('phone')}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                        <Phone className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Telefon</div>
                        <div className="text-gold group-hover:text-gold-light transition-colors">
                          {data.phone}
                        </div>
                        <div className="text-gray-400 text-sm">Mo-Fr 9:00-18:00</div>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${data.email}`}
                      onClick={() => handleDirectContact('email')}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                        <Mail className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">E-Mail</div>
                        <div className="text-gold group-hover:text-gold-light transition-colors">
                          {data.email}
                        </div>
                        <div className="text-gray-400 text-sm">Antwort innerhalb 24h</div>
                      </div>
                    </a>

                    {/* Address */}
                    <div className="flex items-start space-x-4 p-4 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Standort</div>
                        <div className="text-gray-300">{data.address}</div>
                        <div className="text-gray-400 text-sm">Österreichweit verfügbar</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="reveal glass-card rounded-2xl p-6">
                  <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gold" />
                    Erreichbarkeit
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Montag - Freitag</span>
                      <span className="text-white">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Samstag</span>
                      <span className="text-white">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sonntag</span>
                      <span className="text-gray-400">Nach Vereinbarung</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="reveal glass-card rounded-2xl p-6">
                  <h4 className="text-lg font-serif font-bold text-white mb-4">
                    Folgen Sie mir
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href={data.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDirectContact('social')}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a
                      href={data.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDirectContact('social')}
                      className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
