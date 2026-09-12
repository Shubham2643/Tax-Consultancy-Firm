import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContact } from '../api';
import ExecutiveSelect from './ExecutiveSelect';
import './ContactForm.css';

const ContactForm = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' | 'consultation'
  const [consultationMode, setConsultationMode] = useState('office'); // 'office' | 'virtual' | 'phone'
  const [preferredSlot, setPreferredSlot] = useState('morning'); // 'morning' | 'afternoon' | 'evening'
  const [urgency, setUrgency] = useState('standard'); // 'standard' | 'priority' | 'urgent'
  const [refId, setRefId] = useState('');

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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
    setStatus({
      submitting: false,
      success: false,
      error: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    const modeLabel = consultationMode === 'office'
      ? 'In-Person (Nikol Office)'
      : consultationMode === 'virtual'
      ? 'Virtual Google Meet'
      : 'Direct Phone Advisory';

    const slotLabel = preferredSlot === 'morning'
      ? 'Morning (10:30 AM - 1:00 PM)'
      : preferredSlot === 'afternoon'
      ? 'Afternoon (2:00 PM - 5:00 PM)'
      : 'Evening (5:00 PM - 7:00 PM)';

    const urgencyLabel = urgency === 'urgent'
      ? 'URGENT (< 48h Notice Deadline)'
      : urgency === 'priority'
      ? 'Priority (< 7 Days)'
      : 'Standard';

    // Format rich service title & message while preserving backend schema compatibility
    let formattedService = formData.service || (activeTab === 'consultation' ? '1-on-1 CA Consultation' : 'General Tax Advisory');
    if (activeTab === 'consultation') {
      formattedService = `[${consultationMode.toUpperCase()}] ${formattedService}`;
    }

    let formattedMessage = '';
    if (activeTab === 'consultation') {
      formattedMessage = `[APPOINTMENT REQUEST]\n` +
        `• Consultation Mode: ${modeLabel}\n` +
        `• Preferred Slot: ${slotLabel}\n` +
        `• Urgency Level: ${urgencyLabel}\n\n` +
        `[CLIENT BRIEF / DETAILS]\n` +
        `${formData.message.trim()}`;
    } else {
      formattedMessage = `[INQUIRY - ${urgencyLabel}]\n\n` +
        `${formData.message.trim()}`;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formattedService,
      message: formattedMessage,
    };

    try {
      await submitContact(payload);
      const generatedRef = `SCA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setRefId(generatedRef);
      setStatus({ submitting: false, success: true, error: null });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Submission failed. Please try again.';
      setStatus({ submitting: false, success: false, error: errMsg });
    }
  };

  return (
    <div className="contact-bento-form-wrap">
      {/* Interactive Desk Mode Switcher Tabs */}
      <div className="contact-mode-tabs">
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiry')}
        >
          <div className="tab-icon-wrap">
            <i className="fas fa-file-invoice"></i>
          </div>
          <span className="tab-text-title">General Inquiry</span>
          <span className="tab-pill-badge fast-response">Quick Intake</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'consultation' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultation')}
        >
          <div className="tab-icon-wrap">
            <i className="fas fa-calendar-check"></i>
          </div>
          <span className="tab-text-title">Book 1-on-1 Session</span>
          <span className="tab-pill-badge direct-ca">Direct CA</span>
        </button>
      </div>

      <div className="contact-bento-form-header executive-intake-header">
        <div className="form-header-left">
          <div className={`contact-bento-icon ${activeTab === 'consultation' ? 'ca-consultation-icon' : ''}`}>
            <i className={activeTab === 'consultation' ? 'fas fa-scale-balanced' : 'fas fa-paper-plane'}></i>
          </div>
          <div className="contact-bento-title-wrap">
            <div className="header-meta-row">
              <span className="contact-bento-kicker">
                {activeTab === 'consultation' ? 'PARTNER ADVISORY CHAMBERS' : 'OFFICIAL INQUIRY DESK'}
              </span>
              <span className="header-confidential-pill">
                <i className="fas fa-lock"></i> 100% Confidential
              </span>
              {activeTab === 'consultation' && (
                <span className="header-icai-pill">
                  <i className="fas fa-check-double"></i> ICAI Regulated
                </span>
              )}
            </div>
            <h3>
              {activeTab === 'consultation'
                ? 'Reserve 1-on-1 Senior CA Consultation'
                : 'Send An Official Inquiry'}
            </h3>
          </div>
        </div>

        <div className="header-triage-badge">
          <span className="triage-dot"></span>
          <span>{activeTab === 'consultation' ? 'Partner Direct' : 'Active Intake'}</span>
        </div>
      </div>

      <div className="contact-bento-form-body">
        {status.success ? (
          /* ============================================================
             10/10 EXECUTIVE CONFIRMATION CARD (Post-Submission)
             ============================================================ */
          <div className="consultation-success-card fade-in">
            <div className="success-pulse-ring">
              <i className="fas fa-check"></i>
            </div>

            <div className="success-header-text">
              <span className="success-kicker">TRANSMISSION CONFIRMED</span>
              <h3>Inquiry Dispatched to Senior Partners</h3>
              <p>
                Your request has been prioritized and routed to our Senior Direct Tax &amp; GST Compliance Division.
              </p>
            </div>

            {/* Reference Tracking Ticket */}
            <div className="success-ticket-box">
              <div className="ticket-field">
                <span className="ticket-label">Tracking Reference</span>
                <strong className="ticket-value ref-code">{refId || '#SCA-2026-ACTIVE'}</strong>
              </div>
              <div className="ticket-divider"></div>
              <div className="ticket-field">
                <span className="ticket-label">Desk Status</span>
                <strong className="ticket-value status-active">
                  <span className="pulse-dot"></span> In Queue for Review
                </strong>
              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div className="success-steps-roadmap">
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-text">
                  <strong>Partner Case Triage</strong>
                  <span>Case documents &amp; statutory deadlines evaluated</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-text">
                  <strong>Direct Callback</strong>
                  <span>Senior advisor calls within 24 business hours</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-text">
                  <strong>Action Plan Delivery</strong>
                  <span>Tailored compliance roadmap or audit defense delivered</span>
                </div>
              </div>
            </div>

            <div className="success-card-actions">
              <button type="button" onClick={resetForm} className="btn-success-reset">
                <i className="fas fa-redo"></i> Submit Another Request
              </button>
              <a
                href={`https://wa.me/919510984735?text=${encodeURIComponent(`Hello, I just submitted an inquiry on the website with Reference ID ${refId}. Could you please confirm?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-success-wa"
              >
                <i className="fab fa-whatsapp"></i> Instant WhatsApp Follow-up
              </a>
            </div>
          </div>
        ) : (
          /* ============================================================
             EXECUTIVE INQUIRY / CONSULTATION FORM
             ============================================================ */
          <>
            <p className="contact-form-subtitle">
              {activeTab === 'consultation'
                ? 'Schedule a confidential session with our qualified Chartered Accountants for statutory audit defense, tax optimization, and corporate advisory.'
                : 'Direct transmission to our Senior CA Partners. Every submission is analyzed for compliance deadlines and tax optimization.'}
            </p>

            {/* Consultation Deliverables & Session Scope Strip */}
            {activeTab === 'consultation' && (
              <div className="session-scope-ribbon fade-in">
                <div className="scope-item">
                  <i className="fas fa-file-invoice-dollar"></i>
                  <div className="scope-text">
                    <strong>Statutory Assessment</strong>
                    <span>Notice &amp; filings audit prior to call</span>
                  </div>
                </div>
                <div className="scope-divider"></div>
                <div className="scope-item">
                  <i className="fas fa-user-shield"></i>
                  <div className="scope-text">
                    <strong>Partner Led (30–45m)</strong>
                    <span>Direct Chartered Accountant advisory</span>
                  </div>
                </div>
                <div className="scope-divider"></div>
                <div className="scope-item">
                  <i className="fas fa-clipboard-check"></i>
                  <div className="scope-text">
                    <strong>Written Action Memo</strong>
                    <span>Clear tax roadmap &amp; legal opinion</span>
                  </div>
                </div>
              </div>
            )}

            {status.error && (
              <div className="contact-error-banner fade-in">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{status.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form-elements">
              {/* Consultation Specific Selectors */}
              {activeTab === 'consultation' && (
                <div className="consultation-compact-stack fade-in">
                  {/* Channel Selector */}
                  <div className="compact-selector-block">
                    <div className="compact-header-row">
                      <span className="compact-step-label">CONSULTATION CHANNEL</span>
                      <span className="compact-tag-pill">
                        <i className="fas fa-shield-halved"></i> 100% Partner-Led
                      </span>
                    </div>
                    <div className="consultation-mode-grid-3">
                      <button
                        type="button"
                        className={`compact-mode-card ${consultationMode === 'office' ? 'active' : ''}`}
                        onClick={() => setConsultationMode('office')}
                      >
                        <div className="compact-card-icon"><i className="fas fa-building-columns"></i></div>
                        <div className="compact-card-info">
                          <strong>In-Person Chambers</strong>
                          <span>Nikol, Ahmedabad</span>
                        </div>
                        {consultationMode === 'office' && <i className="fas fa-check-circle compact-check"></i>}
                      </button>

                      <button
                        type="button"
                        className={`compact-mode-card ${consultationMode === 'virtual' ? 'active' : ''}`}
                        onClick={() => setConsultationMode('virtual')}
                      >
                        <div className="compact-card-icon"><i className="fas fa-video"></i></div>
                        <div className="compact-card-info">
                          <strong>Virtual Video</strong>
                          <span>Google Meet HD</span>
                        </div>
                        {consultationMode === 'virtual' && <i className="fas fa-check-circle compact-check"></i>}
                      </button>

                      <button
                        type="button"
                        className={`compact-mode-card ${consultationMode === 'phone' ? 'active' : ''}`}
                        onClick={() => setConsultationMode('phone')}
                      >
                        <div className="compact-card-icon"><i className="fas fa-phone-volume"></i></div>
                        <div className="compact-card-info">
                          <strong>Direct CA Line</strong>
                          <span>Immediate Triage</span>
                        </div>
                        {consultationMode === 'phone' && <i className="fas fa-check-circle compact-check"></i>}
                      </button>
                    </div>
                  </div>

                  {/* Timing Slot Selector */}
                  <div className="compact-selector-block">
                    <div className="compact-header-row">
                      <span className="compact-step-label">PREFERRED ADVISORY WINDOW</span>
                      <span className="compact-tag-pill">
                        <i className="far fa-clock"></i> Mon – Sat (IST)
                      </span>
                    </div>
                    <div className="consultation-slot-grid-3">
                      <button
                        type="button"
                        className={`compact-slot-card ${preferredSlot === 'morning' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('morning')}
                      >
                        <i className="fas fa-sun"></i>
                        <span className="slot-title">Morning</span>
                        <span className="slot-time">10:30 AM – 1:00 PM</span>
                      </button>

                      <button
                        type="button"
                        className={`compact-slot-card ${preferredSlot === 'afternoon' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('afternoon')}
                      >
                        <i className="fas fa-cloud-sun"></i>
                        <span className="slot-title">Afternoon</span>
                        <span className="slot-time">2:00 PM – 5:00 PM</span>
                      </button>

                      <button
                        type="button"
                        className={`compact-slot-card ${preferredSlot === 'evening' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('evening')}
                      >
                        <i className="fas fa-moon"></i>
                        <span className="slot-title">Evening</span>
                        <span className="slot-time">5:00 PM – 7:00 PM</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Urgency Level Chips */}
              <div className="urgency-selector-block">
                <div className="urgency-header-row">
                  <label className="form-sub-label">Urgency &amp; Notice Deadline</label>
                  <span className="urgency-tip">Helps us triage statutory court/filing deadlines</span>
                </div>
                <div className="urgency-chips-row">
                  <button
                    type="button"
                    className={`urgency-chip ${urgency === 'standard' ? 'active standard' : ''}`}
                    onClick={() => setUrgency('standard')}
                  >
                    <span className="dot standard"></span> Standard Inquiry
                  </button>
                  <button
                    type="button"
                    className={`urgency-chip ${urgency === 'priority' ? 'active priority' : ''}`}
                    onClick={() => setUrgency('priority')}
                  >
                    <span className="dot priority"></span> Filing Due &lt; 7 Days
                  </button>
                  <button
                    type="button"
                    className={`urgency-chip ${urgency === 'urgent' ? 'active urgent' : ''}`}
                    onClick={() => setUrgency('urgent')}
                  >
                    <span className="dot urgent"></span> <i className="fas fa-triangle-exclamation"></i> Urgent Notice &lt; 48h
                  </button>
                </div>
              </div>

              {/* Core Contact Inputs */}
              <div className="contact-form-group">
                <label htmlFor="contact-name" className="luxury-input-label">
                  Full Name or Organization <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rajesh Patel / Enterprise Group"
                    className="contact-custom-input with-left-icon"
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contact-email" className="luxury-input-label">
                    Official Email Address <span className="req-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="client@enterprise.com"
                      className="contact-custom-input with-left-icon"
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-phone" className="luxury-input-label">
                    Phone Number <span className="label-sub-tag">WhatsApp Ready</span>
                  </label>
                  <div className="unified-phone-box">
                    <div className="phone-flag-segment">
                      <span className="country-flag-icon">🇮🇳</span>
                      <span className="prefix-code">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="unified-phone-field"
                    />
                  </div>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-service" className="luxury-input-label">
                  Primary Practice Domain or Service Needed
                </label>
                <ExecutiveSelect
                  id="contact-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  placeholder="Select a practice area or advisory domain"
                />
              </div>

              <div className="contact-form-group">
                <div className="textarea-label-row">
                  <label htmlFor="contact-message" className="luxury-input-label">
                    Case Details or Business Inquiry <span className="req-star">*</span>
                  </label>
                  <span className={`char-counter ${formData.message.length > 1800 ? 'near-limit' : ''}`}>
                    {formData.message.length} / 2000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={2000}
                  rows="4"
                  placeholder={
                    activeTab === 'consultation'
                      ? 'Please briefly outline your business structure, filing status, or specific notices received...'
                      : 'Describe your requirements, transaction scale, or questions for our senior partners...'
                  }
                  className="contact-custom-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`btn-contact-submit ${status.submitting ? 'submitting' : ''}`}
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <span className="submit-btn-content">
                    <span className="submit-btn-icon-seal">
                      <i className="fas fa-circle-notch fa-spin"></i>
                    </span>
                    <span className="submit-btn-title">Dispatching Request to Partners...</span>
                  </span>
                ) : (
                  <span className="submit-btn-content">
                    <span className="submit-btn-icon-seal">
                      <i className={activeTab === 'consultation' ? 'fas fa-calendar-check' : 'fas fa-paper-plane'}></i>
                    </span>
                    <span className="submit-btn-title">
                      {activeTab === 'consultation' ? 'Reserve 1-on-1 CA Consultation' : 'Submit Official Inquiry'}
                    </span>
                    <span className="submit-btn-arrow-disc">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </span>
                )}
              </button>
            </form>

            <div className="form-security-ribbon">
              <div className="security-ribbon-item">
                <div className="security-icon-circle">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="security-text-group">
                  <strong className="security-title">Bank-Grade SSL</strong>
                  <span className="security-subtitle">256-Bit Encryption</span>
                </div>
              </div>

              <div className="security-ribbon-divider"></div>

              <div className="security-ribbon-item">
                <div className="security-icon-circle">
                  <i className="fas fa-scale-balanced"></i>
                </div>
                <div className="security-text-group">
                  <strong className="security-title">ICAI Regulated</strong>
                  <span className="security-subtitle">Statutory Privilege</span>
                </div>
              </div>

              <div className="security-ribbon-divider"></div>

              <div className="security-ribbon-item">
                <div className="security-icon-circle">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="security-text-group">
                  <strong className="security-title">Priority Callback</strong>
                  <span className="security-subtitle">Under 30-Min SLA</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
