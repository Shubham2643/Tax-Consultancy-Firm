import { useState, useEffect } from 'react';
import { useSiteContext } from '../context/SiteContext';
import { getTeamMembers } from '../api';
import './About.css';

const About = () => {
  const { settings, loading } = useSiteContext();
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getTeamMembers();
        if (res.success && res.data) {
          setTeam(res.data);
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        setTeamLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="about-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '30%', margin: '0 auto 40px' }}></div>
        <div className="row" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div className="col skeleton-card" style={{ flex: '1', minWidth: '300px', height: '350px' }}></div>
          <div className="col" style={{ flex: '1', minWidth: '300px' }}>
            <div className="skeleton skeleton-text" style={{ width: '90%', height: '30px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '95%', height: '150px', marginTop: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const companyDescription = settings?.companyDescription || 'Shree Chamunda Associates is a well reputed company providing complete solutions for Tax Services.';

  const stats = [
    { number: '4+', label: 'Years Experience', icon: 'fas fa-award' },
    { number: '200+', label: 'Happy Clients', icon: 'fas fa-users' },
    { number: '5+', label: 'Expert CAs & Advisors', icon: 'fas fa-user-tie' },
    { number: '1500+', label: 'Filings Completed', icon: 'fas fa-file-invoice-dollar' },
  ];

  const timeline = [
    { year: '2023', title: 'Foundation', desc: 'Shree Chamunda Associates was established in Ahmedabad, Gujarat, starting with direct tax advisory.' },
    { year: '2024', title: 'GST Transition', desc: 'Pioneered GST training and compliance support for over 200 local manufacturing units during the nation-wide transition.' },
    { year: '2025', title: 'Digital Accounting Expansion', desc: 'Transitioned all client bookkeeping services onto the cloud, ensuring real-time accessibility and paperless audits.' },
    { year: '2025', title: 'Corporate Compliance Expansion', desc: 'Expanded corporate consultation offerings to include LLP, OPC, and Pvt Ltd company incorporation services.' },
    { year: '2026', title: 'Dynamic Financial Advisory', desc: 'Serving over 2500+ corporate and individual clients with customized digital tax planning systems.' },
  ];

  return (
    <div className="about-page fade-in">
      <div className="about-hero">
        <div className="container">
          <h1>About Our Firm</h1>
          <p>Delivering Integrity, Excellence, and Client-Centric Tax Advisory Since 2016</p>
        </div>
      </div>

      <div className="container about-content-wrapper">
        <div className="about-grid">
          <div className="about-pillars-container">
            <div className="pillar-item">
              <div className="pillar-icon-box">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="pillar-text">
                <h3>Uncompromising Trust</h3>
                <p>Adhering to strict confidentiality and ethical guidelines to protect your sensitive financial records.</p>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-icon-box">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="pillar-text">
                <h3>Strategic Growth</h3>
                <p>Leveraging active tax-planning solutions to legally minimize liability and drive financial efficiency.</p>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-icon-box">
                <i className="fas fa-check-double"></i>
              </div>
              <div className="pillar-text">
                <h3>Compliance & Precision</h3>
                <p>Ensuring 100% accurate filings through detailed pre-submission reviews and data reconciliation.</p>
              </div>
            </div>
          </div>

          <div className="about-text-content">
            <h2>Our Story & Mission</h2>
            <p className="lead-text">{companyDescription}</p>
            <p>
              Shree Chamunda Associates is a team of experienced tax professionals, Chartered Accountants (CAs), and financial experts dedicated to providing accurate, ethical, and client-centric solutions. Our mission is to simplify tax compliance, optimize financial strategies, and ensure our clients achieve maximum benefits while staying fully compliant with regulatory requirements.
            </p>
            <p>
              We believe that selecting the right financial services firm is paramount to financial success. We adhere to the highest professional standards of confidentiality and ethics. You can trust us to handle your sensitive financial information with the utmost care and discretion.
            </p>
          </div>
        </div>

        {/* Dynamic Stats Banner */}
        <div className="about-stats-banner">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon-wrapper">
                <i className={stat.icon}></i>
              </div>
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Interactive History Timeline */}
        <div className="history-timeline-section">
          <h2>Our Journey & Milestones</h2>
          <p className="timeline-subtitle">A look at how we built our reputation as a trusted consultancy</p>
          <div className="timeline-container">
            {timeline.map((item, idx) => (
              <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content-box">
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Team Section */}
        <div className="team-section">
          <h2>Our Professional Team</h2>
          <p className="team-subtitle">Meet the minds behind Shree Chamunda Associates</p>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-img-wrapper">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <span className="team-specialty">{member.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
