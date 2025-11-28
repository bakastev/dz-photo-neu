import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieEinstellungenContent from '@/components/layout/CookieEinstellungenContent';

export default function CookieEinstellungenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <CookieEinstellungenContent />
      </main>
      <Footer />
    </>
  );
}

