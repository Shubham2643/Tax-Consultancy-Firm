import { useState, useRef, useEffect, useMemo } from 'react';
import './ExecutiveSelect.css';

export const PRACTICE_CATEGORIES = [
  {
    category: 'Direct Taxation & Scrutiny Defense',
    icon: 'fa-scale-balanced',
    color: '#f8b400',
    options: [
      { value: 'Income Tax Return & Direct Tax Advisory', label: 'Income Tax Return & Direct Tax Advisory', badge: 'ITR & Planning' },
      { value: 'Tax Audit under Sec 44AB & 44AD', label: 'Tax Audit under Sec 44AB & 44AD', badge: 'Mandatory Audit' },
      { value: 'Capital Gains & Real Estate Tax Advisory', label: 'Capital Gains & Real Estate Tax Advisory', badge: 'Asset Sale' },
      { value: 'Income Tax Sec 148 / 144 Notice Defense', label: 'Income Tax Sec 148 / 144 Notice Defense', badge: 'High Scrutiny' },
      { value: 'High-Stakes Faceless Assessment Defense', label: 'High-Stakes Faceless Assessment Defense', badge: 'ITAT Appellate' }
    ]
  },
  {
    category: 'Goods & Services Tax (GST)',
    icon: 'fa-file-invoice-dollar',
    color: '#10b981',
    options: [
      { value: 'GST Registration & Monthly Compliance', label: 'GST Registration & Monthly Compliance', badge: 'GSTR-1 & 3B' },
      { value: 'GST Audit & Annual Return (GSTR-9/9C)', label: 'GST Audit & Annual Return (GSTR-9/9C)', badge: 'Annual Audit' },
      { value: 'GST Scrutiny & ASMT-10 Notice Defense', label: 'GST Scrutiny & ASMT-10 Notice Defense', badge: 'ITC Disputes' },
      { value: 'GST Departmental Audit Representation', label: 'GST Departmental Audit Representation', badge: 'On-Site Defense' }
    ]
  },
  {
    category: 'Corporate Legal & ROC Governance',
    icon: 'fa-building-columns',
    color: '#3b82f6',
    options: [
      { value: 'Company / LLP Turnkey Incorporation', label: 'Company / LLP Turnkey Incorporation', badge: 'MCA SPICe+' },
      { value: 'ROC & MCA Annual Statutory Filings', label: 'ROC & MCA Annual Statutory Filings', badge: 'Annual Secretarial' },
      { value: 'Startup India & Trademark Registration', label: 'Startup India & Trademark Registration', badge: '80-IAC Exempt' }
    ]
  },
  {
    category: 'Finance, Bookkeeping & Fractional CFO',
    icon: 'fa-chart-pie',
    color: '#8b5cf6',
    options: [
      { value: 'Complete Accounting & Bookkeeping Retainer', label: 'Complete Accounting & Bookkeeping Retainer', badge: 'Monthly Books' },
      { value: 'Virtual CFO & Financial Leadership', label: 'Virtual CFO & Financial Leadership', badge: 'Cash Flow & MIS' }
    ]
  }
];

const ExecutiveSelect = ({
  value = '',
  onChange,
  name = 'service',
  placeholder = 'Select a practice area or advisory domain',
  required = false,
  id = 'executive-service-select'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Flat list of all options for easy lookup & keyboard navigation
  const allOptions = useMemo(() => {
    const list = [];
    PRACTICE_CATEGORIES.forEach((cat) => {
      cat.options.forEach((opt) => {
        list.push({ ...opt, category: cat.category, categoryColor: cat.color, icon: cat.icon });
      });
    });
    return list;
  }, []);

  // Filtered options based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return PRACTICE_CATEGORIES;
    const query = searchQuery.toLowerCase().trim();

    return PRACTICE_CATEGORIES.map((cat) => {
      const matchingOpts = cat.options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          opt.badge.toLowerCase().includes(query) ||
          cat.category.toLowerCase().includes(query)
      );
      return { ...cat, options: matchingOpts };
    }).filter((cat) => cat.options.length > 0);
  }, [searchQuery]);

  const flatFilteredOptions = useMemo(() => {
    const list = [];
    filteredCategories.forEach((cat) => {
      cat.options.forEach((opt) => list.push(opt));
    });
    return list;
  }, [filteredCategories]);

  // Find currently selected option details
  const selectedOption = useMemo(() => {
    return allOptions.find((o) => o.value === value) || null;
  }, [allOptions, value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (optValue) => {
    if (onChange) {
      onChange({ target: { name, value: optValue } });
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < flatFilteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatFilteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatFilteredOptions.length) {
        handleSelect(flatFilteredOptions[activeIndex].value);
      }
    }
  };

  return (
    <div
      className={`executive-select-wrap ${isOpen ? 'is-open' : ''} ${selectedOption ? 'has-selection' : ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input to maintain native form validation compatibility */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        id={id}
      />

      {/* Main Luxury Trigger Button */}
      <button
        type="button"
        className="executive-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selectedOption ? `Selected: ${selectedOption.label}` : placeholder}
      >
        <div className="trigger-left">
          <div className="trigger-icon-box">
            {selectedOption ? (
              <i className={`fas ${selectedOption.icon}`}></i>
            ) : (
              <i className="fas fa-briefcase"></i>
            )}
          </div>

          <div className="trigger-text-wrap">
            {selectedOption ? (
              <div className="trigger-selected-display">
                <span className="trigger-cat-crumb">{selectedOption.category}</span>
                <span className="trigger-main-value">{selectedOption.label}</span>
              </div>
            ) : (
              <span className="trigger-placeholder">{placeholder}</span>
            )}
          </div>
        </div>

        <div className="trigger-right">
          {selectedOption && (
            <span
              className="trigger-badge-tag"
              style={{
                backgroundColor: `${selectedOption.categoryColor}15`,
                color: selectedOption.categoryColor,
                borderColor: `${selectedOption.categoryColor}30`
              }}
            >
              {selectedOption.badge}
            </span>
          )}
          <div className="trigger-chevron">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </button>

      {/* Luxury Animated Popover Dropdown */}
      {isOpen && (
        <div className="executive-select-popover" role="listbox" ref={listRef}>
          {/* Quick Search Header */}
          <div className="popover-search-strip">
            <i className="fas fa-magnifying-glass search-strip-icon"></i>
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(-1);
              }}
              placeholder="Search 15+ practice areas, notices, audits..."
              className="popover-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <i className="fas fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Grouped Options List */}
          <div className="popover-options-scroll">
            {filteredCategories.length === 0 ? (
              <div className="popover-no-results">
                <i className="fas fa-folder-open"></i>
                <p>No matching practice area found</p>
                <span>Try searching &ldquo;GST&rdquo;, &ldquo;Notice&rdquo;, &ldquo;Audit&rdquo;, or &ldquo;Company&rdquo;</span>
              </div>
            ) : (
              filteredCategories.map((cat, catIdx) => (
                <div key={catIdx} className="options-category-group">
                  <div className="category-group-header">
                    <span
                      className="category-dot"
                      style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}60` }}
                    ></span>
                    <span className="category-title">{cat.category}</span>
                    <span className="category-count">{cat.options.length}</span>
                  </div>

                  <div className="category-items-stack">
                    {cat.options.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <div
                          key={opt.value}
                          className={`executive-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelect(opt.value)}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="option-row-left">
                            <span className="option-label">{opt.label}</span>
                          </div>

                          <div className="option-row-right">
                            <span
                              className="option-badge"
                              style={{
                                backgroundColor: isSelected ? `${cat.color}18` : '#f1f5f9',
                                color: isSelected ? cat.color : '#64748b',
                                borderColor: isSelected ? `${cat.color}35` : '#e2e8f0'
                              }}
                            >
                              {opt.badge}
                            </span>
                            {isSelected && (
                              <span className="option-check-icon" style={{ color: cat.color }}>
                                <i className="fas fa-circle-check"></i>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popover Footer Micro-Bar */}
          <div className="popover-footer-strip">
            <div className="footer-privilege-note">
              <i className="fas fa-shield-check"></i>
              <span>Direct Senior Partner Assignment &bull; 100% Confidential</span>
            </div>
            <button
              type="button"
              className="footer-close-btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSelect;
