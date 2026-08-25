import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Hero.css';

const Hero = () => {
  const { settings, loading } = useSiteContext();

  if (loading) {
    return (
      <section className="hero skeleton-hero">
        <div className="container hero-content">
          <div className="skeleton skeleton-title" style={{ margin: '0 auto 20px', width: '50%' }}></div>
          <div className="skeleton skeleton-text" style={{ margin: '0 auto 30px', width: '70%', height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ margin: '0 auto 25px', width: '90%', height: '60px' }}></div>
          <div className="skeleton" style={{ margin: '30px auto 0', width: '150px', height: '50px', borderRadius: '24px' }}></div>
        </div>
      </section>
    );
  }

  const phone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hello Shree Chamunda Associates! I would like to consult with a Chartered Accountant regarding Tax & Compliance services.'
  )}`;

  return (
    <section className="hero">
      {/* Ambient background glows */}
      <div className="hero-ambient-orb orb-primary"></div>
      <div className="hero-ambient-orb orb-secondary"></div>
      <div className="hero-grid-pattern"></div>

      <div className="hero-layout-container">
        {/* LEFT COLUMN: Executive Value Narrative */}
        <div className="hero-narrative-col">
          <div className="hero-pill-badge">
            <span className="pill-dot-live"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Premier Chartered Tax Advisory &bull; Gujarat</span>
          </div>

          <h1 className="hero-main-title">
            Strategic Tax Advisory &amp; <span className="title-gradient-accent">Seamless Compliance</span> for Growing Businesses.
          </h1>

          <p className="hero-subtext">
            Partner with dedicated Chartered Accountants for corporate tax planning, GST audits, ROC filings, and dispute resolutions—ensuring zero penalties and maximum legal tax savings.
          </p>

          {/* 3 Trust Checkmarks */}
          <div className="hero-trust-bullets">
            <div className="trust-bullet-item">
              <i className="fas fa-check-circle"></i>
              <span>Zero-Penalty Track Record (99.8% Precision)</span>
            </div>
            <div className="trust-bullet-item">
              <i className="fas fa-check-circle"></i>
              <span>100% Paperless Digital Filing Vault</span>
            </div>
            <div className="trust-bullet-item">
              <i className="fas fa-check-circle"></i>
              <span>Dedicated Senior CA Advisor Assigned</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="hero-cta-group">
            <Link to="/contact" className="btn-hero-primary">
              <i className="fas fa-calendar-check"></i>
              <span>Book Free Consultation</span>
              <i className="fas fa-arrow-right btn-icon-arrow"></i>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-whatsapp"
              aria-label="Direct WhatsApp Consultation"
            >
              <span className="wa-live-dot"></span>
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp Advisory</span>
            </a>
          </div>

          {/* Trust Rating Strip */}
          <div className="hero-social-proof">
            <div className="rating-stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <span className="rating-caption">
              Trusted by <strong>250+ Gujarat Businesses</strong> &bull; <strong>4.9/5 Rating</strong>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Compliance Workspace Preview */}
        <div className="hero-visual-col">
          <div className="hero-mockup-card">
            {/* Mockup Card Header */}
            <div className="mockup-header">
              <div className="mockup-brand">
                <img src="/assets/logo_new.jpg?v=3" alt="Shree Chamunda Logo" className="mockup-logo" />
                <div className="mockup-title">
                  <strong>Shree Chamunda Workspace</strong>
                  <span>Client Compliance Dashboard</span>
                </div>
              </div>
              <div className="mockup-status-tag">
                <span className="status-live-beacon"></span>
                <span>Active Vault</span>
              </div>
            </div>

            {/* Live Filing Status Tiles */}
            <div className="mockup-tiles-list">
              {/* Tile 1: GST */}
              <div className="mockup-tile-item">
                <div className="tile-icon-wrapper icon-emerald">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <div className="tile-details">
                  <div className="tile-title-row">
                    <strong>GSTR-3B Monthly Return</strong>
                    <span className="tile-badge-success">
                      <i className="fas fa-check"></i> Filed &amp; Reconciled
                    </span>
                  </div>
                  <span className="tile-meta">Tax Liability ₹0.00 &bull; Verified by Senior Auditor</span>
                </div>
              </div>

              {/* Tile 2: Corporate Audit */}
              <div className="mockup-tile-item">
                <div className="tile-icon-wrapper icon-gold">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="tile-details">
                  <div className="tile-title-row">
                    <strong>Corporate Tax Audit (Sec 44AB)</strong>
                    <span className="tile-badge-in-progress">In Review (92%)</span>
                  </div>
                  <div className="tile-progress-bar">
                    <span className="progress-fill" style={{ width: '92%' }}></span>
                  </div>
                </div>
              </div>

              {/* Tile 3: Tax Savings Stat */}
              <div className="mockup-tile-item">
                <div className="tile-icon-wrapper icon-blue">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="tile-details">
                  <div className="tile-title-row">
                    <strong>Tax Optimization Saved</strong>
                    <span className="tile-badge-saving">+₹2,45,000</span>
                  </div>
                  <span className="tile-meta">Claimed Sec 80JJAA &amp; Depreciations legally</span>
                </div>
              </div>
            </div>

            {/* Bottom 3-Metric Floating Mini Bar */}
            <div className="mockup-metrics-bar">
              <div className="metric-pill">
                <strong>4+ Yrs</strong>
                <span>Experience</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong>250+</strong>
                <span>Active Clients</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong className="text-emerald">100%</strong>
                <span>Audit Legal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
