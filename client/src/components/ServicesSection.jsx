import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../api';
import useFetch from '../hooks/useFetch';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const ServicesSection = ({ featured = false }) => {
  const { data: response, loading, error } = useFetch(getServices);
  const services = response?.data || [];
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Limit display to 6 services in featured home-page mode
  const displayServices = featured ? services.slice(0, 6) : filteredServices;

  return (
    <section className="services" aria-labelledby="services-heading">
      <div className="container">
        <div className="section-header text-center">
          <span className="services-badge">WHAT WE DO</span>
          <h2 id="services-heading">
            {featured ? 'Featured Services' : 'Our Expert Services'}
          </h2>
          <p className="section-subtitle">
            Comprehensive financial, legal, and compliance solutions to scale your business
          </p>
        </div>

        {/* Search Bar + Category Filters (Hidden in featured mode on home page) */}
        {!featured && (
          <>
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
                Accounting & Audit
              </button>
            </div>
          </>
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
          <div className="service-grid fade-in">
            {displayServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Explore All CTA for Home Page featured list */}
        {featured && (
          <div className="services-more-cta">
            <Link to="/services" className="btn-services-more">
              Explore All Services <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

