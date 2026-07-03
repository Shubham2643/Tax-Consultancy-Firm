import { getPricing } from '../api';
import useFetch from '../hooks/useFetch';
import PricingCard from './PricingCard';
import './PricingSection.css';

const PricingSection = () => {
  const { data: response, loading, error } = useFetch(getPricing);
  const pricingPlans = response?.data || [];

  return (
    <section className="price-section">
      <div className="price-section-inner">
        <div className="section-header text-center">
          <span className="price-badge">PRICING</span>
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your business. No hidden fees, no surprises.</p>
        </div>

        {loading ? (
          <div className="price-container">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: '480px', borderRadius: '16px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load pricing plans. Please try again later.</p>
          </div>
        ) : (
          <div className="price-container">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan._id} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
