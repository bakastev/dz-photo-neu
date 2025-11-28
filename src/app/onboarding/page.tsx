import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OnboardingPresentation from '@/components/onboarding/OnboardingPresentation';

export const metadata: Metadata = {
  title: 'Onboarding - DZ Photo Website System',
  description: 'Willkommen zu deiner neuen Website! Erfahre mehr über die Funktionen und Benefits deines neuen Systems.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return (
    <>
      <Navbar />
      <OnboardingPresentation />
      <Footer />
    </>
  );
}

