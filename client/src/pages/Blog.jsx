import { useState } from 'react';
import { getBlogs } from '../api';
import useFetch from '../hooks/useFetch';
import './Blog.css';

const Blog = () => {
  const { data: response, loading, error } = useFetch(getBlogs);
  const blogs = response?.data || [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const categories = ['All', 'GST', 'Income Tax', 'Business Startups', 'Compliance'];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.summary.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Find featured post (latest post under activeCategory, or absolute latest)
  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularPosts = featuredPost ? filteredBlogs.slice(1) : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="blog-page fade-in">
      <div className="blog-hero">
        <div className="container">
          <h1>Knowledge Hub & Blog</h1>
          <p>Expert insights, GST guides, and Income Tax updates from our professionals</p>
        </div>
      </div>

      <div className="container blog-container-wrapper">
        {/* Controls */}
        <div className="blog-controls">
          <div className="blog-search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="blog-search-input"
            />
          </div>

          <div className="blog-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="blog-loading-grid">
            <div className="skeleton skeleton-card" style={{ height: '350px', marginBottom: '30px' }}></div>
            <div className="blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: '300px' }}></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Failed to load articles. Please try again later.</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="no-blogs text-center py-5">
            <i className="fas fa-file-signature no-blogs-icon"></i>
            <h3>No Articles Found</h3>
            <p>We couldn't find any articles matching your search query. Try another keyword.</p>
          </div>
        ) : (
          <>
            {/* Featured Post Spotlight (Only if searching/filters are empty or it's page load) */}
            {featuredPost && !search && (
              <div className="featured-blog-card" onClick={() => setSelectedBlog(featuredPost)}>
                <div className="featured-img-wrapper">
                  <img src={featuredPost.image} alt={featuredPost.title} />
                </div>
                <div className="featured-info">
                  <span className="blog-badge featured-badge">{featuredPost.category}</span>
                  <div className="blog-meta">
                    <span><i className="far fa-calendar-alt"></i> {formatDate(featuredPost.createdAt)}</span>
                    <span><i className="far fa-clock"></i> {featuredPost.readTime}</span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.summary}</p>
                  <div className="blog-author-line">
                    <span className="blog-author"><i className="far fa-user"></i> {featuredPost.author}</span>
                    <button className="read-more-link">Read Full Article <i className="fas fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Regular Posts */}
            <div className="blog-grid">
              {(search ? filteredBlogs : regularPosts).map((blog) => (
                <div key={blog._id} className="blog-item-card" onClick={() => setSelectedBlog(blog)}>
                  <div className="blog-card-img-wrapper">
                    <img src={blog.image} alt={blog.title} />
                    <span className="blog-badge">{blog.category}</span>
                  </div>
                  <div className="blog-card-info">
                    <div className="blog-meta">
                      <span><i className="far fa-calendar-alt"></i> {formatDate(blog.createdAt)}</span>
                      <span><i className="far fa-clock"></i> {blog.readTime}</span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.summary}</p>
                    <div className="blog-card-footer">
                      <span className="blog-author"><i className="far fa-user"></i> {blog.author}</span>
                      <span className="read-btn">Read <i className="fas fa-chevron-right"></i></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Overlay Reader Modal */}
      {selectedBlog && (
        <div className="blog-reader-modal" onClick={() => setSelectedBlog(null)}>
          <div className="blog-reader-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-reader-btn" onClick={() => setSelectedBlog(null)} aria-label="Close reader">
              <i className="fas fa-times"></i>
            </button>
            <div className="reader-header">
              <span className="blog-badge">{selectedBlog.category}</span>
              <h1>{selectedBlog.title}</h1>
              <div className="reader-meta">
                <span><i className="far fa-calendar-alt"></i> {formatDate(selectedBlog.createdAt)}</span>
                <span><i className="far fa-clock"></i> {selectedBlog.readTime}</span>
                <span><i className="far fa-user"></i> {selectedBlog.author}</span>
              </div>
            </div>
            <div className="reader-banner-img">
              <img src={selectedBlog.image} alt={selectedBlog.title} />
            </div>
            <div className="reader-body">
              {selectedBlog.content.split('\n\n').map((para, idx) => {
                if (para.startsWith('### ')) {
                  return <h3 key={idx} className="reader-h3">{para.replace('### ', '')}</h3>;
                }
                if (para.startsWith('1. ') || para.startsWith('- ')) {
                  const items = para.split('\n');
                  return (
                    <ul key={idx} className="reader-list">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s+|^-\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>
            <div className="reader-tags">
              {selectedBlog.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">#{tag}</span>
              ))}
            </div>
            <div className="reader-footer-cta">
              <h4>Need specific advice on this topic?</h4>
              <p>Get in touch with our tax professionals at Shree Chamunda Associates for tailored consultations.</p>
              <a href="/contact" className="btn btn-cta" onClick={() => setSelectedBlog(null)}>Talk to an Expert</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
