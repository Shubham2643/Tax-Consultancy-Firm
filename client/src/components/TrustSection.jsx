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
  const trustMainText = settings?.trustMainText || 'We believe that selecting the right financial services firm is paramount to financial success.';
  
  const defaultFeatureCards = [
    {
      title: 'Strategic Taxation Service',
      desc: 'End-to-end direct & indirect tax planning, returns filing, and year-round advisory.',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      title: 'Tax Disputes & Scrutiny',
      desc: 'Expert representation for scrutiny notices, appeals, and tax tribunal cases.',
      icon: 'fas fa-gavel'
    },
    {
      title: 'Zero-Defect Quality Control',
      desc: 'Multi-tier audit verification ensuring 100% statutory legal compliance.',
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'High Standard of Integrity',
      desc: 'Transparent pricing with strict adherence to ICAI chartered ethics.',
      icon: 'fas fa-balance-scale'
    },
    {
      title: 'Experienced CA Team',
      desc: 'Senior tax consultants with deep expertise across Indian corporate laws.',
      icon: 'fas fa-user-tie'
    },
    {
      title: '24/7 Dedicated Support',
      desc: 'Priority query turnaround, live filing updates, and WhatsApp advisory.',
      icon: 'fas fa-headset'
    }
  ];

  return (
    <section className="trust">
      <div className="tst-container">
        <div className="trust-content">
          <div className="trust-left">
            <div className="trust-badge-label">
              <i className="fas fa-shield-alt"></i>
              <span>{trustHeading}</span>
            </div>
            <h2 className="trust-title">{trustMainText}</h2>

            <div className="trust-pillars-list">
              <div className="trust-pillar-card">
                <div className="pillar-icon-box">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="pillar-text">
                  <h4>Confidentiality & Professional Ethics</h4>
                  <p>We adhere to strict chartered standards of confidentiality and ethics, handling sensitive corporate data with bank-grade discretion.</p>
                </div>
              </div>

              <div className="trust-pillar-card">
                <div className="pillar-icon-box">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <div className="pillar-text">
                  <h4>Proactive Tax Planning</h4>
                  <p>Forward-looking strategies anticipating regulatory shifts, optimizing allowable deductions and preventing reactive compliance penalties.</p>
                </div>
              </div>
            </div>

            <div className="trust-actions">
              <button className="btn-trust-primary" onClick={() => navigate('/contact')}>
                <i className="fas fa-calendar-alt"></i>
                <span>Free Consultation</span>
                <i className="fas fa-arrow-right btn-arrow"></i>
              </button>
              <button className="btn-trust-secondary" onClick={() => navigate('/about')}>
                <i className="fas fa-info-circle"></i>
                <span>More About Us</span>
              </button>
            </div>
          </div>

          <div className="trust-right">
            <div className="offer-grid">
              {defaultFeatureCards.map((card, index) => (
                <div key={index} className="offer-card card-animate">
                  <div className="offer-icon-box">
                    <i className={card.icon}></i>
                  </div>
                  <h3 className="offer-card-title">{card.title}</h3>
                  <p className="offer-card-desc">{card.desc}</p>
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
