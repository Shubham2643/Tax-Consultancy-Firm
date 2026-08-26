import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Footer.css';

const Footer = () => {
  const { settings, loading } = useSiteContext();

  if (loading) {
    return (
      <footer className="executive-footer">
        <div className="footer-main-grid container">
          <div className="skeleton skeleton-card" style={{ height: '240px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '240px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '240px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '240px' }}></div>
        </div>
      </footer>
    );
  }

  const phone = settings?.phone || '+91 95109 84735';
  const rawPhone = '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = settings?.address || 'C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat - 382430';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';
  const socialLinks = settings?.socialLinks || {};
  const currentYear = new Date().getFullYear();

  const practiceAreas = [
    { label: 'Direct Tax & ITR Filing', url: '/services' },
    { label: 'GST Returns & ASMT-10 Notice', url: '/services' },
    { label: 'Corporate Audits & Bookkeeping', url: '/services' },
    { label: 'Company & Startup Registration', url: '/services' },
    { label: 'Virtual CFO & MIS Advisory', url: '/services' },
    { label: 'ROC & MCA Statutory Compliance', url: '/services' },
  ];

  const quickLinks = [
    { label: 'Firm Overview', url: '/about' },
    { label: 'Tax Knowledge Hub', url: '/blog' },
    { label: 'Frequently Asked Questions', url: '/faqs' },
    { label: 'Client Portal & Vault', url: '/login' },
    { label: 'Income Tax Portal', url: 'https://www.incometax.gov.in', external: true },
    { label: 'GST Official Portal', url: 'https://www.gst.gov.in', external: true },
  ];

  const allSocials = [
    { key: 'whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp', href: `https://wa.me/919510984735` },
    { key: 'instagram', icon: 'fa-instagram', label: 'Instagram', href: socialLinks?.instagram || '#' },
    { key: 'facebook', icon: 'fa-facebook-f', label: 'Facebook', href: socialLinks?.facebook || '#' },
  ];

  const handleWhatsAppConsult = () => {
    const text = 'Hello CA Team, I would like to consult regarding tax compliance & advisory services.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <footer className="executive-footer">
      {/* Top Gold Accent Line */}
      <div className="footer-top-accent-line"></div>

      {/* Pre-Footer Action Banner */}
      <div className="footer-pre-banner-wrapper">
        <div className="container">
          <div className="footer-pre-banner">
            <div className="pre-banner-left">
              <div className="pre-banner-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="pre-banner-text">
                <span className="pre-banner-kicker">🟢 STATUTORY ADVISORY DESK</span>
                <h3>Need Immediate Notice Assistance or Tax Planning?</h3>
                <p>Speak directly with certified Chartered Accountants for rapid scrutiny defense and error-free filings.</p>
              </div>
            </div>

            <div className="pre-banner-actions">
              <button className="btn-pre-wa" onClick={handleWhatsAppConsult}>
                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
              </button>
              <a href={`tel:${rawPhone}`} className="btn-pre-call">
                <i className="fas fa-phone-alt"></i> +91 95109 84735
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="footer-main-area">
        <div className="container footer-grid-container">
          {/* Column 1: Brand & Firm Mission */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-brand-logo-card">
              <img src="/assets/logo_new.jpg?v=4" alt="Shree Chamunda Associates" className="footer-logo-img" />
              <div className="footer-brand-text">
                <strong>SHREE CHAMUNDA</strong>
                <span>ASSOCIATES &bull; TAX FIRM</span>
              </div>
            </Link>
            <p className="footer-brand-bio">
              A premier Chartered Accountancy &amp; Tax Consultancy firm providing end-to-end direct tax, GST reconciliation, statutory audit, and corporate legal compliance solutions.
            </p>
            <div className="footer-trust-badge">
              <i className="fas fa-certificate"></i>
              <span>100% ICAI Ethics &amp; Confidentiality Standards</span>
            </div>
            <div className="footer-social-row">
              {allSocials.map(({ key, icon, label, href }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-pill"
                >
                  <i className={`fa-brands ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Practice Areas */}
          <div className="footer-col-nav">
            <h4 className="footer-col-title">Practice Areas</h4>
            <ul className="footer-nav-links">
              {practiceAreas.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.url} className="footer-nav-link">
                    <i className="fas fa-chevron-right link-chevron"></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portals & Knowledge */}
          <div className="footer-col-nav">
            <h4 className="footer-col-title">Knowledge &amp; Portals</h4>
            <ul className="footer-nav-links">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  {item.external ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="footer-nav-link">
                      <i className="fas fa-external-link-alt link-chevron external-icon"></i>
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link to={item.url} className="footer-nav-link">
                      <i className="fas fa-chevron-right link-chevron"></i>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Ahmedabad Desk & Contacts */}
          <div className="footer-col-contact">
            <h4 className="footer-col-title">Ahmedabad Desk</h4>
            <div className="footer-contact-stack">
              <a href={`tel:${rawPhone}`} className="contact-entry-card">
                <div className="contact-entry-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-entry-text">
                  <span className="contact-label">Direct Helpline</span>
                  <strong>{phone}</strong>
                </div>
              </a>

              <a href={`mailto:${email}`} className="contact-entry-card">
                <div className="contact-entry-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-entry-text">
                  <span className="contact-label">Official Advisory Inbox</span>
                  <strong>{email}</strong>
                </div>
              </a>

              <div className="contact-entry-card no-hover">
                <div className="contact-entry-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-entry-text">
                  <span className="contact-label">Consultation Hours</span>
                  <strong>{workingHours}</strong>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-entry-card"
              >
                <div className="contact-entry-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-entry-text">
                  <span className="contact-label">Head Office</span>
                  <strong>{address}</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <div className="footer-copy-left">
            <p>&copy; {currentYear} Shree Chamunda Associates. All Rights Reserved. Certified Chartered Advisory.</p>
          </div>

          <div className="footer-legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="legal-dot">&bull;</span>
            <Link to="/terms-of-service">Terms of Service</Link>
            <span className="legal-dot">&bull;</span>
            <Link to="/terms-conditions">Terms &amp; Conditions</Link>
            <span className="legal-dot">&bull;</span>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
