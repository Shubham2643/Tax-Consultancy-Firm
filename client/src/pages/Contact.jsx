import { useState } from 'react';
import ContactForm from '../components/ContactForm';
import { useSiteContext } from '../context/SiteContext';
import { getFAQs } from '../api';
import useFetch from '../hooks/useFetch';
import './Contact.css';

const Contact = () => {
  const { settings, loading: settingsLoading } = useSiteContext();
  const { data: faqResponse, loading: faqLoading } = useFetch(getFAQs);
  const faqs = faqResponse?.data?.slice(0, 4) || [];

  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  if (settingsLoading) {
    return (
      <div className="contact-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '30%', margin: '0 auto 40px' }}></div>
        <div className="contact-equal-two-col-grid">
          <div className="skeleton-card" style={{ height: '400px' }}></div>
          <div className="skeleton-card" style={{ height: '400px' }}></div>
        </div>
      </div>
    );
  }

  const phone = settings?.phone || '+91 95109 84735';
  const cleanPhone = '+919510984735';
  const email = settings?.email || 'shreechamundaassociates0905@gmail.com';
  const address = settings?.address || 'C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat - 382430';
  const workingHours = settings?.workingHours || 'Mon - Sat: 10:00 AM - 7:00 PM';
  const whatsappUrl = `https://wa.me/919510984735?text=${encodeURIComponent('Hello Shree Chamunda Associates! I would like to schedule a consultation regarding Tax & Compliance.')}`;

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
          <h1>Get In Touch With Our Expert</h1>
          <p>Schedule a 1-on-1 direct tax consultation, corporate audit inquiry, or business setup session.</p>
        </div>
      </div>

      {/* Symmetrical 50/50 Two-Column Layout */}
      <div className="container contact-equal-two-col-grid">
        {/* ========================================================
            COLUMN 1 (50%): Direct Channels & Office Location
            ======================================================== */}
        <div className="contact-col-half">
          {/* Direct Channels Bento Card */}
          <div className="contact-bento-card">
            <div className="contact-card-header">
              <div className="card-header-icon">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="card-header-text">
                <span className="card-kicker">DIRECT CHANNELS</span>
                <h2>Speak With An Expert</h2>
              </div>
            </div>

            <div className="contact-card-body">
              <p className="contact-intro-text">
                Have questions about ITR, GST scrutiny notices, company registration, or accounting? Our senior consultants are ready to assist you.
              </p>

              <div className="info-cards-stack">
                {/* Call Card */}
                <a href={`tel:${cleanPhone}`} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="channel-text-box">
                    <span className="channel-label">Direct Helpline</span>
                    <strong>{phone}</strong>
                    <span className="channel-sub">{workingHours} IST</span>
                  </div>
                </a>

                {/* Email Card */}
                <a href={`mailto:${email}`} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="channel-text-box">
                    <span className="channel-label">Official Advisory Email</span>
                    <strong>{email}</strong>
                    <span className="channel-sub">Queries answered within 2-4 hours</span>
                  </div>
                </a>

                {/* Office Address Card */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel-card"
                >
                  <div className="channel-icon-box">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="channel-text-box">
                    <span className="channel-label">Headquarters</span>
                    <strong>{address}</strong>
                    <span className="channel-sub">Open for scheduled in-person consultations</span>
                  </div>
                </a>

                {/* Instant WhatsApp Quick Card */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-wa-action-card">
                  <div className="wa-action-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="wa-action-text">
                    <strong>Need Fast CA Guidance?</strong>
                    <span>Chat directly with a Chartered Accountant on WhatsApp &rarr;</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Office Map Bento Card */}
          <div className="contact-bento-card">
            <div className="contact-card-header map-card-header">
              <div className="card-header-left">
                <div className="card-header-icon">
                  <i className="fas fa-compass"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">OFFICE LOCATION</span>
                  <h2>Visit Our Ahmedabad Office</h2>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-get-directions"
              >
                <i className="fas fa-directions"></i> Get Directions
              </a>
            </div>

            <div className="contact-card-body map-body-wrap">
              <iframe
                title="Shree Chamunda Associates Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.4285702206775!2d72.696144!3d23.0080352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e638b97cbbcb7%3A0xc07cfb19f1ad47a5!2sZaveri%20Estate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: '12px', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2 (50%): Contact Form & Quick FAQs
            ======================================================== */}
        <div className="contact-col-half">
          {/* Contact Inquiry Form Card */}
          <ContactForm />

          {/* Quick FAQs Bento Card */}
          {faqs.length > 0 && (
            <div className="contact-bento-card">
              <div className="contact-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">QUICK ANSWERS</span>
                  <h2>Frequently Asked Questions</h2>
                </div>
              </div>

              <div className="contact-card-body">
                <div className="contact-faq-stack">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div
                        key={faq._id || idx}
                        className={`contact-faq-item ${isOpen ? 'open' : ''}`}
                        onClick={() => toggleFaq(idx)}
                      >
                        <div className="contact-faq-question-row">
                          <h4>{faq.question}</h4>
                          <div className="faq-toggle-icon">
                            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="contact-faq-answer-box">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
