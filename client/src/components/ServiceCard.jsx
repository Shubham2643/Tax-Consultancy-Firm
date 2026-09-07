import { Link } from 'react-router-dom';
import { getServicePath } from '../utils/slugify';

const ServiceCard = ({ service }) => {
  const { title, description, serviceType, deliverables, timeline, professionalFee } = service;

  // Icon mapping
  const getIconClass = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('accounting') || t.includes('bookkeeping') || tp === 'accounting') return 'fas fa-calculator';
    if (t.includes('personal tax') || t.includes('itr') || t.includes('income tax') || tp === 'tax') return 'fas fa-file-invoice-dollar';
    if (t.includes('business tax') || t.includes('gst') || t.includes('return')) return 'fas fa-receipt';
    if (t.includes('payroll') || t.includes('salary')) return 'fas fa-money-check-alt';
    if (t.includes('statement') || t.includes('audit')) return 'fas fa-chart-line';
    if (t.includes('registration') || t.includes('company') || t.includes('startup') || tp === 'startup' || tp === 'registration') return 'fas fa-landmark';
    if (t.includes('dispute') || t.includes('notice') || t.includes('legal')) return 'fas fa-gavel';
    return 'fas fa-shield-alt';
  };

  // Category tags mapping
  const categoryLabels = {
    startup: 'Business Setup',
    registration: 'Registration',
    tax: 'Tax & Compliance',
    accounting: 'Audit & Accounts',
    general: 'Corporate Advisory'
  };
  const categoryBadge = categoryLabels[serviceType] || 'Tax & Advisory';

  // Standardize Estimated Turnaround Time
  const getTurnaroundText = () => {
    if (timeline && timeline.trim()) {
      let t = timeline.trim();
      t = t.replace(/working\s*days?/i, 'Business Days');
      t = t.replace(/days?/i, 'Business Days');
      t = t.replace(/-/g, '–');
      return t;
    }
    const tp = (serviceType || '').toLowerCase();
    const tl = (title || '').toLowerCase();
    if (tl.includes('gst reg') || tl.includes('udyam') || tl.includes('msme') || tl.includes('iec')) {
      return '1–3 Business Days';
    }
    if (tp === 'registration') return '3–5 Business Days';
    if (tp === 'startup') return '7–10 Business Days';
    if (tp === 'tax') return '2–4 Business Days';
    if (tp === 'accounting') return '3–5 Business Days';
    return '3–5 Business Days';
  };

  const tatText = getTurnaroundText();
  const isRegistrationOrStartup = serviceType === 'registration' || serviceType === 'startup';

  // Default value highlights if deliverables is empty
  const defaultHighlights = [
    '100% Statutory Compliance',
    'Certified CA Verification',
    'Priority Filing Support'
  ];
  const highlights = deliverables && deliverables.length > 0 ? deliverables.slice(0, 3) : defaultHighlights;

  return (
    <article className="service-card card-animate">
      {/* Top illuminated accent bar */}
      <div className="card-top-beam"></div>

      {/* Header Row: Icon + Category and Turnaround Time Badges */}
      <div className="service-card-header">
        <div className="service-icon-tile">
          <i className={getIconClass(title, serviceType)}></i>
        </div>
        <div className="service-header-badges">
          <span className="service-category-tag">{categoryBadge}</span>
          <span
            className={`service-tat-badge ${isRegistrationOrStartup ? 'tat-highlight' : ''}`}
            title="Estimated Turnaround Time"
          >
            <span className="tat-pulse-dot"></span>
            <i className="far fa-clock"></i>
            <span>{tatText}</span>
          </span>
        </div>
      </div>

      {/* Title & Body */}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-desc">{description}</p>

      {/* Pricing & Value Micro-Bar */}
      <div className="service-meta-strip">
        <div className="service-price-block">
          <span className="price-label">Starting at</span>
          <span className="price-val">
            {professionalFee && professionalFee > 0
              ? `₹${professionalFee.toLocaleString('en-IN')}`
              : 'Fixed CA Retainer'}
          </span>
        </div>
        <div className="service-sla-tag">
          <i className="fas fa-shield-alt"></i>
          <span>Zero Penalty</span>
        </div>
      </div>

      {/* Key Deliverables Box */}
      <div className="service-deliverables-box">
        <span className="deliverables-heading">Key Deliverables</span>
        <ul className="deliverables-list">
          {highlights.map((item, idx) => (
            <li key={idx}>
              <i className="fas fa-check"></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="service-card-footer">
        <Link to={getServicePath(service)} className="btn-service-action" aria-label={`Explore details for ${title}`}>
          <span>Explore Service</span>
          <i className="fas fa-arrow-right btn-arrow"></i>
        </Link>
        <Link to="/contact" className="btn-service-consult" title="Book Free Consultation">
          <i className="fas fa-calendar-alt"></i>
          <span>Consult</span>
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
