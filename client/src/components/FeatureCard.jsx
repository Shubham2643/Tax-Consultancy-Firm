import { Link } from 'react-router-dom';

const CARDS_CONFIG = [
  {
    theme: 'card-theme-gold',
    eyebrow: 'TAX OPTIMIZATION',
    iconDefault: 'fa-solid fa-chart-line',
    actionText: 'Explore Tax Strategy',
    actionUrl: '/services',
    tags: ['Sec 44ADA Optimization', 'GSTR-2B Matching', 'Zero Sec 234 Interest'],
    // Visual Graphic: Tax Alpha Bar Comparison
    renderVisual: () => (
      <div className="visual-widget visual-tax-alpha">
        <div className="visual-top-row">
          <span className="visual-kicker">ANNUAL STATUTORY OUTFLOW ANALYSIS</span>
          <span className="visual-badge-pill badge-gold-glow">Avg. 28.4% Saved</span>
        </div>

        <div className="tax-comparison-bars">
          {/* Bar 1: Standard Unstructured */}
          <div className="tax-bar-group">
            <div className="tax-bar-meta">
              <span className="bar-label">Standard Filing Outflow</span>
              <strong className="bar-val text-muted">₹14,50,000</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-unstructured" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Bar 2: Structured Outflow with SCA */}
          <div className="tax-bar-group">
            <div className="tax-bar-meta">
              <span className="bar-label">Structured Under Chamunda Advisory</span>
              <strong className="bar-val text-emerald">₹9,80,000</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-structured" style={{ width: '67.5%' }}></div>
            </div>
          </div>
        </div>

        <div className="visual-highlight-chip">
          <i className="fa-solid fa-bolt text-gold"></i>
          <span><strong>₹4,70,000 Net Legal Savings</strong> &bull; Zero Scrutiny Risk</span>
        </div>
      </div>
    ),
  },
  {
    theme: 'card-theme-emerald',
    eyebrow: 'FIXED-FEE ASSURANCE',
    iconDefault: 'fa-solid fa-handshake-angle',
    actionText: 'View Retainer Mandates',
    actionUrl: '/pricing',
    tags: ['Scope-Locked Contract', 'No Hourly Creep', '18% ITC Invoices'],
    // Visual Graphic: Scope-Locked Retainer Voucher
    renderVisual: () => (
      <div className="visual-widget visual-fixed-fee">
        <div className="visual-top-row">
          <span className="visual-kicker">FIDUCIARY RETAINER GUARANTEE</span>
          <span className="visual-badge-pill badge-emerald-glow">100% Price Lock</span>
        </div>

        <div className="fee-spec-rows">
          <div className="fee-spec-row">
            <span className="spec-lbl">Deliverables Scope</span>
            <span className="spec-val">100% Locked &amp; Milestone Based</span>
          </div>
          <div className="fee-spec-row">
            <span className="spec-lbl">Hourly Billing Inflation</span>
            <span className="spec-val text-emerald">₹0.00 (Zero Hidden Fees)</span>
          </div>
          <div className="fee-spec-row">
            <span className="spec-lbl">Official GST Tax Invoice</span>
            <span className="spec-val">18% Input Credit Claimable</span>
          </div>
        </div>

        <div className="visual-highlight-chip">
          <i className="fa-solid fa-circle-check text-emerald"></i>
          <span><strong>Zero Surprise Bills:</strong> Routine notice replies included</span>
        </div>
      </div>
    ),
  },
  {
    theme: 'card-theme-cyan',
    eyebrow: 'SENIOR PARTNER OVERSIGHT',
    iconDefault: 'fa-solid fa-headset',
    actionText: 'Connect With Partner',
    actionUrl: '/contact',
    tags: ['< 15 Min SLA', 'Direct WhatsApp Line', 'Dual-Level Vetting'],
    // Visual Graphic: Live Chambers Helpline
    renderVisual: () => (
      <div className="visual-widget visual-chambers-desk">
        <div className="visual-top-row">
          <span className="visual-kicker">CHAMBERS DIRECT DISPATCH</span>
          <span className="visual-badge-pill badge-live-chambers">
            <span className="live-chambers-dot"></span>
            Chambers Online
          </span>
        </div>

        <div className="chambers-status-box">
          <div className="chambers-status-header">
            <div className="chambers-avatar-badge">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <div className="chambers-partner-info">
              <strong>Senior Direct Tax Partner</strong>
              <span>Nikol Central Chambers, Ahmedabad</span>
            </div>
          </div>

          <div className="chambers-meta-pills">
            <span className="meta-pill">
              <i className="fa-brands fa-whatsapp text-emerald"></i> VIP WhatsApp
            </span>
            <span className="meta-pill">
              <i className="fa-solid fa-phone text-blue"></i> Direct Phone
            </span>
            <span className="meta-pill">
              <i className="fa-solid fa-clock text-amber"></i> &lt; 15m Response
            </span>
          </div>
        </div>

        <div className="visual-highlight-chip">
          <i className="fa-solid fa-shield-halved text-cyan"></i>
          <span><strong>Zero Junior Handoffs:</strong> Senior audit before filing</span>
        </div>
      </div>
    ),
  },
];

const FeatureCard = ({ feature, index = 0 }) => {
  const { title, description, icon } = feature;
  const config = CARDS_CONFIG[index % 3] || CARDS_CONFIG[0];

  const isCustomImg = icon && (
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.includes('.png') ||
    icon.includes('.svg')
  );

  return (
    <article className={`fintech-feature-card ${config.theme} anim-stagger-${(index % 3) + 1}`}>
      {/* Top Hairline Accent Line */}
      <div className="card-top-hairline" aria-hidden="true"></div>

      {/* Card Header: Icon & Eyebrow */}
      <div className="card-header-line">
        <div className="card-icon-squircle">
          {isCustomImg ? (
            <img src={icon} alt={title} className="card-icon-img" />
          ) : (
            <i className={icon || config.iconDefault}></i>
          )}
        </div>
        <span className="card-eyebrow-tag">{config.eyebrow}</span>
      </div>

      {/* Card Title & Crisp Copy */}
      <h3 className="card-headline">{title}</h3>
      <p className="card-body-text">{description}</p>

      {/* Centerpiece Visual Graphic Mockup */}
      <div className="card-visual-centerpiece">
        {config.renderVisual()}
      </div>

      {/* Bottom Feature Tags */}
      <div className="card-pills-row">
        {config.tags.map((tagText, tIdx) => (
          <span key={tIdx} className="card-feature-pill">
            <span className="pill-dot"></span>
            {tagText}
          </span>
        ))}
      </div>

      {/* Card Action Link */}
      <div className="card-footer-action">
        <Link to={config.actionUrl} className="card-action-btn">
          <span>{config.actionText}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default FeatureCard;