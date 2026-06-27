import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
