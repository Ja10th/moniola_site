import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PhilosophySection from './components/PhilosophySection';
import TestimonialsSection from './components/TestimonialsSection';
import StatsSection from './components/StatsSection';
import ResultCheckerSection from './components/ResultCheckerSection';
import FAQSection from './components/FAQSection';
import SiteFooter from './components/SiteFooter';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PhilosophySection />
      <TestimonialsSection />
      <StatsSection />
      <ResultCheckerSection />
      <FAQSection />
      <SiteFooter />
    </>
  );
}
