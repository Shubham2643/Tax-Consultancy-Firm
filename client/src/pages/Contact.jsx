import { useState } from 'react';
import ContactForm from '../components/ContactForm';
import { useSiteContext } from '../context/SiteContext';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import './Contact.css';

const Contact = () => {
  const { settings, loading: settingsLoading } = useSiteContext();
  const { data: faqResponse, loading: faqLoading } = useFetch(getFAQs);
  const faqs = faqResponse?.data?.slice(0, 4) || []; // Top 4 FAQs

  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  if (settingsLoading) {
    return (
      <div className="contact-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '30%', margin: '0 auto 40px' }}></div>
        <div className="contact-grid">
          <div className="skeleton-card" style={{ height: '400px' }}></div>
          <div className="skeleton-card" style={{ height: '400px' }}></div>
        </div>
      </div>
    );
  }

  const phone = settings?.phone || '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = settings?.address || 'C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat';
  const workingHours = settings?.workingHours || 'Mon-Sat: 10.00 AM-7.00 PM';

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="contact-page fade-in">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our tax professionals</p>
        </div>
      </div>

      <div className="container contact-container-wrapper">
        <div className="contact-grid">
          <div className="contact-info-panel">
            <h2>Get In Touch</h2>
            <p className="contact-intro">
              Have questions about taxation, company setup, GST, or payroll? Contact us today to schedule a consultation with our experienced professionals.
            </p>

            <div className="info-list">
              <div className="info-card">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <h3>Call Us</h3>
                  <a href={`tel:${phone}`} className="info-link">{phone}</a>
                </div>
              </div>

              <div className="info-card">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email Address</h3>
                  <a href={`mailto:${email}`} className="info-link">{email}</a>
                </div>
              </div>

              <div className="info-card">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Business Hours</h3>
                  <p>{workingHours}</p>
                </div>
              </div>

              <div className="info-card">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Our Office</h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    {address}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            <ContactForm />
          </div>
        </div>

        {/* Map Section with directions helper */}
        <div className="map-section">
          <div className="map-header">
            <h2>Find Us On Map</h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-directions"
            >
              <i className="fas fa-route"></i> Get Directions
            </a>
          </div>
          <div className="map-container">
            <iframe
              title="Shree Chamunda Associates Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.4285702206775!2d72.696144!3d23.0080352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e638b97cbbcb7%3A0xc07cfb19f1ad47a5!2sZaveri%20Estate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Quick FAQs section */}
        {faqs.length > 0 && (
          <div className="quick-faq-section">
            <h2>Quick Consultation FAQs</h2>
            <p className="quick-faq-intro">Common questions clients ask before scheduling a consultation</p>
            <div className="quick-faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={faq._id} className={`quick-faq-item ${isOpen ? 'open' : ''}`} onClick={() => toggleFaq(idx)}>
                    <div className="quick-faq-question">
                      <h4>{faq.question}</h4>
                      <i className={`fas fa-plus quick-faq-icon ${isOpen ? 'rotate' : ''}`}></i>
                    </div>
                    <div className="quick-faq-answer" style={{ maxHeight: isOpen ? '200px' : '0' }}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
