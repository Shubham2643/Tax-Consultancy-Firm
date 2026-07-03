import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './TrustSection.css';

const TrustSection = () => {
  const { settings, loading } = useSiteContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="trust">
        <div className="tst-container">
          <div className="trust-content">
            <div className="trust-left">
              <div className="skeleton skeleton-text" style={{ width: '40%', height: '25px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%', height: '80px', marginTop: '20px' }}></div>
              <div className="offer-list" style={{ marginTop: '20px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton skeleton-text" style={{ width: '60%', height: '20px', marginBottom: '12px' }}></div>
                ))}
              </div>
            </div>
            <div className="trust-right" style={{ marginTop: '49px' }}>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '120px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '100px', marginTop: '20px' }}></div>
              <div className="buttons" style={{ marginTop: '37px' }}>
                <div className="skeleton" style={{ width: '180px', height: '45px' }}></div>
                <div className="skeleton" style={{ width: '150px', height: '45px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const trustHeading = settings?.trustHeading || 'WHAT WE OFFER';
  const trustMainText = settings?.trustMainText || 'We believe that selecting the right financial services firm is paramount to the financial success!';
  const offerItems = settings?.offerItems || [
    'Best Taxation Service',
    'Tax Disputes',
    'Quality Control',
    'High Standard of Integrity',
    'Professional Team',
    '24/7 Legal Customer Support'
  ];
  const trustDescription = settings?.trustDescription || 'Confidentiality and Ethics: We adhere to the highest professional standards of confidentiality and ethics. You can trust us to handle your sensitive financial information with the utmost care and discretion.';
  const trustDescription2 = settings?.trustDescription2 || 'Proactive Strategies: We believe in proactive tax planning rather than reactive measures. By anticipating changes in tax laws and identifying help. We provide ongoing tax consultation services for small business owners to help with everything from tax planning to bookkeeping. Whether you\'re a sole proprietor or managing a larger team.';

  return (
    <section className="trust">
      <div className="tst-container">
        <div className="trust-content">
          <div className="trust-left">
            <span className="trust-badge-label">{trustHeading}</span>
            <h2 className="trust-title">{trustMainText}</h2>
            <p className="trust-description">{trustDescription}</p>
            <p className="trust-description">{trustDescription2}</p>
            <div className="buttons">
              <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                <i className="fas fa-calendar-alt"></i> FREE CONSULTATION
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/about')}>
                <i className="fas fa-info-circle"></i> MORE ABOUT US
              </button>
            </div>
          </div>

          <div className="trust-right">
            <div className="offer-grid">
              {offerItems.map((item, index) => (
                <div key={index} className="offer-card card-animate">
                  <div className="offer-icon-box">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
