import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import ServiceSearchModal from './ServiceSearchModal';
import './Navbar.css';

const formatDropdownLabel = (label) => {
  if (label === 'Sole Properties') return 'Sole Proprietorship';
  if (label.includes('Hindu Undividable')) return 'Hindu Undivided Family (HUF)';
  if (label === 'One Person Company(OPC)') return 'One Person Company (OPC)';
  return label;
};

const getDropdownMeta = (label) => {
  const normalized = (label || '').toLowerCase();
  // Start a Business
  if (normalized.includes('private limited')) return { icon: 'fas fa-building', desc: 'MCA SPICe+ & 2 DINs allotment' };
  if (normalized.includes('limited liability') || normalized.includes('llp')) return { icon: 'fas fa-handshake', desc: 'LLP agreement & legal corporate status' };
  if (normalized.includes('sole')) return { icon: 'fas fa-user-tie', desc: 'Single owner MSME registration' };
  if (normalized.includes('huf') || normalized.includes('hindu')) return { icon: 'fas fa-users', desc: 'Family tax entity & separate PAN creation' };
  if (normalized.includes('public limited')) return { icon: 'fas fa-landmark', desc: 'Large capital & multi-shareholder setup' };
  if (normalized.includes('one person') || normalized.includes('opc')) return { icon: 'fas fa-user-shield', desc: 'Corporate status for solo founders' };
  if (normalized.includes('partnership')) return { icon: 'fas fa-briefcase', desc: 'Deed drafting & ROF filing' };
  if (normalized.includes('e-commerce')) return { icon: 'fas fa-cart-shopping', desc: 'Online seller statutory compliance' };

  // Registration
  if (normalized.includes('government registration')) return { icon: 'fas fa-building-columns', desc: 'Municipal trade licenses & Shop Act' };
  if (normalized.includes('startup') || normalized.includes('startup-india')) return { icon: 'fas fa-seedling', desc: 'DPIIT certificate & 80-IAC tax exemption' };
  if (normalized.includes('professional tax')) return { icon: 'fas fa-id-badge', desc: 'Gujarat PTEC & PTRC employer setup' };
  if (normalized.includes('pan application') || (normalized.includes('pan') && !normalized.includes('company'))) return { icon: 'fas fa-id-card', desc: 'Form 49A allotment & physical card' };
  if (normalized.includes('tan application') || normalized.includes('tan')) return { icon: 'fas fa-receipt', desc: 'Form 49B deductor account for TDS' };
  if (normalized.includes('digital signature') || normalized.includes('dsc')) return { icon: 'fas fa-key', desc: 'Class-3 USB cryptotoken for MCA & IT' };
  if (normalized.includes('esi') || normalized.includes('esic')) return { icon: 'fas fa-hospital-user', desc: 'Employee State Insurance & medical cover' };
  if (normalized.includes('pf') && !normalized.includes('return')) return { icon: 'fas fa-users-cog', desc: 'Provident Fund statutory registration' };
  if (normalized.includes('import') || normalized.includes('iec')) return { icon: 'fas fa-ship', desc: 'DGFT Import-Export code setup' };
  if (normalized.includes('udyam') || normalized.includes('msme')) return { icon: 'fas fa-certificate', desc: 'Govt subsidies & priority credit scheme' };
  if (normalized.includes('gst registration') || normalized.includes('gst')) return { icon: 'fas fa-file-invoice-dollar', desc: '15-digit GSTIN & Aadhaar e-KYC' };

  // Return
  if (normalized.includes('income tax') || normalized.includes('itr')) return { icon: 'fas fa-calculator', desc: 'Direct tax filing & 44ADA relief' };
  if (normalized.includes('pf return')) return { icon: 'fas fa-users-cog', desc: 'Monthly ECR filing & challan generation' };
  if (normalized.includes('tds return') || normalized.includes('tds')) return { icon: 'fas fa-receipt', desc: 'Form 24Q / 26Q quarterly returns' };
  if (normalized.includes('e-way') || normalized.includes('eway')) return { icon: 'fas fa-truck-fast', desc: 'Consignment e-way portal generation' };
  if (normalized.includes('pf & esic') || normalized.includes('esic return')) return { icon: 'fas fa-shield-halved', desc: 'Dual statutory labor compliance filing' };

  // Accounting & Compliance
  if (normalized.includes('audit')) return { icon: 'fas fa-search-dollar', desc: 'Statutory Section 44AB audits' };
  if (normalized.includes('bookkeeping') || normalized.includes('book keeping') || normalized.includes('accounting')) return { icon: 'fas fa-book', desc: 'Monthly ledger & P&L accounting' };
  if (normalized.includes('roc') || normalized.includes('annual filing')) return { icon: 'fas fa-file-contract', desc: 'AOC-4 & MGT-7 annual statutory reporting' };
  if (normalized.includes('cfo')) return { icon: 'fas fa-crown', desc: 'Executive financial leadership' };

  // Others / Resources & Direct Reach
  if (normalized.includes('blog')) return { icon: 'fas fa-newspaper', desc: 'Tax circulars, case studies & updates' };
  if (normalized.includes('faq')) return { icon: 'fas fa-circle-question', desc: 'Common compliance queries answered' };
  if (normalized.includes('contact')) return { icon: 'fas fa-headset', desc: 'Direct access to senior advisory chambers' };
  if (normalized.includes('trademark') || normalized.includes('ipr')) return { icon: 'fas fa-trademark', desc: 'Brand protection & IP registry' };
  if (normalized.includes('copyright')) return { icon: 'fas fa-copyright', desc: 'Creative work & software protection' };
  if (normalized.includes('food') || normalized.includes('fssai')) return { icon: 'fas fa-utensils', desc: 'Food business statutory licensing' };
  if (normalized.includes('iso')) return { icon: 'fas fa-award', desc: 'ISO 9001/27001 standard compliance' };
  if (normalized.includes('legal') || normalized.includes('agreement')) return { icon: 'fas fa-scale-balanced', desc: 'Shareholders & vendor contract drafting' };

  return { icon: 'fas fa-shield-halved', desc: 'Chartered corporate compliance' };
};

const getTopCategoryIcon = (label) => {
  const normalized = (label || '').toLowerCase();
  if (normalized.includes('home')) return 'fas fa-house';
  if (normalized.includes('about')) return 'fas fa-building-user';
  if (normalized.includes('start') || normalized.includes('business')) return 'fas fa-rocket';
  if (normalized.includes('registration')) return 'fas fa-stamp';
  if (normalized.includes('return') || normalized.includes('tax')) return 'fas fa-file-invoice-dollar';
  if (normalized.includes('accounting') || normalized.includes('compliance')) return 'fas fa-calculator';
  if (normalized.includes('service')) return 'fas fa-briefcase';
  if (normalized.includes('other')) return 'fas fa-folder-open';
  return 'fas fa-layer-group';
};

const Navbar = () => {
  const { settings, navMenu } = useSiteContext();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const location = useLocation();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
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

  const handleMouseEnter = (index) => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (navMenu[index]?.children?.length > 0) {
      setActiveDropdown(index);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const handleDropdownItemClick = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    setIsMobileOpen(false);
  };

  const handleLinkClick = (e, item, index) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      handleDropdownToggle(index);
    } else {
      handleDropdownItemClick();
    }
  };

  // Close dropdown on outside click or window scroll
  useEffect(() => {
    if (activeDropdown === null) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.navbar-center-nav') && !e.target.closest('.dropdown-megamenu-panel')) {
        setActiveDropdown(null);
      }
    };
    const handleScrollClose = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', handleScrollClose, { passive: true });
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScrollClose);
    };
  }, [activeDropdown]);

  const handleMobileItemClick = (e, item, index) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      handleDropdownToggle(index);
    } else {
      setIsMobileOpen(false);
      setActiveDropdown(null);
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

  const isItemActive = (item) => {
    if (!item) return false;

    const normalize = (path) =>
      decodeURIComponent(path || '')
        .replace(/[-_ ]+/g, '-')
        .replace(/\/+$/, '')
        .toLowerCase();

    const currentPath = normalize(location.pathname);
    const itemPath = normalize(item.href);

    // 1. Exact match
    if (currentPath === itemPath) return true;

    // 2. If item has children, check if current path belongs to any child
    if (item.children && item.children.length > 0) {
      return item.children.some((c) => {
        if (!c.href) return false;
        const childPath = normalize(c.href);
        return currentPath === childPath || (childPath !== '' && currentPath.startsWith(childPath + '/'));
      });
    }

    // 3. Special handling for general "Services" tab:
    // Only active on /services or services not categorized under any megamenu dropdown
    if (item.href === '/services') {
      if (currentPath === '/services') return true;
      const isOwnedByOtherCategory = navMenu.some(
        (m) =>
          m !== item &&
          m.children?.some((c) => {
            if (!c.href) return false;
            return currentPath === normalize(c.href);
          })
      );
      return !isOwnedByOtherCategory && currentPath.startsWith('/services');
    }

    // 4. Other sub-routes (e.g. /blog/:id)
    if (item.href && item.href !== '/' && currentPath.startsWith(itemPath + '/')) {
      return true;
    }

    return false;
  };

  const getAlignmentClass = (index, total) => {
    if (index <= 1) return 'dropdown-align-left';
    if (index >= total - 2) return 'dropdown-align-right';
    return 'dropdown-align-center';
  };

  return (
    <>
      {/* Top Bar — Executive Intelligence & Status Line */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            {/* Live Office Status Badge */}
            <div className="top-status-pill" title="Operational Office Hours">
              <span className="top-status-dot">
                <span className="status-ping"></span>
                <span className="status-core"></span>
              </span>
              <span className="top-status-label">Office Open :</span>
              <span className="top-status-hours">
                {settings?.workingHours || "Mon - Sat: 10:00 AM - 7:00 PM"}
              </span>
            </div>

            <div className="top-bar-sep top-bar-hide-sm"></div>

            {/* Direct Contact Chips with Micro-Pill Polish & Tactical Feedback */}
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
              className="top-contact-chip"
              title="Click to call CA advisory desk (+91 95109 84735)"
            >
              <span className="top-chip-icon"><i className="fas fa-phone-alt"></i></span>
              <span className="top-chip-text">{phone}</span>
              <span className="top-chip-cue"><i className="fas fa-arrow-right"></i></span>
            </a>

            <a 
              href={`mailto:${email}`} 
              className="top-contact-chip top-bar-hide-md"
              title="Click to email Shree Chamunda Associates"
            >
              <span className="top-chip-icon"><i className="fas fa-envelope"></i></span>
              <span className="top-chip-text">{email}</span>
              <span className="top-chip-cue"><i className="fas fa-arrow-right"></i></span>
            </a>
          </div>

          <div className="top-bar-right">
            <div className="top-bar-social">
              {getSocialLink('whatsapp') && (
                <a
                  href={getSocialLink('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Direct WhatsApp Advisory Desk"
                  className="social-circle-btn wa-circle-btn"
                  title="Direct WhatsApp Advisory Desk"
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
                  className="social-circle-btn ig-circle-btn"
                  title="Instagram"
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
                  className="social-circle-btn fb-circle-btn"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
            </div>

            <div className="top-bar-divider"></div>

            {/* Client Portal Vault Capsule */}
            {user ? (
              <div className="top-bar-auth-capsule">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/portal'}
                  className="capsule-profile-btn"
                  title={user.role === 'admin' ? 'Open CA Admin Dashboard' : 'Open Client Portal'}
                >
                  <span className="capsule-role-icon">
                    <i className={user.role === 'admin' ? 'fas fa-user-shield' : 'fas fa-user'}></i>
                  </span>
                  <span className="capsule-label">
                    {user.role === 'admin' ? 'Admin Panel' : 'My Portal'}
                  </span>
                  <span className="capsule-cue-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </Link>
                <div className="capsule-inner-divider"></div>
                <button
                  onClick={logout}
                  className="capsule-logout-btn"
                  title="Logout Session"
                  aria-label="Logout Session"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="top-bar-portal-btn">
                <span className="portal-shield-icon">
                  <i className="fas fa-shield-alt"></i>
                </span>
                <span className="portal-btn-text">Client Vault</span>
                <span className="portal-btn-badge">
                  <span>Login</span>
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar — Executive Sticky Header */}
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${isMobileOpen ? "navbar-mobile-active" : ""}`}>
        <div className="navbar-inner">
          {/* Logo with Halo Accent & Geometric Wordmark */}
          <Link to="/" className="navbar-logo" aria-label="Shree Chamunda Associates Home">
            <div className="navbar-logo-badge">
              <img
                src="/assets/logo_circle_full.png?v=6"
                alt="Shree Chamunda Associates"
                className="navbar-logo-img"
              />
              <span className="logo-ring-accent"></span>
            </div>
            <div className="navbar-logo-wordmark">
              <span className="wordmark-title">SHREE CHAMUNDA</span>
              <div className="wordmark-tagline">
                <span className="wordmark-tag-item">TAX</span>
                <span className="wordmark-dot">•</span>
                <span className="wordmark-tag-item">AUDIT</span>
                <span className="wordmark-dot">•</span>
                <span className="wordmark-tag-item">ADVISORY</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-center-nav">
            <ul className="navbar-nav">
              {navMenu.map((item, index) => {
                const active = isItemActive(item);
                const alignClass = getAlignmentClass(index, navMenu.length);
                const isDropdownOpen = activeDropdown === index;
                const showIndicator = active && (activeDropdown === null || isDropdownOpen);
                return (
                  <li
                    key={index}
                    className={`nav-item ${item.children && item.children.length > 0 ? "has-dropdown" : ""} ${active ? "active" : ""} ${isDropdownOpen ? "dropdown-active" : ""}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.href}
                      className="nav-link"
                      onClick={(e) => handleLinkClick(e, item, index)}
                    >
                      <span className="nav-link-label">{item.label}</span>
                      {item.children && item.children.length > 0 && (
                        <i className="fas fa-chevron-down dropdown-icon"></i>
                      )}
                      {showIndicator && <span className="nav-link-indicator"></span>}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {item.children && item.children.length > 0 && (
                      <div
                        className={`dropdown-megamenu-panel ${item.children.length > 4 ? 'megamenu-grid' : 'megamenu-single'} ${alignClass} ${isDropdownOpen ? "dropdown-open" : ""}`}
                      >
                        <div className="dropdown-caret-arrow"></div>
                        <div className="megamenu-header-bar">
                          <div className="megamenu-header-left">
                            <span className="megamenu-category-pill">
                              <span className="megamenu-live-dot"></span>
                              <i className={getTopCategoryIcon(item.label)}></i>
                              <span>{item.label}</span>
                            </span>
                            <span className="megamenu-sublabel">
                              {item.label === 'Others' ? 'Knowledge Hub & Practice Support' : 'Statutory Compliance & Filings'}
                            </span>
                          </div>
                          <span className="megamenu-count-badge">
                            {item.children.length} {item.label === 'Others' ? 'Resources' : 'Services'}
                          </span>
                        </div>

                        <div className="megamenu-items-container">
                          {item.children.map((child, childIndex) => {
                            const meta = getDropdownMeta(child.label);
                            const cleanTitle = formatDropdownLabel(child.label);
                            const isChildActive = location.pathname === child.href;
                            return (
                              <Link
                                key={childIndex}
                                to={child.href}
                                className={`dropdown-rich-tile ${isChildActive ? 'tile-active' : ''}`}
                                onClick={handleDropdownItemClick}
                              >
                                <div className="dropdown-tile-icon">
                                  <i className={meta.icon}></i>
                                </div>
                                <div className="dropdown-tile-info">
                                  <div className="dropdown-tile-title-row">
                                    <span className="dropdown-tile-title">{cleanTitle}</span>
                                    {isChildActive && <span className="active-tile-dot"></span>}
                                  </div>
                                  <span className="dropdown-tile-desc">{meta.desc}</span>
                                </div>
                                <div className="dropdown-tile-arrow">
                                  <i className="fas fa-arrow-right"></i>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="dropdown-bottom-strip">
                          <Link
                            to="/contact"
                            className="dropdown-strip-link"
                            onClick={handleDropdownItemClick}
                          >
                            <div className="strip-left">
                              <span className="strip-sparkle"><i className="fas fa-user-tie"></i></span>
                              <div className="strip-text-group">
                                <span className="strip-bold">Need customized advisory?</span>
                                <span className="strip-sub">Schedule a 1-on-1 strategy call with our CA team</span>
                              </div>
                            </div>
                            <span className="strip-cta-pill">
                              <span>Book Free Call</span>
                              <i className="fas fa-arrow-right"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop Right Action Suite */}
          <div className="navbar-right-actions">
            {/* Ultra-Modern Search Bar with Micro-Badge & Interactive Hover Beam */}
            <button
              type="button"
              className="nav-search-bar"
              onClick={() => setIsSearchOpen(true)}
              title="Search services, calculators & guides..."
              aria-label="Search Services"
            >
              <span className="nav-search-icon-badge">
                <i className="fas fa-search nav-search-icon"></i>
              </span>
              <span className="nav-search-placeholder">Search services...</span>
              <span className="nav-search-hover-cue" aria-hidden="true">
                <i className="fas fa-arrow-right"></i>
              </span>
            </button>

            {/* 11/10 Executive Free Consultation CTA */}
            <Link to="/contact" className="nav-consultation-btn">
              <span className="consultation-btn-text">Book Consultation</span>
              <span className="consultation-arrow-badge">
                <i className="fas fa-arrow-right"></i>
              </span>
            </Link>

            {/* Mobile Hamburger Toggler */}
            <button
              className="navbar-toggler"
              onClick={toggleMobile}
              aria-label="Toggle navigation"
            >
              <span className={`hamburger ${isMobileOpen ? "hamburger-open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="navbar-overlay" onClick={toggleMobile} aria-label="Close navigation overlay"></div>
      )}

      {/* Mobile Slide-Over Drawer (Outside <nav> stacking context) */}
      <div 
        className={`navbar-mobile-drawer ${isMobileOpen ? "drawer-open" : ""}`}
        aria-hidden={!isMobileOpen}
      >
        <div className="mobile-drawer-header">
          <Link to="/" className="mobile-drawer-brand" onClick={() => setIsMobileOpen(false)}>
            <div className="mobile-drawer-badge">
              <img src="/assets/logo_circle_full.png?v=7" alt="Shree Chamunda Associates" className="mobile-drawer-logo" />
              <span className="mobile-logo-ring"></span>
            </div>
            <div className="mobile-drawer-title">
              <strong>SHREE CHAMUNDA</strong>
              <span>TAX &bull; AUDIT &bull; ADVISORY</span>
            </div>
          </Link>
          <button className="mobile-drawer-close-btn" onClick={toggleMobile} aria-label="Close navigation menu">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mobile-drawer-body">
          {/* Mobile Client Portal Access Card */}
          <div className="mobile-auth-block">
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
                <button onClick={logout} className="mobile-logout-btn" title="Logout Session">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="mobile-portal-btn"
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="mobile-portal-left">
                  <span className="mobile-lock-icon"><i className="fas fa-lock"></i></span>
                  <div className="mobile-portal-meta">
                    <strong>Client Document Vault</strong>
                    <span>Login to track filings & pay</span>
                  </div>
                </div>
                <i className="fas fa-chevron-right mobile-arrow-icon"></i>
              </Link>
            )}
          </div>

          {/* Mobile Quick Search Bar */}
          <button 
            type="button" 
            className="mobile-search-trigger"
            onClick={() => {
              setIsMobileOpen(false);
              setIsSearchOpen(true);
            }}
          >
            <i className="fas fa-search"></i>
            <span>Search 30+ CA & Tax Services...</span>
          </button>

          {/* Mobile Nav Links with Smooth Accordion */}
          <ul className="mobile-nav-list">
            {navMenu.map((item, index) => {
              const active = isItemActive(item);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = activeDropdown === index;
              return (
                <li key={index} className={`mobile-nav-item ${active ? 'item-active' : ''}`}>
                  <div className="mobile-nav-row">
                    <Link
                      to={item.href}
                      className={`mobile-nav-link ${location.pathname === item.href ? 'active' : ''}`}
                      onClick={(e) => handleMobileItemClick(e, item, index)}
                    >
                      <div className="mobile-nav-link-content">
                        <span className="mobile-item-icon">
                          <i className={getTopCategoryIcon(item.label)}></i>
                        </span>
                        <span className="mobile-item-title">{item.label}</span>
                      </div>
                      {hasChildren && (
                        <span className="mobile-item-count">{item.children.length}</span>
                      )}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        className={`mobile-accordion-toggle ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => handleDropdownToggle(index)}
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={isExpanded}
                      >
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    )}
                  </div>

                  {hasChildren && (
                    <div className={`mobile-accordion-collapse ${isExpanded ? "expanded" : ""}`}>
                      <div className="mobile-sub-accordion-inner">
                        {item.children.map((child, childIndex) => {
                          const meta = getDropdownMeta(child.label);
                          const cleanTitle = formatDropdownLabel(child.label);
                          const isChildActive = location.pathname === child.href;
                          return (
                            <Link
                              key={childIndex}
                              to={child.href}
                              className={`mobile-sub-tile ${isChildActive ? 'child-active' : ''}`}
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMobileOpen(false);
                              }}
                            >
                              <div className="mobile-sub-icon">
                                <i className={meta.icon}></i>
                              </div>
                              <div className="mobile-sub-text">
                                <span className="mobile-sub-title">{cleanTitle}</span>
                                <span className="mobile-sub-desc">{meta.desc}</span>
                              </div>
                              <i className="fas fa-chevron-right mobile-sub-arrow"></i>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mobile-drawer-footer">
          <Link to="/contact" className="mobile-consultation-btn" onClick={() => setIsMobileOpen(false)}>
            <div className="mobile-consultation-left">
              <span className="mobile-cta-status-dot"></span>
              <span className="mobile-consultation-text">Book Free Consultation</span>
            </div>
            <span className="mobile-consultation-arrow">
              <i className="fas fa-arrow-right"></i>
            </span>
          </Link>

          <div className="mobile-quick-contacts">
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mobile-contact-pill call">
              <i className="fas fa-phone-alt"></i>
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello CA Team, I would like to consult with a Chartered Accountant.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-contact-pill wa"
            >
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
            <a href={`mailto:${email}`} className="mobile-contact-pill email">
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Service Search Command Palette */}
      <ServiceSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navMenu={navMenu}
      />
    </>
  );
};

export default Navbar;
