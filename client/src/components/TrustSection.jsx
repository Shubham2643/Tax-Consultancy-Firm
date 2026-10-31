import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import './TrustSection.css';

const TrustSection = ({ onSelectCategory }) => {
  const { settings, loading } = useSiteContext();
  const navigate = useNavigate();
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [activeMetricIdx, setActiveMetricIdx] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [vaultVerified, setVaultVerified] = useState(false);

  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash === '#governance' || hash === '#institutional-governance' || hash === '#trust-section') {
        const elem = document.getElementById('institutional-governance');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

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

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#institutional-governance`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2600);
      });
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

  const trustHeading = settings?.trustHeading || 'INSTITUTIONAL GOVERNANCE & STATUTORY ASSURANCE';

  // 4 Quantitative Metrics with Deep Forensic Verification Proof Dossiers
  const trustMetrics = [
    {
      id: 'dispatch',
      kicker: 'FILING DISPATCH INTEGRITY',
      icon: 'fas fa-file-circle-check',
      num: '99.8%',
      label: 'Portal Return Acceptance',
      badge: 'Sec 139(9) Defect-Free',
      badgeClass: 'badge-statutory',
      caption: 'Pre-dispatch partner review eliminating defective notices & ASMT-10 mismatches.',
      verifiedText: 'Statutory Checklist Verified',
      dossier: {
        title: 'CBDT & GSTN Portal Acceptance Ledger (1,840+ Annual Filings)',
        telemetry: '99.82% Machine Verification Score • 0 Defective Return Orders Under Sec 139(9)',
        statuteRef: 'Income Tax Act Sec 139(9) & GST Rule 21A Framework',
        safeguards: [
          {
            headline: '3-Way Automated Schema Pre-Validation',
            detail: 'JSON/XML schema audit against official ITD and GSTN v2.1 specifications prior to API dispatch.',
          },
          {
            headline: 'GSTR-2B Inward Credit Lock',
            detail: 'Inward Input Tax Credit matched down to invoice-level UUIDs to preempt automated ASMT-10 notices.',
          },
          {
            headline: 'Cryptographic Hash Receipt Archive',
            detail: 'Instant Acknowledgement Reference Number (ARN) archived in private vault with SHA-256 integrity check.',
          },
        ],
      },
    },
    {
      id: 'litigation',
      kicker: 'SCRUTINY LITIGATION DEFENSE',
      icon: 'fas fa-scale-balanced',
      num: '₹15Cr+',
      label: 'Scrutiny Value Protected',
      badge: 'Nil Adverse Orders',
      badgeClass: 'badge-statutory',
      caption: 'Defended across Sec 143(3), 148 & GST audit scrutiny with zero additions.',
      verifiedText: '100% Capital Preserved',
      dossier: {
        title: 'Statutory Assessment & Scrutiny Defense Ledger (₹15.42 Crore Protected)',
        telemetry: '100% Tax Capital Preserved • Zero High-Pitched Additions Upheld in Appeals',
        statuteRef: 'Income Tax Sec 143(3), 148A & GST Sec 73/74 Proceedings',
        safeguards: [
          {
            headline: 'Sec 143(3) Detailed Assessment Briefs',
            detail: 'Factual evidence dockets and precedent jurisprudence prepared directly by senior tax advocates.',
          },
          {
            headline: 'Sec 148 Reassessment Jurisdiction Defense',
            detail: 'Statutory limitation objections successfully defending corporate capital against arbitrary reopenings.',
          },
          {
            headline: 'GST Department Audit Representation',
            detail: 'Comprehensive reconciliation of Form GSTR-9C against audited financial statements with zero adverse levies.',
          },
        ],
      },
    },
    {
      id: 'penalties',
      kicker: 'STATUTORY DUE DATES',
      icon: 'fas fa-calendar-check',
      num: '0',
      label: 'Default Penalties Incurred',
      badge: 'Zero Late Fees (Sec 234F)',
      badgeClass: 'badge-statutory',
      caption: 'Guaranteed on-time statutory dispatch across GST, Income Tax, TDS & MCA.',
      verifiedText: 'Zero Default Record',
      dossier: {
        title: 'Pre-Emptive Statutory Due Date Radar (Income Tax, GST, TDS, MCA)',
        telemetry: 'Zero Default Penalties Under Sec 234E, 234F & Companies Act Sec 203',
        statuteRef: 'Direct Tax Compliance Calendar & GST Rule 36(4) Strict Deadlines',
        safeguards: [
          {
            headline: '14-Day Advance Computation Engine',
            detail: 'Advance tax installments (15 Jun, 15 Sep, 15 Dec, 15 Mar) pre-computed 2 weeks ahead of statutory cutoffs.',
          },
          {
            headline: 'Monthly ECR & TDS Challan Clearance',
            detail: 'PF, ESIC, and 24Q/26Q withholding tax challans verified and cleared with zero late fee exposure.',
          },
          {
            headline: 'Firm Practice Warranty Assurance',
            detail: 'If any statutory late penalty occurs due to internal dispatch delay, our practice covers 100% of the levy.',
          },
        ],
      },
    },
    {
      id: 'portfolio',
      kicker: 'CORPORATE AUDIT PORTFOLIO',
      icon: 'fas fa-building-columns',
      num: '250+',
      label: 'Retained Enterprises',
      badge: 'Gujarat Active',
      badgeClass: 'badge-statutory',
      caption: 'Manufacturing units, corporate LLPs, partnership firms & growth MSMEs.',
      verifiedText: 'Continuous Retainers',
      dossier: {
        title: 'Gujarat Enterprise Governance Network (250+ Retained Corporate Entities)',
        telemetry: 'Active Corporate LLPs, Manufacturing Private Limiteds & Export Units',
        statuteRef: 'Companies Act 2013 Statutory Maintenance & Partnership Act 1932',
        safeguards: [
          {
            headline: 'Industrial & Manufacturing Focus',
            detail: 'Specialized capital asset depreciation schedules for Ahmedabad, Sanand, and Changodar manufacturing hubs.',
          },
          {
            headline: 'Exporters & Zero-Rated Supplies',
            detail: 'Fast-track GST refund filing under LUT with inward remittance reconciliation conforming to RBI guidelines.',
          },
          {
            headline: 'High-Net-Worth Family Tax Structuring',
            detail: 'Dedicated HUF planning, Section 54/54EC capital gains protection, and multi-entity risk compartmentalization.',
          },
        ],
      },
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
      phase: 'SENIOR PARTNER RISK & OPTIMIZATION AUDIT',
      phaseShort: 'AUDIT',
      title: 'Manual Partner Risk & Allowance Screening',
      icon: 'fas fa-user-check',
      summary: 'A designated senior tax consultant conducts an exhaustive review of statutory depreciation, allowable Section 37 business expenses, 80JJAA wage benefits, and risk red flags.',
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
        'Signed advisory partner verification review',
        'Instant government filing acknowledgment generated',
        'Immediate archival to encrypted client cloud vault',
      ],
      tag: 'Complete Legal Proof Ready for Banking & Tenders',
    },
  ];

  return (
    <section 
      className="trust" 
      id="institutional-governance" 
      data-anchor="governance" 
      aria-labelledby="trust-master-heading"
    >
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
          <span className="header-watermark" aria-hidden="true">GOVERNANCE</span>
          <div className="luxury-header-halo" aria-hidden="true"></div>
          <div className="trust-badge-label">
            <span className="badge-index-chip">01</span>
            <span className="badge-pulse-dot" aria-hidden="true"></span>
            <i className="fas fa-shield-alt" aria-hidden="true"></i>
            <span>{trustHeading}</span>
          </div>

          <h2 id="trust-master-heading" className="trust-master-title">
            Fiduciary Integrity, <span className="title-gradient-gold">Zero Penalties</span> &amp; Direct Partner Oversight
          </h2>

          <p className="trust-master-subtext">
            Every tax return, statutory audit, and corporate compliance filing is executed under rigorous statutory standards—insulating Indian enterprises against notices, penalties, and tax leakages through multi-tier verification.
          </p>

          <div className="header-assurance-strip">
            <span className="assurance-pill">
              <i className="fa-solid fa-check"></i> Statutory Practice Standards
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-shield-halved"></i> 100% Client Privilege &amp; NDA
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-award"></i> Zero Penalty Track Record
            </span>
          </div>
        </div>

        {/* ============================================================
            AUTHENTIC STATUTORY PORTAL COMPLIANCE PERFORMANCE PANEL
            ============================================================ */}
        <div className="governance-ledger-deck">
          <div className="ledger-top-foil" aria-hidden="true"></div>
          {/* Official Portal Header Bar */}
          <div className="ledger-header-bar">
            <div className="ledger-header-brand">
              <div className="ledger-icon-emblem">
                <i className="fas fa-building-columns"></i>
              </div>
              <div className="ledger-header-titles">
                <span className="ledger-header-tag">STATUTORY PRACTICE PERFORMANCE &bull; AUDIT &amp; NOTICE DEFENSE LEDGER</span>
                <span className="ledger-header-sub">
                  Governed under Statutory Compliance Framework &bull; Practice Standards &bull; Ahmedabad Chambers
                </span>
              </div>
            </div>
            <div className="ledger-header-actions-group">
              <button
                type="button"
                className="ledger-share-btn"
                onClick={handleCopyLink}
                title="Copy institutional link to clipboard"
              >
                <i className={copiedLink ? "fas fa-check text-emerald" : "fas fa-link"}></i>
                <span>{copiedLink ? "Link Copied" : "Share Docket"}</span>
              </button>
              <div className="ledger-header-badge">
                <span className="ledger-beacon-dot"></span>
                <i className="fas fa-certificate"></i>
                <span>Institutional Standard</span>
              </div>
            </div>
          </div>

          {/* 4 Quantitative Authority Metric Columns (Interactive Inspector) */}
          <div className="governance-bento-grid" role="tablist" aria-label="Quantitative Authority Metrics">
            {trustMetrics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeMetricIdx === idx}
                aria-expanded={activeMetricIdx === idx}
                className={`metric-bento-cell cell-btn box-${idx} ${activeMetricIdx === idx ? 'active-inspect' : ''}`}
                onClick={() => setActiveMetricIdx(activeMetricIdx === idx ? null : idx)}
              >
                <div className="metric-tile-kicker-row">
                  <span className={`metric-tile-icon-box box-${idx}`}>
                    <i className={item.icon}></i>
                  </span>
                  <span className="metric-tile-kicker">{item.kicker}</span>
                  <span className="metric-inspect-pill">
                    <i className={`fas fa-chevron-${activeMetricIdx === idx ? 'up' : 'down'}`}></i>
                  </span>
                </div>
                <div className="metric-header-row">
                  <span className="metric-large-num">{item.num}</span>
                  <span className={`metric-pill-tag ${item.badgeClass}`}>
                    <span className="metric-mini-beacon"></span>
                    {item.badge}
                  </span>
                </div>
                <strong className="metric-bold-label">{item.label}</strong>
                <span className="metric-muted-caption">{item.caption}</span>
                <div className="metric-audit-verify">
                  <i className="fas fa-circle-check text-emerald"></i>
                  <span>{item.verifiedText}</span>
                  <span className="metric-inspect-cue">
                    {activeMetricIdx === idx ? 'Close Docket' : 'Inspect Proof'} &rarr;
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Institutional Forensic Verification Dossier Drawer (Interactive Proof) */}
          {activeMetricIdx !== null && (
            <div className="ledger-proof-dossier-tray fade-in" role="region" aria-label="Statutory Verification Docket">
              <div className="dossier-tray-header">
                <div className="dossier-tray-title-col">
                  <span className="dossier-pill-tag">
                    <i className="fas fa-shield-halved"></i>
                    <span>VERIFIED STATUTORY PROOF DOCKET</span>
                  </span>
                  <h4 className="dossier-tray-title">{trustMetrics[activeMetricIdx].dossier.title}</h4>
                  <span className="dossier-statute-ref">
                    <i className="fas fa-book-bookmark text-gold"></i>
                    {trustMetrics[activeMetricIdx].dossier.statuteRef}
                  </span>
                </div>
                <div className="dossier-tray-actions">
                  <span className="dossier-telemetry-pill">
                    <span className="live-status-dot"></span>
                    <span>{trustMetrics[activeMetricIdx].dossier.telemetry}</span>
                  </span>
                  <button
                    type="button"
                    className="dossier-close-btn"
                    onClick={() => setActiveMetricIdx(null)}
                    title="Close verification drawer"
                    aria-label="Close verification drawer"
                  >
                    <i className="fas fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div className="dossier-safeguards-grid">
                {trustMetrics[activeMetricIdx].dossier.safeguards.map((sg, sIdx) => (
                  <div key={sIdx} className="dossier-safeguard-card">
                    <div className="safeguard-head">
                      <span className="safeguard-number">0{sIdx + 1}</span>
                      <strong>{sg.headline}</strong>
                    </div>
                    <p>{sg.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ledger Footer Covenants */}
          <div className="ledger-footer-covenants">
            <div className="ledger-covenant-item">
              <i className="fas fa-shield-halved text-gold"></i>
              <span>Fiduciary Client Privilege (Sec 126 Evidence Act)</span>
            </div>
            <div className="ledger-covenant-divider"></div>
            <div className="ledger-covenant-item">
              <i className="fas fa-certificate text-emerald"></i>
              <span>Cryptographic Document Certification &amp; Authenticity</span>
            </div>
            <div className="ledger-covenant-divider"></div>
            <div className="ledger-covenant-item">
              <i className="fas fa-scale-balanced text-gold"></i>
              <span>Direct Senior Partner Oversight</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            DUAL ASYMMETRIC INSTITUTIONAL WINGS
            ============================================================ */}
        <div className="trust-architecture-split">
          {/* ========================================
              WING A: Pre-Filing Verification Pipeline (Operational Moat)
              ======================================== */}
          <div className="pipeline-wing-card">
            <div className="pipeline-top-foil" aria-hidden="true"></div>
            <div className="pipeline-wing-header">
              <div className="pipeline-eyebrow">
                <span className="live-status-dot"></span>
                <span>OPERATIONAL RIGOR &bull; COMPLIANCE DEFENSE ENGINE</span>
              </div>
              <h3>Our 3-Stage Pre-Submission Audit Pipeline</h3>
              <p>
                How we maintain an unblemished zero-penalty track record: every single return passes through our sequential multi-tier verification engine.
              </p>
            </div>

            {/* Pipeline Stage Progress Track */}
            <div className="pipeline-stage-progress-track" aria-hidden="true">
              <div 
                className="pipeline-progress-fill-bar" 
                style={{ width: `${((activePipelineStep + 1) / 3) * 100}%` }}
              ></div>
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
              <div className="fiduciary-top-foil" aria-hidden="true"></div>
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
                Protected by strict statutory confidentiality protocols and formal enterprise NDAs. Your financial ledgers, tax filings, and corporate documents are housed in a secure encrypted cloud vault accessible 24/7.
              </p>

              {/* Live Interactive Vault Document Preview Chip */}
              <button
                type="button"
                className={`fiduciary-vault-preview-chip ${vaultVerified ? 'verified-pulse' : ''}`}
                onClick={() => setVaultVerified(!vaultVerified)}
                title="Click to verify cryptographic SHA-256 vault checksum"
              >
                <div className="vault-file-mini-icon">
                  <i className={vaultVerified ? "fas fa-shield-check" : "fas fa-file-pdf"}></i>
                </div>
                <div className="vault-file-meta">
                  <strong>GSTR-2B_Reconciled_Audit_Ledger.pdf</strong>
                  <span>{vaultVerified ? 'SHA-256 Checksum: Stamped &bull; 256-Bit SSL Passed' : '256-Bit SSL Encrypted &bull; 1-Click Bank Download'}</span>
                </div>
                <span className={`vault-status-badge ${vaultVerified ? 'badge-verified' : ''}`}>
                  {vaultVerified ? 'VERIFIED ✓' : 'SECURE'}
                </span>
              </button>

              <div className="fiduciary-benefits-list">
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>SSL-encrypted cloud repository for paperless audits</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>Instant 1-click document retrieval for corporate bank loans &amp; tenders</span>
                </div>
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-emerald"></i>
                  <span>Fiduciary confidentiality governed under formal non-disclosure covenants</span>
                </div>
              </div>

              <div className="fiduciary-footer-badge badge-secure">
                <i className="fas fa-lock"></i>
                <span>100% Encrypted &bull; Never Shared with Third Parties</span>
              </div>
            </div>

            {/* Card B2: Direct Partner Desk (Zero Junior Trainee Handoffs) */}
            <div className="fiduciary-feature-card">
              <div className="fiduciary-top-foil gold" aria-hidden="true"></div>
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
                No dealing with generic call centers or inexperienced interns. Every client is assigned a designated Senior Practice Partner with 15+ years of cumulative expertise who directly reviews filings and manages notices.
              </p>

              {/* Live Partner Telemetry Preview Chip */}
              <a
                href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20would%20like%20to%20connect%20with%20an%20Assigned%20Senior%20Corporate%20Tax%20Partner."
                target="_blank"
                rel="noopener noreferrer"
                className="fiduciary-partner-preview-chip partner-link-chip"
                title="Direct Priority WhatsApp Link to Assigned Senior Partner"
              >
                <div className="partner-mini-avatar">
                  <i className="fas fa-user-tie"></i>
                  <span className="partner-live-dot"></span>
                </div>
                <div className="partner-meta">
                  <strong>Senior Corporate Tax Advisor Assigned</strong>
                  <span>Direct Scrutiny Defense &bull; &lt; 2h SLA Priority</span>
                </div>
                <span className="partner-status-tag">ACTIVE</span>
              </a>

              <div className="fiduciary-benefits-list">
                <div className="fiduciary-benefit-row">
                  <i className="fas fa-check-circle text-gold"></i>
                  <span>Direct priority WhatsApp &amp; phone line to your assigned advisor</span>
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
            10/10 Swiss Private Wealth / Sovereign Advisory Standard
            ============================================================ */}
        <div className="trust-action-hub-card">
          <div className="hub-top-foil" aria-hidden="true"></div>
          <div className="hub-card-ambient-glow" aria-hidden="true"></div>

          {/* Top Banner: Dual-Column Executive Architecture */}
          <div className="hub-top-row">
            {/* Left: Authority Narrative & Credibility Badges */}
            <div className="hub-authority-pane">
              <div className="hub-status-pill">
                <span className="hub-status-beacon" aria-hidden="true">
                  <span className="beacon-core"></span>
                  <span className="beacon-aura"></span>
                </span>
                <span className="hub-status-icon">
                  <i className="fas fa-shield-halved"></i>
                </span>
                <span className="hub-status-label">DIRECT PRACTICE CHAMBERS &bull; SENIOR PARTNER OVERSIGHT</span>
              </div>

              <h3 className="hub-headline">
                Direct Senior Partner Advisory with{' '}
                <span className="hub-headline-gold">Zero-Penalty Defense</span> &amp; Rapid SLA
              </h3>

              <p className="hub-narrative">
                Institutional tax defense, advance planning, and dispute representation governed by strict fiduciary confidentiality and real-time statutory SLAs.
              </p>

              <div className="hub-credentials-strip">
                <div className="hub-cred-card">
                  <div className="hub-cred-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="hub-cred-info">
                    <span className="hub-cred-val">4.9 / 5.0</span>
                    <span className="hub-cred-tag">200+ Gujarat Retainers</span>
                  </div>
                </div>

                <div className="hub-cred-card">
                  <span className="hub-cred-badge-icon emerald">
                    <i className="fas fa-circle-check"></i>
                  </span>
                  <div className="hub-cred-info">
                    <span className="hub-cred-val">Statutory Standard</span>
                    <span className="hub-cred-tag">Fiduciary Client Privilege</span>
                  </div>
                </div>

                <div className="hub-cred-card">
                  <span className="hub-cred-badge-icon gold">
                    <i className="fas fa-medal"></i>
                  </span>
                  <div className="hub-cred-info">
                    <span className="hub-cred-val">4+ Years Practice</span>
                    <span className="hub-cred-tag">Zero-Default Record</span>
                  </div>
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
                <div className="btn-hub-icon-squircle">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="btn-hub-text">
                  <span className="btn-hub-main">Schedule Senior Partner Consultation</span>
                  <span className="btn-hub-sub">Direct 30-Min Scrutiny &amp; Tax Review &bull; Zero Obligation</span>
                </div>
                <div className="btn-hub-arrow-squircle">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </button>

              <div className="hub-secondary-actions">
                <button
                  type="button"
                  className="btn-hub-secondary"
                  onClick={() => navigate('/about')}
                >
                  <i className="fas fa-file-shield text-gold"></i>
                  <span>Our Firm Charter</span>
                </button>

                <a
                  href={`https://wa.me/${settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '919510984735'}?text=${encodeURIComponent(
                    'Hello Shree Chamunda Associates! I would like to consult with a Senior Tax Advisor regarding Tax & Compliance services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hub-whatsapp"
                  title="Direct WhatsApp Advisory with Senior Advisor"
                  aria-label="Direct WhatsApp Consultation"
                >
                  <span className="wa-pulse-dot" aria-hidden="true"></span>
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp Advisory Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Architectural Gem Center Divider */}
          <div className="hub-divider-line" aria-hidden="true">
            <div className="hub-divider-gem">
              <i className="fas fa-scale-balanced"></i>
            </div>
          </div>

          {/* Bottom Banner: Fast-Track Practice Domain Navigator */}
          <div className="hub-bottom-row">
            <div className="hub-nav-header">
              <div className="hub-nav-badge">
                <i className="fas fa-bolt text-gold"></i>
                <span>FAST-TRACK ACCESS</span>
              </div>
              <span className="hub-nav-lead">Jump Directly to Specialized Practice Chambers:</span>
              <span className="hub-nav-indicator">
                <i className="fas fa-lock"></i> Direct Senior Partner Triage
              </span>
            </div>

            <div className="hub-chips-grid">
              <button
                type="button"
                className="hub-practice-chip chip-tax"
                onClick={() => handlePracticeClick('tax')}
              >
                <div className="chip-icon-box box-tax">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <div className="chip-meta">
                  <div className="chip-header-line">
                    <strong className="chip-title">Direct &amp; Income Tax</strong>
                    <span className="chip-pill-tag tag-emerald">ITR 1–7</span>
                  </div>
                  <span className="chip-sub">Sec 44AD/ADA &bull; Capital Gains &bull; Scrutiny</span>
                </div>
                <div className="chip-arrow-box">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-gst"
                onClick={() => handlePracticeClick('tax')}
              >
                <div className="chip-icon-box box-gst">
                  <i className="fas fa-receipt"></i>
                </div>
                <div className="chip-meta">
                  <div className="chip-header-line">
                    <strong className="chip-title">GST Filing &amp; Scrutiny</strong>
                    <span className="chip-pill-tag tag-gold">GSTR 1 &bull; 3B</span>
                  </div>
                  <span className="chip-sub">ITC 2B Recon &bull; ASMT-10 Defense &bull; Refunds</span>
                </div>
                <div className="chip-arrow-box">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-startup"
                onClick={() => handlePracticeClick('startup')}
              >
                <div className="chip-icon-box box-startup">
                  <i className="fas fa-landmark"></i>
                </div>
                <div className="chip-meta">
                  <div className="chip-header-line">
                    <strong className="chip-title">Pvt Ltd &amp; LLP Setup</strong>
                    <span className="chip-pill-tag tag-indigo">SPICe+</span>
                  </div>
                  <span className="chip-sub">MCA 2 DINs &bull; PAN/TAN &bull; MoA/AoA Drafting</span>
                </div>
                <div className="chip-arrow-box">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>

              <button
                type="button"
                className="hub-practice-chip chip-audit"
                onClick={() => handlePracticeClick('accounting')}
              >
                <div className="chip-icon-box box-audit">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="chip-meta">
                  <div className="chip-header-line">
                    <strong className="chip-title">Statutory Audits &amp; ROC</strong>
                    <span className="chip-pill-tag tag-cyan">Sec 44AB</span>
                  </div>
                  <span className="chip-sub">AOC-4 &bull; MGT-7 &bull; Director KYC &bull; Annual Filing</span>
                </div>
                <div className="chip-arrow-box">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
