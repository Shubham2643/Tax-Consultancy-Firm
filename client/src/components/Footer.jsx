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
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (loading) {
    return (
      <footer className="bento-footer">
        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="skeleton skeleton-card" style={{ height: '380px', borderRadius: '24px' }}></div>
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
    setTimeout(() => setCopiedAddress(false), 2400);
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const practiceAreas = [
    { label: 'Direct Tax & Scrutiny Assessment', desc: 'Section 143(3), 148 Reassessment & CIT Appeals', badge: 'Direct Tax', icon: 'fa-scale-balanced', color: 'gold', url: '/services' },
    { label: 'GST Returns & ASMT-10 Notice Defense', desc: 'GSTR-9/9C Audit, DRC-01 Defense & ITC Reconciliation', badge: 'GST Law', icon: 'fa-file-invoice-dollar', color: 'emerald', url: '/services' },
    { label: 'Corporate Statutory Audits & Bookkeeping', desc: 'Section 44AB Tax Audits & Ind-AS Compliance', badge: 'Audits', icon: 'fa-calculator', color: 'blue', url: '/services' },
    { label: 'Company & Startup SPICe+ Registration', desc: 'Pvt Ltd, LLP, DPIIT 80-IAC Tax Exemption & 2 DINs', badge: 'SPICe+', icon: 'fa-building', color: 'purple', url: '/services' },
    { label: 'Virtual CFO & MIS Financial Advisory', desc: 'Board Reporting, Cash Runway & Tax Optimization', badge: 'CFO Desk', icon: 'fa-chart-pie', color: 'amber', url: '/services' },
    { label: 'ROC & MCA Secretarial Compliance', desc: 'AOC-4, MGT-7, DIR-3 KYC & Share Governance', badge: 'Secretarial', icon: 'fa-file-contract', color: 'rose', url: '/services' },
  ];

  const quickLinks = [
    { label: 'Client Portal & Secure Vault', url: '/login', badge: 'Client', icon: 'fa-shield-halved' },
    { label: 'Tax Calculators (FY 2025-26)', url: '/calculators', badge: 'New', icon: 'fa-calculator' },
    { label: 'Statutory Compliance Calendar', url: '/compliance-calendar', icon: 'fa-calendar-check' },
    { label: 'Statutory Retainer Mandates', url: '/pricing', icon: 'fa-handshake' },
    { label: 'Firm Profile & Practice Ethics', url: '/about', icon: 'fa-landmark' },
    { label: 'Articleship & CA Careers', url: '/careers', icon: 'fa-user-graduate' },
    { label: 'Income Tax Official Portal', url: 'https://www.incometax.gov.in', external: true, badge: 'Official' },
    { label: 'GST Official Portal', url: 'https://www.gst.gov.in', external: true, badge: 'Official' },
  ];

  const allSocials = [
    { key: 'whatsapp', icon: 'fa-whatsapp', label: 'Direct WhatsApp Desk', href: `https://wa.me/919510984735` },
    { key: 'instagram', icon: 'fa-instagram', label: 'Official Instagram', href: socialLinks?.instagram || '#' },
    { key: 'facebook', icon: 'fa-facebook-f', label: 'Official Facebook', href: socialLinks?.facebook || '#' },
  ];

  const handleWhatsAppConsult = () => {
    const text = 'Hello CA Team, I would like to consult regarding statutory compliance, scrutiny defense & corporate advisory services.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <footer className="bento-footer" id="footer-section">
      {/* Top Gold Gradient Trim */}
      <div className="bento-top-line" aria-hidden="true"></div>

      {/* 1. Pre-Footer Action Gateway */}
      {!suppressPreBanner && (
        <div className="bento-pre-banner-wrapper">
          <div className="container">
            <div className="bento-pre-banner">
              <div className="bento-pre-left">
                <div className="bento-pre-icon">
                  <i className="fas fa-shield-halved" aria-hidden="true"></i>
                </div>
                <div className="bento-pre-text">
                  <div className="bento-live-badge">
                    <span className="live-pulse-dot" aria-hidden="true"></span>
                    <span>STATUTORY ADVISORY DESK &bull; RAPID SCRUTINY DISPATCH</span>
                  </div>
                  <h3 className="bento-pre-heading">Facing a Scrutiny Notice or Preparing for Year-End Filings?</h3>
                  <p className="bento-pre-lead">
                    Direct, confidential consultation with Senior Chartered Accountants. Immediate protection against penalties, interest, and statutory deadlines.
                  </p>
                </div>
              </div>

              <div className="bento-pre-actions">
                <button type="button" className="btn-bento-wa" onClick={handleWhatsAppConsult}>
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                  <span>WhatsApp Desk</span>
                </button>
                <a href={`tel:${rawPhone}`} className="btn-bento-call">
                  <i className="fas fa-phone-alt" aria-hidden="true"></i>
                  <span>+91 95109 84735</span>
                </a>
                <Link to="/contact" className="btn-bento-consult">
                  <i className="fas fa-calendar-check" aria-hidden="true"></i>
                  <span>Book Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main FinTech Bento Grid */}
      <div className="bento-main-section">
        <div className="container">
          {/* Row 1: Brand Anchor + Advisory Desk + Chambers & Map */}
          <div className="bento-grid-row bento-row-top">
            {/* Card 1: Brand & Charter Bento */}
            <div className="bento-card bento-card-brand">
              <div className="bento-card-header">
                <span className="bento-pill-tag">
                  <i className="fas fa-certificate" aria-hidden="true"></i>
                  <span>Chartered Accountancy Practice</span>
                </span>
                <span className="bento-accent-dot"></span>
              </div>

              <Link to="/" className="bento-brand-hero" aria-label="Shree Chamunda Associates Home">
                <div className="bento-logo-badge">
                  <img
                    src="/assets/logo_circle_full.png?v=8"
                    alt="Shree Chamunda Associates Logo"
                    className="bento-logo-img"
                  />
                  <span className="bento-logo-halo" aria-hidden="true"></span>
                </div>
                <div className="bento-brand-typography">
                  <span className="bento-firm-title">SHREE CHAMUNDA ASSOCIATES</span>
                  <div className="bento-firm-tagline">
                    <span className="tag-part">TAX</span>
                    <span className="tag-sep">&bull;</span>
                    <span className="tag-part">AUDIT</span>
                    <span className="tag-sep">&bull;</span>
                    <span className="tag-part">ADVISORY</span>
                  </div>
                </div>
              </Link>

              <p className="bento-brand-manifesto">
                Premier Chartered Accountancy and Corporate Advisory practice delivering precision direct taxation, GST scrutiny defense, statutory ROC compliance, and audit assurance under ICAI regulatory ethics.
              </p>

              <div className="bento-credentials-cluster">
                <div className="bento-credential-item item-icai">
                  <i className="fas fa-shield-check" aria-hidden="true"></i>
                  <span>ICAI Regulated Practice</span>
                </div>
                <div className="bento-credential-item item-security">
                  <i className="fas fa-lock" aria-hidden="true"></i>
                  <span>256-Bit Vault Custody</span>
                </div>
              </div>

              <div className="bento-social-row">
                <span className="bento-social-label">Official Channels:</span>
                <div className="bento-social-icons">
                  {allSocials.map(({ key, icon, label, href }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`bento-social-btn social-${key}`}
                      title={label}
                    >
                      <i className={`fa-brands ${icon}`} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Direct Advisory Desk Bento */}
            <div className="bento-card bento-card-advisory">
              <div className="bento-card-header">
                <span className="bento-pill-tag">
                  <i className="fas fa-headset" aria-hidden="true"></i>
                  <span>Direct Advisory Desk</span>
                </span>
                <span className="bento-status-live">
                  <span className="status-ping"></span>
                  <span>Active</span>
                </span>
              </div>

              <div className="bento-advisory-items">
                {/* Phone Hotline */}
                <a href={`tel:${rawPhone}`} className="bento-advisory-row" title="Call Direct CA Helpline">
                  <div className="bento-row-icon icon-phone">
                    <i className="fas fa-phone-volume" aria-hidden="true"></i>
                  </div>
                  <div className="bento-row-details">
                    <span className="bento-row-kicker">DIRECT CA HELPLINE</span>
                    <span className="bento-row-val">{phone}</span>
                    <span className="bento-row-sub">Tap to Call &bull; Instant Partner Escalation</span>
                  </div>
                  <span className="bento-action-arrow">
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </span>
                </a>

                {/* Email Inbox with 1-click Copy */}
                <div className="bento-advisory-row bento-inbox-row">
                  <a href={`mailto:${email}`} className="bento-inbox-link" title={`Email ${email}`}>
                    <div className="bento-row-icon icon-email">
                      <i className="fas fa-envelope-open-text" aria-hidden="true"></i>
                    </div>
                    <div className="bento-row-details">
                      <span className="bento-row-kicker">ADVISORY INBOX</span>
                      <span className="bento-row-val bento-email-val">{email}</span>
                      <span className="bento-row-sub">Confidential Inquiries</span>
                    </div>
                  </a>
                  <div className="bento-copy-wrap">
                    <button
                      type="button"
                      className={`btn-bento-copy ${copiedEmail ? 'copied' : ''}`}
                      onClick={handleCopyEmail}
                      title="Copy Email Address"
                      aria-label="Copy Email Address"
                    >
                      <i className={copiedEmail ? 'fas fa-check' : 'fas fa-copy'} aria-hidden="true"></i>
                    </button>
                    {copiedEmail && <span className="bento-copy-tooltip">Copied!</span>}
                  </div>
                </div>

                {/* Operating Schedule */}
                <div className="bento-advisory-row bento-hours-row">
                  <div className="bento-row-icon icon-clock">
                    <i className="fas fa-clock" aria-hidden="true"></i>
                  </div>
                  <div className="bento-row-details">
                    <span className="bento-row-kicker">PRACTICE HOURS</span>
                    <span className="bento-row-val">{workingHours}</span>
                    <span className="bento-row-sub">Sun: Emergency Review by Prior Appointment</span>
                  </div>
                </div>
              </div>

              <button type="button" className="bento-wa-consult-btn" onClick={handleWhatsAppConsult}>
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
                <span>Direct WhatsApp Consultation</span>
              </button>
            </div>

            {/* Card 3: Ahmedabad Chambers & Geolocation Bento */}
            <div className="bento-card bento-card-chambers">
              <div className="bento-card-header">
                <span className="bento-pill-tag">
                  <i className="fas fa-landmark" aria-hidden="true"></i>
                  <span>Registered Chambers</span>
                </span>
                <span className="bento-region-badge">Nikol, Ahmedabad</span>
              </div>

              <div className="bento-chambers-address">
                <strong className="chambers-building">612, Hill Town Square</strong>
                <p className="chambers-street">
                  MG Road, Near Ganesh Opera, Nikol,<br />
                  Ahmedabad, Gujarat &ndash; 380049
                </p>
              </div>

              {/* Embedded Mini-Map Frame */}
              <div className="bento-map-frame">
                <iframe
                  title="Shree Chamunda Associates Office Location"
                  src="https://maps.google.com/maps?q=612,+Hill+Town+Square,+MG+Road,+near+Ganesh+Opera,+Nikol,+Ahmedabad,+Gujarat+380049&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="bento-map-iframe"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-map-pill"
                  title="Open live Google Maps"
                >
                  <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  <span>Live Map</span>
                </a>
              </div>

              <div className="bento-chambers-buttons">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bento-directions"
                >
                  <i className="fas fa-location-arrow" aria-hidden="true"></i>
                  <span>Directions</span>
                </a>
                <div className="bento-copy-wrap bento-copy-wrap-addr">
                  <button
                    type="button"
                    className={`btn-bento-address-copy ${copiedAddress ? 'copied' : ''}`}
                    onClick={handleCopyAddress}
                  >
                    <i className={copiedAddress ? 'fas fa-check' : 'fas fa-copy'} aria-hidden="true"></i>
                    <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                  </button>
                  {copiedAddress && <span className="bento-copy-tooltip">Address Copied!</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Practice Disciplines (2-Col Inside) + Portals & Digital Tools */}
          <div className="bento-grid-row bento-row-bottom">
            {/* Card 4: Practice Disciplines Mosaic Bento */}
            <div className="bento-card bento-card-disciplines">
              <div className="bento-card-header">
                <div className="bento-title-group">
                  <span className="bento-gold-indicator" aria-hidden="true"></span>
                  <h4 className="bento-section-title">Practice Disciplines</h4>
                </div>
                <span className="bento-pill-tag">Statutory Advisory</span>
              </div>

              <div className="bento-disciplines-list">
                {practiceAreas.map((item, idx) => (
                  <Link key={idx} to={item.url} className="bento-discipline-row">
                    <div className="discipline-row-left">
                      <div className={`discipline-icon-box icon-${item.color}`}>
                        <i className={`fas ${item.icon}`} aria-hidden="true"></i>
                      </div>
                      <div className="discipline-row-text">
                        <strong className="discipline-row-title">{item.label}</strong>
                        <span className="discipline-row-desc">{item.desc}</span>
                      </div>
                    </div>
                    <div className="discipline-row-right">
                      <span className={`discipline-spec-badge badge-${item.color}`}>{item.badge}</span>
                      <i className="fas fa-chevron-right discipline-row-arrow" aria-hidden="true"></i>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="bento-disciplines-footer">
                <Link to="/services" className="btn-disciplines-more">
                  <div className="disciplines-more-left">
                    <i className="fas fa-layer-group" aria-hidden="true"></i>
                    <span>Explore All 24+ Practice Areas &amp; Retainer Mandates</span>
                  </div>
                  <i className="fas fa-arrow-right disciplines-more-arrow" aria-hidden="true"></i>
                </Link>
              </div>
            </div>

            {/* Card 5: Portals & Knowledge Hub Bento */}
            <div className="bento-card bento-card-portals">
              <div className="bento-card-header">
                <div className="bento-title-group">
                  <span className="bento-gold-indicator" aria-hidden="true"></span>
                  <h4 className="bento-section-title">Portals &amp; Knowledge</h4>
                </div>
                <span className="bento-pill-tag">Digital Vault &amp; Filings</span>
              </div>

              <div className="bento-portals-list">
                {quickLinks.map((item, idx) => (
                  item.external ? (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-portal-item item-external"
                    >
                      <div className="portal-item-left">
                        <i className={`fas ${item.icon || 'fa-arrow-up-right-from-square'}`} aria-hidden="true"></i>
                        <span className="portal-item-label">{item.label}</span>
                      </div>
                      <div className="portal-item-right">
                        {item.badge && <span className="bento-micro-badge badge-official">{item.badge}</span>}
                        <i className="fas fa-arrow-up-right-from-square external-icon" aria-hidden="true"></i>
                      </div>
                    </a>
                  ) : (
                    <Link key={idx} to={item.url} className="bento-portal-item">
                      <div className="portal-item-left">
                        <i className={`fas ${item.icon || 'fa-chevron-right'}`} aria-hidden="true"></i>
                        <span className="portal-item-label">{item.label}</span>
                      </div>
                      <div className="portal-item-right">
                        {item.badge && <span className={`bento-micro-badge badge-${item.badge.toLowerCase()}`}>{item.badge}</span>}
                        <i className="fas fa-chevron-right chevron-icon" aria-hidden="true"></i>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Regulatory & Legal Clearance Bar */}
      <div className="bento-bottom-bar">
        <div className="container bento-bottom-inner">
          {/* Upper Section: Legal Ownership & Navigation Row */}
          <div className="bottom-meta-row">
            {/* Brand & Statutory Attribution */}
            <div className="bottom-firm-attribution">
              <div className="firm-copyright-cluster">
                <span className="firm-c-mark">&copy;</span>
                <span className="firm-c-year">{currentYear}</span>
                <span className="firm-c-entity">Shree Chamunda Associates.</span>
                <span className="firm-c-rights">All Rights Reserved.</span>
              </div>
              <p className="firm-rights-caption">
                Professional tax consultancy, corporate compliance, and statutory financial advisory services.
              </p>
            </div>

            {/* Utilities: Legal Links & High-Grade Appearance Pill */}
            <div className="bottom-utility-dock">
              <nav className="bottom-legal-nav" aria-label="Legal and Regulatory Agreements">
                <Link to="/privacy-policy" className="legal-nav-anchor">Privacy Policy</Link>
                <span className="legal-nav-pipe" aria-hidden="true" />
                <Link to="/terms-conditions" className="legal-nav-anchor">Terms &amp; Conditions</Link>
                <span className="legal-nav-pipe" aria-hidden="true" />
                <Link to="/refund-policy" className="legal-nav-anchor">Refund Policy</Link>
              </nav>

              <div className="bottom-dock-sep" aria-hidden="true" />

              <div className="bottom-theme-capsule">
                <span className="capsule-label">Theme</span>
                <ThemeToggle />
              </div>

              <div className="bottom-dock-sep" aria-hidden="true" />

              <button
                type="button"
                className="bottom-back-to-top"
                onClick={scrollToTop}
                aria-label="Scroll back to top of page"
                title="Back to Top"
              >
                <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
                <span className="back-to-top-label">Top</span>
              </button>
            </div>
          </div>

          {/* Lower Section: Compliance & Security Strip */}
          <div className="bottom-statutory-strip">
            <div className="statutory-badges-group">
              <div className="statutory-badge">
                <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                <span>Statutory Tax &amp; Corporate Regulatory Compliance</span>
              </div>
              <span className="statutory-dot" aria-hidden="true">&bull;</span>
              <div className="statutory-badge">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Sec. 128 Companies Act Compliant Books</span>
              </div>
            </div>

            <div
              className="statutory-bench-badge"
              title="Judicial Bench Active • In-Person & Digital Filings Maintained Across Gujarat High Court & ITAT"
            >
              <span className="statutory-bench-dot" aria-hidden="true">
                <span className="pulse-ring" aria-hidden="true"></span>
              </span>
              <span>Jurisdiction: Ahmedabad &bull; High Court of Gujarat &amp; ITAT Bench</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
