import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import useSEO from '../hooks/useSEO';
import './FAQ.css';

const CORE_CATEGORIES = ['All', 'GST', 'Income Tax', 'Business Registration', 'Compliance'];

const CATEGORY_META = {
  'All': { label: 'All Briefs', icon: 'fa-solid fa-layer-group' },
  'GST': { label: 'GST', icon: 'fa-solid fa-receipt' },
  'Income Tax': { label: 'Income Tax', icon: 'fa-solid fa-file-invoice-dollar' },
  'Business Registration': { label: 'Business & ROC', icon: 'fa-solid fa-building' },
  'Compliance': { label: 'Audit & Compliance', icon: 'fa-solid fa-shield-halved' },
};

const QUICK_TOPICS = ['GST', 'GSTR-1', 'ITR', 'Sec 44AB', 'LLP', 'MSME', 'TDS', 'E-way Bill'];

const sanitizeComplianceText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\bChartered\s+Accountants?\b/gi, 'Senior Tax Counsel')
    .replace(/\bCAs\b/g, 'Accounting Professionals')
    .replace(/\bCA\s+([A-Z])/g, '$1')
    .replace(/\bCA\b\.?\s*/g, 'Tax Counsel ')
    .replace(/\bICAI\b/gi, 'Statutory Practice Standards')
    .replace(/\bFCA\b/g, 'Senior Partner')
    .replace(/\bUDIN\b/g, 'Statutory Reference')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const FAQ = () => {
  const { data: response, loading, error } = useFetch(getFAQs);

  const faqs = useMemo(() => {
    const raw = response?.data || [];
    return raw.map((item) => ({
      ...item,
      question: sanitizeComplianceText(item.question),
      answer: sanitizeComplianceText(item.answer),
    }));
  }, [response]);

  const faqSchema = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.slice(0, 25).map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
  }, [faqs]);

  useSEO({
    title: 'FAQs & Statutory Help Desk | Shree Chamunda Associates',
    description:
      'Verified advisory briefs on GST compliance, Income Tax return deadlines, Section 44AB audits, and MCA corporate structures from Shree Chamunda Associates.',
    jsonLd: faqSchema,
  });

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState(() => new Set([0]));
  const [copiedKey, setCopiedKey] = useState(null);

  const availableCategories = useMemo(() => {
    const extraCats = faqs
      .map((f) => f.category)
      .filter((cat) => cat && !CORE_CATEGORIES.includes(cat));
    return [...CORE_CATEGORIES, ...Array.from(new Set(extraCats))];
  }, [faqs]);

  const categoryCounts = useMemo(() => {
    const counts = { All: faqs.length };
    availableCategories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = faqs.filter((f) => f.category === cat).length;
      }
    });
    return counts;
  }, [faqs, availableCategories]);

const normalizeSearchText = (str) =>
  (str || '')
    .toLowerCase()
    .replace(/\bsec\.?\s+/g, 'section ')
    .replace(/sections?\b/g, 'section');

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const query = normalizeSearchText(search.trim());
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      if (!query) return matchesCategory;
      const matchesSearch =
        normalizeSearchText(faq.question).includes(query) ||
        normalizeSearchText(faq.answer).includes(query) ||
        normalizeSearchText(faq.category).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, search]);

  const allExpanded = filteredFaqs.length > 0 && filteredFaqs.every((_, idx) => openIds.has(idx));

  const toggleAccordion = (idx) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(filteredFaqs.map((_, idx) => idx)));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setOpenIds(new Set([0]));
  };

  const handleCopyBrief = (e, faq, key) => {
    e.stopPropagation();
    const payload = `${faq.question}\n\n${faq.answer}\n\n— Shree Chamunda Associates Advisory Help Desk`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(payload).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2200);
      });
    }
  };

  const handleWhatsAppConsult = (questionTopic = '') => {
    const text = questionTopic
      ? `Hello Shree Chamunda Associates Advisory Team, I would like further clarity regarding: "${questionTopic}"`
      : 'Hello Shree Chamunda Associates Advisory Team, I have a tax & statutory compliance question and would like expert assistance.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="faq-page fade-in">
      {/* ============================================================
          1. SWISS-FINTECH INSTITUTIONAL HERO SECTION
          ============================================================ */}
      <section className="faq-hero" aria-labelledby="faq-hero-title">
        <div className="faq-hero-top-hairline" aria-hidden="true"></div>
        <div className="faq-hero-ambient-grid" aria-hidden="true"></div>
        <div className="faq-hero-ambient-orb" aria-hidden="true"></div>

        <div className="container faq-hero-container">
          <span className="header-watermark" aria-hidden="true">HELPDESK</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>

          <div className="faq-eyebrow-badge">
            <span className="badge-index-chip">01</span>
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <span>STATUTORY HELP DESK &bull; VERIFIED KNOWLEDGE BASE</span>
          </div>

          <h1 id="faq-hero-title" className="faq-main-title">
            Frequently Asked{' '}
            <span className="title-burnished-gold">Questions &amp; Counsel Briefs.</span>
          </h1>

          <p className="faq-subtitle">
            Direct, partner-verified clarity on GST registrations, GSTR reconciliation, Section 44AB tax audits, TDS compliance, and corporate formations.
          </p>

          {/* Frosted Executive Assurance Strip */}
          <div className="header-assurance-strip" role="list" aria-label="Advisory Verification Standards">
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-certificate" aria-hidden="true"></i>
              <span>Partner-Verified Guidance</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>FY 2026-27 Statutory Alignment</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              <span>ITD, GSTN &amp; MCA Governance</span>
            </span>
            <span className="assurance-pill" role="listitem">
              <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
              <span>Section-Specific Legal Citations</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. MAIN KNOWLEDGE DESK & ACCORDION LEDGER
          ============================================================ */}
      <div className="container faq-main-container">
        {/* 2-Tier Executive Control Deck */}
        <section className="faqs-control-deck" aria-label="FAQ Search and Category Filtering">
          {/* Tier 1: Practice Area Category Navigation + Archive Telemetry */}
          <div className="faqs-deck-nav-bar">
            <div className="faqs-category-tabs" role="tablist" aria-label="FAQ Practice Domains">
              {availableCategories.map((cat) => {
                const meta = CATEGORY_META[cat] || { label: cat, icon: 'fa-solid fa-folder' };
                const count = categoryCounts[cat] ?? 0;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`faqs-category-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIds(new Set([0]));
                    }}
                  >
                    <i className={meta.icon} aria-hidden="true"></i>
                    <span>{meta.label}</span>
                    <span className="faqs-tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="faqs-deck-meta">
              <span className="faqs-meta-pill">
                <i className="fa-solid fa-book-open" aria-hidden="true"></i>
                <span>
                  <strong>{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'Brief' : 'Briefs'}
                </span>
              </span>
              <span className="faqs-meta-pill faqs-meta-fy">
                <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                <span>FY 2026-27 Ready</span>
              </span>
            </div>
          </div>

          {/* Tier 2: Search Console & Accordion View Controls */}
          <div className="faqs-deck-filter-bar">
            <div className="faqs-search-box">
              <i className="fa-solid fa-magnifying-glass faqs-search-icon" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search sections, GSTR-1, Sec 44AB, ITR deadlines, LLP, TDS..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpenIds(new Set([0]));
                }}
                className="faqs-search-input"
                aria-label="Search Frequently Asked Questions"
              />
              {search && (
                <button
                  type="button"
                  className="faqs-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <div className="faqs-deck-actions">
              {filteredFaqs.length > 0 && (
                <button
                  type="button"
                  className="faqs-action-btn"
                  onClick={handleToggleAll}
                >
                  <i className={`fa-solid ${allExpanded ? 'fa-compress' : 'fa-expand'}`} aria-hidden="true"></i>
                  <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
                </button>
              )}

              {(search || activeCategory !== 'All') && (
                <button
                  type="button"
                  className="faqs-reset-btn"
                  onClick={handleResetFilters}
                >
                  <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Tier 3: Popular Quick-Jump Topics */}
          <div className="faqs-topics-ribbon">
            <span className="faqs-topics-label">
              <i className="fa-solid fa-bolt" aria-hidden="true"></i> Quick Topics:
            </span>
            <div className="faqs-topics-chips">
              {QUICK_TOPICS.map((topic) => {
                const isSelected = search.trim().toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    className={`faqs-topic-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSearch(isSelected ? '' : topic);
                      setActiveCategory('All');
                      setOpenIds(new Set([0]));
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active Search Status Line */}
        {(search || activeCategory !== 'All') && !loading && !error && (
          <div className="faqs-status-summary" aria-live="polite">
            <span>
              Showing <strong>{filteredFaqs.length}</strong> verified{' '}
              {filteredFaqs.length === 1 ? 'answer' : 'answers'}
              {activeCategory !== 'All' && (
                <>
                  {' '}in <em>{CATEGORY_META[activeCategory]?.label || activeCategory}</em>
                </>
              )}
              {search && (
                <>
                  {' '}for &ldquo;<em>{search}</em>&rdquo;
                </>
              )}
            </span>
          </div>
        )}

        {/* Accordion Ledger Content */}
        {loading ? (
          <div className="faqs-skeleton-stack" aria-busy="true" aria-label="Loading statutory FAQs">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="faqs-skeleton-item"></div>
            ))}
          </div>
        ) : error ? (
          <div className="faqs-error-state" role="alert">
            <div className="faqs-state-icon error">
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            </div>
            <h3>Unable to Load Knowledge Base</h3>
            <p>We experienced a temporary connection issue retrieving statutory FAQs. Please refresh or contact our advisory desk directly.</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="faqs-empty-state">
            <div className="faqs-state-icon">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </div>
            <h3>No Statutory Briefs Match &ldquo;{search}&rdquo;</h3>
            <p>Try clearing your filter or select one of our core statutory topics below.</p>
            <div className="faqs-empty-suggestions">
              {QUICK_TOPICS.slice(0, 4).map((t) => (
                <button
                  key={t}
                  type="button"
                  className="faqs-suggestion-chip"
                  onClick={() => {
                    setSearch(t);
                    setActiveCategory('All');
                    setOpenIds(new Set([0]));
                  }}
                >
                  Try &ldquo;{t}&rdquo;
                </button>
              ))}
            </div>
            <button type="button" className="faqs-btn-browse-all" onClick={handleResetFilters}>
              <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
              <span>Browse All {faqs.length} Verified FAQs</span>
            </button>
          </div>
        ) : (
          <div className="faqs-accordion-list">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIds.has(idx);
              const itemKey = faq._id || `faq-${idx}`;
              const indexStr = String(idx + 1).padStart(2, '0');
              const catMeta = CATEGORY_META[faq.category];
              const isCopied = copiedKey === itemKey;

              return (
                <article
                  key={itemKey}
                  className={`faqs-dossier-card ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    id={`faq-trigger-${idx}`}
                    className="faqs-dossier-trigger"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                  >
                    <div className="faqs-trigger-left">
                      <span className="faqs-index-badge" aria-hidden="true">{indexStr}</span>
                      <div className="faqs-title-stack">
                        <div className="faqs-meta-row">
                          {faq.category && (
                            <span className="faqs-cat-pill">
                              {catMeta && <i className={catMeta.icon} aria-hidden="true"></i>}
                              <span>{faq.category}</span>
                            </span>
                          )}
                          <span className="faqs-verified-badge">
                            <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                            <span>Partner Verified</span>
                          </span>
                        </div>
                        <h2 className="faqs-question-heading">{faq.question}</h2>
                      </div>
                    </div>

                    <span className={`faqs-chevron-box ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
                      <i className="fa-solid fa-chevron-down"></i>
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${idx}`}
                    className={`faqs-panel-collapse ${isOpen ? 'open' : ''}`}
                  >
                    <div className="faqs-panel-inner">
                      <div className="faqs-answer-callout">
                        <i className="fa-solid fa-scale-balanced faqs-callout-icon" aria-hidden="true"></i>
                        <p className="faqs-answer-copy">{faq.answer}</p>
                      </div>

                      <div className="faqs-answer-footer">
                        <span className="faqs-desk-signature">
                          <i className="fa-solid fa-user-shield" aria-hidden="true"></i>
                          <span>Practice Advisory Desk &bull; Statutory Guidance</span>
                        </span>

                        <div className="faqs-answer-actions">
                          <button
                            type="button"
                            className={`faqs-copy-btn ${isCopied ? 'copied' : ''}`}
                            onClick={(e) => handleCopyBrief(e, faq, itemKey)}
                            title="Copy question and answer"
                          >
                            <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true"></i>
                            <span>{isCopied ? 'Copied' : 'Copy Brief'}</span>
                          </button>

                          <button
                            type="button"
                            className="faqs-consult-chip-btn"
                            onClick={() => handleWhatsAppConsult(faq.question)}
                          >
                            <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                            <span>Ask Advisor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ============================================================
            3. INSTITUTIONAL CONSULTATION BENTO BANNER
            ============================================================ */}
        <section className="faqs-consultation-bento" aria-labelledby="faqs-cta-heading">
          <div className="faqs-cta-ambient-grid" aria-hidden="true"></div>
          <div className="faqs-cta-ambient-glow" aria-hidden="true"></div>
          <i className="fa-solid fa-scale-balanced faqs-cta-watermark" aria-hidden="true"></i>

          <div className="faqs-cta-content">
            <div className="faqs-cta-eyebrow">
              <i className="fa-solid fa-headset" aria-hidden="true"></i>
              <span>DIRECT CHAMBERS DESK &bull; CONFIDENTIAL COUNSEL</span>
            </div>
            <h2 id="faqs-cta-heading">
              Facing a Complex Statutory Notice or{' '}
              <span className="faqs-cta-gold">Filing Deadlock?</span>
            </h2>
            <p>
              Do not leave tax scrutiny, ASMT-10 notices, or Section 148A reassessments to guesswork. Engage directly with our Senior Practice Partners in Ahmedabad.
            </p>
            <div className="faqs-cta-assurances">
              <span className="cta-assurance-tag">
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
                <span>100% NDA Privilege</span>
              </span>
              <span className="cta-assurance-tag">
                <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                <span>Senior Partner Review</span>
              </span>
              <span className="cta-assurance-tag">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Appellate Representation</span>
              </span>
            </div>
          </div>

          <div className="faqs-cta-console">
            <button
              type="button"
              className="faqs-btn-wa-primary"
              onClick={() => handleWhatsAppConsult()}
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>Chat on WhatsApp Desk</span>
              <i className="fa-solid fa-arrow-right faqs-btn-arrow" aria-hidden="true"></i>
            </button>

            <Link to="/contact" className="faqs-btn-inquiry">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              <span>Schedule Consultation</span>
            </Link>

            <a href="tel:+919510984735" className="faqs-direct-phone">
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              <span>Chambers Direct: +91 95109 84735</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
