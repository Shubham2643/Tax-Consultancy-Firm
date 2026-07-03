import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Footer.css';

const Footer = () => {
  const { settings, loading } = useSiteContext();

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-container">
            <div className="footer-col">
              <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '20px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100%', height: '60px' }}></div>
            </div>
            <div className="footer-col">
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '15px' }}></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton skeleton-text" style={{ width: '60%', height: '14px', marginBottom: '10px' }}></div>
              ))}
            </div>
            <div className="footer-col">
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '15px' }}></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton skeleton-text" style={{ width: '70%', height: '14px', marginBottom: '10px' }}></div>
              ))}
            </div>
            <div className="footer-col">
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '15px' }}></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-text" style={{ width: '90%', height: '14px', marginBottom: '10px' }}></div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const phone = settings?.phone || '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = settings?.address || 'C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat';
  const workingHours = settings?.workingHours || 'Mon-Sat: 10.00 AM-7.00 PM';
  const companyDescription = settings?.companyDescription || 'Shree Chamunda Associates is a well reputed company providing complete solutions for Tax Services.';
  const socialLinks = settings?.socialLinks || {};
  const currentYear = new Date().getFullYear();

  const quickLinks = settings?.quickLinks || [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact Us', url: '/contact' },
    { label: 'Client Portal', url: '/login' },
  ];

  const importantLinks = settings?.importantLinks || [
    { label: 'Income Tax Dept.', url: 'https://www.incometax.gov.in' },
    { label: 'Central Board of Excise & Customs', url: 'https://www.cbic.gov.in' },
    { label: 'Ministry of Corporate Affairs', url: 'https://www.mca.gov.in' },
    { label: 'Employees Provident Fund', url: 'https://www.epfindia.gov.in' },
    { label: 'Goods and Services Tax', url: 'https://www.gst.gov.in' },
  ];

  const allSocials = [
    { key: 'whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    { key: 'instagram', icon: 'fa-instagram', label: 'Instagram' },
    { key: 'facebook', icon: 'fa-facebook-f', label: 'Facebook' },
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1 — Brand */}
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-logo-link">
              <img src="/assets/logo_new.jpg?v=3" alt="Shree Chamunda Associates" className="footer-logo" loading="lazy" />
            </Link>
            <p className="footer-description">{companyDescription}</p>
            <div className="footer-social">
              {allSocials.map(({ key, icon, label }) =>
                socialLinks[key] && socialLinks[key].trim() !== '' ? (
                  <a key={key} href={socialLinks[key].trim()} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <i className={`fa-brands ${icon}`}></i>
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  {link.url.startsWith('http') ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.url}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Important Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Important Links</h3>
            <ul className="footer-list">
              {importantLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="footer-col">
            <h3 className="footer-heading">Get In Touch</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <span>{workingHours}</span>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {address}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <p>&copy; {currentYear} Shree Chamunda Associates. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="footer-divider">|</span>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
