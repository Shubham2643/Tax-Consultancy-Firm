import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import ServiceSearchModal from './ServiceSearchModal';
import ThemeToggle from './ThemeToggle';
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

  if (normalized.includes('calculator') || normalized.includes('tax-tools')) return { icon: 'fas fa-calculator', desc: 'Old vs New Tax Regime & GST Tools' };
  if (normalized.includes('due date') || normalized.includes('calendar') || normalized.includes('compliance')) return { icon: 'fas fa-calendar-check', desc: 'Statutory compliance & due dates' };
  if (normalized.includes('pricing') || normalized.includes('retainer')) return { icon: 'fas fa-handshake', desc: 'Scope-locked corporate retainers' };
  if (normalized.includes('career') || normalized.includes('articleship') || normalized.includes('job')) return { icon: 'fas fa-user-graduate', desc: 'ICAI articleship & senior hiring' };
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

const parseWorkingHours = (raw) => {
  const defaultSchedule = { days: "Mon – Sat", time: "10:00 AM – 7:00 PM" };
  if (!raw || typeof raw !== 'string') return defaultSchedule;

  const colonIdx = raw.indexOf(':');
  if (colonIdx !== -1) {
    let daysPart = raw.substring(0, colonIdx).trim();
    // Validate if the segment before colon contains day names/abbreviations
    if (/[a-zA-Z]{3}/.test(daysPart)) {
      let days = daysPart.replace(/([a-zA-Z]{3})\s*[-–]\s*([a-zA-Z]{3})/gi, '$1 – $2');
      let time = raw.substring(colonIdx + 1).trim();
      time = time.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2');
      time = time.replace(/([AP]M)\s*[-–]\s*(\d{1,2})/gi, '$1 – $2');
      time = time.replace(/\s*[-–]\s*/g, ' – ');

      return {
        days: days || defaultSchedule.days,
        time: time || defaultSchedule.time
      };
    }
  }

  // Fallback cleanup if raw string only had times without a day prefix
  let cleanedTime = raw.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2').replace(/\s*[-–]\s*/g, ' – ').trim();
  return {
    days: defaultSchedule.days,
    time: cleanedTime || defaultSchedule.time
  };
};

const Navbar = () => {
  const { settings, navMenu: rawNavMenu } = useSiteContext();
  const { user, logout } = useAuth();
  const schedule = parseWorkingHours(settings?.workingHours);

  const navMenu = (rawNavMenu || [])
    .filter((item) => {
      const label = (item?.label || '').toLowerCase().trim();
      const href = (item?.href || '').trim();
      return !label.includes('contact') && href !== '/contact';
    })
    .map((item) => {
      let children = (item.children || []).filter((child) => {
        const childLabel = (child?.label || '').toLowerCase().trim();
        const childHref = (child?.href || '').trim();
        return !childLabel.includes('contact') && childHref !== '/contact';
      });

      // Ensure "Others" (Knowledge & Firm Hub) contains the key institutional pages
      if (item.label?.toLowerCase().includes('other')) {
        const requiredOthers = [
          { label: 'Tax Calculators', href: '/calculators' },
          { label: 'Compliance Calendar', href: '/compliance-calendar' },
          { label: 'Retainer Pricing', href: '/pricing' },
          { label: 'Careers & Articleship', href: '/careers' },
        ];

        requiredOthers.forEach((req) => {
          if (!children.some((c) => c.href === req.href)) {
            children.push(req);
          }
        });
      }

      return {
        ...item,
        children
      };
    });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1180);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1180);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileExpandedIndex(null);
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
    setMobileExpandedIndex(null);
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
    setIsMobileOpen((prev) => {
      if (prev) setMobileExpandedIndex(null);
      return !prev;
    });
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleMobileDropdownToggle = (index) => {
    setMobileExpandedIndex((prev) => (prev === index ? null : index));
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

  // Close desktop megamenu on outside click or window scroll
  useEffect(() => {
    if (activeDropdown === null || isMobile) return;
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
  }, [activeDropdown, isMobile]);

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
            {/* Executive Office Hours Capsule */}
            <div 
              className="top-bar-status-capsule" 
              title={`Senior CA Advisory Desk • ${schedule.days}: ${schedule.time} IST`}
            >
              {/* Horology Clock Icon */}
              <i className="far fa-clock top-clock-icon" aria-hidden="true"></i>

              {/* Office Hours Label */}
              <span className="top-status-label-text">Office Hours:</span>

              {/* Schedule Days & Times */}
              <div className="top-status-schedule">
                <span className="top-schedule-days">{schedule.days}</span>
                <span className="top-schedule-sep" aria-hidden="true">•</span>
                <span className="top-schedule-time">{schedule.time}</span>
                <span className="top-schedule-tz">IST</span>
              </div>
            </div>

            <span className="top-bar-sep top-bar-hide-sm" aria-hidden="true"></span>

            {/* Direct Helpline Link */}
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
              className="top-bar-link top-bar-hide-sm"
              title="Call CA advisory desk"
            >
              <i className="fas fa-phone-alt top-bar-icon"></i>
              <span className="top-link-text">{phone}</span>
            </a>

            <span className="top-bar-sep top-bar-hide-md" aria-hidden="true"></span>

            {/* Advisory Inbox Link */}
            <a 
              href={`mailto:${email}`} 
              className="top-bar-link top-bar-hide-md"
              title="Email Shree Chamunda Associates"
            >
              <i className="fas fa-envelope top-bar-icon"></i>
              <span className="top-link-text">{email}</span>
            </a>
          </div>

          <div className="top-bar-right">
            {/* Social Channels */}
            <div className="top-bar-social">
              {getSocialLink('whatsapp') && (
                <a
                  href={getSocialLink('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Direct WhatsApp Advisory Desk"
                  className="social-circle-btn wa-circle-btn"
                  title="WhatsApp Advisory"
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

            <div className="top-bar-theme-toggle">
              <ThemeToggle />
            </div>

            <span className="top-bar-sep" aria-hidden="true"></span>

            {/* Client Portal Vault Button */}
            {user ? (
              <div className="top-bar-user-pill">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/portal'}
                  className="top-user-link"
                  title={user.role === 'admin' ? 'Open CA Admin Dashboard' : 'Open Client Portal'}
                >
                  <span className="user-pill-badge">
                    <i className={user.role === 'admin' ? 'fas fa-shield-halved' : 'fas fa-user-check'}></i>
                  </span>
                  <span>{user.role === 'admin' ? 'Admin Panel' : 'My Vault'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="top-user-logout"
                  title="Logout Session"
                  aria-label="Logout Session"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="top-bar-vault-btn" title="Access Secure 256-Bit Client Vault">
                <span className="vault-badge">
                  <i className="fas fa-shield-halved vault-icon"></i>
                </span>
                <span className="vault-text">Client Vault</span>
                <span className="vault-arrow-wrap">
                  <i className="fas fa-arrow-right vault-arrow"></i>
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
              <span className="wordmark-title">SHREE CHAMUNDA ASSOCIATES</span>
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
            {/* Mobile Direct Quick-Call Button */}
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="nav-mobile-call-btn"
              title={`Direct Call CA Office (${phone})`}
              aria-label="Direct Call CA Office"
            >
              <i className="fas fa-phone-alt"></i>
            </a>

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

            {/* Executive FinTech Consultation Appointment CTA Module */}
            <Link
              to="/contact"
              className="nav-consultation-btn"
              title="Schedule Consultation with Chartered Accountant"
            >
              <span className="consult-badge-leading">
                <i className="fas fa-calendar-check consult-calendar-icon"></i>
              </span>
              <span className="consult-main-text">Book Consultation</span>
              <span className="consult-arrow-badge">
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
            </div>
            <div className="mobile-drawer-title">
              <strong>SHREE CHAMUNDA ASSOCIATES</strong>
              <span>TAX &bull; AUDIT &bull; ADVISORY</span>
            </div>
          </Link>
          <button className="mobile-drawer-close-btn" onClick={toggleMobile} aria-label="Close navigation menu">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Sleek App Utility Strip: Vault + Search in 1 row (Height: 32px) */}
        <div className="mobile-drawer-top-strip">
          {user ? (
            <div className="mobile-strip-auth">
              <Link 
                to={user.role === 'admin' ? '/admin' : '/portal'} 
                className="mobile-strip-vault-btn logged-in"
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="live-pulse-dot"></span>
                <i className="fas fa-user-shield"></i>
                <span className="mobile-strip-text">{user.role === 'admin' ? 'Admin Panel' : 'Client Vault'}</span>
              </Link>
              <button onClick={logout} className="mobile-strip-logout-btn" title="Logout Session">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="mobile-strip-vault-btn"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="mobile-strip-left">
                <i className="fas fa-shield-alt mobile-strip-icon"></i>
                <span className="mobile-strip-text">Client Vault</span>
              </div>
              <span className="mobile-strip-cta">Login <i className="fas fa-chevron-right"></i></span>
            </Link>
          )}

          <button 
            type="button" 
            className="mobile-strip-search-btn"
            onClick={() => {
              setIsMobileOpen(false);
              setIsSearchOpen(true);
            }}
            aria-label="Search Services"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Mobile Nav Links with Sleek List Rows */}
        <div className="mobile-drawer-body">
          {/* Mobile Theme Selector Row */}
          <ThemeToggle variant="drawer-row" />

          <ul className="mobile-nav-list">
            {navMenu.map((item, index) => {
              const active = isItemActive(item);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = mobileExpandedIndex === index;
              return (
                <li key={index} className={`mobile-nav-item ${active ? 'item-active' : ''}`}>
                  <div className="mobile-nav-row">
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`mobile-nav-link ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => handleMobileDropdownToggle(index)}
                        aria-expanded={isExpanded}
                      >
                        <div className="mobile-nav-link-left">
                          <span className="mobile-item-icon">
                            <i className={getTopCategoryIcon(item.label)}></i>
                          </span>
                          <span className="mobile-nav-title">{item.label}</span>
                        </div>
                        <div className="mobile-nav-link-right">
                          <span className="mobile-item-count">{item.children.length}</span>
                          <span className={`mobile-row-chevron ${isExpanded ? 'expanded' : ''}`}>
                            <i className="fas fa-chevron-down"></i>
                          </span>
                        </div>
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={`mobile-nav-link ${location.pathname === item.href ? 'active' : ''}`}
                        onClick={() => {
                          setIsMobileOpen(false);
                          setMobileExpandedIndex(null);
                        }}
                      >
                        <div className="mobile-nav-link-left">
                          <span className="mobile-item-icon">
                            <i className={getTopCategoryIcon(item.label)}></i>
                          </span>
                          <span className="mobile-nav-title">{item.label}</span>
                        </div>
                      </Link>
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
                                setMobileExpandedIndex(null);
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

        {/* Compact 1-Row App Action Footer (Height: 52px) */}
        <div className="mobile-drawer-footer">
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mobile-footer-icon-btn call" title="Call Us">
            <i className="fas fa-phone-alt"></i>
          </a>
          <a
            href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello CA Team, I would like to consult with a Chartered Accountant.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-footer-icon-btn wa"
            title="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          <Link to="/contact" className="mobile-footer-consult-btn" onClick={() => setIsMobileOpen(false)}>
            <span className="mobile-footer-pulse-dot"></span>
            <span className="mobile-footer-consult-text">Book Consultation</span>
            <i className="fas fa-arrow-right mobile-footer-arrow"></i>
          </Link>
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
