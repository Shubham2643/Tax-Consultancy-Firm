import { getFeatures } from '../api';
import useFetch from '../hooks/useFetch';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const { data: response, loading, error } = useFetch(getFeatures);
  const features = response?.data || [];

  const handleWhatsAppChat = () => {
    const text = 'Hello CA Team, I would like to consult with a senior partner regarding strategic tax planning and corporate compliance.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="features-section">
      {/* Glowing Gold Accent Line matching Footer */}
      <div className="features-top-accent-line"></div>

      {/* Container */}
      <div className="container features-inner-wrapper">
        {/* Section Header */}
        <div className="features-header-wrap">
          <div className="features-badge-pill">
            <span className="live-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Why Choose Us &bull; The Chartered Advantage</span>
          </div>
          <h2 className="features-main-title">Strategic Tax Precision Engineered for Your Business</h2>
          <p className="features-subtitle">
            We combine 4+ years of Accountancy expertise with proactive tax structuring to legally minimize liabilities, eliminate penalties, and ensure 100% on-time statutory compliance.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="features-bento-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: '380px', borderRadius: '20px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="features-error-card">
            <i className="fas fa-exclamation-circle"></i>
            <p>Failed to load firm advantages. Please refresh the page.</p>
          </div>
        ) : (
          <div className="features-bento-grid">
            {features.map((feature, idx) => (
              <FeatureCard key={feature._id || idx} feature={feature} index={idx} />
            ))}
          </div>
        )}

        {/* Bottom Trust Metrics & CTA Strip */}
        <div className="features-trust-ribbon">
          <div className="trust-stats-grid">
            <div className="trust-stat-box">
              <span className="trust-stat-number">4+</span>
              <span className="trust-stat-label">Years Practice &amp; Advisory</span>
            </div>
            <div className="trust-stat-box">
              <span className="trust-stat-number">200+</span>
              <span className="trust-stat-label">Active Clients</span>
            </div>
            <div className="trust-stat-box">
              <span className="trust-stat-number">500+</span>
              <span className="trust-stat-label">Successful Filings &amp; Returns</span>
            </div>
            <div className="trust-stat-box">
              <span className="trust-stat-number">100%</span>
              <span className="trust-stat-label">Notice &amp; Scrutiny Defense</span>
            </div>
          </div>

          <div className="trust-cta-row">
            <div className="trust-cta-text">
              <h4>Ready to optimize your business taxes &amp; compliance?</h4>
              <p>Get a confidential 1-on-1 review with our senior Chartered Accountants.</p>
            </div>
            <button className="btn-features-whatsapp" onClick={handleWhatsAppChat}>
              <i className="fab fa-whatsapp"></i> Chat with Senior CA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
