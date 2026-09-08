import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, getBlogs } from '../api';
import useSEO from '../hooks/useSEO';
import './BlogDetail.css';

// Markdown-to-HTML parser with Table of Contents & Statutory Callout support
const parseHeadingsAndMarkdown = (content) => {
  if (!content) return { html: '', toc: [] };

  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let listType = '';
  const toc = [];

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      continue;
    }

    // Callout Blocks (> [!NOTE], > [!IMPORTANT], > [!WARNING])
    if (line.startsWith('> [!NOTE]') || line.startsWith('> [!IMPORTANT]') || line.startsWith('> [!WARNING]')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      const isImportant = line.startsWith('> [!IMPORTANT]');
      const isWarning = line.startsWith('> [!WARNING]');
      const noteText = line.replace(/^>\s*\[!(NOTE|IMPORTANT|WARNING)\]\s*/i, '');
      const badgeType = isImportant ? 'important' : isWarning ? 'warning' : 'note';
      const badgeIcon = isImportant ? 'fa-triangle-exclamation' : isWarning ? 'fa-shield-halved' : 'fa-circle-info';
      const badgeTitle = isImportant ? 'Statutory Mandate' : isWarning ? 'Compliance Scrutiny Warning' : 'Advisory Note';
      html += `<div class="article-callout ${badgeType}">
        <div class="callout-header">
          <i class="fas ${badgeIcon}"></i>
          <strong>${badgeTitle}</strong>
        </div>
        <p>${noteText}</p>
      </div>`;
      continue;
    }

    // Bold & Italic & Inline Code
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    line = line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headings
    if (line.startsWith('### ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      const rawText = line.replace('### ', '');
      const id = slugify(rawText) || `section-${i}`;
      toc.push({ id, text: rawText.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim(), level: 3 });
      html += `<h3 id="${id}" class="article-h3 scroll-target">
        <span class="h3-accent"></span>
        <span>${rawText}</span>
        <a href="#${id}" class="heading-anchor" title="Direct link to this section"><i class="fas fa-link"></i></a>
      </h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      const rawText = line.replace('## ', '');
      const id = slugify(rawText) || `section-${i}`;
      toc.push({ id, text: rawText.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim(), level: 2 });
      html += `<h2 id="${id}" class="article-h2 scroll-target">
        <span class="h2-accent"></span>
        <span>${rawText}</span>
        <a href="#${id}" class="heading-anchor" title="Direct link to this section"><i class="fas fa-link"></i></a>
      </h2>`;
    } else if (line.startsWith('# ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      const rawText = line.replace('# ', '');
      const id = slugify(rawText) || `section-${i}`;
      toc.push({ id, text: rawText.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim(), level: 1 });
      html += `<h2 id="${id}" class="article-h1 scroll-target">
        <span class="h1-accent"></span>
        <span>${rawText}</span>
        <a href="#${id}" class="heading-anchor" title="Direct link to this section"><i class="fas fa-link"></i></a>
      </h2>`;
    }
    // Bullet lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ul class="article-ul">';
        inList = true;
        listType = 'ul';
      }
      html += `<li><span class="list-bullet-disc"><i class="fas fa-check"></i></span><span class="list-content">${line.substring(2)}</span></li>`;
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ol class="article-ol">';
        inList = true;
        listType = 'ol';
      }
      html += `<li><span class="list-content">${line.replace(/^\d+\.\s/, '')}</span></li>`;
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<blockquote class="article-blockquote">
        <div class="blockquote-icon"><i class="fas fa-quote-left"></i></div>
        <div class="blockquote-text">${line.replace('> ', '')}</div>
      </blockquote>`;
    }
    // Regular paragraph
    else {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<p class="article-p">${line}</p>`;
    }
  }

  if (inList) {
    html += listType === 'ul' ? '</ul>' : '</ol>';
  }

  return { html, toc };
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [fontScale, setFontScale] = useState('normal'); // 'small' | 'normal' | 'large'
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [mobileToCOpen, setMobileToCOpen] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_blogs') || '[]');
      return saved.includes(id);
    } catch {
      return false;
    }
  });

  // SEO setup
  useSEO({
    title: blog ? `${blog.title} | Shree Chamunda Associates` : 'Tax Article & Advisory',
    description: blog?.summary || 'Expert tax, GST, and corporate compliance guides.',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getBlogById(id);
        if (isMounted) {
          const blogData = res?.data || res;
          setBlog(blogData);

          // Synchronize bookmark state
          try {
            const saved = JSON.parse(localStorage.getItem('saved_blogs') || '[]');
            setIsBookmarked(saved.includes(blogData._id || id));
          } catch {
            // ignore
          }

          // Fetch related articles (prioritize same category, backfill to guarantee 3 complete cards)
          try {
            const allRes = await getBlogs();
            const allBlogs = allRes?.data || [];
            const currentId = blogData._id || id;
            const otherBlogs = allBlogs.filter((b) => (b._id || b.id) !== currentId);
            const sameCategory = otherBlogs.filter((b) => b.category === blogData.category);
            const diffCategory = otherBlogs.filter((b) => b.category !== blogData.category);
            const combined = [...sameCategory, ...diffCategory].slice(0, 3);
            if (isMounted) setRelatedBlogs(combined);
          } catch {
            // Ignore related blogs error
          }
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Article not found or failed to load.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalScroll) * 100)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse HTML and Table of Contents
  const { html: formattedHtml, toc } = useMemo(() => {
    return parseHeadingsAndMarkdown(blog?.content);
  }, [blog?.content]);

  // Estimate total read minutes
  const totalMinutes = useMemo(() => {
    if (!blog?.content) return 5;
    const wordCount = blog.content.split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(wordCount / 200));
  }, [blog?.content]);

  // Estimate remaining read minutes
  const remainingMinutes = useMemo(() => {
    const rem = Math.ceil(totalMinutes * (1 - scrollProgress / 100));
    return Math.max(1, rem);
  }, [totalMinutes, scrollProgress]);

  // Scroll spy on headings
  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const handleScrollSpy = () => {
      const targets = document.querySelectorAll('.scroll-target');
      let currentId = '';
      const offset = 180;
      targets.forEach((elem) => {
        const top = elem.getBoundingClientRect().top;
        if (top <= offset) {
          currentId = elem.id;
        }
      });
      if (currentId) {
        setActiveHeadingId(currentId);
      } else if (toc.length > 0) {
        setActiveHeadingId(toc[0].id);
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [toc]);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      const topOffset = 85;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveHeadingId(targetId);
      setMobileToCOpen(false);
    }
  };

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_blogs') || '[]');
      let updated;
      const targetId = blog?._id || id;
      if (saved.includes(targetId)) {
        updated = saved.filter((item) => item !== targetId);
        setIsBookmarked(false);
      } else {
        updated = [...saved, targetId];
        setIsBookmarked(true);
      }
      localStorage.setItem('saved_blogs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Statutory Circular';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Statutory Circular';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Read this official tax compliance guide: "${blog?.title}"\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Read this statutory tax & compliance guide: "${blog?.title}" via Shree Chamunda Associates`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleConsultCA = () => {
    const text = `Hello CA Team, I was reviewing your article on "${blog?.title}" and would like to schedule a consultation regarding my specific tax / compliance query.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="blog-detail-page container py-5">
        <div className="skeleton skeleton-masthead" style={{ height: '260px', borderRadius: '16px', margin: '30px auto' }}></div>
        <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', maxWidth: '1240px', margin: '0 auto' }}>
          <div className="skeleton skeleton-body" style={{ height: '600px', borderRadius: '16px' }}></div>
          <div className="skeleton skeleton-sidebar" style={{ height: '400px', borderRadius: '16px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page container py-5 text-center">
        <div className="detail-error-card">
          <div className="error-icon-disc">
            <i className="fas fa-triangle-exclamation"></i>
          </div>
          <h2>Article Not Available</h2>
          <p>{error || 'The requested advisory circular could not be retrieved from the tax database.'}</p>
          <button className="btn-return-hub" onClick={() => navigate('/blog')}>
            <i className="fas fa-arrow-left"></i> Return to Knowledge Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Top Reading Progress Bar */}
      <div className="reading-progress-track">
        <div className="reading-progress-fill" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Copy Link Toast Notification */}
      {copiedToast && (
        <div className="toast-notification anim-toast-pop">
          <i className="fas fa-circle-check"></i> Direct article link copied to clipboard!
        </div>
      )}

      {/* ============================================================
          INSTITUTIONAL EDITORIAL MASTHEAD (Light, Crisp, Executive)
          ============================================================ */}
      <header className="article-masthead">
        <div className="container masthead-container">
          {/* Top Breadcrumb Strip */}
          <div className="masthead-nav-bar">
            <Link to="/blog" className="masthead-back-btn">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Knowledge Hub</span>
            </Link>
            <nav className="masthead-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep"><i className="fas fa-chevron-right"></i></span>
              <Link to="/blog">Knowledge Hub</Link>
              <span className="sep"><i className="fas fa-chevron-right"></i></span>
              <span className="active-cat">{blog.category || 'Tax Advisory'}</span>
            </nav>
          </div>

          {/* Practice Area Kicker & Verification Badges */}
          <div className="masthead-kicker-strip">
            <span className="kicker-tag">
              <span className="kicker-pulse-dot"></span>
              {blog.category ? blog.category.toUpperCase() : 'TAX'} &bull; STATUTORY ADVISORY
            </span>
            <span className="kicker-ref-code">
              <i className="fas fa-stamp"></i> REF: SCA-2026/{blog.category ? blog.category.toUpperCase() : 'REV'}
            </span>
            <span className="kicker-verified-seal">
              <i className="fas fa-certificate"></i> ICAI REVIEWED
            </span>
          </div>

          {/* Article Headline */}
          <h1 className="masthead-title">{blog.title}</h1>

          {/* Executive Abstract / Lead Summary */}
          {blog.summary && (
            <p className="masthead-lead">{blog.summary}</p>
          )}

          {/* Author & Action Strip */}
          <div className="masthead-meta-ribbon">
            <div className="meta-author-side">
              <div className="author-avatar-crest">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="author-details">
                <div className="author-name-line">
                  <span className="author-name">{blog.author || 'CA Rajesh Sharma'}</span>
                  <span className="author-partner-tag">
                    <i className="fas fa-shield-alt"></i> Senior Partner
                  </span>
                </div>
                <div className="author-subline">
                  <span><i className="far fa-calendar-alt"></i> {formatDate(blog.createdAt || blog.publishedAt)}</span>
                  <span className="dot-sep">&bull;</span>
                  <span><i className="far fa-clock"></i> {blog.readTime || `${totalMinutes} min read`}</span>
                  <span className="dot-sep">&bull;</span>
                  <span className="compliance-tag"><i className="fas fa-check"></i> CBDT / CBIC Aligned</span>
                </div>
              </div>
            </div>

            {/* High-End Sharing & Action Cluster */}
            <div className="meta-actions-side">
              <button
                type="button"
                className={`btn-action-tool btn-bookmark ${isBookmarked ? 'active' : ''}`}
                onClick={toggleBookmark}
                title={isBookmarked ? 'Saved in reference list' : 'Save for Reference'}
              >
                <i className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}></i>
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                className="btn-action-tool btn-wa-share"
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
                <span>Share</span>
              </button>

              <div className="action-icons-group">
                <button
                  type="button"
                  className="btn-action-icon"
                  onClick={handleShareLinkedIn}
                  title="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button
                  type="button"
                  className="btn-action-icon"
                  onClick={handleShareTwitter}
                  title="Share on X"
                >
                  <i className="fab fa-x-twitter"></i>
                </button>
                <button
                  type="button"
                  className="btn-action-icon"
                  onClick={handleCopyLink}
                  title="Copy Article Link"
                >
                  <i className="fas fa-link"></i>
                </button>
                <button
                  type="button"
                  className="btn-action-icon"
                  onClick={() => window.print()}
                  title="Print Article"
                >
                  <i className="fas fa-print"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          STICKY READING COMPANION HUD (Progress, Font Size, Mobile ToC)
          ============================================================ */}
      <div className="reading-hud-bar">
        <div className="container hud-container">
          {/* Left: Reading Position */}
          <div className="hud-metric">
            <div className="hud-metric-pill">
              <i className="fas fa-book-open"></i>
              <span>Reading: <strong>{scrollProgress}%</strong></span>
              <span className="hud-sep">&bull;</span>
              <span className="hud-est">~{remainingMinutes} min remaining</span>
            </div>
          </div>

          {/* Center/Right: Typography & Quick Tools */}
          <div className="hud-tools">
            <div className="font-scaling-group">
              <span className="font-group-label">Text Size:</span>
              <button
                type="button"
                className={`btn-font-toggle ${fontScale === 'small' ? 'active' : ''}`}
                onClick={() => setFontScale('small')}
                title="Compact Typography (15px)"
              >
                A-
              </button>
              <button
                type="button"
                className={`btn-font-toggle ${fontScale === 'normal' ? 'active' : ''}`}
                onClick={() => setFontScale('normal')}
                title="Standard Typography (17px)"
              >
                A
              </button>
              <button
                type="button"
                className={`btn-font-toggle ${fontScale === 'large' ? 'active' : ''}`}
                onClick={() => setFontScale('large')}
                title="Comfort Typography (19px)"
              >
                A+
              </button>
            </div>

            {/* Quick In-HUD Bookmark */}
            <button
              type="button"
              className={`btn-hud-icon ${isBookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
              title={isBookmarked ? 'Saved in reference list' : 'Bookmark this article'}
            >
              <i className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}></i>
            </button>

            {/* Quick In-HUD Copy */}
            <button
              type="button"
              className="btn-hud-icon"
              onClick={handleCopyLink}
              title="Copy Article Link"
            >
              <i className="fas fa-link"></i>
            </button>

            {/* Mobile ToC Drawer Trigger */}
            {toc && toc.length > 0 && (
              <button
                type="button"
                className="btn-mobile-toc-toggle"
                onClick={() => setMobileToCOpen((prev) => !prev)}
              >
                <i className="fas fa-list-ol"></i>
                <span>Index ({toc.length})</span>
                <i className={`fas fa-chevron-${mobileToCOpen ? 'up' : 'down'}`}></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Table of Contents Drawer */}
      {toc && toc.length > 0 && mobileToCOpen && (
        <div className="container">
          <div className="mobile-toc-drawer anim-slide-down">
            <div className="mobile-toc-header">
              <div className="mobile-toc-title-box">
                <i className="fas fa-list-ol text-gold"></i>
                <span>Article Table of Contents</span>
              </div>
              <span className="toc-count-pill">{toc.length} Sections</span>
            </div>
            <ul className="mobile-toc-list">
              {toc.map((item, index) => {
                const isActive = (activeHeadingId || toc[0]?.id) === item.id;
                const cleanTitle = item.text.replace(/:\s*$/, '').trim();
                const stepNumber = String(index + 1).padStart(2, '0');
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`mobile-toc-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="toc-step-badge">{stepNumber}</span>
                      <span className="toc-item-text">{cleanTitle}</span>
                      <i className="fas fa-chevron-right toc-active-arrow"></i>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ============================================================
          MAIN 2-COLUMN EDITORIAL CONTAINER (Prose + Sticky Sidebar)
          ============================================================ */}
      <div className="container article-layout-grid">
        {/* Main Editorial Content Column */}
        <main className="editorial-main-column">
          {/* Featured Cover Image */}
          {blog.image && (
            <div className="article-featured-banner">
              <img src={blog.image} alt={blog.title} className="featured-img" />
              <div className="featured-image-caption">
                <span className="caption-seal"><i className="fas fa-camera"></i> Official Advisory Visual</span>
                <span className="caption-text">Shree Chamunda Associates &bull; Statutory Circular Archive</span>
              </div>
            </div>
          )}

          {/* Executive Briefing / Key Takeaways Bento Card */}
          <div className="executive-briefing-card">
            <div className="briefing-header">
              <div className="briefing-badge">
                <i className="fas fa-bolt"></i>
                <span>EXECUTIVE BRIEFING FOR FOUNDERS &amp; CFOS</span>
              </div>
              <h3>Key Strategic &amp; Statutory Takeaways</h3>
            </div>
            <div className="briefing-grid">
              <div className="briefing-item">
                <div className="briefing-item-icon">
                  <i className="fas fa-scale-balanced"></i>
                </div>
                <div className="briefing-item-content">
                  <strong>Regulatory Alignment</strong>
                  <p>Formulated strictly under the Finance Act guidelines and active CBIC compliance mandates.</p>
                </div>
              </div>
              <div className="briefing-item">
                <div className="briefing-item-icon">
                  <i className="fas fa-file-invoice"></i>
                </div>
                <div className="briefing-item-content">
                  <strong>Documentary Scrutiny Defense</strong>
                  <p>Maintain vendor ledger reconciliation, GSTR-2B uploads, and banking records to preempt notice scrutiny.</p>
                </div>
              </div>
              <div className="briefing-item">
                <div className="briefing-item-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="briefing-item-content">
                  <strong>Chartered Advisory Entitlement</strong>
                  <p>Direct consultation guarantees optimal utilization of presumptive limits and lawful deduction frameworks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formatted Markdown Body with Dynamic Font Scaling */}
          <article
            className={`article-prose-container font-scale-${fontScale}`}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          ></article>

          {/* Article Taxonomy Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="article-tags-wrap">
              <span className="tags-label"><i className="fas fa-tags"></i> Topics &amp; Sections:</span>
              <div className="tags-chips">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="taxonomy-tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CBDT / CBIC Compliance Disclaimer */}
          <div className="statutory-disclaimer-box">
            <div className="disclaimer-icon-column">
              <i className="fas fa-gavel"></i>
            </div>
            <div className="disclaimer-body">
              <strong>Official Statutory Compliance Notice</strong>
              <p>
                Tax legislation, slab thresholds, and procedural timelines are subject to dynamic amendments under the Finance Act and notifications issued by the Central Board of Direct Taxes (CBDT) and Central Board of Indirect Taxes &amp; Customs (CBIC). This advisory briefing provides structural analysis. For specific assessments, audits, or notice representations, consult our Chartered Accountants.
              </p>
            </div>
          </div>

          {/* ICAI Verified Author Profile Card */}
          <div className="author-authority-card">
            <div className="author-card-avatar-side">
              <div className="authority-avatar-crest">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="fellow-stamp">
                <i className="fas fa-certificate"></i> ICAI Fellow
              </div>
            </div>

            <div className="author-card-body">
              <div className="author-card-top">
                <div>
                  <h3 className="author-name-heading">{blog.author || 'CA Rajesh Sharma'}</h3>
                  <div className="author-title-subtitle">Senior Partner &bull; Direct Tax, GST Appellate &amp; Corporate Litigation</div>
                </div>
                <button className="btn-author-direct-wa" onClick={handleConsultCA}>
                  <i className="fab fa-whatsapp"></i> Consult Partner
                </button>
              </div>

              <p className="author-bio-paragraph">
                Senior Chartered Accountant advising enterprises, SMEs, and startups on Direct Tax Litigation, Section 148 Reassessment defense, GST Tribunal appeals, and comprehensive statutory structuring. Certified by the Institute of Chartered Accountants of India (ICAI).
              </p>

              <div className="author-credentials-row">
                <span className="cred-badge"><i className="fas fa-building-columns"></i> ICAI Registered Chambers</span>
                <span className="cred-badge"><i className="fas fa-location-dot"></i> Nikol, Ahmedabad, Gujarat</span>
                <span className="cred-badge"><i className="fas fa-shield-alt"></i> 15+ Years Empirical Practice</span>
              </div>
            </div>
          </div>

          {/* Direct CA Consultation Bento Banner */}
          <div className="editorial-consult-banner">
            <div className="banner-text-side">
              <span className="banner-kicker">🟢 CONFIDENTIAL TAX ADVISORY</span>
              <h3>Need tailored assistance with {blog.category || 'this Tax Matter'}?</h3>
              <p>Schedule a 1-on-1 confidential review with our Senior Chartered Accountants for assessment defense, notice drafting, and tax optimization.</p>
            </div>
            <button className="btn-banner-consult-wa" onClick={handleConsultCA}>
              <i className="fab fa-whatsapp"></i>
              <span>Direct Partner WhatsApp</span>
            </button>
          </div>

          {/* Official Verification Stamp */}
          <div className="statutory-official-seal-bar">
            <i className="fas fa-stamp"></i>
            <span>Verified Official Analysis &bull; Registered Office: Hill Town Square, Nikol, Ahmedabad - 380049</span>
          </div>

          {/* Bottom Navigation */}
          <div className="article-bottom-nav">
            <Link to="/blog" className="btn-bottom-back">
              <i className="fas fa-arrow-left"></i>
              <span>Back to All Knowledge Hub Articles</span>
            </Link>
          </div>
        </main>

        {/* Desktop Sticky Table of Contents & Chambers Desk Sidebar */}
        <aside className="editorial-sidebar-column">
          <div className="sticky-sidebar-wrapper">
            {/* Table of Contents Card (10/10 Executive Styling) */}
            {toc && toc.length > 0 && (
              <div className="sidebar-bento-card toc-card">
                <div className="sidebar-card-header">
                  <div className="sidebar-header-title">
                    <div className="toc-header-icon-disc">
                      <i className="fas fa-list-ol"></i>
                    </div>
                    <span>Table of Contents</span>
                  </div>
                  <span className="toc-count-pill">{toc.length} Sections</span>
                </div>

                <nav className="sidebar-toc-nav">
                  {toc.map((item, index) => {
                    const isActive = (activeHeadingId || toc[0]?.id) === item.id;
                    const cleanTitle = item.text.replace(/:\s*$/, '').trim();
                    const stepNumber = String(index + 1).padStart(2, '0');
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToSection(e, item.id)}
                        className={`toc-nav-item ${isActive ? 'active' : ''}`}
                      >
                        <span className="toc-step-badge">{stepNumber}</span>
                        <span className="toc-item-text">{cleanTitle}</span>
                        <i className="fas fa-chevron-right toc-active-arrow"></i>
                      </a>
                    );
                  })}
                </nav>

                <div className="toc-reading-gauge">
                  <div className="gauge-label">
                    <span className="gauge-title"><i className="fas fa-book-open"></i> Reading Progress</span>
                    <span className="gauge-percent-pill">{scrollProgress}%</span>
                  </div>
                  <div className="gauge-bar-track">
                    <div className="gauge-bar-fill" style={{ width: `${scrollProgress}%` }}></div>
                  </div>
                  <div className="gauge-footer-info">
                    <span><i className="far fa-clock"></i> ~{remainingMinutes} min read remaining</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Advisory Desk Bento */}
            <div className="sidebar-bento-card advisory-desk-card">
              <div className="advisory-card-badge">
                <i className="fas fa-headset"></i> Advisory Desk
              </div>
              <h4>Have specific questions regarding this circular?</h4>
              <p>Connect directly with our Senior Tax Partner for immediate case review.</p>

              <button className="btn-sidebar-connect-wa" onClick={handleConsultCA}>
                <i className="fab fa-whatsapp"></i> Quick Partner Chat
              </button>

              <div className="advisory-turnaround-note">
                <i className="fas fa-bolt"></i>
                <span>Typical response within 15 minutes during office hours</span>
              </div>
            </div>

            {/* Physical Chambers Verification Card */}
            <div className="sidebar-bento-card chambers-meta-card">
              <div className="chambers-meta-header">
                <i className="fas fa-landmark"></i>
                <span>Shree Chamunda Associates</span>
              </div>
              <p className="chambers-meta-address">
                Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049
              </p>
              <div className="chambers-meta-contact">
                <a href="tel:+919510984735" className="meta-tel-link">
                  <i className="fas fa-phone"></i> +91 95109 84735
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================
          RELATED EDITORIAL DISPATCHES BENTO (10/10 Standard Grid)
          ============================================================ */}
      {relatedBlogs.length > 0 && (
        <section className="related-dispatches-section">
          <div className="container">
            <div className="related-section-header">
              <div className="related-header-kicker">
                <i className="fas fa-layer-group text-gold"></i>
                <span>COMPANION ADVISORIES</span>
              </div>
              <h2>More Authoritative Tax &amp; Statutory Insights</h2>
              <p>Explore related statutory briefings and procedural guides curated by our Chartered Accountants.</p>
            </div>

            <div className={`related-dispatches-grid count-${relatedBlogs.length}`}>
              {relatedBlogs.map((rel) => (
                <article key={rel._id} className="related-dispatch-card">
                  {/* Card Cover Thumbnail */}
                  <div className="dispatch-cover-wrap">
                    <img
                      src={rel.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'}
                      alt={rel.title}
                      className="dispatch-cover-img"
                      loading="lazy"
                    />
                    <div className="dispatch-img-overlay"></div>
                    <span className="dispatch-img-badge">
                      <span className="live-dot"></span>
                      {rel.category ? rel.category.toUpperCase() : 'TAX'}
                    </span>
                    <span className="dispatch-img-time">
                      <i className="far fa-clock"></i> {rel.readTime || '5 min'}
                    </span>
                  </div>

                  {/* Gold Top Accent Line */}
                  <div className="dispatch-top-accent"></div>

                  <div className="dispatch-content-box">
                    <div className="dispatch-header-bar">
                      <span className="dispatch-kicker">
                        <i className="fas fa-file-shield"></i> STATUTORY ADVISORY
                      </span>
                      <span className="dispatch-authority-badge">
                        <i className="fas fa-certificate"></i> ICAI REVIEWED
                      </span>
                    </div>

                    <div className="dispatch-body">
                      <h3 className="dispatch-title">
                        <Link to={`/blog/${rel._id}`}>{rel.title}</Link>
                      </h3>
                      <p className="dispatch-summary">{rel.summary}</p>
                    </div>

                    <div className="dispatch-footer">
                      <div className="dispatch-author-box">
                        <div className="dispatch-avatar-disc">
                          <i className="fas fa-user-tie"></i>
                        </div>
                        <div className="dispatch-author-text">
                          <span className="dispatch-author-name">{rel.author || 'CA Partner'}</span>
                          <span className="dispatch-meta-info">
                            {formatDate(rel.createdAt || rel.publishedAt)}
                          </span>
                        </div>
                      </div>

                      <Link to={`/blog/${rel._id}`} className="dispatch-read-btn">
                        <span>Read Analysis</span>
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
