import { Link } from 'react-router-dom';

const CARDS_CONFIG = [
  {
    pillarNum: '01',
    theme: 'card-theme-gold',
    eyebrow: 'TAX OPTIMIZATION',
    statusBadge: '28.4% ALPHA',
    iconDefault: 'fa-solid fa-chart-line',
    actionText: 'Explore Tax Strategy',
    actionUrl: '/services',
    // Zone 2: Direct Metric & Open Comparative Delta (No nested boxes)
    renderContent: () => (
      <div className="pillar-body-content">
        {/* Large Display Metric directly on card */}
        <div className="pillar-metric-section">
          <span className="metric-kicker">
            <i className="fa-solid fa-bolt text-gold"></i> NET STATUTORY ALPHA
          </span>
          <div className="metric-headline-row">
            <span className="metric-large">₹4,70,000</span>
            <span className="metric-pill pill-gold">+28.4% Saved</span>
          </div>
          <span className="metric-subtext">Average Net Outflow Preserved per Enterprise</span>
        </div>

        {/* Open Comparison Delta (Sleek track, no double-bordered box) */}
        <div className="pillar-delta-section">
          <div className="delta-meta-row">
            <span className="delta-label">Standard: <s className="strike">₹14,50,000</s></span>
            <span className="delta-value text-emerald">Under SCA: ₹9,80,000</span>
          </div>
          <div className="delta-bar-track">
            <div className="delta-bar-fill fill-gold" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Clean Trust Checklist */}
        <ul className="pillar-trust-checklist">
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>100% Legitimate Exemptions &bull; Zero Scrutiny Risk</span>
          </li>
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>Sec 44ADA Optimization &bull; GSTR-2B Auto-Recon</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    pillarNum: '02',
    theme: 'card-theme-emerald',
    eyebrow: 'PRICING CHARTER',
    statusBadge: '100% PRICE LOCK',
    iconDefault: 'fa-solid fa-gem',
    actionText: 'View Retainer Mandates',
    actionUrl: '/pricing',
    // Zone 2: Direct Metric & Open 3-Point Charter (No nested boxes)
    renderContent: () => (
      <div className="pillar-body-content">
        {/* Large Display Metric directly on card */}
        <div className="pillar-metric-section">
          <span className="metric-kicker">
            <i className="fa-solid fa-lock text-emerald"></i> BILLING TRANSPARENCY
          </span>
          <div className="metric-headline-row">
            <span className="metric-large">₹0.00</span>
            <span className="metric-pill pill-emerald">Strict Zero Default</span>
          </div>
          <span className="metric-subtext">Zero Hidden Surcharges &bull; No Billable Hour Creep</span>
        </div>

        {/* Open 3-Point Charter Grid */}
        <div className="pillar-charter-strip">
          <div className="charter-chip">
            <span className="chip-label">SCOPE LOCK</span>
            <strong className="chip-val">100% Milestone</strong>
          </div>
          <div className="charter-chip">
            <span className="chip-label">GST INVOICE</span>
            <strong className="chip-val">18% ITC Claim</strong>
          </div>
          <div className="charter-chip highlight">
            <span className="chip-label">NOTICE REPLIES</span>
            <strong className="chip-val text-emerald">Included Free</strong>
          </div>
        </div>

        {/* Clean Trust Checklist */}
        <ul className="pillar-trust-checklist">
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>Fiduciary Retainer Agreement signed before mandate</span>
          </li>
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>Pre-agreed deliverables with zero hourly surprises</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    pillarNum: '03',
    theme: 'card-theme-cyan',
    eyebrow: 'COUNSEL HOTLINE',
    statusBadge: '< 15M SLA',
    iconDefault: 'fa-solid fa-headset',
    actionText: 'Consult Senior Partner',
    actionUrl: '/contact',
    // Zone 2: Direct Metric & Symmetrical 3-Point Partner Governance Matrix
    renderContent: () => (
      <div className="pillar-body-content">
        {/* Large Display Metric directly on card */}
        <div className="pillar-metric-section">
          <span className="metric-kicker">
            <i className="fa-solid fa-shield-halved text-cyan"></i> SENIOR PARTNER OVERSIGHT
          </span>
          <div className="metric-headline-row">
            <span className="metric-large">&lt; 15 <small>Mins</small></span>
            <span className="metric-pill pill-cyan">Partner SLA</span>
          </div>
          <span className="metric-subtext">Direct Partner Escalation &bull; Nikol Chambers, Ahmedabad</span>
        </div>

        {/* Symmetrical 3-Point Executive Governance Matrix */}
        <div className="pillar-charter-strip">
          <div className="charter-chip">
            <span className="chip-label">ACCOUNT LEAD</span>
            <strong className="chip-val">Senior Partner</strong>
          </div>
          <div className="charter-chip">
            <span className="chip-label">JUNIOR LAYERS</span>
            <strong className="chip-val text-emerald">Strict Zero</strong>
          </div>
          <div className="charter-chip highlight">
            <span className="chip-label">NOTICE TRIAGE</span>
            <strong className="chip-val text-cyan">Same-Day SLA</strong>
          </div>
        </div>

        {/* Clean Trust Checklist */}
        <ul className="pillar-trust-checklist">
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>Strict Zero-Junior Policy: Partner review before filing</span>
          </li>
          <li>
            <i className="fa-solid fa-circle-check text-emerald"></i>
            <span>Direct WhatsApp line & priority chambers call provided</span>
          </li>
        </ul>
      </div>
    ),
  },
];

const FeatureCard = ({ feature, index = 0 }) => {
  const { title, description, icon } = feature;
  const config = CARDS_CONFIG[index % 3] || CARDS_CONFIG[0];

  // Strictly sanitize any legacy compliance references that may arrive from MongoDB seed
  const cleanTitle = (title || '')
    .replace(/Direct CA Advisory Desk/gi, 'Senior Partner Advisory Desk')
    .replace(/Direct Senior Partner Advisory Desk/gi, 'Senior Partner Advisory Desk')
    .replace(/\bCA\b/g, 'Senior Partner')
    .replace(/Chartered Accountants?/gi, 'Senior Tax Advisors');

  const cleanDescription = (description || '')
    .replace(/certified Chartered Accountants/gi, 'Senior Tax Practitioners & Advisors')
    .replace(/strict ICAI professional standards/gi, 'strict statutory professional standards')
    .replace(/\bICAI\b/gi, 'Statutory')
    .replace(/Chartered Accountants?/gi, 'Senior Tax Advisors');

  const isCustomImg = icon && (
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.includes('.png') ||
    icon.includes('.svg')
  );

  return (
    <article className="sovereign-pillar-card">
      {/* 24K Liquid Metallic Hairline Foil Line */}
      <div className="pillar-top-foil" aria-hidden="true"></div>

      {/* ZONE 1: SOVEREIGN HEADER & METADATA */}
      <div className="pillar-card-header">
        <div className="pillar-header-left">
          <div className="pillar-icon-box">
            {isCustomImg ? (
              <img src={icon} alt={cleanTitle} className="pillar-icon-img" />
            ) : (
              <i className={icon || config.iconDefault}></i>
            )}
          </div>
          <div className="pillar-header-meta">
            <span className="pillar-kicker-tag">PILLAR {config.pillarNum}</span>
            <span className="pillar-eyebrow">{config.eyebrow}</span>
          </div>
        </div>

        <div className="pillar-status-chip">
          <span className="status-chip-dot"></span>
          <span>{config.statusBadge}</span>
        </div>
      </div>

      {/* Card Headline & Narrative */}
      <h3 className="pillar-headline">{cleanTitle}</h3>
      <p className="pillar-body-text">{cleanDescription}</p>

      {/* ZONE 2: OPEN, BREATHING FIDUCIARY CONTENT (NO NESTED BOXES) */}
      {config.renderContent()}

      {/* ZONE 3: SOVEREIGN ACTION DOCK */}
      <div className="pillar-card-footer">
        <Link to={config.actionUrl} className="pillar-cta-button">
          <span className="btn-shine"></span>
          <span className="btn-label">{config.actionText}</span>
          <div className="btn-arrow-squircle">
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default FeatureCard;
