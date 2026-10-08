import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import ThemeToggle from './ThemeToggle';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const suppressPreBanner = location.pathname === '/about' || location.pathname === '/services';
  const { settings, loading } = useSiteContext();
  const [copiedAddress, setCopiedAddress] = useState(false);

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
  const address = (settings?.address && !settings.address.includes('Zaveri') && !settings.address.includes('Kathwada') && !settings.address.includes('Singarva'))
    ? (settings.address.includes('612') ? settings.address : '612, ' + settings.address)
    : '612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';
  const socialLinks = settings?.socialLinks || {};
  const currentYear = new Date().getFullYear();

  const handleCopyAddress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

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
    { label: 'Tax Calculators & Tools', url: '/calculators' },
    { label: 'Compliance & Due Dates', url: '/compliance-calendar' },
    { label: 'Retainer Plans & Pricing', url: '/pricing' },
    { label: 'CA Articleship & Careers', url: '/careers' },
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
    <footer className="executive-footer" id="footer-section">
      {/* Top Gold Accent Line */}
      <div className="footer-top-accent-line"></div>

      {/* Architectural Fine Blueprint Grid Pattern */}
      <div className="footer-grid-pattern" aria-hidden="true"></div>

      {/* Pre-Footer Action Banner (Suppressed on /about and /services to eliminate duplicate CTA collision) */}
      {!suppressPreBanner && (
        <div className="footer-pre-banner-wrapper">
          <div className="container">
            <div className="footer-pre-banner">
              <div className="pre-banner-left">
                <div className="pre-banner-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="pre-banner-text">
                  <div className="pre-banner-kicker">
                    <span className="live-dot"></span>
                    <span>Statutory Advisory Desk &bull; Rapid Response</span>
                  </div>
                  <h3>Need Immediate Notice Assistance or Tax Planning?</h3>
                  <p>Speak directly with certified Chartered Accountants for rapid scrutiny defense and error-free filings.</p>
                </div>
              </div>

              <div className="pre-banner-actions">
                <button className="btn-pre-wa" onClick={handleWhatsAppConsult}>
                  <i className="fab fa-whatsapp"></i>
                  <span>Chat on WhatsApp</span>
                </button>
                <a href={`tel:${rawPhone}`} className="btn-pre-call">
                  <i className="fas fa-phone-alt"></i>
                  <span>+91 95109 84735</span>
                </a>
                <Link to="/contact" className="btn-pre-consult">
                  <i className="fas fa-calendar-check"></i>
                  <span>Book Free Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  className={`footer-social-pill footer-social-${key}`}
                  title={label}
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

          {/* Column 4: Ahmedabad Office & Direct Contacts */}
          <div className="footer-col-contact">
            <h4 className="footer-col-title">Ahmedabad Office</h4>

            {/* Physical Headquarters Card */}
            <div className="footer-office-card">
              <div className="office-card-header">
                <span className="office-card-badge">
                  <i className="fas fa-building"></i>
                  <span>Registered Office &bull; Nikol</span>
                </span>
              </div>

              <div className="office-card-body">
                <strong className="office-building">612, Hill Town Square</strong>
                <p className="office-street">
                  MG Road, Near Ganesh Opera, Nikol,<br />
                  Ahmedabad, Gujarat &ndash; 380049
                </p>
              </div>

              {/* Real Live Interactive Google Map Frame */}
              <div className="footer-live-map-box">
                <iframe
                  title="Shree Chamunda Associates Office Location - Nikol, Ahmedabad"
                  src="https://maps.google.com/maps?q=612,+Hill+Town+Square,+MG+Road,+near+Ganesh+Opera,+Nikol,+Ahmedabad,+Gujarat+380049&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="footer-map-embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-expand-pill"
                  title="Open live Google Maps"
                >
                  <i className="fas fa-arrow-up-right-from-square"></i>
                  <span>Live Map</span>
                </a>
              </div>

              <div className="office-card-actions">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-office-directions"
                  title="Open directions in Google Maps"
                >
                  <i className="fas fa-location-arrow"></i>
                  <span>Get Directions</span>
                </a>
                <button
                  type="button"
                  className={`btn-office-copy ${copiedAddress ? 'copied' : ''}`}
                  onClick={handleCopyAddress}
                  title="Copy office address"
                >
                  <i className={copiedAddress ? 'fas fa-check' : 'fas fa-copy'}></i>
                  <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct Contact Links */}
            <ul className="footer-direct-contacts">
              <li>
                <a href={`tel:${rawPhone}`} className="footer-contact-item">
                  <i className="fas fa-phone-alt contact-item-icon"></i>
                  <div className="contact-item-info">
                    <span className="contact-item-label">Direct Helpline</span>
                    <span className="contact-item-val">{phone}</span>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="footer-contact-item">
                  <i className="fas fa-envelope contact-item-icon"></i>
                  <div className="contact-item-info">
                    <span className="contact-item-label">Advisory Inbox</span>
                    <span className="contact-item-val contact-email-val">{email}</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="footer-contact-item static">
                  <i className="fas fa-clock contact-item-icon"></i>
                  <div className="contact-item-info">
                    <span className="contact-item-label">Consultation Hours</span>
                    <span className="contact-item-val">{workingHours}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <div className="footer-copy-left">
            <p>&copy; {currentYear} Shree Chamunda Associates. All Rights Reserved. &bull; ICAI Regulated Firm &bull; Bank-Grade Confidentiality.</p>
          </div>

          <div className="footer-legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="legal-dot">&bull;</span>
            <Link to="/terms-conditions">Terms &amp; Conditions</Link>
            <span className="legal-dot">&bull;</span>
            <Link to="/refund-policy">Refund Policy</Link>
            <span className="legal-dot footer-toggle-sep">&bull;</span>
            <div className="footer-theme-toggle" title="Display Theme Switcher">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
