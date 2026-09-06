import { useState } from 'react';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    const elem = document.getElementById('services-section');
    if (elem) {
      const yOffset = -80;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page fade-in">
      <Hero />
      <TrustSection onSelectCategory={handleSelectCategory} />
      <ServicesSection
        featured={true}
        activeFilter={selectedCategory}
        onFilterChange={setSelectedCategory}
      />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default Home;
