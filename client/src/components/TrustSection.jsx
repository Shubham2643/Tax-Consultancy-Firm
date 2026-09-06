import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './TrustSection.css';

const TrustSection = () => {
  const { settings, loading } = useSiteContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="trust">
        <div className="tst-container">
          <div className="trust-content">
            <div className="trust-left">
              <div className="skeleton skeleton-text" style={{ width: '40%', height: '25px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%', height: '80px', marginTop: '20px' }}></div>
              <div className="offer-list" style={{ marginTop: '20px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton skeleton-text" style={{ width: '60%', height: '20px', marginBottom: '12px' }}></div>
                ))}
              </div>
            </div>
            <div className="trust-right" style={{ marginTop: '49px' }}>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '120px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '100px', marginTop: '20px' }}></div>
              <div className="buttons" style={{ marginTop: '37px' }}>
                <div className="skeleton" style={{ width: '180px', height: '45px' }}></div>
                <div className="skeleton" style={{ width: '150px', height: '45px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const trustHeading = settings?.trustHeading || 'WHAT WE OFFER';
  const trustMainText = settings?.trustMainText || 'We believe that selecting the right financial services firm is paramount to financial success.';

  const defaultFeatureCards = [
    {
      category: 'DIRECT & INDIRECT TAX',
      title: 'Strategic Taxation Service',
      desc: 'End-to-end direct & indirect tax planning, advance tax forecasting, returns filing, and year-round advisory.',
      icon: 'fas fa-file-invoice-dollar',
      perk: 'Timely Filing Assured',
    },
    {
      category: 'STATUTORY DEFENSE',
      title: 'Tax Disputes & Scrutiny',
      desc: 'Expert representation for scrutiny notices (Sec 143/148), GST summons, appeals, and tribunal defense.',
      icon: 'fas fa-gavel',
      perk: 'Senior CA Representation',
    },
    {
      category: 'COMPLIANCE EXCELLENCE',
      title: 'Zero-Defect Quality Control',
      desc: 'Multi-tier CA audit verification ensuring 100% statutory legal compliance and zero penalty exposure.',
      icon: 'fas fa-shield-alt',
      isHighlighted: true,
      badgeText: 'CORE PILLAR',
      perk: 'Triple-Layer Verification',
    },
    {
      category: 'ICAI GOVERNANCE',
      title: 'High Standard of Integrity',
      desc: 'Transparent, fixed-fee retainers with strict adherence to ICAI chartered codes of ethics and confidentiality.',
      icon: 'fas fa-balance-scale',
      perk: 'Fixed-Fee Retainers',
    },
    {
      category: 'EXECUTIVE ADVISORY',
      title: 'Experienced CA Team',
      desc: 'Senior tax consultants and chartered accountants with deep expertise across Indian corporate laws & FEMA.',
      icon: 'fas fa-user-tie',
      perk: '15+ Yrs Avg Experience',
    },
    {
      category: '24/7 PRIORITY',
      title: '24/7 Dedicated Support',
      desc: 'Direct WhatsApp CA desk, priority turnaround within 24 hours, and live statutory filing status updates.',
      icon: 'fas fa-headset',
      perk: '<24h SLA Guarantee',
    },
  ];

  const renderTitle = (text) => {
    if (!text) return null;
    const target = 'paramount to';
    const index = text.toLowerCase().indexOf(target);
    if (index !== -1) {
      const before = text.substring(0, index);
      const highlighted = text.substring(index);
      return (
        <>
          {before}
          <span className="trust-title-highlight">{highlighted}</span>
        </>
      );
    }
    return text;
  };

  return (
    <section className="trust">
      {/* Subtle Background Lighting & Top Accent */}
      <div className="trust-top-accent-line"></div>
      <div className="trust-ambient-orb orb-gold"></div>
      <div className="trust-ambient-orb orb-blue"></div>

      <div className="tst-container">
        <div className="trust-content">
          {/* Left Column — Institutional Trust Narrative */}
          <div className="trust-left">
            <div className="trust-badge-label">
              <span className="badge-pulse-dot"></span>
              <i className="fas fa-shield-alt"></i>
              <span>{trustHeading}</span>
            </div>

            <h2 className="trust-title">{renderTitle(trustMainText)}</h2>

            <p className="trust-intro-lead">
              Direct oversight by certified Chartered Accountants, institutional-grade compliance standards, and end-to-end statutory defense tailored for Indian enterprises and growing businesses.
            </p>

            <div className="trust-pillars-list">
              <div className="trust-pillar-card">
                <div className="pillar-icon-box">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="pillar-text">
                  <h4>Confidentiality & Professional Ethics</h4>
                  <p>
                    We adhere to strict ICAI chartered standards of confidentiality and fiduciary duty, handling sensitive corporate records with bank-grade discretion.
                  </p>
                  <div className="pillar-footer-tag">
                    <i className="fas fa-lock"></i>
                    <span>100% Secure & Bank-Grade Discretion</span>
                  </div>
                </div>
              </div>

              <div className="trust-pillar-card">
                <div className="pillar-icon-box">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <div className="pillar-text">
                  <h4>Proactive Tax Planning</h4>
                  <p>
                    Forward-looking strategies anticipating regulatory shifts, optimizing allowable deductions under Indian tax laws, and preventing reactive compliance penalties.
                  </p>
                  <div className="pillar-footer-tag">
                    <i className="fas fa-check-double"></i>
                    <span>Zero Statutory Penalty Exposure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="trust-actions">
              <button className="btn-trust-primary" onClick={() => navigate('/contact')}>
                <i className="fas fa-calendar-alt"></i>
                <span>Free Consultation</span>
                <i className="fas fa-arrow-right btn-arrow"></i>
              </button>
              <button className="btn-trust-secondary" onClick={() => navigate('/about')}>
                <i className="fas fa-info-circle"></i>
                <span>More About Us</span>
              </button>
            </div>

            {/* Credibility & Social Proof Ribbon */}
            <div className="trust-social-proof">
              <div className="proof-rating">
                <div className="proof-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="proof-score">
                  <strong>4.9/5</strong> TrustScore
                </span>
              </div>
              <span className="proof-sep">&bull;</span>
              <div className="proof-badge">
                <i className="fas fa-shield-alt"></i>
                <span>
                  <strong>ICAI Certified</strong> Partner Oversight
                </span>
              </div>
            </div>
          </div>

          {/* Right Column — Bento Feature Cards */}
          <div className="trust-right">
            <div className="offer-grid">
              {defaultFeatureCards.map((card, index) => (
                <div
                  key={index}
                  className={`offer-card card-animate ${card.isHighlighted ? 'featured-card' : ''}`}
                >
                  <div className="offer-card-top-row">
                    <div className="offer-icon-box">
                      <i className={card.icon}></i>
                    </div>
                    {card.isHighlighted ? (
                      <span className="offer-featured-tag">
                        <i className="fas fa-award"></i>
                        <span>{card.badgeText}</span>
                      </span>
                    ) : (
                      <span className="offer-category-tag">{card.category}</span>
                    )}
                  </div>

                  <h3 className="offer-card-title">{card.title}</h3>
                  <p className="offer-card-desc">{card.desc}</p>

                  <div className="offer-card-perk">
                    <i className="fas fa-check-circle"></i>
                    <span>{card.perk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
