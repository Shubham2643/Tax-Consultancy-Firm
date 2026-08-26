import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContact } from '../api';
import './ContactForm.css';

const ContactForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    if (location.state && location.state.planName) {
      setFormData((prev) => ({
        ...prev,
        service: `Inquiry about: ${location.state.planName}`,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      await submitContact(formData);
      setStatus({ submitting: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Submission failed. Please try again.';
      setStatus({ submitting: false, success: false, error: errMsg });
    }
  };

  return (
    <div className="contact-bento-form-wrap">
      <div className="contact-bento-form-header">
        <div className="contact-bento-icon">
          <i className="fas fa-paper-plane"></i>
        </div>
        <div className="contact-bento-title-wrap">
          <span className="contact-bento-kicker">SEND INQUIRY</span>
          <h3>Send Us a Message</h3>
        </div>
      </div>

      <div className="contact-bento-form-body">
        <p className="contact-form-subtitle">Fill out your details below and our senior CA team will get back to you within 24 hours.</p>

        {status.success && (
          <div className="contact-success-banner">
            <i className="fas fa-check-circle"></i>
            <p>Thank you! Your message has been sent successfully. We will get in touch soon.</p>
          </div>
        )}

        {status.error && (
          <div className="contact-error-banner">
            <i className="fas fa-exclamation-circle"></i>
            <p>{status.error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form-elements">
          <div className="contact-form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Rajesh Patel"
              className="contact-custom-input"
            />
          </div>

          <div className="contact-form-row">
            <div className="contact-form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="rajesh@company.com"
                className="contact-custom-input"
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="contact-custom-input"
              />
            </div>
          </div>

          <div className="contact-form-group">
            <label htmlFor="service">Interested Practice Area</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="contact-custom-select"
            >
              <option value="">Select a service / retainer</option>
              <option value="GST Registration & Monthly Filing">GST Registration &amp; Monthly Filing</option>
              <option value="Income Tax Return & Direct Tax Advisory">Income Tax Return &amp; Direct Tax Advisory</option>
              <option value="Company / LLP Turnkey Incorporation">Company / LLP Turnkey Incorporation</option>
              <option value="Complete Accounting & Bookkeeping Retainer">Complete Accounting &amp; Bookkeeping Retainer</option>
              <option value="Virtual CFO & Financial Leadership">Virtual CFO &amp; Financial Leadership</option>
              <option value="Statutory Notice Defense & Appeals">Statutory Notice Defense &amp; Appeals</option>
            </select>
          </div>

          <div className="contact-form-group">
            <label htmlFor="message">Your Inquiry / Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              rows="4"
              placeholder="Describe your business or specific filing requirement..."
              className="contact-custom-textarea"
            ></textarea>
          </div>

          <button type="submit" className="btn-contact-submit" disabled={status.submitting}>
            {status.submitting ? (
              <span><i className="fas fa-spinner fa-spin"></i> Submitting...</span>
            ) : (
              <span>Send Message <i className="fas fa-arrow-right"></i></span>
            )}
          </button>
        </form>

        <div className="contact-form-trust-pills">
          <div className="trust-pill">
            <i className="fas fa-lock"></i>
            <span>100% Confidential</span>
          </div>
          <div className="trust-pill">
            <i className="fas fa-user-shield"></i>
            <span>ICAI Certified</span>
          </div>
          <div className="trust-pill">
            <i className="fas fa-clock"></i>
            <span>&lt; 24h Response</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
