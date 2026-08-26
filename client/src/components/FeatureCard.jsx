const FEATURE_ENRICHMENTS = {
  'saving strategies': {
    displayTitle: 'Tax Optimization & Structuring',
    displayDescription:
      'Proactive direct tax and GST structuring tailored for Indian businesses, startups, and professionals. We identify legitimate exemptions, optimize operational expenses, and structure compliant revenue models to legally minimize your tax outflows.',
    tag: 'MAXIMUM LEGAL ALPHA',
    iconClass: 'fas fa-chart-line',
    highlights: [
      'Presumptive 50% profit tax relief under Section 44ADA',
      'Advance tax forecasting to eliminate Section 234B/C interest',
      'Corporate expense & depreciation optimization frameworks',
    ],
    stat: '✨ Avg. 35% Legitimate Tax Saved',
  },
  'competitive pricing': {
    displayTitle: 'Transparent Flat-Rate Billing',
    displayDescription:
      'Upfront, predictable fee structures with all-inclusive statutory deliverables. No hourly surprises, no hidden surcharges—just fixed, milestone-based packages backed by strict ICAI professional standards.',
    tag: 'ZERO HIDDEN CHARGES',
    iconClass: 'fas fa-gem',
    highlights: [
      '100% all-inclusive quotes with zero hidden surprises',
      'Milestone-based billing for registrations & audit filings',
      'Free initial compliance health check & notice review',
    ],
    stat: '🏷️ Fixed-Fee Guarantee',
  },
  '24/7 support': {
    displayTitle: 'Direct CA Advisory Desk',
    displayDescription:
      'Direct 1-on-1 access to certified Chartered Accountants whenever statutory deadlines approach or urgent tax notices arrive. Real-time drafting, audit defense, and filing guidance via WhatsApp and phone.',
    tag: 'RAPID TURNAROUND',
    iconClass: 'fas fa-headset',
    highlights: [
      '< 2 Hour emergency turnaround on statutory notices',
      'Direct WhatsApp & phone line with senior CA partner',
      'Proactive compliance calendar alerts before due dates',
    ],
    stat: '⚡ 100% On-Time Compliance',
  },
};

const FeatureCard = ({ feature, index = 0 }) => {
  const { title, description, icon } = feature;
  const key = title?.toLowerCase().trim();
  const enrichment = FEATURE_ENRICHMENTS[key] || {
    displayTitle: title,
    displayDescription: description,
    tag: 'CHARTERED EXCELLENCE',
    iconClass: 'fas fa-shield-alt',
    highlights: [
      'Verified statutory compliance by certified Chartered Accountants',
      'Proactive risk mitigation and error-free filing audits',
      'Direct dedicated senior consultant support',
    ],
    stat: '🛡️ 100% Verified Advisory',
  };

  const finalTitle = enrichment.displayTitle || title;
  const finalDescription = enrichment.displayDescription || description;

  return (
    <div className={`feature-bento-card anim-stagger-${(index % 3) + 1}`}>
      {/* Top Accent Gradient Border */}
      <div className="card-top-accent"></div>

      {/* Card Header with Icon & Tag */}
      <div className="feature-card-top">
        <div className="feature-icon-badge">
          {icon && !icon.includes('economic') && !icon.includes('badge_') && !icon.includes('gear_') ? (
            <img src={icon} alt={finalTitle} className="feature-custom-icon" />
          ) : (
            <i className={enrichment.iconClass}></i>
          )}
        </div>
        <span className="feature-tag-pill">{enrichment.tag}</span>
      </div>

      {/* Title & Core Description */}
      <h3 className="feature-card-heading">{finalTitle}</h3>
      <p className="feature-card-text">{finalDescription}</p>

      {/* Structured Value Highlights */}
      <ul className="feature-highlights-list">
        {enrichment.highlights.map((item, idx) => (
          <li key={idx}>
            <i className="fas fa-check-circle check-bullet-icon"></i>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Bottom Metric Chip */}
      <div className="feature-card-footer">
        <span className="feature-metric-chip">{enrichment.stat}</span>
      </div>
    </div>
  );
};

export default FeatureCard;
