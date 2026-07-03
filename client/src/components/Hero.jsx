import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './Hero.css';

const Hero = () => {
  const { settings, loading } = useSiteContext();

  if (loading) {
    return (
      <section className="hero skeleton-hero">
        <div className="container hero-content">
          <div className="skeleton skeleton-title" style={{ margin: '0 auto 20px', width: '50%' }}></div>
          <div className="skeleton skeleton-text" style={{ margin: '0 auto 30px', width: '70%', height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ margin: '0 auto 25px', width: '90%', height: '60px' }}></div>
          <div className="skeleton" style={{ margin: '30px auto 0', width: '150px', height: '50px', borderRadius: '24px' }}></div>
        </div>
      </section>
    );
  }

  const title = settings?.heroTitle || 'SHREE CHAMUNDA ASSOCIATES';
  const subtitle = settings?.heroSubtitle || 'THE BEST TAX CONSULTANCY FIRM IN GUJARAT';
  const description = settings?.heroDescription || 'Welcome to Shree Chamunda Associates, your trusted partner for comprehensive tax consultancy and financial advisory services.';

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-text-side">
          <div className="hero-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Trusted Tax Advisory Since 2023</span>
          </div>
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
          <p>{description}</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn-contact">
              <i className="fas fa-calendar-alt"></i> Free Consultation
            </Link>
            <Link to="/services" className="btn-explore">
              <i className="fas fa-briefcase"></i> Our Services
            </Link>
          </div>
        </div>
        <div className="hero-visual-side">
          <div className="highlight-cards-grid">
            <div className="highlight-card">
              <div className="card-icon-box">
                <i className="fas fa-business-time"></i>
              </div>
              <h3>4+ Years</h3>
              <p>Corporate Excellence</p>
            </div>
            <div className="highlight-card">
              <div className="card-icon-box">
                <i className="fas fa-users"></i>
              </div>
              <h3>250+</h3>
              <p>Satisfied Clients</p>
            </div>
            <div className="highlight-card">
              <div className="card-icon-box">
                <i className="fas fa-percentage"></i>
              </div>
              <h3>99.2%</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="highlight-card">
              <div className="card-icon-box">
                <i className="fas fa-award"></i>
              </div>
              <h3>100%</h3>
              <p>Audit Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
