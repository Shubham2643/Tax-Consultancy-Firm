import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { submitContact } from '../api';
import './Pricing.css';

const RETAINER_PLANS = [
  {
    id: 'starter',
    name: 'Starter Compliance',
    target: 'Sole Proprietors & Freelancers',
    priceMonthly: 2999,
    priceAnnual: 2499,
    badge: 'STARTER TIER',
    roiBadge: '⏱️ Saves 12+ Hours Monthly',
    icon: 'fas fa-seedling',
    summary: 'Essential cloud bookkeeping, monthly GST filings, and advance tax forecasting for micro-enterprises.',
    highlights: [
      'Up to 50 transactions/mo with automated bank rec',
      'GSTR-1 & GSTR-3B filed before statutory deadlines',
      'Quarterly Advance Tax calculation (Sec 208/211)',
      'Year-End Financials drafting (P&L and Balance Sheet)',
      'Direct Client Vault terminal with 256-bit encryption',
      'Guaranteed 24-Hour query response SLA',
    ],
    deliverables: {
      invoices: 'Up to 50 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B)',
      itcMatching: 'Basic GSTR-2B Overview',
      tdsReturns: 'Optional Add-on',
      noticeDefense: 'Standard Notice Advisory',
      partnerAccess: 'Email & Scheduled Calls',
    },
    ctaText: 'Choose Starter Retainer',
    serviceInterest: 'Starter Compliance Retainer (₹2,499/mo)',
  },
  {
    id: 'growth',
    name: 'Growth & GST Retainer',
    target: 'Growing MSMEs & Active Traders',
    priceMonthly: 5999,
    priceAnnual: 4999,
    isPopular: true,
    badge: 'MOST POPULAR • BEST ROI',
    roiBadge: '💰 Recovers ~₹1.2L+ Blocked ITC',
    icon: 'fas fa-rocket',
    summary: 'Complete accounting outsourcing, algorithmic GSTR-2B input tax matching, quarterly TDS returns, and direct partner access.',
    highlights: [
      'Up to 150 transactions/mo with real-time ledger curation',
      'Automated GSTR-2B vendor reconciliation to eliminate credit leaks',
      'Quarterly TDS Returns (Form 24Q & 26Q) + Form 16 issuance',
      '26AS & AIS tax credit cross-verification before portal filing',
      'Priority WhatsApp desk with designated Senior Chartered Accountant',
      'Full ASMT-10 & Section 143(1) scrutiny notice rejoinder drafting',
    ],
    deliverables: {
      invoices: 'Up to 150 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B) + IFF',
      itcMatching: 'Deep Algorithmic Matching',
      tdsReturns: 'Quarterly (24Q & 26Q Included)',
      noticeDefense: 'ASMT-10 & DRC-01 Covered',
      partnerAccess: 'Priority WhatsApp & Direct Phone',
    },
    ctaText: 'Choose Growth Retainer',
    serviceInterest: 'Growth & GST Retainer (₹4,999/mo)',
  },
  {
    id: 'cfo',
    name: 'Virtual CFO Advisory',
    target: 'Pvt Ltd Companies & High-Turnover LLPs',
    priceMonthly: 24999,
    priceAnnual: 20999,
    badge: 'ENTERPRISE RETAINER',
    roiBadge: '📊 100% Tax Audit Defense Coverage',
    icon: 'fas fa-crown',
    summary: 'Turnkey executive financial leadership, corporate tax return (ITR-6), complete Section 44AB tax audit defense, and ROC secretarial governance.',
    highlights: [
      'Uncapped transaction accounting with multi-branch consolidations',
      'Monthly Executive MIS dashboard, cashflow forecasting & unit economics',
      'Corporate ITR-6 / 5 direct tax filing with 44AB Tax Audit report',
      'Statutory notice representation before ITAT & GST Revisional officers',
      'Annual MCA Governance: AOC-4, MGT-7 & Director DIR-3 KYC',
      'Senior Partner co-signature and dedicated private consultation suite',
    ],
    deliverables: {
      invoices: 'Unlimited Enterprise Invoices',
      gstFilings: 'Multi-State GST Consolidation',
      itcMatching: 'Forensic Vendor Recovery',
      tdsReturns: 'All Forms + Upper Threshold Audits',
      noticeDefense: 'Appellate Litigation & ITAT Benches',
      partnerAccess: 'Dedicated Senior Partner Assigned',
    },
    ctaText: 'Hire Virtual CFO Desk',
    serviceInterest: 'Virtual CFO Enterprise Retainer (₹20,999/mo)',
  },
  {
    id: 'incorporation',
    name: 'Turnkey Incorporation',
    target: 'New Startups & Expanding Ventures',
    priceMonthly: 49999,
    priceAnnual: 49999,
    isOneTime: true,
    badge: 'ONE-TIME SETUP',
    roiBadge: '⚡ Turnkey Setup in 5–7 Business Days',
    icon: 'fas fa-landmark',
    summary: 'Complete legal company incorporation, DIN/DSC allotments, MoA/AoA drafting, DPIIT 80-IAC tax exemption filing, and 1st month complimentary advisory.',
    highlights: [
      'MCA SPICe+ filing covering name approval, stamp duty & certificate of incorporation',
      '2 Director Identification Numbers (DINs) & Class-3 DSC USB cryptotokens',
      'PAN, TAN, corporate current bank account opening facilitation',
      'DPIIT Startup India certificate for Section 80-IAC 3-year tax holiday',
      'GSTIN registration & Gujarat Professional Tax employer setup included',
      'Complimentary 30-day post-incorporation compliance audit by senior CA',
    ],
    deliverables: {
      invoices: 'Setup Phase Included',
      gstFilings: 'GSTIN Registration Included',
      itcMatching: 'N/A (New Entity)',
      tdsReturns: 'TAN Allotment Included',
      noticeDefense: 'Zero Defect Guarantee',
      partnerAccess: 'Founder Structuring Strategy Call',
    },
    ctaText: 'Incorporate Your Company',
    serviceInterest: 'Turnkey Company Incorporation (₹49,999)',
  },
];

const PRICING_FAQS = [
  {
    q: 'Are government statutory fees included in your retainer packages?',
    a: 'We practice 100% billing transparency. In our retainer packages, government portal fees (such as MCA filing fees or actual GST cash taxes) are billed at actual statutory challan value, while our professional advisory fees are scope-locked without arbitrary markups.',
  },
  {
    q: 'Can we switch or upgrade retainers as our transaction volume grows?',
    a: 'Yes, seamlessly. Many Ahmedabad startups begin on our Starter tier and upgrade to Growth or Virtual CFO as monthly transaction volume and vendor count increase. Retainer adjustments are pro-rated without onboarding friction.',
  },
  {
    q: 'What is included in the Statutory Notice Defense coverage?',
    a: 'Clients on our Growth and Virtual CFO retainers receive routine department notice defense included. When an automated scrutiny inquiry or ASMT-10 mismatch notice is issued, our senior CAs draft the legal rejoinder and cross-reconcile purchase ledgers at no additional emergency surcharge.',
  },
  {
    q: 'How does the Virtual CFO retainer compare to hiring a full-time CFO?',
    a: 'A full-time seasoned CFO commands ₹25L–₹40L+ annually plus equity and benefits. Our Virtual CFO desk delivers institutional partner-level financial leadership, cashflow modeling, and tax audits for a predictable fraction of the cost.',
  },
  {
    q: 'Is there a long-term lock-in contract?',
    a: 'No. Monthly retainers can be paused or cancelled with a 30-day notice. Annual retainer agreements are locked for the financial year to ensure unbroken statutory filing continuity and include up to a 20% discount.',
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  // Custom Quote Request Modal / Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    planInterest: 'Growth & GST Retainer',
    monthlyInvoices: '50-150',
    notes: '',
  });
  const [quoteStatus, setQuoteStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Corporate Retainers & Pricing Plans | Shree Chamunda Associates',
    description: 'Predictable, scope-locked Chartered Accountancy retainer packages: Starter Bookkeeping, Growth GST Retainer, Virtual CFO, and Startup Incorporation.',
  });

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteStatus({ loading: true, success: false, error: null });
    try {
      await submitContact({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        subject: `Corporate Retainer Quote Request: ${quoteForm.planInterest} (${quoteForm.company})`,
        message: `Company: ${quoteForm.company}\nPlan: ${quoteForm.planInterest}\nEstimated Monthly Invoices: ${quoteForm.monthlyInvoices}\nSpecific Requirements: ${quoteForm.notes}`,
        serviceInterest: quoteForm.planInterest,
      });
      setQuoteStatus({ loading: false, success: true, error: null });
      setQuoteForm({ name: '', email: '', phone: '', company: '', planInterest: 'Growth & GST Retainer', monthlyInvoices: '50-150', notes: '' });
    } catch (err) {
      setQuoteStatus({ loading: false, success: false, error: err.message || 'Failed to submit quote request. Please call our CA desk directly.' });
    }
  };

  return (
    <div className="pricing-page fade-in">
      {/* 1. HERO BANNER */}
      <section className="pricing-hero" aria-labelledby="pricing-hero-title">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="pricing-hero-glow glow-gold" aria-hidden="true"></div>
        <div className="pricing-hero-glow glow-blue" aria-hidden="true"></div>

        <div className="container">
          <div className="pricing-hero-badge">
            <span className="live-dot pulse"></span>
            <i className="fas fa-handshake"></i>
            <span>SCOPE-LOCKED RETAINERS &bull; ZERO SURPRISE BILLING</span>
          </div>

          <h1 id="pricing-hero-title">
            Predictable Retainers for <span className="hero-gradient-text">Institutional Peace of Mind</span>
          </h1>

          <p className="pricing-hero-lead">
            Partner with dedicated Chartered Accountants under transparent, scope-locked retainer agreements.
            Full direct tax, GST audit, ROC secretarial, and Virtual CFO coverage designed for ambitious Indian enterprises.
          </p>

          {/* Billing Frequency Switcher */}
          <div className="billing-switch-wrapper">
            <div className="billing-switch-pill" role="radiogroup" aria-label="Billing Frequency">
              <button
                type="button"
                className={`switch-btn ${!isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly Retainer
              </button>

              <button
                type="button"
                className={`switch-btn ${isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(true)}
              >
                Annual Commitment
                <span className="save-badge">Save up to 20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRICING CARDS GRID */}
      <main className="container pricing-cards-container">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="pricing-cards-grid">
          {RETAINER_PLANS.map((plan) => {
            const currentPrice = plan.isOneTime
              ? plan.priceAnnual
              : isAnnual
              ? plan.priceAnnual
              : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`pricing-plan-card ${plan.isPopular ? 'popular-card' : ''}`}
              >
                {plan.isPopular && (
                  <div className="popular-ribbon-tag">
                    <i className="fas fa-crown"></i> {plan.badge}
                  </div>
                )}

                <div className="plan-card-header">
                  <div className="plan-icon-box">
                    <i className={plan.icon}></i>
                  </div>
                  <div>
                    <span className="plan-kicker">{plan.target}</span>
                    <h3 className="plan-name">{plan.name}</h3>
                  </div>
                </div>

                <div className="plan-price-block">
                  <div className="price-num-row">
                    <span className="currency-symbol">₹</span>
                    <span className="price-amount">{currentPrice.toLocaleString('en-IN')}</span>
                    <span className="price-period">{plan.isOneTime ? '/ one-time' : '/ month'}</span>
                  </div>
                  {isAnnual && !plan.isOneTime && (
                    <span className="billed-annually-tag">Billed annually (₹{(currentPrice * 12).toLocaleString('en-IN')}/yr)</span>
                  )}
                  <span className="plan-roi-chip">{plan.roiBadge}</span>
                </div>

                <p className="plan-summary-text">{plan.summary}</p>

                <div className="plan-highlights-stack">
                  <span className="highlights-title">What is Included:</span>
                  {plan.highlights.map((item, idx) => (
                    <div key={idx} className="plan-highlight-item">
                      <i className="fas fa-check-circle text-emerald"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="plan-card-action">
                  <button
                    type="button"
                    className={`btn-plan-cta ${plan.isPopular ? 'btn-popular' : ''}`}
                    onClick={() => {
                      setQuoteForm((prev) => ({ ...prev, planInterest: plan.name }));
                      const elem = document.getElementById('custom-quote-section');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>{plan.ctaText}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. COMPREHENSIVE DELIVERABLES MATRIX */}
      <section className="container pricing-matrix-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-table-list"></i>
            <span>GRANULAR SCOPE COMPARISON</span>
          </span>
          <h2>Side-by-Side Scope Matrix</h2>
          <p className="section-subtext">Compare exact operational deliverables across all four retainer tiers.</p>
        </div>

        <div className="matrix-table-wrapper">
          <table className="scope-comparison-table">
            <thead>
              <tr>
                <th className="col-deliverable">Statutory Deliverable</th>
                <th>Starter Tier</th>
                <th className="th-popular">Growth Retainer</th>
                <th>Virtual CFO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Bookkeeping &amp; Vouchers</strong></td>
                <td>Up to 50 / Month</td>
                <td className="td-popular"><strong>Up to 150 / Month</strong></td>
                <td><strong>Unlimited Enterprise</strong></td>
              </tr>
              <tr>
                <td><strong>GST Filings (GSTR-1 &amp; 3B)</strong></td>
                <td>Standard Monthly</td>
                <td className="td-popular"><strong>Monthly + IFF Included</strong></td>
                <td><strong>Multi-State Consolidated</strong></td>
              </tr>
              <tr>
                <td><strong>GSTR-2B ITC Matching</strong></td>
                <td>Basic Overview</td>
                <td className="td-popular"><strong>Deep Algorithmic ITC Matching</strong></td>
                <td><strong>Forensic Vendor Recovery</strong></td>
              </tr>
              <tr>
                <td><strong>Quarterly TDS Returns (24Q/26Q)</strong></td>
                <td>Optional Add-on</td>
                <td className="td-popular"><strong>Quarterly Included (Form 16)</strong></td>
                <td><strong>All Forms &amp; Upper Limits</strong></td>
              </tr>
              <tr>
                <td><strong>Notice Resolution &amp; Scrutiny</strong></td>
                <td>Advisory Guidance</td>
                <td className="td-popular"><strong>ASMT-10 &amp; DRC-01 Replies</strong></td>
                <td><strong>CIT(A) &amp; ITAT Representation</strong></td>
              </tr>
              <tr>
                <td><strong>Senior CA Partner SLA</strong></td>
                <td>&lt; 24h Response</td>
                <td className="td-popular"><strong>Priority WhatsApp Desk (&lt; 4h)</strong></td>
                <td><strong>Dedicated Partner Assigned</strong></td>
              </tr>
              <tr>
                <td><strong>256-Bit Digital Vault Terminals</strong></td>
                <td>Standard Access</td>
                <td className="td-popular"><strong>Multi-User Enterprise</strong></td>
                <td><strong>24/7 Dedicated Archival</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. CUSTOM ENTERPRISE QUOTE REQUEST SECTION */}
      <section className="container quote-request-section" id="custom-quote-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="quote-box-grid">
          <div className="quote-narrative-col">
            <span className="about-eyebrow-tag">
              <i className="fas fa-file-signature"></i>
              <span>CUSTOM ENTERPRISE QUOTE</span>
            </span>
            <h2>Need a Tailored Manufacturing or Corporate Retainer?</h2>
            <p>
              For factories, chemical manufacturing units, export houses, and high-volume e-commerce sellers across Gujarat, our senior partners prepare a scoped engagement letter aligned with your ERP and volume.
            </p>

            <div className="quote-trust-checks">
              <div className="trust-check-item">
                <i className="fas fa-check text-emerald"></i>
                <span>Direct consultation with designated Senior Partner</span>
              </div>
              <div className="trust-check-item">
                <i className="fas fa-check text-emerald"></i>
                <span>Mutual Non-Disclosure Agreement (NDA) signed prior to books inspection</span>
              </div>
              <div className="trust-check-item">
                <i className="fas fa-check text-emerald"></i>
                <span>Upfront fixed retainer with zero hidden portal surcharge fees</span>
              </div>
            </div>

            <div className="quote-contact-direct">
              <i className="fas fa-phone-volume text-gold"></i>
              <div>
                <span>Prefer speaking over phone right now?</span>
                <strong><a href="tel:+919510984735">+91 95109 84735</a></strong>
              </div>
            </div>
          </div>

          <div className="quote-form-col">
            <div className="quote-form-card">
              <h3>Request Scope-Locked Retainer Quote</h3>
              <p className="form-subtext">Our senior CA will review your volume and respond within 4 business hours.</p>

              {quoteStatus.success && (
                <div className="success-quote-banner">
                  <i className="fas fa-check-circle"></i>
                  <p>Quote request received! Our Senior Partner will connect with your firm shortly.</p>
                </div>
              )}

              {quoteStatus.error && (
                <div className="error-quote-banner">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{quoteStatus.error}</p>
                </div>
              )}

              <form onSubmit={handleQuoteSubmit} className="quote-form">
                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qName">Full Name *</label>
                    <input
                      type="text"
                      id="qName"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="e.g. Aniket Patel"
                      className="quote-input"
                    />
                  </div>
                  <div className="quote-input-group">
                    <label htmlFor="qCompany">Company / LLP Name *</label>
                    <input
                      type="text"
                      id="qCompany"
                      required
                      value={quoteForm.company}
                      onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                      placeholder="e.g. Apex Industrial Solutions"
                      className="quote-input"
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qEmail">Email Address *</label>
                    <input
                      type="email"
                      id="qEmail"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="aniket@company.com"
                      className="quote-input"
                    />
                  </div>
                  <div className="quote-input-group">
                    <label htmlFor="qPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="qPhone"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="quote-input"
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qPlan">Preferred Practice Tier</label>
                    <select
                      id="qPlan"
                      value={quoteForm.planInterest}
                      onChange={(e) => setQuoteForm({ ...quoteForm, planInterest: e.target.value })}
                      className="quote-select"
                    >
                      <option value="Starter Compliance">Starter Compliance (₹2,499/mo)</option>
                      <option value="Growth & GST Retainer">Growth &amp; GST Retainer (₹4,999/mo)</option>
                      <option value="Virtual CFO Advisory">Virtual CFO Advisory (₹20,999/mo)</option>
                      <option value="Turnkey Incorporation">Turnkey Incorporation (₹49,999)</option>
                      <option value="Custom Multi-Branch Retainer">Custom Multi-Branch Corporate Retainer</option>
                    </select>
                  </div>

                  <div className="quote-input-group">
                    <label htmlFor="qVol">Est. Monthly Invoices</label>
                    <select
                      id="qVol"
                      value={quoteForm.monthlyInvoices}
                      onChange={(e) => setQuoteForm({ ...quoteForm, monthlyInvoices: e.target.value })}
                      className="quote-select"
                    >
                      <option value="< 50">Under 50 Invoices / Month</option>
                      <option value="50-150">50 to 150 Invoices / Month</option>
                      <option value="150-500">150 to 500 Invoices / Month</option>
                      <option value="500+">500+ High Volume Transactions</option>
                    </select>
                  </div>
                </div>

                <div className="quote-input-group">
                  <label htmlFor="qNotes">Specific Compliance Requirements / Accounting Software</label>
                  <textarea
                    id="qNotes"
                    rows="3"
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="e.g. Using Tally Prime, have 2 GSTINs in Gujarat and Maharashtra, need ASMT-10 notice assistance..."
                    className="quote-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-quote" disabled={quoteStatus.loading}>
                  {quoteStatus.loading ? (
                    <span><i className="fas fa-spinner fa-spin"></i> Dispatching Request...</span>
                  ) : (
                    <span>Request Retainer Proposal <i className="fas fa-arrow-right"></i></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING FAQS */}
      <section className="container pricing-faqs-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-circle-question"></i>
            <span>BILLING TRANSPARENCY &bull; FAQS</span>
          </span>
          <h2>Frequently Asked Questions on Retainers</h2>
          <p className="section-subtext">Clear, definitive policies regarding fee structures, government challans, and scope assurance.</p>
        </div>

        <div className="pricing-faqs-list">
          {PRICING_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-card-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                </button>
                {isOpen && (
                  <div className="faq-answer-pane fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
