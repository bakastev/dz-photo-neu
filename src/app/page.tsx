import { Metadata } from 'next';
import { getHomepageData, generateHomepageSchema } from '@/lib/cms-helpers';
import SchemaOrg from '@/components/shared/SchemaOrg';
import TrackingProvider from '@/components/shared/TrackingProvider';
import ScrollRevealWrapper from '@/components/shared/ScrollRevealWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTA from '@/components/layout/FloatingCTA';
import HeroSection from '@/components/homepage/HeroSection';
import AboutSection from '@/components/homepage/AboutSection';
import ServicesSection from '@/components/homepage/ServicesSection';
import PortfolioSection from '@/components/homepage/PortfolioSection';
import FotoboxSection from '@/components/homepage/FotoboxSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import BlogSection from '@/components/homepage/BlogSection';
import FAQSection from '@/components/homepage/FAQSection';
import ContactSection from '@/components/homepage/ContactSection';

export const metadata: Metadata = {
  title: 'Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
  description: 'Professionelle Hochzeitsfotografie in Oberösterreich. Emotionale Hochzeitsreportagen, traumhafte Locations und Fotobox-Services.',
  openGraph: {
    title: 'Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
    description: 'Professionelle Hochzeitsfotografie in Oberösterreich',
    type: 'website',
    url: 'https://www.dz-photo.at',
  },
  alternates: {
    canonical: 'https://www.dz-photo.at',
  },
};

export default async function HomePage() {
  // Server-side data fetching - now fully from database
  const data = await getHomepageData();
  const schemaData = await generateHomepageSchema();

  console.log('🏠 Homepage data loaded from database:', {
    hasData: !!data,
    sections: data ? Object.keys(data).filter(k => !['portfolio', 'fotobox', 'testimonials', 'blog'].includes(k)).length : 0,
    portfolioWeddings: data?.portfolio?.weddings?.length || 0,
    portfolioLocations: data?.portfolio?.locations?.length || 0,
    fotoboxServices: data?.fotobox?.length || 0,
    blogPosts: data?.blog?.length || 0,
    reviews: data?.testimonials?.length || 0
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-background">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Fehler beim Laden der Daten</h1>
          <p className="text-gray-400">Bitte versuchen Sie es später erneut.</p>
        </div>
      </div>
    );
  }

  return (
    <TrackingProvider>
      <ScrollRevealWrapper>
        {/* Schema.org sofort im HTML */}
        <SchemaOrg data={schemaData} />
        
        <Navbar />
        
        <main>
          {/* Homepage Sections - All content from database */}
          <HeroSection data={data.hero} />
          <AboutSection data={data.about} />
          <ServicesSection data={data.services} />
          <PortfolioSection data={data.portfolio} />
          <FotoboxSection data={data.fotobox} />
          <TestimonialsSection data={data.testimonials} />
          <BlogSection data={data.blog} />
          <FAQSection data={data.faq} />
          <ContactSection data={data.contact} />
        </main>
        
        <Footer />
        <FloatingCTA />
      </ScrollRevealWrapper>
    </TrackingProvider>
  );
}
