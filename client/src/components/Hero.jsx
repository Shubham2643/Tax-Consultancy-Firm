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
                <strong className="badge-title">
                  <span className="badge-full">Zero-Penalty Record</span>
                  <span className="badge-mob">Zero Penalty</span>
                </strong>
                <span className="badge-subtitle">99.8% Statutory Accuracy</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon gold">
                <i className="fas fa-file-contract"></i>
              </div>
              <div className="trust-badge-content">
                <strong className="badge-title">
                  <span className="badge-full">Mutual NDA &amp; Secrecy</span>
                  <span className="badge-mob">Mutual NDA</span>
                </strong>
                <span className="badge-subtitle">100% Fiduciary Client Privilege</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon sapphire">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="trust-badge-content">
                <strong className="badge-title">
                  <span className="badge-full">Direct Partner Desk</span>
                  <span className="badge-mob">Partner Desk</span>
                </strong>
                <span className="badge-subtitle">Senior Advisor Assigned</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons - Institutional Chambers Style */}
          <div className="hero-cta-group">
            <Link to="/contact" className="btn-hero-primary" aria-label="Schedule Partner Advisory Session">
              <i className="fa-solid fa-calendar-check hero-btn-lead-icon"></i>
              <span className="hero-btn-text">Schedule Partner Advisory</span>
              <i className="fa-solid fa-arrow-right hero-btn-trail-icon"></i>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-whatsapp"
              aria-label="Direct WhatsApp Desk with Senior Advisory Consultant"
            >
              <i className="fa-brands fa-whatsapp hero-wa-lead-icon"></i>
              <span className="hero-wa-text">Direct WhatsApp Chat</span>
            </a>
          </div>

          {/* Elevated Executive Fiduciary Social Proof Strip */}
          <div className="hero-social-proof" role="region" aria-label="Institutional Trust and Compliance Record">
            <div className="proof-seal-medallion" aria-hidden="true">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="proof-content-wrap">
              <div className="proof-metric-row">
                <div className="proof-stars" aria-label="Rated 4.98 out of 5 stars">
                  <i className="fa-solid fa-star" aria-hidden="true"></i>
                  <i className="fa-solid fa-star" aria-hidden="true"></i>
                  <i className="fa-solid fa-star" aria-hidden="true"></i>
                  <i className="fa-solid fa-star" aria-hidden="true"></i>
                  <i className="fa-solid fa-star" aria-hidden="true"></i>
                </div>
                <span className="proof-score"><strong>4.98</strong> / 5.0</span>
                <span className="proof-sep" aria-hidden="true">&bull;</span>
                <span className="proof-fiduciary-tag">
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                  <span>Fiduciary Aligned</span>
                </span>
              </div>
              <div className="proof-caption-row">
                <span className="proof-caption">
                  Trusted by <strong>200+ Retained Enterprises</strong> in Gujarat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Compliance Workspace Preview */}
        <div className="hero-visual-col">
          {/* Ambient Behind-Deck Glow */}
          <div className="hero-deck-glow-orb" aria-hidden="true"></div>

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
                  <span className="mockup-sub">Live Statutory Mandates &bull; Confidential Client Dossier</span>
                </div>
              </div>
              <div className="mockup-status-tag">
                <span className="status-live-beacon"></span>
                <span>Active Mandates</span>
              </div>
            </div>

            {/* Interactive Workspace Filter Bar */}
            <div className="mockup-segmented-bar" role="tablist" aria-label="Compliance Workspace Views">
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('all')}
              >
                <span>
                  <span className="tab-full">All Mandates</span>
                  <span className="tab-mob">All</span>
                </span>
                <span className="segmented-count">4</span>
              </button>
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'tax' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('tax')}
              >
                <span>
                  <span className="tab-full">Direct Tax &amp; GST</span>
                  <span className="tab-mob">Tax &amp; GST</span>
                </span>
                <span className="segmented-count">2</span>
              </button>
              <button
                type="button"
                className={`segmented-tab-btn ${activeWorkspaceTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('audit')}
              >
                <span>
                  <span className="tab-full">Audit &amp; TDS</span>
                  <span className="tab-mob">Audit</span>
                </span>
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
                <span className="metric-full">Practice Heritage</span>
                <span className="metric-mob">Experience</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong>200+</strong>
                <span className="metric-full">Active Retainers</span>
                <span className="metric-mob">Retainers</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <strong className="text-emerald">100%</strong>
                <span className="metric-full">Zero Notice Record</span>
                <span className="metric-mob">Compliance</span>
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
