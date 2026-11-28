import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';
import './Hero.css';

const DOSSIER_PILLARS = [
  {
    num: '01',
    tone: 'gold',
    title: 'Direct Tax Planning & Defense',
    badge: 'AUDIT SHIELD',
    badgeIcon: 'fa-solid fa-shield-halved',
    desc: 'Strategic tax optimization under Sec 43B(h), 80JJAA incentives, and statutory depreciation shields.',
    to: '/services/tax-advisory-and-planning',
  },
  {
    num: '02',
    tone: 'emerald',
    title: 'GST Filing & Litigation Defense',
    badge: '2B RECONCILED',
    badgeIcon: 'fa-solid fa-check',
    desc: 'Departmental audit defense, automated 2B ITC matching, and zero-liability statutory reconciliation.',
    to: '/services/gst-return-filing',
  },
  {
    num: '03',
    tone: 'sapphire',
    title: 'Statutory Audit & Form 3CD',
    badge: 'SEC 44AB READY',
    badgeIcon: 'fa-solid fa-file-contract',
    desc: 'Independent working papers verification, regulatory disclosures, and board-level compliance review.',
    to: '/services/internal-audit-services',
  },
  {
    num: '04',
    tone: 'indigo',
    title: 'ROC Governance & Annual Filings',
    badge: 'MCA COMPLIANT',
    badgeIcon: 'fa-solid fa-building-columns',
    desc: 'Annual ROC statutory filings (AOC-4, MGT-7), director statutory KYC, and corporate governance filings.',
    to: '/services/business-incorporation-services',
  },
];

const HERO_TRUST_BADGES = [
  {
    id: 'penalty-free',
    tone: 'emerald',
    icon: 'fa-solid fa-shield-halved',
    title: 'Zero-Penalty Record',
    subtitle: '99.8% Statutory Accuracy',
  },
  {
    id: 'client-nda',
    tone: 'gold',
    icon: 'fa-solid fa-file-contract',
    title: 'Strict Client NDA',
    subtitle: 'Fiduciary Confidentiality',
  },
  {
    id: 'partner-desk',
    tone: 'sapphire',
    icon: 'fa-solid fa-user-tie',
    title: 'Direct Partner Desk',
    subtitle: 'Senior Partner Review',
  },
];

const Hero = () => {
  const { settings, loading } = useSiteContext();
  const { isDark } = useTheme();

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
            <span className="pill-kicker-text">PREMIER TAX &amp; STATUTORY ADVISORY</span>
            <span className="pill-kicker-sep" aria-hidden="true"></span>
            <span className="pill-region-tag">GUJARAT</span>
          </div>

          <h1 className="hero-main-title">
            Strategic Tax Precision &amp; <span className="title-gradient-accent">Seamless Compliance</span> for Growing Enterprises.
          </h1>

          <p className="hero-subtext">
            Partner with dedicated senior tax advisors for strategic corporate tax, GST audit defense, ROC governance, and dispute resolution—ensuring <strong className="hero-subtext-highlight">zero penalties</strong> and <strong className="hero-subtext-highlight">maximum legal tax savings</strong>.
          </p>

          {/* 3 Executive Value Badges */}
          <div className="hero-trust-badges-grid">
            {HERO_TRUST_BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`hero-trust-badge-card hero-trust-badge-card--${badge.tone}`}
              >
                <div className={`trust-badge-icon ${badge.tone}`}>
                  <i className={badge.icon} aria-hidden="true"></i>
                </div>
                <div className="trust-badge-content">
                  <strong className="badge-title">{badge.title}</strong>
                  <span className="badge-subtitle">{badge.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action Buttons - Institutional Chambers Style */}
          <div className="hero-cta-group">
            <Link to="/contact" className="btn-hero-primary" aria-label="Schedule Partner Advisory Session">
              <i className="fa-solid fa-calendar-check hero-btn-lead-icon" aria-hidden="true"></i>
              <span className="hero-btn-text">Schedule Partner Advisory</span>
              <i className="fa-solid fa-arrow-right hero-btn-trail-icon" aria-hidden="true"></i>
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
            <div className="proof-main-group">
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
            <div className="proof-practice-stamp" aria-hidden="true">
              <span className="proof-stamp-kicker">RETAINED DESK</span>
              <span className="proof-stamp-scope">Direct Tax &bull; GST &bull; ROC</span>
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

            {/* Dossier Header: Precision Crest Medallion, Authority Masthead & Telemetry Plaque */}
            <div className="dossier-header">
              <div className="dossier-brand">
                <div className="dossier-crest-wrap">
                  <img
                    src={isDark ? '/assets/logo_crest_dark.png?v=1' : '/assets/logo_crest.png?v=1'}
                    alt="Shree Chamunda Associates Crest"
                    className="dossier-logo-crest"
                  />
                </div>
                <div className="dossier-title-block">
                  <span className="dossier-eyebrow">CHAMBERS OF SHREE CHAMUNDA ASSOCIATES</span>
                  <h3 className="dossier-heading">Executive Advisory Dossier</h3>
                  <span className="dossier-sub">
                    <span>Retained Corporate Counsel</span>
                    <span className="dossier-sub-sep" aria-hidden="true"></span>
                    <span className="dossier-sub-region">Gujarat Jurisdiction</span>
                  </span>
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
              <span className="pillars-eyebrow-label">STATUTORY PRACTICE PILLARS &bull; CORPORATE RETAINER</span>
              <span className="pillars-eyebrow-rule" aria-hidden="true"></span>
              <span className="pillars-eyebrow-count">4 MANDATES</span>
            </div>

            {/* 4 Statutory Practice Pillars (Numbered 01 to 04) */}
            <div className="dossier-pillars-list" role="list" aria-label="Statutory Practice Pillars">
              {DOSSIER_PILLARS.map((pillar) => (
                <Link
                  key={pillar.num}
                  to={pillar.to}
                  className={`dossier-pillar-card pillar-tone-${pillar.tone}`}
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

            {/* Bottom 3-Metric Executive KPI Dock */}
            <div className="dossier-metrics-strip" aria-label="Firm executive metrics">
              {[
                {
                  id: 'retainers',
                  tone: 'gold',
                  icon: 'fa-solid fa-building-columns',
                  num: '200+',
                  unit: 'Entities',
                  label: 'CORPORATE RETAINERS',
                },
                {
                  id: 'accuracy',
                  tone: 'emerald',
                  icon: 'fa-solid fa-circle-check',
                  num: '99.8%',
                  unit: 'On-Time',
                  label: 'FILING ACCURACY',
                },
                {
                  id: 'partner',
                  tone: 'sapphire',
                  icon: 'fa-solid fa-user-tie',
                  text: 'Partner-Led',
                  label: 'DIRECT SIGN-OFF',
                },
              ].map((metric) => (
                <div
                  key={metric.id}
                  className={`dossier-metric-card dossier-metric-card--${metric.tone}`}
                >
                  <div className="dossier-metric-top">
                    <strong className="dossier-metric-val">
                      {metric.num ? (
                        <>
                          <span className="dossier-metric-num">{metric.num}</span>{' '}
                          <span className="dossier-metric-unit">{metric.unit}</span>
                        </>
                      ) : (
                        <span className="dossier-metric-single">{metric.text}</span>
                      )}
                    </strong>
                    <span className="dossier-metric-icon" aria-hidden="true">
                      <i className={metric.icon}></i>
                    </span>
                  </div>
                  <span className="dossier-metric-lbl">{metric.label}</span>
                </div>
              ))}
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
