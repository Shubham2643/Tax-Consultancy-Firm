import { useState } from 'react';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import './FAQ.css';

const FAQ = () => {
  const { data: response, loading, error } = useFetch(getFAQs);
  const faqs = response?.data || [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = ['All', 'GST', 'Income Tax', 'Business Registration', 'Compliance'];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page fade-in">
      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers to common tax, registration, and compliance queries</p>
        </div>
      </div>

      <div className="container faq-content-wrapper">
        <div className="faq-controls">
          <div className="search-box-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search questions or topics..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              className="faq-search-input"
            />
          </div>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="faq-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-text" style={{ height: '60px', marginBottom: '15px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load FAQs. Please try again later.</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="no-results text-center py-5">
            <i className="fas fa-search-minus no-results-icon"></i>
            <h3>No Questions Found</h3>
            <p>We couldn't find any questions matching "{search}". Try searching another keyword or topic.</p>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq._id} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <i className={`fas fa-chevron-down faq-chevron ${isOpen ? 'rotate' : ''}`}></i>
                  </button>
                  <div className="faq-answer-panel" style={{ maxHeight: isOpen ? '300px' : '0' }}>
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                      <span className="faq-badge-category">{faq.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="faq-support-box text-center mt-5">
          <h3>Still Have Questions?</h3>
          <p>If you cannot find answers to your specific queries, our tax consultants are here to help you.</p>
          <a href="/contact" className="btn faq-contact-btn">Get Free Consultation</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
