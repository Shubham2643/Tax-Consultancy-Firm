import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getServices } from '../api';
import useFetch from '../hooks/useFetch';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const ServicesSection = ({
  featured = false,
  hideHeader = false,
  activeFilter: controlledFilter,
  onFilterChange,
}) => {
  const [searchParams] = useSearchParams();
  const { data: response, loading, error } = useFetch(getServices);
  const services = response?.data || [];
  
  const [internalFilter, setInternalFilter] = useState(() => {
    return searchParams?.get('category') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === 'k' && (e.ctrlKey || e.metaKey)) ||
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeFilter = controlledFilter !== undefined ? controlledFilter : internalFilter;

  const setActiveFilter = useCallback(
    (category) => {
      setVisibleCount(9);
      if (onFilterChange) {
        onFilterChange(category);
      } else {
        setInternalFilter(category);
      }
    },
    [onFilterChange]
  );

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setVisibleCount(9);
  };

  useEffect(() => {
    const handleCustomFilter = (e) => {
      if (e.detail?.category) {
        setActiveFilter(e.detail.category);
      }
    };
    window.addEventListener('filter-services-category', handleCustomFilter);
    return () => window.removeEventListener('filter-services-category', handleCustomFilter);
  }, [setActiveFilter]);

  // Compute live category counts
  const categoryCounts = {
    all: services.length,
    startup: services.filter(s => s.serviceType === 'startup').length,
    registration: services.filter(s => s.serviceType === 'registration').length,
    tax: services.filter(s => s.serviceType === 'tax').length,
    accounting: services.filter(s => s.serviceType === 'accounting' || s.serviceType === 'general').length,
  };

  const categoryTabs = [
    { id: 'all', label: 'All Services', icon: 'fas fa-layer-group', count: categoryCounts.all },
    { id: 'startup', label: 'Start a Business', icon: 'fas fa-rocket', count: categoryCounts.startup },
    { id: 'registration', label: 'Registrations', icon: 'fas fa-stamp', count: categoryCounts.registration },
    { id: 'tax', label: 'Return Filings', icon: 'fas fa-file-invoice-dollar', count: categoryCounts.tax },
    { id: 'accounting', label: 'Accounting & Audit', icon: 'fas fa-calculator', count: categoryCounts.accounting },
  ];

  const trendingSearches = [
    { label: 'Private Limited', query: 'Private Limited', category: 'startup' },
    { label: 'GST Return Filing', query: 'GST', category: 'tax' },
    { label: 'ITR E-Filing', query: 'Tax Return', category: 'tax' },
    { label: 'Tax Audit 44AB', query: 'Audit', category: 'accounting' },
    { label: 'Trademark IP', query: 'Trademark', category: 'registration' },
    { label: 'Bookkeeping', query: 'Bookkeeping', category: 'accounting' },
  ];

  const handleTrendingClick = (chip) => {
    setSearchQuery(chip.query);
    setVisibleCount(9);
    if (chip.category && activeFilter !== 'all' && activeFilter !== chip.category) {
      setActiveFilter('all');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setVisibleCount(9);
    setActiveFilter('all');
  };

  // Filter services by category + search keyword
  const filteredServices = services.filter((service) => {
    // Category filter
    let categoryMatch = true;
    if (activeFilter === 'startup') categoryMatch = service.serviceType === 'startup';
    else if (activeFilter === 'registration') categoryMatch = service.serviceType === 'registration';
    else if (activeFilter === 'tax') categoryMatch = service.serviceType === 'tax';
    else if (activeFilter === 'accounting') categoryMatch = service.serviceType === 'accounting' || service.serviceType === 'general';

    // Search filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      searchMatch =
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        (service.serviceType || '').toLowerCase().includes(q);
    }

    return categoryMatch && searchMatch;
  });

  // Limit display in featured home-page mode or progressive load in full view
  const displayServices = featured
    ? (activeFilter === 'all' ? services.slice(0, 6) : filteredServices.slice(0, 6))
    : filteredServices.slice(0, visibleCount);

  return (
    <section className={`services ${hideHeader ? 'services-embedded' : ''}`} id="services-section" aria-labelledby="services-heading">
      <div className="container">
        {!hideHeader && (
          <div className="section-header text-center">
            <div className="services-badge">
              <i className="fas fa-layer-group"></i>
              <span>PRACTICE AREAS &amp; EXPERTISE</span>
            </div>
            <h2 id="services-heading">
              {featured ? 'Featured Advisory Services' : 'Our Professional Services'}
            </h2>
            <p className="section-subtitle">
              End-to-end tax filing, corporate auditing, business registrations, and statutory compliance managed by certified Chartered Accountants.
            </p>
          </div>
        )}

        {/* Practice Command Console (Unified Executive Panel for Full Catalog) */}
        {!featured ? (
          <div className="practice-command-console">
            {/* Top Tier: Category Navigation Strip */}
            <div className="console-category-strip">
              <div className="console-category-nav" role="tablist">
                {categoryTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`console-tab-btn ${isActive ? 'active' : ''} console-tab-${tab.id}`}
                      onClick={() => setActiveFilter(tab.id)}
                    >
                      <i className={tab.icon}></i>
                      <span>{tab.label}</span>
                      <span className="console-tab-badge">
                        {loading ? '·' : tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="console-divider"></div>

            {/* Middle Tier: Integrated Full-Width Search Input */}
            <div className="console-search-row">
              <div className="console-search-bar">
                <i className="fas fa-search console-search-icon"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="console-search-input"
                  placeholder="Search by statutory act, form (GST, ITR, MCA, 44AB), or practice area..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  aria-label="Search advisory services"
                />
                {searchQuery ? (
                  <button
                    className="console-search-clear"
                    onClick={() => handleSearchChange('')}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                ) : (
                  <span className="console-search-hint">
                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Tier: Centered Quick Mandate Shortcuts */}
            <div className="console-quick-mandates">
              <span className="console-quick-label">
                <i className="fas fa-bolt"></i> Popular Mandates:
              </span>
              <div className="console-quick-list">
                {trendingSearches.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`console-quick-chip ${searchQuery.toLowerCase() === chip.query.toLowerCase() ? 'active' : ''}`}
                    onClick={() => handleTrendingClick(chip)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Filter Result Status */}
            {(searchQuery || activeFilter !== 'all') && (
              <div className="console-status-bar">
                <div className="status-info">
                  <i className="fas fa-filter"></i>
                  <span>
                    Showing <strong>{filteredServices.length}</strong> of <strong>{services.length}</strong> practice areas
                    {activeFilter !== 'all' && (
                      <> in <em>{categoryTabs.find(t => t.id === activeFilter)?.label}</em></>
                    )}
                    {searchQuery && (
                      <> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
                    )}
                  </span>
                </div>
                <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                  <i className="fas fa-rotate-left"></i> Reset Filter
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Home Page Featured Mode: Clean Category Filter Tabs */
          <div className="services-filter-nav-wrapper">
            <div className="services-filter-nav" role="tablist">
              {categoryTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`filter-btn ${isActive ? 'active' : ''} filter-btn-${tab.id}`}
                    onClick={() => setActiveFilter(tab.id)}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.label}</span>
                    <span className="filter-count-badge">
                      {loading ? '·' : tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="service-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load services. Please try again later.</p>
          </div>
        ) : displayServices.length === 0 ? (
          <div className="services-no-results">
            <i className="fas fa-search"></i>
            <h3>No services found</h3>
            <p>Try a different keyword or browse all categories</p>
          </div>
        ) : (
          <>
            <div className="service-grid fade-in">
              {displayServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Load More Button for Full Catalog */}
            {!featured && filteredServices.length > visibleCount && (
              <div className="services-load-more-container">
                <button
                  type="button"
                  className="btn-load-more-services"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 6, filteredServices.length))}
                >
                  <span>Explore More Practice Areas</span>
                  <span className="load-more-count">
                    (Showing {displayServices.length} of {filteredServices.length})
                  </span>
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            )}

            {!featured && filteredServices.length > 9 && visibleCount >= filteredServices.length && (
              <div className="services-all-loaded-indicator">
                <i className="fas fa-check-circle"></i>
                <span>All {filteredServices.length} chartered practice areas in this view displayed</span>
              </div>
            )}
          </>
        )}

        {/* Explore All CTA for Home Page featured list */}
        {featured && (
          <div className="services-more-cta">
            <Link
              to={activeFilter !== 'all' ? `/services?category=${activeFilter}` : "/services"}
              className="btn-services-more"
            >
              {activeFilter !== 'all' ? 'Explore All In This Category' : 'Explore All Services'}{' '}
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

