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
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = settings?.address || 'C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Shree Chamunda Associates! I would like to schedule a consultation regarding Tax & Compliance.')}`;

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="contact-page fade-in">
      {/* Luxury Inner Page Hero */}
      <div className="contact-hero">
        <div className="container">
          <div className="contact-hero-badge">
            <span className="live-dot"></span>
            <i className="fas fa-headset"></i>
            <span>Advisory &amp; Consultation Desk</span>
          </div>
          <h1>Get In Touch With Our CA Team</h1>
          <p>Schedule a 1-on-1 direct tax consultation, corporate audit inquiry, or business setup session.</p>
        </div>
      </div>

      <div className="container contact-container-wrapper">
        <div className="contact-grid">
          {/* Left Panel: Contact Information & Direct Channels */}
          <div className="contact-info-panel">
            <div className="contact-info-header">
              <span className="contact-panel-badge">DIRECT CHANNELS</span>
              <h2>Speak With An Expert</h2>
              <p className="contact-intro">
                Have questions about ITR, GST scrutiny notices, company registration, or accounting? Our senior consultants are ready to assist you.
              </p>
            </div>

            <div className="info-list">
              {/* Call Card */}
              <div className="info-card">
                <div className="info-icon-tile">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="info-text">
                  <span className="info-label">Direct Phone</span>
                  <a href={`tel:${phone}`} className="info-link">{phone}</a>
                  <span className="info-sub">Mon-Sat, 10:00 AM - 7:00 PM IST</span>
                </div>
              </div>

              {/* Email Card */}
              <div className="info-card">
                <div className="info-icon-tile">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="info-text">
                  <span className="info-label">Official Email</span>
                  <a href={`mailto:${email}`} className="info-link">{email}</a>
                  <span className="info-sub">Queries answered within 2-4 hours</span>
                </div>
              </div>

              {/* Office Address Card */}
              <div className="info-card">
                <div className="info-icon-tile">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="info-text">
                  <span className="info-label">Headquarters</span>
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

              {/* Instant WhatsApp Quick Card */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-quick-card">
                <div className="wa-icon-box">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="wa-text-box">
                  <strong>Need Urgent Guidance?</strong>
                  <span>Chat directly with a Chartered Accountant on WhatsApp &rarr;</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Panel: Elevated Contact Form */}
          <div className="contact-form-panel">
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <div>
              <span className="contact-panel-badge">OUR LOCATION</span>
              <h2>Visit Our Ahmedabad Office</h2>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-directions"
            >
              <i className="fas fa-route"></i>
              <span>Get Directions</span>
            </a>
          </div>
          <div className="map-container">
            <iframe
              title="Shree Chamunda Associates Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.4285702206775!2d72.696144!3d23.0080352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e638b97cbbcb7%3A0xc07cfb19f1ad47a5!2sZaveri%20Estate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Quick FAQs section */}
        {faqs.length > 0 && (
          <div className="quick-faq-section">
            <div className="quick-faq-header">
              <span className="contact-panel-badge">QUICK HELP</span>
              <h2>Frequently Asked Questions</h2>
              <p className="quick-faq-intro">Common inquiries regarding our tax advisory and onboarding process</p>
            </div>
            <div className="quick-faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={faq._id} className={`quick-faq-item ${isOpen ? 'open' : ''}`} onClick={() => toggleFaq(idx)}>
                    <div className="quick-faq-question">
                      <h4>{faq.question}</h4>
                      <i className={`fas fa-chevron-down quick-faq-icon ${isOpen ? 'rotate' : ''}`}></i>
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
