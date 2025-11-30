'use client';

import { useState } from 'react';
import { Heart, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTracking } from '@/components/shared/TrackingProvider';

interface LandingPageContactFormProps {
  className?: string;
}

export default function LandingPageContactForm({ className = '' }: LandingPageContactFormProps) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    weddingdate: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trackEvent } = useTracking();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      trackEvent('LandingPageFormSubmit', { 
        has_wedding_date: !!formData.weddingdate,
        has_location: !!formData.location
      });

      const response = await fetch('/api/contact/kreativ-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        trackEvent('LandingPageFormSuccess', {});
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent('LandingPageFormError', { 
        error: 'submission_failed'
      });
      alert('Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">
            Vielen Dank für Ihre Anfrage!
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            Ich habe Ihre Nachricht erhalten und werde mich innerhalb von 24 Stunden bei Ihnen melden.
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
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Vorname *
            </label>
            <Input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="Ihr Vorname"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
              required
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">
              Nachname *
            </label>
            <Input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Ihr Nachname"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-white font-medium mb-2">
              Telefonnummer
            </label>
            <Input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="+43 XXX XXX XXXX"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
            />
          </div>
        </div>

        {/* Wedding Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Hochzeitsdatum
            </label>
            <Input
              type="date"
              name="weddingdate"
              value={formData.weddingdate}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold"
            />
          </div>
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
            rows={6}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting}
          className="w-full group"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Wird gesendet...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              <span>Jetzt Wunschtermin anfragen</span>
            </>
          )}
        </Button>

        <p className="text-gray-400 text-sm text-center">
          * Pflichtfelder • Unverbindlich • Kostenlos • Antwort innerhalb 24h
        </p>
      </form>
    </div>
  );
}

