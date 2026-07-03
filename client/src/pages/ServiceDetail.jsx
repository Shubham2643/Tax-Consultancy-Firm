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

  const handleDocCheck = (doc) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  useEffect(() => {
    if (service?.serviceType === 'tax') {
      const { income, deductions } = taxInput;
      const netIncomeOld = Math.max(0, income - deductions - 75000);
      const netIncomeNew = Math.max(0, income - 75000);

      let taxOld = 0;
      if (netIncomeOld > 1000000) {
        taxOld += (netIncomeOld - 1000000) * 0.3 + 112500;
      } else if (netIncomeOld > 500000) {
        taxOld += (netIncomeOld - 500000) * 0.2 + 12500;
      } else if (netIncomeOld > 250000) {
        taxOld += (netIncomeOld - 250000) * 0.05;
      }
      if (netIncomeOld <= 500000) taxOld = 0;

      let taxNew = 0;
      if (netIncomeNew > 1500000) {
        taxNew += (netIncomeNew - 1500000) * 0.3 + 120000;
      } else if (netIncomeNew > 1200000) {
        taxNew += (netIncomeNew - 1200000) * 0.2 + 60000;
      } else if (netIncomeNew > 1000000) {
        taxNew += (netIncomeNew - 1000000) * 0.15 + 30000;
      } else if (netIncomeNew > 700000) {
        taxNew += (netIncomeNew - 700000) * 0.1 + 15000;
      } else if (netIncomeNew > 300000) {
        taxNew += (netIncomeNew - 300000) * 0.05;
      }
      if (netIncomeNew <= 700000) taxNew = 0;

      setTaxResult({
        oldTax: Math.round(taxOld * 1.04),
        newTax: Math.round(taxNew * 1.04),
        savings: Math.max(0, Math.round(taxOld * 1.04 - taxNew * 1.04)),
      });
    }
  }, [taxInput, service]);

  useEffect(() => {
    if (service?.serviceType === 'startup') {
      const { structure } = startupInput;
      let govFee = 0;
      let profFee = 0;
      const dscFee = 2000;

      if (structure === 'Pvt Ltd') {
        govFee = 1500;
        profFee = 5500;
      } else if (structure === 'LLP') {
        govFee = 1000;
        profFee = 4500;
      } else if (structure === 'OPC') {
        govFee = 1200;
        profFee = 5000;
      } else {
        govFee = 500;
        profFee = 3000;
      }

      setStartupResult({
        govFee,
        profFee,
        dscFee,
        total: govFee + profFee + dscFee,
      });
    }
  }, [startupInput, service]);

  useEffect(() => {
    if (service?.serviceType === 'accounting') {
      const { transactions, invoices } = accountingInput;
      const baseFee = 2500;
      const transactionFee = transactions * 15;
      const invoiceFee = invoices * 10;
      setAccountingResult({ estimatedFee: baseFee + transactionFee + invoiceFee });
    }
  }, [accountingInput, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    const messageText =
      formData.message.trim() ||
      `I would like to register for ${service.title}. Please contact me with the next steps.`;

    const submissionData = {
      ...formData,
      message: messageText,
      service: service.title,
    };

    try {
      await submitContact(submissionData);
      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: err.response?.data?.message || err.message || 'Submission failed. Please try again.',
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
      <div className="detail-hero">
        <div className="container">
          <div className="detail-hero-content">
            <span className="service-type-badge">
              {isRegistration ? 'registration service' : `${service.serviceType} solutions`}
            </span>
            <h1>{service.title}</h1>
            <p className="detail-hero-desc">{service.description}</p>
            <div className="detail-hero-meta">
              <p className="detail-timeline">
                <i className="far fa-clock"></i> Expected Timeline: {service.timeline}
              </p>
              {isRegistration && registrationTotal > 0 && (
                <p className="detail-fee-preview">
                  <i className="fas fa-tag"></i> Starting from ₹{registrationTotal.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-body-grid">
        <div className="detail-main-col">
          <section className="detail-section">
            <h2>Overview</h2>
            <p className="overview-text">{service.detailedOverview || service.description}</p>
          </section>

          {service.keyBenefits?.length > 0 && (
            <section className="detail-section benefits-section">
              <h2>Key Benefits</h2>
              <div className="benefits-grid">
                {service.keyBenefits.map((benefit, idx) => (
                  <div key={idx} className="benefit-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {service.eligibility?.length > 0 && (
            <section className="detail-section eligibility-section">
              <h2>Who Should Apply</h2>
              <ul className="eligibility-list">
                {service.eligibility.map((item, idx) => (
                  <li key={idx}>
                    <i className="fas fa-user-check"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {service.processSteps?.length > 0 && (
            <section className="detail-section process-section">
              <h2>Registration Process</h2>
              <div className="process-timeline">
                {service.processSteps.map((step) => (
                  <div key={step.step} className="process-step">
                    <div className="process-step-number">{step.step}</div>
                    <div className="process-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {docNames.length > 0 && (
            <section className="detail-section doc-checklist-section">
              <h2>Required Document Checklist</h2>
              <p className="section-instruction">
                Tick the documents you have ready to see your submission preparedness:
              </p>

              <div className="checklist-progress-bar-wrapper">
                <div className="progress-label">
                  <span>Preparedness</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <div className="checklist-grid">
                {docNames.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`checklist-item ${checkedDocs[doc] ? 'checked' : ''}`}
                    onClick={() => handleDocCheck(doc)}
                    role="checkbox"
                    aria-checked={checkedDocs[doc]}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDocCheck(doc)}
                  >
                    <div className="checkbox-box">
                      {checkedDocs[doc] && <i className="fas fa-check"></i>}
                    </div>
                    <span className="checkbox-label">{doc}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {service.deliverables?.length > 0 && (
            <section className="detail-section deliverables-section">
              <h2>What You Will Receive</h2>
              <div className="deliverables-list">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="deliverable-item">
                    <i className="fas fa-certificate"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isRegistration && (
            <section className="detail-section calculator-tool-section">
              <h2>Fee Estimator</h2>
              <div className="registration-calc-box">
                <p className="calc-instruction">
                  Transparent pricing breakdown for {service.title}. Select processing speed to see your estimated total.
                </p>
                <div className="calc-inputs-row">
                  <div className="calc-input-group">
                    <label>Processing Speed</label>
                    <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                      <option value="standard">Standard ({service.timeline})</option>
                      <option value="express">Express (Priority — 50% faster)</option>
                    </select>
                  </div>
                </div>
                <div className="calc-results startup-results">
                  <div className="breakdown-item">
                    <span>Government Fees</span>
                    <span>₹{(service.governmentFee || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Professional Service Fee</span>
                    <span>₹{(service.professionalFee || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {urgency === 'express' && (
                    <div className="breakdown-item">
                      <span>Express Processing Surcharge</span>
                      <span>
                        ₹
                        {Math.round(
                          ((service.governmentFee || 0) + (service.professionalFee || 0)) * 0.5
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="breakdown-item total-item">
                    <span>Estimated Total</span>
                    <strong>₹{registrationTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <p className="fee-disclaimer">
                  <i className="fas fa-info-circle"></i> Final fee may vary based on entity type and additional
                  documentation requirements. Contact us for a customized quote.
                </p>
              </div>
            </section>
          )}

          {service.faqs?.length > 0 && (
            <section className="detail-section faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="service-faq-list">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className={`service-faq-item ${openFaq === idx ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="service-faq-question"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      aria-expanded={openFaq === idx}
                    >
                      <span>{faq.question}</span>
                      <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                    </button>
                    {openFaq === idx && <div className="service-faq-answer">{faq.answer}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isRegistration && (
            <section className="detail-section calculator-tool-section">
              <h2>
                {['tax', 'startup'].includes(service.serviceType) || service.slug === 'bookkeeping-services'
                  ? 'Interactive Estimator Tool'
                  : 'Service Pricing Structure'}
              </h2>

              {service.serviceType === 'tax' && taxResult && (
                <div className="tax-calc-box">
                  <h4>Income Tax Slabs Estimator (2026)</h4>
                  <p className="calc-instruction">
                    Enter your annual income and total deductions below to compare tax regimes.
                  </p>
                  <div className="calc-inputs-row">
                    <div className="calc-input-group">
                      <label>Annual Gross Income (₹)</label>
                      <input
                        type="number"
                        value={taxInput.income}
                        onChange={(e) => setTaxInput({ ...taxInput, income: Number(e.target.value) })}
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Total Deductions (Sec 80C, 80D, etc.) (₹)</label>
                      <input
                        type="number"
                        value={taxInput.deductions}
                        onChange={(e) => setTaxInput({ ...taxInput, deductions: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="calc-results">
                    <div className="result-pill">
                      <span>Old Regime Tax (incl. Cess)</span>
                      <strong>₹{taxResult.oldTax.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="result-pill">
                      <span>New Regime Tax (incl. Cess)</span>
                      <strong>₹{taxResult.newTax.toLocaleString('en-IN')}</strong>
                    </div>
                    {taxResult.savings > 0 && (
                      <div className="savings-alert">
                        <i className="fas fa-piggy-bank"></i>
                        <span>You save ₹{taxResult.savings.toLocaleString('en-IN')} under the New Tax Regime!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {service.serviceType === 'startup' && startupResult && (
                <div className="startup-calc-box">
                  <h4>Startup Cost & Compliance Planner</h4>
                  <p className="calc-instruction">Select the desired legal structure for your company.</p>
                  <div className="calc-inputs-row">
                    <div className="calc-input-group">
                      <label>Company / Entity Type</label>
                      <select
                        value={startupInput.structure}
                        onChange={(e) => setStartupInput({ ...startupInput, structure: e.target.value })}
                      >
                        <option value="Pvt Ltd">Private Limited Company</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="OPC">One Person Company (OPC)</option>
                        <option value="Proprietorship">Sole Proprietorship</option>
                      </select>
                    </div>
                  </div>
                  <div className="calc-results startup-results">
                    <div className="breakdown-item">
                      <span>Govt Registration Fee</span>
                      <span>₹{startupResult.govFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Professional Service Fee</span>
                      <span>₹{startupResult.profFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>DSC & PAN Allocations</span>
                      <span>₹{startupResult.dscFee.toLocaleString('en-IN')}</span>
                    </div>
                    <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)' }} />
                    <div className="breakdown-item total-item" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                      <span>Total Estimated Cost</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>
                        ₹{startupResult.total.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {service.serviceType === 'accounting' && service.slug === 'bookkeeping-services' && accountingResult && (
                <div className="accounting-calc-box">
                  <h4>Retainer Quote Calculator</h4>
                  <p className="calc-instruction">
                    Adjust the volumes to estimate your customized bookkeeping monthly retainer.
                  </p>
                  <div className="slider-group">
                    <div className="slider-header">
                      <span>Avg. Monthly Bank Transactions</span>
                      <strong>{accountingInput.transactions}</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={accountingInput.transactions}
                      onChange={(e) =>
                        setAccountingInput({ ...accountingInput, transactions: Number(e.target.value) })
                      }
                      className="calc-range-slider"
                    />
                  </div>
                  <div className="slider-group">
                    <div className="slider-header">
                      <span>Avg. Monthly Purchase/Sales Invoices</span>
                      <strong>{accountingInput.invoices}</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={accountingInput.invoices}
                      onChange={(e) =>
                        setAccountingInput({ ...accountingInput, invoices: Number(e.target.value) })
                      }
                      className="calc-range-slider"
                    />
                  </div>
                  <div className="calc-results text-center">
                    <div className="estimated-fee-card">
                      <span>Estimated Bookkeeping Plan</span>
                      <h2>
                        ₹{accountingResult.estimatedFee.toLocaleString('en-IN')}
                        <span>/month</span>
                      </h2>
                    </div>
                  </div>
                </div>
              )}

              {((service.serviceType === 'accounting' && service.slug !== 'bookkeeping-services') ||
                service.serviceType === 'general' ||
                service.serviceType === 'return') && (
                <div className="registration-calc-box">
                  <h4>Standard Service Fee Breakdown</h4>
                  <p className="calc-instruction">
                    Transparent pricing structure for {service.title}.
                  </p>
                  <div className="calc-results">
                    <div className="breakdown-item">
                      <span>Professional Service Fee</span>
                      <span>₹{(service.professionalFee || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Government / Processing Fee</span>
                      <span>₹{(service.governmentFee || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)' }} />
                    <div className="breakdown-item total-item" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                      <span>Total Service Cost</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>
                        ₹{((service.professionalFee || 0) + (service.governmentFee || 0)).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="detail-sidebar-col">
          <div className="registration-card-wrapper sticky-sidebar">
            <h3>Register For This Service</h3>
            <p>Fill in your details and our experts will begin your {service.title} process.</p>

            {(isRegistration || ((service.serviceType === 'accounting' && service.slug !== 'bookkeeping-services') || service.serviceType === 'general' || service.serviceType === 'return')) && (
              <div className="sidebar-fee-badge">
                <span>Estimated Fee</span>
                <strong>
                  ₹{(isRegistration ? registrationTotal : ((service.professionalFee || 0) + (service.governmentFee || 0))).toLocaleString('en-IN')}
                </strong>
              </div>
            )}

            {formStatus.success && (
              <div className="success-banner">
                <i className="fas fa-check-circle"></i>
                <p>Registration inquiry received! We will connect with you shortly.</p>
              </div>
            )}

            {formStatus.error && (
              <div className="error-banner">
                <i className="fas fa-exclamation-circle"></i>
                <p>{formStatus.error}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="sidebar-form">
              <div className="form-group">
                <label>Service Selected</label>
                <input type="text" value={service.title} disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message / Notes</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  minLength={10}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your business or any specific requirements..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-submit-service" disabled={formStatus.submitting}>
                {formStatus.submitting ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  'Submit Registration Inquiry'
                )}
              </button>
            </form>

            <div className="sidebar-trust-badges">
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>100% Confidential</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-headset"></i>
                <span>Expert Support</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-bolt"></i>
                <span>Fast Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
