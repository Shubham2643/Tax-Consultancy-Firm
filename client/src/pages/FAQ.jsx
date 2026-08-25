import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import useSEO from '../hooks/useSEO';
import './FAQ.css';

const FAQ = () => {
  useSEO({
    title: 'FAQs & Help Desk | Shree Chamunda Associates',
    description: 'Find verified answers to common GST, Income Tax, Corporate Registration, and Statutory Audit questions.',
  });

  const { data: response, loading, error } = useFetch(getFAQs);
  const faqs = response?.data || [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndices, setOpenIndices] = useState(new Set([0])); // First item open by default

  const categories = ['All', 'GST', 'Income Tax', 'Business Registration', 'Compliance'];

  const trendingTopics = [
    'GST Registration',
    'ITR-4 Section 44ADA',
    'ASMT-10 Notice',
    'Startup Registration',
    'TDS Rates',
  ];

  // Count FAQs per category
  const categoryCounts = useMemo(() => {
    const counts = { All: faqs.length };
    categories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = faqs.filter((f) => f.category === cat).length;
      }
    });
    return counts;
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        (faq.category && faq.category.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, search]);

  const toggleAccordion = (idx) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (openIndices.size === filteredFaqs.length) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(filteredFaqs.map((_, idx) => idx)));
    }
  };

  const handleWhatsAppConsult = () => {
    const text = `Hello CA Team, I have a specific tax & compliance query and would like expert assistance.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="faq-page fade-in">
      {/* Executive Midnight Hero with Floating Glow Orbs */}
      <div className="faq-hero">
        <div className="container">
          <div className="faq-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Verified Knowledge Base &bull; Chartered Help Desk</span>
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Instant, verified answers from Chartered Accountants regarding GST filings, income tax notices, company registrations, and compliance audits.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container faq-content-wrapper">
        {/* Single-Line Integrated Filter & Search Toolbar */}
        <div className="faq-toolbar-card">
          <div className="faq-toolbar-left">
            <div className="faq-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`faq-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndices(new Set([0]));
                  }}
                >
                  {cat}
                  {categoryCounts[cat] > 0 && (
                    <span className="faq-tab-count">{categoryCounts[cat]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="faq-toolbar-right">
            <div className="faq-search-box">
              <i className="fas fa-search faq-search-icon"></i>
              <input
                type="text"
                placeholder="Search questions, ASMT-10, ITR-4..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpenIndices(new Set());
                }}
                className="faq-search-input"
              />
              {search && (
                <button
                  className="faq-search-clear"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trending Keywords Quick Chips */}
        <div className="faq-trending-row">
          <span className="trending-title"><i className="fas fa-fire"></i> Popular:</span>
          <div className="trending-chips-wrap">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                className={`trending-tag-btn ${search === topic ? 'active' : ''}`}
                onClick={() => {
                  setSearch(search === topic ? '' : topic);
                  setOpenIndices(new Set([0]));
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Results Bar with Expand/Collapse All Toggle */}
        <div className="faq-results-bar">
          <span className="faq-results-count">
            Showing <strong>{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'}
            {activeCategory !== 'All' && <span> in <em>{activeCategory}</em></span>}
            {search && <span> matching "<em>{search}</em>"</span>}
          </span>

          <div className="faq-actions-right">
            {filteredFaqs.length > 0 && (
              <button className="btn-toggle-expand" onClick={handleExpandAll}>
                <i className={`fas fa-${openIndices.size === filteredFaqs.length ? 'compress-alt' : 'expand-alt'}`}></i>
                <span>{openIndices.size === filteredFaqs.length ? 'Collapse All' : 'Expand All'}</span>
              </button>
            )}
            {(search || activeCategory !== 'All') && (
              <button
                className="btn-reset-faq-filters"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
              >
                <i className="fas fa-undo"></i> Reset
              </button>
            )}
          </div>
        </div>

        {/* Accordion FAQ List */}
        {loading ? (
          <div className="faq-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: '75px', marginBottom: '14px', borderRadius: '14px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load FAQ knowledge base. Please try again later.</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="no-faqs-card">
            <div className="no-faqs-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No Questions Found</h3>
            <p>We couldn't find any FAQs matching "{search}". Try searching for another keyword or select a category above.</p>
            <button
              className="btn-browse-all"
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
            >
              Browse All FAQs
            </button>
          </div>
        ) : (
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.has(idx);
              return (
                <div
                  key={faq._id || idx}
                  className={`faq-card-item ${isOpen ? 'active-open' : ''}`}
                  onClick={() => toggleAccordion(idx)}
                >
                  <div className="faq-card-header">
                    <div className="faq-header-content">
                      <div className="faq-header-meta">
                        {faq.category && (
                          <span className="faq-category-tag">{faq.category}</span>
                        )}
                        <span className="faq-verified-pill">
                          <i className="fas fa-check-circle"></i> Verified CA Answer
                        </span>
                      </div>
                      <h3 className="faq-card-question">{faq.question}</h3>
                    </div>

                    <div className={`faq-expand-indicator ${isOpen ? 'rotated' : ''}`}>
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>

                  <div
                    className="faq-body-collapsible"
                    style={{
                      maxHeight: isOpen ? '500px' : '0',
                      opacity: isOpen ? '1' : '0',
                    }}
                  >
                    <div className="faq-body-inner">
                      <div className="faq-answer-quote">
                        <i className="fas fa-quote-left answer-quote-icon"></i>
                        <p>{faq.answer}</p>
                      </div>
                      <div className="faq-answer-footer">
                        <span className="helpful-tag">
                          <i className="fas fa-user-shield"></i> Chartered Advisory Desk
                        </span>
                        <button
                          className="faq-chat-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppConsult();
                          }}
                        >
                          <span>Ask CA about this</span>
                          <i className="fab fa-whatsapp"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions Consultation Banner */}
        <div className="faq-consultation-banner">
          <div className="consultation-banner-left">
            <div className="consult-icon-circle">
              <i className="fas fa-headset"></i>
            </div>
            <div className="consult-text-wrap">
              <span className="consult-live-pill">🟢 1-on-1 Confidential Advisory</span>
              <h3>Still have questions or facing a complex tax notice?</h3>
              <p>Speak directly with our senior Chartered Accountants for notice drafting, tax filings, and personalized legal guidance.</p>
            </div>
          </div>

          <div className="consultation-banner-actions">
            <button className="btn-consult-wa" onClick={handleWhatsAppConsult}>
              <i className="fab fa-whatsapp"></i> Chat on WhatsApp
            </button>
            <Link to="/contact" className="btn-consult-contact">
              <i className="fas fa-envelope"></i> Submit Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
