import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceSearchModal.css';

// Rich metadata index for all CA, Tax & Regulatory services
const SERVICE_META = {
  // Start a Business
  'private limited company': {
    icon: 'fas fa-building',
    desc: 'MCA SPICe+ & 2 DINs allotment, corporate PAN & TAN',
    keywords: ['pvt ltd', 'incorporation', 'mca', 'spice+', 'director', 'din', 'start business', 'company registration']
  },
  'limited liability partnership firm': {
    icon: 'fas fa-handshake',
    desc: 'LLP agreement & statutory legal corporate status',
    keywords: ['llp', 'partnership', 'agreement', 'partner', 'mca', 'firm registration']
  },
  'sole properties': {
    icon: 'fas fa-user-tie',
    desc: 'Single owner MSME registration, Shop Act & Current A/C',
    keywords: ['proprietorship', 'sole proprietor', 'individual', 'single owner', 'firm', 'shop act']
  },
  'hindu undividable family(huf)': {
    icon: 'fas fa-users',
    desc: 'Family tax entity & separate PAN creation for tax saving',
    keywords: ['huf', 'hindu undivided family', 'karta', 'coparcener', 'tax saving', 'family pan']
  },
  'public limited company': {
    icon: 'fas fa-landmark',
    desc: 'Large capital, public shareholding & MCA incorporation',
    keywords: ['public ltd', 'shares', 'equity', 'listing', 'mca', 'large enterprise']
  },
  'one person company(opc)': {
    icon: 'fas fa-user-shield',
    desc: 'Corporate status for solo entrepreneurs with limited liability',
    keywords: ['opc', 'single director', 'solo founder', 'mca', 'one person']
  },
  'partnership firm': {
    icon: 'fas fa-briefcase',
    desc: 'Partnership deed drafting, notary & ROF statutory filing',
    keywords: ['partnership deed', 'rof', 'partners', 'notary', 'firm']
  },
  'e-commerce business': {
    icon: 'fas fa-cart-shopping',
    desc: 'Online seller statutory compliance (Amazon, Flipkart, Meesho)',
    keywords: ['ecommerce', 'online selling', 'amazon', 'flipkart', 'meesho', 'gst registration']
  },

  // Registration
  'government registration': {
    icon: 'fas fa-building-columns',
    desc: 'Municipal trade licenses, Shop & Establishment Act',
    keywords: ['shop act', 'gumastadhara', 'trade license', 'municipal', 'local body']
  },
  'startup india': {
    icon: 'fas fa-seedling',
    desc: 'DPIIT certificate & Section 80-IAC 3-year tax holiday',
    keywords: ['startup', 'dpiit', 'seed fund', 'tax exemption', '80iac', 'investor']
  },
  'professional tax': {
    icon: 'fas fa-id-badge',
    desc: 'Gujarat PTEC & PTRC employer registration & filing',
    keywords: ['pt', 'ptec', 'ptrc', 'gujarat professional tax', 'salary deduction']
  },
  'pan application': {
    icon: 'fas fa-id-card',
    desc: 'Form 49A allotment & verified physical card delivery',
    keywords: ['pan card', 'form 49a', 'nsdl', 'uti', 'income tax pan']
  },
  'tan application': {
    icon: 'fas fa-receipt',
    desc: 'Form 49B deductor account for TDS compliance',
    keywords: ['tan', 'form 49b', 'tds number', 'tax deduction account']
  },
  'digital signature': {
    icon: 'fas fa-key',
    desc: 'Class-3 USB cryptotoken for MCA, GST & Income Tax e-filing',
    keywords: ['dsc', 'class 3', 'token', 'crypto token', 'e-token', 'mca signing']
  },
  'esi registration': {
    icon: 'fas fa-hospital-user',
    desc: 'Employee State Insurance medical benefits & statutory cover',
    keywords: ['esi', 'esic', 'employee insurance', 'medical cover', 'labor law']
  },
  'pf registration': {
    icon: 'fas fa-users-cog',
    desc: 'Employees Provident Fund statutory establishment code',
    keywords: ['pf', 'epfo', 'provident fund', 'uan', 'pension scheme']
  },
  'import export code': {
    icon: 'fas fa-ship',
    desc: 'DGFT IEC license for international trade & customs clearance',
    keywords: ['iec', 'dgft', 'import', 'export', 'customs', 'foreign trade']
  },
  'udyam registration': {
    icon: 'fas fa-certificate',
    desc: 'Government MSME subsidy, collateral-free credit & priority lending',
    keywords: ['msme', 'udyam', 'small business', 'govt subsidy', 'samadhaan']
  },
  'gst registration': {
    icon: 'fas fa-file-invoice-dollar',
    desc: '15-digit GSTIN allotment & biometric Aadhaar e-KYC approval',
    keywords: ['gst', 'gstin', 'goods and services tax', 'hsn code', 'input credit']
  },

  // Return
  'income tax return': {
    icon: 'fas fa-calculator',
    desc: 'ITR-1 to ITR-7 filing, capital gains & 44ADA presumptive relief',
    keywords: ['itr', 'income tax return', 'tax refund', '80c', 'capital gains', 'audit report']
  },
  'pf return': {
    icon: 'fas fa-users-cog',
    desc: 'Monthly ECR generation, wage upload & electronic challan',
    keywords: ['pf return', 'ecr', 'epfo challan', 'monthly return']
  },
  'tds return': {
    icon: 'fas fa-receipt',
    desc: 'Form 24Q, 26Q quarterly returns & Form 16/16A generation',
    keywords: ['tds return', '24q', '26q', '27q', 'form 16', 'traces']
  },
  'e-way bill': {
    icon: 'fas fa-truck-fast',
    desc: 'Consignment generation, vehicle update & NIC portal clearance',
    keywords: ['eway bill', 'nic portal', 'consignment', 'transport', 'goods movement']
  },
  'pf & esic return': {
    icon: 'fas fa-shield-halved',
    desc: 'Combined monthly wage filing & dual compliance certification',
    keywords: ['pf esic', 'labor compliance', 'monthly wages', 'combined challan']
  },

  // Accounting & Compliance
  'tax audit': {
    icon: 'fas fa-search-dollar',
    desc: 'Section 44AB statutory audit, 3CA/3CB/3CD CA certification',
    keywords: ['tax audit', '44ab', '3cd', 'ca audit', 'balance sheet audit']
  },
  'book keeping & accounting': {
    icon: 'fas fa-book',
    desc: 'Tally / Zoho monthly book-keeping, bank rec & P&L statements',
    keywords: ['bookkeeping', 'accounting', 'tally', 'zoho', 'balance sheet', 'pnl']
  },
  'roc filing': {
    icon: 'fas fa-file-contract',
    desc: 'Form AOC-4, MGT-7, DIR-3 KYC annual statutory MCA reporting',
    keywords: ['roc', 'mca annual filing', 'aoc4', 'mgt7', 'dir3 kyc', 'agm']
  },
  'virtual cfo': {
    icon: 'fas fa-crown',
    desc: 'Executive financial strategy, cashflow management & MIS reporting',
    keywords: ['cfo', 'virtual cfo', 'financial advisory', 'mis report', 'cash flow']
  },

  // Others
  'trademark registration': {
    icon: 'fas fa-trademark',
    desc: 'Brand name, logo & slogan protection with IP India',
    keywords: ['trademark', 'tm', 'brand protection', 'logo copyright', 'ip india']
  },
  'copyright registration': {
    icon: 'fas fa-copyright',
    desc: 'Creative work, literary, software & artistic legal protection',
    keywords: ['copyright', 'artistic work', 'software copyright', 'ipr']
  },
  'fssai license': {
    icon: 'fas fa-utensils',
    desc: 'State & Central food safety authority certification & hygiene badge',
    keywords: ['fssai', 'food license', 'foscos', 'hygiene rating', 'restaurant']
  },
  'iso certification': {
    icon: 'fas fa-award',
    desc: 'ISO 9001:2015, 14001, 27001 standard compliance & certification',
    keywords: ['iso', 'iso 9001', 'quality management', 'compliance standard']
  },
  'legal drafting': {
    icon: 'fas fa-scale-balanced',
    desc: 'Vendor contracts, NDAs, employment agreements & lease deeds',
    keywords: ['contract', 'agreement', 'nda', 'legal deed', 'terms of service']
  }
};

const getMetaForService = (title, category) => {
  const norm = (title || '').toLowerCase().trim();
  for (const [key, meta] of Object.entries(SERVICE_META)) {
    if (norm.includes(key) || key.includes(norm)) {
      return meta;
    }
  }
  // Category fallbacks
  if (category === 'Start a Business') return { icon: 'fas fa-building', desc: 'MCA statutory business incorporation', keywords: ['company', 'incorporation'] };
  if (category === 'Registration') return { icon: 'fas fa-stamp', desc: 'Statutory government license & certification', keywords: ['registration', 'license'] };
  if (category === 'Return') return { icon: 'fas fa-file-invoice-dollar', desc: 'Statutory tax return & electronic challan', keywords: ['return', 'tax', 'filing'] };
  if (category === 'Accounting & Compliance') return { icon: 'fas fa-calculator', desc: 'CA certified audit, bookkeeping & filings', keywords: ['accounting', 'audit', 'compliance'] };
  return { icon: 'fas fa-layer-group', desc: 'Professional chartered financial consultancy', keywords: ['consultancy', 'advisory'] };
};

const CATEGORIES = ['All', 'Start a Business', 'Registration', 'Return', 'Accounting & Compliance', 'Others'];

const ServiceSearchModal = ({ isOpen, onClose, navMenu = [] }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [keyboardActiveIndex, setKeyboardActiveIndex] = useState(0);
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);
  
  // Smooth animated mount lifecycle
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimateIn, setIsAnimateIn] = useState(false);

  // useDeferredValue keeps keystroke rendering at 120Hz while search filtering runs non-blocking
  const deferredQuery = useDeferredValue(query);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Index all services with enriched metadata (memoized once)
  const allServices = useMemo(() => {
    const list = [];
    if (navMenu && navMenu.length > 0) {
      navMenu.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach((item) => {
            const meta = getMetaForService(item.label, cat.label);
            list.push({
              title: item.label === 'Sole Properties' ? 'Sole Proprietorship' :
                     item.label.includes('Hindu Undividable') ? 'Hindu Undivided Family (HUF)' :
                     item.label === 'One Person Company(OPC)' ? 'One Person Company (OPC)' : item.label,
              href: item.href,
              category: cat.label,
              icon: meta.icon,
              desc: meta.desc,
              keywords: meta.keywords || []
            });
          });
        }
      });
    }

    // Core firm pages
    list.push(
      { title: 'About Shree Chamunda Associates', href: '/about', category: 'Firm', icon: 'fas fa-building-user', desc: 'Firm leadership, credentials, mission & client track record', keywords: ['about', 'ca firm', 'firm profile', 'experience'] },
      { title: 'Comprehensive Services Overview', href: '/services', category: 'Overview', icon: 'fas fa-briefcase', desc: 'All 30+ chartered accounting, tax, MCA & advisory solutions', keywords: ['all services', 'directory', 'catalog'] },
      { title: 'Tax Insights & Knowledge Articles', href: '/blog', category: 'Knowledge', icon: 'fas fa-newspaper', desc: 'Latest updates on GST amendments, budget analysis & compliance', keywords: ['blog', 'articles', 'gst news', 'updates'] },
      { title: 'Book Free CA Consultation', href: '/contact', category: 'Advisory', icon: 'fas fa-comments', desc: 'Schedule a 1-on-1 strategic advisory session with our senior CA', keywords: ['consultation', 'contact', 'appointment', 'phone', 'email'] }
    );

    return list;
  }, [navMenu]);

  // High-performance relevance scoring filter
  const filtered = useMemo(() => {
    let list = allServices;
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    
    const trimmed = deferredQuery.trim().toLowerCase();
    if (!trimmed) {
      return list;
    }

    const terms = trimmed.split(/\s+/).filter(Boolean);
    const scored = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const titleLower = item.title.toLowerCase();
      const descLower = item.desc.toLowerCase();
      const catLower = item.category.toLowerCase();
      const keywords = item.keywords;

      let score = 0;
      let matchesAll = true;

      for (let t = 0; t < terms.length; t++) {
        const term = terms[t];
        if (titleLower.startsWith(term)) {
          score += 100;
        } else if (titleLower.includes(' ' + term) || titleLower.includes(term)) {
          score += 60;
        } else if (keywords.some((k) => k.includes(term))) {
          score += 40;
        } else if (descLower.includes(term)) {
          score += 25;
        } else if (catLower.includes(term)) {
          score += 15;
        } else {
          matchesAll = false;
          break;
        }
      }

      if (matchesAll) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
  }, [allServices, deferredQuery, selectedCategory]);

  // Smooth mount / unmount with Zero-Layout-Shift Scrollbar Lock
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setQuery('');
      setSelectedCategory('All');
      setKeyboardActiveIndex(0);
      setIsUsingKeyboard(false);

      // Prevent scrollbar layout shift on Windows
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      // Smooth GPU animation on next animation frame
      const frame = requestAnimationFrame(() => {
        setIsAnimateIn(true);
      });

      // Swift focus
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 35);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(focusTimer);
      };
    } else {
      setIsAnimateIn(false);
      // Wait for exit transition to complete before unmounting
      const exitTimer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 190);

      return () => {
        clearTimeout(exitTimer);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsUsingKeyboard(true);
      setKeyboardActiveIndex((prev) => {
        const next = prev < filtered.length - 1 ? prev + 1 : 0;
        scrollIndexIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsUsingKeyboard(true);
      setKeyboardActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : Math.max(0, filtered.length - 1);
        scrollIndexIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[keyboardActiveIndex]) {
        handleSelect(filtered[keyboardActiveIndex].href);
      }
    }
  };

  const scrollIndexIntoView = (index) => {
    if (!resultsRef.current) return;
    const items = resultsRef.current.querySelectorAll('.search-result-item');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setKeyboardActiveIndex(0);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setKeyboardActiveIndex(0);
    inputRef.current?.focus();
  };

  const handleSelect = (href) => {
    onClose();
    navigate(href);
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`search-modal-backdrop ${isAnimateIn ? 'modal-open' : ''}`}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={() => {
          if (isUsingKeyboard) setIsUsingKeyboard(false);
        }}
      >
        {/* Top Search Input Strip */}
        <div className="search-modal-header">
          <i className="fas fa-search search-input-icon"></i>
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search 30+ services (e.g. GST, Private Limited, Audit, Trademark)..."
            value={query}
            onChange={handleQueryChange}
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                setKeyboardActiveIndex(0);
                inputRef.current?.focus();
              }}
              title="Clear search"
              aria-label="Clear search query"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <button 
            type="button" 
            className="search-close-key" 
            onClick={onClose} 
            title="Close (Esc)"
            aria-label="Close search"
          >
            <kbd>ESC</kbd>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="search-category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="search-modal-body" ref={resultsRef}>
          {filtered.length > 0 ? (
            <div className="search-results-list">
              <div className="search-results-label">
                {query ? `Found ${filtered.length} matching services` : 'Popular & Core Services'}
              </div>
              {filtered.map((item, index) => {
                const isKeyActive = isUsingKeyboard && index === keyboardActiveIndex;
                return (
                  <div
                    key={`${item.href}-${index}`}
                    className={`search-result-item ${isKeyActive ? 'keyboard-active' : ''}`}
                    onClick={() => handleSelect(item.href)}
                  >
                    <div className="result-item-left">
                      <span className="result-icon-box">
                        <i className={item.icon}></i>
                      </span>
                      <div className="result-text-group">
                        <span className="result-title">{item.title}</span>
                        <span className="result-desc">{item.desc}</span>
                      </div>
                    </div>
                    <div className="result-item-right">
                      <span className="result-category-badge">{item.category}</span>
                      <span className="result-arrow">
                        <i className="fas fa-chevron-right"></i>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="search-no-results">
              <i className="fas fa-folder-open no-results-icon"></i>
              <p className="no-results-title">No matching services found</p>
              <p className="no-results-desc">
                Looking for bespoke tax planning or custom litigation? Speak directly with our CA.
              </p>
              <button
                type="button"
                className="no-results-cta"
                onClick={() => handleSelect('/contact')}
              >
                Book Free Consultation &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="search-modal-footer">
          <div className="search-footer-shortcuts">
            <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> Navigate</span>
            <span><kbd>&crarr;</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <button
            type="button"
            className="search-footer-all-btn"
            onClick={() => handleSelect('/services')}
          >
            All Services Directory &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchModal;
