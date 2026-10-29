import { useState } from 'react';
import { Link } from 'react-router-dom';
import './DeliveryProtocol.css';

const GATES = [
  {
    id: 1,
    roman: 'I',
    num: '01',
    gate: 'GATE 01',
    shortName: 'Forensic Intake',
    phase: 'Forensic Intake & Reconciliation',
    tagline: 'Pre-Filing Document Examination & Variance Audit',
    turnaround: 'Hours 0–24',
    icon: 'fa-solid fa-magnifying-glass-chart',
    accentColor: '#b8860b',
    themeClass: 'gate-theme-gold',
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
    governingStandard: 'Statutory Auditing Standard (SA 500) • Audit Evidence',
  },
  {
    id: 2,
    roman: 'II',
    num: '02',
    gate: 'GATE 02',
    shortName: 'Dual Partner Audit',
    phase: 'Dual Senior Partner Scrutiny',
    tagline: 'Two-Tier Independent Examination & Legal Tax Strategy',
    turnaround: 'Hours 24–48',
    icon: 'fa-solid fa-scale-balanced',
    accentColor: '#059669',
    themeClass: 'gate-theme-emerald',
    objective:
      'No computation is filed on junior execution alone. Every client mandate undergoes independent two-tier peer review by senior qualified Tax & Accounting Consultants applying the latest Finance Act notifications, legal deductions, and precedent case laws.',
    scopeItems: [
      {
        title: 'Tier-1 Regulatory Compliance Review',
        desc: 'Conducted by Senior Tax Counsel to verify statutory disallowances, transfer pricing thresholds, and withholding tax accuracy.',
      },
      {
        title: 'Tier-2 Lawful Tax Minimization',
        desc: 'Conducted by Managing Partner to optimize legitimate deductions, depreciation allowances, and entity-level tax positions.',
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
    governingStandard: 'Quality Control Standard • Peer Review Benchmarks',
  },
  {
    id: 3,
    roman: 'III',
    num: '03',
    gate: 'GATE 03',
    shortName: 'Class-3 DSC Filing',
    phase: 'Cryptographic Portal Dispatch',
    tagline: 'Class-3 Hardware DSC Execution & Direct Gateway Transfer',
    turnaround: 'Filing Day Execution',
    icon: 'fa-solid fa-stamp',
    accentColor: '#0284c7',
    themeClass: 'gate-theme-blue',
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
    shortName: 'Notice Defense',
    phase: 'Custodial Archival & Notice Defense',
    tagline: '7-Year Retainer Custody & Complimentary Scrutiny Defense',
    turnaround: '7-Year Continuous Retainer',
    icon: 'fa-solid fa-shield-halved',
    accentColor: '#b45309',
    themeClass: 'gate-theme-amber',
    objective:
      'Our professional liability does not terminate upon filing. All returns, working papers, and signed schedules are deposited into an encrypted digital vault, backed by 7-year complimentary scrutiny rejoinder defense by our senior tax advocates.',
    scopeItems: [
      {
        title: 'Encrypted Document Custody',
        desc: 'Perpetual cloud archival under secure encryption with multi-factor authentication, meeting mandatory statutory preservation guidelines.',
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
  const activeIndex = GATES.findIndex((g) => g.id === activeGateId);

  const handleNextGate = () => {
    const nextIdx = (activeIndex + 1) % GATES.length;
    setActiveGateId(GATES[nextIdx].id);
  };

  const handlePrevGate = () => {
    const prevIdx = (activeIndex - 1 + GATES.length) % GATES.length;
    setActiveGateId(GATES[prevIdx].id);
  };

  return (
    <section className="protocol-section" id="delivery-protocol">
      {/* Top Gold Gradient Glow Line */}
      <div className="protocol-accent-line" aria-hidden="true"></div>

      {/* Subtle Precision Geometric Background */}
      <div className="protocol-grid-backdrop" aria-hidden="true"></div>

      <div className="protocol-container">
        {/* ============================================================
            1. MODERN EXECUTIVE HEADER
            ============================================================ */}
        <header className="protocol-header text-center">
          <div className="protocol-eyebrow-pill">
            <span className="live-dot" aria-hidden="true"></span>
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <span>THE DELIVERY STANDARD &bull; 4-STAGE STATUTORY PROTOCOL</span>
          </div>

          <h2 className="protocol-main-title">
            The Fiduciary Delivery Protocol. <br className="br-desktop" />
            <span className="title-gradient-gold">Four Sequential Gates. Zero Statutory Variance.</span>
          </h2>

          <p className="protocol-lead-text">
            Every client filing passes through an uncompromising forensic verification pipeline before government upload, backed by direct senior partner accountability and 7-year scrutiny defense.
          </p>
        </header>

        {/* ============================================================
            2. INTERACTIVE 4-GATE PIPELINE STEPPER
            ============================================================ */}
        <div className="pipeline-stepper-wrap" role="tablist" aria-label="Statutory Delivery Gates">
          <div className="pipeline-track-bar" aria-hidden="true">
            <div
              className="pipeline-progress-fill"
              style={{ width: `${(activeIndex / (GATES.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="pipeline-gates-grid">
            {GATES.map((gate, idx) => {
              const isActive = gate.id === activeGateId;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={gate.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`pipeline-gate-btn ${gate.themeClass} ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                  onClick={() => setActiveGateId(gate.id)}
                >
                  <div className="gate-btn-top">
                    <span className="gate-num-circle">
                      {isPast ? <i className="fa-solid fa-check"></i> : gate.num}
                    </span>
                    <span className="gate-turnaround-pill">{gate.turnaround}</span>
                  </div>

                  <div className="gate-btn-body">
                    <span className="gate-step-label">{gate.gate}</span>
                    <strong className="gate-step-name">{gate.shortName}</strong>
                  </div>

                  {isActive && <div className="gate-active-notch" aria-hidden="true"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            3. ACTIVE GATE EXECUTIVE DOSSIER (COMMAND CONSOLE)
            ============================================================ */}
        <div className="dossier-console-card fade-in" key={activeGate.id}>
          {/* Console Header Bar */}
          <div className="console-header-bar">
            <div className="console-header-left">
              <div className="console-gate-badge">
                <i className={activeGate.icon}></i>
                <span>{activeGate.gate} OF 04 &bull; {activeGate.shortName.toUpperCase()}</span>
              </div>
              <h3 className="console-phase-title">{activeGate.phase}</h3>
              <p className="console-tagline">{activeGate.tagline}</p>
            </div>

            <div className="console-header-right">
              <div className="console-sla-badge">
                <i className="fa-regular fa-clock text-amber"></i>
                <span>SLA: {activeGate.turnaround}</span>
              </div>
              <div className="console-standard-seal">
                <i className="fa-solid fa-scale-balanced text-emerald"></i>
                <span>{activeGate.governingStandard}</span>
              </div>
            </div>
          </div>

          {/* Mandate Fiduciary Objective Callout */}
          <div className="console-objective-callout">
            <div className="objective-icon-wrap">
              <i className="fa-solid fa-quote-left"></i>
            </div>
            <div className="objective-content">
              <span className="objective-kicker">MANDATE FIDUCIARY DIRECTIVE</span>
              <p className="objective-paragraph">{activeGate.objective}</p>
            </div>
          </div>

          {/* 2-Column Operational Pipeline */}
          <div className="console-operations-grid">
            {/* Left: Forensic Verification Procedures */}
            <div className="console-procedures-col">
              <div className="col-header-row">
                <span className="col-kicker">
                  <i className="fa-solid fa-list-check text-gold"></i>
                  <span>Forensic Verification Protocol</span>
                </span>
                <span className="col-counter">3 Mandatory Safeguards</span>
              </div>

              <div className="procedures-stack">
                {activeGate.scopeItems.map((item, idx) => (
                  <div key={idx} className="procedure-item-card">
                    <div className="proc-index-squircle">0{idx + 1}</div>
                    <div className="proc-text-wrap">
                      <strong className="proc-title">{item.title}</strong>
                      <p className="proc-desc">{item.desc}</p>
                    </div>
                    <span className="proc-verified-pill">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Verified</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Certified Deliverables Docket */}
            <div className="console-deliverables-col">
              <div className="col-header-row">
                <span className="col-kicker">
                  <i className="fa-solid fa-box-archive text-emerald"></i>
                  <span>Certified Mandate Deliverables</span>
                </span>
                <span className="col-counter">Official Audit Trail</span>
              </div>

              <div className="deliverables-docket-card">
                <div className="docket-items-list">
                  {activeGate.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="docket-item-row">
                      <div className="docket-doc-icon">
                        <i className="fa-solid fa-file-shield"></i>
                      </div>
                      <div className="docket-doc-text">
                        <strong>{del}</strong>
                        <span>Official Stamped Record &bull; Client Vault</span>
                      </div>
                      <span className="docket-status-badge">
                        <i className="fa-solid fa-check"></i> Certified
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sign-Off Security Protocol Box */}
                <div className="docket-security-footer">
                  <div className="sec-footer-top">
                    <span className="sec-badge">
                      <i className="fa-solid fa-lock text-gold"></i>
                      <span>Senior Partner Sign-off Protocol</span>
                    </span>
                    <span className="sec-live">Audit Immunity Vetted</span>
                  </div>
                  <p className="sec-footer-text">
                    All calculations are cross-examined against central CPC &amp; GSTN algorithmic risk selection rules prior to electronic signature execution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Console Bottom Action Bar */}
          <div className="console-bottom-actions">
            <div className="stepper-nav-buttons">
              <button
                type="button"
                className="btn-step-nav btn-step-prev"
                onClick={handlePrevGate}
                title="Go to previous gate"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Previous Gate</span>
              </button>

              <button
                type="button"
                className="btn-step-nav btn-step-next"
                onClick={handleNextGate}
                title="Go to next gate"
              >
                <span>Next: Gate 0{((activeIndex + 1) % GATES.length) + 1}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div className="console-cta-wrap">
              <Link to="/contact" className="btn-console-mandate">
                <i className="fa-solid fa-file-contract"></i>
                <span>Initiate Mandate Under This Gate</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================
            4. BOTTOM PRESTIGE ASSURANCE & INTAKE DESK
            ============================================================ */}
        <div className="protocol-prestige-card">
          <div className="prestige-card-inner">
            <div className="prestige-info-group">
              <div className="prestige-tag-pill">
                <span className="prestige-live-dot"></span>
                <span>COMPLIMENTARY 7-YEAR NOTICE DEFENSE</span>
              </div>
              <h3 className="prestige-title">Zero Statutory Variance. Complete Legal Assurance.</h3>
              <p className="prestige-desc">
                If an inquiry or scrutiny notice under Section 143(1), 148, or GST Section 61 is issued on any filing prepared under our protocol, our senior partners draft the forensic rejoinder and represent your firm at zero additional surcharge.
              </p>
            </div>

            <div className="prestige-actions-group">
              <Link to="/contact" className="btn-prestige-primary">
                <i className="fa-solid fa-calendar-check"></i>
                <span>Schedule Forensic Review</span>
              </Link>
              <a
                href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20would%20like%20to%20consult%20regarding%20your%20Practice%20Delivery%20Protocol."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-prestige-whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Direct WhatsApp Helpline</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryProtocol;