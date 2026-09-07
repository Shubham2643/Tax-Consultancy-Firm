import { Link } from 'react-router-dom';

const FEATURE_PRESETS = [
  {
    tag: 'MAXIMUM TAX SAVINGS',
    stat: '✨ Avg. 25–35% Tax Legally Saved',
    accent: 'accent-gold',
    highlights: [
      'Proactive advance tax structuring under Sec 80 / 44ADA',
      'Legitimate deduction maximization with zero penalty risk',
      'Quarterly P&L health & statutory outflow forecasts',
    ],
  },
  {
    tag: 'ZERO HIDDEN SURCHARGES',
    stat: '🏷️ 100% Fixed-Price Assurance',
    accent: 'accent-emerald',
    highlights: [
      '100% upfront clear scope with no hidden filing charges',
      'Fixed retainers & predictable milestone disbursements',
      'Detailed GST tax invoice with zero unexpected billing creep',
    ],
  },
  {
    tag: 'SENIOR CA OVERSIGHT',
    stat: '⚡ <24h Response SLA Guarantee',
    accent: 'accent-cyan',
    highlights: [
      '1-on-1 direct WhatsApp & phone access to Senior CA Partners',
      'Rapid notice response & Section 143/148 scrutiny defense',
      'Dual-level audit verification before department upload',
    ],
  },
];

const FeatureCard = ({ feature, index = 0 }) => {
  const { title, description, icon } = feature;

  const preset = FEATURE_PRESETS[index % 3] || FEATURE_PRESETS[0];
  const tag = preset.tag;
  const stat = preset.stat;
  const accentClass = preset.accent;
  const highlights = (feature.highlights && feature.highlights.length > 0)
    ? feature.highlights
    : preset.highlights;

  // Determine icon
  const isCustomImg = icon && (icon.startsWith('http') || icon.startsWith('/') || icon.includes('.png') || icon.includes('.svg'));

  return (
    <div className={`feature-bento-card ${accentClass} anim-stagger-${(index % 3) + 1}`}>
      {/* Top Accent Gradient Border */}
      <div className="card-top-accent"></div>

      {/* Card Header with Icon & Tag */}
      <div className="feature-card-top">
        <div className="feature-icon-badge">
          {isCustomImg ? (
            <img src={icon} alt={title} className="feature-custom-icon" />
          ) : (
            <i className={icon || (index === 0 ? 'fas fa-chart-line' : index === 1 ? 'fas fa-gem' : 'fas fa-headset')}></i>
          )}
        </div>
        <span className="feature-tag-pill">{tag}</span>
      </div>

      {/* Title & Core Description */}
      <h3 className="feature-card-heading">{title}</h3>
      <p className="feature-card-text">{description}</p>

      {/* Structured Value Highlights */}
      <ul className="feature-highlights-list">
        {highlights.map((item, idx) => (
          <li key={idx}>
            <i className="fas fa-check-circle check-bullet-icon"></i>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Bottom Metric Chip & Action */}
      <div className="feature-card-footer">
        <span className="feature-metric-chip">{stat}</span>
        <Link to="/contact" className="feature-card-action-link" title="Consult on this service">
          <span>Inquire</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
