import { useNavigate } from 'react-router-dom';

const PLAN_CONFIG = {
  'basic plan': {
    title: 'Starter Compliance',
    target: 'Sole Proprietors & Freelancers',
    desc: 'Essential bookkeeping, monthly GST filings, and quarterly tax estimations for small businesses.',
    popularLabel: null,
    deliverables: [
      'Monthly Bookkeeping & Bank Statement Reconciliation',
      'GSTR-1 & GSTR-3B Monthly Return Filings',
      'Quarterly Advance Tax Computation (Sec 234B/C)',
      'Direct Portal & Standard Email Support Desk',
      'Year-End Financial Statement Preparation',
    ],
    ctaText: 'Choose Starter Plan',
  },
  'standard plan': {
    title: 'Growth & GST Retainer',
    target: 'Growing MSMEs & Active Traders',
    desc: 'Complete accounting, vendor ITC matching, TDS filings, and priority WhatsApp CA advisory.',
    popularLabel: 'MOST POPULAR • BEST ROI',
    deliverables: [
      'Complete Monthly Accounting & Ledgers Management',
      'Monthly GSTR-1 & GSTR-3B with GSTR-2B Input Tax Matching',
      'Quarterly TDS Computation & Form 24Q / 26Q Returns',
      'Vendor Reconciliation & AIS / 26AS Statement Auditing',
      'Priority WhatsApp & Direct Phone CA Partner Access',
    ],
    ctaText: 'Choose Growth Retainer',
  },
  'premium plan': {
    title: 'Virtual CFO Advisory',
    target: 'Pvt Ltd, LLPs & High-Turnover Units',
    desc: 'End-to-end financial outsourcing, corporate tax returns, and statutory notice defense.',
    popularLabel: null,
    deliverables: [
      'Full Virtual CFO & End-to-End Accounting Outsourcing',
      'Corporate Tax Filing (ITR-6 / ITR-5) & Tax Audit Preparation',
      'Statutory Notice Drafting (GST ASMT-10 & Income Tax 143/148)',
      'Monthly Financial MIS & Profitability Structuring',
      'Dedicated Senior Chartered Accountant Desk',
    ],
    ctaText: 'Hire Virtual CFO',
  },
  'incorporate plan': {
    title: 'Turnkey Incorporation',
    target: 'New Startups & Expanding Ventures',
    desc: 'Complete legal company incorporation, DIN/DSC allotment, and 1st month compliance.',
    popularLabel: null,
    deliverables: [
      'Pvt Ltd or LLP Registration via MCA SPICe+ Portal',
      '2 Director Identification Numbers (DIN) & Class-3 DSCs',
      'Company PAN, TAN, Bank A/c Drafting (MoA & AoA)',
      'MSME / Udyam & Startup India DPIIT Advisory',
      'Complimentary 1st Month GST & Statutory Tax Review',
    ],
    ctaText: 'Incorporate Company',
  },
};

const PricingCard = ({ plan, index }) => {
  const { name, price, period, isPopular } = plan;
  const navigate = useNavigate();

  const key = name?.toLowerCase().trim();
  const config = PLAN_CONFIG[key] || {
    title: name,
    target: 'Businesses & Startups',
    desc: 'Comprehensive chartered accounting and statutory filing retainer.',
    popularLabel: isPopular ? 'RECOMMENDED' : null,
    deliverables: plan.features || [],
    ctaText: 'Select Plan',
  };

  const handleSelect = () => {
    navigate('/contact', { state: { planName: config.title || name } });
  };

  const formatPrice = (num) => {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('en-IN');
  };

  const isHighlighted = isPopular || config.popularLabel;

  return (
    <div
      className={`industrial-price-card ${isHighlighted ? 'card-highlighted' : ''} anim-stagger-${(index % 4) + 1}`}
    >
      {/* Popular Badge */}
      {isHighlighted && (
        <div className="industrial-popular-pill">
          <i className="fas fa-bolt"></i>
          <span>{config.popularLabel || 'MOST POPULAR'}</span>
        </div>
      )}

      {/* Card Header */}
      <div className="card-header-block">
        <div className="card-top-row">
          <span className="card-target-badge">{config.target}</span>
        </div>
        <h3 className="card-plan-title">{config.title}</h3>
        <p className="card-plan-desc">{config.desc}</p>
      </div>

      {/* Price Block */}
      <div className="card-price-block">
        <div className="price-digits-row">
          <span className="price-currency">₹</span>
          <span className="price-number">{formatPrice(price)}</span>
          <span className="price-period">/{period}</span>
        </div>
        <span className="price-sub-caption">
          <i className="fas fa-check-shield"></i> Fixed-fee guarantee &bull; Zero hidden surcharges
        </span>
      </div>

      {/* CTA Button placed immediately under price */}
      <button
        className={`btn-card-action ${isHighlighted ? 'btn-action-highlighted' : ''}`}
        onClick={handleSelect}
      >
        <span>{config.ctaText}</span>
        <i className="fas fa-arrow-right"></i>
      </button>

      {/* Feature Divider */}
      <div className="card-divider-line"></div>

      {/* Deliverables List */}
      <div className="card-features-section">
        <span className="features-header-tag">INCLUDED DELIVERABLES</span>
        <ul className="deliverables-checklist">
          {config.deliverables.map((item, idx) => (
            <li key={idx}>
              <span className="check-bullet">
                <i className="fas fa-check"></i>
              </span>
              <span className="check-text">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
