import { useState, useEffect, useMemo } from 'react';
import useSEO from '../hooks/useSEO';
import { submitContact } from '../api';
import './Careers.css';

const OPEN_POSITIONS = [
  {
    id: 'tax-trainee',
    track: 'trainee',
    icon: 'fa-solid fa-graduation-cap',
    title: 'Tax & Audit Trainee (Direct & Indirect Tax)',
    department: 'Statutory Practice & Appellate Litigation',
    type: 'Full-Time Professional Internship / Trainee Program',
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
    track: 'audit',
    icon: 'fa-solid fa-scale-balanced',
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
    track: 'audit',
    icon: 'fa-solid fa-user-tie',
    title: 'Senior Tax Consultant (Assistant Manager - Tax & Audit)',
    department: 'Senior Advisory Chambers',
    type: 'Full-Time Senior Counsel',
    stipend: 'Industry Leading CTC + Retainer Profit-Sharing Track',
    eligibility: 'Commerce Post-Graduate / Tax Professional (1–3 Yrs Experience)',
    badge: 'LEADERSHIP TRACK',
    summary:
      'Work directly alongside Managing Partners in structuring M&A agreements, international tax transfer pricing, Section 148 reassessments, and startup Section 80-IAC tax exemptions.',
    exposure: [
      'Appellate case law research and ITAT bench representation drafting',
      'Statutory sign-off review on corporate ITR-6 & audit reports',
      'Virtual CFO client strategy meetings and executive MIS modeling',
      'Clear, meritocratic pathway towards junior partnership',
    ],
  },
  {
    id: 'senior-accountant',
    track: 'operations',
    icon: 'fa-solid fa-calculator',
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
  { id: 'all', label: 'All Openings', count: 4 },
  { id: 'trainee', label: 'Trainee Program', count: 1 },
  { id: 'audit', label: 'Audit & Advisory', count: 2 },
  { id: 'operations', label: 'Accounts & GST', count: 1 },
];

const PRACTICE_PILLARS = [
  {
    index: '01',
    tone: 'amber',
    icon: 'fa-solid fa-scale-balanced',
    title: 'High-Stakes Scrutiny Defense',
    desc: 'Draft legal replies for Section 148 reassessments, ASMT-10 mismatch notices, and CIT(Appeals) submissions backed by judicial precedents.',
  },
  {
    index: '02',
    tone: 'blue',
    icon: 'fa-solid fa-network-wired',
    title: 'Digital-First Vault Practice',
    desc: 'Work on cloud accounting infrastructure, algorithmic GSTR-2B reconciliation workflows, and Section 128 encrypted client repositories.',
  },
  {
    index: '03',
    tone: 'emerald',
    icon: 'fa-solid fa-book-open',
    title: 'Dedicated Exam Support',
    desc: 'Structured study leave allowances without compromise so trainees can prepare thoroughly for professional and university examinations.',
  },
  {
    index: '04',
    tone: 'purple',
    icon: 'fa-solid fa-stairs',
    title: 'Meritocratic Partner Track',
    desc: 'Structured growth beyond transactional compliance—top performers advance along a transparent path toward senior practice leadership.',
  },
];

const Careers = () => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedRole, setSelectedRole] = useState('Tax & Audit Trainee (Direct & Indirect Tax)');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Tax Careers & Internships Portal | Shree Chamunda Associates',
    description:
      'Join Shree Chamunda Associates in Ahmedabad: structured tax training, Section 44AB audit roles, GST compliance, and senior tax advisory career opportunities.',
  });

  const visiblePositions = useMemo(() => {
    if (roleFilter === 'all') return OPEN_POSITIONS;
    return OPEN_POSITIONS.filter((job) => job.track === roleFilter);
  }, [roleFilter]);

  const handleApplyClick = (jobTitle) => {
    setSelectedRole(jobTitle);
    setAppForm((prev) => ({ ...prev, position: jobTitle }));
    const formElem = document.getElementById('application-intake-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
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
      {/* 1. HERO BANNER — Unified Swiss-Fintech Architecture */}
      <section className="careers-hero" aria-labelledby="careers-hero-title">
        <div className="careers-top-accent-line" aria-hidden="true"></div>
        <div className="careers-pinstripe-bg" aria-hidden="true"></div>
        <div className="careers-ambient-orb" aria-hidden="true"></div>

        <div className="container careers-hero-container">
          <div className="retainers-eyebrow-badge careers-eyebrow">
            <span className="badge-index-chip">06</span>
            <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
            <span>STATUTORY PRACTICE &bull; CAREERS &amp; INTERNSHIPS</span>
          </div>

          <h1 id="careers-hero-title" className="careers-main-title">
            Architect Your Future in <br />
            <span className="title-gradient-gold">Corporate Tax Practice.</span>
          </h1>

          <p className="careers-hero-lead">
            Practice at the forefront of Indian tax jurisprudence. Work alongside senior partners defending
            high-stakes corporate scrutiny, structuring entities, and building digital compliance architecture.
          </p>

          <div className="header-assurance-strip">
            <span className="assurance-pill">
              <i className="fa-solid fa-certificate" aria-hidden="true"></i>
              <span>Structured Training Curriculum</span>
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-book-open" aria-hidden="true"></i>
              <span>Guaranteed Exam Study Leave</span>
            </span>
            <span className="assurance-pill">
              <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
              <span>Direct Partner Mentorship</span>
            </span>
          </div>

          {/* 4-Column Practice Career Snapshot Ledger */}
          <div className="careers-stats-ledger" role="region" aria-label="Practice Career Highlights">
            <div className="stats-ledger-col">
              <div className="stats-ledger-icon amber" aria-hidden="true">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="stats-ledger-copy">
                <strong>4 Statutory Desks</strong>
                <span>Direct Tax, GST, Audit &amp; ROC</span>
              </div>
            </div>

            <div className="stats-ledger-col">
              <div className="stats-ledger-icon emerald" aria-hidden="true">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div className="stats-ledger-copy">
                <strong>&lt; 48h Review SLA</strong>
                <span>Direct Managing Partner Screen</span>
              </div>
            </div>

            <div className="stats-ledger-col">
              <div className="stats-ledger-icon blue" aria-hidden="true">
                <i className="fa-solid fa-gavel"></i>
              </div>
              <div className="stats-ledger-copy">
                <strong>CIT(A) &amp; ITAT Exposure</strong>
                <span>Practical Appellate Drafting</span>
              </div>
            </div>

            <div className="stats-ledger-col">
              <div className="stats-ledger-icon gold" aria-hidden="true">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="stats-ledger-copy">
                <strong>Nikol Chambers</strong>
                <span>Ahmedabad Practice Headquarters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR PILLARS OF PROFESSIONAL CULTURE */}
      <section className="container careers-pillars-section" aria-labelledby="careers-pillars-title">
        <div className="section-header-centered">
          <div className="retainers-eyebrow-badge careers-eyebrow">
            <span className="badge-index-chip">01</span>
            <i className="fa-solid fa-award" aria-hidden="true"></i>
            <span>WHY TRAIN WITH US &bull; PRACTICE CULTURE</span>
          </div>
          <h2 id="careers-pillars-title" className="section-heading">
            The Four Pillars of Our <span className="title-gradient-gold">Professional Culture</span>
          </h2>
          <p className="section-subtext">
            We believe exceptional tax professionals are forged through structured statutory litigation exposure, forensic reconciliation, and partner mentorship.
          </p>
        </div>

        <div className="careers-pillars-grid">
          {PRACTICE_PILLARS.map((pillar) => (
            <article key={pillar.index} className="pillar-card">
              <div className="pillar-card-top">
                <div className={`pillar-icon ${pillar.tone}`} aria-hidden="true">
                  <i className={pillar.icon}></i>
                </div>
                <span className="pillar-num">{pillar.index}</span>
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. OPEN POSITIONS DIRECTORY */}
      <section className="container careers-openings-section" aria-labelledby="careers-openings-title">
        <div className="section-header-centered">
          <div className="retainers-eyebrow-badge careers-eyebrow">
            <span className="badge-index-chip">02</span>
            <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
            <span>IMMEDIATE VACANCIES &bull; AHMEDABAD CHAMBERS</span>
          </div>
          <h2 id="careers-openings-title" className="section-heading">
            Open Practice <span className="title-gradient-gold">Opportunities</span>
          </h2>
          <p className="section-subtext">
            Explore current intakes for taxation trainees, semi-qualified audit associates, and senior tax consultants.
          </p>
        </div>

        {/* Interactive Role Filter Bar */}
        <div className="openings-control-bar">
          <div className="openings-filter-tabs" role="tablist" aria-label="Filter Open Positions by Track">
            {TRACK_FILTERS.map((f) => {
              const isActive = roleFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`openings-filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setRoleFilter(f.id)}
                >
                  <span>{f.label}</span>
                  <span className="openings-filter-count">{f.count}</span>
                </button>
              );
            })}
          </div>

          <span className="openings-chambers-pill">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>Nikol, Ahmedabad &bull; In-Chamber Roles</span>
          </span>
        </div>

        <div className="openings-grid">
          {visiblePositions.map((job) => {
            const isSelected = appForm.position === job.title;
            return (
              <article key={job.id} className={`opening-card ${isSelected ? 'is-selected-role' : ''}`}>
                <div className="opening-card-top">
                  <div className="opening-badges-row">
                    <span className="opening-badge">{job.badge}</span>
                    <span className="opening-location-pill">
                      <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                      <span>Ahmedabad</span>
                    </span>
                  </div>
                  <div className="opening-icon-capsule" aria-hidden="true">
                    <i className={job.icon}></i>
                  </div>
                </div>

                <h3 className="opening-title">{job.title}</h3>
                <div className="opening-meta-row">
                  <span>
                    <i className="fa-solid fa-building" aria-hidden="true"></i> {job.department}
                  </span>
                  <span>
                    <i className="fa-solid fa-briefcase" aria-hidden="true"></i> {job.type}
                  </span>
                </div>

                <p className="opening-desc">{job.summary}</p>

                <div className="opening-specs-grid">
                  <div className="spec-box">
                    <span className="spec-label">Eligibility Criteria</span>
                    <strong className="spec-val">{job.eligibility}</strong>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Compensation &amp; Stipend</span>
                    <strong className="spec-val spec-compensation">{job.stipend}</strong>
                  </div>
                </div>

                <div className="opening-bullets">
                  <span className="bullets-title">Key Professional Exposure</span>
                  <ul>
                    {job.exposure.map((exp, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="opening-card-footer">
                  <button
                    type="button"
                    className={`btn-apply-job ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleApplyClick(job.title)}
                  >
                    <span>{isSelected ? 'Selected in Intake Form — Apply Below' : 'Apply for This Role'}</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. DUAL-COLUMN RECRUITMENT WORKBENCH (FORM + CHAMBERS DESK) */}
      <section className="container application-form-section" id="application-intake-form" aria-labelledby="careers-form-title">
        <div className="section-header-centered">
          <div className="retainers-eyebrow-badge careers-eyebrow">
            <span className="badge-index-chip">03</span>
            <i className="fa-solid fa-id-card" aria-hidden="true"></i>
            <span>DIRECT RECRUITMENT DESK &bull; 48H PARTNER REVIEW</span>
          </div>
          <h2 id="careers-form-title" className="section-heading">
            Submit Your <span className="title-gradient-gold">Candidacy</span>
          </h2>
          <p className="section-subtext">
            Complete your intake profile below or connect directly with our Nikol Chambers recruitment desk.
          </p>
        </div>

        <div className="app-workbench-grid">
          {/* Left Column: Direct Helpline Card + Walk-In Chambers & Interview Protocol */}
          <aside className="app-sidebar-col">
            <div className="recruitment-desk-card">
              <div className="recruitment-desk-top">
                <div className="recruitment-avatar" aria-hidden="true">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div className="recruitment-info">
                  <span className="recruitment-role">Managing Partner Desk</span>
                  <strong className="recruitment-title">Direct Recruitment Cell</strong>
                </div>
                <span className="recruitment-live-badge">
                  <span className="live-dot-pulse" aria-hidden="true"></span>
                  <span>Hiring Active</span>
                </span>
              </div>

              <p className="recruitment-desc">
                Every application is reviewed directly by our Senior Practice Partners—zero third-party staffing intermediaries.
              </p>

              <div className="recruitment-actions">
                <a href="tel:+919510984735" className="recruitment-btn phone">
                  <i className="fa-solid fa-phone-volume" aria-hidden="true"></i>
                  <span>+91 95109 84735</span>
                </a>
                <a
                  href={`https://wa.me/919510984735?text=${encodeURIComponent(
                    `Hello Shree Chamunda Associates, I am interested in applying for ${appForm.position}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recruitment-btn whatsapp"
                >
                  <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                  <span>WhatsApp HR Desk</span>
                </a>
              </div>
            </div>

            <div className="chambers-protocol-card">
              <div className="chambers-location-block">
                <div className="chambers-loc-head">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <strong>In-Person Walk-In &amp; Interviews</strong>
                </div>
                <p>612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad - 380049</p>
                <span className="chambers-hours">
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <span>Mon – Sat &bull; 10:00 AM – 7:00 PM IST</span>
                </span>
              </div>

              <div className="eval-protocol-list">
                <div className="eval-head-row">
                  <span className="eval-kicker">
                    <i className="fa-solid fa-route" aria-hidden="true"></i>
                    <span>SELECTION CADENCE</span>
                  </span>
                  <span className="eval-sla-chip">48h Shortlist</span>
                </div>

                <div className="eval-step-row">
                  <span className="eval-num">01</span>
                  <div className="eval-copy">
                    <strong>Profile &amp; CV Screening</strong>
                    <span>Review of academic record &amp; practical exposure</span>
                  </div>
                  <span className="eval-eta">48h</span>
                </div>

                <div className="eval-step-row">
                  <span className="eval-num">02</span>
                  <div className="eval-copy">
                    <strong>Statutory &amp; Tally Evaluation</strong>
                    <span>Practical GST, ledger &amp; drafting assessment</span>
                  </div>
                  <span className="eval-eta">Chambers</span>
                </div>

                <div className="eval-step-row">
                  <span className="eval-num">03</span>
                  <div className="eval-copy">
                    <strong>Managing Partner Final Call</strong>
                    <span>Onboarding terms, stipend &amp; study leave alignment</span>
                  </div>
                  <span className="eval-eta">Offer</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Structured Application Form */}
          <div className="app-form-col">
            <div className="app-form-wrapper">
              <div className="app-form-top">
                <div>
                  <span className="app-form-kicker">ONLINE APPLICATION INTAKE</span>
                  <h3 className="app-form-heading">Candidate Profile &amp; Credentials</h3>
                </div>
                <span className="app-sla-pill">
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <span>48h Response</span>
                </span>
              </div>

              {formStatus.success && (
                <div className="app-success-banner" role="status">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  <div>
                    <strong>Application Successfully Dispatched!</strong>
                    <p>
                      Thank you for applying to Shree Chamunda Associates. Our recruitment desk will contact
                      you to schedule an in-person interview at our Nikol chambers.
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
                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cName">Full Name *</label>
                    <input
                      type="text"
                      id="cName"
                      required
                      value={appForm.name}
                      onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                      placeholder="e.g. Hardik Shah"
                      className="careers-input"
                    />
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cEmail">Email Address *</label>
                    <input
                      type="email"
                      id="cEmail"
                      required
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      placeholder="hardik@gmail.com"
                      className="careers-input"
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="cPhone"
                      required
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="careers-input"
                    />
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cCity">Current Location / City</label>
                    <input
                      type="text"
                      id="cCity"
                      value={appForm.city}
                      onChange={(e) => setAppForm({ ...appForm, city: e.target.value })}
                      placeholder="e.g. Ahmedabad, Gandhinagar, Surat"
                      className="careers-input"
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cPos">Target Position *</label>
                    <select
                      id="cPos"
                      value={appForm.position}
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setAppForm({ ...appForm, position: e.target.value });
                      }}
                      className="careers-select"
                    >
                      {OPEN_POSITIONS.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                      <option value="General Professional Application">General Professional Application</option>
                    </select>
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cRegNo">Registration / Roll # (Optional)</label>
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

                <div className="form-row-split">
                  <div className="careers-input-group">
                    <label htmlFor="cGroups">Qualification Status</label>
                    <select
                      id="cGroups"
                      value={appForm.groupsStatus}
                      onChange={(e) => setAppForm({ ...appForm, groupsStatus: e.target.value })}
                      className="careers-select"
                    >
                      <option value="Commerce Graduate (B.Com / BBA)">Commerce Graduate (B.Com / BBA)</option>
                      <option value="Post-Graduate (M.Com / MBA Finance)">Post-Graduate (M.Com / MBA Finance)</option>
                      <option value="Inter Student (Group 1 / Group 2 Cleared)">Inter Student (Group 1 / Group 2 Cleared)</option>
                      <option value="Experienced Tax & Accounts Senior">Experienced Tax &amp; Accounts Senior</option>
                    </select>
                  </div>

                  <div className="careers-input-group">
                    <label htmlFor="cExp">Practice Experience</label>
                    <select
                      id="cExp"
                      value={appForm.experienceYears}
                      onChange={(e) => setAppForm({ ...appForm, experienceYears: e.target.value })}
                      className="careers-select"
                    >
                      <option value="Fresher (Seeking Internship)">Fresher (Seeking Internship)</option>
                      <option value="1 - 2 Years Audit Experience">1 - 2 Years Audit Experience</option>
                      <option value="3 - 5 Years Accounting/Tax Practice">3 - 5 Years Accounting/Tax Practice</option>
                      <option value="5+ Years Senior Associate">5+ Years Senior Associate</option>
                    </select>
                  </div>
                </div>

                <div className="careers-input-group">
                  <label htmlFor="cResume">Resume Link (Google Drive / LinkedIn / Dropbox)</label>
                  <input
                    type="url"
                    id="cResume"
                    value={appForm.portfolioLink}
                    onChange={(e) => setAppForm({ ...appForm, portfolioLink: e.target.value })}
                    placeholder="https://linkedin.com/in/... or Google Drive public link"
                    className="careers-input"
                  />
                  <span className="input-hint">
                    Ensure link sharing is set to &ldquo;Anyone with the link can view&rdquo;.
                  </span>
                </div>

                <div className="careers-input-group">
                  <label htmlFor="cCover">Professional Statement / Software Proficiency</label>
                  <textarea
                    id="cCover"
                    rows="3"
                    value={appForm.coverNote}
                    onChange={(e) => setAppForm({ ...appForm, coverNote: e.target.value })}
                    placeholder="Briefly state your academic accomplishments, software proficiency (Tally Prime, Zoho, Excel), and practice goals..."
                    className="careers-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-candidacy" disabled={formStatus.loading}>
                  {formStatus.loading ? (
                    <span>
                      <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Transmitting Application...
                    </span>
                  ) : (
                    <>
                      <span>Submit Application to Managing Partner</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
