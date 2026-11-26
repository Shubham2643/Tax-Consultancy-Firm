import { useState, useEffect, useMemo, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { submitContact } from '../api';
import './Careers.css';

const CULTURE_PILLARS = [
  {
    code: '01',
    title: 'High-Stakes Scrutiny Defense',
    tag: 'Sec 148 & CIT(A)',
    outcome: 'Direct Drafting Before Tax & Appellate Benches',
    accent: 'amber',
    icon: 'fa-solid fa-scale-balanced',
    desc: 'Draft legal replies for Section 148 reassessments, ASMT-10 mismatch notices, and CIT(Appeals) submissions backed by Supreme Court precedents.',
  },
  {
    code: '02',
    title: 'Digital-First Vault Practice',
    tag: 'GSTR-2B & Cloud Vault',
    outcome: 'Automated Reconciliation & Sec 128 Archival',
    accent: 'blue',
    icon: 'fa-solid fa-network-wired',
    desc: 'Operate modern cloud accounting infrastructure, algorithmic GSTR-2B reconciliation engines, and encrypted Section 128 client repositories.',
  },
  {
    code: '03',
    title: 'Dedicated Exam Support',
    tag: 'Structured Prep Leave',
    outcome: 'Guaranteed Scheduled Exam Study Windows',
    accent: 'emerald',
    icon: 'fa-solid fa-user-graduate',
    desc: 'Dedicated study leave support without compromise. Trainees receive scheduled preparation allowances for professional and university examinations.',
  },
  {
    code: '04',
    title: 'Meritocratic Partner Track',
    tag: 'Senior Counsel Equity',
    outcome: 'Performance-Linked Leadership Progression',
    accent: 'purple',
    icon: 'fa-solid fa-stairs',
    desc: 'We develop long-term advisory leaders, not transactional desk operators. High-impact associates earn clear progression toward practice leadership.',
  },
];

const OPEN_POSITIONS = [
  {
    id: 'articleship',
    code: 'TRACK 01',
    track: 'trainee',
    accent: 'amber',
    title: 'Tax & Audit Trainee (Direct & Indirect Tax)',
    department: 'Statutory Practice & Appellate Litigation',
    type: 'Full-Time Internship / Trainee',
    stipend: 'Structured Monthly Stipend + Performance Incentives',
    eligibility: 'B.Com / M.Com / Inter Students / Commerce Graduates',
    badge: 'TRAINEE INTAKE',
    summary:
      'Granular, high-exposure practical training covering Section 143(3) scrutiny defense, GSTR-2B forensic matching, CIT(A) appellate rejoinder drafting, and MCA SPICe+ incorporations.',
    exposure: [
      'Direct representation drafting before Assessing Officers & CIT(A)',
      'Forensic purchase register vs. GSTR-2B input tax credit reconciliation',
      'Corporate Tax Audits under Section 44AB (Form 3CA/3CD)',
      'Dedicated exam preparatory leave for professional exam attempts',
    ],
  },
  {
    id: 'semi-qualified',
    code: 'TRACK 02',
    track: 'operations',
    accent: 'blue',
    title: 'Audit Senior / Semi-Qualified Tax Associate',
    department: 'Corporate Audit & Compliance Desk',
    type: 'Full-Time Permanent',
    stipend: 'Competitive Corporate Package + Performance Bonuses',
    eligibility: 'Commerce Graduate / Inter with 1–3 Yrs Exp',
    badge: 'EXPERIENCED HIRE',
    summary:
      'Lead client audit teams on statutory Section 44AB audits, multi-state GST reconciliations, and quarterly Form 24Q/26Q TDS returns for Gujarat manufacturing enterprises.',
    exposure: [
      'Supervision of junior trainees and books reconciliation workflows',
      'Autonomous drafting of ASMT-10 mismatch notice explanations',
      'Preparation of Corporate Balance Sheets & P&L in Tally Prime / Zoho',
      'Client liaison with corporate directors and factory CFOs',
    ],
  },
  {
    id: 'senior-tax-consultant',
    code: 'TRACK 03',
    track: 'leadership',
    accent: 'gold',
    title: 'Senior Tax Consultant (Assistant Manager - Tax & Audit)',
    department: 'Senior Advisory Chambers',
    type: 'Full-Time Senior Counsel',
    stipend: 'Industry Leading CTC + Retainer Profit-Sharing Track',
    eligibility: 'Commerce Post-Graduate / Tax Professional (1–3 Yrs Exp)',
    badge: 'LEADERSHIP TRACK',
    summary:
      'Work directly alongside Managing Partners in structuring M&A agreements, international tax transfer pricing, Section 148 reassessments, and startup Section 80-IAC tax exemptions.',
    exposure: [
      'Appellate case law research and ITAT bench representation drafting',
      'Statutory sign-off review on corporate ITR-6 & audit reports',
      'Virtual CFO client strategy meetings and executive MIS modeling',
      'Clear, meritocratic pathway towards junior practice leadership',
    ],
  },
  {
    id: 'senior-accountant',
    code: 'TRACK 04',
    track: 'operations',
    accent: 'emerald',
    title: 'Senior GST & Tally Accountant',
    department: 'Bookkeeping & GST Compliance Desk',
    type: 'Full-Time Permanent',
    stipend: 'Commensurate with Ledger & GST Experience',
    eligibility: 'B.Com / M.Com with 3+ Yrs Multi-Client Practice Exp',
    badge: 'OPERATIONS',
    summary:
      'Oversee monthly bookkeeping, bank reconciliations, E-Way Bill generation, and GSTR-1 / GSTR-3B filings for 25+ retained corporate clients.',
    exposure: [
      'Advanced Tally Prime and Zoho Books ledger curation',
      'Monthly PF ECR challans, ESIC, and Gujarat Professional Tax filings',
      'Vendor invoice cross-verification and payment voucher controls',
      'Direct client communication for missing vouchers and invoices',
    ],
  },
];

const TRACK_FILTERS = [
  { id: 'all', label: 'All Tracks', count: 4 },
  { id: 'trainee', label: 'Trainee & Internships', count: 1 },
  { id: 'operations', label: 'Audit & GST Desk', count: 2 },
  { id: 'leadership', label: 'Senior Leadership', count: 1 },
];

const HIRING_STEPS = [
  {
    num: '01',
    title: 'Direct Partner Screening',
    desc: 'Academic transcripts, software fluency, and registration review directly by Managing Partners.',
    eta: '< 48h Review',
  },
  {
    num: '02',
    title: 'Technical Chambers Walkthrough',
    desc: 'In-person practical discussion covering GST, ITR schedules, and scrutiny drafting at Nikol chambers.',
    eta: 'Nikol Office',
  },
  {
    num: '03',
    title: 'Formal Charter & Onboarding',
    desc: 'Structured training seat allocation, exam leave calendar setup, and immediate live portfolio access.',
    eta: 'Rapid Join',
  },
];

const INTAKE_ROLE_OPTIONS = [
  {
    value: 'Tax & Audit Trainee (Direct & Indirect Tax)',
    code: 'TRACK 01',
    label: 'Tax & Audit Trainee',
    sub: 'Full-Time Internship',
  },
  {
    value: 'Audit Senior / Semi-Qualified Tax Associate',
    code: 'TRACK 02',
    label: 'Audit Senior / Associate',
    sub: '1–3 Yrs Practice Exp',
  },
  {
    value: 'Senior Tax Consultant (Assistant Manager - Tax & Audit)',
    code: 'TRACK 03',
    label: 'Senior Tax Consultant',
    sub: 'Leadership Track',
  },
  {
    value: 'Senior GST & Tally Accountant',
    code: 'TRACK 04',
    label: 'Senior GST Accountant',
    sub: 'Operations • 3+ Yrs Exp',
  },
  {
    value: 'General Professional Application',
    code: 'GENERAL',
    label: 'General Practice Application',
    sub: 'Open Portfolio & Custom Consideration',
  },
];

const QUALIFICATION_OPTIONS = [
  { value: 'Commerce Graduate (B.Com / BBA)', label: 'B.Com / BBA', sub: 'Commerce Graduate' },
  { value: 'Post-Graduate (M.Com / MBA Finance)', label: 'M.Com / MBA', sub: 'Post-Graduate' },
  { value: 'Inter Student (Group 1 / Group 2 Cleared)', label: 'Inter Cleared', sub: 'Group 1 / Group 2' },
  { value: 'Experienced Tax & Accounts Senior', label: 'Experienced Senior', sub: 'Multi-Client Practice' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'Fresher (Seeking Internship)', sub: 'University & Trainee Intake' },
  { value: '1 - 2 Years Audit Experience', sub: 'Compliance & Field Audits' },
  { value: '3 - 5 Years Accounting/Tax Practice', sub: 'Independent Client Desk' },
  { value: '5+ Years Senior Associate', sub: 'Advisory & Scrutiny Lead' },
];

const CANDIDATE_READINESS_NORMS = [
  {
    icon: 'fa-solid fa-file-lines',
    title: 'Academic & Score Transcripts',
    desc: 'Carry B.Com / M.Com marksheets or Inter group certificates for partner review.',
  },
  {
    icon: 'fa-solid fa-laptop-code',
    title: 'Cloud & Ledger Fluency',
    desc: 'Comfort with Tally Prime, Zoho Books, Excel lookups, or GST portals is fast-tracked.',
  },
  {
    icon: 'fa-solid fa-calendar-check',
    title: 'Guaranteed Exam Study Leave',
    desc: 'Protected pre-examination study blocks logged directly on your training calendar.',
  },
  {
    icon: 'fa-solid fa-building-user',
    title: 'On-Site Nikol Immersion',
    desc: 'Full-time Chambers desk at Nikol, Ahmedabad (Mon–Sat, 10 AM–7 PM).',
  },
];

const Careers = () => {
  const [selectedRole, setSelectedRole] = useState('Tax & Audit Trainee (Direct & Indirect Tax)');
  const [inspectedRoleId, setInspectedRoleId] = useState('articleship');
  const [trackFilter, setTrackFilter] = useState('all');
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);
  const expSelectRef = useRef(null);
  const [appForm, setAppForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Ahmedabad',
    position: 'Tax & Audit Trainee (Direct & Indirect Tax)',
    regNumber: '',
    groupsStatus: 'Commerce Graduate (B.Com / BBA)',
    experienceYears: 'Fresher (Seeking Internship)',
    portfolioLink: '',
    coverNote: '',
  });

  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const handleOutside = (e) => {
      if (expSelectRef.current && !expSelectRef.current.contains(e.target)) {
        setExpDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setExpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Tax Careers & Internships Portal | Shree Chamunda Associates',
    description:
      'Join Shree Chamunda Associates in Ahmedabad: professional tax training, audit roles, and senior tax consultant career opportunities.',
  });

  const filteredPositions = useMemo(() => {
    if (trackFilter === 'all') return OPEN_POSITIONS;
    return OPEN_POSITIONS.filter((job) => job.track === trackFilter);
  }, [trackFilter]);

  const displayedRole = useMemo(() => {
    return filteredPositions.find((job) => job.id === inspectedRoleId) || filteredPositions[0];
  }, [filteredPositions, inspectedRoleId]);

  const scrollToSection = (sectionId) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyClick = (jobTitle) => {
    setSelectedRole(jobTitle);
    setAppForm((prev) => ({ ...prev, position: jobTitle }));
    scrollToSection('application-intake-form');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      await submitContact({
        name: appForm.name,
        email: appForm.email,
        phone: appForm.phone,
        subject: `Career Application: ${appForm.position} (${appForm.name})`,
        message: `Position: ${appForm.position}\nCity: ${appForm.city}\nRegistration / Roll #: ${appForm.regNumber || 'N/A'}\nQualification Status: ${appForm.groupsStatus}\nExperience: ${appForm.experienceYears}\nPortfolio / LinkedIn / Resume: ${appForm.portfolioLink || 'N/A'}\nCover Note: ${appForm.coverNote}`,
        serviceInterest: `Career Application - ${appForm.position}`,
      });

      setFormStatus({ loading: false, success: true, error: null });
      setAppForm({
        name: '',
        email: '',
        phone: '',
        city: 'Ahmedabad',
        position: selectedRole,
        regNumber: '',
        groupsStatus: 'Commerce Graduate (B.Com / BBA)',
        experienceYears: 'Fresher (Seeking Internship)',
        portfolioLink: '',
        coverNote: '',
      });
    } catch (err) {
      setFormStatus({
        loading: false,
        success: false,
        error:
          err.message ||
          'Application submission failed. Please email your CV directly to shreechamundaassociates0905@gmail.com.',
      });
    }
  };

  return (
    <div className="careers-page fade-in">
      {/* 1. HERO SECTION — Swiss-Fintech Chambers Architecture */}
      <section className="careers-hero" aria-labelledby="careers-hero-title">
        <div className="careers-top-accent-line" aria-hidden="true"></div>
        <div className="careers-pinstripe-bg" aria-hidden="true"></div>
        <div className="careers-hero-orb" aria-hidden="true"></div>

        <div className="container careers-hero-container">
          <div className="careers-hero-header">
            <span className="careers-watermark" aria-hidden="true">CHAMBERS</span>
            <div className="careers-eyebrow-badge retainers-eyebrow-badge">
              <span className="badge-index-chip">01</span>
              <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
              <span>STATUTORY PRACTICE &bull; CAREERS &amp; INTERNSHIPS</span>
            </div>

            <h1 id="careers-hero-title" className="careers-main-title">
              Architect Your Future in <br />
              <span className="title-burnished-gold">Corporate Tax Practice</span>
            </h1>

            <p className="careers-hero-lead">
              Practice at the forefront of Indian tax jurisprudence. Work directly alongside senior partners
              defending high-stakes scrutiny notices, structuring multi-state GST compliance, and building digital client governance.
            </p>

            <div className="careers-hero-actions">
              <button
                type="button"
                className="btn-careers-primary"
                onClick={() => scrollToSection('open-opportunities')}
              >
                <span>Explore Open Tracks (4)</span>
                <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                className="btn-careers-secondary"
                onClick={() => scrollToSection('application-intake-form')}
              >
                <i className="fa-solid fa-id-card" aria-hidden="true"></i>
                <span>Direct Application Desk</span>
              </button>
            </div>

            <div className="header-assurance-strip careers-assurance-strip">
              <span className="assurance-pill">
                <i className="fa-solid fa-certificate text-amber" aria-hidden="true"></i>
                <span>Structured Training Curriculum</span>
              </span>
              <span className="assurance-pill">
                <i className="fa-solid fa-book-open-reader text-emerald" aria-hidden="true"></i>
                <span>Guaranteed Exam Study Leave</span>
              </span>
              <span className="assurance-pill">
                <i className="fa-solid fa-user-tie text-blue" aria-hidden="true"></i>
                <span>Direct Partner Mentorship</span>
              </span>
            </div>
          </div>

          {/* 4-Column Chambers Practice Snapshot Ledger */}
          <div className="careers-stats-ledger" role="region" aria-label="Chambers Career Highlights">
            <div className="stats-ledger-cell">
              <div className="stats-icon-wrap amber" aria-hidden="true">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <div className="stats-copy">
                <strong>4 Active Hiring Tracks</strong>
                <span>Trainees, Associates &amp; Senior Counsel</span>
              </div>
            </div>

            <div className="stats-ledger-cell">
              <div className="stats-icon-wrap emerald" aria-hidden="true">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="stats-copy">
                <strong>Appellate &amp; Scrutiny Exposure</strong>
                <span>Section 148, ASMT-10 &amp; CIT(A) Benches</span>
              </div>
            </div>

            <div className="stats-ledger-cell">
              <div className="stats-icon-wrap blue" aria-hidden="true">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div className="stats-copy">
                <strong>&lt; 48h Partner Review SLA</strong>
                <span>Zero external HR agency filters</span>
              </div>
            </div>

            <div className="stats-ledger-cell">
              <div className="stats-icon-wrap purple" aria-hidden="true">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="stats-copy">
                <strong>Nikol, Ahmedabad Chambers</strong>
                <span>Direct in-person mentorship desk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CHAMUNDA PRACTICE PROMISE */}
      <section className="careers-content-wrap careers-pillars-section" aria-labelledby="pillars-heading">
        <div className="section-header-centered careers-section-header">
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">02</span>
            <i className="fa-solid fa-award" aria-hidden="true"></i>
            <span>WHY TRAIN WITH US &bull; CHAMBERS ETHOS</span>
          </div>
          <h2 id="pillars-heading" className="careers-section-heading">
            The Four Pillars of Our <br />
            <span className="title-burnished-gold">Professional Culture</span>
          </h2>
          <p className="careers-section-subtext">
            We believe exceptional tax advisors are forged through real litigation drafting, cloud statutory systems, and direct partner mentorship—not repetitive clerical data entry.
          </p>
        </div>

        <div className="manifesto-workbench">
          {/* Left Featured Obsidian Chambers Charter */}
          <aside className="manifesto-anchor-panel">
            <div className="manifesto-anchor-top">
              <span className="manifesto-charter-badge">
                <span className="live-dot-pulse" aria-hidden="true"></span>
                <span>CHAMBERS TRAINING CHARTER</span>
              </span>
              <h3 className="manifesto-anchor-title">
                Forged in Statutory Defense, <span>Not Clerical Busywork.</span>
              </h3>
              <p className="manifesto-anchor-copy">
                Associates and trainees work directly alongside Senior Partners across live Section 148 scrutiny defense, multi-state GST litigation, and board-level governance.
              </p>
            </div>

            <div className="manifesto-anchor-bottom">
              <div className="manifesto-anchor-stats">
                <div className="anchor-stat-cell">
                  <span className="anchor-stat-kicker">MENTORSHIP</span>
                  <strong>Direct Partner Desk</strong>
                </div>
                <div className="anchor-stat-cell">
                  <span className="anchor-stat-kicker">INFRASTRUCTURE</span>
                  <strong>Cloud Sec 128 Vaults</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn-manifesto-explore"
                onClick={() => scrollToSection('open-opportunities')}
              >
                <span>Explore Open Tracks</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </aside>

          {/* Right Unified 2x2 Architectural Quadrant Grid */}
          <div className="manifesto-quads-panel">
            {CULTURE_PILLARS.map((pillar) => (
              <article key={pillar.code} className="manifesto-quad-cell">
                <div className="quad-cell-top">
                  <span className="quad-index-num">{pillar.code}</span>
                  <div className="quad-top-right">
                    <span className="quad-kicker-label">{pillar.tag}</span>
                    <span className="quad-icon-mark" aria-hidden="true">
                      <i className={pillar.icon}></i>
                    </span>
                  </div>
                </div>

                <h3 className="careers-pillar-heading">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.desc}</p>

                <div className="quad-outcome-foot">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  <span>{pillar.outcome}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE OPEN OPPORTUNITIES DIRECTORY */}
      <section
        id="open-opportunities"
        className="careers-content-wrap careers-openings-section"
        aria-labelledby="openings-heading"
      >
        <div className="section-header-centered careers-section-header">
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">03</span>
            <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
            <span>IMMEDIATE VACANCIES &bull; AHMEDABAD CHAMBERS</span>
          </div>
          <h2 id="openings-heading" className="careers-section-heading">
            Open Career &amp; <span className="title-burnished-gold">Training Mandates</span>
          </h2>
          <p className="careers-section-subtext">
            Select any hiring track below to review eligibility criteria, compensation details, and direct practice exposure inside our chambers.
          </p>
        </div>

        {/* Interactive Track Filter Command Bar */}
        <div className="careers-filter-bar">
          <div className="careers-track-tabs" role="tablist" aria-label="Filter Career Tracks">
            {TRACK_FILTERS.map((f) => {
              const isActive = trackFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`track-filter-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setTrackFilter(f.id)}
                >
                  <span>{f.label}</span>
                  <span className="track-count-pill">{f.count}</span>
                </button>
              );
            })}
          </div>

          <div className="careers-location-chip">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>Chambers Desk: Nikol, Ahmedabad</span>
          </div>
        </div>

        {/* Master-Detail Role Workbench */}
        <div className="openings-workbench-grid">
          {/* Left Column: Clickable Track Roster */}
          <div className="openings-roster-col" role="tablist" aria-label="Available Practice Roles">
            {filteredPositions.map((job) => {
              const isInspected = displayedRole?.id === job.id;
              const isInForm = appForm.position === job.title;
              return (
                <button
                  key={job.id}
                  type="button"
                  role="tab"
                  aria-selected={isInspected}
                  className={`role-roster-card ${isInspected ? 'active' : ''}`}
                  onClick={() => setInspectedRoleId(job.id)}
                >
                  <div className="roster-card-top">
                    <div className="roster-badges">
                      <span className="opening-track-code">{job.code}</span>
                      <span className={`opening-badge badge-${job.accent}`}>{job.badge}</span>
                    </div>
                    {isInForm && (
                      <span className="roster-form-flag">
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>In Form</span>
                      </span>
                    )}
                  </div>

                  <strong className="roster-card-title">{job.title}</strong>
                  <span className="roster-card-sub">
                    {job.department} &bull; {job.type}
                  </span>

                  <div className="roster-card-foot">
                    <span className="roster-elig-hint">{job.eligibility}</span>
                    <span className="roster-inspect-arrow" aria-hidden="true">
                      <i className="fa-solid fa-chevron-right"></i>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Obsidian Role Mandate Dossier */}
          <div className="openings-dossier-col">
            {displayedRole && (
              <div className="role-dossier-card" role="tabpanel">
                <div className="dossier-head-row">
                  <div className="dossier-live-tag">
                    <span className="live-dot-pulse" aria-hidden="true"></span>
                    <span>ACTIVE MANDATE &bull; NIKOL, AHMEDABAD</span>
                  </div>
                  <span className="dossier-track-pill">{displayedRole.code}</span>
                </div>

                <h3 className="role-dossier-title">{displayedRole.title}</h3>
                <p className="role-dossier-subline">
                  {displayedRole.department} &bull; {displayedRole.type}
                </p>

                <p className="role-dossier-summary">{displayedRole.summary}</p>

                <div className="role-dossier-specs">
                  <div className="dossier-spec-box">
                    <span className="dossier-spec-label">Eligibility Criteria</span>
                    <strong className="dossier-spec-val">{displayedRole.eligibility}</strong>
                  </div>
                  <div className="dossier-spec-box">
                    <span className="dossier-spec-label">Compensation &amp; Stipend</span>
                    <strong className="dossier-spec-val spec-compensation">{displayedRole.stipend}</strong>
                  </div>
                </div>

                <div className="role-dossier-exposure">
                  <span className="dossier-exposure-label">Key Professional Exposure Inside Chambers</span>
                  <ul className="dossier-exposure-list">
                    {displayedRole.exposure.map((exp, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="role-dossier-actions">
                  <button
                    type="button"
                    className="btn-dossier-apply"
                    onClick={() => handleApplyClick(displayedRole.title)}
                  >
                    <span>
                      {appForm.position === displayedRole.title
                        ? 'Proceed to Intake Form Below'
                        : 'Apply for This Mandate'}
                    </span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </button>

                  <a
                    href={`https://wa.me/919510984735?text=${encodeURIComponent(
                      `Hello Shree Chamunda Associates, I would like to inquire regarding the ${displayedRole.title} opening.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-dossier-hr-whatsapp"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    <span>Ask HR Desk</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. DIRECT RECRUITMENT WORKBENCH (Balanced 2-Column Intake + Chambers Desk) */}
      <section
        id="application-intake-form"
        className="careers-content-wrap application-form-section"
        aria-labelledby="intake-heading"
      >
        <div className="section-header-centered careers-section-header">
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">04</span>
            <i className="fa-solid fa-id-card" aria-hidden="true"></i>
            <span>DIRECT RECRUITMENT DESK &bull; CANDIDATE INTAKE</span>
          </div>
          <h2 id="intake-heading" className="careers-section-heading">
            Submit Your <span className="title-burnished-gold">Candidacy</span>
          </h2>
          <p className="careers-section-subtext">
            Complete your practice profile below. All applications go straight to our Managing Partners for review within 48 hours.
          </p>
        </div>

        <div className="careers-intake-workbench">
          {/* Left Column: Obsidian HR Chambers Desk + Architectural Selection Timeline */}
          <aside className="careers-intake-sidebar">
            <div className="hr-chambers-card">
              <div className="hr-card-top">
                <div className="hr-avatar-box" aria-hidden="true">
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <div className="hr-card-heading">
                  <span className="hr-kicker">MANAGING PARTNER DESK</span>
                  <strong>Nikol Chambers Walk-Ins &amp; HR</strong>
                </div>
                <span className="hr-sla-badge">
                  <span className="live-dot-pulse" aria-hidden="true"></span>
                  <span>&lt; 48h Review</span>
                </span>
              </div>

              <div className="hr-details-list">
                <div className="hr-detail-row">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <div>
                    <span className="hr-detail-label">Chambers Address</span>
                    <span>612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad - 380049</span>
                  </div>
                </div>
                <div className="hr-detail-row">
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <div>
                    <span className="hr-detail-label">Interview Hours</span>
                    <span>Mon – Sat &bull; 10:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
                <div className="hr-detail-row">
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                  <div>
                    <span className="hr-detail-label">Direct Desk Email</span>
                    <span>shreechamundaassociates0905@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="hr-action-links">
                <a href="tel:+919510984735" className="hr-action-btn phone">
                  <i className="fa-solid fa-phone-volume" aria-hidden="true"></i>
                  <span>+91 95109 84735</span>
                </a>
                <a
                  href={`https://wa.me/919510984735?text=${encodeURIComponent(
                    `Hello Shree Chamunda Associates, I would like to inquire regarding the ${appForm.position} opportunity.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hr-action-btn whatsapp"
                >
                  <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                  <span>WhatsApp HR Desk</span>
                </a>
              </div>
            </div>

            {/* Architectural Selection Protocol Timeline */}
            <div className="careers-hiring-card" role="region" aria-label="Selection Protocol">
              <div className="hiring-card-head">
                <span className="hiring-kicker">
                  <i className="fa-solid fa-route" aria-hidden="true"></i>
                  <span>SELECTION &amp; ONBOARDING PROTOCOL</span>
                </span>
                <span className="hiring-badge">Zero Agency Layers</span>
              </div>

              <div className="hiring-timeline">
                {HIRING_STEPS.map((step) => (
                  <div key={step.num} className="hiring-timeline-item">
                    <span className="hiring-step-num">{step.num}</span>
                    <div className="hiring-step-copy">
                      <div className="hiring-step-top">
                        <strong>{step.title}</strong>
                        <span className="hiring-step-eta">{step.eta}</span>
                      </div>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hiring-oath-footer">
                <i className="fa-solid fa-shield-halved text-emerald" aria-hidden="true"></i>
                <span>ISO-Aligned Confidentiality &bull; Structured Study-Leave Guarantee</span>
              </div>
            </div>

            {/* Walk-In Readiness & Practice Terms Card */}
            <div className="careers-readiness-card" role="region" aria-label="Pre-Screening Readiness">
              <div className="hiring-card-head">
                <span className="hiring-kicker">
                  <i className="fa-solid fa-clipboard-check" aria-hidden="true"></i>
                  <span>PRE-SCREENING READINESS</span>
                </span>
                <span className="hiring-badge">Direct Induction</span>
              </div>

              <div className="readiness-list">
                {CANDIDATE_READINESS_NORMS.map((norm) => (
                  <div key={norm.title} className="readiness-item">
                    <span className="readiness-icon" aria-hidden="true">
                      <i className={norm.icon}></i>
                    </span>
                    <div className="readiness-copy">
                      <strong>{norm.title}</strong>
                      <p>{norm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hiring-oath-footer">
                <i className="fa-solid fa-award text-gold" aria-hidden="true"></i>
                <span>Merit-Reviewed Stipend &bull; Zero Bond Clause</span>
              </div>
            </div>
          </aside>

          {/* Right Column: Executive Multi-Step Candidate Dossier */}
          <div className="careers-intake-card">
            <div className="intake-card-head">
              <div>
                <span className="intake-kicker">DIRECT PARTNER RECRUITMENT</span>
                <h3 className="intake-title">Candidate Intake Dossier</h3>
              </div>
              {(() => {
                const activeOpt = INTAKE_ROLE_OPTIONS.find((o) => o.value === appForm.position);
                return (
                  <div className="intake-role-readout" title={appForm.position}>
                    <span className="readout-code">{activeOpt?.code || 'CUSTOM'}</span>
                    <span className="readout-label">{activeOpt?.label || appForm.position}</span>
                  </div>
                );
              })()}
            </div>

            {formStatus.success && (
              <div className="app-success-banner" role="status">
                <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                <div>
                  <strong>Application Successfully Dispatched!</strong>
                  <p>
                    Thank you for applying to Shree Chamunda Associates. Our Managing Partners will review your candidacy and contact you to schedule an interview at our Nikol chambers.
                  </p>
                </div>
              </div>
            )}

            {formStatus.error && (
              <div className="app-error-banner" role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                <p>{formStatus.error}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="careers-intake-form">
              {/* Group 01: Target Mandate Selector */}
              <div className="intake-fieldset">
                <div className="fieldset-label-row">
                  <span className="fieldset-num">01</span>
                  <span className="fieldset-title">Target Mandate Selection</span>
                </div>
                <div className="intake-role-grid" role="radiogroup" aria-label="Target Position">
                  {INTAKE_ROLE_OPTIONS.map((opt, idx) => {
                    const isSelected = appForm.position === opt.value;
                    const isWide = idx === INTAKE_ROLE_OPTIONS.length - 1;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`intake-role-tile ${isSelected ? 'selected' : ''} ${isWide ? 'role-tile-wide' : ''}`}
                        onClick={() => {
                          setSelectedRole(opt.value);
                          setAppForm({ ...appForm, position: opt.value });
                        }}
                      >
                        <div className="role-tile-left">
                          <span className="role-tile-code">{opt.code}</span>
                          <strong className="role-tile-name">{opt.label}</strong>
                          <span className="role-tile-sub">{opt.sub}</span>
                        </div>
                        <span className="role-tile-check" aria-hidden="true">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 02: Candidate Coordinates */}
              <div className="intake-fieldset">
                <div className="fieldset-label-row">
                  <span className="fieldset-num">02</span>
                  <span className="fieldset-title">Candidate Coordinates</span>
                </div>

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cName">Full Name *</label>
                    <div className="intake-input-wrap">
                      <i className="fa-regular fa-user" aria-hidden="true"></i>
                      <input
                        type="text"
                        id="cName"
                        required
                        value={appForm.name}
                        onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                        placeholder="e.g. Hardik Shah"
                        className="careers-input has-icon"
                      />
                    </div>
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cEmail">Email Address *</label>
                    <div className="intake-input-wrap">
                      <i className="fa-regular fa-envelope" aria-hidden="true"></i>
                      <input
                        type="email"
                        id="cEmail"
                        required
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        placeholder="hardik@gmail.com"
                        className="careers-input has-icon"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cPhone">Phone Number *</label>
                    <div className="intake-input-wrap">
                      <i className="fa-solid fa-phone" aria-hidden="true"></i>
                      <input
                        type="tel"
                        id="cPhone"
                        required
                        value={appForm.phone}
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="careers-input has-icon"
                      />
                    </div>
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cCity">Current Location / City</label>
                    <div className="intake-input-wrap">
                      <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                      <input
                        type="text"
                        id="cCity"
                        value={appForm.city}
                        onChange={(e) => setAppForm({ ...appForm, city: e.target.value })}
                        placeholder="e.g. Ahmedabad, Gandhinagar"
                        className="careers-input has-icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 03: Academic & Practice Credentials */}
              <div className="intake-fieldset">
                <div className="fieldset-label-row">
                  <span className="fieldset-num">03</span>
                  <span className="fieldset-title">Academic &amp; Practice Credentials</span>
                </div>

                <div className="careers-input-group">
                  <label>Qualification Track</label>
                  <div className="intake-qual-grid" role="radiogroup" aria-label="Qualification Track">
                    {QUALIFICATION_OPTIONS.map((q) => {
                      const isSelected = appForm.groupsStatus === q.value;
                      return (
                        <button
                          key={q.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`intake-qual-tile ${isSelected ? 'selected' : ''}`}
                          onClick={() => setAppForm({ ...appForm, groupsStatus: q.value })}
                        >
                          <strong>{q.label}</strong>
                          <span>{q.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cExp">Practice Experience</label>
                    <div className="careers-exp-select" ref={expSelectRef}>
                      <button
                        type="button"
                        id="cExp"
                        className={`careers-exp-trigger ${expDropdownOpen ? 'open' : ''}`}
                        aria-haspopup="listbox"
                        aria-expanded={expDropdownOpen}
                        onClick={() => setExpDropdownOpen((prev) => !prev)}
                      >
                        <i className="fa-solid fa-briefcase exp-trigger-icon" aria-hidden="true"></i>
                        <span className="exp-trigger-value">{appForm.experienceYears}</span>
                        <i className="fa-solid fa-chevron-down exp-trigger-chevron" aria-hidden="true"></i>
                      </button>
                      <input type="hidden" name="experienceYears" value={appForm.experienceYears} />
                      {expDropdownOpen && (
                        <ul className="careers-exp-menu" role="listbox" aria-label="Practice Experience Options">
                          {EXPERIENCE_OPTIONS.map((opt) => {
                            const isSelected = appForm.experienceYears === opt.value;
                            return (
                              <li key={opt.value} role="option" aria-selected={isSelected}>
                                <button
                                  type="button"
                                  className={`careers-exp-option ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    setAppForm({ ...appForm, experienceYears: opt.value });
                                    setExpDropdownOpen(false);
                                  }}
                                >
                                  <div className="exp-option-copy">
                                    <strong>{opt.value}</strong>
                                    <span>{opt.sub}</span>
                                  </div>
                                  {isSelected && <i className="fa-solid fa-check exp-option-check" aria-hidden="true"></i>}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cRegNo">Student / Reg. No. (Optional)</label>
                    <input
                      type="text"
                      id="cRegNo"
                      value={appForm.regNumber}
                      onChange={(e) => setAppForm({ ...appForm, regNumber: e.target.value })}
                      placeholder="e.g. REG-0654321"
                      className="careers-input"
                    />
                  </div>
                </div>
              </div>

              {/* Group 04: Portfolio & Statement */}
              <div className="intake-fieldset intake-fieldset-last">
                <div className="fieldset-label-row">
                  <span className="fieldset-num">04</span>
                  <span className="fieldset-title">Portfolio &amp; Statement</span>
                </div>

                <div className="careers-input-group">
                  <label htmlFor="cResume">Resume Link (Google Drive / LinkedIn / Dropbox)</label>
                  <div className="intake-input-wrap">
                    <i className="fa-solid fa-link" aria-hidden="true"></i>
                    <input
                      type="url"
                      id="cResume"
                      value={appForm.portfolioLink}
                      onChange={(e) => setAppForm({ ...appForm, portfolioLink: e.target.value })}
                      placeholder="https://linkedin.com/in/... or Google Drive public link"
                      className="careers-input has-icon"
                    />
                  </div>
                  <span className="input-hint">Ensure link sharing is set to &quot;Anyone with the link can view&quot;.</span>
                </div>

                <div className="careers-input-group">
                  <label htmlFor="cCover">Statement of Purpose &amp; Software Fluency</label>
                  <textarea
                    id="cCover"
                    rows="2"
                    value={appForm.coverNote}
                    onChange={(e) => setAppForm({ ...appForm, coverNote: e.target.value })}
                    placeholder="Share academic highlights, software proficiency (Tally Prime, Zoho Books, Computax, Excel), and career goals..."
                    className="careers-textarea"
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn-submit-candidacy" disabled={formStatus.loading}>
                {formStatus.loading ? (
                  <span>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Transmitting Dossier...
                  </span>
                ) : (
                  <>
                    <span>Submit Application to Managing Partner</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </>
                )}
              </button>

              <div className="intake-confidential-foot">
                <i className="fa-solid fa-shield-halved text-emerald" aria-hidden="true"></i>
                <span>Direct Managing Partner Review &bull; Confidentiality Guaranteed &bull; Zero Agency Fees</span>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
