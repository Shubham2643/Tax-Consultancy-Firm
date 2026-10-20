import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPricing } from '../api';
import useFetch from '../hooks/useFetch';
import './PricingSection.css';

const STATUTORY_RETAINERS = {
  'starter': {
    id: 'starter',
    code: 'TIER 01',
    roman: 'I',
    name: 'Foundational Practice Retainer',
    target: 'Sole Proprietors, Professionals & Emerging MSMEs',
    price: 2999,
    annualPrice: 2499,
    period: 'month',
    isPopular: false,
    badge: 'FOUNDATIONAL COMPLIANCE',
    roiBadge: '⏱️ Eliminates 15+ Hours of Monthly Bookkeeping',
    icon: 'fas fa-scale-unbalanced',
    tierClass: 'tier-card-emerald',
    categoryTag: 'FOUNDATIONAL',
    tierIcon: 'fas fa-feather-pointed',
    volumeChip: 'Up to 50 Vouchers / Mo',
    volumeIcon: 'fas fa-receipt',
    summary:
      'Essential statutory accounting, monthly GST compliance, and advance tax forecasting engineered for proprietorships and independent practitioners.',
    scopeCategories: [
      {
        discipline: 'Bookkeeping & Banking',
        items: [
          'Monthly bookkeeping up to 50 transactions',
          'Automated bank ledger reconciliation',
          'Year-end Balance Sheet & Profit & Loss drafting',
        ],
      },
      {
        discipline: 'GST & Indirect Taxes',
        items: [
          'Monthly GSTR-1 (Outward) & GSTR-3B (Summary) filing',
          'Basic GSTR-2B input tax credit overview',
          'Timely filing on 11th & 20th statutory due dates',
        ],
      },
      {
        discipline: 'Direct Taxes & Advance Tax',
        items: [
          'Quarterly Advance Tax calculation (Sec 208/211)',
          'Form 26AS & AIS tax credit cross-verification',
          'Annual ITR-3 / ITR-4 filing preparation',
        ],
      },
      {
        discipline: 'Statutory Safeguards',
        items: [
          'Client vault document repository (256-bit AES)',
          '24-Hour query response SLA via client portal',
          'Statutory late-fee protection guarantee',
        ],
      },
    ],
    ctaText: 'Retain Foundational Desk',
  },
  'growth': {
    id: 'growth',
    code: 'TIER 02',
    roman: 'II',
    name: 'Corporate & MSME Statutory Retainer',
    target: 'Private Limited Companies, Active LLPs & Trading MSMEs',
    price: 5999,
    annualPrice: 4999,
    period: 'month',
    isPopular: true,
    badge: 'THE FIRM BENCHMARK • MOST RETAINED',
    roiBadge: '💰 Recovers ~₹1.2L+ Blocked Input Tax Credit',
    icon: 'fas fa-building-columns',
    tierClass: 'tier-card-gold',
    categoryTag: 'FIRM BENCHMARK',
    tierIcon: 'fas fa-building-columns',
    volumeChip: 'Up to 150 Vouchers / Mo',
    volumeIcon: 'fas fa-box-archive',
    summary:
      'Complete accounting outsourcing, deep algorithmic GSTR-2B input tax reconciliation, quarterly TDS returns, annual ROC secretarial filings, and direct Senior CA partner oversight.',
    scopeCategories: [
      {
        discipline: 'Full Ledger Outsourcing',
        items: [
          'Ledger curation up to 150 invoices/month',
          'Multi-bank & payment gateway reconciliation',
          'Monthly Management MIS & Cashflow Snapshot',
        ],
      },
      {
        discipline: 'Forensic GST & ITC Recovery',
        items: [
          'Algorithmic GSTR-2B vs. Purchase Register cross-matching',
          'Recovery of blocked and uncredited Input Tax Credit',
          'Monthly GSTR-1, 3B and Quarterly IFF filings',
        ],
      },
      {
        discipline: 'Direct Taxes & Quarterly TDS',
        items: [
          'Quarterly TDS Returns (Form 24Q & 26Q computations)',
          'TDS challan verification & Form 16/16A generation',
          'Section 143(1) automated defect notice defense',
        ],
      },
      {
        discipline: 'Secretarial & Partner Advisory',
        items: [
          'Annual MCA Compliance: Form AOC-4 & MGT-7 drafting',
          'Director DIR-3 KYC compliance execution',
          'Priority WhatsApp CA Desk with designated Senior Partner',
        ],
      },
    ],
    ctaText: 'Retain Corporate Mandate',
  },
  'enterprise': {
    id: 'enterprise',
    code: 'TIER 03',
    roman: 'III',
    name: 'Enterprise & Multi-State Retainer',
    target: 'Multi-Branch Corporates, Factories & Turnover > ₹5 Cr',
    price: 24999,
    annualPrice: 20999,
    period: 'month',
    isPopular: false,
    badge: 'ENTERPRISE AUDIT & CFO',
    roiBadge: '🛡️ 100% Tax Audit Defense Coverage',
    icon: 'fas fa-shield-halved',
    tierClass: 'tier-card-sapphire',
    categoryTag: 'VIRTUAL CFO',
    tierIcon: 'fas fa-shield-halved',
    volumeChip: 'Uncapped Multi-Branch',
    volumeIcon: 'fas fa-network-wired',
    summary:
      'Turnkey financial leadership, Section 44AB statutory tax audit defense, multi-GSTIN cross-state consolidations, transfer pricing documentation, and appellate notice representation.',
    scopeCategories: [
      {
        discipline: 'Virtual CFO Leadership',
        items: [
          'Uncapped transaction accounting & multi-branch curation',
          'Executive Board MIS, unit economics & working capital review',
          'Monthly financial performance review with Senior FCA Partner',
        ],
      },
      {
        discipline: 'Multi-State GST & Consolidations',
        items: [
          'Multi-GSTIN state-wise reconciliation & filings',
          'Inter-branch cross-charge & valuation advisory',
          'Annual GST Audit (GSTR-9 & 9C reconciliation docket)',
        ],
      },
      {
        discipline: 'Direct Tax Audit & Corporate Filings',
        items: [
          'Corporate ITR-6 / ITR-5 direct tax return filing',
          'Section 44AB Statutory Tax Audit Form 3CA/3CB-3CD preparation',
          'Advance tax modeling & cash withholding optimization',
        ],
      },
    ],
    ctaText: 'Engage Enterprise Retainer',
  },
  'incorporation': {
    id: 'incorporation',
    code: 'TIER 04',
    roman: 'IV',
    name: 'Turnkey Corporate Incorporation Retainer',
    target: 'New Startups, Foreign Subsidiaries & Expanding Ventures',
    price: 49999,
    annualPrice: 49999,
    period: 'one-time',
    isPopular: false,
    badge: 'ONE-TIME STATUTORY SETUP',
    roiBadge: '⚡ 5–7 Day Guaranteed Entity Incorporation',
    icon: 'fas fa-stamp',
    tierClass: 'tier-card-amethyst',
    categoryTag: 'TURNKEY SETUP',
    tierIcon: 'fas fa-stamp',
    volumeChip: '5–7 Day SPICe+ Setup',
    volumeIcon: 'fas fa-bolt',
    summary:
      'Complete legal entity formation under MCA SPICe+, 2 Class-3 hardware cryptographic DSCs, DINs, PAN/TAN, DPIIT 80-IAC tax exemption, and complimentary 60-day post-incorporation compliance desk.',
    scopeCategories: [
      {
        discipline: 'Corporate Legal Charter',
        items: [
          'MCA SPICe+ filing covering name reservation & RUN approvals',
          'MoA & AoA drafting tailored to business objects',
          'Government stamp duty & certificate of incorporation covered',
        ],
      },
      {
        discipline: 'Cryptographic Credentials',
        items: [
          '2 Class-3 USB hardware cryptographic DSC tokens issued',
          '2 Director Identification Numbers (DINs) approved',
          'Corporate PAN, TAN and EPFO/ESIC registrations',
        ],
      },
      {
        discipline: 'Tax Exemptions & Clearances',
        items: [
          'DPIIT Startup India certificate for Sec 80-IAC tax holiday',
          'Immediate GSTIN registration & verification within 3 days',
          'Gujarat Professional Tax employer registration',
        ],
      },
      {
        discipline: 'Post-Formation Governance',
        items: [
          'Opening facilitation for zero-balance corporate current account',
          'First Board Meeting minutes & statutory registers setup',
          '60-Day complimentary compliance review by senior CA',
        ],
      },
    ],
    ctaText: 'Execute Turnkey Incorporation',
  },
};

const PricingSection = () => {
  const { data: response } = useFetch(getPricing);
  const navigate = useNavigate();

  // Billing Cycle Toggle: 'monthly' | 'annual'
  const [billingCycle, setBillingCycle] = useState('annual');

  // Interactive Scope Estimator State
  const [estimatorVolume, setEstimatorVolume] = useState('medium'); // low | medium | high | enterprise
  const [estimatorType, setEstimatorType] = useState('pvt_ltd'); // prop | pvt_ltd | enterprise

  // Dynamic Plans mapping with database fallback
  const dynamicPlans = useMemo(() => {
    if (!response?.data || !Array.isArray(response.data) || response.data.length === 0) {
      return STATUTORY_RETAINERS;
    }
    const merged = { ...STATUTORY_RETAINERS };
    response.data.forEach((p) => {
      const lower = (p.name || '').toLowerCase();
      let key = null;
      if (lower.includes('incorporat') || lower.includes('turnkey')) {
        key = 'incorporation';
      } else if (lower.includes('enterprise') || lower.includes('cfo') || lower.includes('premium')) {
        key = 'enterprise';
      } else if (lower.includes('corporate') || lower.includes('msme') || lower.includes('growth') || lower.includes('standard')) {
        key = 'growth';
      } else if (lower.includes('foundational') || lower.includes('basic') || lower.includes('starter')) {
        key = 'starter';
      }

      if (key && merged[key] && typeof p.price === 'number') {
        const annual =
          key === 'starter' ? 2499 :
          key === 'growth' ? 4999 :
          key === 'enterprise' ? 20999 :
          p.price;

        merged[key] = {
          ...merged[key],
          price: p.price,
          annualPrice: annual,
        };
      }
    });
    return merged;
  }, [response]);

  const planKeys = useMemo(() => Object.keys(dynamicPlans), [dynamicPlans]);

  // Active selected plan key
  const [selectedPlanKey, setSelectedPlanKey] = useState('growth');

  const activePlan = dynamicPlans[selectedPlanKey] || dynamicPlans['growth'];

  const isMonthlyPlan = activePlan.period === 'month';
  const isAnnualMode = billingCycle === 'annual' && isMonthlyPlan;
  const currentPrice = isAnnualMode ? activePlan.annualPrice : activePlan.price;
  const originalPrice = activePlan.price;
  const annualSavings = isMonthlyPlan ? (originalPrice - currentPrice) * 12 : 0;

  const handleSelectPlan = (planName) => {
    const cycleSuffix = isAnnualMode ? ' (Annual Retainer Mandate)' : isMonthlyPlan ? ' (Monthly Retainer Mandate)' : ' (One-Time Formation Mandate)';
    navigate('/contact', { state: { planName: `${planName}${cycleSuffix}` } });
  };

  const handleWhatsAppQuote = () => {
    const periodLabel = isAnnualMode ? 'mo (billed annually)' : activePlan.period === 'month' ? 'mo' : 'one-time';
    const text = `Hello Shree Chamunda Associates, I would like to consult regarding the ${activePlan.name} (₹${currentPrice.toLocaleString('en-IN')}/${periodLabel}) for our statutory compliance mandate.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Scope Estimator recommendation
  const recommendedKey = useMemo(() => {
    if (estimatorType === 'prop' && estimatorVolume === 'low') return 'starter';
    if (estimatorType === 'enterprise' || estimatorVolume === 'enterprise') return 'enterprise';
    return 'growth';
  }, [estimatorType, estimatorVolume]);

  const handleEstimatorTypeClick = (type) => {
    setEstimatorType(type);
    let nextKey = 'growth';
    if (type === 'prop' && estimatorVolume === 'low') nextKey = 'starter';
    else if (type === 'enterprise' || estimatorVolume === 'enterprise') nextKey = 'enterprise';
    setSelectedPlanKey(nextKey);
  };

  const handleEstimatorVolumeClick = (volume) => {
    setEstimatorVolume(volume);
    let nextKey = 'growth';
    if (estimatorType === 'prop' && volume === 'low') nextKey = 'starter';
    else if (estimatorType === 'enterprise' || volume === 'enterprise') nextKey = 'enterprise';
    setSelectedPlanKey(nextKey);
  };

  return (
    <section className="statutory-retainers-section" id="pricing-section">
      {/* Top Accent Line */}
      <div className="retainers-top-accent-line" aria-hidden="true"></div>

      {/* Subtle Architectural Pinstripe Background */}
      <div className="retainers-pinstripe-bg" aria-hidden="true"></div>

      <div className="container retainers-container">
        {/* Chambers Editorial Header */}
        <div className="retainers-header text-center">
          <div className="retainers-eyebrow-badge">
            <span className="retainers-live-dot" aria-hidden="true"></span>
            <i className="fas fa-landmark"></i>
            <span>PRACTICE GOVERNANCE // STATUTORY RETAINERS</span>
          </div>

          <h2 className="retainers-main-title">
            Predictable Retainers, <span className="title-burnished-gold">Absolute Precision.</span>
          </h2>

          <p className="retainers-lead-text">
            Scope-locked Chartered Accountancy retainers governing direct tax, GST audit, ROC secretarial compliance,
            and scrutiny representation under ICAI regulatory ethics. Zero billing surprises.
          </p>

          {/* Institutional Fiscal Commitment Toggle */}
          <div className="retainers-billing-selector-wrap">
            <div className="retainers-billing-pill" role="radiogroup" aria-label="Retainer Commitment Frequency">
              <button
                type="button"
                className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
                aria-checked={billingCycle === 'monthly'}
              >
                <span>Monthly Retainer</span>
              </button>

              <button
                type="button"
                className={`billing-btn ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
                aria-checked={billingCycle === 'annual'}
              >
                <span>Annual Statutory Mandate</span>
                <span className="billing-save-chip">Save 18% &bull; 2 Months Complimentary</span>
              </button>
            </div>
            <span className="billing-tax-footnote">
              <i className="fas fa-receipt"></i> 100% Tax Invoiced &bull; Corporate clients claim 18% GST Input Tax Credit back
            </span>
          </div>
        </div>

        {/* 4 Retainer Mandates Selector Strip */}
        <div className="retainers-tier-selector-grid" role="tablist" aria-label="Statutory Retainer Tiers">
          {planKeys.map((key) => {
            const plan = dynamicPlans[key];
            const isSelected = selectedPlanKey === key;
            const tabIsMonthly = plan.period === 'month';
            const tabPrice = (billingCycle === 'annual' && tabIsMonthly) ? plan.annualPrice : plan.price;
            const showDiscount = billingCycle === 'annual' && tabIsMonthly;
            const cardTheme = plan.tierClass || 'tier-card-gold';

            return (
              <div
                key={key}
                role="tab"
                tabIndex={0}
                aria-selected={isSelected}
                className={`tier-selector-card ${cardTheme} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlanKey(key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPlanKey(key);
                  }
                }}
              >
                {/* Top Accent Line */}
                <div className="tier-card-top-bar" aria-hidden="true"></div>

                {/* ROW 1: Symmetrical 3-Zone Header Row (Tier Code, Category Pill, Radio Selector) */}
                <div className="tier-header-row">
                  <div className="tier-header-tier">
                    <div className="tier-roman-crest">
                      <span className="roman-letter">{plan.roman}</span>
                    </div>
                    <span className="tier-code-tag">{plan.code}</span>
                  </div>

                  <span className="tier-category-pill">
                    {plan.isPopular && <i className="fas fa-crown"></i>}
                    <span>{plan.id === 'growth' ? 'BENCHMARK' : plan.categoryTag}</span>
                  </span>

                  <div className="tier-header-radio">
                    <div
                      className={`tier-radio-btn ${isSelected ? 'active' : 'idle'}`}
                      aria-label={isSelected ? 'Active Mandate' : 'Select Mandate'}
                    >
                      {isSelected ? <i className="fas fa-check"></i> : null}
                    </div>
                  </div>
                </div>

                {/* ROW 2: Mandate Title with Leading Icon Box (Locked Height) */}
                <div className="tier-title-container">
                  <div className="tier-title-icon-box">
                    <i className={plan.tierIcon}></i>
                  </div>
                  <h3 className="tier-mandate-title">{plan.name}</h3>
                </div>

                {/* ROW 3: Operational Volume Tag (Locked Height, Single Line) */}
                <div className="tier-volume-container">
                  <div className="tier-volume-tag">
                    <i className={plan.volumeIcon}></i>
                    <span>{plan.volumeChip}</span>
                  </div>
                </div>

                {/* ROW 4: Target Legal Entity Description (Locked Height) */}
                <div className="tier-target-container">
                  <p className="tier-target-copy">{plan.target}</p>
                </div>

                {/* ROW 5: Price Container (Locked Height & Synchronized Baseline) */}
                <div className="tier-pricing-container">
                  <div className="tier-discount-row">
                    {showDiscount ? (
                      <>
                        <span className="tier-struck-rate">₹{plan.price.toLocaleString('en-IN')}/mo</span>
                        <span className="tier-save-tag"><i className="fas fa-tag"></i> Save 18%</span>
                      </>
                    ) : tabIsMonthly ? (
                      <>
                        <span className="tier-cadence-subtle">Standard Monthly Retainer</span>
                        <span className="tier-save-tag tier-tag-standard">Standard</span>
                      </>
                    ) : (
                      <>
                        <span className="tier-cadence-subtle">Turnkey Formation Desk</span>
                        <span className="tier-save-tag tier-tag-allinclusive">All-Inclusive</span>
                      </>
                    )}
                  </div>

                  <div className="tier-price-row">
                    <div className="tier-price-main">
                      <span className="tier-currency-glyph">₹</span>
                      <span className="tier-amount-digits">{tabPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="tier-cadence-label">
                      /{tabIsMonthly ? (billingCycle === 'annual' ? 'mo (annual)' : 'mo') : 'one-time'}
                    </span>
                  </div>
                </div>

                {/* ROW 6: Bottom Unified Interactive Action Button */}
                <div className="tier-footer-action">
                  {isSelected ? (
                    <div className="tier-action-btn active-btn">
                      <i className="fas fa-circle-check"></i>
                      <span>Viewing Scope Below</span>
                      <i className="fas fa-arrow-down active-bounce-arrow"></i>
                    </div>
                  ) : (
                    <div className="tier-action-btn idle-btn">
                      <span>Inspect Mandate</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Retainer Specification Docket */}
        <div className={`retainers-specification-docket ${activePlan.tierClass || 'tier-card-gold'}`}>
          <div className="docket-top-accent-bar" aria-hidden="true"></div>

          <div className="docket-inner-layout">
            {/* Left Column: Scope Overview, Pricing & Execution Actions */}
            <div className="docket-overview-column">
              <div className="docket-meta-row">
                <div className="docket-tier-pill">
                  <span className="docket-code-badge">{activePlan.code}</span>
                  <span className="docket-status-text">{activePlan.badge}</span>
                </div>
                {activePlan.roiBadge && (
                  <span className="docket-roi-badge">{activePlan.roiBadge}</span>
                )}
              </div>

              <h3 className="docket-mandate-title">{activePlan.name}</h3>
              <div className="docket-target-badge">
                <i className="fas fa-building"></i>
                <span>{activePlan.target}</span>
              </div>

              <p className="docket-summary-statement">{activePlan.summary}</p>

              {/* Commercial Retainer Specification Box */}
              <div className="docket-price-spec-block">
                <div className="docket-price-spec-header">
                  <span className="docket-spec-label">Statutory Retainer Engagement</span>
                  {isAnnualMode ? (
                    <span className="docket-save-pill"><i className="fas fa-tag"></i> 18% Committed Savings</span>
                  ) : (
                    <span className="docket-save-pill neutral-pill">Standard Monthly Mandate</span>
                  )}
                </div>

                {isAnnualMode && (
                  <div className="docket-strikethrough-line">
                    <span className="docket-struck-label">Standard Monthly Rate:</span>
                    <span className="docket-struck-number">₹{originalPrice.toLocaleString('en-IN')}/mo</span>
                  </div>
                )}

                <div className="docket-price-headline">
                  <div className="docket-price-amount">
                    <span className="price-symbol">₹</span>
                    <span className="price-number">{currentPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="price-cadence">
                    /{isAnnualMode ? 'mo (billed annually)' : activePlan.period === 'month' ? 'month' : 'one-time setup'}
                  </span>
                </div>

                {isAnnualMode && annualSavings > 0 && (
                  <div className="docket-savings-callout">
                    <i className="fas fa-shield-halved"></i>
                    <span>Annual mandate preserves ₹{annualSavings.toLocaleString('en-IN')} in working capital</span>
                  </div>
                )}

                <div className="docket-scope-guarantee">
                  <i className="fas fa-lock"></i>
                  <span>Scope-locked statutory engagement &bull; Zero surprise surcharges</span>
                </div>
              </div>

              {/* Retainer Action Buttons */}
              <div className="docket-action-buttons">
                <button
                  type="button"
                  className="btn-docket-execute"
                  onClick={() => handleSelectPlan(activePlan.name)}
                >
                  <span>{activePlan.ctaText}</span>
                  <i className="fas fa-arrow-right"></i>
                </button>

                <button
                  type="button"
                  className="btn-docket-whatsapp"
                  onClick={handleWhatsAppQuote}
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>Consult CA Partner on WhatsApp</span>
                </button>
              </div>

              {/* Compliance Assurance Points */}
              <div className="docket-assurances-list">
                <div className="assurance-bullet">
                  <div className="assurance-icon-box">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <span>Direct oversight by qualified Chartered Accountant (FCA)</span>
                </div>
                <div className="assurance-bullet">
                  <div className="assurance-icon-box">
                    <i className="fas fa-vault"></i>
                  </div>
                  <span>ISO 27001-compliant 256-bit encrypted document repository</span>
                </div>
                <div className="assurance-bullet">
                  <div className="assurance-icon-box">
                    <i className="fas fa-scale-balanced"></i>
                  </div>
                  <span>Section 143(1) and routine departmental scrutiny defense included</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Disciplines Statutory Scope Grid */}
            <div className="docket-scope-column">
              <div className="docket-scope-header">
                <div className="scope-header-left">
                  <div className="scope-header-icon-box">
                    <i className="fas fa-clipboard-check"></i>
                  </div>
                  <div>
                    <h4 className="scope-heading">Statutory Scope &amp; Certified Mandate Deliverables</h4>
                    <p className="scope-subtext">Four core disciplines governed under strict ICAI regulatory standards</p>
                  </div>
                </div>
                <span className="icai-standards-badge">
                  <i className="fas fa-award"></i> ICAI Review Standard
                </span>
              </div>

              <div className="docket-disciplines-grid">
                {activePlan.scopeCategories.map((cat, idx) => (
                  <div key={idx} className="discipline-card">
                    <div className="discipline-header">
                      <span className="discipline-index">0{idx + 1}</span>
                      <h5 className="discipline-name">{cat.discipline}</h5>
                    </div>

                    <ul className="discipline-items-list">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="discipline-item">
                          <i className="fas fa-circle-check"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Retainer Scope & Volume Estimator */}
        <div className="retainers-scope-estimator-box">
          <div className="estimator-header">
            <div className="estimator-title-group">
              <div className="estimator-tag-pill">
                <i className="fas fa-sliders" aria-hidden="true"></i>
                <span>SCOPE CALIBRATION DESK</span>
              </div>
              <h3 className="estimator-heading">Calculate Your Ideal Compliance Mandate</h3>
              <p className="estimator-sub">
                Select your legal entity charter and monthly invoice volume for an instant statutory tier recommendation.
              </p>
            </div>

            <div
              className="estimator-recommendation-card"
              onClick={() => setSelectedPlanKey(recommendedKey)}
              title="Click to focus this mandate in docket"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedPlanKey(recommendedKey);
                }
              }}
            >
              <div className="rec-card-header">
                <span className="rec-verified-dot" aria-hidden="true"></span>
                <span className="rec-label">CALIBRATED MANDATE MATCH</span>
              </div>
              <div className="rec-card-body">
                <span className="rec-tier-badge">{dynamicPlans[recommendedKey].code}</span>
                <h4 className="rec-plan-name">{dynamicPlans[recommendedKey].name}</h4>
              </div>
              <div className="rec-card-footer">
                <span className="rec-sync-status">
                  <i className="fas fa-circle-check" aria-hidden="true"></i>
                  <span>Active in Specification Docket</span>
                </span>
                <i className="fas fa-arrow-up-right-from-square rec-action-icon" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <div className="estimator-controls-grid">
            <div className="estimator-control-group">
              <div className="control-label-row">
                <span className="control-step-badge">1</span>
                <label className="control-label">Corporate Structure & Legal Form</label>
              </div>
              <div className="control-button-group">
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorType === 'prop' ? 'active' : ''}`}
                  onClick={() => handleEstimatorTypeClick('prop')}
                  aria-pressed={estimatorType === 'prop'}
                >
                  <i className="fas fa-user-tie btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">Proprietorship / Freelancer</span>
                  {estimatorType === 'prop' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorType === 'pvt_ltd' ? 'active' : ''}`}
                  onClick={() => handleEstimatorTypeClick('pvt_ltd')}
                  aria-pressed={estimatorType === 'pvt_ltd'}
                >
                  <i className="fas fa-building btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">Pvt Ltd / LLP / Active MSME</span>
                  {estimatorType === 'pvt_ltd' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorType === 'enterprise' ? 'active' : ''}`}
                  onClick={() => handleEstimatorTypeClick('enterprise')}
                  aria-pressed={estimatorType === 'enterprise'}
                >
                  <i className="fas fa-network-wired btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">Turnover &gt; ₹5 Cr / Multi-State</span>
                  {estimatorType === 'enterprise' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
              </div>
            </div>

            <div className="estimator-control-group">
              <div className="control-label-row">
                <span className="control-step-badge">2</span>
                <label className="control-label">Monthly Transaction & Invoicing Volume</label>
              </div>
              <div className="control-button-group">
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'low' ? 'active' : ''}`}
                  onClick={() => handleEstimatorVolumeClick('low')}
                  aria-pressed={estimatorVolume === 'low'}
                >
                  <i className="fas fa-file-invoice btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">Up to 50 Invoices</span>
                  {estimatorVolume === 'low' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'medium' ? 'active' : ''}`}
                  onClick={() => handleEstimatorVolumeClick('medium')}
                  aria-pressed={estimatorVolume === 'medium'}
                >
                  <i className="fas fa-receipt btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">50 – 150 Invoices</span>
                  {estimatorVolume === 'medium' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'high' ? 'active' : ''}`}
                  onClick={() => handleEstimatorVolumeClick('high')}
                  aria-pressed={estimatorVolume === 'high'}
                >
                  <i className="fas fa-chart-line btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">150 – 500 Invoices</span>
                  {estimatorVolume === 'high' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'enterprise' ? 'active' : ''}`}
                  onClick={() => handleEstimatorVolumeClick('enterprise')}
                  aria-pressed={estimatorVolume === 'enterprise'}
                >
                  <i className="fas fa-city btn-icon" aria-hidden="true"></i>
                  <span className="btn-text">500+ / Multi-Branch</span>
                  {estimatorVolume === 'enterprise' && <i className="fas fa-circle-check active-indicator" aria-hidden="true"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Universal Statutory Retainer Safeguards Strip */}
        <div className="retainers-safeguards-strip">
          <div className="safeguard-strip-card safeguard-card-emerald">
            <div className="safeguard-card-header">
              <div className="safeguard-strip-icon">
                <i className="fas fa-shield-halved" aria-hidden="true"></i>
              </div>
              <span className="safeguard-badge">
                <i className="fas fa-certificate" aria-hidden="true"></i> SLA 100%
              </span>
            </div>
            <div className="safeguard-card-body">
              <h4 className="safeguard-heading">Zero-Penalty Guarantee</h4>
              <p className="safeguard-description">
                100% on-time statutory filing promise across GST and Direct Taxes under legal firm indemnity.
              </p>
            </div>
            <div className="safeguard-card-footer">
              <i className="fas fa-circle-check" aria-hidden="true"></i>
              <span>100% Audit Indemnity</span>
            </div>
          </div>

          <div className="safeguard-strip-card safeguard-card-gold">
            <div className="safeguard-card-header">
              <div className="safeguard-strip-icon">
                <i className="fas fa-user-check" aria-hidden="true"></i>
              </div>
              <span className="safeguard-badge">
                <i className="fas fa-scale-balanced" aria-hidden="true"></i> FCA REVIEW
              </span>
            </div>
            <div className="safeguard-card-body">
              <h4 className="safeguard-heading">Dual Partner Oversight</h4>
              <p className="safeguard-description">
                Every calculation and return undergoes strict two-tier verification by a senior FCA Partner.
              </p>
            </div>
            <div className="safeguard-card-footer">
              <i className="fas fa-circle-check" aria-hidden="true"></i>
              <span>Four-Eye CA Protocol</span>
            </div>
          </div>

          <div className="safeguard-strip-card safeguard-card-sapphire">
            <div className="safeguard-card-header">
              <div className="safeguard-strip-icon">
                <i className="fas fa-lock" aria-hidden="true"></i>
              </div>
              <span className="safeguard-badge">
                <i className="fas fa-database" aria-hidden="true"></i> SEC 128
              </span>
            </div>
            <div className="safeguard-card-body">
              <h4 className="safeguard-heading">Bank-Grade Vault Custody</h4>
              <p className="safeguard-description">
                Section 128 mandatory 8-year statutory archive with 256-bit cryptographic retention.
              </p>
            </div>
            <div className="safeguard-card-footer">
              <i className="fas fa-circle-check" aria-hidden="true"></i>
              <span>8-Year MCA Retention</span>
            </div>
          </div>

          <div className="safeguard-strip-card safeguard-card-amethyst">
            <div className="safeguard-card-header">
              <div className="safeguard-strip-icon">
                <i className="fas fa-file-invoice" aria-hidden="true"></i>
              </div>
              <span className="safeguard-badge">
                <i className="fas fa-receipt" aria-hidden="true"></i> FULL ITC
              </span>
            </div>
            <div className="safeguard-card-body">
              <h4 className="safeguard-heading">18% GST Input Credit</h4>
              <p className="safeguard-description">
                Full tax-compliant B2B invoices allowing 100% seamless ITC recovery on your monthly portal.
              </p>
            </div>
            <div className="safeguard-card-footer">
              <i className="fas fa-circle-check" aria-hidden="true"></i>
              <span>GSTR-2B Auto-Reconciled</span>
            </div>
          </div>
        </div>

        {/* Bespoke Enterprise Multi-State RFP Banner */}
        <div className="retainers-custom-rfp-banner">
          {/* Architectural Ambient Glows & Watermark */}
          <div className="rfp-glow-orb rfp-glow-orb-top" aria-hidden="true"></div>
          <div className="rfp-glow-orb rfp-glow-orb-bottom" aria-hidden="true"></div>
          <div className="rfp-watermark-icon" aria-hidden="true">
            <i className="fas fa-landmark"></i>
          </div>

          <div className="rfp-banner-content">
            <div className="rfp-banner-text">
              <div className="rfp-prestige-badge">
                <span className="rfp-pulse-dot" aria-hidden="true"></span>
                <i className="fas fa-briefcase" aria-hidden="true"></i>
                <span>EXECUTIVE DESK &bull; CONFIDENTIAL PARTNER CONSULTATION</span>
              </div>

              <h3 className="rfp-title">
                Require a <span className="rfp-gold-gradient">Multi-State GST Retainer</span> or Section 44AB Tax Audit?
              </h3>

              <p className="rfp-description">
                We engineer tailor-made statutory retainers for manufacturing plants, export-oriented units, hospitality chains, and multi-entity holding groups across Gujarat and Maharashtra.
              </p>

              <div className="rfp-pillars-strip">
                <div className="rfp-pillar-item">
                  <i className="fas fa-network-wired" aria-hidden="true"></i>
                  <span>Multi-GSTIN & Multi-Branch Audits</span>
                </div>
                <div className="rfp-pillar-item">
                  <i className="fas fa-user-shield" aria-hidden="true"></i>
                  <span>Direct Senior Partner Line</span>
                </div>
                <div className="rfp-pillar-item">
                  <i className="fas fa-file-contract" aria-hidden="true"></i>
                  <span>Mutual NDA & Conflict Check</span>
                </div>
              </div>
            </div>

            <div className="rfp-banner-actions">
              <Link to="/contact" className="btn-rfp-primary">
                <div className="btn-rfp-primary-content">
                  <i className="fas fa-file-signature"></i>
                  <span>Request Custom Retainer RFP</span>
                </div>
                <i className="fas fa-arrow-right btn-rfp-arrow" aria-hidden="true"></i>
              </Link>

              <button type="button" className="btn-rfp-secondary" onClick={handleWhatsAppQuote}>
                <i className="fab fa-whatsapp"></i>
                <span>Consult Senior Partner</span>
              </button>

              <div className="rfp-action-note">
                <i className="fas fa-clock" aria-hidden="true"></i>
                <span>Formal proposal delivered within 24 business hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
