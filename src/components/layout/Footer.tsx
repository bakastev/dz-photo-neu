import Link from 'next/link';
import Image from 'next/image';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const quickLinks = [
  { name: 'Über mich', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Kontakt', href: '#contact' },
];

const services = [
  { name: 'Hochzeitsfotografie', href: '/hochzeit' },
  { name: 'Locations', href: '/locations' },
  { name: 'Fotobox Services', href: '/fotobox' },
  { name: 'Blog & Tipps', href: '/blog' },
];

const legal = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'AGB', href: '/agb' },
  { name: 'Cookie-Einstellungen', href: '/cookie-einstellungen' },
];

async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('contact_email, contact_phone')
      .single();

    if (error) {
      console.error('Error fetching site settings:', error);
      return {
        contact_email: 'info@dz-photo.at',
        contact_phone: '+43 664 123 4567',
      };
    }

    return {
      contact_email: data?.contact_email || 'info@dz-photo.at',
      contact_phone: data?.contact_phone || '+43 664 123 4567',
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      contact_email: 'info@dz-photo.at',
      contact_phone: '+43 664 123 4567',
    };
  }
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <footer className="bg-dark-background border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="inline-block mb-6 group"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 group-hover:scale-105 transition-transform">
                <Image
                  src="/dz-photo-logo-white.png"
                  alt="DZ-Photo Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 96px, 112px"
                />
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Professionelle Hochzeitsfotografie in Oberösterreich. 
              Emotionale Momente, die ein Leben lang bleiben.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/dzphoto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/20 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/dzphoto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/20 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-6">Kontakt</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <a 
                    href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <a 
                    href={`mailto:${settings.contact_email}`}
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">
                    Oberösterreich<br />
                    Wels & Umgebung
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Daniel Zangerle - DZ-Photo. Alle Rechte vorbehalten.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-gold transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Made with Love */}
          <div className="text-center mt-6 pt-6 border-t border-white/5">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              Erstellt mit <Heart className="w-4 h-4 text-gold mx-2" /> für unvergessliche Momente
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
