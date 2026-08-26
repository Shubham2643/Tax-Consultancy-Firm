const TAG_MAP = {
  0: 'MAXIMUM LEGAL ALPHA',
  1: 'ZERO HIDDEN CHARGES',
  2: 'RAPID TURNAROUND',
};

const STAT_MAP = {
  0: '✨ Avg. 35% Legitimate Tax Saved',
  1: '🏷️ Fixed-Fee Guarantee',
  2: '⚡ 100% On-Time Compliance',
};

const DEFAULT_HIGHLIGHTS = [
  'Verified statutory compliance by certified Chartered Accountants',
  'Proactive risk mitigation and error-free filing audits',
  'Direct dedicated senior consultant advisory',
];

const FeatureCard = ({ feature, index = 0 }) => {
  const { title, description, icon } = feature;

  const tag = TAG_MAP[index % 3] || 'CHARTERED ADVANTAGE';
  const stat = STAT_MAP[index % 3] || '🛡️ 100% Verified Advisory';

  // Determine icon
  const isCustomImg = icon && (icon.startsWith('http') || icon.startsWith('/') || icon.includes('.png') || icon.includes('.svg'));

  return (
    <div className={`feature-bento-card anim-stagger-${(index % 3) + 1}`}>
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
        {DEFAULT_HIGHLIGHTS.map((item, idx) => (
          <li key={idx}>
            <i className="fas fa-check-circle check-bullet-icon"></i>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Bottom Metric Chip */}
      <div className="feature-card-footer">
        <span className="feature-metric-chip">{stat}</span>
      </div>
    </div>
  );
};

export default FeatureCard;
