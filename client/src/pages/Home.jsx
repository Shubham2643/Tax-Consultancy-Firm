import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';

const Home = () => {
  return (
    <div className="home-page fade-in">
      <Hero />
      <TrustSection />
      <ServicesSection featured={true} />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default Home;
