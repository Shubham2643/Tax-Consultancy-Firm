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
    <div className="contact-form-container">
      <h3>Send Us a Message</h3>
      <p className="contact-form-subtitle">Fill out the form below, and we will get back to you within 24 hours.</p>

      {status.success && (
        <div className="success-banner">
          <i className="fas fa-check-circle"></i>
          <p>Thank you! Your message has been sent successfully. We will get in touch soon.</p>
        </div>
      )}

      {status.error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i>
          <p>{status.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>
          <div className="form-group col">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="service">Interested Service</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">Select a service</option>
            <option value="GST Registration & Filing">GST Registration & Filing</option>
            <option value="Income Tax Return Filing">Income Tax Return Filing</option>
            <option value="Company / LLP Incorporation">Company / LLP Incorporation</option>
            <option value="Accounting & Bookkeeping">Accounting & Bookkeeping</option>
            <option value="Payroll Services">Payroll Services</option>
            <option value="Other Audit & Compliances">Other Audit & Compliances</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            minLength={10}
            rows="5"
            placeholder="Enter your message here (min. 10 characters)..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-submit" disabled={status.submitting}>
          {status.submitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Submitting...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
