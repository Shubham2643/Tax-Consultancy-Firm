import ServicesSection from '../components/ServicesSection';
import './Services.css';

const Services = () => {
  return (
    <div className="services-page fade-in">
      <div className="services-hero">
        <div className="container">
          <div className="services-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-briefcase"></i>
            <span>Practice Areas &bull; Statutory Filings</span>
          </div>
          <h1>All Advisory &amp; Compliance Services</h1>
          <p>Comprehensive direct tax, GST, audit, and company registration solutions delivered by certified Chartered Accountants.</p>
        </div>
      </div>

      <ServicesSection />
    </div>
  );
};

export default Services;
