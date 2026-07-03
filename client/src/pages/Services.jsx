import ServicesSection from '../components/ServicesSection';
import './Services.css';

const Services = () => {
  return (
    <div className="services-page fade-in">
      <div className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Explore our wide range of tax and compliance services</p>
        </div>
      </div>
      
      <div className="services-intro-section container text-center">
        <h2>Expert Tax & Accounting Consultancy</h2>
        <p>
          We provide strategic business and compliance services to start, run, and scale up your business. Whether you need tax filings, system setups, registrations, or ongoing advisory, our expert CAs and tax consultants are here to support your growth.
        </p>
      </div>

      <ServicesSection />
    </div>
  );
};

export default Services;
