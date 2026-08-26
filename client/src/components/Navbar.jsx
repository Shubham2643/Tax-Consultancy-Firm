import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const formatDropdownLabel = (label) => {
  if (label === 'Sole Properties') return 'Sole Proprietorship';
  if (label.includes('Hindu Undividable')) return 'Hindu Undivided Family (HUF)';
  if (label === 'One Person Company(OPC)') return 'One Person Company (OPC)';
  return label;
};

const getDropdownMeta = (label) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('private limited')) return { icon: 'fas fa-building', desc: 'MCA SPICe+ & 2 DINs allotment' };
  if (normalized.includes('limited liability') || normalized.includes('llp')) return { icon: 'fas fa-handshake', desc: 'LLP agreement & legal status' };
  if (normalized.includes('sole')) return { icon: 'fas fa-user-tie', desc: 'Single owner MSME registration' };
  if (normalized.includes('huf') || normalized.includes('hindu')) return { icon: 'fas fa-users', desc: 'Family tax entity & separate PAN' };
  if (normalized.includes('public limited')) return { icon: 'fas fa-landmark', desc: 'Large capital & shareholding' };
  if (normalized.includes('one person') || normalized.includes('opc')) return { icon: 'fas fa-user-shield', desc: 'Corporate status for solo founders' };
  if (normalized.includes('partnership')) return { icon: 'fas fa-briefcase', desc: 'Deed drafting & ROF filing' };
  if (normalized.includes('e-commerce')) return { icon: 'fas fa-globe', desc: 'Online seller statutory compliance' };
  if (normalized.includes('gst')) return { icon: 'fas fa-file-invoice-dollar', desc: 'Monthly returns & GSTR-2B ITC' };
  if (normalized.includes('income tax') || normalized.includes('itr')) return { icon: 'fas fa-calculator', desc: 'Direct tax filing & 44ADA relief' };
  if (normalized.includes('tds')) return { icon: 'fas fa-receipt', desc: 'Form 24Q / 26Q quarterly returns' };
  if (normalized.includes('audit')) return { icon: 'fas fa-search-dollar', desc: 'Statutory Section 44AB audits' };
  if (normalized.includes('bookkeeping') || normalized.includes('accounting')) return { icon: 'fas fa-book', desc: 'Monthly ledger & P&L accounting' };
  if (normalized.includes('cfo')) return { icon: 'fas fa-crown', desc: 'Executive financial leadership' };
  if (normalized.includes('trademark') || normalized.includes('ipr')) return { icon: 'fas fa-trademark', desc: 'Brand protection & IP registry' };
  if (normalized.includes('import') || normalized.includes('iec')) return { icon: 'fas fa-ship', desc: 'DGFT Import-Export code setup' };
  if (normalized.includes('fssai') || normalized.includes('food')) return { icon: 'fas fa-utensils', desc: 'Food business statutory licensing' };
  if (normalized.includes('msme') || normalized.includes('udyam')) return { icon: 'fas fa-certificate', desc: 'Govt subsidies & priority loans' };
  return { icon: 'fas fa-shield-alt', desc: 'Chartered compliance solution' };
};

const Navbar = () => {
  const { settings, navMenu } = useSiteContext();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleLinkClick = (e, item, index) => {
    if (isMobile && item.children && item.children.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      handleDropdownToggle(index);
    }
  };

  const phone = settings?.phone || '+91 95109 84735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';

  const getSocialLink = (platform) => {
    const defaultLinks = {
      facebook: "https://www.facebook.com/share/1BRPjWQVX8/",
      instagram:
        "https://www.instagram.com/shree_chamunda_associate?igsh=Z3BlOGNhdXc4bGNm",
      whatsapp: "https://wa.me/919510984735",
    };
    const val = settings?.socialLinks?.[platform];
    if (!val || val === '#' || val.trim() === '') {
      return defaultLinks[platform];
    }
    return val.trim();
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-contact">
            <a href={`tel:${phone}`} className="top-bar-item">
              <i className="fas fa-phone-alt"></i>
              <span>{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="top-bar-item">
              <i className="fas fa-envelope"></i>
              <span>{email}</span>
            </a>
          </div>
          <div className="top-bar-right">
            <div className="top-bar-social">
              {getSocialLink('whatsapp') && (
                <a
                  href={getSocialLink('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {getSocialLink('instagram') && (
                <a
                  href={getSocialLink('instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {getSocialLink('facebook') && (
                <a
                  href={getSocialLink('facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
            </div>
            <div className="top-bar-divider"></div>
            {user ? (
              <div className="top-bar-auth-group">
                <Link to={user.role === 'admin' ? '/admin' : '/portal'} className="top-bar-portal-btn logged-in">
                  <span className="live-pulse-dot"></span>
                  <i className="fas fa-user-circle"></i>
                  <span className="portal-btn-text">{user.role === 'admin' ? 'Admin Panel' : 'My Portal'}</span>
                </Link>
                <button onClick={logout} className="top-bar-logout-btn" title="Logout Session">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="top-bar-portal-btn">
                <span className="portal-shield-icon">
                  <i className="fas fa-lock"></i>
                </span>
                <span className="portal-btn-text">Client Portal</span>
                <span className="portal-btn-badge">
                  <span>Login</span>
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${isMobileOpen ? "navbar-mobile-active" : ""}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <img
              src="/assets/logo_new.jpg?v=3"
              alt="Shree Chamunda Associates"
            />
          </Link>

          <div
            className={`navbar-menu ${isMobileOpen ? "navbar-menu-open" : ""}`}
          >
            {isMobileOpen && (
              <button className="navbar-menu-close-btn" onClick={toggleMobile} aria-label="Close menu">
                <i className="fas fa-times"></i>
              </button>
            )}
            <ul className="navbar-nav">
              {navMenu.map((item, index) => (
                <li
                  key={index}
                  className={`nav-item ${item.children && item.children.length > 0 ? "has-dropdown" : ""} ${location.pathname === item.href ? "active" : ""}`}
                  onMouseEnter={() =>
                    item.children?.length > 0 && setActiveDropdown(index)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className="nav-link"
                    onClick={(e) => handleLinkClick(e, item, index)}
                  >
                    {item.label}
                    {item.children && item.children.length > 0 && (
                      <i className="fas fa-chevron-down dropdown-icon"></i>
                    )}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div
                      className={`dropdown-megamenu-panel ${item.children.length > 4 ? 'megamenu-grid' : 'megamenu-single'} ${activeDropdown === index ? "dropdown-open" : ""}`}
                    >
                      <div className="megamenu-items-container">
                        {item.children.map((child, childIndex) => {
                          const meta = getDropdownMeta(child.label);
                          const cleanTitle = formatDropdownLabel(child.label);
                          return (
                            <Link
                              key={childIndex}
                              to={child.href}
                              className="dropdown-rich-tile"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMobileOpen(false);
                              }}
                            >
                              <div className="dropdown-tile-icon">
                                <i className={meta.icon}></i>
                              </div>
                              <div className="dropdown-tile-info">
                                <span className="dropdown-tile-title">{cleanTitle}</span>
                                <span className="dropdown-tile-desc">{meta.desc}</span>
                              </div>
                              <div className="dropdown-tile-arrow">
                                <i className="fas fa-chevron-right"></i>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="dropdown-bottom-strip">
                        <Link to="/contact" className="dropdown-strip-link">
                          <div className="strip-left">
                            <span className="strip-sparkle"><i className="fas fa-headset"></i></span>
                            <span>Need consultation choosing? <strong>Speak with a CA Partner</strong></span>
                          </div>
                          <span className="strip-cta-text">Contact Desk &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="navbar-cta-group">
              {/* Mobile Dedicated Client Portal Link */}
              <div className="mobile-only-auth-block">
                {user ? (
                  <div className="mobile-auth-strip">
                    <Link 
                      to={user.role === 'admin' ? '/admin' : '/portal'} 
                      className="mobile-portal-btn logged-in"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className="live-pulse-dot"></span>
                      <i className="fas fa-user-circle"></i>
                      <span>{user.role === 'admin' ? 'Admin Panel' : 'My Client Portal'}</span>
                    </Link>
                    <button onClick={logout} className="mobile-logout-btn" title="Logout">
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="mobile-portal-btn"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <i className="fas fa-lock"></i>
                    <span>Client Portal Login</span>
                    <i className="fas fa-chevron-right mobile-arrow-icon"></i>
                  </Link>
                )}
              </div>

              <div className="navbar-cta">
                <Link to="/contact" className="nav-consultation-btn" onClick={() => setIsMobileOpen(false)}>
                  <span className="consultation-pulse-wrap">
                    <span className="consultation-live-dot"></span>
                  </span>
                  <span className="consultation-btn-text">Free Consultation</span>
                  <span className="consultation-arrow-badge">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <button
            className="navbar-toggler"
            onClick={toggleMobile}
            aria-label="Toggle navigation"
          >
            <span
              className={`hamburger ${isMobileOpen ? "hamburger-open" : ""}`}
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="navbar-overlay" onClick={toggleMobile}></div>
      )}
    </>
  );
};

export default Navbar;
