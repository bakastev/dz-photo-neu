'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Camera, Heart } from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '#home' },
  { name: 'Über mich', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Kontakt', href: '#contact' },
];

const separatePages = [
  { name: 'Fotobox', href: '/fotobox' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section detection for homepage
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'portfolio', 'fotobox', 'testimonials', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      // Smooth scroll to section
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isHomepage = pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-background/95 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 text-white hover:text-gold transition-colors group"
          >
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
              <Image
                src="/dz-photo-logo-white.png"
                alt="DZ-Photo Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 120px, 150px"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-xl group-hover:text-gold transition-colors">DZ-Photo</div>
              <div className="text-xs text-gray-400">Daniel Zangerle</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {isHomepage ? (
              // Ankerlinks für Homepage
              <>
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-sm font-medium transition-colors hover:text-gold ${
                      activeSection === item.href.substring(1)
                        ? 'text-gold'
                        : 'text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="w-px h-6 bg-white/20 mx-2" />
              </>
            ) : (
              // Zurück zur Homepage Link
              <Link
                href="/"
                className="text-sm font-medium text-white hover:text-gold transition-colors"
              >
                ← Zurück zur Homepage
              </Link>
            )}
            
            {/* Separate Pages */}
            {separatePages.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  pathname === item.href ? 'text-gold' : 'text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button 
              variant="gold" 
              size="lg"
              onClick={() => handleNavClick('#contact')}
              className="group"
            >
              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Jetzt anfragen
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-gold transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-dark-background/95 backdrop-blur-md border-b border-white/10">
            <div className="px-4 py-6 space-y-4">
              {isHomepage && navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left py-2 text-base font-medium transition-colors hover:text-gold ${
                    activeSection === item.href.substring(1)
                      ? 'text-gold'
                      : 'text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {!isHomepage && (
                <Link
                  href="/"
                  className="block py-2 text-base font-medium text-white hover:text-gold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  ← Zurück zur Homepage
                </Link>
              )}
              
              <div className="border-t border-white/10 pt-4">
                {separatePages.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 text-base font-medium transition-colors hover:text-gold ${
                      pathname === item.href ? 'text-gold' : 'text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full group"
                  onClick={() => handleNavClick('#contact')}
                >
                  <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Jetzt anfragen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
