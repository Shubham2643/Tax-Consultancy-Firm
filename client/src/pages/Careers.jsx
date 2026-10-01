import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { submitContact } from '../api';
import './Careers.css';

const OPEN_POSITIONS = [
  {
    id: 'articleship',
    title: 'CA Articleship Trainee (Direct & Indirect Tax)',
    department: 'Statutory Practice & Appellate Litigation',
    type: 'Full-Time (ICAI Regulated 2-Year Program)',
    stipend: 'Structured Monthly Stipend (Above ICAI Minimums)',
    eligibility: 'CA Intermediate (Single or Both Groups Cleared)',
    badge: 'ICAI TRAINEE INTAKE',
    summary: 'Granular, high-exposure articleship training covering Section 143(3) scrutiny defense, GSTR-2B forensic matching, CIT(A) appellate rejoinder drafting, and MCA SPICe+ incorporations.',
    exposure: [
      'Direct representation drafting before Assessing Officers & CIT(A)',
      'Forensic purchase register vs. GSTR-2B input tax credit reconciliation',
      'Corporate Tax Audits under Section 44AB (Form 3CA/3CD)',
      'Dedicated exam preparatory leave for CA Final attempts',
    ],
  },
  {
    id: 'semi-qualified',
    title: 'Semi-Qualified CA / Audit Senior',
    department: 'Corporate Audit & Compliance Desk',
    type: 'Full-Time Permanent',
    stipend: 'Competitive Corporate Package + Performance Bonuses',
    eligibility: 'CA Inter Cleared with Completed Articleship / 1–3 Yrs Exp',
    badge: 'EXPERIENCED HIRE',
    summary: 'Lead client audit teams on statutory Section 44AB audits, multi-state GST reconciliations, and quarterly Form 24Q/26Q TDS returns for Gujarat manufacturing enterprises.',
    exposure: [
      'Supervision of junior trainees and books reconciliation workflows',
      'Autonomous drafting of ASMT-10 mismatch notice explanations',
      'Preparation of Corporate Balance Sheets & P&L in Tally Prime / Zoho',
      'Client liaison with corporate directors and factory CFOs',
    ],
  },
  {
    id: 'qualified-ca',
    title: 'Chartered Accountant (Assistant Manager - Tax & Audit)',
    department: 'Senior Advisory Chambers',
    type: 'Full-Time Senior Counsel',
    stipend: 'Industry Leading CTC + Retainer Profit-Sharing Track',
    eligibility: 'Qualified Member of ICAI (Freshers or 1–3 Yrs Post-Qual)',
    badge: 'LEADERSHIP TRACK',
    summary: 'Work directly alongside Managing Partners in structuring M&A agreements, international tax transfer pricing, Section 148 reassessments, and startup Section 80-IAC tax exemptions.',
    exposure: [
      'Appellate case law research and ITAT bench representation drafting',
      'Statutory sign-off review on corporate ITR-6 & audit reports',
      'Virtual CFO client strategy meetings and executive MIS modeling',
      'Clear, meritocratic pathway towards junior partnership',
    ],
  },
  {
    id: 'senior-accountant',
    title: 'Senior GST & Tally Accountant',
    department: 'Bookkeeping & GST Compliance Desk',
    type: 'Full-Time Permanent',
    stipend: 'Commensurate with Ledger & GST Experience',
    eligibility: 'B.Com / M.Com with 3+ Yrs Multi-Client Practice Exp',
    badge: 'OPERATIONS',
    summary: 'Oversee monthly bookkeeping, bank reconciliations, E-Way Bill generation, and GSTR-1 / GSTR-3B filings for 25+ retained corporate clients.',
    exposure: [
      'Advanced Tally Prime and Zoho Books ledger curation',
      'Monthly PF ECR challans, ESIC, and Gujarat Professional Tax filings',
      'Vendor invoice cross-verification and payment voucher controls',
      'Direct client communication for missing vouchers and invoices',
    ],
  },
];

const Careers = () => {
  const [selectedRole, setSelectedRole] = useState('CA Articleship Trainee (Direct & Indirect Tax)');
  const [appForm, setAppForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Ahmedabad',
    position: 'CA Articleship Trainee (Direct & Indirect Tax)',
    icaiRegNo: '',
    groupsStatus: 'Both Groups Cleared',
    experienceYears: 'Fresher (Articleship)',
    portfolioLink: '',
    coverNote: '',
  });

  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'CA Articleship & Careers Portal | Shree Chamunda Associates',
    description: 'Join Shree Chamunda Associates in Ahmedabad: ICAI-regulated CA Articleship training, Semi-Qualified CA audit roles, and Senior Accountant career opportunities.',
  });

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
        message: `Position: ${appForm.position}\nCity: ${appForm.city}\nICAI / Registration #: ${appForm.icaiRegNo || 'N/A'}\nGroups Status: ${appForm.groupsStatus}\nExperience: ${appForm.experienceYears}\nPortfolio / LinkedIn / Resume: ${appForm.portfolioLink || 'N/A'}\nCover Note: ${appForm.coverNote}`,
        serviceInterest: `Career Application - ${appForm.position}`,
      });

      setFormStatus({ loading: false, success: true, error: null });
      setAppForm({
        name: '',
        email: '',
        phone: '',
        city: 'Ahmedabad',
        position: selectedRole,
        icaiRegNo: '',
        groupsStatus: 'Both Groups Cleared',
        experienceYears: 'Fresher (Articleship)',
        portfolioLink: '',
        coverNote: '',
      });
    } catch (err) {
      setFormStatus({
        loading: false,
        success: false,
        error: err.message || 'Application submission failed. Please email your CV directly to shreechamundaassociates0905@gmail.com.',
      });
    }
  };

  return (
    <div className="careers-page fade-in">
      {/* 1. HERO BANNER */}
      <section className="careers-hero" aria-labelledby="careers-hero-title">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="careers-hero-glow glow-gold" aria-hidden="true"></div>
        <div className="careers-hero-glow glow-blue" aria-hidden="true"></div>

        <div className="container">
          <div className="careers-hero-badge">
            <span className="live-dot pulse"></span>
            <i className="fas fa-graduation-cap"></i>
            <span>ICAI-REGULATED PRACTICE &bull; CAREERS &amp; ARTICLESHIP</span>
          </div>

          <h1 id="careers-hero-title">
            Architect Your Future in <span className="hero-gradient-text">Chartered Tax Practice</span>
          </h1>

          <p className="careers-hero-lead">
            Practice at the forefront of Indian tax jurisprudence. Work alongside senior partners defending high-stakes corporate scrutiny, structuring cross-border entities, and building digital compliance architecture.
          </p>

          <div className="careers-trust-chips">
            <div className="trust-chip-item">
              <i className="fas fa-certificate text-gold"></i>
              <span>Regulation 43 &amp; 45 Compliant</span>
            </div>
            <span className="chip-sep">&bull;</span>
            <div className="trust-chip-item">
              <i className="fas fa-book-open-reader text-emerald"></i>
              <span>Guaranteed CA Final Study Leave</span>
            </div>
            <span className="chip-sep">&bull;</span>
            <div className="trust-chip-item">
              <i className="fas fa-user-tie text-blue"></i>
              <span>Direct Partner Mentorship</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CHAMUNDA PRACTICE PROMISE */}
      <section className="container careers-pillars-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-award"></i>
            <span>WHY TRAIN WITH US</span>
          </span>
          <h2>The Four Pillars of Our Professional Culture</h2>
          <p className="section-subtext">We believe the best Chartered Accountants are forged through deep courtroom litigation exposure, not repetitive clerical bookkeeping.</p>
        </div>

        <div className="careers-pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-scale-balanced"></i></div>
            <h4>High-Stakes Scrutiny Defense</h4>
            <p>Draft legal replies for Section 148 reassessments, ASMT-10 mismatch notices, and CIT(Appeals) submissions backed by Supreme Court precedents.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-network-wired"></i></div>
            <h4>Digital-First Vault Practice</h4>
            <p>Work on cloud accounting infrastructure, automated GSTR-2B reconciliation engines, and 256-bit encrypted client repositories.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-user-graduate"></i></div>
            <h4>Dedicated Exam Support</h4>
            <p>We honor ICAI study leave guidelines without compromise. Trainees receive structured leave allowances to prepare thoroughly for CA Final examinations.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-stairs"></i></div>
            <h4>Meritocratic Partner Track</h4>
            <p>We do not treat qualified accountants as transactional wage earners. Top performers have a clear equity path toward salaried and equity partnership.</p>
          </div>
        </div>
      </section>

      {/* 3. OPEN POSITIONS DIRECTORY */}
      <section className="container careers-openings-section">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="section-header-centered">
          <span className="about-eyebrow-tag">
            <i className="fas fa-briefcase"></i>
            <span>IMMEDIATE VACANCIES &bull; AHMEDABAD CHAMBERS</span>
          </span>
          <h2>Open Opportunities</h2>
          <p className="section-subtext">Explore current career openings for articleship trainees, semi-qualified accountants, and qualified CAs.</p>
        </div>

        <div className="openings-stack">
          {OPEN_POSITIONS.map((job) => (
            <div key={job.id} className="opening-card">
              <div className="opening-header">
                <div className="opening-title-group">
                  <span className="opening-badge">{job.badge}</span>
                  <h3 className="opening-title">{job.title}</h3>
                  <div className="opening-meta-row">
                    <span><i className="fas fa-building"></i> {job.department}</span>
                    <span>&bull;</span>
                    <span><i className="fas fa-briefcase"></i> {job.type}</span>
                    <span>&bull;</span>
                    <span><i className="fas fa-location-dot"></i> Nikol, Ahmedabad</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-apply-job"
                  onClick={() => handleApplyClick(job.title)}
                >
                  <span>Apply Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>

              <p className="opening-desc">{job.summary}</p>

              <div className="opening-specs-grid">
                <div className="spec-box">
                  <span className="spec-label">Eligibility Criteria</span>
                  <strong className="spec-val">{job.eligibility}</strong>
                </div>

                <div className="spec-box">
                  <span className="spec-label">Compensation &amp; Stipend</span>
                  <strong className="spec-val text-emerald">{job.stipend}</strong>
                </div>
              </div>

              <div className="opening-bullets">
                <span className="bullets-title">Key Professional Exposure:</span>
                <ul>
                  {job.exposure.map((exp, idx) => (
                    <li key={idx}><i className="fas fa-check-circle text-gold"></i> {exp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ONLINE APPLICATION INTAKE FORM */}
      <section className="container application-form-section" id="application-intake-form">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="app-form-wrapper">
          <div className="app-form-header">
            <span className="about-eyebrow-tag">
              <i className="fas fa-id-card"></i>
              <span>DIRECT RECRUITMENT DESK</span>
            </span>
            <h2>Submit Your Candidacy</h2>
            <p>Complete the intake details below. Our Managing Partners review all qualified resumes within 48 hours.</p>
          </div>

          {formStatus.success && (
            <div className="app-success-banner">
              <i className="fas fa-check-circle"></i>
              <div>
                <strong>Application Successfully Dispatched!</strong>
                <p>Thank you for applying to Shree Chamunda Associates. Our recruitment desk will contact you to schedule an in-person interview at our Nikol chambers.</p>
              </div>
            </div>
          )}

          {formStatus.error && (
            <div className="app-error-banner">
              <i className="fas fa-exclamation-circle"></i>
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
                  onChange={(e) => setAppForm({ ...appForm, position: e.target.value })}
                  className="careers-select"
                >
                  {OPEN_POSITIONS.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value="General Professional Application">General Professional Application</option>
                </select>
              </div>

              <div className="careers-input-group">
                <label htmlFor="cICAI">ICAI Student / Membership Number (If applicable)</label>
                <input
                  type="text"
                  id="cICAI"
                  value={appForm.icaiRegNo}
                  onChange={(e) => setAppForm({ ...appForm, icaiRegNo: e.target.value })}
                  placeholder="e.g. WRO0654321"
                  className="careers-input"
                />
              </div>
            </div>

            <div className="form-row-split">
              <div className="careers-input-group">
                <label htmlFor="cGroups">CA Qualification / Attempt Status</label>
                <select
                  id="cGroups"
                  value={appForm.groupsStatus}
                  onChange={(e) => setAppForm({ ...appForm, groupsStatus: e.target.value })}
                  className="careers-select"
                >
                  <option value="CA Inter - Both Groups Cleared">CA Inter - Both Groups Cleared</option>
                  <option value="CA Inter - Group 1 Cleared">CA Inter - Group 1 Cleared</option>
                  <option value="CA Inter - Group 2 Cleared">CA Inter - Group 2 Cleared</option>
                  <option value="Qualified CA Member (FCA / ACA)">Qualified CA Member (FCA / ACA)</option>
                  <option value="B.Com / M.Com Graduate">B.Com / M.Com Graduate</option>
                </select>
              </div>

              <div className="careers-input-group">
                <label htmlFor="cExp">Relevant Practice Experience</label>
                <select
                  id="cExp"
                  value={appForm.experienceYears}
                  onChange={(e) => setAppForm({ ...appForm, experienceYears: e.target.value })}
                  className="careers-select"
                >
                  <option value="Fresher (Seeking Articleship)">Fresher (Seeking Articleship)</option>
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
              <span className="input-hint">Ensure sharing permissions are set to "Anyone with the link can view".</span>
            </div>

            <div className="careers-input-group">
              <label htmlFor="cCover">Professional Statement / Why Shree Chamunda Associates?</label>
              <textarea
                id="cCover"
                rows="4"
                value={appForm.coverNote}
                onChange={(e) => setAppForm({ ...appForm, coverNote: e.target.value })}
                placeholder="Briefly state your academic accomplishments, software proficiency (Tally, Computax, Excel), and career goals..."
                className="careers-textarea"
              ></textarea>
            </div>

            <button type="submit" className="btn-submit-candidacy" disabled={formStatus.loading}>
              {formStatus.loading ? (
                <span><i className="fas fa-spinner fa-spin"></i> Transmitting Application...</span>
              ) : (
                <span>Submit Application to Managing Partner <i className="fas fa-arrow-right"></i></span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 5. DIRECT HR DESK */}
      <section className="container careers-contact-strip">
        <div className="section-top-accent-line" aria-hidden="true"></div>
        <div className="hr-contact-card">
          <div className="hr-left">
            <i className="fas fa-location-dot text-gold"></i>
            <div>
              <strong>In-Person Walk-In &amp; Interviews</strong>
              <span>612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad - 380049</span>
            </div>
          </div>

          <div className="hr-right">
            <span>Direct Recruitment Helpline:</span>
            <strong><a href="tel:+919510984735">+91 95109 84735</a></strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
