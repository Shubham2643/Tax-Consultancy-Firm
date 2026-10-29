import { Link } from 'react-router-dom';
import { getServicePath } from '../utils/slugify';

const ServiceCard = ({ service }) => {
  const { title, description, serviceType, deliverables, timeline, professionalFee } = service;

  // Statutory regulatory authority tag
  const getStatutoryTag = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('pvt') || t.includes('private limited') || t.includes('llp') || t.includes('opc') || tp === 'startup') return 'MCA-21 SPICe+';
    if (t.includes('gst') || t.includes('lut') || t.includes('gstr')) return 'GSTN Sec 37–39';
    if (t.includes('itr') || t.includes('tax return') || t.includes('personal tax') || tp === 'tax') return 'IT Act Sec 139(1)';
    if (t.includes('audit') || t.includes('tax audit') || t.includes('44ab')) return 'IT Act Sec 44AB';
    if (t.includes('accounting') || t.includes('bookkeeping') || tp === 'accounting') return 'SA-700 Standard';
    if (t.includes('trademark') || t.includes('ipr')) return 'IP India Class Registry';
    if (t.includes('fssai') || t.includes('food')) return 'FSSAI Act 2006';
    if (t.includes('msme') || t.includes('udyam')) return 'MSMED Act 2006';
    if (t.includes('import') || t.includes('iec')) return 'DGFT Customs Code';
    return 'Statutory Standard';
  };

  // Bespoke service icon mapping with precision domain relevance
  const getIconClass = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('setup') || t.includes('system') || t.includes('software')) return 'fa-solid fa-sliders';
    if (t.includes('personal tax') || t.includes('itr') || t.includes('income tax')) return 'fa-solid fa-file-invoice-dollar';
    if (t.includes('bookkeeping') || t.includes('ledger') || t.includes('accounts payable')) return 'fa-solid fa-book-bookmark';
    if (t.includes('audit') || t.includes('assurance') || t.includes('44ab')) return 'fa-solid fa-clipboard-check';
    if (t.includes('gst') || t.includes('lut') || t.includes('gstr')) return 'fa-solid fa-receipt';
    if (t.includes('pvt') || t.includes('private limited') || t.includes('incorporation')) return 'fa-solid fa-building';
    if (t.includes('llp') || t.includes('partnership')) return 'fa-solid fa-handshake';
    if (t.includes('opc') || t.includes('proprietorship')) return 'fa-solid fa-user-tie';
    if (t.includes('trademark') || t.includes('ipr') || t.includes('copyright')) return 'fa-solid fa-trademark';
    if (t.includes('fssai') || t.includes('food') || t.includes('drug')) return 'fa-solid fa-utensils';
    if (t.includes('msme') || t.includes('udyam')) return 'fa-solid fa-certificate';
    if (t.includes('import') || t.includes('iec') || t.includes('export')) return 'fa-solid fa-ship';
    if (t.includes('shop') || t.includes('gumasta') || t.includes('establishment')) return 'fa-solid fa-store';
    if (t.includes('payroll') || t.includes('salary') || t.includes('epf') || t.includes('esi')) return 'fa-solid fa-money-check-dollar';
    if (t.includes('cfo') || t.includes('mis') || t.includes('financial model') || t.includes('forecast')) return 'fa-solid fa-chart-line';
    if (t.includes('notice') || t.includes('litigation') || t.includes('appeal') || t.includes('tribunal') || t.includes('dispute')) return 'fa-solid fa-gavel';
    if (tp === 'startup') return 'fa-solid fa-rocket';
    if (tp === 'registration') return 'fa-solid fa-stamp';
    if (tp === 'tax') return 'fa-solid fa-file-invoice';
    if (tp === 'accounting') return 'fa-solid fa-calculator';
    return 'fa-solid fa-shield-halved';
  };

  const categoryConfig = {
    startup: { label: 'Business Setup', icon: 'fa-solid fa-rocket', tagClass: 'badge-cat-startup' },
    registration: { label: 'Registrations', icon: 'fa-solid fa-stamp', tagClass: 'badge-cat-registration' },
    tax: { label: 'Tax & Compliance', icon: 'fa-solid fa-file-invoice-dollar', tagClass: 'badge-cat-tax' },
    accounting: { label: 'Audit & Accounts', icon: 'fa-solid fa-calculator', tagClass: 'badge-cat-accounting' },
    general: { label: 'Corporate Advisory', icon: 'fa-solid fa-landmark', tagClass: 'badge-cat-general' }
  };
  const currentCategory = categoryConfig[serviceType] || { label: 'Tax & Advisory', icon: 'fa-solid fa-scale-balanced', tagClass: 'badge-cat-general' };

  const getSlaTag = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('setup') || t.includes('system')) return { icon: 'fa-solid fa-check-double', text: 'Audit-Ready Setup' };
    if (t.includes('bookkeeping') || t.includes('ledger')) return { icon: 'fa-solid fa-scale-balanced', text: '3-Way Reconciled' };
    if (t.includes('itr') || t.includes('tax return') || t.includes('personal tax') || tp === 'tax') return { icon: 'fa-solid fa-shield-halved', text: 'Zero Notice Guarantee' };
    if (t.includes('gst')) return { icon: 'fa-solid fa-certificate', text: 'Partner Vetted' };
    if (t.includes('audit')) return { icon: 'fa-solid fa-stamp', text: 'SA-700 Standard' };
    if (t.includes('pvt') || t.includes('private limited') || t.includes('incorporation') || tp === 'startup') return { icon: 'fa-solid fa-award', text: 'Govt SPICe+ Certified' };
    if (t.includes('trademark') || t.includes('fssai') || tp === 'registration') return { icon: 'fa-solid fa-file-circle-check', text: 'Registry Verified' };
    if (t.includes('cfo') || t.includes('mis')) return { icon: 'fa-solid fa-user-tie', text: 'Senior Partner Led' };
    return { icon: 'fa-solid fa-shield-halved', text: 'Statutory Defense Included' };
  };

  const normalizedCategory = ['startup', 'registration', 'tax', 'accounting'].includes(serviceType)
    ? serviceType
    : (serviceType === 'general' ? 'tax' : 'accounting');

  const getTurnaroundText = () => {
    if (timeline && timeline.trim()) {
      let t = timeline.trim();
      if (/monthly\s*cycle/i.test(t)) return '3 Days / Mo';
      if (/monthly\s*\/\s*ongoing/i.test(t)) return 'Ongoing Monthly';
      if (/working\s*days?/i.test(t)) {
        t = t.replace(/working\s*days?/i, 'Business Days');
      } else if (!/business/i.test(t) && /days?/i.test(t)) {
        t = t.replace(/days?/i, 'Business Days');
      }
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
  const statutoryTag = getStatutoryTag(title, serviceType);
  const slaTag = getSlaTag(title, serviceType);

  const defaultHighlights = [
    '100% Statutory Compliance Filing',
    'Senior Advisory Partner Verification',
    'Digital Filing Receipt in Client Vault'
  ];
  const highlights = deliverables && deliverables.length > 0 ? deliverables.slice(0, 3) : defaultHighlights;

  return (
    <article
      className={`service-card card-cat-${normalizedCategory}`}
      data-category={normalizedCategory}
    >
      {/* Top Ambient Radiant Beam */}
      <div className="card-top-beam" aria-hidden="true"></div>

      <div className="service-card-inner">
        {/* Header: Jewel Icon + Domain & TAT Cluster */}
        <div className="service-card-header">
          <div className="service-icon-tile">
            <i className={getIconClass(title, serviceType)} aria-hidden="true"></i>
          </div>

          <div className="service-header-meta">
            <span className={`service-category-tag ${currentCategory.tagClass}`}>
              <i className={currentCategory.icon} aria-hidden="true"></i>
              <span>{currentCategory.label}</span>
            </span>
            <span className="service-tat-pill" title="Estimated Turnaround Time">
              <span className="tat-pulse-dot" aria-hidden="true"></span>
              <span>{tatText}</span>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="service-card-body">
          <h3 className="service-card-title">
            <Link to={getServicePath(service)}>{title}</Link>
          </h3>
          <p className="service-card-desc">{description}</p>
        </div>

        {/* Unified Statutory Compliance & SLA Strip */}
        <div className="service-compliance-strip">
          <div className="compliance-statute" title="Statutory Standard Reference">
            <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
            <span>{statutoryTag}</span>
          </div>
          <div className="compliance-assurance" title="Quality Assurance Standard">
            <i className={slaTag.icon} aria-hidden="true"></i>
            <span>{slaTag.text}</span>
          </div>
        </div>

        {/* Core Scope & Deliverables */}
        <div className="service-scope-wrap">
          <div className="scope-header">
            <span className="scope-title">Key Scope &amp; Deliverables</span>
            <span className="scope-count-badge">Verified Scope</span>
          </div>
          <ul className="scope-list">
            {highlights.map((item, idx) => (
              <li key={idx}>
                <span className="scope-check-dot" aria-hidden="true">
                  <i className="fa-solid fa-check"></i>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Footer with Retainer & Primary Action */}
        <div className="service-card-footer">
          <div className="service-retainer-block">
            <span className="retainer-label">
              {professionalFee && professionalFee > 0 ? 'Statutory Retainer' : 'Statutory Mandate'}
            </span>
            <span className="retainer-price">
              {professionalFee && professionalFee > 0
                ? `₹${professionalFee.toLocaleString('en-IN')}`
                : 'Fixed Retainer'}
            </span>
          </div>

          <div className="service-card-actions">
            <Link
              to={getServicePath(service)}
              className="btn-service-explore"
              aria-label={`Explore service scope for ${title}`}
            >
              <span>Explore Scope</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
            <Link
              to="/contact"
              className="btn-service-quick-consult"
              title="Schedule consultation"
              aria-label="Schedule consultation"
            >
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
