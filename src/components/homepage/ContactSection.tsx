'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Heart, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTracking } from '@/components/shared/TrackingProvider';

interface ContactSectionProps {
  data: {
    sectionTitle?: string;
    sectionTitleHighlight?: string;
    description?: string;
    formTitle?: string;
    serviceOptions?: Array<{ value: string; label: string }>;
    formLabels?: {
      service: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      weddingDate: string;
      location: string;
      locationPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
    };
    successMessage?: {
      title: string;
      description: string;
      buttonText: string;
    };
    contactInfo?: {
      title: string;
      phone: string;
      phoneHours: string;
      email: string;
      emailResponse: string;
      address: string;
      addressNote: string;
    };
    businessHours?: {
      title: string;
      hours: Array<{ day: string; time: string }>;
    };
    socialMedia?: {
      title: string;
      instagram: string;
      facebook: string;
    };
  };
}

export default function ContactSection({ data }: ContactSectionProps) {
  // Defaults from database
  const sectionTitle = data.sectionTitle || 'Lassen Sie uns';
  const sectionTitleHighlight = data.sectionTitleHighlight || 'sprechen';
  const description = data.description || 'Erzählen Sie mir von Ihrer Traumhochzeit!';
  const formTitle = data.formTitle || 'Unverbindliche Anfrage';
  const serviceOptions = data.serviceOptions || [
    { value: 'hochzeitsfotografie', label: 'Hochzeitsfotografie' },
    { value: 'fotobox', label: 'Fotobox Service' },
    { value: 'verlobungsshooting', label: 'Verlobungsshooting' },
    { value: 'beratung', label: 'Allgemeine Beratung' }
  ];
  const formLabels = data.formLabels || {
    service: 'Welcher Service interessiert Sie?',
    name: 'Ihr Name *',
    namePlaceholder: 'Max & Maria Mustermann',
    email: 'E-Mail Adresse *',
    emailPlaceholder: 'ihre@email.at',
    phone: 'Telefonnummer',
    phonePlaceholder: '+43 XXX XXX XXXX',
    weddingDate: 'Hochzeitsdatum',
    location: 'Hochzeitslocation',
    locationPlaceholder: 'z.B. Schloss Ort, Gmunden',
    message: 'Ihre Nachricht *',
    messagePlaceholder: 'Erzählen Sie mir von Ihrer Traumhochzeit...',
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet...'
  };
  const successMessage = data.successMessage || {
    title: 'Vielen Dank für Ihre Anfrage!',
    description: 'Ich habe Ihre Nachricht erhalten und werde mich innerhalb von 24 Stunden bei Ihnen melden.',
    buttonText: 'Neue Anfrage senden'
  };
  const contactInfo = data.contactInfo || {
    title: 'Direkter Kontakt',
    phone: '+43 XXX XXX XXX',
    phoneHours: 'Mo-Fr 9:00-18:00',
    email: 'info@dz-photo.at',
    emailResponse: 'Antwort innerhalb 24h',
    address: 'Oberösterreich, Wels & Umgebung',
    addressNote: 'Österreichweit verfügbar'
  };
  const businessHours = data.businessHours || {
    title: 'Erreichbarkeit',
    hours: [
      { day: 'Montag - Freitag', time: '9:00 - 18:00' },
      { day: 'Samstag', time: '10:00 - 16:00' },
      { day: 'Sonntag', time: 'Nach Vereinbarung' }
    ]
  };
  const socialMedia = data.socialMedia || {
    title: 'Folgen Sie mir',
    instagram: 'https://instagram.com/dzphoto',
    facebook: 'https://facebook.com/dzphoto'
  };

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
  const { trackEvent } = useTracking();

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
      trackEvent('ContactFormSubmit', { 
        section: 'contact',
        service_type: formData.service_type,
        has_wedding_date: !!formData.wedding_date,
        has_location: !!formData.location
      });

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
        trackEvent('ContactFormSuccess', { 
          section: 'contact',
          service_type: formData.service_type
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent('ContactFormError', { 
        section: 'contact',
        error: 'submission_failed'
      });
      alert('Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectContact = (type: 'phone' | 'email' | 'social') => {
    trackEvent('DirectContact', { 
      section: 'contact',
      type: type
    });
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
                {successMessage.title}
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                {successMessage.description}
              </p>
              <Button
                variant="gold"
                onClick={() => setIsSubmitted(false)}
                className="group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {successMessage.buttonText}
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
            {sectionTitle} <span className="text-gold">{sectionTitleHighlight}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="reveal max-w-7xl mx-auto">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="">
              <div className="reveal glass-card rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl font-serif font-bold text-white mb-8">
                  {formTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      {formLabels.service}
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors"
                      required
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Email */}
                  <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        {formLabels.name}
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={formLabels.namePlaceholder}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        {formLabels.email}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={formLabels.emailPlaceholder}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Wedding Date */}
                  <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        {formLabels.phone}
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={formLabels.phonePlaceholder}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        {formLabels.weddingDate}
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
                      {formLabels.location}
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder={formLabels.locationPlaceholder}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      {formLabels.message}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={formLabels.messagePlaceholder}
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
                        {formLabels.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        {formLabels.submit}
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
                    {contactInfo.title}
                  </h3>

                  <div className="space-y-6">
                    {/* Phone */}
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      onClick={() => handleDirectContact('phone')}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                        <Phone className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Telefon</div>
                        <div className="text-gold group-hover:text-gold-light transition-colors">
                          {contactInfo.phone}
                        </div>
                        <div className="text-gray-400 text-sm">{contactInfo.phoneHours}</div>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${contactInfo.email}`}
                      onClick={() => handleDirectContact('email')}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                        <Mail className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">E-Mail</div>
                        <div className="text-gold group-hover:text-gold-light transition-colors">
                          {contactInfo.email}
                        </div>
                        <div className="text-gray-400 text-sm">{contactInfo.emailResponse}</div>
                      </div>
                    </a>

                    {/* Address */}
                    <div className="flex items-start space-x-4 p-4 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Standort</div>
                        <div className="text-gray-300">{contactInfo.address}</div>
                        <div className="text-gray-400 text-sm">{contactInfo.addressNote}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="reveal glass-card rounded-2xl p-6">
                  <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gold" />
                    {businessHours.title}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {businessHours.hours.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-300">{item.day}</span>
                        <span className={item.time.includes('Vereinbarung') ? 'text-gray-400' : 'text-white'}>
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="reveal glass-card rounded-2xl p-6">
                  <h4 className="text-lg font-serif font-bold text-white mb-4">
                    {socialMedia.title}
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDirectContact('social')}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a
                      href={socialMedia.facebook}
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
