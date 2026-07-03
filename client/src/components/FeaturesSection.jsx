import { getFeatures } from '../api';
import useFetch from '../hooks/useFetch';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const { data: response, loading, error } = useFetch(getFeatures);
  const features = response?.data || [];

  return (
    <section className="features-section">
      <div className="section-header">
        <h2>Why Choose Our Services</h2>
        <p>Expert solutions tailored to your financial needs</p>
      </div>

      {loading ? (
        <div className="features-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" style={{ width: '360px', height: '350px' }}></div>
          ))}
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Failed to load details. Please try again later.</p>
        </div>
      ) : (
        <div className="features-container">
          {features.map((feature) => (
            <FeatureCard key={feature._id} feature={feature} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturesSection;
