import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Hero.css';

const DOSSIER_PILLARS = [
  {
    num: '01',
    title: 'Direct Tax Planning & Defense',
    badge: 'AUDIT SHIELD',
    badgeIcon: 'fa-solid fa-shield-halved',
    desc: 'Strategic tax optimization under Sec 43B(h), 80JJAA incentives, and statutory depreciation shields.',
    to: '/services/tax-advisory-and-planning',
  },
  {
    num: '02',
    title: 'GST Filing & Litigation Defense',
    badge: '2B RECONCILED',
    badgeIcon: 'fa-solid fa-check',
    desc: 'Departmental audit defense, automated 2B ITC matching, and zero-liability statutory reconciliation.',
    to: '/services/gst-return-filing',
  },
  {
    num: '03',
    title: 'Statutory Audit & Form 3CD',
    badge: 'SEC 44AB READY',
    badgeIcon: 'fa-solid fa-file-contract',
    desc: 'Independent working papers verification, regulatory disclosures, and board-level compliance review.',
    to: '/services/internal-audit-services',
  },
  {
    num: '04',
    title: 'ROC Governance & Annual Filings',
    badge: 'MCA COMPLIANT',
    badgeIcon: 'fa-solid fa-building-columns',
    desc: 'Annual ROC statutory filings (AOC-4, MGT-7), director statutory KYC, and corporate governance filings.',
    to: '/services/business-incorporation-services',
  },
];

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
            <span className="pill-dot-live" aria-hidden="true"></span>
            <span>PREMIER TAX &amp; STATUTORY ADVISORY &bull; GUJARAT</span>
          </div>

          <h1 className="hero-main-title">
            Strategic Tax Precision &amp; <span className="title-gradient-accent">Seamless Compliance</span> for Growing Enterprises.
          </h1>

          <p className="hero-subtext">
            Partner with dedicated senior tax advisors for strategic corporate tax, GST audit defense, ROC governance, and dispute resolution—ensuring zero penalties and maximum legal tax savings.
          </p>

          {/* 3 Executive Value Badges */}
          <div className="hero-trust-badges-grid">
            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon emerald">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              </div>
              <div className="trust-badge-content">
                <strong className="badge-title">Zero-Penalty Record</strong>
                <span className="badge-subtitle">99.8% Statutory Accuracy</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon gold">
                <i className="fa-solid fa-file-contract" aria-hidden="true"></i>
              </div>
              <div className="trust-badge-content">
                <strong className="badge-title">Strict Client NDA</strong>
                <span className="badge-subtitle">100% Fiduciary Confidentiality</span>
              </div>
            </div>

            <div className="hero-trust-badge-card">
              <div className="trust-badge-icon sapphire">
                <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
              </div>
              <div className="trust-badge-content">
                <strong className="badge-title">Direct Partner Desk</strong>
                <span className="badge-subtitle">Senior Partner Review</span>
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
              <i className="fa-brands fa-whatsapp hero-wa-lead-icon" aria-hidden="true"></i>
              <span className="hero-wa-text">Direct WhatsApp Desk</span>
              <span className="hero-wa-status-dot" aria-hidden="true"></span>
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
                  Trusted by <strong>200+ Retained Enterprises</strong> across Gujarat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Executive Advisory Dossier (Retained Corporate Counsel) */}
        <div className="hero-visual-col">
          {/* Ambient Behind-Deck Glow */}
          <div className="hero-deck-glow-orb" aria-hidden="true"></div>

          {/* The Executive Advisory Dossier Card */}
          <div className="hero-mockup-card dossier-card" role="region" aria-label="Executive Advisory Dossier">
            {/* Top 24K Gold Foil Accent Bar */}
            <div className="mockup-top-foil" aria-hidden="true"></div>

            {/* Subtle Institutional Fiduciary Watermark */}
            <div className="dossier-watermark" aria-hidden="true">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>

            {/* Dossier Header: Crest, Firm Authority, and Active Standing */}
            <div className="dossier-header">
              <div className="dossier-brand">
                <div className="dossier-crest-wrap">
                  <img
                    src="/assets/logo_circle_full.png?v=6"
                    alt="Shree Chamunda Associates Insignia"
                    className="dossier-logo-crest"
                  />
                  <span className="crest-halo-glow" aria-hidden="true"></span>
                </div>
                <div className="dossier-title-block">
                  <span className="dossier-eyebrow">CHAMBERS OF SHREE CHAMUNDA ASSOCIATES</span>
                  <h3 className="dossier-heading">Executive Advisory Dossier</h3>
                  <span className="dossier-sub">Retained Corporate Counsel &bull; Gujarat Jurisdiction</span>
                </div>
              </div>
              <div className="dossier-meta-badge">
                <span className="dossier-brief-label">ENGAGEMENT BRIEF</span>
                <div className="dossier-standing-pill" title="Retained Counsel Active Standing">
                  <span className="dossier-beacon-dot" aria-hidden="true"></span>
                  <span>Active Standing</span>
                </div>
              </div>
            </div>

            {/* Section Eyebrow: Statutory Practice Pillars */}
            <div className="dossier-pillars-eyebrow">
              <span>STATUTORY PRACTICE PILLARS &bull; CORPORATE RETAINER</span>
            </div>

            {/* 4 Statutory Practice Pillars (Numbered 01 to 04) */}
            <div className="dossier-pillars-list" role="list" aria-label="Statutory Practice Pillars">
              {DOSSIER_PILLARS.map((pillar) => (
                <Link
                  key={pillar.num}
                  to={pillar.to}
                  className="dossier-pillar-card"
                  role="listitem"
                  aria-label={`${pillar.title} - ${pillar.badge}`}
                >
                  <div className="pillar-header-row">
                    <div className="pillar-title-wrap">
                      <span className="pillar-num">{pillar.num}</span>
                      <h4 className="pillar-title">{pillar.title}</h4>
                    </div>
                    <div className="pillar-action-meta">
                      <span className="pillar-status-pill">
                        <i className={pillar.badgeIcon} aria-hidden="true"></i>
                        <span>{pillar.badge}</span>
                      </span>
                      <span className="pillar-hover-arrow" aria-hidden="true">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                  <p className="pillar-desc">{pillar.desc}</p>
                </Link>
              ))}
            </div>

            {/* Bottom 3-Metric Executive Bar */}
            <div className="dossier-metrics-strip">
              <div className="dossier-metric-col">
                <strong className="dossier-metric-val">200+ Entities</strong>
                <span className="dossier-metric-lbl">CORPORATE RETAINERS</span>
              </div>
              <div className="dossier-metric-sep" aria-hidden="true"></div>
              <div className="dossier-metric-col">
                <strong className="dossier-metric-val">99.8% On-Time</strong>
                <span className="dossier-metric-lbl">FILING ACCURACY</span>
              </div>
              <div className="dossier-metric-sep" aria-hidden="true"></div>
              <div className="dossier-metric-col">
                <strong className="dossier-metric-val">Partner-Led</strong>
                <span className="dossier-metric-lbl">DIRECT SIGN-OFF</span>
              </div>
            </div>

            {/* Fiduciary Protocol Footnote */}
            <div className="dossier-footer-note">
              <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
              <span>Strict Fiduciary Privilege &bull; Governed by Professional Ethics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
