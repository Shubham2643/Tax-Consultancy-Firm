import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContact } from '../api';
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
                <div className="consultation-options-stack fade-in">
                  <div className="consultation-mode-block">
                    <div className="channel-section-header">
                      <div className="channel-header-left">
                        <span className="channel-step-badge">CONSULTATION CHANNEL</span>
                        <h4 className="channel-header-title">Choose How You'd Like to Meet</h4>
                      </div>
                      <div className="channel-header-tag">
                        <i className="fas fa-shield-halved"></i>
                        <span>100% Partner-Led</span>
                      </div>
                    </div>

                    <div className="channel-cards-stack">
                      {/* In-Person Chambers */}
                      <button
                        type="button"
                        className={`channel-tier-card ${consultationMode === 'office' ? 'selected' : ''}`}
                        onClick={() => setConsultationMode('office')}
                      >
                        <div className="channel-card-avatar office">
                          <i className="fas fa-building-columns"></i>
                        </div>
                        <div className="channel-card-content">
                          <div className="channel-card-topline">
                            <strong className="channel-title">In-Person Chambers</strong>
                            <span className="channel-pill office">
                              <i className="fas fa-map-pin"></i> Nikol Office &bull; Boardroom
                            </span>
                          </div>
                          <p className="channel-desc">
                            Confidential face-to-face consultation at our Nikol headquarters. Bring physical notice files, ledgers, and books of accounts for immediate scrutiny.
                          </p>
                          <div className="channel-perks-row">
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Physical Document Scrutiny
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> 1-on-1 Partner Advisory
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Dedicated Meeting Chamber
                            </span>
                          </div>
                        </div>
                        <div className="channel-radio-indicator">
                          <div className={`custom-radio-circle ${consultationMode === 'office' ? 'checked' : ''}`}>
                            {consultationMode === 'office' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="radio-unselected-ring"></span>
                            )}
                          </div>
                          <span className="radio-state-text">
                            {consultationMode === 'office' ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </button>

                      {/* Virtual Video Session */}
                      <button
                        type="button"
                        className={`channel-tier-card ${consultationMode === 'virtual' ? 'selected' : ''}`}
                        onClick={() => setConsultationMode('virtual')}
                      >
                        <div className="channel-card-avatar virtual">
                          <i className="fas fa-video"></i>
                        </div>
                        <div className="channel-card-content">
                          <div className="channel-card-topline">
                            <strong className="channel-title">Encrypted Video Session</strong>
                            <span className="channel-pill virtual">
                              <i className="fas fa-laptop"></i> Google Meet HD
                            </span>
                          </div>
                          <p className="channel-desc">
                            Encrypted HD virtual conference with live screen-sharing. Ideal for PAN-India corporate filings, IT portal notice audits, and NRI tax advisory.
                          </p>
                          <div className="channel-perks-row">
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Live Portal Screen Share
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> PAN-India &amp; NRI Ready
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Encrypted Meeting Room
                            </span>
                          </div>
                        </div>
                        <div className="channel-radio-indicator">
                          <div className={`custom-radio-circle ${consultationMode === 'virtual' ? 'checked' : ''}`}>
                            {consultationMode === 'virtual' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="radio-unselected-ring"></span>
                            )}
                          </div>
                          <span className="radio-state-text">
                            {consultationMode === 'virtual' ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </button>

                      {/* Direct Phone Advisory */}
                      <button
                        type="button"
                        className={`channel-tier-card ${consultationMode === 'phone' ? 'selected' : ''}`}
                        onClick={() => setConsultationMode('phone')}
                      >
                        <div className="channel-card-avatar phone">
                          <i className="fas fa-phone-volume"></i>
                        </div>
                        <div className="channel-card-content">
                          <div className="channel-card-topline">
                            <strong className="channel-title">Direct Phone Advisory</strong>
                            <span className="channel-pill phone">
                              <i className="fas fa-bolt"></i> Fast Callback &lt; 30m
                            </span>
                          </div>
                          <p className="channel-desc">
                            Direct telephonic assessment with a Senior CA Partner. Immediate verbal triage for urgent statutory deadlines, notice relief, and fee quotation.
                          </p>
                          <div className="channel-perks-row">
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Fastest Callback Window
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Direct Senior CA Line
                            </span>
                            <span className="channel-perk-item">
                              <i className="fas fa-check"></i> Immediate Verbal Action Plan
                            </span>
                          </div>
                        </div>
                        <div className="channel-radio-indicator">
                          <div className={`custom-radio-circle ${consultationMode === 'phone' ? 'checked' : ''}`}>
                            {consultationMode === 'phone' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="radio-unselected-ring"></span>
                            )}
                          </div>
                          <span className="radio-state-text">
                            {consultationMode === 'phone' ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="consultation-slot-block">
                    <div className="slot-section-header">
                      <div className="slot-header-left">
                        <span className="slot-step-badge">CONSULTATION TIMING</span>
                        <h4 className="slot-header-title">Preferred Time Window (IST)</h4>
                      </div>
                      <div className="slot-schedule-tag">
                        <i className="far fa-clock"></i>
                        <span>Mon &ndash; Sat &bull; 10:30 AM &ndash; 7:00 PM</span>
                      </div>
                    </div>

                    <div className="slot-cards-grid">
                      {/* Morning Session */}
                      <button
                        type="button"
                        className={`slot-card-tile ${preferredSlot === 'morning' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('morning')}
                      >
                        <div className="slot-tile-top">
                          <div className="slot-icon-badge morning">
                            <i className="fas fa-sun"></i>
                          </div>
                          <div className="slot-selection-indicator">
                            {preferredSlot === 'morning' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="slot-unselected-dot"></span>
                            )}
                          </div>
                        </div>

                        <div className="slot-tile-body">
                          <span className="slot-moniker">Morning Briefing</span>
                          <strong className="slot-time-range">10:30 AM &ndash; 1:00 PM</strong>
                          <div className="slot-focus-tag">
                            <span>Notice Scrutiny &amp; Triage</span>
                          </div>
                        </div>
                      </button>

                      {/* Afternoon Session */}
                      <button
                        type="button"
                        className={`slot-card-tile ${preferredSlot === 'afternoon' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('afternoon')}
                      >
                        <div className="slot-tile-top">
                          <div className="slot-icon-badge afternoon">
                            <i className="fas fa-cloud-sun"></i>
                          </div>
                          <div className="slot-selection-indicator">
                            {preferredSlot === 'afternoon' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="slot-unselected-dot"></span>
                            )}
                          </div>
                        </div>

                        <div className="slot-tile-body">
                          <span className="slot-moniker">Core Afternoon</span>
                          <strong className="slot-time-range">2:00 PM &ndash; 5:00 PM</strong>
                          <div className="slot-focus-tag">
                            <span>Corporate &amp; GST Audit</span>
                          </div>
                        </div>
                      </button>

                      {/* Executive Evening */}
                      <button
                        type="button"
                        className={`slot-card-tile ${preferredSlot === 'evening' ? 'active' : ''}`}
                        onClick={() => setPreferredSlot('evening')}
                      >
                        <div className="slot-tile-top">
                          <div className="slot-icon-badge evening">
                            <i className="fas fa-moon"></i>
                          </div>
                          <div className="slot-selection-indicator">
                            {preferredSlot === 'evening' ? (
                              <i className="fas fa-circle-check"></i>
                            ) : (
                              <span className="slot-unselected-dot"></span>
                            )}
                          </div>
                        </div>

                        <div className="slot-tile-body">
                          <span className="slot-moniker">Executive Evening</span>
                          <strong className="slot-time-range">5:00 PM &ndash; 7:00 PM</strong>
                          <div className="slot-focus-tag">
                            <span>Founder &amp; HNI Counsel</span>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="slot-meta-strip">
                      <i className="fas fa-shield-check"></i>
                      <span>30&ndash;45 Min Focused Strategy &bull; Direct Google Calendar / Outlook invite sent immediately upon partner confirmation</span>
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
                    <span className="dot urgent"></span> 🚨 Urgent Notice &lt; 48h
                  </button>
                </div>
              </div>

              {/* Core Contact Inputs */}
              <div className="contact-form-group">
                <label htmlFor="contact-name">Full Name or Firm Name *</label>
                <div className="input-with-icon">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rajeshbhai Patel / Patel Enterprises"
                    className="contact-custom-input with-left-icon"
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="rajesh@enterprises.com"
                      className="contact-custom-input with-left-icon"
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-phone">Phone Number (WhatsApp Preferred)</label>
                  <div className="input-with-prefix">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="contact-custom-input with-prefix-input"
                    />
                  </div>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-service">Primary Area of Interest</label>
                <div className="input-with-icon">
                  <i className="fas fa-briefcase input-icon"></i>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="contact-custom-select with-left-icon"
                  >
                    <option value="">Select a practice area or advisory domain</option>
                    <optgroup label="Direct Taxation &amp; Audit">
                      <option value="Income Tax Return & Direct Tax Advisory">Income Tax Return &amp; Direct Tax Advisory</option>
                      <option value="Tax Audit under Sec 44AB & 44AD">Tax Audit under Sec 44AB &amp; 44AD</option>
                      <option value="Capital Gains & Real Estate Tax Advisory">Capital Gains &amp; Real Estate Tax Advisory</option>
                    </optgroup>
                    <optgroup label="Goods &amp; Services Tax (GST)">
                      <option value="GST Registration & Monthly Compliance">GST Registration &amp; Monthly Compliance</option>
                      <option value="GST Audit & Annual Return (GSTR-9/9C)">GST Audit &amp; Annual Return (GSTR-9/9C)</option>
                      <option value="GST Scrutiny & ASMT-10 Notice Defense">GST Scrutiny &amp; ASMT-10 Notice Defense</option>
                    </optgroup>
                    <optgroup label="Corporate &amp; Startup Services">
                      <option value="Company / LLP Turnkey Incorporation">Company / LLP Turnkey Incorporation</option>
                      <option value="ROC & MCA Annual Statutory Filings">ROC &amp; MCA Annual Statutory Filings</option>
                      <option value="Startup India & Trademark Registration">Startup India &amp; Trademark Registration</option>
                    </optgroup>
                    <optgroup label="Finance &amp; Leadership Retainer">
                      <option value="Complete Accounting & Bookkeeping Retainer">Complete Accounting &amp; Bookkeeping Retainer</option>
                      <option value="Virtual CFO & Financial Leadership">Virtual CFO &amp; Financial Leadership</option>
                    </optgroup>
                    <optgroup label="Statutory Notices &amp; Litigation">
                      <option value="Income Tax Sec 148 / 144 Notice Defense">Income Tax Sec 148 / 144 Notice Defense</option>
                      <option value="High-Stakes Faceless Assessment Defense">High-Stakes Faceless Assessment Defense</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="contact-form-group">
                <div className="textarea-label-row">
                  <label htmlFor="contact-message">Case Details or Business Inquiry *</label>
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
                  <span>
                    <i className="fas fa-circle-notch fa-spin"></i> Dispatching Request...
                  </span>
                ) : (
                  <span>
                    {activeTab === 'consultation' ? 'Schedule 1-on-1 Consultation' : 'Submit Official Inquiry'}{' '}
                    <i className="fas fa-arrow-right"></i>
                  </span>
                )}
              </button>
            </form>

            <div className="contact-form-trust-pills">
              <div className="trust-pill">
                <i className="fas fa-shield-alt"></i>
                <span>Bank-Grade 256-Bit SSL</span>
              </div>
              <div className="trust-pill">
                <i className="fas fa-balance-scale"></i>
                <span>ICAI Professional Privilege</span>
              </div>
              <div className="trust-pill">
                <i className="fas fa-bolt"></i>
                <span>Priority &lt; 30-Min Queue</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
