import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, getBlogs } from '../api';
import useSEO from '../hooks/useSEO';
import './BlogDetail.css';

// Markdown-to-HTML parser for formatted article reading
const renderMarkdownContent = (content) => {
  if (!content) return '';

  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      continue;
    }

    // Bold & Italic
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headings
    if (line.startsWith('### ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h3 class="article-h3"><span class="h3-accent"></span>${line.replace('### ', '')}</h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h2 class="article-h2">${line.replace('## ', '')}</h2>`;
    } else if (line.startsWith('# ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h2 class="article-h1">${line.replace('# ', '')}</h2>`;
    }
    // Bullet lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ul class="article-ul">';
        inList = true;
        listType = 'ul';
      }
      html += `<li><i class="fas fa-check-circle list-check-icon"></i> <span>${line.substring(2)}</span></li>`;
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ol class="article-ol">';
        inList = true;
        listType = 'ol';
      }
      html += `<li><span>${line.replace(/^\d+\.\s/, '')}</span></li>`;
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<blockquote class="article-blockquote"><i class="fas fa-quote-left"></i><p>${line.replace('> ', '')}</p></blockquote>`;
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

  return html;
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

          // Fetch related articles
          try {
            const allRes = await getBlogs();
            const allBlogs = allRes?.data || [];
            const related = allBlogs
              .filter((b) => b._id !== (blogData._id || id) && b.category === blogData.category)
              .slice(0, 3);
            if (isMounted) setRelatedBlogs(related);
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent Circular';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recent Circular';
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
    const text = `Read this tax advisory article: "${blog.title}"\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConsultCA = () => {
    const text = `Hello CA Team, I was reading your article on "${blog?.title}" and would like to schedule a consultation with your senior advisor.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="blog-detail-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '60%', height: '45px', margin: '40px auto 20px auto' }}></div>
        <div className="skeleton skeleton-card" style={{ height: '400px', maxWidth: '850px', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page container py-5 text-center">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '16px' }}></i>
          <h2>Article Not Available</h2>
          <p>{error || 'The requested article could not be loaded.'}</p>
          <button className="btn-back-hub" onClick={() => navigate('/blog')}>
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
          <i className="fas fa-check-circle"></i> Direct article link copied to clipboard!
        </div>
      )}

      {/* Executive Hero Banner with Ambient Glowing Orbs */}
      <header className="article-hero-banner anim-hero-entrance">
        <div className="container">
          {/* Breadcrumb Navigation Strip */}
          <div className="hero-nav-strip anim-fade-down">
            <Link to="/blog" className="hero-back-link">
              <i className="fas fa-arrow-left"></i> Back to Knowledge Hub
            </Link>
            <div className="hero-breadcrumbs">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/blog">Knowledge Hub</Link>
              <span className="sep">/</span>
              <span className="active-cat">{blog.category}</span>
            </div>
          </div>

          {/* Badge & Title with Bubble Pop Animation */}
          <div className="hero-badge-wrap anim-bubble-pop">
            <span className="hero-pill-badge">
              <span className="live-dot"></span>
              <i className="fas fa-shield-alt"></i>
              <span>{blog.category} Advisory &bull; Statutory Circular</span>
            </span>
          </div>

          <h1 className="hero-headline anim-slide-rot-up">{blog.title}</h1>
          <p className="hero-summary-lead anim-fade-in-delayed">{blog.summary}</p>

          {/* Author & Action Strip */}
          <div className="hero-meta-bar anim-slide-up-card">
            <div className="author-signature">
              <div className="author-avatar-icon anim-avatar-bounce">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="author-text-info">
                <div className="author-name-seal">
                  <strong>{blog.author || 'CA Rajesh Sharma, Senior Partner'}</strong>
                  <span className="verified-ca-seal anim-seal-pop">
                    <i className="fas fa-check-circle"></i> Verified CA Advisory
                  </span>
                </div>
                <span className="author-meta-date">
                  Published on {formatDate(blog.createdAt || blog.publishedAt)} &bull; {blog.readTime || '5 min read'}
                </span>
              </div>
            </div>

            <div className="hero-action-buttons anim-buttons-spring">
              <button className="btn-hero-action btn-wa-share" onClick={handleShareWhatsApp} title="Share on WhatsApp">
                <i className="fab fa-whatsapp"></i>
                <span>Share</span>
              </button>
              <button className="btn-hero-action" onClick={handleCopyLink} title="Copy article link">
                <i className="fas fa-link"></i>
                <span>Copy Link</span>
              </button>
              <button className="btn-hero-action" onClick={() => window.print()} title="Print article">
                <i className="fas fa-print"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout with 3D Tilt Entrance */}
      <div className="container article-content-layout anim-tilt-expand">
        <main className="article-main-container">
          {/* Cinematic Cover Image */}
          {blog.image && (
            <div className="article-cinematic-cover anim-zoom-in">
              <img src={blog.image} alt={blog.title} />
              <span className="cinematic-caption">
                <i className="fas fa-camera"></i> Official Statutory Compliance Advisory &bull; Shree Chamunda Associates
              </span>
            </div>
          )}

          {/* Formatted Markdown Article Body */}
          <div
            className="article-formatted-body anim-prose-reveal"
            dangerouslySetInnerHTML={{ __html: renderMarkdownContent(blog.content) }}
          ></div>

          {/* Statutory Disclaimer Box */}
          <div className="article-disclaimer-banner anim-bubble-card">
            <i className="fas fa-balance-scale disclaimer-icon"></i>
            <div className="disclaimer-text">
              <strong>Statutory Compliance Notice:</strong>
              <p>Tax regulations, slabs, and exemptions are subject to amendments under the Finance Act and notifications issued by CBDT/CBIC. The insights above are for guidance purposes. Consult our Chartered Accountants for customized tax planning tailored to your exact business operations.</p>
            </div>
          </div>

          {/* Direct CA Consultation CTA */}
          <div className="article-cta-box anim-cta-spring">
            <div className="cta-box-text">
              <span className="cta-live-badge">🟢 Direct CA Consultation</span>
              <h3>Need assistance with {blog.category}?</h3>
              <p>Schedule a 1-on-1 confidential review with our senior Chartered Accountants for tax filings, notice resolution, and compliance audit.</p>
            </div>
            <button className="btn-cta-whatsapp" onClick={handleConsultCA}>
              <i className="fab fa-whatsapp"></i> Chat with Senior CA
            </button>
          </div>

          {/* Back Navigation Bar */}
          <div className="article-footer-nav">
            <Link to="/blog" className="btn-footer-back">
              <i className="fas fa-arrow-left"></i> Back to Knowledge Hub
            </Link>
          </div>
        </main>
      </div>

      {/* Related Articles Section with Staggered Entrance */}
      {relatedBlogs.length > 0 && (
        <section className="article-related-section">
          <div className="container">
            <div className="related-section-header anim-fade-in">
              <span className="related-tag">RELATED ADVISORY</span>
              <h2>Explore More {blog.category} Guides</h2>
            </div>

            <div className="related-cards-grid">
              {relatedBlogs.map((rel, idx) => (
                <Link
                  key={rel._id}
                  to={`/blog/${rel._id}`}
                  className={`related-bento-card anim-stagger-${idx + 1}`}
                >
                  <div className="related-card-img">
                    <img src={rel.image || '/assets/banner_screenshot.png'} alt={rel.title} />
                    <span className="related-card-badge">{rel.category}</span>
                  </div>
                  <div className="related-card-body">
                    <span className="related-card-date">{formatDate(rel.createdAt || rel.publishedAt)}</span>
                    <h3>{rel.title}</h3>
                    <p>{rel.summary}</p>
                    <span className="related-card-link">
                      <span>Read Guide</span>
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
