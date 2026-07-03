import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';


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
                <Link to={user.role === 'admin' ? '/admin' : '/portal'} className="top-bar-portal-link">
                  <i className="fas fa-user-circle"></i>
                  <span>{user.role === 'admin' ? 'Admin Panel' : 'My Portal'}</span>
                </Link>
                <button onClick={logout} className="top-bar-logout-btn" title="Logout">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="top-bar-portal-link">
                <i className="fas fa-lock"></i>
                <span>Client Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
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
                    <ul
                      className={`dropdown-menu ${activeDropdown === index ? "dropdown-open" : ""}`}
                    >
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link to={child.href} className="dropdown-link">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="navbar-cta">
              <Link to="/contact" className="btn-cta consultation-nav-btn">
                <i className="fas fa-calendar-alt"></i>
                Free Consultation
              </Link>
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
