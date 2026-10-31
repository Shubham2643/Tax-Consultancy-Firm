import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Hero.css';

const Hero = () => {
  const { settings, loading } = useSiteContext();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('all');

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
    'Hello Shree Chamunda Associates! I would like to consult regarding strategic Tax & Corporate Compliance advisory.'
  )}`;

  return (
    <section className="hero">
      {/* Top Gold Glowing Accent Divider */}
      <div className="hero-top-accent-line" aria-hidden="true"></div>

      {/* Ambient background glows */}
      <div className="hero-ambient-orb orb-primary"></div>
      <div className="hero-ambient-orb orb-secondary"></div>
      <div className="hero-ambient-orb orb-center"></div>
      <div className="hero-grid-pattern"></div>

      <div className="hero-layout-container">
        {/* LEFT COLUMN: Executive Value Narrative */}
        <div className="hero-narrative-col">
          <div className="hero-pill-badge">
            <span className="pill-dot-live"></span>
            <i className="fas fa-shield-halved"></i>
            <span>PREMIER TAX &amp; STATUTORY ADVISORY &bull; GUJARAT</span>
          </div>

          <h1 className="hero-main-title">
            Strategic Tax Precision &amp; <span className="title-gradient-accent">Seamless Compliance</span> for Growing Businesses.
          </h1>

          <p className="hero-subtext">
            Partner with dedicated senior tax advisors for corporate tax planning, GST audits, ROC filings, and dispute resolutions—ensuring zero penalties and maximum legal tax savings.
          </p>

          {/* 3 Executive Value Badges */}
          <div className="hero-trust-badges-grid">
            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon emerald">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="trust-badge-content">
                <strong>Zero-Penalty Record</strong>
                <span>99.8% Statutory Accuracy</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon gold">
                <i className="fas fa-vault"></i>
              </div>
              <div className="trust-badge-content">
                <strong>256-Bit Digital Vault</strong>
                <span>Encrypted Paperless Storage</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon sapphire">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="trust-badge-content">
                <strong>Direct Partner Desk</strong>
                <span>Senior Advisor Assigned</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons - Institutional Chambers Style */}
          <div className="hero-cta-group">
            <Link to="/contact" className="btn-hero-primary" aria-label="Schedule Partner Advisory Session">
              <span className="btn-hero-glow"></span>
              <i className="fas fa-calendar-check hero-btn-lead-icon"></i>
              <span className="hero-btn-text">Schedule Partner Advisory</span>
              <i className="fas fa-arrow-right hero-btn-trail-icon"></i>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-whatsapp"
              aria-label="Direct WhatsApp Desk with Senior Advisory Consultant"
            >
              <span className="wa-pulse-beacon"></span>
              <i className="fab fa-whatsapp hero-wa-lead-icon"></i>
              <span className="hero-wa-text">Direct WhatsApp Desk</span>
              <i className="fas fa-arrow-up-right-from-square hero-wa-trail-icon"></i>
            </a>
          </div>

          {/* Elevated Fiduciary Social Proof */}
          <div className="hero-social-proof">
            <div className="executive-avatars-stack">
              <span className="avatar-chip chip-1" title="Enterprise Client Ahmedabad">AK</span>
              <span className="avatar-chip chip-2" title="Industrial Client Surat">RP</span>
              <span className="avatar-chip chip-3" title="Corporate Client Vadodara">SM</span>
              <span className="avatar-chip chip-plus">+200</span>
            </div>
            <div className="proof-text-group">
              <div className="rating-stars-row">
                <div className="rating-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="rating-score">4.98 / 5.0</span>
              </div>
              <span className="rating-caption">
                Trusted by <strong>200+ Gujarat Businesses</strong> &bull; Zero Notice Default
              </span>
            </div>
            <div className="proof-verified-badge">
              <i className="fas fa-scale-balanced"></i>
              <span>Fiduciary Aligned</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Compliance Workspace Preview with 3D Depth */}
        <div className="hero-visual-col">
          {/* Ambient Behind-Deck Glow */}
          <div className="hero-deck-glow-orb" aria-hidden="true"></div>

          {/* Floating Satellite 1: Top-Right Senior Partner Telemetry */}
          <div className="hero-floating-satellite satellite-top">
            <div className="satellite-icon-ring gold">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="satellite-text">
              <div className="satellite-header-row">
                <span className="satellite-pulse-dot"></span>
                <strong>Senior Partner Desk</strong>
              </div>
              <span>Live Advisory &bull; &lt; 15m Confidential Triage</span>
            </div>
          </div>

          {/* Floating Satellite 2: Bottom-Left Tax Alpha Pill */}
          <div className="hero-floating-satellite satellite-bottom">
            <div className="satellite-icon-ring emerald">
              <i className="fas fa-arrow-trend-up"></i>
            </div>
            <div className="satellite-text">
              <div className="satellite-header-row">
                <span className="satellite-badge-pill">+₹2,45,000</span>
                <strong>Tax Alpha</strong>
              </div>
              <span>Sec 80JJAA &amp; Depreciation Shield</span>
            </div>
          </div>

          {/* The Main Command Deck Card */}
          <div className="hero-mockup-card">
            {/* Top 24K Gold Foil Accent Bar */}
            <div className="mockup-top-foil"></div>

            {/* Mockup Card Header */}
            <div className="mockup-header">
              <div className="mockup-brand">
                <div className="mockup-crest-wrap">
                  <img
                    src="/assets/logo_circle_full.png?v=6"
                    alt="Shree Chamunda Associates Crest"
                    className="mockup-logo-crest"
                  />
                  <span className="crest-halo-glow"></span>
                </div>
                <div className="mockup-title">
                  <span className="mockup-eyebrow">SHREE CHAMUNDA ASSOCIATES</span>
                  <strong>Client Compliance Workspace</strong>
                  <span className="mockup-sub">Live Statutory Mandates &bull; 256-Bit Cloud Vault</span>
                </div>
              </div>
              <div className="mockup-status-tag">
                <span className="status-live-beacon"></span>
                <span>Active Vault</span>
              </div>
            </div>

            {/* Interactive Workspace Filter Bar */}
            <div className="mockup-segmented-bar" role="tablist" aria-label="Compliance Workspace Views">
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('all')}
              >
                <span>All Mandates</span>
                <span className="segmented-count">4</span>
              </button>
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'tax' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('tax')}
              >
                <span>Direct Tax &amp; GST</span>
                <span className="segmented-count">2</span>
              </button>
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('audit')}
              >
                <span>Audit &amp; TDS</span>
                <span className="segmented-count">2</span>
              </button>
            </div>

            {/* Live Filing Status Tiles */}
            <div className="mockup-tiles-list">
              {/* Tile 1: GST */}
              {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'tax') && (
                <div className="mockup-tile-item fade-in">
                  <div className="tile-icon-wrapper icon-emerald">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div className="tile-details">
                    <div className="tile-title-row">
                      <strong>GSTR-3B Monthly Return</strong>
                      <span className="tile-badge-success">
                        <span className="tile-mini-beacon emerald"></span> Filed &amp; Reconciled
                      </span>
                    </div>
                    <span className="tile-meta">Tax Liability ₹0.00 &bull; Automated 2B Reconciliation</span>
                  </div>
                </div>
              )}

              {/* Tile 2: Corporate Audit */}
              {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'audit') && (
                <div className="mockup-tile-item fade-in">
                  <div className="tile-icon-wrapper icon-gold">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div className="tile-details">
                    <div className="tile-title-row">
                      <strong>Corporate Tax Audit (Sec 44AB)</strong>
                      <span className="tile-badge-in-progress">
                        <span className="tile-mini-beacon amber"></span> In Review (92%)
                      </span>
                    </div>
                    <div className="tile-progress-bar">
                      <span className="progress-fill" style={{ width: '92%' }}>
                        <span className="progress-shimmer"></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tile 3: Tax Savings Stat */}
              {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'tax') && (
                <div className="mockup-tile-item fade-in">
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
              )}

              {/* Tile 4: Advance Tax & Statutory Deadlines */}
              {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'audit') && (
                <div className="mockup-tile-item fade-in">
                  <div className="tile-icon-wrapper icon-purple">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="tile-details">
                    <div className="tile-title-row">
                      <strong>Advance Tax (Q4) &amp; TDS 26Q</strong>
                      <span className="tile-badge-scheduled">
                        <i className="fas fa-clock"></i> Scheduled (On-Time)
                      </span>
                    </div>
                    <span className="tile-meta">Pre-Computation Done &bull; Zero Default Penalty</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom 3-Metric Floating Mini Bar */}
            <div className="mockup-metrics-bar">
              <div className="metric-pill">
                <strong>4+ Yrs</strong>
                <span>Practice Heritage</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong>200+</strong>
                <span>Active Retainers</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong className="text-emerald">100%</strong>
                <span>Zero Notice Record</span>
              </div>
            </div>

            {/* Fiduciary Confidentiality & Governance Footnote */}
            <div className="mockup-footer-sync">
              <i className="fa-solid fa-shield-halved sync-shield-icon"></i>
              <span>Strict Client Privilege &bull; Governed by Fiduciary Ethics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
