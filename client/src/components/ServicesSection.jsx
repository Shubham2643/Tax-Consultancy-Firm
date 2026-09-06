import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getServices } from '../api';
import useFetch from '../hooks/useFetch';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const ServicesSection = ({
  featured = false,
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

  const activeFilter = controlledFilter !== undefined ? controlledFilter : internalFilter;

  const setActiveFilter = useCallback(
    (category) => {
      if (onFilterChange) {
        onFilterChange(category);
      } else {
        setInternalFilter(category);
      }
    },
    [onFilterChange]
  );

  useEffect(() => {
    const handleCustomFilter = (e) => {
      if (e.detail?.category) {
        setActiveFilter(e.detail.category);
      }
    };
    window.addEventListener('filter-services-category', handleCustomFilter);
    return () => window.removeEventListener('filter-services-category', handleCustomFilter);
  }, [setActiveFilter]);

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

  // Limit display in featured home-page mode
  const displayServices = featured
    ? (activeFilter === 'all' ? services.slice(0, 6) : filteredServices.slice(0, 6))
    : filteredServices;

  return (
    <section className="services" id="services-section" aria-labelledby="services-heading">
      <div className="container">
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

        {/* Search Bar (Full Services View) */}
        {!featured && (
          <div className="services-search-bar">
            <i className="fas fa-search services-search-icon"></i>
            <input
              type="text"
              className="services-search-input"
              placeholder="Search services... (e.g. GST, TDS, PAN, Company)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="services-search-clear" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="services-filter-nav">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Services
          </button>
          <button
            className={`filter-btn ${activeFilter === 'startup' ? 'active' : ''}`}
            onClick={() => setActiveFilter('startup')}
          >
            Start a Business
          </button>
          <button
            className={`filter-btn ${activeFilter === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveFilter('registration')}
          >
            Registrations
          </button>
          <button
            className={`filter-btn ${activeFilter === 'tax' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tax')}
          >
            Return Filings
          </button>
          <button
            className={`filter-btn ${activeFilter === 'accounting' ? 'active' : ''}`}
            onClick={() => setActiveFilter('accounting')}
          >
            Accounting &amp; Audit
          </button>
        </div>

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
          <div className="service-grid fade-in">
            {displayServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
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

