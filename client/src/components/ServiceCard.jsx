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
    if (t.includes('accounting') || t.includes('bookkeeping') || tp === 'accounting') return 'ICAI SA-700 Std';
    if (t.includes('trademark') || t.includes('ipr')) return 'IP India Class Registry';
    if (t.includes('fssai') || t.includes('food')) return 'FSSAI Act 2006';
    if (t.includes('msme') || t.includes('udyam')) return 'MSMED Act 2006';
    if (t.includes('import') || t.includes('iec')) return 'DGFT Customs Code';
    return 'ICAI Regulatory Std';
  };

  // Bespoke service icon mapping with precision domain relevance (no clone icons)
  const getIconClass = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    // System setup & software configurations
    if (t.includes('setup') || t.includes('system') || t.includes('software')) return 'fas fa-sliders';
    // Direct personal & corporate taxes
    if (t.includes('personal tax') || t.includes('itr') || t.includes('income tax')) return 'fas fa-file-invoice-dollar';
    // Ledgers & bookkeeping
    if (t.includes('bookkeeping') || t.includes('ledger') || t.includes('accounts payable')) return 'fas fa-book-bookmark';
    // Audits & Scrutiny
    if (t.includes('audit') || t.includes('assurance') || t.includes('44ab')) return 'fas fa-clipboard-check';
    // GST & Indirect Tax
    if (t.includes('gst') || t.includes('lut') || t.includes('gstr')) return 'fas fa-receipt';
    // Corporate Setup & Incorps
    if (t.includes('pvt') || t.includes('private limited') || t.includes('incorporation')) return 'fas fa-building';
    if (t.includes('llp') || t.includes('partnership')) return 'fas fa-handshake';
    if (t.includes('opc') || t.includes('proprietorship')) return 'fas fa-user-tie';
    // IPR & Trademarks
    if (t.includes('trademark') || t.includes('ipr') || t.includes('copyright')) return 'fas fa-trademark';
    // Food / Health / Quality
    if (t.includes('fssai') || t.includes('food') || t.includes('drug')) return 'fas fa-utensils';
    // Government Licenses
    if (t.includes('msme') || t.includes('udyam')) return 'fas fa-certificate';
    if (t.includes('import') || t.includes('iec') || t.includes('export')) return 'fas fa-ship';
    if (t.includes('shop') || t.includes('gumasta') || t.includes('establishment')) return 'fas fa-store';
    // Payroll & HR
    if (t.includes('payroll') || t.includes('salary') || t.includes('epf') || t.includes('esi')) return 'fas fa-money-check-dollar';
    // CFO & Advisory
    if (t.includes('cfo') || t.includes('mis') || t.includes('financial model') || t.includes('forecast')) return 'fas fa-chart-line';
    // Legal Notices & Scrutiny
    if (t.includes('notice') || t.includes('litigation') || t.includes('appeal') || t.includes('tribunal') || t.includes('dispute')) return 'fas fa-gavel';
    // Fallbacks by category
    if (tp === 'startup') return 'fas fa-rocket';
    if (tp === 'registration') return 'fas fa-stamp';
    if (tp === 'tax') return 'fas fa-file-invoice';
    if (tp === 'accounting') return 'fas fa-calculator';
    return 'fas fa-shield-halved';
  };

  // Category tags mapping with distinct micro-icons
  const categoryConfig = {
    startup: { label: 'Business Setup', icon: 'fas fa-rocket' },
    registration: { label: 'Registrations', icon: 'fas fa-stamp' },
    tax: { label: 'Tax & Compliance', icon: 'fas fa-file-invoice-dollar' },
    accounting: { label: 'Audit & Accounts', icon: 'fas fa-calculator' },
    general: { label: 'Corporate Advisory', icon: 'fas fa-landmark' }
  };
  const currentCategory = categoryConfig[serviceType] || { label: 'Tax & Advisory', icon: 'fas fa-scale-balanced' };

  // Tailored assurance standard per practice area (replaces generic hardcoded text)
  const getSlaTag = (title, type) => {
    const t = (title || '').toLowerCase();
    const tp = (type || '').toLowerCase();
    if (t.includes('setup') || t.includes('system')) return { icon: 'fas fa-check-double', text: 'Audit-Ready Setup' };
    if (t.includes('bookkeeping') || t.includes('ledger')) return { icon: 'fas fa-scale-balanced', text: '3-Way Reconciled' };
    if (t.includes('itr') || t.includes('tax return') || t.includes('personal tax') || tp === 'tax') return { icon: 'fas fa-shield-halved', text: 'Zero Notice Guarantee' };
    if (t.includes('gst')) return { icon: 'fas fa-certificate', text: 'Dual CA Sign-Off' };
    if (t.includes('audit')) return { icon: 'fas fa-stamp', text: 'ICAI SA-700 Standard' };
    if (t.includes('pvt') || t.includes('private limited') || t.includes('incorporation') || tp === 'startup') return { icon: 'fas fa-award', text: 'Govt SPICe+ Certified' };
    if (t.includes('trademark') || t.includes('fssai') || tp === 'registration') return { icon: 'fas fa-file-circle-check', text: '100% Registry Verified' };
    if (t.includes('cfo') || t.includes('mis')) return { icon: 'fas fa-user-tie', text: 'Senior Partner Led' };
    return { icon: 'fas fa-shield-halved', text: 'Statutory Defense Included' };
  };

  // Normalized category key for CSS styling
  const normalizedCategory = ['startup', 'registration', 'tax', 'accounting'].includes(serviceType)
    ? serviceType
    : (serviceType === 'general' ? 'tax' : 'accounting');

  // Standardize Estimated Turnaround Time (clean regex without crowding)
  const getTurnaroundText = () => {
    if (timeline && timeline.trim()) {
      let t = timeline.trim();
      if (/monthly\s*cycle/i.test(t)) {
        return '3 Business Days / Mo';
      }
      if (/monthly\s*\/\s*ongoing/i.test(t)) {
        return 'Ongoing Monthly';
      }
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

  // Default value highlights if deliverables is empty
  const defaultHighlights = [
    '100% Statutory Compliance',
    'Certified CA Partner Verification',
    'Priority E-Filing & Portal Dispatch'
  ];
  const highlights = deliverables && deliverables.length > 0 ? deliverables.slice(0, 3) : defaultHighlights;

  return (
    <article
      className={`service-card card-animate card-cat-${normalizedCategory}`}
      data-category={normalizedCategory}
    >
      {/* Category-themed illuminated accent bar */}
      <div className="card-top-beam"></div>

      {/* Header Row: Icon + Category Tag */}
      <div className="service-card-header">
        <div className="service-icon-tile">
          <i className={getIconClass(title, serviceType)}></i>
        </div>
        <span className="service-category-tag">
          <i className={currentCategory.icon}></i>
          <span>{currentCategory.label}</span>
        </span>
      </div>

      {/* Regulatory Authority & Turnaround Micro-Strip */}
      <div className="service-statutory-strip">
        <span className="service-statutory-pill" title="Statutory Reference Code">
          <i className="fas fa-shield-alt"></i>
          <span>{statutoryTag}</span>
        </span>
        <span
          className="service-tat-badge"
          title="Estimated Turnaround Time"
        >
          <span className="tat-pulse-dot"></span>
          <i className="far fa-clock"></i>
          <span>{tatText}</span>
        </span>
      </div>

      {/* Title & Body */}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-desc">{description}</p>

      {/* Pricing & Value Micro-Bar */}
      <div className="service-meta-strip">
        <div className="service-price-block">
          <span className="price-label">
            {professionalFee && professionalFee > 0 ? 'Statutory Retainer' : 'Statutory Mandate'}
          </span>
          <span className="price-val">
            {professionalFee && professionalFee > 0
              ? `₹${professionalFee.toLocaleString('en-IN')}`
              : 'Fixed Retainer'}
          </span>
        </div>
        <div className="service-sla-tag">
          <i className={slaTag.icon}></i>
          <span>{slaTag.text}</span>
        </div>
      </div>

      {/* Key Deliverables Box */}
      <div className="service-deliverables-box">
        <span className="deliverables-heading">Core Scope &amp; Deliverables</span>
        <ul className="deliverables-list">
          {highlights.map((item, idx) => (
            <li key={idx}>
              <i className="fas fa-check-circle"></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="service-card-footer">
        <Link to={getServicePath(service)} className="btn-service-action" aria-label={`Explore details for ${title}`}>
          <span>Explore Service Scope</span>
          <i className="fas fa-arrow-right btn-arrow"></i>
        </Link>
        <Link to="/contact" className="btn-service-consult" title="Book CA Consultation">
          <i className="fas fa-calendar-check"></i>
          <span>Consult CA</span>
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
