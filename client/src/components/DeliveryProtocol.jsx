import { useState } from 'react';
import { Link } from 'react-router-dom';
import './DeliveryProtocol.css';

const GATES = [
  {
    id: 1,
    roman: 'I',
    num: '01',
    gate: 'GATE 01',
    phase: 'Forensic Intake & Reconciliation',
    tagline: 'Pre-Filing Document Examination & Variance Audit',
    turnaround: 'Turnaround: Hours 0–24',
    icon: 'fas fa-magnifying-glass-chart',
    accentColor: '#b8860b', // Rich antique gold
    objective:
      'We operate under an absolute zero-variance protocol. Prior to preparing any statutory return, our forensic team systematically reconciles financial books against all official government tax streams to isolate discrepancies before they trigger automated department notices.',
    scopeItems: [
      {
        title: '3-Way Ledger Reconciliation',
        desc: 'Independent cross-matching of Books of Accounts against Form 26AS, AIS/TIS data streams, and GSTR-2B purchase ledgers.',
      },
      {
        title: 'Input Tax Credit (ITC) Leakage Recovery',
        desc: 'Identification of missing vendor filings, invalid GSTINs, and recovery of eligible ITC that would otherwise lapse.',
      },
      {
        title: 'Pre-Emptive Defect Filtering',
        desc: 'Granular mathematical validation of TDS credits, advance tax challans, and ledger balances to preempt Section 143(1) adjustments.',
      },
    ],
    deliverables: [
      'Reconciled Forensic Trial Balance',
      'Document Discrepancy Memo',
      'Statutory Eligibility Certificate',
    ],
    governingStandard: 'ICAI Standard on Auditing (SA 500) • Audit Evidence',
  },
  {
    id: 2,
    roman: 'II',
    num: '02',
    gate: 'GATE 02',
    phase: 'Dual Senior Partner Scrutiny',
    tagline: 'Two-Tier Independent Examination & Legal Tax Strategy',
    turnaround: 'Turnaround: Hours 24–48',
    icon: 'fas fa-scale-balanced',
    accentColor: '#0f766e', // Deep Teal
    objective:
      'No computation is filed on junior execution alone. Every client mandate undergoes independent two-tier peer review by senior qualified Chartered Accountants applying the latest Finance Act notifications, legal deductions, and precedent case laws.',
    scopeItems: [
      {
        title: 'Tier-1 Regulatory Compliance Review',
        desc: 'Conducted by Senior Tax Counsel (FCA) to verify statutory disallowances, transfer pricing thresholds, and withholding tax accuracy.',
      },
      {
        title: 'Tier-2 Lawful Tax Minimization',
        desc: 'Conducted by Managing Partner (FCA) to optimize legitimate deductions, depreciation allowances, and entity-level tax positions.',
      },
      {
        title: 'Scrutiny Algorithm Risk Profiling',
        desc: 'Pre-filing assessment against automated selection criteria used by CPC Bangalore and the Central GST Risk Management Directorate.',
      },
    ],
    deliverables: [
      'Forensic Tax Computation Sheet',
      'Dual Partner Sign-off Docket',
      'Section 80 / Depreciation Schedule',
    ],
    governingStandard: 'ICAI Peer Review Board Standard • SQC 1 Quality Control',
  },
  {
    id: 3,
    roman: 'III',
    num: '03',
    gate: 'GATE 03',
    phase: 'Cryptographic Portal Dispatch',
    tagline: 'Class-3 Hardware DSC Execution & Direct Gateway Transfer',
    turnaround: 'Turnaround: Statutory Filing Day',
    icon: 'fas fa-stamp',
    accentColor: '#1e40af', // Royal Blue
    objective:
      'Final submission is executed through direct government gateways using Class-3 hardware cryptographic Digital Signature Certificates (DSC). Acknowledgement Reference Numbers (ARN) and stamped ITR-V receipts are generated and archived immediately.',
    scopeItems: [
      {
        title: 'Hardware Token Cryptographic Signing',
        desc: 'Tamper-proof digital signing using licensed Class-3 cryptographic tokens conforming to the Information Technology Act, 2000.',
      },
      {
        title: 'Direct Government API Transmission',
        desc: 'Live encrypted submission directly to the Income Tax Directorate, GST Common Portal (GSTN), and Ministry of Corporate Affairs (MCA-21).',
      },
      {
        title: 'Instant Official Receipt Issuance',
        desc: 'Immediate dispatch of government-generated Acknowledgement Reference Numbers (ARN), ITR-V forms, and MCA Challans to the client.',
      },
    ],
    deliverables: [
      'Official Government ITR-V / ARN Receipt',
      'Digitally Stamped XML/JSON Record',
      'Statutory Filing Date Certificate',
    ],
    governingStandard: 'Information Technology Act • 2048-bit DSC Cryptography',
  },
  {
    id: 4,
    roman: 'IV',
    num: '04',
    gate: 'GATE 04',
    phase: 'Custodial Archival & Notice Defense',
    tagline: '7-Year Retainer Custody & Complimentary Scrutiny Defense',
    turnaround: 'Turnaround: 7-Year Continuous Retainer',
    icon: 'fas fa-shield-halved',
    accentColor: '#166534', // Deep British Emerald
    objective:
      'Our professional liability does not terminate upon filing. All returns, working papers, and signed schedules are deposited into an encrypted digital vault, backed by 7-year complimentary scrutiny rejoinder defense by our senior tax advocates.',
    scopeItems: [
      {
        title: 'Encrypted Document Custody',
        desc: 'Perpetual cloud archival under 256-bit encryption with multi-factor authentication, meeting mandatory statutory preservation guidelines.',
      },
      {
        title: 'Complimentary Notice Rejoinder Defense',
        desc: 'If an inquiry under Section 143(1), 148, or GST Section 61 is issued, our partners draft the forensic reply and appear on your behalf.',
      },
      {
        title: 'Proactive Forward Tax Forecasting',
        desc: 'Year-round advisory desk for advance tax planning, cash-flow withholding forecasts, and business restructuring guidance.',
      },
    ],
    deliverables: [
      '7-Year Client Vault Access Key',
      'Statutory Notice Defense Retainer',
      'Annual Compliance Health Certificate',
    ],
    governingStandard: 'Companies Act Sec 128 • 8-Year Statutory Books Custody',
  },
];

const DeliveryProtocol = () => {
  const [activeGateId, setActiveGateId] = useState(1);
  const activeGate = GATES.find((g) => g.id === activeGateId) || GATES[0];

  return (
    <section className="chartered-protocol-section" id="delivery-protocol">
      {/* Top Accent Line */}
      <div className="chartered-accent-line" aria-hidden="true"></div>

      <div className="chartered-container">
        {/* Section Header */}
        <div className="chartered-header text-center">
          <div className="chartered-eyebrow">
            <span className="chartered-eyebrow-dot"></span>
            <span>PRACTICE GOVERNANCE // STANDARD OPERATING PROCEDURE</span>
          </div>

          <h2 className="chartered-main-title">
            The Chartered Delivery Protocol
          </h2>

          <p className="chartered-lead-text">
            Four sequential forensic gates. Zero statutory variance. Every client mandate protected under direct partner accountability.
          </p>

          <div className="chartered-header-divider" aria-hidden="true">
            <span className="divider-line"></span>
            <span className="divider-crest"><i className="fas fa-landmark"></i></span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* 4 Core Practice Safeguards Bar */}
        <div className="chartered-safeguards-bar">
          <div className="safeguard-pillar">
            <div className="safeguard-marker">01</div>
            <div className="safeguard-body">
              <span className="safeguard-title">Zero-Variance Intake</span>
              <span className="safeguard-detail">3-way reconciliation (Books vs 26AS vs AIS vs 2B)</span>
            </div>
          </div>

          <div className="safeguard-pillar">
            <div className="safeguard-marker">02</div>
            <div className="safeguard-body">
              <span className="safeguard-title">Dual CA Partner Review</span>
              <span className="safeguard-detail">Independent peer scrutiny with zero junior handover</span>
            </div>
          </div>

          <div className="safeguard-pillar">
            <div className="safeguard-marker">03</div>
            <div className="safeguard-body">
              <span className="safeguard-title">Class-3 DSC Gateways</span>
              <span className="safeguard-detail">Direct cryptographic transmission with instant official ARN</span>
            </div>
          </div>

          <div className="safeguard-pillar">
            <div className="safeguard-marker">04</div>
            <div className="safeguard-body">
              <span className="safeguard-title">7-Year Notice Defense</span>
              <span className="safeguard-detail">Complimentary appellate representation before tax authorities</span>
            </div>
          </div>
        </div>

        {/* Interactive Gate Stepper & Executive Briefing */}
        <div className="chartered-interactive-layout">
          {/* Left Column: Gate Selector & Timeline Nav */}
          <div className="chartered-stepper-nav">
            <div className="stepper-nav-header">
              <span className="stepper-title">Statutory Gateway Pipeline</span>
              <span className="stepper-subtitle">Select any gate to inspect forensic procedures</span>
            </div>

            <div className="stepper-buttons-stack" role="tablist">
              {GATES.map((gate) => {
                const isSelected = gate.id === activeGateId;
                return (
                  <button
                    key={gate.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`gate-nav-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActiveGateId(gate.id)}
                  >
                    <div className="gate-nav-indicator" aria-hidden="true"></div>
                    <div className="gate-nav-meta">
                      <span className="gate-roman-badge">{gate.roman}</span>
                      <span className="gate-turnaround-tag">{gate.turnaround}</span>
                    </div>
                    <h3 className="gate-nav-phase">{gate.phase}</h3>
                    <p className="gate-nav-tagline">{gate.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Executive Dossier for Active Gate */}
          <div className="chartered-dossier-card">
            {/* Dossier Header */}
            <div className="dossier-card-header">
              <div className="dossier-title-group">
                <span className="dossier-gate-chip">
                  <i className="fas fa-file-contract"></i>
                  <span>OFFICIAL SPECIFICATION // {activeGate.gate}</span>
                </span>
                <h3 className="dossier-phase-title">{activeGate.phase}</h3>
                <p className="dossier-subtitle">{activeGate.tagline}</p>
              </div>

              <div className="dossier-emblem-badge" aria-hidden="true">
                <span className="emblem-roman">{activeGate.roman}</span>
                <span className="emblem-label">GATE {activeGate.num}</span>
              </div>
            </div>

            {/* Objective Statement */}
            <div className="dossier-objective-box">
              <span className="objective-label">MANDATE OBJECTIVE &bull; STANDARD OPERATING RIGOR</span>
              <p className="objective-text">{activeGate.objective}</p>
            </div>

            {/* Procedural Rigor Stack */}
            <div className="dossier-procedures-section">
              <h4 className="procedures-title">
                <i className="fas fa-list-check"></i>
                <span>Forensic Procedures &amp; Statutory Scope:</span>
              </h4>

              <div className="procedures-list">
                {activeGate.scopeItems.map((item, idx) => (
                  <div key={idx} className="procedure-row">
                    <div className="procedure-number">{idx + 1}</div>
                    <div className="procedure-content">
                      <strong className="procedure-item-title">{item.title}</strong>
                      <p className="procedure-item-desc">{item.desc}</p>
                    </div>
                    <div className="procedure-verification-tag">
                      <i className="fas fa-certificate"></i> Verified
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables & Standard Footer */}
            <div className="dossier-footer-grid">
              <div className="dossier-deliverables-block">
                <span className="block-label">
                  <i className="fas fa-box-archive"></i> Certified Mandate Deliverables
                </span>
                <div className="deliverables-tags-group">
                  {activeGate.deliverables.map((del, dIdx) => (
                    <span key={dIdx} className="dossier-deliverable-chip">
                      <i className="fas fa-circle-check"></i> {del}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dossier-governance-block">
                <span className="block-label">
                  <i className="fas fa-scale-balanced"></i> Governing Compliance Standard
                </span>
                <div className="governance-seal-badge">
                  <i className="fas fa-award"></i>
                  <span>{activeGate.governingStandard}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Chronological Ribbon View (All 4 Gates in One Panoramic View) */}
        <div className="chartered-panoramic-section">
          <div className="panoramic-header text-center">
            <h3 className="panoramic-title">The End-to-End Engagement Pathway</h3>
            <p className="panoramic-subtitle">A chronological summary of your statutory journey from onboarding to 7-year archival.</p>
          </div>

          <div className="panoramic-timeline-track">
            {GATES.map((g, idx) => (
              <div key={g.id} className="panoramic-gate-step">
                <div className="step-marker-header">
                  <span className="step-circle">{g.num}</span>
                  {idx < GATES.length - 1 && <span className="step-connecting-bar" aria-hidden="true"></span>}
                </div>
                <div className="step-body-card">
                  <span className="step-turnaround-badge">{g.turnaround}</span>
                  <h4 className="step-card-title">{g.phase}</h4>
                  <p className="step-card-text">{g.tagline}</p>
                  <div className="step-standard-tag">
                    <i className="fas fa-shield-check"></i> {g.gate} Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Engagement Callout Card */}
        <div className="chartered-engagement-card">
          <div className="engagement-card-inner">
            <div className="engagement-text-group">
              <div className="engagement-prestige-badge">
                <span className="prestige-dot"></span>
                <span>CHARTERED ADVISORY MANDATE</span>
              </div>
              <h3 className="engagement-headline">Initiate Your Compliance Mandate</h3>
              <p className="engagement-description">
                Schedule a confidential consultation with a senior Chartered Accountant to review your books, pre-audit variances, and establish direct partner representation.
              </p>
            </div>

            <div className="engagement-action-buttons">
              <Link to="/contact" className="chartered-btn-primary">
                <span>Book Partner Advisory</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <a
                href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20would%20like%20to%20consult%20regarding%20your%20Chartered%20Delivery%20Protocol."
                target="_blank"
                rel="noopener noreferrer"
                className="chartered-btn-secondary"
              >
                <i className="fab fa-whatsapp"></i>
                <span>Direct WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryProtocol;
