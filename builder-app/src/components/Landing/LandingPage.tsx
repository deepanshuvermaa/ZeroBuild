import HeroLanding from './HeroLanding';
import FeaturesLanding from './FeaturesLanding';
import HowItWorks from './HowItWorks';
import PricingLanding from './PricingLanding';
import TestimonialsLanding from './TestimonialsLanding';
import CTALanding from './CTALanding';
import FooterLanding from './FooterLanding';

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroLanding />
      <FeaturesLanding />
      <HowItWorks />
      <PricingLanding />
      <TestimonialsLanding />
      <CTALanding />
      <FooterLanding />
    </div>
  );
}
