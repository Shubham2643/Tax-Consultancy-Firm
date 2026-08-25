import { useState } from 'react';
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
  const [openingBlogId, setOpeningBlogId] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_blogs') || '[]');
    } catch {
      return [];
    }
  });

  const categories = ['All', 'GST', 'Income Tax', 'Business Startups', 'Compliance', 'Saved'];

  const handleCardClick = (e, blogId) => {
    if (e.target.closest('.bookmark-btn') || e.target.closest('.card-bookmark-btn')) {
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

  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularPosts = featuredPost ? filteredBlogs.slice(1) : [];

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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container blog-container-wrapper">
        {/* Sleek Corporate Filter & Search Toolbar */}
        <div className="blog-toolbar-card">
          <div className="blog-toolbar-left">
            <div className="toolbar-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`toolbar-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'Saved' && <i className="fas fa-bookmark" style={{ marginRight: '5px' }}></i>}
                  {cat} {cat === 'Saved' && bookmarks.length > 0 && <span className="tab-counter">{bookmarks.length}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="blog-toolbar-right">
            <div className="toolbar-search-box">
              <i className="fas fa-search toolbar-search-icon"></i>
              <input
                type="text"
                placeholder="Search circulars, GST notices, 44ADA..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="toolbar-search-input"
              />
              {search && (
                <button className="toolbar-search-clear" onClick={() => setSearch('')} title="Clear search">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter / Filter Bar */}
        <div className="blog-results-bar">
          <span className="results-count">
            Showing <strong>{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? 'circular' : 'circulars'}
            {activeCategory !== 'All' && <span> in <em>{activeCategory}</em></span>}
            {search && <span> matching "<em>{search}</em>"</span>}
          </span>
          {(search || activeCategory !== 'All') && (
            <button className="btn-clear-all-filters" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              <i className="fas fa-undo"></i> Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="blog-loading-grid">
            <div className="skeleton skeleton-card" style={{ height: '360px', marginBottom: '30px' }}></div>
            <div className="blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: '320px' }}></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load articles. Please try again later.</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="no-blogs text-center py-5">
            <div className="no-blogs-icon-wrapper">
              <i className="fas fa-search"></i>
            </div>
            <h3>No Circulars Found</h3>
            <p>We couldn't find any tax circulars matching your search criteria.</p>
            <button className="btn-reset-filters" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Browse All Circulars
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post Spotlight */}
            {featuredPost && !search && activeCategory !== 'Saved' && (
              <div
                className={`featured-blog-card ${openingBlogId === featuredPost._id ? 'card-opening' : ''}`}
                onClick={(e) => handleCardClick(e, featuredPost._id)}
              >
                <div className="featured-img-box">
                  <img src={featuredPost.image || '/assets/banner_screenshot.png'} alt={featuredPost.title} />
                  <span className="featured-badge-pill">
                    <i className="fas fa-bolt"></i> Spotlight Analysis
                  </span>
                  <button
                    className={`bookmark-btn ${bookmarks.includes(featuredPost._id) ? 'bookmarked' : ''}`}
                    onClick={(e) => toggleBookmark(e, featuredPost._id)}
                    title="Bookmark article"
                  >
                    <i className={`fa${bookmarks.includes(featuredPost._id) ? 's' : 'r'} fa-bookmark`}></i>
                  </button>
                </div>

                <div className="featured-content-box">
                  <div className="featured-meta-header">
                    <span className="blog-tag-badge">{featuredPost.category}</span>
                    <span className="blog-meta-item">
                      <i className="far fa-calendar-alt"></i> {formatDate(featuredPost.createdAt || featuredPost.publishedAt)}
                    </span>
                    <span className="blog-meta-item">
                      <i className="far fa-clock"></i> {featuredPost.readTime || '5 min read'}
                    </span>
                  </div>

                  <h2 className="featured-headline">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.summary}</p>

                  <div className="featured-author-footer">
                    <div className="author-info">
                      <div className="author-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="author-names">
                        <strong>{featuredPost.author || 'Senior Tax Partner'}</strong>
                        <span>Chartered Advisory Desk</span>
                      </div>
                    </div>
                    <span className="btn-read-analysis">
                      <span>{openingBlogId === featuredPost._id ? 'Opening Guide...' : 'Read Full Analysis'}</span>
                      <i className={`fas ${openingBlogId === featuredPost._id ? 'fa-circle-notch fa-spin' : 'fa-arrow-right'}`}></i>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="blog-grid">
              {(search || activeCategory === 'Saved' ? filteredBlogs : regularPosts).map((blog) => (
                <div
                  key={blog._id}
                  className={`blog-card card-animate ${openingBlogId === blog._id ? 'card-opening' : ''}`}
                  onClick={(e) => handleCardClick(e, blog._id)}
                >
                  <div className="blog-card-img-box">
                    <img src={blog.image || '/assets/banner_screenshot.png'} alt={blog.title} />
                    <span className="card-category-pill">{blog.category}</span>
                    <button
                      className={`card-bookmark-btn ${bookmarks.includes(blog._id) ? 'bookmarked' : ''}`}
                      onClick={(e) => toggleBookmark(e, blog._id)}
                      title="Bookmark article"
                    >
                      <i className={`fa${bookmarks.includes(blog._id) ? 's' : 'r'} fa-bookmark`}></i>
                    </button>
                  </div>

                  <div className="blog-card-content">
                    <div className="blog-card-meta-row">
                      <span><i className="far fa-calendar-alt"></i> {formatDate(blog.createdAt || blog.publishedAt)}</span>
                      <span><i className="far fa-clock"></i> {blog.readTime || '4 min read'}</span>
                    </div>

                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">{blog.summary}</p>

                    <div className="blog-card-bottom-bar">
                      <span className={`blog-card-read-action ${openingBlogId === blog._id ? 'action-opening' : ''}`}>
                        <span>{openingBlogId === blog._id ? 'Opening...' : 'Read Article'}</span>
                        <i className={`fas ${openingBlogId === blog._id ? 'fa-circle-notch fa-spin' : 'fa-arrow-right'}`}></i>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
