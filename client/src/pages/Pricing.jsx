import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { getPricing, submitContact } from '../api';
import useFetch from '../hooks/useFetch';
import './Pricing.css';

const STATUTORY_RETAINER_TIERS = [
  {
    id: 'starter',
    code: 'TIER 01',
    roman: 'I',
    name: 'Foundational Practice Retainer',
    target: 'Sole Proprietors, Freelancers & Emerging MSMEs',
    priceMonthly: 2999,
    priceAnnual: 2499,
    tierClass: 'tier-card-emerald',
    volumeTag: 'Up to 50 Transactions / Month',
    volumeIcon: 'fas fa-receipt',
    badge: 'FOUNDATIONAL STATUTORY',
    roiBadge: '⏱️ Eliminates 15+ Hours Monthly',
    icon: 'fas fa-scale-unbalanced',
    summary:
      'Essential statutory accounting, monthly GST filings, advance tax forecasting, and year-end financial statement preparation engineered for proprietorships and independent practitioners.',
    disciplines: [
      {
        title: 'Bookkeeping & Banking',
        detail: 'Monthly bookkeeping up to 50 vouchers with automated bank ledger reconciliation.',
      },
      {
        title: 'GST & Indirect Taxes',
        detail: 'Timely filing of GSTR-1 and GSTR-3B before 11th & 20th statutory deadlines.',
      },
      {
        title: 'Direct Tax Forecasting',
        detail: 'Quarterly Advance Tax calculation (Sec 208/211) & 26AS/AIS credit cross-check.',
      },
      {
        title: 'Year-End Compilation',
        detail: 'Drafting of Balance Sheet, Profit & Loss statement, and Form ITR-3/ITR-4 filing.',
      },
      {
        title: 'Vault & Written SLA',
        detail: '256-Bit encrypted Client Vault access with guaranteed 24-hour query turnaround.',
      },
    ],
    matrix: {
      entity: 'Sole Proprietorship / Independent',
      vouchers: 'Up to 50 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B)',
      itcMatching: 'Basic GSTR-2B Overview',
      advanceTaxTds: 'Quarterly Advance Tax Model',
      rocFilings: 'Not Applicable',
      noticeDefense: 'Section 143(1) Advisory Review',
      partnerSla: '< 24 Hours Written Response',
    },
    ctaText: 'Retain Foundational Desk',
    serviceInterest: 'Foundational Practice Retainer (₹2,499/mo)',
  },
  {
    id: 'growth',
    code: 'TIER 02',
    roman: 'II',
    name: 'Corporate & MSME Statutory Retainer',
    target: 'Private Limited Companies, Active LLPs & Trading MSMEs',
    priceMonthly: 5999,
    priceAnnual: 4999,
    tierClass: 'tier-card-gold',
    isPopular: true,
    volumeTag: 'Up to 150 Transactions / Month',
    volumeIcon: 'fas fa-layer-group',
    badge: 'THE FIRM BENCHMARK • MOST RETAINED',
    roiBadge: '💰 Recovers ~₹1.2L+ Blocked ITC',
    icon: 'fas fa-building-columns',
    summary:
      'Complete accounting outsourcing, deep algorithmic GSTR-2B input tax matching, quarterly TDS returns, annual ROC secretarial compliance, and direct Senior CA partner oversight.',
    disciplines: [
      {
        title: 'Full Ledger Outsourcing',
        detail: 'Ledger curation up to 150 vouchers/mo across multi-bank & gateway transactions.',
      },
      {
        title: 'Forensic GSTR-2B Matching',
        detail: 'Algorithmic vendor invoice reconciliation to eliminate input tax credit leakage.',
      },
      {
        title: 'Quarterly TDS & Form 16',
        detail: 'Form 24Q (Salary) & 26Q (Vendor) return filings with automated certificate issuance.',
      },
      {
        title: 'Annual ROC Compliance',
        detail: 'Mandatory MCA filing: Form AOC-4, MGT-7 drafting and Director DIR-3 KYC.',
      },
      {
        title: 'Statutory Notice Defense',
        detail: 'ASMT-10, DRC-01, and routine departmental scrutiny rejoinder drafting included.',
      },
      {
        title: 'Priority Partner Desk',
        detail: 'Designated Senior Chartered Accountant with priority WhatsApp desk (< 4h SLA).',
      },
    ],
    matrix: {
      entity: 'Pvt Ltd, LLP, Active MSME Trader',
      vouchers: 'Up to 150 / Month',
      gstFilings: 'Monthly (GSTR-1 & 3B) + IFF',
      itcMatching: 'Forensic Algorithmic Matching',
      advanceTaxTds: 'Quarterly 24Q/26Q TDS + Form 16',
      rocFilings: 'Form AOC-4, MGT-7 & DIR-3 KYC',
      noticeDefense: 'ASMT-10, DRC-01 & 143(1) Defense',
      partnerSla: 'Priority WhatsApp Desk (< 4 Hours)',
    },
    ctaText: 'Retain Corporate Mandate',
    serviceInterest: 'Corporate & MSME Statutory Retainer (₹4,999/mo)',
  },
  {
    id: 'cfo',
    code: 'TIER 03',
    roman: 'III',
    name: 'Enterprise & Multi-State Retainer',
    target: 'Multi-Branch Corporates, Factories & Turnover > ₹5 Cr',
    priceMonthly: 24999,
    priceAnnual: 20999,
    tierClass: 'tier-card-sapphire',
    volumeTag: 'Uncapped Multi-Branch Transactions',
    volumeIcon: 'fas fa-network-wired',
    badge: 'ENTERPRISE AUDIT & CFO',
    roiBadge: '🛡️ 100% Tax Audit Defense Coverage',
    icon: 'fas fa-shield-halved',
    summary:
      'Turnkey executive financial leadership, corporate ITR-6 direct tax filing, Section 44AB statutory tax audit defense, multi-GSTIN cross-state consolidations, and ITAT appellate representation.',
    disciplines: [
      {
        title: 'Virtual CFO Leadership',
        detail: 'Monthly Executive Board MIS, cashflow forecasting, and working capital modeling.',
      },
      {
        title: 'Multi-State GST Consolidation',
        detail: 'Cross-state GSTIN reconciliation, cross-charge review, and GSTR-9/9C annual audit.',
      },
      {
        title: 'Section 44AB Tax Audit',
        detail: 'Statutory direct tax audit execution, Form 3CD compilation, and corporate ITR-6.',
      },
      {
        title: 'Appellate Notice Defense',
        detail: 'CIT(Appeals), ITAT, and Revisional Bench legal rejoinders and representation.',
      },
      {
        title: 'Secretarial & Board Governance',
        detail: 'Drafting Board meeting minutes, share transfers, and statutory register custody.',
      },
      {
        title: 'Dedicated Senior Partner',
        detail: 'Exclusive FCA Partner assigned with direct boardroom consultation access.',
      },
    ],
    matrix: {
      entity: 'Multi-State Corp, Factory, Group Holding',
      vouchers: 'Uncapped Enterprise Volume',
      gstFilings: 'Multi-State Consolidated GSTINs',
      itcMatching: 'Forensic Vendor Recovery & Audit',
      advanceTaxTds: 'Full Corporate TDS & Section 194R/Q',
      rocFilings: 'Complete Secretarial & Board Registers',
      noticeDefense: 'CIT(A), ITAT & Appellate Benches',
      partnerSla: 'Dedicated Senior Partner Assigned',
    },
    ctaText: 'Engage Enterprise Retainer',
    serviceInterest: 'Enterprise & Multi-State Retainer (₹20,999/mo)',
  },
  {
    id: 'incorporation',
    code: 'TIER 04',
    roman: 'IV',
    name: 'Turnkey Corporate Incorporation Retainer',
    target: 'New Startups, Foreign Subsidiaries & Expanding Ventures',
    priceMonthly: 49999,
    priceAnnual: 49999,
    tierClass: 'tier-card-amethyst',
    isOneTime: true,
    volumeTag: 'Complete Turnkey Entity Formation',
    volumeIcon: 'fas fa-bolt',
    badge: 'ONE-TIME STATUTORY FORMATION',
    roiBadge: '⚡ 5–7 Day Guaranteed Entity Incorporation',
    icon: 'fas fa-stamp',
    summary:
      'Complete legal entity formation under MCA SPICe+, 2 Class-3 USB cryptographic DSCs, DINs, PAN/TAN, DPIIT 80-IAC startup tax holiday filing, and complimentary 60-day post-incorporation advisory desk.',
    disciplines: [
      {
        title: 'SPICe+ Incorporation',
        detail: 'MCA RUN name approval, MoA/AoA drafting, stamp duty & certificate of incorporation.',
      },
      {
        title: 'Cryptographic Credentials',
        detail: '2 Class-3 USB cryptographic DSC tokens & 2 Director Identification Numbers (DINs).',
      },
      {
        title: 'Tax Registrations',
        detail: 'Corporate PAN, TAN, GSTIN, and Gujarat Professional Tax employer registrations.',
      },
      {
        title: 'Startup 80-IAC Holiday',
        detail: 'DPIIT Startup India certification facilitating 3-year Section 80-IAC tax exemption.',
      },
      {
        title: 'Banking & Board Protocol',
        detail: 'Zero-balance corporate current account opening + First Board Meeting minutes.',
      },
      {
        title: 'Complimentary Advisory Desk',
        detail: '60 Days of complimentary post-formation compliance review by senior CA.',
      },
    ],
    matrix: {
      entity: 'New Pvt Ltd / LLP / OPC Venture',
      vouchers: 'Setup Phase Governance Included',
      gstFilings: 'GSTIN Registration Included',
      itcMatching: 'Pre-Incorporation Asset Credit',
      advanceTaxTds: 'TAN Allotment & Deductor Setup',
      rocFilings: 'SPICe+, MoA, AoA & Statutory Registers',
      noticeDefense: 'Zero-Defect Filing Guarantee',
      partnerSla: 'Founder Structuring Strategy Call',
    },
    ctaText: 'Incorporate Your Entity',
    serviceInterest: 'Turnkey Corporate Incorporation (₹49,999)',
  },
];

const PRICING_FAQS = [
  {
    q: 'How do you delineate government statutory challans from professional retainer fees?',
    a: 'We practice absolute fiduciary transparency under ICAI ethics. Government portal fees (such as actual GST cash liability, MCA portal filing fees, or income tax challans) are paid directly through government payment gateways or billed at actual treasury challan receipts. Our professional retainer fee is strictly fixed and scope-locked, eliminating arbitrary surcharges.',
  },
  {
    q: 'Can our firm upgrade or scale retainers as our transaction volume grows?',
    a: 'Yes, seamlessly. Many Ahmedabad and Gujarat ventures begin on our Foundational tier and transition to Corporate Retainer or Virtual CFO as monthly sales volumes, branch locations, and vendor registers expand. Mid-year transitions are pro-rated without any onboarding friction or disruption to ongoing statutory filing continuity.',
  },
  {
    q: 'What is included in the Statutory Notice Defense coverage?',
    a: 'Clients on our Corporate and Enterprise retainers receive routine department notice defense covered under their scope. When an automated scrutiny inquiry, Section 143(1) intimation, ASMT-10 mismatch notice, or DRC-01 show-cause notice is issued, our senior CAs draft the legal rejoinder, reconcile purchase registers, and represent your firm at no extra emergency surcharge.',
  },
  {
    q: 'How does your Virtual CFO retainer compare to an in-house full-time CFO?',
    a: 'A seasoned full-time CFO commands ₹25L–₹40L+ annually plus equity, bonuses, and severance overhead. Our Virtual CFO desk provides institutional partner-level financial leadership, cashflow modeling, Section 44AB audit representation, and board-level MIS reporting for a predictable fraction of the cost, backed by a multidisciplinary team of CAs, CSs, and tax advocates.',
  },
  {
    q: 'Do you execute a mutual Non-Disclosure Agreement (NDA) before inspecting our books?',
    a: 'Yes, unconditionally. Prior to onboarding, client data ingestion, or portal credential exchange, we execute a legally binding Mutual Non-Disclosure Agreement (NDA). All accounting data, bank statements, and tax records are stored in ISO 27001-compliant, 256-bit AES encrypted repositories in accordance with Section 128 of the Companies Act.',
  },
  {
    q: 'Can we claim 18% GST Input Tax Credit (ITC) on your retainer invoices?',
    a: 'Yes. Shree Chamunda Associates issues fully compliant GST tax invoices for all retainer mandates. Corporates, LLPs, and registered GST entities can claim 100% of the 18% GST charged on our professional fees as Input Tax Credit against their business output liability.',
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { data: response } = useFetch(getPricing);

  // Commitment toggle: Monthly vs Annual Mandate
  const [billingCycle, setBillingCycle] = useState('annual');
  const [openFaq, setOpenFaq] = useState(0);

  // Active highlighted tier in the interactive selector
  const [activeTierId, setActiveTierId] = useState('growth');

  // Interactive Scope Estimator State
  const [estimatorEntity, setEstimatorEntity] = useState('pvt_ltd'); // 'prop' | 'pvt_ltd' | 'enterprise'
  const [estimatorVolume, setEstimatorVolume] = useState('medium'); // 'low' | 'medium' | 'high' | 'enterprise'

  // Dynamic Tiers mapping with database fallback
  const dynamicTiers = useMemo(() => {
    if (!response?.data || !Array.isArray(response.data) || response.data.length === 0) {
      return STATUTORY_RETAINER_TIERS;
    }
    return STATUTORY_RETAINER_TIERS.map((tier) => {
      const dbMatch = response.data.find((p) => {
        const lower = (p.name || '').toLowerCase();
        if (tier.id === 'incorporation' && (lower.includes('incorporat') || lower.includes('turnkey'))) return true;
        if (tier.id === 'cfo' && (lower.includes('enterprise') || lower.includes('cfo') || lower.includes('premium'))) return true;
        if (tier.id === 'growth' && (lower.includes('corporate') || lower.includes('msme') || lower.includes('growth') || lower.includes('standard'))) return true;
        if (tier.id === 'starter' && (lower.includes('foundational') || lower.includes('basic') || lower.includes('starter'))) return true;
        return false;
      });

      if (dbMatch && typeof dbMatch.price === 'number') {
        const annual =
          tier.id === 'starter' ? 2499 :
          tier.id === 'growth' ? 4999 :
          tier.id === 'cfo' ? 20999 :
          dbMatch.price;

        return {
          ...tier,
          priceMonthly: dbMatch.price,
          priceAnnual: annual,
        };
      }
      return tier;
    });
  }, [response]);

  // Custom Proposal Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    planInterest: 'Corporate & MSME Statutory Retainer',
    monthlyInvoices: '50-150',
    accountingSoftware: 'Tally Prime',
    notes: '',
  });
  const [quoteStatus, setQuoteStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Statutory Retainers & Corporate Governance Mandates | Shree Chamunda Associates',
    description:
      'Predictable, scope-locked Chartered Accountancy retainers for Indian Proprietorships, LLPs, Private Limited Companies, and High-Turnover Multi-Branch Conglomerates.',
  });

  // Calculate recommendation based on estimator controls
  const recommendedTier = useMemo(() => {
    if (estimatorEntity === 'prop' && estimatorVolume === 'low') {
      return dynamicTiers.find((t) => t.id === 'starter');
    }
    if (estimatorEntity === 'enterprise' || estimatorVolume === 'enterprise' || estimatorVolume === 'high') {
      return dynamicTiers.find((t) => t.id === 'cfo');
    }
    return dynamicTiers.find((t) => t.id === 'growth');
  }, [estimatorEntity, estimatorVolume, dynamicTiers]);

  const handleSelectTier = (tier) => {
    const cycleSuffix =
      billingCycle === 'annual' && !tier.isOneTime
        ? ' (Annual Retainer Mandate)'
        : tier.isOneTime
        ? ' (One-Time Formation Mandate)'
        : ' (Monthly Retainer Mandate)';
    navigate('/contact', {
      state: {
        planName: `${tier.name}${cycleSuffix}`,
        serviceInterest: tier.serviceInterest,
      },
    });
  };

  const handleWhatsAppDesk = (tier) => {
    const isAnnual = billingCycle === 'annual' && !tier.isOneTime;
    const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
    const periodLabel = isAnnual ? 'mo (billed annually)' : tier.isOneTime ? 'one-time' : 'mo';
    const text = `Hello Shree Chamunda Associates, I would like to consult regarding the ${tier.name} (₹${price.toLocaleString('en-IN')}/${periodLabel}) for our statutory compliance mandate.`;
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteStatus({ loading: true, success: false, error: null });
    try {
      await submitContact({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        subject: `Corporate Retainer Mandate Request: ${quoteForm.planInterest} (${quoteForm.company})`,
        message: `Entity Name: ${quoteForm.company}\nPlan Mandate: ${quoteForm.planInterest}\nMonthly Invoice Volume: ${quoteForm.monthlyInvoices}\nAccounting Software: ${quoteForm.accountingSoftware}\nSpecific Requirements: ${quoteForm.notes}`,
        serviceInterest: quoteForm.planInterest,
      });
      setQuoteStatus({ loading: false, success: true, error: null });
      setQuoteForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        planInterest: 'Corporate & MSME Statutory Retainer',
        monthlyInvoices: '50-150',
        accountingSoftware: 'Tally Prime',
        notes: '',
      });
    } catch (err) {
      setQuoteStatus({
        loading: false,
        success: false,
        error: err.message || 'Failed to submit mandate request. Please contact our CA desk directly.',
      });
    }
  };

  return (
    <div className="pricing-page fade-in">
      {/* 1. HERO BANNER — Chambers Architectural Dignity */}
      <section className="pricing-hero" aria-labelledby="pricing-hero-title">
        <div className="retainers-top-accent-line" aria-hidden="true"></div>
        <div className="pricing-pinstripe-overlay" aria-hidden="true"></div>

        <div className="container pricing-hero-content">
          <div className="pricing-hero-badge">
            <span className="retainers-live-dot" aria-hidden="true"></span>
            <i className="fas fa-landmark"></i>
            <span>ICAI ADVISORY STANDARDS // SCOPE-LOCKED STATUTORY RETAINERS</span>
          </div>

          <h1 id="pricing-hero-title">
            Predictable Retainers, <span className="title-burnished-gold">Absolute Precision.</span>
          </h1>

          <p className="pricing-hero-lead">
            Scope-locked Chartered Accountancy retainers governing direct tax, GST audit, ROC secretarial compliance,
            and scrutiny representation under ICAI regulatory ethics. Designed for ambitious Indian enterprises with zero billing surprises.
          </p>

          {/* Institutional Fiscal Commitment Switcher */}
          <div className="billing-switch-wrapper">
            <div className="billing-switch-pill" role="radiogroup" aria-label="Retainer Commitment Frequency">
              <button
                type="button"
                className={`switch-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
                aria-checked={billingCycle === 'monthly'}
              >
                <span>Monthly Retainer</span>
              </button>

              <button
                type="button"
                className={`switch-btn ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
                aria-checked={billingCycle === 'annual'}
              >
                <span>Annual Statutory Mandate</span>
                <span className="save-badge">Save 18% &bull; 2 Mo Complimentary</span>
              </button>
            </div>

            <span className="billing-tax-footnote">
              <i className="fas fa-receipt text-emerald"></i> 100% Tax Invoiced &bull; Corporate clients claim 18% GST Input Tax Credit back
            </span>
          </div>

          {/* Trust Safeguards Bar */}
          <div className="hero-trust-safeguards-bar">
            <div className="trust-bar-item">
              <i className="fas fa-shield-halved"></i>
              <span>Zero-Penalty Filing Guarantee</span>
            </div>
            <div className="trust-bar-item">
              <i className="fas fa-user-check"></i>
              <span>Two-Tier Senior CA Review</span>
            </div>
            <div className="trust-bar-item">
              <i className="fas fa-vault"></i>
              <span>256-Bit Encrypted Client Vault</span>
            </div>
            <div className="trust-bar-item">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>18% GST Input Tax Credit Claimable</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY RETAINER TIERS CARDS */}
      <main className="container pricing-cards-section">
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-layer-group"></i>
            <span>FOUR STATUTORY MANDATES</span>
          </span>
          <h2>Institutional Retainer Tiers</h2>
          <p className="section-subtext">
            Every mandate is scope-locked with explicit deliverables, statutory due-date coverage, and designated CA partner oversight.
          </p>
        </div>

        <div className="pricing-cards-grid">
          {dynamicTiers.map((tier) => {
            const isMonthlyTier = !tier.isOneTime;
            const isAnnualMode = billingCycle === 'annual' && isMonthlyTier;
            const currentPrice = isAnnualMode ? tier.priceAnnual : tier.priceMonthly;
            const originalPrice = tier.priceMonthly;
            const annualSavings = isMonthlyTier ? (originalPrice - currentPrice) * 12 : 0;

            return (
              <div
                key={tier.id}
                className={`statutory-plan-card ${tier.tierClass || ''} ${tier.isPopular ? 'benchmark-card' : ''} ${activeTierId === tier.id ? 'tier-selected' : ''}`}
                onClick={() => setActiveTierId(tier.id)}
              >
                {tier.isPopular && (
                  <div className="benchmark-ribbon-tag">
                    <i className="fas fa-star"></i> {tier.badge}
                  </div>
                )}

                <div className="plan-card-header">
                  <div className="plan-top-code-row">
                    <div className="plan-roman-box">{tier.roman}</div>
                    <span className="plan-code-label">{tier.code}</span>
                    <span className="plan-volume-tag">{tier.volumeTag}</span>
                  </div>

                  <h3 className="plan-name">{tier.name}</h3>
                  <span className="plan-target-entity">{tier.target}</span>
                </div>

                <div className="plan-price-block">
                  {isAnnualMode && (
                    <div className="plan-strikethrough-row">
                      <span className="struck-price">₹{originalPrice.toLocaleString('en-IN')}/mo</span>
                      <span className="savings-chip">Save 18%</span>
                    </div>
                  )}

                  <div className="price-num-row">
                    <span className="currency-symbol">₹</span>
                    <span className="price-amount">{currentPrice.toLocaleString('en-IN')}</span>
                    <span className="price-period">
                      /{tier.isOneTime ? 'one-time setup' : isAnnualMode ? 'mo (billed annually)' : 'month'}
                    </span>
                  </div>

                  {isAnnualMode && annualSavings > 0 && (
                    <div className="annual-savings-callout">
                      <i className="fas fa-check"></i> Preserves ₹{annualSavings.toLocaleString('en-IN')}/yr working capital
                    </div>
                  )}

                  <div className="roi-badge-wrap">
                    <span className="roi-chip">{tier.roiBadge}</span>
                  </div>
                </div>

                <p className="plan-summary-text">{tier.summary}</p>

                <div className="plan-disciplines-stack">
                  <span className="disciplines-header">Statutory Mandate Scope:</span>
                  {tier.disciplines.map((item, idx) => (
                    <div key={idx} className="plan-discipline-item">
                      <i className="fas fa-circle-check text-emerald"></i>
                      <div className="discipline-item-text">
                        <strong>{item.title}:</strong> {item.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="plan-card-actions">
                  <button
                    type="button"
                    className={`btn-plan-retain ${tier.isPopular ? 'btn-benchmark-action' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier);
                    }}
                  >
                    <span>{tier.ctaText}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    className="btn-plan-whatsapp"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppDesk(tier);
                    }}
                  >
                    <i className="fab fa-whatsapp"></i>
                    <span>WhatsApp Partner Desk</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. INTERACTIVE RETAINER SCOPE & VOLUME ESTIMATOR */}
      <section className="container estimator-section-container">
        <div className="retainers-scope-estimator-box">
          <div className="estimator-header">
            <div className="estimator-title-group">
              <span className="estimator-tag">INTERACTIVE SCOPE ESTIMATOR</span>
              <h3 className="estimator-heading">Calculate Your Ideal Compliance Mandate</h3>
              <p className="estimator-sub">
                Select your legal entity structure and monthly voucher scale to discover the optimal statutory tier.
              </p>
            </div>

            {recommendedTier && (
              <div className="estimator-recommendation-pill">
                <span className="rec-label">Recommended Mandate:</span>
                <span className="rec-plan-name">{recommendedTier.name}</span>
                <button
                  type="button"
                  className="btn-rec-select"
                  onClick={() => handleSelectTier(recommendedTier)}
                >
                  Retain This Mandate &rarr;
                </button>
              </div>
            )}
          </div>

          <div className="estimator-controls-grid">
            <div className="estimator-control-group">
              <label className="control-label">Legal Entity Structure:</label>
              <div className="control-button-group">
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorEntity === 'prop' ? 'active' : ''}`}
                  onClick={() => setEstimatorEntity('prop')}
                >
                  Proprietorship / Freelancer
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorEntity === 'pvt_ltd' ? 'active' : ''}`}
                  onClick={() => setEstimatorEntity('pvt_ltd')}
                >
                  Pvt Ltd / LLP / Active MSME
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorEntity === 'enterprise' ? 'active' : ''}`}
                  onClick={() => setEstimatorEntity('enterprise')}
                >
                  Turnover &gt; ₹5 Cr / Multi-State
                </button>
              </div>
            </div>

            <div className="estimator-control-group">
              <label className="control-label">Monthly Transaction Volume:</label>
              <div className="control-button-group">
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'low' ? 'active' : ''}`}
                  onClick={() => setEstimatorVolume('low')}
                >
                  Under 50 Vouchers
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'medium' ? 'active' : ''}`}
                  onClick={() => setEstimatorVolume('medium')}
                >
                  50 – 150 Vouchers
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'high' ? 'active' : ''}`}
                  onClick={() => setEstimatorVolume('high')}
                >
                  150 – 500 Vouchers
                </button>
                <button
                  type="button"
                  className={`control-pill-btn ${estimatorVolume === 'enterprise' ? 'active' : ''}`}
                  onClick={() => setEstimatorVolume('enterprise')}
                >
                  500+ / Multi-Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE SIDE-BY-SIDE STATUTORY DELIVERABLES MATRIX */}
      <section className="container pricing-matrix-section">
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-table-list"></i>
            <span>EXHAUSTIVE SCOPE SPECIFICATION</span>
          </span>
          <h2>Granular Statutory Scope Matrix</h2>
          <p className="section-subtext">
            Direct comparison of all 8 statutory dimensions across Foundational, Corporate, Enterprise, and Turnkey Incorporation retainers.
          </p>
        </div>

        <div className="matrix-table-wrapper">
          <table className="scope-comparison-table">
            <thead>
              <tr>
                <th className="col-deliverable">Statutory Compliance Dimension</th>
                <th>
                  <div className="th-tier-box">
                    <span className="th-tier-tag">TIER 01</span>
                    <strong>Foundational Retainer</strong>
                    <span className="th-tier-price">₹2,499/mo</span>
                  </div>
                </th>
                <th className="th-popular">
                  <div className="th-tier-box">
                    <span className="th-benchmark-badge">THE BENCHMARK</span>
                    <span className="th-tier-tag">TIER 02</span>
                    <strong>Corporate &amp; MSME Retainer</strong>
                    <span className="th-tier-price">₹4,999/mo</span>
                  </div>
                </th>
                <th>
                  <div className="th-tier-box">
                    <span className="th-tier-tag">TIER 03</span>
                    <strong>Enterprise Virtual CFO</strong>
                    <span className="th-tier-price">₹20,999/mo</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Target Business Structure</strong>
                  <span className="deliverable-desc">ICAI engagement charter classification</span>
                </td>
                <td>Sole Proprietorship / Independent</td>
                <td className="td-popular"><strong>Pvt Ltd, LLP, Trading / Mfg MSME</strong></td>
                <td>Multi-State Corp, Factory, Group Holding</td>
              </tr>

              <tr>
                <td>
                  <strong>Monthly Bookkeeping &amp; Vouchers</strong>
                  <span className="deliverable-desc">Ledger curation &amp; bank ledger reconciliation</span>
                </td>
                <td>Up to 50 Vouchers / Month</td>
                <td className="td-popular"><strong>Up to 150 Vouchers / Month</strong></td>
                <td><strong>Uncapped Enterprise Volume</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>GST Return Filings</strong>
                  <span className="deliverable-desc">GSTR-1 outward, GSTR-3B summary &amp; IFF</span>
                </td>
                <td>Monthly (GSTR-1 &amp; 3B)</td>
                <td className="td-popular"><strong>Monthly (GSTR-1 &amp; 3B) + Quarterly IFF</strong></td>
                <td><strong>Multi-State Consolidated GSTINs</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>Input Tax Credit (ITC) Recovery</strong>
                  <span className="deliverable-desc">Algorithmic GSTR-2B matching against purchases</span>
                </td>
                <td>Basic GSTR-2B Overview</td>
                <td className="td-popular"><strong>Deep Algorithmic ITC 2B Matching</strong></td>
                <td><strong>Forensic Vendor Recovery &amp; Audit</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>Direct Taxes &amp; Quarterly TDS</strong>
                  <span className="deliverable-desc">Sec 208 advance tax, 24Q/26Q returns &amp; Form 16</span>
                </td>
                <td>Quarterly Advance Tax Model</td>
                <td className="td-popular"><strong>Quarterly 24Q/26Q TDS + Form 16</strong></td>
                <td><strong>Full Corporate TDS &amp; Sec 194R/194Q</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>Corporate Secretarial &amp; MCA</strong>
                  <span className="deliverable-desc">Form AOC-4, MGT-7 &amp; Director DIR-3 KYC</span>
                </td>
                <td>Not Applicable</td>
                <td className="td-popular"><strong>Form AOC-4, MGT-7 &amp; DIR-3 KYC</strong></td>
                <td><strong>Complete Secretarial &amp; Board Registers</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>Notice Resolution &amp; Scrutiny Defense</strong>
                  <span className="deliverable-desc">ASMT-10, DRC-01, Sec 143(1) and ITAT benches</span>
                </td>
                <td>Section 143(1) Advisory Review</td>
                <td className="td-popular"><strong>ASMT-10, DRC-01 &amp; 143(1) Defense</strong></td>
                <td><strong>CIT(A), ITAT &amp; Appellate Benches</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>Designated Senior CA Partner SLA</strong>
                  <span className="deliverable-desc">Turnaround SLA and direct access protocol</span>
                </td>
                <td>&lt; 24h Written Response SLA</td>
                <td className="td-popular"><strong>Priority WhatsApp Desk (&lt; 4 Hours)</strong></td>
                <td><strong>Dedicated Senior FCA Partner Assigned</strong></td>
              </tr>

              <tr>
                <td>
                  <strong>18% GST Input Credit Recovery</strong>
                  <span className="deliverable-desc">Valid GST tax invoice issued for retainer fees</span>
                </td>
                <td><i className="fas fa-circle-check text-emerald"></i> Eligible for 18% ITC</td>
                <td className="td-popular"><i className="fas fa-circle-check text-emerald"></i> <strong>Eligible for 18% ITC</strong></td>
                <td><i className="fas fa-circle-check text-emerald"></i> Eligible for 18% ITC</td>
              </tr>

              <tr>
                <td>
                  <strong>256-Bit Digital Vault Custody</strong>
                  <span className="deliverable-desc">Companies Act Sec 128 mandatory 8-year archival</span>
                </td>
                <td>Standard Encrypted Vault</td>
                <td className="td-popular"><strong>Multi-User Corporate Vault</strong></td>
                <td><strong>Dedicated 24/7 Enterprise Archive</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CUSTOM ENTERPRISE QUOTE REQUEST SECTION */}
      <section className="container quote-request-section" id="custom-quote-section">
        <div className="quote-box-grid">
          <div className="quote-narrative-col">
            <span className="about-eyebrow-tag">
              <i className="fas fa-file-signature"></i>
              <span>BESPOKE RETAINER MANDATE</span>
            </span>
            <h2>Require a Custom Manufacturing or Multi-State Retainer?</h2>
            <p>
              For factories, chemical manufacturing units, export houses, and high-volume e-commerce conglomerates across
              Gujarat and Maharashtra, our senior partners prepare a scoped engagement letter aligned with your ERP and volume.
            </p>

            <div className="quote-trust-checks">
              <div className="trust-check-item">
                <i className="fas fa-circle-check text-emerald"></i>
                <span>Direct consultation with designated Senior Partner (FCA)</span>
              </div>
              <div className="trust-check-item">
                <i className="fas fa-circle-check text-emerald"></i>
                <span>Mutual Non-Disclosure Agreement (NDA) executed prior to books inspection</span>
              </div>
              <div className="trust-check-item">
                <i className="fas fa-circle-check text-emerald"></i>
                <span>Upfront fixed retainer with zero hidden portal surcharge fees</span>
              </div>
              <div className="trust-check-item">
                <i className="fas fa-circle-check text-emerald"></i>
                <span>Seamless integration with Tally Prime, SAP, Zoho Books, or Oracle</span>
              </div>
            </div>

            <div className="quote-contact-direct">
              <div className="direct-phone-icon">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div>
                <span className="direct-phone-kicker">Prefer speaking over the phone right now?</span>
                <strong className="direct-phone-num">
                  <a href="tel:+919510984735">+91 95109 84735</a>
                </strong>
                <span className="direct-phone-sub">Direct Partner Helpline &bull; Mon–Sat 10:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          <div className="quote-form-col">
            <div className="quote-form-card">
              <h3>Request Scope-Locked Retainer Proposal</h3>
              <p className="form-subtext">Our Senior CA Partner will review your volume and respond within 4 business hours.</p>

              {quoteStatus.success && (
                <div className="success-quote-banner">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Mandate Request Successfully Received!</strong>
                    <p>Our Senior Partner has received your submission and will contact your office shortly.</p>
                  </div>
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
                      placeholder="e.g. Rajesh Patel"
                      className="quote-input"
                    />
                  </div>
                  <div className="quote-input-group">
                    <label htmlFor="qCompany">Company / LLP / Firm Name *</label>
                    <input
                      type="text"
                      id="qCompany"
                      required
                      value={quoteForm.company}
                      onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                      placeholder="e.g. Apex Industrial Solutions LLP"
                      className="quote-input"
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="quote-input-group">
                    <label htmlFor="qEmail">Work Email Address *</label>
                    <input
                      type="email"
                      id="qEmail"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="rajesh@apexind.com"
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
                    <label htmlFor="qPlan">Preferred Statutory Mandate</label>
                    <select
                      id="qPlan"
                      value={quoteForm.planInterest}
                      onChange={(e) => setQuoteForm({ ...quoteForm, planInterest: e.target.value })}
                      className="quote-select"
                    >
                      <option value="Foundational Practice Retainer">Foundational Practice Retainer (₹2,499/mo)</option>
                      <option value="Corporate & MSME Statutory Retainer">
                        Corporate &amp; MSME Statutory Retainer (₹4,999/mo)
                      </option>
                      <option value="Enterprise & Multi-State Retainer">Enterprise &amp; Multi-State Retainer (₹20,999/mo)</option>
                      <option value="Turnkey Corporate Incorporation">Turnkey Corporate Incorporation (₹49,999)</option>
                      <option value="Custom Multi-Branch Corporate Retainer">Custom Multi-Branch / Factory Retainer</option>
                    </select>
                  </div>

                  <div className="quote-input-group">
                    <label htmlFor="qVol">Est. Monthly Voucher Volume</label>
                    <select
                      id="qVol"
                      value={quoteForm.monthlyInvoices}
                      onChange={(e) => setQuoteForm({ ...quoteForm, monthlyInvoices: e.target.value })}
                      className="quote-select"
                    >
                      <option value="< 50">Under 50 Invoices / Month</option>
                      <option value="50-150">50 to 150 Invoices / Month</option>
                      <option value="150-500">150 to 500 Invoices / Month</option>
                      <option value="500+">500+ High Volume / Multi-State</option>
                    </select>
                  </div>
                </div>

                <div className="quote-input-group">
                  <label htmlFor="qSoftware">Current Accounting Software</label>
                  <select
                    id="qSoftware"
                    value={quoteForm.accountingSoftware}
                    onChange={(e) => setQuoteForm({ ...quoteForm, accountingSoftware: e.target.value })}
                    className="quote-select"
                  >
                    <option value="Tally Prime">Tally Prime / ERP 9</option>
                    <option value="Zoho Books">Zoho Books</option>
                    <option value="Busy Accounting">Busy Accounting Software</option>
                    <option value="SAP / Oracle">SAP / Oracle ERP</option>
                    <option value="QuickBooks / Marg">QuickBooks / Marg ERP</option>
                    <option value="Spreadsheets / Manual">Spreadsheets / In-House Manual</option>
                    <option value="Need CA Recommendation">Need CA Partner to Recommend System</option>
                  </select>
                </div>

                <div className="quote-input-group">
                  <label htmlFor="qNotes">Specific Compliance Requirements / Notices</label>
                  <textarea
                    id="qNotes"
                    rows="3"
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="e.g. Have 2 GSTINs in Gujarat and Maharashtra, need ASMT-10 mismatch resolution, pending 44AB tax audit..."
                    className="quote-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-quote" disabled={quoteStatus.loading}>
                  {quoteStatus.loading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin"></i> Submitting Mandate Request...
                    </span>
                  ) : (
                    <span>
                      Request Retainer Proposal <i className="fas fa-arrow-right"></i>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STATUTORY BILLING & ICAI ETHICS FAQS */}
      <section className="container pricing-faqs-section">
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-circle-question"></i>
            <span>REGULATORY ETHICS &bull; FAQS</span>
          </span>
          <h2>Frequently Asked Questions on Retainers</h2>
          <p className="section-subtext">
            Clear, binding policies regarding professional fee structures, treasury challans, and scope assurance under ICAI standards.
          </p>
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
