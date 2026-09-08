import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs } from '../api';
import useFetch from '../hooks/useFetch';
import useSEO from '../hooks/useSEO';
import './Blog.css';

const Blog = () => {
  useSEO({
    title: 'Knowledge Hub & Tax Articles | Shree Chamunda Associates',
    description: 'Expert insights, Union Budget breakdowns, GST guides, and Income Tax updates from certified Chartered Accountants.',
  });

  const navigate = useNavigate();
  const { data: response, loading, error } = useFetch(getBlogs);
  const blogs = response?.data || [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    {
      id: 'latest',
      label: 'Newest First',
      desc: 'Latest regulatory circulars & notifications',
      icon: 'fa-calendar-plus',
    },
    {
      id: 'quickest',
      label: 'Quickest Read (< 6m)',
      desc: 'Concise executive briefings for busy founders',
      icon: 'fa-bolt',
    },
    {
      id: 'oldest',
      label: 'Oldest First',
      desc: 'Chronological statutory archive',
      icon: 'fa-clock-rotate-left',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [openingBlogId, setOpeningBlogId] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_blogs') || '[]');
    } catch {
      return [];
    }
  });

  const categories = ['All', 'GST', 'Income Tax', 'Business Startups', 'Compliance', 'Saved'];

  const categoryMeta = {
    'All': { icon: 'fa-layer-group', color: 'cat-all' },
    'GST': { icon: 'fa-receipt', color: 'cat-gst' },
    'Income Tax': { icon: 'fa-file-invoice-dollar', color: 'cat-tax' },
    'Business Startups': { icon: 'fa-building', color: 'cat-startup' },
    'Compliance': { icon: 'fa-shield-halved', color: 'cat-compliance' },
    'Saved': { icon: 'fa-bookmark', color: 'cat-saved' },
  };

  const trendingTags = [
    'GST Registration',
    'ITR Filing',
    'LLP vs Pvt Ltd',
    'Bookkeeping',
    'Tax Saving',
    'Compliance'
  ];

  const handleCardClick = (e, blogId) => {
    if (e.target.closest('.bookmark-btn') || e.target.closest('.card-quick-bookmark') || e.target.closest('.card-tag-pill') || e.target.closest('.spotlight-tag-chip')) {
      return;
    }
    e.preventDefault();
    setOpeningBlogId(blogId);
    setTimeout(() => {
      navigate(`/blog/${blogId}`);
    }, 220);
  };

  const toggleBookmark = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (bookmarks.includes(blogId)) {
      updated = bookmarks.filter((id) => id !== blogId);
    } else {
      updated = [...bookmarks, blogId];
    }
    setBookmarks(updated);
    localStorage.setItem('saved_blogs', JSON.stringify(updated));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 4500);
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (activeCategory === 'Saved') {
      return bookmarks.includes(blog._id);
    }
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.summary.toLowerCase().includes(search.toLowerCase()) ||
      (blog.tags && blog.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (sortBy === 'quickest') {
      const getMinutes = (rt) => parseInt(rt) || 5;
      return getMinutes(a.readTime) - getMinutes(b.readTime);
    }
    // 'latest' default
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const featuredPost = sortedBlogs.length > 0 ? sortedBlogs[0] : null;
  const regularPosts = featuredPost ? sortedBlogs.slice(1) : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent Circular';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recent Circular';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="blog-page fade-in">
      {/* Executive Clean Midnight Hero Banner */}
      <div className="blog-hero">
        <div className="container">
          <div className="blog-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Knowledge Hub &bull; Statutory Circulars</span>
          </div>
          <h1>Tax &amp; Compliance Knowledge Hub</h1>
          <p>Expert insights, Union Budget breakdowns, GST guides, and statutory circulars from certified Chartered Accountants.</p>

          {/* Authority Trust Strip */}
          <div className="blog-hero-metrics-strip">
            <div className="hero-metric-item">
              <i className="fas fa-certificate text-gold"></i>
              <span>ICAI Partner Authored</span>
            </div>
            <div className="hero-metric-dot">&bull;</div>
            <div className="hero-metric-item">
              <i className="fas fa-calendar-check text-green"></i>
              <span>FY 2026-27 Assessment Ready</span>
            </div>
            <div className="hero-metric-dot">&bull;</div>
            <div className="hero-metric-item">
              <i className="fas fa-landmark text-blue"></i>
              <span>CBDT &amp; CBIC Circulars Triage</span>
            </div>
          </div>

          {/* Trending Statutory Topics Bar */}
          <div className="blog-trending-tags-bar">
            <span className="trending-label"><i className="fas fa-fire"></i> Trending Topics:</span>
            <div className="trending-tags-pills">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`trending-tag-chip ${search.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                  onClick={() => {
                    if (search.toLowerCase() === tag.toLowerCase()) setSearch('');
                    else setSearch(tag);
                  }}
                >
                  #{tag.replace(/\s+/g, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container blog-container-wrapper">
        {/* Executive Editorial Navigation & Search Deck */}
        <div className="editorial-control-deck">
          {/* Tier 1: Practice Area Categories & Global Archive Counter */}
          <div className="deck-nav-bar">
            <div className="deck-categories-tabs" role="tablist" aria-label="Practice Areas">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`deck-category-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <i className={`fas ${categoryMeta[cat]?.icon || 'fa-folder'}`}></i>
                  <span>{cat === 'Business Startups' ? 'Corporate & Startups' : cat === 'All' ? 'All Dispatches' : cat}</span>
                  {cat === 'Saved' && bookmarks.length > 0 && (
                    <span className="tab-counter-badge">{bookmarks.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="deck-header-meta">
              <span className="deck-meta-pill">
                <i className="fas fa-newspaper text-gold"></i>
                <span><strong>{sortedBlogs.length}</strong> {sortedBlogs.length === 1 ? 'Dispatch' : 'Dispatches'}</span>
              </span>
              <span className="deck-meta-sep">&bull;</span>
              <span className="deck-meta-pill fy-pill">
                <i className="fas fa-shield-halved text-green"></i>
                <span>FY 2026-27 Aligned</span>
              </span>
            </div>
          </div>

          {/* Tier 2: Expansive Intelligence Search & Sort Deck */}
          <div className="deck-filter-bar">
            <div className="deck-search-container">
              <i className="fas fa-search search-lens-icon"></i>
              <input
                type="text"
                placeholder="Search circulars, GST notifications, sections (e.g. 44ADA, 148A, GSTR-9)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="deck-search-field"
              />
              {search && (
                <button className="deck-search-clear" onClick={() => setSearch('')} title="Clear search">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="deck-controls-right">
              {/* Institutional Custom Dropdown */}
              <div className="custom-sort-dropdown" ref={sortRef}>
                <button
                  type="button"
                  className={`custom-sort-trigger ${isSortOpen ? 'active' : ''}`}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  aria-label="Sort options"
                >
                  <span className="trigger-sort-icon">
                    <i className="fas fa-arrow-down-short-wide"></i>
                  </span>
                  <span className="trigger-prefix">Sort:</span>
                  <strong className="trigger-current-label">
                    {sortOptions.find((opt) => opt.id === sortBy)?.label || 'Newest First'}
                  </strong>
                  <i className={`fas fa-chevron-down trigger-caret ${isSortOpen ? 'rotate' : ''}`}></i>
                </button>

                {isSortOpen && (
                  <div className="custom-sort-menu anim-sort-pop" role="listbox">
                    <div className="sort-menu-header">
                      <span>ORDER BY DISPATCH DATE &amp; READ TIME</span>
                    </div>
                    <div className="sort-menu-items">
                      {sortOptions.map((opt) => {
                        const isSelected = sortBy === opt.id;
                        return (
                          <div
                            key={opt.id}
                            role="option"
                            aria-selected={isSelected}
                            className={`sort-menu-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setSortBy(opt.id);
                              setIsSortOpen(false);
                            }}
                          >
                            <div className="sort-item-icon">
                              <i className={`fas ${opt.icon}`}></i>
                            </div>
                            <div className="sort-item-body">
                              <div className="sort-item-title-row">
                                <span className="sort-item-title">{opt.label}</span>
                                {isSelected && (
                                  <span className="sort-item-check">
                                    <i className="fas fa-circle-check"></i>
                                  </span>
                                )}
                              </div>
                              <span className="sort-item-desc">{opt.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {(search || activeCategory !== 'All') && (
                <button
                  type="button"
                  className="deck-reset-btn"
                  onClick={() => { setSearch(''); setActiveCategory('All'); }}
                  title="Reset all filters"
                >
                  <i className="fas fa-rotate-left"></i>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Tier 3: Conditional Active Filter Status Ribbon (Only shown if filtered) */}
          {(search || activeCategory !== 'All') && (
            <div className="deck-active-ribbon">
              <span className="active-ribbon-label">Active Filter:</span>
              {activeCategory !== 'All' && (
                <span className="active-tag-chip">
                  <span>Category: <strong>{activeCategory}</strong></span>
                  <button type="button" onClick={() => setActiveCategory('All')} aria-label="Clear category">&times;</button>
                </span>
              )}
              {search && (
                <span className="active-tag-chip">
                  <span>Query: "<strong>{search}</strong>"</span>
                  <button type="button" onClick={() => setSearch('')} aria-label="Clear search">&times;</button>
                </span>
              )}
              <span className="active-ribbon-count">
                ({sortedBlogs.length} {sortedBlogs.length === 1 ? 'match found' : 'matches found'})
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="blog-loading-grid">
            <div className="skeleton skeleton-card" style={{ height: '360px', marginBottom: '30px' }}></div>
            <div className="editorial-cards-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: '320px' }}></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load articles. Please try again later.</p>
          </div>
        ) : sortedBlogs.length === 0 ? (
          <div className="no-blogs text-center py-5">
            <div className="no-blogs-icon-wrapper">
              <i className="fas fa-search"></i>
            </div>
            <h3>No Circulars Found</h3>
            <p>We couldn't find any tax circulars matching your search criteria.</p>
            <div className="suggested-search-chips">
              <span>Try searching:</span>
              <button type="button" onClick={() => setSearch('GST')}>GST</button>
              <button type="button" onClick={() => setSearch('ITR')}>ITR</button>
              <button type="button" onClick={() => setSearch('Startups')}>Startups</button>
              <button type="button" onClick={() => setSearch('Compliance')}>Compliance</button>
            </div>
            <button className="btn-reset-filters" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Browse All Circulars
            </button>
          </div>
        ) : (
          <>
            {/* Grand Editorial Spotlight Card */}
            {featuredPost && !search && activeCategory !== 'Saved' && (
              <div
                className={`editorial-spotlight-card ${openingBlogId === featuredPost._id ? 'card-opening' : ''}`}
                onClick={(e) => handleCardClick(e, featuredPost._id)}
              >
                <div className="spotlight-visual-pane">
                  <div className="spotlight-img-wrapper">
                    <img src={featuredPost.image || '/assets/banner_screenshot.png'} alt={featuredPost.title} />
                    <div className="spotlight-overlay-gradient"></div>
                  </div>
                  <div className="spotlight-visual-badges">
                    <span className="spotlight-category-pill">
                      <i className={`fas ${categoryMeta[featuredPost.category]?.icon || 'fa-tag'}`}></i>
                      <span>{featuredPost.category}</span>
                    </span>
                    <span className="spotlight-read-pill">
                      <i className="far fa-clock"></i> {featuredPost.readTime || '5 min read'}
                    </span>
                  </div>
                  <button
                    className={`spotlight-bookmark-btn ${bookmarks.includes(featuredPost._id) ? 'bookmarked' : ''}`}
                    onClick={(e) => toggleBookmark(e, featuredPost._id)}
                    title={bookmarks.includes(featuredPost._id) ? 'Remove bookmark' : 'Bookmark article'}
                  >
                    <i className={`fa${bookmarks.includes(featuredPost._id) ? 's' : 'r'} fa-bookmark`}></i>
                  </button>
                </div>

                <div className="spotlight-content-pane">
                  <div className="spotlight-eyebrow">
                    <div className="spotlight-kicker-badge">
                      <span className="live-pulse-dot"></span>
                      <i className="fas fa-bolt"></i>
                      <span>LEAD STATUTORY DISPATCH &bull; FY 2026-27</span>
                    </div>
                    <span className="spotlight-date">
                      <i className="far fa-calendar-alt"></i> {formatDate(featuredPost.createdAt || featuredPost.publishedAt)}
                    </span>
                  </div>

                  <h2 className="spotlight-title">{featuredPost.title}</h2>
                  <p className="spotlight-summary">{featuredPost.summary}</p>

                  {/* Highlights Strip */}
                  <div className="spotlight-highlights-strip">
                    <span className="highlight-pill">
                      <i className="fas fa-certificate text-gold"></i> ICAI Reviewed
                    </span>
                    <span className="highlight-pill">
                      <i className="fas fa-shield-check text-green"></i> CBDT Aligned
                    </span>
                    <span className="highlight-pill">
                      <i className="fas fa-scale-balanced text-blue"></i> Statutory Relief
                    </span>
                  </div>

                  {/* Taxonomy Tags */}
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <div className="spotlight-tags-row">
                      {featuredPost.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="spotlight-tag-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearch(t);
                          }}
                          title={`Filter by ${t}`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="spotlight-footer-bar">
                    <div className="spotlight-author-info">
                      <div className="spotlight-author-avatar">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="spotlight-author-meta">
                        <strong>{featuredPost.author || 'CA Rajesh Sharma, Senior Partner'}</strong>
                        <span>Chartered Advisory Desk &bull; Shree Chamunda</span>
                      </div>
                    </div>

                    <div className="spotlight-cta-action">
                      <span className="btn-spotlight-read">
                        <span>{openingBlogId === featuredPost._id ? 'Opening Dispatch...' : 'Read Full Analysis'}</span>
                        <i className={`fas ${openingBlogId === featuredPost._id ? 'fa-circle-notch fa-spin' : 'fa-arrow-right'}`}></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Elite Bento Article Grid */}
            <div className="editorial-cards-grid">
              {(search || activeCategory === 'Saved' ? sortedBlogs : regularPosts).map((blog) => (
                <article
                  key={blog._id}
                  className={`editorial-card card-animate ${openingBlogId === blog._id ? 'card-opening' : ''}`}
                  onClick={(e) => handleCardClick(e, blog._id)}
                >
                  <div className="card-top-accent"></div>

                  <div className="editorial-card-visual">
                    <img src={blog.image || '/assets/banner_screenshot.png'} alt={blog.title} />
                    <div className="card-visual-scrim"></div>

                    <div className="card-floating-badges">
                      <span className="card-cat-badge">
                        <i className={`fas ${categoryMeta[blog.category]?.icon || 'fa-tag'}`}></i>
                        <span>{blog.category}</span>
                      </span>
                      <span className="card-time-badge">
                        <i className="far fa-clock"></i> {blog.readTime || '4m read'}
                      </span>
                    </div>

                    <button
                      className={`card-quick-bookmark ${bookmarks.includes(blog._id) ? 'bookmarked' : ''}`}
                      onClick={(e) => toggleBookmark(e, blog._id)}
                      title={bookmarks.includes(blog._id) ? 'Remove bookmark' : 'Bookmark article'}
                      aria-label="Bookmark article"
                    >
                      <i className={`fa${bookmarks.includes(blog._id) ? 's' : 'r'} fa-bookmark`}></i>
                    </button>
                  </div>

                  <div className="editorial-card-body">
                    <div className="card-eyebrow-strip">
                      <span className="card-kicker">{blog.category} ADVISORY</span>
                      <span className="card-authority-badge">
                        <i className="fas fa-certificate text-gold"></i> ICAI Reviewed
                      </span>
                    </div>

                    <h3 className="editorial-card-title">{blog.title}</h3>
                    <p className="editorial-card-excerpt">{blog.summary}</p>

                    {/* Tag Chips */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="editorial-card-tags">
                        {blog.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="card-tag-pill"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearch(t);
                            }}
                            title={`Filter by ${t}`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="editorial-card-footer">
                      <div className="card-author-pill">
                        <div className="card-author-avatar">
                          <i className="fas fa-user-tie"></i>
                        </div>
                        <div className="card-author-meta">
                          <span className="card-author-name">{blog.author || 'Senior CA Partner'}</span>
                          <span className="card-author-date">{formatDate(blog.createdAt || blog.publishedAt)}</span>
                        </div>
                      </div>

                      <span className={`card-read-dispatch ${openingBlogId === blog._id ? 'action-opening' : ''}`}>
                        <span>{openingBlogId === blog._id ? 'Opening...' : 'Read Analysis'}</span>
                        <i className={`fas ${openingBlogId === blog._id ? 'fa-circle-notch fa-spin' : 'fa-arrow-right'}`}></i>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Weekly Tax & Compliance Digest Executive Dispatch */}
            <section className="blog-newsletter-bento" aria-labelledby="newsletter-headline">
              {/* Background Architectural Grid & Ambient Aura */}
              <div className="newsletter-ambient-grid" aria-hidden="true"></div>
              <div className="newsletter-ambient-glow" aria-hidden="true"></div>
              <div className="newsletter-watermark-icon" aria-hidden="true">
                <i className="fas fa-landmark"></i>
              </div>

              {/* Left Column: Authoritative Editorial & Subscriber Proof */}
              <div className="newsletter-bento-content">
                <div className="newsletter-kicker">
                  <span className="live-dot pulse"></span>
                  <i className="fas fa-paper-plane"></i>
                  <span>WEEKLY STATUTORY DISPATCH &bull; EXECUTIVE BRIEFING</span>
                </div>
                <h3 id="newsletter-headline">
                  Stay Ahead of <span className="newsletter-title-accent">CBDT, GST &amp; Ministry</span> Notifications
                </h3>
                <p>
                  Direct statutory circular breakdowns, Union Budget clause interpretations, and urgent compliance filing advisories delivered every Monday morning.
                </p>

                {/* Social Proof & Trust Badges */}
                <div className="newsletter-subscriber-strip">
                  <div className="subscriber-avatar-stack">
                    <span className="avatar-chip av-1"><i className="fas fa-user-tie"></i></span>
                    <span className="avatar-chip av-2"><i className="fas fa-briefcase"></i></span>
                    <span className="avatar-chip av-3"><i className="fas fa-user-shield"></i></span>
                  </div>
                  <div className="subscriber-meta">
                    <strong>4,800+</strong>
                    <span>CFOs, Tax Directors &amp; Corporate Leaders</span>
                  </div>
                </div>

                <div className="newsletter-trust-tags">
                  <span className="trust-pill"><i className="fas fa-shield-halved"></i> 100% Confidential</span>
                  <span className="trust-pill"><i className="fas fa-ban"></i> Zero Spam Guarantee</span>
                  <span className="trust-pill"><i className="fas fa-calendar-check"></i> Published Every Monday</span>
                </div>
              </div>

              {/* Right Column: High-Craft Subscription Console */}
              <div className="newsletter-bento-action">
                <div className="newsletter-console-card">
                  <div className="console-card-header">
                    <div className="console-status-pill">
                      <span className="status-indicator-live"></span>
                      <span>DISPATCH TERMINAL &bull; LIVE</span>
                    </div>
                    <span className="console-frequency-tag">
                      <i className="fas fa-bolt"></i> FREE ACCESS
                    </span>
                  </div>

                  {newsletterSubmitted ? (
                    <div className="newsletter-success-box">
                      <div className="success-icon-wrap">
                        <i className="fas fa-check"></i>
                      </div>
                      <h4>Priority Dispatch Activated</h4>
                      <p>
                        You're on the briefing list. Our next statutory digest will arrive in your inbox Monday morning.
                      </p>
                      <button
                        type="button"
                        className="btn-newsletter-reset"
                        onClick={() => { setNewsletterSubmitted(false); setNewsletterEmail(''); }}
                      >
                        <i className="fas fa-rotate-left"></i>
                        <span>Register another address</span>
                      </button>
                    </div>
                  ) : (
                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                      <label className="newsletter-form-label" htmlFor="newsletter-email-input">
                        Official Business or Personal Email
                      </label>
                      <div className="newsletter-input-group">
                        <span className="input-group-icon">
                          <i className="far fa-envelope"></i>
                        </span>
                        <input
                          id="newsletter-email-input"
                          type="email"
                          placeholder="name@company.com or personal email..."
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <button type="submit" className="btn-newsletter-submit">
                        <span className="btn-shine"></span>
                        <span className="btn-text">Join Executive Dispatch</span>
                        <i className="fas fa-arrow-right"></i>
                      </button>

                      <div className="newsletter-security-note">
                        <i className="fas fa-lock"></i>
                        <span>256-Bit SSL Encrypted &bull; Strictly Confidential &bull; 1-Click Unsubscribe</span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
