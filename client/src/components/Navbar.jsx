import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import ServiceSearchModal from './ServiceSearchModal';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const formatDropdownLabel = (label) => {
  if (!label) return '';
  if (label === 'Sole Properties') return 'Sole Proprietorship';
  if (label.includes('Hindu Undividable')) return 'Hindu Undivided Family (HUF)';
  if (label === 'One Person Company(OPC)') return 'One Person Company (OPC)';
  if (label === 'Udhyam-MSME Registration') return 'Udyam / MSME Registration';
  return label;
};

/**
 * Resolve clean FontAwesome 6 icon, concise 1-line subtitle, and disciplined 2-tone accent
 * for every navigation tile. Specific return/dual rules run before generic registration rules.
 */
const getDropdownMeta = (label, href = '') => {
  const normalized = (label || '').toLowerCase();
  const path = (href || '').toLowerCase();

  // Returns & E-Filings (ordered ahead of general registration substrings)
  if (normalized.includes('pf & esic') || path.includes('pf-and-esic-return')) {
    return { icon: 'fa-solid fa-shield-halved', desc: 'Monthly EPF ECR & ESIC return filings', tone: 'tone-gold' };
  }
  if (normalized.includes('pf return') || path.includes('pf-return')) {
    return { icon: 'fa-solid fa-users-gear', desc: 'Monthly ECR filing & challan generation', tone: 'tone-slate' };
  }
  if (normalized.includes('tds return') || path.includes('tds-return')) {
    return { icon: 'fa-solid fa-receipt', desc: 'Form 24Q / 26Q quarterly statements', tone: 'tone-gold' };
  }
  if (normalized.includes('gst return') || path.includes('gst-return')) {
    return { icon: 'fa-solid fa-percent', desc: 'GSTR-1, GSTR-3B & ITC reconciliation', tone: 'tone-gold' };
  }
  if (normalized.includes('income tax') || normalized.includes('itr')) {
    return { icon: 'fa-solid fa-file-invoice-dollar', desc: 'Direct tax e-filing & Sec 44ADA relief', tone: 'tone-slate' };
  }
  if (normalized.includes('e-way') || normalized.includes('eway')) {
    return { icon: 'fa-solid fa-truck-fast', desc: 'Consignment e-Way Bill portal setup', tone: 'tone-slate' };
  }

  // Start a Business
  if (normalized.includes('private limited')) return { icon: 'fa-solid fa-building-columns', desc: 'MCA SPICe+ filing & 2 DINs allotment', tone: 'tone-gold' };
  if (normalized.includes('limited liability') || normalized.includes('llp')) return { icon: 'fa-solid fa-handshake', desc: 'LLP agreement & corporate entity setup', tone: 'tone-slate' };
  if (normalized.includes('sole')) return { icon: 'fa-solid fa-user-tie', desc: 'Single-owner MSME proprietorship launch', tone: 'tone-slate' };
  if (normalized.includes('huf') || normalized.includes('hindu')) return { icon: 'fa-solid fa-users', desc: 'Family tax entity & separate PAN allotment', tone: 'tone-gold' };
  if (normalized.includes('public limited')) return { icon: 'fa-solid fa-landmark', desc: 'Multi-shareholder large capital incorporation', tone: 'tone-slate' };
  if (normalized.includes('one person') || normalized.includes('opc')) return { icon: 'fa-solid fa-user-shield', desc: 'Corporate status tailored for solo founders', tone: 'tone-gold' };
  if (normalized.includes('partnership')) return { icon: 'fa-solid fa-briefcase', desc: 'Partnership deed drafting & ROF filing', tone: 'tone-slate' };
  if (normalized.includes('e-commerce')) return { icon: 'fa-solid fa-cart-shopping', desc: 'Online seller GST & marketplace setup', tone: 'tone-gold' };

  // Registration & Licensing
  if (normalized.includes('government registration')) return { icon: 'fa-solid fa-landmark-dome', desc: 'Municipal trade & Shop Act licensing', tone: 'tone-slate' };
  if (normalized.includes('startup') || normalized.includes('startup-india')) return { icon: 'fa-solid fa-seedling', desc: 'DPIIT recognition & 80-IAC tax holiday', tone: 'tone-gold' };
  if (normalized.includes('professional tax')) return { icon: 'fa-solid fa-id-badge', desc: 'Gujarat PTEC & PTRC employer setup', tone: 'tone-slate' };
  if (normalized.includes('pan application') || (normalized.includes('pan') && !normalized.includes('company'))) return { icon: 'fa-solid fa-id-card', desc: 'Form 49A allotment & physical card', tone: 'tone-slate' };
  if (normalized.includes('tan application') || normalized.includes('tan')) return { icon: 'fa-solid fa-file-signature', desc: 'Form 49B deductor account for TDS', tone: 'tone-gold' };
  if (normalized.includes('digital signature') || normalized.includes('dsc')) return { icon: 'fa-solid fa-key', desc: 'Class-3 USB token for MCA & e-Filing', tone: 'tone-gold' };
  if (normalized.includes('esi') || normalized.includes('esic')) return { icon: 'fa-solid fa-notes-medical', desc: 'Employee State Insurance employer setup', tone: 'tone-slate' };
  if (normalized.includes('pf')) return { icon: 'fa-solid fa-users-gear', desc: 'EPFO Provident Fund registration', tone: 'tone-slate' };
  if (normalized.includes('import') || normalized.includes('iec')) return { icon: 'fa-solid fa-ship', desc: 'DGFT Import-Export Code registration', tone: 'tone-gold' };
  if (normalized.includes('udyam') || normalized.includes('udhyam') || normalized.includes('msme')) return { icon: 'fa-solid fa-certificate', desc: 'Govt MSME subsidies & priority credit', tone: 'tone-gold' };
  if (normalized.includes('gst registration') || normalized.includes('gst')) return { icon: 'fa-solid fa-percent', desc: '15-digit GSTIN & Aadhaar e-KYC', tone: 'tone-gold' };

  // Accounting & Compliance
  if (normalized.includes('audit')) return { icon: 'fa-solid fa-magnifying-glass-chart', desc: 'Sec 44AB tax audits & forensic review', tone: 'tone-slate' };
  if (normalized.includes('bookkeeping') || normalized.includes('book keeping') || (normalized.includes('accounting') && !normalized.includes('system'))) return { icon: 'fa-solid fa-book-bookmark', desc: 'Monthly ledger, P&L & balance sheet MIS', tone: 'tone-gold' };
  if (normalized.includes('system') || normalized.includes('erp')) return { icon: 'fa-solid fa-laptop-code', desc: 'Cloud accounting & chart of accounts setup', tone: 'tone-slate' };
  if (normalized.includes('roc') || normalized.includes('annual filing')) return { icon: 'fa-solid fa-file-contract', desc: 'MCA AOC-4 & MGT-7 annual governance', tone: 'tone-gold' };
  if (normalized.includes('payroll')) return { icon: 'fa-solid fa-users-gear', desc: 'Salary registers, PF, ESIC & Form 24Q', tone: 'tone-slate' };
  if (normalized.includes('advisory') || normalized.includes('planning')) return { icon: 'fa-solid fa-scale-balanced', desc: 'Tax structuring & entity risk advisory', tone: 'tone-gold' };
  if (normalized.includes('financial statement')) return { icon: 'fa-solid fa-chart-pie', desc: 'Statutory balance sheet & cash flows', tone: 'tone-slate' };
  if (normalized.includes('cfo')) return { icon: 'fa-solid fa-crown', desc: 'Fractional CFO & board reporting packs', tone: 'tone-gold' };

  // Resources & Hub
  if (normalized.includes('calculator') || normalized.includes('tax-tools')) return { icon: 'fa-solid fa-calculator', desc: 'FY 2025–26 Income Tax & GST calculators', tone: 'tone-gold' };
  if (normalized.includes('due date') || normalized.includes('calendar') || normalized.includes('compliance')) return { icon: 'fa-solid fa-calendar-check', desc: 'Live statutory due-date & filing tracker', tone: 'tone-slate' };
  if (normalized.includes('pricing') || normalized.includes('retainer')) return { icon: 'fa-solid fa-handshake', desc: 'Fixed-fee corporate retainer mandates', tone: 'tone-gold' };
  if (normalized.includes('career') || normalized.includes('articleship') || normalized.includes('job')) return { icon: 'fa-solid fa-user-graduate', desc: 'Open advisory roles & practice careers', tone: 'tone-slate' };
  if (normalized.includes('blog')) return { icon: 'fa-solid fa-newspaper', desc: 'Tax circulars, guides & partner notes', tone: 'tone-slate' };
  if (normalized.includes('faq')) return { icon: 'fa-solid fa-circle-question', desc: 'Answers to statutory & filing questions', tone: 'tone-gold' };
  if (normalized.includes('trademark') || normalized.includes('ipr')) return { icon: 'fa-solid fa-trademark', desc: 'Brand protection & IP registry filing', tone: 'tone-slate' };
  if (normalized.includes('copyright')) return { icon: 'fa-solid fa-copyright', desc: 'Creative & software IP registration', tone: 'tone-slate' };
  if (normalized.includes('food') || normalized.includes('fssai')) return { icon: 'fa-solid fa-utensils', desc: 'FSSAI central & state food licensing', tone: 'tone-gold' };
  if (normalized.includes('iso')) return { icon: 'fa-solid fa-award', desc: 'ISO 9001/27001 certification setup', tone: 'tone-gold' };
  if (normalized.includes('legal') || normalized.includes('agreement')) return { icon: 'fa-solid fa-scale-balanced', desc: 'Shareholder & commercial contract drafting', tone: 'tone-slate' };

  return { icon: 'fa-solid fa-shield-halved', desc: 'Statutory corporate compliance support', tone: 'tone-gold' };
};

const getTopCategoryIcon = (label) => {
  const normalized = (label || '').toLowerCase();
  if (normalized.includes('home')) return 'fa-solid fa-house';
  if (normalized.includes('about')) return 'fa-solid fa-building-user';
  if (normalized.includes('start') || normalized.includes('business')) return 'fa-solid fa-rocket';
  if (normalized.includes('registration')) return 'fa-solid fa-stamp';
  if (normalized.includes('return') || normalized.includes('tax')) return 'fa-solid fa-file-invoice-dollar';
  if (normalized.includes('accounting') || normalized.includes('compliance')) return 'fa-solid fa-calculator';
  if (normalized.includes('service')) return 'fa-solid fa-briefcase';
  if (normalized.includes('resource') || normalized.includes('other')) return 'fa-solid fa-compass';
  return 'fa-solid fa-layer-group';
};

const getCategorySublabel = (label) => {
  const normalized = (label || '').toLowerCase();
  if (normalized.includes('start') || normalized.includes('business')) return 'MCA SPICe+, LLP & Commercial Incorporation';
  if (normalized.includes('registration')) return 'State & Central Statutory Licenses & Registrations';
  if (normalized.includes('return')) return 'Direct Tax, GST & Labor Law E-Filings';
  if (normalized.includes('accounting') || normalized.includes('compliance')) return 'Statutory Audits, Corporate Records & MCA Governance';
  if (normalized.includes('resource') || normalized.includes('other')) return 'Knowledge Hub, Interactive Calculators & Firm Infrastructure';
  return 'Statutory Compliance & Filings';
};

const getDropdownFooter = (label) => {
  const normalized = (label || '').toLowerCase();
  if (normalized.includes('start') || normalized.includes('business')) {
    return {
      title: 'Need Bespoke Entity Structuring?',
      sub: 'Compare Pvt Ltd, LLP & OPC tax impact with our Senior Partners',
      cta: 'Consult Structuring Desk',
      to: '/contact',
      icon: 'fa-solid fa-building-columns',
    };
  }
  if (normalized.includes('registration')) {
    return {
      title: 'Unsure Which Registrations Apply?',
      sub: 'Get a mandatory state & central licensing roadmap in under 30 mins',
      cta: 'Request Licensing Brief',
      to: '/contact',
      icon: 'fa-solid fa-stamp',
    };
  }
  if (normalized.includes('return')) {
    return {
      title: 'Pending Notices or Revised Return Filings?',
      sub: 'Direct execution via our Income Tax, GST & TDS Compliance Desk',
      cta: 'Consult Filing Desk',
      to: '/contact',
      icon: 'fa-solid fa-file-circle-check',
    };
  }
  if (normalized.includes('accounting') || normalized.includes('compliance')) {
    return {
      title: 'Looking for Scope-Locked Monthly Retainers?',
      sub: 'Unified monthly ledger curation, GSTR-2B matching & ROC governance',
      cta: 'Compare Retainer Plans',
      to: '/pricing',
      icon: 'fa-solid fa-handshake',
    };
  }
  if (normalized.includes('resource') || normalized.includes('other')) {
    return {
      title: 'Compare Tax Impact Before Engaging',
      sub: 'Run live FY 2025–26 Old vs New Regime, HRA & GST calculations',
      cta: 'Open Tax Calculators',
      to: '/calculators',
      icon: 'fa-solid fa-calculator',
    };
  }
  return {
    title: 'Need Partner-Led Advisory Guidance?',
    sub: 'Direct Senior Partner consultation at our Nikol Chambers or online',
    cta: 'Book Consultation',
    to: '/contact',
    icon: 'fa-solid fa-headset',
  };
};

const parseWorkingHours = (raw) => {
  const defaultSchedule = { days: 'Mon – Sat', time: '10:00 AM – 7:00 PM' };
  if (!raw || typeof raw !== 'string') return defaultSchedule;

  const colonIdx = raw.indexOf(':');
  if (colonIdx !== -1) {
    const daysPart = raw.substring(0, colonIdx).trim();
    if (/[a-zA-Z]{3}/.test(daysPart)) {
      const days = daysPart.replace(/([a-zA-Z]{3})\s*[-–]\s*([a-zA-Z]{3})/gi, '$1 – $2');
      let time = raw.substring(colonIdx + 1).trim();
      time = time.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2');
      time = time.replace(/([AP]M)\s*[-–]\s*(\d{1,2})/gi, '$1 – $2');
      time = time.replace(/\s*[-–]\s*/g, ' – ');

      return {
        days: days || defaultSchedule.days,
        time: time || defaultSchedule.time,
      };
    }
  }

  const cleanedTime = raw.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2').replace(/\s*[-–]\s*/g, ' – ').trim();
  return {
    days: defaultSchedule.days,
    time: cleanedTime || defaultSchedule.time,
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
      // Drop redundant "Home" (logo anchors home) and redundant "/contact" top link (handled via primary CTA).
      return label !== 'home' && href !== '/' && !label.includes('contact') && href !== '/contact';
    })
    .map((item) => {
      const rawLabel = (item.label || '').trim();
      const displayLabel = rawLabel.toLowerCase() === 'others' ? 'Resources' : rawLabel;

      let children = (item.children || []).filter((child) => {
        const childLabel = (child?.label || '').toLowerCase().trim();
        const childHref = (child?.href || '').trim();
        return !childLabel.includes('contact') && childHref !== '/contact';
      });

      if (displayLabel.toLowerCase().includes('resource') || rawLabel.toLowerCase().includes('other')) {
        const requiredResources = [
          { label: 'Tax Calculators', href: '/calculators' },
          { label: 'Compliance Calendar', href: '/compliance-calendar' },
          { label: 'Retainer Pricing', href: '/pricing' },
          { label: 'Careers & Practice Track', href: '/careers' },
        ];

        requiredResources.forEach((req) => {
          if (!children.some((c) => c.href === req.href)) {
            children.push(req);
          }
        });
      }

      if (
        displayLabel.toLowerCase().includes('accounting') ||
        displayLabel.toLowerCase().includes('compliance')
      ) {
        const requiredCompliance = [
          { label: 'Accounting & Bookkeeping', href: '/services/bookkeeping-services' },
          { label: 'Statutory Tax Audit (Sec 44AB)', href: '/services/internal-audit-services' },
          { label: 'Company Annual Filings (ROC)', href: '/services/business-incorporation-services' },
          { label: 'Payroll & Statutory Labor Laws', href: '/services/payroll-services' },
          { label: 'Corporate Tax Advisory & Planning', href: '/services/tax-advisory-and-planning' },
          { label: 'Accounting System & Cloud ERP', href: '/services/accounting-system-setup' },
        ];

        if (children.length < 5) {
          children = requiredCompliance;
        }
      }

      return {
        ...item,
        label: displayLabel,
        children,
      };
    });

  // Include explicit Home entry in the mobile drawer while keeping the desktop bar concise.
  const mobileNavMenu = [{ label: 'Home', href: '/', children: [] }, ...navMenu];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1180px)').matches);
  const location = useLocation();

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1180px)');
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const syncViewport = () => {
      const mobileNow = mql.matches;
      setIsMobile(mobileNow);
      if (!mobileNow) {
        setIsMobileOpen(false);
        setMobileExpandedIndex(null);
      } else {
        setActiveDropdown(null);
      }
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    mql.addEventListener('change', syncViewport);
    window.addEventListener('resize', syncViewport);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mql.removeEventListener('change', syncViewport);
      window.removeEventListener('resize', syncViewport);
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
    }, 180);
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

  const isItemActive = (item) => {
    if (!item) return false;

    const normalize = (path) =>
      decodeURIComponent(path || '')
        .replace(/[-_ ]+/g, '-')
        .replace(/\/+$/, '')
        .toLowerCase();

    const currentPath = normalize(location.pathname);
    const itemPath = normalize(item.href);

    if (currentPath === itemPath) return true;

    if (item.children && item.children.length > 0) {
      return item.children.some((c) => {
        if (!c.href) return false;
        const childPath = normalize(c.href);
        return currentPath === childPath || (childPath !== '' && currentPath.startsWith(childPath + '/'));
      });
    }

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
      {/* Top Bar — Quiet Executive Desk & Portal Strip */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            <div
              className="top-bar-status-capsule"
              title={`Senior Advisory Desk • ${schedule.days}: ${schedule.time} IST`}
            >
              <span className="top-status-beacon" aria-hidden="true">
                <span className="beacon-core"></span>
              </span>
              <i className="fa-regular fa-clock top-clock-icon" aria-hidden="true"></i>
              <span className="top-status-label-text">Chambers:</span>
              <div className="top-status-schedule">
                <span className="top-schedule-days">{schedule.days}</span>
                <span className="top-schedule-sep" aria-hidden="true">•</span>
                <span className="top-schedule-time">{schedule.time}</span>
                <span className="top-schedule-tz">IST</span>
              </div>
            </div>

            <span className="top-bar-sep top-bar-hide-sm" aria-hidden="true"></span>

            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="top-bar-link top-bar-hide-sm"
              title="Call advisory desk"
            >
              <i className="fa-solid fa-phone top-bar-icon" aria-hidden="true"></i>
              <span className="top-link-text">{phone}</span>
            </a>

            <span className="top-bar-sep top-bar-hide-md" aria-hidden="true"></span>

            <a
              href={`mailto:${email}`}
              className="top-bar-link top-bar-hide-md"
              title="Email Shree Chamunda Associates"
            >
              <i className="fa-regular fa-envelope top-bar-icon" aria-hidden="true"></i>
              <span className="top-link-text">{email}</span>
            </a>
          </div>

          <div className="top-bar-right">
            <div className="top-bar-theme-toggle">
              <ThemeToggle />
            </div>

            <span className="top-bar-sep" aria-hidden="true"></span>

            {user ? (
              <div className="top-bar-user-pill">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/portal'}
                  className="top-user-link"
                  title={user.role === 'admin' ? 'Open Admin Dashboard' : 'Open Client Portal'}
                >
                  <span className="user-pill-badge">
                    <i className={user.role === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user-check'}></i>
                  </span>
                  <span>{user.role === 'admin' ? 'Admin Panel' : 'My Vault'}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="top-user-logout"
                  title="Logout Session"
                  aria-label="Logout Session"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="top-bar-vault-btn" title="Access Secure Client Vault">
                <span className="vault-badge" aria-hidden="true">
                  <i className="fa-solid fa-shield-halved vault-icon"></i>
                </span>
                <span className="vault-text">Client Vault</span>
                <span className="vault-arrow-wrap" aria-hidden="true">
                  <i className="fa-solid fa-arrow-right vault-arrow"></i>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar — Institutional Swiss-Fintech Header */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileOpen ? 'navbar-mobile-active' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="Shree Chamunda Associates Home">
            <div className="navbar-logo-badge">
              <img
                src="/assets/logo_circle_full.png?v=6"
                alt="Shree Chamunda Associates"
                className="navbar-logo-img"
              />
              <span className="logo-ring-accent" aria-hidden="true"></span>
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

          <div className="navbar-center-nav">
            <ul className="navbar-nav">
              {navMenu.map((item, index) => {
                const active = isItemActive(item);
                const hasChildren = item.children && item.children.length > 0;
                const alignClass = getAlignmentClass(index, navMenu.length);
                const isDropdownOpen = activeDropdown === index;
                const showIndicator = active && (activeDropdown === null || isDropdownOpen);
                const footerMeta = getDropdownFooter(item.label);

                return (
                  <li
                    key={index}
                    className={`nav-item ${hasChildren ? 'has-dropdown' : ''} ${active ? 'active' : ''} ${isDropdownOpen ? 'dropdown-active' : ''}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.href}
                      className="nav-link"
                      aria-expanded={hasChildren ? isDropdownOpen : undefined}
                      onClick={(e) => handleLinkClick(e, item, index)}
                    >
                      <span className="nav-link-label">{item.label}</span>
                      {hasChildren && (
                        <i className="fa-solid fa-chevron-down dropdown-icon" aria-hidden="true"></i>
                      )}
                      {showIndicator && <span className="nav-link-indicator"></span>}
                    </Link>

                    {hasChildren && (
                      <div
                        className={`dropdown-megamenu-panel ${item.children.length > 4 ? 'megamenu-grid' : 'megamenu-single'} ${alignClass} ${isDropdownOpen ? 'dropdown-open' : ''}`}
                      >
                        <div className="dropdown-caret-arrow"></div>
                        <div className="megamenu-header-bar">
                          <div className="megamenu-header-left">
                            <span className="megamenu-category-pill">
                              <span className="megamenu-live-dot" aria-hidden="true"></span>
                              <i className={getTopCategoryIcon(item.label)} aria-hidden="true"></i>
                              <span>{item.label}</span>
                            </span>
                            <span className="megamenu-sublabel">
                              {getCategorySublabel(item.label)}
                            </span>
                          </div>
                          <span className="megamenu-count-badge">
                            {item.children.length} {item.label === 'Resources' ? 'Guides & Tools' : 'Mandates'}
                          </span>
                        </div>

                        <div className="megamenu-items-container">
                          {item.children.map((child, childIndex) => {
                            const meta = getDropdownMeta(child.label, child.href);
                            const cleanTitle = formatDropdownLabel(child.label);
                            const isChildActive = location.pathname === child.href;
                            return (
                              <Link
                                key={childIndex}
                                to={child.href}
                                style={{ '--tile-idx': childIndex }}
                                className={`dropdown-rich-tile ${isChildActive ? 'tile-active' : ''}`}
                                onClick={handleDropdownItemClick}
                              >
                                <div className={`dropdown-tile-icon ${meta.tone || 'tone-gold'}`}>
                                  <i className={meta.icon} aria-hidden="true"></i>
                                </div>
                                <div className="dropdown-tile-info">
                                  <div className="dropdown-tile-title-row">
                                    <span className="dropdown-tile-title">{cleanTitle}</span>
                                    {isChildActive && <span className="active-tile-dot" title="Active page"></span>}
                                  </div>
                                  <span className="dropdown-tile-desc">{meta.desc}</span>
                                </div>
                                <div className="dropdown-tile-arrow" aria-hidden="true">
                                  <i className="fa-solid fa-chevron-right"></i>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="dropdown-bottom-strip">
                          <Link
                            to={footerMeta.to}
                            className="dropdown-strip-link"
                            onClick={handleDropdownItemClick}
                          >
                            <div className="strip-left">
                              <span className="strip-sparkle" aria-hidden="true">
                                <i className={footerMeta.icon}></i>
                              </span>
                              <div className="strip-text-group">
                                <span className="strip-bold">{footerMeta.title}</span>
                                <span className="strip-sub">{footerMeta.sub}</span>
                              </div>
                            </div>
                            <span className="strip-cta-pill">
                              <span>{footerMeta.cta}</span>
                              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
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

          <div className="navbar-right-actions">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="nav-mobile-call-btn"
              title={`Direct Call Advisory Office (${phone})`}
              aria-label="Direct Call Advisory Office"
            >
              <i className="fa-solid fa-phone"></i>
            </a>

            <button
              type="button"
              className="nav-search-bar"
              onClick={() => setIsSearchOpen(true)}
              title="Search services, calculators & guides (Ctrl+K)"
              aria-label="Search Services"
            >
              <span className="nav-search-icon-badge" aria-hidden="true">
                <i className="fa-solid fa-magnifying-glass nav-search-icon"></i>
              </span>
              <span className="nav-search-placeholder">Search services...</span>
              <span className="nav-search-kbd" aria-hidden="true">Ctrl+K</span>
              <span className="nav-search-hover-cue" aria-hidden="true">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </button>

            <Link
              to="/contact"
              className="nav-consultation-btn"
              title="Schedule Consultation with Senior Advisor"
            >
              <span className="consult-badge-leading" aria-hidden="true">
                <i className="fa-solid fa-calendar-check consult-calendar-icon"></i>
              </span>
              <span className="consult-main-text">Book Consultation</span>
              <span className="consult-arrow-badge" aria-hidden="true">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

            <button
              type="button"
              className="navbar-toggler"
              onClick={toggleMobile}
              aria-label="Toggle navigation"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              <span className={`hamburger ${isMobileOpen ? 'hamburger-open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="navbar-overlay" onClick={toggleMobile} aria-label="Close navigation overlay"></div>
      )}

      <div
        id="mobile-nav-drawer"
        className={`navbar-mobile-drawer ${isMobileOpen ? 'drawer-open' : ''}`}
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
          <button type="button" className="mobile-drawer-close-btn" onClick={toggleMobile} aria-label="Close navigation menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mobile-drawer-top-strip">
          {user ? (
            <div className="mobile-strip-auth">
              <Link
                to={user.role === 'admin' ? '/admin' : '/portal'}
                className="mobile-strip-vault-btn logged-in"
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="live-pulse-dot"></span>
                <i className="fa-solid fa-user-shield"></i>
                <span className="mobile-strip-text">{user.role === 'admin' ? 'Admin Panel' : 'Client Vault'}</span>
              </Link>
              <button type="button" onClick={logout} className="mobile-strip-logout-btn" title="Logout Session">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="mobile-strip-vault-btn"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="mobile-strip-left">
                <i className="fa-solid fa-shield-halved mobile-strip-icon"></i>
                <span className="mobile-strip-text">Client Vault</span>
              </div>
              <span className="mobile-strip-cta">Login <i className="fa-solid fa-chevron-right"></i></span>
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
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div className="mobile-drawer-body">
          <ThemeToggle variant="drawer-row" />

          <ul className="mobile-nav-list">
            {mobileNavMenu.map((item, index) => {
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
                            <i className="fa-solid fa-chevron-down"></i>
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
                    <div className={`mobile-accordion-collapse ${isExpanded ? 'expanded' : ''}`}>
                      <div className="mobile-sub-accordion-inner">
                        {item.children.map((child, childIndex) => {
                          const meta = getDropdownMeta(child.label, child.href);
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
                              <i className="fa-solid fa-chevron-right mobile-sub-arrow"></i>
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
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mobile-footer-icon-btn call" title="Call Us">
            <i className="fa-solid fa-phone"></i>
          </a>
          <a
            href={`https://wa.me/919510984735?text=${encodeURIComponent('Hello Advisory Team, I would like to consult regarding tax & compliance services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-footer-icon-btn wa"
            title="Chat on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
          <Link to="/contact" className="mobile-footer-consult-btn" onClick={() => setIsMobileOpen(false)}>
            <i className="fa-solid fa-calendar-check mobile-footer-btn-icon"></i>
            <span className="mobile-footer-consult-text">Book Consultation</span>
            <i className="fa-solid fa-arrow-right mobile-footer-arrow"></i>
          </Link>
        </div>
      </div>

      <ServiceSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navMenu={navMenu}
      />
    </>
  );
};

export default Navbar;
