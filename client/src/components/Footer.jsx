import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
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

          {/* Column 4: Ahmedabad Desk & Contacts + Google Maps Office Card */}
          <div className="footer-col-contact">
            <div className="desk-column-header">
              <h4 className="footer-col-title">Ahmedabad Desk</h4>
              <span className="desk-live-badge">
                <span className="desk-live-dot"></span>
                <span>Active Desk</span>
              </span>
            </div>

            <div className="desk-master-deck">
              {/* Unified Quick Communications Deck */}
              <div className="desk-comm-card">
                <a href={`tel:${rawPhone}`} className="desk-comm-row">
                  <div className="comm-icon-box">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="comm-info-box">
                    <span className="comm-label">Direct Helpline</span>
                    <strong className="comm-value">{phone}</strong>
                  </div>
                  <span className="comm-action-tag" title="Call directly">
                    <i className="fas fa-arrow-up-right-from-square"></i>
                  </span>
                </a>

                <div className="desk-comm-divider"></div>

                <a href={`mailto:${email}`} className="desk-comm-row">
                  <div className="comm-icon-box">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="comm-info-box">
                    <span className="comm-label">Advisory Inbox</span>
                    <strong className="comm-value comm-email-value">{email}</strong>
                  </div>
                  <span className="comm-action-tag" title="Send email">
                    <i className="fas fa-arrow-up-right-from-square"></i>
                  </span>
                </a>

                <div className="desk-comm-divider"></div>

                <div className="desk-comm-row desk-comm-row-static">
                  <div className="comm-icon-box">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="comm-info-box">
                    <span className="comm-label">Office Consultation Hours</span>
                    <strong className="comm-value">{workingHours}</strong>
                  </div>
                  <span className="comm-timing-chip">Mon &ndash; Sat</span>
                </div>
              </div>

              {/* Architectural Physical Office & Interactive Navigation Card */}
              <div className="footer-office-card">
                <div className="office-card-header">
                  <div className="office-pin-badge">
                    <i className="fas fa-landmark"></i>
                  </div>
                  <div className="office-header-info">
                    <span className="office-tag">Physical Headquarters &bull; Nikol</span>
                    <strong className="office-title">612, Hill Town Square</strong>
                  </div>
                </div>

                <div className="office-address-wrapper">
                  <i className="fas fa-location-dot address-pin-icon"></i>
                  <span className="office-address-text">{address}</span>
                </div>

                {/* Stylized Theme-Adaptive Architectural Map Thumbnail */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-map-thumbnail"
                  title="Open live Google Maps navigation"
                >
                  <div className="map-thumbnail-backdrop">
                    <svg className="map-vector-grid" viewBox="0 0 320 90" preserveAspectRatio="none" aria-hidden="true">
                      {/* Architectural road grid */}
                      <line x1="0" y1="45" x2="320" y2="45" className="grid-road-major" />
                      <line x1="160" y1="0" x2="160" y2="90" className="grid-road-major" />
                      <path d="M 0 20 Q 120 70 320 25" className="grid-road-curve" />
                      <path d="M 30 0 Q 140 50 180 90" className="grid-road-secondary" />
                      <path d="M 220 0 Q 200 45 300 90" className="grid-road-secondary" />
                      <circle cx="160" cy="45" r="28" className="grid-district-zone" />
                    </svg>
                    <span className="map-coord-stamp">
                      <i className="fas fa-crosshairs"></i> 23.0535&deg; N, 72.6712&deg; E
                    </span>
                  </div>

                  <div className="map-thumbnail-center">
                    <div className="map-radar-pin">
                      <span className="pin-pulse-ring"></span>
                      <span className="pin-pulse-ring inner"></span>
                      <i className="fas fa-location-dot"></i>
                    </div>
                  </div>

                  <div className="map-hover-banner">
                    <i className="fas fa-diamond-turn-right"></i>
                    <span>Open Maps</span>
                  </div>
                </a>

                {/* Direct Action Hub */}
                <div className="office-map-actions">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-map-directions"
                  >
                    <i className="fas fa-diamond-turn-right"></i>
                    <span>Get Directions</span>
                  </a>
                  <button
                    type="button"
                    className={`btn-copy-address ${copiedAddress ? 'copied' : ''}`}
                    onClick={handleCopyAddress}
                    title="Copy full office address to clipboard"
                  >
                    <i className={copiedAddress ? 'fas fa-check' : 'fas fa-copy'}></i>
                    <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
                  </button>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
