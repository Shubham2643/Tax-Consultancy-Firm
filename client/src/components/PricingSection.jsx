import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPricing } from '../api';
import useFetch from '../hooks/useFetch';
import './PricingSection.css';

const DETAILED_PLANS = {
  'basic plan': {
    id: 'basic',
    name: 'Starter Compliance',
    target: 'Sole Proprietors & Freelancers',
    price: 2999,
    period: 'month',
    isPopular: false,
    badge: 'STARTER TIER',
    icon: 'fas fa-seedling',
    summary: 'Essential bookkeeping, monthly GST filings, and quarterly advance tax calculations for micro-enterprises.',
    deliverables: [
      { title: 'Monthly Bookkeeping', desc: 'Up to 50 transactions with bank reconciliation', icon: 'fas fa-book' },
      { title: 'GST Returns (GSTR-1 & 3B)', desc: 'Error-free monthly filing before statutory due dates', icon: 'fas fa-file-invoice-dollar' },
      { title: 'Quarterly Advance Tax', desc: 'Section 234B/C interest mitigation forecasting', icon: 'fas fa-calculator' },
      { title: 'Year-End Financials', desc: 'P&L and Balance Sheet drafting for ITR return', icon: 'fas fa-balance-scale' },
      { title: 'Standard Support Desk', desc: 'Client portal access & email query resolution within 24h', icon: 'fas fa-envelope' },
      { title: 'Zero Penalty Assurance', desc: 'Timely filing guarantee against statutory late fees', icon: 'fas fa-shield-alt' },
    ],
    ctaText: 'Choose Starter Retainer',
  },
  'standard plan': {
    id: 'standard',
    name: 'Growth & GST Retainer',
    target: 'Growing MSMEs & Active Traders',
    price: 5999,
    period: 'month',
    isPopular: true,
    badge: 'MOST POPULAR • BEST ROI',
    icon: 'fas fa-rocket',
    summary: 'Full accounting outsourcing, vendor ITC matching, TDS filings, and direct WhatsApp access to a certified CA partner.',
    deliverables: [
      { title: 'Complete Accounting & Ledgers', desc: 'Real-time bookkeeping for up to 150 invoices/mo', icon: 'fas fa-receipt' },
      { title: 'GSTR-2B ITC Matching', desc: 'Automated vendor input tax matching to avoid loss', icon: 'fas fa-hand-holding-usd' },
      { title: 'Quarterly TDS Returns', desc: 'Form 24Q & 26Q computations and Challan prep', icon: 'fas fa-file-contract' },
      { title: 'AIS / 26AS Reconciliation', desc: 'Detailed data matching with Income Tax portal', icon: 'fas fa-search-dollar' },
      { title: 'Priority WhatsApp CA Desk', desc: 'Direct chat & phone support with senior CA partner', icon: 'fab fa-whatsapp' },
      { title: 'Notice Review & Advisory', desc: 'Routine scrutiny notice review & response drafting', icon: 'fas fa-gavel' },
    ],
    ctaText: 'Choose Growth Retainer',
  },
  'premium plan': {
    id: 'premium',
    name: 'Virtual CFO Advisory',
    target: 'Pvt Ltd Companies & High-Turnover LLPs',
    price: 24999,
    period: 'month',
    isPopular: false,
    badge: 'ENTERPRISE RETAINER',
    icon: 'fas fa-crown',
    summary: 'Turnkey financial leadership, corporate tax filing (ITR-6), advanced tax audit preparation, and statutory defense.',
    deliverables: [
      { title: 'Full Virtual CFO Outsourcing', desc: 'Strategic cashflow management & MIS reporting', icon: 'fas fa-chart-line' },
      { title: 'Corporate ITR-6 & 5 Returns', desc: 'Comprehensive direct tax filing with tax audits', icon: 'fas fa-file-signature' },
      { title: 'Statutory Notice Defense', desc: 'ASMT-10, DRC-01 & Section 143/148 drafting & appeals', icon: 'fas fa-shield-alt' },
      { title: 'ROC & MCA Annual Filings', desc: 'AOC-4, MGT-7 & Director KYC annual compliance', icon: 'fas fa-building' },
      { title: 'Dedicated CA Desk', desc: '1-on-1 dedicated senior partner assigned to your account', icon: 'fas fa-user-tie' },
      { title: 'Multi-Branch Reconciliation', desc: 'Consolidated accounts for multi-state entities', icon: 'fas fa-network-wired' },
    ],
    ctaText: 'Hire Virtual CFO Desk',
  },
  'incorporate plan': {
    id: 'incorporate',
    name: 'Turnkey Incorporation',
    target: 'New Startups & Expanding Ventures',
    price: 49999,
    period: 'one-time',
    isPopular: false,
    badge: 'ONE-TIME FORMATION',
    icon: 'fas fa-landmark',
    summary: 'Complete legal company incorporation, DIN/DSC allotments, MoA/AoA drafting, and 1st month complimentary tax advisory.',
    deliverables: [
      { title: 'Pvt Ltd / LLP Incorporation', desc: 'MCA SPICe+ filing with government fee covered', icon: 'fas fa-award' },
      { title: '2 DINs & Class-3 DSCs', desc: 'Digital signatures & Director Identification Numbers', icon: 'fas fa-key' },
      { title: 'PAN, TAN & Bank A/c Drafting', desc: 'Drafting MoA, AoA & corporate bank opening support', icon: 'fas fa-university' },
      { title: 'MSME & Startup India DPIIT', desc: 'Recognition filing for 3-year tax exemption benefit', icon: 'fas fa-certificate' },
      { title: 'GST Registration Included', desc: 'Immediate GSTIN certificate setup within 3 days', icon: 'fas fa-id-card' },
      { title: 'Complimentary 1st Month Advisory', desc: 'Free 30-day compliance review by senior CA', icon: 'fas fa-calendar-check' },
    ],
    ctaText: 'Incorporate Your Company',
  },
};

const PricingSection = () => {
  const { data: response } = useFetch(getPricing);
  const navigate = useNavigate();

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

        plansMap[key] = {
          ...existing,
          id: p._id || existing.id || key,
          name: p.name || existing.name || 'Advisory Plan',
          target: p.tagline || existing.target || 'Custom Advisory Retainer',
          price: typeof p.price === 'number' ? p.price : (existing.price || 0),
          period: p.period || p.billingPeriod || existing.period || 'month',
          isPopular: p.isPopular !== undefined ? Boolean(p.isPopular) : Boolean(existing.isPopular),
          badge: (p.isPopular || existing.isPopular) ? 'MOST POPULAR • BEST ROI' : (existing.badge || 'SPECIALIZED'),
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

  const handleSelectPlan = (planName) => {
    navigate('/contact', { state: { planName } });
  };

  const handleWhatsAppQuote = () => {
    const text = `Hello CA Team, I am interested in the ${activePlan.name || 'Advisory Plan'} (₹${(activePlan.price || 0).toLocaleString('en-IN')}/${activePlan.period || 'mo'}) and would like to discuss my business requirements.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="pricing-dynamic-section">
      {/* Glowing Gold Accent Line matching Footer */}
      <div className="pricing-top-accent-line"></div>

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
        </div>

        {/* Dynamic Showcase Container */}
        <div className="dynamic-showcase-container">
          {/* Top Interactive Plan Selector Bar */}
          <div className="dynamic-selector-tabs">
            {planKeys.map((key) => {
              const plan = dynamicPlans[key] || DETAILED_PLANS[key] || {};
              const isSelected = selectedPlanKey === key;
              return (
                <button
                  key={key}
                  className={`selector-tab-card ${isSelected ? 'active' : ''} ${plan.isPopular ? 'popular-tab' : ''}`}
                  onClick={() => setSelectedPlanKey(key)}
                >
                  <div className="tab-left-content">
                    <div className="tab-title-row">
                      <h4 className="tab-plan-name">{plan.name || 'Advisory Plan'}</h4>
                      {plan.isPopular && <span className="tab-popular-tag">RECOMMENDED</span>}
                    </div>
                    <span className="tab-target-label">{plan.target}</span>
                  </div>

                  <div className="tab-right-price">
                    <span className="tab-price-val">₹{(plan.price || 0).toLocaleString('en-IN')}</span>
                    <span className="tab-price-period">/{plan.period === 'month' ? 'mo' : 'one-time'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Expansive Landscape Showcase Card */}
          <div className={`dynamic-stage-card ${activePlan.isPopular ? 'stage-popular' : ''}`}>
            {/* Left Column: Plan Summary & Price CTA */}
            <div className="stage-left-summary">
              <div className="stage-meta-tags">
                <span className="stage-badge-pill">{activePlan.badge || 'POPULAR'}</span>
                <span className="stage-target-pill">{activePlan.target}</span>
              </div>

              <h3 className="stage-title">{activePlan.name}</h3>
              <p className="stage-desc">{activePlan.summary}</p>

              <div className="stage-price-display">
                <div className="stage-price-row">
                  <span className="stage-currency">₹</span>
                  <span className="stage-amount">{(activePlan.price || 0).toLocaleString('en-IN')}</span>
                  <span className="stage-period">/{activePlan.period || 'mo'}</span>
                </div>
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
            <button className="btn-enterprise-action" onClick={handleWhatsAppQuote}>
              <i className="fab fa-whatsapp"></i> Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
