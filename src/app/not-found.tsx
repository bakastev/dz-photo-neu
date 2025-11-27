import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-32">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Number */}
            <div className="relative mb-8">
              <span className="text-[150px] md:text-[200px] font-serif font-bold text-gold/10 leading-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-20 h-20 text-gold" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Seite nicht gefunden
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8">
              Die gesuchte Seite existiert leider nicht oder wurde verschoben. 
              Vielleicht finden Sie was Sie suchen auf einer dieser Seiten:
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Link
                href="/"
                className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group"
              >
                <Home className="w-8 h-8 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Startseite</span>
              </Link>
              
              <Link
                href="/hochzeit"
                className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-2xl mb-3 block">💒</span>
                <span className="text-white font-medium">Hochzeiten</span>
              </Link>
              
              <Link
                href="/locations"
                className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-2xl mb-3 block">📍</span>
                <span className="text-white font-medium">Locations</span>
              </Link>
              
              <Link
                href="/blog"
                className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-2xl mb-3 block">📝</span>
                <span className="text-white font-medium">Blog</span>
              </Link>
            </div>

            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück zur Startseite</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

