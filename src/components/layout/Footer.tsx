import Link from 'next/link';
import { Camera, Heart, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

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
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-background border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Camera className="w-7 h-7 text-gold" />
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-white">DZ-Photo</div>
                <div className="text-sm text-gray-400">Daniel Zangerle</div>
              </div>
            </div>
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
                    href="tel:+43XXXXXXXXX" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    +43 XXX XXX XXX
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <a 
                    href="mailto:info@dz-photo.at" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    info@dz-photo.at
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
