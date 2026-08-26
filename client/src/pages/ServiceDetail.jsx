import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, submitContact } from '../api';
import '../components/ContactForm.css';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const [checkedDocs, setCheckedDocs] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [urgency, setUrgency] = useState('standard');

  const [taxInput, setTaxInput] = useState({ income: 800000, deductions: 150000 });
  const [taxResult, setTaxResult] = useState(null);

  const [startupInput, setStartupInput] = useState({ structure: 'Pvt Ltd', state: 'Gujarat' });
  const [startupResult, setStartupResult] = useState(null);

  const [accountingInput, setAccountingInput] = useState({ transactions: 50, invoices: 20 });
  const [accountingResult, setAccountingResult] = useState(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getServiceById(id);
        if (res.success && res.data) {
          setService(res.data);
          const initialChecked = {};
          (res.data.documentsRequired || []).forEach((doc) => {
            initialChecked[doc] = false;
          });
          setCheckedDocs(initialChecked);
          setOpenFaq(null);
          setUrgency('standard');
        } else {
          setError('Service not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  // Tax Calculator logic
  useEffect(() => {
    if (service?.serviceType === 'tax') {
      const taxableOld = Math.max(0, taxInput.income - taxInput.deductions - 50000);
      let oldTax = 0;
      if (taxableOld > 1000000) oldTax = 112500 + (taxableOld - 1000000) * 0.3;
      else if (taxableOld > 500000) oldTax = 12500 + (taxableOld - 500000) * 0.2;
      else if (taxableOld > 250000) oldTax = (taxableOld - 250000) * 0.05;

      const taxableNew = Math.max(0, taxInput.income - 75000);
      let newTax = 0;
      if (taxableNew > 1500000) newTax = 150000 + (taxableNew - 1500000) * 0.3;
      else if (taxableNew > 1200000) newTax = 90000 + (taxableNew - 1200000) * 0.2;
      else if (taxableNew > 1000000) newTax = 60000 + (taxableNew - 1000000) * 0.15;
      else if (taxableNew > 700000) newTax = 30000 + (taxableNew - 700000) * 0.1;
      else if (taxableNew > 300000) newTax = (taxableNew - 300000) * 0.05;

      setTaxResult({
        oldRegimeTax: Math.round(oldTax * 1.04),
        newRegimeTax: Math.round(newTax * 1.04),
        recommended: oldTax < newTax ? 'Old Regime' : 'New Regime',
        savings: Math.abs(Math.round((oldTax - newTax) * 1.04)),
      });
    }
  }, [taxInput, service]);

  // Startup Fee Calculator logic
  useEffect(() => {
    if (service?.serviceType === 'startup') {
      const baseGov =
        startupInput.structure === 'Pvt Ltd'
          ? 2000
          : startupInput.structure === 'LLP'
          ? 1500
          : startupInput.structure === 'OPC'
          ? 1000
          : 0;
      const stampDuty = startupInput.state === 'Maharashtra' ? 1000 : 500;
      const profFee =
        startupInput.structure === 'Pvt Ltd'
          ? 4999
          : startupInput.structure === 'LLP'
          ? 3999
          : startupInput.structure === 'OPC'
          ? 3499
          : 1999;
      const total = baseGov + stampDuty + profFee;
      setStartupResult({ baseGov, stampDuty, profFee, total });
    }
  }, [startupInput, service]);

  // Accounting Package Calculator logic
  useEffect(() => {
    if (service?.serviceType === 'accounting' || service?.slug === 'bookkeeping-services') {
      let fee = 2999;
      if (accountingInput.transactions > 200 || accountingInput.invoices > 100) fee = 9999;
      else if (accountingInput.transactions > 100 || accountingInput.invoices > 50) fee = 5999;
      setAccountingResult({ estimatedFee: fee });
    }
  }, [accountingInput, service]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocCheck = (docName) => {
    setCheckedDocs((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });
    try {
      await submitContact({
        ...formData,
        subject: `Service Inquiry: ${service?.title || 'General'}`,
        serviceInterest: service?.title,
      });
      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: err.message || 'Failed to submit inquiry. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="service-detail-page container py-5">
        <div className="skeleton skeleton-title" style={{ width: '40%', height: '40px', margin: '0 auto 40px' }}></div>
        <div className="skeleton skeleton-card" style={{ height: '450px' }}></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-page container py-5 text-center">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
          <h2>Service Details Not Available</h2>
          <p>{error || 'The requested service could not be loaded.'}</p>
          <button className="btn btn-cta" onClick={() => navigate('/services')} style={{ marginTop: '20px' }}>
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const docNames = Object.keys(checkedDocs);
  const checkedCount = docNames.filter((doc) => checkedDocs[doc]).length;
  const progressPercent = docNames.length > 0 ? Math.round((checkedCount / docNames.length) * 100) : 0;

  const isRegistration = service.serviceType === 'registration';
  const urgencyMultiplier = urgency === 'express' ? 1.5 : 1;
  const registrationTotal = Math.round(
    ((service.governmentFee || 0) + (service.professionalFee || 0)) * urgencyMultiplier
  );

  return (
    <div className="service-detail-page fade-in">
      {/* Executive Hero Banner */}
      <div className="detail-hero">
        <div className="container">
          <div className="detail-hero-content">
            <span className="service-type-badge">
              <span className="live-dot"></span>
              <i className="fas fa-briefcase"></i>
              <span>{isRegistration ? 'Registration Service' : `${service.serviceType} Solutions`}</span>
            </span>
            <h1>{service.title}</h1>
            <p className="detail-hero-desc">{service.description}</p>
            <div className="detail-hero-meta">
              <span className="detail-timeline">
                <i className="far fa-clock"></i> Expected Timeline: {service.timeline}
              </span>
              {isRegistration && registrationTotal > 0 && (
                <span className="detail-fee-preview">
                  <i className="fas fa-tag"></i> Starting from ₹{registrationTotal.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical 50/50 Two-Column Layout */}
      <div className="container detail-equal-two-col-grid">
        {/* ========================================================
            COLUMN 1 (50%): Overview, Benefits, Process & Deliverables
            ======================================================== */}
        <div className="detail-col-half detail-content-side">
          {/* 1. Executive Overview */}
          <section className="detail-bento-card">
            <div className="detail-card-header">
              <div className="card-header-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="card-header-text">
                <span className="card-kicker">EXECUTIVE SUMMARY</span>
                <h2>Service Overview</h2>
              </div>
            </div>
            <div className="detail-card-body">
              <p className="overview-text">{service.detailedOverview || service.description}</p>
            </div>
          </section>

          {/* 2. Key Benefits */}
          {service.keyBenefits?.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">KEY ADVANTAGES</span>
                  <h2>Core Benefits</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="benefits-equal-grid">
                  {service.keyBenefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-pill-item">
                      <div className="benefit-check-icon">
                        <i className="fas fa-check"></i>
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 3. Step-by-Step Process */}
          {service.processSteps?.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-stream"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">WORKFLOW</span>
                  <h2>Execution Process</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="process-timeline-v2">
                  {service.processSteps.map((step) => (
                    <div key={step.step} className="process-v2-item">
                      <div className="process-v2-badge">{step.step}</div>
                      <div className="process-v2-content">
                        <h4>{step.title}</h4>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 4. Eligibility & Scope */}
          {service.eligibility?.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">CRITERIA</span>
                  <h2>Who Should Apply</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <ul className="eligibility-v2-list">
                  {service.eligibility.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-arrow-circle-right"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 5. Deliverables */}
          {service.deliverables?.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">DELIVERABLES</span>
                  <h2>What You Will Receive</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="deliverables-equal-grid">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="deliverable-card-item">
                      <i className="fas fa-file-signature deliverable-gold-icon"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ========================================================
            COLUMN 2 (50%): Form, Fee Estimator, Document Checklist & FAQs
            ======================================================== */}
        <div className="detail-col-half detail-interactive-side">
          {/* 1. Dedicated Registration / Consultation Form */}
          <div className="detail-bento-card form-bento-card">
            <div className="detail-card-header form-card-header">
              <div className="card-header-icon">
                <i className="fas fa-paper-plane"></i>
              </div>
              <div className="card-header-text">
                <span className="card-kicker">FAST-TRACK ONBOARDING</span>
                <h2>Register For This Service</h2>
              </div>
            </div>

            <div className="detail-card-body">
              <p className="form-intro-text">
                Fill in your details below. Our senior Chartered Accountants will review your requirements and begin your {service.title} process.
              </p>

              {(isRegistration ||
                ((service.serviceType === 'accounting' && service.slug !== 'bookkeeping-services') ||
                  service.serviceType === 'general' ||
                  service.serviceType === 'return')) && (
                <div className="sidebar-fee-badge-v2">
                  <span className="fee-badge-label">Estimated Service Fee</span>
                  <strong className="fee-badge-amount">
                    ₹
                    {(isRegistration
                      ? registrationTotal
                      : (service.professionalFee || 0) + (service.governmentFee || 0)
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              )}

              {formStatus.success && (
                <div className="success-banner-v2">
                  <i className="fas fa-check-circle"></i>
                  <p>Inquiry received successfully! Our CA team will connect with you shortly.</p>
                </div>
              )}

              {formStatus.error && (
                <div className="error-banner-v2">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{formStatus.error}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="v2-registration-form">
                <div className="v2-form-group">
                  <label>Selected Practice Area</label>
                  <input type="text" value={service.title} disabled className="v2-disabled-input" />
                </div>

                <div className="v2-form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="v2-input"
                  />
                </div>

                <div className="v2-form-row">
                  <div className="v2-form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@company.com"
                      className="v2-input"
                    />
                  </div>

                  <div className="v2-form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[+]?[\d\s-]{10,15}"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="v2-input"
                    />
                  </div>
                </div>

                <div className="v2-form-group">
                  <label htmlFor="message">Business Notes / Queries</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    minLength={10}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your business or specific filing deadline..."
                    className="v2-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-v2-submit" disabled={formStatus.submitting}>
                  {formStatus.submitting ? (
                    <span><i className="fas fa-spinner fa-spin"></i> Submitting...</span>
                  ) : (
                    <span>Submit Registration Inquiry <i className="fas fa-arrow-right"></i></span>
                  )}
                </button>
              </form>

              <div className="form-trust-badges-v2">
                <div className="trust-v2-item">
                  <i className="fas fa-lock"></i>
                  <span>100% Confidential</span>
                </div>
                <div className="trust-v2-item">
                  <i className="fas fa-user-shield"></i>
                  <span>ICAI Compliant</span>
                </div>
                <div className="trust-v2-item">
                  <i className="fas fa-bolt"></i>
                  <span>Fast Turnaround</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Interactive Fee Estimator */}
          {isRegistration && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">PRICING TRANSPARENCY</span>
                  <h2>Fee &amp; Timeline Estimator</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <p className="calc-instruction-v2">
                  Transparent statutory fee breakdown for {service.title}.
                </p>
                <div className="v2-calc-inputs">
                  <label className="v2-select-label">Select Processing Priority</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="v2-calc-select"
                  >
                    <option value="standard">Standard Processing ({service.timeline})</option>
                    <option value="express">Express Priority Processing (50% Faster)</option>
                  </select>
                </div>

                <div className="v2-fee-breakdown-box">
                  <div className="breakdown-row">
                    <span>Government Portal Fees</span>
                    <strong>₹{(service.governmentFee || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Professional CA Service Fee</span>
                    <strong>₹{(service.professionalFee || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  {urgency === 'express' && (
                    <div className="breakdown-row">
                      <span>Express Priority Surcharge</span>
                      <strong>
                        ₹
                        {Math.round(
                          ((service.governmentFee || 0) + (service.professionalFee || 0)) * 0.5
                        ).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row total-row">
                    <span>Estimated Total Cost</span>
                    <strong className="total-gold-amount">₹{registrationTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tax Slab Estimator if applicable */}
          {!isRegistration && service.serviceType === 'tax' && taxResult && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">INTERACTIVE TOOL</span>
                  <h2>Tax Slabs Estimator</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="v2-form-row">
                  <div className="v2-form-group">
                    <label>Annual Gross Income (₹)</label>
                    <input
                      type="number"
                      value={taxInput.income}
                      onChange={(e) => setTaxInput({ ...taxInput, income: Number(e.target.value) })}
                      className="v2-input"
                    />
                  </div>
                  <div className="v2-form-group">
                    <label>Total Deductions (80C, 80D) (₹)</label>
                    <input
                      type="number"
                      value={taxInput.deductions}
                      onChange={(e) => setTaxInput({ ...taxInput, deductions: Number(e.target.value) })}
                      className="v2-input"
                    />
                  </div>
                </div>
                <div className="v2-fee-breakdown-box">
                  <div className="breakdown-row">
                    <span>Old Tax Regime</span>
                    <strong>₹{taxResult.oldRegimeTax.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>New Tax Regime</span>
                    <strong>₹{taxResult.newRegimeTax.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row total-row">
                    <span>Recommended Regime</span>
                    <strong className="total-gold-amount">{taxResult.recommended}</strong>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. Document Preparedness Checklist */}
          {docNames.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">PREPAREDNESS CHECK</span>
                  <h2>Required Documents</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="v2-progress-box">
                  <div className="v2-progress-labels">
                    <span>Document Readiness</span>
                    <strong>{progressPercent}% Prepared</strong>
                  </div>
                  <div className="v2-progress-track">
                    <div className="v2-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="v2-checklist-grid">
                  {docNames.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`v2-check-pill ${checkedDocs[doc] ? 'checked' : ''}`}
                      onClick={() => handleDocCheck(doc)}
                      role="checkbox"
                      aria-checked={checkedDocs[doc]}
                    >
                      <div className="v2-custom-checkbox">
                        {checkedDocs[doc] && <i className="fas fa-check"></i>}
                      </div>
                      <span className="v2-checkbox-title">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 4. Frequently Asked Questions */}
          {service.faqs?.length > 0 && (
            <section className="detail-bento-card">
              <div className="detail-card-header">
                <div className="card-header-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="card-header-text">
                  <span className="card-kicker">KNOWLEDGE BASE</span>
                  <h2>Frequently Asked Questions</h2>
                </div>
              </div>
              <div className="detail-card-body">
                <div className="v2-faq-stack">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className={`v2-faq-item ${openFaq === idx ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="v2-faq-question-btn"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        aria-expanded={openFaq === idx}
                      >
                        <span>{faq.question}</span>
                        <div className="v2-faq-icon">
                          <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                        </div>
                      </button>
                      {openFaq === idx && <div className="v2-faq-answer-box">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
