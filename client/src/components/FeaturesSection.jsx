import { Link } from 'react-router-dom';
import { getFeatures } from '../api';
import useFetch from '../hooks/useFetch';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const DEFAULT_FEATURES = [
  {
    title: 'Maximum Legal Tax Savings',
    description: 'We proactively audit your revenue models and business structure to legally lower tax outgo under Sec 80, 44ADA, and GST input tax credits without triggering audits.',
    icon: 'fas fa-chart-line',
  },
  {
    title: 'Transparent Fixed Pricing',
    description: 'Zero hidden surprise bills, arbitrary retainers, or filing surcharges. All client engagements are scope-locked with transparent milestone disbursements upfront.',
    icon: 'fas fa-gem',
  },
  {
    title: 'Direct Senior CA Advisory',
    description: 'No junior trainee handoffs. Every account, audit, and tax notice is directly handled and vetted by seasoned Chartered Accountants with strict turnaround SLAs.',
    icon: 'fas fa-headset',
  },
];

const FeaturesSection = () => {
  const { data: response, loading, error } = useFetch(getFeatures);
  const rawFeatures = response?.data || [];
  const features = rawFeatures.length > 0 ? rawFeatures : DEFAULT_FEATURES;

  const handleWhatsAppChat = () => {
    const text = 'Hello CA Team, I would like to consult with a senior partner regarding strategic tax planning and corporate compliance.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="features-section" id="why-choose-us">
      {/* Glowing Gold Accent Line matching Footer */}
      <div className="features-top-accent-line"></div>

      {/* Architectural Background Grid Pattern */}
      <div className="features-grid-pattern" aria-hidden="true"></div>

      {/* Container */}
      <div className="container features-inner-wrapper">
        {/* Section Header */}
        <div className="features-header-wrap">
          <div className="features-badge-pill">
            <span className="live-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Why Choose Us &bull; The Chartered Advantage</span>
          </div>
          <h2 className="features-main-title">
            Strategic Tax Precision <span className="title-gradient-gold">Engineered for Your Growth</span>
          </h2>
          <p className="features-subtitle">
            We combine 4+ years of institutional Accountancy expertise with proactive tax structuring to legally minimize liabilities, eliminate penalties, and guarantee 100% on-time statutory compliance.
          </p>
        </div>

        {/* Loading State / Error State / Bento Grid */}
        {loading && rawFeatures.length === 0 ? (
          <div className="features-bento-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: '380px', borderRadius: '20px' }}></div>
            ))}
          </div>
        ) : error && rawFeatures.length === 0 ? (
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
              <div className="stat-icon-wrapper">
                <i className="fas fa-calendar-check"></i>
              </div>
              <span className="trust-stat-number">4+</span>
              <span className="trust-stat-label">Years Practice &amp; Advisory</span>
            </div>
            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fas fa-building"></i>
              </div>
              <span className="trust-stat-number">200+</span>
              <span className="trust-stat-label">Active Corporate Clients</span>
            </div>
            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <span className="trust-stat-number">500+</span>
              <span className="trust-stat-label">Tax Returns Filed</span>
            </div>
            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fas fa-shield-alt"></i>
              </div>
              <span className="trust-stat-number">99.8%</span>
              <span className="trust-stat-label">Statutory Compliance Record</span>
            </div>
          </div>

          <div className="trust-cta-row">
            <div className="trust-cta-text">
              <h4>Ready to optimize your business taxes &amp; compliance?</h4>
              <p>Get a confidential 1-on-1 review with our senior Chartered Accountants.</p>
            </div>
            <div className="trust-cta-buttons">
              <Link to="/contact" className="btn-features-primary">
                <i className="fas fa-calendar-alt"></i>
                <span>Book Free Review</span>
              </Link>
              <button className="btn-features-whatsapp" onClick={handleWhatsAppChat}>
                <i className="fab fa-whatsapp"></i>
                <span>Chat with Senior CA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
