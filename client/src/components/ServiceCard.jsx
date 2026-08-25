import { Link } from 'react-router-dom';
import { getServicePath } from '../utils/slugify';

const ServiceCard = ({ service }) => {
  const { title, description, serviceType, deliverables } = service;

  // Icon mapping
  const getIconClass = (title, type) => {
    const t = (title || '').toLowerCase();
    if (t.includes('accounting') || t.includes('bookkeeping')) return 'fas fa-calculator';
    if (t.includes('personal tax') || t.includes('itr') || t.includes('income tax')) return 'fas fa-file-invoice-dollar';
    if (t.includes('business tax') || t.includes('gst') || t.includes('return')) return 'fas fa-receipt';
    if (t.includes('payroll') || t.includes('salary')) return 'fas fa-money-check-alt';
    if (t.includes('statement') || t.includes('audit')) return 'fas fa-chart-line';
    if (t.includes('registration') || t.includes('company') || t.includes('startup')) return 'fas fa-landmark';
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

      {/* Header Row */}
      <div className="service-card-header">
        <div className="service-icon-tile">
          <i className={getIconClass(title, serviceType)}></i>
        </div>
        <span className="service-category-tag">{categoryBadge}</span>
      </div>

      {/* Title & Body */}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-desc">{description}</p>

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
