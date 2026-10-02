import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './TrustSection.css';

const TrustSection = ({ onSelectCategory }) => {
  const { settings, loading } = useSiteContext();
  const navigate = useNavigate();
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  const handlePracticeClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      const elem = document.getElementById('services-section');
      if (elem) {
        const yOffset = -80;
        const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('filter-services-category', { detail: { category } }));
      } else {
        navigate(`/services?category=${category}#services-section`);
      }
    }
  };

  if (loading) {
    return (
      <section className="trust skeleton-trust">
        <div className="tst-container">
          <div className="skeleton skeleton-title" style={{ width: '40%', margin: '0 auto 20px', height: '36px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '70%', margin: '0 auto 40px', height: '20px' }}></div>
          <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const trustHeading = settings?.trustHeading || 'INSTITUTIONAL GOVERNANCE & CHARTERED ASSURANCE';

  // 4 Quantitative Metrics
  const trustMetrics = [
    {
      num: '99.8%',
      label: 'Precision Rate',
      badge: 'Zero Defect',
      badgeClass: 'badge-gold',
      caption: 'Dual-tier partner review before portal dispatch',
    },
    {
      num: '₹15Cr+',
      label: 'Scrutiny Protected',
      badge: 'Zero Loss',
      badgeClass: 'badge-green',
      caption: 'Defended across Sec 143/148 & ASMT-10 notices',
    },
    {
      num: '0',
      label: 'Statutory Penalties',
      badge: 'SLA Guaranteed',
      badgeClass: 'badge-blue',
      caption: 'Firm-backed on-time filing due date guarantee',
    },
    {
      num: '250+',
      label: 'Enterprises Retained',
      badge: 'Gujarat Active',
      badgeClass: 'badge-purple',
      caption: 'Manufacturing, corporate LLPs & tech startups',
    },
  ];

  // 3-Stage Pre-Filing Verification Pipeline
  const pipelineSteps = [
    {
      step: '01',
      phase: 'DATA INGESTION & AUTO-RECONCILIATION',
      title: 'Algorithmic 360° Portal Matching',
      icon: 'fas fa-server',
      summary: 'Before drafting any return, our automated ingestion engine cross-reconciles internal purchase registers against live GSTR-2B, AIS, 26AS, and bank records to detect credit leaks and invoice mismatches.',
      checkpoints: [
        '100% Inward ITC claimed matching GSTR-2B',
        'AIS & 26AS high-value financial transaction alignment',
        'Zero vendor default exposure flagged upfront',
      ],
      tag: 'Eliminates ASMT-10 & Sec 143 Mismatch Notices',
    },
    {
      step: '02',
      phase: 'SENIOR CA RISK & OPTIMIZATION AUDIT',
      phaseShort: 'AUDIT',
      title: 'Manual Chartered Risk & Allowance Screening',
      icon: 'fas fa-user-check',
      summary: 'A designated senior Chartered Accountant conducts an exhaustive review of statutory depreciation, allowable Section 37 business expenses, 80JJAA wage benefits, and risk red flags.',
      checkpoints: [
        'Legitimate tax deduction optimization applied',
        'Multi-state GST cross-charge compliance verified',
        'Strict adherence to applicable Indian Accounting Standards',
      ],
      tag: 'Maximizes Legal Tax Savings Without Audit Triggers',
    },
    {
      step: '03',
      phase: 'PARTNER SIGN-OFF & DIGITAL VAULT ARCHIVAL',
      phaseShort: 'SIGN-OFF',
      title: 'Certified Portal Dispatch & Fiduciary Filing Receipt',
      icon: 'fas fa-file-signature',
      summary: 'Following final partner sign-off, the return is digitally transmitted to government servers with cryptographic verification, and official acknowledgment receipts are archived in your private client vault.',
      checkpoints: [
        'Signed CA partner verification certificate',
        'Instant government filing acknowledgment generated',
        'Immediate archival to 256-bit encrypted client cloud vault',
      ],
      tag: 'Complete Legal Proof Ready for Banking & Tenders',
    },
  ];

  return (
    <section className="trust" id="trust-section" aria-labelledby="trust-master-heading">
      {/* Ambient Lighting & Top Accent Divider */}
      <div className="trust-top-accent-line" aria-hidden="true"></div>
      <div className="trust-ambient-grid" aria-hidden="true"></div>
      <div className="trust-ambient-orb orb-gold" aria-hidden="true"></div>
      <div className="trust-ambient-orb orb-blue" aria-hidden="true"></div>

      <div className="tst-container">
        {/* ============================================================
            SECTION HEADER: Full-Width Institutional Authority
            ============================================================ */}
        <div className="trust-master-header">
          <div className="trust-badge-label">
            <span className="badge-pulse-dot"></span>
            <i className="fas fa-shield-alt"></i>
            <span>{trustHeading}</span>
          </div>

          <h2 id="trust-master-heading" className="trust-master-title">
            Fiduciary Integrity, <span className="title-gradient-gold">Zero Penalties</span> &amp; Direct Partner Oversight
          </h2>

          <p className="trust-master-subtext">
            Every tax return, statutory audit, and corporate compliance filing is executed under strict ICAI chartered standards—insulating Indian enterprises against notices, penalties, and tax leakages through multi-tier verification.
          </p>
        </div>

        {/* ============================================================
            4 QUANTITATIVE AUTHORITY METRIC ANCHORS
            ============================================================ */}
        <div className="trust-metrics-ribbon">
          {trustMetrics.map((item, idx) => (
            <div key={idx} className="metric-ribbon-col">
              <div className="metric-header-row">
                <span className="metric-large-num">{item.num}</span>
                <span className={`metric-pill-tag ${item.badgeClass}`}>{item.badge}</span>
              </div>
              <strong className="metric-bold-label">{item.label}</strong>
              <span className="metric-muted-caption">{item.caption}</span>
            </div>
          ))}
        </div>

        {/* ============================================================
            DUAL ASYMMETRIC INSTITUTIONAL WINGS
            ============================================================ */}
        <div className="trust-architecture-split">
          {/* ========================================
              WING A: Pre-Filing Verification Pipeline (Operational Moat)
              ======================================== */}
          <div className="pipeline-wing-card">
            <div className="pipeline-wing-header">
              <div className="pipeline-eyebrow">
                <span className="live-status-dot"></span>
                <span>OPERATIONAL RIGOR &bull; COMPLIANCE DEFENSE</span>
              </div>
              <h3>Our 3-Stage Pre-Submission Audit Pipeline</h3>
              <p>
                How we maintain an unblemished zero-penalty track record: every single return passes through our sequential multi-tier verification engine.
              </p>
            </div>

            {/* Interactive Step Selector Tabs */}
            <div className="pipeline-step-nav" role="tablist">
              {pipelineSteps.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activePipelineStep === idx}
                  className={`pipeline-nav-btn ${activePipelineStep === idx ? 'active' : ''}`}
                  onClick={() => setActivePipelineStep(idx)}
                >
                  <span className="pipeline-step-num">{step.step}</span>
                  <span className="pipeline-step-phase">Stage {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Active Pipeline Stage Presentation */}
            <div className="pipeline-stage-display">
              <div className="pipeline-display-badge">
                <i className={pipelineSteps[activePipelineStep].icon}></i>
                <span>{pipelineSteps[activePipelineStep].phase}</span>
              </div>

              <h4 className="pipeline-display-title">
                {pipelineSteps[activePipelineStep].title}
              </h4>

              <p className="pipeline-display-summary">
                {pipelineSteps[activePipelineStep].summary}
              </p>

              {/* Verified Checkpoints List */}
              <div className="pipeline-checkpoints-list">
                {pipelineSteps[activePipelineStep].checkpoints.map((check, cIdx) => (
                  <div key={cIdx} className="pipeline-checkpoint-item">
                    <span className="checkpoint-check-icon">
                      <i className="fas fa-check"></i>
                    </span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>

              {/* Value Guarantee Tag */}
              <div className="pipeline-guarantee-tag">
                <i className="fas fa-shield-halved"></i>
                <span>{pipelineSteps[activePipelineStep].tag}</span>
              </div>
            </div>
          </div>

          {/* ========================================
              WING B: Fiduciary Vault & Partner Accountability
              ======================================== */}
          <div className="fiduciary-wing-column">
            {/* Card B1: Bank-Grade Discretion & Digital Client Vault */}
            <div className="fiduciary-feature-card">
              <div className="fiduciary-card-top">
                <div className="fiduciary-icon-box box-emerald">
                  <i className="fas fa-vault"></i>
                </div>
                <div className="fiduciary-card-meta">
                  <span className="fiduciary-kicker">DATA CONFIDENTIALITY &amp; DISCRETION</span>
                  <h4>Bank-Grade Client Cloud Vault</h4>
                </div>
              </div>

              <p className="fiduciary-desc">
                Protected by strict ICAI confidentiality bylaws and formal enterprise NDAs. Your financial ledgers, tax filings, and corporate documents are housed in a secure 256-bit encrypted cloud vault accessible 24/7.
              </p>

              <div className="fiduciary-benefits-list">
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>256-Bit SSL encrypted cloud repository for paperless audits</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>Instant 1-click document retrieval for corporate bank loans &amp; tenders</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>Fiduciary confidentiality governed under Chartered Accountants Act</span>
                </div>
              </div>

              <div className="fiduciary-footer-badge badge-secure">
                <i className="fas fa-lock"></i>
                <span>100% Encrypted &bull; Never Shared with Third Parties</span>
              </div>
            </div>

            {/* Card B2: Direct Partner Desk (Zero Junior Trainee Handoffs) */}
            <div className="fiduciary-feature-card">
              <div className="fiduciary-card-top">
                <div className="fiduciary-icon-box box-gold">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="fiduciary-card-meta">
                  <span className="fiduciary-kicker">EXECUTIVE ACCOUNTABILITY</span>
                  <h4>Direct Senior Partner Assigned</h4>
                </div>
              </div>

              <p className="fiduciary-desc">
                No dealing with generic call centers or inexperienced interns. Every client is assigned a designated Senior CA Partner with 15+ years of cumulative expertise who directly reviews filings and manages notices.
              </p>

              <div className="fiduciary-benefits-list">
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-gold"></i>
                  <span>Direct priority WhatsApp &amp; phone line to your assigned CA</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-gold"></i>
                  <span>Guaranteed emergency scrutiny notice triage within 2 business hours</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-gold"></i>
                  <span>Transparent fixed-fee engagement without surprise billing</span>
                </div>
              </div>

              <div className="fiduciary-footer-badge badge-sla">
                <i className="fas fa-bolt"></i>
                <span>&lt; 24h SLA Guarantee &bull; Direct Senior Partner Oversight</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            EXECUTIVE ASSURANCE & FAST-TRACK PRACTICE ACTION HUB
            ============================================================ */}
        <div className="trust-action-hub-card">
          {/* Top Banner: Dual-Column Executive Architecture */}
          <div className="hub-top-row">
            {/* Left: Authority Narrative & Credibility Badges */}
            <div className="hub-authority-pane">
              <div className="hub-status-pill">
                <span className="hub-status-dot"></span>
                <i className="fas fa-shield-halved"></i>
                <span>Direct Chartered Chambers &bull; Senior Partner Oversight</span>
              </div>

              <h3 className="hub-headline">
                Institutional Tax Advisory with Zero-Penalty SLA &amp; Direct Notice Defense
              </h3>

              <div className="hub-credentials-strip">
                <div className="hub-cred-item">
                  <div className="cred-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span><strong>4.9/5</strong> (200+ Gujarat Businesses)</span>
                </div>
                <span className="hub-cred-sep">&bull;</span>
                <div className="hub-cred-item">
                  <i className="fas fa-certificate text-emerald"></i>
                  <span><strong>ICAI Regulated</strong> Practice Standard</span>
                </div>
                <span className="hub-cred-sep">&bull;</span>
                <div className="hub-cred-item">
                  <i className="fas fa-award text-gold"></i>
                  <span><strong>4+ Years</strong> Continuous Practice</span>
                </div>
              </div>
            </div>

            {/* Right: High-Impact Dual Action Suite */}
            <div className="hub-actions-pane">
              <button
                type="button"
                className="btn-hub-primary"
                onClick={() => navigate('/contact')}
              >
                <span className="btn-shine"></span>
                <i className="fas fa-calendar-check"></i>
                <div className="btn-hub-text">
                  <span className="btn-hub-main">Schedule Partner Consultation</span>
                  <span className="btn-hub-sub">Free 30-Min Direct Scrutiny &amp; Tax Review</span>
                </div>
                <i className="fas fa-arrow-right btn-arrow"></i>
              </button>

              <div className="hub-secondary-actions">
                <button
                  type="button"
                  className="btn-hub-secondary"
                  onClick={() => navigate('/about')}
                >
                  <i className="fas fa-file-contract"></i>
                  <span>Our Firm Charter</span>
                </button>

                <a
                  href={`https://wa.me/${settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735'}?text=${encodeURIComponent(
                    'Hello Shree Chamunda Associates! I would like to consult with a Senior Chartered Accountant regarding Tax & Compliance services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hub-whatsapp"
                  title="Direct WhatsApp Advisory with Senior CA"
                  aria-label="Direct WhatsApp Consultation"
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Elegant Architectural Divider Line */}
          <div className="hub-divider-line" aria-hidden="true"></div>

          {/* Bottom Banner: Fast-Track Practice Domain Navigator */}
          <div className="hub-bottom-row">
            <div className="hub-nav-header">
              <span className="hub-nav-badge">
                <i className="fas fa-bolt text-gold"></i>
                <span>FAST-TRACK ACCESS</span>
              </span>
              <span className="hub-nav-lead">Jump Directly to Specialized Practice Chambers:</span>
            </div>

            <div className="hub-chips-grid">
              <button
                type="button"
                className="hub-practice-chip chip-tax"
                onClick={() => handlePracticeClick('tax')}
              >
                <span className="chip-icon-box box-tax">
                  <i className="fas fa-file-invoice-dollar"></i>
                </span>
                <div className="chip-meta">
                  <strong className="chip-title">Direct &amp; Income Tax</strong>
                  <span className="chip-sub">ITR-1 to 7 &bull; Sec 44AD/ADA</span>
                </div>
                <i className="fas fa-chevron-right chip-cue"></i>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-gst"
                onClick={() => handlePracticeClick('tax')}
              >
                <span className="chip-icon-box box-gst">
                  <i className="fas fa-receipt"></i>
                </span>
                <div className="chip-meta">
                  <strong className="chip-title">GST Filing &amp; Scrutiny</strong>
                  <span className="chip-sub">GSTR-1, 3B &bull; ITC Recon</span>
                </div>
                <i className="fas fa-chevron-right chip-cue"></i>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-startup"
                onClick={() => handlePracticeClick('startup')}
              >
                <span className="chip-icon-box box-startup">
                  <i className="fas fa-building"></i>
                </span>
                <div className="chip-meta">
                  <strong className="chip-title">Pvt Ltd &amp; LLP Setup</strong>
                  <span className="chip-sub">MCA SPICe+ &bull; DIN Allotment</span>
                </div>
                <i className="fas fa-chevron-right chip-cue"></i>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-audit"
                onClick={() => handlePracticeClick('accounting')}
              >
                <span className="chip-icon-box box-audit">
                  <i className="fas fa-shield-halved"></i>
                </span>
                <div className="chip-meta">
                  <strong className="chip-title">Statutory Audits &amp; ROC</strong>
                  <span className="chip-sub">Sec 44AB &bull; AOC-4 &bull; MGT-7</span>
                </div>
                <i className="fas fa-chevron-right chip-cue"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
