import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPricing } from '../api';
import useFetch from '../hooks/useFetch';
import './PricingSection.css';

const DETAILED_PLANS = {
  'basic plan': {
    id: 'basic',
    name: 'Starter Compliance',
    target: 'Sole Proprietors & Freelancers',
    price: 2999,
    annualPrice: 2499,
    period: 'month',
    isPopular: false,
    badge: 'STARTER TIER',
    roiBadge: '⏱️ Saves 10+ Hours/Mo',
    icon: 'fas fa-seedling',
    summary: 'Essential bookkeeping, monthly GST filings, and quarterly advance tax calculations for micro-enterprises.',
    deliverables: [
      { title: 'Monthly Bookkeeping', desc: 'Up to 50 transactions with automated bank reconciliation', icon: 'fas fa-book' },
      { title: 'GST Returns (GSTR-1 & 3B)', desc: 'Error-free monthly filing before statutory 11th & 20th due dates', icon: 'fas fa-file-invoice-dollar' },
      { title: 'Quarterly Advance Tax', desc: 'Section 234B/C interest mitigation forecasting & challan creation', icon: 'fas fa-calculator' },
      { title: 'Year-End Financials', desc: 'P&L and Balance Sheet drafting ready for statutory ITR filing', icon: 'fas fa-balance-scale' },
      { title: 'Standard Support Desk', desc: 'Client portal access & guaranteed email query resolution within 24h', icon: 'fas fa-envelope' },
      { title: 'Zero Penalty Assurance', desc: 'Firm-backed timely filing guarantee against statutory late fees', icon: 'fas fa-shield-alt' },
    ],
    ctaText: 'Choose Starter Retainer',
  },
  'standard plan': {
    id: 'standard',
    name: 'Growth & GST Retainer',
    target: 'Growing MSMEs & Active Traders',
    price: 5999,
    annualPrice: 4999,
    period: 'month',
    isPopular: true,
    badge: 'MOST POPULAR • BEST ROI',
    roiBadge: '💰 Recovers ~₹1.2L+ ITC Losses',
    icon: 'fas fa-rocket',
    summary: 'Full accounting outsourcing, vendor ITC matching, TDS filings, and direct WhatsApp access to a certified CA partner.',
    deliverables: [
      { title: 'Complete Accounting & Ledgers', desc: 'Real-time bookkeeping and ledger curation for up to 150 invoices/mo', icon: 'fas fa-receipt' },
      { title: 'GSTR-2B ITC Matching', desc: 'Automated vendor input tax matching to prevent credit leakage', icon: 'fas fa-hand-holding-usd' },
      { title: 'Quarterly TDS Returns', desc: 'Form 24Q & 26Q computations, challan validation, and Form 16 issuance', icon: 'fas fa-file-contract' },
      { title: 'AIS / 26AS Reconciliation', desc: 'Systematic cross-verification against Income Tax compliance portal', icon: 'fas fa-search-dollar' },
      { title: 'Priority WhatsApp CA Desk', desc: 'Direct priority chat & phone support with designated senior CA partner', icon: 'fab fa-whatsapp' },
      { title: 'Notice Review & Advisory', desc: 'Routine scrutiny notice review, legal interpretation & response drafting', icon: 'fas fa-gavel' },
    ],
    ctaText: 'Choose Growth Retainer',
  },
  'premium plan': {
    id: 'premium',
    name: 'Virtual CFO Advisory',
    target: 'Pvt Ltd Companies & High-Turnover LLPs',
    price: 24999,
    annualPrice: 20999,
    period: 'month',
    isPopular: false,
    badge: 'ENTERPRISE RETAINER',
    roiBadge: '📊 100% Tax Audit Defense',
    icon: 'fas fa-crown',
    summary: 'Turnkey financial leadership, corporate tax filing (ITR-6), advanced tax audit preparation, and statutory defense.',
    deliverables: [
      { title: 'Full Virtual CFO Outsourcing', desc: 'Strategic cashflow management, unit economics & monthly executive MIS reporting', icon: 'fas fa-chart-line' },
      { title: 'Corporate ITR-6 & 5 Returns', desc: 'Comprehensive direct corporate tax filing with full Section 44AB tax audits', icon: 'fas fa-file-signature' },
      { title: 'Statutory Notice Defense', desc: 'ASMT-10, DRC-01 & Section 143/148 drafting, legal replies & department appeals', icon: 'fas fa-shield-alt' },
      { title: 'ROC & MCA Annual Filings', desc: 'AOC-4, MGT-7 & Director e-KYC compliance fulfilled on official MCA portal', icon: 'fas fa-building' },
      { title: 'Dedicated CA Desk', desc: '1-on-1 dedicated senior partner assigned exclusively to your corporate account', icon: 'fas fa-user-tie' },
      { title: 'Multi-Branch Reconciliation', desc: 'Consolidated accounting, inter-branch cross-charges & multi-state GST filing', icon: 'fas fa-network-wired' },
    ],
    ctaText: 'Hire Virtual CFO Desk',
  },
  'incorporate plan': {
    id: 'incorporate',
    name: 'Turnkey Incorporation',
    target: 'New Startups & Expanding Ventures',
    price: 49999,
    annualPrice: 49999,
    period: 'one-time',
    isPopular: false,
    badge: 'ONE-TIME FORMATION',
    roiBadge: '⚡ Complete Setup in 5–7 Days',
    icon: 'fas fa-landmark',
    summary: 'Complete legal company incorporation, DIN/DSC allotments, MoA/AoA drafting, and 1st month complimentary tax advisory.',
    deliverables: [
      { title: 'Pvt Ltd / LLP Incorporation', desc: 'MCA SPICe+ filing with government fee, name approval & stamp duty covered', icon: 'fas fa-award' },
      { title: '2 DINs & Class-3 DSCs', desc: 'Digital signature tokens & Director Identification Numbers issued', icon: 'fas fa-key' },
      { title: 'PAN, TAN & Bank A/c Drafting', desc: 'Drafting MoA, AoA & corporate zero-balance current account opening facilitation', icon: 'fas fa-university' },
      { title: 'MSME & Startup India DPIIT', desc: 'Recognition filing for Section 80-IAC 3-year income tax exemption eligibility', icon: 'fas fa-certificate' },
      { title: 'GST Registration Included', desc: 'Immediate GSTIN certificate setup and verification within 3 business days', icon: 'fas fa-id-card' },
      { title: 'Complimentary 1st Month Advisory', desc: 'Free 30-day compliance review and tax structuring session by senior CA', icon: 'fas fa-calendar-check' },
    ],
    ctaText: 'Incorporate Your Company',
  },
};

const PricingSection = () => {
  const { data: response } = useFetch(getPricing);
  const navigate = useNavigate();

  // Billing Cycle Toggle: 'monthly' | 'annual'
  const [billingCycle, setBillingCycle] = useState('monthly');

  // If database contains active pricing plans, merge or dynamically expose them
  const dynamicPlans = useMemo(() => {
    const plansMap = { ...DETAILED_PLANS };
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((p) => {
        const key = (p.name || '').toLowerCase();
        const existing = DETAILED_PLANS[key] || {};
        const deliverablesList = (p.features && p.features.length > 0)
          ? p.features.map((feat) => ({
              title: feat,
              desc: 'Direct consultation & verified statutory filing',
              icon: 'fas fa-check-circle',
            }))
          : [
              { title: 'Statutory Compliance', desc: 'Direct oversight by certified CA', icon: 'fas fa-shield-alt' },
              { title: 'Audit Ready Documentation', desc: 'Complete paperless digital vault', icon: 'fas fa-folder-open' },
            ];

        const rawPrice = typeof p.price === 'number' ? p.price : (existing.price || 0);

        plansMap[key] = {
          ...existing,
          id: p._id || existing.id || key,
          name: p.name || existing.name || 'Advisory Plan',
          target: p.tagline || existing.target || 'Custom Advisory Retainer',
          price: rawPrice,
          annualPrice: existing.annualPrice || Math.round(rawPrice * 0.82),
          period: p.period || p.billingPeriod || existing.period || 'month',
          isPopular: p.isPopular !== undefined ? Boolean(p.isPopular) : Boolean(existing.isPopular),
          badge: (p.isPopular || existing.isPopular) ? 'MOST POPULAR • BEST ROI' : (existing.badge || 'SPECIALIZED'),
          roiBadge: existing.roiBadge || '⚡ Certified Chartered Oversight',
          icon: existing.icon || 'fas fa-award',
          summary: p.description || p.tagline || existing.summary || 'Comprehensive compliance & chartered tax advisory retainer.',
          deliverables: (existing.deliverables && existing.deliverables.length > 0) ? existing.deliverables : deliverablesList,
          ctaText: p.ctaText || existing.ctaText || 'Consult With CA',
        };
      });
    }
    return plansMap;
  }, [response]);

  const planKeys = useMemo(() => Object.keys(dynamicPlans), [dynamicPlans]);

  // Active selected plan key (defaults to first available or standard plan)
  const [selectedPlanKey, setSelectedPlanKey] = useState('standard plan');

  const activePlan = dynamicPlans[selectedPlanKey] || dynamicPlans[planKeys[0]] || DETAILED_PLANS['standard plan'] || {};

  const isMonthlyPlan = activePlan.period === 'month';
  const isAnnualMode = billingCycle === 'annual' && isMonthlyPlan;
  const currentPrice = isAnnualMode ? (activePlan.annualPrice || Math.round((activePlan.price || 0) * 0.82)) : (activePlan.price || 0);
  const originalPrice = activePlan.price || 0;
  const annualSavings = isMonthlyPlan ? (originalPrice - currentPrice) * 12 : 0;

  const handleSelectPlan = (planName) => {
    const cycleSuffix = isAnnualMode ? ' (Annual Retainer)' : isMonthlyPlan ? ' (Monthly Retainer)' : ' (One-Time)';
    navigate('/contact', { state: { planName: `${planName}${cycleSuffix}` } });
  };

  const handleWhatsAppQuote = () => {
    const periodLabel = isAnnualMode ? 'mo (billed annually)' : activePlan.period === 'month' ? 'mo' : 'one-time';
    const text = `Hello CA Team, I am interested in the ${activePlan.name} (₹${currentPrice.toLocaleString('en-IN')}/${periodLabel}) and would like to discuss our company compliance scope.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="pricing-dynamic-section" id="pricing-section">
      {/* Glowing Gold Accent Line matching Footer */}
      <div className="pricing-top-accent-line"></div>

      {/* Fine Architectural Blueprint Grid Pattern */}
      <div className="pricing-grid-pattern" aria-hidden="true"></div>

      <div className="container pricing-dynamic-wrapper">
        {/* Executive Header */}
        <div className="pricing-dynamic-header">
          <div className="pricing-status-pill">
            <span className="live-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>Statutory Retainers &bull; Fixed-Fee Commitment</span>
          </div>
          <h2 className="pricing-dynamic-title">
            Predictable Retainers, <span className="title-gradient-gold">Zero Surprises.</span>
          </h2>
          <p className="pricing-dynamic-subtitle">
            Transparent monthly accounting, GST reconciliation, and corporate direct tax advisory engineered for Indian businesses. Direct oversight by certified Chartered Accountants.
          </p>

          {/* Interactive Billing Cycle Switcher */}
          <div className="pricing-billing-toggle-wrap">
            <div className="pricing-billing-toggle">
              <button
                type="button"
                className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                <span>Monthly Retainer</span>
              </button>
              <button
                type="button"
                className={`toggle-option ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
              >
                <span>Annual Commitment</span>
                <span className="annual-save-badge">SAVE ~18% • 2 MO FREE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Showcase Container */}
        <div className="dynamic-showcase-container">
          {/* Top Interactive Plan Selector Bar */}
          <div className="dynamic-selector-tabs">
            {planKeys.map((key) => {
              const plan = dynamicPlans[key] || DETAILED_PLANS[key] || {};
              const isSelected = selectedPlanKey === key;
              const tabIsMonthly = plan.period === 'month';
              const tabPrice = (billingCycle === 'annual' && tabIsMonthly)
                ? (plan.annualPrice || Math.round((plan.price || 0) * 0.82))
                : (plan.price || 0);

              return (
                <button
                  key={key}
                  className={`selector-tab-card ${isSelected ? 'active' : ''} ${plan.isPopular ? 'popular-tab' : ''}`}
                  onClick={() => setSelectedPlanKey(key)}
                >
                  <div className="tab-icon-badge">
                    <i className={plan.icon || 'fas fa-briefcase'}></i>
                  </div>

                  <div className="tab-left-content">
                    <div className="tab-title-row">
                      <h4 className="tab-plan-name">{plan.name || 'Advisory Plan'}</h4>
                      {plan.isPopular && <span className="tab-popular-tag">RECOMMENDED</span>}
                    </div>
                    <span className="tab-target-label">{plan.target}</span>
                  </div>

                  <div className="tab-right-price">
                    <span className="tab-price-val">₹{tabPrice.toLocaleString('en-IN')}</span>
                    <span className="tab-price-period">/{tabIsMonthly ? 'mo' : 'one-time'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Expansive Landscape Showcase Card */}
          <div
            key={`${selectedPlanKey}-${billingCycle}`}
            className={`dynamic-stage-card ${activePlan.isPopular ? 'stage-popular' : ''} stage-fade-in`}
          >
            {/* Left Column: Plan Summary & Price CTA */}
            <div className="stage-left-summary">
              <div className="stage-meta-tags">
                <span className="stage-badge-pill">{activePlan.badge || 'POPULAR'}</span>
                {activePlan.roiBadge && (
                  <span className="stage-roi-pill">{activePlan.roiBadge}</span>
                )}
                <span className="stage-target-pill">{activePlan.target}</span>
              </div>

              <h3 className="stage-title">{activePlan.name}</h3>
              <p className="stage-desc">{activePlan.summary}</p>

              <div className="stage-price-display">
                {isAnnualMode && (
                  <div className="stage-strikethrough-row">
                    <span className="stage-original-label">Regular Monthly:</span>
                    <span className="stage-original-price">₹{originalPrice.toLocaleString('en-IN')}/mo</span>
                    <span className="stage-discount-chip">SAVE 18%</span>
                  </div>
                )}

                <div className="stage-price-row">
                  <span className="stage-currency">₹</span>
                  <span className="stage-amount">{currentPrice.toLocaleString('en-IN')}</span>
                  <span className="stage-period">
                    /{isAnnualMode ? 'mo (billed annually)' : activePlan.period === 'month' ? 'mo' : 'one-time'}
                  </span>
                </div>

                {isAnnualMode && annualSavings > 0 && (
                  <div className="stage-annual-savings-line">
                    <i className="fas fa-sparkles"></i>
                    <span>Annual contract saves ₹{annualSavings.toLocaleString('en-IN')} per fiscal year</span>
                  </div>
                )}

                <span className="stage-guarantee-line">
                  <i className="fas fa-check-shield"></i> All statutory taxes included &bull; 100% On-Time Guarantee
                </span>
              </div>

              <div className="stage-cta-buttons">
                <button
                  className="btn-stage-primary"
                  onClick={() => handleSelectPlan(activePlan.name)}
                >
                  <span>{activePlan.ctaText || 'Get Started'}</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
                <button className="btn-stage-wa" onClick={handleWhatsAppQuote}>
                  <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* Right Column: 6-Block Deliverables Bento */}
            <div className="stage-right-deliverables">
              <div className="deliverables-headline-row">
                <h4>
                  <i className="fas fa-list-check"></i> What's Included in {activePlan.name}:
                </h4>
                <span className="verified-ca-seal">
                  <i className="fas fa-check-circle"></i> Chartered Oversight
                </span>
              </div>

              <div className="deliverables-bento-grid">
                {(activePlan.deliverables || []).map((item, idx) => (
                  <div key={idx} className="deliverable-bento-item">
                    <div className="deliverable-icon-box">
                      <i className={item.icon || 'fas fa-check-circle'}></i>
                    </div>
                    <div className="deliverable-text-box">
                      <h5>{item.title}</h5>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Universal Baseline Retainer Trust Guarantee Strip */}
        <div className="pricing-guarantee-strip">
          <div className="guarantee-strip-item">
            <div className="guarantee-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="guarantee-copy">
              <strong>Zero-Penalty Guarantee</strong>
              <span>100% on-time statutory filing promise</span>
            </div>
          </div>

          <div className="guarantee-strip-item">
            <div className="guarantee-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="guarantee-copy">
              <strong>ICAI Certified Oversight</strong>
              <span>Dual-level partner audit verification</span>
            </div>
          </div>

          <div className="guarantee-strip-item">
            <div className="guarantee-icon">
              <i className="fas fa-lock"></i>
            </div>
            <div className="guarantee-copy">
              <strong>Bank-Grade Discretion</strong>
              <span>256-bit encrypted digital doc locker</span>
            </div>
          </div>

          <div className="guarantee-strip-item">
            <div className="guarantee-icon">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="guarantee-copy">
              <strong>GST Tax Invoicing</strong>
              <span>Claim 18% input tax credit back</span>
            </div>
          </div>
        </div>

        {/* Bottom Custom Enterprise Advisory Banner */}
        <div className="pricing-enterprise-bottom-bar">
          <div className="enterprise-bar-left">
            <div className="enterprise-seal-icon">
              <i className="fas fa-headset"></i>
            </div>
            <div className="enterprise-bar-copy">
              <span className="enterprise-live-tag">🟢 1-ON-1 CONFIDENTIAL ADVISORY</span>
              <h3>Need a bespoke multi-state GST retainer or high-turnover audit plan?</h3>
              <p>We structure custom monthly and annual retainers for manufacturing units, export businesses, and multi-entity corporate structures.</p>
            </div>
          </div>

          <div className="enterprise-bar-actions">
            <Link to="/contact" className="btn-enterprise-primary">
              <i className="fas fa-file-signature"></i>
              <span>Request Custom Proposal</span>
            </Link>
            <button className="btn-enterprise-action" onClick={handleWhatsAppQuote}>
              <i className="fab fa-whatsapp"></i> Chat with Senior CA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
