import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeatures } from '../api';
import useFetch from '../hooks/useFetch';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const DEFAULT_FEATURES = [
  {
    title: 'Tax Optimization & Corporate Structuring',
    description: 'Proactive direct tax and GST structuring tailored for Indian enterprises, MSMEs, and high-net-worth directors. We identify legitimate exemptions, optimize operational expenses, and structure compliant revenue models to legally minimize your statutory outflows.',
    icon: 'fas fa-chart-line',
  },
  {
    title: 'Transparent Flat-Rate Billing',
    description: 'Upfront, predictable fee structures with all-inclusive statutory deliverables. No hourly surprises, no hidden surcharges—just fixed, milestone-based packages backed by strict professional compliance ethics.',
    icon: 'fas fa-gem',
  },
  {
    title: 'Direct Senior Partner Advisory Desk',
    description: 'Direct 1-on-1 access to senior corporate practitioners whenever statutory deadlines approach or urgent tax notices arrive. Real-time drafting, audit defense, and filing guidance via direct WhatsApp and phone channels.',
    icon: 'fas fa-headset',
  },
];

// Direct Comparison Matrix Data
const COMPARISON_ROWS = [
  {
    category: 'Account Ownership & Oversight',
    traditional: 'Delegated to junior trainees and interns; high staff turnover',
    big4: 'Multi-tiered bureaucracy; communication lost across junior analyst layers',
    chamunda: 'Direct Senior Partner assigned with personal WhatsApp & direct hotline',
    highlight: true,
  },
  {
    category: 'Tax Planning Approach',
    traditional: 'Reactive year-end rush; errors discovered after department notices',
    big4: 'Methodical but encumbered by weeks of corporate protocol and red tape',
    chamunda: 'Proactive advance planning; algorithmic AIS, 26AS & GSTR-2B pre-reconciliation',
    highlight: true,
  },
  {
    category: 'Scrutiny & Notice Resolution',
    traditional: 'Panic reaction; emergency hourly surcharges billed for every reply notice',
    big4: 'Exorbitant hourly billing for legal research and appellate tribunal drafting',
    chamunda: 'Routine scrutiny defense, ASMT-10 & Sec 143(1) replies included in retainer scope',
    highlight: true,
  },
  {
    category: 'Fee Transparency & Retainers',
    traditional: 'Unpredictable billing creep, ambiguous add-ons, sudden year-end charges',
    big4: 'High minimum corporate retainers unaffordable for growing enterprises and MSMEs',
    chamunda: '100% Scope-locked fixed retainers; zero billable hour inflation; 18% ITC claimable',
    highlight: true,
  },
  {
    category: 'Communication SLA',
    traditional: 'Days of silence; unanswered phone calls during peak statutory filing weeks',
    big4: 'Formal ticket queues with 48–72h turnaround delays and impersonal emails',
    chamunda: 'Guaranteed < 24h partner SLA; instant WhatsApp escalation for urgent notices',
    highlight: true,
  },
  {
    category: 'Document Custody & Archival',
    traditional: 'Vulnerable physical paper ledgers and misplaced purchase vouchers in storage',
    big4: 'Restricted corporate ERPs requiring complex permissions and IT assistance',
    chamunda: 'Permanent encrypted cloud vault with 1-click retrieval for bank loans and tenders',
    highlight: true,
  },
];

// Interactive Estimator Data
const TURNOVER_SLABS = [
  {
    id: 'tier1',
    range: '₹10L – ₹25L',
    savings: '₹65,000 – ₹1,20,000',
    penaltiesSaved: '₹25,000+',
    recommended: 'Professional Tax & GST Retainer',
    strategy: 'Presumptive taxation under Sec 44ADA + legitimate business deductions optimization.',
  },
  {
    id: 'tier2',
    range: '₹25L – ₹50L',
    savings: '₹1,40,000 – ₹2,60,000',
    penaltiesSaved: '₹50,000+',
    recommended: 'Corporate & MSME Statutory Retainer',
    strategy: 'Advance tax quarterly cashflow modeling + monthly GSTR-2B inward ITC cross-reconciliation.',
  },
  {
    id: 'tier3',
    range: '₹50L – ₹1.5 Cr',
    savings: '₹3,20,000 – ₹5,80,000',
    penaltiesSaved: '₹1,50,000+',
    recommended: 'Growth Enterprise Full-Stack Retainer',
    strategy: 'Entity tax restructuring + Director compensation & dividend distribution optimization.',
  },
  {
    id: 'tier4',
    range: '₹1.5 Cr – ₹5 Cr+',
    savings: '₹7,50,000 – ₹14,00,000+',
    penaltiesSaved: '₹3,50,000+',
    recommended: 'Virtual CFO & Forensic Defense Desk',
    strategy: 'Section 44AB tax audit readiness + full-scale scrutiny defense & transfer pricing insulation.',
  },
];

const FeaturesSection = () => {
  const { data: response, loading, error } = useFetch(getFeatures);
  const rawFeatures = response?.data || [];
  const features = rawFeatures.length > 0 ? rawFeatures : DEFAULT_FEATURES;

  // Active Tab View: 'pillars' | 'comparison' | 'calculator'
  const [activeTab, setActiveTab] = useState('pillars');

  // Interactive Estimator State
  const [selectedTurnover, setSelectedTurnover] = useState('tier2');
  const [entityType, setEntityType] = useState('corporate');

  const activeSlab = TURNOVER_SLABS.find((s) => s.id === selectedTurnover) || TURNOVER_SLABS[1];

  const handleWhatsAppChat = () => {
    const text = 'Hello Shree Chamunda Associates, I would like to consult with a senior partner regarding strategic tax planning and corporate compliance retainers.';
    window.open(`https://wa.me/919510984735?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="features-section" id="why-choose-us">
      {/* Top Gold Gradient Glow Divider */}
      <div className="features-top-accent-line" aria-hidden="true"></div>

      {/* Subtle Geometric Precision Grid */}
      <div className="features-grid-pattern" aria-hidden="true"></div>

      <div className="container features-inner-wrapper">
        {/* ============================================================
            1. SECTION MASTER HEADER
            ============================================================ */}
        <header className="features-header-wrap">
          <span className="header-watermark" aria-hidden="true">ADVANTAGE</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>
          <div className="features-badge-pill">
            <span className="badge-index-chip">03</span>
            <span className="live-dot" aria-hidden="true"></span>
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <span>THE ADVISORY ADVANTAGE &bull; FIDUCIARY EXCELLENCE</span>
          </div>

          <h2 className="features-main-title">
            Strategic Tax Precision. <br />
            <span className="title-gradient-gold">Engineered for Uncompromising Growth.</span>
          </h2>

          <p className="features-subtitle">
            We combine institutional direct tax expertise, forensic pre-filing audit defense, and locked fixed-fee retainers to legally minimize liabilities, insulate your firm from notices, and guarantee 100% on-time statutory compliance.
          </p>

          <div className="header-assurance-strip">
            <span className="assurance-pill">
              <i className="fa-solid fa-glasses"></i> Four-Eye Dual Review
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-magnifying-glass-chart"></i> Forensic Pre-Filing Audit
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-headset"></i> Direct Senior Partner Line
            </span>
          </div>

          {/* ============================================================
              2. INTERACTIVE VIEW CONTROLLER (3 MODES)
              ============================================================ */}
          <div className="features-mode-switcher-wrap" role="tablist" aria-label="Advantage Views">
            <div className="features-mode-switcher">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'pillars'}
                className={`mode-btn ${activeTab === 'pillars' ? 'active' : ''}`}
                onClick={() => setActiveTab('pillars')}
              >
                <i className="fa-solid fa-cubes"></i>
                <span>3 Core Strategic Pillars</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'comparison'}
                className={`mode-btn ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparison')}
              >
                <i className="fa-solid fa-scale-balanced"></i>
                <span>Why Switch to Us (Comparison Matrix)</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'calculator'}
                className={`mode-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                <i className="fa-solid fa-calculator"></i>
                <span>Tax Alpha Estimator</span>
              </button>
            </div>
          </div>
        </header>

        {/* ============================================================
            3. TAB 1: CORE STRATEGIC PILLARS (BENTO ARCHITECTURE)
            ============================================================ */}
        {activeTab === 'pillars' && (
          <div className="tab-pane-content fade-in" role="tabpanel">
            {loading && rawFeatures.length === 0 ? (
              <div className="features-bento-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton skeleton-card" style={{ height: '420px', borderRadius: '20px' }}></div>
                ))}
              </div>
            ) : error && rawFeatures.length === 0 ? (
              <div className="features-error-card">
                <i className="fas fa-exclamation-circle"></i>
                <p>Failed to load firm advantages. Please refresh the page.</p>
              </div>
            ) : (
              <div className="features-bento-grid">
                {features.map((feature, idx) => (
                  <FeatureCard key={feature._id || idx} feature={feature} index={idx} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            4. TAB 2: WHY SWITCH TO US (COMPARATIVE MATRIX)
            ============================================================ */}
        {activeTab === 'comparison' && (
          <div className="tab-pane-content comparison-pane fade-in" role="tabpanel">
            <div className="comparison-card-wrapper">
              <div className="comparison-header">
                <div className="comp-hdr-info">
                  <span className="comp-eyebrow">HEAD-TO-HEAD INSTITUTIONAL AUDIT</span>
                  <h3 className="comp-title">Traditional Accounting vs. Shree Chamunda Associates</h3>
                  <p className="comp-desc">
                    See how our proactive fiduciary architecture delivers tangible tax savings, partner access, and complete audit immunity compared to legacy firms.
                  </p>
                </div>
                <div className="comp-badge-box">
                  <span className="badge-champ"><i className="fa-solid fa-award"></i> The Chamunda Standard</span>
                </div>
              </div>

              {/* Responsive Comparison Table */}
              <div className="comparison-table-scroll">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="th-criterion">Fiduciary Standard</th>
                      <th className="th-traditional">Traditional Local Accountant</th>
                      <th className="th-big4">Typical Big 4 / Large Agency</th>
                      <th className="th-chamunda">
                        <div className="chamunda-th-brand">
                          <i className="fa-solid fa-shield-check"></i>
                          <span>Shree Chamunda Associates</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr key={idx} className={row.highlight ? 'row-highlighted' : ''}>
                        <td className="td-criterion">
                          <strong>{row.category}</strong>
                        </td>
                        <td className="td-traditional">
                          <div className="cell-flex">
                            <i className="fa-solid fa-circle-xmark text-rose"></i>
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                        <td className="td-big4">
                          <div className="cell-flex">
                            <i className="fa-solid fa-triangle-exclamation text-amber"></i>
                            <span>{row.big4}</span>
                          </div>
                        </td>
                        <td className="td-chamunda">
                          <div className="cell-flex">
                            <i className="fa-solid fa-circle-check text-emerald"></i>
                            <span>{row.chamunda}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Matrix Guarantee Note */}
              <div className="comparison-matrix-footer">
                <div className="matrix-assurance-left">
                  <i className="fa-solid fa-handshake-simple text-gold"></i>
                  <span>
                    <strong>100% Scope-Locked Guarantee:</strong> All retainer agreements include written SLAs and zero unexpected billable hour inflation.
                  </span>
                </div>
                <Link to="/contact" className="btn-matrix-switch">
                  <span>Switch Your Retainer Mandate</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            5. TAB 3: TAX ALPHA ESTIMATOR (INTERACTIVE MINI CALCULATOR)
            ============================================================ */}
        {activeTab === 'calculator' && (
          <div className="tab-pane-content calculator-pane fade-in" role="tabpanel">
            <div className="estimator-card-wrapper">
              <div className="estimator-grid">
                {/* Left Configurator Column */}
                <div className="estimator-controls-col">
                  <span className="estimator-eyebrow">INTERACTIVE STATUTORY ROI ESTIMATOR</span>
                  <h3 className="estimator-title">Estimate Your Entity's Annual Tax Savings</h3>
                  <p className="estimator-desc">
                    Select your business profile and turnover tier to see estimated legitimate tax savings, penalty defense, and recommended advisory track.
                  </p>

                  {/* Turnover Selector */}
                  <div className="control-group">
                    <label className="control-label">Annual Enterprise Turnover / Gross Receipts:</label>
                    <div className="slab-chips-row">
                      {TURNOVER_SLABS.map((slab) => (
                        <button
                          key={slab.id}
                          type="button"
                          className={`slab-chip-btn ${selectedTurnover === slab.id ? 'active' : ''}`}
                          onClick={() => setSelectedTurnover(slab.id)}
                        >
                          <span className="chip-indicator"></span>
                          <span className="chip-text">{slab.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entity Type Selector */}
                  <div className="control-group">
                    <label className="control-label">Entity Commercial Structure:</label>
                    <div className="entity-pills-row">
                      <button
                        type="button"
                        className={`entity-pill-btn ${entityType === 'corporate' ? 'active' : ''}`}
                        onClick={() => setEntityType('corporate')}
                      >
                        <i className="fa-solid fa-building"></i>
                        <span>Private Limited / LLP</span>
                      </button>
                      <button
                        type="button"
                        className={`entity-pill-btn ${entityType === 'msme' ? 'active' : ''}`}
                        onClick={() => setEntityType('msme')}
                      >
                        <i className="fa-solid fa-industry"></i>
                        <span>MSME / Manufacturer</span>
                      </button>
                      <button
                        type="button"
                        className={`entity-pill-btn ${entityType === 'individual' ? 'active' : ''}`}
                        onClick={() => setEntityType('individual')}
                      >
                        <i className="fa-solid fa-user-tie"></i>
                        <span>Director / Professional</span>
                      </button>
                    </div>
                  </div>

                  <div className="estimator-strategy-note">
                    <i className="fa-solid fa-lightbulb text-gold"></i>
                    <div>
                      <strong>Recommended Statutory Strategy:</strong>
                      <p>{activeSlab.strategy}</p>
                    </div>
                  </div>
                </div>

                {/* Right Results Dashboard Column */}
                <div className="estimator-results-col">
                  <div className="results-display-card">
                    <div className="results-top-badge">
                      <span className="res-ping"></span>
                      <span>POTENTIAL ANNUAL TAX ALPHA</span>
                    </div>

                    <div className="res-amount-block">
                      <span className="res-currency">₹</span>
                      <strong className="res-figure">{activeSlab.savings}</strong>
                      <span className="res-sub">Average Legitimate Tax Saved Annually</span>
                    </div>

                    <div className="res-metrics-grid">
                      <div className="res-metric-item">
                        <span className="metric-label">Penalties Defended</span>
                        <strong className="metric-val text-emerald">{activeSlab.penaltiesSaved}</strong>
                        <span className="metric-caption">Zero Sec 234 Interest</span>
                      </div>
                      <div className="res-metric-item">
                        <span className="metric-label">Notice Exposure</span>
                        <strong className="metric-val text-emerald">100% Insulated</strong>
                        <span className="metric-caption">Pre-reconciled vs GSTR-2B</span>
                      </div>
                    </div>

                    <div className="res-mandate-box">
                      <span className="mandate-lbl">Recommended Engagement Track:</span>
                      <strong className="mandate-name">{activeSlab.recommended}</strong>
                    </div>

                    <div className="res-action-buttons">
                      <Link to="/contact" className="btn-res-primary">
                        <span>Lock This Strategy With Partner</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                      <button type="button" className="btn-res-wa" onClick={handleWhatsAppChat}>
                        <i className="fa-brands fa-whatsapp"></i>
                        <span>WhatsApp Partner Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            6. BOTTOM QUANTITATIVE BENCHMARKS & CTA RIBBON
            ============================================================ */}
        <div className="features-trust-ribbon">
          <div className="trust-stats-grid">
            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              </div>
              <span className="trust-stat-number">4+</span>
              <span className="trust-stat-label">Years Practice &amp; Advisory</span>
            </div>

            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-building-shield" aria-hidden="true"></i>
              </div>
              <span className="trust-stat-number">200+</span>
              <span className="trust-stat-label">Active Corporate Retainers</span>
            </div>

            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-sack-dollar" aria-hidden="true"></i>
              </div>
              <span className="trust-stat-number">₹4.2 Cr+</span>
              <span className="trust-stat-label">Tax Legally Saved For Clients</span>
            </div>

            <div className="trust-stat-box">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-shield-heart" aria-hidden="true"></i>
              </div>
              <span className="trust-stat-number">99.8%</span>
              <span className="trust-stat-label">Statutory Compliance Record</span>
            </div>
          </div>

          <div className="trust-cta-row">
            <div className="trust-cta-text">
              <h4>Ready to insulate your enterprise from notices &amp; overpaid taxes?</h4>
              <p>Schedule a confidential 1-on-1 strategy session with our senior corporate practitioners.</p>
            </div>
            <div className="trust-cta-buttons">
              <Link to="/contact" className="btn-features-primary">
                <i className="fa-solid fa-calendar-alt"></i>
                <span>Schedule Partner Review</span>
              </Link>
              <button type="button" className="btn-features-whatsapp" onClick={handleWhatsAppChat}>
                <i className="fa-brands fa-whatsapp"></i>
                <span>Direct Advisory Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;